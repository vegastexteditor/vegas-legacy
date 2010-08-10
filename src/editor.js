var module = (function(){

  var Module = {

    loadingModules: false,
    doingSync: false,
    loadedModules: [],
    loadQueue: [],

    isLoaded: function (src) {
      for (key in this.loadedModules) {
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
      var self = this,
          head = document.getElementsByTagName('head')[0],
          script = document.createElement('script');

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

  return {
    load: function (src, async) {
      Module.load.call(Module, src, async);
    },
    loadedModules: Module.loadedModules
  }

}());

/* This obviously can be done better... */
module.load('src/library/jquery/jquery-1.4.2.js');
module.load('src/library/jqueryhotkeys/jquery.hotkeys.js');
module.load('src/includes/edit.js');
module.load('src/settings.js');
module.load('src/includes/setup.js');
module.load('src/includes/cursor.js');
module.load('src/includes/select.js');
module.load('src/includes/command.js');
module.load('src/includes/viewport.js');
module.load('src/includes/handlers.js');
module.load('src/includes/keyMappings.js');
module.load('src/includes/highlighter.js');
module.load('src/library/codemirror/stringstream.js');
module.load('src/library/codemirror/tokenize.js');
module.load('src/library/codemirror/parsers/css/parsecss.js');
module.load('src/library/codemirror/parsers/xml/parsexml.js');
module.load('src/library/codemirror/parsers/javascript/tokenizejavascript.js');
module.load('src/library/codemirror/parsers/javascript/parsejavascript.js');
module.load('src/library/codemirror/parsers/htmlmixed/parsehtmlmixed.js');
module.load('src/includes/core.js');
module.load('src/includes/startup.js');
