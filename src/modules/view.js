(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas,
      session = vegas.session,
      utils = vegas.utils;

    /**
     * @class View
     * @memberOf vegas
     * @description  A group of Components inside of a single panes, can be visualized in (but
     * is not limited to) the traditional pane form.
     */
    vegas.View = (function (data) {

      var View = function () {
        utils.makeObject(this, arguments);
        this.entity = 'View';
      };

      View.prototype = {
        /** @lends vegas.View */
        init: function (data) {
          // Take in properties passed in to data object.
          utils.extend(this, data);
          this.setupWindow();
//          this.setupViewPort();
        },

        setupWindow: function () {
          // Assign a unique Id to the window so we can do easy comparison of
          // windows, especially for finding the View object of a window object.
          this.context.name = utils.getUniqueId();
        },

        setupViewPort: function () {
          // Remove margins, and apply necessary styles to the body
          var bodyStyle = global.document.body.style;
          bodyStyle.margin = '0';
          bodyStyle.padding = '0';
          // Prevent any flicker or in weird cases a gap between canvas and body
          bodyStyle.backgroundColor = vegas.settings.backgroundColor;

          try {
            this.canvas = this.context.document.getElementById('commandBar');;
            this.ctx = this.canvas.getContext('2d');
          }
          catch (e) {
            console.error('could not get the canvas object.');
            vegas.terminate();
            return false;
          }

          // Apply necessary styles to the canvas

          // For now just removes the scrollbar
          this.canvas.style.position = 'fixed';

          // Prevent any flicker?
          this.canvas.style.backgroundColor = vegas.settings.backgroundColor;

          // Stretch the canvas across the body
          vegas.view.setArea(this);

        },

        remove: function () {

        },

        moveTo: function (position) {

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.create,
          this.remove,
          this.moveTo,
          this.getWindow
        ]

      };

      return View;

    }());
    /**
     * @namespace vegas.view
     */
    vegas.view = (function () {

      var view = {
        /** @lends vegas.view */
        panes: [],

        init: function () {
          //this.attachEvents();
        },

        attachEvents: function () {

          var self = this;
          var window = self.getCurrentWindow();
          
          utils.onResize(window, function (e) {
            view = self.getViewFromWindow(window); // @TODO: this doesn't need to be ran all the time.
            self.setArea(view);
            vegas.region.reflow(view);
            utils.publish('reflow');
            vegas.paint.paint();
          });

        },

        getActiveView: function () {
          
        },

        /**
         * Because there is no easy connect between a View in the session
         * and an arbitrary window.
         */
        getViewFromWindow: function (window) {
          var views = vegas.session.state.views;
          for (var i = 0; i < views.length; i++) {
            if (views[i].context.name == window.name) {
              return views[i];
            }
          }
          return false;
        },

        /**
         * Stretches the canvas to take up the entire window.
         */
        setArea: function (view) {
          var width = this.getViewWidth(view),
              height = this.getViewHeight(view),
              offset = this.getOffset(view);

          view.width = width;
          view.height = height;
          view.canvas.width = width;
          view.canvas.height = height;
          view.offset = offset;

        },

        /**
         * Get the inner width of the window.
         */
        getViewWidth: function (view) {
          return view.context.window.innerWidth;
        },

        /**
         * Get the inner height of the window.
         */
        getViewHeight: function (view) {
          return view.context.window.innerHeight;
        },

        getOffset: function (view) {

          var offset = vegas.utils.offset(view.canvas);

          var offsetXy = {
            x: offset.left,
            y: offset.top
          };

          return offsetXy;
        },

        /**
         * Gets the current active window.
         */
        getCurrentWindow: function () {
          return global; // @TODO:fake
        },

        open: function () {
          
        },

        close: function (view) {
          view = view || session.activeView;
          view.close();
        },

        api: [
          this.open,
          this.close
        ]

      };

      vegas.init.register(view);

      return view;

    }());

  /**
   * @class Views
   * @memberOf vegas
   * @extends vegas.utils.ObjectCollection (An Array with extra methods)
   *
   * @description An object, that when instantiated will provide a listing of
   * View objects with methods to work with them.
   */
  vegas.Views = function () {
    utils.makeObject(this, arguments, utils.ObjectCollection);
  };

  vegas.Views.prototype = {

  };

  // Creates an instance of the Views collection for keeping track of views.
  vegas.views = new vegas.Views();

  vegas.module.register('view.js');

}());