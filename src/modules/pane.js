(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * A group of Components inside of a single panes, can be visualized in (but
     * is not limited to) the traditional pane form.
     */
    vegas.Pane = (function (data) {

      var Pane = function () {
        vegas.utils.makeObject(this, arguments);
      };

      Pane.prototype = {

        init: function (data) {
          // Take in properties passed in to data object.
          vegas.utils.extend(this, data);

        },

        remove: function () {

        },

        moveTo: function (position) {

        },

        /**
         * Gets the window that the pane exists in
         *
         * @return Object of Window
         *
         */
        getWindow: function () {
          return window;
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

      return Pane;

    }());


    /**
     * A session contains all information in memory needed, views, buffers, etc.
     */
    vegas.pane = (function () {

      var pane = {

        init: function () {
        },

        attachEvents: function () {
        },

        paint: function (view) {
          var panes = vegas.pane.getPaneList(view),
              ctx = view.ctx,
              pane,
              percent,
              width,
              height,
              lastWidth = 0,
              lastHeight = 0;

          for (var i = 0; i < panes.length; i++) {
            pane = panes[i];

            ctx.fillStyle = 'rgb('+Math.floor(Math.random(0,1) * 255)+','+Math.floor(Math.random(0,1) * 255)+','+Math.floor(Math.random(0,1) * 255)+')';

            if (pane.type === 'vertical') {

              percent = pane.width.split('%')[0] * 1;

              width = Math.floor((percent / 100) * view.width);

              ctx.fillRect(lastWidth, 0, width, view.height)

              lastWidth += width;

            }
            else{

              percent = pane.height.split('%')[0] * 1;

              height = Math.floor((percent / 100) * view.height);

              ctx.fillRect(0, lastHeight, width, view.height)

              lastHeight += height;

            }

          }
        },

        /**
         * Recursively loop through a view to get a list of panes sorted by
         * the depth that their in (first layer of depth first).
         *
         * This should be !cached@TODO:important! and then used in the paint
         * function, (make this setPaneList?) and have a getter that sets if
         * it doesn't exist. and is re-set on window resize and insertion of new
         * panes.
         *
         */
        getPaneList: function (view) {

          // Default to the acitveView unlles otherwise specified.
          var panesRoot = view.panes || vegas.session.state.activeView.panes;

          // Recursive function that gets all panes in the view and determines
          // and sets the pane depth to the pane object.
          var recursePaneList = function (panes, paneList, depth) {

            var depth = depth || 0,
                paneList = paneList || [],
                sortPaneListByDepth;

            for (var i = 0; i < panes.length; i++) {

              panes[i].depth = depth;
              paneList.push(panes[i]);

              if (panes[i].panes) {
                recursePaneList(panes[i].panes, paneList, depth + 1);
              }

            }

            return paneList;

          };

          return recursePaneList(panesRoot);

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.close,
        ]

      };

      pane.init();

      return pane;

    }());



  vegas.module.register('pane.js');

}());
