import { Response } from 'express';
import { EnterpriseRequest } from '../middleware/enterprise';
import { Transaction } from '../models/Transaction';
import { TransactionType } from '@sme-finance/shared';

export const importBankStatement = async (req: EnterpriseRequest, res: Response) => {
  const { bankType, data } = req.body; // data is an array of objects from CSV/Excel
  const enterpriseId = req.enterpriseId;

  if (!Array.isArray(data)) return res.status(400).json({ error: 'Invalid data format' });

  try {
    const results = await Promise.all(data.map(async (row) => {
      // Logic to map bank-specific columns to our Transaction model
      // This varies by bank (ICBC, CCB, Alipay, etc.)
      // For this implementation, we assume a semi-standardized mapper or pre-processed format
      const date = row.date || row.交易日期;
      const amount = Math.abs(parseFloat(row.amount || row.金额));
      const type = (parseFloat(row.amount || row.金额) > 0) ? TransactionType.INCOME : TransactionType.EXPENSE;
      const category = row.category || '未分类';
      const notes = row.notes || row.备注 || row.交易摘要;

      // Check for duplicates (simplified: same date, amount, and notes)
      const existing = await Transaction.findOne({
        where: { enterpriseId, date, amount, notes }
      });

      return {
        ...row,
        matched: !!existing,
        existingId: existing?.id,
        suggestedType: type,
        suggestedAmount: amount,
        suggestedDate: date
      };
    }));

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process bank statement' });
  }
};
