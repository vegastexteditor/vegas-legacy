/**
 * @fileOverview Contains command bar related objects and methods
 */
(function (global) {
  var vegas = global.vegas,
      utils = vegas.utils,
      options = vegas.settings.commandBar;
  /**
   * @class CommandBar
   * @memberOf vegas
   * 
   * @description Creates a CommandBar that will be drawn to the screen
   *
   * @extends vegas.Region
   * @example
   *   var commandRegion = new vegas.CommandBar({
   *     width: '100%',
   *     height: '25',
   *     x: 0,
   *     y: 'bottom'
   *   });
   */
  vegas.CommandBar = function (data, region) {
    utils.makeObject(this, arguments, vegas.Component);
    vegas.utils.extend(this, data);
    this.region = region;
    this.init();
  };

  vegas.CommandBar.prototype = {

    /**
     * @constructs the CommandBar object
     * 
     * @param {Object} data these are object properties that will be merged into the
     * object, these are usually constructor settings.
     *
     * @example
     *   var commandRegion = new vegas.CommandBar({
     *     width: '100%',
     *     height: '25',
     *     x: 0,
     *     y: 'bottom'
     *   });
     */
    init: function (data) {

      this.entity = 'CommandBar';
      this.type = 'CommandBar';
      this.initComponent();
      this.insertComponentStructure();

      /**
       * @property suggested
       * @type Array
       * @description suggested List of current suggestions
       * @default []
       */
      this.suggested = [];

      /**
       * @property suggestedIndex
       * @type Number
       * @description the currently active suggestion
       * @default 0
       */
      this.suggestedIndex = 0;

      /**
       * @property context
       * @type Object
       * @description The object that we are providing property suggestions from
       * @default {object} vegas
       */
      this.context = vegas;


      /*
       * @property buffer
       * @type Object
       * @description An instance of Buffer, providing a place to keep track of the text input.
       */
      this.buffer = new vegas.Buffer({
        multiline: false
      });

      /*
       * @property cursor
       * @type Object
       * @description An instance of Cursor
       */
      this.cursor = new vegas.Cursor(this, {
        multiline: false
      });

      // just in case anything needs this?
      this.scrollbar = {
        charsFromtop: 0 // Dummy, its a single line text field
      }

    },

    componentStructure: function () {
      var structure = '<canvas></canvas>';
      return structure;
    },

    /**
     * A method that finds where the top left point of the text begins.
     * 
     * @returns {Object} textPoint object {x: 25, y: 25}
     */
    getTextPoint: function () {

      if (!this.textPoint) {
        this.setTextPoint();
      }

      return this.textPoint;

    },

    /**
     * The text point is the position where the text should be rendered
     */
    setTextPoint: function () {

      var textX, textY;

      // The beginning of the text is where the area begins and additional
      // pixels such as gutter / margin
      textX = this.area.x + options.bufferTextOffsetX,

      // Since the the textBaseline is set to 'bottom' (found int paint object)
      // we have to add the height of the font as well
      textY = this.area.y + options.bufferFontSize + options.bufferTextOffsetY;

      this.textPoint = {x: textX, y: textY};

    },

    /**
     * @description When the CommandBar region gets focus
     * @event onFocus
     */
    onFocus: function () {
      this.paint(); // repaint
    },

    /**
     * Paints the CommandBar region.
     * @param {Object} view The view that this should be painted on ( defaults
     * to vegas.session.state.activeView)
     */
    paint: function (view) {

      view = view || vegas.session.state.activeView;

      var ctx = view.ctx,
          bufferValue = this.buffer.getValue(),
          measuredBuffer = ctx.measureText(bufferValue),
          bufferWidth = measuredBuffer.width, // @todo: will need this for overflow.
          bufferHeight = options.bufferFontSize,
          textPoint = this.getTextPoint(),
          textX = textPoint.x,
          textY = textPoint.y; // @todo: center (currently incorrect pane height)

      // Paint the commandbar background
      ctx.fillStyle = options.backgroundColor;

      ctx.fillRect(this.area.x, this.area.y, this.area.width, this.area.height);

      // Set the font for the command text
      ctx.font = options.bufferFontSize + "px " + options.bufferFontFamily;

      // Paint the suggestions behind the buffer text
      if (this.suggested && this.suggested.length > 0) {
        var suggestion = this.suggested[this.suggestedIndex];
        ctx.fillStyle = options.bufferSuggestFontColor;
        ctx.fillText(suggestion, textX, textY);
      }

      // Paint the buffer text
      ctx.fillStyle = options.bufferFontColor;
      ctx.fillText(bufferValue, textX, textY);

    },

    /**
     * @event reflow
     *
     * @description When the window get's resized or a reflow is requested
     * this gets fired off.
     */
    reflow: function () {
      this.setTextPoint();
    },

    hooks: {

      'variableAssignment': function (provided, adjustable) {

        if (typeof(provided.objectInfo) == 'object' && typeof(provided.objectInfo.value) == 'string') {

          this.buffer.append(' = "";');
          //dataIn.cursor.moveTo(0, buffer.length + 3);
          adjustable.outputChar = false;

        }

      },

    },

    /**
     * @event Takes in text input from the keyboard and appends it to the buffer
     * @name: CommandBar#handleTextInput
     * @param {string} character
     */
    handleTextInput: function (character) {

      var self = this,
          outputChar = true;
      
      // If they pressed period, most likley an object notated string, check if
      // we should change the context to the previous property (if its valid)
      if (character == '.') {
        this.switchContext();
      }

      if (character == '=') {

        var bufferWithNoSpace = utils.trim(self.buffer.toString());
        var objectInfo = utils.getObjectInfoFromString(bufferWithNoSpace);

        if (objectInfo !== false) {

          var adjustable = {
            outputChar: outputChar
          };

          vegas.hook.invoke.call(this, 'variableAssignment', {
            buffer: this.buffer,
            cursor: this.cursor,
            objectInfo: objectInfo
          }, adjustable);

          outputChar = adjustable.outputChar;

        }

      }

      if (outputChar) {
        self.buffer.append(character);
      }

      this.updateSuggestions();

    },

    /**
     * Switches the CommandBar.context to the object specified by the string
     *
     * @param {string} string Containing the dot notated location of object to
     * switch the CommandBar.context to.
     */
    switchContext: function (string) {
      // and in between the period that they pressed and the period before
      // that (or the begining of the string is a valid object.

      // because string = string || defaultValue will return default if string is empty.
      if (string === undefined) {
        string = this.buffer.toString();
      }

      var object = utils.getObjectPropertyFromString(string);

      if (object !== false && (string == '' || typeof object === 'object')) {
        // an object was found from the string
        var newContext;

        if (string == '') { // if its an empty string we are in the global context
          newContext = vegas;
        }
        else {
          newContext = object;
        }

        if (newContext !== this.context) {

          var adjustable = {
            newContext: newContext
          };

          vegas.hook.invoke.call(this, 'variableAssignment', {
            currentContext: this.context,
          }, adjustable);

          this.context = newContext;

          return true;
        }
        else {
          return false;
        }

      }
      else {
        this.context = false;
        return false;
      }

    },

    /**
     * Deletes the previous character in the commandbar handling other ramifications
     * such as the suggestions.
     */
    deletePreviousCharacter: function () {

      var buffer = this.buffer.toString();
      var lastChar = buffer.substr(-1);

      this.buffer.deletePreviousCharacter();

      buffer = this.buffer.toString();

      if (lastChar == '.' || buffer == '' || !this.context) {

        buffer = this.buffer.toString();

        if (buffer.indexOf('.') !== -1) {
          buffer = buffer.substring(0, buffer.lastIndexOf('.'));
        }
        else {
          buffer = '';
        }

        this.switchContext(buffer);
      }

      this.updateSuggestions();
      this.paint();
    },

    /**
     * When called and there is a suggestion, insert the suggestion.
     */
    autocomplete: function () {
      this.useSuggestion();
    },

    /**
     * Use no suggestions and switch back to the root context.
     */
    resetSuggestions: function () {
      this.suggested = [];
      this.context = vegas;
    },

    /**
     * Updates the CommandBar.suggested to the approriate suggestions given
     * the current buffer or the optional bufferValue paramater.
     */
    updateSuggestions: function (bufferValue) {

      bufferValue = bufferValue || this.buffer.toString();

      // No suggestions needed if the buffer is empty.
      if (bufferValue == '') {
        this.suggested = [];
        return;
      }

      this.suggested = [];

      var contextStrings = bufferValue.split('.');

      var contextString = contextStrings[contextStrings.length - 1];

      var suggestion_prefix;

      if (bufferValue.lastIndexOf('.') !== -1) {
      suggestion_prefix = bufferValue.substring(0, bufferValue.lastIndexOf('.')) + '.';
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

    /**
     * Given an object notated string, get suggestions from the objects properties
     * 
     * @param {string} suggestion An object notated string
     *
     * @depreciated
     */
    useSuggestion: function (suggestion) {

//      debugger;

      // Get the primary suggestion (if not specified)
      suggestion = suggestion || this.suggested[this.suggestedIndex];

      if (typeof suggestion !== "string") {
        return false;
      }

      var suggestionObjects = suggestion.split('.'),
          suggestionKey= suggestionObjects[suggestionObjects.length - 1];

      // If the suggestion is an object
      if (this.context[suggestionKey]) {

        // Use the suggestion
        this.buffer.setValue(suggestion);

        // Change the current context to the suggestions scope
        this.switchContext()

        this.updateSuggestions();

        this.paint();

      }

    },

    /**
     * isCallingFunction
     * callFunction
     * isAssigningProperty
     * isAssigningAlias
     * assignAlias
     * assignProperty
     *
     */
    isCallingInternalFunction: function () {

    },

    callInternalFunction: function () {

    },

    isAssigningAlias: function () {

    },

    assignAlias: function () {

    },

    isAssigningInternalProperty: function (string) {

      var stringParts = string.split('='),
          isAssignment = false;

      if (stringParts.length === 2) {

          var objectNotatedString = utils.trim(stringParts[0]),
              objectNotationTokens = objectNotatedString.split('.'),
              objectProperty = objectNotationTokens.pop(),
              objectString = objectNotationTokens.join('.'),
              object = utils.getObjectPropertyFromString(objectString),
              value = utils.trim(stringParts[1]);

          if (object && objectProperty in object) {

            var matchRawValue = value.match(/^["'](.*)["'];?$/);

            if (matchRawValue) {
              isAssignment = true;
            }

          }

      }

      return isAssignment;

    },

    assignInternalProperty: function (string) {

      var stringParts = string.split('=');

      var objectNotatedString = utils.trim(stringParts[0]),
          objectNotationTokens = objectNotatedString.split('.'),
          objectProperty = objectNotationTokens.pop(),
          objectString = objectNotationTokens.join('.'),
          object = utils.getObjectPropertyFromString(objectString),
          value = utils.trim(stringParts[1]);

        var matchRawValue = value.match(/^["'](.*)["'];?$/);

        if (matchRawValue) {
          value = utils.trim(matchRawValue[1]);
          object[objectProperty] = value;
        }

    },

    /**
     * Executes a given command
     * 
     * @param {string} command A string containing the command to execute.
     * @example
     *  doCommand('file.save');
     */
    doCommand: function (cmd) {

      cmd = cmd || this.buffer.getValue();

      var actionTokens = cmd.split('.'),
          action = vegas,
          actionQuestionMark;

      for (var i = 0; i < actionTokens.length; i++) {

        actionQuestionMark = action[actionTokens[i]];

        if (typeof(actionQuestionMark) !== 'undefined') {

          if (typeof(actionQuestionMark) == 'function') {
            actionQuestionMark.call(action);
            this.buffer.empty();
          }
          else if (typeof(actionQuestionMark) == 'object') {
            action = actionQuestionMark;
            this.buffer.empty();
            this.resetSuggestions();
          }
        }
        else {

           // ... but we have valid suggestions ready
          if (this.suggested.length > 0) {
            // Instead of erroring out, execute the currently active suggestion
            this.doCommand(this.suggested[this.suggestedIndex]);
          }
          else { // There are no suggestions... so their just totally typing random stuff?

            if (this.isAssigningInternalProperty(cmd)) {
              this.assignInternalProperty(cmd);
            }
            else if (this.isCallingInternalFunction(cmd)) {
              this.callInternalFunction(cmd);
            }
            else {
              if (options.allowEval) {
                this.evaluate(cmd);
              }
              else {
                console.error('Command not found');
              }
            }

          }

        }

      }

      vegas.paint.paint();

    },

    evaluate: function (code) {

      try {
          eval("(function(){  with(vegas) {" + code + "} })()")
      }
      catch (e) {
        console.error('Command not found, could not evaluate JS');
        return false;
      }

    }

  };

    /**
     * @namespace vegas.command
     * @description api for commands are executed with(vegas) commands are just
     * execution of methods in the vegas object.
     *
     * .buffer.seek('test'); = vegas.buffer.seek('test');
     *
     * This is a good way to navigate the application source.
     *
     * However for day to day, these commands can expand from reading the editor
     * source code.
     * 
     * @example
     *  .b[tab] expands to .buffer[property_list_display] (vegas.buffer)
     *
     *  .b[tab]s expands to .buffer.seek('[active]'); (vegas.buffer.seek('x'))
     *
     *  .b[tab]s[tab]test expands to vegas.buffer.seek('test');
     *
     */
    vegas.command = (function(){

      var command = {
        /** @lends vegas.command */
        init: function () {

          var self = this;

            self.attachEvents();

        },

        attachEvents: function () {
          
          utils.onReady(function () {

            utils.takeTextInput(function (character) {
              var activeRegion = vegas.region.getActiveRegion();
              if (activeRegion.entity == 'CommandBar') {
                  activeRegion.handleTextInput.call(activeRegion, character);
                  activeRegion.paint();
              }
            });

          });

        },

        paint: function (view) {

          view = view || vegas.session.state.activeView;

          var i = view.regionList.length;

          while (i--) {
            if (view.regionList[i].entity == 'CommandBar') {
              view.regionList[i].paint.call(view.regionList[i]);
            }
          }

        },

        api: [
          this.exec
        ]

      };

      vegas.init.register(command);

      return command;

    }());

  vegas.module.register('command.js');

})(this);