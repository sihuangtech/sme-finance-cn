import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { TransactionType } from '@sme-finance/shared';
import { Enterprise } from './Enterprise';

export class Transaction extends Model {
  declare id: string;
  declare date: string;
  declare amount: number;
  declare type: TransactionType;
  declare category: string;
  declare invoiceNumber: string | null;
  declare isTaxInclusive: boolean;
  declare notes: string | null;
  declare enterpriseId: string;
}

Transaction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(TransactionType)),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isTaxInclusive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  enterpriseId: {
    type: DataTypes.UUID,
    references: { model: Enterprise, key: 'id' },
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Transaction',
});

Transaction.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });
Enterprise.hasMany(Transaction, { foreignKey: 'enterpriseId' });
