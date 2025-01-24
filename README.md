# Proyecto_FAAS
Small FAAS project for the Cloud Computing subject.
## Starting the api-server or worker in local mode
```sh
cd api-server/
```
Pulling the dependencies:
```sh
npm ci
```
Prisma-ORM setup(only for the api-server):
```sh
npm run prisma:generate
```
Note that the database should be running before doing this.


Running one of the subprojects(Nats and mongoDB should be already running before doing this):
```sh
npm run start:dev
```

## Starting the project with Docker Compose
```sh
docker compose up -d
```
If the source code was edited, the images should be built again:
```sh
docker compose build
```

## OPEN API SPECIFICATION
If the api-server is running locally, go to: `localhost:3000/api-docs`.
If running with Docker Compose: `localhost:9080/api-docs`.

## API usage:
1. Create a user
2. Request a TOKEN from the login endpoint.
3. Create one or several functions
4. Use the id of the previously created functions to execute them

## IMPORTANT
1. The worker shuold run inside the docker compose environment in order to have access to the docker daemon.
2. The functions execution(containers) is limited to 15s, starting from the moment the container started.
3. When creating a function it is highly recommended to specify the docker image tag.
