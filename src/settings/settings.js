(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas,
      settings = vegas.settings || {};

  settings.backgroundColor = '#bebebe';
  settings.masterPaintInterval =  500;

  settings.panes = {
    handleWidth: 7,
    backgroundColor: 'rgb(245,245,245)',
    highlightColor: 'rgb(98,89,194)',
    HighlightStrokeSize: 2,
    blah: {meh:'meh'}
  };

  settings.debug = {
    panes: true,
  };

  vegas.settings = settings
  vegas.options = settings;

}());