// Simulate an API call with a delay
export const predictLoanDefault = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Very simple mock logic just for demonstration
      // In a real scenario, this would be a fetch/axios call to a Flask/FastAPI backend
      
      const { income, loanAmount, creditScore, dtiRatio } = formData;
      
      // Basic heuristic just to generate varied results
      let riskScore = 0;
      
      if (creditScore < 600) riskScore += 30;
      if (creditScore >= 750) riskScore -= 20;
      
      if (dtiRatio > 0.4) riskScore += 25;
      if (dtiRatio < 0.2) riskScore -= 10;
      
      if (loanAmount > income * 0.5) riskScore += 20;
      
      // Add some randomness
      riskScore += Math.floor(Math.random() * 20);
      
      // Clamp between 1 and 99
      riskScore = Math.max(1, Math.min(99, riskScore + 20)); // Base risk 20
      
      const defaultPrediction = riskScore > 50 ? 1 : 0;
      
      resolve({
        prediction: defaultPrediction,
        confidence: defaultPrediction === 1 ? riskScore : 100 - riskScore,
        message: defaultPrediction === 1 
          ? "High Risk of Default Detected" 
          : "Low Risk - Likely to Repay",
        factors: [
          creditScore < 650 ? "Low credit score impacts negatively." : "Good credit score.",
          dtiRatio > 0.35 ? "High Debt-to-Income ratio." : "Healthy DTI ratio.",
          loanAmount > income * 0.4 ? "High loan amount relative to income." : "Manageable loan amount."
        ]
      });
    }, 2500); // 2.5s delay to show loading animation
  });
};
