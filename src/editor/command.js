Editor.command = {

  paintCommandArea: function () {

    var ctx = Editor.core.ctx,
        scrollBarWidth = Editor.viewport.scrollBarWidth;;

    // CommandArea background
    ctx.fillStyle = "rgba(0, 0, 0, .75)";
    ctx.fillRect(0, Editor.height - scrollBarWidth, Editor.width, scrollBarWidth);

    ctx.fillStyle = "rgba(12, 55, 82, .75)";
    ctx.fillRect(1, Editor.height - scrollBarWidth + 1, Editor.width - 2, scrollBarWidth - 2);

  },

  paintInfoBox: function () {
    var scrollBarWidth = Editor.viewport.scrollBarWidth;

    // Info Box
    Editor.core.ctx.fillStyle = "rgba(255, 255, 255, .75)";
    Editor.core.ctx.fillRect(Editor.width - scrollBarWidth, Editor.height - (scrollBarWidth * 2), scrollBarWidth, scrollBarWidth);
  }

}