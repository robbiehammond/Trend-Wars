#!/bin/bash
mv build/ html
rm -r /var/www/backend
rm -r /var/www/html
mv html /var/www/
mv backend /var/www/
kill $(pgrep -f 'python3 -u main.py')
cd /var/www/backend
sudo nohup python3 -u main.py > serverlog.out 2>&1 & disown