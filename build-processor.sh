#/bin/bash
# Any copyright is dedicated to the Public Domain.
# http://creativecommons.org/publicdomain/zero/1.0/

cd zbar-0.10
# unpacked from http://downloads.sourceforge.net/project/zbar/zbar/0.10/zbar-0.10.tar.bz2

# no need in most of the features
emconfigure ./configure  --without-PACKAGE --without-x --without-jpeg --without-imagemagick --without-npapi --without-gtk --without-python --without-qt --disable-video --disable-pthread

emmake make

# building simple zbar-main.c application
emcc -O1 -g0 -I`pwd`/include ../templates/zbar-main.c ./zbar/.libs/libzbar.a --js-library ../templates/zbar-callbacks.js -o ./zbar-processor-content.js
sed '/\/\* EMSCRIPTEN_CODE \*\//r ./zbar-processor-content.js' ../templates/zbar-processor-wrapper.js > ../zbar-processor.js

cd ..


