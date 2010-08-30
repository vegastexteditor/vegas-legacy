var trash = (function(){

  trash.file.open('/home/johndoe/notes/somedocument.txt');

  var trash = {

    session: session, // Everything remotely usefull should be available to plugins.

    core: {
      removeText: function(){},
      insertText: function(){},
      /* etc etc*/
    },


    highlighter: ({/* etc etc */}),

    parser: ({/* etc etc */}),

    interpreter: ({/* etc etc */}),

    plugins: ({/* etc etc */}),


  };


}());