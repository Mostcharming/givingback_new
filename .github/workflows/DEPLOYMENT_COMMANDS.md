client--------------------------------

git add .
git commit -m "hi" || echo "Nothing to commit"
git reset --hard HEAD
git pull origin main

sudo cp -r /home/ubuntu/client/dist/\* /var/www/html/

server------------------------------

cd /home/ubuntu/server

pm2 start npm --name givingback-server -- run dev

pm2 restart all
