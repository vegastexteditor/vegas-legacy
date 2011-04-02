(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas,
      session = vegas.session,
      utils = vegas.utils;

    /**
     * @class View
     * @memberOf vegas
     * @description  A group of Components inside of a single panes, can be visualized in (but
     * is not limited to) the traditional pane form.
     */
    vegas.Window = (function (data) {

      var Window = function () {
        utils.makeObject(this, arguments);
        this.entity = 'Window';
      };

      Window.prototype = {


      };

      return Window;

    }());
    /**
     * @namespace vegas.window
     */
    vegas.window = (function () {

      var window = {
        /** @lends window.view */

      };

      vegas.init.register(window);

      return window;

    }());

  /**
   * @class Windows
   * @memberOf vegas
   * @extends vegas.utils.ObjectCollection (An Array with extra methods)
   *
   * @description An object, that when instantiated will provide a listing of
   * Window objects with methods to work with them.
   */
  vegas.Windows = function () {
    utils.makeObject(this, arguments, utils.ObjectCollection);
  };

  vegas.Windows.prototype = {

  };

  // Creates an instance of the Windows collection for keeping track of windows.
  vegas.windows = new vegas.Windows();

  vegas.module.register('window.js');

}());