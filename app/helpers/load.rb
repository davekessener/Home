helpers do
	def session_load(id, klass)
		if id
			name = "@current_#{klass.name.downcase}"
			o = instance_variable_get(name)
			o = instance_variable_set(name, klass.find(id)) if o.nil? or o.id != id
			o
		end
	end
end

