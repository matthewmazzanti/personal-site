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

    docker-compose
  ];
}
