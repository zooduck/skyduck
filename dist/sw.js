parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"QVnC":[function(require,module,exports) {
var define;
var t,r=function(t){"use strict";var r,e=Object.prototype,n=e.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{u({},"")}catch(P){u=function(t,r,e){return t[r]=e}}function h(t,r,e,n){var o=r&&r.prototype instanceof d?r:d,i=Object.create(o.prototype),a=new G(n||[]);return i._invoke=function(t,r,e){var n=l;return function(o,i){if(n===p)throw new Error("Generator is already running");if(n===y){if("throw"===o)throw i;return F()}for(e.method=o,e.arg=i;;){var a=e.delegate;if(a){var c=j(a,e);if(c){if(c===v)continue;return c}}if("next"===e.method)e.sent=e._sent=e.arg;else if("throw"===e.method){if(n===l)throw n=y,e.arg;e.dispatchException(e.arg)}else"return"===e.method&&e.abrupt("return",e.arg);n=p;var u=f(t,r,e);if("normal"===u.type){if(n=e.done?y:s,u.arg===v)continue;return{value:u.arg,done:e.done}}"throw"===u.type&&(n=y,e.method="throw",e.arg=u.arg)}}}(t,e,a),i}function f(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(P){return{type:"throw",arg:P}}}t.wrap=h;var l="suspendedStart",s="suspendedYield",p="executing",y="completed",v={};function d(){}function g(){}function m(){}var w={};w[i]=function(){return this};var L=Object.getPrototypeOf,x=L&&L(L(N([])));x&&x!==e&&n.call(x,i)&&(w=x);var b=m.prototype=d.prototype=Object.create(w);function E(t){["next","throw","return"].forEach(function(r){u(t,r,function(t){return this._invoke(r,t)})})}function _(t,r){var e;this._invoke=function(o,i){function a(){return new r(function(e,a){!function e(o,i,a,c){var u=f(t[o],t,i);if("throw"!==u.type){var h=u.arg,l=h.value;return l&&"object"==typeof l&&n.call(l,"__await")?r.resolve(l.__await).then(function(t){e("next",t,a,c)},function(t){e("throw",t,a,c)}):r.resolve(l).then(function(t){h.value=t,a(h)},function(t){return e("throw",t,a,c)})}c(u.arg)}(o,i,e,a)})}return e=e?e.then(a,a):a()}}function j(t,e){var n=t.iterator[e.method];if(n===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=r,j(t,e),"throw"===e.method))return v;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var o=f(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,v;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,v):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,v)}function O(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function k(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function G(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function N(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function e(){for(;++o<t.length;)if(n.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=r,e.done=!0,e};return a.next=a}}return{next:F}}function F(){return{value:r,done:!0}}return g.prototype=b.constructor=m,m.constructor=g,g.displayName=u(m,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===g||"GeneratorFunction"===(r.displayName||r.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,u(t,c,"GeneratorFunction")),t.prototype=Object.create(b),t},t.awrap=function(t){return{__await:t}},E(_.prototype),_.prototype[a]=function(){return this},t.AsyncIterator=_,t.async=function(r,e,n,o,i){void 0===i&&(i=Promise);var a=new _(h(r,e,n,o),i);return t.isGeneratorFunction(e)?a:a.next().then(function(t){return t.done?t.value:a.next()})},E(b),u(b,c,"Generator"),b[i]=function(){return this},b.toString=function(){return"[object Generator]"},t.keys=function(t){var r=[];for(var e in t)r.push(e);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=N,G.prototype={constructor:G,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(k),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function o(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),h=n.call(a,"finallyLoc");if(u&&h){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!h)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,v):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),v},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),k(e),v}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;k(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:N(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),v}},t}("object"==typeof module?module.exports:{});try{regeneratorRuntime=r}catch(e){Function("r","regeneratorRuntime = r")(r)}
},{}],"EHrm":[function(require,module,exports) {
module.exports={name:"@zooduck/skyduck",version:"2.5.1-beta",description:"Skydiving Weather Service",main:"index.ts",url:"https://github.com/zooduck/skyduck",repository:"git://github.com/zooduck/skyduck.git",scripts:{prebuild:"node clean && npm run lint",build:"parcel build src/index.html copy src/sw.js dist","build:test":"parcel build src/index.test.html",lint:"eslint ./src/**/*.*",prewatch:"node clean",watch:"parcel watch src/index.html copy src/sw.js dist",start:"node server.js",pretest:"npm run build:test",test:"jest --verbose --coverage"},author:"zooduck",license:"ISC",dependencies:{axios:"^0.19.2",dotenv:"^8.2.0",express:"^4.17.1","express-graphql":"^0.9.0","full-icu":"^1.3.1",graphql:"^14.7.0",luxon:"^1.24.1",mongodb:"^3.6.0"},devDependencies:{"@babel/core":"^7.11.4","@babel/preset-env":"^7.11.0","@babel/preset-typescript":"^7.10.4","@types/expect-puppeteer":"^3.3.3","@types/jest-environment-puppeteer":"^4.3.2","@types/luxon":"^1.24.3","@types/puppeteer":"^2.1.1","@typescript-eslint/eslint-plugin":"^2.34.0","@typescript-eslint/parser":"^2.34.0",autoprefixer:"^9.8.6",cssnano:"^4.1.10",eslint:"^6.8.0",jest:"^24.9.0","jest-puppeteer":"^4.4.0","parcel-bundler":"^1.12.4",puppeteer:"^2.1.1","regenerator-runtime":"^0.13.7",sass:"^1.26.10",typescript:"^3.9.7"},engines:{node:"8.11.3"}};
},{}],"NqYy":[function(require,module,exports) {
"use strict";require("regenerator-runtime/runtime");var e=t(require("../package.json"));function t(e){return e&&e.__esModule?e:{default:e}}function n(e,t,n,r,a,s,c){try{var u=e[s](c),o=u.value}catch(i){return void n(i)}u.done?t(o):Promise.resolve(o).then(r,a)}function r(e){return function(){var t=this,r=arguments;return new Promise(function(a,s){var c=e.apply(t,r);function u(e){n(c,a,s,u,o,"next",e)}function o(e){n(c,a,s,u,o,"throw",e)}u(void 0)})}}var a="cache-v".concat(e.default.version),s=["/","index.html","manifest.webmanifest","https://skyduck.s3.eu-west-2.amazonaws.com/img/clear-day.jpg","https://skyduck.s3.eu-west-2.amazonaws.com/img/clear-night.jpg","https://skyduck.s3.eu-west-2.amazonaws.com/img/cloudy.jpg","https://skyduck.s3.eu-west-2.amazonaws.com/img/partly-cloudy-day.jpg","https://skyduck.s3.eu-west-2.amazonaws.com/img/fog.jpg","https://skyduck.s3.eu-west-2.amazonaws.com/img/rain.jpg","https://skyduck.s3.eu-west-2.amazonaws.com/img/sleet.jpg","https://skyduck.s3.eu-west-2.amazonaws.com/img/snow.jpg","https://skyduck.s3.eu-west-2.amazonaws.com/img/wind.jpg"],c=function(){var e=r(regeneratorRuntime.mark(function e(){var t,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,caches.keys();case 2:return t=e.sent,n=t.map(function(e){return caches.delete(e)}),e.abrupt("return",Promise.all(n));case 5:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),u=function(){var e=r(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",caches.open(a).then(function(e){return e.addAll(s)}));case 1:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),o=function(){var e=r(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,self.clients.matchAll();case 2:e.sent.forEach(function(e){e.postMessage(t)});case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}();self.addEventListener("install",function(e){console.log("Service Worker installing..."),self.skipWaiting(),e.waitUntil(c().then(function(){u()}))}),self.addEventListener("activate",function(){console.log("Service Worker activating..."),o("activated")}),self.addEventListener("fetch",function(e){e.respondWith(caches.match(e.request).then(function(t){return t||fetch(e.request)}))});
},{"regenerator-runtime/runtime":"QVnC","../package.json":"EHrm"}]},{},["NqYy"], null)
//# sourceMappingURL=/sw.js.map