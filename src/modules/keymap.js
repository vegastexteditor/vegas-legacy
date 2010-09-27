(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    vegas.keyMappings = (function(){

      var keySequenceId = 0;

      var keyMappings = {

        keySequences: {},

        init: function () {

          // parse special syntax keymapping syntax from the keyMappings option
          this.parsedKeyMappings = this.parseKeyMappings();

          // this.attachKeyMappings();

        },

//        attachKeyMappings: function (parsedKeyMappings) {
//
//          parsedKeyMappings = parsedKeyMappings || this.parsedKeyMappings;
//
//          var self = this,
//              i = parsedKeyMappings.length,
//              parsedKeyMapping,
//              keys,
//              action,
//              context,
//              mode;
//
//          while (i--) {
//
//            parsedKeyMapping = parsedKeyMappings[i],
//            action = parsedKeyMapping.action,
//            context = parsedKeyMapping.context,
//            mode = parsedKeyMapping.mode;
//            keys = parsedKeyMapping.keySequence;
//
//            this.registerKey(keys, action, context, mode,
//              function () {
//                self.executeAction(parsedKeyMapping.action);
//              }
//            );
//
//          }
//
//        },
//
//        registerKey: function (keys, action, context, mode, callback) {
//
//          var activeContext,
//              contextName,
//              currentMode,
//              self,
//              firstKey = keys[0];
//
//          //alert alert
//          jQuery(document).bind('keydown', firstKey, function (e) {
//            e.preventDefault();
//
//            // What to do if the key(or first key in a sequence) is matched
//            var trigger = function () {
//
//              // A single key / key combo is mapped
//              if (keys.length == 1) {
//                callback(e);
//              }
//              // multiple key / key combos is mapped
//              else if (keys.length > 1) {
//
//                this.keySequences[id] = {
//                  fullSequence: keys,
//                  sequenceMatchedIndex: 1,
//                };
//
//                self.handleKeySequence(keySequenceId, firstKey, keys, action, context, mode, callback);
//
//                keySequenceId++;
//
//              }
//            }
//
//            // There is no context or mode, just trigger
//            if (!context && !mode) {
//              trigger();
//              return false;
//            }
//
//            // A context is defined, but a mode is not
//            if (context !== false && !mode) {
//
//              contextName = vegas[context].prototype.name;
//              activeContext = vegas.session.state['activePane'];
//
//              // If the key was pressed in the correct context trigger the key logic
//              if (typeof activeContext !== 'undefined' && activeContext.name == contextName) {
//                trigger();
//              }
//              return false;
//            }
//
//            // A mode is defined, but a context is not
//            if (mode !== false && !context ) {
//
//              currentMode = ''; // @todo:
//
//              // If the key was pressed in the correct mode trigger the key logic
//              if (mode == currentMode) {
//                trigger();
//              }
//              return false;
//            }
//
//            if (context && mode) {
//              // @todo
//            }
//
//          });
//
//        },
//
//        handleKeySequence: function (firstKey, fullKeySequence, action, context, mode, callback) {
//
//          console.log(key, action, context, mode, callback);
//
//          var id = this.sequenceId,
//              sequenceMatchedIndex = 0;
//
//          var sequence = {
//            fullSequence: key,
//            sequenceMatchedIndex: sequenceMatchedIndex,
//          };
//
//          this.keySequences[id] = sequence;
//
//        },
//
//        executeAction: function (action) {
//          console.log('action', action);
//        },

        /**
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

          keyMappings = keyMappings || vegas.settings.keyMappings

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

              keyMappingString = keyMappings[i]
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
                keyMappingString: keyMappingString,
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
              commandContext = vegas[context].prototype['commandContext'];
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

      keyMappings.init();

      return keyMappings;

    }());

  vegas.module.register('command.js');

}());