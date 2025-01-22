#!/bin/bash

# Variables comunes
ADMIN_API="http://apisix:9180/apisix/admin"
API_KEY="kQxzARurYKFODMtzinIsLQeyWNaFolle" # Reemplaza con tu clave de administrador de APISIX
UPSTREAM="api-server:3000"

echo "Configuring Apache APISIX..."

# 1. Configurar reglas globales (CORS)
echo "Setting up global rules for CORS..."
curl -X PUT "$ADMIN_API/global_rules/1" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1",
    "plugins": {
      "cors": {
        "allow_origins": "*",
        "allow_methods": "*",
        "allow_headers": "Content-Type, Authorization, X-API-KEY",
        "expose_headers": "*",
        "allow_credentials": true,
        "max_age": 3600
      }
    }
  }'

# 2. Configurar rutas
echo "Setting up routes..."

# Ruta para /api/v1/users
curl -X PUT "$ADMIN_API/routes/6" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "uri": "/api/v1/users",
    "methods": ["POST"],
    "upstream": {
      "type": "roundrobin",
      "nodes": {
        "'"$UPSTREAM"'": 1
      }
    }
  }'

# Ruta para /api/v1/users/login
curl -X PUT "$ADMIN_API/routes/7" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "uri": "/api/v1/users/login",
    "methods": ["POST"],
    "upstream": {
      "type": "roundrobin",
      "nodes": {
        "'"$UPSTREAM"'": 1
      }
    }
  }'

# Ruta para /api-docs
curl -X PUT "$ADMIN_API/routes/1" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "uri": "/api-docs",
    "upstream": {
      "type": "roundrobin",
      "nodes": {
        "'"$UPSTREAM"'": 1
      }
    }
  }'

# Ruta para /api-docs/*
curl -X PUT "$ADMIN_API/routes/2" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "uri": "/api-docs/*",
    "upstream": {
      "type": "roundrobin",
      "nodes": {
        "'"$UPSTREAM"'": 1
      }
    }
  }'


# Ruta para /api/v1/users/delete/*
curl -X PUT "$ADMIN_API/routes/5" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "uri": "/api/*",
    "methods": ["POST","GET","DELETE","PUT","PATCH"],
    "upstream": {
      "type": "roundrobin",
      "nodes": {
        "'"$UPSTREAM"'": 1
      }
    },
    "plugins": {
      "jwt-auth": {}
    }
  }'

echo "All routes and global rules have been configured!"
