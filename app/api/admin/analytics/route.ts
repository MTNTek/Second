import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

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
      // Get analytics data
      const queries = {
        totalApplications: `SELECT COUNT(*) as count FROM applications`,
        pendingApplications: `SELECT COUNT(*) as count FROM applications WHERE status = 'pending'`,
        approvedApplications: `SELECT COUNT(*) as count FROM applications WHERE status = 'approved'`,
        rejectedApplications: `SELECT COUNT(*) as count FROM applications WHERE status = 'rejected'`,
        totalUsers: `SELECT COUNT(*) as count FROM users WHERE role = 'user'`,
        newUsersThisMonth: `
          SELECT COUNT(*) as count 
          FROM users 
          WHERE role = 'user' 
          AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
        `,
        totalRevenue: `
          SELECT COALESCE(SUM(amount), 0) as total 
          FROM payments 
          WHERE status = 'completed'
        `,
        pendingPayments: `
          SELECT COUNT(*) as count 
          FROM payments 
          WHERE status = 'pending'
        `,
      };

      const results = await Promise.all([
        client.query(queries.totalApplications),
        client.query(queries.pendingApplications),
        client.query(queries.approvedApplications),
        client.query(queries.rejectedApplications),
        client.query(queries.totalUsers),
        client.query(queries.newUsersThisMonth),
        client.query(queries.totalRevenue),
        client.query(queries.pendingPayments),
      ]);

      const analytics = {
        totalApplications: parseInt(results[0].rows[0].count),
        pendingApplications: parseInt(results[1].rows[0].count),
        approvedApplications: parseInt(results[2].rows[0].count),
        rejectedApplications: parseInt(results[3].rows[0].count),
        totalUsers: parseInt(results[4].rows[0].count),
        newUsersThisMonth: parseInt(results[5].rows[0].count),
        totalRevenue: parseFloat(results[6].rows[0].total),
        pendingPayments: parseInt(results[7].rows[0].count),
      };

      return NextResponse.json({
        success: true,
        data: analytics,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
