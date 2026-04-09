import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  const envVarExists = !!process.env.MONGODB_URI;
  const envVarValueStart = process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'none';
  
  try {
    console.log('Test route: Connecting to DB...');
    await connectDB();
    const state = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    return new Response(JSON.stringify({
      status: 'success',
      connectionState: states[state] || state,
      envVarExists,
      envVarValueStart,
      databaseName: mongoose.connection.name,
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
      stack: error.stack,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
