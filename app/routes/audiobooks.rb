before '/audiobooks' do
	request.path_info = '/audiobooks/index'
end

get '/audiobooks/index' do
	slim :'audiobooks/index'
end

get '/audiobooks/franchise/:id' do |id|
	f = Franchise.find(id.to_i)

	if f
		slim :'audiobooks/franchise', locals: { franchise: f }
	else
		status 404
	end
end

