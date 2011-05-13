#!/bin/sh

# Path definitions
VAR_APPNAME=vegas
VAR_PLATFORM=linux
VAR_PATH_BASE=$PWD
VAR_PATH_BUILDS=$VAR_PATH_BASE/builds
VAR_PATH_APP=$VAR_PATH_BASE/application/titanium
VAR_PATH_RESOURCES=$VAR_PATH_APP/Resources
VAR_PATH_TITANIUM=~/.titanium
VAR_PATH_TITANIUM_SDK=~/.titanium/sdk/linux/1.0.0
VAR_PATH_BUILD=$VAR_PATH_BUILDS/$VAR_PLATFORM
VAR_PATH_BUILT=$VAR_PATH_BUILDS/$VAR_PLATFORM/$VAR_APPNAME
VAR_EXECUTEABLE=$VAR_PATH_BUILT/$VAR_APPNAME

rm -rf $VAR_PATH_RESOURCES/*
rmdir $VAR_PATH_RESOURCES

# Generate closure compiled source code
java -jar $VAR_PATH_BASE/src/library/rhino/js.jar $VAR_PATH_BASE/src/modules/build.js --src_path=$VAR_PATH_BASE/src

cp -R $VAR_PATH_BASE/src/ $VAR_PATH_RESOURCES/

# remove the current build
rm -rf $VAR_PATH_BUILD
mkdir $VAR_PATH_BUILD

# create and run the new build
$VAR_PATH_TITANIUM_SDK/tibuild.py -v -t bundle -d $VAR_PATH_BUILD/ -s $VAR_PATH_TITANIUM/ -a $VAR_PATH_TITANIUM_SDK/ $VAR_PATH_APP/

sudo chown -R $USER $VAR_PATH_BUILD/*

sudo sh $VAR_PATH_BASE/build-docs.sh

$VAR_EXECUTEABLE --debug
