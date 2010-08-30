(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas,
      load = vegas.module.load,
      bootstrap;

  /**
   * Modules and code to be executed at runtime
   */

  bootstrap = [

    // Main application modules
    'modules/utils.js',
    'modules/paint.js',

    // Container modules
    'modules/view.js',
    'modules/pane.js',
    'modules/tab.js',

    'modules/component.js',

    // Editor specific modules
    'modules/buffer.js',
    'modules/cursor.js',
    'modules/select.js',
    'modules/scope.js',
    'modules/resource.js',
    'modules/actions.js',
    'modules/keymap.js',
    'modules/editArea.js',

    // High level modules
    'modules/file.js',
    'modules/command.js',

    'modules/init.js'
  ];

  for (var i = 0; i < bootstrap.length; i++) {
    load(bootstrap[i]);
  }

  vegas.module.register('bootstrap.js');

}());