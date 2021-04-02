1. Update configs that will be copied to ./dist by command `make ethlink`
- .env (can copy from .env.example)
- ./bin/ethlink/configs/{NODE_ENV}.js (FIRST_CRAWL_BLOCK should be `block number of creating token transaction` - 1)
- ./bin/ethlink/configs/webhook.json (can copy from webhook.json.example, login admin -> /api/admin/generate_apikey)

2. Build
`make all`
or
`make rebuild` if just change code

3. Run workers
`pm2 start app.json`
