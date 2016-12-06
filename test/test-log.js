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

  function log() {
    var args = Array.prototype.slice.call(arguments), msg;
    msg = args.map(function (arg) {
      arg = ((arg && typeof arg) === 'object'
        ? JSON.stringify(arg, null, 2).replace(/\n\s*/g, ' ')
        : String(arg));
      return ellip(arg);
    }).join(' ').replace(/\n/g, '¶ ');
    log.dest.appendChild(document.createTextNode(msg + '\n'));
  }
  log.dest = document.createElement('pre');
  log.dest.id = 'test-log-output';
  body.appendChild(log.dest);

  window.log = log;



}());
