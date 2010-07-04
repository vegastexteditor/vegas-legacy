Editor = {

  removeText: function (startRow, startCol, text) {

    var rowsToRemove = [],
        textBeforeDeletion,
        textAfterDeletion,
        row = 0;

    //  If its a single row of text to remove
    if (text.length == 1) {

      textBeforeDeletion = Editor.text[startRow].substr(0, startCol + 1);
      textAfterDeletion = Editor.text[startRow].substr(startCol + 1 + text[0].length);

      Editor.text[startRow] = textBeforeDeletion + textAfterDeletion;

    }

    // There are atleast three rows of text, this is a bit more involved to create
    // the expected behavior
    if (text.length >= 3) {
      
      // Loop through the rows of text to remove
      for (row = startRow; row <  startRow + text.length; row++) {

        // This is the first row of the text
        if (row == startRow) {

          textBeforeDeletion = Editor.text[row].substr(0, startCol + 1);
          textAfterDeletion = Editor.text[startRow + text.length - 1].substr(text[text.length - 1].length);

          Editor.text[startRow] = textBeforeDeletion + textAfterDeletion;

        }
        // The is the last row of the text
        else if (row == startRow + text.length - 1) {
          rowsToRemove.push(row - 1); // when we are done looping remove the last row
        }
        else{
          rowsToRemove.push(row); // when we are done looping remove rows in the middle
        }

      }

    }

    // There is something very ghetto about this, there is something
    // fundimentally wrong with the removeRows function and i'm making up for it
    // here when i shouldn't be @todo:dal
    if (text.length == 2) {

      // Loop through the rows of text to remove
      for (row = startRow; row <  startRow + text.length; row++) {

        // This is the first row of the text
        if (row == startRow) {

          textBeforeDeletion = Editor.text[row].substr(0, startCol + 1);
          textAfterDeletion = Editor.text[startRow + text.length - 1].substr(text[text.length - 1].length);

          Editor.text[startRow] = textBeforeDeletion + textAfterDeletion;

        }
        // The is the last row of the text
        else if (row == startRow + text.length - 1) {
          rowsToRemove.push(row); // when we are done looping remove the last row
        }

      }

    }

    // Remove the specified rows all at once
    Editor.removeRows(rowsToRemove[0], rowsToRemove.length);

    // Move the cursor to where it makes sense
    Editor.cursor.moveTo(startCol, startRow);

  },

  /**
   * Inserts the specified text to the to the cursors position.
   *
   * @todo: over-confident function, should handle all text (not just simple
   * small strings) for upcoming copy and paste, etc
   *
   */
  insertText: function (rowsToInsert) {

    var textBeforeCursor,
        textAfterCursor,
        cursorAtEndOfLine,
        cursorAtBeginningOfline;

      // Text is currently selected
      if (Editor.select.selectedText.length > 0) {
        Editor.select.removeSelection();
      }
      
      if (typeof(rowsToInsert) === 'string') {
        rowsToInsert = rowsToInsert.split();
      }

      // Theres only one line of text to insert
      if (rowsToInsert.length === 1) {

        // The line is empty
        if(Editor.text[Editor.cursor.row].length == 0){
          Editor.text[Editor.cursor.row] = rowsToInsert[0];
          Editor.cursor.moveTo(rowsToInsert[0].length - 1);
        }
        // The cursor is in the middle of some text
        else if (!cursorAtEndOfLine && !cursorAtBeginningOfline) {
          textBeforeCursor = Editor.text[Editor.cursor.row].substr(0, Editor.cursor.col + 1);
          textAfterCursor =  Editor.text[Editor.cursor.row].substr(Editor.cursor.col + 1);
          Editor.text[Editor.cursor.row] = textBeforeCursor + rowsToInsert[0] + textAfterCursor;
          Editor.cursor.moveTo(textBeforeCursor.length + rowsToInsert[0].length - 1);
        }
        // The cursor is at the end of some text
        else if (Editor.cursor.col == Editor.text[Editor.cursor.row].length - 1) {
          Editor.text[Editor.cursor.row] += rowsToInsert[0];
          Editor.cursor.moveEnd();
        }
        // The cursor is at the beginning
        else if (Editor.cursor.col === -1){
          textAfterCursor =  Editor.text[Editor.cursor.row].substr(Editor.cursor.col + 1);
          Editor.text[Editor.cursor.row] = rowsToInsert[0] + textAfterCursor;
          Editor.cursor.moveTo(rowsToInsert[0].length - 1);
        }

      }
      else {

        textBeforeCursor = Editor.text[Editor.cursor.row].substr(0, Editor.cursor.col + 1);
        textAfterCursor =  Editor.text[Editor.cursor.row].substr(Editor.cursor.col + 1);

        // The line is empty
        if(Editor.text[Editor.cursor.row].length == 0){

          var rowsToInsertCopy = rowsToInsert.slice();
          rowsToInsertCopy.reverse();

          for (var j = 0; j < rowsToInsertCopy.length; j++) {
            Editor.text.splice(Editor.cursor.row, 0, rowsToInsertCopy[j]);
          }

          Editor.text.splice(Editor.cursor.row + rowsToInsertCopy.length, 1);

        }
        // The cursor is in a line that has some text
        else {

          var rowsToInsertConcated = [];

          for (var i = 0; i < rowsToInsert.length; i++) {
            // First row of text to insert
            if (i === 0) {
              rowsToInsertConcated.push(textBeforeCursor + rowsToInsert[i]);
            }
            // Last row of text to insert
            else if(i === rowsToInsert.length -1) {
              rowsToInsertConcated.push(rowsToInsert[i] + textAfterCursor);
            }
            // Rows of text in between the first and last rows to insert
            else{
              rowsToInsertConcated.push(rowsToInsert[i]);
            }
          }

          rowsToInsertConcated.reverse();

          for (i = 0; i < rowsToInsertConcated.length; i++) {
            Editor.text.splice(Editor.cursor.row, 0, rowsToInsertConcated[i]);
          }

          Editor.text.splice(Editor.cursor.row + rowsToInsert.length, 1);

        }
        
        Editor.cursor.moveTo(rowsToInsert[rowsToInsert.length - 1].length - 1, Editor.cursor.row + rowsToInsert.length - 1)
      
      }

    Editor.select.unselect();

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