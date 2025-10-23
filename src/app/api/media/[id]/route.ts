import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id },
      include: {
        metadata: true,
      },
    });

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    // Convertir les BigInt en String pour la sérialisation JSON
    const serializedMedia = {
      ...media,
      fileSize: media.fileSize.toString(),
      metadata: media.metadata ? {
        ...media.metadata,
        budget: media.metadata.budget?.toString() || null,
        revenue: media.metadata.revenue?.toString() || null,
      } : null,
    };

    return NextResponse.json({ success: true, data: serializedMedia });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.media.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
