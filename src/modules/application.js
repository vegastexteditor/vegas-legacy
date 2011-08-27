(function() {
  var global = (function() {return this;}).call(),
      vegas = global.vegas;

    /**
     * @namespace vegas.application
     * @description Functions related to the desktop Application environment
     */
    vegas.application = (function() {

      /**
       * @constant SPADE
       * @description the spade ascii character
       */
      vegas.SPADE = String.fromCharCode(9824);

      var application = {
      /** @lends vegas.application */
        init: function () {

          if (typeof(Titanium) == 'undefined') {
            return false;
          }

          this.setDefaultTitle();
        },

        /**
         * Creates the base application markup wrapping, this is the first
         * piece of markup displayed in the body.
         */
        insertApplicationRegion: function () {

          var regionObject = new vegas.Region('application', false, null, false);

          var applicationWrapper = jQuery(document.body).html('<div class="application region" id="' + regionObject.id + '"></div>').children();

          // Make the height of the wrapper reach the height of the full screen
          applicationWrapper[0].style.cssText += 'height:' + window.innerHeight + 'px !important;';

          regionObject.element = applicationWrapper;

          applicationWrapper.data('object', regionObject);

          vegas.regions.add(regionObject);

          return regionObject;
        },

        setDefaultTitle: function () {
          this.setTitle('Veg' +  vegas.SPADE + 's');
        },

        setTitle: function (title) {
          Titanium.UI.getMainWindow().setTitle(title);
        },

        reload: function () {
          window.location = '/index.html?' + +new Date();
        },

        getFreshCopy: function () {
          var srcDir = Titanium.Filesystem.getFile('./src');
          var resourceDir = Titanium.Filesystem.getResourcesDirectory();
          var applicationDir = Titanium.Filesystem.getApplicationDirectory();

          // Delete The Resource Directory
          resourceDir.deleteDirectory(true);

          // Copy application source to resource directory
          srcDir.copy(resourceDir.toString());

        },

        getFreshCopyAndReload: function () {
          this.getFreshCopy();
          this.reload();
        },

        toggleMaximize: function () {
          if (Titanium.UI.getMainWindow().isMaximized()) {
            Titanium.UI.getMainWindow().unmaximize();
          }
          else {
            Titanium.UI.getMainWindow().maximize();
          }
        },
        
        toggleFullScreen: function () {
          if (Titanium.UI.getMainWindow().isFullscreen()) {
            Titanium.UI.getMainWindow().setFullScreen(false);
          }
          else {
            Titanium.UI.getMainWindow().setFullScreen(true);
          }
        },

        increaseTransparency: function () {
          var transparency = Titanium.UI.getMainWindow().getTransparency();
          if (transparency < 1) {
            transparency = transparency + .025;
            Titanium.UI.getMainWindow().setTransparency(transparency)
          }
        },

        decreaseTransparency: function () {
          var transparency = Titanium.UI.getMainWindow().getTransparency();
          if (transparency > 0) {
            transparency = transparency - .025;
            Titanium.UI.getMainWindow().setTransparency(transparency)
          }
        },

        errorStop: function () {

        },

        quit: function () {
          vegas.application.exit();
        },

        exit: function () {
          Titanium.App.exit();
        }

      };

      vegas.init.register(application);

      return application;

    }());

  vegas.module.register('application.js');

}());

