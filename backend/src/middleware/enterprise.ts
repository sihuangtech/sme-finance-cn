import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UserEnterpriseRole } from '../models/UserEnterpriseRole';
import { Role } from '@sme-finance/shared';
import { Enterprise } from '../models/Enterprise';

export interface EnterpriseRequest extends AuthRequest {
  enterpriseId?: string;
  userRole?: Role;
}

export const checkEnterpriseAccess = (requiredRoles?: Role[]) => {
  return async (req: EnterpriseRequest, res: Response, next: NextFunction) => {
    const enterpriseId = req.headers['x-enterprise-id'] as string;
    const userId = req.user?.id;

    if (!enterpriseId || !userId) {
      return res.status(400).json({ error: 'Enterprise ID or User ID missing' });
    }

    try {
      const userRoleRecord = await UserEnterpriseRole.findOne({
        where: { userId, enterpriseId },
      });

      if (!userRoleRecord) {
        return res.status(403).json({ error: 'Forbidden: No access to this enterprise' });
      }

      if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRoleRecord.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      req.enterpriseId = enterpriseId;
      req.userRole = userRoleRecord.role;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
};
