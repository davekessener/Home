module Recipe
	class UnitType
		attr_reader :name, :unit

		def initialize(name, unit)
			@name, @unit = name, unit
		end

		def self.[](i)
			@@types ||= [
				UnitType.new('discrete', 7),
				UnitType.new('weight', 0),
				UnitType.new('volume', 3)
			]
			@@types[i]
		end
	end

	class Unit
		attr_reader :name, :short, :type, :conversion

		def initialize(name, short, type, conversion = 1)
			@name, @short, @conversion = name, short, conversion.to_f
			@type = UnitType[type]
		end

		def self.all
			@@units ||= [
				Unit.new('gramm', 'g', 1),
				Unit.new('kilogramm', 'kg', 1, 1000),
				Unit.new('milliliter', 'ml', 2, 0.001),
				Unit.new('liter', 'l', 2),
				Unit.new('teaspoon', 'TL', 2, 5),
				Unit.new('tablespoon', 'EL', 2, 15),
				Unit.new('cup', nil, 2, 235),
				Unit.new('single', nil, 0),
				Unit.new('bag', nil, 0),
				Unit.new('pinch', nil, 0),
				Unit.new('dash', nil, 0)
			]
		end

		def self.[](i)
			Unit.all[i]
		end
	end

	class RecipeTag < ActiveRecord::Base
		validates :name, presence: true
	end
	
	class Ingredient < ActiveRecord::Base
		validates :name, presence: true
		has_many :ingredient_variations, dependent: :destroy
	end
	
	class IngredientVariation < ActiveRecord::Base
		belongs_to :ingredient
		validates :ingredient_id, presence: true
	end
	
	class IngredientList < ActiveRecord::Base
		has_many :base_ingredients, dependent: :destroy
		has_many :compound_ingredients, dependent: :destroy
		has_many :embedded_ingredients, dependent: :destroy
	end
	
	class Dish < ActiveRecord::Base
		belongs_to :ingredient_list
	
		validates :name, presence: true
		validates :ingredient_list_id, presence: true
	end
	
	class BaseIngredient < ActiveRecord::Base
		belongs_to :ingredient_list
		belongs_to :ingredient_variation

		def display_name(f = ->(n) { n })
			v = ingredient_variation
			name = f.(v.ingredient.name)
			name = "#{name} (#{f.(v.name)})" unless "#{v.name}".empty?
			name
		end
	end
	
	class CompoundIngredient < ActiveRecord::Base
		belongs_to :ingredient_list
		belongs_to :dish
	
		validates :dish, presence: true
	end
	
	class EmbeddedIngredient < ActiveRecord::Base
		belongs_to :ingredient_list

		validates :ingredient_list_id, presence: true
		validates :content_id, presence: true

		def content
			IngredientList.find(content_id)
		end
	end
end

