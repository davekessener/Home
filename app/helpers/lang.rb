helpers do
	def current_language
		if (u = current_user)
			$lang[u.lang]
		else
			$lang[$lang[:default]]
		end
	end

	def s(path)
		path = "#{current_page}:#{path}"
		in_lang(path)
	end

	def in_lang(path, l = current_language)
		l[path] || path
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

	def self.load
		Dir.glob("#{$lang[:dir]}/*.json").each do |f|
			data = JSON.parse(File.read(f))
			id = f.match(/([a-z]+)\.json$/) { |m| m[1] }
			l = {}
			Language::impl([], l, data)
			$lang[id] = l
		end
	end
end

Language::load

