class Service
	attr_reader :id, :name, :icon

	def initialize(name, icon)
		@id = name.downcase.gsub(/[^0-9a-z]+/, '_').to_sym
		@name = name
		@icon = icon
	end
end

$services = [
	Service.new('Calendar', 'calendar')
]
