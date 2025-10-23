'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { MediaCard } from '@/components/MediaCard';
import { Search, Filter } from 'lucide-react';
import type { PaginatedResponse, Media } from '@/types';

const categories = [
  { value: '', label: 'Tous' },
  { value: 'MOVIE', label: 'Films' },
  { value: 'TV_SHOW', label: 'Séries' },
  { value: 'MUSIC', label: 'Musique' },
  { value: 'PODCAST', label: 'Podcasts' },
];

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<PaginatedResponse<Media>>({
    queryKey: ['media', { search, category, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      params.set('page', page.toString());
      
      const res = await fetch(`/api/media?${params}`);
      if (!res.ok) throw new Error('Failed to fetch media');
      return res.json();
    },
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Bibliothèque</h1>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="input pl-10 w-full"
              />
            </div>
            
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategory(cat.value);
                    setPage(1);
                  }}
                  className={`btn ${
                    category === cat.value ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          {data && (
            <div className="text-dark-500">
              {data.total} média{data.total > 1 ? 's' : ''} trouvé{data.total > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Media Grid */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            Une erreur est survenue lors du chargement des médias.
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {data.items.map((media) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <span className="flex items-center px-4">
                  Page {page} sur {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
