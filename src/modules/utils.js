(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

  /**
  * Utility functions used throughout the program
  */
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
      regExpPercentage =  /^([0-9]|[1-9][0-9]|100)\%$/,
      regExpNumber = /^[0-9]+$/,
      matchInteger = /^-?((\b[0-9]+)?\.)?[0-9]+\b$/;

  /**
   * vegas.on('myCustomEvent', function () {
   *  // Do Something
   * })
   */
  vegas.on = jQuery.subscribe;
  vegas.hook = jQuery.subscribe;

  /**
   * vegas.trigger('myCustomEvent');
   */
  vegas.trigger = jQuery.publish;

  vegas.utils = {
    // Who knows may change up library... DEPRECIATED. Sticking with jQuery dependency, will call explicitly
    extend: global.jQuery.extend,

    // Uhhh need to remove this trash... standardize vegas.on / vegas.trigger
    publish: jQuery.publish,
    subscribe: jQuery.subscribe,
    unsubscribe: jQuery.unsubscribe,
    on: jQuery.subscribe,
    trigger: jQuery.publish,
    hook: jQuery.subscribe,
    triggerHook: jQuery.publish,
    registerHook: function () {},

    // JAVASCRIPT LIBRARY PRIMITIVES:
    bind: function (element, type, action) {
      global.jQuery(element).bind(type, function (e) {
        action(e);
      });
    },

    unbind: function (element, type, action) {
      global.jQuery(element).unbind(type, action);
    },

    offset: function(element) {
      return global.jQuery(element).offset();
    },

    querySelector: function (selector, context) {
      context = context || document;
      return this.normalizeCollection(jQuery(selector, context));
    },

    css: function (element, property, value) {
      jQuery(element).css(property, value);
    },

    hasClass: function (element, classname) {
      return jQuery(element).hasClass(classname);
    },

    addClass: function (element, classname) {
      jQuery(element).addClass(classname);
    },

    elementRemove: function (element) {
      jQuery(element).remove();
    },

    elementClone: function (element) {
      return jQuery(element).clone()[0];
    },

    elementSiblings: function (element) {
      return this.normalizeCollection(jQuery(element).siblings());
    },

    elementChildren: function (element) {
      return this.normalizeCollection(jQuery(element).children());
    },

    elementOffset: function (element) {
      return jQuery(element).offset();
    },

    elementHeight: function (element) {
      return jQuery(element).height();
    },

    elementWidth: function (element) {
      return jQuery(element).width();
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

    normalizeCollection: function (collection) {
      var array = [];
      for (var i = 0; i < collection.length; i++) {
        array.push(collection[i]);
      }
      return array;
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
      global.jQuery(document).bind('keypress', function (e) {

        var code = e.charCode,
            character;

        var isNormalCharacter = (code >= 32 && code <= 126);

        if (isNormalCharacter) {
            character = String.fromCharCode(e.charCode);
            callback(character);
        }

      });
    },

    isArray: function(array) {
      return Object.prototype.toString.call(array) === '[object Array]';
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
          vegas.utils.extend(self, new inheritFrom());
        }

        return true;
      }
      else {
        // Don't automatically instantiate, warn and quit.
        vegas.error('This method must be instantiated via the new operator.');
        return false;
      }

    },

    /**
     * Given an object notated string, get information about the object in the string
     */
    getObjectInfoFromString: function (string) {

      var utils = this,
          isAssignment = false;

          var objectNotatedString = utils.trim(string),
              objectNotationTokens = objectNotatedString.split('.'),
              objectProperty = objectNotationTokens.pop(),
              hostObjectString = objectNotationTokens.join('.'),
              hostObject = vegas.utils.getObjectPropertyFromString(hostObjectString),
              value = vegas.utils.getObjectPropertyFromString(string);

          // Its in the global namespace.
          if (hostObject === false) {
            hostObject = global; // be intuative and return the global object.
          }

          return {
            'key': objectProperty,
            'value': value,
            'hostObject': hostObject
          }

      return isAssignment;

    },

    /**
     * Given a string and a baseObject (defaults to the primary vegas object)
     * return the object property of a given dot notated string.
     *
     * This is used alot in the command module.
     *
     * For Example:
     *   utils.getObjectPropertyFromString('settings.CommandBar.buffer.fontFamily');
     *
     *   returns: "Arial"
     *
     *   utils.getObjectPropertyFromString('settings.CommandBar');
     *
     *   returns: the command bar object.
     *
     *   returns false and logs a warning if an object property was not found.
     *
     */
    getObjectPropertyFromString: function (objectNotatedString, baseObject) {

      var namespace = vegas.ns;

      // The object notated string is the namespace so return the namespaced global
      if (objectNotatedString === namespace) {
        return vegas;
      }

      // If the object notated string contains the namespace, remove it since
      // we are already in it.
      if (objectNotatedString.indexOf(namespace) === 0) {
        objectNotatedString = objectNotatedString.substr(namespace.length + 1);
      }

      var objectPropertyTokens = objectNotatedString.split('.'),
          objectPropertyQuestionMark,
          objectProperty = baseObject || vegas;

      if (objectNotatedString == '') {
        return false;
      }

      for (var i = 0; i < objectPropertyTokens.length; i++) {

        objectPropertyQuestionMark = objectProperty[objectPropertyTokens[i]];

        if (typeof(objectPropertyQuestionMark) !== 'undefined') {

          if (typeof(objectPropertyQuestionMark) == 'object') {
            objectProperty = objectPropertyQuestionMark;
          }
          else {
            objectProperty = objectPropertyQuestionMark;
            break;
          }

        }
        else {
          return false;
        }

      }

      return objectProperty;

    },

    /**
     * Get a nifty looking unique identifier
     */
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
      view = view || vegas.session.state.activeView;
      jQuery('body').bind('mousedown', function (e) {
        console.log(e.clientX, e.clientY, area);
        if (vegas.utils.isXyInArea(e.clientX, e.clientY, area)) {
          callback(e);
        }
      });
    },

    onClickInArea: function (view, area, callback) {
      view = view || vegas.session.state.activeView;
      jQuery(document).bind('click', function (e) {
        if (vegas.utils.isXyInArea(e.clientX, e.clientY, area)) {
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
      if (matchInteger.test(input)) {
        return input * 1;
      }
      else {
        console.log('Invalid integer provided');
        console.trace();
        return false;
      }
    },

    isNumber: function (input) {
      if (regExpNumber.test(input)) {
        return true;
      }
      else {
        return false;
      }
    },

    ensureIntegerNumber: function (input) {
      if (regExpNumber.test(input)) {
        return input * 1; // ensure Int type
      }
      else {
        console.log('Invalid whole number provided');
        console.trace();
        return false;
      }
    },

    isPercentage: function (number) {
      return regExpPercentage.test(number);
    },

    getPercentValue: function (percent, relativeToNumber) {
      var percentInt,
          percentSplit;

      relativeToNumber = relativeToNumber || 100;

      percentSplit = percent.split('%');

      percentInt = percentSplit[0] * 1;

      return Math.floor((percentInt / 100) * relativeToNumber);

    },

    trim: jQuery.trim,

    /*
     * These methods are user facing and will be available to the command line.
     */
    api: [
      this.somePublicMethod
    ]

  };

  vegas.utils.ObjectCollection = function () {
    vegas.utils.makeObject(this, arguments, Array);
  };

  vegas.utils.ObjectCollection.prototype = {
    hook: jQuery.bind
  };

  vegas.module.register('utils.js');

}());
