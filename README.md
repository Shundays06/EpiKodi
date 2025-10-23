# 🎬 EpiKodi

Une application multimédia moderne inspirée de Kodi, développée avec Next.js, Node.js et PostgreSQL.

## 🌟 Fonctionnalités

- 📺 **Lecteur multimédia** : Support vidéo et audio avec contrôles avancés
- 📁 **Bibliothèque locale** : Scan et indexation des fichiers depuis `/media`
- 🎨 **Métadonnées enrichies** : Intégration TheMovieDB API
- 🚀 **Performances optimisées** : Système de cache Redis
- 📱 **Interface responsive** : Design moderne avec TailwindCSS
- 🔐 **Authentification** : Gestion des utilisateurs avec NextAuth
- 🎭 **Organisation** : Playlists et collections personnalisées

## 🛠️ Technologies

- **Frontend** : Next.js 14, React 18, TailwindCSS
- **Backend** : Node.js, Express
- **Base de données** : PostgreSQL, Prisma ORM
- **Cache** : Redis
- **APIs externes** : TheMovieDB
- **CI/CD** : GitHub Actions

## 🚀 Installation

### Prérequis

- Node.js 18+
- PostgreSQL
- Redis (optionnel)

### Étapes

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
# Éditer .env avec vos configurations
```

4. **Initialiser la base de données**
```bash
npm run db:push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
EpiKodi/
├── src/
│   ├── app/              # Pages Next.js (App Router)
│   ├── components/       # Composants React réutilisables
│   ├── lib/             # Utilitaires et configurations
│   ├── services/        # Services API externes
│   └── types/           # Types TypeScript
├── prisma/              # Schéma et migrations
├── public/              # Fichiers statiques
└── uploads/             # Fichiers uploadés
```

## 🎯 Utilisation

### Ajouter des médias

1. Placer vos fichiers vidéo/audio dans le dossier `/media`
2. Aller dans "Bibliothèque" > "Scanner les médias"
3. L'application détectera et enrichira automatiquement les métadonnées

### API Endpoints

- `GET /api/media` - Liste des médias
- `GET /api/media/:id` - Détails d'un média
- `POST /api/media/scan` - Scanner le dossier local
- `GET /api/metadata/:id` - Métadonnées enrichies

## 🧪 Tests

```bash
npm test
```

## 📦 Build

```bash
npm run build
npm start
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir les [issues](https://github.com/Shundays06/EpiKodi/issues) pour les fonctionnalités planifiées.

## 📄 Licence

MIT - Voir le fichier [LICENSE](LICENSE)

## 👨‍💻 Auteur

**Shundays06** - [GitHub](https://github.com/Shundays06)

---

⭐ N'hésitez pas à laisser une étoile si ce projet vous plaît !
