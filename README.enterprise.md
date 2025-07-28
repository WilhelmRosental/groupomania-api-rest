# Groupomania Microservices - Enterprise Edition

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Security](https://img.shields.io/badge/security-enterprise-red.svg)]()

Une architecture de microservices d'entreprise pour l'API Groupomania, construite avec TypeScript, Fastify, et PostgreSQL.

## 🏢 Fonctionnalités d'Entreprise

- **Architecture microservices** avec API Gateway
- **Sécurité renforcée** avec analyse de vulnérabilités
- **Observabilité complète** : logs structurés, métriques, health checks
- **Configuration par environnement** avec validation stricte
- **Tests d'entreprise** avec couverture de code
- **CI/CD ready** avec scripts automatisés
- **Docker production-ready** avec multi-stage builds
- **Monitoring et alerting** intégrés

## 📋 Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **PostgreSQL** >= 14
- **Docker** >= 20.10 (optionnel)
- **Docker Compose** >= 2.0 (optionnel)

## 🚀 Installation et Configuration

### 1. Cloner le projet

```bash
git clone https://github.com/WilhelmRosental/groupomania-architecture-microservices.git
cd groupomania-architecture-microservices
```

### 2. Configuration d'environnement

```bash
# Copier le fichier d'exemple de configuration
cp .env.example .env

# Éditer les variables d'environnement
nano .env
```

**Variables d'environnement critiques :**
- `JWT_SECRET` : Clé secrète JWT (minimum 32 caractères)
- `DB_PASSWORD` : Mot de passe de la base de données
- `NODE_ENV` : environnement (development/staging/production)

### 3. Installation des dépendances

```bash
# Installation de toutes les dépendances
npm run install:all

# Ou installation manuelle
npm ci
cd shared && npm ci
cd ../user-service && npm ci
cd ../post-service && npm ci
cd ../api-gateway && npm ci
```

### 4. Configuration de la base de données

```bash
# Démarrer PostgreSQL avec Docker
npm run docker:up

# Ou configurer manuellement et créer les bases
npm run setup:db
```

## 🔧 Scripts de Développement

### Construction

```bash
# Construction complète (tous les services)
npm run build

# Construction pour la production
npm run build:prod

# Construction individuelle
npm run build:user
npm run build:post
npm run build:gateway
```

### Développement

```bash
# Démarrer tous les services en mode développement
npm run dev:all

# Services individuels
npm run dev:user      # Port 3001
npm run dev:post      # Port 3002
npm run dev:gateway   # Port 3000
```

### Tests

```bash
# Tests complets avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests E2E
npm run test:e2e

# Tests par service
npm run test:user
npm run test:post
npm run test:gateway
```

### Qualité de Code

```bash
# Linting avec correction automatique
npm run lint:fix

# Formatage du code
npm run format

# Vérification du formatage
npm run format:check

# Audit de sécurité
npm run security:audit
```

## 🐳 Déploiement Docker

### Développement

```bash
# Construction des images
npm run docker:build

# Démarrage des services
npm run docker:up

# Arrêt des services
npm run docker:down
```

### Production

```bash
# Construction pour la production
npm run docker:build:prod

# Démarrage en production
npm run docker:up:prod

# Nettoyage complet
npm run docker:clean
```

## 🔍 Monitoring et Observabilité

### Health Checks

```bash
# Vérification de santé de tous les services
npm run health-check:all

# Service individuel
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # User Service
curl http://localhost:3002/health  # Post Service
```

### Logs

```bash
# Affichage des logs en temps réel
npm run logs:all

# Logs par service (avec PM2)
npm run logs:user
npm run logs:post
npm run logs:gateway
```

### Métriques

- **Endpoint métriques** : `http://localhost:9090/metrics`
- **Prometheus format** pour l'intégration monitoring
- **Métriques système** : CPU, mémoire, temps de réponse
- **Métriques business** : nombre de requêtes, taux d'erreur

## 🏗️ Architecture

```
groupomania-microservices/
├── api-gateway/          # Point d'entrée unique (Port 3000)
├── user-service/         # Gestion des utilisateurs (Port 3001)
├── post-service/         # Gestion des posts (Port 3002)
├── shared/              # Bibliothèque commune
│   ├── src/
│   │   ├── config.ts    # Configuration centralisée
│   │   ├── logger.ts    # Logging d'entreprise
│   │   ├── metrics.ts   # Collecte de métriques
│   │   ├── health.ts    # Health checks
│   │   └── middleware/  # Middlewares partagés
├── scripts/             # Scripts d'administration
└── docker-compose.yml   # Orchestration des services
```

## 🔐 Sécurité

### Mesures de Sécurité Implémentées

- **Validation stricte** des entrées avec Zod
- **Rate limiting** configurable par service
- **Helmet** pour la sécurisation des headers
- **CORS** configuré par environnement
- **JWT** avec expiration et rotation
- **Audit de sécurité** automatisé
- **Analyse statique** avec ESLint Security

### Configuration de Sécurité

```bash
# Audit des vulnérabilités
npm run security:audit

# Fix automatique des vulnérabilités
npm run security:fix
```

## 📊 Métriques et Performance

### Métriques Collectées

- **Temps de réponse** par endpoint
- **Taux d'erreur** par service
- **Utilisation mémoire** et CPU
- **Connexions base de données**
- **Throughput** des requêtes

### Optimisations

- **Connection pooling** PostgreSQL
- **Compression** des réponses
- **Cache headers** appropriés
- **Graceful shutdown** pour les services

## 🔄 CI/CD

### Scripts d'Intégration Continue

```bash
# Pipeline complet CI
npm run ci:install    # Installation optimisée
npm run ci:build      # Construction production
npm run ci:test       # Tests avec couverture
npm run ci:lint       # Qualité de code
npm run ci:security   # Audit sécurité
```

### Pre-commit Hooks

```bash
# Vérifications avant commit
npm run precommit
```

## 🐛 Debug et Troubleshooting

### Logs de Debug

```bash
# Activer les logs de debug
export LOG_LEVEL=debug
npm run dev:all
```

### Health Check Détaillé

```bash
# Vérification complète avec détails
curl -s http://localhost:3000/health | jq .
```

### Database Debug

```bash
# Vérifier les connexions DB
npm run db:migrate:all
npm run db:seed:all
```

## 🤝 Contribution

### Standards de Code

- **TypeScript strict** activé
- **ESLint** avec règles de sécurité
- **Prettier** pour le formatage
- **Tests** obligatoires (couverture > 70%)
- **Documentation** des APIs

### Workflow de Développement

1. Créer une branche feature
2. Développer avec tests
3. Vérifier la qualité : `npm run precommit`
4. Créer une Pull Request
5. Review et merge

## 📝 Documentation API

### Swagger UI

- **Development** : http://localhost:3000/docs
- **API Gateway** : Point d'accès centralisé
- **User Service** : http://localhost:3001/docs
- **Post Service** : http://localhost:3002/docs

### Endpoints Principaux

```
GET  /api/v1/health           # Health check global
POST /api/v1/auth/register    # Inscription utilisateur
POST /api/v1/auth/login       # Connexion utilisateur
GET  /api/v1/posts           # Liste des posts
POST /api/v1/posts           # Création d'un post
```

## 🆘 Support

### Problèmes Fréquents

1. **Port déjà utilisé** : Vérifier les services en cours avec `netstat -tulpn`
2. **Erreur DB** : Vérifier la configuration dans `.env`
3. **Permissions Docker** : Ajouter l'utilisateur au groupe docker

### Logs d'Erreur

```bash
# Logs des erreurs détaillées
docker-compose logs -f --tail=100
```

## 📈 Roadmap

- [ ] **Kubernetes** deployment
- [ ] **OpenTelemetry** tracing
- [ ] **GraphQL** API Gateway
- [ ] **Event Sourcing** pour les posts
- [ ] **Redis** cache layer
- [ ] **Elasticsearch** pour la recherche

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

## 👥 Auteurs

- **Nathan Hallouin** - Développeur principal
- **Wilhelm Rosental** - Architecture microservices

---

> **Note d'Entreprise** : Cette version utilise des pratiques de développement d'entreprise avec une approche "build-first" sans ts-node pour optimiser les performances et la sécurité en production.
