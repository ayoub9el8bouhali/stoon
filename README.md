# ST00N

ST00N est une plateforme web full-stack pour la vie étudiante au Maroc : colocation, marketplace, covoiturage, événements, services, stages, jobs, messagerie, avis, favoris, réservations et administration.

## Stack

- Frontend : React.js, React Router DOM, Context API, Axios, Bootstrap 5, JavaScript ES6+
- Backend : Node.js, Express.js, architecture MVC, JWT, Multer, Helmet, Rate Limit, Zod
- Base de données : MySQL, MySQL2, Sequelize, phpMyAdmin

## Structure

```txt
stoon/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── styles/
│       └── utils/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   └── utils/
└── README.md
```

## Installation backend

```bash
cd stoon/backend
npm install
copy .env.example .env
npm run db:sync
npm run db:seed
npm run dev
```

Configurez `backend/.env` :

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stoon_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=change_this_secret_for_stoon
JWT_EXPIRES_IN=7d
UPLOAD_MAX_SIZE_MB=8
```

Compte mock créé par `npm run db:seed` :

- Email : `yassine@stoon.ma`
- Mot de passe : `Stoon2026!`
- Rôle : `admin`

## Configuration MySQL et phpMyAdmin

Option Docker :

```bash
cd stoon
docker compose up -d
```

Puis ouvrez phpMyAdmin :

- URL : `http://localhost:8080`
- Serveur : `mysql`
- Utilisateur : `root`
- Mot de passe : vide

Option locale :

1. Lancez MySQL via XAMPP, WAMP, Laragon ou Docker.
2. Ouvrez phpMyAdmin.
3. Créez une base `stoon_db` en `utf8mb4_unicode_ci`, ou importez `backend/database/schema.sql`.
4. Importez `backend/database/seed.sql` pour des données mock rapides.
5. Pour des mots de passe hashés automatiquement et garantis compatibles, utilisez plutôt `npm run db:seed`.

## Installation frontend

```bash
cd stoon/frontend
npm install
copy .env.example .env
npm run dev
```

Le build Vite est configuré avec des chunks séparés pour React, Bootstrap, Recharts, Axios et les icônes afin de garder le bundle plus maintenable.

URL locale par défaut :

- Frontend : `http://localhost:5173`
- Backend : `http://localhost:5000/api`
- Santé API : `http://localhost:5000/api/health`

## Routes API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/profile`
- `GET /api/housing`
- `POST /api/housing`
- `GET /api/housing/:id`
- `PUT /api/housing/:id`
- `DELETE /api/housing/:id`
- `POST /api/housing/:id/favorite`
- `POST /api/marketplace`
- `GET /api/marketplace`
- `POST /api/rides/:id/reservations`
- `GET /api/events`
- `POST /api/events/:id/reservations`
- `GET /api/jobs`
- `POST /api/messages/conversations`
- `GET /api/messages/conversations`
- `POST /api/reviews`
- `GET /api/reviews/user/:id`
- `GET /api/admin/stats`

## Modules inclus

- Colocation : CRUD, recherche, filtres, favoris, signalement, images
- Marketplace : vente/achat, catégories, upload images/PDF, pagination, recherche
- Covoiturage : départ, destination, date, places, réservation
- Événements et voyages : création, affiches, réservation, participants simulés
- Jobs et services : stages, jobs étudiants, services freelances
- Messagerie : conversations privées, temps réel simulé côté frontend
- Avis et réputation : notes, commentaires, score utilisateur
- Admin : statistiques, annonces, signalements

## Branding

La palette officielle est définie dans `frontend/src/styles/app.css` :

- Jaune : `#FFD600`
- Magenta : `#D500F9`
- Cyan : `#00E5FF`
- Noir : `#121212`

Le logo ST00N est présent dans :

- `frontend/public/stoon-logo.svg`
- `frontend/src/assets/logos/stoon-logo.svg`

Remplacez ces fichiers par l'image officielle fournie si vous souhaitez utiliser un asset de marque externe.
