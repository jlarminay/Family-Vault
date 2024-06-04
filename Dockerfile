FROM node:20.12.1

# Set the working directory for the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
COPY * ./

# Build the application
RUN npm run build

# Expose ports
EXPOSE 3000

# Start the application when the container starts
CMD node .output/server/index.mjs