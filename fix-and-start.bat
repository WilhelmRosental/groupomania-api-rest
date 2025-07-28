@echo off
echo ========================================
echo  Correctifs Groupomania Enterprise
echo ========================================

echo.
echo [1/6] Nettoyage des dossiers...
if exist node_modules rmdir /s /q node_modules 2>nul
if exist shared\node_modules rmdir /s /q shared\node_modules 2>nul
if exist user-service\node_modules rmdir /s /q user-service\node_modules 2>nul
if exist post-service\node_modules rmdir /s /q post-service\node_modules 2>nul
if exist api-gateway\node_modules rmdir /s /q api-gateway\node_modules 2>nul

if exist dist rmdir /s /q dist 2>nul
if exist shared\dist rmdir /s /q shared\dist 2>nul
if exist user-service\dist rmdir /s /q user-service\dist 2>nul
if exist post-service\dist rmdir /s /q post-service\dist 2>nul
if exist api-gateway\dist rmdir /s /q api-gateway\dist 2>nul

echo [2/6] Installation racine...
npm install

echo [3/6] Installation shared...
cd shared
npm install
cd ..

echo [4/6] Installation des services...
cd user-service && npm install && cd ..
cd post-service && npm install && cd ..
cd api-gateway && npm install && cd ..

echo [5/6] Build du projet...
npm run build

echo [6/6] Demarrage des services...
echo Les services vont demarrer sur :
echo - API Gateway: http://localhost:3000
echo - User Service: http://localhost:3001  
echo - Post Service: http://localhost:3002
echo.
npm run dev:all

pause