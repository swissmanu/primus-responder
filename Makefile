MAIN = index.js
GLOBAL = 'var PrimusResponder'
FILE = build/primus-responder.client.js

build:
	@-mkdir build
	@./node_modules/.bin/browserbuild \
		--main $(MAIN) \
		--global $(GLOBAL) \
		--basepath lib/client/ `find lib/client -name '*.js'` \
		> $(FILE)

lint:
	@./node_modules/.bin/jshint \
		lib/

test: build
	@./node_modules/.bin/mocha \
		--reporter spec

.PHONY: build lint test