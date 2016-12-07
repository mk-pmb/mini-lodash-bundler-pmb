/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var EX = {};

  EX.calculateDistVersion = function (lod, bun) {
    lod = EX.checkVerFmt(lod, 'lodash');
    bun = EX.checkVerFmt(bun, 'bundler');
    return EX.verJoin([ (bun[1] * 1000) + lod[1],
      (lod[2] * 1000) + bun[2], (lod[3] * 1000) + bun[3] ]);
  };

  EX.checkVerFmt = function (v, descr) {
    if (typeof v === 'string') { v = EX.verSplit(v); }
    if ((Array.isArray(v) && v.length) === 4) { return v; }
    if (!descr) { return false; }
    throw new Error('bad ' + descr + ' version');
  };

  function decNum(n) { return parseInt(String(n || ''), 10); }
  EX.verSplit = function (v) { return [v].concat(v.split(/\./).map(decNum)); };
  EX.verJoin = function (v) { return [ v.join('.') ].concat(v); };

  return EX;
}());
