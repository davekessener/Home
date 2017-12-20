require 'bundler/setup'

require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'slim'
require 'json'

require_relative 'environment'

set :root, $root_dir

Dir.glob("#{$root_dir}/models/**/*.rb").each do |f|
	require f
end

require_relative "config"

