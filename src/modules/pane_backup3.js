(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /*
     * A container for Tabs. When there is only one pane, a pane takes up the
     * entire window. Panes can be singular or can come in infinate
     * multidimensional sets. When in sets the sequence of panes must be vertical
     * or horizontal. Which allows for a "split view" of the editors Components.
     *
     * Fore example: There can be a view that contains two vertical panes.
     * The first of the two would contain two vertical panes. The first of the
     * two vertical panes could contain two vertical panes, and so on.
     *
     */
    vegas.Pane = (function (data) {

      var Pane = function () {
        vegas.utils.makeObject(this, arguments);
        this.entity = 'Pane';
      };

      Pane.prototype = {

        init: function (data) {
          // Take in properties passed in to data object.
          vegas.utils.extend(this, data);

        },
        /**
         * Remove the pane from its current location(s).
         */
        remove: function () {

        },

        /**
         * Resize a pane, wether its horizontal or vertical to the specified
         * position (in pixels). If the pane set (the two panes that are connected
         * to eachother) is horizontal the position will be the height of the
         * first pane in the pane set, and if the pane set is vertical the
         * position will be the width of the first pane in the pane set.
         */
        resizePaneTo: function (position) {

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

    vegas.pane = (function () {

      var pane = {

        init: function () {

          var self = this;

          window.onload = function() {
            self.attachEvents(self);
          };

        },

        attachEvents: function (self) {

          // var onMouseDownInArea = vegas.utils.onMouseDownInArea;
//          var vegas = global.vegas;
//
//          var panes = vegas.session.state.activeView.paneList;
//
//          var view = vegas.session.state.activeView;
//
//          for (var i = 0; i < panes.length; i++) {
//            pane = panes[i];
//
//            (function(pane) {
//
//            if (pane.handle) {
//              vegas.utils.onMouseDownInArea(view, pane.handle.area, function (e) {
//
//                jQuery(view.context).bind('mousemove', function (e) {
//
//                  if (pane.type == 'horizontal') {
//                    pane.height = e.clientY + '';
//                    self.setPaneListInfo(view);
//                    self.paint();
//                  }
//
//                });
//
//                jQuery(view.context).bind('mouseup', function (e) {
//                  jQuery(view.context).unbind('mousemove');
//                });
//
//              });
//            }
//
//            }(pane));
//
//          }

        },

        paint: function (view) {

          view = view || vegas.session.state.activeView;

          var panes = vegas.pane.getPaneListInfo(view),
              ctx = view.ctx,
              paneArea,
              paneBackgroundColor,
              pane;

          for (var i = 0; i < panes.length; i++) {

            pane = panes[i];
            paneArea = pane.area;

            if (typeof(pane.tabs) == 'undefined') {
              continue;
            }

            if (paneArea.width < 5){
              paneArea.width = 5;
            }

            if (paneArea.height < 5) {
              paneArea.height = 5;
            }

            if (vegas.options.debug.panes) {
              // @debug: Draw pane info
              var offset = 5 * i;
              var tmp = ctx.fillStyle;
              ctx.fillStyle = 'rgb(0,0,0)';
              ctx.fillText('Name:' + pane.name, paneArea.x + offset, paneArea.y + offset);
              ctx.fillText('width:' + pane.area.width, paneArea.x + offset, paneArea.y + offset + 25);
              ctx.fillText('height:' + pane.area.height, paneArea.x + offset, paneArea.y + offset + 50);
              ctx.fillText('x:' + pane.area.x, paneArea.x + offset, paneArea.y + offset + 75);
              ctx.fillText('y:' + pane.area.y, paneArea.x + offset, paneArea.y + offset + 100);
              ctx.fillStyle = tmp;

              // @debug: Randomize the pane position with a offset range of 5
              paneArea.x += Math.floor(Math.random(0,10) * 10);
              paneArea.y += Math.floor(Math.random(0,10) * 10);

              // @debug randomize the color of the panes
              paneBackgroundColor = 'rgba('+Math.floor(Math.random(0,1) * 255)+','+Math.floor(Math.random(0,1) * 255)+','+Math.floor(Math.random(0,1) * 255)+',.5)';

            }

            paneBackgroundColor = vegas.options.panes.backgroundColor;

            ctx.fillStyle = paneBackgroundColor;

            // Draw the pane background
            ctx.fillRect(
              paneArea.x,
              paneArea.y,
              paneArea.width,
              paneArea.height
            );

//          // Testing
//          ctx.fillStyle = 'rgba('+Math.floor(Math.random(0,1) * 255)+','+Math.floor(Math.random(0,1) * 255)+','+Math.floor(Math.random(0,1) * 255)+', 0.5)';
//
//            if (typeof(pane.handle) !== 'undefined') {
//
//              paneHandleArea = pane.handle.area,
//
//              // console.log(paneHandleArea);
//
//              // Draw the pane background
//              ctx.fillRect(
//                paneHandleArea.x,
//                paneHandleArea.y,
//                paneHandleArea.width,
//                paneHandleArea.height
//              );
//
//            }
          }
        },


        getPaneListInfo: function (view) {

          // Default to the acitveView unlles otherwise specified.
          view = view || vegas.session.state.activeView;

          // If there is no pane list, then create one and then get it.
          if (typeof(view.paneList) === 'undefined') { // !vegas.utils.isArray(view.paneList)
            this.setPaneListInfo(view);
          }

          return view.paneList;

        },

        /**
         * Recursively loop through a View to get a list of panes, with any
         * preprocessing steps necissary before rendering, once we have a list
         * of all panes, cache the result into the pain singleton. For retreival
         * via the getPaneList function, mostly for drawing.
         *
         * Any actions performed on a pane that affects the preprocess functions
         * should re-set the pane list, e.i. Resize a window, and insertion and
         * resizing of panes.
         *
         * - We are basically getting the information needed to paint this:
         *
         * ____________________________[basePane]____________________________
         * |           [leftPane]           |          [rightPane]           |
         * |                                |                                |
         * |                                |                                |
         * |                                |                                |
         * |                                |                                |
         * |          [topLeftPane]         |                                |
         * |                                |                                |
         * |                                |                                |
         * |                                |                                |
         * |                                |                                |
         * |________________________________|                                |
         * |                                |                                |
         * |                                |                                |
         * |                                |                                |
         * |                                |                                |
         * |       [bottomLeftPane]         |                                |
         * |                                |                                |
         * |                                |                                |
         * |                                |                                |
         * |                                |                                |
         * |________________________________|________________________________|
         *
         *
         * - To get more of an idea on how the panes objec structure should look
         *   like see the validatePaneStructure function.
         *
         *  The example above's object structure looks like this:
         *
         * View(objectInstance).paneTree = Pane(ObjectInstance){
         *   type: 'vertical', // There
         *
         *   width: '50%',     // or an integer for example if the screen was 800
         *                     // pixels wide this could be 375 which means the
         *                     // left pane will be 375 pixels wide and then the
         *                     // right pane will take up the additional space
         *                     // e.g 425 pixels. So the width specified for a
         *                     // set of two panes is technically the width of the
         *                     // first pane, and the second pane will take up the
         *                     // rest of the space available.
         *
         *
         *   // Notice that all the 'panes:' properties below can only have
         *   // an array of two Panes. No less, no more. When you only need to
         *   // render one pane (for example just one big pane to the screen)
         *   // the Pane object will not have any panes: but use tabs: instead.
         *
         *   panes: [
         *
         *      Pane(ObjectInstance){
         *
         *        type: 'horizontal',
         *        height: '50%',
         *        panes: [
         *
         *          Pane(ObjectInstance){
         *            tabs: [Tab(ObjectInstance)] // no more panes, render whats in the tab.
         *          },
         *
         *          Pane(ObjectInstance){
         *            tabs: [Tab(ObjectInstance)] // no more panes, render whats in the tab.
         *          },
         *
         *        ]
         *
         *      },
         *
         *      Pane(ObjectInstance){
         *        tabs: [Tab(ObjectInstance)]
         *      }
         *
         *   ]
         *
         * }
         *
         * The desired result will be:
         * [
         *  Pane(ObjectInstance){
         *    area: {x,y,width,height}
         *  },
         *  Pane(ObjectInstance){
         *    area: {x,y,width,height}
         *  },
         *  Pane(ObjectInstance){
         *    area: {x,y,width,height}
         *  },
         *  Pane(ObjectInstance){
         *    area: {x,y,width,height}
         *  },
         * ]
         *
         *
         */
        setPaneListInfo: function (view) {

          view = view || vegas.session.state.activeView;

          // Default to the acitveView unlles otherwise specified.
          var paneTree = view.paneTree,
              self = this,
              paneList = [],
              width,
              height,
              percent,
              utils = vegas.utils;

          /**
            * Recursive function that gets all panes attempts to recieve a one
            * dimensional array of panes with all pane information preprocessed
            * for the paint function to loop through quickly and avaialble for
            * other functions for to reference any additional preprocessed
            * information that may be useful during runtime but should not be
            * processed all the time, but should only be re-processed on
            * important events e.i. Resize a window, and insertion and resizing
           * of panes.
           */
          var recursePaneList = function (pane, paneList, parent, depth) {

            var panes = pane.panes,
                paneList = paneList || [],
                parent = parent || false,
                depth = depth || 0,
                relativeWidth,
                relativeHeight,
                firstPane,
                secondPane,
                firstPaneWidth,
                secondPaneWidth,
                firstPaneHeight,
                secondPaneHeight,
                spacing = 8;

            pane.parent = parent;
            pane.depth = depth;

            // This is the root pane
            if (!parent) {

              // The root pane contains a set of two panes
              if (panes) {

                // Set the root area (entire view)
                pane.area = {};
                pane.area.x = 0;
                pane.area.y = 0;
                pane.area.width = view.width;
                pane.area.height = view.height;

                // Now set the root's panes area.

                firstPane = panes[0];
                secondPane = panes[1];

                relativeHeight = view.height;

                if (pane.type == 'vertical') {

                  width = pane.width * 1;

                  firstPane.area = secondPane.area = {};

                  // First pane in sequence's area
                  firstPane.area.x = 0;
                  firstPane.area.y = 0;
                  firstPane.area.width = width;
                  firstPane.area.height = view.height;
                  firstPane.position = 1;

                  // second pane in sequence's area
                  secondPane.area.x = width;
                  secondPane.area.y = 0;
                  secondPane.area.width = secondPaneWidth;
                  secondPane.area.height = view.height;
                  secondPane.position = 2;

                }

                if (pane.type == 'horizontal') {

                  // If the specified width is a percentage, turn it into a pixel
                  // value in relatition to the viewports width.
                  if (utils.isPercentage(pane.height)) {
                    firstPaneHeight = utils.getPercentValue(pane.height, relativeHeight)
                  }
                  else {
                    firstPaneHeight = pane.height * 1;
                  }

                  secondPaneHeight = relativeHeight - firstPaneHeight;

                  // If specified, instead of setting a height value for to the
                  // first pane, and stretching the second, do the opposite.
                  if (pane.flipStretching) {
                      var firstPaneHeightTmp = secondPaneHeight;
                      firstPaneHeight = secondPaneHeight;
                      secondPaneHeight = firstPaneHeightTmp;
                  }

                  firstPane.area = secondPane.area = {};

                  // First pane in sequence's area
                  firstPane.area.x = 0;
                  firstPane.area.y = 0;
                  firstPane.area.width = view.width;
                  firstPane.area.height = firstPaneHeight;
                  firstPane.position = 1;

                  // second pane in sequence's area
                  secondPane.area.x = 0;
                  secondPane.area.y = firstPaneHeight;
                  secondPane.area.width = view.width;
                  secondPane.area.height = secondPaneHeight;
                  secondPane.position = 2;

                }

              }

            }

            // These panes have parents, (that are not the root pane)
            if (parent) {

              // The pane has more panes
              if (pane.panes) {

                firstPane = pane.panes[0];
                secondPane = pane.panes[1];

                relativeWidth = parent.area.width;
                relativeHeight = parent.area.height;

                var x, y, width, height;

                if (pane.type == 'vertical') {

                  height = parent.area.height;

                  if (parent.type == 'horizontal' && parent.panes) {
                    height = parent.area.height - parent.panes[0].area.height;
                  }

                  if (parent.type == 'vertical') {
                    if (pane.position == 1) {
                      width = pane.width * 1;
                      y = parent.panes[0].area.y;
                    }
                    else if (pane.position == 2) {
                      width =  pane.width * 1 ;
                      y = parent.panes[1].area.y;
                    }
                  }
                  else {
                    width = pane.width * 1;
                    y = pane.area.y;
                  }

                  x = pane.area.x;

                  firstPane.area = secondPane.area = {};

                  // First pane in sequence's area
                  firstPane.area.x = x; // @TODO parent pane is can be a percentage.
                  firstPane.area.y = y;
                  firstPane.area.width = width;
                  firstPane.area.height = height;
                  firstPane.position = 1;

                  // second pane in sequence's area
                  secondPane.area.x = x + firstPaneWidth;
                  secondPane.area.y = y;
                  secondPane.area.width =  pane.area.width - firstPane.area.width;
                  secondPane.area.height = pane.area.height;
                  secondPane.position = 2;


                }

                if (pane.type == 'horizontal') {

                  if (parent.type == 'vertical') {
                    if (pane.position == 1) {
                      x = parent.area.x;
                      y = parent.panes[0].area.y;

                    }
                    else if (pane.position == 2) {
                      x = parent.area.x + parent.panes[0].area.width;
                      y = parent.panes[1].area.y;
                    }
                  }
                  else {
                    y = parent.area.y;
                    x = parent.area.x;
                  }

                  firstPane.area = secondPane.area = {};

                  // First pane in sequence's area
                  firstPane.area.x = x;
                  firstPane.area.y = y;
                  firstPane.area.width = pane.area.width;
                  firstPane.area.height = pane.height * 1;
                  firstPane.position = 1;

                  // second pane in sequence's area
                  secondPane.area.x = x;
                  secondPane.area.y = y + firstPane.area.height;
                  secondPane.area.width = pane.area.width;
                  secondPane.area.height = parent.area.height - pane.height;
                  secondPane.position = 2;

                }


              }

            }

            paneList.push(pane);

            // This pane has more panes, make sure they are added to the array
            // as well.
            if (panes) {
              for (var i = 0; i < panes.length; i++){
                recursePaneList(panes[i], paneList, pane, depth + 1);
              }
            }


            return paneList;

          };


          paneList = recursePaneList(paneTree);



          // console.log ( 'paneList',paneList );
          var pane,
              paneArea;

          var i = paneList.length;

          while (i--) {

            pane = paneList[i];
            paneArea = pane.area;

            if (!pane.panes) {
              paneArea.x -= 5;
              paneArea.y -= 5;
              paneArea.width -= 5;
              paneArea.height -= 5;
            }

          }

          view.paneList = paneList;


        },

        /**
         * Ensures that the pane structure is correct, this really needs to be
         * only ran once at startup when loading a session from an untrusted
         * source, right now this untrusted source is my self, keep on screwing
         * up the structure so its a good sanity check.
         */
        validatePaneStructure: function (panes) {

          var pane,
              utils = vegas.utils;

          for (var i = 0; i < panes.length; i++) {
            pane = panes[i];
            if (pane.entity == 'Pane') { // Ok we know its a pane.

              if(typeof(pane.type) == 'string' && (pane.type == 'horizontal' || pane.type == 'vertical')) {

                if (pane.type == 'horiztonal' && (!utils.isWholeNumber(pane.height) && !utils.isPercentage(pane.height))) {
                  console.error('a horiztonal pane must have a valid height specified', pane);
                  return false;
                }

                if (pane.type == 'vertical' && (!utils.isWholeNumber(pane.width) && !utils.isPercentage(pane.width))) {
                  console.error('a horiztonal pane must have a valid width specified', pane);
                  return false;
                }

              }
              else if (typeof(pane.type) !== 'undefined' && pane.tabs == 'undefined') {
                console.error('a pane type must be specified as either horizontal or vertical', pane.tabs,pane.type);
                return false;
              }

              if (typeof(pane.panes) == 'undefined' && typeof(pane.tabs) == 'undefined') {
                console.error('a pane must either contain more panes or tabs', pane);
                return false;
              }

              return true;

            }
            else {
              console.error('expected object to be a pane instance:', pane);
              return false;
            }
          }

        },

        /**
        *
        */
        movePaneWithHandle: function (e) {
          console.log('move a pane with its handle', e);
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