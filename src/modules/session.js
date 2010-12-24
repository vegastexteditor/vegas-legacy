(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * @namespace vegas.session
     * @description A session contains all information in memory needed, views,
     * buffers, etc.
     */
    vegas.session = (function () {

      var session = {
        /** @lends vegas.session */
        state: {}, // This is where all session information is stored

        init: function () {
          this.createSession();
        },

        createSession: function () {

            var editArea1 = new vegas.EditArea({
              name: 'Edit Area 2'
            });

            var editArea2 = new vegas.EditArea({
              name: 'Edit Area 2'
            });

            var editorRegion = new vegas.Region({
              width: '100%',
              height: '100%',
              x: 0,
              y: 0,
              contents: [editArea1, editArea2]
            });

            var commandRegion = new vegas.CommandBar({
              width: '100%',
              height: '25',
              x: 0,
              y: 0
            });

            var primaryView = new vegas.View({
              primary: true,
              context: vegas.view.getCurrentWindow(),
              regionList: [editorRegion, commandRegion]
            });

            var views = [primaryView];

            this.state = {
              activeView: views[0],
              activeRegion: editorRegion,
              views: views
            }
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

      vegas.init.register(session);

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
