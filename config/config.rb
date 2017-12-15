enable :sessions
set :port, 4567
set :bind, '0.0.0.0'

set :database_file, "#{settings.root}/config/database.yml"

require "#{settings.root}/config/lang.rb"

Dir.glob("#{settings.root}/app/helpers/**/*.rb").each do |f|
	require f
end

require "#{settings.root}/app/routes"

