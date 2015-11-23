@echo off

setlocal

if exist AndroidManifest.xml (
goto main
) else (
echo --not in project
set /p prjdir="drag PROJECT dir here:"
goto restart
)

:restart
chdir /d %prjdir%
echo project: %cd%
call %0
goto end


:main
for %%a in (.) do set prjname=%%~na
set JAVA_HOME=F:\Program Files\Java\jdk1.7.0_79
set ant="D:\Program_Test\apache-ant-1.9.6\bin\ant.bat"
set android="D:\Developments\Android\android-sdk-windows\tools\android.bat"


if "%1"=="clean" (%ant% clean && goto end)

:: generate build.xml
call %android% update project --name %prjname% --target 1 -p ./

:: clean project
::%ant% clean

:: generate debug apk
%ant% debug
pause
start %prjdir%\bin

:end
echo .
