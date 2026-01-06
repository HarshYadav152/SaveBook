import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import bcrypt from 'bcryptjs';

// Mock user storage for development
const mockUsers = [];

export async function POST(request) {
  try {
    await dbConnect();
    
    const { username, password, confirmPassword } = await request.json();
    
    console.log('Registration attempt:', { username });
    
    // Validation
    if (!username || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    let existingUser = null;
    let newUser = null;
    
    // Try to use real MongoDB if available
    try {
      // Dynamic import to avoid errors
      let User;
      try {
        User = (await import('@/lib/models/User')).default;
      } catch (e) {
        console.log('User model not found, using mock');
      }
      
      if (User) {
        // Check if user exists
        existingUser = await User.findOne({ username: username.toLowerCase() });
        
        if (existingUser) {
          return NextResponse.json(
            { error: "Username already exists" },
            { status: 400 }
          );
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        newUser = await User.create({
          username: username.toLowerCase(),
          password: hashedPassword
        });
        
        console.log('Created user in MongoDB:', newUser.username);
      }
    } catch (dbError) {
      console.log('Using mock database:', dbError.message);
    }
    
    // If MongoDB failed, use mock storage
    if (!newUser) {
      // Check mock storage
      existingUser = mockUsers.find(user => user.username === username.toLowerCase());
      
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
      
      // Create mock user
      newUser = {
        id: Date.now().toString(),
        username: username.toLowerCase(),
        date: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      console.log('Created mock user:', newUser);
    }
    
    // Return response
    const userResponse = {
      id: newUser._id || newUser.id,
      username: newUser.username,
      date: newUser.date || newUser.createdAt
    };
    
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: userResponse
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}