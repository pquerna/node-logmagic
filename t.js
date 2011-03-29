var logmagic = require('logmagic');
var log = logmagic.local('mylib.foo.bar');
console.log(log);
log.info("Hello!");
log.error("Accepts format strings too ${SOME_VAR}", {SOME_VAR: "myvalue"});
log.trace("testing trace v0");
logmagic.route("__root__", logmagic.TRACE1, "console");
log.trace("testing trace v1", {slug: 1});
console.log(log);
