/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
'use strict';

function applyTo(x, f) { return f(x); }
function numlpad(n, m) { return (n < m ? String(m + n).slice(1) : n); }
function isFunc(x) { return (typeof x === 'function'); }


var EX = { launchTime: Date.now() }, lodashCli = require('lodash-cli'),
  flavors = require('./flavors.json'),
  async = require('async'),
  fs = require('fs'), pathLib = require('path'),
  kisi = require('./kitchen-sink.js'),
  versCalc = require('./version-calc.js'),
  bundlerVer = versCalc.checkVerFmt(require('../package.json').version),
  lodashVer = versCalc.checkVerFmt(require('lodash-cli/package.json').version),
  distVer = versCalc.calculateDistVersion(lodashVer, bundlerVer),
  buildDir = pathLib.dirname(module.filename),
  outputDir = pathLib.join(buildDir, 'cache');


EX.exitTimeoutSec = 2;


EX.miniLicense = [ '/**',   // taken from minified download version of lodash
  '@license',
  'Lodash lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE',
  ].join('\n * ') + '\n */';


EX.bakeFiles = function (whenBundled) {
  var todo = [], txv = {
    bnVer: bundlerVer[0],
    loVer: lodashVer[0],
    pkVer: distVer[0],
    loMajor_3: numlpad(lodashVer[1], 1e3),
    pkDescr: ('lodash v' + lodashVer[0] + ', minified, on npm.'
    + ' Includes a housebroken AMD version.'),
  };

  ['README.md', 'package.json'].forEach(function (fn) {
    todo.push({ srcFile: 'dist-' + fn.toLowerCase(), saveFn: fn,
      textVars: txv });
  });

  if (process.env.BAKE_FLAVORS !== 'skip') {
    Object.keys(flavors).forEach(function (flName) {
      var fl = flavors[flName], job;
      if (fl.skip) { return; }
      job = (((fl.copy === true) && {})
        || EX.prepareBuildTask(fl)
        );
      if (!job) { return; }
      job.saveFn = flName + '.js';
      if (fl.repack) { job.translate = EX.repackTrans.bind(null, fl.repack); }
      todo.push(job);
    });
  }

  async.each(todo, EX.buildFile, (whenBundled || EX.reportDone));
};


EX.log = function (info, cb) {
  var now = Date.now();
  console.log('@' + ((now - EX.launchTime) / 1000).toFixed(3) + 's', info);
  return (cb && cb(null));
};


EX.reportDone = function (err) {
  EX.log({ finishedBundle: distVer[0], hadError: !!err });
  if (err) { throw err; }
  setTimeout(EX.forceExit, EX.exitTimeoutSec * 1000).unref();
};


EX.forceExit = function () {
  EX.log({ forcedExit: 'lodash-cli issues #132' });
  process.exit(0);
};


EX.soon = function (delaySec, func) {
  return function () {
    var args = arguments;
    setTimeout(function () { func.apply(null, args); }, delaySec * 1000);
  };
};


EX.prepareBuildTask = function (fl) {
  var args = fl.build,
    delaySec = 0.2;   // <-- let local file reads fail fast first
  if (!args) { return false; }
  args = EX.kvPairsToEqual(args);
  if (fl.repack) { args.push('iife=' + EX.repackIifeFmt); }

  return {
    srcFunc: EX.soon(delaySec, function buildTask(whenBuilt) {
      function recvSource(result) { return whenBuilt(null, result.source); }
      EX.log({ lodashCliArgs: args });
      lodashCli(args, recvSource);
    }),
  };
};


EX.repackIifeFmt = ';define.BAKE = function () {%output%  return _;};';
EX.repackIifeStartRgx = /\n;\s*define\.BAKE\b[ -z]*\{\s*/;
EX.repackIifeEndRgx = /\s*\}[\s;]{0,8}$/;
EX.metaBuildLineRgx = /(^|\n)[ -0]+[Bb]uild:[\x00-\t\x0B-\uFFFF]*/g;


EX.repackTrans = function (tmpl, code, whenRepacked) {
  function fail(why) { return whenRepacked(new Error(why)); }
  if (!Array.isArray(tmpl)) { return fail('template must be an array'); }

  code = kisi.splitAtMark(code, EX.repackIifeStartRgx);
  if (code.length !== 2) {
    EX.log({ codeLines: kisi.dumpHugeText(code) });
    return fail('cannot find start of lodash code');
  }
  tmpl.meta = code[0];
  tmpl.code = code[1].replace(EX.repackIifeEndRgx, '');
  code = [];

  function tmplErr(err) { tmplErr.had = err; }
  tmplErr.had = false;
  tmpl.forEach(function (ln) {
    if (tmpl.err) { return; }
    ln = ln.split(/^(\s*)#(?:!(\w+)(?: |$)|)/);
    if (ln.length === 1) { return code.push(ln[0]); }
    if (ln === '') { ln = EX.miniLicense; }
    var indent = ln[0] + ln[1], fx = ln[2];
    if (!fx) { return; }
    ln = ln[3];
    switch (fx) {
    case 'censor_meta_iife':
      tmpl.meta = tmpl.meta.replace(EX.metaBuildLineRgx,
        function (bl) { return bl.replace(/( iife=)"[ \!#-~]+"/g, '$1…'); });
      return;
    case 'meta':
    case 'code':
      return code.push(indent + tmpl[fx]);
    }
    return tmplErr('unknown effect: ' + fx);
  });
  if (tmplErr.had) { return fail('template error: ' + tmplErr.had); }

  return whenRepacked(null, code.join(''));
};


EX.kvPairsToEqual = function (dict) {
  var eq = [];
  Object.keys(dict).sort().forEach(function (key) {
    var val = dict[key];
    if (val === false) { return; }
    if (val === true) { return eq.push(key); }
    return eq.push(key + '=' + String(val));
  });
  return eq;
};


EX.insertVars = function (vars, text) {
  return String(text).replace(/‹%(\w+)%›/g, function (m, k) {
    k = vars[k];
    return (k === undefined ? m : String(k));
  });
};


EX.buildFile = function (how, whenBuilt) {
  var wafa = [], srcFn = how.srcFile, saveAs = (how.saveFn || srcFn || '');
  if (srcFn && (srcFn.slice(-1) === '/')) { srcFn += saveAs; }
  EX.log({ startBuild: saveAs, fromFile: (srcFn || false) });
  if (srcFn) {
    wafa.push(fs.readFile.bind(null, pathLib.join(buildDir, srcFn), 'UTF-8'));
  }
  if (how.srcFunc) { wafa.push(how.srcFunc); }
  if (how.textVars) {
    wafa.push(function insertVars(fileText, deliver) {
      fileText = EX.insertVars(how.textVars, fileText);
      return deliver(null, fileText);
    });
  }
  if (how.translate) { wafa.push(how.translate); }
  if (saveAs) {
    wafa.push(function saveFile(data, whenSaved) {
      EX.log({ fileSaved: saveAs, dataLen: (data && data.length) });
      fs.writeFile(pathLib.join(outputDir, saveAs), (data || ''), whenSaved);
    });
  }
  async.waterfall(wafa, function report(err) {
    EX.log(err ? { fileFailed: saveAs, err: (err.message || err) }
      : { fileFinished: saveAs });
    return whenBuilt(err);
  });
};






















module.exports = EX;
if (require.main === module) { EX.bakeFiles(); }
