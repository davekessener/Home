require_relative 'environment'

@tasks = {}

def task(name, &block)
	@tasks[name] = block
end

Dir.glob('utils/*.rb').each do |f|
	require_relative f
end

if ARGV.empty?
	puts "Known tasks:"
	@tasks.each do |name, task|
		puts "- #{name}"
	end
elsif (task = @tasks[ARGV[0]])
	task.call(ARGV[1..-1])
else
	puts "ERR: Unknown task '#{ARGV[0]}'!"
end

