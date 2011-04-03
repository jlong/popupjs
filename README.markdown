PopupJS
=======

PopupJS is a LowPro and Prototype-based library for creating Facebook-like
popup windows.

Dependencies: prototype.js, dragdrop.js, effects.js, lowpro.js

Homepage: <http://github.com/jlong/popupjs>


Using PopupJS
--------------------------------------------------------------------------

PopupJS allows you to open up a URL inside of a Facebook-style window.
To use simply assign the class "popup" to a link that contains an href to
the HTML snippet that you would like to load up inside a window:

    <a class="popup" href="window.html">Window</a>

You can also "popup" a specific div by referencing it by ID:

    <a class="popup" href="#my_div">Popup</a>
    <div id="my_div" style="display:none">Hello World!</div>

You will need to install the following hook:

    Event.addBehavior({'a.popup': Popup.TriggerBehavior(...)});

You can also manually create a popup window if you need to do so in code:

    var popup = new Popup.Window('my_div', {draggable: true});

Or if you need to create an Ajax window:

    var popup = new Popup.AjaxWindow(url, {draggable: true});

PopupJS also includes a couple of utility functions that make it easy to
show common dialogs:

    // OK alert dialog
    Popup.alert('Hello World!');
    
    // Confirmation dialog with OK and Cancel buttons
    Popup.confirm('Are you sure?', {
      okay: function() { ... },
      cancel: function() { ... }
    });
    
    // Completely custom dialog with Yes, No, and Maybe
    Popup.dialog({
      title: 'Friend Request',
      message: 'Add Dwight Schrute as a friend?',
      buttons: ['Yes', 'No', 'Maybe'],
      buttonClick: function(button) { ... }
    });


License and Copyright
--------------------------------------------------------------------------

Copyright (c) 2008-2011, John W. Long
Portions copyright (c) 2008, Five Points Solutions, Inc.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.