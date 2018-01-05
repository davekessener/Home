require_relative 'main'
require 'sinatra/activerecord/rake'

require_relative 'utils/import_audiobooks'

task :import_audiobooks, [:filename] do |t, args|
	if File.directory? args.filename
		Dir.glob("#{args.filename}/*.zip").each do |fn|
			AudiobookImport::import(fn)
		end
	elsif File.extname(args.filename) == '.zip'
		AudiobookImport::import(args.filename)
	else
		raise "Invalid file #{args.filename}!"
	end
end

