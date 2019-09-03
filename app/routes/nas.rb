def nas_storage
	$storage.request(:nas).request(current_user.name)
end

get '/nas' do
	redirect '/nas/view'
end

get '/nas/download' do
	io = nas_storage

	if (fn = params[:file]).nil? or not io.exist? fn or io.directory? fn
		status 400
	else
		tmpfile = Dir::Tmpname.create(['download', '.tmp']) { }

		io.download(fn, tmpfile)
		send_file(tmpfile, filename: File.basename(fn), type: 'Application/octet-stream')
	end
end

get '/nas/view' do
	slim :'nas/view', locals: { storage: nas_storage }
end

get '/nas/view/*' do
	slim :'nas/view', locals: { storage: nas_storage }
end

get '/nas/new' do
	io = nas_storage
	p = params[:path]
	n = Storage.path(p, params[:name])

	if not io.exist? p or not io.directory? p or io.exist? n
		status 400
	else
		io.mkdir n

		redirect Storage.path('/nas/view', n)
	end
end

get '/nas/delete' do
	if params[:confirm] == 'yes'
		io = nas_storage
		p = params[:file]

		if not io.exist? p
			status 400
		else
			io.delete p

			redirect Storage.path('/nas/view', File.dirname(p))
		end
	else
		slim :'nas/delete'
	end
end

get '/nas/upload' do
	slim :'nas/upload'
end

post '/nas/upload' do
	io = nas_storage
	path = params[:path]
	filename = params['file'][:filename]
	fn = Storage.path(path, filename)

	if io.exist? path and io.directory? path and not io.exist? fn
		tmpfile = params['file'][:tempfile]

		io.upload(fn, tmpfile.path)

		status 200
	else
		status 400
	end
end

