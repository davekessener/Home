require 'bundler/setup'

require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'slim'

enable :sessions
set :port, 4567
set :bind, '0.0.0.0'
set :database_file, 'config/database.yml'

require_relative 'app/routes'
