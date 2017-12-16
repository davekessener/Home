require 'bundler/setup'

require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'slim'
require 'json'

$root_dir = File.realpath(File.dirname(__FILE__))
set :root, $root_dir

Dir.glob("#{$root_dir}/models/**/*.rb").each do |f|
	require f
end

require_relative "config"

