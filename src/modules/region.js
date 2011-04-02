/**
 * @fileOverview Contains Region related objects and methods
 */
(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils;
  /**
   * @class RegionPair
   * @memberOf vegas
   * @description Creates a set of Region that will be drawn to the screen
   */
  vegas.RegionPair = function (orientation, parentRegion, data) {
    utils.makeObject(this, arguments);
    return this.createRegionPair(orientation, parentRegion, data);
  };

  /** @lends vegas.Region */
  vegas.RegionPair.prototype = {

    createRegionPair: function (orientation, parentRegion, data) {

      var thisRegion = this,
          regionElementPair,
          regionObjectPair = [];

      regionObjectPair[0] = new vegas.Region(orientation, parentRegion, data, true);
      regionObjectPair[1] = new vegas.Region(orientation, parentRegion, data, true);

      // Inserts the markup for the region inside of the current region, sets
      // the element to the regionPair variable
      if (orientation == 'horizontal') {
        regionElementPair = parentRegion.element.html(
        '<div class="region region-horizontal region-top" id="' + regionObjectPair[0].id + '"></div>' + 
        '<div class="region region-horizontal region-bottom" id="' + regionObjectPair[1].id + '"></div>'
        ).children(); // Get the elements that we just created
      }
      else if (orientation == 'vertical') {
        regionElementPair = parentRegion.element.html(
          '<div class="region region-vertical region-left" id="' + regionObjectPair[0].id + '"></div>' + 
          '<div class="region region-vertical region-left" id="' + regionObjectPair[1].id + '"></div>'
        ).children(); // Get the elements that we just created
      }
      else if (orientation == 'application'){
        // Its the application wrapper, do nothing.
      }
      else {
        console.error("Could not determine region orientation, the function must have a type of 'horizontal' or 'vertical'.");
      }

      // Associate the region objects twith the elements
      regionObjectPair[0].element = regionElementPair.eq(0);
      regionObjectPair[1].element = regionElementPair.eq(1);

      // Associate the elements with the region objects
      regionElementPair.eq(0).data('object', regionObjectPair[0]);
      regionElementPair.eq(1).data('object', regionObjectPair[1]);

      // Let the region family know about eachother
      regionObjectPair[0]._parent = parentRegion;
      regionObjectPair[0]._sibling = regionObjectPair[1];

      regionObjectPair[1]._parent = parentRegion;
      regionObjectPair[1]._sibling = regionObjectPair[0];

      thisRegion._children = regionObjectPair;

      // Keep track of regions objects in the likley case that we need to access all regions.
      vegas.regions.add(regionObjectPair);

      return regionObjectPair;  // Returns an array containing the region objects created.

    }
  };

  /**
   * @class Region
   * @memberOf vegas
   * @description Creates a Region that will be drawn to the screen
   */
  vegas.Region = function (orientation, parentRegion, data, isPair) {
    utils.makeObject(this, arguments);
    vegas.utils.extend(this, data);
    this.init(orientation, parentRegion, data, isPair);
  };

  /** @lends vegas.Region */
  vegas.Region.prototype = {

    init: function (orientation, parentRegion, data, isPair) {

      this.orientation = orientation;
      this._parent = parentRegion;
      this.id = utils.getUniqueId();
      this.entity = 'Region';
      this.components = [];
      this.hasComponents = false;
      this.maximized = false;

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
      var parentRegion = this.parent();

      var sibling = this.sibling();

      // Remove the region by replacing with the sibling regions contents
      parentRegion.element.html(sibling.element.html());

      this.associateObjectsToElements(parentRegion.element);

    },

    parent: function () {
      return this._parent;
    },

    sibling: function () {
      return this._sibling;
    },

    children: function () {
      return this._children;
    },

    /**
     * Splits a region vertically
     */
    splitv: function () {
      var components = this.components;
      this.components = []; // remove The components from the region object.

      // Insert two vertical regions
      var newRegions = new vegas.RegionPair('vertical', this);

     // Insert the components from the old region into the first slot of the new region pair
      for (var i = 0; i < components.length; i++) {
        var component = components[i];
        component.insertComponentStructure(newRegions[0]);
      }

      // Create a new Component empty edit area component for the second slot
      component = new vegas.EditArea({title: 'untitled'}, newRegions[1]);

    },

    /**
     * Splits components horizontally
     */
    splith: function () {
      var components = this.components;
      this.components = []; // remove The components from the region object.

      // Insert two horizontal regions
      var newRegions = new vegas.RegionPair('horizontal', this);

     // Insert the components from the old region into the first slot of the new region pair
      for (var i = 0; i < components.length; i++) {
        var component = components[i];
        component.insertComponentStructure(newRegions[0]);
      }

      // Create a new Component empty edit area component for the second slot
      component = new vegas.EditArea({title: 'untitled'}, newRegions[1]);

    },

    getApplicationRegion: function () {
      return vegas.regions[0];
    },

    maximize: function () {
      var applicationRegion = this.getApplicationRegion();

      var regions = vegas.regions,
          regionsLen = regions.length,
          region;

      for (var i = 0; i < regionsLen; i++) {
        region = regions[i].element;
        region.addClass('unmaximized');
      }

      this.element.addClass('maximized');

      this.element.width(applicationRegion.element.width());
      this.element.height(applicationRegion.element.height());

      var maximizeButton = this.element.find('button[action=maximize]');
      maximizeButton.attr('action', 'restore');
      maximizeButton.removeClass('maximize');
      maximizeButton.addClass('restore');


      this.maximized = true;

    },

    restore: function () {
      var applicationRegion = this.getApplicationRegion();

      var regions = vegas.regions,
          regionsLen = regions.length,
          region;

      for (var i = 0; i < regionsLen; i++) {
        region = regions[i].element;
        region.removeClass('unmaximized');
      }

      this.element.removeClass('maximized');
      this.element.removeAttr("style");

      var maximizeButton = this.element.find('button[action=restore]');
      maximizeButton.attr('action', 'maximize');
      maximizeButton.removeClass('restore');
      maximizeButton.addClass('maximize');

      this.maximized = false;

    },

    /**
     * Inserts a set of two regions inside of an existing region, they can be
     * a horizontal or vertical set of regions.
     * 
     * @param orientation {string} The orientation of the region pair e.g. horizontal, vertical
     * @param id {string} Used for debugging, keeping track of what region is what.
     */
    __DELETE__insertRegionPair: function (orientation) {

      var self = this,
          regionPair;

      // Inserts the markup for the region inside of the current region, sets
      // the element to the regionPair variable
      if (orientation == 'horizontal') {
        regionPair = this.element.html('<div class="region region-horizontal region-top"></div><div class="region region-horizontal region-bottom"></div>').children();
      }
      else if (orientation == 'vertical') {
        regionPair = this.element.html('<div class="region region-vertical region-left"></div><div class="region region-vertical region-left"></div>').children();
      }
      else {
        console.error("Could not determine region orientation, the function must have a type of 'horizontal' or 'vertical'.");
      }

      var regionObjects = [],
          regionObject;

      // Instantiates a new Region and attaches it to the region element
      regionPair.each(function (i, regionPairElement) {

        regionPairElement = jQuery(regionPairElement);

        regionObject = new vegas.Region({
          orientation: orientation,
          element: regionPairElement,
          _parent: self
        })

        // @todo, instantiate the object first so we can get its id and attach it to the markup string
        regionPairElement.attr('id', regionObject.id);

        regionPairElement.data('object', regionObject);

        // Keep track of regions objects in the case that we need to access all regions.
        vegas.regions.add(regionObject);

        regionObjects.push(regionObject);

      });

      // Let the region family know about eachother
      regionObjects[0]._sibling = regionObjects[1];
      regionObjects[1]._sibling = regionObjects[0];
      this._children = regionObjects;


      return regionObjects; // Returns an array containing the region objects created.

    },

    associateObjectsToElements: function (wrapper) {

      // Since the sibling regions contents may contain any number of components or regions
      // we need to do re-associate objects to elements and elements to objects.
      var regions = wrapper.find('div.region').andSelf(),
          regionsLen = regions.length,
          regionElement,
          regionId,
          regionObject;

      for (var i = 0; i < regionsLen; i++) {
        regionElement = jQuery(regions[i]);
        regionId = regionElement[0].id;
        regionObject = vegas.regions.hash[regionId];
        // reattach the elements that are stored with the object as well
        regionObject.element = regionElement;
        regionObject._parent = regionElement.parents('div.region:first').data('object');
        regionObject._sibling = regionElement.siblings().data('object');
        debugger;
        // We are going to repopulate the components array.
        regionObject.components = [];
        // re-attach the objects to the element via the data function.
        regionElement.data('object', regionObject);

        var components = regionElement.find('div.component'),
            componentsLen = components.length,
            componentElement,
            componentId,
            componentObject;

        for (var j = 0; j < componentsLen; j++) {
          componentElement = jQuery(components[j]);
          componentId = componentElement[0].id;
          componentObject = vegas.components.hash[componentId];
          // reattach the elements that are stored with the object as well
          componentObject.element = componentElement;
          // re-attach the objects to the element via the data function.
          componentElement.data('object', componentObject);
          console.log('tab element:', componentObject.getTabElement());
          componentObject.getTabElement().data('object', componentObject);

          // we also need to update the components array in the containing region.
          regionObject.components.push(componentObject);
        }

      }
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

      maximize: function () {
        this.getActiveRegion().maximize();
      },

      restore: function () {
        this.getActiveRegion().restore();
      },

      toggleMaximized: function () {
        var activeRegion = this.getActiveRegion();
        if (activeRegion.maximized == false) {
          activeRegion.maximize();
        }
        else {
          activeRegion.restore();
        }
      },

      splitv: function () {
        this.getActiveRegion().splitv();
      },

      splith: function () {
        this.getActiveRegion().splith();
      },

      attachEvents: function (self) {

      jQuery(document).bind('click', function (e) {

        var target = jQuery(e.target);
        var targetParent = jQuery(e.target).parent();

        // User clicked the tab area.
        if (target.hasClass('tab') || (targetParent.hasClass('tab') && target.hasClass('title'))) {
          console.log('test');
        }

        // User clicked the clicked in the button area area.
        if (target[0].tagName == 'BUTTON' && target.parent().hasClass('buttons')) {
          var region = target.parents('.region:first').data('object');
          var action = target.attr('action');
          region[action]();
        }

        var regionObject = false;

        if (target.hasClass('region')) {
            regionObject = target.data('object');
        }
        else {
          var foundRegion = target.parents('.region:first');
          if (foundRegion.length > 0) {
            regionObject = foundRegion.data('object');
          }
        }

        if (regionObject !== false) {
          vegas.session.state.activeRegion = regionObject;
        }

      });

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
   * @extends vegas.utils.ObjectCollection
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
