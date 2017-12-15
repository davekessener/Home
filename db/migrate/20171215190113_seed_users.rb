class SeedUsers < ActiveRecord::Migration[5.1]
	DefaultUsers = {
		dave: {
			name: 'Daniel',
			lang: 'en'
		},
		fabian: {
			name: 'Fabian'
		},
		mama: {
			name: 'Gisela'
		},
		papa: {
			name: 'Stefan'
		}
	}

	class GenericRecord < ActiveRecord::Base
		self.table_name = 'users'
	end

	def up
		DefaultUsers.each do |id, user|
			GenericRecord.create(user)
		end
	end

	def down
		DefaultUsers.each do |id, user|
			GenericRecord.find_by(name: user[:name]).destroy
		end
	end
end
