#!/bin/bash
mv build/ html
rm -r /var/www/backend
rm -r /var/www/html
mv html /var/www/
mv backend /var/www/