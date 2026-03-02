export const calculateEIT = (annualProfit: number): number => {
  if (annualProfit <= 0) return 0;
  // Small and low-profit enterprises (小型微利企业):
  // 1. Annual taxable income <= 3M
  // 2. Headcount <= 300
  // 3. Assets <= 50M
  // Current policy (until 2027): 25% * 20% = 5% effective rate for entire amount <= 3M
  if (annualProfit <= 3000000) {
    return annualProfit * 0.05;
  }
  // Normal rate for others: 25%
  return annualProfit * 0.25;
};

export const calculateSoleProprietorIIT = (annualIncome: number): number => {
  if (annualIncome <= 0) return 0;

  // Annual taxable income = total income - cost - expenses - 60k (basic allowance)
  // Here we assume taxable income is passed to the engine.
  // Five-level progressive rates:
  // 1. <= 30k: 5% (0)
  // 2. 30k - 90k: 10% (1,500)
  // 3. 90k - 300k: 20% (10,500)
  // 4. 300k - 500k: 30% (40,500)
  // 5. > 500k: 35% (65,500)

  let iit = 0;
  if (annualIncome <= 30000) {
    iit = annualIncome * 0.05;
  } else if (annualIncome <= 90000) {
    iit = annualIncome * 0.1 - 1500;
  } else if (annualIncome <= 300000) {
    iit = annualIncome * 0.2 - 10500;
  } else if (annualIncome <= 500000) {
    iit = annualIncome * 0.3 - 40500;
  } else {
    iit = annualIncome * 0.35 - 65500;
  }

  // Current policy (until 2027): 50% discount on IIT for annual taxable income <= 2M
  if (annualIncome <= 2000000) {
    iit *= 0.5;
  }

  return iit;
};
