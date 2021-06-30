#!/bin/bash

yarn build

aws s3 cp ./build s3://poll.starcoin.org/ --recursive

