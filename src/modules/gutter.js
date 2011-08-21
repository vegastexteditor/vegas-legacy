/** @fileOverview Contains Gutter related objects and methods
 *
 * Gutters are seperators for panes, they provide a space in which provides the
 * ability to resize and manage positions of a region pair.
 */
(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils;

      var GUTTER_SIZE = 15; // @todo: setting
  /**
   * @class Gutter
   * @memberOf vegas
   * @description Creates a Gutter that will be drawn to the screen
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

      vegas.gutters.add(this);

      regionPair.forEach(function (region) {
        if (orientation == 'vertical') {
          region.element.width(region.element.width() - (GUTTER_SIZE / 2))
        }
        else if ('horizontal') {
          region.element.height(region.element.height() - (GUTTER_SIZE / 2))
        }
      });

      var gutterElement;
      if (orientation == 'vertical') {

        var region = regionPair[0].element;
        var gutterTop = region.offset().top;
        var gutterLeft = region.offset().left + region.width();
        var gutterWidth = GUTTER_SIZE;
        var gutterHeight = region.height();

        regionPair[1].element.css('margin-left', GUTTER_SIZE);
      }
      else if (orientation == 'horizontal') {

        var region = regionPair[0].element;
        var gutterTop = region.offset().top + region.height();
        var gutterLeft = region.offset().left;
        var gutterWidth = region.width();
        var gutterHeight = GUTTER_SIZE;

        regionPair[1].element.css('margin-top', GUTTER_SIZE);
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
        var dragStartTop;

        function onDrag () {

        }

        /**
         * @param {Integer} newPos When the gutter was dragged, this is the point]
         * at which the gutter has stopped dragging, its the new position.
         */
        function onDragStop (newPos, offset) {

          // The region thats above the gutter that was dragged
          var top = gutter.regionPair[0].element;
          // The region thats below the gutter that was dragged
          var bottom = gutter.regionPair[1].element;
          // Both regions that are inbetween the gutter
          var regionPairElements = top.add(bottom);

          // Resize the top region of the gutter
          top.height(top.height() - offset.top);

          // Resize the bottom region of the gutter
          bottom.height(bottom.height() + offset.top);

          // Loop through all the regions within the region pair
          regionPairElements.find('.region').each(function (i, e) {

            var region = vegas.regions.fromElement(e);

            if (region.orientation == 'vertical') { // Regions that are side by side

              // Find the first parent of the region pair that is horizontal
              var firstHorizRegion = region.element.parents('.region-horizontal:first');

              // Make the size of this region to the height of the first horizontal pair
              region.element.height(firstHorizRegion.height());

              if (region.order == 1) { // Only do this once per region pair.
                // Move the top of the vertical gutter, to the top of the first horizontal parent.
                region.gutter.element.css('top', firstHorizRegion.offset().top);
                // Resize the the vertical gutter to the height of the first horizontal parent.
                region.gutter.element.height(region.element.parent().height());

              }

            }
            else if (region.orientation == 'horizontal') { // Regions that are above / below

              /*
              var height = region.parent().parent().element.height() / 2;

              region.element.height(height);
              */

              if (region.order == 1) { // Only do this once per region pair.

                region1Height = region.element.height();
                region2Height = region.sibling().element.height();

                ratio = region.parent().element.height() / (region1Height + region2Height)

                region.element.height(ratio * region1Height);
                region.sibling().element.height(ratio * region2Height);


                region.gutter.element.css('top', region.element.offset().top - GUTTER_SIZE);
              }

            }

          });

          // Bring the lowest horizontal gutter to the lowest point

        }

        jQuery(document.body).bind('mousedown', function (e) {

          var target = jQuery(e.target);

          dragStartPos = target.position();

          if (!target.hasClass('gutter')) {return false;}

          jQuery(document.body).bind('mousemove', function (e) {
            gutter = vegas.gutters.fromElement(target);
            var left = e.clientX;
            var top = e.clientY;
            if (gutter.orientation == 'horizontal') {
              target.css({top: top});
            }
            else if (gutter.orientation == 'vertical') {

            }
            onDrag();
          });

          jQuery(document.body).bind('mouseup.gutterDrag', function (e) {
            var posNew = target.position();
            var offset= {
              top: dragStartPos.top - posNew.top,
              left: dragStartPos.left - posNew.left
            };
            onDragStop(posNew, offset);
            jQuery(document.body).unbind('mousemove');
            jQuery(document.body).unbind('mouseup');
          });

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
  };

  // Creates an instance of the Gutter collection for keeping track of gutters.
  vegas.gutters = new vegas.Gutters();

  vegas.module.register('gutter.js');

})(this);
