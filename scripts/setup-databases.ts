#!/usr/bin/env node

/**
 * Script d'initialisation des bases de données PostgreSQL pour Groupomania
 * Crée les bases de données nécessaires pour l'architecture microservices
 */

import { Client } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'groupomania'
};

async function setupDatabases(): Promise<void> {
  console.error('🔧 Configuration de la base de données...');
  
  try {
    // Connexion à PostgreSQL (base postgres par défaut)
    const client = new Client({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: 'postgres' // Connexion à la base par défaut
    });

    await client.connect();
    console.error('✅ Connexion à PostgreSQL réussie');

    // Vérifier si la base existe
    const dbExists = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.database]
    );

    if (dbExists.rows.length === 0) {
      // Créer la base de données
      await client.query(`CREATE DATABASE "${config.database}"`);
      console.error(`✅ Base de données "${config.database}" créée`);
    } else {
      console.error(`✅ Base de données "${config.database}" existe déjà`);
    }

    // Si CREATE_USER est défini, créer un utilisateur dédié
    if (process.env.CREATE_USER === 'true') {
      const userExists = await client.query(
        'SELECT 1 FROM pg_roles WHERE rolname = $1',
        ['groupomania_user']
      );

      if (userExists.rows.length === 0) {
        await client.query(`
          CREATE USER groupomania_user WITH 
          ENCRYPTED PASSWORD '${config.password}'
          CREATEDB
        `);
        console.error('✅ Utilisateur groupomania_user créé');
      }

      // Donner les permissions
      await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${config.database}" TO groupomania_user`);
      console.error('✅ Permissions accordées');
    }

    await client.end();
    console.error('🎉 Configuration de la base de données terminée');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    process.exit(1);
  }
}

// Vérifier que le mot de passe est fourni
if (config.password.length === 0) {
  console.error('❌ Erreur: DB_PASSWORD est requis');
  console.error('Usage: DB_PASSWORD="votre_mot_de_passe" npm run setup:db');
  process.exit(1);
}

setupDatabases();
