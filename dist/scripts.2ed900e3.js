// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"scripts/web-components/sky-duck/fetch/reverse-geocode-lookup.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reverseGeocodeLookup = void 0;

exports.reverseGeocodeLookup = function (point) {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var latitude, longitude, response, json, resource, coords, name, address, geocodeData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            latitude = point.latitude, longitude = point.longitude;
            _context.next = 4;
            return fetch("/reverse_geocode?point=".concat(latitude, ",").concat(longitude));

          case 4:
            response = _context.sent;

            if (response.ok) {
              _context.next = 7;
              break;
            }

            throw "(".concat(response.status, ") ").concat(response.statusText);

          case 7:
            _context.next = 9;
            return response.json();

          case 9:
            json = _context.sent;
            resource = json.resourceSets[0].resources[0];

            if (resource) {
              _context.next = 14;
              break;
            }

            this._geocodeData = null;
            throw "Unable to resolve location for coordinates of \"".concat(latitude, ",").concat(longitude, ".\"");

          case 14:
            coords = resource.geocodePoints[0].coordinates;
            name = resource.name, address = resource.address;
            geocodeData = {
              query: "".concat(coords[0], ",").concat(coords[1]),
              address: address,
              name: name,
              latitude: coords[0],
              longitude: coords[1]
            };
            return _context.abrupt("return", geocodeData);

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](0);
            throw Error(_context.t0);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 20]]);
  }));
};
},{}],"scripts/web-components/sky-duck/config/graphql.config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlConfig = void 0;
exports.graphqlConfig = {
  uri: '/graphql',
  options: {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
    }
  }
};
},{}],"scripts/web-components/sky-duck/graphql-queries/skydive-clubs-query.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skydiveClubsQuery = void 0;
exports.skydiveClubsQuery = "query SkydiveClubs($country: String) {\n    clubs(country: $country) {\n        latitude,\n        longitude,\n        name,\n        place,\n        country,\n        countryAliases,\n        site,\n    }\n}";
},{}],"scripts/web-components/sky-duck/fetch/skydive-clubs.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skydiveClubsLookup = void 0;

var graphql_config_1 = require("../config/graphql.config");

var skydive_clubs_query_1 = require("../graphql-queries/skydive-clubs-query");

exports.skydiveClubsLookup = function () {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var graphqlResponse, json, clubs;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch(graphql_config_1.graphqlConfig.uri, Object.assign(Object.assign({}, graphql_config_1.graphqlConfig.options), {
              body: JSON.stringify({
                query: skydive_clubs_query_1.skydiveClubsQuery
              })
            }));

          case 3:
            graphqlResponse = _context.sent;

            if (graphqlResponse.ok) {
              _context.next = 6;
              break;
            }

            throw Error("(".concat(graphqlResponse.status, ") ").concat(graphqlResponse.statusText));

          case 6:
            _context.next = 8;
            return graphqlResponse.json();

          case 8:
            json = _context.sent;
            clubs = json.data.clubs.map(function (club) {
              return Object.assign(Object.assign({}, club), {
                distance: 0
              });
            });
            return _context.abrupt("return", clubs);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            throw Error(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));
};
},{"../config/graphql.config":"scripts/web-components/sky-duck/config/graphql.config.ts","../graphql-queries/skydive-clubs-query":"scripts/web-components/sky-duck/graphql-queries/skydive-clubs-query.ts"}],"scripts/web-components/sky-duck/utils/get-current-position.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentPosition = void 0;

exports.getCurrentPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function (position) {
      resolve(position);
    }, function (err) {
      reject(err.message || err);
    });
  });
};
},{}],"scripts/web-components/sky-duck/fetch/log.fetch.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Log = void 0;

var Log =
/*#__PURE__*/
function () {
  function Log(location) {
    _classCallCheck(this, Log);

    this._location = location;
  }

  _createClass(Log, [{
    key: "_logConnection",
    value: function _logConnection() {
      fetch("/connect/update?location=".concat(this._location), {
        method: 'PUT'
      });
    }
  }, {
    key: "connection",
    value: function connection() {
      return this._logConnection();
    }
  }]);

  return Log;
}();

exports.Log = Log;
},{}],"scripts/web-components/sky-duck/utils/modifier-classes.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modifierClasses = void 0;
exports.modifierClasses = {
  activeCarouselClubList: '--active-carousel-club-list',
  activeCarouselForecast: '--active-carousel-forecast',
  error: '--error',
  forecastDisplayModeExtended: '--forecast-display-mode-extended',
  forecastDisplayModeStandard: '--forecast-display-mode-standard',
  includeNighttimeWeather: '--include-nighttime',
  init: '--init',
  loading: '--loading',
  ready: '--ready',
  settingsActive: '--settings-active',
  subSettingsActive: '--sub-settings-active',
  userDeniedGeolocation: '--geolocation-error'
};
},{}],"scripts/web-components/sky-duck/state/state.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = void 0;
exports.state = {
  club: '',
  clubs: null,
  clubsSortedByCountry: null,
  clubCountries: [],
  currentClub: null,
  currentClubListCountry: '',
  currentForecastSlide: 1,
  currentSubSettings: '',
  error: null,
  forecast: null,
  geocodeData: {
    query: '',
    name: '',
    address: {
      addressLine: '',
      adminDistrict: '',
      countryRegion: '',
      formattedAddress: '',
      locality: '',
      postalCode: ''
    },
    latitude: null,
    longitude: null
  },
  googleMapsKey: '',
  hasLoaded: false,
  headerSubTitle: '',
  headerTitle: '',
  imagesReady: false,
  isLoading: false,
  location: '',
  locationDetails: {
    name: '',
    address: '',
    timezone: '',
    coords: {
      latitude: null,
      longitude: null
    }
  },
  nearestClub: null,
  position: null,
  settings: {
    activeCarousel: 'forecast',
    forecastDisplayMode: 'standard',
    includeNighttimeWeather: false,
    useGPSForCurrentLocation: true
  },
  settingsActive: false,
  setupStarted: false,
  subSettingsActive: false,
  userDeniedGeolocation: false,
  userLocation: null,
  version: ''
};
},{}],"scripts/web-components/sky-duck/state/stateapotamus.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StateAPotamus = void 0;

exports.StateAPotamus = function () {
  var _state;

  var _actions = {};

  var _ERROR = function _ERROR(action) {
    return "Error: You attempted to dispatch an unregistered action (".concat(action, ")!\n\nTo register an action:\n-------------------------------------------------------------\nStateAPotamus.listen(<Action: String>, <Callback: Function>);\n-------------------------------------------------------------\n\nTo dispatch a registered action:\n---------------------------------------------------------------------\nStateAPotamus.dispatch(<Action: String>, <NewState: any>);\n---------------------------------------------------------------------\n\nFor example:\n--------------------------------------------------------------------\nconst initialState = {\n    pony: 'Twilight Sparkle',\n};\n\nStateAPotamus.setState(initialState);\n\nconsole.log('Log 1: ' + StateAPotamus.getState().pony);\n\nconst onPonyChangeCallback = () => {\n    console.log('Log 2: ' + StateAPotamus.getState().pony);\n};\n\nStateAPotamus.listen('UPDATE_PONY', onPonyChangeCallback);\n\nconst newState = {\n    pony: 'Rarity',\n};\n\nStateAPotamus.dispatch('UPDATE_PONY', newState);\n\nconsole.log('Log 3: ' + StateAPotamus.getState().pony);\n\n// Log 1: Twilight Sparkle\n// Log 2: Rarity\n// Log 3: Rarity\n--------------------------------------------------------------------\n        ");
  };

  var _validateAction = function _validateAction(action) {
    if (typeof _actions[action] !== 'function') {
      var error = _ERROR(action); // eslint-disable-next-line no-console


      console.error(error);
      return false;
    }

    return true;
  };

  return {
    dispatch: function dispatch(action, newState) {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var isValidAction;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (newState) {
                  _state = Object.assign(Object.assign({}, _state), newState);
                }

                isValidAction = _validateAction(action);

                if (isValidAction) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return");

              case 4:
                _context.next = 6;
                return _actions[action]();

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    },
    listen: function listen(action, callback) {
      _actions[action] = callback;
    },
    getActions: function getActions() {
      return _actions;
    },
    getState: function getState() {
      return _state;
    },
    setState: function setState(newState) {
      _state = Object.assign({}, newState);
    }
  };
}();
},{}],"scripts/web-components/sky-duck/fetch/google-maps-key-lookup.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.googleMapsKeyLookup = void 0;

exports.googleMapsKeyLookup = function () {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var response, key;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch('/googlemapskey');

          case 3:
            response = _context.sent;

            if (!response.ok) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return response.text();

          case 7:
            _context.t0 = _context.sent;
            _context.next = 11;
            break;

          case 10:
            _context.t0 = '';

          case 11:
            key = _context.t0;
            return _context.abrupt("return", key);

          case 15:
            _context.prev = 15;
            _context.t1 = _context["catch"](0);
            throw Error(_context.t1);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));
};
},{}],"scripts/web-components/sky-duck/fetch/geocode-lookup.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.geocodeLookup = void 0;

exports.geocodeLookup = function (place) {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var response, json, resource, coords, name, address, geocodeData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch("/geocode?place=".concat(place));

          case 3:
            response = _context.sent;

            if (response.ok) {
              _context.next = 6;
              break;
            }

            throw "(".concat(response.status, ") ").concat(response.statusText);

          case 6:
            _context.next = 8;
            return response.json();

          case 8:
            json = _context.sent;
            resource = json.resourceSets[0].resources[0];

            if (resource) {
              _context.next = 12;
              break;
            }

            throw "Unable to resolve coordinates for location of \"".concat(place, ".\"");

          case 12:
            coords = resource.geocodePoints[0].coordinates;
            name = resource.name, address = resource.address;
            geocodeData = {
              query: place,
              address: address,
              name: name,
              latitude: coords[0],
              longitude: coords[1]
            };
            return _context.abrupt("return", geocodeData);

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](0);
            throw Error(_context.t0);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 18]]);
  }));
};
},{}],"scripts/web-components/sky-duck/templates/settings-toggle.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SettingsToggleTemplate = void 0;

var SettingsToggleTemplate =
/*#__PURE__*/
function () {
  function SettingsToggleTemplate(id, title, subtitle, toggleState, disabled, eventHandler) {
    _classCallCheck(this, SettingsToggleTemplate);

    this._id = id || '';
    this._eventHandler = eventHandler;
    this._title = title || '';
    this._subTitle = subtitle || '';
    this._toggleState = toggleState || 'off';
    this._disabled = disabled;

    this._buildSettingsToggle();
  }

  _createClass(SettingsToggleTemplate, [{
    key: "_buildSettingsToggle",
    value: function _buildSettingsToggle() {
      var _this = this;

      var disabled = this._disabled ? 'disabled' : '';
      this._settingsToggle = new DOMParser().parseFromString("\n            <div\n                class=\"settings__control\"\n                id=\"".concat(this._id, "\">\n                <div class=\"settings-control-name\">\n                    <h4 class=\"settings-control-name__title\">").concat(this._title, "</h4>\n                    <span class=\"settings-control-name__subtitle\">").concat(this._subTitle, "</span>\n                </div>\n                <zooduck-icon-toggle\n                    ").concat(disabled, "\n                    togglestate=\"").concat(this._toggleState, "\"\n                    toggleoncolor=\"var(--lightskyblue)\">\n                </zooduck-icon-toggle>\n            </div>\n        "), 'text/html').body.firstChild;

      if (!this._eventHandler) {
        return;
      }

      this._settingsToggle.querySelector('zooduck-icon-toggle').addEventListener('zooduck-icon-toggle:change', function () {
        _this._eventHandler();
      });
    }
  }, {
    key: "html",
    get: function get() {
      return this._settingsToggle;
    }
  }]);

  return SettingsToggleTemplate;
}();

exports.SettingsToggleTemplate = SettingsToggleTemplate;
},{}],"scripts/web-components/sky-duck/templates/settings-search.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchTemplate = void 0;

var SearchTemplate =
/*#__PURE__*/
function () {
  function SearchTemplate(id, label, placeholder) {
    var disabled = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var eventHandler = arguments.length > 4 ? arguments[4] : undefined;

    _classCallCheck(this, SearchTemplate);

    this._id = id;
    this._label = label || '';
    this._placeholder = placeholder || '';
    this._disabled = disabled;

    this._eventHandler = eventHandler || function () {};

    this._buildSearch();
  }

  _createClass(SearchTemplate, [{
    key: "_buildSearch",
    value: function _buildSearch() {
      var _this = this;

      this._search = new DOMParser().parseFromString("\n            <div class=\"search\">\n                <zooduck-input\n                    id=\"".concat(this._id, "\"\n                    label=\"").concat(this._label, "\"\n                    placeholder=\"").concat(this._placeholder, "\"\n                    ").concat(this._disabled ? 'disabled' : '', ">\n                </zooduck-input>\n            </div>\n        "), 'text/html').body.firstChild;

      if (!this._eventHandler) {
        return;
      }

      this._search.querySelector('zooduck-input').addEventListener('keyup:enter', function (e) {
        _this._eventHandler(e);
      });
    }
  }, {
    key: "html",
    get: function get() {
      return this._search;
    }
  }]);

  return SearchTemplate;
}();

exports.SearchTemplate = SearchTemplate;
},{}],"scripts/web-components/sky-duck/templates/not-found.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotFoundTemplate = void 0;

var NotFoundTemplate =
/*#__PURE__*/
function () {
  function NotFoundTemplate(text, id, className) {
    _classCallCheck(this, NotFoundTemplate);

    this._text = text;
    this._id = id || '';
    this._className = className || '';

    this._buildNotFound();
  }

  _createClass(NotFoundTemplate, [{
    key: "_buildNotFound",
    value: function _buildNotFound() {
      this._notFound = new DOMParser().parseFromString("\n            <span class=\"".concat(this._className, "\" style=\"display: none;\">").concat(this._text, "</span>\n        "), 'text/html').body.firstChild;

      if (!this._id) {
        return;
      }

      this._notFound.setAttribute('id', this._id);
    }
  }, {
    key: "html",
    get: function get() {
      return this._notFound;
    }
  }]);

  return NotFoundTemplate;
}();

exports.NotFoundTemplate = NotFoundTemplate;
},{}],"scripts/web-components/sky-duck/utils/format-address.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatAddress = void 0;

exports.formatAddress = function (address) {
  var parts = address.split(',');
  var uniqueParts = [];
  parts.forEach(function (part) {
    var _part = part.trim();

    if (!uniqueParts.includes(_part)) {
      uniqueParts.push(_part);
    }
  });
  var html = uniqueParts.map(function (part) {
    return "<span>".concat(part, "</span>");
  });
  return html.join('');
};
},{}],"scripts/web-components/sky-duck/templates/location-info.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocationInfoTemplate = void 0;

var not_found_template_1 = require("./not-found.template");

var format_address_1 = require("../utils/format-address");

var LocationInfoTemplate =
/*#__PURE__*/
function () {
  function LocationInfoTemplate(locationDetails, id, className) {
    _classCallCheck(this, LocationInfoTemplate);

    this._locationDetails = locationDetails;
    this._id = id;
    this._className = className || '';

    this._buildLocationInfo();
  }

  _createClass(LocationInfoTemplate, [{
    key: "_buildLocationInfo",
    value: function _buildLocationInfo() {
      if (!this._locationDetails) {
        this._locationInfo = new not_found_template_1.NotFoundTemplate('LOCATION_DETAILS_NOT_FOUND').html;
        return;
      }

      var _this$_locationDetail = this._locationDetails,
          name = _this$_locationDetail.name,
          address = _this$_locationDetail.address,
          site = _this$_locationDetail.site;
      var title = "\n            <h3>".concat(name, "</h3>\n        ");
      var formattedAddress = format_address_1.formatAddress(address);
      var siteLink = site ? "\n                <a\n                    class=\"location-info-link\"\n                    href=".concat(site, "\n                    target=\"_blank\">\n                    ").concat(site.replace(/^https?:\/+/, ''), "\n                </a>\n            ") : '';
      this._locationInfo = new DOMParser().parseFromString("\n            <div class=\"location-info ".concat(this._className, "\">\n                ").concat(title, "\n                ").concat(formattedAddress, "\n                ").concat(siteLink, "\n            </div>\n        "), 'text/html').body.firstChild;

      if (this._id) {
        this._locationInfo.id = this._id;
      }
    }
  }, {
    key: "html",
    get: function get() {
      return this._locationInfo;
    }
  }]);

  return LocationInfoTemplate;
}();

exports.LocationInfoTemplate = LocationInfoTemplate;
},{"./not-found.template":"scripts/web-components/sky-duck/templates/not-found.template.ts","../utils/format-address":"scripts/web-components/sky-duck/utils/format-address.ts"}],"scripts/web-components/sky-duck/templates/sub-settings-current-location.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubSettingsCurrentLocationTemplate = void 0;

var settings_toggle_template_1 = require("./settings-toggle.template");

var settings_search_template_1 = require("./settings-search.template");

var location_info_template_1 = require("./location-info.template");

var stateapotamus_1 = require("../state/stateapotamus");

var SubSettingsCurrentLocationTemplate =
/*#__PURE__*/
function () {
  function SubSettingsCurrentLocationTemplate(gpsToggleEventHandler, setCurrentLocationEventHandler) {
    _classCallCheck(this, SubSettingsCurrentLocationTemplate);

    var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
        settings = _stateapotamus_1$Stat.settings,
        userLocation = _stateapotamus_1$Stat.userLocation;

    this._gpsToggleEventHandler = gpsToggleEventHandler;
    this._setCurrentLocationEventHandler = setCurrentLocationEventHandler;
    this._useGPSForCurrentLocation = settings.useGPSForCurrentLocation;
    this._userLocation = userLocation;

    this._buildSubSettingsCurrentLocation();
  }

  _createClass(SubSettingsCurrentLocationTemplate, [{
    key: "_buildSubSettingsCurrentLocation",
    value: function _buildSubSettingsCurrentLocation() {
      this._subSettingsCurrentLocation = new DOMParser().parseFromString("\n            <div class=\"settings-grid\"></div>\n        ", 'text/html').body.firstChild;
      var useGPSForCurrentLocationToggleState = this._useGPSForCurrentLocation ? 'on' : 'off';

      this._subSettingsCurrentLocation.appendChild(new settings_toggle_template_1.SettingsToggleTemplate('useGPSForCurrentLocationToggle', 'Use GPS', '', useGPSForCurrentLocationToggleState, false, this._gpsToggleEventHandler).html);

      this._subSettingsCurrentLocation.appendChild(new settings_search_template_1.SearchTemplate('setCurrentLocationInput', 'Set Location', 'e.g. Hill Valley, California, USA', this._useGPSForCurrentLocation, this._setCurrentLocationEventHandler).html);

      var locationDetails = {
        name: '',
        address: this._userLocation.address.formattedAddress
      };

      this._subSettingsCurrentLocation.appendChild(new location_info_template_1.LocationInfoTemplate(locationDetails, 'currentLocationDetails', '--user-location').html);
    }
  }, {
    key: "html",
    get: function get() {
      return this._subSettingsCurrentLocation;
    }
  }]);

  return SubSettingsCurrentLocationTemplate;
}();

exports.SubSettingsCurrentLocationTemplate = SubSettingsCurrentLocationTemplate;
},{"./settings-toggle.template":"scripts/web-components/sky-duck/templates/settings-toggle.template.ts","./settings-search.template":"scripts/web-components/sky-duck/templates/settings-search.template.ts","./location-info.template":"scripts/web-components/sky-duck/templates/location-info.template.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/templates/club-list-item.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClubListItemTemplate = void 0;

var ClubListItemTemplate =
/*#__PURE__*/
function () {
  function ClubListItemTemplate(clubListSorted, club, userLocation, eventHandler) {
    _classCallCheck(this, ClubListItemTemplate);

    this._club = club;
    this._clubs = clubListSorted;
    this._userLocation = userLocation;
    this._eventHandler = eventHandler;

    this._buildClubListItem();
  }

  _createClass(ClubListItemTemplate, [{
    key: "_buildClubListItem",
    value: function _buildClubListItem() {
      var _this = this;

      this._clubListItem = new DOMParser().parseFromString("\n            <li class=\"club-list-item\">\n                ".concat(this._buildClubListItemDistance().outerHTML, "\n                <h3 class=\"club-list-item__name\">").concat(this._club.name, "</h3>\n                <span class=\"club-list-item__place\">").concat(this._club.place, "</span>\n                <a class=\"club-list-item__site-link\" href=\"").concat(this._club.site, "\" target=\"_blank\">").concat(this._club.site.replace(/https?:\/\//, ''), "</a>\n            </li>\n        "), 'text/html').body.firstChild;

      if (!this._eventHandler) {
        return;
      }

      this._clubListItem.querySelector('.club-list-item__name').addEventListener('click', function () {
        _this._eventHandler(_this._club.name);
      });
    }
  }, {
    key: "_buildClubListItemDistance",
    value: function _buildClubListItemDistance() {
      if (this._isClubListCountrySameAsUserCountry()) {
        var furthestDZDistance = this._clubs.furthestDZDistance;
        var distanceFromCurrentLocation = this._club.distance;
        var clubListItemDistanceStyle = "\n                grid-template-columns: minmax(auto, ".concat(Math.round(this._club.distance / furthestDZDistance * 100), "%) auto;\n            ");
        var distanceColorModifier = distanceFromCurrentLocation >= 200 ? '--red' : distanceFromCurrentLocation >= 100 ? '--amber' : '--green';
        return new DOMParser().parseFromString("\n                <div class=\"club-list-item-distance\" style=\"".concat(clubListItemDistanceStyle, "\">\n                    <span class=\"club-list-item-distance__marker ").concat(distanceColorModifier, "\"></span>\n                    <div class=\"club-list-item-distance__miles\">\n                        <span>").concat(distanceFromCurrentLocation, "</span>\n                        <small>miles</small>\n                    </div>\n                </div>\n            "), 'text/html').body.firstChild;
      }

      return new DOMParser().parseFromString("\n            <div class=\"club-list-item-distance\">\n                <span class=\"club-list-item-distance__marker\"></span>\n            </div>\n        ", 'text/html').body.firstChild;
    }
  }, {
    key: "_isClubListCountrySameAsUserCountry",
    value: function _isClubListCountrySameAsUserCountry() {
      if (!this._userLocation) {
        return false;
      }

      var countryRegion = this._userLocation.address.countryRegion;
      return this._clubs.countryAliases.includes(countryRegion);
    }
  }, {
    key: "html",
    get: function get() {
      return this._clubListItem;
    }
  }]);

  return ClubListItemTemplate;
}();

exports.ClubListItemTemplate = ClubListItemTemplate;
},{}],"scripts/web-components/sky-duck/templates/club-list.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClubListTemplate = void 0;

var club_list_item_template_1 = require("./club-list-item.template");

var ClubListTemplate =
/*#__PURE__*/
function () {
  function ClubListTemplate(clubListSorted, userLocation, eventHandler) {
    _classCallCheck(this, ClubListTemplate);

    this._clubs = clubListSorted;
    this._userLocation = userLocation;
    this._eventHandler = eventHandler;

    this._buildClubList();
  }

  _createClass(ClubListTemplate, [{
    key: "_buildClubList",
    value: function _buildClubList() {
      var _this = this;

      var country = this._clubs.country;
      this._clubList = new DOMParser().parseFromString("\n            <div\n                class=\"club-list-container\"\n                id=\"clubList_".concat(country, "\">\n                <ul class=\"club-list-container__club-list\"></ul>\n            </div>\n        "), 'text/html').body.firstChild;

      this._clubs.list.map(function (club) {
        return new club_list_item_template_1.ClubListItemTemplate(_this._clubs, club, _this._userLocation, _this._eventHandler).html;
      }).forEach(function (clubListItem) {
        var ul = _this._clubList.querySelector('.club-list-container__club-list');

        ul.appendChild(clubListItem);
      });
    }
  }, {
    key: "html",
    get: function get() {
      return this._clubList;
    }
  }]);

  return ClubListTemplate;
}();

exports.ClubListTemplate = ClubListTemplate;
},{"./club-list-item.template":"scripts/web-components/sky-duck/templates/club-list-item.template.ts"}],"scripts/web-components/sky-duck/templates/club-list-carousel.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClubListCarouselTemplate = void 0;

var club_list_template_1 = require("./club-list.template");

var ClubListCarouselTemplate =
/*#__PURE__*/
function () {
  function ClubListCarouselTemplate(clubListsSortedByCountry, clubCountries, userLocation, slideChangeEventHandler, clubChangeHandler) {
    _classCallCheck(this, ClubListCarouselTemplate);

    this._clubs = clubListsSortedByCountry;
    this._clubCountries = clubCountries;
    this._userLocation = userLocation;
    this._slideChangeEventHandler = slideChangeEventHandler;
    this._clubChangeHandler = clubChangeHandler;

    this._buildClubListCarousel();
  }

  _createClass(ClubListCarouselTemplate, [{
    key: "_buildClubListCarousel",
    value: function _buildClubListCarousel() {
      var _this = this;

      this._clubListCarousel = new DOMParser().parseFromString("\n            <zooduck-carousel\n                id=\"clubListCarousel\"\n                class=\"club-list-carousel --render-once\">\n                <div slot=\"slides\"></div>\n            </zooduck-carousel>\n        ", 'text/html').body.firstChild;

      var slidesSlot = this._clubListCarousel.querySelector('[slot=slides]');

      var slides = this._buildClubListContainers();

      slides.forEach(function (slide) {
        slidesSlot.appendChild(slide);
      });

      if (!this._slideChangeEventHandler) {
        return;
      }

      this._clubListCarousel.addEventListener('slidechange', function (e) {
        _this._slideChangeEventHandler(e);
      });
    }
  }, {
    key: "_buildClubListContainers",
    value: function _buildClubListContainers() {
      var _this2 = this;

      var clubListContainers = this._clubCountries.map(function (country) {
        return new club_list_template_1.ClubListTemplate(_this2._clubs[country], _this2._userLocation, _this2._clubChangeHandler).html;
      });

      return clubListContainers;
    }
  }, {
    key: "html",
    get: function get() {
      return this._clubListCarousel;
    }
  }]);

  return ClubListCarouselTemplate;
}();

exports.ClubListCarouselTemplate = ClubListCarouselTemplate;
},{"./club-list.template":"scripts/web-components/sky-duck/templates/club-list.template.ts"}],"scripts/web-components/sky-duck/event-handlers/general.event-handlers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generalEventHandlers = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

exports.generalEventHandlers = function generalEventHandlers() {
  var _this = this;

  var onClubChangeHandler = function onClubChangeHandler(club) {
    _this.club = club;
    stateapotamus_1.StateAPotamus.dispatch('TOGGLE_ACTIVE_CAROUSEL', {
      headerTitle: stateapotamus_1.StateAPotamus.getState().locationDetails.name,
      settings: Object.assign(Object.assign({}, stateapotamus_1.StateAPotamus.getState().settings), {
        activeCarousel: 'forecast'
      })
    });
  };

  var onClubListCarouselSlideChangeHandler = function onClubListCarouselSlideChangeHandler(e) {
    var clubCountryIndex = e.detail.currentSlide.index;
    var clubListCountry = stateapotamus_1.StateAPotamus.getState().clubCountries[clubCountryIndex];
    stateapotamus_1.StateAPotamus.dispatch('CLUB_LIST_CAROUSEL_SLIDE_CHANGE', {
      currentClubListCountry: clubListCountry,
      headerTitle: clubListCountry
    });
  };

  var onForecastCarouselSlideChangeHandler = function onForecastCarouselSlideChangeHandler(e) {
    var slideNumber = e.detail.currentSlide.id;
    stateapotamus_1.StateAPotamus.dispatch('FORECAST_CAROUSEL_SLIDE_CHANGE', {
      currentForecastSlide: slideNumber
    });
  };

  var toggleSettingsHandler = function toggleSettingsHandler() {
    stateapotamus_1.StateAPotamus.dispatch('TOGGLE_SETTINGS', {
      settingsActive: !stateapotamus_1.StateAPotamus.getState().settingsActive
    });
  };

  var toggleSubSettingsHandler = function toggleSubSettingsHandler() {
    stateapotamus_1.StateAPotamus.dispatch('TOGGLE_SUB_SETTINGS', {
      subSettingsActive: !stateapotamus_1.StateAPotamus.getState().subSettingsActive
    });
  };

  return {
    onClubChangeHandler: onClubChangeHandler.bind(this),
    onClubListCarouselSlideChangeHandler: onClubListCarouselSlideChangeHandler.bind(this),
    onForecastCarouselSlideChangeHandler: onForecastCarouselSlideChangeHandler.bind(this),
    toggleSettingsHandler: toggleSettingsHandler.bind(this),
    toggleSubSettingsHandler: toggleSubSettingsHandler.bind(this)
  };
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/utils/sort-clubs-by-name.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortClubsByName = void 0;

exports.sortClubsByName = function (clubs) {
  clubs.sort(function (a, b) {
    return a.name > b.name ? 1 : -1;
  });
};
},{}],"scripts/web-components/sky-duck/utils/distance-between-points.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DistanceBetweenPoints = void 0;

var DistanceBetweenPoints =
/*#__PURE__*/
function () {
  function DistanceBetweenPoints(points) {
    _classCallCheck(this, DistanceBetweenPoints);

    this._distanceInMetres = this._calcDistanceBetweenPointsInMetres(points);
    this._distanceInMiles = this._metresToMiles(this._distanceInMetres);
  }

  _createClass(DistanceBetweenPoints, [{
    key: "_calcDistanceBetweenPointsInMetres",
    value: function _calcDistanceBetweenPointsInMetres(points) {
      var _points$from = points.from,
          latDeg1 = _points$from.latDeg,
          lonDeg1 = _points$from.lonDeg;
      var _points$to = points.to,
          latDeg2 = _points$to.latDeg,
          lonDeg2 = _points$to.lonDeg;
      var earthRadiusInMetres = 6371000; // metres

      var latRadians1 = this._degreesToRadians(latDeg1);

      var lonRadians1 = this._degreesToRadians(lonDeg1);

      var latRadians2 = this._degreesToRadians(latDeg2);

      var lonRadians2 = this._degreesToRadians(lonDeg2); // Spherical Law of Cosines Formula
      // https://www.movable-type.co.uk/scripts/latlong.html


      var distanceInMetres = Math.acos(Math.sin(latRadians1) * Math.sin(latRadians2) + Math.cos(latRadians1) * Math.cos(latRadians2) * Math.cos(lonRadians2 - lonRadians1)) * earthRadiusInMetres;
      return Math.round(distanceInMetres);
    }
  }, {
    key: "_metresToMiles",
    value: function _metresToMiles(metres) {
      var divisionFactor = 1609.344;
      return Math.round(metres / divisionFactor);
    }
  }, {
    key: "_degreesToRadians",
    value: function _degreesToRadians(deg) {
      return deg * (Math.PI / 180);
    }
  }, {
    key: "metres",
    get: function get() {
      return this._distanceInMetres;
    }
  }, {
    key: "miles",
    get: function get() {
      return this._distanceInMiles;
    }
  }]);

  return DistanceBetweenPoints;
}();

exports.DistanceBetweenPoints = DistanceBetweenPoints;
},{}],"scripts/web-components/sky-duck/utils/update-club-distances.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateClubDistances = void 0;

var distance_between_points_1 = require("./distance-between-points");

exports.updateClubDistances = function (clubs, userLocation) {
  return clubs.map(function (club) {
    var distanceInMiles = userLocation ? new distance_between_points_1.DistanceBetweenPoints({
      from: {
        latDeg: userLocation.latitude,
        lonDeg: userLocation.longitude
      },
      to: {
        latDeg: club.latitude,
        lonDeg: club.longitude
      }
    }).miles : 0;
    return Object.assign(Object.assign({}, club), {
      distance: distanceInMiles
    });
  });
};
},{"./distance-between-points":"scripts/web-components/sky-duck/utils/distance-between-points.ts"}],"scripts/web-components/sky-duck/utils/sort-clubs-by-distance.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortClubsByDistance = void 0;

exports.sortClubsByDistance = function (clubs) {
  clubs.sort(function (a, b) {
    return a.distance - b.distance;
  });
};
},{}],"scripts/web-components/sky-duck/utils/get-club-countries.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClubCountries = void 0;

exports.getClubCountries = function (clubsSortedByCountry, nearestClub) {
  var clubListCountries = Object.keys(clubsSortedByCountry).filter(function (country) {
    if (nearestClub && nearestClub.country) {
      return country !== nearestClub.country;
    }

    return true;
  });

  if (nearestClub && nearestClub.country) {
    clubListCountries.unshift(nearestClub.country);
  }

  return clubListCountries;
};
},{}],"scripts/web-components/sky-duck/utils/sort-clubs-by-country.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortClubsByCountry = void 0;

exports.sortClubsByCountry = function (clubs) {
  var clubsByCountry = {};
  clubs.forEach(function (club) {
    if (!clubsByCountry[club.country]) {
      clubsByCountry[club.country] = {
        country: club.country,
        countryAliases: club.countryAliases,
        furthestDZDistance: 0,
        list: []
      };
    }

    var _clubsByCountry$club$ = clubsByCountry[club.country],
        list = _clubsByCountry$club$.list,
        furthestDZDistance = _clubsByCountry$club$.furthestDZDistance;
    list.push(club);

    if (club.distance < furthestDZDistance) {
      return;
    }

    clubsByCountry[club.country].furthestDZDistance = club.distance;
  });
  var sortedKeys = Object.keys(clubsByCountry).sort();
  var clubsByCountrySorted = {};
  sortedKeys.forEach(function (key) {
    clubsByCountrySorted[key] = clubsByCountry[key];
  });
  return clubsByCountrySorted;
};
},{}],"scripts/web-components/sky-duck/utils/sort-clubs.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortClubs = void 0;

var sort_clubs_by_name_1 = require("./sort-clubs-by-name");

var update_club_distances_1 = require("./update-club-distances");

var sort_clubs_by_distance_1 = require("./sort-clubs-by-distance");

var stateapotamus_1 = require("../state/stateapotamus");

var get_club_countries_1 = require("./get-club-countries");

var sort_clubs_by_country_1 = require("./sort-clubs-by-country");

exports.sortClubs = function (clubs, userLocation) {
  var clubsSorted;
  var nearestClub;
  clubsSorted = update_club_distances_1.updateClubDistances(clubs, userLocation);
  sort_clubs_by_name_1.sortClubsByName(clubsSorted);

  if (userLocation) {
    var country = userLocation.address.countryRegion;
    var clubsInOtherCountries = [];
    var clubsInSameCountryAsUser = clubsSorted.filter(function (club) {
      var isClubInSameCountryAsUser = club.countryAliases.includes(country);

      if (!isClubInSameCountryAsUser) {
        clubsInOtherCountries.push(club);
      }

      return club.countryAliases.includes(country);
    });
    sort_clubs_by_distance_1.sortClubsByDistance(clubsInSameCountryAsUser);
    nearestClub = clubsInSameCountryAsUser[0];
    clubsSorted = clubsInSameCountryAsUser.concat(clubsInOtherCountries);
    stateapotamus_1.StateAPotamus.dispatch('NEAREST_CLUB_CHANGE', {
      nearestClub: nearestClub
    });
  }

  var clubsSortedByCountry = sort_clubs_by_country_1.sortClubsByCountry(clubsSorted);
  var clubCountries = get_club_countries_1.getClubCountries(clubsSortedByCountry, nearestClub);
  stateapotamus_1.StateAPotamus.dispatch('SET_CLUBS', {
    clubs: clubs,
    clubsSortedByCountry: clubsSortedByCountry,
    clubCountries: clubCountries,
    nearestClub: nearestClub
  });
};
},{"./sort-clubs-by-name":"scripts/web-components/sky-duck/utils/sort-clubs-by-name.ts","./update-club-distances":"scripts/web-components/sky-duck/utils/update-club-distances.ts","./sort-clubs-by-distance":"scripts/web-components/sky-duck/utils/sort-clubs-by-distance.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","./get-club-countries":"scripts/web-components/sky-duck/utils/get-club-countries.ts","./sort-clubs-by-country":"scripts/web-components/sky-duck/utils/sort-clubs-by-country.ts"}],"scripts/web-components/sky-duck/templates/google-map.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleMapTemplate = void 0;

var GoogleMapTemplate =
/*#__PURE__*/
function () {
  function GoogleMapTemplate(googleMapsKey, coords) {
    _classCallCheck(this, GoogleMapTemplate);

    this._googleMapsKey = googleMapsKey;
    this._coords = coords;

    this._buildGoogleMap();
  }

  _createClass(GoogleMapTemplate, [{
    key: "_buildGoogleMap",
    value: function _buildGoogleMap() {
      var params = {
        key: this._googleMapsKey,
        q: "".concat(this._coords.latitude, ",").concat(this._coords.longitude),
        zoom: '8',
        center: "".concat(this._coords.latitude, ",").concat(this._coords.longitude),
        maptype: 'roadmap'
      };
      var queryString = new URLSearchParams(params).toString();
      var url = "https://google.com/maps/embed/v1/place?".concat(queryString);
      this._googleMap = new DOMParser().parseFromString("<div class=\"map\" id=\"map\">\n                <iframe\n                    src=\"".concat(url, "\"\n                    frameborder=\"0\">\n                </iframe>\n            </div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._googleMap;
    }
  }]);

  return GoogleMapTemplate;
}();

exports.GoogleMapTemplate = GoogleMapTemplate;
},{}],"scripts/web-components/sky-duck/templates/geolocation-error.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeolocationErrorTemplate = void 0;

var GeolocationErrorTemplate =
/*#__PURE__*/
function () {
  function GeolocationErrorTemplate() {
    _classCallCheck(this, GeolocationErrorTemplate);

    this._buildGeolocationErrorHeader();
  }

  _createClass(GeolocationErrorTemplate, [{
    key: "_buildGeolocationErrorHeader",
    value: function _buildGeolocationErrorHeader() {
      this._geolocationError = new DOMParser().parseFromString("\n            <div id='geolocationError' class=\"geolocation-error\">\n                <span>\n                    Geolocation permission has been blocked as the user has dismissed the permission prompt.\n                    This can usually be reset in Page Info which can be accessed by clicking the lock icon next to the URL.\n                </span>\n            </div>\n        ", 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._geolocationError;
    }
  }]);

  return GeolocationErrorTemplate;
}();

exports.GeolocationErrorTemplate = GeolocationErrorTemplate;
},{}],"scripts/web-components/sky-duck/templates/settings-use-current-location-control.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UseCurrentLocationControlTemplate = void 0;

var UseCurrentLocationControlTemplate =
/*#__PURE__*/
function () {
  function UseCurrentLocationControlTemplate(userLocation, eventHandler) {
    _classCallCheck(this, UseCurrentLocationControlTemplate);

    this._eventHandler = eventHandler;
    this._userLocation = userLocation;

    this._buildSettingsUseCurrentLocationControl();
  }

  _createClass(UseCurrentLocationControlTemplate, [{
    key: "_buildSettingsUseCurrentLocationControl",
    value: function _buildSettingsUseCurrentLocationControl() {
      var _this = this;

      this._useCurrentLocationControl = new DOMParser().parseFromString("\n            <div\n                class=\"settings__control\"\n                id=\"useCurrentLocationSetting\">\n                <div class=\"settings-control-name\">\n                    <h4 class=\"settings-control-name__title\">Use Current Location</h4>\n                    <span class=\"settings-control-name__subtitle\">".concat(this._userLocation.name, "</span>\n                </div>\n                <zooduck-icon-location\n                    id=\"useCurrentLocationControl\"\n                    size=\"35\"\n                    color=\"var(--icongray)\">\n                </zooduck-icon-location>\n            </div>\n        "), 'text/html').body.firstChild;

      if (!this._eventHandler) {
        return;
      }

      this._useCurrentLocationControl.addEventListener('click', function (e) {
        _this._eventHandler(e);
      });
    }
  }, {
    key: "html",
    get: function get() {
      return this._useCurrentLocationControl;
    }
  }]);

  return UseCurrentLocationControlTemplate;
}();

exports.UseCurrentLocationControlTemplate = UseCurrentLocationControlTemplate;
},{}],"scripts/web-components/sky-duck/templates/settings-location-settings-control.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocationSettingsControlTemplate = void 0;

var LocationSettingsControlTemplate =
/*#__PURE__*/
function () {
  function LocationSettingsControlTemplate(eventHandler) {
    _classCallCheck(this, LocationSettingsControlTemplate);

    this._eventHandler = eventHandler;

    this._buildSettingsSetCurrentLocationControl();
  }

  _createClass(LocationSettingsControlTemplate, [{
    key: "_buildSettingsSetCurrentLocationControl",
    value: function _buildSettingsSetCurrentLocationControl() {
      var _this = this;

      this._locationSettingsControl = new DOMParser().parseFromString("\n            <div\n                class=\"settings__control --sub-settings\"\n                id=\"setCurrentLocationSetting\">\n                <div class=\"settings-control-name\">\n                    <h4 class=\"settings-control-name__title\">Location Settings</h4>\n                </div>\n            </div>\n        ", 'text/html').body.firstChild;

      if (!this._eventHandler) {
        return;
      }

      this._locationSettingsControl.addEventListener('click', function (e) {
        _this._eventHandler(e);
      });
    }
  }, {
    key: "html",
    get: function get() {
      return this._locationSettingsControl;
    }
  }]);

  return LocationSettingsControlTemplate;
}();

exports.LocationSettingsControlTemplate = LocationSettingsControlTemplate;
},{}],"scripts/web-components/sky-duck/templates/settings-version-info.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SettingsVersionInfoTemplate = void 0;

var SettingsVersionInfoTemplate =
/*#__PURE__*/
function () {
  function SettingsVersionInfoTemplate(version) {
    _classCallCheck(this, SettingsVersionInfoTemplate);

    this._version = version;

    this._buildVersionInfo();
  }

  _createClass(SettingsVersionInfoTemplate, [{
    key: "_buildVersionInfo",
    value: function _buildVersionInfo() {
      this._versionInfo = new DOMParser().parseFromString("\n            <div\n                id=\"versionInfo\"\n                class=\"settings__version-info\">\n                <a href=\"https://github.com/zooduck/skyduck/\" target=\"_blank\">skyduck ".concat(this._version, "</a>\n            </div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._versionInfo;
    }
  }]);

  return SettingsVersionInfoTemplate;
}();

exports.SettingsVersionInfoTemplate = SettingsVersionInfoTemplate;
},{}],"scripts/web-components/sky-duck/templates/attribution.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttributionTemplate = void 0;

var AttributionTemplate =
/*#__PURE__*/
function () {
  function AttributionTemplate(className) {
    _classCallCheck(this, AttributionTemplate);

    this._className = className || '';

    this._buildAttribution();
  }

  _createClass(AttributionTemplate, [{
    key: "_buildAttribution",
    value: function _buildAttribution() {
      this._attribution = new DOMParser().parseFromString("\n            <div class=\"".concat(this._className, "\">\n                <a href=\"https://darksky.net/poweredby/\" target=\"_blank\">\n                    <img src=\"https://darksky.net/dev/img/attribution/poweredby-darkbackground.png\" alt=\"Powered by Dark Sky\" />\n                </a>\n            </div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._attribution;
    }
  }]);

  return AttributionTemplate;
}();

exports.AttributionTemplate = AttributionTemplate;
},{}],"scripts/web-components/sky-duck/templates/settings.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SettingsTemplate = void 0;

var google_map_template_1 = require("./google-map.template");

var location_info_template_1 = require("./location-info.template");

var settings_toggle_template_1 = require("./settings-toggle.template");

var settings_search_template_1 = require("./settings-search.template");

var geolocation_error_template_1 = require("./geolocation-error.template");
/* eslint-enable no-unused-vars */


var settings_use_current_location_control_template_1 = require("./settings-use-current-location-control.template");

var not_found_template_1 = require("./not-found.template");

var settings_location_settings_control_template_1 = require("./settings-location-settings-control.template");

var stateapotamus_1 = require("../state/stateapotamus");

var settings_version_info_template_1 = require("./settings-version-info.template");

var attribution_template_1 = require("./attribution.template");

var SettingsTemplate =
/*#__PURE__*/
function () {
  function SettingsTemplate(settingsPageEventHandlers) {
    _classCallCheck(this, SettingsTemplate);

    var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
        clubs = _stateapotamus_1$Stat.clubs,
        googleMapsKey = _stateapotamus_1$Stat.googleMapsKey,
        settings = _stateapotamus_1$Stat.settings,
        locationDetails = _stateapotamus_1$Stat.locationDetails,
        userLocation = _stateapotamus_1$Stat.userLocation,
        userDeniedGeolocation = _stateapotamus_1$Stat.userDeniedGeolocation;

    this._ACTIVE_CAROUSEL_SETTING_ID = 'activeCarouselSetting';
    this._GOOGLE_MAP_ID = 'map';
    this._FORECAST_DISPLAY_MODE_SETTING_ID = 'forecastDisplayModeSetting';
    this._INCLUDE_NIGHTTIME_WEATHER_SETTING_ID = 'includeNighttimeWeatherSetting';
    this._LOCATION_INFO_ID = 'locationInfo';
    this._LOCATION_SEARCH_INPUT_ID = 'locationSearchInput';
    this._SET_CURRENT_LOCATION_SETTING_ID = 'setCurrentLocationSetting';
    this._USE_CURRENT_LOCATION_SETTING_ID = 'useCurrentLocationSetting';
    this._clubs = clubs;
    this._googleMapsKey = googleMapsKey;
    this._locationDetails = locationDetails;
    this._settings = settings;
    this._settingsPageEventHandlers = settingsPageEventHandlers;
    this._userLocation = userLocation;
    this._userDeniedGeolocation = userDeniedGeolocation;

    this._buildSettings();
  }

  _createClass(SettingsTemplate, [{
    key: "_buildSettings",
    value: function _buildSettings() {
      this._settingsPage = new DOMParser().parseFromString("\n            <div\n                id=\"settings\"\n                class=\"settings --render-once\">\n                <div class=\"settings-grid\"></div>\n            </div>\n        ", 'text/html').body.firstChild;
      this._geolocationError = this._buildGeolocationError();
      this._map = this._buildMap();
      this._locationInfo = this._buildLocationInfo();
      this._search = this._buildLocationSearchInput();
      this._extendedForecastToggle = this._buildExtendedForecastToggle();
      this._activeCarouselToggle = this._buildActiveCarouselToggle();
      this._useCurrentLocationControl = this._buildUseCurrentLocationControl();
      this._setCurrentLocationControl = this._buildLocationSettingsControl();
      this._includeNighttimeWeatherToggle = this._buildNighttimeWeatherToggle();
      this._attribution = this._buildAttribution();
      this._versionInfo = this._buildVersionInfo();

      var settingsGrid = this._settingsPage.querySelector('.settings-grid');

      if (this._userDeniedGeolocation) {
        settingsGrid.appendChild(this._geolocationError);
      }

      settingsGrid.appendChild(this._search);
      settingsGrid.appendChild(this._map);
      settingsGrid.appendChild(this._locationInfo);
      settingsGrid.appendChild(this._extendedForecastToggle);
      settingsGrid.appendChild(this._includeNighttimeWeatherToggle);
      settingsGrid.appendChild(this._activeCarouselToggle);
      settingsGrid.appendChild(this._useCurrentLocationControl);
      settingsGrid.appendChild(this._setCurrentLocationControl);
      settingsGrid.appendChild(this._attribution);
      settingsGrid.appendChild(this._versionInfo);
    }
  }, {
    key: "_buildActiveCarouselToggle",
    value: function _buildActiveCarouselToggle() {
      if (!this._clubs) {
        return new not_found_template_1.NotFoundTemplate('CLUBS_NOT_FOUND', this._ACTIVE_CAROUSEL_SETTING_ID).html;
      }

      var toggleState = this._settings.activeCarousel === 'club-list' ? 'on' : 'off';
      var _ref = [this._ACTIVE_CAROUSEL_SETTING_ID, 'View Clubs', ''],
          id = _ref[0],
          title = _ref[1],
          subTitle = _ref[2];
      var eventHandler = this._settingsPageEventHandlers.toggleActiveCarouselHandler;
      return new settings_toggle_template_1.SettingsToggleTemplate(id, title, subTitle, toggleState, false, eventHandler).html;
    }
  }, {
    key: "_buildAttribution",
    value: function _buildAttribution() {
      return new attribution_template_1.AttributionTemplate('settings__attribution').html;
    }
  }, {
    key: "_buildExtendedForecastToggle",
    value: function _buildExtendedForecastToggle() {
      var toggleState = this._settings.forecastDisplayMode === 'extended' ? 'on' : 'off';
      var _ref2 = [this._FORECAST_DISPLAY_MODE_SETTING_ID, 'Hourly Forecast', ''],
          id = _ref2[0],
          title = _ref2[1],
          subTitle = _ref2[2];
      var eventHandler = this._settingsPageEventHandlers.toggleForecastDisplayModeHandler;
      return new settings_toggle_template_1.SettingsToggleTemplate(id, title, subTitle, toggleState, false, eventHandler).html;
    }
  }, {
    key: "_buildGeolocationError",
    value: function _buildGeolocationError() {
      return new geolocation_error_template_1.GeolocationErrorTemplate().html;
    }
  }, {
    key: "_buildNighttimeWeatherToggle",
    value: function _buildNighttimeWeatherToggle() {
      var toggleState = this._settings.includeNighttimeWeather ? 'on' : 'off';
      var _ref3 = [this._INCLUDE_NIGHTTIME_WEATHER_SETTING_ID, 'Include night-time weather', 'Hourly Forecast only'],
          id = _ref3[0],
          title = _ref3[1],
          subTitle = _ref3[2];
      var eventHandler = this._settingsPageEventHandlers.toggleIncludeNighttimeWeatherHandler;
      var disabled = this._settings.forecastDisplayMode !== 'extended';
      return new settings_toggle_template_1.SettingsToggleTemplate(id, title, subTitle, toggleState, disabled, eventHandler).html;
    }
  }, {
    key: "_buildLocationSettingsControl",
    value: function _buildLocationSettingsControl() {
      if (!this._userLocation) {
        return new not_found_template_1.NotFoundTemplate('USER_LOCATION_NOT_FOUND', this._SET_CURRENT_LOCATION_SETTING_ID).html;
      }

      var eventHandler = this._settingsPageEventHandlers.toggleLocationSettingsHandler;
      return new settings_location_settings_control_template_1.LocationSettingsControlTemplate(eventHandler).html;
    }
  }, {
    key: "_buildMap",
    value: function _buildMap() {
      if (!this._locationDetails.name) {
        return new not_found_template_1.NotFoundTemplate('COORDS_FOR_MAP_NOT_FOUND', this._GOOGLE_MAP_ID).html;
      }

      return new google_map_template_1.GoogleMapTemplate(this._googleMapsKey, this._locationDetails.coords).html;
    }
  }, {
    key: "_buildLocationInfo",
    value: function _buildLocationInfo() {
      if (!this._locationDetails.name) {
        return new not_found_template_1.NotFoundTemplate('LOCATION_DETAILS_NOT_FOUND', this._LOCATION_INFO_ID).html;
      }

      return new location_info_template_1.LocationInfoTemplate(this._locationDetails, this._LOCATION_INFO_ID).html;
    }
  }, {
    key: "_buildLocationSearchInput",
    value: function _buildLocationSearchInput() {
      var eventHandler = this._settingsPageEventHandlers.onLocationChangeHandler;
      return new settings_search_template_1.SearchTemplate(this._LOCATION_SEARCH_INPUT_ID, 'Location Search', 'e.g. Perris, CA 92570, USA', false, eventHandler).html;
    }
  }, {
    key: "_buildUseCurrentLocationControl",
    value: function _buildUseCurrentLocationControl() {
      if (!this._userLocation) {
        return new not_found_template_1.NotFoundTemplate('USER_LOCATION_NOT_FOUND', this._USE_CURRENT_LOCATION_SETTING_ID).html;
      }

      var eventHandler = this._settingsPageEventHandlers.getForecastForCurrentLocationHandler;
      return new settings_use_current_location_control_template_1.UseCurrentLocationControlTemplate(this._userLocation, eventHandler).html;
    }
  }, {
    key: "_buildVersionInfo",
    value: function _buildVersionInfo() {
      var _stateapotamus_1$Stat2 = stateapotamus_1.StateAPotamus.getState(),
          version = _stateapotamus_1$Stat2.version;

      return new settings_version_info_template_1.SettingsVersionInfoTemplate(version).html;
    }
  }, {
    key: "activeCarouselToggle",
    get: function get() {
      return this._activeCarouselToggle;
    }
  }, {
    key: "attribution",
    get: function get() {
      return this._attribution;
    }
  }, {
    key: "extendedForecastToggle",
    get: function get() {
      return this._extendedForecastToggle;
    }
  }, {
    key: "geolocationError",
    get: function get() {
      return this._geolocationError;
    }
  }, {
    key: "html",
    get: function get() {
      return this._settingsPage;
    }
  }, {
    key: "includeNighttimeWeatherToggle",
    get: function get() {
      return this._includeNighttimeWeatherToggle;
    }
  }, {
    key: "locationInfo",
    get: function get() {
      return this._locationInfo;
    }
  }, {
    key: "map",
    get: function get() {
      return this._map;
    }
  }, {
    key: "search",
    get: function get() {
      return this._search;
    }
  }, {
    key: "setCurrentLocationControl",
    get: function get() {
      return this._setCurrentLocationControl;
    }
  }, {
    key: "useCurrentLocationControl",
    get: function get() {
      return this._useCurrentLocationControl;
    }
  }, {
    key: "versionInfo",
    get: function get() {
      return this._versionInfo;
    }
  }]);

  return SettingsTemplate;
}();

exports.SettingsTemplate = SettingsTemplate;
},{"./google-map.template":"scripts/web-components/sky-duck/templates/google-map.template.ts","./location-info.template":"scripts/web-components/sky-duck/templates/location-info.template.ts","./settings-toggle.template":"scripts/web-components/sky-duck/templates/settings-toggle.template.ts","./settings-search.template":"scripts/web-components/sky-duck/templates/settings-search.template.ts","./geolocation-error.template":"scripts/web-components/sky-duck/templates/geolocation-error.template.ts","./settings-use-current-location-control.template":"scripts/web-components/sky-duck/templates/settings-use-current-location-control.template.ts","./not-found.template":"scripts/web-components/sky-duck/templates/not-found.template.ts","./settings-location-settings-control.template":"scripts/web-components/sky-duck/templates/settings-location-settings-control.template.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","./settings-version-info.template":"scripts/web-components/sky-duck/templates/settings-version-info.template.ts","./attribution.template":"scripts/web-components/sky-duck/templates/attribution.template.ts"}],"scripts/web-components/sky-duck/utils/sub-settings.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subSettings = void 0;
exports.subSettings = {
  LOCATION_SETTINGS: 'LOCATION_SETTINGS'
};
},{}],"scripts/web-components/sky-duck/event-handlers/settings-page.event-handlers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.settingsPageEventHandlers = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

var sub_settings_1 = require("../utils/sub-settings");

exports.settingsPageEventHandlers = function settingsPageEventHandlers() {
  var _this = this;

  var getForecastForCurrentLocationHandler = function getForecastForCurrentLocationHandler() {
    try {
      _this.location = stateapotamus_1.StateAPotamus.getState().userLocation.name;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  var onLocationChangeHandler = function onLocationChangeHandler(e) {
    var location = e.detail.value;
    _this.location = location;
  };

  var toggleActiveCarouselHandler = function toggleActiveCarouselHandler() {
    var activeCarousel;
    var headerTitle;
    var headerSubTitle;

    if (stateapotamus_1.StateAPotamus.getState().settings.activeCarousel === 'forecast') {
      activeCarousel = 'club-list';
      headerTitle = stateapotamus_1.StateAPotamus.getState().currentClubListCountry;
      headerSubTitle = 'Dropzones';
    } else {
      activeCarousel = 'forecast';
      headerTitle = stateapotamus_1.StateAPotamus.getState().locationDetails.name;
      headerSubTitle = stateapotamus_1.StateAPotamus.getState().locationDetails.address;
    }

    stateapotamus_1.StateAPotamus.dispatch('TOGGLE_ACTIVE_CAROUSEL', {
      headerSubTitle: headerSubTitle,
      headerTitle: headerTitle,
      settings: Object.assign(Object.assign({}, stateapotamus_1.StateAPotamus.getState().settings), {
        activeCarousel: activeCarousel
      })
    });
  };

  var toggleForecastDisplayModeHandler = function toggleForecastDisplayModeHandler() {
    var forecastDisplayMode = stateapotamus_1.StateAPotamus.getState().settings.forecastDisplayMode === 'extended' ? 'standard' : 'extended';
    stateapotamus_1.StateAPotamus.dispatch('TOGGLE_FORECAST_DISPLAY_MODE', {
      settings: Object.assign(Object.assign({}, stateapotamus_1.StateAPotamus.getState().settings), {
        forecastDisplayMode: forecastDisplayMode
      })
    });
  };

  var toggleIncludeNighttimeWeatherHandler = function toggleIncludeNighttimeWeatherHandler() {
    var includeNighttimeWeather = stateapotamus_1.StateAPotamus.getState().settings.includeNighttimeWeather;
    stateapotamus_1.StateAPotamus.dispatch('TOGGLE_INCLUDE_NIGHTTIME_WEATHER', {
      settings: Object.assign(Object.assign({}, stateapotamus_1.StateAPotamus.getState().settings), {
        includeNighttimeWeather: !includeNighttimeWeather
      })
    });
  };

  var toggleLocationSettingsHandler = function toggleLocationSettingsHandler() {
    stateapotamus_1.StateAPotamus.dispatch('TOGGLE_SUB_SETTINGS_LOCATION_SETTINGS', {
      currentSubSettings: sub_settings_1.subSettings.LOCATION_SETTINGS
    });
  };

  return {
    getForecastForCurrentLocationHandler: getForecastForCurrentLocationHandler.bind(this),
    onLocationChangeHandler: onLocationChangeHandler.bind(this),
    toggleActiveCarouselHandler: toggleActiveCarouselHandler.bind(this),
    toggleForecastDisplayModeHandler: toggleForecastDisplayModeHandler.bind(this),
    toggleLocationSettingsHandler: toggleLocationSettingsHandler.bind(this),
    toggleIncludeNighttimeWeatherHandler: toggleIncludeNighttimeWeatherHandler.bind(this)
  };
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../utils/sub-settings":"scripts/web-components/sky-duck/utils/sub-settings.ts"}],"scripts/web-components/sky-duck/utils/update-settings-page.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSettingsPage = void 0;

var settings_template_1 = require("../templates/settings.template");

var stateapotamus_1 = require("../state/stateapotamus");

var settings_page_event_handlers_1 = require("../event-handlers/settings-page.event-handlers");

exports.updateSettingsPage = function updateSettingsPage(prop) {
  return __awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var settingsPage, eventHandlers, newSettings;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            settingsPage = this.shadowRoot.querySelector('#settings');

            if (!(!settingsPage || !stateapotamus_1.StateAPotamus.getState().locationDetails)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return");

          case 3:
            eventHandlers = settings_page_event_handlers_1.settingsPageEventHandlers.call(this);
            newSettings = new settings_template_1.SettingsTemplate(eventHandlers);
            _context.t0 = prop;
            _context.next = _context.t0 === 'locationDetails' ? 8 : _context.t0 === 'activeCarousel' ? 11 : _context.t0 === 'forecastDisplayMode' ? 13 : _context.t0 === 'includeNighttimeWeather' ? 15 : _context.t0 === 'userLocation' ? 17 : 19;
            break;

          case 8:
            settingsPage.querySelector('#map').replaceWith(newSettings.map);
            settingsPage.querySelector('#locationInfo').replaceWith(newSettings.locationInfo);
            return _context.abrupt("break", 19);

          case 11:
            settingsPage.querySelector('#activeCarouselSetting').replaceWith(newSettings.activeCarouselToggle);
            return _context.abrupt("break", 19);

          case 13:
            settingsPage.querySelector('#forecastDisplayModeSetting').replaceWith(newSettings.extendedForecastToggle);
            return _context.abrupt("break", 19);

          case 15:
            settingsPage.querySelector('#includeNighttimeWeatherSetting').replaceWith(newSettings.includeNighttimeWeatherToggle);
            return _context.abrupt("break", 19);

          case 17:
            settingsPage.querySelector('#useCurrentLocationSetting').replaceWith(newSettings.useCurrentLocationControl);
            return _context.abrupt("break", 19);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};
},{"../templates/settings.template":"scripts/web-components/sky-duck/templates/settings.template.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../event-handlers/settings-page.event-handlers":"scripts/web-components/sky-duck/event-handlers/settings-page.event-handlers.ts"}],"scripts/web-components/sky-duck/templates/header.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderTemplate = void 0;

var HeaderTemplate =
/*#__PURE__*/
function () {
  function HeaderTemplate(title, subTitle, eventHandler) {
    _classCallCheck(this, HeaderTemplate);

    this._eventHandler = eventHandler;
    this._subTitle = subTitle || '';
    this._title = title || '';

    this._buildHeader();
  }

  _createClass(HeaderTemplate, [{
    key: "_buildHeader",
    value: function _buildHeader() {
      var _this = this;

      this._header = new DOMParser().parseFromString("\n            <div\n                class=\"header --render-once\"\n                id=\"header\">\n                <zooduck-icon-menu\n                    class=\"header__settings-control\"\n                    id=\"settingsToggle\"\n                    color=\"var(--white)\"\n                    size=\"30\">\n                </zooduck-icon-menu>\n                <zooduck-icon-skyduck-alt\n                    class=\"header__logo\"\n                    size=\"40\"\n                    color=\"var(--lightskyblue)\"\n                    backgroundcolor=\"var(--white)\">\n                </zooduck-icon-skyduck-alt>\n                <div\n                class=\"header-title\"\n                id=\"headerTitle\">\n                    <div class=\"header-title__item\">".concat(this._title, "</div>\n                    <div class=\"header-title__item --sub-title\">").concat(this._subTitle, "</div>\n                </div>\n            </div>\n        "), 'text/html').body.firstChild;

      if (!this._eventHandler) {
        return;
      }

      this._header.querySelector('#settingsToggle').addEventListener('click', function (e) {
        _this._eventHandler(e);
      });
    }
  }, {
    key: "html",
    get: function get() {
      return this._header;
    }
  }]);

  return HeaderTemplate;
}();

exports.HeaderTemplate = HeaderTemplate;
},{}],"scripts/web-components/sky-duck/utils/update-header-title.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHeaderTitle = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

var general_event_handlers_1 = require("../event-handlers/general.event-handlers");

var header_template_1 = require("../templates/header.template");

exports.updateHeaderTitle = function updateHeaderTitle() {
  var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
      headerTitle = _stateapotamus_1$Stat.headerTitle,
      headerSubTitle = _stateapotamus_1$Stat.headerSubTitle;

  var header = this.shadowRoot.querySelector('#header');

  if (!header) {
    return;
  }

  var eventHandler = general_event_handlers_1.generalEventHandlers.call(this).toggleSettingsHandler;
  var newHeader = new header_template_1.HeaderTemplate(headerTitle, headerSubTitle, eventHandler).html;
  header.replaceWith(newHeader);
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../event-handlers/general.event-handlers":"scripts/web-components/sky-duck/event-handlers/general.event-handlers.ts","../templates/header.template":"scripts/web-components/sky-duck/templates/header.template.ts"}],"../node_modules/luxon/build/cjs-browser/luxon.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o) {
  var i = 0;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  i = o[Symbol.iterator]();
  return i.next.bind(i);
}

// these aren't really private, but nor are they really useful to document

/**
 * @private
 */
var LuxonError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(LuxonError, _Error);

  function LuxonError() {
    return _Error.apply(this, arguments) || this;
  }

  return LuxonError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * @private
 */


var InvalidDateTimeError = /*#__PURE__*/function (_LuxonError) {
  _inheritsLoose(InvalidDateTimeError, _LuxonError);

  function InvalidDateTimeError(reason) {
    return _LuxonError.call(this, "Invalid DateTime: " + reason.toMessage()) || this;
  }

  return InvalidDateTimeError;
}(LuxonError);
/**
 * @private
 */

var InvalidIntervalError = /*#__PURE__*/function (_LuxonError2) {
  _inheritsLoose(InvalidIntervalError, _LuxonError2);

  function InvalidIntervalError(reason) {
    return _LuxonError2.call(this, "Invalid Interval: " + reason.toMessage()) || this;
  }

  return InvalidIntervalError;
}(LuxonError);
/**
 * @private
 */

var InvalidDurationError = /*#__PURE__*/function (_LuxonError3) {
  _inheritsLoose(InvalidDurationError, _LuxonError3);

  function InvalidDurationError(reason) {
    return _LuxonError3.call(this, "Invalid Duration: " + reason.toMessage()) || this;
  }

  return InvalidDurationError;
}(LuxonError);
/**
 * @private
 */

var ConflictingSpecificationError = /*#__PURE__*/function (_LuxonError4) {
  _inheritsLoose(ConflictingSpecificationError, _LuxonError4);

  function ConflictingSpecificationError() {
    return _LuxonError4.apply(this, arguments) || this;
  }

  return ConflictingSpecificationError;
}(LuxonError);
/**
 * @private
 */

var InvalidUnitError = /*#__PURE__*/function (_LuxonError5) {
  _inheritsLoose(InvalidUnitError, _LuxonError5);

  function InvalidUnitError(unit) {
    return _LuxonError5.call(this, "Invalid unit " + unit) || this;
  }

  return InvalidUnitError;
}(LuxonError);
/**
 * @private
 */

var InvalidArgumentError = /*#__PURE__*/function (_LuxonError6) {
  _inheritsLoose(InvalidArgumentError, _LuxonError6);

  function InvalidArgumentError() {
    return _LuxonError6.apply(this, arguments) || this;
  }

  return InvalidArgumentError;
}(LuxonError);
/**
 * @private
 */

var ZoneIsAbstractError = /*#__PURE__*/function (_LuxonError7) {
  _inheritsLoose(ZoneIsAbstractError, _LuxonError7);

  function ZoneIsAbstractError() {
    return _LuxonError7.call(this, "Zone is an abstract class") || this;
  }

  return ZoneIsAbstractError;
}(LuxonError);

/**
 * @private
 */
var n = "numeric",
    s = "short",
    l = "long";
var DATE_SHORT = {
  year: n,
  month: n,
  day: n
};
var DATE_MED = {
  year: n,
  month: s,
  day: n
};
var DATE_FULL = {
  year: n,
  month: l,
  day: n
};
var DATE_HUGE = {
  year: n,
  month: l,
  day: n,
  weekday: l
};
var TIME_SIMPLE = {
  hour: n,
  minute: n
};
var TIME_WITH_SECONDS = {
  hour: n,
  minute: n,
  second: n
};
var TIME_WITH_SHORT_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  timeZoneName: s
};
var TIME_WITH_LONG_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  timeZoneName: l
};
var TIME_24_SIMPLE = {
  hour: n,
  minute: n,
  hour12: false
};
/**
 * {@link toLocaleString}; format like '09:30:23', always 24-hour.
 */

var TIME_24_WITH_SECONDS = {
  hour: n,
  minute: n,
  second: n,
  hour12: false
};
/**
 * {@link toLocaleString}; format like '09:30:23 EDT', always 24-hour.
 */

var TIME_24_WITH_SHORT_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  hour12: false,
  timeZoneName: s
};
/**
 * {@link toLocaleString}; format like '09:30:23 Eastern Daylight Time', always 24-hour.
 */

var TIME_24_WITH_LONG_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  hour12: false,
  timeZoneName: l
};
/**
 * {@link toLocaleString}; format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
 */

var DATETIME_SHORT = {
  year: n,
  month: n,
  day: n,
  hour: n,
  minute: n
};
/**
 * {@link toLocaleString}; format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
 */

var DATETIME_SHORT_WITH_SECONDS = {
  year: n,
  month: n,
  day: n,
  hour: n,
  minute: n,
  second: n
};
var DATETIME_MED = {
  year: n,
  month: s,
  day: n,
  hour: n,
  minute: n
};
var DATETIME_MED_WITH_SECONDS = {
  year: n,
  month: s,
  day: n,
  hour: n,
  minute: n,
  second: n
};
var DATETIME_MED_WITH_WEEKDAY = {
  year: n,
  month: s,
  day: n,
  weekday: s,
  hour: n,
  minute: n
};
var DATETIME_FULL = {
  year: n,
  month: l,
  day: n,
  hour: n,
  minute: n,
  timeZoneName: s
};
var DATETIME_FULL_WITH_SECONDS = {
  year: n,
  month: l,
  day: n,
  hour: n,
  minute: n,
  second: n,
  timeZoneName: s
};
var DATETIME_HUGE = {
  year: n,
  month: l,
  day: n,
  weekday: l,
  hour: n,
  minute: n,
  timeZoneName: l
};
var DATETIME_HUGE_WITH_SECONDS = {
  year: n,
  month: l,
  day: n,
  weekday: l,
  hour: n,
  minute: n,
  second: n,
  timeZoneName: l
};

/*
  This is just a junk drawer, containing anything used across multiple classes.
  Because Luxon is small(ish), this should stay small and we won't worry about splitting
  it up into, say, parsingUtil.js and basicUtil.js and so on. But they are divided up by feature area.
*/
/**
 * @private
 */
// TYPES

function isUndefined(o) {
  return typeof o === "undefined";
}
function isNumber(o) {
  return typeof o === "number";
}
function isInteger(o) {
  return typeof o === "number" && o % 1 === 0;
}
function isString(o) {
  return typeof o === "string";
}
function isDate(o) {
  return Object.prototype.toString.call(o) === "[object Date]";
} // CAPABILITIES

function hasIntl() {
  try {
    return typeof Intl !== "undefined" && Intl.DateTimeFormat;
  } catch (e) {
    return false;
  }
}
function hasFormatToParts() {
  return !isUndefined(Intl.DateTimeFormat.prototype.formatToParts);
}
function hasRelative() {
  try {
    return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
  } catch (e) {
    return false;
  }
} // OBJECTS AND ARRAYS

function maybeArray(thing) {
  return Array.isArray(thing) ? thing : [thing];
}
function bestBy(arr, by, compare) {
  if (arr.length === 0) {
    return undefined;
  }

  return arr.reduce(function (best, next) {
    var pair = [by(next), next];

    if (!best) {
      return pair;
    } else if (compare(best[0], pair[0]) === best[0]) {
      return best;
    } else {
      return pair;
    }
  }, null)[1];
}
function pick(obj, keys) {
  return keys.reduce(function (a, k) {
    a[k] = obj[k];
    return a;
  }, {});
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
} // NUMBERS AND STRINGS

function integerBetween(thing, bottom, top) {
  return isInteger(thing) && thing >= bottom && thing <= top;
} // x % n but takes the sign of n instead of x

function floorMod(x, n) {
  return x - n * Math.floor(x / n);
}
function padStart(input, n) {
  if (n === void 0) {
    n = 2;
  }

  if (input.toString().length < n) {
    return ("0".repeat(n) + input).slice(-n);
  } else {
    return input.toString();
  }
}
function parseInteger(string) {
  if (isUndefined(string) || string === null || string === "") {
    return undefined;
  } else {
    return parseInt(string, 10);
  }
}
function parseMillis(fraction) {
  // Return undefined (instead of 0) in these cases, where fraction is not set
  if (isUndefined(fraction) || fraction === null || fraction === "") {
    return undefined;
  } else {
    var f = parseFloat("0." + fraction) * 1000;
    return Math.floor(f);
  }
}
function roundTo(number, digits, towardZero) {
  if (towardZero === void 0) {
    towardZero = false;
  }

  var factor = Math.pow(10, digits),
      rounder = towardZero ? Math.trunc : Math.round;
  return rounder(number * factor) / factor;
} // DATE BASICS

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}
function daysInMonth(year, month) {
  var modMonth = floorMod(month - 1, 12) + 1,
      modYear = year + (month - modMonth) / 12;

  if (modMonth === 2) {
    return isLeapYear(modYear) ? 29 : 28;
  } else {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
  }
} // covert a calendar object to a local timestamp (epoch, but with the offset baked in)

function objToLocalTS(obj) {
  var d = Date.UTC(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute, obj.second, obj.millisecond); // for legacy reasons, years between 0 and 99 are interpreted as 19XX; revert that

  if (obj.year < 100 && obj.year >= 0) {
    d = new Date(d);
    d.setUTCFullYear(d.getUTCFullYear() - 1900);
  }

  return +d;
}
function weeksInWeekYear(weekYear) {
  var p1 = (weekYear + Math.floor(weekYear / 4) - Math.floor(weekYear / 100) + Math.floor(weekYear / 400)) % 7,
      last = weekYear - 1,
      p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) + Math.floor(last / 400)) % 7;
  return p1 === 4 || p2 === 3 ? 53 : 52;
}
function untruncateYear(year) {
  if (year > 99) {
    return year;
  } else return year > 60 ? 1900 + year : 2000 + year;
} // PARSING

function parseZoneInfo(ts, offsetFormat, locale, timeZone) {
  if (timeZone === void 0) {
    timeZone = null;
  }

  var date = new Date(ts),
      intlOpts = {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };

  if (timeZone) {
    intlOpts.timeZone = timeZone;
  }

  var modified = Object.assign({
    timeZoneName: offsetFormat
  }, intlOpts),
      intl = hasIntl();

  if (intl && hasFormatToParts()) {
    var parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find(function (m) {
      return m.type.toLowerCase() === "timezonename";
    });
    return parsed ? parsed.value : null;
  } else if (intl) {
    // this probably doesn't work for all locales
    var without = new Intl.DateTimeFormat(locale, intlOpts).format(date),
        included = new Intl.DateTimeFormat(locale, modified).format(date),
        diffed = included.substring(without.length),
        trimmed = diffed.replace(/^[, \u200e]+/, "");
    return trimmed;
  } else {
    return null;
  }
} // signedOffset('-5', '30') -> -330

function signedOffset(offHourStr, offMinuteStr) {
  var offHour = parseInt(offHourStr, 10); // don't || this because we want to preserve -0

  if (Number.isNaN(offHour)) {
    offHour = 0;
  }

  var offMin = parseInt(offMinuteStr, 10) || 0,
      offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
  return offHour * 60 + offMinSigned;
} // COERCION

function asNumber(value) {
  var numericValue = Number(value);
  if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue)) throw new InvalidArgumentError("Invalid unit value " + value);
  return numericValue;
}
function normalizeObject(obj, normalizer, nonUnitKeys) {
  var normalized = {};

  for (var u in obj) {
    if (hasOwnProperty(obj, u)) {
      if (nonUnitKeys.indexOf(u) >= 0) continue;
      var v = obj[u];
      if (v === undefined || v === null) continue;
      normalized[normalizer(u)] = asNumber(v);
    }
  }

  return normalized;
}
function formatOffset(offset, format) {
  var hours = Math.trunc(offset / 60),
      minutes = Math.abs(offset % 60),
      sign = hours >= 0 && !Object.is(hours, -0) ? "+" : "-",
      base = "" + sign + Math.abs(hours);

  switch (format) {
    case "short":
      return "" + sign + padStart(Math.abs(hours), 2) + ":" + padStart(minutes, 2);

    case "narrow":
      return minutes > 0 ? base + ":" + minutes : base;

    case "techie":
      return "" + sign + padStart(Math.abs(hours), 2) + padStart(minutes, 2);

    default:
      throw new RangeError("Value format " + format + " is out of range for property format");
  }
}
function timeObject(obj) {
  return pick(obj, ["hour", "minute", "second", "millisecond"]);
}
var ianaRegex = /[A-Za-z_+-]{1,256}(:?\/[A-Za-z_+-]{1,256}(\/[A-Za-z_+-]{1,256})?)?/;

function stringify(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}
/**
 * @private
 */


var monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function months(length) {
  switch (length) {
    case "narrow":
      return monthsNarrow;

    case "short":
      return monthsShort;

    case "long":
      return monthsLong;

    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    default:
      return null;
  }
}
var weekdaysLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];
function weekdays(length) {
  switch (length) {
    case "narrow":
      return weekdaysNarrow;

    case "short":
      return weekdaysShort;

    case "long":
      return weekdaysLong;

    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];

    default:
      return null;
  }
}
var meridiems = ["AM", "PM"];
var erasLong = ["Before Christ", "Anno Domini"];
var erasShort = ["BC", "AD"];
var erasNarrow = ["B", "A"];
function eras(length) {
  switch (length) {
    case "narrow":
      return erasNarrow;

    case "short":
      return erasShort;

    case "long":
      return erasLong;

    default:
      return null;
  }
}
function meridiemForDateTime(dt) {
  return meridiems[dt.hour < 12 ? 0 : 1];
}
function weekdayForDateTime(dt, length) {
  return weekdays(length)[dt.weekday - 1];
}
function monthForDateTime(dt, length) {
  return months(length)[dt.month - 1];
}
function eraForDateTime(dt, length) {
  return eras(length)[dt.year < 0 ? 0 : 1];
}
function formatRelativeTime(unit, count, numeric, narrow) {
  if (numeric === void 0) {
    numeric = "always";
  }

  if (narrow === void 0) {
    narrow = false;
  }

  var units = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."]
  };
  var lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;

  if (numeric === "auto" && lastable) {
    var isDay = unit === "days";

    switch (count) {
      case 1:
        return isDay ? "tomorrow" : "next " + units[unit][0];

      case -1:
        return isDay ? "yesterday" : "last " + units[unit][0];

      case 0:
        return isDay ? "today" : "this " + units[unit][0];

    }
  }

  var isInPast = Object.is(count, -0) || count < 0,
      fmtValue = Math.abs(count),
      singular = fmtValue === 1,
      lilUnits = units[unit],
      fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
  return isInPast ? fmtValue + " " + fmtUnit + " ago" : "in " + fmtValue + " " + fmtUnit;
}
function formatString(knownFormat) {
  // these all have the offsets removed because we don't have access to them
  // without all the intl stuff this is backfilling
  var filtered = pick(knownFormat, ["weekday", "era", "year", "month", "day", "hour", "minute", "second", "timeZoneName", "hour12"]),
      key = stringify(filtered),
      dateTimeHuge = "EEEE, LLLL d, yyyy, h:mm a";

  switch (key) {
    case stringify(DATE_SHORT):
      return "M/d/yyyy";

    case stringify(DATE_MED):
      return "LLL d, yyyy";

    case stringify(DATE_FULL):
      return "LLLL d, yyyy";

    case stringify(DATE_HUGE):
      return "EEEE, LLLL d, yyyy";

    case stringify(TIME_SIMPLE):
      return "h:mm a";

    case stringify(TIME_WITH_SECONDS):
      return "h:mm:ss a";

    case stringify(TIME_WITH_SHORT_OFFSET):
      return "h:mm a";

    case stringify(TIME_WITH_LONG_OFFSET):
      return "h:mm a";

    case stringify(TIME_24_SIMPLE):
      return "HH:mm";

    case stringify(TIME_24_WITH_SECONDS):
      return "HH:mm:ss";

    case stringify(TIME_24_WITH_SHORT_OFFSET):
      return "HH:mm";

    case stringify(TIME_24_WITH_LONG_OFFSET):
      return "HH:mm";

    case stringify(DATETIME_SHORT):
      return "M/d/yyyy, h:mm a";

    case stringify(DATETIME_MED):
      return "LLL d, yyyy, h:mm a";

    case stringify(DATETIME_FULL):
      return "LLLL d, yyyy, h:mm a";

    case stringify(DATETIME_HUGE):
      return dateTimeHuge;

    case stringify(DATETIME_SHORT_WITH_SECONDS):
      return "M/d/yyyy, h:mm:ss a";

    case stringify(DATETIME_MED_WITH_SECONDS):
      return "LLL d, yyyy, h:mm:ss a";

    case stringify(DATETIME_MED_WITH_WEEKDAY):
      return "EEE, d LLL yyyy, h:mm a";

    case stringify(DATETIME_FULL_WITH_SECONDS):
      return "LLLL d, yyyy, h:mm:ss a";

    case stringify(DATETIME_HUGE_WITH_SECONDS):
      return "EEEE, LLLL d, yyyy, h:mm:ss a";

    default:
      return dateTimeHuge;
  }
}

function stringifyTokens(splits, tokenToString) {
  var s = "";

  for (var _iterator = _createForOfIteratorHelperLoose(splits), _step; !(_step = _iterator()).done;) {
    var token = _step.value;

    if (token.literal) {
      s += token.val;
    } else {
      s += tokenToString(token.val);
    }
  }

  return s;
}

var _macroTokenToFormatOpts = {
  D: DATE_SHORT,
  DD: DATE_MED,
  DDD: DATE_FULL,
  DDDD: DATE_HUGE,
  t: TIME_SIMPLE,
  tt: TIME_WITH_SECONDS,
  ttt: TIME_WITH_SHORT_OFFSET,
  tttt: TIME_WITH_LONG_OFFSET,
  T: TIME_24_SIMPLE,
  TT: TIME_24_WITH_SECONDS,
  TTT: TIME_24_WITH_SHORT_OFFSET,
  TTTT: TIME_24_WITH_LONG_OFFSET,
  f: DATETIME_SHORT,
  ff: DATETIME_MED,
  fff: DATETIME_FULL,
  ffff: DATETIME_HUGE,
  F: DATETIME_SHORT_WITH_SECONDS,
  FF: DATETIME_MED_WITH_SECONDS,
  FFF: DATETIME_FULL_WITH_SECONDS,
  FFFF: DATETIME_HUGE_WITH_SECONDS
};
/**
 * @private
 */

var Formatter = /*#__PURE__*/function () {
  Formatter.create = function create(locale, opts) {
    if (opts === void 0) {
      opts = {};
    }

    return new Formatter(locale, opts);
  };

  Formatter.parseFormat = function parseFormat(fmt) {
    var current = null,
        currentFull = "",
        bracketed = false;
    var splits = [];

    for (var i = 0; i < fmt.length; i++) {
      var c = fmt.charAt(i);

      if (c === "'") {
        if (currentFull.length > 0) {
          splits.push({
            literal: bracketed,
            val: currentFull
          });
        }

        current = null;
        currentFull = "";
        bracketed = !bracketed;
      } else if (bracketed) {
        currentFull += c;
      } else if (c === current) {
        currentFull += c;
      } else {
        if (currentFull.length > 0) {
          splits.push({
            literal: false,
            val: currentFull
          });
        }

        currentFull = c;
        current = c;
      }
    }

    if (currentFull.length > 0) {
      splits.push({
        literal: bracketed,
        val: currentFull
      });
    }

    return splits;
  };

  Formatter.macroTokenToFormatOpts = function macroTokenToFormatOpts(token) {
    return _macroTokenToFormatOpts[token];
  };

  function Formatter(locale, formatOpts) {
    this.opts = formatOpts;
    this.loc = locale;
    this.systemLoc = null;
  }

  var _proto = Formatter.prototype;

  _proto.formatWithSystemDefault = function formatWithSystemDefault(dt, opts) {
    if (this.systemLoc === null) {
      this.systemLoc = this.loc.redefaultToSystem();
    }

    var df = this.systemLoc.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.format();
  };

  _proto.formatDateTime = function formatDateTime(dt, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.format();
  };

  _proto.formatDateTimeParts = function formatDateTimeParts(dt, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.formatToParts();
  };

  _proto.resolvedOptions = function resolvedOptions(dt, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.resolvedOptions();
  };

  _proto.num = function num(n, p) {
    if (p === void 0) {
      p = 0;
    }

    // we get some perf out of doing this here, annoyingly
    if (this.opts.forceSimple) {
      return padStart(n, p);
    }

    var opts = Object.assign({}, this.opts);

    if (p > 0) {
      opts.padTo = p;
    }

    return this.loc.numberFormatter(opts).format(n);
  };

  _proto.formatDateTimeFromString = function formatDateTimeFromString(dt, fmt) {
    var _this = this;

    var knownEnglish = this.loc.listingMode() === "en",
        useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory" && hasFormatToParts(),
        string = function string(opts, extract) {
      return _this.loc.extract(dt, opts, extract);
    },
        formatOffset = function formatOffset(opts) {
      if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
        return "Z";
      }

      return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
    },
        meridiem = function meridiem() {
      return knownEnglish ? meridiemForDateTime(dt) : string({
        hour: "numeric",
        hour12: true
      }, "dayperiod");
    },
        month = function month(length, standalone) {
      return knownEnglish ? monthForDateTime(dt, length) : string(standalone ? {
        month: length
      } : {
        month: length,
        day: "numeric"
      }, "month");
    },
        weekday = function weekday(length, standalone) {
      return knownEnglish ? weekdayForDateTime(dt, length) : string(standalone ? {
        weekday: length
      } : {
        weekday: length,
        month: "long",
        day: "numeric"
      }, "weekday");
    },
        maybeMacro = function maybeMacro(token) {
      var formatOpts = Formatter.macroTokenToFormatOpts(token);

      if (formatOpts) {
        return _this.formatWithSystemDefault(dt, formatOpts);
      } else {
        return token;
      }
    },
        era = function era(length) {
      return knownEnglish ? eraForDateTime(dt, length) : string({
        era: length
      }, "era");
    },
        tokenToString = function tokenToString(token) {
      // Where possible: http://cldr.unicode.org/translation/date-time#TOC-Stand-Alone-vs.-Format-Styles
      switch (token) {
        // ms
        case "S":
          return _this.num(dt.millisecond);

        case "u": // falls through

        case "SSS":
          return _this.num(dt.millisecond, 3);
        // seconds

        case "s":
          return _this.num(dt.second);

        case "ss":
          return _this.num(dt.second, 2);
        // minutes

        case "m":
          return _this.num(dt.minute);

        case "mm":
          return _this.num(dt.minute, 2);
        // hours

        case "h":
          return _this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);

        case "hh":
          return _this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);

        case "H":
          return _this.num(dt.hour);

        case "HH":
          return _this.num(dt.hour, 2);
        // offset

        case "Z":
          // like +6
          return formatOffset({
            format: "narrow",
            allowZ: _this.opts.allowZ
          });

        case "ZZ":
          // like +06:00
          return formatOffset({
            format: "short",
            allowZ: _this.opts.allowZ
          });

        case "ZZZ":
          // like +0600
          return formatOffset({
            format: "techie",
            allowZ: _this.opts.allowZ
          });

        case "ZZZZ":
          // like EST
          return dt.zone.offsetName(dt.ts, {
            format: "short",
            locale: _this.loc.locale
          });

        case "ZZZZZ":
          // like Eastern Standard Time
          return dt.zone.offsetName(dt.ts, {
            format: "long",
            locale: _this.loc.locale
          });
        // zone

        case "z":
          // like America/New_York
          return dt.zoneName;
        // meridiems

        case "a":
          return meridiem();
        // dates

        case "d":
          return useDateTimeFormatter ? string({
            day: "numeric"
          }, "day") : _this.num(dt.day);

        case "dd":
          return useDateTimeFormatter ? string({
            day: "2-digit"
          }, "day") : _this.num(dt.day, 2);
        // weekdays - standalone

        case "c":
          // like 1
          return _this.num(dt.weekday);

        case "ccc":
          // like 'Tues'
          return weekday("short", true);

        case "cccc":
          // like 'Tuesday'
          return weekday("long", true);

        case "ccccc":
          // like 'T'
          return weekday("narrow", true);
        // weekdays - format

        case "E":
          // like 1
          return _this.num(dt.weekday);

        case "EEE":
          // like 'Tues'
          return weekday("short", false);

        case "EEEE":
          // like 'Tuesday'
          return weekday("long", false);

        case "EEEEE":
          // like 'T'
          return weekday("narrow", false);
        // months - standalone

        case "L":
          // like 1
          return useDateTimeFormatter ? string({
            month: "numeric",
            day: "numeric"
          }, "month") : _this.num(dt.month);

        case "LL":
          // like 01, doesn't seem to work
          return useDateTimeFormatter ? string({
            month: "2-digit",
            day: "numeric"
          }, "month") : _this.num(dt.month, 2);

        case "LLL":
          // like Jan
          return month("short", true);

        case "LLLL":
          // like January
          return month("long", true);

        case "LLLLL":
          // like J
          return month("narrow", true);
        // months - format

        case "M":
          // like 1
          return useDateTimeFormatter ? string({
            month: "numeric"
          }, "month") : _this.num(dt.month);

        case "MM":
          // like 01
          return useDateTimeFormatter ? string({
            month: "2-digit"
          }, "month") : _this.num(dt.month, 2);

        case "MMM":
          // like Jan
          return month("short", false);

        case "MMMM":
          // like January
          return month("long", false);

        case "MMMMM":
          // like J
          return month("narrow", false);
        // years

        case "y":
          // like 2014
          return useDateTimeFormatter ? string({
            year: "numeric"
          }, "year") : _this.num(dt.year);

        case "yy":
          // like 14
          return useDateTimeFormatter ? string({
            year: "2-digit"
          }, "year") : _this.num(dt.year.toString().slice(-2), 2);

        case "yyyy":
          // like 0012
          return useDateTimeFormatter ? string({
            year: "numeric"
          }, "year") : _this.num(dt.year, 4);

        case "yyyyyy":
          // like 000012
          return useDateTimeFormatter ? string({
            year: "numeric"
          }, "year") : _this.num(dt.year, 6);
        // eras

        case "G":
          // like AD
          return era("short");

        case "GG":
          // like Anno Domini
          return era("long");

        case "GGGGG":
          return era("narrow");

        case "kk":
          return _this.num(dt.weekYear.toString().slice(-2), 2);

        case "kkkk":
          return _this.num(dt.weekYear, 4);

        case "W":
          return _this.num(dt.weekNumber);

        case "WW":
          return _this.num(dt.weekNumber, 2);

        case "o":
          return _this.num(dt.ordinal);

        case "ooo":
          return _this.num(dt.ordinal, 3);

        case "q":
          // like 1
          return _this.num(dt.quarter);

        case "qq":
          // like 01
          return _this.num(dt.quarter, 2);

        case "X":
          return _this.num(Math.floor(dt.ts / 1000));

        case "x":
          return _this.num(dt.ts);

        default:
          return maybeMacro(token);
      }
    };

    return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
  };

  _proto.formatDurationFromString = function formatDurationFromString(dur, fmt) {
    var _this2 = this;

    var tokenToField = function tokenToField(token) {
      switch (token[0]) {
        case "S":
          return "millisecond";

        case "s":
          return "second";

        case "m":
          return "minute";

        case "h":
          return "hour";

        case "d":
          return "day";

        case "M":
          return "month";

        case "y":
          return "year";

        default:
          return null;
      }
    },
        tokenToString = function tokenToString(lildur) {
      return function (token) {
        var mapped = tokenToField(token);

        if (mapped) {
          return _this2.num(lildur.get(mapped), token.length);
        } else {
          return token;
        }
      };
    },
        tokens = Formatter.parseFormat(fmt),
        realTokens = tokens.reduce(function (found, _ref) {
      var literal = _ref.literal,
          val = _ref.val;
      return literal ? found : found.concat(val);
    }, []),
        collapsed = dur.shiftTo.apply(dur, realTokens.map(tokenToField).filter(function (t) {
      return t;
    }));

    return stringifyTokens(tokens, tokenToString(collapsed));
  };

  return Formatter;
}();

var Invalid = /*#__PURE__*/function () {
  function Invalid(reason, explanation) {
    this.reason = reason;
    this.explanation = explanation;
  }

  var _proto = Invalid.prototype;

  _proto.toMessage = function toMessage() {
    if (this.explanation) {
      return this.reason + ": " + this.explanation;
    } else {
      return this.reason;
    }
  };

  return Invalid;
}();

/**
 * @interface
 */

var Zone = /*#__PURE__*/function () {
  function Zone() {}

  var _proto = Zone.prototype;

  /**
   * Returns the offset's common name (such as EST) at the specified timestamp
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the name
   * @param {Object} opts - Options to affect the format
   * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
   * @param {string} opts.locale - What locale to return the offset name in.
   * @return {string}
   */
  _proto.offsetName = function offsetName(ts, opts) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Returns the offset's value as a string
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  ;

  _proto.formatOffset = function formatOffset(ts, format) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  ;

  _proto.offset = function offset(ts) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  ;

  _proto.equals = function equals(otherZone) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  ;

  _createClass(Zone, [{
    key: "type",

    /**
     * The type of zone
     * @abstract
     * @type {string}
     */
    get: function get() {
      throw new ZoneIsAbstractError();
    }
    /**
     * The name of this zone.
     * @abstract
     * @type {string}
     */

  }, {
    key: "name",
    get: function get() {
      throw new ZoneIsAbstractError();
    }
    /**
     * Returns whether the offset is known to be fixed for the whole year.
     * @abstract
     * @type {boolean}
     */

  }, {
    key: "universal",
    get: function get() {
      throw new ZoneIsAbstractError();
    }
  }, {
    key: "isValid",
    get: function get() {
      throw new ZoneIsAbstractError();
    }
  }]);

  return Zone;
}();

var singleton = null;
/**
 * Represents the local zone for this Javascript environment.
 * @implements {Zone}
 */

var LocalZone = /*#__PURE__*/function (_Zone) {
  _inheritsLoose(LocalZone, _Zone);

  function LocalZone() {
    return _Zone.apply(this, arguments) || this;
  }

  var _proto = LocalZone.prototype;

  /** @override **/
  _proto.offsetName = function offsetName(ts, _ref) {
    var format = _ref.format,
        locale = _ref.locale;
    return parseZoneInfo(ts, format, locale);
  }
  /** @override **/
  ;

  _proto.formatOffset = function formatOffset$1(ts, format) {
    return formatOffset(this.offset(ts), format);
  }
  /** @override **/
  ;

  _proto.offset = function offset(ts) {
    return -new Date(ts).getTimezoneOffset();
  }
  /** @override **/
  ;

  _proto.equals = function equals(otherZone) {
    return otherZone.type === "local";
  }
  /** @override **/
  ;

  _createClass(LocalZone, [{
    key: "type",

    /** @override **/
    get: function get() {
      return "local";
    }
    /** @override **/

  }, {
    key: "name",
    get: function get() {
      if (hasIntl()) {
        return new Intl.DateTimeFormat().resolvedOptions().timeZone;
      } else return "local";
    }
    /** @override **/

  }, {
    key: "universal",
    get: function get() {
      return false;
    }
  }, {
    key: "isValid",
    get: function get() {
      return true;
    }
  }], [{
    key: "instance",

    /**
     * Get a singleton instance of the local zone
     * @return {LocalZone}
     */
    get: function get() {
      if (singleton === null) {
        singleton = new LocalZone();
      }

      return singleton;
    }
  }]);

  return LocalZone;
}(Zone);

var matchingRegex = RegExp("^" + ianaRegex.source + "$");
var dtfCache = {};

function makeDTF(zone) {
  if (!dtfCache[zone]) {
    dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  return dtfCache[zone];
}

var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
};

function hackyOffset(dtf, date) {
  var formatted = dtf.format(date).replace(/\u200E/g, ""),
      parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted),
      fMonth = parsed[1],
      fDay = parsed[2],
      fYear = parsed[3],
      fHour = parsed[4],
      fMinute = parsed[5],
      fSecond = parsed[6];
  return [fYear, fMonth, fDay, fHour, fMinute, fSecond];
}

function partsOffset(dtf, date) {
  var formatted = dtf.formatToParts(date),
      filled = [];

  for (var i = 0; i < formatted.length; i++) {
    var _formatted$i = formatted[i],
        type = _formatted$i.type,
        value = _formatted$i.value,
        pos = typeToPos[type];

    if (!isUndefined(pos)) {
      filled[pos] = parseInt(value, 10);
    }
  }

  return filled;
}

var ianaZoneCache = {};
/**
 * A zone identified by an IANA identifier, like America/New_York
 * @implements {Zone}
 */

var IANAZone = /*#__PURE__*/function (_Zone) {
  _inheritsLoose(IANAZone, _Zone);

  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  IANAZone.create = function create(name) {
    if (!ianaZoneCache[name]) {
      ianaZoneCache[name] = new IANAZone(name);
    }

    return ianaZoneCache[name];
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  ;

  IANAZone.resetCache = function resetCache() {
    ianaZoneCache = {};
    dtfCache = {};
  }
  /**
   * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
   * @param {string} s - The string to check validity on
   * @example IANAZone.isValidSpecifier("America/New_York") //=> true
   * @example IANAZone.isValidSpecifier("Fantasia/Castle") //=> true
   * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
   * @return {boolean}
   */
  ;

  IANAZone.isValidSpecifier = function isValidSpecifier(s) {
    return !!(s && s.match(matchingRegex));
  }
  /**
   * Returns whether the provided string identifies a real zone
   * @param {string} zone - The string to check
   * @example IANAZone.isValidZone("America/New_York") //=> true
   * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
   * @example IANAZone.isValidZone("Sport~~blorp") //=> false
   * @return {boolean}
   */
  ;

  IANAZone.isValidZone = function isValidZone(zone) {
    try {
      new Intl.DateTimeFormat("en-US", {
        timeZone: zone
      }).format();
      return true;
    } catch (e) {
      return false;
    }
  } // Etc/GMT+8 -> -480

  /** @ignore */
  ;

  IANAZone.parseGMTOffset = function parseGMTOffset(specifier) {
    if (specifier) {
      var match = specifier.match(/^Etc\/GMT([+-]\d{1,2})$/i);

      if (match) {
        return -60 * parseInt(match[1]);
      }
    }

    return null;
  };

  function IANAZone(name) {
    var _this;

    _this = _Zone.call(this) || this;
    /** @private **/

    _this.zoneName = name;
    /** @private **/

    _this.valid = IANAZone.isValidZone(name);
    return _this;
  }
  /** @override **/


  var _proto = IANAZone.prototype;

  /** @override **/
  _proto.offsetName = function offsetName(ts, _ref) {
    var format = _ref.format,
        locale = _ref.locale;
    return parseZoneInfo(ts, format, locale, this.name);
  }
  /** @override **/
  ;

  _proto.formatOffset = function formatOffset$1(ts, format) {
    return formatOffset(this.offset(ts), format);
  }
  /** @override **/
  ;

  _proto.offset = function offset(ts) {
    var date = new Date(ts),
        dtf = makeDTF(this.name),
        _ref2 = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date),
        year = _ref2[0],
        month = _ref2[1],
        day = _ref2[2],
        hour = _ref2[3],
        minute = _ref2[4],
        second = _ref2[5],
        adjustedHour = hour === 24 ? 0 : hour;

    var asUTC = objToLocalTS({
      year: year,
      month: month,
      day: day,
      hour: adjustedHour,
      minute: minute,
      second: second,
      millisecond: 0
    });
    var asTS = +date;
    var over = asTS % 1000;
    asTS -= over >= 0 ? over : 1000 + over;
    return (asUTC - asTS) / (60 * 1000);
  }
  /** @override **/
  ;

  _proto.equals = function equals(otherZone) {
    return otherZone.type === "iana" && otherZone.name === this.name;
  }
  /** @override **/
  ;

  _createClass(IANAZone, [{
    key: "type",
    get: function get() {
      return "iana";
    }
    /** @override **/

  }, {
    key: "name",
    get: function get() {
      return this.zoneName;
    }
    /** @override **/

  }, {
    key: "universal",
    get: function get() {
      return false;
    }
  }, {
    key: "isValid",
    get: function get() {
      return this.valid;
    }
  }]);

  return IANAZone;
}(Zone);

var singleton$1 = null;
/**
 * A zone with a fixed offset (meaning no DST)
 * @implements {Zone}
 */

var FixedOffsetZone = /*#__PURE__*/function (_Zone) {
  _inheritsLoose(FixedOffsetZone, _Zone);

  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  FixedOffsetZone.instance = function instance(offset) {
    return offset === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset);
  }
  /**
   * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
   * @param {string} s - The offset string to parse
   * @example FixedOffsetZone.parseSpecifier("UTC+6")
   * @example FixedOffsetZone.parseSpecifier("UTC+06")
   * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
   * @return {FixedOffsetZone}
   */
  ;

  FixedOffsetZone.parseSpecifier = function parseSpecifier(s) {
    if (s) {
      var r = s.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);

      if (r) {
        return new FixedOffsetZone(signedOffset(r[1], r[2]));
      }
    }

    return null;
  };

  _createClass(FixedOffsetZone, null, [{
    key: "utcInstance",

    /**
     * Get a singleton instance of UTC
     * @return {FixedOffsetZone}
     */
    get: function get() {
      if (singleton$1 === null) {
        singleton$1 = new FixedOffsetZone(0);
      }

      return singleton$1;
    }
  }]);

  function FixedOffsetZone(offset) {
    var _this;

    _this = _Zone.call(this) || this;
    /** @private **/

    _this.fixed = offset;
    return _this;
  }
  /** @override **/


  var _proto = FixedOffsetZone.prototype;

  /** @override **/
  _proto.offsetName = function offsetName() {
    return this.name;
  }
  /** @override **/
  ;

  _proto.formatOffset = function formatOffset$1(ts, format) {
    return formatOffset(this.fixed, format);
  }
  /** @override **/
  ;

  /** @override **/
  _proto.offset = function offset() {
    return this.fixed;
  }
  /** @override **/
  ;

  _proto.equals = function equals(otherZone) {
    return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
  }
  /** @override **/
  ;

  _createClass(FixedOffsetZone, [{
    key: "type",
    get: function get() {
      return "fixed";
    }
    /** @override **/

  }, {
    key: "name",
    get: function get() {
      return this.fixed === 0 ? "UTC" : "UTC" + formatOffset(this.fixed, "narrow");
    }
  }, {
    key: "universal",
    get: function get() {
      return true;
    }
  }, {
    key: "isValid",
    get: function get() {
      return true;
    }
  }]);

  return FixedOffsetZone;
}(Zone);

/**
 * A zone that failed to parse. You should never need to instantiate this.
 * @implements {Zone}
 */

var InvalidZone = /*#__PURE__*/function (_Zone) {
  _inheritsLoose(InvalidZone, _Zone);

  function InvalidZone(zoneName) {
    var _this;

    _this = _Zone.call(this) || this;
    /**  @private */

    _this.zoneName = zoneName;
    return _this;
  }
  /** @override **/


  var _proto = InvalidZone.prototype;

  /** @override **/
  _proto.offsetName = function offsetName() {
    return null;
  }
  /** @override **/
  ;

  _proto.formatOffset = function formatOffset() {
    return "";
  }
  /** @override **/
  ;

  _proto.offset = function offset() {
    return NaN;
  }
  /** @override **/
  ;

  _proto.equals = function equals() {
    return false;
  }
  /** @override **/
  ;

  _createClass(InvalidZone, [{
    key: "type",
    get: function get() {
      return "invalid";
    }
    /** @override **/

  }, {
    key: "name",
    get: function get() {
      return this.zoneName;
    }
    /** @override **/

  }, {
    key: "universal",
    get: function get() {
      return false;
    }
  }, {
    key: "isValid",
    get: function get() {
      return false;
    }
  }]);

  return InvalidZone;
}(Zone);

/**
 * @private
 */
function normalizeZone(input, defaultZone) {
  var offset;

  if (isUndefined(input) || input === null) {
    return defaultZone;
  } else if (input instanceof Zone) {
    return input;
  } else if (isString(input)) {
    var lowered = input.toLowerCase();
    if (lowered === "local") return defaultZone;else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone.utcInstance;else if ((offset = IANAZone.parseGMTOffset(input)) != null) {
      // handle Etc/GMT-4, which V8 chokes on
      return FixedOffsetZone.instance(offset);
    } else if (IANAZone.isValidSpecifier(lowered)) return IANAZone.create(input);else return FixedOffsetZone.parseSpecifier(lowered) || new InvalidZone(input);
  } else if (isNumber(input)) {
    return FixedOffsetZone.instance(input);
  } else if (typeof input === "object" && input.offset && typeof input.offset === "number") {
    // This is dumb, but the instanceof check above doesn't seem to really work
    // so we're duck checking it
    return input;
  } else {
    return new InvalidZone(input);
  }
}

var now = function now() {
  return Date.now();
},
    defaultZone = null,
    // not setting this directly to LocalZone.instance bc loading order issues
defaultLocale = null,
    defaultNumberingSystem = null,
    defaultOutputCalendar = null,
    throwOnInvalid = false;
/**
 * Settings contains static getters and setters that control Luxon's overall behavior. Luxon is a simple library with few options, but the ones it does have live here.
 */


var Settings = /*#__PURE__*/function () {
  function Settings() {}

  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  Settings.resetCaches = function resetCaches() {
    Locale.resetCache();
    IANAZone.resetCache();
  };

  _createClass(Settings, null, [{
    key: "now",

    /**
     * Get the callback for returning the current timestamp.
     * @type {function}
     */
    get: function get() {
      return now;
    }
    /**
     * Set the callback for returning the current timestamp.
     * The function should return a number, which will be interpreted as an Epoch millisecond count
     * @type {function}
     * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
     * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
     */
    ,
    set: function set(n) {
      now = n;
    }
    /**
     * Get the default time zone to create DateTimes in.
     * @type {string}
     */

  }, {
    key: "defaultZoneName",
    get: function get() {
      return Settings.defaultZone.name;
    }
    /**
     * Set the default time zone to create DateTimes in. Does not affect existing instances.
     * @type {string}
     */
    ,
    set: function set(z) {
      if (!z) {
        defaultZone = null;
      } else {
        defaultZone = normalizeZone(z);
      }
    }
    /**
     * Get the default time zone object to create DateTimes in. Does not affect existing instances.
     * @type {Zone}
     */

  }, {
    key: "defaultZone",
    get: function get() {
      return defaultZone || LocalZone.instance;
    }
    /**
     * Get the default locale to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */

  }, {
    key: "defaultLocale",
    get: function get() {
      return defaultLocale;
    }
    /**
     * Set the default locale to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */
    ,
    set: function set(locale) {
      defaultLocale = locale;
    }
    /**
     * Get the default numbering system to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */

  }, {
    key: "defaultNumberingSystem",
    get: function get() {
      return defaultNumberingSystem;
    }
    /**
     * Set the default numbering system to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */
    ,
    set: function set(numberingSystem) {
      defaultNumberingSystem = numberingSystem;
    }
    /**
     * Get the default output calendar to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */

  }, {
    key: "defaultOutputCalendar",
    get: function get() {
      return defaultOutputCalendar;
    }
    /**
     * Set the default output calendar to create DateTimes with. Does not affect existing instances.
     * @type {string}
     */
    ,
    set: function set(outputCalendar) {
      defaultOutputCalendar = outputCalendar;
    }
    /**
     * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
     * @type {boolean}
     */

  }, {
    key: "throwOnInvalid",
    get: function get() {
      return throwOnInvalid;
    }
    /**
     * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
     * @type {boolean}
     */
    ,
    set: function set(t) {
      throwOnInvalid = t;
    }
  }]);

  return Settings;
}();

var intlDTCache = {};

function getCachedDTF(locString, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var key = JSON.stringify([locString, opts]);
  var dtf = intlDTCache[key];

  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }

  return dtf;
}

var intlNumCache = {};

function getCachedINF(locString, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var key = JSON.stringify([locString, opts]);
  var inf = intlNumCache[key];

  if (!inf) {
    inf = new Intl.NumberFormat(locString, opts);
    intlNumCache[key] = inf;
  }

  return inf;
}

var intlRelCache = {};

function getCachedRTF(locString, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var _opts = opts,
      base = _opts.base,
      cacheKeyOpts = _objectWithoutPropertiesLoose(_opts, ["base"]); // exclude `base` from the options


  var key = JSON.stringify([locString, cacheKeyOpts]);
  var inf = intlRelCache[key];

  if (!inf) {
    inf = new Intl.RelativeTimeFormat(locString, opts);
    intlRelCache[key] = inf;
  }

  return inf;
}

var sysLocaleCache = null;

function systemLocale() {
  if (sysLocaleCache) {
    return sysLocaleCache;
  } else if (hasIntl()) {
    var computedSys = new Intl.DateTimeFormat().resolvedOptions().locale; // node sometimes defaults to "und". Override that because that is dumb

    sysLocaleCache = !computedSys || computedSys === "und" ? "en-US" : computedSys;
    return sysLocaleCache;
  } else {
    sysLocaleCache = "en-US";
    return sysLocaleCache;
  }
}

function parseLocaleString(localeStr) {
  // I really want to avoid writing a BCP 47 parser
  // see, e.g. https://github.com/wooorm/bcp-47
  // Instead, we'll do this:
  // a) if the string has no -u extensions, just leave it alone
  // b) if it does, use Intl to resolve everything
  // c) if Intl fails, try again without the -u
  var uIndex = localeStr.indexOf("-u-");

  if (uIndex === -1) {
    return [localeStr];
  } else {
    var options;
    var smaller = localeStr.substring(0, uIndex);

    try {
      options = getCachedDTF(localeStr).resolvedOptions();
    } catch (e) {
      options = getCachedDTF(smaller).resolvedOptions();
    }

    var _options = options,
        numberingSystem = _options.numberingSystem,
        calendar = _options.calendar; // return the smaller one so that we can append the calendar and numbering overrides to it

    return [smaller, numberingSystem, calendar];
  }
}

function intlConfigString(localeStr, numberingSystem, outputCalendar) {
  if (hasIntl()) {
    if (outputCalendar || numberingSystem) {
      localeStr += "-u";

      if (outputCalendar) {
        localeStr += "-ca-" + outputCalendar;
      }

      if (numberingSystem) {
        localeStr += "-nu-" + numberingSystem;
      }

      return localeStr;
    } else {
      return localeStr;
    }
  } else {
    return [];
  }
}

function mapMonths(f) {
  var ms = [];

  for (var i = 1; i <= 12; i++) {
    var dt = DateTime.utc(2016, i, 1);
    ms.push(f(dt));
  }

  return ms;
}

function mapWeekdays(f) {
  var ms = [];

  for (var i = 1; i <= 7; i++) {
    var dt = DateTime.utc(2016, 11, 13 + i);
    ms.push(f(dt));
  }

  return ms;
}

function listStuff(loc, length, defaultOK, englishFn, intlFn) {
  var mode = loc.listingMode(defaultOK);

  if (mode === "error") {
    return null;
  } else if (mode === "en") {
    return englishFn(length);
  } else {
    return intlFn(length);
  }
}

function supportsFastNumbers(loc) {
  if (loc.numberingSystem && loc.numberingSystem !== "latn") {
    return false;
  } else {
    return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || hasIntl() && new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
  }
}
/**
 * @private
 */


var PolyNumberFormatter = /*#__PURE__*/function () {
  function PolyNumberFormatter(intl, forceSimple, opts) {
    this.padTo = opts.padTo || 0;
    this.floor = opts.floor || false;

    if (!forceSimple && hasIntl()) {
      var intlOpts = {
        useGrouping: false
      };
      if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
      this.inf = getCachedINF(intl, intlOpts);
    }
  }

  var _proto = PolyNumberFormatter.prototype;

  _proto.format = function format(i) {
    if (this.inf) {
      var fixed = this.floor ? Math.floor(i) : i;
      return this.inf.format(fixed);
    } else {
      // to match the browser's numberformatter defaults
      var _fixed = this.floor ? Math.floor(i) : roundTo(i, 3);

      return padStart(_fixed, this.padTo);
    }
  };

  return PolyNumberFormatter;
}();
/**
 * @private
 */


var PolyDateFormatter = /*#__PURE__*/function () {
  function PolyDateFormatter(dt, intl, opts) {
    this.opts = opts;
    this.hasIntl = hasIntl();
    var z;

    if (dt.zone.universal && this.hasIntl) {
      // Chromium doesn't support fixed-offset zones like Etc/GMT+8 in its formatter,
      // See https://bugs.chromium.org/p/chromium/issues/detail?id=364374.
      // So we have to make do. Two cases:
      // 1. The format options tell us to show the zone. We can't do that, so the best
      // we can do is format the date in UTC.
      // 2. The format options don't tell us to show the zone. Then we can adjust them
      // the time and tell the formatter to show it to us in UTC, so that the time is right
      // and the bad zone doesn't show up.
      // We can clean all this up when Chrome fixes this.
      z = "UTC";

      if (opts.timeZoneName) {
        this.dt = dt;
      } else {
        this.dt = dt.offset === 0 ? dt : DateTime.fromMillis(dt.ts + dt.offset * 60 * 1000);
      }
    } else if (dt.zone.type === "local") {
      this.dt = dt;
    } else {
      this.dt = dt;
      z = dt.zone.name;
    }

    if (this.hasIntl) {
      var intlOpts = Object.assign({}, this.opts);

      if (z) {
        intlOpts.timeZone = z;
      }

      this.dtf = getCachedDTF(intl, intlOpts);
    }
  }

  var _proto2 = PolyDateFormatter.prototype;

  _proto2.format = function format() {
    if (this.hasIntl) {
      return this.dtf.format(this.dt.toJSDate());
    } else {
      var tokenFormat = formatString(this.opts),
          loc = Locale.create("en-US");
      return Formatter.create(loc).formatDateTimeFromString(this.dt, tokenFormat);
    }
  };

  _proto2.formatToParts = function formatToParts() {
    if (this.hasIntl && hasFormatToParts()) {
      return this.dtf.formatToParts(this.dt.toJSDate());
    } else {
      // This is kind of a cop out. We actually could do this for English. However, we couldn't do it for intl strings
      // and IMO it's too weird to have an uncanny valley like that
      return [];
    }
  };

  _proto2.resolvedOptions = function resolvedOptions() {
    if (this.hasIntl) {
      return this.dtf.resolvedOptions();
    } else {
      return {
        locale: "en-US",
        numberingSystem: "latn",
        outputCalendar: "gregory"
      };
    }
  };

  return PolyDateFormatter;
}();
/**
 * @private
 */


var PolyRelFormatter = /*#__PURE__*/function () {
  function PolyRelFormatter(intl, isEnglish, opts) {
    this.opts = Object.assign({
      style: "long"
    }, opts);

    if (!isEnglish && hasRelative()) {
      this.rtf = getCachedRTF(intl, opts);
    }
  }

  var _proto3 = PolyRelFormatter.prototype;

  _proto3.format = function format(count, unit) {
    if (this.rtf) {
      return this.rtf.format(count, unit);
    } else {
      return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
    }
  };

  _proto3.formatToParts = function formatToParts(count, unit) {
    if (this.rtf) {
      return this.rtf.formatToParts(count, unit);
    } else {
      return [];
    }
  };

  return PolyRelFormatter;
}();
/**
 * @private
 */


var Locale = /*#__PURE__*/function () {
  Locale.fromOpts = function fromOpts(opts) {
    return Locale.create(opts.locale, opts.numberingSystem, opts.outputCalendar, opts.defaultToEN);
  };

  Locale.create = function create(locale, numberingSystem, outputCalendar, defaultToEN) {
    if (defaultToEN === void 0) {
      defaultToEN = false;
    }

    var specifiedLocale = locale || Settings.defaultLocale,
        // the system locale is useful for human readable strings but annoying for parsing/formatting known formats
    localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale()),
        numberingSystemR = numberingSystem || Settings.defaultNumberingSystem,
        outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
    return new Locale(localeR, numberingSystemR, outputCalendarR, specifiedLocale);
  };

  Locale.resetCache = function resetCache() {
    sysLocaleCache = null;
    intlDTCache = {};
    intlNumCache = {};
    intlRelCache = {};
  };

  Locale.fromObject = function fromObject(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        locale = _ref.locale,
        numberingSystem = _ref.numberingSystem,
        outputCalendar = _ref.outputCalendar;

    return Locale.create(locale, numberingSystem, outputCalendar);
  };

  function Locale(locale, numbering, outputCalendar, specifiedLocale) {
    var _parseLocaleString = parseLocaleString(locale),
        parsedLocale = _parseLocaleString[0],
        parsedNumberingSystem = _parseLocaleString[1],
        parsedOutputCalendar = _parseLocaleString[2];

    this.locale = parsedLocale;
    this.numberingSystem = numbering || parsedNumberingSystem || null;
    this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
    this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);
    this.weekdaysCache = {
      format: {},
      standalone: {}
    };
    this.monthsCache = {
      format: {},
      standalone: {}
    };
    this.meridiemCache = null;
    this.eraCache = {};
    this.specifiedLocale = specifiedLocale;
    this.fastNumbersCached = null;
  }

  var _proto4 = Locale.prototype;

  _proto4.listingMode = function listingMode(defaultOK) {
    if (defaultOK === void 0) {
      defaultOK = true;
    }

    var intl = hasIntl(),
        hasFTP = intl && hasFormatToParts(),
        isActuallyEn = this.isEnglish(),
        hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");

    if (!hasFTP && !(isActuallyEn && hasNoWeirdness) && !defaultOK) {
      return "error";
    } else if (!hasFTP || isActuallyEn && hasNoWeirdness) {
      return "en";
    } else {
      return "intl";
    }
  };

  _proto4.clone = function clone(alts) {
    if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
      return this;
    } else {
      return Locale.create(alts.locale || this.specifiedLocale, alts.numberingSystem || this.numberingSystem, alts.outputCalendar || this.outputCalendar, alts.defaultToEN || false);
    }
  };

  _proto4.redefaultToEN = function redefaultToEN(alts) {
    if (alts === void 0) {
      alts = {};
    }

    return this.clone(Object.assign({}, alts, {
      defaultToEN: true
    }));
  };

  _proto4.redefaultToSystem = function redefaultToSystem(alts) {
    if (alts === void 0) {
      alts = {};
    }

    return this.clone(Object.assign({}, alts, {
      defaultToEN: false
    }));
  };

  _proto4.months = function months$1(length, format, defaultOK) {
    var _this = this;

    if (format === void 0) {
      format = false;
    }

    if (defaultOK === void 0) {
      defaultOK = true;
    }

    return listStuff(this, length, defaultOK, months, function () {
      var intl = format ? {
        month: length,
        day: "numeric"
      } : {
        month: length
      },
          formatStr = format ? "format" : "standalone";

      if (!_this.monthsCache[formatStr][length]) {
        _this.monthsCache[formatStr][length] = mapMonths(function (dt) {
          return _this.extract(dt, intl, "month");
        });
      }

      return _this.monthsCache[formatStr][length];
    });
  };

  _proto4.weekdays = function weekdays$1(length, format, defaultOK) {
    var _this2 = this;

    if (format === void 0) {
      format = false;
    }

    if (defaultOK === void 0) {
      defaultOK = true;
    }

    return listStuff(this, length, defaultOK, weekdays, function () {
      var intl = format ? {
        weekday: length,
        year: "numeric",
        month: "long",
        day: "numeric"
      } : {
        weekday: length
      },
          formatStr = format ? "format" : "standalone";

      if (!_this2.weekdaysCache[formatStr][length]) {
        _this2.weekdaysCache[formatStr][length] = mapWeekdays(function (dt) {
          return _this2.extract(dt, intl, "weekday");
        });
      }

      return _this2.weekdaysCache[formatStr][length];
    });
  };

  _proto4.meridiems = function meridiems$1(defaultOK) {
    var _this3 = this;

    if (defaultOK === void 0) {
      defaultOK = true;
    }

    return listStuff(this, undefined, defaultOK, function () {
      return meridiems;
    }, function () {
      // In theory there could be aribitrary day periods. We're gonna assume there are exactly two
      // for AM and PM. This is probably wrong, but it's makes parsing way easier.
      if (!_this3.meridiemCache) {
        var intl = {
          hour: "numeric",
          hour12: true
        };
        _this3.meridiemCache = [DateTime.utc(2016, 11, 13, 9), DateTime.utc(2016, 11, 13, 19)].map(function (dt) {
          return _this3.extract(dt, intl, "dayperiod");
        });
      }

      return _this3.meridiemCache;
    });
  };

  _proto4.eras = function eras$1(length, defaultOK) {
    var _this4 = this;

    if (defaultOK === void 0) {
      defaultOK = true;
    }

    return listStuff(this, length, defaultOK, eras, function () {
      var intl = {
        era: length
      }; // This is utter bullshit. Different calendars are going to define eras totally differently. What I need is the minimum set of dates
      // to definitely enumerate them.

      if (!_this4.eraCache[length]) {
        _this4.eraCache[length] = [DateTime.utc(-40, 1, 1), DateTime.utc(2017, 1, 1)].map(function (dt) {
          return _this4.extract(dt, intl, "era");
        });
      }

      return _this4.eraCache[length];
    });
  };

  _proto4.extract = function extract(dt, intlOpts, field) {
    var df = this.dtFormatter(dt, intlOpts),
        results = df.formatToParts(),
        matching = results.find(function (m) {
      return m.type.toLowerCase() === field;
    });
    return matching ? matching.value : null;
  };

  _proto4.numberFormatter = function numberFormatter(opts) {
    if (opts === void 0) {
      opts = {};
    }

    // this forcesimple option is never used (the only caller short-circuits on it, but it seems safer to leave)
    // (in contrast, the rest of the condition is used heavily)
    return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
  };

  _proto4.dtFormatter = function dtFormatter(dt, intlOpts) {
    if (intlOpts === void 0) {
      intlOpts = {};
    }

    return new PolyDateFormatter(dt, this.intl, intlOpts);
  };

  _proto4.relFormatter = function relFormatter(opts) {
    if (opts === void 0) {
      opts = {};
    }

    return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
  };

  _proto4.isEnglish = function isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || hasIntl() && new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
  };

  _proto4.equals = function equals(other) {
    return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
  };

  _createClass(Locale, [{
    key: "fastNumbers",
    get: function get() {
      if (this.fastNumbersCached == null) {
        this.fastNumbersCached = supportsFastNumbers(this);
      }

      return this.fastNumbersCached;
    }
  }]);

  return Locale;
}();

/*
 * This file handles parsing for well-specified formats. Here's how it works:
 * Two things go into parsing: a regex to match with and an extractor to take apart the groups in the match.
 * An extractor is just a function that takes a regex match array and returns a { year: ..., month: ... } object
 * parse() does the work of executing the regex and applying the extractor. It takes multiple regex/extractor pairs to try in sequence.
 * Extractors can take a "cursor" representing the offset in the match to look at. This makes it easy to combine extractors.
 * combineExtractors() does the work of combining them, keeping track of the cursor through multiple extractions.
 * Some extractions are super dumb and simpleParse and fromStrings help DRY them.
 */

function combineRegexes() {
  for (var _len = arguments.length, regexes = new Array(_len), _key = 0; _key < _len; _key++) {
    regexes[_key] = arguments[_key];
  }

  var full = regexes.reduce(function (f, r) {
    return f + r.source;
  }, "");
  return RegExp("^" + full + "$");
}

function combineExtractors() {
  for (var _len2 = arguments.length, extractors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    extractors[_key2] = arguments[_key2];
  }

  return function (m) {
    return extractors.reduce(function (_ref, ex) {
      var mergedVals = _ref[0],
          mergedZone = _ref[1],
          cursor = _ref[2];

      var _ex = ex(m, cursor),
          val = _ex[0],
          zone = _ex[1],
          next = _ex[2];

      return [Object.assign(mergedVals, val), mergedZone || zone, next];
    }, [{}, null, 1]).slice(0, 2);
  };
}

function parse(s) {
  if (s == null) {
    return [null, null];
  }

  for (var _len3 = arguments.length, patterns = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    patterns[_key3 - 1] = arguments[_key3];
  }

  for (var _i = 0, _patterns = patterns; _i < _patterns.length; _i++) {
    var _patterns$_i = _patterns[_i],
        regex = _patterns$_i[0],
        extractor = _patterns$_i[1];
    var m = regex.exec(s);

    if (m) {
      return extractor(m);
    }
  }

  return [null, null];
}

function simpleParse() {
  for (var _len4 = arguments.length, keys = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    keys[_key4] = arguments[_key4];
  }

  return function (match, cursor) {
    var ret = {};
    var i;

    for (i = 0; i < keys.length; i++) {
      ret[keys[i]] = parseInteger(match[cursor + i]);
    }

    return [ret, null, cursor + i];
  };
} // ISO and SQL parsing


var offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/,
    isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,9}))?)?)?/,
    isoTimeRegex = RegExp("" + isoTimeBaseRegex.source + offsetRegex.source + "?"),
    isoTimeExtensionRegex = RegExp("(?:T" + isoTimeRegex.source + ")?"),
    isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/,
    isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/,
    isoOrdinalRegex = /(\d{4})-?(\d{3})/,
    extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay"),
    extractISOOrdinalData = simpleParse("year", "ordinal"),
    sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/,
    // dumbed-down version of the ISO one
sqlTimeRegex = RegExp(isoTimeBaseRegex.source + " ?(?:" + offsetRegex.source + "|(" + ianaRegex.source + "))?"),
    sqlTimeExtensionRegex = RegExp("(?: " + sqlTimeRegex.source + ")?");

function int(match, pos, fallback) {
  var m = match[pos];
  return isUndefined(m) ? fallback : parseInteger(m);
}

function extractISOYmd(match, cursor) {
  var item = {
    year: int(match, cursor),
    month: int(match, cursor + 1, 1),
    day: int(match, cursor + 2, 1)
  };
  return [item, null, cursor + 3];
}

function extractISOTime(match, cursor) {
  var item = {
    hour: int(match, cursor, 0),
    minute: int(match, cursor + 1, 0),
    second: int(match, cursor + 2, 0),
    millisecond: parseMillis(match[cursor + 3])
  };
  return [item, null, cursor + 4];
}

function extractISOOffset(match, cursor) {
  var local = !match[cursor] && !match[cursor + 1],
      fullOffset = signedOffset(match[cursor + 1], match[cursor + 2]),
      zone = local ? null : FixedOffsetZone.instance(fullOffset);
  return [{}, zone, cursor + 3];
}

function extractIANAZone(match, cursor) {
  var zone = match[cursor] ? IANAZone.create(match[cursor]) : null;
  return [{}, zone, cursor + 1];
} // ISO duration parsing


var isoDuration = /^-?P(?:(?:(-?\d{1,9})Y)?(?:(-?\d{1,9})M)?(?:(-?\d{1,9})W)?(?:(-?\d{1,9})D)?(?:T(?:(-?\d{1,9})H)?(?:(-?\d{1,9})M)?(?:(-?\d{1,9})(?:[.,](-?\d{1,9}))?S)?)?)$/;

function extractISODuration(match) {
  var s = match[0],
      yearStr = match[1],
      monthStr = match[2],
      weekStr = match[3],
      dayStr = match[4],
      hourStr = match[5],
      minuteStr = match[6],
      secondStr = match[7],
      millisecondsStr = match[8];
  var hasNegativePrefix = s[0] === "-";

  var maybeNegate = function maybeNegate(num) {
    return num && hasNegativePrefix ? -num : num;
  };

  return [{
    years: maybeNegate(parseInteger(yearStr)),
    months: maybeNegate(parseInteger(monthStr)),
    weeks: maybeNegate(parseInteger(weekStr)),
    days: maybeNegate(parseInteger(dayStr)),
    hours: maybeNegate(parseInteger(hourStr)),
    minutes: maybeNegate(parseInteger(minuteStr)),
    seconds: maybeNegate(parseInteger(secondStr)),
    milliseconds: maybeNegate(parseMillis(millisecondsStr))
  }];
} // These are a little braindead. EDT *should* tell us that we're in, say, America/New_York
// and not just that we're in -240 *right now*. But since I don't think these are used that often
// I'm just going to ignore that


var obsOffsets = {
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
};

function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  var result = {
    year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
    month: monthsShort.indexOf(monthStr) + 1,
    day: parseInteger(dayStr),
    hour: parseInteger(hourStr),
    minute: parseInteger(minuteStr)
  };
  if (secondStr) result.second = parseInteger(secondStr);

  if (weekdayStr) {
    result.weekday = weekdayStr.length > 3 ? weekdaysLong.indexOf(weekdayStr) + 1 : weekdaysShort.indexOf(weekdayStr) + 1;
  }

  return result;
} // RFC 2822/5322


var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;

function extractRFC2822(match) {
  var weekdayStr = match[1],
      dayStr = match[2],
      monthStr = match[3],
      yearStr = match[4],
      hourStr = match[5],
      minuteStr = match[6],
      secondStr = match[7],
      obsOffset = match[8],
      milOffset = match[9],
      offHourStr = match[10],
      offMinuteStr = match[11],
      result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  var offset;

  if (obsOffset) {
    offset = obsOffsets[obsOffset];
  } else if (milOffset) {
    offset = 0;
  } else {
    offset = signedOffset(offHourStr, offMinuteStr);
  }

  return [result, new FixedOffsetZone(offset)];
}

function preprocessRFC2822(s) {
  // Remove comments and folding whitespace and replace multiple-spaces with a single space
  return s.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
} // http date


var rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,
    rfc850 = /^(Monday|Tuesday|Wedsday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,
    ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;

function extractRFC1123Or850(match) {
  var weekdayStr = match[1],
      dayStr = match[2],
      monthStr = match[3],
      yearStr = match[4],
      hourStr = match[5],
      minuteStr = match[6],
      secondStr = match[7],
      result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone.utcInstance];
}

function extractASCII(match) {
  var weekdayStr = match[1],
      monthStr = match[2],
      dayStr = match[3],
      hourStr = match[4],
      minuteStr = match[5],
      secondStr = match[6],
      yearStr = match[7],
      result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone.utcInstance];
}

var isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
var isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
var isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
var isoTimeCombinedRegex = combineRegexes(isoTimeRegex);
var extractISOYmdTimeAndOffset = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset);
var extractISOWeekTimeAndOffset = combineExtractors(extractISOWeekData, extractISOTime, extractISOOffset);
var extractISOOrdinalDataAndTime = combineExtractors(extractISOOrdinalData, extractISOTime);
var extractISOTimeAndOffset = combineExtractors(extractISOTime, extractISOOffset);
/**
 * @private
 */

function parseISODate(s) {
  return parse(s, [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset], [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset], [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDataAndTime], [isoTimeCombinedRegex, extractISOTimeAndOffset]);
}
function parseRFC2822Date(s) {
  return parse(preprocessRFC2822(s), [rfc2822, extractRFC2822]);
}
function parseHTTPDate(s) {
  return parse(s, [rfc1123, extractRFC1123Or850], [rfc850, extractRFC1123Or850], [ascii, extractASCII]);
}
function parseISODuration(s) {
  return parse(s, [isoDuration, extractISODuration]);
}
var sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
var sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
var extractISOYmdTimeOffsetAndIANAZone = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset, extractIANAZone);
var extractISOTimeOffsetAndIANAZone = combineExtractors(extractISOTime, extractISOOffset, extractIANAZone);
function parseSQL(s) {
  return parse(s, [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeOffsetAndIANAZone], [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]);
}

var INVALID = "Invalid Duration"; // unit conversion constants

var lowOrderMatrix = {
  weeks: {
    days: 7,
    hours: 7 * 24,
    minutes: 7 * 24 * 60,
    seconds: 7 * 24 * 60 * 60,
    milliseconds: 7 * 24 * 60 * 60 * 1000
  },
  days: {
    hours: 24,
    minutes: 24 * 60,
    seconds: 24 * 60 * 60,
    milliseconds: 24 * 60 * 60 * 1000
  },
  hours: {
    minutes: 60,
    seconds: 60 * 60,
    milliseconds: 60 * 60 * 1000
  },
  minutes: {
    seconds: 60,
    milliseconds: 60 * 1000
  },
  seconds: {
    milliseconds: 1000
  }
},
    casualMatrix = Object.assign({
  years: {
    months: 12,
    weeks: 52,
    days: 365,
    hours: 365 * 24,
    minutes: 365 * 24 * 60,
    seconds: 365 * 24 * 60 * 60,
    milliseconds: 365 * 24 * 60 * 60 * 1000
  },
  quarters: {
    months: 3,
    weeks: 13,
    days: 91,
    hours: 91 * 24,
    minutes: 91 * 24 * 60,
    milliseconds: 91 * 24 * 60 * 60 * 1000
  },
  months: {
    weeks: 4,
    days: 30,
    hours: 30 * 24,
    minutes: 30 * 24 * 60,
    seconds: 30 * 24 * 60 * 60,
    milliseconds: 30 * 24 * 60 * 60 * 1000
  }
}, lowOrderMatrix),
    daysInYearAccurate = 146097.0 / 400,
    daysInMonthAccurate = 146097.0 / 4800,
    accurateMatrix = Object.assign({
  years: {
    months: 12,
    weeks: daysInYearAccurate / 7,
    days: daysInYearAccurate,
    hours: daysInYearAccurate * 24,
    minutes: daysInYearAccurate * 24 * 60,
    seconds: daysInYearAccurate * 24 * 60 * 60,
    milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000
  },
  quarters: {
    months: 3,
    weeks: daysInYearAccurate / 28,
    days: daysInYearAccurate / 4,
    hours: daysInYearAccurate * 24 / 4,
    minutes: daysInYearAccurate * 24 * 60 / 4,
    seconds: daysInYearAccurate * 24 * 60 * 60 / 4,
    milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000 / 4
  },
  months: {
    weeks: daysInMonthAccurate / 7,
    days: daysInMonthAccurate,
    hours: daysInMonthAccurate * 24,
    minutes: daysInMonthAccurate * 24 * 60,
    seconds: daysInMonthAccurate * 24 * 60 * 60,
    milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1000
  }
}, lowOrderMatrix); // units ordered by size

var orderedUnits = ["years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
var reverseUnits = orderedUnits.slice(0).reverse(); // clone really means "create another instance just like this one, but with these changes"

function clone(dur, alts, clear) {
  if (clear === void 0) {
    clear = false;
  }

  // deep merge for vals
  var conf = {
    values: clear ? alts.values : Object.assign({}, dur.values, alts.values || {}),
    loc: dur.loc.clone(alts.loc),
    conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy
  };
  return new Duration(conf);
}

function antiTrunc(n) {
  return n < 0 ? Math.floor(n) : Math.ceil(n);
} // NB: mutates parameters


function convert(matrix, fromMap, fromUnit, toMap, toUnit) {
  var conv = matrix[toUnit][fromUnit],
      raw = fromMap[fromUnit] / conv,
      sameSign = Math.sign(raw) === Math.sign(toMap[toUnit]),
      // ok, so this is wild, but see the matrix in the tests
  added = !sameSign && toMap[toUnit] !== 0 && Math.abs(raw) <= 1 ? antiTrunc(raw) : Math.trunc(raw);
  toMap[toUnit] += added;
  fromMap[fromUnit] -= added * conv;
} // NB: mutates parameters


function normalizeValues(matrix, vals) {
  reverseUnits.reduce(function (previous, current) {
    if (!isUndefined(vals[current])) {
      if (previous) {
        convert(matrix, vals, previous, vals, current);
      }

      return current;
    } else {
      return previous;
    }
  }, null);
}
/**
 * A Duration object represents a period of time, like "2 months" or "1 day, 1 hour". Conceptually, it's just a map of units to their quantities, accompanied by some additional configuration and methods for creating, parsing, interrogating, transforming, and formatting them. They can be used on their own or in conjunction with other Luxon types; for example, you can use {@link DateTime.plus} to add a Duration object to a DateTime, producing another DateTime.
 *
 * Here is a brief overview of commonly used methods and getters in Duration:
 *
 * * **Creation** To create a Duration, use {@link Duration.fromMillis}, {@link Duration.fromObject}, or {@link Duration.fromISO}.
 * * **Unit values** See the {@link Duration.years}, {@link Duration.months}, {@link Duration.weeks}, {@link Duration.days}, {@link Duration.hours}, {@link Duration.minutes}, {@link Duration.seconds}, {@link Duration.milliseconds} accessors.
 * * **Configuration** See  {@link Duration.locale} and {@link Duration.numberingSystem} accessors.
 * * **Transformation** To create new Durations out of old ones use {@link Duration.plus}, {@link Duration.minus}, {@link Duration.normalize}, {@link Duration.set}, {@link Duration.reconfigure}, {@link Duration.shiftTo}, and {@link Duration.negate}.
 * * **Output** To convert the Duration into other representations, see {@link Duration.as}, {@link Duration.toISO}, {@link Duration.toFormat}, and {@link Duration.toJSON}
 *
 * There's are more methods documented below. In addition, for more information on subtler topics like internationalization and validity, see the external documentation.
 */


var Duration = /*#__PURE__*/function () {
  /**
   * @private
   */
  function Duration(config) {
    var accurate = config.conversionAccuracy === "longterm" || false;
    /**
     * @access private
     */

    this.values = config.values;
    /**
     * @access private
     */

    this.loc = config.loc || Locale.create();
    /**
     * @access private
     */

    this.conversionAccuracy = accurate ? "longterm" : "casual";
    /**
     * @access private
     */

    this.invalid = config.invalid || null;
    /**
     * @access private
     */

    this.matrix = accurate ? accurateMatrix : casualMatrix;
    /**
     * @access private
     */

    this.isLuxonDuration = true;
  }
  /**
   * Create Duration from a number of milliseconds.
   * @param {number} count of milliseconds
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */


  Duration.fromMillis = function fromMillis(count, opts) {
    return Duration.fromObject(Object.assign({
      milliseconds: count
    }, opts));
  }
  /**
   * Create a Duration from a Javascript object with keys like 'years' and 'hours.
   * If this object is empty then a zero milliseconds duration is returned.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.years
   * @param {number} obj.quarters
   * @param {number} obj.months
   * @param {number} obj.weeks
   * @param {number} obj.days
   * @param {number} obj.hours
   * @param {number} obj.minutes
   * @param {number} obj.seconds
   * @param {number} obj.milliseconds
   * @param {string} [obj.locale='en-US'] - the locale to use
   * @param {string} obj.numberingSystem - the numbering system to use
   * @param {string} [obj.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  ;

  Duration.fromObject = function fromObject(obj) {
    if (obj == null || typeof obj !== "object") {
      throw new InvalidArgumentError("Duration.fromObject: argument expected to be an object, got " + (obj === null ? "null" : typeof obj));
    }

    return new Duration({
      values: normalizeObject(obj, Duration.normalizeUnit, ["locale", "numberingSystem", "conversionAccuracy", "zone" // a bit of debt; it's super inconvenient internally not to be able to blindly pass this
      ]),
      loc: Locale.fromObject(obj),
      conversionAccuracy: obj.conversionAccuracy
    });
  }
  /**
   * Create a Duration from an ISO 8601 duration string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromISO('P3Y6M1W4DT12H30M5S').toObject() //=> { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
   * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
   * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
   * @return {Duration}
   */
  ;

  Duration.fromISO = function fromISO(text, opts) {
    var _parseISODuration = parseISODuration(text),
        parsed = _parseISODuration[0];

    if (parsed) {
      var obj = Object.assign(parsed, opts);
      return Duration.fromObject(obj);
    } else {
      return Duration.invalid("unparsable", "the input \"" + text + "\" can't be parsed as ISO 8601");
    }
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  ;

  Duration.invalid = function invalid(reason, explanation) {
    if (explanation === void 0) {
      explanation = null;
    }

    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
    }

    var invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

    if (Settings.throwOnInvalid) {
      throw new InvalidDurationError(invalid);
    } else {
      return new Duration({
        invalid: invalid
      });
    }
  }
  /**
   * @private
   */
  ;

  Duration.normalizeUnit = function normalizeUnit(unit) {
    var normalized = {
      year: "years",
      years: "years",
      quarter: "quarters",
      quarters: "quarters",
      month: "months",
      months: "months",
      week: "weeks",
      weeks: "weeks",
      day: "days",
      days: "days",
      hour: "hours",
      hours: "hours",
      minute: "minutes",
      minutes: "minutes",
      second: "seconds",
      seconds: "seconds",
      millisecond: "milliseconds",
      milliseconds: "milliseconds"
    }[unit ? unit.toLowerCase() : unit];
    if (!normalized) throw new InvalidUnitError(unit);
    return normalized;
  }
  /**
   * Check if an object is a Duration. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  ;

  Duration.isDuration = function isDuration(o) {
    return o && o.isLuxonDuration || false;
  }
  /**
   * Get  the locale of a Duration, such 'en-GB'
   * @type {string}
   */
  ;

  var _proto = Duration.prototype;

  /**
   * Returns a string representation of this Duration formatted according to the specified format string. You may use these tokens:
   * * `S` for milliseconds
   * * `s` for seconds
   * * `m` for minutes
   * * `h` for hours
   * * `d` for days
   * * `M` for months
   * * `y` for years
   * Notes:
   * * Add padding by repeating the token, e.g. "yy" pads the years to two digits, "hhhh" pads the hours out to four digits
   * * The duration will be converted to the set of units in the format string using {@link Duration.shiftTo} and the Durations's conversion accuracy setting.
   * @param {string} fmt - the format string
   * @param {Object} opts - options
   * @param {boolean} [opts.floor=true] - floor numerical values
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
   * @return {string}
   */
  _proto.toFormat = function toFormat(fmt, opts) {
    if (opts === void 0) {
      opts = {};
    }

    // reverse-compat since 1.2; we always round down now, never up, and we do it by default
    var fmtOpts = Object.assign({}, opts, {
      floor: opts.round !== false && opts.floor !== false
    });
    return this.isValid ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt) : INVALID;
  }
  /**
   * Returns a Javascript object with this Duration's values.
   * @param opts - options for generating the object
   * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
   * @return {Object}
   */
  ;

  _proto.toObject = function toObject(opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (!this.isValid) return {};
    var base = Object.assign({}, this.values);

    if (opts.includeConfig) {
      base.conversionAccuracy = this.conversionAccuracy;
      base.numberingSystem = this.loc.numberingSystem;
      base.locale = this.loc.locale;
    }

    return base;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Duration.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
   * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
   * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
   * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
   * @example Duration.fromObject({ milliseconds: 6 }).toISO() //=> 'PT0.006S'
   * @return {string}
   */
  ;

  _proto.toISO = function toISO() {
    // we could use the formatter, but this is an easier way to get the minimum string
    if (!this.isValid) return null;
    var s = "P";
    if (this.years !== 0) s += this.years + "Y";
    if (this.months !== 0 || this.quarters !== 0) s += this.months + this.quarters * 3 + "M";
    if (this.weeks !== 0) s += this.weeks + "W";
    if (this.days !== 0) s += this.days + "D";
    if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) s += "T";
    if (this.hours !== 0) s += this.hours + "H";
    if (this.minutes !== 0) s += this.minutes + "M";
    if (this.seconds !== 0 || this.milliseconds !== 0) // this will handle "floating point madness" by removing extra decimal places
      // https://stackoverflow.com/questions/588004/is-floating-point-math-broken
      s += roundTo(this.seconds + this.milliseconds / 1000, 3) + "S";
    if (s === "P") s += "T0S";
    return s;
  }
  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
   * @return {string}
   */
  ;

  _proto.toJSON = function toJSON() {
    return this.toISO();
  }
  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    return this.toISO();
  }
  /**
   * Returns an milliseconds value of this Duration.
   * @return {number}
   */
  ;

  _proto.valueOf = function valueOf() {
    return this.as("milliseconds");
  }
  /**
   * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  ;

  _proto.plus = function plus(duration) {
    if (!this.isValid) return this;
    var dur = friendlyDuration(duration),
        result = {};

    for (var _iterator = _createForOfIteratorHelperLoose(orderedUnits), _step; !(_step = _iterator()).done;) {
      var k = _step.value;

      if (hasOwnProperty(dur.values, k) || hasOwnProperty(this.values, k)) {
        result[k] = dur.get(k) + this.get(k);
      }
    }

    return clone(this, {
      values: result
    }, true);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  ;

  _proto.minus = function minus(duration) {
    if (!this.isValid) return this;
    var dur = friendlyDuration(duration);
    return this.plus(dur.negate());
  }
  /**
   * Scale this Duration by the specified amount. Return a newly-constructed Duration.
   * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnit(x => x * 2) //=> { hours: 2, minutes: 60 }
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnit((x, u) => u === "hour" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
   * @return {Duration}
   */
  ;

  _proto.mapUnits = function mapUnits(fn) {
    if (!this.isValid) return this;
    var result = {};

    for (var _i = 0, _Object$keys = Object.keys(this.values); _i < _Object$keys.length; _i++) {
      var k = _Object$keys[_i];
      result[k] = asNumber(fn(this.values[k], k));
    }

    return clone(this, {
      values: result
    }, true);
  }
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example Duration.fromObject({years: 2, days: 3}).years //=> 2
   * @example Duration.fromObject({years: 2, days: 3}).months //=> 0
   * @example Duration.fromObject({years: 2, days: 3}).days //=> 3
   * @return {number}
   */
  ;

  _proto.get = function get(unit) {
    return this[Duration.normalizeUnit(unit)];
  }
  /**
   * "Set" the values of specified units. Return a newly-constructed Duration.
   * @param {Object} values - a mapping of units to numbers
   * @example dur.set({ years: 2017 })
   * @example dur.set({ hours: 8, minutes: 30 })
   * @return {Duration}
   */
  ;

  _proto.set = function set(values) {
    if (!this.isValid) return this;
    var mixed = Object.assign(this.values, normalizeObject(values, Duration.normalizeUnit, []));
    return clone(this, {
      values: mixed
    });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  ;

  _proto.reconfigure = function reconfigure(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        locale = _ref.locale,
        numberingSystem = _ref.numberingSystem,
        conversionAccuracy = _ref.conversionAccuracy;

    var loc = this.loc.clone({
      locale: locale,
      numberingSystem: numberingSystem
    }),
        opts = {
      loc: loc
    };

    if (conversionAccuracy) {
      opts.conversionAccuracy = conversionAccuracy;
    }

    return clone(this, opts);
  }
  /**
   * Return the length of the duration in the specified unit.
   * @param {string} unit - a unit such as 'minutes' or 'days'
   * @example Duration.fromObject({years: 1}).as('days') //=> 365
   * @example Duration.fromObject({years: 1}).as('months') //=> 12
   * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
   * @return {number}
   */
  ;

  _proto.as = function as(unit) {
    return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
  }
  /**
   * Reduce this Duration to its canonical representation in its current units.
   * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
   * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
   * @return {Duration}
   */
  ;

  _proto.normalize = function normalize() {
    if (!this.isValid) return this;
    var vals = this.toObject();
    normalizeValues(this.matrix, vals);
    return clone(this, {
      values: vals
    }, true);
  }
  /**
   * Convert this Duration into its representation in a different set of units.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
   * @return {Duration}
   */
  ;

  _proto.shiftTo = function shiftTo() {
    for (var _len = arguments.length, units = new Array(_len), _key = 0; _key < _len; _key++) {
      units[_key] = arguments[_key];
    }

    if (!this.isValid) return this;

    if (units.length === 0) {
      return this;
    }

    units = units.map(function (u) {
      return Duration.normalizeUnit(u);
    });
    var built = {},
        accumulated = {},
        vals = this.toObject();
    var lastUnit;
    normalizeValues(this.matrix, vals);

    for (var _iterator2 = _createForOfIteratorHelperLoose(orderedUnits), _step2; !(_step2 = _iterator2()).done;) {
      var k = _step2.value;

      if (units.indexOf(k) >= 0) {
        lastUnit = k;
        var own = 0; // anything we haven't boiled down yet should get boiled to this unit

        for (var ak in accumulated) {
          own += this.matrix[ak][k] * accumulated[ak];
          accumulated[ak] = 0;
        } // plus anything that's already in this unit


        if (isNumber(vals[k])) {
          own += vals[k];
        }

        var i = Math.trunc(own);
        built[k] = i;
        accumulated[k] = own - i; // we'd like to absorb these fractions in another unit
        // plus anything further down the chain that should be rolled up in to this

        for (var down in vals) {
          if (orderedUnits.indexOf(down) > orderedUnits.indexOf(k)) {
            convert(this.matrix, vals, down, built, k);
          }
        } // otherwise, keep it in the wings to boil it later

      } else if (isNumber(vals[k])) {
        accumulated[k] = vals[k];
      }
    } // anything leftover becomes the decimal for the last unit
    // lastUnit must be defined since units is not empty


    for (var key in accumulated) {
      if (accumulated[key] !== 0) {
        built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
      }
    }

    return clone(this, {
      values: built
    }, true).normalize();
  }
  /**
   * Return the negative of this Duration.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
   * @return {Duration}
   */
  ;

  _proto.negate = function negate() {
    if (!this.isValid) return this;
    var negated = {};

    for (var _i2 = 0, _Object$keys2 = Object.keys(this.values); _i2 < _Object$keys2.length; _i2++) {
      var k = _Object$keys2[_i2];
      negated[k] = -this.values[k];
    }

    return clone(this, {
      values: negated
    }, true);
  }
  /**
   * Get the years.
   * @type {number}
   */
  ;

  /**
   * Equality check
   * Two Durations are equal iff they have the same units and the same values for each unit.
   * @param {Duration} other
   * @return {boolean}
   */
  _proto.equals = function equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }

    if (!this.loc.equals(other.loc)) {
      return false;
    }

    for (var _iterator3 = _createForOfIteratorHelperLoose(orderedUnits), _step3; !(_step3 = _iterator3()).done;) {
      var u = _step3.value;

      if (this.values[u] !== other.values[u]) {
        return false;
      }
    }

    return true;
  };

  _createClass(Duration, [{
    key: "locale",
    get: function get() {
      return this.isValid ? this.loc.locale : null;
    }
    /**
     * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
     *
     * @type {string}
     */

  }, {
    key: "numberingSystem",
    get: function get() {
      return this.isValid ? this.loc.numberingSystem : null;
    }
  }, {
    key: "years",
    get: function get() {
      return this.isValid ? this.values.years || 0 : NaN;
    }
    /**
     * Get the quarters.
     * @type {number}
     */

  }, {
    key: "quarters",
    get: function get() {
      return this.isValid ? this.values.quarters || 0 : NaN;
    }
    /**
     * Get the months.
     * @type {number}
     */

  }, {
    key: "months",
    get: function get() {
      return this.isValid ? this.values.months || 0 : NaN;
    }
    /**
     * Get the weeks
     * @type {number}
     */

  }, {
    key: "weeks",
    get: function get() {
      return this.isValid ? this.values.weeks || 0 : NaN;
    }
    /**
     * Get the days.
     * @type {number}
     */

  }, {
    key: "days",
    get: function get() {
      return this.isValid ? this.values.days || 0 : NaN;
    }
    /**
     * Get the hours.
     * @type {number}
     */

  }, {
    key: "hours",
    get: function get() {
      return this.isValid ? this.values.hours || 0 : NaN;
    }
    /**
     * Get the minutes.
     * @type {number}
     */

  }, {
    key: "minutes",
    get: function get() {
      return this.isValid ? this.values.minutes || 0 : NaN;
    }
    /**
     * Get the seconds.
     * @return {number}
     */

  }, {
    key: "seconds",
    get: function get() {
      return this.isValid ? this.values.seconds || 0 : NaN;
    }
    /**
     * Get the milliseconds.
     * @return {number}
     */

  }, {
    key: "milliseconds",
    get: function get() {
      return this.isValid ? this.values.milliseconds || 0 : NaN;
    }
    /**
     * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
     * on invalid DateTimes or Intervals.
     * @return {boolean}
     */

  }, {
    key: "isValid",
    get: function get() {
      return this.invalid === null;
    }
    /**
     * Returns an error code if this Duration became invalid, or null if the Duration is valid
     * @return {string}
     */

  }, {
    key: "invalidReason",
    get: function get() {
      return this.invalid ? this.invalid.reason : null;
    }
    /**
     * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
     * @type {string}
     */

  }, {
    key: "invalidExplanation",
    get: function get() {
      return this.invalid ? this.invalid.explanation : null;
    }
  }]);

  return Duration;
}();
function friendlyDuration(durationish) {
  if (isNumber(durationish)) {
    return Duration.fromMillis(durationish);
  } else if (Duration.isDuration(durationish)) {
    return durationish;
  } else if (typeof durationish === "object") {
    return Duration.fromObject(durationish);
  } else {
    throw new InvalidArgumentError("Unknown duration argument " + durationish + " of type " + typeof durationish);
  }
}

var INVALID$1 = "Invalid Interval"; // checks if the start is equal to or before the end

function validateStartEnd(start, end) {
  if (!start || !start.isValid) {
    return Interval.invalid("missing or invalid start");
  } else if (!end || !end.isValid) {
    return Interval.invalid("missing or invalid end");
  } else if (end < start) {
    return Interval.invalid("end before start", "The end of an interval must be after its start, but you had start=" + start.toISO() + " and end=" + end.toISO());
  } else {
    return null;
  }
}
/**
 * An Interval object represents a half-open interval of time, where each endpoint is a {@link DateTime}. Conceptually, it's a container for those two endpoints, accompanied by methods for creating, parsing, interrogating, comparing, transforming, and formatting them.
 *
 * Here is a brief overview of the most commonly used methods and getters in Interval:
 *
 * * **Creation** To create an Interval, use {@link fromDateTimes}, {@link after}, {@link before}, or {@link fromISO}.
 * * **Accessors** Use {@link start} and {@link end} to get the start and end.
 * * **Interrogation** To analyze the Interval, use {@link count}, {@link length}, {@link hasSame}, {@link contains}, {@link isAfter}, or {@link isBefore}.
 * * **Transformation** To create other Intervals out of this one, use {@link set}, {@link splitAt}, {@link splitBy}, {@link divideEqually}, {@link merge}, {@link xor}, {@link union}, {@link intersection}, or {@link difference}.
 * * **Comparison** To compare this Interval to another one, use {@link equals}, {@link overlaps}, {@link abutsStart}, {@link abutsEnd}, {@link engulfs}
 * * **Output** To convert the Interval into other representations, see {@link toString}, {@link toISO}, {@link toISODate}, {@link toISOTime}, {@link toFormat}, and {@link toDuration}.
 */


var Interval = /*#__PURE__*/function () {
  /**
   * @private
   */
  function Interval(config) {
    /**
     * @access private
     */
    this.s = config.start;
    /**
     * @access private
     */

    this.e = config.end;
    /**
     * @access private
     */

    this.invalid = config.invalid || null;
    /**
     * @access private
     */

    this.isLuxonInterval = true;
  }
  /**
   * Create an invalid Interval.
   * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Interval}
   */


  Interval.invalid = function invalid(reason, explanation) {
    if (explanation === void 0) {
      explanation = null;
    }

    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
    }

    var invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

    if (Settings.throwOnInvalid) {
      throw new InvalidIntervalError(invalid);
    } else {
      return new Interval({
        invalid: invalid
      });
    }
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  ;

  Interval.fromDateTimes = function fromDateTimes(start, end) {
    var builtStart = friendlyDateTime(start),
        builtEnd = friendlyDateTime(end);
    var validateError = validateStartEnd(builtStart, builtEnd);

    if (validateError == null) {
      return new Interval({
        start: builtStart,
        end: builtEnd
      });
    } else {
      return validateError;
    }
  }
  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|Date|Object} start
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  ;

  Interval.after = function after(start, duration) {
    var dur = friendlyDuration(duration),
        dt = friendlyDateTime(start);
    return Interval.fromDateTimes(dt, dt.plus(dur));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  ;

  Interval.before = function before(end, duration) {
    var dur = friendlyDuration(duration),
        dt = friendlyDateTime(end);
    return Interval.fromDateTimes(dt.minus(dur), dt);
  }
  /**
   * Create an Interval from an ISO 8601 string.
   * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
   * @param {string} text - the ISO string to parse
   * @param {Object} [opts] - options to pass {@link DateTime.fromISO} and optionally {@link Duration.fromISO}
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {Interval}
   */
  ;

  Interval.fromISO = function fromISO(text, opts) {
    var _split = (text || "").split("/", 2),
        s = _split[0],
        e = _split[1];

    if (s && e) {
      var start = DateTime.fromISO(s, opts),
          end = DateTime.fromISO(e, opts);

      if (start.isValid && end.isValid) {
        return Interval.fromDateTimes(start, end);
      }

      if (start.isValid) {
        var dur = Duration.fromISO(e, opts);

        if (dur.isValid) {
          return Interval.after(start, dur);
        }
      } else if (end.isValid) {
        var _dur = Duration.fromISO(s, opts);

        if (_dur.isValid) {
          return Interval.before(end, _dur);
        }
      }
    }

    return Interval.invalid("unparsable", "the input \"" + text + "\" can't be parsed as ISO 8601");
  }
  /**
   * Check if an object is an Interval. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  ;

  Interval.isInterval = function isInterval(o) {
    return o && o.isLuxonInterval || false;
  }
  /**
   * Returns the start of the Interval
   * @type {DateTime}
   */
  ;

  var _proto = Interval.prototype;

  /**
   * Returns the length of the Interval in the specified unit.
   * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
   * @return {number}
   */
  _proto.length = function length(unit) {
    if (unit === void 0) {
      unit = "milliseconds";
    }

    return this.isValid ? this.toDuration.apply(this, [unit]).get(unit) : NaN;
  }
  /**
   * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
   * Unlike {@link length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
   * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
   * @param {string} [unit='milliseconds'] - the unit of time to count.
   * @return {number}
   */
  ;

  _proto.count = function count(unit) {
    if (unit === void 0) {
      unit = "milliseconds";
    }

    if (!this.isValid) return NaN;
    var start = this.start.startOf(unit),
        end = this.end.startOf(unit);
    return Math.floor(end.diff(start, unit).get(unit)) + 1;
  }
  /**
   * Returns whether this Interval's start and end are both in the same unit of time
   * @param {string} unit - the unit of time to check sameness on
   * @return {boolean}
   */
  ;

  _proto.hasSame = function hasSame(unit) {
    return this.isValid ? this.e.minus(1).hasSame(this.s, unit) : false;
  }
  /**
   * Return whether this Interval has the same start and end DateTimes.
   * @return {boolean}
   */
  ;

  _proto.isEmpty = function isEmpty() {
    return this.s.valueOf() === this.e.valueOf();
  }
  /**
   * Return whether this Interval's start is after the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  ;

  _proto.isAfter = function isAfter(dateTime) {
    if (!this.isValid) return false;
    return this.s > dateTime;
  }
  /**
   * Return whether this Interval's end is before the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  ;

  _proto.isBefore = function isBefore(dateTime) {
    if (!this.isValid) return false;
    return this.e <= dateTime;
  }
  /**
   * Return whether this Interval contains the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  ;

  _proto.contains = function contains(dateTime) {
    if (!this.isValid) return false;
    return this.s <= dateTime && this.e > dateTime;
  }
  /**
   * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
   * @param {Object} values - the values to set
   * @param {DateTime} values.start - the starting DateTime
   * @param {DateTime} values.end - the ending DateTime
   * @return {Interval}
   */
  ;

  _proto.set = function set(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        start = _ref.start,
        end = _ref.end;

    if (!this.isValid) return this;
    return Interval.fromDateTimes(start || this.s, end || this.e);
  }
  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...[DateTime]} dateTimes - the unit of time to count.
   * @return {[Interval]}
   */
  ;

  _proto.splitAt = function splitAt() {
    var _this = this;

    if (!this.isValid) return [];

    for (var _len = arguments.length, dateTimes = new Array(_len), _key = 0; _key < _len; _key++) {
      dateTimes[_key] = arguments[_key];
    }

    var sorted = dateTimes.map(friendlyDateTime).filter(function (d) {
      return _this.contains(d);
    }).sort(),
        results = [];
    var s = this.s,
        i = 0;

    while (s < this.e) {
      var added = sorted[i] || this.e,
          next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s, next));
      s = next;
      i += 1;
    }

    return results;
  }
  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|Object|number} duration - The length of each resulting interval.
   * @return {[Interval]}
   */
  ;

  _proto.splitBy = function splitBy(duration) {
    var dur = friendlyDuration(duration);

    if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
      return [];
    }

    var s = this.s,
        added,
        next;
    var results = [];

    while (s < this.e) {
      added = s.plus(dur);
      next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s, next));
      s = next;
    }

    return results;
  }
  /**
   * Split this Interval into the specified number of smaller intervals.
   * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
   * @return {[Interval]}
   */
  ;

  _proto.divideEqually = function divideEqually(numberOfParts) {
    if (!this.isValid) return [];
    return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
  }
  /**
   * Return whether this Interval overlaps with the specified Interval
   * @param {Interval} other
   * @return {boolean}
   */
  ;

  _proto.overlaps = function overlaps(other) {
    return this.e > other.s && this.s < other.e;
  }
  /**
   * Return whether this Interval's end is adjacent to the specified Interval's start.
   * @param {Interval} other
   * @return {boolean}
   */
  ;

  _proto.abutsStart = function abutsStart(other) {
    if (!this.isValid) return false;
    return +this.e === +other.s;
  }
  /**
   * Return whether this Interval's start is adjacent to the specified Interval's end.
   * @param {Interval} other
   * @return {boolean}
   */
  ;

  _proto.abutsEnd = function abutsEnd(other) {
    if (!this.isValid) return false;
    return +other.e === +this.s;
  }
  /**
   * Return whether this Interval engulfs the start and end of the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  ;

  _proto.engulfs = function engulfs(other) {
    if (!this.isValid) return false;
    return this.s <= other.s && this.e >= other.e;
  }
  /**
   * Return whether this Interval has the same start and end as the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  ;

  _proto.equals = function equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }

    return this.s.equals(other.s) && this.e.equals(other.e);
  }
  /**
   * Return an Interval representing the intersection of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
   * Returns null if the intersection is empty, meaning, the intervals don't intersect.
   * @param {Interval} other
   * @return {Interval}
   */
  ;

  _proto.intersection = function intersection(other) {
    if (!this.isValid) return this;
    var s = this.s > other.s ? this.s : other.s,
        e = this.e < other.e ? this.e : other.e;

    if (s > e) {
      return null;
    } else {
      return Interval.fromDateTimes(s, e);
    }
  }
  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  ;

  _proto.union = function union(other) {
    if (!this.isValid) return this;
    var s = this.s < other.s ? this.s : other.s,
        e = this.e > other.e ? this.e : other.e;
    return Interval.fromDateTimes(s, e);
  }
  /**
   * Merge an array of Intervals into a equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * @param {[Interval]} intervals
   * @return {[Interval]}
   */
  ;

  Interval.merge = function merge(intervals) {
    var _intervals$sort$reduc = intervals.sort(function (a, b) {
      return a.s - b.s;
    }).reduce(function (_ref2, item) {
      var sofar = _ref2[0],
          current = _ref2[1];

      if (!current) {
        return [sofar, item];
      } else if (current.overlaps(item) || current.abutsStart(item)) {
        return [sofar, current.union(item)];
      } else {
        return [sofar.concat([current]), item];
      }
    }, [[], null]),
        found = _intervals$sort$reduc[0],
        final = _intervals$sort$reduc[1];

    if (final) {
      found.push(final);
    }

    return found;
  }
  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {[Interval]} intervals
   * @return {[Interval]}
   */
  ;

  Interval.xor = function xor(intervals) {
    var _Array$prototype;

    var start = null,
        currentCount = 0;

    var results = [],
        ends = intervals.map(function (i) {
      return [{
        time: i.s,
        type: "s"
      }, {
        time: i.e,
        type: "e"
      }];
    }),
        flattened = (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, ends),
        arr = flattened.sort(function (a, b) {
      return a.time - b.time;
    });

    for (var _iterator = _createForOfIteratorHelperLoose(arr), _step; !(_step = _iterator()).done;) {
      var i = _step.value;
      currentCount += i.type === "s" ? 1 : -1;

      if (currentCount === 1) {
        start = i.time;
      } else {
        if (start && +start !== +i.time) {
          results.push(Interval.fromDateTimes(start, i.time));
        }

        start = null;
      }
    }

    return Interval.merge(results);
  }
  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {[Interval]}
   */
  ;

  _proto.difference = function difference() {
    var _this2 = this;

    for (var _len2 = arguments.length, intervals = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      intervals[_key2] = arguments[_key2];
    }

    return Interval.xor([this].concat(intervals)).map(function (i) {
      return _this2.intersection(i);
    }).filter(function (i) {
      return i && !i.isEmpty();
    });
  }
  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    if (!this.isValid) return INVALID$1;
    return "[" + this.s.toISO() + " \u2013 " + this.e.toISO() + ")";
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime.toISO}
   * @return {string}
   */
  ;

  _proto.toISO = function toISO(opts) {
    if (!this.isValid) return INVALID$1;
    return this.s.toISO(opts) + "/" + this.e.toISO(opts);
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  ;

  _proto.toISODate = function toISODate() {
    if (!this.isValid) return INVALID$1;
    return this.s.toISODate() + "/" + this.e.toISODate();
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime.toISO}
   * @return {string}
   */
  ;

  _proto.toISOTime = function toISOTime(opts) {
    if (!this.isValid) return INVALID$1;
    return this.s.toISOTime(opts) + "/" + this.e.toISOTime(opts);
  }
  /**
   * Returns a string representation of this Interval formatted according to the specified format string.
   * @param {string} dateFormat - the format string. This string formats the start and end time. See {@link DateTime.toFormat} for details.
   * @param {Object} opts - options
   * @param {string} [opts.separator =  ' – '] - a separator to place between the start and end representations
   * @return {string}
   */
  ;

  _proto.toFormat = function toFormat(dateFormat, _temp2) {
    var _ref3 = _temp2 === void 0 ? {} : _temp2,
        _ref3$separator = _ref3.separator,
        separator = _ref3$separator === void 0 ? " – " : _ref3$separator;

    if (!this.isValid) return INVALID$1;
    return "" + this.s.toFormat(dateFormat) + separator + this.e.toFormat(dateFormat);
  }
  /**
   * Return a Duration representing the time spanned by this interval.
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
   * @return {Duration}
   */
  ;

  _proto.toDuration = function toDuration(unit, opts) {
    if (!this.isValid) {
      return Duration.invalid(this.invalidReason);
    }

    return this.e.diff(this.s, unit, opts);
  }
  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  ;

  _proto.mapEndpoints = function mapEndpoints(mapFn) {
    return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
  };

  _createClass(Interval, [{
    key: "start",
    get: function get() {
      return this.isValid ? this.s : null;
    }
    /**
     * Returns the end of the Interval
     * @type {DateTime}
     */

  }, {
    key: "end",
    get: function get() {
      return this.isValid ? this.e : null;
    }
    /**
     * Returns whether this Interval's end is at least its start, meaning that the Interval isn't 'backwards'.
     * @type {boolean}
     */

  }, {
    key: "isValid",
    get: function get() {
      return this.invalidReason === null;
    }
    /**
     * Returns an error code if this Interval is invalid, or null if the Interval is valid
     * @type {string}
     */

  }, {
    key: "invalidReason",
    get: function get() {
      return this.invalid ? this.invalid.reason : null;
    }
    /**
     * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
     * @type {string}
     */

  }, {
    key: "invalidExplanation",
    get: function get() {
      return this.invalid ? this.invalid.explanation : null;
    }
  }]);

  return Interval;
}();

/**
 * The Info class contains static methods for retrieving general time and date related data. For example, it has methods for finding out if a time zone has a DST, for listing the months in any supported locale, and for discovering which of Luxon features are available in the current environment.
 */

var Info = /*#__PURE__*/function () {
  function Info() {}

  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  Info.hasDST = function hasDST(zone) {
    if (zone === void 0) {
      zone = Settings.defaultZone;
    }

    var proto = DateTime.local().setZone(zone).set({
      month: 12
    });
    return !zone.universal && proto.offset !== proto.set({
      month: 6
    }).offset;
  }
  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  ;

  Info.isValidIANAZone = function isValidIANAZone(zone) {
    return IANAZone.isValidSpecifier(zone) && IANAZone.isValidZone(zone);
  }
  /**
   * Converts the input into a {@link Zone} instance.
   *
   * * If `input` is already a Zone instance, it is returned unchanged.
   * * If `input` is a string containing a valid time zone name, a Zone instance
   *   with that name is returned.
   * * If `input` is a string that doesn't refer to a known time zone, a Zone
   *   instance with {@link Zone.isValid} == false is returned.
   * * If `input is a number, a Zone instance with the specified fixed offset
   *   in minutes is returned.
   * * If `input` is `null` or `undefined`, the default zone is returned.
   * @param {string|Zone|number} [input] - the value to be converted
   * @return {Zone}
   */
  ;

  Info.normalizeZone = function normalizeZone$1(input) {
    return normalizeZone(input, Settings.defaultZone);
  }
  /**
   * Return an array of standalone month names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @example Info.months()[0] //=> 'January'
   * @example Info.months('short')[0] //=> 'Jan'
   * @example Info.months('numeric')[0] //=> '1'
   * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
   * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
   * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
   * @return {[string]}
   */
  ;

  Info.months = function months(length, _temp) {
    if (length === void 0) {
      length = "long";
    }

    var _ref = _temp === void 0 ? {} : _temp,
        _ref$locale = _ref.locale,
        locale = _ref$locale === void 0 ? null : _ref$locale,
        _ref$numberingSystem = _ref.numberingSystem,
        numberingSystem = _ref$numberingSystem === void 0 ? null : _ref$numberingSystem,
        _ref$outputCalendar = _ref.outputCalendar,
        outputCalendar = _ref$outputCalendar === void 0 ? "gregory" : _ref$outputCalendar;

    return Locale.create(locale, numberingSystem, outputCalendar).months(length);
  }
  /**
   * Return an array of format month names.
   * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
   * changes the string.
   * See {@link months}
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @return {[string]}
   */
  ;

  Info.monthsFormat = function monthsFormat(length, _temp2) {
    if (length === void 0) {
      length = "long";
    }

    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        _ref2$locale = _ref2.locale,
        locale = _ref2$locale === void 0 ? null : _ref2$locale,
        _ref2$numberingSystem = _ref2.numberingSystem,
        numberingSystem = _ref2$numberingSystem === void 0 ? null : _ref2$numberingSystem,
        _ref2$outputCalendar = _ref2.outputCalendar,
        outputCalendar = _ref2$outputCalendar === void 0 ? "gregory" : _ref2$outputCalendar;

    return Locale.create(locale, numberingSystem, outputCalendar).months(length, true);
  }
  /**
   * Return an array of standalone week names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @example Info.weekdays()[0] //=> 'Monday'
   * @example Info.weekdays('short')[0] //=> 'Mon'
   * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
   * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
   * @return {[string]}
   */
  ;

  Info.weekdays = function weekdays(length, _temp3) {
    if (length === void 0) {
      length = "long";
    }

    var _ref3 = _temp3 === void 0 ? {} : _temp3,
        _ref3$locale = _ref3.locale,
        locale = _ref3$locale === void 0 ? null : _ref3$locale,
        _ref3$numberingSystem = _ref3.numberingSystem,
        numberingSystem = _ref3$numberingSystem === void 0 ? null : _ref3$numberingSystem;

    return Locale.create(locale, numberingSystem, null).weekdays(length);
  }
  /**
   * Return an array of format week names.
   * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
   * changes the string.
   * See {@link weekdays}
   * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale=null] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @return {[string]}
   */
  ;

  Info.weekdaysFormat = function weekdaysFormat(length, _temp4) {
    if (length === void 0) {
      length = "long";
    }

    var _ref4 = _temp4 === void 0 ? {} : _temp4,
        _ref4$locale = _ref4.locale,
        locale = _ref4$locale === void 0 ? null : _ref4$locale,
        _ref4$numberingSystem = _ref4.numberingSystem,
        numberingSystem = _ref4$numberingSystem === void 0 ? null : _ref4$numberingSystem;

    return Locale.create(locale, numberingSystem, null).weekdays(length, true);
  }
  /**
   * Return an array of meridiems.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.meridiems() //=> [ 'AM', 'PM' ]
   * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
   * @return {[string]}
   */
  ;

  Info.meridiems = function meridiems(_temp5) {
    var _ref5 = _temp5 === void 0 ? {} : _temp5,
        _ref5$locale = _ref5.locale,
        locale = _ref5$locale === void 0 ? null : _ref5$locale;

    return Locale.create(locale).meridiems();
  }
  /**
   * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
   * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.eras() //=> [ 'BC', 'AD' ]
   * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
   * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
   * @return {[string]}
   */
  ;

  Info.eras = function eras(length, _temp6) {
    if (length === void 0) {
      length = "short";
    }

    var _ref6 = _temp6 === void 0 ? {} : _temp6,
        _ref6$locale = _ref6.locale,
        locale = _ref6$locale === void 0 ? null : _ref6$locale;

    return Locale.create(locale, null, "gregory").eras(length);
  }
  /**
   * Return the set of available features in this environment.
   * Some features of Luxon are not available in all environments. For example, on older browsers, timezone support is not available. Use this function to figure out if that's the case.
   * Keys:
   * * `zones`: whether this environment supports IANA timezones
   * * `intlTokens`: whether this environment supports internationalized token-based formatting/parsing
   * * `intl`: whether this environment supports general internationalization
   * * `relative`: whether this environment supports relative time formatting
   * @example Info.features() //=> { intl: true, intlTokens: false, zones: true, relative: false }
   * @return {Object}
   */
  ;

  Info.features = function features() {
    var intl = false,
        intlTokens = false,
        zones = false,
        relative = false;

    if (hasIntl()) {
      intl = true;
      intlTokens = hasFormatToParts();
      relative = hasRelative();

      try {
        zones = new Intl.DateTimeFormat("en", {
          timeZone: "America/New_York"
        }).resolvedOptions().timeZone === "America/New_York";
      } catch (e) {
        zones = false;
      }
    }

    return {
      intl: intl,
      intlTokens: intlTokens,
      zones: zones,
      relative: relative
    };
  };

  return Info;
}();

function dayDiff(earlier, later) {
  var utcDayStart = function utcDayStart(dt) {
    return dt.toUTC(0, {
      keepLocalTime: true
    }).startOf("day").valueOf();
  },
      ms = utcDayStart(later) - utcDayStart(earlier);

  return Math.floor(Duration.fromMillis(ms).as("days"));
}

function highOrderDiffs(cursor, later, units) {
  var differs = [["years", function (a, b) {
    return b.year - a.year;
  }], ["months", function (a, b) {
    return b.month - a.month + (b.year - a.year) * 12;
  }], ["weeks", function (a, b) {
    var days = dayDiff(a, b);
    return (days - days % 7) / 7;
  }], ["days", dayDiff]];
  var results = {};
  var lowestOrder, highWater;

  for (var _i = 0, _differs = differs; _i < _differs.length; _i++) {
    var _differs$_i = _differs[_i],
        unit = _differs$_i[0],
        differ = _differs$_i[1];

    if (units.indexOf(unit) >= 0) {
      var _cursor$plus;

      lowestOrder = unit;
      var delta = differ(cursor, later);
      highWater = cursor.plus((_cursor$plus = {}, _cursor$plus[unit] = delta, _cursor$plus));

      if (highWater > later) {
        var _cursor$plus2;

        cursor = cursor.plus((_cursor$plus2 = {}, _cursor$plus2[unit] = delta - 1, _cursor$plus2));
        delta -= 1;
      } else {
        cursor = highWater;
      }

      results[unit] = delta;
    }
  }

  return [cursor, results, highWater, lowestOrder];
}

function _diff (earlier, later, units, opts) {
  var _highOrderDiffs = highOrderDiffs(earlier, later, units),
      cursor = _highOrderDiffs[0],
      results = _highOrderDiffs[1],
      highWater = _highOrderDiffs[2],
      lowestOrder = _highOrderDiffs[3];

  var remainingMillis = later - cursor;
  var lowerOrderUnits = units.filter(function (u) {
    return ["hours", "minutes", "seconds", "milliseconds"].indexOf(u) >= 0;
  });

  if (lowerOrderUnits.length === 0) {
    if (highWater < later) {
      var _cursor$plus3;

      highWater = cursor.plus((_cursor$plus3 = {}, _cursor$plus3[lowestOrder] = 1, _cursor$plus3));
    }

    if (highWater !== cursor) {
      results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
    }
  }

  var duration = Duration.fromObject(Object.assign(results, opts));

  if (lowerOrderUnits.length > 0) {
    var _Duration$fromMillis;

    return (_Duration$fromMillis = Duration.fromMillis(remainingMillis, opts)).shiftTo.apply(_Duration$fromMillis, lowerOrderUnits).plus(duration);
  } else {
    return duration;
  }
}

var numberingSystems = {
  arab: "[\u0660-\u0669]",
  arabext: "[\u06F0-\u06F9]",
  bali: "[\u1B50-\u1B59]",
  beng: "[\u09E6-\u09EF]",
  deva: "[\u0966-\u096F]",
  fullwide: "[\uFF10-\uFF19]",
  gujr: "[\u0AE6-\u0AEF]",
  hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
  khmr: "[\u17E0-\u17E9]",
  knda: "[\u0CE6-\u0CEF]",
  laoo: "[\u0ED0-\u0ED9]",
  limb: "[\u1946-\u194F]",
  mlym: "[\u0D66-\u0D6F]",
  mong: "[\u1810-\u1819]",
  mymr: "[\u1040-\u1049]",
  orya: "[\u0B66-\u0B6F]",
  tamldec: "[\u0BE6-\u0BEF]",
  telu: "[\u0C66-\u0C6F]",
  thai: "[\u0E50-\u0E59]",
  tibt: "[\u0F20-\u0F29]",
  latn: "\\d"
};
var numberingSystemsUTF16 = {
  arab: [1632, 1641],
  arabext: [1776, 1785],
  bali: [6992, 7001],
  beng: [2534, 2543],
  deva: [2406, 2415],
  fullwide: [65296, 65303],
  gujr: [2790, 2799],
  khmr: [6112, 6121],
  knda: [3302, 3311],
  laoo: [3792, 3801],
  limb: [6470, 6479],
  mlym: [3430, 3439],
  mong: [6160, 6169],
  mymr: [4160, 4169],
  orya: [2918, 2927],
  tamldec: [3046, 3055],
  telu: [3174, 3183],
  thai: [3664, 3673],
  tibt: [3872, 3881]
}; // eslint-disable-next-line

var hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");
function parseDigits(str) {
  var value = parseInt(str, 10);

  if (isNaN(value)) {
    value = "";

    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);

      if (str[i].search(numberingSystems.hanidec) !== -1) {
        value += hanidecChars.indexOf(str[i]);
      } else {
        for (var key in numberingSystemsUTF16) {
          var _numberingSystemsUTF = numberingSystemsUTF16[key],
              min = _numberingSystemsUTF[0],
              max = _numberingSystemsUTF[1];

          if (code >= min && code <= max) {
            value += code - min;
          }
        }
      }
    }

    return parseInt(value, 10);
  } else {
    return value;
  }
}
function digitRegex(_ref, append) {
  var numberingSystem = _ref.numberingSystem;

  if (append === void 0) {
    append = "";
  }

  return new RegExp("" + numberingSystems[numberingSystem || "latn"] + append);
}

var MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";

function intUnit(regex, post) {
  if (post === void 0) {
    post = function post(i) {
      return i;
    };
  }

  return {
    regex: regex,
    deser: function deser(_ref) {
      var s = _ref[0];
      return post(parseDigits(s));
    }
  };
}

function fixListRegex(s) {
  // make dots optional and also make them literal
  return s.replace(/\./, "\\.?");
}

function stripInsensitivities(s) {
  return s.replace(/\./, "").toLowerCase();
}

function oneOf(strings, startIndex) {
  if (strings === null) {
    return null;
  } else {
    return {
      regex: RegExp(strings.map(fixListRegex).join("|")),
      deser: function deser(_ref2) {
        var s = _ref2[0];
        return strings.findIndex(function (i) {
          return stripInsensitivities(s) === stripInsensitivities(i);
        }) + startIndex;
      }
    };
  }
}

function offset(regex, groups) {
  return {
    regex: regex,
    deser: function deser(_ref3) {
      var h = _ref3[1],
          m = _ref3[2];
      return signedOffset(h, m);
    },
    groups: groups
  };
}

function simple(regex) {
  return {
    regex: regex,
    deser: function deser(_ref4) {
      var s = _ref4[0];
      return s;
    }
  };
}

function escapeToken(value) {
  // eslint-disable-next-line no-useless-escape
  return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}

function unitForToken(token, loc) {
  var one = digitRegex(loc),
      two = digitRegex(loc, "{2}"),
      three = digitRegex(loc, "{3}"),
      four = digitRegex(loc, "{4}"),
      six = digitRegex(loc, "{6}"),
      oneOrTwo = digitRegex(loc, "{1,2}"),
      oneToThree = digitRegex(loc, "{1,3}"),
      oneToSix = digitRegex(loc, "{1,6}"),
      oneToNine = digitRegex(loc, "{1,9}"),
      twoToFour = digitRegex(loc, "{2,4}"),
      fourToSix = digitRegex(loc, "{4,6}"),
      literal = function literal(t) {
    return {
      regex: RegExp(escapeToken(t.val)),
      deser: function deser(_ref5) {
        var s = _ref5[0];
        return s;
      },
      literal: true
    };
  },
      unitate = function unitate(t) {
    if (token.literal) {
      return literal(t);
    }

    switch (t.val) {
      // era
      case "G":
        return oneOf(loc.eras("short", false), 0);

      case "GG":
        return oneOf(loc.eras("long", false), 0);
      // years

      case "y":
        return intUnit(oneToSix);

      case "yy":
        return intUnit(twoToFour, untruncateYear);

      case "yyyy":
        return intUnit(four);

      case "yyyyy":
        return intUnit(fourToSix);

      case "yyyyyy":
        return intUnit(six);
      // months

      case "M":
        return intUnit(oneOrTwo);

      case "MM":
        return intUnit(two);

      case "MMM":
        return oneOf(loc.months("short", true, false), 1);

      case "MMMM":
        return oneOf(loc.months("long", true, false), 1);

      case "L":
        return intUnit(oneOrTwo);

      case "LL":
        return intUnit(two);

      case "LLL":
        return oneOf(loc.months("short", false, false), 1);

      case "LLLL":
        return oneOf(loc.months("long", false, false), 1);
      // dates

      case "d":
        return intUnit(oneOrTwo);

      case "dd":
        return intUnit(two);
      // ordinals

      case "o":
        return intUnit(oneToThree);

      case "ooo":
        return intUnit(three);
      // time

      case "HH":
        return intUnit(two);

      case "H":
        return intUnit(oneOrTwo);

      case "hh":
        return intUnit(two);

      case "h":
        return intUnit(oneOrTwo);

      case "mm":
        return intUnit(two);

      case "m":
        return intUnit(oneOrTwo);

      case "q":
        return intUnit(oneOrTwo);

      case "qq":
        return intUnit(two);

      case "s":
        return intUnit(oneOrTwo);

      case "ss":
        return intUnit(two);

      case "S":
        return intUnit(oneToThree);

      case "SSS":
        return intUnit(three);

      case "u":
        return simple(oneToNine);
      // meridiem

      case "a":
        return oneOf(loc.meridiems(), 0);
      // weekYear (k)

      case "kkkk":
        return intUnit(four);

      case "kk":
        return intUnit(twoToFour, untruncateYear);
      // weekNumber (W)

      case "W":
        return intUnit(oneOrTwo);

      case "WW":
        return intUnit(two);
      // weekdays

      case "E":
      case "c":
        return intUnit(one);

      case "EEE":
        return oneOf(loc.weekdays("short", false, false), 1);

      case "EEEE":
        return oneOf(loc.weekdays("long", false, false), 1);

      case "ccc":
        return oneOf(loc.weekdays("short", true, false), 1);

      case "cccc":
        return oneOf(loc.weekdays("long", true, false), 1);
      // offset/zone

      case "Z":
      case "ZZ":
        return offset(new RegExp("([+-]" + oneOrTwo.source + ")(?::(" + two.source + "))?"), 2);

      case "ZZZ":
        return offset(new RegExp("([+-]" + oneOrTwo.source + ")(" + two.source + ")?"), 2);
      // we don't support ZZZZ (PST) or ZZZZZ (Pacific Standard Time) in parsing
      // because we don't have any way to figure out what they are

      case "z":
        return simple(/[a-z_+-/]{1,256}?/i);

      default:
        return literal(t);
    }
  };

  var unit = unitate(token) || {
    invalidReason: MISSING_FTP
  };
  unit.token = token;
  return unit;
}

var partTypeStyleToTokenVal = {
  year: {
    "2-digit": "yy",
    numeric: "yyyyy"
  },
  month: {
    numeric: "M",
    "2-digit": "MM",
    short: "MMM",
    long: "MMMM"
  },
  day: {
    numeric: "d",
    "2-digit": "dd"
  },
  weekday: {
    short: "EEE",
    long: "EEEE"
  },
  dayperiod: "a",
  dayPeriod: "a",
  hour: {
    numeric: "h",
    "2-digit": "hh"
  },
  minute: {
    numeric: "m",
    "2-digit": "mm"
  },
  second: {
    numeric: "s",
    "2-digit": "ss"
  }
};

function tokenForPart(part, locale, formatOpts) {
  var type = part.type,
      value = part.value;

  if (type === "literal") {
    return {
      literal: true,
      val: value
    };
  }

  var style = formatOpts[type];
  var val = partTypeStyleToTokenVal[type];

  if (typeof val === "object") {
    val = val[style];
  }

  if (val) {
    return {
      literal: false,
      val: val
    };
  }

  return undefined;
}

function buildRegex(units) {
  var re = units.map(function (u) {
    return u.regex;
  }).reduce(function (f, r) {
    return f + "(" + r.source + ")";
  }, "");
  return ["^" + re + "$", units];
}

function match(input, regex, handlers) {
  var matches = input.match(regex);

  if (matches) {
    var all = {};
    var matchIndex = 1;

    for (var i in handlers) {
      if (hasOwnProperty(handlers, i)) {
        var h = handlers[i],
            groups = h.groups ? h.groups + 1 : 1;

        if (!h.literal && h.token) {
          all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
        }

        matchIndex += groups;
      }
    }

    return [matches, all];
  } else {
    return [matches, {}];
  }
}

function dateTimeFromMatches(matches) {
  var toField = function toField(token) {
    switch (token) {
      case "S":
        return "millisecond";

      case "s":
        return "second";

      case "m":
        return "minute";

      case "h":
      case "H":
        return "hour";

      case "d":
        return "day";

      case "o":
        return "ordinal";

      case "L":
      case "M":
        return "month";

      case "y":
        return "year";

      case "E":
      case "c":
        return "weekday";

      case "W":
        return "weekNumber";

      case "k":
        return "weekYear";

      case "q":
        return "quarter";

      default:
        return null;
    }
  };

  var zone;

  if (!isUndefined(matches.Z)) {
    zone = new FixedOffsetZone(matches.Z);
  } else if (!isUndefined(matches.z)) {
    zone = IANAZone.create(matches.z);
  } else {
    zone = null;
  }

  if (!isUndefined(matches.q)) {
    matches.M = (matches.q - 1) * 3 + 1;
  }

  if (!isUndefined(matches.h)) {
    if (matches.h < 12 && matches.a === 1) {
      matches.h += 12;
    } else if (matches.h === 12 && matches.a === 0) {
      matches.h = 0;
    }
  }

  if (matches.G === 0 && matches.y) {
    matches.y = -matches.y;
  }

  if (!isUndefined(matches.u)) {
    matches.S = parseMillis(matches.u);
  }

  var vals = Object.keys(matches).reduce(function (r, k) {
    var f = toField(k);

    if (f) {
      r[f] = matches[k];
    }

    return r;
  }, {});
  return [vals, zone];
}

var dummyDateTimeCache = null;

function getDummyDateTime() {
  if (!dummyDateTimeCache) {
    dummyDateTimeCache = DateTime.fromMillis(1555555555555);
  }

  return dummyDateTimeCache;
}

function maybeExpandMacroToken(token, locale) {
  if (token.literal) {
    return token;
  }

  var formatOpts = Formatter.macroTokenToFormatOpts(token.val);

  if (!formatOpts) {
    return token;
  }

  var formatter = Formatter.create(locale, formatOpts);
  var parts = formatter.formatDateTimeParts(getDummyDateTime());
  var tokens = parts.map(function (p) {
    return tokenForPart(p, locale, formatOpts);
  });

  if (tokens.includes(undefined)) {
    return token;
  }

  return tokens;
}

function expandMacroTokens(tokens, locale) {
  var _Array$prototype;

  return (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, tokens.map(function (t) {
    return maybeExpandMacroToken(t, locale);
  }));
}
/**
 * @private
 */


function explainFromTokens(locale, input, format) {
  var tokens = expandMacroTokens(Formatter.parseFormat(format), locale),
      units = tokens.map(function (t) {
    return unitForToken(t, locale);
  }),
      disqualifyingUnit = units.find(function (t) {
    return t.invalidReason;
  });

  if (disqualifyingUnit) {
    return {
      input: input,
      tokens: tokens,
      invalidReason: disqualifyingUnit.invalidReason
    };
  } else {
    var _buildRegex = buildRegex(units),
        regexString = _buildRegex[0],
        handlers = _buildRegex[1],
        regex = RegExp(regexString, "i"),
        _match = match(input, regex, handlers),
        rawMatches = _match[0],
        matches = _match[1],
        _ref6 = matches ? dateTimeFromMatches(matches) : [null, null],
        result = _ref6[0],
        zone = _ref6[1];

    if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
      throw new ConflictingSpecificationError("Can't include meridiem when specifying 24-hour format");
    }

    return {
      input: input,
      tokens: tokens,
      regex: regex,
      rawMatches: rawMatches,
      matches: matches,
      result: result,
      zone: zone
    };
  }
}
function parseFromTokens(locale, input, format) {
  var _explainFromTokens = explainFromTokens(locale, input, format),
      result = _explainFromTokens.result,
      zone = _explainFromTokens.zone,
      invalidReason = _explainFromTokens.invalidReason;

  return [result, zone, invalidReason];
}

var nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
    leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

function unitOutOfRange(unit, value) {
  return new Invalid("unit out of range", "you specified " + value + " (of type " + typeof value + ") as a " + unit + ", which is invalid");
}

function dayOfWeek(year, month, day) {
  var js = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return js === 0 ? 7 : js;
}

function computeOrdinal(year, month, day) {
  return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
}

function uncomputeOrdinal(year, ordinal) {
  var table = isLeapYear(year) ? leapLadder : nonLeapLadder,
      month0 = table.findIndex(function (i) {
    return i < ordinal;
  }),
      day = ordinal - table[month0];
  return {
    month: month0 + 1,
    day: day
  };
}
/**
 * @private
 */


function gregorianToWeek(gregObj) {
  var year = gregObj.year,
      month = gregObj.month,
      day = gregObj.day,
      ordinal = computeOrdinal(year, month, day),
      weekday = dayOfWeek(year, month, day);
  var weekNumber = Math.floor((ordinal - weekday + 10) / 7),
      weekYear;

  if (weekNumber < 1) {
    weekYear = year - 1;
    weekNumber = weeksInWeekYear(weekYear);
  } else if (weekNumber > weeksInWeekYear(year)) {
    weekYear = year + 1;
    weekNumber = 1;
  } else {
    weekYear = year;
  }

  return Object.assign({
    weekYear: weekYear,
    weekNumber: weekNumber,
    weekday: weekday
  }, timeObject(gregObj));
}
function weekToGregorian(weekData) {
  var weekYear = weekData.weekYear,
      weekNumber = weekData.weekNumber,
      weekday = weekData.weekday,
      weekdayOfJan4 = dayOfWeek(weekYear, 1, 4),
      yearInDays = daysInYear(weekYear);
  var ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 3,
      year;

  if (ordinal < 1) {
    year = weekYear - 1;
    ordinal += daysInYear(year);
  } else if (ordinal > yearInDays) {
    year = weekYear + 1;
    ordinal -= daysInYear(weekYear);
  } else {
    year = weekYear;
  }

  var _uncomputeOrdinal = uncomputeOrdinal(year, ordinal),
      month = _uncomputeOrdinal.month,
      day = _uncomputeOrdinal.day;

  return Object.assign({
    year: year,
    month: month,
    day: day
  }, timeObject(weekData));
}
function gregorianToOrdinal(gregData) {
  var year = gregData.year,
      month = gregData.month,
      day = gregData.day,
      ordinal = computeOrdinal(year, month, day);
  return Object.assign({
    year: year,
    ordinal: ordinal
  }, timeObject(gregData));
}
function ordinalToGregorian(ordinalData) {
  var year = ordinalData.year,
      ordinal = ordinalData.ordinal,
      _uncomputeOrdinal2 = uncomputeOrdinal(year, ordinal),
      month = _uncomputeOrdinal2.month,
      day = _uncomputeOrdinal2.day;

  return Object.assign({
    year: year,
    month: month,
    day: day
  }, timeObject(ordinalData));
}
function hasInvalidWeekData(obj) {
  var validYear = isInteger(obj.weekYear),
      validWeek = integerBetween(obj.weekNumber, 1, weeksInWeekYear(obj.weekYear)),
      validWeekday = integerBetween(obj.weekday, 1, 7);

  if (!validYear) {
    return unitOutOfRange("weekYear", obj.weekYear);
  } else if (!validWeek) {
    return unitOutOfRange("week", obj.week);
  } else if (!validWeekday) {
    return unitOutOfRange("weekday", obj.weekday);
  } else return false;
}
function hasInvalidOrdinalData(obj) {
  var validYear = isInteger(obj.year),
      validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));

  if (!validYear) {
    return unitOutOfRange("year", obj.year);
  } else if (!validOrdinal) {
    return unitOutOfRange("ordinal", obj.ordinal);
  } else return false;
}
function hasInvalidGregorianData(obj) {
  var validYear = isInteger(obj.year),
      validMonth = integerBetween(obj.month, 1, 12),
      validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));

  if (!validYear) {
    return unitOutOfRange("year", obj.year);
  } else if (!validMonth) {
    return unitOutOfRange("month", obj.month);
  } else if (!validDay) {
    return unitOutOfRange("day", obj.day);
  } else return false;
}
function hasInvalidTimeData(obj) {
  var hour = obj.hour,
      minute = obj.minute,
      second = obj.second,
      millisecond = obj.millisecond;
  var validHour = integerBetween(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0,
      validMinute = integerBetween(minute, 0, 59),
      validSecond = integerBetween(second, 0, 59),
      validMillisecond = integerBetween(millisecond, 0, 999);

  if (!validHour) {
    return unitOutOfRange("hour", hour);
  } else if (!validMinute) {
    return unitOutOfRange("minute", minute);
  } else if (!validSecond) {
    return unitOutOfRange("second", second);
  } else if (!validMillisecond) {
    return unitOutOfRange("millisecond", millisecond);
  } else return false;
}

var INVALID$2 = "Invalid DateTime";
var MAX_DATE = 8.64e15;

function unsupportedZone(zone) {
  return new Invalid("unsupported zone", "the zone \"" + zone.name + "\" is not supported");
} // we cache week data on the DT object and this intermediates the cache


function possiblyCachedWeekData(dt) {
  if (dt.weekData === null) {
    dt.weekData = gregorianToWeek(dt.c);
  }

  return dt.weekData;
} // clone really means, "make a new object with these modifications". all "setters" really use this
// to create a new object while only changing some of the properties


function clone$1(inst, alts) {
  var current = {
    ts: inst.ts,
    zone: inst.zone,
    c: inst.c,
    o: inst.o,
    loc: inst.loc,
    invalid: inst.invalid
  };
  return new DateTime(Object.assign({}, current, alts, {
    old: current
  }));
} // find the right offset a given local time. The o input is our guess, which determines which
// offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)


function fixOffset(localTS, o, tz) {
  // Our UTC time is just a guess because our offset is just a guess
  var utcGuess = localTS - o * 60 * 1000; // Test whether the zone matches the offset for this ts

  var o2 = tz.offset(utcGuess); // If so, offset didn't change and we're done

  if (o === o2) {
    return [utcGuess, o];
  } // If not, change the ts by the difference in the offset


  utcGuess -= (o2 - o) * 60 * 1000; // If that gives us the local time we want, we're done

  var o3 = tz.offset(utcGuess);

  if (o2 === o3) {
    return [utcGuess, o2];
  } // If it's different, we're in a hole time. The offset has changed, but the we don't adjust the time


  return [localTS - Math.min(o2, o3) * 60 * 1000, Math.max(o2, o3)];
} // convert an epoch timestamp into a calendar object with the given offset


function tsToObj(ts, offset) {
  ts += offset * 60 * 1000;
  var d = new Date(ts);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    millisecond: d.getUTCMilliseconds()
  };
} // convert a calendar object to a epoch timestamp


function objToTS(obj, offset, zone) {
  return fixOffset(objToLocalTS(obj), offset, zone);
} // create a new DT instance by adding a duration, adjusting for DSTs


function adjustTime(inst, dur) {
  var _dur;

  var keys = Object.keys(dur.values);

  if (keys.indexOf("milliseconds") === -1) {
    keys.push("milliseconds");
  }

  dur = (_dur = dur).shiftTo.apply(_dur, keys);
  var oPre = inst.o,
      year = inst.c.year + dur.years,
      month = inst.c.month + dur.months + dur.quarters * 3,
      c = Object.assign({}, inst.c, {
    year: year,
    month: month,
    day: Math.min(inst.c.day, daysInMonth(year, month)) + dur.days + dur.weeks * 7
  }),
      millisToAdd = Duration.fromObject({
    hours: dur.hours,
    minutes: dur.minutes,
    seconds: dur.seconds,
    milliseconds: dur.milliseconds
  }).as("milliseconds"),
      localTS = objToLocalTS(c);

  var _fixOffset = fixOffset(localTS, oPre, inst.zone),
      ts = _fixOffset[0],
      o = _fixOffset[1];

  if (millisToAdd !== 0) {
    ts += millisToAdd; // that could have changed the offset by going over a DST, but we want to keep the ts the same

    o = inst.zone.offset(ts);
  }

  return {
    ts: ts,
    o: o
  };
} // helper useful in turning the results of parsing into real dates
// by handling the zone options


function parseDataToDateTime(parsed, parsedZone, opts, format, text) {
  var setZone = opts.setZone,
      zone = opts.zone;

  if (parsed && Object.keys(parsed).length !== 0) {
    var interpretationZone = parsedZone || zone,
        inst = DateTime.fromObject(Object.assign(parsed, opts, {
      zone: interpretationZone,
      // setZone is a valid option in the calling methods, but not in fromObject
      setZone: undefined
    }));
    return setZone ? inst : inst.setZone(zone);
  } else {
    return DateTime.invalid(new Invalid("unparsable", "the input \"" + text + "\" can't be parsed as " + format));
  }
} // if you want to output a technical format (e.g. RFC 2822), this helper
// helps handle the details


function toTechFormat(dt, format, allowZ) {
  if (allowZ === void 0) {
    allowZ = true;
  }

  return dt.isValid ? Formatter.create(Locale.create("en-US"), {
    allowZ: allowZ,
    forceSimple: true
  }).formatDateTimeFromString(dt, format) : null;
} // technical time formats (e.g. the time part of ISO 8601), take some options
// and this commonizes their handling


function toTechTimeFormat(dt, _ref) {
  var _ref$suppressSeconds = _ref.suppressSeconds,
      suppressSeconds = _ref$suppressSeconds === void 0 ? false : _ref$suppressSeconds,
      _ref$suppressMillisec = _ref.suppressMilliseconds,
      suppressMilliseconds = _ref$suppressMillisec === void 0 ? false : _ref$suppressMillisec,
      includeOffset = _ref.includeOffset,
      _ref$includeZone = _ref.includeZone,
      includeZone = _ref$includeZone === void 0 ? false : _ref$includeZone,
      _ref$spaceZone = _ref.spaceZone,
      spaceZone = _ref$spaceZone === void 0 ? false : _ref$spaceZone,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? "extended" : _ref$format;
  var fmt = format === "basic" ? "HHmm" : "HH:mm";

  if (!suppressSeconds || dt.second !== 0 || dt.millisecond !== 0) {
    fmt += format === "basic" ? "ss" : ":ss";

    if (!suppressMilliseconds || dt.millisecond !== 0) {
      fmt += ".SSS";
    }
  }

  if ((includeZone || includeOffset) && spaceZone) {
    fmt += " ";
  }

  if (includeZone) {
    fmt += "z";
  } else if (includeOffset) {
    fmt += format === "basic" ? "ZZZ" : "ZZ";
  }

  return toTechFormat(dt, fmt);
} // defaults for unspecified units in the supported calendars


var defaultUnitValues = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
},
    defaultWeekUnitValues = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
},
    defaultOrdinalUnitValues = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}; // Units in the supported calendars, sorted by bigness

var orderedUnits$1 = ["year", "month", "day", "hour", "minute", "second", "millisecond"],
    orderedWeekUnits = ["weekYear", "weekNumber", "weekday", "hour", "minute", "second", "millisecond"],
    orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"]; // standardize case and plurality in units

function normalizeUnit(unit) {
  var normalized = {
    year: "year",
    years: "year",
    month: "month",
    months: "month",
    day: "day",
    days: "day",
    hour: "hour",
    hours: "hour",
    minute: "minute",
    minutes: "minute",
    quarter: "quarter",
    quarters: "quarter",
    second: "second",
    seconds: "second",
    millisecond: "millisecond",
    milliseconds: "millisecond",
    weekday: "weekday",
    weekdays: "weekday",
    weeknumber: "weekNumber",
    weeksnumber: "weekNumber",
    weeknumbers: "weekNumber",
    weekyear: "weekYear",
    weekyears: "weekYear",
    ordinal: "ordinal"
  }[unit.toLowerCase()];
  if (!normalized) throw new InvalidUnitError(unit);
  return normalized;
} // this is a dumbed down version of fromObject() that runs about 60% faster
// but doesn't do any validation, makes a bunch of assumptions about what units
// are present, and so on.


function quickDT(obj, zone) {
  // assume we have the higher-order units
  for (var _iterator = _createForOfIteratorHelperLoose(orderedUnits$1), _step; !(_step = _iterator()).done;) {
    var u = _step.value;

    if (isUndefined(obj[u])) {
      obj[u] = defaultUnitValues[u];
    }
  }

  var invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);

  if (invalid) {
    return DateTime.invalid(invalid);
  }

  var tsNow = Settings.now(),
      offsetProvis = zone.offset(tsNow),
      _objToTS = objToTS(obj, offsetProvis, zone),
      ts = _objToTS[0],
      o = _objToTS[1];

  return new DateTime({
    ts: ts,
    zone: zone,
    o: o
  });
}

function diffRelative(start, end, opts) {
  var round = isUndefined(opts.round) ? true : opts.round,
      format = function format(c, unit) {
    c = roundTo(c, round || opts.calendary ? 0 : 2, true);
    var formatter = end.loc.clone(opts).relFormatter(opts);
    return formatter.format(c, unit);
  },
      differ = function differ(unit) {
    if (opts.calendary) {
      if (!end.hasSame(start, unit)) {
        return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
      } else return 0;
    } else {
      return end.diff(start, unit).get(unit);
    }
  };

  if (opts.unit) {
    return format(differ(opts.unit), opts.unit);
  }

  for (var _iterator2 = _createForOfIteratorHelperLoose(opts.units), _step2; !(_step2 = _iterator2()).done;) {
    var unit = _step2.value;
    var count = differ(unit);

    if (Math.abs(count) >= 1) {
      return format(count, unit);
    }
  }

  return format(0, opts.units[opts.units.length - 1]);
}
/**
 * A DateTime is an immutable data structure representing a specific date and time and accompanying methods. It contains class and instance methods for creating, parsing, interrogating, transforming, and formatting them.
 *
 * A DateTime comprises of:
 * * A timestamp. Each DateTime instance refers to a specific millisecond of the Unix epoch.
 * * A time zone. Each instance is considered in the context of a specific zone (by default the local system's zone).
 * * Configuration properties that effect how output strings are formatted, such as `locale`, `numberingSystem`, and `outputCalendar`.
 *
 * Here is a brief overview of the most commonly used functionality it provides:
 *
 * * **Creation**: To create a DateTime from its components, use one of its factory class methods: {@link local}, {@link utc}, and (most flexibly) {@link fromObject}. To create one from a standard string format, use {@link fromISO}, {@link fromHTTP}, and {@link fromRFC2822}. To create one from a custom string format, use {@link fromFormat}. To create one from a native JS date, use {@link fromJSDate}.
 * * **Gregorian calendar and time**: To examine the Gregorian properties of a DateTime individually (i.e as opposed to collectively through {@link toObject}), use the {@link year}, {@link month},
 * {@link day}, {@link hour}, {@link minute}, {@link second}, {@link millisecond} accessors.
 * * **Week calendar**: For ISO week calendar attributes, see the {@link weekYear}, {@link weekNumber}, and {@link weekday} accessors.
 * * **Configuration** See the {@link locale} and {@link numberingSystem} accessors.
 * * **Transformation**: To transform the DateTime into other DateTimes, use {@link set}, {@link reconfigure}, {@link setZone}, {@link setLocale}, {@link plus}, {@link minus}, {@link endOf}, {@link startOf}, {@link toUTC}, and {@link toLocal}.
 * * **Output**: To convert the DateTime to other representations, use the {@link toRelative}, {@link toRelativeCalendar}, {@link toJSON}, {@link toISO}, {@link toHTTP}, {@link toObject}, {@link toRFC2822}, {@link toString}, {@link toLocaleString}, {@link toFormat}, {@link toMillis} and {@link toJSDate}.
 *
 * There's plenty others documented below. In addition, for more information on subtler topics like internationalization, time zones, alternative calendars, validity, and so on, see the external documentation.
 */


var DateTime = /*#__PURE__*/function () {
  /**
   * @access private
   */
  function DateTime(config) {
    var zone = config.zone || Settings.defaultZone;
    var invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) || (!zone.isValid ? unsupportedZone(zone) : null);
    /**
     * @access private
     */

    this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;
    var c = null,
        o = null;

    if (!invalid) {
      var unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);

      if (unchanged) {
        var _ref2 = [config.old.c, config.old.o];
        c = _ref2[0];
        o = _ref2[1];
      } else {
        var ot = zone.offset(this.ts);
        c = tsToObj(this.ts, ot);
        invalid = Number.isNaN(c.year) ? new Invalid("invalid input") : null;
        c = invalid ? null : c;
        o = invalid ? null : ot;
      }
    }
    /**
     * @access private
     */


    this._zone = zone;
    /**
     * @access private
     */

    this.loc = config.loc || Locale.create();
    /**
     * @access private
     */

    this.invalid = invalid;
    /**
     * @access private
     */

    this.weekData = null;
    /**
     * @access private
     */

    this.c = c;
    /**
     * @access private
     */

    this.o = o;
    /**
     * @access private
     */

    this.isLuxonDateTime = true;
  } // CONSTRUCT

  /**
   * Create a local DateTime
   * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @example DateTime.local()                            //~> now
   * @example DateTime.local(2017)                        //~> 2017-01-01T00:00:00
   * @example DateTime.local(2017, 3)                     //~> 2017-03-01T00:00:00
   * @example DateTime.local(2017, 3, 12)                 //~> 2017-03-12T00:00:00
   * @example DateTime.local(2017, 3, 12, 5)              //~> 2017-03-12T05:00:00
   * @example DateTime.local(2017, 3, 12, 5, 45)          //~> 2017-03-12T05:45:00
   * @example DateTime.local(2017, 3, 12, 5, 45, 10)      //~> 2017-03-12T05:45:10
   * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765) //~> 2017-03-12T05:45:10.765
   * @return {DateTime}
   */


  DateTime.local = function local(year, month, day, hour, minute, second, millisecond) {
    if (isUndefined(year)) {
      return new DateTime({
        ts: Settings.now()
      });
    } else {
      return quickDT({
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond
      }, Settings.defaultZone);
    }
  }
  /**
   * Create a DateTime in UTC
   * @param {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @example DateTime.utc()                            //~> now
   * @example DateTime.utc(2017)                        //~> 2017-01-01T00:00:00Z
   * @example DateTime.utc(2017, 3)                     //~> 2017-03-01T00:00:00Z
   * @example DateTime.utc(2017, 3, 12)                 //~> 2017-03-12T00:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5)              //~> 2017-03-12T05:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45)          //~> 2017-03-12T05:45:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10)      //~> 2017-03-12T05:45:10Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765) //~> 2017-03-12T05:45:10.765Z
   * @return {DateTime}
   */
  ;

  DateTime.utc = function utc(year, month, day, hour, minute, second, millisecond) {
    if (isUndefined(year)) {
      return new DateTime({
        ts: Settings.now(),
        zone: FixedOffsetZone.utcInstance
      });
    } else {
      return quickDT({
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond
      }, FixedOffsetZone.utcInstance);
    }
  }
  /**
   * Create a DateTime from a Javascript Date object. Uses the default zone.
   * @param {Date} date - a Javascript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  ;

  DateTime.fromJSDate = function fromJSDate(date, options) {
    if (options === void 0) {
      options = {};
    }

    var ts = isDate(date) ? date.valueOf() : NaN;

    if (Number.isNaN(ts)) {
      return DateTime.invalid("invalid input");
    }

    var zoneToUse = normalizeZone(options.zone, Settings.defaultZone);

    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone(zoneToUse));
    }

    return new DateTime({
      ts: ts,
      zone: zoneToUse,
      loc: Locale.fromObject(options)
    });
  }
  /**
   * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} milliseconds - a number of milliseconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @return {DateTime}
   */
  ;

  DateTime.fromMillis = function fromMillis(milliseconds, options) {
    if (options === void 0) {
      options = {};
    }

    if (!isNumber(milliseconds)) {
      throw new InvalidArgumentError("fromMillis requires a numerical input, but received a " + typeof milliseconds + " with value " + milliseconds);
    } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
      // this isn't perfect because because we can still end up out of range because of additional shifting, but it's a start
      return DateTime.invalid("Timestamp out of range");
    } else {
      return new DateTime({
        ts: milliseconds,
        zone: normalizeZone(options.zone, Settings.defaultZone),
        loc: Locale.fromObject(options)
      });
    }
  }
  /**
   * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} seconds - a number of seconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @return {DateTime}
   */
  ;

  DateTime.fromSeconds = function fromSeconds(seconds, options) {
    if (options === void 0) {
      options = {};
    }

    if (!isNumber(seconds)) {
      throw new InvalidArgumentError("fromSeconds requires a numerical input");
    } else {
      return new DateTime({
        ts: seconds * 1000,
        zone: normalizeZone(options.zone, Settings.defaultZone),
        loc: Locale.fromObject(options)
      });
    }
  }
  /**
   * Create a DateTime from a Javascript object with keys like 'year' and 'hour' with reasonable defaults.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.year - a year, such as 1987
   * @param {number} obj.month - a month, 1-12
   * @param {number} obj.day - a day of the month, 1-31, depending on the month
   * @param {number} obj.ordinal - day of the year, 1-365 or 366
   * @param {number} obj.weekYear - an ISO week year
   * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
   * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
   * @param {number} obj.hour - hour of the day, 0-23
   * @param {number} obj.minute - minute of the hour, 0-59
   * @param {number} obj.second - second of the minute, 0-59
   * @param {number} obj.millisecond - millisecond of the second, 0-999
   * @param {string|Zone} [obj.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
   * @param {string} [obj.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} obj.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} obj.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
   * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6, zone: 'utc' }),
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6, zone: 'local' })
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6, zone: 'America/New_York' })
   * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
   * @return {DateTime}
   */
  ;

  DateTime.fromObject = function fromObject(obj) {
    var zoneToUse = normalizeZone(obj.zone, Settings.defaultZone);

    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone(zoneToUse));
    }

    var tsNow = Settings.now(),
        offsetProvis = zoneToUse.offset(tsNow),
        normalized = normalizeObject(obj, normalizeUnit, ["zone", "locale", "outputCalendar", "numberingSystem"]),
        containsOrdinal = !isUndefined(normalized.ordinal),
        containsGregorYear = !isUndefined(normalized.year),
        containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day),
        containsGregor = containsGregorYear || containsGregorMD,
        definiteWeekDef = normalized.weekYear || normalized.weekNumber,
        loc = Locale.fromObject(obj); // cases:
    // just a weekday -> this week's instance of that weekday, no worries
    // (gregorian data or ordinal) + (weekYear or weekNumber) -> error
    // (gregorian month or day) + ordinal -> error
    // otherwise just use weeks or ordinals or gregorian, depending on what's specified

    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
    }

    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
    }

    var useWeekData = definiteWeekDef || normalized.weekday && !containsGregor; // configure ourselves to deal with gregorian dates or week stuff

    var units,
        defaultValues,
        objNow = tsToObj(tsNow, offsetProvis);

    if (useWeekData) {
      units = orderedWeekUnits;
      defaultValues = defaultWeekUnitValues;
      objNow = gregorianToWeek(objNow);
    } else if (containsOrdinal) {
      units = orderedOrdinalUnits;
      defaultValues = defaultOrdinalUnitValues;
      objNow = gregorianToOrdinal(objNow);
    } else {
      units = orderedUnits$1;
      defaultValues = defaultUnitValues;
    } // set default values for missing stuff


    var foundFirst = false;

    for (var _iterator3 = _createForOfIteratorHelperLoose(units), _step3; !(_step3 = _iterator3()).done;) {
      var u = _step3.value;
      var v = normalized[u];

      if (!isUndefined(v)) {
        foundFirst = true;
      } else if (foundFirst) {
        normalized[u] = defaultValues[u];
      } else {
        normalized[u] = objNow[u];
      }
    } // make sure the values we have are in range


    var higherOrderInvalid = useWeekData ? hasInvalidWeekData(normalized) : containsOrdinal ? hasInvalidOrdinalData(normalized) : hasInvalidGregorianData(normalized),
        invalid = higherOrderInvalid || hasInvalidTimeData(normalized);

    if (invalid) {
      return DateTime.invalid(invalid);
    } // compute the actual time


    var gregorian = useWeekData ? weekToGregorian(normalized) : containsOrdinal ? ordinalToGregorian(normalized) : normalized,
        _objToTS2 = objToTS(gregorian, offsetProvis, zoneToUse),
        tsFinal = _objToTS2[0],
        offsetFinal = _objToTS2[1],
        inst = new DateTime({
      ts: tsFinal,
      zone: zoneToUse,
      o: offsetFinal,
      loc: loc
    }); // gregorian data + weekday serves only to validate


    if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
      return DateTime.invalid("mismatched weekday", "you can't specify both a weekday of " + normalized.weekday + " and a date of " + inst.toISO());
    }

    return inst;
  }
  /**
   * Create a DateTime from an ISO 8601 string
   * @param {string} text - the ISO string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromISO('2016-05-25T09:08:34.123')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
   * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
   * @example DateTime.fromISO('2016-W05-4')
   * @return {DateTime}
   */
  ;

  DateTime.fromISO = function fromISO(text, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var _parseISODate = parseISODate(text),
        vals = _parseISODate[0],
        parsedZone = _parseISODate[1];

    return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
  }
  /**
   * Create a DateTime from an RFC 2822 string
   * @param {string} text - the RFC 2822 string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
   * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
   * @return {DateTime}
   */
  ;

  DateTime.fromRFC2822 = function fromRFC2822(text, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var _parseRFC2822Date = parseRFC2822Date(text),
        vals = _parseRFC2822Date[0],
        parsedZone = _parseRFC2822Date[1];

    return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
  }
  /**
   * Create a DateTime from an HTTP header date
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @param {string} text - the HTTP header date
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
   * @return {DateTime}
   */
  ;

  DateTime.fromHTTP = function fromHTTP(text, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var _parseHTTPDate = parseHTTPDate(text),
        vals = _parseHTTPDate[0],
        parsedZone = _parseHTTPDate[1];

    return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
  }
  /**
   * Create a DateTime from an input string and format string.
   * Defaults to en-US if no locale has been specified, regardless of the system's locale.
   * @see https://moment.github.io/luxon/docs/manual/parsing.html#table-of-tokens
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @return {DateTime}
   */
  ;

  DateTime.fromFormat = function fromFormat(text, fmt, opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (isUndefined(text) || isUndefined(fmt)) {
      throw new InvalidArgumentError("fromFormat requires an input string and a format");
    }

    var _opts = opts,
        _opts$locale = _opts.locale,
        locale = _opts$locale === void 0 ? null : _opts$locale,
        _opts$numberingSystem = _opts.numberingSystem,
        numberingSystem = _opts$numberingSystem === void 0 ? null : _opts$numberingSystem,
        localeToUse = Locale.fromOpts({
      locale: locale,
      numberingSystem: numberingSystem,
      defaultToEN: true
    }),
        _parseFromTokens = parseFromTokens(localeToUse, text, fmt),
        vals = _parseFromTokens[0],
        parsedZone = _parseFromTokens[1],
        invalid = _parseFromTokens[2];

    if (invalid) {
      return DateTime.invalid(invalid);
    } else {
      return parseDataToDateTime(vals, parsedZone, opts, "format " + fmt, text);
    }
  }
  /**
   * @deprecated use fromFormat instead
   */
  ;

  DateTime.fromString = function fromString(text, fmt, opts) {
    if (opts === void 0) {
      opts = {};
    }

    return DateTime.fromFormat(text, fmt, opts);
  }
  /**
   * Create a DateTime from a SQL date, time, or datetime
   * Defaults to en-US if no locale has been specified, regardless of the system's locale
   * @param {string} text - the string to parse
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @example DateTime.fromSQL('2017-05-15')
   * @example DateTime.fromSQL('2017-05-15 09:12:34')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
   * @example DateTime.fromSQL('09:12:34.342')
   * @return {DateTime}
   */
  ;

  DateTime.fromSQL = function fromSQL(text, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var _parseSQL = parseSQL(text),
        vals = _parseSQL[0],
        parsedZone = _parseSQL[1];

    return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  ;

  DateTime.invalid = function invalid(reason, explanation) {
    if (explanation === void 0) {
      explanation = null;
    }

    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
    }

    var invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

    if (Settings.throwOnInvalid) {
      throw new InvalidDateTimeError(invalid);
    } else {
      return new DateTime({
        invalid: invalid
      });
    }
  }
  /**
   * Check if an object is a DateTime. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  ;

  DateTime.isDateTime = function isDateTime(o) {
    return o && o.isLuxonDateTime || false;
  } // INFO

  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
   * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
   * @return {number}
   */
  ;

  var _proto = DateTime.prototype;

  _proto.get = function get(unit) {
    return this[unit];
  }
  /**
   * Returns whether the DateTime is valid. Invalid DateTimes occur when:
   * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
   * * The DateTime was created by an operation on another invalid date
   * @type {boolean}
   */
  ;

  /**
   * Returns the resolved Intl options for this DateTime.
   * This is useful in understanding the behavior of formatting methods
   * @param {Object} opts - the same options as toLocaleString
   * @return {Object}
   */
  _proto.resolvedLocaleOpts = function resolvedLocaleOpts(opts) {
    if (opts === void 0) {
      opts = {};
    }

    var _Formatter$create$res = Formatter.create(this.loc.clone(opts), opts).resolvedOptions(this),
        locale = _Formatter$create$res.locale,
        numberingSystem = _Formatter$create$res.numberingSystem,
        calendar = _Formatter$create$res.calendar;

    return {
      locale: locale,
      numberingSystem: numberingSystem,
      outputCalendar: calendar
    };
  } // TRANSFORM

  /**
   * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
   *
   * Equivalent to {@link setZone}('utc')
   * @param {number} [offset=0] - optionally, an offset from UTC in minutes
   * @param {Object} [opts={}] - options to pass to `setZone()`
   * @return {DateTime}
   */
  ;

  _proto.toUTC = function toUTC(offset, opts) {
    if (offset === void 0) {
      offset = 0;
    }

    if (opts === void 0) {
      opts = {};
    }

    return this.setZone(FixedOffsetZone.instance(offset), opts);
  }
  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */
  ;

  _proto.toLocal = function toLocal() {
    return this.setZone(Settings.defaultZone);
  }
  /**
   * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
   *
   * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link plus}. You may wish to use {@link toLocal} and {@link toUTC} which provide simple convenience wrappers for commonly used zones.
   * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link Zone} class.
   * @param {Object} opts - options
   * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
   * @return {DateTime}
   */
  ;

  _proto.setZone = function setZone(zone, _temp) {
    var _ref3 = _temp === void 0 ? {} : _temp,
        _ref3$keepLocalTime = _ref3.keepLocalTime,
        keepLocalTime = _ref3$keepLocalTime === void 0 ? false : _ref3$keepLocalTime,
        _ref3$keepCalendarTim = _ref3.keepCalendarTime,
        keepCalendarTime = _ref3$keepCalendarTim === void 0 ? false : _ref3$keepCalendarTim;

    zone = normalizeZone(zone, Settings.defaultZone);

    if (zone.equals(this.zone)) {
      return this;
    } else if (!zone.isValid) {
      return DateTime.invalid(unsupportedZone(zone));
    } else {
      var newTS = this.ts;

      if (keepLocalTime || keepCalendarTime) {
        var offsetGuess = zone.offset(this.ts);
        var asObj = this.toObject();

        var _objToTS3 = objToTS(asObj, offsetGuess, zone);

        newTS = _objToTS3[0];
      }

      return clone$1(this, {
        ts: newTS,
        zone: zone
      });
    }
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  ;

  _proto.reconfigure = function reconfigure(_temp2) {
    var _ref4 = _temp2 === void 0 ? {} : _temp2,
        locale = _ref4.locale,
        numberingSystem = _ref4.numberingSystem,
        outputCalendar = _ref4.outputCalendar;

    var loc = this.loc.clone({
      locale: locale,
      numberingSystem: numberingSystem,
      outputCalendar: outputCalendar
    });
    return clone$1(this, {
      loc: loc
    });
  }
  /**
   * "Set" the locale. Returns a newly-constructed DateTime.
   * Just a convenient alias for reconfigure({ locale })
   * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
   * @return {DateTime}
   */
  ;

  _proto.setLocale = function setLocale(locale) {
    return this.reconfigure({
      locale: locale
    });
  }
  /**
   * "Set" the values of specified units. Returns a newly-constructed DateTime.
   * You can only set units with this method; for "setting" metadata, see {@link reconfigure} and {@link setZone}.
   * @param {Object} values - a mapping of units to numbers
   * @example dt.set({ year: 2017 })
   * @example dt.set({ hour: 8, minute: 30 })
   * @example dt.set({ weekday: 5 })
   * @example dt.set({ year: 2005, ordinal: 234 })
   * @return {DateTime}
   */
  ;

  _proto.set = function set(values) {
    if (!this.isValid) return this;
    var normalized = normalizeObject(values, normalizeUnit, []),
        settingWeekStuff = !isUndefined(normalized.weekYear) || !isUndefined(normalized.weekNumber) || !isUndefined(normalized.weekday);
    var mixed;

    if (settingWeekStuff) {
      mixed = weekToGregorian(Object.assign(gregorianToWeek(this.c), normalized));
    } else if (!isUndefined(normalized.ordinal)) {
      mixed = ordinalToGregorian(Object.assign(gregorianToOrdinal(this.c), normalized));
    } else {
      mixed = Object.assign(this.toObject(), normalized); // if we didn't set the day but we ended up on an overflow date,
      // use the last day of the right month

      if (isUndefined(normalized.day)) {
        mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
      }
    }

    var _objToTS4 = objToTS(mixed, this.o, this.zone),
        ts = _objToTS4[0],
        o = _objToTS4[1];

    return clone$1(this, {
      ts: ts,
      o: o
    });
  }
  /**
   * Add a period of time to this DateTime and return the resulting DateTime
   *
   * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @example DateTime.local().plus(123) //~> in 123 milliseconds
   * @example DateTime.local().plus({ minutes: 15 }) //~> in 15 minutes
   * @example DateTime.local().plus({ days: 1 }) //~> this time tomorrow
   * @example DateTime.local().plus({ days: -1 }) //~> this time yesterday
   * @example DateTime.local().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
   * @example DateTime.local().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
   * @return {DateTime}
   */
  ;

  _proto.plus = function plus(duration) {
    if (!this.isValid) return this;
    var dur = friendlyDuration(duration);
    return clone$1(this, adjustTime(this, dur));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
  */
  ;

  _proto.minus = function minus(duration) {
    if (!this.isValid) return this;
    var dur = friendlyDuration(duration).negate();
    return clone$1(this, adjustTime(this, dur));
  }
  /**
   * "Set" this DateTime to the beginning of a unit of time.
   * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
   * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
   * @return {DateTime}
   */
  ;

  _proto.startOf = function startOf(unit) {
    if (!this.isValid) return this;
    var o = {},
        normalizedUnit = Duration.normalizeUnit(unit);

    switch (normalizedUnit) {
      case "years":
        o.month = 1;
      // falls through

      case "quarters":
      case "months":
        o.day = 1;
      // falls through

      case "weeks":
      case "days":
        o.hour = 0;
      // falls through

      case "hours":
        o.minute = 0;
      // falls through

      case "minutes":
        o.second = 0;
      // falls through

      case "seconds":
        o.millisecond = 0;
        break;
      // no default, invalid units throw in normalizeUnit()
    }

    if (normalizedUnit === "weeks") {
      o.weekday = 1;
    }

    if (normalizedUnit === "quarters") {
      var q = Math.ceil(this.month / 3);
      o.month = (q - 1) * 3 + 1;
    }

    return this.set(o);
  }
  /**
   * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
   * @param {string} unit - The unit to go to the end of. Can be 'year', 'month', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
   * @return {DateTime}
   */
  ;

  _proto.endOf = function endOf(unit) {
    var _this$plus;

    return this.isValid ? this.plus((_this$plus = {}, _this$plus[unit] = 1, _this$plus)).startOf(unit).minus(1) : this;
  } // OUTPUT

  /**
   * Returns a string representation of this DateTime formatted according to the specified format string.
   * **You may not want this.** See {@link toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens).
   * Defaults to en-US if no locale has been specified, regardless of the system's locale.
   * @see https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
   * @param {string} fmt - the format string
   * @param {Object} opts - opts to override the configuration options
   * @example DateTime.local().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
   * @example DateTime.local().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
   * @example DateTime.local().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
   * @example DateTime.local().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
   * @return {string}
   */
  ;

  _proto.toFormat = function toFormat(fmt, opts) {
    if (opts === void 0) {
      opts = {};
    }

    return this.isValid ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt) : INVALID$2;
  }
  /**
   * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
   * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
   * of the DateTime in the assigned locale.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param opts {Object} - Intl.DateTimeFormat constructor options and configuration options
   * @example DateTime.local().toLocaleString(); //=> 4/20/2017
   * @example DateTime.local().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
   * @example DateTime.local().toLocaleString({ locale: 'en-gb' }); //=> '20/04/2017'
   * @example DateTime.local().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
   * @example DateTime.local().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
   * @example DateTime.local().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
   * @example DateTime.local().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
   * @example DateTime.local().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
   * @example DateTime.local().toLocaleString({ hour: '2-digit', minute: '2-digit', hour12: false }); //=> '11:32'
   * @return {string}
   */
  ;

  _proto.toLocaleString = function toLocaleString(opts) {
    if (opts === void 0) {
      opts = DATE_SHORT;
    }

    return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTime(this) : INVALID$2;
  }
  /**
   * Returns an array of format "parts", meaning individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
   * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
   * @example DateTime.local().toLocaleParts(); //=> [
   *                                   //=>   { type: 'day', value: '25' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'month', value: '05' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'year', value: '1982' }
   *                                   //=> ]
   */
  ;

  _proto.toLocaleParts = function toLocaleParts(opts) {
    if (opts === void 0) {
      opts = {};
    }

    return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1982, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
   * @example DateTime.local().toISO() //=> '2017-04-22T20:47:05.335-04:00'
   * @example DateTime.local().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
   * @example DateTime.local().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
   * @return {string}
   */
  ;

  _proto.toISO = function toISO(opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (!this.isValid) {
      return null;
    }

    return this.toISODate(opts) + "T" + this.toISOTime(opts);
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's date component
   * @param {Object} opts - options
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
   * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
   * @return {string}
   */
  ;

  _proto.toISODate = function toISODate(_temp3) {
    var _ref5 = _temp3 === void 0 ? {} : _temp3,
        _ref5$format = _ref5.format,
        format = _ref5$format === void 0 ? "extended" : _ref5$format;

    var fmt = format === "basic" ? "yyyyMMdd" : "yyyy-MM-dd";

    if (this.year > 9999) {
      fmt = "+" + fmt;
    }

    return toTechFormat(this, fmt);
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  ;

  _proto.toISOWeekDate = function toISOWeekDate() {
    return toTechFormat(this, "kkkk-'W'WW-c");
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's time component
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
   * @return {string}
   */
  ;

  _proto.toISOTime = function toISOTime(_temp4) {
    var _ref6 = _temp4 === void 0 ? {} : _temp4,
        _ref6$suppressMillise = _ref6.suppressMilliseconds,
        suppressMilliseconds = _ref6$suppressMillise === void 0 ? false : _ref6$suppressMillise,
        _ref6$suppressSeconds = _ref6.suppressSeconds,
        suppressSeconds = _ref6$suppressSeconds === void 0 ? false : _ref6$suppressSeconds,
        _ref6$includeOffset = _ref6.includeOffset,
        includeOffset = _ref6$includeOffset === void 0 ? true : _ref6$includeOffset,
        _ref6$format = _ref6.format,
        format = _ref6$format === void 0 ? "extended" : _ref6$format;

    return toTechTimeFormat(this, {
      suppressSeconds: suppressSeconds,
      suppressMilliseconds: suppressMilliseconds,
      includeOffset: includeOffset,
      format: format
    });
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime, always in UTC
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  ;

  _proto.toRFC2822 = function toRFC2822() {
    return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in HTTP headers.
   * Specifically, the string conforms to RFC 1123.
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
   * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
   * @return {string}
   */
  ;

  _proto.toHTTP = function toHTTP() {
    return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string}
   */
  ;

  _proto.toSQLDate = function toSQLDate() {
    return toTechFormat(this, "yyyy-MM-dd");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Time
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @example DateTime.utc().toSQL() //=> '05:15:16.345'
   * @example DateTime.local().toSQL() //=> '05:15:16.345 -04:00'
   * @example DateTime.local().toSQL({ includeOffset: false }) //=> '05:15:16.345'
   * @example DateTime.local().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
   * @return {string}
   */
  ;

  _proto.toSQLTime = function toSQLTime(_temp5) {
    var _ref7 = _temp5 === void 0 ? {} : _temp5,
        _ref7$includeOffset = _ref7.includeOffset,
        includeOffset = _ref7$includeOffset === void 0 ? true : _ref7$includeOffset,
        _ref7$includeZone = _ref7.includeZone,
        includeZone = _ref7$includeZone === void 0 ? false : _ref7$includeZone;

    return toTechTimeFormat(this, {
      includeOffset: includeOffset,
      includeZone: includeZone,
      spaceZone: true
    });
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
   * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
   * @return {string}
   */
  ;

  _proto.toSQL = function toSQL(opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (!this.isValid) {
      return null;
    }

    return this.toSQLDate() + " " + this.toSQLTime(opts);
  }
  /**
   * Returns a string representation of this DateTime appropriate for debugging
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    return this.isValid ? this.toISO() : INVALID$2;
  }
  /**
   * Returns the epoch milliseconds of this DateTime. Alias of {@link toMillis}
   * @return {number}
   */
  ;

  _proto.valueOf = function valueOf() {
    return this.toMillis();
  }
  /**
   * Returns the epoch milliseconds of this DateTime.
   * @return {number}
   */
  ;

  _proto.toMillis = function toMillis() {
    return this.isValid ? this.ts : NaN;
  }
  /**
   * Returns the epoch seconds of this DateTime.
   * @return {number}
   */
  ;

  _proto.toSeconds = function toSeconds() {
    return this.isValid ? this.ts / 1000 : NaN;
  }
  /**
   * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
   * @return {string}
   */
  ;

  _proto.toJSON = function toJSON() {
    return this.toISO();
  }
  /**
   * Returns a BSON serializable equivalent to this DateTime.
   * @return {Date}
   */
  ;

  _proto.toBSON = function toBSON() {
    return this.toJSDate();
  }
  /**
   * Returns a Javascript object with this DateTime's year, month, day, and so on.
   * @param opts - options for generating the object
   * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
   * @example DateTime.local().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
   * @return {Object}
   */
  ;

  _proto.toObject = function toObject(opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (!this.isValid) return {};
    var base = Object.assign({}, this.c);

    if (opts.includeConfig) {
      base.outputCalendar = this.outputCalendar;
      base.numberingSystem = this.loc.numberingSystem;
      base.locale = this.loc.locale;
    }

    return base;
  }
  /**
   * Returns a Javascript Date equivalent to this DateTime.
   * @return {Date}
   */
  ;

  _proto.toJSDate = function toJSDate() {
    return new Date(this.isValid ? this.ts : NaN);
  } // COMPARE

  /**
   * Return the difference between two DateTimes as a Duration.
   * @param {DateTime} otherDateTime - the DateTime to compare this one to
   * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example
   * var i1 = DateTime.fromISO('1982-05-25T09:45'),
   *     i2 = DateTime.fromISO('1983-10-14T10:30');
   * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
   * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
   * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
   * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
   * @return {Duration}
   */
  ;

  _proto.diff = function diff(otherDateTime, unit, opts) {
    if (unit === void 0) {
      unit = "milliseconds";
    }

    if (opts === void 0) {
      opts = {};
    }

    if (!this.isValid || !otherDateTime.isValid) {
      return Duration.invalid(this.invalid || otherDateTime.invalid, "created by diffing an invalid DateTime");
    }

    var durOpts = Object.assign({
      locale: this.locale,
      numberingSystem: this.numberingSystem
    }, opts);

    var units = maybeArray(unit).map(Duration.normalizeUnit),
        otherIsLater = otherDateTime.valueOf() > this.valueOf(),
        earlier = otherIsLater ? this : otherDateTime,
        later = otherIsLater ? otherDateTime : this,
        diffed = _diff(earlier, later, units, durOpts);

    return otherIsLater ? diffed.negate() : diffed;
  }
  /**
   * Return the difference between this DateTime and right now.
   * See {@link diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  ;

  _proto.diffNow = function diffNow(unit, opts) {
    if (unit === void 0) {
      unit = "milliseconds";
    }

    if (opts === void 0) {
      opts = {};
    }

    return this.diff(DateTime.local(), unit, opts);
  }
  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval}
   */
  ;

  _proto.until = function until(otherDateTime) {
    return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
  }
  /**
   * Return whether this DateTime is in the same unit of time as another DateTime
   * @param {DateTime} otherDateTime - the other DateTime
   * @param {string} unit - the unit of time to check sameness on
   * @example DateTime.local().hasSame(otherDT, 'day'); //~> true if both the same calendar day
   * @return {boolean}
   */
  ;

  _proto.hasSame = function hasSame(otherDateTime, unit) {
    if (!this.isValid) return false;

    if (unit === "millisecond") {
      return this.valueOf() === otherDateTime.valueOf();
    } else {
      var inputMs = otherDateTime.valueOf();
      return this.startOf(unit) <= inputMs && inputMs <= this.endOf(unit);
    }
  }
  /**
   * Equality check
   * Two DateTimes are equal iff they represent the same millisecond, have the same zone and location, and are both valid.
   * To compare just the millisecond values, use `+dt1 === +dt2`.
   * @param {DateTime} other - the other DateTime
   * @return {boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
  }
  /**
   * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
   * platform supports Intl.RelativeTimeFormat. Rounds down by default.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.local()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
   * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
   * @param {boolean} [options.round=true] - whether to round the numbers in the output.
   * @param {boolean} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.local().plus({ days: 1 }).toRelative() //=> "in 1 day"
   * @example DateTime.local().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
   * @example DateTime.local().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
   * @example DateTime.local().minus({ days: 2 }).toRelative() //=> "2 days ago"
   * @example DateTime.local().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
   * @example DateTime.local().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
   */
  ;

  _proto.toRelative = function toRelative(options) {
    if (options === void 0) {
      options = {};
    }

    if (!this.isValid) return null;
    var base = options.base || DateTime.fromObject({
      zone: this.zone
    }),
        padding = options.padding ? this < base ? -options.padding : options.padding : 0;
    return diffRelative(base, this.plus(padding), Object.assign(options, {
      numeric: "always",
      units: ["years", "months", "days", "hours", "minutes", "seconds"]
    }));
  }
  /**
   * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
   * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.local()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.local().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
   * @example DateTime.local().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
   * @example DateTime.local().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
   * @example DateTime.local().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
   */
  ;

  _proto.toRelativeCalendar = function toRelativeCalendar(options) {
    if (options === void 0) {
      options = {};
    }

    if (!this.isValid) return null;
    return diffRelative(options.base || DateTime.fromObject({
      zone: this.zone
    }), this, Object.assign(options, {
      numeric: "auto",
      units: ["years", "months", "days"],
      calendary: true
    }));
  }
  /**
   * Return the min of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
   * @return {DateTime} the min DateTime, or undefined if called with no argument
   */
  ;

  DateTime.min = function min() {
    for (var _len = arguments.length, dateTimes = new Array(_len), _key = 0; _key < _len; _key++) {
      dateTimes[_key] = arguments[_key];
    }

    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError("min requires all arguments be DateTimes");
    }

    return bestBy(dateTimes, function (i) {
      return i.valueOf();
    }, Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  ;

  DateTime.max = function max() {
    for (var _len2 = arguments.length, dateTimes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      dateTimes[_key2] = arguments[_key2];
    }

    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError("max requires all arguments be DateTimes");
    }

    return bestBy(dateTimes, function (i) {
      return i.valueOf();
    }, Math.max);
  } // MISC

  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  ;

  DateTime.fromFormatExplain = function fromFormatExplain(text, fmt, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$locale = _options.locale,
        locale = _options$locale === void 0 ? null : _options$locale,
        _options$numberingSys = _options.numberingSystem,
        numberingSystem = _options$numberingSys === void 0 ? null : _options$numberingSys,
        localeToUse = Locale.fromOpts({
      locale: locale,
      numberingSystem: numberingSystem,
      defaultToEN: true
    });
    return explainFromTokens(localeToUse, text, fmt);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  ;

  DateTime.fromStringExplain = function fromStringExplain(text, fmt, options) {
    if (options === void 0) {
      options = {};
    }

    return DateTime.fromFormatExplain(text, fmt, options);
  } // FORMAT PRESETS

  /**
   * {@link toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  ;

  _createClass(DateTime, [{
    key: "isValid",
    get: function get() {
      return this.invalid === null;
    }
    /**
     * Returns an error code if this DateTime is invalid, or null if the DateTime is valid
     * @type {string}
     */

  }, {
    key: "invalidReason",
    get: function get() {
      return this.invalid ? this.invalid.reason : null;
    }
    /**
     * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
     * @type {string}
     */

  }, {
    key: "invalidExplanation",
    get: function get() {
      return this.invalid ? this.invalid.explanation : null;
    }
    /**
     * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
     *
     * @type {string}
     */

  }, {
    key: "locale",
    get: function get() {
      return this.isValid ? this.loc.locale : null;
    }
    /**
     * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
     *
     * @type {string}
     */

  }, {
    key: "numberingSystem",
    get: function get() {
      return this.isValid ? this.loc.numberingSystem : null;
    }
    /**
     * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
     *
     * @type {string}
     */

  }, {
    key: "outputCalendar",
    get: function get() {
      return this.isValid ? this.loc.outputCalendar : null;
    }
    /**
     * Get the time zone associated with this DateTime.
     * @type {Zone}
     */

  }, {
    key: "zone",
    get: function get() {
      return this._zone;
    }
    /**
     * Get the name of the time zone.
     * @type {string}
     */

  }, {
    key: "zoneName",
    get: function get() {
      return this.isValid ? this.zone.name : null;
    }
    /**
     * Get the year
     * @example DateTime.local(2017, 5, 25).year //=> 2017
     * @type {number}
     */

  }, {
    key: "year",
    get: function get() {
      return this.isValid ? this.c.year : NaN;
    }
    /**
     * Get the quarter
     * @example DateTime.local(2017, 5, 25).quarter //=> 2
     * @type {number}
     */

  }, {
    key: "quarter",
    get: function get() {
      return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
    }
    /**
     * Get the month (1-12).
     * @example DateTime.local(2017, 5, 25).month //=> 5
     * @type {number}
     */

  }, {
    key: "month",
    get: function get() {
      return this.isValid ? this.c.month : NaN;
    }
    /**
     * Get the day of the month (1-30ish).
     * @example DateTime.local(2017, 5, 25).day //=> 25
     * @type {number}
     */

  }, {
    key: "day",
    get: function get() {
      return this.isValid ? this.c.day : NaN;
    }
    /**
     * Get the hour of the day (0-23).
     * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
     * @type {number}
     */

  }, {
    key: "hour",
    get: function get() {
      return this.isValid ? this.c.hour : NaN;
    }
    /**
     * Get the minute of the hour (0-59).
     * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
     * @type {number}
     */

  }, {
    key: "minute",
    get: function get() {
      return this.isValid ? this.c.minute : NaN;
    }
    /**
     * Get the second of the minute (0-59).
     * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
     * @type {number}
     */

  }, {
    key: "second",
    get: function get() {
      return this.isValid ? this.c.second : NaN;
    }
    /**
     * Get the millisecond of the second (0-999).
     * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
     * @type {number}
     */

  }, {
    key: "millisecond",
    get: function get() {
      return this.isValid ? this.c.millisecond : NaN;
    }
    /**
     * Get the week year
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2014, 11, 31).weekYear //=> 2015
     * @type {number}
     */

  }, {
    key: "weekYear",
    get: function get() {
      return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
    }
    /**
     * Get the week number of the week year (1-52ish).
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
     * @type {number}
     */

  }, {
    key: "weekNumber",
    get: function get() {
      return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
    }
    /**
     * Get the day of the week.
     * 1 is Monday and 7 is Sunday
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2014, 11, 31).weekday //=> 4
     * @type {number}
     */

  }, {
    key: "weekday",
    get: function get() {
      return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
    }
    /**
     * Get the ordinal (meaning the day of the year)
     * @example DateTime.local(2017, 5, 25).ordinal //=> 145
     * @type {number|DateTime}
     */

  }, {
    key: "ordinal",
    get: function get() {
      return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
    }
    /**
     * Get the human readable short month name, such as 'Oct'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
     * @type {string}
     */

  }, {
    key: "monthShort",
    get: function get() {
      return this.isValid ? Info.months("short", {
        locale: this.locale
      })[this.month - 1] : null;
    }
    /**
     * Get the human readable long month name, such as 'October'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).monthLong //=> October
     * @type {string}
     */

  }, {
    key: "monthLong",
    get: function get() {
      return this.isValid ? Info.months("long", {
        locale: this.locale
      })[this.month - 1] : null;
    }
    /**
     * Get the human readable short weekday, such as 'Mon'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
     * @type {string}
     */

  }, {
    key: "weekdayShort",
    get: function get() {
      return this.isValid ? Info.weekdays("short", {
        locale: this.locale
      })[this.weekday - 1] : null;
    }
    /**
     * Get the human readable long weekday, such as 'Monday'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
     * @type {string}
     */

  }, {
    key: "weekdayLong",
    get: function get() {
      return this.isValid ? Info.weekdays("long", {
        locale: this.locale
      })[this.weekday - 1] : null;
    }
    /**
     * Get the UTC offset of this DateTime in minutes
     * @example DateTime.local().offset //=> -240
     * @example DateTime.utc().offset //=> 0
     * @type {number}
     */

  }, {
    key: "offset",
    get: function get() {
      return this.isValid ? +this.o : NaN;
    }
    /**
     * Get the short human name for the zone's current offset, for example "EST" or "EDT".
     * Defaults to the system's locale if no locale has been specified
     * @type {string}
     */

  }, {
    key: "offsetNameShort",
    get: function get() {
      if (this.isValid) {
        return this.zone.offsetName(this.ts, {
          format: "short",
          locale: this.locale
        });
      } else {
        return null;
      }
    }
    /**
     * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
     * Defaults to the system's locale if no locale has been specified
     * @type {string}
     */

  }, {
    key: "offsetNameLong",
    get: function get() {
      if (this.isValid) {
        return this.zone.offsetName(this.ts, {
          format: "long",
          locale: this.locale
        });
      } else {
        return null;
      }
    }
    /**
     * Get whether this zone's offset ever changes, as in a DST.
     * @type {boolean}
     */

  }, {
    key: "isOffsetFixed",
    get: function get() {
      return this.isValid ? this.zone.universal : null;
    }
    /**
     * Get whether the DateTime is in a DST.
     * @type {boolean}
     */

  }, {
    key: "isInDST",
    get: function get() {
      if (this.isOffsetFixed) {
        return false;
      } else {
        return this.offset > this.set({
          month: 1
        }).offset || this.offset > this.set({
          month: 5
        }).offset;
      }
    }
    /**
     * Returns true if this DateTime is in a leap year, false otherwise
     * @example DateTime.local(2016).isInLeapYear //=> true
     * @example DateTime.local(2013).isInLeapYear //=> false
     * @type {boolean}
     */

  }, {
    key: "isInLeapYear",
    get: function get() {
      return isLeapYear(this.year);
    }
    /**
     * Returns the number of days in this DateTime's month
     * @example DateTime.local(2016, 2).daysInMonth //=> 29
     * @example DateTime.local(2016, 3).daysInMonth //=> 31
     * @type {number}
     */

  }, {
    key: "daysInMonth",
    get: function get() {
      return daysInMonth(this.year, this.month);
    }
    /**
     * Returns the number of days in this DateTime's year
     * @example DateTime.local(2016).daysInYear //=> 366
     * @example DateTime.local(2013).daysInYear //=> 365
     * @type {number}
     */

  }, {
    key: "daysInYear",
    get: function get() {
      return this.isValid ? daysInYear(this.year) : NaN;
    }
    /**
     * Returns the number of weeks in this DateTime's year
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2004).weeksInWeekYear //=> 53
     * @example DateTime.local(2013).weeksInWeekYear //=> 52
     * @type {number}
     */

  }, {
    key: "weeksInWeekYear",
    get: function get() {
      return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
    }
  }], [{
    key: "DATE_SHORT",
    get: function get() {
      return DATE_SHORT;
    }
    /**
     * {@link toLocaleString} format like 'Oct 14, 1983'
     * @type {Object}
     */

  }, {
    key: "DATE_MED",
    get: function get() {
      return DATE_MED;
    }
    /**
     * {@link toLocaleString} format like 'October 14, 1983'
     * @type {Object}
     */

  }, {
    key: "DATE_FULL",
    get: function get() {
      return DATE_FULL;
    }
    /**
     * {@link toLocaleString} format like 'Tuesday, October 14, 1983'
     * @type {Object}
     */

  }, {
    key: "DATE_HUGE",
    get: function get() {
      return DATE_HUGE;
    }
    /**
     * {@link toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "TIME_SIMPLE",
    get: function get() {
      return TIME_SIMPLE;
    }
    /**
     * {@link toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "TIME_WITH_SECONDS",
    get: function get() {
      return TIME_WITH_SECONDS;
    }
    /**
     * {@link toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "TIME_WITH_SHORT_OFFSET",
    get: function get() {
      return TIME_WITH_SHORT_OFFSET;
    }
    /**
     * {@link toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "TIME_WITH_LONG_OFFSET",
    get: function get() {
      return TIME_WITH_LONG_OFFSET;
    }
    /**
     * {@link toLocaleString} format like '09:30', always 24-hour.
     * @type {Object}
     */

  }, {
    key: "TIME_24_SIMPLE",
    get: function get() {
      return TIME_24_SIMPLE;
    }
    /**
     * {@link toLocaleString} format like '09:30:23', always 24-hour.
     * @type {Object}
     */

  }, {
    key: "TIME_24_WITH_SECONDS",
    get: function get() {
      return TIME_24_WITH_SECONDS;
    }
    /**
     * {@link toLocaleString} format like '09:30:23 EDT', always 24-hour.
     * @type {Object}
     */

  }, {
    key: "TIME_24_WITH_SHORT_OFFSET",
    get: function get() {
      return TIME_24_WITH_SHORT_OFFSET;
    }
    /**
     * {@link toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
     * @type {Object}
     */

  }, {
    key: "TIME_24_WITH_LONG_OFFSET",
    get: function get() {
      return TIME_24_WITH_LONG_OFFSET;
    }
    /**
     * {@link toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_SHORT",
    get: function get() {
      return DATETIME_SHORT;
    }
    /**
     * {@link toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_SHORT_WITH_SECONDS",
    get: function get() {
      return DATETIME_SHORT_WITH_SECONDS;
    }
    /**
     * {@link toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_MED",
    get: function get() {
      return DATETIME_MED;
    }
    /**
     * {@link toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_MED_WITH_SECONDS",
    get: function get() {
      return DATETIME_MED_WITH_SECONDS;
    }
    /**
     * {@link toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_MED_WITH_WEEKDAY",
    get: function get() {
      return DATETIME_MED_WITH_WEEKDAY;
    }
    /**
     * {@link toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_FULL",
    get: function get() {
      return DATETIME_FULL;
    }
    /**
     * {@link toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_FULL_WITH_SECONDS",
    get: function get() {
      return DATETIME_FULL_WITH_SECONDS;
    }
    /**
     * {@link toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_HUGE",
    get: function get() {
      return DATETIME_HUGE;
    }
    /**
     * {@link toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
     * @type {Object}
     */

  }, {
    key: "DATETIME_HUGE_WITH_SECONDS",
    get: function get() {
      return DATETIME_HUGE_WITH_SECONDS;
    }
  }]);

  return DateTime;
}();
function friendlyDateTime(dateTimeish) {
  if (DateTime.isDateTime(dateTimeish)) {
    return dateTimeish;
  } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
    return DateTime.fromJSDate(dateTimeish);
  } else if (dateTimeish && typeof dateTimeish === "object") {
    return DateTime.fromObject(dateTimeish);
  } else {
    throw new InvalidArgumentError("Unknown datetime argument: " + dateTimeish + ", of type " + typeof dateTimeish);
  }
}

exports.DateTime = DateTime;
exports.Duration = Duration;
exports.FixedOffsetZone = FixedOffsetZone;
exports.IANAZone = IANAZone;
exports.Info = Info;
exports.Interval = Interval;
exports.InvalidZone = InvalidZone;
exports.LocalZone = LocalZone;
exports.Settings = Settings;
exports.Zone = Zone;


},{}],"scripts/web-components/sky-duck/graphql-queries/dark-sky-query.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.darkSkyQuery = void 0;
exports.darkSkyQuery = "query DarkskyData($lat: Float!, $lon: Float!) {\n    weather(latitude: $lat, longitude: $lon) {\n        latitude,\n        longitude,\n        timezone,\n        daily {\n            summary,\n            icon,\n            data {\n                time,\n                sunriseTime,\n                sunsetTime,\n                summary,\n                icon,\n                precipProbability,\n                precipType,\n                temperatureMin,\n                temperatureMax,\n                apparentTemperatureMin,\n                apparentTemperatureMax,\n                windSpeed,\n                windGust,\n                cloudCover,\n                visibility\n            }\n        },\n        hourly {\n            summary,\n            icon,\n            data {\n                time,\n                summary,\n                icon,\n                precipProbability,\n                precipType,\n                temperature,\n                apparentTemperature,\n                windSpeed,\n                windGust,\n                cloudCover,\n                visibility\n            }\n        }\n    }\n}";
},{}],"scripts/web-components/sky-duck/fetch/dark-sky-lookup.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.darkSkyLookup = void 0;

var graphql_config_1 = require("../config/graphql.config");

var dark_sky_query_1 = require("../graphql-queries/dark-sky-query");

exports.darkSkyLookup = function (lat, lon) {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var response, json, weather;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch(graphql_config_1.graphqlConfig.uri, Object.assign(Object.assign({}, graphql_config_1.graphqlConfig.options), {
              body: JSON.stringify({
                query: dark_sky_query_1.darkSkyQuery,
                variables: {
                  lat: lat,
                  lon: lon
                }
              })
            }));

          case 3:
            response = _context.sent;

            if (response.ok) {
              _context.next = 6;
              break;
            }

            throw "(".concat(response.status, ") ").concat(response.statusText);

          case 6:
            _context.next = 8;
            return response.json();

          case 8:
            json = _context.sent;
            weather = json.data.weather;
            return _context.abrupt("return", weather);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            throw Error(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));
};
},{"../config/graphql.config":"scripts/web-components/sky-duck/config/graphql.config.ts","../graphql-queries/dark-sky-query":"scripts/web-components/sky-duck/graphql-queries/dark-sky-query.ts"}],"scripts/web-components/sky-duck/graphql-queries/skydive-club-query.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skydiveClubQuery = void 0;
exports.skydiveClubQuery = "query SkydiveClub($name: String!) {\n    club(name: $name) {\n        id,\n        name,\n        place,\n        site,\n        latitude,\n        longitude,\n    }\n}";
},{}],"scripts/web-components/sky-duck/fetch/skydive-club.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.querySkydiveClub = void 0;

var graphql_config_1 = require("../config/graphql.config");

var skydive_club_query_1 = require("../graphql-queries/skydive-club-query");

exports.querySkydiveClub = function (name) {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var response, json, club;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch(graphql_config_1.graphqlConfig.uri, Object.assign(Object.assign({}, graphql_config_1.graphqlConfig.options), {
              body: JSON.stringify({
                query: skydive_club_query_1.skydiveClubQuery,
                variables: {
                  name: name
                }
              })
            }));

          case 3:
            response = _context.sent;

            if (response.ok) {
              _context.next = 6;
              break;
            }

            throw "(".concat(response.status, ") ").concat(response.statusText);

          case 6:
            _context.next = 8;
            return response.json();

          case 8:
            json = _context.sent;
            club = json.data.club;
            return _context.abrupt("return", club);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            throw new Error(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));
};
},{"../config/graphql.config":"scripts/web-components/sky-duck/config/graphql.config.ts","../graphql-queries/skydive-club-query":"scripts/web-components/sky-duck/graphql-queries/skydive-club-query.ts"}],"scripts/web-components/sky-duck/fetch/db-weather-lookup.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbWeatherLookup = void 0;

var luxon_1 = require("luxon");

exports.dbWeatherLookup = function (latitude, longitude, includeNighttimeWeather) {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var oneHourAgo, response, formattedWeather;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            oneHourAgo = luxon_1.DateTime.local().minus({
              hours: 1
            }).toMillis();
            _context.prev = 1;
            _context.next = 4;
            return fetch("/weather/find?latitude=".concat(latitude, "&longitude=").concat(longitude, "&includeNighttimeWeather=").concat(includeNighttimeWeather));

          case 4:
            response = _context.sent;

            if (response.ok) {
              _context.next = 7;
              break;
            }

            throw "(".concat(response.status, ") ").concat(response.statusText);

          case 7:
            _context.next = 9;
            return response.json();

          case 9:
            formattedWeather = _context.sent;
            return _context.abrupt("return", Object.assign(Object.assign({}, formattedWeather), {
              isFresh: formattedWeather.requestTime > oneHourAgo
            }));

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](1);
            throw Error(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 13]]);
  }));
};
},{"luxon":"../node_modules/luxon/build/cjs-browser/luxon.js"}],"scripts/web-components/sky-duck/fetch/db-weather-update.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbWeatherUpdate = void 0;

exports.dbWeatherUpdate = function (darkSkyData) {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var weatherAPI, method, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            weatherAPI = '/weather/update';
            method = 'PUT';
            _context.next = 4;
            return fetch(weatherAPI, {
              method: method,
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify(darkSkyData)
            });

          case 4:
            response = _context.sent;

            if (response.ok) {
              _context.next = 7;
              break;
            }

            throw Error("".concat(response.status, " (").concat(response.statusText, ")"));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
};
},{}],"scripts/web-components/sky-duck/utils/escape-special-chars.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeSpecialChars = void 0;

exports.escapeSpecialChars = function (query) {
  var queryEscaped = query;
  var specialChars = ['[', ']', '/', '^', '$', '?', '*', '(', ')'];
  specialChars.forEach(function (specialChar) {
    queryEscaped = queryEscaped.replace(new RegExp('\\' + specialChar, 'g'), "\\".concat(specialChar));
  });
  return queryEscaped;
};
},{}],"scripts/web-components/sky-duck/services/skyduck-weather.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkyduckWeather = void 0;

var luxon_1 = require("luxon");
/* eslint-enable no-unused-vars */


var dark_sky_lookup_fetch_1 = require("../fetch/dark-sky-lookup.fetch");

var skydive_club_fetch_1 = require("../fetch/skydive-club.fetch");

var db_weather_lookup_fetch_1 = require("../fetch/db-weather-lookup.fetch");

var db_weather_update_fetch_1 = require("../fetch/db-weather-update.fetch");

var escape_special_chars_1 = require("../utils/escape-special-chars");

var stateapotamus_1 = require("../state/stateapotamus");

var SkyduckWeather =
/*#__PURE__*/
function () {
  function SkyduckWeather() {
    _classCallCheck(this, SkyduckWeather);
  }

  _createClass(SkyduckWeather, [{
    key: "_floatToInt",
    value: function _floatToInt(float) {
      return parseInt(float.toString(), 10);
    }
  }, {
    key: "_fractionToPercent",
    value: function _fractionToPercent(fraction) {
      return parseInt((fraction * 100).toString(), 10);
    }
  }, {
    key: "_formatDailyData",
    value: function _formatDailyData(dailyData, hourlyData, timezone) {
      var _this = this;

      return dailyData.map(function (dailyItem) {
        return Object.assign(Object.assign({}, dailyItem), {
          dateString: _this._getTZDateString(dailyItem.time, timezone),
          timeString: _this._getTZTimeString(dailyItem.time, timezone),
          sunriseTimeString: _this._getTZTimeString(dailyItem.sunriseTime, timezone),
          sunsetTimeString: _this._getTZTimeString(dailyItem.sunsetTime, timezone),
          day: _this._getTZDateTime(dailyItem.time, timezone).weekdayShort,
          cloudCover: _this._fractionToPercent(dailyItem.cloudCover),
          precipProbability: _this._fractionToPercent(dailyItem.precipProbability),
          temperatureMin: _this._floatToInt(dailyItem.temperatureMin),
          temperatureMax: _this._floatToInt(dailyItem.temperatureMax),
          temperatureAverage: _this._floatToInt((dailyItem.temperatureMax + dailyItem.temperatureMin) / 2),
          apparentTemperatureMin: _this._floatToInt(dailyItem.apparentTemperatureMin),
          apparentTemperatureMax: _this._floatToInt(dailyItem.apparentTemperatureMax),
          apparentTemperatureAverage: _this._floatToInt((dailyItem.apparentTemperatureMax + dailyItem.apparentTemperatureMin) / 2),
          humidity: _this._fractionToPercent(dailyItem.humidity),
          windGust: _this._floatToInt(dailyItem.windGust),
          windSpeed: _this._floatToInt(dailyItem.windSpeed),
          visibility: _this._floatToInt(dailyItem.visibility),
          hourly: hourlyData.filter(function (hourlyItem) {
            var hourlyItemDate = _this._getTZDateTime(hourlyItem.time, timezone);

            var dailyItemDate = _this._getTZDateTime(dailyItem.time, timezone);

            return hourlyItemDate.hasSame(dailyItemDate, 'day');
          }).map(function (hourlyItem) {
            return _this._formatHourlyData(hourlyItem, timezone);
          })
        });
      });
    }
  }, {
    key: "_formatHourlyData",
    value: function _formatHourlyData(hourlyData, timezone) {
      return Object.assign(Object.assign({}, hourlyData), {
        dateString: this._getTZDateString(hourlyData.time, timezone),
        timeString: this._getTZTimeString(hourlyData.time, timezone),
        day: this._getTZDateTime(hourlyData.time, timezone).weekdayShort,
        cloudCover: this._fractionToPercent(hourlyData.cloudCover),
        precipProbability: this._fractionToPercent(hourlyData.precipProbability),
        temperature: this._floatToInt(hourlyData.temperature),
        apparentTemperature: this._floatToInt(hourlyData.apparentTemperature),
        humidity: this._fractionToPercent(hourlyData.humidity),
        windGust: this._floatToInt(hourlyData.windGust),
        windSpeed: this._floatToInt(hourlyData.windSpeed),
        visibility: this._floatToInt(hourlyData.visibility)
      });
    }
  }, {
    key: "_getDBWeather",
    value: function _getDBWeather(latitude, longitude, locationQuery) {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var dbWeather, includeNighttimeWeather, darkSkyData, weather;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                includeNighttimeWeather = stateapotamus_1.StateAPotamus.getState().settings.includeNighttimeWeather;
                _context.prev = 1;
                _context.next = 4;
                return db_weather_lookup_fetch_1.dbWeatherLookup(latitude, longitude, includeNighttimeWeather);

              case 4:
                dbWeather = _context.sent;
                _context.next = 9;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](1);

              case 9:
                if (!(!dbWeather || !dbWeather.isFresh)) {
                  _context.next = 25;
                  break;
                }

                _context.next = 12;
                return this._queryDarkSky(latitude, longitude, locationQuery);

              case 12:
                darkSkyData = _context.sent;
                weather = darkSkyData.weather;
                _context.prev = 14;
                _context.next = 17;
                return db_weather_update_fetch_1.dbWeatherUpdate(weather);

              case 17:
                _context.next = 19;
                return db_weather_lookup_fetch_1.dbWeatherLookup(latitude, longitude, includeNighttimeWeather);

              case 19:
                dbWeather = _context.sent;
                _context.next = 25;
                break;

              case 22:
                _context.prev = 22;
                _context.t1 = _context["catch"](14);
                // eslint-disable-next-line no-console
                console.error(_context.t1);

              case 25:
                return _context.abrupt("return", dbWeather);

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 7], [14, 22]]);
      }));
    }
  }, {
    key: "_getTZDateString",
    value: function _getTZDateString(timeInSeconds, timezone) {
      var tzTime = this._getTZDateTime(timeInSeconds, timezone);

      var parts = tzTime.toLocaleString(luxon_1.DateTime.DATE_SHORT).split('/').filter(function (_part, i) {
        return i < 2;
      });
      return parts.join('/');
    }
  }, {
    key: "_getTZDateTime",
    value: function _getTZDateTime(timeInSeconds, timezone) {
      var localTime = luxon_1.DateTime.fromSeconds(timeInSeconds || 0);
      var tzTime = localTime.setZone(timezone);
      return tzTime;
    }
  }, {
    key: "_getTZTimeString",
    value: function _getTZTimeString(timeInSeconds, timezone) {
      var tzTime = this._getTZDateTime(timeInSeconds, timezone);

      return tzTime.toLocaleString(luxon_1.DateTime.TIME_24_SIMPLE);
    }
  }, {
    key: "_formatDarkSkyData",
    value: function _formatDarkSkyData(weather, query) {
      var latitude = weather.latitude,
          longitude = weather.longitude,
          timezone = weather.timezone,
          daily = weather.daily,
          hourly = weather.hourly;
      return {
        weather: {
          query: query,
          requestTime: luxon_1.DateTime.local().toMillis(),
          latitude: latitude,
          longitude: longitude,
          timezone: timezone,
          daily: {
            summary: daily.summary,
            icon: daily.icon,
            data: this._formatDailyData(daily.data, hourly.data, timezone)
          }
        }
      };
    }
  }, {
    key: "_queryDarkSky",
    value: function _queryDarkSky(lat, lon, query) {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var weather;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return dark_sky_lookup_fetch_1.darkSkyLookup(lat, lon);

              case 2:
                weather = _context2.sent;

                if (weather) {
                  _context2.next = 5;
                  break;
                }

                throw Error('Weather Service Unavailable');

              case 5:
                return _context2.abrupt("return", this._formatDarkSkyData(weather, query));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: "getDailyForecastByClub",
    value: function getDailyForecastByClub(name, clubList) {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var skydiveClub, clubEscaped, _skydiveClub, latitude, longitude, weather;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!clubList) {
                  _context3.next = 5;
                  break;
                }

                clubEscaped = escape_special_chars_1.escapeSpecialChars(name);
                skydiveClub = clubList.find(function (club) {
                  return new RegExp(clubEscaped, 'i').test(club.name);
                });
                _context3.next = 8;
                break;

              case 5:
                _context3.next = 7;
                return skydive_club_fetch_1.querySkydiveClub(name);

              case 7:
                skydiveClub = _context3.sent;

              case 8:
                if (skydiveClub) {
                  _context3.next = 10;
                  break;
                }

                throw Error("Could not find club \"".concat(name, "\" in the skyduck database. Try searching by location instead."));

              case 10:
                _skydiveClub = skydiveClub, latitude = _skydiveClub.latitude, longitude = _skydiveClub.longitude;
                _context3.next = 13;
                return this._getDBWeather(latitude, longitude, name);

              case 13:
                weather = _context3.sent;

                if (weather) {
                  _context3.next = 16;
                  break;
                }

                throw Error("Unable to get forecast for club \"".concat(name, "\". Unknown Error."));

              case 16:
                return _context3.abrupt("return", {
                  weather: weather
                });

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
    }
  }, {
    key: "getDailyForecastByQuery",
    value: function getDailyForecastByQuery(geocodeData) {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var latitude, longitude, query, _geocodeData$address, countryRegion, formattedAddress, weather;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                latitude = geocodeData.latitude, longitude = geocodeData.longitude, query = geocodeData.query;
                _geocodeData$address = geocodeData.address, countryRegion = _geocodeData$address.countryRegion, formattedAddress = _geocodeData$address.formattedAddress;
                _context4.next = 4;
                return this._getDBWeather(latitude, longitude, query);

              case 4:
                weather = _context4.sent;
                return _context4.abrupt("return", {
                  weather: weather,
                  countryRegion: countryRegion,
                  formattedAddress: formattedAddress
                });

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
    }
  }]);

  return SkyduckWeather;
}();

exports.SkyduckWeather = SkyduckWeather;
},{"luxon":"../node_modules/luxon/build/cjs-browser/luxon.js","../fetch/dark-sky-lookup.fetch":"scripts/web-components/sky-duck/fetch/dark-sky-lookup.fetch.ts","../fetch/skydive-club.fetch":"scripts/web-components/sky-duck/fetch/skydive-club.fetch.ts","../fetch/db-weather-lookup.fetch":"scripts/web-components/sky-duck/fetch/db-weather-lookup.fetch.ts","../fetch/db-weather-update.fetch":"scripts/web-components/sky-duck/fetch/db-weather-update.fetch.ts","../utils/escape-special-chars":"scripts/web-components/sky-duck/utils/escape-special-chars.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/utils/get-forecast.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getForecast = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

var skyduck_weather_1 = require("../services/skyduck-weather");

exports.getForecast = function getForecast() {
  return __awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var _stateapotamus_1$Stat, club, clubs, geocodeData, weather, forecast, _forecast;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(), club = _stateapotamus_1$Stat.club, clubs = _stateapotamus_1$Stat.clubs, geocodeData = _stateapotamus_1$Stat.geocodeData;

            if (!(!club && !geocodeData)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return");

          case 3:
            weather = new skyduck_weather_1.SkyduckWeather();

            if (!club) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return weather.getDailyForecastByClub(club, clubs);

          case 7:
            forecast = _context.sent;
            stateapotamus_1.StateAPotamus.dispatch('GET_FORECAST_BY_CLUB', {
              forecast: forecast
            });
            return _context.abrupt("return");

          case 10:
            if (!geocodeData) {
              _context.next = 16;
              break;
            }

            _context.next = 13;
            return weather.getDailyForecastByQuery(geocodeData);

          case 13:
            _forecast = _context.sent;
            stateapotamus_1.StateAPotamus.dispatch('GET_FORECAST_BY_LOCATION', {
              forecast: _forecast
            });
            return _context.abrupt("return");

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../services/skyduck-weather":"scripts/web-components/sky-duck/services/skyduck-weather.ts"}],"scripts/web-components/sky-duck/utils/image-map.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageMap = void 0;
var S3_BUCKET = 'https://skyduck.s3.eu-west-2.amazonaws.com';
exports.imageMap = {
  'clear-day': "".concat(S3_BUCKET, "/img/clear-day.jpg"),
  'clear-night': "".concat(S3_BUCKET, "/img/clear-night.jpg"),
  cloudy: "".concat(S3_BUCKET, "/img/cloudy.jpg"),
  default: "".concat(S3_BUCKET, "/img/partly-cloudy-day.jpg"),
  fog: "".concat(S3_BUCKET, "/img/fog.jpg"),
  'partly-cloudy-day': "".concat(S3_BUCKET, "/img/partly-cloudy-day.jpg"),
  rain: "".concat(S3_BUCKET, "/img/rain.jpg"),
  sleet: "".concat(S3_BUCKET, "/img/sleet.jpg"),
  snow: "".concat(S3_BUCKET, "/img/snow.jpg"),
  wind: "".concat(S3_BUCKET, "/img/wind.jpg")
};
},{}],"scripts/web-components/sky-duck/utils/weather-ratings/weather-ratings.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weatherRatings = void 0;

var luxon_1 = require("luxon");

exports.weatherRatings = function () {
  var getDominantFraction = function getDominantFraction(fractions) {
    fractions.sort(function (a, b) {
      return b - a;
    });
    return fractions[0];
  };

  var round = function round(float) {
    var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var numberString = float.toString();
    var floatString = parseFloat(numberString).toFixed(decimalPlaces);
    return Number(floatString);
  };

  return {
    average: function average(ratings) {
      // ----------------------------------------------------
      // Formula: If any colour is 50% return `amber`
      // else return the colour with the highest percentage
      // ----------------------------------------------------
      var reds = ratings.filter(function (rating) {
        return rating === 'red';
      });
      var ambers = ratings.filter(function (rating) {
        return rating === 'amber';
      });
      var greens = ratings.filter(function (rating) {
        return rating === 'green';
      });
      var totalRatings = reds.length + ambers.length + greens.length;
      var redsFraction = round(reds.length / totalRatings);
      var ambersFraction = round(ambers.length / totalRatings);
      var greensFraction = round(greens.length / totalRatings);
      var fractions = [{
        colour: 'red',
        fraction: redsFraction
      }, {
        colour: 'amber',
        fraction: ambersFraction
      }, {
        colour: 'green',
        fraction: greensFraction
      }];
      var fiftyPercentFraction = fractions.find(function (fractionData) {
        return fractionData.fraction === 0.5;
      });

      if (fiftyPercentFraction) {
        return 'amber';
      }

      var dominantFraction = getDominantFraction([redsFraction, ambersFraction, greensFraction]);
      var dominantColour = fractions.find(function (fractionData) {
        return fractionData.fraction === dominantFraction;
      }).colour;
      return dominantColour;
    },
    cloudCover: function cloudCover(_cloudCover) {
      return _cloudCover < 50 ? 'green' : _cloudCover < 75 ? 'amber' : 'red';
    },
    windSpeed: function windSpeed(_windSpeed) {
      return _windSpeed < 20 ? 'green' : _windSpeed < 25 ? 'amber' : 'red';
    },
    windGust: function windGust(_windGust) {
      return this.windSpeed(_windGust);
    },
    precipProbability: function precipProbability(_precipProbability) {
      return _precipProbability < 20 ? 'green' : _precipProbability < 50 ? 'amber' : 'red';
    },
    sunset: function sunset(sunsetTime, timezone) {
      var dt = luxon_1.DateTime.fromSeconds(sunsetTime).setZone(timezone);
      var sunsetColorModifier = dt.hour < 16 ? 'red' : dt.hour < 18 ? 'amber' : 'green';
      return sunsetColorModifier;
    },
    visibility: function visibility(_visibility) {
      return _visibility > 4 ? 'green' : _visibility > 2 ? 'amber' : 'red';
    }
  };
}();
},{"luxon":"../node_modules/luxon/build/cjs-browser/luxon.js"}],"scripts/web-components/sky-duck/utils/average-rating-modifier-for-day.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.averageRatingModifierForDay = void 0;

var weather_ratings_1 = require("./weather-ratings/weather-ratings");

exports.averageRatingModifierForDay = function (hourlyData) {
  var ratings = [];
  hourlyData.forEach(function (hour) {
    var cloudCover = hour.cloudCover,
        windGust = hour.windGust;
    ratings.push(weather_ratings_1.weatherRatings.cloudCover(cloudCover));
    ratings.push(weather_ratings_1.weatherRatings.windGust(windGust));
  });
  var averageRatingModifier = "--".concat(weather_ratings_1.weatherRatings.average(ratings));
  return averageRatingModifier;
};
},{"./weather-ratings/weather-ratings":"scripts/web-components/sky-duck/utils/weather-ratings/weather-ratings.ts"}],"scripts/web-components/sky-duck/templates/forecast-hour.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForecastHourTemplate = void 0;

var image_map_1 = require("../utils/image-map");

var weather_ratings_1 = require("../utils/weather-ratings/weather-ratings");

var average_rating_modifier_for_day_1 = require("../utils/average-rating-modifier-for-day");

var ForecastHourTemplate =
/*#__PURE__*/
function () {
  function ForecastHourTemplate(hourlyData, isDaylight) {
    _classCallCheck(this, ForecastHourTemplate);

    this._hourlyData = hourlyData;
    this._isDaylight = isDaylight;

    this._buildForecastHour();
  }

  _createClass(ForecastHourTemplate, [{
    key: "_buildForecastHour",
    value: function _buildForecastHour() {
      var _this$_hourlyData = this._hourlyData,
          timeString = _this$_hourlyData.timeString,
          icon = _this$_hourlyData.icon,
          summary = _this$_hourlyData.summary,
          precipType = _this$_hourlyData.precipType,
          precipProbability = _this$_hourlyData.precipProbability,
          cloudCover = _this$_hourlyData.cloudCover,
          visibility = _this$_hourlyData.visibility,
          windSpeed = _this$_hourlyData.windSpeed,
          windGust = _this$_hourlyData.windGust;
      var weatherImagePath = image_map_1.imageMap[icon] || image_map_1.imageMap.default;

      var colorModifiers = this._getColorModifiers(this._hourlyData);

      var averageRatingModifier = average_rating_modifier_for_day_1.averageRatingModifierForDay([this._hourlyData]);
      var notDaylightModifier = !this._isDaylight ? '--not-daylight' : '';
      var weatherPhotoStyle = "\n            background-image: url('".concat(weatherImagePath, "');\n        ");
      this._forecastHour = new DOMParser().parseFromString("\n            <div class=\"forecast-grid-hour ".concat(notDaylightModifier, "\">\n                <div class=\"forecast-grid-hour__not-daylight-mesh\"></div>\n                <div class=\"forecast-grid-hour__photo\" style=\"").concat(weatherPhotoStyle, "\"></div>\n\n                <h2 class=\"forecast-grid-hour-time-container\">\n                    <span class=\"forecast-grid-hour-time-container__time ").concat(averageRatingModifier, "\">").concat(timeString.split(':')[0], "</span>\n                </h2>\n\n                ").concat(this._buildForecastHourSummary(summary), "\n\n                <div class=\"forecast-data-grid\">\n                    <div class=\"forecast-data-grid-type\">\n                        <zooduck-icon-circle\n                            size=\"22\"\n                            class=\"forecast-data-grid-type__icon ").concat(colorModifiers.cloudCover, "\">\n                        </zooduck-icon-circle>\n                        <span class=\"forecast-data-grid-type__text\">cloud</span>\n                    </div>\n                    <div class=\"forecast-data-grid-type --landscape-only\">\n                        <zooduck-icon-circle\n                            size=\"22\"\n                            class=\"forecast-data-grid-type__icon ").concat(colorModifiers.visibility, "\">\n                        </zooduck-icon-circle>\n                        <span class=\"forecast-data-grid-type__text\">vis</span>\n                    </div>\n                    <div class=\"forecast-data-grid-type\">\n                        <zooduck-icon-circle\n                            size=\"22\"\n                            class=\"forecast-data-grid-type__icon ").concat(colorModifiers.windSpeed, "\">\n                        </zooduck-icon-circle>\n                        <span class=\"forecast-data-grid-type__text\">wind</span>\n                    </div>\n                    <div class=\"forecast-data-grid-type\">\n                        <zooduck-icon-circle\n                            size=\"22\"\n                            class=\"forecast-data-grid-type__icon ").concat(colorModifiers.windGust, "\">\n                        </zooduck-icon-circle>\n                        <span class=\"forecast-data-grid-type__text\">gust</span>\n                    </div>\n                    <div class=\"forecast-data-grid-type --landscape-only\">\n                        <zooduck-icon-circle\n                            size=\"22\"\n                            class=\"forecast-data-grid-type__icon ").concat(colorModifiers.precipProbability, "\">\n                        </zooduck-icon-circle>\n                        <span class=\"forecast-data-grid-type__text\">").concat(precipType || 'rain', "</span>\n                    </div>\n\n                    <div class=\"forecast-data-grid__data ").concat(colorModifiers.cloudCover, "\">").concat(cloudCover, "%</div>\n                    <div class=\"forecast-data-grid__data ").concat(colorModifiers.visibility, " --landscape-only\">").concat(visibility, "</div>\n                    <div class=\"forecast-data-grid__data ").concat(colorModifiers.windSpeed, "\">\n                        <span>").concat(windSpeed, "</span>\n                    </div>\n                    <div class=\"forecast-data-grid__data ").concat(colorModifiers.windGust, "\">\n                        <span>").concat(windGust, "</span>\n                    </div>\n                    <div class=\"forecast-data-grid__data ").concat(colorModifiers.precipProbability, " --landscape-only\">").concat(precipProbability, "%</div>\n                </div>\n            </div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "_buildForecastHourSummary",
    value: function _buildForecastHourSummary(summary) {
      var wordsInSummary = summary.split(' ');

      if (!summary || wordsInSummary.length < 3) {
        return "<h4 class=\"forecast-grid-hour__summary\">".concat(summary, "</h4>");
      }

      return "<h5 class=\"forecast-grid-hour__summary\">".concat(summary, "</h5>");
    }
  }, {
    key: "_getColorModifiers",
    value: function _getColorModifiers(colorModifiersData) {
      return {
        cloudCover: "--".concat(weather_ratings_1.weatherRatings.cloudCover(colorModifiersData.cloudCover)),
        windSpeed: "--".concat(weather_ratings_1.weatherRatings.windSpeed(colorModifiersData.windSpeed)),
        windGust: "--".concat(weather_ratings_1.weatherRatings.windGust(colorModifiersData.windGust)),
        precipProbability: "--".concat(weather_ratings_1.weatherRatings.precipProbability(colorModifiersData.precipProbability)),
        visibility: "--".concat(weather_ratings_1.weatherRatings.visibility(colorModifiersData.visibility))
      };
    }
  }, {
    key: "html",
    get: function get() {
      return this._forecastHour;
    }
  }]);

  return ForecastHourTemplate;
}();

exports.ForecastHourTemplate = ForecastHourTemplate;
},{"../utils/image-map":"scripts/web-components/sky-duck/utils/image-map.ts","../utils/weather-ratings/weather-ratings":"scripts/web-components/sky-duck/utils/weather-ratings/weather-ratings.ts","../utils/average-rating-modifier-for-day":"scripts/web-components/sky-duck/utils/average-rating-modifier-for-day.ts"}],"scripts/web-components/sky-duck/templates/forecast.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForecastTemplate = void 0;

var forecast_hour_template_1 = require("./forecast-hour.template");

var luxon_1 = require("luxon");

var ForecastTemplate =
/*#__PURE__*/
function () {
  function ForecastTemplate(dayForecast, forecastHours, forecastType) {
    _classCallCheck(this, ForecastTemplate);

    this._dayForecast = dayForecast;
    this._forecastHours = forecastHours;
    this._forecastType = forecastType;

    this._buildForecast();
  }

  _createClass(ForecastTemplate, [{
    key: "_buildForecast",
    value: function _buildForecast() {
      var _this = this;

      var _this$_dayForecast = this._dayForecast,
          sunriseTime = _this$_dayForecast.sunriseTime,
          sunsetTime = _this$_dayForecast.sunsetTime,
          hourly = _this$_dayForecast.hourly;
      var hourlyData = hourly.filter(function (hour) {
        return _this._forecastHours.includes(parseInt(hour.timeString, 10));
      });
      var hours = hourlyData.map(function (hour) {
        var isDaylight = _this._isDaylight(sunriseTime, sunsetTime, hour.time);

        return new forecast_hour_template_1.ForecastHourTemplate(hour, isDaylight).html;
      });
      var modifierClass = "--".concat(this._forecastType);
      this._forecast = new DOMParser().parseFromString("\n            <div class=\"forecast-grid ".concat(modifierClass, "\">\n                <div class=\"forecast-grid-hours\"></div>\n            </div>\n        "), 'text/html').body.firstChild;

      var forecastGridHours = this._forecast.querySelector('.forecast-grid-hours');

      hours.forEach(function (hour) {
        forecastGridHours.appendChild(hour);
      });
    }
  }, {
    key: "_isDaylight",
    value: function _isDaylight(sunriseTimeInSeconds, sunsetTimeInSeconds, timeInSeconds) {
      var sunriseDT = luxon_1.DateTime.fromSeconds(sunriseTimeInSeconds);
      var sunsetDT = luxon_1.DateTime.fromSeconds(sunsetTimeInSeconds);
      var dt = luxon_1.DateTime.fromSeconds(timeInSeconds);
      var daylightInterval = luxon_1.Interval.fromDateTimes(sunriseDT, sunsetDT);
      return !daylightInterval.isBefore(dt) && !daylightInterval.isAfter(dt);
    }
  }, {
    key: "html",
    get: function get() {
      return this._forecast;
    }
  }]);

  return ForecastTemplate;
}();

exports.ForecastTemplate = ForecastTemplate;
},{"./forecast-hour.template":"scripts/web-components/sky-duck/templates/forecast-hour.template.ts","luxon":"../node_modules/luxon/build/cjs-browser/luxon.js"}],"scripts/web-components/sky-duck/templates/forecast-carousel.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForecastCarouselTemplate = void 0;

var forecast_template_1 = require("./forecast.template");

var ForecastCarouselTemplate =
/*#__PURE__*/
function () {
  function ForecastCarouselTemplate(dailyData, forecastHours, forecastType, currentSlide, eventHandler) {
    _classCallCheck(this, ForecastCarouselTemplate);

    this._dailyData = dailyData;
    this._forecastHours = forecastHours;
    this._forecastType = forecastType;
    this._currentSlide = currentSlide;
    this._eventHandler = eventHandler;

    this._buildForecastCarousel();
  }

  _createClass(ForecastCarouselTemplate, [{
    key: "_buildForecastCarousel",
    value: function _buildForecastCarousel() {
      var _this = this;

      var id = this._forecastType === 'extended' ? 'forecastCarouselExtended' : 'forecastCarouselStandard';
      var className = this._forecastType === 'extended' ? 'forecast-carousel-extended' : 'forecast-carousel-standard';
      this._forecastCarousel = new DOMParser().parseFromString("\n            <zooduck-carousel\n                currentslide=\"".concat(this._currentSlide, "\"\n                id=\"").concat(id, "\"\n                class=\"").concat(className, "\">\n            </zooduck-carousel>\n        "), 'text/html').body.firstChild;

      var forecastSlides = this._dailyData.filter(function (dailyData) {
        return dailyData.hourly.length;
      }).map(function (dailyData) {
        return new forecast_template_1.ForecastTemplate(dailyData, _this._forecastHours, _this._forecastType).html;
      });

      var slidesSlot = this._buildSlidesSlot();

      forecastSlides.forEach(function (slide) {
        slidesSlot.appendChild(slide);
      });

      this._forecastCarousel.appendChild(slidesSlot);

      if (!this._eventHandler) {
        return;
      }

      this._forecastCarousel.addEventListener('slidechange', function (e) {
        _this._eventHandler(e);
      });
    }
  }, {
    key: "_buildSlidesSlot",
    value: function _buildSlidesSlot() {
      return new DOMParser().parseFromString("\n            <div\n                slot=\"slides\"\n                class=\"forecast-slides\">\n            </div>\n        ", 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._forecastCarousel;
    }
  }]);

  return ForecastCarouselTemplate;
}();

exports.ForecastCarouselTemplate = ForecastCarouselTemplate;
},{"./forecast.template":"scripts/web-components/sky-duck/templates/forecast.template.ts"}],"scripts/web-components/sky-duck/templates/header-placeholder.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderPlaceholderTemplate = void 0;

var HeaderPlaceholderTemplate =
/*#__PURE__*/
function () {
  function HeaderPlaceholderTemplate() {
    _classCallCheck(this, HeaderPlaceholderTemplate);

    this._buildHeaderPlaceholder();
  }

  _createClass(HeaderPlaceholderTemplate, [{
    key: "_buildHeaderPlaceholder",
    value: function _buildHeaderPlaceholder() {
      this._headerPlaceholder = new DOMParser().parseFromString("\n            <div class=\"header-placeholder --render-once\"></div>\n        ", 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._headerPlaceholder;
    }
  }]);

  return HeaderPlaceholderTemplate;
}();

exports.HeaderPlaceholderTemplate = HeaderPlaceholderTemplate;
},{}],"scripts/web-components/sky-duck/utils/hours.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hours = void 0;

var luxon_1 = require("luxon");

var Hours =
/*#__PURE__*/
function () {
  function Hours(dailyData, timezone) {
    _classCallCheck(this, Hours);

    var hourly = dailyData.hourly,
        sunriseTime = dailyData.sunriseTime,
        sunsetTime = dailyData.sunsetTime;
    this._hourlyData = hourly;
    this._sunrise = sunriseTime;
    this._sunset = sunsetTime;
    this._timezone = timezone;
  }

  _createClass(Hours, [{
    key: "daylightHours",
    get: function get() {
      var _this = this;

      return this._hourlyData.filter(function (hourlyItem) {
        var hour = luxon_1.DateTime.fromSeconds(hourlyItem.time).setZone(_this._timezone).hour;
        var sunriseHour = luxon_1.DateTime.fromSeconds(_this._sunrise).setZone(_this._timezone).hour;
        var sunsetHour = luxon_1.DateTime.fromSeconds(_this._sunset).setZone(_this._timezone).hour;
        return hour > sunriseHour && hour < sunsetHour;
      });
    }
  }]);

  return Hours;
}();

exports.Hours = Hours;
},{"luxon":"../node_modules/luxon/build/cjs-browser/luxon.js"}],"scripts/web-components/sky-duck/templates/daylight-hours-indicator.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DaylightHoursIndicatorTemplate = void 0;

var luxon_1 = require("luxon");

var DaylightHoursIndicatorTemplate =
/*#__PURE__*/
function () {
  function DaylightHoursIndicatorTemplate(sunriseTime, sunriseTimeString, sunsetTime, sunsetTimeString, timezone) {
    _classCallCheck(this, DaylightHoursIndicatorTemplate);

    this._sunriseTime = sunriseTime;
    this._sunriseTimeString = sunriseTimeString;
    this._sunsetTime = sunsetTime;
    this._sunsetTimeString = sunsetTimeString;
    this._timezone = timezone;

    this._buildDaylightHoursIndicator();
  }

  _createClass(DaylightHoursIndicatorTemplate, [{
    key: "_getStyle",
    value: function _getStyle() {
      var minutesPerDay = 60 * 24;
      var sunriseDt = luxon_1.DateTime.fromSeconds(this._sunriseTime).setZone(this._timezone);
      var sunsetDt = luxon_1.DateTime.fromSeconds(this._sunsetTime).setZone(this._timezone);
      var sunriseToSunsetInterval = luxon_1.Interval.fromDateTimes(sunriseDt, sunsetDt);
      var daylightMinutes = sunriseToSunsetInterval.length('minutes');
      var daylightMinutesFraction = daylightMinutes / minutesPerDay;
      return "grid-template-columns: auto ".concat(daylightMinutesFraction, "fr auto;");
    }
  }, {
    key: "_buildDaylightHoursIndicator",
    value: function _buildDaylightHoursIndicator() {
      this._daylightHoursIndicator = new DOMParser().parseFromString("\n            <div\n                class=\"daylight-hours-indicator\"\n                style=\"".concat(this._getStyle(), "\">\n                <h3 class=\"daylight-hours-indicator__section --sunrise\">").concat(this._sunriseTimeString, "</h3>\n                <div class=\"daylight-hours-indicator__daylight\"></div>\n                <h3 class=\"daylight-hours-indicator__section --sunset\">").concat(this._sunsetTimeString, "</h3>\n            </div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._daylightHoursIndicator;
    }
  }]);

  return DaylightHoursIndicatorTemplate;
}();

exports.DaylightHoursIndicatorTemplate = DaylightHoursIndicatorTemplate;
},{"luxon":"../node_modules/luxon/build/cjs-browser/luxon.js"}],"scripts/web-components/sky-duck/templates/forecast-header.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForecastHeaderTemplate = void 0;

var average_rating_modifier_for_day_1 = require("../utils/average-rating-modifier-for-day");

var hours_1 = require("../utils/hours");

var daylight_hours_indicator_template_1 = require("./daylight-hours-indicator.template");

var stateapotamus_1 = require("../state/stateapotamus");

var ForecastHeaderTemplate =
/*#__PURE__*/
function () {
  function ForecastHeaderTemplate() {
    _classCallCheck(this, ForecastHeaderTemplate);

    var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
        currentForecastSlide = _stateapotamus_1$Stat.currentForecastSlide,
        forecast = _stateapotamus_1$Stat.forecast;

    this._currentForecastSlide = currentForecastSlide;
    this._forecast = forecast;

    this._buildForecastHeader();
  }

  _createClass(ForecastHeaderTemplate, [{
    key: "_buildDaylightHoursIndicator",
    value: function _buildDaylightHoursIndicator() {
      var _this$_forecast$weath = this._forecast.weather,
          daily = _this$_forecast$weath.daily,
          timezone = _this$_forecast$weath.timezone;
      var _daily$data = daily.data[this._currentForecastSlide - 1],
          sunriseTime = _daily$data.sunriseTime,
          sunriseTimeString = _daily$data.sunriseTimeString,
          sunsetTime = _daily$data.sunsetTime,
          sunsetTimeString = _daily$data.sunsetTimeString;
      return new daylight_hours_indicator_template_1.DaylightHoursIndicatorTemplate(sunriseTime, sunriseTimeString, sunsetTime, sunsetTimeString, timezone).html;
    }
  }, {
    key: "_buildForecastHeader",
    value: function _buildForecastHeader() {
      var dailyData = this._forecast.weather.daily.data[this._currentForecastSlide - 1];
      var timezone = this._forecast.weather.timezone;
      var day = dailyData.day,
          dateString = dailyData.dateString,
          summary = dailyData.summary,
          temperatureMin = dailyData.temperatureMin,
          temperatureMax = dailyData.temperatureMax;
      var defaultSummary = 'Partly potato with a chance of twilight sparkle in the evening.';
      var daylightHours = new hours_1.Hours(dailyData, timezone).daylightHours;
      var averageRatingModifier = average_rating_modifier_for_day_1.averageRatingModifierForDay(daylightHours);
      this._forecastHeader = new DOMParser().parseFromString("\n            <div\n                id=\"forecastHeader\"\n                class=\"forecast-header --render-once\">\n                <div class=\"forecast-header-info-grid ".concat(averageRatingModifier, "\">\n                    <div class=\"forecast-header-info-grid-date\">\n                        <h2 class=\"forecast-header-info-grid-date__day\">").concat(day, "</h2>\n                        <h1 class=\"forecast-header-info-grid-date__date-string\">").concat(dateString, "</h1>\n                    </div>\n                    <div class=\"forecast-header-info-grid__temp\">\n                        <h3>").concat(temperatureMin, " / ").concat(temperatureMax, "&deg;</h3>\n                    </div>\n                    <div class=\"forecast-header-info-grid__summary\">").concat(summary || defaultSummary, "</div>\n                </div>\n            </div>\n        "), 'text/html').body.firstChild;

      this._forecastHeader.appendChild(this._buildDaylightHoursIndicator());
    }
  }, {
    key: "html",
    get: function get() {
      return this._forecastHeader;
    }
  }]);

  return ForecastHeaderTemplate;
}();

exports.ForecastHeaderTemplate = ForecastHeaderTemplate;
},{"../utils/average-rating-modifier-for-day":"scripts/web-components/sky-duck/utils/average-rating-modifier-for-day.ts","../utils/hours":"scripts/web-components/sky-duck/utils/hours.ts","./daylight-hours-indicator.template":"scripts/web-components/sky-duck/templates/daylight-hours-indicator.template.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/templates/last-updated-info.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LastUpdatedInfoTemplate = void 0;

var LastUpdatedInfoTemplate =
/*#__PURE__*/
function () {
  function LastUpdatedInfoTemplate(lastUpdatedDate) {
    _classCallCheck(this, LastUpdatedInfoTemplate);

    this._lastUpdatedDate = lastUpdatedDate;

    this._buildLastUpdatedInfo();
  }

  _createClass(LastUpdatedInfoTemplate, [{
    key: "_buildLastUpdatedInfo",
    value: function _buildLastUpdatedInfo() {
      this._lastUpdatedInfo = new DOMParser().parseFromString("\n            <div class=\"last-updated-info\" id=\"lastUpdatedInfo\">Last Updated: ".concat(this._lastUpdatedDate, "</div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._lastUpdatedInfo;
    }
  }]);

  return LastUpdatedInfoTemplate;
}();

exports.LastUpdatedInfoTemplate = LastUpdatedInfoTemplate;
},{}],"scripts/web-components/sky-duck/services/skyduck-elements.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkyduckElements = void 0;

var forecast_carousel_template_1 = require("../templates/forecast-carousel.template");

var header_template_1 = require("../templates/header.template");

var club_list_carousel_template_1 = require("../templates/club-list-carousel.template");

var not_found_template_1 = require("../templates/not-found.template");

var header_placeholder_template_1 = require("../templates/header-placeholder.template");

var stateapotamus_1 = require("../state/stateapotamus");

var forecast_header_template_1 = require("../templates/forecast-header.template");

var last_updated_info_template_1 = require("../templates/last-updated-info.template");

var luxon_1 = require("luxon");
/* eslint-enable */


var SkyduckElements =
/*#__PURE__*/
function () {
  function SkyduckElements(eventHandlers) {
    _classCallCheck(this, SkyduckElements);

    this._CLUBS_NOT_FOUND = 'CLUBS_NOT_FOUND';
    this._FORECAST_NOT_FOUND = 'FORECAST_NOT_FOUND';

    var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
        clubCountries = _stateapotamus_1$Stat.clubCountries,
        clubsSortedByCountry = _stateapotamus_1$Stat.clubsSortedByCountry,
        currentForecastSlide = _stateapotamus_1$Stat.currentForecastSlide,
        dailyForecast = _stateapotamus_1$Stat.forecast,
        locationDetails = _stateapotamus_1$Stat.locationDetails,
        userLocation = _stateapotamus_1$Stat.userLocation;

    this._currentForecastSlide = currentForecastSlide;
    this._dailyForecast = dailyForecast;
    this._forecastHours = [9, 12, 15];
    this._forecastHoursExtended = Array.from({
      length: 24
    }).map(function (_item, i) {
      return i;
    });
    this._hasClubList = clubsSortedByCountry && Object.keys(clubsSortedByCountry).length > 0;
    this._locationDetails = locationDetails;
    this._clubsSortedByCountry = clubsSortedByCountry;
    this._clubCountries = clubCountries;
    this._userLocation = userLocation;
    this._eventHandlers = eventHandlers;
  }

  _createClass(SkyduckElements, [{
    key: "clubList",
    get: function get() {
      if (!this._hasClubList) {
        return new not_found_template_1.NotFoundTemplate(this._CLUBS_NOT_FOUND).html;
      }

      return new club_list_carousel_template_1.ClubListCarouselTemplate(this._clubsSortedByCountry, this._clubCountries, this._userLocation, this._eventHandlers.onClubListCarouselSlideChangeHandler, this._eventHandlers.onClubChangeHandler).html;
    }
  }, {
    key: "forecast",
    get: function get() {
      if (!this._dailyForecast) {
        return new not_found_template_1.NotFoundTemplate(this._FORECAST_NOT_FOUND).html;
      }

      var dailyData = this._dailyForecast.weather.daily.data;
      this._forecastCarousel = new forecast_carousel_template_1.ForecastCarouselTemplate(dailyData, this._forecastHours, 'standard', this._currentForecastSlide, this._eventHandlers.onForecastCarouselSlideChangeHandler).html;
      return this._forecastCarousel;
    }
  }, {
    key: "forecastExtended",
    get: function get() {
      if (!this._dailyForecast) {
        return new not_found_template_1.NotFoundTemplate(this._FORECAST_NOT_FOUND).html;
      }

      var dailyData = this._dailyForecast.weather.daily.data;
      this._forecastCarousel = new forecast_carousel_template_1.ForecastCarouselTemplate(dailyData, this._forecastHoursExtended, 'extended', this._currentForecastSlide, this._eventHandlers.onForecastCarouselSlideChangeHandler).html;
      return this._forecastCarousel;
    }
  }, {
    key: "forecastHeader",
    get: function get() {
      if (!this._dailyForecast) {
        return new not_found_template_1.NotFoundTemplate(this._FORECAST_NOT_FOUND, 'forecastHeader', '--render-once').html;
      }

      return new forecast_header_template_1.ForecastHeaderTemplate().html;
    }
  }, {
    key: "header",
    get: function get() {
      return new header_template_1.HeaderTemplate(this._locationDetails.name, this._locationDetails.address, this._eventHandlers.toggleSettingsHandler).html;
    }
  }, {
    key: "headerPlaceholder",
    get: function get() {
      return new header_placeholder_template_1.HeaderPlaceholderTemplate().html;
    }
  }, {
    key: "lastUpdatedInfo",
    get: function get() {
      var lastUpdatedDate = luxon_1.DateTime.fromMillis(this._dailyForecast.weather.requestTime).toLocaleString(luxon_1.DateTime.DATETIME_SHORT);
      return new last_updated_info_template_1.LastUpdatedInfoTemplate(lastUpdatedDate).html;
    }
  }]);

  return SkyduckElements;
}();

exports.SkyduckElements = SkyduckElements;
},{"../templates/forecast-carousel.template":"scripts/web-components/sky-duck/templates/forecast-carousel.template.ts","../templates/header.template":"scripts/web-components/sky-duck/templates/header.template.ts","../templates/club-list-carousel.template":"scripts/web-components/sky-duck/templates/club-list-carousel.template.ts","../templates/not-found.template":"scripts/web-components/sky-duck/templates/not-found.template.ts","../templates/header-placeholder.template":"scripts/web-components/sky-duck/templates/header-placeholder.template.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../templates/forecast-header.template":"scripts/web-components/sky-duck/templates/forecast-header.template.ts","../templates/last-updated-info.template":"scripts/web-components/sky-duck/templates/last-updated-info.template.ts","luxon":"../node_modules/luxon/build/cjs-browser/luxon.js"}],"scripts/web-components/sky-duck/templates/loader.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoaderTemplate = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

var LoaderTemplate =
/*#__PURE__*/
function () {
  function LoaderTemplate() {
    _classCallCheck(this, LoaderTemplate);

    this._buildLoader();
  }

  _createClass(LoaderTemplate, [{
    key: "_buildLoader",
    value: function _buildLoader() {
      this._loader = new DOMParser().parseFromString("\n            <div class=\"loader --render-once\">\n                <skyduck-interval-loader></skyduck-interval-loader>\n                <skyduck-splash-screen-loader version=\"".concat(stateapotamus_1.StateAPotamus.getState().version, "\" active></skyduck-splash-screen-loader>\n                <skyduck-loader-error></skyduck-loader-error>\n            </div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._loader;
    }
  }]);

  return LoaderTemplate;
}();

exports.LoaderTemplate = LoaderTemplate;
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/utils/background-image-for-mesh.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backgroundImageForMesh = void 0;

exports.backgroundImageForMesh = function () {
  var canvas = document.createElement('canvas');
  canvas.width = 5;
  canvas.height = 5;
  var context = canvas.getContext('2d');
  context.fillStyle = 'rgba(255, 255, 255, .2)';
  context.fillRect(1, 1, 3, 3);
  return canvas.toDataURL();
};
},{}],"scripts/web-components/sky-duck/services/skyduck-style.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkyduckStyle = void 0;

var background_image_for_mesh_1 = require("../utils/background-image-for-mesh");

var SkyduckStyle =
/*#__PURE__*/
function () {
  function SkyduckStyle(styleOptions) {
    _classCallCheck(this, SkyduckStyle);

    this._backgroundImageForMesh = background_image_for_mesh_1.backgroundImageForMesh();
    this._styleOptions = styleOptions;

    this._buildStyle();
  }

  _createClass(SkyduckStyle, [{
    key: "_buildStyle",
    value: function _buildStyle() {
      var transitionSpeedInMillis = this._styleOptions.transitionSpeedInMillis;
      this._style = "\n            @import url('https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&display=swap');\n\n            @keyframes hide-carousel {\n                0% {\n                    height: auto;\n                }\n                100% {\n                    height: 0;\n                }\n            }\n\n            @keyframes loading-bar {\n                0% {\n                    width: 0;\n                }\n                50% {\n                    width: 10%;\n                }\n                60% {\n                    width: 50%;\n                }\n                69% {\n                    width: 55%;\n                }\n                70% {\n                    width: 65%;\n                }\n                79% {\n                    width: 70%;\n                }\n                80% {\n                    width: 80%;\n                }\n                100% {\n                    width: 100%;\n                }\n            }\n\n            @keyframes icon-pulse {\n                0% {\n                    transform: scale(1)\n                }\n                25% {\n                    transform: scale(.9);\n                }\n                50% {\n                    transform: scale(1);\n                }\n                75% {\n                    transform: scale(1.1);\n                }\n                100% {\n                    transform: scale(1);\n                }\n            }\n\n            :host {\n                position: relative;\n                display: block;\n                width: 100%;\n                height: 100vh;\n                max-width: var(--max-width);\n                min-height: 100vh;\n                margin: 0 auto;\n                background-color: var(--white);\n                user-select: none;\n                overflow: hidden;\n                font-family: Roboto, sans-serif;\n                font-size: var(--font-size-base);\n                color: var(--black);\n\n                --max-width: 823px;\n\n                --header-z-index: 1;\n                --forecast-header-z-index: 1;\n                --settings-glass-z-index: 97;\n                --settings-z-index: 98;\n                --sub-settings-glass-z-index: 99;\n                --sub-settings-z-index: 100;\n                --loader-z-index: 101;\n\n                --font-size-base: 16px;\n                --slide-selectors-height: 40px;\n                --header-height: 70px;\n                --forecast-header-height: 117px;\n                --last-updated-info-height: 20px;\n\n                --red: rgb(255, 99, 71, .8);\n                --amber: rgba(255, 165, 0, .8);\n                --green: rgba(34, 139, 34, .8);\n\n                --white: #fff;\n                --black: #222;\n                --charcoal: #333;\n                --paleyellow: #fbfbaa;\n                --lightskyblue: lightskyblue;\n                --paleskyblue: rgba(135, 206, 250, .4);\n                --cornflowerblue: cornflowerblue;\n                --gray: #999;\n                --icongray: #ccc;\n                --lightgray: lightgray;\n                --palegray: #eee;\n                --whitesmoke: whitesmoke;\n                --translucentwhite: rgba(255, 255, 255, .8);\n\n                --box-shadow: -2px 2px 15px rgba(0, 0, 0, .2);\n            }\n            :host(.--ready) {\n                height: auto;\n            }\n            :host(.--settings-active) {\n                height: 100vh;\n            }\n\n            * {\n                box-sizing: border-box;\n            }\n\n            h1,\n            h2,\n            h3,\n            h4,\n            h5 {\n                margin: 0;\n                color: var(--charcoal);\n            }\n\n            ul {\n                list-style-type: none;\n                margin-block-start: 0;\n                margin-block-end: 0;\n                padding-inline-start: 0;\n            }\n\n            a {\n                color: var(--cornflowerblue);\n                text-decoration: none;\n            }\n            a:hover {\n                text-decoration: underline;\n            }\n\n            zooduck-carousel {\n                transition: none;\n            }\n\n            .loader {\n                display: none;\n            }\n            :host(.--loading) .loader {\n                position: fixed;\n                left: 0;\n                top: 0;\n                display: block;\n                z-index: var(--loader-z-index);\n            }\n            .loader__error {\n                display: none;\n                grid-row: 2;\n                align-self: start;\n                text-align: center;\n                border: solid 3px var(--white);\n                padding: 10px;\n                max-width: 450px;\n                color: var(--white);\n            }\n            :host(.--error) .loader__error {\n                display: block;\n            }\n\n            .geolocation-error {\n                background-color: lightgoldenrodyellow;\n                color: rgba(0, 0, 0, .52);\n                font-size: 14px;\n                padding: 10px;\n            }\n\n            .header {\n                position: fixed;\n                z-index: var(--header-z-index);\n                left: 0;\n                top: 0;\n                max-width: var(--max-width);\n                display: grid;\n                grid-template-columns: repeat(2, auto) 1fr auto;\n                grid-gap: 10px;\n                align-items: center;\n                width: 100%;\n                height: var(--header-height);\n                padding: 10px;\n                color: var(--white);\n                background-color: var(--lightskyblue);\n                touch-action: none;\n            }\n            .header__settings-control {\n               grid-column: 1;\n               align-self: start;\n            }\n            .header__logo {\n                grid-column: 2;\n                padding: 5px;\n                background-color: var(--white);\n            }\n            .header__title {\n                grid-column: 3;\n                font-size: 1.5em;\n                font-weight: bold;\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n            }\n\n            .header-title {\n                display: grid;\n                grid-template-rows: repeat(2, auto);\n\n                grid-column: 3;\n                font-size: 1.5em;\n                font-weight: bold;\n            }\n            .header-title__item {\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n            }\n            .header-title__item.--sub-title {\n                font-size: 70%;\n            }\n\n            .header-placeholder {\n                display: block;\n                width: 100%;\n                height: var(--header-height);\n            }\n            :host(.--active-carousel-forecast) .header-placeholder {\n                height: calc(var(--header-height) + var(--forecast-header-height));\n            }\n\n            #settingsToggle {\n                cursor: pointer;\n            }\n\n            .glass {\n                display: none;\n                position: absolute;\n                left: 0;\n                top: 0;\n                width: 100%;\n                height: 100%;\n                background-color: rgba(0, 0, 0, .2);\n                background-image: url(".concat(this._backgroundImageForMesh, ");\n                background-repeat: repeat;\n            }\n            :host(.--settings-active) .glass.--settings {\n                display: block;\n                z-index: var(--settings-glass-z-index);\n            }\n            :host(.--sub-settings-active) .glass.--sub-settings {\n                display: block;\n                z-index: var(--sub-settings-glass-z-index);\n            }\n\n            .settings,\n            .sub-settings {\n                position: absolute;\n                z-index: var(--settings-z-index);\n                left: 0;\n                top: 0;\n                width: calc(100vw - 50px);\n                max-width: 500px;\n                height: 100%;\n                min-height: 100vh;\n                overflow: auto;\n                background-color: var(--white);\n                transform: translateX(-100%);\n                transition: all ").concat(transitionSpeedInMillis, "ms;\n            }\n            :host(.--settings-active) .settings {\n                transform: translateX(0);\n                box-shadow: var(--box-shadow);\n            }\n            .settings-grid {\n                display: grid;\n                grid-gap: 10px;\n                padding: 10px;\n                grid-template-rows: repeat(8, auto) 1fr;\n                min-height: 100vh;\n            }\n            .settings__control {\n                display: grid;\n                grid-template-columns: 1fr auto;\n                grid-gap: 10px;\n                align-items: center;\n                min-height: 55px;\n                padding: 10px;\n                background-color: var(--whitesmoke);\n            }\n            .settings-control-name {\n                display: grid;\n                grid-template-rows: repeat(2, auto);\n            }\n            .settings__control.--sub-settings .settings-control-name {\n                justify-self: end;\n            }\n            .settings-control-name__title {\n                color: var(--gray);\n            }\n            .settings-control-name__subtitle {\n                color: var(--gray);\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n            }\n            .settings__version-info {\n                align-self: end;\n                color: var(--gray);\n                font-size: .9em;\n            }\n            .settings__version-info a {\n                color: var(--gray);\n            }\n            .settings__attribution {\n                display: grid;\n                grid-template-columns: repeat(2, 1fr);\n            }\n            .settings__attribution img {\n                max-width: 100%;\n                height: auto;\n                background-color: var(--gray);\n            }\n\n            .sub-settings {\n                z-index: var(--sub-settings-z-index);\n                left: auto;\n                right: 0;\n                transform: translateX(100%);\n                box-shadow: none;\n            }\n            :host(.--sub-settings-active) .sub-settings {\n                transform: translateX(0);\n                box-shadow: var(--box-shadow);\n            }\n\n            .map iframe {\n                width: 100%;\n                background-color: var(--palegray);\n            }\n\n            .location-info {\n                display: flex;\n                flex-direction: column;\n            }\n            .location-info.--user-location {\n                padding: 10px;\n                border: dashed 6px var(--lightgray);\n                color: var(--gray);\n            }\n            .location-info-link {\n                margin-top: 10px;\n            }\n\n            .forecast-carousel-standard,\n            .forecast-carousel-extended {\n                animation: hide-carousel 50ms linear both;\n            }\n            :host(.--active-carousel-forecast.--forecast-display-mode-standard) .forecast-carousel-standard {\n               animation: none;\n            }\n            :host(.--active-carousel-forecast.--forecast-display-mode-extended) .forecast-carousel-extended {\n                animation: none;\n            }\n\n            .forecast-header {\n                position: fixed;\n                left: 0;\n                top: 70px;\n                z-index: var(--forecast-header-z-index);\n                width: 100%;\n                max-width: var(--max-width);\n                max-height: var(--forecast-header-height);\n                display: grid;\n                grid-gap: 10px;\n                padding: 10px 10px 0 10px;\n                background-color: var(--white);\n                touch-action: none;\n            }\n            :host(:not(.--active-carousel-forecast)) .forecast-header {\n                display: none;\n            }\n            .forecast-header-info-grid {\n                display: grid;\n                grid-template-columns: 1fr auto;\n                grid-gap: 10px;\n                align-items: center;\n                border-left: solid 10px var(--lightgray);\n            }\n            .forecast-header-info-grid.--red {\n                border-color: var(--red);\n            }\n            .forecast-header-info-grid.--amber {\n                border-color: orange;\n            }\n            .forecast-header-info-grid.--green {\n                border-color: var(--green);\n            }\n            .forecast-header-info-grid-date {\n                display: flex;\n                align-items: center;\n                justify-content: left;\n                margin-left: 10px;\n            }\n            .forecast-header-info-grid-date__date-string {\n                margin-left: 5px;\n            }\n            .forecast-header-info-grid__temperature {\n                display: block;\n            }\n            .forecast-header-info-grid__temperature h3 {\n                font-weight: normal;\n            }\n            .forecast-header-info-grid__summary {\n                grid-row: 2;\n                grid-column: 1 / span 2;\n                margin-left: 10px;\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n            }\n\n            .daylight-hours-indicator {\n                display: grid;\n                grid-template-columns: auto 1fr auto;\n                background-color: var(--white);\n            }\n            .daylight-hours-indicator__section {\n                display: flex;\n                align-items: center;\n                padding: 5px;\n                font-weight: normal;\n            }\n            .daylight-hours-indicator__section.--sunrise {\n                justify-content: flex-end;\n            }\n            .daylight-hours-indicator__daylight {\n                align-self: center;\n                height: 15px;\n                background-color: var(--paleyellow);\n                border: solid 2px var(--black);\n            }\n\n            .forecast-grid {\n                display: grid;\n                grid-row-gap: 10px;\n                min-height: calc(100vh - var(--header-height) - var(--forecast-header-height) - var(--last-updated-info-height));\n                padding: 10px;\n            }\n            .forecast-grid-hours {\n                display: grid;\n                grid-row-gap: 10px;\n            }\n            .forecast-grid-hour {\n                position: relative;\n                display: grid;\n                grid-template-columns: 1fr auto;\n                grid-template-rows: 1fr auto;\n                grid-column-gap: 10px;\n            }\n            .forecast-grid.--extended .forecast-grid-hour {\n                grid-template-rows: auto;\n            }\n            :host(:not(.--include-nighttime)) .forecast-grid-hour.--not-daylight {\n                filter: grayscale(1);\n            }\n            .forecast-grid-hour__not-daylight-mesh {\n                grid-row: 1;\n                grid-column: 1 / span 2;\n            }\n            :host(:not(.--include-nighttime)) .forecast-grid-hour.--not-daylight .forecast-grid-hour__not-daylight-mesh {\n                position: absolute;\n                z-index: 2;\n                left: 0;\n                top: 0;\n                width: 100%;\n                height: 100%;\n                background-image: url(").concat(this._backgroundImageForMesh, ");\n                background-repeat: repeat;\n            }\n            .forecast-grid-hour__photo {\n                grid-column: 1 / span 2;\n                grid-row: 1;\n                background-position: 75% center;\n                background-size: cover;\n                background-repeat: no-repeat;\n            }\n            .forecast-grid-hour.--not-daylight .forecast-grid-hour__photo {\n                filter: grayscale(1);\n            }\n            .forecast-grid.--extended .forecast-grid-hour__photo {\n                grid-column: 1;\n                background-position: 40% center;\n            }\n            .forecast-grid-hour-time-container {\n                z-index: 1;\n                margin: 0 0 10px 10px;\n                background-color: var(--translucentwhite);\n                color: var(--charcoal);\n                grid-column: 1;\n                grid-row: 1;\n                padding: 10px;\n                justify-self: left;\n                display: flex;\n                align-items: flex-end;\n            }\n            .forecast-grid-hour-time-container__time {\n                border-bottom: solid 12px var(--lightgray);\n            }\n            .forecast-grid-hour-time-container__time.--red {\n                border-color: var(--red);\n            }\n            .forecast-grid-hour-time-container__time.--amber {\n                border-color: var(--amber);\n            }\n            .forecast-grid-hour-time-container__time.--green {\n                border-color: var(--green);\n            }\n            .forecast-grid-hour__summary {\n                display: block;\n                grid-row: 2;\n                padding: 10px 0;\n            }\n            .forecast-grid.--extended .forecast-grid-hour__summary {\n                display: none;\n            }\n\n            .forecast-data-grid {\n                z-index: 1;\n                grid-column: 2;\n                grid-row: 1 / span 2;\n                display: grid;\n                grid-template-columns: repeat(3, minmax(55px, auto));\n                grid-template-rows: repeat(2, auto);\n                grid-column-gap: 5px;\n                align-self: end;\n            }\n            .forecast-grid.--extended .forecast-data-grid {\n                background-color: var(--palegray);\n                grid-row: 1;\n            }\n\n            .forecast-data-grid-type {\n                display: grid;\n                grid-gap: 5px;\n                justify-items: center;\n                align-items: center;\n                background: var(--translucentwhite);\n                padding: 10px;\n            }\n            .forecast-data-grid-type.--landscape-only {\n                display: none;\n            }\n            .forecast-data-grid-type__icon.--red {\n                --zooduck-icon-color: var(--red);\n            }\n            .forecast-data-grid-type__icon.--amber {\n                --zooduck-icon-color: var(--amber);\n            }\n            .forecast-data-grid-type__icon.--green {\n                --zooduck-icon-color: var(--green);\n            }\n            .forecast-data-grid__data {\n                display: flex;\n                flex-direction: column;\n                justify-content: center;\n                align-items: center;\n                padding: 10px;\n            }\n            .forecast-data-grid__data.--landscape-only {\n                display: none;\n            }\n            .forecast-data-grid__data.--red {\n                background-color: var(--red);\n                color: var(--white);\n            }\n            .forecast-data-grid__data.--amber {\n                background-color: var(--amber);\n            }\n            .forecast-data-grid__data.--green {\n                background-color: var(--green);\n                color: var(--white);\n            }\n\n            .last-updated-info {\n                display: none;\n                font-size: .75em;\n                color: var(--gray);\n                text-align: right;\n                margin-right: 10px;\n                height: var(--last-updated-info-height);\n                overflow: hidden;\n            }\n            :host(.--active-carousel-forecast) .last-updated-info {\n                display: block;\n            }\n\n            .club-list-carousel {\n                animation: hide-carousel 50ms linear both;\n            }\n\n            :host(.--active-carousel-club-list) .club-list-carousel {\n                animation: none;\n            }\n\n            .club-list-container {\n                padding: 10px;\n                cursor: default;\n                min-height: calc(100vh - var(--header-height));\n                user-select: none;\n            }\n            .club-list-container__club-list {\n                display: grid;\n                grid-row-gap: 10px;\n                list-style-type: none;\n                padding-inline-start: 0;\n            }\n            .club-list-item {\n                display: grid;\n                grid-gap: 5px;\n            }\n            .club-list-item__name {\n                cursor: pointer;\n                justify-self: left;\n            }\n            .club-list-item__name:hover {\n                text-decoration: underline;\n            }\n            .club-list-item__site-link {\n                justify-self: left;\n            }\n            .club-list-item-distance {\n                display: grid;\n                grid-template-columns: minmax(auto, 25%) auto;\n                grid-gap: 5px;\n            }\n            .club-list-item-distance__marker {\n                height: 25px;\n                background-color: var(--paleskyblue);\n            }\n            .club-list-item-distance__marker.--red {\n                background-color: var(--red);\n            }\n            .club-list-item-distance__marker.--amber {\n                background-color: var(--amber);\n            }\n            .club-list-item-distance__marker.--green {\n                background-color: var(--green);\n            }\n            .club-list-item-distance__miles {\n                white-space: nowrap;\n                font-size: 22px;\n            }\n\n            /* iPhone 5/SE and below */\n            /* @TODO: Investigate why this media query affects Samsung Galaxy S7 Edge which has a viewport of 360/640 */\n            /* ------------------------------------------------------------------- */\n            /* This block is commented out pending investigation (see above) */\n            /* ------------------------------------------------------------------- */\n            /* COMMENT_OUT_BLOCK_START\n            @media (min-aspect-ratio: 320/568) and (max-height: 568px) {\n                .forecast-grid .forecast-grid-hour {\n                    grid-template-rows: auto;\n                }\n                .forecast-grid .forecast-grid-hour__photo {\n                    grid-column: 1;\n                    background-position: 40% center;\n                }\n                .forecast-grid .forecast-grid-hour__summary {\n                    display: none;\n                }\n                .forecast-grid .forecast-data-grid {\n                    background-color: var(--palegray);\n                    grid-row: 1;\n                }\n            }\n            COMMENT_OUT_BLOCK_END */\n\n            @media (min-aspect-ratio: 100/133) {\n                .forecast-grid .forecast-data-grid {\n                    background-color: transparent;\n                }\n                .forecast-grid.--extended .forecast-grid-hour__photo {\n                    min-height: 120px;\n                }\n                .forecast-grid:not(.--extended) .forecast-grid-hour__photo {\n                    min-height: 200px;\n                }\n                .forecast-grid .forecast-grid-hour__photo {\n                    grid-column: 1 / span 2;\n                    grid-row: 1;\n                    background-position: 75% center;\n                }\n                .forecast-grid .forecast-grid-hour__summary {\n                    display: block;\n                }\n                .forecast-grid .forecast-data-grid {\n                    background-color: transparent;\n                    grid-row: 1 / span 2;\n                }\n            }\n\n            @media (min-width: 450px) {\n                .forecast-data-grid {\n                    grid-template-columns: repeat(5, minmax(55px, auto));\n                }\n                .forecast-data-grid-type.--landscape-only {\n                    display: grid;\n                }\n                .forecast-data-grid__data.--landscape-only {\n                    display: flex;\n                }\n            }\n\n            @media (min-width: 824px) {\n                .header {\n                    left: calc((100% - var(--max-width)) / 2);\n                }\n                .forecast-header {\n                    left: calc((100% - var(--max-width)) / 2);\n                }\n                .loader {\n                    left: calc((100% - var(--max-width)) / 2);\n                }\n            }\n        ");
    }
  }, {
    key: "style",
    get: function get() {
      return this._style;
    }
  }]);

  return SkyduckStyle;
}();

exports.SkyduckStyle = SkyduckStyle;
},{"../utils/background-image-for-mesh":"scripts/web-components/sky-duck/utils/background-image-for-mesh.ts"}],"scripts/web-components/sky-duck/utils/add-style-and-loader.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addStyleAndLoader = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

var loader_template_1 = require("../templates/loader.template");

var skyduck_style_1 = require("../services/skyduck-style");

exports.addStyleAndLoader = function addStyleAndLoader() {
  var styleEl = getStyle.call(this);
  var loaderEl = getLoader.call(this);
  this.shadowRoot.appendChild(styleEl);
  this.shadowRoot.appendChild(loaderEl);
};

var getLoader = function getLoader() {
  var loader = new loader_template_1.LoaderTemplate().html;
  loader.addEventListener('click', function () {
    if (!stateapotamus_1.StateAPotamus.getState().error) {
      return;
    }

    stateapotamus_1.StateAPotamus.dispatch('SET_READY');
    stateapotamus_1.StateAPotamus.dispatch('SET_LOADED', {
      isLoading: false
    });
  });
  return loader;
};

var getStyle = function getStyle() {
  var style = new skyduck_style_1.SkyduckStyle({
    transitionSpeedInMillis: 250
  });
  var styleEl = document.createElement('style');
  styleEl.textContent = style.style;
  return styleEl;
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../templates/loader.template":"scripts/web-components/sky-duck/templates/loader.template.ts","../services/skyduck-style":"scripts/web-components/sky-duck/services/skyduck-style.ts"}],"scripts/web-components/sky-duck/templates/glass.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlassTemplate = void 0;

var GlassTemplate =
/*#__PURE__*/
function () {
  function GlassTemplate(id, className, eventHandler) {
    _classCallCheck(this, GlassTemplate);

    this._eventHandler = eventHandler;
    this._id = id;
    this._className = className;

    this._buildGlass();
  }

  _createClass(GlassTemplate, [{
    key: "_buildGlass",
    value: function _buildGlass() {
      var _this = this;

      this._glass = new DOMParser().parseFromString("\n            <div\n                class=\"glass --render-once ".concat(this._className, "\"\n                id=\"").concat(this._id, "\">\n            </div>\n        "), 'text/html').body.firstChild;

      if (!this._eventHandler) {
        return;
      }

      this._glass.addEventListener('click', function (e) {
        _this._eventHandler(e);
      });
    }
  }, {
    key: "html",
    get: function get() {
      return this._glass;
    }
  }]);

  return GlassTemplate;
}();

exports.GlassTemplate = GlassTemplate;
},{}],"scripts/web-components/sky-duck/templates/sub-settings.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubSettingsTemplate = void 0;

var SubSettingsTemplate =
/*#__PURE__*/
function () {
  function SubSettingsTemplate() {
    _classCallCheck(this, SubSettingsTemplate);

    this._buildSubSettings();
  }

  _createClass(SubSettingsTemplate, [{
    key: "_buildSubSettings",
    value: function _buildSubSettings() {
      this._subSettings = new DOMParser().parseFromString("\n            <div\n                class=\"sub-settings --render-once\"\n                id=\"subSettings\">\n                <div class=\"settings-grid\"></div>\n            </div>\n        ", 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._subSettings;
    }
  }]);

  return SubSettingsTemplate;
}();

exports.SubSettingsTemplate = SubSettingsTemplate;
},{}],"scripts/web-components/sky-duck/utils/add-settings.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSettings = void 0;

var glass_template_1 = require("../templates/glass.template");

var settings_template_1 = require("../templates/settings.template");

var sub_settings_template_1 = require("../templates/sub-settings.template");

var general_event_handlers_1 = require("../event-handlers/general.event-handlers");

var settings_page_event_handlers_1 = require("../event-handlers/settings-page.event-handlers");

exports.addSettings = function addSettings() {
  var settingsEl = getSettings.call(this);
  var settingsGlassEl = getSettingsGlass.call(this);
  var subSettingsEl = getSubSettings.call(this);
  var subSettingsGlassEl = getSubSettingsGlass.call(this);
  this.shadowRoot.appendChild(settingsGlassEl);
  this.shadowRoot.appendChild(settingsEl);
  this.shadowRoot.appendChild(subSettingsGlassEl);
  this.shadowRoot.appendChild(subSettingsEl);
};

var getSettings = function getSettings() {
  var eventHandlers = settings_page_event_handlers_1.settingsPageEventHandlers.call(this);
  return new settings_template_1.SettingsTemplate(eventHandlers).html;
};

var getSettingsGlass = function getSettingsGlass() {
  var eventHandler = general_event_handlers_1.generalEventHandlers.call(this).toggleSettingsHandler;
  return new glass_template_1.GlassTemplate('settingsGlass', '--settings', eventHandler).html;
};

var getSubSettings = function getSubSettings() {
  return new sub_settings_template_1.SubSettingsTemplate().html;
};

var getSubSettingsGlass = function getSubSettingsGlass() {
  var eventHandler = general_event_handlers_1.generalEventHandlers.call(this).toggleSubSettingsHandler;
  return new glass_template_1.GlassTemplate('subSettingsGlass', '--sub-settings', eventHandler).html;
};
},{"../templates/glass.template":"scripts/web-components/sky-duck/templates/glass.template.ts","../templates/settings.template":"scripts/web-components/sky-duck/templates/settings.template.ts","../templates/sub-settings.template":"scripts/web-components/sky-duck/templates/sub-settings.template.ts","../event-handlers/general.event-handlers":"scripts/web-components/sky-duck/event-handlers/general.event-handlers.ts","../event-handlers/settings-page.event-handlers":"scripts/web-components/sky-duck/event-handlers/settings-page.event-handlers.ts"}],"scripts/web-components/sky-duck/utils/wait/wait.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wait = void 0;

exports.wait = function () {
  var delayInMillis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new Promise(function (res) {
    return setTimeout(res, delayInMillis);
  });
};
},{}],"scripts/web-components/sky-duck/utils/on-first-load.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onFirstLoad = void 0;

var add_style_and_loader_1 = require("./add-style-and-loader");

var add_settings_1 = require("./add-settings");

var wait_1 = require("./wait/wait");

var firstLoadDelayMillis = 5000;

exports.onFirstLoad = function onFirstLoad() {
  return __awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            add_style_and_loader_1.addStyleAndLoader.call(this);
            add_settings_1.addSettings.call(this);
            _context.next = 4;
            return wait_1.wait(firstLoadDelayMillis);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};
},{"./add-style-and-loader":"scripts/web-components/sky-duck/utils/add-style-and-loader.ts","./add-settings":"scripts/web-components/sky-duck/utils/add-settings.ts","./wait/wait":"scripts/web-components/sky-duck/utils/wait/wait.ts"}],"scripts/web-components/sky-duck/utils/set-loader-error.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLoaderError = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

exports.setLoaderError = function setLoaderError() {
  var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
      error = _stateapotamus_1$Stat.error;

  if (!error) {
    return;
  }

  this.classList.add(this._modifierClasses.error);
  var skyduckLoaderErrorEl = this.shadowRoot.querySelector('skyduck-loader-error');
  skyduckLoaderErrorEl.setAttribute('message', error);
  skyduckLoaderErrorEl.setAttribute('active', '');
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/utils/set-basic-content-on-error.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBasicContentOnError = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

var general_event_handlers_1 = require("../event-handlers/general.event-handlers");

var skyduck_elements_1 = require("../services/skyduck-elements");

var on_first_load_1 = require("./on-first-load");

var set_loader_error_1 = require("./set-loader-error");

exports.setBasicContentOnError = function setBasicContentOnError() {
  return __awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var _stateapotamus_1$Stat, error, hasLoaded, weatherElements, headerPlaceholder, header, forecastHeader, clubList;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(), error = _stateapotamus_1$Stat.error, hasLoaded = _stateapotamus_1$Stat.hasLoaded;

            if (!hasLoaded) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return");

          case 3:
            _context.next = 5;
            return on_first_load_1.onFirstLoad.call(this);

          case 5:
            set_loader_error_1.setLoaderError.call(this);
            weatherElements = new skyduck_elements_1.SkyduckElements(general_event_handlers_1.generalEventHandlers.call(this));
            headerPlaceholder = weatherElements.headerPlaceholder, header = weatherElements.header, forecastHeader = weatherElements.forecastHeader, clubList = weatherElements.clubList;
            this.shadowRoot.appendChild(headerPlaceholder);
            this.shadowRoot.appendChild(header);
            this.shadowRoot.appendChild(forecastHeader);
            this.shadowRoot.appendChild(clubList);
            stateapotamus_1.StateAPotamus.dispatch('HAS_LOADED', {
              hasLoaded: true
            });

            if (!error) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return");

          case 15:
            stateapotamus_1.StateAPotamus.dispatch('SET_READY');
            stateapotamus_1.StateAPotamus.dispatch('SET_LOADED', {
              isLoading: false
            });

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../event-handlers/general.event-handlers":"scripts/web-components/sky-duck/event-handlers/general.event-handlers.ts","../services/skyduck-elements":"scripts/web-components/sky-duck/services/skyduck-elements.ts","./on-first-load":"scripts/web-components/sky-duck/utils/on-first-load.ts","./set-loader-error":"scripts/web-components/sky-duck/utils/set-loader-error.ts"}],"scripts/web-components/sky-duck/utils/revert-content-on-error.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.revertContentOnError = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

var set_basic_content_on_error_1 = require("./set-basic-content-on-error");

var set_loader_error_1 = require("./set-loader-error");

exports.revertContentOnError = function revertContentOnError() {
  var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
      hasLoaded = _stateapotamus_1$Stat.hasLoaded;

  if (hasLoaded) {
    set_loader_error_1.setLoaderError.call(this);
    stateapotamus_1.StateAPotamus.dispatch('SET_LOADING', {
      isLoading: true
    });
    return;
  }

  set_basic_content_on_error_1.setBasicContentOnError.call(this);
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","./set-basic-content-on-error":"scripts/web-components/sky-duck/utils/set-basic-content-on-error.ts","./set-loader-error":"scripts/web-components/sky-duck/utils/set-loader-error.ts"}],"scripts/web-components/sky-duck/utils/reset-modifier-classes.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetModifierClasses = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

exports.resetModifierClasses = function resetModifierClasses() {
  var _this = this;

  var excludedClasses = [this._modifierClasses.includeNighttimeWeather, this._modifierClasses.loading, this._modifierClasses.settingsActive, this._modifierClasses.subSettingsActive, this._modifierClasses.userDeniedGeolocation];
  Object.keys(this._modifierClasses).forEach(function (key) {
    var modifierClassToRemove = _this._modifierClasses[key];

    if (excludedClasses.includes(modifierClassToRemove)) {
      return;
    }

    _this.classList.remove(modifierClassToRemove);
  });
  var activeCarouselModifier = stateapotamus_1.StateAPotamus.getState().settings.activeCarousel === 'club-list' ? this._modifierClasses.activeCarouselClubList : this._modifierClasses.activeCarouselForecast;
  var forecastDisplayModeModifier = stateapotamus_1.StateAPotamus.getState().settings.forecastDisplayMode === 'extended' ? this._modifierClasses.forecastDisplayModeExtended : this._modifierClasses.forecastDisplayModeStandard;
  this.classList.add(activeCarouselModifier);
  this.classList.add(forecastDisplayModeModifier);
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/utils/get-club-data.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClubData = void 0;

var escape_special_chars_1 = require("./escape-special-chars");

var stateapotamus_1 = require("../state/stateapotamus");

exports.getClubData = function getClubData() {
  var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
      club = _stateapotamus_1$Stat.club,
      clubs = _stateapotamus_1$Stat.clubs;

  if (!club || !clubs) {
    return;
  }

  var clubEscaped = escape_special_chars_1.escapeSpecialChars(club);
  return clubs.find(function (club) {
    return new RegExp(clubEscaped, 'i').test(club.name);
  });
};
},{"./escape-special-chars":"scripts/web-components/sky-duck/utils/escape-special-chars.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/utils/load-image.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadImage = void 0;

exports.loadImage = function (src) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = resolve;
    img.src = src;
  });
};
},{}],"scripts/web-components/sky-duck/utils/get-images.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImages = void 0;

var image_map_1 = require("./image-map");

var load_image_1 = require("./load-image");

var stateapotamus_1 = require("../state/stateapotamus");

exports.getImages = function getImages() {
  return __awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var _this = this;

    var imagesLoaded;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            imagesLoaded = [];
            return _context2.abrupt("return", new Promise(function (resolve) {
              var imageLinks = Object.keys(image_map_1.imageMap).map(function (key) {
                return {
                  key: key,
                  url: image_map_1.imageMap[key]
                };
              });
              imageLinks.forEach(function (link) {
                return __awaiter(_this, void 0, void 0,
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
                          _context.next = 3;
                          return load_image_1.loadImage(link.url);

                        case 3:
                          _context.next = 8;
                          break;

                        case 5:
                          _context.prev = 5;
                          _context.t0 = _context["catch"](0);
                          console.error(_context.t0); // eslint-disable-line no-console

                        case 8:
                          _context.prev = 8;
                          imagesLoaded.push(link.url);
                          return _context.finish(8);

                        case 11:
                          if (imagesLoaded.length === imageLinks.length) {
                            stateapotamus_1.StateAPotamus.dispatch('IMAGES_READY', {
                              imagesReady: true
                            });
                            resolve();
                          }

                        case 12:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, null, [[0, 5, 8, 11]]);
                }));
              });
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
};
},{"./image-map":"scripts/web-components/sky-duck/utils/image-map.ts","./load-image":"scripts/web-components/sky-duck/utils/load-image.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/utils/clear-content.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearContent = void 0;

exports.clearContent = function clearContent() {
  var nodesToRemove = Array.from(this.shadowRoot.children).filter(function (child) {
    var isStyleTag = /style/i.test(child.nodeName);
    var isRenderOnce = child.classList.contains('--render-once');
    return !isStyleTag && !isRenderOnce;
  });
  nodesToRemove.forEach(function (node) {
    node.parentNode.removeChild(node);
  });
};
},{}],"scripts/web-components/sky-duck/utils/set-content.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setContent = void 0;

var stateapotamus_1 = require("../state/stateapotamus");

var get_images_1 = require("./get-images");

var on_first_load_1 = require("./on-first-load");

var clear_content_1 = require("./clear-content");

var general_event_handlers_1 = require("../event-handlers/general.event-handlers");

var wait_1 = require("./wait/wait");

var skyduck_elements_1 = require("../services/skyduck-elements");

var set_loader_error_1 = require("./set-loader-error");

exports.setContent = function setContent() {
  return __awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var _stateapotamus_1$Stat, error, hasLoaded, imagesReady, weatherElements, forecast, forecastExtended, lastUpdatedInfo, headerPlaceholder, header, forecastHeader, clubList, SKYDUCK_INTERVAL_LOADER_REMOVE_LAYERS_ANIMATION_MILLIS;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(), error = _stateapotamus_1$Stat.error, hasLoaded = _stateapotamus_1$Stat.hasLoaded, imagesReady = _stateapotamus_1$Stat.imagesReady;

            if (hasLoaded) {
              _context.next = 4;
              break;
            }

            _context.next = 4;
            return on_first_load_1.onFirstLoad.call(this);

          case 4:
            if (!error) {
              _context.next = 7;
              break;
            }

            set_loader_error_1.setLoaderError.call(this);
            return _context.abrupt("return");

          case 7:
            if (imagesReady) {
              _context.next = 10;
              break;
            }

            _context.next = 10;
            return get_images_1.getImages();

          case 10:
            if (!hasLoaded) {
              _context.next = 14;
              break;
            }

            _context.next = 13;
            return wait_1.wait(1750);

          case 13:
            // Minimum loader time
            clear_content_1.clearContent.call(this);

          case 14:
            weatherElements = new skyduck_elements_1.SkyduckElements(general_event_handlers_1.generalEventHandlers.call(this));
            forecast = weatherElements.forecast, forecastExtended = weatherElements.forecastExtended, lastUpdatedInfo = weatherElements.lastUpdatedInfo;

            if (!hasLoaded) {
              // Render once only
              headerPlaceholder = weatherElements.headerPlaceholder, header = weatherElements.header, forecastHeader = weatherElements.forecastHeader, clubList = weatherElements.clubList;
              this.shadowRoot.appendChild(headerPlaceholder);
              this.shadowRoot.appendChild(header);
              this.shadowRoot.appendChild(forecastHeader);
              this.shadowRoot.appendChild(clubList);
            }

            this.shadowRoot.appendChild(forecast);
            this.shadowRoot.appendChild(forecastExtended);
            this.shadowRoot.appendChild(lastUpdatedInfo);

            if (!hasLoaded) {
              stateapotamus_1.StateAPotamus.dispatch('HAS_LOADED', {
                hasLoaded: true
              });
            } // Give content a chance to render before removing loader
            // ==========================================================
            // @NOTE: This is necessary to prevent any stuttering effect
            // from happening with the animation that removes the loader
            // ==========================================================


            _context.next = 23;
            return wait_1.wait(250);

          case 23:
            stateapotamus_1.StateAPotamus.dispatch('SET_READY');

            if (!hasLoaded) {
              _context.next = 29;
              break;
            }

            SKYDUCK_INTERVAL_LOADER_REMOVE_LAYERS_ANIMATION_MILLIS = 750;
            this.shadowRoot.querySelector('skyduck-interval-loader').setAttribute('loaded', '');
            _context.next = 29;
            return wait_1.wait(SKYDUCK_INTERVAL_LOADER_REMOVE_LAYERS_ANIMATION_MILLIS);

          case 29:
            stateapotamus_1.StateAPotamus.dispatch('SET_LOADED', {
              isLoading: false
            });

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};
},{"../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","./get-images":"scripts/web-components/sky-duck/utils/get-images.ts","./on-first-load":"scripts/web-components/sky-duck/utils/on-first-load.ts","./clear-content":"scripts/web-components/sky-duck/utils/clear-content.ts","../event-handlers/general.event-handlers":"scripts/web-components/sky-duck/event-handlers/general.event-handlers.ts","./wait/wait":"scripts/web-components/sky-duck/utils/wait/wait.ts","../services/skyduck-elements":"scripts/web-components/sky-duck/services/skyduck-elements.ts","./set-loader-error":"scripts/web-components/sky-duck/utils/set-loader-error.ts"}],"scripts/web-components/sky-duck/event-handlers/sub-settings-location-settings.event-handlers.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subSettingsLocationSettingsEventHandlers = void 0;

var geocode_lookup_fetch_1 = require("../fetch/geocode-lookup.fetch");

var stateapotamus_1 = require("../state/stateapotamus");

var revert_content_on_error_1 = require("../utils/revert-content-on-error");

exports.subSettingsLocationSettingsEventHandlers = function subSettingsLocationSettingsEventHandlers() {
  var _this = this;

  var setCurrentLocationHandler = function setCurrentLocationHandler(e) {
    return __awaiter(_this, void 0, void 0,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var requestedLocation, geocodeData;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              requestedLocation = e.detail.value;
              _context.prev = 1;
              _context.next = 4;
              return geocode_lookup_fetch_1.geocodeLookup(requestedLocation);

            case 4:
              geocodeData = _context.sent;
              stateapotamus_1.StateAPotamus.dispatch('USER_LOCATION_CHANGE', {
                userLocation: geocodeData
              });
              _context.next = 12;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              stateapotamus_1.StateAPotamus.dispatch('ERROR', {
                error: _context.t0
              });
              revert_content_on_error_1.revertContentOnError.call(this);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 8]]);
    }));
  };

  var toggleUseGPSForCurrentLocationHandler = function toggleUseGPSForCurrentLocationHandler() {
    stateapotamus_1.StateAPotamus.dispatch('TOGGLE_USE_GPS_FOR_CURRENT_LOCATION', {
      settings: Object.assign(Object.assign({}, stateapotamus_1.StateAPotamus.getState().settings), {
        useGPSForCurrentLocation: !stateapotamus_1.StateAPotamus.getState().settings.useGPSForCurrentLocation
      })
    });
  };

  return {
    setCurrentLocationHandler: setCurrentLocationHandler.bind(this),
    toggleUseGPSForCurrentLocationHandler: toggleUseGPSForCurrentLocationHandler.bind(this)
  };
};
},{"../fetch/geocode-lookup.fetch":"scripts/web-components/sky-duck/fetch/geocode-lookup.fetch.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../utils/revert-content-on-error":"scripts/web-components/sky-duck/utils/revert-content-on-error.ts"}],"scripts/web-components/sky-duck/utils/update-forecast-header.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateForecastHeader = void 0;

var forecast_header_template_1 = require("../templates/forecast-header.template");

var stateapotamus_1 = require("../state/stateapotamus");

exports.updateForecastHeader = function updateForecastHeader() {
  var _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(),
      hasLoaded = _stateapotamus_1$Stat.hasLoaded;

  if (!hasLoaded) {
    return;
  }

  var oldForecastHeader = this.shadowRoot.querySelector('#forecastHeader');
  var newForecastHeader = new forecast_header_template_1.ForecastHeaderTemplate().html;
  oldForecastHeader.replaceWith(newForecastHeader);
};
},{"../templates/forecast-header.template":"scripts/web-components/sky-duck/templates/forecast-header.template.ts","../state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts"}],"scripts/web-components/sky-duck/state/state-actions.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateActions = void 0;

var stateapotamus_1 = require("./stateapotamus");

var geocode_lookup_fetch_1 = require("../fetch/geocode-lookup.fetch");

var sub_settings_current_location_template_1 = require("../templates/sub-settings-current-location.template");

var get_current_position_1 = require("../utils/get-current-position");

var reverse_geocode_lookup_fetch_1 = require("../fetch/reverse-geocode-lookup.fetch");

var format_address_1 = require("../utils/format-address");
/* eslint-enable no-unused-vars */


var club_list_carousel_template_1 = require("../templates/club-list-carousel.template");

var general_event_handlers_1 = require("../event-handlers/general.event-handlers");

var sort_clubs_1 = require("../utils/sort-clubs");

var update_settings_page_1 = require("../utils/update-settings-page");

var update_header_title_1 = require("../utils/update-header-title");

var get_forecast_1 = require("../utils/get-forecast");

var revert_content_on_error_1 = require("../utils/revert-content-on-error");

var reset_modifier_classes_1 = require("../utils/reset-modifier-classes");

var get_club_data_1 = require("../utils/get-club-data");

var set_content_1 = require("../utils/set-content");

var sub_settings_location_settings_event_handlers_1 = require("../event-handlers/sub-settings-location-settings.event-handlers");

var update_forecast_header_1 = require("../utils/update-forecast-header");

exports.stateActions = function stateActions() {
  var _this = this;

  return {
    CLEAR_ERROR: function CLEAR_ERROR() {
      set_content_1.setContent.call(_this);
    },
    CLUB_CHANGE: function CLUB_CHANGE() {
      return __awaiter(_this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _stateapotamus_1$Stat, club, clubs, hasLoaded, isLoading, clubData, error;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(), club = _stateapotamus_1$Stat.club, clubs = _stateapotamus_1$Stat.clubs, hasLoaded = _stateapotamus_1$Stat.hasLoaded, isLoading = _stateapotamus_1$Stat.isLoading;

                if (!(hasLoaded && isLoading)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                stateapotamus_1.StateAPotamus.dispatch('SET_LOADING', {
                  isLoading: true
                });

                if (clubs) {
                  _context.next = 7;
                  break;
                }

                revert_content_on_error_1.revertContentOnError.call(this);
                return _context.abrupt("return");

              case 7:
                clubData = get_club_data_1.getClubData();

                if (clubData) {
                  _context.next = 12;
                  break;
                }

                error = "Could not find club \"".concat(club, "\" in the Skyduck database. Try searching by location instead.");
                stateapotamus_1.StateAPotamus.dispatch('ERROR', {
                  error: error
                });
                return _context.abrupt("return");

              case 12:
                stateapotamus_1.StateAPotamus.dispatch('SET_CURRENT_CLUB', {
                  currentClub: clubData
                });
                _context.prev = 13;
                _context.next = 16;
                return get_forecast_1.getForecast.call(this);

              case 16:
                stateapotamus_1.StateAPotamus.dispatch('CLEAR_ERROR', {
                  error: null
                });
                _context.next = 23;
                break;

              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](13);
                // eslint-disable-next-line no-console
                console.error(_context.t0);
                stateapotamus_1.StateAPotamus.dispatch('ERROR', {
                  error: _context.t0
                });

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[13, 19]]);
      }));
    },
    CLUB_LIST_CAROUSEL_SLIDE_CHANGE: function CLUB_LIST_CAROUSEL_SLIDE_CHANGE() {
      if (stateapotamus_1.StateAPotamus.getState().settings.activeCarousel !== 'club-list') {
        return;
      }

      update_header_title_1.updateHeaderTitle.call(_this);
    },
    ERROR: function ERROR() {
      revert_content_on_error_1.revertContentOnError.call(_this);
      update_settings_page_1.updateSettingsPage.call(_this, 'activeCarousel');
    },
    FORECAST_CAROUSEL_SLIDE_CHANGE: function FORECAST_CAROUSEL_SLIDE_CHANGE() {
      var _stateapotamus_1$Stat2 = stateapotamus_1.StateAPotamus.getState(),
          currentForecastSlide = _stateapotamus_1$Stat2.currentForecastSlide,
          hasLoaded = _stateapotamus_1$Stat2.hasLoaded;

      [_this.shadowRoot.querySelector('#forecastCarouselStandard'), _this.shadowRoot.querySelector('#forecastCarouselExtended')].forEach(function (forecastCarousel) {
        if (forecastCarousel.currentslide === currentForecastSlide) {
          return;
        }

        forecastCarousel.currentslide = currentForecastSlide;
      });

      if (!hasLoaded) {
        return;
      }

      update_forecast_header_1.updateForecastHeader.call(_this);
    },
    GEOCODE_DATA_CHANGE: function GEOCODE_DATA_CHANGE() {// Do nothing
    },
    GET_FORECAST_BY_CLUB: function GET_FORECAST_BY_CLUB() {
      var timezone = stateapotamus_1.StateAPotamus.getState().forecast.weather.timezone;

      var _get_club_data_1$getC = get_club_data_1.getClubData(),
          name = _get_club_data_1$getC.name,
          address = _get_club_data_1$getC.place,
          site = _get_club_data_1$getC.site,
          latitude = _get_club_data_1$getC.latitude,
          longitude = _get_club_data_1$getC.longitude;

      var coords = {
        latitude: latitude,
        longitude: longitude
      };
      stateapotamus_1.StateAPotamus.dispatch('LOCATION_DETAILS_CHANGE', {
        headerSubTitle: address,
        headerTitle: name,
        locationDetails: {
          name: name,
          address: address,
          site: site,
          timezone: timezone,
          coords: coords
        },
        settings: Object.assign(Object.assign({}, stateapotamus_1.StateAPotamus.getState().settings), {
          activeCarousel: 'forecast'
        })
      });
    },
    GET_FORECAST_BY_LOCATION: function GET_FORECAST_BY_LOCATION() {
      var site = '';
      var _stateapotamus_1$Stat3 = stateapotamus_1.StateAPotamus.getState().forecast.weather,
          latitude = _stateapotamus_1$Stat3.latitude,
          longitude = _stateapotamus_1$Stat3.longitude,
          timezone = _stateapotamus_1$Stat3.timezone;
      var _stateapotamus_1$Stat4 = stateapotamus_1.StateAPotamus.getState().forecast,
          countryRegion = _stateapotamus_1$Stat4.countryRegion,
          formattedAddress = _stateapotamus_1$Stat4.formattedAddress;
      var coords = {
        latitude: latitude,
        longitude: longitude
      };
      var formattedAddressPieces = formattedAddress.split(',').map(function (piece) {
        return piece.trim();
      });

      if (!formattedAddressPieces.includes(countryRegion)) {
        formattedAddressPieces.push(countryRegion);
      }

      var name = formattedAddressPieces[0];
      var address = formattedAddressPieces.slice(1).join(', ');
      stateapotamus_1.StateAPotamus.dispatch('LOCATION_DETAILS_CHANGE', {
        headerSubTitle: address,
        headerTitle: name,
        locationDetails: {
          name: name,
          address: address,
          site: site,
          timezone: timezone,
          coords: coords
        },
        settings: Object.assign(Object.assign({}, stateapotamus_1.StateAPotamus.getState().settings), {
          activeCarousel: 'forecast'
        })
      });
    },
    HAS_LOADED: function HAS_LOADED() {
      _this.dispatchEvent(new CustomEvent('load'));
    },
    IMAGES_READY: function IMAGES_READY() {// Do nothing
    },
    LOCATION_CHANGE: function LOCATION_CHANGE() {
      var _stateapotamus_1$Stat5 = stateapotamus_1.StateAPotamus.getState(),
          hasLoaded = _stateapotamus_1$Stat5.hasLoaded,
          isLoading = _stateapotamus_1$Stat5.isLoading,
          location = _stateapotamus_1$Stat5.location;

      if (hasLoaded && isLoading) {
        return;
      }

      stateapotamus_1.StateAPotamus.dispatch('SET_LOADING', {
        isLoading: true
      });
      geocode_lookup_fetch_1.geocodeLookup(location).then(function (response) {
        return __awaiter(_this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  stateapotamus_1.StateAPotamus.dispatch('GEOCODE_DATA_CHANGE', {
                    geocodeData: response
                  });
                  _context2.prev = 1;
                  _context2.next = 4;
                  return get_forecast_1.getForecast.call(this);

                case 4:
                  stateapotamus_1.StateAPotamus.dispatch('CLEAR_ERROR', {
                    error: null
                  });
                  _context2.next = 10;
                  break;

                case 7:
                  _context2.prev = 7;
                  _context2.t0 = _context2["catch"](1);
                  stateapotamus_1.StateAPotamus.dispatch('ERROR', {
                    error: _context2.t0
                  });

                case 10:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[1, 7]]);
        }));
      }).catch(function (err) {
        stateapotamus_1.StateAPotamus.dispatch('GEOCODE_DATA_CHANGE', {
          geocodeData: null
        });
        stateapotamus_1.StateAPotamus.dispatch('ERROR', {
          error: err
        });
      });
    },
    LOCATION_DETAILS_CHANGE: function LOCATION_DETAILS_CHANGE() {
      update_header_title_1.updateHeaderTitle.call(_this);
      update_settings_page_1.updateSettingsPage.call(_this, 'locationDetails');
      update_settings_page_1.updateSettingsPage.call(_this, 'activeCarousel');
    },
    NEAREST_CLUB_CHANGE: function NEAREST_CLUB_CHANGE() {// Do nothing
    },
    SET_CLUBS: function SET_CLUBS() {
      var _stateapotamus_1$Stat6 = stateapotamus_1.StateAPotamus.getState(),
          hasLoaded = _stateapotamus_1$Stat6.hasLoaded,
          clubsSortedByCountry = _stateapotamus_1$Stat6.clubsSortedByCountry,
          clubCountries = _stateapotamus_1$Stat6.clubCountries,
          userLocation = _stateapotamus_1$Stat6.userLocation;

      if (!hasLoaded) {
        return;
      }

      var clubListCarousel = new club_list_carousel_template_1.ClubListCarouselTemplate(clubsSortedByCountry, clubCountries, userLocation, general_event_handlers_1.generalEventHandlers.call(_this).onClubListCarouselSlideChangeHandler, general_event_handlers_1.generalEventHandlers.call(_this).onClubChangeHandler).html;

      _this.shadowRoot.querySelector('#clubListCarousel').replaceWith(clubListCarousel);
    },
    SET_CURRENT_CLUB: function SET_CURRENT_CLUB() {// Do nothing
    },
    SET_LOADED: function SET_LOADED() {
      _this.classList.remove(_this._modifierClasses.loading);

      _this.shadowRoot.querySelector('skyduck-interval-loader').removeAttribute('active');
    },
    SET_LOADING: function SET_LOADING() {
      _this.classList.remove(_this._modifierClasses.ready);

      _this.classList.add(_this._modifierClasses.loading);

      var _stateapotamus_1$Stat7 = stateapotamus_1.StateAPotamus.getState(),
          hasLoaded = _stateapotamus_1$Stat7.hasLoaded;

      if (!hasLoaded) {
        return;
      }

      var skyduckIntervalLoader = _this.shadowRoot.querySelector('skyduck-interval-loader');

      skyduckIntervalLoader.setAttribute('active', '');
      skyduckIntervalLoader.removeAttribute('loaded');
    },
    SET_POSITION: function SET_POSITION() {// Do nothing
    },
    SET_READY: function SET_READY() {
      return __awaiter(_this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                reset_modifier_classes_1.resetModifierClasses.call(this);
                this.shadowRoot.querySelector('skyduck-splash-screen-loader').removeAttribute('active');
                this.shadowRoot.querySelector('skyduck-loader-error').removeAttribute('active');
                this.classList.add(this._modifierClasses.ready);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
    },
    SETUP: function SETUP() {// Do nothing
    },
    SORT_CLUBS: function SORT_CLUBS() {
      var _stateapotamus_1$Stat8 = stateapotamus_1.StateAPotamus.getState(),
          clubs = _stateapotamus_1$Stat8.clubs,
          userLocation = _stateapotamus_1$Stat8.userLocation;

      if (!clubs) {
        return;
      }

      try {
        sort_clubs_1.sortClubs(clubs, userLocation);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    TOGGLE_ACTIVE_CAROUSEL: function TOGGLE_ACTIVE_CAROUSEL() {
      [_this._modifierClasses.activeCarouselClubList, _this._modifierClasses.activeCarouselForecast].forEach(function (modifierClass) {
        _this.classList.remove(modifierClass);
      });
      var activeCarouselModifierClass = stateapotamus_1.StateAPotamus.getState().settings.activeCarousel === 'forecast' ? _this._modifierClasses.activeCarouselForecast : _this._modifierClasses.activeCarouselClubList;

      _this.classList.add(activeCarouselModifierClass);

      update_header_title_1.updateHeaderTitle.call(_this);
    },
    TOGGLE_FORECAST_DISPLAY_MODE: function TOGGLE_FORECAST_DISPLAY_MODE() {
      [_this._modifierClasses.forecastDisplayModeExtended, _this._modifierClasses.forecastDisplayModeStandard].forEach(function (modifierClass) {
        _this.classList.remove(modifierClass);
      });
      var forecastDisplayModeModifierClass = stateapotamus_1.StateAPotamus.getState().settings.forecastDisplayMode === 'extended' ? _this._modifierClasses.forecastDisplayModeExtended : _this._modifierClasses.forecastDisplayModeStandard;

      _this.classList.add(forecastDisplayModeModifierClass);

      update_settings_page_1.updateSettingsPage.call(_this, 'includeNighttimeWeather');
    },
    TOGGLE_INCLUDE_NIGHTTIME_WEATHER: function TOGGLE_INCLUDE_NIGHTTIME_WEATHER() {
      var _stateapotamus_1$Stat9 = stateapotamus_1.StateAPotamus.getState(),
          club = _stateapotamus_1$Stat9.club,
          location = _stateapotamus_1$Stat9.location;

      _this.classList.toggle(_this._modifierClasses.includeNighttimeWeather);

      if (club) {
        stateapotamus_1.StateAPotamus.dispatch('CLUB_CHANGE');
        return;
      }

      if (location) {
        stateapotamus_1.StateAPotamus.dispatch('LOCATION_CHANGE');
        return;
      }
    },
    TOGGLE_SETTINGS: function TOGGLE_SETTINGS() {
      _this.classList.toggle(_this._modifierClasses.settingsActive);
    },
    TOGGLE_SUB_SETTINGS: function TOGGLE_SUB_SETTINGS() {
      _this.classList.toggle(_this._modifierClasses.subSettingsActive);
    },
    TOGGLE_SUB_SETTINGS_LOCATION_SETTINGS: function TOGGLE_SUB_SETTINGS_LOCATION_SETTINGS() {
      var subSettings = _this.shadowRoot.querySelector('#subSettings');

      var subSettingsSettingsGrid = subSettings.querySelector('.settings-grid');

      var _sub_settings_locatio = sub_settings_location_settings_event_handlers_1.subSettingsLocationSettingsEventHandlers.call(_this),
          toggleUseGPSForCurrentLocationHandler = _sub_settings_locatio.toggleUseGPSForCurrentLocationHandler,
          setCurrentLocationHandler = _sub_settings_locatio.setCurrentLocationHandler;

      var locationSettings = new sub_settings_current_location_template_1.SubSettingsCurrentLocationTemplate(toggleUseGPSForCurrentLocationHandler, setCurrentLocationHandler.bind(_this)).html;
      subSettingsSettingsGrid.replaceWith(locationSettings);

      _this.classList.toggle(_this._modifierClasses.subSettingsActive);
    },
    TOGGLE_USE_GPS_FOR_CURRENT_LOCATION: function TOGGLE_USE_GPS_FOR_CURRENT_LOCATION() {
      return __awaiter(_this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var setCurrentLocationInput, position, geocodeData;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                setCurrentLocationInput = this.shadowRoot.querySelector('#setCurrentLocationInput');
                setCurrentLocationInput.disabled = stateapotamus_1.StateAPotamus.getState().settings.useGPSForCurrentLocation;

                if (!stateapotamus_1.StateAPotamus.getState().settings.useGPSForCurrentLocation) {
                  _context4.next = 17;
                  break;
                }

                _context4.prev = 3;
                _context4.next = 6;
                return get_current_position_1.getCurrentPosition();

              case 6:
                position = _context4.sent;
                stateapotamus_1.StateAPotamus.dispatch('SET_POSITION', {
                  position: position
                });
                _context4.next = 10;
                return reverse_geocode_lookup_fetch_1.reverseGeocodeLookup(stateapotamus_1.StateAPotamus.getState().position.coords);

              case 10:
                geocodeData = _context4.sent;
                stateapotamus_1.StateAPotamus.dispatch('USER_LOCATION_CHANGE', {
                  userLocation: geocodeData
                });
                _context4.next = 17;
                break;

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4["catch"](3);
                // eslint-disable-next-line no-console
                console.error(_context4.t0);

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 14]]);
      }));
    },
    USER_LOCATION_CHANGE: function USER_LOCATION_CHANGE() {
      update_settings_page_1.updateSettingsPage.call(_this, 'userLocation');

      var _stateapotamus_1$Stat10 = stateapotamus_1.StateAPotamus.getState(),
          hasLoaded = _stateapotamus_1$Stat10.hasLoaded;

      if (hasLoaded) {
        stateapotamus_1.StateAPotamus.dispatch('SORT_CLUBS');
      }

      var currentLocationDetails = _this.shadowRoot.querySelector('#currentLocationDetails');

      var setCurrentLocationInput = _this.shadowRoot.querySelector('#setCurrentLocationInput');

      if (!currentLocationDetails || !setCurrentLocationInput) {
        return;
      }

      currentLocationDetails.innerHTML = format_address_1.formatAddress(stateapotamus_1.StateAPotamus.getState().userLocation.name);
      setCurrentLocationInput.value = '';
    },
    USER_DENIED_GEOLOCATION: function USER_DENIED_GEOLOCATION() {// Do nothing
    }
  };
};
},{"./stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","../fetch/geocode-lookup.fetch":"scripts/web-components/sky-duck/fetch/geocode-lookup.fetch.ts","../templates/sub-settings-current-location.template":"scripts/web-components/sky-duck/templates/sub-settings-current-location.template.ts","../utils/get-current-position":"scripts/web-components/sky-duck/utils/get-current-position.ts","../fetch/reverse-geocode-lookup.fetch":"scripts/web-components/sky-duck/fetch/reverse-geocode-lookup.fetch.ts","../utils/format-address":"scripts/web-components/sky-duck/utils/format-address.ts","../templates/club-list-carousel.template":"scripts/web-components/sky-duck/templates/club-list-carousel.template.ts","../event-handlers/general.event-handlers":"scripts/web-components/sky-duck/event-handlers/general.event-handlers.ts","../utils/sort-clubs":"scripts/web-components/sky-duck/utils/sort-clubs.ts","../utils/update-settings-page":"scripts/web-components/sky-duck/utils/update-settings-page.ts","../utils/update-header-title":"scripts/web-components/sky-duck/utils/update-header-title.ts","../utils/get-forecast":"scripts/web-components/sky-duck/utils/get-forecast.ts","../utils/revert-content-on-error":"scripts/web-components/sky-duck/utils/revert-content-on-error.ts","../utils/reset-modifier-classes":"scripts/web-components/sky-duck/utils/reset-modifier-classes.ts","../utils/get-club-data":"scripts/web-components/sky-duck/utils/get-club-data.ts","../utils/set-content":"scripts/web-components/sky-duck/utils/set-content.ts","../event-handlers/sub-settings-location-settings.event-handlers":"scripts/web-components/sky-duck/event-handlers/sub-settings-location-settings.event-handlers.ts","../utils/update-forecast-header":"scripts/web-components/sky-duck/utils/update-forecast-header.ts"}],"scripts/web-components/sky-duck/fetch/version.fetch.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = void 0;

exports.version = function () {
  return __awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var versionResponse, version;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch('/version');

          case 2:
            versionResponse = _context.sent;
            _context.next = 5;
            return versionResponse.text();

          case 5:
            version = _context.sent;
            return _context.abrupt("return", version);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
};
},{}],"scripts/web-components/sky-duck/skyduck.component.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-enable no-unused-vars */

var reverse_geocode_lookup_fetch_1 = require("./fetch/reverse-geocode-lookup.fetch");

var skydive_clubs_fetch_1 = require("./fetch/skydive-clubs.fetch");

var get_current_position_1 = require("./utils/get-current-position");

var log_fetch_1 = require("./fetch/log.fetch");

var modifier_classes_1 = require("./utils/modifier-classes");

var state_1 = require("./state/state");

var stateapotamus_1 = require("./state/stateapotamus");

var google_maps_key_lookup_fetch_1 = require("./fetch/google-maps-key-lookup.fetch");

var state_actions_1 = require("./state/state-actions");

var version_fetch_1 = require("./fetch/version.fetch");

var tagName = 'zooduck-skyduck';
/* eslint-enable */

var HTMLZooduckSkyduckElement =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(HTMLZooduckSkyduckElement, _HTMLElement);

  var _super = _createSuper(HTMLZooduckSkyduckElement);

  function HTMLZooduckSkyduckElement() {
    var _this;

    _classCallCheck(this, HTMLZooduckSkyduckElement);

    _this = _super.call(this);

    _this.attachShadow({
      mode: 'open'
    });

    _this._defaultClub = 'Skydive Algarve';
    _this._modifierClasses = modifier_classes_1.modifierClasses;
    stateapotamus_1.StateAPotamus.setState(Object.assign({}, state_1.state));

    _this._registerActions();

    return _this;
  }

  _createClass(HTMLZooduckSkyduckElement, [{
    key: "_initClubs",
    value: function _initClubs() {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _stateapotamus_1$Stat, clubs, _clubs;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _stateapotamus_1$Stat = stateapotamus_1.StateAPotamus.getState(), clubs = _stateapotamus_1$Stat.clubs;

                if (!clubs) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                _context.prev = 3;
                _context.next = 6;
                return skydive_clubs_fetch_1.skydiveClubsLookup();

              case 6:
                _clubs = _context.sent;
                stateapotamus_1.StateAPotamus.dispatch('SORT_CLUBS', {
                  clubs: _clubs
                });
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](3);
                // eslint-disable-next-line no-console
                console.error(_context.t0);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 10]]);
      }));
    }
  }, {
    key: "_logConnection",
    value: function _logConnection() {
      try {
        var _stateapotamus_1$Stat2 = stateapotamus_1.StateAPotamus.getState(),
            userLocation = _stateapotamus_1$Stat2.userLocation;

        if (!userLocation) {
          return;
        }

        var log = new log_fetch_1.Log(userLocation.name);
        log.connection();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  }, {
    key: "_syncStringAttr",
    value: function _syncStringAttr(name, val) {
      if (this.getAttribute(name) === val) {
        return;
      }

      this.setAttribute(name, val);
    }
  }, {
    key: "_init",
    value: function _init() {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _stateapotamus_1$Stat3, hasLoaded, setupStarted;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _stateapotamus_1$Stat3 = stateapotamus_1.StateAPotamus.getState(), hasLoaded = _stateapotamus_1$Stat3.hasLoaded, setupStarted = _stateapotamus_1$Stat3.setupStarted;

                if (!(hasLoaded || setupStarted)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                _context2.next = 5;
                return this._setup();

              case 5:
                this.classList.add(this._modifierClasses.init);
                stateapotamus_1.StateAPotamus.dispatch('SET_LOADING', {
                  isLoading: true
                });

                this._initClubOrLocation();

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: "_initClubOrLocation",
    value: function _initClubOrLocation() {
      if (this._club || this._location) {
        return;
      }

      var _stateapotamus_1$Stat4 = stateapotamus_1.StateAPotamus.getState(),
          nearestClub = _stateapotamus_1$Stat4.nearestClub,
          userLocation = _stateapotamus_1$Stat4.userLocation;

      if (!nearestClub && userLocation) {
        this.location = userLocation.name;
        return;
      }

      this.club = nearestClub ? nearestClub.name : this._defaultClub;
    }
  }, {
    key: "_registerActions",
    value: function _registerActions() {
      var actions = state_actions_1.stateActions.call(this);
      Object.keys(actions).forEach(function (action) {
        var actionCallback = actions[action];
        stateapotamus_1.StateAPotamus.listen(action, actionCallback);
      });
    }
  }, {
    key: "_setup",
    value: function _setup() {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var _stateapotamus_1$Stat5, setupStarted, skyduckVersion, googleMapsKey, position, coords, geocodeData;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _stateapotamus_1$Stat5 = stateapotamus_1.StateAPotamus.getState(), setupStarted = _stateapotamus_1$Stat5.setupStarted;

                if (!setupStarted) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                _context3.next = 5;
                return version_fetch_1.version();

              case 5:
                skyduckVersion = _context3.sent;
                _context3.next = 8;
                return google_maps_key_lookup_fetch_1.googleMapsKeyLookup();

              case 8:
                googleMapsKey = _context3.sent;
                _context3.prev = 9;
                _context3.next = 12;
                return get_current_position_1.getCurrentPosition();

              case 12:
                position = _context3.sent;
                stateapotamus_1.StateAPotamus.dispatch('SET_POSITION', {
                  position: position
                });
                coords = stateapotamus_1.StateAPotamus.getState().position.coords;
                _context3.next = 17;
                return reverse_geocode_lookup_fetch_1.reverseGeocodeLookup(coords);

              case 17:
                geocodeData = _context3.sent;
                stateapotamus_1.StateAPotamus.dispatch('USER_LOCATION_CHANGE', {
                  userLocation: geocodeData,
                  userDeniedGeolocation: false
                });

                this._logConnection();

                _context3.next = 26;
                break;

              case 22:
                _context3.prev = 22;
                _context3.t0 = _context3["catch"](9);
                console.warn(_context3.t0); // eslint-disable-line no-console

                stateapotamus_1.StateAPotamus.dispatch('USER_DENIED_GEOLOCATION', {
                  userDeniedGeolocation: true
                });

              case 26:
                _context3.next = 28;
                return this._initClubs();

              case 28:
                stateapotamus_1.StateAPotamus.dispatch('SETUP', {
                  version: skyduckVersion,
                  googleMapsKey: googleMapsKey,
                  setupStarted: true
                });

              case 29:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[9, 22]]);
      }));
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, _oldVal, newVal) {
      if (this[name] !== newVal) {
        this[name] = newVal;
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!this._club && !this._location)) {
                  _context4.next = 3;
                  break;
                }

                _context4.next = 3;
                return this._init();

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
    }
  }, {
    key: "club",
    get: function get() {
      return this._club;
    },
    set: function set(val) {
      var _this2 = this;

      this._club = val;

      this._syncStringAttr('club', this.club);

      if (val) {
        this.removeAttribute('location');

        this._init().then(function () {
          stateapotamus_1.StateAPotamus.dispatch('CLUB_CHANGE', {
            club: _this2._club
          });
        });
      }
    }
  }, {
    key: "location",
    get: function get() {
      return this._location;
    },
    set: function set(val) {
      var _this3 = this;

      this._location = val;

      this._syncStringAttr('location', this._location);

      if (val) {
        this.removeAttribute('club');

        this._init().then(function () {
          stateapotamus_1.StateAPotamus.dispatch('LOCATION_CHANGE', {
            club: '',
            currentClub: null,
            location: _this3._location
          });
        });
      }
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['club', 'location'];
    }
  }]);

  return HTMLZooduckSkyduckElement;
}(
/*#__PURE__*/
_wrapNativeSuper(HTMLElement));

customElements.define(tagName, HTMLZooduckSkyduckElement);
},{"./fetch/reverse-geocode-lookup.fetch":"scripts/web-components/sky-duck/fetch/reverse-geocode-lookup.fetch.ts","./fetch/skydive-clubs.fetch":"scripts/web-components/sky-duck/fetch/skydive-clubs.fetch.ts","./utils/get-current-position":"scripts/web-components/sky-duck/utils/get-current-position.ts","./fetch/log.fetch":"scripts/web-components/sky-duck/fetch/log.fetch.ts","./utils/modifier-classes":"scripts/web-components/sky-duck/utils/modifier-classes.ts","./state/state":"scripts/web-components/sky-duck/state/state.ts","./state/stateapotamus":"scripts/web-components/sky-duck/state/stateapotamus.ts","./fetch/google-maps-key-lookup.fetch":"scripts/web-components/sky-duck/fetch/google-maps-key-lookup.fetch.ts","./state/state-actions":"scripts/web-components/sky-duck/state/state-actions.ts","./fetch/version.fetch":"scripts/web-components/sky-duck/fetch/version.fetch.ts"}],"scripts/web-components/skyduck-loader-error/skyduck-loader-error.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkyduckLoaderErrorTemplate = void 0;

var SkyduckLoaderErrorTemplate =
/*#__PURE__*/
function () {
  function SkyduckLoaderErrorTemplate() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, SkyduckLoaderErrorTemplate);

    this._message = message;

    this._build();
  }

  _createClass(SkyduckLoaderErrorTemplate, [{
    key: "_build",
    value: function _build() {
      this._html = new DOMParser().parseFromString("\n            <div class=\"skyduck-loader-error\">".concat(this._message, "</div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._html;
    }
  }]);

  return SkyduckLoaderErrorTemplate;
}();

exports.SkyduckLoaderErrorTemplate = SkyduckLoaderErrorTemplate;
},{}],"scripts/web-components/skyduck-loader-error/skyduck-loader-error.style.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skyduckLoaderErrorStyle = void 0;
exports.skyduckLoaderErrorStyle = "\n:host([active]) {\n    display: flex;\n}\n:host(:not([active])) {\n    display: none;\n}\n:host {\n    position: fixed;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    justify-content: center;\n    align-items: center;\n    padding: 20px;\n    background-color: var(--lightskyblue);\n}\n.skyduck-loader-error {\n    padding: 10px;\n    color: var(--white);\n    border: solid 3px var(--white);\n    max-width: 450px;\n}\n";
},{}],"scripts/web-components/skyduck-loader-error/skyduck-loader-error.component.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var skyduck_loader_error_template_1 = require("./skyduck-loader-error.template");

var skyduck_loader_error_style_1 = require("./skyduck-loader-error.style");

var HTMLSkyduckLoaderErrorElement =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(HTMLSkyduckLoaderErrorElement, _HTMLElement);

  var _super = _createSuper(HTMLSkyduckLoaderErrorElement);

  function HTMLSkyduckLoaderErrorElement() {
    var _this;

    _classCallCheck(this, HTMLSkyduckLoaderErrorElement);

    _this = _super.call(this);

    _this.attachShadow({
      mode: 'open'
    });

    _this._style = document.createElement('style');

    _this.shadowRoot.appendChild(_this._style);

    return _this;
  }

  _createClass(HTMLSkyduckLoaderErrorElement, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(attr, _oldVal, newVal) {
      if (attr !== 'message' || !this._content) {
        return;
      }

      var updatedContent = new skyduck_loader_error_template_1.SkyduckLoaderErrorTemplate(newVal).html;
      this.shadowRoot.replaceChild(updatedContent, this._content);
      this._content = updatedContent;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this._style.innerHTML = skyduck_loader_error_style_1.skyduckLoaderErrorStyle;
      this._content = new skyduck_loader_error_template_1.SkyduckLoaderErrorTemplate(this.message).html;
      this.shadowRoot.appendChild(this._content);
    }
  }, {
    key: "message",
    get: function get() {
      return this.getAttribute('message');
    },
    set: function set(val) {
      this.setAttribute('message', val);
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['message'];
    }
  }]);

  return HTMLSkyduckLoaderErrorElement;
}(
/*#__PURE__*/
_wrapNativeSuper(HTMLElement));

customElements.define('skyduck-loader-error', HTMLSkyduckLoaderErrorElement);
},{"./skyduck-loader-error.template":"scripts/web-components/skyduck-loader-error/skyduck-loader-error.template.ts","./skyduck-loader-error.style":"scripts/web-components/skyduck-loader-error/skyduck-loader-error.style.ts"}],"scripts/web-components/skyduck-splash-screen-loader/skyduck-splash-screen-loader.style.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skyduckSplashScreenLoaderStyle = void 0;

exports.skyduckSplashScreenLoaderStyle = function () {
  var backgroundColor = 'lightskyblue';
  var skyduckTextLoaderNameCharAnimationDuration = .5;
  var skyduckTextLoaderNameCharDelays = Array.from({
    length: 7
  }).map(function (_item, index) {
    var animationDelay = .25;
    return (index + 1) * animationDelay;
  });
  var skyduckTextLoaderBackgroundDelay = skyduckTextLoaderNameCharDelays.slice(-1)[0] + skyduckTextLoaderNameCharAnimationDuration;
  return "\n@keyframes fade-in {\n    0% {\n        opacity: 0;\n        transform: translateY(-100%);\n    }\n    100% {\n        opacity: 1;\n        transform: translateY(0);\n    }\n}\n@keyframes slide-in {\n    0% {\n        transform: translateX(-100%);\n    }\n    100% {\n        transform: translateX(0);\n    }\n}\n@keyframes switch-color {\n    0% {\n        color: #ffffff;\n    }\n    100% {\n        color: ".concat(backgroundColor, ";\n    }\n}\n@keyframes progress-bar {\n    0% {\n        width: 0;\n    }\n    50% {\n        width: 20%;\n    }\n    60% {\n        width: 50%;\n    }\n    70% {\n        width: 50%;\n    }\n    80% {\n        width: 70%;\n    }\n    90% {\n        width: 70%;\n    }\n    100% {\n        width: 100%;\n    }\n}\n:host([active]) {\n    display: flex;\n}\n:host(:not([active])) {\n    display: none;\n}\n.skyduck-splash-screen-loader {\n    position: fixed;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background-color: var(--lightskyblue);\n}\n.skyduck-text-loader {\n    display: inline-flex;\n    flex-direction: column;\n    height: 68px;\n    position: relative;\n}\n.skyduck-text-loader__inner {\n    position: relative;\n    display: inline-grid;\n    grid-template-columns: repeat(2, auto);\n    grid-gap: 10px;\n    align-items: center;\n    padding: 10px 40px 10px 10px;\n    font: normal 22px verdana, sans-serif;\n    clip-path: polygon(0% 0%, 100% 0%, 100% 80px, 0% 80px);\n}\n.skyduck-text-loader__background {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    background-color: #ffffff;\n    clip-path: polygon(100% 0%, 85% 100%, 0% 100%, 0% 0%);\n    animation: slide-in 250ms both;\n    animation-delay: ").concat(skyduckTextLoaderBackgroundDelay, "s;\n}\n.skyduck-text-loader__progress {\n    position: absolute;\n    left: 0;\n    bottom: 0;\n    width: 100%;\n    height: 10px;\n    background-color: rgba(255, 255, 255, .25);\n}\n.skyduck-text-loader__progress-bar {\n    width: 0;\n    height: 10px;\n    background-color: #ffffff;\n    animation: progress-bar 4.5s linear both;\n}\n.skyduck-text-loader__name {\n    position: relative;\n    z-index: 1;\n    display: inline-flex;\n    color: #ffffff;\n    font-weight: bold;\n    animation: switch-color 10ms both;\n    animation-delay: ").concat(skyduckTextLoaderBackgroundDelay, "s;\n}\n.skyduck-text-loader__name-char {\n    animation: fade-in ").concat(skyduckTextLoaderNameCharAnimationDuration, "s linear both;\n}\n").concat(skyduckTextLoaderNameCharDelays.map(function (delay, index) {
    return "\n.skyduck-text-loader__name-char:nth-of-type(".concat(index + 1, ") {\n    animation-delay: ").concat(delay, "s;\n}\n        ").trim();
  }).join('\n'), "\n.skyduck-text-loader__version {\n    position: relative;\n    z-index: 1;\n    color: ").concat(backgroundColor, ";\n}\n    ").trim();
};
},{}],"scripts/web-components/skyduck-splash-screen-loader/skyduck-splash-screen-loader.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkyduckSplashScreenLoaderTemplate = void 0;

var SkyduckSplashScreenLoaderTemplate =
/*#__PURE__*/
function () {
  function SkyduckSplashScreenLoaderTemplate(_ref) {
    var version = _ref.version;

    _classCallCheck(this, SkyduckSplashScreenLoaderTemplate);

    this._version = version;

    this._build();
  }

  _createClass(SkyduckSplashScreenLoaderTemplate, [{
    key: "_build",
    value: function _build() {
      this._html = new DOMParser().parseFromString("\n            <div class=\"skyduck-splash-screen-loader\">\n                <div class=\"skyduck-text-loader\">\n                    <div class=\"skyduck-text-loader__inner\">\n                        <div class=\"skyduck-text-loader__name\">\n                            <span class=\"skyduck-text-loader__name-char\">S</span>\n                            <span class=\"skyduck-text-loader__name-char\">K</span>\n                            <span class=\"skyduck-text-loader__name-char\">Y</span>\n                            <span class=\"skyduck-text-loader__name-char\">D</span>\n                            <span class=\"skyduck-text-loader__name-char\">U</span>\n                            <span class=\"skyduck-text-loader__name-char\">C</span>\n                            <span class=\"skyduck-text-loader__name-char\">K</span>\n                        </div>\n                        <div class=\"skyduck-text-loader__version\">\n                            <small>v".concat(this._version, "</small>\n                        </div>\n                        <div class=\"skyduck-text-loader__background\"></div>\n                    </div>\n                    <div class=\"skyduck-text-loader__progress\">\n                        <div class=\"skyduck-text-loader__progress-bar\"></div>\n                    </div>\n                </div>\n            </div>\n        "), 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._html;
    }
  }]);

  return SkyduckSplashScreenLoaderTemplate;
}();

exports.SkyduckSplashScreenLoaderTemplate = SkyduckSplashScreenLoaderTemplate;
},{}],"scripts/web-components/skyduck-splash-screen-loader/skyduck-splash-screen-loader.component.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var skyduck_splash_screen_loader_style_1 = require("./skyduck-splash-screen-loader.style");

var skyduck_splash_screen_loader_template_1 = require("./skyduck-splash-screen-loader.template");

var HTMLSkyduckSplashScreenLoader =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(HTMLSkyduckSplashScreenLoader, _HTMLElement);

  var _super = _createSuper(HTMLSkyduckSplashScreenLoader);

  function HTMLSkyduckSplashScreenLoader() {
    var _this;

    _classCallCheck(this, HTMLSkyduckSplashScreenLoader);

    _this = _super.call(this);
    _this._style = document.createElement('style');
    _this._version = '';

    _this.attachShadow({
      mode: 'open'
    });

    _this.shadowRoot.appendChild(_this._style);

    _this.shadowRoot.appendChild(document.createElement('div'));

    return _this;
  }

  _createClass(HTMLSkyduckSplashScreenLoader, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(attr, oldVal, newVal) {
      if (oldVal === newVal) {
        return;
      }

      this[attr] = newVal;

      this._render();
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._render();

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "_render",
    value: function _render() {
      this._updateStyle();

      this.shadowRoot.replaceChild(this._template, this.shadowRoot.querySelector('style').nextElementSibling);
    }
  }, {
    key: "_updateStyle",
    value: function _updateStyle() {
      this._style.innerHTML = skyduck_splash_screen_loader_style_1.skyduckSplashScreenLoaderStyle();
    }
  }, {
    key: "version",
    get: function get() {
      return this._version;
    },
    set: function set(val) {
      this._version = val;
      this.setAttribute('version', val);
    }
  }, {
    key: "_template",
    get: function get() {
      return new skyduck_splash_screen_loader_template_1.SkyduckSplashScreenLoaderTemplate({
        version: this._version
      }).html;
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['version'];
    }
  }]);

  return HTMLSkyduckSplashScreenLoader;
}(
/*#__PURE__*/
_wrapNativeSuper(HTMLElement));

customElements.define('skyduck-splash-screen-loader', HTMLSkyduckSplashScreenLoader);
},{"./skyduck-splash-screen-loader.style":"scripts/web-components/skyduck-splash-screen-loader/skyduck-splash-screen-loader.style.ts","./skyduck-splash-screen-loader.template":"scripts/web-components/skyduck-splash-screen-loader/skyduck-splash-screen-loader.template.ts"}],"scripts/web-components/skyduck-interval-loader/skyduck-interval-loader.template.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkyduckIntervalLoaderTemplate = void 0;

var SkyduckIntervalLoaderTemplate =
/*#__PURE__*/
function () {
  function SkyduckIntervalLoaderTemplate() {
    _classCallCheck(this, SkyduckIntervalLoaderTemplate);

    this._build();
  }

  _createClass(SkyduckIntervalLoaderTemplate, [{
    key: "_build",
    value: function _build() {
      this._html = new DOMParser().parseFromString("\n            <div class=\"skyduck-interval-loader\">\n                <div class=\"skyduck-interval-loader__layer-1\">\n                    <strong>READY!</strong>\n                </div>\n                <div class=\"skyduck-interval-loader__layer-2\">\n\n                    <zooduck-icon-skyduck-alt\n                        size=\"100\"\n                        color=\"white\"\n                        backgroundcolor=\"lightskyblue\">\n                    </zooduck-icon-skyduck-alt>\n\n                    <!--\n\n                    <zooduck-icon-skyduck-in-flight\n                        class=\"loader__skyduck-alt-loader\"\n                        size=\"150\"\n                        color=\"var(--white)\"\n                        backgroundcolor=\"var(--lightskyblue)\">\n                    </zooduck-icon-skyduck-in-flight>\n\n                    -->\n\n                </div>\n            </div>\n        ", 'text/html').body.firstChild;
    }
  }, {
    key: "html",
    get: function get() {
      return this._html;
    }
  }]);

  return SkyduckIntervalLoaderTemplate;
}();

exports.SkyduckIntervalLoaderTemplate = SkyduckIntervalLoaderTemplate;
},{}],"scripts/web-components/skyduck-interval-loader/skyduck-interval-loader.style.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skyduckIntervalLoaderStyle = void 0;
exports.skyduckIntervalLoaderStyle = "\n@keyframes pulse {\n    0% {\n        transform: scale(1);\n    }\n    50% {\n        transform: scale(.90);\n    }\n    100% {\n        transform: scale(1);\n    }\n}\n@keyframes removeLayer1 {\n    from {\n        top: 0;\n    }\n    to {\n        top: calc((100% + 15px) * -1);\n    }\n}\n@keyframes removeLayer2 {\n    from {\n        left: 0;\n    }\n    to {\n        left: calc((100% + 15px) * -1);\n    }\n}\n:host([active]) {\n    display: block;\n}\n:host(:not([active])) {\n    display: none;\n}\n\n:host([loaded]) .skyduck-interval-loader__layer-1 {\n    animation: removeLayer1 .25s linear both;\n    animation-delay: .5s;\n}\n\n:host([loaded]) .skyduck-interval-loader__layer-2 {\n    animation: removeLayer2 .25s linear both;\n}\n.skyduck-interval-loader {\n    position: fixed;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n}\n.skyduck-interval-loader__layer-1,\n.skyduck-interval-loader__layer-2 {\n    position: absolute;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    box-shadow: 2px 2px 15px var(--gray);\n    transition: all .25s;\n    background-color: var(--white);\n    color: var(--lightskyblue);\n    font: normal 22px verdana, sans-serif;\n}\n.skyduck-interval-loader__layer-2 {\n    background-color: var(--lightskyblue);\n}\nzooduck-icon-skyduck-alt {\n    animation: pulse linear 1s infinite;\n}\n";
},{}],"scripts/web-components/skyduck-interval-loader/skyduck-interval-loader.component.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var skyduck_interval_loader_template_1 = require("./skyduck-interval-loader.template");

var skyduck_interval_loader_style_1 = require("./skyduck-interval-loader.style");

var HTMLSkyduckIntervalLoader =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(HTMLSkyduckIntervalLoader, _HTMLElement);

  var _super = _createSuper(HTMLSkyduckIntervalLoader);

  function HTMLSkyduckIntervalLoader() {
    var _this;

    _classCallCheck(this, HTMLSkyduckIntervalLoader);

    _this = _super.call(this);

    _this.attachShadow({
      mode: 'open'
    });

    _this._style = document.createElement('style');

    _this.shadowRoot.appendChild(_this._style);

    return _this;
  }

  _createClass(HTMLSkyduckIntervalLoader, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this._style.innerHTML = skyduck_interval_loader_style_1.skyduckIntervalLoaderStyle;
      this.shadowRoot.appendChild(new skyduck_interval_loader_template_1.SkyduckIntervalLoaderTemplate().html);
    }
  }]);

  return HTMLSkyduckIntervalLoader;
}(
/*#__PURE__*/
_wrapNativeSuper(HTMLElement));

customElements.define('skyduck-interval-loader', HTMLSkyduckIntervalLoader);
},{"./skyduck-interval-loader.template":"scripts/web-components/skyduck-interval-loader/skyduck-interval-loader.template.ts","./skyduck-interval-loader.style":"scripts/web-components/skyduck-interval-loader/skyduck-interval-loader.style.ts"}],"scripts/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("regenerator-runtime/runtime"); // required for async/await to work with babel7+


require("./web-components/sky-duck/skyduck.component");

require("./web-components/skyduck-loader-error/skyduck-loader-error.component");

require("./web-components/skyduck-splash-screen-loader/skyduck-splash-screen-loader.component");

require("./web-components/skyduck-interval-loader/skyduck-interval-loader.component"); // import { skydiveClubs } from '../../db/data/skydive-clubs';
// import { addClub } from './web-components/sky-duck/utils/add-club';
// skydiveClubs.forEach((club) => addClub(club));
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","./web-components/sky-duck/skyduck.component":"scripts/web-components/sky-duck/skyduck.component.ts","./web-components/skyduck-loader-error/skyduck-loader-error.component":"scripts/web-components/skyduck-loader-error/skyduck-loader-error.component.ts","./web-components/skyduck-splash-screen-loader/skyduck-splash-screen-loader.component":"scripts/web-components/skyduck-splash-screen-loader/skyduck-splash-screen-loader.component.ts","./web-components/skyduck-interval-loader/skyduck-interval-loader.component":"scripts/web-components/skyduck-interval-loader/skyduck-interval-loader.component.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64986" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/index.ts"], null)
//# sourceMappingURL=/scripts.2ed900e3.js.map