#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-
SELFPATH="$(readlink -m "$BASH_SOURCE"/..)"

source "$SELFPATH"/check-lodash-version.sh --lib || exit $?


function update () {
  cd "$SELFPATH" || return $?
  mkdir -p cache || return $?
  export LANG{,UAGE}=en_US.UTF-8

  local LD_VER="$(nodejs -p 'require("lodash-cli/package.json").version')"
  [ -n "$LD_VER" ] || return 4$(
    echo 'E: failed to detect lodash-cli version' >&2)

  local BASEURL="https://raw.githubusercontent.com/lodash/lodash/$LD_VER/"
  local EDITIONS=(
    ''
    .core
    )
  local EDITION=
  local SAVE_FN=
  local SAVED_VER=
  for EDITION in "${EDITIONS[@]}"; do
    SAVE_FN="cache/_${EDITION:-.vanilla}.min.js"
    dwnl "${BASEURL}dist/lodash${EDITION}.min.js" "$SAVE_FN" || return $?
    assert_lodash_version "$SAVE_FN" || return $?
  done

  ensure_license_utf8 || return $?
  check_flavor_freshness || nodejs bake.js || return $?

  return 0
}


function dwnl () {
  local DL_URL="$1"; shift
  local DEST_FN="$1"; shift
  if [ -z "$DEST_FN" ]; then
    DEST_FN="${DL_URL%/}"
    [ "$DEST_FN" == "$DL_URL" ] || DEST_FN+=.html
    DEST_FN="${DEST_FN##*/}"
    DEST_FN="cache/$DEST_FN"
  fi
  echo -n "$DEST_FN <- "
  if [ -f "$DEST_FN" ] && [ -s "$DEST_FN" ]; then
    du -h -- "$DEST_FN" | cut -f 1
    return 0
  fi
  wget --output-document="$DEST_FN".tmp --continue "$DL_URL" || return $?
  [ -f "$DEST_FN".tmp -a -s "$DEST_FN".tmp ] || return 4$(
    ls -l "$DEST_FN".tmp >&2)
  mv --no-target-directory --verbose -- "$DEST_FN"{.tmp,} || return $?
  return 0
}


function wrap_it () {
  local WRAP_JS="$1"; shift
  local ORIG_JS="$1"; shift

  echo "E: stub!" >&2; return 8

  local PIPE_ERR="${PIPESTATUS[*]}"
  let PIPE_ERR="${PIPE_ERR// /+}"
  return "$PIPE_ERR"
}


function ensure_license_utf8 () {
  local LIC='cache/LICENSE.txt'
  dwnl "${BASEURL}LICENSE" "$LIC" || return $?
  local UTF8_BOM=$'\xEF\xBB\xBF'
  [ "$(head --bytes=3 "$LIC")" == "$UTF8_BOM" ] || LANG=C sed -re '
    1s~^~'"$UTF8_BOM"'\n~' -i -- "$LIC" || return $?
  return 0
}


function assert_lodash_version () {
  local FN="$1"
  local ACTUAL="$(check_lodash_version "$FN")"
  [ "$ACTUAL" == "$LD_VER"$'\t'"$FN" ] || return 7$(
    echo "E: bad version: $ACTUAL" >&2)
  echo "version ok:"$'\t'"$ACTUAL"
  return 0
}


function check_flavor_freshness () {
  local FLAVORS=()
  readarray -t FLAVORS < <(sed -nre 's~^  "([^"]+)":.*$~\1~p' -- flavors.json)
  local FLAVOR=
  for FLAVOR in "${FLAVORS[@]}"; do
    assert_lodash_version "cache/$FLAVOR.js" || return $?
  done
  return 0
}










[ "$1" == --lib ] && return 0; update "$@"; exit $?
