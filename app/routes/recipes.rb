get '/recipes' do
	slim :'recipes'
end

get '/recipes/dish/:id' do |id|
	if (dish = Recipe::Dish.find(id.to_i))
		slim :'recipes/dish', locals: { dish: dish }
	else
		status 404
	end
end

