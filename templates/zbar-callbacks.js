// Simple framework to bind zbar with JavaScript/emscripten
// Copyright (C) 2013 Yury Delendik
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

mergeInto(LibraryManager.library, {
  js_get_width: function () { return Module['imageWidth']; },
  js_get_height: function () { return Module['imageHeight']; },
  js_read_image: function (dataPtr, len) {
    var HEAPU8 = Module['HEAPU8'];
    var array = HEAPU8.subarray(dataPtr, dataPtr + len);
    Module['getImageData'](array);
    return array.length;
  },
  js_output_result: function (symbol, addon, data) {
    var Pointer_stringify = Module['Pointer_stringify'];
    Module['outputResult'](Pointer_stringify(symbol),
                           Pointer_stringify(addon),
                           Pointer_stringify(data));
  },

  iconv_open: function (toCode, fromCode) {
    var Pointer_stringify = Module['Pointer_stringify'];
    var iconv = Module['iconvCache'] || (Module['iconvCache'] = {});
    var cd = Module['_malloc'](1);
    var descriptor = {
      toCode: Pointer_stringify(toCode),
      fromCode: Pointer_stringify(fromCode)
    };
    descriptor.decoder = new TextDecoder(descriptor.fromCode
                                                   .toLowerCase()
                                                   .replace(/\/\/.*$/, ''));
    descriptor.encoder = new TextEncoder(descriptor.toCode
                                                   .toLowerCase()
                                                   .replace(/\/\/.*$/, ''));
    iconv[cd] = descriptor;
    return cd;
  },
  iconv: function (cd, inbuf, inbytesleft, outbuf, outbytesleft) {
    var iconv = Module['iconvCache'];
    var descriptor = iconv[cd];
    var HEAPU8 = Module['HEAPU8'], HEAP32 = Module['HEAP32'];
    var offset = HEAP32[(inbuf >> 2)];
    var count = HEAP32[(inbytesleft >> 2)];
    var str = descriptor.decoder.decode(HEAPU8.subarray(offset, offset + count));
    HEAP32[(inbuf >> 2)] += count;
    HEAP32[(inbytesleft >> 2)] = 0;
    var bytes = descriptor.encoder.encode(str);
    var dest = HEAP32[(outbuf >> 2)];
    // HACK ignoring overflow for now
    HEAPU8.set(bytes, dest);
    HEAP32[(outbuf >> 2)] += bytes.length;
    HEAP32[(outbytesleft >> 2)] -= bytes.length;
    return str.length;
  },
  iconv_close: function (cd) {
    var iconv = Module['iconvCache'];
    delete iconv[cd];
    Module['_free'](cd);
  }
});
