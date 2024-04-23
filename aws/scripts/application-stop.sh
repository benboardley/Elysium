#!/bin/bash
set -xe

export PATH="/home/ubuntu/.local/bin:/home/ubuntu/.nvm/versions/node/v18.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
pm2 stop all
pm2 delete all
sudo systemctl stop gunicorn.service