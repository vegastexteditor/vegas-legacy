(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    vegas.clipboardState = {};

    /**
     * @namespace vegas.clipboard
     * @description Copy and paste functionality, this may contain support for
     * multiple clipboards.
     */
    vegas.clipboard = (function(){

      var clipboard = {
        /** @lends vegas.clipboard */
        init: function () {

        },

        /**
         * Place text in memory.
         * @todo:copy
         */
        copy: function (text) {

        },

        /**
         * Insert current clipboard text into document
         * @todo:paste
         */
        paste: function () {

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.copy,
          this.paste
        ]

      };

      vegas.init.register(clipboard);

      return clipboard;

    }());

  vegas.module.register('clipboard.js');

}());