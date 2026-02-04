#!/bin/bash

# Initialize database with Alembic migrations

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
cd /app
alembic upgrade head

echo "Database initialized successfully!"
