import { EnterpriseType, TAX_RATES } from '@sme-finance/shared';

export interface TaxCalculationResult {
  vatAmount: number;
  citySurtax: number;
  educationSurcharge: number;
  localEducationSurcharge: number;
  totalTax: number;
}

export const calculateVATAndSurtaxes = (
  amount: number,
  enterpriseType: EnterpriseType,
  cityType: 'URBAN' | 'COUNTY' | 'OTHER',
  isTaxInclusive: boolean = true
): TaxCalculationResult => {
  let vatAmount = 0;
  let netAmount = amount;

  if (enterpriseType === EnterpriseType.SMALL_SCALE_TAXPAYER || enterpriseType === EnterpriseType.SOLE_PROPRIETOR) {
    // 2027-12-31 deadline: 1% rate for small scale
    if (isTaxInclusive) {
      netAmount = amount / (1 + TAX_RATES.VAT_SMALL_SCALE);
      vatAmount = amount - netAmount;
    } else {
      vatAmount = amount * TAX_RATES.VAT_SMALL_SCALE;
    }

    // Monthly revenue <= 100k (Quarterly <= 300k) exemption
    if (netAmount <= TAX_RATES.VAT_FREE_THRESHOLD) {
      vatAmount = 0;
    }
  } else {
    // General Taxpayer logic: (Output - Input) usually,
    // but for simple calculation here we use a fixed rate or handle it in transactions.
    // For now, assume amount is already the VAT component if general taxpayer,
    // or calculate based on a simplified model for the purpose of this engine.
    // REAL WORLD: This would be the (Output VAT - Input VAT) from the ledger.
    vatAmount = amount; // Placeholder: caller should pass net VAT for general taxpayers.
  }

  const surtaxRate = cityType === 'URBAN' ? TAX_RATES.SURTAX_CITY_URBAN :
                    cityType === 'COUNTY' ? TAX_RATES.SURTAX_CITY_COUNTY :
                    TAX_RATES.SURTAX_CITY_OTHER;

  let citySurtax = vatAmount * surtaxRate;
  let educationSurcharge = vatAmount * TAX_RATES.EDUCATION_SURCHARGE;
  let localEducationSurcharge = vatAmount * TAX_RATES.LOCAL_EDUCATION_SURCHARGE;

  // Surtax exemptions for SMEs: Quarterly revenue <= 300k exempt from surtaxes
  // Or 50% discount on surtaxes for small/micro enterprises (effective until 2027)
  // Here we apply the 50% discount as a general rule for this software's target users.
  citySurtax *= 0.5;
  educationSurcharge *= 0.5;
  localEducationSurcharge *= 0.5;

  return {
    vatAmount,
    citySurtax,
    educationSurcharge,
    localEducationSurcharge,
    totalTax: vatAmount + citySurtax + educationSurcharge + localEducationSurcharge
  };
};
