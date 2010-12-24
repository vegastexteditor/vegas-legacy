/**
 * @fileOverview Contains macros subscribed to events
 */
(function (global) {
  var namespace = global.vegas,
      utils = namespace.utils;

var registered = {};

namespace.hook = {

  registered: {}, // Hooks that have been registered, after going through the system

  init: function () {

    var moduleName,
        module,
        proto,
        hooks,
        hook,
        paths,
        hookName,
        callback;

    for (moduleName in namespace) {

      module = namespace[moduleName];
      proto = (module.prototype !== undefined);
      hooks = false;

      if (!proto && module.hooks) {
        hooks = module.hooks;
      }
      else if (proto && module.prototype.hooks) {
        hooks = module.prototype.hooks;
      }

      if (hooks) {

        for (hook in hooks) {

          paths = hook.split('/');
          hookName = hook;
          
          if (paths.length === 1) {
            hookName = moduleName + '/' + hook;
            callback = hooks[hook];
            this.register(hookName, callback, moduleName);
          }
          else {
            callback = hooks[hook];
            this.register(hookName, callback, moduleName);
          }

        }

      }

    }

    this.registered = registered;

  },

  register: function (hook, callback, registeringModule) {

		if(!registered[hook]){
			registered[hook] = [];
		}

    var registrationInfo = {
      hook: hook,
      callback: callback,
      registeringModule: registeringModule
    }

		registered[hook].push(registrationInfo);

		return registrationInfo;

  },

  unregister: function (handle) {

//		var t = handle[0];
//		cache[t] && d.each(cache[t], function(idx){
//			if(this == handle[1]){
//				cache[t].splice(idx, 1);
//			}
//		});

  },

  invoke: function(hook, provided, adjustable){

    if (hook.indexOf('/') === -1) {
      hook = this.entity + '/' + hook;
    }

    if (hook in registered) {

      var registeredHook = registered[hook],
          cachedTopicLen = registeredHook.length,
          i = 0;

      for (; i < cachedTopicLen; i++) {
        registeredHook[i].callback.call(this, provided, adjustable);
      }

    }


	}

}

namespace.init.register(namespace.hook);

}(this));