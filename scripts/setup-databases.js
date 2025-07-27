#!/usr/bin/env node

/**
 * Script d'initialisation des bases de données PostgreSQL pour Groupomania
 * Crée les bases de données nécessaires pour l'architecture microservices
 */

const { Client } = require('pg');

// Vérifier si un mot de passe est fourni (requis pour SCRAM)
if (process.env.DB_PASSWORD === undefined) {
  console.log('⚠️  PostgreSQL utilise l\'authentification SCRAM qui nécessite un mot de passe.');
  console.log('💡 Essayez une de ces commandes :');
  console.log('   DB_PASSWORD="votre_mot_de_passe" npm run setup:db');
  console.log('   DB_PASSWORD="" npm run setup:db  # si pas de mot de passe');
  console.log('   DB_PASSWORD="postgres" npm run setup:db  # mot de passe par défaut');
  console.log('');
  console.log('🔍 Pour trouver votre mot de passe PostgreSQL :');
  console.log('   1. Vérifiez dans pgAdmin');
  console.log('   2. Ou testez avec: psql -U postgres -d postgres');
  process.exit(1);
}

// Configuration de connexion PostgreSQL
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'postgres', // Se connecter à la base par défaut pour créer les autres
  ssl: false, // Désactiver SSL pour les connexions locales
  connectionTimeoutMillis: 5000
};

// Bases de données à créer
const databases = [
  'groupomania_users',
  'groupomania_posts'
];

// Utilisateur applicatif (optionnel)
const appUser = {
  username: process.env.APP_DB_USER || 'groupomania',
  password: process.env.APP_DB_PASSWORD || 'groupomania123'
};

const createUser = process.env.CREATE_USER === 'true';

console.log('🚀 Script d\'initialisation des bases de données Groupomania');
console.log('📁 Configuration:');
console.log(`   - Host: ${config.host}:${config.port}`);
console.log(`   - User: ${config.user}`);
console.log(`   - Databases: ${databases.join(', ')}`);
if (createUser) {
  console.log(`   - App User: ${appUser.username}`);
}
console.log('');

async function setupDatabases() {
  const client = new Client(config);

  try {
    console.log('🔗 Connexion à PostgreSQL...');
    await client.connect();
    console.log('✅ Connexion réussie !');

    // Créer l'utilisateur applicatif si demandé
    if (createUser) {
      console.log(`👤 Création de l'utilisateur ${appUser.username}...`);
      try {
        await client.query(`
          CREATE USER ${appUser.username} WITH PASSWORD '${appUser.password}';
        `);
        console.log(`✅ Utilisateur ${appUser.username} créé avec succès`);
      } catch (error) {
        if (error.code === '42710') { // User already exists
          console.log(`⚠️  L'utilisateur ${appUser.username} existe déjà`);
        } else {
          throw error;
        }
      }
    }

    // Créer les bases de données
    for (const dbName of databases) {
      console.log(`📦 Création de la base de données ${dbName}...`);
      
      try {
        await client.query(`CREATE DATABASE ${dbName};`);
        console.log(`✅ Base de données ${dbName} créée avec succès`);
      } catch (error) {
        if (error.code === '42P04') { // Database already exists
          console.log(`⚠️  La base de données ${dbName} existe déjà`);
        } else {
          throw error;
        }
      }

      // Donner les permissions à l'utilisateur applicatif
      if (createUser) {
        try {
          await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${appUser.username};`);
          console.log(`✅ Permissions accordées à ${appUser.username} sur ${dbName}`);
        } catch (error) {
          console.log(`⚠️  Erreur lors de l'attribution des permissions: ${error.message}`);
        }
      }
    }

    console.log('');
    console.log('🎉 Initialisation terminée avec succès !');
    console.log('');
    console.log('📋 Prochaines étapes:');
    console.log('   1. npm run db:migrate:all  # Créer les tables');
    console.log('   2. npm run db:seed:all     # Insérer les données de test');
    console.log('   3. npm run dev:all         # Démarrer les services');

  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    console.log('');
    console.log('💡 Solutions possibles:');
    console.log('   - Vérifiez que PostgreSQL est démarré');
    console.log('   - Vérifiez le mot de passe avec: psql -U postgres');
    console.log('   - Changez le mot de passe: ALTER USER postgres PASSWORD \'nouveaumotdepasse\';');
    console.log('');
    console.log('💡 Variables d\'environnement disponibles:');
    console.log('   - DB_HOST (défaut: localhost)');
    console.log('   - DB_PORT (défaut: 5432)');
    console.log('   - DB_USER (défaut: postgres)');
    console.log('   - DB_PASSWORD (REQUIS)');
    console.log('   - CREATE_USER=true (pour créer un utilisateur dédié)');
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Exécuter le script
setupDatabases();