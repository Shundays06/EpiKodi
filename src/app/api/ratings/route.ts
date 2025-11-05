import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/ratings?mediaId=xxx - Obtenir la note moyenne et la note de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: 'mediaId requis' },
        { status: 400 }
      );
    }

    // Calculer la moyenne et le nombre de votes
    const ratings = await prisma.rating.findMany({
      where: { mediaId },
    });

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    // Récupérer la note de l'utilisateur si connecté
    let userRating = null;
    if (session?.user) {
      userRating = await prisma.rating.findUnique({
        where: {
          userId_mediaId: {
            userId: session.user.id,
            mediaId,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
        userRating: userRating?.rating || null,
      },
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des notes' },
      { status: 500 }
    );
  }
}

// POST /api/ratings - Ajouter ou mettre à jour une note
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { mediaId, rating } = await request.json();

    if (!mediaId || rating === undefined) {
      return NextResponse.json(
        { success: false, error: 'mediaId et rating requis' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { success: false, error: 'La note doit être un entier entre 1 et 5' },
        { status: 400 }
      );
    }

    const userRating = await prisma.rating.upsert({
      where: {
        userId_mediaId: {
          userId: session.user.id,
          mediaId,
        },
      },
      update: {
        rating,
      },
      create: {
        userId: session.user.id,
        mediaId,
        rating,
      },
    });

    return NextResponse.json({
      success: true,
      data: userRating,
      message: 'Note enregistrée',
    });
  } catch (error) {
    console.error('Error saving rating:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement de la note' },
      { status: 500 }
    );
  }
}

// DELETE /api/ratings?mediaId=xxx - Supprimer une note
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

    await prisma.rating.delete({
      where: {
        userId_mediaId: {
          userId: session.user.id,
          mediaId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Note supprimée',
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de la note' },
      { status: 500 }
    );
  }
}
