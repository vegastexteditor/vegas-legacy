(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * A session contains all information in memory needed, views, buffers, etc.
     */
    vegas.session = (function () {

      var session = {

        state: {}, // This is where all session information is stored

        init: function () {
          this.createFreshSession();
        },

        /**
         * Creates an empty session consisting of bare bones structure:
         *
         * a view, which contains a pane, which contains a tab, which contains
         * an editArea component.
         *
         */
        createFreshSession: function () {

          var editArea = new vegas.EditArea({

          });

          var tab = new vegas.Tab({
            component: editArea
          });

          var pane = new vegas.Pane({
            tabs: [tab]
          });

          var views = [new vegas.View({
              existing: true,
              context: vegas.view.getCurrentWindow(),
              panes: pane,
          })];

          this.state = {views: views}

        },

        /**
         * Closes the current session, by default will save the session
         */
        close: function () {

        },

        /**
         * Saves the session to disk
         */
        save: function () {

        },

        /**
         * Save the session to a specific location on desk
         */
        saveAs: function () {

        },

        /**
         * Restores a session from disk
         */
        restore: function (sessionLocation) {

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.init,
          this.close,
          this.save,
          this.saveAs,
          this.restore
        ]

      };

      session.init();

      return session;

    }());

  vegas.module.register('session.js');

}());

/**

  var session = {

    activeView: session.windows[1],
    activePane: session.activeWindow.panes[0],
    activeTab: session.activePane.tabs[3],
    activeEditAreaPane: null,
    activeBuffer: session.activePane.tabs[3],
    activeEditAreaPane: null,
    windows: [
      {
        panes: [
          {
            tabs: [new EditArea(), componentInstance],
          }
        ]
      },
      {
        panes: [
          [
            {
              tabs: [vegasAreaComponent, vegasAreaComponent, vegasAreaComponent]
            },
            {
              tabs: [vegasAreaComponent]
            }
          ],
        ]
      }
    ],

    buffers: [
      { // bufferInstance
        resource: vegas.resourceList[0],
        name: 'somedocument',
        value: [
          'this is one line of text',
          'this is another line of text',
        ]
      }
    ],


  };

 */


