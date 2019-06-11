#!/bin/bash

CURDIR=$(pwd)
BASEDIR=$(dirname $0)
ROOTDIR=../$BASEDIR
IMAGE_NAME=rcs-cookie-cutter

cd $ROOTDIR
docker build -t $IMAGE_NAME .
cd $CURDIR