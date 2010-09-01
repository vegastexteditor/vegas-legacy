(function() {
  var global = (function() {return this;}).call(),
      vegas = global.vegas;

    /**
     * Currently this logs to standard console, future versions may include
     * a built in simple console.
     */
    vegas.init = (function() {

      var init = function () {
        vegas.paint.startPaint();
      };

      init();

      return init;

    }());

  vegas.module.register('init.js');

}());