class AddNotes < ActiveRecord::Migration[5.1]
	def change
		create_table :notes do |t|
			t.belongs_to :dish, index: true

			t.string :content

			t.timestamps
		end
	end
end
