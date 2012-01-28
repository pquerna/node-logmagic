var graylog = require("../graylog.js");

function GrayLog2() {
  return this;
}

GrayLog2.prototype.setOptions = function(options) {
    // nothing yet
};

GrayLog2.prototype.callback = function(modulename, level, message, obj) {
  /* Outputs a GLEF-style JSON to stderr */
  var str = graylog.logstr(modulename, level, message, obj);
  process.stderr.write(str + "\n");
};

module.exports = GrayLog2;

