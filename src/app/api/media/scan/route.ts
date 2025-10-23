import { NextRequest, NextResponse } from 'next/server';
import { mediaScanService } from '@/services/media-scan.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dirPath = body.path || process.env.MEDIA_PATH || '/media';

    const result = await mediaScanService.scanDirectory(dirPath);

    return NextResponse.json({
      success: true,
      data: result,
      message: `Scan completed: ${result.added} added, ${result.updated} updated, ${result.errors.length} errors`,
    });
  } catch (error) {
    console.error('Error scanning media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scan media directory' },
      { status: 500 }
    );
  }
}
