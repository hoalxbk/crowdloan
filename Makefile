# All:

# For Client:
deploy-all:
	make deploy-backend && make deploy-frontend && make deploy-crawler

cd-sotatek-starter:
	cd /Applications/MAMP/htdocs/PROJECTS/SOTATEK_STARTER/sotatek_starter

deploy-backend:
	make cd-sotatek-starter && cd ./backend && make deploy-v2

deploy-frontend:
	make cd-sotatek-starter && cd ./frontend && make deploy-v2

deploy-crawler:
	make cd-sotatek-starter && cd ./crawler && make deploy-v2

# For Server:
cd-server-sotatek-starter:
	cd /var/www/sotatek-starter

build-all:
	make build-frontend && make build-backend && make build-crawler

build-frontend:
	make cd-server-sotatek-starter && cd ./sotatek-starter-fe && cp .env.sotatek.example .env && yarn && yarn build && pm2 restart SotatekStarterFrontEnd

build-backend:
	make cd-server-sotatek-starter && cd ./backend && npm i && adonis migration:run && pm2 restart app.json

build-crawler:
	make cd-server-sotatek-starter && cd ./crawler && npm i && make build && pm2 restart app.json

# For Server: Create pm2 Processes
create-pm2-kue-listen:
	make cd-server-sotatek-starter && cd ./backend && pm2 start "adonis kue:listen" --name=SotatekStarterQueueListen

create-pm2-backend:
	make cd-server-sotatek-starter && cd ./backend && pm2 start "node server.js" --name=SotatekStarterBackend

create-pm2-frontend:
	make cd-server-sotatek-starter && cd ./sotatek-starter-fe && pm2 start "serve -s build -l 8123" --name=SotatekStarterFrontEnd

create-pm2-crawler:
	make cd-server-lemon && cd ./crawler && pm2 start app.json

remove-pm2-backend:
	pm2 delete SotatekStarterBackend

remove-pm2-frontend:
	pm2 delete SotatekStarterFrontEnd
