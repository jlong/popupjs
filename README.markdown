PopupJS
=======

PopupJS is a simple Prototype-based library for creating Facebook-like popup
windows and dialogs. It leverages Dan Webb's excellent Low Pro library to
allow you to unobtrusively create popup windows with a minimal amount of code.

<img src="/downloads/jlong/popupjs/popup.png" alt="popup window" />

Dependencies: prototype.js, dragdrop.js, effects.js, lowpro.js

Learn More: <http://github.com/jlong/popupjs>

Copyright (c) 2008-2011, John W. Long  
Portions copyright (c) 2008, Five Points Solutions, Inc.


Installation
------------------------------------------------------------------------------

PopupJS depends on [Prototype][1], [Scriptaculous][2], and [Low Pro][3]. To
use PopupJS you will need to download and install them in the appropriate
directory on your web server and reference them with _script_ tags in the
_head_ portion of your HTML document:

    <script type="text/javascript" src="/javascripts/prototype.js"></script>
    <script type="text/javascript" src="/javascripts/effects.js"></script>
    <script type="text/javascript" src="/javascripts/dragdrop.js"></script> 
    <script type="text/javascript" src="/javascripts/lowpro.js"></script>

After including all of the dependencies in your HTML document, don't forget to
include PopupJS:

    <script type="text/javascript" src="/javascripts/popup.js"></script>

There are also a number of images included in the distribution. You should
install these in your "images" folder on your web server.

PopupJS expects you to style the contents of your popup windows yourself. The
contents of a popup window includes the titlebar, buttons, etc. If you are
looking for some basic styles to get you started, check out "facebook.css" in
the distribution.


Low Pro Behaviors
------------------------------------------------------------------------------

PopupJS makes heavy use a custom Low Pro behavior that makes it easy to
[unobtrusively][4] attach the popup functionality to the DOM. 

If you are not familiar with Low Pro and unobtrusive javascript, check out
this article on Dan Webb's blog:

* [Low Pro: Unobtrusive Scripting For Prototype][5]


Using the Trigger Behavior
------------------------------------------------------------------------------

The Popup.Trigger behavior allows you to open up any div or URL inside of a
Facebook-style window. To use it you must install the behavior using
Low Pro's friendly _addBehavior_ function:

    Event.addBehavior({
      'a.popup': Popup.TriggerBehavior()
    });

The code above associates all links with a class of "popup" with the
Popup.TriggerBehavior. This allows you to create a popup link like this:

    <a class="popup" href="window.html">Popup</a>

The link above will use Ajax to open the contents of "window.html" in a
Facebook-like popup window. Note that the contents of "window.html" will be
inserted directly into the DOM. Don't include the normal HTML _head_ and
_body_ tags in the window document, just include the snippet of HTML that
should be inserted.

If you would like to store the contents of your windows on the same page,
place it in a hidden div:

    <div id="hello" class="popup" style="hidden">Hello World</div>

In your popup link, set the _href_ attribute of the link to the ID of the div
like this:

    <a class="popup" href="#hello">Popup</a>

The link above would open the contents of the "hello" div in a popup window
when clicked.


Manually Creating Popup Windows
------------------------------------------------------------------------------

The trigger behavior is useful for the simple case where you want to associate
a link with a popup window, but sometimes you need more control.

In these cases you can manually create a popup window in code, like this:

    var popup = new Popup.Window('element_id', {draggable: true});
    popup.show();

The Popup.Window constructor accepts two parameters. The first is the ID of the
element that contains the contents of the popup window. The second is the
options hash. For regular popup windows, there is only one option:
_draggable_. By default, this option is false, but when set to true it allows
a window to be repositioned by dragging the titlebar. The titlebar element
must have a class of "popup_title" (this can be configured with the
Popup.TitlebarClass variable).

If you need to create an Ajax window, you can use the following code:

    var popup = new Popup.AjaxWindow(url, {reload: false});
    popup.show();

The Popup.AjaxWindow constructor accepts two parameters. The first is the URL
of the contents of the popup window, and the second is an options hash. The
options hash can contain the _draggable_ and _reload_ options. The
reload option is true by default and controls whether or not the contents of
the window will be reloaded each time the window is shown.

To hide a window, use the hide function:

    popup.hide();


Popup Dialogs
------------------------------------------------------------------------------

PopupJS also includes replacements for the standard _alert_ and _confirm_
javascript functions so that you can easily display message boxes and
confirmation dialogs.

Here's a couple of examples:

    // OK alert dialog
    Popup.alert('Hello World!');
    
    // Confirmation dialog with OK and Cancel buttons
    Popup.confirm('Are you sure?', {
      okay: function() { ... },
      cancel: function() { ... }
    });

If you want more control over the buttons used in the dialog, you can use the
_Popup.dialog()_ function:

    // Completely custom dialog with Yes, No, and Maybe
    Popup.dialog({
      title: 'Friend Request',
      message: 'Add Dwight Schrute as a friend?',
      buttons: ['Yes', 'No', 'Maybe'],
      buttonClick: function(button) { ... }
    });

The _Popup.alert()_ and _Popup.confirm()_ functions are implemented in terms
of the _Popup.dialog()_ function and both accept the same options as the
_Popup.dialog()_ function. To use a custom title and buttons on an alert
dialog you could do this:

    Popup.alert('Jim was here.', {title: 'The Office', buttons: ['Yup'] });


Support and Contributions
------------------------------------------------------------------------------

All of the development of PopupJS takes place on GitHub:

* <http://github.com/jlong/popupjs>

If you run into a problem, please file a ticket on the [issue tracker][6]. Or
even better, [submit a pull request][7]. Contributions are welcome and
encouraged.


License
------------------------------------------------------------------------------

PopupJS is distributed under an MIT-style license. Use it for good or for
awesome.


[1]: http://prototypejs.org
[2]: http://script.aculo.us
[3]: http://github.com/danwrong/low-pro
[4]: http://en.wikipedia.org/wiki/Unobtrusive_JavaScript
[5]: http://www.danwebb.net/2006/9/3/low-pro-unobtrusive-scripting-for-prototype
[6]: https://github.com/jlong/popupjs/issues
[7]: http://help.github.com/pull-requests/