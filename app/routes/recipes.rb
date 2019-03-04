require 'json'

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

get '/recipes/edit/dish' do
	slim :'recipes/edit/dish'
end

post '/recipes/new/dish' do
	content_type :json

	Recipe::Utils.construct_dish(Recipe::Dish.new, JSON.parse(params['dish'])).to_json
end

get '/recipes/new/ingredient' do
	slim :'recipes/edit/ingredient'
end

post '/recipes/new/ingredient' do
end

get '/recipes/edit/ingredient/:id' do |id|
	if (dish = Recipe::Ingredient.find(id.to_i))
		slim :'recipes/edit/ingredient', locals: { ingredient: dish }
	else
		status 404
	end
end

post '/recipes/ingredient/:id' do |id|
end

get '/recipes/edit/dish/:id' do |id|
	if (dish = Recipe::Dish.find(id.to_i))
		slim :'recipes/edit/dish', locals: { dish: dish }
	else
		status 404
	end
end

post '/recipes/dish/:id' do |id|
	content_type :json

	if (dish = Recipe::Dish.find(id.to_i))
		Recipe::Utils.construct_dish(dish, JSON.parse(params['dish'])).to_json
	else
		status 404
	end
end

get '/recipes/ingredients' do
	content_type :json

	if params['hash'] == Helper.last_modified
		{ hash: params['hash'] }
	else
		r = []
		Recipe::Ingredient.all.each do |ing|
			vars = []
			ing.ingredient_variations.all.each do |var|
				vars.push({
					id: var.id,
					name: var.name
				})
			end
			r.push({
				id: ing.id,
				name: ing.name,
				variations: vars
			})
		end
		d = []
		Recipe::Dish.all.each do |dish|
			d.push({
				id: dish.id,
				name: dish.name
			})
		end
		{ ingredients: r, dishes: d, hash: Helper.last_modified }
	end.to_json
end

