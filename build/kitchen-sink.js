/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var kisi = module.exports;


kisi.dumpHugeText = function splitLines(s) {
  if (s.map) { return s.map(splitLines); }
  s = kisi.arrEllip(s.split('\n'), 20, 10);
  return s;
};


kisi.arrEllip = function (arr, head, tail) {
  var snip = +(+arr.length - head - tail);
  if (snip < 1) { return arr; }
  return arr.slice(0, head).concat('… +' + snip + ' …', arr.slice(-tail));
};


kisi.splitAtMark = function (text, mark) {
  var found = (text.match(mark) || false);
  return (found.index > 0
    ? [ text.slice(0, found.index), text.slice(found.index + found[0].length) ]
    : [text]);
};























/*scroll*/
