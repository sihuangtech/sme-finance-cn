import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Employee } from './Employee';

export class Salary extends Model {
  declare id: string;
  declare employeeId: string;
  declare month: string; // YYYY-MM
  declare baseSalary: number;
  declare performance: number;
  declare personalSocialSecurity: number;
  declare personalProvidentFund: number;
  declare personalIncomeTax: number;
  declare netSalary: number;
}

Salary.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.UUID,
    references: { model: Employee, key: 'id' },
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  baseSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  performance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  personalSocialSecurity: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  personalProvidentFund: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  personalIncomeTax: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  netSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Salary',
});

Salary.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasMany(Salary, { foreignKey: 'employeeId' });
