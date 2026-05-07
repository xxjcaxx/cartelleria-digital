#!/bin/sh
set -eu

CACHE_DIR="${CACHE_DIR:-/usr/local/apache2/htdocs/layouts/media}"
INTERVAL_SECONDS="${INTERVAL_SECONDS:-600}"

CAM1_URL="https://gotafreda.es/estacions/c23m145e15/webcam1/webcam.jpg"
CAM2_URL="https://gotafreda.es/estacions/c23m145e15/webcam2/webcam.jpg"
AVAMET_URL="https://www.avamet.org/mx-mxo.php?id=c23m145e15"

mkdir -p "$CACHE_DIR"

random_token() {
  rand_part="$(od -An -N4 -tu4 /dev/urandom 2>/dev/null | tr -d ' \n' || true)"
  if [ -z "$rand_part" ]; then
    rand_part="$$"
  fi
  printf '%s-%s\n' "$(date +%s%N)" "$rand_part"
}

fetch_to_file() {
  src_url="$1"
  output_file="$2"
  token="$(random_token)"
  sep='?'
  case "$src_url" in
    *\?*) sep='&' ;;
  esac
  request_url="${src_url}${sep}nocatxe=${token}"

  tmp_file="${output_file}.tmp"
  if curl -fsSL --connect-timeout 10 --max-time 30 "$request_url" -o "$tmp_file"; then
    mv "$tmp_file" "$output_file"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Updated $(basename "$output_file")"
  else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Failed to download $request_url" >&2
    rm -f "$tmp_file"
  fi
}

while true; do
  fetch_to_file "$CAM1_URL" "$CACHE_DIR/webcam1-cache.jpg"
  fetch_to_file "$CAM2_URL" "$CACHE_DIR/webcam2-cache.jpg"
  fetch_to_file "$AVAMET_URL" "$CACHE_DIR/avamet-cache.html"
  sleep "$INTERVAL_SECONDS"
done