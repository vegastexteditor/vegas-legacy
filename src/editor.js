Editor = {

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
    if (!Editor.text[Editor.cursor.row]) {
      Editor.text[Editor.cursor.row] = text; // initiate the new line with the letter
    }
    else if (Editor.cursor.col === Editor.text[Editor.cursor.row].length) {
      // A line exists and we are at the end of it
      Editor.text[Editor.cursor.row] += text; // append letter to the existing line
    }
    else {
      // The cursor is somewhere in the string
      textBeforeCursor = Editor.text[Editor.cursor.row].substr(0, Editor.cursor.col + 1);
      textAfterCursor =  Editor.text[Editor.cursor.row].substr(Editor.cursor.col + 1);
      Editor.text[Editor.cursor.row] = textBeforeCursor + text + textAfterCursor;
    }

    Editor.cursor.col += text.length;

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
        text = Editor.text;

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

    Editor.text = deletionResult;

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

  openFile: function(file) {

    jQuery.ajax({
      url: file,
      cache: false,
      success: function(text){
        Editor.text = text.split("\n");
      }
    });

  },


};