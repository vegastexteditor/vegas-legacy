(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * An example of a multi-instance object structure
     */
    vegas.objectSample1 = (function () {

      /*
       * Private methods
       */
      var _somePrivateMethod = function () {
        vegas.log('this is a private method');
      };

      var objectSample1 = {

        init: function () {

        },

        paint: function () {

        },

        // These members are part of the public API
        somePublicMethod: function () {
          _somePrivateMethod();
        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.somePublicMethod
        ]

      };

      return objectSample1;

    });

    /**
     * An example of a multi-instance object structure
     */
    vegas.objectSample2 = (function () {

      var objectSample2 = function () {
        vegas.utils.makeObject(this, arguments);
      };

      /*
       * Private methods
       */
      var _somePrivateMethod = function () {
        vegas.log('this is a private method');
      };

      objectSample2.prototype = {

        init: function () {

        },

        paint: function () {

        },

        // These members are part of the public API
        somePublicMethod: function () {
          _somePrivateMethod();
        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.somePublicMethod
        ]

      };

      return objectSample2;

    });

  vegas.module.register('component.js');

}());