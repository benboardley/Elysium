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

cd /home/ubuntu/apps/Elysium_Frontend
pm2 start npm --name "frontend" -- run web