class AddNotes < ActiveRecord::Migration[5.1]
	def change
  		add_column :dishes, :note, :string
	end
end
