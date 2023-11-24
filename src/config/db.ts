import mongoose from 'mongoose';
import dotenv from 'dotenv';
// const MONGODB_URI = "mongodb+srv://user-order:DfwYrf5lCPZg5wTE@cluster0.kos6m2u.mongodb.net/user-order?retryWrites=true&w=majority";
// mongodb+srv://<username>:<password>@cluster0.kos6m2u.mongodb.net/?retryWrites=true&w=majority
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  
  }
};

export default connectDB;
