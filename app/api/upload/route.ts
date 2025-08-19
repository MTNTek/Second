import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { db } from '@/lib/db';
import { fileUploads } from '@/lib/schema';
import { getUserFromRequest } from '@/utils/auth';
import { eq } from 'drizzle-orm';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const applicationId = formData.get('applicationId') as string;
    const applicationType = formData.get('applicationType') as string;
    const documentType = formData.get('documentType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: JPEG, PNG, WebP, PDF, DOC, DOCX' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!applicationId || !applicationType) {
      return NextResponse.json(
        { error: 'Application ID and type are required' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads', applicationType);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${applicationId}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save file record to database
    const fileRecord = await db.insert(fileUploads).values({
      userId: user.userId,
      applicationId,
      applicationType: applicationType as any,
      fileName,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      fileUrl: `/uploads/${applicationType}/${fileName}`,
      documentType,
    }).returning();

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: fileRecord[0],
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const applicationType = searchParams.get('applicationType');

    let files;
    
    if (applicationId && applicationType) {
      files = await db.select().from(fileUploads)
        .where(eq(fileUploads.applicationId, applicationId));
    } else {
      files = await db.select().from(fileUploads)
        .where(eq(fileUploads.userId, user.userId));
    }

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
