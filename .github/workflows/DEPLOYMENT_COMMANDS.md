client--------------------------------

git add .
git commit -m "hi" || echo "Nothing to commit"
git reset --hard HEAD
git pull origin main

sudo cp -r /home/ubuntu/client/dist/\* /var/www/html/

server------------------------------

git add .
git commit -m "hi" || echo "Nothing to commit"
git reset --hard HEAD
git pull origin main

cd /home/ubuntu/server
npx knex migrate:latest --env production

pm2 stop all
pm2 restart all
