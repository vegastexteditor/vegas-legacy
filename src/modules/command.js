(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

      //[Break on this error]  commandBarArea = new vegas.CommandBar({

      vegas.CommandBar = (function (data) {

        var CommandBar = function () {
          vegas.utils.makeObject(this, arguments);
        };

        CommandBar.prototype = {

          name: 'CommandBar',
          commandContext: 'command',

          init: function (data) {
            // Take in properties passed in to data object.
            vegas.utils.extend(this, data);

            this.buffer = '';
            this.backgroundColor = 'rgb(210,210,255)';
            this.suggestedIndex = 0;
            this.context = vegas;
            this.contextName = 'vegas';

          },

          onFocus: function () {
            this.paint();
          },

          paint: function (view) {

            view = view || vegas.session.state.activeView;

            vegas.options.command = {};
            vegas.options.command.bufferTextOffsetX = 25;
            vegas.options.command.bufferTextOffsetY = 15;
            vegas.options.command.bufferFontSize = 20;
            vegas.options.command.bufferFontFamily = 'arial';
            vegas.options.command.bufferFontColor = 'rgb(0,0,0)';
            vegas.options.command.bufferSuggestFontColor = 'rgb(150,150,150)';


            var ctx = view.ctx,
                options = vegas.options.command,
                measuredBuffer = ctx.measureText(this.buffer),
                bufferWidth = measuredBuffer.width,
                bufferHeight = options.bufferFontSize,
                textX = this.area.x + options.bufferTextOffsetX,
                textY = this.area.y + bufferHeight + options.bufferTextOffsetY; // @todo: center (currently incorrect pane height)
                
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(textX, textY - bufferHeight, this.area.width - 75, bufferHeight);
            
            ctx.font = options.bufferFontSize + "px " + options.bufferFontFamily;

            if (this.suggested && this.suggested.length > 0) {
              var suggestion = this.suggested[this.suggestedIndex];
              ctx.fillStyle = options.bufferSuggestFontColor;
              ctx.fillText(suggestion, textX, textY);
            }

            ctx.fillStyle = options.bufferFontColor;
            ctx.fillText(this.buffer, textX, textY);

          },

          handleTextInput: function (character) {

            var self = this;

            // If the pressed period.
            if (character == '.') {
              // and in between the period that they pressed and the period before
              // that (or the begining of the string is a valid object.

              var bufferObjects = self.buffer.split('.');

              var lastBufferObject = bufferObjects[bufferObjects.length - 1];

              // Its actually something in the current context, something valid
              // that we can work with
              
              if (this.context[lastBufferObject] !== 'undefined') {
                // then switch the current context to last object in the buffer.
                this.context = this.context[lastBufferObject];
                this.contextName = lastBufferObject;
              }

            }

            self.buffer += character;

            this.updateSuggestions();

          },

          handleSpecialKeys: function (e) {



          },

          updateSuggestions: function () {

            this.suggested = [];
            
            var contextStrings = this.buffer.split('.');

            var contextString = contextStrings[contextStrings.length - 1];

            if (this.buffer.lastIndexOf('.') !== -1) {
            var suggestion_prefix = this.buffer.substring(0, this.buffer.lastIndexOf('.')) + '.';
            }
            else{
              suggestion_prefix = '';
            }

            for (var key in this.context) {
              var value = this.context[key];
              if ((key[0] >= 'a') && (key[0] <= 'z')) {
                if (key.substring(0, contextString.length) == contextString) {
                  this.suggested.push(suggestion_prefix + key);
                }
              }
            }


          },

          useSuggestion: function (suggestion) {

            // Get the primary suggestion (if not specified)
            suggestion = suggestion || this.suggested[this.suggestedIndex];

            var suggestionObjects = suggestion.split('.'),
                suggestionKey= suggestionObjects[suggestionObjects.length - 1];

            // If the suggestion is an object
            if (typeof(this.context[suggestionKey]) == 'object') {
              // Use the suggestion
              this.buffer = suggestion + '.';

              // Change the current context to the suggestions scope
              this.context = this.context[suggestionKey];
              this.contextName = suggestionKey;
              this.updateSuggestions();

            }

          },

          doCommand: function (command) {

            command = command || this.buffer;

            // fix the last dot of
            var lastDotPosition = command.lastIndexOf('.');
            var hasTrailingDot = false;
            
            if (lastDotPosition !== -1) {
              command = command.substring(lastDotPosition,-1);
              hasTrailingDot = true;
            }

            var action = this.context[command];


            // @todo: explainz
            if (command == this.contextName) {
              action = this.context;
            }

            if (typeof(action) == 'function') {
              action();
              this.buffer = '';
              this.suggested = [];
            }
            else if (typeof(action) == 'object') {

              console.log('neh');

              for (var key in action) {
                console.log(key);
              }

              // switch the current context to the object
              this.context = this.context[command];
              this.contextName = command;

              if (!hasTrailingDot) {
                this.buffer += '.';
              }
            }
            else { // We don't know what to do with this commmand.

              // ... but we have valid suggestions ready
              if (this.suggested.length > 0) {
                // Instead of erroring out, perform one of the suggestions
                this.doCommand(this.suggested[this.suggestedIndex]);
              }
              else {
                console.error('unkown command: ', command, this.context);
              }
              
            }
          }

        };

        return CommandBar;

      }());

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

          var self = this;

            self.attachEvents();

        },

        attachEvents: function () {

          var self = this;
          
          vegas.utils.onReady(function () {

          vegas.utils.takeTextInput(function (character) {
            var activePane = vegas.session.state.activePane;
            if (activePane.entity == 'CommandBar') {
                activePane.handleTextInput.call(activePane, character);
                activePane.paint();
            }
          });


//            if (e.keyCode == 13) { // pressed enter
//              self.doCommand(self.buffer);
//              e.preventDefault();
//              return false;
//            }
//
//            if (e.keyCode == 9) { // pressed enter
//              e.preventDefault();
//              return false;
//            }
//            if (e.keyCode == 38) { // up
//              if (this.suggestedIndex !== 0) {
//                this.suggestedIndex--;
//              }
//            }
//
//            if (e.keyCode == 40) { // down
//              if (this.suggestedIndex !== this.suggested.length - 1) {
//              this.suggestedIndex++;
//              }
//            }
//
//            if (e.keyCode == 9) { // tab
//              this.useSuggestion();
//              e.preventDefault(); // not working
//            }


          });

        },

        paint: function (view) {

          view = view || vegas.session.state.activeView;

          var i = view.paneList.length;
          while (i--) {
            if (view.paneList[i].entity == 'CommandBar') {
              view.paneList[i].paint.call(view.paneList[i]);
            }
          }

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

      command.init();

      return command;

    }());

  vegas.module.register('command.js');

}());