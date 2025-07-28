-- Initialisation de la base de données Groupomania
-- Ce script est exécuté automatiquement par Docker au premier démarrage

-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Créer un utilisateur dédié (optionnel)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'groupomania_user') THEN
        CREATE USER groupomania_user WITH ENCRYPTED PASSWORD 'password';
        GRANT ALL PRIVILEGES ON DATABASE groupomania TO groupomania_user;
    END IF;
END
$$;

-- Définir les permissions par défaut
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO groupomania_user;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO groupomania_user;

-- Log de confirmation
SELECT 'Base de données Groupomania initialisée avec succès!' as message;
