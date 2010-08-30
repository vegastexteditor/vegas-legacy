(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas,
      session = vegas.session;

    /**
     * A base container for visualization, also known as "windows" can contain Pane(s)
     */
    vegas.view = (function(){

      var view = {

        panes: [],

        open: function () {

        },

        close: function (view) {
          view = view || session.activeView;
          view.close();
        },

        api: [
          this.open,
          this.close,
        ]

      };

      return view;

    }());

  vegas.module.register('view.js');

}());