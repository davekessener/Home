helpers do
	def language
		settings.language[@lang || settings.default_lang]
	end

	def s(path)
		language[path] || path
	end
end

module Language
	def self.impl(ids, lang, data)
		data.each do |id, v|
			ids.push id

			if v.is_a? String
				lang[ids.join(':')] = v
			else
				Language::impl(ids, lang, v)
			end

			ids.pop
		end
	end

	def self.load(d)
		langs = {}
		Dir.glob("#{d}/*.json").each do |f|
			data = JSON.parse(File.read(f))
			id = f.match(/([a-z]+)\.json$/) { |m| m[1] }.to_sym
			l = {}
			Language::impl([], l, data)
			langs[id] = l
		end
		langs
	end
end

set :language, Language::load(settings.lang_dir)

