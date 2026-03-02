import express from 'express';
import * as authController from '../controllers/authController';
import * as enterpriseController from '../controllers/enterpriseController';
import * as transactionController from '../controllers/transactionController';
import * as invoiceController from '../controllers/invoiceController';
import * as payrollController from '../controllers/payrollController';
import * as bankController from '../controllers/bankController';
import * as reportController from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { checkEnterpriseAccess } from '../middleware/enterprise';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/enterprises', authenticate, enterpriseController.createEnterprise);
router.get('/enterprises', authenticate, enterpriseController.listEnterprises);

// Transactions
router.post('/transactions', authenticate, checkEnterpriseAccess(), transactionController.createTransaction);
router.get('/transactions', authenticate, checkEnterpriseAccess(), transactionController.listTransactions);

// Invoices
router.post('/invoice/scan', authenticate, checkEnterpriseAccess(), invoiceController.scanInvoice);
router.post('/invoices', authenticate, checkEnterpriseAccess(), invoiceController.createInvoice);
router.get('/invoices', authenticate, checkEnterpriseAccess(), invoiceController.listInvoices);

// Payroll
router.post('/employees', authenticate, checkEnterpriseAccess(), payrollController.createEmployee);
router.get('/employees', authenticate, checkEnterpriseAccess(), payrollController.listEmployees);
router.post('/salaries', authenticate, checkEnterpriseAccess(), payrollController.calculateSalary);

// Bank
router.post('/bank/import', authenticate, checkEnterpriseAccess(), bankController.importBankStatement);

// Reports
router.get('/reports/profit-loss', authenticate, checkEnterpriseAccess(), reportController.getProfitLoss);
router.get('/reports/balance-sheet', authenticate, checkEnterpriseAccess(), reportController.getBalanceSheet);

export default router;
