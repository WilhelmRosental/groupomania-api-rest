@echo off
echo ========================================
echo  Test Build Complet - Etape par Etape
echo ========================================

echo [1/6] Nettoyage...
npm run clean
if %errorlevel% neq 0 goto error

echo [2/6] Build shared...
cd shared
npm run build
if %errorlevel% neq 0 goto error
cd ..
echo ✅ Shared OK

echo [3/6] Build scripts (optionnel)...
npm run build:scripts:optional
if %errorlevel% neq 0 goto error
echo ✅ Scripts OK

echo [4/6] Build user-service...
cd user-service
npm run build
if %errorlevel% neq 0 goto error
cd ..
echo ✅ User Service OK

echo [5/6] Build post-service...
cd post-service
npm run build
if %errorlevel% neq 0 goto error
cd ..
echo ✅ Post Service OK

echo [6/6] Build api-gateway...
cd api-gateway
npm run build
if %errorlevel% neq 0 goto error
cd ..
echo ✅ API Gateway OK

echo.
echo 🎉 BUILD COMPLET REUSSI !
echo.
echo Vous pouvez maintenant demarrer les services :
echo   npm run dev:all
echo.
pause
exit /b 0

:error
echo.
echo ❌ ERREUR pendant le build
pause
exit /b 1