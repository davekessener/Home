module Storage
	def self.path(*f)
		p = f.map(&:to_s).join('/').gsub(/\/\/+/, '/')
		p = p[0...-1] if p[-1] == '/'
		p
	end

	def self.valid?(fn)
		fn = fn.to_s
		not (fn == '..' or fn.start_with? '../' or fn.end_with? '/..')
	end

	class Manager
		def initialize
			@disks = {}
		end

		def register(id, disk)
			raise id if @disks[id]
			
			@disks[id] = disk
		end

		def request(id)
			raise id unless (disk = @disks[id])

			disk
		end
	end

	class Local
		def initialize(p)
			raise p if not File.exist? p and File.directory? p

			@path = p

			FileUtils.mkdir_p @path
		end

		def exist?(fn)
			raise fn unless Storage.valid? fn

			File.exist? path(fn)
		end

		def directory?(p)
			raise p unless Storage.valid? p

			File.directory? path(p)
		end

		def delete(fn)
			raise fn unless Storage.valid? fn

			FileUtils.rm_r(path(fn))
		end

		def move(fn1, fn2)
			raise "#{fn1} -> #{fn2}" unless Storage.valid? fn1 and Storage.valid? fn2

			FileUtils.mv(path(fn1), path(fn2))
		end

		def mkdir(p)
			raise p unless Storage.valid? p

			FileUtils.mkdir_p(path(p))
		end

		def upload(fn, f)
			raise fn unless Storage.valid? fn
			raise f unless File.exist? f

			FileUtils.cp(f, path(fn))
		end

		def download(fn, f)
			raise fn unless Storage.valid? fn

			FileUtils.cp(path(fn), f)
		end

		def mtime(fn)
			raise fn unless Storage.valid? fn

			File.mtime path(fn)
		end

		def filesize(fn)
			raise fn unless Storage.valid? fn

			File.size path(fn)
		end

		def glob(p)
			raise p unless Storage.valid? p

			n = @path.length
			n += 1 unless p.start_with? '/'

			Dir.glob(path(p)).map { |e| e[n..-1] }
		end

		private

		def path(*f)
			Storage.path(@path, *f)
		end
	end

	class Adapter
		def initialize(m, p)
			@super, @path = m, p

			@super.mkdir @path unless @super.exist? @path
		end

		def exist?(fn)
			@super.exist? path(fn)
		end

		def directory?(fn)
			@super.directory? path(fn)
		end

		def delete(fn)
			@super.delete path(fn)
		end

		def move(fn1, fn2)
			@super.move path(fn1), path(fn2)
		end

		def mkdir(p)
			@super.mkdir path(p)
		end

		def upload(fn, f)
			@super.upload path(fn), f
		end

		def download(fn, f)
			@super.download path(fn), f
		end

		def mtime(fn)
			@super.mtime path(fn)
		end

		def filesize(fn)
			@super.filesize path(fn)
		end

		def glob(p)
			n = @path.length
			n += 1 unless p.start_with? '/'

			@super.glob(path(p)).map { |e| e[n..-1] }
		end

		private

		def path(*f)
			Storage.path(@path, *f)
		end
	end
end

