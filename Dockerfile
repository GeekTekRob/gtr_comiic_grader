FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json .
COPY client/package.json client/

# Install dependencies
RUN npm install && \
    cd client && npm install && cd ..

# Copy application code
COPY src src/
COPY client/src client/src/
COPY client/vite.config.js client/
COPY client/index.html client/
COPY src/prompts src/prompts/

# Build client
WORKDIR /app/client
RUN npm run build
WORKDIR /app

# Create empty .env with defaults
RUN echo "PORT=5000\nNODE_ENV=production" > .env

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
