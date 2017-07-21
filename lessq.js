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
    preventDefault : function() {},
    stopPropagation : function() {},
    stopImmediatePropagation : function() {}
  };

  var trigger = function(elm, type, data) {
    var event = { type : type, target : elm, __proto__ : CustomEvent };
    for (;elm != null; elm = elm.parentNode) {
      if (!hasCache(elm) ) { continue; }
      if (!getCache(elm).listenerMap) { continue; }
      if (!getCache(elm).listenerMap[type]) { continue; }
      var listeners = getCache(elm).listenerMap[type];
      for (var i = 0; i < listeners.length; i += 1) {
        listeners[i].call(elm, event, data);
      }
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
    if (!selector) { return true; }
    var sels = selector.split(/[,\s]+/g);
    for (var i = 0; i < sels.length; i += 1) {
      var sel = sels[i];
      if (sel.substring(0, 1) == '#') {
        throw 'not supported:' + sel;
      } else if (sel.substring(0, 1) == '.') {
        if (elm.nodeType == 1 && hasClass(elm, sel.substring(1) ) ) {
          return true;
        }
      } else {
        if (elm.nodeType == 1 &&
            elm.tagName.toUpperCase() == sel.toUpperCase() ) {
          return true;
        }
      }
    }
    return false;
  };

  // per element functions.
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
      this.addEventListener(type, listener);
      addEventListener(this, type, listener, true);
      return this;
    },
    off : function(type, listener) {
      this.removeEventListener(type, listener);
      addEventListener(this, type, listener, false);
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
      for (var i = 0; i < elms.length; i += 1) {
        this.appendChild(elms[i]);
      }
      return this;
    },
    prepend : function(elms) {
      for (var i = 0; i < elms.length; i += 1) {
        if (this.firstChild) {
          this.insertBefore(elms[i], this.firstChild);
        } else {
          this.appendChild(elms[i]);
        }
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
    focus : function() { this.focus(); return this; },
    select : function() { this.select(); return this; },
    parent : function() {
      return lessQuery(this.parentNode);
    },
    closest : function(selector) {
      for (var e = this; e != null; e = e.parentNode) {
        if (matches(e, selector) ) {
          return lessQuery(e);
        }
      }
      return lessQuery();
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
    width : function() { return this.offsetWidth || this.innerWidth; },
    height : function() { return this.offsetHeight || this.innerHeight; },
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

  // to array
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

  fn.each = function(callback) {
    for (var i = 0; i < this.length; i += 1) {
      callback.call(this[i], i);
    }
    return this;
  };

  var parser = new window.DOMParser();

  var lessQuery = function(target) {

    if (typeof target == 'function') {
      // ready
      return lessQuery(document).on('DOMContentLoaded', target);
    }

    var elms = [];

    if (!target) {

      // empty

    } else if (typeof target == 'string') {

      if (target.charAt(0) == '<') {
        var doc = parser.parseFromString(
            '<div xmlns="http://www.w3.org/1999/xhtml">' + target + '</div>',
            'text/xml').firstChild;
        while (doc.firstChild) {
          elms.push(doc.firstChild);
          doc.removeChild(doc.firstChild);
        }

      } else {
        var childNodes = document.querySelectorAll(target);
        for (var i = 0; i < childNodes.length; i += 1) {
          elms.push(childNodes.item(i) );
        }
      }

    } else if (typeof target == 'object') {
      elms.push(target);
    }

    elms.__proto__ = fn;
    return elms;
  };

  return extend(lessQuery, {
    extend : extend, each : each, grep : grep, data : data, fn : fn });
}();
