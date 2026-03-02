import { calculateVATAndSurtaxes } from '../utils/taxEngine';
import { EnterpriseType } from '@sme-finance/shared';

describe('VAT and Surtaxes Engine', () => {
  it('should calculate 1% VAT for small scale taxpayers and exempt if revenue <= 100k', () => {
    // Exemption case
    let result = calculateVATAndSurtaxes(100000, EnterpriseType.SMALL_SCALE_TAXPAYER, 'URBAN');
    expect(result.vatAmount).toBe(0);
    expect(result.totalTax).toBe(0);

    // Non-exempt case: 1% VAT on ~110,000 net
    // 110,000 / 1.01 = 108,910.89 -> VAT = 1,089.11
    result = calculateVATAndSurtaxes(110000 * 1.01, EnterpriseType.SMALL_SCALE_TAXPAYER, 'URBAN');
    expect(result.vatAmount).toBeCloseTo(1100, 0);
  });

  it('should apply 50% discount to surtaxes', () => {
    // 1% VAT on ~110,000 net -> VAT = 1,100
    // Surtax = 1,100 * 0.07 * 0.5 = 38.5
    const result = calculateVATAndSurtaxes(110000 * 1.01, EnterpriseType.SMALL_SCALE_TAXPAYER, 'URBAN');
    expect(result.citySurtax).toBeCloseTo(38.5, 1);
  });
});
