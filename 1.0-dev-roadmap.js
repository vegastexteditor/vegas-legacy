/**
 * @file
 * @author  Daniel Lopez <daniel.a.lopez@gmail.com>
 * @version 0.2-dev
 *
 * @section LICENSE
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details at
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @section DESCRIPTION
 *
 * A configurable, efficient, usable and easy to learn text editor. Which
 * is easy configure and develop customizations for.
 *
 * @section APPLICATION FOCUS
 *
 * The Primary audience is Web developers for both development and use. (But for
 * for general use should be extendable to include other editing environments,
 * for example: general text editing, Ruby, Python, C, C++, Java, etc etc.)
 *
 * With the primary audience being web developers, the application should be
 * written almost entirely in web technologies.
 *
 * The application's environment is LOCAL, and should inherit benifits of
 * desktop applications. While allowing for existance on the web as well.
 *
 * Target environments include, Titanium Desktop, GnomeShell, Google Desktop,
 * and webos type environments which provide an javascript API to the filesystem
 * and maybe the desktop.
 *
 * General usability:
 * 
 *   - Default settings are extremly important, and should be thought out well
 *   
 *   - Almost erything should a configuration option
 *
 *   - Initially two flavors, minimal and visual.
 *
 *       Minimal: The editing area will be the only default visual area. Any
 *       additional interfaces will be called via shortcuts, including the command
 *       bar.
 *
 *       Visual: By default configurations will contain two panels, the file
 *       explorer and the editor hint pane (code and shortcut completion/hints)
 *
 * Developer usability:
 *
 *   - Entry point to development of core application should be minimal.
 *
 *   - Should not be abstracted unless necissary.
 *
 *   - Difference between the codebase and API should be minimal.
 *
 *   - When possible should be almost entirely in web technologies.
 *
 *   - Code optimzations should not unnecissarily make the application harder
 *     to understand. If necissary these optimzations should be EXCESSIVELY
 *     documented.
 *
 * @section APPLICATION CONCEPTS
 *
 * Editor
 *   The Editor is the entire application its self providing the global object.
 *
 * Buffers
 *   Contain the text that is currently in memory
 *
 * Resources
 *   References to the saved text (a reference to a file on disk)
 *
 * Scope
 *   Gives the file context, defines the root of the project, via a project
 *   definition file or from version control)
 *
 * Windows
 *   A base container for visualization, can contain Pane(s)
 *
 * Panes
 *   A container for views. When there is only one pane, Views(s) takes up the
 *   entire window. Panes come in sets of two. Each set of panes may be vertical
 *   or horizontal. Which allows for a "split view" of the editors "Views".
 *
 * Components
 *   A container for a component, the primary component is an "EditArea"
 *
 * Tabs
 *   A container for views, when there is only one view
 *
 * Settings
 *   Pretty much everything should provide settings... any reasonable variables.
 *
 * Actions
 *   Actions are rudimentary things like backspace, delete, scrolldown, cut, paste
 *
 * Macros
 *   Are complex sets of actions and custom logic, pretty much too small to be a plugin
 *
 * Plugins
 *   Contain general features for the editor
 *
 * Flavors
 *   Contain are a sets of settings and plugins to form different user experiences
 *
 */

Editor = (function(){

  var view1 = {
    buffer: session.buffers[0],
    cursor: cursorInstance,
    selection: selectionInstance,
    config: globalConfigInstance,
  };

  var session = {

    activeWindow: session.windows[1],
    activePane: session.activeWindow.panes[0],
    activeTab: session.activePane.tabs[3],

    windows: [
      {
        panes: [
          {
            tabs: [view1, view2],
          }
        ]
      },
      {
        panes: [
          [
            {
              tabs: [view3, view4, view5]
            },
            {
              tabs: [view6]
            }
          ],
        ]
      }
    ],

    buffers: [
      { // bufferInstance
        resource: Editor.resourceList[0],
        name: 'somedocument',
        value: [
          'this is one line of text',
          'this is another line of text',
        ]
      }
    ],

    resources: [
      {
        type: 'filesystem', // filesystem|http,ftp,sftp,
        location: '/home/johndoe/notes/somedocument.txt',
        scope: reference_scope1
      }
    ],

    scopes: {

    },

  };

  var editor = {

    session: session, // Everything remotely usefull should be available to plugins.

    construct: function(self){
     var args = arguments;
      if (!(self instanceof args.callee)) {
        throw new Error("Constructor called as a function");
      }
     self.init.apply(self, args);
    },

    core: {
      removeText: function(){},
      insertText: function(){},
      /* etc etc*/
    },

    actions: {
      actionBackspace: function(){},
      actionDelete: function(){},
      actionEnter: function(){},
      actionUp: function(){},
      actionDown: function(){},
      /* etc etc */
    },

    cursor: {
      draw: function(){},
      events: function(){},
      getFromXy: function(){},
      down: function(){},
      up: function(){},
      left: function(){},
      right: function(){},
      home: function(){},
      end: function(){},
      nextWord: function(){},
      prevWord: function(){},
      nextBlock: function(){},
      prevBlock: function(){},
      nextSmart: function(){},
      prevSmart: function(){},
      top: function(){},
      bottom: function(){},
      /* etc etc */
    },

    select: {
      draw: function(){},
      events: function(){},
      select: function(){},
      unselect: function(){},
      onstart: function(){},
      onstop: function(){},
    },

    highlighter: ({/* etc etc */}),

    parser: ({/* etc etc */}),

    interpreter: ({/* etc etc */}),

    plugins: ({/* etc etc */}),

    window: {
      create: function(){

      },
      remove: function(){

      },
    },

    pane: {

      draw: function(){

      },

      events: {

        add:function(){

        },

        remove: function(){

        }

      },

      create: function(type, buffers){

      },

      remove: function(){

      },

      moveTo: function(position){

      },

      /**
       * Gets the window that the pane exists in
       *
       * @return Object of Window
       *
       */
      getWindow: function(){
        return window;
      }
    },

    tab: (function(){

      var tab = function(){Editor.construct(this);};

      tab.prototype = {

        init: function (){
          this.create(arguments);
        },

        create: function(position){

        },

        events: {

          add:function(){

          },

          remove: function(){

          }

        },

        remove: function(){

        },

        moveTo: function(pane){

        },

        /**
         * Gets the window that the tab exists in
         *
         * @return Object of Window
         *
         */
        getWindow: function(){

        },

        /**
         * Gets the pane that the tab exists in
         *
         * @return Object of Pane
         *
         */
        getPane: function(){

        },

      }

    }()),

    /*
     * There can only be one active buffer. The contains the text that is in
     * memory, typically the active buffer will take input from the keyboard
     * when the editor is in insert mode.
     *
     * @return
     *
     */
    buffer: (function(){

      var buffer = function(){Editor.construct(this);};

      buffer.prototype = {

        init: function (){
          this.create(arguments);
        },

        activate: function(buffer_id){
          for (var i = 0; i < this._onActivate.length; i++) {
            this._onActivate[i](buffer_id);
          }
        },

        onActivate: function(callback){
          this._onActivate.push(callback);
        },

        /**
         *  Removes buffer from memory (Unsafe: does not save changes)
         *  @returns True on success, false on failure.
         */
        destroy: function(buffer_id){
          return false;
        },

        /**
         * Opens a resource and turns it into a buffer instance
         * @return bufferInstance
         */
        create: function(resource){
          return bufferInstance;
        },

        /**
         * A list of buffers from the specified context
         */
        list: function(context){
          context = context || 'global';

          return bufferList;
        },

        seek: function(key, context){
          context = context || 'global';
          
          return bufferList;
        },
      };

      return buffer;

    }()),

    view: {

      create: function(buffer, cursorInstance, selectionInstance, configurationInstance){

      },

      remove: function(){

      },

      update: function(){

      },

    },

    resource: {

      create: function(){

      },

      remove: function(){

      },

      read: function(){

      },

      update: function(){

      },

    },

    scope: {

      create: function(){

      },

      remove: function(){

      },

      update: function(){

      },

      read: function(){

      }

    },

  };

  return editor;


}());


1.0-dev-roadmap.js