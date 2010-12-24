/**
 * @fileOverview Contains basic functionality for stretching the application
 * layout. regions, scrollbars, tabs, etc.
 */
(function (global) {

  var vegas = global.vegas,
      utils = vegas.utils,
      options = vegas.settings.layoutManager || {};

    vegas.gui = (function(){

      var gui = {
        init: function () {
          this.meh();
        },

        meh: function () {

          vegas.tabs.hook('mousedown', function (tab, e) {

              var view = tab.getView();

              vegas.hook('mousemove', function (e) {

                if (options.view.showMovement) {
                  view.showMovement(e.clientX, e.clientY);
                }

              });

            vegas.hook('mouseup', function (e) {

              var region = vegas.region.getRegionOfElement(e.target);

              if (region) {
                view.attachToRegion(region);
              }
              else {
                vegas.log('no region found');
              }

            });

            vegas.regions.hook('mouseenter', function (e) {

              var region = vegas.utils.getObjectFromElement('region', e.target);

              region.visualizeTarget();

              region.hook('mouseleave', function () {
                region.unVisualizeTarget();
              })

            });

          });


        }

      };

      vegas.init.register(gui);

      return gui;

    }());

  vegas.module.register('gui.js');

})(this);