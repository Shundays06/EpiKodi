# 🎬 EpiKodi

<div align="center">

![EpiKodi Logo](https://img.shields.io/badge/EpiKodi-Media%20Center-blue?style=for-the-badge&logo=film)

**Un centre multimédia moderne et puissant inspiré de Kodi**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Démo](#-démo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contribution](#-contribution)

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#️-technologies)
- [Démo](#-démo)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [API](#-api-endpoints)
- [Développement](#-développement)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🎯 À propos

**EpiKodi** est un centre multimédia complet développé avec les technologies web modernes. Il permet de gérer, organiser et regarder votre collection de médias (films, séries, musique) avec une interface élégante et des métadonnées enrichies automatiquement grâce à TheMovieDB.

### ✨ Points forts

- 🎨 **Interface moderne** avec design dark élégant
- 🚀 **Performances optimales** grâce à Next.js 14 et React 18
- 🎬 **Métadonnées automatiques** via TheMovieDB API
- 📱 **100% Responsive** - fonctionne sur tous les appareils
- 🔍 **Recherche avancée** avec filtres par catégorie
- 🎵 **Multi-format** - Vidéos, audio et images

---

## 🌟 Fonctionnalités

### ✅ Fonctionnalités actuelles

| Fonctionnalité | Description | Statut |
|----------------|-------------|--------|
| 📁 **Scanner de médias** | Scan automatique et récursif du dossier local | ✅ Fonctionnel |
| 🎬 **Lecteur vidéo** | Lecteur HTML5 avec contrôles avancés (play/pause, volume, fullscreen) | ✅ Fonctionnel |
| 🎵 **Lecteur audio** | Support MP3, FLAC, WAV, AAC, OGG | ✅ Fonctionnel |
| 🎨 **Métadonnées TMDB** | Enrichissement automatique (posters, synopsis, casting, notes) | ✅ Fonctionnel |
| � **Recherche & filtres** | Recherche par titre, filtres par catégorie | ✅ Fonctionnel |
| 📊 **Pagination** | Navigation fluide dans la bibliothèque | ✅ Fonctionnel |
| 🎯 **Page détail** | Vue complète avec toutes les métadonnées | ✅ Fonctionnel |
| � **Base de données** | PostgreSQL avec Prisma ORM | ✅ Fonctionnel |
| ⚡ **Cache Redis** | Cache optionnel pour les requêtes TMDB | ⚠️ Optionnel |

### 🚧 Fonctionnalités en développement

| Fonctionnalité | Description | Statut |
|----------------|-------------|--------|
| 🔐 **Authentification** | Login/Register avec NextAuth | 🔜 Planifié |
| ❤️ **Favoris** | Ajouter des médias en favoris | 🔜 Planifié |
| 📝 **Playlists** | Créer et gérer des playlists personnalisées | 🔜 Planifié |
| ⭐ **Notations** | Système de notation utilisateur | 🔜 Planifié |
| 💬 **Commentaires** | Ajouter des avis sur les médias | 🔜 Planifié |
| 🎵 **MusicBrainz** | Métadonnées pour la musique | 🔜 Planifié |
| 🧪 **Tests** | Tests unitaires et d'intégration | 🔜 Planifié |

---

## 🛠️ Technologies

### Frontend
- ⚛️ **React 18** - Bibliothèque UI
- ⚡ **Next.js 14** - Framework React avec App Router
- 🎨 **TailwindCSS** - Framework CSS utility-first
- 🎭 **Framer Motion** - Animations fluides
- 🔍 **React Query** - Gestion d'état et cache
- 🎯 **TypeScript** - Typage statique

### Backend
- 🟢 **Node.js** - Runtime JavaScript
- 🔷 **Prisma ORM** - ORM TypeScript moderne
- 🐘 **PostgreSQL** - Base de données relationnelle
- 🔴 **Redis** - Cache (optionnel)
- 🎬 **TheMovieDB API** - Métadonnées de films/séries

### DevOps & Outils
- 📦 **npm** - Gestionnaire de paquets
- 🔧 **ESLint** - Linter JavaScript/TypeScript
- 🎨 **PostCSS** - Traitement CSS
- 🐳 **Docker** - Containerisation (disponible)

---

## 🎥 Démo

### Page d'accueil
Interface d'accueil élégante avec navigation rapide vers la bibliothèque et le scanner.

### Bibliothèque
Grille de médias avec posters, notes TMDB, filtres par catégorie et recherche.

### Page détail
Vue complète d'un média avec backdrop, poster, synopsis, casting, genres, et bouton de lecture.

### Lecteur vidéo
Lecteur plein écran avec contrôles (play/pause, progression, volume, fullscreen).

> 💡 **Note**: Screenshots à venir prochainement

---

## 🚀 Installation

### Prérequis

Assurez-vous d'avoir installé :

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **PostgreSQL** 14+ ([Télécharger](https://www.postgresql.org/download/))
- **Redis** (optionnel, recommandé) ([Télécharger](https://redis.io/download))
- **Git** ([Télécharger](https://git-scm.com/downloads))

### Installation rapide

```bash
# 1. Cloner le repository
git clone https://github.com/Shundays06/EpiKodi.git
cd EpiKodi

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Éditer .env avec vos configurations (voir section Configuration)
nano .env  # ou utilisez votre éditeur préféré

# 5. Initialiser la base de données
npm run db:push

# 6. (Optionnel) Générer le client Prisma
npm run db:generate

# 7. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur **[http://localhost:3000](http://localhost:3000)** 🎉

---

## ⚙️ Configuration

### 1. Base de données PostgreSQL

Créez une base de données PostgreSQL :

```bash
# Connectez-vous à PostgreSQL
psql -U postgres

# Créez la base de données
CREATE DATABASE epikodi;

# Créez un utilisateur (optionnel)
CREATE USER epikodi_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE epikodi TO epikodi_user;
```

### 2. Configuration `.env`

Éditez le fichier `.env` avec vos paramètres :

```env
# Database (OBLIGATOIRE)
DATABASE_URL="postgresql://username:password@localhost:5432/epikodi"

# TheMovieDB API (OBLIGATOIRE)
# Obtenez votre clé API sur: https://www.themoviedb.org/settings/api
TMDB_API_KEY="votre_cle_api_tmdb"
TMDB_BASE_URL="https://api.themoviedb.org/3"

# Media Path (OBLIGATOIRE)
# Chemin absolu vers votre dossier de médias
MEDIA_PATH="/chemin/vers/vos/medias"

# Redis Cache (OPTIONNEL - recommandé pour la production)
# REDIS_URL="redis://localhost:6379"

# NextAuth (pour authentification - en développement)
NEXTAUTH_SECRET="généré-avec-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
PORT=3000
```

### 3. Obtenir une clé API TMDB

1. Créez un compte sur [TheMovieDB](https://www.themoviedb.org/signup)
2. Allez dans **Paramètres** → **API**
3. Demandez une clé API (gratuite)
4. Copiez la clé dans votre fichier `.env`

### 4. Préparer vos médias

Organisez vos fichiers dans le dossier configuré dans `MEDIA_PATH` :

```
/media/
├── Avatar (2009).mp4
├── Inception (2010).mp4
├── The Matrix (1999).mp4
├── Music/
│   ├── Song1.mp3
│   └── Song2.flac
└── ...
```

**Formats supportés** :
- 🎬 **Vidéo** : .mp4, .mkv, .avi, .mov, .webm, .flv
- 🎵 **Audio** : .mp3, .flac, .wav, .aac, .ogg, .m4a
- 🖼️ **Image** : .jpg, .jpeg, .png, .gif, .webp

**Nommage recommandé** : `Titre (Année).extension`
- ✅ `Avatar (2009).mp4`
- ✅ `Inception (2010).mkv`
- ❌ `film1.mp4`

---

## 💡 Utilisation

### 1. Scanner vos médias

1. Lancez l'application : `npm run dev`
2. Allez sur [http://localhost:3000/scan](http://localhost:3000/scan)
3. Cliquez sur **"Lancer le scan"**
4. Attendez que le scan se termine
5. Les métadonnées seront automatiquement récupérées depuis TMDB

**Via API** :
```bash
curl -X POST http://localhost:3000/api/media/scan \
  -H "Content-Type: application/json" \
  -d '{"path": "/chemin/vers/medias"}'
```

### 2. Explorer la bibliothèque

- Allez sur [http://localhost:3000/library](http://localhost:3000/library)
- Utilisez la barre de recherche
- Filtrez par catégorie (Films, Séries, Musique)
- Cliquez sur un média pour voir les détails

### 3. Regarder un média

1. Cliquez sur un média dans la bibliothèque
2. Page détail s'ouvre avec toutes les infos
3. Cliquez sur **"Lecture"**
4. Lecteur plein écran avec contrôles

### 4. Commandes disponibles

```bash
# Développement
npm run dev          # Lancer en mode développement

# Production
npm run build        # Compiler l'application
npm start            # Lancer en production

# Base de données
npm run db:push      # Synchroniser le schéma Prisma
npm run db:studio    # Ouvrir Prisma Studio (GUI)
npm run db:generate  # Générer le client Prisma

# Qualité du code
npm run lint         # Vérifier le code avec ESLint
```

---

## 📁 Structure du projet

```
EpiKodi/
├── 📂 src/
│   ├── 📂 app/                    # Pages Next.js (App Router)
│   │   ├── 📂 api/                # Routes API
│   │   │   ├── 📂 media/          # Endpoints médias
│   │   │   │   ├── route.ts       # GET /api/media (liste)
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   ├── route.ts   # GET/DELETE /api/media/:id
│   │   │   │   │   └── 📂 stream/
│   │   │   │   │       └── route.ts # GET /api/media/:id/stream
│   │   │   │   └── 📂 scan/
│   │   │   │       └── route.ts   # POST /api/media/scan
│   │   │   └── 📂 playlists/
│   │   ├── 📂 library/            # Page bibliothèque
│   │   ├── 📂 media/[id]/         # Page détail média
│   │   ├── 📂 scan/               # Page scanner
│   │   ├── page.tsx               # Page d'accueil
│   │   ├── layout.tsx             # Layout principal
│   │   └── globals.css            # Styles globaux
│   ├── 📂 components/             # Composants React
│   │   ├── MediaCard.tsx          # Carte média
│   │   ├── VideoPlayer.tsx        # Lecteur vidéo
│   │   ├── Navigation.tsx         # Barre de navigation
│   │   └── Providers.tsx          # Providers (React Query)
│   ├── 📂 lib/                    # Utilitaires
│   │   ├── prisma.ts              # Client Prisma
│   │   ├── redis.ts               # Client Redis
│   │   └── utils.ts               # Fonctions utilitaires
│   ├── 📂 services/               # Services métier
│   │   ├── tmdb.service.ts        # Service TheMovieDB
│   │   └── media-scan.service.ts  # Service de scan
│   └── 📂 types/                  # Types TypeScript
│       └── index.ts               # Types globaux
├── 📂 prisma/
│   └── schema.prisma              # Schéma de base de données
├── 📂 media/                      # Dossier des médias (exemple)
├── 📂 public/                     # Fichiers statiques
├── 📄 package.json                # Dépendances npm
├── 📄 tsconfig.json               # Config TypeScript
├── 📄 tailwind.config.ts          # Config Tailwind
├── 📄 next.config.js              # Config Next.js
├── 📄 .env.example                # Exemple de configuration
├── 📄 README.md                   # Ce fichier
└── 📄 LICENSE                     # Licence MIT
```

---

## 🔌 API Endpoints

### Médias

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `GET` | `/api/media` | Liste paginée des médias | `?page=1&pageSize=20&search=titre&category=MOVIE` |
| `GET` | `/api/media/:id` | Détails d'un média | - |
| `GET` | `/api/media/:id/stream` | Streamer un média | - |
| `POST` | `/api/media/scan` | Scanner le dossier | `{ "path": "/chemin" }` |
| `DELETE` | `/api/media/:id` | Supprimer un média | - |

### Playlists (en développement)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/playlists` | Liste des playlists |
| `POST` | `/api/playlists` | Créer une playlist |
| `PUT` | `/api/playlists/:id` | Modifier une playlist |
| `DELETE` | `/api/playlists/:id` | Supprimer une playlist |

### Exemples de requêtes

**Lister tous les films :**
```bash
curl http://localhost:3000/api/media?category=MOVIE
```

**Rechercher un média :**
```bash
curl "http://localhost:3000/api/media?search=matrix"
```

**Scanner les médias :**
```bash
curl -X POST http://localhost:3000/api/media/scan \
  -H "Content-Type: application/json"
```

---

## 👨‍� Développement

### Contribuer au projet

1. **Forkez** le repository
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add: Amazing Feature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Guidelines

- Utilisez TypeScript pour tout nouveau code
- Suivez les conventions de nommage existantes
- Commentez le code complexe
- Testez vos changements avant de commit
- Respectez l'architecture du projet

### Ouvrir une issue

Vous avez trouvé un bug ou avez une suggestion ? [Créez une issue](https://github.com/Shundays06/EpiKodi/issues/new) !

---

## 🤝 Contribution

Les contributions sont **grandement appréciées** ! 🎉

Consultez les [issues ouvertes](https://github.com/Shundays06/EpiKodi/issues) pour voir les fonctionnalités planifiées.

### Roadmap

- [ ] � Authentification utilisateur (NextAuth)
- [ ] ❤️ Système de favoris
- [ ] 📝 Playlists personnalisées
- [ ] ⭐ Notations utilisateur
- [ ] 💬 Commentaires et avis
- [ ] 🎵 Intégration MusicBrainz
- [ ] 🧪 Tests unitaires et E2E
- [ ] 🔄 CI/CD avec GitHub Actions
- [ ] 🐳 Docker Compose pour déploiement facile
- [ ] 📱 Application mobile (React Native)

---

## �📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Shundays06**
- GitHub: [@Shundays06](https://github.com/Shundays06)
- Projet: [EpiKodi](https://github.com/Shundays06/EpiKodi)

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Le framework React pour la production
- [TheMovieDB](https://www.themoviedb.org/) - API de métadonnées
- [Prisma](https://www.prisma.io/) - ORM moderne pour TypeScript
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Lucide](https://lucide.dev/) - Bibliothèque d'icônes

---

<div align="center">

⭐ **Si vous aimez ce projet, n'hésitez pas à lui donner une étoile !** ⭐

Made with ❤️ by [Shundays06](https://github.com/Shundays06)

</div>
