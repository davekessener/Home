class RecipeTag < ActiveRecord::Base
	validates :name, presence: true
end

class Ingredient < ActiveRecord::Base
	validates :name, presence: true
end

class IngredientVariation < ActiveRecord::Base
	belongs_to :ingredient
	validates :unit, presence: true
end

class IngredientList < ActiveRecord::Base
	has_many :base_ingredients
	has_many :compound_ingredients
	has_many :embedded_ingredients
end

class Dish < ActiveRecord::Base
	belongs_to :ingredient_list

	validates :name, presence: true
	validates :instructions, presence: true
end

class BaseIngredient < ActiveRecord::Base
	belongs_to :ingredient_list
	belongs_to :ingredient_variation

	validates :quantity, presence: true
end

class CompoundIngredient < ActiveRecord::Base
	belongs_to :ingredient_list
	belongs_to :dish

	validates :quantity, presence: true
end

class EmbeddedIngredient < ActiveRecord::Base
	belongs_to :ingredient_list
end

