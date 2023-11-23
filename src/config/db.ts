import mongoose from 'mongoose';
import app from '../app'
const MONGODB_URI = "mongodb+srv://mongoose-mastery:Sxqpfp7atSVlZPMi@cluster0.kos6m2u.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI as string);
    app.listen("server is running 5000")
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with an error code
  }
};

export default connectDB;
