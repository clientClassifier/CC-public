test:
	@./node_modules/.bin/mocha -R nyan -t 5000 -u bdd --globals meridiem

.PHONY: test