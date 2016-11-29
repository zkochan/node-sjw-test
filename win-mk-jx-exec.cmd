@echo off

net.exe session 1>NUL 2>NUL || (echo Must use "Run as administrator"; i.e. Run with elevated permissions. & exit /b 1)

:: assumes default install of node
echo Creating 'nodejs' file type
ftype nodejs="C:\Program Files\nodejs\node.exe" "%%1" %%*

echo Associating .js, .jx extensions to 'nodejs' file type
assoc .js=nodejs
assoc .jx=nodejs

echo Removing '.js', adding '.jx' to PATHEXT.
set PATHEXT=%PATHEXT:;.JS;=;%
set PATHEXT=%PATHEXT:;.JX;=;%;

setx PATHEXT %PATHEXT%;.JX;

echo Done. Restart shell to use.

exit /b

