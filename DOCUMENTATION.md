# 🎬 EpiKodi - Documentation Complète

## 📋 Table des Matières
- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [API](#api)
- [Déploiement](#déploiement)
- [Contribution](#contribution)

## Vue d'ensemble

EpiKodi est une application multimédia moderne inspirée de Kodi. Elle permet de gérer, organiser et lire des fichiers multimédias (vidéos, musiques, images) à partir de sources locales. L'application intègre l'enrichissement automatique des métadonnées via TheMovieDB API.

### Technologies

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Framer Motion
- React Query
- Lucide Icons

**Backend**
- Node.js
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Redis (cache)

**APIs Externes**
- TheMovieDB API (métadonnées films/séries)

**DevOps**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Vercel (déploiement)

## Fonctionnalités

### ✅ Implémentées

1. **Gestion des Médias**
   - Scan automatique du dossier local
   - Support vidéo (MP4, MKV, AVI, MOV, etc.)
   - Support audio (MP3, FLAC, WAV, AAC, etc.)
   - Support images (JPG, PNG, GIF, WebP, etc.)
   - Indexation et stockage en base de données

2. **Métadonnées Enrichies**
   - Récupération automatique via TheMovieDB
   - Affiches, synopsis, notes, casting
   - Informations de production
   - Cache Redis pour les performances

3. **Lecteur Multimédia**
   - Lecteur vidéo HTML5
   - Contrôles personnalisés
   - Support du streaming par plage (Range requests)
   - Mode plein écran
   - Barre de progression
   - Contrôle du volume

4. **Interface Utilisateur**
   - Design moderne et responsive
   - Navigation fluide
   - Recherche et filtres
   - Pagination
   - Animations

5. **Bibliothèque**
   - Affichage en grille
   - Filtres par catégorie (Films, Séries, Musique)
   - Recherche en temps réel
   - Pages de détails complètes

### 🚧 À Venir

- Authentification utilisateurs
- Playlists personnalisées
- Favoris et historique de visionnage
- Sous-titres
- Support multi-langues
- Transcoding vidéo
- Application mobile
- Extensions/plugins

## Architecture

### Structure du Projet

```
EpiKodi/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # Pipeline CI/CD
├── prisma/
│   └── schema.prisma           # Schéma base de données
├── public/                     # Fichiers statiques
├── src/
│   ├── app/                    # Pages Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── media/        # Gestion médias
│   │   │   └── playlists/    # Gestion playlists
│   │   ├── library/          # Page bibliothèque
│   │   ├── media/[id]/       # Détails média
│   │   ├── scan/             # Page scan
│   │   ├── globals.css       # Styles globaux
│   │   ├── layout.tsx        # Layout racine
│   │   └── page.tsx          # Page d'accueil
│   ├── components/            # Composants React
│   │   ├── MediaCard.tsx
│   │   ├── Navigation.tsx
│   │   ├── Providers.tsx
│   │   └── VideoPlayer.tsx
│   ├── lib/                   # Utilitaires
│   │   ├── prisma.ts         # Client Prisma
│   │   ├── redis.ts          # Client Redis
│   │   └── utils.ts          # Fonctions utiles
│   ├── services/              # Services métier
│   │   ├── media-scan.service.ts
│   │   └── tmdb.service.ts
│   └── types/                 # Types TypeScript
│       └── index.ts
├── .env.example               # Variables d'environnement
├── docker-compose.yml         # Configuration Docker
├── Dockerfile                 # Image Docker
├── next.config.js            # Config Next.js
├── package.json              # Dépendances
├── tailwind.config.ts        # Config Tailwind
└── tsconfig.json             # Config TypeScript
```

### Modèle de Données

**Media**
- Informations de base du fichier
- Type (VIDEO, AUDIO, IMAGE)
- Catégorie (MOVIE, TV_SHOW, MUSIC, etc.)
- Relations : metadata, playlists, favorites

**Metadata**
- Données enrichies TheMovieDB
- Affiches et backdrops
- Synopsis, notes, casting
- Informations de production

**Playlist**
- Collections personnalisées
- Relation avec User et Media

**User** (à venir)
- Authentification
- Préférences
- Historique

## Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- Redis (optionnel mais recommandé)
- Clé API TheMovieDB

### Installation Locale

1. **Cloner le projet**
```bash
git clone https://github.com/Shundays06/EpiKodi.git
cd EpiKodi
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
```

Éditez `.env` :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/epikodi"
REDIS_URL="redis://localhost:6379"
TMDB_API_KEY="votre_clé_api"
NEXTAUTH_SECRET="votre_secret"
MEDIA_PATH="/chemin/vers/vos/medias"
```

4. **Initialiser la base de données**
```bash
npm run db:push
```

5. **Lancer l'application**
```bash
npm run dev
```

### Installation avec Docker

```bash
# Créer le fichier .env
cp .env.example .env

# Éditer .env avec votre clé TMDB_API_KEY

# Lancer les conteneurs
docker-compose up -d

# L'application sera disponible sur http://localhost:3000
```

## Utilisation

### Scanner vos médias

1. Placez vos fichiers dans le dossier configuré (`MEDIA_PATH`)
2. Accédez à http://localhost:3000/scan
3. Cliquez sur "Lancer le scan"
4. Attendez la fin du scan

### Organisation recommandée

**Films**
```
/media/movies/
  ├── Avatar (2009).mkv
  ├── Inception (2010).mp4
  └── The Matrix (1999).avi
```

**Séries**
```
/media/tv/
  ├── Breaking Bad/
  │   ├── Breaking Bad S01E01.mkv
  │   └── Breaking Bad S01E02.mkv
  └── Game of Thrones/
      └── Game of Thrones S01E01.mkv
```

### Naviguer dans la bibliothèque

- **Accueil** : Aperçu et statistiques
- **Bibliothèque** : Tous vos médias avec filtres
- **Recherche** : Recherchez par titre
- **Détails** : Cliquez sur un média pour voir toutes les infos

## API

### Endpoints Médias

**GET /api/media**
```typescript
Query params:
  - page: number (default: 1)
  - pageSize: number (default: 20)
  - type: 'VIDEO' | 'AUDIO' | 'IMAGE'
  - category: 'MOVIE' | 'TV_SHOW' | 'MUSIC' | 'PODCAST'
  - search: string

Response: PaginatedResponse<Media>
```

**GET /api/media/:id**
```typescript
Response: { success: boolean, data: Media }
```

**GET /api/media/:id/stream**
- Supporte le streaming par plage (Range header)
- Retourne le flux vidéo/audio

**POST /api/media/scan**
```typescript
Body: { path?: string }
Response: { success: boolean, data: ScanResult }
```

**DELETE /api/media/:id**
```typescript
Response: { success: boolean, message: string }
```

### Endpoints Playlists

**GET /api/playlists**
```typescript
Query params:
  - userId: string (required)

Response: { success: boolean, data: Playlist[] }
```

**POST /api/playlists**
```typescript
Body: {
  name: string
  description?: string
  userId: string
  isPublic?: boolean
}

Response: { success: boolean, data: Playlist }
```

## Déploiement

### Vercel

1. Installez Vercel CLI
```bash
npm install -g vercel
```

2. Connectez votre projet
```bash
vercel link
```

3. Ajoutez les variables d'environnement dans Vercel Dashboard

4. Déployez
```bash
vercel --prod
```

### Docker Production

```bash
docker build -t epikodi:latest .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e TMDB_API_KEY="..." \
  -v /path/to/media:/media \
  epikodi:latest
```

### Variables d'Environnement Requises

- `DATABASE_URL` : PostgreSQL connection string
- `TMDB_API_KEY` : TheMovieDB API key
- `NEXTAUTH_SECRET` : Secret pour l'authentification
- `MEDIA_PATH` : Chemin vers les médias

## Contribution

### Workflow

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de Code

- TypeScript strict mode
- ESLint + Prettier
- Commits conventionnels
- Tests unitaires pour les services

### Issues

Consultez les [issues GitHub](https://github.com/Shundays06/EpiKodi/issues) pour voir les fonctionnalités planifiées et les bugs connus.

## Support

- 📧 Email : support@epikodi.com
- 💬 Discord : [Rejoindre](https://discord.gg/epikodi)
- 📖 Documentation : [Wiki](https://github.com/Shundays06/EpiKodi/wiki)

## Licence

MIT © 2024 Shundays06

---

**Fait avec ❤️ par la communauté EpiKodi**
