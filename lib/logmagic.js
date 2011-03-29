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

function buildLogMethod(level, callback) {
  return function (msg, extra) {
    callback(level, msg, extra)
  }
}

function nullLogger() {
  /* Intentionally blank. */
}

function applyRoute(route, logger) {
  logger.loglevel = route.loglevel;
  for(var i=0; i<log_levels.length; i++) {
    var level = log_levels[i];
    var v = exports[level];

    if (v <= route.loglevel) {
      logger[level.toLowerCase()] = buildLogMethod(v, route.callback);
    }
    else {
      logger[level.toLowerCase()] = nullLogger;
    }
  }

  for (var key in log_aliases) {
    if (log_aliases.hasOwnProperty(key)) {
      logger[key.toLowerCase()] = logger[log_aliases[key].toLowerCase()];
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
      applyRoute(r, logger);
    }
    else if (routeMatch(r.route, logger.modulename)) {
      applyRoute(r, logger);
    }
  }
}

exports.local = function(modulename) {
  var logger = new LoggerProxy(modulename);
  applyRoutes(logger);
  known_loggers.push(logger);
  return logger;
};

exports.registerSink = function(sinkname, callback) {
  known_sinks[sinkname] = callback;
};

exports.route = function(match, loglevel, sinkname) {

  if (!(loglevel >= exports.EMERG && loglevel <= exports.TRACE8)) {
    throw new Error("Invalid Log level: " + loglevel);
  }

  /* TODO: Maybe it is okay to route before we have a sink loaded (?) */
  if (known_sinks[sinkname] === undefined) {
    throw new Error("Invalid Sink: " + sinkname);
  }

  known_routes.push({route: match, loglevel: loglevel, callback: known_sinks[sinkname]});

  for(var i=0; i<known_loggers.length; i++) {
    var logger = known_loggers[i];
    applyRoutes(logger);
  }
};

(function() {
  /* Default Sinks */

  /* This is just here for initial dev work, REMOVE ME */
  exports.registerSink("console", function(level, message, obj) {
    if (obj) {
      /* TODO: improve */
      console.log(message + " " + JSON.stringify(obj));
    }
    else {
      console.log(message);
    }
  });

  /* Default loggers */
  exports.route("__root__", exports.INFO, "console");
})();
