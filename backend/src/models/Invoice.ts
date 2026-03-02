import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Enterprise } from './Enterprise';

export class Invoice extends Model {
  declare id: string;
  declare invoiceCode: string;
  declare invoiceNumber: string;
  declare date: string;
  declare amount: number; // 不含税金额
  declare taxAmount: number;
  declare totalAmount: number;
  declare checkCode: string | null;
  declare type: 'INPUT' | 'OUTPUT';
  declare enterpriseId: string;
  declare dueDate: string | null;
}

Invoice.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoiceCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  checkCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('INPUT', 'OUTPUT'),
    allowNull: false,
  },
  enterpriseId: {
    type: DataTypes.UUID,
    references: { model: Enterprise, key: 'id' },
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Invoice',
});

Invoice.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });
Enterprise.hasMany(Invoice, { foreignKey: 'enterpriseId' });
