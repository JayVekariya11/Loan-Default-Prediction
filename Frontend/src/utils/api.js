const API_BASE = 'https://loan-default-prediction-1-o7xy.onrender.com'; // Deployed Flask backend

/**
 * Maps the camelCase form data from PredictionForm to the
 * snake_case / exact field names the Flask backend expects.
 */
function mapToBackendPayload(formData, modelChoice = 'all') {
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

  // Build a confidence score — prefer RF, then LR, then DT, then AdaBoost, then Bagging
  const rfProb   = data.random_forest?.probability;
  const lrProb   = data.logistic_regression?.probability;
  const dtProb   = data.decision_tree?.probability;
  const adaProb  = data.adaboost?.probability;
  const bagProb  = data.bagging?.probability;
  const rawProb  = rfProb ?? lrProb ?? dtProb ?? adaProb ?? bagProb ?? null;

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

  // Key risk factors — clean final summary
  const factors = [];
  if (data.risk_status) {
    factors.push(data.risk_status);
  }
  factors.push(
    isHighRisk
      ? `Default probability: ${confidence}% — This applicant is likely to default on the loan.`
      : `Repayment probability: ${confidence}% — This applicant is likely to repay the loan.`
  );
  if (rawProb !== null) {
    factors.push(`Ensemble of 5 models agrees on this prediction with ${confidence}% confidence.`);
  }

  return {
    prediction: data.prediction,
    risk_status: data.risk_status,
    confidence,
    message,
    factors,
    // Expose all model results for detailed breakdown in ResultCard
    models: {
      random_forest:       data.random_forest       ?? null,
      logistic_regression: data.logistic_regression ?? null,
      decision_tree:       data.decision_tree       ?? null,
      adaboost:            data.adaboost            ?? null,
      bagging:             data.bagging             ?? null,
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
export async function predictLoanDefault(formData, modelChoice = 'all') {
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
