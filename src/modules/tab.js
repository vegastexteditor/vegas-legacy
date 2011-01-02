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

        attachTabDragEvent: function () {

          jQuery(document).bind('mousedown', function (eDown) {

            var dragStarted = false;

            var tabElement = jQuery(eDown.target);
            var offset = tabElement.offset();

            var offsetLeft = eDown.clientX - offset.left;
            var offsetTop = eDown.clientY - offset.top;

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

            var drag = function (eDrag) {

              var mode = 'horizontal';

              if (!dragStarted) {
                // When the drag Begins
                jQuery(document.body).prepend(ghostElement);
                ghostElement.css({position: 'absolute', zIndex: 1});
                dragStarted = true;
              }

              // While Dragging
              if (mode == 'horizontal') {
                ghostElementStyle.left = (eDrag.clientX - offsetLeft) + 'px';
                ghostElementStyle.top = (eDrag.clientY - offsetTop) + 'px';
              }

            };

            jQuery(document).bind('mousemove', drag);

            jQuery(document).bind('mouseup', function dragStop(eDragStop) {

              // when the dragging stops

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
