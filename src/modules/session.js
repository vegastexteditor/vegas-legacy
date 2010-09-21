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
          this.createComplexSession();
        },

        createSession: function () {

            var editArea = new vegas.EditArea({
            });

            var editAreaTab = new vegas.Tab({
              component: editArea
            });

            var editorPane = new vegas.Pane({
              tabs:[editAreaTab],
              name: 'Editor Pane'
            });

            var basePane = new vegas.Pane({
              type: 'horizontal',
              height: 45,
              flipStretching: true, // height is attributed to the second item in the array (the parent stretches).
              noHandle: true,
              panes:[editorPane, editorPane],
              name: 'basePane'
            });

            var views = [new vegas.View({
              primary: true,
              context: vegas.view.getCurrentWindow(),
              paneTree: basePane
            })];

            this.state = {
              activeView: views[0],
              activePane: editorPane,
              views: views
            }
        },


        /**
         *
         * createComplexSession:
         * __________________________________________________________________
         * |             |                        |            |             |
         * |             |           C            |            |             |
         * |             |                        |            |     L       |
         * |             |________________________|            |             |
         * |             |       |   E    |   |   |            |_____________|
         * |      A      |       |________|   |   |            |      |      |
         * |             |       |   F    |   |   |            |      |      |
         * |             |       |________|   |   |            |      |      |
         * |             |       |        |   |   |            |      |      |
         * |_____________|       |        |   |   |            |      |      |
         * |             |       |   G    |   |   |     K      |      |      |
         * |             |   D   |        | I | J |            |      |      |
         * |             |       |        |   |   |            |   M  |  N   |
         * |             |       |________|   |   |            |      |      |
         * |             |       |        |   |   |            |      |      |
         * |      B      |       |        |   |   |            |      |      |
         * |             |       |        |   |   |            |      |      |
         * |             |       |   H    |   |   |            |      |      |
         * |             |       |        |   |   |            |      |      |
         * |             |       |        |   |   |            |      |      |
         * |             |       |        |   |   |            |      |      |
         * |_____________|_______|________|___|___|____________|______|______|
         *
         */
        createComplexSession: function () {

          var editArea = new vegas.EditArea({

          });

          var tab1 = new vegas.Tab({
            component: editArea
          });

          var tab2 = new vegas.Tab({
            component: editArea
          });

          var topMiddlePane = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'topMiddlePane'
          });

          var middleBottomLeftPane = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'middleBottomLeftPane'
          });

          var middleBottomRightLeftTopPane = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'middleBottomRightLeftTopPane'
          });

          var middleBottomRightLeftBottomPane = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'middleBottomRightLeftBottomPane'
          });

          var middleBottomRightLeftPane = new vegas.Pane({
            type: 'horizontal',
            height: 125,
            panes:[middleBottomRightLeftTopPane, middleBottomRightLeftBottomPane],
            name: 'middleBottomRightLeftPane'
          });

          var middleBottomRightRightLeftPane = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'middleBottomRightRightLeftPane'
          });

          var middleBottomRightRightRightPane = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'middleBottomRightRightRightPane'
          });

          var middleBottomRightRightPane = new vegas.Pane({
            type: 'vertical',
            width: 85,
            panes:[middleBottomRightRightLeftPane, middleBottomRightRightRightPane],
            name: 'middleBottomRightRightPane'
          });

          var middleBottomRightPane = new vegas.Pane({
            type: 'vertical',
            width: 150,
            panes:[middleBottomRightLeftPane, middleBottomRightRightPane],
            name: 'middleBottomRightPane'
          });

          var middleBottomPane = new vegas.Pane({
            type: 'vertical',
            width: 150,
            panes:[middleBottomLeftPane, middleBottomRightPane],
            name: 'middleBottomPane'
          });

          var middlePane = new vegas.Pane({
            type: 'horizontal',
            height: 150,
            panes:[topMiddlePane, middleBottomPane],
            name: 'middlePane'
          });

          var rightRightLeft = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'rightRightLeft'
          });

          var rightRightRightTop = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'rightRightRightTop'
          });

          var rightRightRightBottom = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'rightRightRightBottom'
          });

          var rightRightRight = new vegas.Pane({
            type: 'horizontal',
            height: 185,
            panes:[rightRightRightTop, rightRightRightBottom],
            name: 'rightRightRight'
          });

          var rightRightPane = new vegas.Pane({
            type: 'vertical',
            width: 275,
            panes:[rightRightLeft, rightRightRight],
            name: 'rightRightPane'
          });

          var rightPane = new vegas.Pane({
            type: 'vertical',
            width: 500,
            panes:[middlePane, rightRightPane],
            name: 'rightPane'
          });

          var topLeftPane = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'topLeftPane'
          });

          var bottomLeftPane = new vegas.Pane({
            tabs:[tab1, tab2],
            name: 'bottomLeftPane'
          });

          var leftPane = new vegas.Pane({
            type: 'horizontal',
            height: 250,
            panes:[topLeftPane, bottomLeftPane],
            name: 'leftPane'
          });

          var mainPane = new vegas.Pane({
            type: 'vertical',
            width: 250,
            panes:[leftPane, rightPane],
            name: 'mainPane'
          });

          var basePane = new vegas.Pane({
            type: 'horizontal',
            height: 200,
            panes:[mainPane, editArea],
            name: 'basePane'
          });

          basePane = mainPane;

          var views = [new vegas.View({
            primary: true,
            context: vegas.view.getCurrentWindow(),
            paneTree: basePane
          })];

          this.state = {
            activeView: views[0],
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
