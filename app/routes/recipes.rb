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

post '/recipes/dish/:id/notes' do |id|
	content_type :json

	if (dish = Recipe::Dish.find(id.to_i))
		dish.note = params['content']
		{ result: dish.save }.to_json
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

get '/recipes/edit/ingredient/:id' do |id|
	if (dish = Recipe::Ingredient.find(id.to_i))
		slim :'recipes/ingredient_edit', locals: { ingredient: dish }
	else
		status 404
	end
end

post '/recipes/ingredient/:id' do |id|
end

get '/recipes/edit/dish/:id' do |id|
	if (dish = Recipe::Dish.find(id.to_i))
		slim :'recipes/dish_edit', locals: { dish: dish }
	else
		status 404
	end
end

post '/recipes/dish/:id' do |id|
end

get '/recipes/ingredients' do
	content_type :json

	r = {}
	Recipe::Ingredient.all.each do |ing|
		vars = {}
		ing.ingredient_variations.all.each do |var|
			vars["#{var.id}"] = {
				id: var.id,
				name: var.name
			}
		end
		r["#{ing.id}"] = {
			id: ing.id,
			name: ing.name,
			variations: vars
		}
	end

	if params['hash'] and params['hash'] == Helper.hash(r)
		{ hash: params['hash'] }
	else
		r
	end.to_json
end

