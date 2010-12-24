/**
 * @fileOverview Contains Buffer related objects and methods
 */
(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils;

  /**
   * @class Buffer
   * @memberOf vegas
   *
   * @description Creates a buffer to be used for keeping track of text
   * 
   * There can only be one active buffer. The contains the text that is in
   * memory, typically the active buffer will take input from the keyboard
   * when the editor is in insert mode.
   *
   */
  vegas.Buffer = function () {
      vegas.utils.makeObject(this, arguments);
  };

  vegas.Buffer.prototype = {

    init: function () {
      this._value = '';
      this.length = this._value.length;
    },

    /**
     * Saves the buffer to the resource
     */
    save: function () {
      this.resource.save();
    },

    /**
     *  Removes buffer from memory (Unsafe: does not save changes)
     *  @returns True on success, false on failure.
     */
    destroy: function (buffer_id) {
      return false;
    },

    /**
     * Change the buffer's resource to a different location
     */
    setResource: function (resource) {
      this.resource = resource;
    },

    activate: function () {
      for (var i = 0; i < this._onActivate.length; i++) {
        vegas.buffers._onActivate[i](this);
      }
    },

    onActivate: function (callback) {
      vegas.buffers._onActivate.push(callback);
    },

    toString: function () {
      return this.getValue();
    },

    setValue: function (value) {

      if (typeof(value) !== 'undefined') {
        this._value = value;
      }
      else {
        this.getValue();
      }

    },

    append: function (string) {
      this._value += string;
    },

    deletePreviousCharacter: function () {
      var bufferValue = this._value;
      this._value = bufferValue.substr(0, bufferValue.length - 1);
    },

    empty: function () {
      this._value = '';
    },

    getValue: function () {
      return this._value;
    },

    /*
     * These methods are user facing and will be available to the command line.
     */
    api: [
    ]

  };

  /**
   * @class Buffers
   * @memberOf vegas
   * @extends vegas.utils.ObjectCollection (An Array with extra methods)
   *
   * @description An object, that when instantiated will provide a listing of
   * Buffer objects with methods to work with them.
   */
  vegas.Buffers = function () {
    utils.makeObject(this, arguments, utils.ObjectCollection);
  };

  vegas.Buffers.prototype = {
    /**
     * A list of buffers from the specified context
     */
    list: function (context) {
      context = context || 'global';
      return bufferList;
    },

    onActivate: function (callback) {
      vegas.buffers._onActivate.push(callback);
    },

    seek: function (key, context) {
      context = context || 'global';

      return bufferList;
    }
  };

  // Creates an instance of the Buffers collection for keeping track of buffers.
  vegas.buffers = new vegas.Buffers();

  vegas.module.register('buffer.js');

}(this));