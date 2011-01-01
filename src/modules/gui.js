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

//            var regionPair1 = applicationRegion.insertRegionPair('horizontal', 'regionPair1');
//            var regionPair2 = regionPair1[0].insertRegionPair('vertical', 'regionPair2');
//            var regionPair3 = regionPair2[0].insertRegionPair('vertical', 'regionPair3');
//            var regionPair4 = regionPair2[1].insertRegionPair('horizontal', 'regionPair4');
//
//            // alternative syntax, new EditArea({region: regionPair4[1]});
//            var component5 = regionPair1[1].insertComponent('CommandBar', {title: 'command bar1'});
//            var componenta = regionPair1[1].insertComponent('CommandBar', {title: 'command bar2'});
//            var componentb = regionPair1[1].insertComponent('CommandBar', {title: 'command bar4'});
//            var componentc = regionPair1[1].insertComponent('CommandBar', {title: 'command bar5'});
//            var component2 = regionPair2[0].insertComponent('EditArea', {title: 'edit Area 2'});
//            var component3 = regionPair3[1].insertComponent('EditArea', {title: 'edit Area 3'});
//            var component1 = regionPair4[1].insertComponent('EditArea', {title: 'edit Area 1'});
//            var component4 = regionPair4[0].insertComponent('EditArea', {title: 'edit Area 4'});

            // [new vegas.Region({orientation: 'horizontal'}), new new vegas.Region({orientation: 'horizontal')]
            var applicationRegion = self.insertApplicationRegion();

            var regionPair1 = new vegas.RegionPair('horizontal', applicationRegion);
            var regionPair2 = new vegas.RegionPair('vertical', regionPair1[0]);
            var regionPair3 = new vegas.RegionPair('horizontal', regionPair2[0]);
            var regionPair4 = new vegas.RegionPair('vertical', regionPair2[1]);

            console.info('Created Regions: ', regionPair1, regionPair2, regionPair3, regionPair4);

            var editArea1 = new vegas.EditArea({title: 'editarea 1'}, regionPair4[0]);
            var editArea2 = new vegas.EditArea({title: 'editarea 1'}, regionPair4[1]);
            var editArea4 = new vegas.EditArea({title: 'editarea 1'}, regionPair3[0]);
            var editArea5 = new vegas.EditArea({title: 'editarea 1'}, regionPair3[1]);

            var commandBar1 = new vegas.CommandBar({title: 'command bar1'}, regionPair1[1]);
            var commandBar2 = new vegas.CommandBar({title: 'command bar1'}, regionPair1[1]);
            var commandBar3 = new vegas.CommandBar({title: 'command bar1'}, regionPair1[1]);
            var commandBar4 = new vegas.CommandBar({title: 'command bar1'}, regionPair1[1]);
            var commandBar5 = new vegas.CommandBar({title: 'command bar1'}, regionPair1[1]);

            console.info('created CommandBars', commandBar1, commandBar2, commandBar3, commandBar4, commandBar5);

//            self.debugRegions();

          });

        },

        debugRegions: function () {
          var regions = vegas.regions,
             regionsLen = regions.length;

          for (var i = 0; i < regionsLen; i++) {
          var region = regions[i];

            if (region.orientation == 'horizontal' || region.orientation == 'vertical') {
              jQuery(region.element).css('background-color', '#' + Math.round(0xffffff * Math.random()).toString(16));
            }

          }
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

        insertApplicationRegion: function () {

          var regionObject = new vegas.Region('application', false, null, false);

          var applicationWrapper = jQuery(document.body).html('<div class="application region" id="' + regionObject.id + '"></div>').children();

          regionObject.element = applicationWrapper;

          applicationWrapper.data('object', regionObject);

          vegas.regions.add(regionObject);

          return regionObject;
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