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

function clog(modulename, level, message, obj) {
  var timestamp = (new Date().getTime()) / 1000;

  if (obj && Object.keys(obj).length !== 0) {
    /* TODO: improve */
    var fm = obj['full_message'] ? "\n  " + obj['full_message'] : "";
    obj['full_message'] = undefined;
    console.log(modulename + " [" + timestamp + "]" + ": " + message + " " + JSON.stringify(obj) + fm);
  } else {
    console.log(modulename + " [" + timestamp + "]" + ": " + message);
  }
}

module.exports = exports = clog;

