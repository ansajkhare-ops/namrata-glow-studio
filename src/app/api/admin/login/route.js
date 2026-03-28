import { NextResponse } from 'next/server';
import { prisma } from '../../../../../src/lib/prisma'; // ensuring it avoids alias break
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-glow-studio';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Auto-seed default admin if no admins exist
    let admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      // Safely count users
      const adminCount = await prisma.adminUser.count();
      if (adminCount === 0 && username === 'admin') {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = await prisma.adminUser.create({
          data: { username, password: hashedPassword }
        });
      } else {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });

    // Next.js stable cookies access
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 12, 
      path: '/' 
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
