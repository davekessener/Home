class FixRecipeTagsAssoc < ActiveRecord::Migration[5.1]
	def change
		create_join_table :dishes, :recipe_tags

		drop_table :recipe_tags_dishes, id: false do |t|
			t.belongs_to :recipe_tag, index: true
			t.belongs_to :dish, index: true
		end
	end
end
