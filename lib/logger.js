/**
 *  Copyright 2015 Paul Querna
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

var util = require('util');
var events = require('events');

var levels = require('./levels');

function LoggerProxy(modulename) {
  events.EventEmitter.call(this);
  this.modulename = modulename;
  this.loglevel = -1;
}
util.inherits(Logger, events.EventEmitter);

function Logger() {
  events.EventEmitter.call(this);
  this._sinks = {};
  this._loggers = [];
  this._routes = [];
  this._rewriters = [];
}
util.inherits(Logger, events.EventEmitter);

module.exports = exports = Logger;

Logger.prototype._applyRewrites = function(modulename, level, msg, extra) {
  var i;
  for (i = 0; i < this._rewriters.length; i++) {
    extra = this._rewriters[i](modulename, level, msg, extra);
  }
  return extra;
};

Logger.prototype._buildLogMethod = function(modulename, level, callback) {
  var self = this;

  if (level >= levels.TRACE1) {
    return function(msg, extra) {
      if (!extra) {
        extra = {};
      }
      extra['full_message'] = new Error('Backtrace').stack;
      extra = self._applyRewrites(modulename, level, msg, extra);
      callback(modulename, level, msg, extra)
    }
  } else {
    return function(msg, extra) {
      if (!extra) {
        extra = {};
      }
      extra = self._applyRewrites(modulename, level, msg, extra);
      callback(modulename, level, msg, extra)
    }
  }
};

var format_string_re = new RegExp(/\$\{(.*?)\}/g);

function applyFormatString(msg, extra) {
  function replaceFunction(str, p1) {
    if (extra.hasOwnProperty(p1)) {
      return extra[p1];
    }
    return p1;
  }
  msg = msg.replace(format_string_re, replaceFunction);
  return msg;
}
;


Logger.prototype._buildFormattedLogMethod = function(modulename, level, callback) {
  var self = this;
  if (level >= exports.TRACE1) {
    return function(msg, extra) {
      if (!extra) {
        extra = {};
      }
      extra['full_message'] = new Error('Backtrace').stack;
      extra = self._applyRewrites(modulename, level, msg, extra);
      msg = applyFormatString(msg, extra);
      callback(modulename, level, msg, extra)
    }
  } else {
    return function(msg, extra) {
      if (!extra) {
        extra = {};
      }
      extra = self._applyRewrites(modulename, level, msg, extra);
      msg = applyFormatString(msg, extra);
      callback(modulename, level, msg, extra)
    }
  }
};

function nullLogger() {
  /* Intentionally blank. */
}

Logger.prototype._applyRoute = function(route, logger, modulename) {
  logger.loglevel = route.loglevel;
  for (var i = 0; i < levels.strings.length; i++) {
    var level = levels.strings[i];
    var lognum = levels[level];
    var llstr = level.toLowerCase();

    if (lognum <= route.loglevel) {
      logger[llstr] = this._buildLogMethod(modulename, lognum, route.callback);
      logger[llstr + 'f'] = this._buildFormattedLogMethod(modulename, lognum, route.callback);
    } else {
      logger[llstr] = nullLogger;
      logger[llstr + 'f'] = nullLogger;
    }
  }

  for (var key in levels.aliases) {
    if (levels.aliases.hasOwnProperty(key)) {
      logger[key.toLowerCase()] = logger[levels.aliases[key].toLowerCase()];
      logger[key.toLowerCase() + 'f'] = logger[levels.aliases[key].toLowerCase() + 'f'];
    }
  }
};

// TODO: rewrite with a real route matcher
function routeMatch(a, b) {
  var as = a.split('.');
  var bs = b.split('.');
  var i = 0;

  while (true) {
    if (as.length < i || bs.length < i) {
      break;
    }
    if (as[i] == bs[i]) {
      if (as.length == i) {
        return true;
      }
      i++;
      continue;
    }

    if (as[i] == "*") {
      return true;
    }

    break;
  }
  return false;
}


Logger.prototype._applyRoutes = function(logger) {
  for (var i = 0; i < this._routes.length; i++) {
    var r = this._routes[i];
    if (r.route == "__root__") {
      this._applyRoute(r, logger, logger.modulename);
    } else if (routeMatch(r.route, logger.modulename)) {
      this._applyRoute(r, logger, logger.modulename);
    }
  }
};


Logger.prototype.local = function(modulename) {
  var logProxy = new LoggerProxy(modulename);
  this._applyRoutes(logProxy);
  this._loggers.push(logProxy);
  return logProxy;
};


Logger.prototype.registerSink = function(sinkname, callback) {
  this._sinks[sinkname] = callback;
};


Logger.prototype.route = function(match, loglevel, sinkname) {
  if (!(loglevel >= levels.EMERG && loglevel <= levels.TRACE8)) {
    throw new Error("Invalid Log level: " + loglevel);
  }

  /* TODO: Maybe it is okay to route before we have a sink loaded (?) */
  if (this._sinks[sinkname] === undefined) {
    throw new Error("Invalid Sink: " + sinkname);
  }

  this._routes.push({
    route: match,
    loglevel: loglevel,
    callback: this._sinks[sinkname]
  });

  for (var i = 0; i < this._loggers.length; i++) {
    var logger = this._loggers[i];
    this._applyRoutes(logger);
  }
};

Logger.prototype.addRewriter = function(func) {
  this._rewriters.push(func);
};

