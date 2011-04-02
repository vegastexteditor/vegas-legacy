Vegas
=====================

  A configurable, extensable, text editor with a focus on usability and
  progressive efficiency.

Status
=====================
* Completed Working prototype: http://bit.ly/vegasprototype (Chrome seems to work)
* Building out skeleton of new architecture

Authors
=====================
* Daniel Lopez <daniel.a.lopez@gmail.com>

License
=====================

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details at
  http://www.gnu.org/copyleft/gpl.html

Application Focus
=====================

  The Primary audience is developers using web technologies for both development
  of the project and regular use. In general it should support the use of and be
  extensible to include other editing focuses, e.i., general text editing, Ruby,
  Python, C, C++, Java, etc.

  With the primary audience being web developers, the application should be
  written almost entirely in web technologies.

Target environments
=====================

  The application's environment is LOCAL, and should inherit benefits of
  desktop applications. While allowing for existence on the web as well.

  Target desktop platforms include, Titanium Desktop, Future versions of
  adobe air and any other desktop environments which may provide a JavaScript API
  to the file system and some portions of the operating system.

 Usability Goals
=====================

### General usability ###

  - Default settings are extremely important, and should be thought out well

  - Almost everything should be available as a configuration option

  - Initially two flavors, minimal and visual.

     - Minimal: The editing area will be the only default visual area. Any
     additional interfaces will be called via shortcuts, including the command
     bar.

     - Visual: By default configurations will contain two panels, the file
     explorer and the editor hint pane (code and shortcut completion/hints)

### Developer usability ###

  - Entry point to development of core application should be minimal.

  - Should not be abstracted unless necessary.

  - Differences between the code base and API should be minimal.

  - When possible should be almost entirely in web technologies.

  - Code optimizations should not unnecessarily make the application harder
   to understand. If necessary these optimizations should be EXCESSIVELY
   documented.

Application Concepts
=====================

  - **Editor**
     The Editor is the entire application itself providing the global object

  - **Scope:**
     Gives the file context, defines the root of the project, via a project
     definition file or from version control)

  - **Buffers (buff):**
     Contain the text that is currently in memory

  - **Resources (res):**
     References to location for text storage (a reference to a file on disk)

  - **Views:**
     A base container for visualization, typically just a window instance. These
     will contain regions.

  - **Regions:**
     A typically rectangular portion of the screen containing a component. These
     can be overlayed on top of other Regions and are for use in a canvas element.
     visual area.

  - **Panes:**
     Panes are a type of pane that may be resized through the user interface,
		 and contain Tabs. When there is only one pane, a pane takes up the entire
		 window. Panes can be one or many. When in there multiple panes, a pane may
		 be vertical or horizontal. Which allows for a "split view" of the editors
		 Components

     Panes should be done in html / css since its deals with layout structure
     which html / css is great at.

  - **Components (cpnt):**
     Visual representations of data in panes, i.e. editArea, fileExplorer, hintViewer

  - **Tabs:**
     A group of Components inside of a single panes, can be visualized in (but
     is not limited to) the traditional tab form.

  - **Options (opt):**
      Selections the user may make to change the behavior of the editor

  - **Settings:**
      Options that are preserved between sessions

  - **Actions (act):**
     Actions are rudimentary... actions such as moveCursorLeft, removePreviousCharacter, scroll down, cut, paste

  - **Macros:**
     Sets of actions and that contain custom logic, macros should be small
     in relation to plugins. Macros can be ran via the command line and do not
     need to be "loaded"

  - **Plugins:**
     Contain general features that alter the behavior or view of the editor.

  - **Flavors:**
     Contain sets of settings and plugins to form different user experiences

  - **Modules**
     Basically javascript files that are loaded at runtime, may provide
     configurations, macros, plugins.

TODO
=====================
* Roadmap
