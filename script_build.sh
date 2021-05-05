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

build_docker_image () {
    echo "Building MYSLQ Initzation docker image ..."
    docker build -f ./backend/init-mysql.dockerfile -t $ecr_repo/prod-redkite-init-db:latest ./backend --build-arg ENV=prod

    echo "Building KUE docker image ..."
    docker build -f ./backend/local-kue.dockerfile -t $ecr_repo/prod-redkite-kue:latest ./backend --build-arg ENV=prod

    echo "Building BACKEND SERVER  docker image ..."
    docker build -f ./backend/local-server.dockerfile -t $ecr_repo/prod-redkite-backend:latest ./backend --build-arg ENV=prod

    echo "Building CRAWLER docker image ..."
    docker build -f ./crawler/crawler.Dockerfile -t $ecr_repo/prod-redkite-crawler:latest ./crawler --build-arg ENV=prod

    }

push_image () {
    echo "Pushing MYSLQ Initzation docker image ..."
    docker push $ecr_repo/prod-redkite-init-db:latest

    echo "Pushing KUE docker image ..."
    docker push $ecr_repo/prod-redkite-kue:latest

    echo "Pushing BACKEND SERVER  docker image ..."
    docker push $ecr_repo/prod-redkite-backend:latest

    echo "Pushing CRAWLER docker image ..."
    docker push $ecr_repo/prod-redkite-crawler:latest
}

# check_env
log_in_ecr
build_docker_image
push_image