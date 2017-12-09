'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _message = require('./helpers/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Machine, uid;

var postMessage = function postMessage(data) {
  if (window && window.top && window.top.postMessage) {
    var machines = Object.keys(Machine.machines).map(function (name) {
      return { name: name, state: (0, _sanitize2.default)(Machine.machines[name].state) };
    });

    (0, _message2.default)(_extends({ state: machines }, data), uid);
  } else {
    console.error('There is no window.postMessage available');
  }
};
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
  }

  return y;
};

var getMetaInfo = function getMetaInfo(meta) {
  return Object.assign({}, meta, {
    middlewares: Machine.middlewares.length
  });
};

var StentEmitter = {
  __sanitize: _sanitize2.default,
  __formatYielded: formatYielded,
  __message: _message2.default,
  __initialize: function __initialize(m, uniqueId) {
    Machine = m;
    uid = uniqueId;
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
  onMiddlewareRegister: function onMiddlewareRegister() {
    postMessage({
      pageRefresh: true
    });
  }
};

exports.default = StentEmitter;
module.exports = exports['default'];