(function() {
  var global = (function() {return this;}).call(),
      vegas = global.vegas;

    /**
     * Text actions
     * @namespace vegas.actions
     */
    vegas.actions = (function() {

      var actions = {
        /** @lends vegas.actions */
        actionBackspace: function(){},
        actionDelete: function(){},
        actionEnter: function(){},
        actionUp: function(){},
        actionDown: function(){},

        api: [
        ]

      };

      return actions;

    }());

  vegas.module.register('actions.js');

}());