# 🚀 CV King Deployment Guide

Hướng dẫn triển khai CV King Job Portal với Docker và Jenkins CI/CD.

## 📋 Prerequisites

- Docker & Docker Compose
- Git
- (Optional) Jenkins server for CI/CD

## 🏗️ Local Development

### 1. Clone Repository
```bash
git clone https://github.com/hoangtuanphong1a/cv-king.git
cd cv-king
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

### 3. Start Services
```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## 🔄 Production Deployment

### Manual Docker Deployment

1. **Prepare Production Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo systemctl enable docker
   sudo systemctl start docker

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/hoangtuanphong1a/cv-king.git
   cd cv-king

   # Create production environment
   cp .env.example .env
   nano .env  # Configure production values

   # Start services
   docker-compose -f docker-compose.prod.yml up -d

   # Check status
   docker-compose -f docker-compose.prod.yml ps
   ```

### Jenkins CI/CD Deployment

#### 1. Jenkins Setup Requirements

**Required Credentials in Jenkins:**
- `dockerhub-cred`: Docker Hub username/password
- `server-ssh-key`: SSH private key for production server
- `db-conn`: Database connection string
- `docker-compose-file`: Docker Compose configuration file

#### 2. Jenkins Pipeline Configuration

The `Jenkinsfile` includes:
- **Checkout**: Pull latest code from GitHub
- **Build**: Create optimized Docker images
- **Test**: SSH connection validation
- **Deploy**: Automated deployment to production

#### 3. Production URLs (after Jenkins deployment)
- **Frontend**: http://your-server:3000
- **Backend**: http://your-server:3001
- **API Docs**: http://your-server:3001/api

## 🐳 Docker Images

### Backend Image (`cv-king-backend`)
- **Base**: Node.js 20 Alpine
- **Port**: 3001
- **Health Check**: `/health` endpoint
- **Security**: Non-root user (nodejs:1001)

### Frontend Image (`cv-king-frontend`)
- **Base**: Node.js 20 Alpine
- **Port**: 3000
- **Build Tool**: pnpm
- **Security**: Non-root user (nextjs:1001)

## 🔧 Configuration

### Environment Variables

```bash
# Database
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_DATABASE=cvking_db
MYSQL_USER=cvking_user
MYSQL_PASSWORD=user_password

# JWT
JWT_SECRET=your_256_bit_secret_key_here

# Docker Registry
DOCKER_REGISTRY=docker.io/your-dockerhub-username
BACKEND_IMAGE_NAME=cv-king-backend
FRONTEND_IMAGE_NAME=cv-king-frontend
```

### Port Configuration

| Service | Development | Production | Docker Internal |
|---------|-------------|------------|----------------|
| Backend | 3001 | 3001 | 3001 |
| Frontend | 3000 | 3000 | 3000 |
| MySQL | 3306 | 3307 | 3306 |

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Backend**: `GET /health`
- **Frontend**: `GET /api/health` (if implemented)

### Docker Health Checks
```bash
# Check container health
docker ps
docker stats

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Database Health Check
```bash
# Connect to MySQL container
docker exec -it cv-king-mysql mysql -u cvking_user -p cvking_db
```

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use strong passwords
- Rotate JWT secrets regularly

### 2. Docker Security
- Run containers as non-root users
- Use official base images
- Keep images updated
- Limit resource usage

### 3. Network Security
- Use HTTPS in production
- Configure firewall rules
- Use VPN for database access

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check port usage
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001

# Kill process using port
sudo kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check MySQL container logs
docker-compose -f docker-compose.prod.yml logs mysql

# Test database connection
docker exec -it cv-king-mysql mysql -u cvking_user -p cvking_db -e "SELECT 1;"
```

#### 3. Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

#### 4. Permission Issues
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

### Logs and Debugging

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Enter container for debugging
docker exec -it cv-king-backend sh
docker exec -it cv-king-frontend sh
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Load Balancing
Consider using:
- Nginx reverse proxy
- Docker Swarm
- Kubernetes
- AWS ALB / GCP Load Balancer

## 🔄 Updates & Rollbacks

### Rolling Updates
```bash
# Update images
docker-compose -f docker-compose.prod.yml pull

# Restart services
docker-compose -f docker-compose.prod.yml up -d

# Zero-downtime updates
docker-compose -f docker-compose.prod.yml up -d --no-deps backend
```

### Rollback
```bash
# Rollback to previous version
docker tag cv-king-backend:v1 cv-king-backend:latest
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test health endpoints
4. Check network connectivity

## 🎯 Success Checklist

- [ ] Environment variables configured
- [ ] Docker images built successfully
- [ ] Services running without errors
- [ ] Health checks passing
- [ ] Frontend accessible at port 3000
- [ ] Backend API accessible at port 3001
- [ ] Database connection working
- [ ] User registration/login working
- [ ] Job posting and browsing working

---

**🎉 Happy Deploying!**
