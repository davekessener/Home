require_relative 'main'
require 'sinatra/activerecord/rake'

require_relative 'utils/import_audiobooks'

task :import_audiobooks do
	Dir.glob("#{$audiobook_dir}/*.zip").each do |f|
		AudiobookImport::import(f)
	end
end

