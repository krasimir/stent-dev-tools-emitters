(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.StentEmitter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Machine;

var formatYielded = function formatYielded(yielded) {
  var y = yielded;

  if (yielded && yielded.__type === 'call') {
    var funcName = yielded.func.name;

    if (funcName === '') {
      funcName = '<anonymous>';
    };
    try {
      y = (0, _sanitize2.default)(yielded);
    } catch (error) {
      y = { __type: 'call' };
    }
    y.func = funcName;
  } else {
    y = (0, _sanitize2.default)(y);
  }

  return y;
};

var getMetaInfo = function getMetaInfo(meta) {
  return Object.assign({}, meta, {
    middlewares: Machine.middlewares.length
  });
};

var StentEmitter = function StentEmitter() {
  var message = (0, _createMessenger2.default)('StentEmitter');
  var postMessage = function postMessage(data) {
    var machines = Object.keys(Machine.machines).map(function (name) {
      return { name: name, state: (0, _sanitize2.default)(Machine.machines[name].state) };
    });

    message(_extends({ state: machines }, data));
  };

  return {
    __sanitize: _sanitize2.default,
    __formatYielded: formatYielded,
    __message: message,
    __initialize: function __initialize(m) {
      Machine = m;
    },
    onMachineCreated: function onMachineCreated(machine) {
      postMessage({
        type: 'onMachineCreated',
        machine: (0, _sanitize2.default)(machine),
        meta: getMetaInfo()
      });
    },
    onActionDispatched: function onActionDispatched(actionName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      postMessage({
        type: 'onActionDispatched',
        actionName: actionName,
        args: (0, _sanitize2.default)(args),
        machine: (0, _sanitize2.default)(this),
        meta: getMetaInfo()
      });
    },
    onActionProcessed: function onActionProcessed(actionName) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      postMessage({
        type: 'onActionProcessed',
        actionName: actionName,
        args: (0, _sanitize2.default)(args),
        machine: (0, _sanitize2.default)(this),
        meta: getMetaInfo()
      });
    },
    onStateWillChange: function onStateWillChange() {
      postMessage({
        type: 'onStateWillChange',
        machine: (0, _sanitize2.default)(this),
        meta: getMetaInfo()
      });
    },
    onStateChanged: function onStateChanged() {
      postMessage({
        type: 'onStateChanged',
        machine: (0, _sanitize2.default)(this),
        meta: getMetaInfo()
      });
    },
    onGeneratorStep: function onGeneratorStep(yielded) {
      postMessage({
        type: 'onGeneratorStep',
        yielded: formatYielded(yielded),
        meta: getMetaInfo()
      });
    },
    onGeneratorEnd: function onGeneratorEnd(value) {
      postMessage({
        type: 'onGeneratorEnd',
        value: (0, _sanitize2.default)(value),
        meta: getMetaInfo()
      });
    },
    onGeneratorResumed: function onGeneratorResumed(value) {
      postMessage({
        type: 'onGeneratorResumed',
        value: (0, _sanitize2.default)(value),
        meta: getMetaInfo()
      });
    },
    onMachineConnected: function onMachineConnected(machines, meta) {
      postMessage({
        type: 'onMachineConnected',
        meta: getMetaInfo(_extends({}, meta, { machines: (0, _sanitize2.default)(machines) }))
      });
    },
    onMachineDisconnected: function onMachineDisconnected(machines, meta) {
      postMessage({
        type: 'onMachineDisconnected',
        meta: getMetaInfo(_extends({}, meta, { machines: (0, _sanitize2.default)(machines) }))
      });
    },
    onMiddlewareRegister: function onMiddlewareRegister() {}
  };
};

exports.default = StentEmitter;
module.exports = exports['default'];
},{"./helpers/createMessenger":2,"./helpers/sanitize":3}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createMessenger;
/* eslint-disable vars-on-top */
var PORT = exports.PORT = 8228;
var KUKER_EVENT = 'kuker-event';
var NODE_ORIGIN = 'node (PORT: ' + PORT + ')';

var isDefined = function isDefined(what) {
  return typeof what !== 'undefined';
};

function getOrigin() {
  if (isDefined(location) && isDefined(location.protocol) && isDefined(location.host)) {
    return location.protocol + '//' + location.host;
  }
  return 'unknown';
}

var messagesBeforeSetup = [];
var connections = null;
var app = null;
var isThereAnySocketServer = function isThereAnySocketServer() {
  return app !== null;
};
var isTheServerReady = false;

function createMessenger(emitterName) {
  var emitterDescription = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';


  function enhanceEvent(origin, data) {
    return _extends({
      kuker: true,
      time: new Date().getTime(),
      origin: origin,
      emitter: emitterName
    }, data);
  }
  var socketPostMessage = function socketPostMessage(data) {
    if (isThereAnySocketServer() && connections !== null) {
      Object.keys(connections).forEach(function (id) {
        return connections[id].emit(KUKER_EVENT, [enhanceEvent(NODE_ORIGIN, data)]);
      });
    } else {
      messagesBeforeSetup.push(data);
    }
  };
  var browserPostMessage = function browserPostMessage(data) {
    window.postMessage(enhanceEvent(getOrigin(), data), '*');
  };

  // in node
  if (typeof window === 'undefined') {
    if (isThereAnySocketServer()) {
      socketPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
    } else {
      if (isTheServerReady) {
        return socketPostMessage;
      }
      var r = 'require';
      var socketIO = module[r]('socket.io');
      var http = module[r]('http');

      app = http.createServer(function (req, res) {
        res.writeHead(200);
        res.end('Kuker: Hi!');
      });
      var io = socketIO(app);

      io.on('connection', function (socket) {
        if (connections === null) connections = {};
        connections[socket.id] = socket;
        socket.on('disconnect', function (reason) {
          delete connections[socket.id];
        });
        // the very first client receives the pending messages
        // for the rest ... sorry :)
        if (messagesBeforeSetup.length > 0) {
          socketPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
          messagesBeforeSetup.forEach(function (data) {
            return socketPostMessage(data);
          });
          messagesBeforeSetup = [];
        }
        console.log('Kuker(Messenger): client connected (' + Object.keys(connections).length + ' in total)');
      });

      app.listen(PORT);
      isTheServerReady = true;
      console.log('Kuker(Messenger): server running at ' + PORT);
    }

    return socketPostMessage;
  }

  // in the browser
  browserPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
  return browserPostMessage;
};
},{}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = sanitize;

var _CircularJSON = require('./vendors/CircularJSON');

var _SerializeError = require('./vendors/SerializeError');

var _SerializeError2 = _interopRequireDefault(_SerializeError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sanitize(something) {
  var showErrorInConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result;

  try {
    result = JSON.parse((0, _CircularJSON.stringify)(something, function (key, value) {
      if (typeof value === 'function') {
        return value.name === '' ? '<anonymous>' : 'function ' + value.name + '()';
      }
      if (value instanceof Error) {
        return (0, _SerializeError2.default)(value);
      }
      return value;
    }, undefined, true));
  } catch (error) {
    if (showErrorInConsole) {
      console.log(error);
    }
    result = null;
  }
  return result;
}
module.exports = exports['default'];
},{"./vendors/CircularJSON":4,"./vendors/SerializeError":5}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable */
/*!
Copyright (C) 2013-2017 by Andrea Giammarchi - @WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var
// should be a not so common char
// possibly one JSON does not encode
// possibly one encodeURIComponent does not encode
// right now this char is '~' but this might change in the future
specialChar = '~',
    safeSpecialChar = '\\x' + ('0' + specialChar.charCodeAt(0).toString(16)).slice(-2),
    escapedSafeSpecialChar = '\\' + safeSpecialChar,
    specialCharRG = new RegExp(safeSpecialChar, 'g'),
    safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),
    safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar),
    indexOf = [].indexOf || function (v) {
  for (var i = this.length; i-- && this[i] !== v;) {}
  return i;
},
    $String = String // there's no way to drop warnings in JSHint
// about new String ... well, I need that here!
// faked, and happy linter!
;

function generateReplacer(value, replacer, resolve) {
  var inspect = !!replacer,
      path = [],
      all = [value],
      seen = [value],
      mapp = [resolve ? specialChar : '<circular>'],
      last = value,
      lvl = 1,
      i,
      fn;
  if (inspect) {
    fn = (typeof replacer === 'undefined' ? 'undefined' : _typeof(replacer)) === 'object' ? function (key, value) {
      return key !== '' && replacer.indexOf(key) < 0 ? void 0 : value;
    } : replacer;
  }
  return function (key, value) {
    // the replacer has rights to decide
    // if a new object should be returned
    // or if there's some key to drop
    // let's call it here rather than "too late"
    if (inspect) value = fn.call(this, key, value);

    // did you know ? Safari passes keys as integers for arrays
    // which means if (key) when key === 0 won't pass the check
    if (key !== '') {
      if (last !== this) {
        i = lvl - indexOf.call(all, this) - 1;
        lvl -= i;
        all.splice(lvl, all.length);
        path.splice(lvl - 1, path.length);
        last = this;
      }
      // console.log(lvl, key, path);
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value) {
        // if object isn't referring to parent object, add to the
        // object path stack. Otherwise it is already there.
        if (indexOf.call(all, value) < 0) {
          all.push(last = value);
        }
        lvl = all.length;
        i = indexOf.call(seen, value);
        if (i < 0) {
          i = seen.push(value) - 1;
          if (resolve) {
            // key cannot contain specialChar but could be not a string
            path.push(('' + key).replace(specialCharRG, safeSpecialChar));
            mapp[i] = specialChar + path.join(specialChar);
          } else {
            mapp[i] = mapp[0];
          }
        } else {
          value = mapp[i];
        }
      } else {
        if (typeof value === 'string' && resolve) {
          // ensure no special char involved on deserialization
          // in this case only first char is important
          // no need to replace all value (better performance)
          value = value.replace(safeSpecialChar, escapedSafeSpecialChar).replace(specialChar, safeSpecialChar);
        }
      }
    }
    return value;
  };
}

function retrieveFromPath(current, keys) {
  for (var i = 0, length = keys.length; i < length; current = current[
  // keys should be normalized back here
  keys[i++].replace(safeSpecialCharRG, specialChar)]) {}
  return current;
}

function generateReviver(reviver) {
  return function (key, value) {
    var isString = typeof value === 'string';
    if (isString && value.charAt(0) === specialChar) {
      return new $String(value.slice(1));
    }
    if (key === '') value = regenerate(value, value, {});
    // again, only one needed, do not use the RegExp for this replacement
    // only keys need the RegExp
    if (isString) value = value.replace(safeStartWithSpecialCharRG, '$1' + specialChar).replace(escapedSafeSpecialChar, safeSpecialChar);
    return reviver ? reviver.call(this, key, value) : value;
  };
}

function regenerateArray(root, current, retrieve) {
  for (var i = 0, length = current.length; i < length; i++) {
    current[i] = regenerate(root, current[i], retrieve);
  }
  return current;
}

function regenerateObject(root, current, retrieve) {
  for (var key in current) {
    if (current.hasOwnProperty(key)) {
      current[key] = regenerate(root, current[key], retrieve);
    }
  }
  return current;
}

function regenerate(root, current, retrieve) {
  return current instanceof Array ?
  // fast Array reconstruction
  regenerateArray(root, current, retrieve) : current instanceof $String ?
  // root is an empty string
  current.length ? retrieve.hasOwnProperty(current) ? retrieve[current] : retrieve[current] = retrieveFromPath(root, current.split(specialChar)) : root : current instanceof Object ?
  // dedicated Object parser
  regenerateObject(root, current, retrieve) :
  // value as it is
  current;
}

function stringifyRecursion(value, replacer, space, doNotResolve) {
  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
}

function parseRecursion(text, reviver) {
  return JSON.parse(text, generateReviver(reviver));
}

exports.default = {
  stringify: stringifyRecursion,
  parse: parseRecursion
};
module.exports = exports['default'];
},{}],5:[function(require,module,exports){
/* eslint-disable */
// Credits: https://github.com/sindresorhus/serialize-error

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (value) {
	if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
		return destroyCircular(value, []);
	}

	// People sometimes throw things besides Error objects, so…

	if (typeof value === 'function') {
		// JSON.stringify discards functions. We do too, unless a function is thrown directly.
		return '[Function: ' + (value.name || 'anonymous') + ']';
	}

	return value;
};

// https://www.npmjs.com/package/destroy-circular
function destroyCircular(from, seen) {
	var to = Array.isArray(from) ? [] : {};

	seen.push(from);

	for (var _iterator = Object.keys(from), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var key = _ref;

		var value = from[key];

		if (typeof value === 'function') {
			continue;
		}

		if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
			to[key] = value;
			continue;
		}

		if (seen.indexOf(from[key]) === -1) {
			to[key] = destroyCircular(from[key], seen.slice(0));
			continue;
		}

		to[key] = '[Circular]';
	}

	if (typeof from.name === 'string') {
		to.name = from.name;
	}

	if (typeof from.message === 'string') {
		to.message = from.message;
	}

	if (typeof from.stack === 'string') {
		to.stack = from.stack;
	}

	return to;
}
},{}]},{},[1])(1)
});