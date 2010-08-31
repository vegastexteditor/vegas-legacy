(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * Utility functions used throughout the program
     */
    vegas.utils = (function () {
      
      var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
          utils;

      utils = {
        // Who knows may change up library
        extend: global.jQuery.extend,

        onResize: function (element, callback) {
          global.jQuery(element).bind('resize', callback);
        },

        /**
         *
         * Simple object initiator, for consistency, brevity and why not some saftey.
         *
         * http://ejohn.org/blog/simple-class-instantiation/
         *
         * @param {object} "this" object from the original function
         * @param {object} "arguments" variable from the original function
         *
         * @example
         *  var objectSample = function () {
         *    vegas.makeObject(this, arguments);
         *  };
         *
         *  objectSample.prototype = {
         *    init: function () { // Optional
         *    }
         *  };
         *
         */
        makeObject: function (self, args) {

          // Paranoid and unnecessary error handling
          if (typeof self !== 'object') {
            vegas.error('bad param: self');
          }

          if (typeof args.callee !== 'function') {
            vegas.error('bad param: args');
          }

          // Check to see if the object has been instantiated
          if (self instanceof args.callee) {
            // If there is an init function, call it in its own context
            if (typeof self.init == "function") {
              self.init.apply(self, args);
            }
          }
          else {
            // Don't automatically instantiate, warn and quit.
            vegas.error('This method must be instantiated via the new operator.');
            return false;
          }

        },

        getUniqueId: function () {
         var chars = CHARS, uuid = new Array(36), rnd = 0, r;

          for (var i = 0; i < 36; i++) {

            if (i == 8 || i == 13 || i== 18 || i == 23) {
              uuid[i] = '_';
            }
            else if (i == 14) {
              uuid[i] = '4';
            }
            else {
              if (rnd <= 0x02) {
                rnd = 0x2000000 + (Math.random()*0x1000000)|0;
              }
              r = rnd & 0xf;
              rnd = rnd >> 4;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
          return uuid.join('');
        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.somePublicMethod
        ]

      };

      return utils;

    }());

  vegas.module.register('utils.js');

}());
