#!/usr/bin/env bash
if python initializeDB.py $1 $2; then
    export FLASK_DEBUG=1
    flask run
else
    echo 'Cannot execute!'
fi
