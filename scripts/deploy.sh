#!/bin/bash

# Tatami Labs Deployment Script
# Usage: ./scripts/deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-staging}
PROJECT_NAME="tatami-labs"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Function to backup database
backup_database() {
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "📦 Creating database backup..."
        pg_dump $DATABASE_URL > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
        echo "✅ Database backup created: $BACKUP_DIR/backup_$TIMESTAMP.sql"
    fi
}

# Function to run health checks
health_check() {
    echo "🏥 Running health checks..."
    
    # Wait for app to start
    sleep 10
    
    # Check main health endpoint
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Main health check passed"
    else
        echo "❌ Main health check failed"
        exit 1
    fi
    
    # Check database health
    if curl -f http://localhost:3000/api/health/db > /dev/null 2>&1; then
        echo "✅ Database health check passed"
    else
        echo "❌ Database health check failed"
        exit 1
    fi
}

# Function to deploy with Docker
deploy_docker() {
    echo "🐳 Deploying with Docker..."
    
    # Build and start services
    docker-compose -f docker-compose.yml down
    docker-compose -f docker-compose.yml build --no-cache
    docker-compose -f docker-compose.yml up -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to start..."
    sleep 30
    
    # Run database migrations
    docker-compose exec app npx prisma migrate deploy
    
    # Seed database if needed
    if [ "$ENVIRONMENT" != "production" ]; then
        docker-compose exec app npm run db:seed
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "▲ Deploying to Vercel..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod
    else
        vercel
    fi
}

# Main deployment logic
case "$ENVIRONMENT" in
    "production")
        echo "🔴 Production deployment"
        backup_database
        
        # Check if using Vercel or Docker
        if command -v vercel &> /dev/null; then
            deploy_vercel
        else
            deploy_docker
            health_check
        fi
        ;;
    
    "staging")
        echo "🟡 Staging deployment"
        deploy_docker
        health_check
        ;;
    
    *)
        echo "❌ Invalid environment. Use 'production' or 'staging'"
        exit 1
        ;;
esac

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is running at: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/api/health"
echo "🗄️  Database check: http://localhost:3000/api/health/db"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "📧 Don't forget to:"
    echo "   - Configure monitoring alerts"
    echo "   - Update DNS records if needed"
    echo "   - Verify SSL certificates"
    echo "   - Test all functionality"
fi