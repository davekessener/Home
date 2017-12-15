require 'bundler/setup'

require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'slim'

set :root, File.realpath(File.dirname(__FILE__))

require_relative "config/config"

