import axios from 'axios';
import { getCachedData, setCachedData } from '@/lib/redis';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  media_type?: string;
}

interface TMDBMovieDetails {
  id: number;
  imdb_id: string;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  tagline: string;
  original_language: string;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
  budget: number;
  revenue: number;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
}

interface TMDBTVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genres: Array<{ id: number; name: string }>;
  episode_run_time: number[];
  tagline: string;
  original_language: string;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
  created_by: Array<{ id: number; name: string }>;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

export class TMDBService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    console.log('[TMDB] Initializing with API key:', TMDB_API_KEY ? 'SET' : 'NOT SET');
    if (!TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY is not configured');
    }
    this.apiKey = TMDB_API_KEY;
    this.baseUrl = TMDB_BASE_URL;
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          language: 'fr-FR',
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`TMDB API Error: ${endpoint}`, error);
      throw error;
    }
  }

  async searchMovie(query: string, year?: number): Promise<TMDBSearchResult[]> {
    console.log(`[TMDB] Searching for movie: "${query}" (${year})`);
    const cacheKey = `tmdb:search:movie:${query}:${year || ''}`;
    const cached = await getCachedData<TMDBSearchResult[]>(cacheKey);
    if (cached) {
      console.log(`[TMDB] Found in cache: ${cached.length} results`);
      return cached;
    }

    const data = await this.request<{ results: TMDBSearchResult[] }>('/search/movie', {
      query,
      year,
    });

    console.log(`[TMDB] API returned: ${data.results.length} results`);
    await setCachedData(cacheKey, data.results, 86400); // 24 heures
    return data.results;
  }

  async searchTVShow(query: string, year?: number): Promise<TMDBSearchResult[]> {
    const cacheKey = `tmdb:search:tv:${query}:${year || ''}`;
    const cached = await getCachedData<TMDBSearchResult[]>(cacheKey);
    if (cached) return cached;

    const data = await this.request<{ results: TMDBSearchResult[] }>('/search/tv', {
      query,
      first_air_date_year: year,
    });

    await setCachedData(cacheKey, data.results, 86400);
    return data.results;
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    const cacheKey = `tmdb:movie:${movieId}`;
    const cached = await getCachedData<TMDBMovieDetails>(cacheKey);
    if (cached) return cached;

    const data = await this.request<TMDBMovieDetails>(`/movie/${movieId}`, {
      append_to_response: 'credits',
    });

    await setCachedData(cacheKey, data, 604800); // 7 jours
    return data;
  }

  async getTVShowDetails(tvId: number): Promise<TMDBTVDetails> {
    const cacheKey = `tmdb:tv:${tvId}`;
    const cached = await getCachedData<TMDBTVDetails>(cacheKey);
    if (cached) return cached;

    const data = await this.request<TMDBTVDetails>(`/tv/${tvId}`, {
      append_to_response: 'credits',
    });

    await setCachedData(cacheKey, data, 604800);
    return data;
  }

  getImageUrl(path: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string | null {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  async enrichMediaMetadata(title: string, year?: number, isTV: boolean = false) {
    try {
      const searchResults = isTV
        ? await this.searchTVShow(title, year)
        : await this.searchMovie(title, year);

      if (searchResults.length === 0) {
        return null;
      }

      const bestMatch = searchResults[0];
      const details = isTV
        ? await this.getTVShowDetails(bestMatch.id)
        : await this.getMovieDetails(bestMatch.id);

      if ('title' in details) {
        // Movie
        const movie = details as TMDBMovieDetails;
        return {
          tmdbId: movie.id,
          imdbId: movie.imdb_id,
          overview: movie.overview,
          posterPath: this.getImageUrl(movie.poster_path),
          backdropPath: this.getImageUrl(movie.backdrop_path, 'original'),
          rating: movie.vote_average,
          voteCount: movie.vote_count,
          releaseDate: movie.release_date ? new Date(movie.release_date) : null,
          genres: movie.genres.map((g) => g.name),
          cast: movie.credits.cast.slice(0, 10).map((c) => ({
            name: c.name,
            character: c.character,
            profilePath: this.getImageUrl(c.profile_path),
          })),
          director: movie.credits.crew.find((c) => c.job === 'Director')?.name,
          producers: movie.credits.crew
            .filter((c) => c.job === 'Producer')
            .map((c) => c.name),
          runtime: movie.runtime,
          tagline: movie.tagline,
          originalLanguage: movie.original_language,
          spokenLanguages: movie.spoken_languages.map((l) => l.name),
          budget: movie.budget,
          revenue: movie.revenue,
        };
      } else {
        // TV Show
        const tv = details as TMDBTVDetails;
        return {
          tmdbId: tv.id,
          imdbId: null,
          overview: tv.overview,
          posterPath: this.getImageUrl(tv.poster_path),
          backdropPath: this.getImageUrl(tv.backdrop_path, 'original'),
          rating: tv.vote_average,
          voteCount: tv.vote_count,
          releaseDate: tv.first_air_date ? new Date(tv.first_air_date) : null,
          genres: tv.genres.map((g) => g.name),
          cast: tv.credits.cast.slice(0, 10).map((c) => ({
            name: c.name,
            character: c.character,
            profilePath: this.getImageUrl(c.profile_path),
          })),
          director: tv.created_by[0]?.name,
          producers: tv.created_by.map((c) => c.name),
          runtime: tv.episode_run_time[0] || null,
          tagline: tv.tagline,
          originalLanguage: tv.original_language,
          spokenLanguages: tv.spoken_languages.map((l) => l.name),
          budget: null,
          revenue: null,
        };
      }
    } catch (error) {
      console.error('Error enriching metadata:', error);
      return null;
    }
  }
}

export const tmdbService = new TMDBService();
