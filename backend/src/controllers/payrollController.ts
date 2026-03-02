import { Response } from 'express';
import { EnterpriseRequest } from '../middleware/enterprise';
import { Employee } from '../models/Employee';
import { Salary } from '../models/Salary';
import { TAX_RATES } from '@sme-finance/shared';

export const createEmployee = async (req: EnterpriseRequest, res: Response) => {
  const { name, idCardNumber, joinDate, position, baseSalary, socialSecurityBase, providentFundBase } = req.body;
  const enterpriseId = req.enterpriseId;

  try {
    const employee = await Employee.create({
      name, idCardNumber, joinDate, position, baseSalary, socialSecurityBase, providentFundBase, enterpriseId
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create employee' });
  }
};

export const listEmployees = async (req: EnterpriseRequest, res: Response) => {
  const enterpriseId = req.enterpriseId;
  try {
    const employees = await Employee.findAll({ where: { enterpriseId } });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const calculateSalary = async (req: EnterpriseRequest, res: Response) => {
  const { employeeId, month, performance, personalSocialSecurity, personalProvidentFund } = req.body;

  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const grossSalary = Number(employee.baseSalary) + Number(performance || 0);
    const taxableIncome = grossSalary - personalSocialSecurity - personalProvidentFund - TAX_RATES.IIT_THRESHOLD;

    // Simplified monthly IIT calculation
    let iit = 0;
    if (taxableIncome > 0) {
      if (taxableIncome <= 3000) iit = taxableIncome * 0.03;
      else if (taxableIncome <= 12000) iit = taxableIncome * 0.1 - 210;
      else if (taxableIncome <= 25000) iit = taxableIncome * 0.2 - 1410;
      else iit = taxableIncome * 0.25 - 2660; // Simplified for this scale
    }

    const netSalary = grossSalary - personalSocialSecurity - personalProvidentFund - iit;

    const salary = await Salary.create({
      employeeId, month, baseSalary: employee.baseSalary, performance,
      personalSocialSecurity, personalProvidentFund, personalIncomeTax: iit,
      netSalary
    });

    res.status(201).json(salary);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to calculate/save salary' });
  }
};
