#!/bin/bash
#set -xe

#cd /home/ubuntu/apps
# Start serve with the obtained public IP and desired port
#pm2 start dist/server/start_server.js
#service nginx restart
#echo "complete"
cd /home/ubuntu/apps/Elysium_Backend
nohup python manage.py runserver >> logger.log 2>&1 &
cd /home/ubuntu/apps/elysium_frontend
nohup npm run web >> logger.log 2>&1 &