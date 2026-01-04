# use the official Node.js lts at this time image node:24-alpine
FROM node:24-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json files
COPY package*.json ./
# COPY the entrypoint script
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh
# Install dependencies
RUN npm install --verbose
# Copy the rest of the application code
COPY . .
# Expose the port the app runs on and start the application
EXPOSE 7010
# Start the application
ENTRYPOINT [ "sh","./docker-entrypoint.sh" ]