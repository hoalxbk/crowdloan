# All:

# For Client:
deploy-all:
	make deploy-backend && make deploy-frontend-user && make deploy-frontend-admin && make deploy-crawler

cd-sotatek-starter:
	cd /home/dynamo/Projects/launchpad-starter

deploy-backend:
	make cd-sotatek-starter && cd ./backend && make deploy-v2

deploy-frontend-user:
	make cd-sotatek-starter && cd ./frontend-user && make deploy-v2

deploy-frontend-admin:
	make cd-sotatek-starter && cd ./frontend-admin && make deploy-v2

deploy-crawler:
	make cd-sotatek-starter && cd ./crawler && make deploy-v2





# For Server:
cd-server-sotatek-starter:
	cd /var/www/sotatek_starter

build-all:
	make build-frontend-user && make build-frontend-admin && make build-backend && make build-crawler

build-frontend-user:
	make cd-server-sotatek-starter && cd ./frontend-user && cp .env.sotatek.example .env && yarn && yarn build && pm2 restart SotatekStarterFrontEndUser

build-frontend-admin:
	make cd-server-sotatek-starter && cd ./frontend-admin && cp .env.sotatek.example .env && yarn && yarn build && pm2 restart SotatekStarterFrontEndAdmin

build-backend:
	make cd-server-sotatek-starter && cd ./backend && cp .env.sotatek.example .env && npm i && adonis migration:run && pm2 restart app.json

build-crawler:
	make cd-server-sotatek-starter && cd ./crawler && cp .env.sotatek.example .env && npm i && make build && pm2 restart app.json






# For Server: Create pm2 Processes
create-pm2-kue-listen:
	make cd-server-sotatek-starter && cd ./backend && pm2 start "adonis kue:listen" --name=SotatekStarterQueueListen

create-pm2-backend:
	make cd-server-sotatek-starter && cd ./backend && pm2 start "node server.js" --name=SotatekStarterBackend

create-pm2-frontend-user:
	make cd-server-sotatek-starter && cd ./frontend-user && pm2 start "serve -s build -l 8333" --name=SotatekStarterFrontEndUser

create-pm2-frontend-admin:
	make cd-server-sotatek-starter && cd ./frontend-admin && pm2 start "serve -s build -l 8666" --name=SotatekStarterFrontEndAdmin

create-pm2-crawler:
	make cd-server-sotatek-starter && cd ./crawler && pm2 start app.json

remove-pm2-backend:
	pm2 delete SotatekStarterBackend

remove-pm2-frontend-user:
	pm2 delete SotatekStarterFrontEndUser

remove-pm2-frontend-admin:
	pm2 delete SotatekStarterFrontEndAdmin






