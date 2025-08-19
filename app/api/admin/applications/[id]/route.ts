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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { status } = await request.json();
    const applicationId = params.id;

    if (!status || !['pending', 'in_progress', 'approved', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Update application status
      const updateQuery = `
        UPDATE applications 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;

      const result = await client.query(updateQuery, [status, applicationId]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Application not found' },
          { status: 404 }
        );
      }

      // Get updated application with user details
      const detailsQuery = `
        SELECT 
          a.*,
          u.name as user_name,
          u.email as user_email
        FROM applications a
        JOIN users u ON a.user_id = u.id
        WHERE a.id = $1
      `;

      const detailsResult = await client.query(detailsQuery, [applicationId]);
      const application = detailsResult.rows[0];

      return NextResponse.json({
        success: true,
        data: {
          id: application.id,
          userId: application.user_id,
          userName: application.user_name,
          userEmail: application.user_email,
          type: application.type,
          serviceName: application.service_name,
          status: application.status,
          amount: application.amount,
          currency: application.currency,
          createdAt: application.created_at,
          updatedAt: application.updated_at,
        },
        message: `Application status updated to ${status}`,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
