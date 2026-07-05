FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# 1. Generate Prisma Client
# FIX: Pass a dummy DATABASE_URL to satisfy Prisma's environment variable check
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# 2. Build the NestJS application for production
RUN npm run build

# Expose the port
EXPOSE 3000

# 3. Run the PRODUCTION server
CMD ["npm", "run", "start:prod"]