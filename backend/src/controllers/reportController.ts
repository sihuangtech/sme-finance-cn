import { Response } from 'express';
import { EnterpriseRequest } from '../middleware/enterprise';
import { Transaction } from '../models/Transaction';
import { TransactionType } from '@sme-finance/shared';
import { Op } from 'sequelize';

export const getProfitLoss = async (req: EnterpriseRequest, res: Response) => {
  const enterpriseId = req.enterpriseId;
  const { startDate, endDate } = req.query;

  try {
    const transactions = await Transaction.findAll({
      where: {
        enterpriseId,
        date: { [Op.between]: [startDate, endDate] }
      }
    });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    res.json({
      income,
      expense,
      profit: income - expense,
      period: { startDate, endDate }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate profit & loss report' });
  }
};

export const getBalanceSheet = async (req: EnterpriseRequest, res: Response) => {
  // Simple version: cumulative totals of assets (all income) and liabilities/equity (all expenses)
  const enterpriseId = req.enterpriseId;
  const { date } = req.query;

  try {
    const transactions = await Transaction.findAll({
      where: {
        enterpriseId,
        date: { [Op.lte]: date }
      }
    });

    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    res.json({
      assets: { cash: totalIncome - totalExpense },
      equity: { retainedEarnings: totalIncome - totalExpense },
      liabilities: { accountsPayable: 0 }, // Placeholder
      asOf: date
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate balance sheet' });
  }
};
