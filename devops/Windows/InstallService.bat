@ECHO OFF



SET STARTUP_DIR="C:\Users\%USERNAME%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"
SET STARTUP_FILE="%STARTUP_DIR%"\cookieCutterServer

TYPE nul > %STARTUP_FILE%
