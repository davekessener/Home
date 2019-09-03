enable :sessions
set :port, 4567
set :bind, '0.0.0.0'

set :database_file, "#{$root_dir}/config/database.yml"

$storage = Storage::Manager.new

$storage.register(:music, Storage::Local.new(Storage.path($root_dir, '/music')))
$storage.register(:nas, Storage::Manager.new.tap do |m|
	base = Storage::Local.new(Storage.path($root_dir, '/nas'))

	User.all.to_a.each do |u|
		m.register(u.name, Storage::Adapter.new(base, u.name))
	end
end)

Dir.glob("#{$root_dir}/config/**/*.rb").each do |f|
	require f
end

Dir.glob("#{$root_dir}/app/helpers/**/*.rb").each do |f|
	require f
end

require "#{$root_dir}/app/routes"

