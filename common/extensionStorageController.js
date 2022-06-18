/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class ExtensionStorageController extends StorageControllerClass {
  constructor() {
    super(), this._onStoredDataChanged = (t, e) => {
      let s = !1, n = !1, i = !1, r = !1, o = !1;
      for (const a in t) "managed" !== e ? (/^dictionary(_\d+)?$/.test(a) && (s = !0), this._settings && StorageControllerClass.DEFAULT_SETTINGS.hasOwnProperty(a) && "dictionary" !== a && (this._settings[a] = t[a].newValue, n = !0), this._configuration && StorageControllerClass.DEFAULT_CONFIGURATION.hasOwnProperty(a) && (this._configuration[a] = t[a].newValue, i = !0), this._privacySettings && StorageControllerClass.DEFAULT_PRIVACY_SETTINGS.hasOwnProperty(a) && (this._privacySettings[a] = t[a].newValue, r = !0), this._statistics && StorageControllerClass.DEFAULT_STATISTICS.hasOwnProperty(a) && (this._statistics[a] = t[a].newValue), this._uiState && StorageControllerClass.DEFAULT_UI_STATE.hasOwnProperty(a) && (this._uiState[a] = t[a].newValue, o = !0), this._testFlags && StorageControllerClass.DEFAULT_TEST_FLAGS.hasOwnProperty(a) && (this._testFlags[a] = t[a].newValue), "uniqueId" === a && (this._uniqueId = t[a].newValue)) : this._managedSettings && StorageControllerClass.DEFAULT_MANAGED_SETTINGS.hasOwnProperty(a) && (this._managedSettings[a] = t[a].newValue);
      if (n) {
        for (const t of this._settings.ignoredRules) t.turnOffDate && (t.turnOffDate = new Date(t.turnOffDate));
        this._eventBus.fire(StorageControllerClass.eventNames.settingsChanged, t)
      }
      s && this._storage.get().then((t => {
        if (!this._settings) return;
        const e = this._joinChunks(t, "dictionary"),
          s = {dictionary: {oldValue: this._settings.dictionary, newValue: e}};
        this._settings.dictionary = e, this._eventBus.fire(StorageControllerClass.eventNames.settingsChanged, s)
      })), i && this._eventBus.fire(StorageControllerClass.eventNames.configurationChanged, t), r && this._eventBus.fire(StorageControllerClass.eventNames.privacySettingsChanged, t), o && this._eventBus.fire(StorageControllerClass.eventNames.uiStateChanged, t)
    }, this._storage = ExtensionStorageController._getStorage(), this._managedStorage = ExtensionStorageController._getManagedStorage(), this._isInitialized = !1, this._loadData(), browser.storage.onChanged.addListener(this._onStoredDataChanged)
  }

  static _getStringSize(t) {
    let e = 0;
    for (let s = 0; s < t.length; s++) {
      const n = t.charCodeAt(s);
      e += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : n < 1 << 21 ? 4 : n < 1 << 26 ? 5 : n < 1 << 31 ? 6 : Number.NaN
    }
    return e
  }

  static _getStorage() {
    return browser.storage.sync && !BrowserDetector.isFirefox() ? browser.storage.sync : browser.storage.local
  }

  static _getManagedStorage() {
    return browser.storage.managed
  }

  _splitInChunks(t, e, s = this._storage.QUOTA_BYTES_PER_ITEM) {
    let n = t[e], i = 0, r = [],
      o = ExtensionStorageController._getStringSize(e) + ExtensionStorageController._getStringSize("[]");
    for (; n.length;) {
      const a = n.shift(), l = ExtensionStorageController._getStringSize(`,"${a}"`);
      if (o + l > s) {
        t[0 === i ? e : `${e}_${i}`] = r, i++, r = [a], o = ExtensionStorageController._getStringSize(`${e}_${s}`) + ExtensionStorageController._getStringSize(`["${a}"]`)
      } else r.push(a), o += l;
      if (0 === n.length) {
        t[0 === i ? e : `${e}_${i}`] = r
      }
    }
    t[`${e}_${i + 1}`] = []
  }

  _joinChunks(t, e, s = this._storage.MAX_ITEMS) {
    let n = t[e] || [];
    for (let i = 1; i < s; i++) {
      const s = t[`${e}_${i}`];
      if (void 0 === s || 0 === s.length) break;
      n = n.concat(s)
    }
    return n
  }

  _loadData() {
    const t = this._storage.get().then((t => {
      const e = StorageControllerClass._combineObjects(StorageControllerClass.DEFAULT_SETTINGS, t);
      e.dictionary = this._joinChunks(t, "dictionary");
      for (const t of e.ignoredRules) {
        if (void 0 === t.description) {
          const e = StorageControllerClass.DEFAULT_SETTINGS.ignoredRules.find((e => e.id === t.id && e.language === t.language));
          t.description = e ? e.description : ""
        }
        if (void 0 === t.turnOffDate) {
          const e = StorageControllerClass.DEFAULT_SETTINGS.ignoredRules.some((e => e.id === t.id && e.language === t.language));
          t.turnOffDate = e ? null : new Date(2019, 9, 1)
        } else null !== t.turnOffDate && (t.turnOffDate = new Date(t.turnOffDate))
      }
      e.disabledDomains = e.disabledDomains.map((t => getDomain(t, ""))).filter((t => t)), e.ignoreCheckOnDomains = e.ignoreCheckOnDomains.map((t => getDomain(t, ""))).filter((t => t)), e.autoCheckOnDomains = e.autoCheckOnDomains.map((t => getDomain(t, ""))).filter((t => t)), this._settings = e, this._configuration = StorageControllerClass._combineObjects(StorageControllerClass.DEFAULT_CONFIGURATION, t), this._privacySettings = StorageControllerClass._combineObjects(StorageControllerClass.DEFAULT_PRIVACY_SETTINGS, t), this._statistics = StorageControllerClass._combineObjects(StorageControllerClass.DEFAULT_STATISTICS, t), this._uiState = StorageControllerClass._combineObjects(StorageControllerClass.DEFAULT_UI_STATE, t), this._testFlags = StorageControllerClass._combineObjects(StorageControllerClass.DEFAULT_TEST_FLAGS, t), t.uniqueId ? this._uniqueId = t.uniqueId : (this._uniqueId = StorageControllerClass._generateUniqueId(), this._storage.set({uniqueId: this._uniqueId})), this._statistics.firstVisit || this.updateStatistics({firstVisit: Math.round(Date.now() / 1e3)})
    })), e = this._managedStorage.get().then((t => {
      this._managedSettings = StorageControllerClass._combineObjects(StorageControllerClass.DEFAULT_MANAGED_SETTINGS, t)
    })).catch((() => {
      this._managedSettings = StorageControllerClass._combineObjects(StorageControllerClass.DEFAULT_MANAGED_SETTINGS, {})
    }));
    Promise.all([t, e]).then((() => {
      this._isInitialized = !0, this._onReadyCallbacks.forEach((t => t(this))), this._onReadyCallbacks = []
    }))
  }

  isReady() {
    return this._isInitialized
  }

  onReady(t) {
    this._isInitialized ? t(this) : this._onReadyCallbacks.push(t)
  }

  getUniqueId() {
    return this._uniqueId
  }

  getSettings() {
    return deepClone(this._settings)
  }

  updateSettings(t) {
    for (const e in t) if (!StorageControllerClass.DEFAULT_SETTINGS.hasOwnProperty(e)) throw new Error(`Unknown setting ${e}`);
    if (Object.assign(this._settings || {}, deepClone(t)), void 0 === t.dictionary || BrowserDetector.isFirefox() || this._splitInChunks(t, "dictionary"), void 0 !== t.ignoredRules) for (const e of t.ignoredRules) null !== e.turnOffDate && (e.turnOffDate = e.turnOffDate.toISOString());
    return this._storage.set(t)
  }

  getCheckSettings(t, e) {
    if (!this._settings) return {
      isDomainDisabled: !1,
      isEditorGroupDisabled: !1,
      isAutoCheckEnabled: !0,
      shouldCapitalizationBeChecked: !0
    };
    if (t === browser.runtime.id) return {
      isDomainDisabled: !1,
      isEditorGroupDisabled: !1,
      isAutoCheckEnabled: !0,
      shouldCapitalizationBeChecked: !0
    };
    const s = (this._settings.disabledEditorGroups || []).some((s => StorageControllerClass._normalizeDomain(s.domain) === StorageControllerClass._normalizeDomain(t) && s.editorGroupId === e)),
      n = StorageControllerClass._isListContainsDomain(this._settings.disabledDomains, t),
      i = !StorageControllerClass._isListContainsDomain(this._settings.disabledDomainsCapitalization, t);
    if (this._settings.autoCheck) {
      return {
        isDomainDisabled: n,
        isEditorGroupDisabled: s,
        isAutoCheckEnabled: !StorageControllerClass._isListContainsDomain(this._settings.ignoreCheckOnDomains, t),
        shouldCapitalizationBeChecked: i
      }
    }
    return {
      isDomainDisabled: n,
      isEditorGroupDisabled: s,
      isAutoCheckEnabled: StorageControllerClass._isListContainsDomain(this._settings.autoCheckOnDomains, t),
      shouldCapitalizationBeChecked: i
    }
  }

  hasLanguageToolAccount() {
    return Boolean(this._settings && this._settings.username && !this.hasCustomServer())
  }

  hasCustomServer() {
    return this._managedSettings && this._managedSettings.apiServerUrl ? this._managedSettings.apiServerUrl !== StorageControllerClass.DEFAULT_SETTINGS.apiServerUrl : Boolean(this._settings && this._settings.apiServerUrl && this._settings.apiServerUrl.trim() && this._settings.apiServerUrl !== config.MAIN_SERVER_URL && this._settings.apiServerUrl !== config.PREMIUM_SERVER_URL)
  }

  getCustomServerUrl() {
    return this.hasCustomServer() ? this._managedSettings.apiServerUrl || this._settings.apiServerUrl : null
  }

  getManagedSettings() {
    return clone(this._managedSettings)
  }

  getConfiguration() {
    return clone(this._configuration)
  }

  updateConfiguration(t) {
    for (const e in t) if (!StorageControllerClass.DEFAULT_CONFIGURATION.hasOwnProperty(e)) throw new Error(`Unknown configuration ${e}`);
    return Object.assign(this._configuration || {}, clone(t)), this._storage.set(t)
  }

  isDomainSupported(t) {
    return !this._configuration || !this._configuration.unsupportedDomains.includes("*") && !StorageControllerClass._isListContainsDomain(this._configuration.unsupportedDomains, t)
  }

  getPrivacySettings() {
    return clone(this._privacySettings)
  }

  updatePrivacySettings(t) {
    for (const e in t) if (!StorageControllerClass.DEFAULT_PRIVACY_SETTINGS.hasOwnProperty(e)) throw new Error(`Unknown privacy setting ${e}`);
    return Object.assign(this._privacySettings || {}, t), this._storage.set(t)
  }

  getStatistics() {
    return deepClone(this._statistics)
  }

  updateStatistics(t) {
    for (const e in t) if (!StorageControllerClass.DEFAULT_STATISTICS.hasOwnProperty(e)) throw new Error(`Unknown privacy setting ${e}`);
    return Object.assign(this._statistics || {}, t), this._storage.set(t)
  }

  getUIState() {
    return deepClone(this._uiState)
  }

  updateUIState(t) {
    for (const e in t) if (!StorageControllerClass.DEFAULT_UI_STATE.hasOwnProperty(e)) throw new Error(`Unknown UI state ${e}`);
    return Object.assign(this._uiState || {}, t), this._storage.set(t)
  }

  checkForPaidSubscription() {
    return new Promise(((t, e) => {
      this.onReady((() => {
        const {username: s, password: n, token: i} = this.getSettings();
        let r = null;
        if ("function" == typeof Checker) {
          const t = this.hasCustomServer() ? this.getCustomServerUrl() : void 0;
          r = Checker.checkForPaidSubscription(s, n, i, t)
        } else {
          const t = {command: "CHECK_FOR_PAID_SUBSCRIPTION", username: s, password: n, token: i};
          r = browser.runtime.sendMessage(t).then((t => {
            if (isCheckForPaidSubscriptionResult(t)) return t.hasPaidSubscription;
            if (isCheckForPaidSubscriptionError(t)) throw t.error;
            return !1
          }))
        }
        r.then((e => {
          e ? this.enablePaidSubscription() : this.disablePaidSubscription(), t(e)
        })).catch(e)
      }))
    }))
  }

  enablePaidSubscription() {
    return !this._uiState || this._uiState.hasPaidSubscription ? Promise.resolve() : this.updateUIState({hasPaidSubscription: !0})
  }

  disablePaidSubscription() {
    return this._uiState && this._uiState.hasPaidSubscription ? this.updateUIState({hasPaidSubscription: !1}) : Promise.resolve()
  }

  getTestFlags() {
    return clone(this._testFlags)
  }

  updateTestFlags(t) {
    for (const e in t) if (!StorageControllerClass.DEFAULT_TEST_FLAGS.hasOwnProperty(e)) throw new Error(`Unknown test flag ${e}`);
    return Object.assign(this._testFlags || {}, t), this._storage.set(t)
  }

  getActiveCoupon() {
    const {changelogNov2021CountdownEnd: t, changelogNov2021Coupon: e, hasPaidSubscription: s} = this.getUIState();
    if (s) return null;
    if (t && e && Date.now() < t) {
      const s = 20, {geoIpCountry: n} = this.getSettings(), i = this._getDefaultCoupon(n);
      return i && i.percent > s ? Object.assign(Object.assign({}, i), {expires: t}) : {code: e, expires: t, percent: s}
    }
    return null
  }

  _getDefaultCoupon(t) {
    for (const e in config.COUNTRY_COUPON_MAPPING) if (config.COUNTRY_COUPON_MAPPING.hasOwnProperty(e) && config.COUNTRY_COUPON_MAPPING[e].countries.includes(t)) return {
      code: e,
      percent: config.COUNTRY_COUPON_MAPPING[e].percent
    };
    return null
  }

  isRelevantForChangelogCoupon() {
    if (this.hasCustomServer()) return {status: !1, reason: 1};
    const {hasPaidSubscription: t} = this.getUIState();
    if (t) return {status: !1, reason: 2};
    let {firstVisit: e, appliedSuggestions: s} = this.getStatistics();
    if (!e) return {status: !1, reason: 3};
    e *= 1e3;
    return Date.now() - e < 6048e5 ? {status: !1, reason: 4} : s < 8 ? {status: !1, reason: 5} : {status: !0}
  }

  startChangelogCoupon() {
    if (!this.canStartChangelogCoupon()) return;
    const t = Date.now();
    this.updateUIState({
      changelogNov2021Coupon: "2021-NOV-CHANGELOG",
      changelogNov2021CountdownEnd: t + 1656e5 + getRandomNumberInRange(0, 72e5)
    })
  }

  isChangelogCouponRunning() {
    if (!this.isRelevantForChangelogCoupon().status) return !1;
    const {changelogNov2021CountdownEnd: t} = this.getUIState();
    return Boolean(t && isDateInFuture(t))
  }

  canStartChangelogCoupon() {
    if (!this.isRelevantForChangelogCoupon().status) return !1;
    const t = Date.now(), {changelogNov2021CountdownEnd: e} = this.getUIState();
    return !e || t - e > config.COUPON_INTERVAL
  }

  destroy() {
    this._isInitialized = !1, super.destroy();
    try {
      browser.storage.onChanged.removeListener(this._onStoredDataChanged)
    } catch (t) {
    }
  }
}