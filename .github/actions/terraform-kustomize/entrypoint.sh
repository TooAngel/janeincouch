#!/bin/sh
set -e

if [ ! -z "$INPUT_CREDS_TERRAFORM" ]; then
  mkdir -p ~/.terraform.d
  echo "$INPUT_CREDS_TERRAFORM" | base64 --decode > ~/.terraform.d/credentials.tfrc.json
fi

if [ ! -z "$INPUT_CREDS_GCLOUD" ]; then
  echo "$INPUT_CREDS_GCLOUD" | base64 --decode > tmp-sa.json
  gcloud auth activate-service-account --key-file=tmp-sa.json
  rm tmp-sa.json
fi

if [ ! -z "$INPUT_CREDS_KUBERNETES" ]; then
  mkdir -p ~/.kube
  echo "$INPUT_CREDS_KUBERNETES" | base64 --decode > ~/.kube/config
fi

if [ ! -z "$INPUT_WORKDIR" ]; then
  cd $INPUT_WORKDIR
fi

echo $HOME
ls -al $HOME/

exec "$@"
