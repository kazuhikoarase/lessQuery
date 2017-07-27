//
// lessQuery
//
// Copyright (c) 2017 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

'use strict';

var lessQuery = function() {

  var debug = location.hash == '#debug';

  var cacheIdKey = '.lessqCacheId';
  var cacheIdSeq = 0;
  var cache = {};

  var getCache = function(elm) {
    var cacheId = elm[cacheIdKey];
    if (typeof cacheId == 'undefined') {
      elm[cacheIdKey] = cacheId = cacheIdSeq++;
      cache[cacheId] = debug? { e : elm } : {};
    }
    return cache[cacheId];
  };

  var hasCache = function(elm) {
    return typeof elm[cacheIdKey] != 'undefined';
  };

  if (debug) {
    var lastKeys = {};
    var showCacheCount = function() {
      var cnt = 0;
      var keys = {};
      for (var k in cache) {
        cnt += 1;
        if (!lastKeys[k]) {
          console.log(cache[k]);
        }
        keys[k] = true;
      }
      lastKeys = keys;
      console.log('cacheCount:' + cnt);
      window.setTimeout(showCacheCount, 5000);
    };
    showCacheCount();
  }

  var removeCache = function(elm) {

    if (typeof elm[cacheIdKey] != 'undefined') {

      // remove all listeners
      var cacheId = elm[cacheIdKey];
      var listenerMap = cache[cacheId].listenerMap;
      for (var type in listenerMap) {
        var listeners = listenerMap[type];
        for (var i = 0; i < listeners.length; i += 1) {
          elm.removeEventListener(type, listeners[i]);
        }
      }

      // delete refs
      delete elm[cacheIdKey];
      delete cache[cacheId];
    }

    while (elm.firstChild) {
      removeCache(elm.firstChild);
      elm.removeChild(elm.firstChild);
    }
  };

  var getData = function(elm) {
    if (!getCache(elm).data) { getCache(elm).data = {}; }
    return getCache(elm).data;
  };

  var getListeners = function(elm, type) {
    if (!getCache(elm).listenerMap) {
      getCache(elm).listenerMap = {}; }
    if (!getCache(elm).listenerMap[type]) {
      getCache(elm).listenerMap[type] = []; }
    return getCache(elm).listenerMap[type];
  };

  // add / remove event listener.
  var addEventListener = function(elm, type, listener, add) {
    var listeners = getListeners(elm, type);
    var newListeners = [];
    for (var i = 0; i < listeners.length; i += 1) {
      if (listeners[i] != listener) {
        newListeners.push(listeners[i]);
      }
    }
    if (add) { newListeners.push(listener); }
    getCache(elm).listenerMap[type] = newListeners;
    return true;
  };

  var CustomEvent = {
    preventDefault : function() { this._pD = true; },
    stopPropagation : function() { this._sP = true; },
    stopImmediatePropagation : function() { this._sIp = true; }
  };

  var trigger = function(elm, type, data) {
    var event = { type : type, target : elm, currentTarget : null,
        _pD : false, _sP : false, _sIp : false, __proto__ : CustomEvent };
    for (var e = elm; e != null; e = e.parentNode) {
      if (!hasCache(e) ) { continue; }
      if (!getCache(e).listenerMap) { continue; }
      if (!getCache(e).listenerMap[type]) { continue; }
      event.currentTarget = e;
      var listeners = getCache(e).listenerMap[type];
      for (var i = 0; i < listeners.length; i += 1) {
        listeners[i].call(e, event, data);
        if (event._sIp) { return; }
      }
      if (event._sP) { return; }
    }
  };

  var data = function(elm, kv) {
    if (arguments.length == 2) {
      if (typeof kv == 'string') return getData(elm)[kv];
      for (var k in kv) { getData(elm)[k] = kv[k]; }
    } else if (arguments.length == 3) {
      getData(elm)[kv] = arguments[2];
    }
    return elm;
  };

  var extend = function(o1, o2) {
    for (var k in o2) { o1[k] = o2[k]; } return o1;
  };

  var each = function(it, callback) {
    if (typeof it.splice == 'function') {
      for (var i = 0; i < it.length; i += 1) { callback(i, it[i]); }
    } else {
      for (var k in it) { callback(k, it[k]); }
    }
  };

  var grep = function(list, accept) {
    var newList = [];
    for (var i = 0; i < list.length; i += 1) {
      var item = list[i];
      if (accept(item) ) {
        newList.push(item);
      }
    }
    return newList;
  };

  var addClass = function(elm, className, add) {
    var classes = (elm.getAttribute('class') || '').split(/\s+/g);
    var newClasses = '';
    for (var i = 0; i < classes.length; i+= 1) {
      if (classes[i] == className) { continue; }
      newClasses += ' ' + classes[i];
    }
    if (add) { newClasses += ' ' + className; }
    elm.setAttribute('class', newClasses);
  };

  var hasClass = function(elm, className) {
    var classes = (elm.getAttribute('class') || '').split(/\s+/g);
    for (var i = 0; i < classes.length; i+= 1) {
      if (classes[i] == className) { return true; }
    }
    return false;
  };

  var matches = function(elm, selector) {
    if (elm.nodeType != 1) {
      return false;
    } else if (!selector) {
      return true;
    }
    var sels = selector.split(/[,\s]+/g);
    for (var i = 0; i < sels.length; i += 1) {
      var sel = sels[i];
      if (sel.substring(0, 1) == '#') {
        throw 'not supported:' + sel;
      } else if (sel.substring(0, 1) == '.') {
        if (hasClass(elm, sel.substring(1) ) ) {
          return true;
        }
      } else {
        if (elm.tagName.toUpperCase() == sel.toUpperCase() ) {
          return true;
        }
      }
    }
    return false;
  };

  var parser = new window.DOMParser();

  var html = function(html) {
    var doc = parser.parseFromString(
        '<div xmlns="http://www.w3.org/1999/xhtml">' + html + '</div>',
        'text/xml').firstChild;
    var elms = [];
    while (doc.firstChild) {
      elms.push(doc.firstChild);
      doc.removeChild(doc.firstChild);
    }
    elms.__proto__ = fn;
    return elms;
  };

  var pxToNum = function(px) {
    if (typeof px != 'string' || px.length <= 2 ||
        px.charAt(px.length - 2) != 'p' ||
        px.charAt(px.length - 1) != 'x') {
      throw 'illegal px:' + px;
    }
    return +px.substring(0, px.length - 2);
  };

  var buildQuery = function(data) {
    var query = '';
    for (var k in data) {
      if (query.length > 0) {
        query += '&';
      }
      query += window.encodeURIComponent(k);
      query += '=';
      query += window.encodeURIComponent(data[k]);
    }
    return query;
  };

  var parseResponse = function() {

    var contentType = this.getResponseHeader('content-type');
    if (contentType != null) {
      contentType = contentType.replace(/\s*;.+$/, '').toLowerCase();
    }

    if (contentType == 'text/xml' ||
          contentType == 'application/xml') {
      return parser.parseFromString(this.responseText, 'text/xml');
    } else if (contentType == 'text/json' ||
        contentType == 'application/json') {
      return JSON.parse(this.responseText);
    } else {
      return this.response;
    }
  };

  var ajax = function(params) {

    params = extend({
      url: '',
      method : 'GET',
      contentType : 'application/x-www-form-urlencoded;charset=UTF-8',
      cache: true,
      processData: true,
      async : true
    }, params);

    if (!params.async) {
      // force async.
      throw 'not supported.';
    }

    var method = params.method.toUpperCase();
    var data = null;
    var contentType = params.contentType;
    if (method == 'POST' || method == 'PUT') {
      data = (typeof params.data == 'object' && params.processData)?
          buildQuery(params.data) : params.data;
    } else {
      contentType = false;
    }

    var xhr = params.xhr? params.xhr() : new window.XMLHttpRequest();
    xhr.open(method, params.url, params.async);
    if (contentType !== false) {
      xhr.setRequestHeader('Content-Type', contentType);
    }
    xhr.onreadystatechange = function() {
      if(xhr.readyState == window.XMLHttpRequest.DONE) {
        try {
          if (xhr.status == 200) {
            done.call(xhr, parseResponse.call(this) );
          } else {
            fail.call(xhr);
          }
        } finally {
          always.call(xhr);
        }
      }
    };

    // call later
    window.setTimeout(function() { xhr.send(data); }, 0);

    // callbacks
    var done = function(data) {};
    var fail = function() {};
    var always = function() {};

    var $ = {
      done : function(callback) { done = callback; return $; },
      fail : function(callback) { fail = callback; return $; },
      always : function(callback) { always = callback; return $; },
      abort : function() { xhr.abort(); return $; }
    };
    return $;
  };

  // 1. for single element
  var fn = {
    attr : function(kv) {
      if (arguments.length == 1) {
        if (typeof kv == 'string') return this.getAttribute(kv);
        for (var k in kv) { this.setAttribute(k, kv[k]); }
      } else if (arguments.length == 2) {
        this.setAttribute(kv, arguments[1]);
      }
      return this;
    },
    prop : function(kv) {
      if (arguments.length == 1) {
        if (typeof kv == 'string') return this[kv];
        for (var k in kv) { this[k] = kv[k]; }
      } else if (arguments.length == 2) {
        this[kv] = arguments[1];
      }
      return this;
    },
    css : function(kv) {
      if (arguments.length == 1) {
        if (typeof kv == 'string') return this.style[kv];
        for (var k in kv) { this.style[k] = kv[k]; }
      } else if (arguments.length == 2) {
        this.style[kv] = arguments[1];
      }
      return this;
    },
    data : function(kv) {
      var args = [ this ];
      for (var i = 0; i < arguments.length; i += 1) {
        args.push(arguments[i]);
      }; 
      return data.apply(null, args);
    },
    val : function() {
      if (arguments.length == 0) {
        return this.value || '';
      } else if (arguments.length == 1) {
        this.value = arguments[0];
      }
      return this;
    },
    on : function(type, listener) {
      var types = type.split(/\s+/g);
      for (var i = 0; i < types.length; i += 1) {
        this.addEventListener(types[i], listener);
        addEventListener(this, types[i], listener, true);
      }
      return this;
    },
    off : function(type, listener) {
      var types = type.split(/\s+/g);
      for (var i = 0; i < types.length; i += 1) {
        this.removeEventListener(types[i], listener);
        addEventListener(this, types[i], listener, false);
      }
      return this;
    },
    trigger : function(type, data) {
      trigger(this, type, data);
      return this;
    },
    offset : function() {
      var off = { left : 0, top : 0 };
      var base = null;
      for (var e = this; e.parentNode != null; e = e.parentNode) {
        if (e.offsetParent != null) {
          base = e;
          break;
        }
      }
      if (base != null) {
        for (var e = base; e.offsetParent != null; e = e.offsetParent) {
          off.left += e.offsetLeft;
          off.top += e.offsetTop;
        }
      }
      for (var e = this; e.parentNode != null &&
            e != document.body; e = e.parentNode) {
        off.left -= e.scrollLeft;
        off.top -= e.scrollTop;
      }
      return off;
    },
    append : function(elms) {
      if (typeof elms == 'string') {
        elms = html(elms);
      }
      for (var i = 0; i < elms.length; i += 1) {
        this.appendChild(elms[i]);
      }
      return this;
    },
    prepend : function(elms) {
      if (typeof elms == 'string') {
        elms = html(elms);
      }
      for (var i = 0; i < elms.length; i += 1) {
        if (this.firstChild) {
          this.insertBefore(elms[i], this.firstChild);
        } else {
          this.appendChild(elms[i]);
        }
      }
      return this;
    },
    insertBefore : function(elms) {
      var elm = elms[0];
      elm.parentNode.insertBefore(this, elm);
      return this;
    },
    insertAfter : function(elms) {
      var elm = elms[0];
      if (elm.nextSibling) {
        elm.parentNode.insertBefore(this, elm.nextSibling);
      } else {
        elm.parentNode.appendChild(this);
      }
      return this;
    },
    remove : function() {
      if (this.parentNode) { this.parentNode.removeChild(this); }
      removeCache(this);
      return this;
    },
    detach : function() {
      if (this.parentNode) { this.parentNode.removeChild(this); }
      return this;
    },
    parent : function() {
      return $(this.parentNode);
    },
    closest : function(selector) {
      for (var e = this; e != null; e = e.parentNode) {
        if (matches(e, selector) ) {
          return $(e);
        }
      }
      return $();
    },
    find : function(selector) {
      var elms = [];
      var childNodes = this.querySelectorAll(selector);
      for (var i = 0; i < childNodes.length; i += 1) {
        elms.push(childNodes.item(i) );
      }
      elms.__proto__ = fn;
      return elms;
    },
    children : function(selector) {
      var elms = [];
      var childNodes = this.childNodes;
      for (var i = 0; i < childNodes.length; i += 1) {
        if (matches(childNodes.item(i), selector) ) {
          elms.push(childNodes.item(i) );
        }
      }
      elms.__proto__ = fn;
      return elms;
    },
    index : function(selector) {
      return Array.prototype.indexOf.call(
          $(this).parent().children(selector), this);
    },
    clone : function() { return $(this.cloneNode(true) ); },
    focus : function() { this.focus(); return this; },
    select : function() { this.select(); return this; },
    submit : function() { this.submit(); return this; },
    scrollLeft : function() {
      if (arguments.length == 0) return this.scrollLeft;
      this.scrollLeft = arguments[0]; return this;
    },
    scrollTop : function() {
      if (arguments.length == 0) return this.scrollTop;
      this.scrollTop = arguments[0]; return this;
    },
    html : function() {
      if (arguments.length == 0) return this.innerHTML;
      this.innerHTML = arguments[0]; return this;
    },
    text : function() {
      if (typeof this.textContent != 'undefined') {
        if (arguments.length == 0) return this.textContent;
        this.textContent = arguments[0]; return this;
      } else {
        if (arguments.length == 0) return this.innerText;
        this.innerText = arguments[0]; return this;
      }
    },
    outerWidth : function(margin) {
      var w = this.offsetWidth;
      if (margin) {
        var cs = window.getComputedStyle(this, null);
        return w + pxToNum(cs.marginLeft) + pxToNum(cs.marginRight);
      }
      return w;
    },
    innerWidth : function() {
      var cs = window.getComputedStyle(this, null);
      return this.offsetWidth -
        pxToNum(cs.borderLeftWidth) - pxToNum(cs.borderRightWidth);
    },
    width : function() {
      if (this == window) return this.innerWidth;
      var cs = window.getComputedStyle(this, null);
      return this.offsetWidth -
        pxToNum(cs.borderLeftWidth) - pxToNum(cs.borderRightWidth) -
        pxToNum(cs.paddingLeft) - pxToNum(cs.paddingRight);
    },
    outerHeight : function(margin) {
      var h = this.offsetHeight;
      if (margin) {
        var cs = window.getComputedStyle(this, null);
        return h + pxToNum(cs.marginTop) + pxToNum(cs.marginBottom);
      }
      return h;
    },
    innerHeight : function() {
      var cs = window.getComputedStyle(this, null);
      return this.offsetHeight -
        pxToNum(cs.borderTopWidth) - pxToNum(cs.borderBottomWidth);
    },
    height : function() {
      if (this == window) return this.innerHeight;
      var cs = window.getComputedStyle(this, null);
      return this.offsetHeight -
        pxToNum(cs.borderTopWidth) - pxToNum(cs.borderBottomWidth) -
        pxToNum(cs.paddingTop) - pxToNum(cs.paddingBottom);
    },
    addClass : function(className) {
      addClass(this, className, true); return this;
    },
    removeClass : function(className) {
      addClass(this, className, false); return this;
    },
    hasClass : function(className) {
      return hasClass(this, className);
    }
  };

  // 2. to array
  each(fn, function(name, func) {
    fn[name] = function() {
      var newRet = null;
      for (var i = 0; i < this.length; i += 1) {
        var elm = this[i];
        var ret = func.apply(elm, arguments);
        if (elm !== ret) {
          if (ret != null && ret.__proto__ == fn) {
            if (newRet == null) { newRet = []; }
            newRet = newRet.concat(ret);
          } else {
            return ret;
          }
        }
      }
      if (newRet != null) {
        newRet.__proto__ = fn;
        return newRet;
      }
      return this;
    };
  });

  // 3. for array
  fn = extend(fn, {
    each : function(callback) {
      for (var i = 0; i < this.length; i += 1) {
        callback.call(this[i], i);
      }
      return this;
    },
    first : function() {
      return $(this.length > 0? this[0] : null);
    },
    last : function() {
      return $(this.length > 0? this[this.length - 1] : null);
    }
  });

  var $ = function(target) {

    if (typeof target == 'function') {

      // ready
      return $(document).on('DOMContentLoaded', target);

    } else if (typeof target == 'string') {

      if (target.charAt(0) == '<') {

        // dom creation
        return html(target);

      } else {

        // query
        var childNodes = document.querySelectorAll(target);
        var elms = [];
        for (var i = 0; i < childNodes.length; i += 1) {
          elms.push(childNodes.item(i) );
        }
        elms.__proto__ = fn;
        return elms;
      }

    } else if (typeof target == 'object' && target != null) {

      if (target.__proto__ == fn) {
        return target;
      } else {
        var elms = [];
        elms.push(target);
        elms.__proto__ = fn;
        return elms;
      }

    } else {

      var elms = [];
      elms.__proto__ = fn;
      return elms;
    }
  };

  return extend($, {
    fn : fn, extend : extend, each : each, grep : grep,
    data : data, ajax : ajax });
}();
