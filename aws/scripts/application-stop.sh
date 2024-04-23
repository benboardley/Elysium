#!/bin/bash
set -x

export PATH="/home/ubuntu/.local/bin:/home/ubuntu/.nvm/versions/node/v18.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
pm2 stop frontend
pm2 delete frontend
sudo systemctl stop gunicorn.service