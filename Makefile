VERSION := $(shell grep version package.json | cut -d":" -f2 | sed 's/[", ]//g')
.PHONY: release

release:
	git tag $(VERSION)
	git push origin master --tags
