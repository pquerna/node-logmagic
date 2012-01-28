var colors = require('mgutz-colors'),
    nsColor = colors.fn("black+h"),
    warnColor = colors.fn("yellow+h"),
    infoColor = colors.fn("cyan+h"),
    errorColor = colors.fn("red+h");
    logColor = colors.fn("white+h");


var levels = [
  ['EMG', errorColor],    // emergency
  ['ALR', errorColor],    // alert
  ['CRT', errorColor],    // critical
  ['ERR', errorColor],
  ['WRN', warnColor],
  ['NTC', warnColor],     // notice
  ['INF', infoColor],
  ['DBG', logColor],
  ['TR1', logColor],
  ['TR2', logColor],
  ['TR3', logColor],
  ['TR4', logColor],
  ['TR5', logColor],
  ['TR6', logColor],
  ['TR7', logColor]
]


exports.register = function(modulename, level, message, obj) {
  if (obj && typeof obj == 'object' && Object.keys(obj).length !== 0) {
    /* TODO: improve */
    var fm = obj['full_message'] ? "\n  " + obj['full_message'] : "";
    obj['full_message'] = undefined;

    message += " " + JSON.stringify(obj) + fm;
  }

  prefix = "["+levels[level][0]+"] ";
  modulename += ": ";
  messageColor = levels[level][1];
  console.log(messageColor(prefix) + nsColor(modulename) +  messageColor(message));
};


exports.setOptions = function(options) {
  if (options.plain) colors.plain = options.plain;
  if (options.nsColor) nsColor = colors.fn(nsColor);
  if (options.warnColor) warnColor = colors.fn(warnColor);
  if (options.infoColor) infoColor = colors.fn(infoColor);
  if (options.errorColor) errorColor = colors.fn(errorColor);
  if (options.logColor) logColor = colors.fn(logColor);
};
