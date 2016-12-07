
mini-lodash-‹%loMajor_3%›-pmb
===================

‹%pkDescr%›

Generated using [mini-lodash-bundler-pmb][bundler].

Versioning scheme:

```text
  semver:   major   .  minor   .  patch
  lodash:      LLL  .  MMM     .  PPP       = ‹%loVer%›
 bundler:   aaa     .     nnn  .     qqq    = ‹%bnVer%›
  mini-…:   aaaLLL  .  MMMnnn  .  PPPqqq    = ‹%pkVer%›
```

  [bundler]: (https://github.com/mk-pmb/mini-lodash-bundler-pmb)


Files:

  * `{core,full}._.min.js` are the official builds, downloaded from the CDN.
    * Named "_" because they use quite intrusive measures to find your global
      object and set that property, even when they successfully detect your
      AMD loader and `define()` to it.
  * `compile.cjs.min.js` CommonJS-exports a function that compiles a full
    lodash and won't pollute my browser's window object.
  * `full.anon.amd.js` anonymously `define()`s a factory function that
    returns one (always same) full lodash.
  * `full.lodash.umd.js`: like `full.anon.amd.js` but use module name
    "lodash" for AMD.
    * Also tries to CommonJS-export it (replaces `module.exports` if it's
      truthy).
    * If `window` looks browser-y, additionally sets `window.lodash`…
      * if `window.lodash === undefined` and neither AMD nor CommonJS were
        detected, or
      * if CommonJS was detected and `window.lodash ===` the old/original
        exports object, or
      * if AMD was detected and `window.lodash ===` the `define()` function.







License
-------

MIT; see https://lodash.com/ and [LICENSE.txt](LICENSE.txt).
