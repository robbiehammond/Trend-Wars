# Trend Wars

## What is it? 

Trend Wars is a web-based game where players are given a starting word and they must come up with a compliment word that creates that most popular search string. The more popular the string, the more points added to a player's score.

## How can I play?

Go to http://trendwars.net/, create a lobby, and invite your friends!

## How can I develop it locally (Backend or Frontend)?

First, make sure you install npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and pip (https://pip.pypa.io/en/stable/installation/).

Next go into `frontend/game` folder and run:
```
npm install
```

After that, go into the `backend` folder and run:
```
pip3 install -r requirements.txt
```

While in the backend folder, launch main.py with python:
```
python3 main.py
```

In a new terminal, navigate back to the `frontend/game` directory and run one of the following commands, depending on which system you're on:

If you're on a Unix-based system (macOS, Linux, BSD, etc) run this:
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
