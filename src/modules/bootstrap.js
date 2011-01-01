(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas,
      load = vegas.module.load;

  var loadCompressedVegasModules = false; // @todo: from settings and override via arugments flag?

  /**
   * Modules and code to be executed at runtime
   */

  var bootstrap = {

    settings: [
      'settings/settings.js',
      'settings/keyMappings.js',
      'settings/keyboard.js'
    ],

    modules: [
      'library/jquery/jquery-1.4.2.js',
      'library/pubsub/pubsub.js',
      'modules/console.js',
      'modules/init.js',
      'modules/utils.js', // @todo: remove plural
      'modules/gui.js',
      'modules/session.js',
      'modules/application.js',

      // Main application modules
      'modules/paint.js',

      // Container modules
      'modules/view.js',
      'modules/region.js',
      'modules/tab.js',
      'modules/component.js',

      // Editor specific modules
      'modules/buffer.js',
      'modules/cursor.js',
      'modules/select.js',
      'modules/scope.js',
      'modules/resource.js',
      'modules/actions.js',
      'modules/editArea.js',

      // High level modules
      'modules/file.js',
      'modules/command.js',
      'modules/keymap.js',
      'modules/keyHandler.js',
      'modules/start.js'
    ]

  };

  // Load up settings
  for (var i = 0; i < bootstrap.settings.length; i++) {
    load(bootstrap.settings[i]);
  }

//  if (loadCompressedVegasModules) {
//    load('vegas-modules.min.js');
//  }
//  else {
    for (var j = 0; j < bootstrap.modules.length; j++) {
      load(bootstrap.modules[j]);
    }
//  }

  vegas.bootstrap = bootstrap;

  vegas.terminate = function () {
    var nullFunc = function (){return null;}
    vegas.paint.startPaint = nullFunc;
    vegas.paint.paint = nullFunc;
    vegas.region.reflow = nullFunc;
  };

  vegas.module.register('bootstrap.js');

}());