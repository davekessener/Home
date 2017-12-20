require 'zip'
require 'fileutils'

module AudiobookImport
	module Helper
		def self.convert(t)
			l, s = 0, 1
			t.split(/:/).reverse_each do |p|
				l += s * p.to_i
				s *= 60
			end
			l
		end

		def self.to_s(d)
			s, d = d % 60, d / 60
			m, d = d % 60, d / 60
			[d, m, s].map { |e| '%02d' % e }.join(':')
		end
	end

	def self.import(fn, root = $audiobook_dir)
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
		FileUtils.cp(File.join(dir, 'icon.png'), "#{$root_dir}/public/resources/icons/#{name}.png")

		puts "Building database ..."

		data = JSON.parse(File.read(File.join(dir, 'data.json')))
		franchise = Franchise.new(name: data['name'], path: name)
		books = []
		data['books'].each_with_index do |b, i|
			book = Audiobook.new(title: b['name'], idx: i, duration: Helper::convert(b['length']))
			len = 0
			chapters = []
			b['chapters'].each do |ch|
				len = Helper::convert(ch['offset']) if ch['offset']
				chapters << Chapter.new(title: ch['title'], value: len)
				len += Helper::convert(ch['length']) if ch['length']
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


