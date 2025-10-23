import { NextRequest, NextResponse } from 'next/server';
import { tmdbService } from '@/services/tmdb.service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, year, mediaId } = await request.json();
    
    console.log(`[TEST] Enriching ${title} (${year}) for media ${mediaId}`);
    
    const metadata = await tmdbService.enrichMediaMetadata(title, year, false);
    
    if (!metadata) {
      return NextResponse.json({
        success: false,
        error: 'No metadata found',
      });
    }
    
    await prisma.metadata.upsert({
      where: { mediaId },
      update: metadata,
      create: {
        mediaId,
        ...metadata,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    console.error('[TEST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
