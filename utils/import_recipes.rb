require 'fileutils'
require 'json'

require_relative 'helper'

module RecipeImport
	def self.find_unit(u)
		un = '---'
		if u
			u = u.split('.')[1].downcase
			u = Recipe::Unit.all.find { |e| e.name == u }
			un = u.name
			u = Recipe::Unit.all.find_index(u)
		end
		[u, un]
	end

	def self.parse_ilist(dish)
		i = Recipe::IngredientList.create
		
		(dish['base'] || []).each do |base|
			i_b, i_v = *base['ingredient'].split('.')

			v = Recipe::IngredientVariation.find { |e| e.name == i_v && e.ingredient.name == i_b }
			u, un = *RecipeImport::find_unit(base['unit'])
			
			puts " !!! UNKNOWN INGREDIENT #{i_v}.#{i_b}" unless v
			puts " ... with base ingredient #{v.ingredient.name} #{v.name} #{base['quantity']} #{un}"

			Recipe::BaseIngredient.create(ingredient_list: i, ingredient_variation: v, unit: u, quantity: base['quantity'])
		end

		(dish['embedded'] || []).each do |embed|
			name = embed['name']

			puts " > with embedded ingredient #{name}:"

			il = RecipeImport::parse_ilist(embed['ingredients'])

			Recipe::EmbeddedIngredient.create(ingredient_list: i, content_id: il.id, name: name)
		end

		(dish['compound'] || []).each do |compound|
			d = Recipe::Dish.find { |d| d.name == compound['dish'] }
			q = compound['quantity']
			u, un = *RecipeImport::find_unit(compound['unit'])

			puts " > with compound dish #{d.name} (#{q} #{un})"

			Recipe::CompoundIngredient.create(ingredient_list: i, dish: d, unit: u, quantity: q)
		end

		i
	end

	def self.import(dir)
		dir = File.expand_path(dir)

		Recipe::Ingredient.all.destroy_all
		Recipe::IngredientVariation.all.destroy_all
		Recipe::Dish.all.destroy_all
		Recipe::IngredientList.all.destroy_all

		if File.exists? (ing_p = File.join(dir, "ingredients.json"))
			JSON.parse(Helper::read_utf8(ing_p)).each do |ing|
				e = Recipe::Ingredient.create(name: ing['name'])
				puts "Adding new ingredient #{e.name} ..."
				if (v = ing['variations'])
					v.each do |v|
						puts " ... with variant #{v['name']}"
						Recipe::IngredientVariation.create(name: v['name'], ingredient: e, description: v['description'])
					end
				end
				unless Recipe::IngredientVariation.find { |v| v.ingredient == e and "#{v.name}".empty? } 
					Recipe::IngredientVariation.create(ingredient: e)
				end
			end
		end

		Dir.glob(File.join(dir, '*.json')).sort.each do |fn|
			next if fn == ing_p

			dish = JSON.parse(Helper::read_utf8(fn))

			puts "Adding new dish #{dish['name']} ..."
			
			e = Recipe::Dish.new(name: dish['name'], instructions: dish['instructions'])
			e.ingredient_list = RecipeImport::parse_ilist(dish['ingredients'])
			e.save
		end
	end
end

