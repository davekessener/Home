class CreateRadioservers < ActiveRecord::Migration[5.1]
	def change
		create_table :radio_servers do |t|
			t.string :name
			t.string :url
			t.integer :remote_idx, unique: true

			t.timestamps
		end
	end
end
