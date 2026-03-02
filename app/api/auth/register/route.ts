import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // WARNING: In a production environment, you MUST use bcryptjs to hash passwords.
    // This is a temporary implementation due to environment limitations.
    const user = await User.create({
      name,
      email,
      password, // Plain text for now
      isAdmin: email.includes('admin'), // Simple rule for testing
    });

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
