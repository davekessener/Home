class ExtendUsers < ActiveRecord::Migration[5.1]
	def change
		add_column :users, :last_ip, :string
		add_column :users, :last_device, :integer
	end
end
