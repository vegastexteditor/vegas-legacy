(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /*
     * api for commands are executed with(vegas) commands are just execution
     * of methods in the vegas object.
     *
     * .buffer.seek('test'); = vegas.buffer.seek('test');
     *
     * This is a good way to navigate the application source.
     *
     * However for day to day, these commands can expand from reading the editor
     * source code.
     *
     *  .b[tab] expands to .buffer[property_list_display] (vegas.buffer)
     *
     *  .b[tab]s expands to .buffer.seek('[active]'); (vegas.buffer.seek('x'))
     *
     *  .b[tab]s[tab]test expands to vegas.buffer.seek('test');
     *
     */
    vegas.command = (function(){

      var command = {

        init: function () {

        },

        /**
         * command executor
         * @todo:exec
         */
        exec: function () {
        },

        api: [
          this.exec
        ]

      };

      return command;

    });

  vegas.module.register('command.js');

}());