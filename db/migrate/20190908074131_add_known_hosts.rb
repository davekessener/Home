class AddKnownHosts < ActiveRecord::Migration[5.1]
	def change
		create_table :known_hosts do |t|
			t.belongs_to :user, index: true

			t.string :ip
		end

		remove_column :users, :last_ip, :string
	end
end
