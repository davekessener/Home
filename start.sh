#!/usr/bin/env bash
cd /home/pi/projects/home
tmux new-session -d -s home_server "ruby main.rb | tee log.txt; bash -i"

