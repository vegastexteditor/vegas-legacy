(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;
  /**
   * @namespace vegas.status
   */
  vegas.status = {

    /**
     * A list of buffers from the specified context
     */
    displayMessage: function (message) {
      console.log(message);
    },

  };

  vegas.module.register('status.js');

}());