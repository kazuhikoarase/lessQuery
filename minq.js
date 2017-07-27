//
// minQuery
//
// Copyright (c) 2017 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

'use strict';

var minQuery = function() {

  var extend = function(o1, o2) {
    for (var k in o2) { o1[k] = o2[k]; } return o1;
  };

  var each = function(it, callback) {
    for (var k in it) { callback(k, it[k]); }
  };

  // 1. for single element
  var fn = {
    css : function(kv) {
      for (var k in kv) { this.style[k] = kv[k]; } return this;
    },
    on : function(type, listener) {
      this.addEventListener(type, listener); return this;
    }
  };

  // 2. to array
  each(fn, function(name, func) {
    fn[name] = function() {
      for (var i = 0; i < this.length; i += 1) {
        var ret = func.apply(this[i], arguments);
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
    }
  });

  var $ = function(target) {

    if (typeof target == 'function') {

      // ready
      return $(document).on('DOMContentLoaded', target);

    } else if (typeof target == 'string') {

      // query
      var childNodes = document.querySelectorAll(target);
      var elms = [];
      for (var i = 0; i < childNodes.length; i += 1) {
        elms.push(childNodes.item(i) );
      }
      elms.__proto__ = fn;
      return elms;

    } else if (typeof target == 'object' && target != null) {

      var elms = [];
      elms.push(target);
      elms.__proto__ = fn;
      return elms;

    } else {

      var elms = [];
      elms.__proto__ = fn;
      return elms;
    }
  };

  return extend($, { fn : fn, extend : extend, each : each });
}();
