(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    vegas.historyState = {};

    /**
     * @namespace vegas.history
     * @description Handles the edit history of the editor.
     *
     * There are two kinds of history, action history and buffer history.
     *
     * action based history: will log actions performed on the buffer. By keeping
     * these actions you can determine the reverse action allowing for undo/redo.
     *
     * buffer based history: acts as a fallback for buffer states, allows for
     * restoring a buffer to a certain point in time, these points in time by
     * default would be every thirty seconds if buffer is different than last
     * history.
     *
     */
    vegas.history = (function(){

      var _insertNewBufferHistory = function() {

      };

      var _restoreBufferHistory = function () {

      };

      var history = {
        /**
         * Performs the reverse action of the last action that was executed
         * (from the log)
         *  @todo:undo
         *  @lends vegas.history
         */
        undo: function () {

        },

        /**
         * If a new action has not been mode after undoing an action, read the
         * action after the current action state and re-execute it.
         * @todo:redo
         */
        redo: function () {

        },

        /**
         * Records an action and puts it in the history
         * @todo:log
         */
        log: function () {

        },

        /**
         * Saves a backup of the buffer for the current time
         * @todo:backup
         */
        backup: function () {
          var when = new Date();
          _insertNewBufferHistory(when);
        },

        /**
         * Saves a backup of the buffer for the current time
         * @todo:restore
         */
        restore: function (when) {
          _restoreBufferHistory(when);
        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.undo,
          this.redo,
          this.log,
          this.backup,
        ]

      };

      vegas.init.register(history);

      return history;

    }());

  vegas.module.register('history.js');

}());