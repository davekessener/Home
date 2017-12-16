class CreateActivities < ActiveRecord::Migration[5.1]
	def change
		create_table :activities do |t|
			t.string :content
			t.datetime :due
			t.boolean :important, default: false

			t.timestamps
		end

		create_table :users_activities, id: false do |t|
			t.belongs_to :user, index: true
			t.belongs_to :activity, index: true
		end
	end
end
