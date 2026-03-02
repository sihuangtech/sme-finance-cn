import { Response } from 'express';
import { EnterpriseRequest } from '../middleware/enterprise';
import { Invoice } from '../models/Invoice';

export const scanInvoice = async (req: EnterpriseRequest, res: Response) => {
  const { qrString } = req.body;
  if (!qrString) {
    return res.status(400).json({ error: 'QR string is required' });
  }

  // Format: 01,发票代码,发票号码,开票日期,不含税金额,校验码
  const parts = qrString.split(',');
  if (parts.length < 6) {
    return res.status(400).json({ error: 'Invalid invoice QR format' });
  }

  const [version, invoiceCode, invoiceNumber, dateStr, amountStr, checkCode] = parts;

  // Date format: YYYYMMDD -> YYYY-MM-DD
  const date = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  const amount = parseFloat(amountStr);

  res.json({
    invoiceCode,
    invoiceNumber,
    date,
    amount,
    checkCode,
  });
};

export const createInvoice = async (req: EnterpriseRequest, res: Response) => {
  const { invoiceCode, invoiceNumber, date, amount, taxAmount, totalAmount, checkCode, type, dueDate } = req.body;
  const enterpriseId = req.enterpriseId;

  try {
    const invoice = await Invoice.create({
      invoiceCode, invoiceNumber, date, amount, taxAmount, totalAmount, checkCode, type, enterpriseId, dueDate
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create invoice' });
  }
};

export const listInvoices = async (req: EnterpriseRequest, res: Response) => {
  const enterpriseId = req.enterpriseId;
  const { type } = req.query;

  const where: any = { enterpriseId };
  if (type) where.type = type;

  try {
    const invoices = await Invoice.findAll({ where, order: [['date', 'DESC']] });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
