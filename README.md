# Welcome to Log Magic.

This project is usable. It doesn't do everything it should, yet.

The goal is to have a fast and easy to use logging subsystem that can be dynamically
reconfigured to provide insight into production systems.

Logmagic does its magic by generating objects with generated functions that are only modified
when the logging system is reconfigured,  thus your entire logging path is contained within
long-lived functions that V8 is able to JIT.

## Compatibility

This library works with Node.js and the browser. To use it will the browser,
simply include ``dist/logmagic.js`` file on the website or install it using
[bower](http://bower.io/):

```bash
bower install logmagic
```

## Getting Started

If you had a file named like, "lib/foo/bar.js", at the top of it, you would put the following:

    var log = require('logmagic').local('mylib.foo.bar');

Then inside bar.js, you would just use the logger like any normal logger:

    log.info("Hello!")
    log.error("By default, format strings are not used.", {SOME_VAR: "myvalue"})
    log.errorf("Just add 'f' to any log method, and you get format strings too: ${SOME_VAR}", {SOME_VAR: "myvalue"})

In any other part of your application, you can reconfigure the logging subsystem at runtime,
making it easy to change log levels for specific modules dynamically.

    var logmagic = require('logmagic');
    logmagic.registerSink("mysink", function(module, level, message) { console.log(message); });

    /* Send Info an higher in the root logger to stdout */
    logmagic.route("__root__", logmagic.INFO, "stdout")

    /* Reconfigure all children of mylib to log all debug messages to your custom sink */
    logmagic.route("mylib.*", logmagic.DEBUG, "mysink")

## Features

Builtin sinks include:

* stderr
* Graylog2-style JSON to stderr

Future features:

* Standard Out
* Facebook Scribe: https://github.com/facebook/scribe
* File
* Unix Socket
* Syslog

## Making a release

To prepare a release, follow the steps outlined bellow:

### 1. Generate a browser shim, add it to the repository

Run the following commands:

```bash
make build
git add dist/logmagic.js
git commit -m "Include generated browser shim"
```

This will generate ``dist/logmagic.js`` file which can be used in the browser.

### 2. Bump the version

Bump `version` attribute in the `package.json` and `bower.json` file.

### 3. Tag the release

For example, if the version you want to release is `0.2.0`:

```bash
git tag 0.2.0
```

### 4. Push changes to Github, publish package to NPM

```bash
git push --tags origin master
npm publish .
```
