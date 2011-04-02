(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /**
     * @namespace vegas.keyMappings
     */
    vegas.keyMappings = (function(){

      var keyMappings = {
        /** @lends vegas.keyMappings */
        keySequences: {},

        init: function () {

          // parse special syntax keymapping syntax from the keyMappings option
          this.parsedKeyMappings = this.parseKeyMappings();

          // this.attachKeyMappings();

        },

        /**
         * Parses a keyMapping syntax string, into a usable object.
         *
         * Because generally it seems like a silly idea to define keymappings
         * within the modules them selves, this allows for consolidation of
         * key mapping related to key sequences / functions.
         *
         * It is hoped to make keymaping easier.
         *
         * There is pluses and minuses for making up this custom syntax,
         * however it should be easy to use. A more javascript oriented method
         * of keymappings should be supported.
         *
         * @todo: escape sequences, and validation / making sure the string makes
         * sense should be built into this function.
         *
         * Theoretical Example of keyMappings array:
         *  [
         *     'return in commandBar does doCommand',
         *     'ctrl+; does command.showCommandBar',
         *     'ctrl+a | does pane.splitVertical',
         *     'ctrl+tab does tab.next',
         *     'v e g a s in editArea while in editMode does easterEgg',
         *     'd /^[0-9]+$/ l in editArea while in commandMode does editArea.deleteLine(count)'
         *   ]
         * 
         * Desired output:
         *
         *   [{
         *       keySequence: ["return"],
         *       action: "command.doCommand",
         *       context: "commandBar",
         *       mode: false,
         *   },
         *   {
         *       keySequence: ["ctrl+;"],
         *       action: "command.showCommandBar",
         *       context: false,
         *       mode: false,
         *   },
         *   {
         *       keySequence: ["ctrl+a", "|"],
         *       action: "pane.splitVertical",
         *       context: false,
         *       mode: false,
         *   },
         *   {
         *       keySequence: ["ctrl+tab"],
         *       action: "tab.next",
         *       context: false,
         *       mode: false,
         *   },
         *   {
         *       keySequence: ["v", "e", "g", "a", "s"],
         *       action: "easterEgg",
         *       context: "editArea",
         *       mode: "editMode",
         *   },
         *   {
         *       keySequence: ["d", "/^[0-9]+$/", "l"],
         *       action: "editArea.deleteLine(count)",
         *       context: "editArea",
         *       mode: "commandMode",
         *   }]
         *
         */
        parseKeyMappings: function (keyMappings) {

          keyMappings = keyMappings || vegas.settings.keyMappings;

          var context,
              action,
              mode,
              inPos,
              doesPos,
              whileInPos,
              optionsPos,
              keyMappingString,
              tokens,
              foundKeywords,
              firstKeywordPos,
              keySequence,
              token,
              optionsMatch,
              optionsSplit,
              optionsLen,
              option,
              optionsKeyValue,
              options = {},
              parsedKeyMappings = [],
              i = keyMappings.length,
              j;

          while (i--) {

              keyMappingString = keyMappings[i];
              foundKeywords = [];
              firstKeywordPos = false;
              action = false;
              context = false;
              mode = false;
              keySequence = false;
              inPos = false;
              doesPos = false;
              whileInPos = false;
              optionsPos = false;

              // Split into space tokens to make things easier to work with
              tokens = keyMappingString.split(' ');

              j = tokens.length;

              // The "options" token supplies per sequence / key detection options
              optionsMatch = keyMappingString.match(/\((a-zA-Z0-9= ,)\)/);
              if (optionsMatch && optionsMatch.length > 1) {
                optionsPos = 1; // ittle do.. no it wont.
              }

              // Find the position in the string of each keyword
              while (j--) {

                token = tokens[j];

                // The "while in" keyword determines the mode context commandMode | editMode, etc
                if (token == 'while') { // This keyword is split up into two tokens
                  if (tokens[j + 1] == 'in') {
                    whileInPos = j + 1;
                    continue;
                  }
                }

                // The "in" keyword determines the focus context (which pane has focus)
                if (token == 'in') {
                  inPos = j;
                  continue;
                }

                // The "does" keyword supplies the action to perform
                if (token == 'does') {
                  doesPos = j;
                  continue;
                }

              }

              // If we found the "in" keyword
              if (inPos !== false){
                // the context is always provided after the first "in" keyword
                context = tokens[inPos + 1];
                // keep track of token positions
                foundKeywords.push(inPos);
              }

              // If we found the "does" keywork
              if (doesPos !== false) {
                // the action is always after the "does" keyword
                action = tokens[doesPos + 1];
                action = this.getTrueActionFromContext(action, context);
                // keep track of token positions
                foundKeywords.push(doesPos);
              }

              // If we found the "while in" keyword
              if (whileInPos !== false) {
                // the action is always after the "while in" keyword
                mode = tokens[whileInPos + 1];
                // keep track of token positions
                foundKeywords.push(whileInPos);
              }

              if (optionsPos !== false) {

                optionsSplit = optionsMatch[1].split(/,\s*/);
                optionsLen = optionsSplit.length;

                while (optionsLen--) {
                  option = optionsSplit[optionsLen];
                  optionsKeyValue = option.split(/\s*\=\s*/);

                  if (optionsKeyValue.length == 1) {
                    options[optionsKeyValue[0]] = true;
                  }
                  else if (optionsKeyValue.length == 2){
                    options[optionsKeyValue[0]] = optionsKeyValue[1];
                  }

                }

                foundKeywords.push(optionsPos);
              }

              // If we found keywords
              if (foundKeywords.length > 0) {
                // Get the position of the first token we found
                firstKeywordPos = Math.min.apply(Math, foundKeywords);
              }

              if (firstKeywordPos) {
                // The key sequence is will be spaced characters before the first keyword
                keySequence = tokens.splice(0, firstKeywordPos);

              }

              parsedKeyMappings[i] = {
                keySequence: keySequence,
                action: action,
                context: context,
                mode: mode,
                options: options,
                keyMappingString: keyMappingString
              };

          }

          return parsedKeyMappings;

        },

        /**
         * Since Actions can have shorthand eg.
         *   instead of:  return in commandBar does command.doCommand
         *   you can use: return in commandBar does doCommand
         *
         * Since commandBar is a region and is obviously related to commands it
         * has a 'commandContext' object of 'command' and everythings always
         * going to start with vegas.
         *
         * After finishing writing this the concept seems pretty stupid :D
         * 
         */
        getTrueActionFromContext: function (action, context) {

          var trueAction = action,
              actionObjects = action.split('.'),
              commandContext = false;

          // Get the commandContext if it exists
          if (context in vegas && typeof(vegas[context].prototype) == 'object') {
            if ('commandContext' in vegas[context].prototype) {
              commandContext = vegas[context].prototype.commandContext;
            }
          }

          // Remove the vegas. prefix if added for some reason
          if (actionObjects[0] == 'vegas') {
            trueAction = trueAction.substr(6); // 6 = 'vegas'.length
          }

          // Add The commandContext prefix
          if (commandContext && actionObjects[0] !== commandContext) {
              trueAction = commandContext + '.' + trueAction;
          }

          return trueAction;

        },


        actions: [
          'parseKeyMappings'
        ]

      };

      vegas.init.register(keyMappings);

      return keyMappings;

    }());

  vegas.module.register('keymap.js');

}());