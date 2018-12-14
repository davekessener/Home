helpers do
	def current_language_id
		if (u = current_user)
			u.lang
		else
			$lang[:default]
		end
	end

	def current_language
		$current_language = $lang[current_language_id]
	end

	def singularize(n)
		Helper::Linguistics[current_language_id].singular(n)
	end

	def pluralize(n)
		Helper::Linguistics[current_language_id].plural(n)
	end

	def s(path, q = nil)
		path = "#{current_page}:#{path}"
		r = in_lang(path)
		r = pluralize(r) if (q and q > 1)
		r
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
		$language = $lang[$lang[:default]]
	end
end

Language::load

