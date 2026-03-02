import { Response, NextFunction } from 'express';
import { EnterpriseRequest } from './enterprise';
import { OperationLog } from '../models/OperationLog';

export const logOperation = async (req: EnterpriseRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const enterpriseId = req.enterpriseId || req.headers['x-enterprise-id'] as string;
  const action = `${req.method} ${req.originalUrl}`;

  if (userId) {
    try {
      await OperationLog.create({
        userId,
        enterpriseId: enterpriseId || null,
        action,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to log operation:', error);
    }
  }

  next();
};
