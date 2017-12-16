class CreateActivities < ActiveRecord::Migration[5.1]
	def change
		create_table :activities do |t|
			t.string :content
			t.datetime :due
			t.boolean :important
		end
	end
end
