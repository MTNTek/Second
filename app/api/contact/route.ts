import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json();

    const {
      name,
      email,
      phone,
      subject,
      message,
      service,
    } = contactData;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Create contact submission
    const newSubmission = await db.insert(contactSubmissions).values({
      name,
      email,
      phone,
      subject,
      message,
      service,
    }).returning();

    // Here you could also send an email notification to admins
    
    return NextResponse.json({
      message: 'Contact form submitted successfully',
      submission: newSubmission[0],
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isReplied = searchParams.get('isReplied');

    let submissions;
    
    if (isReplied !== null) {
      submissions = await db.select().from(contactSubmissions);
    } else {
      submissions = await db.select().from(contactSubmissions);
    }

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Get contact submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}
