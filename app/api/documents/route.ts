import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { documentServices } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json();

    const {
      serviceType,
      documentType,
      language,
      urgency,
      quantity,
      totalAmount,
      currency,
      deliveryMethod,
      specialInstructions,
      contactName,
      contactEmail,
      contactPhone,
    } = serviceData;

    // Validate required fields
    if (!serviceType || !documentType || !contactName || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create document service request
    const newService = await db.insert(documentServices).values({
      serviceType,
      documentType,
      language,
      urgency,
      quantity,
      totalAmount,
      currency,
      deliveryMethod,
      specialInstructions,
      contactName,
      contactEmail,
      contactPhone,
      status: 'pending',
    }).returning();

    return NextResponse.json({
      message: 'Document service request submitted successfully',
      service: newService[0],
    });
  } catch (error) {
    console.error('Document service error:', error);
    return NextResponse.json(
      { error: 'Failed to process document service request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const serviceType = searchParams.get('serviceType');

    let services;
    
    if (userId && serviceType) {
      services = await db.select().from(documentServices)
        .where(eq(documentServices.userId, userId));
    } else if (userId) {
      services = await db.select().from(documentServices)
        .where(eq(documentServices.userId, userId));
    } else if (serviceType) {
      services = await db.select().from(documentServices)
        .where(eq(documentServices.serviceType, serviceType));
    } else {
      services = await db.select().from(documentServices);
    }

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Get document services error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document services' },
      { status: 500 }
    );
  }
}
