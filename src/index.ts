import express from 'express';
import cors from 'cors';
import authRoute from './routes/auth';
import { config } from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';

config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Mongoose connected successfully');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(cors({ credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ hello: 'hello world!' });
});

app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
