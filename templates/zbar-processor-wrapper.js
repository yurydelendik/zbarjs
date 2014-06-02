// The main barcode scanning processing function.
// Compiled from zbar.sf.net using emscripten.
//
// Copyright (C) 2013 Yury Delendik
// Modified 2014, André Fiedler
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
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301 USA

self.onmessage = function(e) {
    var result = zbarProcessImageData(e.data.imageData, e.data.width, e.data.height);
    if (result.length > 0) {
        postMessage({
            result: result,
            success: true
        });
    } else {
        postMessage({
            result: [],
            success: false
        });
    }
}

function Log(message) {
    postMessage({
        result: message,
        success: 'log'
    });
}

function zbarProcessImageData(imgData, width, height) {
  var result = [];
  var Module = {};
  Module.imageWidth = width;
  Module.imageHeight = height;
  Module.getImageData = function(grayData) {
      var d = imgData;
      for (var i = 0, j = 0; i < d.length; i += 4, j++) {
          grayData[j] = (d[i] * 66 + d[i + 1] * 129 + d[i + 2] * 25 + 4096) >> 8;
      }
  };
  Module.outputResult = function(symbol, addon, data) {
      result.push([symbol, addon, data]);
  };

  /* EMSCRIPTEN_CODE */

  return result;
}

