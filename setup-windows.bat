@echo off
echo ========================================
echo  Configuration Base de Donnees Windows
echo ========================================

echo [1/4] Reinstallation des dependances...
npm run install:all
if %errorlevel% neq 0 goto error

echo [2/4] Build du projet...
npm run build
if %errorlevel% neq 0 goto error

echo [3/4] Configuration de la base de donnees...
if "%DB_PASSWORD%"=="" (
    echo.
    echo Configuration des variables d'environnement...
    set /p DB_PASSWORD=Entrez le mot de passe PostgreSQL: 
    if "!DB_PASSWORD!"=="" (
        echo Mot de passe requis !
        goto error
    )
)

echo Creation de la base de donnees...
set DB_PASSWORD=%DB_PASSWORD%
npm run setup:db
if %errorlevel% neq 0 goto error

echo [4/4] Migration de la base de donnees...
npm run db:migrate:all
if %errorlevel% neq 0 goto error

echo Insertion des donnees de test...
npm run db:seed:all
if %errorlevel% neq 0 goto error

echo.
echo ✅ Configuration terminee avec succes !
echo.
echo Pour demarrer les services :
echo   npm run dev:all
echo.
echo Services disponibles :
echo   - API Gateway: http://localhost:3000
echo   - User Service: http://localhost:3001
echo   - Post Service: http://localhost:3002
echo.
pause
exit /b 0

:error
echo.
echo ❌ ERREUR pendant la configuration
echo Verifiez que PostgreSQL est installe et demarre
pause
exit /b 1