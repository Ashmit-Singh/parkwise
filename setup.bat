@echo off
echo Setting up ParkWise Project...

echo Step 1: Creating backend structure...
mkdir backend\src\main\java\com\parkwise 2>nul
mkdir backend\src\main\java\com\parkwise\entity 2>nul
mkdir backend\src\main\java\com\parkwise\repository 2>nul
mkdir backend\src\main\java\com\parkwise\controller 2>nul
mkdir backend\src\main\java\com\parkwise\config 2>nul
mkdir backend\src\main\resources 2>nul

echo Step 2: Creating frontend structure...
mkdir frontend\src 2>nul
mkdir frontend\src\components 2>nul
mkdir frontend\src\pages 2>nul
mkdir frontend\public 2>nul

echo.
echo Project structure created!
echo.
pause