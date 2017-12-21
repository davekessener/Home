class Hash
	def to_o
		Object.new.tap do |o|
			each do |k, v|
				if v.respond_to? :call
					o.define_singleton_method(k.to_sym, &v)
				else
					o.define_singleton_method(k.to_sym) { v }
				end
			end
		end
	end
end

