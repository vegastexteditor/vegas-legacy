/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 *
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */

SyntaxHighlighter = function () {

var sh = {

  getSyntaxArray: function (code, language) {

    if (typeof(code) == 'undefined') {
      code = "var blah = 'test'; // testing";
    }

    if (typeof(language) == 'undefined') {
      language = 'js';
    }
    
    var brushClass = this.findBrush(language)
    var highlighter = new brushClass();

    return highlighter.findMatches(highlighter.regexList, code);

  },
  
  /** Common regular expressions. */
  regexLib : {
    multiLineCComments			: /\/\*[\s\S]*?\*\//gm,
    singleLineCComments			: /\/\/.*$/gm,
    singleLinePerlComments		: /#.*$/gm,
    doubleQuotedString			: /"([^\\"\n]|\\.)*"/g,
    singleQuotedString			: /'([^\\'\n]|\\.)*'/g,
    multiLineDoubleQuotedString	: new XRegExp('"([^\\\\"]|\\\\.)*"', 'gs'),
    multiLineSingleQuotedString	: new XRegExp("'([^\\\\']|\\\\.)*'", 'gs'),
    xmlComments					: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm,
    url							: /\w+:\/\/[\w-.\/?%&=:@;]*/g,

    /** <?= ?> tags. */
    phpScriptTags 				: { left: /(&lt;|<)\?=?/g, right: /\?(&gt;|>)/g },

    /** <%= %> tags. */
    aspScriptTags				: { left: /(&lt;|<)%=?/g, right: /%(&gt;|>)/g },

    /** <script></script> tags. */
    scriptScriptTags			: { left: /(&lt;|<)\s*script.*?(&gt;|>)/gi, right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi }
  },
  
  /**
   * Executes given regular expression on provided code and returns all
   * matches that are found.
   *
   * @param {String} code    Code to execute regular expression on.
   * @param {Object} regex   Regular expression item info from <code>regexList</code> collection.
   * @return {Array}         Returns a list of Match objects.
   */
  getMatches: function(code, regexInfo) {

    function defaultAdd(match, regexInfo)
    {
      return match[0];
    };

    var index = 0,
      match = null,
      matches = [],
      func = regexInfo.func ? regexInfo.func : defaultAdd;

    while((match = regexInfo.regex.exec(code)) != null)
    {
      var resultMatch = func(match, regexInfo);

      if (typeof(resultMatch) == 'string')
        resultMatch = [new this.Match(resultMatch, match.index, regexInfo.css)];

      matches = matches.concat(resultMatch);
    }

    return matches;
  },

  /**
   * Match object.
   */
  Match: function(value, index, css) {
    this.value = value;
    this.index = index;
    this.length = value.length;
    this.css = css;
    this.brushName = null;
  },

  /**
   * Simulates HTML code with a scripting language embedded.
   *
   * @param {String} scriptBrushName Brush name of the scripting language.
   */
  HtmlScript: function(scriptBrushName) {
    var brushClass = findBrush(scriptBrushName),
      scriptBrush,
      xmlBrush = new sh.brushes.Xml(),
      bracketsRegex = null,
      ref = this,
      methodsToExpose = 'getDiv getHtml init'.split(' ')
      ;

    if (brushClass == null)
      return;

    scriptBrush = new brushClass();

    for(var i = 0; i < methodsToExpose.length; i++)
      // make a closure so we don't lose the name after i changes
      (function() {
        var name = methodsToExpose[i];

        ref[name] = function()
        {
          return xmlBrush[name].apply(xmlBrush, arguments);
        };
      })();

    if (scriptBrush.htmlScript == null)
    {
      alert(sh.config.strings.brushNotHtmlScript + scriptBrushName);
      return;
    }

    xmlBrush.regexList.push(
      { regex: scriptBrush.htmlScript.code, func: process }
    );

    var offsetMatches = function (matches, offset)
    {
      for (var j = 0; j < matches.length; j++)
        matches[j].index += offset;
    }

    var  process = function (match, info)
    {
      var code = match.code,
        matches = [],
        regexList = scriptBrush.regexList,
        offset = match.index + match.left.length,
        htmlScript = scriptBrush.htmlScript,
        result
        ;

      // add all matches from the code
      for (var i = 0; i < regexList.length; i++)
      {
        result = getMatches(code, regexList[i]);
        offsetMatches(result, offset);
        matches = matches.concat(result);
      }

      // add left script bracket
      if (htmlScript.left != null && match.left != null)
      {
        result = getMatches(match.left, htmlScript.left);
        offsetMatches(result, match.index);
        matches = matches.concat(result);
      }

      // add right script bracket
      if (htmlScript.right != null && match.right != null)
      {
        result = getMatches(match.right, htmlScript.right);
        offsetMatches(result, match.index + match[0].lastIndexOf(match.right));
        matches = matches.concat(result);
      }

      for (var j = 0; j < matches.length; j++)
        matches[j].brushName = brushClass.brushName;

      return matches;
    }
  },

  /**
   * Finds a brush by its alias.
   *
   * @param {String} alias		Brush alias.
   * @param {Boolean} showAlert	Suppresses the alert if false.
   * @return {Brush}				Returns bursh constructor if found, null otherwise.
   */
  findBrush: function (alias, showAlert) {

    showAlert = true;

    var brushes = sh.vars.discoveredBrushes,
      result = null
      ;

    if (brushes == null)
    {
      brushes = {};

      // Find all brushes
      for (var brush in sh.brushes)
      {
        var info = sh.brushes[brush],
          aliases = info.aliases
          ;

        if (aliases == null)
          continue;

        // keep the brush name
        info.brushName = brush.toLowerCase();

        for (var i = 0; i < aliases.length; i++)
          brushes[aliases[i]] = brush;
      }

      sh.vars.discoveredBrushes = brushes;
    }

    result = sh.brushes[brushes[alias]];

    if (result == null && showAlert != false)
      alert(sh.config.strings.noBrush + alias);

    return result;
  }

};

sh.brushes = {};
sh.vars = {};

/**
 * Main Highlither class.
 * @constructor
 */
sh.Highlighter = function()
{
	// not putting any code in here because of the prototype inheritance
};

sh.Highlighter.prototype = {

	/**
	 * Applies all regular expression to the code and stores all found
	 * matches in the `this.matches` array.
	 * @param {Array} regexList		List of regular expressions.
	 * @param {String} code			Source code.
	 * @return {Array}				Returns list of matches.
	 */
	findMatches: function(regexList, code) {
    var result = [];

    var matchesSortCallback = function(m1, m2) {
      // sort matches by index first
      if(m1.index < m2.index)
        return -1;
      else if(m1.index > m2.index)
        return 1;
      else
      {
        // if index is the same, sort by length
        if(m1.length < m2.length)
          return -1;
        else if(m1.length > m2.length)
          return 1;
      }

      return 0;
    };

		if (regexList != null)
			for (var i = 0; i < regexList.length; i++)
				// BUG: length returns len+1 for array if methods added to prototype chain (oising@gmail.com)
				if (typeof (regexList[i]) == "object")
					result = result.concat(sh.getMatches(code, regexList[i]));

		// sort and remove nested the matches
		return this.removeNestedMatches(result.sort(matchesSortCallback));
	},

	/**
	 * Checks to see if any of the matches are inside of other matches.
	 * This process would get rid of highligted strings inside comments,
	 * keywords inside strings and so on.
	 */
	removeNestedMatches: function(matches)
	{
		// Optimized by Jose Prado (http://joseprado.com)
		for (var i = 0; i < matches.length; i++)
		{
			if (matches[i] === null)
				continue;

			var itemI = matches[i],
				itemIEndPos = itemI.index + itemI.length
				;

			for (var j = i + 1; j < matches.length && matches[i] !== null; j++)
			{
				var itemJ = matches[j];

				if (itemJ === null)
					continue;
				else if (itemJ.index > itemIEndPos)
					break;
				else if (itemJ.index == itemI.index && itemJ.length > itemI.length)
					matches[i] = null;
				else if (itemJ.index >= itemI.index && itemJ.index < itemIEndPos)
					matches[j] = null;
			}
		}

		return matches;
	},

	/**
	 * Converts space separated list of keywords into a regular expression string.
	 * @param {String} str    Space separated keywords.
	 * @return {String}       Returns regular expression string.
	 */
	getKeywords: function(str)
	{
		str = str
			.replace(/^\s+|\s+$/g, '')
			.replace(/\s+/g, '|')
			;

		return '\\b(?:' + str + ')\\b';
	},

	/**
	 * Makes a brush compatible with the `html-script` functionality.
	 * @param {Object} regexGroup Object containing `left` and `right` regular expressions.
	 */
	forHtmlScript: function(regexGroup)
	{
		this.htmlScript = {
			left : { regex: regexGroup.left, css: 'script' },
			right : { regex: regexGroup.right, css: 'script' },
			code : new XRegExp(
				"(?<left>" + regexGroup.left.source + ")" +
				"(?<code>.*?)" +
				"(?<right>" + regexGroup.right.source + ")",
				"sgi"
				)
		};
	}
}; // end of Highlighter

return sh;

}();
