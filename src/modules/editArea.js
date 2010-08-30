(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /**
     * A component where the cursor selection and text are visualized
     */
    vegas.EditArea = (function(){

      var EditArea = new Component('EditArea');

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