FROM nginx:stable-alpine

LABEL maintainer="Sofi <noreply@example.com>"

# Use a custom nginx config so SPA routing works (falls back to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy project files to nginx html directory
COPY . /usr/share/nginx/html

EXPOSE 80

# Simple healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1
