(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

  /*
   * There can only be one active buffer. The contains the text that is in
   * memory, typically the active buffer will take input from the keyboard
   * when the editor is in insert mode.
   *
   */
  vegas.Buffer = (function() {

    var Buffer = function() {
      this.id = vegas.getUniqueId();
      vegas.makeObject(this, arguments);
    };

    Buffer.prototype = {

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
      destroy: function(buffer_id) {
        return false;
      },

      /**
       * Change the buffer's resource to a different location
       */
      setResource: function (resource) {
        this.resource = resource;
      },

      activate: function() {
        for (var i = 0; i < this._onActivate.length; i++) {
          vegas.buffers._onActivate[i](this);
        }
      },

      onActivate: function(callback) {
        vegas.buffers._onActivate.push(callback);
      },

      toString: function () {
        return this.bufferName;
      },

      /*
       * These methods are user facing and will be available to the command line.
       */
      api: [
        this.somePublicMethod,
      ]

    };

    return Buffer;

  }());

  vegas.buffers = {

    /**
     * A list of buffers from the specified context
     */
    list: function(context) {
      context = context || 'global';
      return bufferList;
    },

    onActivate: function(callback) {
      vegas.buffers._onActivate.push(callback);
    },

    seek: function(key, context) {
      context = context || 'global';

      return bufferList;
    }

  };

  vegas.module.register('buffer.js');

}());