class LanguageValidator < ActiveModel::Validator
	def validate(record)
		unless File.exist? "#{$root_dir}/lang/#{record.lang}.json"
			record.errors << "#{record.lang} is not a valid language"
		end
	end
end

class User < ActiveRecord::Base
	validates :name, presence: true
	validates :name, uniqueness: true
	validates :lang, presence: true
	validates_with LanguageValidator

	has_and_belongs_to_many :activities
end

