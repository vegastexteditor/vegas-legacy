(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * A group of Components inside of a single panes, can be visualized in (but
     * is not limited to) the traditional pane form.
     */
    vegas.Pane = (function (data) {

      var Pane = function () {
        vegas.utils.makeObject(this, arguments);
      };

      Pane.prototype = {

        init: function (data) {
          this.tabs = data.tabs || [];
        },

        remove: function () {

        },

        moveTo: function (position) {

        },

        /**
         * Gets the window that the pane exists in
         *
         * @return Object of Window
         *
         */
        getWindow: function () {
          return window;
        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.create,
          this.remove,
          this.moveTo,
          this.getWindow
        ]

      };

      return Pane;

    }());

  vegas.module.register('pane.js');

}());
