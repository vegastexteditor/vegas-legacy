(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /**
     * A group of Components inside of a single panes, can be visualized in (but
     * is not limited to) the traditional tab form.
     */
    vegas.Tab = (function(){

      var Tab = function() {
        vegas.makeObject(this, arguments);
      };

      Tab.prototype = {

        init: function () {

        },
        
        remove: function(){

        },

        moveTo: function(pane){

        },

        /**
         * Gets the window that the tab exists in
         *
         * @return Object of Window
         *
         */
        getWindow: function(){

        },

        /**
         * Gets the pane that the tab exists in
         *
         * @return Object of Pane
         *
         */
        getPane: function(){

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.remove,
          this.moveTo,
          this.getWindow,
          this.getPane
        ]

      };

      return Tab;

    }());

  vegas.module.register('tab.js');

}());
