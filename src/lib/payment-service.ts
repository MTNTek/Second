/**
 * Payment Integration System
 * Perry Eden Group - Professional Services Platform
 * Supports PayTabs, Stripe, and PayPal
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from './db';
import { payments } from './schema';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';

interface PaymentRequest {
  applicationId: string;
  amount: number;
  currency: string;
  paymentMethod: 'paytabs' | 'stripe' | 'paypal';
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

interface PaymentResponse {
  success: boolean;
  paymentId: string;
  transactionId?: string;
  paymentUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  redirectUrl?: string;
}

/**
 * PayTabs Payment Processor
 */
class PayTabsProcessor {
  private profileId: string;
  private serverKey: string;
  private baseUrl: string;

  constructor() {
    this.profileId = process.env.PAYTABS_PROFILE_ID || '';
    this.serverKey = process.env.PAYTABS_SERVER_KEY || '';
    this.baseUrl = process.env.PAYTABS_BASE_URL || 'https://secure.paytabs.sa';
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentId = createId();
      
      const payTabsRequest = {
        profile_id: this.profileId,
        tran_type: 'sale',
        tran_class: 'ecom',
        cart_id: request.applicationId,
        cart_description: `Perry Eden Group - Application Payment`,
        cart_currency: request.currency,
        cart_amount: request.amount,
        callback: `${process.env.NEXTAUTH_URL}/api/payments/paytabs/callback`,
        return: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
        customer_details: {
          name: request.customerInfo.name,
          email: request.customerInfo.email,
          phone: request.customerInfo.phone || '',
          street1: request.billingAddress?.street || '',
          city: request.billingAddress?.city || '',
          state: request.billingAddress?.state || '',
          country: request.billingAddress?.country || 'AE',
          zip: request.billingAddress?.postalCode || '',
        },
        payment_token: paymentId,
      };

      const response = await fetch(`${this.baseUrl}/payment/request`, {
        method: 'POST',
        headers: {
          'Authorization': this.serverKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payTabsRequest),
      });

      const result = await response.json();

      if (result.response_code === 4012) {
        // Store payment record
        await db.insert(payments).values({
          id: paymentId,
          applicationId: request.applicationId,
          amount: request.amount.toString(),
          currency: request.currency,
          paymentMethod: 'paytabs',
          status: 'pending',
          transactionId: result.tran_ref,
          paymentData: JSON.stringify(result),
          createdAt: new Date(),
        });

        return {
          success: true,
          paymentId,
          transactionId: result.tran_ref,
          paymentUrl: result.redirect_url,
          status: 'pending',
          message: 'Payment initiated successfully',
          redirectUrl: result.redirect_url,
        };
      } else {
        throw new Error(result.result || 'PayTabs payment failed');
      }
    } catch (error) {
      console.error('PayTabs payment error:', error);
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/query`, {
        method: 'POST',
        headers: {
          'Authorization': this.serverKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_id: this.profileId,
          tran_ref: transactionId,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('PayTabs verification error:', error);
      throw error;
    }
  }
}

/**
 * Stripe Payment Processor
 */
class StripeProcessor {
  private secretKey: string;
  private publishableKey: string;

  constructor() {
    this.secretKey = process.env.STRIPE_SECRET_KEY || '';
    this.publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Note: In a real implementation, you would use the Stripe SDK
      // This is a simplified example
      const paymentId = createId();

      const stripeRequest = {
        amount: Math.round(request.amount * 100), // Stripe uses cents
        currency: request.currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        customer_email: request.customerInfo.email,
        metadata: {
          applicationId: request.applicationId,
          paymentId: paymentId,
        },
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled`,
      };

      // Store payment record
      await db.insert(payments).values({
        id: paymentId,
        applicationId: request.applicationId,
        amount: request.amount.toString(),
        currency: request.currency,
        paymentMethod: 'stripe',
        status: 'pending',
        paymentData: JSON.stringify(stripeRequest),
        createdAt: new Date(),
      });

      return {
        success: true,
        paymentId,
        status: 'pending',
        message: 'Stripe payment session created',
        // In real implementation, this would be the Stripe checkout URL
        paymentUrl: `/api/payments/stripe/checkout?payment_id=${paymentId}`,
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Stripe payment failed',
      };
    }
  }
}

/**
 * PayPal Payment Processor
 */
class PayPalProcessor {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
    this.baseUrl = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentId = createId();

      // Get PayPal access token
      const authResponse = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      const authData = await authResponse.json();

      // Create PayPal order
      const orderResponse = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: request.currency,
              value: request.amount.toString(),
            },
            description: 'Perry Eden Group - Application Payment',
            custom_id: request.applicationId,
          }],
          application_context: {
            return_url: `${process.env.NEXTAUTH_URL}/api/payments/paypal/success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled`,
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (orderData.id) {
        // Store payment record
        await db.insert(payments).values({
          id: paymentId,
          applicationId: request.applicationId,
          amount: request.amount.toString(),
          currency: request.currency,
          paymentMethod: 'paypal',
          status: 'pending',
          transactionId: orderData.id,
          paymentData: JSON.stringify(orderData),
          createdAt: new Date(),
        });

        const approvalUrl = orderData.links.find((link: any) => link.rel === 'approve')?.href;

        return {
          success: true,
          paymentId,
          transactionId: orderData.id,
          paymentUrl: approvalUrl,
          status: 'pending',
          message: 'PayPal order created successfully',
          redirectUrl: approvalUrl,
        };
      } else {
        throw new Error('Failed to create PayPal order');
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'PayPal payment failed',
      };
    }
  }
}

/**
 * Main Payment Processing Service
 */
export class PaymentService {
  private payTabsProcessor: PayTabsProcessor;
  private stripeProcessor: StripeProcessor;
  private payPalProcessor: PayPalProcessor;

  constructor() {
    this.payTabsProcessor = new PayTabsProcessor();
    this.stripeProcessor = new StripeProcessor();
    this.payPalProcessor = new PayPalProcessor();
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Process payment based on method
      switch (request.paymentMethod) {
        case 'paytabs':
          return await this.payTabsProcessor.createPayment(request);
        case 'stripe':
          return await this.stripeProcessor.createPayment(request);
        case 'paypal':
          return await this.payPalProcessor.createPayment(request);
        default:
          return {
            success: false,
            paymentId: '',
            status: 'failed',
            message: 'Unsupported payment method',
          };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        message: 'Internal payment processing error',
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const payment = await db.query.payments?.findFirst({
        where: eq(payments.id, paymentId),
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      return {
        success: true,
        payment: {
          id: payment.id,
          applicationId: payment.applicationId,
          amount: parseFloat(payment.amount),
          currency: payment.currency,
          method: payment.paymentMethod,
          status: payment.status,
          transactionId: payment.transactionId,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        },
      };
    } catch (error) {
      console.error('Get payment status error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get payment status',
      };
    }
  }

  async updatePaymentStatus(paymentId: string, status: string, transactionData?: any): Promise<void> {
    await db.update(payments)
      .set({
        status: status as any,
        paymentData: transactionData ? JSON.stringify(transactionData) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId));
  }
}

export type { PaymentRequest, PaymentResponse };
