Editor.lastPos = 0;
Editor.scroll = {

  onStart: function (eStart, eMove) {
    var startX = eStart.clientX,
        startY = eStart.clientY,
        moveX = eMove.clientX,
        moveY = eMove.clientY;

    // Calculate the scrollbar handle height
    Editor.scroll.handleHeight = Math.floor((Editor.viewport.height / (Editor.text.length * Editor.font.height)) * Editor.viewport.height);
    // If the ration is less than reasnable to grab, make it a size thats grabable
    if(Editor.scroll.handleHeight <= 50){
      Editor.scroll.handleHeight = 50;
    }

    if( // The horizontal scrollbar
      eStart.clientY >= Editor.viewport.height + Editor.viewport.top &&
      eStart.clientX <= Editor.viewport.width + Editor.viewport.left
    ){

      Editor.scroll.handleX = moveX - startX;

    }
    else{ // the vertical

      if(moveY - startY + Editor.lastPos >= 0 && moveY - startY + Editor.lastPos <= Editor.viewport.height - Editor.scroll.handleHeight){
        Editor.scroll.handleY = moveY - startY + Editor.lastPos;
        Editor.scroll.charsFromtop = Math.ceil(((Editor.scroll.handleY) / (Editor.viewport.height - 32)) * Editor.text.length) + 1;
      }

    }

  },

  onStop: function (startEvent, stopEvent) {
    Editor.lastPos =  Editor.scroll.handleY;
  },

  paintBars: function () {

    var ctx = Editor.core.ctx,
        scrollBarWidth = Editor.viewport.scrollBarWidth;

    // Scrollbar background
    ctx.fillStyle = "rgba(104, 123, 135, .75)";
    ctx.fillRect(Editor.width - scrollBarWidth, 0, scrollBarWidth, Editor.height - (scrollBarWidth * 2));
    // Scrollbar handle
    ctx.fillStyle = "rgba(12, 55, 82, .80)";
    ctx.fillRect(Editor.width - scrollBarWidth, Editor.scroll.handleY, scrollBarWidth, Editor.scroll.handleHeight);

    // Scrollbar (horizontal) background
    ctx.fillStyle = "rgba(104, 123, 135, .75)";
    ctx.fillRect(0, Editor.height - (scrollBarWidth * 2), Editor.width - scrollBarWidth, scrollBarWidth);
    // Scrollbar handle
    ctx.fillStyle = "rgba(12, 55, 82, .80)";
    ctx.fillRect(Editor.scroll.handleX, Editor.height - (scrollBarWidth * 2), 750, scrollBarWidth);

  }

};

Editor.viewport = {

  setup: function() {
    Editor.viewport.scrollBarWidth = 17;
    Editor.viewport.top = 0;
    Editor.viewport.left = 0;
    Editor.viewport.width = Editor.settings.width - Editor.viewport.scrollBarWidth;
    Editor.viewport.height = Editor.settings.height - (Editor.viewport.scrollBarWidth * 2);
  },

  attachEvents: function () {

    jQuery(window).bind('resize',function(){
      Editor.settings.width = document.width;
      Editor.settings.height = document.height;
    })

    // Prevent any default mouse funnyness
    jQuery(document).bind('mousedown', function(e){
      e.preventDefault();
    });

    // Setup scrollbar event logic
    jQuery(Editor.canvas).bind('mousedown', function (startEvent) {

      var overScrollHandle = (
        (
        startEvent.clientY <= Editor.viewport.height + Editor.viewport.top &&
        startEvent.clientX >= Editor.viewport.width + Editor.viewport.left
        ) ||
        (
        startEvent.clientY >= Editor.viewport.height + Editor.viewport.top &&
        startEvent.clientX <= Editor.viewport.width + Editor.viewport.left
        )
      );

      if(overScrollHandle){

        jQuery(document).bind('mousemove.editSBid', function (moveEvent) {
          Editor.scroll.onStart(startEvent, moveEvent);
          Editor.scroll.scrolling = true;
        });

        jQuery(document).bind('mouseup.editSBid', function (stopEvent) {

          if (Editor.scroll.scrolling) {
            Editor.scroll.onStop(startEvent, stopEvent);
            Editor.scroll.scrolling = false;
          }

          jQuery(document).unbind('mousemove.editSBid');
          jQuery(document).unbind('mouseup.editSBid');

        });

      }

      // Unselect the selection when the mouse goes down again
      Editor.select.unselect();

    });

  },




  paintBackground: function () {
    Editor.core.ctx.fillStyle = "rgba(24, 44, 79, 1)";
    Editor.core.ctx.fillRect(0, 0, Editor.width, Editor.height);
  }


};


Editor.scroll.handleY = 1;
Editor.scroll.handleX = 1;
Editor.scroll.charsFromtop = 0;

setTimeout(function(){

      // Calculate the scrollbar handle height
    Editor.scroll.handleHeight = Math.floor((Editor.viewport.height / (Editor.text.length * Editor.font.height)) * Editor.viewport.height);
    // If the ration is less than reasnable to grab, make it a size thats grabable
    if(Editor.scroll.handleHeight <= 50){
      Editor.scroll.handleHeight = 50;
    }


}, 200);