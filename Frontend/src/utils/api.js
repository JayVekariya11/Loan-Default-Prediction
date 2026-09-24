const API_BASE = '/api'; // proxied to http://localhost:5000 by Vite

/**
 * Maps the camelCase form data from PredictionForm to the
 * snake_case / exact field names the Flask backend expects.
 */
function mapToBackendPayload(formData, modelChoice = 'both') {
  return {
    model: modelChoice,
    // Numeric fields
    Age: Number(formData.age),
    Income: Number(formData.income),
    LoanAmount: Number(formData.loanAmount),
    CreditScore: Number(formData.creditScore),
    MonthsEmployed: Number(formData.monthsEmployed),
    NumCreditLines: Number(formData.numCreditLines),
    InterestRate: Number(formData.interestRate),
    LoanTerm: Number(formData.loanTerm),
    DTIRatio: Number(formData.dtiRatio),
    // Categorical fields
    Education: formData.education,
    EmploymentType: formData.employmentType,
    MaritalStatus: formData.maritalStatus,
    HasMortgage: formData.hasMortgage,
    HasDependents: formData.hasDependents,
    LoanPurpose: formData.loanPurpose,
    HasCoSigner: formData.hasCoSigner,
  };
}

/**
 * Converts the Flask response into the shape ResultCard expects:
 *  { prediction, confidence, message, factors, models, risk_status }
 */
function normaliseResponse(data) {
  const isHighRisk = data.prediction === 1;

  // Build a confidence score. Use RF probability if available, else logistic.
  const rfProb = data.random_forest?.probability;
  const lrProb = data.logistic_regression?.probability;
  const rawProb = rfProb ?? lrProb ?? null;

  // probability is P(default). For high risk, confidence = that value;
  // for low risk, confidence = 1 - probability.
  let confidence = 50;
  if (rawProb !== null) {
    confidence = isHighRisk
      ? Math.round(rawProb * 100)
      : Math.round((1 - rawProb) * 100);
  }

  // Build a summary message
  const message = isHighRisk
    ? 'High Risk of Default Detected'
    : 'Low Risk — Likely to Repay';

  // Key risk factors derived from returned probabilities
  const factors = [];

  if (data.random_forest) {
    const rfPct = data.random_forest.probability != null
      ? `${Math.round(data.random_forest.probability * 100)}%`
      : 'N/A';
    factors.push(`Random Forest default probability: ${rfPct}`);
  }
  if (data.logistic_regression) {
    const lrPct = data.logistic_regression.probability != null
      ? `${Math.round(data.logistic_regression.probability * 100)}%`
      : 'N/A';
    factors.push(`Logistic Regression default probability: ${lrPct}`);
  }
  if (factors.length === 0) {
    factors.push(isHighRisk
      ? 'Model predicts a high likelihood of default.'
      : 'Model predicts a low likelihood of default.');
  }

  return {
    prediction: data.prediction,
    risk_status: data.risk_status,
    confidence,
    message,
    factors,
    // Expose raw model results for any future detailed view
    models: {
      random_forest: data.random_forest ?? null,
      logistic_regression: data.logistic_regression ?? null,
    },
  };
}

/**
 * Sends loan application data to the Flask backend and returns
 * a normalised prediction result.
 *
 * @param {object} formData   - Data from PredictionForm (camelCase)
 * @param {string} modelChoice - 'both' | 'logistic' | 'random_forest'
 * @returns {Promise<object>} - Normalised result for ResultCard
 */
export async function predictLoanDefault(formData, modelChoice = 'both') {
  const payload = mapToBackendPayload(formData, modelChoice);

  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errMsg = `Server error (${response.status})`;
    try {
      const errBody = await response.json();
      if (errBody?.error) errMsg = errBody.error;
    } catch (_) {/* ignore */}
    throw new Error(errMsg);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Prediction failed.');
  }

  return normaliseResponse(data);
}
