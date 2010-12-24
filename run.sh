# Path definitions
VAR_APPNAME=vegas
VAR_PLATFORM=linux
VAR_PATH_BASE=$PWD
VAR_PATH_BUILDS=$VAR_PATH_BASE/builds
VAR_PATH_APP=$VAR_PATH_BASE/application/titanium
VAR_PATH_RESOURCES=$VAR_PATH_APP/Resources
VAR_PATH_TITANIUM=~/.titanium
VAR_PATH_TITANIUM_SDK=~/.titanium/sdk/linux/1.0.0
VAR_PATH_BUILT=$VAR_PATH_BUILDS/$VAR_PLATFORM/$VAR_APPNAME
VAR_EXECUTEABLE=$VAR_PATH_BUILT/$VAR_APPNAME

# Move everything from src to current builds Resources directory
rm -rf $VAR_PATH_BUILT/Resources/*
cp -r $VAR_PATH_BASE/src/* $VAR_PATH_BUILT/Resources/

$VAR_EXECUTEABLE --debug