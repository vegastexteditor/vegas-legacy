(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas,
      utils = vegas.utils;

    /**
     * @class Tab
     * @memberOf vegas
     * @description A group of Components inside of a single panes, can be
     * visualized in (but is not limited to) the traditional tab form.
     *
     * Notes on the tabs them selfs:
     * 
     * Tabs could be implimented in multiple ways, one as tabs in the canvas
     * its self.
     * 
     * or as Markup, I think that having canvas and markup implimentations is 
     * important. But if I where to choose one it would definately be in markup
     *
     * <nav>
     *   <a href="#tab1">Tab 1</a>
     *   <a href="#tab1">Tab 2</a>
     *   <a href="#tab1">Tab 3</a>
     *   <a href="#tab1">Tab 4</a>
     * </nav>
     *
     */
    vegas.Tab = (function () {

      var Tab = function (data) {
        vegas.utils.makeObject(this, arguments);
        this.entity = 'Tab';
        this.type = 'Tab';
      };

      Tab.prototype = {
        /** @lends vegas.Tab */
        init: function (data) {
          this.component = data.component || null;
        },
        
        remove: function () {

        },

        moveTo: function (pane) {

        },

        /**
         * Gets the window that the tab exists in
         *
         * @return Object of Window
         *
         */
        getWindow: function () {

        },

        /**
         * Gets the pane that the tab exists in
         *
         * @return Object of Pane
         *
         */
        getPane: function () {

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.remove,
          this.moveTo,
          this.getWindow,
          this.getPane
        ]

      };

      return Tab;

    }());

    vegas.tab = (function () {

      var tab = {
        init: function () {
          this.attachEvents();
        },

        attachEvents: function () {
          this.attachTabDragEvent();
          this.attachTabCloseEvent();
        },
        
        getTabTargetAreas: function () {
          
          var targetAreas = [],
              targetArea,
              regionPane,
              regionPaneOffset;
          
          var regionPanes = jQuery('.regionPane');
          var targetPadding = 10;

          for (var i = 0; i < regionPanes.length; i++) {
            regionPane = jQuery(regionPanes[i]);
            regionPaneOffset = regionPane.offset();
            
            targetArea = {
              top: regionPaneOffset.top - targetPadding,
              bottom: regionPaneOffset.top + regionPane.outerHeight(true) + targetPadding,
              left: regionPaneOffset.left - targetPadding,
              right: regionPaneOffset.left + regionPane.outerWidth(true) + targetPadding,
              element: regionPane
            };
            
            targetAreas.push(targetArea);

          }
          
          return targetAreas;
          
        },
        
        getOffsets: function (element) {
            var tabs = element.parents('.tabs').find('.tab'),
                tabOffset;

            var aTab = tabs.first(),
                width = aTab.outerWidth(),
                elements = [],
                offsets = [];

            for (var i = 0; i < tabs.length; i++) {
                tabOffset = jQuery(tabs[i]).offset();
                offsets.push([tabOffset.left, tabOffset.left + width, Math.floor(tabOffset.left + (width) / 2)]);
                elements.push(tabs[i]);
            }
            return {offsets: offsets, elements: elements};
        },

        adjustOffsets: function () {
          
        },
        
        attachTabDragEvent: function () {
          
          jQuery(document).bind('mousedown', function (eDown) {
            
            
          });
          
        },

        attachTabDragEventOld: function () {
          
          var self = this;

          jQuery(document).bind('mousedown', function (eDown) {

            var dragStarted = false;

            var tabElement = jQuery(eDown.target);
            var tabContainer = tabElement.parents('.tabs');
            var tabElementWidth = tabElement.outerWidth();
            var tabElementOffset = tabElement.offset();
            
            var datshiot = self.getOffsets(tabElement);
            
            var offsets = datshiot.offsets;
            var offsetsElements =  datshiot.elements;

            var offsetLeft = eDown.clientX - tabElementOffset.left;
            var offsetTop = eDown.clientY - tabElementOffset.top;

            var isPartOfTabElement = false;

            if (tabElement.hasClass('tab-title')) {
              tabElement = tabElement.parent();
              isPartOfTabElement = true;
            }

            if (tabElement.hasClass('tab')) {
              isPartOfTabElement = true;
            }

            if (!isPartOfTabElement) {
              return false;
            }

            var ghostElement = tabElement.clone();
            var ghostElementStyle = ghostElement[0].style;

            var mode = 'horizontal';
            
            if (mode == 'horizontal') {
              ghostElementStyle.top = tabElementOffset.top + 'px';
            }

            var dragX,
                lastDropPosition;
                
                
            var eDragStop = function () {
              
            };

            var drag = function (eDrag) {

              dragX = eDrag.clientX;

              // This is only ran once, at the beginning when the dragging starts
              if (!dragStarted) {
                // Create a ghost element
                jQuery(document.body).prepend(ghostElement);
                ghostElement.css({position: 'absolute', zIndex: 1});
                // and remove the current element
                tabElement.remove();
                // and remember that we already started, so that this routine can only run once
                dragStarted = true;
              }

              // While Dragging
              if (mode == 'horizontal') {
                ghostElementStyle.left = (dragX - offsetLeft) + 'px';
              }
              
              var tabElementMousedOver = false,
                  offsetx,
                  middleOfTabMousedOver;
              
              // Loop through the tab positions and find out which one we are at.
              for (var i = 0; i < offsets.length; i++) {
                offsetx = offsets[i];

                if (dragX > offsetx[0] && dragX < offsetx[1]) {
                  if (offsetsElements[i].id !== tabElement.attr('id')) { // Not counting the tab position that we are currently at.
                    tabElementMousedOver = offsetsElements[i];
                    middleOfTabMousedOver = offsetx[2];
                    break;
                  }
                }

              }

              if (tabElementMousedOver) {

                var dropPosition;

                if (eDrag.clientX <= middleOfTabMousedOver) {
                  dropPosition = i; 
                }
                else {
                  dropPosition = i + 1;
                }

                // At a new tab position (different than the last)
                if (lastDropPosition !== dropPosition) {
                  
                  tabContainer.find('.spacer').animate({width:1}, 750, function () {
                    jQuery(this).remove();
                  });

                  jQuery(offsetsElements[dropPosition - 1]).after('<div class="tab spacer" style="width:0;"></div>');

                  tabContainer.find('.spacer').animate({width:tabElementWidth}, 750);

                  // remember our position so we can determine a position change
                  lastDropPosition = dropPosition;

                  // offsets = self.getOffsets(offsetsElements[dropPosition - 1]).offsets;

                }

                
              }


            };

            jQuery(document).bind('mousemove', drag);

            jQuery(document).bind('mouseup', function dragStop(eDragStop) {
              // when the dragging stops
              tabContainer.find('.spacer').replace(ghostElementStyle);
              

              jQuery(document).unbind('mousemove', drag);
              jQuery(document).unbind('mouseup', dragStop);
            });

          });



        },

        attachTabCloseEvent: function () {

          jQuery(document).bind('click', function (e) {
            var target = jQuery(e.target);

            if (target.parent().hasClass('tab') && target.hasClass('close')) {
              var componentObject = target.parent().data('object');
              componentObject.close();
            }

          });

        }
      };

      vegas.init.register(tab);

      return tab;

    }());

  /**
   * @class Tabs
   * @memberOf vegas
   * @extends vegas.utils.ObjectCollection (An Array with extra methods)
   *
   * @description An object, that when instantiated will provide a listing of
   * Window objects with methods to work with them.
   */
  vegas.Tabs = function () {
    utils.makeObject(this, arguments, utils.ObjectCollection);
  };

  vegas.Tabs.prototype = {

    /**
     * Simple abstraction that when a hook is triggered, checks if its of the
     * object type "tab", if so it will run the hook callback.
     */
    hook: function (type, callback) {

      vegas.hook(type, function (e) {

        var tab = getElementObject(e.target, 'tab');

        if (tab) {
          callback(tab, e);
        }

      });

    }

  };

  // Creates an instance of the Tabs collection for keeping track of tabs.
  vegas.tabs = new vegas.Tabs();

  vegas.module.register('tab.js');

}());
