# CMS Full-Stack Project

Complete production-ready CMS with Next.js frontend, Go/Gin backend, PostgreSQL, Redis, and MinIO.

## Project Structure

```
├── backend/              # Go/Gin backend
│   ├── cmd/
│   │   ├── server/      # API server
│   │   └── migrate/     # Migration runner
│   ├── internal/        # Core packages
│   ├── migrations/      # SQL migrations
│   └── Dockerfile
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # Pages and routes
│   │   ├── components/ # React components
│   │   └── lib/        # API helpers
│   └── Dockerfile
├── docker-compose.yml   # Services orchestration
├── Makefile            # Development tasks
└── API.md              # API documentation
```

## Tech Stack

**Backend:**
- Go 1.20
- Gin (HTTP framework)
- GORM (ORM)
- PostgreSQL
- Redis
- MinIO (object storage)
- JWT authentication

**Frontend:**
- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Chart.js

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Go 1.20+ (for local development)
- Node.js 16+ (for local development)

### Setup with Docker

1. Clone the repository
```bash
git clone <repo-url>
cd project
```

2. Create environment file
```bash
cp .env.example .env
```

3. Start services
```bash
docker-compose up -d
```

4. Run migrations
```bash
docker-compose exec backend go run ./cmd/migrate/main.go
```

5. Access applications
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Swagger API Docs: http://localhost:8080/swagger/index.html
- MinIO Console: http://localhost:9001 (access key: minioadmin, secret key: minioadmin)

## Deployment from Source

### 1. Clone source code

Use Git to clone into the target server or local machine:

```bash
cd /opt
sudo mkdir -p /opt/project
sudo chown $USER:$USER /opt/project
cd /opt/project
git clone <repo-url> .
```

If the repository is private, use SSH keys or a deploy token:

```bash
git clone git@github.com:your-org/your-repo.git .
```

### 2. Upload source code

If source code is prepared locally, upload it to the server:

- Using `scp`:
```bash
scp -r /path/to/local/project/* user@server:/opt/project/
```

- Using `rsync` (recommended for large or repeated uploads):
```bash
rsync -avz --delete /path/to/local/project/ user@server:/opt/project/
```

- Using ZIP archive:
```bash
cd /path/to/local/project
zip -r project.zip .
scp project.zip user@server:/opt/project/
ssh user@server
cd /opt/project
unzip project.zip
```

After upload, verify ownership and permissions:

```bash
sudo chown -R $USER:$USER /opt/project
find /opt/project -type d -exec chmod 755 {} \;
find /opt/project -type f -exec chmod 644 {} \;
chmod +x /opt/project/backend/cmd/server/main.go
```

### 3. Configure `.env`

Copy the example file and populate all required environment variables:

```bash
cd /opt/project
cp .env.example .env
```

Open `.env` and set values for:
- `APP_ENV` (e.g. `production`)
- `APP_URL` and `FRONTEND_URL`
- `PORT` or `API_PORT`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `MINIO_ENDPOINT`, `MINIO_BUCKET`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
- `JWT_SECRET`
- `SMTP_*` settings if email is required

Example values:

```env
APP_ENV=production
APP_URL=https://cms.example.com
FRONTEND_URL=https://cms.example.com
PORT=8080
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=cms_user
DB_PASSWORD=StrongDbPassword!
DB_NAME=cms_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=StrongRedisPassword!
MINIO_ENDPOINT=127.0.0.1:9000
MINIO_BUCKET=cms-bucket
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
JWT_SECRET=ReplaceWithASecureRandomSecret
```

Save `.env` and confirm there are no trailing spaces or invalid characters.

### 4. Build project

#### Build with Docker

From `/opt/project`:

```bash
docker-compose build --no-cache
docker-compose up -d
```

If you need to rebuild a specific service:

```bash
docker-compose build backend frontend
docker-compose up -d backend frontend
```

### Docker Compose Operations

Start or restart all services:

```bash
docker-compose up -d
```

Open container status:

```bash
docker-compose ps
```

Inspect a single service container:

```bash
docker-compose ps backend
docker-compose ps frontend
docker-compose ps db
docker-compose ps redis
docker-compose ps minio
```

Check Compose service status at Docker level:

```bash
docker ps --filter "name=project_" --format "table {{.Names}}	{{.Status}}	{{.Ports}}"
```

### Check containers

List running containers:

```bash
docker ps
```

View container details:

```bash
docker inspect <container-name-or-id>
```

### Check network

List Docker networks:

```bash
docker network ls
```

Inspect the Compose network:

```bash
docker network inspect project_default
```

### Check volume

List Docker volumes:

```bash
docker volume ls
```

Inspect volumes used by Compose:

```bash
docker volume inspect project_backend_data
docker volume inspect project_postgres_data
docker volume inspect project_minio_data
```

### Check logs

Follow logs for all services:

```bash
docker-compose logs -f
```

Follow logs for a specific service:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Check service

Verify backend service:

```bash
curl --fail http://127.0.0.1:8080/api/health
```

Verify frontend service:

```bash
curl --fail http://127.0.0.1:3000/
```

Verify MinIO console:

```bash
curl --fail http://127.0.0.1:9001
```

Verify PostgreSQL container is healthy via Compose:

```bash
docker-compose exec db pg_isready -U postgres
```

Verify Redis connection via Compose:

```bash
docker-compose exec redis redis-cli ping
```

## Testing

### API

Check the backend health endpoint:

```bash
curl --fail http://127.0.0.1:8080/api/health
```

Test login endpoint:

```bash
curl -X POST http://127.0.0.1:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

Test a protected API endpoint with a bearer token:

```bash
TOKEN=$(curl -s -X POST http://127.0.0.1:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' | jq -r '.access_token')

curl --fail http://127.0.0.1:8080/api/news \
  -H "Authorization: Bearer $TOKEN"
```

### Frontend

Verify the frontend homepage:

```bash
curl --fail http://127.0.0.1:3000/
```

Verify a sample frontend route:

```bash
curl --fail http://127.0.0.1:3000/admin
```

### Database

Check PostgreSQL readiness:

```bash
docker-compose exec db pg_isready -U postgres
```

Verify the CMS database exists:

```bash
docker-compose exec db psql -U postgres -c "\l" | grep cms_db
```

Run a sample query:

```bash
docker-compose exec db psql -U postgres -d cms_db -c "SELECT 1;"
```

### Redis

Verify Redis responds:

```bash
docker-compose exec redis redis-cli ping
```

If Redis is password-protected:

```bash
docker-compose exec redis redis-cli -a StrongRedisPassword! ping
```

### MinIO

Check MinIO service health:

```bash
curl --fail http://127.0.0.1:9000/minio/health/live
```

Check bucket access with MinIO client:

```bash
mc alias set local http://127.0.0.1:9000 minioadmin minioadmin123
mc ls local/cms-bucket
```

### Upload

Test file upload through the backend API:

```bash
curl -X POST http://127.0.0.1:8080/api/media/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./test-image.jpg"
```

Confirm the file appears in MinIO:

```bash
mc ls local/cms-bucket/uploads/
```

### Login

Test authentication and token issuance:

```bash
curl -X POST http://127.0.0.1:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

Decode the access token payload:

```bash
echo "$TOKEN" | cut -d'.' -f2 | base64 --decode | jq
```

### Backup

#### Database

Create a PostgreSQL backup:

```bash
mkdir -p /opt/project/backup/db
docker-compose exec db pg_dump -U postgres cms_db > /opt/project/backup/db/cms_db_$(date +%F).sql
```

Check the backup file exists:

```bash
ls -lh /opt/project/backup/db/
```

#### Redis

If Redis persistence is enabled, backup the RDB file from the Redis volume or container.

```bash
docker-compose exec redis sh -c "cp /data/dump.rdb /tmp/dump.rdb"
docker-compose cp redis:/tmp/dump.rdb /opt/project/backup/redis/dump_$(date +%F).rdb
```

If Redis uses AOF persistence, backup `appendonly.aof` instead.

#### MinIO

Backup MinIO data from the volume:

```bash
mkdir -p /opt/project/backup/minio
docker run --rm -v project_minio_data:/data -v /opt/project/backup/minio:/backup alpine \
  sh -c "cd /data && tar czf /backup/minio_data_$(date +%F).tar.gz ."
```

Verify backup contents:

```bash
tar tzf /opt/project/backup/minio/minio_data_$(date +%F).tar.gz | head
```

#### Source

Backup project source files and deployment configuration:

```bash
mkdir -p /opt/project/backup/source
rsync -av --exclude 'node_modules' --exclude '.git' /opt/project/ /opt/project/backup/source/
```

Verify source backup:

```bash
find /opt/project/backup/source -maxdepth 2 | head
```

#### Log

Backup logs from the project and Docker:

```bash
mkdir -p /opt/project/backup/logs
cp /var/log/nginx/*.log /opt/project/backup/logs/ 2>/dev/null || true
cp /opt/project/log/*.log /opt/project/backup/logs/ 2>/dev/null || true
docker-compose logs --no-color > /opt/project/backup/logs/docker-compose.log
```

#### Script backup tự động

Tạo file script `/opt/project/script/backup.sh`:

```bash
sudo tee /opt/project/script/backup.sh > /dev/null <<'EOF'
#!/bin/bash
set -e

BACKUP_DIR=/opt/project/backup
DATE=$(date +%F)
DB_DIR="$BACKUP_DIR/db"
REDIS_DIR="$BACKUP_DIR/redis"
MINIO_DIR="$BACKUP_DIR/minio"
SOURCE_DIR="$BACKUP_DIR/source"
LOG_DIR="$BACKUP_DIR/logs"

mkdir -p "$DB_DIR" "$REDIS_DIR" "$MINIO_DIR" "$SOURCE_DIR" "$LOG_DIR"

echo "Backing up PostgreSQL..."
docker-compose exec db pg_dump -U postgres cms_db > "$DB_DIR/cms_db_$DATE.sql"

echo "Backing up Redis..."
docker-compose exec redis sh -c "cp /data/dump.rdb /tmp/dump.rdb"
docker cp $(docker-compose ps -q redis):/tmp/dump.rdb "$REDIS_DIR/dump_$DATE.rdb" || true

echo "Backing up MinIO..."
docker run --rm -v project_minio_data:/data -v "$MINIO_DIR":/backup alpine \
  sh -c "cd /data && tar czf /backup/minio_data_$DATE.tar.gz ."

echo "Backing up source..."
rsync -av --exclude 'node_modules' --exclude '.git' /opt/project/ "$SOURCE_DIR/"

echo "Backing up logs..."
cp /var/log/nginx/*.log "$LOG_DIR/" 2>/dev/null || true
cp /opt/project/log/*.log "$LOG_DIR/" 2>/dev/null || true
docker-compose logs --no-color > "$LOG_DIR/docker-compose_$DATE.log"

echo "Backup completed: $DATE"
EOF

sudo chmod +x /opt/project/script/backup.sh
```

Chạy thử script backup:

```bash
sudo /opt/project/script/backup.sh
```

#### Cronjob

Tạo cronjob để chạy backup hàng ngày:

```bash
sudo tee /etc/cron.d/cms-backup > /dev/null <<'EOF'
0 2 * * * root /opt/project/script/backup.sh >> /opt/project/backup/cron.log 2>&1
EOF
```

Kiểm tra cronjob:

```bash
sudo cat /etc/cron.d/cms-backup
sudo systemctl restart cron
sudo systemctl status cron
```

Kiểm tra lịch log cron:

```bash
tail -n 50 /opt/project/backup/cron.log
```

#### Restore

##### Restore Database

1. Stop application services that use the database:

```bash
docker-compose stop backend
```

2. Restore PostgreSQL from backup file:

```bash
docker-compose exec -T db psql -U postgres cms_db < /opt/project/backup/db/cms_db_2026-07-02.sql
```

3. Verify data restoration:

```bash
docker-compose exec db psql -U postgres -d cms_db -c "SELECT COUNT(*) FROM information_schema.tables;"
```

##### Restore Redis

1. Stop Redis container:

```bash
docker-compose stop redis
```

2. Copy the backup file into Redis data directory:

```bash
sudo mkdir -p /var/lib/redis
sudo cp /opt/project/backup/redis/dump_2026-07-02.rdb /var/lib/redis/dump.rdb
sudo chown redis:redis /var/lib/redis/dump.rdb
```

3. Start Redis:

```bash
sudo systemctl start redis
```

4. Verify Redis state:

```bash
redis-cli ping
```

If you restore AOF instead of RDB, use `appendonly.aof` and adjust Redis config accordingly.

##### Restore MinIO

1. Stop any MinIO service or container:

```bash
docker-compose stop minio
```

2. Restore MinIO objects from the backup archive:

```bash
docker run --rm -v project_minio_data:/data -v /opt/project/backup/minio:/backup alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/minio_data_2026-07-02.tar.gz -C /data"
```

3. Start MinIO again:

```bash
docker-compose up -d minio
```

4. Verify MinIO bucket contents:

```bash
mc alias set local http://127.0.0.1:9000 minioadmin minioadmin123
mc ls local/cms-bucket
```

##### Restore Source

Restore project source files from backup copy:

```bash
sudo rm -rf /opt/project/*
sudo mkdir -p /opt/project
sudo rsync -av --exclude 'node_modules' --exclude '.git' /opt/project/backup/source/ /opt/project/
sudo chown -R $USER:$USER /opt/project
```

If the backup source contains deployment settings, verify `.env` and Docker Compose files after restore.

##### Khôi phục toàn bộ hệ thống

1. Stop all Compose services:

```bash
docker-compose down
```

2. Restore source and configuration first (if the repository was lost):

```bash
sudo rm -rf /opt/project/*
sudo rsync -av --exclude 'node_modules' --exclude '.git' /opt/project/backup/source/ /opt/project/
```

3. Restore database, Redis, MinIO, and logs using the sections above.

4. Start foundational services:

```bash
docker-compose up -d db redis minio
```

5. Start application services:

```bash
docker-compose up -d backend frontend
```

6. Confirm all services are healthy:

```bash
docker-compose ps
curl --fail http://127.0.0.1:8080/api/health
curl --fail http://127.0.0.1:3000/
```

7. Check logs for errors:

```bash
docker-compose logs -f backend frontend db redis minio
```

##### Full system restore example

```bash
# Stop current services
docker-compose down

# Restore source files
sudo rm -rf /opt/project/*
sudo rsync -av --exclude 'node_modules' --exclude '.git' /opt/project/backup/source/ /opt/project/

# Restore database
docker-compose up -d db
sleep 10
docker-compose exec -T db psql -U postgres cms_db < /opt/project/backup/db/cms_db_2026-07-02.sql

# Restore Redis
docker-compose stop redis
sudo cp /opt/project/backup/redis/dump_2026-07-02.rdb /var/lib/redis/dump.rdb
sudo chown redis:redis /var/lib/redis/dump.rdb
sudo systemctl start redis

# Restore MinIO
docker-compose stop minio
docker run --rm -v project_minio_data:/data -v /opt/project/backup/minio:/backup alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/minio_data_2026-07-02.tar.gz -C /data"

docker-compose up -d minio backend frontend
```

##### Verify full restore

```bash
docker-compose ps
curl --fail http://127.0.0.1:8080/api/health
curl --fail http://127.0.0.1:3000/
mc alias set local http://127.0.0.1:9000 minioadmin minioadmin123
mc ls local/cms-bucket
```

## Update and Redeploy

### Update source

Pull the latest source from Git or upload updated files to `/opt/project`:

```bash
cd /opt/project
git fetch origin
git checkout main
git pull origin main
```

For a release tag or stable branch:

```bash
git checkout v1.0.0
git pull origin v1.0.0
```

If you are syncing from a local directory:

```bash
rsync -av --exclude 'node_modules' --exclude '.git' /path/to/local/project/ /opt/project/
```

### Build again

Rebuild backend and frontend after source updates:

```bash
docker-compose build backend frontend
```

For local builds:

```bash
cd /opt/project/backend
go mod download
go build -o bin/server ./cmd/server
cd /opt/project/frontend
npm install
npm run build
```

### Migration

Run database migrations after schema or model changes:

```bash
docker-compose exec backend go run ./cmd/migrate/main.go
```

Alternatively, use your migration runner if available:

```bash
docker-compose exec backend ./cmd/migrate/main.go
```

### Restart

Restart the updated services:

```bash
docker-compose up -d backend frontend
```

To restart only backend:

```bash
docker-compose restart backend
```

### Rollback

If the deployment is not stable, rollback to the previous version:

1. Restore source code from the previous commit or tag:

```bash
cd /opt/project
git checkout HEAD~1
```

Or use a known good release:

```bash
git checkout v1.0.0
```

2. Rebuild the rollback version:

```bash
docker-compose build backend frontend
```

3. Restart services:

```bash
docker-compose up -d backend frontend
```

4. If necessary, restore database state from the latest backup:

```bash
docker-compose exec -T db psql -U postgres cms_db < /opt/project/backup/db/cms_db_2026-07-02.sql
```

5. Verify rollback success:

```bash
docker-compose ps
curl --fail http://127.0.0.1:8080/api/health
curl --fail http://127.0.0.1:3000/
```

#### Build locally

**Backend**:
```bash
cd /opt/project/backend
go mod download
go build -o bin/server ./cmd/server
```

**Frontend**:
```bash
cd /opt/project/frontend
npm install
npm run build
```

#### Start services manually

**Backend**:
```bash
cd /opt/project/backend
./bin/server
```

**Frontend**:
```bash
cd /opt/project/frontend
npm run start
```

## Backend Deployment

### Build

For a production backend build on the server:

```bash
cd /opt/project/backend
go mod download
go build -o bin/server ./cmd/server
```

Ensure the binary exists:

```bash
ls -lh /opt/project/backend/bin/server
```

### Dockerfile

Use the backend `Dockerfile` to build the service image. A common multi-stage layout is:

```dockerfile
FROM golang:1.20-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /app/bin/server ./cmd/server

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/bin/server /usr/local/bin/server
WORKDIR /app
CMD ["/usr/local/bin/server"]
```

The service listens on the port defined in `.env`, typically `8080`.

### Docker Compose

The backend service should be defined in `docker-compose.yml` like:

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: cms-backend:latest
    env_file:
      - .env
    ports:
      - "8080:8080"
    depends_on:
      - db
      - redis
      - minio
    restart: unless-stopped
```

If you use a volume for local code changes, add:

```yaml
    volumes:
      - ./backend:/app
```

### Run

Start only the backend service:

```bash
docker-compose up -d backend
```

For a standalone container run:

```bash
docker run -d --name cms-backend \
  --env-file /opt/project/.env \
  -p 8080:8080 \
  cms-backend:latest
```

### Restart

Restart the backend service with Docker Compose:

```bash
docker-compose restart backend
```

Or restart the systemd unit if you deploy using `systemd`:

```bash
sudo systemctl restart cms-backend.service
```

### Logs

Follow backend logs via Docker Compose:

```bash
docker-compose logs -f backend
```

If deployed as a systemd service, use:

```bash
sudo journalctl -u cms-backend.service -f
```

### Health Check

Verify the backend is healthy by calling its health endpoint:

```bash
curl --fail http://127.0.0.1:8080/api/health
```

If using Docker Compose:

```bash
docker-compose exec backend curl --fail http://127.0.0.1:8080/api/health
```

A successful response should return HTTP `200` and a simple JSON payload or `OK` status.

## Frontend Deployment

### Build

Build the frontend for production:

```bash
cd /opt/project/frontend
npm install
npm run build
```

Verify the build output:

```bash
ls -lh /opt/project/frontend/.next
```

### Docker

The `frontend/Dockerfile` should build the Next.js app and serve it.
A typical Dockerfile layout is:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./ ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Run

Run the frontend with Docker Compose:

```bash
docker-compose up -d frontend
```

Run the frontend container directly:

```bash
docker run -d --name cms-frontend \
  -p 3000:3000 \
  -v /opt/project/frontend:/app \
  -w /app \
  node:18-alpine \
  sh -c "npm install && npm run start"
```

If you prefer static export or a production process manager, adapt the command to your deployment strategy.

### Log

Follow frontend logs via Docker Compose:

```bash
docker-compose logs -f frontend
```

If running manually, use the terminal output of `npm run start` or the process manager logs.

### Health Check

Verify the frontend is serving pages:

```bash
curl --fail http://127.0.0.1:3000
```

Or request a known page:

```bash
curl --fail http://127.0.0.1:3000/
```

A successful response should return HTTP `200` and the HTML for the homepage.

## Nginx Configuration

Use Nginx as a reverse proxy for both frontend and backend. The following `nginx.conf` is a complete example with gzip, cache, WebSocket support, upload limits, and timeout settings.

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    server_tokens off;
    server_names_hash_bucket_size 64;

    client_max_body_size 100m;
    client_body_timeout 60s;
    client_header_timeout 60s;
    send_timeout 60s;

    proxy_connect_timeout 60s;
    proxy_send_timeout 180s;
    proxy_read_timeout 180s;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;

    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    proxy_cache_path /var/cache/nginx/app_cache levels=1:2 keys_zone=app_cache:10m max_size=1g inactive=60m use_temp_path=off;

    upstream cms_backend {
        server 127.0.0.1:8080;
    }

    upstream cms_frontend {
        server 127.0.0.1:3000;
    }

    server {
        listen 80;
        server_name cms.example.com;

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        location /static/ {
            root /opt/project/frontend/public;
            access_log off;
            expires 30d;
            add_header Cache-Control "public, max-age=2592000";
        }

        location /_next/ {
            proxy_pass http://cms_frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /api/ {
            proxy_pass http://cms_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Port $server_port;

            proxy_cache app_cache;
            proxy_cache_valid 200 302 60m;
            proxy_cache_valid 404 1m;
            add_header X-Cache $upstream_cache_status;
        }

        location / {
            proxy_pass http://cms_frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Port $server_port;
        }

        location /upload/ {
            client_max_body_size 200m;
            proxy_pass http://cms_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_cache_bypass $http_upgrade;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

### Explanation

- `proxy_pass` chuyển hướng `/api/` đến backend và tất cả request khác đến frontend.
- `gzip` nén nội dung tĩnh và API trả về để cải thiện hiệu suất.
- `proxy_cache` lưu cache cho response hợp lệ, giảm tải backend.
- `client_max_body_size` và `location /upload/` đảm bảo upload tệp lớn hoạt động.
- `proxy_set_header Upgrade` và `Connection` hỗ trợ WebSocket cho Next.js và backend nếu cần.
- `proxy_read_timeout`, `proxy_send_timeout` và `send_timeout` xử lý request dài khi upload hoặc xử lý nặng.

### Deploy Nginx

1. Lưu file cấu hình vào `/etc/nginx/nginx.conf` hoặc file site riêng trong `/etc/nginx/conf.d/cms.conf`.
2. Kiểm tra cấu hình:

```bash
sudo nginx -t
```

3. Reload Nginx:

```bash
sudo systemctl reload nginx
```

4. Nếu cần restart toàn bộ dịch vụ:

```bash
sudo systemctl restart nginx
```

### Notes

- Nếu chạy frontend và backend trong Docker, thay `127.0.0.1` bằng network host hoặc tên service.
- Với HTTPS, thêm khối `server` cho `listen 443 ssl;` và `ssl_certificate` / `ssl_certificate_key`.

### 5. Verify build and deployment

- Confirm the backend is reachable: `curl http://127.0.0.1:8080/api/health`
- Confirm frontend build output exists in `frontend/.next`
- Confirm MinIO bucket is available and credentials work
- Confirm database and Redis connections succeed

### 6. Notes

- Keep `.env` out of source control.
- Use secure, unique secrets for production.
- If deploying to a production server, use a process manager such as `systemd`, `Docker`, or `pm2` for frontend hosting.

### 7. Example `systemd` service for backend

```ini
[Unit]
Description=CMS Backend
After=network.target

[Service]
WorkingDirectory=/opt/project/backend
ExecStart=/opt/project/backend/bin/server
EnvironmentFile=/opt/project/.env
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

### 8. Example `systemd` service for frontend

```ini
[Unit]
Description=CMS Frontend
After=network.target

[Service]
WorkingDirectory=/opt/project/frontend
ExecStart=/usr/bin/npm run start
Environment=PORT=3000
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

### 9. Final checklist

- Source is cloned or uploaded to `/opt/project`
- `.env` is configured and secured
- Docker or local build completed successfully
- Backend and frontend services are running
- Database, Redis, MinIO, and JWT values are verified

### Development Setup (Local)

**Backend:**
```bash
cd backend
go mod download
go run ./cmd/server/main.go
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Database Migrations

Migrations are automatically applied on server startup via `AutoMigrate()` in the router.

To manually run migrations:
```bash
cd backend
go run ./cmd/migrate/main.go
```

## API Endpoints

See [API.md](API.md) for complete API documentation.

Key endpoints:
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- News: `/api/news`, `/api/news/:id`
- Users: `/api/users`, `/api/users/:id`
- Media: `/api/media`, `/api/media/upload`
- Banners: `/api/banners`
- Categories: `/api/categories`
- Roles: `/api/roles`
- Dashboard: `/api/dashboard/stats`, `/api/dashboard/recent`

## Admin Panel

Access admin at `/admin`:
- Dashboard with statistics
- User management
- News publishing
- Media gallery
- Category management
- Role & permission management
- Banner management
- Dark mode support

## Public Website

Public pages:
- Home page with featured news & media
- News list and detail pages
- Videos gallery
- Photo album
- Contact form
- Responsive design
- Dark mode support

## Makefile Commands

```bash
make build    # Build Docker images
make up       # Start services
make down     # Stop services
make logs     # View logs
make migrate  # Run migrations
make seed     # Run seeds
make clean    # Remove containers & volumes
```

## Environment Variables

See `.env.example` for all available configuration:
- Database connection (PostgreSQL)
- Redis connection
- MinIO credentials
- JWT secret
- API port and frontend URL

## Authentication

The system uses JWT tokens for authentication:
1. User registers or logs in
2. Server returns access_token and refresh_token
3. Client stores tokens and includes access_token in Authorization header
4. Tokens expire after 24 hours
5. Use refresh_token to get new access_token

## File Upload

Files are uploaded to MinIO with the following structure:
- News featured images: `uploads/news/`
- Media files: `media/`
- Banner images: `uploads/banners/`

## Development

### Backend Testing

Run with verbose output:
```bash
cd backend
go run ./cmd/server/main.go
```

### Frontend Development

Hot reload enabled:
```bash
cd frontend
npm run dev
```

### Swagger Documentation

Generate Swagger docs:
```bash
cd backend
swag init
```

## Production Deployment

### Docker Build

```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### Environment Configuration

Set production environment variables in `.env` file before deployment.

### Database Backup

```bash
docker-compose exec postgres pg_dump -U postgres appdb > backup.sql
```

### Database Restore

```bash
docker-compose exec -T postgres psql -U postgres appdb < backup.sql
```

## Troubleshooting

**Database connection issues:**
```bash
docker-compose logs postgres
```

**MinIO not accessible:**
```bash
docker-compose logs minio
```

**Port already in use:**
Edit docker-compose.yml and change port mappings.

**Frontend can't connect to API:**
Ensure `NEXT_PUBLIC_API_URL` is set correctly in frontend environment.

## Architecture

The project follows a layered architecture:

**Backend:**
```
Handlers (HTTP) → Services (Business Logic) → Models (Database)
                                          ↓
                                    Database & Storage
```

**Frontend:**
```
Pages → Components → API Wrapper → Backend API
                                ↓
                            Next.js Server
```

## Security Considerations

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Input validation
- ✅ Role-based access control
- 🔧 Rate limiting (recommended for production)
- 🔧 HTTPS/TLS (configure in production)
- 🔧 SQL injection prevention (GORM ORM)

## Performance Optimization

- Pagination on all list endpoints
- Database indexing on frequently queried fields
- MinIO for efficient file serving
- Redis for token caching
- Next.js Image optimization (ready for implementation)

## Monitoring

Logs are available via Docker:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Support

For issues or questions, please refer to API.md for endpoint details or check the GitHub issues page.

## License

Proprietary - All rights reserved
