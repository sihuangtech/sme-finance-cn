import sequelize from './config/database';
import { User } from './models/User';
import { Enterprise } from './models/Enterprise';
import { UserEnterpriseRole } from './models/UserEnterpriseRole';
import { Transaction } from './models/Transaction';
import { OperationLog } from './models/OperationLog';

async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

initDb();
