(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * Gives the file context, defines the root of the project, via a project
     * definition file or from version control)
     *
     * Scope ends up as a property on the resource object.
     *
     */
    vegas.Scope = (function () {

      var Scope = function () {
        vegas.utils.makeObject(this, arguments);
      };

      Scope.prototype = {

        init: function () {
          
        }

      };

      return Scope;

    }());

  vegas.module.register('scope.js');

}())