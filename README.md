
<!--#echo json="package.json" key="name" underline="=" -->
mini-lodash-bundler-pmb
=======================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Scripts to build my favorite lodash flavors and package them for npm.
<!--/#echo -->


Alternatives
------------

* Why not use [ld-min](https://www.npmjs.com/package/ld-min)?
  * It's currently [unmaintained][ld-min-unmaintained].
* Why not generate it with [lodash-cli][lodash-cli]?
  * [Bug 132][noexit-bug] ([test][noexit-js], [log][noexit-log])
  * Why not just exit node forcefully then?
    * Would be harder to use this package from within other packages.
    * Actually there's no API yet anyway, so I'll just do that and call it
      "good enough" for now.

  [ld-min-unmaintained]: https://github.com/ide/ld-min/commit/08738b7736ee8900cf2e616b630af830e0a81338
  [lodash-cli]: https://www.npmjs.com/package/lodash-cli
  [noexit-bug]: https://github.com/lodash/lodash-cli/issues/132
  [noexit-js]: https://github.com/mk-pmb/mini-lodash-bundler-pmb/blob/noexit-java-bug-132/noexit.js
  [noexit-log]: https://github.com/mk-pmb/mini-lodash-bundler-pmb/blob/noexit-java-bug-132/noexit.log


<!--#toc stop="scan" -->


License
-------
<!--#echo json="package.json" key=".license" -->
MIT
<!--/#echo -->
