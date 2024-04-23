#!/bin/bash
set -x


pm2 stop frontend
pm2 delete frontend
sudo systemctl stop gunicorn.service