import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { EnterpriseType } from '@sme-finance/shared';

export class Enterprise extends Model {
  declare id: string;
  declare name: string;
  declare type: EnterpriseType;
  declare taxId: string;
  declare province: string;
  declare city: string;
  declare industry: string;
}

Enterprise.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(EnterpriseType)),
    allowNull: false,
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Enterprise',
});
