#!/bin/sh
java -jar src/library/jsdoc-toolkit/jsrun.jar src/library/jsdoc-toolkit/app/run.js -a -t=src/library/jsdoc-toolkit/templates/vegas -d="docs" "src/modules"
