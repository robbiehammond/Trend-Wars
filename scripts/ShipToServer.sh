#!bin/bash
cd ../frontend/game
npm run build
scp -r -i ../../../hivemind.pem build ubuntu@ec2-3-143-255-96.us-east-2.compute.amazonaws.com:/home/ubuntu
cd ..
cd ..
pwd
scp -r -i ../hivemind.pem backend ubuntu@ec2-3-143-255-96.us-east-2.compute.amazonaws.com:/home/ubuntu
scp -r -i ../hivemind.pem scripts/init.sh ubuntu@ec2-3-143-255-96.us-east-2.compute.amazonaws.com:/home/ubuntu