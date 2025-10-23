'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Play, Star, Calendar, Clock, Heart, Plus } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import type { Media } from '@/types';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useState } from 'react';

export default function MediaDetailPage() {
  const params = useParams();
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: media, isLoading } = useQuery<{ success: boolean; data: Media }>({
    queryKey: ['media', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/media/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch media');
      return res.json();
    },
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!media?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Média introuvable</h1>
          <p className="text-dark-500">Ce média n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  const mediaData = media.data;
  const metadata = mediaData.metadata;

  if (isPlaying) {
    return <VideoPlayer media={mediaData} onClose={() => setIsPlaying(false)} />;
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Backdrop */}
      {metadata?.backdropPath && (
        <div className="relative h-[70vh] w-full">
          <Image
            src={metadata.backdropPath}
            alt={mediaData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-dark-50/50 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className={`container relative ${metadata?.backdropPath ? '-mt-96' : 'pt-24'} z-10`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster - affiche seulement pour vidéos avec métadonnées */}
          {metadata?.posterPath && mediaData.type === 'VIDEO' && (
            <div className="flex-shrink-0">
              <div className="relative w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={metadata.posterPath}
                  alt={mediaData.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="flex-1">
            {/* Badge type média */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                mediaData.type === 'AUDIO' ? 'bg-purple-500/20 text-purple-400' :
                mediaData.type === 'VIDEO' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {mediaData.type === 'AUDIO' ? '🎵 Musique' :
                 mediaData.type === 'VIDEO' ? '🎬 Vidéo' :
                 '📄 Média'}
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-4">{mediaData.title}</h1>
            
            {metadata?.tagline && (
              <p className="text-xl text-dark-500 italic mb-6">{metadata.tagline}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6 text-dark-500">
              {metadata?.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{metadata.rating.toFixed(1)}</span>
                </div>
              )}
              {metadata?.releaseDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(metadata.releaseDate).getFullYear()}</span>
                </div>
              )}
              {metadata?.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatDuration(metadata.runtime * 60)}</span>
                </div>
              )}
              {mediaData.year && !metadata?.releaseDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{mediaData.year}</span>
                </div>
              )}
              {/* Taille du fichier */}
              <div className="flex items-center gap-2">
                <span className="text-sm">📦 {(Number(mediaData.fileSize) / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>

            {/* Genres */}
            {metadata?.genres && metadata.genres.length > 0 && (
              <div className="flex gap-2 mb-6">
                {metadata.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 bg-dark-200 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setIsPlaying(true)}
                className="btn btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                <Play className="w-6 h-6" />
                <span>Lecture</span>
              </button>
              <button className="btn btn-secondary px-6 py-4">
                <Heart className="w-6 h-6" />
              </button>
              <button className="btn btn-secondary px-6 py-4">
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* Overview */}
            {metadata?.overview && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                <p className="text-lg leading-relaxed text-dark-600">{metadata.overview}</p>
              </div>
            )}

            {/* Cast */}
            {metadata?.cast && Array.isArray(metadata.cast) && metadata.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {metadata.cast.slice(0, 8).map((actor: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-semibold">{actor.name}</div>
                      <div className="text-xs text-dark-500">{actor.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
