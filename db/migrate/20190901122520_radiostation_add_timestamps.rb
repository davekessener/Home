class RadiostationAddTimestamps < ActiveRecord::Migration[5.1]
	def change
		add_timestamps :radio_stations, null: false, default: -> { 'NOW' }
	end
end
