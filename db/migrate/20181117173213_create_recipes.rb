class CreateRecipes < ActiveRecord::Migration[5.1]
	def change
		create_table :recipe_tags do |t|
			t.string :name
			t.timestamps
		end

		create_table :ingredients do |t|
			t.string :name

			t.timestamps
		end

		create_table :ingredient_variations do |t|
			t.belongs_to :ingredient, index: true
			t.string :name
			t.string :description

			t.timestamps
		end

		create_table :ingredient_lists do |t|
			t.timestamps
		end

		create_table :dishes do |t|
			t.belongs_to :ingredient_list, index: true
			t.string :name
			t.string :description
			t.string :instructions

			t.timestamps
		end

		create_table :recipe_tags_dishes, id: false do |t|
			t.belongs_to :recipe_tag, index: true
			t.belongs_to :dish, index: true
		end

		create_table :base_ingredients do |t|
			t.belongs_to :ingredient_list, index: true
			t.belongs_to :ingredient_variation, index: true
			t.integer :unit
			t.float :quantity
		end

		create_table :compound_ingredients do |t|
			t.belongs_to :ingredient_list, index: true
			t.integer :dish_id, index: true
			t.integer :unit
			t.float :quantity
		end

		create_table :embedded_ingredients do |t|
			t.belongs_to :ingredient_list, index: true
			t.integer :content_id, index: true
			t.string :name
		end
	end
end
