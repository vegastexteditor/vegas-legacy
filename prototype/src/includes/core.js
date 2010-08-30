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
 * [ ] shortcut combos, ctrl+c, ctrl+v, ctrl+left, ctrl+right, etc
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

Editor.init = function(){

    // Perform setup tasks
    Editor.core.setupCanvas();
    Editor.viewport.setup();
    Editor.core.attachEvents();
    Editor.highlighter.init();
    Editor.core.startPaint();

    return Editor;

}

Editor.core = {

  setupCanvas: function () {

    Editor.canvas = window.document.getElementById('textarea');
    Editor.core.ctx = Editor.canvas.getContext('2d');

    Editor.canvas.width = Editor.width;
    Editor.canvas.height = Editor.height;

    Editor.core.viewableHeight = Math.floor(Editor.height / Editor.font.height);

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
    window.clearInterval(Editor.paintId);
  },

  paint: function () {

    Editor.viewport.paintBackground();

    Editor.select.paintSelection();

    Editor.cursor.paint();

    if (typeof(Editor.highlighter.highlightedText) !== 'undefined' && Editor.highlighter.highlightedText.length > 0) {
      Editor.highlighter.paintHighlightedText();
      //Editor.core.paintText();
    }
    else{
      Editor.core.paintText();
    }

    Editor.scroll.paintBars();

    Editor.command.paintInfoBox();

    Editor.command.paintCommandArea();

  },
  
  paintText: function () {

    var ctx = Editor.core.ctx,
        row = Editor.cursor.row,
        posTop;

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = Editor.font.style;

    for (row =  Editor.scroll.charsFromtop; row < Editor.scroll.charsFromtop + Editor.core.viewableHeight; row++) {

      // Reached End Of File @todo:dirty
      if(typeof(Editor.text[row]) == 'undefined'){
        break;
      }

      posTop = (Editor.font.height * (row - Editor.scroll.charsFromtop + 1)) + Editor.position.top;

      ctx.fillText(
        Editor.text[row],
        Editor.position.left,
        posTop
      );

    }

  }


};