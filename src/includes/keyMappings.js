Editor.mode = 'insert'; // navigation, commandline

Editor.keyMapings = {
  
  'insert': {

    'keys' : {
      'backspace' : 'handleBackspace',
      'del' : 'handleDelete',
      'return' : 'handleEnter',
      'up' : 'handleUp',
      'down' : 'handleDown',
      'left' : 'handleLeft',
      'right' : 'handleRight',
      'pageup' : 'handlePageUp',
      'home' : 'handleHome',
      'end' : 'handleEnd',
      'tab' : 'handleTab',
      'esc' : 'handleCommandMode',
      'ctrl+left' : 'handleNextLogicalLeft',
      'ctrl+right' : 'handleNextLogicalRight'
    },

    'sequences' : {
      
    },

  },

  'command': {
    'keys' : {
      'up' : 'handleUp',
      'down' : 'handleDown',
      'left' : 'handleLeft',
      'right' : 'handleRight',

      'k' : 'handleUp',
      'j' : 'handleDown',
      'h' : 'handleLeft',
      'l' : 'handleRight',

      'pageup' : 'handlePageUp',
      'home' : 'handleHome',
      'end' : 'handleEnd',
      'i' : 'handleInsertMode'
    },

    'sequences' : {
      
    }
  }

};

(function(){
  
  var action, key, mode;

  for (mode in Editor.keyMapings) {

    (function(mode){
    
      for (key in Editor.keyMapings[mode]['keys']) {

        action  = Editor.keyMapings[mode]['keys'][key];

        (function(action, key){

          jQuery(document).bind('keydown', key, function(e) {
            
            if (Editor.mode == mode) {
               Editor.keyhandlers[action]();
               e.preventDefault();
            }
  
          });

        }(action, key));

      }

    }(mode))

    
  }

}());