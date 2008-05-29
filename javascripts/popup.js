/*
 *  popup_behavior.js
 *
 *  dependencies: prototype.js, effects.js, lowpro.js
 *
 *  --------------------------------------------------------------------------
 *  
 *  Allows you to open up a URL inside of a Facebook-style window. To use
 *  simply assign the class "popup" to a link that contains an href to the
 *  page that you would like to load up inside of a window:
 *  
 *    <a class="popup" href="window.html">Window</a>
 *  
 *  You will need to install the following hook:
 *  
 *    Event.addBehavior({'a.popup': PopupBehavior()});
 *
 *  --------------------------------------------------------------------------
 *  
 *  Copyright (c) 2008, John W. Long
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

PopupBehavior = Behavior.create({
  
  initialize: function() {
    this.window = new PopupWindow(this.element.href);
  },
  
  onclick: function(event) {
    this.popup();
    event.stop();
  },
  
  popup: function() {
    this.window.show();
  }
  
});

PopupWindow = Class.create({
  
  initialize: function(url) {
    this.url = url;
    this.element = $div({style: 'display: none; position: absolute'});
    this.render();
    this.body = $$('body').first();
    this.body.insert(this.element);
  },
  
  show: function() {
    this.iframe.contentWindow.closePopup = this.hide.bind(this);
    this.element.setStyle('display: block; visibility: hidden');
    this.positionWindow();
    this.element.setStyle('visibility: visible');
  },
  
  hide: function() {
    this.element.hide();
  },
  
  positionWindow: function() {
    var body = this.iframe.contentWindow.document.getElementsByTagName('body')[0];
    var width = body.getWidth();
    var height = body.getHeight();
    body.setStyle('overflow: hidden');
    this.iframe.setStyle({
      width: width + 'px',
      height: height + 'px'
    });
    this.element.setStyle({
      left: parseInt((document.viewport.getWidth() - this.element.getWidth()) / 2) + 'px',
      top: parseInt((document.viewport.getHeight() - this.element.getHeight()) / 2.5) + 'px'
    });
  },
  
  render: function() {
    this.element.setStyle('padding: 0 8px');
    
    var top = $div({style: 'background: url(/images/background.png); height: 8px'});
    this.element.insert(top);
    
    var outer = $div({style: 'background: url(/images/background.png); margin: 0px -8px; padding: 0px 8px; position: relative'});
    this.element.insert(outer);
    
    var bottom = $div({style: 'background: url(/images/background.png); height: 8px'});
    this.element.insert(bottom);
    
    var topLeft = $img({src: '/images/top_left.png', style: 'position: absolute; left: 0; top: -8px'});
    outer.insert(topLeft);
    
    var topRight = $img({src: '/images/top_right.png', style: 'position: absolute; right: 0; top: -8px'});
    outer.insert(topRight);
    
    var bottomLeft = $img({src: '/images/bottom_left.png', style: 'position: absolute; left: 0; bottom: -8px'});
    outer.insert(bottomLeft);
    
    var bottomRight = $img({src: '/images/bottom_right.png', style: 'position: absolute; right: 0; bottom: -8px'});
    outer.insert(bottomRight);
    
    var inner = $div({style: 'background-color: white'});
    outer.insert(inner);
    
    this.iframe = new Element('iframe', {src: this.url, style: 'border: 0; width: 100%'});
    inner.insert(this.iframe);
  }
  
});