#!/bin/bash

BRANCH=$1

cd ~/apps/kinasis-backend

git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

if [ "$BRANCH" = "main" ]; then
    CONTAINER_NAME="kinasis-main"
    PORT=3001
else
    CONTAINER_NAME="kinasis-devel"
    PORT=3002
fi

docker rm -f $CONTAINER_NAME || true

docker build -t $CONTAINER_NAME .

docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:3000 \
  --restart always \
  $CONTAINER_NAME
