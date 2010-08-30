(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /**
     * The primary interface to display
     */
    vegas.paint = (function(){

      var paint = {

        painters: [],

        init: function () {
          this.painters = [];
        },

        registerPainter: function (object) {
//          if ('paint' in object && typeof object['paint'] === 'function') {
//            console.info('registered painter:', object['paint']);
//            this.painters.push(object['paint']);
//          }
//          else{
//            console.error('could not register painter function in:' + object['paint']);
//          }
            this.painters.push(object);
        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.somePublicMethod
        ]

      };

      return paint;

    }());


  vegas.module.register('paint.js');

}());