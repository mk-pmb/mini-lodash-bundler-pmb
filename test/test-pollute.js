/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';
  var w = window, log = w.log, usc = '_';

  w.module = { exports: {} };
  w.define = function () {
    var args = Array.prototype.slice.call(arguments);
    log.apply(null, ['define():', arguments.length].concat(args));
    w.module.defined = args.pop();
    w.module.amdName = args.shift();
    log();
  };
  w.define.amd = {};

  w.reportVars = function (stage) {
    log('vars @ ' + stage + ':');
    log('        _ = ', w[usc]);
    log('   lodash = ', w.lodash);
    log('  exports = ', w.module.exports);
    log('  defined = ', w.module.amdName, ':', w.module.defined);
    log();
  };

  w.compile = function (slot) {
    var ex = w.module[slot], tmp = '¬ƒ';
    ex = ((typeof ex === 'function') && ex);
    if (ex) {
      try {
        tmp = ex();
      } catch (err) {
        tmp = String(err);
      }
    }
    log(slot + '() = ', tmp);
    if (ex) { w.reportVars('invoked'); } else { log(); }
  };

}());
