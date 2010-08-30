(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /**
     * Currently this logs to standard console, future versions may include
     * a built in simple console.
     */
    vegas.console = (function(){

      var console = {

        log: function () {
          global.console.log.call(global, arguments);
        },
        
        api: [
          this.log
        ]

      };

      return console;

    });

    vegas.log = vegas.console.log;
    vegas.info = vegas.console.info;

  vegas.module.register('console.js');

}());