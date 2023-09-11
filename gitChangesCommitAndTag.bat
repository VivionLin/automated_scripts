@echo off

REM Please update the variable below
set projectBase=C:\xxx\your-project
echo Project Base: %projectBase%

echo.
set /p commitTitle= Please give a title for this commit: 
set /p tagVersion= Please give a version tag for this deployment: 

echo.
cd "%projectBase%"
@echo on
git show-ref --tags "%tagVersion%"
@echo off
echo (If you see a line similar to '74d5689306cfae2fdcfbed93dad1c06726233872 refs/tags/v1.1.0' means the tag has already exists in remote,
echo in this case please abort this cmd by Ctrl + C and use a new tag)
echo.

echo.
echo Are you sure you want to build + commit (%commitTitle%) + tag %tagVersion% for the project
pause


@echo on

cd "%projectBase%"
git add .
git stash push

git pull

git stash pop

@echo on

cd "%projectBase%"

git add .
git commit -m "%commitTitle%"
git push

git tag "%tagVersion%"
git push origin "%tagVersion%"