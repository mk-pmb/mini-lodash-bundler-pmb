/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';
  var body = document.getElementsByTagName('body')[0];

  function ellip(x, head, tail) {
    head = (+head || 64);
    tail = (+tail || head);
    var snip = (x.length - head - tail);
    if (snip < 1) { return x; }
    return x.slice(0, head).concat(' …[+' + snip + ']… ', x.slice(-tail));
  }

  function describe(x) {
    switch (x && typeof x) {
    case undefined:
      return '\u26F6';
    case 'function':
      x = Function.prototype.toString.call(x);
      break;
    case 'object':
      x = (JSON.stringify(x, null, 2) || ('keys: ' +
          JSON.stringify(Object.keys(x), null, 2))
        ).replace(/\n\s*/g, ' ');
      break;
    }
    x = ellip(String(x)).replace(/\t/g, '\u21B9 ').replace(/\n/g, '¶ ');
    return x;
  }

  function log() {
    var args = Array.prototype.slice.call(arguments), msg;
    msg = args.map(describe).join(' ');
    log.dest.appendChild(document.createTextNode(msg + '\n'));
  }
  log.dest = document.createElement('pre');
  log.dest.id = 'test-log-output';
  body.appendChild(log.dest);

  window.log = log;
  window.onerror = function () {
    var args = Array.prototype.slice.call(arguments);
    log('E:', args);
  };



}());
