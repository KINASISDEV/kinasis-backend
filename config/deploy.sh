#!/bin/bash
set -e

BRANCH="$1"

cd ~/apps/kinasis-backend

git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

if [ "$BRANCH" = "main" ]; then
    CONTAINER_NAME="kinasis-main"
    PORT=3001
    ENV_FILE=".env"
elif [ "$BRANCH" = "devel" ]; then
    CONTAINER_NAME="kinasis-devel"
    PORT=3002
    ENV_FILE=".dev.env"
else
    echo "Rama no soportada: $BRANCH"
    exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "No existe el archivo de entorno: $PROJECT_DIR/$ENV_FILE"
    exit 1
fi

docker rm -f "$CONTAINER_NAME" || true

docker build -t "$CONTAINER_NAME" .

docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT":3000 \
  --env-file "$ENV_FILE" \
  --restart always \
  "$CONTAINER_NAME"

echo "Deploy completado para $BRANCH usando $ENV_FILE"