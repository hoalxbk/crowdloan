all:
	make reinstall
	make rebuild
	cp -f .env .env.example dist/

rebuild:
	rm -rf dist/bin dist/libs && tsc
	make deps
	make ethlink

build:
	tsc
	make deps
	make ethlink

lint:
	npx tslint -c tslint.json './bin/**/*.ts' --fix

test-network-worker:
	npx ts-node ./bin/ethlink/OatEventLogCrawler.ts --contractName=OATNetwork

test-token-worker:
	npx ts-node ./bin/ethlink/OatEventLogCrawler.ts --contractName=OATToken

test-webhook-worker:
	npx ts-node ./bin/ethlink/WebhookWorker.ts

dep:
	cp -f $(t)/package.json dist/$(t)/
	cd dist/$(t) && rm -f package-lock.json && npm i

deps:
	make dep t=libs/sota-common
	make dep t=libs/wallet-core
	make dep t=bin/ethlink

ts-dep-reinstall:
	cd $(t) && rm -rf node_modules package-lock.json && npm i

ts-dep-install:
	cd $(t) && rm -rf package-lock.json && npm i

ts-deps:
	make ts-dep-install t=./
	make ts-dep-install t=libs/sota-common
	make ts-dep-install t=libs/wallet-core
	make ts-dep-install t=bin/ethlink

ts-deps-reinstall:
	make ts-dep-reinstall t=./
	make ts-dep-reinstall t=libs/sota-common
	make ts-dep-reinstall t=libs/wallet-core
	make ts-dep-reinstall t=bin/ethlink

install:
	make ts-deps

reinstall:
	make ts-deps-reinstall

ethlink:
	cp -R bin/ethlink/configs dist/bin/ethlink/

deploy-v2:
	rsync -avhzL --delete \
				--no-perms --no-owner --no-group \
				--exclude .git \
				--exclude .env \
				--exclude dist \
				--exclude node_modules \
				--exclude workers \
				--filter=":- .gitignore" \
				. sotatek@192.168.1.206:/var/www/sotatek_starter/crawler
	# ssh sotatek@172.16.1.212 "rm -rf node_modules/ package-lock.json"
	# ssh sotatek@172.16.1.212 "npm i && make all"
	# ssh sotatek@172.16.1.212 "pm2 restart app.json"

#deploy-production:
#	rsync -avhzL --delete \
#				--no-perms --no-owner --no-group \
#				--exclude .git \
#				--exclude .env \
#				--exclude dist \
#				--exclude node_modules \
#				--filter=":- .gitignore" \
#				. ubuntu@ec2-3-1-7-62.ap-southeast-1.compute.amazonaws.com:/home/ubuntu/loyalty-platform/backend/workers
