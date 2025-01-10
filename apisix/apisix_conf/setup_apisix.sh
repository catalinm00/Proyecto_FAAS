#!/bin/bash

# Crear la red si no existe
NETWORK_NAME="apisix-network"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo "Creando la red $NETWORK_NAME..."
  docker network create "$NETWORK_NAME"
fi

# Montar etcd
echo "Iniciando etcd..."
docker run -d --name etcd \
  --network $NETWORK_NAME \
  -p 2379:2379 \
  -p 2380:2380 \
  -e ALLOW_NONE_AUTHENTICATION=yes \
  -e ETCD_ADVERTISE_CLIENT_URLS=http://127.0.0.1:2379 \
  bitnami/etcd:latest

# Esperar a que etcd esté listo
echo "Esperando a que etcd esté listo..."
until curl -s http://127.0.0.1:2379/v2/keys > /dev/null 2>&1; do
  sleep 2
done
echo "etcd está listo."

# Iniciar APISIX
echo "Iniciando APISIX..."
docker run -d --name apache-apisix \
  --network $NETWORK_NAME \
  -p 9080:9080 \
  -p 9180:9180 \
  -v $(pwd)/config.yaml:/usr/local/apisix/conf/config.yaml \
  -e APISIX_CORS_ENABLED=true \
  apache/apisix

# Esperar a que APISIX esté listo y conectado a etcd
echo "Esperando a que APISIX esté listo y conectado a etcd..."
RETRIES=20
until curl -s http://127.0.0.1:9180/apisix/admin/routes > /dev/null 2>&1; do
  RETRIES=$((RETRIES-1))
  if [ $RETRIES -le 0 ]; then
    echo "Error: APISIX no está listo después de esperar."
    exit 1
  fi
  echo "Esperando a que APISIX se conecte a etcd... Retries restantes: $RETRIES"
  sleep 5
done
echo "APISIX está listo."

# Esperar 20 segundos antes de las configuraciones con curl
echo "Esperando 10 segundos para asegurarse de que APISIX esté completamente operativo..."
sleep 10

echo "Creando la Configuración global de CORS para APISIX..."
curl -X PUT http://127.0.0.1:9180/apisix/admin/global_rules/1 \
  -H "X-API-KEY: 742138hjfahud3429" \
  -d '{
    "plugins": {
      "cors": {
        "allow_origins": "http://localhost:3000",
        "allow_methods": "*",
        "allow_headers": "Content-Type, Authorization, X-API-KEY",
        "expose_headers": "*",
        "allow_credentials": true,
        "max_age": 3600
      }
    }
  }'

# Crear /api/v1/functions
echo "Creando la ruta /api/v1/functions..."
curl -i -X PUT http://127.0.0.1:9180/apisix/admin/routes/1 \
  -H "X-API-KEY: 742138hjfahud3429" \
  -d '{
    "uri": "/api/v1/functions",
    "methods": ["POST", "GET", "DELETE"],
    "plugins": {
        "jwt-auth": {}
    },
    "upstream": {
        "type": "roundrobin",
        "nodes": {
            "host.docker.internal:3000": 1
        }
    }
}'

# Crear /api/v1/users
echo "Creando la ruta /api/v1/users/..."
curl -i -X PUT http://127.0.0.1:9180/apisix/admin/routes/2 \
  -H "X-API-KEY: 742138hjfahud3429" \
  -d '{
    "uri": "/api/v1/users/",
    "methods": ["GET", "DELETE"],
    "plugins": {
        "jwt-auth": {}
    },
    "upstream": {
        "type": "roundrobin",
        "nodes": {
            "host.docker.internal:3000": 1
        }
    }
}'
echo "Creando la ruta pública /api/v1/users/..."
curl -X PUT http://127.0.0.1:9180/apisix/admin/routes/3 \
  -H "X-API-KEY: 742138hjfahud3429" \
  -d '{
    "uri": "/api/v1/users",
    "methods": ["POST"],
    "upstream": {
      "type": "roundrobin",
      "nodes": {
        "host.docker.internal:3000": 1
      }
    }
  }'

echo "Creando la ruta pública /api/v1/users/login..."
curl -X PUT http://127.0.0.1:9180/apisix/admin/routes/4 \
  -H "X-API-KEY: 742138hjfahud3429" \
  -d '{
    "uri": "/api/v1/users/login",
    "methods": ["POST"],
    "upstream": {
      "type": "roundrobin",
      "nodes": {
        "host.docker.internal:3000": 1
      }
    }
  }'



echo "Todas las configuraciones se han completado correctamente."
