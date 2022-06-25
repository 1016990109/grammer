/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class StorageControllerClass {
  constructor(e) {
    this._eventBus = new EventBus, this._onReadyCallbacks = [], e && this._onReadyCallbacks.push(e)
  }

  static _combineObjects(e, t) {
    const a = deepClone(e);
    for (const e in a) t.hasOwnProperty(e) && (a[e] = t[e]);
    return a
  }

  static _dec2hex(e) {
    return ("0" + e.toString(16)).substr(-2)
  }

  static _generateUniqueId() {
    const e = new Uint8Array(8);
    return window.crypto.getRandomValues(e), Array.from(e, StorageControllerClass._dec2hex).join("")
  }

  static _normalizeDomain(e = "") {
    return e.toLowerCase().trim().replace(/^www\./, "")
  }

  static _isListContainsDomain(e, t) {
    const a = StorageControllerClass._normalizeDomain(t);
    return (e || []).some((e => {
      const t = StorageControllerClass._normalizeDomain(e);
      return t === a || a.endsWith("." + t)
    }))
  }

  static getDefaultSettings() {
    return deepClone(StorageControllerClass.DEFAULT_SETTINGS)
  }

  static getDefaultPrivacySettings() {
    return clone(StorageControllerClass.DEFAULT_PRIVACY_SETTINGS)
  }

  addEventListener(e, t) {
    this._eventBus.subscribe(e, t)
  }

  disableDomain(e) {
    const t = StorageControllerClass._normalizeDomain(e), a = this.getSettings(),
      o = "object" == typeof a.disabledDomains ? a.disabledDomains : [];
    return o.push(t), this.updateSettings({disabledDomains: o})
  }

  enableDomain(e) {
    const t = StorageControllerClass._normalizeDomain(e), a = this.getSettings();
    let o = "object" == typeof a.disabledDomains ? a.disabledDomains : [];
    return o = o.filter((e => {
      const a = StorageControllerClass._normalizeDomain(e);
      return a !== t && !t.endsWith("." + a)
    })), this.updateSettings({disabledDomains: o})
  }

  disableEditorGroup(e, t) {
    const a = StorageControllerClass._normalizeDomain(e), o = this.getSettings(),
      n = "object" == typeof o.disabledEditorGroups ? o.disabledEditorGroups : [];
    return n.push({domain: a, editorGroupId: t}), this.updateSettings({disabledEditorGroups: n})
  }

  enableEditorGroup(e, t) {
    const a = StorageControllerClass._normalizeDomain(e), o = this.getSettings();
    let n = "object" == typeof o.disabledEditorGroups ? o.disabledEditorGroups : [];
    return n = n.filter((e => !(e.domain === a && e.editorGroupId === t))), this.updateSettings({disabledEditorGroups: n})
  }

  enableDomainAndEditorGroup(e, t) {
    return this.getCheckSettings(e, t).isEditorGroupDisabled && this.enableEditorGroup(e, t), this.enableDomain(e)
  }

  disableCapitalization(e) {
    const t = StorageControllerClass._normalizeDomain(e), a = this.getSettings(),
      o = "object" == typeof a.disabledDomainsCapitalization ? a.disabledDomainsCapitalization : [];
    return o.push(t), this.updateSettings({disabledDomainsCapitalization: o})
  }

  enableCapitalization(e) {
    const t = StorageControllerClass._normalizeDomain(e), a = this.getSettings();
    let o = "object" == typeof a.disabledDomainsCapitalization ? a.disabledDomainsCapitalization : [];
    return o = o.filter((e => {
      const a = StorageControllerClass._normalizeDomain(e);
      return a !== t && !t.endsWith("." + a)
    })), this.updateSettings({disabledDomainsCapitalization: o})
  }

  destroy() {
    this._eventBus.destroy(), this._onReadyCallbacks = []
  }
}

StorageControllerClass.eventNames = {
  settingsChanged: "lt-storageController.settingsChanged",
  configurationChanged: "lt-storageController.configurationChanged",
  privacySettingsChanged: "lt-storageController.privacySettingsChanged",
  uiStateChanged: "lt-storageController.uiStateChanged"
}, StorageControllerClass.DEFAULT_SETTINGS = {
  apiServerUrl: config.MAIN_SERVER_URL,
  autoCheck: !0,
  knownEmail: "",
  username: "",
  password: "",
  token: "",
  userId: null,
  dpaLevel: 0,
  motherTongue: "",
  geoIpLanguages: [],
  geoIpCountry: "",
  preferredLanguages: [],
  enVariant: LanguageManager.getPreferredLanguageVariant(["en-US", "en-GB", "en-AU", "en-CA", "en-NZ", "en-ZA"]) || "en-US",
  deVariant: LanguageManager.getPreferredLanguageVariant(["de-DE", "de-AT", "de-CH"]) || "de-DE",
  ptVariant: LanguageManager.getPreferredLanguageVariant(["pt-PT", "pt-BR", "pt-MZ", "pt-AO"]) || "pt-BR",
  caVariant: "ca-ES",
  dictionary: [],
  hasSynonymsEnabled: !1,
  hasPickyModeEnabledGlobally: !1,
  openCardHotkey: "",
  isDictionarySynced: !1,
  ignoredRules: [],
  disabledDomains: [],
  disabledEditorGroups: [],
  disabledDomainsCapitalization: [],
  ignoreCheckOnDomains: [],
  autoCheckOnDomains: [],
  confirmedGPT3: !1
}, StorageControllerClass.DEFAULT_MANAGED_SETTINGS = {
  apiServerUrl: "",
  loginUrl: "",
  disablePrivacyConfirmation: !1,
  disablePersonalDictionary: !1,
  disableIgnoredRules: !1
}, StorageControllerClass.DEFAULT_CONFIGURATION = {unsupportedDomains: []}, StorageControllerClass.DEFAULT_PRIVACY_SETTINGS = {allowRemoteCheck: !1}, StorageControllerClass.DEFAULT_STATISTICS = {
  usageCount: 0,
  sessionCount: 0,
  appliedSuggestions: 0,
  appliedSynonyms: 0,
  hiddenErrors: [],
  firstVisit: null,
  lastActivity: null,
  ratingValue: null,
  premiumClicks: 0,
  isOverleafUser: !1,
  isThunderbirdUser: !1,
  isNotionUser: !1
}, StorageControllerClass.DEFAULT_UI_STATE = {
  hasSeenPrivacyConfirmationDialog: !1,
  hasPaidSubscription: !1,
  hasRated: !1,
  hasUsedValidator: !1,
  hasSeenOnboarding: !1,
  isNewUser: !1,
  hasSeenNewOverleafTeaser: !1,
  hasSeenNewGoogleDocsTeaser: !1,
  hasSeenNewGoogleSlidesTeaser: !1,
  hasSeenGoogleDocsMenuBarHint: !1,
  lastChangelogNov2021Seen: null,
  changelogNov2021CountdownEnd: null,
  changelogNov2021Coupon: null,
  showRuleId: !1,
  dialogPosition: "default",
  countMode: "characters",
  hasSeenTurnOnMessagePopup: !1
}, StorageControllerClass.DEFAULT_TEST_FLAGS = {};

class StorageController {
  static init(e) {
    this._instanceFactory = e
  }

  static create() {
    return this._instanceFactory()
  }
}