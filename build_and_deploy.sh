#!/bin/bash

node_modules/.bin/ng build --prod --base-href /BalancingAct/
ssh server "rm -R /var/www/BalancingAct/*"
scp -r dist/BalancingAct server:/var/www

