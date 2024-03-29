Editor.keyhandlers = {

  /*
   * Key Actions
   */
  handleBackspace: function () {

    var text = Editor.text,
        row = Editor.cursor.row,
        col = Editor.cursor.col;

    // Text is currently selected
    if (Editor.select.selectedText.length > 0) {
       Editor.select.removeSelection();
      return false;
    }

    // If the line is empty already go to the previous line.
    if (!text[row] || text[row] === "") {

      Editor.cursor.moveUp();
      Editor.cursor.moveEnd();

      if (text[row] === "") {
        Editor.removeRows(row);
      }

    }
    else {
      text[row] = Editor.removeCharacters(row, col);
      Editor.cursor.moveLeft();
    }

    Editor.changedText();

    return false;

  },

  handleDelete: function () {

    var text = Editor.text,
        row = Editor.cursor.row,
        col = Editor.cursor.col;

    // The current line is empty
    if (!text[row] || text[row] === "") {

      // The next line is empty
      if (!text[row + 1] || text[row + 1] === "") {
        Editor.removeRows(row + 1); // remove the next line
      }
      // The next line has something
      else {
        Editor.removeRows(row);  // remove the current line
      }

    }
    else {
      // The current line isnt empty

      // There are no characters after the cusor in the current row
      if (Editor.cursor.col === text[row].length - 1) {

        // and we arent at the end of all rows
        if (row + 1 < text.length) {

          // append the next row to the end of the current row
          text[row] = text[row] + text[row + 1];

          // delete the next row
          Editor.removeRows(row + 1);

        }

      }
      else {

        // remove the character after the cursor
        text[row] = Editor.removeCharacters(row, col + 1);
      }

    }

    Editor.changedText();

    return false;

  },

  handleEnter: function () {

    var textBeforeCursor,
        textAfterCursor,
        col = Editor.cursor.col,
        row = Editor.cursor.row;

    // The next row is exist
    if (typeof(Editor.text[Editor.cursor.row + 1]) !== 'undefined') {

      textBeforeCursor = Editor.text[row].substr(0, col + 1);
      textAfterCursor = Editor.text[row].substr(col + 1);

      // Set the text after the cursor to the current row
      Editor.text[row] = textAfterCursor;

      // Insert the text before the cursor before the current line
      Editor.text.splice(row, 0, textBeforeCursor);

    }
    else {
      // The row does not exist
      Editor.text[Editor.cursor.row + 1] = ''; // create an empty row
    }

    // Move the cursor to the home of the next row
    Editor.cursor.moveDown();
    
    Editor.cursor.moveHome();

    Editor.changedText();

    return false;
  },

  handleUp: function () {
    Editor.cursor.moveUp();
    return false;
  },

  handleDown: function () {
    Editor.cursor.moveDown();
    return false;
  },

  handleLeft: function () {
    Editor.cursor.moveLeft();
    return false;
  },

  handleRight: function () {
    Editor.cursor.moveRight();
    return false;
  },

  handlePageUp: function () {
    Editor.cursor.row -= Editor.settings.pagingAmount;
    return false;
  },

  handlePageDown: function () {
    Editor.cursor.row += Editor.settings.pagingAmount;
    return false;
  },

  handleHome: function () {
    Editor.cursor.moveHome();
    return false;
  },

  handleEnd: function () {
    Editor.cursor.moveEnd();
    return false;
  },

  handleTab: function () {
    Editor.insertText('  ');
    Editor.changedText();
  },

  handleInsertMode: function (){
    Editor.mode = 'insert';
  },

  handleCommandMode: function (){
    Editor.mode = 'command';
  },

  handleCopy: function () {
    Editor.clipboard = Editor.select.selectedText;
    Editor.changedText();
  },

  handlePaste: function () {
    Editor.insertText(Editor.clipboard);
    Editor.changedText();
  }
  
};