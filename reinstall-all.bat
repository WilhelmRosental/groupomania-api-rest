@echo off
echo ========================================
echo  Reinstallation Complete Groupomania
echo ========================================

echo [1/8] Suppression de tous les node_modules...
if exist node_modules rmdir /s /q node_modules 2>nul
if exist shared\node_modules rmdir /s /q shared\node_modules 2>nul
if exist user-service\node_modules rmdir /s /q user-service\node_modules 2>nul
if exist post-service\node_modules rmdir /s /q post-service\node_modules 2>nul
if exist api-gateway\node_modules rmdir /s /q api-gateway\node_modules 2>nul

echo [2/8] Suppression de tous les dist...
if exist dist rmdir /s /q dist 2>nul
if exist shared\dist rmdir /s /q shared\dist 2>nul
if exist user-service\dist rmdir /s /q user-service\dist 2>nul
if exist post-service\dist rmdir /s /q post-service\dist 2>nul
if exist api-gateway\dist rmdir /s /q api-gateway\dist 2>nul

echo [3/8] Installation racine...
npm install
if %errorlevel% neq 0 goto error

echo [4/8] Installation shared...
cd shared
npm install
if %errorlevel% neq 0 goto error
cd ..

echo [5/8] Installation user-service...
cd user-service
npm install
if %errorlevel% neq 0 goto error
cd ..

echo [6/8] Installation post-service...
cd post-service
npm install
if %errorlevel% neq 0 goto error
cd ..

echo [7/8] Installation api-gateway...
cd api-gateway
npm install
if %errorlevel% neq 0 goto error
cd ..

echo [8/8] Test de build...
.\test-shared-only.bat
if %errorlevel% neq 0 goto error

echo.
echo ✅ Tout est pret ! 
echo.
echo Pour demarrer :
echo   npm run dev:all
echo.
pause
exit /b 0

:error
echo.
echo ❌ ERREUR pendant l'installation
pause
exit /b 1