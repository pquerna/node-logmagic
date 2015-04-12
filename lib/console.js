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

var moment = require('moment');
var chalk = require('chalk');

var levels = require('./levels');

function needsQuoting(text) {
  var ch;
  for (var i = 0; i < text.length; i++) {
    ch = text[i];
    if (ch >= 'a' && ch <= 'z') {
      continue;
    }
    if (ch >= 'A' && ch <= 'Z') {
      continue;
    }
    if (ch >= '0' && ch <= '9') {
      continue
    }
    if (ch == '-' || ch == '.') {
      continue
    }
    return true
  }
  return false
}

function out(key, value) {
  if (typeof value === 'string') {
    if (needsQuoting(value)) {
      process.stdout.write(key + "=" + JSON.stringify(value) + " ");
    } else {
      process.stdout.write(key + "=" + value + " ");
    }
  } else {
    process.stdout.write(key + "=" + JSON.stringify(value) + " ");
  }
}

function clog(options) {
  var useColor = !options.disable_colors;
  var kvout = out;
  if (useColor) {
    return function(modulename, level, message, obj) {
      var m = moment().format("YYYY-MM-DDTHH:mm:ssZ");
      var color = chalk.blue;

      if (level >= levels.DEBUG) {
        color = chalk.gray;
      } else if (level >= levels.WARNING) {
        color = chalk.yellow;
      } else if (level >= levels.ERR) {
        color = chalk.red;
      }

      process.stdout.write(color(levels.strings[level]) + " " + m + " " + message + " ");

      if (obj) {
        var keys = Object.keys(obj);
        if (options.disable_sort) {
          keys.sort();
        }
        for (var i = 0; i < keys.length; i++) {
          kvout(color(keys[i]), obj[keys[i]]);
        }
      }

      process.stdout.write("\n");
    };

  }
  return function(modulename, level, message, obj) {
    var m = moment().format("YYYY-MM-DDTHH:mm:ssZ");

    kvout("time", m);
    kvout("level", levels.strings[level]);
    kvout("msg", message);

    if (obj) {
      var keys = Object.keys(obj);
      if (options.disable_sort) {
        keys.sort();
      }
      for (var i = 0; i < keys.length; i++) {
        kvout(keys[i], obj[keys[i]]);
      }
    }

    process.stdout.write("\n");
    /* TODO: improve */
    //		var fm = obj['full_message'] ? "\n  " + obj['full_message'] : "";
    //		obj['full_message'] = undefined;
  };
}

// TODO(pquerna): expose more options;
module.exports = exports = clog({
  disable_sort: false
});

