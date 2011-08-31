/** @fileOverview Contains Gutter related objects and methods
 *
 * Gutters are seperators for panes, they provide a space in which provides the
 * ability to resize and manage positions of a region pair.
 */
(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils,
      _ = global._;

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

      if (regionPair[0].orientation == 'vertical') {
        var totalWidth = regionPair[0].parent().element.width();
        var splitWidth = totalWidth / 2;
        regionPair[0].element.width(Math.floor(splitWidth) - GUTTER_SIZE);
        regionPair[1].element.width(Math.ceil(splitWidth));
      }

      if (regionPair[0].orientation == 'horizontal') {
        var splitHeight = (regionPair[0].element.height() + regionPair[1].element.height()) / 2;
        regionPair[0].element.height(Math.floor(splitHeight) - Math.ceil(GUTTER_SIZE / 2));
        regionPair[1].element.height(Math.ceil(splitHeight) - Math.floor(GUTTER_SIZE / 2));
      }

      // When creating a region pair, make sure the width is specified.
      /*
      regionPair.forEach(function (region) {
        if (orientation == 'vertical') {
          region.element.width(region.element.width() - (GUTTER_SIZE / 2));
        }
        else if ('horizontal') {
          region.element.height(region.element.height() - (GUTTER_SIZE / 2));
        }
      });
      */

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

    },

    remove: function () {
      this.element.remove();
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
        var region1OrigHeight;
        var region2OrigHeight
        var dragStartTop;

        var region1;
        var region2;
        var region1Height;
        var region2Height;
        var region1Width;
        var region2Width;
        var region1Offset;
        var region2Offset;
        var regionsHeight;
        var regionsWidth;
        var mouseOffsetY;
        var mouseOffsetX;

        function onDrag () {

        }

        /**
         * @param {Integer} newPos When the gutter was dragged, this is the point]
         * at which the gutter has stopped dragging, its the new position.
         */
        function onDragStop (newPos, offset) {

          if (gutter.orientation == 'horizontal') {
            jQuery(document.body).removeClass('cursor-ns');
          }

          // Both regions that are inbetween the gutter
          var regionPairElements = region2.add(region1);//region1.add(region2);

          var topNewHeight = region1Height - offset.top;
          var bottomNewHeight = region2Height + offset.top;

          // Resize the top region of the gutter
          region1.height(topNewHeight);

          // Resize the bottom region of the gutter
          region2.height(bottomNewHeight);

          // Loop through all the regions within the region pair
          regionPairElements.find('.region').each(function (i, e) {

            var region = vegas.regions.fromElement(e);

            console.log(e);

            if (region.orientation == 'vertical') { // Regions that are side by side

              var parent = region.element.parents('.region-horizontal:first');

              if (region.order == 1) { // Only do this once per region pair.
                // Move the top of the vertical gutter, to the top of the first horizontal parent.
                region.gutter.element.css('top', parent.offset().top);
                // Resize the the vertical gutter to the height of the first horizontal parent.

                var res;
                if (gutter.regionPair[0].id === parent.attr('id')) {
                  res = region.element.parent().height();
                  console.log('ionbo');
                }
                else {
                  // I don't even know what i'm doing anymore...
                  // @todo: document when in right frame of mind.
                  var parentObj = vegas.regions.fromElement(parent);
                  var region1Height = parentObj.element.height();
                  var region2Height = parentObj.sibling().element.height();
                  var newHeight = parentObj.parent().element.height();
                  var ratio = newHeight / (region1Height + region2Height);
                  res = ratio * region1Height;
                }

                region.gutter.element.height(res);

                region.element.height(res);

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

          var gutterElement = jQuery(e.target);

          // annnd for the gutter only
          if (!gutterElement.hasClass('gutter')) {return false;}

          gutter = vegas.gutters.fromElement(gutterElement);

          region1 = gutter.regionPair[0].element;
          region2 = gutter.regionPair[1].element;
          region1Height = region1.height();
          region2Height = region2.height();
          region1Width = region1.width();
          region2Width = region2.width();
          region1Offset = region1.offset();
          region2Offset = region2.offset();
          regionsHeight = region1Height + region2Height;
          regionsWidth = region1Height + region2Height;
          mouseOffsetY = e.clientY - gutterElement.offset().top;
          mouseOffsetX = e.clientX - gutterElement.offset().left;

          if (gutter.orientation == 'horizontal') {
            jQuery(document.body).addClass('cursor-ns');
          }

          // Create the ghost gutter that will be dragged around, the original
          // gutter element will be left in place.
          var gutterGhost = gutterElement.clone().addClass('gutterGhost');
          jQuery(document.body).append(gutterGhost);

          dragStartPos = gutterElement.position();

          jQuery(document.body).bind('mousemove', function (e) {
            var left = e.clientX;
            var top = e.clientY;
            if (gutter.orientation == 'horizontal') {

              // @todo: find the first horizontal bar that aligns with this horizontal bar.
              // the offset of that will be where it should stop + 100px

              var topHeight = top - region1Offset.top - mouseOffsetY;
              var bottomHeight = regionsHeight - topHeight;

              if (topHeight < REGION_MAX_HEIGHT || bottomHeight < REGION_MAX_HEIGHT) {
                topHeight = REGION_MAX_HEIGHT;
                bottomHeight = REGION_MAX_HEIGHT;
              }

              if (topHeight > REGION_MAX_HEIGHT && bottomHeight > REGION_MAX_HEIGHT) {
                gutterGhost.css({top: top - mouseOffsetY});
              }
              else if(topHeight < REGION_MAX_HEIGHT) {
                gutterGhost.css({top: REGION_MAX_HEIGHT + region1Offset.top - mouseOffsetY});
              }
              else if (bottomHeight < REGION_MAX_HEIGHT){
                gutterGhost.css({top: regionsHeight - REGION_MAX_HEIGHT + region1Offset.top - mouseOffsetY});
              }

            }
            else if (gutter.orientation == 'vertical') {

              var leftWidth = left - region1Offset.left - mouseOffsetX;
              var bottomWidth = regionsWidth - leftWidth;

              if (leftWidth < REGION_MAX_WIDTH || bottomWidth < REGION_MAX_WIDTH) {
                leftWidth = REGION_MAX_WIDTH;
                bottomWidth = REGION_MAX_WIDTH;
              }

              if (leftWidth > REGION_MAX_WIDTH && bottomWidth > REGION_MAX_WIDTH) {
                gutterGhost.css({left: left - mouseOffsetX});
              }
              else if(leftWidth < REGION_MAX_WIDTH) {
                gutterGhost.css({left: REGION_MAX_WIDTH + region1Offset.left - mouseOffsetX});
              }
              else if (bottomWidth < REGION_MAX_WIDTH){
                gutterGhost.css({left: regionsHeight - REGION_MAX_WIDTH + region1Offset.left - mouseOffsetY});
              }

            }
            onDrag();
          });

          jQuery(window).bind('mouseup.gutterDrag', function (e) {
            var posNew = gutterGhost.position();
            var offset= {
              top: dragStartPos.top - posNew.top,
              left: dragStartPos.left - posNew.left
            };
            gutterElement.remove();
            gutterGhost.removeClass('gutterGhost');
            gutter.element = gutterGhost;
            onDragStop(posNew, offset);
            jQuery(document.body).unbind('mousemove');
            jQuery(window).unbind('mouseup');
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
