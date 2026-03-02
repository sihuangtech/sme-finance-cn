import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Role } from '@sme-finance/shared';
import { User } from './User';
import { Enterprise } from './Enterprise';

export class UserEnterpriseRole extends Model {
  declare userId: string;
  declare enterpriseId: string;
  declare role: Role;
  declare Enterprise?: Enterprise;
}

UserEnterpriseRole.init({
  userId: {
    type: DataTypes.UUID,
    references: { model: User, key: 'id' },
    primaryKey: true,
  },
  enterpriseId: {
    type: DataTypes.UUID,
    references: { model: Enterprise, key: 'id' },
    primaryKey: true,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(Role)),
    allowNull: false,
    defaultValue: Role.ADMIN,
  },
}, {
  sequelize,
  modelName: 'UserEnterpriseRole',
});

User.belongsToMany(Enterprise, { through: UserEnterpriseRole, foreignKey: 'userId' });
Enterprise.belongsToMany(User, { through: UserEnterpriseRole, foreignKey: 'enterpriseId' });
UserEnterpriseRole.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });
Enterprise.hasMany(UserEnterpriseRole, { foreignKey: 'enterpriseId' });
