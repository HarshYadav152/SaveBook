# 🐳 Docker Setup Guide

Complete guide for running SaveBook with Docker.

---

## Docker vs Local Development

| Feature | Docker | Local |
|---------|--------|-------|
| Setup Time | ⚡ 2-3 min | 5-10 min |
| Consistency | ✅ Identical | Varies |
| Hot Reload | ❌ No | ✅ Yes |

**Use Docker for:** Quick setup, testing, consistent environment  
**Use Local for:** Active development with hot reload

---

## Prerequisites

- Docker (v20.10+) and Docker Compose (v2.0+)
- Verify: `docker --version && docker-compose --version`

---

## Quick Start

```bash
# 1. Clone and navigate
git clone https://github.com/HarshYadav152/SaveBook.git
cd SaveBook/savebook

# 2. Setup environment
cp .env.docker.example .env
# Edit .env if needed (especially ACCESS_TOKEN_SECRET)

# 3. Start services
docker-compose up -d

# 4. View logs
docker-compose logs -f app
```

**Access the application:**
- App: http://localhost:3000
- MongoDB: `localhost:27017`
- Mongo Express (debug mode): http://localhost:8081

---

## Common Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart app
```

### After Code Changes
```bash
# Rebuild and restart app
docker-compose up -d --build app
```

### Database Management
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p admin123

# Enable Mongo Express UI
docker-compose --profile debug up -d
# Access at http://localhost:8081
```

### Complete Reset
```bash
# Warning: Deletes all data
docker-compose down -v
docker-compose up -d --build
```

---

## Environment Variables

Edit `.env` file with these key variables:

```bash
# Required
ACCESS_TOKEN_SECRET=your-secret-min-32-chars  # Change for production!
MONGO_ROOT_PASSWORD=admin123                  # Change for security!

# Optional (for image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Generate secure token:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## Service Ports

| Service | Port | Access |
|---------|------|--------|
| SaveBook App | 3000 | http://localhost:3000 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Mongo Express | 8081 | http://localhost:8081 (debug) |

---

## Troubleshooting

### Check Service Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs mongodb
```

### MongoDB Connection Issues
```bash
# Check MongoDB health
docker-compose exec mongodb mongosh -u admin -p admin123 --eval "db.adminCommand('ping')"

# Restart MongoDB
docker-compose restart mongodb
```

### Port Conflicts
```powershell
# Check if ports are in use (Windows)
Get-NetTCPConnection -LocalPort 3000,27017,8081
```

### Nuclear Reset
```bash
# Remove everything and start fresh
docker-compose down -v
docker system prune -af
docker-compose up -d --build
```

---

## Docker Configuration Files

- **`Dockerfile`**: Multi-stage build (deps → build → production)
- **`docker-compose.yml`**: Orchestrates app, MongoDB, and Mongo Express
- **`.dockerignore`**: Excludes files from build context
- **`.env.docker.example`**: Environment template

---

## Data Persistence

MongoDB data persists in Docker volumes:
- `mongodb_data`: Database files
- `mongodb_config`: Configuration

**Backup database:**
```bash
docker-compose exec mongodb mongodump -u admin -p admin123 --authenticationDatabase admin -o /data/backup
docker cp savebook-mongodb:/data/backup ./mongodb-backup
```

---

## Security Notes

For production:
1. Change `ACCESS_TOKEN_SECRET` to a strong random value
2. Update `MONGO_ROOT_PASSWORD` from default
3. Never commit `.env` files to git
4. Don't expose MongoDB port publicly

---

## Additional Help

- [Docker Docs](https://docs.docker.com/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Report Issues](https://github.com/HarshYadav152/SaveBook/issues)

---

Built for **ECWoC 2026** 🚀
