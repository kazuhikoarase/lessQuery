const c = function(n, t) {
  const e = n;
  for (let r in t)
    e[r] = t[r];
  return e;
}, s = function(n, t) {
  for (let e in n)
    t(e, n[e]);
}, o = {
  each: function(n) {
    for (let t = 0; t < this.length; t += 1)
      n.call(this[t], t);
    return this;
  }
}, i = o;
s(i, function(n, t) {
  n != "each" && (i[n] = function() {
    for (let e = 0; e < this.length; e += 1)
      t.apply(this[e], arguments);
    return this;
  });
});
const f = function(n) {
  const t = [];
  return t.__proto__ = o, t;
}, u = c(f, { fn: o, extend: c, each: s });
export {
  u as minQuery
};
//# sourceMappingURL=minq.mjs.map
