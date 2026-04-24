# React + Vite + Express + MySQL + Docker

Architecture avec séparation complète entre Frontend, Backend et Base de données.

# LANCEMENT DU PROJET

cd backend
docker compose up -d --build
cd

## Structure du Projet

d

```
docker-react/
├── frontend/                    # Application React + Vite
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── backend/                     # API Express + MySQL
│   ├── Dockerfile
│   ├── docker-compose.yml      # Inclut MySQL + phpMyAdmin
│   ├── package.json
│   ├── README-MySQL.md         # Documentation MySQL
│   ├── .env.example
│   ├── data/
│   │   └── posts.js            # Données initiales
│   └── src/
│       ├── server.js
│       ├── config/
│       │   └── database.js     # Configuration MySQL
│       ├── init/
│       │   └── initDatabase.js # Migration des données
│       └── routes/
│           └── api.js
│
└── docker-compose.yml          # Orchestration globale
```

## 🚀 Démarrage

### Option 1 : Lancer tous les services ensemble (Recommandé) ⭐

```bash
# À la racine du projet - démarre MySQL, phpMyAdmin, Backend et Frontend
docker-compose up --build
```

**Services disponibles :**

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **phpMyAdmin** : http://localhost:8080
- **MySQL** : localhost:3306

**Identifiants phpMyAdmin :**

- Serveur : `mysql`
- Utilisateur : `root`
- Mot de passe : `rootpassword`

### Option 2 : Lancer Backend avec MySQL et phpMyAdmin uniquement

```bash
cd backend
docker-compose up --build
```

Services disponibles :

- **Backend API** : http://localhost:3000
- **phpMyAdmin** : http://localhost:8080
- **MySQL** : localhost:3306

### Option 3 : Frontend seul

```bash
cd frontend
docker-compose up --build
```

Frontend disponible sur : http://localhost:5173

## 📡 Endpoints API

### Backend (http://localhost:3000)

- `GET /` - Informations sur l'API
- `GET /api/posts` - Récupérer tous les posts avec commentaires
- `GET /api/posts/:id` - Récupérer un post spécifique
- `POST /api/posts` - Créer un nouveau post
- `POST /api/posts/:id/comments` - Ajouter un commentaire
- `PUT /api/posts/:id/like` - Incrémenter les likes
- `POST /api/posts/generate` - Générer manuellement des posts (body: {count: 10})

### Exemples de requêtes

```bash
# Récupérer tous les posts
curl http://localhost:3000/api/posts

# Récupérer un post spécifique
curl http://localhost:3000/api/posts/1

# Créer un nouveau post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "author": "John Doe",
    "image_url": "https://picsum.photos/400/300",
    "content": "Mon nouveau post!"
  }'

# Ajouter un commentaire
curl -X POST http://localhost:3000/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "user": "Jane Doe",
    "comment": "Super post!"
  }'

# Liker un post
curl -X PUT http://localhost:3000/api/posts/1/like

# Générer manuellement 10 posts
curl -X POST http://localhost:3000/api/posts/generate \
  -H "Content-Type: application/json" \
  -d '{"count": 10}'
```

## 🔧 Configuration

### Frontend (Vite)

- Port : 5173
- Proxy API : `/api` → `http://backend:3000`
- Hot reload activé

### Backend (Express)

- Port : 3000
- CORS activé
- Nodemon pour le hot reload
- Connexion MySQL automatique au démarrage

### MySQL

- Port : 3306
- Base de données : `social_media_db`
- Utilisateur : `dbuser`
- Mot de passe : `dbpassword`
- Volume persistant : `mysql-data`

### phpMyAdmin

- Port : 8080
- Interface web pour gérer MySQL
- Accès : http://localhost:8080

## 🛠️ Développement

### Arrêter les conteneurs

```bash
docker-compose down
```

### Reconstruire après modifications

```bash
docker-compose up --build
```

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Frontend uniquement
docker-compose logs -f frontend

# Backend uniquement
docker-compose logs -f backend
```

### Accéder au conteneur

```bash
# Frontend
docker exec -it react-frontend sh

# Backend
docker exec -it express-backend sh
```

## 📦 Technologies

### Frontend

- React 18
- Vite 5
- Docker

### Backend

- Node.js 18
- Express 4
- MySQL 8.0
- mysql2 (driver MySQL)
- CORS
- Nodemon

### Base de données

- MySQL 8.0
- phpMyAdmin (interface web)
- 2 tables : `posts` et `comments`
- Migration automatique des données au démarrage
- **Cron job** : Génération automatique de 10 posts toutes les 5 minutes

## 🌐 Communication Frontend ↔ Backend

Le frontend communique avec le backend via le proxy Vite configuré dans `frontend/vite.config.js` :

```javascript
proxy: {
  '/api': {
    target: 'http://backend:3000',
    changeOrigin: true,
  }
}
```

Cela permet au frontend de faire des requêtes à `/api/*` qui seront automatiquement redirigées vers le backend.

## 🗄️ Base de données

### Structure

**Table `posts`:**

- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- author (VARCHAR)
- image_url (VARCHAR)
- content (TEXT)
- likes (INT)
- created_at (TIMESTAMP)

**Table `comments`:**

- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- post_id (INT, FOREIGN KEY)
- user (VARCHAR)
- comment (TEXT)
- created_at (TIMESTAMP)

### Migration des données

Au premier démarrage, le backend migre automatiquement :

- 30 posts depuis `backend/data/posts.js`
- Tous les commentaires associés

### Génération automatique de posts 🤖

Un cron job s'exécute automatiquement toutes les 5 minutes pour générer 10 nouveaux posts aléatoires avec :

- Auteurs aléatoires
- Contenus variés (React, JavaScript, CSS, etc.)
- Images aléatoires
- 0 à 3 commentaires par post
- Nombre de likes aléatoire

Vous pouvez également générer des posts manuellement via l'API :

```bash
curl -X POST http://localhost:3000/api/posts/generate \
  -H "Content-Type: application/json" \
  -d '{"count": 20}'
```

### Accès à phpMyAdmin

1. Ouvrir http://localhost:8080
2. Se connecter avec :
   - Serveur : `mysql`
   - Utilisateur : `root`
   - Mot de passe : `rootpassword`
3. Sélectionner la base `social_media_db`

Pour plus de détails, voir [backend/README-MySQL.md](backend/README-MySQL.md)

## 📝 Notes

- Les volumes Docker sont configurés pour le hot reload
- Les `node_modules` sont isolés dans des volumes séparés
- Le réseau Docker permet la communication entre les conteneurs
- Le backend attend que MySQL soit prêt (healthcheck) avant de démarrer
- Les données MySQL sont persistées dans un volume Docker
- Le frontend dépend du backend pour assurer le bon ordre de démarrage
