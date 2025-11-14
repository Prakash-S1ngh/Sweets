import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import sweetsRouter from './routes/sweets';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/sweets', sweetsRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Sweet Shop API' });
});

export default app;
