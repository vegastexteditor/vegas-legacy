(function() {
  var global = (function(){return this;}).call(),
      vegas = global.vegas;

    /**
     * Basic file actions, think of this as a typical file menu list, should
     * remain fairly high level.
     */
    vegas.file = (function(){

      /*
       * Private methods
       */
      var _save = function (buffer) {
        buffer = buffer || session.activeBuffer;
        return buffer.save();
      };

      var file = {

        'new': function () {
          var resource = null;
          var buffer = new vegas.Buffer(resource);
          var editArea = new vegas.EditArea(buffer);
          editArea.attach();
        },

        newFile: function(){this['new'].apply(this, arguments)},

        open: function (resourceLocation) {
          var resource = new vegas.Resource(resourceLocation);
          var buffer = new vegas.Buffer(resource);
          var editArea = new vegas.EditArea(buffer);
          editArea.attach();
        },

        close: function (editArea) {
          editArea = editArea || session.activeEditArea;
          editArea.close();
        },

        save: function () {
          if (_save()){
            vegas.status.displayMessage('File has been saved.');
          }
          else {
            vegas.status.displayMessage('File could not be saved, check console.');
          }
        },

        saveAs: function (resourceLocation, buffer) {

          if (typeof(resourceLocation) !== 'string') {
            console.error('bad param: resourceLocation');
          }

          buffer = buffer || session.activeBuffer;

          var resource = new vegas.Resource(resourceLocation);

          buffer.setResource(resource);
          buffer.save();
        },

        saveAll: function () {
          var unsavedBuffers = buffers.getUnsavedBuffers(),
              buffer,
              buffersSaved = [],
              buffersFailed = [];

          for (var i = 0; i < unsavedBuffers.length; i++) {
            buffer = unsavedBuffers[i];

            if (_save(buffer)) {
              buffersSaved.push(buffer);
            }
            else{
              buffersFailed.push();
            }

          }

          if (buffersSaved.length === unsavedBuffers.length) {
            vegas.status.displayMessage('All buffers saved.');
          }
          else{
            console.log('Could not save buffers: ', buffersFailed.implode(', '));
            vegas.status.displayMessage('Could not save all buffers, check console.');
          }

        },

        /*
         * These methods are user facing and will be available to the command line.
         */
        api: [
          this['new'],
          this.open,
          this.save,
          this.saveAs,
          this.saveAll
        ]

      };

      return file;

    }());

  vegas.module.register('file.js');

}());