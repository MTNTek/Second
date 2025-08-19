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
      // Get all applications with user details
      const query = `
        SELECT 
          a.*,
          u.name as user_name,
          u.email as user_email
        FROM applications a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
      `;

      const result = await client.query(query);
      
      const applications = result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        userEmail: row.user_email,
        type: row.type,
        serviceName: row.service_name,
        status: row.status,
        amount: row.amount,
        currency: row.currency,
        formData: row.form_data,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return NextResponse.json({
        success: true,
        data: applications,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
