/**
 * @file vegas.js
 * @author  Daniel Lopez <daniel.a.lopez@gmail.com>
 * @version 0.2-dev
 *
 * @section LICENSE
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details at
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @section DESCRIPTION
 *
 */
(function() {
  
  var global = (function(){return this;}).call();

  global.vegas = {};

  var vegas = global.vegas,

      bootstrap = ['modules/bootstrap.js'],

      thisFileName = 'vegas.js';
  /**
   * A hacked together simple module loader
   */
  vegas.module = (function(){

    var scripts = document.getElementsByTagName('script'),
        targetName = thisFileName,
        src,
        result,
        found;

    for (var i = 0; i < scripts.length; i++) {
      src = scripts[i].src;
      result = src.substring(src.length * 1,(src.length * 1) - targetName.length);
      if (result === targetName) {
        found = src;
      }
    }

    var APP_ROOT = found.split(targetName)[0];

    var module = {

      loadingModules: false,
      doingSync: false,
      loadedModules: [],
      loadQueue: [],

      register: function(name){
        console.info('loaded: ', name);
      },

      isLoaded: function (src) {
        for (var key in this.loadedModules) {
          if (this.loadedModules[key] == src) {
            return true;
          }
        }
        return false;
      },

      loadNextInQueue: function () {

        var next = this.loadQueue.shift();

        if(typeof(next) !== 'undefined'){
          this.loadJs(next);
        }
        else{
          this.loadingModules = false;
        }

      },

      loadJs: function (src) {

        console.info('loading: ' + src);

        var self = this,
            head = document.getElementsByTagName('head')[0],
            script = document.createElement('script');

        if (src.indexOf('http://') == -1) {
          src = APP_ROOT + src;
        }

        this.loadingModules = true;

        if (this.isLoaded(src)) {
          self.loadNextInQueue();
          return false;
        }

        script.onload = function(){
          self.loadedModules.push(src);
          self.loadNextInQueue.call(self);
        };

        script.type = 'text/javascript';
        script.src = src;

        head.appendChild(script);

        return true;

      },

      load: function (src, async) {

        async = async || false;

        if (!this.loadingModules || async) {
          this.loadJs(src);
        }
        else{
          this.loadQueue.push(src);
        }
        return true;
      }

    };

    var returnObject = {
      load: function (src, async) {
        module.load.call(module, src, async);
      },
      loadedModules: module.loadedModules,
      register: module.register
    };

    return returnObject;

  }());
  
  for (var i = 0; i < bootstrap.length; i++) {
    vegas.module.load(bootstrap[i]);
  }

})();