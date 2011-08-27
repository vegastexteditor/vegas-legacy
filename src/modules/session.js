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
          this.createSession();
        },

        createSession: function (session) {

          session = session || this.getSession('default');

            function createSessionItems(sessionItem, parentRegion) {

              if (sessionItem.length) {
                for (var i = 0; i < sessionItem.length; i++) {
                  new vegas[sessionItem[i].type](sessionItem[i].properties, parentRegion);
                }
                return false;
              }

              var regionPair = new vegas.RegionPair(sessionItem.type, parentRegion)

              if (sessionItem.region1) {
                createSessionItems(sessionItem.region1, regionPair[0]);
              }

              if (sessionItem.region2) {
                createSessionItems(sessionItem.region2, regionPair[1]);
              }

            }

            var applicationRegion = vegas.application.insertApplicationRegion();

            createSessionItems(session, applicationRegion);

        },

        getCurrentSession: function () {

          var applicationRegion = vegas.regions[0];

          function getSessionItems(sessionItem, regions) {
            regions = regions || {};

            var regionPair = sessionItem.children();
            if (regionPair.length) {

              var regions = {'type': regionPair[0].orientation};

              regions.region1 = getSessionItems(regionPair[0], regions);

              regions.region2 = getSessionItems(regionPair[1], regions);

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

          return getSessionItems(applicationRegion);
        },

        getDefaultSession: function () {
            return 'testSession1'; // @todo: filesystem
        },

        getSession: function (sessionName) {

          var session = false;

          var sessionName = sessionName || this.getCurrentSession();

          if (sessionName == 'default') {
            sessionName = this.getDefaultSession();
          }

          if (!session) {
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

        emptySession: function () {
          vegas.regions = new vegas.Regions();
          vegas.components = new vegas.Components();
          vegas.gutters= new vegas.Gutters();
          vegas.tabs = new vegas.Tabs();
          // @todo;
        },

        loadSession: function (sessionName) {
          var session = this.getSession(sessionName) ;
          this.emptySession();
          this.createSession(session);
        },

        logSession: function (session) {
          session = this.getSession(session);
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
// vegas.session.logSession(); // outputs serialized session to console
// vegas.session.loadSession('testSession5'); // loads a named serialized session below
function getTestSessions () {
  var testSessions = {
    'testSession1' : [{"type":"EditArea","properties":{"title":"example 1"}}],
    'testSession2' : {"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]},
    'testSession3' : {"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]},
    'testSession4' : {"type":"horizontal","region1":{"type":"vertical","region1":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"untitled 93"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 530"}}]}},"region2":[{"type":"EditArea","properties":{"title":"untitled 15"}}]},"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]},
    'testSession5' : {"type":"horizontal","region1":{"type":"vertical","region1":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]},"region2":{"type":"vertical","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"example 1"}}]}},"region2":[{"type":"EditArea","properties":{"title":"example 1"}},{"type":"EditArea","properties":{"title":"example 1"}},{"type":"EditArea","properties":{"title":"example 1"}},{"type":"EditArea","properties":{"title":"example 1"}}]},
    'testSession6' : {"type":"vertical","region1":{"type":"horizontal","region1":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 947"}}]},"region2":[{"type":"EditArea","properties":{"title":"untitled 796"}}]},"region2":{"type":"horizontal","region1":[{"type":"EditArea","properties":{"title":"example 1"}}],"region2":[{"type":"EditArea","properties":{"title":"untitled 47"}}]}}
  };
  return testSessions;
}