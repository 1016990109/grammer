/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class Tracker {
  static _constructor() {
    if (Tracker._isInitialized) return;
    const e = EnvironmentAdapter.getURL("/");
    window.addEventListener("error", (r => {
      const t = r.message, n = r.filename, a = r.lineno, o = r.error;
      if (!n || !n.startsWith(e)) return;
      if ("string" != typeof t) return;
      if (t.includes("ResizeObserver")) return;
      const i = o && generateStackTrace(o);
      i ? Tracker.trackError("js", t, i) : Tracker.trackError("js", t, `${n}:${a}`)
    })), Tracker._isInitialized = !0
  }

  static getCustomDimensions() {
    const e = Tracker._storageController.getSettings(), r = Tracker._storageController.getUIState();
    return {
      dimension2: this.VERSION,
      dimension3: r.hasPaidSubscription,
      dimension4: e.username && (e.password || e.token),
      dimension5: e.preferredLanguages.join(","),
      dimension6: e.hasPickyModeEnabledGlobally
    }
  }

  static _getTrackingUrlForPageView(e) {
    return e = (e = e.replace(/^(chrome|moz|safari|edge)-extension:\/\/.+?\//i, "")).replace(/^[a-z0-9]{8}\//i, "/"), e = `${Tracker.TRACKING_BASE_PAGE_URL}${e}`, new Promise(((r, t) => {
      Tracker._storageController.onReady((() => {
        const {firstVisit: t, sessionCount: n} = Tracker._storageController.getStatistics(),
          a = Tracker._storageController.getUniqueId(), o = Object.assign({
            idsite: Tracker.TRACKING_SITE_ID,
            rec: "1",
            url: e,
            rand: Date.now(),
            apiv: "1",
            res: `${screen.width}x${screen.height}`,
            _id: a,
            _idts: t,
            _idvc: n
          }, this.getCustomDimensions());
        let i = "";
        for (const e in o) o.hasOwnProperty(e) && (i += `${e}=${encodeURIComponent(o[e])}&`);
        r(`${Tracker.TRACKING_BASE_URL}?${i}`)
      }))
    }))
  }

  static _getTrackingUrlForEvent(e, r, t = "", n) {
    return n = n || Tracker.TRACKING_BASE_PAGE_URL, new Promise(((a, o) => {
      Tracker._storageController.onReady((() => {
        const {firstVisit: o, sessionCount: i} = Tracker._storageController.getStatistics(),
          s = Tracker._storageController.getUniqueId(), c = Object.assign({
            idsite: Tracker.TRACKING_SITE_ID,
            rec: "1",
            url: n,
            action_name: r,
            rand: Date.now(),
            apiv: "1",
            res: `${screen.width}x${screen.height}`,
            _id: s,
            _idts: o,
            _idvc: i,
            e_c: e,
            e_a: r,
            e_n: t
          }, this.getCustomDimensions());
        let g = "";
        for (const e in c) c.hasOwnProperty(e) && (g += `${e}=${encodeURIComponent(c[e])}&`);
        a(`${Tracker.TRACKING_BASE_URL}?${g}`)
      }))
    }))
  }

  static _sendRequest(e) {
    if (EnvironmentAdapter.shouldTrack() && !Tracker._storageController.hasCustomServer()) {
      const r = new Image;
      r.referrerPolicy = "no-referrer", r.src = e
    }
  }

  static trackPageView(e) {
    e = e || getCurrentUrl(), Tracker._getTrackingUrlForPageView(e).then((r => {
      EnvironmentAdapter.isProductionEnvironment() ? Tracker._sendRequest(r) : console.log("LT Page view tracking disabled in dev mode", {
        pageUrl: e,
        trackingUrl: r
      })
    })).catch((e => {
      console.log("LT could not track because:", e && e.message)
    }))
  }

  static trackDisabledRule(e, r, t, n) {
    if (!e.match(/^de|en|nl|es|fr/i)) return;
    const a = n ? config.PACKAGE.PREMIUM : config.PACKAGE.BASIC, o = e + ":" + r, i = t;
    let s = Tracker.TRACKING_BASE_URL;
    s += `?idsite=18&rec=1&url=${encodeURIComponent(Tracker.TRACKING_BASE_PAGE_URL)}`, s += `&action_name=${a}&rand=${Date.now()}&apiv=1&_id=${this._storageController.getUniqueId()}`, s += `&e_c=${a}&e_a=${encodeURIComponent(o)}&e_n=${encodeURIComponent(t)}`, EnvironmentAdapter.isProductionEnvironment() ? this._sendRequest(s) : console.log("LT Event tracking disabled in dev mode", {
      actionCategory: a,
      action: o,
      actionName: i,
      trackingUrl: s
    })
  }

  static trackDictionaryEvent(e, r, t = !1) {
    if (!e.match(/^de|en|nl|es|fr|it|pt|ru|ca|pl/i)) return;
    const n = t ? "TemporaryIgnored" : "PersistentlyIgnored", a = `${e}:add_word`, o = r;
    let i = Tracker.TRACKING_BASE_URL;
    i += `?idsite=19&rec=1&url=${encodeURIComponent(Tracker.TRACKING_BASE_PAGE_URL)}`, i += `&action_name=${n}&rand=${Date.now()}&apiv=1&_id=${this._storageController.getUniqueId()}`, i += `&e_c=${n}&e_a=${encodeURIComponent(a)}&e_n=${encodeURIComponent(r)}`, EnvironmentAdapter.isProductionEnvironment() ? this._sendRequest(i) : console.log("LT Event tracking disabled in dev mode", {
      actionCategory: n,
      action: a,
      actionName: o,
      trackingUrl: i
    })
  }

  static trackEvent(e, r, t, n) {
    this._getTrackingUrlForEvent(e, r, t, n).then((n => {
      EnvironmentAdapter.isProductionEnvironment() ? this._sendRequest(n) : console.log("LT Event tracking disabled in dev mode", {
        actionCategory: e,
        action: r,
        actionName: t,
        trackingUrl: n
      })
    })).catch((e => {
      console.log("LT could not track because:", e && e.message)
    }))
  }

  static trackInstall() {
    Tracker.trackEvent("Action", "install", LanguageManager.getPrimaryLanguageCode(navigator.language)), this._storageController.updateUIState({isNewUser: !0})
  }

  static trackActivity() {
    const e = Date.now(), {
      sessionCount: r,
      firstVisit: t,
      lastActivity: n
    } = this._storageController.getStatistics(), {isNewUser: a} = this._storageController.getUIState();
    if ((!n || e - n > Tracker.ACTIVITY_TRACK_INTERVAL) && (this._storageController.updateStatistics({
      sessionCount: r + 1,
      lastActivity: e
    }), this.trackEvent("Action", "ping", LanguageManager.getPrimaryLanguageCode(navigator.language))), a && t) {
      const r = 6048e5, n = 8 * r, a = e - 1e3 * t;
      a > r && a < n && this._storageController.updateUIState({isNewUser: !1}).then((() => {
        this.trackEvent("Action", "active_after_one_week", LanguageManager.getPrimaryLanguageCode(navigator.language))
      })).catch((e => {
        const r = String(e && e.message ? e.message : e);
        this.trackEvent("JS-Error", `activity error: ${r}`)
      }))
    }
  }

  static trackError(e, r, t = "") {
    try {
      if (BrowserDetector.isUnsupportedBrowser()) return;
      if (Tracker._errorCount++, Tracker._errorCount > config.MAX_EXCEPTION_COUNT) return;
      if ("string" != typeof r) return;
      if (Tracker._loggedErrors) if (Tracker._loggedErrors.length < Tracker.THROTTLE_REQUESTS) Tracker._loggedErrors.push(Date.now()); else {
        const e = Date.now();
        if (!(e - Tracker._loggedErrors[0] >= Tracker.MAX_TIME)) return;
        Tracker._loggedErrors.push(e), Tracker._loggedErrors.splice(0, 1)
      } else Tracker._loggedErrors = [Date.now()];
      let n = "JS-Error";
      "message" === e ? n = "Message-Error" : "http" === e ? n = "HTTP-Error" : "other" === e && (n = "Other-Error");
      let a = getCurrentUrl();
      a = a.replace(/^moz-extension:\/\/[a-z0-9\-]+\//, "moz-extension://xxxx-xxxx-xxxx-xxxx/"), a.match(/(chrome|moz|safari)\-extension:/) || (a = void 0), this.trackEvent(n, r, t || a, a)
    } catch (e) {
      console.error("Error while logging error from language tool", e)
    }
  }

  static trackStat(e, r) {
    0 === Math.floor(10 * Math.random()) && Tracker.trackEvent("Stat", e, r)
  }

  static trackTextLength(e) {
    if (0 === e) return;
    let r = "";
    r = e <= 100 ? "1-100" : e <= 1e3 ? "101-1000" : e <= 2500 ? "1001-2500" : e <= 5e3 ? "2501-5000" : e <= 7500 ? "5001-7500" : e <= 1e4 ? "7501-10000" : e <= 15e3 ? "10001-15000" : e <= 2e4 ? "15001-20000" : e <= 4e4 ? "20001-40000" : e <= 6e4 ? "40001-60000" : e <= 8e4 ? "60001-80000" : e <= 1e5 ? "80001-100000" : ">100000", this.trackStat("text_length", r)
  }
}

Tracker.TRACKING_BASE_URL = "https://analytics.languagetoolplus.com/matomo/piwik.php", Tracker.TRACKING_BASE_PAGE_URL = "https://fake/", Tracker.TRACKING_SITE_ID = EnvironmentAdapter.getTrackingId(), Tracker.ACTIVITY_TRACK_INTERVAL = 864e5, Tracker.MAX_TIME = 6e4, Tracker.THROTTLE_REQUESTS = 10, Tracker.VERSION = EnvironmentAdapter.getVersion(), Tracker._storageController = StorageController.create(), Tracker._isInitialized = !1, Tracker._loggedErrors = null, Tracker._errorCount = 0, Tracker._constructor();