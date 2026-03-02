import { calculateEIT, calculateSoleProprietorIIT } from '../utils/incomeTaxEngine';

describe('Income Tax Engine', () => {
  it('should calculate 5% EIT for small/low-profit enterprises', () => {
    // 1,000,000 profit -> 50,000 tax
    expect(calculateEIT(1000000)).toBeCloseTo(50000, 0);
    // 3,000,000 profit -> 150,000 tax
    expect(calculateEIT(3000000)).toBeCloseTo(150000, 0);
    // 4,000,000 profit -> 1,000,000 tax (25%)
    expect(calculateEIT(4000000)).toBeCloseTo(1000000, 0);
  });

  it('should calculate Sole Proprietor IIT with 50% discount for <= 2M', () => {
    // Taxable Income: 100,000
    // (100k * 20% - 10,500) = 20k - 10.5k = 9.5k
    // 50% discount = 4,750
    expect(calculateSoleProprietorIIT(100000)).toBeCloseTo(4750, 0);

    // Taxable Income: 2,100,000
    // (2.1M * 35% - 65,500) = 735,000 - 65,500 = 669,500
    // No discount for > 2M
    expect(calculateSoleProprietorIIT(2100000)).toBeCloseTo(669500, 0);
  });
});
