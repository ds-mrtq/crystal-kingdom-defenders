# syntax=docker/dockerfile:1.7

# ----------- Stage 1: Build -----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (cache layer)
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

# Copy source và build
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src

# Type check + production build
RUN npm run build

# ----------- Stage 2: Serve -----------
FROM nginx:1.27-alpine AS runner

# Install curl cho health check
RUN apk add --no-cache curl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Non-root user (nginx already runs as user 'nginx' but worker process is non-root by default)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
