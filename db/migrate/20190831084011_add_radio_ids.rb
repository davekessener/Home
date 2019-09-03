class AddRadioIds < ActiveRecord::Migration[5.1]
	def change
		add_column :radio_stations, :uid, :string
	end
end
