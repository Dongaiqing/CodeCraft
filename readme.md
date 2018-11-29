## Install
1. create `venv`
2. `pip install -r requirements.txt`

## Run Project
1. if need to (re)create database and starting project in debug mode, run `./manage.sh DatabaseUsername DatabasePassword`
2. if simply need to start server, run `flask run`

## Recompile FrontEnd From Source
1. `cd FrontEnd` and `node install`
2. configure Babel -> I'd really like to skip this part. Note that watching should better be enabled.
3. configure Webpack -> Already done. Note that watching should better be enabled.
4. `npm run-script build`

## BUILD WITH :fire: BY PROJECT HYHA