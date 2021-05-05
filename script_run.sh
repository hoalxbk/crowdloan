#!/bin/bash

set -e

# Variable
ecr_repo='963933760463.dkr.ecr.us-east-1.amazonaws.com'

check_env () {
    echo "Checking AWS variables are defined ..."
    if [[ -z "${AWS_ACCESS_KEY_ID}" ]] || [[ -z "${AWS_SECRET_ACCESS_KEY}" ]] || [[ -z "${AWS_DEFAULT_REGION}" ]]; then
        echo "AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_DEFAULT_REGION may be undefine, uses export command to set them before running script, exit 1"
        exit 1
    else
        echo "AWS_ environment are existing"
        echo "Preparing to run log_in_ecr step ..."
    fi
}


log_in_ecr () {\
    aws ecr get-login-password | docker login --username AWS --password-stdin $ecr_repo
}


pull_image () {
    echo "pulling MYSLQ Initzation docker image ..."
    docker pull $ecr_repo/prod-redkite-init-db:latest

    echo "pulling KUE docker image ..."
    docker pull $ecr_repo/prod-redkite-kue:latest

    echo "pulling BACKEND SERVER  docker image ..."
    docker pull $ecr_repo/prod-redkite-backend:latest

    echo "pulling CRAWLER docker image ..."
    docker pull $ecr_repo/prod-redkite-crawler:latest
}



# check_env
log_in_ecr
pull_image
docker-compose -f ./backend/docker-compose.yml up -d