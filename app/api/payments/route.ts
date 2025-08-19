/**
 * Payment Processing API
 * POST /api/payments - Create new payment
 * GET /api/payments - Get user payments
 * GET /api/payments/[id] - Get specific payment
 */

import { NextRequest, NextResponse } from 'next/server';
import { PaymentService, PaymentRequest } from '@/lib/payment-service';
import { verifyToken, getTokenFromRequest } from '@/utils/auth';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { payments } from '@/lib/schema';

const paymentService = new PaymentService();

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const paymentRequest: PaymentRequest = {
      applicationId: body.applicationId,
      amount: body.amount,
      currency: body.currency || 'AED',
      paymentMethod: body.paymentMethod,
      customerInfo: {
        name: body.customerInfo?.name || user.name || 'Unknown',
        email: body.customerInfo?.email || user.email,
        phone: body.customerInfo?.phone,
      },
      billingAddress: body.billingAddress,
    };

    // Validate required fields
    if (!paymentRequest.applicationId || !paymentRequest.amount || !paymentRequest.paymentMethod) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: applicationId, amount, paymentMethod'
      }, { status: 400 });
    }

    // Validate payment method
    if (!['paytabs', 'stripe', 'paypal'].includes(paymentRequest.paymentMethod)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid payment method. Supported: paytabs, stripe, paypal'
      }, { status: 400 });
    }

    // Process payment
    const result = await paymentService.processPayment(paymentRequest);

    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });

  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');

    if (paymentId) {
      // Get specific payment
      const result = await paymentService.getPaymentStatus(paymentId);
      return NextResponse.json(result);
    } else {
      // Get all user payments
      const userPayments = await db.query.payments?.findMany({
        where: eq(payments.userId, user.userId),
        orderBy: [desc(payments.createdAt)],
      });

      return NextResponse.json({
        success: true,
        data: userPayments || [],
      });
    }

  } catch (error) {
    console.error('Get payments API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
