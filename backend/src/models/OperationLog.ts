import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class OperationLog extends Model {
  declare id: string;
  declare userId: string;
  declare enterpriseId: string | null;
  declare action: string;
  declare timestamp: Date;
}

OperationLog.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  enterpriseId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'OperationLog',
});
