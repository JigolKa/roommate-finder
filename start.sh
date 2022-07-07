#!/bin/bash

cd files/ && go run main.go &
cd server/ && python router.py &
cd cities/ && npm run start &

wait