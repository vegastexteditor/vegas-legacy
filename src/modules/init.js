(function() {
  var global = (function() {return this;}).call(),
      vegas = global.vegas;

    /**
     * @namespace init
     * @description Everything will be initiated once all the code has been loaded.
     */
    vegas.init = {

      initObjects: [],

      init: function () {

        var initObjects = this.initObjects,
            initObjectsLen = initObjects.length,
            i=0;

        for (; i < initObjectsLen; i++) {
          initObjects[i].init.call(initObjects[i]);
        }

        // vegas.paint.startPaint();
        vegas.utils.triggerReady(); // @depreciated @todo
        vegas.trigger('ready');

      },

      register: function (initObject, name) {
        this.initObjects.push(initObject);
      }

  };

  vegas.module.register('init.js');

}());
