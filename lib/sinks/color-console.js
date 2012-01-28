var colors = require('mgutz-colors');

var schemes = {
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

/* The color functions used by the callback. These are set by `useColorScheme` */
var nsColor,              // namespace, e.g. mgutz.lib.foo
    warnColor,
    infoColor,
    errorColor,
    traceColor,
    levels;

useColorScheme("dark");

/**
 * Uses a color scheme, setting color functions based on the scheme.
 *
 * @param {String|Object} scheme The name of an existing scheme or the
 * definition.
 */
function useColorScheme(scheme) {
  if (typeof scheme === 'string') {
    scheme = schemes[scheme];
    if (!scheme) throw new Error("Scheme not found: "+scheme);
  }

  if (scheme.name && !schemes[scheme.name]) {
    schemes[scheme.name] = scheme;
  }

  // using scheme so must be allowing colors
  colors.plain = false;

  nsColor = colors.fn(scheme.nsColor ? scheme.nsColor : "");
  warnColor = colors.fn(scheme.warnColor ? scheme.warnColor : "");
  infoColor = colors.fn(scheme.infoColor ? scheme.infoColor : "");
  errorColor = colors.fn(scheme.errorColor ? scheme.errorColor : "");
  traceColor = colors.fn(scheme.traceColor ? scheme.traceColor : "");

  levels = [
    ['EMG', errorColor],    // emergency
    ['ALR', errorColor],    // alert
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
}


/**
 * Invoked whenever a message needs to be logged.
 *
 * @param {String} modulename The modulename or namespace.
 * @param {Integer} level The level of this message.
 * @param {String} message The message to be logged.
 * @param {String} obj ???
 */
exports.callback = function(modulename, level, message, obj) {
  /* TODO: improve */
  if (obj && typeof obj == 'object' && Object.keys(obj).length !== 0) {
    var fm = obj['full_message'] ? "\n  " + obj['full_message'] : "";
    obj['full_message'] = undefined;

    message += " " + JSON.stringify(obj) + fm;
  }

  var prefix = "["+levels[level][0]+"] ";
  modulename += ": ";
  var messageColor = levels[level][1];
  console.log(messageColor(prefix) + nsColor(modulename) +  messageColor(message));
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
exports.setOptions = function(options) {
  if (options.plain) colors.plain = options.plain;
  if (options.scheme) {
    useColorScheme(options.scheme);
  }
};


