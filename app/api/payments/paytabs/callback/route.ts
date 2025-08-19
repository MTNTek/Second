/**
 * PayTabs Payment Callback Handler
 * POST /api/payments/paytabs/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment-service';
import { db } from '@/lib/db';
import { payments } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const paymentService = new PaymentService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // PayTabs callback data
    const {
      payment_token,
      tran_ref,
      cart_id,
      cart_amount,
      cart_currency,
      tran_type,
      resp_status,
      resp_code,
      resp_message,
      customer_details,
    } = body;

    console.log('PayTabs callback received:', body);

    // Find payment by token
    const payment = await db.query.payments?.findFirst({
      where: eq(payments.id, payment_token),
    });

    if (!payment) {
      console.error('Payment not found:', payment_token);
      return NextResponse.json({ success: false, message: 'Payment not found' }, { status: 404 });
    }

    // Update payment status based on PayTabs response
    let status = 'failed';
    if (resp_status === 'A' && resp_code === '100') {
      status = 'completed';
    } else if (resp_status === 'P') {
      status = 'processing';
    }

    // Update payment record
    await paymentService.updatePaymentStatus(payment_token, status, {
      tran_ref,
      resp_status,
      resp_code,
      resp_message,
      callback_data: body,
      updated_at: new Date().toISOString(),
    });

    // Update application status if payment completed
    if (status === 'completed') {
      // Note: You might want to update the application status here
      console.log(`Payment completed for application: ${cart_id}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Callback processed successfully',
      status 
    });

  } catch (error) {
    console.error('PayTabs callback error:', error);
    return NextResponse.json({
      success: false,
      message: 'Callback processing failed'
    }, { status: 500 });
  }
}
