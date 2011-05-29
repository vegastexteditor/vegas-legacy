/**
 * @fileOverview Contains Region related objects and methods
 *
 * Regions are physical area's that come in sets of one or two. The root region
 * is the only region that should at anytime contain a sigular region.
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

    /**
     * Inserts a set of two regions inside of an existing region, they can be
     * a horizontal or vertical set of regions.
     * 
     * @param orientation {string} the orientation of the region pair e.g.
     * horizontal, vertical
     * @param parentRegion {object} The region which the new region pair should
     * be inserted into
     * @param id {string} used for debugging, keeping track of what region is what.
     */
    createRegionPair: function (orientation, parentRegion, data) {

      var regionElementPair,
          regionObjectPair = [];

      regionObjectPair[0] = new vegas.Region(orientation, parentRegion, data, true);
      regionObjectPair[1] = new vegas.Region(orientation, parentRegion, data, true);

      // Inserts the markup for the region inside of the current region, sets
      // the element to the regionPair variable
      if (orientation == 'horizontal') {
        regionElementPair = parentRegion.getElement().html(
        '<div class="region region-horizontal region-top" id="' + regionObjectPair[0].id + '"></div>' + 
        '<div class="region region-horizontal region-bottom" id="' + regionObjectPair[1].id + '"></div>'
        ).children(); // Get the elements that we just created
      }
      else if (orientation == 'vertical') {
        regionElementPair = parentRegion.getElement().html(
          '<div class="region region-vertical region-left" id="' + regionObjectPair[0].id + '"></div>' + 
          '<div class="region region-vertical region-left" id="' + regionObjectPair[1].id + '"></div>'
        ).children(); // Get the elements that we just created
      }
      else if (orientation == 'application'){
        // Its the application wrapper so its not really a pair... do nothing.
      }
      else {
        console.error("Could not determine region orientation, the function must have a type of 'horizontal' or 'vertical'.");
      }

      // Associate the region objects with the elements
      regionObjectPair[0].element = regionElementPair.eq(0);
      regionObjectPair[1].element = regionElementPair.eq(1);

      // Associate the elements with the region objects
      // @depreciated implimentation, use hash id's for lookup
      regionElementPair.eq(0).data('object', regionObjectPair[0]);
      regionElementPair.eq(1).data('object', regionObjectPair[1]);

      // Let the region family know about eachother
      regionObjectPair[0]._parent = parentRegion;
      regionObjectPair[0]._sibling = regionObjectPair[1];

      regionObjectPair[1]._parent = parentRegion;
      regionObjectPair[1]._sibling = regionObjectPair[0];

      parentRegion._children = regionObjectPair;

      // Keep track of regions objects in the likley case that we need to access
      // all regions.
      vegas.regions.add(regionObjectPair);
      // Returns an array containing the region objects created.
      return regionObjectPair;

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

    getElement: function () {
      return jQuery(document.getElementById(this.id));
    },

    /**
     * Remove the Region from its current location.
     */
    remove: function () {

      var parentRegion = this.parent(true);

      var siblingRegion = this.sibling(true);

      // Remove the sibling region from the markup by replacing with the parent regions
      // contents with the the sibling regions contents
      parentRegion.getElement().html(siblingRegion.getElement().html());

      // Remove the region from the object collection (vegas.regions array)
      vegas.regions.remove(this);

      /*
      -- 95C31493_8D91_46B9_B310_EC7F72D4BC93--   -- 31EABF16_A1EE_4EEC_A0AC_5BAD535400C2 --
      C9DE9B06_FB64_4FC2_9E28_DAEE17A01AAA        992C9827_5174_40AB_8B73_E2A2B0501237
      246E717B_17A8_4267_899A_B000C851C958        983C539C_C0A5_4959_B259_617BD02D21A8
      */

      // Would then become

      /*
      -- 246E717B_17A8_4267_899A_B000C851C958--   -- 31EABF16_A1EE_4EEC_A0AC_5BAD535400C2 --
                                                  992C9827_5174_40AB_8B73_E2A2B0501237
                                                  983C539C_C0A5_4959_B259_617BD02D21A8
      */

      // Since the sibling region has now become what was the parent region, we
      // have to adjust a couple of its properties for its data to remain correct.

      parentRegion.getElement().attr('id', siblingRegion.id);

      parentRegion.id = siblingRegion.id;

      parentRegion._parent = parentRegion.parent(true);

      parentRegion._sibling = parentRegion.sibling(true);

      // Since the markup has been reinserted from the parent, the element
      // references in the objects are now stale... refresht them.

      // this.associateElementsToObjects(siblingRegion.element);

      var components = siblingRegion.components,
          componentsLen = components.length,
          component;

      for (var i = 0; i < componentsLen; i++) {
        component = components[i];
        component.element = jQuery(document.getElementById(component.id));
        parentRegion.components[i] = component;
      }

      parentRegion.components = siblingRegion.components;

    },

    parent: function (fresh) {
      var parent;
      if (fresh) {

        if (this._parent == false || this.getElement().hasClass('application')) {
          this._parent = false;
          parent = false;
        }
        else {
          var parentElement = this.getElement().parent();
          parent = vegas.regions.fromElement(parentElement);
          this._parent = parent;
        }

      }
      else {
        parent = this._parent;
      }
      return parent;
    },

    sibling: function (fresh) {
      var siblings,
          sibling;
      if (fresh) {
        siblings = this.getElement().siblings();
        if (siblings.length) {
          sibling = vegas.regions.fromElement(this.getElement().siblings());
          this._sibling = sibling;
        }
        else {
          this._sibling = false;
        }
      }
      else {
        sibling = this._sibling;
      }
      return sibling;
    },

    children: function (fresh) {
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
      component = new vegas.EditArea({title: 'untitled ' + Math.floor(Math.random() * 1000)}, newRegions[1]);

      component._children = newRegions;

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
      component = new vegas.EditArea({title: 'untitled ' + Math.floor(Math.random() * 1000)}, newRegions[1]);

      component._children = newRegions;

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
        region = regions[i].getElement();
        region.addClass('unmaximized');
      }

      this.getElement().addClass('maximized');

      this.getElement().width(applicationRegion.getElement().width());
      this.getElement().height(applicationRegion.getElement().height());

      var maximizeButton = this.getElement().find('button[action=maximize]');
      maximizeButton.attr('action', 'restore');
      maximizeButton.removeClass('maximize');
      maximizeButton.addClass('restore');

      this.getElement().find('button.splitv,button.splith').hide();

      this.maximized = true;

    },

    restore: function () {
      var applicationRegion = this.getApplicationRegion();

      var regions = vegas.regions,
          regionsLen = regions.length,
          region;

      for (var i = 0; i < regionsLen; i++) {
        region = regions[i].getElement();
        region.removeClass('unmaximized');
      }

      this.getElement().removeClass('maximized');
      this.getElement().removeAttr("style");

      var maximizebutton = this.getElement().find('button[action=restore]');
      maximizebutton.attr('action', 'maximize');
      maximizebutton.removeClass('restore');
      maximizebutton.addClass('maximize');

      this.getElement().find('button.splitv,button.splith').show();

      this.maximized = false;

    },

    associateElementsToObjects: function (wrapper) {

      console.error('obsolete?');
      debugger;

      wrapper = jQuery(wrapper);

      var regionElements = wrapper.find('.region');
      var componentElements = wrapper.find('.component');

      for (var i = 0; i < regionElements.length; i++) {
        vegas.regions.hash[regionElements[i].id].getElement() = jQuery(document.getElementById(regionElements[i].id));
      }

      for (var i = 0; i < componentElements.length; i++) {
        vegas.components.hash[componentElements[i].id].getElement() = jQuery(document.getElementById(componentElements[i].id));
      }
    },

    associateObjectsToElements: function (wrapper) {

      console.error('obsolete?');
      debugger;

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
        regionObject.getElement() = regionElement;
        regionObject._parent = regionElement.parents('div.region:first').data('object');
        regionObject._sibling = regionElement.siblings().data('object');

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
          componentObject.getElement() = componentElement;
          // re-attach the objects to the element via the data function.
          componentElement.data('object', componentObject);
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
          console.log('User clicked the tab area');
        }

        // User clicked the clicked in the button area area.
        if (target[0].tagName == 'BUTTON' && target.parent().hasClass('buttons')) {
          var region = vegas.regions.fromElement(target.parents('.region:first'));
          var action = target.attr('action');

          if (!region) {
            console.error('shit, could not get region');
          }


          if (typeof(region[action]) == 'function') {
            region[action]();
          }
          else {
            console.error('invalid action specified:', action);
            console.trace();
          }
        }

        var regionObject = false;

        if (target.hasClass('region')) {
            regionObject = vegas.regions.fromElement(target);
        }
        else {
          var foundRegion = target.parents('.region:first');
          if (foundRegion.length > 0) {
            regionObject = vegas.regions.fromElement(foundRegion);
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
