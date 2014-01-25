lint:
	@./node_modules/.bin/jshint \
		lib/

test:
	@./node_modules/.bin/mocha \
		--reporter spec

.PHONY: lint test