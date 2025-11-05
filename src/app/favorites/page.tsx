'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MediaCard } from '@/components/MediaCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites');
      if (!res.ok) throw new Error('Failed to fetch favorites');
      return res.json();
    },
    enabled: !!session,
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container">
          <div className="text-center max-w-md mx-auto">
            <Heart className="w-16 h-16 mx-auto mb-4 text-dark-500" />
            <h1 className="text-3xl font-bold mb-4">Mes Favoris</h1>
            <p className="text-dark-500 mb-6">
              Connectez-vous pour voir vos médias favoris
            </p>
            <Link href="/auth/signin" className="btn btn-primary">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart className="w-10 h-10 text-primary-500 fill-primary-500" />
            Mes Favoris
          </h1>
          {data?.data && (
            <p className="text-dark-500">
              {data.data.length} média{data.data.length > 1 ? 's' : ''} en favoris
            </p>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            Une erreur est survenue lors du chargement des favoris.
          </div>
        )}

        {data?.data && data.data.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-dark-500" />
            <h3 className="text-2xl font-semibold mb-2">Aucun favori</h3>
            <p className="text-dark-500 mb-6">
              Ajoutez des médias à vos favoris pour les retrouver facilement
            </p>
            <Link href="/library" className="btn btn-primary">
              Explorer la bibliothèque
            </Link>
          </div>
        )}

        {data?.data && data.data.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.data.map((favorite: any) => (
              <MediaCard key={favorite.id} media={favorite.media} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
