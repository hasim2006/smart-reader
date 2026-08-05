import { NextResponse } from 'next/server';
import { addAuditLog } from '@/lib/serverStore';
import fs from 'fs';
import path from 'path';

// Whitelisted File Extensions and MIME Types
const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'pdf', 'docx', 'csv', 'txt', 'md']);
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
  'text/plain',
  'text/markdown'
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawMediaType = (formData.get('mediaType') as string) || 'image';
    const mediaType = rawMediaType.replace(/[^a-zA-Z0-9_-]/g, '');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // 1. File Size Validation (DoS Prevention)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum allowed limit of 10MB.' },
        { status: 413 } // Payload Too Large
      );
    }

    // 2. Extension & Path Traversal Prevention
    const originalName = path.basename(file.name);
    const rawExt = originalName.split('.').pop()?.toLowerCase() || '';
    
    if (!rawExt || !ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { success: false, message: `File extension .${rawExt} is not permitted for upload.` },
        { status: 400 }
      );
    }

    // 3. MIME Type Whitelist
    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: `File MIME type "${file.type}" is not authorized.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Magic Bytes Inspection
    if (rawExt === 'pdf' && !buffer.toString('utf-8', 0, 4).startsWith('%PDF')) {
      return NextResponse.json(
        { success: false, message: 'Security Scan Failed: Invalid PDF signature.' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Safe File Name generation
    const safeFileName = `${mediaType}_${Date.now()}_${Math.floor(Math.random() * 10000)}.${rawExt}`;
    const filePath = path.join(uploadsDir, safeFileName);

    fs.writeFileSync(filePath, buffer);

    const mediaUrl = `/uploads/${safeFileName}`;
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    addAuditLog(
      'Hasim',
      'Media Uploaded',
      `Uploaded validated file ${originalName} (${(file.size / 1024).toFixed(0)} KB) -> ${mediaUrl}`,
      clientIp
    );

    return NextResponse.json({
      success: true,
      message: `File ${originalName} successfully validated and uploaded.`,
      mediaUrl,
      fileName: safeFileName,
      sizeBytes: file.size
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Media upload security error: ${error.message}` },
      { status: 500 }
    );
  }
}
