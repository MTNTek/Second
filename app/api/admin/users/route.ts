import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

async function verifyAdmin(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
    if (decoded.role !== 'admin') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const adminUser = await verifyAdmin(token);
    
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const client = await pool.connect();

    try {
      // Get all users with application count
      const query = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.created_at,
          COUNT(a.id) as application_count
        FROM users u
        LEFT JOIN applications a ON u.id = a.user_id
        GROUP BY u.id, u.name, u.email, u.role, u.created_at
        ORDER BY u.created_at DESC
      `;

      const result = await client.query(query);
      
      const users = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        createdAt: row.created_at,
        applicationCount: parseInt(row.application_count),
      }));

      return NextResponse.json({
        success: true,
        data: users,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
