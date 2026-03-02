import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Enterprise } from '../models/Enterprise';
import { UserEnterpriseRole } from '../models/UserEnterpriseRole';
import { Role } from '@sme-finance/shared';

export const createEnterprise = async (req: AuthRequest, res: Response) => {
  const { name, type, taxId, province, city, industry } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const enterprise = await Enterprise.create({ name, type, taxId, province, city, industry });
    await UserEnterpriseRole.create({ userId, enterpriseId: enterprise.id, role: Role.ADMIN });
    res.status(201).json(enterprise);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create enterprise' });
  }
};

export const listEnterprises = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const roles = await UserEnterpriseRole.findAll({
      where: { userId },
      include: [{ model: Enterprise }],
    });

    // Simplistic mapping for now
    const enterprises = roles.map((r: any) => ({
      ...r.Enterprise.toJSON(),
      userRole: r.role
    }));

    res.json(enterprises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
