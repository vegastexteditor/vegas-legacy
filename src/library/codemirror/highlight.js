// Stuff from util.js that the parsers are using.
var StopIteration = {toString: function() {return "StopIteration"}};

var Editor = {};

(function(){

var indentUnit = 2;
  
  function normaliseString(string) {
    var tab = "";
    for (var i = 0; i < indentUnit; i++) tab += " ";

    string = string.replace(/\t/g, tab).replace(/\u00a0/g, " ").replace(/\r\n?/g, "\n");

    var pos = 0, parts = [], lines = string.split("\n");

    for (var line = 0; line < lines.length; line++) {
      if (line != 0) parts.push("\n");
      parts.push(lines[line]);
    }

    return {
      next: function() {
        if (pos < parts.length) return parts[pos++];
        else throw StopIteration;
      }
    };

  }

  window.highlightText = function(string, callback, parser) {
    parser = (parser || Editor.Parser).make(stringStream(normaliseString(string)));
    var line = [];

    try {
      while (true) {
        var token = parser.next();
        if (token.value == "\n") {
          callback(line);
          line = [];
        }
        else {
          line.push(token);
        }
      }
    }
    catch (e) {
      if (e != StopIteration) throw e;
    }
  }
})();
