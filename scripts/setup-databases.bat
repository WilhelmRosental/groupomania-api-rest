@echo off
title Groupomania - Setup Bases de Donnees PostgreSQL
echo.
echo ===============================================
echo    Groupomania - Setup Bases de Donnees
echo ===============================================
echo.

:: Verifier si Node.js est installe
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

:: Afficher les informations
echo Configuration par defaut:
echo - Host: localhost:5432
echo - User: postgres
echo - Databases: groupomania_users, groupomania_posts
echo.

set /p confirm="Continuer avec cette configuration? (o/N): "
if /i not "%confirm%"=="o" if /i not "%confirm%"=="oui" (
    echo Operation annulee.
    pause
    exit /b 0
)

echo.
echo Lancement du script de creation des bases de donnees...
echo.

:: Lancer le script Node.js
node scripts/setup-databases.js

if errorlevel 1 (
    echo.
    echo ERREUR: Le script a echoue.
    echo Verifiez que PostgreSQL est demarre et accessible.
    pause
    exit /b 1
)

echo.
echo ===============================================
echo     Configuration terminee avec succes !
echo ===============================================
echo.
echo Prochaines etapes:
echo 1. npm run db:migrate:all
echo 2. npm run db:seed:all
echo 3. npm run dev:all
echo.
pause