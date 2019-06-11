SET CURDIR=%cd%
SET BASEDIR=%~dp0
SET IMAGE_NAME=rcs-cookie-cutter

cd %BASEDIR%\..\client\videos
SET VIDEO_DIR=%cd%
cd %BASEDIR%

echo Running Docker container %IMAGE_NAME%

cd %BASEDIR%
docker run -p 1337:1337 ^
	--mount type=bind,source=%VIDEO_DIR%,target=/app/current/client/videos ^
	%* ^
	-it %IMAGE_NAME%
cd %CURDIR%