import { DATABASE_URI } from '../public/constants/secrets';
import mongoose from 'mongoose';

let handlersRegistered = false;

const connectDB = () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  mongoose
    .connect(DATABASE_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log('Connected to database');
    })
    .catch((err) => {
      console.error('Failed to connect to database: ', err);
    });

  // Only register event handlers once
  if (!handlersRegistered) {
    mongoose.connection.on('error', (err) => {
      console.log('Mongoose connection Error: ', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from database');
    });

    process.on('SIGINT', async () => {
      await mongoose.disconnect();
      process.exit(0);
    });

    // Set flag to indicate handlers have been registered
    handlersRegistered = true;
  }
};

// For testing purposes only - allows resetting the handler registration flag
const resetHandlersRegistered = () => {
  handlersRegistered = false;
};

export { resetHandlersRegistered };
export default connectDB;