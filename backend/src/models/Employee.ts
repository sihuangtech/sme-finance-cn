import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Enterprise } from './Enterprise';

export class Employee extends Model {
  declare id: string;
  declare name: string;
  declare idCardNumber: string;
  declare joinDate: string;
  declare position: string;
  declare baseSalary: number;
  declare socialSecurityBase: number;
  declare providentFundBase: number;
  declare enterpriseId: string;
}

Employee.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idCardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  joinDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  baseSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  socialSecurityBase: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  providentFundBase: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  enterpriseId: {
    type: DataTypes.UUID,
    references: { model: Enterprise, key: 'id' },
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Employee',
});

Employee.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });
Enterprise.hasMany(Employee, { foreignKey: 'enterpriseId' });
