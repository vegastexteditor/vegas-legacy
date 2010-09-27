(function() {
  var global = (function() {return this;}).call(),
      vegas = global.vegas;

    /**
     * The primary interface to display
     */
    vegas.paint = (function() {

      var paint = {

        painters: [],

        init: function () {
          this.painters = [];
        },

        // The main painter function, everything that is going to be painted
        // is here.
        paint: function (view) {

          view = view || vegas.session.state.activeView;

          // normal global paint settings
          view.ctx.textBaseline = 'bottom';
          view.ctx.lineWidth = '1';

          // Module paint functions
          vegas.pane.paint(view);
          vegas.command.paint(view);

        },

        // Called in vegas.init();
        startPaint: function (view) {

          var self = this,
              interval = vegas.settings.masterPaintInterval;

          view = view || vegas.session.state.activeView;

          self.paint(view);

          view.paintId = global.setInterval(function () {
            self.paint(view);
          }, interval);

          self.stopPaint();

        },

        stopPaint: function (view) {

          view = view || vegas.session.state.activeView;

          global.clearInterval(view.paintId);

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

      paint.init();

      return paint;

    }());


  vegas.module.register('paint.js');

}());