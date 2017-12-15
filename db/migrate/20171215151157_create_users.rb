class CreateUsers < ActiveRecord::Migration[5.1]
  def change
  	create_table :users do |t|
		t.string :name
		t.string :lang, default: 'de'
	end
  end
end
