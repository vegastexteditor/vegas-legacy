/**
 * @fileOverview Contains Region related objects and methods
 */
(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils;

  /**
   * @class Region
   * @memberOf vegas
   * @description Creates a Region that will be drawn to the screen
   */
  vegas.Region = function () {
    utils.makeObject(this, arguments);
    this.entity = 'Region';
  };

  /** @lends vegas.Region */
  vegas.Region.prototype = {

    init: function (data) {
      // Take in properties passed in to data object.
      utils.extend(this, data);
      this.uid = utils.getUniqueId();

      // Keep track of region instances
      vegas.region.regions.push(this);

    },

    getType: function () {
      return this.contents[0].entity;
    },

    getActiveContents: function () {
      return this.contents[0];
    },

    /**
     * Remove the Region from its current location.
     */
    remove: function () {

    },

    /*
     * These methods are user facing and will be available to the command line.
     */
    api: [
      this.remove
    ]

  };

  /**
   * @namespace vegas.region
   */
  vegas.region = (function () {

    var region = {
      /** @lends vegas.region */
      regions: [],

      init: function () {

        var self = this;
        self.attachEvents(self);

      },

      attachEvents: function (self) {

        var vegas = global.vegas;
        var view = vegas.view.getActiveView();
        var regions = this.getRegionList(view);

        for (var i = 0; i < regions.length; i++) {
          region = regions[i];

          (function(region) {

            utils.onMouseDownInArea(view, region.area, function (e) {
              // Unhighlight the old active region.
              //vegas.region.unhighlightRegion(view, vegas.session.state.activeRegion);

              // Change the the active region to what was clicked
              vegas.session.state.activeRegion = region;

              // High light the region which was clicked
              //vegas.region.highlightActiveRegion(view);

            });

          }(region));

        }

      },

      paint: function (view) {

        view = view || vegas.session.state.activeView;

        var regions = vegas.region.getRegionList(view),
            ctx = view.ctx,
            regionArea,
            region,
            debug = vegas.options.debug.regions,
            regionBackgroundColor = vegas.options.regions.backgroundColor;

        ctx.fillStyle = regionBackgroundColor;

        ctx.clearRect(0,0,view.width,view.height);

        for (var i = 0; i < regions.length; i++) {

          region = regions[i];
          regionArea = region.area;

          if (region.backgroundColor) {
            regionBackgroundColor = region.backgroundColor;
            ctx.fillStyle = regionBackgroundColor;
          }

          // Draw the region background
          ctx.fillRect(
            regionArea.x,
            regionArea.y,
            regionArea.width,
            regionArea.height
          );

        }
      },

      reflow: function (view) {

          var regions = vegas.session.state.activeView.regionList, // @TODO: just wrong, this is not a 2d region list!
              regionsLen = regions.length,
              region;

          // Reposition the regions
          vegas.region.preprocessRegionList(view);

          while (regionsLen--) {
            region = regions[regionsLen];
            if ('reflow' in region) {
              // Reflow the contents of the regions
              region.reflow();
            }
          }

      },

      preprocessRegionList: function (view) {

        // Default to the acitveView unlles otherwise specified.
        view = view || vegas.session.state.activeView;

        var regionList = vegas.session.state.activeView.regionList,
            width,
            height,
            x,
            y;

        var i = regionList.length;
        while (i--) {
          region = regionList[i];
          width = region.width;
          height = region.height;
          x = region.x;
          y = region.y;

          if (utils.isPercentage(width)) {
            width = utils.getPercentValue(width, view.width);
          }

          if (utils.isPercentage(height)) {
            height = utils.getPercentValue(height, view.height);
          }

          if (!utils.isNumber(region.y)) {
            if (region.y == 'bottom') {
              y = view.height - height;
            }
            if (region.y == 'top') {
              y = 0;
            }
          }

          if (!utils.isNumber(region.x)) {
            if (region.x == 'right') {
              x = view.width - width;
            }
            if (region.x == 'top') {
              x = 0;
            }
          }

          regionList[i].area = {
            x: x,
            y: y,
            width: width,
            height: height
          };

        }
        view.regionListPreprocessed = true;
        view.regionList = regionList;

      },

      getRegionList: function (view) {

        // Default to the acitveView unlles otherwise specified.
        view = view || vegas.session.state.activeView;

        if (!view.regionListPreprocessed) {
          this.preprocessRegionList(view);
        }

        return view.regionList;

      },

      highlightActiveRegion: function (view) {

        view = view || vegas.session.state.activeView;

        var activeRegion = vegas.session.state.activeRegion,
            ctx = view.ctx,
            lineWidthOld = ctx.lineWidth,
            options = vegas.options.regions;

            if (!activeRegion){
              return false;
            }

          ctx.fillStyle = options.highlightColor;

          // Highlight the active region
          ctx.lineWidth = options.HighlightStrokeSize;

          utils.cleanStrokeRect(
            ctx,
            activeRegion.area.x,
            activeRegion.area.y,
            activeRegion.area.width,
            activeRegion.area.height
          );

          ctx.lineWidth = lineWidthOld;


      },

      getActiveRegion: function () {
        return vegas.session.state.activeRegion;
      },

      /*
       * These methods are user facing and will be available to the command line.
       */
      api: [
        this.getRegions
      ]

    };

    vegas.init.register(region);

    return region;

  }());

  /**
   * @class Regions
   * @memberOf vegas
   * @extends vegas.utils.ObjectCollection (An Array with extra methods)
   *
   * @description An object, that when instantiated will provide a listing of
   * Region objects with methods to work with them.
   */
  vegas.Regions = function () {
    utils.makeObject(this, arguments, utils.ObjectCollection);
  };

  vegas.Regions.prototype = {
    /**
     * Simple abstraction that when a hook is triggered, checks if its of the
     * object type "region", if so it will run the hook callback.
     */
    hook: function (type, callback) {
      vegas.hook(type, function (e) {

        var tab = getElementObject(e.target, 'region');

        if (tab) {
          callback(tab, e);
        }

      });
    }

  };

  // Creates an instance of the Region collection for keeping track of regions.
  vegas.regions = new vegas.Regions();

  vegas.module.register('region.js');

})(this);