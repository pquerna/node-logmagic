(function(){function require(e,t,n){t||(t=0);var r=require.resolve(e,t),i=require.m[t][r];if(!i)throw new Error('failed to require "'+e+'" from '+n);if(i.c){t=i.c,r=i.m,i=require.m[t][i.m];if(!i)throw new Error('failed to require "'+r+'" from '+t)}return i.exports||(i.exports={},i.call(i.exports,i,i.exports,require.relative(r,t))),i.exports}require.resolve=function(e,t){var n=e,r=e+".js",i=e+"/index.js";return require.m[t][r]&&r?r:require.m[t][i]&&i?i:n},require.relative=function(e,t){return function(n){if("."!=n.charAt(0))return require(n,t,e);var r=e.split("/"),i=n.split("/");r.pop();for(var s=0;s<i.length;s++){var o=i[s];".."==o?r.pop():"."!=o&&r.push(o)}return require(r.join("/"),t,e)}};
require.m = [];
require.m[0] = {
"lib/common/sinks.js": function(module, exports, require){
module.exports.console=function(e,t,n,r){var i=(new Date).getTime()/1e3;if(r&&Object.keys(r).length!==0){var s=r.full_message?"\n  "+r.full_message:"";r.full_message=undefined,console.log(e+" ["+i+"]"+": "+n+" "+JSON.stringify(r)+s)}else console.log(e+" ["+i+"]"+": "+n)};},
"lib/browser/index.js": function(module, exports, require){
var e=require("../common/logmagic"),t=require("../common/sinks");(function(){e.registerSink("console",t.console),e.route("__root__",e.INFO,"console")})(),exports=module.exports=e;},
"lib/browser/sinks.js": function(module, exports, require){
var e=require("../common/sinks");module.exports.console=e.console;},
"lib/common/logmagic.js": function(module, exports, require){
function e(e){this.modulename=e,this.loglevel=-1}function u(e,t,n,r){var i;for(i=0;i<o.length;i++)r=o[i](e,t,n,r);return r}function a(e,t,n){return t>=module.exports.TRACE1?function(r,i){i||(i={}),i.full_message=(new Error("Backtrace")).stack,i=u(e,t,r,i),n(e,t,r,i)}:function(r,i){i||(i={}),i=u(e,t,r,i),n(e,t,r,i)}}function f(e,t){function n(e,n){return t.hasOwnProperty(n)?t[n]:n}var r=new RegExp(/\$\{(.*?)\}/g);return e=e.replace(r,n),e}function l(e,t,n){return t>=module.exports.TRACE1?function(r,i){i||(i={}),i.full_message=(new Error("Backtrace")).stack,i=u(e,t,r,i),r=f(r,i),n(e,t,r,i)}:function(r,i){i||(i={}),i=u(e,t,r,i),r=f(r,i),n(e,t,r,i)}}function c(){}function h(e,r,i){r.loglevel=e.loglevel;for(var s=0;s<t.length;s++){var o=t[s],u=module.exports[o],f=o.toLowerCase();u<=e.loglevel?(r[f]=a(i,u,e.callback),r[f+"f"]=l(i,u,e.callback)):(r[f]=c,r[f+"f"]=c)}for(var h in n)n.hasOwnProperty(h)&&(r[h.toLowerCase()]=r[n[h].toLowerCase()],r[h.toLowerCase()+"f"]=r[n[h].toLowerCase()+"f"])}function p(e,t){var n=e.split("."),r=t.split("."),i=0;for(;;){if(n.length<i||r.length<i)break;if(n[i]==r[i]){if(n.length==i)return!0;i++;continue}if(n[i]=="*")return!0;break}return!1}function d(e){for(var t=0;t<s.length;t++){var n=s[t];n.route=="__root__"?h(n,e,e.modulename):p(n.route,e.modulename)&&h(n,e,e.modulename)}}module.exports.EMERG=0,module.exports.ALERT=1,module.exports.CRIT=2,module.exports.ERR=3,module.exports.WARNING=4,module.exports.NOTICE=5,module.exports.INFO=6,module.exports.DEBUG=7,module.exports.TRACE1=8,module.exports.TRACE2=9,module.exports.TRACE3=10,module.exports.TRACE4=11,module.exports.TRACE5=12,module.exports.TRACE6=13,module.exports.TRACE7=14,module.exports.TRACE8=15;var t=["EMERG","ALERT","CRIT","ERR","WARNING","NOTICE","INFO","DEBUG","TRACE1","TRACE2","TRACE3","TRACE4","TRACE5","TRACE6","TRACE7","TRACE8"],n={WARN:"WARNING",ERROR:"ERR",DBG:"DEBUG",MSG:"INFO",TRACE:"TRACE1"},r={},i=[],s=[],o=[];module.exports.local=function(t){var n=new e(t);return d(n),i.push(n),n},module.exports.registerSink=function(e,t){r[e]=t},module.exports.route=function(e,t,n){if(!(t>=module.exports.EMERG&&t<=module.exports.TRACE8))throw new Error("Invalid Log level: "+t);if(r[n]===undefined)throw new Error("Invalid Sink: "+n);s.push({route:e,loglevel:t,callback:r[n]});for(var o=0;o<i.length;o++){var u=i[o];d(u)}},module.exports.addRewriter=function(e){o.push(e)},module.exports.clearRewriter=function(e){o.pop(e)};},
"lib/browser/logmagic.js": function(module, exports, require){
var e=require("../common/logmagic"),t=require("../common/sinks");(function(){e.registerSink("console",t.console),e.route("__root__",e.INFO,"console")})(),module.exports=e;},
};
logmagic = require('lib/browser/logmagic.js');
}());