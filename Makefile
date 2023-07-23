deploy_contract:
	@echo "Deploying contract..."
	cd contract && npx hardhat run scripts/deploy.js --network $(network)

restart:
	@echo "Restarting docker compose..."
	docker compose restart

up:
	@echo "Run docker compose..."
	docker compose up -d

up_build:
	@echo "Build image if changes are made and run docker compose..."
	docker compose up -d --build

down:
	@echo "Stop docker compose..."
	docker compose down

down_clean:
	@echo "Stop docker compose and remove volumes..."
	docker compose down -v