#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function wrap_compile_func_body () {
  local WRAP_FN="$1"; shift
  local INSERT_FN="$1"; shift
  local SED_CFB='\:/MAGIC_LINE/\.compileFuncBody:{r /dev/stdin'$'\nd}'
  local SELFPATH="$(readlink -m "$BASH_SOURCE"/..)"
  <"$INSERT_FN" sed -rf "$SELFPATH"/compile-func-body.sed -e 's~^~\t~
    ' | sed -rf "$SELFPATH"/magic.whitespace.sed -e "$SED_CFB" -- "$WRAP_FN"
  local PIPE_RV="${PIPESTATUS[*]}"
  let PIPE_RV="${PIPE_RV// /+}"
  return "$PIPE_RV"
}












[ "$1" == --lib ] && return 0; wrap_compile_func_body "$@"; exit $?
