#!/bin/sh
# Entry point script for the backend Docker container
# Wait for the MongoDB service to be available
echo "Waiting for MongoDB to be available..."
while ! nc -z mongo 27017; do   
  sleep 1
done
echo "MongoDB is up and running!"
# if database is empty, run migrations or seed data here
# e.g., npm run migrate or npm run seed
echo "Running seed scripts if necessary..."
npm run seed
echo "Starting backend application..."
# Start the backend application
exec npm start 