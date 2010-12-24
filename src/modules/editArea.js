(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * @class EditArea
     * @memberOf vegas
     * @extends vegas.Region
     * @description A component where the cursor selection and text are visualized
     */
    vegas.EditArea = (function (data) {

      var EditArea = function () {
        vegas.utils.makeObject(this, arguments, vegas.Region);
				this.entity = 'EditArea';
      };

      EditArea.prototype = {
        /** @lends vegas.EditArea */
        init: function (data) {
          
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