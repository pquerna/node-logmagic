function Console() {
  return this;
};


Console.prototype.setOptions = function(options) {
    // nothing  todo
};

Console.prototype.callback = function(modulename, level, message, obj) {
  if (obj && Object.keys(obj).length !== 0) {
    /* TODO: improve */
    var fm = obj['full_message'] ? "\n  " + obj['full_message'] : "";
    obj['full_message'] = undefined;
    console.log(modulename +": "+ message + " " + JSON.stringify(obj) + fm);
  }
  else {
    console.log(modulename +": "+ message);
  }
};



module.exports = Console;
