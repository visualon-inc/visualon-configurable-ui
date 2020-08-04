#!/bin/bash

# make a build for local
checkPackage :
	@ echo "****************************************"
	@ echo "Install node modules..."
	@ echo "****************************************" ; \
	npm install
clean :
	@ echo "****************************************"
	@ echo "Clean up the temp directories!"
	@ echo "****************************************"
	grunt cleanall
docs : checkPackage
	@ echo "****************************************"
	@ echo "Build and uglify the default task..."
	@ echo "****************************************" ; \
	grunt docs
test : checkPackage
	@ echo "****************************************"
	@ echo "Build and uglify the default task..."
	@ echo "****************************************" ; \
	grunt
# make a release
release : checkPackage
	@ echo "****************************************"
	@ echo "Build release kit..."
	@ echo "****************************************" ; \
	result=1;count=0; while [ $$result -ne 0 -a $$count -le 1 ] ; do \
		if [ $$count -gt 0 ]; then \
			echo "Retry " $$count; \
		fi; \
		grunt dist --whitelist=${whitelist} --outputDir=${outputDir} --tempDir=${tempDir} --tempPluginDir=${tempPluginDir} --nodePath=${nodePath} --packageName=${packageName} --packageType=${packageType} --expiration=${expiration} --validity=${validity} --analyticsID=${analyticsID} --features=${features} --versionInfo=${versionInfo} --analyticsURL=${analyticsURL} --analyticsExpiration=${analyticsExpiration} --analyticsVerspectiveExpiration=${analyticsVerspectiveExpiration}; \
		result=$$?; \
		count=`expr $$count + 1`; \
	done


release_ui: checkPackage
	@echo "+build ui in Makefile"
	node ./node_modules/webpack/bin/webpack.js --config webpack.config.js --devtool none --mode production --tempPluginDir ${tempPluginDir}
	@echo "-build ui in Makefile"

