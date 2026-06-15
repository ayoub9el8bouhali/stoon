# ST00N

ST00N est une plateforme web full-stack pour la vie étudiante au Maroc : colocation, marketplace, covoiturage, événements, services, stages, jobs, messagerie, avis, favoris, réservations et administration.

## Stack

- Frontend : HTML5, CSS3, Bootstrap 5 et JavaScript ES6+ vanilla
- Backend : Node.js, Express.js, architecture MVC, JWT, Multer, Helmet, Rate Limit, Zod
- Chatbot : Python local, connaissances JSON et historique texte
- Base de données : MySQL, MySQL2, Sequelize, phpMyAdmin

## Structure

```txt
stoon/
├── frontend/
│   ├── index.html
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── pages/
├── backend/
│   ├── chatbot/
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

Avec Docker, configurez `DB_PORT=3307` dans `backend/.env`, puis ouvrez phpMyAdmin :

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

## Catalogue académique

Les sources du catalogue Région → Ville → Établissement → Filière sont conservées dans
`backend/database/sources`. Pour régénérer le seed SQL et la copie locale utilisée par le frontend :

```bash
cd stoon/backend
npm run db:academic:generate
npm run db:academic:test
npm run db:academic
```

La commande `db:academic` reconstruit les tables académiques puis importe le catalogue généré.

## Lancement

Le backend Node.js sert directement les pages HTML du frontend :

```bash
cd stoon/backend
npm install
npm start
```

URL locale par défaut :

- Application : `http://localhost:5000`
- API : `http://localhost:5000/api`
- Santé API : `http://localhost:5000/api/health`
- Chatbot Python : `POST http://localhost:5000/api/chatbot/ask`

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
- `frontend/src/assets/logos/stoon-logo-full.svg`
