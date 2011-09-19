/**
 * @fileOverview Contains Region related objects and methods
 *
 * Regions are physical area's that come in sets of one or two. The root region
 * is the only region that should at anytime contain a sigular region.
 *
 * Regions are rendered as divs and act as containers for components. The
 * reason they exist are to be able to provide recursive split views both
 * vertically and horizontally.
 */
(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils;

  var GUTTER_SIZE = 5;

  /**
   * @class RegionPair
   * @memberOf vegas
   * @description Creates a set of two Region that will be drawn to the screen
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

      // Instantiate two single regions, letting it know about the parent region and its
      // position within that parent region
      regionObjectPair[0] = new vegas.Region(orientation, parentRegion, data, 0);
      regionObjectPair[1] = new vegas.Region(orientation, parentRegion, data, 1);

      // Whether or not the region pair has "gutter"... gutter is only displayed
      // in between two regions.
      var hasGutter = false;

      // Inserts the markup for the region inside of the current region, sets
      // the element to the regionPair variable
      if (orientation == 'horizontal') {
        regionElementPair = parentRegion.getElement().html(
        '<div class="region region-horizontal region-top" id="' + regionObjectPair[0].id + '"></div>' + 
        '<div class="region region-horizontal region-bottom" id="' + regionObjectPair[1].id + '"></div>'
        ).children(); // Get the elements that we just created

        hasGutter = true;

      }
      else if (orientation == 'vertical') {
        regionElementPair = parentRegion.getElement().html(
          '<div class="region region-vertical region-left" id="' + regionObjectPair[0].id + '"></div>' + 
          '<div class="region region-vertical region-left" id="' + regionObjectPair[1].id + '"></div>'
        ).children(); // Get the elements that we just created

        hasGutter = true;

      }
      else if (orientation == 'application'){
        // Its the application wrapper so its not really a pair... do nothing.
        console.warn('should this even be called?');
      }
      else {
        console.error("Could not determine region orientation, the function must have a type of 'horizontal' or 'vertical'.");
      }

      // Associate the region objects with the region elements
      regionObjectPair[0].element = regionElementPair.eq(0);
      regionObjectPair[1].element = regionElementPair.eq(1);

      // Let the region family know about eachother
      regionObjectPair[0]._parent = parentRegion;
      regionObjectPair[1]._parent = parentRegion;

      regionObjectPair[0]._sibling = regionObjectPair[1];
      regionObjectPair[1]._sibling = regionObjectPair[0];

      parentRegion._children = regionObjectPair;

      // If this region has a gutter (its horizontal / vertical)
      if (hasGutter) {
        // Then create a gutter via the gutter class :)
        var gutter = new vegas.Gutter(orientation, regionObjectPair);
        // Let both regions know about the gutter.
        regionObjectPair[0]._gutter = gutter;
        regionObjectPair[1]._gutter = gutter;
      }

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
   * @description Creates a Region that will be drawn to the screen, this
   * should not be used directly. It should only be used by the RegionPair
   * class since regions can only come in pairs.
   */
  vegas.Region = function (orientation, parentRegion, data, order) {
    utils.makeObject(this, arguments);
    vegas.utils.extend(this, data);
    this.init(orientation, parentRegion, data, order);
  };

  /** @lends vegas.Region */
  vegas.Region.prototype = {

    init: function (orientation, parentRegion, data, order) {

      this.orientation = orientation;
      this._parent = parentRegion;
      this._children = [];
      this.id = utils.getUniqueId();
      this.entity = 'Region';
      this.components = [];
      this.hasComponents = false;
      this.maximized = false;
      this.splittingEnabled = true;
      this.order = order;

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

    isRoot: function () {
      return this.getElement().hasClass('application');
    },

    setWidth: function () {

    },

    setHeight: function (height) {

      var thisElement = this.getElement();

      debugger;

      if (height == undefined) {
        if (this.isRoot()) {
          height = window.innerHeight;
        }
        else {
          if (this.orientation == 'horizontal') {
            height = thisElement.parent().height() / 2
          }
          else { // vertical
            height = thisElement.parent.height();
          }
        }
      }

      // Make the height of the wrapper reach the height of the full screen
      thisElement[0].style.cssText += 'height:' + height + 'px !important;';
    },

    updateFamilyRefs: function () {
      // Refresh refrences
      this._parent = this.parent(true);
      this._sibling = this.sibling(true);
    },

    become: function (whatToBecome) {

      this.getElement().html(whatToBecome.getElement().html());

      this.getElement().attr('id', whatToBecome.id);

      this.id = whatToBecome.id;

      // Since the markup has been reinserted from the parent, the element
      // references in the objects are now stale... refresht them.

      var components = whatToBecome.components,
          componentsLen = components.length,
          component;

      for (var i = 0; i < componentsLen; i++) {
        component = components[i];
        component.element = jQuery(document.getElementById(component.id));
        this.components[i] = component;
      }

      this.components = whatToBecome.components;

      // Refresh refrences
      this.updateFamilyRefs();

    },

    /**
     * Remove the Region from its current location.
     */
    remove: function () {

      if (this.id == this.getApplicationRegion().id){

        this.disableSplitting();

        // Components should already be empty! Whats going on here?
        // @todo: this is rigged. 
        this.components = [];
        // end rigging.

        return false;
      }

      var parentRegion = this.parent();

      var siblingRegion = this.sibling();

      // Remove the region element, this should be pointless code since the
      // replacement of the parent region with the sibling region will remove
      // the region inherantly
      //this.getElement().remove()

      // remove the gutter that seperates the region
      this.gutter.remove();

      // Remove the region from the collection
      vegas.regions.remove(this);

      // The reference to the parent region is now referencing the sibling region
      vegas.regions.hash[parentRegion.id] = siblingRegion;

      // Now Replace the parent region with the sibling regions contents
      parentRegion.getElement().html(siblingRegion.getElement().html());

      // The parent region element should now have the id of the sibling region.
      parentRegion.getElement().attr('id',siblingRegion.id);

      // The parent region object should now have the id of the sibling region.
      parentRegion.id = siblingRegion.id;

      // update the reference to the element
      parentRegion.element = parentRegion.getElement();

      // Since the markup has been reinserted from the parent, the element
      // references in the objects are now stale... refresht them.

      var components = siblingRegion.components,
          componentsLen = components.length,
          component;

      for (var i = 0; i < componentsLen; i++) {
        component = components[i];
        component.element = jQuery(document.getElementById(component.id));
        component.region = parentRegion;
        parentRegion.components[i] = component;
      }

      parentRegion.components = siblingRegion.components;

      // Refresh refrences
      parentRegion.updateFamilyRefs();

      // Reflow regions and gutter positions
      vegas.regions.reflow();
      vegas.gutters.reflow();

    },

    parent: function () {
      var parent = this.getElement().parent();
      // Could not get the element's parent, or there is no parent (its the container)
      if (!parent.length || (parent.length && parent[0] == document.body)) {
        return false;
      }
      // Get the parent from the current element
      return vegas.regions.fromElement(parent);
      // get the cached sibling from the object.
      return this._parent;
    },

    sibling: function () {
      // Get the sibling from the current element;
      return vegas.regions.fromElement(this.getElement().siblings());
      // Get the cached sibling from the object.
      return this._sibling;
    },

    children: function (fresh) {
      // Get the children regions from the current element
      var children = this.getElement().children('.region');
      if (children.length == 2) {
        return [vegas.regions.fromElement(children.first()), vegas.regions.fromElement(children.last())];
      }
      else {
        return false;
      }
      // Get the cached children regions from the object.
      return this._children;
    },

    /**
     * Splits a region vertically
     */
    splitv: function () {

      if (vegas.regions[0].getElement().length == 0) {
        debugger;
      }

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

      if (vegas.regions[0].getElement().length == 0) {
        debugger;
      }

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

    disableSplitting: function () {
      if (this.splittingEnabled) {
        this.getElement().find('button.splitv,button.splith').hide();
        this.splittingEnabled = false;
      }
    },

    enableSplitting: function () {
      if (!this.splittingEnabled) {
        this.getElement().find('button.splitv,button.splith').show();
        this.splittingEnabled = true;
      }
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

      this.disableSplitting();

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

      this.enableSplitting();

      this.maximized = false;

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
    },

    getPanes: function () {
      var regions = vegas.regions;

      var childlessRegions = [];

      for (var i = 0; i < regions.length; i++) {
        if (regions[i]._children.length == 0) {
          childlessRegions.push(regions[i]);
        }
      }

      return childlessRegions;
    },

    reflow: function () {

      var region = vegas.regions[0];

      resizeChildren(region);

      function resizeChildren(region) {
       var pair = region.children();

        if (pair) {
          var orientation = pair[0].orientation;

          var parentElement = region.getElement();
          var pair1Element = pair[0].getElement();
          var pair2Element = pair[1].getElement();

          if (orientation == 'vertical') {
            var pairWidth = pair1Element.width() + pair2Element.width() + GUTTER_SIZE;
            var parentElementWidth = parentElement.width();
            // The width of the region pair does not fit into the parent region.
            if (pairWidth < parentElementWidth) {
              // Get the amount of pixels its going to take for us to match the parent region.
              var difference = parentElementWidth - pairWidth;
              var first = Math.floor(difference / 2), second = difference - first;
              pair1Element.width(pair1Element.width() + first);
              pair2Element.width(pair2Element.width() + second);
            }
          }

          resizeChildren(pair[0]);
          resizeChildren(pair[1]);

        }
      }


    }

  };



  // Creates an instance of the Region collection for keeping track of regions.
  vegas.regions = new vegas.Regions();

  vegas.module.register('region.js');

})(this);
