# Docker Deployment Guide

## Quick Start

### 1. Start Everything (App + Database)
```bash
docker-compose up -d
```

This will:
- Pull PostgreSQL image
- Build your NestJS app
- Run database migrations
- Start both services

### 2. View Logs
```bash
# All services
docker-compose logs -f

# Just the app
docker-compose logs -f app

# Just the database
docker-compose logs -f postgres
```

### 3. Stop Everything
```bash
docker-compose down
```

### 4. Stop and Remove Data
```bash
docker-compose down -v
```

## Development with Docker

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Run Prisma Commands
```bash
# Generate Prisma Client
docker-compose exec app npx prisma generate

# Create a new migration
docker-compose exec app npx prisma migrate dev --name migration_name

# View database in Prisma Studio
docker-compose exec app npx prisma studio
```

### Access Database Directly
```bash
docker-compose exec postgres psql -U postgres -d mydb
```

## Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-super-secret-key-here
```

## Ports

- **App**: http://localhost:3000
- **Database**: localhost:5433 (mapped from container's 5432)

## Production Deployment

### Deploy to VPS (Oracle Cloud, Contabo, etc.)

1. **Install Docker on server**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

2. **Clone your repo**:
```bash
git clone <your-repo-url>
cd todo
```

3. **Set environment variables**:
```bash
echo "JWT_SECRET=your-production-secret" > .env
```

4. **Start services**:
```bash
docker-compose up -d
```

5. **Check status**:
```bash
docker-compose ps
```

### Update Deployment

```bash
git pull
docker-compose up -d --build
```

## Troubleshooting

### App won't start
```bash
# Check logs
docker-compose logs app

# Restart app
docker-compose restart app
```

### Database connection issues
```bash
# Check if database is healthy
docker-compose ps

# Restart database
docker-compose restart postgres
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d --build
```

## Health Checks

- App: http://localhost:3000
- Database: Automatically checked by Docker

## Backup Database

```bash
docker-compose exec postgres pg_dump -U postgres mydb > backup.sql
```

## Restore Database

```bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres -d mydb
```
