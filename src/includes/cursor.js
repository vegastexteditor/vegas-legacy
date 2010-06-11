Editor.cursor = {

  row : 0,

  col : -1,

  width : 1,
  
  pixelsLeft : Editor.position.left,


  attachEvents: function () {

    jQuery(Editor.canvas).bind('mousedown', function (e) {

      var inViewPort = (
        e.clientY <= Editor.viewport.height + Editor.viewport.top &&
        e.clientX <= Editor.viewport.width - Editor.viewport.left
      );

      if(inViewPort){

        var cursorObj = Editor.cursor.getFromXy(e.clientX, e.clientY);

        if (cursorObj !== false) {
          Editor.cursor.moveTo(cursorObj.col, cursorObj.row, cursorObj.left);
        }

      }

    });

  },

  paint: function () {

    var row = Editor.cursor.row,
        posTop,
        fontHeight = Editor.font.height;

    Editor.core.ctx.fillStyle = "rgba(255, 255, 255, 1)";

    posTop = (fontHeight * (row - Editor.scroll.charsFromtop + 1)) + Editor.position.top - fontHeight;

    Editor.core.ctx.fillRect(
      Editor.cursor.pixelsLeft,
      posTop,
      Editor.cursor.width,
      Editor.font.height
    );


  },

  
  moveDown: function () {

    // We are at NOT at the end of all rows
    if (Editor.cursor.row + 1 < Editor.text.length) {
      Editor.cursor.row += 1;
    }

    // If the row we moved to is empty
    if (Editor.text[Editor.cursor.row] === "") {
      Editor.cursor.moveHome();
    }

    // The row we moved to has less lines than the previous line
    if (Editor.text[Editor.cursor.row].length < Editor.text[Editor.cursor.row - 1].length) {
      Editor.cursor.moveEnd(); // go to the end of the line
    }

  },

  moveUp: function () {

    var row = Editor.cursor.row;

    if (row > 0) {
      Editor.cursor.row -= 1;
    }

    // If the row we moved to is empty
    if (Editor.text[row] === "") {
      Editor.cursor.moveHome(); // go to the first line
    }

    // The row we moved to has less lines than the previous line
    if (Editor.text[row].length < Editor.text[row + 1].length) {
      Editor.cursor.moveEnd(); // go to the end of the line
    }


  },

  moveLeft: function () {

    if (Editor.cursor.col >= 0) {
      Editor.cursor.moveTo(Editor.cursor.col - 1);
    }
    else {
      Editor.cursor.moveUp();
    }

  },

  moveRight: function () {

    if (Editor.cursor.col < Editor.text[Editor.cursor.row].length) {
      Editor.cursor.moveTo(Editor.cursor.col + 1);
    }
    else {
      Editor.cursor.moveDown();
    }

  },

  moveEnd: function () {
    var newPosition = Editor.text[Editor.cursor.row].length - 1;
    Editor.cursor.moveTo(newPosition);
  },

  moveHome: function () {
    var newPosition = -1;
    Editor.cursor.moveTo(newPosition);
  },

  getFromXy: function (x, y) {

    var topOfRow,
    bottomOfRow,
    foundRow = false,
    foundCol = false,
    cursorPosLeft;

    // Go through each text row
    for(var i = 0; i < Editor.text.length; i++) {

      // Find the top and bottom position the row
      topOfRow = (Editor.font.height * i) + Editor.position.top;
      bottomOfRow = topOfRow + Editor.font.height;

      // If Y is inbetween these pixels we found the row
      if (y >= topOfRow && y <= bottomOfRow) {
        foundRow = i +  Editor.scroll.charsFromtop;
        //now quit looping
        break;
      }
      // Y wasn't placed on a character
      else {

        // was it placed at the bottom of the doc?
        var bottomOfDocument = (Editor.text.length * Editor.font.height) +  Editor.position.top;

        if (y >= bottomOfDocument) {
          // the row is the last row of the document
          foundRow = Editor.text.length - 1;
        }

        if (y <= Editor.position.top) {
          // the row is the first row of the document
          foundRow = 0;
        }

      }

    }

    // We found the row, now lets find the col
    if (foundRow !== false) {

      var text = Editor.text[foundRow],
          rightOfLetter = Editor.position.top,
          leftOfLetter = rightOfLetter,
          col = 0,
          width,
          halfWidth;

      // Go through each character of text in the row
      for(i = 0; i < text.length; i++) {

        // Find the left and right position the character
        leftOfLetter = rightOfLetter;
        rightOfLetter += Editor.core.ctx.measureText(text[i]).width;

        // If X is inbetween these pixels we found the col
        if (x > leftOfLetter && x <= rightOfLetter) {

          // Figure out which side of the letter was clicked, left or right
          width = rightOfLetter - leftOfLetter;
          halfWidth = Math.floor(width / 2);

          // The left side of the letter was clicked
          if (x - leftOfLetter < halfWidth) {
            foundCol = col - 1;
            cursorPosLeft = leftOfLetter;
          }
          else { // Well then its gotta be the right.
            foundCol = col;
            cursorPosLeft = rightOfLetter;
          }

          // now quit looping
          break;
        }
        // If we are finished looping through the characters and haven't found
        // the col yet. see if x position is greater than the right character
        else if (i === text.length - 1 && x >= rightOfLetter) {
            // If so move to the end of the line
            foundCol = col;
            cursorPosLeft = rightOfLetter;
        }

        col++;

      }

      // Special cases
      if (foundCol === false) {

        // They clicked left from where the characters begin
        if (x <= Editor.position.left) {
           foundCol = -1;
           cursorPosLeft = Editor.position.left;
        }

        // An empty row was clicked
        if (text === "") {
           foundCol = -1;
           cursorPosLeft = Editor.position.left;
        }

      }

      if (foundCol !== false) {

        // we found the column and the row, as well as the position of the left
        // cursor in the case we need this else where.
        return {
          'col': foundCol,
          'row': foundRow,
          'left': cursorPosLeft
        };

      }
      else{
        console.error('getCursorFromXy() could not determine col');
        return false;
      }

    }
    else {
        console.error('getCursorFromXy() could not determine row');
      return false;
    }


  },

  moveTo: function (col, row, left, top) {


      if (typeof(col) !== 'undefined') {
        Editor.cursor.col = col;

        var textToMeasure = Editor.text[Editor.cursor.row].substring(0,Editor.cursor.col + 1);
        var textWidthBeforeCursor = Editor.core.ctx.measureText(textToMeasure).width;

        Editor.cursor.pixelsLeft = textWidthBeforeCursor + Editor.position.left;

      }

      if (typeof(row) !== 'undefined') {
        Editor.cursor.row = row;
      }

  }

};