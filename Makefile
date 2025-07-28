# Groupomania Microservices Makefile
# Commandes pour le développement et le déploiement

.PHONY: help install build clean test lint start stop restart logs health deploy

# Variables
COMPOSE_FILE := docker-compose.yml
ENV_FILE := .env

# Couleurs pour l'affichage
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Affiche l'aide
	@echo "$(GREEN)Groupomania Microservices - Commandes disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Installe toutes les dépendances
	@echo "$(GREEN)Installation des dépendances...$(NC)"
	npm run install:all

build: clean ## Compile tous les services
	@echo "$(GREEN)Compilation des services...$(NC)"
	npm run build

clean: ## Nettoie les fichiers de build
	@echo "$(YELLOW)Nettoyage des fichiers de build...$(NC)"
	npm run clean

test: ## Lance tous les tests
	@echo "$(GREEN)Exécution des tests...$(NC)"
	npm run test:all

lint: ## Vérifie le code avec ESLint
	@echo "$(GREEN)Vérification du code...$(NC)"
	npm run lint

lint-fix: ## Corrige automatiquement les erreurs ESLint
	@echo "$(GREEN)Correction automatique du code...$(NC)"
	npm run lint:fix

start: ## Démarre les services en mode développement
	@echo "$(GREEN)Démarrage des services...$(NC)"
	npm run dev:all

docker-build: ## Construit les images Docker
	@echo "$(GREEN)Construction des images Docker...$(NC)"
	docker-compose build

docker-up: ## Démarre les services avec Docker
	@echo "$(GREEN)Démarrage des services Docker...$(NC)"
	docker-compose up -d

docker-down: ## Arrête les services Docker
	@echo "$(YELLOW)Arrêt des services Docker...$(NC)"
	docker-compose down

docker-restart: docker-down docker-up ## Redémarre les services Docker

docker-logs: ## Affiche les logs des services Docker
	@echo "$(GREEN)Logs des services:$(NC)"
	docker-compose logs -f

docker-ps: ## Affiche l'état des conteneurs
	@echo "$(GREEN)État des conteneurs:$(NC)"
	docker-compose ps

health: ## Vérifie l'état des services
	@echo "$(GREEN)Vérification de l'état des services...$(NC)"
	npm run health-check

setup-db: ## Initialise les bases de données
	@echo "$(GREEN)Initialisation des bases de données...$(NC)"
	npm run setup:db

migrate: ## Lance les migrations de base de données
	@echo "$(GREEN)Exécution des migrations...$(NC)"
	npm run db:migrate:all

seed: ## Insère les données de test
	@echo "$(GREEN)Insertion des données de test...$(NC)"
	npm run db:seed:all

reset-db: ## Remet à zéro les bases de données
	@echo "$(YELLOW)Remise à zéro des bases de données...$(NC)"
	npm run db:reset

deploy-dev: build docker-build docker-up ## Déploie en mode développement
	@echo "$(GREEN)Déploiement en cours...$(NC)"
	make health

deploy-prod: ## Déploie en mode production
	@echo "$(GREEN)Déploiement en production...$(NC)"
	NODE_ENV=production $(MAKE) deploy-dev

stop: ## Arrête tous les services
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	docker-compose down || true
	pkill -f "node.*groupomania" || true

clean-all: clean docker-down ## Nettoie tout (build + Docker)
	@echo "$(YELLOW)Nettoyage complet...$(NC)"
	docker system prune -f

# Commandes de développement rapide
dev: install build start ## Installation, build et démarrage rapide

# Vérifications de sécurité
security-check: ## Vérifie les vulnérabilités
	@echo "$(GREEN)Vérification des vulnérabilités...$(NC)"
	npm audit
	cd user-service && npm audit
	cd post-service && npm audit
	cd api-gateway && npm audit

# Affichage des informations système
info: ## Affiche les informations du système
	@echo "$(GREEN)Informations système:$(NC)"
	@echo "Node.js: $$(node --version)"
	@echo "NPM: $$(npm --version)"
	@echo "Docker: $$(docker --version 2>/dev/null || echo 'Non installé')"
	@echo "Docker Compose: $$(docker-compose --version 2>/dev/null || echo 'Non installé')"

# Commande par défaut
.DEFAULT_GOAL := help
