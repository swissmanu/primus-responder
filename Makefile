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

.PHONY: build