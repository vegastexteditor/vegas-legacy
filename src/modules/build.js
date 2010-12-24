importPackage(java.io);;

vegas = {};
vegas.module = {
  load: function () {},
  register: function () {}
};

var arg,
    src_path = '../..';

for (var i = 0; i < arguments.length; i++) {
  arg = arguments[i];
  if (arg.indexOf('--src_path') !== -1) {
    src_path = arg.split('--src_path=')[1];
  }
}

load(src_path + "/settings/settings.js");
load(src_path + "/modules/bootstrap.js");

var compressModulesCommand = 'java -jar ' + src_path + '/library/closure/compiler.jar --js_output_file ' + src_path + '/vegas-modules.min.js --js ' + src_path + '/' + vegas.bootstrap['modules'].join(' --js ' + src_path + '/');

runCommand.apply(this, compressModulesCommand.split(' '));
