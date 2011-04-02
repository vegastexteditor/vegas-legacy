(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas,
      utils = vegas.utils;

  /**
   * @namespace vegas.keyHandler
   * The keyHandler object associates key mapping settings with code to be
   * executed and watches and keys if they are associated to something.
   * Notes:
   *
   * Order of firing of key events:
   *  keydown
   *  keypress
   *  keyup
   *
   */
  vegas.keyHandler = {

    /**
     * @init: Initiates the keyboard state, and attach events.
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

      this.keyNameKeyCodeMapping = {
        keydown: {},
        keyup: {}
      };

      this.keyNameToKeyCode('keydown');
      this.keyNameToKeyCode('keyup');
      this.attachEvents();

    },

    /**
     * @events: attach key events with the key handler
     */
    attachEvents: function () {

      var self = this,
          doc = document;

      // When the document is blured, we will intentionally reset the keydown
      // state to prevent any funnyness
      utils.bind(doc, 'blur', function(e) {
        self.keysDown = {};
        self.keysDownOrder = [];
      });

      utils.bind(doc, 'keydown', function(e) {
        self.keydownHandler.call(self, e);
      });

      utils.bind(doc, 'keypress',function(e) {
        self.keypressHandler.call(self, e);
      });

      utils.bind(doc, 'keyup', function(e){
        self.keyupHandler.call(self, e);
      });

    },

    /**
     * @eventhandler: keydown
     *
     * Takes in a key event (keydown, keypress, keyup) objects and normalizes
     * these events into human readable keys via the getKeyName method, once
     * nomalized it uses this information along with the keyMapping settings
     * to associate associate they key events to the proper commands and
     * executes them once a key combo or key sequence has bee matched.
     */
    keydownHandler: function (e){

      var self = this,
          code = e.keyCode,
          keyName = this.getKeyName(code),
          keysDown,
          keyMapping;

      this.isKeyDown = true;

      // Only capture the key down once, Dont let the key repeat its self
      // (chrome will fire a bunch of events while its pressed down)
      if (typeof this.keysDown[code] == 'undefined') {

        // object property assignment tracking what keys were pressed
        this.keysDown[code] = keyName;

        // Adding to an array to keep the order of what was assigned
        this.keysDownOrder.push(code);

        // Get an array of keys down (in order that they were pressed)
        keysDown = this.getKeysDown();

        // See if the keys that are currently down are matched to somthing
        keyMapping = this.areKeysMapped(keysDown);

        // A shortcut was found!!!
        if (keyMapping !== false) {
          e.preventDefault();

          // Execute the action of the key mapping
          this.execute(keyMapping);
   
          // Remove the last key pressed so that a user can press it again
          // to repeat the action
          delete this.keysDown[code]; // Remove from the object
          this.keysDownOrder.pop(); // Remove from the array

        }

      }
    },

    keypressHandler: function (e) {

      var character;

      if (e.which) {

        character = String.fromCharCode(e.which);

        var keyName = this.getKeyName(e.which, 'keypress'),

        // See if the keys that are currently down are matched to somthing
        keyMapping = this.areKeysMapped([keyName]);

        // A shortcut was found!!!
        if (keyMapping !== false) {

          if (!this.isKeyDown) {
            // Execute the action of the key mapping
            this.execute(keyMapping);
          }

        }

        //if (this.keysDownOrder.length <= 1)
        // // console.log('output character: ',character);

      }
      else {
        e.preventDefault();
      }

      if (this.isKeyDown) {
        delete this.isKeyDown;
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

      if (this.isKeyDown) {
        delete this.isKeyDown;
      }

      delete this.keysDown[code];

    },

    /**
     * Finds the literal function of object notated string.
     *
     * @example:
     *  given the actionString "select.toBeginningOfDocument" it will find the
     *  vegas.select.toBeginningOfDocument function, if it doesn't find the
     *  function then it will return false and log an error.
     * 
     */
    execute: function (keyMapping) {

      var objectProperties = keyMapping.action.split('.'), // Split the string's dot notation
          object = vegas,
          propertyInQuestion,
          property;

      // Loop through the strings object notation
      for (var i = 0; i < objectProperties.length; i++) {

        property = objectProperties[i];

        propertyInQuestion = object[property];

        // The property actually exists in code
        if (property in object) {

          // It's a function, so execute it
          if (typeof(propertyInQuestion) == 'function') {
            // make sure its executed in the objects context, so it doesn't
            // screw up the functions 'this'
            propertyInQuestion.call(object);
            this.executed = keyMapping;
            return true;
          }
          // if its a property, change the context of the loop to it so we can
          // continue searching through the object
          else if (typeof(propertyInQuestion) == 'object') {
            object = propertyInQuestion;
          }
        }
        else {

          var activeRegion = vegas.session.state.activeRegion

          if (activeRegion.entity == keyMapping.context && property in activeRegion && typeof(activeRegion[property]) == 'function') {
             activeRegion[property]();
            this.executed = keyMapping;
            return true;
          }
          else {
            console.error('Unidentified property: ', property, ' in ', object);
            return false;
          }

        }

      }
    },

    /**
     * Gets a human readable keyName from a keyCode
     */
    getKeyName: function (code, type) {

      type = type || 'keydown';

      var keyboard = vegas.settings.keyboard[type];

//      if (typeof keyboard == 'undefined') {
//        debugger;
//      }

      if (typeof(keyboard[code]) !== 'undefined') {
        return keyboard[code];
      }
      else {
        console.error('Unknown key', code, ' assuming super');
        return 'super';
      }
    },

    /**
     * Gets a machine readable keycode from KeyName
     */
    getKeyCode: function (keyName, type) {

      type = type || 'keydown';

      var keyNameKeyCodeMapping = this.keyNameKeyCodeMapping[type];

      if (typeof(keyNameKeyCodeMapping[keyName]) !== 'undefined') {
        return keyNameKeyCodeMapping[keyName];
      }
      else {
        console.error('Unknown key name', keyName);
        return false;
      }
    },

    /**
     * Creates quick hash table for associating keyCodes to keyNames, used by
     * the getKeyCode Method
     */
    keyNameToKeyCode: function (type) {

      type = type || 'keydown';

      var keyboard = vegas.settings.keyboard[type],
          keyCode,
          keyName,
          keyNameKeyCodeMapping = this.keyNameKeyCodeMapping[type];

          keyNameKeyCodeMapping[type] = {};

      for (keyCode in keyboard) {
        keyName = keyboard[keyCode];
        keyNameKeyCodeMapping[keyName] = keyCode;
      }

      this.keyNameKeyCodeMapping[type] = keyNameKeyCodeMapping[type];

    },

    /**
     * Since the keyHandler functions are keeping track of what keys are down
     * manually, this function gets an optionally human readable combo string
     *
     * @returns an string when the friendly argument is true (ctrl+space) or
     * an array containing the keys ['ctrl', 'space'] @todo: verify
     *
     */
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

    /**
     * Checks if keys are mapped in the options
     *
     * From the keys array, check to see if there is a keyboard assignment for
     * the keys, if so it will return the keyMapping object, otherwise
     * it will return false.
     */
    areKeysMapped: function (keysArray) {

      var keyMappings = vegas.keyMappings.parsedKeyMappings,
          keyMappingsLen = keyMappings.length,
          keymapping,
          keySequence,
          sequenceMatches = this.sequenceMatches,
          sequenceMatchesLen,
          newSequenceMatches = [],
          foundKeyMapping = false;

          // // console.log('this.sequenceIndex',this.sequenceIndex);

          // // console.log('sequenceMatches',sequenceMatches);

      // We have already matched atleast one sequence key
      if (this.sequenceIndex > 0) {

        // // console.log('matched somthing in the sequence');

        sequenceMatchesLen = sequenceMatches.length;

        // Loop through the possible sequence matches (based on sequences they last key(s) pressed matched.
        while (sequenceMatchesLen--) {
          keymapping = sequenceMatches[sequenceMatchesLen];
          keySequence = keymapping.keySequence;

          if  (typeof(keySequence[this.sequenceIndex]) !== 'undefined') {

            var matchedKey = this.keysMatch(keysArray, keySequence[this.sequenceIndex]);

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
            if (this.keysMatch(keysArray, keySequence[0])) {

              // The keys seem to match, now ensure its in the correct Region assigned

              if (keymapping.context) {
                // The keymapping is contextual

                var activeRegion = vegas.region.getActiveRegion();

                if (activeRegion.entity == keymapping.context) {
                  // The keymapping was in the correct context
                  foundKeyMapping = keymapping;
                  break;
                }
                else {
                  // The keymapping was contextual, but was not in the correct context.
                  continue;
                }

              }
              else {
                // The keymapping is not contextual
                foundKeyMapping = keymapping;
                break;
              }

            }
          }
          // match sequence keys
          else if (keySequence.length > 1) {
            // @todo: match a regular expression

            if  (this.keysMatch(keysArray, keySequence[0])) {
              this.sequenceIndex++;
              this.sequenceMatches.push(keymapping);
            }

          }

        }
      }

      return foundKeyMapping;

    },

    /**
     * Checks to see if two key combinations match, this needs to be a function
     * for two reasons, one being for the flexablility of allowing sequential
     *  non sequential keys to be optional. The second being that some times
     * we may want to use place holder for key types (any number)
     *
     * @param keys1 @todo:document
     *
     * @param keys2 @todo:document
     *
     * @param sequentially A Boolean When true, will make sure that they keys where pressed
     * in the correct order e.g. ctrl+1+2 and ctrl+2+1 could be different
     * if sequentially was true
     */
    keysMatch: function (keys1, keys2, sequentially) {

      sequentially = sequentially || false;

      var matches;

      if (typeof(keys2) === 'string') { // @todo: all cases?
        if (keys2 == '{number}') {

          if (utils.isArray(keys1)) {
            if (keys1.length == 1) {

              keys1 = keys1.toString(); // tis only one key.

              var isNumber = utils.isNumber();

              if (isNumber) {
                this.insertingNumbers = true;
                return false; // okay it did match, but didn't match the entire sequence.
              }
              else {
                return false;
              }

            }
            else {
              // @todo: This case happends very often, work out this logic
              console.error('what the hells going on here?');
            }
          }
          else {
              console.error('does this ever even happen?');
          }

         // // console.log(keys1,keys2);

        }
      }
      // @todo:document: the following code needs to be walked through with
      // inline comments
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

    }

  };

vegas.init.register(vegas.keyHandler);
vegas.module.register('keyHandler.js');

}());