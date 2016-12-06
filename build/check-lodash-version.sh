#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function check_lodash_version () {
  local FN=
  local VER=
  local QUOT='"'
  local APOS="'"
  local V_RGX='(var\s+|\.)VERSION\s*=\s*\W([0-9\.]+)\W'
  for FN in "$@"; do
    VER="$(grep -aoPe "$V_RGX" -- "$FN")"
    VER="${VER//$APOS/$QUOT}"
    VER="${VER// = /=}"
    VER="${VER#var }"
    VER="${VER#\.}"
    case "$VER" in
      *$'\n'* ) VER='E_MULTI';;
      '' ) VER='E_NONE';;
      'VERSION="'*'"' ) VER="${VER%$QUOT}"; VER="${VER#VERSION=$QUOT}";;
    esac
    echo -E "$VER"$'\t'"$FN"
  done
  return 0
}










[ "$1" == --lib ] && return 0; check_lodash_version "$@"; exit $?
