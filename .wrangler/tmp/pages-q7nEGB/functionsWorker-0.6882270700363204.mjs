var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, isWorkerdProcessV2, unenvProcess, exit, features, platform, env, hrtime3, nextTick, _channel, _disconnect, _events, _eventsCount, _handleQueue, _maxListeners, _pendingMessage, _send, assert2, disconnect, mainModule, _debugEnd, _debugProcess, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _linkedBinding, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, dlopen, domain, emit, emitWarning, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, initgroups, kill, listenerCount, listeners, loadEnvFile, memoryUsage, moduleLoadList, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
    unenvProcess = new Process({
      env: globalProcess.env,
      // `hrtime` is only available from workerd process v2
      hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      env: (
        // Always implemented by workerd
        env
      ),
      hrtime: (
        // Only implemented in workerd v2
        hrtime3
      ),
      nextTick: (
        // Always implemented by workerd
        nextTick
      )
    } = unenvProcess);
    ({
      _channel,
      _disconnect,
      _events,
      _eventsCount,
      _handleQueue,
      _maxListeners,
      _pendingMessage,
      _send,
      assert: assert2,
      disconnect,
      mainModule
    } = unenvProcess);
    ({
      _debugEnd: (
        // @ts-expect-error `_debugEnd` is missing typings
        _debugEnd
      ),
      _debugProcess: (
        // @ts-expect-error `_debugProcess` is missing typings
        _debugProcess
      ),
      _exiting: (
        // @ts-expect-error `_exiting` is missing typings
        _exiting
      ),
      _fatalException: (
        // @ts-expect-error `_fatalException` is missing typings
        _fatalException
      ),
      _getActiveHandles: (
        // @ts-expect-error `_getActiveHandles` is missing typings
        _getActiveHandles
      ),
      _getActiveRequests: (
        // @ts-expect-error `_getActiveRequests` is missing typings
        _getActiveRequests
      ),
      _kill: (
        // @ts-expect-error `_kill` is missing typings
        _kill
      ),
      _linkedBinding: (
        // @ts-expect-error `_linkedBinding` is missing typings
        _linkedBinding
      ),
      _preload_modules: (
        // @ts-expect-error `_preload_modules` is missing typings
        _preload_modules
      ),
      _rawDebug: (
        // @ts-expect-error `_rawDebug` is missing typings
        _rawDebug
      ),
      _startProfilerIdleNotifier: (
        // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
        _startProfilerIdleNotifier
      ),
      _stopProfilerIdleNotifier: (
        // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
        _stopProfilerIdleNotifier
      ),
      _tickCallback: (
        // @ts-expect-error `_tickCallback` is missing typings
        _tickCallback
      ),
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      availableMemory,
      binding: (
        // @ts-expect-error `binding` is missing typings
        binding
      ),
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      domain: (
        // @ts-expect-error `domain` is missing typings
        domain
      ),
      emit,
      emitWarning,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      initgroups: (
        // @ts-expect-error `initgroups` is missing typings
        initgroups
      ),
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      memoryUsage,
      moduleLoadList: (
        // @ts-expect-error `moduleLoadList` is missing typings
        moduleLoadList
      ),
      off,
      on,
      once,
      openStdin: (
        // @ts-expect-error `openStdin` is missing typings
        openStdin
      ),
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit: (
        // @ts-expect-error `reallyExit` is missing typings
        reallyExit
      ),
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = isWorkerdProcessV2 ? workerdProcess : unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// ../backend-lib/db-simple.ts
function getDB() {
  const globalEnv = globalThis;
  const db = globalEnv.DB || globalEnv.env?.DB || globalEnv.__env__?.DB;
  if (!db) {
    return {
      prepare: /* @__PURE__ */ __name((sql) => ({
        bind: /* @__PURE__ */ __name((...params) => ({
          all: /* @__PURE__ */ __name(async () => ({ results: [] }), "all"),
          run: /* @__PURE__ */ __name(async () => ({ success: true }), "run"),
          first: /* @__PURE__ */ __name(async () => null, "first")
        }), "bind")
      }), "prepare")
    };
  }
  return db;
}
async function query(sql, params = []) {
  const db = getDB();
  try {
    const result = await db.prepare(sql).bind(...params).all();
    return result.results || [];
  } catch (error3) {
    console.error("D1 query error:", error3);
    return [];
  }
}
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}
async function execute(sql, params = []) {
  const db = getDB();
  try {
    const result = await db.prepare(sql).bind(...params).run();
    return { success: true, id: result.meta?.last_row_id };
  } catch (error3) {
    console.error("D1 execute error:", error3);
    return { success: false };
  }
}
var getDb;
var init_db_simple = __esm({
  "../backend-lib/db-simple.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(getDB, "getDB");
    getDb = getDB;
    __name(query, "query");
    __name(queryOne, "queryOne");
    __name(execute, "execute");
  }
});

// api/auth/login.ts
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function onRequestPost(context2) {
  const { request, env: env2 } = context2;
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    const users = await query(
      "SELECT id, email, display_name, photo_url, email_verified, license_type FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    if (users.length === 0) {
      return Response.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const user = users[0];
    const passwords = await query(
      "SELECT password_hash FROM user_passwords WHERE user_id = ? LIMIT 1",
      [user.id]
    );
    if (passwords.length === 0) {
      return Response.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== passwords[0].password_hash) {
      return Response.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60
      // 7 days
    };
    const token = `cf_${btoa(JSON.stringify(tokenPayload))}`;
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    await execute(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
      [sessionId, user.id, expiresAt.toISOString()]
    );
    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        photo_url: user.photo_url,
        license_type: user.license_type,
        email_verified: Boolean(user.email_verified)
      },
      token,
      sessionId
    });
  } catch (error3) {
    console.error("Login error:", error3);
    return Response.json(
      {
        success: false,
        error: error3.message || "Login failed"
      },
      { status: 500 }
    );
  }
}
var init_login = __esm({
  "api/auth/login.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(hashPassword, "hashPassword");
    __name(onRequestPost, "onRequestPost");
  }
});

// api/auth/logout.ts
async function onRequestPost2(context2) {
  const { request } = context2;
  try {
    const { sessionId } = await request.json();
    if (sessionId) {
      await execute(
        "DELETE FROM sessions WHERE id = ?",
        [sessionId]
      );
    }
    return Response.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error3) {
    console.error("Logout error:", error3);
    return Response.json(
      {
        success: false,
        error: "Logout failed"
      },
      { status: 500 }
    );
  }
}
var init_logout = __esm({
  "api/auth/logout.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(onRequestPost2, "onRequestPost");
  }
});

// api/auth/me.ts
function verifyToken(token) {
  try {
    const cleanToken = token.replace("cf_", "");
    const decoded = JSON.parse(atob(cleanToken));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1e3)) {
      return null;
    }
    return { userId: decoded.userId, email: decoded.email };
  } catch (error3) {
    console.error("Token verification error:", error3);
    return null;
  }
}
async function onRequestGet(context2) {
  const { request } = context2;
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);
    if (!payload) {
      return Response.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const user = await query(
      "SELECT id, email, display_name, photo_url, email_verified, license_type, referral_code, setup_count, created_at FROM users WHERE id = ? LIMIT 1",
      [payload.userId]
    );
    if (user.length === 0) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        display_name: user[0].display_name,
        photo_url: user[0].photo_url,
        email_verified: Boolean(user[0].email_verified),
        license_type: user[0].license_type,
        referral_code: user[0].referral_code,
        setup_count: user[0].setup_count || 0,
        created_at: user[0].created_at
      }
    });
  } catch (error3) {
    console.error("Get user error:", error3);
    return Response.json(
      {
        success: false,
        error: "Failed to get user info"
      },
      { status: 500 }
    );
  }
}
var init_me = __esm({
  "api/auth/me.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(verifyToken, "verifyToken");
    __name(onRequestGet, "onRequestGet");
  }
});

// api/auth/register.ts
function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
async function hashPassword2(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function onRequestPost3(context2) {
  const { request } = context2;
  try {
    const { email, password, displayName, referralCode } = await request.json();
    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    const existingUser = await query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    if (existingUser.length > 0) {
      return Response.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }
    const userId = crypto.randomUUID();
    const referralCodeGenerated = generateReferralCode();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await execute(
      `INSERT INTO users (
        id, email, display_name, email_verified, license_type, 
        referral_code, setup_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        email,
        displayName || null,
        0,
        // email_verified
        "free",
        referralCodeGenerated,
        1,
        // setup_count (1 free setup)
        now,
        now
      ]
    );
    const passwordHash = await hashPassword2(password);
    await execute(
      `CREATE TABLE IF NOT EXISTS user_passwords (
        user_id TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      []
    );
    await execute(
      "INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)",
      [userId, passwordHash]
    );
    if (referralCode) {
      const referrerResult = await query(
        "SELECT id FROM users WHERE referral_code = ? LIMIT 1",
        [referralCode]
      );
      if (referrerResult.length > 0) {
        await execute(
          `CREATE TABLE IF NOT EXISTS referrals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            referrer_id TEXT,
            referred_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
          []
        );
        await execute(
          "INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)",
          [referrerResult[0].id, userId]
        );
        await execute(
          "UPDATE users SET setup_count = setup_count + 5 WHERE id = ?",
          [referrerResult[0].id]
        );
      }
    }
    const tokenPayload = {
      userId,
      email,
      exp: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60
      // 7 days
    };
    const token = `cf_${btoa(JSON.stringify(tokenPayload))}`;
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    await execute(
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        expires_at TEXT
      )`,
      []
    );
    await execute(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
      [sessionId, userId, expiresAt.toISOString()]
    );
    return Response.json({
      success: true,
      user: {
        id: userId,
        email,
        display_name: displayName,
        license_type: "free",
        email_verified: false,
        referral_code: referralCodeGenerated,
        setup_count: 1
      },
      token,
      sessionId
    });
  } catch (error3) {
    console.error("Registration error:", error3);
    return Response.json(
      {
        success: false,
        error: error3.message || "Registration failed"
      },
      { status: 500 }
    );
  }
}
var init_register = __esm({
  "api/auth/register.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(generateReferralCode, "generateReferralCode");
    __name(hashPassword2, "hashPassword");
    __name(onRequestPost3, "onRequestPost");
  }
});

// ../node_modules/es-errors/type.js
var require_type = __commonJS({
  "../node_modules/es-errors/type.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = TypeError;
  }
});

// (disabled):../node_modules/object-inspect/util.inspect
var require_util = __commonJS({
  "(disabled):../node_modules/object-inspect/util.inspect"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// ../node_modules/object-inspect/index.js
var require_object_inspect = __commonJS({
  "../node_modules/object-inspect/index.js"(exports, module) {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
      return O.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    __name(addNumericSeparator, "addNumericSeparator");
    var utilInspect = require_util();
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    module.exports = /* @__PURE__ */ __name(function inspect_(obj, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj === "undefined") {
        return "undefined";
      }
      if (obj === null) {
        return "null";
      }
      if (typeof obj === "boolean") {
        return obj ? "true" : "false";
      }
      if (typeof obj === "string") {
        return inspectString(obj, opts);
      }
      if (typeof obj === "number") {
        if (obj === 0) {
          return Infinity / obj > 0 ? "0" : "-0";
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
      }
      if (typeof obj === "bigint") {
        var bigIntStr = String(obj) + "n";
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
        return isArray(obj) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj) >= 0) {
        return "[Circular]";
      }
      function inspect(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      __name(inspect, "inspect");
      if (typeof obj === "function" && !isRegExp(obj)) {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
        return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj)) {
        var s = "<" + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
          s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
        }
        s += ">";
        if (obj.childNodes && obj.childNodes.length) {
          s += "...";
        }
        s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
        return s;
      }
      if (isArray(obj)) {
        if (obj.length === 0) {
          return "[]";
        }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
          return "[" + indentedJoin(xs, indent) + "]";
        }
        return "[ " + $join.call(xs, ", ") + " ]";
      }
      if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
          return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj) + "]";
        }
        return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj === "object" && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
          return obj.inspect();
        }
      }
      if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj, function(value, key) {
            mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
          });
        }
        return collectionOf("Map", mapSize.call(obj), mapParts, indent);
      }
      if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj, function(value) {
            setParts.push(inspect(value, obj));
          });
        }
        return collectionOf("Set", setSize.call(obj), setParts, indent);
      }
      if (isWeakMap(obj)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
      }
      if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
      }
      if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
      }
      if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
      }
      if (typeof window !== "undefined" && obj === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) {
        return "{ [object globalThis] }";
      }
      if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys, indent) + "}";
        }
        return tag + "{ " + $join.call(ys, ", ") + " }";
      }
      return String(obj);
    }, "inspect_");
    function wrapQuotes(s, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s + quoteChar;
    }
    __name(wrapQuotes, "wrapQuotes");
    function quote(s) {
      return $replace.call(String(s), /"/g, "&quot;");
    }
    __name(quote, "quote");
    function canTrustToString(obj) {
      return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
    }
    __name(canTrustToString, "canTrustToString");
    function isArray(obj) {
      return toStr(obj) === "[object Array]" && canTrustToString(obj);
    }
    __name(isArray, "isArray");
    function isDate(obj) {
      return toStr(obj) === "[object Date]" && canTrustToString(obj);
    }
    __name(isDate, "isDate");
    function isRegExp(obj) {
      return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
    }
    __name(isRegExp, "isRegExp");
    function isError(obj) {
      return toStr(obj) === "[object Error]" && canTrustToString(obj);
    }
    __name(isError, "isError");
    function isString(obj) {
      return toStr(obj) === "[object String]" && canTrustToString(obj);
    }
    __name(isString, "isString");
    function isNumber(obj) {
      return toStr(obj) === "[object Number]" && canTrustToString(obj);
    }
    __name(isNumber, "isNumber");
    function isBoolean(obj) {
      return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
    }
    __name(isBoolean, "isBoolean");
    function isSymbol(obj) {
      if (hasShammedSymbols) {
        return obj && typeof obj === "object" && obj instanceof Symbol;
      }
      if (typeof obj === "symbol") {
        return true;
      }
      if (!obj || typeof obj !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    __name(isSymbol, "isSymbol");
    function isBigInt(obj) {
      if (!obj || typeof obj !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    __name(isBigInt, "isBigInt");
    var hasOwn = Object.prototype.hasOwnProperty || function(key) {
      return key in this;
    };
    function has(obj, key) {
      return hasOwn.call(obj, key);
    }
    __name(has, "has");
    function toStr(obj) {
      return objectToString.call(obj);
    }
    __name(toStr, "toStr");
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m) {
        return m[1];
      }
      return null;
    }
    __name(nameOf, "nameOf");
    function indexOf(xs, x) {
      if (xs.indexOf) {
        return xs.indexOf(x);
      }
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) {
          return i;
        }
      }
      return -1;
    }
    __name(indexOf, "indexOf");
    function isMap(x) {
      if (!mapSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        mapSize.call(x);
        try {
          setSize.call(x);
        } catch (s) {
          return true;
        }
        return x instanceof Map;
      } catch (e) {
      }
      return false;
    }
    __name(isMap, "isMap");
    function isWeakMap(x) {
      if (!weakMapHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x, weakMapHas);
        try {
          weakSetHas.call(x, weakSetHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    __name(isWeakMap, "isWeakMap");
    function isWeakRef(x) {
      if (!weakRefDeref || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x);
        return true;
      } catch (e) {
      }
      return false;
    }
    __name(isWeakRef, "isWeakRef");
    function isSet(x) {
      if (!setSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        setSize.call(x);
        try {
          mapSize.call(x);
        } catch (m) {
          return true;
        }
        return x instanceof Set;
      } catch (e) {
      }
      return false;
    }
    __name(isSet, "isSet");
    function isWeakSet(x) {
      if (!weakSetHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x, weakSetHas);
        try {
          weakMapHas.call(x, weakMapHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    __name(isWeakSet, "isWeakSet");
    function isElement(x) {
      if (!x || typeof x !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
        return true;
      }
      return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
    }
    __name(isElement, "isElement");
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s, "single", opts);
    }
    __name(inspectString, "inspectString");
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x) {
        return "\\" + x;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    __name(lowbyte, "lowbyte");
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    __name(markBoxed, "markBoxed");
    function weakCollectionOf(type) {
      return type + " { ? }";
    }
    __name(weakCollectionOf, "weakCollectionOf");
    function collectionOf(type, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type + " (" + size + ") {" + joinedEntries + "}";
    }
    __name(collectionOf, "collectionOf");
    function singleLineValues(xs) {
      for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    __name(singleLineValues, "singleLineValues");
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    __name(getIndent, "getIndent");
    function indentedJoin(xs, indent) {
      if (xs.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
    }
    __name(indentedJoin, "indentedJoin");
    function arrObjKeys(obj, inspect) {
      var isArr = isArray(obj);
      var xs = [];
      if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
          xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key in obj) {
        if (!has(obj, key)) {
          continue;
        }
        if (isArr && String(Number(key)) === key && key < obj.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key)) {
          xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
        } else {
          xs.push(key + ": " + inspect(obj[key], obj));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj, syms[j])) {
            xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
          }
        }
      }
      return xs;
    }
    __name(arrObjKeys, "arrObjKeys");
  }
});

// ../node_modules/side-channel-list/index.js
var require_side_channel_list = __commonJS({
  "../node_modules/side-channel-list/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var listGetNode = /* @__PURE__ */ __name(function(list, key, isDelete) {
      var prev = list;
      var curr;
      for (; (curr = prev.next) != null; prev = curr) {
        if (curr.key === key) {
          prev.next = curr.next;
          if (!isDelete) {
            curr.next = /** @type {NonNullable<typeof list.next>} */
            list.next;
            list.next = curr;
          }
          return curr;
        }
      }
    }, "listGetNode");
    var listGet = /* @__PURE__ */ __name(function(objects, key) {
      if (!objects) {
        return void 0;
      }
      var node = listGetNode(objects, key);
      return node && node.value;
    }, "listGet");
    var listSet = /* @__PURE__ */ __name(function(objects, key, value) {
      var node = listGetNode(objects, key);
      if (node) {
        node.value = value;
      } else {
        objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
        {
          // eslint-disable-line no-param-reassign, no-extra-parens
          key,
          next: objects.next,
          value
        };
      }
    }, "listSet");
    var listHas = /* @__PURE__ */ __name(function(objects, key) {
      if (!objects) {
        return false;
      }
      return !!listGetNode(objects, key);
    }, "listHas");
    var listDelete = /* @__PURE__ */ __name(function(objects, key) {
      if (objects) {
        return listGetNode(objects, key, true);
      }
    }, "listDelete");
    module.exports = /* @__PURE__ */ __name(function getSideChannelList() {
      var $o;
      var channel2 = {
        assert: /* @__PURE__ */ __name(function(key) {
          if (!channel2.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        }, "assert"),
        "delete": /* @__PURE__ */ __name(function(key) {
          var root = $o && $o.next;
          var deletedNode = listDelete($o, key);
          if (deletedNode && root && root === deletedNode) {
            $o = void 0;
          }
          return !!deletedNode;
        }, "delete"),
        get: /* @__PURE__ */ __name(function(key) {
          return listGet($o, key);
        }, "get"),
        has: /* @__PURE__ */ __name(function(key) {
          return listHas($o, key);
        }, "has"),
        set: /* @__PURE__ */ __name(function(key, value) {
          if (!$o) {
            $o = {
              next: void 0
            };
          }
          listSet(
            /** @type {NonNullable<typeof $o>} */
            $o,
            key,
            value
          );
        }, "set")
      };
      return channel2;
    }, "getSideChannelList");
  }
});

// ../node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "../node_modules/es-object-atoms/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Object;
  }
});

// ../node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "../node_modules/es-errors/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Error;
  }
});

// ../node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "../node_modules/es-errors/eval.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = EvalError;
  }
});

// ../node_modules/es-errors/range.js
var require_range = __commonJS({
  "../node_modules/es-errors/range.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = RangeError;
  }
});

// ../node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "../node_modules/es-errors/ref.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = ReferenceError;
  }
});

// ../node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "../node_modules/es-errors/syntax.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = SyntaxError;
  }
});

// ../node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "../node_modules/es-errors/uri.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = URIError;
  }
});

// ../node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "../node_modules/math-intrinsics/abs.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Math.abs;
  }
});

// ../node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "../node_modules/math-intrinsics/floor.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Math.floor;
  }
});

// ../node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "../node_modules/math-intrinsics/max.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Math.max;
  }
});

// ../node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "../node_modules/math-intrinsics/min.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Math.min;
  }
});

// ../node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "../node_modules/math-intrinsics/pow.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Math.pow;
  }
});

// ../node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  "../node_modules/math-intrinsics/round.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Math.round;
  }
});

// ../node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  "../node_modules/math-intrinsics/isNaN.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Number.isNaN || /* @__PURE__ */ __name(function isNaN2(a) {
      return a !== a;
    }, "isNaN");
  }
});

// ../node_modules/math-intrinsics/sign.js
var require_sign = __commonJS({
  "../node_modules/math-intrinsics/sign.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var $isNaN = require_isNaN();
    module.exports = /* @__PURE__ */ __name(function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    }, "sign");
  }
});

// ../node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "../node_modules/gopd/gOPD.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Object.getOwnPropertyDescriptor;
  }
});

// ../node_modules/gopd/index.js
var require_gopd = __commonJS({
  "../node_modules/gopd/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module.exports = $gOPD;
  }
});

// ../node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "../node_modules/es-define-property/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module.exports = $defineProperty;
  }
});

// ../node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "../node_modules/has-symbols/shams.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = /* @__PURE__ */ __name(function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _ in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    }, "hasSymbols");
  }
});

// ../node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "../node_modules/has-symbols/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module.exports = /* @__PURE__ */ __name(function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    }, "hasNativeSymbols");
  }
});

// ../node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  "../node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  }
});

// ../node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  "../node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var $Object = require_es_object_atoms();
    module.exports = $Object.getPrototypeOf || null;
  }
});

// ../node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "../node_modules/function-bind/implementation.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = /* @__PURE__ */ __name(function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    }, "concatty");
    var slicy = /* @__PURE__ */ __name(function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    }, "slicy");
    var joiny = /* @__PURE__ */ __name(function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    }, "joiny");
    module.exports = /* @__PURE__ */ __name(function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = /* @__PURE__ */ __name(function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      }, "binder");
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = /* @__PURE__ */ __name(function Empty2() {
        }, "Empty");
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    }, "bind");
  }
});

// ../node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "../node_modules/function-bind/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  }
});

// ../node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "../node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Function.prototype.call;
  }
});

// ../node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "../node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = Function.prototype.apply;
  }
});

// ../node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "../node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// ../node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "../node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module.exports = $reflectApply || bind.call($call, $apply);
  }
});

// ../node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "../node_modules/call-bind-apply-helpers/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module.exports = /* @__PURE__ */ __name(function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind, $call, args);
    }, "callBindBasic");
  }
});

// ../node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "../node_modules/dunder-proto/get.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD && gOPD(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      /* @__PURE__ */ __name(function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }, "getDunder")
    ) : false;
  }
});

// ../node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  "../node_modules/get-proto/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module.exports = reflectGetProto ? /* @__PURE__ */ __name(function getProto(O) {
      return reflectGetProto(O);
    }, "getProto") : originalGetProto ? /* @__PURE__ */ __name(function getProto(O) {
      if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O);
    }, "getProto") : getDunderProto ? /* @__PURE__ */ __name(function getProto(O) {
      return getDunderProto(O);
    }, "getProto") : null;
  }
});

// ../node_modules/hasown/index.js
var require_hasown = __commonJS({
  "../node_modules/hasown/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module.exports = bind.call(call, $hasOwn);
  }
});

// ../node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "../node_modules/get-intrinsic/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign();
    var $Function = Function;
    var getEvalledConstructor = /* @__PURE__ */ __name(function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    }, "getEvalledConstructor");
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = /* @__PURE__ */ __name(function() {
      throw new $TypeError();
    }, "throwTypeError");
    var ThrowTypeError = $gOPD ? (function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    })() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max,
      "%Math.min%": min,
      "%Math.pow%": pow,
      "%Math.round%": round,
      "%Math.sign%": sign,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = /* @__PURE__ */ __name(function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    }, "doEval");
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = /* @__PURE__ */ __name(function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match2, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match2;
      });
      return result;
    }, "stringToPath");
    var getBaseIntrinsic = /* @__PURE__ */ __name(function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    }, "getBaseIntrinsic");
    module.exports = /* @__PURE__ */ __name(function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void undefined2;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    }, "GetIntrinsic");
  }
});

// ../node_modules/call-bound/index.js
var require_call_bound = __commonJS({
  "../node_modules/call-bound/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var GetIntrinsic = require_get_intrinsic();
    var callBindBasic = require_call_bind_apply_helpers();
    var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
    module.exports = /* @__PURE__ */ __name(function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = (
        /** @type {(this: unknown, ...args: unknown[]) => unknown} */
        GetIntrinsic(name, !!allowMissing)
      );
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBindBasic(
          /** @type {const} */
          [intrinsic]
        );
      }
      return intrinsic;
    }, "callBoundIntrinsic");
  }
});

// ../node_modules/side-channel-map/index.js
var require_side_channel_map = __commonJS({
  "../node_modules/side-channel-map/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var $Map = GetIntrinsic("%Map%", true);
    var $mapGet = callBound("Map.prototype.get", true);
    var $mapSet = callBound("Map.prototype.set", true);
    var $mapHas = callBound("Map.prototype.has", true);
    var $mapDelete = callBound("Map.prototype.delete", true);
    var $mapSize = callBound("Map.prototype.size", true);
    module.exports = !!$Map && /** @type {Exclude<import('.'), false>} */
    /* @__PURE__ */ __name(function getSideChannelMap() {
      var $m;
      var channel2 = {
        assert: /* @__PURE__ */ __name(function(key) {
          if (!channel2.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        }, "assert"),
        "delete": /* @__PURE__ */ __name(function(key) {
          if ($m) {
            var result = $mapDelete($m, key);
            if ($mapSize($m) === 0) {
              $m = void 0;
            }
            return result;
          }
          return false;
        }, "delete"),
        get: /* @__PURE__ */ __name(function(key) {
          if ($m) {
            return $mapGet($m, key);
          }
        }, "get"),
        has: /* @__PURE__ */ __name(function(key) {
          if ($m) {
            return $mapHas($m, key);
          }
          return false;
        }, "has"),
        set: /* @__PURE__ */ __name(function(key, value) {
          if (!$m) {
            $m = new $Map();
          }
          $mapSet($m, key, value);
        }, "set")
      };
      return channel2;
    }, "getSideChannelMap");
  }
});

// ../node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = __commonJS({
  "../node_modules/side-channel-weakmap/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var getSideChannelMap = require_side_channel_map();
    var $TypeError = require_type();
    var $WeakMap = GetIntrinsic("%WeakMap%", true);
    var $weakMapGet = callBound("WeakMap.prototype.get", true);
    var $weakMapSet = callBound("WeakMap.prototype.set", true);
    var $weakMapHas = callBound("WeakMap.prototype.has", true);
    var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
    module.exports = $WeakMap ? (
      /** @type {Exclude<import('.'), false>} */
      /* @__PURE__ */ __name(function getSideChannelWeakMap() {
        var $wm;
        var $m;
        var channel2 = {
          assert: /* @__PURE__ */ __name(function(key) {
            if (!channel2.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          }, "assert"),
          "delete": /* @__PURE__ */ __name(function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapDelete($wm, key);
              }
            } else if (getSideChannelMap) {
              if ($m) {
                return $m["delete"](key);
              }
            }
            return false;
          }, "delete"),
          get: /* @__PURE__ */ __name(function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            }
            return $m && $m.get(key);
          }, "get"),
          has: /* @__PURE__ */ __name(function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            }
            return !!$m && $m.has(key);
          }, "has"),
          set: /* @__PURE__ */ __name(function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if (getSideChannelMap) {
              if (!$m) {
                $m = getSideChannelMap();
              }
              $m.set(key, value);
            }
          }, "set")
        };
        return channel2;
      }, "getSideChannelWeakMap")
    ) : getSideChannelMap;
  }
});

// ../node_modules/side-channel/index.js
var require_side_channel = __commonJS({
  "../node_modules/side-channel/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var $TypeError = require_type();
    var inspect = require_object_inspect();
    var getSideChannelList = require_side_channel_list();
    var getSideChannelMap = require_side_channel_map();
    var getSideChannelWeakMap = require_side_channel_weakmap();
    var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
    module.exports = /* @__PURE__ */ __name(function getSideChannel() {
      var $channelData;
      var channel2 = {
        assert: /* @__PURE__ */ __name(function(key) {
          if (!channel2.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        }, "assert"),
        "delete": /* @__PURE__ */ __name(function(key) {
          return !!$channelData && $channelData["delete"](key);
        }, "delete"),
        get: /* @__PURE__ */ __name(function(key) {
          return $channelData && $channelData.get(key);
        }, "get"),
        has: /* @__PURE__ */ __name(function(key) {
          return !!$channelData && $channelData.has(key);
        }, "has"),
        set: /* @__PURE__ */ __name(function(key, value) {
          if (!$channelData) {
            $channelData = makeChannel();
          }
          $channelData.set(key, value);
        }, "set")
      };
      return channel2;
    }, "getSideChannel");
  }
});

// ../node_modules/qs/lib/formats.js
var require_formats = __commonJS({
  "../node_modules/qs/lib/formats.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;
    var Format = {
      RFC1738: "RFC1738",
      RFC3986: "RFC3986"
    };
    module.exports = {
      "default": Format.RFC3986,
      formatters: {
        RFC1738: /* @__PURE__ */ __name(function(value) {
          return replace.call(value, percentTwenties, "+");
        }, "RFC1738"),
        RFC3986: /* @__PURE__ */ __name(function(value) {
          return String(value);
        }, "RFC3986")
      },
      RFC1738: Format.RFC1738,
      RFC3986: Format.RFC3986
    };
  }
});

// ../node_modules/qs/lib/utils.js
var require_utils = __commonJS({
  "../node_modules/qs/lib/utils.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var formats = require_formats();
    var getSideChannel = require_side_channel();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var overflowChannel = getSideChannel();
    var markOverflow = /* @__PURE__ */ __name(function markOverflow2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
      return obj;
    }, "markOverflow");
    var isOverflow = /* @__PURE__ */ __name(function isOverflow2(obj) {
      return overflowChannel.has(obj);
    }, "isOverflow");
    var getMaxIndex = /* @__PURE__ */ __name(function getMaxIndex2(obj) {
      return overflowChannel.get(obj);
    }, "getMaxIndex");
    var setMaxIndex = /* @__PURE__ */ __name(function setMaxIndex2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
    }, "setMaxIndex");
    var hexTable = (function() {
      var array = [];
      for (var i = 0; i < 256; ++i) {
        array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
      }
      return array;
    })();
    var compactQueue = /* @__PURE__ */ __name(function compactQueue2(queue) {
      while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];
        if (isArray(obj)) {
          var compacted = [];
          for (var j = 0; j < obj.length; ++j) {
            if (typeof obj[j] !== "undefined") {
              compacted.push(obj[j]);
            }
          }
          item.obj[item.prop] = compacted;
        }
      }
    }, "compactQueue");
    var arrayToObject = /* @__PURE__ */ __name(function arrayToObject2(source, options) {
      var obj = options && options.plainObjects ? { __proto__: null } : {};
      for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== "undefined") {
          obj[i] = source[i];
        }
      }
      return obj;
    }, "arrayToObject");
    var merge = /* @__PURE__ */ __name(function merge2(target, source, options) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object" && typeof source !== "function") {
        if (isArray(target)) {
          target.push(source);
        } else if (target && typeof target === "object") {
          if (isOverflow(target)) {
            var newIndex = getMaxIndex(target) + 1;
            target[newIndex] = source;
            setMaxIndex(target, newIndex);
          } else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return [target, source];
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        if (isOverflow(source)) {
          var sourceKeys = Object.keys(source);
          var result = options && options.plainObjects ? { __proto__: null, 0: target } : { 0: target };
          for (var m = 0; m < sourceKeys.length; m++) {
            var oldKey = parseInt(sourceKeys[m], 10);
            result[oldKey + 1] = source[sourceKeys[m]];
          }
          return markOverflow(result, getMaxIndex(source) + 1);
        }
        return [target].concat(source);
      }
      var mergeTarget = target;
      if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
      }
      if (isArray(target) && isArray(source)) {
        source.forEach(function(item, i) {
          if (has.call(target, i)) {
            var targetItem = target[i];
            if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
              target[i] = merge2(targetItem, item, options);
            } else {
              target.push(item);
            }
          } else {
            target[i] = item;
          }
        });
        return target;
      }
      return Object.keys(source).reduce(function(acc, key) {
        var value = source[key];
        if (has.call(acc, key)) {
          acc[key] = merge2(acc[key], value, options);
        } else {
          acc[key] = value;
        }
        return acc;
      }, mergeTarget);
    }, "merge");
    var assign = /* @__PURE__ */ __name(function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function(acc, key) {
        acc[key] = source[key];
        return acc;
      }, target);
    }, "assignSingleSource");
    var decode = /* @__PURE__ */ __name(function(str, defaultDecoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    }, "decode");
    var limit = 1024;
    var encode = /* @__PURE__ */ __name(function encode2(str, defaultEncoder, charset, kind, format) {
      if (str.length === 0) {
        return str;
      }
      var string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(str);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      var out = "";
      for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        var arr = [];
        for (var i = 0; i < segment.length; ++i) {
          var c = segment.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hexTable[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    }, "encode");
    var compact = /* @__PURE__ */ __name(function compact2(value) {
      var queue = [{ obj: { o: value }, prop: "o" }];
      var refs = [];
      for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];
        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
          var key = keys[j];
          var val = obj[key];
          if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
            queue.push({ obj, prop: key });
            refs.push(val);
          }
        }
      }
      compactQueue(queue);
      return value;
    }, "compact");
    var isRegExp = /* @__PURE__ */ __name(function isRegExp2(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    }, "isRegExp");
    var isBuffer = /* @__PURE__ */ __name(function isBuffer2(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    }, "isBuffer");
    var combine = /* @__PURE__ */ __name(function combine2(a, b, arrayLimit, plainObjects) {
      if (isOverflow(a)) {
        var newIndex = getMaxIndex(a) + 1;
        a[newIndex] = b;
        setMaxIndex(a, newIndex);
        return a;
      }
      var result = [].concat(a, b);
      if (result.length > arrayLimit) {
        return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
      }
      return result;
    }, "combine");
    var maybeMap = /* @__PURE__ */ __name(function maybeMap2(val, fn) {
      if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
          mapped.push(fn(val[i]));
        }
        return mapped;
      }
      return fn(val);
    }, "maybeMap");
    module.exports = {
      arrayToObject,
      assign,
      combine,
      compact,
      decode,
      encode,
      isBuffer,
      isOverflow,
      isRegExp,
      maybeMap,
      merge
    };
  }
});

// ../node_modules/qs/lib/stringify.js
var require_stringify = __commonJS({
  "../node_modules/qs/lib/stringify.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var getSideChannel = require_side_channel();
    var utils = require_utils();
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var arrayPrefixGenerators = {
      brackets: /* @__PURE__ */ __name(function brackets(prefix) {
        return prefix + "[]";
      }, "brackets"),
      comma: "comma",
      indices: /* @__PURE__ */ __name(function indices(prefix, key) {
        return prefix + "[" + key + "]";
      }, "indices"),
      repeat: /* @__PURE__ */ __name(function repeat(prefix) {
        return prefix;
      }, "repeat")
    };
    var isArray = Array.isArray;
    var push = Array.prototype.push;
    var pushToArray = /* @__PURE__ */ __name(function(arr, valueOrArray) {
      push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
    }, "pushToArray");
    var toISO = Date.prototype.toISOString;
    var defaultFormat = formats["default"];
    var defaults = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      commaRoundTrip: false,
      delimiter: "&",
      encode: true,
      encodeDotInKeys: false,
      encoder: utils.encode,
      encodeValuesOnly: false,
      filter: void 0,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: /* @__PURE__ */ __name(function serializeDate(date) {
        return toISO.call(date);
      }, "serializeDate"),
      skipNulls: false,
      strictNullHandling: false
    };
    var isNonNullishPrimitive = /* @__PURE__ */ __name(function isNonNullishPrimitive2(v) {
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
    }, "isNonNullishPrimitive");
    var sentinel = {};
    var stringify2 = /* @__PURE__ */ __name(function stringify3(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
      var obj = object;
      var tmpSc = sideChannel;
      var step = 0;
      var findFlag = false;
      while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            findFlag = true;
          }
        }
        if (typeof tmpSc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      if (typeof filter === "function") {
        obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
        obj = serializeDate(obj);
      } else if (generateArrayPrefix === "comma" && isArray(obj)) {
        obj = utils.maybeMap(obj, function(value2) {
          if (value2 instanceof Date) {
            return serializeDate(value2);
          }
          return value2;
        });
      }
      if (obj === null) {
        if (strictNullHandling) {
          return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
        }
        obj = "";
      }
      if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
          var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
          return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
        }
        return [formatter(prefix) + "=" + formatter(String(obj))];
      }
      var values = [];
      if (typeof obj === "undefined") {
        return values;
      }
      var objKeys;
      if (generateArrayPrefix === "comma" && isArray(obj)) {
        if (encodeValuesOnly && encoder) {
          obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
      } else if (isArray(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
      }
      var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
      var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
      if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
        return adjustedPrefix + "[]";
      }
      for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
        if (skipNulls && value === null) {
          continue;
        }
        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify3(
          value,
          keyPrefix,
          generateArrayPrefix,
          commaRoundTrip,
          allowEmptyArrays,
          strictNullHandling,
          skipNulls,
          encodeDotInKeys,
          generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
          filter,
          sort,
          allowDots,
          serializeDate,
          format,
          formatter,
          encodeValuesOnly,
          charset,
          valueSideChannel
        ));
      }
      return values;
    }, "stringify");
    var normalizeStringifyOptions = /* @__PURE__ */ __name(function normalizeStringifyOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      var charset = opts.charset || defaults.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      var format = formats["default"];
      if (typeof opts.format !== "undefined") {
        if (!has.call(formats.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format = opts.format;
      }
      var formatter = formats.formatters[format];
      var filter = defaults.filter;
      if (typeof opts.filter === "function" || isArray(opts.filter)) {
        filter = opts.filter;
      }
      var arrayFormat;
      if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter,
        format,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
      };
    }, "normalizeStringifyOptions");
    module.exports = function(object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);
      var objKeys;
      var filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj = filter("", obj);
      } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }
      var keys = [];
      if (typeof obj !== "object" || obj === null) {
        return "";
      }
      var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
      var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!objKeys) {
        objKeys = Object.keys(obj);
      }
      if (options.sort) {
        objKeys.sort(options.sort);
      }
      var sideChannel = getSideChannel();
      for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = obj[key];
        if (options.skipNulls && value === null) {
          continue;
        }
        pushToArray(keys, stringify2(
          value,
          key,
          generateArrayPrefix,
          commaRoundTrip,
          options.allowEmptyArrays,
          options.strictNullHandling,
          options.skipNulls,
          options.encodeDotInKeys,
          options.encode ? options.encoder : null,
          options.filter,
          options.sort,
          options.allowDots,
          options.serializeDate,
          options.format,
          options.formatter,
          options.encodeValuesOnly,
          options.charset,
          sideChannel
        ));
      }
      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B&";
        } else {
          prefix += "utf8=%E2%9C%93&";
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    };
  }
});

// ../node_modules/qs/lib/parse.js
var require_parse = __commonJS({
  "../node_modules/qs/lib/parse.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var utils = require_utils();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var defaults = {
      allowDots: false,
      allowEmptyArrays: false,
      allowPrototypes: false,
      allowSparse: false,
      arrayLimit: 20,
      charset: "utf-8",
      charsetSentinel: false,
      comma: false,
      decodeDotInKeys: false,
      decoder: utils.decode,
      delimiter: "&",
      depth: 5,
      duplicates: "combine",
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1e3,
      parseArrays: true,
      plainObjects: false,
      strictDepth: false,
      strictNullHandling: false,
      throwOnLimitExceeded: false
    };
    var interpretNumericEntities = /* @__PURE__ */ __name(function(str) {
      return str.replace(/&#(\d+);/g, function($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
      });
    }, "interpretNumericEntities");
    var parseArrayValue = /* @__PURE__ */ __name(function(val, options, currentArrayLength) {
      if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
        return val.split(",");
      }
      if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
      }
      return val;
    }, "parseArrayValue");
    var isoSentinel = "utf8=%26%2310003%3B";
    var charsetSentinel = "utf8=%E2%9C%93";
    var parseValues = /* @__PURE__ */ __name(function parseQueryStringValues(str, options) {
      var obj = { __proto__: null };
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
      cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
      var parts = cleanStr.split(
        options.delimiter,
        options.throwOnLimitExceeded ? limit + 1 : limit
      );
      if (options.throwOnLimitExceeded && parts.length > limit) {
        throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
      }
      var skipIndex = -1;
      var i;
      var charset = options.charset;
      if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
          if (parts[i].indexOf("utf8=") === 0) {
            if (parts[i] === charsetSentinel) {
              charset = "utf-8";
            } else if (parts[i] === isoSentinel) {
              charset = "iso-8859-1";
            }
            skipIndex = i;
            i = parts.length;
          }
        }
      }
      for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
          continue;
        }
        var part = parts[i];
        var bracketEqualsPos = part.indexOf("]=");
        var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
        var key;
        var val;
        if (pos === -1) {
          key = options.decoder(part, defaults.decoder, charset, "key");
          val = options.strictNullHandling ? null : "";
        } else {
          key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
          if (key !== null) {
            val = utils.maybeMap(
              parseArrayValue(
                part.slice(pos + 1),
                options,
                isArray(obj[key]) ? obj[key].length : 0
              ),
              function(encodedVal) {
                return options.decoder(encodedVal, defaults.decoder, charset, "value");
              }
            );
          }
        }
        if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
          val = interpretNumericEntities(String(val));
        }
        if (part.indexOf("[]=") > -1) {
          val = isArray(val) ? [val] : val;
        }
        if (key !== null) {
          var existing = has.call(obj, key);
          if (existing && options.duplicates === "combine") {
            obj[key] = utils.combine(
              obj[key],
              val,
              options.arrayLimit,
              options.plainObjects
            );
          } else if (!existing || options.duplicates === "last") {
            obj[key] = val;
          }
        }
      }
      return obj;
    }, "parseQueryStringValues");
    var parseObject = /* @__PURE__ */ __name(function(chain, val, options, valuesParsed) {
      var currentArrayLength = 0;
      if (chain.length > 0 && chain[chain.length - 1] === "[]") {
        var parentKey = chain.slice(0, -1).join("");
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
      }
      var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
      for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];
        if (root === "[]" && options.parseArrays) {
          if (utils.isOverflow(leaf)) {
            obj = leaf;
          } else {
            obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine(
              [],
              leaf,
              options.arrayLimit,
              options.plainObjects
            );
          }
        } else {
          obj = options.plainObjects ? { __proto__: null } : {};
          var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
          var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
          var index = parseInt(decodedRoot, 10);
          if (!options.parseArrays && decodedRoot === "") {
            obj = { 0: leaf };
          } else if (!isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
            obj = [];
            obj[index] = leaf;
          } else if (decodedRoot !== "__proto__") {
            obj[decodedRoot] = leaf;
          }
        }
        leaf = obj;
      }
      return leaf;
    }, "parseObject");
    var splitKeyIntoSegments = /* @__PURE__ */ __name(function splitKeyIntoSegments2(givenKey, options) {
      var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
      if (options.depth <= 0) {
        if (!options.plainObjects && has.call(Object.prototype, key)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        return [key];
      }
      var brackets = /(\[[^[\]]*])/;
      var child = /(\[[^[\]]*])/g;
      var segment = brackets.exec(key);
      var parent = segment ? key.slice(0, segment.index) : key;
      var keys = [];
      if (parent) {
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys.push(parent);
      }
      var i = 0;
      while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        var segmentContent = segment[1].slice(1, -1);
        if (!options.plainObjects && has.call(Object.prototype, segmentContent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys.push(segment[1]);
      }
      if (segment) {
        if (options.strictDepth === true) {
          throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
        }
        keys.push("[" + key.slice(segment.index) + "]");
      }
      return keys;
    }, "splitKeyIntoSegments");
    var parseKeys = /* @__PURE__ */ __name(function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
        return;
      }
      var keys = splitKeyIntoSegments(givenKey, options);
      if (!keys) {
        return;
      }
      return parseObject(keys, val, options, valuesParsed);
    }, "parseQueryStringKeys");
    var normalizeParseOptions = /* @__PURE__ */ __name(function normalizeParseOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
        throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
        throw new TypeError("Decoder has to be a function.");
      }
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
        throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
      }
      var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
      var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
      if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
        throw new TypeError("The duplicates option must be either combine, first, or last");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
        duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
        strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
      };
    }, "normalizeParseOptions");
    module.exports = function(str, opts) {
      var options = normalizeParseOptions(opts);
      if (str === "" || str === null || typeof str === "undefined") {
        return options.plainObjects ? { __proto__: null } : {};
      }
      var tempObj = typeof str === "string" ? parseValues(str, options) : str;
      var obj = options.plainObjects ? { __proto__: null } : {};
      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
        obj = utils.merge(obj, newObj, options);
      }
      if (options.allowSparse === true) {
        return obj;
      }
      return utils.compact(obj);
    };
  }
});

// ../node_modules/qs/lib/index.js
var require_lib = __commonJS({
  "../node_modules/qs/lib/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var stringify2 = require_stringify();
    var parse2 = require_parse();
    var formats = require_formats();
    module.exports = {
      formats,
      parse: parse2,
      stringify: stringify2
    };
  }
});

// ../node_modules/stripe/esm/utils.js
function isOptionsHash(o) {
  return o && typeof o === "object" && OPTIONS_KEYS.some((prop) => Object.prototype.hasOwnProperty.call(o, prop));
}
function queryStringifyRequestData(data, apiMode) {
  return qs.stringify(data, {
    serializeDate: /* @__PURE__ */ __name((d) => Math.floor(d.getTime() / 1e3).toString(), "serializeDate"),
    arrayFormat: apiMode == "v2" ? "repeat" : "indices"
  }).replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function isValidEncodeUriComponentType(value) {
  return ["number", "string", "boolean"].includes(typeof value);
}
function extractUrlParams(path) {
  const params = path.match(/\{\w+\}/g);
  if (!params) {
    return [];
  }
  return params.map((param) => param.replace(/[{}]/g, ""));
}
function getDataFromArgs(args) {
  if (!Array.isArray(args) || !args[0] || typeof args[0] !== "object") {
    return {};
  }
  if (!isOptionsHash(args[0])) {
    return args.shift();
  }
  const argKeys = Object.keys(args[0]);
  const optionKeysInArgs = argKeys.filter((key) => OPTIONS_KEYS.includes(key));
  if (optionKeysInArgs.length > 0 && optionKeysInArgs.length !== argKeys.length) {
    emitWarning2(`Options found in arguments (${optionKeysInArgs.join(", ")}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`);
  }
  return {};
}
function getOptionsFromArgs(args) {
  const opts = {
    host: null,
    headers: {},
    settings: {},
    streaming: false
  };
  if (args.length > 0) {
    const arg = args[args.length - 1];
    if (typeof arg === "string") {
      opts.authenticator = createApiKeyAuthenticator(args.pop());
    } else if (isOptionsHash(arg)) {
      const params = Object.assign({}, args.pop());
      const extraKeys = Object.keys(params).filter((key) => !OPTIONS_KEYS.includes(key));
      if (extraKeys.length) {
        emitWarning2(`Invalid options found (${extraKeys.join(", ")}); ignoring.`);
      }
      if (params.apiKey) {
        opts.authenticator = createApiKeyAuthenticator(params.apiKey);
      }
      if (params.idempotencyKey) {
        opts.headers["Idempotency-Key"] = params.idempotencyKey;
      }
      if (params.stripeAccount) {
        opts.headers["Stripe-Account"] = params.stripeAccount;
      }
      if (params.stripeContext) {
        if (opts.headers["Stripe-Account"]) {
          throw new Error("Can't specify both stripeAccount and stripeContext.");
        }
        opts.headers["Stripe-Context"] = params.stripeContext;
      }
      if (params.apiVersion) {
        opts.headers["Stripe-Version"] = params.apiVersion;
      }
      if (Number.isInteger(params.maxNetworkRetries)) {
        opts.settings.maxNetworkRetries = params.maxNetworkRetries;
      }
      if (Number.isInteger(params.timeout)) {
        opts.settings.timeout = params.timeout;
      }
      if (params.host) {
        opts.host = params.host;
      }
      if (params.authenticator) {
        if (params.apiKey) {
          throw new Error("Can't specify both apiKey and authenticator.");
        }
        if (typeof params.authenticator !== "function") {
          throw new Error("The authenticator must be a function receiving a request as the first parameter.");
        }
        opts.authenticator = params.authenticator;
      }
      if (params.additionalHeaders) {
        opts.headers = params.additionalHeaders;
      }
      if (params.streaming) {
        opts.streaming = true;
      }
    }
  }
  return opts;
}
function protoExtend(sub) {
  const Super = this;
  const Constructor = Object.prototype.hasOwnProperty.call(sub, "constructor") ? sub.constructor : function(...args) {
    Super.apply(this, args);
  };
  Object.assign(Constructor, Super);
  Constructor.prototype = Object.create(Super.prototype);
  Object.assign(Constructor.prototype, sub);
  return Constructor;
}
function removeNullish(obj) {
  if (typeof obj !== "object") {
    throw new Error("Argument must be an object");
  }
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key] != null) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}
function normalizeHeaders(obj) {
  if (!(obj && typeof obj === "object")) {
    return obj;
  }
  return Object.keys(obj).reduce((result, header) => {
    result[normalizeHeader(header)] = obj[header];
    return result;
  }, {});
}
function normalizeHeader(header) {
  return header.split("-").map((text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()).join("-");
}
function callbackifyPromiseWithTimeout(promise, callback) {
  if (callback) {
    return promise.then((res) => {
      setTimeout(() => {
        callback(null, res);
      }, 0);
    }, (err) => {
      setTimeout(() => {
        callback(err, null);
      }, 0);
    });
  }
  return promise;
}
function pascalToCamelCase(name) {
  if (name === "OAuth") {
    return "oauth";
  } else {
    return name[0].toLowerCase() + name.substring(1);
  }
}
function emitWarning2(warning) {
  if (typeof process.emitWarning !== "function") {
    return console.warn(`Stripe: ${warning}`);
  }
  return process.emitWarning(warning, "Stripe");
}
function isObject(obj) {
  const type = typeof obj;
  return (type === "function" || type === "object") && !!obj;
}
function flattenAndStringify(data) {
  const result = {};
  const step = /* @__PURE__ */ __name((obj, prevKey) => {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prevKey ? `${prevKey}[${key}]` : key;
      if (isObject(value)) {
        if (!(value instanceof Uint8Array) && !Object.prototype.hasOwnProperty.call(value, "data")) {
          return step(value, newKey);
        } else {
          result[newKey] = value;
        }
      } else {
        result[newKey] = String(value);
      }
    });
  }, "step");
  step(data, null);
  return result;
}
function validateInteger(name, n, defaultVal) {
  if (!Number.isInteger(n)) {
    if (defaultVal !== void 0) {
      return defaultVal;
    } else {
      throw new Error(`${name} must be an integer`);
    }
  }
  return n;
}
function determineProcessUserAgentProperties() {
  return typeof process === "undefined" ? {} : {
    lang_version: process.version,
    platform: process.platform
  };
}
function createApiKeyAuthenticator(apiKey) {
  const authenticator = /* @__PURE__ */ __name((request) => {
    request.headers.Authorization = "Bearer " + apiKey;
    return Promise.resolve();
  }, "authenticator");
  authenticator._apiKey = apiKey;
  return authenticator;
}
function dateTimeReplacer(key, value) {
  if (this[key] instanceof Date) {
    return Math.floor(this[key].getTime() / 1e3).toString();
  }
  return value;
}
function jsonStringifyRequestData(data) {
  return JSON.stringify(data, dateTimeReplacer);
}
function getAPIMode(path) {
  if (!path) {
    return "v1";
  }
  return path.startsWith("/v2") ? "v2" : "v1";
}
function parseHttpHeaderAsString(header) {
  if (Array.isArray(header)) {
    return header.join(", ");
  }
  return String(header);
}
function parseHttpHeaderAsNumber(header) {
  const number = Array.isArray(header) ? header[0] : header;
  return Number(number);
}
function parseHeadersForFetch(headers) {
  return Object.entries(headers).map(([key, value]) => {
    return [key, parseHttpHeaderAsString(value)];
  });
}
var qs, OPTIONS_KEYS, makeURLInterpolator;
var init_utils2 = __esm({
  "../node_modules/stripe/esm/utils.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    qs = __toESM(require_lib(), 1);
    OPTIONS_KEYS = [
      "apiKey",
      "idempotencyKey",
      "stripeAccount",
      "apiVersion",
      "maxNetworkRetries",
      "timeout",
      "host",
      "authenticator",
      "stripeContext",
      "additionalHeaders",
      "streaming"
    ];
    __name(isOptionsHash, "isOptionsHash");
    __name(queryStringifyRequestData, "queryStringifyRequestData");
    makeURLInterpolator = /* @__PURE__ */ (() => {
      const rc = {
        "\n": "\\n",
        '"': '\\"',
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
      };
      return (str) => {
        const cleanString = str.replace(/["\n\r\u2028\u2029]/g, ($0) => rc[$0]);
        return (outputs) => {
          return cleanString.replace(/\{([\s\S]+?)\}/g, ($0, $1) => {
            const output = outputs[$1];
            if (isValidEncodeUriComponentType(output))
              return encodeURIComponent(output);
            return "";
          });
        };
      };
    })();
    __name(isValidEncodeUriComponentType, "isValidEncodeUriComponentType");
    __name(extractUrlParams, "extractUrlParams");
    __name(getDataFromArgs, "getDataFromArgs");
    __name(getOptionsFromArgs, "getOptionsFromArgs");
    __name(protoExtend, "protoExtend");
    __name(removeNullish, "removeNullish");
    __name(normalizeHeaders, "normalizeHeaders");
    __name(normalizeHeader, "normalizeHeader");
    __name(callbackifyPromiseWithTimeout, "callbackifyPromiseWithTimeout");
    __name(pascalToCamelCase, "pascalToCamelCase");
    __name(emitWarning2, "emitWarning");
    __name(isObject, "isObject");
    __name(flattenAndStringify, "flattenAndStringify");
    __name(validateInteger, "validateInteger");
    __name(determineProcessUserAgentProperties, "determineProcessUserAgentProperties");
    __name(createApiKeyAuthenticator, "createApiKeyAuthenticator");
    __name(dateTimeReplacer, "dateTimeReplacer");
    __name(jsonStringifyRequestData, "jsonStringifyRequestData");
    __name(getAPIMode, "getAPIMode");
    __name(parseHttpHeaderAsString, "parseHttpHeaderAsString");
    __name(parseHttpHeaderAsNumber, "parseHttpHeaderAsNumber");
    __name(parseHeadersForFetch, "parseHeadersForFetch");
  }
});

// ../node_modules/stripe/esm/net/HttpClient.js
var HttpClient, HttpClientResponse;
var init_HttpClient = __esm({
  "../node_modules/stripe/esm/net/HttpClient.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    HttpClient = class _HttpClient {
      static {
        __name(this, "HttpClient");
      }
      /** The client name used for diagnostics. */
      getClientName() {
        throw new Error("getClientName not implemented.");
      }
      makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
        throw new Error("makeRequest not implemented.");
      }
      /** Helper to make a consistent timeout error across implementations. */
      static makeTimeoutError() {
        const timeoutErr = new TypeError(_HttpClient.TIMEOUT_ERROR_CODE);
        timeoutErr.code = _HttpClient.TIMEOUT_ERROR_CODE;
        return timeoutErr;
      }
    };
    HttpClient.CONNECTION_CLOSED_ERROR_CODES = ["ECONNRESET", "EPIPE"];
    HttpClient.TIMEOUT_ERROR_CODE = "ETIMEDOUT";
    HttpClientResponse = class {
      static {
        __name(this, "HttpClientResponse");
      }
      constructor(statusCode, headers) {
        this._statusCode = statusCode;
        this._headers = headers;
      }
      getStatusCode() {
        return this._statusCode;
      }
      getHeaders() {
        return this._headers;
      }
      getRawResponse() {
        throw new Error("getRawResponse not implemented.");
      }
      toStream(streamCompleteCallback) {
        throw new Error("toStream not implemented.");
      }
      toJSON() {
        throw new Error("toJSON not implemented.");
      }
    };
  }
});

// ../node_modules/stripe/esm/net/FetchHttpClient.js
var FetchHttpClient, FetchHttpClientResponse;
var init_FetchHttpClient = __esm({
  "../node_modules/stripe/esm/net/FetchHttpClient.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils2();
    init_HttpClient();
    FetchHttpClient = class _FetchHttpClient extends HttpClient {
      static {
        __name(this, "FetchHttpClient");
      }
      constructor(fetchFn) {
        super();
        if (!fetchFn) {
          if (!globalThis.fetch) {
            throw new Error("fetch() function not provided and is not defined in the global scope. You must provide a fetch implementation.");
          }
          fetchFn = globalThis.fetch;
        }
        if (globalThis.AbortController) {
          this._fetchFn = _FetchHttpClient.makeFetchWithAbortTimeout(fetchFn);
        } else {
          this._fetchFn = _FetchHttpClient.makeFetchWithRaceTimeout(fetchFn);
        }
      }
      static makeFetchWithRaceTimeout(fetchFn) {
        return (url, init, timeout) => {
          let pendingTimeoutId;
          const timeoutPromise = new Promise((_, reject) => {
            pendingTimeoutId = setTimeout(() => {
              pendingTimeoutId = null;
              reject(HttpClient.makeTimeoutError());
            }, timeout);
          });
          const fetchPromise = fetchFn(url, init);
          return Promise.race([fetchPromise, timeoutPromise]).finally(() => {
            if (pendingTimeoutId) {
              clearTimeout(pendingTimeoutId);
            }
          });
        };
      }
      static makeFetchWithAbortTimeout(fetchFn) {
        return async (url, init, timeout) => {
          const abort2 = new AbortController();
          let timeoutId = setTimeout(() => {
            timeoutId = null;
            abort2.abort(HttpClient.makeTimeoutError());
          }, timeout);
          try {
            return await fetchFn(url, Object.assign(Object.assign({}, init), { signal: abort2.signal }));
          } catch (err) {
            if (err.name === "AbortError") {
              throw HttpClient.makeTimeoutError();
            } else {
              throw err;
            }
          } finally {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          }
        };
      }
      /** @override. */
      getClientName() {
        return "fetch";
      }
      async makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
        const isInsecureConnection = protocol === "http";
        const url = new URL(path, `${isInsecureConnection ? "http" : "https"}://${host}`);
        url.port = port;
        const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
        const body = requestData || (methodHasPayload ? "" : void 0);
        const res = await this._fetchFn(url.toString(), {
          method,
          headers: parseHeadersForFetch(headers),
          body: typeof body === "object" ? JSON.stringify(body) : body
        }, timeout);
        return new FetchHttpClientResponse(res);
      }
    };
    FetchHttpClientResponse = class _FetchHttpClientResponse extends HttpClientResponse {
      static {
        __name(this, "FetchHttpClientResponse");
      }
      constructor(res) {
        super(res.status, _FetchHttpClientResponse._transformHeadersToObject(res.headers));
        this._res = res;
      }
      getRawResponse() {
        return this._res;
      }
      toStream(streamCompleteCallback) {
        streamCompleteCallback();
        return this._res.body;
      }
      toJSON() {
        return this._res.json();
      }
      static _transformHeadersToObject(headers) {
        const headersObj = {};
        for (const entry of headers) {
          if (!Array.isArray(entry) || entry.length != 2) {
            throw new Error("Response objects produced by the fetch function given to FetchHttpClient do not have an iterable headers map. Response#headers should be an iterable object.");
          }
          headersObj[entry[0]] = entry[1];
        }
        return headersObj;
      }
    };
  }
});

// ../node_modules/stripe/esm/crypto/CryptoProvider.js
var CryptoProvider, CryptoProviderOnlySupportsAsyncError;
var init_CryptoProvider = __esm({
  "../node_modules/stripe/esm/crypto/CryptoProvider.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    CryptoProvider = class {
      static {
        __name(this, "CryptoProvider");
      }
      /**
       * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
       * The output HMAC should be encoded in hexadecimal.
       *
       * Sample values for implementations:
       * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
       * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
       */
      computeHMACSignature(payload, secret) {
        throw new Error("computeHMACSignature not implemented.");
      }
      /**
       * Asynchronous version of `computeHMACSignature`. Some implementations may
       * only allow support async signature computation.
       *
       * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
       * The output HMAC should be encoded in hexadecimal.
       *
       * Sample values for implementations:
       * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
       * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
       */
      computeHMACSignatureAsync(payload, secret) {
        throw new Error("computeHMACSignatureAsync not implemented.");
      }
      /**
       * Computes a SHA-256 hash of the data.
       */
      computeSHA256Async(data) {
        throw new Error("computeSHA256 not implemented.");
      }
    };
    CryptoProviderOnlySupportsAsyncError = class extends Error {
      static {
        __name(this, "CryptoProviderOnlySupportsAsyncError");
      }
    };
  }
});

// ../node_modules/stripe/esm/crypto/SubtleCryptoProvider.js
var SubtleCryptoProvider, byteHexMapping;
var init_SubtleCryptoProvider = __esm({
  "../node_modules/stripe/esm/crypto/SubtleCryptoProvider.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_CryptoProvider();
    SubtleCryptoProvider = class extends CryptoProvider {
      static {
        __name(this, "SubtleCryptoProvider");
      }
      constructor(subtleCrypto) {
        super();
        this.subtleCrypto = subtleCrypto || crypto.subtle;
      }
      /** @override */
      computeHMACSignature(payload, secret) {
        throw new CryptoProviderOnlySupportsAsyncError("SubtleCryptoProvider cannot be used in a synchronous context.");
      }
      /** @override */
      async computeHMACSignatureAsync(payload, secret) {
        const encoder = new TextEncoder();
        const key = await this.subtleCrypto.importKey("raw", encoder.encode(secret), {
          name: "HMAC",
          hash: { name: "SHA-256" }
        }, false, ["sign"]);
        const signatureBuffer = await this.subtleCrypto.sign("hmac", key, encoder.encode(payload));
        const signatureBytes = new Uint8Array(signatureBuffer);
        const signatureHexCodes = new Array(signatureBytes.length);
        for (let i = 0; i < signatureBytes.length; i++) {
          signatureHexCodes[i] = byteHexMapping[signatureBytes[i]];
        }
        return signatureHexCodes.join("");
      }
      /** @override */
      async computeSHA256Async(data) {
        return new Uint8Array(await this.subtleCrypto.digest("SHA-256", data));
      }
    };
    byteHexMapping = new Array(256);
    for (let i = 0; i < byteHexMapping.length; i++) {
      byteHexMapping[i] = i.toString(16).padStart(2, "0");
    }
  }
});

// ../node_modules/stripe/esm/platform/PlatformFunctions.js
var PlatformFunctions;
var init_PlatformFunctions = __esm({
  "../node_modules/stripe/esm/platform/PlatformFunctions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_FetchHttpClient();
    init_SubtleCryptoProvider();
    PlatformFunctions = class {
      static {
        __name(this, "PlatformFunctions");
      }
      constructor() {
        this._fetchFn = null;
        this._agent = null;
      }
      /**
       * Gets uname with Node's built-in `exec` function, if available.
       */
      getUname() {
        throw new Error("getUname not implemented.");
      }
      /**
       * Generates a v4 UUID. See https://stackoverflow.com/a/2117523
       */
      uuid4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === "x" ? r : r & 3 | 8;
          return v.toString(16);
        });
      }
      /**
       * Compares strings in constant time.
       */
      secureCompare(a, b) {
        if (a.length !== b.length) {
          return false;
        }
        const len = a.length;
        let result = 0;
        for (let i = 0; i < len; ++i) {
          result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        return result === 0;
      }
      /**
       * Creates an event emitter.
       */
      createEmitter() {
        throw new Error("createEmitter not implemented.");
      }
      /**
       * Checks if the request data is a stream. If so, read the entire stream
       * to a buffer and return the buffer.
       */
      tryBufferData(data) {
        throw new Error("tryBufferData not implemented.");
      }
      /**
       * Creates an HTTP client which uses the Node `http` and `https` packages
       * to issue requests.
       */
      createNodeHttpClient(agent) {
        throw new Error("createNodeHttpClient not implemented.");
      }
      /**
       * Creates an HTTP client for issuing Stripe API requests which uses the Web
       * Fetch API.
       *
       * A fetch function can optionally be passed in as a parameter. If none is
       * passed, will default to the default `fetch` function in the global scope.
       */
      createFetchHttpClient(fetchFn) {
        return new FetchHttpClient(fetchFn);
      }
      /**
       * Creates an HTTP client using runtime-specific APIs.
       */
      createDefaultHttpClient() {
        throw new Error("createDefaultHttpClient not implemented.");
      }
      /**
       * Creates a CryptoProvider which uses the Node `crypto` package for its computations.
       */
      createNodeCryptoProvider() {
        throw new Error("createNodeCryptoProvider not implemented.");
      }
      /**
       * Creates a CryptoProvider which uses the SubtleCrypto interface of the Web Crypto API.
       */
      createSubtleCryptoProvider(subtleCrypto) {
        return new SubtleCryptoProvider(subtleCrypto);
      }
      createDefaultCryptoProvider() {
        throw new Error("createDefaultCryptoProvider not implemented.");
      }
    };
  }
});

// ../node_modules/stripe/esm/StripeEmitter.js
var _StripeEvent, StripeEmitter;
var init_StripeEmitter = __esm({
  "../node_modules/stripe/esm/StripeEmitter.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    _StripeEvent = class extends Event {
      static {
        __name(this, "_StripeEvent");
      }
      constructor(eventName, data) {
        super(eventName);
        this.data = data;
      }
    };
    StripeEmitter = class {
      static {
        __name(this, "StripeEmitter");
      }
      constructor() {
        this.eventTarget = new EventTarget();
        this.listenerMapping = /* @__PURE__ */ new Map();
      }
      on(eventName, listener) {
        const listenerWrapper = /* @__PURE__ */ __name((event) => {
          listener(event.data);
        }, "listenerWrapper");
        this.listenerMapping.set(listener, listenerWrapper);
        return this.eventTarget.addEventListener(eventName, listenerWrapper);
      }
      removeListener(eventName, listener) {
        const listenerWrapper = this.listenerMapping.get(listener);
        this.listenerMapping.delete(listener);
        return this.eventTarget.removeEventListener(eventName, listenerWrapper);
      }
      once(eventName, listener) {
        const listenerWrapper = /* @__PURE__ */ __name((event) => {
          listener(event.data);
        }, "listenerWrapper");
        this.listenerMapping.set(listener, listenerWrapper);
        return this.eventTarget.addEventListener(eventName, listenerWrapper, {
          once: true
        });
      }
      emit(eventName, data) {
        return this.eventTarget.dispatchEvent(new _StripeEvent(eventName, data));
      }
    };
  }
});

// ../node_modules/stripe/esm/platform/WebPlatformFunctions.js
var WebPlatformFunctions;
var init_WebPlatformFunctions = __esm({
  "../node_modules/stripe/esm/platform/WebPlatformFunctions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_PlatformFunctions();
    init_StripeEmitter();
    WebPlatformFunctions = class extends PlatformFunctions {
      static {
        __name(this, "WebPlatformFunctions");
      }
      /** @override */
      getUname() {
        return Promise.resolve(null);
      }
      /** @override */
      createEmitter() {
        return new StripeEmitter();
      }
      /** @override */
      tryBufferData(data) {
        if (data.file.data instanceof ReadableStream) {
          throw new Error("Uploading a file as a stream is not supported in non-Node environments. Please open or upvote an issue at github.com/stripe/stripe-node if you use this, detailing your use-case.");
        }
        return Promise.resolve(data);
      }
      /** @override */
      createNodeHttpClient() {
        throw new Error("Stripe: `createNodeHttpClient()` is not available in non-Node environments. Please use `createFetchHttpClient()` instead.");
      }
      /** @override */
      createDefaultHttpClient() {
        return super.createFetchHttpClient();
      }
      /** @override */
      createNodeCryptoProvider() {
        throw new Error("Stripe: `createNodeCryptoProvider()` is not available in non-Node environments. Please use `createSubtleCryptoProvider()` instead.");
      }
      /** @override */
      createDefaultCryptoProvider() {
        return this.createSubtleCryptoProvider();
      }
    };
  }
});

// ../node_modules/stripe/esm/Error.js
var Error_exports = {};
__export(Error_exports, {
  StripeAPIError: () => StripeAPIError,
  StripeAuthenticationError: () => StripeAuthenticationError,
  StripeCardError: () => StripeCardError,
  StripeConnectionError: () => StripeConnectionError,
  StripeError: () => StripeError,
  StripeIdempotencyError: () => StripeIdempotencyError,
  StripeInvalidGrantError: () => StripeInvalidGrantError,
  StripeInvalidRequestError: () => StripeInvalidRequestError,
  StripePermissionError: () => StripePermissionError,
  StripeRateLimitError: () => StripeRateLimitError,
  StripeSignatureVerificationError: () => StripeSignatureVerificationError,
  StripeUnknownError: () => StripeUnknownError,
  TemporarySessionExpiredError: () => TemporarySessionExpiredError,
  generateV1Error: () => generateV1Error,
  generateV2Error: () => generateV2Error
});
var generateV1Error, generateV2Error, StripeError, StripeCardError, StripeInvalidRequestError, StripeAPIError, StripeAuthenticationError, StripePermissionError, StripeRateLimitError, StripeConnectionError, StripeSignatureVerificationError, StripeIdempotencyError, StripeInvalidGrantError, StripeUnknownError, TemporarySessionExpiredError;
var init_Error = __esm({
  "../node_modules/stripe/esm/Error.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    generateV1Error = /* @__PURE__ */ __name((rawStripeError) => {
      switch (rawStripeError.type) {
        case "card_error":
          return new StripeCardError(rawStripeError);
        case "invalid_request_error":
          return new StripeInvalidRequestError(rawStripeError);
        case "api_error":
          return new StripeAPIError(rawStripeError);
        case "authentication_error":
          return new StripeAuthenticationError(rawStripeError);
        case "rate_limit_error":
          return new StripeRateLimitError(rawStripeError);
        case "idempotency_error":
          return new StripeIdempotencyError(rawStripeError);
        case "invalid_grant":
          return new StripeInvalidGrantError(rawStripeError);
        default:
          return new StripeUnknownError(rawStripeError);
      }
    }, "generateV1Error");
    generateV2Error = /* @__PURE__ */ __name((rawStripeError) => {
      switch (rawStripeError.type) {
        // switchCases: The beginning of the section generated from our OpenAPI spec
        case "temporary_session_expired":
          return new TemporarySessionExpiredError(rawStripeError);
      }
      switch (rawStripeError.code) {
        case "invalid_fields":
          return new StripeInvalidRequestError(rawStripeError);
      }
      return generateV1Error(rawStripeError);
    }, "generateV2Error");
    StripeError = class extends Error {
      static {
        __name(this, "StripeError");
      }
      constructor(raw = {}, type = null) {
        var _a;
        super(raw.message);
        this.type = type || this.constructor.name;
        this.raw = raw;
        this.rawType = raw.type;
        this.code = raw.code;
        this.doc_url = raw.doc_url;
        this.param = raw.param;
        this.detail = raw.detail;
        this.headers = raw.headers;
        this.requestId = raw.requestId;
        this.statusCode = raw.statusCode;
        this.message = (_a = raw.message) !== null && _a !== void 0 ? _a : "";
        this.userMessage = raw.user_message;
        this.charge = raw.charge;
        this.decline_code = raw.decline_code;
        this.payment_intent = raw.payment_intent;
        this.payment_method = raw.payment_method;
        this.payment_method_type = raw.payment_method_type;
        this.setup_intent = raw.setup_intent;
        this.source = raw.source;
      }
    };
    StripeError.generate = generateV1Error;
    StripeCardError = class extends StripeError {
      static {
        __name(this, "StripeCardError");
      }
      constructor(raw = {}) {
        super(raw, "StripeCardError");
      }
    };
    StripeInvalidRequestError = class extends StripeError {
      static {
        __name(this, "StripeInvalidRequestError");
      }
      constructor(raw = {}) {
        super(raw, "StripeInvalidRequestError");
      }
    };
    StripeAPIError = class extends StripeError {
      static {
        __name(this, "StripeAPIError");
      }
      constructor(raw = {}) {
        super(raw, "StripeAPIError");
      }
    };
    StripeAuthenticationError = class extends StripeError {
      static {
        __name(this, "StripeAuthenticationError");
      }
      constructor(raw = {}) {
        super(raw, "StripeAuthenticationError");
      }
    };
    StripePermissionError = class extends StripeError {
      static {
        __name(this, "StripePermissionError");
      }
      constructor(raw = {}) {
        super(raw, "StripePermissionError");
      }
    };
    StripeRateLimitError = class extends StripeError {
      static {
        __name(this, "StripeRateLimitError");
      }
      constructor(raw = {}) {
        super(raw, "StripeRateLimitError");
      }
    };
    StripeConnectionError = class extends StripeError {
      static {
        __name(this, "StripeConnectionError");
      }
      constructor(raw = {}) {
        super(raw, "StripeConnectionError");
      }
    };
    StripeSignatureVerificationError = class extends StripeError {
      static {
        __name(this, "StripeSignatureVerificationError");
      }
      constructor(header, payload, raw = {}) {
        super(raw, "StripeSignatureVerificationError");
        this.header = header;
        this.payload = payload;
      }
    };
    StripeIdempotencyError = class extends StripeError {
      static {
        __name(this, "StripeIdempotencyError");
      }
      constructor(raw = {}) {
        super(raw, "StripeIdempotencyError");
      }
    };
    StripeInvalidGrantError = class extends StripeError {
      static {
        __name(this, "StripeInvalidGrantError");
      }
      constructor(raw = {}) {
        super(raw, "StripeInvalidGrantError");
      }
    };
    StripeUnknownError = class extends StripeError {
      static {
        __name(this, "StripeUnknownError");
      }
      constructor(raw = {}) {
        super(raw, "StripeUnknownError");
      }
    };
    TemporarySessionExpiredError = class extends StripeError {
      static {
        __name(this, "TemporarySessionExpiredError");
      }
      constructor(rawStripeError = {}) {
        super(rawStripeError, "TemporarySessionExpiredError");
      }
    };
  }
});

// ../node_modules/stripe/esm/RequestSender.js
var MAX_RETRY_AFTER_WAIT, RequestSender;
var init_RequestSender = __esm({
  "../node_modules/stripe/esm/RequestSender.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_Error();
    init_HttpClient();
    init_utils2();
    MAX_RETRY_AFTER_WAIT = 60;
    RequestSender = class _RequestSender {
      static {
        __name(this, "RequestSender");
      }
      constructor(stripe, maxBufferedRequestMetric) {
        this._stripe = stripe;
        this._maxBufferedRequestMetric = maxBufferedRequestMetric;
      }
      _addHeadersDirectlyToObject(obj, headers) {
        obj.requestId = headers["request-id"];
        obj.stripeAccount = obj.stripeAccount || headers["stripe-account"];
        obj.apiVersion = obj.apiVersion || headers["stripe-version"];
        obj.idempotencyKey = obj.idempotencyKey || headers["idempotency-key"];
      }
      _makeResponseEvent(requestEvent, statusCode, headers) {
        const requestEndTime = Date.now();
        const requestDurationMs = requestEndTime - requestEvent.request_start_time;
        return removeNullish({
          api_version: headers["stripe-version"],
          account: headers["stripe-account"],
          idempotency_key: headers["idempotency-key"],
          method: requestEvent.method,
          path: requestEvent.path,
          status: statusCode,
          request_id: this._getRequestId(headers),
          elapsed: requestDurationMs,
          request_start_time: requestEvent.request_start_time,
          request_end_time: requestEndTime
        });
      }
      _getRequestId(headers) {
        return headers["request-id"];
      }
      /**
       * Used by methods with spec.streaming === true. For these methods, we do not
       * buffer successful responses into memory or do parse them into stripe
       * objects, we delegate that all of that to the user and pass back the raw
       * http.Response object to the callback.
       *
       * (Unsuccessful responses shouldn't make it here, they should
       * still be buffered/parsed and handled by _jsonResponseHandler -- see
       * makeRequest)
       */
      _streamingResponseHandler(requestEvent, usage, callback) {
        return (res) => {
          const headers = res.getHeaders();
          const streamCompleteCallback = /* @__PURE__ */ __name(() => {
            const responseEvent = this._makeResponseEvent(requestEvent, res.getStatusCode(), headers);
            this._stripe._emitter.emit("response", responseEvent);
            this._recordRequestMetrics(this._getRequestId(headers), responseEvent.elapsed, usage);
          }, "streamCompleteCallback");
          const stream = res.toStream(streamCompleteCallback);
          this._addHeadersDirectlyToObject(stream, headers);
          return callback(null, stream);
        };
      }
      /**
       * Default handler for Stripe responses. Buffers the response into memory,
       * parses the JSON and returns it (i.e. passes it to the callback) if there
       * is no "error" field. Otherwise constructs/passes an appropriate Error.
       */
      _jsonResponseHandler(requestEvent, apiMode, usage, callback) {
        return (res) => {
          const headers = res.getHeaders();
          const requestId = this._getRequestId(headers);
          const statusCode = res.getStatusCode();
          const responseEvent = this._makeResponseEvent(requestEvent, statusCode, headers);
          this._stripe._emitter.emit("response", responseEvent);
          res.toJSON().then((jsonResponse) => {
            if (jsonResponse.error) {
              let err;
              if (typeof jsonResponse.error === "string") {
                jsonResponse.error = {
                  type: jsonResponse.error,
                  message: jsonResponse.error_description
                };
              }
              jsonResponse.error.headers = headers;
              jsonResponse.error.statusCode = statusCode;
              jsonResponse.error.requestId = requestId;
              if (statusCode === 401) {
                err = new StripeAuthenticationError(jsonResponse.error);
              } else if (statusCode === 403) {
                err = new StripePermissionError(jsonResponse.error);
              } else if (statusCode === 429) {
                err = new StripeRateLimitError(jsonResponse.error);
              } else if (apiMode === "v2") {
                err = generateV2Error(jsonResponse.error);
              } else {
                err = generateV1Error(jsonResponse.error);
              }
              throw err;
            }
            return jsonResponse;
          }, (e) => {
            throw new StripeAPIError({
              message: "Invalid JSON received from the Stripe API",
              exception: e,
              requestId: headers["request-id"]
            });
          }).then((jsonResponse) => {
            this._recordRequestMetrics(requestId, responseEvent.elapsed, usage);
            const rawResponse = res.getRawResponse();
            this._addHeadersDirectlyToObject(rawResponse, headers);
            Object.defineProperty(jsonResponse, "lastResponse", {
              enumerable: false,
              writable: false,
              value: rawResponse
            });
            callback(null, jsonResponse);
          }, (e) => callback(e, null));
        };
      }
      static _generateConnectionErrorMessage(requestRetries) {
        return `An error occurred with our connection to Stripe.${requestRetries > 0 ? ` Request was retried ${requestRetries} times.` : ""}`;
      }
      // For more on when and how to retry API requests, see https://stripe.com/docs/error-handling#safely-retrying-requests-with-idempotency
      static _shouldRetry(res, numRetries, maxRetries, error3) {
        if (error3 && numRetries === 0 && HttpClient.CONNECTION_CLOSED_ERROR_CODES.includes(error3.code)) {
          return true;
        }
        if (numRetries >= maxRetries) {
          return false;
        }
        if (!res) {
          return true;
        }
        if (res.getHeaders()["stripe-should-retry"] === "false") {
          return false;
        }
        if (res.getHeaders()["stripe-should-retry"] === "true") {
          return true;
        }
        if (res.getStatusCode() === 409) {
          return true;
        }
        if (res.getStatusCode() >= 500) {
          return true;
        }
        return false;
      }
      _getSleepTimeInMS(numRetries, retryAfter = null) {
        const initialNetworkRetryDelay = this._stripe.getInitialNetworkRetryDelay();
        const maxNetworkRetryDelay = this._stripe.getMaxNetworkRetryDelay();
        let sleepSeconds = Math.min(initialNetworkRetryDelay * Math.pow(2, numRetries - 1), maxNetworkRetryDelay);
        sleepSeconds *= 0.5 * (1 + Math.random());
        sleepSeconds = Math.max(initialNetworkRetryDelay, sleepSeconds);
        if (Number.isInteger(retryAfter) && retryAfter <= MAX_RETRY_AFTER_WAIT) {
          sleepSeconds = Math.max(sleepSeconds, retryAfter);
        }
        return sleepSeconds * 1e3;
      }
      // Max retries can be set on a per request basis. Favor those over the global setting
      _getMaxNetworkRetries(settings = {}) {
        return settings.maxNetworkRetries !== void 0 && Number.isInteger(settings.maxNetworkRetries) ? settings.maxNetworkRetries : this._stripe.getMaxNetworkRetries();
      }
      _defaultIdempotencyKey(method, settings, apiMode) {
        const maxRetries = this._getMaxNetworkRetries(settings);
        const genKey = /* @__PURE__ */ __name(() => `stripe-node-retry-${this._stripe._platformFunctions.uuid4()}`, "genKey");
        if (apiMode === "v2") {
          if (method === "POST" || method === "DELETE") {
            return genKey();
          }
        } else if (apiMode === "v1") {
          if (method === "POST" && maxRetries > 0) {
            return genKey();
          }
        }
        return null;
      }
      _makeHeaders({ contentType, contentLength, apiVersion, clientUserAgent, method, userSuppliedHeaders, userSuppliedSettings, stripeAccount, stripeContext, apiMode }) {
        const defaultHeaders = {
          Accept: "application/json",
          "Content-Type": contentType,
          "User-Agent": this._getUserAgentString(apiMode),
          "X-Stripe-Client-User-Agent": clientUserAgent,
          "X-Stripe-Client-Telemetry": this._getTelemetryHeader(),
          "Stripe-Version": apiVersion,
          "Stripe-Account": stripeAccount,
          "Stripe-Context": stripeContext,
          "Idempotency-Key": this._defaultIdempotencyKey(method, userSuppliedSettings, apiMode)
        };
        const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
        if (methodHasPayload || contentLength) {
          if (!methodHasPayload) {
            emitWarning2(`${method} method had non-zero contentLength but no payload is expected for this verb`);
          }
          defaultHeaders["Content-Length"] = contentLength;
        }
        return Object.assign(
          removeNullish(defaultHeaders),
          // If the user supplied, say 'idempotency-key', override instead of appending by ensuring caps are the same.
          normalizeHeaders(userSuppliedHeaders)
        );
      }
      _getUserAgentString(apiMode) {
        const packageVersion = this._stripe.getConstant("PACKAGE_VERSION");
        const appInfo = this._stripe._appInfo ? this._stripe.getAppInfoAsString() : "";
        return `Stripe/${apiMode} NodeBindings/${packageVersion} ${appInfo}`.trim();
      }
      _getTelemetryHeader() {
        if (this._stripe.getTelemetryEnabled() && this._stripe._prevRequestMetrics.length > 0) {
          const metrics = this._stripe._prevRequestMetrics.shift();
          return JSON.stringify({
            last_request_metrics: metrics
          });
        }
      }
      _recordRequestMetrics(requestId, requestDurationMs, usage) {
        if (this._stripe.getTelemetryEnabled() && requestId) {
          if (this._stripe._prevRequestMetrics.length > this._maxBufferedRequestMetric) {
            emitWarning2("Request metrics buffer is full, dropping telemetry message.");
          } else {
            const m = {
              request_id: requestId,
              request_duration_ms: requestDurationMs
            };
            if (usage && usage.length > 0) {
              m.usage = usage;
            }
            this._stripe._prevRequestMetrics.push(m);
          }
        }
      }
      _rawRequest(method, path, params, options) {
        const requestPromise = new Promise((resolve, reject) => {
          let opts;
          try {
            const requestMethod = method.toUpperCase();
            if (requestMethod !== "POST" && params && Object.keys(params).length !== 0) {
              throw new Error("rawRequest only supports params on POST requests. Please pass null and add your parameters to path.");
            }
            const args = [].slice.call([params, options]);
            const dataFromArgs = getDataFromArgs(args);
            const data = requestMethod === "POST" ? Object.assign({}, dataFromArgs) : null;
            const calculatedOptions = getOptionsFromArgs(args);
            const headers2 = calculatedOptions.headers;
            const authenticator2 = calculatedOptions.authenticator;
            opts = {
              requestMethod,
              requestPath: path,
              bodyData: data,
              queryData: {},
              authenticator: authenticator2,
              headers: headers2,
              host: calculatedOptions.host,
              streaming: !!calculatedOptions.streaming,
              settings: {},
              usage: ["raw_request"]
            };
          } catch (err) {
            reject(err);
            return;
          }
          function requestCallback(err, response) {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          }
          __name(requestCallback, "requestCallback");
          const { headers, settings } = opts;
          const authenticator = opts.authenticator;
          this._request(opts.requestMethod, opts.host, path, opts.bodyData, authenticator, { headers, settings, streaming: opts.streaming }, opts.usage, requestCallback);
        });
        return requestPromise;
      }
      _request(method, host, path, data, authenticator, options, usage = [], callback, requestDataProcessor = null) {
        var _a;
        let requestData;
        authenticator = (_a = authenticator !== null && authenticator !== void 0 ? authenticator : this._stripe._authenticator) !== null && _a !== void 0 ? _a : null;
        const apiMode = getAPIMode(path);
        const retryRequest = /* @__PURE__ */ __name((requestFn, apiVersion, headers, requestRetries, retryAfter) => {
          return setTimeout(requestFn, this._getSleepTimeInMS(requestRetries, retryAfter), apiVersion, headers, requestRetries + 1);
        }, "retryRequest");
        const makeRequest = /* @__PURE__ */ __name((apiVersion, headers, numRetries) => {
          const timeout = options.settings && options.settings.timeout && Number.isInteger(options.settings.timeout) && options.settings.timeout >= 0 ? options.settings.timeout : this._stripe.getApiField("timeout");
          const request = {
            host: host || this._stripe.getApiField("host"),
            port: this._stripe.getApiField("port"),
            path,
            method,
            headers: Object.assign({}, headers),
            body: requestData,
            protocol: this._stripe.getApiField("protocol")
          };
          authenticator(request).then(() => {
            const req = this._stripe.getApiField("httpClient").makeRequest(request.host, request.port, request.path, request.method, request.headers, request.body, request.protocol, timeout);
            const requestStartTime = Date.now();
            const requestEvent = removeNullish({
              api_version: apiVersion,
              account: parseHttpHeaderAsString(headers["Stripe-Account"]),
              idempotency_key: parseHttpHeaderAsString(headers["Idempotency-Key"]),
              method,
              path,
              request_start_time: requestStartTime
            });
            const requestRetries = numRetries || 0;
            const maxRetries = this._getMaxNetworkRetries(options.settings || {});
            this._stripe._emitter.emit("request", requestEvent);
            req.then((res) => {
              if (_RequestSender._shouldRetry(res, requestRetries, maxRetries)) {
                return retryRequest(makeRequest, apiVersion, headers, requestRetries, parseHttpHeaderAsNumber(res.getHeaders()["retry-after"]));
              } else if (options.streaming && res.getStatusCode() < 400) {
                return this._streamingResponseHandler(requestEvent, usage, callback)(res);
              } else {
                return this._jsonResponseHandler(requestEvent, apiMode, usage, callback)(res);
              }
            }).catch((error3) => {
              if (_RequestSender._shouldRetry(null, requestRetries, maxRetries, error3)) {
                return retryRequest(makeRequest, apiVersion, headers, requestRetries, null);
              } else {
                const isTimeoutError = error3.code && error3.code === HttpClient.TIMEOUT_ERROR_CODE;
                return callback(new StripeConnectionError({
                  message: isTimeoutError ? `Request aborted due to timeout being reached (${timeout}ms)` : _RequestSender._generateConnectionErrorMessage(requestRetries),
                  detail: error3
                }));
              }
            });
          }).catch((e) => {
            throw new StripeError({
              message: "Unable to authenticate the request",
              exception: e
            });
          });
        }, "makeRequest");
        const prepareAndMakeRequest = /* @__PURE__ */ __name((error3, data2) => {
          if (error3) {
            return callback(error3);
          }
          requestData = data2;
          this._stripe.getClientUserAgent((clientUserAgent) => {
            const apiVersion = this._stripe.getApiField("version");
            const headers = this._makeHeaders({
              contentType: apiMode == "v2" ? "application/json" : "application/x-www-form-urlencoded",
              contentLength: requestData.length,
              apiVersion,
              clientUserAgent,
              method,
              userSuppliedHeaders: options.headers,
              userSuppliedSettings: options.settings,
              stripeAccount: apiMode == "v2" ? null : this._stripe.getApiField("stripeAccount"),
              stripeContext: apiMode == "v2" ? this._stripe.getApiField("stripeContext") : null,
              apiMode
            });
            makeRequest(apiVersion, headers, 0);
          });
        }, "prepareAndMakeRequest");
        if (requestDataProcessor) {
          requestDataProcessor(method, data, options.headers, prepareAndMakeRequest);
        } else {
          let stringifiedData;
          if (apiMode == "v2") {
            stringifiedData = data ? jsonStringifyRequestData(data) : "";
          } else {
            stringifiedData = queryStringifyRequestData(data || {}, apiMode);
          }
          prepareAndMakeRequest(null, stringifiedData);
        }
      }
    };
  }
});

// ../node_modules/stripe/esm/autoPagination.js
function getAsyncIteratorSymbol() {
  if (typeof Symbol !== "undefined" && Symbol.asyncIterator) {
    return Symbol.asyncIterator;
  }
  return "@@asyncIterator";
}
function getDoneCallback(args) {
  if (args.length < 2) {
    return null;
  }
  const onDone = args[1];
  if (typeof onDone !== "function") {
    throw Error(`The second argument to autoPagingEach, if present, must be a callback function; received ${typeof onDone}`);
  }
  return onDone;
}
function getItemCallback(args) {
  if (args.length === 0) {
    return void 0;
  }
  const onItem = args[0];
  if (typeof onItem !== "function") {
    throw Error(`The first argument to autoPagingEach, if present, must be a callback function; received ${typeof onItem}`);
  }
  if (onItem.length === 2) {
    return onItem;
  }
  if (onItem.length > 2) {
    throw Error(`The \`onItem\` callback function passed to autoPagingEach must accept at most two arguments; got ${onItem}`);
  }
  return /* @__PURE__ */ __name(function _onItem(item, next) {
    const shouldContinue = onItem(item);
    next(shouldContinue);
  }, "_onItem");
}
function getLastId(listResult, reverseIteration) {
  const lastIdx = reverseIteration ? 0 : listResult.data.length - 1;
  const lastItem = listResult.data[lastIdx];
  const lastId = lastItem && lastItem.id;
  if (!lastId) {
    throw Error("Unexpected: No `id` found on the last item while auto-paging a list.");
  }
  return lastId;
}
function makeAutoPagingEach(asyncIteratorNext) {
  return /* @__PURE__ */ __name(function autoPagingEach() {
    const args = [].slice.call(arguments);
    const onItem = getItemCallback(args);
    const onDone = getDoneCallback(args);
    if (args.length > 2) {
      throw Error(`autoPagingEach takes up to two arguments; received ${args}`);
    }
    const autoPagePromise = wrapAsyncIteratorWithCallback(
      asyncIteratorNext,
      // @ts-ignore we might need a null check
      onItem
    );
    return callbackifyPromiseWithTimeout(autoPagePromise, onDone);
  }, "autoPagingEach");
}
function makeAutoPagingToArray(autoPagingEach) {
  return /* @__PURE__ */ __name(function autoPagingToArray(opts, onDone) {
    const limit = opts && opts.limit;
    if (!limit) {
      throw Error("You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({limit: 1000});`.");
    }
    if (limit > 1e4) {
      throw Error("You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists.");
    }
    const promise = new Promise((resolve, reject) => {
      const items = [];
      autoPagingEach((item) => {
        items.push(item);
        if (items.length >= limit) {
          return false;
        }
      }).then(() => {
        resolve(items);
      }).catch(reject);
    });
    return callbackifyPromiseWithTimeout(promise, onDone);
  }, "autoPagingToArray");
}
function wrapAsyncIteratorWithCallback(asyncIteratorNext, onItem) {
  return new Promise((resolve, reject) => {
    function handleIteration(iterResult) {
      if (iterResult.done) {
        resolve();
        return;
      }
      const item = iterResult.value;
      return new Promise((next) => {
        onItem(item, next);
      }).then((shouldContinue) => {
        if (shouldContinue === false) {
          return handleIteration({ done: true, value: void 0 });
        } else {
          return asyncIteratorNext().then(handleIteration);
        }
      });
    }
    __name(handleIteration, "handleIteration");
    asyncIteratorNext().then(handleIteration).catch(reject);
  });
}
function isReverseIteration(requestArgs) {
  const args = [].slice.call(requestArgs);
  const dataFromArgs = getDataFromArgs(args);
  return !!dataFromArgs.ending_before;
}
var V1Iterator, V1ListIterator, V1SearchIterator, V2ListIterator, makeAutoPaginationMethods, makeAutoPaginationMethodsFromIterator;
var init_autoPagination = __esm({
  "../node_modules/stripe/esm/autoPagination.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils2();
    V1Iterator = class {
      static {
        __name(this, "V1Iterator");
      }
      constructor(firstPagePromise, requestArgs, spec, stripeResource) {
        this.index = 0;
        this.pagePromise = firstPagePromise;
        this.promiseCache = { currentPromise: null };
        this.requestArgs = requestArgs;
        this.spec = spec;
        this.stripeResource = stripeResource;
      }
      async iterate(pageResult) {
        if (!(pageResult && pageResult.data && typeof pageResult.data.length === "number")) {
          throw Error("Unexpected: Stripe API response does not have a well-formed `data` array.");
        }
        const reverseIteration = isReverseIteration(this.requestArgs);
        if (this.index < pageResult.data.length) {
          const idx = reverseIteration ? pageResult.data.length - 1 - this.index : this.index;
          const value = pageResult.data[idx];
          this.index += 1;
          return { value, done: false };
        } else if (pageResult.has_more) {
          this.index = 0;
          this.pagePromise = this.getNextPage(pageResult);
          const nextPageResult = await this.pagePromise;
          return this.iterate(nextPageResult);
        }
        return { done: true, value: void 0 };
      }
      /** @abstract */
      getNextPage(_pageResult) {
        throw new Error("Unimplemented");
      }
      async _next() {
        return this.iterate(await this.pagePromise);
      }
      next() {
        if (this.promiseCache.currentPromise) {
          return this.promiseCache.currentPromise;
        }
        const nextPromise = (async () => {
          const ret = await this._next();
          this.promiseCache.currentPromise = null;
          return ret;
        })();
        this.promiseCache.currentPromise = nextPromise;
        return nextPromise;
      }
    };
    V1ListIterator = class extends V1Iterator {
      static {
        __name(this, "V1ListIterator");
      }
      getNextPage(pageResult) {
        const reverseIteration = isReverseIteration(this.requestArgs);
        const lastId = getLastId(pageResult, reverseIteration);
        return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
          [reverseIteration ? "ending_before" : "starting_after"]: lastId
        });
      }
    };
    V1SearchIterator = class extends V1Iterator {
      static {
        __name(this, "V1SearchIterator");
      }
      getNextPage(pageResult) {
        if (!pageResult.next_page) {
          throw Error("Unexpected: Stripe API response does not have a well-formed `next_page` field, but `has_more` was true.");
        }
        return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
          page: pageResult.next_page
        });
      }
    };
    V2ListIterator = class {
      static {
        __name(this, "V2ListIterator");
      }
      constructor(firstPagePromise, requestArgs, spec, stripeResource) {
        this.currentPageIterator = (async () => {
          const page = await firstPagePromise;
          return page.data[Symbol.iterator]();
        })();
        this.nextPageUrl = (async () => {
          const page = await firstPagePromise;
          return page.next_page_url || null;
        })();
        this.requestArgs = requestArgs;
        this.spec = spec;
        this.stripeResource = stripeResource;
      }
      async turnPage() {
        const nextPageUrl = await this.nextPageUrl;
        if (!nextPageUrl)
          return null;
        this.spec.fullPath = nextPageUrl;
        const page = await this.stripeResource._makeRequest([], this.spec, {});
        this.nextPageUrl = Promise.resolve(page.next_page_url);
        this.currentPageIterator = Promise.resolve(page.data[Symbol.iterator]());
        return this.currentPageIterator;
      }
      async next() {
        {
          const result2 = (await this.currentPageIterator).next();
          if (!result2.done)
            return { done: false, value: result2.value };
        }
        const nextPageIterator = await this.turnPage();
        if (!nextPageIterator) {
          return { done: true, value: void 0 };
        }
        const result = nextPageIterator.next();
        if (!result.done)
          return { done: false, value: result.value };
        return { done: true, value: void 0 };
      }
    };
    makeAutoPaginationMethods = /* @__PURE__ */ __name((stripeResource, requestArgs, spec, firstPagePromise) => {
      const apiMode = getAPIMode(spec.fullPath || spec.path);
      if (apiMode !== "v2" && spec.methodType === "search") {
        return makeAutoPaginationMethodsFromIterator(new V1SearchIterator(firstPagePromise, requestArgs, spec, stripeResource));
      }
      if (apiMode !== "v2" && spec.methodType === "list") {
        return makeAutoPaginationMethodsFromIterator(new V1ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
      }
      if (apiMode === "v2" && spec.methodType === "list") {
        return makeAutoPaginationMethodsFromIterator(new V2ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
      }
      return null;
    }, "makeAutoPaginationMethods");
    makeAutoPaginationMethodsFromIterator = /* @__PURE__ */ __name((iterator) => {
      const autoPagingEach = makeAutoPagingEach((...args) => iterator.next(...args));
      const autoPagingToArray = makeAutoPagingToArray(autoPagingEach);
      const autoPaginationMethods = {
        autoPagingEach,
        autoPagingToArray,
        // Async iterator functions:
        next: /* @__PURE__ */ __name(() => iterator.next(), "next"),
        return: /* @__PURE__ */ __name(() => {
          return {};
        }, "return"),
        [getAsyncIteratorSymbol()]: () => {
          return autoPaginationMethods;
        }
      };
      return autoPaginationMethods;
    }, "makeAutoPaginationMethodsFromIterator");
    __name(getAsyncIteratorSymbol, "getAsyncIteratorSymbol");
    __name(getDoneCallback, "getDoneCallback");
    __name(getItemCallback, "getItemCallback");
    __name(getLastId, "getLastId");
    __name(makeAutoPagingEach, "makeAutoPagingEach");
    __name(makeAutoPagingToArray, "makeAutoPagingToArray");
    __name(wrapAsyncIteratorWithCallback, "wrapAsyncIteratorWithCallback");
    __name(isReverseIteration, "isReverseIteration");
  }
});

// ../node_modules/stripe/esm/StripeMethod.js
function stripeMethod(spec) {
  if (spec.path !== void 0 && spec.fullPath !== void 0) {
    throw new Error(`Method spec specified both a 'path' (${spec.path}) and a 'fullPath' (${spec.fullPath}).`);
  }
  return function(...args) {
    const callback = typeof args[args.length - 1] == "function" && args.pop();
    spec.urlParams = extractUrlParams(spec.fullPath || this.createResourcePathWithSymbols(spec.path || ""));
    const requestPromise = callbackifyPromiseWithTimeout(this._makeRequest(args, spec, {}), callback);
    Object.assign(requestPromise, makeAutoPaginationMethods(this, args, spec, requestPromise));
    return requestPromise;
  };
}
var init_StripeMethod = __esm({
  "../node_modules/stripe/esm/StripeMethod.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils2();
    init_autoPagination();
    __name(stripeMethod, "stripeMethod");
  }
});

// ../node_modules/stripe/esm/StripeResource.js
function StripeResource(stripe, deprecatedUrlData) {
  this._stripe = stripe;
  if (deprecatedUrlData) {
    throw new Error("Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids.");
  }
  this.basePath = makeURLInterpolator(
    // @ts-ignore changing type of basePath
    this.basePath || stripe.getApiField("basePath")
  );
  this.resourcePath = this.path;
  this.path = makeURLInterpolator(this.path);
  this.initialize(...arguments);
}
var init_StripeResource = __esm({
  "../node_modules/stripe/esm/StripeResource.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils2();
    init_StripeMethod();
    StripeResource.extend = protoExtend;
    StripeResource.method = stripeMethod;
    StripeResource.MAX_BUFFERED_REQUEST_METRICS = 100;
    __name(StripeResource, "StripeResource");
    StripeResource.prototype = {
      _stripe: null,
      // @ts-ignore the type of path changes in ctor
      path: "",
      resourcePath: "",
      // Methods that don't use the API's default '/v1' path can override it with this setting.
      basePath: null,
      initialize() {
      },
      // Function to override the default data processor. This allows full control
      // over how a StripeResource's request data will get converted into an HTTP
      // body. This is useful for non-standard HTTP requests. The function should
      // take method name, data, and headers as arguments.
      requestDataProcessor: null,
      // Function to add a validation checks before sending the request, errors should
      // be thrown, and they will be passed to the callback/promise.
      validateRequest: null,
      createFullPath(commandPath, urlData) {
        const urlParts = [this.basePath(urlData), this.path(urlData)];
        if (typeof commandPath === "function") {
          const computedCommandPath = commandPath(urlData);
          if (computedCommandPath) {
            urlParts.push(computedCommandPath);
          }
        } else {
          urlParts.push(commandPath);
        }
        return this._joinUrlParts(urlParts);
      },
      // Creates a relative resource path with symbols left in (unlike
      // createFullPath which takes some data to replace them with). For example it
      // might produce: /invoices/{id}
      createResourcePathWithSymbols(pathWithSymbols) {
        if (pathWithSymbols) {
          return `/${this._joinUrlParts([this.resourcePath, pathWithSymbols])}`;
        } else {
          return `/${this.resourcePath}`;
        }
      },
      _joinUrlParts(parts) {
        return parts.join("/").replace(/\/{2,}/g, "/");
      },
      _getRequestOpts(requestArgs, spec, overrideData) {
        var _a;
        const requestMethod = (spec.method || "GET").toUpperCase();
        const usage = spec.usage || [];
        const urlParams = spec.urlParams || [];
        const encode = spec.encode || ((data2) => data2);
        const isUsingFullPath = !!spec.fullPath;
        const commandPath = makeURLInterpolator(isUsingFullPath ? spec.fullPath : spec.path || "");
        const path = isUsingFullPath ? spec.fullPath : this.createResourcePathWithSymbols(spec.path);
        const args = [].slice.call(requestArgs);
        const urlData = urlParams.reduce((urlData2, param) => {
          const arg = args.shift();
          if (typeof arg !== "string") {
            throw new Error(`Stripe: Argument "${param}" must be a string, but got: ${arg} (on API request to \`${requestMethod} ${path}\`)`);
          }
          urlData2[param] = arg;
          return urlData2;
        }, {});
        const dataFromArgs = getDataFromArgs(args);
        const data = encode(Object.assign({}, dataFromArgs, overrideData));
        const options = getOptionsFromArgs(args);
        const host = options.host || spec.host;
        const streaming = !!spec.streaming || !!options.streaming;
        if (args.filter((x) => x != null).length) {
          throw new Error(`Stripe: Unknown arguments (${args}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${requestMethod} \`${path}\`)`);
        }
        const requestPath = isUsingFullPath ? commandPath(urlData) : this.createFullPath(commandPath, urlData);
        const headers = Object.assign(options.headers, spec.headers);
        if (spec.validator) {
          spec.validator(data, { headers });
        }
        const dataInQuery = spec.method === "GET" || spec.method === "DELETE";
        const bodyData = dataInQuery ? null : data;
        const queryData = dataInQuery ? data : {};
        return {
          requestMethod,
          requestPath,
          bodyData,
          queryData,
          authenticator: (_a = options.authenticator) !== null && _a !== void 0 ? _a : null,
          headers,
          host: host !== null && host !== void 0 ? host : null,
          streaming,
          settings: options.settings,
          usage
        };
      },
      _makeRequest(requestArgs, spec, overrideData) {
        return new Promise((resolve, reject) => {
          var _a;
          let opts;
          try {
            opts = this._getRequestOpts(requestArgs, spec, overrideData);
          } catch (err) {
            reject(err);
            return;
          }
          function requestCallback(err, response) {
            if (err) {
              reject(err);
            } else {
              resolve(spec.transformResponseData ? spec.transformResponseData(response) : response);
            }
          }
          __name(requestCallback, "requestCallback");
          const emptyQuery = Object.keys(opts.queryData).length === 0;
          const path = [
            opts.requestPath,
            emptyQuery ? "" : "?",
            queryStringifyRequestData(opts.queryData, getAPIMode(opts.requestPath))
          ].join("");
          const { headers, settings } = opts;
          this._stripe._requestSender._request(opts.requestMethod, opts.host, path, opts.bodyData, opts.authenticator, {
            headers,
            settings,
            streaming: opts.streaming
          }, opts.usage, requestCallback, (_a = this.requestDataProcessor) === null || _a === void 0 ? void 0 : _a.bind(this));
        });
      }
    };
  }
});

// ../node_modules/stripe/esm/Webhooks.js
function createWebhooks(platformFunctions) {
  const Webhook = {
    DEFAULT_TOLERANCE: 300,
    signature: null,
    constructEvent(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      try {
        if (!this.signature) {
          throw new Error("ERR: missing signature helper, unable to verify");
        }
        this.signature.verifyHeader(payload, header, secret, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
      } catch (e) {
        if (e instanceof CryptoProviderOnlySupportsAsyncError) {
          e.message += "\nUse `await constructEventAsync(...)` instead of `constructEvent(...)`";
        }
        throw e;
      }
      const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
      return jsonPayload;
    },
    async constructEventAsync(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      if (!this.signature) {
        throw new Error("ERR: missing signature helper, unable to verify");
      }
      await this.signature.verifyHeaderAsync(payload, header, secret, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
      const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
      return jsonPayload;
    },
    /**
     * Generates a header to be used for webhook mocking
     *
     * @typedef {object} opts
     * @property {number} timestamp - Timestamp of the header. Defaults to Date.now()
     * @property {string} payload - JSON stringified payload object, containing the 'id' and 'object' parameters
     * @property {string} secret - Stripe webhook secret 'whsec_...'
     * @property {string} scheme - Version of API to hit. Defaults to 'v1'.
     * @property {string} signature - Computed webhook signature
     * @property {CryptoProvider} cryptoProvider - Crypto provider to use for computing the signature if none was provided. Defaults to NodeCryptoProvider.
     */
    generateTestHeaderString: /* @__PURE__ */ __name(function(opts) {
      const preparedOpts = prepareOptions(opts);
      const signature2 = preparedOpts.signature || preparedOpts.cryptoProvider.computeHMACSignature(preparedOpts.payloadString, preparedOpts.secret);
      return preparedOpts.generateHeaderString(signature2);
    }, "generateTestHeaderString"),
    generateTestHeaderStringAsync: /* @__PURE__ */ __name(async function(opts) {
      const preparedOpts = prepareOptions(opts);
      const signature2 = preparedOpts.signature || await preparedOpts.cryptoProvider.computeHMACSignatureAsync(preparedOpts.payloadString, preparedOpts.secret);
      return preparedOpts.generateHeaderString(signature2);
    }, "generateTestHeaderStringAsync")
  };
  const signature = {
    EXPECTED_SCHEME: "v1",
    verifyHeader(encodedPayload, encodedHeader, secret, tolerance, cryptoProvider, receivedAt) {
      const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
      const secretContainsWhitespace = /\s/.test(secret);
      cryptoProvider = cryptoProvider || getCryptoProvider();
      const expectedSignature = cryptoProvider.computeHMACSignature(makeHMACContent(payload, details), secret);
      validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
      return true;
    },
    async verifyHeaderAsync(encodedPayload, encodedHeader, secret, tolerance, cryptoProvider, receivedAt) {
      const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
      const secretContainsWhitespace = /\s/.test(secret);
      cryptoProvider = cryptoProvider || getCryptoProvider();
      const expectedSignature = await cryptoProvider.computeHMACSignatureAsync(makeHMACContent(payload, details), secret);
      return validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
    }
  };
  function makeHMACContent(payload, details) {
    return `${details.timestamp}.${payload}`;
  }
  __name(makeHMACContent, "makeHMACContent");
  function parseEventDetails(encodedPayload, encodedHeader, expectedScheme) {
    if (!encodedPayload) {
      throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
        message: "No webhook payload was provided."
      });
    }
    const suspectPayloadType = typeof encodedPayload != "string" && !(encodedPayload instanceof Uint8Array);
    const textDecoder = new TextDecoder("utf8");
    const decodedPayload = encodedPayload instanceof Uint8Array ? textDecoder.decode(encodedPayload) : encodedPayload;
    if (Array.isArray(encodedHeader)) {
      throw new Error("Unexpected: An array was passed as a header, which should not be possible for the stripe-signature header.");
    }
    if (encodedHeader == null || encodedHeader == "") {
      throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
        message: "No stripe-signature header value was provided."
      });
    }
    const decodedHeader = encodedHeader instanceof Uint8Array ? textDecoder.decode(encodedHeader) : encodedHeader;
    const details = parseHeader(decodedHeader, expectedScheme);
    if (!details || details.timestamp === -1) {
      throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
        message: "Unable to extract timestamp and signatures from header"
      });
    }
    if (!details.signatures.length) {
      throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
        message: "No signatures found with expected scheme"
      });
    }
    return {
      decodedPayload,
      decodedHeader,
      details,
      suspectPayloadType
    };
  }
  __name(parseEventDetails, "parseEventDetails");
  function validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt) {
    const signatureFound = !!details.signatures.filter(platformFunctions.secureCompare.bind(platformFunctions, expectedSignature)).length;
    const docsLocation = "\nLearn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature";
    const whitespaceMessage = secretContainsWhitespace ? "\n\nNote: The provided signing secret contains whitespace. This often indicates an extra newline or space is in the value" : "";
    if (!signatureFound) {
      if (suspectPayloadType) {
        throw new StripeSignatureVerificationError(header, payload, {
          message: "Webhook payload must be provided as a string or a Buffer (https://nodejs.org/api/buffer.html) instance representing the _raw_ request body.Payload was provided as a parsed JavaScript object instead. \nSignature verification is impossible without access to the original signed material. \n" + docsLocation + "\n" + whitespaceMessage
        });
      }
      throw new StripeSignatureVerificationError(header, payload, {
        message: "No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? \n If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.\n" + docsLocation + "\n" + whitespaceMessage
      });
    }
    const timestampAge = Math.floor((typeof receivedAt === "number" ? receivedAt : Date.now()) / 1e3) - details.timestamp;
    if (tolerance > 0 && timestampAge > tolerance) {
      throw new StripeSignatureVerificationError(header, payload, {
        message: "Timestamp outside the tolerance zone"
      });
    }
    return true;
  }
  __name(validateComputedSignature, "validateComputedSignature");
  function parseHeader(header, scheme) {
    if (typeof header !== "string") {
      return null;
    }
    return header.split(",").reduce((accum, item) => {
      const kv = item.split("=");
      if (kv[0] === "t") {
        accum.timestamp = parseInt(kv[1], 10);
      }
      if (kv[0] === scheme) {
        accum.signatures.push(kv[1]);
      }
      return accum;
    }, {
      timestamp: -1,
      signatures: []
    });
  }
  __name(parseHeader, "parseHeader");
  let webhooksCryptoProviderInstance = null;
  function getCryptoProvider() {
    if (!webhooksCryptoProviderInstance) {
      webhooksCryptoProviderInstance = platformFunctions.createDefaultCryptoProvider();
    }
    return webhooksCryptoProviderInstance;
  }
  __name(getCryptoProvider, "getCryptoProvider");
  function prepareOptions(opts) {
    if (!opts) {
      throw new StripeError({
        message: "Options are required"
      });
    }
    const timestamp = Math.floor(opts.timestamp) || Math.floor(Date.now() / 1e3);
    const scheme = opts.scheme || signature.EXPECTED_SCHEME;
    const cryptoProvider = opts.cryptoProvider || getCryptoProvider();
    const payloadString = `${timestamp}.${opts.payload}`;
    const generateHeaderString = /* @__PURE__ */ __name((signature2) => {
      return `t=${timestamp},${scheme}=${signature2}`;
    }, "generateHeaderString");
    return Object.assign(Object.assign({}, opts), {
      timestamp,
      scheme,
      cryptoProvider,
      payloadString,
      generateHeaderString
    });
  }
  __name(prepareOptions, "prepareOptions");
  Webhook.signature = signature;
  return Webhook;
}
var init_Webhooks = __esm({
  "../node_modules/stripe/esm/Webhooks.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_Error();
    init_CryptoProvider();
    __name(createWebhooks, "createWebhooks");
  }
});

// ../node_modules/stripe/esm/apiVersion.js
var ApiVersion;
var init_apiVersion = __esm({
  "../node_modules/stripe/esm/apiVersion.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ApiVersion = "2025-08-27.basil";
  }
});

// ../node_modules/stripe/esm/ResourceNamespace.js
function ResourceNamespace(stripe, resources) {
  for (const name in resources) {
    if (!Object.prototype.hasOwnProperty.call(resources, name)) {
      continue;
    }
    const camelCaseName = name[0].toLowerCase() + name.substring(1);
    const resource = new resources[name](stripe);
    this[camelCaseName] = resource;
  }
}
function resourceNamespace(namespace, resources) {
  return function(stripe) {
    return new ResourceNamespace(stripe, resources);
  };
}
var init_ResourceNamespace = __esm({
  "../node_modules/stripe/esm/ResourceNamespace.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(ResourceNamespace, "ResourceNamespace");
    __name(resourceNamespace, "resourceNamespace");
  }
});

// ../node_modules/stripe/esm/resources/FinancialConnections/Accounts.js
var stripeMethod2, Accounts;
var init_Accounts = __esm({
  "../node_modules/stripe/esm/resources/FinancialConnections/Accounts.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod2 = StripeResource.method;
    Accounts = StripeResource.extend({
      retrieve: stripeMethod2({
        method: "GET",
        fullPath: "/v1/financial_connections/accounts/{account}"
      }),
      list: stripeMethod2({
        method: "GET",
        fullPath: "/v1/financial_connections/accounts",
        methodType: "list"
      }),
      disconnect: stripeMethod2({
        method: "POST",
        fullPath: "/v1/financial_connections/accounts/{account}/disconnect"
      }),
      listOwners: stripeMethod2({
        method: "GET",
        fullPath: "/v1/financial_connections/accounts/{account}/owners",
        methodType: "list"
      }),
      refresh: stripeMethod2({
        method: "POST",
        fullPath: "/v1/financial_connections/accounts/{account}/refresh"
      }),
      subscribe: stripeMethod2({
        method: "POST",
        fullPath: "/v1/financial_connections/accounts/{account}/subscribe"
      }),
      unsubscribe: stripeMethod2({
        method: "POST",
        fullPath: "/v1/financial_connections/accounts/{account}/unsubscribe"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Entitlements/ActiveEntitlements.js
var stripeMethod3, ActiveEntitlements;
var init_ActiveEntitlements = __esm({
  "../node_modules/stripe/esm/resources/Entitlements/ActiveEntitlements.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod3 = StripeResource.method;
    ActiveEntitlements = StripeResource.extend({
      retrieve: stripeMethod3({
        method: "GET",
        fullPath: "/v1/entitlements/active_entitlements/{id}"
      }),
      list: stripeMethod3({
        method: "GET",
        fullPath: "/v1/entitlements/active_entitlements",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Billing/Alerts.js
var stripeMethod4, Alerts;
var init_Alerts = __esm({
  "../node_modules/stripe/esm/resources/Billing/Alerts.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod4 = StripeResource.method;
    Alerts = StripeResource.extend({
      create: stripeMethod4({ method: "POST", fullPath: "/v1/billing/alerts" }),
      retrieve: stripeMethod4({ method: "GET", fullPath: "/v1/billing/alerts/{id}" }),
      list: stripeMethod4({
        method: "GET",
        fullPath: "/v1/billing/alerts",
        methodType: "list"
      }),
      activate: stripeMethod4({
        method: "POST",
        fullPath: "/v1/billing/alerts/{id}/activate"
      }),
      archive: stripeMethod4({
        method: "POST",
        fullPath: "/v1/billing/alerts/{id}/archive"
      }),
      deactivate: stripeMethod4({
        method: "POST",
        fullPath: "/v1/billing/alerts/{id}/deactivate"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Issuing/Authorizations.js
var stripeMethod5, Authorizations;
var init_Authorizations = __esm({
  "../node_modules/stripe/esm/resources/Issuing/Authorizations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod5 = StripeResource.method;
    Authorizations = StripeResource.extend({
      retrieve: stripeMethod5({
        method: "GET",
        fullPath: "/v1/issuing/authorizations/{authorization}"
      }),
      update: stripeMethod5({
        method: "POST",
        fullPath: "/v1/issuing/authorizations/{authorization}"
      }),
      list: stripeMethod5({
        method: "GET",
        fullPath: "/v1/issuing/authorizations",
        methodType: "list"
      }),
      approve: stripeMethod5({
        method: "POST",
        fullPath: "/v1/issuing/authorizations/{authorization}/approve"
      }),
      decline: stripeMethod5({
        method: "POST",
        fullPath: "/v1/issuing/authorizations/{authorization}/decline"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Issuing/Authorizations.js
var stripeMethod6, Authorizations2;
var init_Authorizations2 = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Issuing/Authorizations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod6 = StripeResource.method;
    Authorizations2 = StripeResource.extend({
      create: stripeMethod6({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/authorizations"
      }),
      capture: stripeMethod6({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/capture"
      }),
      expire: stripeMethod6({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/expire"
      }),
      finalizeAmount: stripeMethod6({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/finalize_amount"
      }),
      increment: stripeMethod6({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/increment"
      }),
      respond: stripeMethod6({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/fraud_challenges/respond"
      }),
      reverse: stripeMethod6({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/reverse"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Tax/Calculations.js
var stripeMethod7, Calculations;
var init_Calculations = __esm({
  "../node_modules/stripe/esm/resources/Tax/Calculations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod7 = StripeResource.method;
    Calculations = StripeResource.extend({
      create: stripeMethod7({ method: "POST", fullPath: "/v1/tax/calculations" }),
      retrieve: stripeMethod7({
        method: "GET",
        fullPath: "/v1/tax/calculations/{calculation}"
      }),
      listLineItems: stripeMethod7({
        method: "GET",
        fullPath: "/v1/tax/calculations/{calculation}/line_items",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Issuing/Cardholders.js
var stripeMethod8, Cardholders;
var init_Cardholders = __esm({
  "../node_modules/stripe/esm/resources/Issuing/Cardholders.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod8 = StripeResource.method;
    Cardholders = StripeResource.extend({
      create: stripeMethod8({ method: "POST", fullPath: "/v1/issuing/cardholders" }),
      retrieve: stripeMethod8({
        method: "GET",
        fullPath: "/v1/issuing/cardholders/{cardholder}"
      }),
      update: stripeMethod8({
        method: "POST",
        fullPath: "/v1/issuing/cardholders/{cardholder}"
      }),
      list: stripeMethod8({
        method: "GET",
        fullPath: "/v1/issuing/cardholders",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Issuing/Cards.js
var stripeMethod9, Cards;
var init_Cards = __esm({
  "../node_modules/stripe/esm/resources/Issuing/Cards.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod9 = StripeResource.method;
    Cards = StripeResource.extend({
      create: stripeMethod9({ method: "POST", fullPath: "/v1/issuing/cards" }),
      retrieve: stripeMethod9({ method: "GET", fullPath: "/v1/issuing/cards/{card}" }),
      update: stripeMethod9({ method: "POST", fullPath: "/v1/issuing/cards/{card}" }),
      list: stripeMethod9({
        method: "GET",
        fullPath: "/v1/issuing/cards",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Issuing/Cards.js
var stripeMethod10, Cards2;
var init_Cards2 = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Issuing/Cards.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod10 = StripeResource.method;
    Cards2 = StripeResource.extend({
      deliverCard: stripeMethod10({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/deliver"
      }),
      failCard: stripeMethod10({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/fail"
      }),
      returnCard: stripeMethod10({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/return"
      }),
      shipCard: stripeMethod10({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/ship"
      }),
      submitCard: stripeMethod10({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/submit"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/BillingPortal/Configurations.js
var stripeMethod11, Configurations;
var init_Configurations = __esm({
  "../node_modules/stripe/esm/resources/BillingPortal/Configurations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod11 = StripeResource.method;
    Configurations = StripeResource.extend({
      create: stripeMethod11({
        method: "POST",
        fullPath: "/v1/billing_portal/configurations"
      }),
      retrieve: stripeMethod11({
        method: "GET",
        fullPath: "/v1/billing_portal/configurations/{configuration}"
      }),
      update: stripeMethod11({
        method: "POST",
        fullPath: "/v1/billing_portal/configurations/{configuration}"
      }),
      list: stripeMethod11({
        method: "GET",
        fullPath: "/v1/billing_portal/configurations",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Terminal/Configurations.js
var stripeMethod12, Configurations2;
var init_Configurations2 = __esm({
  "../node_modules/stripe/esm/resources/Terminal/Configurations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod12 = StripeResource.method;
    Configurations2 = StripeResource.extend({
      create: stripeMethod12({
        method: "POST",
        fullPath: "/v1/terminal/configurations"
      }),
      retrieve: stripeMethod12({
        method: "GET",
        fullPath: "/v1/terminal/configurations/{configuration}"
      }),
      update: stripeMethod12({
        method: "POST",
        fullPath: "/v1/terminal/configurations/{configuration}"
      }),
      list: stripeMethod12({
        method: "GET",
        fullPath: "/v1/terminal/configurations",
        methodType: "list"
      }),
      del: stripeMethod12({
        method: "DELETE",
        fullPath: "/v1/terminal/configurations/{configuration}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/ConfirmationTokens.js
var stripeMethod13, ConfirmationTokens;
var init_ConfirmationTokens = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/ConfirmationTokens.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod13 = StripeResource.method;
    ConfirmationTokens = StripeResource.extend({
      create: stripeMethod13({
        method: "POST",
        fullPath: "/v1/test_helpers/confirmation_tokens"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Terminal/ConnectionTokens.js
var stripeMethod14, ConnectionTokens;
var init_ConnectionTokens = __esm({
  "../node_modules/stripe/esm/resources/Terminal/ConnectionTokens.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod14 = StripeResource.method;
    ConnectionTokens = StripeResource.extend({
      create: stripeMethod14({
        method: "POST",
        fullPath: "/v1/terminal/connection_tokens"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Billing/CreditBalanceSummary.js
var stripeMethod15, CreditBalanceSummary;
var init_CreditBalanceSummary = __esm({
  "../node_modules/stripe/esm/resources/Billing/CreditBalanceSummary.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod15 = StripeResource.method;
    CreditBalanceSummary = StripeResource.extend({
      retrieve: stripeMethod15({
        method: "GET",
        fullPath: "/v1/billing/credit_balance_summary"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Billing/CreditBalanceTransactions.js
var stripeMethod16, CreditBalanceTransactions;
var init_CreditBalanceTransactions = __esm({
  "../node_modules/stripe/esm/resources/Billing/CreditBalanceTransactions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod16 = StripeResource.method;
    CreditBalanceTransactions = StripeResource.extend({
      retrieve: stripeMethod16({
        method: "GET",
        fullPath: "/v1/billing/credit_balance_transactions/{id}"
      }),
      list: stripeMethod16({
        method: "GET",
        fullPath: "/v1/billing/credit_balance_transactions",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Billing/CreditGrants.js
var stripeMethod17, CreditGrants;
var init_CreditGrants = __esm({
  "../node_modules/stripe/esm/resources/Billing/CreditGrants.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod17 = StripeResource.method;
    CreditGrants = StripeResource.extend({
      create: stripeMethod17({ method: "POST", fullPath: "/v1/billing/credit_grants" }),
      retrieve: stripeMethod17({
        method: "GET",
        fullPath: "/v1/billing/credit_grants/{id}"
      }),
      update: stripeMethod17({
        method: "POST",
        fullPath: "/v1/billing/credit_grants/{id}"
      }),
      list: stripeMethod17({
        method: "GET",
        fullPath: "/v1/billing/credit_grants",
        methodType: "list"
      }),
      expire: stripeMethod17({
        method: "POST",
        fullPath: "/v1/billing/credit_grants/{id}/expire"
      }),
      voidGrant: stripeMethod17({
        method: "POST",
        fullPath: "/v1/billing/credit_grants/{id}/void"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/CreditReversals.js
var stripeMethod18, CreditReversals;
var init_CreditReversals = __esm({
  "../node_modules/stripe/esm/resources/Treasury/CreditReversals.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod18 = StripeResource.method;
    CreditReversals = StripeResource.extend({
      create: stripeMethod18({
        method: "POST",
        fullPath: "/v1/treasury/credit_reversals"
      }),
      retrieve: stripeMethod18({
        method: "GET",
        fullPath: "/v1/treasury/credit_reversals/{credit_reversal}"
      }),
      list: stripeMethod18({
        method: "GET",
        fullPath: "/v1/treasury/credit_reversals",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Customers.js
var stripeMethod19, Customers;
var init_Customers = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Customers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod19 = StripeResource.method;
    Customers = StripeResource.extend({
      fundCashBalance: stripeMethod19({
        method: "POST",
        fullPath: "/v1/test_helpers/customers/{customer}/fund_cash_balance"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/DebitReversals.js
var stripeMethod20, DebitReversals;
var init_DebitReversals = __esm({
  "../node_modules/stripe/esm/resources/Treasury/DebitReversals.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod20 = StripeResource.method;
    DebitReversals = StripeResource.extend({
      create: stripeMethod20({
        method: "POST",
        fullPath: "/v1/treasury/debit_reversals"
      }),
      retrieve: stripeMethod20({
        method: "GET",
        fullPath: "/v1/treasury/debit_reversals/{debit_reversal}"
      }),
      list: stripeMethod20({
        method: "GET",
        fullPath: "/v1/treasury/debit_reversals",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Issuing/Disputes.js
var stripeMethod21, Disputes;
var init_Disputes = __esm({
  "../node_modules/stripe/esm/resources/Issuing/Disputes.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod21 = StripeResource.method;
    Disputes = StripeResource.extend({
      create: stripeMethod21({ method: "POST", fullPath: "/v1/issuing/disputes" }),
      retrieve: stripeMethod21({
        method: "GET",
        fullPath: "/v1/issuing/disputes/{dispute}"
      }),
      update: stripeMethod21({
        method: "POST",
        fullPath: "/v1/issuing/disputes/{dispute}"
      }),
      list: stripeMethod21({
        method: "GET",
        fullPath: "/v1/issuing/disputes",
        methodType: "list"
      }),
      submit: stripeMethod21({
        method: "POST",
        fullPath: "/v1/issuing/disputes/{dispute}/submit"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Radar/EarlyFraudWarnings.js
var stripeMethod22, EarlyFraudWarnings;
var init_EarlyFraudWarnings = __esm({
  "../node_modules/stripe/esm/resources/Radar/EarlyFraudWarnings.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod22 = StripeResource.method;
    EarlyFraudWarnings = StripeResource.extend({
      retrieve: stripeMethod22({
        method: "GET",
        fullPath: "/v1/radar/early_fraud_warnings/{early_fraud_warning}"
      }),
      list: stripeMethod22({
        method: "GET",
        fullPath: "/v1/radar/early_fraud_warnings",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/V2/Core/EventDestinations.js
var stripeMethod23, EventDestinations;
var init_EventDestinations = __esm({
  "../node_modules/stripe/esm/resources/V2/Core/EventDestinations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod23 = StripeResource.method;
    EventDestinations = StripeResource.extend({
      create: stripeMethod23({
        method: "POST",
        fullPath: "/v2/core/event_destinations"
      }),
      retrieve: stripeMethod23({
        method: "GET",
        fullPath: "/v2/core/event_destinations/{id}"
      }),
      update: stripeMethod23({
        method: "POST",
        fullPath: "/v2/core/event_destinations/{id}"
      }),
      list: stripeMethod23({
        method: "GET",
        fullPath: "/v2/core/event_destinations",
        methodType: "list"
      }),
      del: stripeMethod23({
        method: "DELETE",
        fullPath: "/v2/core/event_destinations/{id}"
      }),
      disable: stripeMethod23({
        method: "POST",
        fullPath: "/v2/core/event_destinations/{id}/disable"
      }),
      enable: stripeMethod23({
        method: "POST",
        fullPath: "/v2/core/event_destinations/{id}/enable"
      }),
      ping: stripeMethod23({
        method: "POST",
        fullPath: "/v2/core/event_destinations/{id}/ping"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/V2/Core/Events.js
var stripeMethod24, Events;
var init_Events = __esm({
  "../node_modules/stripe/esm/resources/V2/Core/Events.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod24 = StripeResource.method;
    Events = StripeResource.extend({
      retrieve(...args) {
        const transformResponseData = /* @__PURE__ */ __name((response) => {
          return this.addFetchRelatedObjectIfNeeded(response);
        }, "transformResponseData");
        return stripeMethod24({
          method: "GET",
          fullPath: "/v2/core/events/{id}",
          transformResponseData
        }).apply(this, args);
      },
      list(...args) {
        const transformResponseData = /* @__PURE__ */ __name((response) => {
          return Object.assign(Object.assign({}, response), { data: response.data.map(this.addFetchRelatedObjectIfNeeded.bind(this)) });
        }, "transformResponseData");
        return stripeMethod24({
          method: "GET",
          fullPath: "/v2/core/events",
          methodType: "list",
          transformResponseData
        }).apply(this, args);
      },
      /**
       * @private
       *
       * For internal use in stripe-node.
       *
       * @param pulledEvent The retrieved event object
       * @returns The retrieved event object with a fetchRelatedObject method,
       * if pulledEvent.related_object is valid (non-null and has a url)
       */
      addFetchRelatedObjectIfNeeded(pulledEvent) {
        if (!pulledEvent.related_object || !pulledEvent.related_object.url) {
          return pulledEvent;
        }
        return Object.assign(Object.assign({}, pulledEvent), { fetchRelatedObject: /* @__PURE__ */ __name(() => (
          // call stripeMethod with 'this' resource to fetch
          // the related object. 'this' is needed to construct
          // and send the request, but the method spec controls
          // the url endpoint and method, so it doesn't matter
          // that 'this' is an Events resource object here
          stripeMethod24({
            method: "GET",
            fullPath: pulledEvent.related_object.url
          }).apply(this, [
            {
              stripeAccount: pulledEvent.context
            }
          ])
        ), "fetchRelatedObject") });
      }
    });
  }
});

// ../node_modules/stripe/esm/resources/Entitlements/Features.js
var stripeMethod25, Features;
var init_Features = __esm({
  "../node_modules/stripe/esm/resources/Entitlements/Features.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod25 = StripeResource.method;
    Features = StripeResource.extend({
      create: stripeMethod25({ method: "POST", fullPath: "/v1/entitlements/features" }),
      retrieve: stripeMethod25({
        method: "GET",
        fullPath: "/v1/entitlements/features/{id}"
      }),
      update: stripeMethod25({
        method: "POST",
        fullPath: "/v1/entitlements/features/{id}"
      }),
      list: stripeMethod25({
        method: "GET",
        fullPath: "/v1/entitlements/features",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/FinancialAccounts.js
var stripeMethod26, FinancialAccounts;
var init_FinancialAccounts = __esm({
  "../node_modules/stripe/esm/resources/Treasury/FinancialAccounts.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod26 = StripeResource.method;
    FinancialAccounts = StripeResource.extend({
      create: stripeMethod26({
        method: "POST",
        fullPath: "/v1/treasury/financial_accounts"
      }),
      retrieve: stripeMethod26({
        method: "GET",
        fullPath: "/v1/treasury/financial_accounts/{financial_account}"
      }),
      update: stripeMethod26({
        method: "POST",
        fullPath: "/v1/treasury/financial_accounts/{financial_account}"
      }),
      list: stripeMethod26({
        method: "GET",
        fullPath: "/v1/treasury/financial_accounts",
        methodType: "list"
      }),
      close: stripeMethod26({
        method: "POST",
        fullPath: "/v1/treasury/financial_accounts/{financial_account}/close"
      }),
      retrieveFeatures: stripeMethod26({
        method: "GET",
        fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
      }),
      updateFeatures: stripeMethod26({
        method: "POST",
        fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Treasury/InboundTransfers.js
var stripeMethod27, InboundTransfers;
var init_InboundTransfers = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Treasury/InboundTransfers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod27 = StripeResource.method;
    InboundTransfers = StripeResource.extend({
      fail: stripeMethod27({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/fail"
      }),
      returnInboundTransfer: stripeMethod27({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/return"
      }),
      succeed: stripeMethod27({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/succeed"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/InboundTransfers.js
var stripeMethod28, InboundTransfers2;
var init_InboundTransfers2 = __esm({
  "../node_modules/stripe/esm/resources/Treasury/InboundTransfers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod28 = StripeResource.method;
    InboundTransfers2 = StripeResource.extend({
      create: stripeMethod28({
        method: "POST",
        fullPath: "/v1/treasury/inbound_transfers"
      }),
      retrieve: stripeMethod28({
        method: "GET",
        fullPath: "/v1/treasury/inbound_transfers/{id}"
      }),
      list: stripeMethod28({
        method: "GET",
        fullPath: "/v1/treasury/inbound_transfers",
        methodType: "list"
      }),
      cancel: stripeMethod28({
        method: "POST",
        fullPath: "/v1/treasury/inbound_transfers/{inbound_transfer}/cancel"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Terminal/Locations.js
var stripeMethod29, Locations;
var init_Locations = __esm({
  "../node_modules/stripe/esm/resources/Terminal/Locations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod29 = StripeResource.method;
    Locations = StripeResource.extend({
      create: stripeMethod29({ method: "POST", fullPath: "/v1/terminal/locations" }),
      retrieve: stripeMethod29({
        method: "GET",
        fullPath: "/v1/terminal/locations/{location}"
      }),
      update: stripeMethod29({
        method: "POST",
        fullPath: "/v1/terminal/locations/{location}"
      }),
      list: stripeMethod29({
        method: "GET",
        fullPath: "/v1/terminal/locations",
        methodType: "list"
      }),
      del: stripeMethod29({
        method: "DELETE",
        fullPath: "/v1/terminal/locations/{location}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Billing/MeterEventAdjustments.js
var stripeMethod30, MeterEventAdjustments;
var init_MeterEventAdjustments = __esm({
  "../node_modules/stripe/esm/resources/Billing/MeterEventAdjustments.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod30 = StripeResource.method;
    MeterEventAdjustments = StripeResource.extend({
      create: stripeMethod30({
        method: "POST",
        fullPath: "/v1/billing/meter_event_adjustments"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/V2/Billing/MeterEventAdjustments.js
var stripeMethod31, MeterEventAdjustments2;
var init_MeterEventAdjustments2 = __esm({
  "../node_modules/stripe/esm/resources/V2/Billing/MeterEventAdjustments.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod31 = StripeResource.method;
    MeterEventAdjustments2 = StripeResource.extend({
      create: stripeMethod31({
        method: "POST",
        fullPath: "/v2/billing/meter_event_adjustments"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/V2/Billing/MeterEventSession.js
var stripeMethod32, MeterEventSession;
var init_MeterEventSession = __esm({
  "../node_modules/stripe/esm/resources/V2/Billing/MeterEventSession.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod32 = StripeResource.method;
    MeterEventSession = StripeResource.extend({
      create: stripeMethod32({
        method: "POST",
        fullPath: "/v2/billing/meter_event_session"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/V2/Billing/MeterEventStream.js
var stripeMethod33, MeterEventStream;
var init_MeterEventStream = __esm({
  "../node_modules/stripe/esm/resources/V2/Billing/MeterEventStream.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod33 = StripeResource.method;
    MeterEventStream = StripeResource.extend({
      create: stripeMethod33({
        method: "POST",
        fullPath: "/v2/billing/meter_event_stream",
        host: "meter-events.stripe.com"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Billing/MeterEvents.js
var stripeMethod34, MeterEvents;
var init_MeterEvents = __esm({
  "../node_modules/stripe/esm/resources/Billing/MeterEvents.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod34 = StripeResource.method;
    MeterEvents = StripeResource.extend({
      create: stripeMethod34({ method: "POST", fullPath: "/v1/billing/meter_events" })
    });
  }
});

// ../node_modules/stripe/esm/resources/V2/Billing/MeterEvents.js
var stripeMethod35, MeterEvents2;
var init_MeterEvents2 = __esm({
  "../node_modules/stripe/esm/resources/V2/Billing/MeterEvents.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod35 = StripeResource.method;
    MeterEvents2 = StripeResource.extend({
      create: stripeMethod35({ method: "POST", fullPath: "/v2/billing/meter_events" })
    });
  }
});

// ../node_modules/stripe/esm/resources/Billing/Meters.js
var stripeMethod36, Meters;
var init_Meters = __esm({
  "../node_modules/stripe/esm/resources/Billing/Meters.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod36 = StripeResource.method;
    Meters = StripeResource.extend({
      create: stripeMethod36({ method: "POST", fullPath: "/v1/billing/meters" }),
      retrieve: stripeMethod36({ method: "GET", fullPath: "/v1/billing/meters/{id}" }),
      update: stripeMethod36({ method: "POST", fullPath: "/v1/billing/meters/{id}" }),
      list: stripeMethod36({
        method: "GET",
        fullPath: "/v1/billing/meters",
        methodType: "list"
      }),
      deactivate: stripeMethod36({
        method: "POST",
        fullPath: "/v1/billing/meters/{id}/deactivate"
      }),
      listEventSummaries: stripeMethod36({
        method: "GET",
        fullPath: "/v1/billing/meters/{id}/event_summaries",
        methodType: "list"
      }),
      reactivate: stripeMethod36({
        method: "POST",
        fullPath: "/v1/billing/meters/{id}/reactivate"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Climate/Orders.js
var stripeMethod37, Orders;
var init_Orders = __esm({
  "../node_modules/stripe/esm/resources/Climate/Orders.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod37 = StripeResource.method;
    Orders = StripeResource.extend({
      create: stripeMethod37({ method: "POST", fullPath: "/v1/climate/orders" }),
      retrieve: stripeMethod37({
        method: "GET",
        fullPath: "/v1/climate/orders/{order}"
      }),
      update: stripeMethod37({
        method: "POST",
        fullPath: "/v1/climate/orders/{order}"
      }),
      list: stripeMethod37({
        method: "GET",
        fullPath: "/v1/climate/orders",
        methodType: "list"
      }),
      cancel: stripeMethod37({
        method: "POST",
        fullPath: "/v1/climate/orders/{order}/cancel"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundPayments.js
var stripeMethod38, OutboundPayments;
var init_OutboundPayments = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundPayments.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod38 = StripeResource.method;
    OutboundPayments = StripeResource.extend({
      update: stripeMethod38({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}"
      }),
      fail: stripeMethod38({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/fail"
      }),
      post: stripeMethod38({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/post"
      }),
      returnOutboundPayment: stripeMethod38({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/return"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/OutboundPayments.js
var stripeMethod39, OutboundPayments2;
var init_OutboundPayments2 = __esm({
  "../node_modules/stripe/esm/resources/Treasury/OutboundPayments.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod39 = StripeResource.method;
    OutboundPayments2 = StripeResource.extend({
      create: stripeMethod39({
        method: "POST",
        fullPath: "/v1/treasury/outbound_payments"
      }),
      retrieve: stripeMethod39({
        method: "GET",
        fullPath: "/v1/treasury/outbound_payments/{id}"
      }),
      list: stripeMethod39({
        method: "GET",
        fullPath: "/v1/treasury/outbound_payments",
        methodType: "list"
      }),
      cancel: stripeMethod39({
        method: "POST",
        fullPath: "/v1/treasury/outbound_payments/{id}/cancel"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundTransfers.js
var stripeMethod40, OutboundTransfers;
var init_OutboundTransfers = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundTransfers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod40 = StripeResource.method;
    OutboundTransfers = StripeResource.extend({
      update: stripeMethod40({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}"
      }),
      fail: stripeMethod40({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/fail"
      }),
      post: stripeMethod40({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/post"
      }),
      returnOutboundTransfer: stripeMethod40({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/return"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/OutboundTransfers.js
var stripeMethod41, OutboundTransfers2;
var init_OutboundTransfers2 = __esm({
  "../node_modules/stripe/esm/resources/Treasury/OutboundTransfers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod41 = StripeResource.method;
    OutboundTransfers2 = StripeResource.extend({
      create: stripeMethod41({
        method: "POST",
        fullPath: "/v1/treasury/outbound_transfers"
      }),
      retrieve: stripeMethod41({
        method: "GET",
        fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}"
      }),
      list: stripeMethod41({
        method: "GET",
        fullPath: "/v1/treasury/outbound_transfers",
        methodType: "list"
      }),
      cancel: stripeMethod41({
        method: "POST",
        fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}/cancel"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Issuing/PersonalizationDesigns.js
var stripeMethod42, PersonalizationDesigns;
var init_PersonalizationDesigns = __esm({
  "../node_modules/stripe/esm/resources/Issuing/PersonalizationDesigns.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod42 = StripeResource.method;
    PersonalizationDesigns = StripeResource.extend({
      create: stripeMethod42({
        method: "POST",
        fullPath: "/v1/issuing/personalization_designs"
      }),
      retrieve: stripeMethod42({
        method: "GET",
        fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
      }),
      update: stripeMethod42({
        method: "POST",
        fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
      }),
      list: stripeMethod42({
        method: "GET",
        fullPath: "/v1/issuing/personalization_designs",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Issuing/PersonalizationDesigns.js
var stripeMethod43, PersonalizationDesigns2;
var init_PersonalizationDesigns2 = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Issuing/PersonalizationDesigns.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod43 = StripeResource.method;
    PersonalizationDesigns2 = StripeResource.extend({
      activate: stripeMethod43({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/activate"
      }),
      deactivate: stripeMethod43({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/deactivate"
      }),
      reject: stripeMethod43({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/reject"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Issuing/PhysicalBundles.js
var stripeMethod44, PhysicalBundles;
var init_PhysicalBundles = __esm({
  "../node_modules/stripe/esm/resources/Issuing/PhysicalBundles.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod44 = StripeResource.method;
    PhysicalBundles = StripeResource.extend({
      retrieve: stripeMethod44({
        method: "GET",
        fullPath: "/v1/issuing/physical_bundles/{physical_bundle}"
      }),
      list: stripeMethod44({
        method: "GET",
        fullPath: "/v1/issuing/physical_bundles",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Climate/Products.js
var stripeMethod45, Products;
var init_Products = __esm({
  "../node_modules/stripe/esm/resources/Climate/Products.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod45 = StripeResource.method;
    Products = StripeResource.extend({
      retrieve: stripeMethod45({
        method: "GET",
        fullPath: "/v1/climate/products/{product}"
      }),
      list: stripeMethod45({
        method: "GET",
        fullPath: "/v1/climate/products",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Terminal/Readers.js
var stripeMethod46, Readers;
var init_Readers = __esm({
  "../node_modules/stripe/esm/resources/Terminal/Readers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod46 = StripeResource.method;
    Readers = StripeResource.extend({
      create: stripeMethod46({ method: "POST", fullPath: "/v1/terminal/readers" }),
      retrieve: stripeMethod46({
        method: "GET",
        fullPath: "/v1/terminal/readers/{reader}"
      }),
      update: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}"
      }),
      list: stripeMethod46({
        method: "GET",
        fullPath: "/v1/terminal/readers",
        methodType: "list"
      }),
      del: stripeMethod46({
        method: "DELETE",
        fullPath: "/v1/terminal/readers/{reader}"
      }),
      cancelAction: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}/cancel_action"
      }),
      collectInputs: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}/collect_inputs"
      }),
      collectPaymentMethod: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}/collect_payment_method"
      }),
      confirmPaymentIntent: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}/confirm_payment_intent"
      }),
      processPaymentIntent: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}/process_payment_intent"
      }),
      processSetupIntent: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}/process_setup_intent"
      }),
      refundPayment: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}/refund_payment"
      }),
      setReaderDisplay: stripeMethod46({
        method: "POST",
        fullPath: "/v1/terminal/readers/{reader}/set_reader_display"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Terminal/Readers.js
var stripeMethod47, Readers2;
var init_Readers2 = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Terminal/Readers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod47 = StripeResource.method;
    Readers2 = StripeResource.extend({
      presentPaymentMethod: stripeMethod47({
        method: "POST",
        fullPath: "/v1/test_helpers/terminal/readers/{reader}/present_payment_method"
      }),
      succeedInputCollection: stripeMethod47({
        method: "POST",
        fullPath: "/v1/test_helpers/terminal/readers/{reader}/succeed_input_collection"
      }),
      timeoutInputCollection: stripeMethod47({
        method: "POST",
        fullPath: "/v1/test_helpers/terminal/readers/{reader}/timeout_input_collection"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedCredits.js
var stripeMethod48, ReceivedCredits;
var init_ReceivedCredits = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedCredits.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod48 = StripeResource.method;
    ReceivedCredits = StripeResource.extend({
      create: stripeMethod48({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/received_credits"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/ReceivedCredits.js
var stripeMethod49, ReceivedCredits2;
var init_ReceivedCredits2 = __esm({
  "../node_modules/stripe/esm/resources/Treasury/ReceivedCredits.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod49 = StripeResource.method;
    ReceivedCredits2 = StripeResource.extend({
      retrieve: stripeMethod49({
        method: "GET",
        fullPath: "/v1/treasury/received_credits/{id}"
      }),
      list: stripeMethod49({
        method: "GET",
        fullPath: "/v1/treasury/received_credits",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedDebits.js
var stripeMethod50, ReceivedDebits;
var init_ReceivedDebits = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedDebits.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod50 = StripeResource.method;
    ReceivedDebits = StripeResource.extend({
      create: stripeMethod50({
        method: "POST",
        fullPath: "/v1/test_helpers/treasury/received_debits"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/ReceivedDebits.js
var stripeMethod51, ReceivedDebits2;
var init_ReceivedDebits2 = __esm({
  "../node_modules/stripe/esm/resources/Treasury/ReceivedDebits.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod51 = StripeResource.method;
    ReceivedDebits2 = StripeResource.extend({
      retrieve: stripeMethod51({
        method: "GET",
        fullPath: "/v1/treasury/received_debits/{id}"
      }),
      list: stripeMethod51({
        method: "GET",
        fullPath: "/v1/treasury/received_debits",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Refunds.js
var stripeMethod52, Refunds;
var init_Refunds = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Refunds.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod52 = StripeResource.method;
    Refunds = StripeResource.extend({
      expire: stripeMethod52({
        method: "POST",
        fullPath: "/v1/test_helpers/refunds/{refund}/expire"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Tax/Registrations.js
var stripeMethod53, Registrations;
var init_Registrations = __esm({
  "../node_modules/stripe/esm/resources/Tax/Registrations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod53 = StripeResource.method;
    Registrations = StripeResource.extend({
      create: stripeMethod53({ method: "POST", fullPath: "/v1/tax/registrations" }),
      retrieve: stripeMethod53({
        method: "GET",
        fullPath: "/v1/tax/registrations/{id}"
      }),
      update: stripeMethod53({
        method: "POST",
        fullPath: "/v1/tax/registrations/{id}"
      }),
      list: stripeMethod53({
        method: "GET",
        fullPath: "/v1/tax/registrations",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Reporting/ReportRuns.js
var stripeMethod54, ReportRuns;
var init_ReportRuns = __esm({
  "../node_modules/stripe/esm/resources/Reporting/ReportRuns.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod54 = StripeResource.method;
    ReportRuns = StripeResource.extend({
      create: stripeMethod54({ method: "POST", fullPath: "/v1/reporting/report_runs" }),
      retrieve: stripeMethod54({
        method: "GET",
        fullPath: "/v1/reporting/report_runs/{report_run}"
      }),
      list: stripeMethod54({
        method: "GET",
        fullPath: "/v1/reporting/report_runs",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Reporting/ReportTypes.js
var stripeMethod55, ReportTypes;
var init_ReportTypes = __esm({
  "../node_modules/stripe/esm/resources/Reporting/ReportTypes.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod55 = StripeResource.method;
    ReportTypes = StripeResource.extend({
      retrieve: stripeMethod55({
        method: "GET",
        fullPath: "/v1/reporting/report_types/{report_type}"
      }),
      list: stripeMethod55({
        method: "GET",
        fullPath: "/v1/reporting/report_types",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Forwarding/Requests.js
var stripeMethod56, Requests;
var init_Requests = __esm({
  "../node_modules/stripe/esm/resources/Forwarding/Requests.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod56 = StripeResource.method;
    Requests = StripeResource.extend({
      create: stripeMethod56({ method: "POST", fullPath: "/v1/forwarding/requests" }),
      retrieve: stripeMethod56({
        method: "GET",
        fullPath: "/v1/forwarding/requests/{id}"
      }),
      list: stripeMethod56({
        method: "GET",
        fullPath: "/v1/forwarding/requests",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Sigma/ScheduledQueryRuns.js
var stripeMethod57, ScheduledQueryRuns;
var init_ScheduledQueryRuns = __esm({
  "../node_modules/stripe/esm/resources/Sigma/ScheduledQueryRuns.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod57 = StripeResource.method;
    ScheduledQueryRuns = StripeResource.extend({
      retrieve: stripeMethod57({
        method: "GET",
        fullPath: "/v1/sigma/scheduled_query_runs/{scheduled_query_run}"
      }),
      list: stripeMethod57({
        method: "GET",
        fullPath: "/v1/sigma/scheduled_query_runs",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Apps/Secrets.js
var stripeMethod58, Secrets;
var init_Secrets = __esm({
  "../node_modules/stripe/esm/resources/Apps/Secrets.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod58 = StripeResource.method;
    Secrets = StripeResource.extend({
      create: stripeMethod58({ method: "POST", fullPath: "/v1/apps/secrets" }),
      list: stripeMethod58({
        method: "GET",
        fullPath: "/v1/apps/secrets",
        methodType: "list"
      }),
      deleteWhere: stripeMethod58({
        method: "POST",
        fullPath: "/v1/apps/secrets/delete"
      }),
      find: stripeMethod58({ method: "GET", fullPath: "/v1/apps/secrets/find" })
    });
  }
});

// ../node_modules/stripe/esm/resources/BillingPortal/Sessions.js
var stripeMethod59, Sessions;
var init_Sessions = __esm({
  "../node_modules/stripe/esm/resources/BillingPortal/Sessions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod59 = StripeResource.method;
    Sessions = StripeResource.extend({
      create: stripeMethod59({
        method: "POST",
        fullPath: "/v1/billing_portal/sessions"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Checkout/Sessions.js
var stripeMethod60, Sessions2;
var init_Sessions2 = __esm({
  "../node_modules/stripe/esm/resources/Checkout/Sessions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod60 = StripeResource.method;
    Sessions2 = StripeResource.extend({
      create: stripeMethod60({ method: "POST", fullPath: "/v1/checkout/sessions" }),
      retrieve: stripeMethod60({
        method: "GET",
        fullPath: "/v1/checkout/sessions/{session}"
      }),
      update: stripeMethod60({
        method: "POST",
        fullPath: "/v1/checkout/sessions/{session}"
      }),
      list: stripeMethod60({
        method: "GET",
        fullPath: "/v1/checkout/sessions",
        methodType: "list"
      }),
      expire: stripeMethod60({
        method: "POST",
        fullPath: "/v1/checkout/sessions/{session}/expire"
      }),
      listLineItems: stripeMethod60({
        method: "GET",
        fullPath: "/v1/checkout/sessions/{session}/line_items",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/FinancialConnections/Sessions.js
var stripeMethod61, Sessions3;
var init_Sessions3 = __esm({
  "../node_modules/stripe/esm/resources/FinancialConnections/Sessions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod61 = StripeResource.method;
    Sessions3 = StripeResource.extend({
      create: stripeMethod61({
        method: "POST",
        fullPath: "/v1/financial_connections/sessions"
      }),
      retrieve: stripeMethod61({
        method: "GET",
        fullPath: "/v1/financial_connections/sessions/{session}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Tax/Settings.js
var stripeMethod62, Settings;
var init_Settings = __esm({
  "../node_modules/stripe/esm/resources/Tax/Settings.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod62 = StripeResource.method;
    Settings = StripeResource.extend({
      retrieve: stripeMethod62({ method: "GET", fullPath: "/v1/tax/settings" }),
      update: stripeMethod62({ method: "POST", fullPath: "/v1/tax/settings" })
    });
  }
});

// ../node_modules/stripe/esm/resources/Climate/Suppliers.js
var stripeMethod63, Suppliers;
var init_Suppliers = __esm({
  "../node_modules/stripe/esm/resources/Climate/Suppliers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod63 = StripeResource.method;
    Suppliers = StripeResource.extend({
      retrieve: stripeMethod63({
        method: "GET",
        fullPath: "/v1/climate/suppliers/{supplier}"
      }),
      list: stripeMethod63({
        method: "GET",
        fullPath: "/v1/climate/suppliers",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/TestClocks.js
var stripeMethod64, TestClocks;
var init_TestClocks = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/TestClocks.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod64 = StripeResource.method;
    TestClocks = StripeResource.extend({
      create: stripeMethod64({
        method: "POST",
        fullPath: "/v1/test_helpers/test_clocks"
      }),
      retrieve: stripeMethod64({
        method: "GET",
        fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
      }),
      list: stripeMethod64({
        method: "GET",
        fullPath: "/v1/test_helpers/test_clocks",
        methodType: "list"
      }),
      del: stripeMethod64({
        method: "DELETE",
        fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
      }),
      advance: stripeMethod64({
        method: "POST",
        fullPath: "/v1/test_helpers/test_clocks/{test_clock}/advance"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Issuing/Tokens.js
var stripeMethod65, Tokens;
var init_Tokens = __esm({
  "../node_modules/stripe/esm/resources/Issuing/Tokens.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod65 = StripeResource.method;
    Tokens = StripeResource.extend({
      retrieve: stripeMethod65({
        method: "GET",
        fullPath: "/v1/issuing/tokens/{token}"
      }),
      update: stripeMethod65({
        method: "POST",
        fullPath: "/v1/issuing/tokens/{token}"
      }),
      list: stripeMethod65({
        method: "GET",
        fullPath: "/v1/issuing/tokens",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/TransactionEntries.js
var stripeMethod66, TransactionEntries;
var init_TransactionEntries = __esm({
  "../node_modules/stripe/esm/resources/Treasury/TransactionEntries.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod66 = StripeResource.method;
    TransactionEntries = StripeResource.extend({
      retrieve: stripeMethod66({
        method: "GET",
        fullPath: "/v1/treasury/transaction_entries/{id}"
      }),
      list: stripeMethod66({
        method: "GET",
        fullPath: "/v1/treasury/transaction_entries",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/FinancialConnections/Transactions.js
var stripeMethod67, Transactions;
var init_Transactions = __esm({
  "../node_modules/stripe/esm/resources/FinancialConnections/Transactions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod67 = StripeResource.method;
    Transactions = StripeResource.extend({
      retrieve: stripeMethod67({
        method: "GET",
        fullPath: "/v1/financial_connections/transactions/{transaction}"
      }),
      list: stripeMethod67({
        method: "GET",
        fullPath: "/v1/financial_connections/transactions",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Issuing/Transactions.js
var stripeMethod68, Transactions2;
var init_Transactions2 = __esm({
  "../node_modules/stripe/esm/resources/Issuing/Transactions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod68 = StripeResource.method;
    Transactions2 = StripeResource.extend({
      retrieve: stripeMethod68({
        method: "GET",
        fullPath: "/v1/issuing/transactions/{transaction}"
      }),
      update: stripeMethod68({
        method: "POST",
        fullPath: "/v1/issuing/transactions/{transaction}"
      }),
      list: stripeMethod68({
        method: "GET",
        fullPath: "/v1/issuing/transactions",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Tax/Transactions.js
var stripeMethod69, Transactions3;
var init_Transactions3 = __esm({
  "../node_modules/stripe/esm/resources/Tax/Transactions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod69 = StripeResource.method;
    Transactions3 = StripeResource.extend({
      retrieve: stripeMethod69({
        method: "GET",
        fullPath: "/v1/tax/transactions/{transaction}"
      }),
      createFromCalculation: stripeMethod69({
        method: "POST",
        fullPath: "/v1/tax/transactions/create_from_calculation"
      }),
      createReversal: stripeMethod69({
        method: "POST",
        fullPath: "/v1/tax/transactions/create_reversal"
      }),
      listLineItems: stripeMethod69({
        method: "GET",
        fullPath: "/v1/tax/transactions/{transaction}/line_items",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TestHelpers/Issuing/Transactions.js
var stripeMethod70, Transactions4;
var init_Transactions4 = __esm({
  "../node_modules/stripe/esm/resources/TestHelpers/Issuing/Transactions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod70 = StripeResource.method;
    Transactions4 = StripeResource.extend({
      createForceCapture: stripeMethod70({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/transactions/create_force_capture"
      }),
      createUnlinkedRefund: stripeMethod70({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/transactions/create_unlinked_refund"
      }),
      refund: stripeMethod70({
        method: "POST",
        fullPath: "/v1/test_helpers/issuing/transactions/{transaction}/refund"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Treasury/Transactions.js
var stripeMethod71, Transactions5;
var init_Transactions5 = __esm({
  "../node_modules/stripe/esm/resources/Treasury/Transactions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod71 = StripeResource.method;
    Transactions5 = StripeResource.extend({
      retrieve: stripeMethod71({
        method: "GET",
        fullPath: "/v1/treasury/transactions/{id}"
      }),
      list: stripeMethod71({
        method: "GET",
        fullPath: "/v1/treasury/transactions",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Radar/ValueListItems.js
var stripeMethod72, ValueListItems;
var init_ValueListItems = __esm({
  "../node_modules/stripe/esm/resources/Radar/ValueListItems.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod72 = StripeResource.method;
    ValueListItems = StripeResource.extend({
      create: stripeMethod72({
        method: "POST",
        fullPath: "/v1/radar/value_list_items"
      }),
      retrieve: stripeMethod72({
        method: "GET",
        fullPath: "/v1/radar/value_list_items/{item}"
      }),
      list: stripeMethod72({
        method: "GET",
        fullPath: "/v1/radar/value_list_items",
        methodType: "list"
      }),
      del: stripeMethod72({
        method: "DELETE",
        fullPath: "/v1/radar/value_list_items/{item}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Radar/ValueLists.js
var stripeMethod73, ValueLists;
var init_ValueLists = __esm({
  "../node_modules/stripe/esm/resources/Radar/ValueLists.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod73 = StripeResource.method;
    ValueLists = StripeResource.extend({
      create: stripeMethod73({ method: "POST", fullPath: "/v1/radar/value_lists" }),
      retrieve: stripeMethod73({
        method: "GET",
        fullPath: "/v1/radar/value_lists/{value_list}"
      }),
      update: stripeMethod73({
        method: "POST",
        fullPath: "/v1/radar/value_lists/{value_list}"
      }),
      list: stripeMethod73({
        method: "GET",
        fullPath: "/v1/radar/value_lists",
        methodType: "list"
      }),
      del: stripeMethod73({
        method: "DELETE",
        fullPath: "/v1/radar/value_lists/{value_list}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Identity/VerificationReports.js
var stripeMethod74, VerificationReports;
var init_VerificationReports = __esm({
  "../node_modules/stripe/esm/resources/Identity/VerificationReports.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod74 = StripeResource.method;
    VerificationReports = StripeResource.extend({
      retrieve: stripeMethod74({
        method: "GET",
        fullPath: "/v1/identity/verification_reports/{report}"
      }),
      list: stripeMethod74({
        method: "GET",
        fullPath: "/v1/identity/verification_reports",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Identity/VerificationSessions.js
var stripeMethod75, VerificationSessions;
var init_VerificationSessions = __esm({
  "../node_modules/stripe/esm/resources/Identity/VerificationSessions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod75 = StripeResource.method;
    VerificationSessions = StripeResource.extend({
      create: stripeMethod75({
        method: "POST",
        fullPath: "/v1/identity/verification_sessions"
      }),
      retrieve: stripeMethod75({
        method: "GET",
        fullPath: "/v1/identity/verification_sessions/{session}"
      }),
      update: stripeMethod75({
        method: "POST",
        fullPath: "/v1/identity/verification_sessions/{session}"
      }),
      list: stripeMethod75({
        method: "GET",
        fullPath: "/v1/identity/verification_sessions",
        methodType: "list"
      }),
      cancel: stripeMethod75({
        method: "POST",
        fullPath: "/v1/identity/verification_sessions/{session}/cancel"
      }),
      redact: stripeMethod75({
        method: "POST",
        fullPath: "/v1/identity/verification_sessions/{session}/redact"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Accounts.js
var stripeMethod76, Accounts2;
var init_Accounts2 = __esm({
  "../node_modules/stripe/esm/resources/Accounts.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod76 = StripeResource.method;
    Accounts2 = StripeResource.extend({
      create: stripeMethod76({ method: "POST", fullPath: "/v1/accounts" }),
      retrieve(id, ...args) {
        if (typeof id === "string") {
          return stripeMethod76({
            method: "GET",
            fullPath: "/v1/accounts/{id}"
          }).apply(this, [id, ...args]);
        } else {
          if (id === null || id === void 0) {
            [].shift.apply([id, ...args]);
          }
          return stripeMethod76({
            method: "GET",
            fullPath: "/v1/account"
          }).apply(this, [id, ...args]);
        }
      },
      update: stripeMethod76({ method: "POST", fullPath: "/v1/accounts/{account}" }),
      list: stripeMethod76({
        method: "GET",
        fullPath: "/v1/accounts",
        methodType: "list"
      }),
      del: stripeMethod76({ method: "DELETE", fullPath: "/v1/accounts/{account}" }),
      createExternalAccount: stripeMethod76({
        method: "POST",
        fullPath: "/v1/accounts/{account}/external_accounts"
      }),
      createLoginLink: stripeMethod76({
        method: "POST",
        fullPath: "/v1/accounts/{account}/login_links"
      }),
      createPerson: stripeMethod76({
        method: "POST",
        fullPath: "/v1/accounts/{account}/persons"
      }),
      deleteExternalAccount: stripeMethod76({
        method: "DELETE",
        fullPath: "/v1/accounts/{account}/external_accounts/{id}"
      }),
      deletePerson: stripeMethod76({
        method: "DELETE",
        fullPath: "/v1/accounts/{account}/persons/{person}"
      }),
      listCapabilities: stripeMethod76({
        method: "GET",
        fullPath: "/v1/accounts/{account}/capabilities",
        methodType: "list"
      }),
      listExternalAccounts: stripeMethod76({
        method: "GET",
        fullPath: "/v1/accounts/{account}/external_accounts",
        methodType: "list"
      }),
      listPersons: stripeMethod76({
        method: "GET",
        fullPath: "/v1/accounts/{account}/persons",
        methodType: "list"
      }),
      reject: stripeMethod76({
        method: "POST",
        fullPath: "/v1/accounts/{account}/reject"
      }),
      retrieveCurrent: stripeMethod76({ method: "GET", fullPath: "/v1/account" }),
      retrieveCapability: stripeMethod76({
        method: "GET",
        fullPath: "/v1/accounts/{account}/capabilities/{capability}"
      }),
      retrieveExternalAccount: stripeMethod76({
        method: "GET",
        fullPath: "/v1/accounts/{account}/external_accounts/{id}"
      }),
      retrievePerson: stripeMethod76({
        method: "GET",
        fullPath: "/v1/accounts/{account}/persons/{person}"
      }),
      updateCapability: stripeMethod76({
        method: "POST",
        fullPath: "/v1/accounts/{account}/capabilities/{capability}"
      }),
      updateExternalAccount: stripeMethod76({
        method: "POST",
        fullPath: "/v1/accounts/{account}/external_accounts/{id}"
      }),
      updatePerson: stripeMethod76({
        method: "POST",
        fullPath: "/v1/accounts/{account}/persons/{person}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/AccountLinks.js
var stripeMethod77, AccountLinks;
var init_AccountLinks = __esm({
  "../node_modules/stripe/esm/resources/AccountLinks.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod77 = StripeResource.method;
    AccountLinks = StripeResource.extend({
      create: stripeMethod77({ method: "POST", fullPath: "/v1/account_links" })
    });
  }
});

// ../node_modules/stripe/esm/resources/AccountSessions.js
var stripeMethod78, AccountSessions;
var init_AccountSessions = __esm({
  "../node_modules/stripe/esm/resources/AccountSessions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod78 = StripeResource.method;
    AccountSessions = StripeResource.extend({
      create: stripeMethod78({ method: "POST", fullPath: "/v1/account_sessions" })
    });
  }
});

// ../node_modules/stripe/esm/resources/ApplePayDomains.js
var stripeMethod79, ApplePayDomains;
var init_ApplePayDomains = __esm({
  "../node_modules/stripe/esm/resources/ApplePayDomains.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod79 = StripeResource.method;
    ApplePayDomains = StripeResource.extend({
      create: stripeMethod79({ method: "POST", fullPath: "/v1/apple_pay/domains" }),
      retrieve: stripeMethod79({
        method: "GET",
        fullPath: "/v1/apple_pay/domains/{domain}"
      }),
      list: stripeMethod79({
        method: "GET",
        fullPath: "/v1/apple_pay/domains",
        methodType: "list"
      }),
      del: stripeMethod79({
        method: "DELETE",
        fullPath: "/v1/apple_pay/domains/{domain}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/ApplicationFees.js
var stripeMethod80, ApplicationFees;
var init_ApplicationFees = __esm({
  "../node_modules/stripe/esm/resources/ApplicationFees.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod80 = StripeResource.method;
    ApplicationFees = StripeResource.extend({
      retrieve: stripeMethod80({
        method: "GET",
        fullPath: "/v1/application_fees/{id}"
      }),
      list: stripeMethod80({
        method: "GET",
        fullPath: "/v1/application_fees",
        methodType: "list"
      }),
      createRefund: stripeMethod80({
        method: "POST",
        fullPath: "/v1/application_fees/{id}/refunds"
      }),
      listRefunds: stripeMethod80({
        method: "GET",
        fullPath: "/v1/application_fees/{id}/refunds",
        methodType: "list"
      }),
      retrieveRefund: stripeMethod80({
        method: "GET",
        fullPath: "/v1/application_fees/{fee}/refunds/{id}"
      }),
      updateRefund: stripeMethod80({
        method: "POST",
        fullPath: "/v1/application_fees/{fee}/refunds/{id}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Balance.js
var stripeMethod81, Balance;
var init_Balance = __esm({
  "../node_modules/stripe/esm/resources/Balance.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod81 = StripeResource.method;
    Balance = StripeResource.extend({
      retrieve: stripeMethod81({ method: "GET", fullPath: "/v1/balance" })
    });
  }
});

// ../node_modules/stripe/esm/resources/BalanceTransactions.js
var stripeMethod82, BalanceTransactions;
var init_BalanceTransactions = __esm({
  "../node_modules/stripe/esm/resources/BalanceTransactions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod82 = StripeResource.method;
    BalanceTransactions = StripeResource.extend({
      retrieve: stripeMethod82({
        method: "GET",
        fullPath: "/v1/balance_transactions/{id}"
      }),
      list: stripeMethod82({
        method: "GET",
        fullPath: "/v1/balance_transactions",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Charges.js
var stripeMethod83, Charges;
var init_Charges = __esm({
  "../node_modules/stripe/esm/resources/Charges.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod83 = StripeResource.method;
    Charges = StripeResource.extend({
      create: stripeMethod83({ method: "POST", fullPath: "/v1/charges" }),
      retrieve: stripeMethod83({ method: "GET", fullPath: "/v1/charges/{charge}" }),
      update: stripeMethod83({ method: "POST", fullPath: "/v1/charges/{charge}" }),
      list: stripeMethod83({
        method: "GET",
        fullPath: "/v1/charges",
        methodType: "list"
      }),
      capture: stripeMethod83({
        method: "POST",
        fullPath: "/v1/charges/{charge}/capture"
      }),
      search: stripeMethod83({
        method: "GET",
        fullPath: "/v1/charges/search",
        methodType: "search"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/ConfirmationTokens.js
var stripeMethod84, ConfirmationTokens2;
var init_ConfirmationTokens2 = __esm({
  "../node_modules/stripe/esm/resources/ConfirmationTokens.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod84 = StripeResource.method;
    ConfirmationTokens2 = StripeResource.extend({
      retrieve: stripeMethod84({
        method: "GET",
        fullPath: "/v1/confirmation_tokens/{confirmation_token}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/CountrySpecs.js
var stripeMethod85, CountrySpecs;
var init_CountrySpecs = __esm({
  "../node_modules/stripe/esm/resources/CountrySpecs.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod85 = StripeResource.method;
    CountrySpecs = StripeResource.extend({
      retrieve: stripeMethod85({
        method: "GET",
        fullPath: "/v1/country_specs/{country}"
      }),
      list: stripeMethod85({
        method: "GET",
        fullPath: "/v1/country_specs",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Coupons.js
var stripeMethod86, Coupons;
var init_Coupons = __esm({
  "../node_modules/stripe/esm/resources/Coupons.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod86 = StripeResource.method;
    Coupons = StripeResource.extend({
      create: stripeMethod86({ method: "POST", fullPath: "/v1/coupons" }),
      retrieve: stripeMethod86({ method: "GET", fullPath: "/v1/coupons/{coupon}" }),
      update: stripeMethod86({ method: "POST", fullPath: "/v1/coupons/{coupon}" }),
      list: stripeMethod86({
        method: "GET",
        fullPath: "/v1/coupons",
        methodType: "list"
      }),
      del: stripeMethod86({ method: "DELETE", fullPath: "/v1/coupons/{coupon}" })
    });
  }
});

// ../node_modules/stripe/esm/resources/CreditNotes.js
var stripeMethod87, CreditNotes;
var init_CreditNotes = __esm({
  "../node_modules/stripe/esm/resources/CreditNotes.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod87 = StripeResource.method;
    CreditNotes = StripeResource.extend({
      create: stripeMethod87({ method: "POST", fullPath: "/v1/credit_notes" }),
      retrieve: stripeMethod87({ method: "GET", fullPath: "/v1/credit_notes/{id}" }),
      update: stripeMethod87({ method: "POST", fullPath: "/v1/credit_notes/{id}" }),
      list: stripeMethod87({
        method: "GET",
        fullPath: "/v1/credit_notes",
        methodType: "list"
      }),
      listLineItems: stripeMethod87({
        method: "GET",
        fullPath: "/v1/credit_notes/{credit_note}/lines",
        methodType: "list"
      }),
      listPreviewLineItems: stripeMethod87({
        method: "GET",
        fullPath: "/v1/credit_notes/preview/lines",
        methodType: "list"
      }),
      preview: stripeMethod87({ method: "GET", fullPath: "/v1/credit_notes/preview" }),
      voidCreditNote: stripeMethod87({
        method: "POST",
        fullPath: "/v1/credit_notes/{id}/void"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/CustomerSessions.js
var stripeMethod88, CustomerSessions;
var init_CustomerSessions = __esm({
  "../node_modules/stripe/esm/resources/CustomerSessions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod88 = StripeResource.method;
    CustomerSessions = StripeResource.extend({
      create: stripeMethod88({ method: "POST", fullPath: "/v1/customer_sessions" })
    });
  }
});

// ../node_modules/stripe/esm/resources/Customers.js
var stripeMethod89, Customers2;
var init_Customers2 = __esm({
  "../node_modules/stripe/esm/resources/Customers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod89 = StripeResource.method;
    Customers2 = StripeResource.extend({
      create: stripeMethod89({ method: "POST", fullPath: "/v1/customers" }),
      retrieve: stripeMethod89({ method: "GET", fullPath: "/v1/customers/{customer}" }),
      update: stripeMethod89({ method: "POST", fullPath: "/v1/customers/{customer}" }),
      list: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers",
        methodType: "list"
      }),
      del: stripeMethod89({ method: "DELETE", fullPath: "/v1/customers/{customer}" }),
      createBalanceTransaction: stripeMethod89({
        method: "POST",
        fullPath: "/v1/customers/{customer}/balance_transactions"
      }),
      createFundingInstructions: stripeMethod89({
        method: "POST",
        fullPath: "/v1/customers/{customer}/funding_instructions"
      }),
      createSource: stripeMethod89({
        method: "POST",
        fullPath: "/v1/customers/{customer}/sources"
      }),
      createTaxId: stripeMethod89({
        method: "POST",
        fullPath: "/v1/customers/{customer}/tax_ids"
      }),
      deleteDiscount: stripeMethod89({
        method: "DELETE",
        fullPath: "/v1/customers/{customer}/discount"
      }),
      deleteSource: stripeMethod89({
        method: "DELETE",
        fullPath: "/v1/customers/{customer}/sources/{id}"
      }),
      deleteTaxId: stripeMethod89({
        method: "DELETE",
        fullPath: "/v1/customers/{customer}/tax_ids/{id}"
      }),
      listBalanceTransactions: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/balance_transactions",
        methodType: "list"
      }),
      listCashBalanceTransactions: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/cash_balance_transactions",
        methodType: "list"
      }),
      listPaymentMethods: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/payment_methods",
        methodType: "list"
      }),
      listSources: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/sources",
        methodType: "list"
      }),
      listTaxIds: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/tax_ids",
        methodType: "list"
      }),
      retrieveBalanceTransaction: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
      }),
      retrieveCashBalance: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/cash_balance"
      }),
      retrieveCashBalanceTransaction: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/cash_balance_transactions/{transaction}"
      }),
      retrievePaymentMethod: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/payment_methods/{payment_method}"
      }),
      retrieveSource: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/sources/{id}"
      }),
      retrieveTaxId: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/{customer}/tax_ids/{id}"
      }),
      search: stripeMethod89({
        method: "GET",
        fullPath: "/v1/customers/search",
        methodType: "search"
      }),
      updateBalanceTransaction: stripeMethod89({
        method: "POST",
        fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
      }),
      updateCashBalance: stripeMethod89({
        method: "POST",
        fullPath: "/v1/customers/{customer}/cash_balance"
      }),
      updateSource: stripeMethod89({
        method: "POST",
        fullPath: "/v1/customers/{customer}/sources/{id}"
      }),
      verifySource: stripeMethod89({
        method: "POST",
        fullPath: "/v1/customers/{customer}/sources/{id}/verify"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Disputes.js
var stripeMethod90, Disputes2;
var init_Disputes2 = __esm({
  "../node_modules/stripe/esm/resources/Disputes.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod90 = StripeResource.method;
    Disputes2 = StripeResource.extend({
      retrieve: stripeMethod90({ method: "GET", fullPath: "/v1/disputes/{dispute}" }),
      update: stripeMethod90({ method: "POST", fullPath: "/v1/disputes/{dispute}" }),
      list: stripeMethod90({
        method: "GET",
        fullPath: "/v1/disputes",
        methodType: "list"
      }),
      close: stripeMethod90({
        method: "POST",
        fullPath: "/v1/disputes/{dispute}/close"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/EphemeralKeys.js
var stripeMethod91, EphemeralKeys;
var init_EphemeralKeys = __esm({
  "../node_modules/stripe/esm/resources/EphemeralKeys.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod91 = StripeResource.method;
    EphemeralKeys = StripeResource.extend({
      create: stripeMethod91({
        method: "POST",
        fullPath: "/v1/ephemeral_keys",
        validator: /* @__PURE__ */ __name((data, options) => {
          if (!options.headers || !options.headers["Stripe-Version"]) {
            throw new Error("Passing apiVersion in a separate options hash is required to create an ephemeral key. See https://stripe.com/docs/api/versioning?lang=node");
          }
        }, "validator")
      }),
      del: stripeMethod91({ method: "DELETE", fullPath: "/v1/ephemeral_keys/{key}" })
    });
  }
});

// ../node_modules/stripe/esm/resources/Events.js
var stripeMethod92, Events2;
var init_Events2 = __esm({
  "../node_modules/stripe/esm/resources/Events.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod92 = StripeResource.method;
    Events2 = StripeResource.extend({
      retrieve: stripeMethod92({ method: "GET", fullPath: "/v1/events/{id}" }),
      list: stripeMethod92({
        method: "GET",
        fullPath: "/v1/events",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/ExchangeRates.js
var stripeMethod93, ExchangeRates;
var init_ExchangeRates = __esm({
  "../node_modules/stripe/esm/resources/ExchangeRates.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod93 = StripeResource.method;
    ExchangeRates = StripeResource.extend({
      retrieve: stripeMethod93({
        method: "GET",
        fullPath: "/v1/exchange_rates/{rate_id}"
      }),
      list: stripeMethod93({
        method: "GET",
        fullPath: "/v1/exchange_rates",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/FileLinks.js
var stripeMethod94, FileLinks;
var init_FileLinks = __esm({
  "../node_modules/stripe/esm/resources/FileLinks.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod94 = StripeResource.method;
    FileLinks = StripeResource.extend({
      create: stripeMethod94({ method: "POST", fullPath: "/v1/file_links" }),
      retrieve: stripeMethod94({ method: "GET", fullPath: "/v1/file_links/{link}" }),
      update: stripeMethod94({ method: "POST", fullPath: "/v1/file_links/{link}" }),
      list: stripeMethod94({
        method: "GET",
        fullPath: "/v1/file_links",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/multipart.js
function multipartRequestDataProcessor(method, data, headers, callback) {
  data = data || {};
  if (method !== "POST") {
    return callback(null, queryStringifyRequestData(data));
  }
  this._stripe._platformFunctions.tryBufferData(data).then((bufferedData) => {
    const buffer = multipartDataGenerator(method, bufferedData, headers);
    return callback(null, buffer);
  }).catch((err) => callback(err, null));
}
var multipartDataGenerator;
var init_multipart = __esm({
  "../node_modules/stripe/esm/multipart.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils2();
    multipartDataGenerator = /* @__PURE__ */ __name((method, data, headers) => {
      const segno = (Math.round(Math.random() * 1e16) + Math.round(Math.random() * 1e16)).toString();
      headers["Content-Type"] = `multipart/form-data; boundary=${segno}`;
      const textEncoder = new TextEncoder();
      let buffer = new Uint8Array(0);
      const endBuffer = textEncoder.encode("\r\n");
      function push(l) {
        const prevBuffer = buffer;
        const newBuffer = l instanceof Uint8Array ? l : new Uint8Array(textEncoder.encode(l));
        buffer = new Uint8Array(prevBuffer.length + newBuffer.length + 2);
        buffer.set(prevBuffer);
        buffer.set(newBuffer, prevBuffer.length);
        buffer.set(endBuffer, buffer.length - 2);
      }
      __name(push, "push");
      function q(s) {
        return `"${s.replace(/"|"/g, "%22").replace(/\r\n|\r|\n/g, " ")}"`;
      }
      __name(q, "q");
      const flattenedData = flattenAndStringify(data);
      for (const k in flattenedData) {
        if (!Object.prototype.hasOwnProperty.call(flattenedData, k)) {
          continue;
        }
        const v = flattenedData[k];
        push(`--${segno}`);
        if (Object.prototype.hasOwnProperty.call(v, "data")) {
          const typedEntry = v;
          push(`Content-Disposition: form-data; name=${q(k)}; filename=${q(typedEntry.name || "blob")}`);
          push(`Content-Type: ${typedEntry.type || "application/octet-stream"}`);
          push("");
          push(typedEntry.data);
        } else {
          push(`Content-Disposition: form-data; name=${q(k)}`);
          push("");
          push(v);
        }
      }
      push(`--${segno}--`);
      return buffer;
    }, "multipartDataGenerator");
    __name(multipartRequestDataProcessor, "multipartRequestDataProcessor");
  }
});

// ../node_modules/stripe/esm/resources/Files.js
var stripeMethod95, Files;
var init_Files = __esm({
  "../node_modules/stripe/esm/resources/Files.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_multipart();
    init_StripeResource();
    stripeMethod95 = StripeResource.method;
    Files = StripeResource.extend({
      create: stripeMethod95({
        method: "POST",
        fullPath: "/v1/files",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        host: "files.stripe.com"
      }),
      retrieve: stripeMethod95({ method: "GET", fullPath: "/v1/files/{file}" }),
      list: stripeMethod95({
        method: "GET",
        fullPath: "/v1/files",
        methodType: "list"
      }),
      requestDataProcessor: multipartRequestDataProcessor
    });
  }
});

// ../node_modules/stripe/esm/resources/InvoiceItems.js
var stripeMethod96, InvoiceItems;
var init_InvoiceItems = __esm({
  "../node_modules/stripe/esm/resources/InvoiceItems.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod96 = StripeResource.method;
    InvoiceItems = StripeResource.extend({
      create: stripeMethod96({ method: "POST", fullPath: "/v1/invoiceitems" }),
      retrieve: stripeMethod96({
        method: "GET",
        fullPath: "/v1/invoiceitems/{invoiceitem}"
      }),
      update: stripeMethod96({
        method: "POST",
        fullPath: "/v1/invoiceitems/{invoiceitem}"
      }),
      list: stripeMethod96({
        method: "GET",
        fullPath: "/v1/invoiceitems",
        methodType: "list"
      }),
      del: stripeMethod96({
        method: "DELETE",
        fullPath: "/v1/invoiceitems/{invoiceitem}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/InvoicePayments.js
var stripeMethod97, InvoicePayments;
var init_InvoicePayments = __esm({
  "../node_modules/stripe/esm/resources/InvoicePayments.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod97 = StripeResource.method;
    InvoicePayments = StripeResource.extend({
      retrieve: stripeMethod97({
        method: "GET",
        fullPath: "/v1/invoice_payments/{invoice_payment}"
      }),
      list: stripeMethod97({
        method: "GET",
        fullPath: "/v1/invoice_payments",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/InvoiceRenderingTemplates.js
var stripeMethod98, InvoiceRenderingTemplates;
var init_InvoiceRenderingTemplates = __esm({
  "../node_modules/stripe/esm/resources/InvoiceRenderingTemplates.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod98 = StripeResource.method;
    InvoiceRenderingTemplates = StripeResource.extend({
      retrieve: stripeMethod98({
        method: "GET",
        fullPath: "/v1/invoice_rendering_templates/{template}"
      }),
      list: stripeMethod98({
        method: "GET",
        fullPath: "/v1/invoice_rendering_templates",
        methodType: "list"
      }),
      archive: stripeMethod98({
        method: "POST",
        fullPath: "/v1/invoice_rendering_templates/{template}/archive"
      }),
      unarchive: stripeMethod98({
        method: "POST",
        fullPath: "/v1/invoice_rendering_templates/{template}/unarchive"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Invoices.js
var stripeMethod99, Invoices;
var init_Invoices = __esm({
  "../node_modules/stripe/esm/resources/Invoices.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod99 = StripeResource.method;
    Invoices = StripeResource.extend({
      create: stripeMethod99({ method: "POST", fullPath: "/v1/invoices" }),
      retrieve: stripeMethod99({ method: "GET", fullPath: "/v1/invoices/{invoice}" }),
      update: stripeMethod99({ method: "POST", fullPath: "/v1/invoices/{invoice}" }),
      list: stripeMethod99({
        method: "GET",
        fullPath: "/v1/invoices",
        methodType: "list"
      }),
      del: stripeMethod99({ method: "DELETE", fullPath: "/v1/invoices/{invoice}" }),
      addLines: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/add_lines"
      }),
      attachPayment: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/attach_payment"
      }),
      createPreview: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/create_preview"
      }),
      finalizeInvoice: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/finalize"
      }),
      listLineItems: stripeMethod99({
        method: "GET",
        fullPath: "/v1/invoices/{invoice}/lines",
        methodType: "list"
      }),
      markUncollectible: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/mark_uncollectible"
      }),
      pay: stripeMethod99({ method: "POST", fullPath: "/v1/invoices/{invoice}/pay" }),
      removeLines: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/remove_lines"
      }),
      search: stripeMethod99({
        method: "GET",
        fullPath: "/v1/invoices/search",
        methodType: "search"
      }),
      sendInvoice: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/send"
      }),
      updateLines: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/update_lines"
      }),
      updateLineItem: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/lines/{line_item_id}"
      }),
      voidInvoice: stripeMethod99({
        method: "POST",
        fullPath: "/v1/invoices/{invoice}/void"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Mandates.js
var stripeMethod100, Mandates;
var init_Mandates = __esm({
  "../node_modules/stripe/esm/resources/Mandates.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod100 = StripeResource.method;
    Mandates = StripeResource.extend({
      retrieve: stripeMethod100({ method: "GET", fullPath: "/v1/mandates/{mandate}" })
    });
  }
});

// ../node_modules/stripe/esm/resources/OAuth.js
var stripeMethod101, oAuthHost, OAuth;
var init_OAuth = __esm({
  "../node_modules/stripe/esm/resources/OAuth.js"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    init_utils2();
    stripeMethod101 = StripeResource.method;
    oAuthHost = "connect.stripe.com";
    OAuth = StripeResource.extend({
      basePath: "/",
      authorizeUrl(params, options) {
        params = params || {};
        options = options || {};
        let path = "oauth/authorize";
        if (options.express) {
          path = `express/${path}`;
        }
        if (!params.response_type) {
          params.response_type = "code";
        }
        if (!params.client_id) {
          params.client_id = this._stripe.getClientId();
        }
        if (!params.scope) {
          params.scope = "read_write";
        }
        return `https://${oAuthHost}/${path}?${queryStringifyRequestData(params)}`;
      },
      token: stripeMethod101({
        method: "POST",
        path: "oauth/token",
        host: oAuthHost
      }),
      deauthorize(spec, ...args) {
        if (!spec.client_id) {
          spec.client_id = this._stripe.getClientId();
        }
        return stripeMethod101({
          method: "POST",
          path: "oauth/deauthorize",
          host: oAuthHost
        }).apply(this, [spec, ...args]);
      }
    });
  }
});

// ../node_modules/stripe/esm/resources/PaymentIntents.js
var stripeMethod102, PaymentIntents;
var init_PaymentIntents = __esm({
  "../node_modules/stripe/esm/resources/PaymentIntents.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod102 = StripeResource.method;
    PaymentIntents = StripeResource.extend({
      create: stripeMethod102({ method: "POST", fullPath: "/v1/payment_intents" }),
      retrieve: stripeMethod102({
        method: "GET",
        fullPath: "/v1/payment_intents/{intent}"
      }),
      update: stripeMethod102({
        method: "POST",
        fullPath: "/v1/payment_intents/{intent}"
      }),
      list: stripeMethod102({
        method: "GET",
        fullPath: "/v1/payment_intents",
        methodType: "list"
      }),
      applyCustomerBalance: stripeMethod102({
        method: "POST",
        fullPath: "/v1/payment_intents/{intent}/apply_customer_balance"
      }),
      cancel: stripeMethod102({
        method: "POST",
        fullPath: "/v1/payment_intents/{intent}/cancel"
      }),
      capture: stripeMethod102({
        method: "POST",
        fullPath: "/v1/payment_intents/{intent}/capture"
      }),
      confirm: stripeMethod102({
        method: "POST",
        fullPath: "/v1/payment_intents/{intent}/confirm"
      }),
      incrementAuthorization: stripeMethod102({
        method: "POST",
        fullPath: "/v1/payment_intents/{intent}/increment_authorization"
      }),
      search: stripeMethod102({
        method: "GET",
        fullPath: "/v1/payment_intents/search",
        methodType: "search"
      }),
      verifyMicrodeposits: stripeMethod102({
        method: "POST",
        fullPath: "/v1/payment_intents/{intent}/verify_microdeposits"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/PaymentLinks.js
var stripeMethod103, PaymentLinks;
var init_PaymentLinks = __esm({
  "../node_modules/stripe/esm/resources/PaymentLinks.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod103 = StripeResource.method;
    PaymentLinks = StripeResource.extend({
      create: stripeMethod103({ method: "POST", fullPath: "/v1/payment_links" }),
      retrieve: stripeMethod103({
        method: "GET",
        fullPath: "/v1/payment_links/{payment_link}"
      }),
      update: stripeMethod103({
        method: "POST",
        fullPath: "/v1/payment_links/{payment_link}"
      }),
      list: stripeMethod103({
        method: "GET",
        fullPath: "/v1/payment_links",
        methodType: "list"
      }),
      listLineItems: stripeMethod103({
        method: "GET",
        fullPath: "/v1/payment_links/{payment_link}/line_items",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/PaymentMethodConfigurations.js
var stripeMethod104, PaymentMethodConfigurations;
var init_PaymentMethodConfigurations = __esm({
  "../node_modules/stripe/esm/resources/PaymentMethodConfigurations.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod104 = StripeResource.method;
    PaymentMethodConfigurations = StripeResource.extend({
      create: stripeMethod104({
        method: "POST",
        fullPath: "/v1/payment_method_configurations"
      }),
      retrieve: stripeMethod104({
        method: "GET",
        fullPath: "/v1/payment_method_configurations/{configuration}"
      }),
      update: stripeMethod104({
        method: "POST",
        fullPath: "/v1/payment_method_configurations/{configuration}"
      }),
      list: stripeMethod104({
        method: "GET",
        fullPath: "/v1/payment_method_configurations",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/PaymentMethodDomains.js
var stripeMethod105, PaymentMethodDomains;
var init_PaymentMethodDomains = __esm({
  "../node_modules/stripe/esm/resources/PaymentMethodDomains.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod105 = StripeResource.method;
    PaymentMethodDomains = StripeResource.extend({
      create: stripeMethod105({
        method: "POST",
        fullPath: "/v1/payment_method_domains"
      }),
      retrieve: stripeMethod105({
        method: "GET",
        fullPath: "/v1/payment_method_domains/{payment_method_domain}"
      }),
      update: stripeMethod105({
        method: "POST",
        fullPath: "/v1/payment_method_domains/{payment_method_domain}"
      }),
      list: stripeMethod105({
        method: "GET",
        fullPath: "/v1/payment_method_domains",
        methodType: "list"
      }),
      validate: stripeMethod105({
        method: "POST",
        fullPath: "/v1/payment_method_domains/{payment_method_domain}/validate"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/PaymentMethods.js
var stripeMethod106, PaymentMethods;
var init_PaymentMethods = __esm({
  "../node_modules/stripe/esm/resources/PaymentMethods.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod106 = StripeResource.method;
    PaymentMethods = StripeResource.extend({
      create: stripeMethod106({ method: "POST", fullPath: "/v1/payment_methods" }),
      retrieve: stripeMethod106({
        method: "GET",
        fullPath: "/v1/payment_methods/{payment_method}"
      }),
      update: stripeMethod106({
        method: "POST",
        fullPath: "/v1/payment_methods/{payment_method}"
      }),
      list: stripeMethod106({
        method: "GET",
        fullPath: "/v1/payment_methods",
        methodType: "list"
      }),
      attach: stripeMethod106({
        method: "POST",
        fullPath: "/v1/payment_methods/{payment_method}/attach"
      }),
      detach: stripeMethod106({
        method: "POST",
        fullPath: "/v1/payment_methods/{payment_method}/detach"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Payouts.js
var stripeMethod107, Payouts;
var init_Payouts = __esm({
  "../node_modules/stripe/esm/resources/Payouts.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod107 = StripeResource.method;
    Payouts = StripeResource.extend({
      create: stripeMethod107({ method: "POST", fullPath: "/v1/payouts" }),
      retrieve: stripeMethod107({ method: "GET", fullPath: "/v1/payouts/{payout}" }),
      update: stripeMethod107({ method: "POST", fullPath: "/v1/payouts/{payout}" }),
      list: stripeMethod107({
        method: "GET",
        fullPath: "/v1/payouts",
        methodType: "list"
      }),
      cancel: stripeMethod107({
        method: "POST",
        fullPath: "/v1/payouts/{payout}/cancel"
      }),
      reverse: stripeMethod107({
        method: "POST",
        fullPath: "/v1/payouts/{payout}/reverse"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Plans.js
var stripeMethod108, Plans;
var init_Plans = __esm({
  "../node_modules/stripe/esm/resources/Plans.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod108 = StripeResource.method;
    Plans = StripeResource.extend({
      create: stripeMethod108({ method: "POST", fullPath: "/v1/plans" }),
      retrieve: stripeMethod108({ method: "GET", fullPath: "/v1/plans/{plan}" }),
      update: stripeMethod108({ method: "POST", fullPath: "/v1/plans/{plan}" }),
      list: stripeMethod108({
        method: "GET",
        fullPath: "/v1/plans",
        methodType: "list"
      }),
      del: stripeMethod108({ method: "DELETE", fullPath: "/v1/plans/{plan}" })
    });
  }
});

// ../node_modules/stripe/esm/resources/Prices.js
var stripeMethod109, Prices;
var init_Prices = __esm({
  "../node_modules/stripe/esm/resources/Prices.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod109 = StripeResource.method;
    Prices = StripeResource.extend({
      create: stripeMethod109({ method: "POST", fullPath: "/v1/prices" }),
      retrieve: stripeMethod109({ method: "GET", fullPath: "/v1/prices/{price}" }),
      update: stripeMethod109({ method: "POST", fullPath: "/v1/prices/{price}" }),
      list: stripeMethod109({
        method: "GET",
        fullPath: "/v1/prices",
        methodType: "list"
      }),
      search: stripeMethod109({
        method: "GET",
        fullPath: "/v1/prices/search",
        methodType: "search"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Products.js
var stripeMethod110, Products2;
var init_Products2 = __esm({
  "../node_modules/stripe/esm/resources/Products.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod110 = StripeResource.method;
    Products2 = StripeResource.extend({
      create: stripeMethod110({ method: "POST", fullPath: "/v1/products" }),
      retrieve: stripeMethod110({ method: "GET", fullPath: "/v1/products/{id}" }),
      update: stripeMethod110({ method: "POST", fullPath: "/v1/products/{id}" }),
      list: stripeMethod110({
        method: "GET",
        fullPath: "/v1/products",
        methodType: "list"
      }),
      del: stripeMethod110({ method: "DELETE", fullPath: "/v1/products/{id}" }),
      createFeature: stripeMethod110({
        method: "POST",
        fullPath: "/v1/products/{product}/features"
      }),
      deleteFeature: stripeMethod110({
        method: "DELETE",
        fullPath: "/v1/products/{product}/features/{id}"
      }),
      listFeatures: stripeMethod110({
        method: "GET",
        fullPath: "/v1/products/{product}/features",
        methodType: "list"
      }),
      retrieveFeature: stripeMethod110({
        method: "GET",
        fullPath: "/v1/products/{product}/features/{id}"
      }),
      search: stripeMethod110({
        method: "GET",
        fullPath: "/v1/products/search",
        methodType: "search"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/PromotionCodes.js
var stripeMethod111, PromotionCodes;
var init_PromotionCodes = __esm({
  "../node_modules/stripe/esm/resources/PromotionCodes.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod111 = StripeResource.method;
    PromotionCodes = StripeResource.extend({
      create: stripeMethod111({ method: "POST", fullPath: "/v1/promotion_codes" }),
      retrieve: stripeMethod111({
        method: "GET",
        fullPath: "/v1/promotion_codes/{promotion_code}"
      }),
      update: stripeMethod111({
        method: "POST",
        fullPath: "/v1/promotion_codes/{promotion_code}"
      }),
      list: stripeMethod111({
        method: "GET",
        fullPath: "/v1/promotion_codes",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Quotes.js
var stripeMethod112, Quotes;
var init_Quotes = __esm({
  "../node_modules/stripe/esm/resources/Quotes.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod112 = StripeResource.method;
    Quotes = StripeResource.extend({
      create: stripeMethod112({ method: "POST", fullPath: "/v1/quotes" }),
      retrieve: stripeMethod112({ method: "GET", fullPath: "/v1/quotes/{quote}" }),
      update: stripeMethod112({ method: "POST", fullPath: "/v1/quotes/{quote}" }),
      list: stripeMethod112({
        method: "GET",
        fullPath: "/v1/quotes",
        methodType: "list"
      }),
      accept: stripeMethod112({ method: "POST", fullPath: "/v1/quotes/{quote}/accept" }),
      cancel: stripeMethod112({ method: "POST", fullPath: "/v1/quotes/{quote}/cancel" }),
      finalizeQuote: stripeMethod112({
        method: "POST",
        fullPath: "/v1/quotes/{quote}/finalize"
      }),
      listComputedUpfrontLineItems: stripeMethod112({
        method: "GET",
        fullPath: "/v1/quotes/{quote}/computed_upfront_line_items",
        methodType: "list"
      }),
      listLineItems: stripeMethod112({
        method: "GET",
        fullPath: "/v1/quotes/{quote}/line_items",
        methodType: "list"
      }),
      pdf: stripeMethod112({
        method: "GET",
        fullPath: "/v1/quotes/{quote}/pdf",
        host: "files.stripe.com",
        streaming: true
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Refunds.js
var stripeMethod113, Refunds2;
var init_Refunds2 = __esm({
  "../node_modules/stripe/esm/resources/Refunds.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod113 = StripeResource.method;
    Refunds2 = StripeResource.extend({
      create: stripeMethod113({ method: "POST", fullPath: "/v1/refunds" }),
      retrieve: stripeMethod113({ method: "GET", fullPath: "/v1/refunds/{refund}" }),
      update: stripeMethod113({ method: "POST", fullPath: "/v1/refunds/{refund}" }),
      list: stripeMethod113({
        method: "GET",
        fullPath: "/v1/refunds",
        methodType: "list"
      }),
      cancel: stripeMethod113({
        method: "POST",
        fullPath: "/v1/refunds/{refund}/cancel"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Reviews.js
var stripeMethod114, Reviews;
var init_Reviews = __esm({
  "../node_modules/stripe/esm/resources/Reviews.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod114 = StripeResource.method;
    Reviews = StripeResource.extend({
      retrieve: stripeMethod114({ method: "GET", fullPath: "/v1/reviews/{review}" }),
      list: stripeMethod114({
        method: "GET",
        fullPath: "/v1/reviews",
        methodType: "list"
      }),
      approve: stripeMethod114({
        method: "POST",
        fullPath: "/v1/reviews/{review}/approve"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/SetupAttempts.js
var stripeMethod115, SetupAttempts;
var init_SetupAttempts = __esm({
  "../node_modules/stripe/esm/resources/SetupAttempts.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod115 = StripeResource.method;
    SetupAttempts = StripeResource.extend({
      list: stripeMethod115({
        method: "GET",
        fullPath: "/v1/setup_attempts",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/SetupIntents.js
var stripeMethod116, SetupIntents;
var init_SetupIntents = __esm({
  "../node_modules/stripe/esm/resources/SetupIntents.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod116 = StripeResource.method;
    SetupIntents = StripeResource.extend({
      create: stripeMethod116({ method: "POST", fullPath: "/v1/setup_intents" }),
      retrieve: stripeMethod116({
        method: "GET",
        fullPath: "/v1/setup_intents/{intent}"
      }),
      update: stripeMethod116({
        method: "POST",
        fullPath: "/v1/setup_intents/{intent}"
      }),
      list: stripeMethod116({
        method: "GET",
        fullPath: "/v1/setup_intents",
        methodType: "list"
      }),
      cancel: stripeMethod116({
        method: "POST",
        fullPath: "/v1/setup_intents/{intent}/cancel"
      }),
      confirm: stripeMethod116({
        method: "POST",
        fullPath: "/v1/setup_intents/{intent}/confirm"
      }),
      verifyMicrodeposits: stripeMethod116({
        method: "POST",
        fullPath: "/v1/setup_intents/{intent}/verify_microdeposits"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/ShippingRates.js
var stripeMethod117, ShippingRates;
var init_ShippingRates = __esm({
  "../node_modules/stripe/esm/resources/ShippingRates.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod117 = StripeResource.method;
    ShippingRates = StripeResource.extend({
      create: stripeMethod117({ method: "POST", fullPath: "/v1/shipping_rates" }),
      retrieve: stripeMethod117({
        method: "GET",
        fullPath: "/v1/shipping_rates/{shipping_rate_token}"
      }),
      update: stripeMethod117({
        method: "POST",
        fullPath: "/v1/shipping_rates/{shipping_rate_token}"
      }),
      list: stripeMethod117({
        method: "GET",
        fullPath: "/v1/shipping_rates",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Sources.js
var stripeMethod118, Sources;
var init_Sources = __esm({
  "../node_modules/stripe/esm/resources/Sources.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod118 = StripeResource.method;
    Sources = StripeResource.extend({
      create: stripeMethod118({ method: "POST", fullPath: "/v1/sources" }),
      retrieve: stripeMethod118({ method: "GET", fullPath: "/v1/sources/{source}" }),
      update: stripeMethod118({ method: "POST", fullPath: "/v1/sources/{source}" }),
      listSourceTransactions: stripeMethod118({
        method: "GET",
        fullPath: "/v1/sources/{source}/source_transactions",
        methodType: "list"
      }),
      verify: stripeMethod118({
        method: "POST",
        fullPath: "/v1/sources/{source}/verify"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/SubscriptionItems.js
var stripeMethod119, SubscriptionItems;
var init_SubscriptionItems = __esm({
  "../node_modules/stripe/esm/resources/SubscriptionItems.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod119 = StripeResource.method;
    SubscriptionItems = StripeResource.extend({
      create: stripeMethod119({ method: "POST", fullPath: "/v1/subscription_items" }),
      retrieve: stripeMethod119({
        method: "GET",
        fullPath: "/v1/subscription_items/{item}"
      }),
      update: stripeMethod119({
        method: "POST",
        fullPath: "/v1/subscription_items/{item}"
      }),
      list: stripeMethod119({
        method: "GET",
        fullPath: "/v1/subscription_items",
        methodType: "list"
      }),
      del: stripeMethod119({
        method: "DELETE",
        fullPath: "/v1/subscription_items/{item}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/SubscriptionSchedules.js
var stripeMethod120, SubscriptionSchedules;
var init_SubscriptionSchedules = __esm({
  "../node_modules/stripe/esm/resources/SubscriptionSchedules.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod120 = StripeResource.method;
    SubscriptionSchedules = StripeResource.extend({
      create: stripeMethod120({
        method: "POST",
        fullPath: "/v1/subscription_schedules"
      }),
      retrieve: stripeMethod120({
        method: "GET",
        fullPath: "/v1/subscription_schedules/{schedule}"
      }),
      update: stripeMethod120({
        method: "POST",
        fullPath: "/v1/subscription_schedules/{schedule}"
      }),
      list: stripeMethod120({
        method: "GET",
        fullPath: "/v1/subscription_schedules",
        methodType: "list"
      }),
      cancel: stripeMethod120({
        method: "POST",
        fullPath: "/v1/subscription_schedules/{schedule}/cancel"
      }),
      release: stripeMethod120({
        method: "POST",
        fullPath: "/v1/subscription_schedules/{schedule}/release"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Subscriptions.js
var stripeMethod121, Subscriptions;
var init_Subscriptions = __esm({
  "../node_modules/stripe/esm/resources/Subscriptions.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod121 = StripeResource.method;
    Subscriptions = StripeResource.extend({
      create: stripeMethod121({ method: "POST", fullPath: "/v1/subscriptions" }),
      retrieve: stripeMethod121({
        method: "GET",
        fullPath: "/v1/subscriptions/{subscription_exposed_id}"
      }),
      update: stripeMethod121({
        method: "POST",
        fullPath: "/v1/subscriptions/{subscription_exposed_id}"
      }),
      list: stripeMethod121({
        method: "GET",
        fullPath: "/v1/subscriptions",
        methodType: "list"
      }),
      cancel: stripeMethod121({
        method: "DELETE",
        fullPath: "/v1/subscriptions/{subscription_exposed_id}"
      }),
      deleteDiscount: stripeMethod121({
        method: "DELETE",
        fullPath: "/v1/subscriptions/{subscription_exposed_id}/discount"
      }),
      migrate: stripeMethod121({
        method: "POST",
        fullPath: "/v1/subscriptions/{subscription}/migrate"
      }),
      resume: stripeMethod121({
        method: "POST",
        fullPath: "/v1/subscriptions/{subscription}/resume"
      }),
      search: stripeMethod121({
        method: "GET",
        fullPath: "/v1/subscriptions/search",
        methodType: "search"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TaxCodes.js
var stripeMethod122, TaxCodes;
var init_TaxCodes = __esm({
  "../node_modules/stripe/esm/resources/TaxCodes.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod122 = StripeResource.method;
    TaxCodes = StripeResource.extend({
      retrieve: stripeMethod122({ method: "GET", fullPath: "/v1/tax_codes/{id}" }),
      list: stripeMethod122({
        method: "GET",
        fullPath: "/v1/tax_codes",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/TaxIds.js
var stripeMethod123, TaxIds;
var init_TaxIds = __esm({
  "../node_modules/stripe/esm/resources/TaxIds.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod123 = StripeResource.method;
    TaxIds = StripeResource.extend({
      create: stripeMethod123({ method: "POST", fullPath: "/v1/tax_ids" }),
      retrieve: stripeMethod123({ method: "GET", fullPath: "/v1/tax_ids/{id}" }),
      list: stripeMethod123({
        method: "GET",
        fullPath: "/v1/tax_ids",
        methodType: "list"
      }),
      del: stripeMethod123({ method: "DELETE", fullPath: "/v1/tax_ids/{id}" })
    });
  }
});

// ../node_modules/stripe/esm/resources/TaxRates.js
var stripeMethod124, TaxRates;
var init_TaxRates = __esm({
  "../node_modules/stripe/esm/resources/TaxRates.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod124 = StripeResource.method;
    TaxRates = StripeResource.extend({
      create: stripeMethod124({ method: "POST", fullPath: "/v1/tax_rates" }),
      retrieve: stripeMethod124({ method: "GET", fullPath: "/v1/tax_rates/{tax_rate}" }),
      update: stripeMethod124({ method: "POST", fullPath: "/v1/tax_rates/{tax_rate}" }),
      list: stripeMethod124({
        method: "GET",
        fullPath: "/v1/tax_rates",
        methodType: "list"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/Tokens.js
var stripeMethod125, Tokens2;
var init_Tokens2 = __esm({
  "../node_modules/stripe/esm/resources/Tokens.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod125 = StripeResource.method;
    Tokens2 = StripeResource.extend({
      create: stripeMethod125({ method: "POST", fullPath: "/v1/tokens" }),
      retrieve: stripeMethod125({ method: "GET", fullPath: "/v1/tokens/{token}" })
    });
  }
});

// ../node_modules/stripe/esm/resources/Topups.js
var stripeMethod126, Topups;
var init_Topups = __esm({
  "../node_modules/stripe/esm/resources/Topups.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod126 = StripeResource.method;
    Topups = StripeResource.extend({
      create: stripeMethod126({ method: "POST", fullPath: "/v1/topups" }),
      retrieve: stripeMethod126({ method: "GET", fullPath: "/v1/topups/{topup}" }),
      update: stripeMethod126({ method: "POST", fullPath: "/v1/topups/{topup}" }),
      list: stripeMethod126({
        method: "GET",
        fullPath: "/v1/topups",
        methodType: "list"
      }),
      cancel: stripeMethod126({ method: "POST", fullPath: "/v1/topups/{topup}/cancel" })
    });
  }
});

// ../node_modules/stripe/esm/resources/Transfers.js
var stripeMethod127, Transfers;
var init_Transfers = __esm({
  "../node_modules/stripe/esm/resources/Transfers.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod127 = StripeResource.method;
    Transfers = StripeResource.extend({
      create: stripeMethod127({ method: "POST", fullPath: "/v1/transfers" }),
      retrieve: stripeMethod127({ method: "GET", fullPath: "/v1/transfers/{transfer}" }),
      update: stripeMethod127({ method: "POST", fullPath: "/v1/transfers/{transfer}" }),
      list: stripeMethod127({
        method: "GET",
        fullPath: "/v1/transfers",
        methodType: "list"
      }),
      createReversal: stripeMethod127({
        method: "POST",
        fullPath: "/v1/transfers/{id}/reversals"
      }),
      listReversals: stripeMethod127({
        method: "GET",
        fullPath: "/v1/transfers/{id}/reversals",
        methodType: "list"
      }),
      retrieveReversal: stripeMethod127({
        method: "GET",
        fullPath: "/v1/transfers/{transfer}/reversals/{id}"
      }),
      updateReversal: stripeMethod127({
        method: "POST",
        fullPath: "/v1/transfers/{transfer}/reversals/{id}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources/WebhookEndpoints.js
var stripeMethod128, WebhookEndpoints;
var init_WebhookEndpoints = __esm({
  "../node_modules/stripe/esm/resources/WebhookEndpoints.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_StripeResource();
    stripeMethod128 = StripeResource.method;
    WebhookEndpoints = StripeResource.extend({
      create: stripeMethod128({ method: "POST", fullPath: "/v1/webhook_endpoints" }),
      retrieve: stripeMethod128({
        method: "GET",
        fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
      }),
      update: stripeMethod128({
        method: "POST",
        fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
      }),
      list: stripeMethod128({
        method: "GET",
        fullPath: "/v1/webhook_endpoints",
        methodType: "list"
      }),
      del: stripeMethod128({
        method: "DELETE",
        fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
      })
    });
  }
});

// ../node_modules/stripe/esm/resources.js
var resources_exports = {};
__export(resources_exports, {
  Account: () => Accounts2,
  AccountLinks: () => AccountLinks,
  AccountSessions: () => AccountSessions,
  Accounts: () => Accounts2,
  ApplePayDomains: () => ApplePayDomains,
  ApplicationFees: () => ApplicationFees,
  Apps: () => Apps,
  Balance: () => Balance,
  BalanceTransactions: () => BalanceTransactions,
  Billing: () => Billing,
  BillingPortal: () => BillingPortal,
  Charges: () => Charges,
  Checkout: () => Checkout,
  Climate: () => Climate,
  ConfirmationTokens: () => ConfirmationTokens2,
  CountrySpecs: () => CountrySpecs,
  Coupons: () => Coupons,
  CreditNotes: () => CreditNotes,
  CustomerSessions: () => CustomerSessions,
  Customers: () => Customers2,
  Disputes: () => Disputes2,
  Entitlements: () => Entitlements,
  EphemeralKeys: () => EphemeralKeys,
  Events: () => Events2,
  ExchangeRates: () => ExchangeRates,
  FileLinks: () => FileLinks,
  Files: () => Files,
  FinancialConnections: () => FinancialConnections,
  Forwarding: () => Forwarding,
  Identity: () => Identity,
  InvoiceItems: () => InvoiceItems,
  InvoicePayments: () => InvoicePayments,
  InvoiceRenderingTemplates: () => InvoiceRenderingTemplates,
  Invoices: () => Invoices,
  Issuing: () => Issuing,
  Mandates: () => Mandates,
  OAuth: () => OAuth,
  PaymentIntents: () => PaymentIntents,
  PaymentLinks: () => PaymentLinks,
  PaymentMethodConfigurations: () => PaymentMethodConfigurations,
  PaymentMethodDomains: () => PaymentMethodDomains,
  PaymentMethods: () => PaymentMethods,
  Payouts: () => Payouts,
  Plans: () => Plans,
  Prices: () => Prices,
  Products: () => Products2,
  PromotionCodes: () => PromotionCodes,
  Quotes: () => Quotes,
  Radar: () => Radar,
  Refunds: () => Refunds2,
  Reporting: () => Reporting,
  Reviews: () => Reviews,
  SetupAttempts: () => SetupAttempts,
  SetupIntents: () => SetupIntents,
  ShippingRates: () => ShippingRates,
  Sigma: () => Sigma,
  Sources: () => Sources,
  SubscriptionItems: () => SubscriptionItems,
  SubscriptionSchedules: () => SubscriptionSchedules,
  Subscriptions: () => Subscriptions,
  Tax: () => Tax,
  TaxCodes: () => TaxCodes,
  TaxIds: () => TaxIds,
  TaxRates: () => TaxRates,
  Terminal: () => Terminal,
  TestHelpers: () => TestHelpers,
  Tokens: () => Tokens2,
  Topups: () => Topups,
  Transfers: () => Transfers,
  Treasury: () => Treasury,
  V2: () => V2,
  WebhookEndpoints: () => WebhookEndpoints
});
var Apps, Billing, BillingPortal, Checkout, Climate, Entitlements, FinancialConnections, Forwarding, Identity, Issuing, Radar, Reporting, Sigma, Tax, Terminal, TestHelpers, Treasury, V2;
var init_resources = __esm({
  "../node_modules/stripe/esm/resources.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_ResourceNamespace();
    init_Accounts();
    init_ActiveEntitlements();
    init_Alerts();
    init_Authorizations();
    init_Authorizations2();
    init_Calculations();
    init_Cardholders();
    init_Cards();
    init_Cards2();
    init_Configurations();
    init_Configurations2();
    init_ConfirmationTokens();
    init_ConnectionTokens();
    init_CreditBalanceSummary();
    init_CreditBalanceTransactions();
    init_CreditGrants();
    init_CreditReversals();
    init_Customers();
    init_DebitReversals();
    init_Disputes();
    init_EarlyFraudWarnings();
    init_EventDestinations();
    init_Events();
    init_Features();
    init_FinancialAccounts();
    init_InboundTransfers();
    init_InboundTransfers2();
    init_Locations();
    init_MeterEventAdjustments();
    init_MeterEventAdjustments2();
    init_MeterEventSession();
    init_MeterEventStream();
    init_MeterEvents();
    init_MeterEvents2();
    init_Meters();
    init_Orders();
    init_OutboundPayments();
    init_OutboundPayments2();
    init_OutboundTransfers();
    init_OutboundTransfers2();
    init_PersonalizationDesigns();
    init_PersonalizationDesigns2();
    init_PhysicalBundles();
    init_Products();
    init_Readers();
    init_Readers2();
    init_ReceivedCredits();
    init_ReceivedCredits2();
    init_ReceivedDebits();
    init_ReceivedDebits2();
    init_Refunds();
    init_Registrations();
    init_ReportRuns();
    init_ReportTypes();
    init_Requests();
    init_ScheduledQueryRuns();
    init_Secrets();
    init_Sessions();
    init_Sessions2();
    init_Sessions3();
    init_Settings();
    init_Suppliers();
    init_TestClocks();
    init_Tokens();
    init_TransactionEntries();
    init_Transactions();
    init_Transactions2();
    init_Transactions3();
    init_Transactions4();
    init_Transactions5();
    init_ValueListItems();
    init_ValueLists();
    init_VerificationReports();
    init_VerificationSessions();
    init_Accounts2();
    init_AccountLinks();
    init_AccountSessions();
    init_Accounts2();
    init_ApplePayDomains();
    init_ApplicationFees();
    init_Balance();
    init_BalanceTransactions();
    init_Charges();
    init_ConfirmationTokens2();
    init_CountrySpecs();
    init_Coupons();
    init_CreditNotes();
    init_CustomerSessions();
    init_Customers2();
    init_Disputes2();
    init_EphemeralKeys();
    init_Events2();
    init_ExchangeRates();
    init_FileLinks();
    init_Files();
    init_InvoiceItems();
    init_InvoicePayments();
    init_InvoiceRenderingTemplates();
    init_Invoices();
    init_Mandates();
    init_OAuth();
    init_PaymentIntents();
    init_PaymentLinks();
    init_PaymentMethodConfigurations();
    init_PaymentMethodDomains();
    init_PaymentMethods();
    init_Payouts();
    init_Plans();
    init_Prices();
    init_Products2();
    init_PromotionCodes();
    init_Quotes();
    init_Refunds2();
    init_Reviews();
    init_SetupAttempts();
    init_SetupIntents();
    init_ShippingRates();
    init_Sources();
    init_SubscriptionItems();
    init_SubscriptionSchedules();
    init_Subscriptions();
    init_TaxCodes();
    init_TaxIds();
    init_TaxRates();
    init_Tokens2();
    init_Topups();
    init_Transfers();
    init_WebhookEndpoints();
    Apps = resourceNamespace("apps", { Secrets });
    Billing = resourceNamespace("billing", {
      Alerts,
      CreditBalanceSummary,
      CreditBalanceTransactions,
      CreditGrants,
      MeterEventAdjustments,
      MeterEvents,
      Meters
    });
    BillingPortal = resourceNamespace("billingPortal", {
      Configurations,
      Sessions
    });
    Checkout = resourceNamespace("checkout", {
      Sessions: Sessions2
    });
    Climate = resourceNamespace("climate", {
      Orders,
      Products,
      Suppliers
    });
    Entitlements = resourceNamespace("entitlements", {
      ActiveEntitlements,
      Features
    });
    FinancialConnections = resourceNamespace("financialConnections", {
      Accounts,
      Sessions: Sessions3,
      Transactions
    });
    Forwarding = resourceNamespace("forwarding", {
      Requests
    });
    Identity = resourceNamespace("identity", {
      VerificationReports,
      VerificationSessions
    });
    Issuing = resourceNamespace("issuing", {
      Authorizations,
      Cardholders,
      Cards,
      Disputes,
      PersonalizationDesigns,
      PhysicalBundles,
      Tokens,
      Transactions: Transactions2
    });
    Radar = resourceNamespace("radar", {
      EarlyFraudWarnings,
      ValueListItems,
      ValueLists
    });
    Reporting = resourceNamespace("reporting", {
      ReportRuns,
      ReportTypes
    });
    Sigma = resourceNamespace("sigma", {
      ScheduledQueryRuns
    });
    Tax = resourceNamespace("tax", {
      Calculations,
      Registrations,
      Settings,
      Transactions: Transactions3
    });
    Terminal = resourceNamespace("terminal", {
      Configurations: Configurations2,
      ConnectionTokens,
      Locations,
      Readers
    });
    TestHelpers = resourceNamespace("testHelpers", {
      ConfirmationTokens,
      Customers,
      Refunds,
      TestClocks,
      Issuing: resourceNamespace("issuing", {
        Authorizations: Authorizations2,
        Cards: Cards2,
        PersonalizationDesigns: PersonalizationDesigns2,
        Transactions: Transactions4
      }),
      Terminal: resourceNamespace("terminal", {
        Readers: Readers2
      }),
      Treasury: resourceNamespace("treasury", {
        InboundTransfers,
        OutboundPayments,
        OutboundTransfers,
        ReceivedCredits,
        ReceivedDebits
      })
    });
    Treasury = resourceNamespace("treasury", {
      CreditReversals,
      DebitReversals,
      FinancialAccounts,
      InboundTransfers: InboundTransfers2,
      OutboundPayments: OutboundPayments2,
      OutboundTransfers: OutboundTransfers2,
      ReceivedCredits: ReceivedCredits2,
      ReceivedDebits: ReceivedDebits2,
      TransactionEntries,
      Transactions: Transactions5
    });
    V2 = resourceNamespace("v2", {
      Billing: resourceNamespace("billing", {
        MeterEventAdjustments: MeterEventAdjustments2,
        MeterEventSession,
        MeterEventStream,
        MeterEvents: MeterEvents2
      }),
      Core: resourceNamespace("core", {
        EventDestinations,
        Events
      })
    });
  }
});

// ../node_modules/stripe/esm/stripe.core.js
function createStripe(platformFunctions, requestSender = defaultRequestSenderFactory) {
  Stripe2.PACKAGE_VERSION = "18.5.0";
  Stripe2.API_VERSION = ApiVersion;
  Stripe2.USER_AGENT = Object.assign({ bindings_version: Stripe2.PACKAGE_VERSION, lang: "node", publisher: "stripe", uname: null, typescript: false }, determineProcessUserAgentProperties());
  Stripe2.StripeResource = StripeResource;
  Stripe2.resources = resources_exports;
  Stripe2.HttpClient = HttpClient;
  Stripe2.HttpClientResponse = HttpClientResponse;
  Stripe2.CryptoProvider = CryptoProvider;
  Stripe2.webhooks = createWebhooks(platformFunctions);
  function Stripe2(key, config2 = {}) {
    if (!(this instanceof Stripe2)) {
      return new Stripe2(key, config2);
    }
    const props = this._getPropsFromConfig(config2);
    this._platformFunctions = platformFunctions;
    Object.defineProperty(this, "_emitter", {
      value: this._platformFunctions.createEmitter(),
      enumerable: false,
      configurable: false,
      writable: false
    });
    this.VERSION = Stripe2.PACKAGE_VERSION;
    this.on = this._emitter.on.bind(this._emitter);
    this.once = this._emitter.once.bind(this._emitter);
    this.off = this._emitter.removeListener.bind(this._emitter);
    const agent = props.httpAgent || null;
    this._api = {
      host: props.host || DEFAULT_HOST,
      port: props.port || DEFAULT_PORT,
      protocol: props.protocol || "https",
      basePath: DEFAULT_BASE_PATH,
      version: props.apiVersion || DEFAULT_API_VERSION,
      timeout: validateInteger("timeout", props.timeout, DEFAULT_TIMEOUT),
      maxNetworkRetries: validateInteger("maxNetworkRetries", props.maxNetworkRetries, 2),
      agent,
      httpClient: props.httpClient || (agent ? this._platformFunctions.createNodeHttpClient(agent) : this._platformFunctions.createDefaultHttpClient()),
      dev: false,
      stripeAccount: props.stripeAccount || null,
      stripeContext: props.stripeContext || null
    };
    const typescript = props.typescript || false;
    if (typescript !== Stripe2.USER_AGENT.typescript) {
      Stripe2.USER_AGENT.typescript = typescript;
    }
    if (props.appInfo) {
      this._setAppInfo(props.appInfo);
    }
    this._prepResources();
    this._setAuthenticator(key, props.authenticator);
    this.errors = Error_exports;
    this.webhooks = Stripe2.webhooks;
    this._prevRequestMetrics = [];
    this._enableTelemetry = props.telemetry !== false;
    this._requestSender = requestSender(this);
    this.StripeResource = Stripe2.StripeResource;
  }
  __name(Stripe2, "Stripe");
  Stripe2.errors = Error_exports;
  Stripe2.createNodeHttpClient = platformFunctions.createNodeHttpClient;
  Stripe2.createFetchHttpClient = platformFunctions.createFetchHttpClient;
  Stripe2.createNodeCryptoProvider = platformFunctions.createNodeCryptoProvider;
  Stripe2.createSubtleCryptoProvider = platformFunctions.createSubtleCryptoProvider;
  Stripe2.prototype = {
    // Properties are set in the constructor above
    _appInfo: void 0,
    on: null,
    off: null,
    once: null,
    VERSION: null,
    StripeResource: null,
    webhooks: null,
    errors: null,
    _api: null,
    _prevRequestMetrics: null,
    _emitter: null,
    _enableTelemetry: null,
    _requestSender: null,
    _platformFunctions: null,
    rawRequest(method, path, params, options) {
      return this._requestSender._rawRequest(method, path, params, options);
    },
    /**
     * @private
     */
    _setAuthenticator(key, authenticator) {
      if (key && authenticator) {
        throw new Error("Can't specify both apiKey and authenticator");
      }
      if (!key && !authenticator) {
        throw new Error("Neither apiKey nor config.authenticator provided");
      }
      this._authenticator = key ? createApiKeyAuthenticator(key) : authenticator;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setAppInfo(info3) {
      if (info3 && typeof info3 !== "object") {
        throw new Error("AppInfo must be an object.");
      }
      if (info3 && !info3.name) {
        throw new Error("AppInfo.name is required");
      }
      info3 = info3 || {};
      this._appInfo = APP_INFO_PROPERTIES.reduce((accum, prop) => {
        if (typeof info3[prop] == "string") {
          accum = accum || {};
          accum[prop] = info3[prop];
        }
        return accum;
      }, {});
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiField(key, value) {
      this._api[key] = value;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getApiField(key) {
      return this._api[key];
    },
    setClientId(clientId) {
      this._clientId = clientId;
    },
    getClientId() {
      return this._clientId;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getConstant: /* @__PURE__ */ __name((c) => {
      switch (c) {
        case "DEFAULT_HOST":
          return DEFAULT_HOST;
        case "DEFAULT_PORT":
          return DEFAULT_PORT;
        case "DEFAULT_BASE_PATH":
          return DEFAULT_BASE_PATH;
        case "DEFAULT_API_VERSION":
          return DEFAULT_API_VERSION;
        case "DEFAULT_TIMEOUT":
          return DEFAULT_TIMEOUT;
        case "MAX_NETWORK_RETRY_DELAY_SEC":
          return MAX_NETWORK_RETRY_DELAY_SEC;
        case "INITIAL_NETWORK_RETRY_DELAY_SEC":
          return INITIAL_NETWORK_RETRY_DELAY_SEC;
      }
      return Stripe2[c];
    }, "getConstant"),
    getMaxNetworkRetries() {
      return this.getApiField("maxNetworkRetries");
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiNumberField(prop, n, defaultVal) {
      const val = validateInteger(prop, n, defaultVal);
      this._setApiField(prop, val);
    },
    getMaxNetworkRetryDelay() {
      return MAX_NETWORK_RETRY_DELAY_SEC;
    },
    getInitialNetworkRetryDelay() {
      return INITIAL_NETWORK_RETRY_DELAY_SEC;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent and uses a cached version for a slight
     * speed advantage.
     */
    getClientUserAgent(cb) {
      return this.getClientUserAgentSeeded(Stripe2.USER_AGENT, cb);
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent by encoding a seeded object and
     * fetching a uname from the system.
     */
    getClientUserAgentSeeded(seed, cb) {
      this._platformFunctions.getUname().then((uname) => {
        var _a;
        const userAgent = {};
        for (const field in seed) {
          if (!Object.prototype.hasOwnProperty.call(seed, field)) {
            continue;
          }
          userAgent[field] = encodeURIComponent((_a = seed[field]) !== null && _a !== void 0 ? _a : "null");
        }
        userAgent.uname = encodeURIComponent(uname || "UNKNOWN");
        const client = this.getApiField("httpClient");
        if (client) {
          userAgent.httplib = encodeURIComponent(client.getClientName());
        }
        if (this._appInfo) {
          userAgent.application = this._appInfo;
        }
        cb(JSON.stringify(userAgent));
      });
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getAppInfoAsString() {
      if (!this._appInfo) {
        return "";
      }
      let formatted = this._appInfo.name;
      if (this._appInfo.version) {
        formatted += `/${this._appInfo.version}`;
      }
      if (this._appInfo.url) {
        formatted += ` (${this._appInfo.url})`;
      }
      return formatted;
    },
    getTelemetryEnabled() {
      return this._enableTelemetry;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _prepResources() {
      for (const name in resources_exports) {
        if (!Object.prototype.hasOwnProperty.call(resources_exports, name)) {
          continue;
        }
        this[pascalToCamelCase(name)] = new resources_exports[name](this);
      }
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _getPropsFromConfig(config2) {
      if (!config2) {
        return {};
      }
      const isString = typeof config2 === "string";
      const isObject2 = config2 === Object(config2) && !Array.isArray(config2);
      if (!isObject2 && !isString) {
        throw new Error("Config must either be an object or a string");
      }
      if (isString) {
        return {
          apiVersion: config2
        };
      }
      const values = Object.keys(config2).filter((value) => !ALLOWED_CONFIG_PROPERTIES.includes(value));
      if (values.length > 0) {
        throw new Error(`Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(", ")}`);
      }
      return config2;
    },
    parseThinEvent(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      return this.webhooks.constructEvent(payload, header, secret, tolerance, cryptoProvider, receivedAt);
    }
  };
  return Stripe2;
}
var DEFAULT_HOST, DEFAULT_PORT, DEFAULT_BASE_PATH, DEFAULT_API_VERSION, DEFAULT_TIMEOUT, MAX_NETWORK_RETRY_DELAY_SEC, INITIAL_NETWORK_RETRY_DELAY_SEC, APP_INFO_PROPERTIES, ALLOWED_CONFIG_PROPERTIES, defaultRequestSenderFactory;
var init_stripe_core = __esm({
  "../node_modules/stripe/esm/stripe.core.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_Error();
    init_RequestSender();
    init_StripeResource();
    init_Webhooks();
    init_apiVersion();
    init_CryptoProvider();
    init_HttpClient();
    init_resources();
    init_utils2();
    DEFAULT_HOST = "api.stripe.com";
    DEFAULT_PORT = "443";
    DEFAULT_BASE_PATH = "/v1/";
    DEFAULT_API_VERSION = ApiVersion;
    DEFAULT_TIMEOUT = 8e4;
    MAX_NETWORK_RETRY_DELAY_SEC = 5;
    INITIAL_NETWORK_RETRY_DELAY_SEC = 0.5;
    APP_INFO_PROPERTIES = ["name", "version", "url", "partner_id"];
    ALLOWED_CONFIG_PROPERTIES = [
      "authenticator",
      "apiVersion",
      "typescript",
      "maxNetworkRetries",
      "httpAgent",
      "httpClient",
      "timeout",
      "host",
      "port",
      "protocol",
      "telemetry",
      "appInfo",
      "stripeAccount",
      "stripeContext"
    ];
    defaultRequestSenderFactory = /* @__PURE__ */ __name((stripe) => new RequestSender(stripe, StripeResource.MAX_BUFFERED_REQUEST_METRICS), "defaultRequestSenderFactory");
    __name(createStripe, "createStripe");
  }
});

// ../node_modules/stripe/esm/stripe.esm.worker.js
var Stripe, stripe_esm_worker_default;
var init_stripe_esm_worker = __esm({
  "../node_modules/stripe/esm/stripe.esm.worker.js"() {
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_WebPlatformFunctions();
    init_stripe_core();
    Stripe = createStripe(new WebPlatformFunctions());
    stripe_esm_worker_default = Stripe;
  }
});

// api/checkout/create-session.ts
async function onRequestPost4(context2) {
  const { request, env: env2 } = context2;
  try {
    const body = await request.json();
    const { userId, plan, email } = body;
    if (!userId || !plan || !email) {
      return Response.json(
        { error: "Missing required fields: userId, plan, email" },
        { status: 400 }
      );
    }
    const stripeKey = env2.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured in Cloudflare Dashboard");
    }
    const stripe = new stripe_esm_worker_default(stripeKey, {
      // @ts-ignore
      apiVersion: "2023-10-16"
    });
    const priceMap = {
      "10": "price_1SSyQORmR6ESDQvobwheaXws",
      // €4.5 for 10 setups
      "20": "price_1SSyRGRmR6ESDQvoKgAI9CAN",
      // €8 for 20 setups
      "30": "price_1SSyUORmR6ESDQvo7dzPKmPt"
      // €12 for 30 setups
    };
    const priceId = priceMap[plan];
    if (!priceId) {
      return Response.json(
        { error: "Invalid plan selected. Choose 10, 20, or 30 setups." },
        { status: 400 }
      );
    }
    const appUrl = env2.NEXT_PUBLIC_APP_URL || "https://mzprimer.com";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${appUrl}/client/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/client/dashboard?payment=canceled`,
      customer_email: email,
      metadata: {
        userId,
        plan,
        email
      },
      allow_promotion_codes: true
    });
    return Response.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });
  } catch (error3) {
    console.error("\u274C Checkout session creation error:", error3);
    return Response.json(
      { error: error3.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
var init_create_session = __esm({
  "api/checkout/create-session.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_stripe_esm_worker();
    __name(onRequestPost4, "onRequestPost");
  }
});

// ../app/lib/orders.ts
async function createOrder(o) {
  const id = crypto.randomUUID();
  const now = Date.now();
  await execute(`
    INSERT INTO stripe_purchases (user_id, stripe_session_id, amount_paid, status, created_at, updated_at)
    VALUES (?, ?, ?, 'pending', ?, ?)
  `, [o.userId, id, o.amountUsd, now, now]);
  return { id, ...o };
}
var PRODUCTS;
var init_orders = __esm({
  "../app/lib/orders.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    PRODUCTS = {
      aiAssistantMonthly: { id: "ai-assistant-monthly", name: "AI Assistant \u2013 Monthly", priceUsd: 6 },
      aiAssistantPro: { id: "ai-assistant-pro", name: "AI Assistant \u2013 Pro Monthly", priceUsd: 30 },
      scalperX1: { id: "scalper-x1", name: "Scalper X1", priceUsd: 15 }
    };
    __name(createOrder, "createOrder");
  }
});

// api/order/create.ts
function pickIP(headers) {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return headers.get("x-real-ip") || headers.get("x-client-ip") || headers.get("cf-connecting-ip") || null;
}
function pickCountry(headers) {
  const code = headers.get("cf-ipcountry") || // Standard Cloudflare country header
  headers.get("x-vercel-ip-country") || headers.get("x-client-country") || null;
  const cc = code ? code.toUpperCase() : null;
  const names = {
    US: "United States",
    GB: "United Kingdom",
    ES: "Spain",
    FR: "France",
    DE: "Germany",
    IT: "Italy",
    MA: "Morocco",
    AE: "United Arab Emirates"
  };
  return { countryCode: cc, countryName: cc && names[cc] ? names[cc] : null };
}
async function onRequestPost5(context2) {
  const { request, env: env2 } = context2;
  try {
    const body = await request.json().catch(() => ({}));
    const {
      email,
      buyerName,
      productId: productIdHint,
      productName: productNameHint,
      amountUsd: amountHint
    } = body;
    const normEmail = (email || "").trim().toLowerCase();
    if (!normEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normEmail)) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }
    let catalogKey = "scalperX1";
    if (productIdHint === "scalper" || productIdHint === "scalper-x1") catalogKey = "scalperX1";
    else if (productIdHint === "fibonacci" || productIdHint === "fibonacci-pro") catalogKey = "fibonacciPro";
    else if (productIdHint === "ai-assistant-monthly") catalogKey = "aiAssistantMonthly";
    else if (productIdHint === "ai-assistant-pro") catalogKey = "aiAssistantPro";
    const catalog = PRODUCTS[catalogKey];
    if (!catalog) {
      console.warn("Product not found, falling back to Scalper X1:", productIdHint);
      catalogKey = "scalperX1";
    }
    const finalCatalog = PRODUCTS[catalogKey];
    if (!finalCatalog) {
      return Response.json({ error: "Product not available" }, { status: 404 });
    }
    const allowOverride = env2.ALLOW_PRICE_OVERRIDE === "1" || env2.NODE_ENV !== "production";
    const parsedAmount = typeof amountHint === "number" && isFinite(amountHint) && amountHint > 0 ? Math.round(amountHint * 100) / 100 : void 0;
    const amountUsd = allowOverride && parsedAmount ? parsedAmount : finalCatalog.priceUsd;
    const headers = request.headers;
    const ip = pickIP(headers);
    const { countryCode, countryName } = pickCountry(headers);
    const filePath = "filePath" in finalCatalog ? finalCatalog.filePath : "";
    const order = createOrder({
      productId: finalCatalog.id,
      productName: productNameHint || finalCatalog.name,
      filePath,
      amountUsd,
      method: "card",
      email: normEmail,
      buyerName,
      ip,
      countryCode,
      countryName
    });
    return Response.json({
      orderId: order.id,
      method: order.method,
      amountUsd: order.amountUsd,
      createdAt: order.createdAt,
      createdAtISO: order.createdAtISO,
      countryCode: order.countryCode || null,
      countryName: order.countryName || null
    });
  } catch (e) {
    console.error("Order creation failed:", e?.message || e);
    return Response.json(
      { error: e?.message || "Order creation failed" },
      { status: 500 }
    );
  }
}
var init_create = __esm({
  "api/order/create.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_orders();
    __name(pickIP, "pickIP");
    __name(pickCountry, "pickCountry");
    __name(onRequestPost5, "onRequestPost");
  }
});

// api/push/subscribe.ts
async function onRequestPost6(context2) {
  const { request } = context2;
  try {
    const body = await request.json();
    const { subscription, userData, deviceInfo } = body;
    if (!subscription || !subscription.endpoint) {
      return Response.json(
        { success: false, error: "Invalid subscription data" },
        { status: 400 }
      );
    }
    const db = getDb();
    const endpoint = subscription.endpoint;
    if (!db) {
      return Response.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }
    const existing = await queryOne(
      "SELECT id FROM push_subscriptions WHERE endpoint = ?",
      [endpoint]
    );
    const now = Date.now();
    if (existing) {
      const updateResult = await execute(`
        UPDATE push_subscriptions 
        SET subscription_data = ?, user_id = ?, email = ?, 
            display_name = ?, device_info = ?, updated_at = ?
        WHERE endpoint = ?
      `, [
        JSON.stringify(subscription),
        userData?.userId || null,
        userData?.email || null,
        userData?.displayName || null,
        deviceInfo || null,
        now,
        endpoint
      ]);
      if (!updateResult.success) {
        throw new Error("Failed to update subscription");
      }
    } else {
      const insertResult = await execute(`
        INSERT INTO push_subscriptions 
        (endpoint, subscription_data, user_id, email, display_name, 
         device_info, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
      `, [
        endpoint,
        JSON.stringify(subscription),
        userData?.userId || null,
        userData?.email || null,
        userData?.displayName || null,
        deviceInfo || null,
        now,
        now
      ]);
      if (!insertResult.success) {
        throw new Error("Failed to insert subscription");
      }
    }
    return Response.json({
      success: true,
      message: "Subscription saved successfully"
    });
  } catch (error3) {
    console.error("Error saving push subscription:", error3);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
var init_subscribe = __esm({
  "api/push/subscribe.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(onRequestPost6, "onRequestPost");
  }
});

// api/push/sync.ts
async function onRequestPost7(context2) {
  const { request } = context2;
  try {
    const body = await request.json();
    const { userId, subscription, userData } = body;
    if (!userId || !subscription?.endpoint) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    const db = getDb();
    if (!db) {
      return Response.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }
    const endpoint = subscription.endpoint;
    const now = Date.now();
    const result = await execute(`
      UPDATE push_subscriptions 
      SET user_id = ?, email = ?, display_name = ?, updated_at = ?
      WHERE endpoint = ?
    `, [
      userId,
      userData?.email || null,
      userData?.displayName || null,
      now,
      endpoint
    ]);
    if (!result.success) {
      throw new Error("Failed to sync subscription");
    }
    return Response.json({
      success: true,
      message: "Subscription synced with user account"
    });
  } catch (error3) {
    console.error("Error syncing push subscription:", error3);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
var init_sync = __esm({
  "api/push/sync.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(onRequestPost7, "onRequestPost");
  }
});

// api/push/unsubscribe.ts
async function onRequestPost8(context2) {
  const { request } = context2;
  try {
    const body = await request.json();
    const { endpoint } = body;
    if (!endpoint) {
      return Response.json(
        { success: false, error: "Missing endpoint" },
        { status: 400 }
      );
    }
    const db = getDb();
    if (!db) {
      return Response.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }
    const now = Date.now();
    const result = await execute(`
      UPDATE push_subscriptions 
      SET status = 'inactive', updated_at = ?
      WHERE endpoint = ?
    `, [now, endpoint]);
    if (!result.success) {
      throw new Error("Failed to unsubscribe");
    }
    return Response.json({
      success: true,
      message: "Unsubscribed successfully"
    });
  } catch (error3) {
    console.error("Error unsubscribing:", error3);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
var init_unsubscribe = __esm({
  "api/push/unsubscribe.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(onRequestPost8, "onRequestPost");
  }
});

// api/referral/redeem.ts
async function onRequestPost9(context2) {
  const { request } = context2;
  try {
    const body = await request.json();
    const { userId, code } = body;
    if (!userId || !code) {
      return Response.json(
        { success: false, error: "Missing userId or code" },
        { status: 400 }
      );
    }
    const db = getDB();
    if (!db) {
      return Response.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }
    const referral = await db.prepare(
      `SELECT * FROM referral_codes 
       WHERE code = ? AND is_active = 1 
       AND (expires_at IS NULL OR expires_at > ?)`
    ).bind(code, (/* @__PURE__ */ new Date()).toISOString()).first();
    if (!referral) {
      return Response.json(
        { success: false, error: "Invalid or expired referral code" },
        { status: 400 }
      );
    }
    const existingRedemption = await db.prepare(
      `SELECT id FROM referral_redemptions 
       WHERE user_id = ? AND referral_code = ?`
    ).bind(userId, code).first();
    if (existingRedemption) {
      return Response.json(
        { success: false, error: "You have already redeemed this code" },
        { status: 400 }
      );
    }
    const redemptionId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO referral_redemptions (
        id, user_id, referral_code, redeemed_at
      ) VALUES (?, ?, ?, ?)`
    ).bind(redemptionId, userId, code, (/* @__PURE__ */ new Date()).toISOString()).run();
    await db.prepare(
      `UPDATE users 
       SET setup_count = setup_count + 5,
           updated_at = ?
       WHERE id = ?`
    ).bind((/* @__PURE__ */ new Date()).toISOString(), userId).run();
    return Response.json({
      success: true,
      message: "Referral code redeemed successfully! You received 5 setup credits.",
      creditsAdded: 5
    });
  } catch (error3) {
    console.error("Referral redemption error:", error3);
    return Response.json(
      { success: false, error: "Failed to redeem referral code" },
      { status: 500 }
    );
  }
}
var init_redeem = __esm({
  "api/referral/redeem.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(onRequestPost9, "onRequestPost");
  }
});

// ../app/lib/product-prices.ts
var PRODUCT_PRICES;
var init_product_prices = __esm({
  "../app/lib/product-prices.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    PRODUCT_PRICES = {
      "price_1SFbpBDoB4i1qeaLaPQQ0eW5": {
        // 24H
        name: "AI Assistant - 24 Hours",
        duration: "24h",
        type: "ai_assistant"
      },
      "price_1SFXpFDoB4i1qeaLJVQY6Cdb": {
        // 5D
        name: "AI Assistant - 5 Days",
        duration: "5d",
        type: "ai_assistant"
      }
    };
  }
});

// api/stripe/checkout.ts
async function onRequestPost10(context2) {
  const { request, env: env2 } = context2;
  const stripeKey = env2.STRIPE_SECRET_KEY;
  const siteUrl = env2.NEXT_PUBLIC_SITE_URL || "https://mzprimer.com";
  if (!stripeKey) {
    return Response.json({ error: "Stripe Config error" }, { status: 500 });
  }
  const stripe = new stripe_esm_worker_default(stripeKey, {
    // @ts-ignore
    apiVersion: "2024-06-20"
  });
  try {
    const { priceId, orderId } = await request.json();
    const product = PRODUCT_PRICES[priceId];
    if (!product) {
      return Response.json({ error: "Invalid product" }, { status: 400 });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/success?order=${orderId}`,
      cancel_url: `${siteUrl}/cancel`,
      metadata: { orderId, productName: product.name }
    });
    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error3) {
    console.error("Stripe Checkout Error:", error3);
    return Response.json({ error: error3.message }, { status: 500 });
  }
}
var init_checkout = __esm({
  "api/stripe/checkout.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_stripe_esm_worker();
    init_product_prices();
    __name(onRequestPost10, "onRequestPost");
  }
});

// api/stripe/create-session.ts
async function onRequestPost11(context2) {
  const { request, env: env2 } = context2;
  const stripeKey = env2.STRIPE_SECRET_KEY;
  if (!stripeKey) return Response.json({ error: "Config error" }, { status: 500 });
  const stripe = new stripe_esm_worker_default(stripeKey, {
    // @ts-ignore
    apiVersion: "2024-06-20"
  });
  try {
    const { productId, email, buyerName } = await request.json();
    if (!productId || !email) return Response.json({ error: "Missing data" }, { status: 400 });
    const product = Object.values(PRODUCTS).find((p) => p.id === productId);
    if (!product) return Response.json({ error: "Unknown product" }, { status: 404 });
    const orderId = `ord_${Date.now()}`;
    const priceEnvKey = `PRICE_${productId.toUpperCase().replace(/-/g, "_")}`;
    const priceId = env2[priceEnvKey] || "";
    const session = await stripe.checkout.sessions.create({
      mode: product.id.includes("assistant") ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${env2.NEXT_PUBLIC_SITE_URL}/thank-you?orderId=${orderId}`,
      cancel_url: `${env2.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,
      metadata: { orderId, productId, email, buyerName }
    });
    return Response.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
var init_create_session2 = __esm({
  "api/stripe/create-session.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_stripe_esm_worker();
    init_orders();
    __name(onRequestPost11, "onRequestPost");
  }
});

// api/stripe/webhook.ts
async function onRequestPost12(context2) {
  const { request, env: env2 } = context2;
  const stripeKey = env2.STRIPE_SECRET_KEY;
  const webhookSecret = env2.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return Response.json({ error: "Webhook Config error" }, { status: 500 });
  }
  const stripe = new stripe_esm_worker_default(stripeKey, {
    // @ts-ignore
    apiVersion: "2024-06-20"
  });
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";
  try {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("\u{1F4B0} Payment Success recorded for:", session.id);
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Webhook Signature Error:", err.message);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
var init_webhook = __esm({
  "api/stripe/webhook.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_stripe_esm_worker();
    __name(onRequestPost12, "onRequestPost");
  }
});

// api/user/referral-stats.ts
async function onRequestGet2(context2) {
  const { request } = context2;
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return Response.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }
    const referralCount = await query(
      "SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?",
      [userId]
    );
    const userCode = await query(
      "SELECT referral_code FROM users WHERE id = ? LIMIT 1",
      [userId]
    );
    return Response.json({
      success: true,
      referralCount: referralCount[0]?.count || 0,
      referralCode: userCode[0]?.referral_code || null
    });
  } catch (error3) {
    console.error("Get referral stats error:", error3);
    return Response.json(
      {
        success: false,
        error: "Failed to get referral stats"
      },
      { status: 500 }
    );
  }
}
var init_referral_stats = __esm({
  "api/user/referral-stats.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(onRequestGet2, "onRequestGet");
  }
});

// api/user/setup-count.ts
function getUserIdFromToken(token) {
  try {
    const cleanToken = token.replace("Bearer ", "").replace("cf_", "");
    const decoded = JSON.parse(atob(cleanToken));
    return decoded.userId;
  } catch (error3) {
    return null;
  }
}
async function onRequestGet3(context2) {
  try {
    const { request } = context2;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    let targetUserId = userId;
    if (!targetUserId) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader) {
        targetUserId = getUserIdFromToken(authHeader);
      }
    }
    if (!targetUserId) {
      return Response.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }
    const result = await query(
      "SELECT setup_count FROM users WHERE id = ? LIMIT 1",
      [targetUserId]
    );
    if (result.length === 0) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      setupCount: result[0].setup_count || 0
    });
  } catch (error3) {
    console.error("Get setup count error:", error3);
    return Response.json(
      {
        success: false,
        error: "Failed to get setup count"
      },
      { status: 500 }
    );
  }
}
var init_setup_count = __esm({
  "api/user/setup-count.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(getUserIdFromToken, "getUserIdFromToken");
    __name(onRequestGet3, "onRequestGet");
  }
});

// api/user/trials.ts
async function onRequestGet4(context2) {
  const { request } = context2;
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
    }
    const db = getDB();
    if (!db) {
      return Response.json({ success: false, error: "Database not available" }, { status: 500 });
    }
    const userQuery = await db.prepare(
      "SELECT trial_count, license_type, created_at FROM users WHERE id = ?"
    ).bind(userId).first();
    if (!userQuery) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }
    const trialCount = userQuery.trial_count || 0;
    const maxTrials = 2;
    const remaining = Math.max(0, maxTrials - trialCount);
    const available = remaining > 0;
    return Response.json({
      success: true,
      available,
      remaining,
      used: trialCount,
      maxTrials,
      licenseType: userQuery.license_type,
      createdAt: userQuery.created_at
    });
  } catch (error3) {
    return Response.json({ success: false, error: error3.message }, { status: 500 });
  }
}
async function onRequestPost13(context2) {
  const { request } = context2;
  try {
    const { userId } = await request.json();
    if (!userId) {
      return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
    }
    const db = getDB();
    const userQuery = await db.prepare(
      "SELECT trial_count FROM users WHERE id = ?"
    ).bind(userId).first();
    const currentCount = userQuery?.trial_count || 0;
    await db.prepare(
      "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
    ).bind(currentCount + 1, (/* @__PURE__ */ new Date()).toISOString(), userId).run();
    return Response.json({
      success: true,
      newCount: currentCount + 1,
      message: "Trial count incremented"
    });
  } catch (error3) {
    return Response.json({ success: false, error: error3.message }, { status: 500 });
  }
}
async function onRequestPut(context2) {
  const { request } = context2;
  try {
    const { userId, newCount = 0 } = await request.json();
    if (!userId) {
      return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
    }
    const db = getDB();
    await db.prepare(
      "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
    ).bind(newCount, (/* @__PURE__ */ new Date()).toISOString(), userId).run();
    return Response.json({
      success: true,
      newCount,
      message: "Trial count reset"
    });
  } catch (error3) {
    return Response.json({ success: false, error: error3.message }, { status: 500 });
  }
}
var init_trials = __esm({
  "api/user/trials.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(onRequestGet4, "onRequestGet");
    __name(onRequestPost13, "onRequestPost");
    __name(onRequestPut, "onRequestPut");
  }
});

// api/user/use-setup.ts
function getUserIdFromToken2(token) {
  try {
    const cleanToken = token.replace("Bearer ", "").replace("cf_", "");
    const decoded = JSON.parse(atob(cleanToken));
    return decoded.userId;
  } catch (error3) {
    return null;
  }
}
async function onRequestPost14(context2) {
  const { request } = context2;
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return Response.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }
    const body = await request.json().catch(() => ({}));
    const { userId } = body;
    const tokenUserId = getUserIdFromToken2(authHeader);
    const targetUserId = userId || tokenUserId;
    if (!targetUserId) {
      return Response.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }
    const currentCount = await query(
      "SELECT setup_count FROM users WHERE id = ? LIMIT 1",
      [targetUserId]
    );
    if (currentCount.length === 0) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    const setupCount = currentCount[0].setup_count || 0;
    if (setupCount <= 0) {
      return Response.json(
        {
          success: false,
          error: "no-credits",
          message: "No setup credits available"
        },
        { status: 400 }
      );
    }
    const result = await execute(
      "UPDATE users SET setup_count = setup_count - 1 WHERE id = ? AND setup_count > 0",
      [targetUserId]
    );
    if (result.success) {
      return Response.json({
        success: true,
        message: "Setup used successfully",
        remaining: setupCount - 1
      });
    } else {
      return Response.json(
        {
          success: false,
          error: "Failed to update setup count"
        },
        { status: 500 }
      );
    }
  } catch (error3) {
    console.error("Use setup error:", error3);
    return Response.json(
      { success: false, error: "Failed to use setup" },
      { status: 500 }
    );
  }
}
var init_use_setup = __esm({
  "api/user/use-setup.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(getUserIdFromToken2, "getUserIdFromToken");
    __name(onRequestPost14, "onRequestPost");
  }
});

// ../backend-lib/email.ts
async function sendOrderConfirmation(order, env2) {
  const apiKey = env2.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing in Cloudflare Dashboard");
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env2.EMAIL_FROM || "MZPrimer <orders@mzprimer.com>",
      to: [order.to],
      subject: `Order Confirmed: ${order.productName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Order Confirmed! \u{1F389}</h1>
          <p>Product: ${order.productName}</p>
          <p>Order ID: ${order.orderId}</p>
          <p>Amount Paid: $${order.amountPaid.toFixed(2)}</p>
          <a href="https://mzprimer.com/client/dashboard">Go to Dashboard</a>
        </div>
      `
    })
  });
  if (!response.ok) {
    const err = await response.text();
    console.error("Email API Error:", err);
  }
}
async function sendEmail(details, env2) {
  const apiKey = env2.RESEND_API_KEY;
  if (!apiKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env2.EMAIL_FROM || "MZPrimer Contact <contact@mzprimer.com>",
      to: [details.to],
      subject: details.subject,
      html: details.html,
      text: details.text
    })
  });
}
var init_email = __esm({
  "../backend-lib/email.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(sendOrderConfirmation, "sendOrderConfirmation");
    __name(sendEmail, "sendEmail");
  }
});

// api/webhooks/stripe.ts
async function onRequestPost15(context2) {
  const { request, env: env2 } = context2;
  const stripeKey = env2.STRIPE_SECRET_KEY;
  const webhookSecret = env2.STRIPE_WEBHOOK_SECRET_CHATBOT;
  if (!stripeKey || !webhookSecret) {
    return Response.json({ error: "Stripe configuration missing" }, { status: 500 });
  }
  const stripe = new stripe_esm_worker_default(stripeKey, {
    // @ts-ignore
    apiVersion: "2023-10-16"
  });
  const sig = request.headers.get("stripe-signature") || "";
  const body = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await handleCheckoutCompleted(session, stripe, context2);
  }
  return Response.json({ received: true });
}
async function handleCheckoutCompleted(session, stripe, context2) {
  const { env: env2 } = context2;
  const userId = session.metadata?.userId || session.metadata?.uid;
  const customerEmail = session.customer_details?.email || session.customer_email;
  const sessionId = session.id;
  if (!userId || !customerEmail) return;
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id;
    if (!priceId) return;
    const setupsToAdd = SETUP_PLANS[priceId];
    if (!setupsToAdd) return;
    const now = Date.now();
    const user = await queryOne(
      "SELECT setup_count, email FROM users WHERE id = ?",
      [userId]
    );
    if (!user) return;
    const newCount = (user.setup_count || 0) + setupsToAdd;
    await execute(
      `UPDATE users SET setup_count = ?, updated_at = ?, last_purchase_at = ? WHERE id = ?`,
      [newCount, now, now, userId]
    );
    await execute(
      `INSERT INTO stripe_purchases (user_id, stripe_session_id, price_id, setup_count, amount_paid, currency, customer_email, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)`,
      [userId, sessionId, priceId, setupsToAdd, (session.amount_total ?? 0) / 100, session.currency?.toUpperCase() || "EUR", customerEmail, now, now]
    );
    await execute(
      `INSERT INTO setup_credits_history (user_id, change_amount, new_total, reason, stripe_session_id, created_at) VALUES (?, ?, ?, 'stripe_purchase', ?, ?)`,
      [userId, setupsToAdd, newCount, sessionId, now]
    );
    await sendOrderConfirmation({
      to: customerEmail,
      orderId: session.id,
      productName: `${setupsToAdd} Setup Credits`,
      amountPaid: (session.amount_total ?? 0) / 100
    }, env2);
    const appUrl = env2.NEXT_PUBLIC_APP_URL || "https://mzprimer.com";
    await fetch(`${appUrl}/api/push/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetUserId: userId,
        title: "\u2705 Purchase Complete!",
        message: `You've received ${setupsToAdd} setup credits.`,
        url: "/client/dashboard"
      })
    });
  } catch (err) {
    console.error("\u274C Webhook processing error:", err);
    await execute(
      `INSERT INTO stripe_webhook_errors (event_type, stripe_session_id, user_id, error_message, created_at) VALUES (?, ?, ?, ?, ?)`,
      ["checkout.session.completed", session.id, userId, err.message, Date.now()]
    );
  }
}
var SETUP_PLANS;
var init_stripe = __esm({
  "api/webhooks/stripe.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_stripe_esm_worker();
    init_db_simple();
    init_email();
    SETUP_PLANS = {
      "price_1SSyQORmR6ESDQvobwheaXws": 10,
      "price_1SSyRGRmR6ESDQvoKgAI9CAN": 20,
      "price_1SSyUORmR6ESDQvo7dzPKmPt": 30
    };
    __name(onRequestPost15, "onRequestPost");
    __name(handleCheckoutCompleted, "handleCheckoutCompleted");
  }
});

// api/contact.ts
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
async function onRequestPost16(context2) {
  const { request, env: env2 } = context2;
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, message, hp } = body;
    if (hp) return Response.json({ ok: true });
    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "All fields required." }, { status: 400 });
    }
    const html = `
      <div style="font-family:sans-serif; color:#111">
        <h2>New Contact Form Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b><br>${escapeHtml(message)}</p>
      </div>
    `;
    await sendEmail({
      to: env2.EMAIL_TO || "contact@mzprimer.com",
      subject: `Contact Form: ${name}`,
      html,
      text: `Name: ${name}
Email: ${email}

${message}`
    }, env2);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact send error:", err);
    return Response.json({ ok: false, error: "Email service unavailable." }, { status: 500 });
  }
}
var init_contact = __esm({
  "api/contact.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_email();
    __name(escapeHtml, "escapeHtml");
    __name(onRequestPost16, "onRequestPost");
  }
});

// api/livemarketfeed.ts
async function onRequestGet5(context2) {
  const { env: env2 } = context2;
  try {
    const R2_URL = "https://data.mzprimer.com/market_intelligence.json";
    const url = `${R2_URL}?t=${Date.now()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache"
      }
    });
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "R2 Fetch Failed" }), { status: 500 });
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
        // Cache for 30s
        "Access-Control-Allow-Origin": "*"
        // Prevent CORS errors
      }
    });
  } catch (error3) {
    return new Response(JSON.stringify({ error: error3.message }), { status: 500 });
  }
}
var init_livemarketfeed = __esm({
  "api/livemarketfeed.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequestGet5, "onRequestGet");
  }
});

// api/performance.ts
async function onRequestGet6(context2) {
  const { request, env: env2 } = context2;
  try {
    console.log("\u{1F680} Performance API called - fetching fresh data from Google Storage");
    const response = await fetch(
      "https://us-central1-mzprimer-livefeed.cloudfunctions.net/api/performance",
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        },
        // Standard Cloudflare timeout handling
        signal: AbortSignal.timeout(1e4)
      }
    );
    if (!response.ok) {
      throw new Error(`Google Storage returned ${response.status}: ${response.statusText}`);
    }
    const performanceData = await response.json();
    if (!performanceData.topPerformers || !performanceData.worstPerformers) {
      throw new Error("Invalid data structure from Google Storage");
    }
    return Response.json(performanceData);
  } catch (error3) {
    console.error("\u274C API route error:", error3);
    return Response.json({
      topPerformers: [],
      worstPerformers: []
    });
  }
}
var init_performance3 = __esm({
  "api/performance.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequestGet6, "onRequestGet");
  }
});

// api/price.ts
async function onRequestGet7(context2) {
  const { request } = context2;
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    if (!symbol) {
      return Response.json({ error: "Symbol parameter required" }, { status: 400 });
    }
    console.log("\u{1F680} Price API (R2) called for symbol:", symbol);
    const R2_URL = "https://data.mzprimer.com/prices.json";
    const response = await fetch(R2_URL, {
      cf: { cacheTtl: 60 }
    });
    if (!response.ok) {
      throw new Error(`Cloudflare R2 returned ${response.status}`);
    }
    const data = await response.json();
    const symbolData = data[symbol];
    if (!symbolData || typeof symbolData.price !== "number") {
      console.warn(`\u26A0\uFE0F Symbol '${symbol}' not found in R2 prices.json`);
      return Response.json({ error: "Symbol not found or invalid price" }, { status: 404 });
    }
    return Response.json({
      symbol,
      price: symbolData.price,
      decimals: symbolData.decimals,
      timestamp: symbolData.timestamp
    });
  } catch (error3) {
    console.error("\u274C Price API error:", error3);
    return Response.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
var init_price = __esm({
  "api/price.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequestGet7, "onRequestGet");
  }
});

// api/setup.ts
async function onRequestGet8(context2) {
  const { request } = context2;
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    if (!symbol) {
      return Response.json({ error: "Symbol parameter required" }, { status: 400 });
    }
    const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
    console.log("\u{1F680} Setup API (R2) called for symbol:", cleanSymbol);
    const R2_URL = "https://data.mzprimer.com";
    const fileUrl = `${R2_URL}/output_${cleanSymbol}.json`;
    console.log("\u{1F4E1} Fetching from R2:", fileUrl);
    const response = await fetch(fileUrl, {
      headers: { "Accept": "application/json" },
      // FIXED: 'next: { revalidate }' changed to Cloudflare native 'cf: { cacheTtl }'
      cf: { cacheTtl: 60 }
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`\u274C Symbol file 'output_${cleanSymbol}.json' not found in R2`);
        return Response.json({ error: "Symbol setup not found" }, { status: 404 });
      }
      throw new Error(`Cloudflare R2 returned ${response.status}`);
    }
    const symbolData = await response.json();
    console.log(`\u2705 Successfully fetched setup for ${cleanSymbol} from R2`);
    return Response.json(symbolData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        "Content-Type": "application/json"
      }
    });
  } catch (error3) {
    console.error("\u274C Setup API error:", error3);
    return Response.json(
      { error: "Failed to fetch setup data" },
      { status: 500 }
    );
  }
}
var init_setup = __esm({
  "api/setup.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequestGet8, "onRequestGet");
  }
});

// api/setups.ts
function getUserIdFromToken3(token) {
  try {
    const cleanToken = token.replace("Bearer ", "").replace("cf_", "");
    const decoded = JSON.parse(atob(cleanToken));
    return decoded.userId;
  } catch (error3) {
    return null;
  }
}
async function onRequestPost17(context2) {
  const { request } = context2;
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return Response.json({ success: false, error: "No token provided" }, { status: 401 });
    }
    const userId = getUserIdFromToken3(authHeader);
    if (!userId) {
      return Response.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
    const body = await request.json();
    const {
      symbol,
      entry_price,
      take_profit,
      stop_loss,
      capital,
      lot_size,
      risk_reward
    } = body;
    if (!symbol || !entry_price || !capital) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    const setupId = crypto.randomUUID();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const result = await execute(
      `INSERT INTO setups (
        id, user_id, symbol, entry_price, take_profit, stop_loss,
        capital, lot_size, risk_reward, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        setupId,
        userId,
        symbol,
        entry_price,
        take_profit || null,
        stop_loss || null,
        capital,
        lot_size || null,
        risk_reward || 1,
        "active",
        now,
        now
      ]
    );
    if (result.success) {
      return Response.json({ success: true, setupId, message: "Setup saved" });
    } else {
      throw new Error("D1 execution failed");
    }
  } catch (error3) {
    console.error("Save setup error:", error3);
    return Response.json({ success: false, error: "Failed to save setup" }, { status: 500 });
  }
}
async function onRequestGet9(context2) {
  const { request } = context2;
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return Response.json({ success: false, error: "No token provided" }, { status: 401 });
    }
    const userId = getUserIdFromToken3(authHeader);
    if (!userId) {
      return Response.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const setups = await query(
      `SELECT * FROM setups 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return Response.json({
      success: true,
      setups,
      count: setups.length
    });
  } catch (error3) {
    console.error("Get setups error:", error3);
    return Response.json({ success: false, error: "Failed to retrieve setups" }, { status: 500 });
  }
}
var init_setups = __esm({
  "api/setups.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(getUserIdFromToken3, "getUserIdFromToken");
    __name(onRequestPost17, "onRequestPost");
    __name(onRequestGet9, "onRequestGet");
  }
});

// ../app/lib/fetchData.ts
function normalizePrice(symbol, value) {
  if (value === void 0 || value === null) return 0;
  const cleanSym = symbol.replace(/[-_/]/g, "").toUpperCase();
  const spec = SYMBOL_SPECS[cleanSym];
  const decimals = spec ? spec.decimals : 2;
  return parseFloat(value.toFixed(decimals));
}
async function getSymbolData(symbolParam) {
  try {
    if (!symbolParam) return null;
    const cleanSymbol = symbolParam.replace(/[-_/]/g, "").toUpperCase();
    const R2_PUBLIC_URL = "https://data.mzprimer.com";
    const url = `${R2_PUBLIC_URL}/output_${cleanSymbol}.json?t=${Date.now()}`;
    const res = await fetch(url, {
      // Cloudflare native fetch uses 'cf' object for caching control
      // This tells Cloudflare to cache this JSON at the edge for 5 minutes
      // @ts-ignore
      cf: { cacheTtl: 300 }
    });
    if (!res.ok) {
      console.warn("Failed to fetch from R2:", cleanSymbol, res.status);
      return null;
    }
    const data = await res.json();
    if (!data.symbol) data.symbol = cleanSymbol;
    if (data.trend) {
      data.trend.current_price = normalizePrice(cleanSymbol, data.trend.current_price);
      if (data.trend.current_emas) {
        data.trend.current_emas.ema_8 = normalizePrice(cleanSymbol, data.trend.current_emas.ema_8);
        data.trend.current_emas.ema_21 = normalizePrice(cleanSymbol, data.trend.current_emas.ema_21);
        data.trend.current_emas.ema_50 = normalizePrice(cleanSymbol, data.trend.current_emas.ema_50);
      }
    }
    if (data.zones) {
      data.zones.support_zone = normalizePrice(cleanSymbol, data.zones.support_zone);
      data.zones.resistance_zone = normalizePrice(cleanSymbol, data.zones.resistance_zone);
    }
    if (data.volatility) {
      data.volatility.avg_atr = normalizePrice(cleanSymbol, data.volatility.avg_atr);
      data.volatility.current_atr = normalizePrice(cleanSymbol, data.volatility.current_atr);
      data.volatility.avg_range = normalizePrice(cleanSymbol, data.volatility.avg_range);
    }
    return data;
  } catch (error3) {
    console.error(`Data fetch error for ${symbolParam}:`, error3);
    return null;
  }
}
var SYMBOL_SPECS;
var init_fetchData = __esm({
  "../app/lib/fetchData.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    SYMBOL_SPECS = {
      // Forex
      "EURUSD": { pip: 1e-4, contract: 1e5, decimals: 5 },
      "GBPUSD": { pip: 1e-4, contract: 1e5, decimals: 5 },
      "USDJPY": { pip: 0.01, contract: 1e5, decimals: 3 },
      "USDCAD": { pip: 1e-4, contract: 1e5, decimals: 5 },
      "AUDUSD": { pip: 1e-4, contract: 1e5, decimals: 5 },
      "NZDUSD": { pip: 1e-4, contract: 1e5, decimals: 5 },
      "USDCHF": { pip: 1e-4, contract: 1e5, decimals: 5 },
      "EURJPY": { pip: 0.01, contract: 1e5, decimals: 3 },
      "EURGBP": { pip: 1e-4, contract: 1e5, decimals: 5 },
      "GBPJPY": { pip: 0.01, contract: 1e5, decimals: 3 },
      "GBPCHF": { pip: 1e-4, contract: 1e5, decimals: 5 },
      // Metals
      "XAUUSD": { pip: 0.01, contract: 100, decimals: 2 },
      "XAUEUR": { pip: 0.01, contract: 100, decimals: 2 },
      "XAGUSD": { pip: 1e-3, contract: 5e3, decimals: 3 },
      "PLATINUM": { pip: 0.01, contract: 100, decimals: 2 },
      // Energy
      "BRENT": { pip: 0.01, contract: 1e3, decimals: 2 },
      // Crypto
      "BTCUSD": { pip: 1, contract: 1, decimals: 1 },
      "ETHUSD": { pip: 0.1, contract: 1, decimals: 2 },
      "XRPUSD": { pip: 1e-4, contract: 1e3, decimals: 4 },
      "LTCUSD": { pip: 0.01, contract: 10, decimals: 2 },
      "DOGEUSD": { pip: 1e-4, contract: 1e3, decimals: 4 },
      // Indices
      "US500": { pip: 0.1, contract: 1, decimals: 2 },
      "USTEC": { pip: 0.1, contract: 1, decimals: 2 },
      "US30": { pip: 1, contract: 1, decimals: 1 },
      "HK50": { pip: 0.1, contract: 1, decimals: 2 },
      "FRANCE40": { pip: 0.1, contract: 1, decimals: 2 },
      "CHINA50": { pip: 0.1, contract: 1, decimals: 1 },
      "UK100": { pip: 0.1, contract: 1, decimals: 1 }
    };
    __name(normalizePrice, "normalizePrice");
    __name(getSymbolData, "getSymbolData");
  }
});

// api/symbol-data.ts
async function onRequestGet10(context2) {
  const { request } = context2;
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    if (!symbol) {
      return Response.json(
        { error: "Symbol parameter is required" },
        { status: 400 }
      );
    }
    const data = await getSymbolData(symbol);
    if (!data) {
      return Response.json(
        { error: `No data found for symbol: ${symbol}` },
        { status: 404 }
      );
    }
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        "Content-Type": "application/json"
      }
    });
  } catch (error3) {
    console.error("API error:", error3);
    return Response.json(
      { error: error3.message || "Internal server error" },
      { status: 500 }
    );
  }
}
var init_symbol_data = __esm({
  "api/symbol-data.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_fetchData();
    __name(onRequestGet10, "onRequestGet");
  }
});

// api/unsubscribe.ts
async function onRequestPost18(context2) {
  const { request } = context2;
  try {
    const { email, reason } = await request.json();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();
    const result = await execute(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, unsubscribe_reason = ?
       WHERE email = ?`,
      [now, now, reason || "user_request", normalizedEmail]
    );
    if (result.success) {
      console.log(`\u{1F4ED} Subscriber unsubscribed: ${normalizedEmail}`);
      return Response.json({
        success: true,
        message: "You have been unsubscribed successfully.",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } else {
      return Response.json({ error: "Subscriber not found" }, { status: 404 });
    }
  } catch (error3) {
    console.error("\u274C Unsubscribe error:", error3);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
async function onRequestGet11(context2) {
  const { request } = context2;
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const origin = url.origin;
  if (!email) {
    return Response.redirect(`${origin}/faq`, 302);
  }
  try {
    const result = await execute(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, unsubscribe_reason = ?
       WHERE email = ?`,
      [Date.now(), Date.now(), "link_click", email.toLowerCase().trim()]
    );
    if (result.success) {
      return Response.redirect(`${origin}/legal`, 302);
    } else {
      return Response.redirect(`${origin}/faq`, 302);
    }
  } catch (err) {
    return Response.redirect(`${origin}/faq`, 302);
  }
}
var init_unsubscribe2 = __esm({
  "api/unsubscribe.ts"() {
    "use strict";
    init_functionsRoutes_0_14173732956640372();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db_simple();
    __name(onRequestPost18, "onRequestPost");
    __name(onRequestGet11, "onRequestGet");
  }
});

// ../.wrangler/tmp/pages-q7nEGB/functionsRoutes-0.14173732956640372.mjs
var routes;
var init_functionsRoutes_0_14173732956640372 = __esm({
  "../.wrangler/tmp/pages-q7nEGB/functionsRoutes-0.14173732956640372.mjs"() {
    "use strict";
    init_login();
    init_logout();
    init_me();
    init_register();
    init_create_session();
    init_create();
    init_subscribe();
    init_sync();
    init_unsubscribe();
    init_redeem();
    init_checkout();
    init_create_session2();
    init_webhook();
    init_referral_stats();
    init_setup_count();
    init_trials();
    init_trials();
    init_trials();
    init_use_setup();
    init_stripe();
    init_contact();
    init_livemarketfeed();
    init_performance3();
    init_price();
    init_setup();
    init_setups();
    init_setups();
    init_symbol_data();
    init_unsubscribe2();
    init_unsubscribe2();
    routes = [
      {
        routePath: "/api/auth/login",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/api/auth/logout",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost2]
      },
      {
        routePath: "/api/auth/me",
        mountPath: "/api/auth",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet]
      },
      {
        routePath: "/api/auth/register",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost3]
      },
      {
        routePath: "/api/checkout/create-session",
        mountPath: "/api/checkout",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost4]
      },
      {
        routePath: "/api/order/create",
        mountPath: "/api/order",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost5]
      },
      {
        routePath: "/api/push/subscribe",
        mountPath: "/api/push",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost6]
      },
      {
        routePath: "/api/push/sync",
        mountPath: "/api/push",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost7]
      },
      {
        routePath: "/api/push/unsubscribe",
        mountPath: "/api/push",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost8]
      },
      {
        routePath: "/api/referral/redeem",
        mountPath: "/api/referral",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost9]
      },
      {
        routePath: "/api/stripe/checkout",
        mountPath: "/api/stripe",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost10]
      },
      {
        routePath: "/api/stripe/create-session",
        mountPath: "/api/stripe",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost11]
      },
      {
        routePath: "/api/stripe/webhook",
        mountPath: "/api/stripe",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost12]
      },
      {
        routePath: "/api/user/referral-stats",
        mountPath: "/api/user",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet2]
      },
      {
        routePath: "/api/user/setup-count",
        mountPath: "/api/user",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet3]
      },
      {
        routePath: "/api/user/trials",
        mountPath: "/api/user",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet4]
      },
      {
        routePath: "/api/user/trials",
        mountPath: "/api/user",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost13]
      },
      {
        routePath: "/api/user/trials",
        mountPath: "/api/user",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut]
      },
      {
        routePath: "/api/user/use-setup",
        mountPath: "/api/user",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost14]
      },
      {
        routePath: "/api/webhooks/stripe",
        mountPath: "/api/webhooks",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost15]
      },
      {
        routePath: "/api/contact",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost16]
      },
      {
        routePath: "/api/livemarketfeed",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet5]
      },
      {
        routePath: "/api/performance",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet6]
      },
      {
        routePath: "/api/price",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet7]
      },
      {
        routePath: "/api/setup",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet8]
      },
      {
        routePath: "/api/setups",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet9]
      },
      {
        routePath: "/api/setups",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost17]
      },
      {
        routePath: "/api/symbol-data",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet10]
      },
      {
        routePath: "/api/unsubscribe",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet11]
      },
      {
        routePath: "/api/unsubscribe",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost18]
      }
    ];
  }
});

// ../.wrangler/tmp/bundle-w8jzN2/middleware-loader.entry.ts
init_functionsRoutes_0_14173732956640372();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../.wrangler/tmp/bundle-w8jzN2/middleware-insertion-facade.js
init_functionsRoutes_0_14173732956640372();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_14173732956640372();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_14173732956640372();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_functionsRoutes_0_14173732956640372();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_functionsRoutes_0_14173732956640372();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-w8jzN2/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
init_functionsRoutes_0_14173732956640372();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-w8jzN2/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.6882270700363204.mjs.map
