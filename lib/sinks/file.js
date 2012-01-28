/*============================================================================
 * Copyright(c) 2010 Mario L Gutierrez <mario@mgutz.com>
 * MIT Licensed
 *==========================================================================*/

var fs = require("fs");
var levels = [
  'EMG',    // emergency
  'ALR',    // alert
  'CRL',    // critical
  'ERR',
  'WRN',
  'NTC',     // notice
  'INF',
  'DBG',
  'TR1',
  'TR2',
  'TR3',
  'TR4',
  'TR5',
  'TR6',
  'TR7'
];


/**
 * Creates an instance of this sink.
 *
 * @param {Object} options The options. `options.filename` is REQUIRED.
 */
function FileSink(options) {
  this.setOptions(options);
  return this;
};


/**
 * Invoked whenever a message needs to be logged.
 *
 * @param {String} modulename The modulename or namespace.
 * @param {Integer} level The level of this message.
 * @param {String} message The message to be logged.
 * @param {String} obj ???
 */
FileSink.prototype.callback = function(modulename, level, message, obj) {
  /* TODO: improve */
  if (obj && typeof obj == 'object' && Object.keys(obj).length !== 0) {
    var fm = obj['full_message'] ? "\n  " + obj['full_message'] : "";
    obj['full_message'] = undefined;

    message += " " + JSON.stringify(obj) + fm;
  }

  var prefix = "\n["+levels[level]+"] ";
  modulename += ": ";
  this.writer.write(prefix + modulename + message);
};


/**
 * Sets the options for this sink.
 *
 * @param {Object} options The options `{filename: "path to log file"}`
 *
 * @example
 *  setOptions({file: "/var/log/myapp.log"});
 */
FileSink.prototype.setOptions = function(options) {
  if (options.filename) this.useFile(options.filename);
};


/**
 * Disposes of resources used by this sink.
 */
FileSink.prototype.dispose = function() {
  if (this.writer) {
    this.writer.end();
    this.writer.destroySoon();
    this.writer = null;
  }
}


/**
 * Creates a write stream and keeps it open until `dispose` is called.
 *
 * @param {String} filename The output file.
 */
FileSink.prototype.useFile = function(filename) {
  this.dispose();
  this.filename = filename;
  this.writer = fs.createWriteStream(filename, {
      flags: "a",
      encoding: "utf8",
      mode: 0666
  });
}


module.exports = FileSink;
