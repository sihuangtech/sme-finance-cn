import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { logOperation } from './middleware/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logOperation);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import apiRouter from './routes/api';
app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // In production, we'd use migrations. For now, sync.
    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export default app;
