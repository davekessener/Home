require 'digest/md5'

class Numeric
	def is_f?
		(self % 1) != 0
	end
end

module Helper
	def self.read_utf8(fn)
		s = File.open(fn, 'r:UTF-8', &:read)
		((s[0] && s[0].ord == 65279) ? s[1..-1] : s)
	end

	def self.symbolized_hash(h)
		return h unless h.is_a? Hash

		r = {}
		h.each do |k, v|
			r[(k.to_sym rescue k) || k] = Helper::symbolized_hash(v)
		end
		r
	end

	def self.convert(t)
		l, s = 0, 1
		t.split(/:/).reverse_each do |p|
			l += s * p.to_i
			s *= 60
		end
		l
	end

	def self.hash(json)
		if json.methods.include? :each
			t = []
			json.each do |e|
				t.push(Helper.hash(e))
			end
			Helper.hash(t.sort.join)
		else
			Digest::MD5.hexdigest(json.to_s)
		end
	end

	def self.find_denominator(f)
		18.times do |i|
			return (i + 1) if not (f * (i + 1)).is_f?
		end
		nil
	end

	def self.html_fraction(q)
		r = ''
		o = q
		if (p = q.to_i) > 0
			r += "#{p}"
		end
		if (q = q % 1) > 0
			if p < 10 and (p = Helper::find_denominator(q))
				r += "<sup>#{(p * q).to_i}</sup>"
				r += "&frasl;"
				r += "<sub>#{p}</sub>"
			else
				r = o.to_f.round(3).to_s
			end
		end
		r
	end

	def self.to_s(d)
		s, d = d % 60, d / 60
		m, d = d % 60, d / 60
		[d, m, s].map { |e| '%02d' % e }.join(':')
	end

	def self.is_server_reachable?(url)
		(`fping -q -c 1 -t 300 "#{url}" 2>&1` =~ /xmt\/rcv\/%loss = 1\/1/)
	end

	def self.temperature(t)
		@@temps ||= {
			':UL' => 'Umluft',
			':OU' => 'Ober/Unterhitze'
		}
		(@@temps[t] || t)
	end

	module Linguistics
		def self.[](t)
			@@langs ||= {
				de: Deutsch.new,
				en: English.new
			}
			@@langs[t.to_s.downcase.to_sym]
		end

		def self.classify(s)
			if s.capitalize == s
				:capital
			elsif s.upcase == s
				:upper
			elsif s.downcase == s
				:lower
			else
				:none
			end
		end

		def self.transform(s, t)
			case t
				when :capital
					s.capitalize
				when :upper
					s.upcase
				when :lower
					s.downcase
				else
					s
			end
		end

		class Lang
			def initialize(d)
				@default = d
				@lut = [{}, {}]
			end

			def add(s, p)
				@lut[0][s] = p;
				@lut[1][p] = s;
			end

			def singular(s)
				t = Linguistics.classify(s)
				o = s
				s = s.downcase
				if (r = @lut[1][s])
					r = Linguistics.transform(r, t)
				else
					if s.ends_with? @default
						r = o[0...(s.length-@default.length)]
					else
						r = o
					end
				end
				r
			end

			def plural(s)
				t = Linguistics.classify(s)
				o = s
				s = s.downcase
				if (r = @lut[0][s])
					r = Linguistics.transform(r, t)
				else
					unless s.ends_with? @default
						r = o + Linguistics.transform(@default, t)
					else
						r = o
					end
				end
				r
			end
		end

		class Deutsch < Lang
			def initialize
				super('')

				add 'stück', 'stück'
				add 'tasse', 'tassen'
				add 'tüte', 'tüten'
				add 'prise', 'prisen'
				add 'ei', 'eier'
				add 'dattel', 'datteln'
				add 'frühlingszwiebel', 'frühlingszwiebeln'
				add 'zwiebel', 'zwiebeln'
				add 'zehe', 'zehen'
				add 'zitrone', 'zitronen'
			end
		end

		class English < Lang
			def initialize
				super('s')

				add 'pinch', 'pinches'
			end
		end
	end
end

