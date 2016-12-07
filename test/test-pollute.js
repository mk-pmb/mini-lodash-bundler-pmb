/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';
  var w = window, log = w.log, usc = '_', usd = '$';

  w.reportVars = function (stage) {
    var extraArgs = Array.prototype.slice.call(arguments, 1);
    log('vars @ ' + stage + ':');
    if (extraArgs.length) {
      log.apply(null, ['extraArgs ='].concat(extraArgs));
    }
    log('        _ =', w[usc]);
    log('   lodash =', w.lodash);
    if (w.module) {
      log('  exports =', w.module.exports);
      log('  defined =', w.module.amdName, ':', w.module.defined);
    }
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
