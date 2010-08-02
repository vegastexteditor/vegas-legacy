Editor.settings = {};

Editor.settings.fontFamily = "Arial";
Editor.settings.fontSize = 20;

Editor.settings.pagingAmount = 5;

Editor.settings.keyToFunction = {
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

Editor.settings.width = document.width; // document.width;
Editor.settings.height = document.height; //document.height;