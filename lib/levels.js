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

/* Based on the Log levels available in Apache HTTP Server. */
exports.EMERG = 0; /* system is unusable */
exports.ALERT = 1; /* action must be taken immediately */
exports.CRIT = 2; /* critical conditions */
exports.ERR = 3; /* error conditions */
exports.WARNING = 4; /* warning conditions */
exports.NOTICE = 5; /* normal but significant condition */
exports.INFO = 6; /* informational */
exports.DEBUG = 7; /* debug-level messages */
exports.TRACE1 = 8; /* trace-level 1 messages */
exports.TRACE2 = 9; /* trace-level 2 messages */
exports.TRACE3 = 10; /* trace-level 3 messages */
exports.TRACE4 = 11; /* trace-level 4 messages */
exports.TRACE5 = 12; /* trace-level 5 messages */
exports.TRACE6 = 13; /* trace-level 6 messages */
exports.TRACE7 = 14; /* trace-level 7 messages */
exports.TRACE8 = 15; /* trace-level 8 messages */

var log_strings = ["EMERG",
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

exports.strings = log_strings;

var log_aliases = {
  "WARN": "WARNING",
  "ERROR": "ERR",
  "DBG": "DEBUG",
  "MSG": "INFO",
  "SILLY": "TRACE1",
  "TRACE": "TRACE1"
};

exports.aliases = log_aliases;

