const x = location.hash == "#debug", a = ".lessqCacheId";
let A = 0;
const d = {}, l = function(t) {
  let e = t[a];
  return typeof e > "u" && (t[a] = e = A++, d[e] = x ? { e: t } : {}), d[e];
}, R = function(t) {
  return typeof t[a] < "u";
};
if (x) {
  let t = {};
  const e = function() {
    let n = 0;
    const i = {};
    for (let s in d)
      n += 1, t[s] || console.log(d[s]), i[s] = !0;
    t = i, console.log("cacheCount:" + n), window.setTimeout(e, 5e3);
  };
  e();
}
const L = function(t) {
  if (typeof t[a] < "u") {
    const e = t[a], n = d[e].listenerMap;
    for (let i in n) {
      const s = n[i];
      for (let r = 0; r < s.length; r += 1)
        t.removeEventListener(i, s[r]);
    }
    delete t[a], delete d[e];
  }
  for (; t.firstChild; )
    L(t.firstChild), t.removeChild(t.firstChild);
}, w = function(t) {
  return l(t).data || (l(t).data = {}), l(t).data;
}, H = function(t, e) {
  return l(t).listenerMap || (l(t).listenerMap = {}), l(t).listenerMap[e] || (l(t).listenerMap[e] = []), l(t).listenerMap[e];
}, C = function(t, e, n, i) {
  const s = H(t, e), r = [];
  for (let f = 0; f < s.length; f += 1)
    s[f] != n && r.push(s[f]);
  return i && r.push(n), l(t).listenerMap[e] = r, !0;
}, I = {
  preventDefault: function() {
    this._pD = !0;
  },
  stopPropagation: function() {
    this._sP = !0;
  },
  stopImmediatePropagation: function() {
    this._sIp = !0;
  }
}, P = function(t, e, n) {
  const i = {
    type: e,
    target: t,
    currentTarget: null,
    _pD: !1,
    _sP: !1,
    _sIp: !1,
    __proto__: I
  };
  for (let s = t; s != null; s = s.parentNode) {
    if (!R(s) || !l(s).listenerMap || !l(s).listenerMap[e])
      continue;
    i.currentTarget = s;
    const r = l(s).listenerMap[e];
    for (let f = 0; f < r.length; f += 1)
      if (r[f].call(s, i, n), i._sIp)
        return;
    if (i._sP)
      return;
  }
}, N = function(t, e, n) {
  if (n === void 0) {
    if (typeof e == "string") return w(t)[e];
    for (let i in e)
      w(t)[i] = e[i];
  } else
    w(t)[e] = n;
  return t;
}, g = function(t, e) {
  for (let n in e)
    t[n] = e[n];
  return t;
}, M = function(t, e) {
  if (typeof t.splice == "function")
    for (let n = 0; n < t.length; n += 1)
      e(n, t[n]);
  else
    for (let n in t)
      e(n, t[n]);
}, D = function(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i += 1) {
    const s = t[i];
    e(s) && n.push(s);
  }
  return n;
}, m = function(t, e, n) {
  const i = (t.getAttribute("class") || "").split(/\s+/g);
  let s = "";
  for (let r = 0; r < i.length; r += 1)
    i[r] != e && (s += " " + i[r]);
  n && (s += " " + e), t.setAttribute("class", s);
}, S = function(t, e) {
  const n = (t.getAttribute("class") || "").split(/\s+/g);
  for (let i = 0; i < n.length; i += 1)
    if (n[i] == e)
      return !0;
  return !1;
}, b = function(t, e) {
  if (t.nodeType != 1)
    return !1;
  if (!e)
    return !0;
  const n = e.split(/[,\s]+/g);
  for (let i = 0; i < n.length; i += 1) {
    const s = n[i];
    if (s.substring(0, 1) == "#")
      throw "not supported:" + s;
    if (s.substring(0, 1) == ".") {
      if (S(t, s.substring(1)))
        return !0;
    } else if (t.tagName.toUpperCase() == s.toUpperCase())
      return !0;
  }
  return !1;
}, W = new window.DOMParser(), y = function(t) {
  const e = W.parseFromString(
    '<div xmlns="http://www.w3.org/1999/xhtml">' + t + "</div>",
    "text/xml"
  ).firstChild, n = [];
  for (; e.firstChild; )
    n.push(e.firstChild), e.removeChild(e.firstChild);
  return n.__proto__ = u, n;
}, o = function(t) {
  if (typeof t != "string" || t.length <= 2 || t.charAt(t.length - 2) != "p" || t.charAt(t.length - 1) != "x")
    throw "illegal px:" + t;
  return +t.substring(0, t.length - 2);
}, q = function(t) {
  let e = "";
  for (let n in t)
    e.length > 0 && (e += "&"), e += window.encodeURIComponent(n), e += "=", e += window.encodeURIComponent(t[n]);
  return e;
}, B = function() {
  let t = this.getResponseHeader("content-type");
  return t != null && (t = t.replace(/\s*;.+$/, "").toLowerCase()), t == "text/xml" || t == "application/xml" ? W.parseFromString(this.responseText, "text/xml") : t == "text/json" || t == "application/json" ? JSON.parse(this.responseText) : this.response;
}, E = function(t) {
  if (t = g({
    url: "",
    method: "GET",
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    cache: !0,
    processData: !0,
    async: !0
  }, t), !t.async)
    throw "not supported.";
  const e = t.method.toUpperCase();
  let n = null, i = t.contentType;
  e == "POST" || e == "PUT" ? n = typeof t.data == "object" && t.processData ? q(t.data) : t.data : i = !1;
  const s = t.xhr ? t.xhr() : new window.XMLHttpRequest();
  s.open(e, t.url, t.async), typeof i == "string" && s.setRequestHeader("Content-Type", i), s.onreadystatechange = function() {
    if (s.readyState == window.XMLHttpRequest.DONE)
      try {
        s.status == 200 ? r.call(s, B.call(this)) : f.call(s);
      } finally {
        _.call(s);
      }
  }, window.setTimeout(function() {
    s.send(n);
  }, 0);
  let r = function(c) {
  }, f = function() {
  }, _ = function() {
  };
  const p = {
    done: function(c) {
      return r = c, p;
    },
    fail: function(c) {
      return f = c, p;
    },
    always: function(c) {
      return _ = c, p;
    },
    abort: function() {
      return s.abort(), p;
    }
  };
  return p;
};
let u = {
  attr: function(t) {
    if (arguments.length == 1) {
      if (typeof t == "string") return this.getAttribute(t);
      for (let e in t)
        this.setAttribute(e, t[e]);
    } else arguments.length == 2 && this.setAttribute(t, arguments[1]);
    return this;
  },
  prop: function(t) {
    if (arguments.length == 1) {
      if (typeof t == "string") return this[t];
      for (let e in t)
        this[e] = t[e];
    } else arguments.length == 2 && (this[t] = arguments[1]);
    return this;
  },
  css: function(t) {
    if (arguments.length == 1) {
      if (typeof t == "string") return this.style[t];
      for (let e in t)
        this.style[e] = t[e];
    } else arguments.length == 2 && (this.style[t] = arguments[1]);
    return this;
  },
  data: function() {
    const t = [this];
    for (let e = 0; e < arguments.length; e += 1)
      t.push(arguments[e]);
    return N.apply(null, t);
  },
  val: function() {
    return arguments.length == 0 ? this.value || "" : (arguments.length == 1 && (this.value = arguments[0]), this);
  },
  on: function(t, e) {
    const n = t.split(/\s+/g);
    for (let i = 0; i < n.length; i += 1)
      this.addEventListener(n[i], e), C(this, n[i], e, !0);
    return this;
  },
  off: function(t, e) {
    const n = t.split(/\s+/g);
    for (let i = 0; i < n.length; i += 1)
      this.removeEventListener(n[i], e), C(this, n[i], e, !1);
    return this;
  },
  trigger: function(t, e) {
    return P(this, t, e), this;
  },
  offset: function() {
    const t = { left: 0, top: 0 };
    let e = null;
    for (let n = this; n.parentNode != null; n = n.parentNode)
      if (n.offsetParent != null) {
        e = n;
        break;
      }
    if (e != null)
      for (let n = e; n.offsetParent != null; n = n.offsetParent)
        t.left += n.offsetLeft, t.top += n.offsetTop;
    for (let n = this; n.parentNode != null && n != document.body; n = n.parentNode)
      t.left -= n.scrollLeft, t.top -= n.scrollTop;
    return t;
  },
  append: function(t) {
    typeof t == "string" && (t = y(t));
    for (let e = 0; e < t.length; e += 1)
      this.appendChild(t[e]);
    return this;
  },
  prepend: function(t) {
    typeof t == "string" && (t = y(t));
    for (let e = 0; e < t.length; e += 1)
      this.firstChild ? this.insertBefore(t[e], this.firstChild) : this.appendChild(t[e]);
    return this;
  },
  insertBefore: function(t) {
    const e = t[0];
    return e.parentNode.insertBefore(this, e), this;
  },
  insertAfter: function(t) {
    const e = t[0];
    return e.nextSibling ? e.parentNode.insertBefore(this, e.nextSibling) : e.parentNode.appendChild(this), this;
  },
  remove: function() {
    return this.parentNode && this.parentNode.removeChild(this), L(this), this;
  },
  detach: function() {
    return this.parentNode && this.parentNode.removeChild(this), this;
  },
  parent: function() {
    return h(this.parentNode);
  },
  closest: function(t) {
    for (let e = this; e != null; e = e.parentNode)
      if (b(e, t))
        return h(e);
    return h();
  },
  find: function(t) {
    const e = [], n = this.querySelectorAll(t);
    for (let i = 0; i < n.length; i += 1)
      e.push(n.item(i));
    return e.__proto__ = u, e;
  },
  children: function(t) {
    const e = [], n = this.childNodes;
    for (let i = 0; i < n.length; i += 1)
      b(n.item(i), t) && e.push(n.item(i));
    return e.__proto__ = u, e;
  },
  index: function(t) {
    return Array.prototype.indexOf.call(
      h(this).parent().children(t),
      this
    );
  },
  clone: function() {
    return h(this.cloneNode(!0));
  },
  focus: function() {
    return this.focus(), this;
  },
  select: function() {
    return this.select(), this;
  },
  submit: function() {
    return this.submit(), this;
  },
  scrollLeft: function() {
    return arguments.length == 0 ? this.scrollLeft : (this.scrollLeft = arguments[0], this);
  },
  scrollTop: function() {
    return arguments.length == 0 ? this.scrollTop : (this.scrollTop = arguments[0], this);
  },
  html: function() {
    return arguments.length == 0 ? this.innerHTML : (this.innerHTML = arguments[0], this);
  },
  text: function() {
    return typeof this.textContent < "u" ? arguments.length == 0 ? this.textContent : (this.textContent = arguments[0], this) : arguments.length == 0 ? this.innerText : (this.innerText = arguments[0], this);
  },
  outerWidth: function(t) {
    const e = this.offsetWidth;
    if (t) {
      const n = window.getComputedStyle(this, null);
      return e + o(n.marginLeft) + o(n.marginRight);
    }
    return e;
  },
  innerWidth: function() {
    const t = window.getComputedStyle(this, null);
    return this.offsetWidth - o(t.borderLeftWidth) - o(t.borderRightWidth);
  },
  width: function() {
    if (this == window) return this.innerWidth;
    const t = window.getComputedStyle(this, null);
    return this.offsetWidth - o(t.borderLeftWidth) - o(t.borderRightWidth) - o(t.paddingLeft) - o(t.paddingRight);
  },
  outerHeight: function(t) {
    const e = this.offsetHeight;
    if (t) {
      const n = window.getComputedStyle(this, null);
      return e + o(n.marginTop) + o(n.marginBottom);
    }
    return e;
  },
  innerHeight: function() {
    const t = window.getComputedStyle(this, null);
    return this.offsetHeight - o(t.borderTopWidth) - o(t.borderBottomWidth);
  },
  height: function() {
    if (this == window) return this.innerHeight;
    const t = window.getComputedStyle(this, null);
    return this.offsetHeight - o(t.borderTopWidth) - o(t.borderBottomWidth) - o(t.paddingTop) - o(t.paddingBottom);
  },
  addClass: function(t) {
    return m(this, t, !0), this;
  },
  removeClass: function(t) {
    return m(this, t, !1), this;
  },
  hasClass: function(t) {
    return S(this, t);
  }
};
const T = u;
M(T, function(t, e) {
  T[t] = function() {
    let n = null;
    for (let i = 0; i < this.length; i += 1) {
      const s = this[i], r = e.apply(s, arguments);
      if (s !== r)
        if (r != null && r.__proto__ == u)
          n == null && (n = []), n = n.concat(r);
        else
          return r;
    }
    return n != null ? (n.__proto__ = u, n) : this;
  };
});
u = g(u, {
  each: function(t) {
    for (let e = 0; e < this.length; e += 1)
      t.call(this[e], e);
    return this;
  },
  first: function() {
    return h(this.length > 0 ? this[0] : null);
  },
  last: function() {
    return h(this.length > 0 ? this[this.length - 1] : null);
  }
});
const h = function(t) {
  if (typeof t == "function")
    return h(document).on("DOMContentLoaded", t);
  if (typeof t == "string") {
    if (t.charAt(0) == "<")
      return y(t);
    {
      const e = document.querySelectorAll(t), n = [];
      for (let i = 0; i < e.length; i += 1)
        n.push(e.item(i));
      return n.__proto__ = u, n;
    }
  } else if (typeof t == "object" && t != null) {
    if (t.__proto__ == u)
      return t;
    {
      const e = [];
      return e.push(t), e.__proto__ = u, e;
    }
  } else {
    const e = [];
    return e.__proto__ = u, e;
  }
}, U = g(h, { fn: u, extend: g, each: M, grep: D, data: N, ajax: E });
export {
  U as default
};
//# sourceMappingURL=lessq.mjs.map
