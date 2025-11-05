import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/comments?mediaId=xxx - Liste des commentaires d'un média
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: 'mediaId requis' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { mediaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des commentaires' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Ajouter un commentaire
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { mediaId, content } = await request.json();

    if (!mediaId || !content) {
      return NextResponse.json(
        { success: false, error: 'mediaId et content requis' },
        { status: 400 }
      );
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Le commentaire doit contenir au moins 3 caractères' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        mediaId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: comment,
      message: 'Commentaire ajouté',
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'ajout du commentaire' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments?id=xxx - Supprimer un commentaire
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
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: 'id requis' },
        { status: 400 }
      );
    }

    // Vérifier que le commentaire appartient à l'utilisateur
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Commentaire introuvable' },
        { status: 404 }
      );
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Commentaire supprimé',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du commentaire' },
      { status: 500 }
    );
  }
}
