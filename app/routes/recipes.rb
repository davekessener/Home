require 'json'

get '/recipes' do
	slim :'recipes/index'
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

post '/recipes/new/tag' do
	content_type :json

	t = Recipe::RecipeTag.create(name: JSON.parse(params['tag'])[0])
	if t.valid?
		{ id: t.id, name: t.name }
	else
		{ error: t.errors.full_messages }
	end.to_json
end

get '/recipes/edit/dish' do
	slim :'recipes/edit/dish'
end

get '/recipes/edit/dish/:id' do |id|
	if (dish = Recipe::Dish.find(id.to_i))
		slim :'recipes/edit/dish', locals: { dish: dish }
	else
		status 404
	end
end

post '/recipes/new/dish' do
	content_type :json

	Recipe::Utils.construct_dish(Recipe::Dish.new, JSON.parse(params['dish'])).to_json
end

post '/recipes/dish/:id' do |id|
	content_type :json

	if (dish = Recipe::Dish.find(id.to_i))
		Recipe::Utils.construct_dish(dish, JSON.parse(params['dish'])).to_json
	else
		status 404
	end
end

post '/recipes/new/ingredient' do
	content_type :json

	Recipe::Utils.construct_ingredient(Recipe::Ingredient.new, JSON.parse(params['ingredient'])).to_json
end

post '/recipes/ingredient/:id' do |id|
	content_type :json

	if (ing = Recipe::Ingredient.find(id.to_i))
		Recipe::Utils.construct_ingredient(ing, JSON.parse(params['ingredient'])).to_json
	else
		status 404
	end
end

get '/recipes/ingredients' do
	content_type :json

	if params['hash'] == Recipe::Utils.last_modified
		{ hash: params['hash'] }
	else
		Recipe::Utils.compile
	end.to_json
end

