# Inventario App

Este proyecto tiene dos aplicaciones principales:

- `frontned`: interfaz en Next.js
- `backend`: API en NestJS con Prisma

La base de datos se puede levantar desde la raiz del repo con Docker Compose, sin depender de crear contenedores manualmente en Docker Desktop.

## Levantar la base de datos

Desde la raiz del proyecto:

```bash
docker compose up -d
```

Esto crea un Postgres accesible en `localhost:5433` con estos valores:

- base de datos: `belongtech`
- usuario: `admin_user`
- password: `admin_pass`

## Variables de entorno

Backend:

1. Copia `backend/.env.example` a `backend/.env`
2. Verifica que `DATABASE_URL` apunte a `localhost:5433`

Frontend:

1. Copia `frontned/.env.example` a `frontned/.env.local`
2. Verifica que `NEXT_PUBLIC_API_URL` sea `http://localhost:3001`

## Ejecutar el backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

El backend quedara disponible en `http://localhost:3001`.

## Ejecutar el frontend

En otra terminal:

```bash
cd frontned
npm install
npm run dev
```

El frontend quedara disponible en `http://localhost:3000`.

## Flujo recomendado

1. Levanta Docker con `docker compose up -d`
2. Inicia el backend
3. Ejecuta `npx prisma db push` si cambias el esquema
4. Inicia el frontend

## Apagar la base de datos

```bash
docker compose down
```

Si quieres borrar tambien los datos persistidos:

```bash
docker compose down -v
```
