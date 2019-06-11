#!/bin/bash

BASEDIR=$(dirname $0)
ROOTDIR=../$BASEDIR
VIDEODIR=$ROODIR/client/videos
IMAGE_NAME=rcs-cookie-cutter

docker run \
	-p 1337:1337 \
	-mount type=bind,source=$VIDEODIR,target=/app/current/client/videos \
	$@ \
	-it $IMAGE_NAME