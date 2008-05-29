/*
 *  popup.js
 *
 *  dependencies: prototype.js, effects.js, lowpro.js
 *
 *  --------------------------------------------------------------------------
 *  
 *  Allows you to open up a URL inside of a Facebook-style window. To use
 *  simply assign the class "popup" to a link that contains an href to the
 *  HTML snippet that you would like to load up inside a window:
 *  
 *    <a class="popup" href="window.html">Window</a>
 *
 *  You can also "popup" a specific div by referencing it by ID:
 *
 *    <a class="popup" href="#my_div">Popup</a>
 *    <div id="my_div" style="display:none">Hello World!</div>
 *  
 *  You will need to install the following hook:
 *  
 *    Event.addBehavior({'a.popup': PopupTriggerBehavior()});
 *
 *  --------------------------------------------------------------------------
 *  
 *  Copyright (c) 2008, John W. Long
 *  Portions copyright (c) 2008, Five Points Solutions, Inc.
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a
 *  copy of this software and associated documentation files (the "Software"),
 *  to deal in the Software without restriction, including without limitation
 *  the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *  and/or sell copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 *  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *  DEALINGS IN THE SOFTWARE.
 *  
 */

PopupTriggerBehavior = Behavior.create({
  
  initialize: function() {
    var matches = this.element.href.match(/\#(.+)$/);
    if (matches) {
      this.window = new PopupWindow($(matches[1]));
    } else {
     this.window = new PopupAjaxWindow(this.element.href);
    }
  },
  
  onclick: function(event) {
    this.popup();
    event.stop();
  },
  
  popup: function() {
    this.window.show();
  }
  
});

AbstractPopupWindow = Class.create({
  initialize: function() {
    this.buildWindow();
  },
  
  buildWindow: function() {
    this.element = $div({'class': 'popup_window', style: 'display: none; padding: 0 8px; position: absolute'});
    
    this.top = $div({style: 'background: url(/images/popup_border_background.png); height: 8px'});
    this.element.insert(this.top);
    
    var outer = $div({style: 'background: url(/images/popup_border_background.png); margin: 0px -8px; padding: 0px 8px; position: relative'});
    this.element.insert(outer);
    
    this.bottom = $div({style: 'background: url(/images/popup_border_background.png); height: 8px'});
    this.element.insert(this.bottom);
    
    var topLeft = $img({src: '/images/popup_border_top_left.png', style: 'position: absolute; left: 0; top: -8px'});
    outer.insert(topLeft);
    
    var topRight = $img({src: '/images/popup_border_top_right.png', style: 'position: absolute; right: 0; top: -8px'});
    outer.insert(topRight);
    
    var bottomLeft = $img({src: '/images/popup_border_bottom_left.png', style: 'position: absolute; left: 0; bottom: -8px'});
    outer.insert(bottomLeft);
    
    var bottomRight = $img({src: '/images/popup_border_bottom_right.png', style: 'position: absolute; right: 0; bottom: -8px'});
    outer.insert(bottomRight);
    
    this.content = $div({style: 'background-color: white'});
    outer.insert(this.content);
    
    var body = $$('body').first();
    body.insert(this.element);
  },
  
  show: function() {
    this.beforeShow();
    this.centerWindowInView();
    this.element.show();
    var form = this.element.down('form');
    if (form) {
      var element = form.getElements()[0] || form.down('button');
      if (element) element.focus();
    }
  },
  
  beforeShow: function() {
    // IE does not render the border of the popup correctly, nor does it apply the proper stylings to the buttons
    if (Prototype.Browser.IE) {
      var width = this.element.getWidth() - 16; // Width of containing div minus the width of the borders
      this.top.setStyle("width:" + width + "px");
      this.bottom.setStyle("width:" + width + "px");
    }
  },
  
  hide: function() {
    this.element.hide();
  },
  
  centerWindowInView: function() {
    var offsets = document.viewport.getScrollOffsets();
    this.element.setStyle({
      left: parseInt(offsets.left + (document.viewport.getWidth() - this.element.getWidth()) / 2) + 'px',
      top: parseInt(offsets.top + (document.viewport.getHeight() - this.element.getHeight()) / 2.2) + 'px'
    });
  }
});

PopupWindow = Class.create(AbstractPopupWindow, {
  initialize: function($super, element) {
    $super();
    element.remove();
    this.content.update(element);
    element.show();
  }
});

PopupAjaxWindow = Class.create(AbstractPopupWindow, {
  initialize: function($super, url) {
    $super();
    this.url = url;
  },
  
  show: function($super) {
    var update = this.content;
    new Ajax.Updater(this.content, this.url, {asynchronous: false, method: "get"});
    $super();
  }
});

Element.addMethods({
  closePopup: function(element) {
    $(element).up('div.popup_window').hide();
  }
});