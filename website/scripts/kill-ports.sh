#!/bin/bash

kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:9099)
kill -9 $(lsof -t -i:6379)
kill -9 $(lsof -t -i:8080)
kill -9 $(lsof -t -i:9199)

set -e
