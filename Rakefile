desc 'Open the demo document in the default web browser'
task :demo do
  `open demo/index.html`
end

desc 'Remove the dist directory'
task :clean do
  rm_rf 'dist'
end

file 'dist/popup.js' => ['README.markdown', 'src/javascripts/popup.js'] do |t|
  target = t.name
  unless uptodate?(target, t.prerequisites)
    readme = IO.read(t.prerequisites.first)
    readme = "/*\n" + readme.split("\n").map { |line| " * #{line}" }.join("\n") + "\n *\n */\n\n"
    popupjs = IO.read(t.prerequisites.last)
    open(target, 'w') do |f|
      f.write(readme + popupjs)
    end
  end
end

file 'dist/popup.min.js' => 'src/javascripts/popup.js' do |t|
  gem 'jsmin'
  require 'jsmin'
  target = t.name
  src = t.prerequisites.first
  unless uptodate?(target, src)
    popupjs = IO.read(src)
    open(target, 'w') do |f|
      f.write(JSMin.minify(popupjs).strip)
    end
  end
end

task 'mkdist' do
  mkpath 'dist'
end

task 'imgdist' => :mkdist do
  cp_r 'src/images', 'dist/'
end

desc 'Assemble files for distribution'
task :dist => [:mkdist, 'dist/popup.js', 'dist/popup.min.js', :imgdist]