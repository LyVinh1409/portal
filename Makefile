.PHONY: build up down logs backend-build frontend-build fmt

up:
	docker-compose up -d --build

down:
	docker-compose down

logs:
	docker-compose logs -f

build: backend-build frontend-build

backend-build:
	cd backend && docker build -t app-backend .

frontend-build:
	cd frontend && docker build -t app-frontend .

fmt:
	go fmt ./backend/...
