import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import sweetsRouter from './routes/sweets';
import ordersRouter from './routes/orders';
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/sweets', sweetsRouter);
app.use('/api/orders', ordersRouter);

app.get('/', ()=>{
    console.log(`Server running on port ${process.env.PORT || 4000}`);
    
});

export default app;
