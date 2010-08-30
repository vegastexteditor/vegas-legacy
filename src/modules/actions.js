(function() {
  var global = (function() {return this;}).call(),
      vegas = global.vegas;

    /**
     * Text actions
     */
    vegas.actions = (function() {

      var actions = {

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