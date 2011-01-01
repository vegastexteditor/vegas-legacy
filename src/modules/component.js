(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas,
      utils = vegas.utils;

  /**
   * @class Component
   * @memberOf vegas
   * @description Components are visual representations of data in panes, i.e. editArea,
   * fileExplorer, hintViewer
   *
   * This object registers a component, so the main painter function knows
   * which paint methods to call. Also provides a base class for component
   * instantiation.
   *
   * @example
   *
   *   myComponent = new vegas.Component('myComponent');
   *   myComponent.prototype = {
   *    // do stuff.
   *   }
   *
   */
    vegas.Component = function(type, properties, isComponentInstance){
      vegas.utils.makeObject(this, arguments);
      this.entity = 'Component';
      this.elements = [];
      this.id = vegas.utils.getUniqueId();
    };

    vegas.Component.prototype = {
      /** @lends vegas.Component */
      initComponent: function (componentName) {
        this.id = vegas.utils.getUniqueId();
      },

      /**
       * Insert a component inside of a region, creates the markup and instantiates
       * the component object instance.
       *
       * @param type {string} The name of the Object to instantiate, i.g. EditArea, CommandBar
       * @param properties {object} Properties that will be used in the object instance.
       * @param isComponentInstance {boolean} Lets us know if the component is instantiated already
       */
      insertComponentStructure: function (region) {

        region = region || this.region;

        var component = this;

        // Since regions can contain other regions OR components, we don't want to
        // create the component/tabs wrapper elements if its going to have a region
        if (region.components.length < 1) {
          this.insertComponentContainer(region);
        }

        // find wrapper elements to insert component elements into
        var componentsWrapper = region.element.find('.components');
        var tabsWrapper = region.element.find('.tabs');

        // Insert the components into the wrapper elements
        var componentElement = componentsWrapper.append('<div class="component component-' + component.type + '" id="' + component.id + '">' + component.componentStructure() + '</div>').find('.component:last');
        var tabElement = tabsWrapper.append('<div class="tab"><span class="title">' + component.title + '</span><a class="close"></a></div>').find('.tab:last');

        component.element = componentElement; // keep track of the primary component element

        // Remember these elements for later so we don't have to query the dom and its handy
        component.elements['componentsWrapper'] = componentsWrapper;
        component.elements['tabElement'] = tabElement;

        // Associate the component object with the element, we can use jQuery(element).data('object');
        // to get the Object instance associated with an element.
        componentElement.data('object', component);
        tabElement.data('object', component);

        // Keep track of components just in the case that we need to do something with all components
        vegas.components.add(this);
        region.components.push(this);

        return component; // Return the component object once created so it can be manipulated further.

      },

      insertComponentContainer: function (region) {
        var buttonMarkup = '<div class="buttons"><button class="splitv" action="splitv"></button><button class="splith" action="splith"></button><button class="maximize" action="maximize"></button></div>';
        var componentsWrapperMarkup = '<div class="regionPane"><div class="tabs"></div>' + buttonMarkup + '</div><div class="components"></div>';
        region.element.html(componentsWrapperMarkup);
      },

      close: function () {
        jQuery(this.elements.tabElement).remove();
        jQuery(this.element).remove();

        var components = this.region.components,
            componentsLen = components.length,
            component;

        // Delete this component from the components array
        for (var i = 0; i < componentsLen; i++) {
            component = components[i];
            if (this.id === component.id) {
              this.region.components.splice(i, 1);
              break;
            }
        }

        if (this.region.components.length <= 0) {
          this.region.remove();
        }

      },

      getRegion: function () {
        return this.region;
      },

      attachTo: function (pane){
        pane.tabs.push(this);
      },

      attach: function (component) {
        this.attachTo(session.activeEditAreaPane);
      }

    };


  vegas.component = { // ghetto @todo:fix
    init: function () {
      jQuery(document).bind('click', function (e) {
        var target = jQuery(e.target);

        if (target.parent().hasClass('tab') && target.hasClass('close')) {
          var componentObject = target.parent().data('object');
          componentObject.close();
        }

      });
    }
  };
  
  /**
   * @class Regions
   * @memberOf vegas
   * @extends vegas.utils.ObjectCollection (An Array with extra methods)
   *
   * @description An object, that when instantiated will provide a listing of
   * Region objects with methods to work with them.
   */
  vegas.Components = function () {
    utils.makeObject(this, arguments, utils.ObjectCollection);
  };

  vegas.Components.prototype = {
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
  vegas.components = new vegas.Components();


  vegas.component.init(); // ghetto @todo:fix

  vegas.module.register('component.js');

}());