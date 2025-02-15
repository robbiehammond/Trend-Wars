# Trend Wars

## What is it? 

Trend Wars is a web-based game where players are given a starting word and they must come up with a compliment word that creates that most popular search string. The more popular the string, the more points added to a player's score.

## How can I play?

Go to http://trendwars.net/, create a lobby, and invite your friends!

## How can I develop it locally (Backend or Frontend)?

First, make sure you install npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and pip (https://pip.pypa.io/en/stable/installation/).

Next go into `frontend` folder and run:
```
npm install
```

After that, go into the `backend` folder and run:
```
pip3 install -r requirements.txt
```
(you can also use a virtual environment for this if it suites your fancy)

While in the backend folder, launch main.py with python:
```
python3 main.py
```

In a new terminal, navigate back to the `frontend/` directory and run one of the following commands, depending on which system you're on:

If you're on a Unix-based system (macOS, Linux and others) run this:
```
npm run start-unix
```

If you're on Windows, run this:
```
npm run start-windows
```

## How can I develop the frontend locally?
If you do not plan on making changes to the backend code, you may connect the client-facing portion of the game to the already-existing AWS server. Follow the steps above to install npm and the frontend dependencies of Trend Wars as done above and then use this following command:
```
npm run start-client-only
```

## Deploying 
The TrendWars backend is deployed via a CDK script to AWS. The backend runs via a [fargate task](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) via a docker container that has all of the code/dependencies. This task has port 8000 (the port used for the actual game) exposed to public traffic, allowing the frontend to connect. The frontend is currently not deployed via the script; The build artifacts are manually uploaded to an S3 bucket which is linked the trendwars.net domain. 

At some point the deployment process will be simplified, but for now it is this:
- Create an [ECR](https://aws.amazon.com/ecr/) repo in AWS named `trend-wars-backend`
- Build the Dockerfile in the backend via `docker build -t trend-wars-backend .`
- Run `docker tag trend-wars-backend [AWS ACCOUNT ID].dkr.ecr.[REGION].amazonaws.com/trend-wars-backend`
- Run `docker push [AWS ACCOUNT ID].dkr.ecr.[REGION].amazonaws.com/trend-wars-backend`
- Go into the `fargate_deployment` directory and run `cdk deploy`, answer `y` to changes it says it'll make
- Figure out the public IP of the fargate task. Find the task in the AWS console, click the "Network bindings" tab, and it'll be the only one in the table.
- Copy it and paste it into the `server_location` field in `frontend/src/socketConfig.js`. 
- In the frontend directory, run `npm run build`.
- Manually upload the contents of the build folder (but not the build folder itself) into an S3 bucket that is configured to allow public viewing. 
- (Optional) Buy a domain name from Route 53 or something similar and map that name to the S3 URL.
- If you did everything right, you should be able to see the frontend from the S3 bucket URL (or the domain if you bought one) and it should be connected to the backend.