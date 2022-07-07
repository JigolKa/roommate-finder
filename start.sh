#!/bin/bash

cd files/ && go run main.go &
cd server/ && pip install -r requirements.txt && python router.py &
cd cities/ && npm i && npm run start &

wait