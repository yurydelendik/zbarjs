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
// Note: Some Emscripten settings will significantly limit the speed of the generated code.
// Note: Some Emscripten settings may limit the speed of the generated code.
try {
  this['Module'] = Module;
  Module.test;
} catch(e) {
  this['Module'] = Module = {};
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (typeof module === "object") {
  module.exports = Module;
}
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  if (!Module['arguments']) {
    Module['arguments'] = process['argv'].slice(2);
  }
}
if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  Module['read'] = read;
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
  if (!Module['arguments']) {
    if (typeof scriptArgs != 'undefined') {
      Module['arguments'] = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) {
  if (!Module['print']) {
    Module['print'] = function(x) {
      console.log(x);
    };
  }
  if (!Module['printErr']) {
    Module['printErr'] = function(x) {
      console.log(x);
    };
  }
}
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (!Module['arguments']) {
    if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WORKER) {
  // We can do very little here...
  var TRY_USE_DUMP = false;
  if (!Module['print']) {
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  Module['load'] = importScripts;
}
if (!ENVIRONMENT_IS_WORKER && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_SHELL) {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
if (!Module['preRun']) Module['preRun'] = [];
if (!Module['postRun']) Module['postRun'] = [];
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map(function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2 + 2*i;
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xff;
      if (needed) {
        buffer.push(code);
        needed--;
      }
      if (buffer.length == 0) {
        if (code < 128) return String.fromCharCode(code);
        buffer.push(code);
        if (code > 191 && code < 224) {
          needed = 1;
        } else {
          needed = 2;
        }
        return '';
      }
      if (needed > 0) return '';
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var ret;
      if (c1 > 191 && c1 < 224) {
        ret = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else {
        ret = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+7)>>3)<<3); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+7)>>3)<<3); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = ((((DYNAMICTOP)+7)>>3)<<3); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function abort(text) {
  Module.print(text + ':\n' + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = globalScope['Module']['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,((Math.min((+(Math.floor((value)/(+(4294967296))))), (+(4294967295))))|0)>>>0],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATINIT__ = []; // functions called during startup
var __ATMAIN__ = []; // functions called when main() is to be run
var __ATEXIT__ = []; // functions called during shutdown
var runtimeInitialized = false;
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledInit = false, calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
function addPreRun(func) {
  if (!Module['preRun']) Module['preRun'] = [];
  else if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
  Module['preRun'].push(func);
}
var awaitingMemoryInitializer = false;
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
    runPostSets();
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
  awaitingMemoryInitializer = false;
}
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 10624;
var _stderr;
var _stderr = _stderr=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
/* memory initializer */ allocate([89,56,48,48,0,0,0,0,128,18,0,0,0,18,0,0,216,17,0,0,152,17,0,0,80,17,0,0,0,0,0,0,10,9,8,8,12,11,16,10,14,13,16,12,0,0,0,0,65,0,4,1,1,0,0,1,64,16,4,0,0,16,0,0,16,1,17,0,16,0,16,0,0,17,1,0,0,16,0,0,132,0,66,0,4,0,64,0,128,16,2,0,0,16,0,0,0,108,0,0,0,68,0,0,0,56,0,0,0,16,0,0,0,0,1,1,4,0,3,1,2,0,2,1,0,2,1,2,240,255,255,15,255,31,47,243,255,79,127,248,95,249,246,255,255,111,159,245,143,247,244,255,63,242,241,255,255,255,255,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,20,0,0,136,20,0,0,192,19,0,0,8,19,0,0,104,15,0,0,0,0,0,0,255,240,255,31,255,242,255,255,255,255,255,63,244,245,255,111,255,255,255,255,240,241,255,47,255,255,255,255,255,255,63,79,255,15,241,242,255,63,255,244,245,246,247,137,255,171,255,252,255,255,15,31,35,69,246,127,255,255,255,255,248,255,249,175,240,241,255,47,255,243,255,255,79,95,103,137,250,191,255,205,240,241,242,63,244,86,255,255,255,255,127,143,154,255,188,223,15,31,242,255,255,63,255,255,244,255,245,111,255,255,255,255,15,31,35,255,69,111,255,255,247,255,248,159,255,255,255,255,0,7,12,25,36,50,64,71,11,2,8,16,10,4,8,9,255,0,1,4,2,8,5,10,3,14,9,7,6,13,11,12,1,2,4,8,3,6,12,11,5,10,7,14,15,13,9,1,2,4,8,3,6,12,11,5,10,7,14,15,13,9,1,0,82,71,66,52,3,0,0,0,4,8,16,24,66,71,82,49,3,0,0,0,1,160,163,198,52,50,50,80,1,0,0,0,1,0,0,0,89,56,48,48,0,0,0,0,0,0,0,0,89,85,89,50,2,0,0,0,1,0,0,0,74,80,69,71,5,0,0,0,0,0,0,0,89,86,89,85,2,0,0,0,1,0,1,0,89,56,0,0,0,0,0,0,0,0,0,0,78,86,50,49,4,0,0,0,1,1,1,0,78,86,49,50,4,0,0,0,1,1,0,0,66,71,82,51,3,0,0,0,3,16,8,0,89,86,85,57,1,0,0,0,2,2,1,0,82,71,66,79,3,0,0,0,2,106,101,96,82,71,66,81,3,0,0,0,2,98,109,104,71,82,69,89,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,4,16,8,0,89,56,32,32,0,0,0,0,0,0,0,0,73,52,50,48,1,0,0,0,1,1,0,0,82,71,66,49,3,0,0,0,1,165,162,192,89,85,49,50,1,0,0,0,1,1,0,0,89,86,49,50,1,0,0,0,1,1,1,0,82,71,66,51,3,0,0,0,3,0,8,16,82,52,52,52,3,0,0,0,2,136,132,128,66,71,82,52,3,0,0,0,4,16,8,0,89,85,86,57,1,0,0,0,2,2,0,0,77,74,80,71,5,0,0,0,0,0,0,0,52,49,49,80,1,0,0,0,2,0,0,0,82,71,66,80,3,0,0,0,2,107,69,96,82,71,66,82,3,0,0,0,2,99,77,104,89,85,89,86,2,0,0,0,1,0,0,0,85,89,86,89,2,0,0,0,1,0,2,0,0,0,0,0,248,8,0,0,128,7,0,0,176,30,0,0,224,29,0,0,8,29,0,0,232,27,0,0,200,26,0,0,192,24,0,0,168,24,0,0,200,23,0,0,16,23,0,0,96,22,0,0,208,21,0,0,0,0,0,0,6,16,4,19,25,8,17,5,9,18,7,21,22,0,20,3,24,1,2,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,8,0,0,0,42,0,0,0,24,0,0,0,24,0,0,0,32,0,0,0,30,0,0,0,8,0,0,0,42,0,0,0,255,255,255,255,0,0,0,0,1,0,0,0,12,0,0,0,48,0,0,0,6,0,0,0,64,0,0,0,24,0,0,0,128,0,0,0,30,0,0,0,40,0,0,0,42,0,0,0,255,255,255,255,0,0,0,0,24,0,0,0,2,0,0,0,52,0,0,0,2,0,0,0,20,0,0,0,34,0,0,0,144,0,0,0,38,0,0,0,18,0,0,0,2,0,0,0,255,255,255,255,0,0,0,0,112,0,0,0,26,0,0,0,160,0,0,0,26,0,0,0,144,0,0,0,18,0,0,0,120,0,0,0,36,0,0,0,152,0,0,0,26,0,0,0,255,255,255,255,0,0,0,0,1,0,0,0,12,0,0,0,8,0,0,0,42,0,0,0,24,0,0,0,24,0,0,0,32,0,0,0,30,0,0,0,8,0,0,0,42,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,128,66,134,200,74,142,208,18,147,213,151,255,217,27,255,255,92,160,226,36,165,255,39,255,232,42,255,255,43,255,255,255,7,26,32,13,16,3,19,23,34,22,29,35,25,13,5,28,19,6,37,7,12,42,42,39,49,4,14,52,0,15,67,21,37,70,28,38,73,11,8,76,18,9,82,25,43,88,15,0,97,2,17,100,9,18,112,6,19,133,36,22,138,41,40,145,33,24,148,43,25,162,40,41,168,39,42,193,31,27,196,38,28,208,35,29,3,20,30,6,27,31,9,10,1,12,17,2,18,24,33,24,14,4,33,1,10,36,8,11,48,5,13,66,22,36,72,12,7,96,3,16,129,30,20,132,37,21,144,34,23,192,32,26,0,0,0,0,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,45,46,32,36,47,43,37,42,0,0,0,0,92,191,161,42,197,12,164,45,227,15,95,228,107,232,105,167,231,193,81,30,131,217,0,132,31,199,13,51,134,181,14,21,135,16,218,17,54,229,24,55,204,19,57,137,151,20,27,138,58,189,162,94,1,133,176,2,163,165,44,22,136,188,18,166,97,230,86,98,25,219,26,168,50,28,139,205,29,169,195,32,196,80,93,192,43,198,46,83,96,49,82,194,52,200,85,87,62,206,59,201,106,84,79,56,88,203,47,202,0,0,0,0,0,0,0,0,0,0,0,0,52,50,50,80,73,52,50,48,89,85,49,50,89,86,49,50,52,49,49,80,78,86,49,50,78,86,50,49,89,85,89,86,85,89,86,89,89,85,89,50,89,85,86,52,82,71,66,51,3,0,0,0,66,71,82,51,82,71,66,52,66,71,82,52,82,71,66,80,82,71,66,79,82,71,66,82,82,71,66,81,89,85,86,57,89,86,85,57,71,82,69,89,89,56,48,48,89,56,32,32,89,56,0,0,82,71,66,49,82,52,52,52,66,65,56,49,89,52,49,80,89,52,52,52,89,85,86,79,72,77,49,50,72,73,50,52,74,80,69,71,77,74,80,71,77,80,69,71,0,0,0,0,58,32,37,115,32,40,37,100,41,10,0,0,0,0,0,0,37,115,58,32,122,98,97,114,32,37,115,32,105,110,32,37,115,40,41,58,10,32,32,32,32,37,115,58,32,0,0,0,69,65,78,45,56,0,0,0,33,112,114,111,99,45,62,119,97,105,116,95,104,101,97,100,0,0,0,0,0,0,0,0,33,40,99,111,100,101,32,38,32,48,120,56,48,41,0,0,37,115,58,32,69,82,82,79,82,32,119,114,105,116,105,110,103,32,37,115,58,32,37,115,10,0,0,0,0,0,0,0,37,115,58,32,105,109,103,95,121,43,58,32,37,48,52,100,44,37,48,52,100,32,64,37,112,10,0,0,0,0,0,0,37,115,58,32,115,101,116,116,105,110,103,32,98,101,115,116,32,102,111,114,109,97,116,32,37,46,52,115,40,37,48,56,120,41,32,40,37,100,41,10,0,0,0,0,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,105,110,118,97,108,105,100,32,105,111,109,111,100,101,32,114,101,113,117,101,115,116,101,100,0,0,0,0,0,0,0,0,80,68,70,52,49,55,0,0,111,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,122,98,97,114,47,112,114,111,99,101,115,115,111,114,46,99,0,0,0,0,0,0,0,0,99,111,100,101,32,60,32,48,120,49,52,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,105,61,37,120,32,106,61,37,120,32,99,111,100,101,61,37,48,50,120,32,99,104,97,114,115,101,116,61,37,120,32,99,101,120,112,61,37,120,32,37,115,10,0,0,114,99,32,62,61,32,48,0,37,115,58,32,69,82,82,79,82,32,111,112,101,110,105,110,103,32,37,115,58,32,37,115,10,0,0,0,0,0,0,0,37,115,58,32,105,109,103,95,120,45,58,32,37,48,52,100,44,37,48,52,100,32,64,37,112,10,0,0,0,0,0,0,110,111,32,115,117,112,112,111,114,116,101,100,32,105,109,97,103,101,32,102,111,114,109,97,116,115,32,97,118,97,105,108,97,98,108,101,0,0,0,0,115,116,97,116,101,45,62,107,105,99,107,95,102,100,115,91,49,93,32,62,61,32,48,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,100,101,118,105,99,101,32,97,108,114,101,97,100,121,32,111,112,101,110,101,100,44,32,117,110,97,98,108,101,32,116,111,32,99,104,97,110,103,101,32,105,111,109,111,100,101,0,0,67,79,68,69,45,49,50,56,0,0,0,0,0,0,0,0,110,111,32,101,114,114,111,114,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,99,111,100,101,61,37,48,50,120,32,101,49,61,37,120,32,101,50,61,37,120,32,115,52,61,37,120,32,99,111,108,111,114,61,37,120,10,0,0,0,0,0,0,0,99,111,100,101,32,62,61,32,83,84,65,82,84,95,65,32,38,38,32,99,111,100,101,32,60,61,32,83,84,65,82,84,95,67,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,112,32,61,61,32,100,97,116,97,32,43,32,120,32,43,32,121,32,42,32,40,105,110,116,112,116,114,95,116,41,119,0,119,0,0,0,0,0,0,0,37,115,58,32,37,46,52,115,40,37,48,56,120,41,32,45,62,32,37,46,52,115,40,37,48,56,120,41,32,40,37,100,41,10,0,0,0,0,0,0,122,98,97,114,47,112,114,111,99,101,115,115,111,114,47,112,111,115,105,120,46,104,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,37,115,58,32,114,101,113,117,101,115,116,32,105,110,116,101,114,102,97,99,101,32,118,101,114,115,105,111,110,32,37,100,10,0,0,0,0,0,0,0,67,79,68,69,45,51,57,0,117,110,107,110,111,119,110,32,105,109,97,103,101,32,102,111,114,109,97,116,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,110,61,37,120,32,100,61,37,120,32,99,104,107,61,37,120,32,37,115,10,0,0,0,0,0,0,0,0,105,100,120,32,60,32,48,120,50,99,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,37,115,10,0,110,101,120,116,32,62,32,115,121,109,115,45,62,100,97,116,97,108,101,110,0,0,0,0,37,115,58,32,105,109,103,95,120,43,58,32,37,48,52,100,44,37,48,52,100,32,64,37,112,10,0,0,0,0,0,0,37,115,58,32,100,117,109,112,105,110,103,32,37,46,52,115,40,37,48,56,120,41,32,105,109,97,103,101,32,116,111,32,37,115,10,0,0,0,0,0,37,115,58,32,37,46,52,115,40,37,48,56,120,41,32,45,62,32,63,32,40,117,110,115,117,112,112,111,114,116,101,100,41,10,0,0,0,0,0,0,37,115,58,32,91,37,100,93,32,102,100,61,37,100,32,104,97,110,100,108,101,114,61,37,112,10,0,0,0,0,0,0,114,99,32,62,61,32,48,0,100,101,118,105,99,101,32,97,108,114,101,97,100,121,32,111,112,101,110,101,100,44,32,117,110,97,98,108,101,32,116,111,32,99,104,97,110,103,101,32,105,110,116,101,114,102,97,99,101,0,0,0,0,0,0,0,73,50,47,53,0,0,0,0,37,120,0,0,0,0,0,0,110,101,119,0,0,0,0,0,122,98,97,114,0,0,0,0,99,104,107,32,60,32,49,48,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,32,105,100,120,61,37,120,32,101,110,99,61,37,120,32,115,57,61,37,120,10,0,0,0,0,0,0,0,100,99,111,100,101,45,62,98,117,102,91,100,99,111,100,101,49,50,56,45,62,99,104,97,114,97,99,116,101,114,32,45,32,49,93,32,61,61,32,83,84,79,80,95,70,87,68,0,122,98,97,114,47,113,114,99,111,100,101,47,113,114,100,101,99,116,120,116,46,99,0,0,33,115,121,109,45,62,115,121,109,115,0,0,0,0,0,0,110,32,60,32,108,101,110,0,110,111,32,105,110,112,117,116,32,111,114,32,111,117,116,112,117,116,32,102,111,114,109,97,116,115,32,97,118,97,105,108,97,98,108,101,0,0,0,0,112,114,111,99,45,62,116,104,114,101,97,100,101,100,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,119,61,37,120,32,100,61,37,120,32,99,104,107,61,37,120,32,37,115,10,0,0,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,37,115,58,32,114,101,113,117,101,115,116,32,115,105,122,101,58,32,37,100,32,120,32,37,100,10,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,99,61,37,48,50,120,32,115,57,61,37,120,10,0,0,0,0,0,0,0,73,83,66,78,45,49,51,0,37,100,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,97,108,108,111,99,61,37,120,32,105,100,120,61,37,120,32,99,61,37,48,50,120,32,37,115,10,0,0,60,63,62,0,0,0,0,0,100,117,112,108,105,99,97,116,101,0,0,0,0,0,0,0,98,117,102,91,37,48,52,120,93,61,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,99,104,107,61,37,120,32,110,61,37,120,32,37,115,0,0,0,0,0,0,101,110,99,32,60,32,48,120,50,48,0,0,0,0,0,0,100,99,111,100,101,45,62,98,117,102,91,100,99,111,100,101,49,50,56,45,62,99,104,97,114,97,99,116,101,114,32,45,32,49,93,32,61,61,32,83,84,79,80,95,82,69,86,0,67,80,52,51,55,0,0,0,105,115,99,110,45,62,114,101,99,121,99,108,101,91,105,93,46,110,115,121,109,115,0,0,37,115,46,37,48,56,120,46,122,105,109,103,0,0,0,0,105,109,97,103,101,32,102,111,114,109,97,116,32,108,105,115,116,32,105,115,32,110,111,116,32,115,111,114,116,101,100,33,63,0,0,0,0,0,0,0,85,84,70,45,56,0,0,0,122,98,97,114,47,112,114,111,99,101,115,115,111,114,47,112,111,115,105,120,46,99,0,0,37,115,58,32,109,97,120,32,102,105,110,100,101,114,32,108,105,110,101,115,32,61,32,37,100,120,37,100,10,0,0,0,97,108,114,101,97,100,121,32,105,110,105,116,105,97,108,105,122,101,100,44,32,117,110,97,98,108,101,32,116,111,32,114,101,115,105,122,101,0,0,0,69,65,78,45,49,51,0,0,122,98,97,114,47,101,114,114,111,114,46,99,0,0,0,0,60,117,110,107,110,111,119,110,62,0,0,0,0,0,0,0,122,98,97,114,47,105,109,103,95,115,99,97,110,110,101,114,46,99,0,0,0,0,0,0,117,110,99,101,114,116,97,105,110,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,105,61,37,120,32,100,61,37,120,32,99,104,107,61,37,120,32,37,115,10,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,32,101,110,99,61,37,120,32,115,57,61,37,120,10,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,100,105,114,61,37,120,32,37,115,10,0,0,0,0,0,0,0,0,0,0,73,83,79,56,56,53,57,45,37,105,0,0,0,0,0,0,115,121,109,45,62,100,97,116,97,0,0,0,0,0,0,0,37,115,46,37,46,52,115,46,122,105,109,103,0,0,0,0,37,115,58,32,107,105,99,107,105,110,103,32,37,100,32,102,100,115,10,0,0,0,0,0,112,114,111,99,45,62,108,111,99,107,95,108,101,118,101,108,32,61,61,32,49,0,0,0,37,115,58,32,115,104,97,114,101,100,32,102,111,114,109,97,116,58,32,37,52,46,52,115,10,0,0,0,0,0,0,0,110,111,116,32,99,111,109,112,105,108,101,100,32,119,105,116,104,32,118,105,100,101,111,32,105,110,112,117,116,32,115,117,112,112,111,114,116,0,0,0,118,105,100,101,111,32,100,114,105,118,101,114,32,100,111,101,115,32,110,111,116,32,115,117,112,112,111,114,116,32,112,111,108,108,105,110,103,0,0,0,85,80,67,45,65,0,0,0,122,98,97,114,47,105,109,97,103,101,46,99,0,0,0,0,78,79,84,69,0,0,0,0,115,114,99,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,0,0,0,0,0,0,0,0,105,109,103,45,62,115,114,99,105,100,120,32,62,61,32,48,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,0,100,115,116,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,122,98,97,114,47,112,114,111,99,101,115,115,111,114,47,108,111,99,107,46,99,0,0,0,79,75,0,0,0,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,69,82,82,79,82,0,0,0,37,115,0,0,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,37,115,58,32,37,115,37,115,58,32,37,115,32,40,37,100,32,112,116,115,41,32,40,113,61,37,100,41,32,40,37,115,41,10,0,0,0,0,0,0,100,32,60,32,49,48,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,99,32,60,32,48,120,50,99,0,0,0,0,0,0,0,0,70,65,84,65,76,32,69,82,82,79,82,0,0,0,0,0,100,99,111,100,101,45,62,98,117,102,95,97,108,108,111,99,32,62,32,100,99,111,100,101,49,50,56,45,62,99,104,97,114,97,99,116,101,114,0,0,110,111,116,32,99,111,109,112,105,108,101,100,32,119,105,116,104,32,111,117,116,112,117,116,32,119,105,110,100,111,119,32,115,117,112,112,111,114,116,0,32,0,0,0,0,0,0,0,114,99,32,62,61,32,48,0,83,74,73,83,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,105,109,97,103,101,32,115,99,97,110,110,101,114,0,0,0,118,105,100,101,111,32,105,110,112,117,116,32,110,111,116,32,105,110,105,116,105,97,108,105,122,101,100,0,0,0,0,0,48,0,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,110,111,116,32,99,111,109,112,105,108,101,100,32,119,105,116,104,32,111,117,116,112,117,116,32,119,105,110,100,111,119,32,115,117,112,112,111,114,116,0,32,37,46,52,115,40,37,48,56,120,41,61,37,100,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,37,115,58,32,32,32,32,32,91,37,48,50,100,93,32,64,37,48,56,108,120,10,0,0,119,105,110,100,111,119,0,0,37,115,58,32,91,37,100,93,32,102,100,61,37,100,32,110,61,37,100,10,0,0,0,0,100,105,115,112,108,97,121,32,119,105,110,100,111,119,32,110,111,116,32,97,118,97,105,108,97,98,108,101,32,102,111,114,32,105,110,112,117,116,0,0,119,32,61,61,32,119,97,105,116,101,114,0,0,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,37,115,58,32,100,115,116,61,37,100,120,37,100,32,40,37,108,120,41,32,37,108,120,32,115,114,99,61,37,100,120,37,100,32,37,108,120,10,0,0,85,83,69,82,80,84,82,0,118,105,100,101,111,0,0,0,105,100,120,32,60,61,32,48,120,53,48,0,0,0,0,0,118,105,100,101,111,32,100,101,118,105,99,101,32,110,111,116,32,111,112,101,110,101,100,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,115,114,99,45,62,119,105,100,116,104,32,42,32,115,114,99,45,62,104,101,105,103,104,116,0,0,0,0,0,0,0,0,82,69,65,68,0,0,0,0,73,83,66,78,45,49,48,0,112,114,111,99,101,115,115,111,114,0,0,0,0,0,0,0,110,111,32,99,111,109,112,97,116,105,98,108,101,32,105,109,97,103,101,32,102,111,114,109,97,116,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,115,105,103,61,37,120,32,111,102,102,115,101,116,61,37,120,32,98,97,115,101,61,37,120,32,105,100,120,61,37,120,10,0,0,0,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,115,114,99,110,32,43,32,50,32,42,32,115,114,99,110,0,37,115,58,32,112,114,101,45,97,108,108,111,99,97,116,101,100,32,37,100,32,37,115,32,98,117,102,102,101,114,115,32,115,105,122,101,61,48,120,37,108,120,10,0,0,0,0,0,114,99,32,62,61,32,48,0,117,110,107,110,111,119,110,32,101,114,114,111,114,0,0,0,122,105,109,97,103,101,0,0,119,105,110,100,111,119,32,111,117,116,112,117,116,0,0,0,98,97,115,101,32,60,32,56,0,0,0,0,0,0,0,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,115,114,99,110,32,43,32,50,32,42,32,115,114,99,109,0,117,110,97,98,108,101,32,116,111,32,97,108,108,111,99,97,116,101,32,105,109,97,103,101,32,98,117,102,102,101,114,115,0,0,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,119,105,110,100,111,119,115,32,115,121,115,116,101,109,32,101,114,114,111,114,0,0,0,0,118,105,100,101,111,32,105,110,112,117,116,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,115,105,103,61,37,120,32,111,102,102,115,101,116,61,37,120,32,105,100,120,61,37,120,32,98,97,115,101,61,37,120,10,0,0,0,0,114,99,32,62,61,32,48,0,115,114,99,102,109,116,45,62,112,46,121,117,118,46,120,115,117,98,50,32,61,61,32,49,0,0,0,0,0,0,0,0,33,118,100,111,45,62,98,117,102,0,0,0,0,0,0,0,111,117,116,112,117,116,32,119,105,110,100,111,119,32,105,115,32,99,108,111,115,101,100,0,37,115,58,32,69,82,82,79,82,58,32,110,111,32,99,111,109,112,97,116,105,98,108,101,32,37,115,32,102,111,114,109,97,116,10,0,0,0,0,0,97,99,99,32,60,32,49,48,51,0,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,40,115,114,99,45,62,119,105,100,116,104,32,42,32,115,114,99,45,62,104,101,105,103,104,116,32,43,32,117,118,112,95,115,105,122,101,40,115,114,99,44,32,115,114,99,102,109,116,41,32,42,32,50,41,0,0,118,100,111,45,62,100,97,116,97,108,101,110,0,0,0,0,88,49,49,32,112,114,111,116,111,99,111,108,32,101,114,114,111,114,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,110,111,32,99,111,109,112,97,116,105,98,108,101,32,105,110,112,117,116,32,116,111,32,111,117,116,112,117,116,32,102,111,114,109,97,116,10,46,46,46,116,114,121,105,110,103,32,97,103,97,105,110,32,119,105,116,104,32,111,117,116,112,117,116,32,100,105,115,97,98,108,101,100,10,0,0,0,0,0,115,117,109,32,60,32,49,48,51,0,0,0,0,0,0,0,108,105,110,101,0,0,0,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,40,115,114,99,45,62,119,105,100,116,104,32,42,32,115,114,99,45,62,104,101,105,103,104,116,32,42,32,115,114,99,102,109,116,45,62,112,46,114,103,98,46,98,112,112,41,0,0,105,109,103,45,62,115,114,99,105,100,120,32,61,61,32,45,49,0,0,0,0,0,0,0,88,49,49,32,100,105,115,112,108,97,121,32,101,114,114,111,114,0,0,0,0,0,0,0,97,108,108,32,114,101,115,111,117,114,99,101,115,32,98,117,115,121,0,0,0,0,0,0,115,112,97,119,110,105,110,103,32,105,110,112,117,116,32,116,104,114,101,97,100,0,0,0,37,115,58,32,112,114,111,99,101,115,115,105,110,103,58,32,37,46,52,115,40,37,48,56,120,41,32,37,100,120,37,100,32,64,37,112,10,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,100,105,114,61,37,120,32,105,61,37,120,32,115,117,109,61,37,120,32,97,99,99,61,37,120,32,37,115,10,0,0,0,0,0,0,0,37,115,58,32,32,32,32,32,32,114,101,99,121,99,108,101,100,91,37,100,93,32,32,32,32,32,32,32,32,61,32,37,45,52,100,10,0,0,0,0,122,98,97,114,47,99,111,110,118,101,114,116,46,99,0,0,122,98,97,114,47,100,101,99,111,100,101,114,47,101,97,110,46,99,0,0,0,0,0,0,118,100,111,0,0,0,0,0,122,98,97,114,47,100,101,99,111,100,101,114,47,99,111,100,101,51,57,46,99,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,122,98,97,114,47,100,101,99,111,100,101,114,47,99,111,100,101,49,50,56,46,99,0,0,115,112,97,119,110,105,110,103,32,118,105,100,101,111,32,116,104,114,101,97,100,0,0,0,37,115,37,48,50,120,0,0,99,111,100,101,32,60,61,32,57,0,0,0,0,0,0,0,37,115,58,32,99,108,111,115,101,100,32,99,97,109,101,114,97,32,40,102,100,61,37,100,41,10,0,0,0,0,0,0,37,115,58,32,115,121,109,98,111,108,115,32,97,108,108,111,99,97,116,101,100,32,32,32,32,32,32,32,61,32,37,45,52,100,10,0,0,0,0,0,73,83,79,56,56,53,57,45,49,0,0,0,0,0,0,0,37,115,58,32,37,100,120,37,100,32,102,105,110,100,101,114,115,44,32,37,100,32,99,101,110,116,101,114,115,58,10,0,114,99,32,62,61,32,48,0,0,0,0,0,0,0,0,0,108,111,99,107,105,110,103,32,101,114,114,111,114,0,0,0,97,108,108,111,99,97,116,105,110,103,32,118,105,100,101,111,32,114,101,115,111,117,114,99,101,115,0,0,0,0,0,0,115,121,109,45,62,100,97,116,97,95,97,108,108,111,99,0,100,99,111,100,101,45,62,98,117,102,91,106,93,32,60,61,32,39,57,39,0,0,0,0,37,115,58,32,32,32,32,32,105,109,97,103,101,32,115,121,109,115,32,105,110,32,117,115,101,32,32,32,61,32,37,45,52,100,9,114,101,99,121,99,108,101,100,32,32,61,32,37,45,52,100,10,0,0,0,0,69,82,82,79,82,58,32,105,109,97,103,101,32,102,111,114,109,97,116,32,108,105,115,116,32,105,115,32,110,111,116,32,115,111,114,116,101,100,33,63,10,0,0,0,0,0,0,0,116,105,109,101,111,117,116,32,62,32,48,0,0,0,0,0,37,115,58,32,102,114,111,109,32,37,46,52,115,40,37,48,56,120,41,32,116,111,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,43,53,0,0,0,0,0,0,105,109,103,45,62,114,101,102,99,110,116,0,0,0,0,0,115,121,115,116,101,109,32,101,114,114,111,114,0,0,0,0,102,97,105,108,101,100,32,116,111,32,111,112,101,110,32,112,105,112,101,0,0,0,0,0,112,114,111,99,45,62,108,111,99,107,95,108,101,118,101,108,32,62,32,48,0,0,0,0,97,108,108,111,99,97,116,105,110,103,32,119,105,110,100,111,119,32,114,101,115,111,117,114,99,101,115,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,115,116,97,114,116,61,37,120,32,101,110,100,61,37,120,32,105,61,37,120,32,106,61,37,120,32,37,115,10,0,0,0,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,37,115,58,32,32,32,32,32,115,99,97,110,110,101,114,32,115,121,109,115,32,105,110,32,117,115,101,32,61,32,37,45,52,100,9,114,101,99,121,99,108,101,100,32,32,61,32,37,45,52,100,10,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,33,114,99,0,0,0,0,0,105,109,103,0,0,0,0,0,43,50,0,0,0,0,0,0,105,110,118,97,108,105,100,32,114,101,113,117,101,115,116,0,33,112,114,111,99,45,62,119,97,105,116,95,110,101,120,116,0,0,0,0,0,0,0,0,99,111,100,101,32,62,61,32,67,79,68,69,95,67,32,38,38,32,99,111,100,101,32,60,61,32,67,79,68,69,95,65,0,0,0,0,0,0,0,0,47,100,101,118,47,118,105,100,101,111,48,0,0,0,0,0,114,99,32,62,61,32,48,0,37,115,58,32,115,121,109,98,111,108,32,115,101,116,115,32,97,108,108,111,99,97,116,101,100,32,32,32,61,32,37,45,52,100,10,0,0,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,112,45,62,110,117,109,0,0,122,98,97,114,47,118,105,100,101,111,46,99,0,0,0,0,85,78,75,78,79,87,78,0,85,80,67,45,69,0,0,0,117,110,115,117,112,112,111,114,116,101,100,32,114,101,113,117,101,115,116,0,0,0,0,0,33,112,114,111,99,45,62,119,97,105,116,95,116,97,105,108,0,0,0,0,0,0,0,0,99,101,120,112,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,37,115,58,32,105,109,103,95,121,45,58,32,37,48,52,100,44,37,48,52,100,32,64,37,112,10,0,0,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,97,108,114,101,97,100,121,32,105,110,105,116,105,97,108,105,122,101,100,44,32,114,101,45,105,110,105,116,32,117,110,105,109,112,108,101,109,101,110,116,101,100,0,0,0,0,0,0,81,82,45,67,111,100,101,0,105,110,116,101,114,110,97,108,32,108,105,98,114,97,114,121,32,101,114,114,111,114,0,0,112,114,111,99,101,115,115,111,114,0,0,0,0,0,0,0,46,46,47,116,101,109,112,108,97,116,101,115,47,122,98,97,114,45,109,97,105,110,46,99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,122,98,97,114,95,118,105,100,101,111,95,114,101,113,117,101,115,116,95,115,105,122,101,0,122,98,97,114,95,118,105,100,101,111,95,114,101,113,117,101,115,116,95,105,111,109,111,100,101,0,0,0,0,0,0,0,122,98,97,114,95,118,105,100,101,111,95,114,101,113,117,101,115,116,95,105,110,116,101,114,102,97,99,101,0,0,0,0,122,98,97,114,95,118,105,100,101,111,95,111,112,101,110,0,122,98,97,114,95,118,105,100,101,111,95,110,101,120,116,95,105,109,97,103,101,0,0,0,122,98,97,114,95,118,105,100,101,111,95,105,110,105,116,0,122,98,97,114,95,118,105,100,101,111,95,103,101,116,95,102,100,0,0,0,0,0,0,0,122,98,97,114,95,118,105,100,101,111,95,101,110,97,98,108,101,0,0,0,0,0,0,0,122,98,97,114,95,115,99,97,110,95,105,109,97,103,101,0,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,117,115,101,114,95,119,97,105,116,0,0,0,0,0,0,0,0,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,115,101,116,95,97,99,116,105,118,101,0,0,0,0,0,0,0,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,105,110,105,116,0,0,0,0,0,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,100,101,115,116,114,111,121,0,0,122,98,97,114,95,110,101,103,111,116,105,97,116,101,95,102,111,114,109,97,116,0,0,0,122,98,97,114,95,105,109,97,103,101,95,119,114,105,116,101,0,0,0,0,0,0,0,0,122,98,97,114,95,105,109,97,103,101,95,102,114,101,101,95,100,97,116,97,0,0,0,0,118,105,100,101,111,95,105,110,105,116,95,105,109,97,103,101,115,0,0,0,0,0,0,0,118,97,108,105,100,97,116,101,95,99,104,101,99,107,115,117,109,0,0,0,0,0,0,0,114,101,109,111,118,101,95,112,111,108,108,0,0,0,0,0,113,114,95,104,97,110,100,108,101,114,0,0,0,0,0,0,113,114,95,99,111,100,101,95,100,97,116,97,95,108,105,115,116,95,101,120,116,114,97,99,116,95,116,101,120,116,0,0,112,114,111,99,95,115,108,101,101,112,0,0,0,0,0,0,112,114,111,99,95,112,111,108,108,95,105,110,112,117,116,115,0,0,0,0,0,0,0,0,112,114,111,99,95,107,105,99,107,95,104,97,110,100,108,101,114,0,0,0,0,0,0,0,112,111,115,116,112,114,111,99,101,115,115,95,99,0,0,0,112,111,115,116,112,114,111,99,101,115,115,0,0,0,0,0,109,97,105,110,0,0,0,0,105,115,98,110,49,48,95,99,97,108,99,95,99,104,101,99,107,115,117,109,0,0,0,0,101,114,114,95,99,111,112,121,0,0,0,0,0,0,0,0,101,114,114,95,99,108,101,97,110,117,112,0,0,0,0,0,101,114,114,95,99,108,101,97,110,117,112,0,0,0,0,0,101,114,114,95,99,108,101,97,110,117,112,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,97,110,95,118,101,114,105,102,121,95,99,104,101,99,107,115,117,109,0,0,0,0,0,100,117,109,112,95,115,116,97,116,115,0,0,0,0,0,0,100,101,99,111,100,101,95,108,111,0,0,0,0,0,0,0,100,101,99,111,100,101,52,0,99,111,110,118,101,114,116,95,121,117,118,112,95,116,111,95,114,103,98,0,0,0,0,0,99,111,110,118,101,114,116,95,121,117,118,95,116,111,95,114,103,98,0,0,0,0,0,0,99,111,110,118,101,114,116,95,121,117,118,95,112,97,99,107,0,0,0,0,0,0,0,0,99,111,110,118,101,114,116,95,117,118,112,95,97,112,112,101,110,100,0,0,0,0,0,0,99,111,110,118,101,114,116,95,114,103,98,95,116,111,95,121,117,118,112,0,0,0,0,0,99,111,110,118,101,114,116,95,114,103,98,95,116,111,95,121,117,118,0,0,0,0,0,0,99,111,110,118,101,114,116,95,114,103,98,95,114,101,115,97,109,112,108,101,0,0,0,0,99,111,100,101,51,57,95,100,101,99,111,100,101,57,0,0,97,100,100,95,112,111,108,108,0,0,0,0,0,0,0,0,95,122,98,97,114,95,119,105,110,100,111,119,95,97,116,116,97,99,104,0,0,0,0,0,95,122,98,97,114,95,118,105,100,101,111,95,114,101,99,121,99,108,101,95,115,104,97,100,111,119,0,0,0,0,0,0,95,122,98,97,114,95,118,105,100,101,111,95,114,101,99,121,99,108,101,95,105,109,97,103,101,0,0,0,0,0,0,0,95,122,98,97,114,95,118,105,100,101,111,95,111,112,101,110,0,0,0,0,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,113,114,95,100,101,115,116,114,111,121,0,0,0,0,0,0,0,0,95,122,98,97,114,95,113,114,95,100,101,99,111,100,101,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,119,97,105,116,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,117,110,108,111,99,107,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,115,101,116,95,115,105,122,101,0,0,0,0,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,111,112,101,110,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,105,110,118,97,108,105,100,97,116,101,0,0,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,105,110,105,116,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,99,108,111,115,101,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,95,105,109,97,103,101,0,0,0,0,0,95,122,98,97,114,95,105,109,97,103,101,95,115,99,97,110,110,101,114,95,114,101,99,121,99,108,101,95,115,121,109,115,0,0,0,0,0,0,0,0,95,122,98,97,114,95,105,109,97,103,101,95,115,99,97,110,110,101,114,95,97,108,108,111,99,95,115,121,109,0,0,0,95,122,98,97,114,95,101,114,114,111,114,95,115,116,114,105,110,103,0,0,0,0,0,0,95,122,98,97,114,95,101,114,114,111,114,95,115,112,101,119,0,0,0,0,0,0,0,0,95,122,98,97,114,95,100,101,99,111,100,101,95,99,111,100,101,51,57,0,0,0,0,0,95,122,98,97,114,95,100,101,99,111,100,101,95,99,111,100,101,49,50,56,0,0,0,0,95,122,98,97,114,95,98,101,115,116,95,102,111,114,109,97,116,0,0,0,0,0,0,0,7,10,13,17,10,16,22,28,26,26,26,22,24,22,22,26,24,18,22,15,26,18,22,24,30,24,20,24,18,16,24,28,28,28,28,30,24,20,18,18,26,24,28,24,30,26,28,28,26,28,30,30,22,20,24,20,18,26,16,20,30,28,24,22,26,28,26,30,28,30,30,0,0,4,19,55,15,28,37,12,51,39,59,62,10,24,22,41,31,44,7,65,47,33,67,67,48,32,67,67,67,67,67,67,67,67,67,67,67,67,67,67].concat([1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,32,36,37,42,43,45,46,47,58,0,0,0,16,18,20,22,24,26,28,20,22,24,24,26,28,28,22,24,24,26,26,28,28,24,24,26,26,26,28,28,24,26,26,26,28,28,0,0,0,0,0,0,148,124,0,0,188,133,0,0,153,154,0,0,211,164,0,0,246,187,0,0,98,199,0,0,71,216,0,0,13,230,0,0,40,249,0,0,120,11,1,0,93,20,1,0,23,42,1,0,50,53,1,0,166,73,1,0,131,86,1,0,201,104,1,0,236,119,1,0,196,142,1,0,225,145,1,0,171,175,1,0,142,176,1,0,26,204,1,0,63,211,1,0,117,237,1,0,80,242,1,0,213,9,2,0,240,22,2,0,186,40,2,0,159,55,2,0,11,75,2,0,46,84,2,0,100,106,2,0,65,117,2,0,105,140,2,0])
, "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
function runPostSets() {
}
if (!awaitingMemoryInitializer) runPostSets();
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  function ___assert_func(filename, line, func, condition) {
      throw 'Assertion failed: ' + (condition ? Pointer_stringify(condition) : 'unknown condition') + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + new Error().stack;
    }
  function _js_get_width() { return Module['imageWidth']; }
  function _js_get_height() { return Module['imageHeight']; }
  function _js_read_image(dataPtr, len) {
      var HEAPU8 = Module['HEAPU8'];
      var array = HEAPU8.subarray(dataPtr, dataPtr + len);
      Module['getImageData'](array);
      return array.length;
    }
  function _js_output_result(symbol, addon, data) {
      var Pointer_stringify = Module['Pointer_stringify'];
      Module['outputResult'](Pointer_stringify(symbol),
                             Pointer_stringify(addon),
                             Pointer_stringify(data));
    }
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:35,EIDRM:36,ECHRNG:37,EL2NSYNC:38,EL3HLT:39,EL3RST:40,ELNRNG:41,EUNATCH:42,ENOCSI:43,EL2HLT:44,EDEADLK:45,ENOLCK:46,EBADE:50,EBADR:51,EXFULL:52,ENOANO:53,EBADRQC:54,EBADSLT:55,EDEADLOCK:56,EBFONT:57,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:74,ELBIN:75,EDOTDOT:76,EBADMSG:77,EFTYPE:79,ENOTUNIQ:80,EBADFD:81,EREMCHG:82,ELIBACC:83,ELIBBAD:84,ELIBSCN:85,ELIBMAX:86,ELIBEXEC:87,ENOSYS:88,ENMFILE:89,ENOTEMPTY:90,ENAMETOOLONG:91,ELOOP:92,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:106,EPROTOTYPE:107,ENOTSOCK:108,ENOPROTOOPT:109,ESHUTDOWN:110,ECONNREFUSED:111,EADDRINUSE:112,ECONNABORTED:113,ENETUNREACH:114,ENETDOWN:115,ETIMEDOUT:116,EHOSTDOWN:117,EHOSTUNREACH:118,EINPROGRESS:119,EALREADY:120,EDESTADDRREQ:121,EMSGSIZE:122,EPROTONOSUPPORT:123,ESOCKTNOSUPPORT:124,EADDRNOTAVAIL:125,ENETRESET:126,EISCONN:127,ENOTCONN:128,ETOOMANYREFS:129,EPROCLIM:130,EUSERS:131,EDQUOT:132,ESTALE:133,ENOTSUP:134,ENOMEDIUM:135,ENOSHARE:136,ECASECLASH:137,EILSEQ:138,EOVERFLOW:139,ECANCELED:140,ENOTRECOVERABLE:141,EOWNERDEAD:142,ESTRPIPE:143};
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  var __impure_ptr=allocate(1, "i32*", ALLOC_STATIC);var FS={currentPath:"/",nextInode:2,streams:[null],ignorePermissions:true,createFileHandle:function (stream, fd) {
        if (typeof stream === 'undefined') {
          stream = null;
        }
        if (!fd) {
          if (stream && stream.socket) {
            for (var i = 1; i < 64; i++) {
              if (!FS.streams[i]) {
                fd = i;
                break;
              }
            }
            assert(fd, 'ran out of low fds for sockets');
          } else {
            fd = Math.max(FS.streams.length, 64);
            for (var i = FS.streams.length; i < fd; i++) {
              FS.streams[i] = null; // Keep dense
            }
          }
        }
        // Close WebSocket first if we are about to replace the fd (i.e. dup2)
        if (FS.streams[fd] && FS.streams[fd].socket && FS.streams[fd].socket.close) {
          FS.streams[fd].socket.close();
        }
        FS.streams[fd] = stream;
        return fd;
      },removeFileHandle:function (fd) {
        FS.streams[fd] = null;
      },joinPath:function (parts, forceRelative) {
        var ret = parts[0];
        for (var i = 1; i < parts.length; i++) {
          if (ret[ret.length-1] != '/') ret += '/';
          ret += parts[i];
        }
        if (forceRelative && ret[0] == '/') ret = ret.substr(1);
        return ret;
      },absolutePath:function (relative, base) {
        if (typeof relative !== 'string') return null;
        if (base === undefined) base = FS.currentPath;
        if (relative && relative[0] == '/') base = '';
        var full = base + '/' + relative;
        var parts = full.split('/').reverse();
        var absolute = [''];
        while (parts.length) {
          var part = parts.pop();
          if (part == '' || part == '.') {
            // Nothing.
          } else if (part == '..') {
            if (absolute.length > 1) absolute.pop();
          } else {
            absolute.push(part);
          }
        }
        return absolute.length == 1 ? '/' : absolute.join('/');
      },analyzePath:function (path, dontResolveLastLink, linksVisited) {
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };
        path = FS.absolutePath(path);
        if (path == '/') {
          ret.isRoot = true;
          ret.exists = ret.parentExists = true;
          ret.name = '/';
          ret.path = ret.parentPath = '/';
          ret.object = ret.parentObject = FS.root;
        } else if (path !== null) {
          linksVisited = linksVisited || 0;
          path = path.slice(1).split('/');
          var current = FS.root;
          var traversed = [''];
          while (path.length) {
            if (path.length == 1 && current.isFolder) {
              ret.parentExists = true;
              ret.parentPath = traversed.length == 1 ? '/' : traversed.join('/');
              ret.parentObject = current;
              ret.name = path[0];
            }
            var target = path.shift();
            if (!current.isFolder) {
              ret.error = ERRNO_CODES.ENOTDIR;
              break;
            } else if (!current.read) {
              ret.error = ERRNO_CODES.EACCES;
              break;
            } else if (!current.contents.hasOwnProperty(target)) {
              ret.error = ERRNO_CODES.ENOENT;
              break;
            }
            current = current.contents[target];
            if (current.link && !(dontResolveLastLink && path.length == 0)) {
              if (linksVisited > 40) { // Usual Linux SYMLOOP_MAX.
                ret.error = ERRNO_CODES.ELOOP;
                break;
              }
              var link = FS.absolutePath(current.link, traversed.join('/'));
              ret = FS.analyzePath([link].concat(path).join('/'),
                                   dontResolveLastLink, linksVisited + 1);
              return ret;
            }
            traversed.push(target);
            if (path.length == 0) {
              ret.exists = true;
              ret.path = traversed.join('/');
              ret.object = current;
            }
          }
        }
        return ret;
      },findObject:function (path, dontResolveLastLink) {
        FS.ensureRoot();
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },createObject:function (parent, name, properties, canRead, canWrite) {
        if (!parent) parent = '/';
        if (typeof parent === 'string') parent = FS.findObject(parent);
        if (!parent) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent path must exist.');
        }
        if (!parent.isFolder) {
          ___setErrNo(ERRNO_CODES.ENOTDIR);
          throw new Error('Parent must be a folder.');
        }
        if (!parent.write && !FS.ignorePermissions) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent folder must be writeable.');
        }
        if (!name || name == '.' || name == '..') {
          ___setErrNo(ERRNO_CODES.ENOENT);
          throw new Error('Name must not be empty.');
        }
        if (parent.contents.hasOwnProperty(name)) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          throw new Error("Can't overwrite object.");
        }
        parent.contents[name] = {
          read: canRead === undefined ? true : canRead,
          write: canWrite === undefined ? false : canWrite,
          timestamp: Date.now(),
          inodeNumber: FS.nextInode++
        };
        for (var key in properties) {
          if (properties.hasOwnProperty(key)) {
            parent.contents[name][key] = properties[key];
          }
        }
        return parent.contents[name];
      },createFolder:function (parent, name, canRead, canWrite) {
        var properties = {isFolder: true, isDevice: false, contents: {}};
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createPath:function (parent, path, canRead, canWrite) {
        var current = FS.findObject(parent);
        if (current === null) throw new Error('Invalid parent.');
        path = path.split('/').reverse();
        while (path.length) {
          var part = path.pop();
          if (!part) continue;
          if (!current.contents.hasOwnProperty(part)) {
            FS.createFolder(current, part, canRead, canWrite);
          }
          current = current.contents[part];
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        properties.isFolder = false;
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createDataFile:function (parent, name, data, canRead, canWrite) {
        if (typeof data === 'string') {
          var dataArray = new Array(data.length);
          for (var i = 0, len = data.length; i < len; ++i) dataArray[i] = data.charCodeAt(i);
          data = dataArray;
        }
        var properties = {
          isDevice: false,
          contents: data.subarray ? data.subarray(0) : data // as an optimization, create a new array wrapper (not buffer) here, to help JS engines understand this object
        };
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          var LazyUint8Array = function() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile) {
        Browser.init();
        var fullname = FS.joinPath([parent, name], true);
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },createLink:function (parent, name, target, canRead, canWrite) {
        var properties = {isDevice: false, link: target};
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createDevice:function (parent, name, input, output) {
        if (!(input || output)) {
          throw new Error('A device must have at least one callback defined.');
        }
        var ops = {isDevice: true, input: input, output: output};
        return FS.createFile(parent, name, ops, Boolean(input), Boolean(output));
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },ensureRoot:function () {
        if (FS.root) return;
        // The main file system tree. All the contents are inside this.
        FS.root = {
          read: true,
          write: true,
          isFolder: true,
          isDevice: false,
          timestamp: Date.now(),
          inodeNumber: 1,
          contents: {}
        };
      },init:function (input, output, error) {
        // Make sure we initialize only once.
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        FS.ensureRoot();
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        input = input || Module['stdin'];
        output = output || Module['stdout'];
        error = error || Module['stderr'];
        // Default handlers.
        var stdinOverridden = true, stdoutOverridden = true, stderrOverridden = true;
        if (!input) {
          stdinOverridden = false;
          input = function() {
            if (!input.cache || !input.cache.length) {
              var result;
              if (typeof window != 'undefined' &&
                  typeof window.prompt == 'function') {
                // Browser.
                result = window.prompt('Input: ');
                if (result === null) result = String.fromCharCode(0); // cancel ==> EOF
              } else if (typeof readline == 'function') {
                // Command line.
                result = readline();
              }
              if (!result) result = '';
              input.cache = intArrayFromString(result + '\n', true);
            }
            return input.cache.shift();
          };
        }
        var utf8 = new Runtime.UTF8Processor();
        function simpleOutput(val) {
          if (val === null || val === 10) {
            output.printer(output.buffer.join(''));
            output.buffer = [];
          } else {
            output.buffer.push(utf8.processCChar(val));
          }
        }
        if (!output) {
          stdoutOverridden = false;
          output = simpleOutput;
        }
        if (!output.printer) output.printer = Module['print'];
        if (!output.buffer) output.buffer = [];
        if (!error) {
          stderrOverridden = false;
          error = simpleOutput;
        }
        if (!error.printer) error.printer = Module['print'];
        if (!error.buffer) error.buffer = [];
        // Create the temporary folder, if not already created
        try {
          FS.createFolder('/', 'tmp', true, true);
        } catch(e) {}
        // Create the I/O devices.
        var devFolder = FS.createFolder('/', 'dev', true, true);
        var stdin = FS.createDevice(devFolder, 'stdin', input);
        var stdout = FS.createDevice(devFolder, 'stdout', null, output);
        var stderr = FS.createDevice(devFolder, 'stderr', null, error);
        FS.createDevice(devFolder, 'tty', input, output);
        FS.createDevice(devFolder, 'null', function(){}, function(){});
        // Create default streams.
        FS.streams[1] = {
          path: '/dev/stdin',
          object: stdin,
          position: 0,
          isRead: true,
          isWrite: false,
          isAppend: false,
          isTerminal: !stdinOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[2] = {
          path: '/dev/stdout',
          object: stdout,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          isTerminal: !stdoutOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[3] = {
          path: '/dev/stderr',
          object: stderr,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          isTerminal: !stderrOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        // TODO: put these low in memory like we used to assert on: assert(Math.max(_stdin, _stdout, _stderr) < 15000); // make sure these are low, we flatten arrays with these
        HEAP32[((_stdin)>>2)]=1;
        HEAP32[((_stdout)>>2)]=2;
        HEAP32[((_stderr)>>2)]=3;
        // Other system paths
        FS.createPath('/', 'dev/shm/tmp', true, true); // temp files
        // Newlib initialization
        for (var i = FS.streams.length; i < Math.max(_stdin, _stdout, _stderr) + 4; i++) {
          FS.streams[i] = null; // Make sure to keep FS.streams dense
        }
        FS.streams[_stdin] = FS.streams[1];
        FS.streams[_stdout] = FS.streams[2];
        FS.streams[_stderr] = FS.streams[3];
        allocate([ allocate(
          [0, 0, 0, 0, _stdin, 0, 0, 0, _stdout, 0, 0, 0, _stderr, 0, 0, 0],
          'void*', ALLOC_NORMAL) ], 'void*', ALLOC_NONE, __impure_ptr);
      },quit:function () {
        if (!FS.init.initialized) return;
        // Flush any partially-printed lines in stdout and stderr. Careful, they may have been closed
        if (FS.streams[2] && FS.streams[2].object.output.buffer.length > 0) FS.streams[2].object.output(10);
        if (FS.streams[3] && FS.streams[3].object.output.buffer.length > 0) FS.streams[3].object.output(10);
      },standardizePath:function (path) {
        if (path.substr(0, 2) == './') path = path.substr(2);
        return path;
      },deleteFile:function (path) {
        path = FS.analyzePath(path);
        if (!path.parentExists || !path.exists) {
          throw 'Invalid path ' + path;
        }
        delete path.parentObject.contents[path.name];
      }};
  function _send(fd, buf, len, flags) {
      var info = FS.streams[fd];
      if (!info) return -1;
      info.sender(HEAPU8.subarray(buf, buf+len));
      return len;
    }
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var contents = stream.object.contents;
        while (contents.length < offset) contents.push(0);
        for (var i = 0; i < nbyte; i++) {
          contents[offset + i] = HEAPU8[(((buf)+(i))|0)];
        }
        stream.object.timestamp = Date.now();
        return i;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (stream && ('socket' in stream)) {
          return _send(fildes, buf, nbyte, 0);
      } else if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        if (stream.object.isDevice) {
          if (stream.object.output) {
            for (var i = 0; i < nbyte; i++) {
              try {
                stream.object.output(HEAP8[(((buf)+(i))|0)]);
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
            }
            stream.object.timestamp = Date.now();
            return i;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
          if (bytesWritten != -1) stream.position += bytesWritten;
          return bytesWritten;
        }
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }
  function _strstr(ptr1, ptr2) {
      var check = 0, start;
      do {
        if (!check) {
          start = ptr1;
          check = ptr2;
        }
        var curr1 = HEAP8[((ptr1++)|0)];
        var curr2 = HEAP8[((check++)|0)];
        if (curr2 == 0) return start;
        if (curr2 != curr1) {
          // rewind to one character after start, to find ez in eeez
          ptr1 = start + 1;
          check = 0;
        }
      } while (curr1);
      return 0;
    }
  function _strdup(ptr) {
      var len = _strlen(ptr);
      var newStr = _malloc(len + 1);
      (_memcpy(newStr, ptr, len)|0);
      HEAP8[(((newStr)+(len))|0)]=0;
      return newStr;
    }
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"No message of desired type",36:"Identifier removed",37:"Channel number out of range",38:"Level 2 not synchronized",39:"Level 3 halted",40:"Level 3 reset",41:"Link number out of range",42:"Protocol driver not attached",43:"No CSI structure available",44:"Level 2 halted",45:"Deadlock condition",46:"No record locks available",50:"Invalid exchange",51:"Invalid request descriptor",52:"Exchange full",53:"No anode",54:"Invalid request code",55:"Invalid slot",56:"File locking deadlock error",57:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",74:"Multihop attempted",75:"Inode is remote (not really error)",76:"Cross mount point (not really error)",77:"Trying to read unreadable message",79:"Inappropriate file type or format",80:"Given log. name not unique",81:"f.d. invalid for this operation",82:"Remote address changed",83:"Can\t access a needed shared lib",84:"Accessing a corrupted shared lib",85:".lib section in a.out corrupted",86:"Attempting to link in too many libs",87:"Attempting to exec a shared library",88:"Function not implemented",89:"No more files",90:"Directory not empty",91:"File or path name too long",92:"Too many symbolic links",95:"Operation not supported on transport endpoint",96:"Protocol family not supported",104:"Connection reset by peer",105:"No buffer space available",106:"Address family not supported by protocol family",107:"Protocol wrong type for socket",108:"Socket operation on non-socket",109:"Protocol not available",110:"Can't send after socket shutdown",111:"Connection refused",112:"Address already in use",113:"Connection aborted",114:"Network is unreachable",115:"Network interface is not configured",116:"Connection timed out",117:"Host is down",118:"Host is unreachable",119:"Connection already in progress",120:"Socket already connected",121:"Destination address required",122:"Message too long",123:"Unknown protocol",124:"Socket type not supported",125:"Address not available",126:"ENETRESET",127:"Socket is already connected",128:"Socket is not connected",129:"TOOMANYREFS",130:"EPROCLIM",131:"EUSERS",132:"EDQUOT",133:"ESTALE",134:"Not supported",135:"No medium (in tape drive)",136:"No such host or network path",137:"Filename exists with different case",138:"EILSEQ",139:"Value too large for defined data type",140:"Operation canceled",141:"State not recoverable",142:"Previous owner died",143:"Streams pipe error"};function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          for (var i = 0; i < msg.length; i++) {
            HEAP8[(((strerrbuf)+(i))|0)]=msg.charCodeAt(i)
          }
          HEAP8[(((strerrbuf)+(i))|0)]=0
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }
  Module["_strcpy"] = _strcpy;
  var ___dirent_struct_layout={__size__:1040,d_ino:0,d_name:4,d_off:1028,d_reclen:1032,d_type:1036};function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      // NOTE: This implementation tries to mimic glibc rather than strictly
      // following the POSIX standard.
      var mode = HEAP32[((varargs)>>2)];
      // Simplify flags.
      var accessMode = oflag & 3;
      var isWrite = accessMode != 0;
      var isRead = accessMode != 1;
      var isCreate = Boolean(oflag & 512);
      var isExistCheck = Boolean(oflag & 2048);
      var isTruncate = Boolean(oflag & 1024);
      var isAppend = Boolean(oflag & 8);
      // Verify path.
      var origPath = path;
      path = FS.analyzePath(Pointer_stringify(path));
      if (!path.parentExists) {
        ___setErrNo(path.error);
        return -1;
      }
      var target = path.object || null;
      var finalPath;
      // Verify the file exists, create if needed and allowed.
      if (target) {
        if (isCreate && isExistCheck) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          return -1;
        }
        if ((isWrite || isCreate || isTruncate) && target.isFolder) {
          ___setErrNo(ERRNO_CODES.EISDIR);
          return -1;
        }
        if (isRead && !target.read || isWrite && !target.write) {
          ___setErrNo(ERRNO_CODES.EACCES);
          return -1;
        }
        if (isTruncate && !target.isDevice) {
          target.contents = [];
        } else {
          if (!FS.forceLoadFile(target)) {
            ___setErrNo(ERRNO_CODES.EIO);
            return -1;
          }
        }
        finalPath = path.path;
      } else {
        if (!isCreate) {
          ___setErrNo(ERRNO_CODES.ENOENT);
          return -1;
        }
        if (!path.parentObject.write) {
          ___setErrNo(ERRNO_CODES.EACCES);
          return -1;
        }
        target = FS.createDataFile(path.parentObject, path.name, [],
                                   mode & 0x100, mode & 0x80);  // S_IRUSR, S_IWUSR.
        finalPath = path.parentPath + '/' + path.name;
      }
      // Actually create an open stream.
      var id;
      if (target.isFolder) {
        var entryBuffer = 0;
        if (___dirent_struct_layout) {
          entryBuffer = _malloc(___dirent_struct_layout.__size__);
        }
        var contents = [];
        for (var key in target.contents) contents.push(key);
        id = FS.createFileHandle({
          path: finalPath,
          object: target,
          // An index into contents. Special values: -2 is ".", -1 is "..".
          position: -2,
          isRead: true,
          isWrite: false,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: [],
          // Folder-specific properties:
          // Remember the contents at the time of opening in an array, so we can
          // seek between them relying on a single order.
          contents: contents,
          // Each stream has its own area for readdir() returns.
          currentEntry: entryBuffer
        });
      } else {
        id = FS.createFileHandle({
          path: finalPath,
          object: target,
          position: 0,
          isRead: isRead,
          isWrite: isWrite,
          isAppend: isAppend,
          error: false,
          eof: false,
          ungotten: []
        });
      }
      return id;
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 1024;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 8;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }
  function ___errno_location() {
      return ___errno_state;
    }var ___errno=___errno_location;
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      if (FS.streams[fildes]) {
        if (FS.streams[fildes].currentEntry) {
          _free(FS.streams[fildes].currentEntry);
        }
        FS.streams[fildes] = null;
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      if (FS.streams[fildes]) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }
  function _gettimeofday(ptr) {
      // %struct.timeval = type { i32, i32 }
      var now = Date.now();
      HEAP32[((ptr)>>2)]=Math.floor(now/1000); // seconds
      HEAP32[(((ptr)+(4))>>2)]=Math.floor((now-1000*Math.floor(now/1000))*1000); // microseconds
      return 0;
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      return _write(stream, s, _strlen(s));
    }
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }function _perror(s) {
      // void perror(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/perror.html
      var stdout = HEAP32[((_stdout)>>2)];
      if (s) {
        _fputs(s, stdout);
        _fputc(58, stdout);
        _fputc(32, stdout);
      }
      var errnum = HEAP32[((___errno_location())>>2)];
      _puts(_strerror(errnum));
    }
  function _pipe(fildes) {
      // int pipe(int fildes[2]);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/pipe.html
      // It is possible to implement this using two device streams, but pipes make
      // little sense in a single-threaded environment, so we do not support them.
      ___setErrNo(ERRNO_CODES.ENOSYS);
      return -1;
    }
  Module["_memmove"] = _memmove;var _llvm_memmove_p0i8_p0i8_i32=_memmove;
  function _recv(fd, buf, len, flags) {
      var info = FS.streams[fd];
      if (!info) return -1;
      if (!info.hasData()) {
        ___setErrNo(ERRNO_CODES.EAGAIN); // no data, and all sockets are nonblocking, so this is the right behavior
        return -1;
      }
      var buffer = info.inQueue.shift();
      if (len < buffer.length) {
        if (info.stream) {
          // This is tcp (reliable), so if not all was read, keep it
          info.inQueue.unshift(buffer.subarray(len));
        }
        buffer = buffer.subarray(0, len);
      }
      HEAPU8.set(buffer, buf);
      return buffer.length;
    }
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isRead) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var bytesRead = 0;
        while (stream.ungotten.length && nbyte > 0) {
          HEAP8[((buf++)|0)]=stream.ungotten.pop()
          nbyte--;
          bytesRead++;
        }
        var contents = stream.object.contents;
        var size = Math.min(contents.length - offset, nbyte);
        if (contents.subarray) { // typed array
          HEAPU8.set(contents.subarray(offset, offset+size), buf);
        } else
        if (contents.slice) { // normal array
          for (var i = 0; i < size; i++) {
            HEAP8[(((buf)+(i))|0)]=contents[offset + i]
          }
        } else {
          for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
            HEAP8[(((buf)+(i))|0)]=contents.get(offset + i)
          }
        }
        bytesRead += size;
        return bytesRead;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.streams[fildes];
      if (stream && ('socket' in stream)) {
        return _recv(fildes, buf, nbyte, 0);
      } else if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isRead) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var bytesRead;
        if (stream.object.isDevice) {
          if (stream.object.input) {
            bytesRead = 0;
            while (stream.ungotten.length && nbyte > 0) {
              HEAP8[((buf++)|0)]=stream.ungotten.pop()
              nbyte--;
              bytesRead++;
            }
            for (var i = 0; i < nbyte; i++) {
              try {
                var result = stream.object.input();
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
              if (result === undefined && bytesRead === 0) {
                ___setErrNo(ERRNO_CODES.EAGAIN);
                return -1;
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              HEAP8[(((buf)+(i))|0)]=result
            }
            return bytesRead;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var ungotSize = stream.ungotten.length;
          bytesRead = _pread(fildes, buf, nbyte, stream.position);
          if (bytesRead != -1) {
            stream.position += (stream.ungotten.length - ungotSize) + bytesRead;
          }
          return bytesRead;
        }
      }
    }
  var ___pollfd_struct_layout={__size__:8,fd:0,events:4,revents:6};function _poll(fds, nfds, timeout) {
      // int poll(struct pollfd fds[], nfds_t nfds, int timeout);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/poll.html
      // NOTE: This is pretty much a no-op mimicking glibc.
      var offsets = ___pollfd_struct_layout;
      var nonzero = 0;
      for (var i = 0; i < nfds; i++) {
        var pollfd = fds + ___pollfd_struct_layout.__size__ * i;
        var fd = HEAP32[(((pollfd)+(offsets.fd))>>2)];
        var events = HEAP16[(((pollfd)+(offsets.events))>>1)];
        var revents = 0;
        if (FS.streams[fd]) {
          var stream = FS.streams[fd];
          if (events & 1) revents |= 1;
          if (events & 2) revents |= 2;
        } else {
          if (events & 4) revents |= 4;
        }
        if (revents) nonzero++;
        HEAP16[(((pollfd)+(offsets.revents))>>1)]=revents
      }
      return nonzero;
    }
  function _usleep(useconds) {
      // int usleep(useconds_t useconds);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/usleep.html
      // We're single-threaded, so use a busy loop. Super-ugly.
      var msec = useconds / 1000;
      var start = Date.now();
      while (Date.now() - start < msec) {
        // Do nothing.
      }
      return 0;
    }
  var ___timespec_struct_layout={__size__:8,tv_sec:0,tv_nsec:4};function _nanosleep(rqtp, rmtp) {
      // int nanosleep(const struct timespec  *rqtp, struct timespec *rmtp);
      var seconds = HEAP32[(((rqtp)+(___timespec_struct_layout.tv_sec))>>2)];
      var nanoseconds = HEAP32[(((rqtp)+(___timespec_struct_layout.tv_nsec))>>2)];
      HEAP32[(((rmtp)+(___timespec_struct_layout.tv_sec))>>2)]=0
      HEAP32[(((rmtp)+(___timespec_struct_layout.tv_nsec))>>2)]=0
      return _usleep((seconds * 1e6) + (nanoseconds / 1000));
    }
  Module["_memcmp"] = _memcmp;
  function _qsort(base, num, size, cmp) {
      if (num == 0 || size == 0) return;
      // forward calls to the JavaScript sort method
      // first, sort the items logically
      var comparator = function(x, y) {
        return Runtime.dynCall('iii', cmp, [x, y]);
      }
      var keys = [];
      for (var i = 0; i < num; i++) keys.push(i);
      keys.sort(function(a, b) {
        return comparator(base+a*size, base+b*size);
      });
      // apply the sort
      var temp = _malloc(num*size);
      _memcpy(temp, base, num*size);
      for (var i = 0; i < num; i++) {
        if (keys[i] == i) continue; // already in place
        _memcpy(base+i*size, temp+keys[i]*size, size);
      }
      _free(temp);
    }
  function _iconv_open(toCode, fromCode) {
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
    }
  function _memchr(ptr, chr, num) {
      chr = unSign(chr);
      for (var i = 0; i < num; i++) {
        if (HEAP8[(ptr)] == chr) return ptr;
        ptr++;
      }
      return 0;
    }
  function _iconv(cd, inbuf, inbytesleft, outbuf, outbytesleft) {
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
    }
  function _iconv_close(cd) {
      var iconv = Module['iconvCache'];
      delete iconv[cd];
      Module['_free'](cd);
    }
  function _abort() {
      ABORT = true;
      throw 'abort() at ' + (new Error().stack);
    }
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 8: return PAGE_SIZE;
        case 54:
        case 56:
        case 21:
        case 61:
        case 63:
        case 22:
        case 67:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 69:
        case 28:
        case 101:
        case 70:
        case 71:
        case 29:
        case 30:
        case 199:
        case 75:
        case 76:
        case 32:
        case 43:
        case 44:
        case 80:
        case 46:
        case 47:
        case 45:
        case 48:
        case 49:
        case 42:
        case 82:
        case 33:
        case 7:
        case 108:
        case 109:
        case 107:
        case 112:
        case 119:
        case 121:
          return 200809;
        case 13:
        case 104:
        case 94:
        case 95:
        case 34:
        case 35:
        case 77:
        case 81:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 91:
        case 94:
        case 95:
        case 110:
        case 111:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 120:
        case 40:
        case 16:
        case 79:
        case 19:
          return -1;
        case 92:
        case 93:
        case 5:
        case 72:
        case 6:
        case 74:
        case 92:
        case 93:
        case 96:
        case 97:
        case 98:
        case 99:
        case 102:
        case 103:
        case 105:
          return 1;
        case 38:
        case 66:
        case 50:
        case 51:
        case 4:
          return 1024;
        case 15:
        case 64:
        case 41:
          return 32;
        case 55:
        case 37:
        case 17:
          return 2147483647;
        case 18:
        case 1:
          return 47839;
        case 59:
        case 57:
          return 99;
        case 68:
        case 58:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 14: return 32768;
        case 73: return 32767;
        case 39: return 16384;
        case 60: return 1000;
        case 106: return 700;
        case 52: return 256;
        case 62: return 255;
        case 2: return 100;
        case 65: return 64;
        case 36: return 20;
        case 100: return 16;
        case 20: return 6;
        case 53: return 4;
        case 10: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  var _llvm_memset_p0i8_i64=_memset;
  function _llvm_uadd_with_overflow_i32(x, y) {
      x = x>>>0;
      y = y>>>0;
      return ((asm["setTempRet0"](x+y > 4294967295),(x+y)>>>0)|0);
    }
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : console.log("warning: cannot create object URLs");
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        function getMimetype(name) {
          return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
          }[name.substr(name.lastIndexOf('.')+1)];
        }
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/.exec(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x = event.pageX - (window.scrollX + rect.left);
          var y = event.pageY - (window.scrollY + rect.top);
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);
var Math_min = Math.min;
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm = (function(global, env, buffer) {
  'use asm';
  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);
  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;
  var cttz_i8=env.cttz_i8|0;
  var ctlz_i8=env.ctlz_i8|0;
  var _stderr=env._stderr|0;
  var NaN=+env.NaN;
  var Infinity=+env.Infinity;
  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;
  var tempRet0 = 0;
  var tempRet1 = 0;
  var tempRet2 = 0;
  var tempRet3 = 0;
  var tempRet4 = 0;
  var tempRet5 = 0;
  var tempRet6 = 0;
  var tempRet7 = 0;
  var tempRet8 = 0;
  var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var abort=env.abort;
  var assert=env.assert;
  var asmPrintInt=env.asmPrintInt;
  var asmPrintFloat=env.asmPrintFloat;
  var Math_min=env.min;
  var invoke_vi=env.invoke_vi;
  var invoke_vii=env.invoke_vii;
  var invoke_ii=env.invoke_ii;
  var invoke_v=env.invoke_v;
  var invoke_iii=env.invoke_iii;
  var invoke_viiii=env.invoke_viiii;
  var _llvm_uadd_with_overflow_i32=env._llvm_uadd_with_overflow_i32;
  var _snprintf=env._snprintf;
  var _fclose=env._fclose;
  var _abort=env._abort;
  var _fprintf=env._fprintf;
  var _pread=env._pread;
  var _close=env._close;
  var _fopen=env._fopen;
  var __reallyNegative=env.__reallyNegative;
  var _usleep=env._usleep;
  var _fputc=env._fputc;
  var _iconv=env._iconv;
  var _poll=env._poll;
  var _js_get_width=env._js_get_width;
  var _open=env._open;
  var _js_read_image=env._js_read_image;
  var ___setErrNo=env.___setErrNo;
  var _fwrite=env._fwrite;
  var _nanosleep=env._nanosleep;
  var _qsort=env._qsort;
  var _send=env._send;
  var _write=env._write;
  var _fputs=env._fputs;
  var _sprintf=env._sprintf;
  var _strdup=env._strdup;
  var _recv=env._recv;
  var _read=env._read;
  var _iconv_open=env._iconv_open;
  var _time=env._time;
  var __formatString=env.__formatString;
  var _js_output_result=env._js_output_result;
  var _gettimeofday=env._gettimeofday;
  var _iconv_close=env._iconv_close;
  var _perror=env._perror;
  var ___assert_func=env.___assert_func;
  var _js_get_height=env._js_get_height;
  var _pwrite=env._pwrite;
  var _strstr=env._strstr;
  var _puts=env._puts;
  var _fsync=env._fsync;
  var _strerror_r=env._strerror_r;
  var ___errno_location=env.___errno_location;
  var _strerror=env._strerror;
  var _pipe=env._pipe;
  var _sbrk=env._sbrk;
  var _sysconf=env._sysconf;
  var _memchr=env._memchr;
// EMSCRIPTEN_START_FUNCS
function stackAlloc(size){size=size|0;var ret=0;ret=STACKTOP;STACKTOP=STACKTOP+size|0;STACKTOP=STACKTOP+7>>3<<3;return ret|0}function stackSave(){return STACKTOP|0}function stackRestore(top){top=top|0;STACKTOP=top}function setThrew(threw,value){threw=threw|0;value=value|0;if((__THREW__|0)==0){__THREW__=threw;threwValue=value}}function copyTempFloat(ptr){ptr=ptr|0;HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1|0]=HEAP8[ptr+1|0];HEAP8[tempDoublePtr+2|0]=HEAP8[ptr+2|0];HEAP8[tempDoublePtr+3|0]=HEAP8[ptr+3|0]}function copyTempDouble(ptr){ptr=ptr|0;HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1|0]=HEAP8[ptr+1|0];HEAP8[tempDoublePtr+2|0]=HEAP8[ptr+2|0];HEAP8[tempDoublePtr+3|0]=HEAP8[ptr+3|0];HEAP8[tempDoublePtr+4|0]=HEAP8[ptr+4|0];HEAP8[tempDoublePtr+5|0]=HEAP8[ptr+5|0];HEAP8[tempDoublePtr+6|0]=HEAP8[ptr+6|0];HEAP8[tempDoublePtr+7|0]=HEAP8[ptr+7|0]}function setTempRet0(value){value=value|0;tempRet0=value}function setTempRet1(value){value=value|0;tempRet1=value}function setTempRet2(value){value=value|0;tempRet2=value}function setTempRet3(value){value=value|0;tempRet3=value}function setTempRet4(value){value=value|0;tempRet4=value}function setTempRet5(value){value=value|0;tempRet5=value}function setTempRet6(value){value=value|0;tempRet6=value}function setTempRet7(value){value=value|0;tempRet7=value}function setTempRet8(value){value=value|0;tempRet8=value}function setTempRet9(value){value=value|0;tempRet9=value}function _zbar_image_get_format($img){$img=$img|0;return HEAP32[$img>>2]|0}function _zbar_image_get_width($img){$img=$img|0;return HEAP32[$img+4>>2]|0}function _zbar_image_get_height($img){$img=$img|0;return HEAP32[$img+8>>2]|0}function _zbar_image_get_data($img){$img=$img|0;return HEAP32[$img+12>>2]|0}function _zbar_image_set_format($img,$fmt){$img=$img|0;$fmt=$fmt|0;HEAP32[$img>>2]=$fmt;return}function _zbar_image_set_size($img,$w,$h){$img=$img|0;$w=$w|0;$h=$h|0;HEAP32[$img+4>>2]=$w;HEAP32[$img+8>>2]=$h;return}function _zbar_image_first_symbol($img){$img=$img|0;var $2=0,$8=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$img+48>>2]|0;if(($2|0)==0){$8=0;label=3;break}else{label=2;break};case 2:$8=HEAP32[$2+8>>2]|0;label=3;break;case 3:return $8|0}return 0}function __zbar_image_swap_symbols($a,$b){$a=$a|0;$b=$b|0;var $1=0,$2=0,$3=0;$1=$a+48|0;$2=HEAP32[$1>>2]|0;$3=$b+48|0;HEAP32[$1>>2]=HEAP32[$3>>2];HEAP32[$3>>2]=$2;return}function _err_init($err){$err=$err|0;HEAP32[$err>>2]=1381123450;HEAP32[$err+4>>2]=0;return}function _zbar_processor_error_spew($processor){$processor=$processor|0;__zbar_error_spew($processor,0)|0;return}function _zbar_image_create(){var $1=0,$2=0;$1=_calloc(1,52)|0;$2=$1;__zbar_image_refcnt($2,1);HEAP32[$1+36>>2]=-1;return $2|0}function __zbar_image_refcnt($img,$delta){$img=$img|0;$delta=$delta|0;var $7=0,label=0;label=1;while(1)switch(label|0){case 1:if((__zbar_refcnt($img+28|0,$delta)|0)==0&($delta|0)<1){label=2;break}else{label=6;break};case 2:$7=HEAP32[$img+24>>2]|0;if(($7|0)==0){label=4;break}else{label=3;break};case 3:FUNCTION_TABLE_vi[$7&63]($img);label=4;break;case 4:if((HEAP32[$img+32>>2]|0)==0){label=5;break}else{label=6;break};case 5:__zbar_image_free($img);label=6;break;case 6:return}}function __zbar_image_free($img){$img=$img|0;var $1=0,$2=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$img+48|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=3;break}else{label=2;break};case 2:_zbar_symbol_set_ref($2,-1);HEAP32[$1>>2]=0;label=3;break;case 3:_free($img);return}}function _zbar_image_destroy($img){$img=$img|0;__zbar_image_refcnt($img,-1);return}function _zbar_image_set_data($img,$data,$len,$cleanup){$img=$img|0;$data=$data|0;$len=$len|0;$cleanup=$cleanup|0;_zbar_image_free_data($img);HEAP32[$img+12>>2]=$data;HEAP32[$img+16>>2]=$len;HEAP32[$img+24>>2]=$cleanup;return}function __zbar_process_image($proc,$img){$proc=$proc|0;$img=$img|0;var $format=0,$2=0,$5=0,$15=0,$19=0,$20=0,$21=0,$22=0,$25=0,$28=0,$29=0,$33=0,$36=0,$40=0,$47=0,$sym_057=0,$49=0,$50=0,$54=0,$55=0,$56=0,$57=0,$58=0,$59=0,$65=0,$68=0,$73=0,$82=0,$83=0,$_056=0,$89=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$format=__stackBase__|0;$2=HEAP32[$proc+80>>2]|0;if(($img|0)==0){$_056=0;label=25;break}else{label=2;break};case 2:$5=$proc+100|0;if((HEAP32[$5>>2]|0)==0){label=4;break}else{label=3;break};case 3:_zbar_image_write(HEAP32[(HEAP32[$proc+48>>2]|0)+40>>2]|0,3040)|0;HEAP32[$5>>2]=0;label=4;break;case 4:$15=_zbar_image_get_format($img)|0;HEAP32[$format>>2]=$15;if((HEAP32[374]|0)>15){label=5;break}else{label=6;break};case 5:$19=HEAP32[_stderr>>2]|0;$20=_zbar_image_get_width($img)|0;$21=_zbar_image_get_height($img)|0;$22=_zbar_image_get_data($img)|0;_fprintf($19|0,6384,(tempInt=STACKTOP,STACKTOP=STACKTOP+48|0,HEAP32[tempInt>>2]=9920,HEAP32[tempInt+8>>2]=$format,HEAP32[tempInt+16>>2]=$15,HEAP32[tempInt+24>>2]=$20,HEAP32[tempInt+32>>2]=$21,HEAP32[tempInt+40>>2]=$22,tempInt)|0)|0;label=6;break;case 6:$25=_zbar_image_convert($img,808466521)|0;if(($25|0)==0){label=29;break}else{label=7;break};case 7:$28=$proc+168|0;$29=HEAP32[$28>>2]|0;if(($29|0)==0){label=9;break}else{label=8;break};case 8:_zbar_symbol_set_ref($29,-1);HEAP32[$28>>2]=0;label=9;break;case 9:$33=$proc+52|0;_zbar_image_scanner_recycle_image(HEAP32[$33>>2]|0,$img);$36=_zbar_scan_image(HEAP32[$33>>2]|0,$25)|0;__zbar_image_swap_symbols($img,$25);_zbar_image_destroy($25);if(($36|0)<0){label=29;break}else{label=10;break};case 10:$40=_zbar_image_scanner_get_results(HEAP32[$33>>2]|0)|0;HEAP32[$28>>2]=$40;if(($40|0)==0){label=12;break}else{label=11;break};case 11:_zbar_symbol_set_ref($40,1);label=12;break;case 12:if((HEAP32[374]|0)>7){label=13;break}else{label=19;break};case 13:$47=_zbar_image_first_symbol($img)|0;if(($47|0)==0){label=19;break}else{$sym_057=$47;label=14;break};case 14:$49=_zbar_symbol_get_type($sym_057)|0;$50=_zbar_symbol_get_count($sym_057)|0;if((HEAP32[374]|0)>7){label=15;break}else{label=18;break};case 15:$54=HEAP32[_stderr>>2]|0;$55=_zbar_get_symbol_name($49)|0;$56=_zbar_get_addon_name($49)|0;$57=_zbar_symbol_get_data($sym_057)|0;$58=_zbar_symbol_get_loc_size($sym_057)|0;$59=_zbar_symbol_get_quality($sym_057)|0;if(($50|0)<0){$65=3984;label=17;break}else{label=16;break};case 16:$65=($50|0)>0?3568:3032;label=17;break;case 17:_fprintf($54|0,4640,(tempInt=STACKTOP,STACKTOP=STACKTOP+56|0,HEAP32[tempInt>>2]=9920,HEAP32[tempInt+8>>2]=$55,HEAP32[tempInt+16>>2]=$56,HEAP32[tempInt+24>>2]=$57,HEAP32[tempInt+32>>2]=$58,HEAP32[tempInt+40>>2]=$59,HEAP32[tempInt+48>>2]=$65,tempInt)|0)|0;label=18;break;case 18:$68=_zbar_symbol_next($sym_057)|0;if(($68|0)==0){label=19;break}else{$sym_057=$68;label=14;break};case 19:if(($36|0)==0){label=22;break}else{label=20;break};case 20:__zbar_processor_notify($proc,2);$73=HEAP32[$proc+56>>2]|0;if(($73|0)==0){label=22;break}else{label=21;break};case 21:FUNCTION_TABLE_vii[$73&63]($img,HEAP32[$proc+40>>2]|0);label=22;break;case 22:if(($2|0)==0){$_056=$img;label=25;break}else{label=23;break};case 23:$82=HEAP32[$img+48>>2]|0;$83=_zbar_image_convert($img,$2)|0;if(($83|0)==0){label=29;break}else{label=24;break};case 24:HEAP32[$83+48>>2]=$82;_zbar_symbol_set_ref($82,1);$_056=$83;label=25;break;case 25:$89=HEAP32[$proc+48>>2]|0;if(($89|0)==0){label=27;break}else{label=26;break};case 26:_zbar_window_draw($89,$_056)|0;__zbar_processor_invalidate($proc)|0;label=27;break;case 27:if(($2|0)==0|($_056|0)==0){$_0=0;label=30;break}else{label=28;break};case 28:_zbar_image_destroy($_056);$_0=0;label=30;break;case 29:_err_capture($proc,-1,3,9920,2624);$_0=-1;label=30;break;case 30:STACKTOP=__stackBase__;return $_0|0}return 0}function _zbar_processor_create($threaded){$threaded=$threaded|0;var $1=0,$2=0,$6=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_calloc(1,200)|0;$2=$1;if(($1|0)==0){$_0=0;label=5;break}else{label=2;break};case 2:_err_init($1);$6=_zbar_image_scanner_create()|0;HEAP32[$1+52>>2]=$6;if(($6|0)==0){label=3;break}else{label=4;break};case 3:_free($1);$_0=0;label=5;break;case 4:HEAP32[$1+88>>2]=0;__zbar_processor_init($2)|0;$_0=$2;label=5;break;case 5:return $_0|0}return 0}function _main($argc,$argv){$argc=$argc|0;$argv=$argv|0;var $1=0,$9=0,$13=0,$14=0,$15=0,$16=0,$19=0,$sym_021=0,$21=0,$24=0,$25=0,$28=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_zbar_processor_create(0)|0;if(($1|0)==0){label=2;break}else{label=3;break};case 2:___assert_func(7896,33,9e3,7880);return 0;case 3:if((_zbar_processor_init($1,0,0)|0)==0){label=5;break}else{label=4;break};case 4:_zbar_processor_error_spew($1);$_0=1;label=14;break;case 5:$9=_zbar_image_create()|0;if(($9|0)==0){label=6;break}else{label=7;break};case 6:___assert_func(7896,40,9e3,5600);return 0;case 7:_zbar_image_set_format($9,808466521);$13=_js_get_width()|0;$14=_js_get_height()|0;_zbar_image_set_size($9,$13,$14);$15=Math_imul($14,$13)|0;$16=_malloc($15)|0;_zbar_image_set_data($9,$16,$15,20);_js_read_image($16|0,$15|0)|0;_zbar_process_image($1,$9)|0;$19=_zbar_image_first_symbol($9)|0;if(($19|0)==0){label=11;break}else{$sym_021=$19;label=8;break};case 8:$21=_zbar_symbol_get_type($sym_021)|0;if(($21|0)==1){label=10;break}else{label=9;break};case 9:$24=_zbar_get_symbol_name($21)|0;$25=_zbar_get_addon_name($21)|0;_js_output_result($24|0,$25|0,_zbar_symbol_get_data($sym_021)|0);label=10;break;case 10:$28=_zbar_symbol_next($sym_021)|0;if(($28|0)==0){label=11;break}else{$sym_021=$28;label=8;break};case 11:_zbar_image_destroy($9);if((_zbar_processor_is_visible($1)|0)==0){label=13;break}else{label=12;break};case 12:_zbar_processor_user_wait($1,-1)|0;label=13;break;case 13:_zbar_processor_destroy($1);$_0=0;label=14;break;case 14:return $_0|0}return 0}function __zbar_error_spew($container,$verbosity){$container=$container|0;$verbosity=$verbosity|0;var $6=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(3928,83,10040,6616);return 0;case 3:$6=HEAP32[_stderr>>2]|0;_fputs(__zbar_error_string($container,0)|0,$6|0)|0;return-(HEAP32[$container+16>>2]|0)|0}return 0}function __zbar_error_string($container,$verbosity){$container=$container|0;$verbosity=$verbosity|0;var $8=0,$sev_0=0,$17=0,$mod_0=0,$25=0,$_=0,$28=0,$29=0,$type_0=0,$35=0,$37=0,$39=0,$41=0,$42=0,$46=0,$47=0,$51=0,$52=0,$57=0,$63=0,$67=0,$81=0,$90=0,$92=0,$strlen=0,$_pn=0,$len_0=0,$len_1=0,$99=0,$101=0,$103=0,$104=0,$106=0,$109=0,$111=0,$116=0,$118=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+48|0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(3928,103,10016,6616);return 0;case 3:$8=HEAP32[$container+16>>2]|0;if(($8+2|0)>>>0<5){label=4;break}else{$sev_0=4608;label=5;break};case 4:$sev_0=HEAP32[16+($8+2<<2)>>2]|0;label=5;break;case 5:$17=HEAP32[$container+4>>2]|0;if($17>>>0<4){label=6;break}else{$mod_0=3944;label=7;break};case 6:$mod_0=HEAP32[192+($17<<2)>>2]|0;label=7;break;case 7:$25=HEAP32[$container+24>>2]|0;$_=($25|0)==0?3944:$25;$28=$container+20|0;$29=HEAP32[$28>>2]|0;if($29>>>0<12){label=8;break}else{$type_0=5584;label=9;break};case 8:$type_0=HEAP32[784+($29<<2)>>2]|0;label=9;break;case 9:$35=__stackBase__|0;_memcpy($35|0,1672,30)|0;$37=(_strlen($_|0)|0)+77|0;$39=$container+8|0;$41=_realloc(HEAP32[$39>>2]|0,$37)|0;HEAP32[$39>>2]=$41;$42=_sprintf($41|0,$35|0,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=$sev_0,HEAP32[tempInt+8>>2]=$mod_0,HEAP32[tempInt+16>>2]=$_,HEAP32[tempInt+24>>2]=$type_0,tempInt)|0)|0;if(($42|0)<1){$_0=3944;label=24;break}else{label=10;break};case 10:$46=$container+28|0;$47=HEAP32[$46>>2]|0;if(($47|0)==0){$len_1=$42;label=20;break}else{label=11;break};case 11:$51=(_strlen($47|0)|0)+$42|0;$52=$51+1|0;if((_strstr($47|0,4616)|0)==0){label=15;break}else{label=12;break};case 12:$57=$container+32|0;if((HEAP32[$57>>2]|0)==0){label=13;break}else{label=14;break};case 13:HEAP32[$57>>2]=_strdup(3560)|0;label=14;break;case 14:$63=HEAP32[$39>>2]|0;$67=_realloc($63,(_strlen(HEAP32[$57>>2]|0)|0)+$52|0)|0;HEAP32[$39>>2]=$67;$_pn=_sprintf($67+$42|0,HEAP32[$46>>2]|0,(tempInt=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempInt>>2]=HEAP32[$57>>2],tempInt)|0)|0;label=19;break;case 15:if((_strstr($47|0,3480)|0)==0){label=16;break}else{label=17;break};case 16:if((_strstr($47|0,3024)|0)==0){label=18;break}else{label=17;break};case 17:$81=_realloc(HEAP32[$39>>2]|0,$51+33|0)|0;HEAP32[$39>>2]=$81;$_pn=_sprintf($81+$42|0,HEAP32[$46>>2]|0,(tempInt=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempInt>>2]=HEAP32[$container+36>>2],tempInt)|0)|0;label=19;break;case 18:$90=_realloc(HEAP32[$39>>2]|0,$52)|0;HEAP32[$39>>2]=$90;$92=HEAP32[$46>>2]|0;$strlen=_strlen($92|0)|0;_memcpy($90+$42|0,$92|0,$strlen+1|0)|0;$_pn=$strlen;label=19;break;case 19:$len_0=$_pn+$42|0;if(($len_0|0)<1){$_0=3944;label=24;break}else{$len_1=$len_0;label=20;break};case 20:if((HEAP32[$28>>2]|0)==5){label=21;break}else{label=22;break};case 21:$99=__stackBase__+32|0;_memcpy($99|0,1656,11)|0;$101=$container+12|0;$103=_strerror(HEAP32[$101>>2]|0)|0;$104=HEAP32[$39>>2]|0;$106=(_strlen($99|0)|0)+$len_1|0;$109=_realloc($104,$106+(_strlen($103|0)|0)|0)|0;HEAP32[$39>>2]=$109;$111=HEAP32[$101>>2]|0;_sprintf($109+$len_1|0,$99|0,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=$103,HEAP32[tempInt+8>>2]=$111,tempInt)|0)|0;label=23;break;case 22:$116=_realloc(HEAP32[$39>>2]|0,$len_1+2|0)|0;HEAP32[$39>>2]=$116;$118=$116+$len_1|0;tempBigInt=10;HEAP8[$118]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$118+1|0]=tempBigInt&255;label=23;break;case 23:$_0=HEAP32[$39>>2]|0;label=24;break;case 24:STACKTOP=__stackBase__;return $_0|0}return 0}function _zbar_image_free_data($img){$img=$img|0;var $3=0,$12=0,$20=0,$21=0,$25=0,label=0;label=1;while(1)switch(label|0){case 1:if(($img|0)==0){label=12;break}else{label=2;break};case 2:$3=$img+32|0;if((HEAP32[$3>>2]|0)==0){label=6;break}else{label=3;break};case 3:if((HEAP32[$img+28>>2]|0)==0){label=4;break}else{label=5;break};case 4:___assert_func(4416,113,8768,7128);case 5:$12=_zbar_image_create()|0;_memcpy($12|0,$img|0,52)|0;FUNCTION_TABLE_vi[HEAP32[$12+24>>2]&63]($12);HEAP32[$img+24>>2]=0;HEAP32[$3>>2]=0;HEAP32[$img+36>>2]=-1;label=11;break;case 6:$20=$img+24|0;$21=HEAP32[$20>>2]|0;if(($21|0)==0){label=11;break}else{label=7;break};case 7:$25=HEAP32[$img+12>>2]|0;if(($25|0)==0){label=11;break}else{label=8;break};case 8:if(($21|0)==20){label=10;break}else{label=9;break};case 9:HEAP32[$20>>2]=20;FUNCTION_TABLE_vi[$21&63]($img);label=11;break;case 10:_free($25);label=11;break;case 11:HEAP32[$img+12>>2]=0;label=12;break;case 12:return}}function _zbar_image_write($img,$filebase){$img=$img|0;$filebase=$filebase|0;var $hdr=0,$2=0,$3=0,$5=0,$12=0,$n_0=0,$23=0,$26=0,$30=0,$34=0,$35=0,$49=0,$59=0,$64=0,$68=0,$69=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+16|0;label=1;while(1)switch(label|0){case 1:$hdr=__stackBase__|0;$2=(_strlen($filebase|0)|0)+16|0;$3=STACKTOP;STACKTOP=STACKTOP+$2|0;STACKTOP=STACKTOP+7>>3<<3;_strcpy($3|0,$filebase|0)|0;$5=$img|0;if((HEAP8[$img]|0)>31){label=2;break}else{label=3;break};case 2:$n_0=_snprintf($3|0,$2|0,4232,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=$filebase,HEAP32[tempInt+8>>2]=$img,tempInt)|0)|0;label=4;break;case 3:$12=HEAP32[$5>>2]|0;$n_0=_snprintf($3|0,$2|0,3760,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=$filebase,HEAP32[tempInt+8>>2]=$12,tempInt)|0)|0;label=4;break;case 4:if(($n_0|0)<($2|0)){label=6;break}else{label=5;break};case 5:___assert_func(4416,214,8744,3224);return 0;case 6:HEAP8[$3+$2|0]=0;if((HEAP32[374]|0)>0){label=7;break}else{label=8;break};case 7:$23=HEAP32[$5>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,2840,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=8744,HEAP32[tempInt+8>>2]=$img,HEAP32[tempInt+16>>2]=$23,HEAP32[tempInt+24>>2]=$3,tempInt)|0)|0;label=8;break;case 8:$26=_fopen($3|0,2488)|0;if(($26|0)==0){label=9;break}else{label=11;break};case 9:$30=HEAP32[(___errno_location()|0)>>2]|0;if((HEAP32[374]|0)>0){label=10;break}else{$_0=$30;label=17;break};case 10:$34=HEAP32[_stderr>>2]|0;$35=_strerror($30|0)|0;_fprintf($34|0,2072,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=8744,HEAP32[tempInt+8>>2]=$3,HEAP32[tempInt+16>>2]=$35,tempInt)|0)|0;$_0=$30;label=17;break;case 11:HEAP32[$hdr>>2]=1735223674;HEAP32[$hdr+4>>2]=HEAP32[$5>>2];HEAP16[$hdr+8>>1]=HEAP32[$img+4>>2]&65535;HEAP16[$hdr+10>>1]=HEAP32[$img+8>>2]&65535;$49=$img+16|0;HEAP32[$hdr+12>>2]=HEAP32[$49>>2];if((_fwrite($hdr|0,16,1,$26|0)|0)==1){label=12;break}else{label=13;break};case 12:$59=_fwrite(HEAP32[$img+12>>2]|0,1,HEAP32[$49>>2]|0,$26|0)|0;if(($59|0)==(HEAP32[$49>>2]|0)){label=16;break}else{label=13;break};case 13:$64=HEAP32[(___errno_location()|0)>>2]|0;if((HEAP32[374]|0)>0){label=14;break}else{label=15;break};case 14:$68=HEAP32[_stderr>>2]|0;$69=_strerror($64|0)|0;_fprintf($68|0,1752,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=8744,HEAP32[tempInt+8>>2]=$3,HEAP32[tempInt+16>>2]=$69,tempInt)|0)|0;label=15;break;case 15:_fclose($26|0)|0;$_0=$64;label=17;break;case 16:$_0=_fclose($26|0)|0;label=17;break;case 17:STACKTOP=__stackBase__;return $_0|0}return 0}function __zbar_refcnt($cnt,$delta){$cnt=$cnt|0;$delta=$delta|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(HEAP32[$cnt>>2]|0)+$delta|0;HEAP32[$cnt>>2]=$2;if(($2|0)>-1){label=3;break}else{label=2;break};case 2:___assert_func(7704|0,75,9680|0,7528|0);return 0;case 3:return $2|0}return 0}function _err_copy($dst_c,$src_c){$dst_c=$dst_c|0;$src_c=$src_c|0;var $37=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$dst_c>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(4624,127,9032,4512);case 3:if((HEAP32[$src_c>>2]|0)==1381123450){label=5;break}else{label=4;break};case 4:___assert_func(4624,128,9032,4440);case 5:HEAP32[$dst_c+12>>2]=HEAP32[$src_c+12>>2];HEAP32[$dst_c+16>>2]=HEAP32[$src_c+16>>2];HEAP32[$dst_c+20>>2]=HEAP32[$src_c+20>>2];HEAP32[$dst_c+24>>2]=HEAP32[$src_c+24>>2];HEAP32[$dst_c+28>>2]=HEAP32[$src_c+28>>2];$37=$src_c+32|0;HEAP32[$dst_c+32>>2]=HEAP32[$37>>2];HEAP32[$37>>2]=0;HEAP32[$dst_c+36>>2]=HEAP32[$src_c+36>>2];return}}function _err_capture($container,$sev,$type,$func,$detail){$container=$container|0;$sev=$sev|0;$type=$type|0;$func=$func|0;$detail=$detail|0;var label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(4624,148,9192,4576);case 3:if(($type|0)==5){label=4;break}else{label=5;break};case 4:HEAP32[$container+12>>2]=HEAP32[(___errno_location()|0)>>2];label=5;break;case 5:HEAP32[$container+16>>2]=$sev;HEAP32[$container+20>>2]=$type;HEAP32[$container+24>>2]=$func;HEAP32[$container+28>>2]=$detail;if((HEAP32[374]|0)>0){label=6;break}else{label=7;break};case 6:__zbar_error_spew($container,0)|0;label=7;break;case 7:return}}function _zbar_get_symbol_name($sym){$sym=$sym|0;var $1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$sym&255;if(($1|0)==9){label=2;break}else if(($1|0)==10){label=3;break}else if(($1|0)==12){label=4;break}else if(($1|0)==13){label=5;break}else if(($1|0)==14){label=6;break}else if(($1|0)==25){label=7;break}else if(($1|0)==39){label=8;break}else if(($1|0)==128){label=9;break}else if(($1|0)==57){label=10;break}else if(($1|0)==64){label=11;break}else if(($1|0)==8){$_0=1704;label=13;break}else{label=12;break};case 2:$_0=7640;label=13;break;case 3:$_0=5360;label=13;break;case 4:$_0=4408;label=13;break;case 5:$_0=3920;label=13;break;case 6:$_0=3472;label=13;break;case 7:$_0=3016;label=13;break;case 8:$_0=2616;label=13;break;case 9:$_0=2280;label=13;break;case 10:$_0=1912;label=13;break;case 11:$_0=7848;label=13;break;case 12:$_0=7632;label=13;break;case 13:return $_0|0}return 0}function _zbar_get_addon_name($sym){$sym=$sym|0;var $1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$sym&1792;if(($1|0)==1280){label=2;break}else if(($1|0)==512){$_0=7424;label=4;break}else{label=3;break};case 2:$_0=7120;label=4;break;case 3:$_0=6848;label=4;break;case 4:return $_0|0}return 0}function _zbar_symbol_get_type($sym){$sym=$sym|0;return HEAP32[$sym>>2]|0}function _zbar_symbol_get_data($sym){$sym=$sym|0;return HEAP32[$sym+12>>2]|0}function _zbar_symbol_get_count($sym){$sym=$sym|0;return HEAP32[$sym+44>>2]|0}function _zbar_symbol_get_quality($sym){$sym=$sym|0;return HEAP32[$sym+48>>2]|0}function _zbar_symbol_get_loc_size($sym){$sym=$sym|0;return HEAP32[$sym+20>>2]|0}function _zbar_symbol_next($sym){$sym=$sym|0;var $6=0,label=0;label=1;while(1)switch(label|0){case 1:if(($sym|0)==0){$6=0;label=3;break}else{label=2;break};case 2:$6=HEAP32[$sym+32>>2]|0;label=3;break;case 3:return $6|0}return 0}function _err_init178($err){$err=$err|0;HEAP32[$err>>2]=1381123450;HEAP32[$err+4>>2]=1;return}function _zbar_processor_init($proc,$dev,$enable_display){$proc=$proc|0;$dev=$dev|0;$enable_display=$enable_display|0;var $1=0,$7=0,$18=0,$22=0,$26=0,$27=0,$30=0,$36=0,$41=0,$56=0,$63=0,$78=0,$82=0,$100=0,$104=0,$_pr=0,$116=0,$135=0,$rc_1=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$1=$proc+44|0;if((HEAP32[$1>>2]|0)==0){label=3;break}else{label=2;break};case 2:_zbar_processor_set_active($proc,0)|0;label=3;break;case 3:$7=$proc+48|0;if((HEAP32[$7>>2]|0)==0){label=6;break}else{label=4;break};case 4:if((HEAP32[$proc+116>>2]|0)==0){label=5;break}else{label=6;break};case 5:__zbar_processor_close($proc)|0;label=6;break;case 6:__zbar_processor_lock($proc)|0;$18=HEAP32[$7>>2]|0;if(($18|0)==0){label=8;break}else{label=7;break};case 7:_zbar_window_destroy($18);HEAP32[$7>>2]=0;label=8;break;case 8:$22=HEAP32[$1>>2]|0;if(($22|0)==0){label=10;break}else{label=9;break};case 9:_zbar_video_destroy($22);HEAP32[$1>>2]=0;label=10;break;case 10:$26=($dev|0)!=0;$27=($enable_display|0)==0;if($27&($26^1)){$rc_1=0;label=48;break}else{label=11;break};case 11:if($27){label=14;break}else{label=12;break};case 12:$30=_zbar_window_create()|0;HEAP32[$7>>2]=$30;if(($30|0)==0){label=13;break}else{label=14;break};case 13:_err_capture($proc,-2,1,8672,7208);$rc_1=-1;label=48;break;case 14:if($26){label=15;break}else{label=26;break};case 15:$36=_zbar_video_create()|0;HEAP32[$1>>2]=$36;if(($36|0)==0){label=16;break}else{label=17;break};case 16:_err_capture($proc,-2,1,8672,6872);$rc_1=-1;label=48;break;case 17:$41=$proc+60|0;if((HEAP32[$41>>2]|0)==0){label=18;break}else{label=19;break};case 18:if((HEAP32[$proc+64>>2]|0)==0){label=20;break}else{label=19;break};case 19:_zbar_video_request_size(HEAP32[$1>>2]|0,HEAP32[$41>>2]|0,HEAP32[$proc+64>>2]|0)|0;label=20;break;case 20:$56=HEAP32[$proc+68>>2]|0;if(($56|0)==0){label=22;break}else{label=21;break};case 21:_zbar_video_request_interface(HEAP32[$1>>2]|0,$56)|0;label=22;break;case 22:$63=HEAP32[$proc+72>>2]|0;if(($63|0)==0){label=24;break}else{label=23;break};case 23:if((_zbar_video_request_iomode(HEAP32[$1>>2]|0,$63)|0)==0){label=24;break}else{label=25;break};case 24:if((_zbar_video_open(HEAP32[$1>>2]|0,$dev)|0)==0){label=26;break}else{label=25;break};case 25:_err_copy($proc,HEAP32[$1>>2]|0);$rc_1=-1;label=48;break;case 26:$78=$proc+88|0;if((HEAP32[$78>>2]|0)==0){label=34;break}else{label=27;break};case 27:$82=HEAP32[$1>>2]|0;if(($82|0)==0){label=30;break}else{label=28;break};case 28:if((_zbar_video_get_fd($82)|0)<0){label=29;break}else{label=30;break};case 29:_err_capture($proc,-1,5,8672,6672);$rc_1=-1;label=48;break;case 30:if((HEAP32[$78>>2]|0)==0){label=34;break}else{label=31;break};case 31:if((HEAP32[$7>>2]|0)==0){label=32;break}else{label=33;break};case 32:if((HEAP32[$1>>2]|0)==0){label=34;break}else{label=33;break};case 33:_err_capture($proc,-1,5,8672,6360);$rc_1=-1;label=48;break;case 34:if((HEAP32[$7>>2]|0)==0){label=36;break}else{label=35;break};case 35:_proc_open($proc);$rc_1=-1;label=48;break;case 36:$100=HEAP32[$1>>2]|0;if(($100|0)==0){$rc_1=0;label=48;break}else{label=37;break};case 37:$104=HEAP32[$proc+76>>2]|0;if(($104|0)==0){label=40;break}else{label=38;break};case 38:if((_zbar_video_init($100,$104)|0)==0){$rc_1=0;label=48;break}else{label=39;break};case 39:_err_copy($proc,HEAP32[$1>>2]|0);$rc_1=-1;label=48;break;case 40:$_pr=HEAP32[$1>>2]|0;if(($_pr|0)==0){$rc_1=0;label=48;break}else{label=41;break};case 41:$116=HEAP32[$7>>2]|0;if(($116|0)==0){label=44;break}else{label=42;break};case 42:if((_zbar_negotiate_format($_pr,$116)|0)==0){$rc_1=0;label=48;break}else{label=43;break};case 43:_fwrite(6112,83,1,HEAP32[_stderr>>2]|0)|0;label=44;break;case 44:if((_zbar_negotiate_format(HEAP32[$1>>2]|0,0)|0)==0){$rc_1=0;label=48;break}else{label=45;break};case 45:if((HEAP32[374]|0)>0){label=46;break}else{label=47;break};case 46:$135=(HEAP32[$1>>2]|0)!=0?5752:5608;_fprintf(HEAP32[_stderr>>2]|0,5928,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=8672,HEAP32[tempInt+8>>2]=$135,tempInt)|0)|0;label=47;break;case 47:_err_capture($proc,-1,3,8672,5384);$rc_1=-1;label=48;break;case 48:_proc_leave($proc);STACKTOP=__stackBase__;return $rc_1|0}return 0}function _zbar_processor_set_active($proc,$active){$proc=$proc|0;$active=$active|0;var $1=0,$10=0,$rc_0=0,$25=0,$rc_3=0,label=0;label=1;while(1)switch(label|0){case 1:_proc_enter($proc);$1=$proc+44|0;if((HEAP32[$1>>2]|0)==0){label=2;break}else{label=3;break};case 2:_err_capture($proc,-1,4,8640,4888);$rc_3=-1;label=11;break;case 3:_zbar_image_scanner_enable_cache(HEAP32[$proc+52>>2]|0,$active);$10=_zbar_video_enable(HEAP32[$1>>2]|0,$active)|0;if(($10|0)==0){label=4;break}else{label=5;break};case 4:HEAP32[$proc+96>>2]=$active;__zbar_processor_enable($proc)|0;$rc_0=0;label=6;break;case 5:_err_copy($proc,HEAP32[$1>>2]|0);$rc_0=$10;label=6;break;case 6:if((HEAP32[$proc+96>>2]|0)==0){label=7;break}else{label=9;break};case 7:$25=HEAP32[$proc+48>>2]|0;if(($25|0)==0){label=9;break}else{label=8;break};case 8:_zbar_window_draw($25,0)|0;__zbar_processor_invalidate($proc)|0;label=9;break;case 9:if((HEAP32[$proc+144>>2]|0)==0){$rc_3=$rc_0;label=11;break}else{label=10;break};case 10:__zbar_event_trigger($proc+152|0);$rc_3=$rc_0;label=11;break;case 11:_proc_leave($proc);return $rc_3|0}return 0}function _proc_open($proc){$proc=$proc|0;__zbar_processor_open($proc,0,0,0)|0;return}function _proc_leave($proc){$proc=$proc|0;__zbar_processor_unlock($proc,0)|0;return}function _proc_enter($proc){$proc=$proc|0;__zbar_processor_lock($proc)|0;return}function _zbar_processor_is_visible($proc){$proc=$proc|0;var $9=0,label=0;label=1;while(1)switch(label|0){case 1:_proc_enter($proc);if((HEAP32[$proc+48>>2]|0)==0){$9=0;label=3;break}else{label=2;break};case 2:$9=(HEAP32[$proc+92>>2]|0)!=0&1;label=3;break;case 3:_proc_leave($proc);return $9|0}return 0}function _zbar_processor_user_wait($proc,$timeout){$proc=$proc|0;$timeout=$timeout|0;var $1=0,$rc_0=0,$rc_2=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:_proc_enter($proc);$1=$proc+92|0;if((HEAP32[$1>>2]|0)==0){label=2;break}else{label=3;break};case 2:if((HEAP32[$proc+96>>2]|0)!=0|($timeout|0)>-1){label=3;break}else{$rc_0=-1;label=4;break};case 3:$rc_0=__zbar_processor_wait($proc,1,__zbar_timer_init(__stackBase__|0,$timeout)|0)|0;label=4;break;case 4:if((HEAP32[$1>>2]|0)==0){label=5;break}else{label=6;break};case 5:_err_capture($proc,1,10,8608,5088);$rc_2=-1;label=8;break;case 6:if(($rc_0|0)>0){label=7;break}else{$rc_2=$rc_0;label=8;break};case 7:$rc_2=HEAP32[$proc+84>>2]|0;label=8;break;case 8:_proc_leave($proc);STACKTOP=__stackBase__;return $rc_2|0}return 0}function __zbar_timer_init($timer,$delay){$timer=$timer|0;$delay=$delay|0;var $6=0,$8=0,$12=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($delay|0)<0){$_0=0;label=3;break}else{label=2;break};case 2:_gettimeofday($timer|0,0)|0;$6=$timer+4|0;$8=(HEAP32[$6>>2]|0)+((($delay|0)%1e3&-1)*1e3&-1)|0;HEAP32[$6>>2]=$8;$12=$timer|0;HEAP32[$12>>2]=(($8|0)/1e6&-1)+(($delay|0)/1e3&-1)+(HEAP32[$12>>2]|0);HEAP32[$6>>2]=(HEAP32[$6>>2]|0)%1e6&-1;$_0=$timer;label=3;break;case 3:return $_0|0}return 0}function _zbar_process_image($proc,$img){$proc=$proc|0;$img=$img|0;var $9=0,$11=0,$rc_1=0,label=0;label=1;while(1)switch(label|0){case 1:_proc_enter($proc);if(($img|0)==0){label=4;break}else{label=2;break};case 2:if((HEAP32[$proc+48>>2]|0)==0){label=4;break}else{label=3;break};case 3:__zbar_processor_set_size($proc,0,0)|0;$rc_1=-1;label=6;break;case 4:$9=$proc+52|0;_zbar_image_scanner_enable_cache(HEAP32[$9>>2]|0,0);$11=__zbar_process_image($proc,$img)|0;if((HEAP32[$proc+96>>2]|0)==0){$rc_1=$11;label=6;break}else{label=5;break};case 5:_zbar_image_scanner_enable_cache(HEAP32[$9>>2]|0,1);$rc_1=$11;label=6;break;case 6:_proc_leave($proc);return $rc_1|0}return 0}function __zbar_symbol_free($sym){$sym=$sym|0;var $1=0,$2=0,$7=0,$17=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$sym+36|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=3;break}else{label=2;break};case 2:_zbar_symbol_set_ref($2,-1);HEAP32[$1>>2]=0;label=3;break;case 3:$7=HEAP32[$sym+24>>2]|0;if(($7|0)==0){label=5;break}else{label=4;break};case 4:_free($7);label=5;break;case 5:if((HEAP32[$sym+4>>2]|0)==0){label=8;break}else{label=6;break};case 6:$17=HEAP32[$sym+12>>2]|0;if(($17|0)==0){label=8;break}else{label=7;break};case 7:_free($17);label=8;break;case 8:_free($sym);return}}function _zbar_symbol_set_ref($syms,$delta){$syms=$syms|0;$delta=$delta|0;var label=0;label=1;while(1)switch(label|0){case 1:if((__zbar_refcnt143($syms|0,$delta)|0)==0&($delta|0)<1){label=2;break}else{label=3;break};case 2:__zbar_symbol_set_free($syms);label=3;break;case 3:return}}function __zbar_symbol_refcnt($sym,$delta){$sym=$sym|0;$delta=$delta|0;var label=0;label=1;while(1)switch(label|0){case 1:if((__zbar_refcnt143($sym+28|0,$delta)|0)==0&($delta|0)<1){label=2;break}else{label=3;break};case 2:__zbar_symbol_free($sym);label=3;break;case 3:return}}function __zbar_symbol_set_create(){var $1=0;$1=_calloc(1,16)|0;__zbar_refcnt143($1,1)|0;return $1|0}function __zbar_symbol_set_free($syms){$syms=$syms|0;var $1=0,$2=0,$sym_06=0,$4=0,$5=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$syms+8|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=3;break}else{$sym_06=$2;label=2;break};case 2:$4=$sym_06+32|0;$5=HEAP32[$4>>2]|0;HEAP32[$4>>2]=0;__zbar_symbol_refcnt($sym_06,-1);if(($5|0)==0){label=3;break}else{$sym_06=$5;label=2;break};case 3:HEAP32[$1>>2]=0;_free($syms);return}}function _zbar_video_create(){var $1=0,$2=0,$10=0,$13=0,$16=0,$25=0,$_0=0,$35=0,$44=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_calloc(1,140)|0;$2=$1;if(($1|0)==0){$_0=0;label=7;break}else{label=2;break};case 2:_err_init178($1);HEAP32[$1+40>>2]=-1;HEAP32[$1+92>>2]=4;$10=_calloc(4,4)|0;$13=$1+96|0;HEAP32[$13>>2]=$10;if(($10|0)==0){label=3;break}else{label=4;break};case 3:_zbar_video_destroy($2);$_0=0;label=7;break;case 4:$16=_zbar_image_create()|0;HEAP32[HEAP32[$13>>2]>>2]=$16;if(($16|0)==0){label=5;break}else{label=6;break};case 5:_zbar_video_destroy($2);$_0=0;label=7;break;case 6:HEAP32[$16+28>>2]=0;HEAP32[$16+24>>2]=16;HEAP32[$16+36>>2]=0;HEAP32[$16+32>>2]=$2;$25=_zbar_image_create()|0;HEAP32[(HEAP32[$13>>2]|0)+4>>2]=$25;if(($25|0)==0){label=5;break}else{label=8;break};case 7:return $_0|0;case 8:HEAP32[$25+28>>2]=0;HEAP32[$25+24>>2]=16;HEAP32[$25+36>>2]=1;HEAP32[$25+32>>2]=$2;$35=_zbar_image_create()|0;HEAP32[(HEAP32[$13>>2]|0)+8>>2]=$35;if(($35|0)==0){label=5;break}else{label=9;break};case 9:HEAP32[$35+28>>2]=0;HEAP32[$35+24>>2]=16;HEAP32[$35+36>>2]=2;HEAP32[$35+32>>2]=$2;$44=_zbar_image_create()|0;HEAP32[(HEAP32[$13>>2]|0)+12>>2]=$44;if(($44|0)==0){label=5;break}else{label=10;break};case 10:HEAP32[$44+28>>2]=0;HEAP32[$44+24>>2]=16;HEAP32[$44+36>>2]=3;HEAP32[$44+32>>2]=$2;$_0=$2;label=7;break}return 0}function _zbar_processor_destroy($proc){$proc=$proc|0;var $2=0,$3=0,$24=0,$w_014=0,$27=0,label=0;label=1;while(1)switch(label|0){case 1:_zbar_processor_init($proc,0,0)|0;$2=$proc+52|0;$3=HEAP32[$2>>2]|0;if(($3|0)==0){label=3;break}else{label=2;break};case 2:_zbar_image_scanner_destroy($3);HEAP32[$2>>2]=0;label=3;break;case 3:__zbar_processor_cleanup($proc)|0;if((HEAP32[$proc+184>>2]|0)==0){label=5;break}else{label=4;break};case 4:___assert_func(1936,299,8696,1712);case 5:if((HEAP32[$proc+188>>2]|0)==0){label=7;break}else{label=6;break};case 6:___assert_func(1936,300,8696,7672);case 7:if((HEAP32[$proc+192>>2]|0)==0){label=9;break}else{label=8;break};case 8:___assert_func(1936,301,8696,7448);case 9:$24=HEAP32[$proc+196>>2]|0;if(($24|0)==0){label=11;break}else{$w_014=$24;label=10;break};case 10:$27=HEAP32[$w_014>>2]|0;__zbar_event_destroy($w_014+4|0);_free($w_014);if(($27|0)==0){label=11;break}else{$w_014=$27;label=10;break};case 11:_err_cleanup($proc|0);_free($proc);return}}function _err_cleanup($err){$err=$err|0;var $6=0,$7=0,$11=0,$12=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$err>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(4624,214,9080,4576);case 3:$6=$err+8|0;$7=HEAP32[$6>>2]|0;if(($7|0)==0){label=5;break}else{label=4;break};case 4:_free($7);HEAP32[$6>>2]=0;label=5;break;case 5:$11=$err+32|0;$12=HEAP32[$11>>2]|0;if(($12|0)==0){label=7;break}else{label=6;break};case 6:_free($12);HEAP32[$11>>2]=0;label=7;break;case 7:return}}function __zbar_refcnt143($cnt,$delta){$cnt=$cnt|0;$delta=$delta|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(HEAP32[$cnt>>2]|0)+$delta|0;HEAP32[$cnt>>2]=$2;if(($2|0)>-1){label=3;break}else{label=2;break};case 2:___assert_func(5712|0,75,9664|0,5576|0);return 0;case 3:return $2|0}return 0}function _err_init219($err){$err=$err|0;HEAP32[$err>>2]=1381123450;HEAP32[$err+4>>2]=2;return}function _zbar_video_destroy($vdo){$vdo=$vdo|0;var $7=0,$11=0,$18=0,$20=0,$21=0,$23=0,$26=0,$29=0,$32=0,$37=0,$49=0,$56=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$vdo+52>>2]|0)==0){label=3;break}else{label=2;break};case 2:_zbar_video_open($vdo,0)|0;label=3;break;case 3:$7=$vdo+100|0;if((HEAP32[$7>>2]|0)==0){label=7;break}else{label=4;break};case 4:$11=HEAP32[HEAP32[$7>>2]>>2]|0;if(($11|0)==0){label=6;break}else{label=5;break};case 5:_free($11);label=6;break;case 6:$18=HEAP32[(HEAP32[$7>>2]|0)+4>>2]|0;if(($18|0)==0){label=15;break}else{label=14;break};case 7:$20=$vdo+112|0;$21=HEAP32[$20>>2]|0;if(($21|0)==0){label=9;break}else{$23=$21;label=8;break};case 8:HEAP32[$20>>2]=HEAP32[$23+40>>2];$26=$23+12|0;_free(HEAP32[$26>>2]|0);HEAP32[$26>>2]=0;_free($23);$29=HEAP32[$20>>2]|0;if(($29|0)==0){label=9;break}else{$23=$29;label=8;break};case 9:$32=HEAP32[$vdo+84>>2]|0;if(($32|0)==0){label=11;break}else{label=10;break};case 10:_free($32);label=11;break;case 11:$37=HEAP32[$vdo+72>>2]|0;if(($37|0)==0){label=13;break}else{label=12;break};case 12:_free($37);label=13;break;case 13:_err_cleanup183($vdo|0);_free($vdo);return;case 14:_free($18);label=15;break;case 15:$49=HEAP32[(HEAP32[$7>>2]|0)+8>>2]|0;if(($49|0)==0){label=17;break}else{label=16;break};case 16:_free($49);label=17;break;case 17:$56=HEAP32[(HEAP32[$7>>2]|0)+12>>2]|0;if(($56|0)==0){label=19;break}else{label=18;break};case 18:_free($56);label=19;break;case 19:_free(HEAP32[$7>>2]|0);label=7;break}}function _zbar_video_open($vdo,$dev){$vdo=$vdo|0;$dev=$dev|0;var $2=0,$6=0,$7=0,$17=0,$23=0,$27=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:_zbar_video_enable($vdo,0)|0;$2=$vdo+52|0;if((HEAP32[$2>>2]|0)==0){label=7;break}else{label=2;break};case 2:$6=$vdo+124|0;$7=HEAP32[$6>>2]|0;if(($7|0)==0){label=4;break}else{label=3;break};case 3:FUNCTION_TABLE_ii[$7&63]($vdo)|0;HEAP32[$6>>2]=0;label=4;break;case 4:if((HEAP32[374]|0)>0){label=5;break}else{label=6;break};case 5:$17=HEAP32[$vdo+40>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6720,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=8488,HEAP32[tempInt+8>>2]=$17,tempInt)|0)|0;label=6;break;case 6:HEAP32[$2>>2]=0;label=7;break;case 7:if(($dev|0)==0){$_0=0;label=12;break}else{label=8;break};case 8:$23=HEAP8[$dev]|0;if(($23&255)<16){label=10;break}else{label=9;break};case 9:__zbar_video_open($vdo,0)|0;$_0=-1;label=12;break;case 10:$27=_strdup(7512)|0;HEAP8[$27+10|0]=$23+48&255;__zbar_video_open($vdo,0)|0;if(($27|0)==0){$_0=-1;label=12;break}else{label=11;break};case 11:_free($27);$_0=-1;label=12;break;case 12:STACKTOP=__stackBase__;return $_0|0}return 0}function _zbar_video_enable($vdo,$enable){$vdo=$vdo|0;$enable=$enable|0;var $3=0,$4=0,$9=0,$i_0=0,$49=0,$i1_031=0,$58=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$3=$vdo+60|0;$4=HEAP32[$3>>2]|0;if(($4>>>1&1|0)==($enable|0)){$_0=0;label=17;break}else{label=2;break};case 2:$9=($enable|0)!=0;if($9){label=3;break}else{label=12;break};case 3:if((HEAP32[$vdo+52>>2]|0)==0){label=4;break}else{label=5;break};case 4:_err_capture188($vdo,-1,4,8568,5280);$_0=-1;label=17;break;case 5:if(($4&1|0)==0){label=6;break}else{label=7;break};case 6:if((_zbar_negotiate_format($vdo,0)|0)==0){label=7;break}else{$_0=-1;label=17;break};case 7:HEAP32[$3>>2]=HEAP32[$3>>2]&-3|$enable<<1&2;if($9){label=8;break}else{label=13;break};case 8:$i_0=0;label=9;break;case 9:if(($i_0|0)<(HEAP32[$vdo+96>>2]|0)){label=10;break}else{label=11;break};case 10:if((FUNCTION_TABLE_iii[HEAP32[$vdo+136>>2]&63]($vdo,HEAP32[(HEAP32[$vdo+100>>2]|0)+($i_0<<2)>>2]|0)|0)==0){$i_0=$i_0+1|0;label=9;break}else{$_0=-1;label=17;break};case 11:$_0=FUNCTION_TABLE_ii[HEAP32[$vdo+128>>2]&63]($vdo)|0;label=17;break;case 12:HEAP32[$3>>2]=$4&-3|$enable<<1&2;label=13;break;case 13:$49=$vdo+96|0;if((HEAP32[$49>>2]|0)>0){label=14;break}else{label=16;break};case 14:$i1_031=0;label=15;break;case 15:HEAP32[(HEAP32[(HEAP32[$vdo+100>>2]|0)+($i1_031<<2)>>2]|0)+40>>2]=0;$58=$i1_031+1|0;if(($58|0)<(HEAP32[$49>>2]|0)){$i1_031=$58;label=15;break}else{label=16;break};case 16:HEAP32[$vdo+108>>2]=0;HEAP32[$vdo+104>>2]=0;$_0=FUNCTION_TABLE_ii[HEAP32[$vdo+132>>2]&63]($vdo)|0;label=17;break;case 17:return $_0|0}return 0}function _zbar_video_get_fd($vdo){$vdo=$vdo|0;var $2=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$vdo+52>>2]|0;if(($2|0)==0){label=2;break}else if(($2|0)==2){label=4;break}else{label=3;break};case 2:_err_capture188($vdo,-1,4,8544,5280);$_0=-1;label=5;break;case 3:_err_capture188($vdo,1,3,8544,4368);$_0=-1;label=5;break;case 4:$_0=HEAP32[$vdo+40>>2]|0;label=5;break;case 5:return $_0|0}return 0}function _zbar_video_request_size($vdo,$width,$height){$vdo=$vdo|0;$width=$width|0;$height=$height|0;var $_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:if((HEAP32[$vdo+60>>2]&1|0)==0){label=3;break}else{label=2;break};case 2:_err_capture188($vdo,-1,4,8400,3880);$_0=-1;label=5;break;case 3:HEAP32[$vdo+44>>2]=$width;HEAP32[$vdo+48>>2]=$height;if((HEAP32[374]|0)>0){label=4;break}else{$_0=0;label=5;break};case 4:_fprintf(HEAP32[_stderr>>2]|0,3376,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=8400,HEAP32[tempInt+8>>2]=$width,HEAP32[tempInt+16>>2]=$height,tempInt)|0)|0;$_0=0;label=5;break;case 5:STACKTOP=__stackBase__;return $_0|0}return 0}function _zbar_video_request_interface($vdo,$ver){$vdo=$vdo|0;$ver=$ver|0;var $1=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$1=$vdo+52|0;if((HEAP32[$1>>2]|0)==0){label=3;break}else{label=2;break};case 2:_err_capture188($vdo,-1,4,8456,2960);$_0=-1;label=5;break;case 3:HEAP32[$1>>2]=$ver;if((HEAP32[374]|0)>0){label=4;break}else{$_0=0;label=5;break};case 4:_fprintf(HEAP32[_stderr>>2]|0,2576,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=8456,HEAP32[tempInt+8>>2]=$ver,tempInt)|0)|0;$_0=0;label=5;break;case 5:STACKTOP=__stackBase__;return $_0|0}return 0}function _zbar_video_request_iomode($vdo,$iomode){$vdo=$vdo|0;$iomode=$iomode|0;var $_0=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$vdo+52>>2]|0)==0){label=3;break}else{label=2;break};case 2:_err_capture188($vdo,-1,4,8424,2232);$_0=-1;label=6;break;case 3:if($iomode>>>0>3){label=4;break}else{label=5;break};case 4:_err_capture188($vdo,-1,4,8424,1880);$_0=-1;label=6;break;case 5:HEAP32[$vdo+56>>2]=$iomode;$_0=0;label=6;break;case 6:return $_0|0}return 0}function _zbar_video_init($vdo,$fmt){$vdo=$vdo|0;$fmt=$fmt|0;var $2=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=$vdo+60|0;if((HEAP32[$2>>2]&1|0)==0){label=3;break}else{label=2;break};case 2:_err_capture188($vdo,-1,4,8528,7800);$_0=-1;label=6;break;case 3:if((FUNCTION_TABLE_iii[HEAP32[$vdo+120>>2]&63]($vdo,$fmt)|0)==0){label=4;break}else{$_0=-1;label=6;break};case 4:HEAP32[$vdo+64>>2]=$fmt;if((_video_init_images($vdo)|0)==0){label=5;break}else{$_0=-1;label=6;break};case 5:HEAP32[$2>>2]=HEAP32[$2>>2]|1;$_0=0;label=6;break;case 6:return $_0|0}return 0}function __zbar_image_refcnt201($img){$img=$img|0;__zbar_refcnt202($img+28|0)|0;return}function _zbar_window_create(){var $1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_calloc(1,148)|0;if(($1|0)==0){$_0=0;label=3;break}else{label=2;break};case 2:_err_init219($1);HEAP32[$1+44>>2]=1;$_0=$1;label=3;break;case 3:return $_0|0}return 0}function _zbar_window_destroy($w){$w=$w|0;_zbar_window_attach($w,0,0)|0;_err_cleanup222($w|0);_free($w);return}function _zbar_window_attach($w,$display,$drawable){$w=$w|0;$display=$display|0;$drawable=$drawable|0;var $2=0,$3=0,$9=0,$10=0,label=0;label=1;while(1)switch(label|0){case 1:_zbar_window_draw($w,0)|0;$2=$w+148|0;$3=HEAP32[$2>>2]|0;if(($3|0)==0){label=3;break}else{label=2;break};case 2:FUNCTION_TABLE_ii[$3&63]($w)|0;HEAP32[$2>>2]=0;HEAP32[$w+144>>2]=0;label=3;break;case 3:$9=$w+112|0;$10=HEAP32[$9>>2]|0;if(($10|0)==0){label=5;break}else{label=4;break};case 4:_free($10);HEAP32[$9>>2]=0;label=5;break;case 5:HEAP32[$w+108>>2]=0;HEAP32[$w+104>>2]=0;_memset($w+68|0,0,20);HEAP32[$w+64>>2]=32768;HEAP32[$w+60>>2]=32768;HEAP32[$w+92>>2]=1;HEAP32[$w+88>>2]=1;__zbar_window_attach($w,0,0)|0;return-1|0}return 0}function __zbar_video_recycle_image($img){$img=$img|0;var $2=0,$7=0,$13=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$img+32>>2]|0;if(($2|0)==0){label=2;break}else{label=3;break};case 2:___assert_func(7616,36,9528,6584);case 3:$7=HEAP32[$img+36>>2]|0;if(($7|0)>-1){label=5;break}else{label=4;break};case 4:___assert_func(7616,37,9528,4480);case 5:$13=(HEAP32[$2+100>>2]|0)+($7<<2)|0;if((HEAP32[$13>>2]|0)==($img|0)){label=7;break}else{label=6;break};case 6:HEAP32[$13>>2]=$img;label=7;break;case 7:if((HEAP32[$2+60>>2]&2|0)==0){label=9;break}else{label=8;break};case 8:FUNCTION_TABLE_iii[HEAP32[$2+136>>2]&63]($2,$img)|0;label=9;break;case 9:return}}function _err_cleanup183($err){$err=$err|0;var $6=0,$7=0,$11=0,$12=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$err>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(4856,214,9064,4688);case 3:$6=$err+8|0;$7=HEAP32[$6>>2]|0;if(($7|0)==0){label=5;break}else{label=4;break};case 4:_free($7);HEAP32[$6>>2]=0;label=5;break;case 5:$11=$err+32|0;$12=HEAP32[$11>>2]|0;if(($12|0)==0){label=7;break}else{label=6;break};case 6:_free($12);HEAP32[$11>>2]=0;label=7;break;case 7:return}}function _err_capture188($container,$sev,$type,$func,$detail){$container=$container|0;$sev=$sev|0;$type=$type|0;$func=$func|0;$detail=$detail|0;var label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(4856,148,9176,4688);case 3:if(($type|0)==5){label=4;break}else{label=5;break};case 4:HEAP32[$container+12>>2]=HEAP32[(___errno_location()|0)>>2];label=5;break;case 5:HEAP32[$container+16>>2]=$sev;HEAP32[$container+20>>2]=$type;HEAP32[$container+24>>2]=$func;HEAP32[$container+28>>2]=$detail;if((HEAP32[374]|0)>0){label=6;break}else{label=7;break};case 6:__zbar_error_spew($container,0)|0;label=7;break;case 7:return}}function _video_init_images($vdo){$vdo=$vdo|0;var $1=0,$2=0,$6=0,$10=0,$15=0,$17=0,$18=0,$19=0,$28=0,$31=0,$32=0,$34=0,$i_032=0,$45=0,$58=0,$68=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$1=$vdo+76|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=2;break}else{label=3;break};case 2:___assert_func(7616,231,8792,6072);return 0;case 3:$6=$vdo+56|0;if((HEAP32[$6>>2]|0)==2){label=10;break}else{label=4;break};case 4:$10=$vdo+84|0;if((HEAP32[$10>>2]|0)==0){label=6;break}else{label=5;break};case 5:___assert_func(7616,233,8792,5888);return 0;case 6:$15=$vdo+96|0;$17=Math_imul(HEAP32[$15>>2]|0,$2)|0;$18=$vdo+80|0;HEAP32[$18>>2]=$17;$19=_malloc($17)|0;HEAP32[$10>>2]=$19;if(($19|0)==0){label=7;break}else{label=8;break};case 7:_err_capture188($vdo,-2,1,8792,5672);$_0=-1;label=16;break;case 8:if((HEAP32[374]|0)>0){label=9;break}else{label=10;break};case 9:$28=HEAP32[$15>>2]|0;$31=(HEAP32[$6>>2]|0)==1?5352:5248;$32=HEAP32[$18>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,5528,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=8792,HEAP32[tempInt+8>>2]=$28,HEAP32[tempInt+16>>2]=$31,HEAP32[tempInt+24>>2]=$32,tempInt)|0)|0;label=10;break;case 10:$34=$vdo+96|0;if((HEAP32[$34>>2]|0)>0){label=11;break}else{$_0=0;label=16;break};case 11:$i_032=0;label=12;break;case 12:$45=HEAP32[(HEAP32[$vdo+100>>2]|0)+($i_032<<2)>>2]|0;HEAP32[$45>>2]=HEAP32[$vdo+64>>2];HEAP32[$45+4>>2]=HEAP32[$vdo+44>>2];HEAP32[$45+8>>2]=HEAP32[$vdo+48>>2];if((HEAP32[$6>>2]|0)==2){label=15;break}else{label=13;break};case 13:HEAP32[$45+16>>2]=HEAP32[$1>>2];$58=Math_imul(HEAP32[$1>>2]|0,$i_032)|0;HEAP32[$45+12>>2]=(HEAP32[$vdo+84>>2]|0)+$58;if((HEAP32[374]|0)>1){label=14;break}else{label=15;break};case 14:_fprintf(HEAP32[_stderr>>2]|0,5032,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=8792,HEAP32[tempInt+8>>2]=$i_032,HEAP32[tempInt+16>>2]=$58,tempInt)|0)|0;label=15;break;case 15:$68=$i_032+1|0;if(($68|0)<(HEAP32[$34>>2]|0)){$i_032=$68;label=12;break}else{$_0=0;label=16;break};case 16:STACKTOP=__stackBase__;return $_0|0}return 0}function _zbar_video_next_image($vdo){$vdo=$vdo|0;var $7=0,$8=0,$12=0,$20=0,$21=0,$26=0,$41=0,$img_0=0,$img_1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$vdo+60>>2]&2|0)==0){$_0=0;label=12;break}else{label=2;break};case 2:$7=$vdo+88|0;$8=HEAP32[$7>>2]|0;HEAP32[$7>>2]=$8+1;$12=FUNCTION_TABLE_ii[HEAP32[$vdo+140>>2]&63]($vdo)|0;if(($12|0)==0){$_0=0;label=12;break}else{label=3;break};case 3:HEAP32[$12+44>>2]=$8;if((HEAP32[$vdo+96>>2]|0)<2){label=4;break}else{label=10;break};case 4:$20=$vdo+112|0;$21=HEAP32[$20>>2]|0;if(($21|0)==0){label=6;break}else{label=5;break};case 5:HEAP32[$20>>2]=HEAP32[$21+40>>2];$img_0=$21;label=9;break;case 6:HEAP32[$20>>2]=0;$26=_zbar_image_create()|0;if(($26|0)==0){label=7;break}else{label=8;break};case 7:___assert_func(7616,359,8504,7416);return 0;case 8:HEAP32[$26+28>>2]=0;HEAP32[$26+32>>2]=$vdo;HEAP32[$26>>2]=HEAP32[$vdo+64>>2];HEAP32[$26+4>>2]=HEAP32[$vdo+44>>2];HEAP32[$26+8>>2]=HEAP32[$vdo+48>>2];$41=$vdo+76|0;HEAP32[$26+16>>2]=HEAP32[$41>>2];HEAP32[$26+12>>2]=_malloc(HEAP32[$41>>2]|0)|0;$img_0=$26;label=9;break;case 9:HEAP32[$img_0+24>>2]=10;HEAP32[$img_0+44>>2]=$8;_memcpy(HEAP32[$img_0+12>>2]|0,HEAP32[$12+12>>2]|0,HEAP32[$img_0+16>>2]|0)|0;__zbar_video_recycle_image($12);$img_1=$img_0;label=11;break;case 10:HEAP32[$12+24>>2]=16;$img_1=$12;label=11;break;case 11:__zbar_image_refcnt201($img_1);$_0=$img_1;label=12;break;case 12:return $_0|0}return 0}function __zbar_video_recycle_shadow($img){$img=$img|0;var $2=0,$11=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$img+32>>2]|0;if(($2|0)==0){label=2;break}else{label=3;break};case 2:___assert_func(7616,50,9496,6584);case 3:if((HEAP32[$img+36>>2]|0)==-1){label=5;break}else{label=4;break};case 4:___assert_func(7616,51,9496,6288);case 5:$11=$2+112|0;HEAP32[$img+40>>2]=HEAP32[$11>>2];HEAP32[$11>>2]=$img;return}}function __zbar_refcnt202($cnt){$cnt=$cnt|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(HEAP32[$cnt>>2]|0)+1|0;HEAP32[$cnt>>2]=$2;if(($2|0)>-1){label=3;break}else{label=2;break};case 2:___assert_func(7104|0,75,9648|0,6840|0);return 0;case 3:return $2|0}return 0}function _err_cleanup222($err){$err=$err|0;var $6=0,$7=0,$11=0,$12=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$err>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(2560,214,9048,2200);case 3:$6=$err+8|0;$7=HEAP32[$6>>2]|0;if(($7|0)==0){label=5;break}else{label=4;break};case 4:_free($7);HEAP32[$6>>2]=0;label=5;break;case 5:$11=$err+32|0;$12=HEAP32[$11>>2]|0;if(($12|0)==0){label=7;break}else{label=6;break};case 6:_free($12);HEAP32[$11>>2]=0;label=7;break;case 7:return}}function __zbar_processor_lock($proc){$proc=$proc|0;var $1=0,$2=0,$storemerge=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$proc+176|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=2;break}else{label=3;break};case 2:HEAP32[$proc+180>>2]=0;$storemerge=1;label=4;break;case 3:$storemerge=$2+1|0;label=4;break;case 4:HEAP32[$1>>2]=$storemerge;return 0}return 0}function _proc_waiter_dequeue($proc){$proc=$proc|0;var $0=0,$1=0,$waiter_024=0,$waiter_026=0,$prev_025=0,$waiter_0=0,$14=0,$15=0,$waiter_023=0,label=0;label=2;while(1)switch(label|0){case 2:$0=$proc+192|0;$1=HEAP32[$0>>2]|0;$waiter_024=HEAP32[(($1|0)==0?$proc+184|0:$1|0)>>2]|0;if(($waiter_024|0)==0){$waiter_023=0;label=11;break}else{$prev_025=$1;$waiter_026=$waiter_024;label=3;break};case 3:if((HEAP32[$waiter_026+16>>2]&3|0)==0){label=5;break}else{label=4;break};case 4:HEAP32[$0>>2]=$waiter_026;$waiter_0=HEAP32[$waiter_026>>2]|0;if(($waiter_0|0)==0){$waiter_023=0;label=11;break}else{$prev_025=$waiter_026;$waiter_026=$waiter_0;label=3;break};case 5:$14=$waiter_026|0;$15=HEAP32[$14>>2]|0;if(($prev_025|0)==0){label=7;break}else{label=6;break};case 6:HEAP32[$prev_025>>2]=$15;label=8;break;case 7:HEAP32[$proc+184>>2]=$15;label=8;break;case 8:if((HEAP32[$14>>2]|0)==0){label=9;break}else{label=10;break};case 9:HEAP32[$proc+188>>2]=$prev_025;label=10;break;case 10:HEAP32[$14>>2]=0;HEAP32[$proc+176>>2]=1;HEAP32[$proc+180>>2]=HEAP32[$waiter_026+12>>2];$waiter_023=$waiter_026;label=11;break;case 11:return $waiter_023|0}return 0}function _proc_waiter_release($proc,$waiter){$proc=$proc|0;$waiter=$waiter|0;var $3=0,label=0;label=1;while(1)switch(label|0){case 1:if(($waiter|0)==0){label=3;break}else{label=2;break};case 2:$3=$proc+196|0;HEAP32[$waiter>>2]=HEAP32[$3>>2];HEAP32[$3>>2]=$waiter;label=3;break;case 3:return}}function __zbar_event_init($event){$event=$event|0;HEAP32[$event>>2]=0;HEAP32[$event+4>>2]=-1;return 0}function __zbar_event_destroy($event){$event=$event|0;HEAP32[$event>>2]=-1;HEAP32[$event+4>>2]=-1;return}function _zbar_window_draw($w,$img){$w=$w|0;$img=$img|0;var $_0=0,$20=0,$21=0,label=0;label=1;while(1)switch(label|0){case 1:$_0=(HEAP32[$w+144>>2]|0)==0?0:$img;if(($_0|0)==0){label=5;break}else{label=2;break};case 2:__zbar_image_refcnt225($_0,1);if((HEAP32[$_0+4>>2]|0)==(HEAP32[$w+72>>2]|0)){label=3;break}else{label=4;break};case 3:if((HEAP32[$_0+8>>2]|0)==(HEAP32[$w+76>>2]|0)){label=5;break}else{label=4;break};case 4:HEAP32[$w+80>>2]=0;label=5;break;case 5:$20=$w+40|0;$21=HEAP32[$20>>2]|0;if(($21|0)==0){label=7;break}else{label=6;break};case 6:__zbar_image_refcnt225($21,-1);label=7;break;case 7:HEAP32[$20>>2]=$_0;return 0}return 0}function __zbar_image_refcnt225($img,$delta){$img=$img|0;$delta=$delta|0;var $7=0,label=0;label=1;while(1)switch(label|0){case 1:if((__zbar_refcnt230($img+28|0,$delta)|0)==0&($delta|0)<1){label=2;break}else{label=6;break};case 2:$7=HEAP32[$img+24>>2]|0;if(($7|0)==0){label=4;break}else{label=3;break};case 3:FUNCTION_TABLE_vi[$7&63]($img);label=4;break;case 4:if((HEAP32[$img+32>>2]|0)==0){label=5;break}else{label=6;break};case 5:__zbar_image_free($img);label=6;break;case 6:return}}function __zbar_processor_open($proc,$name,$w,$h){$proc=$proc|0;$name=$name|0;$w=$w|0;$h=$h|0;_null_error($proc,9816);return-1|0}function _null_error($m,$func){$m=$m|0;$func=$func|0;_err_capture247($m,$func);return}function __zbar_processor_close($proc){$proc=$proc|0;_null_error($proc,9896);return-1|0}function __zbar_processor_set_size($proc,$width,$height){$proc=$proc|0;$width=$width|0;$height=$height|0;_null_error($proc,9784);return-1|0}function __zbar_processor_invalidate($proc){$proc=$proc|0;_null_error($proc,9840);return-1|0}function __zbar_window_attach($w,$display,$win){$w=$w|0;$display=$display|0;$win=$win|0;_null_error254($w,9472);return-1|0}function _null_error254($m,$func){$m=$m|0;$func=$func|0;_err_capture271($m,$func);return}function __zbar_processor_notify($proc,$events){$proc=$proc|0;$events=$events|0;var $waiter_011=0,$waiter_012=0,$7=0,$waiter_0=0,$17=0,label=0;label=1;while(1)switch(label|0){case 1:HEAP32[$proc+192>>2]=0;$waiter_011=HEAP32[$proc+184>>2]|0;if(($waiter_011|0)==0){label=4;break}else{label=2;break};case 2:$waiter_012=$waiter_011;label=3;break;case 3:$7=$waiter_012+16|0;HEAP32[$7>>2]=HEAP32[$7>>2]&($events^-1)|$events&128;$waiter_0=HEAP32[$waiter_012>>2]|0;if(($waiter_0|0)==0){label=4;break}else{$waiter_012=$waiter_0;label=3;break};case 4:if((HEAP32[$proc+176>>2]|0)==0){label=5;break}else{label=7;break};case 5:$17=_proc_waiter_dequeue($proc)|0;if(($17|0)==0){label=7;break}else{label=6;break};case 6:__zbar_event_trigger($17+4|0);label=7;break;case 7:return}}function _proc_waiter_queue($proc){$proc=$proc|0;var $1=0,$2=0,$9=0,$waiter_0=0,$17=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$proc+196|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=3;break}else{label=2;break};case 2:HEAP32[$1>>2]=HEAP32[$2>>2];HEAP32[$2+16>>2]=0;$waiter_0=$2;label=4;break;case 3:$9=_calloc(1,20)|0;__zbar_event_init($9+4|0)|0;$waiter_0=$9;label=4;break;case 4:HEAP32[$waiter_0>>2]=0;HEAP32[$waiter_0+12>>2]=0;$17=$proc+184|0;if((HEAP32[$17>>2]|0)==0){label=6;break}else{label=5;break};case 5:HEAP32[HEAP32[$proc+188>>2]>>2]=$waiter_0;label=7;break;case 6:HEAP32[$17>>2]=$waiter_0;label=7;break;case 7:HEAP32[$proc+188>>2]=$waiter_0;return $waiter_0|0}return 0}function _proc_wait_unthreaded($proc,$waiter,$timeout){$proc=$proc|0;$waiter=$waiter|0;$timeout=$timeout|0;var $10=0,$rc_014=0,$20=0,$25=0,$27=0,$rc_1=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$proc+96>>2]|0)==0){$10=0;label=3;break}else{label=2;break};case 2:$10=(_zbar_video_get_fd(HEAP32[$proc+44>>2]|0)|0)<0;label=3;break;case 3:$rc_014=1;label=4;break;case 4:if((HEAP32[$waiter+16>>2]&3|0)==0){$rc_1=$rc_014;label=9;break}else{label=5;break};case 5:if($10){label=6;break}else{label=8;break};case 6:$20=_zbar_video_next_image(HEAP32[$proc+44>>2]|0)|0;if(($20|0)==0){$rc_1=-1;label=9;break}else{label=7;break};case 7:__zbar_process_image($proc,$20)|0;_zbar_image_destroy($20);label=8;break;case 8:$25=__zbar_timer_check($timeout)|0;$27=__zbar_processor_input_wait($proc,0,$10&$25>>>0>15?15:$25)|0;if(($27|0)>0){$rc_014=$27;label=4;break}else{$rc_1=$27;label=9;break};case 9:return $rc_1|0}return 0}function __zbar_timer_check($timer){$timer=$timer|0;var $now=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$now=__stackBase__|0;if(($timer|0)==0){$_0=-1;label=3;break}else{label=2;break};case 2:_gettimeofday($now|0,0)|0;$_0=(((HEAP32[$timer+4>>2]|0)-(HEAP32[$now+4>>2]|0)|0)/1e3&-1)+(((HEAP32[$timer>>2]|0)-(HEAP32[$now>>2]|0)|0)*1e3&-1)|0;label=3;break;case 3:STACKTOP=__stackBase__;return $_0|0}return 0}function __zbar_event_trigger($event){$event=$event|0;var $i=0,$2=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$i=__stackBase__|0;HEAP32[$event>>2]=1;$2=$event+4|0;if((HEAP32[$2>>2]|0)>-1){label=2;break}else{label=5;break};case 2:HEAP32[$i>>2]=0;if((_write(HEAP32[$2>>2]|0,$i|0,4)|0)<0){label=3;break}else{label=4;break};case 3:_perror(4472);label=4;break;case 4:HEAP32[$2>>2]=-1;label=5;break;case 5:STACKTOP=__stackBase__;return}}function __zbar_event_wait($event,$lock,$timeout){$event=$event|0;$lock=$lock|0;$timeout=$timeout|0;var $1=0,$7=0,$13=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$event|0;if((HEAP32[$1>>2]|0)==0){label=2;break}else{label=5;break};case 2:if(($timeout|0)==0){$_0=-1;label=6;break}else{label=3;break};case 3:$7=__zbar_timer_check307($timeout)|0;if(($7|0)==0){label=5;break}else{label=4;break};case 4:_proc_sleep($7);label=5;break;case 5:$13=(HEAP32[$1>>2]|0)==0&1;HEAP32[$1>>2]=0;$_0=$13;label=6;break;case 6:return $_0|0}return 0}function __zbar_timer_check307($timer){$timer=$timer|0;var $now=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$now=__stackBase__|0;if(($timer|0)==0){$_0=-1;label=3;break}else{label=2;break};case 2:_gettimeofday($now|0,0)|0;$_0=(((HEAP32[$timer+4>>2]|0)-(HEAP32[$now+4>>2]|0)|0)/1e3&-1)+(((HEAP32[$timer>>2]|0)-(HEAP32[$now>>2]|0)|0)*1e3&-1)|0;label=3;break;case 3:STACKTOP=__stackBase__;return $_0|0}return 0}function __zbar_processor_input_wait($proc,$event,$timeout){$proc=$proc|0;$event=$event|0;$timeout=$timeout|0;var $2=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$proc+200>>2]|0;if((HEAP32[$2+12>>2]|0)==0){label=5;break}else{label=2;break};case 2:if(($event|0)==0){label=4;break}else{label=3;break};case 3:HEAP32[$event+4>>2]=HEAP32[$2+28>>2];label=4;break;case 4:$_0=_proc_poll_inputs($proc,$timeout)|0;label=7;break;case 5:if(($timeout|0)==0){$_0=-1;label=7;break}else{label=6;break};case 6:_proc_sleep($timeout);$_0=1;label=7;break;case 7:return $_0|0}return 0}function __zbar_processor_init($proc){$proc=$proc|0;var $1=0,$3=0,$7=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_calloc(1,36)|0;$3=$proc+200|0;HEAP32[$3>>2]=$1;HEAP32[$1+28>>2]=-1;$7=$1+24|0;HEAP32[$7>>2]=-1;if((HEAP32[$proc+88>>2]|0)==0){$_0=0;label=5;break}else{label=2;break};case 2:if((_pipe($7|0)|0)==0){label=4;break}else{label=3;break};case 3:_err_capture312($proc);$_0=-1;label=5;break;case 4:_add_poll($proc,HEAP32[$7>>2]|0,32);_proc_cache_polling(HEAP32[$3>>2]|0);$_0=0;label=5;break;case 5:return $_0|0}return 0}function __zbar_refcnt230($cnt,$delta){$cnt=$cnt|0;$delta=$delta|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(HEAP32[$cnt>>2]|0)+$delta|0;HEAP32[$cnt>>2]=$2;if(($2|0)>-1){label=3;break}else{label=2;break};case 2:___assert_func(3360|0,75,9632|0,2952|0);return 0;case 3:return $2|0}return 0}function _err_capture247($container,$func){$container=$container|0;$func=$func|0;var label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(7392,148,9160,5176);case 3:HEAP32[$container+16>>2]=-1;HEAP32[$container+20>>2]=3;HEAP32[$container+24>>2]=$func;HEAP32[$container+28>>2]=4944;if((HEAP32[374]|0)>0){label=4;break}else{label=5;break};case 4:__zbar_error_spew($container,0)|0;label=5;break;case 5:return}}function _err_capture271($container,$func){$container=$container|0;$func=$func|0;var label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(7320,148,9144,5144);case 3:HEAP32[$container+16>>2]=-1;HEAP32[$container+20>>2]=3;HEAP32[$container+24>>2]=$func;HEAP32[$container+28>>2]=4792;if((HEAP32[374]|0)>0){label=4;break}else{label=5;break};case 4:__zbar_error_spew($container,0)|0;label=5;break;case 5:return}}function __zbar_processor_unlock($proc,$all){$proc=$proc|0;$all=$all|0;var $1=0,$2=0,$storemerge=0,$10=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$proc+176|0;$2=HEAP32[$1>>2]|0;if(($2|0)>0){label=3;break}else{label=2;break};case 2:___assert_func(4544|0,126,9760|0,7184|0);return 0;case 3:$storemerge=($all|0)==0?$2-1|0:0;HEAP32[$1>>2]=$storemerge;if(($storemerge|0)==0){label=4;break}else{label=6;break};case 4:$10=_proc_waiter_dequeue($proc)|0;if(($10|0)==0){label=6;break}else{label=5;break};case 5:__zbar_event_trigger($10+4|0);label=6;break;case 6:return 0}return 0}function __zbar_processor_wait($proc,$events,$timeout){$proc=$proc|0;$events=$events|0;$timeout=$timeout|0;var $1=0,$2=0,$3=0,$5=0,$7=0,$rc_0=0,$rc_1=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$proc+176|0;$2=HEAP32[$1>>2]|0;$3=_proc_waiter_queue($proc)|0;$5=$3+16|0;HEAP32[$5>>2]=$events&3;__zbar_processor_unlock($proc,1)|0;$7=$proc+88|0;if((HEAP32[$7>>2]|0)==0){label=3;break}else{label=2;break};case 2:$rc_0=__zbar_event_wait($3+4|0,0,$timeout)|0;label=4;break;case 3:$rc_0=_proc_wait_unthreaded($proc,$3,$timeout)|0;label=4;break;case 4:if(($rc_0|0)<1){label=6;break}else{label=5;break};case 5:if((HEAP32[$7>>2]|0)==0){label=6;break}else{label=10;break};case 6:HEAP32[$5>>2]=HEAP32[$5>>2]&128;HEAP32[$proc+192>>2]=0;if((HEAP32[$1>>2]|0)==0){label=7;break}else{label=9;break};case 7:if((_proc_waiter_dequeue($proc)|0)==($3|0)){label=10;break}else{label=8;break};case 8:___assert_func(4544,212,9736,5128);return 0;case 9:__zbar_event_wait($3+4|0,0,0)|0;label=10;break;case 10:if(($rc_0|0)>0){label=11;break}else{$rc_1=$rc_0;label=12;break};case 11:$rc_1=(HEAP32[$5>>2]&128|0)==0?$rc_0:-1;label=12;break;case 12:if((HEAP32[$1>>2]|0)==1){label=14;break}else{label=13;break};case 13:___assert_func(4544,220,9736,4272);return 0;case 14:HEAP32[$1>>2]=$2;_proc_waiter_release($proc,$3);return $rc_1|0}return 0}function _proc_sleep($timeout){$timeout=$timeout|0;var $sleepns=0,$tmpcast=0,$remns=0,$tmpcast1=0,$15$1=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$sleepns=__stackBase__|0;$tmpcast=$sleepns;$remns=STACKTOP;STACKTOP=STACKTOP+8|0;$tmpcast1=$remns;if(($timeout|0)>0){label=3;break}else{label=2;break};case 2:___assert_func(3824,33,8904,7048);case 3:HEAP32[$sleepns>>2]=($timeout|0)/1e3&-1;HEAP32[$tmpcast+4>>2]=(($timeout|0)%1e3&-1)*1e6&-1;if((_nanosleep($tmpcast|0,$tmpcast1|0)|0)==0){label=6;break}else{label=4;break};case 4:if((HEAP32[(___errno_location()|0)>>2]|0)==4){label=5;break}else{label=6;break};case 5:$15$1=HEAP32[$remns+4>>2]|0;HEAP32[$sleepns>>2]=HEAP32[$remns>>2];HEAP32[$sleepns+4>>2]=$15$1;if((_nanosleep($tmpcast|0,$tmpcast1|0)|0)==0){label=6;break}else{label=4;break};case 6:STACKTOP=__stackBase__;return}}function _proc_poll_inputs($proc,$timeout){$proc=$proc|0;$timeout=$timeout|0;var $2=0,$4=0,$9=0,$10=0,$14=0,$16=0,$rc_0_ph=0,$i_0_in_ph=0,$i_0_in=0,$i_0=0,$31=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$proc+200>>2]|0;$4=HEAP32[$2+32>>2]|0;if(($4|0)==0){label=3;break}else{label=2;break};case 2:FUNCTION_TABLE_iii[$4&63]($proc,-1)|0;label=3;break;case 3:$9=$2+12|0;$10=HEAP32[$9>>2]|0;if(($10|0)==0){label=4;break}else{label=5;break};case 4:___assert_func(3824,240,8920,7608);return 0;case 5:$14=$2+16|0;$16=_poll(HEAP32[$14>>2]|0,$10|0,$timeout|0)|0;if(($16|0)<1){$_0=$16;label=15;break}else{label=6;break};case 6:$i_0_in_ph=HEAP32[$9>>2]|0;$rc_0_ph=$16;label=7;break;case 7:$i_0_in=$i_0_in_ph;label=8;break;case 8:$i_0=$i_0_in-1|0;if(($i_0_in|0)>0){label=9;break}else{label=13;break};case 9:if((HEAP16[(HEAP32[$14>>2]|0)+($i_0<<3)+6>>1]|0)==0){$i_0_in=$i_0;label=8;break}else{label=10;break};case 10:$31=HEAP32[(HEAP32[$2+20>>2]|0)+($i_0<<2)>>2]|0;if(($31|0)==0){label=12;break}else{label=11;break};case 11:FUNCTION_TABLE_iii[$31&63]($proc,$i_0)|0;label=12;break;case 12:HEAP16[(HEAP32[$14>>2]|0)+($i_0<<3)+6>>1]=0;$i_0_in_ph=$i_0;$rc_0_ph=$rc_0_ph-1|0;label=7;break;case 13:if(($rc_0_ph|0)==0){$_0=1;label=15;break}else{label=14;break};case 14:___assert_func(3824,253,8920,7408);return 0;case 15:return $_0|0}return 0}function _err_capture312($container){$container=$container|0;var label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(1864,148,9128,7768);case 3:HEAP32[$container+12>>2]=HEAP32[(___errno_location()|0)>>2];HEAP32[$container+16>>2]=-2;HEAP32[$container+20>>2]=5;HEAP32[$container+24>>2]=9872;HEAP32[$container+28>>2]=7160;if((HEAP32[374]|0)>0){label=4;break}else{label=5;break};case 4:__zbar_error_spew($container,0)|0;label=5;break;case 5:return}}function _add_poll($proc,$fd,$handler){$proc=$proc|0;$fd=$fd|0;$handler=$handler|0;var $i=0,$2=0,$4=0,$5=0,$14=0,$17=0,$25=0,$33=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$i=__stackBase__|0;$2=HEAP32[$proc+200>>2]|0;$4=$2|0;$5=HEAP32[$4>>2]|0;HEAP32[$4>>2]=$5+1;HEAP32[$i>>2]=$5;if((HEAP32[374]|0)>4){label=2;break}else{label=3;break};case 2:_fprintf(HEAP32[_stderr>>2]|0,2920,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=9456,HEAP32[tempInt+8>>2]=$5,HEAP32[tempInt+16>>2]=$fd,HEAP32[tempInt+24>>2]=$handler,tempInt)|0)|0;label=3;break;case 3:_alloc_polls($2|0);$14=$2+4|0;$17=(HEAP32[$14>>2]|0)+(HEAP32[$i>>2]<<3)|0;HEAP32[$17>>2]=0;HEAP32[$17+4>>2]=0;HEAP32[(HEAP32[$14>>2]|0)+(HEAP32[$i>>2]<<3)>>2]=$fd;HEAP16[(HEAP32[$14>>2]|0)+(HEAP32[$i>>2]<<3)+4>>1]=1;$25=$2+8|0;HEAP32[(HEAP32[$25>>2]|0)+(HEAP32[$i>>2]<<2)>>2]=$handler;if((HEAP32[$proc+116>>2]|0)==0){label=7;break}else{label=4;break};case 4:$33=HEAP32[$2+28>>2]|0;if(($33|0)>-1){label=6;break}else{label=5;break};case 5:___assert_func(2536,85,9456,2176);case 6:_write($33|0,$i|0,4)|0;STACKTOP=__stackBase__;return;case 7:if((HEAP32[$proc+88>>2]|0)==0){label=8;break}else{label=9;break};case 8:HEAP32[$2+12>>2]=HEAP32[$4>>2];HEAP32[$2+16>>2]=HEAP32[$14>>2];HEAP32[$2+20>>2]=HEAP32[$25>>2];label=9;break;case 9:STACKTOP=__stackBase__;return}}function __zbar_format_lookup($fmt){$fmt=$fmt|0;var $i_08=0,$2=0,$4=0,$i_0_be=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$i_08=0;label=2;break;case 2:$2=408+($i_08*12&-1)|0;$4=HEAP32[$2>>2]|0;if(($4|0)==($fmt|0)){$_0=$2;label=4;break}else{label=3;break};case 3:$i_0_be=($i_08<<1|1)+($4>>>0<$fmt>>>0&1)|0;if(($i_0_be|0)<31){$i_08=$i_0_be;label=2;break}else{$_0=0;label=4;break};case 4:return $_0|0}return 0}function _has_format($fmt,$fmts){$fmt=$fmt|0;$fmts=$fmts|0;var $_0=0,$2=0,$_05=0,label=0;label=1;while(1)switch(label|0){case 1:$_0=$fmts;label=2;break;case 2:$2=HEAP32[$_0>>2]|0;if(($2|0)==0){$_05=0;label=4;break}else{label=3;break};case 3:if(($2|0)==($fmt|0)){$_05=1;label=4;break}else{$_0=$_0+4|0;label=2;break};case 4:return $_05|0}return 0}function _proc_cache_polling($state){$state=$state|0;var $2=0,$3=0,$7=0,$10=0,$11=0,$14=0,$17=0,$18=0;$2=HEAP32[$state>>2]|0;$3=$state+12|0;HEAP32[$3>>2]=$2;_alloc_polls($3);$7=HEAP32[$state+16>>2]|0;$10=HEAP32[$state+4>>2]|0;$11=$2<<3;_memcpy($7|0,$10|0,$11)|0;$14=HEAP32[$state+20>>2]|0;$17=HEAP32[$state+8>>2]|0;$18=$2<<2;_memcpy($14|0,$17|0,$18)|0;return}function __zbar_processor_cleanup($proc){$proc=$proc|0;var $1=0,$2=0,$3=0,$7=0,$10=0,$14=0,$15=0,$24=0,$25=0,$34=0,$35=0,$40=0,$41=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$proc+200|0;$2=HEAP32[$1>>2]|0;$3=$proc+88|0;if((HEAP32[$3>>2]|0)==0){label=3;break}else{label=2;break};case 2:$7=$2+24|0;_close(HEAP32[$7>>2]|0)|0;$10=$2+28|0;_close(HEAP32[$10>>2]|0)|0;HEAP32[$10>>2]=-1;HEAP32[$7>>2]=-1;label=3;break;case 3:$14=$2+4|0;$15=HEAP32[$14>>2]|0;if(($15|0)==0){label=6;break}else{label=4;break};case 4:_free($15);HEAP32[$14>>2]=0;if((HEAP32[$3>>2]|0)==0){label=5;break}else{label=6;break};case 5:HEAP32[$2+16>>2]=0;label=6;break;case 6:$24=$2+8|0;$25=HEAP32[$24>>2]|0;if(($25|0)==0){label=9;break}else{label=7;break};case 7:_free($25);HEAP32[$24>>2]=0;if((HEAP32[$3>>2]|0)==0){label=8;break}else{label=9;break};case 8:HEAP32[$2+20>>2]=0;label=9;break;case 9:$34=$2+16|0;$35=HEAP32[$34>>2]|0;if(($35|0)==0){label=11;break}else{label=10;break};case 10:_free($35);HEAP32[$34>>2]=0;label=11;break;case 11:$40=$2+20|0;$41=HEAP32[$40>>2]|0;if(($41|0)==0){label=13;break}else{label=12;break};case 12:_free($41);HEAP32[$40>>2]=0;label=13;break;case 13:_free(HEAP32[$1>>2]|0);HEAP32[$1>>2]=0;return 0}return 0}function __zbar_processor_enable($proc){$proc=$proc|0;var $3=0,label=0;label=1;while(1)switch(label|0){case 1:$3=_zbar_video_get_fd(HEAP32[$proc+44>>2]|0)|0;if(($3|0)<0){label=5;break}else{label=2;break};case 2:if((HEAP32[$proc+96>>2]|0)==0){label=4;break}else{label=3;break};case 3:_add_poll($proc,$3,40);label=5;break;case 4:_remove_poll($proc,$3);label=5;break;case 5:return 0}return 0}function _proc_video_handler($proc,$i){$proc=$proc|0;$i=$i|0;var $8=0,label=0;label=1;while(1)switch(label|0){case 1:__zbar_processor_lock($proc)|0;if((HEAP32[$proc+96>>2]|0)==0){label=3;break}else{label=2;break};case 2:$8=_zbar_video_next_image(HEAP32[$proc+44>>2]|0)|0;if(($8|0)==0){label=3;break}else{label=4;break};case 3:__zbar_processor_unlock($proc,0)|0;label=5;break;case 4:__zbar_process_image($proc,$8)|0;__zbar_processor_unlock($proc,0)|0;_zbar_image_destroy($8);label=5;break;case 5:return 0}return 0}function _remove_poll($proc,$fd){$proc=$proc|0;$fd=$fd|0;var $i=0,$2=0,$4=0,$storemerge_in=0,$storemerge=0,$19=0,$20=0,$23=0,$26=0,$27=0,$31=0,$33=0,$39=0,$41=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$i=__stackBase__|0;$2=HEAP32[$proc+200>>2]|0;$4=$2|0;$storemerge_in=HEAP32[$4>>2]|0;label=2;break;case 2:$storemerge=$storemerge_in-1|0;if(($storemerge_in|0)>0){label=3;break}else{label=4;break};case 3:if((HEAP32[(HEAP32[$2+4>>2]|0)+($storemerge<<3)>>2]|0)==($fd|0)){label=4;break}else{$storemerge_in=$storemerge;label=2;break};case 4:HEAP32[$i>>2]=$storemerge;if((HEAP32[374]|0)>4){label=5;break}else{$23=$storemerge;label=6;break};case 5:$19=HEAP32[$i>>2]|0;$20=HEAP32[$4>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,5064,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=8840,HEAP32[tempInt+8>>2]=$19,HEAP32[tempInt+16>>2]=$fd,HEAP32[tempInt+24>>2]=$20,tempInt)|0)|0;$23=HEAP32[$i>>2]|0;label=6;break;case 6:if(($23|0)>-1){label=7;break}else{label=10;break};case 7:$26=$23+1|0;$27=HEAP32[$4>>2]|0;if(($26|0)<($27|0)){label=8;break}else{label=9;break};case 8:$31=$27-$23-1|0;$33=HEAP32[$2+4>>2]|0;_memmove($33+($23<<3)|0,$33+($26<<3)|0,$31<<3|0);$39=HEAP32[$i>>2]|0;$41=HEAP32[$2+8>>2]|0;_memmove($41+($39<<2)|0,$41+($39+1<<2)|0,$31|0);label=9;break;case 9:HEAP32[$4>>2]=(HEAP32[$4>>2]|0)-1;_alloc_polls($2|0);HEAP32[$i>>2]=0;label=10;break;case 10:if((HEAP32[$proc+116>>2]|0)==0){label=12;break}else{label=11;break};case 11:_write(HEAP32[$2+28>>2]|0,$i|0,4)|0;STACKTOP=__stackBase__;return;case 12:if((HEAP32[$proc+88>>2]|0)==0){label=13;break}else{label=14;break};case 13:HEAP32[$2+12>>2]=HEAP32[$4>>2];HEAP32[$2+16>>2]=HEAP32[$2+4>>2];HEAP32[$2+20>>2]=HEAP32[$2+8>>2];label=14;break;case 14:STACKTOP=__stackBase__;return}}function _alloc_polls($p){$p=$p|0;var $1=0,$4=0,$9=0;$1=$p+4|0;$4=$p|0;HEAP32[$1>>2]=_realloc(HEAP32[$1>>2]|0,HEAP32[$4>>2]<<3)|0;$9=$p+8|0;HEAP32[$9>>2]=_realloc(HEAP32[$9>>2]|0,HEAP32[$4>>2]<<2)|0;return}function __zbar_video_open($vdo,$device){$vdo=$vdo|0;$device=$device|0;_null_error323($vdo);return-1|0}function _null_error323($m){$m=$m|0;_err_capture324($m);return}function _zbar_image_convert_resize($src,$fmt,$width,$height){$src=$src|0;$fmt=$fmt|0;$width=$width|0;$height=$height|0;var $1=0,$2=0,$5=0,$19=0,$21=0,$25=0,$27=0,$49=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_zbar_image_create()|0;$2=$1|0;HEAP32[$2>>2]=$fmt;HEAP32[$1+4>>2]=$width;HEAP32[$1+8>>2]=$height;$5=$src|0;if((HEAP32[$5>>2]|0)==($fmt|0)){label=2;break}else{label=5;break};case 2:if((HEAP32[$src+4>>2]|0)==($width|0)){label=3;break}else{label=5;break};case 3:if((HEAP32[$src+8>>2]|0)==($height|0)){label=4;break}else{label=5;break};case 4:_convert_copy($1,0,$src,0);$_0=$1;label=13;break;case 5:$19=__zbar_format_lookup(HEAP32[$5>>2]|0)|0;$21=__zbar_format_lookup(HEAP32[$2>>2]|0)|0;if(($19|0)==0|($21|0)==0){$_0=0;label=13;break}else{label=6;break};case 6:$25=$19+4|0;$27=$21+4|0;if((HEAP32[$25>>2]|0)==(HEAP32[$27>>2]|0)){label=7;break}else{label=11;break};case 7:if((HEAP32[$19+8>>2]|0)==(HEAP32[$21+8>>2]|0)){label=8;break}else{label=11;break};case 8:if((HEAP32[$src+4>>2]|0)==($width|0)){label=9;break}else{label=11;break};case 9:if((HEAP32[$src+8>>2]|0)==($height|0)){label=10;break}else{label=11;break};case 10:_convert_copy($1,0,$src,0);$_0=$1;label=13;break;case 11:$49=HEAP32[880+((HEAP32[$25>>2]|0)*48&-1)+(HEAP32[$27>>2]<<3)+4>>2]|0;HEAP32[$1+24>>2]=20;FUNCTION_TABLE_viiii[$49&63]($1,$21,$src,$19);if((HEAP32[$1+12>>2]|0)==0){label=12;break}else{$_0=$1;label=13;break};case 12:_zbar_image_destroy($1);$_0=0;label=13;break;case 13:return $_0|0}return 0}function _convert_copy($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $3=0,label=0;label=1;while(1)switch(label|0){case 1:$3=$dst+4|0;if((HEAP32[$src+4>>2]|0)==(HEAP32[$3>>2]|0)){label=2;break}else{label=4;break};case 2:if((HEAP32[$src+8>>2]|0)==(HEAP32[$dst+8>>2]|0)){label=3;break}else{label=4;break};case 3:HEAP32[$dst+12>>2]=HEAP32[$src+12>>2];HEAP32[$dst+16>>2]=HEAP32[$src+16>>2];HEAP32[$dst+24>>2]=8;HEAP32[$dst+40>>2]=$src;__zbar_image_refcnt365($src,1);label=5;break;case 4:_convert_y_resize($dst,$src,Math_imul(HEAP32[$dst+8>>2]|0,HEAP32[$3>>2]|0)|0);label=5;break;case 5:return}}function _zbar_image_convert($src,$fmt){$src=$src|0;$fmt=$fmt|0;return _zbar_image_convert_resize($src,$fmt,HEAP32[$src+4>>2]|0,HEAP32[$src+8>>2]|0)|0}function __zbar_best_format($src,$dst,$dsts){$src=$src|0;$dst=$dst|0;$dsts=$dsts|0;var $1=0,$2=0,$7=0,$20=0,$28=0,$30=0,$33=0,$min_cost_028=0,$_02526=0,$34=0,$38=0,$cost_0=0,$56=0,$or_cond_not=0,$min_cost_1=0,$62=0,$63=0,$min_cost_0_lcssa=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$1=__stackBase__|0;HEAP32[$1>>2]=$src;$2=($dst|0)!=0;if($2){label=2;break}else{label=3;break};case 2:HEAP32[$dst>>2]=0;label=3;break;case 3:if(($dsts|0)==0){$_0=-1;label=25;break}else{label=4;break};case 4:$7=HEAP32[$1>>2]|0;if((_has_format($7,$dsts)|0)==0){label=9;break}else{label=5;break};case 5:if((HEAP32[374]|0)>7){label=6;break}else{label=7;break};case 6:_fprintf(HEAP32[_stderr>>2]|0,4296,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=10112,HEAP32[tempInt+8>>2]=$1,tempInt)|0)|0;label=7;break;case 7:if($2){label=8;break}else{$_0=0;label=25;break};case 8:HEAP32[$dst>>2]=HEAP32[$1>>2];$_0=0;label=25;break;case 9:$20=__zbar_format_lookup($7)|0;if(($20|0)==0){$_0=-1;label=25;break}else{label=10;break};case 10:if((HEAP32[374]|0)>7){label=11;break}else{label=12;break};case 11:_fprintf(HEAP32[_stderr>>2]|0,7064,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=10112,HEAP32[tempInt+8>>2]=$1,HEAP32[tempInt+16>>2]=$7,tempInt)|0)|0;label=12;break;case 12:$28=HEAP32[$dsts>>2]|0;if(($28|0)==0){$min_cost_0_lcssa=-1;label=23;break}else{label=13;break};case 13:$30=$20+4|0;$_02526=$dsts;$min_cost_028=-1;$33=$28;label=14;break;case 14:$34=__zbar_format_lookup($33)|0;if(($34|0)==0){$min_cost_1=$min_cost_028;label=22;break}else{label=15;break};case 15:$38=$34+4|0;if((HEAP32[$30>>2]|0)==(HEAP32[$38>>2]|0)){label=16;break}else{label=17;break};case 16:if((HEAP32[$20+8>>2]|0)==(HEAP32[$34+8>>2]|0)){$cost_0=0;label=18;break}else{label=17;break};case 17:$cost_0=HEAP32[880+((HEAP32[$30>>2]|0)*48&-1)+(HEAP32[$38>>2]<<3)>>2]|0;label=18;break;case 18:if((HEAP32[374]|0)>7){label=19;break}else{label=20;break};case 19:$56=HEAP32[$_02526>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,4984,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=$_02526,HEAP32[tempInt+8>>2]=$56,HEAP32[tempInt+16>>2]=$cost_0,tempInt)|0)|0;label=20;break;case 20:$or_cond_not=$min_cost_028>>>0<=$cost_0>>>0|($cost_0|0)<0;if($or_cond_not|$2^1){$min_cost_1=$or_cond_not?$min_cost_028:$cost_0;label=22;break}else{label=21;break};case 21:HEAP32[$dst>>2]=HEAP32[$_02526>>2];$min_cost_1=$cost_0;label=22;break;case 22:$62=$_02526+4|0;$63=HEAP32[$62>>2]|0;if(($63|0)==0){$min_cost_0_lcssa=$min_cost_1;label=23;break}else{$_02526=$62;$min_cost_028=$min_cost_1;$33=$63;label=14;break};case 23:if((HEAP32[374]|0)>7){label=24;break}else{$_0=$min_cost_0_lcssa;label=25;break};case 24:_fputc(10,HEAP32[_stderr>>2]|0)|0;$_0=$min_cost_0_lcssa;label=25;break;case 25:STACKTOP=__stackBase__;return $_0|0}return 0}function _zbar_negotiate_format($vdo,$win){$vdo=$vdo|0;$win=$win|0;var $min_fmt=0,$win_fmt=0,$1=0,$4=0,$7=0,$28=0,$33=0,$35=0,$fmt_040=0,$min_cost_039=0,$40=0,$43=0,$47=0,$52=0,$53=0,$58=0,$min_cost_1=0,$61=0,$62=0,$65=0,$min_cost_2=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+16|0;label=1;while(1)switch(label|0){case 1:$min_fmt=__stackBase__|0;$win_fmt=__stackBase__+8|0;$1=($vdo|0)!=0;if(($win|0)==0&($1^1)){$_0=0;label=30;break}else{label=2;break};case 2:$4=($win|0)!=0;$7=$1?$vdo|0:$win|0;if((_verify_format_sort()|0)==0){label=4;break}else{label=3;break};case 3:_err_capture364($7,-2,2,3776);$_0=-1;label=30;break;case 4:if($1){label=5;break}else{label=6;break};case 5:if((HEAP32[$vdo+72>>2]|0)==0){label=8;break}else{label=6;break};case 6:if($4){label=7;break}else{label=9;break};case 7:if((HEAP32[$win+112>>2]|0)==0){label=8;break}else{label=9;break};case 8:_err_capture364($7,-1,3,3232);$_0=-1;label=30;break;case 9:if($1){label=10;break}else{$28=8;label=11;break};case 10:$28=HEAP32[$vdo+72>>2]|0;label=11;break;case 11:if($4){label=12;break}else{$33=8;label=13;break};case 12:$33=HEAP32[$win+112>>2]|0;label=13;break;case 13:HEAP32[$min_fmt>>2]=0;$min_cost_039=-1;$fmt_040=1504;$35=1345466932;label=14;break;case 14:if((_has_format($35,$28)|0)==0){$min_cost_1=$min_cost_039;label=22;break}else{label=15;break};case 15:HEAP32[$win_fmt>>2]=0;$40=__zbar_best_format(HEAP32[$fmt_040>>2]|0,$win_fmt,$33)|0;$43=(HEAP32[374]|0)>3;if(($40|0)<0){label=16;break}else{label=18;break};case 16:if($43){label=17;break}else{$min_cost_1=$min_cost_039;label=22;break};case 17:$47=HEAP32[$fmt_040>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,2880,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=8720,HEAP32[tempInt+8>>2]=$fmt_040,HEAP32[tempInt+16>>2]=$47,tempInt)|0)|0;$min_cost_1=$min_cost_039;label=22;break;case 18:if($43){label=19;break}else{label=20;break};case 19:$52=HEAP32[$fmt_040>>2]|0;$53=HEAP32[$win_fmt>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,2496,(tempInt=STACKTOP,STACKTOP=STACKTOP+48|0,HEAP32[tempInt>>2]=8720,HEAP32[tempInt+8>>2]=$fmt_040,HEAP32[tempInt+16>>2]=$52,HEAP32[tempInt+24>>2]=$win_fmt,HEAP32[tempInt+32>>2]=$53,HEAP32[tempInt+40>>2]=$40,tempInt)|0)|0;label=20;break;case 20:if($min_cost_039>>>0>$40>>>0){label=21;break}else{$min_cost_1=$min_cost_039;label=22;break};case 21:$58=HEAP32[$fmt_040>>2]|0;HEAP32[$min_fmt>>2]=$58;if(($40|0)==0){$min_cost_2=0;$65=$58;label=24;break}else{$min_cost_1=$40;label=22;break};case 22:$61=$fmt_040+4|0;$62=HEAP32[$61>>2]|0;if(($62|0)==0){label=23;break}else{$min_cost_039=$min_cost_1;$fmt_040=$61;$35=$62;label=14;break};case 23:$min_cost_2=$min_cost_1;$65=HEAP32[$min_fmt>>2]|0;label=24;break;case 24:if(($65|0)==0){label=25;break}else{label=26;break};case 25:_err_capture364($7,-1,3,2136);$_0=-1;label=30;break;case 26:if($1){label=27;break}else{$_0=0;label=30;break};case 27:if((HEAP32[374]|0)>1){label=28;break}else{label=29;break};case 28:_fprintf(HEAP32[_stderr>>2]|0,1816,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=8720,HEAP32[tempInt+8>>2]=$min_fmt,HEAP32[tempInt+16>>2]=$65,HEAP32[tempInt+24>>2]=$min_cost_2,tempInt)|0)|0;label=29;break;case 29:$_0=_zbar_video_init($vdo,HEAP32[$min_fmt>>2]|0)|0;label=30;break;case 30:STACKTOP=__stackBase__;return $_0|0}return 0}function _verify_format_sort(){var $i_010=0,$3=0,$12=0,$21=0,$i_0_lcssa=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$i_010=0;label=2;break;case 2:$3=$i_010<<1|1;if(($3|0)<31){label=3;break}else{label=4;break};case 3:if((HEAP32[408+($i_010*12&-1)>>2]|0)>>>0<(HEAP32[408+($3*12&-1)>>2]|0)>>>0){label=8;break}else{label=4;break};case 4:$12=$3+1|0;if(($12|0)<31){label=5;break}else{label=6;break};case 5:if((HEAP32[408+($12*12&-1)>>2]|0)>>>0<(HEAP32[408+($i_010*12&-1)>>2]|0)>>>0){$i_0_lcssa=$i_010;label=7;break}else{label=6;break};case 6:$21=$i_010+1|0;if(($21|0)<31){$i_010=$21;label=2;break}else{$i_0_lcssa=$21;label=7;break};case 7:if(($i_0_lcssa|0)==31){$_0=0;label=9;break}else{label=8;break};case 8:_fwrite(7e3,41,1,HEAP32[_stderr>>2]|0)|0;$_0=-1;label=9;break;case 9:return $_0|0}return 0}function _proc_kick_handler($proc,$i){$proc=$proc|0;$i=$i|0;var $1=0,$2=0,$8=0,$14=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$1=$proc+200|0;$2=HEAP32[$1>>2]|0;if((HEAP32[374]|0)>4){label=2;break}else{label=3;break};case 2:$8=HEAP32[$2>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,4248,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=8944,HEAP32[tempInt+8>>2]=$8,tempInt)|0)|0;label=3;break;case 3:$14=_read(HEAP32[$2+24>>2]|0,__stackBase__|0,8)|0;if((HEAP32[$proc+88>>2]|0)==0){label=4;break}else{label=5;break};case 4:___assert_func(3824,225,8944,3272);return 0;case 5:_proc_cache_polling(HEAP32[$1>>2]|0);STACKTOP=__stackBase__;return $14|0}return 0}function _err_capture324($container){$container=$container|0;var label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(7088,148,9112,5e3);case 3:HEAP32[$container+16>>2]=-1;HEAP32[$container+20>>2]=3;HEAP32[$container+24>>2]=9560;HEAP32[$container+28>>2]=4328;if((HEAP32[374]|0)>0){label=4;break}else{label=5;break};case 4:__zbar_error_spew($container,0)|0;label=5;break;case 5:return}}function _err_capture364($container,$sev,$type,$detail){$container=$container|0;$sev=$sev|0;$type=$type|0;$detail=$detail|0;var label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$container>>2]|0)==1381123450){label=3;break}else{label=2;break};case 2:___assert_func(7752,148,9096,7576);case 3:if(($type|0)==5){label=4;break}else{label=5;break};case 4:HEAP32[$container+12>>2]=HEAP32[(___errno_location()|0)>>2];label=5;break;case 5:HEAP32[$container+16>>2]=$sev;HEAP32[$container+20>>2]=$type;HEAP32[$container+24>>2]=8720;HEAP32[$container+28>>2]=$detail;if((HEAP32[374]|0)>0){label=6;break}else{label=7;break};case 6:__zbar_error_spew($container,0)|0;label=7;break;case 7:return}}function _convert_uvp_resample($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $5=0,$7=0,$8=0,$10=0,$11=0,label=0;label=1;while(1)switch(label|0){case 1:_uv_roundup($dst,$dstfmt);$5=Math_imul(HEAP32[$dst+8>>2]|0,HEAP32[$dst+4>>2]|0)|0;$7=(_uvp_size($dst,$dstfmt)|0)<<1;$8=$7+$5|0;HEAP32[$dst+16>>2]=$8;$10=_malloc($8)|0;$11=$dst+12|0;HEAP32[$11>>2]=$10;if(($10|0)==0){label=4;break}else{label=2;break};case 2:_convert_y_resize($dst,$src,$5);if(($7|0)==0){label=4;break}else{label=3;break};case 3:_memset((HEAP32[$11>>2]|0)+$5|0,-128|0,$7|0);label=4;break;case 4:return}}function _convert_yuv_unpack($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $1=0,$3=0,$5=0,$7=0,$8=0,$10=0,$11=0,$18=0,$20=0,$21=0,$22=0,$y1_055=0,$y0_054=0,$y_053=0,$dsty_052=0,$srcp_151=0,$srcp_3_ph=0,$51=0,$52=0,$53=0,$y1_144=0,$y0_143=0,$x_042=0,$dsty_141=0,$srcp_340=0,$srcp_4=0,$y0_2=0,$y1_2=0,$61=0,$62=0,$65=0,$66=0,$_lcssa39=0,$_lcssa=0,$y1_1_lcssa=0,$y0_1_lcssa=0,$x_0_lcssa=0,$dsty_1_lcssa=0,$srcp_3_lcssa=0,$srcp_5=0,$72=0,label=0;label=1;while(1)switch(label|0){case 1:_uv_roundup($dst,$dstfmt);$1=$dst+4|0;$3=$dst+8|0;$5=Math_imul(HEAP32[$3>>2]|0,HEAP32[$1>>2]|0)|0;$7=(_uvp_size($dst,$dstfmt)|0)<<1;$8=$7+$5|0;HEAP32[$dst+16>>2]=$8;$10=_malloc($8)|0;$11=$dst+12|0;HEAP32[$11>>2]=$10;if(($10|0)==0){label=15;break}else{label=2;break};case 2:if(($7|0)==0){label=4;break}else{label=3;break};case 3:_memset($10+$5|0,-128|0,$7|0);label=4;break;case 4:$18=$srcfmt+8|0;$20=HEAP32[$src+12>>2]|0;$21=$src+4|0;$22=HEAP32[$21>>2]|0;if((HEAP32[$3>>2]|0)==0){label=15;break}else{label=5;break};case 5:$srcp_151=((HEAP8[$dstfmt+10|0]^HEAP8[$18+2|0])&2)==0?$20:$20+1|0;$dsty_052=HEAP32[$11>>2]|0;$y_053=0;$y0_054=0;$y1_055=0;label=6;break;case 6:if($y_053>>>0<(HEAP32[$src+8>>2]|0)>>>0){$srcp_3_ph=$srcp_151;label=8;break}else{label=7;break};case 7:$srcp_3_ph=$srcp_151+(-($22+($22>>>((HEAPU8[$18]|0)>>>0))|0)|0)|0;label=8;break;case 8:$51=HEAP32[$21>>2]|0;$52=($51|0)!=0;if((HEAP32[$1>>2]|0)==0){$srcp_3_lcssa=$srcp_3_ph;$dsty_1_lcssa=$dsty_052;$x_0_lcssa=0;$y0_1_lcssa=$y0_054;$y1_1_lcssa=$y1_055;$_lcssa=$51;$_lcssa39=$52;label=12;break}else{$srcp_340=$srcp_3_ph;$dsty_141=$dsty_052;$x_042=0;$y0_143=$y0_054;$y1_144=$y1_055;$53=$52;label=9;break};case 9:if($53){label=10;break}else{$y1_2=$y1_144;$y0_2=$y0_143;$srcp_4=$srcp_340;label=11;break};case 10:$y1_2=HEAP8[$srcp_340+2|0]|0;$y0_2=HEAP8[$srcp_340]|0;$srcp_4=$srcp_340+4|0;label=11;break;case 11:HEAP8[$dsty_141]=$y0_2;$61=$dsty_141+2|0;HEAP8[$dsty_141+1|0]=$y1_2;$62=$x_042+2|0;$65=HEAP32[$21>>2]|0;$66=$62>>>0<$65>>>0;if($62>>>0<(HEAP32[$1>>2]|0)>>>0){$srcp_340=$srcp_4;$dsty_141=$61;$x_042=$62;$y0_143=$y0_2;$y1_144=$y1_2;$53=$66;label=9;break}else{$srcp_3_lcssa=$srcp_4;$dsty_1_lcssa=$61;$x_0_lcssa=$62;$y0_1_lcssa=$y0_2;$y1_1_lcssa=$y1_2;$_lcssa=$65;$_lcssa39=$66;label=12;break};case 12:if($_lcssa39){label=13;break}else{$srcp_5=$srcp_3_lcssa;label=14;break};case 13:$srcp_5=$srcp_3_lcssa+($_lcssa-$x_0_lcssa<<1)|0;label=14;break;case 14:$72=$y_053+1|0;if($72>>>0<(HEAP32[$3>>2]|0)>>>0){$srcp_151=$srcp_5;$dsty_052=$dsty_1_lcssa;$y_053=$72;$y0_054=$y0_1_lcssa;$y1_055=$y1_1_lcssa;label=6;break}else{label=15;break};case 15:return}}function _convert_uv_resample($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $1=0,$3=0,$5=0,$8=0,$10=0,$14=0,$16=0,$19=0,$20=0,$21=0,$37=0,$dstp_075=0,$v_074=0,$u_073=0,$y1_072=0,$y0_071=0,$y_070=0,$srcp_069=0,$srcp_2_ph=0,$45=0,$46=0,$47=0,$dstp_160=0,$v_159=0,$u_158=0,$y1_157=0,$y0_156=0,$x_055=0,$srcp_254=0,$51=0,$53=0,$54=0,$55=0,$56=0,$_51=0,$v_2=0,$srcp_4=0,$y0_3=0,$y1_3=0,$u_3=0,$v_3=0,$61=0,$dstp_2=0,$69=0,$72=0,$73=0,$_lcssa53=0,$_lcssa=0,$dstp_1_lcssa=0,$v_1_lcssa=0,$u_1_lcssa=0,$y1_1_lcssa=0,$y0_1_lcssa=0,$x_0_lcssa=0,$srcp_2_lcssa=0,$srcp_5=0,$79=0,label=0;label=1;while(1)switch(label|0){case 1:_uv_roundup($dst,$dstfmt);$1=$dst+4|0;$3=$dst+8|0;$5=Math_imul(HEAP32[$3>>2]|0,HEAP32[$1>>2]|0)|0;$8=((_uvp_size($dst,$dstfmt)|0)<<1)+$5|0;HEAP32[$dst+16>>2]=$8;$10=_malloc($8)|0;HEAP32[$dst+12>>2]=$10;if(($10|0)==0){label=16;break}else{label=2;break};case 2:$14=$srcfmt+8|0;$16=$14+2|0;$19=$dstfmt+10|0;$20=$src+4|0;$21=HEAP32[$20>>2]|0;if((HEAP32[$3>>2]|0)==0){label=16;break}else{label=3;break};case 3:$37=((HEAP8[$19]^HEAP8[$16])&1)==0;$srcp_069=HEAP32[$src+12>>2]|0;$y_070=0;$y0_071=0;$y1_072=0;$u_073=-128;$v_074=-128;$dstp_075=$10;label=4;break;case 4:if($y_070>>>0<(HEAP32[$src+8>>2]|0)>>>0){$srcp_2_ph=$srcp_069;label=6;break}else{label=5;break};case 5:$srcp_2_ph=$srcp_069+(-($21+($21>>>((HEAPU8[$14]|0)>>>0))|0)|0)|0;label=6;break;case 6:$45=HEAP32[$20>>2]|0;$46=($45|0)!=0;if((HEAP32[$1>>2]|0)==0){$srcp_2_lcssa=$srcp_2_ph;$x_0_lcssa=0;$y0_1_lcssa=$y0_071;$y1_1_lcssa=$y1_072;$u_1_lcssa=$u_073;$v_1_lcssa=$v_074;$dstp_1_lcssa=$dstp_075;$_lcssa=$45;$_lcssa53=$46;label=13;break}else{$srcp_254=$srcp_2_ph;$x_055=0;$y0_156=$y0_071;$y1_157=$y1_072;$u_158=$u_073;$v_159=$v_074;$dstp_160=$dstp_075;$47=$46;label=7;break};case 7:if($47){label=8;break}else{$v_3=$v_159;$u_3=$u_158;$y1_3=$y1_157;$y0_3=$y0_156;$srcp_4=$srcp_254;label=9;break};case 8:$51=(HEAP8[$16]&2)==0;$53=HEAP8[$srcp_254]|0;$54=$srcp_254+2|0;$55=HEAP8[$srcp_254+1|0]|0;$56=$srcp_254+3|0;$_51=$51?$55:$53;$v_2=HEAP8[$51?$56:$54]|0;$v_3=$37?$v_2:$_51;$u_3=$37?$_51:$v_2;$y1_3=HEAP8[$51?$54:$56]|0;$y0_3=$51?$53:$55;$srcp_4=$srcp_254+4|0;label=9;break;case 9:$61=$dstp_160+1|0;if((HEAP8[$19]&2)==0){label=10;break}else{label=11;break};case 10:HEAP8[$dstp_160]=$y0_3;HEAP8[$61]=$u_3;HEAP8[$dstp_160+2|0]=$y1_3;HEAP8[$dstp_160+3|0]=$v_3;label=12;break;case 11:HEAP8[$dstp_160]=$u_3;HEAP8[$61]=$y0_3;HEAP8[$dstp_160+2|0]=$v_3;HEAP8[$dstp_160+3|0]=$y1_3;label=12;break;case 12:$dstp_2=$dstp_160+4|0;$69=$x_055+2|0;$72=HEAP32[$20>>2]|0;$73=$69>>>0<$72>>>0;if($69>>>0<(HEAP32[$1>>2]|0)>>>0){$srcp_254=$srcp_4;$x_055=$69;$y0_156=$y0_3;$y1_157=$y1_3;$u_158=$u_3;$v_159=$v_3;$dstp_160=$dstp_2;$47=$73;label=7;break}else{$srcp_2_lcssa=$srcp_4;$x_0_lcssa=$69;$y0_1_lcssa=$y0_3;$y1_1_lcssa=$y1_3;$u_1_lcssa=$u_3;$v_1_lcssa=$v_3;$dstp_1_lcssa=$dstp_2;$_lcssa=$72;$_lcssa53=$73;label=13;break};case 13:if($_lcssa53){label=14;break}else{$srcp_5=$srcp_2_lcssa;label=15;break};case 14:$srcp_5=$srcp_2_lcssa+($_lcssa-$x_0_lcssa<<1)|0;label=15;break;case 15:$79=$y_070+1|0;if($79>>>0<(HEAP32[$3>>2]|0)>>>0){$srcp_069=$srcp_5;$y_070=$79;$y0_071=$y0_1_lcssa;$y1_072=$y1_1_lcssa;$u_073=$u_1_lcssa;$v_074=$v_1_lcssa;$dstp_075=$dstp_1_lcssa;label=4;break}else{label=16;break};case 16:return}}function _convert_uvp_append($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $2=0,$3=0,$4=0,$6=0,$8=0,$9=0,$11=0,$13=0,$15=0,$24=0,$25=0,$29=0,$30=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:_uv_roundup($dst,$dstfmt);$2=(_uvp_size($dst,$dstfmt)|0)<<1;$3=$dst+16|0;$4=$dst+4|0;$6=$dst+8|0;$8=Math_imul(HEAP32[$6>>2]|0,HEAP32[$4>>2]|0)|0;$9=$8+$2|0;HEAP32[$3>>2]=$9;$11=HEAP32[$src+16>>2]|0;$13=HEAP32[$src+4>>2]|0;$15=HEAP32[$src+8>>2]|0;if($11>>>0<(Math_imul($15,$13)|0)>>>0){label=2;break}else{label=3;break};case 2:___assert_func(6544,369,9344,5304);case 3:if((HEAP32[374]|0)>23){label=4;break}else{label=5;break};case 4:$24=HEAP32[$4>>2]|0;$25=HEAP32[$6>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,5208,(tempInt=STACKTOP,STACKTOP=STACKTOP+64|0,HEAP32[tempInt>>2]=9344,HEAP32[tempInt+8>>2]=$24,HEAP32[tempInt+16>>2]=$25,HEAP32[tempInt+24>>2]=$8,HEAP32[tempInt+32>>2]=$9,HEAP32[tempInt+40>>2]=$13,HEAP32[tempInt+48>>2]=$15,HEAP32[tempInt+56>>2]=$11,tempInt)|0)|0;label=5;break;case 5:$29=_malloc(HEAP32[$3>>2]|0)|0;$30=$dst+12|0;HEAP32[$30>>2]=$29;if(($29|0)==0){label=7;break}else{label=6;break};case 6:_convert_y_resize($dst,$src,$8);_memset((HEAP32[$30>>2]|0)+$8|0,-128|0,(HEAP32[$3>>2]|0)-$8|0);label=7;break;case 7:STACKTOP=__stackBase__;return}}function _convert_yuv_pack($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $1=0,$3=0,$5=0,$8=0,$10=0,$14=0,$15=0,$16=0,$18=0,$25=0,$29=0,$30=0,$31=0,$36=0,$38=0,$39=0,$40=0,$43=0,$44=0,$46=0,$55=0,$56=0,$v_0106=0,$u_0105=0,$y1_0104=0,$y0_0103=0,$y_0102=0,$dstp_0101=0,$srcy_0100=0,$srcv_199=0,$srcu_198=0,$srcu_3_ph=0,$srcv_3_ph=0,$srcy_2_ph=0,$v_180=0,$u_179=0,$y1_178=0,$y0_177=0,$x_076=0,$dstp_175=0,$srcy_274=0,$srcv_373=0,$srcu_372=0,$79=0,$80=0,$81=0,$srcu_4=0,$srcv_4=0,$srcy_3=0,$y0_2=0,$y1_2=0,$u_2=0,$v_2=0,$90=0,$dstp_2=0,$98=0,$v_1_lcssa=0,$u_1_lcssa=0,$y1_1_lcssa=0,$y0_1_lcssa=0,$x_0_lcssa=0,$dstp_1_lcssa=0,$srcy_2_lcssa=0,$srcv_3_lcssa=0,$srcu_3_lcssa=0,$x_192=0,$srcy_491=0,$srcv_590=0,$srcu_589=0,$105=0,$srcu_6=0,$srcv_6=0,$112=0,$srcy_4_lcssa=0,$srcv_5_lcssa=0,$srcu_5_lcssa=0,$114=0,label=0;label=1;while(1)switch(label|0){case 1:_uv_roundup($dst,$dstfmt);$1=$dst+4|0;$3=$dst+8|0;$5=Math_imul(HEAP32[$3>>2]|0,HEAP32[$1>>2]|0)|0;$8=((_uvp_size($dst,$dstfmt)|0)<<1)+$5|0;HEAP32[$dst+16>>2]=$8;$10=_malloc($8)|0;HEAP32[$dst+12>>2]=$10;if(($10|0)==0){label=24;break}else{label=2;break};case 2:$14=$src+4|0;$15=HEAP32[$14>>2]|0;$16=$src+8|0;$18=Math_imul(HEAP32[$16>>2]|0,$15)|0;if((HEAP32[$src+16>>2]|0)>>>0<($18*3&-1)>>>0){label=3;break}else{label=4;break};case 3:___assert_func(6544,393,9320,5496);case 4:$25=_uvp_size($src,$srcfmt)|0;$29=HEAP8[$dstfmt+10|0]|0;$30=$srcfmt+8|0;$31=$30;$36=HEAP32[$src+12>>2]|0;$38=((HEAP8[$31+2|0]^$29)&1)==0;$39=$36+$18|0;$40=$36+($25+$18)|0;$43=HEAPU8[$30]|0;$44=$15>>>($43>>>0);$46=(1<<$43)-1|0;if((HEAP32[$3>>2]|0)==0){label=24;break}else{label=5;break};case 5:$55=-$44|0;$56=-$44|0;$srcu_198=$38?$39:$40;$srcv_199=$38?$40:$39;$srcy_0100=$36;$dstp_0101=$10;$y_0102=0;$y0_0103=0;$y1_0104=0;$u_0105=-128;$v_0106=-128;label=6;break;case 6:if($y_0102>>>0<(HEAP32[$16>>2]|0)>>>0){label=8;break}else{label=7;break};case 7:$srcy_2_ph=$srcy_0100+(-(HEAP32[$14>>2]|0)|0)|0;$srcv_3_ph=$srcv_199+$56|0;$srcu_3_ph=$srcu_198+$56|0;label=10;break;case 8:if(($y_0102&(1<<(HEAPU8[$31+1|0]|0))-1|0)==0){$srcy_2_ph=$srcy_0100;$srcv_3_ph=$srcv_199;$srcu_3_ph=$srcu_198;label=10;break}else{label=9;break};case 9:$srcy_2_ph=$srcy_0100;$srcv_3_ph=$srcv_199+$55|0;$srcu_3_ph=$srcu_198+$55|0;label=10;break;case 10:if((HEAP32[$1>>2]|0)==0){$srcu_3_lcssa=$srcu_3_ph;$srcv_3_lcssa=$srcv_3_ph;$srcy_2_lcssa=$srcy_2_ph;$dstp_1_lcssa=$dstp_0101;$x_0_lcssa=0;$y0_1_lcssa=$y0_0103;$y1_1_lcssa=$y1_0104;$u_1_lcssa=$u_0105;$v_1_lcssa=$v_0106;label=18;break}else{$srcu_372=$srcu_3_ph;$srcv_373=$srcv_3_ph;$srcy_274=$srcy_2_ph;$dstp_175=$dstp_0101;$x_076=0;$y0_177=$y0_0103;$y1_178=$y1_0104;$u_179=$u_0105;$v_180=$v_0106;label=11;break};case 11:if($x_076>>>0<(HEAP32[$14>>2]|0)>>>0){label=12;break}else{$v_2=$v_180;$u_2=$u_179;$y1_2=$y1_178;$y0_2=$y0_177;$srcy_3=$srcy_274;$srcv_4=$srcv_373;$srcu_4=$srcu_372;label=14;break};case 12:$79=HEAP8[$srcy_274]|0;$80=$srcy_274+2|0;$81=HEAP8[$srcy_274+1|0]|0;if(($x_076&$46|0)==0){label=13;break}else{$v_2=$v_180;$u_2=$u_179;$y1_2=$81;$y0_2=$79;$srcy_3=$80;$srcv_4=$srcv_373;$srcu_4=$srcu_372;label=14;break};case 13:$v_2=HEAP8[$srcv_373]|0;$u_2=HEAP8[$srcu_372]|0;$y1_2=$81;$y0_2=$79;$srcy_3=$80;$srcv_4=$srcv_373+1|0;$srcu_4=$srcu_372+1|0;label=14;break;case 14:$90=$dstp_175+1|0;if(($29&2)==0){label=16;break}else{label=15;break};case 15:HEAP8[$dstp_175]=$u_2;HEAP8[$90]=$y0_2;HEAP8[$dstp_175+2|0]=$v_2;HEAP8[$dstp_175+3|0]=$y1_2;label=17;break;case 16:HEAP8[$dstp_175]=$y0_2;HEAP8[$90]=$u_2;HEAP8[$dstp_175+2|0]=$y1_2;HEAP8[$dstp_175+3|0]=$v_2;label=17;break;case 17:$dstp_2=$dstp_175+4|0;$98=$x_076+2|0;if($98>>>0<(HEAP32[$1>>2]|0)>>>0){$srcu_372=$srcu_4;$srcv_373=$srcv_4;$srcy_274=$srcy_3;$dstp_175=$dstp_2;$x_076=$98;$y0_177=$y0_2;$y1_178=$y1_2;$u_179=$u_2;$v_180=$v_2;label=11;break}else{$srcu_3_lcssa=$srcu_4;$srcv_3_lcssa=$srcv_4;$srcy_2_lcssa=$srcy_3;$dstp_1_lcssa=$dstp_2;$x_0_lcssa=$98;$y0_1_lcssa=$y0_2;$y1_1_lcssa=$y1_2;$u_1_lcssa=$u_2;$v_1_lcssa=$v_2;label=18;break};case 18:if($x_0_lcssa>>>0<(HEAP32[$14>>2]|0)>>>0){label=19;break}else{$srcu_5_lcssa=$srcu_3_lcssa;$srcv_5_lcssa=$srcv_3_lcssa;$srcy_4_lcssa=$srcy_2_lcssa;label=23;break};case 19:$srcu_589=$srcu_3_lcssa;$srcv_590=$srcv_3_lcssa;$srcy_491=$srcy_2_lcssa;$x_192=$x_0_lcssa;label=20;break;case 20:$105=$srcy_491+2|0;if(($x_192&$46|0)==0){label=21;break}else{$srcv_6=$srcv_590;$srcu_6=$srcu_589;label=22;break};case 21:$srcv_6=$srcv_590+1|0;$srcu_6=$srcu_589+1|0;label=22;break;case 22:$112=$x_192+2|0;if($112>>>0<(HEAP32[$14>>2]|0)>>>0){$srcu_589=$srcu_6;$srcv_590=$srcv_6;$srcy_491=$105;$x_192=$112;label=20;break}else{$srcu_5_lcssa=$srcu_6;$srcv_5_lcssa=$srcv_6;$srcy_4_lcssa=$105;label=23;break};case 23:$114=$y_0102+1|0;if($114>>>0<(HEAP32[$3>>2]|0)>>>0){$srcu_198=$srcu_5_lcssa;$srcv_199=$srcv_5_lcssa;$srcy_0100=$srcy_4_lcssa;$dstp_0101=$dstp_1_lcssa;$y_0102=$114;$y0_0103=$y0_1_lcssa;$y1_0104=$y1_1_lcssa;$u_0105=$u_1_lcssa;$v_0106=$v_1_lcssa;label=6;break}else{label=24;break};case 24:return}}function _convert_yuvp_to_rgb($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $1=0,$3=0,$5=0,$6=0,$7=0,$8=0,$11=0,$13=0,$19=0,$24=0,$29=0,$32=0,$33=0,$35=0,$37=0,$dstp_051=0,$p_050=0,$y_049=0,$srcy_048=0,$srcy_2_ph=0,$58=0,$59=0,$60=0,$dstp_142=0,$p_141=0,$x_040=0,$srcy_239=0,$64=0,$srcy_3=0,$p_2=0,$78=0,$79=0,$82=0,$83=0,$_lcssa38=0,$_lcssa=0,$dstp_1_lcssa=0,$p_1_lcssa=0,$x_0_lcssa=0,$srcy_2_lcssa=0,$srcy_4=0,$88=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dst+4|0;$3=$dst+8|0;$5=Math_imul(HEAP32[$3>>2]|0,HEAP32[$1>>2]|0)|0;$6=$dstfmt+8|0;$7=$6;$8=$6;$11=Math_imul($5,HEAPU8[$8]|0)|0;HEAP32[$dst+16>>2]=$11;$13=_malloc($11)|0;HEAP32[$dst+12>>2]=$13;if(($13|0)==0){label=15;break}else{label=2;break};case 2:$19=HEAPU8[$7+1|0]|0;$24=HEAPU8[$7+2|0]|0;$29=HEAPU8[$7+3|0]|0;$32=_uvp_size($src,$srcfmt)|0;$33=$src+4|0;$35=$src+8|0;$37=Math_imul(HEAP32[$35>>2]|0,HEAP32[$33>>2]|0)|0;if((HEAP32[$src+16>>2]|0)>>>0<($37+($32<<1)|0)>>>0){label=3;break}else{label=4;break};case 3:___assert_func(6544,577,9272,5640);case 4:if((HEAP32[$3>>2]|0)==0){label=15;break}else{label=5;break};case 5:$srcy_048=HEAP32[$src+12>>2]|0;$y_049=0;$p_050=0;$dstp_051=$13;label=6;break;case 6:if($y_049>>>0<(HEAP32[$35>>2]|0)>>>0){$srcy_2_ph=$srcy_048;label=8;break}else{label=7;break};case 7:$srcy_2_ph=$srcy_048+(-(HEAP32[$33>>2]|0)|0)|0;label=8;break;case 8:$58=HEAP32[$33>>2]|0;$59=($58|0)!=0;if((HEAP32[$1>>2]|0)==0){$srcy_2_lcssa=$srcy_2_ph;$x_0_lcssa=0;$p_1_lcssa=$p_050;$dstp_1_lcssa=$dstp_051;$_lcssa=$58;$_lcssa38=$59;label=12;break}else{$srcy_239=$srcy_2_ph;$x_040=0;$p_141=$p_050;$dstp_142=$dstp_051;$60=$59;label=9;break};case 9:if($60){label=10;break}else{$p_2=$p_141;$srcy_3=$srcy_239;label=11;break};case 10:$64=HEAPU8[$srcy_239]|0;$p_2=$64>>>($19>>>5>>>0)<<($19&31)|$64>>>($24>>>5>>>0)<<($24&31)|$64>>>($29>>>5>>>0)<<($29&31);$srcy_3=$srcy_239+1|0;label=11;break;case 11:_convert_write_rgb($dstp_142,$p_2,HEAPU8[$8]|0);$78=$dstp_142+(HEAPU8[$8]|0)|0;$79=$x_040+1|0;$82=HEAP32[$33>>2]|0;$83=$79>>>0<$82>>>0;if($79>>>0<(HEAP32[$1>>2]|0)>>>0){$srcy_239=$srcy_3;$x_040=$79;$p_141=$p_2;$dstp_142=$78;$60=$83;label=9;break}else{$srcy_2_lcssa=$srcy_3;$x_0_lcssa=$79;$p_1_lcssa=$p_2;$dstp_1_lcssa=$78;$_lcssa=$82;$_lcssa38=$83;label=12;break};case 12:if($_lcssa38){label=13;break}else{$srcy_4=$srcy_2_lcssa;label=14;break};case 13:$srcy_4=$srcy_2_lcssa+($_lcssa-$x_0_lcssa)|0;label=14;break;case 14:$88=$y_049+1|0;if($88>>>0<(HEAP32[$3>>2]|0)>>>0){$srcy_048=$srcy_4;$y_049=$88;$p_050=$p_1_lcssa;$dstp_051=$dstp_1_lcssa;label=6;break}else{label=15;break};case 15:return}}function _convert_yuv_to_rgb($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $1=0,$3=0,$5=0,$6=0,$7=0,$8=0,$11=0,$13=0,$19=0,$24=0,$29=0,$33=0,$34=0,$35=0,$36=0,$38=0,$46=0,$47=0,$p_059=0,$y_058=0,$dstp_057=0,$srcp_156=0,$srcp_3_ph=0,$71=0,$72=0,$73=0,$p_150=0,$x_049=0,$dstp_148=0,$srcp_347=0,$75=0,$y0_0=0,$srcp_4=0,$p_2=0,$100=0,$101=0,$104=0,$105=0,$_lcssa46=0,$_lcssa=0,$p_1_lcssa=0,$x_0_lcssa=0,$dstp_1_lcssa=0,$srcp_3_lcssa=0,$srcp_5=0,$111=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dst+4|0;$3=$dst+8|0;$5=Math_imul(HEAP32[$3>>2]|0,HEAP32[$1>>2]|0)|0;$6=$dstfmt+8|0;$7=$6;$8=$6;$11=Math_imul($5,HEAPU8[$8]|0)|0;HEAP32[$dst+16>>2]=$11;$13=_malloc($11)|0;HEAP32[$dst+12>>2]=$13;if(($13|0)==0){label=20;break}else{label=2;break};case 2:$19=HEAPU8[$7+1|0]|0;$24=HEAPU8[$7+2|0]|0;$29=HEAPU8[$7+3|0]|0;$33=HEAP32[$src+16>>2]|0;$34=$src+4|0;$35=HEAP32[$34>>2]|0;$36=$src+8|0;$38=Math_imul(HEAP32[$36>>2]|0,$35)|0;if($33>>>0<(((_uvp_size($src,$srcfmt)|0)<<1)+$38|0)>>>0){label=3;break}else{label=4;break};case 3:___assert_func(6544,676,9296,6e3);case 4:$46=HEAP32[$src+12>>2]|0;$47=$srcfmt+8|0;if((HEAP8[$47]|0)==1){label=6;break}else{label=5;break};case 5:___assert_func(6544,681,9296,5856);case 6:if((HEAP32[$3>>2]|0)==0){label=20;break}else{label=7;break};case 7:$srcp_156=(HEAP8[$47+2|0]&2)==0?$46:$46+1|0;$dstp_057=$13;$y_058=0;$p_059=0;label=8;break;case 8:if($y_058>>>0<(HEAP32[$36>>2]|0)>>>0){$srcp_3_ph=$srcp_156;label=10;break}else{label=9;break};case 9:$srcp_3_ph=$srcp_156+(-($35+($35>>>1)|0)|0)|0;label=10;break;case 10:$71=HEAP32[$34>>2]|0;$72=($71|0)!=0;if((HEAP32[$1>>2]|0)==0){$srcp_3_lcssa=$srcp_3_ph;$dstp_1_lcssa=$dstp_057;$x_0_lcssa=0;$p_1_lcssa=$p_059;$_lcssa=$71;$_lcssa46=$72;label=17;break}else{$srcp_347=$srcp_3_ph;$dstp_148=$dstp_057;$x_049=0;$p_150=$p_059;$73=$72;label=11;break};case 11:if($73){label=12;break}else{$p_2=$p_150;$srcp_4=$srcp_347;label=16;break};case 12:$75=HEAP8[$srcp_347]|0;if(($75&255)<17){$y0_0=0;label=15;break}else{label=13;break};case 13:if(($75&255)>234){$y0_0=255;label=15;break}else{label=14;break};case 14:$y0_0=(((($75&255)-16&65535)*255&-1)>>>0)/219>>>0&255;label=15;break;case 15:$p_2=$y0_0>>>($19>>>5>>>0)<<($19&31)|$y0_0>>>($24>>>5>>>0)<<($24&31)|$y0_0>>>($29>>>5>>>0)<<($29&31);$srcp_4=$srcp_347+2|0;label=16;break;case 16:_convert_write_rgb($dstp_148,$p_2,HEAPU8[$8]|0);$100=$dstp_148+(HEAPU8[$8]|0)|0;$101=$x_049+1|0;$104=HEAP32[$34>>2]|0;$105=$101>>>0<$104>>>0;if($101>>>0<(HEAP32[$1>>2]|0)>>>0){$srcp_347=$srcp_4;$dstp_148=$100;$x_049=$101;$p_150=$p_2;$73=$105;label=11;break}else{$srcp_3_lcssa=$srcp_4;$dstp_1_lcssa=$100;$x_0_lcssa=$101;$p_1_lcssa=$p_2;$_lcssa=$104;$_lcssa46=$105;label=17;break};case 17:if($_lcssa46){label=18;break}else{$srcp_5=$srcp_3_lcssa;label=19;break};case 18:$srcp_5=$srcp_3_lcssa+($_lcssa-$x_0_lcssa<<1)|0;label=19;break;case 19:$111=$y_058+1|0;if($111>>>0<(HEAP32[$3>>2]|0)>>>0){$srcp_156=$srcp_5;$dstp_057=$dstp_1_lcssa;$y_058=$111;$p_059=$p_1_lcssa;label=8;break}else{label=20;break};case 20:return}}function _convert_read_rgb($srcp,$bpp){$srcp=$srcp|0;$bpp=$bpp|0;var $p_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($bpp|0)==3){label=2;break}else if(($bpp|0)==4){label=3;break}else if(($bpp|0)==2){label=4;break}else{label=5;break};case 2:$p_0=(HEAPU8[$srcp+1|0]|0)<<8|(HEAPU8[$srcp]|0)|(HEAPU8[$srcp+2|0]|0)<<16;label=6;break;case 3:$p_0=HEAP32[$srcp>>2]|0;label=6;break;case 4:$p_0=HEAPU16[$srcp>>1]|0;label=6;break;case 5:$p_0=HEAPU8[$srcp]|0;label=6;break;case 6:return $p_0|0}return 0}function _convert_write_rgb($dstp,$p,$bpp){$dstp=$dstp|0;$p=$p|0;$bpp=$bpp|0;var label=0;label=1;while(1)switch(label|0){case 1:if(($bpp|0)==3){label=2;break}else if(($bpp|0)==4){label=3;break}else if(($bpp|0)==2){label=4;break}else{label=5;break};case 2:HEAP8[$dstp]=$p&255;HEAP8[$dstp+1|0]=$p>>>8&255;HEAP8[$dstp+2|0]=$p>>>16&255;label=6;break;case 3:HEAP32[$dstp>>2]=$p;label=6;break;case 4:HEAP16[$dstp>>1]=$p&65535;label=6;break;case 5:HEAP8[$dstp]=$p&255;label=6;break;case 6:return}}function _uv_roundup($img,$fmt){$img=$img|0;$fmt=$fmt|0;var $5=0,$10=0,$11=0,$12=0,$13=0,$24=0,$25=0,$26=0,$27=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$fmt+4>>2]|0)==0){label=6;break}else{label=2;break};case 2:$5=$fmt+8|0;$10=1<<(HEAPU8[$5]|0);$11=$10-1|0;$12=$img+4|0;$13=HEAP32[$12>>2]|0;if(($11&$13|0)==0){label=4;break}else{label=3;break};case 3:HEAP32[$12>>2]=$11+$13&-$10;label=4;break;case 4:$24=1<<(HEAPU8[$5+1|0]|0);$25=$24-1|0;$26=$img+8|0;$27=HEAP32[$26>>2]|0;if(($25&$27|0)==0){label=6;break}else{label=5;break};case 5:HEAP32[$26>>2]=$25+$27&-$24;label=6;break;case 6:return}}function _uvp_size($img,$fmt){$img=$img|0;$fmt=$fmt|0;var $7=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$fmt+4>>2]|0)==0){$_0=0;label=3;break}else{label=2;break};case 2:$7=$fmt+8|0;$_0=Math_imul((HEAP32[$img+8>>2]|0)>>>((HEAPU8[$7+1|0]|0)>>>0),(HEAP32[$img+4>>2]|0)>>>((HEAPU8[$7]|0)>>>0))|0;label=3;break;case 3:return $_0|0}return 0}function _convert_y_resize($dst,$src,$n){$dst=$dst|0;$src=$src|0;$n=$n|0;var $1=0,$3=0,$19=0,$21=0,$22=0,$23=0,$24=0,$_=0,$26=0,$27=0,$28=0,$30=0,$_4=0,$34=0,$35=0,$y_09=0,$psrc_08=0,$pdst_07=0,$38=0,$39=0,$40=0,$pdst_1=0,$46=0,$y_0_lcssa=0,$psrc_0_lcssa=0,$pdst_0_lcssa=0,$50=0,$y_16=0,$pdst_25=0,$58=0,$pdst_3=0,$63=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dst+4|0;$3=$src+4|0;if((HEAP32[$1>>2]|0)==(HEAP32[$3>>2]|0)){label=2;break}else{label=4;break};case 2:if((HEAP32[$dst+8>>2]|0)==(HEAP32[$src+8>>2]|0)){label=3;break}else{label=4;break};case 3:_memcpy(HEAP32[$dst+12>>2]|0,HEAP32[$src+12>>2]|0,$n)|0;label=15;break;case 4:$19=HEAP32[$src+12>>2]|0;$21=HEAP32[$dst+12>>2]|0;$22=HEAP32[$1>>2]|0;$23=HEAP32[$3>>2]|0;$24=$22>>>0>$23>>>0;$_=$24?$23:$22;$26=$24?$22-$23|0:0;$27=$dst+8|0;$28=HEAP32[$27>>2]|0;$30=HEAP32[$src+8>>2]|0;$_4=$28>>>0>$30>>>0?$30:$28;if(($_4|0)==0){$pdst_0_lcssa=$21;$psrc_0_lcssa=$19;$y_0_lcssa=0;label=10;break}else{label=5;break};case 5:$34=$30^-1;$35=$28^-1;$pdst_07=$21;$psrc_08=$19;$y_09=0;label=6;break;case 6:_memcpy($pdst_07|0,$psrc_08|0,$_)|0;$38=$pdst_07+$_|0;$39=HEAP32[$3>>2]|0;$40=$psrc_08+$39|0;if(($26|0)==0){$pdst_1=$38;label=8;break}else{label=7;break};case 7:_memset($38|0,HEAP8[$psrc_08+($39-1)|0]|0,$26|0);$pdst_1=$pdst_07+($_+$26)|0;label=8;break;case 8:$46=$y_09+1|0;if($46>>>0<$_4>>>0){$pdst_07=$pdst_1;$psrc_08=$40;$y_09=$46;label=6;break}else{label=9;break};case 9:$pdst_0_lcssa=$pdst_1;$psrc_0_lcssa=$40;$y_0_lcssa=($34>>>0>$35>>>0?$34:$35)^-1;label=10;break;case 10:$50=HEAP32[$3>>2]|0;if($y_0_lcssa>>>0<(HEAP32[$27>>2]|0)>>>0){label=11;break}else{label=15;break};case 11:$pdst_25=$pdst_0_lcssa;$y_16=$y_0_lcssa;label=12;break;case 12:_memcpy($pdst_25|0,$psrc_0_lcssa+(-$50|0)|0,$_)|0;$58=$pdst_25+$_|0;if(($26|0)==0){$pdst_3=$58;label=14;break}else{label=13;break};case 13:_memset($58|0,HEAP8[$psrc_0_lcssa+($50^-1)|0]|0,$26|0);$pdst_3=$pdst_25+($_+$26)|0;label=14;break;case 14:$63=$y_16+1|0;if($63>>>0<(HEAP32[$27>>2]|0)>>>0){$pdst_25=$pdst_3;$y_16=$63;label=12;break}else{label=15;break};case 15:return}}function _cleanup_ref($img){$img=$img|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$img+40>>2]|0;if(($2|0)==0){label=3;break}else{label=2;break};case 2:__zbar_image_refcnt365($2,-1);label=3;break;case 3:return}}function __zbar_image_refcnt365($img,$delta){$img=$img|0;$delta=$delta|0;var $7=0,label=0;label=1;while(1)switch(label|0){case 1:if((__zbar_refcnt366($img+28|0,$delta)|0)==0&($delta|0)<1){label=2;break}else{label=6;break};case 2:$7=HEAP32[$img+24>>2]|0;if(($7|0)==0){label=4;break}else{label=3;break};case 3:FUNCTION_TABLE_vi[$7&63]($img);label=4;break;case 4:if((HEAP32[$img+32>>2]|0)==0){label=5;break}else{label=6;break};case 5:__zbar_image_free($img);label=6;break;case 6:return}}function _convert_rgb_to_yuvp($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $1=0,$3=0,$5=0,$7=0,$8=0,$10=0,$11=0,$19=0,$20=0,$21=0,$22=0,$24=0,$25=0,$26=0,$27=0,$29=0,$36=0,$41=0,$46=0,$52=0,$53=0,$55=0,$dsty_063=0,$srcp_062=0,$y_061=0,$y0_0_off060=0,$srcp_2_ph=0,$63=0,$64=0,$65=0,$dsty_154=0,$srcp_253=0,$x_052=0,$y0_1_off051=0,$68=0,$69=0,$y0_2_off0=0,$srcp_3=0,$88=0,$89=0,$92=0,$93=0,$_lcssa50=0,$_lcssa=0,$dsty_1_lcssa=0,$srcp_2_lcssa=0,$x_0_lcssa=0,$y0_1_off0_lcssa=0,$srcp_4=0,$101=0,label=0;label=1;while(1)switch(label|0){case 1:_uv_roundup($dst,$dstfmt);$1=$dst+4|0;$3=$dst+8|0;$5=Math_imul(HEAP32[$3>>2]|0,HEAP32[$1>>2]|0)|0;$7=(_uvp_size($dst,$dstfmt)|0)<<1;$8=$7+$5|0;HEAP32[$dst+16>>2]=$8;$10=_malloc($8)|0;$11=$dst+12|0;HEAP32[$11>>2]=$10;if(($10|0)==0){label=17;break}else{label=2;break};case 2:if(($7|0)==0){label=4;break}else{label=3;break};case 3:_memset($10+$5|0,-128|0,$7|0);label=4;break;case 4:$19=HEAP32[$src+16>>2]|0;$20=$src+4|0;$21=HEAP32[$20>>2]|0;$22=$src+8|0;$24=Math_imul(HEAP32[$22>>2]|0,$21)|0;$25=$srcfmt+8|0;$26=$25;$27=$25;$29=HEAPU8[$27]|0;if($19>>>0<(Math_imul($24,$29)|0)>>>0){label=5;break}else{label=6;break};case 5:___assert_func(6544,619,9368,6224);case 6:$36=HEAPU8[$26+1|0]|0;$41=HEAPU8[$26+2|0]|0;$46=HEAPU8[$26+3|0]|0;if((HEAP32[$3>>2]|0)==0){label=17;break}else{label=7;break};case 7:$52=HEAP32[$src+12>>2]|0;$53=HEAP32[$11>>2]|0;$55=Math_imul($29,-$21|0)|0;$y0_0_off060=0;$y_061=0;$srcp_062=$52;$dsty_063=$53;label=8;break;case 8:if($y_061>>>0<(HEAP32[$22>>2]|0)>>>0){$srcp_2_ph=$srcp_062;label=10;break}else{label=9;break};case 9:$srcp_2_ph=$srcp_062+$55|0;label=10;break;case 10:$63=HEAP32[$20>>2]|0;$64=($63|0)!=0;if((HEAP32[$1>>2]|0)==0){$y0_1_off0_lcssa=$y0_0_off060;$x_0_lcssa=0;$srcp_2_lcssa=$srcp_2_ph;$dsty_1_lcssa=$dsty_063;$_lcssa=$63;$_lcssa50=$64;label=14;break}else{$y0_1_off051=$y0_0_off060;$x_052=0;$srcp_253=$srcp_2_ph;$dsty_154=$dsty_063;$65=$64;label=11;break};case 11:if($65){label=12;break}else{$srcp_3=$srcp_253;$y0_2_off0=$y0_1_off051;label=13;break};case 12:$68=HEAPU8[$27]|0;$69=_convert_read_rgb($srcp_253,$68)|0;$srcp_3=$srcp_253+$68|0;$y0_2_off0=((($69>>>(($41&31)>>>0)<<($41>>>5)&255)*150&-1)+128+(($69>>>(($36&31)>>>0)<<($36>>>5)&255)*77&-1)+(($69>>>(($46&31)>>>0)<<($46>>>5)&255)*29&-1)|0)>>>8&255;label=13;break;case 13:$88=$dsty_154+1|0;HEAP8[$dsty_154]=$y0_2_off0;$89=$x_052+1|0;$92=HEAP32[$20>>2]|0;$93=$89>>>0<$92>>>0;if($89>>>0<(HEAP32[$1>>2]|0)>>>0){$y0_1_off051=$y0_2_off0;$x_052=$89;$srcp_253=$srcp_3;$dsty_154=$88;$65=$93;label=11;break}else{$y0_1_off0_lcssa=$y0_2_off0;$x_0_lcssa=$89;$srcp_2_lcssa=$srcp_3;$dsty_1_lcssa=$88;$_lcssa=$92;$_lcssa50=$93;label=14;break};case 14:if($_lcssa50){label=15;break}else{$srcp_4=$srcp_2_lcssa;label=16;break};case 15:$srcp_4=$srcp_2_lcssa+(Math_imul(HEAPU8[$27]|0,$_lcssa-$x_0_lcssa|0)|0)|0;label=16;break;case 16:$101=$y_061+1|0;if($101>>>0<(HEAP32[$3>>2]|0)>>>0){$y0_0_off060=$y0_1_off0_lcssa;$y_061=$101;$srcp_062=$srcp_4;$dsty_063=$dsty_1_lcssa;label=8;break}else{label=17;break};case 17:return}}function _convert_rgb_to_yuv($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $1=0,$3=0,$5=0,$8=0,$10=0,$18=0,$20=0,$21=0,$22=0,$23=0,$25=0,$26=0,$27=0,$28=0,$30=0,$37=0,$42=0,$47=0,$53=0,$55=0,$56=0,$dstp_065=0,$srcp_064=0,$y_063=0,$y0_0_off062=0,$srcp_2_ph=0,$64=0,$65=0,$66=0,$dstp_156=0,$srcp_255=0,$x_054=0,$y0_1_off053=0,$69=0,$70=0,$y0_2_off0=0,$srcp_3=0,$dstp_2=0,$90=0,$93=0,$94=0,$_lcssa52=0,$_lcssa=0,$dstp_1_lcssa=0,$srcp_2_lcssa=0,$x_0_lcssa=0,$y0_1_off0_lcssa=0,$srcp_4=0,$102=0,label=0;label=1;while(1)switch(label|0){case 1:_uv_roundup($dst,$dstfmt);$1=$dst+4|0;$3=$dst+8|0;$5=Math_imul(HEAP32[$3>>2]|0,HEAP32[$1>>2]|0)|0;$8=((_uvp_size($dst,$dstfmt)|0)<<1)+$5|0;HEAP32[$dst+16>>2]=$8;$10=_malloc($8)|0;HEAP32[$dst+12>>2]=$10;if(($10|0)==0){label=15;break}else{label=2;break};case 2:$18=HEAP8[$dstfmt+10|0]&2;$20=HEAP32[$src+16>>2]|0;$21=$src+4|0;$22=HEAP32[$21>>2]|0;$23=$src+8|0;$25=Math_imul(HEAP32[$23>>2]|0,$22)|0;$26=$srcfmt+8|0;$27=$26;$28=$26;$30=HEAPU8[$28]|0;if($20>>>0<(Math_imul($25,$30)|0)>>>0){label=3;break}else{label=4;break};case 3:___assert_func(6544,727,9392,6224);case 4:$37=HEAPU8[$27+1|0]|0;$42=HEAPU8[$27+2|0]|0;$47=HEAPU8[$27+3|0]|0;if((HEAP32[$3>>2]|0)==0){label=15;break}else{label=5;break};case 5:$53=HEAP32[$src+12>>2]|0;$55=Math_imul($30,-$22|0)|0;$56=$18<<24>>24==0;$y0_0_off062=0;$y_063=0;$srcp_064=$53;$dstp_065=$10;label=6;break;case 6:if($y_063>>>0<(HEAP32[$23>>2]|0)>>>0){$srcp_2_ph=$srcp_064;label=8;break}else{label=7;break};case 7:$srcp_2_ph=$srcp_064+$55|0;label=8;break;case 8:$64=HEAP32[$21>>2]|0;$65=($64|0)!=0;if((HEAP32[$1>>2]|0)==0){$y0_1_off0_lcssa=$y0_0_off062;$x_0_lcssa=0;$srcp_2_lcssa=$srcp_2_ph;$dstp_1_lcssa=$dstp_065;$_lcssa=$64;$_lcssa52=$65;label=12;break}else{$y0_1_off053=$y0_0_off062;$x_054=0;$srcp_255=$srcp_2_ph;$dstp_156=$dstp_065;$66=$65;label=9;break};case 9:if($66){label=10;break}else{$srcp_3=$srcp_255;$y0_2_off0=$y0_1_off053;label=11;break};case 10:$69=HEAPU8[$28]|0;$70=_convert_read_rgb($srcp_255,$69)|0;$srcp_3=$srcp_255+$69|0;$y0_2_off0=((($70>>>(($42&31)>>>0)<<($42>>>5)&255)*150&-1)+128+(($70>>>(($37&31)>>>0)<<($37>>>5)&255)*77&-1)+(($70>>>(($47&31)>>>0)<<($47>>>5)&255)*29&-1)|0)>>>8&255;label=11;break;case 11:HEAP8[$dstp_156]=$56?$y0_2_off0:-128;HEAP8[$dstp_156+1|0]=$56?-128:$y0_2_off0;$dstp_2=$dstp_156+2|0;$90=$x_054+1|0;$93=HEAP32[$21>>2]|0;$94=$90>>>0<$93>>>0;if($90>>>0<(HEAP32[$1>>2]|0)>>>0){$y0_1_off053=$y0_2_off0;$x_054=$90;$srcp_255=$srcp_3;$dstp_156=$dstp_2;$66=$94;label=9;break}else{$y0_1_off0_lcssa=$y0_2_off0;$x_0_lcssa=$90;$srcp_2_lcssa=$srcp_3;$dstp_1_lcssa=$dstp_2;$_lcssa=$93;$_lcssa52=$94;label=12;break};case 12:if($_lcssa52){label=13;break}else{$srcp_4=$srcp_2_lcssa;label=14;break};case 13:$srcp_4=$srcp_2_lcssa+(Math_imul(HEAPU8[$28]|0,$_lcssa-$x_0_lcssa|0)|0)|0;label=14;break;case 14:$102=$y_063+1|0;if($102>>>0<(HEAP32[$3>>2]|0)>>>0){$y0_0_off062=$y0_1_off0_lcssa;$y_063=$102;$srcp_064=$srcp_4;$dstp_065=$dstp_1_lcssa;label=6;break}else{label=15;break};case 15:return}}function _convert_rgb_resample($dst,$dstfmt,$src,$srcfmt){$dst=$dst|0;$dstfmt=$dstfmt|0;$src=$src|0;$srcfmt=$srcfmt|0;var $1=0,$3=0,$5=0,$6=0,$7=0,$8=0,$11=0,$13=0,$19=0,$24=0,$29=0,$33=0,$34=0,$35=0,$36=0,$38=0,$39=0,$40=0,$41=0,$43=0,$50=0,$55=0,$60=0,$63=0,$dstp_062=0,$srcp_061=0,$p_060=0,$y_059=0,$_neg=0,$73=0,$74=0,$75=0,$dstp_153=0,$srcp_152=0,$x_051=0,$p_150=0,$78=0,$79=0,$p_2=0,$srcp_2=0,$103=0,$104=0,$107=0,$108=0,$_lcssa49=0,$_lcssa=0,$dstp_1_lcssa=0,$srcp_1_lcssa=0,$x_0_lcssa=0,$p_1_lcssa=0,$srcp_3=0,$116=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dst+4|0;$3=$dst+8|0;$5=Math_imul(HEAP32[$3>>2]|0,HEAP32[$1>>2]|0)|0;$6=$dstfmt+8|0;$7=$6;$8=$6;$11=Math_imul($5,HEAPU8[$8]|0)|0;HEAP32[$dst+16>>2]=$11;$13=_malloc($11)|0;HEAP32[$dst+12>>2]=$13;if(($13|0)==0){label=13;break}else{label=2;break};case 2:$19=HEAPU8[$7+1|0]|0;$24=HEAPU8[$7+2|0]|0;$29=HEAPU8[$7+3|0]|0;$33=HEAP32[$src+16>>2]|0;$34=$src+4|0;$35=HEAP32[$34>>2]|0;$36=$src+8|0;$38=Math_imul(HEAP32[$36>>2]|0,$35)|0;$39=$srcfmt+8|0;$40=$39;$41=$39;$43=HEAPU8[$41]|0;if($33>>>0<(Math_imul($38,$43)|0)>>>0){label=3;break}else{label=4;break};case 3:___assert_func(6544,788,9416,6224);case 4:$50=HEAPU8[$40+1|0]|0;$55=HEAPU8[$40+2|0]|0;$60=HEAPU8[$40+3|0]|0;$63=Math_imul($43,$35)|0;if((HEAP32[$3>>2]|0)==0){label=13;break}else{label=5;break};case 5:$y_059=0;$p_060=0;$srcp_061=HEAP32[$src+12>>2]|0;$dstp_062=$13;label=6;break;case 6:$_neg=$y_059>>>0<(HEAP32[$36>>2]|0)>>>0?0:-$63|0;$73=HEAP32[$34>>2]|0;$74=($73|0)!=0;if((HEAP32[$1>>2]|0)==0){$p_1_lcssa=$p_060;$x_0_lcssa=0;$srcp_1_lcssa=$srcp_061;$dstp_1_lcssa=$dstp_062;$_lcssa=$73;$_lcssa49=$74;label=10;break}else{$p_150=$p_060;$x_051=0;$srcp_152=$srcp_061;$dstp_153=$dstp_062;$75=$74;label=7;break};case 7:if($75){label=8;break}else{$srcp_2=$srcp_152;$p_2=$p_150;label=9;break};case 8:$78=HEAPU8[$41]|0;$79=_convert_read_rgb($srcp_152,$78)|0;$srcp_2=$srcp_152+$78|0;$p_2=($79>>>(($50&31)>>>0)<<($50>>>5)&255)>>>($19>>>5>>>0)<<($19&31)|($79>>>(($55&31)>>>0)<<($55>>>5)&255)>>>($24>>>5>>>0)<<($24&31)|($79>>>(($60&31)>>>0)<<($60>>>5)&255)>>>($29>>>5>>>0)<<($29&31);label=9;break;case 9:_convert_write_rgb($dstp_153,$p_2,HEAPU8[$8]|0);$103=$dstp_153+(HEAPU8[$8]|0)|0;$104=$x_051+1|0;$107=HEAP32[$34>>2]|0;$108=$104>>>0<$107>>>0;if($104>>>0<(HEAP32[$1>>2]|0)>>>0){$p_150=$p_2;$x_051=$104;$srcp_152=$srcp_2;$dstp_153=$103;$75=$108;label=7;break}else{$p_1_lcssa=$p_2;$x_0_lcssa=$104;$srcp_1_lcssa=$srcp_2;$dstp_1_lcssa=$103;$_lcssa=$107;$_lcssa49=$108;label=10;break};case 10:if($_lcssa49){label=11;break}else{$srcp_3=$srcp_1_lcssa;label=12;break};case 11:$srcp_3=$srcp_1_lcssa+(Math_imul(HEAPU8[$41]|0,$_lcssa-$x_0_lcssa|0)|0)|0;label=12;break;case 12:$116=$y_059+1+$_neg|0;if($116>>>0<(HEAP32[$3>>2]|0)>>>0){$y_059=$116;$p_060=$p_1_lcssa;$srcp_061=$srcp_3;$dstp_062=$dstp_1_lcssa;label=6;break}else{label=13;break};case 13:return}}function __zbar_refcnt366($cnt,$delta){$cnt=$cnt|0;$delta=$delta|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(HEAP32[$cnt>>2]|0)+$delta|0;HEAP32[$cnt>>2]=$2;if(($2|0)>-1){label=3;break}else{label=2;break};case 2:___assert_func(4928|0,75,9616|0,4840|0);return 0;case 3:return $2|0}return 0}function __zbar_image_scanner_recycle_syms($iscn,$sym){$iscn=$iscn|0;$sym=$sym|0;var $_030=0,$2=0,$3=0,$4=0,$18=0,$25=0,$26=0,$i_0=0,$50=0,$51=0,$i_1=0,$56=0,$59=0,label=0;label=1;while(1)switch(label|0){case 1:if(($sym|0)==0){label=21;break}else{$_030=$sym;label=2;break};case 2:$2=$_030+32|0;$3=HEAP32[$2>>2]|0;$4=$_030+28|0;if((HEAP32[$4>>2]|0)==0){label=8;break}else{label=3;break};case 3:if((__zbar_refcnt387($4,-1)|0)==0){label=8;break}else{label=4;break};case 4:if((HEAP32[$_030+4>>2]|0)==0){label=5;break}else{label=6;break};case 5:___assert_func(3960,135,9944,6904);case 6:HEAP32[$2>>2]=0;label=7;break;case 7:if(($3|0)==0){label=21;break}else{$_030=$3;label=2;break};case 8:$18=$_030+4|0;if((HEAP32[$18>>2]|0)==0){label=9;break}else{label=10;break};case 9:HEAP32[$_030+12>>2]=0;HEAP32[$_030+8>>2]=0;label=10;break;case 10:$25=$_030+36|0;$26=HEAP32[$25>>2]|0;if(($26|0)==0){$i_0=0;label=14;break}else{label=11;break};case 11:if((__zbar_refcnt387($26|0,-1)|0)==0){label=13;break}else{label=12;break};case 12:___assert_func(3960,146,9944,4920);case 13:__zbar_image_scanner_recycle_syms($iscn,HEAP32[(HEAP32[$25>>2]|0)+8>>2]|0);HEAP32[(HEAP32[$25>>2]|0)+8>>2]=0;__zbar_symbol_set_free(HEAP32[$25>>2]|0);HEAP32[$25>>2]=0;$i_0=0;label=14;break;case 14:if(($i_0|0)<5){label=15;break}else{label=16;break};case 15:if((HEAP32[$18>>2]|0)>>>0<1<<($i_0<<1)>>>0){label=16;break}else{$i_0=$i_0+1|0;label=14;break};case 16:if(($i_0|0)==5){label=17;break}else{$i_1=$i_0;label=20;break};case 17:$50=$_030+12|0;$51=HEAP32[$50>>2]|0;if(($51|0)==0){label=18;break}else{label=19;break};case 18:___assert_func(3960,157,9944,4216);case 19:_free($51);HEAP32[$50>>2]=0;HEAP32[$18>>2]=0;$i_1=0;label=20;break;case 20:$56=$iscn+52+($i_1<<3)|0;HEAP32[$56>>2]=(HEAP32[$56>>2]|0)+1;$59=$iscn+52+($i_1<<3)+4|0;HEAP32[$2>>2]=HEAP32[$59>>2];HEAP32[$59>>2]=$_030;label=7;break;case 21:return}}function __zbar_refcnt387($cnt,$delta){$cnt=$cnt|0;$delta=$delta|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(HEAP32[$cnt>>2]|0)+$delta|0;HEAP32[$cnt>>2]=$2;if(($2|0)>-1){label=3;break}else{label=2;break};case 2:___assert_func(5984|0,75,9600|0,5848|0);return 0;case 3:return $2|0}return 0}function _zbar_image_scanner_get_results($iscn){$iscn=$iscn|0;return HEAP32[$iscn+48>>2]|0}function _zbar_image_scanner_recycle_image($iscn,$img){$iscn=$iscn|0;$img=$img|0;var $1=0,$2=0,$12=0,$16=0,$20=0,$21=0,$27=0,$31=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$iscn+48|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=6;break}else{label=2;break};case 2:if((HEAP32[$2>>2]|0)==0){label=6;break}else{label=3;break};case 3:if((_recycle_syms($iscn,$2)|0)==0){label=5;break}else{label=4;break};case 4:$12=$iscn+116|0;HEAP32[$12>>2]=(HEAP32[$12>>2]|0)+1;HEAP32[$1>>2]=0;label=6;break;case 5:$16=$iscn+120|0;HEAP32[$16>>2]=(HEAP32[$16>>2]|0)+1;label=6;break;case 6:$20=$img+48|0;$21=HEAP32[$20>>2]|0;HEAP32[$20>>2]=0;if(($21|0)==0){label=12;break}else{label=7;break};case 7:if((_recycle_syms($iscn,$21)|0)==0){label=9;break}else{label=8;break};case 8:$27=$iscn+124|0;HEAP32[$27>>2]=(HEAP32[$27>>2]|0)+1;label=12;break;case 9:$31=$iscn+128|0;HEAP32[$31>>2]=(HEAP32[$31>>2]|0)+1;if((HEAP32[$1>>2]|0)==0){label=11;break}else{label=10;break};case 10:__zbar_symbol_set_free($21);label=12;break;case 11:HEAP32[$1>>2]=$21;label=12;break;case 12:return}}function _recycle_syms($iscn,$syms){$iscn=$iscn|0;$syms=$syms|0;var $5=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if((__zbar_refcnt387($syms|0,-1)|0)==0){label=2;break}else{$_0=1;label=3;break};case 2:$5=$syms+8|0;__zbar_image_scanner_recycle_syms($iscn,HEAP32[$5>>2]|0);HEAP32[$syms+12>>2]=0;HEAP32[$5>>2]=0;HEAP32[$syms+4>>2]=0;$_0=0;label=3;break;case 3:return $_0|0}return 0}function __zbar_image_scanner_add_sym($iscn,$sym){$iscn=$iscn|0;$sym=$sym|0;var $2=0,$3=0,$7=0,$8=0,$11=0,$24=0,$28=0,label=0;label=1;while(1)switch(label|0){case 1:_cache_sym($iscn,$sym);$2=HEAP32[$iscn+48>>2]|0;$3=$sym+44|0;if((HEAP32[$3>>2]|0)==0){label=2;break}else{label=3;break};case 2:$7=$2+12|0;$8=HEAP32[$7>>2]|0;if(($8|0)==0){label=3;break}else{label=4;break};case 3:$11=$2+8|0;HEAP32[$sym+32>>2]=HEAP32[$11>>2];HEAP32[$11>>2]=$sym;label=5;break;case 4:HEAP32[$sym+32>>2]=HEAP32[$8+32>>2];HEAP32[(HEAP32[$7>>2]|0)+32>>2]=$sym;label=5;break;case 5:if((HEAP32[$3>>2]|0)==0){label=6;break}else{label=7;break};case 6:$24=$2+4|0;HEAP32[$24>>2]=(HEAP32[$24>>2]|0)+1;label=9;break;case 7:$28=$2+12|0;if((HEAP32[$28>>2]|0)==0){label=8;break}else{label=9;break};case 8:HEAP32[$28>>2]=$sym;label=9;break;case 9:__zbar_symbol_refcnt390($sym);return}}function _cache_sym($iscn,$sym){$iscn=$iscn|0;$sym=$sym|0;var $5=0,$10=0,$13=0,$24=0,$entry_0=0,$29=0,$30=0,$32=0,$33=0,$35=0,$36=0,$37=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$iscn+92>>2]|0)==0){label=9;break}else{label=2;break};case 2:$5=_cache_lookup($iscn,$sym)|0;if(($5|0)==0){label=3;break}else{$entry_0=$5;label=4;break};case 3:$10=$sym+8|0;$13=__zbar_image_scanner_alloc_sym($iscn,HEAP32[$sym>>2]|0,(HEAP32[$10>>2]|0)+1|0)|0;_memcpy(HEAP32[$13+12>>2]|0,HEAP32[$sym+12>>2]|0,HEAP32[$10>>2]|0)|0;HEAP32[$13+40>>2]=(HEAP32[$sym+40>>2]|0)-2e3;HEAP32[$13+44>>2]=-3;$24=$iscn+96|0;HEAP32[$13+32>>2]=HEAP32[$24>>2];HEAP32[$24>>2]=$13;$entry_0=$13;label=4;break;case 4:$29=HEAP32[$sym+40>>2]|0;$30=$entry_0+40|0;$32=$29-(HEAP32[$30>>2]|0)|0;HEAP32[$30>>2]=$29;$33=$32>>>0<1e3;$35=$entry_0+44|0;$36=HEAP32[$35>>2]|0;$37=($36|0)>-1;if($32>>>0>1999|($37|$33)^1){label=5;break}else{label=6;break};case 5:HEAP32[$35>>2]=-3;label=8;break;case 6:if($37|$33){label=7;break}else{label=8;break};case 7:HEAP32[$35>>2]=$36+1;label=8;break;case 8:HEAP32[$sym+44>>2]=HEAP32[$35>>2];label=10;break;case 9:HEAP32[$sym+44>>2]=0;label=10;break;case 10:return}}function __zbar_symbol_refcnt390($sym){$sym=$sym|0;__zbar_refcnt387($sym+28|0,1)|0;return}function _zbar_image_scanner_create(){var $1=0,$2=0,$5=0,$7=0,$8=0,$10=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_calloc(1,156)|0;$2=$1;if(($1|0)==0){$_0=0;label=5;break}else{label=2;break};case 2:$5=_zbar_decoder_create()|0;$7=$1+4|0;HEAP32[$7>>2]=$5;$8=_zbar_scanner_create($5)|0;HEAP32[$1>>2]=$8;$10=HEAP32[$7>>2]|0;if(($10|0)==0|($8|0)==0){label=3;break}else{label=4;break};case 3:_zbar_image_scanner_destroy($2);$_0=0;label=5;break;case 4:_zbar_decoder_set_userdata($10,$1);_zbar_decoder_set_handler(HEAP32[$7>>2]|0,22)|0;HEAP32[$1+8>>2]=__zbar_qr_create()|0;HEAP32[$1+104>>2]=1;HEAP32[$1+108>>2]=1;_zbar_image_scanner_set_config($2,0,128,1)|0;$_0=$2;label=5;break;case 5:return $_0|0}return 0}function _zbar_image_scanner_destroy($iscn){$iscn=$iscn|0;var $1=0,$2=0,$12=0,$13=0,$17=0,$18=0,$23=0,$sym_020=0,$26=0,$29=0,$sym_020_1=0,$35=0,$38=0,$sym_020_2=0,$41=0,$44=0,$sym_020_3=0,$47=0,$50=0,$sym_020_4=0,$53=0,$55=0,$56=0,label=0;label=1;while(1)switch(label|0){case 1:_dump_stats($iscn);$1=$iscn+48|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=6;break}else{label=2;break};case 2:if((HEAP32[$2>>2]|0)==0){label=4;break}else{label=3;break};case 3:_zbar_symbol_set_ref($2,-1);label=5;break;case 4:__zbar_symbol_set_free($2);label=5;break;case 5:HEAP32[$1>>2]=0;label=6;break;case 6:$12=$iscn|0;$13=HEAP32[$12>>2]|0;if(($13|0)==0){label=8;break}else{label=7;break};case 7:_zbar_scanner_destroy($13);label=8;break;case 8:HEAP32[$12>>2]=0;$17=$iscn+4|0;$18=HEAP32[$17>>2]|0;if(($18|0)==0){label=10;break}else{label=9;break};case 9:_zbar_decoder_destroy($18);label=10;break;case 10:HEAP32[$17>>2]=0;$23=HEAP32[$iscn+56>>2]|0;if(($23|0)==0){label=12;break}else{$sym_020=$23;label=11;break};case 11:$26=HEAP32[$sym_020+32>>2]|0;__zbar_symbol_free($sym_020);if(($26|0)==0){label=12;break}else{$sym_020=$26;label=11;break};case 12:$29=HEAP32[$iscn+64>>2]|0;if(($29|0)==0){label=16;break}else{$sym_020_1=$29;label=15;break};case 13:__zbar_qr_destroy($56);HEAP32[$55>>2]=0;label=14;break;case 14:_free($iscn);return;case 15:$35=HEAP32[$sym_020_1+32>>2]|0;__zbar_symbol_free($sym_020_1);if(($35|0)==0){label=16;break}else{$sym_020_1=$35;label=15;break};case 16:$38=HEAP32[$iscn+72>>2]|0;if(($38|0)==0){label=18;break}else{$sym_020_2=$38;label=17;break};case 17:$41=HEAP32[$sym_020_2+32>>2]|0;__zbar_symbol_free($sym_020_2);if(($41|0)==0){label=18;break}else{$sym_020_2=$41;label=17;break};case 18:$44=HEAP32[$iscn+80>>2]|0;if(($44|0)==0){label=20;break}else{$sym_020_3=$44;label=19;break};case 19:$47=HEAP32[$sym_020_3+32>>2]|0;__zbar_symbol_free($sym_020_3);if(($47|0)==0){label=20;break}else{$sym_020_3=$47;label=19;break};case 20:$50=HEAP32[$iscn+88>>2]|0;if(($50|0)==0){label=22;break}else{$sym_020_4=$50;label=21;break};case 21:$53=HEAP32[$sym_020_4+32>>2]|0;__zbar_symbol_free($sym_020_4);if(($53|0)==0){label=22;break}else{$sym_020_4=$53;label=21;break};case 22:$55=$iscn+8|0;$56=HEAP32[$55>>2]|0;if(($56|0)==0){label=14;break}else{label=13;break}}}function _symbol_handler($dcode){$dcode=$dcode|0;var $1=0,$2=0,$3=0,$9=0,$10=0,$12=0,$18=0,$19=0,$22=0,$25=0,$28=0,$32=0,$35=0,$y_0=0,$x_0=0,$sym_038=0,$sym_039=0,$55=0,$sym_0=0,$65=0,$66=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_zbar_decoder_get_userdata($dcode)|0;$2=$1;$3=_zbar_decoder_get_type($dcode)|0;if($3>>>0<2){label=16;break}else{label=2;break};case 2:if(($3|0)==64){label=3;break}else{label=4;break};case 3:_qr_handler($2);label=16;break;case 4:$9=_zbar_decoder_get_data($dcode)|0;$10=_zbar_decoder_get_data_length($dcode)|0;$12=$1+100|0;if((HEAP32[$12>>2]&1|0)==0){$x_0=0;$y_0=0;label=6;break}else{label=5;break};case 5:$18=HEAP32[$1>>2]|0;$19=_zbar_scanner_get_width($18)|0;$22=HEAP32[$1+40>>2]|0;$25=HEAP32[$1+36>>2]|0;$28=(Math_imul(_zbar_scanner_get_edge($18,$19,0)|0,$25)|0)+$22|0;$32=(HEAP32[$1+28>>2]|0)==0;$35=HEAP32[$1+44>>2]|0;$x_0=$32?$35:$28;$y_0=$32?$28:$35;label=6;break;case 6:$sym_038=HEAP32[(HEAP32[$1+48>>2]|0)+8>>2]|0;if(($sym_038|0)==0){label=13;break}else{$sym_039=$sym_038;label=7;break};case 7:if((HEAP32[$sym_039>>2]|0)==($3|0)){label=8;break}else{label=12;break};case 8:if((HEAP32[$sym_039+8>>2]|0)==($10|0)){label=9;break}else{label=12;break};case 9:if((_memcmp(HEAP32[$sym_039+12>>2]|0,$9|0,$10|0)|0)==0){label=10;break}else{label=12;break};case 10:$55=$sym_039+48|0;HEAP32[$55>>2]=(HEAP32[$55>>2]|0)+1;if((HEAP32[$12>>2]&1|0)==0){label=16;break}else{label=11;break};case 11:_sym_add_point($sym_039,$x_0,$y_0);label=16;break;case 12:$sym_0=HEAP32[$sym_039+32>>2]|0;if(($sym_0|0)==0){label=13;break}else{$sym_039=$sym_0;label=7;break};case 13:$65=$10+1|0;$66=__zbar_image_scanner_alloc_sym($2,$3,$65)|0;_memcpy(HEAP32[$66+12>>2]|0,$9|0,$65)|0;if((HEAP32[$12>>2]&1|0)==0){label=15;break}else{label=14;break};case 14:_sym_add_point($66,$x_0,$y_0);label=15;break;case 15:__zbar_image_scanner_add_sym($2,$66);label=16;break;case 16:return}}function _zbar_image_scanner_set_config($iscn,$sym,$cfg,$val){$iscn=$iscn|0;$sym=$sym|0;$cfg=$cfg|0;$val=$val|0;var $cfg_off=0,$15=0,$19=0,$24=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if($cfg>>>0<128){label=2;break}else{label=3;break};case 2:$_0=_zbar_decoder_set_config(HEAP32[$iscn+4>>2]|0,$sym,$cfg,$val)|0;label=10;break;case 3:if($sym>>>0>1){$_0=1;label=10;break}else{label=4;break};case 4:$cfg_off=$cfg-256|0;if($cfg_off>>>0<2){label=5;break}else{label=6;break};case 5:HEAP32[$iscn+104+($cfg_off<<2)>>2]=$val;$_0=0;label=10;break;case 6:if($cfg>>>0>128){$_0=1;label=10;break}else{label=7;break};case 7:$15=$cfg-128|0;if(($val|0)==0){label=8;break}else if(($val|0)==1){label=9;break}else{$_0=1;label=10;break};case 8:$19=$iscn+100|0;HEAP32[$19>>2]=HEAP32[$19>>2]&(1<<$15^-1);$_0=0;label=10;break;case 9:$24=$iscn+100|0;HEAP32[$24>>2]=HEAP32[$24>>2]|1<<$15;$_0=0;label=10;break;case 10:return $_0|0}return 0}function _dump_stats($iscn){$iscn=$iscn|0;var $6=0,$11=0,$13=0,$18=0,$20=0,$25=0,$30=0,$35=0,$40=0,$45=0,$51=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:if((HEAP32[374]|0)>0){label=2;break}else{label=11;break};case 2:$6=HEAP32[$iscn+112>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,7536,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=$6,tempInt)|0)|0;if((HEAP32[374]|0)>0){label=3;break}else{label=11;break};case 3:$11=HEAP32[$iscn+116>>2]|0;$13=HEAP32[$iscn+120>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,7336,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=$11,HEAP32[tempInt+16>>2]=$13,tempInt)|0)|0;if((HEAP32[374]|0)>0){label=4;break}else{label=11;break};case 4:$18=HEAP32[$iscn+124>>2]|0;$20=HEAP32[$iscn+128>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6944,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=$18,HEAP32[tempInt+16>>2]=$20,tempInt)|0)|0;if((HEAP32[374]|0)>0){label=5;break}else{label=11;break};case 5:$25=HEAP32[$iscn+132>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6752,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=$25,tempInt)|0)|0;if((HEAP32[374]|0)>0){label=6;break}else{label=11;break};case 6:$30=HEAP32[$iscn+136>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6504,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=0,HEAP32[tempInt+16>>2]=$30,tempInt)|0)|0;if((HEAP32[374]|0)>0){label=7;break}else{label=11;break};case 7:$35=HEAP32[$iscn+140>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6504,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=1,HEAP32[tempInt+16>>2]=$35,tempInt)|0)|0;if((HEAP32[374]|0)>0){label=8;break}else{label=11;break};case 8:$40=HEAP32[$iscn+144>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6504,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=2,HEAP32[tempInt+16>>2]=$40,tempInt)|0)|0;if((HEAP32[374]|0)>0){label=9;break}else{label=11;break};case 9:$45=HEAP32[$iscn+148>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6504,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=3,HEAP32[tempInt+16>>2]=$45,tempInt)|0)|0;if((HEAP32[374]|0)>0){label=10;break}else{label=11;break};case 10:$51=HEAP32[$iscn+152>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6504,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=9232,HEAP32[tempInt+8>>2]=4,HEAP32[tempInt+16>>2]=$51,tempInt)|0)|0;label=11;break;case 11:STACKTOP=__stackBase__;return}}function _zbar_image_scanner_enable_cache($iscn,$enable){$iscn=$iscn|0;$enable=$enable|0;var $1=0,$2=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$iscn+96|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){label=3;break}else{label=2;break};case 2:__zbar_image_scanner_recycle_syms($iscn,$2);HEAP32[$1>>2]=0;label=3;break;case 3:HEAP32[$iscn+92>>2]=($enable|0)!=0&1;return}}function __zbar_image_scanner_alloc_sym($iscn,$type,$datalen){$iscn=$iscn|0;$type=$type|0;$datalen=$datalen|0;var $i_0=0,$i_1=0,$11=0,$14=0,$17=0,$20=0,$21=0,$28=0,$29=0,$sym_2=0,$49=0,$53=0,$54=0,$60=0,$61=0,label=0;label=1;while(1)switch(label|0){case 1:$i_0=0;label=2;break;case 2:if(($i_0|0)<4){label=3;break}else{$i_1=$i_0;label=4;break};case 3:if((1<<($i_0<<1)|0)<($datalen|0)){$i_0=$i_0+1|0;label=2;break}else{$i_1=$i_0;label=4;break};case 4:if(($i_1|0)>0){label=5;break}else{label=9;break};case 5:$11=HEAP32[$iscn+52+($i_1<<3)+4>>2]|0;if(($11|0)==0){$i_1=$i_1-1|0;label=4;break}else{label=6;break};case 6:$14=$iscn+136+($i_1<<2)|0;HEAP32[$14>>2]=(HEAP32[$14>>2]|0)+1;$17=$11+32|0;HEAP32[$iscn+52+($i_1<<3)+4>>2]=HEAP32[$17>>2];HEAP32[$17>>2]=0;$20=$iscn+52+($i_1<<3)|0;$21=HEAP32[$20>>2]|0;if(($21|0)==0){label=7;break}else{label=8;break};case 7:___assert_func(3960,237,9984,3736);return 0;case 8:HEAP32[$20>>2]=$21-1;$sym_2=$11;label=10;break;case 9:$28=_calloc(1,52)|0;$29=$iscn+132|0;HEAP32[$29>>2]=(HEAP32[$29>>2]|0)+1;$sym_2=$28;label=10;break;case 10:HEAP32[$sym_2>>2]=$type;HEAP32[$sym_2+48>>2]=1;HEAP32[$sym_2+20>>2]=0;HEAP32[$sym_2+44>>2]=0;HEAP32[$sym_2+40>>2]=HEAP32[$iscn+20>>2];if((HEAP32[$sym_2+36>>2]|0)==0){label=12;break}else{label=11;break};case 11:___assert_func(3960,251,9984,3208);return 0;case 12:if(($datalen|0)>0){label=13;break}else{label=17;break};case 13:HEAP32[$sym_2+8>>2]=$datalen-1;$49=$sym_2+4|0;if((HEAP32[$49>>2]|0)>>>0<$datalen>>>0){label=14;break}else{label=20;break};case 14:$53=$sym_2+12|0;$54=HEAP32[$53>>2]|0;if(($54|0)==0){label=16;break}else{label=15;break};case 15:_free($54);label=16;break;case 16:HEAP32[$49>>2]=$datalen;HEAP32[$53>>2]=_malloc($datalen)|0;label=20;break;case 17:$60=$sym_2+12|0;$61=HEAP32[$60>>2]|0;if(($61|0)==0){label=19;break}else{label=18;break};case 18:_free($61);label=19;break;case 19:HEAP32[$60>>2]=0;HEAP32[$sym_2+4>>2]=0;HEAP32[$sym_2+8>>2]=0;label=20;break;case 20:return $sym_2|0}return 0}function _zbar_scanner_get_width($scn){$scn=$scn|0;return HEAP32[$scn+44>>2]|0}function _zbar_scanner_get_edge($scn,$offset,$prec){$scn=$scn|0;$offset=$offset|0;$prec=$prec|0;var $4=0,$5=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$4=(HEAP32[$scn+40>>2]|0)-$offset-48|0;$5=5-$prec|0;if(($5|0)>0){label=2;break}else{label=3;break};case 2:$_0=$4>>>($5>>>0);label=5;break;case 3:if(($prec|0)==5){$_0=$4;label=5;break}else{label=4;break};case 4:$_0=$4<<-$5;label=5;break;case 5:return $_0|0}return 0}function _quiet_border($iscn){$iscn=$iscn|0;var $2=0;$2=HEAP32[$iscn>>2]|0;_zbar_scanner_flush($2)|0;_zbar_scanner_flush($2)|0;_zbar_scanner_new_scan($2)|0;return}function _sym_add_point($sym,$x,$y){$sym=$sym|0;$x=$x|0;$y=$y|0;var $1=0,$2=0,$3=0,$4=0,$5=0,$8=0,$10=0,$11=0,$16=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$sym+20|0;$2=HEAP32[$1>>2]|0;$3=$2+1|0;HEAP32[$1>>2]=$3;$4=$sym+16|0;$5=HEAP32[$4>>2]|0;if($3>>>0<$5>>>0){label=3;break}else{label=2;break};case 2:$8=$sym+24|0;$10=HEAP32[$8>>2]|0;$11=$5+1|0;HEAP32[$4>>2]=$11;HEAP32[$8>>2]=_realloc($10,$11<<3)|0;label=3;break;case 3:$16=$sym+24|0;HEAP32[(HEAP32[$16>>2]|0)+($2<<3)>>2]=$x;HEAP32[(HEAP32[$16>>2]|0)+($2<<3)+4>>2]=$y;return}}function _cache_lookup($iscn,$sym){$iscn=$iscn|0;$sym=$sym|0;var $1=0,$2=0,$9=0,$entry_0_ph19=0,$11=0,$19=0,$29=0,$34=0,$35=0,$entry_0_ph18=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$iscn+96|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){$entry_0_ph18=$1;label=10;break}else{label=2;break};case 2:$entry_0_ph19=$1;$9=$2;label=4;break;case 3:if(($35|0)==0){$entry_0_ph18=$34;label=10;break}else{$entry_0_ph19=$34;$9=$35;label=4;break};case 4:$11=$9;label=5;break;case 5:if((HEAP32[$11>>2]|0)==(HEAP32[$sym>>2]|0)){label=6;break}else{label=8;break};case 6:$19=HEAP32[$sym+8>>2]|0;if((HEAP32[$11+8>>2]|0)==($19|0)){label=7;break}else{label=8;break};case 7:if((_memcmp(HEAP32[$11+12>>2]|0,HEAP32[$sym+12>>2]|0,$19|0)|0)==0){$entry_0_ph18=$entry_0_ph19;label=10;break}else{label=8;break};case 8:$29=HEAP32[$entry_0_ph19>>2]|0;$34=$29+32|0;$35=HEAP32[$34>>2]|0;if(((HEAP32[$sym+40>>2]|0)-(HEAP32[$29+40>>2]|0)|0)>>>0>4e3){label=9;break}else{label=3;break};case 9:HEAP32[$34>>2]=0;__zbar_image_scanner_recycle_syms($iscn,HEAP32[$entry_0_ph19>>2]|0);HEAP32[$entry_0_ph19>>2]=$35;if(($35|0)==0){$entry_0_ph18=$entry_0_ph19;label=10;break}else{$11=$35;label=5;break};case 10:return HEAP32[$entry_0_ph18>>2]|0}return 0}function _zbar_scanner_create($dcode){$dcode=$dcode|0;var $1=0,$2=0;$1=_malloc(48)|0;$2=$1;HEAP32[$1>>2]=$dcode;HEAP32[$1+4>>2]=4;_zbar_scanner_reset($2)|0;return $2|0}function _zbar_scanner_reset($scn){$scn=$scn|0;var $7=0,label=0;label=1;while(1)switch(label|0){case 1:_memset($scn+8|0,0,40);HEAP32[$scn+32>>2]=HEAP32[$scn+4>>2];$7=HEAP32[$scn>>2]|0;if(($7|0)==0){label=3;break}else{label=2;break};case 2:_zbar_decoder_reset($7);label=3;break;case 3:return 0}return 0}function _zbar_scanner_destroy($scn){$scn=$scn|0;_free($scn);return}function _zbar_scanner_flush($scn){$scn=$scn|0;var $1=0,$2=0,$8=0,$9=0,$14=0,$20=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$scn+28|0;$2=HEAP32[$1>>2]|0;if(($2|0)==0){$_0=0;label=6;break}else{label=2;break};case 2:$8=HEAP32[$scn+8>>2]<<5|16;$9=$scn+36|0;if((HEAP32[$9>>2]|0)!=($8|0)|($2|0)>0){label=3;break}else{label=4;break};case 3:$14=_process_edge($scn)|0;HEAP32[$9>>2]=$8;HEAP32[$1>>2]=-(HEAP32[$1>>2]|0);$_0=$14;label=6;break;case 4:HEAP32[$scn+44>>2]=0;HEAP32[$1>>2]=0;$20=HEAP32[$scn>>2]|0;if(($20|0)==0){$_0=1;label=6;break}else{label=5;break};case 5:$_0=_zbar_decode_width($20,0)|0;label=6;break;case 6:return $_0|0}return 0}function _process_edge($scn){$scn=$scn|0;var $8=0,$15=0,$17=0,$20=0,$23=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[$scn+28>>2]|0)==0){label=2;break}else{label=3;break};case 2:HEAP32[$scn+36>>2]=48;HEAP32[$scn+40>>2]=48;label=5;break;case 3:$8=$scn+40|0;if((HEAP32[$8>>2]|0)==0){label=4;break}else{label=5;break};case 4:HEAP32[$8>>2]=HEAP32[$scn+36>>2];label=5;break;case 5:$15=$scn+36|0;$17=$scn+40|0;$20=$scn+44|0;HEAP32[$20>>2]=(HEAP32[$15>>2]|0)-(HEAP32[$17>>2]|0);HEAP32[$17>>2]=HEAP32[$15>>2];$23=HEAP32[$scn>>2]|0;if(($23|0)==0){$_0=1;label=7;break}else{label=6;break};case 6:$_0=_zbar_decode_width($23,HEAP32[$20>>2]|0)|0;label=7;break;case 7:return $_0|0}return 0}function _zbar_scanner_new_scan($scn){$scn=$scn|0;var $1=0,$edge_011=0,$4=0,$_edge_0=0,$edge_0_lcssa=0,$14=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$scn+28|0;if((HEAP32[$1>>2]|0)==0){$edge_0_lcssa=0;label=3;break}else{$edge_011=0;label=2;break};case 2:$4=_zbar_scanner_flush($scn)|0;$_edge_0=$4>>>0>$edge_011>>>0?$4:$edge_011;if((HEAP32[$1>>2]|0)==0){$edge_0_lcssa=$_edge_0;label=3;break}else{$edge_011=$_edge_0;label=2;break};case 3:_memset($scn+8|0,0,40);HEAP32[$scn+32>>2]=HEAP32[$scn+4>>2];$14=HEAP32[$scn>>2]|0;if(($14|0)==0){label=5;break}else{label=4;break};case 4:_zbar_decoder_new_scan($14);label=5;break;case 5:return $edge_0_lcssa|0}return 0}function _zbar_scan_y($scn,$y){$scn=$scn|0;$y=$y|0;var $1=0,$2=0,$6=0,$12=0,$y0_0_0=0,$y0_1_0=0,$24=0,$25=0,$28=0,$29=0,$30=0,$y1_1_0=0,$39=0,$42=0,$43=0,$55=0,$62=0,$edge_068=0,$70=0,$71=0,$73=0,$78=0,$edge_1=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$scn+8|0;$2=HEAP32[$1>>2]|0;$6=HEAP32[$scn+12+(($2+3&3)<<2)>>2]|0;if(($2|0)==0){label=3;break}else{label=2;break};case 2:$12=((($y-$6|0)*25&-1)>>5)+$6|0;HEAP32[$scn+12+(($2&3)<<2)>>2]=$12;$y0_1_0=$6;$y0_0_0=$12;label=4;break;case 3:HEAP32[$scn+24>>2]=$y;HEAP32[$scn+20>>2]=$y;HEAP32[$scn+16>>2]=$y;HEAP32[$scn+12>>2]=$y;$y0_1_0=$y;$y0_0_0=$y;label=4;break;case 4:$24=HEAP32[$scn+12+(($2+2&3)<<2)>>2]|0;$25=$2+1|0;$28=HEAP32[$scn+12+(($25&3)<<2)>>2]|0;$29=$y0_1_0-$24|0;$30=$24-$28|0;if(((($29|0)>-1?$29:-$29|0)|0)<((($30|0)>-1?$30:-$30|0)|0)){label=5;break}else{$y1_1_0=$29;label=6;break};case 5:$y1_1_0=($29>>>31|0)==($30>>>31|0)?$30:$29;label=6;break;case 6:$39=$y0_0_0-($y0_1_0<<1)+$24|0;$42=$y0_1_0-($24<<1)+$28|0;$43=($39|0)!=0;if($43){label=7;break}else{label=10;break};case 7:if(($39|0)>0){label=8;break}else{label=9;break};case 8:if(($42|0)<0){label=10;break}else{$edge_1=0;label=21;break};case 9:if(($42|0)>0){label=10;break}else{$edge_1=0;label=21;break};case 10:if((_calc_thresh($scn)|0)>>>0>(($y1_1_0|0)>-1?$y1_1_0:-$y1_1_0|0)>>>0){$edge_1=0;label=21;break}else{label=11;break};case 11:$55=$scn+28|0;if((HEAP32[$55>>2]|0)>0?($y1_1_0|0)<0:($y1_1_0|0)>0){label=12;break}else{label=13;break};case 12:$edge_068=_process_edge($scn)|0;label=14;break;case 13:$62=HEAP32[$55>>2]|0;if(((($62|0)>-1?$62:-$62|0)|0)<((($y1_1_0|0)>-1?$y1_1_0:-$y1_1_0|0)|0)){$edge_068=0;label=14;break}else{$edge_1=0;label=21;break};case 14:HEAP32[$55>>2]=$y1_1_0;$70=(((($y1_1_0|0)>-1?$y1_1_0:-$y1_1_0|0)*14&-1)+16|0)>>>5;$71=$scn+32|0;HEAP32[$71>>2]=$70;$73=HEAP32[$scn+4>>2]|0;if($70>>>0<$73>>>0){label=15;break}else{label=16;break};case 15:HEAP32[$71>>2]=$73;label=16;break;case 16:$78=$scn+36|0;HEAP32[$78>>2]=32;if(($39|0)==($42|0)){label=17;break}else{label=18;break};case 17:HEAP32[$78>>2]=16;label=20;break;case 18:if($43){label=19;break}else{label=20;break};case 19:HEAP32[$78>>2]=32-(($39<<5|1|0)/($39-$42|0)&-1);label=20;break;case 20:HEAP32[$78>>2]=(HEAP32[$78>>2]|0)+($2<<5);$edge_1=$edge_068;label=21;break;case 21:HEAP32[$1>>2]=$25;return $edge_1|0}return 0}function _zbar_scan_image($iscn,$img){$iscn=$iscn|0;$img=$img|0;var $abstime=0,$12=0,$15=0,$17=0,$18=0,$19=0,$22=0,$23=0,$syms_0=0,$30=0,$32=0,$34=0,$36=0,$37=0,$38=0,$45=0,$46=0,$_=0,$48=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$p_0222=0,$x_0221=0,$y_0220=0,$p_1206=0,$x_1205=0,$68=0,$p_1_lcssa=0,$x_1_lcssa=0,$79=0,$80=0,$81=0,$p_2213=0,$x_2212=0,$p_2_lcssa=0,$x_2_lcssa=0,$104=0,$109=0,$115=0,$116=0,$_186=0,$118=0,$121=0,$122=0,$123=0,$y4_0202=0,$p2_0201=0,$storemerge200=0,$136=0,$y4_1189=0,$p2_1188=0,$139=0,$y4_1_lcssa=0,$p2_1_lcssa=0,$150=0,$151=0,$152=0,$163=0,$y4_2193=0,$p2_2192=0,$y4_2_lcssa=0,$p2_2_lcssa=0,$177=0,$184=0,$197=0,$198=0,$200=0,$symp_0_ph225=0,$202=0,$211=0,$215=0,$217=0,$218=0,$223=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$abstime=__stackBase__|0;_gettimeofday($abstime|0,0)|0;HEAP32[$iscn+20>>2]=((((HEAP32[$abstime+4>>2]|0)/500&-1)+1|0)/2&-1)+((HEAP32[$abstime>>2]|0)*1e3&-1);$12=$iscn+8|0;__zbar_qr_reset(HEAP32[$12>>2]|0);$15=HEAP32[$img>>2]|0;if(($15|0)==808466521|($15|0)==1497715271){label=2;break}else{$_0=-1;label=59;break};case 2:$17=$iscn+24|0;HEAP32[$17>>2]=$img;_zbar_image_scanner_recycle_image($iscn,$img);$18=$iscn+48|0;$19=HEAP32[$18>>2]|0;if(($19|0)==0){label=3;break}else{label=4;break};case 3:$22=__zbar_symbol_set_create()|0;HEAP32[$18>>2]=$22;$23=$iscn+112|0;HEAP32[$23>>2]=(HEAP32[$23>>2]|0)+1;_zbar_symbol_set_ref($22,1);$syms_0=$22;label=5;break;case 4:_zbar_symbol_set_ref($19,2);$syms_0=$19;label=5;break;case 5:HEAP32[$img+48>>2]=$syms_0;$30=HEAP32[$img+4>>2]|0;$32=HEAP32[$img+8>>2]|0;$34=HEAP32[$img+12>>2]|0;$36=HEAP32[$iscn>>2]|0;$37=$iscn+108|0;$38=HEAP32[$37>>2]|0;if(($38|0)>0){label=6;break}else{label=24;break};case 6:HEAP32[$iscn+32>>2]=0;$45=(((($32-1|0)>>>0)%($38>>>0)>>>0)+1|0)>>>1;$46=$32>>>1;$_=$45>>>0>$46>>>0?$46:$45;$48=$iscn+44|0;HEAP32[$48>>2]=$_;_zbar_scanner_new_scan($36)|0;if($_>>>0<$32>>>0){label=7;break}else{label=24;break};case 7:$52=$34+(Math_imul($_,$30)|0)|0;$53=$iscn+36|0;$54=$iscn+28|0;$55=$iscn+40|0;$56=Math_imul($38,$30)|0;$57=$56-1|0;$y_0220=$_;$x_0221=0;$p_0222=$52;label=8;break;case 8:if((HEAP32[374]|0)>127){label=9;break}else{label=10;break};case 9:_fprintf(HEAP32[_stderr>>2]|0,2808,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=8592,HEAP32[tempInt+8>>2]=$x_0221,HEAP32[tempInt+16>>2]=$y_0220,HEAP32[tempInt+24>>2]=$p_0222,tempInt)|0)|0;label=10;break;case 10:HEAP32[$53>>2]=1;HEAP32[$54>>2]=1;HEAP32[$55>>2]=0;if($x_0221>>>0<$30>>>0){$x_1205=$x_0221;$p_1206=$p_0222;label=11;break}else{$x_1_lcssa=$x_0221;$p_1_lcssa=$p_0222;label=13;break};case 11:$68=$x_1205+1|0;_zbar_scan_y($36,HEAPU8[$p_1206]|0)|0;if($68>>>0<$30>>>0){$x_1205=$68;$p_1206=$p_1206+1|0;label=11;break}else{label=12;break};case 12:$x_1_lcssa=$30;$p_1_lcssa=$p_0222+($30-$x_0221)|0;label=13;break;case 13:if(($p_1_lcssa|0)==($34+($x_1_lcssa+(Math_imul($y_0220,$30)|0))|0)){label=15;break}else{label=14;break};case 14:___assert_func(3960,670,8592,2456);return 0;case 15:_quiet_border($iscn);$79=$x_1_lcssa-1|0;$80=$y_0220+$38|0;$81=$p_1_lcssa+$57|0;HEAP32[$48>>2]=$80;if($80>>>0<$32>>>0){label=16;break}else{label=24;break};case 16:if((HEAP32[374]|0)>127){label=17;break}else{label=18;break};case 17:_fprintf(HEAP32[_stderr>>2]|0,2104,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=8592,HEAP32[tempInt+8>>2]=$79,HEAP32[tempInt+16>>2]=$80,HEAP32[tempInt+24>>2]=$81,tempInt)|0)|0;label=18;break;case 18:HEAP32[$53>>2]=-1;HEAP32[$54>>2]=-1;HEAP32[$55>>2]=$30;if(($x_1_lcssa|0)>0){$x_2212=$79;$p_2213=$81;label=19;break}else{$x_2_lcssa=$79;$p_2_lcssa=$81;label=21;break};case 19:_zbar_scan_y($36,HEAPU8[$p_2213]|0)|0;if(($x_2212|0)>0){$x_2212=$x_2212-1|0;$p_2213=$p_2213-1|0;label=19;break}else{label=20;break};case 20:$x_2_lcssa=-1;$p_2_lcssa=$p_1_lcssa+($57-$x_1_lcssa)|0;label=21;break;case 21:if(($p_2_lcssa|0)==($34+($x_2_lcssa+(Math_imul($80,$30)|0))|0)){label=23;break}else{label=22;break};case 22:___assert_func(3960,688,8592,2456);return 0;case 23:_quiet_border($iscn);$104=$80+$38|0;HEAP32[$48>>2]=$104;if($104>>>0<$32>>>0){$y_0220=$104;$x_0221=$x_2_lcssa+1|0;$p_0222=$p_2_lcssa+($56+1)|0;label=8;break}else{label=24;break};case 24:HEAP32[$iscn+28>>2]=0;$109=HEAP32[$iscn+104>>2]|0;if(($109|0)>0){label=25;break}else{label=45;break};case 25:$115=(((($30-1|0)>>>0)%($109>>>0)>>>0)+1|0)>>>1;$116=$30>>>1;$_186=$115>>>0>$116>>>0?$116:$115;$118=$iscn+44|0;HEAP32[$118>>2]=$_186;if($_186>>>0<$30>>>0){label=26;break}else{label=45;break};case 26:$121=$iscn+36|0;$122=$iscn+32|0;$123=$iscn+40|0;$storemerge200=$_186;$p2_0201=$34+$_186|0;$y4_0202=0;label=27;break;case 27:if((HEAP32[374]|0)>127){label=28;break}else{label=29;break};case 28:_fprintf(HEAP32[_stderr>>2]|0,1784,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=8592,HEAP32[tempInt+8>>2]=$storemerge200,HEAP32[tempInt+16>>2]=$y4_0202,HEAP32[tempInt+24>>2]=$p2_0201,tempInt)|0)|0;label=29;break;case 29:HEAP32[$121>>2]=1;HEAP32[$122>>2]=1;HEAP32[$123>>2]=0;if($y4_0202>>>0<$32>>>0){label=30;break}else{$p2_1_lcssa=$p2_0201;$y4_1_lcssa=$y4_0202;label=33;break};case 30:$136=Math_imul($30,$32-$y4_0202|0)|0;$p2_1188=$p2_0201;$y4_1189=$y4_0202;label=31;break;case 31:$139=$y4_1189+1|0;_zbar_scan_y($36,HEAPU8[$p2_1188]|0)|0;if($139>>>0<$32>>>0){$p2_1188=$p2_1188+$30|0;$y4_1189=$139;label=31;break}else{label=32;break};case 32:$p2_1_lcssa=$p2_0201+$136|0;$y4_1_lcssa=$32;label=33;break;case 33:if(($p2_1_lcssa|0)==($34+((Math_imul($y4_1_lcssa,$30)|0)+$storemerge200)|0)){label=35;break}else{label=34;break};case 34:___assert_func(3960,721,8592,2456);return 0;case 35:_quiet_border($iscn);$150=$storemerge200+$109|0;$151=$y4_1_lcssa-1|0;$152=$p2_1_lcssa+($109-$30)|0;HEAP32[$118>>2]=$150;if($150>>>0<$30>>>0){label=36;break}else{label=45;break};case 36:if((HEAP32[374]|0)>127){label=37;break}else{label=38;break};case 37:_fprintf(HEAP32[_stderr>>2]|0,7720,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=8592,HEAP32[tempInt+8>>2]=$150,HEAP32[tempInt+16>>2]=$151,HEAP32[tempInt+24>>2]=$152,tempInt)|0)|0;label=38;break;case 38:HEAP32[$121>>2]=-1;HEAP32[$122>>2]=-1;HEAP32[$123>>2]=$32;if(($y4_1_lcssa|0)>0){label=39;break}else{$p2_2_lcssa=$152;$y4_2_lcssa=$151;label=42;break};case 39:$163=Math_imul($30,$y4_1_lcssa^-1)|0;$p2_2192=$152;$y4_2193=$151;label=40;break;case 40:_zbar_scan_y($36,HEAPU8[$p2_2192]|0)|0;if(($y4_2193|0)>0){$p2_2192=$p2_2192+(-$30|0)|0;$y4_2193=$y4_2193-1|0;label=40;break}else{label=41;break};case 41:$p2_2_lcssa=$p2_1_lcssa+($109+$163)|0;$y4_2_lcssa=-1;label=42;break;case 42:if(($p2_2_lcssa|0)==($34+((Math_imul($y4_2_lcssa,$30)|0)+$150)|0)){label=44;break}else{label=43;break};case 43:___assert_func(3960,739,8592,2456);return 0;case 44:_quiet_border($iscn);$177=$150+$109|0;HEAP32[$118>>2]=$177;if($177>>>0<$30>>>0){$storemerge200=$177;$p2_0201=$p2_2_lcssa+($109+$30)|0;$y4_0202=$y4_2_lcssa+1|0;label=27;break}else{label=45;break};case 45:HEAP32[$iscn+32>>2]=0;HEAP32[$17>>2]=0;__zbar_qr_decode(HEAP32[$12>>2]|0,$iscn,$img)|0;$184=$syms_0+4|0;if((HEAP32[$184>>2]|0)==0){label=58;break}else{label=46;break};case 46:if((HEAP32[$iscn+92>>2]|0)==0){label=47;break}else{label=55;break};case 47:if(($109|0)==1){label=49;break}else{label=48;break};case 48:if((HEAP32[$37>>2]|0)==1){label=49;break}else{label=55;break};case 49:$197=$syms_0+8|0;$198=HEAP32[$197>>2]|0;if(($198|0)==0){label=55;break}else{$symp_0_ph225=$197;$200=$198;label=50;break};case 50:$202=$200;label=51;break;case 51:if(((HEAP32[$202>>2]|0)-2|0)>>>0<23){label=52;break}else{label=54;break};case 52:if((HEAP32[$202+48>>2]|0)<3){label=53;break}else{label=54;break};case 53:$211=$202+32|0;HEAP32[$symp_0_ph225>>2]=HEAP32[$211>>2];HEAP32[$184>>2]=(HEAP32[$184>>2]|0)-1;HEAP32[$211>>2]=0;__zbar_image_scanner_recycle_syms($iscn,$202);$215=HEAP32[$symp_0_ph225>>2]|0;if(($215|0)==0){label=55;break}else{$202=$215;label=51;break};case 54:$217=$202+32|0;$218=HEAP32[$217>>2]|0;if(($218|0)==0){label=55;break}else{$symp_0_ph225=$217;$200=$218;label=50;break};case 55:if((HEAP32[$184>>2]|0)==0){label=58;break}else{label=56;break};case 56:$223=HEAP32[$iscn+16>>2]|0;if(($223|0)==0){label=58;break}else{label=57;break};case 57:FUNCTION_TABLE_vii[$223&63]($img,HEAP32[$iscn+12>>2]|0);label=58;break;case 58:$_0=HEAP32[$184>>2]|0;label=59;break;case 59:STACKTOP=__stackBase__;return $_0|0}return 0}function _qr_handler($iscn){$iscn=$iscn|0;var $3=0,$7=0,$8=0,$11=0,$12=0,$17=0,$19=0,$21=0,$26=0,$29=0,$31=0,$33=0,$37=0,$u_0=0,$43=0,$44=0,label=0;label=1;while(1)switch(label|0){case 1:$3=__zbar_decoder_get_qr_finder_line(HEAP32[$iscn+4>>2]|0)|0;if(($3|0)==0){label=2;break}else{label=3;break};case 2:___assert_func(3960,362,8856,6216);case 3:$7=$iscn|0;$8=HEAP32[$7>>2]|0;$11=_zbar_scanner_get_edge($8,HEAP32[$3>>2]|0,2)|0;$12=$3+12|0;HEAP32[$12>>2]=$11-(_zbar_scanner_get_edge($8,HEAP32[$12>>2]|0,2)|0);$17=$3+8|0;$19=_zbar_scanner_get_edge(HEAP32[$7>>2]|0,HEAP32[$17>>2]|0,2)|0;HEAP32[$17>>2]=$19;$21=$3+16|0;HEAP32[$21>>2]=(_zbar_scanner_get_edge(HEAP32[$7>>2]|0,HEAP32[$21>>2]|0,2)|0)-$19;$26=(HEAP32[$17>>2]|0)-$11|0;HEAP32[$17>>2]=$26;$29=HEAP32[$iscn+40>>2]<<2;$31=HEAP32[$iscn+36>>2]|0;$33=(Math_imul($31,$11)|0)+$29|0;if(($31|0)<0){label=4;break}else{$u_0=$33;label=5;break};case 4:$37=HEAP32[$12>>2]|0;HEAP32[$12>>2]=HEAP32[$21>>2];HEAP32[$21>>2]=$37;$u_0=$33-$26|0;label=5;break;case 5:$43=(HEAP32[$iscn+28>>2]|0)!=0&1;$44=$43^1;HEAP32[$3+($44<<2)>>2]=$u_0;HEAP32[$3+($43<<2)>>2]=HEAP32[$iscn+44>>2]<<2|2;__zbar_qr_found_line(HEAP32[$iscn+8>>2]|0,$44,$3)|0;return}}function _decode_e($e,$s){$e=$e|0;$s=$s|0;var $6=0;$6=(((($e*14&-1|1)>>>0)/($s>>>0)>>>0)+509|0)>>>1&255;return($6>>>0>3?-1:$6)|0}function _calc_thresh($scn){$scn=$scn|0;var $1=0,$2=0,$3=0,$4=0,$8=0,$21=0,$24=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$scn+32|0;$2=HEAP32[$1>>2]|0;$3=$scn+4|0;$4=HEAP32[$3>>2]|0;if($2>>>0>$4>>>0){label=2;break}else{label=3;break};case 2:$8=HEAP32[$scn+44>>2]|0;if(($8|0)==0){label=3;break}else{label=4;break};case 3:$_0=HEAP32[$3>>2]|0;label=7;break;case 4:$21=((Math_imul((HEAP32[$scn+8>>2]<<5)-(HEAP32[$scn+40>>2]|0)|0,$2)|0)>>>0)/($8>>>0)>>>0>>>3;if($2>>>0>$21>>>0){label=5;break}else{label=6;break};case 5:$24=$2-$21|0;if($24>>>0>$4>>>0){$_0=$24;label=7;break}else{label=6;break};case 6:HEAP32[$1>>2]=HEAP32[$3>>2];$_0=HEAP32[$3>>2]|0;label=7;break;case 7:return $_0|0}return 0}function __zbar_decoder_get_qr_finder_line($dcode){$dcode=$dcode|0;return $dcode+260|0}function _get_width($dcode,$offset){$dcode=$dcode|0;$offset=$offset|0;return HEAP32[$dcode+4+(((HEAPU8[$dcode|0]|0)-($offset&255)&15)<<2)>>2]|0}function _get_color($dcode){$dcode=$dcode|0;return HEAP8[$dcode|0]&1|0}function __zbar_qr_reset($reader){$reader=$reader|0;HEAP32[$reader+2836>>2]=0;HEAP32[$reader+2848>>2]=0;return}function _qr_code_data_list_init($_qrlist){$_qrlist=$_qrlist|0;HEAP32[$_qrlist>>2]=0;HEAP32[$_qrlist+8>>2]=0;HEAP32[$_qrlist+4>>2]=0;return}function _qr_point_ccw($_p0,$_p1,$_p2){$_p0=$_p0|0;$_p1=$_p1|0;$_p2=$_p2|0;var $2=0,$7=0,$9=0;$2=HEAP32[$_p0>>2]|0;$7=HEAP32[$_p0+4>>2]|0;$9=Math_imul((HEAP32[$_p2+4>>2]|0)-$7|0,(HEAP32[$_p1>>2]|0)-$2|0)|0;return $9-(Math_imul((HEAP32[$_p2>>2]|0)-$2|0,(HEAP32[$_p1+4>>2]|0)-$7|0)|0)|0}function __zbar_find_qr($dcode){$dcode=$dcode|0;var $1=0,$2=0,$4=0,$6=0,$27=0,$28=0,$35=0,$38=0,$39=0,$41=0,$42=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_get_width($dcode,6)|0;$2=$dcode+256|0;$4=(HEAP32[$2>>2]|0)-$1|0;HEAP32[$2>>2]=$4;$6=$4+(_get_width($dcode,1)|0)|0;HEAP32[$2>>2]=$6;if((_get_color($dcode)|0)<<24>>24!=0|$6>>>0<7){$_0=0;label=7;break}else{label=2;break};case 2:if((_decode_e(_pair_width($dcode,1)|0,$6)|0)==0){label=3;break}else{$_0=0;label=7;break};case 3:if((_decode_e(_pair_width($dcode,2)|0,$6)|0)==2){label=4;break}else{$_0=0;label=7;break};case 4:if((_decode_e(_pair_width($dcode,3)|0,$6)|0)==2){label=5;break}else{$_0=0;label=7;break};case 5:if((_decode_e(_pair_width($dcode,4)|0,$6)|0)==0){label=6;break}else{$_0=0;label=7;break};case 6:$27=_get_width($dcode,0)|0;$28=_get_width($dcode,1)|0;HEAP32[$dcode+276>>2]=(($28+1|0)>>>1)+$27;$35=$28+$27+(_get_width($dcode,2)|0)|0;HEAP32[$dcode+268>>2]=$35;$38=$35+(_get_width($dcode,3)|0)|0;$39=$dcode+260|0;HEAP32[$39>>2]=$38;HEAP32[$dcode+264>>2]=$38;$41=_get_width($dcode,5)|0;$42=HEAP32[$39>>2]|0;HEAP32[$dcode+272>>2]=(_get_width($dcode,4)|0)+$42+(($41+1|0)>>>1);$_0=64;label=7;break;case 7:return $_0|0}return 0}function _pair_width($dcode,$offset){$dcode=$dcode|0;$offset=$offset|0;var $1=0;$1=_get_width($dcode,$offset)|0;return(_get_width($dcode,$offset+1&255)|0)+$1|0}function __zbar_qr_create(){var $2=0;$2=_calloc(1,2856)|0;_qr_reader_init($2);return $2|0}function _qr_reader_init($reader){$reader=$reader|0;_isaac_init($reader+768|0,0,0);_rs_gf256_init($reader|0,29);return}function __zbar_qr_destroy($reader){$reader=$reader|0;var $6=0,$8=0,$12=0,$18=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:if((HEAP32[374]|0)>0){label=2;break}else{label=3;break};case 2:$6=HEAP32[$reader+2840>>2]|0;$8=HEAP32[$reader+2852>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,3848,(tempInt=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempInt>>2]=9696,HEAP32[tempInt+8>>2]=$6,HEAP32[tempInt+16>>2]=$8,tempInt)|0)|0;label=3;break;case 3:$12=HEAP32[$reader+2832>>2]|0;if(($12|0)==0){label=5;break}else{label=4;break};case 4:_free($12);label=5;break;case 5:$18=HEAP32[$reader+2844>>2]|0;if(($18|0)==0){label=7;break}else{label=6;break};case 6:_free($18);label=7;break;case 7:_free($reader|0);STACKTOP=__stackBase__;return}}function _qr_code_data_list_clear($_qrlist){$_qrlist=$_qrlist|0;var $1=0,$4=0,$5=0,$6=0,$i_05=0,$8=0,$11=0,$_lcssa=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$_qrlist+4|0;$4=$_qrlist|0;$5=HEAP32[$4>>2]|0;if((HEAP32[$1>>2]|0)>0){$i_05=0;$6=$5;label=2;break}else{$_lcssa=$5;label=3;break};case 2:_qr_code_data_clear($6+($i_05*48&-1)|0);$8=$i_05+1|0;$11=HEAP32[$4>>2]|0;if(($8|0)<(HEAP32[$1>>2]|0)){$i_05=$8;$6=$11;label=2;break}else{$_lcssa=$11;label=3;break};case 3:_free($_lcssa);_qr_code_data_list_init($_qrlist);return}}function _qr_code_data_clear($_qrdata){$_qrdata=$_qrdata|0;var $1=0,$4=0,$5=0,$6=0,$i_09=0,$8=0,$16=0,$19=0,$_lcssa=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$_qrdata+4|0;$4=$_qrdata|0;$5=HEAP32[$4>>2]|0;if((HEAP32[$1>>2]|0)>0){$i_09=0;$6=$5;label=2;break}else{$_lcssa=$5;label=5;break};case 2:$8=HEAP32[$6+($i_09*12&-1)>>2]|0;if(($8-1&$8|0)==0){label=3;break}else{label=4;break};case 3:_free(HEAP32[$6+($i_09*12&-1)+4>>2]|0);label=4;break;case 4:$16=$i_09+1|0;$19=HEAP32[$4>>2]|0;if(($16|0)<(HEAP32[$1>>2]|0)){$i_09=$16;$6=$19;label=2;break}else{$_lcssa=$19;label=5;break};case 5:_free($_lcssa);return}}function _qr_reader_match_centers($_reader,$_qrlist,$_centers,$_ncenters,$_img,$_width,$_height){$_reader=$_reader|0;$_qrlist=$_qrlist|0;$_centers=$_centers|0;$_ncenters=$_ncenters|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $c=0,$qrdata=0,$1=0,$3=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$i_0100=0,$14=0,$15=0,$j_097=0,$24=0,$25=0,$k_093=0,$31=0,$42=0,$48=0,$54=0,$60=0,$66=0,$72=0,$78=0,$84=0,$l_183=0,$ninside_082=0,$87=0,$91=0,$ninside_1=0,$106=0,$111=0,$112=0,$l_285=0,$ninside_284=0,$120=0,$121=0,$ninside_3=0,$123=0,$l_390=0,$125=0,$130=0,$132=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+64|0;label=1;while(1)switch(label|0){case 1:$c=__stackBase__|0;$qrdata=__stackBase__+16|0;$1=_calloc($_ncenters,1)|0;if(($_ncenters|0)>0){label=2;break}else{label=29;break};case 2:$3=$c|0;$6=$_qrlist+4|0;$7=$_qrlist|0;$8=$qrdata+16|0;$9=$qrdata+24|0;$10=$qrdata+40|0;$11=$qrdata+32|0;$i_0100=0;label=4;break;case 3:if(($14|0)<($_ncenters|0)){$i_0100=$14;label=4;break}else{label=29;break};case 4:$14=$i_0100+1|0;$15=$1+$i_0100|0;if((HEAP8[$15]|0)==0&($14|0)<($_ncenters|0)){label=5;break}else{label=3;break};case 5:$j_097=$14;label=7;break;case 6:if((HEAP8[$15]|0)==0&($24|0)<($_ncenters|0)){$j_097=$24;label=7;break}else{label=3;break};case 7:$24=$j_097+1|0;$25=$1+$j_097|0;if((HEAP8[$25]|0)==0&($24|0)<($_ncenters|0)){label=8;break}else{label=6;break};case 8:$k_093=$24;label=9;break;case 9:$31=$1+$k_093|0;if((HEAP8[$31]|0)==0){label=10;break}else{label=28;break};case 10:HEAP32[$3>>2]=$_centers+($i_0100<<4);HEAP32[$c+4>>2]=$_centers+($j_097<<4);HEAP32[$c+8>>2]=$_centers+($k_093<<4);if((_qr_reader_try_configuration($_reader,$qrdata,$_img,$_width,$_height,$3)|0)>-1){label=11;break}else{label=28;break};case 11:_qr_code_data_list_add($_qrlist,$qrdata);$42=(HEAP32[$7>>2]|0)+(((HEAP32[$6>>2]|0)-1|0)*48&-1)+16|0;HEAP32[$42>>2]=HEAP32[$42>>2]>>2;$48=(HEAP32[$7>>2]|0)+(((HEAP32[$6>>2]|0)-1|0)*48&-1)+20|0;HEAP32[$48>>2]=HEAP32[$48>>2]>>2;$54=(HEAP32[$7>>2]|0)+(((HEAP32[$6>>2]|0)-1|0)*48&-1)+24|0;HEAP32[$54>>2]=HEAP32[$54>>2]>>2;$60=(HEAP32[$7>>2]|0)+(((HEAP32[$6>>2]|0)-1|0)*48&-1)+28|0;HEAP32[$60>>2]=HEAP32[$60>>2]>>2;$66=(HEAP32[$7>>2]|0)+(((HEAP32[$6>>2]|0)-1|0)*48&-1)+32|0;HEAP32[$66>>2]=HEAP32[$66>>2]>>2;$72=(HEAP32[$7>>2]|0)+(((HEAP32[$6>>2]|0)-1|0)*48&-1)+36|0;HEAP32[$72>>2]=HEAP32[$72>>2]>>2;$78=(HEAP32[$7>>2]|0)+(((HEAP32[$6>>2]|0)-1|0)*48&-1)+40|0;HEAP32[$78>>2]=HEAP32[$78>>2]>>2;$84=(HEAP32[$7>>2]|0)+(((HEAP32[$6>>2]|0)-1|0)*48&-1)+44|0;HEAP32[$84>>2]=HEAP32[$84>>2]>>2;HEAP8[$31]=1;HEAP8[$25]=1;HEAP8[$15]=1;$ninside_082=0;$l_183=0;label=12;break;case 12:$87=$1+$l_183|0;if((HEAP8[$87]|0)==0){label=13;break}else{$ninside_1=$ninside_082;label=18;break};case 13:$91=$_centers+($l_183<<4)|0;if((_qr_point_ccw($8,$9,$91)|0)>-1){label=14;break}else{$ninside_1=$ninside_082;label=18;break};case 14:if((_qr_point_ccw($9,$10,$91)|0)>-1){label=15;break}else{$ninside_1=$ninside_082;label=18;break};case 15:if((_qr_point_ccw($10,$11,$91)|0)>-1){label=16;break}else{$ninside_1=$ninside_082;label=18;break};case 16:if((_qr_point_ccw($11,$8,$91)|0)>-1){label=17;break}else{$ninside_1=$ninside_082;label=18;break};case 17:HEAP8[$87]=2;$ninside_1=$ninside_082+1|0;label=18;break;case 18:$106=$l_183+1|0;if(($106|0)<($_ncenters|0)){$ninside_082=$ninside_1;$l_183=$106;label=12;break}else{label=19;break};case 19:if(($ninside_1|0)>2){label=20;break}else{$l_390=0;label=25;break};case 20:$111=_malloc($ninside_1<<4)|0;$112=$111;$ninside_284=0;$l_285=0;label=21;break;case 21:if((HEAP8[$1+$l_285|0]|0)==2){label=22;break}else{$ninside_3=$ninside_284;label=23;break};case 22:$120=$112+($ninside_284<<4)|0;$121=$_centers+($l_285<<4)|0;HEAP32[$120>>2]=HEAP32[$121>>2];HEAP32[$120+4>>2]=HEAP32[$121+4>>2];HEAP32[$120+8>>2]=HEAP32[$121+8>>2];HEAP32[$120+12>>2]=HEAP32[$121+12>>2];$ninside_3=$ninside_284+1|0;label=23;break;case 23:$123=$l_285+1|0;if(($123|0)<($_ncenters|0)){$ninside_284=$ninside_3;$l_285=$123;label=21;break}else{label=24;break};case 24:_qr_reader_match_centers($_reader,$_qrlist,$112,$ninside_3,$_img,$_width,$_height);_free($111);$l_390=0;label=25;break;case 25:$125=$1+$l_390|0;if((HEAP8[$125]|0)==2){label=26;break}else{label=27;break};case 26:HEAP8[$125]=1;label=27;break;case 27:$130=$l_390+1|0;if(($130|0)<($_ncenters|0)){$l_390=$130;label=25;break}else{label=28;break};case 28:$132=$k_093+1|0;if((HEAP8[$25]|0)==0&($132|0)<($_ncenters|0)){$k_093=$132;label=9;break}else{label=6;break};case 29:_free($1);STACKTOP=__stackBase__;return}}function _qr_reader_try_configuration($_reader,$_qrdata,$_img,$_width,$_height,$_c){$_reader=$_reader|0;$_qrdata=$_qrdata|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;$_c=$_c|0;var $ci=0,$aff=0,$hom=0,$ul=0,$ur=0,$dl=0,$3=0,$6=0,$9=0,$_lobit=0,$14=0,$17=0,$24=0,$35=0,$36=0,$i_0_i0_0_1=0,$51=0,$52=0,$53=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=0,$68=0,$69=0,$70=0,$73=0,$74=0,$i_178=0,$80=0,$89=0,$95=0,$103=0,$113=0,$117=0,$127=0,$133=0,$140=0,$146=0,$152=0,$160=0,$166=0,$170=0,$171=0,$175=0,$182=0,$184=0,$ur_version_0=0,$191=0,$193=0,$dl_version_0=0,$198=0,$ur_version_1=0,$215=0,$221=0,$225=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+392|0;label=1;while(1)switch(label|0){case 1:$ci=__stackBase__|0;$aff=__stackBase__+32|0;$hom=__stackBase__+80|0;$ul=__stackBase__+152|0;$ur=__stackBase__+232|0;$dl=__stackBase__+312|0;$3=$_c+4|0;$6=$_c+8|0;$9=_qr_point_ccw(HEAP32[$_c>>2]|0,HEAP32[$3>>2]|0,HEAP32[$6>>2]|0)|0;if(($9|0)==0){$_0=-1;label=27;break}else{label=2;break};case 2:HEAP32[$ci>>2]=0;HEAP32[$ci+12>>2]=0;HEAP32[$ci+24>>2]=0;$_lobit=$9>>>31;$14=$_lobit+1|0;HEAP32[$ci+4>>2]=$14;HEAP32[$ci+16>>2]=$14;$17=2-$_lobit|0;HEAP32[$ci+8>>2]=$17;HEAP32[$ci+20>>2]=$17;$24=_qr_point_distance2(HEAP32[$3>>2]|0,HEAP32[$6>>2]|0)|0;$35=_qr_point_distance2(HEAP32[$_c+(HEAP32[$ci+8>>2]<<2)>>2]|0,HEAP32[$_c+(HEAP32[$ci+12>>2]<<2)>>2]|0)|0;$36=$35>>>0>$24>>>0;$i_0_i0_0_1=(_qr_point_distance2(HEAP32[$_c+(HEAP32[$ci+12>>2]<<2)>>2]|0,HEAP32[$_c+(HEAP32[$ci+16>>2]<<2)>>2]|0)|0)>>>0>($36?$35:$24)>>>0?2:$36&1;$51=$ul+72|0;$52=$ur+72|0;$53=$dl+72|0;$62=28-(_qr_ilog($_width-1-($_width-$_height&-(($_height|0)>($_width|0)&1))|0)|0)|0;$63=$ur+64|0;$64=1<<$62;$65=$dl+64|0;$66=$ur+12|0;$67=$dl+8|0;$68=$ul+64|0;$69=$ul+12|0;$70=$ul+8|0;$73=$dl+68|0;$74=$ul+68|0;$i_178=$i_0_i0_0_1;label=3;break;case 3:HEAP32[$51>>2]=HEAP32[$_c+(HEAP32[$ci+($i_178<<2)>>2]<<2)>>2];$80=$i_178+1|0;HEAP32[$52>>2]=HEAP32[$_c+(HEAP32[$ci+($80<<2)>>2]<<2)>>2];$89=HEAP32[$_c+(HEAP32[$ci+($i_178+2<<2)>>2]<<2)>>2]|0;HEAP32[$53>>2]=$89;_qr_aff_init($aff,HEAP32[$51>>2]|0,HEAP32[$52>>2]|0,$89|0,$62);$95=HEAP32[$52>>2]|0;_qr_aff_unproject($63,$aff,HEAP32[$95>>2]|0,HEAP32[$95+4>>2]|0);_qr_finder_edge_pts_aff_classify($ur,$aff);if((_qr_finder_estimate_module_size_and_version($ur,$64,$64)|0)<0){label=20;break}else{label=4;break};case 4:$103=HEAP32[$53>>2]|0;_qr_aff_unproject($65,$aff,HEAP32[$103>>2]|0,HEAP32[$103+4>>2]|0);_qr_finder_edge_pts_aff_classify($dl,$aff);if((_qr_finder_estimate_module_size_and_version($dl,$64,$64)|0)<0){label=20;break}else{label=5;break};case 5:$113=(HEAP32[$66>>2]|0)-(HEAP32[$67>>2]|0)|0;if(((($113|0)>-1?$113:-$113|0)|0)>3){label=20;break}else{label=6;break};case 6:$117=HEAP32[$51>>2]|0;_qr_aff_unproject($68,$aff,HEAP32[$117>>2]|0,HEAP32[$117+4>>2]|0);_qr_finder_edge_pts_aff_classify($ul,$aff);if((_qr_finder_estimate_module_size_and_version($ul,$64,$64)|0)<0){label=20;break}else{label=7;break};case 7:$127=(HEAP32[$69>>2]|0)-(HEAP32[$66>>2]|0)|0;if(((($127|0)>-1?$127:-$127|0)|0)>3){label=20;break}else{label=8;break};case 8:$133=(HEAP32[$70>>2]|0)-(HEAP32[$67>>2]|0)|0;if(((($133|0)>-1?$133:-$133|0)|0)>3){label=20;break}else{label=9;break};case 9:if((_qr_hom_fit($hom,$ul,$ur,$dl,$_qrdata+16|0,$aff,$_reader+768|0,$_img,$_width,$_height)|0)<0){label=20;break}else{label=10;break};case 10:$140=HEAP32[$51>>2]|0;_qr_hom_unproject($68,$hom,HEAP32[$140>>2]|0,HEAP32[$140+4>>2]|0)|0;$146=HEAP32[$52>>2]|0;_qr_hom_unproject($63,$hom,HEAP32[$146>>2]|0,HEAP32[$146+4>>2]|0)|0;$152=HEAP32[$53>>2]|0;_qr_hom_unproject($65,$hom,HEAP32[$152>>2]|0,HEAP32[$152+4>>2]|0)|0;_qr_finder_edge_pts_hom_classify($ur,$hom);$160=(HEAP32[$63>>2]|0)-(HEAP32[$68>>2]|0)|0;if((_qr_finder_estimate_module_size_and_version($ur,$160,$160)|0)<0){label=20;break}else{label=11;break};case 11:_qr_finder_edge_pts_hom_classify($dl,$hom);$166=(HEAP32[$73>>2]|0)-(HEAP32[$74>>2]|0)|0;if((_qr_finder_estimate_module_size_and_version($dl,$166,$166)|0)<0){label=20;break}else{label=12;break};case 12:$170=HEAP32[$66>>2]|0;$171=HEAP32[$67>>2]|0;if(($170|0)==($171|0)&($170|0)<7){$ur_version_1=$170;label=22;break}else{label=13;break};case 13:$175=$170-$171|0;if(((($175|0)>-1?$175:-$175|0)|0)>3){label=20;break}else{label=14;break};case 14:if((HEAP32[$66>>2]|0)>3){label=15;break}else{$ur_version_0=-1;label=16;break};case 15:$182=_qr_finder_version_decode($ur,$hom,$_img,$_width,$_height,0)|0;$184=$182-(HEAP32[$66>>2]|0)|0;$ur_version_0=((($184|0)>-1?$184:-$184|0)|0)>3?-1:$182;label=16;break;case 16:if((HEAP32[$67>>2]|0)>3){label=17;break}else{$dl_version_0=-1;label=18;break};case 17:$191=_qr_finder_version_decode($dl,$hom,$_img,$_width,$_height,1)|0;$193=$191-(HEAP32[$67>>2]|0)|0;$dl_version_0=((($193|0)>-1?$193:-$193|0)|0)>3?-1:$191;label=18;break;case 18:$198=($dl_version_0|0)<0;if(($ur_version_0|0)>-1){label=19;break}else{label=21;break};case 19:if($198|($dl_version_0|0)==($ur_version_0|0)){$ur_version_1=$ur_version_0;label=22;break}else{label=20;break};case 20:if(($80|0)<($i_0_i0_0_1+3|0)){$i_178=$80;label=3;break}else{$_0=-1;label=27;break};case 21:if($198){label=20;break}else{$ur_version_1=$dl_version_0;label=22;break};case 22:_qr_finder_edge_pts_hom_classify($ul,$hom);if((_qr_finder_estimate_module_size_and_version($ul,(HEAP32[$63>>2]|0)-(HEAP32[$65>>2]|0)|0,(HEAP32[$73>>2]|0)-(HEAP32[$74>>2]|0)|0)|0)<0){label=20;break}else{label=23;break};case 23:$215=(HEAP32[$69>>2]|0)-(HEAP32[$66>>2]|0)|0;if(((($215|0)>-1?$215:-$215|0)|0)>1){label=20;break}else{label=24;break};case 24:$221=(HEAP32[$70>>2]|0)-(HEAP32[$67>>2]|0)|0;if(((($221|0)>-1?$221:-$221|0)|0)>1){label=20;break}else{label=25;break};case 25:$225=_qr_finder_fmt_info_decode($ul,$ur,$dl,$hom,$_img,$_width,$_height)|0;if(($225|0)<0){label=20;break}else{label=26;break};case 26:if((_qr_code_decode($_qrdata,$_reader|0,HEAP32[$51>>2]|0,HEAP32[$52>>2]|0,HEAP32[$53>>2]|0,$ur_version_1,$225,$_img,$_width,$_height)|0)<0){label=20;break}else{$_0=$ur_version_1;label=27;break};case 27:STACKTOP=__stackBase__;return $_0|0}return 0}function _qr_code_data_list_add($_qrlist,$_qrdata){$_qrlist=$_qrlist|0;$_qrdata=$_qrdata|0;var $1=0,$3=0,$4=0,$8=0,$9=0,$17=0,$18=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$_qrlist+4|0;$3=$_qrlist+8|0;$4=HEAP32[$3>>2]|0;if((HEAP32[$1>>2]|0)<($4|0)){label=3;break}else{label=2;break};case 2:$8=$4<<1|1;HEAP32[$3>>2]=$8;$9=$_qrlist|0;HEAP32[$9>>2]=_realloc(HEAP32[$9>>2]|0,$8*48&-1)|0;label=3;break;case 3:$17=HEAP32[$_qrlist>>2]|0;$18=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$18+1;_memcpy($17+($18*48&-1)|0,$_qrdata|0,48)|0;return}}function __zbar_qr_found_line($reader,$dir,$line){$reader=$reader|0;$dir=$dir|0;$line=$line|0;var $1=0,$2=0,$4=0,$5=0,$9=0,$11=0,$12=0,$18=0,$19=0,$22=0,$23=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$reader+2832+($dir*12&-1)|0;$2=$reader+2832+($dir*12&-1)+4|0;$4=$reader+2832+($dir*12&-1)+8|0;$5=HEAP32[$4>>2]|0;if((HEAP32[$2>>2]|0)<($5|0)){label=3;break}else{label=2;break};case 2:$9=$1|0;$11=HEAP32[$9>>2]|0;$12=$5<<1|1;HEAP32[$4>>2]=$12;HEAP32[$9>>2]=_realloc($11,$12*20&-1)|0;label=3;break;case 3:$18=HEAP32[$1>>2]|0;$19=HEAP32[$2>>2]|0;HEAP32[$2>>2]=$19+1;$22=$18+($19*20&-1)|0;$23=$line;HEAP32[$22>>2]=HEAP32[$23>>2];HEAP32[$22+4>>2]=HEAP32[$23+4>>2];HEAP32[$22+8>>2]=HEAP32[$23+8>>2];HEAP32[$22+12>>2]=HEAP32[$23+12>>2];HEAP32[$22+16>>2]=HEAP32[$23+16>>2];return 0}return 0}function _qr_finder_vline_cmp($_a,$_b){$_a=$_a|0;$_b=$_b|0;var $2=0,$4=0,$13=0,$16=0;$2=HEAP32[$_a>>2]|0;$4=HEAP32[$_b>>2]|0;$13=HEAP32[$_a+4>>2]|0;$16=HEAP32[$_b+4>>2]|0;return((($2|0)>($4|0)&1)-(($2|0)<($4|0)&1)<<1|($13|0)>($16|0)&1)-(($13|0)<($16|0)&1)|0}function _qr_finder_lines_are_crossing($_hline,$_vline){$_hline=$_hline|0;$_vline=$_vline|0;var $2=0,$4=0,$13=0,$15=0,$23=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$_hline>>2]|0;$4=HEAP32[$_vline>>2]|0;if(($2|0)>($4|0)){$23=0;label=5;break}else{label=2;break};case 2:if(($4|0)<((HEAP32[$_hline+8>>2]|0)+$2|0)){label=3;break}else{$23=0;label=5;break};case 3:$13=HEAP32[$_vline+4>>2]|0;$15=HEAP32[$_hline+4>>2]|0;if(($13|0)>($15|0)){$23=0;label=5;break}else{label=4;break};case 4:$23=($15|0)<((HEAP32[$_vline+8>>2]|0)+$13|0)&1;label=5;break;case 5:return $23|0}return 0}function _qr_finder_edge_pts_fill($_edge_pts,$_nedge_pts,$_neighbors,$_nneighbors,$_v){$_edge_pts=$_edge_pts|0;$_nedge_pts=$_nedge_pts|0;$_neighbors=$_neighbors|0;$_nneighbors=$_nneighbors|0;$_v=$_v|0;var $_035=0,$i_034=0,$3=0,$4=0,$_133=0,$j_032=0,$11=0,$12=0,$23=0,$_2=0,$28=0,$42=0,$_3=0,$47=0,$_1_lcssa=0,$50=0,$_0_lcssa=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_nneighbors|0)>0){$i_034=0;$_035=$_nedge_pts;label=2;break}else{$_0_lcssa=$_nedge_pts;label=10;break};case 2:$3=HEAP32[$_neighbors+($i_034<<2)>>2]|0;$4=$3+4|0;if((HEAP32[$4>>2]|0)>0){label=3;break}else{$_1_lcssa=$_035;label=9;break};case 3:$j_032=0;$_133=$_035;label=4;break;case 4:$11=HEAP32[(HEAP32[$3>>2]|0)+($j_032<<2)>>2]|0;$12=$11+12|0;if((HEAP32[$12>>2]|0)>0){label=5;break}else{$_2=$_133;label=6;break};case 5:HEAP32[$_edge_pts+($_133<<4)>>2]=HEAP32[$11>>2];HEAP32[$_edge_pts+($_133<<4)+4>>2]=HEAP32[$11+4>>2];$23=$_edge_pts+($_133<<4)+($_v<<2)|0;HEAP32[$23>>2]=(HEAP32[$23>>2]|0)-(HEAP32[$12>>2]|0);$_2=$_133+1|0;label=6;break;case 6:$28=$11+16|0;if((HEAP32[$28>>2]|0)>0){label=7;break}else{$_3=$_2;label=8;break};case 7:HEAP32[$_edge_pts+($_2<<4)>>2]=HEAP32[$11>>2];HEAP32[$_edge_pts+($_2<<4)+4>>2]=HEAP32[$11+4>>2];$42=$_edge_pts+($_2<<4)+($_v<<2)|0;HEAP32[$42>>2]=(HEAP32[$28>>2]|0)+(HEAP32[$11+8>>2]|0)+(HEAP32[$42>>2]|0);$_3=$_2+1|0;label=8;break;case 8:$47=$j_032+1|0;if(($47|0)<(HEAP32[$4>>2]|0)){$j_032=$47;$_133=$_3;label=4;break}else{$_1_lcssa=$_3;label=9;break};case 9:$50=$i_034+1|0;if(($50|0)<($_nneighbors|0)){$i_034=$50;$_035=$_1_lcssa;label=2;break}else{$_0_lcssa=$_1_lcssa;label=10;break};case 10:return $_0_lcssa|0}return 0}function _qr_finder_center_cmp($_a,$_b){$_a=$_a|0;$_b=$_b|0;var $3=0,$6=0,$15=0,$18=0,$27=0,$29=0;$3=HEAP32[$_b+12>>2]|0;$6=HEAP32[$_a+12>>2]|0;$15=HEAP32[$_a+4>>2]|0;$18=HEAP32[$_b+4>>2]|0;$27=HEAP32[$_a>>2]|0;$29=HEAP32[$_b>>2]|0;return(((($15|0)>($18|0)&1)-(($15|0)<($18|0)&1)<<1)+((($3|0)>($6|0)&1)-(($3|0)<($6|0)&1)<<2)|($27|0)>($29|0)&1)-(($27|0)<($29|0)&1)|0}function _qr_point_distance2($_p1,$_p2){$_p1=$_p1|0;$_p2=$_p2|0;var $3=0,$4=0,$9=0;$3=(HEAP32[$_p1>>2]|0)-(HEAP32[$_p2>>2]|0)|0;$4=Math_imul($3,$3)|0;$9=(HEAP32[$_p1+4>>2]|0)-(HEAP32[$_p2+4>>2]|0)|0;return(Math_imul($9,$9)|0)+$4|0}function _qr_aff_unproject($_q,$_aff,$_x,$_y){$_q=$_q|0;$_aff=$_aff|0;$_x=$_x|0;$_y=$_y|0;var $3=0,$6=0,$9=0,$18=0;$3=$_aff+32|0;$6=Math_imul($_x-(HEAP32[$3>>2]|0)|0,HEAP32[$_aff+16>>2]|0)|0;$9=$_aff+36|0;HEAP32[$_q>>2]=(Math_imul($_y-(HEAP32[$9>>2]|0)|0,HEAP32[$_aff+20>>2]|0)|0)+$6;$18=Math_imul($_x-(HEAP32[$3>>2]|0)|0,HEAP32[$_aff+24>>2]|0)|0;HEAP32[$_q+4>>2]=(Math_imul($_y-(HEAP32[$9>>2]|0)|0,HEAP32[$_aff+28>>2]|0)|0)+$18;return}function __zbar_qr_decode($reader,$iscn,$img){$reader=$reader|0;$iscn=$iscn|0;$img=$img|0;var $edge_pts=0,$centers=0,$qrlist=0,$1=0,$5=0,$9=0,$14=0,$15=0,$22=0,$24=0,$26=0,$37=0,$42=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+32|0;label=1;while(1)switch(label|0){case 1:$edge_pts=__stackBase__|0;$centers=__stackBase__+8|0;$qrlist=__stackBase__+16|0;HEAP32[$edge_pts>>2]=0;HEAP32[$centers>>2]=0;$1=$reader+2836|0;if((HEAP32[$1>>2]|0)<9){label=13;break}else{label=2;break};case 2:$5=$reader+2848|0;if((HEAP32[$5>>2]|0)<9){label=13;break}else{label=3;break};case 3:$9=_qr_finder_centers_locate($centers,$edge_pts,$reader)|0;if((HEAP32[374]|0)>13){label=4;break}else{label=5;break};case 4:$14=HEAP32[$1>>2]|0;$15=HEAP32[$5>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,6808,(tempInt=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempInt>>2]=9720,HEAP32[tempInt+8>>2]=$14,HEAP32[tempInt+16>>2]=$15,HEAP32[tempInt+24>>2]=$9,tempInt)|0)|0;label=5;break;case 5:if(($9|0)>2){label=6;break}else{label=9;break};case 6:$22=$img+4|0;$24=$img+8|0;$26=_qr_binarize(HEAP32[$img+12>>2]|0,HEAP32[$22>>2]|0,HEAP32[$24>>2]|0)|0;_qr_code_data_list_init($qrlist);_qr_reader_match_centers($reader,$qrlist,HEAP32[$centers>>2]|0,$9,$26,HEAP32[$22>>2]|0,HEAP32[$24>>2]|0);if((HEAP32[$qrlist+4>>2]|0)>0){label=7;break}else{label=8;break};case 7:_qr_code_data_list_extract_text($qrlist,$iscn,$img)|0;label=8;break;case 8:_qr_code_data_list_clear($qrlist);_free($26);label=9;break;case 9:$37=HEAP32[$centers>>2]|0;if(($37|0)==0){label=11;break}else{label=10;break};case 10:_free($37);label=11;break;case 11:$42=HEAP32[$edge_pts>>2]|0;if(($42|0)==0){label=13;break}else{label=12;break};case 12:_free($42);label=13;break;case 13:STACKTOP=__stackBase__;return 0}return 0}function _qr_finder_centers_locate($_centers,$_edge_pts,$reader){$_centers=$_centers|0;$_edge_pts=$_edge_pts|0;$reader=$reader|0;var $2=0,$4=0,$6=0,$8=0,$10=0,$14=0,$15=0,$16=0,$19=0,$23=0,$24=0,$25=0,$nedge_pts_0_lcssa=0,$i_05=0,$nedge_pts_04=0,$32=0,$33=0,$i_12=0,$nedge_pts_11=0,$37=0,$38=0,$nedge_pts_1_lcssa=0,$42=0,$51=0,$52=0,$ncenters_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$reader+2832>>2]|0;$4=HEAP32[$reader+2836>>2]|0;$6=HEAP32[$reader+2844>>2]|0;$8=HEAP32[$reader+2848>>2]|0;$10=_malloc($4<<2)|0;$14=_malloc($4>>>1<<3)|0;$15=$14;$16=_qr_finder_cluster_lines($15,$10,$2,$4,0)|0;_qsort($6|0,$8|0,20,28);$19=_malloc($8<<2)|0;$23=_malloc($8>>>1<<3)|0;$24=$23;$25=_qr_finder_cluster_lines($24,$19,$6,$8,1)|0;if(($16|0)>2&($25|0)>2){label=2;break}else{$ncenters_0=0;label=7;break};case 2:if(($16|0)>0){$nedge_pts_04=0;$i_05=0;label=4;break}else{$nedge_pts_0_lcssa=0;label=3;break};case 3:if(($25|0)>0){$nedge_pts_11=$nedge_pts_0_lcssa;$i_12=0;label=5;break}else{$nedge_pts_1_lcssa=$nedge_pts_0_lcssa;label=6;break};case 4:$32=(HEAP32[$15+($i_05<<3)+4>>2]|0)+$nedge_pts_04|0;$33=$i_05+1|0;if(($33|0)<($16|0)){$nedge_pts_04=$32;$i_05=$33;label=4;break}else{$nedge_pts_0_lcssa=$32;label=3;break};case 5:$37=(HEAP32[$24+($i_12<<3)+4>>2]|0)+$nedge_pts_11|0;$38=$i_12+1|0;if(($38|0)<($25|0)){$nedge_pts_11=$37;$i_12=$38;label=5;break}else{$nedge_pts_1_lcssa=$37;label=6;break};case 6:$42=_malloc($nedge_pts_1_lcssa<<5)|0;$51=_malloc(($25-$16&-(($25|0)<($16|0)&1))+$16<<4)|0;$52=_qr_finder_find_crossings($51,$42,$15,$16,$24,$25)|0;HEAP32[$_centers>>2]=$51;HEAP32[$_edge_pts>>2]=$42;$ncenters_0=$52;label=7;break;case 7:_free($23);_free($19);_free($14);_free($10);return $ncenters_0|0}return 0}function _qr_finder_cluster_lines($_clusters,$_neighbors,$_lines,$_nlines,$_v){$_clusters=$_clusters|0;$_neighbors=$_neighbors|0;$_lines=$_lines|0;$_nlines=$_nlines|0;$_v=$_v|0;var $1=0,$2=0,$5=0,$neighbors_0117=0,$nclusters_0116=0,$i_0115=0,$j_096109=0,$j_096112=0,$nneighbors_0_ph111=0,$len_0_ph110=0,$j_097=0,$j_0=0,$23=0,$25=0,$28=0,$33=0,$37=0,$39=0,$41=0,$50=0,$52=0,$57=0,$61=0,$68=0,$73=0,$77=0,$88=0,$91=0,$94=0,$j_096=0,$nneighbors_0_ph107=0,$len_0_ph104=0,$j_198=0,$114=0,$nclusters_1=0,$neighbors_1=0,$118=0,$nclusters_0_lcssa=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_calloc($_nlines,1)|0;$2=$_nlines-1|0;if(($2|0)>0){label=2;break}else{$nclusters_0_lcssa=0;label=24;break};case 2:$5=1-$_v|0;$i_0115=0;$nclusters_0116=0;$neighbors_0117=$_neighbors;label=3;break;case 3:if((HEAP8[$1+$i_0115|0]|0)==0){label=4;break}else{$neighbors_1=$neighbors_0117;$nclusters_1=$nclusters_0116;label=23;break};case 4:HEAP32[$neighbors_0117>>2]=$_lines+($i_0115*20&-1);$j_096109=$i_0115+1|0;if(($j_096109|0)<($_nlines|0)){$len_0_ph110=HEAP32[$_lines+($i_0115*20&-1)+8>>2]|0;$nneighbors_0_ph111=1;$j_096112=$j_096109;label=5;break}else{$neighbors_1=$neighbors_0117;$nclusters_1=$nclusters_0116;label=23;break};case 5:$j_097=$j_096112;label=6;break;case 6:if((HEAP8[$1+$j_097|0]|0)==0){label=8;break}else{label=7;break};case 7:$j_0=$j_097+1|0;if(($j_0|0)<($_nlines|0)){$j_097=$j_0;label=6;break}else{$len_0_ph104=$len_0_ph110;$nneighbors_0_ph107=$nneighbors_0_ph111;label=18;break};case 8:$23=HEAP32[$neighbors_0117+($nneighbors_0_ph111-1<<2)>>2]|0;$25=$23+8|0;$28=(HEAP32[$25>>2]|0)+7>>2;$33=(HEAP32[$23+($5<<2)>>2]|0)-(HEAP32[$_lines+($j_097*20&-1)+($5<<2)>>2]|0)|0;if(((($33|0)>-1?$33:-$33|0)|0)>($28|0)){$len_0_ph104=$len_0_ph110;$nneighbors_0_ph107=$nneighbors_0_ph111;label=18;break}else{label=9;break};case 9:$37=$23+($_v<<2)|0;$39=$_lines+($j_097*20&-1)+($_v<<2)|0;$41=(HEAP32[$37>>2]|0)-(HEAP32[$39>>2]|0)|0;if(((($41|0)>-1?$41:-$41|0)|0)>($28|0)){label=7;break}else{label=10;break};case 10:$50=$_lines+($j_097*20&-1)+8|0;$52=(HEAP32[$25>>2]|0)+(HEAP32[$37>>2]|0)-(HEAP32[$39>>2]|0)-(HEAP32[$50>>2]|0)|0;if(((($52|0)>-1?$52:-$52|0)|0)>($28|0)){label=7;break}else{label=11;break};case 11:$57=HEAP32[$23+12>>2]|0;if(($57|0)>0){label=12;break}else{label=14;break};case 12:$61=HEAP32[$_lines+($j_097*20&-1)+12>>2]|0;if(($61|0)>0){label=13;break}else{label=14;break};case 13:$68=$61-$57+(HEAP32[$37>>2]|0)-(HEAP32[$39>>2]|0)|0;if(((($68|0)>-1?$68:-$68|0)|0)>($28|0)){label=7;break}else{label=14;break};case 14:$73=HEAP32[$23+16>>2]|0;if(($73|0)>0){label=15;break}else{label=17;break};case 15:$77=HEAP32[$_lines+($j_097*20&-1)+16>>2]|0;if(($77|0)>0){label=16;break}else{label=17;break};case 16:$88=$73-$77+(HEAP32[$37>>2]|0)+(HEAP32[$25>>2]|0)-(HEAP32[$39>>2]|0)-(HEAP32[$50>>2]|0)|0;if(((($88|0)>-1?$88:-$88|0)|0)>($28|0)){label=7;break}else{label=17;break};case 17:$91=$nneighbors_0_ph111+1|0;HEAP32[$neighbors_0117+($nneighbors_0_ph111<<2)>>2]=$_lines+($j_097*20&-1);$94=(HEAP32[$50>>2]|0)+$len_0_ph110|0;$j_096=$j_097+1|0;if(($j_096|0)<($_nlines|0)){$len_0_ph110=$94;$nneighbors_0_ph111=$91;$j_096112=$j_096;label=5;break}else{$len_0_ph104=$94;$nneighbors_0_ph107=$91;label=18;break};case 18:if(($nneighbors_0_ph107|0)<3){$neighbors_1=$neighbors_0117;$nclusters_1=$nclusters_0116;label=23;break}else{label=19;break};case 19:if(($nneighbors_0_ph107*20&-1|0)<(($nneighbors_0_ph107+($len_0_ph104<<1)|0)/($nneighbors_0_ph107<<1|0)&-1|0)){$neighbors_1=$neighbors_0117;$nclusters_1=$nclusters_0116;label=23;break}else{label=20;break};case 20:HEAP32[$_clusters+($nclusters_0116<<3)>>2]=$neighbors_0117;HEAP32[$_clusters+($nclusters_0116<<3)+4>>2]=$nneighbors_0_ph107;if(($nneighbors_0_ph107|0)>0){$j_198=0;label=21;break}else{label=22;break};case 21:HEAP8[$1+(((HEAP32[$neighbors_0117+($j_198<<2)>>2]|0)-$_lines|0)/20&-1)|0]=1;$114=$j_198+1|0;if(($114|0)<($nneighbors_0_ph107|0)){$j_198=$114;label=21;break}else{label=22;break};case 22:$neighbors_1=$neighbors_0117+($nneighbors_0_ph107<<2)|0;$nclusters_1=$nclusters_0116+1|0;label=23;break;case 23:$118=$i_0115+1|0;if(($118|0)<($2|0)){$i_0115=$118;$nclusters_0116=$nclusters_1;$neighbors_0117=$neighbors_1;label=3;break}else{$nclusters_0_lcssa=$nclusters_1;label=24;break};case 24:_free($1);return $nclusters_0_lcssa|0}return 0}function _qr_finder_find_crossings($_centers,$_edge_pts,$_hclusters,$_nhclusters,$_vclusters,$_nvclusters){$_centers=$_centers|0;$_edge_pts=$_edge_pts|0;$_hclusters=$_hclusters|0;$_nhclusters=$_nhclusters|0;$_vclusters=$_vclusters|0;$_nvclusters=$_nvclusters|0;var $2=0,$3=0,$5=0,$6=0,$7=0,$8=0,$_0121=0,$ncenters_0120=0,$i_0118=0,$16=0,$23=0,$y_099=0,$nvneighbors_098=0,$j_097=0,$24=0,$28=0,$35=0,$45=0,$47=0,$51=0,$y_1=0,$nvneighbors_1=0,$y_2=0,$60=0,$69=0,$71=0,$75=0,$x_0=0,$83=0,$j_1104112=0,$j_1104115=0,$x_1_ph114=0,$nhneighbors_0_ph113=0,$j_1105=0,$93=0,$97=0,$104=0,$j_1=0,$115=0,$117=0,$121=0,$x_2=0,$126=0,$j_1104=0,$x_1_ph111=0,$nhneighbors_0_ph109=0,$140=0,$ncenters_1=0,$_1=0,$143=0,$ncenters_0_lcssa=0,label=0;label=1;while(1)switch(label|0){case 1:$2=_malloc($_nhclusters<<2)|0;$3=$2;$5=_malloc($_nvclusters<<2)|0;$6=$5;$7=_calloc($_nhclusters,1)|0;$8=_calloc($_nvclusters,1)|0;if(($_nhclusters|0)>0){label=2;break}else{$ncenters_0_lcssa=0;label=27;break};case 2:$i_0118=0;$ncenters_0120=0;$_0121=$_edge_pts;label=3;break;case 3:if((HEAP8[$7+$i_0118|0]|0)==0){label=4;break}else{$_1=$_0121;$ncenters_1=$ncenters_0120;label=26;break};case 4:$16=$_hclusters+($i_0118<<3)|0;$23=HEAP32[(HEAP32[$16>>2]|0)+(HEAP32[$_hclusters+($i_0118<<3)+4>>2]>>1<<2)>>2]|0;if(($_nvclusters|0)>0){$j_097=0;$nvneighbors_098=0;$y_099=0;label=5;break}else{$_1=$_0121;$ncenters_1=$ncenters_0120;label=26;break};case 5:$24=$8+$j_097|0;if((HEAP8[$24]|0)==0){label=6;break}else{$y_2=$y_099;$nvneighbors_1=$nvneighbors_098;label=11;break};case 6:$28=$_vclusters+($j_097<<3)|0;$35=HEAP32[(HEAP32[$28>>2]|0)+(HEAP32[$_vclusters+($j_097<<3)+4>>2]>>1<<2)>>2]|0;if((_qr_finder_lines_are_crossing($23,$35)|0)==0){$y_2=$y_099;$nvneighbors_1=$nvneighbors_098;label=11;break}else{label=7;break};case 7:HEAP8[$24]=1;$45=(HEAP32[$35+8>>2]|0)+$y_099+(HEAP32[$35+4>>2]<<1)|0;$47=HEAP32[$35+12>>2]|0;if(($47|0)>0){label=8;break}else{$y_1=$45;label=10;break};case 8:$51=HEAP32[$35+16>>2]|0;if(($51|0)>0){label=9;break}else{$y_1=$45;label=10;break};case 9:$y_1=$45-$47+$51|0;label=10;break;case 10:HEAP32[$6+($nvneighbors_098<<2)>>2]=$28;$y_2=$y_1;$nvneighbors_1=$nvneighbors_098+1|0;label=11;break;case 11:$60=$j_097+1|0;if(($60|0)<($_nvclusters|0)){$j_097=$60;$nvneighbors_098=$nvneighbors_1;$y_099=$y_2;label=5;break}else{label=12;break};case 12:if(($nvneighbors_1|0)>0){label=13;break}else{$_1=$_0121;$ncenters_1=$ncenters_0120;label=26;break};case 13:$69=(HEAP32[$23>>2]<<1)+(HEAP32[$23+8>>2]|0)|0;$71=HEAP32[$23+12>>2]|0;if(($71|0)>0){label=14;break}else{$x_0=$69;label=16;break};case 14:$75=HEAP32[$23+16>>2]|0;if(($75|0)>0){label=15;break}else{$x_0=$69;label=16;break};case 15:$x_0=$69-$71+$75|0;label=16;break;case 16:HEAP32[$3>>2]=$16;$83=HEAP32[$6+($nvneighbors_1>>1<<2)>>2]|0;$j_1104112=$i_0118+1|0;if(($j_1104112|0)<($_nhclusters|0)){$nhneighbors_0_ph113=1;$x_1_ph114=$x_0;$j_1104115=$j_1104112;label=17;break}else{$nhneighbors_0_ph109=1;$x_1_ph111=$x_0;label=25;break};case 17:$j_1105=$j_1104115;label=18;break;case 18:$93=$7+$j_1105|0;if((HEAP8[$93]|0)==0){label=19;break}else{label=20;break};case 19:$97=$_hclusters+($j_1105<<3)|0;$104=HEAP32[(HEAP32[$97>>2]|0)+(HEAP32[$_hclusters+($j_1105<<3)+4>>2]>>1<<2)>>2]|0;if((_qr_finder_lines_are_crossing($104,HEAP32[(HEAP32[$83>>2]|0)+(HEAP32[$83+4>>2]>>1<<2)>>2]|0)|0)==0){label=20;break}else{label=21;break};case 20:$j_1=$j_1105+1|0;if(($j_1|0)<($_nhclusters|0)){$j_1105=$j_1;label=18;break}else{$nhneighbors_0_ph109=$nhneighbors_0_ph113;$x_1_ph111=$x_1_ph114;label=25;break};case 21:HEAP8[$93]=1;$115=(HEAP32[$104+8>>2]|0)+$x_1_ph114+(HEAP32[$104>>2]<<1)|0;$117=HEAP32[$104+12>>2]|0;if(($117|0)>0){label=22;break}else{$x_2=$115;label=24;break};case 22:$121=HEAP32[$104+16>>2]|0;if(($121|0)>0){label=23;break}else{$x_2=$115;label=24;break};case 23:$x_2=$115-$117+$121|0;label=24;break;case 24:$126=$nhneighbors_0_ph113+1|0;HEAP32[$3+($nhneighbors_0_ph113<<2)>>2]=$97;$j_1104=$j_1105+1|0;if(($j_1104|0)<($_nhclusters|0)){$nhneighbors_0_ph113=$126;$x_1_ph114=$x_2;$j_1104115=$j_1104;label=17;break}else{$nhneighbors_0_ph109=$126;$x_1_ph111=$x_2;label=25;break};case 25:HEAP32[$_centers+($ncenters_0120<<4)>>2]=($x_1_ph111+$nhneighbors_0_ph109|0)/($nhneighbors_0_ph109<<1|0)&-1;HEAP32[$_centers+($ncenters_0120<<4)+4>>2]=($y_2+$nvneighbors_1|0)/($nvneighbors_1<<1|0)&-1;HEAP32[$_centers+($ncenters_0120<<4)+8>>2]=$_0121;$140=_qr_finder_edge_pts_fill($_0121,_qr_finder_edge_pts_fill($_0121,0,$3,$nhneighbors_0_ph109,0)|0,$6,$nvneighbors_1,1)|0;HEAP32[$_centers+($ncenters_0120<<4)+12>>2]=$140;$_1=$_0121+($140<<4)|0;$ncenters_1=$ncenters_0120+1|0;label=26;break;case 26:$143=$i_0118+1|0;if(($143|0)<($_nhclusters|0)){$i_0118=$143;$ncenters_0120=$ncenters_1;$_0121=$_1;label=3;break}else{$ncenters_0_lcssa=$ncenters_1;label=27;break};case 27:_free($8);_free($7);_free($5);_free($2);_qsort($_centers|0,$ncenters_0_lcssa|0,16,14);return $ncenters_0_lcssa|0}return 0}function _qr_aff_init($_aff,$_p0,$_p1,$_p2,$_res){$_aff=$_aff|0;$_p0=$_p0|0;$_p1=$_p1|0;$_p2=$_p2|0;$_res=$_res|0;var $1=0,$3=0,$4=0,$6=0,$9=0,$10=0,$11=0,$14=0,$19=0,$20=0,$21=0,$28=0,$29=0,$36=0,$37=0,$43=0,$44=0;$1=_qr_point_ccw($_p0,$_p1,$_p2)|0;$3=HEAP32[$_p0>>2]|0;$4=(HEAP32[$_p1>>2]|0)-$3|0;$6=(HEAP32[$_p2>>2]|0)-$3|0;$9=$_p0+4|0;$10=HEAP32[$9>>2]|0;$11=(HEAP32[$_p1+4>>2]|0)-$10|0;$14=(HEAP32[$_p2+4>>2]|0)-$10|0;HEAP32[$_aff>>2]=$4;HEAP32[$_aff+4>>2]=$6;HEAP32[$_aff+8>>2]=$11;HEAP32[$_aff+12>>2]=$14;$19=$14<<$_res;$20=$1>>1;$21=$19>>31;HEAP32[$_aff+16>>2]=(($21+$20^$21)+$19|0)/($1|0)&-1;$28=-$6<<$_res;$29=$28>>31;HEAP32[$_aff+20>>2]=(($29+$20^$29)+$28|0)/($1|0)&-1;$36=-$11<<$_res;$37=$36>>31;HEAP32[$_aff+24>>2]=(($37+$20^$37)+$36|0)/($1|0)&-1;$43=$4<<$_res;$44=$43>>31;HEAP32[$_aff+28>>2]=(($44+$20^$44)+$43|0)/($1|0)&-1;HEAP32[$_aff+32>>2]=HEAP32[$_p0>>2];HEAP32[$_aff+36>>2]=HEAP32[$9>>2];HEAP32[$_aff+40>>2]=$_res;return}function _qr_finder_estimate_module_size_and_version($_f,$_width,$_height){$_f=$_f|0;$_width=$_width|0;$_height=$_height|0;var $offs=0,$sums=0,$nsums=0,$1=0,$2=0,$e_063=0,$5=0,$10=0,$11=0,$i_062=0,$sum_061=0,$15=0,$16=0,$sum_0_lcssa=0,$19=0,$21=0,$27=0,$36=0,$49=0,$56=0,$57=0,$64=0,$65=0,$79=0,$86=0,$87=0,$94=0,$95=0,$103=0,$115=0,$121=0,$128=0,$140=0,$146=0,$149=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+40|0;label=1;while(1)switch(label|0){case 1:$offs=__stackBase__|0;$sums=__stackBase__+8|0;$nsums=__stackBase__+24|0;$1=$offs+4|0;HEAP32[$1>>2]=0;$2=$offs|0;HEAP32[$2>>2]=0;$e_063=0;label=2;break;case 2:$5=HEAP32[$_f+32+($e_063<<2)>>2]|0;if(($5|0)>0){label=3;break}else{label=6;break};case 3:$10=$5>>2;$11=$5-$10|0;if(($10|0)<($11|0)){$sum_061=0;$i_062=$10;label=4;break}else{$sum_0_lcssa=0;label=5;break};case 4:$15=(HEAP32[(HEAP32[$_f+16+($e_063<<2)>>2]|0)+($i_062<<4)+12>>2]|0)+$sum_061|0;$16=$i_062+1|0;if(($16|0)<($11|0)){$sum_061=$15;$i_062=$16;label=4;break}else{$sum_0_lcssa=$15;label=5;break};case 5:$19=$5-($10<<1)|0;$21=$sum_0_lcssa>>31;$27=$offs+($e_063>>1<<2)|0;HEAP32[$27>>2]=(HEAP32[$27>>2]|0)+((($21+($19>>1)^$21)+$sum_0_lcssa|0)/($19|0)&-1);HEAP32[$sums+($e_063<<2)>>2]=$sum_0_lcssa;HEAP32[$nsums+($e_063<<2)>>2]=$19;label=7;break;case 6:HEAP32[$sums+($e_063<<2)>>2]=0;HEAP32[$nsums+($e_063<<2)>>2]=0;label=7;break;case 7:$36=$e_063+1|0;if(($36|0)<4){$e_063=$36;label=2;break}else{label=8;break};case 8:if((HEAP32[$_f+32>>2]|0)>0){label=9;break}else{label=11;break};case 9:if((HEAP32[$_f+36>>2]|0)>0){label=10;break}else{label=11;break};case 10:$49=$_f+64|0;HEAP32[$49>>2]=(HEAP32[$49>>2]|0)-(HEAP32[$2>>2]>>1);$56=(Math_imul(HEAP32[$nsums>>2]|0,HEAP32[$2>>2]|0)|0)>>1;$57=$sums|0;HEAP32[$57>>2]=(HEAP32[$57>>2]|0)-$56;$64=(Math_imul(HEAP32[$nsums+4>>2]|0,HEAP32[$2>>2]|0)|0)>>1;$65=$sums+4|0;HEAP32[$65>>2]=(HEAP32[$65>>2]|0)-$64;label=11;break;case 11:if((HEAP32[$_f+40>>2]|0)>0){label=12;break}else{label=14;break};case 12:if((HEAP32[$_f+44>>2]|0)>0){label=13;break}else{label=14;break};case 13:$79=$_f+68|0;HEAP32[$79>>2]=(HEAP32[$79>>2]|0)-(HEAP32[$1>>2]>>1);$86=(Math_imul(HEAP32[$nsums+8>>2]|0,HEAP32[$1>>2]|0)|0)>>1;$87=$sums+8|0;HEAP32[$87>>2]=(HEAP32[$87>>2]|0)-$86;$94=(Math_imul(HEAP32[$nsums+12>>2]|0,HEAP32[$1>>2]|0)|0)>>1;$95=$sums+12|0;HEAP32[$95>>2]=(HEAP32[$95>>2]|0)-$94;label=14;break;case 14:$103=(HEAP32[$nsums+4>>2]|0)+(HEAP32[$nsums>>2]|0)|0;if(($103|0)<1){$_0=-1;label=22;break}else{label=15;break};case 15:$115=(((HEAP32[$sums+4>>2]|0)-(HEAP32[$sums>>2]|0)<<1)+($103*3&-1)|0)/($103*6&-1|0)&-1;if(($115|0)<1){$_0=-1;label=22;break}else{label=16;break};case 16:$121=($_width-($115<<3)|0)/($115<<2|0)&-1;if(($121-1|0)>>>0>42){$_0=-1;label=22;break}else{label=17;break};case 17:$128=(HEAP32[$nsums+12>>2]|0)+(HEAP32[$nsums+8>>2]|0)|0;if(($128|0)<1){$_0=-1;label=22;break}else{label=18;break};case 18:$140=(((HEAP32[$sums+12>>2]|0)-(HEAP32[$sums+8>>2]|0)<<1)+($128*3&-1)|0)/($128*6&-1|0)&-1;if(($140|0)<1){$_0=-1;label=22;break}else{label=19;break};case 19:$146=($_height-($140<<3)|0)/($140<<2|0)&-1;if(($146-1|0)>>>0>42){$_0=-1;label=22;break}else{label=20;break};case 20:$149=$121-$146|0;if(((($149|0)>-1?$149:-$149|0)|0)>3){$_0=-1;label=22;break}else{label=21;break};case 21:HEAP32[$_f>>2]=$115;HEAP32[$_f+4>>2]=$140;HEAP32[$_f+8>>2]=$121;HEAP32[$_f+12>>2]=$146;$_0=0;label=22;break;case 22:STACKTOP=__stackBase__;return $_0|0}return 0}function _qr_finder_edge_pts_aff_classify($_f,$_aff){$_f=$_f|0;$_aff=$_aff|0;var $q=0,$1=0,$2=0,$3=0,$5=0,$6=0,$i_036=0,$11=0,$20=0,$22=0,$25=0,$27=0,$30=0,$31=0,$39=0,$40=0,$_lcssa=0,$43=0,$46=0,$49=0,$_sum=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=2;while(1)switch(label|0){case 2:$q=__stackBase__|0;$1=HEAP32[$_f+72>>2]|0;_memset($_f+32|0,0,16);$2=$1+12|0;$3=HEAP32[$2>>2]|0;if(($3|0)>0){label=3;break}else{$_lcssa=$3;label=5;break};case 3:$5=$q|0;$6=$1+8|0;$i_036=0;label=4;break;case 4:$11=HEAP32[$6>>2]|0;_qr_aff_unproject($5,$_aff,HEAP32[$11+($i_036<<4)>>2]|0,HEAP32[$11+($i_036<<4)+4>>2]|0);_qr_point_translate($5,-(HEAP32[$_f+64>>2]|0)|0,-(HEAP32[$_f+68>>2]|0)|0);$20=HEAP32[$q+4>>2]|0;$22=HEAP32[$5>>2]|0;$25=((($20|0)>-1?$20:-$20|0)|0)>((($22|0)>-1?$22:-$22|0)|0)&1;$27=$q+($25<<2)|0;$30=($25<<1|(HEAP32[$27>>2]|0)>>>31)^1;$31=$_f+32+($30<<2)|0;HEAP32[$31>>2]=(HEAP32[$31>>2]|0)+1;HEAP32[(HEAP32[$6>>2]|0)+($i_036<<4)+8>>2]=$30;HEAP32[(HEAP32[$6>>2]|0)+($i_036<<4)+12>>2]=HEAP32[$27>>2];$39=$i_036+1|0;$40=HEAP32[$2>>2]|0;if(($39|0)<($40|0)){$i_036=$39;label=4;break}else{$_lcssa=$40;label=5;break};case 5:$43=$1+8|0;_qsort(HEAP32[$43>>2]|0,$_lcssa|0,16,4);$46=HEAP32[$43>>2]|0;HEAP32[$_f+16>>2]=$46;$49=HEAP32[$_f+32>>2]|0;HEAP32[$_f+20>>2]=$46+($49<<4);$_sum=$49+(HEAP32[$_f+36>>2]|0)|0;HEAP32[$_f+24>>2]=$46+($_sum<<4);HEAP32[$_f+28>>2]=$46+($_sum+(HEAP32[$_f+40>>2]|0)<<4);STACKTOP=__stackBase__;return}}function _qr_hom_fit($_hom,$_ul,$_ur,$_dl,$_p,$_aff,$_isaac,$_img,$_width,$_height){$_hom=$_hom|0;$_ul=$_ul|0;$_ur=$_ur|0;$_dl=$_dl|0;$_p=$_p|0;$_aff=$_aff|0;$_isaac=$_isaac|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $l=0,$q=0,$p=0,$dru=0,$dbv=0,$cell=0,$p3=0,$1=0,$2=0,$3=0,$11=0,$12=0,$20=0,$21=0,$29=0,$39=0,$40=0,$41=0,$47=0,$55=0,$67=0,$69=0,$75=0,$76=0,$79=0,$82=0,$83=0,$89=0,$97=0,$109=0,$112=0,$113=0,$114=0,$115=0,$121=0,$122=0,$123=0,$128=0,$131=0,$i_0539=0,$139=0,$140=0,$141$1=0,$142=0,$145=0,$146=0,$152=0,$155=0,$i_1538=0,$163=0,$164=0,$165$1=0,$166=0,$171=0,$174=0,$175=0,$179=0,$180=0,$181=0,$182=0,$183=0,$184=0,$187=0,$188=0,$189=0,$190=0,$191=0,$192=0,$195=0,$196=0,$197=0,$199=0,$200=0,$202=0,$203=0,$204=0,$205=0,$206=0,$209=0,$210=0,$213=0,$214=0,$215=0,$217=0,$218=0,$220=0,$221=0,$222=0,$223=0,$224=0,$226=0,$228=0,$230=0,$drxi_0_ph=0,$dryi_0_ph=0,$ry_0_ph=0,$rx_0_ph=0,$bv_0_ph=0,$nrempty_0_ph=0,$rlastfit_0_ph=0,$bx_0_ph=0,$by_0_ph=0,$dbxi_0_ph=0,$dbyi_0_ph=0,$bu_0_ph=0,$rv_0_ph=0,$ru_0_ph=0,$nbempty_0_ph=0,$blastfit_0_ph=0,$cr_0_ph=0,$nr_0_ph=0,$r_0_ph=0,$cb_0_ph=0,$nb_0_ph=0,$b_0_ph=0,$bv_0=0,$bx_0=0,$by_0=0,$dbxi_0=0,$dbyi_0=0,$bu_0=0,$nbempty_0=0,$blastfit_0=0,$cb_0=0,$nb_0=0,$b_0=0,$236=0,$246=0,$_=0,$259=0,$260=0,$262=0,$264=0,$266=0,$270=0,$cr_1=0,$r_1=0,$276=0,$ret_0=0,$292=0,$293=0,$rv_1=0,$301=0,$305=0,$307=0,$311=0,$312=0,$314=0,$328=0,$329=0,$332=0,$334=0,$drxi_2=0,$dryi_2=0,$ry_1=0,$rx_1=0,$nrempty_1=0,$rlastfit_1=0,$rv_2=0,$ru_1=0,$nr_1=0,$349=0,$350=0,$352=0,$354=0,$356=0,$360=0,$cb_1=0,$b_1=0,$366=0,$ret_1=0,$380=0,$bu_1=0,$389=0,$391=0,$395=0,$397=0,$401=0,$402=0,$404=0,$418=0,$420=0,$422=0,$424=0,$bv_2=0,$bx_2=0,$by_2=0,$dbxi_3=0,$dbyi_3=0,$bu_3=0,$nbempty_1=0,$blastfit_2=0,$nb_2=0,$440=0,$446=0,$449=0,$453=0,$460=0,$464=0,$465=0,$468=0,$472=0,$479=0,$488=0,$490=0,$496=0,$500=0,$513=0,$519=0,$522=0,$526=0,$533=0,$537=0,$538=0,$541=0,$545=0,$552=0,$561=0,$563=0,$573=0,$i_2=0,$593=0,$602=0,$607=0,$613=0,$615=0,$626=0,$629=0,$630=0,$632=0,$634=0,$636=0,$638=0,$640=0,$642=0,$643=0,$647=0,$648=0,$649=0,$650=0,$651=0,$653=0,$654=0,$655=0,$656=0,$657=0,$659=0,$664=0,$666=0,$667=0,$672=0,$673=0,$674=0,$675=0,$676=0,$678=0,$679=0,$681$0=0,$681$1=0,$682=0,$684=0,$686=0,$688$0=0,$688$1=0,$689=0,$691=0,$693=0,$695$0=0,$695$1=0,$696$0=0,$696$1=0,$697$0=0,$698$0=0,$699$0=0,$700$1=0,$701=0,$702=0,$705=0,$707$0=0,$708$0=0,$708$1=0,$709$0=0,$711=0,$714=0,$716$0=0,$716$1=0,$717=0,$720=0,$722$0=0,$722$1=0,$723=0,$725=0,$727$0=0,$728$0=0,$729$0=0,$730$0=0,$731$1=0,$732=0,$735=0,$737$0=0,$738$0=0,$brx_0=0,$bry_0=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+144|0;label=1;while(1)switch(label|0){case 1:$l=__stackBase__|0;$q=__stackBase__+48|0;$p=__stackBase__+56|0;$dru=__stackBase__+64|0;$dbv=__stackBase__+72|0;$cell=__stackBase__+80|0;$p3=__stackBase__+136|0;_qr_finder_ransac($_ul,$_aff,$_isaac,0);_qr_finder_ransac($_dl,$_aff,$_isaac,0);$1=$l|0;_qr_line_fit_finder_pair($1,$_aff,$_ul,$_dl,0);$2=$_dl+72|0;$3=HEAP32[$2>>2]|0;if((_qr_line_eval($1,HEAP32[$3>>2]|0,HEAP32[$3+4>>2]|0)|0)<0){$_0=-1;label=67;break}else{label=2;break};case 2:$11=$_ur+72|0;$12=HEAP32[$11>>2]|0;if((_qr_line_eval($1,HEAP32[$12>>2]|0,HEAP32[$12+4>>2]|0)|0)<0){$_0=-1;label=67;break}else{label=3;break};case 3:_qr_finder_ransac($_ul,$_aff,$_isaac,2);_qr_finder_ransac($_ur,$_aff,$_isaac,2);$20=$l+24|0;_qr_line_fit_finder_pair($20,$_aff,$_ul,$_ur,2);$21=HEAP32[$2>>2]|0;if((_qr_line_eval($20,HEAP32[$21>>2]|0,HEAP32[$21+4>>2]|0)|0)<0){$_0=-1;label=67;break}else{label=4;break};case 4:$29=HEAP32[$11>>2]|0;if((_qr_line_eval($20,HEAP32[$29>>2]|0,HEAP32[$29+4>>2]|0)|0)<0){$_0=-1;label=67;break}else{label=5;break};case 5:$39=HEAP32[$_ur+4>>2]>>1;_qr_finder_ransac($_ur,$_aff,$_isaac,1);$40=$l+12|0;$41=$_aff+40|0;if((_qr_line_fit_finder_edge($40,$_ur,1,HEAP32[$41>>2]|0)|0)>-1){label=6;break}else{label=9;break};case 6:$47=HEAP32[$_ul+72>>2]|0;if((_qr_line_eval($40,HEAP32[$47>>2]|0,HEAP32[$47+4>>2]|0)|0)<0){$_0=-1;label=67;break}else{label=7;break};case 7:$55=HEAP32[$2>>2]|0;if((_qr_line_eval($40,HEAP32[$55>>2]|0,HEAP32[$55+4>>2]|0)|0)<0){$_0=-1;label=67;break}else{label=8;break};case 8:if((_qr_aff_line_step($_aff,$40,1,$39,$dru)|0)<0){$_0=-1;label=67;break}else{label=10;break};case 9:HEAP32[$dru>>2]=0;label=10;break;case 10:$67=$_ur+64|0;$69=$_ur|0;$75=((HEAP32[$69>>2]|0)*3&-1)+(HEAP32[$67>>2]|0)-(HEAP32[$dru>>2]<<1)|0;$76=$_ur+68|0;$79=(HEAP32[$76>>2]|0)-($39<<1)|0;$82=HEAP32[$_dl>>2]>>1;_qr_finder_ransac($_dl,$_aff,$_isaac,3);$83=$l+36|0;if((_qr_line_fit_finder_edge($83,$_dl,3,HEAP32[$41>>2]|0)|0)>-1){label=11;break}else{label=14;break};case 11:$89=HEAP32[$_ul+72>>2]|0;if((_qr_line_eval($83,HEAP32[$89>>2]|0,HEAP32[$89+4>>2]|0)|0)<0){$_0=-1;label=67;break}else{label=12;break};case 12:$97=HEAP32[$11>>2]|0;if((_qr_line_eval($83,HEAP32[$97>>2]|0,HEAP32[$97+4>>2]|0)|0)<0){$_0=-1;label=67;break}else{label=13;break};case 13:if((_qr_aff_line_step($_aff,$83,0,$82,$dbv)|0)<0){$_0=-1;label=67;break}else{label=15;break};case 14:HEAP32[$dbv>>2]=0;label=15;break;case 15:$109=$_dl+64|0;$112=(HEAP32[$109>>2]|0)-($82<<1)|0;$113=$_dl+68|0;$114=HEAP32[$113>>2]|0;$115=$_dl+4|0;$121=((HEAP32[$115>>2]|0)*3&-1)+$114-(HEAP32[$dbv>>2]<<1)|0;$122=$_ur+52|0;$123=HEAP32[$122>>2]|0;$128=(($39-1-$79+$114|0)/($39|0)&-1)+$123|0;$131=_malloc($128<<3)|0;if((HEAP32[$122>>2]|0)>0){label=16;break}else{label=18;break};case 16:$i_0539=0;label=17;break;case 17:$139=(HEAP32[$_ur+20>>2]|0)+($i_0539<<4)|0;$140=$131+($i_0539<<3)|0;$141$1=HEAP32[$139+4>>2]|0;HEAP32[$140>>2]=HEAP32[$139>>2];HEAP32[$140+4>>2]=$141$1;$142=$i_0539+1|0;if(($142|0)<(HEAP32[$122>>2]|0)){$i_0539=$142;label=17;break}else{label=18;break};case 18:$145=$_dl+60|0;$146=HEAP32[$145>>2]|0;$152=(($82-1-$112+(HEAP32[$67>>2]|0)|0)/($82|0)&-1)+$146|0;$155=_malloc($152<<3)|0;if((HEAP32[$145>>2]|0)>0){label=19;break}else{label=21;break};case 19:$i_1538=0;label=20;break;case 20:$163=(HEAP32[$_dl+28>>2]|0)+($i_1538<<4)|0;$164=$155+($i_1538<<3)|0;$165$1=HEAP32[$163+4>>2]|0;HEAP32[$164>>2]=HEAP32[$163>>2];HEAP32[$164+4>>2]=$165$1;$166=$i_1538+1|0;if(($166|0)<(HEAP32[$145>>2]|0)){$i_1538=$166;label=20;break}else{label=21;break};case 21:$171=HEAP32[$41>>2]|0;$174=1<<$171-1;$175=$174+(HEAP32[$_aff+32>>2]<<$171)|0;$179=(HEAP32[$_aff+36>>2]<<$171)+$174|0;$180=$_aff|0;$181=HEAP32[$180>>2]|0;$182=Math_imul($181,$75)|0;$183=$_aff+4|0;$184=HEAP32[$183>>2]|0;$187=$175+$182+(Math_imul($184,$79)|0)|0;$188=$_aff+8|0;$189=HEAP32[$188>>2]|0;$190=Math_imul($189,$75)|0;$191=$_aff+12|0;$192=HEAP32[$191>>2]|0;$195=$190+$179+(Math_imul($192,$79)|0)|0;$196=HEAP32[$dru>>2]|0;$197=Math_imul($196,$181)|0;$199=$197+(Math_imul($184,$39)|0)|0;$200=Math_imul($196,$189)|0;$202=$200+(Math_imul($192,$39)|0)|0;$203=HEAP32[$69>>2]|0;$204=Math_imul($203,$181)|0;$205=Math_imul($203,$189)|0;$206=Math_imul($181,$112)|0;$209=$175+$206+(Math_imul($184,$121)|0)|0;$210=Math_imul($189,$112)|0;$213=$210+$179+(Math_imul($192,$121)|0)|0;$214=Math_imul($181,$82)|0;$215=HEAP32[$dbv>>2]|0;$217=(Math_imul($215,$184)|0)+$214|0;$218=Math_imul($189,$82)|0;$220=(Math_imul($215,$192)|0)+$218|0;$221=HEAP32[$115>>2]|0;$222=Math_imul($221,$184)|0;$223=Math_imul($221,$192)|0;$224=$q|0;$226=($82|0)>0;$228=$q|0;$230=($39|0)>0;$b_0_ph=$155;$nb_0_ph=$146;$cb_0_ph=$152;$r_0_ph=$131;$nr_0_ph=$123;$cr_0_ph=$128;$blastfit_0_ph=$146;$nbempty_0_ph=0;$ru_0_ph=$75;$rv_0_ph=$79;$bu_0_ph=$112;$dbyi_0_ph=$220;$dbxi_0_ph=$217;$by_0_ph=$213;$bx_0_ph=$209;$rlastfit_0_ph=$123;$nrempty_0_ph=0;$bv_0_ph=$121;$rx_0_ph=$187;$ry_0_ph=$195;$dryi_0_ph=$202;$drxi_0_ph=$199;label=22;break;case 22:$b_0=$b_0_ph;$nb_0=$nb_0_ph;$cb_0=$cb_0_ph;$blastfit_0=$blastfit_0_ph;$nbempty_0=$nbempty_0_ph;$bu_0=$bu_0_ph;$dbyi_0=$dbyi_0_ph;$dbxi_0=$dbxi_0_ph;$by_0=$by_0_ph;$bx_0=$bx_0_ph;$bv_0=$bv_0_ph;label=23;break;case 23:$236=(HEAP32[$113>>2]|0)+$bv_0>>1;$246=(HEAP32[$67>>2]|0)+$ru_0_ph>>1;$_=($nbempty_0|0)>14|($bu_0|0)>=(($246-$ru_0_ph&-(($246|0)<($ru_0_ph|0)&1))+$ru_0_ph|0);if(($nrempty_0_ph|0)>14|($rv_0_ph|0)>=(($236-$bv_0&-(($236|0)<($bv_0|0)&1))+$bv_0|0)){label=38;break}else{label=24;break};case 24:if($_|($rv_0_ph|0)<($bu_0|0)){label=25;break}else{label=38;break};case 25:$259=(HEAP32[$41>>2]|0)+2|0;$260=$rx_0_ph+$204>>$259;$262=$ry_0_ph+$205>>$259;$264=$rx_0_ph-$204>>$259;$266=$ry_0_ph-$205>>$259;if(($nr_0_ph|0)<($cr_0_ph|0)){$r_1=$r_0_ph;$cr_1=$cr_0_ph;label=27;break}else{label=26;break};case 26:$270=$cr_0_ph<<1|1;$r_1=_realloc($r_0_ph,$270<<3)|0;$cr_1=$270;label=27;break;case 27:$276=_qr_finder_quick_crossing_check($_img,$_width,$_height,$260,$262,$264,$266)|0;if(($276|0)==0){label=28;break}else{$ret_0=$276;label=29;break};case 28:$ret_0=_qr_finder_locate_crossing($_img,$_width,$260,$262,$264,$266,1,$r_1+($nr_0_ph<<3)|0)|0;label=29;break;case 29:if(($ret_0|0)>-1){label=30;break}else{label=36;break};case 30:if(($ret_0|0)==0){label=31;break}else{$nr_1=$nr_0_ph;$ru_1=$ru_0_ph;$rv_2=$rv_0_ph;$rlastfit_1=$rlastfit_0_ph;$nrempty_1=0;$rx_1=$rx_0_ph;$ry_1=$ry_0_ph;$dryi_2=$dryi_0_ph;$drxi_2=$drxi_0_ph;label=37;break};case 31:_qr_aff_unproject($228,$_aff,HEAP32[$r_1+($nr_0_ph<<3)>>2]|0,HEAP32[$r_1+($nr_0_ph<<3)+4>>2]|0);$292=(HEAP32[$228>>2]|0)+$ru_0_ph>>1;$293=HEAP32[$q+4>>2]|0;if(($293+$39|0)>($rv_0_ph|0)){label=32;break}else{$rv_1=$rv_0_ph;label=33;break};case 32:$rv_1=$293+$rv_0_ph>>1;label=33;break;case 33:$301=Math_imul(HEAP32[$180>>2]|0,$292)|0;$305=$301+$175+(Math_imul(HEAP32[$183>>2]|0,$rv_1)|0)|0;$307=Math_imul(HEAP32[$188>>2]|0,$292)|0;$311=$307+$179+(Math_imul(HEAP32[$191>>2]|0,$rv_1)|0)|0;$312=$nr_0_ph+1|0;$314=($rlastfit_0_ph>>2)+$rlastfit_0_ph|0;if(($312|0)>(1-(1-$314&-(($314|0)>1&1))|0)){label=34;break}else{$nr_1=$312;$ru_1=$292;$rv_2=$rv_1;$rlastfit_1=$rlastfit_0_ph;$nrempty_1=$nrempty_0_ph;$rx_1=$305;$ry_1=$311;$dryi_2=$dryi_0_ph;$drxi_2=$drxi_0_ph;label=37;break};case 34:_qr_line_fit_points($40,$r_1,$312,HEAP32[$41>>2]|0);if((_qr_aff_line_step($_aff,$40,1,$39,$dru)|0)>-1){label=35;break}else{$nr_1=$312;$ru_1=$292;$rv_2=$rv_1;$rlastfit_1=$312;$nrempty_1=$nrempty_0_ph;$rx_1=$305;$ry_1=$311;$dryi_2=$dryi_0_ph;$drxi_2=$drxi_0_ph;label=37;break};case 35:$328=HEAP32[$dru>>2]|0;$329=Math_imul($328,HEAP32[$180>>2]|0)|0;$332=(Math_imul(HEAP32[$183>>2]|0,$39)|0)+$329|0;$334=Math_imul(HEAP32[$188>>2]|0,$328)|0;$nr_1=$312;$ru_1=$292;$rv_2=$rv_1;$rlastfit_1=$312;$nrempty_1=$nrempty_0_ph;$rx_1=$305;$ry_1=$311;$dryi_2=(Math_imul(HEAP32[$191>>2]|0,$39)|0)+$334|0;$drxi_2=$332;label=37;break;case 36:$nr_1=$nr_0_ph;$ru_1=$ru_0_ph;$rv_2=$rv_0_ph;$rlastfit_1=$rlastfit_0_ph;$nrempty_1=$nrempty_0_ph+1|0;$rx_1=$rx_0_ph;$ry_1=$ry_0_ph;$dryi_2=$dryi_0_ph;$drxi_2=$drxi_0_ph;label=37;break;case 37:$b_0_ph=$b_0;$nb_0_ph=$nb_0;$cb_0_ph=$cb_0;$r_0_ph=$r_1;$nr_0_ph=$nr_1;$cr_0_ph=$cr_1;$blastfit_0_ph=$blastfit_0;$nbempty_0_ph=$nbempty_0;$ru_0_ph=(HEAP32[$dru>>2]|0)+$ru_1|0;$rv_0_ph=$rv_2+($230?$39:0)|0;$bu_0_ph=$bu_0;$dbyi_0_ph=$dbyi_0;$dbxi_0_ph=$dbxi_0;$by_0_ph=$by_0;$bx_0_ph=$bx_0;$rlastfit_0_ph=$rlastfit_1;$nrempty_0_ph=$230?$nrempty_1:2147483647;$bv_0_ph=$bv_0;$rx_0_ph=$rx_1+$drxi_2|0;$ry_0_ph=$ry_1+$dryi_2|0;$dryi_0_ph=$dryi_2;$drxi_0_ph=$drxi_2;label=22;break;case 38:if($_){label=52;break}else{label=39;break};case 39:$349=(HEAP32[$41>>2]|0)+2|0;$350=$bx_0+$222>>$349;$352=$by_0+$223>>$349;$354=$bx_0-$222>>$349;$356=$by_0-$223>>$349;if(($nb_0|0)<($cb_0|0)){$b_1=$b_0;$cb_1=$cb_0;label=41;break}else{label=40;break};case 40:$360=$cb_0<<1|1;$b_1=_realloc($b_0,$360<<3)|0;$cb_1=$360;label=41;break;case 41:$366=_qr_finder_quick_crossing_check($_img,$_width,$_height,$350,$352,$354,$356)|0;if(($366|0)==0){label=42;break}else{$ret_1=$366;label=43;break};case 42:$ret_1=_qr_finder_locate_crossing($_img,$_width,$350,$352,$354,$356,1,$b_1+($nb_0<<3)|0)|0;label=43;break;case 43:if(($ret_1|0)>-1){label=44;break}else{label=50;break};case 44:if(($ret_1|0)==0){label=45;break}else{$nb_2=$nb_0;$blastfit_2=$blastfit_0;$nbempty_1=0;$bu_3=$bu_0;$dbyi_3=$dbyi_0;$dbxi_3=$dbxi_0;$by_2=$by_0;$bx_2=$bx_0;$bv_2=$bv_0;label=51;break};case 45:_qr_aff_unproject($224,$_aff,HEAP32[$b_1+($nb_0<<3)>>2]|0,HEAP32[$b_1+($nb_0<<3)+4>>2]|0);$380=HEAP32[$224>>2]|0;if(($380+$82|0)>($bu_0|0)){label=46;break}else{$bu_1=$bu_0;label=47;break};case 46:$bu_1=$380+$bu_0>>1;label=47;break;case 47:$389=(HEAP32[$q+4>>2]|0)+$bv_0>>1;$391=Math_imul(HEAP32[$180>>2]|0,$bu_1)|0;$395=$391+$175+(Math_imul(HEAP32[$183>>2]|0,$389)|0)|0;$397=Math_imul(HEAP32[$188>>2]|0,$bu_1)|0;$401=$397+$179+(Math_imul(HEAP32[$191>>2]|0,$389)|0)|0;$402=$nb_0+1|0;$404=($blastfit_0>>2)+$blastfit_0|0;if(($402|0)>(1-(1-$404&-(($404|0)>1&1))|0)){label=48;break}else{$nb_2=$402;$blastfit_2=$blastfit_0;$nbempty_1=0;$bu_3=$bu_1;$dbyi_3=$dbyi_0;$dbxi_3=$dbxi_0;$by_2=$401;$bx_2=$395;$bv_2=$389;label=51;break};case 48:_qr_line_fit_points($83,$b_1,$402,HEAP32[$41>>2]|0);if((_qr_aff_line_step($_aff,$83,0,$82,$dbv)|0)>-1){label=49;break}else{$nb_2=$402;$blastfit_2=$402;$nbempty_1=0;$bu_3=$bu_1;$dbyi_3=$dbyi_0;$dbxi_3=$dbxi_0;$by_2=$401;$bx_2=$395;$bv_2=$389;label=51;break};case 49:$418=Math_imul(HEAP32[$180>>2]|0,$82)|0;$420=HEAP32[$dbv>>2]|0;$422=(Math_imul($420,HEAP32[$183>>2]|0)|0)+$418|0;$424=Math_imul(HEAP32[$188>>2]|0,$82)|0;$nb_2=$402;$blastfit_2=$402;$nbempty_1=0;$bu_3=$bu_1;$dbyi_3=(Math_imul(HEAP32[$191>>2]|0,$420)|0)+$424|0;$dbxi_3=$422;$by_2=$401;$bx_2=$395;$bv_2=$389;label=51;break;case 50:$nb_2=$nb_0;$blastfit_2=$blastfit_0;$nbempty_1=$nbempty_0+1|0;$bu_3=$bu_0;$dbyi_3=$dbyi_0;$dbxi_3=$dbxi_0;$by_2=$by_0;$bx_2=$bx_0;$bv_2=$bv_0;label=51;break;case 51:$b_0=$b_1;$nb_0=$nb_2;$cb_0=$cb_1;$blastfit_0=$blastfit_2;$nbempty_0=$226?$nbempty_1:2147483647;$bu_0=$bu_3+($226?$82:0)|0;$dbyi_0=$dbyi_3;$dbxi_0=$dbxi_3;$by_0=$dbyi_3+$by_2|0;$bx_0=$dbxi_3+$bx_2|0;$bv_0=(HEAP32[$dbv>>2]|0)+$bv_2|0;label=23;break;case 52:if(($nr_0_ph|0)>1){label=53;break}else{label=54;break};case 53:_qr_line_fit_points($40,$r_0_ph,$nr_0_ph,HEAP32[$41>>2]|0);label=55;break;case 54:$440=$p|0;_qr_aff_project($440,$_aff,((HEAP32[$69>>2]|0)*3&-1)+(HEAP32[$67>>2]|0)|0,HEAP32[$76>>2]|0);$446=HEAP32[$183>>2]|0;$449=HEAP32[$191>>2]|0;$453=HEAP32[$183>>2]|0;$460=_qr_ilog((($446|0)>-1?$446:-$446|0)-((($446|0)>-1?$446:-$446|0)-(($449|0)>-1?$449:-$449|0)&-(((($449|0)>-1?$449:-$449|0)|0)>((($453|0)>-1?$453:-$453|0)|0)&1))|0)|0;$464=((HEAP32[$41>>2]|0)+1>>1)-$460|0;$465=HEAP32[$183>>2]|0;$468=HEAP32[$191>>2]|0;$472=HEAP32[$183>>2]|0;$479=_qr_ilog((($465|0)>-1?$465:-$465|0)-((($465|0)>-1?$465:-$465|0)-(($468|0)>-1?$468:-$468|0)&-(((($468|0)>-1?$468:-$468|0)|0)>((($472|0)>-1?$472:-$472|0)|0)&1))|0)|0;$488=-($464&-(($479-((HEAP32[$41>>2]|0)+1>>1)|0)>0&1))|0;$490=1<<$488>>1;HEAP32[$40>>2]=$490+(HEAP32[$191>>2]|0)>>$488;$496=$490-(HEAP32[$183>>2]|0)>>$488;HEAP32[$l+16>>2]=$496;$500=Math_imul(HEAP32[$440>>2]|0,HEAP32[$40>>2]|0)|0;HEAP32[$l+20>>2]=-($500+(Math_imul($496,HEAP32[$p+4>>2]|0)|0)|0);label=55;break;case 55:_free($r_0_ph);if(($nb_0|0)>1){label=56;break}else{label=57;break};case 56:_qr_line_fit_points($83,$b_0,$nb_0,HEAP32[$41>>2]|0);label=58;break;case 57:$513=$p|0;_qr_aff_project($513,$_aff,HEAP32[$109>>2]|0,((HEAP32[$115>>2]|0)*3&-1)+(HEAP32[$113>>2]|0)|0);$519=HEAP32[$183>>2]|0;$522=HEAP32[$191>>2]|0;$526=HEAP32[$183>>2]|0;$533=_qr_ilog((($519|0)>-1?$519:-$519|0)-((($519|0)>-1?$519:-$519|0)-(($522|0)>-1?$522:-$522|0)&-(((($522|0)>-1?$522:-$522|0)|0)>((($526|0)>-1?$526:-$526|0)|0)&1))|0)|0;$537=((HEAP32[$41>>2]|0)+1>>1)-$533|0;$538=HEAP32[$183>>2]|0;$541=HEAP32[$191>>2]|0;$545=HEAP32[$183>>2]|0;$552=_qr_ilog((($538|0)>-1?$538:-$538|0)-((($538|0)>-1?$538:-$538|0)-(($541|0)>-1?$541:-$541|0)&-(((($541|0)>-1?$541:-$541|0)|0)>((($545|0)>-1?$545:-$545|0)|0)&1))|0)|0;$561=-($537&-(($552-((HEAP32[$41>>2]|0)+1>>1)|0)>0&1))|0;$563=1<<$561>>1;HEAP32[$83>>2]=$563+(HEAP32[$188>>2]|0)>>$561;HEAP32[$l+40>>2]=$563-(HEAP32[$180>>2]|0)>>$561;$573=Math_imul(HEAP32[$513>>2]|0,HEAP32[$40>>2]|0)|0;HEAP32[$l+44>>2]=-($573+(Math_imul(HEAP32[$p+4>>2]|0,HEAP32[$l+16>>2]|0)|0)|0);label=58;break;case 58:_free($b_0);$i_2=0;label=59;break;case 59:if(($i_2|0)<4){label=60;break}else{label=63;break};case 60:$593=$_p+($i_2<<3)|0;if((_qr_line_isect($593,$l+(($i_2&1)*12&-1)|0,$l+((($i_2>>1)+2|0)*12&-1)|0)|0)<0){$_0=-1;label=67;break}else{label=61;break};case 61:$602=HEAP32[$593>>2]|0;if(($602|0)>=(-$_width<<2|0)&($602|0)<($_width<<3|0)){label=62;break}else{$_0=-1;label=67;break};case 62:$607=HEAP32[$_p+($i_2<<3)+4>>2]|0;if(($607|0)>=(-$_height<<2|0)&($607|0)<($_height<<3|0)){$i_2=$i_2+1|0;label=59;break}else{$_0=-1;label=67;break};case 63:$613=HEAP32[$_p+24>>2]|0;$615=HEAP32[$_p+28>>2]|0;$626=(HEAP32[$_ul+12>>2]|0)+(HEAP32[$_ul+8>>2]|0)+(HEAP32[$_ur+8>>2]|0)+(HEAP32[$_dl+12>>2]|0)|0;if(($626|0)>4){label=64;break}else{$bry_0=$615;$brx_0=$613;label=66;break};case 64:$629=$626+16|0;$630=$_p|0;$632=$_p+4|0;$634=$_p+8|0;$636=$_p+12|0;$638=$_p+16|0;$640=$_p+20|0;_qr_hom_cell_init($cell,0,0,$629,0,0,$629,$629,$629,HEAP32[$630>>2]|0,HEAP32[$632>>2]|0,HEAP32[$634>>2]|0,HEAP32[$636>>2]|0,HEAP32[$638>>2]|0,HEAP32[$640>>2]|0,$613,$615);$642=$p3|0;$643=$626+10|0;if((_qr_alignment_pattern_search($642,$cell,$643,$643,4,$_img,$_width,$_height)|0)>-1){label=65;break}else{$bry_0=$615;$brx_0=$613;label=66;break};case 65:$647=HEAP32[$638>>2]|0;$648=HEAP32[$636>>2]|0;$649=Math_imul($648,$647)|0;$650=HEAP32[$640>>2]|0;$651=HEAP32[$634>>2]|0;$653=$649-(Math_imul($651,$650)|0)|0;$654=$647-$651|0;$655=$650-$648|0;$656=Math_imul($653,$643)|0;$657=$626+4|0;$659=Math_imul(HEAP32[$630>>2]|0,$655)|0;$664=(Math_imul($659-(Math_imul(HEAP32[$632>>2]|0,$654)|0)|0,$657)|0)+$656|0;$666=Math_imul(HEAP32[$642>>2]|0,$655)|0;$667=$p3+4|0;$672=$664+(($666-(Math_imul(HEAP32[$667>>2]|0,$654)|0)|0)*6&-1)|0;$673=$672>>31;$674=($672|0)>-1?$672:-$672|0;$675=HEAP32[$630>>2]|0;$676=Math_imul($675,$643)|0;$678=HEAP32[$642>>2]|0;$679=Math_imul($678,$655)|0;$681$0=___muldi3($679,($679|0)<0?-1:0,$676,($676|0)<0?-1:0)|0;$681$1=tempRet0;$682=Math_imul($678,$657)|0;$684=HEAP32[$632>>2]|0;$686=$653-(Math_imul($684,$654)|0)|0;$688$0=___muldi3($686,($686|0)<0?-1:0,$682,($682|0)<0?-1:0)|0;$688$1=tempRet0;$689=$675*6&-1;$691=HEAP32[$667>>2]|0;$693=$653-(Math_imul($691,$654)|0)|0;$695$0=___muldi3($693,($693|0)<0?-1:0,$689,($689|0)<0?-1:0)|0;$695$1=tempRet0;$696$0=$673;$696$1=($673|0)<0?-1:0;$697$0=_i64Add($696$0,$696$1,$681$0,$681$1)|0;$698$0=_i64Add($697$0,tempRet0,$688$0,$688$1)|0;$699$0=_i64Add($698$0,tempRet0,$695$0,$695$1)|0;$700$1=tempRet0^$696$1;$701=$674>>1;$702=$700$1>>>31|0<<1;$705=$701-$702^-$702;$707$0=_i64Add($705,($705|0)<0?-1:0,$699$0^$696$0,$700$1)|0;$708$0=$674;$708$1=($674|0)<0?-1:0;$709$0=___divdi3($707$0,tempRet0,$708$0,$708$1)|0;$711=Math_imul($684,$643)|0;$714=Math_imul($691,-$654|0)|0;$716$0=___muldi3($714,($714|0)<0?-1:0,$711,($711|0)<0?-1:0)|0;$716$1=tempRet0;$717=Math_imul($691,$657)|0;$720=(Math_imul($675,$655)|0)+$653|0;$722$0=___muldi3($717,($717|0)<0?-1:0,$720,($720|0)<0?-1:0)|0;$722$1=tempRet0;$723=$684*6&-1;$725=$679+$653|0;$727$0=___muldi3($723,($723|0)<0?-1:0,$725,($725|0)<0?-1:0)|0;$728$0=_i64Add($696$0,$696$1,$727$0,tempRet0)|0;$729$0=_i64Add($728$0,tempRet0,$722$0,$722$1)|0;$730$0=_i64Add($729$0,tempRet0,$716$0,$716$1)|0;$731$1=tempRet0^$696$1;$732=$731$1>>>31|0<<1;$735=$701-$732^-$732;$737$0=_i64Add($735,($735|0)<0?-1:0,$730$0^$696$0,$731$1)|0;$738$0=___divdi3($737$0,tempRet0,$708$0,$708$1)|0;$bry_0=$738$0;$brx_0=$709$0;label=66;break;case 66:_qr_hom_init($_hom,HEAP32[$_p>>2]|0,HEAP32[$_p+4>>2]|0,HEAP32[$_p+8>>2]|0,HEAP32[$_p+12>>2]|0,HEAP32[$_p+16>>2]|0,HEAP32[$_p+20>>2]|0,$brx_0,$bry_0);$_0=0;label=67;break;case 67:STACKTOP=__stackBase__;return $_0|0}return 0}function _qr_hom_unproject($_q,$_hom,$_x,$_y){$_q=$_q|0;$_hom=$_hom|0;$_x=$_x|0;$_y=$_y|0;var $3=0,$6=0,$9=0,$13=0,$16=0,$20=0,$23=0,$27=0,$32=0,$36=0,$x_0=0,$y_0=0,$w_0=0,$51=0,$52=0,$57=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$3=$_x-(HEAP32[$_hom+56>>2]|0)|0;$6=$_y-(HEAP32[$_hom+60>>2]|0)|0;$9=Math_imul(HEAP32[$_hom+24>>2]|0,$3)|0;$13=(Math_imul(HEAP32[$_hom+28>>2]|0,$6)|0)+$9|0;$16=Math_imul(HEAP32[$_hom+32>>2]|0,$3)|0;$20=(Math_imul(HEAP32[$_hom+36>>2]|0,$6)|0)+$16|0;$23=Math_imul(HEAP32[$_hom+40>>2]|0,$3)|0;$27=(Math_imul(HEAP32[$_hom+44>>2]|0,$6)|0)+$23|0;$32=HEAP32[$_hom+64>>2]|0;$36=$27+(HEAP32[$_hom+52>>2]|0)+(1<<$32-1)>>$32;if(($36|0)==0){label=2;break}else{label=3;break};case 2:HEAP32[$_q>>2]=($13>>>31)+2147483647;HEAP32[$_q+4>>2]=($20>>>31)+2147483647;$_0=-1;label=6;break;case 3:if(($36|0)<0){label=4;break}else{$w_0=$36;$y_0=$20;$x_0=$13;label=5;break};case 4:$w_0=-$36|0;$y_0=-$20|0;$x_0=-$13|0;label=5;break;case 5:$51=$w_0>>1;$52=$x_0>>31;HEAP32[$_q>>2]=(($51+$52^$52)+$x_0|0)/($w_0|0)&-1;$57=$y_0>>31;HEAP32[$_q+4>>2]=(($51+$57^$57)+$y_0|0)/($w_0|0)&-1;$_0=0;label=6;break;case 6:return $_0|0}return 0}function _qr_finder_edge_pts_hom_classify($_f,$_hom){$_f=$_f|0;$_hom=$_hom|0;var $q=0,$1=0,$2=0,$3=0,$5=0,$6=0,$i_040=0,$11=0,$23=0,$25=0,$28=0,$30=0,$33=0,$34=0,$49=0,$50=0,$_lcssa=0,$53=0,$56=0,$59=0,$_sum=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=2;while(1)switch(label|0){case 2:$q=__stackBase__|0;$1=HEAP32[$_f+72>>2]|0;_memset($_f+32|0,0,16);$2=$1+12|0;$3=HEAP32[$2>>2]|0;if(($3|0)>0){label=3;break}else{$_lcssa=$3;label=8;break};case 3:$5=$q|0;$6=$1+8|0;$i_040=0;label=4;break;case 4:$11=HEAP32[$6>>2]|0;if((_qr_hom_unproject($5,$_hom,HEAP32[$11+($i_040<<4)>>2]|0,HEAP32[$11+($i_040<<4)+4>>2]|0)|0)>-1){label=5;break}else{label=6;break};case 5:_qr_point_translate($5,-(HEAP32[$_f+64>>2]|0)|0,-(HEAP32[$_f+68>>2]|0)|0);$23=HEAP32[$q+4>>2]|0;$25=HEAP32[$5>>2]|0;$28=((($23|0)>-1?$23:-$23|0)|0)>((($25|0)>-1?$25:-$25|0)|0)&1;$30=$q+($28<<2)|0;$33=($28<<1|(HEAP32[$30>>2]|0)>>>31)^1;$34=$_f+32+($33<<2)|0;HEAP32[$34>>2]=(HEAP32[$34>>2]|0)+1;HEAP32[(HEAP32[$6>>2]|0)+($i_040<<4)+8>>2]=$33;HEAP32[(HEAP32[$6>>2]|0)+($i_040<<4)+12>>2]=HEAP32[$30>>2];label=7;break;case 6:HEAP32[(HEAP32[$6>>2]|0)+($i_040<<4)+8>>2]=4;HEAP32[(HEAP32[$6>>2]|0)+($i_040<<4)+12>>2]=HEAP32[$5>>2];label=7;break;case 7:$49=$i_040+1|0;$50=HEAP32[$2>>2]|0;if(($49|0)<($50|0)){$i_040=$49;label=4;break}else{$_lcssa=$50;label=8;break};case 8:$53=$1+8|0;_qsort(HEAP32[$53>>2]|0,$_lcssa|0,16,4);$56=HEAP32[$53>>2]|0;HEAP32[$_f+16>>2]=$56;$59=HEAP32[$_f+32>>2]|0;HEAP32[$_f+20>>2]=$56+($59<<4);$_sum=$59+(HEAP32[$_f+36>>2]|0)|0;HEAP32[$_f+24>>2]=$56+($_sum<<4);HEAP32[$_f+28>>2]=$56+($_sum+(HEAP32[$_f+40>>2]|0)<<4);STACKTOP=__stackBase__;return}}function _qr_finder_version_decode($_f,$_hom,$_img,$_width,$_height,$_dir){$_f=$_f|0;$_hom=$_hom|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;$_dir=$_dir|0;var $q=0,$v=0,$p=0,$3=0,$8=0,$11=0,$19=0,$20=0,$24=0,$26=0,$29=0,$33=0,$36=0,$40=0,$43=0,$46=0,$47=0,$50=0,$53=0,$56=0,$57=0,$60=0,$63=0,$64=0,$65=0,$_lcssa66=0,$k_064=0,$i_063=0,$x0_062=0,$y0_061=0,$w0_060=0,$70=0,$71=0,$72=0,$73=0,$79=0,$88=0,$93=0,$96=0,$102=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+24|0;label=1;while(1)switch(label|0){case 1:$q=__stackBase__|0;$v=__stackBase__+8|0;$p=__stackBase__+16|0;HEAP32[$v>>2]=0;$3=$_f+($_dir<<2)|0;HEAP32[$q+($_dir<<2)>>2]=((HEAP32[$3>>2]|0)*-7&-1)+(HEAP32[$_f+64+($_dir<<2)>>2]|0);$8=1-$_dir|0;$11=$_f+($8<<2)|0;HEAP32[$q+($8<<2)>>2]=((HEAP32[$11>>2]|0)*-3&-1)+(HEAP32[$_f+64+($8<<2)>>2]|0);$19=HEAP32[$q>>2]|0;$20=Math_imul($19,HEAP32[$_hom>>2]|0)|0;$24=HEAP32[$q+4>>2]|0;$26=(Math_imul($24,HEAP32[$_hom+4>>2]|0)|0)+$20|0;$29=Math_imul(HEAP32[$_hom+8>>2]|0,$19)|0;$33=(Math_imul(HEAP32[$_hom+12>>2]|0,$24)|0)+$29|0;$36=Math_imul(HEAP32[$_hom+16>>2]|0,$19)|0;$40=(Math_imul(HEAP32[$_hom+20>>2]|0,$24)|0)+$36|0;$43=$40+(HEAP32[$_hom+48>>2]|0)|0;$46=HEAP32[$11>>2]|0;$47=Math_imul($46,HEAP32[$_hom+($8<<2)>>2]|0)|0;$50=Math_imul(HEAP32[$_hom+8+($8<<2)>>2]|0,$46)|0;$53=Math_imul(HEAP32[$_hom+16+($8<<2)>>2]|0,$46)|0;$56=HEAP32[$3>>2]|0;$57=Math_imul($56,HEAP32[$_hom+($_dir<<2)>>2]|0)|0;$60=Math_imul(HEAP32[$_hom+8+($_dir<<2)>>2]|0,$56)|0;$63=Math_imul(HEAP32[$_hom+16+($_dir<<2)>>2]|0,$56)|0;$64=$p|0;$65=$p+4|0;$w0_060=$43;$y0_061=$33;$x0_062=$26;$i_063=0;$k_064=0;$_lcssa66=HEAP32[$v>>2]|0;label=2;break;case 2:_qr_hom_fproject($64,$_hom,$x0_062,$y0_061,$w0_060);$70=$_lcssa66|(_qr_img_get_bit($_img,$_width,$_height,HEAP32[$64>>2]|0,HEAP32[$65>>2]|0)|0)<<$k_064;$71=$x0_062+$57|0;$72=$y0_061+$60|0;$73=$w0_060+$63|0;_qr_hom_fproject($64,$_hom,$71,$72,$73);$79=$70|(_qr_img_get_bit($_img,$_width,$_height,HEAP32[$64>>2]|0,HEAP32[$65>>2]|0)|0)<<$k_064+1;_qr_hom_fproject($64,$_hom,$71+$57|0,$72+$60|0,$73+$63|0);$88=$79|(_qr_img_get_bit($_img,$_width,$_height,HEAP32[$64>>2]|0,HEAP32[$65>>2]|0)|0)<<$k_064+2;$93=$i_063+1|0;if(($93|0)<6){$w0_060=$w0_060+$53|0;$y0_061=$y0_061+$50|0;$x0_062=$x0_062+$47|0;$i_063=$93;$k_064=$k_064+3|0;$_lcssa66=$88;label=2;break}else{label=3;break};case 3:HEAP32[$v>>2]=$88;$96=_bch18_6_correct($v)|0;if(($96|0)>-1){label=4;break}else{$102=$96;label=5;break};case 4:$102=(HEAP32[$v>>2]|0)>>>12;label=5;break;case 5:STACKTOP=__stackBase__;return $102|0}return 0}function _qr_finder_fmt_info_decode($_ul,$_ur,$_dl,$_hom,$_img,$_width,$_height){$_ul=$_ul|0;$_ur=$_ur|0;$_dl=$_dl|0;$_hom=$_hom|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $p=0,$lo=0,$hi=0,$fmt_info=0,$count=0,$nerrs=0,$v1=0,$1=0,$4=0,$7=0,$11=0,$13=0,$14=0,$16=0,$17=0,$18=0,$20=0,$21=0,$23=0,$24=0,$25=0,$27=0,$28=0,$30=0,$31=0,$32=0,$34=0,$35=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=0,$44=0,$x_0=0,$y_0=0,$w_0=0,$i_0=0,$k_0=0,$50=0,$52=0,$55=0,$k_1=0,$61=0,$63=0,$64=0,$66=0,$68=0,$x_1_ph=0,$y_1_ph=0,$w_1_ph=0,$i_1_ph=0,$k_2_ph=0,$x_1=0,$y_1=0,$w_1=0,$i_1=0,$70=0,$73=0,$74=0,$75=0,$82=0,$86=0,$90=0,$92=0,$98=0,$99=0,$100=0,$103=0,$104=0,$105=0,$108=0,$109=0,$110=0,$113=0,$115=0,$116=0,$117=0,$118=0,$120=0,$k_3176=0,$w_2175=0,$y_2174=0,$x_2173=0,$125=0,$129=0,$132=0,$138=0,$142=0,$144=0,$146=0,$147=0,$149=0,$151=0,$152=0,$154=0,$156=0,$157=0,$159=0,$161=0,$162=0,$163=0,$164=0,$166=0,$k_4171=0,$w_3170=0,$y_3169=0,$x_3168=0,$171=0,$175=0,$181=0,$185=0,$190=0,$191=0,$i_2164=0,$nfmt_info_0163=0,$200=0,$202=0,$_=0,$j_0=0,$218=0,$221=0,$nfmt_info_1=0,$226=0,$228=0,$229=0,$i_3158=0,$besti_0157=0,$237=0,$239=0,$besti_1=0,$250=0,$252=0,$253=0,$_lcssa=0,$besti_0_lcssa=0,$259=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+80|0;label=1;while(1)switch(label|0){case 1:$p=__stackBase__|0;$lo=__stackBase__+8|0;$hi=__stackBase__+16|0;$fmt_info=__stackBase__+24|0;$count=__stackBase__+40|0;$nerrs=__stackBase__+56|0;$v1=__stackBase__+72|0;$1=$lo|0;HEAP32[$1>>2]=0;$4=$_ul|0;$7=((HEAP32[$4>>2]|0)*5&-1)+(HEAP32[$_ul+64>>2]|0)|0;$11=HEAP32[$_ul+4>>2]|0;$13=($11*-3&-1)+(HEAP32[$_ul+68>>2]|0)|0;$14=$_hom|0;$16=Math_imul(HEAP32[$14>>2]|0,$7)|0;$17=$_hom+4|0;$18=HEAP32[$17>>2]|0;$20=(Math_imul($18,$13)|0)+$16|0;$21=$_hom+8|0;$23=Math_imul(HEAP32[$21>>2]|0,$7)|0;$24=$_hom+12|0;$25=HEAP32[$24>>2]|0;$27=(Math_imul($25,$13)|0)+$23|0;$28=$_hom+16|0;$30=Math_imul(HEAP32[$28>>2]|0,$7)|0;$31=$_hom+20|0;$32=HEAP32[$31>>2]|0;$34=(Math_imul($32,$13)|0)+$30|0;$35=$_hom+48|0;$37=$34+(HEAP32[$35>>2]|0)|0;$38=Math_imul($18,$11)|0;$39=Math_imul($25,$11)|0;$40=Math_imul($32,$11)|0;$41=$p|0;$42=$p+4|0;$k_0=0;$i_0=0;$w_0=$37;$y_0=$27;$x_0=$20;$44=HEAP32[$1>>2]|0;label=2;break;case 2:if(($i_0|0)==6){$k_1=$k_0;$55=$44;label=4;break}else{label=3;break};case 3:_qr_hom_fproject($41,$_hom,$x_0,$y_0,$w_0);$50=$k_0+1|0;$52=$44|(_qr_img_get_bit($_img,$_width,$_height,HEAP32[$41>>2]|0,HEAP32[$42>>2]|0)|0)<<$k_0;if(($i_0|0)>7){label=5;break}else{$k_1=$50;$55=$52;label=4;break};case 4:$k_0=$k_1;$i_0=$i_0+1|0;$w_0=$w_0+$40|0;$y_0=$y_0+$39|0;$x_0=$x_0+$38|0;$44=$55;label=2;break;case 5:HEAP32[$1>>2]=$52;$61=$hi|0;HEAP32[$61>>2]=0;$63=HEAP32[$4>>2]|0;$64=Math_imul($63,HEAP32[$14>>2]|0)|0;$66=Math_imul(HEAP32[$21>>2]|0,$63)|0;$68=Math_imul(HEAP32[$28>>2]|0,$63)|0;$k_2_ph=$50;$i_1_ph=$i_0;$w_1_ph=$w_0;$y_1_ph=$y_0;$x_1_ph=$x_0;label=6;break;case 6:$i_1=$i_1_ph;$w_1=$w_1_ph;$y_1=$y_1_ph;$x_1=$x_1_ph;label=7;break;case 7:$70=$i_1-1|0;if(($i_1|0)>0){label=8;break}else{label=10;break};case 8:$73=$x_1-$64|0;$74=$y_1-$66|0;$75=$w_1-$68|0;if(($70|0)==6){$i_1=6;$w_1=$75;$y_1=$74;$x_1=$73;label=7;break}else{label=9;break};case 9:_qr_hom_fproject($41,$_hom,$73,$74,$75);$82=(_qr_img_get_bit($_img,$_width,$_height,HEAP32[$41>>2]|0,HEAP32[$42>>2]|0)|0)<<$k_2_ph;HEAP32[$61>>2]=HEAP32[$61>>2]|$82;$k_2_ph=$k_2_ph+1|0;$i_1_ph=$70;$w_1_ph=$75;$y_1_ph=$74;$x_1_ph=$73;label=6;break;case 10:$86=$lo+4|0;HEAP32[$86>>2]=0;$90=HEAP32[$_ur>>2]|0;$92=($90*3&-1)+(HEAP32[$_ur+64>>2]|0)|0;$98=((HEAP32[$_ur+4>>2]|0)*5&-1)+(HEAP32[$_ur+68>>2]|0)|0;$99=HEAP32[$14>>2]|0;$100=Math_imul($99,$92)|0;$103=(Math_imul(HEAP32[$17>>2]|0,$98)|0)+$100|0;$104=HEAP32[$21>>2]|0;$105=Math_imul($104,$92)|0;$108=(Math_imul(HEAP32[$24>>2]|0,$98)|0)+$105|0;$109=HEAP32[$28>>2]|0;$110=Math_imul($109,$92)|0;$113=(Math_imul(HEAP32[$31>>2]|0,$98)|0)+$110|0;$115=$113+(HEAP32[$35>>2]|0)|0;$116=Math_imul($99,$90)|0;$117=Math_imul($104,$90)|0;$118=Math_imul($109,$90)|0;$x_2173=$103;$y_2174=$108;$w_2175=$115;$k_3176=0;$120=HEAP32[$86>>2]|0;label=11;break;case 11:_qr_hom_fproject($41,$_hom,$x_2173,$y_2174,$w_2175);$125=$120|(_qr_img_get_bit($_img,$_width,$_height,HEAP32[$41>>2]|0,HEAP32[$42>>2]|0)|0)<<$k_3176;$129=$k_3176+1|0;if(($129|0)<8){$x_2173=$x_2173-$116|0;$y_2174=$y_2174-$117|0;$w_2175=$w_2175-$118|0;$k_3176=$129;$120=$125;label=11;break}else{label=12;break};case 12:HEAP32[$86>>2]=$125;$132=$hi+4|0;HEAP32[$132>>2]=0;$138=((HEAP32[$_dl>>2]|0)*5&-1)+(HEAP32[$_dl+64>>2]|0)|0;$142=HEAP32[$_dl+4>>2]|0;$144=($142*-3&-1)+(HEAP32[$_dl+68>>2]|0)|0;$146=Math_imul(HEAP32[$14>>2]|0,$138)|0;$147=HEAP32[$17>>2]|0;$149=(Math_imul($147,$144)|0)+$146|0;$151=Math_imul(HEAP32[$21>>2]|0,$138)|0;$152=HEAP32[$24>>2]|0;$154=(Math_imul($152,$144)|0)+$151|0;$156=Math_imul(HEAP32[$28>>2]|0,$138)|0;$157=HEAP32[$31>>2]|0;$159=(Math_imul($157,$144)|0)+$156|0;$161=$159+(HEAP32[$35>>2]|0)|0;$162=Math_imul($147,$142)|0;$163=Math_imul($152,$142)|0;$164=Math_imul($157,$142)|0;$x_3168=$149;$y_3169=$154;$w_3170=$161;$k_4171=8;$166=HEAP32[$132>>2]|0;label=13;break;case 13:_qr_hom_fproject($41,$_hom,$x_3168,$y_3169,$w_3170);$171=$166|(_qr_img_get_bit($_img,$_width,$_height,HEAP32[$41>>2]|0,HEAP32[$42>>2]|0)|0)<<$k_4171;$175=$k_4171+1|0;if(($175|0)<15){$x_3168=$x_3168+$162|0;$y_3169=$y_3169+$163|0;$w_3170=$w_3170+$164|0;$k_4171=$175;$166=$171;label=13;break}else{label=14;break};case 14:HEAP32[$132>>2]=$171;$181=2<<((HEAP32[$61>>2]|0)!=($171|0)&1);$185=(HEAP32[$1>>2]|0)==(HEAP32[$86>>2]|0)?2:1;if(($181|0)>0){$nfmt_info_0163=0;$i_2164=0;label=17;break}else{label=15;break};case 15:$besti_0_lcssa=0;$_lcssa=HEAP32[$nerrs>>2]|0;label=31;break;case 16:$190=$nerrs|0;$191=HEAP32[$190>>2]|0;if(($nfmt_info_1|0)>1){$besti_0157=0;$i_3158=1;$229=$190;$228=$191;label=24;break}else{$besti_0_lcssa=0;$_lcssa=$191;label=31;break};case 17:HEAP32[$v1>>2]=(HEAP32[$hi+($i_2164>>1<<2)>>2]|HEAP32[$lo+(($i_2164&1)<<2)>>2])^21522;$200=_bch15_5_correct($v1)|0;$202=(HEAP32[$v1>>2]|0)>>>10;HEAP32[$v1>>2]=$202;$_=($200|0)<0?4:$200;$j_0=0;label=18;break;case 18:if(($j_0|0)<($nfmt_info_0163|0)){label=20;break}else{label=19;break};case 19:HEAP32[$fmt_info+($j_0<<2)>>2]=HEAP32[$v1>>2];HEAP32[$count+($j_0<<2)>>2]=1;HEAP32[$nerrs+($j_0<<2)>>2]=$_;$nfmt_info_1=$nfmt_info_0163+1|0;label=23;break;case 20:if((HEAP32[$fmt_info+($j_0<<2)>>2]|0)==($202|0)){label=21;break}else{$j_0=$j_0+1|0;label=18;break};case 21:$218=$count+($j_0<<2)|0;HEAP32[$218>>2]=(HEAP32[$218>>2]|0)+1;$221=$nerrs+($j_0<<2)|0;if(($_|0)<(HEAP32[$221>>2]|0)){label=22;break}else{$nfmt_info_1=$nfmt_info_0163;label=23;break};case 22:HEAP32[$221>>2]=$_;$nfmt_info_1=$nfmt_info_0163;label=23;break;case 23:$226=$i_2164+$185|0;if(($226|0)<($181|0)){$nfmt_info_0163=$nfmt_info_1;$i_2164=$226;label=17;break}else{label=16;break};case 24:if(($228|0)>3){label=25;break}else{label=26;break};case 25:if((HEAP32[$nerrs+($i_3158<<2)>>2]|0)<4){label=29;break}else{label=26;break};case 26:$237=HEAP32[$count+($i_3158<<2)>>2]|0;$239=HEAP32[$count+($besti_0157<<2)>>2]|0;if(($237|0)>($239|0)){label=29;break}else{label=27;break};case 27:if(($237|0)==($239|0)){label=28;break}else{$besti_1=$besti_0157;label=30;break};case 28:if((HEAP32[$nerrs+($i_3158<<2)>>2]|0)<(HEAP32[$229>>2]|0)){label=29;break}else{$besti_1=$besti_0157;label=30;break};case 29:$besti_1=$i_3158;label=30;break;case 30:$250=$i_3158+1|0;$252=$nerrs+($besti_1<<2)|0;$253=HEAP32[$252>>2]|0;if(($250|0)<($nfmt_info_1|0)){$besti_0157=$besti_1;$i_3158=$250;$229=$252;$228=$253;label=24;break}else{$besti_0_lcssa=$besti_1;$_lcssa=$253;label=31;break};case 31:if(($_lcssa|0)<4){label=32;break}else{$259=-1;label=33;break};case 32:$259=HEAP32[$fmt_info+($besti_0_lcssa<<2)>>2]|0;label=33;break;case 33:STACKTOP=__stackBase__;return $259|0}return 0}function _qr_code_decode($_qrdata,$_gf,$_ul_pos,$_ur_pos,$_dl_pos,$_version,$_fmt_info,$_img,$_width,$_height){$_qrdata=$_qrdata|0;$_gf=$_gf|0;$_ul_pos=$_ul_pos|0;$_ur_pos=$_ur_pos|0;$_dl_pos=$_dl_pos|0;$_version=$_version|0;$_fmt_info=$_fmt_info|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $grid=0,$2=0,$3=0,$8=0,$9=0,$11=0,$12=0,$14=0,$15=0,$21=0,$22=0,$23=0,$25=0,$27=0,$28=0,$29=0,$i_077=0,$38=0,$ncodewords_076=0,$ndata_075=0,$i_174=0,$46=0,$47=0,$51=0,$54=0,$55=0,$ndata_0_lcssa=0,$57=0,$ret_1=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+56|0;label=1;while(1)switch(label|0){case 1:$grid=__stackBase__|0;_qr_sampling_grid_init($grid,$_version,$_ul_pos,$_ur_pos,$_dl_pos,$_qrdata+16|0,$_img,$_width,$_height);$2=$_version<<2;$3=$2+17|0;$8=_malloc(Math_imul($3<<2,$2+48>>5)|0)|0;$9=$8;_qr_sampling_grid_sample($grid,$9,$3,$_fmt_info,$_img,$_width,$_height);$11=$_fmt_info>>3^1;$12=$_version-1|0;$14=HEAP8[10248+($12<<2)+$11|0]|0;$15=$14&255;$21=HEAPU8[10136+((HEAPU8[10208+$12|0]|0)+$11)|0]|0;$22=_qr_code_ncodewords($_version)|0;$23=($22|0)/($15|0)&-1;$25=$15-(($22|0)%($15|0)&-1)|0;$27=_malloc($15<<2)|0;$28=$27;$29=_malloc($22)|0;HEAP32[$28>>2]=$29;if(($14&255)>1){$i_077=1;label=2;break}else{label=3;break};case 2:HEAP32[$28+($i_077<<2)>>2]=(HEAP32[$28+($i_077-1<<2)>>2]|0)+((($i_077|0)>($25|0)&1)+$23);$38=$i_077+1|0;if(($38|0)<($15|0)){$i_077=$38;label=2;break}else{label=3;break};case 3:_qr_samples_unpack($28,$15,$23-$21|0,$25,$9,HEAP32[$grid+24>>2]|0,$3);_qr_sampling_grid_clear($grid);_free($27);_free($8);if($14<<24>>24==0){$ndata_0_lcssa=0;label=6;break}else{$i_174=0;$ndata_075=0;$ncodewords_076=0;label=4;break};case 4:$46=(($i_174|0)>=($25|0)&1)+$23|0;$47=$29+$ncodewords_076|0;if((_rs_correct($_gf,0,$47,$46,$21,0,0)|0)<0){$ret_1=-1;label=9;break}else{label=5;break};case 5:$51=$46-$21|0;_memmove($29+$ndata_075|0,$47|0,$51|0);$54=$51+$ndata_075|0;$55=$i_174+1|0;if(($55|0)<($15|0)){$i_174=$55;$ndata_075=$54;$ncodewords_076=$46+$ncodewords_076|0;label=4;break}else{$ndata_0_lcssa=$54;label=6;break};case 6:$57=_qr_code_data_parse($_qrdata,$_version,$29,$ndata_0_lcssa)|0;if(($57|0)<0){label=7;break}else{label=8;break};case 7:_qr_code_data_clear($_qrdata);label=8;break;case 8:HEAP8[$_qrdata+8|0]=$_version&255;HEAP8[$_qrdata+9|0]=$11&255;$ret_1=$57;label=9;break;case 9:_free($29);STACKTOP=__stackBase__;return $ret_1|0}return 0}function _qr_code_ncodewords($_version){$_version=$_version|0;var $6=0,$7=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_version|0)==1){$_0=26;label=3;break}else{label=2;break};case 2:$6=Math_imul($_version<<4,$_version+8|0)|0;$7=(($_version>>>0)/7>>>0)*5&-1;$_0=($6+83+(-($_version>>>0<7&1)&36)-(Math_imul($7+10|0,$7+8|0)|0)|0)>>>3;label=3;break;case 3:return $_0|0}return 0}function _qr_sampling_grid_init($_grid,$_version,$_ul_pos,$_ur_pos,$_dl_pos,$_p,$_img,$_width,$_height){$_grid=$_grid|0;$_version=$_version|0;$_ul_pos=$_ul_pos|0;$_ur_pos=$_ur_pos|0;$_dl_pos=$_dl_pos|0;$_p=$_p|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $base_cell=0,$align_pos=0,$p0=0,$p1=0,$p2=0,$1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$10=0,$14=0,$18=0,$22=0,$23=0,$28=0,$29=0,$31=0,$i_0338=0,$37=0,$38=0,$46=0,$47=0,$49=0,$58=0,$59=0,$60=0,$61=0,$62=0,$71=0,$i_1335=0,$87=0,$95=0,$104=0,$106=0,$107=0,$108=0,$109=0,$110=0,$111=0,$k_0331=0,$119=0,$121=0,$122=0,$128=0,$j_0330=0,$131=0,$133=0,$135=0,$137=0,$138=0,$139=0,$142=0,$143=0,$146=0,$_sum322=0,$_sum323=0,$152=0,$155=0,$156=0,$162=0,$166=0,$167=0,$173=0,$177=0,$178=0,$184=0,$188=0,$189=0,$195=0,$199=0,$200=0,$206=0,$210=0,$211=0,$217=0,$220=0,$222=0,$223=0,$224=0,$233=0,$cell_0=0,$268=0,$277=0,$278=0,$287=0,$310=0,$312=0,$330=0,$335=0,$341=0,$342=0,$344=0,$345=0,$346=0,$347=0,$353=0,$360=0,$361=0,$367=0,$374=0,$375=0,$381=0,$388=0,$389=0,$395=0,$402=0,$403=0,$409=0,$416=0,$417=0,$423=0,$430=0,$431=0,$437=0,$444=0,$445=0,$451=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+112|0;label=1;while(1)switch(label|0){case 1:$base_cell=__stackBase__|0;$align_pos=__stackBase__+56|0;$p0=__stackBase__+88|0;$p1=__stackBase__+96|0;$p2=__stackBase__+104|0;$1=$_version<<2;$2=$1+17|0;$3=($_version|0)/7&-1;$4=$3+2|0;$5=$1+16|0;$6=$_p|0;$10=$_p+8|0;$14=$_p+16|0;$18=$_p+24|0;_qr_hom_cell_init($base_cell,0,0,$5,0,0,$5,$5,$5,HEAP32[$6>>2]|0,HEAP32[$_p+4>>2]|0,HEAP32[$10>>2]|0,HEAP32[$_p+12>>2]|0,HEAP32[$14>>2]|0,HEAP32[$_p+20>>2]|0,HEAP32[$18>>2]|0,HEAP32[$_p+28>>2]|0);$22=$3+1|0;$23=$_grid+52|0;HEAP32[$23>>2]=$22;$28=$_grid|0;HEAP32[$28>>2]=_malloc(Math_imul($22*52&-1,$22)|0)|0;$29=HEAP32[$23>>2]|0;if(($29|0)>1){$i_0338=1;$31=$29;label=2;break}else{label=3;break};case 2:HEAP32[$_grid+($i_0338<<2)>>2]=(HEAP32[$_grid+($i_0338-1<<2)>>2]|0)+($31*52&-1);$37=$i_0338+1|0;$38=HEAP32[$23>>2]|0;if(($37|0)<($38|0)){$i_0338=$37;$31=$38;label=2;break}else{label=3;break};case 3:HEAP32[$_grid+24>>2]=_calloc($2,$1+48>>5<<2)|0;_qr_sampling_grid_fp_mask_rect($_grid,$2,0,0,9,9);$46=$1+9|0;_qr_sampling_grid_fp_mask_rect($_grid,$2,0,$46,9,8);_qr_sampling_grid_fp_mask_rect($_grid,$2,$46,0,8,9);$47=($_version|0)>6;if($47){label=4;break}else{label=5;break};case 4:$49=$1+6|0;_qr_sampling_grid_fp_mask_rect($_grid,$2,0,$49,6,3);_qr_sampling_grid_fp_mask_rect($_grid,$2,$49,0,3,6);label=5;break;case 5:_qr_sampling_grid_fp_mask_rect($_grid,$2,9,6,$1,1);_qr_sampling_grid_fp_mask_rect($_grid,$2,6,9,1,$1);if(($_version|0)<2){label=6;break}else{label=7;break};case 6:_memcpy(HEAP32[$28>>2]|0,$base_cell|0,52)|0;label=24;break;case 7:$58=Math_imul($4<<3,$4)|0;$59=_malloc($58)|0;$60=$59;$61=_malloc($58)|0;$62=$61;HEAP32[$align_pos>>2]=6;HEAP32[$align_pos+($22<<2)>>2]=$1+10;if($47){label=8;break}else{label=10;break};case 8:$i_1335=$22;$71=$3;label=9;break;case 9:HEAP32[$align_pos+($71<<2)>>2]=(HEAP32[$align_pos+($i_1335<<2)>>2]|0)-(HEAPU8[10456+($_version-7)|0]|0);if(($71|0)>1){$i_1335=$71;$71=$71-1|0;label=9;break}else{label=10;break};case 10:HEAP32[$59>>2]=3;HEAP32[$59+4>>2]=3;HEAP32[$61>>2]=HEAP32[$_ul_pos>>2];HEAP32[$61+4>>2]=HEAP32[$_ul_pos+4>>2];$87=$1+13|0;HEAP32[$60+($22<<3)>>2]=$87;HEAP32[$60+($22<<3)+4>>2]=3;HEAP32[$62+($22<<3)>>2]=HEAP32[$_ur_pos>>2];HEAP32[$62+($22<<3)+4>>2]=HEAP32[$_ur_pos+4>>2];$95=Math_imul($22,$4)|0;HEAP32[$60+($95<<3)>>2]=3;HEAP32[$60+($95<<3)+4>>2]=$87;HEAP32[$62+($95<<3)>>2]=HEAP32[$_dl_pos>>2];HEAP32[$62+($95<<3)+4>>2]=HEAP32[$_dl_pos+4>>2];$104=($4<<1)-1|0;if(($104|0)>1){label=11;break}else{label=23;break};case 11:$106=$p0|0;$107=$p1|0;$108=$p2|0;$109=$p0+4|0;$110=$p1+4|0;$111=$p2+4|0;$k_0331=1;label=12;break;case 12:$119=($k_0331|0)==($22|0)&1;$121=$k_0331-$119+($22-$k_0331&-(($22|0)<($k_0331|0)&1))|0;$122=$k_0331-$22|0;$128=$119-(-(($122|0)>0&1)&-$122)|0;if(($128|0)>($121|0)){label=22;break}else{$j_0330=$128;label=13;break};case 13:$131=$128-$j_0330+$121|0;$133=(Math_imul($131,$4)|0)+$j_0330|0;$135=HEAP32[$align_pos+($j_0330<<2)>>2]|0;$137=HEAP32[$align_pos+($131<<2)>>2]|0;$138=$60+($133<<3)|0;HEAP32[$138>>2]=$135;$139=$60+($133<<3)+4|0;HEAP32[$139>>2]=$137;_qr_sampling_grid_fp_mask_rect($_grid,$2,$135-2|0,$137-2|0,5,5);$142=($131|0)>1;$143=($j_0330|0)>1;if($142&$143){label=14;break}else{label=15;break};case 14:$146=$_grid+($131-2<<2)|0;$_sum322=$j_0330-1|0;_qr_hom_cell_project($106,(HEAP32[$146>>2]|0)+($_sum322*52&-1)|0,$135,$137,0);$_sum323=$j_0330-2|0;_qr_hom_cell_project($107,(HEAP32[$146>>2]|0)+($_sum323*52&-1)|0,$135,$137,0);$152=$_grid+($131-1<<2)|0;_qr_hom_cell_project($108,(HEAP32[$152>>2]|0)+($_sum323*52&-1)|0,$135,$137,0);$155=HEAP32[$106>>2]|0;$156=HEAP32[$107>>2]|0;$162=($156-$155&-(($156|0)<($155|0)&1))+$155|0;HEAP32[$106>>2]=$162;HEAP32[$107>>2]=HEAP32[$107>>2]^$155^$162;$166=HEAP32[$109>>2]|0;$167=HEAP32[$110>>2]|0;$173=($167-$166&-(($167|0)<($166|0)&1))+$166|0;HEAP32[$109>>2]=$173;HEAP32[$110>>2]=HEAP32[$110>>2]^$166^$173;$177=HEAP32[$107>>2]|0;$178=HEAP32[$108>>2]|0;$184=($178-$177&-(($178|0)<($177|0)&1))+$177|0;HEAP32[$107>>2]=$184;HEAP32[$108>>2]=HEAP32[$108>>2]^$177^$184;$188=HEAP32[$110>>2]|0;$189=HEAP32[$111>>2]|0;$195=($189-$188&-(($189|0)<($188|0)&1))+$188|0;HEAP32[$110>>2]=$195;HEAP32[$111>>2]=HEAP32[$111>>2]^$188^$195;$199=HEAP32[$106>>2]|0;$200=HEAP32[$107>>2]|0;$206=($200-$199&-(($200|0)<($199|0)&1))+$199|0;HEAP32[$106>>2]=$206;HEAP32[$107>>2]=HEAP32[$107>>2]^$199^$206;$210=HEAP32[$109>>2]|0;$211=HEAP32[$110>>2]|0;$217=($211-$210&-(($211|0)<($210|0)&1))+$210|0;HEAP32[$109>>2]=$217;$220=HEAP32[$110>>2]^$210^$217;HEAP32[$110>>2]=$220;$222=(HEAP32[$152>>2]|0)+($_sum322*52&-1)|0;$223=$133-$4|0;$224=$223-1|0;$233=$133-1|0;_qr_hom_cell_init($222,HEAP32[$60+($224<<3)>>2]|0,HEAP32[$60+($224<<3)+4>>2]|0,HEAP32[$60+($223<<3)>>2]|0,HEAP32[$60+($223<<3)+4>>2]|0,HEAP32[$60+($233<<3)>>2]|0,HEAP32[$60+($233<<3)+4>>2]|0,HEAP32[$138>>2]|0,HEAP32[$139>>2]|0,HEAP32[$62+($224<<3)>>2]|0,HEAP32[$62+($224<<3)+4>>2]|0,HEAP32[$62+($223<<3)>>2]|0,HEAP32[$62+($223<<3)+4>>2]|0,HEAP32[$62+($233<<3)>>2]|0,HEAP32[$62+($233<<3)+4>>2]|0,HEAP32[$107>>2]|0,$220);$cell_0=$222;label=19;break;case 15:if($142&($j_0330|0)>0){label=16;break}else{label=17;break};case 16:$cell_0=(HEAP32[$_grid+($131-2<<2)>>2]|0)+(($j_0330-1|0)*52&-1)|0;label=19;break;case 17:if(($131|0)>0&$143){label=18;break}else{$cell_0=$base_cell;label=19;break};case 18:$cell_0=(HEAP32[$_grid+($131-1<<2)>>2]|0)+(($j_0330-2|0)*52&-1)|0;label=19;break;case 19:$268=$62+($133<<3)|0;_qr_alignment_pattern_search($268,$cell_0,$135,$137,2,$_img,$_width,$_height)|0;if(($131|0)>0&($j_0330|0)>0){label=20;break}else{label=21;break};case 20:$277=$133-$4|0;$278=$277-1|0;$287=$133-1|0;_qr_hom_cell_init((HEAP32[$_grid+($131-1<<2)>>2]|0)+(($j_0330-1|0)*52&-1)|0,HEAP32[$60+($278<<3)>>2]|0,HEAP32[$60+($278<<3)+4>>2]|0,HEAP32[$60+($277<<3)>>2]|0,HEAP32[$60+($277<<3)+4>>2]|0,HEAP32[$60+($287<<3)>>2]|0,HEAP32[$60+($287<<3)+4>>2]|0,HEAP32[$138>>2]|0,HEAP32[$139>>2]|0,HEAP32[$62+($278<<3)>>2]|0,HEAP32[$62+($278<<3)+4>>2]|0,HEAP32[$62+($277<<3)>>2]|0,HEAP32[$62+($277<<3)+4>>2]|0,HEAP32[$62+($287<<3)>>2]|0,HEAP32[$62+($287<<3)+4>>2]|0,HEAP32[$268>>2]|0,HEAP32[$62+($133<<3)+4>>2]|0);label=21;break;case 21:$310=$j_0330+1|0;if(($310|0)>($121|0)){label=22;break}else{$j_0330=$310;label=13;break};case 22:$312=$k_0331+1|0;if(($312|0)<($104|0)){$k_0331=$312;label=12;break}else{label=23;break};case 23:_free($59);_free($61);label=24;break;case 24:_memcpy($_grid+28|0,$align_pos+4|0,(HEAP32[$23>>2]<<2)-4|0)|0;HEAP32[$_grid+28+((HEAP32[$23>>2]|0)-1<<2)>>2]=$2;_qr_hom_cell_project($6,HEAP32[$28>>2]|0,-1,-1,1);$330=($2<<1)-1|0;_qr_hom_cell_project($10,(HEAP32[$28>>2]|0)+(((HEAP32[$23>>2]|0)-1|0)*52&-1)|0,$330,-1,1);_qr_hom_cell_project($14,HEAP32[$_grid+((HEAP32[$23>>2]|0)-1<<2)>>2]|0,-1,$330,1);$335=HEAP32[$23>>2]|0;_qr_hom_cell_project($18,(HEAP32[$_grid+($335-1<<2)>>2]|0)+(($335-1|0)*52&-1)|0,$330,$330,1);$341=-$_width<<2;$342=$_width<<3;$344=-$_height<<2;$345=$_height<<3;$346=$_p|0;$347=HEAP32[$346>>2]|0;$353=($342-$347&-(($342|0)<($347|0)&1))+$347|0;HEAP32[$346>>2]=$341-($341-$353&-(($353|0)>($341|0)&1));$360=$_p+4|0;$361=HEAP32[$360>>2]|0;$367=($345-$361&-(($345|0)<($361|0)&1))+$361|0;HEAP32[$360>>2]=$344-($344-$367&-(($367|0)>($344|0)&1));$374=$_p+8|0;$375=HEAP32[$374>>2]|0;$381=($342-$375&-(($342|0)<($375|0)&1))+$375|0;HEAP32[$374>>2]=$341-($341-$381&-(($381|0)>($341|0)&1));$388=$_p+12|0;$389=HEAP32[$388>>2]|0;$395=($345-$389&-(($345|0)<($389|0)&1))+$389|0;HEAP32[$388>>2]=$344-($344-$395&-(($395|0)>($344|0)&1));$402=$_p+16|0;$403=HEAP32[$402>>2]|0;$409=($342-$403&-(($342|0)<($403|0)&1))+$403|0;HEAP32[$402>>2]=$341-($341-$409&-(($409|0)>($341|0)&1));$416=$_p+20|0;$417=HEAP32[$416>>2]|0;$423=($345-$417&-(($345|0)<($417|0)&1))+$417|0;HEAP32[$416>>2]=$344-($344-$423&-(($423|0)>($344|0)&1));$430=$_p+24|0;$431=HEAP32[$430>>2]|0;$437=($342-$431&-(($342|0)<($431|0)&1))+$431|0;HEAP32[$430>>2]=$341-($341-$437&-(($437|0)>($341|0)&1));$444=$_p+28|0;$445=HEAP32[$444>>2]|0;$451=($345-$445&-(($345|0)<($445|0)&1))+$445|0;HEAP32[$444>>2]=$344-($344-$451&-(($451|0)>($344|0)&1));STACKTOP=__stackBase__;return}}function _qr_sampling_grid_sample($_grid,$_data_bits,$_dim,$_fmt_info,$_img,$_width,$_height){$_grid=$_grid|0;$_data_bits=$_data_bits|0;$_dim=$_dim|0;$_fmt_info=$_fmt_info|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $p=0,$4=0,$7=0,$10=0,$u0_075=0,$j_073=0,$12=0,$i_069=0,$v0_068=0,$17=0,$19=0,$20=0,$23=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$34=0,$35=0,$36=0,$37=0,$38=0,$40=0,$41=0,$43=0,$44=0,$46=0,$47=0,$u_066=0,$w0_065=0,$y0_064=0,$x0_063=0,$58=0,$v_062=0,$w_061=0,$y_060=0,$x_059=0,$67=0,$70=0,$80=0,$88=0,$90=0,$93=0,$94=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$p=__stackBase__|0;_qr_data_mask_fill($_data_bits,$_dim,$_fmt_info&7);$4=$_grid+52|0;if((HEAP32[$4>>2]|0)>0){label=2;break}else{label=15;break};case 2:$7=$p|0;$j_073=0;$u0_075=0;$10=HEAP32[$4>>2]|0;label=3;break;case 3:$12=HEAP32[$_grid+28+($j_073<<2)>>2]|0;if(($10|0)>0){label=4;break}else{label=14;break};case 4:$v0_068=0;$i_069=0;label=5;break;case 5:$17=HEAP32[$_grid+28+($i_069<<2)>>2]|0;$19=HEAP32[$_grid+($i_069<<2)>>2]|0;$20=$19+($j_073*52&-1)|0;$23=$u0_075-(HEAP32[$19+($j_073*52&-1)+44>>2]|0)|0;$26=$v0_068-(HEAP32[$19+($j_073*52&-1)+48>>2]|0)|0;$27=$20|0;$28=$19+($j_073*52&-1)+4|0;$29=$19+($j_073*52&-1)+12|0;$30=$19+($j_073*52&-1)+16|0;$31=$19+($j_073*52&-1)+24|0;$32=$19+($j_073*52&-1)+28|0;if(($u0_075|0)<($12|0)){label=6;break}else{label=13;break};case 6:$34=HEAP32[$31>>2]|0;$35=HEAP32[$30>>2]|0;$36=HEAP32[$29>>2]|0;$37=HEAP32[$28>>2]|0;$38=HEAP32[$27>>2]|0;$40=Math_imul(HEAP32[$32>>2]|0,$26)|0;$41=Math_imul($34,$23)|0;$43=Math_imul($35,$26)|0;$44=Math_imul($36,$23)|0;$46=Math_imul($37,$26)|0;$47=Math_imul($38,$23)|0;$x0_063=$46+$47+(HEAP32[$19+($j_073*52&-1)+8>>2]|0)|0;$y0_064=$43+$44+(HEAP32[$19+($j_073*52&-1)+20>>2]|0)|0;$w0_065=$40+$41+(HEAP32[$19+($j_073*52&-1)+32>>2]|0)|0;$u_066=$u0_075;label=7;break;case 7:if(($v0_068|0)<($17|0)){label=8;break}else{label=12;break};case 8:$58=Math_imul($u_066,$_dim+31>>5)|0;$x_059=$x0_063;$y_060=$y0_064;$w_061=$w0_065;$v_062=$v0_068;label=9;break;case 9:if((_qr_sampling_grid_is_in_fp($_grid,$_dim,$u_066,$v_062)|0)==0){label=10;break}else{label=11;break};case 10:_qr_hom_cell_fproject($7,$20,$x_059,$y_060,$w_061);$67=(_qr_img_get_bit($_img,$_width,$_height,HEAP32[$7>>2]|0,HEAP32[$p+4>>2]|0)|0)<<($v_062&31);$70=$_data_bits+(($v_062>>5)+$58<<2)|0;HEAP32[$70>>2]=HEAP32[$70>>2]^$67;label=11;break;case 11:$80=$v_062+1|0;if(($80|0)<($17|0)){$x_059=(HEAP32[$28>>2]|0)+$x_059|0;$y_060=(HEAP32[$30>>2]|0)+$y_060|0;$w_061=(HEAP32[$32>>2]|0)+$w_061|0;$v_062=$80;label=9;break}else{label=12;break};case 12:$88=$u_066+1|0;if(($88|0)<($12|0)){$x0_063=(HEAP32[$27>>2]|0)+$x0_063|0;$y0_064=(HEAP32[$29>>2]|0)+$y0_064|0;$w0_065=(HEAP32[$31>>2]|0)+$w0_065|0;$u_066=$88;label=7;break}else{label=13;break};case 13:$90=$i_069+1|0;if(($90|0)<(HEAP32[$4>>2]|0)){$v0_068=$17;$i_069=$90;label=5;break}else{label=14;break};case 14:$93=$j_073+1|0;$94=HEAP32[$4>>2]|0;if(($93|0)<($94|0)){$j_073=$93;$u0_075=$12;$10=$94;label=3;break}else{label=15;break};case 15:STACKTOP=__stackBase__;return}}function _qr_samples_unpack($_blocks,$_nblocks,$_nshort_data,$_nshort_blocks,$_data_bits,$_fp_mask,$_dim){$_blocks=$_blocks|0;$_nblocks=$_nblocks|0;$_nshort_data=$_nshort_data|0;$_nshort_blocks=$_nshort_blocks|0;$_data_bits=$_data_bits|0;$_fp_mask=$_fp_mask|0;$_dim=$_dim|0;var $2=0,$_nshort_blocks_=0,$4=0,$j_0127=0,$blockj_0126=0,$blocki_0125=0,$biti_0124=0,$bits_0123=0,$11=0,$_in=0,$nbits_096=0,$blockj_195=0,$blocki_194=0,$biti_193=0,$bits_192=0,$13=0,$14=0,$19=0,$bits_2_ph_ph=0,$biti_2_ph_ph=0,$blocki_2_ph_ph=0,$blockj_2_ph_ph=0,$nbits_1_ph_ph=0,$bits_2_ph=0,$biti_2_ph=0,$blocki_2_ph=0,$nbits_1_ph=0,$bits_2=0,$biti_2=0,$nbits_1=0,$25=0,$28=0,$bits_3=0,$biti_3=0,$bits_4=0,$biti_4=0,$49=0,$52=0,$53=0,$54=0,$58=0,$blockj_1_lcssa=0,$blocki_1_lcssa=0,$biti_1_lcssa=0,$bits_1_lcssa=0,$61=0,$_=0,$64=0,$i_1115=0,$blockj_3114=0,$blocki_3113=0,$biti_5112=0,$bits_5111=0,$65=0,$70=0,$76=0,$bits_6_ph_ph=0,$biti_6_ph_ph=0,$blocki_4_ph_ph=0,$blockj_4_ph_ph=0,$data1_0_ph_ph=0,$data2_0_ph_ph=0,$fp_mask1_0_ph_ph=0,$fp_mask2_0_ph_ph=0,$nbits_2_ph_ph=0,$bits_6_ph=0,$biti_6_ph=0,$blocki_4_ph=0,$data1_0_ph=0,$data2_0_ph=0,$fp_mask1_0_ph=0,$fp_mask2_0_ph=0,$nbits_2_ph=0,$bits_6=0,$biti_6=0,$data1_0=0,$data2_0=0,$fp_mask1_0=0,$fp_mask2_0=0,$nbits_2=0,$84=0,$bits_7=0,$biti_7=0,$95=0,$96=0,$bits_8=0,$biti_8=0,$105=0,$106=0,$109=0,$112=0,$113=0,$114=0,$118=0,$122=0,$blockj_3_lcssa=0,$blocki_3_lcssa=0,$biti_5_lcssa=0,$bits_5_lcssa=0,$124=0,label=0;label=1;while(1)switch(label|0){case 1:$2=$_dim+31>>5;$_nshort_blocks_=($_nshort_blocks|0)<($_nblocks|0)?$_nshort_blocks:0;$4=$_dim-1|0;if(($4|0)>0){label=2;break}else{label=30;break};case 2:$bits_0123=0;$biti_0124=0;$blocki_0125=0;$blockj_0126=0;$j_0127=$4;label=3;break;case 3:$11=Math_imul($j_0127,$2)|0;if(($2|0)>0){$bits_192=$bits_0123;$biti_193=$biti_0124;$blocki_194=$blocki_0125;$blockj_195=$blockj_0126;$nbits_096=($4&31)+1|0;$_in=$2;label=5;break}else{$bits_1_lcssa=$bits_0123;$biti_1_lcssa=$biti_0124;$blocki_1_lcssa=$blocki_0125;$blockj_1_lcssa=$blockj_0126;label=16;break};case 4:if(($13|0)>0){$bits_192=$bits_2;$biti_193=$biti_2;$blocki_194=$blocki_2_ph;$blockj_195=$blockj_2_ph_ph;$nbits_096=32;$_in=$13;label=5;break}else{$bits_1_lcssa=$bits_2;$biti_1_lcssa=$biti_2;$blocki_1_lcssa=$blocki_2_ph;$blockj_1_lcssa=$blockj_2_ph_ph;label=16;break};case 5:$13=$_in-1|0;$14=$13+$11|0;$19=$14-$2|0;$nbits_1_ph_ph=$nbits_096;$blockj_2_ph_ph=$blockj_195;$blocki_2_ph_ph=$blocki_194;$biti_2_ph_ph=$biti_193;$bits_2_ph_ph=$bits_192;label=6;break;case 6:$nbits_1_ph=$nbits_1_ph_ph;$blocki_2_ph=$blocki_2_ph_ph;$biti_2_ph=$biti_2_ph_ph;$bits_2_ph=$bits_2_ph_ph;label=7;break;case 7:$nbits_1=$nbits_1_ph;$biti_2=$biti_2_ph;$bits_2=$bits_2_ph;label=8;break;case 8:$25=$nbits_1-1|0;if(($nbits_1|0)>0){label=9;break}else{label=4;break};case 9:$28=1<<$25;if(($28&HEAP32[$_fp_mask+($14<<2)>>2]|0)==0){label=10;break}else{$biti_3=$biti_2;$bits_3=$bits_2;label=11;break};case 10:$biti_3=$biti_2+1|0;$bits_3=(HEAP32[$_data_bits+($14<<2)>>2]|0)>>>($25>>>0)&1|$bits_2<<1;label=11;break;case 11:if(($28&HEAP32[$_fp_mask+($19<<2)>>2]|0)==0){label=12;break}else{$biti_4=$biti_3;$bits_4=$bits_3;label=13;break};case 12:$biti_4=$biti_3+1|0;$bits_4=$bits_3<<1|(HEAP32[$_data_bits+($19<<2)>>2]|0)>>>($25>>>0)&1;label=13;break;case 13:if(($biti_4|0)>7){label=14;break}else{$nbits_1=$25;$biti_2=$biti_4;$bits_2=$bits_4;label=8;break};case 14:$49=$biti_4-8|0;$52=$blocki_2_ph+1|0;$53=$_blocks+($blocki_2_ph<<2)|0;$54=HEAP32[$53>>2]|0;HEAP32[$53>>2]=$54+1;HEAP8[$54]=$bits_4>>>($49>>>0)&255;if(($52|0)<($_nblocks|0)){$nbits_1_ph=$25;$blocki_2_ph=$52;$biti_2_ph=$49;$bits_2_ph=$bits_4;label=7;break}else{label=15;break};case 15:$58=$blockj_2_ph_ph+1|0;$nbits_1_ph_ph=$25;$blockj_2_ph_ph=$58;$blocki_2_ph_ph=($58|0)==($_nshort_data|0)?$_nshort_blocks_:0;$biti_2_ph_ph=$49;$bits_2_ph_ph=$bits_4;label=6;break;case 16:$61=$j_0127-2|0;$_=($61|0)==6?$j_0127-3|0:$61;$64=Math_imul($_,$2)|0;if(($2|0)>0){$bits_5111=$bits_1_lcssa;$biti_5112=$biti_1_lcssa;$blocki_3113=$blocki_1_lcssa;$blockj_3114=$blockj_1_lcssa;$i_1115=0;label=17;break}else{$bits_5_lcssa=$bits_1_lcssa;$biti_5_lcssa=$biti_1_lcssa;$blocki_3_lcssa=$blocki_1_lcssa;$blockj_3_lcssa=$blockj_1_lcssa;label=29;break};case 17:$65=$i_1115+$64|0;$70=$65-$2|0;$76=$_dim-($i_1115<<5)|0;$nbits_2_ph_ph=(32-$76&-(($76|0)>32&1))+$76|0;$fp_mask2_0_ph_ph=HEAP32[$_fp_mask+($70<<2)>>2]|0;$fp_mask1_0_ph_ph=HEAP32[$_fp_mask+($65<<2)>>2]|0;$data2_0_ph_ph=HEAP32[$_data_bits+($70<<2)>>2]|0;$data1_0_ph_ph=HEAP32[$_data_bits+($65<<2)>>2]|0;$blockj_4_ph_ph=$blockj_3114;$blocki_4_ph_ph=$blocki_3113;$biti_6_ph_ph=$biti_5112;$bits_6_ph_ph=$bits_5111;label=18;break;case 18:$nbits_2_ph=$nbits_2_ph_ph;$fp_mask2_0_ph=$fp_mask2_0_ph_ph;$fp_mask1_0_ph=$fp_mask1_0_ph_ph;$data2_0_ph=$data2_0_ph_ph;$data1_0_ph=$data1_0_ph_ph;$blocki_4_ph=$blocki_4_ph_ph;$biti_6_ph=$biti_6_ph_ph;$bits_6_ph=$bits_6_ph_ph;label=19;break;case 19:$nbits_2=$nbits_2_ph;$fp_mask2_0=$fp_mask2_0_ph;$fp_mask1_0=$fp_mask1_0_ph;$data2_0=$data2_0_ph;$data1_0=$data1_0_ph;$biti_6=$biti_6_ph;$bits_6=$bits_6_ph;label=20;break;case 20:$84=$nbits_2-1|0;if(($nbits_2|0)>0){label=21;break}else{label=28;break};case 21:if(($fp_mask1_0&1|0)==0){label=22;break}else{$biti_7=$biti_6;$bits_7=$bits_6;label=23;break};case 22:$biti_7=$biti_6+1|0;$bits_7=$data1_0&1|$bits_6<<1;label=23;break;case 23:$95=$data1_0>>>1;$96=$fp_mask1_0>>>1;if(($fp_mask2_0&1|0)==0){label=24;break}else{$biti_8=$biti_7;$bits_8=$bits_7;label=25;break};case 24:$biti_8=$biti_7+1|0;$bits_8=$bits_7<<1|$data2_0&1;label=25;break;case 25:$105=$data2_0>>>1;$106=$fp_mask2_0>>>1;if(($biti_8|0)>7){label=26;break}else{$nbits_2=$84;$fp_mask2_0=$106;$fp_mask1_0=$96;$data2_0=$105;$data1_0=$95;$biti_6=$biti_8;$bits_6=$bits_8;label=20;break};case 26:$109=$biti_8-8|0;$112=$blocki_4_ph+1|0;$113=$_blocks+($blocki_4_ph<<2)|0;$114=HEAP32[$113>>2]|0;HEAP32[$113>>2]=$114+1;HEAP8[$114]=$bits_8>>>($109>>>0)&255;if(($112|0)<($_nblocks|0)){$nbits_2_ph=$84;$fp_mask2_0_ph=$106;$fp_mask1_0_ph=$96;$data2_0_ph=$105;$data1_0_ph=$95;$blocki_4_ph=$112;$biti_6_ph=$109;$bits_6_ph=$bits_8;label=19;break}else{label=27;break};case 27:$118=$blockj_4_ph_ph+1|0;$nbits_2_ph_ph=$84;$fp_mask2_0_ph_ph=$106;$fp_mask1_0_ph_ph=$96;$data2_0_ph_ph=$105;$data1_0_ph_ph=$95;$blockj_4_ph_ph=$118;$blocki_4_ph_ph=($118|0)==($_nshort_data|0)?$_nshort_blocks_:0;$biti_6_ph_ph=$109;$bits_6_ph_ph=$bits_8;label=18;break;case 28:$122=$i_1115+1|0;if(($122|0)<($2|0)){$bits_5111=$bits_6;$biti_5112=$biti_6;$blocki_3113=$blocki_4_ph;$blockj_3114=$blockj_4_ph_ph;$i_1115=$122;label=17;break}else{$bits_5_lcssa=$bits_6;$biti_5_lcssa=$biti_6;$blocki_3_lcssa=$blocki_4_ph;$blockj_3_lcssa=$blockj_4_ph_ph;label=29;break};case 29:$124=$_-2|0;if(($124|0)>0){$bits_0123=$bits_5_lcssa;$biti_0124=$biti_5_lcssa;$blocki_0125=$blocki_3_lcssa;$blockj_0126=$blockj_3_lcssa;$j_0127=$124;label=3;break}else{label=30;break};case 30:return}}function _qr_pack_buf_init($_b,$_data,$_ndata){$_b=$_b|0;$_data=$_data|0;$_ndata=$_ndata|0;HEAP32[$_b>>2]=$_data;HEAP32[$_b+12>>2]=$_ndata;HEAP32[$_b+8>>2]=0;HEAP32[$_b+4>>2]=0;return}function _qr_pack_buf_avail($_b){$_b=$_b|0;return((HEAP32[$_b+12>>2]|0)-(HEAP32[$_b+4>>2]|0)<<3)-(HEAP32[$_b+8>>2]|0)|0}function _qr_pack_buf_read($_b,$_bits){$_b=$_b|0;$_bits=$_bits|0;var $2=0,$4=0,$7=0,$8=0,$9=0,$22=0,$23=0,$27=0,$29=0,$36=0,$ret_0=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=$_b+8|0;$4=(HEAP32[$2>>2]|0)+$_bits|0;$7=$_b+4|0;$8=HEAP32[$7>>2]|0;$9=(HEAP32[$_b+12>>2]|0)-$8|0;if(($9|0)<3){label=2;break}else{label=5;break};case 2:if(($9<<3|0)<($4|0)){label=3;break}else{label=4;break};case 3:HEAP32[$7>>2]=$8+($4>>3);HEAP32[$2>>2]=$4&7;$_0=-1;label=9;break;case 4:if(($4|0)==0){$_0=0;label=9;break}else{label=5;break};case 5:$22=HEAP32[$_b>>2]|0;$23=HEAP32[$7>>2]|0;$27=HEAP32[$2>>2]|0;$29=(HEAPU8[$22+$23|0]|0)<<$27+8;if(($4|0)>8){label=6;break}else{$ret_0=$29;label=8;break};case 6:$36=(HEAPU8[$22+($23+1)|0]|0)<<$27|$29;if(($4|0)>16){label=7;break}else{$ret_0=$36;label=8;break};case 7:$ret_0=(HEAPU8[$22+($23+2)|0]|0)>>>((8-$27|0)>>>0)|$36;label=8;break;case 8:HEAP32[$7>>2]=(HEAP32[$7>>2]|0)+($4>>3);HEAP32[$2>>2]=$4&7;$_0=($ret_0&65535)>>>((16-$_bits|0)>>>0);label=9;break;case 9:return $_0|0}return 0}function _qr_sampling_grid_clear($_grid){$_grid=$_grid|0;_free(HEAP32[$_grid+24>>2]|0);_free(HEAP32[$_grid>>2]|0);return}function _qr_code_data_parse($_qrdata,$_version,$_data,$_ndata){$_qrdata=$_qrdata|0;$_version=$_version|0;$_data=$_data|0;$_ndata=$_ndata|0;var $qpb=0,$1=0,$2=0,$3=0,$8=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$centries_0138=0,$18=0,$25=0,$centries_1=0,$32=0,$33=0,$35=0,$39=0,$42=0,$43=0,$56=0,$_in144=0,$buf_0132=0,$60=0,$61=0,$68=0,$76=0,$buf_0_lcssa=0,$80=0,$93=0,$101=0,$104=0,$105=0,$113=0,$_in143=0,$buf1_0128=0,$117=0,$118=0,$128=0,$buf1_0_lcssa=0,$132=0,$140=0,$144=0,$145=0,$146=0,$151=0,$153=0,$158=0,$165=0,$len8_0124=0,$buf7_0123=0,$169=0,$176=0,$185=0,$194=0,$198=0,$val_0=0,$205=0,$212=0,$213=0,$_in=0,$buf10_0121=0,$217=0,$218=0,$222=0,$223=0,$226=0,$bits11_0_off0=0,$bits11_0_off8=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+16|0;label=1;while(1)switch(label|0){case 1:$qpb=__stackBase__|0;$1=$_qrdata|0;HEAP32[$1>>2]=0;$2=$_qrdata+4|0;HEAP32[$2>>2]=0;$3=$_qrdata+11|0;HEAP8[$3]=0;$8=(($_version|0)>9&1)+(($_version|0)>26&1)|0;_qr_pack_buf_init($qpb,$_data,$_ndata);if((_qr_pack_buf_avail($qpb)|0)>3){label=2;break}else{label=50;break};case 2:$11=40+($8<<2)|0;$12=41+($8<<2)|0;$13=$_qrdata+10|0;$14=$_qrdata+12|0;$15=42+($8<<2)|0;$16=43+($8<<2)|0;$centries_0138=0;label=3;break;case 3:$18=_qr_pack_buf_read($qpb,4)|0;if(($18|0)==0){label=50;break}else{label=4;break};case 4:if((HEAP32[$2>>2]|0)<($centries_0138|0)){$centries_1=$centries_0138;label=6;break}else{label=5;break};case 5:$25=$centries_0138<<1|1;HEAP32[$1>>2]=_realloc(HEAP32[$1>>2]|0,$25*12&-1)|0;$centries_1=$25;label=6;break;case 6:$32=HEAP32[$1>>2]|0;$33=HEAP32[$2>>2]|0;HEAP32[$2>>2]=$33+1;$35=$32+($33*12&-1)|0;HEAP32[$35>>2]=-1;if(($18|0)==1){label=7;break}else if(($18|0)==2){label=18;break}else if(($18|0)==3){label=27;break}else if(($18|0)==4){label=29;break}else if(($18|0)==5){label=33;break}else if(($18|0)==7){label=34;break}else if(($18|0)==8){label=43;break}else if(($18|0)==9){label=49;break}else{$_0=-1;label=51;break};case 7:$39=_qr_pack_buf_read($qpb,HEAPU8[$11]|0)|0;if(($39|0)<0){$_0=-1;label=51;break}else{label=8;break};case 8:$42=($39|0)/3&-1;$43=($39|0)%3&-1;if((_qr_pack_buf_avail($qpb)|0)<(($43<<2&4)+($42*10&-1)+(-($43>>>1&1)&7)|0)){$_0=-1;label=51;break}else{label=9;break};case 9:HEAP32[$35>>2]=$18;$56=_malloc($39)|0;HEAP32[$32+($33*12&-1)+4>>2]=$56;HEAP32[$32+($33*12&-1)+8>>2]=$39;if(($39|0)>2){$buf_0132=$56;$_in144=$42;label=10;break}else{$buf_0_lcssa=$56;label=12;break};case 10:$60=$_in144-1|0;$61=_qr_pack_buf_read($qpb,10)|0;if($61>>>0>999){$_0=-1;label=51;break}else{label=11;break};case 11:HEAP8[$buf_0132]=(($61>>>0)/100>>>0)+48&255;$68=($61>>>0)%100>>>0;HEAP8[$buf_0132+1|0]=(($68>>>0)/10>>>0|48)&255;$76=$buf_0132+3|0;HEAP8[$buf_0132+2|0]=(($68>>>0)%10>>>0|48)&255;if(($60|0)>0){$buf_0132=$76;$_in144=$60;label=10;break}else{$buf_0_lcssa=$76;label=12;break};case 12:if(($43|0)>1){label=13;break}else{label=15;break};case 13:$80=_qr_pack_buf_read($qpb,7)|0;if($80>>>0>99){$_0=-1;label=51;break}else{label=14;break};case 14:HEAP8[$buf_0_lcssa]=(($80>>>0)/10>>>0)+48&255;HEAP8[$buf_0_lcssa+1|0]=(($80>>>0)%10>>>0|48)&255;label=26;break;case 15:if(($43|0)==0){label=26;break}else{label=16;break};case 16:$93=_qr_pack_buf_read($qpb,4)|0;if($93>>>0>9){$_0=-1;label=51;break}else{label=17;break};case 17:HEAP8[$buf_0_lcssa]=$93+48&255;label=26;break;case 18:$101=_qr_pack_buf_read($qpb,HEAPU8[$12]|0)|0;if(($101|0)<0){$_0=-1;label=51;break}else{label=19;break};case 19:$104=$101>>1;$105=$101&1;if((_qr_pack_buf_avail($qpb)|0)<(($104*11&-1)+(-$105&6)|0)){$_0=-1;label=51;break}else{label=20;break};case 20:HEAP32[$35>>2]=$18;$113=_malloc($101)|0;HEAP32[$32+($33*12&-1)+4>>2]=$113;HEAP32[$32+($33*12&-1)+8>>2]=$101;if(($104|0)>0){$buf1_0128=$113;$_in143=$104;label=21;break}else{$buf1_0_lcssa=$113;label=23;break};case 21:$117=$_in143-1|0;$118=_qr_pack_buf_read($qpb,11)|0;if($118>>>0>2024){$_0=-1;label=51;break}else{label=22;break};case 22:HEAP8[$buf1_0128]=HEAP8[10408+(($118>>>0)/45>>>0)|0]|0;$128=$buf1_0128+2|0;HEAP8[$buf1_0128+1|0]=HEAP8[10408+(($118>>>0)%45>>>0)|0]|0;if(($117|0)>0){$buf1_0128=$128;$_in143=$117;label=21;break}else{$buf1_0_lcssa=$128;label=23;break};case 23:if(($105|0)==0){label=26;break}else{label=24;break};case 24:$132=_qr_pack_buf_read($qpb,6)|0;if($132>>>0>44){$_0=-1;label=51;break}else{label=25;break};case 25:HEAP8[$buf1_0_lcssa]=HEAP8[10408+$132|0]|0;label=26;break;case 26:if((_qr_pack_buf_avail($qpb)|0)>3){$centries_0138=$centries_1;label=3;break}else{label=50;break};case 27:HEAP32[$35>>2]=$18;$140=_qr_pack_buf_read($qpb,16)|0;if(($140|0)<0){$_0=-1;label=51;break}else{label=28;break};case 28:$144=$140>>>12&15;$145=$32+($33*12&-1)+4|0;$146=$145;HEAP8[$145]=$144;HEAP8[$13]=$144;$151=($140>>>8&15)+1&255;HEAP8[$146+1|0]=$151;HEAP8[$3]=$151;$153=$140&255;HEAP8[$146+2|0]=$153;HEAP8[$14]=$153;label=26;break;case 29:$158=_qr_pack_buf_read($qpb,HEAPU8[$15]|0)|0;if(($158|0)<0){$_0=-1;label=51;break}else{label=30;break};case 30:if((_qr_pack_buf_avail($qpb)|0)<($158<<3|0)){$_0=-1;label=51;break}else{label=31;break};case 31:HEAP32[$35>>2]=$18;$165=_malloc($158)|0;HEAP32[$32+($33*12&-1)+4>>2]=$165;HEAP32[$32+($33*12&-1)+8>>2]=$158;if(($158|0)>0){$buf7_0123=$165;$len8_0124=$158;label=32;break}else{label=26;break};case 32:$169=$len8_0124-1|0;HEAP8[$buf7_0123]=(_qr_pack_buf_read($qpb,8)|0)&255;if(($169|0)>0){$buf7_0123=$buf7_0123+1|0;$len8_0124=$169;label=32;break}else{label=26;break};case 33:HEAP32[$35>>2]=$18;label=26;break;case 34:$176=_qr_pack_buf_read($qpb,8)|0;if(($176|0)<0){$_0=-1;label=51;break}else{label=35;break};case 35:if(($176&128|0)==0){$val_0=$176;label=42;break}else{label=36;break};case 36:if(($176&64|0)==0){label=37;break}else{label=39;break};case 37:$185=_qr_pack_buf_read($qpb,8)|0;if(($185|0)<0){$_0=-1;label=51;break}else{label=38;break};case 38:$val_0=$185|$176&16128;label=42;break;case 39:if(($176&32|0)==0){label=40;break}else{$_0=-1;label=51;break};case 40:$194=_qr_pack_buf_read($qpb,16)|0;if(($194|0)<0){$_0=-1;label=51;break}else{label=41;break};case 41:$198=$194|$176&2031616;if($198>>>0>999999){$_0=-1;label=51;break}else{$val_0=$198;label=42;break};case 42:HEAP32[$35>>2]=$18;HEAP32[$32+($33*12&-1)+4>>2]=$val_0;label=26;break;case 43:$205=_qr_pack_buf_read($qpb,HEAPU8[$16]|0)|0;if(($205|0)<0){$_0=-1;label=51;break}else{label=44;break};case 44:if((_qr_pack_buf_avail($qpb)|0)<($205*13&-1|0)){$_0=-1;label=51;break}else{label=45;break};case 45:HEAP32[$35>>2]=$18;$212=$205<<1;$213=_malloc($212)|0;HEAP32[$32+($33*12&-1)+4>>2]=$213;HEAP32[$32+($33*12&-1)+8>>2]=$212;if(($205|0)>0){$buf10_0121=$213;$_in=$205;label=46;break}else{label=26;break};case 46:$217=$_in-1|0;$218=_qr_pack_buf_read($qpb,13)|0;$222=($218>>>0)/192>>>0<<8|($218>>>0)%192>>>0;$223=$222+33088|0;if($223>>>0>40959){label=47;break}else{$bits11_0_off8=$223>>>8&255;$bits11_0_off0=$223&255;label=48;break};case 47:$226=$222+49472|0;$bits11_0_off8=$226>>>8&255;$bits11_0_off0=$226&255;label=48;break;case 48:HEAP8[$buf10_0121]=$bits11_0_off8;HEAP8[$buf10_0121+1|0]=$bits11_0_off0;if(($217|0)>0){$buf10_0121=$buf10_0121+2|0;$_in=$217;label=46;break}else{label=26;break};case 49:HEAP32[$35>>2]=$18;label=26;break;case 50:HEAP8[$_qrdata+13|0]=0;HEAP32[$1>>2]=_realloc(HEAP32[$1>>2]|0,(HEAP32[$2>>2]|0)*12&-1)|0;$_0=0;label=51;break;case 51:STACKTOP=__stackBase__;return $_0|0}return 0}function _qr_sampling_grid_is_in_fp($_grid,$_dim,$_u,$_v){$_grid=$_grid|0;$_dim=$_dim|0;$_u=$_u|0;$_v=$_v|0;var $5=0;$5=(Math_imul($_dim+31>>5,$_u)|0)+($_v>>5)|0;return(HEAP32[(HEAP32[$_grid+24>>2]|0)+($5<<2)>>2]|0)>>>(($_v&31)>>>0)&1|0}function _qr_hom_cell_fproject($_p,$_cell,$_x,$_y,$_w){$_p=$_p|0;$_cell=$_cell|0;$_x=$_x|0;$_y=$_y|0;$_w=$_w|0;var $_024=0,$_023=0,$_0=0,$15=0,$16=0,$24=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_w|0)==0){label=2;break}else{label=3;break};case 2:HEAP32[$_p>>2]=($_x>>>31)+2147483647;HEAP32[$_p+4>>2]=($_y>>>31)+2147483647;label=6;break;case 3:if(($_w|0)<0){label=4;break}else{$_0=$_w;$_023=$_y;$_024=$_x;label=5;break};case 4:$_0=-$_w|0;$_023=-$_y|0;$_024=-$_x|0;label=5;break;case 5:$15=$_0>>1;$16=$_024>>31;HEAP32[$_p>>2]=(HEAP32[$_cell+36>>2]|0)+((($15+$16^$16)+$_024|0)/($_0|0)&-1);$24=$_023>>31;HEAP32[$_p+4>>2]=(HEAP32[$_cell+40>>2]|0)+((($15+$24^$24)+$_023|0)/($_0|0)&-1);label=6;break;case 6:return}}function _qr_img_get_bit($_img,$_width,$_height,$_x,$_y){$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;$_x=$_x|0;$_y=$_y|0;var $1=0,$2=0,$3=0,$9=0,$17=0,$23=0;$1=$_x>>2;$2=$_y>>2;$3=$_height-1|0;$9=($3-$2&-(($3|0)<($2|0)&1))+$2|0;$17=$_width-1|0;$23=($17-$1&-(($17|0)<($1|0)&1))+$1|0;return(HEAP8[$_img+((Math_imul(-(($9|0)>0&1)&-$9,-$_width|0)|0)-(-(($23|0)>0&1)&-$23))|0]|0)!=0&1|0}function _qr_data_mask_fill($_mask,$_dim,$_pattern){$_mask=$_mask|0;$_dim=$_dim|0;$_pattern=$_pattern|0;var $2=0,$m_0132=0,$j_0131=0,$21=0,$m1_0137=0,$j_1136=0,$35=0,$mj_1147=0,$j_2146=0,$mi_0141=0,$i_1140=0,$46=0,$51=0,$m2_0154=0,$j_3153=0,$64=0,$j_4169=0,$94=0,$96=0,$m3_2164=0,$i_4163=0,$108=0,$110=0,$j_5183=0,$116=0,$122=0,$128=0,$134=0,$140=0,$142=0,$m4_2178=0,$i_7177=0,$154=0,$156=0,$j_6128=0,$191=0,$193=0,$m5_2125=0,$i_10124=0,$205=0,$207=0,label=0;label=1;while(1)switch(label|0){case 1:$2=$_dim+31>>5;if(($_pattern|0)==6){label=2;break}else if(($_pattern|0)==5){label=4;break}else if(($_pattern|0)==4){label=6;break}else if(($_pattern|0)==2){label=8;break}else if(($_pattern|0)==0){label=10;break}else if(($_pattern|0)==1){label=15;break}else if(($_pattern|0)==3){label=17;break}else{label=12;break};case 2:if(($_dim|0)>0){label=3;break}else{label=36;break};case 3:$j_5183=0;label=28;break;case 4:if(($_dim|0)>0){label=5;break}else{label=36;break};case 5:$j_4169=0;label=24;break;case 6:if(($_dim|0)>0){label=7;break}else{label=36;break};case 7:$j_3153=0;$m2_0154=7;label=23;break;case 8:if(($_dim|0)>0){label=9;break}else{label=36;break};case 9:$j_1136=0;$m1_0137=255;label=16;break;case 10:if(($_dim|0)>0){label=11;break}else{label=36;break};case 11:$j_0131=0;$m_0132=85;label=14;break;case 12:if(($_dim|0)>0){label=13;break}else{label=36;break};case 13:$j_6128=0;label=32;break;case 14:_memset($_mask+((Math_imul($j_0131,$2)|0)<<2)|0,$m_0132&255|0,$2<<2|0);$21=$j_0131+1|0;if(($21|0)<($_dim|0)){$j_0131=$21;$m_0132=$m_0132^255;label=14;break}else{label=36;break};case 15:_memset($_mask|0,85,Math_imul($_dim<<2,$2)|0);label=36;break;case 16:_memset($_mask+((Math_imul($j_1136,$2)|0)<<2)|0,$m1_0137&255|0,$2<<2|0);$35=$j_1136+1|0;if(($35|0)<($_dim|0)){$j_1136=$35;$m1_0137=$m1_0137<<8|$m1_0137>>>16;label=16;break}else{label=36;break};case 17:if(($_dim|0)>0){label=18;break}else{label=36;break};case 18:$j_2146=0;$mj_1147=1227133513;label=19;break;case 19:if(($2|0)>0){label=20;break}else{label=22;break};case 20:$i_1140=0;$mi_0141=$mj_1147;label=21;break;case 21:HEAP32[$_mask+($i_1140+(Math_imul($j_2146,$2)|0)<<2)>>2]=$mi_0141;$46=$i_1140+1|0;if(($46|0)<($2|0)){$i_1140=$46;$mi_0141=$mi_0141>>>2|$mi_0141<<1;label=21;break}else{label=22;break};case 22:$51=$j_2146+1|0;if(($51|0)<($_dim|0)){$j_2146=$51;$mj_1147=$mj_1147>>>1|$mj_1147<<2;label=19;break}else{label=36;break};case 23:_memset($_mask+((Math_imul($j_3153,$2)|0)<<2)|0,(-($m2_0154&1)^204)&255|0,$2<<2|0);$64=$j_3153+1|0;if(($64|0)<($_dim|0)){$j_3153=$64;$m2_0154=$m2_0154>>>1|$m2_0154<<5;label=23;break}else{label=36;break};case 24:$94=((($j_4169*5&-1|0)%6&-1|0)==0&1)<<5|(((($j_4169<<2|0)%6&-1|0)==0&1)<<4|(((($j_4169*3&-1|0)%6&-1|0)==0&1)<<3|(((($j_4169<<1|0)%6&-1|0)==0&1)<<2|(((($j_4169|0)%6&-1|0)==0&1)<<1|1))));$96=$94<<6|$94;if(($2|0)>0){label=25;break}else{label=27;break};case 25:$i_4163=0;$m3_2164=$96<<24|($96<<12|$96);label=26;break;case 26:HEAP32[$_mask+($i_4163+(Math_imul($j_4169,$2)|0)<<2)>>2]=$m3_2164;$108=$i_4163+1|0;if(($108|0)<($2|0)){$i_4163=$108;$m3_2164=$m3_2164>>>2|$m3_2164<<4;label=26;break}else{label=27;break};case 27:$110=$j_4169+1|0;if(($110|0)<($_dim|0)){$j_4169=$110;label=24;break}else{label=36;break};case 28:$116=$j_5183<<1;$122=$j_5183*3&-1;$128=$j_5183<<2;$134=$j_5183*5&-1;$140=((($j_5183|0)%3&-1)+$j_5183<<1&2|(($116|0)%3&-1)+$116<<2&4|(($122|0)%3&-1)+$122<<3&8|(($128|0)%3&-1)+$128<<4&16|(($134|0)%3&-1)+$134<<5&32)^63;$142=$140<<6|$140;if(($2|0)>0){label=29;break}else{label=31;break};case 29:$i_7177=0;$m4_2178=$142<<24|($142<<12|$142);label=30;break;case 30:HEAP32[$_mask+($i_7177+(Math_imul($j_5183,$2)|0)<<2)>>2]=$m4_2178;$154=$i_7177+1|0;if(($154|0)<($2|0)){$i_7177=$154;$m4_2178=$m4_2178>>>2|$m4_2178<<4;label=30;break}else{label=31;break};case 31:$156=$j_5183+1|0;if(($156|0)<($_dim|0)){$j_5183=$156;label=28;break}else{label=36;break};case 32:$191=($j_6128&1|$j_6128+1+(($j_6128|0)%3&-1)<<1&2|$j_6128+(($j_6128<<1|0)%3&-1)<<2&4|$j_6128+1+(($j_6128*3&-1|0)%3&-1)<<3&8|$j_6128+(($j_6128<<2|0)%3&-1)<<4&16|$j_6128+1+(($j_6128*5&-1|0)%3&-1)<<5&32)^63;$193=$191<<6|$191;if(($2|0)>0){label=33;break}else{label=35;break};case 33:$i_10124=0;$m5_2125=$193<<24|($193<<12|$193);label=34;break;case 34:HEAP32[$_mask+($i_10124+(Math_imul($j_6128,$2)|0)<<2)>>2]=$m5_2125;$205=$i_10124+1|0;if(($205|0)<($2|0)){$i_10124=$205;$m5_2125=$m5_2125>>>2|$m5_2125<<4;label=34;break}else{label=35;break};case 35:$207=$j_6128+1|0;if(($207|0)<($_dim|0)){$j_6128=$207;label=32;break}else{label=36;break};case 36:return}}function _qr_sampling_grid_fp_mask_rect($_grid,$_dim,$_u,$_v,$_w,$_h){$_grid=$_grid|0;$_dim=$_dim|0;$_u=$_u|0;$_v=$_v|0;$_w=$_w|0;$_h=$_h|0;var $j_014=0,$i_013=0,$13=0,$15=0,$18=0,$20=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_w|0)>0){label=2;break}else{label=7;break};case 2:$j_014=$_u;label=3;break;case 3:if(($_h|0)>0){label=4;break}else{label=6;break};case 4:$i_013=$_v;label=5;break;case 5:$13=($i_013>>5)+(Math_imul($j_014,$_dim+31>>5)|0)|0;$15=(HEAP32[$_grid+24>>2]|0)+($13<<2)|0;HEAP32[$15>>2]=HEAP32[$15>>2]|1<<($i_013&31);$18=$i_013+1|0;if(($18|0)<($_h+$_v|0)){$i_013=$18;label=5;break}else{label=6;break};case 6:$20=$j_014+1|0;if(($20|0)<($_w+$_u|0)){$j_014=$20;label=3;break}else{label=7;break};case 7:return}}function _qr_hom_cell_init($_cell,$_u0,$_v0,$_u1,$_v1,$_u2,$_v2,$_u3,$_v3,$_x0,$_y0,$_x1,$_y1,$_x2,$_y2,$_x3,$_y3){$_cell=$_cell|0;$_u0=$_u0|0;$_v0=$_v0|0;$_u1=$_u1|0;$_v1=$_v1|0;$_u2=$_u2|0;$_v2=$_v2|0;$_u3=$_u3|0;$_v3=$_v3|0;$_x0=$_x0|0;$_y0=$_y0|0;$_x1=$_x1|0;$_y1=$_y1|0;$_x2=$_x2|0;$_y2=$_y2|0;$_x3=$_x3|0;$_y3=$_y3|0;var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$20=0,$a22_0=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$32=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=0,$44=0,$49=0,$55=0,$i00_0=0,$63=0,$69=0,$i01_0=0,$77=0,$83=0,$i10_0=0,$91=0,$97=0,$i11_0=0,$105=0,$111=0,$i20_0=0,$119=0,$125=0,$i21_0=0,$129=0,$130=0,$132=0,$133=0,$134=0,$135=0,$137=0,$138=0,$139=0,$141=0,$142=0,$144=0,$145=0,$147=0,$159=0,$160=0,$163=0,$175=0,$176=0,$179=0,$221=0,$227=0,$233=0,$240=0,$242=0,$244$0=0,$244$1=0,$245$0=0,$246$0=0,$246$1=0,$247$0=0,$248$0=0,$250=0,$252$0=0,$252$1=0,$253$0=0,$254$0=0,$256=0,$258$0=0,$259$0=0,$261=0,$263$0=0,$264$0=0,$266=0,$267=0,$270=0,$276=0,$277=0,$280=0,$286=0,$288=0,$289=0,$292=0,$298=0,$299=0,$302=0,$308=0,$310=0,$313=0,$319=0,$322=0,$328=0,$330=0,$333=0,$339=0,$342=0,$348=0,$350=0,$353=0,$359=0,$362=0,$368=0,$372=0,$378=0,$383=0,$386=0,$392=0,$395=0,$401=0,$405=0,$411=0,$416=0,$418=0,$420=0,$421=0,$422=0,$423=0,$424=0,$425=0,$426=0,$427=0,$428=0,$429=0,$430=0,$433=0,$434=0,$435=0,$436=0,$437=0,$438=0,$439=0,$440=0,$443=0,$444=0,$445=0,$446=0,$447=0,$448=0,$449=0,$450=0,$453=0,$454=0,$455=0,label=0,$249$0=0,$249$1=0,$255$0=0,$255$1=0,$260$0=0,$260$1=0,$265$0=0,$265$1=0;label=1;while(1)switch(label|0){case 1:$1=$_u1-$_u0|0;$2=$_u2-$_u0|0;$3=$_u3-$_u0|0;$4=$_u3-$_u1|0;$5=$_u3-$_u2|0;$6=$_v1-$_v0|0;$7=$_v2-$_v0|0;$8=$_v3-$_v0|0;$9=$_v3-$_v1|0;$10=$_v3-$_v2|0;$11=Math_imul($5,$6)|0;$12=Math_imul($10,$1)|0;$13=$11-$12|0;$14=Math_imul($9,$2)|0;$15=Math_imul($4,$7)|0;$16=$14-$15|0;if(($11|0)==($12|0)&($14|0)==($15|0)){$a22_0=1;label=3;break}else{label=2;break};case 2:$20=Math_imul($9,$5)|0;$a22_0=$20-(Math_imul($10,$4)|0)|0;label=3;break;case 3:$24=$a22_0+$13|0;$25=Math_imul($24,$1)|0;$26=$a22_0+$16|0;$27=Math_imul($26,$2)|0;$28=Math_imul($24,$6)|0;$29=Math_imul($26,$7)|0;$30=Math_imul($29,$a22_0)|0;$32=Math_imul($27,-$a22_0|0)|0;$34=Math_imul($28,-$a22_0|0)|0;$35=Math_imul($25,$a22_0)|0;$36=Math_imul($28,$16)|0;$37=Math_imul($29,$13)|0;$38=$36-$37|0;$39=Math_imul($27,$13)|0;$40=Math_imul($25,$16)|0;$41=$39-$40|0;$42=Math_imul($25,$29)|0;$44=$42-(Math_imul($27,$28)|0)|0;if(($30|0)==0){$i00_0=0;label=5;break}else{label=4;break};case 4:$49=$44>>31;$55=$30>>31;$i00_0=(((((($30|0)>-1?$30:-$30|0)>>1)+$49^$49)+$44|0)/((($30|0)>-1?$30:-$30|0)|0)&-1)+$55^$55;label=5;break;case 5:if(($32|0)==0){$i01_0=0;label=7;break}else{label=6;break};case 6:$63=$44>>31;$69=$32>>31;$i01_0=(((((($32|0)>-1?$32:-$32|0)>>1)+$63^$63)+$44|0)/((($32|0)>-1?$32:-$32|0)|0)&-1)+$69^$69;label=7;break;case 7:if(($34|0)==0){$i10_0=0;label=9;break}else{label=8;break};case 8:$77=$44>>31;$83=$34>>31;$i10_0=(((((($34|0)>-1?$34:-$34|0)>>1)+$77^$77)+$44|0)/((($34|0)>-1?$34:-$34|0)|0)&-1)+$83^$83;label=9;break;case 9:if(($35|0)==0){$i11_0=0;label=11;break}else{label=10;break};case 10:$91=$44>>31;$97=$35>>31;$i11_0=(((((($35|0)>-1?$35:-$35|0)>>1)+$91^$91)+$44|0)/((($35|0)>-1?$35:-$35|0)|0)&-1)+$97^$97;label=11;break;case 11:if(($36|0)==($37|0)){$i20_0=$38;label=13;break}else{label=12;break};case 12:$105=$44>>31;$111=$38>>31;$i20_0=(((((($38|0)>-1?$38:-$38|0)>>1)+$105^$105)+$44|0)/((($38|0)>-1?$38:-$38|0)|0)&-1)+$111^$111;label=13;break;case 13:if(($39|0)==($40|0)){$i21_0=$41;label=15;break}else{label=14;break};case 14:$119=$44>>31;$125=$41>>31;$i21_0=(((((($41|0)>-1?$41:-$41|0)>>1)+$119^$119)+$44|0)/((($41|0)>-1?$41:-$41|0)|0)&-1)+$125^$125;label=15;break;case 15:$129=$_x1-$_x0|0;$130=$_x2-$_x0|0;$132=$_x3-$_x1|0;$133=$_x3-$_x2|0;$134=$_y1-$_y0|0;$135=$_y2-$_y0|0;$137=$_y3-$_y1|0;$138=$_y3-$_y2|0;$139=Math_imul($133,$134)|0;$141=$139-(Math_imul($138,$129)|0)|0;$142=Math_imul($137,$130)|0;$144=$142-(Math_imul($132,$135)|0)|0;$145=Math_imul($137,$133)|0;$147=$145-(Math_imul($138,$132)|0)|0;$159=_qr_ilog((($129|0)>-1?$129:-$129|0)-((($129|0)>-1?$129:-$129|0)-(($134|0)>-1?$134:-$134|0)&-(((($134|0)>-1?$134:-$134|0)|0)>((($129|0)>-1?$129:-$129|0)|0)&1))|0)|0;$160=$141+$147|0;$163=(_qr_ilog(($160|0)>-1?$160:-$160|0)|0)+$159|0;$175=_qr_ilog((($130|0)>-1?$130:-$130|0)-((($130|0)>-1?$130:-$130|0)-(($135|0)>-1?$135:-$135|0)&-(((($135|0)>-1?$135:-$135|0)|0)>((($130|0)>-1?$130:-$130|0)|0)&1))|0)|0;$176=$144+$147|0;$179=(_qr_ilog(($176|0)>-1?$176:-$176|0)|0)+$175|0;$221=_qr_ilog((($141|0)>-1?$141:-$141|0)-((($141|0)>-1?$141:-$141|0)-(($144|0)>-1?$144:-$144|0)&-(((($144|0)>-1?$144:-$144|0)|0)>((($141|0)>-1?$141:-$141|0)|0)&1))-((($141|0)>-1?$141:-$141|0)-(($147|0)>-1?$147:-$147|0)-((($141|0)>-1?$141:-$141|0)-(($144|0)>-1?$144:-$144|0)&-(((($144|0)>-1?$144:-$144|0)|0)>((($141|0)>-1?$141:-$141|0)|0)&1))&-(((($147|0)>-1?$147:-$147|0)|0)>((($141|0)>-1?$141:-$141|0)-((($141|0)>-1?$141:-$141|0)-(($144|0)>-1?$144:-$144|0)&-(((($144|0)>-1?$144:-$144|0)|0)>((($141|0)>-1?$141:-$141|0)|0)&1))|0)&1))|0)|0;$227=$163-($163-$179&-(($179|0)>($163|0)&1))|0;$233=$227-($227-$221&-(($221|0)>($227|0)&1))|0;$240=-(27-$233&-(($233-27|0)>0&1))|0;$242=1<<$240>>1;$244$0=$160;$244$1=($160|0)<0?-1:0;$245$0=___muldi3($244$0,$244$1,$129,($129|0)<0?-1:0)|0;$246$0=$242;$246$1=($242|0)<0?-1:0;$247$0=_i64Add($246$0,$246$1,$245$0,tempRet0)|0;$248$0=$240;$249$0=_bitshift64Ashr($247$0|0,tempRet0|0,$248$0|0)|0;$249$1=tempRet0;$250=$249$0;$252$0=$176;$252$1=($176|0)<0?-1:0;$253$0=___muldi3($252$0,$252$1,$130,($130|0)<0?-1:0)|0;$254$0=_i64Add($246$0,$246$1,$253$0,tempRet0)|0;$255$0=_bitshift64Ashr($254$0|0,tempRet0|0,$248$0|0)|0;$255$1=tempRet0;$256=$255$0;$258$0=___muldi3($244$0,$244$1,$134,($134|0)<0?-1:0)|0;$259$0=_i64Add($246$0,$246$1,$258$0,tempRet0)|0;$260$0=_bitshift64Ashr($259$0|0,tempRet0|0,$248$0|0)|0;$260$1=tempRet0;$261=$260$0;$263$0=___muldi3($252$0,$252$1,$135,($135|0)<0?-1:0)|0;$264$0=_i64Add($246$0,$246$1,$263$0,tempRet0)|0;$265$0=_bitshift64Ashr($264$0|0,tempRet0|0,$248$0|0)|0;$265$1=tempRet0;$266=$265$0;$267=($i00_0|0)!=0;if($267){label=16;break}else{$276=0;label=17;break};case 16:$270=$250>>31;$276=(($270+($i00_0>>1)^$270)+$250|0)/($i00_0|0)&-1;label=17;break;case 17:$277=($i10_0|0)!=0;if($277){label=18;break}else{$286=0;label=19;break};case 18:$280=$256>>31;$286=(($280+($i10_0>>1)^$280)+$256|0)/($i10_0|0)&-1;label=19;break;case 19:$288=$_cell|0;HEAP32[$288>>2]=$286+$276;$289=($i01_0|0)!=0;if($289){label=20;break}else{$298=0;label=21;break};case 20:$292=$250>>31;$298=(($292+($i01_0>>1)^$292)+$250|0)/($i01_0|0)&-1;label=21;break;case 21:$299=($i11_0|0)!=0;if($299){label=22;break}else{$308=0;label=23;break};case 22:$302=$256>>31;$308=(($302+($i11_0>>1)^$302)+$256|0)/($i11_0|0)&-1;label=23;break;case 23:$310=$_cell+4|0;HEAP32[$310>>2]=$308+$298;if($267){label=24;break}else{$319=0;label=25;break};case 24:$313=$261>>31;$319=(($313+($i00_0>>1)^$313)+$261|0)/($i00_0|0)&-1;label=25;break;case 25:if($277){label=26;break}else{$328=0;label=27;break};case 26:$322=$266>>31;$328=(($322+($i10_0>>1)^$322)+$266|0)/($i10_0|0)&-1;label=27;break;case 27:$330=$_cell+12|0;HEAP32[$330>>2]=$328+$319;if($289){label=28;break}else{$339=0;label=29;break};case 28:$333=$261>>31;$339=(($333+($i01_0>>1)^$333)+$261|0)/($i01_0|0)&-1;label=29;break;case 29:if($299){label=30;break}else{$348=0;label=31;break};case 30:$342=$266>>31;$348=(($342+($i11_0>>1)^$342)+$266|0)/($i11_0|0)&-1;label=31;break;case 31:$350=$_cell+16|0;HEAP32[$350>>2]=$348+$339;if($267){label=32;break}else{$359=0;label=33;break};case 32:$353=$141>>31;$359=((($i00_0>>1)+$353^$353)+$141|0)/($i00_0|0)&-1;label=33;break;case 33:if($277){label=34;break}else{$368=0;label=35;break};case 34:$362=$144>>31;$368=((($i10_0>>1)+$362^$362)+$144|0)/($i10_0|0)&-1;label=35;break;case 35:if(($i20_0|0)==0){$378=0;label=37;break}else{label=36;break};case 36:$372=$147>>31;$378=((($i20_0>>1)+$372^$372)+$147|0)/($i20_0|0)&-1;label=37;break;case 37:$383=$_cell+24|0;HEAP32[$383>>2]=$359+$242+$368+$378>>$240;if($289){label=38;break}else{$392=0;label=39;break};case 38:$386=$141>>31;$392=((($i01_0>>1)+$386^$386)+$141|0)/($i01_0|0)&-1;label=39;break;case 39:if($299){label=40;break}else{$401=0;label=41;break};case 40:$395=$144>>31;$401=((($i11_0>>1)+$395^$395)+$144|0)/($i11_0|0)&-1;label=41;break;case 41:if(($i21_0|0)==0){$411=0;label=43;break}else{label=42;break};case 42:$405=$147>>31;$411=((($i21_0>>1)+$405^$405)+$147|0)/($i21_0|0)&-1;label=43;break;case 43:$416=$_cell+28|0;HEAP32[$416>>2]=$392+$242+$401+$411>>$240;$418=$242+$147>>$240;HEAP32[$_cell+32>>2]=$418;$420=HEAP32[$288>>2]|0;$421=Math_imul($420,$1)|0;$422=HEAP32[$310>>2]|0;$423=Math_imul($422,$6)|0;$424=HEAP32[$330>>2]|0;$425=Math_imul($424,$1)|0;$426=HEAP32[$350>>2]|0;$427=Math_imul($426,$6)|0;$428=HEAP32[$383>>2]|0;$429=Math_imul($428,$1)|0;$430=HEAP32[$416>>2]|0;$433=$429+$418+(Math_imul($430,$6)|0)|0;$434=Math_imul($433,$129)|0;$435=Math_imul($433,$134)|0;$436=Math_imul($420,$2)|0;$437=Math_imul($422,$7)|0;$438=Math_imul($424,$2)|0;$439=Math_imul($426,$7)|0;$440=Math_imul($428,$2)|0;$443=$440+$418+(Math_imul($430,$7)|0)|0;$444=Math_imul($443,$130)|0;$445=Math_imul($443,$135)|0;$446=Math_imul($420,$3)|0;$447=Math_imul($422,$8)|0;$448=Math_imul($424,$3)|0;$449=Math_imul($426,$8)|0;$450=Math_imul($428,$3)|0;$453=$450+$418+(Math_imul($430,$8)|0)|0;$454=Math_imul($453,$_x3-$_x0|0)|0;$455=Math_imul($453,$_y3-$_y0|0)|0;HEAP32[$_cell+8>>2]=2-$421-$436-$446-$423-$437-$447+$434+$444+$454>>2;HEAP32[$_cell+20>>2]=2-$425-$438-$448-$427-$439-$449+$435+$445+$455>>2;HEAP32[$_cell+36>>2]=$_x0;HEAP32[$_cell+40>>2]=$_y0;HEAP32[$_cell+44>>2]=$_u0;HEAP32[$_cell+48>>2]=$_v0;return}}function _qr_hom_cell_project($_p,$_cell,$_u,$_v,$_res){$_p=$_p|0;$_cell=$_cell|0;$_u=$_u|0;$_v=$_v|0;$_res=$_res|0;var $4=0,$8=0,$11=0,$15=0,$19=0,$22=0,$26=0,$30=0,$33=0,$37=0;$4=$_u-(HEAP32[$_cell+44>>2]<<$_res)|0;$8=$_v-(HEAP32[$_cell+48>>2]<<$_res)|0;$11=Math_imul(HEAP32[$_cell>>2]|0,$4)|0;$15=(Math_imul(HEAP32[$_cell+4>>2]|0,$8)|0)+$11|0;$19=$15+(HEAP32[$_cell+8>>2]<<$_res)|0;$22=Math_imul(HEAP32[$_cell+12>>2]|0,$4)|0;$26=(Math_imul(HEAP32[$_cell+16>>2]|0,$8)|0)+$22|0;$30=$26+(HEAP32[$_cell+20>>2]<<$_res)|0;$33=Math_imul(HEAP32[$_cell+24>>2]|0,$4)|0;$37=(Math_imul(HEAP32[$_cell+28>>2]|0,$8)|0)+$33|0;_qr_hom_cell_fproject($_p,$_cell,$19,$30,$37+(HEAP32[$_cell+32>>2]<<$_res)|0);return}function _qr_hamming_dist($_y1,$_y2,$_maxdiff){$_y1=$_y1|0;$_y2=$_y2|0;$_maxdiff=$_maxdiff|0;var $ret_09=0,$y_08=0,$6=0,$7=0,$ret_0_lcssa=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_maxdiff|0)<1|($_y2|0)==($_y1|0)){$ret_0_lcssa=0;label=4;break}else{label=2;break};case 2:$y_08=$_y2^$_y1;$ret_09=0;label=3;break;case 3:$6=$y_08-1&$y_08;$7=$ret_09+1|0;if(($7|0)>=($_maxdiff|0)|($6|0)==0){$ret_0_lcssa=$7;label=4;break}else{$y_08=$6;$ret_09=$7;label=3;break};case 4:return $ret_0_lcssa|0}return 0}function _qr_finder_locate_crossing($_img,$_width,$_x0,$_y0,$_x1,$_y1,$_v,$_p){$_img=$_img|0;$_width=$_width|0;$_x0=$_x0|0;$_y0=$_y0|0;$_x1=$_x1|0;$_y1=$_y1|0;$_v=$_v|0;$_p=$_p|0;var $x0=0,$x1=0,$dx=0,$step=0,$1=0,$2=0,$3=0,$4=0,$5=0,$7=0,$8=0,$9=0,$13=0,$14=0,$16=0,$27=0,$28=0,$30=0,$31=0,$33=0,$err_0=0,$35=0,$40=0,$err_1=0,$52=0,$62=0,$err_2=0,$64=0,$69=0,$err_3=0,$81=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+32|0;label=1;while(1)switch(label|0){case 1:$x0=__stackBase__|0;$x1=__stackBase__+8|0;$dx=__stackBase__+16|0;$step=__stackBase__+24|0;$1=$x0|0;HEAP32[$1>>2]=$_x0;$2=$x0+4|0;HEAP32[$2>>2]=$_y0;$3=$x1|0;HEAP32[$3>>2]=$_x1;$4=$x1+4|0;HEAP32[$4>>2]=$_y1;$5=$_x1-$_x0|0;$7=$dx|0;HEAP32[$7>>2]=($5|0)>-1?$5:-$5|0;$8=$_y1-$_y0|0;$9=($8|0)>-1?$8:-$8|0;HEAP32[$dx+4>>2]=$9;$13=($9|0)>(HEAP32[$7>>2]|0)&1;$14=$13^1;$16=HEAP32[$dx+($14<<2)>>2]|0;HEAP32[$step>>2]=((($_x0|0)<($_x1|0)&1)<<1)-1;HEAP32[$step+4>>2]=((($_y0|0)<($_y1|0)&1)<<1)-1;$27=$x0+($13<<2)|0;$28=$x1+($13<<2)|0;$30=$step+($13<<2)|0;$31=$dx+($13<<2)|0;$33=$x0+($14<<2)|0;$err_0=0;label=2;break;case 2:$35=HEAP32[$27>>2]|0;if(($35|0)==(HEAP32[$28>>2]|0)){$_0=-1;label=12;break}else{label=3;break};case 3:HEAP32[$27>>2]=(HEAP32[$30>>2]|0)+$35;$40=$err_0+$16|0;if(($40<<1|0)>(HEAP32[$31>>2]|0)){label=4;break}else{$err_1=$40;label=5;break};case 4:HEAP32[$33>>2]=(HEAP32[$33>>2]|0)+(HEAP32[$step+($14<<2)>>2]|0);$err_1=$40-(HEAP32[$31>>2]|0)|0;label=5;break;case 5:$52=Math_imul(HEAP32[$2>>2]|0,$_width)|0;if(((HEAP8[$_img+($52+(HEAP32[$1>>2]|0))|0]|0)==0&1|0)==($_v|0)){$err_0=$err_1;label=2;break}else{label=6;break};case 6:$62=$x1+($14<<2)|0;$err_2=0;label=7;break;case 7:$64=HEAP32[$28>>2]|0;if((HEAP32[$27>>2]|0)==($64|0)){label=11;break}else{label=8;break};case 8:HEAP32[$28>>2]=$64-(HEAP32[$30>>2]|0);$69=$err_2+$16|0;if(($69<<1|0)>(HEAP32[$31>>2]|0)){label=9;break}else{$err_3=$69;label=10;break};case 9:HEAP32[$62>>2]=(HEAP32[$62>>2]|0)-(HEAP32[$step+($14<<2)>>2]|0);$err_3=$69-(HEAP32[$31>>2]|0)|0;label=10;break;case 10:$81=Math_imul(HEAP32[$4>>2]|0,$_width)|0;if(((HEAP8[$_img+($81+(HEAP32[$3>>2]|0))|0]|0)==0&1|0)==($_v|0)){$err_2=$err_3;label=7;break}else{label=11;break};case 11:HEAP32[$_p>>2]=((HEAP32[$3>>2]|0)+(HEAP32[$1>>2]|0)<<2)+4>>1;HEAP32[$_p+4>>2]=((HEAP32[$4>>2]|0)+(HEAP32[$2>>2]|0)<<2)+4>>1;$_0=0;label=12;break;case 12:STACKTOP=__stackBase__;return $_0|0}return 0}function _qr_hom_fproject($_p,$_hom,$_x,$_y,$_w){$_p=$_p|0;$_hom=$_hom|0;$_x=$_x|0;$_y=$_y|0;$_w=$_w|0;var $_024=0,$_023=0,$_0=0,$15=0,$16=0,$24=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_w|0)==0){label=2;break}else{label=3;break};case 2:HEAP32[$_p>>2]=($_x>>>31)+2147483647;HEAP32[$_p+4>>2]=($_y>>>31)+2147483647;label=6;break;case 3:if(($_w|0)<0){label=4;break}else{$_0=$_w;$_023=$_y;$_024=$_x;label=5;break};case 4:$_0=-$_w|0;$_023=-$_y|0;$_024=-$_x|0;label=5;break;case 5:$15=$_0>>1;$16=$_024>>31;HEAP32[$_p>>2]=(HEAP32[$_hom+56>>2]|0)+((($15+$16^$16)+$_024|0)/($_0|0)&-1);$24=$_023>>31;HEAP32[$_p+4>>2]=(HEAP32[$_hom+60>>2]|0)+((($15+$24^$24)+$_023|0)/($_0|0)&-1);label=6;break;case 6:return}}function _qr_point_translate($_point,$_dx,$_dy){$_point=$_point|0;$_dx=$_dx|0;$_dy=$_dy|0;var $3=0;HEAP32[$_point>>2]=(HEAP32[$_point>>2]|0)+$_dx;$3=$_point+4|0;HEAP32[$3>>2]=(HEAP32[$3>>2]|0)+$_dy;return}function _qr_cmp_edge_pt($_a,$_b){$_a=$_a|0;$_b=$_b|0;var $3=0,$6=0,$15=0,$18=0;$3=HEAP32[$_a+8>>2]|0;$6=HEAP32[$_b+8>>2]|0;$15=HEAP32[$_a+12>>2]|0;$18=HEAP32[$_b+12>>2]|0;return((($3|0)>($6|0)&1)-(($3|0)<($6|0)&1)<<1|($15|0)>($18|0)&1)-(($15|0)<($18|0)&1)|0}function _qr_alignment_pattern_search($_p,$_cell,$_u,$_v,$_r,$_img,$_width,$_height){$_p=$_p|0;$_cell=$_cell|0;$_u=$_u|0;$_v=$_v|0;$_r=$_r|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $c=0,$nc=0,$p=0,$pc=0,$2=0,$4=0,$6=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$15=0,$16=0,$18=0,$19=0,$20=0,$21=0,$22=0,$23=0,$25=0,$26=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$35=0,$36=0,$i_0273=0,$x0_0272=0,$y0_0271=0,$w0_0270=0,$40=0,$41=0,$42=0,$44=0,$45=0,$46=0,$48=0,$49=0,$50=0,$59=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=0,$68=0,$72=0,$74=0,$76=0,$79=0,$82=0,$84=0,$87=0,$90=0,$92=0,$95=0,$100=0,$w_1=0,$y_1=0,$x_1=0,$i_1=0,$besty_0=0,$bestx_0=0,$best_dist_0=0,$best_match_0=0,$106=0,$w_2=0,$y_2=0,$x_2=0,$j_1=0,$besty_1=0,$bestx_1=0,$best_dist_1=0,$best_match_1=0,$116=0,$117=0,$118=0,$120=0,$121=0,$_besty_1=0,$_bestx_1=0,$_best_dist_1=0,$_best_match_1=0,$125=0,$137=0,$w_3=0,$y_3=0,$x_3=0,$besty_4_ph=0,$bestx_4_ph=0,$best_dist_4_ph=0,$best_match_4_ph=0,$156=0,$161=0,$best_match_4235=0,$best_dist_4234=0,$bestx_4233=0,$besty_4232=0,$162=0,$164=0,$167=0,$i_2247=0,$179=0,$182=0,$186=0,$193=0,$197=0,$198=0,$202=0,$209=0,$213=0,$218=0,$220=0,$w3_0=0,$cx_0=0,$cy_0=0,$226=0,$227=0,$230=0,$233=0,$237=0,$239=0,$240=0,$242=0,$251=0,$252=0,$254=0,$259=0,$260=0,$261=0,$262=0,$267=0,$269=0,$274=0,$275=0,$284=0,$289=0,$storemerge=0,$295=0,$296=0,$298=0,$302=0,$303=0,$304=0,$309=0,$310=0,$315=0,$316=0,$320=0,$besty_5=0,$bestx_5=0,$_0=0,$330=0,$331=0,$333=0,$338=0,$339=0,$340=0,$341=0,$346=0,$348=0,$353=0,$354=0,$363=0,$368=0,$storemerge_1=0,$376=0,$381=0,$386=0,$388=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+256|0;label=1;while(1)switch(label|0){case 1:$c=__stackBase__|0;$nc=__stackBase__+32|0;$p=__stackBase__+48|0;$pc=__stackBase__+248|0;$2=$_cell+44|0;$4=$_u-2-(HEAP32[$2>>2]|0)|0;$6=$_cell+48|0;$8=$_v-2-(HEAP32[$6>>2]|0)|0;$9=$_cell|0;$10=HEAP32[$9>>2]|0;$11=Math_imul($10,$4)|0;$12=$_cell+4|0;$13=HEAP32[$12>>2]|0;$15=(Math_imul($13,$8)|0)+$11|0;$16=$_cell+8|0;$18=$15+(HEAP32[$16>>2]|0)|0;$19=$_cell+12|0;$20=HEAP32[$19>>2]|0;$21=Math_imul($20,$4)|0;$22=$_cell+16|0;$23=HEAP32[$22>>2]|0;$25=(Math_imul($23,$8)|0)+$21|0;$26=$_cell+20|0;$28=$25+(HEAP32[$26>>2]|0)|0;$29=$_cell+24|0;$30=HEAP32[$29>>2]|0;$31=Math_imul($30,$4)|0;$32=$_cell+28|0;$33=HEAP32[$32>>2]|0;$35=(Math_imul($33,$8)|0)+$31|0;$36=$_cell+32|0;$w0_0270=$35+(HEAP32[$36>>2]|0)|0;$y0_0271=$28;$x0_0272=$18;$i_0273=0;label=2;break;case 2:_qr_hom_cell_fproject($p+($i_0273*40&-1)|0,$_cell,$x0_0272,$y0_0271,$w0_0270);$40=$x0_0272+$10|0;$41=$y0_0271+$20|0;$42=$w0_0270+$30|0;_qr_hom_cell_fproject($p+($i_0273*40&-1)+8|0,$_cell,$40,$41,$42);$44=$40+$10|0;$45=$41+$20|0;$46=$42+$30|0;_qr_hom_cell_fproject($p+($i_0273*40&-1)+16|0,$_cell,$44,$45,$46);$48=$44+$10|0;$49=$45+$20|0;$50=$46+$30|0;_qr_hom_cell_fproject($p+($i_0273*40&-1)+24|0,$_cell,$48,$49,$50);_qr_hom_cell_fproject($p+($i_0273*40&-1)+32|0,$_cell,$48+$10|0,$49+$20|0,$50+$30|0);$59=$i_0273+1|0;if(($59|0)<5){$w0_0270=$w0_0270+$33|0;$y0_0271=$y0_0271+$23|0;$x0_0272=$x0_0272+$13|0;$i_0273=$59;label=2;break}else{label=3;break};case 3:$62=$p+96|0;$63=HEAP32[$62>>2]|0;$64=$p+100|0;$65=HEAP32[$64>>2]|0;$66=$p|0;$67=_qr_alignment_pattern_fetch($66,$63,$65,$_img,$_width,$_height)|0;$68=_qr_hamming_dist($67,33084991,25)|0;if(($68|0)>0){label=4;break}else{$best_match_4_ph=$67;$best_dist_4_ph=$68;$bestx_4_ph=$63;$besty_4_ph=$65;label=13;break};case 4:$72=$_u-(HEAP32[$2>>2]|0)|0;$74=$_v-(HEAP32[$6>>2]|0)|0;$76=Math_imul(HEAP32[$9>>2]|0,$72)|0;$79=(Math_imul(HEAP32[$12>>2]|0,$74)|0)+$76|0;$82=$79+(HEAP32[$16>>2]|0)<<2;$84=Math_imul(HEAP32[$19>>2]|0,$72)|0;$87=(Math_imul(HEAP32[$22>>2]|0,$74)|0)+$84|0;$90=$87+(HEAP32[$26>>2]|0)<<2;$92=Math_imul(HEAP32[$29>>2]|0,$72)|0;$95=(Math_imul(HEAP32[$32>>2]|0,$74)|0)+$92|0;$100=$pc|0;$best_match_0=$67;$best_dist_0=$68;$bestx_0=$63;$besty_0=$65;$i_1=1;$x_1=$82;$y_1=$90;$w_1=$95+(HEAP32[$36>>2]|0)<<2;label=5;break;case 5:if(($i_1|0)<($_r<<2|0)){label=6;break}else{label=14;break};case 6:$106=($i_1<<1)-1|0;$best_match_1=$best_match_0;$best_dist_1=$best_dist_0;$bestx_1=$bestx_0;$besty_1=$besty_0;$j_1=0;$x_2=$x_1-($13+$10)|0;$y_2=$y_1-($23+$20)|0;$w_2=$w_1-($33+$30)|0;label=7;break;case 7:if(($j_1|0)<($106<<2|0)){label=8;break}else{label=12;break};case 8:_qr_hom_cell_fproject($100,$_cell,$x_2,$y_2,$w_2);$116=HEAP32[$100>>2]|0;$117=HEAP32[$pc+4>>2]|0;$118=_qr_alignment_pattern_fetch($66,$116,$117,$_img,$_width,$_height)|0;$120=_qr_hamming_dist($118,33084991,$best_dist_1+1|0)|0;$121=($120|0)<($best_dist_1|0);$_besty_1=$121?$117:$besty_1;$_bestx_1=$121?$116:$bestx_1;$_best_dist_1=$121?$120:$best_dist_1;$_best_match_1=$121?$118:$best_match_1;if(($j_1|0)<($106<<1|0)){label=9;break}else{label=10;break};case 9:$125=($j_1|0)>=($106|0)&1;$x_3=(HEAP32[$_cell+($125<<2)>>2]|0)+$x_2|0;$y_3=(HEAP32[$_cell+12+($125<<2)>>2]|0)+$y_2|0;$w_3=(HEAP32[$_cell+24+($125<<2)>>2]|0)+$w_2|0;label=11;break;case 10:$137=($j_1|0)>=($106*3&-1|0)&1;$x_3=$x_2-(HEAP32[$_cell+($137<<2)>>2]|0)|0;$y_3=$y_2-(HEAP32[$_cell+12+($137<<2)>>2]|0)|0;$w_3=$w_2-(HEAP32[$_cell+24+($137<<2)>>2]|0)|0;label=11;break;case 11:if(($_best_dist_1|0)==0){$best_match_4_ph=$_best_match_1;$best_dist_4_ph=0;$bestx_4_ph=$_bestx_1;$besty_4_ph=$_besty_1;label=13;break}else{$best_match_1=$_best_match_1;$best_dist_1=$_best_dist_1;$bestx_1=$_bestx_1;$besty_1=$_besty_1;$j_1=$j_1+1|0;$x_2=$x_3;$y_2=$y_3;$w_2=$w_3;label=7;break};case 12:if(($best_dist_1|0)==0){$best_match_4_ph=$best_match_1;$best_dist_4_ph=0;$bestx_4_ph=$bestx_1;$besty_4_ph=$besty_1;label=13;break}else{$best_match_0=$best_match_1;$best_dist_0=$best_dist_1;$bestx_0=$bestx_1;$besty_0=$besty_1;$i_1=$i_1+1|0;$x_1=$x_2;$y_1=$y_2;$w_1=$w_2;label=5;break};case 13:$besty_4232=$besty_4_ph;$bestx_4233=$bestx_4_ph;$best_dist_4234=$best_dist_4_ph;$best_match_4235=$best_match_4_ph;$161=HEAP32[$62>>2]|0;label=16;break;case 14:$156=HEAP32[$62>>2]|0;if(($best_dist_0|0)>6){label=15;break}else{$besty_4232=$besty_0;$bestx_4233=$bestx_0;$best_dist_4234=$best_dist_0;$best_match_4235=$best_match_0;$161=$156;label=16;break};case 15:HEAP32[$_p>>2]=$156;HEAP32[$_p+4>>2]=HEAP32[$64>>2];$_0=-1;label=33;break;case 16:$162=$bestx_4233-$161|0;$164=$besty_4232-(HEAP32[$64>>2]|0)|0;_memset($nc|0,0,16);_memset($c|0,0,32);$167=$pc|0;$i_2247=0;label=17;break;case 17:if((HEAP32[56+($i_2247<<3)>>2]&$best_match_4235|0)==(HEAP32[60+($i_2247<<3)>>2]|0)){label=18;break}else{label=26;break};case 18:$179=HEAPU8[120+($i_2247<<1)|0]|0;$182=HEAPU8[121+($i_2247<<1)|0]|0;$186=(HEAP32[$p+($182*40&-1)+($179<<3)>>2]|0)+$162>>2;if(($186|0)>-1&($186|0)<($_width|0)){label=19;break}else{label=26;break};case 19:$193=(HEAP32[$p+($182*40&-1)+($179<<3)+4>>2]|0)+$164>>2;if(($193|0)>-1&($193|0)<($_height|0)){label=20;break}else{label=26;break};case 20:$197=4-$179|0;$198=4-$182|0;$202=(HEAP32[$p+($198*40&-1)+($197<<3)>>2]|0)+$162>>2;if(($202|0)>-1&($202|0)<($_width|0)){label=21;break}else{label=26;break};case 21:$209=(HEAP32[$p+($198*40&-1)+($197<<3)+4>>2]|0)+$164>>2;if(($209|0)>-1&($209|0)<($_height|0)){label=22;break}else{label=26;break};case 22:$213=$i_2247&1;if((_qr_finder_locate_crossing($_img,$_width,$186,$193,$202,$209,$213,$167)|0)==0){label=23;break}else{label=26;break};case 23:$218=(HEAP32[$167>>2]|0)-$bestx_4233|0;$220=(HEAP32[$pc+4>>2]|0)-$besty_4232|0;if(($213|0)==0){$cy_0=$220;$cx_0=$218;$w3_0=1;label=25;break}else{label=24;break};case 24:$cy_0=$220*3&-1;$cx_0=$218*3&-1;$w3_0=3;label=25;break;case 25:$226=$i_2247>>1;$227=$nc+($226<<2)|0;HEAP32[$227>>2]=(HEAP32[$227>>2]|0)+$w3_0;$230=$c+($226<<3)|0;HEAP32[$230>>2]=(HEAP32[$230>>2]|0)+$cx_0;$233=$c+($226<<3)+4|0;HEAP32[$233>>2]=(HEAP32[$233>>2]|0)+$cy_0;label=26;break;case 26:$237=$i_2247+1|0;if(($237|0)<8){$i_2247=$237;label=17;break}else{label=27;break};case 27:$239=$nc|0;$240=HEAP32[$239>>2]|0;$242=HEAP32[$nc+4>>2]|0;if(($240|0)==0|($242|0)==0){label=29;break}else{label=28;break};case 28:$251=$240-($240-$242&-(($242|0)>($240|0)&1))|0;$252=$c|0;$254=Math_imul(HEAP32[$252>>2]|0,$242)|0;$259=Math_imul((Math_imul(HEAP32[$c+8>>2]|0,$240)|0)+$254|0,$251)|0;$260=Math_imul($242,$240)|0;$261=$260>>1;$262=$259>>31;HEAP32[$252>>2]=(($262+$261^$262)+$259|0)/($260|0)&-1;$267=$c+4|0;$269=Math_imul(HEAP32[$267>>2]|0,$242)|0;$274=Math_imul((Math_imul(HEAP32[$c+12>>2]|0,$240)|0)+$269|0,$251)|0;$275=$274>>31;HEAP32[$267>>2]=(($275+$261^$275)+$274|0)/($260|0)&-1;$storemerge=$251<<1;label=30;break;case 29:$284=$c|0;HEAP32[$284>>2]=(HEAP32[$284>>2]|0)+(HEAP32[$c+8>>2]|0);$289=$c+4|0;HEAP32[$289>>2]=(HEAP32[$289>>2]|0)+(HEAP32[$c+12>>2]|0);$storemerge=(HEAP32[$239>>2]|0)+$242|0;label=30;break;case 30:HEAP32[$239>>2]=$storemerge;$295=$nc+8|0;$296=HEAP32[$295>>2]|0;$298=HEAP32[$nc+12>>2]|0;if(($296|0)==0|($298|0)==0){label=35;break}else{label=34;break};case 31:$302=HEAP32[$376>>2]|0;$303=$388>>1;$304=$302>>31;$309=HEAP32[$381>>2]|0;$310=$309>>31;$315=((($304+$303^$304)+$302|0)/($388|0)&-1)+$bestx_4233|0;$316=((($310+$303^$310)+$309|0)/($388|0)&-1)+$besty_4232|0;$320=(_qr_hamming_dist(_qr_alignment_pattern_fetch($66,$315,$316,$_img,$_width,$_height)|0,33084991,$best_dist_4234+1|0)|0)>($best_dist_4234|0);$bestx_5=$320?$bestx_4233:$315;$besty_5=$320?$besty_4232:$316;label=32;break;case 32:HEAP32[$_p>>2]=$bestx_5;HEAP32[$_p+4>>2]=$besty_5;$_0=0;label=33;break;case 33:STACKTOP=__stackBase__;return $_0|0;case 34:$330=$296-($296-$298&-(($298|0)>($296|0)&1))|0;$331=$c+16|0;$333=Math_imul(HEAP32[$331>>2]|0,$298)|0;$338=Math_imul((Math_imul(HEAP32[$c+24>>2]|0,$296)|0)+$333|0,$330)|0;$339=Math_imul($298,$296)|0;$340=$339>>1;$341=$338>>31;HEAP32[$331>>2]=(($341+$340^$341)+$338|0)/($339|0)&-1;$346=$c+20|0;$348=Math_imul(HEAP32[$346>>2]|0,$298)|0;$353=Math_imul((Math_imul(HEAP32[$c+28>>2]|0,$296)|0)+$348|0,$330)|0;$354=$353>>31;HEAP32[$346>>2]=(($354+$340^$354)+$353|0)/($339|0)&-1;$storemerge_1=$330<<1;label=36;break;case 35:$363=$c+16|0;HEAP32[$363>>2]=(HEAP32[$363>>2]|0)+(HEAP32[$c+24>>2]|0);$368=$c+20|0;HEAP32[$368>>2]=(HEAP32[$368>>2]|0)+(HEAP32[$c+28>>2]|0);$storemerge_1=(HEAP32[$295>>2]|0)+$298|0;label=36;break;case 36:HEAP32[$295>>2]=$storemerge_1;$376=$c|0;HEAP32[$376>>2]=(HEAP32[$376>>2]|0)+(HEAP32[$c+16>>2]|0);$381=$c+4|0;HEAP32[$381>>2]=(HEAP32[$381>>2]|0)+(HEAP32[$c+20>>2]|0);$386=$nc|0;$388=(HEAP32[$386>>2]|0)+(HEAP32[$nc+8>>2]|0)|0;HEAP32[$386>>2]=$388;if(($388|0)==0){$bestx_5=$bestx_4233;$besty_5=$besty_4232;label=32;break}else{label=31;break}}return 0}function _qr_alignment_pattern_fetch($_p,$_x0,$_y0,$_img,$_width,$_height){$_p=$_p|0;$_x0=$_x0|0;$_y0=$_y0|0;$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $3=0,$6=0,$v_023=0,$i_022=0,$k_021=0,$15=0,$25=0,$35=0,$45=0,$55=0,$57=0,label=0;label=1;while(1)switch(label|0){case 1:$3=$_x0-(HEAP32[$_p+96>>2]|0)|0;$6=$_y0-(HEAP32[$_p+100>>2]|0)|0;$k_021=0;$i_022=0;$v_023=0;label=2;break;case 2:$15=(_qr_img_get_bit($_img,$_width,$_height,$3+(HEAP32[$_p+($i_022*40&-1)>>2]|0)|0,$6+(HEAP32[$_p+($i_022*40&-1)+4>>2]|0)|0)|0)<<$k_021|$v_023;$25=(_qr_img_get_bit($_img,$_width,$_height,$3+(HEAP32[$_p+($i_022*40&-1)+8>>2]|0)|0,$6+(HEAP32[$_p+($i_022*40&-1)+12>>2]|0)|0)|0)<<$k_021+1|$15;$35=(_qr_img_get_bit($_img,$_width,$_height,$3+(HEAP32[$_p+($i_022*40&-1)+16>>2]|0)|0,$6+(HEAP32[$_p+($i_022*40&-1)+20>>2]|0)|0)|0)<<$k_021+2|$25;$45=(_qr_img_get_bit($_img,$_width,$_height,$3+(HEAP32[$_p+($i_022*40&-1)+24>>2]|0)|0,$6+(HEAP32[$_p+($i_022*40&-1)+28>>2]|0)|0)|0)<<$k_021+3|$35;$55=(_qr_img_get_bit($_img,$_width,$_height,$3+(HEAP32[$_p+($i_022*40&-1)+32>>2]|0)|0,$6+(HEAP32[$_p+($i_022*40&-1)+36>>2]|0)|0)|0)<<$k_021+4|$45;$57=$i_022+1|0;if(($57|0)<5){$k_021=$k_021+5|0;$i_022=$57;$v_023=$55;label=2;break}else{label=3;break};case 3:return $55|0}return 0}function _bch18_6_correct($_y){$_y=$_y|0;var $1=0,$2=0,$7=0,$8=0,$x_020=0,$15=0,$16=0,$20=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=HEAP32[$_y>>2]|0;$2=$1>>>12;if(($1-28672|0)>>>0<139264){label=2;break}else{$x_020=0;label=4;break};case 2:$7=HEAP32[10496+($2-7<<2)>>2]|0;$8=_qr_hamming_dist($1,$7,4)|0;if(($8|0)<4){label=3;break}else{$x_020=0;label=4;break};case 3:HEAP32[$_y>>2]=$7;$_0=$8;label=8;break;case 4:if(($x_020+7|0)==($2|0)){label=7;break}else{label=5;break};case 5:$15=HEAP32[10496+($x_020<<2)>>2]|0;$16=_qr_hamming_dist($1,$15,4)|0;if(($16|0)<4){label=6;break}else{label=7;break};case 6:HEAP32[$_y>>2]=$15;$_0=$16;label=8;break;case 7:$20=$x_020+1|0;if($20>>>0<34){$x_020=$20;label=4;break}else{$_0=-1;label=8;break};case 8:return $_0|0}return 0}function _qr_line_eval($_line,$_x,$_y){$_line=$_line|0;$_x=$_x|0;$_y=$_y|0;var $2=0,$6=0;$2=Math_imul(HEAP32[$_line>>2]|0,$_x)|0;$6=(Math_imul(HEAP32[$_line+4>>2]|0,$_y)|0)+$2|0;return $6+(HEAP32[$_line+8>>2]|0)|0}function _qr_finder_quick_crossing_check($_img,$_width,$_height,$_x0,$_y0,$_x1,$_y1){$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;$_x0=$_x0|0;$_y0=$_y0|0;$_x1=$_x1|0;$_y1=$_y1|0;var $_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_y1|0)<($_height|0)&((($_x0|0)>=($_width|0)|($_x0|0)<0|($_y0|0)<0|($_y0|0)>=($_height|0)|($_x1|0)<0|($_x1|0)>=($_width|0)|($_y1|0)<0)^1)){label=2;break}else{$_0=-1;label=5;break};case 2:if((HEAP8[$_img+((Math_imul($_y0,$_width)|0)+$_x0)|0]|0)==0){label=3;break}else{$_0=1;label=5;break};case 3:if((HEAP8[$_img+((Math_imul($_y1,$_width)|0)+$_x1)|0]|0)==0){label=4;break}else{$_0=1;label=5;break};case 4:$_0=((HEAP8[$_img+((Math_imul($_y1+$_y0>>1,$_width)|0)+($_x1+$_x0>>1))|0]|0)==0)<<31>>31;label=5;break;case 5:return $_0|0}return 0}function _qr_aff_project($_p,$_aff,$_u,$_v){$_p=$_p|0;$_aff=$_aff|0;$_u=$_u|0;$_v=$_v|0;var $3=0,$7=0,$8=0,$9=0,$19=0,$23=0,$24=0;$3=Math_imul(HEAP32[$_aff>>2]|0,$_u)|0;$7=(Math_imul(HEAP32[$_aff+4>>2]|0,$_v)|0)+$3|0;$8=$_aff+40|0;$9=HEAP32[$8>>2]|0;HEAP32[$_p>>2]=($7+(1<<$9-1)>>$9)+(HEAP32[$_aff+32>>2]|0);$19=Math_imul(HEAP32[$_aff+8>>2]|0,$_u)|0;$23=(Math_imul(HEAP32[$_aff+12>>2]|0,$_v)|0)+$19|0;$24=HEAP32[$8>>2]|0;HEAP32[$_p+4>>2]=($23+(1<<$24-1)>>$24)+(HEAP32[$_aff+36>>2]|0);return}function _qr_line_isect($_p,$_l0,$_l1){$_p=$_p|0;$_l0=$_l0|0;$_l1=$_l1|0;var $1=0,$3=0,$4=0,$6=0,$7=0,$8=0,$9=0,$13=0,$14=0,$16=0,$18=0,$19=0,$21=0,$d_0=0,$x_0=0,$y_0=0,$28=0,$29=0,$34=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=HEAP32[$_l0>>2]|0;$3=HEAP32[$_l1+4>>2]|0;$4=Math_imul($3,$1)|0;$6=HEAP32[$_l0+4>>2]|0;$7=HEAP32[$_l1>>2]|0;$8=Math_imul($7,$6)|0;$9=$4-$8|0;if(($4|0)==($8|0)){$_0=-1;label=5;break}else{label=2;break};case 2:$13=HEAP32[$_l1+8>>2]|0;$14=Math_imul($13,$6)|0;$16=HEAP32[$_l0+8>>2]|0;$18=$14-(Math_imul($16,$3)|0)|0;$19=Math_imul($16,$7)|0;$21=$19-(Math_imul($13,$1)|0)|0;if(($9|0)<0){label=3;break}else{$y_0=$21;$x_0=$18;$d_0=$9;label=4;break};case 3:$y_0=-$21|0;$x_0=-$18|0;$d_0=-$9|0;label=4;break;case 4:$28=$d_0>>1;$29=$x_0>>31;HEAP32[$_p>>2]=(($29+$28^$29)+$x_0|0)/($d_0|0)&-1;$34=$y_0>>31;HEAP32[$_p+4>>2]=(($34+$28^$34)+$y_0|0)/($d_0|0)&-1;$_0=0;label=5;break;case 5:return $_0|0}return 0}function _qr_finder_ransac($_f,$_hom,$_isaac,$_e){$_f=$_f|0;$_hom=$_hom|0;$_isaac=$_isaac|0;$_e=$_e|0;var $q0=0,$q1=0,$2=0,$4=0,$7=0,$8=0,$9=0,$10=0,$11=0,$14=0,$22=0,$best_ninliers_081=0,$max_iters_080=0,$i_079=0,$24=0,$25=0,$_=0,$27=0,$28=0,$45=0,$49=0,$55=0,$j1_072=0,$ninliers_071=0,$57=0,$60=0,$61=0,$ninliers_1=0,$68=0,$j1_175=0,$71=0,$74=0,$max_iters_1=0,$best_ninliers_1=0,$82=0,$i_170=0,$j_069=0,$93=0,$95=0,$j_1=0,$best_ninliers_2=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+32|0;label=1;while(1)switch(label|0){case 1:$q0=__stackBase__|0;$q1=__stackBase__+8|0;$2=HEAP32[$_f+16+($_e<<2)>>2]|0;$4=HEAP32[$_f+32+($_e<<2)>>2]|0;if(($4|0)>1){label=2;break}else{$best_ninliers_2=0;label=21;break};case 2:$7=$q0|0;$8=$q1|0;$9=$_f+64|0;$10=$_f+68|0;$11=$_e>>1;$14=1-$11|0;$i_079=0;$max_iters_080=17;$best_ninliers_081=0;label=5;break;case 3:if(($best_ninliers_1|0)>0){label=4;break}else{$best_ninliers_2=$best_ninliers_1;label=21;break};case 4:$22=__stackBase__+16|0;$j_069=0;$i_170=0;label=16;break;case 5:$24=_isaac_next_uint($_isaac,$4)|0;$25=_isaac_next_uint($_isaac,$4-1|0)|0;$_=(($25|0)>=($24|0)&1)+$25|0;$27=$2+($24<<4)|0;$28=$2+($_<<4)|0;_qr_aff_unproject($7,$_hom,HEAP32[$27>>2]|0,HEAP32[$2+($24<<4)+4>>2]|0);_qr_aff_unproject($8,$_hom,HEAP32[$28>>2]|0,HEAP32[$2+($_<<4)+4>>2]|0);_qr_point_translate($7,-(HEAP32[$9>>2]|0)|0,-(HEAP32[$10>>2]|0)|0);_qr_point_translate($8,-(HEAP32[$9>>2]|0)|0,-(HEAP32[$10>>2]|0)|0);$45=(HEAP32[$q0+($11<<2)>>2]|0)-(HEAP32[$q1+($11<<2)>>2]|0)|0;$49=(HEAP32[$q0+($14<<2)>>2]|0)-(HEAP32[$q1+($14<<2)>>2]|0)|0;if(((($45|0)>-1?$45:-$45|0)|0)>((($49|0)>-1?$49:-$49|0)|0)){$best_ninliers_1=$best_ninliers_081;$max_iters_1=$max_iters_080;label=15;break}else{label=6;break};case 6:$55=_qr_isqrt((_qr_point_distance2($27,$28)|0)<<5)|0;$ninliers_071=0;$j1_072=0;label=7;break;case 7:$57=_qr_point_ccw($27,$28,$2+($j1_072<<4)|0)|0;$60=$2+($j1_072<<4)+12|0;$61=HEAP32[$60>>2]|0;if(((($57|0)>-1?$57:-$57|0)|0)>($55|0)){label=9;break}else{label=8;break};case 8:HEAP32[$60>>2]=$61|1;$ninliers_1=$ninliers_071+1|0;label=10;break;case 9:HEAP32[$60>>2]=$61&-2;$ninliers_1=$ninliers_071;label=10;break;case 10:$68=$j1_072+1|0;if(($68|0)<($4|0)){$ninliers_071=$ninliers_1;$j1_072=$68;label=7;break}else{label=11;break};case 11:if(($ninliers_1|0)>($best_ninliers_081|0)){$j1_175=0;label=12;break}else{$best_ninliers_1=$best_ninliers_081;$max_iters_1=$max_iters_080;label=15;break};case 12:$71=$2+($j1_175<<4)+12|0;HEAP32[$71>>2]=HEAP32[$71>>2]<<1;$74=$j1_175+1|0;if(($74|0)<($4|0)){$j1_175=$74;label=12;break}else{label=13;break};case 13:if(($ninliers_1|0)>($4>>1|0)){label=14;break}else{$best_ninliers_1=$ninliers_1;$max_iters_1=$max_iters_080;label=15;break};case 14:$best_ninliers_1=$ninliers_1;$max_iters_1=(($4*67&-1)-1+($ninliers_1*-63&-1)|0)/($4<<1|0)&-1;label=15;break;case 15:$82=$i_079+1|0;if(($82|0)<($max_iters_1|0)){$i_079=$82;$max_iters_080=$max_iters_1;$best_ninliers_081=$best_ninliers_1;label=5;break}else{label=3;break};case 16:if((HEAP32[$2+($i_170<<4)+12>>2]&2|0)==0){$j_1=$j_069;label=20;break}else{label=17;break};case 17:if(($j_069|0)<($i_170|0)){label=18;break}else{label=19;break};case 18:$93=$2+($i_170<<4)|0;HEAP32[$22>>2]=HEAP32[$93>>2];HEAP32[$22+4>>2]=HEAP32[$93+4>>2];HEAP32[$22+8>>2]=HEAP32[$93+8>>2];HEAP32[$22+12>>2]=HEAP32[$93+12>>2];$95=$2+($j_069<<4)|0;HEAP32[$95>>2]=HEAP32[$93>>2];HEAP32[$95+4>>2]=HEAP32[$93+4>>2];HEAP32[$95+8>>2]=HEAP32[$93+8>>2];HEAP32[$95+12>>2]=HEAP32[$93+12>>2];HEAP32[$93>>2]=HEAP32[$22>>2];HEAP32[$93+4>>2]=HEAP32[$22+4>>2];HEAP32[$93+8>>2]=HEAP32[$22+8>>2];HEAP32[$93+12>>2]=HEAP32[$22+12>>2];label=19;break;case 19:$j_1=$j_069+1|0;label=20;break;case 20:if(($j_1|0)<($best_ninliers_1|0)){$j_069=$j_1;$i_170=$i_170+1|0;label=16;break}else{$best_ninliers_2=$best_ninliers_1;label=21;break};case 21:HEAP32[$_f+48+($_e<<2)>>2]=$best_ninliers_2;STACKTOP=__stackBase__;return}}function _qr_line_fit_finder_pair($_l,$_aff,$_f0,$_f1,$_e){$_l=$_l|0;$_aff=$_aff|0;$_f0=$_f0|0;$_f1=$_f1|0;$_e=$_e|0;var $q=0,$2=0,$4=0,$17=0,$19=0,$20=0,$23=0,$i_064=0,$31=0,$36=0,$39=0,$40=0,$46=0,$47=0,$n0_0=0,$56=0,$i_162=0,$60=0,$65=0,$70=0,$73=0,$74=0,$80=0,$81=0,$90=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$q=__stackBase__|0;$2=HEAP32[$_f0+48+($_e<<2)>>2]|0;$4=HEAP32[$_f1+48+($_e<<2)>>2]|0;$17=$4-($4-1&-(($4|0)<1&1))+($2-($2-1&-(($2|0)<1&1)))|0;$19=_malloc($17<<3)|0;$20=$19;if(($2|0)>0){label=2;break}else{label=4;break};case 2:$23=HEAP32[$_f0+16+($_e<<2)>>2]|0;$i_064=0;label=3;break;case 3:HEAP32[$20+($i_064<<3)>>2]=HEAP32[$23+($i_064<<4)>>2];HEAP32[$20+($i_064<<3)+4>>2]=HEAP32[$23+($i_064<<4)+4>>2];$31=$i_064+1|0;if(($31|0)<($2|0)){$i_064=$31;label=3;break}else{$n0_0=$2;label=5;break};case 4:$36=$q|0;HEAP32[$36>>2]=HEAP32[$_f0+64>>2];$39=$q+4|0;HEAP32[$39>>2]=HEAP32[$_f0+68>>2];$40=$_e>>1;$46=Math_imul(HEAP32[$_f0+($40<<2)>>2]|0,($_e<<1&2)-1|0)|0;$47=$q+($40<<2)|0;HEAP32[$47>>2]=(HEAP32[$47>>2]|0)+$46;_qr_aff_project($19,$_aff,HEAP32[$36>>2]|0,HEAP32[$39>>2]|0);$n0_0=$2+1|0;label=5;break;case 5:if(($4|0)>0){label=6;break}else{label=8;break};case 6:$56=HEAP32[$_f1+16+($_e<<2)>>2]|0;$i_162=0;label=7;break;case 7:$60=$i_162+$n0_0|0;HEAP32[$20+($60<<3)>>2]=HEAP32[$56+($i_162<<4)>>2];HEAP32[$20+($60<<3)+4>>2]=HEAP32[$56+($i_162<<4)+4>>2];$65=$i_162+1|0;if(($65|0)<($4|0)){$i_162=$65;label=7;break}else{label=9;break};case 8:$70=$q|0;HEAP32[$70>>2]=HEAP32[$_f1+64>>2];$73=$q+4|0;HEAP32[$73>>2]=HEAP32[$_f1+68>>2];$74=$_e>>1;$80=Math_imul(HEAP32[$_f1+($74<<2)>>2]|0,($_e<<1&2)-1|0)|0;$81=$q+($74<<2)|0;HEAP32[$81>>2]=(HEAP32[$81>>2]|0)+$80;_qr_aff_project($20+($n0_0<<3)|0,$_aff,HEAP32[$70>>2]|0,HEAP32[$73>>2]|0);label=9;break;case 9:_qr_line_fit_points($_l,$20,$17,HEAP32[$_aff+40>>2]|0);$90=HEAP32[$_f0+72>>2]|0;_qr_line_orient($_l,HEAP32[$90>>2]|0,HEAP32[$90+4>>2]|0);_free($19);STACKTOP=__stackBase__;return}}function _qr_line_fit_finder_edge($_l,$_f,$_e,$_res){$_l=$_l|0;$_f=$_f|0;$_e=$_e|0;$_res=$_res|0;var $2=0,$5=0,$6=0,$8=0,$i_022=0,$16=0,$19=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$_f+48+($_e<<2)>>2]|0;if(($2|0)<2){$_0=-1;label=5;break}else{label=2;break};case 2:$5=_malloc($2<<3)|0;$6=$5;$8=HEAP32[$_f+16+($_e<<2)>>2]|0;$i_022=0;label=3;break;case 3:HEAP32[$6+($i_022<<3)>>2]=HEAP32[$8+($i_022<<4)>>2];HEAP32[$6+($i_022<<3)+4>>2]=HEAP32[$8+($i_022<<4)+4>>2];$16=$i_022+1|0;if(($16|0)<($2|0)){$i_022=$16;label=3;break}else{label=4;break};case 4:_qr_line_fit_points($_l,$6,$2,$_res);$19=HEAP32[$_f+72>>2]|0;_qr_line_orient($_l,HEAP32[$19>>2]|0,HEAP32[$19+4>>2]|0);_free($5);$_0=0;label=5;break;case 5:return $_0|0}return 0}function _qr_aff_line_step($_aff,$_l,$_v,$_du,$_dv){$_aff=$_aff|0;$_l=$_l|0;$_v=$_v|0;$_du=$_du|0;$_dv=$_dv|0;var $3=0,$4=0,$8=0,$10=0,$11=0,$14=0,$18=0,$n_0=0,$d_0=0,$24=0,$27=0,$36=0,$38=0,$40=0,$42=0,$47=0,$49=0,$53=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$3=HEAP32[$_l>>2]|0;$4=Math_imul($3,HEAP32[$_aff+($_v<<2)>>2]|0)|0;$8=HEAP32[$_l+4>>2]|0;$10=(Math_imul($8,HEAP32[$_aff+8+($_v<<2)>>2]|0)|0)+$4|0;$11=1-$_v|0;$14=Math_imul(HEAP32[$_aff+($11<<2)>>2]|0,$3)|0;$18=(Math_imul(HEAP32[$_aff+8+($11<<2)>>2]|0,$8)|0)+$14|0;if(($18|0)<0){label=2;break}else{$d_0=$18;$n_0=$10;label=3;break};case 2:$d_0=-$18|0;$n_0=-$10|0;label=3;break;case 3:$24=_qr_ilog($_du)|0;$27=29-$24-(_qr_ilog(($n_0|0)>-1?$n_0:-$n_0|0)|0)|0;$36=-($27&-(($24-29+(_qr_ilog(($n_0|0)>-1?$n_0:-$n_0|0)|0)|0)>0&1))|0;$38=1<<$36>>1;$40=$38+$n_0>>$36;$42=$38+$d_0>>$36;if(((($40|0)>-1?$40:-$40|0)|0)<($42|0)){label=4;break}else{$_0=-1;label=6;break};case 4:$47=Math_imul($40,-$_du|0)|0;$49=$47>>31;$53=(($49+($42>>1)^$49)+$47|0)/($42|0)&-1;if(((($53|0)>-1?$53:-$53|0)|0)<($_du|0)){label=5;break}else{$_0=-1;label=6;break};case 5:HEAP32[$_dv>>2]=$53;$_0=0;label=6;break;case 6:return $_0|0}return 0}function _qr_line_fit_points($_l,$_p,$_np,$_res){$_l=$_l|0;$_p=$_p|0;$_np=$_np|0;$_res=$_res|0;var $i_0172=0,$sx_0171=0,$sy_0170=0,$xmin_0169=0,$xmax_0168=0,$ymin_0167=0,$ymax_0166=0,$3=0,$4=0,$10=0,$16=0,$18=0,$19=0,$25=0,$31=0,$32=0,$sx_0_lcssa=0,$sy_0_lcssa=0,$xmin_0_lcssa=0,$xmax_0_lcssa=0,$ymin_0_lcssa=0,$ymax_0_lcssa=0,$34=0,$36=0,$38=0,$39=0,$40=0,$46=0,$47=0,$48=0,$54=0,$62=0,$69=0,$71=0,$i_1163=0,$syy_0162=0,$sxy_0161=0,$sxx_0160=0,$79=0,$83=0,$85=0,$87=0,$89=0,$90=0,$syy_0_lcssa=0,$sxy_0_lcssa=0,$sxx_0_lcssa=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_np|0)>0){$ymax_0166=-2147483648;$ymin_0167=2147483647;$xmax_0168=-2147483648;$xmin_0169=2147483647;$sy_0170=0;$sx_0171=0;$i_0172=0;label=2;break}else{$ymax_0_lcssa=-2147483648;$ymin_0_lcssa=2147483647;$xmax_0_lcssa=-2147483648;$xmin_0_lcssa=2147483647;$sy_0_lcssa=0;$sx_0_lcssa=0;label=3;break};case 2:$3=HEAP32[$_p+($i_0172<<3)>>2]|0;$4=$3+$sx_0171|0;$10=($3-$xmin_0169&-(($3|0)<($xmin_0169|0)&1))+$xmin_0169|0;$16=$xmax_0168-($xmax_0168-$3&-(($3|0)>($xmax_0168|0)&1))|0;$18=HEAP32[$_p+($i_0172<<3)+4>>2]|0;$19=$18+$sy_0170|0;$25=($18-$ymin_0167&-(($18|0)<($ymin_0167|0)&1))+$ymin_0167|0;$31=$ymax_0166-($ymax_0166-$18&-(($18|0)>($ymax_0166|0)&1))|0;$32=$i_0172+1|0;if(($32|0)<($_np|0)){$ymax_0166=$31;$ymin_0167=$25;$xmax_0168=$16;$xmin_0169=$10;$sy_0170=$19;$sx_0171=$4;$i_0172=$32;label=2;break}else{$ymax_0_lcssa=$31;$ymin_0_lcssa=$25;$xmax_0_lcssa=$16;$xmin_0_lcssa=$10;$sy_0_lcssa=$19;$sx_0_lcssa=$4;label=3;break};case 3:$34=$_np>>1;$36=($sx_0_lcssa+$34|0)/($_np|0)&-1;$38=($sy_0_lcssa+$34|0)/($_np|0)&-1;$39=$xmax_0_lcssa-$36|0;$40=$36-$xmin_0_lcssa|0;$46=$39-($39-$40&-(($40|0)>($39|0)&1))|0;$47=$ymax_0_lcssa-$38|0;$48=$38-$ymin_0_lcssa|0;$54=$47-($47-$48&-(($48|0)>($47|0)&1))|0;$62=_qr_ilog(Math_imul($46-($46-$54&-(($54|0)>($46|0)&1))|0,$_np)|0)|0;$69=-(15-$62&-(($62-15|0)>0&1))|0;$71=1<<$69>>1;if(($_np|0)>0){label=4;break}else{$sxx_0_lcssa=0;$sxy_0_lcssa=0;$syy_0_lcssa=0;label=6;break};case 4:$sxx_0160=0;$sxy_0161=0;$syy_0162=0;$i_1163=0;label=5;break;case 5:$79=$71-$36+(HEAP32[$_p+($i_1163<<3)>>2]|0)>>$69;$83=$71-$38+(HEAP32[$_p+($i_1163<<3)+4>>2]|0)>>$69;$85=(Math_imul($79,$79)|0)+$sxx_0160|0;$87=(Math_imul($83,$79)|0)+$sxy_0161|0;$89=(Math_imul($83,$83)|0)+$syy_0162|0;$90=$i_1163+1|0;if(($90|0)<($_np|0)){$sxx_0160=$85;$sxy_0161=$87;$syy_0162=$89;$i_1163=$90;label=5;break}else{$sxx_0_lcssa=$85;$sxy_0_lcssa=$87;$syy_0_lcssa=$89;label=6;break};case 6:_qr_line_fit($_l,$36,$38,$sxx_0_lcssa,$sxy_0_lcssa,$syy_0_lcssa,$_res);return}}function _qr_hom_init($_hom,$_x0,$_y0,$_x1,$_y1,$_x2,$_y2,$_x3,$_y3){$_hom=$_hom|0;$_x0=$_x0|0;$_y0=$_y0|0;$_x1=$_x1|0;$_y1=$_y1|0;$_x2=$_x2|0;$_y2=$_y2|0;$_x3=$_x3|0;$_y3=$_y3|0;var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$13=0,$14=0,$16=0,$17=0,$19=0,$31=0,$32=0,$35=0,$47=0,$48=0,$51=0,$93=0,$99=0,$105=0,$111=0,$112=0,$113=0,$114=0,$116$0=0,$116$1=0,$117$0=0,$118$0=0,$118$1=0,$119$0=0,$120$0=0,$123=0,$125$0=0,$125$1=0,$126$0=0,$127$0=0,$130=0,$133$0=0,$134$0=0,$137=0,$139$0=0,$140$0=0,$143=0,$147=0,$150=0,$161=0,$204=0,$205=0,$208=0,$212=0,$220=0,$262=0,$263=0,$266=0,$270=0,$278=0,$288=0,$294=0,$295=0,$297=0,$299=0,$300=0,$302$0=0,$302$1=0,$303$0=0,$304$0=0,$304$1=0,$305$0=0,$306$0=0,$311=0,$313$0=0,$314$0=0,$319=0,$321$0=0,$322$0=0,$326=0,$328$0=0,$329$0=0,$333=0,$335=0,$337$0=0,$337$1=0,$338=0,$340=0,$342$0=0,$343$0=0,$343$1=0,$_neg160$0=0,$344$0=0,$345$0=0,$349=0,$351=0,$353$0=0,$353$1=0,$354=0,$356=0,$358$0=0,$358$1=0,$_neg162$0=0,$359$0=0,$363=0,$365=0,$367$0=0,$367$1=0,$368=0,$370=0,$372$0=0,$372$1=0,$_neg164$0=0,$373$0=0,label=0,$121$0=0,$121$1=0,$128$0=0,$128$1=0,$135$0=0,$135$1=0,$141$0=0,$141$1=0,$307$0=0,$307$1=0,$315$0=0,$315$1=0,$323$0=0,$323$1=0,$330$0=0,$330$1=0,$346$0=0,$346$1=0,$360$0=0,$360$1=0,$374$0=0,$374$1=0;label=1;while(1)switch(label|0){case 1:$1=$_x1-$_x0|0;$2=$_x2-$_x0|0;$3=$_x3-$_x0|0;$4=$_x3-$_x1|0;$5=$_x3-$_x2|0;$6=$_y1-$_y0|0;$7=$_y2-$_y0|0;$8=$_y3-$_y0|0;$9=$_y3-$_y1|0;$10=$_y3-$_y2|0;$11=Math_imul($5,$6)|0;$13=$11-(Math_imul($10,$1)|0)|0;$14=Math_imul($9,$2)|0;$16=$14-(Math_imul($4,$7)|0)|0;$17=Math_imul($9,$5)|0;$19=$17-(Math_imul($10,$4)|0)|0;$31=_qr_ilog((($1|0)>-1?$1:-$1|0)-((($1|0)>-1?$1:-$1|0)-(($6|0)>-1?$6:-$6|0)&-(((($6|0)>-1?$6:-$6|0)|0)>((($1|0)>-1?$1:-$1|0)|0)&1))|0)|0;$32=$13+$19|0;$35=(_qr_ilog(($32|0)>-1?$32:-$32|0)|0)+$31|0;$47=_qr_ilog((($2|0)>-1?$2:-$2|0)-((($2|0)>-1?$2:-$2|0)-(($7|0)>-1?$7:-$7|0)&-(((($7|0)>-1?$7:-$7|0)|0)>((($2|0)>-1?$2:-$2|0)|0)&1))|0)|0;$48=$16+$19|0;$51=(_qr_ilog(($48|0)>-1?$48:-$48|0)|0)+$47|0;$93=_qr_ilog((($13|0)>-1?$13:-$13|0)-((($13|0)>-1?$13:-$13|0)-(($16|0)>-1?$16:-$16|0)&-(((($16|0)>-1?$16:-$16|0)|0)>((($13|0)>-1?$13:-$13|0)|0)&1))-((($13|0)>-1?$13:-$13|0)-(($19|0)>-1?$19:-$19|0)-((($13|0)>-1?$13:-$13|0)-(($16|0)>-1?$16:-$16|0)&-(((($16|0)>-1?$16:-$16|0)|0)>((($13|0)>-1?$13:-$13|0)|0)&1))&-(((($19|0)>-1?$19:-$19|0)|0)>((($13|0)>-1?$13:-$13|0)-((($13|0)>-1?$13:-$13|0)-(($16|0)>-1?$16:-$16|0)&-(((($16|0)>-1?$16:-$16|0)|0)>((($13|0)>-1?$13:-$13|0)|0)&1))|0)&1))|0)|0;$99=$35-($35-$51&-(($51|0)>($35|0)&1))|0;$105=$99-($99-$93&-(($93|0)>($99|0)&1))|0;$111=16-$105&-(($105-16|0)>0&1);$112=-$111|0;$113=1<<$112;$114=$113>>1;$116$0=$32;$116$1=($32|0)<0?-1:0;$117$0=___muldi3($116$0,$116$1,$1,($1|0)<0?-1:0)|0;$118$0=$114;$118$1=($114|0)<0?-1:0;$119$0=_i64Add($118$0,$118$1,$117$0,tempRet0)|0;$120$0=$112;$121$0=_bitshift64Ashr($119$0|0,tempRet0|0,$120$0|0)|0;$121$1=tempRet0;$123=$_hom|0;HEAP32[$123>>2]=$121$0;$125$0=$48;$125$1=($48|0)<0?-1:0;$126$0=___muldi3($125$0,$125$1,$2,($2|0)<0?-1:0)|0;$127$0=_i64Add($118$0,$118$1,$126$0,tempRet0)|0;$128$0=_bitshift64Ashr($127$0|0,tempRet0|0,$120$0|0)|0;$128$1=tempRet0;$130=$_hom+4|0;HEAP32[$130>>2]=$128$0;HEAP32[$_hom+56>>2]=$_x0;$133$0=___muldi3($116$0,$116$1,$6,($6|0)<0?-1:0)|0;$134$0=_i64Add($118$0,$118$1,$133$0,tempRet0)|0;$135$0=_bitshift64Ashr($134$0|0,tempRet0|0,$120$0|0)|0;$135$1=tempRet0;$137=$_hom+8|0;HEAP32[$137>>2]=$135$0;$139$0=___muldi3($125$0,$125$1,$7,($7|0)<0?-1:0)|0;$140$0=_i64Add($118$0,$118$1,$139$0,tempRet0)|0;$141$0=_bitshift64Ashr($140$0|0,tempRet0|0,$120$0|0)|0;$141$1=tempRet0;$143=$_hom+12|0;HEAP32[$143>>2]=$141$0;HEAP32[$_hom+60>>2]=$_y0;$147=$_hom+16|0;HEAP32[$147>>2]=$114+$13>>$112;$150=$_hom+20|0;HEAP32[$150>>2]=$114+$16>>$112;if(($112|0)>14){label=2;break}else{label=3;break};case 2:$161=($113>>15)+$19>>-14-$111;label=4;break;case 3:$161=$19<<$111+14;label=4;break;case 4:HEAP32[$_hom+48>>2]=$161;$204=_qr_ilog((($1|0)>-1?$1:-$1|0)-((($1|0)>-1?$1:-$1|0)-(($2|0)>-1?$2:-$2|0)&-(((($2|0)>-1?$2:-$2|0)|0)>((($1|0)>-1?$1:-$1|0)|0)&1))-((($1|0)>-1?$1:-$1|0)-(($3|0)>-1?$3:-$3|0)-((($1|0)>-1?$1:-$1|0)-(($2|0)>-1?$2:-$2|0)&-(((($2|0)>-1?$2:-$2|0)|0)>((($1|0)>-1?$1:-$1|0)|0)&1))&-(((($3|0)>-1?$3:-$3|0)|0)>((($1|0)>-1?$1:-$1|0)-((($1|0)>-1?$1:-$1|0)-(($2|0)>-1?$2:-$2|0)&-(((($2|0)>-1?$2:-$2|0)|0)>((($1|0)>-1?$1:-$1|0)|0)&1))|0)&1))|0)|0;$205=HEAP32[$123>>2]|0;$208=HEAP32[$137>>2]|0;$212=HEAP32[$123>>2]|0;$220=(_qr_ilog((($205|0)>-1?$205:-$205|0)-((($205|0)>-1?$205:-$205|0)-(($208|0)>-1?$208:-$208|0)&-(((($208|0)>-1?$208:-$208|0)|0)>((($212|0)>-1?$212:-$212|0)|0)&1))|0)|0)+$204|0;$262=_qr_ilog((($6|0)>-1?$6:-$6|0)-((($6|0)>-1?$6:-$6|0)-(($7|0)>-1?$7:-$7|0)&-(((($7|0)>-1?$7:-$7|0)|0)>((($6|0)>-1?$6:-$6|0)|0)&1))-((($6|0)>-1?$6:-$6|0)-(($8|0)>-1?$8:-$8|0)-((($6|0)>-1?$6:-$6|0)-(($7|0)>-1?$7:-$7|0)&-(((($7|0)>-1?$7:-$7|0)|0)>((($6|0)>-1?$6:-$6|0)|0)&1))&-(((($8|0)>-1?$8:-$8|0)|0)>((($6|0)>-1?$6:-$6|0)-((($6|0)>-1?$6:-$6|0)-(($7|0)>-1?$7:-$7|0)&-(((($7|0)>-1?$7:-$7|0)|0)>((($6|0)>-1?$6:-$6|0)|0)&1))|0)&1))|0)|0;$263=HEAP32[$130>>2]|0;$266=HEAP32[$143>>2]|0;$270=HEAP32[$130>>2]|0;$278=(_qr_ilog((($263|0)>-1?$263:-$263|0)-((($263|0)>-1?$263:-$263|0)-(($266|0)>-1?$266:-$266|0)&-(((($266|0)>-1?$266:-$266|0)|0)>((($270|0)>-1?$270:-$270|0)|0)&1))|0)|0)+$262|0;$288=(_qr_ilog(($19|0)>-1?$19:-$19|0)|0)+$111+($220-($220-$278&-(($278|0)>($220|0)&1)))|0;$294=29-$288&-(($288-29|0)>0&1);$295=-$294|0;$297=1<<$295>>1;$299=$114<<$295;$300=HEAP32[$143>>2]|0;$302$0=$19;$302$1=($19|0)<0?-1:0;$303$0=___muldi3($300,($300|0)<0?-1:0,$302$0,$302$1)|0;$304$0=$299;$304$1=($299|0)<0?-1:0;$305$0=_i64Add($304$0,$304$1,$303$0,tempRet0)|0;$306$0=-($111+$294|0)|0;$307$0=_bitshift64Ashr($305$0|0,tempRet0|0,$306$0|0)|0;$307$1=tempRet0;HEAP32[$_hom+24>>2]=$307$0;$311=-(HEAP32[$130>>2]|0)|0;$313$0=___muldi3($311,($311|0)<0?-1:0,$302$0,$302$1)|0;$314$0=_i64Add($304$0,$304$1,$313$0,tempRet0)|0;$315$0=_bitshift64Ashr($314$0|0,tempRet0|0,$306$0|0)|0;$315$1=tempRet0;HEAP32[$_hom+28>>2]=$315$0;$319=-(HEAP32[$137>>2]|0)|0;$321$0=___muldi3($319,($319|0)<0?-1:0,$302$0,$302$1)|0;$322$0=_i64Add($304$0,$304$1,$321$0,tempRet0)|0;$323$0=_bitshift64Ashr($322$0|0,tempRet0|0,$306$0|0)|0;$323$1=tempRet0;HEAP32[$_hom+32>>2]=$323$0;$326=HEAP32[$123>>2]|0;$328$0=___muldi3($326,($326|0)<0?-1:0,$302$0,$302$1)|0;$329$0=_i64Add($304$0,$304$1,$328$0,tempRet0)|0;$330$0=_bitshift64Ashr($329$0|0,tempRet0|0,$306$0|0)|0;$330$1=tempRet0;HEAP32[$_hom+36>>2]=$330$0;$333=HEAP32[$137>>2]|0;$335=HEAP32[$150>>2]|0;$337$0=___muldi3($335,($335|0)<0?-1:0,$333,($333|0)<0?-1:0)|0;$337$1=tempRet0;$338=HEAP32[$143>>2]|0;$340=HEAP32[$147>>2]|0;$342$0=___muldi3($340,($340|0)<0?-1:0,$338,($338|0)<0?-1:0)|0;$343$0=$297;$343$1=($297|0)<0?-1:0;$_neg160$0=_i64Subtract($337$0,$337$1,$342$0,tempRet0)|0;$344$0=_i64Subtract($_neg160$0,tempRet0,$343$0,$343$1)|0;$345$0=$295;$346$0=_bitshift64Ashr($344$0|0,tempRet0|0,$345$0|0)|0;$346$1=tempRet0;HEAP32[$_hom+40>>2]=$346$0;$349=HEAP32[$130>>2]|0;$351=HEAP32[$147>>2]|0;$353$0=___muldi3($351,($351|0)<0?-1:0,$349,($349|0)<0?-1:0)|0;$353$1=tempRet0;$354=HEAP32[$123>>2]|0;$356=HEAP32[$150>>2]|0;$358$0=___muldi3($356,($356|0)<0?-1:0,$354,($354|0)<0?-1:0)|0;$358$1=tempRet0;$_neg162$0=_i64Subtract($353$0,$353$1,$343$0,$343$1)|0;$359$0=_i64Subtract($_neg162$0,tempRet0,$358$0,$358$1)|0;$360$0=_bitshift64Ashr($359$0|0,tempRet0|0,$345$0|0)|0;$360$1=tempRet0;HEAP32[$_hom+44>>2]=$360$0;$363=HEAP32[$123>>2]|0;$365=HEAP32[$143>>2]|0;$367$0=___muldi3($365,($365|0)<0?-1:0,$363,($363|0)<0?-1:0)|0;$367$1=tempRet0;$368=HEAP32[$130>>2]|0;$370=HEAP32[$137>>2]|0;$372$0=___muldi3($370,($370|0)<0?-1:0,$368,($368|0)<0?-1:0)|0;$372$1=tempRet0;$_neg164$0=_i64Subtract($367$0,$367$1,$343$0,$343$1)|0;$373$0=_i64Subtract($_neg164$0,tempRet0,$372$0,$372$1)|0;$374$0=_bitshift64Ashr($373$0|0,tempRet0|0,$345$0|0)|0;$374$1=tempRet0;HEAP32[$_hom+52>>2]=$374$0;HEAP32[$_hom+64>>2]=14;return}}function _qr_line_fit($_l,$_x0,$_y0,$_sxx,$_sxy,$_syy,$_res){$_l=$_l|0;$_x0=$_x0|0;$_y0=$_y0|0;$_sxx=$_sxx|0;$_sxy=$_sxy|0;$_syy=$_syy|0;$_res=$_res|0;var $1=0,$2=0,$4=0,$5=0,$6=0,$9=0,$17=0,$18=0,$21=0,$35=0,$37=0,$55=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$_sxx-$_syy|0;$2=($1|0)>-1?$1:-$1|0;$4=-$_sxy<<1;$5=_qr_ihypot($2,$4)|0;$6=_qr_ilog($2)|0;$9=$6-(_qr_ilog(($4|0)>-1?$4:-$4|0)|0)|0;$17=$_res+1>>1;$18=$17-1-$6+($9&-((_qr_ilog(($4|0)>-1?$4:-$4|0)|0)>($6|0)&1))|0;$21=$6-(_qr_ilog(($4|0)>-1?$4:-$4|0)|0)|0;$35=-($18&-((1-$17+$6-($21&-((_qr_ilog(($4|0)>-1?$4:-$4|0)|0)>($6|0)&1))|0)>0&1))|0;$37=1<<$35>>1;if(($_sxx|0)>($_syy|0)){label=2;break}else{label=3;break};case 2:HEAP32[$_l>>2]=$37+$4>>$35;HEAP32[$_l+4>>2]=$5+$2+$37>>$35;label=4;break;case 3:HEAP32[$_l>>2]=$5+$2+$37>>$35;HEAP32[$_l+4>>2]=$37+$4>>$35;label=4;break;case 4:$55=Math_imul(HEAP32[$_l>>2]|0,$_x0)|0;HEAP32[$_l+8>>2]=-($55+(Math_imul(HEAP32[$_l+4>>2]|0,$_y0)|0)|0);return}}function _qr_line_orient($_l,$_x,$_y){$_l=$_l|0;$_x=$_x|0;$_y=$_y|0;var $6=0,$9=0,label=0;label=1;while(1)switch(label|0){case 1:if((_qr_line_eval($_l,$_x,$_y)|0)<0){label=2;break}else{label=3;break};case 2:HEAP32[$_l>>2]=-(HEAP32[$_l>>2]|0);$6=$_l+4|0;HEAP32[$6>>2]=-(HEAP32[$6>>2]|0);$9=$_l+8|0;HEAP32[$9>>2]=-(HEAP32[$9>>2]|0);label=3;break;case 3:return}}function _enc_list_mtf($_enc_list,$_enc){$_enc_list=$_enc_list|0;$_enc=$_enc|0;var $i_0=0,$_in=0,$9=0,label=0;label=1;while(1)switch(label|0){case 1:$i_0=0;label=2;break;case 2:if(($i_0|0)<3){label=3;break}else{label=7;break};case 3:if((HEAP32[$_enc_list+($i_0<<2)>>2]|0)==($_enc|0)){label=4;break}else{$i_0=$i_0+1|0;label=2;break};case 4:if(($i_0|0)>0){$_in=$i_0;label=5;break}else{label=6;break};case 5:$9=$_in-1|0;HEAP32[$_enc_list+($_in<<2)>>2]=HEAP32[$_enc_list+($9<<2)>>2];if(($9|0)>0){$_in=$9;label=5;break}else{label=6;break};case 6:HEAP32[$_enc_list>>2]=$_enc;label=7;break;case 7:return}}function _text_is_ascii($_text,$_len){$_text=$_text|0;$_len=$_len|0;var $i_0=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$i_0=0;label=2;break;case 2:if(($i_0|0)<($_len|0)){label=3;break}else{$_0=1;label=4;break};case 3:if((HEAP8[$_text+$i_0|0]|0)<0){$_0=0;label=4;break}else{$i_0=$i_0+1|0;label=2;break};case 4:return $_0|0}return 0}function _text_is_latin1($_text,$_len){$_text=$_text|0;$_len=$_len|0;var $i_0=0,$5=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$i_0=0;label=2;break;case 2:if(($i_0|0)<($_len|0)){label=3;break}else{$_0=1;label=4;break};case 3:$5=HEAP8[$_text+$i_0|0]|0;if($5<<24>>24<0&($5&255)<160){$_0=0;label=4;break}else{$i_0=$i_0+1|0;label=2;break};case 4:return $_0|0}return 0}function _sym_add_point444($sym,$x,$y){$sym=$sym|0;$x=$x|0;$y=$y|0;var $1=0,$2=0,$3=0,$4=0,$5=0,$8=0,$10=0,$11=0,$16=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$sym+20|0;$2=HEAP32[$1>>2]|0;$3=$2+1|0;HEAP32[$1>>2]=$3;$4=$sym+16|0;$5=HEAP32[$4>>2]|0;if($3>>>0<$5>>>0){label=3;break}else{label=2;break};case 2:$8=$sym+24|0;$10=HEAP32[$8>>2]|0;$11=$5+1|0;HEAP32[$4>>2]=$11;HEAP32[$8>>2]=_realloc($10,$11<<3)|0;label=3;break;case 3:$16=$sym+24|0;HEAP32[(HEAP32[$16>>2]|0)+($2<<3)>>2]=$x;HEAP32[(HEAP32[$16>>2]|0)+($2<<3)+4>>2]=$y;return}}function __zbar_symbol_refcnt445($sym){$sym=$sym|0;__zbar_refcnt446($sym+28|0)|0;return}function _qr_code_data_list_extract_text($_qrlist,$iscn,$img){$_qrlist=$_qrlist|0;$iscn=$iscn|0;$img=$img|0;var $enc_list=0,$sa=0,$syms=0,$inleft=0,$outleft=0,$in=0,$out=0,$buf=0,$2=0,$4=0,$7=0,$8=0,$9=0,$10=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$i_0386=0,$27=0,$31=0,$j_1286=0,$36=0,$51=0,$56=0,$sa_size_0408=0,$j_2297=0,$fnc1_0296=0,$sa_ctext_0295=0,$61=0,$63=0,$67=0,$68=0,$k_0291=0,$fnc1_1290=0,$sa_ctext_1289=0,$70=0,$71=0,$shift_0=0,$shift_1=0,$75=0,$sa_ctext_2=0,$fnc1_2=0,$85=0,$sa_ctext_3=0,$fnc1_3=0,$87=0,$sa_size_0409=0,$fnc1_0_lcssa=0,$sa_ctext_0_lcssa=0,$89=0,$90=0,$92=0,$93=0,$94=0,$95=0,$96=0,$98=0,$sym_0350=0,$j_3349=0,$err_0348=0,$eci_0347=0,$sa_ntext_0346=0,$eci_cd_0344=0,$99=0,$j_4_in=0,$j_4=0,$114=0,$119=0,$sa_ntext_1=0,$j_5=0,$sym_1=0,$123=0,$144=0,$k_1329=0,$err_1328=0,$eci_1325=0,$sa_ntext_2324=0,$eci_cd_1321=0,$150=0,$152=0,$155=0,$156=0,$169=0,$171=0,$173=0,$174=0,$sa_ntext_3317=0,$177=0,$179=0,$183=0,$187=0,$p_0=0,$plen_0=0,$c_0=0,$192=0,$195=0,$196=0,$197=0,$sa_ntext_4_ph=0,$200=0,$208=0,$210=0,$212=0,$213=0,$219=0,$236=0,$237=0,$241=0,$242=0,$ei_0312=0,$err_3311=0,$251=0,$252=0,$ej_0303=0,$ej_0305=0,$ej_0_in304=0,$ej_0=0,$270=0,$271=0,$275=0,$err_4=0,$281=0,$287=0,$288=0,$302=0,$303=0,$311=0,$enc_0=0,$eci_cd_2=0,$sa_ntext_5=0,$eci_2=0,$err_5=0,$328=0,$err_1_lcssa=0,$eci_1_lcssa=0,$sa_ntext_2_lcssa=0,$eci_cd_1_lcssa=0,$eci_3=0,$338=0,$342=0,$343=0,$sa_ntext_0340=0,$eci_cd_0338=0,$sa_size_0410417421=0,$sa_ntext_0340418420=0,$348=0,$sa_text_0=0,$357=0,$358=0,$syms_0_load268_pr=0,$ymax_0378=0,$ymin_0377=0,$xmax_0376=0,$xmin_0375=0,$syms_0_load268374=0,$syms_0_load270358=0,$syms_0_load270=0,$373=0,$syms_0_load270364=0,$ymax_1363=0,$ymin_1362=0,$xmax_1361=0,$xmin_1360=0,$j_6359=0,$377=0,$379=0,$xmin_2=0,$xmax_1_=0,$385=0,$ymin_2=0,$ymax_1_=0,$390=0,$xmin_3=0,$xmax_3=0,$ymin_3=0,$ymax_3=0,$syms_0_load272=0,$397=0,$403=0,$404=0,$405=0,$412=0,$sa_sym_0=0,$421=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+80|0;label=1;while(1)switch(label|0){case 1:$enc_list=__stackBase__|0;$sa=__stackBase__+16|0;$syms=STACKTOP;STACKTOP=STACKTOP+4|0;STACKTOP=STACKTOP+7>>3<<3;$inleft=STACKTOP;STACKTOP=STACKTOP+4|0;STACKTOP=STACKTOP+7>>3<<3;$outleft=STACKTOP;STACKTOP=STACKTOP+4|0;STACKTOP=STACKTOP+7>>3<<3;$in=STACKTOP;STACKTOP=STACKTOP+4|0;STACKTOP=STACKTOP+7>>3<<3;$out=STACKTOP;STACKTOP=STACKTOP+4|0;STACKTOP=STACKTOP+7>>3<<3;$buf=STACKTOP;STACKTOP=STACKTOP+16|0;$2=HEAP32[$_qrlist>>2]|0;$4=HEAP32[$_qrlist+4>>2]|0;_malloc($4<<2)|0;$7=_calloc($4,1)|0;$8=_iconv_open(3816,6792)|0;$9=_iconv_open(3816,4848)|0;$10=_iconv_open(3816,3816)|0;if(($4|0)>0){label=2;break}else{label=107;break};case 2:$13=$enc_list|0;$14=$enc_list+4|0;$15=$enc_list+8|0;$16=$img+4|0;$17=$img+8|0;$18=($10|0)==-1;$19=($9|0)==-1;$20=$buf|0;$i_0386=0;label=3;break;case 3:if((HEAP8[$7+$i_0386|0]|0)==0){label=4;break}else{label=106;break};case 4:$27=HEAP8[$2+($i_0386*48&-1)+11|0]|0;if($27<<24>>24==0){label=12;break}else{label=5;break};case 5:$31=HEAP8[$2+($i_0386*48&-1)+12|0]|0;_memset($sa|0,-1|0,(($27&255)>1?($27&255)<<2:4)|0);$j_1286=$i_0386;label=6;break;case 6:$36=$7+$j_1286|0;if((HEAP8[$36]|0)==0){label=7;break}else{label=11;break};case 7:if((HEAP8[$2+($j_1286*48&-1)+11|0]|0)==$27<<24>>24){label=8;break}else{label=11;break};case 8:if((HEAP8[$2+($j_1286*48&-1)+12|0]|0)==$31<<24>>24){label=9;break}else{label=11;break};case 9:$51=$sa+(HEAPU8[$2+($j_1286*48&-1)+10|0]<<2)|0;if((HEAP32[$51>>2]|0)<0){label=10;break}else{label=11;break};case 10:HEAP32[$51>>2]=$j_1286;HEAP8[$36]=1;label=11;break;case 11:$56=$j_1286+1|0;if(($56|0)<($4|0)){$j_1286=$56;label=6;break}else{label=13;break};case 12:HEAP32[$sa>>2]=$i_0386;$sa_size_0408=1;label=14;break;case 13:if($27<<24>>24==0){$sa_ctext_0_lcssa=0;$fnc1_0_lcssa=0;$sa_size_0409=0;label=25;break}else{$sa_size_0408=$27&255;label=14;break};case 14:$sa_ctext_0295=0;$fnc1_0296=0;$j_2297=0;label=15;break;case 15:$61=HEAP32[$sa+($j_2297<<2)>>2]|0;if(($61|0)>-1){label=16;break}else{$fnc1_3=$fnc1_0296;$sa_ctext_3=$sa_ctext_0295;label=24;break};case 16:$63=$2+($61*48&-1)+4|0;if((HEAP32[$63>>2]|0)>0){label=17;break}else{$fnc1_3=$fnc1_0296;$sa_ctext_3=$sa_ctext_0295;label=24;break};case 17:$67=HEAP32[$2+($61*48&-1)>>2]|0;$68=HEAP32[$63>>2]|0;$sa_ctext_1289=$sa_ctext_0295;$fnc1_1290=$fnc1_0296;$k_0291=0;label=18;break;case 18:$70=$67+($k_0291*12&-1)|0;$71=HEAP32[$70>>2]|0;if(($71|0)==8){label=19;break}else if(($71|0)==4){$shift_0=1;label=20;break}else if(($71|0)==5|($71|0)==9){$fnc1_2=1;$sa_ctext_2=$sa_ctext_1289;label=23;break}else{$shift_1=0;label=21;break};case 19:$shift_0=2;label=20;break;case 20:$shift_1=$shift_0;label=21;break;case 21:$75=HEAP32[$70>>2]|0;if(($75-1&$75|0)==0){label=22;break}else{$fnc1_2=$fnc1_1290;$sa_ctext_2=$sa_ctext_1289;label=23;break};case 22:$fnc1_2=$fnc1_1290;$sa_ctext_2=(HEAP32[$67+($k_0291*12&-1)+8>>2]<<$shift_1)+$sa_ctext_1289|0;label=23;break;case 23:$85=$k_0291+1|0;if(($85|0)<($68|0)){$sa_ctext_1289=$sa_ctext_2;$fnc1_1290=$fnc1_2;$k_0291=$85;label=18;break}else{$fnc1_3=$fnc1_2;$sa_ctext_3=$sa_ctext_2;label=24;break};case 24:$87=$j_2297+1|0;if(($87|0)<($sa_size_0408|0)){$sa_ctext_0295=$sa_ctext_3;$fnc1_0296=$fnc1_3;$j_2297=$87;label=15;break}else{$sa_ctext_0_lcssa=$sa_ctext_3;$fnc1_0_lcssa=$fnc1_3;$sa_size_0409=$sa_size_0408;label=25;break};case 25:$89=$sa_ctext_0_lcssa+1|0;$90=_malloc($89)|0;HEAP32[$13>>2]=$9;HEAP32[$14>>2]=$8;HEAP32[$15>>2]=$10;HEAP32[$syms>>2]=0;if(($sa_size_0409|0)==0){$sa_ntext_0340418420=0;$sa_size_0410417421=0;label=86;break}else{label=26;break};case 26:$92=($fnc1_0_lcssa|0)==0;$93=$90;$94=$90;$95=$90;$96=$90;$eci_cd_0344=-1;$sa_ntext_0346=0;$eci_0347=-1;$err_0348=0;$j_3349=0;$sym_0350=$syms;$98=1;label=27;break;case 27:$99=__zbar_image_scanner_alloc_sym($iscn,64,0)|0;HEAP32[$sym_0350>>2]=$99;HEAP32[$99+8>>2]=$sa_ntext_0346;if((HEAP32[$sa+($j_3349<<2)>>2]|0)<0){label=28;break}else{$sym_1=$sym_0350;$j_5=$j_3349;$sa_ntext_1=$sa_ntext_0346;label=32;break};case 28:HEAP32[HEAP32[$sym_0350>>2]>>2]=1;$j_4_in=$j_3349;label=29;break;case 29:$j_4=$j_4_in+1|0;if(($j_4|0)<($sa_size_0409|0)){label=30;break}else{$eci_cd_0338=$eci_cd_0344;$sa_ntext_0340=$sa_ntext_0346;$343=$98;label=83;break};case 30:if((HEAP32[$sa+($j_4<<2)>>2]|0)<0){$j_4_in=$j_4;label=29;break}else{label=31;break};case 31:$114=$sa_ntext_0346+1|0;HEAP8[$90+$sa_ntext_0346|0]=0;HEAP32[(HEAP32[$sym_0350>>2]|0)+8>>2]=$114;$119=(HEAP32[$sym_0350>>2]|0)+32|0;HEAP32[$119>>2]=__zbar_image_scanner_alloc_sym($iscn,64,0)|0;$sym_1=$119;$j_5=$j_4;$sa_ntext_1=$114;label=32;break;case 32:$123=HEAP32[$sa+($j_5<<2)>>2]|0;_sym_add_point444(HEAP32[$sym_1>>2]|0,HEAP32[$2+($123*48&-1)+16>>2]|0,HEAP32[$2+($123*48&-1)+20>>2]|0);_sym_add_point444(HEAP32[$sym_1>>2]|0,HEAP32[$2+($123*48&-1)+32>>2]|0,HEAP32[$2+($123*48&-1)+36>>2]|0);_sym_add_point444(HEAP32[$sym_1>>2]|0,HEAP32[$2+($123*48&-1)+40>>2]|0,HEAP32[$2+($123*48&-1)+44>>2]|0);_sym_add_point444(HEAP32[$sym_1>>2]|0,HEAP32[$2+($123*48&-1)+24>>2]|0,HEAP32[$2+($123*48&-1)+28>>2]|0);$144=$2+($123*48&-1)+4|0;if((HEAP32[$144>>2]|0)>0&($err_0348|0)==0){label=33;break}else{$eci_cd_1_lcssa=$eci_cd_0344;$sa_ntext_2_lcssa=$sa_ntext_1;$eci_1_lcssa=$eci_0347;$err_1_lcssa=$err_0348;label=79;break};case 33:$eci_cd_1321=$eci_cd_0344;$sa_ntext_2324=$sa_ntext_1;$eci_1325=$eci_0347;$err_1328=$err_0348;$k_1329=0;label=34;break;case 34:$150=HEAP32[$2+($123*48&-1)>>2]|0;$152=HEAP32[$150+($k_1329*12&-1)>>2]|0;if(($152|0)==1){label=35;break}else if(($152|0)==2){label=37;break}else if(($152|0)==4){label=46;break}else if(($152|0)==8){label=70;break}else if(($152|0)==7){label=73;break}else{$err_5=$err_1328;$eci_2=$eci_1325;$sa_ntext_5=$sa_ntext_2324;$eci_cd_2=$eci_cd_1321;label=78;break};case 35:$155=$150+($k_1329*12&-1)+8|0;$156=HEAP32[$155>>2]|0;if(($sa_ctext_0_lcssa-$sa_ntext_2324|0)>>>0<$156>>>0){$eci_cd_1_lcssa=$eci_cd_1321;$sa_ntext_2_lcssa=$sa_ntext_2324;$eci_1_lcssa=$eci_1325;$err_1_lcssa=1;label=79;break}else{label=36;break};case 36:_memcpy($90+$sa_ntext_2324|0,HEAP32[$150+($k_1329*12&-1)+4>>2]|0,$156)|0;$err_5=$err_1328;$eci_2=$eci_1325;$sa_ntext_5=(HEAP32[$155>>2]|0)+$sa_ntext_2324|0;$eci_cd_2=$eci_cd_1321;label=78;break;case 37:HEAP32[$in>>2]=HEAP32[$150+($k_1329*12&-1)+4>>2];HEAP32[$inleft>>2]=HEAP32[$150+($k_1329*12&-1)+8>>2];if($92){$sa_ntext_4_ph=$sa_ntext_2324;label=44;break}else{label=38;break};case 38:$169=HEAP32[$in>>2]|0;$171=_memchr($169|0,37,HEAP32[$inleft>>2]|0)|0;if(($171|0)==0){$sa_ntext_4_ph=$sa_ntext_2324;label=44;break}else{$sa_ntext_3317=$sa_ntext_2324;$174=$169;$173=$171;label=39;break};case 39:$177=$173-$174|0;$179=$177+1|0;if(($sa_ctext_0_lcssa-$sa_ntext_3317|0)>>>0<$179>>>0){$eci_cd_1_lcssa=$eci_cd_1321;$sa_ntext_2_lcssa=$sa_ntext_3317;$eci_1_lcssa=$eci_1325;$err_1_lcssa=1;label=79;break}else{label=40;break};case 40:_memcpy($90+$sa_ntext_3317|0,$174|0,$177)|0;$183=$177+$sa_ntext_3317|0;if($179>>>0<(HEAP32[$inleft>>2]|0)>>>0){label=41;break}else{label=42;break};case 41:$187=$173+1|0;if((HEAP8[$187]|0)==37){$c_0=37;$plen_0=$179;$p_0=$187;label=43;break}else{label=42;break};case 42:$c_0=29;$plen_0=$177;$p_0=$173;label=43;break;case 43:$192=$183+1|0;HEAP8[$90+$183|0]=$c_0;$195=(HEAP32[$inleft>>2]|0)+($plen_0^-1)|0;HEAP32[$inleft>>2]=$195;$196=$p_0+1|0;HEAP32[$in>>2]=$196;$197=_memchr($196|0,37,$195|0)|0;if(($197|0)==0){$sa_ntext_4_ph=$192;label=44;break}else{$sa_ntext_3317=$192;$174=$196;$173=$197;label=39;break};case 44:$200=HEAP32[$inleft>>2]|0;if(($sa_ctext_0_lcssa-$sa_ntext_4_ph|0)>>>0<$200>>>0){$eci_cd_1_lcssa=$eci_cd_1321;$sa_ntext_2_lcssa=$sa_ntext_4_ph;$eci_1_lcssa=$eci_1325;$err_1_lcssa=1;label=79;break}else{label=45;break};case 45:_memcpy($90+$sa_ntext_4_ph|0,HEAP32[$in>>2]|0,$200)|0;$err_5=$err_1328;$eci_2=$eci_1325;$sa_ntext_5=(HEAP32[$inleft>>2]|0)+$sa_ntext_4_ph|0;$eci_cd_2=$eci_cd_1321;label=78;break;case 46:$208=$150+($k_1329*12&-1)+4|0;HEAP32[$in>>2]=HEAP32[$208>>2];$210=$150+($k_1329*12&-1)+8|0;HEAP32[$inleft>>2]=HEAP32[$210>>2];$212=$90+$sa_ntext_2324|0;HEAP32[$out>>2]=$212;$213=$sa_ctext_0_lcssa-$sa_ntext_2324|0;HEAP32[$outleft>>2]=$213;if(($eci_1325|0)<0){label=47;break}else{label=67;break};case 47:if((HEAP32[$inleft>>2]|0)>>>0>2){label=48;break}else{label=55;break};case 48:$219=HEAP32[$in>>2]|0;if((HEAP8[$219]|0)==-17){label=49;break}else{label=55;break};case 49:if((HEAP8[$219+1|0]|0)==-69){label=50;break}else{label=55;break};case 50:if((HEAP8[$219+2|0]|0)==-65){label=51;break}else{label=55;break};case 51:HEAP32[$in>>2]=$219+3;HEAP32[$inleft>>2]=(HEAP32[$inleft>>2]|0)-3;if($18){$242=1;label=54;break}else{label=52;break};case 52:$236=(_iconv($10|0,$in|0,$inleft|0,$out|0,$outleft|0)|0)==-1;$237=$236&1;if($236){$242=$237;label=54;break}else{label=53;break};case 53:$241=(HEAP32[$out>>2]|0)-$93|0;_enc_list_mtf($13,$10);$err_5=$237;$eci_2=$eci_1325;$sa_ntext_5=$241;$eci_cd_2=$eci_cd_1321;label=78;break;case 54:HEAP32[$in>>2]=HEAP32[$208>>2];HEAP32[$inleft>>2]=HEAP32[$210>>2];HEAP32[$out>>2]=$212;HEAP32[$outleft>>2]=$213;$err_3311=$242;$ei_0312=0;label=57;break;case 55:if((_text_is_ascii(HEAP32[$in>>2]|0,HEAP32[$inleft>>2]|0)|0)==0){$err_3311=$err_1328;$ei_0312=0;label=57;break}else{label=56;break};case 56:_enc_list_mtf($13,$10);$err_3311=$err_1328;$ei_0312=0;label=57;break;case 57:$251=$enc_list+($ei_0312<<2)|0;$252=HEAP32[$251>>2]|0;if(($252|0)==-1){$err_4=$err_3311;label=66;break}else{label=58;break};case 58:if(($ei_0312|0)<2&($252|0)==($8|0)){label=59;break}else{label=63;break};case 59:if((_text_is_latin1(HEAP32[$in>>2]|0,HEAP32[$inleft>>2]|0)|0)==0){label=60;break}else{label=63;break};case 60:$ej_0303=$ei_0312+1|0;if(($ej_0303|0)<3){$ej_0_in304=$ei_0312;$ej_0305=$ej_0303;label=61;break}else{label=62;break};case 61:HEAP32[$enc_list+($ej_0_in304<<2)>>2]=HEAP32[$enc_list+($ej_0305<<2)>>2];$ej_0=$ej_0305+1|0;if(($ej_0|0)<3){$ej_0_in304=$ej_0305;$ej_0305=$ej_0;label=61;break}else{label=62;break};case 62:HEAP32[$15>>2]=$8;label=63;break;case 63:$270=(_iconv(HEAP32[$251>>2]|0,$in|0,$inleft|0,$out|0,$outleft|0)|0)==-1;$271=$270&1;if($270){label=65;break}else{label=64;break};case 64:$275=(HEAP32[$out>>2]|0)-$94|0;_enc_list_mtf($13,HEAP32[$251>>2]|0);$err_5=$271;$eci_2=$eci_1325;$sa_ntext_5=$275;$eci_cd_2=$eci_cd_1321;label=78;break;case 65:HEAP32[$in>>2]=HEAP32[$208>>2];HEAP32[$inleft>>2]=HEAP32[$210>>2];HEAP32[$out>>2]=$212;HEAP32[$outleft>>2]=$213;$err_4=$271;label=66;break;case 66:$281=$ei_0312+1|0;if(($281|0)<3){$err_3311=$err_4;$ei_0312=$281;label=57;break}else{$err_5=$err_4;$eci_2=$eci_1325;$sa_ntext_5=$sa_ntext_2324;$eci_cd_2=$eci_cd_1321;label=78;break};case 67:if(($eci_cd_1321|0)==-1){$eci_cd_1_lcssa=-1;$sa_ntext_2_lcssa=$sa_ntext_2324;$eci_1_lcssa=$eci_1325;$err_1_lcssa=1;label=79;break}else{label=68;break};case 68:$287=(_iconv($eci_cd_1321|0,$in|0,$inleft|0,$out|0,$outleft|0)|0)==-1;$288=$287&1;if($287){$err_5=$288;$eci_2=$eci_1325;$sa_ntext_5=$sa_ntext_2324;$eci_cd_2=$eci_cd_1321;label=78;break}else{label=69;break};case 69:$err_5=$288;$eci_2=$eci_1325;$sa_ntext_5=(HEAP32[$out>>2]|0)-$95|0;$eci_cd_2=$eci_cd_1321;label=78;break;case 70:HEAP32[$in>>2]=HEAP32[$150+($k_1329*12&-1)+4>>2];HEAP32[$inleft>>2]=HEAP32[$150+($k_1329*12&-1)+8>>2];HEAP32[$out>>2]=$90+$sa_ntext_2324;HEAP32[$outleft>>2]=$sa_ctext_0_lcssa-$sa_ntext_2324;if($19){$eci_cd_1_lcssa=$eci_cd_1321;$sa_ntext_2_lcssa=$sa_ntext_2324;$eci_1_lcssa=$eci_1325;$err_1_lcssa=1;label=79;break}else{label=71;break};case 71:$302=(_iconv($9|0,$in|0,$inleft|0,$out|0,$outleft|0)|0)==-1;$303=$302&1;if($302){$err_5=$303;$eci_2=$eci_1325;$sa_ntext_5=$sa_ntext_2324;$eci_cd_2=$eci_cd_1321;label=78;break}else{label=72;break};case 72:$err_5=$303;$eci_2=$eci_1325;$sa_ntext_5=(HEAP32[$out>>2]|0)-$96|0;$eci_cd_2=$eci_cd_1321;label=78;break;case 73:$311=HEAP32[$150+($k_1329*12&-1)+4>>2]|0;if($311>>>0<19&($311|0)!=14){label=74;break}else{label=76;break};case 74:if(($311|0)==2|($311|0)==0){$enc_0=3728;label=77;break}else{label=75;break};case 75:_sprintf($20|0,4200,(tempInt=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempInt>>2]=$311-2-($311-3&-($311>>>0<3&1)),tempInt)|0)|0;$enc_0=$20;label=77;break;case 76:if(($311|0)==20){$enc_0=4848;label=77;break}else{$err_5=$err_1328;$eci_2=$eci_1325;$sa_ntext_5=$sa_ntext_2324;$eci_cd_2=$eci_cd_1321;label=78;break};case 77:$err_5=$err_1328;$eci_2=$311;$sa_ntext_5=$sa_ntext_2324;$eci_cd_2=_iconv_open(3816,$enc_0|0)|0;label=78;break;case 78:$328=$k_1329+1|0;if(($328|0)<(HEAP32[$144>>2]|0)&($err_5|0)==0){$eci_cd_1321=$eci_cd_2;$sa_ntext_2324=$sa_ntext_5;$eci_1325=$eci_2;$err_1328=$err_5;$k_1329=$328;label=34;break}else{$eci_cd_1_lcssa=$eci_cd_2;$sa_ntext_2_lcssa=$sa_ntext_5;$eci_1_lcssa=$eci_2;$err_1_lcssa=$err_5;label=79;break};case 79:if(($eci_1_lcssa|0)<2){label=80;break}else{$eci_3=$eci_1_lcssa;label=82;break};case 80:if(($eci_cd_1_lcssa|0)==-1){$eci_3=-1;label=82;break}else{label=81;break};case 81:_iconv_close($eci_cd_1_lcssa|0)|0;$eci_3=-1;label=82;break;case 82:$338=$j_5+1|0;$342=($err_1_lcssa|0)==0;if(($338|0)<($sa_size_0409|0)&$342){$eci_cd_0344=$eci_cd_1_lcssa;$sa_ntext_0346=$sa_ntext_2_lcssa;$eci_0347=$eci_3;$err_0348=$err_1_lcssa;$j_3349=$338;$sym_0350=(HEAP32[$sym_1>>2]|0)+32|0;$98=$342;label=27;break}else{$eci_cd_0338=$eci_cd_1_lcssa;$sa_ntext_0340=$sa_ntext_2_lcssa;$343=$342;label=83;break};case 83:if(($eci_cd_0338|0)==-1){label=85;break}else{label=84;break};case 84:_iconv_close($eci_cd_0338|0)|0;if($343){$sa_ntext_0340418420=$sa_ntext_0340;$sa_size_0410417421=$sa_size_0409;label=86;break}else{label=105;break};case 85:if($343){$sa_ntext_0340418420=$sa_ntext_0340;$sa_size_0410417421=$sa_size_0409;label=86;break}else{label=105;break};case 86:$348=$sa_ntext_0340418420+1|0;HEAP8[$90+$sa_ntext_0340418420|0]=0;if($89>>>0>$348>>>0){label=87;break}else{$sa_text_0=$90;label=88;break};case 87:$sa_text_0=_realloc($90,$348)|0;label=88;break;case 88:if(($sa_size_0410417421|0)==1){label=89;break}else{label=90;break};case 89:$sa_sym_0=HEAP32[$syms>>2]|0;label=104;break;case 90:$357=__zbar_image_scanner_alloc_sym($iscn,64,0)|0;$358=__zbar_symbol_set_create()|0;HEAP32[$357+36>>2]=$358;HEAP32[$358+8>>2]=HEAP32[$syms>>2];$syms_0_load268_pr=HEAP32[$syms>>2]|0;if(($syms_0_load268_pr|0)==0){$sa_sym_0=$357;label=104;break}else{label=91;break};case 91:$syms_0_load268374=$syms_0_load268_pr;$xmin_0375=HEAP32[$16>>2]|0;$xmax_0376=-2;$ymin_0377=HEAP32[$17>>2]|0;$ymax_0378=-2;label=92;break;case 92:__zbar_symbol_refcnt445($syms_0_load268374);if((HEAP32[HEAP32[$syms>>2]>>2]|0)==1){label=95;break}else{label=93;break};case 93:$syms_0_load270358=HEAP32[$syms>>2]|0;if((HEAP32[$syms_0_load270358+20>>2]|0)==0){$ymax_3=$ymax_0378;$ymin_3=$ymin_0377;$xmax_3=$xmax_0376;$xmin_3=$xmin_0375;label=97;break}else{label=94;break};case 94:$syms_0_load270=HEAP32[$syms>>2]|0;$373=HEAP32[$syms_0_load270+20>>2]|0;$j_6359=0;$xmin_1360=$xmin_0375;$xmax_1361=$xmax_0376;$ymin_1362=$ymin_0377;$ymax_1363=$ymax_0378;$syms_0_load270364=$syms_0_load270358;label=96;break;case 95:HEAP32[$357>>2]=1;$ymax_3=$ymax_0378;$ymin_3=$ymin_0377;$xmax_3=$xmax_0376;$xmin_3=$xmin_0375;label=97;break;case 96:$377=HEAP32[$syms_0_load270364+24>>2]|0;$379=HEAP32[$377+($j_6359<<3)>>2]|0;$xmin_2=($xmin_1360|0)<($379|0)?$xmin_1360:$379-1|0;$xmax_1_=($xmax_1361|0)>($379|0)?$xmax_1361:$379+1|0;$385=HEAP32[$377+($j_6359<<3)+4>>2]|0;$ymin_2=($ymin_1362|0)<($385|0)?$ymin_1362:$385-1|0;$ymax_1_=($ymax_1363|0)>($385|0)?$ymax_1363:$385+1|0;$390=$j_6359+1|0;if($390>>>0<$373>>>0){$j_6359=$390;$xmin_1360=$xmin_2;$xmax_1361=$xmax_1_;$ymin_1362=$ymin_2;$ymax_1363=$ymax_1_;$syms_0_load270364=$syms_0_load270;label=96;break}else{$ymax_3=$ymax_1_;$ymin_3=$ymin_2;$xmax_3=$xmax_1_;$xmin_3=$xmin_2;label=97;break};case 97:$syms_0_load272=HEAP32[$syms>>2]|0;HEAP32[$syms_0_load272+12>>2]=$sa_text_0+(HEAP32[$syms_0_load272+8>>2]|0);$397=HEAP32[(HEAP32[$syms>>2]|0)+32>>2]|0;if(($397|0)==0){$403=$348;label=99;break}else{label=98;break};case 98:$403=HEAP32[$397+8>>2]|0;label=99;break;case 99:$404=(HEAP32[$syms>>2]|0)+8|0;$405=HEAP32[$404>>2]|0;if($403>>>0>$405>>>0){label=101;break}else{label=100;break};case 100:___assert_func(3184,368,8872,2784);return 0;case 101:HEAP32[$404>>2]=$403-1-$405;$412=HEAP32[(HEAP32[$syms>>2]|0)+32>>2]|0;HEAP32[$syms>>2]=$412;if(($412|0)==0){label=102;break}else{$syms_0_load268374=$412;$xmin_0375=$xmin_3;$xmax_0376=$xmax_3;$ymin_0377=$ymin_3;$ymax_0378=$ymax_3;label=92;break};case 102:if(($xmax_3|0)>-2){label=103;break}else{$sa_sym_0=$357;label=104;break};case 103:_sym_add_point444($357,$xmin_3,$ymin_3);_sym_add_point444($357,$xmin_3,$ymax_3);_sym_add_point444($357,$xmax_3,$ymax_3);_sym_add_point444($357,$xmax_3,$ymin_3);$sa_sym_0=$357;label=104;break;case 104:HEAP32[$sa_sym_0+12>>2]=$sa_text_0;HEAP32[$sa_sym_0+4>>2]=$348;HEAP32[$sa_sym_0+8>>2]=$sa_ntext_0340418420;__zbar_image_scanner_add_sym($iscn,$sa_sym_0);label=106;break;case 105:__zbar_image_scanner_recycle_syms($iscn,HEAP32[$syms>>2]|0);_free($90);label=106;break;case 106:$421=$i_0386+1|0;if(($421|0)<($4|0)){$i_0386=$421;label=3;break}else{label=107;break};case 107:if(($10|0)==-1){label=109;break}else{label=108;break};case 108:_iconv_close($10|0)|0;label=109;break;case 109:if(($9|0)==-1){label=111;break}else{label=110;break};case 110:_iconv_close($9|0)|0;label=111;break;case 111:if(($8|0)==-1){label=113;break}else{label=112;break};case 112:_iconv_close($8|0)|0;label=113;break;case 113:_free($7);STACKTOP=__stackBase__;return 0}return 0}function _rs_gf256_init($_gf,$_ppoly){$_gf=$_gf|0;$_ppoly=$_ppoly|0;var $i_017=0,$p_016=0,$2=0,$12=0,$i_115=0,$19=0,label=0;label=1;while(1)switch(label|0){case 1:$p_016=1;$i_017=0;label=2;break;case 2:$2=$p_016&255;HEAP8[$i_017+255+($_gf+256)|0]=$2;HEAP8[$_gf+256+$i_017|0]=$2;$12=$i_017+1|0;if(($12|0)<256){$p_016=(-($p_016>>>7)&$_ppoly^$p_016<<1)&255;$i_017=$12;label=2;break}else{$i_115=0;label=3;break};case 3:HEAP8[$_gf+(HEAPU8[$_gf+256+$i_115|0]|0)|0]=$i_115&255;$19=$i_115+1|0;if(($19|0)<255){$i_115=$19;label=3;break}else{label=4;break};case 4:HEAP8[$_gf|0]=0;return}}function _rs_hgmul($_gf,$_a,$_logb){$_gf=$_gf|0;$_a=$_a|0;$_logb=$_logb|0;var $11=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_a|0)==0){$11=0;label=3;break}else{label=2;break};case 2:$11=HEAPU8[(HEAPU8[$_gf+$_a|0]|0)+$_logb+($_gf+256)|0]|0;label=3;break;case 3:return $11|0}return 0}function _rs_gdiv($_gf,$_a,$_b){$_gf=$_gf|0;$_a=$_a|0;$_b=$_b|0;var $15=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_a|0)==0){$15=0;label=3;break}else{label=2;break};case 2:$15=HEAPU8[(HEAPU8[$_gf+$_a|0]|0)+255-(HEAPU8[$_gf+$_b|0]|0)+($_gf+256)|0]|0;label=3;break;case 3:return $15|0}return 0}function _rs_gsqrt($_gf,$_a){$_gf=$_gf|0;$_a=$_a|0;var $5=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_a|0)==0){$_0=0;label=3;break}else{label=2;break};case 2:$5=HEAPU8[$_gf+$_a|0]|0;$_0=HEAPU8[(((-($5&1)&255)+$5|0)>>>1)+($_gf+256)|0]|0;label=3;break;case 3:return $_0|0}return 0}function _rs_gmul($_gf,$_a,$_b){$_gf=$_gf|0;$_a=$_a|0;$_b=$_b|0;var $15=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_a|0)==0|($_b|0)==0){$15=0;label=3;break}else{label=2;break};case 2:$15=HEAPU8[(HEAPU8[$_gf+$_b|0]|0)+(HEAPU8[$_gf+$_a|0]|0)+($_gf+256)|0]|0;label=3;break;case 3:return $15|0}return 0}function _rs_correct($_gf,$_m0,$_data,$_ndata,$_npar,$_erasures,$_nerasures){$_gf=$_gf|0;$_m0=$_m0|0;$_data=$_data|0;$_ndata=$_ndata|0;$_npar=$_npar|0;$_erasures=$_erasures|0;$_nerasures=$_nerasures|0;var $lambda=0,$omega=0,$epos=0,$s=0,$3=0,$i_0=0,$12=0,$14=0,$i_166=0,$32=0,$33=0,$alphanj_058=0,$j_057=0,$a_056=0,$38=0,$46=0,$a_0_lcssa=0,$54=0,$alphanj_161=0,$j_160=0,$b_059=0,$63=0,$71=0,$b_0_lcssa=0,$73=0,$75=0,$80=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+1024|0;label=1;while(1)switch(label|0){case 1:$lambda=__stackBase__|0;$omega=__stackBase__+256|0;$epos=__stackBase__+512|0;$s=__stackBase__+768|0;if(($_nerasures|0)>($_npar|0)){$_0=-1;label=16;break}else{label=2;break};case 2:$3=$s|0;_rs_calc_syndrome($_gf,$_m0,$3,$_npar,$_data,$_ndata);$i_0=0;label=3;break;case 3:if(($i_0|0)<($_npar|0)){label=4;break}else{$_0=0;label=16;break};case 4:if((HEAP8[$s+$i_0|0]|0)==0){$i_0=$i_0+1|0;label=3;break}else{label=5;break};case 5:$12=$lambda|0;$14=_rs_modified_berlekamp_massey($_gf,$12,$3,$omega|0,$_npar,$_erasures,$_nerasures,$_ndata)|0;if(($14|0)<1){$_0=-1;label=16;break}else{label=6;break};case 6:if(($14-$_nerasures|0)>($_npar-$_nerasures>>1|0)){$_0=-1;label=16;break}else{label=7;break};case 7:if((_rs_find_roots($_gf,$epos|0,$12,$14,$_ndata)|0)<($14|0)){$_0=-1;label=16;break}else{label=8;break};case 8:if(($14|0)>0){label=9;break}else{$_0=$14;label=16;break};case 9:$i_166=0;label=10;break;case 10:$32=HEAPU8[$epos+$i_166|0]|0;$33=$32^255;if(($_npar|0)>0){$a_056=0;$j_057=0;$alphanj_058=0;label=11;break}else{$a_0_lcssa=0;label=12;break};case 11:$38=(_rs_hgmul($_gf,HEAPU8[$omega+$j_057|0]|0,$alphanj_058)|0)^$a_056;$46=$j_057+1|0;if(($46|0)<($_npar|0)){$a_056=$38;$j_057=$46;$alphanj_058=HEAPU8[$_gf+(HEAPU8[$alphanj_058+$33+($_gf+256)|0]|0)|0]|0;label=11;break}else{$a_0_lcssa=$38;label=12;break};case 12:$54=HEAPU8[$_gf+(HEAPU8[($33<<1)+($_gf+256)|0]|0)|0]|0;if(($_npar|0)<1){$b_0_lcssa=0;label=15;break}else{label=13;break};case 13:$b_059=0;$j_160=1;$alphanj_161=(((Math_imul($32,$_m0)|0)>>>0)%255>>>0)+$33|0;label=14;break;case 14:$63=(_rs_hgmul($_gf,HEAPU8[$lambda+$j_160|0]|0,$alphanj_161)|0)^$b_059;$71=$j_160+2|0;if(($71|0)>($_npar|0)){$b_0_lcssa=$63;label=15;break}else{$b_059=$63;$j_160=$71;$alphanj_161=HEAPU8[$_gf+(HEAPU8[$alphanj_161+$54+($_gf+256)|0]|0)|0]|0;label=14;break};case 15:$73=_rs_gdiv($_gf,$a_0_lcssa,$b_0_lcssa)|0;$75=$_data+($_ndata-1-$32)|0;HEAP8[$75]=(HEAPU8[$75]^$73)&255;$80=$i_166+1|0;if(($80|0)<($14|0)){$i_166=$80;label=10;break}else{$_0=$14;label=16;break};case 16:STACKTOP=__stackBase__;return $_0|0}return 0}function _rs_calc_syndrome($_gf,$_m0,$_s,$_npar,$_data,$_ndata){$_gf=$_gf|0;$_m0=$_m0|0;$_s=$_s|0;$_npar=$_npar|0;$_data=$_data|0;$_ndata=$_ndata|0;var $j_016=0,$sj_015=0,$i_014=0,$13=0,$15=0,$16=0,$sj_0_lcssa_off0=0,$20=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_npar|0)>0){label=2;break}else{label=7;break};case 2:$j_016=0;label=3;break;case 3:if(($_ndata|0)>0){$i_014=0;$sj_015=0;label=4;break}else{$sj_0_lcssa_off0=0;label=6;break};case 4:$13=HEAPU8[$_data+$i_014|0]|0;$15=$13^(_rs_hgmul($_gf,$sj_015,HEAPU8[$_gf+(HEAPU8[$j_016+$_m0+($_gf+256)|0]|0)|0]|0)|0);$16=$i_014+1|0;if(($16|0)<($_ndata|0)){$i_014=$16;$sj_015=$15;label=4;break}else{label=5;break};case 5:$sj_0_lcssa_off0=$15&255;label=6;break;case 6:HEAP8[$_s+$j_016|0]=$sj_0_lcssa_off0;$20=$j_016+1|0;if(($20|0)<($_npar|0)){$j_016=$20;label=3;break}else{label=7;break};case 7:return}}function _rs_modified_berlekamp_massey($_gf,$_lambda,$_s,$_omega,$_npar,$_erasures,$_nerasures,$_ndata){$_gf=$_gf|0;$_lambda=$_lambda|0;$_s=$_s|0;$_omega=$_omega|0;$_npar=$_npar|0;$_erasures=$_erasures|0;$_nerasures=$_nerasures|0;$_ndata=$_ndata|0;var $tt=0,$1=0,$n_07381=0,$n_07385=0,$n_0_in_ph84=0,$l_0_ph83=0,$k_0_ph82=0,$n_075=0,$n_0_in74=0,$7=0,$d_064=0,$i_063=0,$16=0,$17=0,$18=0,$n_0=0,$25=0,$i_168=0,$30=0,$32=0,$33=0,$39=0,$43=0,$n_073=0,$i_265=0,$47=0,$49=0,$56=0,$l_0_ph80=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+256|0;label=1;while(1)switch(label|0){case 1:$tt=__stackBase__|0;_rs_init_lambda($_gf,$_lambda,$_npar,$_erasures,$_nerasures,$_ndata);$1=$tt|0;_rs_poly_copy($1,$_lambda,$_npar+1|0);$n_07381=$_nerasures+1|0;if(($n_07381|0)>($_npar|0)){$l_0_ph80=$_nerasures;label=14;break}else{$k_0_ph82=0;$l_0_ph83=$_nerasures;$n_0_in_ph84=$_nerasures;$n_07385=$n_07381;label=2;break};case 2:$n_0_in74=$n_0_in_ph84;$n_075=$n_07385;label=3;break;case 3:$7=$n_075-$k_0_ph82|0;_rs_poly_mul_x($1,$1,$7+1|0);if(($l_0_ph83|0)<0){label=6;break}else{$i_063=0;$d_064=0;label=4;break};case 4:$16=_rs_gmul($_gf,HEAPU8[$_lambda+$i_063|0]|0,HEAPU8[$_s+($n_0_in74-$i_063)|0]|0)|0;$17=$16^$d_064;$18=$i_063+1|0;if(($18|0)>($l_0_ph83|0)){label=5;break}else{$i_063=$18;$d_064=$17;label=4;break};case 5:if(($16|0)==($d_064|0)){label=6;break}else{label=7;break};case 6:$n_0=$n_075+1|0;if(($n_0|0)>($_npar|0)){$l_0_ph80=$l_0_ph83;label=14;break}else{$n_0_in74=$n_075;$n_075=$n_0;label=3;break};case 7:$25=HEAPU8[$_gf+$17|0]|0;if(($l_0_ph83|0)<($7|0)){label=8;break}else{label=10;break};case 8:if(($7|0)<0){label=12;break}else{label=9;break};case 9:$i_168=0;label=11;break;case 10:if(($l_0_ph83|0)<0){label=6;break}else{$i_265=0;label=13;break};case 11:$30=$tt+$i_168|0;$32=HEAPU8[$30]|0;$33=$_lambda+$i_168|0;HEAP8[$30]=(_rs_hgmul($_gf,HEAPU8[$33]|0,$25^255)|0)&255;$39=HEAPU8[$33]|0;HEAP8[$33]=($39^(_rs_hgmul($_gf,$32,$25)|0))&255;$43=$i_168+1|0;if(($43|0)>($7|0)){label=12;break}else{$i_168=$43;label=11;break};case 12:$n_073=$n_075+1|0;if(($n_073|0)>($_npar|0)){$l_0_ph80=$7;label=14;break}else{$k_0_ph82=$n_075-$l_0_ph83|0;$l_0_ph83=$7;$n_0_in_ph84=$n_075;$n_07385=$n_073;label=2;break};case 13:$47=$_lambda+$i_265|0;$49=HEAPU8[$47]|0;HEAP8[$47]=((_rs_hgmul($_gf,HEAPU8[$tt+$i_265|0]|0,$25)|0)^$49)&255;$56=$i_265+1|0;if(($56|0)>($l_0_ph83|0)){label=6;break}else{$i_265=$56;label=13;break};case 14:_rs_poly_mult($_gf,$_omega,$_npar,$_lambda,$l_0_ph80+1|0,$_s,$_npar);STACKTOP=__stackBase__;return $l_0_ph80|0}return 0}function _rs_find_roots($_gf,$_epos,$_lambda,$_nerrors,$_ndata){$_gf=$_gf|0;$_epos=$_epos|0;$_lambda=$_lambda|0;$_nerrors=$_nerrors|0;$_ndata=$_ndata|0;var $17=0,$i_039=0,$nroots_038=0,$20=0,$25=0,$nroots_1=0,$32=0,$nroots_248=0,$alpha_047=0,$sum_042=0,$alphai_041=0,$i_140=0,$38=0,$47=0,$nroots_3=0,$54=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_nerrors|0)<5){label=4;break}else{label=2;break};case 2:if(($_ndata|0)>0){label=3;break}else{$_0=0;label=14;break};case 3:$alpha_047=0;$nroots_248=0;label=9;break;case 4:$17=_rs_quartic_solve($_gf,HEAPU8[$_lambda+1|0]|0,HEAPU8[$_lambda+2|0]|0,HEAPU8[$_lambda+3|0]|0,HEAPU8[$_lambda+4|0]|0,$_epos)|0;if(($17|0)>0){$nroots_038=0;$i_039=0;label=5;break}else{$_0=0;label=14;break};case 5:$20=HEAP8[$_epos+$i_039|0]|0;if($20<<24>>24==0){$nroots_1=$nroots_038;label=8;break}else{label=6;break};case 6:$25=HEAP8[$_gf+($20&255)|0]|0;if(($25&255|0)<($_ndata|0)){label=7;break}else{$nroots_1=$nroots_038;label=8;break};case 7:HEAP8[$_epos+$nroots_038|0]=$25;$nroots_1=$nroots_038+1|0;label=8;break;case 8:$32=$i_039+1|0;if(($32|0)<($17|0)){$nroots_038=$nroots_1;$i_039=$32;label=5;break}else{$_0=$nroots_1;label=14;break};case 9:if(($_nerrors|0)<0){label=12;break}else{$i_140=0;$alphai_041=0;$sum_042=0;label=10;break};case 10:$38=_rs_hgmul($_gf,HEAPU8[$_lambda+($_nerrors-$i_140)|0]|0,$alphai_041)|0;$47=$i_140+1|0;if(($47|0)>($_nerrors|0)){label=11;break}else{$i_140=$47;$alphai_041=HEAPU8[$_gf+(HEAPU8[$alphai_041+$alpha_047+($_gf+256)|0]|0)|0]|0;$sum_042=$38^$sum_042;label=10;break};case 11:if(($38|0)==($sum_042|0)){label=12;break}else{$nroots_3=$nroots_248;label=13;break};case 12:HEAP8[$_epos+$nroots_248|0]=$alpha_047&255;$nroots_3=$nroots_248+1|0;label=13;break;case 13:$54=$alpha_047+1|0;if(($54|0)<($_ndata|0)){$alpha_047=$54;$nroots_248=$nroots_3;label=9;break}else{$_0=$nroots_3;label=14;break};case 14:return $_0|0}return 0}function _rs_poly_zero($_p,$_dp1){$_p=$_p|0;$_dp1=$_dp1|0;_memset($_p|0,0,$_dp1|0);return}function _rs_quartic_solve($_gf,$_a,$_b,$_c,$_d,$_x){$_gf=$_gf|0;$_a=$_a|0;$_b=$_b|0;$_c=$_c|0;$_d=$_d|0;$_x=$_x|0;var $3=0,$13=0,$15=0,$16=0,$18=0,$19=0,$26=0,$29=0,$37=0,$i_090=0,$39=0,$51=0,$55=0,$73=0,$81=0,$90=0,$91=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_d|0)==0){label=2;break}else{label=4;break};case 2:$3=_rs_cubic_solve($_gf,$_a,$_b,$_c,$_x)|0;if(($_c|0)==0){$_0=$3;label=17;break}else{label=3;break};case 3:HEAP8[$_x+$3|0]=0;$_0=$3+1|0;label=17;break;case 4:if(($_a|0)==0){label=12;break}else{label=5;break};case 5:$13=HEAPU8[$_gf+$_a|0]|0;$15=_rs_hgmul($_gf,$_c,$13^255)|0;$16=_rs_gsqrt($_gf,$15)|0;$18=(_rs_gmul($_gf,$_b,$15)|0)^$_d;$19=_rs_gmul($_gf,$15,$15)|0;if(($18|0)==($19|0)){label=8;break}else{label=6;break};case 6:$26=(HEAPU8[$_gf+($18^$19)|0]|0)^255;$29=_rs_hgmul($_gf,(_rs_hgmul($_gf,$16,$13)|0)^$_b,$26)|0;$37=_rs_quartic_solve($_gf,0,$29,HEAPU8[$26+$13+($_gf+256)|0]|0,HEAPU8[$_gf+256+$26|0]|0,$_x)|0;if(($37|0)>0){$i_090=0;label=7;break}else{$_0=$37;label=17;break};case 7:$39=$_x+$i_090|0;HEAP8[$39]=((HEAPU8[((HEAPU8[$_gf+(HEAPU8[$39]|0)|0]|0)^255)+($_gf+256)|0]|0)^$16)&255;$51=$i_090+1|0;if(($51|0)<($37|0)){$i_090=$51;label=7;break}else{$_0=$37;label=17;break};case 8:$55=_rs_quadratic_solve($_gf,$_a,$15^$_b,$_x)|0;if(($55|0)==2){label=9;break}else{label=11;break};case 9:if((HEAPU8[$_x]|0|0)==($16|0)){$_0=2;label=17;break}else{label=10;break};case 10:if((HEAPU8[$_x+1|0]|0|0)==($16|0)){$_0=$55;label=17;break}else{label=11;break};case 11:HEAP8[$_x+$55|0]=$16&255;$_0=$55+1|0;label=17;break;case 12:if(($_c|0)==0){label=13;break}else{label=14;break};case 13:$73=_rs_gsqrt($_gf,$_b)|0;$_0=_rs_quadratic_solve($_gf,$73,_rs_gsqrt($_gf,$_d)|0,$_x)|0;label=17;break;case 14:if((_rs_cubic_solve($_gf,0,$_b,$_c,$_x)|0)<1){$_0=0;label=17;break}else{label=15;break};case 15:$81=HEAPU8[$_x]|0;if((_rs_quadratic_solve($_gf,_rs_gdiv($_gf,$_c,$81)|0,$_d,$_x)|0)<2){$_0=0;label=17;break}else{label=16;break};case 16:$90=HEAPU8[$_x+1|0]|0;$91=_rs_quadratic_solve($_gf,$81,HEAPU8[$_x]|0,$_x)|0;$_0=(_rs_quadratic_solve($_gf,$81,$90,$_x+$91|0)|0)+$91|0;label=17;break;case 17:return $_0|0}return 0}function _rs_cubic_solve($_gf,$_a,$_b,$_c,$_x){$_gf=$_gf|0;$_a=$_a|0;$_b=$_b|0;$_c=$_c|0;$_x=$_x|0;var $3=0,$9=0,$10=0,$11=0,$19=0,$23=0,$31=0,$43=0,$48=0,$60=0,$66=0,$96=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_c|0)==0){label=2;break}else{label=4;break};case 2:$3=_rs_quadratic_solve($_gf,$_a,$_b,$_x)|0;if(($_b|0)==0){$_0=$3;label=14;break}else{label=3;break};case 3:HEAP8[$_x+$3|0]=0;$_0=$3+1|0;label=14;break;case 4:$9=_rs_gmul($_gf,$_a,$_b)|0;$10=$9^$_c;$11=_rs_gmul($_gf,$_a,$_a)|0;if(($11|0)==($_b|0)){label=5;break}else{label=9;break};case 5:if(($9|0)==($_c|0)){label=6;break}else{label=7;break};case 6:HEAP8[$_x]=$_a&255;$_0=1;label=14;break;case 7:$19=HEAP8[$_gf+$10|0]|0;if(($19&255)%3>>>0<<24>>24==0){label=8;break}else{$_0=0;label=14;break};case 8:$23=($19&255)/3>>>0&255;HEAP8[$_x]=((HEAPU8[$_gf+256+$23|0]|0)^$_a)&255;$31=HEAP8[$23+85+($_gf+256)|0]|0;HEAP8[$_x+1|0]=($31&255^$_a)&255;HEAP8[$_x+2|0]=HEAP8[$_x]^$31;$_0=3;label=14;break;case 9:$43=HEAPU8[$_gf+($11^$_b)|0]|0;$48=((-($43&1)&255)+$43|0)>>>1;if((_rs_quadratic_solve($_gf,_rs_gdiv($_gf,$10,HEAPU8[$48+$43+($_gf+256)|0]|0)|0,1,$_x)|0)<1){$_0=0;label=14;break}else{label=10;break};case 10:$60=HEAP8[$_gf+(HEAPU8[$_x]|0)|0]|0;if($60<<24>>24==0){label=13;break}else{label=11;break};case 11:if(($60&255)%3>>>0<<24>>24==0){label=12;break}else{$_0=0;label=14;break};case 12:$66=($60&255)/3>>>0&255;HEAP8[$_x]=((HEAPU8[(HEAPU8[$_gf+((HEAP8[($66^255)+($_gf+256)|0]^HEAP8[$_gf+256+$66|0])&255)|0]|0)+$48+($_gf+256)|0]|0)^$_a)&255;$96=HEAP8[(HEAPU8[$_gf+((HEAP8[170-$66+($_gf+256)|0]^HEAP8[$66+85+($_gf+256)|0])&255)|0]|0)+$48+($_gf+256)|0]|0;HEAP8[$_x+1|0]=($96&255^$_a)&255;HEAP8[$_x+2|0]=HEAP8[$_x]^$96;$_0=3;label=14;break;case 13:HEAP8[$_x]=$_a&255;$_0=1;label=14;break;case 14:return $_0|0}return 0}function __zbar_refcnt446($cnt){$cnt=$cnt|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(HEAP32[$cnt>>2]|0)+1|0;HEAP32[$cnt>>2]=$2;if(($2|0)>-1){label=3;break}else{label=2;break};case 2:___assert_func(2440|0,75,9584|0,2064|0);return 0;case 3:return $2|0}return 0}function _qr_isqrt($_val){$_val=$_val|0;var $2=0,$_09=0,$b_08=0,$g_07=0,$5=0,$g_1=0,$_1=0,label=0;label=1;while(1)switch(label|0){case 1:$g_07=0;$b_08=32768;$_09=$_val;$2=15;label=2;break;case 2:$5=($g_07<<1)+$b_08<<$2;if($5>>>0>$_09>>>0){$_1=$_09;$g_1=$g_07;label=4;break}else{label=3;break};case 3:$_1=$_09-$5|0;$g_1=$b_08+$g_07|0;label=4;break;case 4:if(($2|0)>0){$g_07=$g_1;$b_08=$b_08>>>1;$_09=$_1;$2=$2-1|0;label=2;break}else{label=5;break};case 5:return $g_1|0}return 0}function _qr_ilog($_v){$_v=$_v|0;var $3=0,$4=0,$8=0,$9=0,$14=0,$15=0,$20=0,$21=0;$3=($_v>>>0>65535&1)<<4;$4=$_v>>>($3>>>0);$8=(($4&65280|0)!=0&1)<<3;$9=$4>>>($8>>>0);$14=(($9&240|0)!=0&1)<<2;$15=$9>>>($14>>>0);$20=(($15&12|0)!=0&1)<<1;$21=$15>>>($20>>>0);return($8|$3|$14|$20|$21>>>1&1)+(($21|0)!=0&1)|0}function _i25_reset($i25){$i25=$i25|0;var $1=0;$1=$i25;HEAP32[$1>>2]=HEAP32[$1>>2]&-131072|131040;HEAP32[$i25+4>>2]=0;return}function _code39_reset($dcode39){$dcode39=$dcode39|0;var $1=0;$1=$dcode39;HEAP32[$1>>2]=HEAP32[$1>>2]&-131072|131040;HEAP32[$dcode39+4>>2]=0;return}function _code128_reset($dcode128){$dcode128=$dcode128|0;var $1=0;$1=$dcode128;HEAP32[$1>>2]=HEAP32[$1>>2]&-65536|65520;HEAP32[$dcode128+4>>2]=0;return}function _qr_finder_reset($qrf){$qrf=$qrf|0;HEAP32[$qrf>>2]=0;return}function _ean_new_scan($ean){$ean=$ean|0;HEAP8[$ean+8|0]=-1;HEAP8[$ean|0]=-1;HEAP8[$ean+24|0]=-1;HEAP8[$ean+16|0]=-1;HEAP32[$ean+44>>2]=0;return}function _zbar_decoder_get_data($dcode){$dcode=$dcode|0;return HEAP32[$dcode+84>>2]|0}function _zbar_decoder_get_data_length($dcode){$dcode=$dcode|0;return HEAP32[$dcode+80>>2]|0}function _zbar_decoder_set_handler($dcode,$handler){$dcode=$dcode|0;$handler=$handler|0;var $1=0,$2=0;$1=$dcode+92|0;$2=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$handler;return $2|0}function _zbar_decoder_set_userdata($dcode,$userdata){$dcode=$dcode|0;$userdata=$userdata|0;HEAP32[$dcode+88>>2]=$userdata;return}function _zbar_decoder_get_userdata($dcode){$dcode=$dcode|0;return HEAP32[$dcode+88>>2]|0}function _zbar_decoder_get_type($dcode){$dcode=$dcode|0;return HEAP32[$dcode+68>>2]|0}function _decoder_set_config_bool($dcode,$sym,$cfg,$val){$dcode=$dcode|0;$sym=$sym|0;$cfg=$cfg|0;$val=$val|0;var $config_0=0,$storemerge=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($sym|0)==13){label=2;break}else if(($sym|0)==8){label=3;break}else if(($sym|0)==12){label=4;break}else if(($sym|0)==9){label=5;break}else if(($sym|0)==10){label=6;break}else if(($sym|0)==14){label=7;break}else if(($sym|0)==25){label=8;break}else if(($sym|0)==39){label=9;break}else if(($sym|0)==128){label=10;break}else if(($sym|0)==64){label=11;break}else{$_0=1;label=17;break};case 2:$config_0=$dcode+164|0;label=12;break;case 3:$config_0=$dcode+168|0;label=12;break;case 4:$config_0=$dcode+172|0;label=12;break;case 5:$config_0=$dcode+176|0;label=12;break;case 6:$config_0=$dcode+180|0;label=12;break;case 7:$config_0=$dcode+184|0;label=12;break;case 8:$config_0=$dcode+200|0;label=12;break;case 9:$config_0=$dcode+224|0;label=12;break;case 10:$config_0=$dcode+244|0;label=12;break;case 11:$config_0=$dcode+280|0;label=12;break;case 12:if(($config_0|0)==0|$cfg>>>0>3){$_0=1;label=17;break}else{label=13;break};case 13:if(($val|0)==0){label=14;break}else if(($val|0)==1){label=15;break}else{$_0=1;label=17;break};case 14:$storemerge=HEAP32[$config_0>>2]&(1<<$cfg^-1);label=16;break;case 15:$storemerge=HEAP32[$config_0>>2]|1<<$cfg;label=16;break;case 16:HEAP32[$config_0>>2]=$storemerge;HEAP8[$dcode+162|0]=(HEAP32[$dcode+168>>2]|HEAP32[$dcode+164>>2]|HEAP32[$dcode+172>>2]|HEAP32[$dcode+176>>2]|HEAP32[$dcode+180>>2]|HEAP32[$dcode+184>>2])&1;$_0=0;label=17;break;case 17:return $_0|0}return 0}function _decoder_set_config_int($dcode,$sym,$cfg,$val){$dcode=$dcode|0;$sym=$sym|0;$cfg=$cfg|0;$val=$val|0;var $_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($sym|0)==25){label=2;break}else if(($sym|0)==39){label=3;break}else if(($sym|0)==128){label=4;break}else{$_0=1;label=5;break};case 2:HEAP32[$dcode+204+($cfg-32<<2)>>2]=$val;$_0=0;label=5;break;case 3:HEAP32[$dcode+228+($cfg-32<<2)>>2]=$val;$_0=0;label=5;break;case 4:HEAP32[$dcode+248+($cfg-32<<2)>>2]=$val;$_0=0;label=5;break;case 5:return $_0|0}return 0}function _rs_quadratic_solve($_gf,$_b,$_c,$_x){$_gf=$_gf|0;$_b=$_b|0;$_c=$_c|0;$_x=$_x|0;var $12=0,$13=0,$16=0,$18=0,$24=0,$31=0,$logc_0=0,$logb_0=0,$b_0=0,$_091=0,$42=0,$49=0,$56=0,$63=0,$77=0,$84=0,$101=0,$112=0,$113=0,$119=0,$120=0,$123=0,$130=0,$131=0,$136=0,$146=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_b|0)==0){label=2;break}else{label=3;break};case 2:HEAP8[$_x]=(_rs_gsqrt($_gf,$_c)|0)&255;$_0=1;label=9;break;case 3:if(($_c|0)==0){label=4;break}else{label=5;break};case 4:HEAP8[$_x]=0;HEAP8[$_x+1|0]=$_b&255;$_0=2;label=9;break;case 5:$12=HEAP8[$_gf+$_b|0]|0;$13=$12&255;$16=HEAPU8[$_gf+$_c|0]|0;$18=($12&255)%17>>>0<<24>>24==0;if($18){label=6;break}else{$_091=$_c;$b_0=$_b;$logb_0=$13;$logc_0=$16;label=7;break};case 6:$24=HEAPU8[$13+254+($_gf+256)|0]|0;$31=HEAPU8[$16+253+($_gf+256)|0]|0;$_091=$31;$b_0=$24;$logb_0=HEAPU8[$_gf+$24|0]|0;$logc_0=HEAPU8[$_gf+$31|0]|0;label=7;break;case 7:$42=HEAPU8[$_gf+(HEAPU8[($logb_0<<1)+($_gf+256)|0]|0)|0]|0;$49=HEAPU8[$_gf+(HEAPU8[($42<<1)+($_gf+256)|0]|0)|0]|0;$56=HEAPU8[$_gf+(HEAPU8[($49<<1)+($_gf+256)|0]|0)|0]|0;$63=HEAPU8[$_gf+(HEAPU8[$56+$49+($_gf+256)|0]|0)|0]|0;$77=HEAPU8[$_gf+(HEAPU8[($logc_0<<1)+($_gf+256)|0]|0)|0]|0;$84=HEAPU8[$_gf+(HEAPU8[($77<<1)+($_gf+256)|0]|0)|0]|0;$101=_rs_hgmul($_gf,(HEAP8[(HEAPU8[$_gf+(HEAPU8[$63+$42+($_gf+256)|0]|0)|0]|0)+$logc_0+($_gf+256)|0]^HEAP8[($84<<1)+($_gf+256)|0]^HEAP8[$77+$63+($_gf+256)|0]^HEAP8[$84+$56+($_gf+256)|0])&255,$logb_0)|0;if((HEAPU8[$_gf+$101|0]|0)%17>>>0<<24>>24==0){label=8;break}else{$_0=0;label=9;break};case 8:$112=_rs_gdiv($_gf,$101,(HEAPU8[($56<<1)+($_gf+256)|0]|0)^$b_0)|0;$113=_rs_gmul($_gf,$112,$112)|0;$119=_rs_hgmul($_gf,_rs_hgmul($_gf,$113^$_091^(_rs_hgmul($_gf,$112,$logb_0)|0),$42^255)|0,221)|0;$120=_rs_hgmul($_gf,$119,221)|0;$123=_rs_hgmul($_gf,(_rs_gmul($_gf,$119,$119)|0)^$120,238)|0;$130=_rs_gdiv($_gf,$123,(HEAP8[$_gf+494|0]^HEAP8[$_gf+443|0])&255)|0;$131=_rs_gmul($_gf,$130,$130)|0;$136=_rs_hgmul($_gf,_rs_hgmul($_gf,$131^$119^(_rs_hgmul($_gf,$130,238)|0),34)|0,85)|0;$146=HEAP8[(HEAPU8[$_gf+((_rs_hgmul($_gf,(_rs_hgmul($_gf,$130,17)|0)^$136,$logb_0)|0)^$112)|0]|0)+($18&1)+($_gf+256)|0]|0;HEAP8[$_x]=$146;HEAP8[$_x+1|0]=($146&255^$_b)&255;$_0=2;label=9;break;case 9:return $_0|0}return 0}function _rs_init_lambda($_gf,$_lambda,$_npar,$_erasures,$_nerasures,$_ndata){$_gf=$_gf|0;$_lambda=$_lambda|0;$_npar=$_npar|0;$_erasures=$_erasures|0;$_nerasures=$_nerasures|0;$_ndata=$_ndata|0;var $i_017=0,$7=0,$j_016=0,$11=0,$18=0,$19=0,label=0;label=1;while(1)switch(label|0){case 1:_rs_poly_zero($_lambda,($_npar|0)<4?5:$_npar+1|0);HEAP8[$_lambda]=1;if(($_nerasures|0)>0){label=2;break}else{label=7;break};case 2:$i_017=0;label=4;break;case 3:if(($7|0)<($_nerasures|0)){$i_017=$7;label=4;break}else{label=7;break};case 4:$7=$i_017+1|0;if(($7|0)>0){label=5;break}else{label=3;break};case 5:$j_016=$7;label=6;break;case 6:$11=$j_016-1|0;$18=_rs_hgmul($_gf,HEAPU8[$_lambda+$11|0]|0,$_ndata-1-(HEAPU8[$_erasures+$i_017|0]|0)|0)|0;$19=$_lambda+$j_016|0;HEAP8[$19]=((HEAPU8[$19]|0)^$18)&255;if(($11|0)>0){$j_016=$11;label=6;break}else{label=3;break};case 7:return}}function _rs_poly_copy($_p,$_q,$_dp1){$_p=$_p|0;$_q=$_q|0;$_dp1=$_dp1|0;_memcpy($_p|0,$_q|0,$_dp1)|0;return}function _rs_poly_mul_x($_p,$_q,$_dp1){$_p=$_p|0;$_q=$_q|0;$_dp1=$_dp1|0;_memmove($_p+1|0,$_q|0,$_dp1-1|0);HEAP8[$_p]=0;return}function _rs_poly_mult($_gf,$_p,$_dp1,$_q,$_ep1,$_r,$_fp1){$_gf=$_gf|0;$_p=$_p|0;$_dp1=$_dp1|0;$_q=$_q|0;$_ep1=$_ep1|0;$_r=$_r|0;$_fp1=$_fp1|0;var $2=0,$i_026=0,$5=0,$8=0,$__fp1=0,$j_025=0,$18=0,$20=0,$25=0,$27=0,label=0;label=1;while(1)switch(label|0){case 1:_rs_poly_zero($_p,$_dp1);$2=($_ep1|0)<($_dp1|0)?$_ep1:$_dp1;if(($2|0)>0){$i_026=0;label=2;break}else{label=6;break};case 2:$5=HEAP8[$_q+$i_026|0]|0;if($5<<24>>24==0){label=5;break}else{label=3;break};case 3:$8=$_dp1-$i_026|0;$__fp1=($8|0)<($_fp1|0)?$8:$_fp1;if(($__fp1|0)>0){$j_025=0;label=4;break}else{label=5;break};case 4:$18=_rs_hgmul($_gf,HEAPU8[$_r+$j_025|0]|0,HEAPU8[$_gf+($5&255)|0]|0)|0;$20=$_p+($j_025+$i_026)|0;HEAP8[$20]=((HEAPU8[$20]|0)^$18)&255;$25=$j_025+1|0;if(($25|0)<($__fp1|0)){$j_025=$25;label=4;break}else{label=5;break};case 5:$27=$i_026+1|0;if(($27|0)<($2|0)){$i_026=$27;label=2;break}else{label=6;break};case 6:return}}function _qr_ihypot($_x,$_y){$_x=$_x|0;$_y=$_y|0;var $1=0,$2=0,$7=0,$9=0,$11=0,$13=0,$18=0,$19=0,$21$1=0,$23=0,$_lobit=0,$24=0,$27=0,$30=0,$35=0,$_057=0,$i_056=0,$x_055=0,$45=0,$50=0,$53=0,$57=0,$58=0,label=0;label=1;while(1)switch(label|0){case 1:$1=($_x|0)>-1?$_x:-$_x|0;$2=($_y|0)>-1?$_y:-$_y|0;$7=($2^$1)&-($1>>>0>$2>>>0&1);$9=$7^$2;$11=31-(_qr_ilog($9)|0)|0;$13=$11&($11>>31^-1);___muldi3(($7^$1)<<$13,0,-1686835798,0)|0;$18=tempRet0;$19=$9<<$13;___muldi3($19,($19|0)<0?-1:0,-1686835799,0)|0;$21$1=tempRet0;$23=$21$1;$_lobit=$21$1>>>31|0<<1;$24=-$_lobit|0;$27=($23-$_lobit^$24)+$18|0;$30=$23-($18-$_lobit^$24)|0;$35=$30>>31;$x_055=(($30+1>>1)+$35^$35)+$27|0;$i_056=1;$_057=$30-((($27+1|0)>>>1)+$35^$35)|0;label=2;break;case 2:$45=$i_056<<1;$50=$_057>>31;$53=(((1<<$45>>1)+$_057>>$45)+$50^$50)+$x_055|0;$57=$_057-($50+(($x_055+1|0)>>>2)^$50)<<1;$58=$i_056+1|0;if(($58|0)<16){$x_055=$53;$i_056=$58;$_057=$57;label=2;break}else{label=3;break};case 3:return($53+(1<<$13>>>1)|0)>>>($13>>>0)|0}return 0}function _zbar_decoder_create(){var $1=0,$2=0;$1=_calloc(1,284)|0;$2=$1;HEAP32[$1+76>>2]=32;HEAP32[$1+84>>2]=_malloc(32)|0;HEAP8[$1+162|0]=1;HEAP32[$1+164>>2]=5;HEAP32[$1+168>>2]=5;HEAP32[$1+172>>2]=4;HEAP32[$1+176>>2]=4;HEAP32[$1+180>>2]=4;HEAP32[$1+184>>2]=4;HEAP32[$1+200>>2]=1;HEAP32[$1+204>>2]=6;HEAP32[$1+224>>2]=1;HEAP32[$1+228>>2]=1;HEAP32[$1+244>>2]=1;HEAP32[$1+280>>2]=1;_zbar_decoder_reset($2);return $2|0}function _zbar_decoder_reset($dcode){$dcode=$dcode|0;_memset($dcode|0,0,76);_ean_reset($dcode+96|0);_i25_reset($dcode+188|0);_code39_reset($dcode+212|0);_code128_reset($dcode+236|0);_qr_finder_reset($dcode+256|0);return}function _zbar_decoder_destroy($dcode){$dcode=$dcode|0;var $2=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$dcode+84>>2]|0;if(($2|0)==0){label=3;break}else{label=2;break};case 2:_free($2);label=3;break;case 3:_free($dcode|0);return}}function _ean_reset($ean){$ean=$ean|0;_ean_new_scan($ean);HEAP32[$ean+40>>2]=0;HEAP32[$ean+36>>2]=0;HEAP32[$ean+32>>2]=0;return}function _zbar_decoder_new_scan($dcode){$dcode=$dcode|0;_memset($dcode+4|0,0,64);HEAP32[$dcode+72>>2]=0;HEAP8[$dcode|0]=0;_ean_new_scan($dcode+96|0);_i25_reset($dcode+188|0);_code39_reset($dcode+212|0);_code128_reset($dcode+236|0);_qr_finder_reset($dcode+256|0);return}function _zbar_decode_width($dcode,$w){$dcode=$dcode|0;$w=$w|0;var $1=0,$6=0,$11=0,$20=0,$29=0,$38=0,$47=0,$57=0,$61=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode|0;HEAP32[$dcode+4+((HEAP8[$1]&15)<<2)>>2]=$w;$6=$dcode+68|0;HEAP32[$6>>2]=0;if((HEAP8[$dcode+162|0]|0)==0){label=4;break}else{label=2;break};case 2:$11=__zbar_decode_ean($dcode)|0;if(($11|0)==0){label=4;break}else{label=3;break};case 3:HEAP32[$6>>2]=$11;label=4;break;case 4:if((HEAP32[$dcode+224>>2]&1|0)==0){label=7;break}else{label=5;break};case 5:$20=__zbar_decode_code39($dcode)|0;if($20>>>0>1){label=6;break}else{label=7;break};case 6:HEAP32[$6>>2]=$20;label=7;break;case 7:if((HEAP32[$dcode+244>>2]&1|0)==0){label=10;break}else{label=8;break};case 8:$29=__zbar_decode_code128($dcode)|0;if($29>>>0>1){label=9;break}else{label=10;break};case 9:HEAP32[$6>>2]=$29;label=10;break;case 10:if((HEAP32[$dcode+200>>2]&1|0)==0){label=13;break}else{label=11;break};case 11:$38=__zbar_decode_i25($dcode)|0;if($38>>>0>1){label=12;break}else{label=13;break};case 12:HEAP32[$6>>2]=$38;label=13;break;case 13:if((HEAP32[$dcode+280>>2]&1|0)==0){label=16;break}else{label=14;break};case 14:$47=__zbar_find_qr($dcode)|0;if($47>>>0>1){label=15;break}else{label=16;break};case 15:HEAP32[$6>>2]=$47;label=16;break;case 16:HEAP8[$1]=(HEAP8[$1]|0)+1&255;if((HEAP32[$6>>2]|0)==0){label=22;break}else{label=17;break};case 17:$57=HEAP32[$dcode+92>>2]|0;if(($57|0)==0){label=19;break}else{label=18;break};case 18:FUNCTION_TABLE_vi[$57&63]($dcode);label=19;break;case 19:$61=$dcode+72|0;if((HEAP32[$61>>2]|0)==0){label=22;break}else{label=20;break};case 20:if((HEAP32[$6>>2]|0)>>>0>1){label=21;break}else{label=22;break};case 21:HEAP32[$61>>2]=0;label=22;break;case 22:return HEAP32[$6>>2]|0}return 0}function _zbar_decoder_set_config($dcode,$sym,$cfg,$val){$dcode=$dcode|0;$sym=$sym|0;$cfg=$cfg|0;$val=$val|0;var $_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($sym|0)==0){label=2;break}else{label=3;break};case 2:_zbar_decoder_set_config($dcode,13,$cfg,$val)|0;_zbar_decoder_set_config($dcode,8,$cfg,$val)|0;_zbar_decoder_set_config($dcode,12,$cfg,$val)|0;_zbar_decoder_set_config($dcode,9,$cfg,$val)|0;_zbar_decoder_set_config($dcode,10,$cfg,$val)|0;_zbar_decoder_set_config($dcode,14,$cfg,$val)|0;_zbar_decoder_set_config($dcode,25,$cfg,$val)|0;_zbar_decoder_set_config($dcode,39,$cfg,$val)|0;_zbar_decoder_set_config($dcode,128,$cfg,$val)|0;_zbar_decoder_set_config($dcode,57,$cfg,$val)|0;_zbar_decoder_set_config($dcode,64,$cfg,$val)|0;return 0;case 3:if($cfg>>>0<4){label=4;break}else{label=5;break};case 4:$_0=_decoder_set_config_bool($dcode,$sym,$cfg,$val)|0;label=7;break;case 5:if(($cfg-32|0)>>>0<2){label=6;break}else{$_0=1;label=7;break};case 6:$_0=_decoder_set_config_int($dcode,$sym,$cfg,$val)|0;label=7;break;case 7:return $_0|0}return 0}function __zbar_decoder_buf_dump($buf,$buflen){$buf=$buf|0;$buflen=$buflen|0;var $2=0,$3=0,$4=0,$12=0,$15=0,$i_013=0,$p_012=0,$23=0,$25=0,$26=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$2=($buflen*3&-1)+12|0;$3=HEAP32[218]|0;$4=($3|0)==0;if($4|$2>>>0>(HEAP32[216]|0)>>>0){label=2;break}else{label=5;break};case 2:if($4){label=4;break}else{label=3;break};case 3:_free($3);label=4;break;case 4:HEAP32[218]=_malloc($2)|0;HEAP32[216]=$2;label=5;break;case 5:$12=HEAP32[218]|0;$15=_snprintf($12|0,12,3584,(tempInt=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempInt>>2]=$buflen>>>0>65535?65535:$buflen,tempInt)|0)|0;if(($buflen|0)==0){label=8;break}else{label=6;break};case 6:$p_012=$12+$15|0;$i_013=0;label=7;break;case 7:$23=HEAPU8[$buf+$i_013|0]|0;$25=$p_012+(_snprintf($p_012|0,4,6696,(tempInt=STACKTOP,STACKTOP=STACKTOP+16|0,HEAP32[tempInt>>2]=($i_013|0)!=0?4832:4192,HEAP32[tempInt+8>>2]=$23,tempInt)|0)|0)|0;$26=$i_013+1|0;if($26>>>0<$buflen>>>0){$p_012=$25;$i_013=$26;label=7;break}else{label=8;break};case 8:STACKTOP=__stackBase__;return HEAP32[218]|0}return 0}function _decode_e512($e,$s){$e=$e|0;$s=$s|0;var $6=0;$6=(((($e*22&-1|1)>>>0)/($s>>>0)>>>0)+509|0)>>>1&255;return($6>>>0>7?-1:$6)|0}function _get_width510($dcode,$offset){$dcode=$dcode|0;$offset=$offset|0;return HEAP32[$dcode+4+(((HEAPU8[$dcode|0]|0)-($offset&255)&15)<<2)>>2]|0}function _get_color511($dcode){$dcode=$dcode|0;return HEAP8[$dcode|0]&1|0}function _get_lock($dcode){$dcode=$dcode|0;var $1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+72|0;if((HEAP32[$1>>2]|0)==0){label=2;break}else{$_0=1;label=3;break};case 2:HEAP32[$1>>2]=128;$_0=0;label=3;break;case 3:return $_0|0}return 0}function __zbar_decode_code128($dcode){$dcode=$dcode|0;var $2=0,$3=0,$5=0,$8=0,$9=0,$14=0,$21=0,$22=0,$27=0,$30=0,$38=0,$47=0,$48=0,$73=0,$74=0,$75=0,$77=0,$80=0,$83=0,$94=0,$115=0,$121=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$2=_get_width510($dcode,6)|0;$3=$dcode+240|0;$5=(HEAP32[$3>>2]|0)-$2|0;HEAP32[$3>>2]=$5;HEAP32[$3>>2]=$5+(_get_width510($dcode,0)|0);$8=$dcode+236|0;$9=HEAP32[$8>>2]|0;if(($9&32768|0)==0){label=2;break}else{label=3;break};case 2:$14=($9>>>1)+1&7;HEAP32[$8>>2]=$14<<1|$9&-15;if(($14|0)==6){label=3;break}else{$_0=0;label=29;break};case 3:$21=(_get_color511($dcode)|0)<<24>>24;$22=HEAP32[$8>>2]|0;if(($21|0)==($22&1|0)){label=4;break}else{$_0=0;label=29;break};case 4:HEAP32[$8>>2]=$22&-15;$27=_decode6($dcode)|0;$30=(HEAP32[$8>>2]|0)>>>4<<20;if(($30|0)<0){label=5;break}else{label=13;break};case 5:if(($27-103&255)>4|$27<<24>>24==106){$_0=0;label=29;break}else{label=6;break};case 6:$38=_get_width510($dcode,6)|0;if(($38|0)==0){label=8;break}else{label=7;break};case 7:if($38>>>0<((HEAP32[$3>>2]|0)*3&-1)>>>2>>>0){$_0=0;label=29;break}else{label=8;break};case 8:$47=(_get_lock($dcode)|0)<<24>>24==0;$48=HEAP32[$8>>2]|0;if($47){label=10;break}else{label=9;break};case 9:HEAP32[$8>>2]=$48|65520;$_0=0;label=29;break;case 10:HEAP32[$8>>2]=$48&-65521;if($27<<24>>24==107){label=11;break}else{label=12;break};case 11:HEAP32[$8>>2]=$48&-65536|15;label=17;break;case 12:HEAP32[$8>>2]=$48&-65522;label=17;break;case 13:if($27<<24>>24<0){label=16;break}else{label=14;break};case 14:if(($30|0)>32505856){label=15;break}else{label=17;break};case 15:if((_size_buf($dcode,($30>>20)+1|0)|0)<<24>>24==0){label=17;break}else{label=16;break};case 16:HEAP32[$dcode+72>>2]=0;HEAP32[$8>>2]=HEAP32[$8>>2]|65520;$_0=0;label=29;break;case 17:$73=HEAP32[$dcode+76>>2]|0;$74=HEAP32[$8>>2]|0;$75=$74>>>4;$77=$75<<20>>20;if($73>>>0>$77>>>0){label=19;break}else{label=18;break};case 18:$80=HEAP32[_stderr>>2]|0;$83=__zbar_decoder_buf_dump(HEAP32[$dcode+84>>2]|0,$73)|0;_fprintf($80|0,3488,(tempInt=STACKTOP,STACKTOP=STACKTOP+64|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=487,HEAP32[tempInt+16>>2]=10088,HEAP32[tempInt+24>>2]=4752,HEAP32[tempInt+32>>2]=$73,HEAP32[tempInt+40>>2]=$77,HEAP32[tempInt+48>>2]=$27<<24>>24,HEAP32[tempInt+56>>2]=$83,tempInt)|0)|0;$_0=0;label=29;break;case 19:HEAP32[$8>>2]=($75<<4)+16&65520|$74&-65521;HEAP8[(HEAP32[$dcode+84>>2]|0)+$77|0]=$27;$94=HEAP32[$8>>2]|0;if(($94>>>4<<20|0)>2097152){label=20;break}else{$_0=0;label=29;break};case 20:if(($94&1|0)==0){label=22;break}else{label=21;break};case 21:if(($27-103&255)<3){label=23;break}else{$_0=0;label=29;break};case 22:if($27<<24>>24==106){label=23;break}else{$_0=0;label=29;break};case 23:if((_validate_checksum($dcode)|0)<<24>>24==0){label=24;break}else{label=28;break};case 24:if((_postprocess($dcode)|0)<<24>>24==0){label=25;break}else{label=28;break};case 25:$115=(HEAP32[$8>>2]|0)>>>4<<20>>20;if(($115|0)<(HEAP32[$dcode+248>>2]|0)){label=28;break}else{label=26;break};case 26:$121=HEAP32[$dcode+252>>2]|0;if(($121|0)>0&($115|0)>($121|0)){label=28;break}else{label=27;break};case 27:HEAP32[$8>>2]=HEAP32[$8>>2]|65520;$_0=128;label=29;break;case 28:HEAP32[$8>>2]=HEAP32[$8>>2]|65520;HEAP32[$dcode+72>>2]=0;$_0=0;label=29;break;case 29:STACKTOP=__stackBase__;return $_0|0}return 0}function _decode6($dcode){$dcode=$dcode|0;var $2=0,$8=0,$9=0,$12=0,$13=0,$17=0,$18=0,$22=0,$28=0,$29=0,$32=0,$33=0,$37=0,$38=0,$42=0,$48=0,$_sink=0,$63=0,$65=0,$69=0,$71=0,$75=0,$77=0,$79=0,label=0;label=1;while(1)switch(label|0){case 1:$2=HEAP32[$dcode+240>>2]|0;if($2>>>0<5){label=14;break}else{label=2;break};case 2:if((_get_color511($dcode)|0)<<24>>24==1){label=3;break}else{label=4;break};case 3:$8=_get_width510($dcode,0)|0;$9=_get_width510($dcode,1)|0;$12=(_decode_e512($9+$8|0,$2)|0)<<12;$13=_get_width510($dcode,2)|0;$17=(_decode_e512($13+$9|0,$2)|0)<<8|$12;$18=_get_width510($dcode,3)|0;$22=$17|(_decode_e512($18+$13|0,$2)|0)<<4;$48=$22|(_decode_e512((_get_width510($dcode,4)|0)+$18|0,$2)|0);label=5;break;case 4:$28=_get_width510($dcode,5)|0;$29=_get_width510($dcode,4)|0;$32=(_decode_e512($29+$28|0,$2)|0)<<12;$33=_get_width510($dcode,3)|0;$37=(_decode_e512($33+$29|0,$2)|0)<<8|$32;$38=_get_width510($dcode,2)|0;$42=$37|(_decode_e512($38+$33|0,$2)|0)<<4;$48=$42|(_decode_e512((_get_width510($dcode,1)|0)+$38|0,$2)|0);label=5;break;case 5:if(($48|0)<0){label=14;break}else{label=6;break};case 6:if(($48&17476|0)==0){label=8;break}else{label=7;break};case 7:$_sink=_decode_hi($48)|0;label=9;break;case 8:$_sink=_decode_lo($48)|0;label=9;break;case 9:if($_sink<<24>>24==-1){label=14;break}else{label=10;break};case 10:if((_get_color511($dcode)|0)<<24>>24==1){label=11;break}else{label=12;break};case 11:$63=_get_width510($dcode,0)|0;$65=(_get_width510($dcode,2)|0)+$63|0;$75=$65+(_get_width510($dcode,4)|0)|0;label=13;break;case 12:$69=_get_width510($dcode,1)|0;$71=(_get_width510($dcode,3)|0)+$69|0;$75=$71+(_get_width510($dcode,5)|0)|0;label=13;break;case 13:$77=(($75*44&-1)>>>0)/($2>>>0)>>>0;$79=(_calc_check($_sink)|0)&255;return(($79-7|0)>>>0>$77>>>0|$77>>>0>($79+7|0)>>>0?-1:$_sink&127)|0;case 14:return-1|0}return 0}function _size_buf($dcode,$len){$dcode=$dcode|0;$len=$len|0;var $1=0,$2=0,$7=0,$_014=0,$12=0,$14=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+76|0;$2=HEAP32[$1>>2]|0;if($2>>>0>$len>>>0){$_0=0;label=7;break}else{label=2;break};case 2:if($len>>>0>256){$_0=1;label=7;break}else{label=3;break};case 3:$7=$2+16|0;if($7>>>0>$len>>>0){label=4;break}else{$_014=$len;label=5;break};case 4:$_014=$7>>>0>256?256:$7;label=5;break;case 5:$12=$dcode+84|0;$14=_realloc(HEAP32[$12>>2]|0,$_014)|0;if(($14|0)==0){$_0=1;label=7;break}else{label=6;break};case 6:HEAP32[$12>>2]=$14;HEAP32[$1>>2]=$_014;$_0=0;label=7;break;case 7:return $_0|0}return 0}function _validate_checksum($dcode){$dcode=$dcode|0;var $2=0,$3=0,$5=0,$6=0,$12=0,$15=0,$16=0,$sum_0=0,$19=0,$acc_049=0,$i_048=0,$sum_147=0,$23=0,$24=0,$30=0,$33=0,$43=0,$44=0,$48=0,$acc_1=0,$53=0,$54=0,$59=0,$62=0,$_40=0,$65=0,$sum_1_lcssa=0,$67=0,$76=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$2=$dcode+236|0;$3=HEAP32[$2>>2]|0;$5=$3>>>4<<20;$6=$5>>20;if(($5|0)<3145728){$_0=1;label=13;break}else{label=2;break};case 2:$12=$dcode+84|0;$15=HEAP8[(HEAP32[$12>>2]|0)+(($3&1|0)==0?0:$6-1|0)|0]|0;$16=$15&255;$sum_0=($15&255)>102?$16-103|0:$16;$19=$6-3|0;if(($19|0)==0){$sum_1_lcssa=$sum_0;label=10;break}else{$sum_147=$sum_0;$i_048=$19;$acc_049=0;label=3;break};case 3:if($sum_147>>>0<103){label=5;break}else{label=4;break};case 4:$23=HEAP32[_stderr>>2]|0;$24=HEAP32[$2>>2]|0;$30=__zbar_decoder_buf_dump(HEAP32[$12>>2]|0,$24>>>4<<20>>20)|0;_fprintf($23|0,6424,(tempInt=STACKTOP,STACKTOP=STACKTOP+72|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=246,HEAP32[tempInt+16>>2]=8816,HEAP32[tempInt+24>>2]=6200,HEAP32[tempInt+32>>2]=$24&1,HEAP32[tempInt+40>>2]=$i_048,HEAP32[tempInt+48>>2]=$sum_147,HEAP32[tempInt+56>>2]=$acc_049,HEAP32[tempInt+64>>2]=$30,tempInt)|0)|0;$_0=-1;label=13;break;case 5:$33=HEAP32[$2>>2]|0;if(($33&1|0)==0){$43=$i_048;label=7;break}else{label=6;break};case 6:$43=($33>>>4<<20>>20)+($i_048^-1)|0;label=7;break;case 7:$44=HEAP32[$12>>2]|0;$48=(HEAPU8[$44+$43|0]|0)+$acc_049|0;$acc_1=$48>>>0>102?$48-103|0:$48;if($acc_1>>>0<103){label=9;break}else{label=8;break};case 8:$53=HEAP32[_stderr>>2]|0;$54=HEAP32[$2>>2]|0;$59=__zbar_decoder_buf_dump($44,$54>>>4<<20>>20)|0;_fprintf($53|0,6424,(tempInt=STACKTOP,STACKTOP=STACKTOP+72|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=253,HEAP32[tempInt+16>>2]=8816,HEAP32[tempInt+24>>2]=5968,HEAP32[tempInt+32>>2]=$54&1,HEAP32[tempInt+40>>2]=$i_048,HEAP32[tempInt+48>>2]=$sum_147,HEAP32[tempInt+56>>2]=$acc_1,HEAP32[tempInt+64>>2]=$59,tempInt)|0)|0;$_0=-1;label=13;break;case 9:$62=$acc_1+$sum_147|0;$_40=$62>>>0>102?$62-103|0:$62;$65=$i_048-1|0;if(($65|0)==0){$sum_1_lcssa=$_40;label=10;break}else{$sum_147=$_40;$i_048=$65;$acc_049=$acc_1;label=3;break};case 10:$67=HEAP32[$2>>2]|0;if(($67&1|0)==0){label=11;break}else{$76=1;label=12;break};case 11:$76=($67>>>4<<20>>20)-2|0;label=12;break;case 12:$_0=($sum_1_lcssa|0)!=(HEAPU8[(HEAP32[$12>>2]|0)+$76|0]|0|0)&1;label=13;break;case 13:STACKTOP=__stackBase__;return $_0|0}return 0}function _postprocess($dcode){$dcode=$dcode|0;var $2=0,$3=0,$4=0,$6=0,$9=0,$11=0,$12=0,$14=0,$i_0155=0,$15=0,$16=0,$17=0,$18=0,$23=0,$24=0,$27=0,$30=0,$_lcssa154=0,$_lcssa153=0,$_lcssa152=0,$32=0,$37=0,$39=0,$44=0,$47=0,$52=0,$53=0,$56=0,$57=0,$58=0,$62=0,$67=0,$70=0,$72=0,$76=0,$79=0,$i_1147=0,$cexp_0146=0,$charset_0145=0,$j_0144=0,$80=0,$82=0,$83=0,$87=0,$89=0,$92=0,$94=0,$99=0,$code2_0=0,$114=0,$115=0,$118=0,$j_1=0,$cexp_1=0,$i_2=0,$133=0,$139=0,$charset_1=0,$j_2=0,$charset_2=0,$cexp_2=0,$i_3=0,$148=0,$152=0,$_lcssa=0,$i_1_lcssa=0,$cexp_0_lcssa=0,$charset_0_lcssa=0,$j_0_lcssa=0,$155=0,$161=0,$163=0,$j_3=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$2=$dcode+236|0;$3=HEAP32[$2>>2]|0;$4=$3&1;if(($4|0)==0){label=7;break}else{label=2;break};case 2:$6=HEAP32[$2>>2]|0;$9=$6>>>4<<20>>20;$11=$9-1|0;if(($9+1|0)>>>0>2){label=3;break}else{$_lcssa152=$6;$_lcssa153=$9;$_lcssa154=$11;label=5;break};case 3:$12=$dcode+84|0;$i_0155=0;$14=$11;label=4;break;case 4:$15=$14-$i_0155|0;$16=HEAP32[$12>>2]|0;$17=$16+$i_0155|0;$18=HEAP8[$17]|0;HEAP8[$17]=HEAP8[$16+$15|0]|0;HEAP8[(HEAP32[$12>>2]|0)+$15|0]=$18;$23=$i_0155+1|0;$24=HEAP32[$2>>2]|0;$27=$24>>>4<<20>>20;$30=$27-1|0;if($23>>>0<(($27|0)/2&-1)>>>0){$i_0155=$23;$14=$30;label=4;break}else{$_lcssa152=$24;$_lcssa153=$27;$_lcssa154=$30;label=5;break};case 5:$32=HEAP32[$dcode+84>>2]|0;if((HEAP8[$32+$_lcssa154|0]|0)==107){label=9;break}else{label=6;break};case 6:$37=HEAP32[_stderr>>2]|0;$39=__zbar_decoder_buf_dump($32,$_lcssa153)|0;_fprintf($37|0,4136,(tempInt=STACKTOP,STACKTOP=STACKTOP+48|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=335,HEAP32[tempInt+16>>2]=8984,HEAP32[tempInt+24>>2]=3680,HEAP32[tempInt+32>>2]=$_lcssa152&1,HEAP32[tempInt+40>>2]=$39,tempInt)|0)|0;$_0=1;label=37;break;case 7:$44=$3>>>4<<20>>20;$47=HEAP32[$dcode+84>>2]|0;if((HEAP8[$47+($44-1)|0]|0)==106){label=9;break}else{label=8;break};case 8:$52=HEAP32[_stderr>>2]|0;$53=__zbar_decoder_buf_dump($47,$44)|0;_fprintf($52|0,4136,(tempInt=STACKTOP,STACKTOP=STACKTOP+48|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=340,HEAP32[tempInt+16>>2]=8984,HEAP32[tempInt+24>>2]=3136,HEAP32[tempInt+32>>2]=$4,HEAP32[tempInt+40>>2]=$53,tempInt)|0)|0;$_0=1;label=37;break;case 9:$56=$dcode+84|0;$57=HEAP32[$56>>2]|0;$58=HEAP8[$57]|0;if(($58-103&255)<3){label=11;break}else{label=10;break};case 10:$62=HEAP32[_stderr>>2]|0;$67=__zbar_decoder_buf_dump($57,(HEAP32[$2>>2]|0)>>>4<<20>>20)|0;_fprintf($62|0,2736,(tempInt=STACKTOP,STACKTOP=STACKTOP+40|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=344,HEAP32[tempInt+16>>2]=8984,HEAP32[tempInt+24>>2]=2400,HEAP32[tempInt+32>>2]=$67,tempInt)|0)|0;$_0=1;label=37;break;case 11:$70=$58-103&255;$72=$58<<24>>24==105&1;$76=(HEAP32[$2>>2]|0)>>>4<<20>>20;if(($76-2|0)>>>0>1){$j_0144=0;$charset_0145=$70;$cexp_0146=$72;$i_1147=1;$79=$76;label=12;break}else{$j_0_lcssa=0;$charset_0_lcssa=$70;$cexp_0_lcssa=$72;$i_1_lcssa=1;$_lcssa=$76;label=32;break};case 12:$80=HEAP32[$56>>2]|0;$82=HEAP8[$80+$i_1147|0]|0;$83=$82&255;if(($83&128|0)==0){label=14;break}else{label=13;break};case 13:$87=HEAP32[_stderr>>2]|0;$89=__zbar_decoder_buf_dump($80,$79)|0;_fprintf($87|0,1976,(tempInt=STACKTOP,STACKTOP=STACKTOP+80|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=355,HEAP32[tempInt+16>>2]=8984,HEAP32[tempInt+24>>2]=1736,HEAP32[tempInt+32>>2]=$i_1147,HEAP32[tempInt+40>>2]=$j_0144,HEAP32[tempInt+48>>2]=$83,HEAP32[tempInt+56>>2]=$charset_0145&255,HEAP32[tempInt+64>>2]=$cexp_0146,HEAP32[tempInt+72>>2]=$89,tempInt)|0)|0;$_0=1;label=37;break;case 14:$92=$charset_0145&255;$94=($92&2|0)!=0;if($94&($82&255)<100){$i_3=$i_1147;$cexp_2=$cexp_0146;$charset_2=$charset_0145;$j_2=$j_0144;label=31;break}else{label=15;break};case 15:if(($82&255)<96){label=16;break}else{label=19;break};case 16:$99=$82+32&255;if(($charset_0145<<24>>24|0)==0|($charset_0145<<24>>24|0)==(-127|0)){label=17;break}else{$code2_0=$99;label=18;break};case 17:$code2_0=($99&255)>95?$82-64&255:$99;label=18;break;case 18:HEAP8[(HEAP32[$56>>2]|0)+$j_0144|0]=$code2_0;$i_3=$i_1147;$cexp_2=$cexp_0146;$charset_2=($92&128|0)==0?$charset_0145:$charset_0145&127;$j_2=$j_0144+1|0;label=31;break;case 19:if($94){label=20;break}else{$i_2=$i_1147;$cexp_1=$cexp_0146;$j_1=$j_0144;label=23;break};case 20:if(($cexp_0146|0)==0){label=21;break}else{label=22;break};case 21:$114=HEAP32[_stderr>>2]|0;$115=__zbar_decoder_buf_dump($80,$79)|0;_fprintf($114|0,1976,(tempInt=STACKTOP,STACKTOP=STACKTOP+80|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=377,HEAP32[tempInt+16>>2]=8984,HEAP32[tempInt+24>>2]=7696,HEAP32[tempInt+32>>2]=$i_1147,HEAP32[tempInt+40>>2]=$j_0144,HEAP32[tempInt+48>>2]=$83,HEAP32[tempInt+56>>2]=$92,HEAP32[tempInt+64>>2]=$cexp_0146,HEAP32[tempInt+72>>2]=$115,tempInt)|0)|0;$_0=1;label=37;break;case 22:$118=_postprocess_c($dcode,$cexp_0146,$i_1147,$j_0144)|0;$i_2=$118+$i_1147|0;$cexp_1=0;$j_1=($118<<1)+$j_0144|0;label=23;break;case 23:if(($82&255)<99){label=24;break}else{label=25;break};case 24:$charset_1=$82<<24>>24==98?$charset_0145|-128:$charset_0145;label=30;break;case 25:if($82<<24>>24==102){$charset_1=$charset_0145;label=30;break}else{label=26;break};case 26:if(($82&255)>102){$_0=1;label=37;break}else{label=27;break};case 27:if(($82&255)<102){label=29;break}else{label=28;break};case 28:$133=HEAP32[_stderr>>2]|0;$139=__zbar_decoder_buf_dump(HEAP32[$56>>2]|0,(HEAP32[$2>>2]|0)>>>4<<20>>20)|0;_fprintf($133|0,1976,(tempInt=STACKTOP,STACKTOP=STACKTOP+80|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=402,HEAP32[tempInt+16>>2]=8984,HEAP32[tempInt+24>>2]=7472,HEAP32[tempInt+32>>2]=$i_2,HEAP32[tempInt+40>>2]=$j_1,HEAP32[tempInt+48>>2]=$83,HEAP32[tempInt+56>>2]=$92,HEAP32[tempInt+64>>2]=$cexp_1,HEAP32[tempInt+72>>2]=$139,tempInt)|0)|0;$_0=1;label=37;break;case 29:$charset_1=101-$82&255;label=30;break;case 30:$i_3=$i_2;$cexp_2=($charset_1&2)==0?$cexp_1:$i_2+1|0;$charset_2=$charset_1;$j_2=$j_1;label=31;break;case 31:$148=$i_3+1|0;$152=(HEAP32[$2>>2]|0)>>>4<<20>>20;if($148>>>0<($152-2|0)>>>0){$j_0144=$j_2;$charset_0145=$charset_2;$cexp_0146=$cexp_2;$i_1147=$148;$79=$152;label=12;break}else{$j_0_lcssa=$j_2;$charset_0_lcssa=$charset_2;$cexp_0_lcssa=$cexp_2;$i_1_lcssa=$148;$_lcssa=$152;label=32;break};case 32:$155=$charset_0_lcssa&255;if(($155&2|0)==0){$j_3=$j_0_lcssa;label=36;break}else{label=33;break};case 33:if(($cexp_0_lcssa|0)==0){label=34;break}else{label=35;break};case 34:$161=HEAP32[_stderr>>2]|0;$163=__zbar_decoder_buf_dump(HEAP32[$56>>2]|0,$_lcssa)|0;_fprintf($161|0,1976,(tempInt=STACKTOP,STACKTOP=STACKTOP+80|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=417,HEAP32[tempInt+16>>2]=8984,HEAP32[tempInt+24>>2]=7696,HEAP32[tempInt+32>>2]=$i_1_lcssa,HEAP32[tempInt+40>>2]=$j_0_lcssa,HEAP32[tempInt+48>>2]=$58&255,HEAP32[tempInt+56>>2]=$155,HEAP32[tempInt+64>>2]=$cexp_0_lcssa,HEAP32[tempInt+72>>2]=$163,tempInt)|0)|0;$_0=1;label=37;break;case 35:$j_3=((_postprocess_c($dcode,$cexp_0_lcssa,$i_1_lcssa,$j_0_lcssa)|0)<<1)+$j_0_lcssa|0;label=36;break;case 36:HEAP32[$dcode+80>>2]=$j_3;HEAP8[(HEAP32[$56>>2]|0)+$j_3|0]=0;HEAP32[$2>>2]=HEAP32[$2>>2]&-65521|$j_3<<4&65520;$_0=0;label=37;break;case 37:STACKTOP=__stackBase__;return $_0|0}return 0}function _postprocess_c($dcode,$start,$end,$dst){$dcode=$dcode|0;$start=$start|0;$end=$end|0;$dst=$dst|0;var $1=0,$3=0,$8=0,$10=0,$11=0,$j_065=0,$i_064=0,$26=0,$28=0,$34=0,$code_0=0,$42=0,$code_1=0,$50=0,$code_2=0,$58=0,$code_3=0,$62=0,$67=0,$72=0,$77=0,$82=0,$88=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$1=$end-$start|0;$3=$dcode+236|0;$8=((HEAP32[$3>>2]|0)>>>4<<20>>20)+$1|0;_size_buf($dcode,$8)|0;$10=$dcode+84|0;$11=HEAP32[$10>>2]|0;_memmove($11+$end|0,$11+$start|0,((HEAP32[$3>>2]|0)>>>4<<20>>20)-$start|0);HEAP32[$3>>2]=HEAP32[$3>>2]&-65521|$8<<4&65520;if(($end|0)==($start|0)){label=15;break}else{$i_064=0;$j_065=$dst;label=2;break};case 2:$26=HEAP32[$10>>2]|0;$28=HEAP8[$26+($i_064+$end)|0]|0;HEAP8[$26+$j_065|0]=48;if(($28&255)>49){label=3;break}else{$code_0=$28;label=4;break};case 3:$34=(HEAP32[$10>>2]|0)+$j_065|0;HEAP8[$34]=(HEAP8[$34]|0)+5&255;$code_0=$28-50&255;label=4;break;case 4:if(($code_0&255)>29){label=5;break}else{$code_1=$code_0;label=6;break};case 5:$42=(HEAP32[$10>>2]|0)+$j_065|0;HEAP8[$42]=(HEAP8[$42]|0)+3&255;$code_1=$code_0-30&255;label=6;break;case 6:if(($code_1&255)>19){label=7;break}else{$code_2=$code_1;label=8;break};case 7:$50=(HEAP32[$10>>2]|0)+$j_065|0;HEAP8[$50]=(HEAP8[$50]|0)+2&255;$code_2=$code_1-20&255;label=8;break;case 8:if(($code_2&255)>9){label=9;break}else{$code_3=$code_2;label=10;break};case 9:$58=(HEAP32[$10>>2]|0)+$j_065|0;HEAP8[$58]=(HEAP8[$58]|0)+1&255;$code_3=$code_2-10&255;label=10;break;case 10:$62=HEAP32[$10>>2]|0;if((HEAPU8[$62+$j_065|0]|0)<58){label=12;break}else{label=11;break};case 11:$67=HEAP32[_stderr>>2]|0;$72=__zbar_decoder_buf_dump($62,(HEAP32[$3>>2]|0)>>>4<<20>>20)|0;_fprintf($67|0,7240,(tempInt=STACKTOP,STACKTOP=STACKTOP+72|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=308,HEAP32[tempInt+16>>2]=8968,HEAP32[tempInt+24>>2]=6920,HEAP32[tempInt+32>>2]=$start,HEAP32[tempInt+40>>2]=$end,HEAP32[tempInt+48>>2]=$i_064,HEAP32[tempInt+56>>2]=$j_065,HEAP32[tempInt+64>>2]=$72,tempInt)|0)|0;label=15;break;case 12:if(($code_3&255)<10){label=14;break}else{label=13;break};case 13:$77=HEAP32[_stderr>>2]|0;$82=__zbar_decoder_buf_dump($62,(HEAP32[$3>>2]|0)>>>4<<20>>20)|0;_fprintf($77|0,7240,(tempInt=STACKTOP,STACKTOP=STACKTOP+72|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=311,HEAP32[tempInt+16>>2]=8968,HEAP32[tempInt+24>>2]=6704,HEAP32[tempInt+32>>2]=$start,HEAP32[tempInt+40>>2]=$end,HEAP32[tempInt+48>>2]=$i_064,HEAP32[tempInt+56>>2]=$j_065,HEAP32[tempInt+64>>2]=$82,tempInt)|0)|0;label=15;break;case 14:HEAP8[$62+($j_065+1)|0]=$code_3+48&255;$88=$i_064+1|0;if($88>>>0<$1>>>0){$i_064=$88;$j_065=$j_065+2|0;label=2;break}else{label=15;break};case 15:STACKTOP=__stackBase__;return $1|0}return 0}function _calc_check($c){$c=$c|0;var $3=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if($c<<24>>24>-1){$_0=24;label=8;break}else{label=2;break};case 2:$3=$c&127;if(($3&255)<61){label=3;break}else{label=5;break};case 3:if(($3&255)<48){label=4;break}else{$_0=32;label=8;break};case 4:$_0=$3<<24>>24!=23?16:32;label=8;break;case 5:if(($3&255)<80){label=6;break}else{label=7;break};case 6:$_0=$3<<24>>24==77?32:16;label=8;break;case 7:$_0=($3&255)<103?32:16;label=8;break;case 8:return $_0|0}return 0}function _decode_e526($e,$s){$e=$e|0;$s=$s|0;var $6=0;$6=(((($e*72&-1|1)>>>0)/($s>>>0)>>>0)+509|0)>>>1&255;return($6>>>0>32?-1:$6)|0}function _decode_hi($sig){$sig=$sig|0;var $2=0,$3=0,$_09=0,$rev_0=0,$idx_0=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=($sig&17408|0)!=0;$3=$2&1;if($2){label=2;break}else{$_09=$sig;label=3;break};case 2:$_09=$sig>>>12&15|$sig>>>4&240|$sig<<4&3840|$sig<<12&61440;label=3;break;case 3:if(($_09|0)==37){label=4;break}else if(($_09|0)==52){label=5;break}else if(($_09|0)==308){label=6;break}else if(($_09|0)==323){label=7;break}else if(($_09|0)==579){label=8;break}else if(($_09|0)==833){label=9;break}else if(($_09|0)==850){label=10;break}else if(($_09|0)==4132){label=11;break}else if(($_09|0)==4372){label=12;break}else if(($_09|0)==4404){label=13;break}else if(($_09|0)==4674){label=14;break}else if(($_09|0)==4675){label=15;break}else if(($_09|0)==5185){label=16;break}else if(($_09|0)==20){$idx_0=0;$rev_0=$3;label=17;break}else{$_0=-1;label=18;break};case 4:$idx_0=1;$rev_0=$3;label=17;break;case 5:$idx_0=2;$rev_0=$3;label=17;break;case 6:$idx_0=3;$rev_0=$3;label=17;break;case 7:$idx_0=4;$rev_0=$3;label=17;break;case 8:$idx_0=5;$rev_0=$3;label=17;break;case 9:$idx_0=6;$rev_0=$3;label=17;break;case 10:$idx_0=7;$rev_0=$3;label=17;break;case 11:$idx_0=8;$rev_0=$3;label=17;break;case 12:$idx_0=9;$rev_0=$3;label=17;break;case 13:$idx_0=10;$rev_0=$3;label=17;break;case 14:$idx_0=11;$rev_0=$3;label=17;break;case 15:$idx_0=12;$rev_0=$3;label=17;break;case 16:$idx_0=13;$rev_0=0;label=17;break;case 17:$_0=HEAP8[(($rev_0<<24>>24==0?$idx_0:$idx_0+14&255)&255)+1465|0]|0;label=18;break;case 18:return $_0|0}return 0}function _get_width522($dcode,$offset){$dcode=$dcode|0;$offset=$offset|0;return HEAP32[$dcode+4+(((HEAPU8[$dcode|0]|0)-($offset&255)&15)<<2)>>2]|0}function _get_color523($dcode){$dcode=$dcode|0;return HEAP8[$dcode|0]&1|0}function _code39_postprocess($dcode){$dcode=$dcode|0;var $2=0,$8=0,$11=0,$16=0,$18=0,$i_025=0,$20=0,$21=0,$22=0,$23=0,$28=0,$32=0,$i_123=0,$38=0,$_off0=0,$47=0,$i_1_lcssa=0,label=0;label=1;while(1)switch(label|0){case 1:$2=$dcode+212|0;if((HEAP32[$2>>2]&1|0)==0){label=4;break}else{label=2;break};case 2:$8=(HEAP32[$2>>2]|0)>>>5<<20;if(($8|0)>1048576){label=3;break}else{label=4;break};case 3:$11=$dcode+84|0;$i_025=0;$18=$8>>20;label=6;break;case 4:if(((HEAP32[$2>>2]|0)>>>5<<20|0)>0){label=5;break}else{$i_1_lcssa=0;label=10;break};case 5:$16=$dcode+84|0;$i_123=0;label=7;break;case 6:$20=$18+($i_025^-1)|0;$21=HEAP32[$11>>2]|0;$22=$21+$i_025|0;$23=HEAP8[$22]|0;HEAP8[$22]=HEAP8[$21+$20|0]|0;HEAP8[(HEAP32[$11>>2]|0)+$20|0]=$23;$28=$i_025+1|0;$32=(HEAP32[$2>>2]|0)>>>5<<20>>20;if(($28|0)<(($32|0)/2&-1|0)){$i_025=$28;$18=$32;label=6;break}else{label=4;break};case 7:$38=HEAP8[(HEAP32[$16>>2]|0)+$i_123|0]|0;if(($38&255)<43){label=8;break}else{$_off0=63;label=9;break};case 8:$_off0=HEAP8[1336+($38&255)|0]|0;label=9;break;case 9:HEAP8[(HEAP32[$16>>2]|0)+$i_123|0]=$_off0;$47=$i_123+1|0;if(($47|0)<((HEAP32[$2>>2]|0)>>>5<<20>>20|0)){$i_123=$47;label=7;break}else{$i_1_lcssa=$47;label=10;break};case 10:HEAP32[$dcode+80>>2]=$i_1_lcssa;HEAP8[(HEAP32[$dcode+84>>2]|0)+$i_1_lcssa|0]=0;return}}function _get_lock524($dcode){$dcode=$dcode|0;var $1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+72|0;if((HEAP32[$1>>2]|0)==0){label=2;break}else{$_0=1;label=3;break};case 2:HEAP32[$1>>2]=39;$_0=0;label=3;break;case 3:return $_0|0}return 0}function _get_width538($dcode,$offset){$dcode=$dcode|0;$offset=$offset|0;return HEAP32[$dcode+4+(((HEAPU8[$dcode|0]|0)-($offset&255)&15)<<2)>>2]|0}function _decode_lo($sig){$sig=$sig|0;var $11=0,$13=0,$idx_0=0,$24=0,$32=0,$33=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$11=$sig>>>1&1|$sig>>>3&6|$sig>>>5&24|$sig>>>7&96;$13=HEAP8[216+$11|0]|0;$idx_0=($sig&1|0)==0?($13&255)>>>4:$13&15;if($idx_0<<24>>24==15){$_0=-1;label=7;break}else{label=2;break};case 2:$24=$sig>>>11&255|$sig>>>9&1;if($24>>>0<8){label=4;break}else{label=3;break};case 3:_fprintf(HEAP32[_stderr>>2]|0,5768,(tempInt=STACKTOP,STACKTOP=STACKTOP+64|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=132,HEAP32[tempInt+16>>2]=9248,HEAP32[tempInt+24>>2]=5624,HEAP32[tempInt+32>>2]=$sig,HEAP32[tempInt+40>>2]=$11,HEAP32[tempInt+48>>2]=$idx_0&255,HEAP32[tempInt+56>>2]=$24,tempInt)|0)|0;$_0=-1;label=7;break;case 4:$32=(HEAP8[344+$24|0]|0)+$idx_0&255;$33=$32&255;if(($32&255)<81){label=6;break}else{label=5;break};case 5:_fprintf(HEAP32[_stderr>>2]|0,5416,(tempInt=STACKTOP,STACKTOP=STACKTOP+64|0,HEAP32[tempInt>>2]=6648,HEAP32[tempInt+8>>2]=136,HEAP32[tempInt+16>>2]=9248,HEAP32[tempInt+24>>2]=5264,HEAP32[tempInt+32>>2]=$sig,HEAP32[tempInt+40>>2]=$11,HEAP32[tempInt+48>>2]=$24,HEAP32[tempInt+56>>2]=$33,tempInt)|0)|0;$_0=-1;label=7;break;case 6:$_0=HEAP8[1384+$33|0]|0;label=7;break;case 7:STACKTOP=__stackBase__;return $_0|0}return 0}function __zbar_decode_code39($dcode){$dcode=$dcode|0;var $2=0,$3=0,$5=0,$8=0,$9=0,$20=0,$23=0,$28=0,$29=0,$31=0,$56=0,$62=0,$85=0,$100=0,$115=0,$118=0,$119=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$2=_get_width522($dcode,9)|0;$3=$dcode+216|0;$5=(HEAP32[$3>>2]|0)-$2|0;HEAP32[$3>>2]=$5;HEAP32[$3>>2]=$5+(_get_width522($dcode,0)|0);$8=$dcode+212|0;$9=HEAP32[$8>>2]|0;if(($9&65536|0)==0){label=4;break}else{label=2;break};case 2:if((_get_color523($dcode)|0)<<24>>24==1){label=3;break}else{$_0=0;label=27;break};case 3:$_0=(_code39_decode_start($dcode)|0)<<24>>24;label=27;break;case 4:$20=($9>>>1)+1&15;$23=$20<<1|$9&-31;HEAP32[$8>>2]=$23;if($20>>>0<9){$_0=0;label=27;break}else{label=5;break};case 5:if(($20|0)==10){label=6;break}else{label=17;break};case 6:$28=_get_width522($dcode,0)|0;$29=$9>>>5;$31=$29<<20>>20;if(($31|0)==0){label=14;break}else{label=7;break};case 7:if((HEAP8[(HEAP32[$dcode+84>>2]|0)+($31-1)|0]|0)==43){label=8;break}else{label=14;break};case 8:HEAP32[$8>>2]=$23&-131041|($29<<5)+131040&131040;if(($28|0)==0){label=10;break}else{label=9;break};case 9:if($28>>>0<(HEAP32[$dcode+220>>2]|0)>>>1>>>0){label=13;break}else{label=10;break};case 10:$56=(HEAP32[$8>>2]|0)>>>5<<20>>20;if(($56|0)<(HEAP32[$dcode+228>>2]|0)){label=13;break}else{label=11;break};case 11:$62=HEAP32[$dcode+232>>2]|0;if(($62|0)>0&($56|0)>($62|0)){label=13;break}else{label=12;break};case 12:_code39_postprocess($dcode);HEAP32[$8>>2]=HEAP32[$8>>2]|131040;$_0=39;label=27;break;case 13:HEAP32[$8>>2]=HEAP32[$8>>2]|131040;HEAP32[$dcode+72>>2]=0;$_0=0;label=27;break;case 14:if($28>>>0>(HEAP32[$dcode+220>>2]|0)>>>1>>>0){label=15;break}else{label=16;break};case 15:HEAP32[$dcode+72>>2]=0;HEAP32[$8>>2]=HEAP32[$8>>2]|131040;label=16;break;case 16:HEAP32[$8>>2]=HEAP32[$8>>2]&-31;$_0=0;label=27;break;case 17:$85=_code39_decode9($dcode)|0;if((HEAP32[$8>>2]&131040|0)==0){label=18;break}else{label=20;break};case 18:if((_get_lock524($dcode)|0)<<24>>24==0){label=20;break}else{label=19;break};case 19:HEAP32[$8>>2]=HEAP32[$8>>2]|131040;$_0=1;label=27;break;case 20:if($85<<24>>24<0){label=23;break}else{label=21;break};case 21:$100=(HEAP32[$8>>2]|0)>>>5<<20;if(($100|0)>32505856){label=22;break}else{label=24;break};case 22:if((_size_buf525($dcode,($100>>20)+1|0)|0)<<24>>24==0){label=24;break}else{label=23;break};case 23:HEAP32[$dcode+72>>2]=0;HEAP32[$8>>2]=HEAP32[$8>>2]|131040;$_0=0;label=27;break;case 24:if($85<<24>>24<44){label=26;break}else{label=25;break};case 25:$115=HEAP32[$3>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,3408,(tempInt=STACKTOP,STACKTOP=STACKTOP+48|0,HEAP32[tempInt>>2]=6592,HEAP32[tempInt+8>>2]=320,HEAP32[tempInt+16>>2]=10064,HEAP32[tempInt+24>>2]=4720,HEAP32[tempInt+32>>2]=$85<<24>>24,HEAP32[tempInt+40>>2]=$115,tempInt)|0)|0;$_0=0;label=27;break;case 26:$118=HEAP32[$8>>2]|0;$119=$118>>>5;HEAP32[$8>>2]=($119<<5)+32&131040|$118&-131041;HEAP8[(HEAP32[$dcode+84>>2]|0)+($119<<20>>20)|0]=$85;$_0=0;label=27;break;case 27:STACKTOP=__stackBase__;return $_0|0}return 0}function _code39_decode_start($dcode){$dcode=$dcode|0;var $1=0,$2=0,$4=0,$8=0,$16=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+212|0;$2=_code39_decode9($dcode)|0;if(($2<<24>>24|0)==25){label=2;break}else if(($2<<24>>24|0)==43){label=3;break}else{$_0=0;label=6;break};case 2:$4=$1;HEAP32[$4>>2]=HEAP32[$4>>2]^1;label=3;break;case 3:$8=_get_width522($dcode,9)|0;if(($8|0)==0){label=5;break}else{label=4;break};case 4:if($8>>>0<(HEAP32[$dcode+216>>2]|0)>>>1>>>0){$_0=0;label=6;break}else{label=5;break};case 5:$16=$1;HEAP32[$16>>2]=HEAP32[$16>>2]&-131071|18;$_0=1;label=6;break;case 6:return $_0|0}return 0}function _code39_decode9($dcode){$dcode=$dcode|0;var $1=0,$2=0,$i_0=0,$enc_0=0,$7=0,$9=0,$13=0,$17=0,$21=0,$i_1=0,$enc_1=0,$28=0,$30=0,$34=0,$idx_0=0,$51=0,$56=0,$_sink_in=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$1=$dcode+212|0;$2=$dcode+216|0;if((HEAP32[$2>>2]|0)>>>0<9){$_0=-1;label=20;break}else{$enc_0=0;$i_0=0;label=2;break};case 2:if(($i_0&255)<5){label=3;break}else{label=4;break};case 3:$7=_get_width522($dcode,$i_0)|0;$9=_code39_decode1($enc_0,$7,HEAP32[$2>>2]|0)|0;if($9<<24>>24==-1){$_0=-1;label=20;break}else{$enc_0=$9;$i_0=$i_0+1&255;label=2;break};case 4:$13=$enc_0&255;if(($enc_0&255)<32){label=6;break}else{label=5;break};case 5:$17=HEAP32[$2>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,4072,(tempInt=STACKTOP,STACKTOP=STACKTOP+48|0,HEAP32[tempInt>>2]=6592,HEAP32[tempInt+8>>2]=161,HEAP32[tempInt+16>>2]=9440,HEAP32[tempInt+24>>2]=3664,HEAP32[tempInt+32>>2]=$13,HEAP32[tempInt+40>>2]=$17,tempInt)|0)|0;$_0=-1;label=20;break;case 6:$21=HEAP8[1168+$13|0]|0;if((-325007360>>>($13>>>0)&1|0)==0){$enc_1=$enc_0;$i_1=$i_0;label=7;break}else{$_0=-1;label=20;break};case 7:if(($i_1&255)<9){label=8;break}else{label=9;break};case 8:$28=_get_width522($dcode,$i_1)|0;$30=_code39_decode1($enc_1,$28,HEAP32[$2>>2]|0)|0;if($30<<24>>24==-1){$_0=-1;label=20;break}else{$enc_1=$30;$i_1=$i_1+1&255;label=7;break};case 9:$34=$21&192;if(($34|0)==128){label=10;break}else if(($34|0)==192){label=11;break}else if(($34|0)==0){$idx_0=$21;label=13;break}else{label=12;break};case 10:$idx_0=(($enc_1&255)>>>3&1)+($21&63)&255;label=13;break;case 11:$idx_0=(($enc_1&255)>>>2&1)+($21&63)&255;label=13;break;case 12:$idx_0=(($enc_1&255)>>>2&3)+($21&63)&255;label=13;break;case 13:$51=$idx_0&255;if(($idx_0&255)<44){label=15;break}else{label=14;break};case 14:$56=HEAP32[$2>>2]|0;_fprintf(HEAP32[_stderr>>2]|0,3064,(tempInt=STACKTOP,STACKTOP=STACKTOP+56|0,HEAP32[tempInt>>2]=6592,HEAP32[tempInt+8>>2]=181,HEAP32[tempInt+16>>2]=9440,HEAP32[tempInt+24>>2]=2720,HEAP32[tempInt+32>>2]=$51,HEAP32[tempInt+40>>2]=$enc_1&255,HEAP32[tempInt+48>>2]=$56,tempInt)|0)|0;$_0=-1;label=20;break;case 15:if($enc_1<<24>>24==(HEAP8[1200+($51*3&-1)|0]|0)){label=16;break}else{$_0=-1;label=20;break};case 16:HEAP32[$dcode+220>>2]=HEAP32[$2>>2];if((HEAP32[$1>>2]&1|0)==0){label=18;break}else{label=17;break};case 17:$_sink_in=1201+($51*3&-1)|0;label=19;break;case 18:$_sink_in=1202+($51*3&-1)|0;label=19;break;case 19:$_0=HEAP8[$_sink_in]|0;label=20;break;case 20:STACKTOP=__stackBase__;return $_0|0}return 0}function _size_buf525($dcode,$len){$dcode=$dcode|0;$len=$len|0;var $1=0,$2=0,$7=0,$_014=0,$12=0,$14=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+76|0;$2=HEAP32[$1>>2]|0;if($2>>>0>$len>>>0){$_0=0;label=7;break}else{label=2;break};case 2:if($len>>>0>256){$_0=1;label=7;break}else{label=3;break};case 3:$7=$2+16|0;if($7>>>0>$len>>>0){label=4;break}else{$_014=$len;label=5;break};case 4:$_014=$7>>>0>256?256:$7;label=5;break;case 5:$12=$dcode+84|0;$14=_realloc(HEAP32[$12>>2]|0,$_014)|0;if(($14|0)==0){$_0=1;label=7;break}else{label=6;break};case 6:HEAP32[$12>>2]=$14;HEAP32[$1>>2]=$_014;$_0=0;label=7;break;case 7:return $_0|0}return 0}function _code39_decode1($enc,$e,$s){$enc=$enc|0;$e=$e|0;$s=$s|0;var $2=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(_decode_e526($e,$s)|0)&255;if($2>>>0>7){$_0=-1;label=3;break}else{label=2;break};case 2:$_0=$2>>>0>2&1|$enc<<1;label=3;break;case 3:return $_0|0}return 0}function __zbar_decode_ean($dcode){$dcode=$dcode|0;var $3=0,$4=0,$5=0,$6=0,$8=0,$sym_024=0,$i_023=0,$17=0,$23=0,$26=0,$sym_1=0,$35=0,label=0;label=1;while(1)switch(label|0){case 1:$3=HEAP8[$dcode|0]&3;$4=_get_width538($dcode,4)|0;$5=$dcode+96|0;$6=$dcode+140|0;$8=(HEAP32[$6>>2]|0)-$4|0;HEAP32[$6>>2]=$8;HEAP32[$6>>2]=$8+(_get_width538($dcode,0)|0);$i_023=0;$sym_024=0;label=2;break;case 2:$17=$dcode+96+(($i_023&255)<<3)|0;if((HEAP8[$17|0]|0)>-1|$i_023<<24>>24==$3<<24>>24){label=3;break}else{$sym_1=$sym_024;label=8;break};case 3:$23=_decode_pass($dcode,$17)|0;if(($23|0)==0){$sym_1=$sym_024;label=8;break}else{label=4;break};case 4:$26=_integrate_partial($5,$17,$23)|0;if(($26|0)==0){$sym_1=0;label=8;break}else{label=5;break};case 5:HEAP8[$dcode+104|0]=-1;HEAP8[$5|0]=-1;HEAP8[$dcode+120|0]=-1;HEAP8[$dcode+112|0]=-1;if($26>>>0>1){label=6;break}else{$sym_1=1;label=8;break};case 6:if((_get_lock539($dcode)|0)<<24>>24==0){label=7;break}else{$sym_1=1;label=8;break};case 7:_postprocess540($dcode,$26);$sym_1=$26;label=8;break;case 8:$35=$i_023+1&255;if(($35&255)<4){$i_023=$35;$sym_024=$sym_1;label=2;break}else{label=9;break};case 9:return $sym_1|0}return 0}function _decode_pass($dcode,$pass){$dcode=$dcode|0;$pass=$pass|0;var $1=0,$3=0,$4=0,$5=0,$18=0,$31=0,$idx_0=0,$36=0,$idx_1=0,$part1_0=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$pass|0;$3=(HEAP8[$1]|0)+1&255;HEAP8[$1]=$3;$4=$3&31;$5=$3&1;if((_get_color541($dcode)|0)<<24>>24==0){label=2;break}else{label=6;break};case 2:if(($4-16&255)<2){label=3;break}else{label=6;break};case 3:if((HEAP32[$dcode+168>>2]&1|0)==0){label=6;break}else{label=4;break};case 4:if((_aux_end($dcode,$5)|0)<<24>>24==0){label=5;break}else{label=6;break};case 5:$18=_ean_part_end4($pass,$5)|0;HEAP8[$1]=-1;$_0=$18;label=19;break;case 6:if(($3&3)==0&($4&255)<21){label=7;break}else{$idx_1=$4;label=14;break};case 7:if((HEAP32[$dcode+140>>2]|0)==0){$_0=0;label=19;break}else{label=8;break};case 8:if((HEAP8[$1]|0)==0){label=9;break}else{$idx_0=$4;label=11;break};case 9:$31=_aux_start($dcode)|0;HEAP8[$1]=$31;if($31<<24>>24<0){$_0=0;label=19;break}else{label=10;break};case 10:$idx_0=$31&31;label=11;break;case 11:$36=_decode4($dcode)|0;if($36<<24>>24<0){label=12;break}else{label=13;break};case 12:HEAP8[$1]=-1;$idx_1=$idx_0;label=14;break;case 13:HEAP8[(($idx_0&255)>>>2)+1+($pass+1)|0]=HEAP8[840+($36&255)|0]|0;$idx_1=$idx_0;label=14;break;case 14:if((_get_color541($dcode)|0)<<24>>24==0){label=15;break}else{$_0=0;label=19;break};case 15:if(($idx_1-24&255)<2){label=16;break}else{$_0=0;label=19;break};case 16:if((_aux_end($dcode,$5)|0)<<24>>24==0){label=17;break}else{$part1_0=0;label=18;break};case 17:$part1_0=_ean_part_end7($dcode+96|0,$pass,$5)|0;label=18;break;case 18:HEAP8[$1]=-1;$_0=$part1_0;label=19;break;case 19:return $_0|0}return 0}function _get_lock539($dcode){$dcode=$dcode|0;var $1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+72|0;if((HEAP32[$1>>2]|0)==0){label=2;break}else{$_0=1;label=3;break};case 2:HEAP32[$1>>2]=13;$_0=0;label=3;break;case 3:return $_0|0}return 0}function _ean_get_config($ean,$sym){$ean=$ean|0;$sym=$sym|0;var $1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$sym&255;if(($1|0)==13){label=2;break}else if(($1|0)==8){label=3;break}else if(($1|0)==12){label=4;break}else if(($1|0)==9){label=5;break}else if(($1|0)==10){label=6;break}else if(($1|0)==14){label=7;break}else{$_0=0;label=8;break};case 2:$_0=HEAP32[$ean+68>>2]|0;label=8;break;case 3:$_0=HEAP32[$ean+72>>2]|0;label=8;break;case 4:$_0=HEAP32[$ean+76>>2]|0;label=8;break;case 5:$_0=HEAP32[$ean+80>>2]|0;label=8;break;case 6:$_0=HEAP32[$ean+84>>2]|0;label=8;break;case 7:$_0=HEAP32[$ean+88>>2]|0;label=8;break;case 8:return $_0|0}return 0}function _ean_expand_upce($ean,$pass){$ean=$ean|0;$pass=$pass|0;var $6=0,$32=0,$38=0,$42=0,$49=0,$_off043=0,label=0;label=1;while(1)switch(label|0){case 1:HEAP8[$ean+60|0]=HEAP8[$pass+1|0]|0;$6=HEAP8[$pass+7|0]&15;HEAP8[$ean+48|0]=0;HEAP8[$ean+49|0]=0;HEAP8[$ean+50|0]=HEAP8[$pass+2|0]&15;HEAP8[$ean+51|0]=HEAP8[$pass+3|0]&15;if(($6&255)<3){label=6;break}else{label=2;break};case 2:HEAP8[$ean+52|0]=HEAP8[$pass+4|0]&15;if(($6&255)<4){label=7;break}else{label=3;break};case 3:HEAP8[$ean+53|0]=HEAP8[$pass+5|0]&15;if(($6&255)<5){label=4;break}else{label=5;break};case 4:HEAP8[$ean+54|0]=0;$32=$ean+55|0;tempBigInt=0;HEAP8[$32]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$32+1|0]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$32+2|0]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$32+3|0]=tempBigInt&255;label=9;break;case 5:HEAP8[$ean+54|0]=HEAP8[$pass+6|0]&15;$38=$ean+55|0;tempBigInt=0;HEAP8[$38]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$38+1|0]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$38+2|0]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$38+3|0]=tempBigInt&255;$_off043=$6;label=10;break;case 6:HEAP8[$ean+52|0]=$6;$42=$ean+53|0;tempBigInt=0;HEAP8[$42]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$42+1|0]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$42+2|0]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$42+3|0]=tempBigInt&255;HEAP8[$ean+57|0]=HEAP8[$pass+4|0]&15;label=8;break;case 7:$49=$ean+53|0;tempBigInt=0;HEAP8[$49]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$49+1|0]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$49+2|0]=tempBigInt&255;tempBigInt=tempBigInt>>8;HEAP8[$49+3|0]=tempBigInt&255;HEAP8[$ean+57|0]=0;label=8;break;case 8:HEAP8[$ean+58|0]=HEAP8[$pass+5|0]&15;label=9;break;case 9:$_off043=HEAP8[$pass+6|0]&15;label=10;break;case 10:HEAP8[$ean+59|0]=$_off043;return}}function _get_color541($dcode){$dcode=$dcode|0;return HEAP8[$dcode|0]&1|0}function _ean_part_end4($pass,$fwd){$pass=$pass|0;$fwd=$fwd|0;var $1=0,$5=0,$10=0,$15=0,$19=0,$21=0,$27=0,$29=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$pass+2|0;$5=$pass+3|0;$10=$pass+4|0;$15=$pass+5|0;$19=(HEAPU8[$5]|0)>>>2&4|(HEAPU8[$1]|0)>>>1&8|(HEAPU8[$10]|0)>>>3&2|(HEAPU8[$15]|0)>>>4&1;if(($19<<24>>24|0)==0|($19<<24>>24|0)==15){label=2;break}else{$_0=0;label=5;break};case 2:$21=$19<<24>>24!=0;if(($21&1^1|0)==($fwd&255|0)){label=3;break}else{label=4;break};case 3:$27=HEAP8[$1]|0;HEAP8[$1]=HEAP8[$15]|0;HEAP8[$15]=$27;$29=HEAP8[$5]|0;HEAP8[$5]=HEAP8[$10]|0;HEAP8[$10]=$29;label=4;break;case 4:$_0=$21?8:4104;label=5;break;case 5:return $_0|0}return 0}function _integrate_partial($ean,$pass,$part){$ean=$ean|0;$pass=$pass|0;$part=$part|0;var $5=0,$7=0,$11=0,$i_0116=0,$14=0,$28=0,$34=0,$35=0,$42=0,$54=0,$55=0,$58=0,$i_1115=0,$j_0114=0,$64=0,$78=0,$86=0,$87=0,$93=0,$i_2113=0,$j_1112=0,$97=0,$110=0,$_0=0,$122=0,$_1=0,$_1104=0,$_2=0,$135=0,$136=0,$144=0,$151=0,$_3=0,$_3109=0,$_4=0,label=0;label=1;while(1)switch(label|0){case 1:if(($part&1792|0)==0){label=8;break}else{label=2;break};case 2:$5=($part|0)==1280?4:1;$7=$ean+40|0;$i_0116=$5;$11=$5&255;label=3;break;case 3:$14=HEAP8[$pass+1+$11|0]&15;if((HEAP32[$7>>2]|0)==0){label=6;break}else{label=4;break};case 4:if((HEAP8[$11+13+($ean+48)|0]|0)==($14&255|0)){label=6;break}else{label=5;break};case 5:HEAP32[$7>>2]=0;HEAP32[$ean+36>>2]=0;HEAP32[$ean+32>>2]=0;label=6;break;case 6:HEAP8[$11+13+($ean+48)|0]=$14;$28=$i_0116-1&255;if($28<<24>>24>-1){$i_0116=$28;$11=$28<<24>>24;label=3;break}else{label=7;break};case 7:HEAP32[$ean+40>>2]=$part;$_0=$part;label=28;break;case 8:$34=$ean+32|0;$35=HEAP32[$34>>2]|0;if(($35|0)==0){label=10;break}else{label=9;break};case 9:if(($part&255|0)==($35|0)){label=10;break}else{label=12;break};case 10:$42=HEAP32[$ean+36>>2]|0;if(($42|0)==0){label=13;break}else{label=11;break};case 11:if(($part&255|0)==($42|0)){label=13;break}else{label=12;break};case 12:HEAP32[$ean+40>>2]=0;HEAP32[$ean+36>>2]=0;HEAP32[$34>>2]=0;label=13;break;case 13:if(($part&4096|0)==0){label=20;break}else{label=14;break};case 14:$54=$part&255;$55=($54|0)==13;$58=$ean+36|0;$j_0114=$55?12:7;$i_1115=$55?6:4;label=15;break;case 15:$64=HEAP8[($i_1115<<24>>24)+($pass+1)|0]&15;if((HEAP32[$58>>2]|0)==0){label=18;break}else{label=16;break};case 16:if((HEAP8[($j_0114<<24>>24)+($ean+48)|0]|0)==($64&255|0)){label=18;break}else{label=17;break};case 17:HEAP32[$ean+40>>2]=0;HEAP32[$58>>2]=0;HEAP32[$34>>2]=0;label=18;break;case 18:HEAP8[($j_0114<<24>>24)+($ean+48)|0]=$64;$78=$i_1115-1&255;if($78<<24>>24==0){label=19;break}else{$j_0114=$j_0114-1&255;$i_1115=$78;label=15;break};case 19:HEAP32[$ean+36>>2]=$54;$_0=$54;label=28;break;case 20:if(($part|0)==9){label=27;break}else{label=21;break};case 21:$86=($part|0)==13;$87=$86?6:3;$j_1112=$87;$i_2113=$86?6:4;$93=$87&255;label=22;break;case 22:$97=HEAP8[($i_2113<<24>>24)+($pass+1)|0]&15;if((HEAP32[$34>>2]|0)==0){label=25;break}else{label=23;break};case 23:if((HEAP8[$ean+48+$93|0]|0)==($97&255|0)){label=25;break}else{label=24;break};case 24:HEAP32[$ean+40>>2]=0;HEAP32[$ean+36>>2]=0;HEAP32[$34>>2]=0;label=25;break;case 25:HEAP8[$ean+48+$93|0]=$97;$110=$j_1112-1&255;if($110<<24>>24>-1){$j_1112=$110;$i_2113=$i_2113-1&255;$93=$110<<24>>24;label=22;break}else{label=26;break};case 26:HEAP32[$34>>2]=$part;$_0=$part;label=28;break;case 27:_ean_expand_upce($ean,$pass);$_1104=9;label=31;break;case 28:if(($_0&255|0)==9){$_1=$_0;label=30;break}else{label=29;break};case 29:$122=HEAP32[$ean+36>>2]&HEAP32[$ean+32>>2];$_1=($122|0)==0?1:$122;label=30;break;case 30:if(($_1|0)==13|($_1|0)==9){$_1104=$_1;label=31;break}else if(($_1|0)==8){label=33;break}else{$_2=$_1;label=34;break};case 31:if((_ean_verify_checksum($ean,12)|0)<<24>>24==0){label=32;break}else{$_4=0;label=50;break};case 32:if(($_1104|0)==8){label=33;break}else{$_2=$_1104;label=34;break};case 33:if((_ean_verify_checksum($ean,7)|0)<<24>>24==0){$_3109=8;label=49;break}else{$_4=0;label=50;break};case 34:if(($_2|0)==13){label=35;break}else if(($_2|0)==9){label=44;break}else{$_3=$_2;label=48;break};case 35:$135=$ean+48|0;$136=HEAP8[$135]|0;if($136<<24>>24==0){label=36;break}else{$144=$136;label=38;break};case 36:if((HEAP32[$ean+76>>2]&1|0)==0){label=37;break}else{$_3109=12;label=49;break};case 37:$144=HEAP8[$135]|0;label=38;break;case 38:if($144<<24>>24==9){label=39;break}else{$_3=$_2;label=48;break};case 39:if((HEAP8[$ean+49|0]|0)==7){label=40;break}else{$_3=$_2;label=48;break};case 40:$151=$ean+50|0;if((HEAP8[$151]|0)==8){label=41;break}else{label=42;break};case 41:if((HEAP32[$ean+84>>2]&1|0)==0){label=42;break}else{$_3109=10;label=49;break};case 42:if(((HEAP8[$151]|0)-8&255)<2){label=43;break}else{$_3=$_2;label=48;break};case 43:$_3=(HEAP32[$ean+88>>2]&1|0)==0?$_2:14;label=48;break;case 44:if((HEAP32[$ean+80>>2]&1|0)==0){label=46;break}else{label=45;break};case 45:HEAP8[$ean+49|0]=0;HEAP8[$ean+48|0]=0;HEAP8[$ean+50|0]=HEAP8[$pass+2|0]&15;HEAP8[$ean+51|0]=HEAP8[$pass+3|0]&15;HEAP8[$ean+52|0]=HEAP8[$pass+4|0]&15;HEAP8[$ean+53|0]=HEAP8[$pass+5|0]&15;HEAP8[$ean+54|0]=HEAP8[$pass+6|0]&15;HEAP8[$ean+55|0]=HEAP8[$pass+7|0]&15;HEAP8[$ean+56|0]=HEAP8[$pass+1|0]&15;$_3=$_2;label=48;break;case 46:if((HEAP32[$ean+76>>2]&1|0)==0){label=47;break}else{$_3109=12;label=49;break};case 47:$_3=(HEAP32[$ean+68>>2]&1|0)==0?0:13;label=48;break;case 48:if($_3>>>0>1){$_3109=$_3;label=49;break}else{$_4=$_3;label=50;break};case 49:$_4=HEAP32[$ean+40>>2]|$_3109;label=50;break;case 50:return $_4|0}return 0}function _postprocess540($dcode,$sym){$dcode=$dcode|0;$sym=$sym|0;var $1=0,$2=0,$base_0=0,$i_0=0,$i_039=0,$base_037=0,$i_040=0,$base_038=0,$base_1_ph=0,$i_1_ph=0,$j_045=0,$i_144=0,$21=0,$28=0,$j_0_lcssa=0,$38=0,$j_1=0,$46=0,$50=0,$j_242=0,$i_241=0,$54=0,$55=0,$57=0,$j_3=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+96|0;$2=$sym&255;if($2>>>0>1){label=2;break}else{$j_1=0;label=16;break};case 2:if(($2|0)==9){label=3;break}else if(($2|0)==14){label=4;break}else if(($2|0)==12){$base_037=12;$i_039=1;label=7;break}else{label=5;break};case 3:$i_0=1;$base_0=$2-1|0;label=6;break;case 4:$base_037=13;$i_039=0;label=7;break;case 5:$i_0=($2|0)==10?3:0;$base_0=$2;label=6;break;case 6:if(($base_0|0)==10){$base_038=10;$i_040=$i_0;label=8;break}else{$base_037=$base_0;$i_039=$i_0;label=7;break};case 7:if(((_ean_get_config($1,$sym)|0)&4|0)==0){$base_038=$base_037;$i_040=$i_039;label=8;break}else{$i_1_ph=$i_039;$base_1_ph=$base_037;label=9;break};case 8:$i_1_ph=$i_040;$base_1_ph=$base_038-1|0;label=9;break;case 9:if(($base_1_ph|0)==0){$j_1=0;label=16;break}else{label=10;break};case 10:$i_144=$i_1_ph;$j_045=0;label=11;break;case 11:$21=HEAP8[$dcode+144+$i_144|0]|0;if($21<<24>>24>-1){label=12;break}else{$j_0_lcssa=$j_045;label=13;break};case 12:HEAP8[(HEAP32[$dcode+84>>2]|0)+$j_045|0]=$21+48&255;$28=$j_045+1|0;if($28>>>0<$base_1_ph>>>0){$i_144=$i_144+1|0;$j_045=$28;label=11;break}else{$j_0_lcssa=$28;label=13;break};case 13:if(($2|0)==10&($j_0_lcssa|0)==9){label=14;break}else{$j_1=$j_0_lcssa;label=16;break};case 14:if((HEAP32[$dcode+180>>2]&4|0)==0){$j_1=$j_0_lcssa;label=16;break}else{label=15;break};case 15:$38=_isbn10_calc_checksum($1)|0;HEAP8[(HEAP32[$dcode+84>>2]|0)+$j_0_lcssa|0]=$38;$j_1=$j_0_lcssa+1|0;label=16;break;case 16:if(($sym&1792|0)==0){$j_3=$j_1;label=20;break}else{label=17;break};case 17:$46=HEAP8[$dcode+157|0]|0;if($46<<24>>24>-1){label=18;break}else{$j_3=$j_1;label=20;break};case 18:$i_241=13;$j_242=$j_1;$50=$46;label=19;break;case 19:HEAP8[(HEAP32[$dcode+84>>2]|0)+$j_242|0]=$50+48&255;$54=$i_241+1|0;$55=$j_242+1|0;$57=HEAP8[$dcode+144+$54|0]|0;if($57<<24>>24>-1){$i_241=$54;$j_242=$55;$50=$57;label=19;break}else{$j_3=$55;label=20;break};case 20:HEAP32[$dcode+80>>2]=$j_3;HEAP8[(HEAP32[$dcode+84>>2]|0)+$j_3|0]=0;return}}function _isbn10_calc_checksum($ean){$ean=$ean|0;var $2=0,$3=0,$_lcssa21=0,$chk_017_lcssa=0,$_lcssa=0,$6=0,$8=0,$11=0,$13=0,$14=0,$17=0,$_0=0,$25=0,$27=0,$28=0,$32=0,$34=0,$35=0,$39=0,$41=0,$42=0,$46=0,$48=0,$49=0,$53=0,$55=0,$56=0,$60=0,$62=0,$63=0,$67=0,$69=0,$70=0,$75=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:$2=HEAP8[$ean+51|0]|0;$3=$2&255;if(($2&255)<10){label=3;break}else{$_lcssa=10;$chk_017_lcssa=0;$_lcssa21=$3;label=2;break};case 2:$6=HEAP32[_stderr>>2]|0;$8=__zbar_decoder_buf_dump($ean+48|0,18)|0;_fprintf($6|0,3288,(tempInt=STACKTOP,STACKTOP=STACKTOP+64|0,HEAP32[tempInt>>2]=6560,HEAP32[tempInt+8>>2]=418,HEAP32[tempInt+16>>2]=9008,HEAP32[tempInt+24>>2]=4680,HEAP32[tempInt+32>>2]=$_lcssa,HEAP32[tempInt+40>>2]=$_lcssa21,HEAP32[tempInt+48>>2]=$chk_017_lcssa,HEAP32[tempInt+56>>2]=$8,tempInt)|0)|0;$_0=63;label=6;break;case 3:$11=$3*10&-1;$13=HEAP8[$ean+52|0]|0;$14=$13&255;if(($13&255)<10){label=7;break}else{$_lcssa=9;$chk_017_lcssa=$11;$_lcssa21=$14;label=2;break};case 4:$17=11-$75|0;if($17>>>0<10){label=5;break}else{$_0=88;label=6;break};case 5:$_0=$17+48&255;label=6;break;case 6:STACKTOP=__stackBase__;return $_0|0;case 7:$25=($14*9&-1)+$11|0;$27=HEAP8[$ean+53|0]|0;$28=$27&255;if(($27&255)<10){label=8;break}else{$_lcssa=8;$chk_017_lcssa=$25;$_lcssa21=$28;label=2;break};case 8:$32=($28<<3)+$25|0;$34=HEAP8[$ean+54|0]|0;$35=$34&255;if(($34&255)<10){label=9;break}else{$_lcssa=7;$chk_017_lcssa=$32;$_lcssa21=$35;label=2;break};case 9:$39=($35*7&-1)+$32|0;$41=HEAP8[$ean+55|0]|0;$42=$41&255;if(($41&255)<10){label=10;break}else{$_lcssa=6;$chk_017_lcssa=$39;$_lcssa21=$42;label=2;break};case 10:$46=($42*6&-1)+$39|0;$48=HEAP8[$ean+56|0]|0;$49=$48&255;if(($48&255)<10){label=11;break}else{$_lcssa=5;$chk_017_lcssa=$46;$_lcssa21=$49;label=2;break};case 11:$53=($49*5&-1)+$46|0;$55=HEAP8[$ean+57|0]|0;$56=$55&255;if(($55&255)<10){label=12;break}else{$_lcssa=4;$chk_017_lcssa=$53;$_lcssa21=$56;label=2;break};case 12:$60=($56<<2)+$53|0;$62=HEAP8[$ean+58|0]|0;$63=$62&255;if(($62&255)<10){label=13;break}else{$_lcssa=3;$chk_017_lcssa=$60;$_lcssa21=$63;label=2;break};case 13:$67=($63*3&-1)+$60|0;$69=HEAP8[$ean+59|0]|0;$70=$69&255;if(($69&255)<10){label=14;break}else{$_lcssa=2;$chk_017_lcssa=$67;$_lcssa21=$70;label=2;break};case 14:$75=((($70<<1)+$67|0)>>>0)%11>>>0;if(($75|0)==0){$_0=48;label=6;break}else{label=4;break}}return 0}function _ean_verify_checksum($ean,$n){$ean=$ean|0;$n=$n|0;var $2=0,$chk_036=0,$i_035=0,$4=0,$8=0,$11=0,$14=0,$20=0,$chk_1=0,$_chk_1=0,$26=0,$27=0,$32=0,$34=0,$chk_0_lcssa41=0,$chk_0_=0,$39=0,$43=0,$46=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:if(($n|0)>0){$i_035=0;$chk_036=0;$2=0;label=2;break}else{$chk_0_lcssa41=0;label=9;break};case 2:$4=HEAP8[$ean+48+$2|0]|0;if(($4&255)<10){label=4;break}else{label=3;break};case 3:$8=HEAP32[_stderr>>2]|0;$11=__zbar_decoder_buf_dump($ean+48|0,18)|0;_fprintf($8|0,4e3|0,(tempInt=STACKTOP,STACKTOP=STACKTOP+64|0,HEAP32[tempInt>>2]=6560,HEAP32[tempInt+8>>2]=386,HEAP32[tempInt+16>>2]=9208,HEAP32[tempInt+24>>2]=4680,HEAP32[tempInt+32>>2]=$2,HEAP32[tempInt+40>>2]=$4&255,HEAP32[tempInt+48>>2]=$chk_036&255,HEAP32[tempInt+56>>2]=$11,tempInt)|0)|0;$_0=-1;label=12;break;case 4:$14=$4+$chk_036&255;if((($2^$n)&1|0)==0){$chk_1=$14;label=6;break}else{label=5;break};case 5:$20=$14+($4<<1)&255;$chk_1=($20&255)>19?$20-20&255:$20;label=6;break;case 6:$_chk_1=($chk_1&255)>9?$chk_1-10&255:$chk_1;$26=$i_035+1&255;$27=$26&255;if(($27|0)<($n|0)){$i_035=$26;$chk_036=$_chk_1;$2=$27;label=2;break}else{label=7;break};case 7:if(($_chk_1&255)<10){$chk_0_lcssa41=$_chk_1;label=9;break}else{label=8;break};case 8:$32=HEAP32[_stderr>>2]|0;$34=__zbar_decoder_buf_dump($ean+48|0,18)|0;_fprintf($32|0,3600|0,(tempInt=STACKTOP,STACKTOP=STACKTOP+56|0,HEAP32[tempInt>>2]=6560,HEAP32[tempInt+8>>2]=397,HEAP32[tempInt+16>>2]=9208,HEAP32[tempInt+24>>2]=3048,HEAP32[tempInt+32>>2]=$_chk_1&255,HEAP32[tempInt+40>>2]=$n,HEAP32[tempInt+48>>2]=$34,tempInt)|0)|0;$_0=-1;label=12;break;case 9:$chk_0_=$chk_0_lcssa41<<24>>24==0?0:10-$chk_0_lcssa41&255;$39=HEAP8[$ean+48+$n|0]|0;if(($39&255)<10){label=11;break}else{label=10;break};case 10:$43=HEAP32[_stderr>>2]|0;$46=__zbar_decoder_buf_dump($ean+48|0,18)|0;_fprintf($43|0,2648|0,(tempInt=STACKTOP,STACKTOP=STACKTOP+64|0,HEAP32[tempInt>>2]=6560,HEAP32[tempInt+8>>2]=402,HEAP32[tempInt+16>>2]=9208,HEAP32[tempInt+24>>2]=4680,HEAP32[tempInt+32>>2]=$n,HEAP32[tempInt+40>>2]=$39&255,HEAP32[tempInt+48>>2]=$chk_0_&255,HEAP32[tempInt+56>>2]=$46,tempInt)|0)|0;$_0=-1;label=12;break;case 11:$_0=($chk_0_<<24>>24!=$39<<24>>24)<<31>>31;label=12;break;case 12:STACKTOP=__stackBase__;return $_0|0}return 0}function _aux_end($dcode,$fwd){$dcode=$dcode|0;$fwd=$fwd|0;var $3=0,$4=0,$code_0=0,$i_0=0,$18=0,$19=0,$26=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$3=_calc_s($dcode,$fwd+4&255)|0;$4=_get_width538($dcode,0)|0;if($fwd<<24>>24!=0|($4|0)==0){label=3;break}else{label=2;break};case 2:if($4>>>0<($3*3&-1)>>>2>>>0){$_0=-1;label=6;break}else{label=3;break};case 3:$i_0=1-$fwd&255;$code_0=0;label=4;break;case 4:if(($i_0&255)>>>0<(($fwd&255)+3|0)>>>0){label=5;break}else{$_0=$code_0;label=6;break};case 5:$18=_get_width538($dcode,$i_0)|0;$19=$i_0+1&255;$26=(_decode_e542((_get_width538($dcode,$19)|0)+$18|0,$3)|0|$code_0<<24>>24<<2)&255;if($26<<24>>24<0){$_0=-1;label=6;break}else{$i_0=$19;$code_0=$26;label=4;break};case 6:return $_0|0}return 0}function _decode_e542($e,$s){$e=$e|0;$s=$s|0;var $6=0;$6=(((($e*14&-1|1)>>>0)/($s>>>0)>>>0)+509|0)>>>1&255;return($6>>>0>3?-1:$6)|0}function _decode_e548($e,$s){$e=$e|0;$s=$s|0;var $6=0;$6=(((($e*90&-1|1)>>>0)/($s>>>0)>>>0)+509|0)>>>1&255;return($6>>>0>41?-1:$6)|0}function _ean_part_end7($ean,$pass,$fwd){$ean=$ean|0;$pass=$pass|0;$fwd=$fwd|0;var $6=0,$_sink_off0=0,$70=0,$73=0,$78=0,$81=0,$85=0,$86=0,$87=0,$89=0,$90=0,$91=0,$93=0,$94=0,$95=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$6=HEAP8[$pass+2|0]&16;if($fwd<<24>>24==0){label=3;break}else{label=2;break};case 2:$_sink_off0=(HEAP8[$pass+3|0]&16|$6<<1|(HEAPU8[$pass+4|0]|0)>>>1&8|(HEAPU8[$pass+5|0]|0)>>>2&4|(HEAPU8[$pass+6|0]|0)>>>3&2|(HEAPU8[$pass+7|0]|0)>>>4&1)&255;label=4;break;case 3:$_sink_off0=((HEAPU8[$pass+3|0]|0)>>>3&2|$6>>>4|(HEAPU8[$pass+4|0]|0)>>>2&4|(HEAPU8[$pass+5|0]|0)>>>1&8|HEAP8[$pass+6|0]&16|(HEAPU8[$pass+7|0]|0)<<1&32)&255;label=4;break;case 4:$70=$_sink_off0&255;$73=HEAP8[136+($70>>>1)|0]|0;$78=(($70&1|0)==0?$73:($73&255)>>>4)&15;HEAP8[$pass+1|0]=$78;if($78<<24>>24==15){$_0=0;label=13;break}else{label=5;break};case 5:$81=$_sink_off0<<24>>24!=0;if(($81&1^1|0)==($fwd&255|0)){label=6;break}else{label=7;break};case 6:$85=$pass+2|0;$86=HEAP8[$85]|0;$87=$pass+7|0;HEAP8[$85]=HEAP8[$87]|0;HEAP8[$87]=$86;$89=$pass+3|0;$90=HEAP8[$89]|0;$91=$pass+6|0;HEAP8[$89]=HEAP8[$91]|0;HEAP8[$91]=$90;$93=$pass+4|0;$94=HEAP8[$93]|0;$95=$pass+5|0;HEAP8[$93]=HEAP8[$95]|0;HEAP8[$95]=$94;label=7;break;case 7:if((HEAP32[$ean+68>>2]&1|0)==0){label=10;break}else{label=8;break};case 8:if($81){label=9;break}else{$_0=4109;label=13;break};case 9:if(($70&32|0)==0){label=10;break}else{$_0=13;label=13;break};case 10:if($_sink_off0<<24>>24==0){label=12;break}else{label=11;break};case 11:if(($70&32|0)==0){$_0=9;label=13;break}else{label=12;break};case 12:$_0=0;label=13;break;case 13:return $_0|0}return 0}function _get_width545($dcode,$offset){$dcode=$dcode|0;$offset=$offset|0;return HEAP32[$dcode+4+(((HEAPU8[$dcode|0]|0)-($offset&255)&15)<<2)>>2]|0}function _get_lock546($dcode){$dcode=$dcode|0;var $1=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+72|0;if((HEAP32[$1>>2]|0)==0){label=2;break}else{$_0=1;label=3;break};case 2:HEAP32[$1>>2]=25;$_0=0;label=3;break;case 3:return $_0|0}return 0}function _get_color549($dcode){$dcode=$dcode|0;return HEAP8[$dcode|0]&1|0}function _aux_start($dcode){$dcode=$dcode|0;var $1=0,$2=0,$5=0,$11=0,$12=0,$16=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=_get_width538($dcode,5)|0;$2=_get_width538($dcode,6)|0;$5=HEAP32[$dcode+140>>2]|0;if((_decode_e542($2+$1|0,$5)|0)==0){label=2;break}else{$_0=-1;label=11;break};case 2:$11=_decode_e542((_get_width538($dcode,4)|0)+$1|0,$5)|0;$12=$11&255;if((_get_color541($dcode)|0)<<24>>24==1){label=3;break}else{label=8;break};case 3:$16=_get_width538($dcode,7)|0;if(($16|0)==0){label=5;break}else{label=4;break};case 4:if($16>>>0<($5*3&-1)>>>2>>>0){label=7;break}else{label=5;break};case 5:if($12<<24>>24==0){$_0=0;label=11;break}else{label=6;break};case 6:if(($11&255|0)==1){$_0=64;label=11;break}else{label=7;break};case 7:$_0=-1;label=11;break;case 8:if($12<<24>>24==0){label=9;break}else{label=10;break};case 9:if((_decode_e542((_get_width538($dcode,7)|0)+$2|0,$5)|0)==0){$_0=0;label=11;break}else{label=10;break};case 10:$_0=-1;label=11;break;case 11:return $_0|0}return 0}function _decode4($dcode){$dcode=$dcode|0;var $4=0,$8=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$19=0,$22=0,$23=0,$26=0,$39=0,$code_0=0,$56=0,$57=0,$59=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;label=1;while(1)switch(label|0){case 1:if((_get_color541($dcode)|0)<<24>>24==1){label=2;break}else{label=3;break};case 2:$4=_get_width538($dcode,0)|0;$12=(_get_width538($dcode,1)|0)+$4|0;label=4;break;case 3:$8=_get_width538($dcode,2)|0;$12=(_get_width538($dcode,3)|0)+$8|0;label=4;break;case 4:$13=_get_width538($dcode,1)|0;$14=_get_width538($dcode,2)|0;$15=$14+$13|0;$16=$dcode+140|0;$17=HEAP32[$16>>2]|0;$19=(_decode_e542($12,$17)|0)<<2;$22=($19|(_decode_e542($15,$17)|0))&255;$23=$22<<24>>24;if($22<<24>>24<0){$_0=-1;label=13;break}else{label=5;break};case 5:$26=1<<$23;if(($26&1632|0)==0){$code_0=$22;label=11;break}else{label=6;break};case 6:if((_get_color541($dcode)|0)<<24>>24==1){label=7;break}else{label=8;break};case 7:$39=(_get_width538($dcode,0)|0)+$14|0;label=9;break;case 8:$39=(_get_width538($dcode,3)|0)+$13|0;label=9;break;case 9:if(($39*7&-1)>>>0>(Math_imul(HEAP32[$16>>2]|0,($26&1056|0)!=0?3:4)|0)>>>0){label=10;break}else{$code_0=$22;label=11;break};case 10:$code_0=($23>>>1&3|16)&255;label=11;break;case 11:if($code_0<<24>>24<20){$_0=$code_0;label=13;break}else{label=12;break};case 12:$56=HEAP32[_stderr>>2]|0;$57=HEAP32[$16>>2]|0;$59=(_get_color541($dcode)|0)<<24>>24;_fprintf($56|0,2312|0,(tempInt=STACKTOP,STACKTOP=STACKTOP+72|0,HEAP32[tempInt>>2]=6560,HEAP32[tempInt+8>>2]=227,HEAP32[tempInt+16>>2]=9264,HEAP32[tempInt+24>>2]=1960,HEAP32[tempInt+32>>2]=$code_0<<24>>24,HEAP32[tempInt+40>>2]=$12,HEAP32[tempInt+48>>2]=$15,HEAP32[tempInt+56>>2]=$57,HEAP32[tempInt+64>>2]=$59,tempInt)|0)|0;$_0=-1;label=13;break;case 13:STACKTOP=__stackBase__;return $_0|0}return 0}function _calc_s($dcode,$offset){$dcode=$dcode|0;$offset=$offset|0;var $2=0,$5=0,$8=0;$2=_get_width538($dcode,$offset)|0;$5=(_get_width538($dcode,$offset+1&255)|0)+$2|0;$8=(_get_width538($dcode,$offset+2&255)|0)+$5|0;return(_get_width538($dcode,$offset+3&255)|0)+$8|0}function __zbar_decode_i25($dcode){$dcode=$dcode|0;var $2=0,$3=0,$5=0,$8=0,$15=0,$18=0,$42=0,$47=0,$60=0,$61=0,$69=0,$72=0,$80=0,$81=0,$91=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=_get_width545($dcode,10)|0;$3=$dcode+192|0;$5=(HEAP32[$3>>2]|0)-$2|0;HEAP32[$3>>2]=$5;HEAP32[$3>>2]=$5+(_get_width545($dcode,0)|0);$8=$dcode+188|0;if((HEAP32[$8>>2]&65536|0)==0){label=3;break}else{label=2;break};case 2:if((_i25_decode_start($dcode)|0)<<24>>24==0){$_0=0;label=16;break}else{label=3;break};case 3:$15=HEAP32[$8>>2]|0;$18=($15>>>1)+15&15;HEAP32[$8>>2]=$18<<1|$15&-31;if(($18|0)==(6-($15&1)|0)){label=4;break}else{label=5;break};case 4:$_0=(_i25_decode_end($dcode)|0)<<24>>24;label=16;break;case 5:if(($18|0)==0){label=6;break}else{$_0=0;label=16;break};case 6:HEAP32[$dcode+196>>2]=HEAP32[$3>>2];if((HEAP32[$8>>2]&131040|0)==0){label=7;break}else{label=9;break};case 7:if((_get_lock546($dcode)|0)<<24>>24==0){label=9;break}else{label=8;break};case 8:HEAP32[$8>>2]=HEAP32[$8>>2]|131040;$_0=1;label=16;break;case 9:$42=_i25_decode10($dcode,1)|0;if(($42&255)>9){label=12;break}else{label=10;break};case 10:$47=(HEAP32[$8>>2]|0)>>>5<<20;if(($47|0)>32505856){label=11;break}else{label=13;break};case 11:if((_size_buf547($dcode,($47>>20)+2|0)|0)<<24>>24==0){label=13;break}else{label=12;break};case 12:HEAP32[$dcode+72>>2]=0;HEAP32[$8>>2]=HEAP32[$8>>2]|131040;$_0=0;label=16;break;case 13:$60=HEAP32[$8>>2]|0;$61=$60>>>5;HEAP32[$8>>2]=($61<<5)+32&131040|$60&-131041;$69=$dcode+84|0;HEAP8[(HEAP32[$69>>2]|0)+($61<<20>>20)|0]=$42+48&255;$72=_i25_decode10($dcode,0)|0;if(($72&255)>9){label=14;break}else{label=15;break};case 14:HEAP32[$dcode+72>>2]=0;HEAP32[$8>>2]=HEAP32[$8>>2]|131040;$_0=0;label=16;break;case 15:$80=HEAP32[$8>>2]|0;$81=$80>>>5;HEAP32[$8>>2]=($81<<5)+32&131040|$80&-131041;HEAP8[(HEAP32[$69>>2]|0)+($81<<20>>20)|0]=$72+48&255;$91=HEAP32[$8>>2]|0;HEAP32[$8>>2]=$91&-31|20;$_0=($91&131040|0)==64&1;label=16;break;case 16:return $_0|0}return 0}function _i25_decode_start($dcode){$dcode=$dcode|0;var $2=0,$3=0,$7=0,$9=0,$11=0,$i_0=0,$21=0,$30=0,$31=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=$dcode+192|0;$3=HEAP32[$2>>2]|0;if($3>>>0<10){$_0=0;label=8;break}else{label=2;break};case 2:$7=_i25_decode1(0,_get_width545($dcode,10)|0,$3)|0;$9=_i25_decode1($7,_get_width545($dcode,11)|0,$3)|0;$11=_i25_decode1($9,_get_width545($dcode,12)|0,$3)|0;if((_get_color549($dcode)|0)<<24>>24==1){label=3;break}else{label=4;break};case 3:if($11<<24>>24==4){$i_0=13;label=5;break}else{$_0=0;label=8;break};case 4:if((_i25_decode1($11,_get_width545($dcode,13)|0,$3)|0)<<24>>24==0){$i_0=14;label=5;break}else{$_0=0;label=8;break};case 5:$21=_get_width545($dcode,$i_0)|0;if(($21|0)==0){label=7;break}else{label=6;break};case 6:if($21>>>0<((HEAP32[$2>>2]|0)*3&-1)>>>3>>>0){$_0=0;label=8;break}else{label=7;break};case 7:$30=(_get_color549($dcode)|0)&255;$31=$dcode+188|0;HEAP32[$31>>2]=$30&1|HEAP32[$31>>2]&-131072|2;$_0=1;label=8;break;case 8:return $_0|0}return 0}function _i25_decode_end($dcode){$dcode=$dcode|0;var $2=0,$11=0,$13=0,$22=0,$23=0,$27=0,$43=0,$46=0,$48=0,$i_037=0,$50=0,$51=0,$52=0,$53=0,$58=0,$62=0,$68=0,$74=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=_get_width545($dcode,0)|0;if(($2|0)==0){label=3;break}else{label=2;break};case 2:if($2>>>0<((HEAP32[$dcode+196>>2]|0)*3&-1)>>>3>>>0){$_0=0;label=17;break}else{label=3;break};case 3:$11=_get_width545($dcode,1)|0;$13=HEAP32[$dcode+196>>2]|0;if((_decode_e548($11,$13)|0)>2){$_0=0;label=17;break}else{label=4;break};case 4:if((_decode_e548(_get_width545($dcode,2)|0,$13)|0)>2){$_0=0;label=17;break}else{label=5;break};case 5:$22=_decode_e548(_get_width545($dcode,3)|0,$13)|0;$23=$dcode+188|0;$27=$22&255;if((HEAP32[$23>>2]&1|0)==0){label=6;break}else{label=7;break};case 6:if(($27-3|0)>4){$_0=0;label=17;break}else{label=9;break};case 7:if($27>>>0>2){$_0=0;label=17;break}else{label=8;break};case 8:if((_decode_e548(_get_width545($dcode,4)|0,$13)|0)>2){$_0=0;label=17;break}else{label=9;break};case 9:if((HEAP32[$23>>2]&1|0)==0){label=13;break}else{label=10;break};case 10:$43=(HEAP32[$23>>2]|0)>>>5<<20;if(($43|0)>1048576){label=11;break}else{label=13;break};case 11:$46=$dcode+84|0;$i_037=0;$48=$43>>20;label=12;break;case 12:$50=$48+($i_037^-1)|0;$51=HEAP32[$46>>2]|0;$52=$51+$i_037|0;$53=HEAP8[$52]|0;HEAP8[$52]=HEAP8[$51+$50|0]|0;HEAP8[(HEAP32[$46>>2]|0)+$50|0]=$53;$58=$i_037+1|0;$62=(HEAP32[$23>>2]|0)>>>5<<20>>20;if(($58|0)<(($62|0)/2&-1|0)){$i_037=$58;$48=$62;label=12;break}else{label=13;break};case 13:$68=(HEAP32[$23>>2]|0)>>>5<<20>>20;if(($68|0)<(HEAP32[$dcode+204>>2]|0)){label=15;break}else{label=14;break};case 14:$74=HEAP32[$dcode+208>>2]|0;if(($74|0)>0&($68|0)>($74|0)){label=15;break}else{label=16;break};case 15:HEAP32[$dcode+72>>2]=0;HEAP32[$23>>2]=HEAP32[$23>>2]|131040;$_0=0;label=17;break;case 16:HEAP32[$dcode+80>>2]=$68;HEAP8[(HEAP32[$dcode+84>>2]|0)+((HEAP32[$23>>2]|0)>>>5<<20>>20)|0]=0;HEAP32[$23>>2]=HEAP32[$23>>2]|131040;$_0=25;label=17;break;case 17:return $_0|0}return 0}function _i25_decode10($dcode,$offset){$dcode=$dcode|0;$offset=$offset|0;var $1=0,$6=0,$9=0,$10=0,$15=0,$23=0,$26=0,$32=0,$enc_1=0,$_0=0,$38=0,$46=0,$54=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+192|0;if((HEAP32[$1>>2]|0)>>>0<10){$_0=-1;label=8;break}else{label=2;break};case 2:$6=$offset&255;$9=HEAP32[$dcode+188>>2]&1;$10=HEAP32[$1>>2]|0;$15=_i25_decode1(0,_get_width545($dcode,($9<<3)+$6&255)|0,$10)|0;if($15<<24>>24==-1){$_0=-1;label=8;break}else{label=3;break};case 3:$23=_i25_decode1($15,_get_width545($dcode,($9<<2|2)+$6&255)|0,$10)|0;if($23<<24>>24==-1){$_0=-1;label=8;break}else{label=9;break};case 4:$26=$54&15;if(($54&8)==0){$enc_1=$26;label=7;break}else{label=5;break};case 5:if($26<<24>>24==12){$enc_1=0;label=7;break}else{label=6;break};case 6:$32=$26-1&255;if(($32&255)>9){$_0=-1;label=8;break}else{$enc_1=$32;label=7;break};case 7:$_0=$enc_1;label=8;break;case 8:return $_0|0;case 9:$38=_i25_decode1($23,_get_width545($dcode,$offset+4&255)|0,$10)|0;if($38<<24>>24==-1){$_0=-1;label=8;break}else{label=10;break};case 10:$46=_i25_decode1($38,_get_width545($dcode,($9<<2^6)+$6&255)|0,$10)|0;if($46<<24>>24==-1){$_0=-1;label=8;break}else{label=11;break};case 11:$54=_i25_decode1($46,_get_width545($dcode,($9<<3^8)+$6&255)|0,$10)|0;if($54<<24>>24==-1){$_0=-1;label=8;break}else{label=12;break};case 12:if((($54&1)+(($46&1)+(($38&1)+(($23&1)+($15&1)&255)&255)&255)&255)<<24>>24==2){label=4;break}else{$_0=-1;label=8;break}}return 0}function _size_buf547($dcode,$len){$dcode=$dcode|0;$len=$len|0;var $1=0,$2=0,$7=0,$_014=0,$12=0,$14=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$dcode+76|0;$2=HEAP32[$1>>2]|0;if($2>>>0>$len>>>0){$_0=0;label=7;break}else{label=2;break};case 2:if($len>>>0>256){$_0=1;label=7;break}else{label=3;break};case 3:$7=$2+16|0;if($7>>>0>$len>>>0){label=4;break}else{$_014=$len;label=5;break};case 4:$_014=$7>>>0>256?256:$7;label=5;break;case 5:$12=$dcode+84|0;$14=_realloc(HEAP32[$12>>2]|0,$_014)|0;if(($14|0)==0){$_0=1;label=7;break}else{label=6;break};case 6:HEAP32[$12>>2]=$14;HEAP32[$1>>2]=$_014;$_0=0;label=7;break;case 7:return $_0|0}return 0}function _i25_decode1($enc,$e,$s){$enc=$enc|0;$e=$e|0;$s=$s|0;var $2=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$2=(_decode_e548($e,$s)|0)&255;if($2>>>0>7){$_0=-1;label=3;break}else{label=2;break};case 2:$_0=$2>>>0>2&1|$enc<<1;label=3;break;case 3:return $_0|0}return 0}function _bch15_5_correct($_y){$_y=$_y|0;var $epos=0,$1=0,$2=0,$7=0,$i_012=0,$y_011=0,$12=0,$13=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+32|0;label=1;while(1)switch(label|0){case 1:$epos=__stackBase__+16|0;$1=HEAP32[$_y>>2]|0;$2=__stackBase__|0;if((_bch15_5_calc_syndrome($2,$1)|0)==0){$_0=0;label=6;break}else{label=2;break};case 2:$7=_bch15_5_calc_epos($epos|0,$2)|0;if(($7|0)>0){$y_011=$1;$i_012=0;label=3;break}else{$_0=-1;label=6;break};case 3:$12=1<<HEAP32[$epos+($i_012<<2)>>2]^$y_011;$13=$i_012+1|0;if(($13|0)<($7|0)){$y_011=$12;$i_012=$13;label=3;break}else{label=4;break};case 4:if((_bch15_5_encode($12>>>10)|0)==($12|0)){label=5;break}else{$_0=-1;label=6;break};case 5:HEAP32[$_y>>2]=$12;$_0=$7;label=6;break;case 6:STACKTOP=__stackBase__;return $_0|0}return 0}function _bch15_5_encode($_x){$_x=$_x|0;return-($_x>>>1&1)&2670^-($_x&1)&1335^-($_x>>>2&1)&4587^-($_x>>>3&1)&9174^-($_x>>>4&1)&17051|0}function _bch15_5_calc_syndrome($_s,$_y){$_s=$_s|0;$_y=$_y|0;var $i_040=0,$p_039=0,$p_1=0,$11=0,$13=0,$p_4_1=0,$p_4_1_=0,$p_4_3=0,$p_4_143=0,$p_4_143_=0,$p_4_2_1=0,$p_4_2_1_=0,$p_4_4_1_=0,$p_4_1_2=0,$p_4_1_2_=0,$p_4_3_2=0,$52=0,$53=0,$p_7_1=0,$p_7_141=0,$p_7_141_=0,$p_7_2_1_=0,$p_7_1_2=0,$p_7_3=0,$p_7_3_=0,$p_7_2_3_=0,$p_7_1_4=0,$p_7_1_4_=0,$97=0,label=0;label=1;while(1)switch(label|0){case 1:$p_039=0;$i_040=0;label=2;break;case 2:if((1<<$i_040&$_y|0)==0){$p_1=$p_039;label=4;break}else{label=3;break};case 3:$p_1=(HEAPU8[376+$i_040|0]|0)^$p_039;label=4;break;case 4:$11=$i_040+1|0;if(($11|0)<15){$p_039=$p_1;$i_040=$11;label=2;break}else{label=5;break};case 5:HEAP32[$_s>>2]=$p_1;$13=$_y&1;$p_4_1=($_y&2|0)==0?$13:$13|8;$p_4_1_=($_y&4|0)==0?$p_4_1:$p_4_1^12;$p_4_3=($_y&8|0)==0?$p_4_1_:$p_4_1_^10;$p_4_143=(($_y&16|0)==0?$p_4_3:$p_4_3^15)^$_y>>>5&1;$p_4_143_=($_y&64|0)==0?$p_4_143:$p_4_143^8;$p_4_2_1=($_y&128|0)==0?$p_4_143_:$p_4_143_^12;$p_4_2_1_=($_y&256|0)==0?$p_4_2_1:$p_4_2_1^10;$p_4_4_1_=(($_y&512|0)==0?$p_4_2_1_:$p_4_2_1_^15)^$_y>>>10&1;$p_4_1_2=($_y&2048|0)==0?$p_4_4_1_:$p_4_4_1_^8;$p_4_1_2_=($_y&4096|0)==0?$p_4_1_2:$p_4_1_2^12;$p_4_3_2=($_y&8192|0)==0?$p_4_1_2_:$p_4_1_2_^10;$52=$_s+4|0;HEAP32[$52>>2]=($_y&16384|0)==0?$p_4_3_2:$p_4_3_2^15;$53=$_y&1;$p_7_1=($_y&2|0)==0?$53:$53|6;$p_7_141=(($_y&4|0)==0?$p_7_1:$p_7_1^7)^$_y>>>3&1;$p_7_141_=($_y&16|0)==0?$p_7_141:$p_7_141^6;$p_7_2_1_=(($_y&32|0)==0?$p_7_141_:$p_7_141_^7)^$_y>>>6&1;$p_7_1_2=($_y&128|0)==0?$p_7_2_1_:$p_7_2_1_^6;$p_7_3=(($_y&256|0)==0?$p_7_1_2:$p_7_1_2^7)^$_y>>>9&1;$p_7_3_=($_y&1024|0)==0?$p_7_3:$p_7_3^6;$p_7_2_3_=(($_y&2048|0)==0?$p_7_3_:$p_7_3_^7)^$_y>>>12&1;$p_7_1_4=($_y&8192|0)==0?$p_7_2_3_:$p_7_2_3_^6;$p_7_1_4_=($_y&16384|0)==0?$p_7_1_4:$p_7_1_4^7;HEAP32[$_s+8>>2]=$p_7_1_4_;if((HEAP32[$_s>>2]|0)==0){label=6;break}else{$97=1;label=8;break};case 6:if((HEAP32[$52>>2]|0)==0){label=7;break}else{$97=1;label=8;break};case 7:$97=($p_7_1_4_|0)!=0&1;label=8;break;case 8:return $97|0}return 0}function _gf16_hmul($_a,$_logb){$_a=$_a|0;$_logb=$_logb|0;var $11=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_a|0)==0){$11=0;label=3;break}else{label=2;break};case 2:$11=HEAPU8[376+((HEAP8[360+$_a|0]|0)+$_logb)|0]|0;label=3;break;case 3:return $11|0}return 0}function _gf16_mul($_a,$_b){$_a=$_a|0;$_b=$_b|0;var $15=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_a|0)==0|($_b|0)==0){$15=0;label=3;break}else{label=2;break};case 2:$15=HEAPU8[376+((HEAP8[360+$_b|0]|0)+(HEAP8[360+$_a|0]|0))|0]|0;label=3;break;case 3:return $15|0}return 0}function _gf16_div($_a,$_b){$_a=$_a|0;$_b=$_b|0;var $15=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_a|0)==0){$15=0;label=3;break}else{label=2;break};case 2:$15=HEAPU8[376+((HEAP8[360+$_a|0]|0)+15-(HEAP8[360+$_b|0]|0))|0]|0;label=3;break;case 3:return $15|0}return 0}function _isaac_mix($_x){$_x=$_x|0;var $i_028=0,$2=0,$3=0,$9=0,$11=0,$14=0,$17=0,$19=0,$28=0,$30=0,$33=0,label=0;label=1;while(1)switch(label|0){case 1:$i_028=0;label=2;break;case 2:$2=$i_028|1;$3=$_x+($2<<2)|0;$9=$_x+($i_028<<2)|0;$11=HEAP32[$3>>2]<<(HEAPU8[352+$i_028|0]|0)^HEAP32[$9>>2];HEAP32[$9>>2]=$11;$14=$_x+(($i_028+3&7)<<2)|0;HEAP32[$14>>2]=$11+(HEAP32[$14>>2]|0);$17=$i_028+2|0;$19=$_x+(($17&6)<<2)|0;HEAP32[$3>>2]=(HEAP32[$3>>2]|0)+(HEAP32[$19>>2]|0);$28=$_x+($2<<2)|0;$30=(HEAP32[$19>>2]|0)>>>((HEAPU8[352+$2|0]|0)>>>0)^HEAP32[$28>>2];HEAP32[$28>>2]=$30;$33=$_x+(($i_028+4&6)<<2)|0;HEAP32[$33>>2]=$30+(HEAP32[$33>>2]|0);HEAP32[$19>>2]=(HEAP32[$19>>2]|0)+(HEAP32[$14>>2]|0);if(($17|0)<8){$i_028=$17;label=2;break}else{label=3;break};case 3:return}}function _bch15_5_calc_epos($_epos,$_s){$_epos=$_epos|0;$_s=$_s|0;var $o=0,$1=0,$2=0,$13=0,$15=0,$i_016=0,$nerrors_015=0,$23=0,$27=0,$29=0,$nerrors_1=0,$37=0,$nerrors_2=0,$_0=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+16|0;label=1;while(1)switch(label|0){case 1:$o=__stackBase__|0;$1=$o|0;$2=_bch15_5_calc_omega($1,$_s)|0;if(($2|0)==1){label=2;break}else{label=3;break};case 2:HEAP32[$_epos>>2]=HEAP8[360+(HEAP32[$1>>2]|0)|0]|0;$nerrors_2=1;label=9;break;case 3:if(($2|0)>0){label=4;break}else{$nerrors_2=0;label=9;break};case 4:$13=HEAP32[$o+4>>2]|0;$15=HEAP32[$o+8>>2]|0;$nerrors_015=0;$i_016=0;label=5;break;case 5:$23=HEAP8[360+(HEAPU8[376+($i_016<<1)|0]|0)|0]|0;$27=HEAPU8[376+($23+$i_016)|0]|0;$29=(_gf16_hmul(HEAP32[$1>>2]|0,$23)|0)^$27;if(($29^(_gf16_hmul($13,$i_016)|0)|0)==($15|0)){label=6;break}else{$nerrors_1=$nerrors_015;label=7;break};case 6:HEAP32[$_epos+($nerrors_015<<2)>>2]=$i_016;$nerrors_1=$nerrors_015+1|0;label=7;break;case 7:$37=$i_016+1|0;if(($37|0)<15){$nerrors_015=$nerrors_1;$i_016=$37;label=5;break}else{label=8;break};case 8:if(($nerrors_1|0)<($2|0)){$_0=-1;label=10;break}else{$nerrors_2=$nerrors_1;label=9;break};case 9:$_0=$nerrors_2;label=10;break;case 10:STACKTOP=__stackBase__;return $_0|0}return 0}function _bch15_5_calc_omega($_o,$_s){$_o=$_o|0;$_s=$_s|0;var $2=0,$3=0,$5=0,$6=0,$7=0,$11=0,$16=0,$d_0=0,$25=0,label=0;label=1;while(1)switch(label|0){case 1:HEAP32[$_o>>2]=HEAP32[$_s>>2];$2=HEAP32[$_s>>2]|0;$3=_gf16_mul($2,$2)|0;$5=HEAP32[$_s+4>>2]|0;$6=_gf16_mul($2,$3)|0;$7=$6^$5;if(($5|0)==($6|0)){$16=0;label=3;break}else{label=2;break};case 2:$11=_gf16_mul($3,$5)|0;$16=_gf16_div(HEAP32[$_s+8>>2]^$11,$7)|0;label=3;break;case 3:HEAP32[$_o+4>>2]=$16;HEAP32[$_o+8>>2]=(_gf16_mul(HEAP32[$_s>>2]|0,$16)|0)^$7;$d_0=3;label=4;break;case 4:if(($d_0|0)>0){label=5;break}else{label=6;break};case 5:$25=$d_0-1|0;if((HEAP32[$_o+($25<<2)>>2]|0)==0){$d_0=$25;label=4;break}else{label=6;break};case 6:return $d_0|0}return 0}function _qr_binarize($_img,$_width,$_height){$_img=$_img|0;$_width=$_width|0;$_height=$_height|0;var $5=0,$logwindw_0=0,$logwindh_0=0,$24=0,$25=0,$28=0,$30=0,$x_0129=0,$35=0,$39=0,$43=0,$46=0,$47=0,$49=0,$y_0126=0,$57=0,$x_1120=0,$62=0,$65=0,$67=0,$y_1118=0,$70=0,$72=0,$m_0111=0,$x_2110=0,$81=0,$82=0,$m_0_lcssa=0,$84=0,$x_3_ph=0,$m_1_ph=0,$x_3=0,$88=0,$98=0,$101=0,$108=0,$122=0,$126=0,$132=0,$133=0,$140=0,$x_4116=0,$145=0,$147=0,$153=0,$mask_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($_width|0)>0&($_height|0)>0){label=2;break}else{$mask_0=0;label=30;break};case 2:$5=_malloc(Math_imul($_height,$_width)|0)|0;$logwindw_0=4;label=3;break;case 3:if(($logwindw_0|0)<8){label=4;break}else{label=5;break};case 4:if((1<<$logwindw_0|0)<($_width+7>>3|0)){$logwindw_0=$logwindw_0+1|0;label=3;break}else{label=5;break};case 5:$logwindh_0=4;label=6;break;case 6:if(($logwindh_0|0)<8){label=7;break}else{label=8;break};case 7:if((1<<$logwindh_0|0)<($_height+7>>3|0)){$logwindh_0=$logwindh_0+1|0;label=6;break}else{label=8;break};case 8:$24=_malloc($_width<<2)|0;$25=$24;if(($_width|0)>0){label=9;break}else{label=10;break};case 9:$x_0129=0;label=12;break;case 10:$28=1<<$logwindh_0>>1;if(($28|0)>1){label=11;break}else{label=13;break};case 11:$30=$_height-1|0;$y_0126=1;label=15;break;case 12:$35=HEAPU8[$_img+$x_0129|0]|0;HEAP32[$25+($x_0129<<2)>>2]=($35<<$logwindh_0-1)+$35;$39=$x_0129+1|0;if(($39|0)<($_width|0)){$x_0129=$39;label=12;break}else{label=10;break};case 13:if(($_height|0)>0){label=14;break}else{label=29;break};case 14:$43=1<<$logwindw_0>>1;$46=$_width-1|0;$47=$_height-1|0;$49=$_width-1|0;$y_1118=0;label=18;break;case 15:$57=Math_imul(($30-$y_0126&-(($30|0)<($y_0126|0)&1))+$y_0126|0,$_width)|0;if(($_width|0)>0){$x_1120=0;label=16;break}else{label=17;break};case 16:$62=$25+($x_1120<<2)|0;HEAP32[$62>>2]=(HEAP32[$62>>2]|0)+(HEAPU8[$_img+($x_1120+$57)|0]|0);$65=$x_1120+1|0;if(($65|0)<($_width|0)){$x_1120=$65;label=16;break}else{label=17;break};case 17:$67=$y_0126+1|0;if(($67|0)<($28|0)){$y_0126=$67;label=15;break}else{label=13;break};case 18:$70=HEAP32[$25>>2]|0;$72=($70<<$logwindw_0-1)+$70|0;if(($43|0)>1){$x_2110=1;$m_0111=$72;label=19;break}else{$m_0_lcssa=$72;label=20;break};case 19:$81=(HEAP32[$25+(($49-$x_2110&-(($49|0)<($x_2110|0)&1))+$x_2110<<2)>>2]|0)+$m_0111|0;$82=$x_2110+1|0;if(($82|0)<($43|0)){$x_2110=$82;$m_0111=$81;label=19;break}else{$m_0_lcssa=$81;label=20;break};case 20:$84=Math_imul($y_1118,$_width)|0;$m_1_ph=$m_0_lcssa;$x_3_ph=0;label=21;break;case 21:$x_3=$x_3_ph;label=22;break;case 22:if(($x_3|0)<($_width|0)){label=23;break}else{label=25;break};case 23:$88=$x_3+$84|0;HEAP8[$5+$88|0]=-((HEAPU8[$_img+$88|0]|0)+3<<$logwindh_0+$logwindw_0>>>0<$m_1_ph>>>0&1)&255;$98=$x_3+1|0;if(($98|0)<($_width|0)){label=24;break}else{$x_3=$98;label=22;break};case 24:$101=$x_3-$43|0;$108=$x_3+$43|0;$m_1_ph=(HEAP32[$25+(($46-$108&-(($46|0)<($108|0)&1))+$108<<2)>>2]|0)+$m_1_ph-(HEAP32[$25+(-(-(($101|0)>0&1)&-$101)<<2)>>2]|0)|0;$x_3_ph=$98;label=21;break;case 25:$122=$y_1118+1|0;if(($122|0)<($_height|0)){label=27;break}else{label=26;break};case 26:if(($122|0)<($_height|0)){$y_1118=$122;label=18;break}else{label=29;break};case 27:$126=$y_1118-$28|0;$132=Math_imul(-(($126|0)>0&1)&-$126,$_width)|0;$133=$y_1118+$28|0;$140=Math_imul(($47-$133&-(($47|0)<($133|0)&1))+$133|0,$_width)|0;if(($_width|0)>0){$x_4116=0;label=28;break}else{label=26;break};case 28:$145=$25+($x_4116<<2)|0;$147=(HEAP32[$145>>2]|0)-(HEAPU8[$_img+($x_4116-$132)|0]|0)|0;HEAP32[$145>>2]=$147;HEAP32[$145>>2]=(HEAPU8[$_img+($x_4116+$140)|0]|0)+$147;$153=$x_4116+1|0;if(($153|0)<($_width|0)){$x_4116=$153;label=28;break}else{label=26;break};case 29:_free($24);$mask_0=$5;label=30;break;case 30:return $mask_0|0}return 0}function _isaac_init($_ctx,$_seed,$_nseed){$_ctx=$_ctx|0;$_seed=$_seed|0;$_nseed=$_nseed|0;var $x=0,$11=0,$__nseed=0,$13=0,$i_162=0,$15=0,$38=0,$i_1_lcssa=0,$40=0,$43=0,$47=0,$j_061=0,$57=0,$i_2=0,$i_360=0,$69=0,$75=0,$81=0,$87=0,$93=0,$99=0,$105=0,$111=0,$116=0,$i_457=0,$120=0,$126=0,$132=0,$138=0,$144=0,$150=0,$156=0,$162=0,$167=0,label=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+32|0;label=1;while(1)switch(label|0){case 1:$x=__stackBase__|0;HEAP32[$_ctx+2060>>2]=0;HEAP32[$_ctx+2056>>2]=0;HEAP32[$_ctx+2052>>2]=0;HEAP32[$x+28>>2]=-1640531527;HEAP32[$x+24>>2]=-1640531527;HEAP32[$x+20>>2]=-1640531527;HEAP32[$x+16>>2]=-1640531527;HEAP32[$x+12>>2]=-1640531527;HEAP32[$x+8>>2]=-1640531527;HEAP32[$x+4>>2]=-1640531527;$11=$x|0;HEAP32[$11>>2]=-1640531527;_isaac_mix($11);_isaac_mix($11);_isaac_mix($11);_isaac_mix($11);$__nseed=($_nseed|0)>1024?1024:$_nseed;$13=$__nseed>>2;if(($13|0)>0){$i_162=0;label=2;break}else{$i_1_lcssa=0;label=3;break};case 2:$15=$i_162<<2;HEAP32[$_ctx+4+($i_162<<2)>>2]=(HEAPU8[$_seed+($15|2)|0]|0)<<16|(HEAPU8[$_seed+($15|3)|0]|0)<<24|(HEAPU8[$_seed+($15|1)|0]|0)<<8|(HEAPU8[$_seed+$15|0]|0);$38=$i_162+1|0;if(($38|0)<($13|0)){$i_162=$38;label=2;break}else{$i_1_lcssa=$13;label=3;break};case 3:$40=$__nseed&3;if(($40|0)==0){$i_2=$i_1_lcssa;label=7;break}else{label=4;break};case 4:$43=$i_1_lcssa<<2;$47=$_ctx+4+($i_1_lcssa<<2)|0;HEAP32[$47>>2]=HEAPU8[$_seed+$43|0]|0;if($40>>>0>1){$j_061=1;label=5;break}else{label=6;break};case 5:HEAP32[$47>>2]=((HEAPU8[$_seed+($j_061|$43)|0]|0)<<($j_061<<3))+(HEAP32[$47>>2]|0);$57=$j_061+1|0;if(($57|0)<($40|0)){$j_061=$57;label=5;break}else{label=6;break};case 6:$i_2=$i_1_lcssa+1|0;label=7;break;case 7:_memset($_ctx+4+($i_2<<2)|0,0,256-$i_2<<2|0);$i_360=0;label=9;break;case 8:$i_457=0;label=10;break;case 9:$69=$x|0;HEAP32[$69>>2]=(HEAP32[$69>>2]|0)+(HEAP32[$_ctx+4+($i_360<<2)>>2]|0);$75=$x+4|0;HEAP32[$75>>2]=(HEAP32[$75>>2]|0)+(HEAP32[$_ctx+4+(($i_360|1)<<2)>>2]|0);$81=$x+8|0;HEAP32[$81>>2]=(HEAP32[$81>>2]|0)+(HEAP32[$_ctx+4+(($i_360|2)<<2)>>2]|0);$87=$x+12|0;HEAP32[$87>>2]=(HEAP32[$87>>2]|0)+(HEAP32[$_ctx+4+(($i_360|3)<<2)>>2]|0);$93=$x+16|0;HEAP32[$93>>2]=(HEAP32[$93>>2]|0)+(HEAP32[$_ctx+4+(($i_360|4)<<2)>>2]|0);$99=$x+20|0;HEAP32[$99>>2]=(HEAP32[$99>>2]|0)+(HEAP32[$_ctx+4+(($i_360|5)<<2)>>2]|0);$105=$x+24|0;HEAP32[$105>>2]=(HEAP32[$105>>2]|0)+(HEAP32[$_ctx+4+(($i_360|6)<<2)>>2]|0);$111=$x+28|0;HEAP32[$111>>2]=(HEAP32[$111>>2]|0)+(HEAP32[$_ctx+4+(($i_360|7)<<2)>>2]|0);_isaac_mix($11);_memcpy($_ctx+1028+($i_360<<2)|0,$x|0,32)|0;$116=$i_360+8|0;if(($116|0)<256){$i_360=$116;label=9;break}else{label=8;break};case 10:$120=$x|0;HEAP32[$120>>2]=(HEAP32[$120>>2]|0)+(HEAP32[$_ctx+1028+($i_457<<2)>>2]|0);$126=$x+4|0;HEAP32[$126>>2]=(HEAP32[$126>>2]|0)+(HEAP32[$_ctx+1028+(($i_457|1)<<2)>>2]|0);$132=$x+8|0;HEAP32[$132>>2]=(HEAP32[$132>>2]|0)+(HEAP32[$_ctx+1028+(($i_457|2)<<2)>>2]|0);$138=$x+12|0;HEAP32[$138>>2]=(HEAP32[$138>>2]|0)+(HEAP32[$_ctx+1028+(($i_457|3)<<2)>>2]|0);$144=$x+16|0;HEAP32[$144>>2]=(HEAP32[$144>>2]|0)+(HEAP32[$_ctx+1028+(($i_457|4)<<2)>>2]|0);$150=$x+20|0;HEAP32[$150>>2]=(HEAP32[$150>>2]|0)+(HEAP32[$_ctx+1028+(($i_457|5)<<2)>>2]|0);$156=$x+24|0;HEAP32[$156>>2]=(HEAP32[$156>>2]|0)+(HEAP32[$_ctx+1028+(($i_457|6)<<2)>>2]|0);$162=$x+28|0;HEAP32[$162>>2]=(HEAP32[$162>>2]|0)+(HEAP32[$_ctx+1028+(($i_457|7)<<2)>>2]|0);_isaac_mix($11);_memcpy($_ctx+1028+($i_457<<2)|0,$x|0,32)|0;$167=$i_457+8|0;if(($167|0)<256){$i_457=$167;label=10;break}else{label=11;break};case 11:_isaac_update($_ctx);STACKTOP=__stackBase__;return}}function _isaac_update($_ctx){$_ctx=$_ctx|0;var $1=0,$2=0,$3=0,$4=0,$5=0,$7=0,$i_0148=0,$b_0147=0,$a_0146=0,$10=0,$11=0,$17=0,$23=0,$28=0,$30=0,$31=0,$32=0,$38=0,$44=0,$49=0,$51=0,$52=0,$53=0,$59=0,$65=0,$70=0,$72=0,$73=0,$74=0,$80=0,$86=0,$91=0,$93=0,$i_1145=0,$b_1144=0,$a_1143=0,$95=0,$96=0,$102=0,$108=0,$113=0,$115=0,$116=0,$117=0,$123=0,$129=0,$134=0,$136=0,$137=0,$138=0,$144=0,$150=0,$155=0,$157=0,$158=0,$159=0,$165=0,$171=0,$176=0,$178=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$_ctx+2052|0;$2=HEAP32[$1>>2]|0;$3=$_ctx+2056|0;$4=HEAP32[$3>>2]|0;$5=$_ctx+2060|0;$7=(HEAP32[$5>>2]|0)+1|0;HEAP32[$5>>2]=$7;$a_0146=$2;$b_0147=$7+$4|0;$i_0148=0;label=2;break;case 2:$10=$_ctx+1028+($i_0148<<2)|0;$11=HEAP32[$10>>2]|0;$17=(HEAP32[$_ctx+1028+($i_0148+128<<2)>>2]|0)+($a_0146<<13^$a_0146)|0;$23=$17+$b_0147+(HEAP32[$_ctx+1028+(($11>>>2&255)<<2)>>2]|0)|0;HEAP32[$10>>2]=$23;$28=(HEAP32[$_ctx+1028+(($23>>>10&255)<<2)>>2]|0)+$11|0;HEAP32[$_ctx+4+($i_0148<<2)>>2]=$28;$30=$i_0148|1;$31=$_ctx+1028+($30<<2)|0;$32=HEAP32[$31>>2]|0;$38=(HEAP32[$_ctx+1028+($i_0148+129<<2)>>2]|0)+($17>>>6^$17)|0;$44=$38+$28+(HEAP32[$_ctx+1028+(($32>>>2&255)<<2)>>2]|0)|0;HEAP32[$31>>2]=$44;$49=(HEAP32[$_ctx+1028+(($44>>>10&255)<<2)>>2]|0)+$32|0;HEAP32[$_ctx+4+($30<<2)>>2]=$49;$51=$i_0148|2;$52=$_ctx+1028+($51<<2)|0;$53=HEAP32[$52>>2]|0;$59=(HEAP32[$_ctx+1028+($i_0148+130<<2)>>2]|0)+($38<<2^$38)|0;$65=$59+$49+(HEAP32[$_ctx+1028+(($53>>>2&255)<<2)>>2]|0)|0;HEAP32[$52>>2]=$65;$70=(HEAP32[$_ctx+1028+(($65>>>10&255)<<2)>>2]|0)+$53|0;HEAP32[$_ctx+4+($51<<2)>>2]=$70;$72=$i_0148|3;$73=$_ctx+1028+($72<<2)|0;$74=HEAP32[$73>>2]|0;$80=(HEAP32[$_ctx+1028+($i_0148+131<<2)>>2]|0)+($59>>>16^$59)|0;$86=$80+$70+(HEAP32[$_ctx+1028+(($74>>>2&255)<<2)>>2]|0)|0;HEAP32[$73>>2]=$86;$91=(HEAP32[$_ctx+1028+(($86>>>10&255)<<2)>>2]|0)+$74|0;HEAP32[$_ctx+4+($72<<2)>>2]=$91;$93=$i_0148+4|0;if(($93|0)<128){$a_0146=$80;$b_0147=$91;$i_0148=$93;label=2;break}else{$a_1143=$80;$b_1144=$91;$i_1145=128;label=3;break};case 3:$95=$_ctx+1028+($i_1145<<2)|0;$96=HEAP32[$95>>2]|0;$102=(HEAP32[$_ctx+1028+($i_1145-128<<2)>>2]|0)+($a_1143<<13^$a_1143)|0;$108=$102+$b_1144+(HEAP32[$_ctx+1028+(($96>>>2&255)<<2)>>2]|0)|0;HEAP32[$95>>2]=$108;$113=(HEAP32[$_ctx+1028+(($108>>>10&255)<<2)>>2]|0)+$96|0;HEAP32[$_ctx+4+($i_1145<<2)>>2]=$113;$115=$i_1145|1;$116=$_ctx+1028+($115<<2)|0;$117=HEAP32[$116>>2]|0;$123=(HEAP32[$_ctx+1028+($i_1145-127<<2)>>2]|0)+($102>>>6^$102)|0;$129=$123+$113+(HEAP32[$_ctx+1028+(($117>>>2&255)<<2)>>2]|0)|0;HEAP32[$116>>2]=$129;$134=(HEAP32[$_ctx+1028+(($129>>>10&255)<<2)>>2]|0)+$117|0;HEAP32[$_ctx+4+($115<<2)>>2]=$134;$136=$i_1145|2;$137=$_ctx+1028+($136<<2)|0;$138=HEAP32[$137>>2]|0;$144=(HEAP32[$_ctx+1028+($i_1145-126<<2)>>2]|0)+($123<<2^$123)|0;$150=$144+$134+(HEAP32[$_ctx+1028+(($138>>>2&255)<<2)>>2]|0)|0;HEAP32[$137>>2]=$150;$155=(HEAP32[$_ctx+1028+(($150>>>10&255)<<2)>>2]|0)+$138|0;HEAP32[$_ctx+4+($136<<2)>>2]=$155;$157=$i_1145|3;$158=$_ctx+1028+($157<<2)|0;$159=HEAP32[$158>>2]|0;$165=(HEAP32[$_ctx+1028+($i_1145-125<<2)>>2]|0)+($144>>>16^$144)|0;$171=$165+$155+(HEAP32[$_ctx+1028+(($159>>>2&255)<<2)>>2]|0)|0;HEAP32[$158>>2]=$171;$176=(HEAP32[$_ctx+1028+(($171>>>10&255)<<2)>>2]|0)+$159|0;HEAP32[$_ctx+4+($157<<2)>>2]=$176;$178=$i_1145+4|0;if(($178|0)<256){$a_1143=$165;$b_1144=$176;$i_1145=$178;label=3;break}else{label=4;break};case 4:HEAP32[$3>>2]=$176;HEAP32[$1>>2]=$165;HEAP32[$_ctx>>2]=256;return}}function _isaac_next_uint32($_ctx){$_ctx=$_ctx|0;var $1=0,$7=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$_ctx|0;if((HEAP32[$1>>2]|0)==0){label=2;break}else{label=3;break};case 2:_isaac_update($_ctx);label=3;break;case 3:$7=(HEAP32[$1>>2]|0)-1|0;HEAP32[$1>>2]=$7;return HEAP32[$_ctx+4+($7<<2)>>2]|0}return 0}function _isaac_next_uint($_ctx,$_n){$_ctx=$_ctx|0;$_n=$_n|0;var $3=0,$4=0,label=0;label=1;while(1)switch(label|0){case 1:label=2;break;case 2:$3=_isaac_next_uint32($_ctx)|0;$4=($3>>>0)%($_n>>>0)>>>0;_llvm_uadd_with_overflow_i32($_n-1|0,$3-$4|0)|0;if(tempRet0){label=2;break}else{label=3;break};case 3:return $4|0}return 0}function _malloc($bytes){$bytes=$bytes|0;var $8=0,$9=0,$10=0,$11=0,$17=0,$18=0,$20=0,$21=0,$22=0,$23=0,$24=0,$35=0,$40=0,$45=0,$56=0,$59=0,$62=0,$64=0,$65=0,$67=0,$69=0,$71=0,$73=0,$75=0,$77=0,$79=0,$82=0,$83=0,$85=0,$86=0,$87=0,$88=0,$89=0,$100=0,$105=0,$106=0,$109=0,$117=0,$120=0,$121=0,$122=0,$124=0,$125=0,$126=0,$133=0,$F4_0=0,$149=0,$155=0,$159=0,$nb_0=0,$162=0,$165=0,$166=0,$169=0,$184=0,$191=0,$194=0,$195=0,$196=0,$mem_0=0,label=0;label=1;while(1)switch(label|0){case 1:if($bytes>>>0<245){label=2;break}else{label=29;break};case 2:if($bytes>>>0<11){$8=16;label=4;break}else{label=3;break};case 3:$8=$bytes+11&-8;label=4;break;case 4:$9=$8>>>3;$10=HEAP32[1982]|0;$11=$10>>>($9>>>0);if(($11&3|0)==0){label=12;break}else{label=5;break};case 5:$17=($11&1^1)+$9|0;$18=$17<<1;$20=7968+($18<<2)|0;$21=7968+($18+2<<2)|0;$22=HEAP32[$21>>2]|0;$23=$22+8|0;$24=HEAP32[$23>>2]|0;if(($20|0)==($24|0)){label=6;break}else{label=7;break};case 6:HEAP32[1982]=$10&(1<<$17^-1);label=11;break;case 7:if($24>>>0<(HEAP32[1986]|0)>>>0){label=10;break}else{label=8;break};case 8:$35=$24+12|0;if((HEAP32[$35>>2]|0)==($22|0)){label=9;break}else{label=10;break};case 9:HEAP32[$35>>2]=$20;HEAP32[$21>>2]=$24;label=11;break;case 10:_abort();return 0;return 0;case 11:$40=$17<<3;HEAP32[$22+4>>2]=$40|3;$45=$22+($40|4)|0;HEAP32[$45>>2]=HEAP32[$45>>2]|1;$mem_0=$23;label=40;break;case 12:if($8>>>0>(HEAP32[1984]|0)>>>0){label=13;break}else{$nb_0=$8;label=32;break};case 13:if(($11|0)==0){label=27;break}else{label=14;break};case 14:$56=2<<$9;$59=$11<<$9&($56|-$56);$62=($59&-$59)-1|0;$64=$62>>>12&16;$65=$62>>>($64>>>0);$67=$65>>>5&8;$69=$65>>>($67>>>0);$71=$69>>>2&4;$73=$69>>>($71>>>0);$75=$73>>>1&2;$77=$73>>>($75>>>0);$79=$77>>>1&1;$82=($67|$64|$71|$75|$79)+($77>>>($79>>>0))|0;$83=$82<<1;$85=7968+($83<<2)|0;$86=7968+($83+2<<2)|0;$87=HEAP32[$86>>2]|0;$88=$87+8|0;$89=HEAP32[$88>>2]|0;if(($85|0)==($89|0)){label=15;break}else{label=16;break};case 15:HEAP32[1982]=$10&(1<<$82^-1);label=20;break;case 16:if($89>>>0<(HEAP32[1986]|0)>>>0){label=19;break}else{label=17;break};case 17:$100=$89+12|0;if((HEAP32[$100>>2]|0)==($87|0)){label=18;break}else{label=19;break};case 18:HEAP32[$100>>2]=$85;HEAP32[$86>>2]=$89;label=20;break;case 19:_abort();return 0;return 0;case 20:$105=$82<<3;$106=$105-$8|0;HEAP32[$87+4>>2]=$8|3;$109=$87;HEAP32[$109+($8|4)>>2]=$106|1;HEAP32[$109+$105>>2]=$106;$117=HEAP32[1984]|0;if(($117|0)==0){label=26;break}else{label=21;break};case 21:$120=HEAP32[1987]|0;$121=$117>>>3;$122=$121<<1;$124=7968+($122<<2)|0;$125=HEAP32[1982]|0;$126=1<<$121;if(($125&$126|0)==0){label=22;break}else{label=23;break};case 22:HEAP32[1982]=$125|$126;$F4_0=$124;label=25;break;case 23:$133=HEAP32[7968+($122+2<<2)>>2]|0;if($133>>>0<(HEAP32[1986]|0)>>>0){label=24;break}else{$F4_0=$133;label=25;break};case 24:_abort();return 0;return 0;case 25:HEAP32[7968+($122+2<<2)>>2]=$120;HEAP32[$F4_0+12>>2]=$120;HEAP32[$120+8>>2]=$F4_0;HEAP32[$120+12>>2]=$124;label=26;break;case 26:HEAP32[1984]=$106;HEAP32[1987]=$109+$8;$mem_0=$88;label=40;break;case 27:if((HEAP32[1983]|0)==0){$nb_0=$8;label=32;break}else{label=28;break};case 28:$149=_tmalloc_small($8)|0;if(($149|0)==0){$nb_0=$8;label=32;break}else{$mem_0=$149;label=40;break};case 29:if($bytes>>>0>4294967231){$nb_0=-1;label=32;break}else{label=30;break};case 30:$155=$bytes+11&-8;if((HEAP32[1983]|0)==0){$nb_0=$155;label=32;break}else{label=31;break};case 31:$159=_tmalloc_large($155)|0;if(($159|0)==0){$nb_0=$155;label=32;break}else{$mem_0=$159;label=40;break};case 32:$162=HEAP32[1984]|0;if($nb_0>>>0>$162>>>0){label=37;break}else{label=33;break};case 33:$165=$162-$nb_0|0;$166=HEAP32[1987]|0;if($165>>>0>15){label=34;break}else{label=35;break};case 34:$169=$166;HEAP32[1987]=$169+$nb_0;HEAP32[1984]=$165;HEAP32[$169+($nb_0+4)>>2]=$165|1;HEAP32[$169+$162>>2]=$165;HEAP32[$166+4>>2]=$nb_0|3;label=36;break;case 35:HEAP32[1984]=0;HEAP32[1987]=0;HEAP32[$166+4>>2]=$162|3;$184=$166+($162+4)|0;HEAP32[$184>>2]=HEAP32[$184>>2]|1;label=36;break;case 36:$mem_0=$166+8|0;label=40;break;case 37:$191=HEAP32[1985]|0;if($nb_0>>>0<$191>>>0){label=38;break}else{label=39;break};case 38:$194=$191-$nb_0|0;HEAP32[1985]=$194;$195=HEAP32[1988]|0;$196=$195;HEAP32[1988]=$196+$nb_0;HEAP32[$196+($nb_0+4)>>2]=$194|1;HEAP32[$195+4>>2]=$nb_0|3;$mem_0=$195+8|0;label=40;break;case 39:$mem_0=_sys_alloc($nb_0)|0;label=40;break;case 40:return $mem_0|0}return 0}function _tmalloc_small($nb){$nb=$nb|0;var $1=0,$4=0,$6=0,$7=0,$9=0,$11=0,$13=0,$15=0,$17=0,$19=0,$21=0,$26=0,$rsize_0=0,$v_0=0,$t_0=0,$33=0,$37=0,$39=0,$43=0,$44=0,$46=0,$47=0,$50=0,$55=0,$57=0,$61=0,$65=0,$69=0,$74=0,$75=0,$78=0,$79=0,$RP_0=0,$R_0=0,$81=0,$85=0,$CP_0=0,$R_1=0,$98=0,$100=0,$114=0,$130=0,$142=0,$156=0,$160=0,$171=0,$174=0,$175=0,$176=0,$178=0,$179=0,$180=0,$187=0,$F1_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=HEAP32[1983]|0;$4=($1&-$1)-1|0;$6=$4>>>12&16;$7=$4>>>($6>>>0);$9=$7>>>5&8;$11=$7>>>($9>>>0);$13=$11>>>2&4;$15=$11>>>($13>>>0);$17=$15>>>1&2;$19=$15>>>($17>>>0);$21=$19>>>1&1;$26=HEAP32[8232+(($9|$6|$13|$17|$21)+($19>>>($21>>>0))<<2)>>2]|0;$t_0=$26;$v_0=$26;$rsize_0=(HEAP32[$26+4>>2]&-8)-$nb|0;label=2;break;case 2:$33=HEAP32[$t_0+16>>2]|0;if(($33|0)==0){label=3;break}else{$39=$33;label=4;break};case 3:$37=HEAP32[$t_0+20>>2]|0;if(($37|0)==0){label=5;break}else{$39=$37;label=4;break};case 4:$43=(HEAP32[$39+4>>2]&-8)-$nb|0;$44=$43>>>0<$rsize_0>>>0;$t_0=$39;$v_0=$44?$39:$v_0;$rsize_0=$44?$43:$rsize_0;label=2;break;case 5:$46=$v_0;$47=HEAP32[1986]|0;if($46>>>0<$47>>>0){label=51;break}else{label=6;break};case 6:$50=$46+$nb|0;if($46>>>0<$50>>>0){label=7;break}else{label=51;break};case 7:$55=HEAP32[$v_0+24>>2]|0;$57=HEAP32[$v_0+12>>2]|0;if(($57|0)==($v_0|0)){label=13;break}else{label=8;break};case 8:$61=HEAP32[$v_0+8>>2]|0;if($61>>>0<$47>>>0){label=12;break}else{label=9;break};case 9:$65=$61+12|0;if((HEAP32[$65>>2]|0)==($v_0|0)){label=10;break}else{label=12;break};case 10:$69=$57+8|0;if((HEAP32[$69>>2]|0)==($v_0|0)){label=11;break}else{label=12;break};case 11:HEAP32[$65>>2]=$57;HEAP32[$69>>2]=$61;$R_1=$57;label=21;break;case 12:_abort();return 0;return 0;case 13:$74=$v_0+20|0;$75=HEAP32[$74>>2]|0;if(($75|0)==0){label=14;break}else{$R_0=$75;$RP_0=$74;label=15;break};case 14:$78=$v_0+16|0;$79=HEAP32[$78>>2]|0;if(($79|0)==0){$R_1=0;label=21;break}else{$R_0=$79;$RP_0=$78;label=15;break};case 15:$81=$R_0+20|0;if((HEAP32[$81>>2]|0)==0){label=16;break}else{$CP_0=$81;label=17;break};case 16:$85=$R_0+16|0;if((HEAP32[$85>>2]|0)==0){label=18;break}else{$CP_0=$85;label=17;break};case 17:$R_0=HEAP32[$CP_0>>2]|0;$RP_0=$CP_0;label=15;break;case 18:if($RP_0>>>0<(HEAP32[1986]|0)>>>0){label=20;break}else{label=19;break};case 19:HEAP32[$RP_0>>2]=0;$R_1=$R_0;label=21;break;case 20:_abort();return 0;return 0;case 21:if(($55|0)==0){label=41;break}else{label=22;break};case 22:$98=$v_0+28|0;$100=8232+(HEAP32[$98>>2]<<2)|0;if(($v_0|0)==(HEAP32[$100>>2]|0)){label=23;break}else{label=25;break};case 23:HEAP32[$100>>2]=$R_1;if(($R_1|0)==0){label=24;break}else{label=31;break};case 24:HEAP32[1983]=HEAP32[1983]&(1<<HEAP32[$98>>2]^-1);label=41;break;case 25:if($55>>>0<(HEAP32[1986]|0)>>>0){label=29;break}else{label=26;break};case 26:$114=$55+16|0;if((HEAP32[$114>>2]|0)==($v_0|0)){label=27;break}else{label=28;break};case 27:HEAP32[$114>>2]=$R_1;label=30;break;case 28:HEAP32[$55+20>>2]=$R_1;label=30;break;case 29:_abort();return 0;return 0;case 30:if(($R_1|0)==0){label=41;break}else{label=31;break};case 31:if($R_1>>>0<(HEAP32[1986]|0)>>>0){label=40;break}else{label=32;break};case 32:HEAP32[$R_1+24>>2]=$55;$130=HEAP32[$v_0+16>>2]|0;if(($130|0)==0){label=36;break}else{label=33;break};case 33:if($130>>>0<(HEAP32[1986]|0)>>>0){label=35;break}else{label=34;break};case 34:HEAP32[$R_1+16>>2]=$130;HEAP32[$130+24>>2]=$R_1;label=36;break;case 35:_abort();return 0;return 0;case 36:$142=HEAP32[$v_0+20>>2]|0;if(($142|0)==0){label=41;break}else{label=37;break};case 37:if($142>>>0<(HEAP32[1986]|0)>>>0){label=39;break}else{label=38;break};case 38:HEAP32[$R_1+20>>2]=$142;HEAP32[$142+24>>2]=$R_1;label=41;break;case 39:_abort();return 0;return 0;case 40:_abort();return 0;return 0;case 41:if($rsize_0>>>0<16){label=42;break}else{label=43;break};case 42:$156=$rsize_0+$nb|0;HEAP32[$v_0+4>>2]=$156|3;$160=$46+($156+4)|0;HEAP32[$160>>2]=HEAP32[$160>>2]|1;label=50;break;case 43:HEAP32[$v_0+4>>2]=$nb|3;HEAP32[$46+($nb+4)>>2]=$rsize_0|1;HEAP32[$46+($rsize_0+$nb)>>2]=$rsize_0;$171=HEAP32[1984]|0;if(($171|0)==0){label=49;break}else{label=44;break};case 44:$174=HEAP32[1987]|0;$175=$171>>>3;$176=$175<<1;$178=7968+($176<<2)|0;$179=HEAP32[1982]|0;$180=1<<$175;if(($179&$180|0)==0){label=45;break}else{label=46;break};case 45:HEAP32[1982]=$179|$180;$F1_0=$178;label=48;break;case 46:$187=HEAP32[7968+($176+2<<2)>>2]|0;if($187>>>0<(HEAP32[1986]|0)>>>0){label=47;break}else{$F1_0=$187;label=48;break};case 47:_abort();return 0;return 0;case 48:HEAP32[7968+($176+2<<2)>>2]=$174;HEAP32[$F1_0+12>>2]=$174;HEAP32[$174+8>>2]=$F1_0;HEAP32[$174+12>>2]=$178;label=49;break;case 49:HEAP32[1984]=$rsize_0;HEAP32[1987]=$50;label=50;break;case 50:return $v_0+8|0;case 51:_abort();return 0;return 0}return 0}function _tmalloc_large($nb){$nb=$nb|0;var $1=0,$2=0,$9=0,$10=0,$13=0,$15=0,$18=0,$23=0,$idx_0=0,$31=0,$39=0,$rst_0=0,$sizebits_0=0,$t_0=0,$rsize_0=0,$v_0=0,$44=0,$45=0,$rsize_1=0,$v_1=0,$51=0,$54=0,$rst_1=0,$t_1=0,$rsize_2=0,$v_2=0,$62=0,$66=0,$71=0,$73=0,$74=0,$76=0,$78=0,$80=0,$82=0,$84=0,$86=0,$88=0,$t_2_ph=0,$v_330=0,$rsize_329=0,$t_228=0,$98=0,$99=0,$_rsize_3=0,$t_2_v_3=0,$101=0,$104=0,$v_3_lcssa=0,$rsize_3_lcssa=0,$112=0,$113=0,$116=0,$117=0,$121=0,$123=0,$127=0,$131=0,$135=0,$140=0,$141=0,$144=0,$145=0,$RP_0=0,$R_0=0,$147=0,$151=0,$CP_0=0,$R_1=0,$164=0,$166=0,$180=0,$196=0,$208=0,$222=0,$226=0,$237=0,$240=0,$242=0,$243=0,$244=0,$251=0,$F5_0=0,$264=0,$265=0,$272=0,$273=0,$276=0,$278=0,$281=0,$286=0,$I7_0=0,$293=0,$300=0,$301=0,$320=0,$T_0=0,$K12_0=0,$329=0,$330=0,$346=0,$347=0,$349=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=-$nb|0;$2=$nb>>>8;if(($2|0)==0){$idx_0=0;label=4;break}else{label=2;break};case 2:if($nb>>>0>16777215){$idx_0=31;label=4;break}else{label=3;break};case 3:$9=($2+1048320|0)>>>16&8;$10=$2<<$9;$13=($10+520192|0)>>>16&4;$15=$10<<$13;$18=($15+245760|0)>>>16&2;$23=14-($13|$9|$18)+($15<<$18>>>15)|0;$idx_0=$nb>>>(($23+7|0)>>>0)&1|$23<<1;label=4;break;case 4:$31=HEAP32[8232+($idx_0<<2)>>2]|0;if(($31|0)==0){$v_2=0;$rsize_2=$1;$t_1=0;label=11;break}else{label=5;break};case 5:if(($idx_0|0)==31){$39=0;label=7;break}else{label=6;break};case 6:$39=25-($idx_0>>>1)|0;label=7;break;case 7:$v_0=0;$rsize_0=$1;$t_0=$31;$sizebits_0=$nb<<$39;$rst_0=0;label=8;break;case 8:$44=HEAP32[$t_0+4>>2]&-8;$45=$44-$nb|0;if($45>>>0<$rsize_0>>>0){label=9;break}else{$v_1=$v_0;$rsize_1=$rsize_0;label=10;break};case 9:if(($44|0)==($nb|0)){$v_2=$t_0;$rsize_2=$45;$t_1=$t_0;label=11;break}else{$v_1=$t_0;$rsize_1=$45;label=10;break};case 10:$51=HEAP32[$t_0+20>>2]|0;$54=HEAP32[$t_0+16+($sizebits_0>>>31<<2)>>2]|0;$rst_1=($51|0)==0|($51|0)==($54|0)?$rst_0:$51;if(($54|0)==0){$v_2=$v_1;$rsize_2=$rsize_1;$t_1=$rst_1;label=11;break}else{$v_0=$v_1;$rsize_0=$rsize_1;$t_0=$54;$sizebits_0=$sizebits_0<<1;$rst_0=$rst_1;label=8;break};case 11:if(($t_1|0)==0&($v_2|0)==0){label=12;break}else{$t_2_ph=$t_1;label=14;break};case 12:$62=2<<$idx_0;$66=HEAP32[1983]&($62|-$62);if(($66|0)==0){$t_2_ph=$t_1;label=14;break}else{label=13;break};case 13:$71=($66&-$66)-1|0;$73=$71>>>12&16;$74=$71>>>($73>>>0);$76=$74>>>5&8;$78=$74>>>($76>>>0);$80=$78>>>2&4;$82=$78>>>($80>>>0);$84=$82>>>1&2;$86=$82>>>($84>>>0);$88=$86>>>1&1;$t_2_ph=HEAP32[8232+(($76|$73|$80|$84|$88)+($86>>>($88>>>0))<<2)>>2]|0;label=14;break;case 14:if(($t_2_ph|0)==0){$rsize_3_lcssa=$rsize_2;$v_3_lcssa=$v_2;label=17;break}else{$t_228=$t_2_ph;$rsize_329=$rsize_2;$v_330=$v_2;label=15;break};case 15:$98=(HEAP32[$t_228+4>>2]&-8)-$nb|0;$99=$98>>>0<$rsize_329>>>0;$_rsize_3=$99?$98:$rsize_329;$t_2_v_3=$99?$t_228:$v_330;$101=HEAP32[$t_228+16>>2]|0;if(($101|0)==0){label=16;break}else{$t_228=$101;$rsize_329=$_rsize_3;$v_330=$t_2_v_3;label=15;break};case 16:$104=HEAP32[$t_228+20>>2]|0;if(($104|0)==0){$rsize_3_lcssa=$_rsize_3;$v_3_lcssa=$t_2_v_3;label=17;break}else{$t_228=$104;$rsize_329=$_rsize_3;$v_330=$t_2_v_3;label=15;break};case 17:if(($v_3_lcssa|0)==0){$_0=0;label=82;break}else{label=18;break};case 18:if($rsize_3_lcssa>>>0<((HEAP32[1984]|0)-$nb|0)>>>0){label=19;break}else{$_0=0;label=82;break};case 19:$112=$v_3_lcssa;$113=HEAP32[1986]|0;if($112>>>0<$113>>>0){label=81;break}else{label=20;break};case 20:$116=$112+$nb|0;$117=$116;if($112>>>0<$116>>>0){label=21;break}else{label=81;break};case 21:$121=HEAP32[$v_3_lcssa+24>>2]|0;$123=HEAP32[$v_3_lcssa+12>>2]|0;if(($123|0)==($v_3_lcssa|0)){label=27;break}else{label=22;break};case 22:$127=HEAP32[$v_3_lcssa+8>>2]|0;if($127>>>0<$113>>>0){label=26;break}else{label=23;break};case 23:$131=$127+12|0;if((HEAP32[$131>>2]|0)==($v_3_lcssa|0)){label=24;break}else{label=26;break};case 24:$135=$123+8|0;if((HEAP32[$135>>2]|0)==($v_3_lcssa|0)){label=25;break}else{label=26;break};case 25:HEAP32[$131>>2]=$123;HEAP32[$135>>2]=$127;$R_1=$123;label=35;break;case 26:_abort();return 0;return 0;case 27:$140=$v_3_lcssa+20|0;$141=HEAP32[$140>>2]|0;if(($141|0)==0){label=28;break}else{$R_0=$141;$RP_0=$140;label=29;break};case 28:$144=$v_3_lcssa+16|0;$145=HEAP32[$144>>2]|0;if(($145|0)==0){$R_1=0;label=35;break}else{$R_0=$145;$RP_0=$144;label=29;break};case 29:$147=$R_0+20|0;if((HEAP32[$147>>2]|0)==0){label=30;break}else{$CP_0=$147;label=31;break};case 30:$151=$R_0+16|0;if((HEAP32[$151>>2]|0)==0){label=32;break}else{$CP_0=$151;label=31;break};case 31:$R_0=HEAP32[$CP_0>>2]|0;$RP_0=$CP_0;label=29;break;case 32:if($RP_0>>>0<(HEAP32[1986]|0)>>>0){label=34;break}else{label=33;break};case 33:HEAP32[$RP_0>>2]=0;$R_1=$R_0;label=35;break;case 34:_abort();return 0;return 0;case 35:if(($121|0)==0){label=55;break}else{label=36;break};case 36:$164=$v_3_lcssa+28|0;$166=8232+(HEAP32[$164>>2]<<2)|0;if(($v_3_lcssa|0)==(HEAP32[$166>>2]|0)){label=37;break}else{label=39;break};case 37:HEAP32[$166>>2]=$R_1;if(($R_1|0)==0){label=38;break}else{label=45;break};case 38:HEAP32[1983]=HEAP32[1983]&(1<<HEAP32[$164>>2]^-1);label=55;break;case 39:if($121>>>0<(HEAP32[1986]|0)>>>0){label=43;break}else{label=40;break};case 40:$180=$121+16|0;if((HEAP32[$180>>2]|0)==($v_3_lcssa|0)){label=41;break}else{label=42;break};case 41:HEAP32[$180>>2]=$R_1;label=44;break;case 42:HEAP32[$121+20>>2]=$R_1;label=44;break;case 43:_abort();return 0;return 0;case 44:if(($R_1|0)==0){label=55;break}else{label=45;break};case 45:if($R_1>>>0<(HEAP32[1986]|0)>>>0){label=54;break}else{label=46;break};case 46:HEAP32[$R_1+24>>2]=$121;$196=HEAP32[$v_3_lcssa+16>>2]|0;if(($196|0)==0){label=50;break}else{label=47;break};case 47:if($196>>>0<(HEAP32[1986]|0)>>>0){label=49;break}else{label=48;break};case 48:HEAP32[$R_1+16>>2]=$196;HEAP32[$196+24>>2]=$R_1;label=50;break;case 49:_abort();return 0;return 0;case 50:$208=HEAP32[$v_3_lcssa+20>>2]|0;if(($208|0)==0){label=55;break}else{label=51;break};case 51:if($208>>>0<(HEAP32[1986]|0)>>>0){label=53;break}else{label=52;break};case 52:HEAP32[$R_1+20>>2]=$208;HEAP32[$208+24>>2]=$R_1;label=55;break;case 53:_abort();return 0;return 0;case 54:_abort();return 0;return 0;case 55:if($rsize_3_lcssa>>>0<16){label=56;break}else{label=57;break};case 56:$222=$rsize_3_lcssa+$nb|0;HEAP32[$v_3_lcssa+4>>2]=$222|3;$226=$112+($222+4)|0;HEAP32[$226>>2]=HEAP32[$226>>2]|1;label=80;break;case 57:HEAP32[$v_3_lcssa+4>>2]=$nb|3;HEAP32[$112+($nb+4)>>2]=$rsize_3_lcssa|1;HEAP32[$112+($rsize_3_lcssa+$nb)>>2]=$rsize_3_lcssa;$237=$rsize_3_lcssa>>>3;if($rsize_3_lcssa>>>0<256){label=58;break}else{label=63;break};case 58:$240=$237<<1;$242=7968+($240<<2)|0;$243=HEAP32[1982]|0;$244=1<<$237;if(($243&$244|0)==0){label=59;break}else{label=60;break};case 59:HEAP32[1982]=$243|$244;$F5_0=$242;label=62;break;case 60:$251=HEAP32[7968+($240+2<<2)>>2]|0;if($251>>>0<(HEAP32[1986]|0)>>>0){label=61;break}else{$F5_0=$251;label=62;break};case 61:_abort();return 0;return 0;case 62:HEAP32[7968+($240+2<<2)>>2]=$117;HEAP32[$F5_0+12>>2]=$117;HEAP32[$112+($nb+8)>>2]=$F5_0;HEAP32[$112+($nb+12)>>2]=$242;label=80;break;case 63:$264=$116;$265=$rsize_3_lcssa>>>8;if(($265|0)==0){$I7_0=0;label=66;break}else{label=64;break};case 64:if($rsize_3_lcssa>>>0>16777215){$I7_0=31;label=66;break}else{label=65;break};case 65:$272=($265+1048320|0)>>>16&8;$273=$265<<$272;$276=($273+520192|0)>>>16&4;$278=$273<<$276;$281=($278+245760|0)>>>16&2;$286=14-($276|$272|$281)+($278<<$281>>>15)|0;$I7_0=$rsize_3_lcssa>>>(($286+7|0)>>>0)&1|$286<<1;label=66;break;case 66:$293=8232+($I7_0<<2)|0;HEAP32[$112+($nb+28)>>2]=$I7_0;HEAP32[$112+($nb+20)>>2]=0;HEAP32[$112+($nb+16)>>2]=0;$300=HEAP32[1983]|0;$301=1<<$I7_0;if(($300&$301|0)==0){label=67;break}else{label=68;break};case 67:HEAP32[1983]=$300|$301;HEAP32[$293>>2]=$264;HEAP32[$112+($nb+24)>>2]=$293;HEAP32[$112+($nb+12)>>2]=$264;HEAP32[$112+($nb+8)>>2]=$264;label=80;break;case 68:if(($I7_0|0)==31){$320=0;label=70;break}else{label=69;break};case 69:$320=25-($I7_0>>>1)|0;label=70;break;case 70:$K12_0=$rsize_3_lcssa<<$320;$T_0=HEAP32[$293>>2]|0;label=71;break;case 71:if((HEAP32[$T_0+4>>2]&-8|0)==($rsize_3_lcssa|0)){label=76;break}else{label=72;break};case 72:$329=$T_0+16+($K12_0>>>31<<2)|0;$330=HEAP32[$329>>2]|0;if(($330|0)==0){label=73;break}else{$K12_0=$K12_0<<1;$T_0=$330;label=71;break};case 73:if($329>>>0<(HEAP32[1986]|0)>>>0){label=75;break}else{label=74;break};case 74:HEAP32[$329>>2]=$264;HEAP32[$112+($nb+24)>>2]=$T_0;HEAP32[$112+($nb+12)>>2]=$264;HEAP32[$112+($nb+8)>>2]=$264;label=80;break;case 75:_abort();return 0;return 0;case 76:$346=$T_0+8|0;$347=HEAP32[$346>>2]|0;$349=HEAP32[1986]|0;if($T_0>>>0<$349>>>0){label=79;break}else{label=77;break};case 77:if($347>>>0<$349>>>0){label=79;break}else{label=78;break};case 78:HEAP32[$347+12>>2]=$264;HEAP32[$346>>2]=$264;HEAP32[$112+($nb+8)>>2]=$347;HEAP32[$112+($nb+12)>>2]=$T_0;HEAP32[$112+($nb+24)>>2]=0;label=80;break;case 79:_abort();return 0;return 0;case 80:$_0=$v_3_lcssa+8|0;label=82;break;case 81:_abort();return 0;return 0;case 82:return $_0|0}return 0}function _sys_alloc($nb){$nb=$nb|0;var $6=0,$10=0,$13=0,$16=0,$17=0,$25=0,$29=0,$31=0,$34=0,$35=0,$36=0,$ssize_0=0,$46=0,$47=0,$51=0,$57=0,$58=0,$61=0,$66=0,$69=0,$75=0,$ssize_1=0,$br_0=0,$tsize_0=0,$tbase_0=0,$84=0,$89=0,$ssize_2=0,$tsize_0172326=0,$tsize_1=0,$105=0,$106=0,$110=0,$112=0,$_tbase_1=0,$tbase_232=0,$tsize_231=0,$115=0,$123=0,$sp_044=0,$132=0,$133=0,$134=0,$135=0,$139=0,$147=0,$sp_137=0,$160=0,$161=0,$165=0,$172=0,$177=0,$180=0,$181=0,$182=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[42]|0)==0){label=2;break}else{label=3;break};case 2:_init_mparams();label=3;break;case 3:$6=HEAP32[44]|0;$10=$nb+47+$6&-$6;if($10>>>0>$nb>>>0){label=4;break}else{$_0=0;label=51;break};case 4:$13=HEAP32[2092]|0;if(($13|0)==0){label=6;break}else{label=5;break};case 5:$16=HEAP32[2090]|0;$17=$16+$10|0;if($17>>>0<=$16>>>0|$17>>>0>$13>>>0){$_0=0;label=51;break}else{label=6;break};case 6:if((HEAP32[2093]&4|0)==0){label=7;break}else{$tsize_1=0;label=26;break};case 7:$25=HEAP32[1988]|0;if(($25|0)==0){label=9;break}else{label=8;break};case 8:$29=_segment_holding($25)|0;if(($29|0)==0){label=9;break}else{label=16;break};case 9:$31=_sbrk(0)|0;if(($31|0)==-1){$tsize_0172326=0;label=25;break}else{label=10;break};case 10:$34=$31;$35=HEAP32[43]|0;$36=$35-1|0;if(($36&$34|0)==0){$ssize_0=$10;label=12;break}else{label=11;break};case 11:$ssize_0=$10-$34+($36+$34&-$35)|0;label=12;break;case 12:$46=HEAP32[2090]|0;$47=$46+$ssize_0|0;if($ssize_0>>>0>$nb>>>0&$ssize_0>>>0<2147483647){label=13;break}else{$tsize_0172326=0;label=25;break};case 13:$51=HEAP32[2092]|0;if(($51|0)==0){label=15;break}else{label=14;break};case 14:if($47>>>0<=$46>>>0|$47>>>0>$51>>>0){$tsize_0172326=0;label=25;break}else{label=15;break};case 15:$57=_sbrk($ssize_0|0)|0;$58=($57|0)==($31|0);$tbase_0=$58?$31:-1;$tsize_0=$58?$ssize_0:0;$br_0=$57;$ssize_1=$ssize_0;label=18;break;case 16:$61=HEAP32[44]|0;$66=$nb+47-(HEAP32[1985]|0)+$61&-$61;if($66>>>0<2147483647){label=17;break}else{$tsize_0172326=0;label=25;break};case 17:$69=_sbrk($66|0)|0;$75=($69|0)==((HEAP32[$29>>2]|0)+(HEAP32[$29+4>>2]|0)|0);$tbase_0=$75?$69:-1;$tsize_0=$75?$66:0;$br_0=$69;$ssize_1=$66;label=18;break;case 18:if(($tbase_0|0)==-1){label=19;break}else{$tsize_231=$tsize_0;$tbase_232=$tbase_0;label=29;break};case 19:if(($br_0|0)!=-1&$ssize_1>>>0<2147483647&$ssize_1>>>0<($nb+48|0)>>>0){label=20;break}else{$ssize_2=$ssize_1;label=24;break};case 20:$84=HEAP32[44]|0;$89=$nb+47-$ssize_1+$84&-$84;if($89>>>0<2147483647){label=21;break}else{$ssize_2=$ssize_1;label=24;break};case 21:if((_sbrk($89|0)|0)==-1){label=23;break}else{label=22;break};case 22:$ssize_2=$89+$ssize_1|0;label=24;break;case 23:_sbrk(-$ssize_1|0)|0;$tsize_0172326=$tsize_0;label=25;break;case 24:if(($br_0|0)==-1){$tsize_0172326=$tsize_0;label=25;break}else{$tsize_231=$ssize_2;$tbase_232=$br_0;label=29;break};case 25:HEAP32[2093]=HEAP32[2093]|4;$tsize_1=$tsize_0172326;label=26;break;case 26:if($10>>>0<2147483647){label=27;break}else{label=50;break};case 27:$105=_sbrk($10|0)|0;$106=_sbrk(0)|0;if(($106|0)!=-1&($105|0)!=-1&$105>>>0<$106>>>0){label=28;break}else{label=50;break};case 28:$110=$106-$105|0;$112=$110>>>0>($nb+40|0)>>>0;$_tbase_1=$112?$105:-1;if(($_tbase_1|0)==-1){label=50;break}else{$tsize_231=$112?$110:$tsize_1;$tbase_232=$_tbase_1;label=29;break};case 29:$115=(HEAP32[2090]|0)+$tsize_231|0;HEAP32[2090]=$115;if($115>>>0>(HEAP32[2091]|0)>>>0){label=30;break}else{label=31;break};case 30:HEAP32[2091]=$115;label=31;break;case 31:if((HEAP32[1988]|0)==0){label=32;break}else{$sp_044=8376;label=35;break};case 32:$123=HEAP32[1986]|0;if(($123|0)==0|$tbase_232>>>0<$123>>>0){label=33;break}else{label=34;break};case 33:HEAP32[1986]=$tbase_232;label=34;break;case 34:HEAP32[2094]=$tbase_232;HEAP32[2095]=$tsize_231;HEAP32[2097]=0;HEAP32[1991]=HEAP32[42];HEAP32[1990]=-1;_init_bins();_init_top($tbase_232,$tsize_231-40|0);label=48;break;case 35:$132=HEAP32[$sp_044>>2]|0;$133=$sp_044+4|0;$134=HEAP32[$133>>2]|0;$135=$132+$134|0;if(($tbase_232|0)==($135|0)){label=37;break}else{label=36;break};case 36:$139=HEAP32[$sp_044+8>>2]|0;if(($139|0)==0){label=40;break}else{$sp_044=$139;label=35;break};case 37:if((HEAP32[$sp_044+12>>2]&8|0)==0){label=38;break}else{label=40;break};case 38:$147=HEAP32[1988]|0;if($147>>>0>=$132>>>0&$147>>>0<$135>>>0){label=39;break}else{label=40;break};case 39:HEAP32[$133>>2]=$134+$tsize_231;_init_top(HEAP32[1988]|0,(HEAP32[1985]|0)+$tsize_231|0);label=48;break;case 40:if($tbase_232>>>0<(HEAP32[1986]|0)>>>0){label=41;break}else{label=42;break};case 41:HEAP32[1986]=$tbase_232;label=42;break;case 42:$sp_137=8376;label=43;break;case 43:$160=$sp_137|0;$161=HEAP32[$160>>2]|0;if(($161|0)==($tbase_232+$tsize_231|0)){label=45;break}else{label=44;break};case 44:$165=HEAP32[$sp_137+8>>2]|0;if(($165|0)==0){label=47;break}else{$sp_137=$165;label=43;break};case 45:if((HEAP32[$sp_137+12>>2]&8|0)==0){label=46;break}else{label=47;break};case 46:HEAP32[$160>>2]=$tbase_232;$172=$sp_137+4|0;HEAP32[$172>>2]=(HEAP32[$172>>2]|0)+$tsize_231;$_0=_prepend_alloc($tbase_232,$161,$nb)|0;label=51;break;case 47:_add_segment($tbase_232,$tsize_231);label=48;break;case 48:$177=HEAP32[1985]|0;if($177>>>0>$nb>>>0){label=49;break}else{label=50;break};case 49:$180=$177-$nb|0;HEAP32[1985]=$180;$181=HEAP32[1988]|0;$182=$181;HEAP32[1988]=$182+$nb;HEAP32[$182+($nb+4)>>2]=$180|1;HEAP32[$181+4>>2]=$nb|3;$_0=$181+8|0;label=51;break;case 50:HEAP32[(___errno_location()|0)>>2]=12;$_0=0;label=51;break;case 51:return $_0|0}return 0}function _free($mem){$mem=$mem|0;var $3=0,$5=0,$10=0,$11=0,$14=0,$15=0,$16=0,$21=0,$_sum233=0,$24=0,$25=0,$26=0,$32=0,$37=0,$40=0,$43=0,$71=0,$74=0,$77=0,$82=0,$86=0,$90=0,$96=0,$97=0,$101=0,$102=0,$RP_0=0,$R_0=0,$104=0,$108=0,$CP_0=0,$R_1=0,$122=0,$124=0,$138=0,$155=0,$168=0,$181=0,$psize_0=0,$p_0=0,$193=0,$197=0,$198=0,$208=0,$224=0,$231=0,$232=0,$237=0,$240=0,$243=0,$272=0,$275=0,$278=0,$283=0,$288=0,$292=0,$298=0,$299=0,$303=0,$304=0,$RP9_0=0,$R7_0=0,$306=0,$310=0,$CP10_0=0,$R7_1=0,$324=0,$326=0,$340=0,$357=0,$370=0,$psize_1=0,$396=0,$399=0,$401=0,$402=0,$403=0,$410=0,$F16_0=0,$421=0,$422=0,$429=0,$430=0,$433=0,$435=0,$438=0,$443=0,$I18_0=0,$450=0,$454=0,$455=0,$470=0,$T_0=0,$K19_0=0,$479=0,$480=0,$493=0,$494=0,$496=0,$508=0,label=0;label=1;while(1)switch(label|0){case 1:if(($mem|0)==0){label=141;break}else{label=2;break};case 2:$3=$mem-8|0;$5=HEAP32[1986]|0;if($3>>>0<$5>>>0){label=140;break}else{label=3;break};case 3:$10=HEAP32[$mem-4>>2]|0;$11=$10&3;if(($11|0)==1){label=140;break}else{label=4;break};case 4:$14=$10&-8;$15=$mem+($14-8)|0;$16=$15;if(($10&1|0)==0){label=5;break}else{$p_0=$3;$psize_0=$14;label=56;break};case 5:$21=HEAP32[$3>>2]|0;if(($11|0)==0){label=141;break}else{label=6;break};case 6:$_sum233=-8-$21|0;$24=$mem+$_sum233|0;$25=$24;$26=$21+$14|0;if($24>>>0<$5>>>0){label=140;break}else{label=7;break};case 7:if(($25|0)==(HEAP32[1987]|0)){label=54;break}else{label=8;break};case 8:$32=$21>>>3;if($21>>>0<256){label=9;break}else{label=20;break};case 9:$37=HEAP32[$mem+($_sum233+8)>>2]|0;$40=HEAP32[$mem+($_sum233+12)>>2]|0;$43=7968+($32<<1<<2)|0;if(($37|0)==($43|0)){label=12;break}else{label=10;break};case 10:if($37>>>0<$5>>>0){label=19;break}else{label=11;break};case 11:if((HEAP32[$37+12>>2]|0)==($25|0)){label=12;break}else{label=19;break};case 12:if(($40|0)==($37|0)){label=13;break}else{label=14;break};case 13:HEAP32[1982]=HEAP32[1982]&(1<<$32^-1);$p_0=$25;$psize_0=$26;label=56;break;case 14:if(($40|0)==($43|0)){label=17;break}else{label=15;break};case 15:if($40>>>0<(HEAP32[1986]|0)>>>0){label=18;break}else{label=16;break};case 16:if((HEAP32[$40+8>>2]|0)==($25|0)){label=17;break}else{label=18;break};case 17:HEAP32[$37+12>>2]=$40;HEAP32[$40+8>>2]=$37;$p_0=$25;$psize_0=$26;label=56;break;case 18:_abort();case 19:_abort();case 20:$71=$24;$74=HEAP32[$mem+($_sum233+24)>>2]|0;$77=HEAP32[$mem+($_sum233+12)>>2]|0;if(($77|0)==($71|0)){label=26;break}else{label=21;break};case 21:$82=HEAP32[$mem+($_sum233+8)>>2]|0;if($82>>>0<$5>>>0){label=25;break}else{label=22;break};case 22:$86=$82+12|0;if((HEAP32[$86>>2]|0)==($71|0)){label=23;break}else{label=25;break};case 23:$90=$77+8|0;if((HEAP32[$90>>2]|0)==($71|0)){label=24;break}else{label=25;break};case 24:HEAP32[$86>>2]=$77;HEAP32[$90>>2]=$82;$R_1=$77;label=34;break;case 25:_abort();case 26:$96=$mem+($_sum233+20)|0;$97=HEAP32[$96>>2]|0;if(($97|0)==0){label=27;break}else{$R_0=$97;$RP_0=$96;label=28;break};case 27:$101=$mem+($_sum233+16)|0;$102=HEAP32[$101>>2]|0;if(($102|0)==0){$R_1=0;label=34;break}else{$R_0=$102;$RP_0=$101;label=28;break};case 28:$104=$R_0+20|0;if((HEAP32[$104>>2]|0)==0){label=29;break}else{$CP_0=$104;label=30;break};case 29:$108=$R_0+16|0;if((HEAP32[$108>>2]|0)==0){label=31;break}else{$CP_0=$108;label=30;break};case 30:$R_0=HEAP32[$CP_0>>2]|0;$RP_0=$CP_0;label=28;break;case 31:if($RP_0>>>0<(HEAP32[1986]|0)>>>0){label=33;break}else{label=32;break};case 32:HEAP32[$RP_0>>2]=0;$R_1=$R_0;label=34;break;case 33:_abort();case 34:if(($74|0)==0){$p_0=$25;$psize_0=$26;label=56;break}else{label=35;break};case 35:$122=$mem+($_sum233+28)|0;$124=8232+(HEAP32[$122>>2]<<2)|0;if(($71|0)==(HEAP32[$124>>2]|0)){label=36;break}else{label=38;break};case 36:HEAP32[$124>>2]=$R_1;if(($R_1|0)==0){label=37;break}else{label=44;break};case 37:HEAP32[1983]=HEAP32[1983]&(1<<HEAP32[$122>>2]^-1);$p_0=$25;$psize_0=$26;label=56;break;case 38:if($74>>>0<(HEAP32[1986]|0)>>>0){label=42;break}else{label=39;break};case 39:$138=$74+16|0;if((HEAP32[$138>>2]|0)==($71|0)){label=40;break}else{label=41;break};case 40:HEAP32[$138>>2]=$R_1;label=43;break;case 41:HEAP32[$74+20>>2]=$R_1;label=43;break;case 42:_abort();case 43:if(($R_1|0)==0){$p_0=$25;$psize_0=$26;label=56;break}else{label=44;break};case 44:if($R_1>>>0<(HEAP32[1986]|0)>>>0){label=53;break}else{label=45;break};case 45:HEAP32[$R_1+24>>2]=$74;$155=HEAP32[$mem+($_sum233+16)>>2]|0;if(($155|0)==0){label=49;break}else{label=46;break};case 46:if($155>>>0<(HEAP32[1986]|0)>>>0){label=48;break}else{label=47;break};case 47:HEAP32[$R_1+16>>2]=$155;HEAP32[$155+24>>2]=$R_1;label=49;break;case 48:_abort();case 49:$168=HEAP32[$mem+($_sum233+20)>>2]|0;if(($168|0)==0){$p_0=$25;$psize_0=$26;label=56;break}else{label=50;break};case 50:if($168>>>0<(HEAP32[1986]|0)>>>0){label=52;break}else{label=51;break};case 51:HEAP32[$R_1+20>>2]=$168;HEAP32[$168+24>>2]=$R_1;$p_0=$25;$psize_0=$26;label=56;break;case 52:_abort();case 53:_abort();case 54:$181=$mem+($14-4)|0;if((HEAP32[$181>>2]&3|0)==3){label=55;break}else{$p_0=$25;$psize_0=$26;label=56;break};case 55:HEAP32[1984]=$26;HEAP32[$181>>2]=HEAP32[$181>>2]&-2;HEAP32[$mem+($_sum233+4)>>2]=$26|1;HEAP32[$15>>2]=$26;label=141;break;case 56:$193=$p_0;if($193>>>0<$15>>>0){label=57;break}else{label=140;break};case 57:$197=$mem+($14-4)|0;$198=HEAP32[$197>>2]|0;if(($198&1|0)==0){label=140;break}else{label=58;break};case 58:if(($198&2|0)==0){label=59;break}else{label=114;break};case 59:if(($16|0)==(HEAP32[1988]|0)){label=60;break}else{label=64;break};case 60:$208=(HEAP32[1985]|0)+$psize_0|0;HEAP32[1985]=$208;HEAP32[1988]=$p_0;HEAP32[$p_0+4>>2]=$208|1;if(($p_0|0)==(HEAP32[1987]|0)){label=61;break}else{label=62;break};case 61:HEAP32[1987]=0;HEAP32[1984]=0;label=62;break;case 62:if($208>>>0>(HEAP32[1989]|0)>>>0){label=63;break}else{label=141;break};case 63:_sys_trim(0)|0;label=141;break;case 64:if(($16|0)==(HEAP32[1987]|0)){label=65;break}else{label=66;break};case 65:$224=(HEAP32[1984]|0)+$psize_0|0;HEAP32[1984]=$224;HEAP32[1987]=$p_0;HEAP32[$p_0+4>>2]=$224|1;HEAP32[$193+$224>>2]=$224;label=141;break;case 66:$231=($198&-8)+$psize_0|0;$232=$198>>>3;if($198>>>0<256){label=67;break}else{label=78;break};case 67:$237=HEAP32[$mem+$14>>2]|0;$240=HEAP32[$mem+($14|4)>>2]|0;$243=7968+($232<<1<<2)|0;if(($237|0)==($243|0)){label=70;break}else{label=68;break};case 68:if($237>>>0<(HEAP32[1986]|0)>>>0){label=77;break}else{label=69;break};case 69:if((HEAP32[$237+12>>2]|0)==($16|0)){label=70;break}else{label=77;break};case 70:if(($240|0)==($237|0)){label=71;break}else{label=72;break};case 71:HEAP32[1982]=HEAP32[1982]&(1<<$232^-1);label=112;break;case 72:if(($240|0)==($243|0)){label=75;break}else{label=73;break};case 73:if($240>>>0<(HEAP32[1986]|0)>>>0){label=76;break}else{label=74;break};case 74:if((HEAP32[$240+8>>2]|0)==($16|0)){label=75;break}else{label=76;break};case 75:HEAP32[$237+12>>2]=$240;HEAP32[$240+8>>2]=$237;label=112;break;case 76:_abort();case 77:_abort();case 78:$272=$15;$275=HEAP32[$mem+($14+16)>>2]|0;$278=HEAP32[$mem+($14|4)>>2]|0;if(($278|0)==($272|0)){label=84;break}else{label=79;break};case 79:$283=HEAP32[$mem+$14>>2]|0;if($283>>>0<(HEAP32[1986]|0)>>>0){label=83;break}else{label=80;break};case 80:$288=$283+12|0;if((HEAP32[$288>>2]|0)==($272|0)){label=81;break}else{label=83;break};case 81:$292=$278+8|0;if((HEAP32[$292>>2]|0)==($272|0)){label=82;break}else{label=83;break};case 82:HEAP32[$288>>2]=$278;HEAP32[$292>>2]=$283;$R7_1=$278;label=92;break;case 83:_abort();case 84:$298=$mem+($14+12)|0;$299=HEAP32[$298>>2]|0;if(($299|0)==0){label=85;break}else{$R7_0=$299;$RP9_0=$298;label=86;break};case 85:$303=$mem+($14+8)|0;$304=HEAP32[$303>>2]|0;if(($304|0)==0){$R7_1=0;label=92;break}else{$R7_0=$304;$RP9_0=$303;label=86;break};case 86:$306=$R7_0+20|0;if((HEAP32[$306>>2]|0)==0){label=87;break}else{$CP10_0=$306;label=88;break};case 87:$310=$R7_0+16|0;if((HEAP32[$310>>2]|0)==0){label=89;break}else{$CP10_0=$310;label=88;break};case 88:$R7_0=HEAP32[$CP10_0>>2]|0;$RP9_0=$CP10_0;label=86;break;case 89:if($RP9_0>>>0<(HEAP32[1986]|0)>>>0){label=91;break}else{label=90;break};case 90:HEAP32[$RP9_0>>2]=0;$R7_1=$R7_0;label=92;break;case 91:_abort();case 92:if(($275|0)==0){label=112;break}else{label=93;break};case 93:$324=$mem+($14+20)|0;$326=8232+(HEAP32[$324>>2]<<2)|0;if(($272|0)==(HEAP32[$326>>2]|0)){label=94;break}else{label=96;break};case 94:HEAP32[$326>>2]=$R7_1;if(($R7_1|0)==0){label=95;break}else{label=102;break};case 95:HEAP32[1983]=HEAP32[1983]&(1<<HEAP32[$324>>2]^-1);label=112;break;case 96:if($275>>>0<(HEAP32[1986]|0)>>>0){label=100;break}else{label=97;break};case 97:$340=$275+16|0;if((HEAP32[$340>>2]|0)==($272|0)){label=98;break}else{label=99;break};case 98:HEAP32[$340>>2]=$R7_1;label=101;break;case 99:HEAP32[$275+20>>2]=$R7_1;label=101;break;case 100:_abort();case 101:if(($R7_1|0)==0){label=112;break}else{label=102;break};case 102:if($R7_1>>>0<(HEAP32[1986]|0)>>>0){label=111;break}else{label=103;break};case 103:HEAP32[$R7_1+24>>2]=$275;$357=HEAP32[$mem+($14+8)>>2]|0;if(($357|0)==0){label=107;break}else{label=104;break};case 104:if($357>>>0<(HEAP32[1986]|0)>>>0){label=106;break}else{label=105;break};case 105:HEAP32[$R7_1+16>>2]=$357;HEAP32[$357+24>>2]=$R7_1;label=107;break;case 106:_abort();case 107:$370=HEAP32[$mem+($14+12)>>2]|0;if(($370|0)==0){label=112;break}else{label=108;break};case 108:if($370>>>0<(HEAP32[1986]|0)>>>0){label=110;break}else{label=109;break};case 109:HEAP32[$R7_1+20>>2]=$370;HEAP32[$370+24>>2]=$R7_1;label=112;break;case 110:_abort();case 111:_abort();case 112:HEAP32[$p_0+4>>2]=$231|1;HEAP32[$193+$231>>2]=$231;if(($p_0|0)==(HEAP32[1987]|0)){label=113;break}else{$psize_1=$231;label=115;break};case 113:HEAP32[1984]=$231;label=141;break;case 114:HEAP32[$197>>2]=$198&-2;HEAP32[$p_0+4>>2]=$psize_0|1;HEAP32[$193+$psize_0>>2]=$psize_0;$psize_1=$psize_0;label=115;break;case 115:$396=$psize_1>>>3;if($psize_1>>>0<256){label=116;break}else{label=121;break};case 116:$399=$396<<1;$401=7968+($399<<2)|0;$402=HEAP32[1982]|0;$403=1<<$396;if(($402&$403|0)==0){label=117;break}else{label=118;break};case 117:HEAP32[1982]=$402|$403;$F16_0=$401;label=120;break;case 118:$410=HEAP32[7968+($399+2<<2)>>2]|0;if($410>>>0<(HEAP32[1986]|0)>>>0){label=119;break}else{$F16_0=$410;label=120;break};case 119:_abort();case 120:HEAP32[7968+($399+2<<2)>>2]=$p_0;HEAP32[$F16_0+12>>2]=$p_0;HEAP32[$p_0+8>>2]=$F16_0;HEAP32[$p_0+12>>2]=$401;label=141;break;case 121:$421=$p_0;$422=$psize_1>>>8;if(($422|0)==0){$I18_0=0;label=124;break}else{label=122;break};case 122:if($psize_1>>>0>16777215){$I18_0=31;label=124;break}else{label=123;break};case 123:$429=($422+1048320|0)>>>16&8;$430=$422<<$429;$433=($430+520192|0)>>>16&4;$435=$430<<$433;$438=($435+245760|0)>>>16&2;$443=14-($433|$429|$438)+($435<<$438>>>15)|0;$I18_0=$psize_1>>>(($443+7|0)>>>0)&1|$443<<1;label=124;break;case 124:$450=8232+($I18_0<<2)|0;HEAP32[$p_0+28>>2]=$I18_0;HEAP32[$p_0+20>>2]=0;HEAP32[$p_0+16>>2]=0;$454=HEAP32[1983]|0;$455=1<<$I18_0;if(($454&$455|0)==0){label=125;break}else{label=126;break};case 125:HEAP32[1983]=$454|$455;HEAP32[$450>>2]=$421;HEAP32[$p_0+24>>2]=$450;HEAP32[$p_0+12>>2]=$p_0;HEAP32[$p_0+8>>2]=$p_0;label=138;break;case 126:if(($I18_0|0)==31){$470=0;label=128;break}else{label=127;break};case 127:$470=25-($I18_0>>>1)|0;label=128;break;case 128:$K19_0=$psize_1<<$470;$T_0=HEAP32[$450>>2]|0;label=129;break;case 129:if((HEAP32[$T_0+4>>2]&-8|0)==($psize_1|0)){label=134;break}else{label=130;break};case 130:$479=$T_0+16+($K19_0>>>31<<2)|0;$480=HEAP32[$479>>2]|0;if(($480|0)==0){label=131;break}else{$K19_0=$K19_0<<1;$T_0=$480;label=129;break};case 131:if($479>>>0<(HEAP32[1986]|0)>>>0){label=133;break}else{label=132;break};case 132:HEAP32[$479>>2]=$421;HEAP32[$p_0+24>>2]=$T_0;HEAP32[$p_0+12>>2]=$p_0;HEAP32[$p_0+8>>2]=$p_0;label=138;break;case 133:_abort();case 134:$493=$T_0+8|0;$494=HEAP32[$493>>2]|0;$496=HEAP32[1986]|0;if($T_0>>>0<$496>>>0){label=137;break}else{label=135;break};case 135:if($494>>>0<$496>>>0){label=137;break}else{label=136;break};case 136:HEAP32[$494+12>>2]=$421;HEAP32[$493>>2]=$421;HEAP32[$p_0+8>>2]=$494;HEAP32[$p_0+12>>2]=$T_0;HEAP32[$p_0+24>>2]=0;label=138;break;case 137:_abort();case 138:$508=(HEAP32[1990]|0)-1|0;HEAP32[1990]=$508;if(($508|0)==0){label=139;break}else{label=141;break};case 139:_release_unused_segments();label=141;break;case 140:_abort();case 141:return}}function _release_unused_segments(){var $sp_0_in=0,$sp_0=0,label=0;label=1;while(1)switch(label|0){case 1:$sp_0_in=8384;label=2;break;case 2:$sp_0=HEAP32[$sp_0_in>>2]|0;if(($sp_0|0)==0){label=3;break}else{$sp_0_in=$sp_0+8|0;label=2;break};case 3:HEAP32[1990]=-1;return}}function _sys_trim($pad){$pad=$pad|0;var $7=0,$11=0,$14=0,$20=0,$22=0,$28=0,$39=0,$40=0,$46=0,$49=0,$released_2=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[42]|0)==0){label=2;break}else{label=3;break};case 2:_init_mparams();label=3;break;case 3:if($pad>>>0<4294967232){label=4;break}else{$released_2=0;label=13;break};case 4:$7=HEAP32[1988]|0;if(($7|0)==0){$released_2=0;label=13;break}else{label=5;break};case 5:$11=HEAP32[1985]|0;if($11>>>0>($pad+40|0)>>>0){label=6;break}else{label=11;break};case 6:$14=HEAP32[44]|0;$20=Math_imul((((-40-$pad-1+$11+$14|0)>>>0)/($14>>>0)>>>0)-1|0,$14)|0;$22=_segment_holding($7)|0;if((HEAP32[$22+12>>2]&8|0)==0){label=7;break}else{label=11;break};case 7:$28=_sbrk(0)|0;if(($28|0)==((HEAP32[$22>>2]|0)+(HEAP32[$22+4>>2]|0)|0)){label=8;break}else{label=11;break};case 8:$39=_sbrk(-($20>>>0>2147483646?-2147483648-$14|0:$20)|0)|0;$40=_sbrk(0)|0;if(($39|0)!=-1&$40>>>0<$28>>>0){label=9;break}else{label=11;break};case 9:$46=$28-$40|0;if(($28|0)==($40|0)){label=11;break}else{label=10;break};case 10:$49=$22+4|0;HEAP32[$49>>2]=(HEAP32[$49>>2]|0)-$46;HEAP32[2090]=(HEAP32[2090]|0)-$46;_init_top(HEAP32[1988]|0,(HEAP32[1985]|0)-$46|0);$released_2=($28|0)!=($40|0)&1;label=13;break;case 11:if((HEAP32[1985]|0)>>>0>(HEAP32[1989]|0)>>>0){label=12;break}else{$released_2=0;label=13;break};case 12:HEAP32[1989]=-1;$released_2=0;label=13;break;case 13:return $released_2|0}return 0}function _calloc($n_elements,$elem_size){$n_elements=$n_elements|0;$elem_size=$elem_size|0;var $3=0,$req_0=0,$10=0,label=0;label=1;while(1)switch(label|0){case 1:if(($n_elements|0)==0){$req_0=0;label=4;break}else{label=2;break};case 2:$3=Math_imul($elem_size,$n_elements)|0;if(($elem_size|$n_elements)>>>0>65535){label=3;break}else{$req_0=$3;label=4;break};case 3:$req_0=(($3>>>0)/($n_elements>>>0)>>>0|0)==($elem_size|0)?$3:-1;label=4;break;case 4:$10=_malloc($req_0)|0;if(($10|0)==0){label=7;break}else{label=5;break};case 5:if((HEAP32[$10-4>>2]&3|0)==0){label=7;break}else{label=6;break};case 6:_memset($10|0,0,$req_0|0);label=7;break;case 7:return $10|0}return 0}function _realloc($oldmem,$bytes){$oldmem=$oldmem|0;$bytes=$bytes|0;var $14=0,$17=0,$23=0,$28=0,$33=0,$mem_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($oldmem|0)==0){label=2;break}else{label=3;break};case 2:$mem_0=_malloc($bytes)|0;label=11;break;case 3:if($bytes>>>0>4294967231){label=4;break}else{label=5;break};case 4:HEAP32[(___errno_location()|0)>>2]=12;$mem_0=0;label=11;break;case 5:if($bytes>>>0<11){$14=16;label=7;break}else{label=6;break};case 6:$14=$bytes+11&-8;label=7;break;case 7:$17=_try_realloc_chunk($oldmem-8|0,$14)|0;if(($17|0)==0){label=9;break}else{label=8;break};case 8:$mem_0=$17+8|0;label=11;break;case 9:$23=_malloc($bytes)|0;if(($23|0)==0){$mem_0=0;label=11;break}else{label=10;break};case 10:$28=HEAP32[$oldmem-4>>2]|0;$33=($28&-8)-(($28&3|0)==0?8:4)|0;_memcpy($23|0,$oldmem|0,$33>>>0<$bytes>>>0?$33:$bytes)|0;_free($oldmem);$mem_0=$23;label=11;break;case 11:return $mem_0|0}return 0}function _try_realloc_chunk($p,$nb){$p=$p|0;$nb=$nb|0;var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$10=0,$15=0,$16=0,$25=0,$43=0,$46=0,$60=0,$63=0,$77=0,$85=0,$storemerge27=0,$storemerge=0,$94=0,$97=0,$98=0,$103=0,$106=0,$109=0,$137=0,$140=0,$143=0,$148=0,$152=0,$156=0,$162=0,$163=0,$167=0,$168=0,$RP_0=0,$R_0=0,$170=0,$174=0,$CP_0=0,$R_1=0,$188=0,$190=0,$204=0,$221=0,$234=0,$253=0,$267=0,$newp_0=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$p+4|0;$2=HEAP32[$1>>2]|0;$3=$2&-8;$4=$p;$5=$4+$3|0;$6=$5;$7=HEAP32[1986]|0;if($4>>>0<$7>>>0){label=69;break}else{label=2;break};case 2:$10=$2&3;if(($10|0)!=1&$4>>>0<$5>>>0){label=3;break}else{label=69;break};case 3:$15=$4+($3|4)|0;$16=HEAP32[$15>>2]|0;if(($16&1|0)==0){label=69;break}else{label=4;break};case 4:if(($10|0)==0){label=5;break}else{label=6;break};case 5:$newp_0=_mmap_resize($p,$nb)|0;label=70;break;case 6:if($3>>>0<$nb>>>0){label=9;break}else{label=7;break};case 7:$25=$3-$nb|0;if($25>>>0>15){label=8;break}else{$newp_0=$p;label=70;break};case 8:HEAP32[$1>>2]=$2&1|$nb|2;HEAP32[$4+($nb+4)>>2]=$25|3;HEAP32[$15>>2]=HEAP32[$15>>2]|1;_dispose_chunk($4+$nb|0,$25);$newp_0=$p;label=70;break;case 9:if(($6|0)==(HEAP32[1988]|0)){label=10;break}else{label=12;break};case 10:$43=(HEAP32[1985]|0)+$3|0;if($43>>>0>$nb>>>0){label=11;break}else{$newp_0=0;label=70;break};case 11:$46=$43-$nb|0;HEAP32[$1>>2]=$2&1|$nb|2;HEAP32[$4+($nb+4)>>2]=$46|1;HEAP32[1988]=$4+$nb;HEAP32[1985]=$46;$newp_0=$p;label=70;break;case 12:if(($6|0)==(HEAP32[1987]|0)){label=13;break}else{label=18;break};case 13:$60=(HEAP32[1984]|0)+$3|0;if($60>>>0<$nb>>>0){$newp_0=0;label=70;break}else{label=14;break};case 14:$63=$60-$nb|0;if($63>>>0>15){label=15;break}else{label=16;break};case 15:HEAP32[$1>>2]=$2&1|$nb|2;HEAP32[$4+($nb+4)>>2]=$63|1;HEAP32[$4+$60>>2]=$63;$77=$4+($60+4)|0;HEAP32[$77>>2]=HEAP32[$77>>2]&-2;$storemerge=$4+$nb|0;$storemerge27=$63;label=17;break;case 16:HEAP32[$1>>2]=$2&1|$60|2;$85=$4+($60+4)|0;HEAP32[$85>>2]=HEAP32[$85>>2]|1;$storemerge=0;$storemerge27=0;label=17;break;case 17:HEAP32[1984]=$storemerge27;HEAP32[1987]=$storemerge;$newp_0=$p;label=70;break;case 18:if(($16&2|0)==0){label=19;break}else{$newp_0=0;label=70;break};case 19:$94=($16&-8)+$3|0;if($94>>>0<$nb>>>0){$newp_0=0;label=70;break}else{label=20;break};case 20:$97=$94-$nb|0;$98=$16>>>3;if($16>>>0<256){label=21;break}else{label=32;break};case 21:$103=HEAP32[$4+($3+8)>>2]|0;$106=HEAP32[$4+($3+12)>>2]|0;$109=7968+($98<<1<<2)|0;if(($103|0)==($109|0)){label=24;break}else{label=22;break};case 22:if($103>>>0<$7>>>0){label=31;break}else{label=23;break};case 23:if((HEAP32[$103+12>>2]|0)==($6|0)){label=24;break}else{label=31;break};case 24:if(($106|0)==($103|0)){label=25;break}else{label=26;break};case 25:HEAP32[1982]=HEAP32[1982]&(1<<$98^-1);label=66;break;case 26:if(($106|0)==($109|0)){label=29;break}else{label=27;break};case 27:if($106>>>0<(HEAP32[1986]|0)>>>0){label=30;break}else{label=28;break};case 28:if((HEAP32[$106+8>>2]|0)==($6|0)){label=29;break}else{label=30;break};case 29:HEAP32[$103+12>>2]=$106;HEAP32[$106+8>>2]=$103;label=66;break;case 30:_abort();return 0;return 0;case 31:_abort();return 0;return 0;case 32:$137=$5;$140=HEAP32[$4+($3+24)>>2]|0;$143=HEAP32[$4+($3+12)>>2]|0;if(($143|0)==($137|0)){label=38;break}else{label=33;break};case 33:$148=HEAP32[$4+($3+8)>>2]|0;if($148>>>0<$7>>>0){label=37;break}else{label=34;break};case 34:$152=$148+12|0;if((HEAP32[$152>>2]|0)==($137|0)){label=35;break}else{label=37;break};case 35:$156=$143+8|0;if((HEAP32[$156>>2]|0)==($137|0)){label=36;break}else{label=37;break};case 36:HEAP32[$152>>2]=$143;HEAP32[$156>>2]=$148;$R_1=$143;label=46;break;case 37:_abort();return 0;return 0;case 38:$162=$4+($3+20)|0;$163=HEAP32[$162>>2]|0;if(($163|0)==0){label=39;break}else{$R_0=$163;$RP_0=$162;label=40;break};case 39:$167=$4+($3+16)|0;$168=HEAP32[$167>>2]|0;if(($168|0)==0){$R_1=0;label=46;break}else{$R_0=$168;$RP_0=$167;label=40;break};case 40:$170=$R_0+20|0;if((HEAP32[$170>>2]|0)==0){label=41;break}else{$CP_0=$170;label=42;break};case 41:$174=$R_0+16|0;if((HEAP32[$174>>2]|0)==0){label=43;break}else{$CP_0=$174;label=42;break};case 42:$R_0=HEAP32[$CP_0>>2]|0;$RP_0=$CP_0;label=40;break;case 43:if($RP_0>>>0<(HEAP32[1986]|0)>>>0){label=45;break}else{label=44;break};case 44:HEAP32[$RP_0>>2]=0;$R_1=$R_0;label=46;break;case 45:_abort();return 0;return 0;case 46:if(($140|0)==0){label=66;break}else{label=47;break};case 47:$188=$4+($3+28)|0;$190=8232+(HEAP32[$188>>2]<<2)|0;if(($137|0)==(HEAP32[$190>>2]|0)){label=48;break}else{label=50;break};case 48:HEAP32[$190>>2]=$R_1;if(($R_1|0)==0){label=49;break}else{label=56;break};case 49:HEAP32[1983]=HEAP32[1983]&(1<<HEAP32[$188>>2]^-1);label=66;break;case 50:if($140>>>0<(HEAP32[1986]|0)>>>0){label=54;break}else{label=51;break};case 51:$204=$140+16|0;if((HEAP32[$204>>2]|0)==($137|0)){label=52;break}else{label=53;break};case 52:HEAP32[$204>>2]=$R_1;label=55;break;case 53:HEAP32[$140+20>>2]=$R_1;label=55;break;case 54:_abort();return 0;return 0;case 55:if(($R_1|0)==0){label=66;break}else{label=56;break};case 56:if($R_1>>>0<(HEAP32[1986]|0)>>>0){label=65;break}else{label=57;break};case 57:HEAP32[$R_1+24>>2]=$140;$221=HEAP32[$4+($3+16)>>2]|0;if(($221|0)==0){label=61;break}else{label=58;break};case 58:if($221>>>0<(HEAP32[1986]|0)>>>0){label=60;break}else{label=59;break};case 59:HEAP32[$R_1+16>>2]=$221;HEAP32[$221+24>>2]=$R_1;label=61;break;case 60:_abort();return 0;return 0;case 61:$234=HEAP32[$4+($3+20)>>2]|0;if(($234|0)==0){label=66;break}else{label=62;break};case 62:if($234>>>0<(HEAP32[1986]|0)>>>0){label=64;break}else{label=63;break};case 63:HEAP32[$R_1+20>>2]=$234;HEAP32[$234+24>>2]=$R_1;label=66;break;case 64:_abort();return 0;return 0;case 65:_abort();return 0;return 0;case 66:if($97>>>0<16){label=67;break}else{label=68;break};case 67:HEAP32[$1>>2]=$94|HEAP32[$1>>2]&1|2;$253=$4+($94|4)|0;HEAP32[$253>>2]=HEAP32[$253>>2]|1;$newp_0=$p;label=70;break;case 68:HEAP32[$1>>2]=HEAP32[$1>>2]&1|$nb|2;HEAP32[$4+($nb+4)>>2]=$97|3;$267=$4+($94|4)|0;HEAP32[$267>>2]=HEAP32[$267>>2]|1;_dispose_chunk($4+$nb|0,$97);$newp_0=$p;label=70;break;case 69:_abort();return 0;return 0;case 70:return $newp_0|0}return 0}function _init_mparams(){var $4=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[42]|0)==0){label=2;break}else{label=5;break};case 2:$4=_sysconf(8)|0;if(($4-1&$4|0)==0){label=4;break}else{label=3;break};case 3:_abort();case 4:HEAP32[44]=$4;HEAP32[43]=$4;HEAP32[45]=-1;HEAP32[46]=2097152;HEAP32[47]=0;HEAP32[2093]=0;HEAP32[42]=(_time(0)|0)&-16^1431655768;label=5;break;case 5:return}}function _mmap_resize($oldp,$nb){$oldp=$oldp|0;$nb=$nb|0;var $3=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$3=HEAP32[$oldp+4>>2]&-8;if($nb>>>0<256){$_0=0;label=5;break}else{label=2;break};case 2:if($3>>>0<($nb+4|0)>>>0){label=4;break}else{label=3;break};case 3:if(($3-$nb|0)>>>0>HEAP32[44]<<1>>>0){label=4;break}else{$_0=$oldp;label=5;break};case 4:$_0=0;label=5;break;case 5:return $_0|0}return 0}function _segment_holding($addr){$addr=$addr|0;var $sp_0=0,$3=0,$12=0,$_0=0,label=0;label=1;while(1)switch(label|0){case 1:$sp_0=8376;label=2;break;case 2:$3=HEAP32[$sp_0>>2]|0;if($3>>>0>$addr>>>0){label=4;break}else{label=3;break};case 3:if(($3+(HEAP32[$sp_0+4>>2]|0)|0)>>>0>$addr>>>0){$_0=$sp_0;label=5;break}else{label=4;break};case 4:$12=HEAP32[$sp_0+8>>2]|0;if(($12|0)==0){$_0=0;label=5;break}else{$sp_0=$12;label=2;break};case 5:return $_0|0}return 0}function _dispose_chunk($p,$psize){$p=$p|0;$psize=$psize|0;var $1=0,$2=0,$3=0,$5=0,$10=0,$15=0,$16=0,$17=0,$18=0,$24=0,$29=0,$32=0,$35=0,$63=0,$66=0,$69=0,$74=0,$78=0,$82=0,$_sum28=0,$88=0,$89=0,$93=0,$94=0,$RP_0=0,$R_0=0,$96=0,$100=0,$CP_0=0,$R_1=0,$114=0,$116=0,$130=0,$_sum31=0,$147=0,$160=0,$173=0,$_0277=0,$_0=0,$186=0,$190=0,$191=0,$199=0,$210=0,$218=0,$219=0,$224=0,$227=0,$230=0,$258=0,$261=0,$264=0,$269=0,$273=0,$277=0,$283=0,$284=0,$288=0,$289=0,$RP9_0=0,$R7_0=0,$291=0,$295=0,$CP10_0=0,$R7_1=0,$309=0,$311=0,$325=0,$342=0,$355=0,$_1=0,$383=0,$386=0,$388=0,$389=0,$390=0,$397=0,$F16_0=0,$408=0,$409=0,$416=0,$417=0,$420=0,$422=0,$425=0,$430=0,$I19_0=0,$437=0,$441=0,$442=0,$457=0,$T_0=0,$K20_0=0,$466=0,$467=0,$480=0,$481=0,$483=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$p;$2=$1+$psize|0;$3=$2;$5=HEAP32[$p+4>>2]|0;if(($5&1|0)==0){label=2;break}else{$_0=$p;$_0277=$psize;label=54;break};case 2:$10=HEAP32[$p>>2]|0;if(($5&3|0)==0){label=134;break}else{label=3;break};case 3:$15=$1+(-$10|0)|0;$16=$15;$17=$10+$psize|0;$18=HEAP32[1986]|0;if($15>>>0<$18>>>0){label=53;break}else{label=4;break};case 4:if(($16|0)==(HEAP32[1987]|0)){label=51;break}else{label=5;break};case 5:$24=$10>>>3;if($10>>>0<256){label=6;break}else{label=17;break};case 6:$29=HEAP32[$1+(8-$10)>>2]|0;$32=HEAP32[$1+(12-$10)>>2]|0;$35=7968+($24<<1<<2)|0;if(($29|0)==($35|0)){label=9;break}else{label=7;break};case 7:if($29>>>0<$18>>>0){label=16;break}else{label=8;break};case 8:if((HEAP32[$29+12>>2]|0)==($16|0)){label=9;break}else{label=16;break};case 9:if(($32|0)==($29|0)){label=10;break}else{label=11;break};case 10:HEAP32[1982]=HEAP32[1982]&(1<<$24^-1);$_0=$16;$_0277=$17;label=54;break;case 11:if(($32|0)==($35|0)){label=14;break}else{label=12;break};case 12:if($32>>>0<(HEAP32[1986]|0)>>>0){label=15;break}else{label=13;break};case 13:if((HEAP32[$32+8>>2]|0)==($16|0)){label=14;break}else{label=15;break};case 14:HEAP32[$29+12>>2]=$32;HEAP32[$32+8>>2]=$29;$_0=$16;$_0277=$17;label=54;break;case 15:_abort();case 16:_abort();case 17:$63=$15;$66=HEAP32[$1+(24-$10)>>2]|0;$69=HEAP32[$1+(12-$10)>>2]|0;if(($69|0)==($63|0)){label=23;break}else{label=18;break};case 18:$74=HEAP32[$1+(8-$10)>>2]|0;if($74>>>0<$18>>>0){label=22;break}else{label=19;break};case 19:$78=$74+12|0;if((HEAP32[$78>>2]|0)==($63|0)){label=20;break}else{label=22;break};case 20:$82=$69+8|0;if((HEAP32[$82>>2]|0)==($63|0)){label=21;break}else{label=22;break};case 21:HEAP32[$78>>2]=$69;HEAP32[$82>>2]=$74;$R_1=$69;label=31;break;case 22:_abort();case 23:$_sum28=16-$10|0;$88=$1+($_sum28+4)|0;$89=HEAP32[$88>>2]|0;if(($89|0)==0){label=24;break}else{$R_0=$89;$RP_0=$88;label=25;break};case 24:$93=$1+$_sum28|0;$94=HEAP32[$93>>2]|0;if(($94|0)==0){$R_1=0;label=31;break}else{$R_0=$94;$RP_0=$93;label=25;break};case 25:$96=$R_0+20|0;if((HEAP32[$96>>2]|0)==0){label=26;break}else{$CP_0=$96;label=27;break};case 26:$100=$R_0+16|0;if((HEAP32[$100>>2]|0)==0){label=28;break}else{$CP_0=$100;label=27;break};case 27:$R_0=HEAP32[$CP_0>>2]|0;$RP_0=$CP_0;label=25;break;case 28:if($RP_0>>>0<(HEAP32[1986]|0)>>>0){label=30;break}else{label=29;break};case 29:HEAP32[$RP_0>>2]=0;$R_1=$R_0;label=31;break;case 30:_abort();case 31:if(($66|0)==0){$_0=$16;$_0277=$17;label=54;break}else{label=32;break};case 32:$114=$1+(28-$10)|0;$116=8232+(HEAP32[$114>>2]<<2)|0;if(($63|0)==(HEAP32[$116>>2]|0)){label=33;break}else{label=35;break};case 33:HEAP32[$116>>2]=$R_1;if(($R_1|0)==0){label=34;break}else{label=41;break};case 34:HEAP32[1983]=HEAP32[1983]&(1<<HEAP32[$114>>2]^-1);$_0=$16;$_0277=$17;label=54;break;case 35:if($66>>>0<(HEAP32[1986]|0)>>>0){label=39;break}else{label=36;break};case 36:$130=$66+16|0;if((HEAP32[$130>>2]|0)==($63|0)){label=37;break}else{label=38;break};case 37:HEAP32[$130>>2]=$R_1;label=40;break;case 38:HEAP32[$66+20>>2]=$R_1;label=40;break;case 39:_abort();case 40:if(($R_1|0)==0){$_0=$16;$_0277=$17;label=54;break}else{label=41;break};case 41:if($R_1>>>0<(HEAP32[1986]|0)>>>0){label=50;break}else{label=42;break};case 42:HEAP32[$R_1+24>>2]=$66;$_sum31=16-$10|0;$147=HEAP32[$1+$_sum31>>2]|0;if(($147|0)==0){label=46;break}else{label=43;break};case 43:if($147>>>0<(HEAP32[1986]|0)>>>0){label=45;break}else{label=44;break};case 44:HEAP32[$R_1+16>>2]=$147;HEAP32[$147+24>>2]=$R_1;label=46;break;case 45:_abort();case 46:$160=HEAP32[$1+($_sum31+4)>>2]|0;if(($160|0)==0){$_0=$16;$_0277=$17;label=54;break}else{label=47;break};case 47:if($160>>>0<(HEAP32[1986]|0)>>>0){label=49;break}else{label=48;break};case 48:HEAP32[$R_1+20>>2]=$160;HEAP32[$160+24>>2]=$R_1;$_0=$16;$_0277=$17;label=54;break;case 49:_abort();case 50:_abort();case 51:$173=$1+($psize+4)|0;if((HEAP32[$173>>2]&3|0)==3){label=52;break}else{$_0=$16;$_0277=$17;label=54;break};case 52:HEAP32[1984]=$17;HEAP32[$173>>2]=HEAP32[$173>>2]&-2;HEAP32[$1+(4-$10)>>2]=$17|1;HEAP32[$2>>2]=$17;label=134;break;case 53:_abort();case 54:$186=HEAP32[1986]|0;if($2>>>0<$186>>>0){label=133;break}else{label=55;break};case 55:$190=$1+($psize+4)|0;$191=HEAP32[$190>>2]|0;if(($191&2|0)==0){label=56;break}else{label=109;break};case 56:if(($3|0)==(HEAP32[1988]|0)){label=57;break}else{label=59;break};case 57:$199=(HEAP32[1985]|0)+$_0277|0;HEAP32[1985]=$199;HEAP32[1988]=$_0;HEAP32[$_0+4>>2]=$199|1;if(($_0|0)==(HEAP32[1987]|0)){label=58;break}else{label=134;break};case 58:HEAP32[1987]=0;HEAP32[1984]=0;label=134;break;case 59:if(($3|0)==(HEAP32[1987]|0)){label=60;break}else{label=61;break};case 60:$210=(HEAP32[1984]|0)+$_0277|0;HEAP32[1984]=$210;HEAP32[1987]=$_0;HEAP32[$_0+4>>2]=$210|1;HEAP32[$_0+$210>>2]=$210;label=134;break;case 61:$218=($191&-8)+$_0277|0;$219=$191>>>3;if($191>>>0<256){label=62;break}else{label=73;break};case 62:$224=HEAP32[$1+($psize+8)>>2]|0;$227=HEAP32[$1+($psize+12)>>2]|0;$230=7968+($219<<1<<2)|0;if(($224|0)==($230|0)){label=65;break}else{label=63;break};case 63:if($224>>>0<$186>>>0){label=72;break}else{label=64;break};case 64:if((HEAP32[$224+12>>2]|0)==($3|0)){label=65;break}else{label=72;break};case 65:if(($227|0)==($224|0)){label=66;break}else{label=67;break};case 66:HEAP32[1982]=HEAP32[1982]&(1<<$219^-1);label=107;break;case 67:if(($227|0)==($230|0)){label=70;break}else{label=68;break};case 68:if($227>>>0<(HEAP32[1986]|0)>>>0){label=71;break}else{label=69;break};case 69:if((HEAP32[$227+8>>2]|0)==($3|0)){label=70;break}else{label=71;break};case 70:HEAP32[$224+12>>2]=$227;HEAP32[$227+8>>2]=$224;label=107;break;case 71:_abort();case 72:_abort();case 73:$258=$2;$261=HEAP32[$1+($psize+24)>>2]|0;$264=HEAP32[$1+($psize+12)>>2]|0;if(($264|0)==($258|0)){label=79;break}else{label=74;break};case 74:$269=HEAP32[$1+($psize+8)>>2]|0;if($269>>>0<$186>>>0){label=78;break}else{label=75;break};case 75:$273=$269+12|0;if((HEAP32[$273>>2]|0)==($258|0)){label=76;break}else{label=78;break};case 76:$277=$264+8|0;if((HEAP32[$277>>2]|0)==($258|0)){label=77;break}else{label=78;break};case 77:HEAP32[$273>>2]=$264;HEAP32[$277>>2]=$269;$R7_1=$264;label=87;break;case 78:_abort();case 79:$283=$1+($psize+20)|0;$284=HEAP32[$283>>2]|0;if(($284|0)==0){label=80;break}else{$R7_0=$284;$RP9_0=$283;label=81;break};case 80:$288=$1+($psize+16)|0;$289=HEAP32[$288>>2]|0;if(($289|0)==0){$R7_1=0;label=87;break}else{$R7_0=$289;$RP9_0=$288;label=81;break};case 81:$291=$R7_0+20|0;if((HEAP32[$291>>2]|0)==0){label=82;break}else{$CP10_0=$291;label=83;break};case 82:$295=$R7_0+16|0;if((HEAP32[$295>>2]|0)==0){label=84;break}else{$CP10_0=$295;label=83;break};case 83:$R7_0=HEAP32[$CP10_0>>2]|0;$RP9_0=$CP10_0;label=81;break;case 84:if($RP9_0>>>0<(HEAP32[1986]|0)>>>0){label=86;break}else{label=85;break};case 85:HEAP32[$RP9_0>>2]=0;$R7_1=$R7_0;label=87;break;case 86:_abort();case 87:if(($261|0)==0){label=107;break}else{label=88;break};case 88:$309=$1+($psize+28)|0;$311=8232+(HEAP32[$309>>2]<<2)|0;if(($258|0)==(HEAP32[$311>>2]|0)){label=89;break}else{label=91;break};case 89:HEAP32[$311>>2]=$R7_1;if(($R7_1|0)==0){label=90;break}else{label=97;break};case 90:HEAP32[1983]=HEAP32[1983]&(1<<HEAP32[$309>>2]^-1);label=107;break;case 91:if($261>>>0<(HEAP32[1986]|0)>>>0){label=95;break}else{label=92;break};case 92:$325=$261+16|0;if((HEAP32[$325>>2]|0)==($258|0)){label=93;break}else{label=94;break};case 93:HEAP32[$325>>2]=$R7_1;label=96;break;case 94:HEAP32[$261+20>>2]=$R7_1;label=96;break;case 95:_abort();case 96:if(($R7_1|0)==0){label=107;break}else{label=97;break};case 97:if($R7_1>>>0<(HEAP32[1986]|0)>>>0){label=106;break}else{label=98;break};case 98:HEAP32[$R7_1+24>>2]=$261;$342=HEAP32[$1+($psize+16)>>2]|0;if(($342|0)==0){label=102;break}else{label=99;break};case 99:if($342>>>0<(HEAP32[1986]|0)>>>0){label=101;break}else{label=100;break};case 100:HEAP32[$R7_1+16>>2]=$342;HEAP32[$342+24>>2]=$R7_1;label=102;break;case 101:_abort();case 102:$355=HEAP32[$1+($psize+20)>>2]|0;if(($355|0)==0){label=107;break}else{label=103;break};case 103:if($355>>>0<(HEAP32[1986]|0)>>>0){label=105;break}else{label=104;break};case 104:HEAP32[$R7_1+20>>2]=$355;HEAP32[$355+24>>2]=$R7_1;label=107;break;case 105:_abort();case 106:_abort();case 107:HEAP32[$_0+4>>2]=$218|1;HEAP32[$_0+$218>>2]=$218;if(($_0|0)==(HEAP32[1987]|0)){label=108;break}else{$_1=$218;label=110;break};case 108:HEAP32[1984]=$218;label=134;break;case 109:HEAP32[$190>>2]=$191&-2;HEAP32[$_0+4>>2]=$_0277|1;HEAP32[$_0+$_0277>>2]=$_0277;$_1=$_0277;label=110;break;case 110:$383=$_1>>>3;if($_1>>>0<256){label=111;break}else{label=116;break};case 111:$386=$383<<1;$388=7968+($386<<2)|0;$389=HEAP32[1982]|0;$390=1<<$383;if(($389&$390|0)==0){label=112;break}else{label=113;break};case 112:HEAP32[1982]=$389|$390;$F16_0=$388;label=115;break;case 113:$397=HEAP32[7968+($386+2<<2)>>2]|0;if($397>>>0<(HEAP32[1986]|0)>>>0){label=114;break}else{$F16_0=$397;label=115;break};case 114:_abort();case 115:HEAP32[7968+($386+2<<2)>>2]=$_0;HEAP32[$F16_0+12>>2]=$_0;HEAP32[$_0+8>>2]=$F16_0;HEAP32[$_0+12>>2]=$388;label=134;break;case 116:$408=$_0;$409=$_1>>>8;if(($409|0)==0){$I19_0=0;label=119;break}else{label=117;break};case 117:if($_1>>>0>16777215){$I19_0=31;label=119;break}else{label=118;break};case 118:$416=($409+1048320|0)>>>16&8;$417=$409<<$416;$420=($417+520192|0)>>>16&4;$422=$417<<$420;$425=($422+245760|0)>>>16&2;$430=14-($420|$416|$425)+($422<<$425>>>15)|0;$I19_0=$_1>>>(($430+7|0)>>>0)&1|$430<<1;label=119;break;case 119:$437=8232+($I19_0<<2)|0;HEAP32[$_0+28>>2]=$I19_0;HEAP32[$_0+20>>2]=0;HEAP32[$_0+16>>2]=0;$441=HEAP32[1983]|0;$442=1<<$I19_0;if(($441&$442|0)==0){label=120;break}else{label=121;break};case 120:HEAP32[1983]=$441|$442;HEAP32[$437>>2]=$408;HEAP32[$_0+24>>2]=$437;HEAP32[$_0+12>>2]=$_0;HEAP32[$_0+8>>2]=$_0;label=134;break;case 121:if(($I19_0|0)==31){$457=0;label=123;break}else{label=122;break};case 122:$457=25-($I19_0>>>1)|0;label=123;break;case 123:$K20_0=$_1<<$457;$T_0=HEAP32[$437>>2]|0;label=124;break;case 124:if((HEAP32[$T_0+4>>2]&-8|0)==($_1|0)){label=129;break}else{label=125;break};case 125:$466=$T_0+16+($K20_0>>>31<<2)|0;$467=HEAP32[$466>>2]|0;if(($467|0)==0){label=126;break}else{$K20_0=$K20_0<<1;$T_0=$467;label=124;break};case 126:if($466>>>0<(HEAP32[1986]|0)>>>0){label=128;break}else{label=127;break};case 127:HEAP32[$466>>2]=$408;HEAP32[$_0+24>>2]=$T_0;HEAP32[$_0+12>>2]=$_0;HEAP32[$_0+8>>2]=$_0;label=134;break;case 128:_abort();case 129:$480=$T_0+8|0;$481=HEAP32[$480>>2]|0;$483=HEAP32[1986]|0;if($T_0>>>0<$483>>>0){label=132;break}else{label=130;break};case 130:if($481>>>0<$483>>>0){label=132;break}else{label=131;break};case 131:HEAP32[$481+12>>2]=$408;HEAP32[$480>>2]=$408;HEAP32[$_0+8>>2]=$481;HEAP32[$_0+12>>2]=$T_0;HEAP32[$_0+24>>2]=0;label=134;break;case 132:_abort();case 133:_abort();case 134:return}}function _init_top($p,$psize){$p=$p|0;$psize=$psize|0;var $1=0,$3=0,$10=0,$13=0,label=0;label=1;while(1)switch(label|0){case 1:$1=$p;$3=$p+8|0;if(($3&7|0)==0){$10=0;label=3;break}else{label=2;break};case 2:$10=-$3&7;label=3;break;case 3:$13=$psize-$10|0;HEAP32[1988]=$1+$10;HEAP32[1985]=$13;HEAP32[$1+($10+4)>>2]=$13|1;HEAP32[$1+($psize+4)>>2]=40;HEAP32[1989]=HEAP32[46];return}}function _init_bins(){var $i_02=0,$2=0,$4=0,$7=0,label=0;label=1;while(1)switch(label|0){case 1:$i_02=0;label=2;break;case 2:$2=$i_02<<1;$4=7968+($2<<2)|0;HEAP32[7968+($2+3<<2)>>2]=$4;HEAP32[7968+($2+2<<2)>>2]=$4;$7=$i_02+1|0;if($7>>>0<32){$i_02=$7;label=2;break}else{label=3;break};case 3:return}}function _prepend_alloc($newbase,$oldbase,$nb){$newbase=$newbase|0;$oldbase=$oldbase|0;$nb=$nb|0;var $2=0,$9=0,$12=0,$19=0,$20=0,$21=0,$_sum=0,$25=0,$26=0,$27=0,$35=0,$44=0,$53=0,$57=0,$58=0,$63=0,$66=0,$69=0,$98=0,$101=0,$104=0,$109=0,$114=0,$118=0,$_sum67=0,$124=0,$125=0,$129=0,$130=0,$RP_0=0,$R_0=0,$132=0,$136=0,$CP_0=0,$R_1=0,$150=0,$152=0,$166=0,$_sum3233=0,$183=0,$196=0,$qsize_0=0,$oldfirst_0=0,$212=0,$220=0,$223=0,$225=0,$226=0,$227=0,$234=0,$F4_0=0,$247=0,$248=0,$255=0,$256=0,$259=0,$261=0,$264=0,$269=0,$I7_0=0,$276=0,$283=0,$284=0,$303=0,$T_0=0,$K8_0=0,$312=0,$313=0,$329=0,$330=0,$332=0,label=0;label=1;while(1)switch(label|0){case 1:$2=$newbase+8|0;if(($2&7|0)==0){$9=0;label=3;break}else{label=2;break};case 2:$9=-$2&7;label=3;break;case 3:$12=$oldbase+8|0;if(($12&7|0)==0){$19=0;label=5;break}else{label=4;break};case 4:$19=-$12&7;label=5;break;case 5:$20=$oldbase+$19|0;$21=$20;$_sum=$9+$nb|0;$25=$newbase+$_sum|0;$26=$25;$27=$20-($newbase+$9)-$nb|0;HEAP32[$newbase+($9+4)>>2]=$nb|3;if(($21|0)==(HEAP32[1988]|0)){label=6;break}else{label=7;break};case 6:$35=(HEAP32[1985]|0)+$27|0;HEAP32[1985]=$35;HEAP32[1988]=$26;HEAP32[$newbase+($_sum+4)>>2]=$35|1;label=80;break;case 7:if(($21|0)==(HEAP32[1987]|0)){label=8;break}else{label=9;break};case 8:$44=(HEAP32[1984]|0)+$27|0;HEAP32[1984]=$44;HEAP32[1987]=$26;HEAP32[$newbase+($_sum+4)>>2]=$44|1;HEAP32[$newbase+($44+$_sum)>>2]=$44;label=80;break;case 9:$53=HEAP32[$oldbase+($19+4)>>2]|0;if(($53&3|0)==1){label=10;break}else{$oldfirst_0=$21;$qsize_0=$27;label=57;break};case 10:$57=$53&-8;$58=$53>>>3;if($53>>>0<256){label=11;break}else{label=22;break};case 11:$63=HEAP32[$oldbase+($19|8)>>2]|0;$66=HEAP32[$oldbase+($19+12)>>2]|0;$69=7968+($58<<1<<2)|0;if(($63|0)==($69|0)){label=14;break}else{label=12;break};case 12:if($63>>>0<(HEAP32[1986]|0)>>>0){label=21;break}else{label=13;break};case 13:if((HEAP32[$63+12>>2]|0)==($21|0)){label=14;break}else{label=21;break};case 14:if(($66|0)==($63|0)){label=15;break}else{label=16;break};case 15:HEAP32[1982]=HEAP32[1982]&(1<<$58^-1);label=56;break;case 16:if(($66|0)==($69|0)){label=19;break}else{label=17;break};case 17:if($66>>>0<(HEAP32[1986]|0)>>>0){label=20;break}else{label=18;break};case 18:if((HEAP32[$66+8>>2]|0)==($21|0)){label=19;break}else{label=20;break};case 19:HEAP32[$63+12>>2]=$66;HEAP32[$66+8>>2]=$63;label=56;break;case 20:_abort();return 0;return 0;case 21:_abort();return 0;return 0;case 22:$98=$20;$101=HEAP32[$oldbase+($19|24)>>2]|0;$104=HEAP32[$oldbase+($19+12)>>2]|0;if(($104|0)==($98|0)){label=28;break}else{label=23;break};case 23:$109=HEAP32[$oldbase+($19|8)>>2]|0;if($109>>>0<(HEAP32[1986]|0)>>>0){label=27;break}else{label=24;break};case 24:$114=$109+12|0;if((HEAP32[$114>>2]|0)==($98|0)){label=25;break}else{label=27;break};case 25:$118=$104+8|0;if((HEAP32[$118>>2]|0)==($98|0)){label=26;break}else{label=27;break};case 26:HEAP32[$114>>2]=$104;HEAP32[$118>>2]=$109;$R_1=$104;label=36;break;case 27:_abort();return 0;return 0;case 28:$_sum67=$19|16;$124=$oldbase+($_sum67+4)|0;$125=HEAP32[$124>>2]|0;if(($125|0)==0){label=29;break}else{$R_0=$125;$RP_0=$124;label=30;break};case 29:$129=$oldbase+$_sum67|0;$130=HEAP32[$129>>2]|0;if(($130|0)==0){$R_1=0;label=36;break}else{$R_0=$130;$RP_0=$129;label=30;break};case 30:$132=$R_0+20|0;if((HEAP32[$132>>2]|0)==0){label=31;break}else{$CP_0=$132;label=32;break};case 31:$136=$R_0+16|0;if((HEAP32[$136>>2]|0)==0){label=33;break}else{$CP_0=$136;label=32;break};case 32:$R_0=HEAP32[$CP_0>>2]|0;$RP_0=$CP_0;label=30;break;case 33:if($RP_0>>>0<(HEAP32[1986]|0)>>>0){label=35;break}else{label=34;break};case 34:HEAP32[$RP_0>>2]=0;$R_1=$R_0;label=36;break;case 35:_abort();return 0;return 0;case 36:if(($101|0)==0){label=56;break}else{label=37;break};case 37:$150=$oldbase+($19+28)|0;$152=8232+(HEAP32[$150>>2]<<2)|0;if(($98|0)==(HEAP32[$152>>2]|0)){label=38;break}else{label=40;break};case 38:HEAP32[$152>>2]=$R_1;if(($R_1|0)==0){label=39;break}else{label=46;break};case 39:HEAP32[1983]=HEAP32[1983]&(1<<HEAP32[$150>>2]^-1);label=56;break;case 40:if($101>>>0<(HEAP32[1986]|0)>>>0){label=44;break}else{label=41;break};case 41:$166=$101+16|0;if((HEAP32[$166>>2]|0)==($98|0)){label=42;break}else{label=43;break};case 42:HEAP32[$166>>2]=$R_1;label=45;break;case 43:HEAP32[$101+20>>2]=$R_1;label=45;break;case 44:_abort();return 0;return 0;case 45:if(($R_1|0)==0){label=56;break}else{label=46;break};case 46:if($R_1>>>0<(HEAP32[1986]|0)>>>0){label=55;break}else{label=47;break};case 47:HEAP32[$R_1+24>>2]=$101;$_sum3233=$19|16;$183=HEAP32[$oldbase+$_sum3233>>2]|0;if(($183|0)==0){label=51;break}else{label=48;break};case 48:if($183>>>0<(HEAP32[1986]|0)>>>0){label=50;break}else{label=49;break};case 49:HEAP32[$R_1+16>>2]=$183;HEAP32[$183+24>>2]=$R_1;label=51;break;case 50:_abort();return 0;return 0;case 51:$196=HEAP32[$oldbase+($_sum3233+4)>>2]|0;if(($196|0)==0){label=56;break}else{label=52;break};case 52:if($196>>>0<(HEAP32[1986]|0)>>>0){label=54;break}else{label=53;break};case 53:HEAP32[$R_1+20>>2]=$196;HEAP32[$196+24>>2]=$R_1;label=56;break;case 54:_abort();return 0;return 0;case 55:_abort();return 0;return 0;case 56:$oldfirst_0=$oldbase+($57|$19)|0;$qsize_0=$57+$27|0;label=57;break;case 57:$212=$oldfirst_0+4|0;HEAP32[$212>>2]=HEAP32[$212>>2]&-2;HEAP32[$newbase+($_sum+4)>>2]=$qsize_0|1;HEAP32[$newbase+($qsize_0+$_sum)>>2]=$qsize_0;$220=$qsize_0>>>3;if($qsize_0>>>0<256){label=58;break}else{label=63;break};case 58:$223=$220<<1;$225=7968+($223<<2)|0;$226=HEAP32[1982]|0;$227=1<<$220;if(($226&$227|0)==0){label=59;break}else{label=60;break};case 59:HEAP32[1982]=$226|$227;$F4_0=$225;label=62;break;case 60:$234=HEAP32[7968+($223+2<<2)>>2]|0;if($234>>>0<(HEAP32[1986]|0)>>>0){label=61;break}else{$F4_0=$234;label=62;break};case 61:_abort();return 0;return 0;case 62:HEAP32[7968+($223+2<<2)>>2]=$26;HEAP32[$F4_0+12>>2]=$26;HEAP32[$newbase+($_sum+8)>>2]=$F4_0;HEAP32[$newbase+($_sum+12)>>2]=$225;label=80;break;case 63:$247=$25;$248=$qsize_0>>>8;if(($248|0)==0){$I7_0=0;label=66;break}else{label=64;break};case 64:if($qsize_0>>>0>16777215){$I7_0=31;label=66;break}else{label=65;break};case 65:$255=($248+1048320|0)>>>16&8;$256=$248<<$255;$259=($256+520192|0)>>>16&4;$261=$256<<$259;$264=($261+245760|0)>>>16&2;$269=14-($259|$255|$264)+($261<<$264>>>15)|0;$I7_0=$qsize_0>>>(($269+7|0)>>>0)&1|$269<<1;label=66;break;case 66:$276=8232+($I7_0<<2)|0;HEAP32[$newbase+($_sum+28)>>2]=$I7_0;HEAP32[$newbase+($_sum+20)>>2]=0;HEAP32[$newbase+($_sum+16)>>2]=0;$283=HEAP32[1983]|0;$284=1<<$I7_0;if(($283&$284|0)==0){label=67;break}else{label=68;break};case 67:HEAP32[1983]=$283|$284;HEAP32[$276>>2]=$247;HEAP32[$newbase+($_sum+24)>>2]=$276;HEAP32[$newbase+($_sum+12)>>2]=$247;HEAP32[$newbase+($_sum+8)>>2]=$247;label=80;break;case 68:if(($I7_0|0)==31){$303=0;label=70;break}else{label=69;break};case 69:$303=25-($I7_0>>>1)|0;label=70;break;case 70:$K8_0=$qsize_0<<$303;$T_0=HEAP32[$276>>2]|0;label=71;break;case 71:if((HEAP32[$T_0+4>>2]&-8|0)==($qsize_0|0)){label=76;break}else{label=72;break};case 72:$312=$T_0+16+($K8_0>>>31<<2)|0;$313=HEAP32[$312>>2]|0;if(($313|0)==0){label=73;break}else{$K8_0=$K8_0<<1;$T_0=$313;label=71;break};case 73:if($312>>>0<(HEAP32[1986]|0)>>>0){label=75;break}else{label=74;break};case 74:HEAP32[$312>>2]=$247;HEAP32[$newbase+($_sum+24)>>2]=$T_0;HEAP32[$newbase+($_sum+12)>>2]=$247;HEAP32[$newbase+($_sum+8)>>2]=$247;label=80;break;case 75:_abort();return 0;return 0;case 76:$329=$T_0+8|0;$330=HEAP32[$329>>2]|0;$332=HEAP32[1986]|0;if($T_0>>>0<$332>>>0){label=79;break}else{label=77;break};case 77:if($330>>>0<$332>>>0){label=79;break}else{label=78;break};case 78:HEAP32[$330+12>>2]=$247;HEAP32[$329>>2]=$247;HEAP32[$newbase+($_sum+8)>>2]=$330;HEAP32[$newbase+($_sum+12)>>2]=$T_0;HEAP32[$newbase+($_sum+24)>>2]=0;label=80;break;case 79:_abort();return 0;return 0;case 80:return $newbase+($9|8)|0}return 0}
function _add_segment($tbase,$tsize){$tbase=$tbase|0;$tsize=$tsize|0;var $1=0,$2=0,$3=0,$5=0,$7=0,$8=0,$10=0,$17=0,$18=0,$22=0,$23=0,$30=0,$33=0,$34=0,$42=0,$45=0,$51=0,$54=0,$56=0,$57=0,$58=0,$65=0,$F_0=0,$76=0,$77=0,$84=0,$85=0,$88=0,$90=0,$93=0,$98=0,$I1_0=0,$105=0,$109=0,$110=0,$125=0,$T_0=0,$K2_0=0,$134=0,$135=0,$148=0,$149=0,$151=0,label=0;label=1;while(1)switch(label|0){case 1:$1=HEAP32[1988]|0;$2=$1;$3=_segment_holding($2)|0;$5=HEAP32[$3>>2]|0;$7=HEAP32[$3+4>>2]|0;$8=$5+$7|0;$10=$5+($7-39)|0;if(($10&7|0)==0){$17=0;label=3;break}else{label=2;break};case 2:$17=-$10&7;label=3;break;case 3:$18=$5+($7-47+$17)|0;$22=$18>>>0<($1+16|0)>>>0?$2:$18;$23=$22+8|0;_init_top($tbase,$tsize-40|0);HEAP32[$22+4>>2]=27;HEAP32[$23>>2]=HEAP32[2094];HEAP32[$23+4>>2]=HEAP32[8380>>2];HEAP32[$23+8>>2]=HEAP32[8384>>2];HEAP32[$23+12>>2]=HEAP32[8388>>2];HEAP32[2094]=$tbase;HEAP32[2095]=$tsize;HEAP32[2097]=0;HEAP32[2096]=$23;$30=$22+28|0;HEAP32[$30>>2]=7;if(($22+32|0)>>>0<$8>>>0){$33=$30;label=4;break}else{label=5;break};case 4:$34=$33+4|0;HEAP32[$34>>2]=7;if(($33+8|0)>>>0<$8>>>0){$33=$34;label=4;break}else{label=5;break};case 5:if(($22|0)==($2|0)){label=29;break}else{label=6;break};case 6:$42=$22-$1|0;$45=$2+($42+4)|0;HEAP32[$45>>2]=HEAP32[$45>>2]&-2;HEAP32[$1+4>>2]=$42|1;HEAP32[$2+$42>>2]=$42;$51=$42>>>3;if($42>>>0<256){label=7;break}else{label=12;break};case 7:$54=$51<<1;$56=7968+($54<<2)|0;$57=HEAP32[1982]|0;$58=1<<$51;if(($57&$58|0)==0){label=8;break}else{label=9;break};case 8:HEAP32[1982]=$57|$58;$F_0=$56;label=11;break;case 9:$65=HEAP32[7968+($54+2<<2)>>2]|0;if($65>>>0<(HEAP32[1986]|0)>>>0){label=10;break}else{$F_0=$65;label=11;break};case 10:_abort();case 11:HEAP32[7968+($54+2<<2)>>2]=$1;HEAP32[$F_0+12>>2]=$1;HEAP32[$1+8>>2]=$F_0;HEAP32[$1+12>>2]=$56;label=29;break;case 12:$76=$1;$77=$42>>>8;if(($77|0)==0){$I1_0=0;label=15;break}else{label=13;break};case 13:if($42>>>0>16777215){$I1_0=31;label=15;break}else{label=14;break};case 14:$84=($77+1048320|0)>>>16&8;$85=$77<<$84;$88=($85+520192|0)>>>16&4;$90=$85<<$88;$93=($90+245760|0)>>>16&2;$98=14-($88|$84|$93)+($90<<$93>>>15)|0;$I1_0=$42>>>(($98+7|0)>>>0)&1|$98<<1;label=15;break;case 15:$105=8232+($I1_0<<2)|0;HEAP32[$1+28>>2]=$I1_0;HEAP32[$1+20>>2]=0;HEAP32[$1+16>>2]=0;$109=HEAP32[1983]|0;$110=1<<$I1_0;if(($109&$110|0)==0){label=16;break}else{label=17;break};case 16:HEAP32[1983]=$109|$110;HEAP32[$105>>2]=$76;HEAP32[$1+24>>2]=$105;HEAP32[$1+12>>2]=$1;HEAP32[$1+8>>2]=$1;label=29;break;case 17:if(($I1_0|0)==31){$125=0;label=19;break}else{label=18;break};case 18:$125=25-($I1_0>>>1)|0;label=19;break;case 19:$K2_0=$42<<$125;$T_0=HEAP32[$105>>2]|0;label=20;break;case 20:if((HEAP32[$T_0+4>>2]&-8|0)==($42|0)){label=25;break}else{label=21;break};case 21:$134=$T_0+16+($K2_0>>>31<<2)|0;$135=HEAP32[$134>>2]|0;if(($135|0)==0){label=22;break}else{$K2_0=$K2_0<<1;$T_0=$135;label=20;break};case 22:if($134>>>0<(HEAP32[1986]|0)>>>0){label=24;break}else{label=23;break};case 23:HEAP32[$134>>2]=$76;HEAP32[$1+24>>2]=$T_0;HEAP32[$1+12>>2]=$1;HEAP32[$1+8>>2]=$1;label=29;break;case 24:_abort();case 25:$148=$T_0+8|0;$149=HEAP32[$148>>2]|0;$151=HEAP32[1986]|0;if($T_0>>>0<$151>>>0){label=28;break}else{label=26;break};case 26:if($149>>>0<$151>>>0){label=28;break}else{label=27;break};case 27:HEAP32[$149+12>>2]=$76;HEAP32[$148>>2]=$76;HEAP32[$1+8>>2]=$149;HEAP32[$1+12>>2]=$T_0;HEAP32[$1+24>>2]=0;label=29;break;case 28:_abort();case 29:return}}function _strlen(ptr){ptr=ptr|0;var curr=0;curr=ptr;while(HEAP8[curr]|0){curr=curr+1|0}return curr-ptr|0}function _memcpy(dest,src,num){dest=dest|0;src=src|0;num=num|0;var ret=0;ret=dest|0;if((dest&3)==(src&3)){while(dest&3){if((num|0)==0)return ret|0;HEAP8[dest]=HEAP8[src]|0;dest=dest+1|0;src=src+1|0;num=num-1|0}while((num|0)>=4){HEAP32[dest>>2]=HEAP32[src>>2];dest=dest+4|0;src=src+4|0;num=num-4|0}}while((num|0)>0){HEAP8[dest]=HEAP8[src]|0;dest=dest+1|0;src=src+1|0;num=num-1|0}return ret|0}function _strcpy(pdest,psrc){pdest=pdest|0;psrc=psrc|0;var i=0;do{HEAP8[pdest+i|0]=HEAP8[psrc+i|0];i=i+1|0}while(HEAP8[psrc+(i-1)|0]|0);return pdest|0}function _memset(ptr,value,num){ptr=ptr|0;value=value|0;num=num|0;var stop=0,value4=0,stop4=0,unaligned=0;stop=ptr+num|0;if((num|0)>=20){value=value&255;unaligned=ptr&3;value4=value|value<<8|value<<16|value<<24;stop4=stop&~3;if(unaligned){unaligned=ptr+4-unaligned|0;while((ptr|0)<(unaligned|0)){HEAP8[ptr]=value;ptr=ptr+1|0}}while((ptr|0)<(stop4|0)){HEAP32[ptr>>2]=value4;ptr=ptr+4|0}}while((ptr|0)<(stop|0)){HEAP8[ptr]=value;ptr=ptr+1|0}}function _memmove(dest,src,num){dest=dest|0;src=src|0;num=num|0;if((src|0)<(dest|0)&(dest|0)<(src+num|0)){src=src+num|0;dest=dest+num|0;while((num|0)>0){dest=dest-1|0;src=src-1|0;num=num-1|0;HEAP8[dest]=HEAP8[src]|0}}else{_memcpy(dest,src,num)|0}}function _memcmp(p1,p2,num){p1=p1|0;p2=p2|0;num=num|0;var i=0,v1=0,v2=0;while((i|0)<(num|0)){v1=HEAPU8[p1+i|0]|0;v2=HEAPU8[p2+i|0]|0;if((v1|0)!=(v2|0))return((v1|0)>(v2|0)?1:-1)|0;i=i+1|0}return 0}function _i64Add(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var l=0;l=a+c>>>0;return(tempRet0=b+d+(l>>>0<a>>>0|0)>>>0,l|0)|0}function _i64Subtract(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var h=0;h=b-d>>>0;h=b-d-(c>>>0>a>>>0|0)>>>0;return(tempRet0=h,a-c>>>0|0)|0}function _bitshift64Shl(low,high,bits){low=low|0;high=high|0;bits=bits|0;if((bits|0)<32){tempRet0=high<<bits|(low&(1<<bits)-1<<32-bits)>>>32-bits;return low<<bits}tempRet0=low<<bits-32;return 0}function _bitshift64Lshr(low,high,bits){low=low|0;high=high|0;bits=bits|0;if((bits|0)<32){tempRet0=high>>>bits;return low>>>bits|(high&(1<<bits)-1)<<32-bits}tempRet0=0;return high>>>bits-32|0}function _bitshift64Ashr(low,high,bits){low=low|0;high=high|0;bits=bits|0;if((bits|0)<32){tempRet0=high>>bits;return low>>>bits|(high&(1<<bits)-1)<<32-bits}tempRet0=(high|0)<0?-1:0;return high>>bits-32|0}function _llvm_ctlz_i32(x){x=x|0;var ret=0;ret=HEAP8[ctlz_i8+(x>>>24)|0]|0;if((ret|0)<8)return ret|0;ret=HEAP8[ctlz_i8+(x>>16&255)|0]|0;if((ret|0)<8)return ret+8|0;ret=HEAP8[ctlz_i8+(x>>8&255)|0]|0;if((ret|0)<8)return ret+16|0;return(HEAP8[ctlz_i8+(x&255)|0]|0)+24|0}function _llvm_cttz_i32(x){x=x|0;var ret=0;ret=HEAP8[cttz_i8+(x&255)|0]|0;if((ret|0)<8)return ret|0;ret=HEAP8[cttz_i8+(x>>8&255)|0]|0;if((ret|0)<8)return ret+8|0;ret=HEAP8[cttz_i8+(x>>16&255)|0]|0;if((ret|0)<8)return ret+16|0;return(HEAP8[cttz_i8+(x>>>24)|0]|0)+24|0}function ___muldsi3($a,$b){$a=$a|0;$b=$b|0;var $1=0,$2=0,$3=0,$6=0,$8=0,$11=0,$12=0;$1=$a&65535;$2=$b&65535;$3=Math_imul($2,$1)|0;$6=$a>>>16;$8=($3>>>16)+(Math_imul($2,$6)|0)|0;$11=$b>>>16;$12=Math_imul($11,$1)|0;return(tempRet0=($8>>>16)+(Math_imul($11,$6)|0)+((($8&65535)+$12|0)>>>16)|0,$8+$12<<16|$3&65535|0)|0}function ___divdi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $1$0=0,$1$1=0,$2$0=0,$2$1=0,$4$0=0,$4$1=0,$7$0=0,$7$1=0,$10$0=0;$1$0=$a$1>>31|(($a$1|0)<0?-1:0)<<1;$1$1=(($a$1|0)<0?-1:0)>>31|(($a$1|0)<0?-1:0)<<1;$2$0=$b$1>>31|(($b$1|0)<0?-1:0)<<1;$2$1=(($b$1|0)<0?-1:0)>>31|(($b$1|0)<0?-1:0)<<1;$4$0=_i64Subtract($1$0^$a$0,$1$1^$a$1,$1$0,$1$1)|0;$4$1=tempRet0;$7$0=$2$0^$1$0;$7$1=$2$1^$1$1;$10$0=_i64Subtract((___udivmoddi4($4$0,$4$1,_i64Subtract($2$0^$b$0,$2$1^$b$1,$2$0,$2$1)|0,tempRet0,0)|0)^$7$0,tempRet0^$7$1,$7$0,$7$1)|0;return(tempRet0=tempRet0,$10$0)|0}function ___remdi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $rem=0,$1$0=0,$1$1=0,$2$0=0,$2$1=0,$4$0=0,$4$1=0,$6$0=0,$10$0=0,$10$1=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;$rem=__stackBase__|0;$1$0=$a$1>>31|(($a$1|0)<0?-1:0)<<1;$1$1=(($a$1|0)<0?-1:0)>>31|(($a$1|0)<0?-1:0)<<1;$2$0=$b$1>>31|(($b$1|0)<0?-1:0)<<1;$2$1=(($b$1|0)<0?-1:0)>>31|(($b$1|0)<0?-1:0)<<1;$4$0=_i64Subtract($1$0^$a$0,$1$1^$a$1,$1$0,$1$1)|0;$4$1=tempRet0;$6$0=_i64Subtract($2$0^$b$0,$2$1^$b$1,$2$0,$2$1)|0;___udivmoddi4($4$0,$4$1,$6$0,tempRet0,$rem)|0;$10$0=_i64Subtract(HEAP32[$rem>>2]^$1$0,HEAP32[$rem+4>>2]^$1$1,$1$0,$1$1)|0;$10$1=tempRet0;STACKTOP=__stackBase__;return(tempRet0=$10$1,$10$0)|0}function ___muldi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $x_sroa_0_0_extract_trunc=0,$y_sroa_0_0_extract_trunc=0,$1$0=0,$1$1=0;$x_sroa_0_0_extract_trunc=$a$0;$y_sroa_0_0_extract_trunc=$b$0;$1$0=___muldsi3($x_sroa_0_0_extract_trunc,$y_sroa_0_0_extract_trunc)|0;$1$1=tempRet0;return(tempRet0=(Math_imul($a$1,$y_sroa_0_0_extract_trunc)|0)+(Math_imul($b$1,$x_sroa_0_0_extract_trunc)|0)+$1$1|$1$1&0,$1$0&-1|0)|0}function ___udivdi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $1$0=0;$1$0=___udivmoddi4($a$0,$a$1,$b$0,$b$1,0)|0;return(tempRet0=tempRet0,$1$0)|0}function ___uremdi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $rem=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;$rem=__stackBase__|0;___udivmoddi4($a$0,$a$1,$b$0,$b$1,$rem)|0;STACKTOP=__stackBase__;return(tempRet0=HEAP32[$rem+4>>2]|0,HEAP32[$rem>>2]|0)|0}function ___udivmoddi4($a$0,$a$1,$b$0,$b$1,$rem){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;$rem=$rem|0;var $n_sroa_0_0_extract_trunc=0,$n_sroa_1_4_extract_shift$0=0,$n_sroa_1_4_extract_trunc=0,$d_sroa_0_0_extract_trunc=0,$d_sroa_1_4_extract_shift$0=0,$d_sroa_1_4_extract_trunc=0,$4=0,$17=0,$37=0,$51=0,$57=0,$58=0,$66=0,$78=0,$88=0,$89=0,$91=0,$92=0,$95=0,$105=0,$119=0,$125=0,$126=0,$130=0,$q_sroa_1_1_ph=0,$q_sroa_0_1_ph=0,$r_sroa_1_1_ph=0,$r_sroa_0_1_ph=0,$sr_1_ph=0,$d_sroa_0_0_insert_insert99$0=0,$d_sroa_0_0_insert_insert99$1=0,$137$0=0,$137$1=0,$carry_0203=0,$sr_1202=0,$r_sroa_0_1201=0,$r_sroa_1_1200=0,$q_sroa_0_1199=0,$q_sroa_1_1198=0,$147=0,$149=0,$r_sroa_0_0_insert_insert42$0=0,$r_sroa_0_0_insert_insert42$1=0,$150$1=0,$151$0=0,$152=0,$r_sroa_0_0_extract_trunc=0,$r_sroa_1_4_extract_trunc=0,$155=0,$carry_0_lcssa$0=0,$carry_0_lcssa$1=0,$r_sroa_0_1_lcssa=0,$r_sroa_1_1_lcssa=0,$q_sroa_0_1_lcssa=0,$q_sroa_1_1_lcssa=0,$q_sroa_0_0_insert_ext75$0=0,$q_sroa_0_0_insert_ext75$1=0,$_0$0=0,$_0$1=0;$n_sroa_0_0_extract_trunc=$a$0;$n_sroa_1_4_extract_shift$0=$a$1;$n_sroa_1_4_extract_trunc=$n_sroa_1_4_extract_shift$0;$d_sroa_0_0_extract_trunc=$b$0;$d_sroa_1_4_extract_shift$0=$b$1;$d_sroa_1_4_extract_trunc=$d_sroa_1_4_extract_shift$0;if(($n_sroa_1_4_extract_trunc|0)==0){$4=($rem|0)!=0;if(($d_sroa_1_4_extract_trunc|0)==0){if($4){HEAP32[$rem>>2]=($n_sroa_0_0_extract_trunc>>>0)%($d_sroa_0_0_extract_trunc>>>0);HEAP32[$rem+4>>2]=0}$_0$1=0;$_0$0=($n_sroa_0_0_extract_trunc>>>0)/($d_sroa_0_0_extract_trunc>>>0)>>>0;return(tempRet0=$_0$1,$_0$0)|0}else{if(!$4){$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}HEAP32[$rem>>2]=$a$0&-1;HEAP32[$rem+4>>2]=$a$1&0;$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}}$17=($d_sroa_1_4_extract_trunc|0)==0;do{if(($d_sroa_0_0_extract_trunc|0)==0){if($17){if(($rem|0)!=0){HEAP32[$rem>>2]=($n_sroa_1_4_extract_trunc>>>0)%($d_sroa_0_0_extract_trunc>>>0);HEAP32[$rem+4>>2]=0}$_0$1=0;$_0$0=($n_sroa_1_4_extract_trunc>>>0)/($d_sroa_0_0_extract_trunc>>>0)>>>0;return(tempRet0=$_0$1,$_0$0)|0}if(($n_sroa_0_0_extract_trunc|0)==0){if(($rem|0)!=0){HEAP32[$rem>>2]=0;HEAP32[$rem+4>>2]=($n_sroa_1_4_extract_trunc>>>0)%($d_sroa_1_4_extract_trunc>>>0)}$_0$1=0;$_0$0=($n_sroa_1_4_extract_trunc>>>0)/($d_sroa_1_4_extract_trunc>>>0)>>>0;return(tempRet0=$_0$1,$_0$0)|0}$37=$d_sroa_1_4_extract_trunc-1|0;if(($37&$d_sroa_1_4_extract_trunc|0)==0){if(($rem|0)!=0){HEAP32[$rem>>2]=$a$0&-1;HEAP32[$rem+4>>2]=$37&$n_sroa_1_4_extract_trunc|$a$1&0}$_0$1=0;$_0$0=$n_sroa_1_4_extract_trunc>>>((_llvm_cttz_i32($d_sroa_1_4_extract_trunc|0)|0)>>>0);return(tempRet0=$_0$1,$_0$0)|0}$51=(_llvm_ctlz_i32($d_sroa_1_4_extract_trunc|0)|0)-(_llvm_ctlz_i32($n_sroa_1_4_extract_trunc|0)|0)|0;if($51>>>0<=30){$57=$51+1|0;$58=31-$51|0;$sr_1_ph=$57;$r_sroa_0_1_ph=$n_sroa_1_4_extract_trunc<<$58|$n_sroa_0_0_extract_trunc>>>($57>>>0);$r_sroa_1_1_ph=$n_sroa_1_4_extract_trunc>>>($57>>>0);$q_sroa_0_1_ph=0;$q_sroa_1_1_ph=$n_sroa_0_0_extract_trunc<<$58;break}if(($rem|0)==0){$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}HEAP32[$rem>>2]=$a$0&-1;HEAP32[$rem+4>>2]=$n_sroa_1_4_extract_shift$0|$a$1&0;$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}else{if(!$17){$119=(_llvm_ctlz_i32($d_sroa_1_4_extract_trunc|0)|0)-(_llvm_ctlz_i32($n_sroa_1_4_extract_trunc|0)|0)|0;if($119>>>0<=31){$125=$119+1|0;$126=31-$119|0;$130=$119-31>>31;$sr_1_ph=$125;$r_sroa_0_1_ph=$n_sroa_0_0_extract_trunc>>>($125>>>0)&$130|$n_sroa_1_4_extract_trunc<<$126;$r_sroa_1_1_ph=$n_sroa_1_4_extract_trunc>>>($125>>>0)&$130;$q_sroa_0_1_ph=0;$q_sroa_1_1_ph=$n_sroa_0_0_extract_trunc<<$126;break}if(($rem|0)==0){$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}HEAP32[$rem>>2]=$a$0&-1;HEAP32[$rem+4>>2]=$n_sroa_1_4_extract_shift$0|$a$1&0;$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}$66=$d_sroa_0_0_extract_trunc-1|0;if(($66&$d_sroa_0_0_extract_trunc|0)!=0){$88=(_llvm_ctlz_i32($d_sroa_0_0_extract_trunc|0)|0)+33-(_llvm_ctlz_i32($n_sroa_1_4_extract_trunc|0)|0)|0;$89=64-$88|0;$91=32-$88|0;$92=$91>>31;$95=$88-32|0;$105=$95>>31;$sr_1_ph=$88;$r_sroa_0_1_ph=$91-1>>31&$n_sroa_1_4_extract_trunc>>>($95>>>0)|($n_sroa_1_4_extract_trunc<<$91|$n_sroa_0_0_extract_trunc>>>($88>>>0))&$105;$r_sroa_1_1_ph=$105&$n_sroa_1_4_extract_trunc>>>($88>>>0);$q_sroa_0_1_ph=$n_sroa_0_0_extract_trunc<<$89&$92;$q_sroa_1_1_ph=($n_sroa_1_4_extract_trunc<<$89|$n_sroa_0_0_extract_trunc>>>($95>>>0))&$92|$n_sroa_0_0_extract_trunc<<$91&$88-33>>31;break}if(($rem|0)!=0){HEAP32[$rem>>2]=$66&$n_sroa_0_0_extract_trunc;HEAP32[$rem+4>>2]=0}if(($d_sroa_0_0_extract_trunc|0)==1){$_0$1=$n_sroa_1_4_extract_shift$0|$a$1&0;$_0$0=$a$0&-1|0;return(tempRet0=$_0$1,$_0$0)|0}else{$78=_llvm_cttz_i32($d_sroa_0_0_extract_trunc|0)|0;$_0$1=$n_sroa_1_4_extract_trunc>>>($78>>>0)|0;$_0$0=$n_sroa_1_4_extract_trunc<<32-$78|$n_sroa_0_0_extract_trunc>>>($78>>>0)|0;return(tempRet0=$_0$1,$_0$0)|0}}}while(0);if(($sr_1_ph|0)==0){$q_sroa_1_1_lcssa=$q_sroa_1_1_ph;$q_sroa_0_1_lcssa=$q_sroa_0_1_ph;$r_sroa_1_1_lcssa=$r_sroa_1_1_ph;$r_sroa_0_1_lcssa=$r_sroa_0_1_ph;$carry_0_lcssa$1=0;$carry_0_lcssa$0=0}else{$d_sroa_0_0_insert_insert99$0=$b$0&-1|0;$d_sroa_0_0_insert_insert99$1=$d_sroa_1_4_extract_shift$0|$b$1&0;$137$0=_i64Add($d_sroa_0_0_insert_insert99$0,$d_sroa_0_0_insert_insert99$1,-1,-1)|0;$137$1=tempRet0;$q_sroa_1_1198=$q_sroa_1_1_ph;$q_sroa_0_1199=$q_sroa_0_1_ph;$r_sroa_1_1200=$r_sroa_1_1_ph;$r_sroa_0_1201=$r_sroa_0_1_ph;$sr_1202=$sr_1_ph;$carry_0203=0;while(1){$147=$q_sroa_0_1199>>>31|$q_sroa_1_1198<<1;$149=$carry_0203|$q_sroa_0_1199<<1;$r_sroa_0_0_insert_insert42$0=$r_sroa_0_1201<<1|$q_sroa_1_1198>>>31|0;$r_sroa_0_0_insert_insert42$1=$r_sroa_0_1201>>>31|$r_sroa_1_1200<<1|0;_i64Subtract($137$0,$137$1,$r_sroa_0_0_insert_insert42$0,$r_sroa_0_0_insert_insert42$1)|0;$150$1=tempRet0;$151$0=$150$1>>31|(($150$1|0)<0?-1:0)<<1;$152=$151$0&1;$r_sroa_0_0_extract_trunc=_i64Subtract($r_sroa_0_0_insert_insert42$0,$r_sroa_0_0_insert_insert42$1,$151$0&$d_sroa_0_0_insert_insert99$0,((($150$1|0)<0?-1:0)>>31|(($150$1|0)<0?-1:0)<<1)&$d_sroa_0_0_insert_insert99$1)|0;$r_sroa_1_4_extract_trunc=tempRet0;$155=$sr_1202-1|0;if(($155|0)==0){break}else{$q_sroa_1_1198=$147;$q_sroa_0_1199=$149;$r_sroa_1_1200=$r_sroa_1_4_extract_trunc;$r_sroa_0_1201=$r_sroa_0_0_extract_trunc;$sr_1202=$155;$carry_0203=$152}}$q_sroa_1_1_lcssa=$147;$q_sroa_0_1_lcssa=$149;$r_sroa_1_1_lcssa=$r_sroa_1_4_extract_trunc;$r_sroa_0_1_lcssa=$r_sroa_0_0_extract_trunc;$carry_0_lcssa$1=0;$carry_0_lcssa$0=$152}$q_sroa_0_0_insert_ext75$0=$q_sroa_0_1_lcssa;$q_sroa_0_0_insert_ext75$1=0;if(($rem|0)!=0){HEAP32[$rem>>2]=$r_sroa_0_1_lcssa;HEAP32[$rem+4>>2]=$r_sroa_1_1_lcssa}$_0$1=($q_sroa_0_0_insert_ext75$0|0)>>>31|($q_sroa_1_1_lcssa|$q_sroa_0_0_insert_ext75$1)<<1|($q_sroa_0_0_insert_ext75$1<<1|$q_sroa_0_0_insert_ext75$0>>>31)&0|$carry_0_lcssa$1;$_0$0=($q_sroa_0_0_insert_ext75$0<<1|0>>>31)&-2|$carry_0_lcssa$0;return(tempRet0=$_0$1,$_0$0)|0}function dynCall_vi(index,a1){index=index|0;a1=a1|0;FUNCTION_TABLE_vi[index&63](a1|0)}function dynCall_vii(index,a1,a2){index=index|0;a1=a1|0;a2=a2|0;FUNCTION_TABLE_vii[index&63](a1|0,a2|0)}function dynCall_ii(index,a1){index=index|0;a1=a1|0;return FUNCTION_TABLE_ii[index&63](a1|0)|0}function dynCall_v(index){index=index|0;FUNCTION_TABLE_v[index&63]()}function dynCall_iii(index,a1,a2){index=index|0;a1=a1|0;a2=a2|0;return FUNCTION_TABLE_iii[index&63](a1|0,a2|0)|0}function dynCall_viiii(index,a1,a2,a3,a4){index=index|0;a1=a1|0;a2=a2|0;a3=a3|0;a4=a4|0;FUNCTION_TABLE_viiii[index&63](a1|0,a2|0,a3|0,a4|0)}function b0(p0){p0=p0|0;abort(0)}function b1(p0,p1){p0=p0|0;p1=p1|0;abort(1)}function b2(p0){p0=p0|0;abort(2);return 0}function b3(){abort(3)}function b4(p0,p1){p0=p0|0;p1=p1|0;abort(4);return 0}function b5(p0,p1,p2,p3){p0=p0|0;p1=p1|0;p2=p2|0;p3=p3|0;abort(5)}
// EMSCRIPTEN_END_FUNCS
  var FUNCTION_TABLE_vi = [b0,b0,b0,b0,b0,b0,b0,b0,_cleanup_ref,b0,__zbar_video_recycle_shadow
  ,b0,b0,b0,b0,b0,__zbar_video_recycle_image,b0,b0,b0,_zbar_image_free_data,b0,_symbol_handler,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0];
  var FUNCTION_TABLE_vii = [b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1];
  var FUNCTION_TABLE_ii = [b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2];
  var FUNCTION_TABLE_v = [b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3];
  var FUNCTION_TABLE_iii = [b4,b4,b4,b4,_qr_cmp_edge_pt,b4,b4,b4,b4,b4,b4
  ,b4,b4,b4,_qr_finder_center_cmp,b4,b4,b4,b4,b4,b4
  ,b4,b4,b4,b4,b4,b4,b4,_qr_finder_vline_cmp,b4,b4
  ,b4,_proc_kick_handler,b4,b4,b4,b4,b4,b4,b4,_proc_video_handler,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4];
  var FUNCTION_TABLE_viiii = [b5,b5,_convert_yuv_unpack,b5,b5,b5,_convert_uvp_resample,b5,b5,b5,b5
  ,b5,_convert_copy,b5,b5,b5,b5,b5,_convert_rgb_to_yuv,b5,b5
  ,b5,b5,b5,_convert_yuv_pack,b5,_convert_rgb_to_yuvp,b5,b5,b5,_convert_yuvp_to_rgb
  ,b5,b5,b5,_convert_uv_resample,b5,_convert_rgb_resample,b5,_convert_yuv_to_rgb,b5,b5,b5,_convert_uvp_append,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5];
  return { _memcmp: _memcmp, _strlen: _strlen, _free: _free, _main: _main, _realloc: _realloc, _memmove: _memmove, _memset: _memset, _malloc: _malloc, _memcpy: _memcpy, _strcpy: _strcpy, _calloc: _calloc, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, setTempRet1: setTempRet1, setTempRet2: setTempRet2, setTempRet3: setTempRet3, setTempRet4: setTempRet4, setTempRet5: setTempRet5, setTempRet6: setTempRet6, setTempRet7: setTempRet7, setTempRet8: setTempRet8, setTempRet9: setTempRet9, dynCall_vi: dynCall_vi, dynCall_vii: dynCall_vii, dynCall_ii: dynCall_ii, dynCall_v: dynCall_v, dynCall_iii: dynCall_iii, dynCall_viiii: dynCall_viiii };
})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_v": invoke_v, "invoke_iii": invoke_iii, "invoke_viiii": invoke_viiii, "_llvm_uadd_with_overflow_i32": _llvm_uadd_with_overflow_i32, "_snprintf": _snprintf, "_fclose": _fclose, "_abort": _abort, "_fprintf": _fprintf, "_pread": _pread, "_close": _close, "_fopen": _fopen, "__reallyNegative": __reallyNegative, "_usleep": _usleep, "_fputc": _fputc, "_iconv": _iconv, "_poll": _poll, "_js_get_width": _js_get_width, "_open": _open, "_js_read_image": _js_read_image, "___setErrNo": ___setErrNo, "_fwrite": _fwrite, "_nanosleep": _nanosleep, "_qsort": _qsort, "_send": _send, "_write": _write, "_fputs": _fputs, "_sprintf": _sprintf, "_strdup": _strdup, "_recv": _recv, "_read": _read, "_iconv_open": _iconv_open, "_time": _time, "__formatString": __formatString, "_js_output_result": _js_output_result, "_gettimeofday": _gettimeofday, "_iconv_close": _iconv_close, "_perror": _perror, "___assert_func": ___assert_func, "_js_get_height": _js_get_height, "_pwrite": _pwrite, "_strstr": _strstr, "_puts": _puts, "_fsync": _fsync, "_strerror_r": _strerror_r, "___errno_location": ___errno_location, "_strerror": _strerror, "_pipe": _pipe, "_sbrk": _sbrk, "_sysconf": _sysconf, "_memchr": _memchr, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity, "_stderr": _stderr }, buffer);
var _memcmp = Module["_memcmp"] = asm["_memcmp"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _strcpy = Module["_strcpy"] = asm["_strcpy"];
var _calloc = Module["_calloc"] = asm["_calloc"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// TODO: strip out parts of this we do not need
//======= begin closure i64 code =======
// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */
var i64Math = (function() { // Emscripten wrapper
  var goog = { math: {} };
  /**
   * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
   * values as *signed* integers.  See the from* functions below for more
   * convenient ways of constructing Longs.
   *
   * The internal representation of a long is the two given signed, 32-bit values.
   * We use 32-bit pieces because these are the size of integers on which
   * Javascript performs bit-operations.  For operations like addition and
   * multiplication, we split each number into 16-bit pieces, which can easily be
   * multiplied within Javascript's floating-point representation without overflow
   * or change in sign.
   *
   * In the algorithms below, we frequently reduce the negative case to the
   * positive case by negating the input(s) and then post-processing the result.
   * Note that we must ALWAYS check specially whether those values are MIN_VALUE
   * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
   * a positive number, it overflows back into a negative).  Not handling this
   * case would often result in infinite recursion.
   *
   * @param {number} low  The low (signed) 32 bits of the long.
   * @param {number} high  The high (signed) 32 bits of the long.
   * @constructor
   */
  goog.math.Long = function(low, high) {
    /**
     * @type {number}
     * @private
     */
    this.low_ = low | 0;  // force into 32 signed bits.
    /**
     * @type {number}
     * @private
     */
    this.high_ = high | 0;  // force into 32 signed bits.
  };
  // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
  // from* methods on which they depend.
  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @private
   */
  goog.math.Long.IntCache_ = {};
  /**
   * Returns a Long representing the given (32-bit) integer value.
   * @param {number} value The 32-bit integer in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromInt = function(value) {
    if (-128 <= value && value < 128) {
      var cachedObj = goog.math.Long.IntCache_[value];
      if (cachedObj) {
        return cachedObj;
      }
    }
    var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
    if (-128 <= value && value < 128) {
      goog.math.Long.IntCache_[value] = obj;
    }
    return obj;
  };
  /**
   * Returns a Long representing the given value, provided that it is a finite
   * number.  Otherwise, zero is returned.
   * @param {number} value The number in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromNumber = function(value) {
    if (isNaN(value) || !isFinite(value)) {
      return goog.math.Long.ZERO;
    } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MIN_VALUE;
    } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MAX_VALUE;
    } else if (value < 0) {
      return goog.math.Long.fromNumber(-value).negate();
    } else {
      return new goog.math.Long(
          (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
          (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
    }
  };
  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating
   * the given high and low bits.  Each is assumed to use 32 bits.
   * @param {number} lowBits The low 32-bits.
   * @param {number} highBits The high 32-bits.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromBits = function(lowBits, highBits) {
    return new goog.math.Long(lowBits, highBits);
  };
  /**
   * Returns a Long representation of the given string, written using the given
   * radix.
   * @param {string} str The textual representation of the Long.
   * @param {number=} opt_radix The radix in which the text is written.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromString = function(str, opt_radix) {
    if (str.length == 0) {
      throw Error('number format error: empty string');
    }
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (str.charAt(0) == '-') {
      return goog.math.Long.fromString(str.substring(1), radix).negate();
    } else if (str.indexOf('-') >= 0) {
      throw Error('number format error: interior "-" character: ' + str);
    }
    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
    var result = goog.math.Long.ZERO;
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i);
      var value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
        result = result.multiply(power).add(goog.math.Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(goog.math.Long.fromNumber(value));
      }
    }
    return result;
  };
  // NOTE: the compiler should inline these constant values below and then remove
  // these variables, so there should be no runtime penalty for these.
  /**
   * Number used repeated below in calculations.  This must appear before the
   * first call to any from* function below.
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_32_DBL_ =
      goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_31_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ / 2;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_48_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_64_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_63_DBL_ =
      goog.math.Long.TWO_PWR_64_DBL_ / 2;
  /** @type {!goog.math.Long} */
  goog.math.Long.ZERO = goog.math.Long.fromInt(0);
  /** @type {!goog.math.Long} */
  goog.math.Long.ONE = goog.math.Long.fromInt(1);
  /** @type {!goog.math.Long} */
  goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
  /** @type {!goog.math.Long} */
  goog.math.Long.MAX_VALUE =
      goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
  /** @type {!goog.math.Long} */
  goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);
  /**
   * @type {!goog.math.Long}
   * @private
   */
  goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
  /** @return {number} The value, assuming it is a 32-bit integer. */
  goog.math.Long.prototype.toInt = function() {
    return this.low_;
  };
  /** @return {number} The closest floating-point representation to this value. */
  goog.math.Long.prototype.toNumber = function() {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
           this.getLowBitsUnsigned();
  };
  /**
   * @param {number=} opt_radix The radix in which the text should be written.
   * @return {string} The textual representation of this value.
   */
  goog.math.Long.prototype.toString = function(opt_radix) {
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (this.isZero()) {
      return '0';
    }
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = goog.math.Long.fromNumber(radix);
        var div = this.div(radixLong);
        var rem = div.multiply(radixLong).subtract(this);
        return div.toString(radix) + rem.toInt().toString(radix);
      } else {
        return '-' + this.negate().toString(radix);
      }
    }
    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
    var rem = this;
    var result = '';
    while (true) {
      var remDiv = rem.div(radixToPower);
      var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
      var digits = intval.toString(radix);
      rem = remDiv;
      if (rem.isZero()) {
        return digits + result;
      } else {
        while (digits.length < 6) {
          digits = '0' + digits;
        }
        result = '' + digits + result;
      }
    }
  };
  /** @return {number} The high 32-bits as a signed value. */
  goog.math.Long.prototype.getHighBits = function() {
    return this.high_;
  };
  /** @return {number} The low 32-bits as a signed value. */
  goog.math.Long.prototype.getLowBits = function() {
    return this.low_;
  };
  /** @return {number} The low 32-bits as an unsigned value. */
  goog.math.Long.prototype.getLowBitsUnsigned = function() {
    return (this.low_ >= 0) ?
        this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
  };
  /**
   * @return {number} Returns the number of bits needed to represent the absolute
   *     value of this Long.
   */
  goog.math.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return 64;
      } else {
        return this.negate().getNumBitsAbs();
      }
    } else {
      var val = this.high_ != 0 ? this.high_ : this.low_;
      for (var bit = 31; bit > 0; bit--) {
        if ((val & (1 << bit)) != 0) {
          break;
        }
      }
      return this.high_ != 0 ? bit + 33 : bit + 1;
    }
  };
  /** @return {boolean} Whether this value is zero. */
  goog.math.Long.prototype.isZero = function() {
    return this.high_ == 0 && this.low_ == 0;
  };
  /** @return {boolean} Whether this value is negative. */
  goog.math.Long.prototype.isNegative = function() {
    return this.high_ < 0;
  };
  /** @return {boolean} Whether this value is odd. */
  goog.math.Long.prototype.isOdd = function() {
    return (this.low_ & 1) == 1;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long equals the other.
   */
  goog.math.Long.prototype.equals = function(other) {
    return (this.high_ == other.high_) && (this.low_ == other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long does not equal the other.
   */
  goog.math.Long.prototype.notEquals = function(other) {
    return (this.high_ != other.high_) || (this.low_ != other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than the other.
   */
  goog.math.Long.prototype.lessThan = function(other) {
    return this.compare(other) < 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than or equal to the other.
   */
  goog.math.Long.prototype.lessThanOrEqual = function(other) {
    return this.compare(other) <= 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than the other.
   */
  goog.math.Long.prototype.greaterThan = function(other) {
    return this.compare(other) > 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than or equal to the other.
   */
  goog.math.Long.prototype.greaterThanOrEqual = function(other) {
    return this.compare(other) >= 0;
  };
  /**
   * Compares this Long with the given one.
   * @param {goog.math.Long} other Long to compare against.
   * @return {number} 0 if they are the same, 1 if the this is greater, and -1
   *     if the given one is greater.
   */
  goog.math.Long.prototype.compare = function(other) {
    if (this.equals(other)) {
      return 0;
    }
    var thisNeg = this.isNegative();
    var otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }
    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    } else {
      return 1;
    }
  };
  /** @return {!goog.math.Long} The negation of this value. */
  goog.math.Long.prototype.negate = function() {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.MIN_VALUE;
    } else {
      return this.not().add(goog.math.Long.ONE);
    }
  };
  /**
   * Returns the sum of this and the given Long.
   * @param {goog.math.Long} other Long to add to this one.
   * @return {!goog.math.Long} The sum of this and the given Long.
   */
  goog.math.Long.prototype.add = function(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns the difference of this and the given Long.
   * @param {goog.math.Long} other Long to subtract from this.
   * @return {!goog.math.Long} The difference of this and the given Long.
   */
  goog.math.Long.prototype.subtract = function(other) {
    return this.add(other.negate());
  };
  /**
   * Returns the product of this and the given long.
   * @param {goog.math.Long} other Long to multiply with this.
   * @return {!goog.math.Long} The product of this and the other.
   */
  goog.math.Long.prototype.multiply = function(other) {
    if (this.isZero()) {
      return goog.math.Long.ZERO;
    } else if (other.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      } else {
        return this.negate().multiply(other).negate();
      }
    } else if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }
    // If both longs are small, use float multiplication
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
        other.lessThan(goog.math.Long.TWO_PWR_24_)) {
      return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
    }
    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns this Long divided by the given one.
   * @param {goog.math.Long} other Long by which to divide.
   * @return {!goog.math.Long} This Long divided by the given one.
   */
  goog.math.Long.prototype.div = function(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      if (other.equals(goog.math.Long.ONE) ||
          other.equals(goog.math.Long.NEG_ONE)) {
        return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ONE;
      } else {
        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
        var halfThis = this.shiftRight(1);
        var approx = halfThis.div(other).shiftLeft(1);
        if (approx.equals(goog.math.Long.ZERO)) {
          return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        } else {
          var rem = this.subtract(other.multiply(approx));
          var result = approx.add(rem.div(other));
          return result;
        }
      }
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      } else {
        return this.negate().div(other).negate();
      }
    } else if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }
    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    var res = goog.math.Long.ZERO;
    var rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      var log2 = Math.ceil(Math.log(approx) / Math.LN2);
      var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);
      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      var approxRes = goog.math.Long.fromNumber(approx);
      var approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = goog.math.Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }
      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = goog.math.Long.ONE;
      }
      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  };
  /**
   * Returns this Long modulo the given one.
   * @param {goog.math.Long} other Long by which to mod.
   * @return {!goog.math.Long} This Long modulo the given one.
   */
  goog.math.Long.prototype.modulo = function(other) {
    return this.subtract(this.div(other).multiply(other));
  };
  /** @return {!goog.math.Long} The bitwise-NOT of this value. */
  goog.math.Long.prototype.not = function() {
    return goog.math.Long.fromBits(~this.low_, ~this.high_);
  };
  /**
   * Returns the bitwise-AND of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to AND.
   * @return {!goog.math.Long} The bitwise-AND of this and the other.
   */
  goog.math.Long.prototype.and = function(other) {
    return goog.math.Long.fromBits(this.low_ & other.low_,
                                   this.high_ & other.high_);
  };
  /**
   * Returns the bitwise-OR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to OR.
   * @return {!goog.math.Long} The bitwise-OR of this and the other.
   */
  goog.math.Long.prototype.or = function(other) {
    return goog.math.Long.fromBits(this.low_ | other.low_,
                                   this.high_ | other.high_);
  };
  /**
   * Returns the bitwise-XOR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to XOR.
   * @return {!goog.math.Long} The bitwise-XOR of this and the other.
   */
  goog.math.Long.prototype.xor = function(other) {
    return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                   this.high_ ^ other.high_);
  };
  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the left by the given amount.
   */
  goog.math.Long.prototype.shiftLeft = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var low = this.low_;
      if (numBits < 32) {
        var high = this.high_;
        return goog.math.Long.fromBits(
            low << numBits,
            (high << numBits) | (low >>> (32 - numBits)));
      } else {
        return goog.math.Long.fromBits(0, low << (numBits - 32));
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   */
  goog.math.Long.prototype.shiftRight = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >> numBits);
      } else {
        return goog.math.Long.fromBits(
            high >> (numBits - 32),
            high >= 0 ? 0 : -1);
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount, with
   * the new top bits matching the current sign bit.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount, with
   *     zeros placed into the new leading bits.
   */
  goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >>> numBits);
      } else if (numBits == 32) {
        return goog.math.Long.fromBits(high, 0);
      } else {
        return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
      }
    }
  };
  //======= begin jsbn =======
  var navigator = { appName: 'Modern Browser' }; // polyfill a little
  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // http://www-cs-students.stanford.edu/~tjw/jsbn/
  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Basic JavaScript BN library - subset useful for RSA encryption.
  // Bits per digit
  var dbits;
  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary&0xffffff)==0xefcafe);
  // (public) Constructor
  function BigInteger(a,b,c) {
    if(a != null)
      if("number" == typeof a) this.fromNumber(a,b,c);
      else if(b == null && "string" != typeof a) this.fromString(a,256);
      else this.fromString(a,b);
  }
  // return new, unset BigInteger
  function nbi() { return new BigInteger(null); }
  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.
  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
      var v = x*this[i++]+w[j]+c;
      c = Math.floor(v/0x4000000);
      w[j++] = v&0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
      var l = this[i]&0x7fff;
      var h = this[i++]>>15;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
      c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
      w[j++] = l&0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
      var l = this[i]&0x3fff;
      var h = this[i++]>>14;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x3fff)<<14)+w[j]+c;
      c = (l>>28)+(m>>14)+xh*h;
      w[j++] = l&0xfffffff;
    }
    return c;
  }
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1<<dbits)-1);
  BigInteger.prototype.DV = (1<<dbits);
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2,BI_FP);
  BigInteger.prototype.F1 = BI_FP-dbits;
  BigInteger.prototype.F2 = 2*dbits-BI_FP;
  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  function int2char(n) { return BI_RM.charAt(n); }
  function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  }
  // (protected) copy this to r
  function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }
  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0) this[0] = x;
    else if(x < -1) this[0] = x+DV;
    else this.t = 0;
  }
  // return bigint initialized to value
  function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
  // (protected) set from string and radix
  function bnpFromString(s,b) {
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 256) k = 8; // byte array
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else { this.fromRadix(s,b); return; }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
      var x = (k==8)?s[i]&0xff:intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if(sh == 0)
        this[this.t++] = x;
      else if(sh+k > this.DB) {
        this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
        this[this.t++] = (x>>(this.DB-sh));
      }
      else
        this[this.t-1] |= x<<sh;
      sh += k;
      if(sh >= this.DB) sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
      this.s = -1;
      if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c) --this.t;
  }
  // (public) return string representation in given radix
  function bnToString(b) {
    if(this.s < 0) return "-"+this.negate().toString(b);
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
      if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
      while(i >= 0) {
        if(p < k) {
          d = (this[i]&((1<<p)-1))<<(k-p);
          d |= this[--i]>>(p+=this.DB-k);
        }
        else {
          d = (this[i]>>(p-=k))&km;
          if(p <= 0) { p += this.DB; --i; }
        }
        if(d > 0) m = true;
        if(m) r += int2char(d);
      }
    }
    return m?r:"0";
  }
  // (public) -this
  function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
  // (public) |this|
  function bnAbs() { return (this.s<0)?this.negate():this; }
  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0) return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0) return (this.s<0)?-r:r;
    while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
    return 0;
  }
  // returns bit length of the integer x
  function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) { x = t; r += 16; }
    if((t=x>>8) != 0) { x = t; r += 8; }
    if((t=x>>4) != 0) { x = t; r += 4; }
    if((t=x>>2) != 0) { x = t; r += 2; }
    if((t=x>>1) != 0) { x = t; r += 1; }
    return r;
  }
  // (public) return the number of bits in "this"
  function bnBitLength() {
    if(this.t <= 0) return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
  }
  // (protected) r = this << n*DB
  function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
    for(i = n-1; i >= 0; --i) r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
  }
  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i) r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
  }
  // (protected) r = this << n
  function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
      r[i+ds+1] = (this[i]>>cbs)|c;
      c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
  }
  // (protected) r = this >> n
  function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) { r.t = 0; return; }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
      r[i-ds-1] |= (this[i]&bm)<<cbs;
      r[i-ds] = this[i]>>bs;
    }
    if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
  }
  // (protected) r = this - a
  function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]-a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c -= a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c -= a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1) r[i++] = this.DV+c;
    else if(c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }
  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
  }
  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
      var c = x.am(i,x[i],r,2*i,0,1);
      if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
        r[i+x.t] -= x.DV;
        r[i+x.t+1] = 1;
      }
    }
    if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
  }
  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0) return;
    var pt = this.abs();
    if(pt.t < pm.t) {
      if(q != null) q.fromInt(0);
      if(r != null) this.copyTo(r);
      return;
    }
    if(r == null) r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
    if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
    else { pm.copyTo(y); pt.copyTo(r); }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0) return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y);	// "negative" y so we can replace sub with am later
    while(y.t < ys) y[y.t++] = 0;
    while(--j >= 0) {
      // Estimate quotient digit
      var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
      if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
        y.dlShiftTo(j,t);
        r.subTo(t,r);
        while(r[i] < --qd) r.subTo(t,r);
      }
    }
    if(q != null) {
      r.drShiftTo(ys,q);
      if(ts != ms) BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
    if(ts < 0) BigInteger.ZERO.subTo(r,r);
  }
  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
    return r;
  }
  // Modular reduction using "classic" algorithm
  function Classic(m) { this.m = m; }
  function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }
  function cRevert(x) { return x; }
  function cReduce(x) { x.divRemTo(this.m,null,x); }
  function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if(this.t < 1) return 0;
    var x = this[0];
    if((x&1) == 0) return 0;
    var y = x&3;		// y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
  }
  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
  }
  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
    return r;
  }
  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while(x.t <= this.mt2)	// pad x so am has enough room later
      x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i]&0x7fff;
      var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i+this.m.t;
      x[j] += this.m.am(0,u0,x,i,0,this.m.t);
      // propagate carry
      while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
  }
  // r = "x^2/R mod m"; x != r
  function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  // r = "xy/R mod m"; x,y != r
  function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  // (protected) true iff this is even
  function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
      z.sqrTo(r,r2);
      if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
      else { var t = r; r = r2; r2 = t; }
    }
    return z.revert(r);
  }
  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
    return this.exp(e,z);
  }
  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  // jsbn2 stuff
  // (protected) convert from radix string
  function bnpFromRadix(s,b) {
    this.fromInt(0);
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
    for(var i = 0; i < s.length; ++i) {
      var x = intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b*w+x;
      if(++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w,0);
        j = 0;
        w = 0;
      }
    }
    if(j > 0) {
      this.dMultiply(Math.pow(b,j));
      this.dAddOffset(w,0);
    }
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if(this.s < 0) return -1;
    else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }
  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0,n-1,this,0,0,this.t);
    ++this.t;
    this.clamp();
  }
  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n,w) {
    if(n == 0) return;
    while(this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while(this[w] >= this.DV) {
      this[w] -= this.DV;
      if(++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }
  // (protected) convert to radix string
  function bnpToRadix(b) {
    if(b == null) b = 10;
    if(this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b,cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d,y,z);
    while(y.signum() > 0) {
      r = (a+z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d,y,z);
    }
    return z.intValue().toString(b) + r;
  }
  // (public) return value as integer
  function bnIntValue() {
    if(this.s < 0) {
      if(this.t == 1) return this[0]-this.DV;
      else if(this.t == 0) return -1;
    }
    else if(this.t == 1) return this[0];
    else if(this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
  }
  // (protected) r = this + a
  function bnpAddTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]+a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c += a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c += a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c<0)?-1:0;
    if(c > 0) r[i++] = c;
    else if(c < -1) r[i++] = this.DV+c;
    r.t = i;
    r.clamp();
  }
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.addTo = bnpAddTo;
  //======= end jsbn =======
  // Emscripten wrapper
  var Wrapper = {
    abs: function(l, h) {
      var x = new goog.math.Long(l, h);
      var ret;
      if (x.isNegative()) {
        ret = x.negate();
      } else {
        ret = x;
      }
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
    },
    ensureTemps: function() {
      if (Wrapper.ensuredTemps) return;
      Wrapper.ensuredTemps = true;
      Wrapper.two32 = new BigInteger();
      Wrapper.two32.fromString('4294967296', 10);
      Wrapper.two64 = new BigInteger();
      Wrapper.two64.fromString('18446744073709551616', 10);
      Wrapper.temp1 = new BigInteger();
      Wrapper.temp2 = new BigInteger();
    },
    lh2bignum: function(l, h) {
      var a = new BigInteger();
      a.fromString(h.toString(), 10);
      var b = new BigInteger();
      a.multiplyTo(Wrapper.two32, b);
      var c = new BigInteger();
      c.fromString(l.toString(), 10);
      var d = new BigInteger();
      c.addTo(b, d);
      return d;
    },
    stringify: function(l, h, unsigned) {
      var ret = new goog.math.Long(l, h).toString();
      if (unsigned && ret[0] == '-') {
        // unsign slowly using jsbn bignums
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(ret, 10);
        ret = new BigInteger();
        Wrapper.two64.addTo(bignum, ret);
        ret = ret.toString(10);
      }
      return ret;
    },
    fromString: function(str, base, min, max, unsigned) {
      Wrapper.ensureTemps();
      var bignum = new BigInteger();
      bignum.fromString(str, base);
      var bigmin = new BigInteger();
      bigmin.fromString(min, 10);
      var bigmax = new BigInteger();
      bigmax.fromString(max, 10);
      if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
        var temp = new BigInteger();
        bignum.addTo(Wrapper.two64, temp);
        bignum = temp;
      }
      var error = false;
      if (bignum.compareTo(bigmin) < 0) {
        bignum = bigmin;
        error = true;
      } else if (bignum.compareTo(bigmax) > 0) {
        bignum = bigmax;
        error = true;
      }
      var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
      if (error) throw 'range error';
    }
  };
  return Wrapper;
})();
//======= end closure i64 code =======
// === Auto-generated postamble setup entry stuff ===
Module['callMain'] = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(!Module['preRun'] || Module['preRun'].length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  var ret;
  var initialStackTop = STACKTOP;
  try {
    ret = Module['_main'](argc, argv, 0);
  }
  catch(e) {
    if (e.name == 'ExitStatus') {
      return e.status;
    } else if (e == 'SimulateInfiniteLoop') {
      Module['noExitRuntime'] = true;
    } else {
      throw e;
    }
  } finally {
    STACKTOP = initialStackTop;
  }
  return ret;
}
function run(args) {
  args = args || Module['arguments'];
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return 0;
  }
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    var toRun = Module['preRun'];
    Module['preRun'] = [];
    for (var i = toRun.length-1; i >= 0; i--) {
      toRun[i]();
    }
    if (runDependencies > 0) {
      // a preRun added a dependency, run will be called later
      return 0;
    }
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    var ret = 0;
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
      ret = Module['callMain'](args);
      if (!Module['noExitRuntime']) {
        exitRuntime();
      }
    }
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
      while (Module['postRun'].length > 0) {
        Module['postRun'].pop()();
      }
    }
    return ret;
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
    return 0;
  } else {
    return doRun();
  }
}
Module['run'] = Module.run = run;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
  // {{MODULE_ADDITIONS}}

  return result;
}

