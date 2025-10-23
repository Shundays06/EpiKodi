'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock, Star } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import type { Media } from '@/types';

interface MediaCardProps {
  media: Media;
}

export function MediaCard({ media }: MediaCardProps) {
  const posterUrl = media.metadata?.posterPath || '/placeholder-poster.jpg';
  const rating = media.metadata?.rating;

  return (
    <Link href={`/media/${media.id}`}>
      <div className="card group cursor-pointer">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl}
            alt={media.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                <span>Lire</span>
              </button>
            </div>
          </div>
          {rating && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{media.title}</h3>
          <div className="flex items-center gap-2 text-sm text-dark-500">
            {media.year && <span>{media.year}</span>}
            {media.duration && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(media.duration)}</span>
                </div>
              </>
            )}
          </div>
          {media.metadata?.genres && media.metadata.genres.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {media.metadata.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-xs bg-dark-200 px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
