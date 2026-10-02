import mongoose from 'mongoose';
import dns from 'node:dns';

// Set public DNS servers to resolve MongoDB Atlas SRV records (prevents querySrv ETIMEOUT on Windows/local networks)
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

