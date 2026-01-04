# use the official Node.js lts at this time image node:24-alpine
FROM node:24-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json files
COPY package*.json ./
# Install dependencies
RUN npm install --verbose
# Copy the rest of the application code
COPY . .
# Expose the port the app runs on and start the application
EXPOSE 5173
# Start the application
CMD ["npm", "run", "dev", "--", "--host"]