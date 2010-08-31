(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * A component where the cursor selection and text are visualized
     */
    vegas.EditArea = (function () {

      var EditArea = function () {};

      EditArea.prototype = {

        init: function () {

        },

        paint: function () {

        },

        api: [
        ]

      };

      return EditArea;

    }());

  vegas.module.register('editArea.js');

}());