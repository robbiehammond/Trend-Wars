# Connecting to the server

I will assume that you are either on a Unix machine (Mac/Linux/BSD), or have some way to run bash scripts and ssh.

## Step 1
Download the hivemind.pem key I put in the Discord chat (generally speaking sharing keys like this is a terrible idea, so if this was a more grand project I'd generate keys for everyone but it's good enough for this). Move this file into 1 directory outside of your TrendWars directory. So if, for example, the README of TrendWars is located at /Files/SeniorProj/Trend-Wars, put the .pem file at /Files/SeniorProj/. 

## Step 2
Get whatever code you want on the server into your TrendWars directory.

## Step 3
cd into the scripts directory, and run
```
bash ShipToServer.sh
```
This script takes the code currently in the directory and puts in on the server.

## Step 4
Even though the code is on the server, it's not doing anything. We must connect to the server, shut down the old backend, replace files, and start everything back up. Run
```
bash ConnectToServer.sh
```
in order to connect to the server.

## Step 5
Luckily, I automated all of those ugly steps I talked about above. While connected to the server, run 
```
sudo su
```
to switch to admin usage and then run
```
bash init.sh
```
To do all of the necessary file moving, removing, configuring, etc. After that, go ahead and close the terminal, and then you're done. Refresh the TrendWars page and your desired changes should be there.
