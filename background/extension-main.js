var __awaiter = this && this.__awaiter || function (e, t, s, a) {
  return new (s || (s = Promise))((function (r, o) {
    function n(e) {
      try {
        g(a.next(e))
      } catch (e) {
        o(e)
      }
    }

    function i(e) {
      try {
        g(a.throw(e))
      } catch (e) {
        o(e)
      }
    }

    function g(e) {
      var t;
      e.done ? r(e.value) : (t = e.value, t instanceof s ? t : new s((function (e) {
        e(t)
      }))).then(n, i)
    }

    g((a = a.apply(e, t || [])).next())
  }))
};

class BackgroundApp {
  static _constructor() {
    if (!this._isInitialized) {
      if (this._onDataLoaded = this._onDataLoaded.bind(this), this._onInstalled = this._onInstalled.bind(this), this._onMessage = this._onMessage.bind(this), this._onContextMenuItemClicked = this._onContextMenuItemClicked.bind(this), this._storageController = StorageController.create(), this._storageController.onReady(this._onDataLoaded), browser.runtime.onInstalled.addListener(this._onInstalled), browser.runtime.onMessage.addListener(this._onMessage), DictionarySync.init(), this._browserAction = browser.browserAction || browser.composeAction, this._contextMenu = browser.contextMenus || browser.menus, this._updateIcon(), window.setInterval((() => this._updateIcon()), config.UI_MODE_RECHECK_INTERVAL), this._checkForPaidSubscription(), window.setInterval((() => this._checkForPaidSubscription()), config.ACCOUNT_STATUS_RECHECK_INTERVAL), this._loadConfiguration(), window.setInterval((() => this._loadConfiguration()), config.EXTERNAL_CONFIG_RELOAD_INTERVAL), this._ping(), window.setInterval((() => this._ping()), config.PING_INTERVAL), this._syncUserData(), window.setInterval((() => this._syncUserData()), config.SYNC_USER_DATA_INTERVAL), BrowserDetector.isFirefox() || BrowserDetector.isThunderbird()) {
        const e = () => {
          browser.runtime.onUpdateAvailable.removeListener(e), this._installUpdate()
        };
        browser.runtime.onUpdateAvailable.addListener(e)
      }
      this._initThunderbird(), this._isInitialized = !0
    }
  }

  static _initThunderbird() {
    BrowserDetector.isThunderbird() && Thunderbird.registerComposeScripts()
  }

  static _installUpdate() {
    browser.tabs.query({}).then((e => {
      e.forEach((e => {
        if (!e.id) return;
        browser.tabs.sendMessage(e.id, {command: "DESTROY"}).catch(console.error.bind(console))
      }))
    })), Tracker.trackEvent("Action", "pre_update"), window.setTimeout((() => {
      browser.runtime.reload()
    }), 2e3)
  }

  static _assignToTestGroups() {
    EnvironmentAdapter.isProductionEnvironment()
  }

  static _isUsedDarkTheme() {
    var e;
    return __awaiter(this, void 0, void 0, (function* () {
      if (BrowserDetector.isFirefox() || BrowserDetector.isThunderbird() && browser.theme) {
        const t = yield browser.theme.getCurrent();
        if (null === (e = null == t ? void 0 : t.colors) || void 0 === e ? void 0 : e.toolbar) {
          return getColorLuminosity(t.colors.toolbar) <= 35
        }
      }
      return !("undefined" == typeof window || !window.matchMedia) && Boolean(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }))
  }

  static _updateIcon() {
    return __awaiter(this, void 0, void 0, (function* () {
      if (BrowserDetector.isSafari()) return;
      this._browserAction.setIcon({
        path: {
          16: "/assets/images/icons/icon16.png",
          32: "/assets/images/icons/icon32.png",
          48: "/assets/images/icons/icon48.png",
          64: "/assets/images/icons/icon64.png",
          128: "/assets/images/icons/icon128.png"
        }
      })
    }))
  }

  static _setContextMenu() {
    if (this._contextMenu) {
      let e = i18nManager.getMessage("contextMenuValidate");
      this._storageController.hasLanguageToolAccount() && (e = i18nManager.getMessage("contextMenuValidateInEditor")), this._contextMenu.removeAll().then((() => {
        this._contextMenu.create({title: e, contexts: ["selection"], onclick: this._onContextMenuItemClicked})
      }))
    }
  }

  static _updateBadge(e, t) {
    this._browserAction.setBadgeTextColor && this._browserAction.setBadgeTextColor({
      tabId: e,
      color: "#FFFFFF"
    }), t.enabled && t.supported ? t.capitalization ? this._browserAction.setBadgeText({
      tabId: e,
      text: ""
    }) : (this._browserAction.setBadgeBackgroundColor && this._browserAction.setBadgeBackgroundColor({
      tabId: e,
      color: "#45A8FC"
    }), this._browserAction.setBadgeText({
      tabId: e,
      text: BrowserDetector.isOpera() ? "" : "abc"
    })) : (this._browserAction.setBadgeBackgroundColor && this._browserAction.setBadgeBackgroundColor({
      tabId: e,
      color: "#F53987"
    }), this._browserAction.setBadgeText({tabId: e, text: BrowserDetector.isOpera() ? "" : "OFF"}))
  }

  static _updateUninstallURL(e = "unknown") {
    const t = this._storageController.getSettings(), s = this._storageController.getPrivacySettings(),
      a = this._storageController.getStatistics(), r = this._storageController.getTestFlags(),
      o = browser.runtime.getManifest(), n = o && o.version || "unknown";
    e = e.replace("www.", "").slice(0, 25);
    let i = `${config.UNINSTALL_URL}?autoCheck=${t.autoCheck}`;
    i += `&host=${encodeURIComponent(e)}&v=${n}&privacyConfirmed=${s.allowRemoteCheck}`, i += `&usages=${a.usageCount}&sessions=${a.sessionCount}`;
    const g = this._storageController.getUniqueId();
    g && (i += `&matomo=${g}`);
    for (const e in r) r.hasOwnProperty(e) && (i += `&${e}=${r[e]}`);
    EnvironmentAdapter.isProductionEnvironment() || (i += "&dev"), i = i.slice(0, 255), browser.runtime.setUninstallURL(i)
  }

  static _setMotherTongue() {
    this._storageController.onReady((() => {
      const {motherTongue: e, geoIpLanguages: t} = this._storageController.getSettings();
      if (e) return;
      const s = t.some((e => !!e.match(/^de/i))) && navigator.languages[0] && navigator.languages[0].match(/^de/i),
        a = Array.from(navigator.languages).some((e => !e.match(/^(de|en)/i)));
      s && !a && (Tracker.trackEvent("Action", "set_mother_tongue", "de"), this._storageController.updateSettings({motherTongue: "de"}));
      const r = t.some((e => !!e.match(/^fr/i))) && navigator.languages[0] && navigator.languages[0].match(/^fr/i),
        o = Array.from(navigator.languages).some((e => !e.match(/^(fr|en)/i)));
      r && !o && (Tracker.trackEvent("Action", "set_mother_tongue", "fr"), this._storageController.updateSettings({motherTongue: "fr"}))
    }))
  }

  static _launchEditor(e, t) {
    let s;
    e && (s = Math.round(99999 * Math.random()) + ":" + Date.now(), this._validatorsData.set(s, {
      id: s,
      text: e,
      html: t,
      timestamp: Date.now()
    }));
    let a = EnvironmentAdapter.getURL(`/validator/validator.html?id=${s}`);
    const {username: r, token: o} = this._storageController.getSettings();
    if (BrowserDetector.isSafari()) {
      const s = this._storageController.getSettings().userId || void 0;
      browser.runtime.sendMessage({
        userId: s,
        message: {username: r, token: o, text: e, html: t},
        command: "LAUNCH_DESKTOP_EDITOR"
      })
    } else r && o && navigator.onLine && (a = getAutoLoginUrl(r, o, s)), browser.tabs.create({url: a}).then((e => {
      e && e.windowId && browser.windows.update(e.windowId, {focused: !0})
    }))
  }

  static _onDataLoaded() {
    Tracker.trackActivity(), this._updateUninstallURL(), this._applyManagedSettings(), this._setContextMenu()
  }

  static _checkForChangelogPage() {
    if (BrowserDetector.isThunderbird() || BrowserDetector.isSafari()) return;
    const e = this._storageController.isRelevantForChangelogCoupon();
    if (!e.status) return void Tracker.trackEvent("Action", "changelog:dont_open_page", String(e.reason));
    const {lastChangelogNov2021Seen: t} = this._storageController.getUIState();
    t ? Tracker.trackEvent("Action", "changelog:dont_open_page", "already_seen") : this._updateGeoIPCountry().finally((() => {
      this._storageController.updateUIState({lastChangelogNov2021Seen: Date.now()}).then((() => {
        BrowserDetector.isSafari() ? setTimeout((() => this._openChangelogPage()), 15e3) : this._openChangelogPage()
      }))
    }))
  }

  static _updateGeoIPCountry() {
    return LanguageManager.getLanguagesForGeoIPCountry().then((e => {
      const t = {geoIpLanguages: e.geoIpLanguages, geoIpCountry: e.geoIpCountry || ""};
      this._storageController.updateSettings(t)
    }))
  }

  static _openChangelogPage() {
    const e = browser.runtime.getURL("/changelog/changelog.html");
    browser.windows.getAll({windowTypes: ["normal"]}).then((t => {
      Tracker.trackEvent("Action", "changelog:open_page", t.length ? "existing-window" : "empty-window");
      const s = (t || []).find((e => e.focused && "normal" === e.type));
      s ? browser.tabs.create({windowId: s.id, active: !1, url: e}) : browser.tabs.create({active: !1, url: e})
    }), (() => {
      Tracker.trackError("other", "changelog:get_window_error")
    }))
  }

  static _applyManagedSettings() {
    const {disablePrivacyConfirmation: e} = this._storageController.getManagedSettings(), {allowRemoteCheck: t} = this._storageController.getPrivacySettings();
    !0 !== e || t || (this._storageController.updatePrivacySettings({allowRemoteCheck: !0}), Tracker.trackEvent("Action", "accept_privacy_note", "managed"))
  }

  static _loadConfiguration() {
    this._storageController.onReady((() => {
      if (this._storageController.hasCustomServer()) return;
      const e = browser.runtime.getManifest(), t = e && e.version || "unknown";
      fetch(config.EXTERNAL_CONFIG_URL + "?v=" + encodeURIComponent(t), {credentials: "omit"}).then((e => e.json())).then((e => {
        if (e.disabledSites && Array.isArray(e.disabledSites)) {
          const t = {unsupportedDomains: e.disabledSites};
          this._storageController.updateConfiguration(t)
        }
      }))
    }))
  }

  static _checkForPaidSubscription() {
    this._storageController.onReady((() => {
      this._storageController.checkForPaidSubscription().catch(console.error)
    }))
  }

  static _ping() {
    this._lastPing && this._lastPing + config.PING_INTERVAL > Date.now() || (this._lastPing = Date.now(), this._storageController.onReady((() => {
      if (this._storageController.hasCustomServer()) return;
      const {username: e} = this._storageController.getSettings();
      if (!e) return;
      const t = new FormData;
      t.append("email", e), t.append("useragent", BrowserDetector.getUserAgentIdentifier()), fetch(config.PING_URL, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        body: t
      }).catch((() => null))
    })))
  }

  static _syncUserData() {
    const e = Date.now();
    this._lastUserDataSync && this._lastUserDataSync + config.SYNC_USER_DATA_INTERVAL > e || (this._lastUserDataSync = e, this._storageController.onReady((e => __awaiter(this, void 0, void 0, (function* () {
      const {username: t, token: s} = e.getSettings();
      if (!e.hasCustomServer() && t && s) try {
        const a = new URLSearchParams({email: t, addon_token: s}),
          r = yield fetch(`${config.USER_DATA_URL}?${a.toString()}`, {
            mode: "cors",
            credentials: "omit"
          }), {data: o = {}} = r.ok ? yield r.json() : {},
          n = Object.assign(Object.assign({}, "number" == typeof o.id ? {userId: o.id} : void 0), "number" == typeof o.dpa_level ? {dpaLevel: o.dpa_level} : void 0);
        e.updateSettings(n)
      } catch (e) {
        Tracker.trackError("other", "user_data_sync_failed")
      }
    })))))
  }

  static _onInstalled(e) {
    const {reason: t, previousVersion: s} = e;
    this._storageController.onReady((() => {
      if (this._applyManagedSettings(), "install" === t) {
        if (!this._storageController.getPrivacySettings().allowRemoteCheck && !this._storageController.getUIState().hasSeenPrivacyConfirmationDialog) {
          this._storageController.updateUIState({hasSeenPrivacyConfirmationDialog: !0});
          let e = `${config.INSTALL_URL}?new`;
          EnvironmentAdapter.isProductionEnvironment() || (e += "&dev"), browser.tabs.create({url: e}).then((e => {
            e && e.windowId && browser.windows.update(e.windowId, {focused: !0})
          })), this._assignToTestGroups(), this._updateUninstallURL(), LanguageManager.getLanguagesForGeoIPCountry().then((e => {
            const t = {geoIpLanguages: e.geoIpLanguages, geoIpCountry: e.geoIpCountry || ""};
            "GB" === e.geoIpCountry || "IE" === e.geoIpCountry ? t.enVariant = "en-GB" : "US" === e.geoIpCountry ? t.enVariant = "en-US" : "CA" === e.geoIpCountry ? t.enVariant = "en-CA" : "NZ" === e.geoIpCountry ? t.enVariant = "en-NZ" : "AU" === e.geoIpCountry ? t.enVariant = "en-AU" : "ZA" === e.geoIpCountry ? t.enVariant = "en-ZA" : "DE" === e.geoIpCountry ? t.deVariant = "de-DE" : "AT" === e.geoIpCountry ? t.deVariant = "de-AT" : "CH" === e.geoIpCountry ? t.deVariant = "de-CH" : "BR" === e.geoIpCountry ? t.ptVariant = "pt-BR" : ["PT", "IT", "DE", "ES", "NL", "BE", "CH", "AT", "FR", "LU", "GB", "IE", "PL", "CZ"].includes(e.geoIpCountry) && (t.ptVariant = "pt-PT");
            const s = "CA" === e.geoIpCountry, a = navigator.languages.some((e => "en-ca" === e.toLowerCase())),
              r = navigator.languages.some((e => "fr-ca" === e.toLowerCase()));
            if (s || a || r) {
              const e = {
                id: "FRENCH_WHITESPACE",
                language: "fr",
                description: "Insertion des espaces fines insécables",
                turnOffDate: new Date
              }, s = this._storageController.getSettings().ignoredRules;
              s.push(e), t.ignoredRules = s
            }
            if ("ZA" === e.geoIpCountry) {
              const e = {
                id: "COMMA_PERIOD_CONFUSION",
                language: "en",
                description: "Decimal separator in numbers",
                turnOffDate: new Date
              }, s = this._storageController.getSettings().ignoredRules;
              s.push(e), t.ignoredRules = s
            }
            this._storageController.updateSettings(t), this._setMotherTongue(), this._setPreferredLanguages()
          })).catch((e => {
            this._setPreferredLanguages(), console.error(e), Tracker.trackError("js", e && e.message)
          })), Tracker.trackInstall(), Thunderbird.setNativeSpellCheck(!1)
        }
      } else if ("update" === t) {
        this._assignToTestGroups(), this._updateUninstallURL(), this._migrate();
        const e = browser.runtime.getManifest(), t = e && e.version || "unknown";
        s !== t && Tracker.trackEvent("Action", "update", String(t))
      }
    }))
  }

  static _migrate() {
    this._setPreferredLanguages(), this._updateAPIUrl()
  }

  static _setPreferredLanguages() {
    this._storageController.updateSettings({preferredLanguages: this._getInitialPreferredLanguages()})
  }

  static _updateAPIUrl() {
    const {apiServerUrl: e} = this._storageController.getSettings();
    e.match(/^https?:\/\/languagetool.org\/api/) && this._storageController.updateSettings({apiServerUrl: config.MAIN_SERVER_URL})
  }

  static _onMessage(e, t, s) {
    let a;
    return isPageLoadedMessage(e) ? a = this._onPageLoadedMessage(t, e) : isLTAssistantStatusChangedMessage(e) ? a = this._onLTAssistantStatusChangedMessage(t, e) : isCheckForPaidSubscriptionMessage(e) ? a = this._onCheckForPaidSubscriptionMessage(t, e) : isTrackTextLengthMessage(e) ? a = this._onTrackTextLengthMessage(t, e) : isTrackEventMessage(e) ? a = this._onTrackEventMessage(t, e) : isOpenFeedbackFormMessage(e) ? a = this._onOpenFeedbackFormMessage(t, e) : isSendFeedbackMessage(e) ? a = this._onSendFeedbackMessage(t, e) : isOpenOptionsMessage(e) ? a = this._onOpenOptionsMessage(t, e) : isOpenPrivacyConfirmationMessage(e) ? a = this._onOpenPrivacyConfirmationMessage(t, e) : isCloseCurrentTabMessage(e) ? a = this._onCloseCurrentTabMessage(t, e) : isCheckTextMessage(e) ? a = this._onCheckTextMessage(t, e) : isLaunchEditorMessage(e) ? a = this._onLaunchEditorMessage(t, e) : isGetValidatorDataMessage(e) ? a = this._onGetValidatorDataMessage(t, e) : isStartDictionarySyncMessage(e) ? a = this._onStartDictionarySyncMessage(t, e) : isAddWordToDictionaryMessage(e) ? a = this._onAddWordToDictionaryMessage(t, e) : isBatchAddWordToDictionaryMessage(e) ? a = this._onBatchAddWordToDictionaryMessage(t, e) : isRemoveWordFromDictionaryMessage(e) ? a = this._onRemoveWordFromDictionaryMessage(t, e) : isClearDictionaryMessage(e) ? a = this._onClearDictionaryMessage(t, e) : isGetPreferredLanguagesMessage(e) ? a = this._onGetPreferredLanguagesMessage(t, e) : isLoadSynonymsMessage(e) ? a = this._onLoadSynonymsMessage(t, e) : isLoadPhrasesMessage(e) ? a = this._onLoadPhrasesMessage(t, e) : isReportRephraseMessage(e) ? a = this._onReportRephraseMessage(t, e) : isUpdateDictionaryMessage(e) ? a = this._onUpdateDictionaryMessage(t, e) : isOpenURLMessage(e) ? a = this._onOpenURLMessage(t, e) : isOpenPremiumPageMessage(e) ? a = this._openPremiumPage(t, e) : isLoginUserMessage(e) ? a = this._loginUserMessage(t, e) : isLogoutUserMessage(e) ? a = this._logoutUserMessage(t, e) : isOnLoginUserMessage(e) ? a = this._onLoginUserMessage(t, e) : isOnLogoutUserMessage(e) && (a = this._onLogoutUserMessage(t, e)), a || Promise.resolve(null)
  }

  static _onPageLoadedMessage(e, t) {
    if (0 !== e.frameId || !e.tab) return;
    const s = e.tab.id, a = {
      enabled: t.enabled,
      capitalization: t.capitalization,
      supported: t.supported,
      unsupportedMessage: t.unsupportedMessage,
      language: null,
      beta: t.beta
    };
    this._extensionStates.set(s, a), browser.tabs.detectLanguage && browser.tabs.detectLanguage(s).then((e => {
      e && "und" !== e && (a.language = LanguageManager.getPrimaryLanguageCode(e))
    })).catch((e => {
      console.error("Error detecting language", e)
    }));
    const r = e.tab.url || "about:blank";
    this._updateUninstallURL(getDomain(r)), this._updateBadge(s, a)
  }

  static _onLTAssistantStatusChangedMessage(e, t) {
    const s = t.tabId || e.tab.id;
    if (!this._extensionStates.has(s)) return;
    const a = this._extensionStates.get(s);
    "boolean" == typeof t.enabled && (a.enabled = t.enabled), "boolean" == typeof t.capitalization && (a.capitalization = t.capitalization), this._updateBadge(s, a)
  }

  static _onCheckForPaidSubscriptionMessage(e, t) {
    const s = this._storageController.hasCustomServer() ? this._storageController.getCustomServerUrl() : void 0;
    return Checker.checkForPaidSubscription(t.username, t.password, t.token, s).then((e => ({
      initialCommand: "CHECK_FOR_PAID_SUBSCRIPTION",
      isSuccessful: !0,
      hasPaidSubscription: e
    }))).catch((e => ({
      initialCommand: "CHECK_FOR_PAID_SUBSCRIPTION",
      isSuccessful: !1,
      error: {reason: e.reason, status: e.status, response: e.response, url: e.url, stack: e.stack}
    })))
  }

  static _onTrackTextLengthMessage(e, t) {
    Tracker.trackTextLength(t.textLength)
  }

  static _onTrackEventMessage(e, t) {
    Tracker.trackEvent("Action", t.action, t.label)
  }

  static _onOpenFeedbackFormMessage(e, t) {
    this._lastScreenshot = null;
    var s;
    ("function" != typeof browser.tabs.captureVisibleTab ? Promise.reject() : "number" == typeof (null === (s = e.tab) || void 0 === s ? void 0 : s.windowId) ? browser.tabs.captureVisibleTab(e.tab.windowId) : browser.tabs.captureVisibleTab()).then((e => {
      this._lastScreenshot = dataURItoBlob(e)
    })).catch((() => null)).then((() => {
      let e = `/feedbackForm/feedbackForm.html?url=${encodeURIComponent(t.url.substr(0, 200))}`;
      return t.html && (e += `&html=${encodeURIComponent(t.html.substr(0, 600))}`), t.title && (e += `&title=${encodeURIComponent(t.title)}`), this._lastScreenshot && (e += "&screenshot=" + (this._lastScreenshot ? 1 : 0)), browser.windows.create({
        url: EnvironmentAdapter.getURL(e),
        type: "popup",
        width: 380,
        height: 520
      })
    })).then((e => {
      e && e.id && browser.windows.update(e.id, {
        left: Math.round((BrowserDetector.isChromium() && e.left || 0) + (screen.availWidth - 380) / 2),
        top: Math.round((BrowserDetector.isChromium() && e.top || 0) + (screen.availHeight - 520) / 2)
      })
    }))
  }

  static _onSendFeedbackMessage(e, t) {
    const s = new FormData;
    s.append("sender", t.sender), s.append("text", t.text), this._lastScreenshot && t.includeScreenshot && (s.append("screenshot", this._lastScreenshot, `screenshot_${Date.now()}.jpg`), this._lastScreenshot = null), fetch(config.FEEDBACK_SERVER_URL, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      body: s
    }).catch((() => {
      Tracker.trackError("http", "error_send_feedback")
    }))
  }

  static _onOpenOptionsMessage(e, t) {
    let s = "/options/options.html";
    t.target && (s += `#${t.target}`), t.ref && (s += `?ref=${encodeURIComponent(t.ref)}`), browser.tabs.create({url: EnvironmentAdapter.getURL(s)}).then((e => {
      e && e.windowId && browser.windows.update(e.windowId, {focused: !0}).catch(console.error)
    }))
  }

  static _onOpenPrivacyConfirmationMessage(e, t) {
    browser.tabs.create({url: config.INSTALL_URL}).then((e => {
      e && e.windowId && browser.windows.update(e.windowId, {focused: !0}).catch(console.error)
    }))
  }

  static _onCloseCurrentTabMessage(e, t) {
    browser.tabs.query({currentWindow: !0, active: !0}).then((e => {
      e.length && browser.tabs.remove(e[0].id)
    }))
  }

  static _getInitialPreferredLanguages() {
    const {geoIpLanguages: e, motherTongue: t, preferredLanguages: s} = this._storageController.getSettings();
    if (Array.isArray(s) && s.length) return s;
    const a = LanguageManager.getPrimaryLanguageCode(LanguageManager.getUserLanguageCode()),
      r = navigator.languages.map((e => LanguageManager.getPrimaryLanguageCode(e)));
    return uniq([t, a].concat(e, r, ["en"]).filter(Boolean)).map((e => "nb" === e ? "no" : "fil" === e ? "tl" : e))
  }

  static _getPreferredLanguages(e) {
    const {preferredLanguages: t, motherTongue: s} = this._storageController.getSettings();
    if (e.tab) {
      const s = this._extensionStates.get(e.tab.id);
      s && s.language && t.push(s.language)
    }
    return s && t.push(s), t.push("en"), uniq(t)
  }

  static _onCheckTextMessage(e, t) {
    if (Tracker.trackActivity(), 0 === this._checkThrottlingCount && window.setTimeout((() => {
      this._checkThrottlingCount = 0
    }), 5e3), this._checkThrottlingCount++, this._checkThrottlingCount > t.options.throttlingLimit) {
      const e = {
        initialCommand: "CHECK_TEXT",
        isSuccessful: !1,
        instanceId: t.metaData.instanceId,
        error: {status: 0, reason: "TooManyRequests"}
      };
      return Promise.resolve(e)
    }
    let s = this._getPreferredLanguages(e);
    if (t.metaData.elementLanguage) {
      const e = LanguageManager.getPrimaryLanguageCode(t.metaData.elementLanguage.toLowerCase());
      LanguageManager.LANGUAGES.some((t => LanguageManager.getPrimaryLanguageCode(t.code) === e)) ? s = [e] : s.push(e)
    }
    const a = this._storageController.getStatistics().usageCount + 1;
    this._storageController.updateStatistics({usageCount: a});
    const r = getDomain(t.metaData.pageUrl);
    this._updateUninstallURL(r);
    const o = [], {
        username: n,
        password: i,
        token: g,
        motherTongue: c,
        enVariant: d,
        deVariant: l,
        ptVariant: u,
        caVariant: h,
        dictionary: _
      } = this._storageController.getSettings(), {
        hasPaidSubscription: p,
        showRuleId: m
      } = this._storageController.getUIState(), C = this._storageController.getCheckSettings(r, "unknown"),
      w = this._storageController.hasCustomServer() ? this._storageController.getCustomServerUrl() : void 0;
    let b = null;
    n && g ? b = {email: n, token: g} : n && i && (b = {email: n, password: i});
    const L = {
      instanceId: t.metaData.instanceId,
      user: b,
      isPremium: p,
      customApiServerUrl: w,
      languageVariants: {en: d, de: l, pt: u, ca: h},
      dictionary: _,
      preferredLanguages: s,
      motherTongue: c,
      checkLevel: t.metaData.checkLevel,
      recipientInfo: t.metaData.recipientInfo,
      ignoreCapitalizationErrors: !C.shouldCapitalizationBeChecked,
      ignoreCapitalizationErrorsAtLineStart: t.metaData.ignoreCapitalizationErrorsAtLineStart,
      useParagraphLevelCaching: t.metaData.useParagraphLevelCaching,
      debug: m,
      userAgent: BrowserDetector.getUserAgentIdentifier(),
      version: EnvironmentAdapter.getVersion()
    };
    let result = WikiManager.matchWikiContent(t.text)

    return Promise.resolve({
      initialCommand: "CHECK_TEXT",
      isSuccessful: !0,
      instanceId: t.metaData.instanceId,
      text: t.text,
      changedParagraphs: t.changedParagraphs,
      language: {
        "code": "en-US",
        "name": "English (US)",
        "detectedLanguage": {
          "name": "English (US)",
          "code": "en-US",
          "confidence": 0.99,
          "source": "ngram+commonwords+prefLang"
        }
      },
      isUnsupportedLanguage: false,
      isIncompleteResult: false,
      textLevelErrors: [],
      textLevelPremiumErrors: [],
      textLevelPremiumPickyErrors: [],
      textLevelPickyErrors: [],
      paragraphLevelErrors: FlappyAdapter.getResultListAdapter(result),
      paragraphLevelPremiumErrors: [],
      paragraphLevelPremiumPickyErrors: [],
      paragraphLevelPickyErrors: [],
      paragraphLevelSentenceRanges: []
    })
    return t.options.checkTextLevel ? o.push(Checker.checkTextLevel(t.text, t.forceLanguage ? t.language : null, L, t.hasUserChangedLanguage)) : o.push(Checker.detectLanguage(t.text, t.forceLanguage ? t.language : null, L)), o.push(Checker.checkParagraphLevel(t.changedParagraphs, t.language, L, !t.forceLanguage)), Promise.all(o).then((([e, s]) => {
      let a = e.language || t.language;
      const r = !(!a || a.name !== this.UNSUPPORTED_LANGUAGE_NAME);
      r && (a = null);
      return {
        initialCommand: "CHECK_TEXT",
        isSuccessful: !0,
        instanceId: t.metaData.instanceId,
        text: t.text,
        changedParagraphs: t.changedParagraphs,
        language: a,
        isUnsupportedLanguage: r,
        isIncompleteResult: s.isIncompleteResult,
        textLevelErrors: e.errors,
        textLevelPremiumErrors: e.premiumErrors,
        textLevelPremiumPickyErrors: e.premiumPickyErrors,
        textLevelPickyErrors: e.pickyErrors,
        paragraphLevelErrors: s.errors,
        paragraphLevelPremiumErrors: s.premiumErrors,
        paragraphLevelPremiumPickyErrors: s.premiumPickyErrors,
        paragraphLevelPickyErrors: s.pickyErrors,
        paragraphLevelSentenceRanges: s.sentenceRanges
      }
    })).catch((e => {
      if (e && "AbortError" === e.reason) return;
      t.options.textTooLongMessage && "TextTooLong" === e.reason && (e.message = t.options.textTooLongMessage);
      return {
        initialCommand: "CHECK_TEXT",
        isSuccessful: !1,
        instanceId: t.metaData.instanceId,
        error: {reason: e.reason, status: e.status, response: e.response, url: e.url, stack: e.stack}
      }
    }))
  }

  static _onLaunchEditorMessage(e, t) {
    this._launchEditor(t.text)
  }

  static _onGetValidatorDataMessage(e, t) {
    const s = this._validatorsData.get(t.id);
    this._validatorsData.delete(t.id);
    const a = {
      initialCommand: "GET_VALIDATOR_DATA",
      isSuccessful: !0,
      text: s ? s.text : "",
      html: s ? s.html : void 0
    };
    return Promise.resolve(a)
  }

  static _onStartDictionarySyncMessage(e, t) {
    DictionarySync.checkForInitialSync()
  }

  static _onAddWordToDictionaryMessage(e, t) {
    DictionarySync.addWord(t.word).catch((() => null))
  }

  static _onBatchAddWordToDictionaryMessage(e, t) {
    DictionarySync.addBatch(t.words).catch((() => null))
  }

  static _onRemoveWordFromDictionaryMessage(e, t) {
    DictionarySync.removeWord(t.word).catch((() => null))
  }

  static _onClearDictionaryMessage(e, t) {
    DictionarySync.removeBatch(this._storageController.getSettings().dictionary).catch((() => null))
  }

  static _onUpdateDictionaryMessage(e, t) {
    DictionarySync.downloadAll()
  }

  static _onOpenURLMessage(e, t) {
    Tracker.trackEvent("Action", "open_tab", t.url), browser.tabs.create({url: t.url}).then((e => {
      e && e.windowId && browser.windows.update(e.windowId, {focused: !0})
    }))
  }

  static _onGetPreferredLanguagesMessage(e, t) {
    const s = this._getPreferredLanguages(e), a = this._storageController.getSettings(),
      r = s.map((e => a[`${e}Variant`] || e));
    return Promise.resolve(r)
  }

  static _onLoadSynonymsMessage(e, t) {
    return Synonyms.load(t.wordContext, t.language, t.motherLanguage)
  }

  static _onLoadPhrasesMessage(e, {uuid: t, phrase: s, language: a, inhouseOnly: r}) {
    return Phrases.load(t, s, a, r)
  }

  static _onReportRephraseMessage(e, {uuid: t, report: s}) {
    return Phrases.report(t, s)
  }

  static _onContextMenuItemClicked(e, t) {
    if (t && t.id && !BrowserDetector.isThunderbird()) {
      const s = {command: "GET_SELECTED_TEXT"};
      browser.tabs.sendMessage(t.id, s).then((e => {
        this._launchEditor(e.selectedText, e.selectedHTML)
      })).catch((t => {
        console.warn("Could not get selected text", t), this._launchEditor(e.selectionText)
      }))
    } else this._launchEditor(e.selectionText);
    this._storageController.updateUIState({hasUsedValidator: !0})
  }

  static _openPremiumPage(e, t) {
    if (BrowserDetector.isSafari() && !t.campaign.startsWith("addon2-changelog")) {
      const e = this._storageController.getSettings().userId || void 0, s = "safari";
      return Tracker.trackEvent("Action", "go_to_apple_upgrade", t.campaign), void browser.runtime.sendMessage({
        message: Object.assign(Object.assign({}, t), {
          userId: e,
          target: s
        }), command: "LAUNCH_APPLE_UPGRADE"
      })
    }
    let s = getPremiumUrl(t.campaign, t.hiddenGrammarMatches, t.hiddenStyleMatches, t.hiddenPunctuationMatches, t.historicMatches, t.textLanguage);
    BrowserDetector.isThunderbird() && browser.windows.openDefaultBrowser ? browser.windows.openDefaultBrowser(s) : browser.tabs.create({url: s}).then((e => {
      e && e.windowId && browser.windows.update(e.windowId, {focused: !0})
    }))
  }

  static _loginUserMessage(e, t) {
    browser.runtime.sendMessage({command: "LOGIN"})
  }

  static _logoutUserMessage(e, t) {
    browser.runtime.sendMessage({command: "LOGOUT"})
  }

  static _onLoginUserMessage(e, t) {
    this._storageController.updateSettings({
      username: t.username,
      password: "",
      userId: t.userId,
      token: t.token,
      knownEmail: t.username,
      apiServerUrl: config.MAIN_SERVER_URL
    }).then((() => {
      this._storageController.checkForPaidSubscription()
    })), EnvironmentAdapter.isProductionEnvironment() || EnvironmentAdapter.startDictionarySync()
  }

  static _onLogoutUserMessage(e, t) {
    this._storageController.updateSettings({
      username: "",
      password: "",
      userId: null,
      token: "",
      isDictionarySynced: !1
    }).then((() => {
      this._storageController.checkForPaidSubscription()
    }))
  }
}

BackgroundApp.UNSUPPORTED_LANGUAGE_NAME = "NoopLanguage", BackgroundApp._darkMode = !1, BackgroundApp._lastPing = null, BackgroundApp._lastUserDataSync = null, BackgroundApp._extensionStates = new Map, BackgroundApp._validatorsData = new Map, BackgroundApp._checkThrottlingCount = 0, BackgroundApp._isInitialized = !1, BackgroundApp._lastScreenshot = null, BackgroundApp._constructor();