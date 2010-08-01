/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
/* (teh good parts) */

"use strict";

/*
 *
 * @todo: (everything)
 * [x] selection with mouse,
 * [X] cursor placement with mouse,
 * [x] webkit support (all keys)
 * [-] scrolling,
 * [ ] shortcut combos, ctrl+c, ctrl+v,  ctrl+left, ctrl+right, etc
 * [ ] pageUp, PageDown,
 * [ ] backspace incomplete,
 * [ ] tabs are ghetto,
 * [ ] redo, undo
 * [ ] copy, paste,
 * [ ] command area
 * [-] textwrapping (eh, dont need this for code editor and this is what i'm
 *     going to be using it for (low priority)
 *
 */

Editor.init = function(editArea){

    Editor.canvas = editArea;

    // Perform setup tasks
    Editor.core.setupCanvas();
    Editor.core.setupText();
    Editor.viewport.setup();
    Editor.core.attachEvents();
    Editor.core.startPaint();

    return Editor;

}

Editor.core = {

  setupCanvas: function () {
    
    Editor.core.ctx = Editor.canvas.getContext('2d');

    Editor.canvas.width = Editor.width;
    Editor.canvas.height = Editor.height;

    Editor.core.viewableHeight = Math.floor(Editor.height / Editor.font.height);

  },

  setupText: function () {

    var ctx = Editor.core.ctx;
    
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = Editor.font.style;
    ctx.textBaseline = 'bottom';

    Editor.core.checkFixedWidth();

  },

  attachEvents: function () {

    var self = this;

    jQuery(document).bind('keypress', function (e) {
      Editor.core.handleKeyEvent(e, self)
    });

    Editor.viewport.attachEvents();

    Editor.cursor.attachEvents();

    Editor.select.attachEvents();
    
  },

  handleKeyEvent: function (e, self) {

    var letter,
        textBeforeCursor,
        textBeforeCursorWidth;

      if(Editor.mode !== 'insert'){
        return false;
      }

      if (e.charCode) {

        letter = String.fromCharCode(e.charCode)

        if(typeof(letter) == "string"){

          Editor.insertText(letter);

          // Get the position of the cursor ready for the paint cycle
          textBeforeCursor = Editor.text[Editor.cursor.row].substr(0, Editor.cursor.col + 1);
          textBeforeCursorWidth = Editor.core.ctx.measureText(textBeforeCursor).width;

          Editor.cursor.pixelsLeft = textBeforeCursorWidth + Editor.position.left;

        }

      }

  },

  startPaint: function () {

    //Start the drawing loop
    Editor.paintId = window.setInterval(function () {
      Editor.core.paint();
    }, 1);

  },

  stopPaint: function () {
    var self = this;
    window.clearInterval(self.paintId);
  },

  paint: function () {

    Editor.viewport.paintBackground();

    Editor.select.paintSelection();

    Editor.cursor.paint();

    Editor.core.paintText();

    Editor.scroll.paintBars();

    Editor.command.paintInfoBox();

    Editor.command.paintCommandArea();

  },

  paintText: function () {

    var row = Editor.cursor.row,
        posTop;

    for (row =  Editor.scroll.charsFromtop; row < Editor.scroll.charsFromtop + Editor.core.viewableHeight; row++) {

      // Reached End Of File @todo:dirty
      if(typeof(Editor.text[row]) == 'undefined'){
        break;
      }

      posTop = (Editor.font.height * (row - Editor.scroll.charsFromtop + 1)) + Editor.position.top;

      Editor.core.ctx.fillText(
        Editor.text[row],
        Editor.position.left,
        posTop
      );

    }

  },

  /*
   * Determine if the font is truely fixed width.
   * 
   * Accuracy is the priority here since this could screw up the application
   * royally if we get this wrong.
   *
   * use Editor.font.fixedWidth instead of always calling this function.
   *
   * checkFixedWidth should be ran at runtime.
   *
   */
  checkFixedWidth: function () {

    var LetterWidth,
        lastLetterWidth;

    var characters = 'abcdefghijklmnopqrstuvwxyz1234567890 !@#$%^&*()-=_+`~[]\;\',./{}|:"<>?';

    LetterWidth = Editor.core.ctx.measureText(characters[0]).width;

    for (var i = 1; i < characters.length; i++) {
      lastLetterWidth = LetterWidth;
      LetterWidth = Editor.core.ctx.measureText(characters[i]).width;

      if (lastLetterWidth !== LetterWidth) {
        Editor.font.fixedWidth = false;
        return false;
        break;
      }

    }
    
    Editor.font.fixedWidth = true;
    Editor.font.width = LetterWidth;

    return true;

  },

  measureText: function (text) {

    if(Editor.font.fixedWidth){
      return {width:text.length * Editor.font.width, height: Editor.font.height};
    }
    else{
      return Editor.core.ctx.measureText(text);
    }

  }


};