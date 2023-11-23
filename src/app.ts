import express, { Application } from 'express';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
// import cors from 'cors';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// app.use(cors())

// Connect to MongoDB
connectDB();

// Routes
app.use(userRoutes);
app.use(orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
