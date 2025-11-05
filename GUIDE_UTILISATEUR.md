# 🎬 Guide Utilisateur EpiKodi

## 📋 Table des matières
- [Démarrage rapide](#démarrage-rapide)
- [Fonctionnalités](#fonctionnalités)
- [Gestion des favoris](#gestion-des-favoris)
- [Résolution de problèmes](#résolution-de-problèmes)

## 🚀 Démarrage rapide

### Prérequis
- Docker et Docker Compose installés
- Port 3000, 5432 et 6379 disponibles

### Lancement de l'application

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

### Accès à l'application
- **Interface web** : http://localhost:3000
- **Base de données PostgreSQL** : localhost:5432
- **Redis** : localhost:6379

### Premier compte utilisateur

1. Aller sur http://localhost:3000/auth/signup
2. Remplir le formulaire :
   - Email : votre@email.com
   - Nom : Votre Nom
   - Mot de passe : minimum 8 caractères
3. Cliquer sur "S'inscrire"
4. Vous serez automatiquement connecté

## ✨ Fonctionnalités

### 📁 Scanner des médias

1. Aller sur http://localhost:3000/scan
2. Cliquer sur "Scanner les médias"
3. L'application va :
   - Parcourir le dossier `/media`
   - Détecter les fichiers vidéo et audio
   - Enrichir automatiquement les métadonnées via TMDB
   - Ajouter les médias à votre bibliothèque

### 📚 Bibliothèque

**Accès** : http://localhost:3000/library

Fonctionnalités :
- **Recherche** : Barre de recherche en temps réel
- **Filtres** :
  - Type : Vidéo, Audio, Tous
  - Catégorie : Film, Série TV, Musique, Autre
- **Pagination** : 20 éléments par page
- **Tri automatique** : Les plus récents en premier

### 🎬 Lecture de médias

1. Cliquer sur une carte média dans la bibliothèque
2. Sur la page de détail :
   - **Bouton "Lecture"** : Lance le lecteur vidéo/audio
   - **Informations affichées** :
     - Synopsis (si disponible)
     - Note TMDB
     - Année de sortie
     - Durée
     - Genres
     - Distribution (acteurs)
     - Directeur/Producteurs

### ❤️ Gestion des favoris

#### Ajouter un favori
1. Aller sur la page d'un média
2. Cliquer sur le bouton **❤️ Favoris**
3. Le cœur devient plein et coloré
4. Message de confirmation dans la console

#### Voir vos favoris
1. Aller sur http://localhost:3000/favorites
2. Tous vos médias favoris s'affichent
3. Cliquer sur une carte pour accéder au média

#### Retirer un favori
1. Sur la page du média favori
2. Cliquer à nouveau sur le bouton **❤️ Favori**
3. Le cœur redevient vide
4. Le média est retiré de vos favoris

> **Note** : Après avoir ajouté/retiré un favori, la liste se met à jour automatiquement grâce à React Query.

### 🎭 Métadonnées enrichies

L'application utilise **TheMovieDB (TMDB)** pour enrichir automatiquement vos médias :

**Pour les films** :
- Affiche (poster)
- Image de fond (backdrop)
- Synopsis
- Note des utilisateurs
- Distribution
- Réalisateur et producteurs
- Budget et revenus
- Langues
- Date de sortie

**Pour les séries TV** :
- Mêmes informations que les films
- Créateurs
- Durée des épisodes

**Pour la musique** :
- Métadonnées de base
- Durée
- Format audio

## 🔧 Commandes utiles

### Gestion des containers

```bash
# Voir les logs en temps réel
docker-compose logs -f app

# Voir les logs d'un service spécifique
docker-compose logs -f postgres
docker-compose logs -f redis

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ SUPPRIME LA BASE DE DONNÉES)
docker-compose down -v

# Redémarrer un service
docker-compose restart app

# Voir l'état des services
docker-compose ps

# Entrer dans le container de l'application
docker-compose exec app sh

# Entrer dans PostgreSQL
docker-compose exec postgres psql -U epikodi -d epikodi
```

### Gestion de la base de données

```bash
# Appliquer le schéma Prisma
docker-compose exec app npx prisma db push

# Voir les données dans Prisma Studio
docker-compose exec app npx prisma studio

# Générer le client Prisma (après modification du schéma)
docker-compose exec app npx prisma generate
```

### Rebuild après modifications

```bash
# Rebuild complet
docker-compose up --build -d

# Rebuild sans cache (si problèmes persistants)
docker-compose build --no-cache
docker-compose up -d
```

## 🐛 Résolution de problèmes

### Erreur 500 lors de l'ajout aux favoris

**Symptôme** : `TypeError: Do not know how to serialize a BigInt`

**Solution** : Cette erreur a été corrigée. Si elle persiste :
```bash
docker-compose down
docker-compose up --build -d
```

### Images ne se chargent pas (erreur 400)

**Symptôme** : Erreur `Failed to load resource: 400 Bad Request` pour les images

**Cause** : Médias sans métadonnées TMDB

**Solution** : 
- Un placeholder SVG est automatiquement affiché
- Pour avoir des affiches, assurez-vous que TMDB_API_KEY est configuré
- Rescannez les médias après avoir configuré la clé API

### Prisma n'arrive pas à se connecter

**Symptôme** : `Error loading shared library libssl.so`

**Solution** : Déjà corrigé dans le Dockerfile (installation d'OpenSSL)
```bash
docker-compose up --build -d
```

### Les favoris ne se mettent pas à jour

**Symptôme** : Doit recharger la page pour voir les changements

**Solution** : Déjà corrigé avec React Query `invalidateQueries`
- Vérifiez que vous êtes connecté
- Si le problème persiste, videz le cache du navigateur (Cmd+Shift+R)

### Port déjà utilisé

**Symptôme** : `Error: bind: address already in use`

**Solution** :
```bash
# Trouver le processus qui utilise le port
lsof -i :3000  # ou :5432, :6379

# Tuer le processus
kill -9 <PID>

# Ou changer les ports dans docker-compose.yml
```

### Base de données corrompue

**Solution** :
```bash
# Supprimer et recréer la base
docker-compose down -v
docker-compose up -d
docker-compose exec app npx prisma db push
```

### Logs pour debug

```bash
# Logs de l'application
docker logs epikodi-app --tail 100

# Logs avec recherche
docker logs epikodi-app 2>&1 | grep "Error"

# Logs en temps réel
docker-compose logs -f app
```

## 📊 Variables d'environnement

Fichier `.env` :

```env
# Base de données
DATABASE_URL=postgresql://epikodi:epikodi@postgres:5432/epikodi

# NextAuth
NEXTAUTH_SECRET=votre-secret-super-securise-ici
NEXTAUTH_URL=http://localhost:3000

# TMDB API (optionnel mais recommandé)
TMDB_API_KEY=votre-cle-api-tmdb
TMDB_BASE_URL=https://api.themoviedb.org/3

# Redis (optionnel)
REDIS_URL=redis://redis:6379

# Chemin des médias
MEDIA_PATH=/media

# Node
NODE_ENV=production
```

### Obtenir une clé TMDB

1. Aller sur https://www.themoviedb.org/
2. Créer un compte
3. Aller dans Paramètres → API
4. Demander une clé API (gratuite)
5. Copier la clé dans `.env`

## 🎯 Prochaines fonctionnalités

- [ ] **Playlists** : Créer et gérer des playlists personnalisées
- [ ] **Historique** : Voir l'historique de visionnage
- [ ] **Reprise de lecture** : Reprendre là où vous vous êtes arrêté
- [ ] **Commentaires et notes** : Noter et commenter les médias
- [ ] **Partage** : Partager des médias avec d'autres utilisateurs
- [ ] **Mode sombre/clair** : Basculer entre les thèmes

## 📞 Support

En cas de problème :
1. Consulter ce guide
2. Vérifier les logs : `docker-compose logs -f app`
3. Vérifier le statut des services : `docker-compose ps`
4. Rebuild si nécessaire : `docker-compose up --build -d`

---

**Version** : 1.0.0  
**Dernière mise à jour** : Novembre 2025
