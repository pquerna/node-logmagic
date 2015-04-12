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

var graylog = require('./graylog');
var console = require('./console');
var Logger = require('./logger');
var levels = require('./levels');

var defaultLogger = null;

exports.local = function(modulename) {
  return defaultLogger.local(modulename);
};

exports.registerSink = function(sinkname, callback) {
  defaultLogger.registerSink(sinkname, callback);
};

exports.route = function(match, loglevel, sinkname) {
  defaultLogger.route(match, loglevel, sinkname);
};

exports.addRewriter = function(func) {
  defaultLogger.addRewriter(func);
};

(function() {
  // re-export log levels.
  levels.strings.forEach(function(l) {
    exports[l] = levels[l];
  });

  defaultLogger = new Logger();
  /* Default Sinks */

  /* This is just here for initial dev work, REMOVE ME */
  exports.registerSink("console", console);
  exports.registerSink("graylog2-stderr", graylog.logstderr);

  /* Default loggers */
  exports.route("__root__", exports.INFO, "console");
})();
