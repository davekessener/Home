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

get '/recipes/new/dish' do
	slim :'recipes/dish_edit'
end

post '/recipes/new/dish' do
end

get '/recipes/new/ingredient' do
	slim :'recipes/ingredient_edit'
end

post '/recipes/new/ingredient' do
end

get '/recipes/ingredient/:id/edit' do |id|
	if (dish = Recipe::Ingredient.find(id.to_i))
		slim :'recipes/ingredient_edit', locals: { ingredient: dish }
	else
		status 404
	end
end

put '/recipes/ingredient/:id' do |id|
end

get '/recipes/dish/:id/edit' do |id|
	if (dish = Recipe::Dish.find(id.to_i))
		slim :'recipes/dish_edit', locals: { dish: dish }
	else
		status 404
	end
end

put '/recipes/dish/:id' do |id|
end

