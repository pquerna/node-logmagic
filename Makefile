build:
	@mkdir -p ./dist/
	@echo 'Building dist/logmagic.js'
	./node_modules/.bin/gluejs \
	--include ./lib/common \
	--include ./lib/browser \
	--global logmagic \
	--main lib/browser/logmagic.js \
	--out dist/logmagic.js \
	--command 'node_modules/.bin/uglifyjs --no-copyright --mangle-toplevel'
