(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * Utility functions used throughout the program
     */
    vegas.utils = (function () {

      var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
          regExpPercentage =  /^([0-9]|[1-9][0-9]|100)\%$/g,
          regExpWholeNumber = /^[0-9]+$/,
          matchInteger = /^-?((\b[0-9]+)?\.)?[0-9]+\b$/,
          utils;

      utils = {
        // Who knows may change up library
        extend: global.jQuery.extend,
        bind: function (element, type, action) {
          global.jQuery(element).bind(type, function (e) {
            action(e);
          });
        },

        offset: function(element){
          return global.jQuery(element).offset();
        },

        _onReadyDo: [],

        /**
         * Registers a single special key to perform a special function
         * (tab,esc,return,f1,f2,a,b,c,d,1,2,3
         *
         * (lets pretend thats all it does)
         *
         */
        registerKey: function (contextOrKey, keyOrCallback, callbackOrNothing) {
          
          var context,
              key,
              callback,
              entityType,
              activeContext;

          if (typeof(contextOrKey) == 'object') {

            jQuery(document).bind('keydown', key, function (e) {

              context = contextOrKey;
              key = keyOrCallback;
              callback = callbackOrNothing;

              entityType = context.entity;

              console.log('context',context);

              activeContext = vegas.session.state['active' + entityType];

              if (context.entity == activeContext.entity) {
                callback(e);
              }

            });

          }
          else if (typeof(contextOrKey) == 'string') {

            key = contextOrKey;
            callback = keyOrCallback;

            jQuery(document).bind('keydown', key, function (e) {
              callback(e);
            });

          }

        },

        /**
         * Registers a sequence of keys (vim style)
         */
        registerKeySequence: function () {
          // @todo
        },

        /**
         * Used for taking general text input (text)
         */
        takeTextInput: function (callback) {
          global.jQuery(document).bind('keydown', function (e) {
            
            var code = e.keyCode,
                character;

            var isSpecialKey = (
              (code >= 8 && code <= 46) ||
              (code >= 112 && code <= 224) ||
              (code >=91 && code <= 93)
            );

            if (!isSpecialKey) {
              character = String.fromCharCode(code);
              callback(character);
            }

          });
        },

        isArray: function(o) {
          return Object.prototype.toString.call(o) === '[object Array]';
        },

        onResize: function (element, callback) {
          global.jQuery(element).bind('resize', callback);
        },

        cleanStrokeRect: function (ctx, x, y, width, height) {

          var lineWidth = ctx.lineWidth;

          // Top
          ctx.fillRect(
            x,
            y,
            width,
            lineWidth
          );

          // Right
          ctx.fillRect(
            x + width - lineWidth,
            y,
            lineWidth,
            height
          );


          // Top
          ctx.fillRect(
            x,
            y + height - lineWidth,
            width,
            lineWidth
          );

          // Left
          ctx.fillRect(
            x,
            y + lineWidth,
            lineWidth,
            height - lineWidth
          );

        },

        /**
         *
         * Simple object initiator, for consistency, brevity and why not some saftey.
         *
         * http://ejohn.org/blog/simple-class-instantiation/
         *
         * @param self {object} "this" object from the original function
         * @param args {object} "arguments" variable from the original function
         * @param inheritFrom {object} "inheritFrom" an instantiatiable object to inherit from
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
        makeObject: function (self, args, inheritFrom) {

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
            if (typeof self.init === "function") {
              self.init.apply(self, args);
            }

            // get all properties of previous object.
            if (typeof(inheritFrom) === 'function') {
              vegas.utils.extend(self, new inheritFrom);
            }

            return true;

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

        /**
         * Determine if the provided X and Y are in the rectangular area
         * specified by the area object provided.
         *
         * @param x Int
         * @param y Int
         * @param area Object {x, y, width, height}
         * @param offset Object {x,y}
         *
         */
        isXyInArea: function (x, y, area, offset) {

          offset = offset || {x:0, y:0}; // Zero offset, if offset is not set.

          var offsetX = offset.x,
              offsetY = offset.y,
              areaLeftX = area.x + offsetX,
              areaRightX= area.x + area.width + offsetX,
              areaTopY = area.y + offsetY,
              areaBottomY= area.y + area.height + offsetY;

          if (x >= areaLeftX && x <= areaRightX && y >= areaTopY && y <= areaBottomY) {
            return true;
          }
          else {
            return false;
          }

        },

        onReady: function (doThis) {
          this._onReadyDo.push(doThis);
        },

        triggerReady: function () {

          var onReadyDo = this._onReadyDo;

          for (var i = 0; i < onReadyDo.length; i++) {
            onReadyDo[i]();
          }

        },

        onMouseDownInArea: function (view, area, callback) {
          console.log('onMouseDownInArea');
          view = view || vegas.session.state.activeView;
          jQuery('body').bind('mousedown', function (e) {
            console.log(e.clientX, e.clientY, area);
            if(vegas.utils.isXyInArea(e.clientX, e.clientY, area)){
              callback(e);
            }
          });
        },

        onClickInArea: function (view, area, callback) {
          view = view || vegas.session.state.activeView;
          jQuery(document).bind('click', function (e) {
            if(vegas.utils.isXyInArea(e.clientX, e.clientY, area)){
              callback(e);
            }
          });
        },

        array_search: function (needle, haystack, argStrict) {
            // http://kevin.vanzonneveld.net
            // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +      input by: Brett Zamir (http://brett-zamir.me)
            // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // *     example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
            // *     returns 1: 'surname'

            var strict = !!argStrict;
            var key = '';

            for (key in haystack) {
                if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                    return key * 1;
                }
            }

            return false;
        },

        isInteger: function (input) {
          return matchInteger.test(input);
        },

        ensureInteger: function (input) {
          if(matchInteger.test(input)){
            return input * 1;
          }
          else{
            console.log('Invalid integer provided');
            console.trace();
            return false;
          }
        },

        isWholeNumber: function (input) {
          if (regExpWholeNumber.test(input)) {
            return true;
          }
          else{
            return false;
          }
        },

        ensureIntegerWholeNumber: function (input){
          if(regExpWholeNumber.test(input)){
            return input * 1; // ensure Int type
          }
          else{
            console.log('Invalid whole number provided');
            console.trace();
            return false;
          }
        },

        isPercentage: function (number) {

          if (regExpPercentage.test(number)) {
            return true;
          }
          else {
            return false;
          }

        },

        getPercentValue: function (percent, relativeToNumber) {
          var percentInt,
              percentSplit;

          relativeToNumber = relativeToNumber || 100;

          percentSplit = percent.split('%');

          percentInt = percentSplit[0] * 1;

          return Math.floor((percentInt / 100) * relativeToNumber);

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
