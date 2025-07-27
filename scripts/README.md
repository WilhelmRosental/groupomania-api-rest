# Scripts d'initialisation des bases de données

Ce dossier contient les scripts nécessaires pour initialiser les bases de données PostgreSQL de Groupomania.

## Scripts disponibles

### 1. Script automatique Node.js
```bash
# Créer les bases de données seulement
npm run setup:db

# Créer les bases de données + utilisateur dédié
npm run setup:db:user
```

### 2. Script Windows (Batch)
```cmd
# Double-cliquer sur le fichier ou exécuter :
scripts\setup-databases.bat
```

### 3. Script SQL manuel
```bash
# Se connecter à PostgreSQL et exécuter :
psql -U postgres -f scripts/setup-postgresql-databases.sql
```

## Configuration

### Variables d'environnement supportées :
- `DB_HOST` : Hôte PostgreSQL (défaut: localhost)
- `DB_PORT` : Port PostgreSQL (défaut: 5432)
- `DB_USER` : Utilisateur PostgreSQL (défaut: postgres)
- `DB_PASSWORD` : Mot de passe PostgreSQL (défaut: vide)
- `CREATE_USER=true` : Créer un utilisateur dédié
- `APP_DB_USER` : Nom du nouvel utilisateur (défaut: groupomania)
- `APP_DB_PASSWORD` : Mot de passe du nouvel utilisateur (défaut: groupomania123)

### Exemple avec variables d'environnement :
```bash
DB_PASSWORD=monmotdepasse CREATE_USER=true npm run setup:db:user
```

## Bases de données créées

Le script crée automatiquement :
- `groupomania_users` : Base pour le service utilisateurs
- `groupomania_posts` : Base pour le service publications

## Après l'initialisation

Une fois les bases créées, lancez :
```bash
# 1. Créer les tables
npm run db:migrate:all

# 2. Insérer les données de test
npm run db:seed:all

# 3. Démarrer les services
npm run dev:all
```

## Dépannage

### PostgreSQL non accessible
- Vérifiez que PostgreSQL est démarré
- Vérifiez les paramètres de connexion
- Assurez-vous d'avoir les droits suffisants

### Erreur de permissions
- Lancez le script avec un utilisateur PostgreSQL ayant les droits CREATE
- Ou utilisez l'utilisateur postgres par défaut