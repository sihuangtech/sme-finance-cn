export enum EnterpriseType {
  SOLE_PROPRIETOR = 'SOLE_PROPRIETOR', // 个体工商户
  SMALL_SCALE_TAXPAYER = 'SMALL_SCALE_TAXPAYER', // 小规模纳税人
  GENERAL_TAXPAYER = 'GENERAL_TAXPAYER', // 一般纳税人
}

export enum Role {
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  VIEWER = 'VIEWER',
}

export interface Enterprise {
  id: string;
  name: string;
  type: EnterpriseType;
  taxId: string;
  province: string;
  city: string;
  industry: string;
}

export interface User {
  id: string;
  username: string;
  role: Role;
}

export const TAX_RATES = {
  VAT_SMALL_SCALE: 0.01, // 优惠至2027年底
  VAT_FREE_THRESHOLD: 100000, // 月销售额
  SURTAX_CITY_URBAN: 0.07,
  SURTAX_CITY_COUNTY: 0.05,
  SURTAX_CITY_OTHER: 0.01,
  EDUCATION_SURCHARGE: 0.03,
  LOCAL_EDUCATION_SURCHARGE: 0.02,
  IIT_THRESHOLD: 5000,
};

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const CATEGORIES = {
  INCOME: ['销售收入', '服务收入', '利息收入', '其他收入'],
  EXPENSE: ['办公费用', '人工费用', '房租水电', '税费', '差旅费', '招待费', '其他费用'],
};
