(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /**
     * References to location for text storage (a reference to a file on disk)
     * The resource is a propery on a Buffer Instance
     */
    vegas.Resource = (function(){

      var Resource = function() {
        vegas.makeObject(this, arguments);
      };

      Resource.prototype = {

        init: function () {

        },

        create: function() {

        },

        remove: function() {

        },

        read: function() {

        },

        update: function() {

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.somePublicMethod
        ]

      };

      return Resource;

    }());

  vegas.module.register('resource.js');

}());