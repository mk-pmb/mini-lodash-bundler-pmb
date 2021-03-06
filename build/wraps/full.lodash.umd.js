﻿/*jslint indent: 2, maxlen: 80, nomen: true */
/* -*- tab-width: 2 -*- */
/*globals window: true, define: true, module: true */
(function () {
  'use strict';
  function e(x) { return (x || false); }
  function f(x) { return (typeof x === 'function'); }
  var n = 'lodash', L = (function () {
    /MAGIC_LINE/.compileFuncBody();
  }()), w, m, d;

  /* detect browser window */
  w = e((typeof window === 'object') && window);
  d = e(w.document);
  /MAGIC_LINE/.buffer.merge();
  w = (w && (w.self === w)
    && f(d.createElement)
    && f(d.getElementById)
    && f(d.getElementsByTagName)
    && w);
  /MAGIC_LINE/.buffer.end();

  /* detect AMD */
  d = e((typeof define === 'function') && define.amd && define);
  if (d) {
    if (w[n] === d) { w[n] = L; }
    define(n, function () { return L; });
  }

  /* detect CommonJS module */
  m = e((typeof module === 'object') && module);
  m = ((typeof e(m.exports) === 'object') && m);
  if (m) {
    if (w[n] === m.exports) { w[n] = L; }
    m.exports = L;
  }

  if (w && ((m || d || w[n]) === undefined)) { w[n] = L; }





















}());
