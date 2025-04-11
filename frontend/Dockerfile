# Use an official Node runtime as a parent image
FROM node:18-alpine as build-stage

# Set work directory
WORKDIR /app

# Copy package.json and install dependencies
COPY frontend/package.json /app/
COPY frontend/package-lock.json /app/
RUN npm install

# Copy the rest of the application code
COPY frontend/ /app/

# Build the application for production
RUN npm run build

# Use Nginx for serving the built application
FROM nginx:stable-alpine as production-stage

# Copy built files from Vite's default output directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a custom nginx config if needed
# COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]