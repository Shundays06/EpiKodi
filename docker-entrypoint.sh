#!/bin/sh
set -e

echo "🔄 Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  echo "⏳ Waiting for postgres..."
  sleep 1
done

echo "✅ PostgreSQL is ready!"

echo "🔧 Running Prisma migrations..."
npx prisma db push --skip-generate

echo "🚀 Starting Next.js application..."
exec node server.js
