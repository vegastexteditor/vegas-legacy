(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /**
     * Components are visual representations of data in panes, i.e. editArea,
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
    vegas.Component = (function(){

      vegas.components = [];

      var Component = function(){
        vegas.utils.makeObject(this, arguments);
        this.entity = 'Component';
      };

      Component.prototype = {

        init: function (componentName) {
          this.id = vegas.utils.getUniqueId();
          this.registerComponent(componentName);
        },

        registerComponent: function (componentName) {
//          if (componentName in vegas && typeof(vegas[componentName]) === 'function') {
//            vegas.paint.registerPainter(vegas[componentName]);
//            vegas.components.push(componentName);
//            console.info('registered component');
//          }
//          else{
//            console.error('no such component:' + componentName);
//          }
        vegas.paint.registerPainter(componentName);
        
        },

        attachTo: function (pane){
          pane.tabs.push(this);
        },

        attach: function (component) {
          this.attachTo(session.activeEditAreaPane);
        },

      };

      return Component;

    }());

  vegas.module.register('component.js');

}());