@echo off
echo ========================================
echo  Test Build Groupomania
echo ========================================

echo [1/3] Nettoyage des builds precedents...
npm run clean

echo [2/3] Build du shared...
cd shared
npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build shared echoue
    pause
    exit /b 1
)
cd ..

echo [3/3] Build complet...
npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build principal echoue
    pause
    exit /b 1
)

echo.
echo ✅ Build reussi ! Le projet peut maintenant demarrer.
echo.
echo Pour demarrer les services :
echo   npm run dev:all
echo.
pause