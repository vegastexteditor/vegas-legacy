(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas;

    /**
     * @class EditArea
     * @memberOf vegas
     * @extends vegas.Region
     * @description A component where the cursor selection and text are visualized
     */
      vegas.EditArea = function (data, region) {
        vegas.utils.makeObject(this, arguments, vegas.Component);
        vegas.utils.extend(this, data);
        this.region = region;
        this.init();
      };

      vegas.EditArea.prototype = {
        /** @lends vegas.EditArea */
        init: function () {
          this.entity = 'EditArea';
          this.type = 'EditArea';
          this.insertComponentStructure();
        },

        componentStructure: function () {
          var structure = '<canvas></canvas>';
          return structure;
        },

      };

  vegas.module.register('editArea.js');

}());