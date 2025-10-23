export interface Media {
  id: string;
  title: string;
  filePath: string;
  fileName: string;
  fileSize: bigint;
  duration: number | null;
  mimeType: string;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE';
  category: 'MOVIE' | 'TV_SHOW' | 'MUSIC' | 'PODCAST' | 'OTHER';
  year: number | null;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Metadata;
}

export interface Metadata {
  id: string;
  mediaId: string;
  tmdbId: number | null;
  imdbId: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number | null;
  voteCount: number | null;
  releaseDate: Date | null;
  genres: string[];
  cast: any;
  director: string | null;
  producers: string[];
  runtime: number | null;
  tagline: string | null;
  originalLanguage: string | null;
  spokenLanguages: string[];
  budget: bigint | null;
  revenue: bigint | null;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  media?: Media[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
