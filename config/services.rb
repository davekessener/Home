class Service
	attr_reader :id, :name, :icon

	DEFAULT_OPT = {
	}

	def initialize(name, icon, **opt)
		opt = DEFAULT_OPT.merge(opt)

		@id = (opt[:id] || name.downcase.gsub(/[^0-9a-z]+/, '_').to_sym)
		@name = name
		@icon = icon
		@needs_speaker = opt[:speaker]
	end

	def needs_speaker?
		@needs_speaker
	end
end

$services = [
	Service.new('Radio', 'equalizer', speaker: true),
	Service.new('Audiobooks', 'headphones', speaker: true),
	Service.new('Music', 'music', speaker: true),
	Service.new('Devices', 'bullhorn'),
	Service.new('Recipes', 'book'),
	Service.new('Calendar', 'calendar'),
	Service.new('Storage', 'hdd', id: :nas)
]

