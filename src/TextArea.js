/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
/* (teh good parts) */

"use strict";

/*
 *
 * @todo: (everything)
 * [x] selection with mouse,
 * [X] cursor placement with mouse,
 * [ ] webkit support (all keys)
 * [ ] shortcut combos, ctrl+c, ctrl+v, ctrl+left, ctrl+right, etc
 * [ ] pageUp, PageDown,
 * [ ] backspace incomplete,
 * [ ] tabs are ghetto,
 * [ ] redo, undo
 * [ ] copy, paste,
 * [ ] scrolling (yikes),
 * [-] textwrapping (eh, dont need this for code editor and this is what i'm
 *     going to be using it for (low priority)
 *
 */

function TextArea() {

  // Perform setup tasks
  this.setupSettings();
  this.setupEditor();
  this.setupCanvas();
  this.attachEvents();
  this.startPaint();

  return this;

}

TextArea.prototype = {

  setupSettings: function () {

    var settings = {};

    settings.font = {};
    settings.font.family = "Monospace";
    settings.font.size = 13;

    settings.pagingAmount = 5;

    settings.keyToFunction = {
      'enter' : 'handleEnter',
      'backspace' : 'handleBackspace',
      'tab' : 'handleTab',
      'up' : 'handleUp',
      'down' : 'handleDown',
      'left' : 'handleLeft',
      'right' : 'handleRight',
      'pageDown' : 'handlePageDown',
      'pageUp' : 'handlePageUp',
      'home' : 'handleHome',
      'end' : 'handleEnd',
      'delete' : 'handleDelete'
    };

    settings.width = 800; // document.width;
    settings.height = 600; //document.height;

    this.settings = settings;

  },

  setupEditor: function () {

    var settings = this.settings;

    // really ugly setup stuff
    this.selectColLenFromStart = 0;
    this.selectRowLenFromStart = 0;
    this.selecting = false;
    this.drawSelection = [];

    this.top = 5;
    this.left = 5;
    this.margin = 5;

    this.font = {};
    this.font.height = settings.font.size;
    this.font.style = settings.font.size + 'px ' + settings.font.family;

    this.position = {};
    this.position.left = this.left + this.margin;
    this.position.top = this.top + this.margin;

    this.cursor = {};
    this.cursor.row = 0;
    this.cursor.col = -1;
    this.cursor.width = 1;
    this.cursor.pixelsLeft = this.position.left;

    this.width = this.settings.width;
    this.height = this.settings.height;

    // e.keyCode to word mapping (aka special keys)
    this.keycodeToWord = {
      '8'  : 'backspace',
      '9'  : 'tab',
      '13' : 'enter',
      '16' : 'shift',
      '17' : 'ctrl',
      '18' : 'alt',
      '19' : 'pause',
      '20' : 'capsLock',
      '27' : 'escape',
      '33' : 'pageUp',
      '34' : 'pageDown',
      '35' : 'end',
      '36' : 'home',
      '37' : 'left',
      '38' : 'up',
      '39' : 'right',
      '40' : 'down',
      '45' : 'insert',
      '46' : 'delete'
    };

    this.text = [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
      'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,',
      'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo',
      'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse',
      'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat',
      'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ];


  },

  setupCanvas: function () {

    this.canvas = window.document.getElementById('textarea');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.width;
    this.canvas.height = this.height;

  },

  attachEvents: function () {

    var self = this;

    jQuery(document).bind('keypress', function (e) {
      self.handleKeyEvent(e, self)
    });


    jQuery(document).bind('mousedown', function (e) {
      self.handleClickEvent(e, self);
    });


    // Setup selection event logic
    jQuery(document).bind('mousedown', function (startEvent) {

      jQuery(document).bind('mousemove.editSDid', function (moveEvent) {
        self.selectHandleOnDrag(startEvent, moveEvent, self);
        self.selecting = true;
      });

      jQuery(document).bind('mouseup.editSDid', function (stopEvent) {
        
        if ( self.someTest) {
          self.selectHandleOnDragStop(startEvent, stopEvent, self);
          self.selecting = false;
        }

        jQuery(document).unbind('mousemove.editSDid');
        jQuery(document).unbind('mouseup.editSDid');

      });

    });
    
  },

  handleClickEvent: function (e, self) {
    var cursorObj = self.getCursorFromXy(e.clientX, e.clientY);

    if (cursorObj !== false) {
      self.cursorMoveTo(cursorObj.col, cursorObj.row, cursorObj.left);
    }
    else {
      console.log('clicked outside of text');
    }

    self.selectUnselect();

  },

  handleKeyEvent: function (e, self) {

    var letter,
        keyFunctionName,
        specialKeyName,
        textBeforeCursor,
        textBeforeCursorWidth,
        keyActionResult = false,
        keyCode,
        specialKeyPressed = false;

    if (e.charCode) {
      keyCode = e.charCode;
    }
    else {
      keyCode = e.keyCode;
    }

    try { // gross maybe i should learn some javascript...
      if (keyCode && typeof(self.keycodeToWord[keyCode]) !== 'undefined') {
        specialKeyPressed = true;
        specialKeyName = self.keycodeToWord[keyCode];
        keyFunctionName = self.settings.keyToFunction[specialKeyName];
      }
    }catch(e) {}

    // A special key was pressed (tab, backspace, up, down, pageup, etc)
    if (specialKeyPressed) {
      // execute the function that has been mapped to it
      keyActionResult = self[keyFunctionName]();
    }

    // A normal key was pressed. (eg. AB#$%^&|\) not (tab, backspace, up, down,
    // pageup, etc) OR a special key returned has characters for us to output
    if (!specialKeyPressed || keyActionResult !== false) {

      letter = String.fromCharCode(e.charCode);

      // The special key returned letter(s) to be written
      if (keyActionResult !== false) {
        letter = keyActionResult;
      }

      self.insertText(letter);

    }

    // Get the position of the cursor ready for the paint cycle
    textBeforeCursor = self.text[self.cursor.row].substr(0, self.cursor.col + 1);
    textBeforeCursorWidth = self.ctx.measureText(textBeforeCursor).width;

    self.cursor.pixelsLeft = textBeforeCursorWidth + self.position.left;
  },

  selectUnselect: function() {
    this.drawSelection = [];
  },

  selectHandleOnDrag: function (eStart, eMove, self) {
    
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

    startCursorObj = self.getCursorFromXy(startX, startY);
    moveCursorObj = self.getCursorFromXy(moveX, moveY);

    // Determine if we are moving left or right
    movingLeftFromStart = (startX > moveX);
    movingRightFromStart = (startX < moveX);

    // We havent been dragging yet
    if (typeof(this.currentlySelectedCol) == 'undefined') {
      // Check if we are moving left or right from the original position
      movingLeftFromLast = movingLeftFromStart;
      movingRightFromLast = movingRightFromStart;
    }
    else {
      // Check if we are moving left or right from the current position
      movingLeftFromLast = (this.currentlySelectedCol < moveCursorObj.col);
      movingRightFromLast = (this.currentlySelectedCol > moveCursorObj.col);
    }

    // Moving left from the last position, and we are moving to a new position
    if (movingLeftFromLast && this.currentlySelectedCol !== moveCursorObj.col) {
      this.currentlySelectedCol = moveCursorObj.col;
    }

    // Moving right from the last position, and we are moving to a new position
    if (movingRightFromLast && this.currentlySelectedCol !== moveCursorObj.col) {
      this.currentlySelectedCol = moveCursorObj.col;
    }

    // Determine if we are moving up or down
    movingUpFromStart = (startY > moveY);
    movingDownFromStart = (startY < moveY);

    if (typeof(this.currentlySelectedRow) == 'undefined') {
      // Check if we are moving up or down from the original position
      movingUpFromLast = movingUpFromStart;
      movingDownFromLast = movingDownFromStart;
    }
    else {
      // Check if we are moving up or down from the current position
      movingUpFromLast = (this.currentlySelectedRow > moveCursorObj.row);
      movingDownFromLast = (this.currentlySelectedRow < moveCursorObj.row);
    }

    if (movingUpFromLast && this.currentlySelectedRow !== moveCursorObj.row) {
      this.currentlySelectedRow = moveCursorObj.row;
    }

    if (movingDownFromLast && this.currentlySelectedRow !== moveCursorObj.row) {
      this.currentlySelectedRow = moveCursorObj.row;
    }

    // If they haven't moved anywhere then their where they started.
    if (typeof(this.currentlySelectedRow) == 'undefined') {
      this.currentlySelectedRow = startCursorObj.row;
    }

    if (typeof(this.currentlySelectedCol) == 'undefined') {
      this.currentlySelectedCol = startCursorObj.col;
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
    var endCol = this.currentlySelectedCol;
    var endRow = this.currentlySelectedRow;

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
    this.selectedTextArray = [];

    // The selection is at the same row it started
    if (endRow === startRow) {

      row = startRow;

      if (movingLeftFromStart) { // Moving left
        textBeforeSelectStart = this.text[row].substr(0,  endCol + 1);
        selectedText = this.text[row].substring(endCol + 1, startCol + 1);
      }
      else { // moving right
        textBeforeSelectStart = this.text[row].substr(0, startCol + 1);
        selectedText = this.text[row].substring(startCol + 1, endCol + 1);
      }

      x = this.ctx.measureText(textBeforeSelectStart).width + this.position.left;
      w = this.ctx.measureText(selectedText).width;

      h = this.font.height;
      y = this.font.height * row + this.position.top;

      // add to the array of rectangles the painter function will need to draw
      rects.push([x, y, w, h]);

      // Fill up the array of text that has just been selected
      this.selectedTextArray.push(selectedText);

      if (rects.length > 0) {
        this.drawSelection = rects;
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
          selectedText = this.text[row];
          x = this.position.left;
          w = this.settings.width;

        }
        // This is FIRST row of the selection
        else if (row === endRow) {

          // Select all characters AFTER the cursor end col
          textBeforeSelectStart = this.text[row].substr(0, endCol + 1);
          selectedText = this.text[row].substr(0, this.text[row].length  - textBeforeSelectStart.length);
          x = this.ctx.measureText(textBeforeSelectStart).width + this.position.left;
          w = this.settings.width;
          
        }
        // This is the LAST row of the selection
        else if (row === startRow) {

          // Select all characters BEFORE the cursor start col
          selectedText = this.text[row].substring(0, startCol + 1);
          x = this.position.left;
          w = this.ctx.measureText(selectedText).width;

        }

        h = this.font.height;
        y = this.font.height * row + this.position.top;

        // add to the array of rectangles the painter function will need to draw
        rects.push([x, y, w, h]);

        // Fill up the array of text that has just been selected
        this.selectedTextArray.push(selectedText);
        this.selectedTextArray.reverse();

      }

      if (rects.length > 0) {
        this.drawSelection = rects;
      }

      return;
    
    }

    // We are selecting downwards
    if (endRow > startRow) {

      for (row = startRow; row <= endRow; row++) {

        // These are the rows between the start and end
        if (row > startRow && row < endRow) {
          
          // Select the entire row
          selectedText = this.text[row];
          x = this.position.left;
          w = this.settings.width;

        }
        // This is FIRST row of the selection
        else if (row === startRow) {

          // Select all characters AFTER the cursor start col
          textBeforeSelectStart = this.text[row].substr(0, startCol + 1);
          selectedText = this.text[row].substring(startCol + 1, this.text[row].length);
          x = this.ctx.measureText(textBeforeSelectStart).width + this.position.left;
          w = this.settings.width;

        }
        // This is LAST row of the selection
        else if (row === endRow) {

          // Select all characters AFTER the cursor start col
          selectedText = this.text[row].substring(0, endCol + 1);
          x = this.position.left;
          w = this.ctx.measureText(selectedText).width;
        }

      h = this.font.height;
      y = this.font.height * row + this.position.top;

      // add to the array of rectangles the painter function will need to draw
      rects.push([x, y, w, h]);

      // Fill up the array of text that has just been selected
      this.selectedTextArray.push(selectedText);

      }

      if (rects.length > 0) {
        this.drawSelection = rects;
      }

      return;

    }

  },

  selectHandleOnDragStop: function (eStart, eMove, eStop, self) {

    console.log(this.selectedTextArray);

    delete this.currentlySelectedCol;
    delete this.currentlySelectedRow;

    this.selectColLenFromStart = 0;
    this.selectRowLenFromStart = 0;

  },

  startPaint: function () {
    var self = this;
    // Start the drawing loop
    this.paintId = window.setInterval(function () {
      self.paint();
    }, 1);

  },

  stopPaint: function () {
    var self = this;
    window.clearInterval(self.paintId);
  },

  paint: function () {

    var ctx = this.ctx,
        fontHeight = this.font.height,
        row = this.cursor.row;


    if (this.onlyRenderActiveLine) {
      // Clear everything except for the row that we are currently rendering it
      // would better performance but would have to keep track of which lines
      // to rerender, which could become pretty insane.
      ctx.clearRect(
        0,
        fontHeight  * row - fontHeight - 1 + this.font.height,
        this.canvas.width, fontHeight + 1,
        800
      );
    }
    else {

      ctx.fillStyle = "rgba(24, 44, 79, 1)";
      ctx.fillRect(0, 0, this.width, this.height);

    }

    // console.log(this.drawSelection);
      for (var i = 0; i < this.drawSelection.length; i++) {
        ctx.fillStyle = "rgba(0, 157, 255, 1)";
        ctx.fillRect(
          this.drawSelection[i][0],
          this.drawSelection[i][1],
          this.drawSelection[i][2],
          this.drawSelection[i][3]
        ); 
      }

    this.paintCursor();

    this.paintText();

    // this.stopPaint();

  },

  paintCursor: function () {

    var row = this.cursor.row,
        posTop,
        fontHeight = this.font.height;

    this.ctx.fillStyle = "rgba(255, 255, 255, 1)";

    posTop = (fontHeight * (row + 1)) + this.position.top - fontHeight;

    this.ctx.fillRect(
      this.cursor.pixelsLeft,
      posTop,
      this.cursor.width,
      this.font.height
    );

  },

  paintText: function () {

    var ctx = this.ctx,
        row = this.cursor.row,
        posTop;

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = this.font.style;
    ctx.textBaseline = 'bottom';

    if (this.onlyRenderActiveLine) {

      ctx.fillText(
        this.text[row],
        this.position.left,
        posTop
      );

    }
    else {

      for (row = 0; row < this.text.length; row += 1) {

        posTop = (this.font.height * (row + 1)) + this.position.top;

        ctx.fillText(
          this.text[row],
          this.position.left,
          posTop
        );

      }

    }

  },

  /**
   * Inserts the specified text to the to the cursors position.
   *
   * @todo: over-confident function, should handle all text (not just simple
   * small strings) for upcoming copy and paste, etc
   *
   */
  insertText: function (text) {

    var textBeforeCursor,
        textAfterCursor;

    // A line in the text index array has not been added yet
    if (!this.text[this.cursor.row]) {
      this.text[this.cursor.row] = text; // initiate the new line with the letter
    }
    else if (this.cursor.col === this.text[this.cursor.row].length) {
      // A line exists and we are at the end of it
      this.text[this.cursor.row] += text; // append letter to the existing line
    }
    else {
      // The cursor is somewhere in the string
      textBeforeCursor = this.text[this.cursor.row].substr(0, this.cursor.col + 1);
      textAfterCursor =  this.text[this.cursor.row].substr(this.cursor.col + 1);
      this.text[this.cursor.row] = textBeforeCursor + text + textAfterCursor;
    }

    this.cursor.col += text.length;

  },

  cursorMoveDown: function () {

    // We are at NOT at the end of all rows
    if (this.cursor.row + 1 < this.text.length) {
      this.cursor.row += 1;
    }

    // If the row we moved to is empty
    if (this.text[this.cursor.row] === "") {
      this.cursorMoveHome();
    }

    // The row we moved to has less lines than the previous line
    if (this.text[this.cursor.row].length < this.text[this.cursor.row - 1].length) {
      this.cursorMoveEnd(); // go to the end of the line
    }

  },

  cursorMoveUp: function () {

    var row = this.cursor.row;

    if (row > 0) {
      this.cursor.row -= 1;
    }

    // If the row we moved to is empty
    if (this.text[row] === "") {
      this.cursorMoveHome(); // go to the first line
    }

    // The row we moved to has less lines than the previous line
    if (this.text[row].length < this.text[row + 1].length) {
      this.cursorMoveEnd(); // go to the end of the line
    }


  },

  cursorMoveLeft: function () {

    if (this.cursor.col >= 0) {
      this.cursor.col -= 1;
    }
    else {
      this.cursorMoveUp();
    }

  },

  cursorMoveRight: function () {

    if (this.cursor.col < this.text[this.cursor.row].length) {
      this.cursor.col += 1;
    }
    else {
      this.cursorMoveDown();
    }

  },

  cursorMoveEnd: function () {
    this.cursor.col = this.text[this.cursor.row].length - 1;
  },

  cursorMoveHome: function () {
    this.cursor.col = -1;
  },

  getCursorFromXy: function (x, y) {

    var topOfRow,
    bottomOfRow,
    foundRow = false,
    foundCol = false,
    cursorPosLeft;

    // Go through each text row
    for(var i = 0; i < this.text.length; i++) {

      // Find the top and bottom position the row
      topOfRow = (this.font.height * i ) + this.position.top;
      bottomOfRow = topOfRow + this.font.height;

      // If Y is inbetween these pixels we found the row
      if (y >= topOfRow && y <= bottomOfRow) {
        foundRow = i;
        //now quit looping
        break;
      }
      // Y wasn't placed on a character
      else {

        // was it placed at the bottom of the doc?
        var bottomOfDocument = (this.text.length * this.font.height) +  this.position.top;

        if (y >= bottomOfDocument) {
          // the row is the last row of the document
          foundRow = this.text.length - 1;
        }

      }

    }

    // We found the row, now lets find the col
    if (foundRow !== false) {

      var text = this.text[foundRow],
          rightOfLetter = this.position.top,
          leftOfLetter = rightOfLetter,
          col = 0,
          width,
          halfWidth;

      // Go through each character of text in the row
      for(i = 0; i < text.length; i++) {


        // Find the left and right position the character
        leftOfLetter = rightOfLetter;
        rightOfLetter += this.ctx.measureText(text[i]).width;

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

      if (foundCol !== false) {
        // we found the column and the row, as well as the position of the left
        // cursor in the case we need this else where.
        return {
          'col': foundCol,
          'row': foundRow,
          'left': cursorPosLeft
        };

      }
      else {
        // console.error('getCursorFromXy() could not determine col');
        return false;
      }

    }
    else {
      // console.error('getCursorFromXy() could not determine row');
      return false;
    }


  },

  cursorMoveTo: function (col, row, left, top) {

    if (typeof(col) !== 'undefined') {
      
      this.cursor.col = col;

      if (typeof(row) !== 'undefined') {
        this.cursor.row = row;
      }

      if (typeof(left) !== 'undefined') {
        this.cursor.pixelsLeft = left;
      }

      if (typeof(top) !== 'undefined') {
        this.cursor.pixelsLeft = top;
      }

    }
    else {
      console.error('missing col param in cursorMoveTo');
    }

  },

  /*
   * This is super expensive function, should be using something like this:
   * http://ejohn.org/blog/javascript-array-remove/
   *
   * @todo: bring from prototype to a this member function
   *
   */
  removeRows: function (startAtRow, numOfRowsToDelete) {

    var rowsBeforeDeletion,
        rowsAfterDeletion,
        deletionResult = [],
        row,
        text = this.text;

    if (!numOfRowsToDelete) {
      numOfRowsToDelete = 1;
    }

    rowsBeforeDeletion = text.slice(0, startAtRow);
    rowsAfterDeletion = text.slice(startAtRow + numOfRowsToDelete, text.length);

    for (row = 0; row < rowsBeforeDeletion.length; row += 1) {
      deletionResult.push(rowsBeforeDeletion[row]);
    }

    for (row = 0; row < rowsAfterDeletion.length; row += 1) {
      deletionResult.push(rowsAfterDeletion[row]);
    }

    this.text = deletionResult;

  },

  removeCharacters: function (row, col, numOfCharsToDelete) {

    var textArea = this,
        characterPosLeft,
        textBeforeDeletion,
        textAfterDeletion,
        deletionResult,
        text = textArea.text[row];

    if (!numOfCharsToDelete) {
      numOfCharsToDelete = 1;
    }

    characterPosLeft = col + 1;

    textBeforeDeletion = text.substr(0, characterPosLeft - numOfCharsToDelete);
    textAfterDeletion = text.substr(characterPosLeft);

    deletionResult = textBeforeDeletion + textAfterDeletion;

    return deletionResult;

  },

  /*
   * Key Actions
   */
  handleBackspace: function () {

    var text = this.text,
        row = this.cursor.row,
        col = this.cursor.col;

    // If the line is empty already go to the previous line.
    if (!text[row] || text[row] === "") {

      this.cursorMoveUp();
      this.cursorMoveEnd();

      if (text[row] === "") {
        this.removeRows(row);
      }

    }
    else {
      text[row] = this.removeCharacters(row, col);
      this.cursorMoveLeft();
    }

    return false;

  },

  handleDelete: function () {

    var text = this.text,
        row = this.cursor.row,
        col = this.cursor.col;

    // The current line is empty
    if (!text[row] || text[row] === "") {

      // The next line is empty
      if (!text[row + 1] || text[row + 1] === "") {
        this.removeRows(row + 1); // remove the next line
      }
      // The next line has something
      else {
        this.removeRows(row);  // remove the current line
      }

    }
    else {
      // The current line isnt empty

      // There are no characters after the cusor in the current row
      if (this.cursor.col === text[row].length - 1) {

        // and we arent at the end of all rows
        if (row + 1 < text.length) {

          // append the next row to the end of the current row
          text[row] = text[row] + text[row + 1];

          // delete the next row
          this.removeRows(row + 1);

        }

      }
      else {

        // remove the character after the cursor
        text[row] = this.removeCharacters(row, col + 1);
      }

    }

    return false;

  },

  handleEnter: function () {

    var textBeforeCursor,
        textAfterCursor,
        col = this.cursor.col,
        row = this.cursor.row;

    // The next row is doesnt exist
    if (!this.text[this.cursor.row + 1]) {
      this.text[this.cursor.row + 1] = ''; // create an empty row
    }

    textBeforeCursor = this.text[row].substr(0, col + 1);
    textAfterCursor = this.text[row].substr(col + 1);

    this.text[row] = textAfterCursor;

    this.text.splice(row, 0, textBeforeCursor);

    this.cursorMoveHome();

    // Move the cursor to the next row
    this.cursorMoveDown();

    return false;
  },

  handleUp: function () {
    this.cursorMoveUp();
    return false;
  },

  handleDown: function () {
    this.cursorMoveDown();
    return false;
  },

  handleLeft: function () {
    this.cursorMoveLeft();
    return false;
  },

  handleRight: function () {
    this.cursorMoveRight();
    return false;
  },

  handlePageUp: function () {
    this.cursor.row -= this.settings.pagingAmount;
    return false;
  },

  handlePageDown: function () {
    this.cursor.row += this.settings.pagingAmount;
    return false;
  },

  handleHome: function () {
    this.cursorMoveHome();
    return false;
  },

  handleEnd: function () {
    this.cursorMoveEnd();
    return false;
  },

  handleTab: function () {
    return '  ';
  }

};