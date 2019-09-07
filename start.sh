#!/usr/bin/env bash
cd /home/dave/myhome
tmux new-session -d -s home_server "export sinatra_port=8000; (ruby main.rb 2>&1 | tee log.txt); bash -i"

