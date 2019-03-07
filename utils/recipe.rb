module Recipe
	module Utils
		def self.get_quantity(q)
			(q.empty? ? nil : q.gsub(/,/, '.').to_f)
		end

		def self.get_unit(u)
			(u == '-' ? nil : u.to_i)
		end

		def self.create_list(data)
			i = Recipe::IngredientList.create!

			data['base'].each do |b|
				v = Recipe::IngredientVariation.find(b['variation'].to_i)
				q = Utils.get_quantity(b['quantity'])
				u = Utils.get_unit(b['unit'])

				Recipe::BaseIngredient.create!(ingredient_list: i, ingredient_variation: v, unit: u, quantity: q)
			end

			data['embedded'].each do |e|
				n = e['name']
				j = Recipe::Utils.create_list(e['content'])

				Recipe::EmbeddedIngredient.create!(ingredient_list: i, content_id: j.id, name: n)
			end

			data['compound'].each do |e|
				d = Recipe::Dish.find(e['dish'].to_i)
				q = Utils.get_quantity(e['quantity'])
				u = Utils.get_unit(e['unit'])

				Recipe::CompoundIngredient.create!(ingredient_list: i, dish: d, unit: u, quantity: q)
			end

			i
		end

		def self.construct_dish(dish, data)
			begin
				ActiveRecord::Base.transaction do
					dish.ingredient_list.destroy! if dish.ingredient_list

					dish.name = data['name']
					dish.ingredient_list = Utils.create_list(data['ingredients'])
					dish.instructions = data['instructions'].strip
					dish.recipe_tags = data['tags'].map { |id| RecipeTag.find(id.to_i) }
					dish.save!

					Utils.modify
				end

				{ error: [], dish: dish.id }
			rescue => e
				puts e.backtrace
				{ error: [ e.to_s ] }
			end
		end

		def self.modify
			@@last_modified = DateTime.now.strftime('%Q')
		end

		def self.last_modified
			@@last_modified ||= Utils.modify
		end
	end
end

