'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2, Send } from 'lucide-react';
import Link from 'next/link';

interface CommentsAndRatingsProps {
  mediaId: string;
}

export function CommentsAndRatings({ mediaId }: CommentsAndRatingsProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Récupérer les commentaires
  const { data: commentsData } = useQuery({
    queryKey: ['comments', mediaId],
    queryFn: async () => {
      const res = await fetch(`/api/comments?mediaId=${mediaId}`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      return res.json();
    },
  });

  // Récupérer les ratings
  const { data: ratingsData } = useQuery({
    queryKey: ['ratings', mediaId],
    queryFn: async () => {
      const res = await fetch(`/api/ratings?mediaId=${mediaId}`);
      if (!res.ok) throw new Error('Failed to fetch ratings');
      return res.json();
    },
  });

  // Mutation pour ajouter un commentaire
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add comment');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', mediaId] });
      setComment('');
    },
  });

  // Mutation pour supprimer un commentaire
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', mediaId] });
    },
  });

  // Mutation pour ajouter/mettre à jour une note
  const rateMediaMutation = useMutation({
    mutationFn: async (rating: number) => {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, rating }),
      });
      if (!res.ok) throw new Error('Failed to rate media');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', mediaId] });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length >= 3) {
      addCommentMutation.mutate(comment);
    }
  };

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    rateMediaMutation.mutate(rating);
  };

  const userRating = ratingsData?.data?.userRating || 0;
  const averageRating = ratingsData?.data?.averageRating || 0;
  const totalRatings = ratingsData?.data?.totalRatings || 0;

  return (
    <div className="space-y-8">
      {/* Section Notations */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">Notations</h2>
        
        <div className="flex items-center gap-6 mb-6">
          {/* Note moyenne */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-dark-500'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-dark-500 mt-1">
              {totalRatings} note{totalRatings > 1 ? 's' : ''}
            </div>
          </div>

          {/* Note de l'utilisateur */}
          {session ? (
            <div className="flex-1">
              <p className="text-sm text-dark-500 mb-2">Votre note :</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={rateMediaMutation.isPending}
                    className="transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || userRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-dark-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <p className="text-dark-500">
                <Link href="/auth/signin" className="text-primary-500 hover:underline">
                  Connectez-vous
                </Link>{' '}
                pour noter ce média
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section Commentaires */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6">
          Commentaires ({commentsData?.data?.length || 0})
        </h2>

        {/* Formulaire d'ajout de commentaire */}
        {session ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Écrivez votre commentaire..."
              className="input w-full min-h-[100px] resize-none"
              disabled={addCommentMutation.isPending}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-dark-500">
                {comment.length}/500 caractères
              </span>
              <button
                type="submit"
                disabled={comment.trim().length < 3 || addCommentMutation.isPending}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Publier</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-dark-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-dark-500">
              <Link href="/auth/signin" className="text-primary-500 hover:underline">
                Connectez-vous
              </Link>{' '}
              pour laisser un commentaire
            </p>
          </div>
        )}

        {/* Liste des commentaires */}
        <div className="space-y-4">
          {commentsData?.data?.length === 0 && (
            <p className="text-center text-dark-500 py-8">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          )}

          {commentsData?.data?.map((commentItem: any) => (
            <div key={commentItem.id} className="bg-dark-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold">{commentItem.user.name || 'Anonyme'}</div>
                  <div className="text-sm text-dark-500">
                    {new Date(commentItem.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {session?.user?.id === commentItem.userId && (
                  <button
                    onClick={() => deleteCommentMutation.mutate(commentItem.id)}
                    disabled={deleteCommentMutation.isPending}
                    className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Supprimer le commentaire"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-dark-600 whitespace-pre-wrap">{commentItem.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
