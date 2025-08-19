import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { travelBookings } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    const {
      bookingType,
      departure,
      destination,
      departureDate,
      returnDate,
      passengers,
      rooms,
      classType,
      totalAmount,
      currency,
      specialRequests,
      contactName,
      contactEmail,
      contactPhone,
    } = bookingData;

    // Validate required fields
    if (!bookingType || !contactName || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create travel booking
    const newBooking = await db.insert(travelBookings).values({
      bookingType,
      departure,
      destination,
      departureDate: departureDate ? new Date(departureDate) : null,
      returnDate: returnDate ? new Date(returnDate) : null,
      passengers,
      rooms,
      classType,
      totalAmount,
      currency,
      specialRequests,
      contactName,
      contactEmail,
      contactPhone,
      status: 'pending',
    }).returning();

    return NextResponse.json({
      message: 'Travel booking submitted successfully',
      booking: newBooking[0],
    });
  } catch (error) {
    console.error('Travel booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process travel booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query = db.select().from(travelBookings);
    
    if (userId) {
      query = query.where(eq(travelBookings.userId, userId));
    }
    
    if (status) {
      query = query.where(eq(travelBookings.status, status as any));
    }

    const bookings = await query;

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get travel bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch travel bookings' },
      { status: 500 }
    );
  }
}
