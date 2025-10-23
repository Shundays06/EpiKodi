import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Récupérer les playlists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      include: {
        media: {
          include: {
            media: {
              include: {
                metadata: true,
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: playlists });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}

// Créer une playlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, userId, isPublic } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, error: 'Name and userId are required' },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId,
        isPublic: isPublic || false,
      },
    });

    return NextResponse.json({ success: true, data: playlist });
  } catch (error) {
    console.error('Error creating playlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
