/*
 * base64.js: An extremely simple implementation of base64 encoding / decoding using node.js Buffers
 *
 * (C) 2010, Nodejitsu Inc.
 * (C) 2011, Cull TV, Inc.
 *
 */

"use strict";var base64=exports;base64.encode=function(e){return new Buffer(e||"").toString("base64")},base64.decode=function(e){return new Buffer(e||"","base64").toString("utf8")},base64.urlEncode=function(e){return base64.encode(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},base64.urlDecode=function(e){for(e=e.replace(/-/g,"+").replace(/_/g,"/");e.length%4;)e+="=";return base64.decode(e)};
