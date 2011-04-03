/*
 * PopupJS
 * =======
 * 
 * PopupJS is a LowPro and Prototype-based library for creating Facebook-like
 * popup windows.
 * 
 * Dependencies: prototype.js, dragdrop.js, effects.js, lowpro.js
 * 
 * Homepage: <http://github.com/jlong/popupjs>
 * 
 * 
 * Using PopupJS
 * --------------------------------------------------------------------------
 * 
 * PopupJS allows you to open up a URL inside of a Facebook-style window.
 * To use simply assign the class "popup" to a link that contains an href to
 * the HTML snippet that you would like to load up inside a window:
 * 
 *     <a class="popup" href="window.html">Window</a>
 * 
 * You can also "popup" a specific div by referencing it by ID:
 * 
 *     <a class="popup" href="#my_div">Popup</a>
 *     <div id="my_div" style="display:none">Hello World!</div>
 * 
 * You will need to install the following hook:
 * 
 *     Event.addBehavior({'a.popup': Popup.TriggerBehavior(...)});
 * 
 * You can also manually create a popup window if you need to do so in code:
 * 
 *     Popup.Window('popup_div', ...)
 * 
 * PopupJS also includes a couple of utility functions that make it easy to
 * show common dialogs:
 * 
 *     // OK alert dialog
 *     Popup.alert('Hello World!');
 *     
 *     // Confirmation dialog with OK and Cancel buttons
 *     Popup.confirm('Are you sure?', {
 *       okay: function() { ... },
 *       cancel: function() { ... }
 *     });
 *     
 *     // Completely custom dialog with Yes, No, and Maybe
 *     Popup.dialog({
 *       title: 'Friend Request',
 *       message: 'Add Dwight Schrute as a friend?',
 *       buttons: ['Yes', 'No', 'Maybe'],
 *       buttonClick: function(button) { ... }
 *     });
 * 
 * 
 * License and Copyright
 * --------------------------------------------------------------------------
 * 
 * Copyright (c) 2008-2011, John W. Long
 * Portions copyright (c) 2008, Five Points Solutions, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

var Popup = {
  
  // Borders
  BorderThickness: 8,
  BorderImage: '/images/popup_border_background.png',
  BorderTopLeftImage: '/images/popup_border_top_left.png',
  BorderTopRightImage: '/images/popup_border_top_right.png',
  BorderBottomLeftImage: '/images/popup_border_bottom_left.png',
  BorderBottomRightImage: '/images/popup_border_bottom_right.png',
  
  // CSS Classes
  PopupClass: 'popup',
  WindowClass: 'popup_window',
  TitlebarClass: 'popup_title',
  CloseClass: 'close_popup',
  PopupContentClass: 'popup_content',
  ButtonsClass: 'popup_buttons',
  DefaultButtonClass: 'default',
  
  // Dialog Buttons
  Okay: 'Okay',
  Cancel: 'Cancel',
  
  // Draggable
  Draggable: false
  
};

Popup.windows = [];
Popup.zindex = 10000;
Popup.borderImages = function() {
  return $A([
    Popup.BorderImage,
    Popup.BorderTopLeftImage,
    Popup.BorderTopRightImage,
    Popup.BorderBottomLeftImage,
    Popup.BorderBottomRightImage
  ]);
}

Popup.preloadImages = function() {
  if (!Popup.imagesPreloaded) {
    Popup.borderImages().each(function(src) {
      var image = new Image();
      image.src = src;
    });
    Popup.preloadedImages = true;
  }
}

Popup.TriggerBehavior = Behavior.create({
  
  initialize: function(options) {
    if (!Popup.windows[this.element.href]) {
      var matches = this.element.href.match(/\#(.+)$/);
      Popup.windows[this.element.href] = (matches ? new Popup.Window($(matches[1]), options) : new Popup.AjaxWindow(this.element.href, options));
    }
    this.window = Popup.windows[this.element.href];
  },
  
  onclick: function(event) {
    this.popup();
    event.stop();
  },
  
  popup: function() {
    this.window.show();
  }
  
});

Popup.AbstractWindow = Class.create({
  initialize: function(options) {
    options = Object.extend({draggable: Popup.Draggable}, options)
    this.draggable = options.draggable;
    Popup.preloadImages();
    this.buildWindow();
    this.element.observe('click', this.click.bind(this));
    this.element.observe('popup:hide', this.hide.bind(this));
  },
  
  buildWindow: function() {
    this.element = $div({'class': Popup.WindowClass, style: 'display: none; padding: 0 ' + Popup.BorderThickness + 'px; position: absolute'});
    
    this.top = $div({style: 'background: url(' + Popup.BorderImage + '); height: ' + Popup.BorderThickness + 'px'});
    this.element.insert(this.top);
    
    var outer = $div({style: 'background: url(' + Popup.BorderImage + '); margin: 0px -' + Popup.BorderThickness + 'px; padding: 0px ' + Popup.BorderThickness + 'px; position: relative'});
    this.element.insert(outer);
    
    this.bottom = $div({style: 'background: url(' + Popup.BorderImage + '); height: ' + Popup.BorderThickness + 'px'});
    this.element.insert(this.bottom);
    
    var topLeft = $div({style: 'background: url(' + Popup.BorderTopLeftImage + '); height: ' + Popup.BorderThickness + 'px; width: ' + Popup.BorderThickness + 'px; position: absolute; left: 0; top: -' + Popup.BorderThickness + 'px'});
    outer.insert(topLeft);
    
    var topRight = $div({style: 'background: url(' + Popup.BorderTopRightImage + '); height: ' + Popup.BorderThickness + 'px; width: ' + Popup.BorderThickness + 'px; position: absolute; right: 0; top: -' + Popup.BorderThickness + 'px'});
    outer.insert(topRight);
    
    var bottomLeft = $div({style: 'background: url(' + Popup.BorderBottomLeftImage + '); height: ' + Popup.BorderThickness + 'px; width: ' + Popup.BorderThickness + 'px; position: absolute; left: 0; bottom: -' + Popup.BorderThickness + 'px'});
    outer.insert(bottomLeft);
    
    var bottomRight = $div({style: 'background: url(' + Popup.BorderBottomRightImage + '); height: ' + Popup.BorderThickness + 'px; width: ' + Popup.BorderThickness + 'px; position: absolute; right: 0; bottom: -' + Popup.BorderThickness + 'px'});
    outer.insert(bottomRight);
    
    this.content = $div({style: 'background-color: white'});
    outer.insert(this.content);
    
    var body = $$('body').first();
    body.insert(this.element);
  },
  
  createDraggable: function() {
    if (!this._draggable) {
      this._draggable = new Draggable(this.element.identify(), {
        handle: Popup.TitlebarClass,
        scroll: window,
        zindex: Popup.zindex,
        onStart: function() { this.startDrag(); return true; }.bind(this),
        onEnd: function() { this.endDrag(); return true; }.bind(this)
      });
    }
  },
  
  destroyDraggable: function() {
    if (this._draggable) {
      this._draggable.destroy();
      this._draggable = null;
    }
  },
  
  show: function() {
    this.beforeShow();
    this.element.show();
    this.afterShow();
  },
  
  hide: function() {
    this.beforeHide();
    this.element.hide();
    this.afterHide();
  },
  
  toggle: function() {
    if (this.element.visible()) {
      this.hide();
    } else {
      this.show();
    }
  },
  
  focus: function() {
    var form = this.element.down('form');
    if (form) {
      var elements = form.getElements().reject(function(e) { return e.type == 'hidden' });
      var element = elements[0] || form.down('button');
      if (element) element.focus();
    }
  },
  
  beforeShow: function() {
    if (Prototype.Browser.IE) {
      // IE fixes
      var width = this.element.getWidth() - (Popup.BorderThickness * 2);
      this.top.setStyle("width:" + width + "px");
      this.bottom.setStyle("width:" + width + "px");
    }
    this.bringToTop();
    this.centerWindowInView();
  },
  
  afterShow: function() {
    if (this.draggable) this.createDraggable();
    this.focus();
  },
  
  beforeHide: function() {
    if (this.draggable) this.destroyDraggable();
  },
  
  afterHide: function() {
    // noopp
  },
  
  titlebarClick: function(event) {
    this.bringToTop();
  },
  
  startDrag: function() {
    this.bringToTop();
  },
  
  endDrag: function() {
    this.bringToTop();
  },
  
  click: function(event) {
    if (event.target.hasClassName(Popup.TitlebarClass)) this.titlebarClick();
    if (event.target.hasClassName(Popup.CloseClass)) this.hide();
  },
  
  centerWindowInView: function() {
    var offsets = document.viewport.getScrollOffsets();
    this.element.setStyle({
      left: parseInt(offsets.left + (document.viewport.getWidth() - this.element.getWidth()) / 2) + 'px',
      top: parseInt(offsets.top + (document.viewport.getHeight() - this.element.getHeight()) / 2.2) + 'px'
    });
  },
  
  bringToTop: function() {
    Popup.zindex += 1;
    this.element.style.zIndex = Popup.zindex;
    if (this._draggable) this._draggable.originalZ = Popup.zindex;
  }
  
});

Popup.Window = Class.create(Popup.AbstractWindow, {
  initialize: function($super, element, options) {
    $super(options);
    element = $(element);
    element.remove();
    this.content.update(element);
    element.show();
  }
});

Popup.AjaxWindow = Class.create(Popup.AbstractWindow, {
  initialize: function($super, url, options) {
    $super(options);
    options = Object.extend({reload: true}, options);
    this.url = url;
    this.reload = options.reload;
  },
  
  show: function($super) {
    if (!this.loaded || this.reload) {
      this.hide();
      new Ajax.Updater(this.content, this.url, {
        asynchronous: false,
        method: "get",
        evalScripts: true, 
        onComplete: $super
      });
      this.loaded = true;
    } else {
      $super();
    }
  }
});

Popup.dialog = function(options) {
  options = Object.extend({
    title: 'Dialog',
    message: '[message]',
    width: '20em',
    buttons: [Popup.Okay],
    buttonClick: function() { }
  }, options);
  
  var wrapper = $div({'class': Popup.PopupClass, style: 'width:' + options.width});
  wrapper.insert($div({'class': Popup.TitlebarClass}, options.title));
  
  var content = $div({'class': Popup.PopupContentClass});
  var paragraph = $p();
  paragraph.innerHTML = options.message.gsub('\n', '<br />');
  content.insert(paragraph);
  
  var buttons = $div({'class': Popup.ButtonsClass});
  for (var index = 0; index < options.buttons.length; index++) {
    var classes = Popup.CloseClass;
    if (index == 0) classes += ' ' + Popup.DefaultButtonClass;
    buttons.insert($button({'class': classes}, options.buttons[index]));
  }
  content.insert(buttons);
  wrapper.insert(content);
  
  var popup = new Popup.AbstractWindow(options);
  popup.content.insert(wrapper);
  
  popup.element.observe('click', function(event) {
    var button = event.target;
    if (button.nodeName == "BUTTON") options.buttonClick(button.innerHTML);
  }.bind(this));
  
  popup.show();
}

Popup.confirm = function(message, options) {
  options = Object.extend({
    title: 'Confirm',
    message: message,
    width: '20em',
    buttons: [Popup.Okay, Popup.Cancel],
    okay: function() { },
    cancel: function() { }
  }, options)
  
  options.buttonClick = options.buttonClick || function(button) {
    if (button == Popup.Okay) options.okay();
    if (button == Popup.Cancel) options.cancel();
  }
  
  Popup.dialog(options);
}

Popup.alert = function(message, options) {
  options = Object.extend({
    title: 'Alert',
    buttons: [Popup.Okay]
  }, options)
  
  Popup.confirm(message, options)
}

// Element extensions
Element.addMethods({
  closePopup: function(element) {
    $(element).up('div.popup_window').fire('popup:hide');
  }
});