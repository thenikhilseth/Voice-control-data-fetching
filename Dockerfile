# Step 1: Build React App
# Step 1: Build React App
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Ensure tsc has execution permissions
RUN chmod +x ./node_modules/.bin/tsc

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:1.23-alpine

# Remove the default Nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the first stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
