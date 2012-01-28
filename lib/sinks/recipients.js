/*============================================================================
 * Copyright(c) 2010 Mario L Gutierrez <mario@mgutz.com>
 * MIT Licensed
 *==========================================================================*/

function Recipients(options) {
  this.setOptions(options);
  return this;
};


Recipients.prototype.setOptions = function(options) {
  var instanceName, sink;
  this.sinks = [];

  for (var i = 0; i < options.list.length; i++) {
    sink = options.list[i];
    this.sinks.push(sink);
  }
};

Recipients.prototype.callback = function(modulename, level, message, obj) {
  var sink;

  // Need to synchronize this (performance hit), otherwise messages WILL
  // LIKELY BE OUT OF ORDER
  for (var i = 0; i < this.sinks.length; i++) {
    sink = this.sinks[i];
    sink.callback(modulename, level, message, obj);
  }
};


module.exports = Recipients;
