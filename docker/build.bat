SET CURDIR=%cd%
SET BASEDIR=%~dp0
SET IMAGE_NAME=rcs-cookie-cutter

REM SET IMAGE_NAME=image_name
REM Set the Image Name from the text file content

echo Building Docker container %IMAGE_NAME%

cd %BASEDIR%\..
docker build %* -t %IMAGE_NAME% .
cd %CURDIR%