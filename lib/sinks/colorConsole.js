/*============================================================================
 * Copyright(c) 2010 Mario L Gutierrez <mario@mgutz.com>
 * MIT Licensed
 *==========================================================================*/

var colors = require('mgutz-colors');


/**
 * Logs to the console using colors (which may be disabled).
 *
 * @param {Object} options See `ColorConsole#setOptions`.
 */
function ColorConsole(options) {
  this.schemes = {
    dark: {
      nsColor: "black+h",
      warnColor: "yellow+h",
      infoColor: "cyan+h",
      errorColor: "red+h",
      traceColor: "white+h"
    },

    light: {
      nsColor: "black+h",
      warnColor: "magenta",
      infoColor: "cyan",
      errorColor: "red",
      traceColor: "black"
    }
  };

  if (!options) options = {};

  if (!options.scheme) options.scheme = "dark";
  this.setOptions(options);
  return this;
}


/**
 * Uses a color scheme, setting color functions based on the scheme.
 *
 * @param {String|Object} scheme The name of an existing scheme or the
 * definition.
 */
ColorConsole.prototype.useColorScheme = function(scheme) {
  if (typeof scheme === 'string') {
    this.schemeName = scheme;
    scheme = this.schemes[scheme];
    if (!scheme) throw new Error("Scheme not found: "+scheme);
  } else if (scheme.name && !this.schemes[scheme.name]) {
    this.schemeName = scheme.name;
    this.schemes[scheme.name] = scheme;
  }
  else {
    this.schemeName = "unknown";
  }

  // using scheme so must be allowing colors
  colors.plain = false;

  var nsColor = colors.fn(scheme.nsColor ? scheme.nsColor : ""),
      warnColor = colors.fn(scheme.warnColor ? scheme.warnColor : ""),
      infoColor = colors.fn(scheme.infoColor ? scheme.infoColor : ""),
      errorColor = colors.fn(scheme.errorColor ? scheme.errorColor : ""),
      traceColor = colors.fn(scheme.traceColor ? scheme.traceColor : "");

  this.levels = [
    ['EMG', errorColor],    // emergency
    ['ALT', errorColor],    // alert
    ['CRL', errorColor],    // critical
    ['ERR', errorColor],
    ['WRN', warnColor],
    ['NTC', warnColor],     // notice
    ['INF', infoColor],
    ['DBG', traceColor],
    ['TR1', traceColor],
    ['TR2', traceColor],
    ['TR3', traceColor],
    ['TR4', traceColor],
    ['TR5', traceColor],
    ['TR6', traceColor],
    ['TR7', traceColor]
  ];

  this.nsColor = nsColor;
  this.warnColor = warnColor;
  this.infoColor = infoColor;
  this.errorColor = errorColor;
  this.traceColor = traceColor;
}


/**
 * Invoked whenever a message needs to be logged.
 *
 * @param {String} modulename The modulename or namespace.
 * @param {Integer} level The level of this message.
 * @param {String} message The message to be logged.
 * @param {String} obj ???
 */
ColorConsole.prototype.callback = function(modulename, level, message, obj) {
  /* TODO: improve */
  if (obj && typeof obj == 'object') {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop) && prop !== 'full_message')
            message += "\n  " + prop + ": " + obj[prop];
    }
    var fm = obj['full_message'] ? "\n  " + obj['full_message'] : "";
    message += fm;
  }

  var prefix = "["+this.levels[level][0]+"] ";
  modulename += ": ";
  var messageColor = this.levels[level][1];
  console.log(messageColor(prefix) + this.nsColor(modulename) +  messageColor(message));
};


/**
 * Sets the options for this color-console sink.
 *
 * @param {Object} options An object { plain: boolean, setScheme: string|object }
 *  plain: Set to true to disable colors.
 *  setScheme Can be "dark", "light" or an object
 *    {
 *      nsColor: "",
 *      warnColor: "",
 *      infoColor: "",
 *      errorColor: "",
 *      traceColor: ""
 *    }
 *
 * @example
 *
 *  // disable colors
 *  setOptions({plain: true});
 *
 *  // use predefined or previously set scheme
 *  setOptions({scheme: "dark"});
 *
 *  // customize colors
 *  setOptions({scheme: { name: "custom", nsColor: "black", warnColor: "red+h",
 *    infoColor: "blue+h", errorColor: "red", traceColor: "cyan" });
 */
ColorConsole.prototype.setOptions = function(options) {
  if (options.plain)
    colors.plain = options.plain;
  else if (options.scheme)
    this.useColorScheme(options.scheme);
};


module.exports = ColorConsole;

