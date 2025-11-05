import { render, screen } from '@testing-library/react'
import { MediaCard } from '@/components/MediaCard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: '1', name: 'Test User', email: 'test@test.com' } },
    status: 'authenticated',
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const mockMedia = {
  id: '1',
  title: 'Test Movie',
  type: 'VIDEO' as const,
  filePath: '/media/test.mp4',
  fileSize: BigInt(1024 * 1024 * 500), // 500 MB
  year: 2024,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  metadata: {
    id: '1',
    mediaId: '1',
    tmdbId: 123,
    posterPath: '/poster.jpg',
    backdropPath: '/backdrop.jpg',
    overview: 'A test movie',
    rating: 8.5,
    releaseDate: new Date('2024-01-01'),
    runtime: 120,
    genres: ['Action', 'Adventure'],
    cast: [],
    director: 'Test Director',
    tagline: 'Test tagline',
    budget: BigInt(1000000),
    revenue: BigInt(5000000),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

describe('MediaCard', () => {
  it('renders media title', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MediaCard media={mockMedia} />
      </QueryClientProvider>
    )
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('displays year if available', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MediaCard media={mockMedia} />
      </QueryClientProvider>
    )
    
    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('displays file size', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MediaCard media={mockMedia} />
      </QueryClientProvider>
    )
    
    expect(screen.getByText(/500\.00 MB/)).toBeInTheDocument()
  })

  it('displays rating if metadata exists', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MediaCard media={mockMedia} />
      </QueryClientProvider>
    )
    
    expect(screen.getByText('8.5')).toBeInTheDocument()
  })

  it('renders without metadata', () => {
    const mediaWithoutMetadata = {
      ...mockMedia,
      metadata: null,
    }
    
    render(
      <QueryClientProvider client={queryClient}>
        <MediaCard media={mediaWithoutMetadata} />
      </QueryClientProvider>
    )
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('shows correct type badge for VIDEO', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MediaCard media={mockMedia} />
      </QueryClientProvider>
    )
    
    expect(screen.getByText('🎬 Vidéo')).toBeInTheDocument()
  })

  it('shows correct type badge for AUDIO', () => {
    const audioMedia = {
      ...mockMedia,
      type: 'AUDIO' as const,
    }
    
    render(
      <QueryClientProvider client={queryClient}>
        <MediaCard media={audioMedia} />
      </QueryClientProvider>
    )
    
    expect(screen.getByText('🎵 Musique')).toBeInTheDocument()
  })
})
