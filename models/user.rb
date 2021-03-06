class LanguageValidator < ActiveModel::Validator
	def validate(record)
		unless File.exist? "#{$root_dir}/lang/#{record.lang}.json"
			record.errors << "#{record.lang} is not a valid language"
		end
	end
end

class User < ActiveRecord::Base
	has_and_belongs_to_many :activities
	has_many :bookmarks, dependent: :destroy
	has_many :known_hosts, dependent: :destroy

	validates :name, presence: true
	validates :name, uniqueness: true
	validates :lang, presence: true
	validates_with LanguageValidator
end

class KnownHost < ActiveRecord::Base
	belongs_to :user

	validates :ip, presence: true
	validates :user_id, presence: true
end

