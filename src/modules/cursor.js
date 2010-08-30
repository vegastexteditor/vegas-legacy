(function() {
  var global = (function() {return this;}).call(),
      vegas = global.vegas;

    /**
     * Text editor cursor
     */
    vegas.Cursor = (function() {

      var Cursor = function() {
        vegas.makeObject(this, arguments);
      };

      Cursor.prototype = {

        draw: function(){

        },

        events: function(){

        },

        getFromXy: function(){

        },

        down: function(){

        },

        up: function(){

        },

        left: function(){

        },

        right: function(){

        },

        home: function(){

        },

        end: function(){

        },

        nextWord: function(){

        },

        prevWord: function(){

        },

        nextBlock: function(){

        },

        prevBlock: function(){

        },

        nextSmart: function(){

        },

        prevSmart: function(){

        },

        top: function(){

        },

        bottom: function(){

        },

        api: [
        ]

      };

      return Cursor;

    }());

  vegas.module.register('cursor.js');

}());