# 1. UPGRADE TO NODE 22 HERE
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (NestJS default is 3000)
EXPOSE 3000

# Command to run the app 
# (Assuming you have a "start:dev" script in package.json for NestJS)
CMD ["npm", "run", "start:dev"]