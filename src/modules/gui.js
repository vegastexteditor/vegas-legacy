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

          var self = this;

          jQuery(window).load(function () {
            // Test session creation


          });

        },

        insertMarkup: function (where, markup) {
          var wrapper = jQuery(where).html(markup);
          return wrapper.children();
        },

        results: function (results) {

          var oldLen = this.length,
              newLen = results.length;

          for (var i = 0; i < newLen; i++) {
            this[i] = results[i];
          }

          if (newLen < oldLen) {

            var len = oldLen - newLen;

            while (len) {
              delete this[len];
              len--;
            }

          }

          this.length = newLen;

          return this;

        },

        attachEvents: function () {

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
