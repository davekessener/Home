class CreateRadiostations < ActiveRecord::Migration[5.1]
	def change
		create_table :radio_stations do |t|
			t.string :name
			t.string :url
		end
	end
end
