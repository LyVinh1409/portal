# Deployment Guide

## 1. Ubuntu Server Preparation

### Hardware Requirements

- CPU: 4 vCPU or higher
- RAM: 8 GB or higher
- Disk: 80 GB SSD or higher

### Ubuntu Version

- Ubuntu 24.04 LTS

### Partition Layout

- `/` root: 40 GB
- `/var` or `/srv`: 30 GB
- `swap`: 4 GB (or equal to RAM if RAM < 8 GB)

### Hostname

```bash
sudo hostnamectl set-hostname cms-server
```

### Timezone

```bash
sudo timedatectl set-timezone Asia/Ho_Chi_Minh
```

### Locale

```bash
sudo locale-gen en_US.UTF-8
sudo update-locale LANG=en_US.UTF-8
```

### Network

- Sử dụng cấu hình IP tĩnh nếu máy chủ vật lý hoặc VM cần địa chỉ cố định.
- Kiểm tra kết nối mạng:

```bash
ip a
ping -c 4 8.8.8.8
```

### DNS

- Thiết lập DNS trong tệp `/etc/resolv.conf` hoặc cấu hình mạng để sử dụng DNS nội bộ.
- Kiểm tra DNS:

```bash
dig +short example.com
```

### Firewall

- Bật UFW:

```bash
sudo apt update
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

### SSH

- Cấu hình SSH:

```bash
sudo sed -i 's/^#Port 22/Port 22/' /etc/ssh/sshd_config
sudo sed -i 's/^#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

- Tạo người dùng deploy:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
```

- Thêm khóa SSH công khai vào `/home/deploy/.ssh/authorized_keys` và đặt quyền:

```bash
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

## 2. Ubuntu Update and Validation

1. Update package list:

```bash
sudo apt update
```

2. Upgrade installed packages:

```bash
sudo apt upgrade -y
```

3. Remove unused packages:

```bash
sudo apt autoremove -y
```

4. Reboot server if needed:

```bash
sudo reboot
```

5. Check Ubuntu version:

```bash
lsb_release -a
cat /etc/os-release
```

6. Check Linux kernel version:

```bash
uname -r
uname -a
```

7. Check network status:

```bash
ip a
ip route
ping -c 4 8.8.8.8
```

## 3. Install Base Packages

1. Install required system packages:

```bash
sudo apt update
sudo apt install -y curl wget unzip git vim htop net-tools build-essential jq tree zip rsync openssl
```

2. Verify installation:

```bash
curl --version
wget --version
unzip -v
git --version
vim --version
htop --version
ifconfig --version || ip addr show
make --version
jq --version
tree --version
zip --version
rsync --version
openssl version
```

## 4. Install Docker Platform

1. Install Docker Engine and CLI:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

2. Enable and start Docker service:

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

3. Configure Docker network and volume support:

```bash
sudo docker network create cms-network || true
sudo docker volume create cms-data || true
sudo docker volume create cms-postgres || true
sudo docker volume create cms-minio || true
```

4. Add current user to Docker group:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

5. Verify Docker installation:

```bash
docker version
docker compose version
docker buildx version
docker network ls
docker volume ls
```

## 5. Create Directory Structure

1. Create project directories:

```bash
sudo mkdir -p /opt/project/backend
sudo mkdir -p /opt/project/frontend
sudo mkdir -p /opt/project/data
sudo mkdir -p /opt/project/nginx
sudo mkdir -p /opt/project/docker
sudo mkdir -p /opt/project/log
sudo mkdir -p /opt/project/script
sudo mkdir -p /opt/project/backup
sudo mkdir -p /opt/project/upload
```

2. Set owner and permissions:

```bash
sudo chown -R $USER:$USER /opt/project
sudo chmod -R 755 /opt/project
```

## 6. Install PostgreSQL

1. Install PostgreSQL server:

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

2. Start and enable PostgreSQL service:

```bash
sudo systemctl enable postgresql
sudo systemctl start postgresql
sudo systemctl status postgresql
```

3. Switch to PostgreSQL user:

```bash
sudo -u postgres psql
```

4. Create database user and database:

```sql
CREATE USER cms_user WITH PASSWORD 'StrongPasswordHere!';
CREATE DATABASE cms_db OWNER cms_user;
```

5. Grant permissions:

```sql
GRANT ALL PRIVILEGES ON DATABASE cms_db TO cms_user;
\q
```

6. Configure password authentication:

```bash
sudo sed -i "s/^#*\(local\s\+all\s\+postgres\s\+peer\)/local all postgres peer/" /etc/postgresql/*/main/pg_hba.conf
sudo sed -i "s/^#*\(local\s\+all\s\+all\s\+peer\)/local all all md5/" /etc/postgresql/*/main/pg_hba.conf
sudo sed -i "s/^#*\(host\s\+all\s\+all\s\+127.0.0.1\/32\s\+127.0.0.1\/32\)/host all all 127.0.0.1\/32 md5/" /etc/postgresql/*/main/pg_hba.conf
sudo systemctl restart postgresql
```

7. Backup database:

```bash
sudo -u postgres pg_dump cms_db > /opt/project/backup/cms_db_$(date +%F).sql
```

8. Restore database:

```bash
sudo -u postgres psql cms_db < /opt/project/backup/cms_db_2026-07-02.sql
```

9. Verify PostgreSQL:

```bash
sudo -u postgres psql -c "\l"
sudo -u postgres psql -c "\du"
```

## 7. Install Redis

1. Install Redis server:

```bash
sudo apt update
sudo apt install -y redis-server
```

2. Configure Redis:

```bash
sudo sed -i "s/^# requirepass .*/requirepass StrongRedisPassword!/'" /etc/redis/redis.conf
sudo sed -i "s/^supervised no/supervised systemd/" /etc/redis/redis.conf
sudo sed -i "s/^bind 127.0.0.1 ::1/bind 0.0.0.0 ::1/" /etc/redis/redis.conf
```

3. Restart Redis service:

```bash
sudo systemctl restart redis.service
sudo systemctl enable redis.service
sudo systemctl status redis.service
```

4. Test Redis connection:

```bash
redis-cli -a StrongRedisPassword! ping
redis-cli -a StrongRedisPassword! info server
```

5. Verify Redis authentication:

```bash
redis-cli -h 127.0.0.1 -p 6379 -a StrongRedisPassword! ping
```

## 8. Install MinIO

1. Download MinIO server:

```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio -O /tmp/minio
chmod +x /tmp/minio
```

2. Install MinIO:

```bash
sudo mv /tmp/minio /usr/local/bin/minio
sudo chown root:root /usr/local/bin/minio
sudo chmod 755 /usr/local/bin/minio
```

3. Create MinIO directories:

```bash
sudo mkdir -p /opt/project/minio/data
sudo mkdir -p /opt/project/minio/config
sudo chown -R $USER:$USER /opt/project/minio
```

4. Create MinIO systemd service:

```bash
sudo tee /etc/systemd/system/minio.service > /dev/null <<'EOF'
[Unit]
Description=MinIO Object Storage
After=network.target
Requires=network.target

[Service]
User=$USER
Group=$USER
ExecStart=/usr/local/bin/minio server /opt/project/minio/data --console-address ":9001"
Environment="MINIO_ROOT_USER=minioadmin"
Environment="MINIO_ROOT_PASSWORD=minioadmin123"
Restart=always
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```

5. Start MinIO service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable minio.service
sudo systemctl start minio.service
sudo systemctl status minio.service
```

6. Create MinIO bucket:

```bash
mc alias set local http://127.0.0.1:9000 minioadmin minioadmin123
mc mb local/cms-bucket
```

7. Set MinIO bucket policy:

```bash
mc policy set download local/cms-bucket
```

## 9. Repository Setup

1. Clone repository:

```bash
git clone <repository-url> "~/cms-project"
cd "~/cms-project"
```

2. Copy environment sample files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Edit `.env` files with production values:

- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `REDIS_ADDR`
- `MINIO_ENDPOINT`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET`
- `JWT_SECRET`
- `API_PORT`
- `NEXT_PUBLIC_API_URL`

## 3. Docker Compose Deployment

1. Build and start services:

```bash
sudo docker compose up -d --build
```

2. Check service status:

```bash
sudo docker compose ps
```

3. View logs:

```bash
sudo docker compose logs -f
```

## 4. Monitoring and Log Review

### View logs

Follow Docker Compose logs for all services:

```bash
sudo docker compose logs -f
```

Follow a single service log:

```bash
sudo docker compose logs -f backend
sudo docker compose logs -f frontend
sudo docker compose logs -f db
sudo docker compose logs -f redis
sudo docker compose logs -f minio
```

View Nginx access and error logs:

```bash
sudo tail -F /var/log/nginx/access.log /var/log/nginx/error.log
```

View PostgreSQL logs:

```bash
sudo journalctl -u postgresql -f
```

View Redis logs:

```bash
sudo journalctl -u redis -f
```

### CPU, RAM, Disk

Real-time CPU and RAM monitoring:

```bash
top
```

or using `htop`:

```bash
htop
```

View memory usage summary:

```bash
free -h
```

View disk usage and inode usage:

```bash
df -h
sudo du -sh /opt/project/*
```

Check disk I/O and performance counters:

```bash
iostat -xz 1 3
```

### Docker monitoring

View live container resource usage:

```bash
docker stats --all
```

Inspect container status and restarts:

```bash
docker ps --format "table {{.Names}}	{{.Status}}	{{.Ports}}	{{.RestartCount}}"
```

Check Docker event stream for real-time events:

```bash
docker events --filter "container=backend" --filter "container=db" --filter "container=redis" --filter "container=minio" --filter "container=frontend"
```

### Nginx health

Check Nginx worker status and configuration:

```bash
sudo nginx -t
sudo systemctl status nginx
```

Check open ports and listening sockets:

```bash
sudo ss -tulnp | grep nginx
```

### PostgreSQL health

Check PostgreSQL service status and readiness:

```bash
sudo systemctl status postgresql
sudo -u postgres pg_isready
```

Inspect active PostgreSQL connections:

```bash
sudo -u postgres psql -c "SELECT datname, usename, state, query FROM pg_stat_activity WHERE state <> 'idle';"
```

### Redis health

Check Redis service status:

```bash
sudo systemctl status redis
```

Test Redis connectivity and ping:

```bash
redis-cli -a StrongRedisPassword! ping
```

Check Redis info metrics:

```bash
redis-cli -a StrongRedisPassword! info memory
redis-cli -a StrongRedisPassword! info persistence
```

## 5. Operations

### Start services

Start all services using Docker Compose:

```bash
sudo docker compose up -d
```

Start a specific service:

```bash
sudo docker compose up -d backend
sudo docker compose up -d frontend
sudo docker compose up -d db
sudo docker compose up -d redis
sudo docker compose up -d minio
```

If using `systemd` for the Compose stack:

```bash
sudo systemctl start docker-compose-cms.service
```

### Stop services

Stop all services cleanly:

```bash
sudo docker compose down
```

Stop individual services:

```bash
sudo docker compose stop backend
sudo docker compose stop frontend
sudo docker compose stop db
sudo docker compose stop redis
sudo docker compose stop minio
```

If using `systemd`:

```bash
sudo systemctl stop docker-compose-cms.service
```

### Restart services

Restart all services:

```bash
sudo docker compose restart
```

Restart a specific service:

```bash
sudo docker compose restart backend
sudo docker compose restart frontend
sudo docker compose restart db
sudo docker compose restart redis
sudo docker compose restart minio
```

If using `systemd`:

```bash
sudo systemctl restart docker-compose-cms.service
```

### Check services

Verify Docker Compose service status:

```bash
sudo docker compose ps
```

Check a single service container:

```bash
sudo docker compose ps backend
sudo docker compose ps frontend
sudo docker compose ps db
sudo docker compose ps redis
sudo docker compose ps minio
```

Verify service health endpoints:

```bash
curl --fail http://127.0.0.1:8080/api/health
curl --fail http://127.0.0.1:3000/
curl --fail http://127.0.0.1:9000/minio/health/live
```

### Maintenance

Put the application into maintenance mode by stopping public services and keeping only admin or maintenance pages running.

Example stop application services:

```bash
sudo docker compose stop backend frontend
```

Keep supporting services running:

```bash
sudo docker compose up -d db redis minio
```

Use a maintenance banner or Nginx temporary page in `nginx.conf` if needed.

### Uninstall

Remove Docker Compose stack and optional volumes:

```bash
sudo docker compose down --volumes --remove-orphans
```

Remove installed packages if required:

```bash
sudo apt remove -y docker-ce docker-ce-cli containerd.io docker-compose-plugin nginx postgresql postgresql-contrib redis-server
sudo apt autoremove -y
```

Remove project data and directories:

```bash
sudo rm -rf /opt/project
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/postgresql
sudo rm -rf /var/lib/redis
sudo rm -rf /var/lib/nginx
```

### Cleanup

Clean Docker unused objects:

```bash
sudo docker system prune -af
sudo docker volume prune -f
sudo docker network prune -f
```

Clean Nginx cache and temporary files:

```bash
sudo rm -rf /var/cache/nginx/*
sudo rm -rf /tmp/nginx* || true
```

Clean application logs and backups if no longer needed:

```bash
sudo rm -rf /opt/project/backup/*
sudo rm -rf /opt/project/log/*
```

### Full maintenance workflow

1. Stop application services:

```bash
sudo docker compose stop backend frontend
```

2. Backup current state before maintenance.
3. Apply updates or fixes.
4. Restart services:

```bash
sudo docker compose up -d backend frontend
```

5. Verify health and logs.

## 6. Database Migration and Seed

1. Run migrations:

```bash
sudo docker compose exec backend ./backend/cmd/migrate/migrate
```

2. Verify seed user creation:

```bash
sudo docker compose exec backend ./backend/cmd/migrate/migrate
```

## 5. Systemd Service for Docker Compose

1. Create `docker-compose.service`:

```bash
sudo tee /etc/systemd/system/docker-compose-cms.service > /dev/null <<'EOF'
[Unit]
Description=CMS Docker Compose Service
After=network.target docker.service
Requires=docker.service

[Service]
Type=oneshot
WorkingDirectory=/home/$USER/cms-project
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
RemainAfterExit=yes
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
EOF
```

2. Reload systemd and enable service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable docker-compose-cms.service
sudo systemctl start docker-compose-cms.service
```

3. Check service state:

```bash
sudo systemctl status docker-compose-cms.service
```

## 6. SSL and Reverse Proxy

### 1. Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 2. Open firewall for HTTPS

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### 3. Create Nginx configuration

Tạo file `/etc/nginx/sites-available/cms.conf`:

```bash
sudo tee /etc/nginx/sites-available/cms.conf > /dev/null <<'EOF'
server {
  listen 80;
  listen [::]:80;
  server_name example.com www.example.com;

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name example.com www.example.com;

  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 1d;
  ssl_stapling on;
  ssl_stapling_verify on;
  resolver 1.1.1.1 8.8.8.8 valid=300s;
  resolver_timeout 5s;

  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  add_header X-Frame-Options DENY;
  add_header X-Content-Type-Options nosniff;
  add_header X-XSS-Protection "1; mode=block";

  proxy_buffering on;
  proxy_cache_valid 200 302 10m;

  location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 180s;
    proxy_send_timeout 180s;
    client_max_body_size 200m;
  }

  location /_next/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /upload/ {
    client_max_body_size 200m;
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  access_log /var/log/nginx/cms.access.log;
  error_log /var/log/nginx/cms.error.log;
}
EOF
```

Tạo thư mục cho Certbot challenge:

```bash
sudo mkdir -p /var/www/certbot
sudo chown -R www-data:www-data /var/www/certbot
```

Kích hoạt site và kiểm tra cấu hình:

```bash
sudo ln -sf /etc/nginx/sites-available/cms.conf /etc/nginx/sites-enabled/cms.conf
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5. Obtain Let's Encrypt certificate

```bash
sudo certbot --nginx -d example.com -d www.example.com --email admin@example.com --agree-tos --redirect --no-eff-email
```

Nếu muốn chỉ cấp chứng chỉ mà không tự động cấu hình Nginx:

```bash
sudo certbot certonly --webroot -w /var/www/certbot -d example.com -d www.example.com --email admin@example.com --agree-tos --no-eff-email
```

### 6. Auto renew

Kích hoạt timer Certbot:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

Kiểm tra trạng thái timer:

```bash
sudo systemctl status certbot.timer
```

Thử renew khô:

```bash
sudo certbot renew --dry-run
```

### 7. Check SSL

Kiểm tra chứng chỉ cục bộ:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Kiểm tra kết nối HTTPS:

```bash
curl -I https://example.com
curl -I https://example.com/api/health
```

Kiểm tra với OpenSSL:

```bash
openssl s_client -connect example.com:443 -servername example.com
```

Kiểm tra tự động renew:

```bash
sudo certbot renew --dry-run
```

Kiểm tra trạng thái SSL từ trình duyệt:

- Mở `https://example.com`
- Xác nhận biểu tượng khoá xanh và kết nối an toàn

Ngoài ra có thể dùng công cụ bên thứ ba để đánh giá toàn diện:

- https://www.ssllabs.com/ssltest/
- https://www.whynopadlock.com/

## 7. Production Build

1. Backend build inside container:

```bash
sudo docker compose exec backend go build -o /app/server ./cmd/server
```

2. Frontend build inside container:

```bash
sudo docker compose exec frontend npm install
sudo docker compose exec frontend npm run build
```

## 8. Monitoring and Logs

1. Docker compose service journal:

```bash
sudo journalctl -u docker-compose-cms.service -f
```

2. Docker logs:

```bash
sudo docker compose logs -f
```

3. Nginx access log:

```bash
sudo tail -f /var/log/nginx/access.log
```

4. Nginx error log:

```bash
sudo tail -f /var/log/nginx/error.log
```
