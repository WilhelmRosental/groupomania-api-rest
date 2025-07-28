@echo off
echo ========================================
echo  Test Build Shared Only
echo ========================================

echo Nettoyage du dist shared...
cd shared
if exist dist rmdir /s /q dist

echo Build shared...
npx tsc
if %errorlevel% neq 0 (
    echo.
    echo ERREUR: Le build shared a echoue
    echo Verifiez les erreurs TypeScript ci-dessus
    pause
    exit /b 1
)

echo.
echo ✅ Build shared reussi !
cd ..
pause