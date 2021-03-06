/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class ExtensionEnvironmentAdapter extends EnvironmentAdapterClass {
  constructor() {
    super(...arguments), this._isProductionEnvironmentCached = null
  }

  isProductionEnvironment() {
    if (null === this._isProductionEnvironmentCached) {
      if (BrowserDetector.isSafari()) return !0;
      BrowserDetector.isFirefox() || BrowserDetector.isThunderbird() ? this._isProductionEnvironmentCached = !browser.runtime.id.match("languagetool.dev") : this._isProductionEnvironmentCached = "update_url" in browser.runtime.getManifest()
    }
    return this._isProductionEnvironmentCached
  }

  isRuntimeConnected() {
    try {
      return browser.runtime.getManifest(), !0
    } catch (e) {
      return !1
    }
  }

  getVersion() {
    if (this.isRuntimeConnected()) {
      const e = browser.runtime.getManifest();
      return e && e.version ? e.version : "unknown"
    }
    return "unknown"
  }

  getTrackingId() {
    return BrowserDetector.isSafari() ? "13" : BrowserDetector.isThunderbird() ? "22" : "12"
  }

  shouldTrack() {
    return "1" !== navigator.doNotTrack
  }

  getType() {
    return "extension"
  }

  getURL(e) {
    return browser.runtime.getURL(e)
  }

  getUILanguageCode() {
    return browser.i18n.getUILanguage()
  }

  openWindow(e) {
    browser.runtime.sendMessage({command: "OPEN_URL", url: e})
  }

  loadContentScripts(e, r) {
    return this.isRuntimeConnected() ? (browser.runtime.getManifest().content_scripts.forEach((n => {
      if ("js" === r && n.js) {
        const r = n.js.map((e => {
          const r = this.getURL(e);
          return fetch(r).then((e => e.text()))
        }));
        return Promise.all(r).then((r => {
          const n = r.join("\n");
          e.eval(n)
        }))
      }
      if ("css" === r && n.css) {
        const r = n.css.map((e => {
          const r = this.getURL(e);
          return fetch(r).then((e => e.text()))
        }));
        return Promise.all(r).then((r => {
          r.forEach((r => {
            const n = e.document.createElement("style");
            n.textContent = r, (e.document.head || e.document.documentElement).appendChild(n)
          }))
        }))
      }
    })), Promise.resolve()) : Promise.reject()
  }

  initializeLTAssistant(e, r = {}) {
    return Promise.resolve()
  }

  getPreferredLanguages() {
    return browser.runtime.sendMessage({command: "GET_PREFERRED_LANGUAGES"})
  }

  startDictionarySync() {
    return browser.runtime.sendMessage({command: "START_DICTIONARY_SYNC"})
  }

  updateDictionary() {
    return browser.runtime.sendMessage({command: "UPDATE_DICTIONARY"})
  }

  addWordToDictionary(e) {
    const r = {command: "ADD_WORD_TO_DICTIONARY", word: e};
    return browser.runtime.sendMessage(r)
  }

  addWordsToDictionary(e) {
    const r = {command: "BATCH_ADD_WORDS_TO_DICTIONARY", words: e};
    return browser.runtime.sendMessage(r)
  }

  removeWordFromDictionary(e) {
    const r = {command: "REMOVE_WORD_FROM_DICTIONARY", word: e};
    return browser.runtime.sendMessage(r)
  }

  clearDictionary() {
    return browser.runtime.sendMessage({command: "CLEAR_DICTIONARY"})
  }

  loadSynonyms(e, r, n) {
    const t = {command: "LOAD_SYNONYMS", wordContext: e, language: r, motherLanguage: n};
    return browser.runtime.sendMessage(t)
  }

  loadPhrases(e, r, n, t) {
    const s = {command: "LOAD_PHRASES", uuid: e, phrase: r, language: n, inhouseOnly: t};
    return browser.runtime.sendMessage(s)
  }

  reportPhrase(e, r) {
    const n = {command: "REPORT_PHRASE", uuid: e, report: r};
    return browser.runtime.sendMessage(n)
  }

  trackEvent(e, r) {
    const n = {command: "TRACK_EVENT", action: e, label: r};
    return browser.runtime.sendMessage(n)
  }

  trackTextLength(e) {
    const r = {command: "TRACK_TEXT_LENGTH", textLength: e};
    return browser.runtime.sendMessage(r)
  }

  pageLoaded(e, r, n, t, s) {
    const o = {command: "PAGE_LOADED", enabled: e, capitalization: r, supported: n, beta: t, unsupportedMessage: s};
    return browser.runtime.sendMessage(o)
  }

  ltAssistantStatusChanged(e, r) {
    const n = "object" == typeof e ? e : r, t = {
      command: "LTASSISTANT_STATUS_CHANGED",
      tabId: "number" == typeof e ? e : void 0,
      enabled: n.enabled,
      capitalization: n.capitalization
    };
    return browser.runtime.sendMessage(t)
  }

  check(e, r, n, t, s, o) {
    const a = {
      command: "CHECK_TEXT",
      text: r,
      changedParagraphs: n,
      language: e.language,
      forceLanguage: e.forceLanguage,
      hasUserChangedLanguage: o,
      metaData: t,
      options: s
    };
    return browser.runtime.sendMessage(a)
  }

  isOptionsPageSupported() {
    return !0
  }

  openOptionsPage(e, r) {
    const n = {command: "OPEN_OPTIONS", target: e, ref: r};
    return browser.runtime.sendMessage(n)
  }

  isFeedbackFormSupported() {
    return !0
  }

  openFeedbackForm(e, r = "", n = "") {
    const t = {command: "OPEN_FEEDBACK_FORM", url: e, title: r, html: n};
    return browser.runtime.sendMessage(t)
  }

  openPremiumPage(e, r = 0, n = 0, t = 0, s = "", o) {
    const a = {
      command: "OPEN_PREMIUM_PAGE",
      campaign: e,
      hiddenGrammarMatches: r,
      hiddenStyleMatches: n,
      hiddenPunctuationMatches: t,
      historicMatches: s,
      textLanguage: o || void 0
    };
    return browser.runtime.sendMessage(a)
  }
}