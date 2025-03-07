import { Express } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function setupAuth(app: Express) {
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const userData = z.object({
        name: z.string().min(1, "Name is required"),
        username: z.string().min(1, "Email is required").email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["helper", "client"]),
        bio: z.string().optional(),
        showPhone: z.boolean().default(false),
        phoneNumber: z.string().optional(),
      }).parse(req.body);

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, userData.username)
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create user in database
      const [user] = await db.insert(users).values({
        username: userData.username,
        password: userData.password, // In production, you should hash this password
        name: userData.name,
        role: userData.role,
        bio: userData.bio,
        phoneNumber: userData.phoneNumber,
        showPhone: userData.showPhone
      }).returning();

      // Create JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set token in a cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({ 
        message: 'User created successfully',
        userId: user.id
      });
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);

      // Find user by username
      const user = await db.query.users.findFirst({
        where: eq(users.username, username)
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // In a production app, you should use bcrypt to compare hashed passwords
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Create JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set token in a cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return user info (without password)
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        user: userWithoutPassword,
        message: 'Login successful' 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ error: 'Invalid request' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logout successful' });
  });

  app.get('/api/auth/me', authenticateToken, (req, res) => {
    // @ts-ignore
    res.json({ user: req.user });
  });
}

// Middleware to verify JWT token
export function authenticateToken(req: any, res: any, next: any) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
}