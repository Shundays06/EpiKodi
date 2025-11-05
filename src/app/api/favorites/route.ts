import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/favorites - Liste des favoris de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        media: {
          include: {
            metadata: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialiser les BigInt
    const serializedFavorites = favorites.map((fav) => ({
      ...fav,
      media: {
        ...fav.media,
        fileSize: fav.media.fileSize.toString(),
        metadata: fav.media.metadata ? {
          ...fav.media.metadata,
          budget: fav.media.metadata.budget?.toString() || null,
          revenue: fav.media.metadata.revenue?.toString() || null,
        } : null,
      },
    }));

    return NextResponse.json({
      success: true,
      data: serializedFavorites,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des favoris' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Ajouter un favori
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { mediaId } = await request.json();

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: 'mediaId requis' },
        { status: 400 }
      );
    }

    // Vérifier si déjà en favori
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_mediaId: {
          userId: session.user.id,
          mediaId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Déjà dans les favoris' },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        mediaId,
      },
      include: {
        media: {
          include: {
            metadata: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: favorite,
      message: 'Ajouté aux favoris',
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'ajout aux favoris' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites?mediaId=xxx - Retirer un favori
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: 'mediaId requis' },
        { status: 400 }
      );
    }

    await prisma.favorite.delete({
      where: {
        userId_mediaId: {
          userId: session.user.id,
          mediaId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Retiré des favoris',
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du favori' },
      { status: 500 }
    );
  }
}
