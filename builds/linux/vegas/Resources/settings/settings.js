this.vegas.settings = {
  "application": {
    "backgroundColor": "#bebebe",
    "masterPaintInterval": 500,
    "compressed": true,
  },
  "layoutManager" : {
    "maxPaneWidth" : 125,
    "maxPaneHeight" : 125
  },
  "panes": {
    "handleWidth": 7,
    "backgroundColor": "rgb(245,245,245)",
    "highlightColor": "rgb(98,89,194)",
    "HighlightStrokeSize": 2
  },
  "regions": {
    "handleWidth": 7,
    "backgroundColor": "rgb(245,245,245)",
    "highlightColor": "rgb(98,89,194)",
    "HighlightStrokeSize": 2
  },
  "test": {
    "value": 1,
    "object": {
      "more": {
        "value": 2,
        "evenmore": {
          "value": 3
        }
      }
    }
  },
  "debug": {
    "panes": false
  },
  "commandBar": {
    "allowEval": true,
    "backgroundColor": "rgb(27, 1, 0)",
    "buffer": {
      "textOffsetX": 25,
      "textOffsetY": 15,
      "fontSize": 20,
      "fontFamily": "arial",
      "fontColor": "rgb(0,0,0)"
    },
    "suggestion": {
      "fontColor": "rgb(150,150,150)"
    },
    "bufferTextOffsetX": 25,
    "bufferTextOffsetY": 6,
    "bufferFontSize": 17,
    "bufferFontFamily": "arial",
    "bufferFontColor": "rgb(250, 255, 123)",
    "bufferSuggestFontColor": "rgb(16, 120, 83)"
  },
  "keyMappings": [
    "ctrl+q in CommandBar does vegas.application.quit",
    "ctrl+shift+m in editArea does vegas.application.toggleMaximize",
    "ctrl+r in editArea does vegas.application.reload",
    "ctrl+shift+r in editArea does vegas.application.getFreshCopyAndReload",
    "ctrl+shift+= in editArea does vegas.application.increaseTransparency",
    "ctrl+shift+- in editArea does vegas.application.decreaseTransparency",
    "f11 in editArea does vegas.application.toggleFullScreen",
    "ctrl+tab in editArea does tab.next",
    "ctrl+shift+tab in editArea does tab.prev",
    "ctrl+c (sequentially) in editArea does copy",
    "ctrl+v in editArea does paste",
    "ctrl+x in editArea does cut",
    "ctrl+e in editArea does deleteLine",
    "ctrl+g in editArea does inputGoToLine",
    "ctrl+h in editArea does inputReplace",
    "ctrl+shift+. in editArea does nextBookmark",
    "ctrl+y in editArea does redo",
    "ctrl+z in editArea does undo",
    "ctrl+b in editArea does goToDeclaration",
    "delete in editArea does deleteNextCharacter",
    "ctrl+backspace in editArea does deletePreviousWord",
    "shift+left in editArea does select.backward",
    "shift+down in editArea does select.down",
    "shift+right in editArea does select.forward",
    "shift+up in editArea does select.up",
    "ctrl+shift+home in editArea does select.toBeginningOfDocument ",
    "shift+home in editArea does select.toBeginningOfTextOnLine",
    "ctrl+shift+end in editArea does select.toEndOfDocument",
    "shift+end in editArea does select.toEndOfLine",
    "ctrl+shift+[ in editArea does select.toMatchingBrace",
    "shift+pagedown in editArea does select.toNextPage",
    "ctrl+shift+right in editArea does select.toNextWord",
    "shift+pageup in editArea does select.toPreviousPage",
    "ctrl+shift+left in editArea does select.toPreviousWord",
    "alt+shift+insert in editArea does cursor.center",
    "alt+shift+pageup in editArea does cursor.top",
    "alt+shift+pagedown in editArea does cursor.bottom",
    "ctrl+end in editArea does cursor.endOfDocument",
    "ctrl+home in editArea does cursor.beginningOfDocument",
    "ctrl+left in editArea does cursor.previousWord",
    "ctrl+{ in editArea does cursor.matchingBrace",
    "ctrl+right in editArea does cursor.nextWord",
    "end in editArea does cursor.endOfLine",
    "home in editArea does cursor.beginningOfTextOnLine",
    "right in editArea does cursor.forward",
    "left in editArea does cursor.backward",
    "up in editArea does cursor.up",
    "down in editArea does cursor.down",
    "up in editArea does cursor.up",
    "down in editArea does cursor.moveDown",
    "left in editArea does cursor.moveLeft",
    "right in editArea does cursor.moveRight",
    "pageup in editArea does cursor.pageup",
    "pagedown in editArea does cursor.pagedown",
    "backspace in CommandBar does deletePreviousCharacter",
    "enter in CommandBar does doCommand",
    "tab in CommandBar does autocomplete",
    "escape in CommandBar does hideCommandBar",
    "ctrl+; does command.showCommandBar",
    "ctrl+a | does pane.splitVertical",
    "ctrl+a - does pane.splitHorizontal",
    "d+a does canyoudeny",
    "v e g a s in CommandBar vegas.easterEgg",
    "d {number} w in editArea does editArea.deleteWxord($1)"
  ],
  "keyboard": {
    "keydown": {
      "0": "super",
      "8": "backspace",
      "9": "tab",
      "13": "enter",
      "16": "shift",
      "17": "ctrl",
      "18": "alt",
      "19": "pause",
      "20": "capslock",
      "27": "escape",
      "32": "space",
      "33": "pageup",
      "34": "pagedown",
      "35": "end",
      "36": "home",
      "37": "left",
      "38": "up",
      "39": "right",
      "40": "down",
      "45": "insert",
      "46": "delete",
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "59": ";",
      "61": "=",
      "65": "a",
      "66": "b",
      "67": "c",
      "68": "d",
      "69": "e",
      "70": "f",
      "71": "g",
      "72": "h",
      "73": "i",
      "74": "j",
      "75": "k",
      "76": "l",
      "77": "m",
      "78": "n",
      "79": "o",
      "80": "p",
      "81": "q",
      "82": "r",
      "83": "s",
      "84": "t",
      "85": "u",
      "86": "v",
      "87": "w",
      "88": "x",
      "89": "y",
      "90": "z",
      "91": "leftwin",
      "92": "rightwin",
      "93": "select",
      "96": "numpad_0",
      "97": "numpad_1",
      "98": "numpad_2",
      "99": "numpad_3",
      "100": "numpad_4",
      "101": "numpad_5",
      "102": "numpad_6",
      "103": "numpad_7",
      "104": "numpad_8",
      "105": "numpad_9",
      "106": "multiply",
      "107": "add",
      "109": "-",
      "110": "decimal_point",
      "111": "divide",
      "112": "f1",
      "113": "f2",
      "114": "f3",
      "115": "f4",
      "116": "f5",
      "117": "f6",
      "118": "f7",
      "119": "f8",
      "120": "f9",
      "121": "f10",
      "122": "f11",
      "123": "f12",
      "144": "numlock",
      "145": "scrolllock",
      "186": ";",
      "187": "=",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "/",
      "192": "`",
      "219": "[",
      "220": "\\",
      "221": "]",
      "222": "'",
      "224": "command"
    },
    "keypress": {
      "8": "backspace",
      "13": "enter",
      "32": "space",
      "33": "!",
      "34": "\"",
      "35": "#",
      "36": "$",
      "37": "%",
      "38": "&",
      "39": "'",
      "40": "(",
      "41": ")",
      "42": "*",
      "43": "0",
      "44": ",",
      "45": "-",
      "46": ".",
      "47": "/",
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "58": ":",
      "59": ";",
      "60": "<",
      "61": "=",
      "62": ">",
      "63": "?",
      "64": "@",
      "65": "A",
      "66": "B",
      "67": "C",
      "68": "D",
      "69": "E",
      "70": "F",
      "71": "G",
      "72": "H",
      "73": "I",
      "74": "J",
      "75": "K",
      "76": "L",
      "77": "M",
      "78": "N",
      "79": "O",
      "80": "P",
      "81": "Q",
      "82": "R",
      "83": "S",
      "84": "T",
      "85": "U",
      "86": "V",
      "87": "W",
      "88": "X",
      "89": "Y",
      "90": "Z",
      "91": "[",
      "92": "\\",
      "93": "]",
      "94": "^",
      "95": "_",
      "96": "`",
      "97": "a",
      "98": "b",
      "99": "c",
      "100": "d",
      "101": "e",
      "102": "f",
      "103": "g",
      "104": "h",
      "105": "i",
      "106": "j",
      "107": "k",
      "108": "l",
      "109": "m",
      "110": "n",
      "111": "o",
      "112": "p",
      "113": "q",
      "114": "r",
      "115": "s",
      "116": "t",
      "117": "u",
      "118": "v",
      "119": "w",
      "120": "x",
      "121": "y",
      "122": "z",
      "123": "{",
      "124": "|",
      "125": "}",
      "126": "~"
    }
  }
}