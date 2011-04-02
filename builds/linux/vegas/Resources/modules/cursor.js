(function () {
  var global = (function () {return this;}).call(),
      vegas = global.vegas,
      utils = vegas.utils;

  /**
   * @class Cursor
   * @memberOf vegas
   * @description Text editor cursor
   * @param Buffer an instance of the Buffer object
   * @param options an object containing
   */
  vegas.Cursor = function (region, options) {
    vegas.utils.makeObject(this, arguments);
  };

  /** @lends vegas.Cursor */
  vegas.Cursor.prototype = {

    init: function (region, options) {

      this.row = 0;
      this.col = 0;
      this.region = region;

    },

    paint: function (view) {

      view = view || vegas.session.state.activeView;

      var ctx = view.ctx,
          row = this.row,
          posTop,
          region = this.region,
          options = region.options,
          fontHeight = options.font.size,
          textPoint = region.getTextPoint();

      ctx.fillStyle = options.cursor.color;

      posTop = (fontHeight * (row - region.scrollbar.charsFromtop + 1)) + textPoint.y;

      ctx.fillRect(
        textPoint.x,
        posTop,
        options.cursor.width,
        options.cursor.height
      );

    },

    events: function () {

    },

    getFromXy: function () {

    },

    down: function () {

    },

    up: function () {

    },

    left: function () {

    },

    right: function () {

    },

    home: function () {

    },

    end: function () {

    },

    nextWord: function () {

    },

    prevWord: function () {

    },

    nextBlock: function () {

    },

    prevBlock: function () {

    },

    nextSmart: function () {

    },

    prevSmart: function () {

    },

    top: function () {

    },

    bottom: function () {

    },

    api: [
    ]

  };

  /**
   * @class Cursors
   * @memberOf vegas
   * @extends vegas.utils.ObjectCollection
   *
   * @description An object, that when instantiated will provide a listing of
   * Cursor objects with methods to work with them.
   */
  vegas.Cursors = function () {
    utils.makeObject(this, arguments, utils.ObjectCollection);
  };

  vegas.Cursors.prototype = {

  };

  // Creates an instance of the Cursors collection for keeping track of cursors.
  vegas.cursors = new vegas.Cursors();

  vegas.module.register('cursor.js');

}());