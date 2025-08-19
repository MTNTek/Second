import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { visaApplications } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    const {
      visaType,
      nationality,
      passportNumber,
      passportExpiry,
      purposeOfVisit,
      intendedArrival,
      duration,
      totalAmount,
      currency,
      processingDays,
      additionalNotes,
      contactName,
      contactEmail,
      contactPhone,
    } = applicationData;

    // Validate required fields
    if (!visaType || !nationality || !passportNumber || !passportExpiry || 
        !purposeOfVisit || !contactName || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create visa application
    const newApplication = await db.insert(visaApplications).values({
      visaType,
      nationality,
      passportNumber,
      passportExpiry: new Date(passportExpiry),
      purposeOfVisit,
      intendedArrival: intendedArrival ? new Date(intendedArrival) : null,
      duration,
      totalAmount,
      currency,
      processingDays,
      additionalNotes,
      contactName,
      contactEmail,
      contactPhone,
      status: 'pending',
    }).returning();

    return NextResponse.json({
      message: 'Visa application submitted successfully',
      application: newApplication[0],
    });
  } catch (error) {
    console.error('Visa application error:', error);
    return NextResponse.json(
      { error: 'Failed to process visa application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let applications;
    
    if (userId && status) {
      applications = await db.select().from(visaApplications)
        .where(eq(visaApplications.userId, userId));
    } else if (userId) {
      applications = await db.select().from(visaApplications)
        .where(eq(visaApplications.userId, userId));
    } else if (status) {
      applications = await db.select().from(visaApplications)
        .where(eq(visaApplications.status, status as any));
    } else {
      applications = await db.select().from(visaApplications);
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Get visa applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visa applications' },
      { status: 500 }
    );
  }
}
