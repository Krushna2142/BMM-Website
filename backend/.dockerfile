FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# 1. Generate Prisma Client (Crucial for Docker!)
RUN npx prisma generate

# 2. Build the NestJS application for production
RUN npm run build

# Expose the port (Render will override this with its own PORT env var)
EXPOSE 5000

# 3. Run the PRODUCTION server (not start:dev)
CMD ["npm", "run", "start:prod"]