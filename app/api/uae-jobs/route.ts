import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uaeJobApplications } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    const {
      industry,
      jobTitle,
      experience,
      expectedSalary,
      currency,
      availability,
      visaStatus,
      resume,
      contactName,
      contactEmail,
      contactPhone,
    } = applicationData;

    // Validate required fields
    if (!industry || !jobTitle || !contactName || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create UAE job application
    const newApplication = await db.insert(uaeJobApplications).values({
      industry,
      jobTitle,
      experience,
      expectedSalary,
      currency,
      availability: availability ? new Date(availability) : null,
      visaStatus,
      resume,
      contactName,
      contactEmail,
      contactPhone,
      status: 'pending',
    }).returning();

    return NextResponse.json({
      message: 'UAE job application submitted successfully',
      application: newApplication[0],
    });
  } catch (error) {
    console.error('UAE job application error:', error);
    return NextResponse.json(
      { error: 'Failed to process UAE job application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const industry = searchParams.get('industry');

    let applications;
    
    if (userId && industry) {
      applications = await db.select().from(uaeJobApplications)
        .where(eq(uaeJobApplications.userId, userId));
    } else if (userId) {
      applications = await db.select().from(uaeJobApplications)
        .where(eq(uaeJobApplications.userId, userId));
    } else if (industry) {
      applications = await db.select().from(uaeJobApplications)
        .where(eq(uaeJobApplications.industry, industry));
    } else {
      applications = await db.select().from(uaeJobApplications);
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Get UAE job applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UAE job applications' },
      { status: 500 }
    );
  }
}
