import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing from environment variables');
    throw new Error(
      'Please define the MONGODB_URI environment variable'
    );
  }

  // Check for common misconfigurations with port 10000 on Render
  if (MONGODB_URI.includes(':10000')) {
    console.warn('⚠️ PORT 10000 detected in MONGODB_URI. This is likely Render\'s web server port, not the database port. Atlas typically uses port 27017 or no port at all in mongodb+srv URLs.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,  // 45 seconds timeout
    };

    console.log('Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas');
      return mongoose;
    }).catch((err) => {
      console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
      cached.promise = null; // Reset promise to allow retrying
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
