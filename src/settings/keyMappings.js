(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

  var settings = vegas.settings || {};

  /**
   * hotkeys / hotstrings of keys to actions
   *
   * No keymappings in core code
   *
   * // In core default settings file.
   * vegas.settings.keys. = 'return in commandBar does doCommand'
   *
   * @todo: complete modal references
   * @todo: create dynamic modes: i in editArea creates mode insert
   *
   * i in editArea changes mode to insert
   * esc in editArea changes mode to normal mode
   * v in editArea while in normal mode changes mode to selection mode
   */

  vegas.settings.keyMappings = [

// Application
    'ctrl+q in CommandBar does vegas.application.quit',
    'ctrl+shift+m in editArea does vegas.application.toggleMaximize',
    'ctrl+r in editArea does vegas.application.reload',
    'ctrl+shift+r in editArea does vegas.application.getFreshCopyAndReload',
    'ctrl+shift+= in editArea does vegas.application.increaseTransparency',
    'ctrl+shift+- in editArea does vegas.application.decreaseTransparency',
    'f11 in editArea does vegas.application.toggleFullScreen',

// regions
    'ctrl+a does vegas.region.toggleMaximized',
    'ctrl+shift+t does vegas.region.insertComponent',
    'ctrl+shift+v does vegas.region.splitv',
    'ctrl+shift+h does vegas.region.splith',

// Misc
    'ctrl+tab in editArea does tab.next',
    'ctrl+shift+tab in editArea does tab.prev',
    'ctrl+c (sequentially) in editArea does copy',
    'ctrl+v in editArea does paste',
    'ctrl+x in editArea does cut',
    'ctrl+e in editArea does deleteLine',
    'ctrl+g in editArea does inputGoToLine',
    'ctrl+h in editArea does inputReplace',
    'ctrl+shift+. in editArea does nextBookmark',
    'ctrl+y in editArea does redo',
    'ctrl+z in editArea does undo',
    'ctrl+b in editArea does goToDeclaration',
    'delete in editArea does deleteNextCharacter',
    //'backspace in  does deletePreviousCharacter',
    'ctrl+backspace in editArea does deletePreviousWord',

// Selection
    'shift+left in editArea does select.backward',
    'shift+down in editArea does select.down',
    'shift+right in editArea does select.forward',
    'shift+up in editArea does select.up',
    'ctrl+shift+home in editArea does select.toBeginningOfDocument ',
    'shift+home in editArea does select.toBeginningOfTextOnLine',
    'ctrl+shift+end in editArea does select.toEndOfDocument',
    'shift+end in editArea does select.toEndOfLine',
    'ctrl+shift+[ in editArea does select.toMatchingBrace',
    'shift+pagedown in editArea does select.toNextPage',
    'ctrl+shift+right in editArea does select.toNextWord',
    'shift+pageup in editArea does select.toPreviousPage',
    'ctrl+shift+left in editArea does select.toPreviousWord',
    //'! ! in editArea does select.toEndOfWord',
    //'! ! in editArea does select.toFirstNonWhiteSpaceChar',
    //'! ! in editArea does select.toLastNonWhiteSpaceChar',
    // '! ! in editArea does select.toBeginningOfWord',
    // '! ! in editArea does select.toBeginningOfLine',

// Cursor
    'alt+shift+insert in editArea does cursor.center',
    'alt+shift+pageup in editArea does cursor.top',
    'alt+shift+pagedown in editArea does cursor.bottom',
    'ctrl+end in editArea does cursor.endOfDocument',
    'ctrl+home in editArea does cursor.beginningOfDocument',
    'ctrl+left in editArea does cursor.previousWord',
    'ctrl+{ in editArea does cursor.matchingBrace',
    'ctrl+right in editArea does cursor.nextWord',
    'end in editArea does cursor.endOfLine',
    'home in editArea does cursor.beginningOfTextOnLine',
    'right in editArea does cursor.forward',
    'left in editArea does cursor.backward',
    'up in editArea does cursor.up',
    'down in editArea does cursor.down',
    'up in editArea does cursor.up',
    'down in editArea does cursor.moveDown',
    'left in editArea does cursor.moveLeft',
    'right in editArea does cursor.moveRight',
    'pageup in editArea does cursor.pageup',
    'pagedown in editArea does cursor.pagedown',

    'backspace in CommandBar does deletePreviousCharacter',

    // When the "enter" key is pressed while in the commandBar, triggers vegas.command.doCommand();
    'enter in CommandBar does doCommand',
    
    'tab in CommandBar does autocomplete',

    // When the "esc" key is pressed while in the commandBar, triggers vegas.command.hideCommandBar();
    'escape in CommandBar does hideCommandBar',

    // Ctrl while pressing the ";" key is pressed triggers the command bar
    'ctrl+; does command.showCommandBar',

     // Ctrl while pressing the "A" key and then the next key pressed | triggers vegas.pane.splitVertical();
    'ctrl+a | does pane.splitVertical',

     // Ctrl while pressing the "A" key and then the next key pressed - triggers vegas.pane.splitHorizontal();
    'ctrl+a - does pane.splitHorizontal',

    'd+a does canyoudeny',

    // When the key sequence "v" "e" "g" "a" "s" is entered while in editor mode triggers vegas.easterEgg();
    'v e g a s in CommandBar vegas.easterEgg',

    // When the "d" key is pressed and the next key pressed is a number and the next key pressed is "l" while in commandMode triggers editArea.deleteLine(count);
    'd {number} w in editArea does editArea.deleteWxord($1)'

  ];

  vegas.settings = settings;
  vegas.options = settings;

}());