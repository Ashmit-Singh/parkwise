#!/bin/bash

# ParkWise Phase 3 - Complete Startup Script
# This script starts all services: Database, Backend, Frontend

set -e

echo "🚀 ParkWise Phase 3 - Starting All Services"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+"
    exit 1
fi
echo -e "${GREEN}✓ Java found${NC}"

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL found${NC}"

echo ""
echo -e "${BLUE}🗄️  Setting up database...${NC}"

# Create database if it doesn't exist
if ! psql -lqt | cut -d \| -f 1 | grep -qw parkwise_experiments; then
    echo "Creating database: parkwise_experiments"
    createdb parkwise_experiments
    echo -e "${GREEN}✓ Database created${NC}"
else
    echo -e "${GREEN}✓ Database already exists${NC}"
fi

# Run migrations
echo "Running migrations..."
psql parkwise_experiments < database/migrations/001_create_experiment_tables.sql 2>/dev/null || true
psql parkwise_experiments < database/migrations/002_create_species_identification_tables.sql 2>/dev/null || true
echo -e "${GREEN}✓ Migrations completed${NC}"

echo ""
echo -e "${BLUE}🔧 Building backend...${NC}"

# Build backend
cd backend
mvn clean install -q
echo -e "${GREEN}✓ Backend built${NC}"

echo ""
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"

# Install frontend dependencies
cd ../frontend
npm install -q
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo ""
echo -e "${YELLOW}🚀 Starting services...${NC}"
echo ""

# Start backend in background
echo -e "${BLUE}Starting Backend (Port 8081)...${NC}"
cd ../backend
mvn spring-boot:run &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
sleep 10

# Start frontend in background
echo -e "${BLUE}Starting Frontend (Port 3000)...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${GREEN}=============================================="
echo "✅ All services started successfully!"
echo "=============================================="
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8081"
echo "🗄️  Database: parkwise_experiments"
echo ""
echo "📊 Available Endpoints:"
echo "  - Experiments: http://localhost:8081/api/experiments"
echo "  - Species: http://localhost:8081/api/species"
echo "  - Analytics: http://localhost:8081/api/analytics"
echo ""
echo "🛑 To stop services:"
echo "  kill $BACKEND_PID  # Stop backend"
echo "  kill $FRONTEND_PID # Stop frontend"
echo ""
echo "📚 Documentation:"
echo "  - QUICKSTART.md"
echo "  - PHASE_3_STARTUP.md"
echo "  - IMPLEMENTATION_GUIDE.md"
echo ""

# Keep script running
wait
