Editor.select = {

  attachEvents: function () {

    // Setup selection event logic
    jQuery(Editor.canvas).bind('mousedown', function (startEvent) {

      var inViewPort = (
        startEvent.clientY <= Editor.viewport.height + Editor.viewport.top &&
        startEvent.clientX <= Editor.viewport.width - Editor.viewport.left
      );

      if(inViewPort){

        jQuery(document).bind('mousemove.editSDid', function (moveEvent) {
          Editor.select.onStart(startEvent, moveEvent);
          Editor.select.selecting = true;
        });

        jQuery(document).bind('mouseup.editSDid', function (stopEvent) {

          if (Editor.select.selecting) {
            Editor.select.onStop(startEvent, stopEvent);
            Editor.select.selecting = false;
          }

          jQuery(document).unbind('mousemove.editSDid');
          jQuery(document).unbind('mouseup.editSDid');

        });

      }

      // Unselect the selection when the mouse goes down again
      Editor.select.unselect();


    });

  },

  paintSelection: function () {

    if(typeof(Editor.select.draw) !== 'undefined'){
      for (var i = 0; i < Editor.select.draw.length; i++) {
        Editor.core.ctx.fillStyle = "rgba(56,106,149, 1)";
        Editor.core.ctx.fillRect(
          Editor.select.draw[i][0],
          Editor.select.draw[i][1],
          Editor.select.draw[i][2],
          Editor.select.draw[i][3]
        );
      }
    }

  },

  removeSelection: function () {

    Editor.removeText(
      Editor.select.selectedTextInfo.startRow,
      Editor.select.selectedTextInfo.startCol,
      Editor.select.selectedText
    );

    Editor.select.unselect();
    
  },

  unselect: function() {
    Editor.select.draw = [];
    Editor.select.selectedText = [];
  },

  onStart: function (eStart, eMove, self) {

    var startX = eStart.clientX,
        startY = eStart.clientY,
        startCursorObj,
        moveX = eMove.clientX,
        moveY = eMove.clientY,
        moveCursorObj,
        movingLeftFromStart,
        movingRightFromStart,
        movingUpFromStart,
        movingDownFromStart,
        movingLeftFromLast,
        movingRightFromLast,
        movingUpFromLast,
        movingDownFromLast;

    startCursorObj = Editor.cursor.getFromXy(startX, startY);
    moveCursorObj = Editor.cursor.getFromXy(moveX, moveY);

    // Determine if we are moving left or right
    movingLeftFromStart = (startX > moveX);
    movingRightFromStart = (startX < moveX);

    // We havent been dragging yet
    if (typeof(Editor.select.currentCol) == 'undefined') {
      // Check if we are moving left or right from the original position
      movingLeftFromLast = movingLeftFromStart;
      movingRightFromLast = movingRightFromStart;
    }
    else {
      // Check if we are moving left or right from the current position
      movingLeftFromLast = (Editor.select.currentCol < moveCursorObj.col);
      movingRightFromLast = (Editor.select.currentCol > moveCursorObj.col);
    }

    // Moving left from the last position, and we are moving to a new position
    if (movingLeftFromLast && Editor.select.currentCol !== moveCursorObj.col) {
      Editor.select.currentCol = moveCursorObj.col;
    }

    // Moving right from the last position, and we are moving to a new position
    if (movingRightFromLast && Editor.select.currentCol !== moveCursorObj.col) {
      Editor.select.currentCol = moveCursorObj.col;
    }

    // Determine if we are moving up or down
    movingUpFromStart = (startY > moveY);
    movingDownFromStart = (startY < moveY);

    if (typeof(Editor.select.currentRow) == 'undefined') {
      // Check if we are moving up or down from the original position
      movingUpFromLast = movingUpFromStart;
      movingDownFromLast = movingDownFromStart;
    }
    else {
      // Check if we are moving up or down from the current position
      movingUpFromLast = (Editor.select.currentRow > moveCursorObj.row);
      movingDownFromLast = (Editor.select.currentRow < moveCursorObj.row);
    }

    if (movingUpFromLast && Editor.select.currentRow !== moveCursorObj.row) {
      Editor.select.currentRow = moveCursorObj.row;
    }

    if (movingDownFromLast && Editor.select.currentRow !== moveCursorObj.row) {
      Editor.select.currentRow = moveCursorObj.row;
    }

    // If they haven't moved anywhere then their where they started.
    if (typeof(Editor.select.currentRow) == 'undefined') {
      Editor.select.currentRow = startCursorObj.row;
    }

    if (typeof(Editor.select.currentCol) == 'undefined') {
      Editor.select.currentCol = startCursorObj.col;
    }

    /*
     * Now we know where the cursor PHYSICALLY has started and ended.
     *
     * - What col and row we started with:
     *    startCursorObj.col startCursorObj.row
     *
     * - What col and row we ended with:
     *  currentlySelectedCol and currentlySelectedRow
     *
     *  This is what we need, but not exactly what we want we need to perform
     *  SELECTION LOGIC.
     *
     *  For example:
     *
     *  If you start at row:0 col:5 and end at row:2 col:3, your selection will
     *  be everything after row:0 col 5 and all of row 1 and everything before
     *  row:2 col:3 etc...
     */

    var startCol = startCursorObj.col;
    var startRow = startCursorObj.row;
    var endCol = Editor.select.currentCol;
    var endRow = Editor.select.currentRow;

    /*
     * We can now pre-calculate the dimensions of the selection before the next
     * paint (the less painting we do the better, assuming the paint interval is
     * letss than the mouse move interval... uuh probably equal? dunno, but
     * going to assume paint gets called more for now.
     *
     */

    // Every row we have selected we are going to have to draw a rectangle
    // fore each of this rows we need the x,y,w,h of the rectangle
    var rects = [];
    var x, y, w, h, textBeforeSelectStart, selectedText, drawSelect = false;

    // Populate this array with the selected text
    Editor.select.selectedText = [];

    // The selection is at the same row it started
    if (endRow === startRow) {

      row = startRow;

      if (movingLeftFromStart) { // Moving left
        textBeforeSelectStart = Editor.text[row].substr(0,  endCol + 1);
        selectedText = Editor.text[row].substring(endCol + 1, startCol + 1);

        // @todo: left position has already been calculated pass it in
        Editor.cursor.moveTo(textBeforeSelectStart.length -1, row)

      }
      else { // moving right
        textBeforeSelectStart = Editor.text[row].substr(0, startCol + 1);
        selectedText = Editor.text[row].substring(startCol + 1, endCol + 1);

        // @todo: left position has already been calculated pass it in
        Editor.cursor.moveTo(textBeforeSelectStart.length + selectedText.length -1, row)
      
      }

      x = Editor.core.ctx.measureText(textBeforeSelectStart).width + Editor.position.left;
      w = Editor.core.ctx.measureText(selectedText).width;

      h = Editor.font.height;
      y = Editor.font.height * (row - Editor.scroll.charsFromtop) + Editor.position.top;

      // add to the array of rectangles the painter function will need to draw
      rects.push([x, y, w, h]);

      // Fill up the array of text that has just been selected
      Editor.select.selectedText.push(selectedText);
      
       var firstCol;

      if (movingLeftFromStart) {
        firstCol = endCol;
      }
      else {
        firstCol = startCol;
      }
      
      // Going to need this for: inserting over selected text
      Editor.select.selectedTextInfo = {
        'startCol' : firstCol,
        'startRow' : startRow
      };

      if (rects.length > 0) {
        Editor.select.draw = rects;
      }

      return;

    }

    // We are selecting upwards
    if (endRow < startRow) {

      // Loop through the selected rows from the lowest row to the highest row
      // counting up (7 6 5)
      for (var row = startRow; row >= endRow; row--) {

        // These are the rows between the start and end
        if (row < startRow && row > endRow) {

          // Select the entire row
          selectedText = Editor.text[row];
          x = Editor.position.left;
          w = Editor.viewport.width - Editor.position.left;

        }
        // This is FIRST row of the selection
        else if (row === endRow) {

          // Select all characters AFTER the cursor end col
          textBeforeSelectStart = Editor.text[row].substr(0, endCol + 1);
          selectedText = Editor.text[row].substr(0, Editor.text[row].length  - textBeforeSelectStart.length);
          x = Editor.core.ctx.measureText(textBeforeSelectStart).width + Editor.position.left;
          w = Editor.viewport.width - x;

        }
        // This is the LAST row of the selection
        else if (row === startRow) {

          // Select all characters BEFORE the cursor start col
          selectedText = Editor.text[row].substring(0, startCol + 1);
          x = Editor.position.left;
          w = Editor.core.ctx.measureText(selectedText).width;

        }

        h = Editor.font.height;
        y = Editor.font.height * (row - Editor.scroll.charsFromtop) + Editor.position.top;

        // add to the array of rectangles the painter function will need to draw
        rects.push([x, y, w, h]);
      // Going to need this for: inserting over selected text
      Editor.select.selectedTextInfo = {
        'startCol' : endCol,
        'startRow' : endRow
      };
        // Fill up the array of text that has just been selected
        Editor.select.selectedText.push(selectedText);

      }
      
      Editor.select.selectedText.reverse();

      // @todo: left position has already been calculated
      Editor.cursor.moveTo(textBeforeSelectStart.length -1, row + 1)

      if (rects.length > 0) {
        Editor.select.draw = rects;
      }

      return;

    }

    // We are selecting downwards
    if (endRow > startRow) {

      for (row = startRow; row <= endRow; row++) {

        // These are the rows between the start and end
        if (row > startRow && row < endRow) {

          // Select the entire row
          selectedText = Editor.text[row];
          x = Editor.position.left;
          w = Editor.viewport.width - Editor.position.left;

        }
        // This is FIRST row of the selection
        else if (row === startRow) {

          // Select all characters AFTER the cursor start col
          textBeforeSelectStart = Editor.text[row].substr(0, startCol + 1);
          selectedText = Editor.text[row].substring(startCol + 1, Editor.text[row].length);
          x = Editor.core.ctx.measureText(textBeforeSelectStart).width + Editor.position.left;
          w = Editor.viewport.width - x;

        }
        // This is LAST row of the selection
        else if (row === endRow) {

          // Select all characters AFTER the cursor start col
          selectedText = Editor.text[row].substring(0, endCol + 1);
          x = Editor.position.left;
          w = Editor.core.ctx.measureText(selectedText).width;
        }

      h = Editor.font.height;
      y = Editor.font.height * (row - Editor.scroll.charsFromtop) + Editor.position.top;

      // add to the array of rectangles the painter function will need to draw
      rects.push([x, y, w, h]);
      // Going to need this for: inserting over selected text
      Editor.select.selectedTextInfo = {
        'startCol' : startCol,
        'startRow' : startRow
      };

      // Fill up the array of text that has just been selected
      Editor.select.selectedText.push(selectedText);

      }

      // @todo: left position has already been calculated
      Editor.cursor.moveTo(selectedText.length -1, row - 1)

      if (rects.length > 0) {
        Editor.select.draw = rects;
      }

      return;

    }

  },

  onStop: function (eStart, eMove, eStop, self) {

    delete Editor.select.currentCol;
    delete Editor.select.currentRow;

    Editor.select.colLengthFromStart = 0;
    Editor.select.rowLengthFromStart = 0;

  }

};

Editor.select.draw = [];
Editor.select.rowLengthFromStart = 0;
Editor.select.rowLengthFromStart = 0;
Editor.select.selecting = false;