/*
 * Licensed to Paul Querna under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * Paul Querna licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require('fs'),
    path = require('path'),
    util = require('util');

function LoggerProxy(modulename) {
  this.modulename =  modulename;
  this.loglevel = -1;
}

/* Based on the Log levels available in Apache HTTP Server. */
exports.EMERG = 0;    /* system is unusable */
exports.ALERT = 1;    /* action must be taken immediately */
exports.CRIT = 2;     /* critical conditions */
exports.ERR = 3;      /* error conditions */
exports.WARNING = 4;  /* warning conditions */
exports.NOTICE = 5;   /* normal but significant condition */
exports.INFO = 6;     /* informational */
exports.DEBUG = 7;    /* debug-level messages */
exports.TRACE1 = 8;   /* trace-level 1 messages */
exports.TRACE2 = 9;   /* trace-level 2 messages */
exports.TRACE3 = 10;  /* trace-level 3 messages */
exports.TRACE4 = 11;  /* trace-level 4 messages */
exports.TRACE5 = 12;  /* trace-level 5 messages */
exports.TRACE6 = 13;  /* trace-level 6 messages */
exports.TRACE7 = 14;  /* trace-level 7 messages */
exports.TRACE8 = 15;  /* trace-level 8 messages */

var log_levels = ["EMERG",
                  "ALERT",
                  "CRIT",
                  "ERR",
                  "WARNING",
                  "NOTICE",
                  "INFO",
                  "DEBUG",
                  "TRACE1",
                  "TRACE2",
                  "TRACE3",
                  "TRACE4",
                  "TRACE5",
                  "TRACE6",
                  "TRACE7",
                  "TRACE8"];

var log_aliases = {"WARN": "WARNING",
                   "ERROR": "ERR",
                   "DBG": "DEBUG",
                   "MSG": "INFO",
                   "TRACE": "TRACE1"};

var known_sinks = {};
var known_loggers = [];
var known_routes = [];
var rewriters = [];

function applyRewrites(modulename, level, msg, extra) {
  var i;
  for (i = 0; i < rewriters.length; i++) {
    extra = rewriters[i](modulename, level, msg, extra);
  }
  return extra;
}

function buildLogMethod(modulename, level, callback) {
  if (level >= exports.TRACE1) {
    return function (msg, extra) {
      if (!extra) {
        extra = {};
      }
      extra['full_message'] = new Error('Backtrace').stack;
      extra = applyRewrites(modulename, level, msg, extra);
      callback(modulename, level, msg, extra);
    }
  }
  else {
    return function (msg, extra) {
      if (!extra) {
        extra = {};
      }
      extra = applyRewrites(modulename, level, msg, extra);
      callback(modulename, level, msg, extra);
    }
  }
}


function applyFormatString(msg, extra) {
  function replaceFunction(str, p1) {
    if (extra.hasOwnProperty(p1)) {
      return extra[p1];
    }

    return p1;
  }
  var regex = new RegExp(/\$\{(.*?)\}/g);
  msg = msg.replace(regex, replaceFunction);
  return msg;
}

function buildFormattedLogMethod(modulename, level, callback) {
  if (level >= exports.TRACE1) {
    return function (msg, extra) {
      if (!extra) {
        extra = {};
      }
      extra['full_message'] = new Error('Backtrace').stack;
      extra = applyRewrites(modulename, level, msg, extra);
      msg = applyFormatString(msg, extra);
      callback(modulename, level, msg, extra);
    }
  }
  else {
    return function (msg, extra) {
      if (!extra) {
        extra = {};
      }
      extra = applyRewrites(modulename, level, msg, extra);
      msg = applyFormatString(msg, extra);
      callback(modulename, level, msg, extra);
    }
  }
}


function nullLogger() {
  /* Intentionally blank. */
}

function applyRoute(route, logger, modulename) {
  logger.loglevel = route.loglevel;
  for(var i=0; i<log_levels.length; i++) {
    var level = log_levels[i];
    var v = exports[level];
    var llstr = level.toLowerCase();

    if (v <= route.loglevel) {
      logger[llstr] = buildLogMethod(modulename, v, route.callback);
      logger[llstr + 'f'] = buildFormattedLogMethod(modulename, v, route.callback);
    }
    else {
      logger[llstr] = nullLogger;
      logger[llstr + 'f'] = nullLogger;
    }
  }

  for (var key in log_aliases) {
    if (log_aliases.hasOwnProperty(key)) {
      logger[key.toLowerCase()] = logger[log_aliases[key].toLowerCase()];
      logger[key.toLowerCase() + 'f'] = logger[log_aliases[key].toLowerCase() + 'f'];
    }
  }
}

function routeMatch(a, b) {
  var as = a.split('.');
  var bs = b.split('.');
  var i = 0;

  while(true) {
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

function applyRoutes(logger) {
  for(var i=0; i < known_routes.length; i++) {
    var r = known_routes[i];
    if (r.route == "__root__") {
      applyRoute(r, logger, logger.modulename);
    }
    else if (routeMatch(r.route, logger.modulename)) {
      applyRoute(r, logger, logger.modulename);
    }
  }
}

exports.local = function(modulename) {
  var logger = new LoggerProxy(modulename);
  applyRoutes(logger);
  known_loggers.push(logger);
  return logger;
};


/* from coffee-script :) */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };


/**
 * Registers a sink.
 *
 * @param {String} instanceName
 * @param {Object|Function} sink If the sink is a function, then an ad-hoc
 * sink is created with the `sink` as the callback. Otherwise, `sink` is
 * assumed to be an object that has a `sink` interface.
 */
exports.registerSink = function(instanceName, sink) {
  if (typeof sink === 'function') {
    sink = {
      name: "ad-hoc",
      callback: sink
    }
  }

  known_sinks[instanceName] = sink;
  sink.instanceName = instanceName;

  /* ad-hoc sinks will likely only have a callback, so default others */
  if (!sink.setOptions) sink.setOptions = function() {};
  if (!sink.dispose) sink.dispose = function() {};

  /* ensure callback is bound to sink */
  sink.callback = __bind(sink.callback, sink);
};

exports.route = function(match, loglevel, sinkname) {

  if (!(loglevel >= exports.EMERG && loglevel <= exports.TRACE8)) {
    throw new Error("Invalid Log level: " + loglevel);
  }

  /* TODO: Maybe it is okay to route before we have a sink loaded (?) */
  if (known_sinks[sinkname] === undefined) {
    throw new Error("Invalid Sink: " + sinkname);
  }

  known_routes.push({route: match, loglevel: loglevel, callback: known_sinks[sinkname].callback});

  for(var i=0; i<known_loggers.length; i++) {
    var logger = known_loggers[i];
    applyRoutes(logger);
  }
};

exports.addRewriter = function(func) {
  rewriters.push(func);
};

exports.clearRewriter = function(func) {
  rewriters.pop(func);
};


exports.setSinkOptions = function(instanceName, options) {
  known_sinks[instanceName].setOptions(options);
};


/**
 * The built-in sink classes.
 */
var sinks = exports.sinks = {};


/**
 * Get sink instances by name.
 *
 * @param {String|Array} names The instance names of sinks.
 * @return Returns an array of sink instances.
 */
exports.getSinkInstances = function(names) {
  if (typeof names === 'string')
    return [known_sinks[names]];
  else if (util.isArray(names)) {
    var result = [];
    for (var i = 0; i < names.length; i++) {
      result.push(known_sinks[names[i]]);
    }
    return result;
  }
};


/* LogMagic looks way too complicated. Create simple factory functions. */

/* Creates and registers a new FileSink */
exports.registerFileSink = function(instanceName, filename) {
  var instance = new sinks.File({filename: filename});
  exports.registerSink(instanceName, instance);
  return instance;
};

/* Creates and registers a new Recipients sink */
exports.registerRecipientsSink = function(instanceName, sinkInstances) {
  var list = [],
      name;

  for (var i = 0; i < sinkInstances.length; i++) {
    name = sinkInstances[i];
    if (typeof name === 'string')
      list.push(known_sinks[name]);
    else {
      if (!name.callback) throw new Error("Invalid sink instance: " + name);
      list.push(name);
    }
  }

  var instance = new sinks.Recipients({list: list});
  exports.registerSink(instanceName, instance);

  return instance;
};

/* Creates and registers a new ColorConsoleSink */
exports.registerConsoleSink = function(instanceName, scheme) {
  var instance = new sinks.ColorConsole({scheme: scheme});
  exports.registerSink(instanceName, instance);
  return instance;
};


(function() {
  var file, name, sink;

  var files = fs.readdirSync(__dirname + "/sinks");

  /* Export sinks */
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    if (file.match(/\.js$/)) {
      name = path.basename(file, '.js');
      sink = require("./sinks/" + name);

      /* export the class with first letter capitalized */
      klass = name.charAt(0).toUpperCase() + name.slice(1);
      exports.sinks[klass] = sink;

      /* Sinks starting to have too many properties, add defaults for missing */
      if (!sink.prototype.name) sink.prototype.name = klass;
      if (!sink.prototype.setOptions) sink.prototype.setOptions = function() {};
      if (!sink.prototype.dispose) sink.prototype.dispose = function() {};
    }
  }

  /* Register sinks whom do not need options */
  exports.registerSink("console", new exports.sinks.Console);
  exports.registerSink("colorConsole", new exports.sinks.ColorConsole);
  exports.registerSink("graylog2-stderr", new exports.sinks.GrayLog2);

  /* Default loggers */
  exports.route("__root__", exports.INFO, "console");
})();
