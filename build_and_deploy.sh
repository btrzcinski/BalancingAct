#!/bin/bash

node_modules/.bin/ng build --prod
docker build -t balancing-act -f Dockerfile dist
docker tag balancing-act server.lan:5000/balancing-act
docker push server.lan:5000/balancing-act

