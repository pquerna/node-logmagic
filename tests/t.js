var logmagic = require('../lib/logmagic');
var log = logmagic.local('mylib.foo.bar');
//console.log(log);
log.info("Hello!");
log.error("more stuff", {SOME_VAR: "myvalue"});
log.errorf("more stuff: ${SOME_VAR}", {SOME_VAR: "myvalue"});
log.trace("testing trace v0");

logmagic.route("__root__", logmagic.TRACE1, "console");
logmagic.route("__root__", logmagic.TRACE1, "graylog2-stderr");
logmagic.route("__root__", logmagic.TRACE1, "colorConsole");

log.trace("testing trace v1", {slug: 1});

log = logmagic.local('mylib.foo.cars');
log.trace("hello world", {counter: 33, account_id: 42, txnid: "fxxxxx"});
logmagic.addRewriter(function(modulename, level, msg, extra) {
  if (extra.request) {
    extra.accountId = extra.request.account.id;
    extra.txnId = extra.request.txtId;
    delete extra.request;
  }
  return extra;
});

function tryIt(header, log) {
  console.log("\n" + header);
  console.log("===============================================================================");

  log.trace("hello baksdfnsdf", {special: 'aaa', account_id: 42, txnid: "fxxxxx", full_message: "loooong message"});

  log.debug("hello debug", {request: {account: {id: 45}, txtId: "XXXXXXXXXXXXX"}});

  log.warn("hello warn", {request: {account: {id: 45}, txtId: "XXXXXXXXXXXXX"}});

  log.info("hello info", {request: {account: {id: 45}, txtId: "XXXXXXXXXXXXX"}});

  log.error("hello error", {request: {account: {id: 45}, txtId: "XXXXXXXXXXXXX"}});
}

tryIt("Colorful", log);

logmagic.setSinkOptions("colorConsole", {plain: true});
tryIt("Plain", log);

logmagic.setSinkOptions("colorConsole", {scheme: "light"});
tryIt("Light", log);


logmagic.setSinkOptions("colorConsole", {scheme: {nsColor: "green"}});
tryIt("Custom colors", log);


logmagic.registerFileSink("fileLog", "file.log");
logmagic.route("__root__", logmagic.TRACE1, "fileLog");
tryIt("File > file.log", log);

logmagic.registerRecipientsSink("recipients", ["fileLog", "colorConsole"]);
logmagic.route("__root__", logmagic.TRACE1, "recipients");
tryIt("Route to colorConsole and file", log);

logmagic.registerSink("ad-hoc", function(module, level, message) { console.log(message); });
logmagic.route("__root__", logmagic.TRACE1, "ad-hoc");
tryIt("ad-hoc", log);

//console.log(log);
