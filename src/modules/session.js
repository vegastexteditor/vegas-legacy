(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils;

    /**
     * @namespace vegas.session
     * @description A session contains all information in memory needed, views,
     * buffers, etc.
     */
    vegas.session = (function () {

      var session = {
        /** @lends vegas.session */
        state: {}, // This is where all session information is stored

        init: function () {
          this.create();
        },

        create: function (session) {

          session = session || this.get('default');

            function createItems(sessionItem, parentRegion) {

              if (sessionItem.length) {
                for (var i = 0; i < sessionItem.length; i++) {
                  new vegas[sessionItem[i].type](sessionItem[i].properties, parentRegion);
                }
                return false;
              }

              var regionPair = new vegas.RegionPair(sessionItem.type, parentRegion)

              if (sessionItem.region1) {
                createItems(sessionItem.region1, regionPair[0]);
              }

              if (sessionItem.region2) {
                createItems(sessionItem.region2, regionPair[1]);
              }

            }

            var applicationRegion = vegas.application.insertApplicationRegion();

            createItems(session, applicationRegion);

        },

        getCurrent: function () {

          var applicationRegion = vegas.regions[0];

          function getItems(sessionItem, regions) {
            regions = regions || {};

            var regionPair = sessionItem.children();
            if (regionPair.length) {

              var regions = {'type': regionPair[0].orientation};

              regions.region1 = getItems(regionPair[0], regions);

              regions.region2 = getItems(regionPair[1], regions);

              return regions;
            }
            else {
              var components = [];
              for (var i = 0; i < sessionItem.components.length; i++) {
                var component = sessionItem.components[i];
                var obj = {'type': component.type, 'properties': component.getSessionProperties()};
                components.push(obj);
              }
              return components;
            }
          }

          return getItems(applicationRegion);
        },

        getDefault: function () {
            return 'testSession8'; // @todo: filesystem
        },

        get: function (sessionName) {

          var session = false;

          // If no session name is provided, return the current session.
          if (!sessionName) {
           session = this.getCurrent();
          }

          // Use the default session name if 'default' is provided
          if (sessionName == 'default') {
            sessionName = this.getDefault();
          }

          // Didn't load a session already?
          if (!session) {
            // Attempt to load the session from the test sessions.
            var testSessions = getTestSessions();
            if (sessionName in testSessions) {
              session = testSessions[sessionName];
            }
          }

          if (!session) {
            console.log('could not get session');
          }

          return session;

        },

        empty: function () {
          vegas.regions = new vegas.Regions();
          vegas.components = new vegas.Components();
          vegas.gutters= new vegas.Gutters();
          vegas.tabs = new vegas.Tabs();
          // @todo;
        },

        load: function (sessionName) {
          var session = this.get(sessionName) ;
          this.empty();
          this.create(session);
        },

        log: function (session) {
          session = this.get(session);
          console.log(JSON.stringify(session));
        },

        /**
         * Closes the current session, by default will save the session
         */
        close: function () {

        },

        /**
         * Saves the session to disk
         */
        save: function () {

        },

        /**
         * Save the session to a specific location on desk
         */
        saveAs: function () {

        },

        /**
         * Restores a session from disk
         */
        restore: function (sessionLocation) {

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this.init,
          this.close,
          this.save,
          this.saveAs,
          this.restore
        ]

      };

      vegas.init.register(session);

      return session;

    }());



  vegas.module.register('session.js');

})(this);

// To ease the pane of testing sessions:
// vegas.session.log(); // outputs serialized session to console
// vegas.session.load('testSession5'); // loads a named serialized session below
function getTestSessions () {
  var testSessions = {
    'testSession1' : {"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":{"type":"horizontal","region1":{"type":"vertical","region1":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"untitled 780"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 863"}}]},"region2":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"untitled 776"}}],"region2":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"untitled 239"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 351"}}]}}},"region2":{"type":"vertical","region1":{"type":"horizontal","region1":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"untitled 211"}}],"region2":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"untitled 513"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 443"}}]}},"region2":[{"type":"EditArea","properties":{"title":"untitled 596"}}]},"region2":[{"type":"EditArea","properties":{"title":"untitled 657"}}]}}},
    'testSession8' : [{"type":"EditArea","properties":{"title":"example 1"}}],
    'testSession2' : {"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]},
    'testSession3' : {"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]},
    'testSession4' : {"type":"horizontal","region1":{"type":"vertical","region1":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"untitled 93"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 530"}}]}},"region2":[{"type":"EditArea","properties":{"title":"untitled 15"}}]},"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]},
    'testSession5' : {"type":"horizontal","region1":{"type":"vertical","region1":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]},"region2":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]}},"region2":[{"type":"EditArea","properties":{"title":"example 1"}},{"type":"EditArea","properties":{"title":"example 1"}},{"type":"EditArea","properties":{"title":"example 1"}},{"type":"EditArea","properties":{"title":"example 1"}}]},
    'testSession6' : {"type":"vertical","region1":{"type":"horizontal","region1":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 947"}}]},"region2":[{"type":"EditArea","properties":{"title":"untitled 796"}}]},"region2":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 47"}}]}},
    'testSession7' : {"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":{"type":"horizontal","region1":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"untitled 847"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 387"}}]},"region2":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"untitled 297"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 239"}}]}}},
    'testSession8' : {"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":{"type":"horizontal","region1":{"type":"vertical","region1":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"untitled 780"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 863"}}]},"region2":{"type":"horizontal","region1":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"untitled 776"}}],"region2":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"untitled 417"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 61"}}]}},"region2":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"untitled 239"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 351"}}]}}},"region2":{"type":"vertical","region1":{"type":"horizontal","region1":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"untitled 211"}}],"region2":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"untitled 513"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 443"}}]}},"region2":[{"type":"EditArea","properties":{"title":"untitled 596"}}]},"region2":[{"type":"EditArea","properties":{"title":"untitled 657"}}]}}}
  };
  return testSessions;
}