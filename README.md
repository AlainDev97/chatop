# ChaTop — API Back-end NestJS

Back-end de l'application **ChaTop**, développé dans le cadre du projet OpenClassrooms  
**« Modélisez et implémentez le back-end en utilisant du code NestJS maintenable »**.

Le front-end React est fourni avec le projet et ne doit pas être modifié.  
Cette API reproduit les routes définies dans l'environnement Mockoon et utilise **NestJS**, **Prisma**, **MySQL**, **Passport/JWT** et **Swagger**.

---

## Stack technique

- Node.js 22 LTS
- TypeScript 5.7+
- NestJS 11
- Prisma 7
- MySQL 8
- Passport + JWT
- bcrypt
- Swagger / OpenAPI
- Multer pour l'upload des images

---

## Prérequis

Avant de démarrer, installer :

- Node.js 22 LTS
- npm
- MySQL 8
- Git

Vérifier les versions :

```bash
node -v
npm -v
mysql --version
```

---

## Installation du back-end

Se placer dans le dossier `backend` :

```bash
cd backend
```

Installer les dépendances :

```bash
npm install
```

---

## Configuration de la base de données

### 1. Créer la base

La base utilisée par le projet est :

```text
chatop_db
```

Le schéma SQL fourni avec le projet peut être importé depuis MySQL :

```sql
source ./ressources/sql/schema.sql;
```

Une fois le script exécuté, vérifier les tables :

```sql
USE chatop_db;
SHOW TABLES;
```

Les tables principales sont :

- `users`
- `rentals`
- `messages`

### 2. Créer un utilisateur MySQL dédié

L'application ne doit pas utiliser le compte `root`.

Exemple :

```sql
CREATE USER 'chatop_user'@'localhost'
IDENTIFIED BY 'VOTRE_MOT_DE_PASSE';

GRANT SELECT, INSERT, UPDATE, DELETE
ON chatop_db.*
TO 'chatop_user'@'localhost';

FLUSH PRIVILEGES;
```

---

## Variables d'environnement

Créer un fichier `.env` dans le dossier `backend`.

Exemple :

```env
DATABASE_URL="mysql://chatop_user:VOTRE_MOT_DE_PASSE@localhost:3306/chatop_db"

DB_HOST=localhost
DB_PORT=3306
DB_USER=chatop_user
DB_PASSWORD="VOTRE_MOT_DE_PASSE"
DB_NAME=chatop_db

JWT_SECRET="VOTRE_CLE_SECRETE_JWT"
JWT_EXPIRES_IN=24h
```

> Si le mot de passe contient des caractères spéciaux dans `DATABASE_URL`, ils doivent être encodés dans l'URL.  
> Exemple : `#` devient `%23`.

Le fichier `.env` ne doit jamais être versionné.

Le `.gitignore` doit notamment contenir :

```gitignore
.env
node_modules/
uploads/*
!uploads/.gitkeep
```

---

## Prisma

Le projet utilise Prisma avec MySQL.

Le schéma se trouve dans :

```text
prisma/schema.prisma
```

La configuration Prisma se trouve dans :

```text
prisma7.config.ts
```

Pour introspecter la base existante :

```bash
npx prisma db pull
```

Puis générer le client Prisma :

```bash
npx prisma generate
```

---

## Lancer l'API

En développement :

```bash
npm run start:dev
```

L'API est disponible sur :

```text
http://localhost:3001
```

Toutes les routes de l'API utilisent le préfixe :

```text
/api
```

---

## Documentation Swagger

Swagger est disponible à l'adresse :

```text
http://localhost:3001/api-docs
```

La documentation Swagger est accessible sans authentification.

Pour tester une route protégée :

1. Se connecter avec `/api/auth/login`
2. Copier le token JWT retourné
3. Cliquer sur **Authorize** dans Swagger
4. Coller le token
5. Tester les routes protégées

---

## Authentification et sécurité

L'API utilise une authentification JWT.

Routes publiques :

- `POST /api/auth/register`
- `POST /api/auth/login`
- Swagger

Toutes les autres routes nécessitent un token JWT valide.

Le token doit être envoyé dans le header :

```http
Authorization: Bearer <token>
```

Les mots de passe utilisateurs sont hashés avec **bcrypt** avant leur stockage en base.

Les credentials de la base de données sont stockés dans les variables d'environnement et ne sont jamais écrits directement dans le code.

Des contrôles d'autorisation sont également appliqués :

- un utilisateur ne peut récupérer que ses propres informations via `/api/user/:id`;
- l'auteur d'un message est déterminé à partir du JWT et non à partir d'un `user_id` fourni par le client;
- seul le propriétaire d'une location peut modifier cette location.

---

## Routes disponibles

| Méthode | Route | Description | Authentification |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | Non |
| POST | `/api/auth/login` | Se connecter | Non |
| GET | `/api/auth/me` | Récupérer l'utilisateur connecté | Oui |
| GET | `/api/rentals` | Récupérer toutes les locations | Oui |
| GET | `/api/rentals/:id` | Récupérer une location par ID | Oui |
| POST | `/api/rentals` | Créer une location | Oui |
| PUT | `/api/rentals/:id` | Modifier une location | Oui |
| GET | `/api/user/:id` | Récupérer ses informations utilisateur | Oui |
| POST | `/api/messages` | Envoyer un message | Oui |

---

## Upload des images

La création d'une location nécessite une image.

Les routes suivantes utilisent :

```text
multipart/form-data
```

- `POST /api/rentals`
- `PUT /api/rentals/:id`

Pour créer une location, les champs sont :

```text
name
surface
price
picture
description
```

Les fichiers sont stockés localement dans :

```text
uploads/
```

L'URL de l'image est ensuite enregistrée dans la base de données.

Exemple :

```text
http://localhost:3001/uploads/image.jpg
```

---

## Architecture

L'application suit une architecture modulaire NestJS avec séparation des responsabilités :

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
MySQL
```

Structure simplifiée :

```text
backend/
├── src/
│   ├── auth/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── types/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── jwt.strategy.ts
│   ├── users/
│   ├── rentals/
│   ├── messages/
│   ├── prisma/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── generated/
│   └── prisma/
├── uploads/
├── .env
├── .gitignore
├── prisma7.config.ts
└── package.json
```

---

## Tests manuels recommandés

Avant livraison, vérifier notamment :

- création d'un compte ;
- refus d'un email déjà utilisé ;
- connexion avec de bons identifiants ;
- refus d'un mauvais mot de passe ;
- récupération de `/api/auth/me` avec un JWT ;
- réponse `401` sans JWT ;
- récupération des locations ;
- récupération d'une location par ID ;
- création d'une location avec image ;
- modification d'une location par son propriétaire ;
- refus de modification par un autre utilisateur ;
- refus d'accès aux informations d'un autre utilisateur ;
- envoi d'un message ;
- vérification des routes depuis Swagger.

---

## Build

Vérifier que le projet compile correctement :

```bash
npm run build
```

Pour lancer la version de production :

```bash
npm run start:prod
```

---

## Front-end

Le front-end React fourni dans le projet doit être utilisé pour tester l'API.

L'API attend les appels sur :

```text
http://localhost:3001
```

Le front-end ne doit pas être modifié dans le cadre de ce projet.

---

## Auteur

Projet réalisé dans le cadre du parcours OpenClassrooms **Lead Developer JavaScript**.
