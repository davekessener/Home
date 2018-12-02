class Service
	attr_reader :id, :name, :icon

	def initialize(name, icon)
		@id = name.downcase.gsub(/[^0-9a-z]+/, '_').to_sym
		@name = name
		@icon = icon
	end
end

$services = [
	Service.new('Radio', 'music'),
	Service.new('Audiobooks', 'headphones'),
	Service.new('Devices', 'bullhorn'),
	Service.new('Recipes', 'book'),
	Service.new('Calendar', 'calendar')
]

