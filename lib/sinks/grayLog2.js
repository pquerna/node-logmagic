var graylog = require("../graylog.js");

function GrayLog2() {
  return this;
}

GrayLog2.prototype.setOptions = function(options) {
  options = options || {};

  options.transport = (options.transport) ? options.transport : 'stderr';

  if (['stderr', 'udp'].indexOf(options.transport) === -1) {
    throw new Error('Invalid transports: ' + options.transport);
  }

  if (options.transport === 'udp' && !(options.client || options.host || options.port)) {
    throw new Error('When using UDP transport, "client", "host" and "port" options need to be provided');
  }

  this.options = options;
  return this;
};

GrayLog2.prototype.callback = function(modulename, level, message, obj) {
  var str = graylog.logstr(modulename, level, message, obj);

  if (this.options.transport === 'stderr') {
    /* Outputs a GLEF-style JSON to stderr */
    process.stderr.write(str + '\n');
  }
  else if (this.options.transport === 'udp') {
    /* Outputs a GLEF-style JSON to UDP socket */
    messageBuffer = new Buffer(str);

    try {
      this.options.client.send(messageBuffer, 0, messageBuffer.length, this.options.port, this.options.host);
    }
    catch (err) {}
  }
};

module.exports = GrayLog2;

