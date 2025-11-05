# 🚀 Guide de Démarrage Rapide - EpiKodi

Ce guide vous aidera à démarrer rapidement avec EpiKodi.

---

## ⚡ Installation Express (5 minutes)

```bash
# 1. Cloner et installer
git clone https://github.com/Shundays06/EpiKodi.git
cd EpiKodi
npm install

# 2. Configuration base de données
# Créer une base PostgreSQL nommée "epikodi"
createdb epikodi

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# 4. Initialiser la base
npm run db:push

# 5. Lancer l'app
npm run dev
```

Accédez à http://localhost:3000 🎉

---

## 📋 Checklist de Configuration

### Obligatoire ✅
- [ ] PostgreSQL installé et base "epikodi" créée
- [ ] `.env` configuré avec DATABASE_URL
- [ ] Clé API TMDB obtenue et configurée dans .env
- [ ] MEDIA_PATH pointant vers votre dossier de médias
- [ ] `npm install` exécuté
- [ ] `npm run db:push` exécuté

### Optionnel ⚠️
- [ ] Redis installé (pour le cache TMDB)
- [ ] NEXTAUTH_SECRET généré (pour l'auth)

---

## 🎯 Premiers Pas

### 1. Scanner vos médias
1. Allez sur http://localhost:3000/scan
2. Cliquez "Lancer le scan"
3. Attendez que le scan se termine
4. Les métadonnées TMDB seront récupérées automatiquement

### 2. Créer un compte
1. Allez sur http://localhost:3000/auth/signup
2. Inscrivez-vous avec email/password
3. Connectez-vous

### 3. Explorer et ajouter des favoris
1. Allez dans la bibliothèque
2. Cliquez sur un média
3. Cliquez sur le bouton ❤️ pour ajouter aux favoris
4. Retrouvez vos favoris dans l'onglet "Favoris"

---

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev              # Lancer le serveur de dev

# Base de données
npm run db:push          # Synchroniser le schéma Prisma
npm run db:studio        # Ouvrir Prisma Studio (interface graphique)
npm run db:generate      # Regénérer le client Prisma

# Production
npm run build            # Compiler pour la production
npm start                # Lancer en mode production

# Qualité du code
npm run lint             # Vérifier le code
```

---

## 🗂️ Structure Importante

```
src/
├── app/
│   ├── api/                # Routes API
│   │   ├── auth/           # Authentification
│   │   ├── favorites/      # Gestion favoris
│   │   ├── media/          # Gestion médias
│   │   └── playlists/      # Gestion playlists
│   ├── auth/               # Pages auth (login/signup)
│   ├── favorites/          # Page favoris
│   ├── library/            # Page bibliothèque
│   └── media/[id]/         # Page détail média
├── components/             # Composants réutilisables
├── lib/                    # Utilitaires (prisma, redis, utils)
└── services/               # Services (TMDB, scan)
```

---

## 🎨 Fonctionnalités Disponibles

### ✅ Fonctionnel maintenant
- Scanner de médias locaux
- Lecteur vidéo/audio
- Enrichissement métadonnées TMDB
- Recherche et filtres
- Authentification (login/register)
- Système de favoris
- Page détail complète

### 🚧 En développement
- Playlists personnalisées (backend OK, UI à faire)
- Système de notation
- Commentaires utilisateurs

---

## 🐛 Résolution de Problèmes

### Le scan ne trouve pas les médias
- Vérifiez que `MEDIA_PATH` dans `.env` pointe vers le bon dossier
- Vérifiez les permissions du dossier
- Format de nommage recommandé : `Titre (Année).extension`

### Erreur de connexion base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez `DATABASE_URL` dans `.env`
- Testez la connexion : `psql -U username -d epikodi`

### Les métadonnées TMDB ne se chargent pas
- Vérifiez `TMDB_API_KEY` dans `.env`
- Testez votre clé sur https://www.themoviedb.org/
- Vérifiez les logs serveur pour les erreurs

### L'authentification ne fonctionne pas
- Vérifiez que `NEXTAUTH_SECRET` est défini dans `.env`
- Générez-en un nouveau : `openssl rand -base64 32`
- Redémarrez le serveur après modification

---

## 📚 Ressources

- **Documentation Prisma** : https://www.prisma.io/docs
- **Next.js Docs** : https://nextjs.org/docs
- **TMDB API** : https://developers.themoviedb.org/3
- **NextAuth.js** : https://next-auth.js.org/

---

## 🤝 Besoin d'Aide ?

- Consultez le README.md complet
- Lisez le PROJECT_SUMMARY.md pour l'analyse détaillée
- Ouvrez une issue sur GitHub
- Consultez les logs du serveur (terminal)

---

## 📝 Notes

- Le premier scan peut prendre quelques minutes
- Les métadonnées sont mises en cache
- L'authentification est requise pour les favoris
- Redis est optionnel mais recommandé pour la production

---

**Version** : 1.0.0  
**Dernière mise à jour** : 5 novembre 2025

**Bon développement ! 🎬**
