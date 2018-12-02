require_relative 'main'
require 'sinatra/activerecord/rake'
require 'optparse'

require_relative 'utils/import_audiobooks'
require_relative 'utils/import_recipes'

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

task :import_recipes do
	help = "usage: rake import_recipes -- -d recipe-directory"
	options = {}
	OptionParser.new do |p|
		p.banner = help
		p.on('-d', '--dir ARG', String) { |v| options[:dir] = v }
	end.parse! ARGV.reject { |e| e == '--' }
	
	dir = options[:dir]
	if dir.nil?
		puts help
		raise "Missing argument!"
	elsif not File.directory? dir
		raise "Not a directory: #{dir}"
	else
		RecipeImport::import(dir)
	end
end

