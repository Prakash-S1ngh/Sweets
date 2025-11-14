import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth';

import sweetsRouter from './routes/sweets'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/sweets', sweetsRouter);

app.get('/', ()=>{
    console.log(`Server running on port ${process.env.PORT || 4000}`);
    
});

export default app;
