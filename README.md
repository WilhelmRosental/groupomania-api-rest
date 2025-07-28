# Groupomania - Architecture Microservices

## Vue d'ensemble

Groupomania est une application de réseau social d'entreprise construite avec une architecture microservices utilisant Fastify. Le projet est divisé en trois services principaux :

- **API Gateway** (Port 3000) - Point d'entrée unique et routage des requêtes
- **User Service** (Port 3001) - Gestion des utilisateurs et authentification
- **Post Service** (Port 3002) - Gestion des publications et médias

## Architecture

```
Frontend (React) ←→ API Gateway ←→ User Service
                          ↓
                    Post Service
```

## Démarrage rapide

### Prérequis

- Node.js ≥ 20.0.0
- npm ≥ 8.0.0
- PostgreSQL

### Installation

```bash
# Installer toutes les dépendances
npm run install:all

# Configurer les bases de données
npm run db:migrate:all
```

### Démarrage

```bash
# Démarrer tous les services
npm run start:all

# Ou en mode développement
npm run dev:all
```

### Services individuels

```bash
# User Service
cd user-service && npm start

# Post Service
cd post-service && npm start

# API Gateway
cd api-gateway && npm start
```

## Structure du projet

```
groupomania-api-rest/
├── api-gateway/          # API Gateway (Port 3000)
│   ├── app.js           # Configuration Fastify
│   ├── server.js        # Point d'entrée
│   └── package.json
├── user-service/        # Service utilisateurs (Port 3001)
│   ├── app.js          # Configuration Fastify
│   ├── server.js       # Point d'entrée
│   ├── routes/         # Routes utilisateurs
│   ├── models/         # Modèles Sequelize
│   └── package.json
├── post-service/        # Service publications (Port 3002)
│   ├── app.js          # Configuration Fastify
│   ├── server.js       # Point d'entrée
│   ├── routes/         # Routes publications
│   ├── models/         # Modèles Sequelize
│   ├── images/         # Stockage fichiers
│   └── package.json
└── package.json         # Scripts de gestion globaux
```

## Scripts disponibles

| Script                   | Description                               |
| ------------------------ | ----------------------------------------- |
| `npm run start:all`      | Démarre tous les services                 |
| `npm run dev:all`        | Mode développement pour tous les services |
| `npm run db:migrate:all` | Applique les migrations de toutes les BDD |
| `npm run db:reset`       | Remet à zéro toutes les BDD               |
| `npm run test:all`       | Lance tous les tests                      |

## Configuration

Chaque service peut être configuré via des variables d'environnement :

- `USER_SERVICE_PORT` (défaut: 3001)
- `POST_SERVICE_PORT` (défaut: 3002)
- `API_GATEWAY_PORT` (défaut: 3000)
- `HOST` (défaut: 0.0.0.0)

## Technologies utilisées

- **Fastify** - Framework web rapide et efficace
- **PostgreSQL** - Base de données relationnelle
- **Sequelize** - ORM pour Node.js
- **JWT** - Authentification
- **Argon2** - Hachage des mots de passe
- **Zod** - Validation des schémas
