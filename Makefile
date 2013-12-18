lint:
	@./node_modules/.bin/jshint \
		lib/

test: build
	@./node_modules/.bin/mocha \
		--reporter spec

.PHONY: build lint test