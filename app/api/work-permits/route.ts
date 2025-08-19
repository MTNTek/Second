import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workPermitApplications } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    const {
      country,
      jobTitle,
      company,
      salary,
      currency,
      location,
      workExperience,
      education,
      languageSkills,
      processingWeeks,
      accommodationIncluded,
      transportIncluded,
      contactName,
      contactEmail,
      contactPhone,
    } = applicationData;

    // Validate required fields
    if (!country || !jobTitle || !contactName || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create work permit application
    const newApplication = await db.insert(workPermitApplications).values({
      country,
      jobTitle,
      company,
      salary,
      currency,
      location,
      workExperience,
      education,
      languageSkills,
      processingWeeks,
      accommodationIncluded,
      transportIncluded,
      contactName,
      contactEmail,
      contactPhone,
      status: 'pending',
    }).returning();

    return NextResponse.json({
      message: 'Work permit application submitted successfully',
      application: newApplication[0],
    });
  } catch (error) {
    console.error('Work permit application error:', error);
    return NextResponse.json(
      { error: 'Failed to process work permit application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const country = searchParams.get('country');

    let applications;
    
    if (userId && country) {
      applications = await db.select().from(workPermitApplications)
        .where(eq(workPermitApplications.userId, userId));
    } else if (userId) {
      applications = await db.select().from(workPermitApplications)
        .where(eq(workPermitApplications.userId, userId));
    } else if (country) {
      applications = await db.select().from(workPermitApplications)
        .where(eq(workPermitApplications.country, country));
    } else {
      applications = await db.select().from(workPermitApplications);
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Get work permit applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work permit applications' },
      { status: 500 }
    );
  }
}
