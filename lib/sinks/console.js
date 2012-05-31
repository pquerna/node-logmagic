function Console() {
  return this;
};


Console.prototype.setOptions = function(options) {
    // nothing  todo
};

Console.prototype.callback = function(modulename, level, message, obj) {
  if (obj && typeof obj == 'object') {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop) && prop !== 'full_message')
            message += "\n  " + prop + ": " + obj[prop];
    }
    var fm = obj['full_message'] ? "\n  " + obj['full_message'] : "";
    message += fm;
  }
  console.log(modulename +": "+ message);
};


module.exports = Console;
