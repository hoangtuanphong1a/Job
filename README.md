# CV King - Job Portal Platform

A modern job portal platform built with Next.js (frontend) and NestJS (backend), featuring employer job posting, job seeker applications, and comprehensive job management.

## 🚀 Features

- **Employer Dashboard**: Post jobs, manage applications, track hiring progress
- **Job Seeker Platform**: Browse jobs, apply with CV, track applications
- **HR Management**: Company management, bulk operations, reporting
- **Admin Panel**: User management, system analytics, content moderation

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, MySQL, JWT Authentication
- **DevOps**: Docker, Jenkins CI/CD, Docker Compose
- **Database**: MySQL 8.0 with TypeORM

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0 (for local development)
- Git

## 🚀 Quick Start (Development)

### Backend Setup
```bash
cd backend
npm install
# Copy and configure environment
cp .env.example .env
# Start MySQL and run migrations
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
# Configure API URL in .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm run dev
```

### Database Setup
```bash
# Make sure MySQL is running on port 3306
# Database will be auto-created on first run
```

## 🐳 Production Deployment with Docker

### 1. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

### 2. Docker Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

## 🔄 CI/CD with Jenkins

### Jenkins Pipeline Stages
1. **Checkout**: Pull latest code from GitHub
2. **Build**: Create Docker images for frontend/backend
3. **Test**: SSH connection validation
4. **Deploy**: Automated deployment to production server

### Jenkins Configuration
- Requires Docker Hub credentials (`dockerhub-cred`)
- Server SSH key (`server-ssh-key`)
- Database connection string (`db-conn`)
- Docker Compose file (`docker-compose-file`)

### Production URLs (after Jenkins deployment)
- **Frontend**: http://your-server:3000
- **Backend**: http://your-server:3001
- **API Docs**: http://your-server:3001/api

## 📁 Project Structure

```
cv-web/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── main.ts         # Application entry
│   └── Dockerfile
├── frontend/                # Next.js client
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # Reusable components
│   │   └── services/       # API services
│   └── Dockerfile
├── docker-compose.prod.yml  # Production Docker setup
├── Jenkinsfile             # CI/CD pipeline
├── .env.example           # Environment template
└── test/                  # Integration tests
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cvking_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1h

# Application
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🧪 Testing

### Integration Tests
```bash
# Test frontend-backend connection
node test/test-frontend-connection.js

# Test job posting flow
node test/test-frontend-job-flow.js
```

### API Testing
```bash
# Backend API tests
cd backend && npm test

# Frontend component tests
cd frontend && npm test
```

## 📊 API Endpoints

### Jobs
- `GET /jobs` - List all published jobs
- `POST /jobs` - Create new job (employer only)
- `GET /jobs/:id` - Get job details

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Companies
- `GET /companies` - List companies
- `POST /companies` - Create company (employer only)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@cvking.com or join our Discord community.
