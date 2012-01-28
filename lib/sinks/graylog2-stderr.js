var graylog = require("../graylog.js");

module.exports = {
  setOptions: function(options) {
    // nothing yet
  },

  callback: function(modulename, level, message, obj) {
    /* Outputs a GLEF-style JSON to stderr */
    var str = graylog.logstr(modulename, level, message, obj);
    process.stderr.write(str + "\n");
  }
};
