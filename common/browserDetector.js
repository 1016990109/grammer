/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class BrowserDetector {
  static _contructor() {
    if (this._isInitialized) return;
    BrowserDetector._isChromium = navigator.userAgent.includes("Chrome/") || navigator.userAgent.includes("Chromium/"), BrowserDetector._isFirefox = navigator.userAgent.includes("Firefox/"), BrowserDetector._isThunderbird = navigator.userAgent.includes("Thunderbird/"), BrowserDetector._isOpera = navigator.userAgent.includes("OPR/"), BrowserDetector._isEdge = navigator.userAgent.includes("Edg/"), BrowserDetector._isOldEdge = navigator.userAgent.includes("Edge/"), BrowserDetector._isSafari = (navigator.userAgent.includes("Safari/") || navigator.userAgent.includes("AppleWebKit")) && !BrowserDetector._isChromium && !BrowserDetector._isEdge && !BrowserDetector._isOpera, BrowserDetector._isYaBrowser = navigator.userAgent.includes("YaBrowser/"), BrowserDetector._isChrome = BrowserDetector._isChromium && !BrowserDetector._isOpera && !BrowserDetector._isEdge && !BrowserDetector._isOldEdge && !BrowserDetector._isYaBrowser;
    const r = navigator.userAgent.match(/Chrome\/(\d+)/);
    r && (BrowserDetector._isUnsupportedChrome = parseInt(r[1]) < 67 && !navigator.userAgent.includes("Edge/"));
    const e = navigator.userAgent.match(/Firefox\/(\d+)/);
    e && (BrowserDetector._isUnsupportedFirefox = parseInt(e[1]) < 60), this._isInitialized = !0
  }

  static getOS() {
    return navigator.userAgent.includes("Macintosh") ? "Mac" : navigator.userAgent.includes("Windows") ? "Windows" : navigator.userAgent.includes("CrOS") ? "CrOS" : navigator.userAgent.includes("Linux") ? "Linux" : "Other"
  }

  static isChromium() {
    return BrowserDetector._isChromium
  }

  static isChrome() {
    return BrowserDetector._isChrome
  }

  static isThunderbird() {
    return BrowserDetector._isThunderbird
  }

  static isFirefox() {
    return BrowserDetector._isFirefox
  }

  static isOpera() {
    return BrowserDetector._isOpera
  }

  static isEdge() {
    return BrowserDetector._isEdge
  }

  static isSafari() {
    return BrowserDetector._isSafari
  }

  static isYaBrowser() {
    return BrowserDetector._isYaBrowser
  }

  static isUnsupportedChrome() {
    return BrowserDetector._isUnsupportedChrome
  }

  static isUnsupportedFirefox() {
    return BrowserDetector._isUnsupportedFirefox
  }

  static isUnsupportedBrowser() {
    return BrowserDetector.isUnsupportedChrome() || BrowserDetector.isUnsupportedFirefox()
  }

  static getBrowserName() {
    return BrowserDetector.isChrome() ? "Chrome" : BrowserDetector.isFirefox() ? "Firefox" : BrowserDetector.isOpera() ? "Opera" : BrowserDetector.isEdge() ? "Edge" : BrowserDetector.isSafari() ? "Safari" : BrowserDetector.isYaBrowser() ? "Yandex" : "Unknown Browser"
  }

  static getUserAgentIdentifier() {
    let r = "webextension";
    return this.isChrome() ? r += "-chrome" : this.isFirefox() ? r += "-firefox" : this.isOpera() ? r += "-opera" : this.isEdge() ? r += "-edge" : this.isYaBrowser() ? r += "-chrome" : this.isSafari() ? r += "-safari" : r += "-unknown", r + "-ng"
  }

  static isTouchDevice() {
    if (!("ontouchstart" in window)) return !1;
    const r = navigator.userAgent.includes("Android");
    return this.isIOS() || r
  }

  static isIOS() {
    const r = navigator.userAgent.includes("iPhone OS"),
      e = navigator.userAgent.includes("Macintosh") && Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    return r || e
  }

  static isIOSTouchDevice() {
    return "ontouchstart" in window && this.isIOS()
  }
}

BrowserDetector._isChromium = !1, BrowserDetector._isChrome = !1, BrowserDetector._isFirefox = !1, BrowserDetector._isThunderbird = !1, BrowserDetector._isOpera = !1, BrowserDetector._isOldEdge = !1, BrowserDetector._isEdge = !1, BrowserDetector._isSafari = !1, BrowserDetector._isYaBrowser = !1, BrowserDetector._isUnsupportedChrome = !1, BrowserDetector._isUnsupportedFirefox = !1, BrowserDetector._isInitialized = !1, BrowserDetector._contructor();