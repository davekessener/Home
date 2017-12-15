enable :sessions
set :port, 4567
set :bind, '0.0.0.0'

set :database_file, "#{$root_dir}/config/database.yml"

require "#{$root_dir}/config/lang.rb"

Dir.glob("#{$root_dir}/app/helpers/**/*.rb").each do |f|
	require f
end

require "#{$root_dir}/app/routes"

