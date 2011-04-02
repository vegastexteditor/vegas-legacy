(function() {
  var global = (function() {return this;}).call(),
      vegas = global.vegas;

    /**
     * @namespace vegas.select
     * @description Text selection
     */
    vegas.select = (function() {

      var select = {
        /** @lends vegas.select */
        init: function () {
          
        },

        draw: function() {

        },

        events: function() {

        },

        select: function() {

        },

        unselect: function() {

        },

        onstart: function() {

        },

        onstop: function() {

        },

        api: [
        ]

      };

      vegas.init.register(select);

      return select;

    }());

  vegas.module.register('select.js');

}());