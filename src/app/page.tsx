import Link from 'next/link';
import { Film, Music, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary-900/20 to-dark-50"></div>
        <div className="container relative z-10 text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 text-transparent bg-clip-text">
            EpiKodi
          </h1>
          <p className="text-xl md:text-2xl text-dark-500 mb-8 max-w-2xl mx-auto">
            Votre centre multimédia personnel. Gérez et profitez de tous vos médias en un seul endroit.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/library"
              className="btn btn-primary text-lg px-8 py-4"
            >
              Explorer la bibliothèque
            </Link>
            <Link
              href="/scan"
              className="btn btn-secondary text-lg px-8 py-4"
            >
              Scanner les médias
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Fonctionnalités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Film className="w-12 h-12" />}
            title="Films & Séries"
            description="Gérez votre collection de vidéos avec des métadonnées enrichies"
          />
          <FeatureCard
            icon={<Music className="w-12 h-12" />}
            title="Musique"
            description="Organisez votre bibliothèque musicale et créez des playlists"
          />
          <FeatureCard
            icon={<ImageIcon className="w-12 h-12" />}
            title="Photos"
            description="Visualisez et classez vos photos et images"
          />
          <FeatureCard
            icon={<Sparkles className="w-12 h-12" />}
            title="Métadonnées"
            description="Enrichissement automatique via TheMovieDB API"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-dark-100 py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard number="500+" label="Médias" />
            <StatCard number="4K" label="Qualité" />
            <StatCard number="24/7" label="Disponible" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card p-6 text-center hover:shadow-2xl">
      <div className="text-primary-500 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-dark-500">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="animate-slide-up">
      <div className="text-5xl font-bold text-primary-500 mb-2">{number}</div>
      <div className="text-dark-500 text-lg">{label}</div>
    </div>
  );
}
