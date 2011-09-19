/** @fileOverview Contains Gutter related objects and methods
 *
 * Gutters are seperators for panes, they provide a space in which provides the
 * ability to resize and manage positions of a region pair.
 *
 * @task:FeatureRequest: When resizing panes, currently when resizing a region
 * pair, when you resize to where one of the regions reach its minimum height
 * the resizing stops and you are not allowed to resize past this until you
 * make additional room. It would be ideal that when you resize a region pair
 * and you pass the minimum height for one, room is made by resizing other
 * panes automatically. This is a difficult task.
 */
(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils;

  var GUTTER_SIZE = 5; // @todo: setting
  var REGION_MAX_HEIGHT = 50; // @todo: setting
  var REGION_MAX_WIDTH = 50; // @todo: setting

  /**
   * @class Gutter
   * @memberOf vegas
   * @param {String} orientation Refers to the gutter its self, horizontal means
   * the gutter spans from the left to the right.
   * @description Creates a Gutter that will be drawn to the screen, a gutter
   * is the area that seperates a 'regionPair'. It can be dragged to adjust the
   * size of the two regions.
   */
  vegas.Gutter = function (orientation, regionPair, data) {
    utils.makeObject(this, arguments);
    vegas.utils.extend(this, data);
    this.init.apply(this, arguments);
  };

  /** @lends vegas.Gutter */
  vegas.Gutter.prototype = {

    init: function (orientation, regionPair) {

      this.id = utils.getUniqueId();
      this.orientation = orientation;
      this.regionPair = regionPair;

      // Keep track of all gutters created in the application namespace.
      vegas.gutters.add(this);

      // This resizes each region pair to be split up evenly while accounting
      // for the gutter width... @todo: should this be in RegionPair?
      if (regionPair[0].orientation == 'vertical') {
        var totalWidth = regionPair[0].parent().getElement().width();
        var splitWidth = totalWidth / 2;
        regionPair[0].getElement().width(Math.floor(splitWidth) - GUTTER_SIZE);
        regionPair[1].getElement().width(Math.ceil(splitWidth));
      }

      if (regionPair[0].orientation == 'horizontal') {
        var splitHeight = (regionPair[0].getElement().height() + regionPair[1].getElement().height()) / 2;
        regionPair[0].getElement().height(Math.floor(splitHeight) - Math.ceil(GUTTER_SIZE / 2));
        regionPair[1].getElement().height(Math.ceil(splitHeight) - Math.floor(GUTTER_SIZE / 2));
      }

      // Re-calculate position / width of regions for placement of the gutter.
      var gutterElement;
      if (orientation == 'vertical') {

        var region = regionPair[0].element;
        var gutterTop = region.offset().top;
        var gutterLeft = region.offset().left + region.width();
        var gutterWidth = GUTTER_SIZE;
        var gutterHeight = region.height();

        regionPair[1].getElement().css('margin-left', GUTTER_SIZE);
      }
      else if (orientation == 'horizontal') {

        var region = regionPair[0].element;
        var gutterTop = region.offset().top + region.height();
        var gutterLeft = region.offset().left;
        var gutterWidth = region.width();
        var gutterHeight = GUTTER_SIZE;

        regionPair[1].getElement().css('margin-top', GUTTER_SIZE);
      }
      else {
        console.error('orientation specified is unknown');
        return false;
      }

      // Create the gutter element with the correct dimensions depending on its
      // orientation
      gutterElement = jQuery('<div class="gutter gutter-' + orientation + '" id="' + this.id + '"></div>');
      gutterElement.css({top: gutterTop, left: gutterLeft, width: gutterWidth, height: gutterHeight});
      gutterElement.appendTo(document.body);

      // Let the gutter object know the element it created.
      this.element = gutterElement;

      // Let the region pair know about its gutter.
      regionPair[0].gutter = this;
      regionPair[1].gutter = this;

    },

    /**
     * Retrieves the primary gutter element.
     */
    getElement: function () {
      return jQuery(document.getElementById(this.id));
    },

    /**
     * Finds the highest Y position in which the gutter can be dragged to.
     */
    getLowestY: function () {
      var region = this.regionPair[0].element;
      var regionSet = region.find('.region');

      var pairs = {};
      var bottoms = [];
      if (regionSet.length) {
        var regionSetBottomest = region.offset().top + region.height();
        regionSet.each(function (i, e) {
          var element = jQuery(e);
          var offset = element.offset();
          var bottom = offset.top + element.height();

          if (!(bottom >= regionSetBottomest - 1 && bottom <= regionSetBottomest + 1)) {
            bottoms.push(bottom);
            pairs[bottom] = {bottom:bottom, element:e};
          }

        });
      }

      if (bottoms.length) {
        var max = Math.max.apply(Math.max, bottoms); // works with testSession8
        var lowestBottom = jQuery(pairs[max].element);
        return lowestBottom.offset().top + lowestBottom.height() + REGION_MAX_HEIGHT;
      }
      else {
        return region.offset().top - GUTTER_SIZE + REGION_MAX_HEIGHT;
      }
    },

    /**
     * Finds the lowest Y position in which the gutter can be dragged to.
     */
    getHighestY: function () {
      var region = this.regionPair[1].element;
      var regionSet = region.find('.region');

      var pairs = {};
      var tops = [];
      if (regionSet.length) {
        regionSetTopest = region.offset().top
        regionSet.each(function (i, e) {
          var element = jQuery(e);
          var offset = element.offset();
          var top = offset.top;

          if (!(top >= regionSetTopest - 1 && top <= regionSetTopest + 1)) {
            tops.push(top);
            pairs[top] = {top:top, element:e};
          }

        });
      }

      if(tops.length) {
        var min = Math.min.apply(Math.min, tops);
        var highestBottom = jQuery(pairs[min].element);
        return highestBottom.offset().top - GUTTER_SIZE - REGION_MAX_HEIGHT;
      }
      else {
        return region.offset().top + region.height() - REGION_MAX_HEIGHT;
      }
    },

    remove: function () {
      this.getElement().remove();
    }

  };

  /**
   * @namespace vegas.gutter
   * @description provides global methods that pretain to all gutters
   */
  vegas.gutter = (function () {

    var gutter = {

      init: function () {
        this.attachEvents();
      },

      attachEvents: function () {

        var self = this;
        var gutter;
        var region1;
        var region2;
        var region1Height;
        var region2Height;
        var region1Width;
        var region2Width;
        var gutterGhost;

        function onDragStart (x, y, gutterElement) {

          gutter = vegas.gutters.fromElement(gutterElement);

          region1 = gutter.regionPair[0].element;
          region2 = gutter.regionPair[1].element;
          region1Height = region1.height();
          region2Height = region2.height();
          region1Width = region1.width();
          region2Width = region2.width();

          if (gutter.orientation == 'horizontal') {
            jQuery(document.body).addClass('cursor-ns');
          }

          // Create the ghost gutter that will be dragged around, the original
          // gutter element will be left in place.
          gutterGhost = gutterElement.clone().addClass('gutterGhost');
          jQuery(document.body).append(gutterGhost);

          dragStartPos = gutterElement.position();

          // Find the region that is directly above the the first region and
          // determine its bottom position.
          lowestY = gutter.getLowestY();
          // Same as above but in reverse.
          highestY = gutter.getHighestY();
        }

        function onDrag (x, y, gutterElement, e){

            var moveToY = false;

            // If you drag below the lowest point your allowed to drag to
            if (y < lowestY) {
              // Snap to the highest point
              moveToY = lowestY;
            }

            // If you drag above the highest point your allowed to drag to
            if (y > highestY) {
              // Snap to the highest point
              moveToY = highestY;
            }

            // If the mouse has gone past the max Y position
            if (moveToY) {
              // Position the gutter ghost element to the max Y position
              gutterGhost.css({top: moveToY});
              return false;
            }
 
            if (gutter.orientation == 'horizontal') {
              gutterGhost.css({top: y});
            }
            else if (gutter.orientation == 'vertical') {
              gutterGhost.css({top: x});
            }

        }

        /**
         * @param {Integer} newPos When the gutter was dragged, this is the point]
         * at which the gutter has stopped dragging, its the new position.
         */
        function onDragStop (x, y, gutterElement, e) {

          var posNew = gutterGhost.position();
          var offset= {
            top: dragStartPos.top - posNew.top,
            left: dragStartPos.left - posNew.left
          };
          gutterElement.remove();
          gutterGhost.removeClass('gutterGhost');
          gutter.element = gutterGhost;

          if (gutter.orientation == 'horizontal') {
            jQuery(document.body).removeClass('cursor-ns');

            // Both regions that are inbetween the gutter
            var regionPairElements = region2.add(region1);//region1.add(region2);

            var topNewHeight = region1Height - offset.top;
            var bottomNewHeight = region2Height + offset.top;

            // Resize the top region of the gutter
            region1.height(topNewHeight);

            // Resize the bottom region of the gutter
            region2.height(bottomNewHeight);

            regions1 = region1.find('.region');
            regions2 = region2.find('.region');

            // Loop through all the regions within the region pair
            regions1.each(function (i, e) {
              var region = vegas.regions.fromElement(e);
              if (region.orientation == 'vertical') { // Regions that are side by side
                region.getElement().height(region.getElement().parent().height());
                region.gutter.getElement().height(region.getElement().parent().height());
                region.gutter.getElement().css('top', region.getElement().parent().offset().top);
              }
              else { // == 'horizontal'
                if (region.order == 1) {
                  var region2NewHeight = region.getElement().parent().height() - region.sibling().getElement().height() - GUTTER_SIZE;
                  region.getElement().height(region2NewHeight);
                }
              }
            });

            // Loop through all the regions within the region pair
            regions2.each(function (i, e) {

              var region = vegas.regions.fromElement(e);

              if (region.orientation == 'vertical') {
                region.gutter.getElement().height(region.parent().getElement().height());
                region.gutter.getElement().css('top', region.parent().getElement().offset().top)
                region.getElement().height(region.getElement().parent().height())
              }
              else {
                if (region.order == 0) {
                  var region2NewHeight = region.getElement().parent().height() - region.sibling().getElement().height() - GUTTER_SIZE;
                  region.getElement().height(region2NewHeight);
                  region.gutter.getElement().css('top', region.sibling().getElement().offset().top - GUTTER_SIZE);
                }
              }

            });

          }

        }

        vegas.utils.dragger({
          element: '.gutter',
          onDrag: onDrag,
          onDragStart: onDragStart,
          onDragStop: onDragStop
        });

      }


    };

    vegas.init.register(gutter);

    return gutter;

  }());

  /**
   * @class Gutters
   * @memberOf vegas
   * @extends vegas.utils.ObjectCollection
   *
   * @description An object, that when instantiated will provide a listing of
   * Gutter objects with methods to work with them.
   */
  vegas.Gutters = function () {
    utils.makeObject(this, arguments, utils.ObjectCollection);
  };

  vegas.Gutters.prototype = {
    /**
     * Corrects the gutter position via each regionSet's position.
     * Called when regions are removed
     */
    reflow: function () {
      var gutter;
      var region1Element;
      var region2Element;

      // Go through each gutter
      for (var i = 0; i < vegas.gutters.length; i++) {
        gutter = vegas.gutters[i];
        // Ensure that its not wack? ie application region?
        if (gutter.getElement().length > 0) {
          region1Element = gutter.regionPair[0].getElement();
          region2Element = gutter.regionPair[1].getElement();

          // For vertical gutters
          if (gutter.orientation == 'vertical') {
            var left = region2Element.offset().left - GUTTER_SIZE;
            var top = region2Element.offset().top;
            // Position the gutter against the related regions position
            gutter.getElement().css('left', left);
            gutter.getElement().css('top', top);
            gutter.getElement().height(region2Element.height());
          }

          // For horizontal gutters
          if (gutter.orientation == 'horizontal') {
            var top = region2Element.offset().top - GUTTER_SIZE;
            var left = region2Element.offset().left;
            // Position the gutter against the related regions position
            gutter.getElement().css('top', top);
            gutter.getElement().css('left', left);
            gutter.getElement().width(region2Element.width());
          }

        }
        else {
          // @todo: look into this case
        }
      }
    }
  };

  // Creates an instance of the Gutter collection for keeping track of gutters.
  vegas.gutters = new vegas.Gutters();

  vegas.module.register('gutter.js');

})(this);
