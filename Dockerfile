# Use a Node.js base image
FROM node:16

# Create a working directory
WORKDIR /usr/src/app

# Copy project files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the microservice port
EXPOSE 3000

# Command to start the server
CMD ["node", "server.js"]