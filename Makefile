.PHONY : doc build clean dist

pre_build:
	git rev-parse HEAD > .git-ref
	mkdir -p build/src
	mkdir -p build/demo/kitchen-sink
	mkdir -p build/textarea/src
	
	cp -r demo/kitchen-sink/styles.css build/demo/kitchen-sink/styles.css
	cp demo/kitchen-sink/logo.png build/demo/kitchen-sink/logo.png
	cp -r doc/site/images build/textarea

build: pre_build
	./Makefile.dryice.js normal
	./Makefile.dryice.js demo
	./Makefile.dryice.js bm

# Minimal build: call Makefile.dryice.js only if our sources changed
basic: build/src/ace.js

build/src/ace.js : ${wildcard lib/*} \
                   ${wildcard lib/*/*} \
                   ${wildcard lib/*/*/*} \
                   ${wildcard lib/*/*/*/*} \
                   ${wildcard lib/*/*/*/*/*} \
                   ${wildcard lib/*/*/*/*/*/*}
	./Makefile.dryice.js

build/src-min/ace.js : ${wildcard lib/*} \
                   ${wildcard lib/*/*} \
                   ${wildcard lib/*/*/*} \
                   ${wildcard lib/*/*/*/*} \
                   ${wildcard lib/*/*/*/*/*} \
                   ${wildcard lib/*/*/*/*/*/*}
	/usr/local/bin/node ./Makefile-plod.dryice.js minimal --m

embed: build/src-min/ace.js
	@mkdir -p build/editor
	@echo "// ACE Editor" > build/ace.js
	@for f in ${wildcard build/src-min/[a-s]*.js} ${wildcard build/src-min/snippets/*.js} ; \
    do cat $$f >> build/ace.js; \
    echo >> build/ace.js; \
  done

	@echo >> build/ace.js
	@echo "// Color Themes" >> build/ace.js
	@for f in ${wildcard build/src-min/theme*.js} ; \
    do cat $$f >> build/ace.js; \
    echo >> build/ace.js; \
  done

install: embed
	@./env/bin/python themedump.py > /dev/null
	@cp build/ace.js ../../Resources/ui/js/ace.js
	@cp build/themes.json ../../Resources/ui/themes.json
	@cp build/autocomplete.css ../../Resources/ui/autocomplete.css

doc:
	cd doc;\
	(test -d node_modules && npm update) || npm install;\
	node build.js

clean:
	rm -rf build
	rm -rf ace-*
	rm -f ace-*.tgz

ace.tgz: build
	mv build ace-`./version.js`/
	cp Readme.md ace-`./version.js`/
	cp LICENSE ace-`./version.js`/
	tar cvfz ace-`./version.js`.tgz ace-`./version.js`/

dist: clean build ace.tgz
