//
// lessQuery - TypeScript Declaration File
//
// Copyright (c) 2017 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

interface LessQueryStatic {
  extend<T>(target : T, opts : Object) : T;
  each(list : any[], callback : (index : number, v : any) => void) : LessQueryStatic;
  each(map : { [k : string] : any }, callback : (k : string, v : any) => void) : LessQueryStatic;
  grep(list : any[], accept : (item : any) => boolean) : any[];
  data(target : Element, k : string) : any;
  data(target : Element, k : string, v : any) : LessQuery;
  ajax(params : LessQueryXHRParams) : LessQueryXHR;
  (target : string|Window|Element|Document) : LessQuery;
}

interface LessQuery extends Array<any> {

  attr(k : string) : string;
  attr(k : string, v : string|number) : LessQuery;
  attr(attr : { [k : string] : string|number }) : LessQuery;

  prop(k : string) : any;
  prop(k : string, v : string|number|boolean) : LessQuery;
  prop(prop : { [k : string] : string|number|boolean }) : LessQuery;

  css(k : string) : string;
  css(k : string, v : string|number) : LessQuery;
  css(css : any) : LessQuery;

  data(k : string) : any;
  data(k : string, v : any) : LessQuery;
  data(data : { [k : string] : any }) : LessQuery;

  each(callback : (index? : number) => void) : LessQuery;

  val() : string;
  val(val : string) : LessQuery;

  html(html : string) : LessQuery;
  html() : string;
  text(text : string) : LessQuery;
  text() : string;

  offset() : { left : number, top : number };
  width() : number;
  height() : number;
  innerWidth() : number;
  innerHeight() : number;
  outerWidth(margin? : boolean) : number;
  outerHeight(margin? : boolean) : number;
  scrollLeft() : number;
  scrollLeft(scrollLeft : number) : LessQuery;
  scrollTop() : number;
  scrollTop(scrollTop : number) : LessQuery;
  addClass(className : string) : LessQuery;
  removeClass(className : string) : LessQuery;
  hasClass(className : string) : boolean;
  // DOM
  append(child : LessQuery|string) : LessQuery;
  prepend(child : LessQuery|string) : LessQuery;
  remove() : LessQuery;
  detach() : LessQuery;
  parent() : LessQuery;
  closest(selector : string) : LessQuery;
  children(selector? : string) : LessQuery;
  find(selector : string) : LessQuery;
  insertBefore(target : LessQuery) : LessQuery;
  insertAfter(target : LessQuery) : LessQuery;
  first() : LessQuery;
  last() : LessQuery;
  clone() : LessQuery;
  index() : number;

  // event
  on(type : string, listener : (event : LessQueryEventObject, data? : any) => void) : LessQuery;
  off(type : string, listener : (event : LessQueryEventObject, data? : any) => void) : LessQuery;
  trigger(type : string, data? : any) : LessQuery;

  // etc.
  focus() : LessQuery;
  select() : LessQuery;
  submit() : LessQuery;
}

interface LessQueryEventObject {
  type : string;
  target : Element;
  offsetX : number;
  offsetY : number;
  pageX : number;
  pageY : number;
  keyCode : number;
  ctrlKey : boolean;
  shiftKey : boolean;
  altKey : boolean;
  metaKey : boolean;
  which : number;
  originalEvent? : Event;
  preventDefault() : void;
  stopPropagation() : void;
  stopImmediatePropagation() : void;
}

interface LessQueryXHRParams {
  url : string;
  method? : string;
  contentType? : string|boolean;
  data? : any;
  cache? : boolean;
  processData? : boolean;
  async? : boolean;
  xhr? : () => XMLHttpRequest;
}

interface LessQueryXHR {
  done(callback : (data : any) => void) : LessQueryXHR;
  fail(callback : () => void) : LessQueryXHR;
  always(callback : () => void) : LessQueryXHR;
  abort() : LessQueryXHR;
}
