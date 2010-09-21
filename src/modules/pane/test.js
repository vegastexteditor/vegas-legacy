(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    vegas.pane = (function () {

      var pane = {

        init: function () {
          this.startTest();
        },

        startTest: function () {

        },

        tests: {

          /**
           * Creates an empty session consisting of bare bones structure:
           */

          /**
           * __________________________________________________________________
           * |          [pane1]               |           [pane4]              |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |   [pane4]   |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |___[pane2]___|     [pane3]      |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |   [pane5]   |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |             |                  |                                |
           * |_____________|__________________|________________________________|
           *
           */
          createSimpleSession: function () {

            var editArea = new vegas.EditArea({

            });

            var tab1 = new vegas.Tab({
              component: editArea
            });

            var tab2 = new vegas.Tab({
              component: editArea
            });

            var hintPane = new vegas.Pane({
              tabs:[tab1, tab2],
              name: 'hintPane'
            });

            var navPane = new vegas.Pane({
              tabs:[tab1, tab2],
              name: 'navPane'
            });

            var editorPaneLeft = new vegas.Pane({
              tabs:[tab1, tab2],
              name: 'editorPaneLeft'
            });

            var editorPane2 = new vegas.Pane({
              tabs:[tab1, tab2],
              name: 'editorPane2'
            });

            var editorPane3 = new vegas.Pane({
              tabs:[tab1, tab2],
              name: 'editorPane3'
            });

            var editorPaneRight = new vegas.Pane({
              type: 'horizontal',
              height: 250,
              panes:[editorPane2, editorPane3],
              name: 'editorPaneRight'
            });

            var editorPane = new vegas.Pane({
              type: 'vertical',
              width: 240,
              panes:[editorPaneLeft, editorPaneRight],
              name: 'editorPane'
            });

            var leftPane = new vegas.Pane({
              type: 'horizontal',
              height: 260,
              panes:[navPane, hintPane],
              name: 'leftPane'
            });

            var primaryPane = new vegas.Pane({
              type: 'vertical',
              width: 230,
              panes:[leftPane, editorPane],
              name: 'primaryPane'
            });

            var commandBar = new vegas.Pane({
              tabs:[tab1, tab2],
              name: 'commandBar'
            });

            var basePane = new vegas.Pane({
              type: 'horizontal',
              height: 500,
              panes:[primaryPane, commandBar],
              name: 'basePane'
            });

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




        }

      };

      pane.init();

      return pane;

    }());

  vegas.module.register('pane_test.js');

}());
