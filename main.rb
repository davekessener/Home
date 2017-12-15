require 'bundler/setup'

require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'slim'

$root_dir = File.realpath(File.dirname(__FILE__))
set :root, $root_dir

require_relative "config/config"

