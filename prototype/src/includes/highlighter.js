Editor.highlighter = {

  init: function () {

    Editor.highlighter.highlight();

    jQuery(Editor.canvas).bind('changeText', function (){
      Editor.highlighter.highlight();
    });

  },


  highlight: function () {

    Editor.highlighter.highlightedText = [];

    Editor.highlighter.highlightText(Editor.text.join("\n"), function(line) {
        Editor.highlighter.highlightedText.push(line);
    });
  
  },

  paintHighlightedText: function () {

    var ctx = Editor.core.ctx,
        row = Editor.cursor.row,
        posTop;

    var row = Editor.cursor.row;
    var currentPosLeft = Editor.position.left;

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = Editor.font.style;
    ctx.textBaseline = 'bottom';

    for (row =  Editor.scroll.charsFromtop; row < Editor.scroll.charsFromtop + Editor.core.viewableHeight; row++) {

      // Reached End Of File @todo:dirty
      if(typeof(Editor.highlighter.highlightedText[row]) == 'undefined'){
        break;
      }

      posTop = (Editor.font.height * (row - Editor.scroll.charsFromtop + 1)) + Editor.position.top;

      var ht = Editor.highlighter.highlightedText[row];

      if (!ht){
        console.log(ht,row);
        Editor.core.stopPaint();
        return false;
      }


      currentPosLeft = Editor.position.left;

      for (var i = 0; i < ht.length; i++) {
        
        Editor.highlighter.changeColor(ht[i].style);

        ctx.fillText(
          ht[i].value,
          currentPosLeft,
          posTop
        );

        currentPosLeft += Editor.core.ctx.measureText(ht[i].value).width;

      }

    }

//      posTop = (Editor.font.height * (row - Editor.scroll.charsFromtop + 1)) + Editor.position.top;
//
//      ctx.fillText(
//        Editor.text[row],
//        Editor.position.left,
//        posTop
//      );

//    }

  },

  changeColor: function (style) {
    
    Editor.highlighter.styles = {
      'xml-punctuation' : 'rgb(123, 216, 39)',
      'xml-tagname' : 'rgb(141, 176, 211)',
      'xml-text' : 'rgb(255, 255, 255)',
      'xml-attname' : 'rgb(255, 255, 128)',
      'xml-entity' :  'rgb(255, 255, 128)',
      'xml-attribute' : 'rgb(240, 128, 71)',
      'xml-comment' : 'rgb(58, 139, 218)',

      'js-punctuation' : 'rgb(123, 216, 39)',

      'js-operator' : 'rgb(123, 216, 39)',

      'js-keyword' : 'rgb(255, 255, 128)',

      'js-atom' : 'rgb(255, 0, 255)',
      'js-variable' : 'rgb(141, 176, 211)',
      'js-variabledef' : 'rgb(141, 176, 211)',
      'js-localvariable' : 'rgb(141, 176, 211)',
      'js-property' : 'rgb(179, 202, 225)',
      'js-comment' : 'rgb(58, 139, 218)',
      'js-string' : 'rgb(240, 128, 71)',

    };

    if (typeof(Editor.highlighter.styles[style]) !== 'undefined') {
      Editor.core.ctx.fillStyle = Editor.highlighter.styles[style];
    }

  },

  highlightText: function(string, callback, parser) {

    var self = this;

    parser = (parser || Editor.Parser).make(stringStream(self.normaliseString(string)));
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
      if (e != self.StopIteration) throw e;
    }
  },

  normaliseString: function (string) {
    var tab = "",
        self = this;

    window.indentUnit = 2;
    window.StopIteration =  {toString: function() {return "StopIteration"}};

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
        else throw self.StopIteration;
      }
    };

  }
};





