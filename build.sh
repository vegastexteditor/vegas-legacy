sudo rm -rf /home/ydmm/sites/editor/build/titanium/*
ln -s /home/ydmm/sites/editor/src/editor /home/ydmm/sites/editor/src/application/titanium/Resources/editor
ln -s /home/ydmm/sites/editor/src/library /home/ydmm/sites/editor/src/application/titanium/Resources/library
/home/ydmm/.titanium/sdk/linux/1.0.0/tibuild.py -d /home/ydmm/sites/editor/build/titanium -s /home/ydmm/.titanium/ -r -a /home/ydmm/.titanium/sdk/linux/1.0.0/ /home/ydmm/sites/editor/src/application/titanium
sudo rm /home/ydmm/sites/editor/src/application/titanium/Resources/editor
sudo rm /home/ydmm/sites/editor/src/application/titanium/Resources/library
/home/ydmm/sites/editor/build/titanium/Shitspin/Shitspin