class UpdateChapters < ActiveRecord::Migration[5.1]
	def up
		change_column :chapters, :title, :string, null: true
	end

	def down
		change_column :chapters, :title, :string, null: false
	end
end
