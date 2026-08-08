client--------------------------------

git add .
git commit -m "hi" || echo "Nothing to commit"
git reset --hard HEAD
git pull origin main

sudo cp -r /home/ubuntu/client/dist/* /var/www/html/

server------------------------------

cd /home/ubuntu/server
git pull origin main
npm ci
npm run build
npx knex migrate:latest --env production
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save
