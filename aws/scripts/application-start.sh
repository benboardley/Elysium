#!/bin/bash
#set -xe

#cd /home/ubuntu/apps
# Start serve with the obtained public IP and desired port
#pm2 start dist/server/start_server.js
#service nginx restart
#echo "complete"
#cd /home/ubuntu/apps/Elysium_Backend
#nohup python3 manage.py runserver >> backend.log 2>&1 &
sudo systemctl start gunicorn.service
sudo systemctl enable gunicorn.service
export PATH="/home/ubuntu/.local/bin:/home/ubuntu/.nvm/versions/node/v18.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
cd /home/ubuntu/apps/Elysium_Frontend
pm2 start npm --name "frontend" -- run web