(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas,
      utils = vegas.utils;

  /**
   *
   * Order of firing of key events:
   *  keydown
   *  keypress
   *  keyup
   *
   *
   *  moving keyup into key press? ... if keypress means key was pressed
   *  aka keeping track of sequence keys here as well or all.. not sure.
   *
   *
   *  another alternative, a timer in keydown if there are two keydowns
   *  within a certain amount of time then its a combo... expand the amount of time
   *  between the keydowns
   *
   *
   *  the catch and fix a+b if a sequence exists of a b, execute the sequence
   *  ... only when the keys were pressed at a certain interval (ugly)
   *
   *
   *
   *
   */

  vegas.keyHandler = (function(){

    var keyHandler = {

      /**
       * Initiates the keyboard state, and attach events.
       */
      init: function () {

        this.keysDown = {};
        this.keysDownOrder = [];
        this.numlock = false;
        this.capslock = false;
        this.inSequence = false;
        this.insertMode = 'hmmmm'; // @todo?
        this.sequenceIndex = 0;
        this.sequenceMatches = [];

        this.keyNameToKeyCode();
        this.attachEvents();

      },

      attachEvents: function () {

        var self = this;

        // When the document is blured, we will intentionally reset the keydown
        // state to prevent any funnyness
        utils.bind(document, 'blur', function(e) {
          self.keysDown = {};
          self.keysDownOrder = [];
        });

        utils.bind(document, 'keydown', function(e) {
          self.keydownHandler.call(self, e)
        });

        utils.bind(document, 'keypress',function(e) {
          self.keypressHandler.call(self, e)
        });

        utils.bind(document, 'keyup', function(e){
          self.keyupHandler.call(self, e)
        });

      },

      keydownHandler: function (e){
        e.preventDefault();

        var self = this,
            code = e.keyCode,
            keyName = this.getKeyName(code),
            keysDown,
            keyMapping;

        // Only capture the key down once, Dont let the key repeat its self
        // (chrome will fire a bunch of events while its pressed down)
        if (typeof this.keysDown[code] == 'undefined') {

//            var delayedExecution = function () {

              var timestamp = new Date().getTime();

              // object property assignment tracking what keys were pressed
              self.keysDown[code] = keyName;
              // Adding to an array to keep the order of what was assigned
              self.keysDownOrder.push(code);

              keysDown = self.getKeysDown();

              if (keysDown.length > 0) {
                console.log(timestamp - this.lastKeyPressedTime);
              }

              console.log('keysDown',keysDown);

              keyMapping = self.getKeyMapping(keysDown);

              // A shortcut was found!!!
              if (keyMapping !== false) {

                console.info('hotkey pressed:', keyMapping.keySequence.join(' '), '(' + keyMapping.action + ')');

                // Remove the last key pressed that was pressed from the key combo queue
                delete self.keysDown[code];
                self.keysDownOrder.pop();
              }
              else {
                console.info('key pressed: ', keyName, code, ' keys down:', keysDown);
                this.lastKeyPressedTime = timestamp;
              }

//            };
//
//            setTimeout(delayedExecution, 1000);






        }
      },

      keypressHandler: function (e) {

        var character = character;

        if (e.which &&
            e.which !== 8 && // not backspace
            e.which !== 13 // not enter
            ) {

          character = String.fromCharCode(e.which);
            //if (this.keysDownOrder.length <= 1)
            // console.log('output character: ',character);
        }
        else {
          e.preventDefault();
        }
      },

      keyupHandler: function (e){
        e.preventDefault();

        var code = e.keyCode,
            keysDownOrder = this.keysDownOrder,
            keysDownOrderLen = keysDownOrder.length,
            i = 0;

        for (; i < keysDownOrderLen; i++) {
          if (keysDownOrder[i] == code) {
            this.keysDownOrder.splice(i, 1);
            break;
          }
        }

        delete this.keysDown[code];

      },

      getKeyName: function (code) {

        var keyboard = vegas.settings.keyboard;

        if (typeof(keyboard[code]) !== 'undefined') {
          return keyboard[code];
        }
        else {
          console.error('Unknown key', code);
          return false;
        }
      },

      getKeyCode: function (keyName) {

        var keyNameKeyCodeMapping = this.keyNameKeyCodeMapping;

        if (typeof(keyNameKeyCodeMapping[keyName]) !== 'undefined') {
          return keyNameKeyCodeMapping[keyName];
        }
        else {
          console.error('Unknown key name', keyName);
          return false;
        }
      },

      keyNameToKeyCode: function () {

        var keyboard = vegas.settings.keyboard,
            keyCode,
            keyName,
            keyNameKeyCodeMapping = {};

        for (keyCode in keyboard) {
          keyName = keyboard[keyCode];
          keyNameKeyCodeMapping[keyName] = keyCode;
        }

        this.keyNameKeyCodeMapping = keyNameKeyCodeMapping;

      },

      getKeysDown: function (friendly) {
        friendly = friendly || false;
        var keyComboString = '',
            keyComboArray = [],
            j = 0,
            keysDownOrderLen = this.keysDownOrder.length,
            keyCode,
            keysDownOrder = this.keysDownOrder,
            keysDown = this.keysDown;

        for (; j < keysDownOrderLen; j++) {
          keyCode = keysDownOrder[j];
          if (friendly) {
            keyComboString +=  '+' + keysDown[keyCode];
          }
          else{
            keyComboArray.push(keysDown[keyCode]);
          }
        }

        if (friendly) {
          return keyComboString.substr(1);
        }
        else{
          return keyComboArray;
        }
      },

      getKeyMapping: function (keysDown) {

        var keyMappings = vegas.keyMappings.parsedKeyMappings,
            keyMappingsLen = keyMappings.length,
            keymapping,
            keySequence,
            sequenceMatches = this.sequenceMatches,
            sequenceMatchesLen,
            newSequenceMatches = [],
            foundKeyMapping = false;

        // We have already matched atleast one sequence key
        if (this.sequenceIndex > 0) {

          sequenceMatchesLen = sequenceMatches.length;

          // Loop through the possible sequence matches (based on sequences they last key(s) pressed matched.
          while (sequenceMatchesLen--) {
            keymapping = sequenceMatches[sequenceMatchesLen];
            keySequence = keymapping.keySequence;

            if  (typeof(keySequence[this.sequenceIndex]) !== 'undefined') {

              var matchedKey = this.keysMatch(keysDown, keySequence[this.sequenceIndex]);

              if (matchedKey !== false) {

                if (this.sequenceIndex == keySequence.length - 1) {
                  this.sequenceMatches = [];
                  this.sequenceIndex = 0;
                  foundKeyMapping = keymapping;
                  return foundKeyMapping;
                }

                newSequenceMatches.push(keymapping);

              }

            }
          }

          if (newSequenceMatches.length > 0) {
            this.sequenceMatches = newSequenceMatches;
            this.sequenceIndex++;
          }
          else {
            this.sequenceMatches = [];
            this.sequenceIndex = 0;
          }

        }
        else {
          // Loop through keymappings
          while (keyMappingsLen--){
            keymapping = keyMappings[keyMappingsLen];
            keySequence = keymapping.keySequence;

            // NON key sequence actions (not currently in a key sequence
            // and we are searching through keymappings for actions
            // that have singular key sequences.
            if (keySequence.length == 1 && this.inSequence == false) {
              // match a single key regex? silly.
              if (this.keysMatch(keysDown, keySequence[0])) {
                foundKeyMapping = keymapping;
                break;
              }
            }
            // match sequence keys
            else if (keySequence.length > 1) {
              // @todo: match a regular expression

              if  (this.keysMatch(keysDown, keySequence[0])) {
                this.sequenceIndex++;
                this.sequenceMatches.push(keymapping);
              }

            }

          }
        }

        return foundKeyMapping;

      },

      // @todo: regex
      keysMatch: function (keys1, keys2, sequentially) {

        sequentially = sequentially || false;

        var matches;

        if (typeof(keys2) === 'string') { // @todo: all cases?
          if (keys2 == '{number}') {

            if (utils.isArray(keys1)) {
              if (keys1.length == 1) {
                
                keys1 = keys1.toString(); // tis only one key.

                var didItMatch = keys1.match(/([0-9]+)/);

                if (didItMatch) {
                  console.log('really it did ;)');
                  this.insertingNumbers = true;
                  return false; // okay it did match, but didn't match the entire sequence.
                }
                else {
                  return false;
                }

              }
              else {
                console.error('what the hells going on here?');
              }
            }
            else {
                console.error('does this ever even happen?');
            }

            

           console.log(keys1,keys2);
          }
        }

        if (sequentially) {

          if (utils.isArray(keys1)) {
            keys1 = keys1.join('+');
          }

          if (utils.isArray(keys2)) {
            keys2 = keys2.join('+');
          }

          return (keys1 ===  keys2);
        }
        else {

          if (!utils.isArray(keys1)) {
            keys1 = keys1.split('+');
          }

          if (!utils.isArray(keys2)) {
            keys2 = keys2.split('+');
          }

          matches = 0;

          if (keys1.length !== keys2.length) {
            return false;
          }
          else {

            for (var i = 0; i < keys1.length; i++) {
              var key1 = keys1[i];
              for (var j = 0; j < keys2.length; j++) {
                var key2 = keys2[j];
                if (key1 === key2) {
                  matches++;
                }
              }
            }

            if (matches !== keys2.length) {
              return false;
            }
            else {
              return true;
            }

          }

        }

        //keyNameToKeyCode
//        keysDown = this.keysDownOrder;
//        keysDownLen = keysDown.length;
//          while (keysDownLen--) {
//          console.log(keysDown[keysDownLen], this.keyNameKeyCodeMapping);
//        }



      }

    };

  keyHandler.init();

  return keyHandler;

}());

vegas.module.register('command.js');

}());