import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET() {
  const envVarExists = !!process.env.MONGODB_URI;
  const envVarValueStart = process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'none';
  const containsRenderPort = process.env.MONGODB_URI?.includes(':10000');
  
  try {
    console.log('Test route: Connecting to DB...');
    await connectDB();
    const state = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    // Check counts to see if we are in the right DB
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    
    return new Response(JSON.stringify({
      status: 'success',
      connectionState: states[state] || state,
      envVarExists,
      envVarValueStart,
      containsRenderPort,
      databaseName: mongoose.connection.name,
      counts: {
        products: productCount,
        users: userCount,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Test route error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message,
      envVarExists,
      envVarValueStart,
      containsRenderPort,
      stack: error.stack,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
