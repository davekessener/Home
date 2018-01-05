require 'zip'
require 'fileutils'

require_relative 'helper'

module AudiobookImport
	def self.import(fn)
		root = File.dirname(File.expand_path(fn))
		name = File.basename(fn, '.*')
		dir = File.join(root, name)

		FileUtils.mkdir_p(dir)

		puts "Importing franchise #{name}"
		
		Zip::File.open(fn) do |zip|
			zip.each do |f|
				path = File.join(dir, f.name)
				puts "Extracting #{name}/#{f.name} ..."
				f.extract(path) unless File.exist? path
			end
		end

#		File.delete(fn)
		FileUtils.cp(File.join(dir, 'icon.png'), "#{$root_dir}/public/resources/icons/audiobooks/#{name}.png")

		data_fn = File.join(dir, 'data.json')
		puts "Building database from [#{data_fn}] ..."

		data = JSON.parse(Helper::read_utf8(data_fn))
		franchise = Franchise.new(name: data['name'], path: name)
		books = []
		data['books'].each_with_index do |b, i|
			book = Audiobook.new(title: b['name'], idx: i)
			len = 0
			chapters = []
			b['chapters'].each do |ch|
				len = Helper::convert(ch['offset']) if ch['offset']
				chapters << Chapter.new(title: "#{ch['title']}", value: len)
				len += Helper::convert(ch['length']) if ch['length']
			end
			if b['length']
				book.duration = Helper::convert(b['length'])
			else
				book.duration = len
			end
			books << {book: book, chapters: chapters}
		end

		puts "Checking db integrity ..."

		ActiveRecord::Base.transaction do
			puts "Saving franchise #{franchise.path}/#{franchise.name} ..."
			puts "> Contains #{books.length} books."

			franchise.save!

			books.each_with_index do |e, i|
				book, chapters = e[:book], e[:chapters]

				puts "> Saving Book ##{i}: #{book.title} [#{Helper::to_s(book.duration)}] ..."
				puts "> > Contains #{chapters.length} chapters."

				book.franchise = franchise
				book.save!
				franchise.audiobooks << book

				chapters.each_with_index do |chapter, j|
					puts "> > > Saving Chapter ##{j}: #{chapter.title} [@ #{Helper::to_s(chapter.value)}] ..."

					chapter.audiobook = book
					chapter.save!
					book.chapters << chapter
				end
			end
		end

		puts "OK"
	end
end


