(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * @class Resource
     * @memberOf vegas
     * @description References to location for text storage (a reference to a
     * file on disk) The resource is a propery on a Buffer Instance
     */
    vegas.Resource = (function () {

      var Resource = function () {
        vegas.utils.makeObject(this, arguments);
      };

      Resource.prototype = {
        /** @lends vegas.Resource */
        init: function () {

        },

        create: function () {

        },

        remove: function () {

        },

        read: function () {

        },

        update: function () {

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