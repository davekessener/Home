require 'fileutils'
require 'json'

require_relative 'helper'

module RecipeImport
	def self.import(dir)
		dir = File.expand_path(dir)

		Recipe::Ingredient.all.destroy_all
		Recipe::IngredientVariation.all.destroy_all
		Recipe::Dish.all.destroy_all

		if File.exists? (ing_p = File.join(dir, "ingredients.json"))
			JSON.parse(Helper::read_utf8(ing_p)).each do |ing|
				e = Recipe::Ingredient.create(name: ing['name'])
				puts "Adding new ingredient #{e.name} ..."
				if (v = ing['variations'])
					v.each do |v|
						puts " ... with variant #{v['name']}"
						Recipe::IngredientVariation.create(name: v['name'], ingredient: e, description: v['description'])
					end
				else
					Recipe::IngredientVariation.create(ingredient: e)
				end
			end
		end

		Dir.glob(File.join(dir, '*.json')).each do |fn|
			next if fn == ing_p

			dish = JSON.parse(Helper::read_utf8(fn))
			puts "Adding new dish #{dish['name']} ..."
			e = Recipe::Dish.new(name: dish['name'], instructions: dish['instructions'], prep_time: dish['prep_time'], cook_time: dish['cook_time'])
			dish = dish['ingredients']
			i = Recipe::IngredientList.create
			(dish['base'] || []).each do |base|
				i_b, i_v = *base['ingredient'].split('.')
				v = Recipe::IngredientVariation.find { |e| e.name == i_v && e.ingredient.name == i_b }
				u = base['unit'].split('.')[1]
				u = Recipe::Unit.all.find { |e| e.name == u.downcase }
				puts " ... with base ingredient #{v.ingredient.name} #{v.name} #{base['quantity']} #{u.name}"
				u = Recipe::Unit.all.find_index(u)
				Recipe::BaseIngredient.create(ingredient_list: i, ingredient_variation: v, unit: u, quantity: base['quantity'])
			end
			e.ingredient_list = i
			e.save
		end
	end
end

