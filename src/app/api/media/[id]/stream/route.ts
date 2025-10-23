import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id },
    });

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    const filePath = media.filePath;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      
      const headers = new Headers();
      headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Length', chunksize.toString());
      headers.set('Content-Type', media.mimeType);

      return new NextResponse(file as any, {
        status: 206,
        headers,
      });
    } else {
      const file = fs.createReadStream(filePath);
      
      const headers = new Headers();
      headers.set('Content-Length', fileSize.toString());
      headers.set('Content-Type', media.mimeType);

      return new NextResponse(file as any, {
        status: 200,
        headers,
      });
    }
  } catch (error) {
    console.error('Error streaming media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to stream media' },
      { status: 500 }
    );
  }
}
