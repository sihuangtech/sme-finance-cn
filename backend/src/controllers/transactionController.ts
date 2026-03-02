import { Response } from 'express';
import { EnterpriseRequest } from '../middleware/enterprise';
import { Transaction } from '../models/Transaction';
import { TransactionType } from '@sme-finance/shared';

export const createTransaction = async (req: EnterpriseRequest, res: Response) => {
  const { date, amount, type, category, invoiceNumber, isTaxInclusive, notes } = req.body;
  const enterpriseId = req.enterpriseId;

  try {
    const transaction = await Transaction.create({
      date, amount, type, category, invoiceNumber, isTaxInclusive, notes, enterpriseId
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create transaction' });
  }
};

export const listTransactions = async (req: EnterpriseRequest, res: Response) => {
  const enterpriseId = req.enterpriseId;
  const { startDate, endDate, type } = req.query;

  const where: any = { enterpriseId };
  if (startDate && endDate) {
    where.date = { [require('sequelize').Op.between]: [startDate, endDate] };
  }
  if (type) {
    where.type = type;
  }

  try {
    const transactions = await Transaction.findAll({ where, order: [['date', 'DESC']] });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
