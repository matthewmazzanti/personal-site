{ pkgs ? import <nixpkgs> {}, ... }:
with pkgs;
pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
    autoconf
    automake
    libtool
    pkg-config
    nasm
    chromium

    docker-compose
  ];
  shellHook = ''
    export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
    export PUPPETEER_EXECUTABLE_PATH=${pkgs.chromium.outPath}/bin/chromium
  '';
}
