#!/bin/bash
echo "🔄 Rebuilding and restarting Docker services..."
docker-compose down
docker-compose build --no-cache server
docker-compose up -d
echo "✅ Docker services restarted!"
echo ""
echo "🔗 Access URLs:"
echo "   API Base URL: http://localhost:3001/api"
echo "   Docs URL: http://localhost:3001/docs"
echo "   Health Check: http://localhost:3001/api/v1/health"
