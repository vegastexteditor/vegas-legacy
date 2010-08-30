Editor.top = 5;
Editor.left = 5;
Editor.margin = 5;

Editor.font = {};
Editor.font.height = Editor.settings.fontSize;
Editor.font.style = Editor.settings.fontSize + 'px ' + Editor.settings.fontFamily;

Editor.position = {};
Editor.position.left = Editor.left + Editor.margin;
Editor.position.top = Editor.top + Editor.margin;

Editor.width = Editor.settings.width;
Editor.height = Editor.settings.height;

// e.keyCode to word mapping (aka special keys)
Editor.keycodeToWord = {
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

Editor.text = [''];