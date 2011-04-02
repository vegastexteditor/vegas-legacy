/**
 * @fileOverview Contains basic functionality for stretching the application
 * layout. regions, scrollbars, tabs, etc.
 */
 alert('test');
(function (global) {

  var vegas = global.vegas,
      utils = vegas.utils,
      options = vegas.settings.layoutManager || {};

    vegas.layoutManager = (function(){

      var layoutManager = {
        /** @lends vegas.layoutManager */
        init: function () {

          var self = this;

          utils.onReady(function () {
            self.attachEvents();
            self.insertPaneGrips();
            self.initTabs();
            vegas.trigger('reflow');
          });

        },

        attachEvents: function () {

          var self = this;

          vegas.on('reflow', function () {
            self.fitRegionsDirectlyAboveBottomRegion();
            self.fitRegions();
            self.fitPaneGrips();
          })

          utils.bind(document, 'dragstart', function (e) {
            e.preventDefault();
          });

          this.attachEventsPaneResizing();

        },

        /**
         * From the body class, remove any classname that has a "cursor-" prefix
         */
        removeCursors: function () {
          var className = document.body.className;
          var newClassName = [];

          className.split(' ').forEach(function (aClass) {
            if (aClass.indexOf('cursor-') === -1) {
              newClassName.push(aClass);
            }
          });

          document.body.className = newClassName.join(' ');

        },

        /**
         * Adds a cursor class to the body className, the argument passed in or
         * cursor name will have a "cursor-" prepended to it, used for easy removal.
         * Also, if a cursor class is already in the body className, it is removed.
         */
        useCursor: function (cursorName) {
          this.removeCursors();
          jQuery(document.body).addClass('cursor-' + cursorName);
        },

        /**
         * Attaches drag related events for the regions (the resize bars)
         */
        attachEventsPaneResizing: function () {

          var self = this;

          utils.bind(document, 'mousedown.grip', function (e) {

            // Make sure its a grip
            if (e.target.className.indexOf('grip') !== -1) {

              var grip = jQuery(e.target), // get the grip
                  gripGhost = grip.clone(), // make a copy
                  inserted = document.body.appendChild(gripGhost[0]), // and append it to the end of the document
                  startX = e.clientX,  // store this for later (when calculating the resize on mouse up)
                  startY = e.clientY;

              var parent = grip.parent().parent();
              var regions = parent.find('.region');
              var firstRegion = regions.eq(0);
              var secondRegion = regions.eq(1);
              var paneType = (firstRegion.offset().left !== secondRegion.offset().left) ? 'vertical' : 'horizontal';

              self.lastMousePos = 0;

              self.useCursor('grip')

              // move the ghost grip at the position of the cursor (drag)
              utils.bind(document, 'mousemove.grip', function (e) {


                console.log(paneType);

                if (paneType == "vertical") {

                  var leftConstraint = firstRegion.offset().left + options.maxPaneWidth;
                  var rightConstraint = firstRegion.offset().left + parent.width() - options.maxPaneWidth;

                  if (e.clientX > leftConstraint && e.clientX < rightConstraint) {
                    jQuery(inserted).css('left', e.clientX + 'px');
                    self.lastMousePos = e.clientX;
                  }

                }

                if (paneType == "horizontal") {

                  var topConstraint = firstRegion.offset().top + options.maxPaneHeight;
                  var bottomConstraint = firstRegion.offset().top + parent.height() - options.maxPaneHeight;

                  if (e.clientY > topConstraint && e.clientY < bottomConstraint) {
                    jQuery(inserted).css('top', e.clientY + 'px');
                    self.lastMousePos = e.clientY;
                  }

                }


              });

              // When the mouse goes up
              utils.bind(document, 'mouseup.grip', function (e) {

                var adjusted, // the difference in size.
                    region;

                if (paneType == "vertical") {
                  adjusted = self.lastMousePos - startX;
                  region = grip.parent();

                  var oldWidth = grip.parent().width(),
                      newWidth = oldWidth + adjusted;

                  self.useCursor('default');

                  // resize the region to the new width;
                  region.css('width', newWidth + 'px');

                }

                if (paneType == "horizontal") {

                  adjusted = self.lastMousePos - startY;
                  region = grip.parent();

                  var oldHeight = grip.parent().height(),
                      newHeight = oldHeight + adjusted;

                  self.useCursor('default');

                  // resize the region to the new width;
                  region.css('height', newHeight + 'px');

                }


                jQuery(inserted).remove(); // remove the ghost grip

                self.resizeSiblingPaneOfRegion(region);

                // trigger the applications reflow
                vegas.trigger('reflow');

                // Unbind the move and mouseup events, to prevent multiple attachments
                utils.unbind(document, 'mousemove.grip');
                utils.unbind(document, 'mouseup.grip');

              });

            }

          });
        },

        resizeSiblingPaneOfRegion: function (region) {

          region = jQuery(region);

          var regionWidth = region.width();

          var sibling = jQuery(region).next();

          var parent = sibling.parent();


          var minPaneHeight = options.maxPaneWidth;
          var minPaneWidth = options.maxPaneWidth;

          console.log(region, regionWidth, sibling.width());

          sibling.width(parent.width() - regionWidth)

          sibling.css('left', region.width());

        },

        fitPaneGrips: function () {

          var edgeRightGrips = jQuery('.edge-right-grip'),
              edgeBottomGrips = jQuery('.edge-bottom-grip'),
              edgeRightGrip,
              edgeBottomGrip,
              regionWidth,
              regionHeight;

          for (var i = 0; i < edgeRightGrips.length; i++) {
            edgeRightGrip = jQuery(edgeRightGrips[i]);

            regionHeight = edgeRightGrip.parents('.region:first').height();

            edgeRightGrip.height(regionHeight);

          }

          for (var i = 0; i < edgeBottomGrips.length; i++) {
            edgeBottomGrip = jQuery(edgeBottomGrips[i]);

            regionWidth = edgeBottomGrip.parents('.region:first').width();

            edgeBottomGrip.width(regionWidth);

          }

        },


        insertPaneGrips: function () {

          var edgeRights = utils.querySelector('.edge-right'),
              edgeBottoms = utils.querySelector('.edge-bottom'),
              edgeBottom,
              edgeRight,
              grip;

          for (var i = 0; i < edgeRights.length; i++) {
            edgeRight = edgeRights[i];
            grip = document.createElement('div');
            grip.className = 'edge-right-grip';
            edgeRight.appendChild(grip);
          }

          for (var i = 0; i < edgeBottoms.length; i++) {
            edgeBottom = edgeBottoms[i];
            grip = document.createElement('div');
            grip.className = 'edge-bottom-grip';
            edgeBottom.appendChild(grip);
          }

        },


        fitRegions: function () {

          var getElementRect = function (element) {

            var offset = element.offset();

            return {
              width: element.width(),
              height: element.height(),
              x: offset.top,
              y: offset.left
            };

          };

          var minPaneHeight = options.maxPaneWidth;
          var minPaneWidth = options.maxPaneWidth;

          jQuery('.region').each(function (i, element) {

            var firstRegion = jQuery(element),
              secondRegion = firstRegion.next('.region');

            if (firstRegion.hasClass('region-container')) {
              return true;
            }

            if (firstRegion.length == 1 && secondRegion.length == 1) {

              var paneType = (firstRegion.offset().left !== secondRegion.offset().left) ? 'vertical' : 'horizontal',
                  parent = firstRegion.parent(),
                  parentRect = getElementRect(parent),
                  firstRegionRect = getElementRect(firstRegion),
                  secondRegionRect = getElementRect(firstRegion),
                  firstComponents = firstRegion.find('.component'),
                  secondComponents = secondRegion.find('.component'),
                  secondWidth,
                  secondHeight;

              // Ensure the pane panes have the minimum dimensions
//              if (firstRegionRect.height < minPaneHeight) {firstRegion.height(minPaneHeight);}
//              if (firstRegionRect.width < minPaneWidth) {firstRegion.width(minPaneWidth);}
//              if (secondRegionRect.height < minPaneHeight) {secondRegion.height(minPaneHeight);}
//              if (secondRegionRect.width < minPaneWidth) {secondRegion.width(minPaneWidth);}

              console.log('paneType1', paneType);

              if (paneType === 'vertical') {

                secondWidth = parentRect.width - firstRegionRect.width;
                secondHeight = parentRect.width;

                secondRegion.width(secondWidth);
                secondRegion.height(secondHeight);

              }

              if (paneType === "horizontal") {

                firstRegion.width(parentRect.width);

                secondWidth = parentRect.width;
                secondHeight = parentRect.height - firstRegionRect.height;

                secondRegion.width(secondWidth);
                secondRegion.height(secondHeight);

              }

              firstComponents.width(firstRegionRect.width);
              firstComponents.height(firstRegionRect.height);
              secondComponents.width(secondWidth);
              secondComponents.height(secondHeight);

            }

          });

        },

        initTabs: function () {

          var regions = utils.querySelector('.region'),
              region,
              tabs,
              components,
              isActiveTab,
              activeTabIndex;

          for (var i = 0; i < regions.length; i++) {
            region = regions[i];
            tabs = utils.querySelector('.tab', region);
            components = utils.querySelector('.component', region);

            for (var j = 0; j < tabs.length; j++) {
              isActiveTab = utils.hasClass(tabs[j], 'active');

              if (isActiveTab) {
                activeTabIndex = j;
              }

            }

            utils.addClass(components[activeTabIndex], 'active');

          }

        },

        /**
         * 
         * @todo: remove silly abstractions
         */
        fitRegionsDirectlyAboveBottomRegion: function () {
          var bottomHeight = utils.elementHeight(this.getBottomRegion());

          var desiredHeight = window.innerHeight - bottomHeight;

          var regions = utils.elementSiblings(this.getBottomRegion());

          for (var i = 0; i < regions.length; i++) {
            utils.css(regions[i], 'height', desiredHeight + 'px');
          }

        },

        getLeftRegion: function () {
          return utils.querySelector('.region-left')[0] || false;
        },

        getRightRegion: function () {
          return utils.querySelector('.region-right')[0] || false;
        },

        getBottomRegion: function () {
          return utils.querySelector('.region-bottom')[0] || false;
        },

        getTopRegion: function () {
          return utils.querySelector('.region-top')[0] || false;
        },

        getPrimaryRegion: function () {
          return utils.querySelector('.region-primary')[0] || false;
        }

      };

      vegas.init.register(layoutManager);

      return layoutManager;

    }());

  vegas.module.register('layoutManager.js');

})(this);
