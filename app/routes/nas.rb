require 'fileutils'

def transform_nas_path(p, n = 0)
	p = p[2..-1] if p.start_with? './'
	p = p.split(/\//)
	p[1] = 'view'

	p = p[0...(p.length - n)] if n > 0

	"/#{p.join('/')}"
end

get '/nas' do
	redirect '/nas/view'
end

get '/nas/download' do
	if (fn = params[:file]).nil? or fn.include? '/../' or fn.start_with? '..' or not File.exists? fn or File.directory? fn
		status 400
	else
		send_file(fn, filename: File.basename(fn), type: 'Application/octet-stream')
	end
end

get '/nas/view' do
	slim :'nas/view'
end

get '/nas/view/*' do
	slim :'nas/view'
end

get '/nas/new' do
	p = params[:path]
	n = "#{p}/#{params[:name]}"

	if not File.exist? p or not File.directory? p or File.exist?(n)
		status 400
	else
		FileUtils.mkdir n

		redirect transform_nas_path(n)
	end
end

get '/nas/delete' do
	if params[:confirm] == 'yes'
		p = params[:file]
		if not File.exist? p
			status 400
		else
			FileUtils.rm_rf p

			redirect transform_nas_path(p, 1)
		end
	else
		slim :'nas/delete'
	end
end

get '/nas/upload' do
	slim :'nas/upload'
end

