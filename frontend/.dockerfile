# --- Stage 1: Development ---
FROM node:18-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# --- Stage 2: Build for Production ---
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 3: Production (Nginx) ---
FROM nginx:alpine AS production
# Copy the build output to Nginx's html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html
# Copy custom Nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]