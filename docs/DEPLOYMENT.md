# Hébergement STOON

STOON a besoin d'un hébergement qui supporte Node.js, Python et MySQL.
Un hébergement statique seul ne suffit pas, parce que la connexion, les offres,
la messagerie et le chatbot utilisent l'API Node.js et la base MySQL.

## Option recommandée : VPS ou hébergement Docker

1. Copier l'exemple d'environnement :

```bash
cp .env.production.example .env
```

2. Modifier `.env` :

```env
FRONTEND_URL=https://votre-domaine.com
DB_PASSWORD=mot_de_passe_mysql_solide
JWT_SECRET=secret_long_et_unique
```

3. Lancer STOON :

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

4. Ouvrir :

- Site : `http://IP_DU_SERVEUR:5001`
- phpMyAdmin : `http://IP_DU_SERVEUR:8080`

## Variables importantes

```env
NODE_ENV=production
APP_PORT=5001
FRONTEND_URL=https://votre-domaine.com
DB_NAME=stoon_db
DB_USER=root
DB_PASSWORD=...
JWT_SECRET=...
PYTHON_BIN=python3
STOON_CHATBOT_KNOWLEDGE=/app/data/connaissances.json
STOON_CHATBOT_HISTORY=/app/data/historique.txt
```

## Base de données

La structure de la base n'est pas modifiée. Sur un nouveau serveur, Docker
importe automatiquement les fichiers SQL existants au premier démarrage de MySQL.
Si vous utilisez une base déjà existante, gardez les mêmes tables et renseignez
simplement `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` et `DB_PASSWORD`.

## Plateformes compatibles

- VPS avec Docker : recommandé.
- Hostinger VPS : compatible.
- Railway ou Render avec MySQL externe : compatible si les variables DB sont configurées.
- GitHub Pages, Netlify statique ou InfinityFree : non compatible pour la version complète.
