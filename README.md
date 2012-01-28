Welcome to Log Magic.
====================

This project is usable. It doesn't do everything it should, yet.

The goal is to have a fast and easy to use logging subsystem that can be dynamically
reconfigured to provide insight into production systems.

Logmagic does its magic by generating objects with generated functions that are only modified
when the logging system is reconfigured,  thus your entire logging path is contained within
long-lived functions that V8 is able to JIT.


Getting Started
====================

If you had a file named like, "lib/foo/bar.js", at the top of it, you would put the following:

    var log = require('logmagic').local('mylib.foo.bar');

Then inside bar.js, you would just use the logger like any normal logger:

    log.info("Hello!")
    log.error("By default, format strings are not used.", {SOME_VAR: "myvalue"})
    log.errorf("Just add 'f' to any log method, and you get format strings too: ${SOME_VAR}", {SOME_VAR: "myvalue"})

In any other part of your application, you can reconfigure the logging subsystem at runtime,
making it easy to change log levels for specific modules dynamically.

    /* Register an ad-hoc sink */
    var logmagic = require('logmagic');
    logmagic.registerSink("ad-hoc", {callback: function(module, level, message) { console.log(message); }});

    /* Send Info an higher in the root logger to stdout */
    logmagic.route("__root__", logmagic.INFO, "console")

    /* Reconfigure all children of mylib to log all debug messages to your custom sink */
    logmagic.route("mylib.*", logmagic.DEBUG, "mysink")


Sinks
===============

Sink modules should have this interface

    {
      // the log message callback
      callback: function(modulename, level, message, obj) {}

      // sets options for sink
      setOptions: function(options) {}

      // dispose of resources
      dispose: function() {}
    }

Registering a sink instance

    var fileLog = new logmagic.sinks.File({filename: "/var/log/myapp.log"});
    logmagic.registerSink("main", fileLog);

Setting options on a sink instance

    logmagic.setSinkOptions("colorConsole", {plain: true});

Using multiple sinks

    var fileLog = new logmagic.sinks.File({filename: "/var/log/myapp.log"});
    var color = new logmagic.sinks.ColorConsole({scheme: "dark"});
    var recipients = new logmagic.sinks.Recipients({list: [fileLog, color]});
    logmagic.registerSink("recipients", recipients);

or, use pre-registered sinks
    var sinks = logmagic.getSinkInstances(["console", "fileLog"]);
    new logmagic.sinks.Recipients({list: sinks});

Pre-registered sinks

* `"console"`
* `"colorConsole"`
* `"grayLog2-stderr"`

Built-in sinks

* `Recipients`: log to a list of sinks
* `File`: log to a file
* `ColorConsole`: log to console with colors (may be disabled)
* `Console`: log to console (lightweight)
* `GrayLog2`: Graylog2-style JSON to stderr

Future features:

* Facebook Scribe: https://github.com/facebook/scribe
* Unix Socket
* Syslog


See `tests/t.js` for an example.
