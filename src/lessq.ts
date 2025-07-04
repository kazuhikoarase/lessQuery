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

const debug = location.hash == '#debug';

const cacheIdKey = '.lessqCacheId';
let cacheIdSeq = 0;
const cache : any = {};

const getCache = function(elm : any) {
  let cacheId = elm[cacheIdKey];
  if (typeof cacheId == 'undefined') {
    elm[cacheIdKey] = cacheId = cacheIdSeq++;
    cache[cacheId] = debug? { e : elm } : {};
  }
  return cache[cacheId];
};

const hasCache = function(elm : any) {
  return typeof elm[cacheIdKey] != 'undefined';
};

if (debug) {
  let lastKeys : any = {};
  const showCacheCount = function() {
    let cnt = 0;
    let keys : any = {};
    for (let k in cache) {
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

const removeCache = function(elm : any) {

  if (typeof elm[cacheIdKey] != 'undefined') {

    // remove all listeners
    const cacheId = elm[cacheIdKey];
    const listenerMap = cache[cacheId].listenerMap;
    for (let type in listenerMap) {
      const listeners = listenerMap[type];
      for (let i = 0; i < listeners.length; i += 1) {
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

const getData = function(elm : any) {
  if (!getCache(elm).data) { getCache(elm).data = {}; }
  return getCache(elm).data;
};

const getListeners = function(elm : any, type : string) {
  if (!getCache(elm).listenerMap) {
    getCache(elm).listenerMap = {}; }
  if (!getCache(elm).listenerMap[type]) {
    getCache(elm).listenerMap[type] = []; }
  return getCache(elm).listenerMap[type];
};

// add / remove event listener.
const addEventListener = function(elm : any, type : string, listener : () => void, add : boolean) {
  const listeners = getListeners(elm, type);
  const newListeners = [];
  for (let i = 0; i < listeners.length; i += 1) {
    if (listeners[i] != listener) {
      newListeners.push(listeners[i]);
    }
  }
  if (add) { newListeners.push(listener); }
  getCache(elm).listenerMap[type] = newListeners;
  return true;
};

const CustomEvent : any = {
  preventDefault : function() { this._pD = true; },
  stopPropagation : function() { this._sP = true; },
  stopImmediatePropagation : function() { this._sIp = true; }
};

const trigger = function(elm : any, type : string, data : any) {
  const event = { type : type, target : elm, currentTarget : null,
      _pD : false, _sP : false, _sIp : false, __proto__ : CustomEvent };
  for (let e = elm; e != null; e = e.parentNode) {
    if (!hasCache(e) ) { continue; }
    if (!getCache(e).listenerMap) { continue; }
    if (!getCache(e).listenerMap[type]) { continue; }
    event.currentTarget = e;
    const listeners = getCache(e).listenerMap[type];
    for (let i = 0; i < listeners.length; i += 1) {
      listeners[i].call(e, event, data);
      if (event._sIp) { return; }
    }
    if (event._sP) { return; }
  }
};

const data = function(elm : any, kv : any) {
  if (arguments.length == 2) {
    if (typeof kv == 'string') return getData(elm)[kv];
    for (let k in kv) { getData(elm)[k] = kv[k]; }
  } else if (arguments.length == 3) {
    getData(elm)[kv] = arguments[2];
  }
  return elm;
};

//type Extend<S, T extends S> = (o1 : S, o2: T) => T;

const extend = function<S,T, U extends S & T>(o1 : S, o2 : T) : U {
  const _o1 : any = o1;
  for (let k in o2) { _o1[k] = o2[k]; } return _o1;
};

const each = function(it : any, callback : (i : number | string, o : any) => void) {
  if (typeof it.splice == 'function') {
    for (let i = 0; i < it.length; i += 1) { callback(i, it[i]); }
  } else {
    for (let k in it) { callback(k, it[k]); }
  }
};

const grep = function(list : any[], accept : (o : any) => boolean) {
  const newList = [];
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (accept(item) ) {
      newList.push(item);
    }
  }
  return newList;
};

const addClass = function(elm : any, className : string, add? : boolean) {
  const classes = (elm.getAttribute('class') || '').split(/\s+/g);
  let newClasses = '';
  for (let i = 0; i < classes.length; i+= 1) {
    if (classes[i] == className) { continue; }
    newClasses += ' ' + classes[i];
  }
  if (add) { newClasses += ' ' + className; }
  elm.setAttribute('class', newClasses);
};

const hasClass = function(elm : any, className : string) {
  const classes = (elm.getAttribute('class') || '').split(/\s+/g);
  for (let i = 0; i < classes.length; i+= 1) {
    if (classes[i] == className) { return true; }
  }
  return false;
};

const matches = function(elm : any, selector : string) {
  if (elm.nodeType != 1) {
    return false;
  } else if (!selector) {
    return true;
  }
  const sels = selector.split(/[,\s]+/g);
  for (let i = 0; i < sels.length; i += 1) {
    const sel = sels[i];
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

const parser = new window.DOMParser();

const html = function(html : string) {
  const doc : any = parser.parseFromString(
      '<div xmlns="http://www.w3.org/1999/xhtml">' + html + '</div>',
      'text/xml').firstChild;
  const elms : any = [];
  while (doc.firstChild) {
    elms.push(doc.firstChild);
    doc.removeChild(doc.firstChild);
  }
  elms.__proto__ = fn;
  return elms;
};

const pxToNum = function(px : any) {
  if (typeof px != 'string' || px.length <= 2 ||
      px.charAt(px.length - 2) != 'p' ||
      px.charAt(px.length - 1) != 'x') {
    throw 'illegal px:' + px;
  }
  return +px.substring(0, px.length - 2);
};

const buildQuery = function(data : any) {
  let query = '';
  for (let k in data) {
    if (query.length > 0) {
      query += '&';
    }
    query += window.encodeURIComponent(k);
    query += '=';
    query += window.encodeURIComponent(data[k]);
  }
  return query;
};

const parseResponse = function(this : any) {

    let contentType = this.getResponseHeader('content-type');
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

const ajax = function(params : any) {

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

  const method = params.method.toUpperCase();
  let data = null;
  let contentType = params.contentType;
  if (method == 'POST' || method == 'PUT') {
    data = (typeof params.data == 'object' && params.processData)?
        buildQuery(params.data) : params.data;
  } else {
    contentType = false;
  }

  const xhr = params.xhr? params.xhr() : new window.XMLHttpRequest();
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
  let done = function(_data : any) {};
  let fail = function() {};
  let always = function() {};

  const $ = {
    done : function(callback : any) { done = callback; return $; },
    fail : function(callback : any) { fail = callback; return $; },
    always : function(callback : any) { always = callback; return $; },
    abort : function() { xhr.abort(); return $; }
  };
  return $;
};

// 1. for single element
let fn = {
  attr : function(this : any, kv : any) {
    if (arguments.length == 1) {
      if (typeof kv == 'string') return this.getAttribute(kv);
      for (let k in kv) { this.setAttribute(k, kv[k]); }
    } else if (arguments.length == 2) {
      this.setAttribute(kv, arguments[1]);
    }
    return this;
  },
  prop : function(this : any, kv : any) {
    if (arguments.length == 1) {
      if (typeof kv == 'string') return this[kv];
      for (let k in kv) { this[k] = kv[k]; }
    } else if (arguments.length == 2) {
      this[kv] = arguments[1];
    }
    return this;
  },
  css : function(this : any, kv : any) {
    if (arguments.length == 1) {
      if (typeof kv == 'string') return this.style[kv];
      for (let k in kv) { this.style[k] = kv[k]; }
    } else if (arguments.length == 2) {
      this.style[kv] = arguments[1];
    }
    return this;
  },
  data : function(this : any, _kv : any) {
    const args : any = [ this ];
    for (let i = 0; i < arguments.length; i += 1) {
      args.push(arguments[i]);
    }; 
    return data.apply(null, args);
  },
  val : function(this : any) {
    if (arguments.length == 0) {
      return this.value || '';
    } else if (arguments.length == 1) {
      this.value = arguments[0];
    }
    return this;
  },
  on : function(this : any, type : string, listener : any) {
    const types = type.split(/\s+/g);
    for (let i = 0; i < types.length; i += 1) {
      this.addEventListener(types[i], listener);
      addEventListener(this, types[i], listener, true);
    }
    return this;
  },
  off : function(this : any, type : string, listener : any) {
    const types = type.split(/\s+/g);
    for (let i = 0; i < types.length; i += 1) {
      this.removeEventListener(types[i], listener);
      addEventListener(this, types[i], listener, false);
    }
    return this;
  },
  trigger : function(type : string, data : any) {
    trigger(this, type, data);
    return this;
  },
  offset : function(this : any) {
    const off = { left : 0, top : 0 };
    let base = null;
    for (let e = this; e.parentNode != null; e = e.parentNode) {
      if (e.offsetParent != null) {
        base = e;
        break;
      }
    }
    if (base != null) {
      for (let e = base; e.offsetParent != null; e = e.offsetParent) {
        off.left += e.offsetLeft;
        off.top += e.offsetTop;
      }
    }
    for (let e = this; e.parentNode != null &&
          e != document.body; e = e.parentNode) {
      off.left -= e.scrollLeft;
      off.top -= e.scrollTop;
    }
    return off;
  },
  append : function(this : HTMLElement, elms : any) {
    if (typeof elms == 'string') {
      elms = html(elms);
    }
    for (let i = 0; i < elms.length; i += 1) {
      this.appendChild(elms[i]);
    }
    return this;
  },
  prepend : function(this : HTMLElement, elms : NodeList) {
    if (typeof elms == 'string') {
      elms = html(elms);
    }
    for (let i = 0; i < elms.length; i += 1) {
      if (this.firstChild) {
        this.insertBefore(elms[i], this.firstChild);
      } else {
        this.appendChild(elms[i]);
      }
    }
    return this;
  },
  insertBefore : function(this : HTMLElement, elms : NodeList) {
    const elm = elms[0];
    elm.parentNode!.insertBefore(this, elm);
    return this;
  },
  insertAfter : function(this : HTMLElement, elms : NodeList) {
    const elm = elms[0];
    if (elm.nextSibling) {
      elm.parentNode!.insertBefore(this, elm.nextSibling);
    } else {
      elm.parentNode!.appendChild(this);
    }
    return this;
  },
  remove : function(this : HTMLElement) {
    if (this.parentNode) { this.parentNode.removeChild(this); }
    removeCache(this);
    return this;
  },
  detach : function(this : HTMLElement) {
    if (this.parentNode) { this.parentNode.removeChild(this); }
    return this;
  },
  parent : function(this : HTMLElement) {
    return $(this.parentNode);
  },
  closest : function(this : HTMLElement, selector : string) {
    for (let e : Node = this; e != null; e = e.parentNode!) {
      if (matches(e, selector) ) {
        return $(e);
      }
    }
    return $();
  },
  find : function(this : HTMLElement, selector : string) {
    const elms : any = [];
    const childNodes = this.querySelectorAll(selector);
    for (let i = 0; i < childNodes.length; i += 1) {
      elms.push(childNodes.item(i) );
    }
    elms.__proto__ = fn;
    return elms;
  },
  children : function(this : HTMLElement, selector : string) {
    const elms : any = [];
    const childNodes = this.childNodes;
    for (let i = 0; i < childNodes.length; i += 1) {
      if (matches(childNodes.item(i), selector) ) {
        elms.push(childNodes.item(i) );
      }
    }
    elms.__proto__ = fn;
    return elms;
  },
  index : function(selector : string) {
    return Array.prototype.indexOf.call(
        $(this).parent().children(selector), this);
  },
  clone : function(this : HTMLElement) { return $(this.cloneNode(true) ); },
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
  html : function(this : HTMLElement) {
    if (arguments.length == 0) return this.innerHTML;
    this.innerHTML = arguments[0]; return this;
  },
  text : function(this : HTMLElement) {
    if (typeof this.textContent != 'undefined') {
      if (arguments.length == 0) return this.textContent;
      this.textContent = arguments[0]; return this;
    } else {
      if (arguments.length == 0) return this.innerText;
      this.innerText = arguments[0]; return this;
    }
  },
  outerWidth : function(this : HTMLElement, margin? : boolean) {
    const w = this.offsetWidth;
    if (margin) {
      const cs = window.getComputedStyle(this, null);
      return w + pxToNum(cs.marginLeft) + pxToNum(cs.marginRight);
    }
    return w;
  },
  innerWidth : function(this : HTMLElement) {
    const cs = window.getComputedStyle(this, null);
    return this.offsetWidth -
      pxToNum(cs.borderLeftWidth) - pxToNum(cs.borderRightWidth);
  },
  width : function(this : HTMLElement | Window) {
    if (this == window) {
      return this.innerWidth;
    } else if (this instanceof HTMLElement) {
      const cs = window.getComputedStyle(this, null);
      return this.offsetWidth -
        pxToNum(cs.borderLeftWidth) - pxToNum(cs.borderRightWidth) -
        pxToNum(cs.paddingLeft) - pxToNum(cs.paddingRight);
    } else {
      throw this;
    }
  },
  outerHeight : function(this : HTMLElement, margin? : boolean) {
    const h = this.offsetHeight;
    if (margin) {
      const cs = window.getComputedStyle(this, null);
      return h + pxToNum(cs.marginTop) + pxToNum(cs.marginBottom);
    }
    return h;
  },
  innerHeight : function(this : HTMLElement) {
    const cs = window.getComputedStyle(this, null);
    return this.offsetHeight -
      pxToNum(cs.borderTopWidth) - pxToNum(cs.borderBottomWidth);
  },
  height : function(this : HTMLElement | Window) {
    if (this == window) {
      return this.innerHeight;
    } else if (this instanceof HTMLElement) {
      const cs = window.getComputedStyle(this, null);
      return this.offsetHeight -
        pxToNum(cs.borderTopWidth) - pxToNum(cs.borderBottomWidth) -
        pxToNum(cs.paddingTop) - pxToNum(cs.paddingBottom);
    } else {
      throw this;
    }
  },
  addClass : function(className : string) {
    addClass(this, className, true); return this;
  },
  removeClass : function(className : string) {
    addClass(this, className, false); return this;
  },
  hasClass : function(className : string) {
    return hasClass(this, className);
  }
};

// 2. to array
each(fn, function(name, func) {
  const _fn : any = fn;
  _fn[name] = function() {
    let newRet : any = null;
    for (let i = 0; i < this.length; i += 1) {
      const elm = this[i];
      const ret = func.apply(elm, arguments);
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
  each : function(this : any[], callback : (i : number) => void) {
    for (let i = 0; i < this.length; i += 1) {
      callback.call(this[i], i);
    }
    return this;
  },
  first : function(this : any[]) {
    return $(this.length > 0? this[0] : null);
  },
  last : function(this : any[]) {
    return $(this.length > 0? this[this.length - 1] : null);
  }
});

const $ = function(target? : any) : any {

  if (typeof target == 'function') {

    // ready
    return $(document).on('DOMContentLoaded', target);

  } else if (typeof target == 'string') {

    if (target.charAt(0) == '<') {

      // dom creation
      return html(target);

    } else {

      // query
      const childNodes = document.querySelectorAll(target);
      const elms : any = [];
      for (let i = 0; i < childNodes.length; i += 1) {
        elms.push(childNodes.item(i) );
      }
      elms.__proto__ = fn;
      return elms;
    }

  } else if (typeof target == 'object' && target != null) {

    if (target.__proto__ == fn) {
      return target;
    } else {
      const elms : any = [];
      elms.push(target);
      elms.__proto__ = fn;
      return elms;
    }

  } else {

    const elms : any = [];
    elms.__proto__ = fn;
    return elms;
  }
};

const lessQuery = extend($, {
  fn : fn, extend : extend, each : each, grep : grep, data : data, ajax : ajax
});

export default lessQuery;
