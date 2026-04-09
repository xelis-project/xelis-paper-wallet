#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v cargo >/dev/null 2>&1; then
  echo "Error: cargo is required. Install Rust from https://rustup.rs/" >&2
  exit 1
fi

if ! command -v live-server >/dev/null 2>&1; then
  echo "Error: live-server is required for tauri dev (devUrl)." >&2
  echo "Install it with: npm install -g live-server" >&2
  exit 1
fi

if ! cargo tauri --version >/dev/null 2>&1; then
  echo "Installing tauri-cli..."
  cargo install tauri-cli --version '^2.0.0' --locked
fi

echo "Building WASM assets..."
./build.sh

echo "Starting frontend dev server on http://localhost:9966 ..."
live-server public --port=9966 >/tmp/xelis-paper-wallet-live-server.log 2>&1 &
SERVER_PID=$!

cleanup() {
  if ps -p "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

echo "Launching Tauri from sources..."
cargo tauri dev
