/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';
  var w = window, log = w.log;

  w.module = { exports: {} };
  w.define = function () {
    var args = Array.prototype.slice.call(arguments);
    log.apply(null, ['define():', arguments.length].concat(args));
    w.module.defined = args.pop();
    w.module.amdName = args.shift();
    log();
  };
  w.define.amd = {};

}());
