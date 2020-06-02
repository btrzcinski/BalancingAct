#!/bin/bash

CONTAINER_REGISTRY="server:40835"
PODMAN_SERVER="server"

echo
echo "*** ng build --prod ***"
echo

node_modules/.bin/ng build --prod

# Alternatively, you could build from the Dockerfile, like so...
#buildah build-using-dockerfile -t balancing-act -f Dockerfile dist
# But instead we'll use buildah directly.

echo
echo "*** buildah ***"
echo

container=$(buildah from nginx)
buildah run $container -- sh -c 'rm -r /usr/share/nginx/html/*'
buildah copy $container dist/BalancingAct /usr/share/nginx/html
buildah run $container -- sh -c 'rm /etc/nginx/conf.d/default.conf'
buildah copy $container balancing-act.nginx.conf /etc/nginx/conf.d/balancing-act.conf
buildah unmount $container
buildah commit $container balancing-act
buildah rm $container

# Tag the new container and push it to the registry for deployment.
buildah tag balancing-act $CONTAINER_REGISTRY/balancing-act
buildah push $CONTAINER_REGISTRY/balancing-act

echo
echo "*** restart over ssh ***"
echo

# This assumes that:
# * You have passwordless (e.g., key-based) SSH to $PODMAN_SERVER
# * You have set up balancing-act as a systemd unit in your user on $PODMAN_SERVER
#   (or whatever user is running this script with SSH access to $PODMAN_SERVER)
ssh $PODMAN_SERVER "podman pull $CONTAINER_REGISTRY/balancing-act"
ssh $PODMAN_SERVER "systemctl --user restart container-balancing-act.service"
ssh $PODMAN_SERVER "systemctl --user status container-balancing-act.service" | head -n3

