/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
var __awaiter = this && this.__awaiter || function (e, t, r, i) {
  return new (r || (r = Promise))((function (o, n) {
    function s(e) {
      try {
        d(i.next(e))
      } catch (e) {
        n(e)
      }
    }

    function a(e) {
      try {
        d(i.throw(e))
      } catch (e) {
        n(e)
      }
    }

    function d(e) {
      var t;
      e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r((function (e) {
        e(t)
      }))).then(s, a)
    }

    d((i = i.apply(e, t || [])).next())
  }))
};
const rolloutSegment = function (e, t) {
  try {
    const r = function (e) {
      if (e.startsWith("user:")) return BigInt(e.substr(5));
      if (e.includes(":")) {
        const t = e.indexOf(":"), r = BigInt(e.substring(0, t)), i = BigInt(e.substr(t + 1));
        return r * BigInt(92233720368546) + i
      }
      return BigInt(e)
    }(e);
    return Number(r % BigInt(100)) < t ? "test" : "control"
  } catch (e) {
    return 100 * Math.random() < t ? "test" : "control"
  }
};

class LTAssistant {
  constructor(e = {}, t = TweaksManager.DEFAULT_SITE_TWEAKS) {
    this._spellcheckingAttributesData = new Map, this._editors = [], this._messages = [], this._checkExtensionRuntimeHealthIntervalId = void 0, this._fixTinyMCEIntervalId = void 0, this._initElementTimeouts = new Map, this._init = () => {
      "string" == typeof this._options.apiServerUrl && this._storageController.updateSettings({apiServerUrl: this._options.apiServerUrl}), "boolean" == typeof this._options.enableSynonyms && this._storageController.updateSettings({hasSynonymsEnabled: this._options.enableSynonyms}), "boolean" == typeof this._options.enablePickyModeGlobally && this._storageController.updateSettings({hasPickyModeEnabledGlobally: this._options.enablePickyModeGlobally}), this._options.dev && this._storageController.updateUIState({showRuleId: !0}), this.updateLanguageOptions({
        motherTongue: this._options.motherTongue,
        preferredLanguages: this._options.preferredLanguages,
        preferredVariants: this._options.preferredVariants
      }), this._options.user && this.updateUser({
        email: this._options.user.email,
        token: this._options.user.token,
        premium: this._options.user.premium,
        apiServerUrl: this._options.apiServerUrl
      }), this._onPageLoaded();
      if (this._tweaks.isSupported() && this._storageController.isDomainSupported(getCurrentDomain())) {
        if (this._isRemoteCheckAllowed = this._storageController.getPrivacySettings().allowRemoteCheck, this._checkExtensionRuntimeHealthIntervalId = window.setInterval(this._checkExtensionRuntimeHealth, config.EXTENSION_HEALTH_RECHECK_INTERVAL), this._options.initElements) {
          const e = Array.isArray(this._options.initElements) ? this._options.initElements : [this._options.initElements];
          for (const t of e) this._initElement(t)
        }
        if (!this._options.ignoreFocus) {
          const e = getFocusedElement();
          e && this._initElement(e, !0), document.body && hasFirefoxDesignMode(document.body) && this._initElement(document.body, !0)
        }
        window.__ltLastActiveElement && (this._initElement(window.__ltLastActiveElement), window.__ltLastActiveElement = null), this._tweaks.onNewElement(((e, t) => {
          this._initElement(e, t)
        })), BrowserDetector.isChromium() && window.innerHeight > 14 && (this._fixTinyMCEIntervalId = window.setInterval((() => {
          this._fixIframeWithoutContentScripts()
        }), config.IFRAME_INITILIZATION_RECHECK_INTERVAL)), window.addEventListener("pageshow", this._onPageLoaded), window.addEventListener("pagehide", this._onPageHide), document.addEventListener("focus", this._onDocumentFocus, !0), document.addEventListener("mousemove", this._onDocumentMousemove, !0), document.addEventListener("focusout", this._onDocumentFocusout, !0), document.addEventListener(this._tweaks.getClickEvent(), this._onDocumentClick, !0), window.frameElement && window.frameElement.ownerDocument && window.frameElement.ownerDocument.addEventListener("click", this._onDocumentClick, !0), document.addEventListener(LTAssistant.events.DESTROY, this._onDestroy), document.addEventListener(InputAreaWrapper.eventNames.scroll, this._onInputScroll), document.addEventListener(InputAreaWrapper.eventNames.paste, this._onInputPaste), document.addEventListener(InputAreaWrapper.eventNames.textChanged, this._onInputTextChanged), document.addEventListener(InputAreaWrapper.eventNames.dblclick, this._onInputDblClick), document.addEventListener(InputAreaWrapper.eventNames.dblPress, this._onInputDblPress), document.addEventListener(Highlighter.eventNames.blockClicked, this._onHiglighterBlockClicked), document.addEventListener(Toolbar.eventNames.permissionRequiredIconClicked, this._onToolbarPermissionRequiredIconClicked), document.addEventListener(Toolbar.eventNames.toggleDialog, this._onToolbarToggleDialog), document.addEventListener(Toolbar.eventNames.notifyAboutPremiumIcon, this._onToolbarNotifyAboutPremiumIcon), document.addEventListener(Dialog.eventNames.positionChangeClicked, this._onPositionChangeClicked), document.addEventListener(Dialog.eventNames.enableHere, this._onDialogEnableHere), document.addEventListener(Dialog.eventNames.togglePickyMode, this._onPickyModeToggle), document.addEventListener(Dialog.eventNames.enableEverywhere, this._onDialogEnableEverywhere), document.addEventListener(Dialog.eventNames.languageChanged, this._onDialogLanguageChanged), document.addEventListener(Dialog.eventNames.countChanged, this._onDialogCountChanged), document.addEventListener(Dialog.eventNames.errorSelected, this._onDialogErrorSelected), document.addEventListener(Dialog.eventNames.errorHighlighted, this._onDialogErrorHighlighted), document.addEventListener(Dialog.eventNames.addToDictionaryClicked, this._onAddToDictionary), document.addEventListener(Dialog.eventNames.ignoreRuleClicked, this._onIgnoreRule), document.addEventListener(Dialog.eventNames.temporarilyIgnoreWordClicked, this._onTemporarilyIgnoreWord), document.addEventListener(Dialog.eventNames.temporarilyIgnoreRuleClicked, this._onTemporarilyIgnoreRule), document.addEventListener(Dialog.eventNames.moreDetailsClicked, this._onMoreDetailsClicked), document.addEventListener(Dialog.eventNames.fixSelected, this._onFixSelected), document.addEventListener(Dialog.eventNames.openOptions, this._onDialogOpenOptions), document.addEventListener(Dialog.eventNames.showFeedbackForm, this._onDialogShowFeedbackForm), document.addEventListener(Dialog.eventNames.destroyed, this._onDialogDestroyed), document.addEventListener(Dialog.eventNames.badgeClicked, this._onBadgeClicked), document.addEventListener(Dialog.eventNames.turnOff, this._onTurnOffClicked), document.addEventListener(Dialog.eventNames.pauseChecking, this._onPauseCheckingClicked), document.addEventListener(Dialog.eventNames.premiumTeaserClicked, this._onDialogPremiumTeaserClicked), document.addEventListener(Dialog.eventNames.correctAll, this._onCorrectAll), document.addEventListener(ErrorCard.eventNames.addToDictionaryClicked, this._onAddToDictionary), document.addEventListener(ErrorCard.eventNames.ignoreRuleClicked, this._onIgnoreRule), document.addEventListener(ErrorCard.eventNames.temporarilyIgnoreWordClicked, this._onTemporarilyIgnoreWord), document.addEventListener(ErrorCard.eventNames.temporarilyIgnoreRuleClicked, this._onTemporarilyIgnoreRule), document.addEventListener(ErrorCard.eventNames.moreDetailsClicked, this._onMoreDetailsClicked), document.addEventListener(ErrorCard.eventNames.fixSelected, this._onFixSelected), document.addEventListener(ErrorCard.eventNames.badgeClicked, this._onBadgeClicked), document.addEventListener(ErrorCard.eventNames.logoClicked, this._onErrorCardLogoClicked), document.addEventListener(ErrorCard.eventNames.languageChanged, this._onErrorCardLanguageChanged), document.addEventListener(ErrorCard.eventNames.turnOffPickyModeClicked, this._onErrorCardPickyModeTurnedOff), document.addEventListener(ErrorCard.eventNames.premiumTeaserClicked, this._onErrorCardPremiumTeaserClicked), document.addEventListener(ErrorCard.eventNames.destroyed, this._onErrorCardDestroyed), document.addEventListener(ErrorCard.eventNames.correctAll, this._onCorrectAll), document.addEventListener(RephraseCard.eventNames.synonymSelected, this._onSynonymSelected), document.addEventListener(RephraseCard.eventNames.phraseSelected, this._onPhraseSelected), document.addEventListener(RephraseCard.eventNames.logoClicked, this._onRephraseCardLogoClicked), document.addEventListener(RephraseCard.eventNames.destroyed, this._onRephraseCardDestroyed), document.addEventListener(RephraseCard.eventNames.highlight, this._onRephraseCardHighlight), document.addEventListener(RephraseCard.eventNames.flashSentence, this._onRephraseCardFlashSentence), document.addEventListener(MessagePopup.eventNames.destroyed, this._onMessagePopupDestroyed), document.addEventListener(MessagePopup.eventNames.turnOn, this._onTurnOnClicked), this._storageController.addEventListener(StorageControllerClass.eventNames.settingsChanged, this._onSettingsChanged), this._storageController.addEventListener(StorageControllerClass.eventNames.privacySettingsChanged, this._onPrivacySettingsChanged), this._storageController.addEventListener(StorageControllerClass.eventNames.uiStateChanged, this._onUiStateChanged), this._options.onInit && this._options.onInit(this)
      }
    }, this._checkExtensionRuntimeHealth = () => {
      EnvironmentAdapter.isRuntimeConnected() || this._handleUnhealthyExtensionRuntime()
    }, this._onPageLoaded = () => {
      let e = !0;
      const t = this._tweaks.isBeta();
      let r = !0, i = !0, o = "";
      if (this._tweaks.isSupported()) if (this._storageController.isDomainSupported(getCurrentDomain())) {
        const t = this._getCheckSettings();
        e = !t.isDomainDisabled && !t.isEditorGroupDisabled, r = t.shouldCapitalizationBeChecked
      } else i = !1, o = i18nManager.getMessage("siteCannotBeSupported"); else i = !1, o = this._tweaks.unsupportedMessage();
      EnvironmentAdapter.pageLoaded(e, r, i, t, o)
    }, this._onPageHide = () => {
      this._editors.forEach((e => {
        this._savePremiumErrorCount(e), this._trackEditor(e)
      }))
    }, this._onDocumentFocus = e => {
      if (this._options.ignoreFocus) return;
      const t = getEventTarget(e);
      t instanceof HTMLElement ? this._initElement(t, !0) : e.target === document && document.body && hasFirefoxDesignMode(document.body) && this._initElement(document.body, !0)
    }, this._onDocumentMousemove = e => {
      const t = this._editors.find((e => e.isUserTyping));
      t && this._endTypingModeAndUpdateState(t)
    }, this._onDocumentFocusout = e => {
      const t = this._editors.find((e => e.isUserTyping));
      t && this._endTypingModeAndUpdateState(t)
    }, this._onDocumentClick = e => {
      if (this._tweaks.isClickEventIgnored(e)) return;
      const t = closestElement(e.target, ErrorCard.CONTAINER_ELEMENT_NAME);
      t || this._hideAllErrorCards();
      const r = closestElement(e.target, RephraseCard.CONTAINER_ELEMENT_NAME);
      r || this._hideAllRephraseCards();
      const i = closestElement(e.target, `${Dialog.CONTAINER_ELEMENT_NAME}, ${Toolbar.CONTAINER_ELEMENT_NAME}`);
      i || this._hideAllDialogs();
      closestElement(e.target, `${MessagePopup.CONTAINER_ELEMENT_NAME}`) || this._hideAllMessagePopups(), i || r || t || this._editors.forEach((e => this._unselectError(e)))
    }, this._onInputDblClick = e => {
      const {hasSynonymsEnabled: t} = this._storageController.getSettings();
      if (!t || this._storageController.hasCustomServer()) return;
      const r = this._editors.find((t => t.inputAreaWrapper === e.detail.inputAreaWrapper));
      if (!r) return;
      const i = e.detail.selection, o = getWordContext(r.inputAreaWrapper.getText(), i.start, i.end || i.start);
      o && this._showRephraseCard(r, e.detail.clickedRectangles, o)
    }, this._onInputTextChanged = e => {
      this._hideAllErrorCards(), requestAnimationFrame((() => this._hideAllRephraseCards()));
      const t = this._editors.find((t => t.inputAreaWrapper === e.detail.inputAreaWrapper));
      if (t) {
        if (this._startTypingMode(t), t.dialog && t.dialog.setInsignificantChangeMode(!this._isSignificantTextChange(e.detail.previousText, e.detail.text)), this._checkEditor(t, e.detail.text, !0)) this._endTypingMode(t), this._updateDisplayedErrors(t); else {
          const r = e.detail.text, i = t.inputAreaTweaks.getReplacedParts(r), o = getValuableText(r, i),
            n = ErrorProcessor.migrateErrorsBetweenTexts(t.errors, t.checkedText.originalText, r),
            s = ErrorProcessor.migrateErrorsBetweenTexts(t.premiumErrors, t.checkedText.originalText, r);
          this._updateDisplayedErrors(t, o, n, s)
        }
        this._highlight(t), this._updateState(t)
      }
    }, this._onInputPaste = e => {
      this._hideAllErrorCards(), this._hideAllRephraseCards();
      const t = this._editors.find((t => t.inputAreaWrapper === e.detail.inputAreaWrapper));
      t && t.dialog && t.dialog.setInsignificantChangeMode(!e.detail.isSignificantTextChange)
    }, this._onInputScroll = () => {
      window.requestAnimationFrame((() => {
        this._hideAllErrorCards(), this._hideAllRephraseCards()
      }))
    }, this._onInputDblPress = e => {
      const {hasSynonymsEnabled: t, openCardHotkey: r} = this._storageController.getSettings();
      if (e.detail.key !== r) return;
      const i = this._editors.find((t => t.inputAreaWrapper === e.detail.inputAreaWrapper));
      if (!i) return;
      const o = i.inputAreaWrapper.getSelection();
      if (!o || o.start !== o.end) return;
      const n = i.displayedErrors.find((e => e.start <= o.start && o.start <= e.end));
      if (n) {
        if (n.id === i.selectedErrorId) return;
        const e = i.highlighter.getTextBoxes(n.id);
        e.length && (this._hideAllErrorCards(), this._hideAllRephraseCards(), i.selectedErrorId = n.id, this._highlight(i, !0), this._showErrorCard(i, n, e[0], !0))
      } else {
        if (!t || this._storageController.hasCustomServer()) return;
        const e = getWordContext(i.inputAreaWrapper.getText(), o.start);
        if (e) {
          if (i.rephraseCard && i.rephraseCard.selection.start === e.position.start && i.rephraseCard.selection.end === e.position.end) return;
          this._hideAllErrorCards(), this._hideAllRephraseCards();
          const t = e.position.start, r = e.position.end - t, o = i.inputAreaWrapper.getTextBoxes(t, r);
          this._showRephraseCard(i, o, e, !0)
        }
      }
    }, this._onHiglighterBlockClicked = e => {
      if (e.detail.blockId === RephraseCard.BLOCK_ID) return void e.preventDefault();
      this._hideAllErrorCards(), this._hideAllRephraseCards(), this._hideAllDialogs();
      const t = this._editors.find((t => t.highlighter === e.detail.highlighter));
      if (!t) return void e.preventDefault();
      const r = t.displayedErrors.find((t => t.id === e.detail.blockId)) || t.displayedPremiumErrors.find((t => t.id === e.detail.blockId));
      if (!r) return void e.preventDefault();
      if (t.temporaryDisabledErrorId === r.id) return void e.preventDefault();
      if (!EnvironmentAdapter.isRuntimeConnected()) return void e.preventDefault();
      if (getSelectedText().trim()) return void e.preventDefault();
      t.selectedErrorId = r.id;
      let i = !1;
      t.callbacks.onErrorClick && (i = t.callbacks.onErrorClick(r)), i || this._showErrorCard(t, r, e.detail.clickedBox), this._highlight(t)
    }, this._onToolbarPermissionRequiredIconClicked = () => {
      EnvironmentAdapter.openWindow(config.INSTALL_URL), Tracker.trackEvent("Action", "toolbar:open_install_url")
    }, this._onToolbarToggleDialog = e => {
      const t = this._editors.find((t => t.toolbar === e.detail.toolbar));
      if (!t) return;
      let r = t.checkStatus;
      r === CHECK_STATUS.COMPLETED && t.displayedErrors.length > 0 ? r = "HAS_ERRORS" : r === CHECK_STATUS.COMPLETED && t.premiumErrors.length > 0 && (r = "HAS_ONLY_PREMIUM_ERRORS"), Tracker.trackEvent("Action", "dialog:opened", r);
      const i = !t.dialog;
      this._hideAllErrorCards(), this._hideAllRephraseCards(), this._hideAllDialogs(!0), i && this._showDialog(t)
    }, this._onToolbarNotifyAboutPremiumIcon = e => {
      const t = this._editors.find((t => t.toolbar === e.detail.toolbar));
      t && t.language && (t.tracking.sawPremiumIcon = !0)
    }, this._onTurnOffClicked = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      if (!t) return;
      const r = getMainPageDomain();
      if (this._storageController.disableDomain(r), EnvironmentAdapter.ltAssistantStatusChanged({enabled: !1}), Tracker.trackEvent("Action", "check_trigger:turn_off"), !this._storageController.getUIState().hasSeenTurnOnMessagePopup && t.inputAreaTweaks.getMessagePopupAppearance().isVisible()) {
        const e = {
          className: "enable-spelling",
          hasPrimaryButton: !0,
          hasSecondaryButton: !0,
          isClosable: !0,
          destroysAutomatically: !0
        }, r = new MessagePopup(document, t.inputAreaTweaks.getMessagePopupAppearance(), e);
        this._messages.push(r)
      }
    }, this._onPauseCheckingClicked = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      if (!t) return;
      const r = t.groupId;
      Array.from(this._editors).forEach((e => {
        e.groupId === r && this._destroyEditor(e)
      })), this._temporaryDisabledEditorGroups.push(t.groupId), Tracker.trackEvent("Action", "check_trigger:pause")
    }, this._onTurnOnClicked = e => {
      const t = getMainPageDomain(), r = this._tweaks.getEditorGroupId(getCurrentUrl());
      this._storageController.enableDomainAndEditorGroup(t, r), EnvironmentAdapter.ltAssistantStatusChanged({enabled: !0});
      const i = getActiveElement();
      i instanceof HTMLElement && this._initElement(i, !0), Tracker.trackEvent("Action", "check_trigger:turn_on")
    }, this._onPositionChangeClicked = e => {
      this._storageController.updateUIState({dialogPosition: e.detail.newPosition})
    }, this._onDialogEnableHere = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      t && (this._enableEditor(t), Tracker.trackEvent("Action", "check_trigger:manually_triggered"))
    }, this._onPickyModeToggle = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      t && this._togglePickyMode(t, e.detail.isEnabled)
    }, this._onDialogEnableEverywhere = e => {
      this._storageController.updateSettings({
        autoCheck: !0,
        ignoreCheckOnDomains: []
      }), Tracker.trackEvent("Action", "enable_everywhere")
    }, this._onDialogLanguageChanged = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      t && this._setLanguage(t, e.detail.language)
    }, this._onDialogCountChanged = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      if (t && t.dialog) {
        t.countMode = e.detail.countMode, this._storageController.updateUIState({countMode: e.detail.countMode});
        let r = this._getCountOptions(t.checkedText.originalText, e.detail.countMode);
        t.dialog.setCountOptions(r)
      }
    }, this._onErrorCardLanguageChanged = e => {
      const t = this._editors.find((t => t.errorCard === e.detail.errorCard));
      t && (this._setLanguage(t, e.detail.language), Tracker.trackEvent("Action", "check_trigger:switch_language_variant"))
    }, this._onErrorCardPickyModeTurnedOff = e => {
      const t = this._editors.find((t => t.errorCard === e.detail.errorCard));
      t && this._togglePickyMode(t, !1)
    }, this._onDialogErrorHighlighted = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      if (!t) return;
      const r = t.displayedErrors.find((t => t.id === e.detail.errorId));
      r && (t.selectedErrorId = r.id, this._highlight(t))
    }, this._onDialogErrorSelected = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      if (!t) return;
      const r = t.displayedErrors.find((t => t.id === e.detail.errorId));
      r && this._scrollToError(t, r, "auto", !0)
    }, this._onAddToDictionary = e => {
      let t;
      if ("errorCard" in e.detail) {
        const r = e.detail.errorCard;
        t = this._editors.find((e => e.errorCard === r))
      } else if ("dialog" in e.detail) {
        const r = e.detail.dialog;
        t = this._editors.find((e => e.dialog === r))
      }
      if (this._hideAllErrorCards(), !t) return;
      const r = e.detail.error, i = r.originalPhrase;
      t.selectErrorAfter = e.detail.selectNextError ? r.start : null, this._addToDictionary(t, i);
      const o = LanguageManager.getPrimaryLanguageCode(r.language.code);
      (o.startsWith("de") || o.startsWith("en")) && ("de" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: de: ${r.contextPhrase}`) : "del" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: del: ${r.contextPhrase}`) : "air" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: air: ${r.contextPhrase}`) : "click" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: click: ${r.contextPhrase}`) : "school" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: school: ${r.contextPhrase}`) : "un" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: un: ${r.contextPhrase}`) : "eco" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: eco: ${r.contextPhrase}`) : "geo" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: geo: ${r.contextPhrase}`) : "et" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: et: ${r.contextPhrase}`) : "and" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: and: ${r.contextPhrase}`) : "el" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: el: ${r.contextPhrase}`) : "of" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: of: ${r.contextPhrase}`) : "for" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: for: ${r.contextPhrase}`) : "the" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: the: ${r.contextPhrase}`) : "pre" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: pre: ${r.contextPhrase}`) : "black" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: black: ${r.contextPhrase}`) : "connect" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: connect: ${r.contextPhrase}`) : "day" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: day: ${r.contextPhrase}`) : "advanced" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: advanced: ${r.contextPhrase}`) : "social" === r.originalPhrase.toLowerCase() ? Tracker.trackEvent("Debug", `${o}: social: ${r.contextPhrase}`) : "big" === r.originalPhrase.toLowerCase() && Tracker.trackEvent("Debug", `${o}: big: ${r.contextPhrase}`)), Tracker.trackDictionaryEvent(o, r.originalPhrase, !1), Tracker.trackEvent("Action", `${o}:add_word_to_dict`)
    }, this._onIgnoreRule = e => {
      let t;
      if ("errorCard" in e.detail) {
        const r = e.detail.errorCard;
        t = this._editors.find((e => e.errorCard === r))
      } else if ("dialog" in e.detail) {
        const r = e.detail.dialog;
        t = this._editors.find((e => e.dialog === r))
      }
      if (this._hideAllErrorCards(), !t) return;
      const r = e.detail.error, i = LanguageManager.getPrimaryLanguageCode(r.language.code),
        o = {id: r.rule.id, language: i, description: r.rule.description, turnOffDate: new Date};
      let n = !1;
      if (this._options.onRuleIgnore && (n = this._options.onRuleIgnore(o, t.inputArea, r)), t.callbacks.onRuleIgnore && (n = t.callbacks.onRuleIgnore(o, r)), !n) {
        const e = this._storageController.getSettings().ignoredRules;
        e.push(o), this._storageController.updateSettings({ignoredRules: e})
      }
      t.selectErrorAfter = e.detail.selectNextError ? r.start : null, Tracker.trackDisabledRule(i, r.rule.id, `[${r.rule.subId || "0"}] ${r.contextPhrase}`, r.rule.isPremium), "errorCard" in e.detail && Tracker.trackEvent("Action", `${i}:disable_rule`, r.rule.id)
    }, this._onTemporarilyIgnoreWord = e => {
      let t;
      if ("errorCard" in e.detail) {
        const r = e.detail.errorCard;
        t = this._editors.find((e => e.errorCard === r))
      } else if ("dialog" in e.detail) {
        const r = e.detail.dialog;
        t = this._editors.find((e => e.dialog === r))
      }
      if (this._hideAllErrorCards(), !t) return;
      const r = e.detail.error, i = LanguageManager.getPrimaryLanguageCode(r.language.code);
      if (t.callbacks.onTemporaryIgnore) {
        const e = {id: r.rule.id, phrase: r.originalPhrase, language: i};
        t.callbacks.onTemporaryIgnore(e, r)
      }
      this._temporarilyIgnoreWord(t, r.originalPhrase), t.selectErrorAfter = e.detail.selectNextError ? r.start : null, Tracker.trackDictionaryEvent(i, r.originalPhrase, !0), Tracker.trackEvent("Action", `${i}:temp_ignore_word`)
    }, this._onTemporarilyIgnoreRule = e => {
      let t;
      if ("errorCard" in e.detail) {
        const r = e.detail.errorCard;
        t = this._editors.find((e => e.errorCard === r))
      } else if ("dialog" in e.detail) {
        const r = e.detail.dialog;
        t = this._editors.find((e => e.dialog === r))
      }
      if (this._hideAllErrorCards(), !t) return;
      const r = e.detail.error, i = t.groupId, o = LanguageManager.getPrimaryLanguageCode(r.language.code),
        n = {id: r.rule.id, language: o};
      if (r.rule.id.includes("PASSIVE_VOICE") || r.rule.id.includes("TOO_LONG_SENTENCE") || r.rule.id.includes("EN_QUOTES") || r.rule.id.includes("DASH_RULE") || r.rule.id.includes("TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN") || !(r.originalPhrase.length < 1e3) || (n.phrase = r.originalPhrase), this._tweaks.persistTemporarySettings()) {
        const e = `ignored:${i}`, t = LocalStorageWrapper.get(e) || {words: [], rules: []};
        t.rules.push(n), LocalStorageWrapper.set(e, t)
      }
      const s = this._editors.filter((e => e.groupId === i));
      t.callbacks.onTemporaryIgnore && t.callbacks.onTemporaryIgnore(n, r), t.selectErrorAfter = e.detail.selectNextError ? r.start : null, s.forEach((e => this._temporarilyIgnoreRule(e, n))), "HIDDEN_RULE" !== r.rule.id && (Tracker.trackDisabledRule(o, r.rule.id, `[${r.rule.subId || "0"}] ${r.contextPhrase}`, r.rule.isPremium), "errorCard" in e.detail && Tracker.trackEvent("Action", `${o}:temp_disable_rule`, r.rule.id))
    }, this._onMoreDetailsClicked = e => {
      let t;
      if ("errorCard" in e.detail) {
        const r = e.detail.errorCard;
        t = this._editors.find((e => e.errorCard === r))
      }
      t && (EnvironmentAdapter.openWindow(e.detail.url), Tracker.trackEvent("Action", "show_rule_details", e.detail.url))
    }, this._onFixSelected = e => {
      if (!e.detail) return void this._hideAllErrorCards();
      let t;
      if ("errorCard" in e.detail) {
        const r = e.detail.errorCard;
        t = this._editors.find((e => e.errorCard === r))
      } else if ("dialog" in e.detail) {
        const r = e.detail.dialog;
        t = this._editors.find((e => e.dialog === r))
      }
      if (this._hideAllErrorCards(), !t) return;
      const r = e.detail.error;
      t.selectErrorAfter = e.detail.selectNextError ? r.start : null, this._applyFix(t, r, e.detail.fixIndex);
      const i = LanguageManager.getPrimaryLanguageCode(r.language.code);
      if ("errorCard" in e.detail && ["en", "de", "es", "ca", "fr", "nl", "pt", "it", "pl"].includes(i) && (r.isSpellingError ? (Math.random() < .1 && Tracker.trackEvent("Action", `${i}:apply_spell_suggestion:10perc`, r.rule.id), "de" === i && e.detail.fixIndex > 3 && Math.random() < .2 && Tracker.trackEvent("Stat", "de:apply:last", r.originalPhrase + ":" + r.fixes[e.detail.fixIndex].value)) : Tracker.trackEvent("Action", `${i}:apply_rule`, r.rule.id)), "Translation" === r.fixes[e.detail.fixIndex].type && Tracker.trackEvent("Stat", `${i}:apply_translation`), Math.random() < .1 && r.rule.id && r.isSpellingError && (r.rule.id.startsWith("AI_SPELLING_RULE_EN_") || r.rule.id.startsWith("MORFOLOGIK_RULE_EN_")) && Tracker.trackEvent("Action", `${i}:apply_spell_suggestion_index:${e.detail.fixIndex}`, r.rule.id), "standalone" === EnvironmentAdapter.getType() && t.id && r.rule.id) {
        const i = rolloutSegment(t.id, 50),
          o = `${LanguageManager.getPrimaryLanguageCode(r.language.code)}:apply_suggestion_index`,
          n = `${r.rule.id}:${e.detail.fixIndex}:${r.fixes.length}:${i}`;
        Tracker.trackEvent("Action", o, n)
      }
    }, this._onDialogOpenOptions = e => {
      EnvironmentAdapter.openOptionsPage(e.detail.target, e.detail.ref)
    }, this._onDialogShowFeedbackForm = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      if (!t) return;
      const r = t.inputArea.cloneNode(!1);
      try {
        r.innerText = `${t.inputAreaWrapper.getText().length} chars, ${t.language ? t.language.code : "unknown lang"}`
      } catch (e) {
      }
      EnvironmentAdapter.openFeedbackForm(getCurrentUrl(), "", r.outerHTML || "")
    }, this._onDialogDestroyed = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      t && (t.dialog = null, null === t.errorCard && this._unselectError(t))
    }, this._onBadgeClicked = () => {
      this._hideAllErrorCards(), this._hideAllRephraseCards();
      let e = !1;
      this._options.onPremiumTeaserClick && (e = this._options.onPremiumTeaserClick()), e || EnvironmentAdapter.openOptionsPage(void 0, "errorcard"), Tracker.trackEvent("Action", "check_trigger:badge:clicked", String(`premium:${this._storageController.getUIState().hasPaidSubscription}`))
    }, this._onDialogPremiumTeaserClicked = e => {
      const t = this._editors.find((t => t.dialog === e.detail.dialog));
      if (!t) return;
      let r = !1;
      this._options.onPremiumTeaserClick && (r = this._options.onPremiumTeaserClick()), r || this._openPremiumPage(t, e.detail.campaign)
    }, this._onErrorCardPremiumTeaserClicked = e => {
      const t = this._editors.find((t => t.errorCard === e.detail.errorCard));
      if (!t) return;
      let r = !1;
      this._options.onPremiumTeaserClick && (r = this._options.onPremiumTeaserClick()), r || this._openPremiumPage(t, e.detail.campaign)
    }, this._onErrorCardLogoClicked = () => {
      this._onLogoClicked("errorcard-logo")
    }, this._onRephraseCardLogoClicked = () => {
      this._onLogoClicked("synonyms-header")
    }, this._onMessagePopupDestroyed = e => {
      const t = this._messages.indexOf(e.detail.message);
      -1 !== t && this._messages.splice(t, 1)
    }, this._onErrorCardDestroyed = e => {
      var t;
      const r = this._editors.find((t => t.errorCard === e.detail.errorCard));
      r && (r.errorCard = null, null === (t = r.dialog) || void 0 === t || t.fadeIn(), r.selectedErrorId === e.detail.error.id && (r.temporaryDisabledErrorId = r.selectedErrorId, window.setTimeout((() => r.temporaryDisabledErrorId = null), 500), this._unselectError(r)))
    }, this._onCorrectAll = e => {
      let t;
      if ("errorCard" in e.detail) {
        const r = e.detail.errorCard;
        t = this._editors.find((e => e.errorCard === r))
      } else if ("dialog" in e.detail) {
        const r = e.detail.dialog;
        t = this._editors.find((e => e.dialog === r))
      }
      if (this._hideAllErrorCards(), !t) return;
      console.log(e.detail);
      const r = e.detail.config,
        i = t.displayedErrors.filter((e => e.rule.id === r.ruleId && e.fixes.some((e => r.suggestion.match.test(e.value))))),
        o = i.indexOf(e.detail.selectedError), n = i.splice(o, Number.MAX_SAFE_INTEGER);
      for (let e = 0; e < o; e++) n.push(i[e]);
      this._correctMultipleErrors(t, n, r), Tracker.trackEvent("Action", "apply_multiple_at_once", r.ruleId)
    }, this._onSynonymSelected = e => {
      const t = this._editors.find((t => t.rephraseCard === e.detail.rephraseCard));
      if (this._hideAllRephraseCards(), !t) return;
      const r = e.detail.word, i = r.replace(r.trim(), e.detail.synonym),
        o = e.detail.selection.end || e.detail.selection.start;
      t.inputAreaTweaks.applyFix({
        offset: e.detail.selection.start,
        length: o - e.detail.selection.start,
        replacementText: i,
        editor: t
      }), this._temporarilyIgnoreWord(t, e.detail.synonym), wait(100).then((() => t.checkDebounce.callImmediately()));
      const {appliedSynonyms: n} = this._storageController.getStatistics();
      this._storageController.updateStatistics({appliedSynonyms: n + 1}), Tracker.trackEvent("Action", "synonyms:applied")
    }, this._onPhraseSelected = e => {
      const t = this._editors.find((t => t.rephraseCard === e.detail.rephraseCard));
      if (!t) return;
      const {selection: r, phrase: i} = e.detail;
      t.inputAreaTweaks.applyFix({
        offset: r.start,
        length: r.end - e.detail.selection.start,
        replacementText: i,
        editor: t
      }), wait(100).then((() => t.checkDebounce.callImmediately())), wait(500).then((() => {
        var e, r;
        return UndoNotification.create({
          language: null !== (r = null === (e = t.language) || void 0 === e ? void 0 : e.code) && void 0 !== r ? r : "en",
          parentElement: document.body,
          label: i18nManager.getMessage("notificationUndoLabel"),
          description: i18nManager.getMessage("notificationUndoDescription"),
          lifetime: 4e3,
          onUndo: () => Tracker.trackEvent("Action", "rephrasesV2:undo")
        }).show()
      }))
    }, this._onRephraseCardDestroyed = e => {
      const t = this._editors.find((t => t.rephraseCard === e.detail.rephraseCard));
      t && (t.rephraseCard = null, this._highlight(t))
    }, this._onSettingsChanged = e => {
      if (e.dictionary) {
        const e = Dictionary.get();
        for (const t of this._editors) t.errors = t.errors.filter((t => !isErrorIgnoredByDictionary(t, e))), this._updateDisplayedErrors(t), this._highlight(t), this._updateState(t)
      }
      if (e.ignoredRules) for (const e of this._editors) this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e);
      if (e.disabledDomainsCapitalization && this._editors.forEach((e => {
        this._resetEditor(e), this._endTypingMode(e), this._checkEditor(e), this._highlight(e), this._updateState(e)
      })), e.hasPickyModeEnabledGlobally && this._editors.forEach((e => {
        this._resetEditor(e), this._endTypingMode(e), this._checkEditor(e), this._highlight(e), this._setCheckLevel(e, this._storageController.getSettings().hasPickyModeEnabledGlobally ? "picky" : "hidden-picky"), this._updateState(e)
      })), e.autoCheck || e.autoCheckOnDomains || e.disabledDomains || e.ignoreCheckOnDomains || e.disabledEditorGroups) {
        const e = this._getCheckSettings();
        if (e.isDomainDisabled || e.isEditorGroupDisabled) {
          Array.from(this._editors).forEach((e => this._destroyEditor(e)))
        } else e.isAutoCheckEnabled ? this._editors.filter((e => !e.isAutoCheckEnabled)).forEach((e => this._enableEditor(e))) : e.isAutoCheckEnabled || (this._hideAllDialogs(), this._editors.forEach((e => this._disableEditor(e))))
      }
    }, this._onPrivacySettingsChanged = e => {
      e.allowRemoteCheck && e.allowRemoteCheck.newValue && (this._isRemoteCheckAllowed = !0, this._editors.forEach((e => {
        this._checkEditor(e), this._updateState(e)
      })))
    }, this._onUiStateChanged = e => {
      e.hasPaidSubscription && this._editors.forEach((e => {
        this._resetEditor(e), this._checkEditor(e), this._updateState(e)
      }))
    }, this._onRephraseCardHighlight = e => {
      var t;
      const r = this._editors.find((t => t.rephraseCard === e.detail.rephraseCard));
      r && (this._highlight(r), null === (t = r.rephraseCard) || void 0 === t || t.updateTargetBoxes(r.highlighter.getTextBoxes(RephraseCard.BLOCK_ID)))
    }, this._onRephraseCardFlashSentence = e => {
      const t = this._editors.find((t => t.rephraseCard === e.detail.rephraseCard));
      t && this._flashHighlight({
        offset: e.detail.offset,
        length: e.detail.length,
        duration: e.detail.duration,
        color: e.detail.color,
        editor: t
      })
    }, this._onDestroy = e => {
      e.detail && "type" in e.detail && e.detail.type ? e.detail.type === EnvironmentAdapter.getType() && this.destroy() : this.destroy()
    }, document.documentElement && "HTML" === document.documentElement.nodeName && (this._options = Object.assign({}, e), "string" == typeof this._options.localeCode && i18nManager.setLocale(this._options.localeCode), this._tweaks = t, this._tweaks.init(), this._isConnected = !0, this._temporaryDisabledEditorGroups = [], this._storageController = StorageController.create(), this._storageController.onReady(this._init), Dictionary.init(this._storageController, this._options.dictionary))
  }

  static _isPendingError(e, t) {
    if (0 === e.contextForSureMatch) return !1;
    const r = t.substr(e.end, 100).split("\n")[0],
      i = LTAssistant.COMPLETED_SENTENCE_REGEXP.test(r) || LTAssistant.PUNCTIUATION_CHAR_REGEXP.test(e.originalPhrase);
    if (-1 === e.contextForSureMatch && !i) return !0;
    if (!i) {
      if (r.split(/\s+/).length - 1 <= e.contextForSureMatch) return !0
    }
    return !1
  }

  static _isErrorSelected(e, t) {
    return !(!t || t.start !== e.start && t.end !== e.end)
  }

  static _getChangedParagraphs(e, t) {
    return getParagraphsDiff(e, t).filter((e => e.oldText !== e.newText && null !== e.newText)).map((e => ({
      text: e.newText,
      offset: e.newOffset
    })))
  }

  _isSignificantTextChange(e, t) {
    return Math.abs(t.length - e.length) > 200
  }

  _getCheckSettings() {
    const e = getMainPageDomain();
    return this._storageController.getCheckSettings(e, this._tweaks.getEditorGroupId(getCurrentUrl()))
  }

  _fixIframeWithoutContentScripts() {
    return __awaiter(this, void 0, void 0, (function* () {
      if (!document.activeElement || "IFRAME" !== document.activeElement.nodeName) return;
      const e = document.activeElement.contentWindow;
      let t = !1;
      try {
        t = !!e.location.href
      } catch (e) {
      }
      t && "complete" === e.document.readyState && e.document.documentElement && (e.__ltJsLoaded || (isLTAvailable(e) ? e.__ltJsLoaded = !0 : e.document.body && isTinyMCE(e.document.body) && (e.__ltJsLoaded = !0, yield EnvironmentAdapter.loadContentScripts(e, "js"), EnvironmentAdapter.initializeLTAssistant(e, this._options))), e.__ltCssLoaded || (areCssContentScriptsLoadedIntoWindow(e) ? e.__ltCssLoaded = !0 : e.document.body && (e.__ltCssLoaded = !0, EnvironmentAdapter.loadContentScripts(e, "css"))))
    }))
  }

  _initElement(e, t = !1) {
    if (!e.parentElement) return;
    const r = this._tweaks.getInitElements(e);
    for (const i of r) {
      if (this._editors.some((e => e.inputArea === i))) continue;
      if (!this._tweaks.isElementCompatible(i)) continue;
      const r = this._tweaks.getEditorGroupId(getCurrentUrl());
      if (this._temporaryDisabledEditorGroups.includes(r)) continue;
      const o = this._getCheckSettings();
      if (o.isDomainDisabled || o.isEditorGroupDisabled) continue;
      let n = null;
      "extension" === EnvironmentAdapter.getType() && (n = getShadowRoot(e)) && !areCssContentScriptsLoadedIntoShadowRoot(n) && injectShadowStyles(n), window.clearTimeout(this._initElementTimeouts.get(i)), o.isAutoCheckEnabled && this._disableOtherSpellCheckers(i);
      const s = () => {
        i.removeEventListener("blur", a);
        const e = this._initElementTimeouts.get(i);
        window.clearTimeout(e), this._initElementTimeouts.delete(i)
      }, a = () => {
        s(), this._enableOtherSpellCheckers(i)
      };
      i.addEventListener("blur", a), this._initElementTimeouts.set(i, window.setTimeout((() => {
        s(), !t || this._tweaks.hasFocus(i) ? this.initElement(i) : this._enableOtherSpellCheckers(i)
      }), 150))
    }
  }

  initElement(e, t) {
    if (this._editors.some((t => t.inputArea === e))) throw"LanguageTool is already initialized on this element.";
    if (!this._storageController.isReady()) throw"LTAssistant is not ready initialized yet.";
    const r = getCurrentUrl(), i = String(t && t.id || this._tweaks.getEditorId(r)),
      o = this._tweaks.getEditorGroupId(r), n = TweaksManager.getInputAreaTweaks(r, e), s = n.getMirror(),
      a = n.getMaxTextLength(this._storageController, null == t ? void 0 : t.maxTextLengthBasic),
      d = n.getInputAreaWrapper(s, a), l = s ? s.getCloneElement() : null,
      c = new Highlighter(e, d, l || e, !!s, n.getHighlighterTweaks(l || e, !!s), this._tweaks.getClickEvent());
    let g = null;
    "false" !== e.getAttribute("data-lt-toolbar") && (g = new Toolbar(e, n.getToolbarAppearance(), s)), n.init();
    let h = {words: t && t.dictionary || [], rules: t && t.ignoredRules || []};
    this._tweaks.persistTemporarySettings() && (h = LocalStorageWrapper.get(`ignored:${o}`) || h);
    let u = this._storageController.getSettings().hasPickyModeEnabledGlobally ? "picky" : "hidden-picky";
    this._tweaks.persistTemporarySettings() && (u = LocalStorageWrapper.get(`checkLevel:${o}`) || u);
    let p = null, E = !1;
    if (this._tweaks.persistTemporarySettings()) {
      const e = LocalStorageWrapper.get(`forcedLanguage:${i}`);
      if (e) {
        const t = LanguageManager.LANGUAGES.find((t => t.code === e));
        t && (p = t, E = !0)
      }
    }
    const m = {
      id: i,
      groupId: o,
      checkLevel: t && t.checkLevel || u,
      showHiddenMatchesInplace: t && t.showHiddenMatchesInplace || !1,
      makePickyPremium: t && t.makePickyPremium || !1,
      inputArea: e,
      inputAreaTweaks: n,
      countMode: this._storageController.getUIState().countMode,
      mirror: s,
      inputAreaWrapper: d,
      highlighter: c,
      toolbar: g,
      dialog: null,
      errorCard: null,
      rephraseCard: null,
      ignoredRules: h.rules || [],
      ignoredWords: h.words || [],
      checkDebounce: new Debounce(this._sendCheckRequest.bind(this), config.CHECK_DELAY, config.CHECK_MAX_DELAY),
      checkStatus: CHECK_STATUS.COMPLETED,
      language: p,
      forceLanguage: E,
      isLanguageSupported: !0,
      isAutoCheckEnabled: this._getCheckSettings().isAutoCheckEnabled,
      isUserTyping: !1,
      isChecking: !1,
      isTextTooShort: !1,
      isTextTooLong: !1,
      needsLanguageHintFromUser: !1,
      checkError: null,
      lastCheckTimestamp: 0,
      checkedText: {
        text: "",
        originalText: "",
        usedParts: [{start: 0, end: 0, originalStart: 0, originalEnd: 0, posDiff: 0, length: 0, text: ""}],
        ignoredParts: []
      },
      isIncompleteResult: !1,
      errors: [],
      pickyErrors: [],
      premiumErrors: [],
      premiumPickyErrors: [],
      pendingErrors: [],
      displayedErrors: [],
      displayedPremiumErrors: [],
      displayedHiddenErrorCount: 0,
      selectedErrorId: null,
      selectErrorAfter: null,
      temporaryDisabledErrorId: null,
      typingTimeoutId: void 0,
      maxTextLengthBasic: null == t ? void 0 : t.maxTextLengthBasic,
      sentenceRanges: void 0,
      callbacks: {
        onDictionaryAdd: t && t.onDictionaryAdd,
        onRuleIgnore: t && t.onRuleIgnore,
        onTemporaryIgnore: t && t.onTemporaryIgnore,
        onUpdate: t && t.onUpdate,
        onErrorClick: t && t.onErrorClick,
        onBeforeErrorCorrect: t && t.onBeforeErrorCorrect
      },
      tracking: {hasTracked: !1, hasEnoughText: !1, sawPremiumIcon: !1, languageCode: null, maxTextLength: 0}
    }, _ = (t && t.language || "").toLowerCase();
    if (_) {
      const e = LanguageManager.LANGUAGES.find((e => e.code === _));
      e && (m.language = e, m.forceLanguage = !0)
    }
    return this._editors.push(m), this._checkEditor(m), this._updateState(m), n.onDestroy((() => this._destroyEditor(m))), {
      addWord: e => this._temporarilyIgnoreWord(m, e),
      addToDictionary: e => this._addToDictionary(m, e),
      ignoreRule: e => this._temporarilyIgnoreRule(m, e),
      clearIgnoredRules: () => this._clearTemporarilyIgnoredRules(m),
      clearWords: () => this._clearWords(m),
      getText: () => m.inputAreaWrapper.getText(),
      getLanguage: () => m.language,
      setLanguage: e => this._setLanguage(m, e.toLowerCase()),
      setCheckLevel: e => this._setCheckLevel(m, e),
      getCheckLevel: () => m.checkLevel,
      getElement: () => m.inputArea,
      getDisplayedErrors: () => m.displayedErrors,
      getDisplayedPremiumErrors: () => m.premiumErrors,
      getStatus: () => m.checkStatus,
      getSelection: () => m.inputAreaWrapper.getSelection(),
      setSelection: e => m.inputAreaWrapper.setSelection(e),
      getTextBoxes: e => m.highlighter.getTextBoxes(e.id),
      applyFix: (e, t) => this._applyFix(m, e, t),
      scrollToError: (e, t = !1, r = "nearest") => this._scrollToError(m, e, r, t),
      destroy: () => this._destroyEditor(m)
    }
  }

  updateLanguageOptions(e) {
    if (Array.isArray(e.preferredVariants)) {
      const t = {};
      for (const r of e.preferredVariants) {
        const e = LanguageManager.getPrimaryLanguageCode(r);
        "en" === e ? t.enVariant = r : "de" === e ? t.deVariant = r : "pt" === e ? t.ptVariant = r : "ca" === e && (t.caVariant = r)
      }
      this._storageController.updateSettings(t)
    }
    this._options.motherTongue && this._storageController.updateSettings({motherTongue: e.motherTongue}), this._options.preferredLanguages && this._storageController.updateSettings({
      geoIpLanguages: e.preferredLanguages,
      preferredLanguages: e.preferredLanguages
    })
  }

  updateUser(e) {
    this._storageController.updateSettings({
      username: e.email,
      token: e.token,
      apiServerUrl: e.apiServerUrl || config.PREMIUM_SERVER_URL
    }), e.premium && this._storageController.updateUIState({hasPaidSubscription: !0})
  }

  setLocale(e) {
    i18nManager.setLocale(e)
  }

  _disableOtherSpellCheckers(e) {
    if (!this._tweaks.shouldDisableOtherSpellCheckers(e)) return;
    if (this._spellcheckingAttributesData.get(e)) return;
    const t = {spellcheck: e.getAttribute("spellcheck"), "data-gramm": e.getAttribute("data-gramm")},
      r = "lt-" + Math.round(999999 * Math.random());
    e.setAttribute(LTAssistant.TMP_ID_ATTRIBUTE_NAME, String(r)), e.setAttribute("spellcheck", "false"), e.setAttribute("data-gramm", "false");
    let i = 0;
    const o = new MutationObserver((() => {
      if ("false" !== e.getAttribute("spellcheck") || "false" !== e.getAttribute("data-gramm")) {
        if (++i > 2) return;
        e.setAttribute("spellcheck", "false"), e.setAttribute("data-gramm", "false")
      }
    }));
    o.observe(e, {
      attributes: !0,
      attributeFilter: ["spellcheck", "data-gramm"]
    }), this._spellcheckingAttributesData.set(e, {originalValues: t, mutationObserver: o})
  }

  _enableOtherSpellCheckers(e) {
    const t = this._spellcheckingAttributesData.get(e);
    if (!t) return;
    t.mutationObserver.disconnect();
    const r = e.getAttribute(LTAssistant.TMP_ID_ATTRIBUTE_NAME),
      i = Array.from(e.ownerDocument.querySelectorAll(`[${LTAssistant.TMP_ID_ATTRIBUTE_NAME}="${r}"]`));
    i.includes(e) || i.push(e);
    for (const e in t.originalValues) {
      const r = t.originalValues[e];
      t.originalValues[e] ? i.forEach((t => {
        t.setAttribute(e, r)
      })) : i.forEach((t => {
        t.removeAttribute(e)
      }))
    }
    i.forEach((e => {
      e.removeAttribute(LTAssistant.TMP_ID_ATTRIBUTE_NAME)
    })), this._spellcheckingAttributesData.delete(e)
  }

  _updateState(e) {
    let t = CHECK_STATUS.COMPLETED;
    const r = e.language ? e.language.code : "";
    let i = "";
    this._isConnected ? this._isRemoteCheckAllowed ? e.isAutoCheckEnabled ? e.isUserTyping || e.isChecking ? t = CHECK_STATUS.IN_PROGRESS : e.checkError ? (t = CHECK_STATUS.FAILED, i = this._getCheckErrorMessage(e.checkError)) : e.isTextTooShort ? t = CHECK_STATUS.TEXT_TOO_SHORT : e.isTextTooLong ? t = CHECK_STATUS.TEXT_TOO_LONG : e.isLanguageSupported ? e.needsLanguageHintFromUser && !e.forceLanguage && (t = CHECK_STATUS.NEEDS_LANGUAGE_HINT) : t = CHECK_STATUS.UNSUPPORTED_LANGUAGE : t = CHECK_STATUS.DISABLED : t = CHECK_STATUS.PERMISSION_REQUIRED : t = CHECK_STATUS.DISCONNECTED, e.checkStatus = t;
    const o = {
      checkStatus: t,
      errorsCount: e.displayedErrors.length,
      premiumErrorsCount: e.displayedPremiumErrors.length,
      isIncompleteResult: e.isIncompleteResult,
      checkErrorMessage: i,
      showNotification: this._storageController.canStartChangelogCoupon()
    };
    if (e.toolbar && e.toolbar.updateState(o), e.dialog) {
      const r = new TextStatistics(e.checkedText.originalText),
        o = (new TextScore).calculateTextScore(r.getAllWords().length, e.errors, e.premiumErrors, e.pickyErrors), n = {
          checkStatus: t,
          errors: e.errors,
          pickyErrors: e.pickyErrors,
          displayedPremiumErrors: e.displayedPremiumErrors,
          displayedErrors: e.displayedErrors,
          isIncompleteResult: e.isIncompleteResult,
          ignoredErrorsStats: this._getIgnoredErrorsStats(e.errors),
          checkErrorMessage: i,
          textScore: o,
          countOptions: this._getCountOptions(e.checkedText.originalText, e.countMode),
          isPickyModeEnabled: "picky" === e.checkLevel
        };
      e.dialog.updateState(n)
    }
    if (e.displayedHiddenErrorCount = Math.max(e.displayedHiddenErrorCount, e.premiumErrors.length), e.callbacks.onUpdate || location.href.includes("validator/validator.html")) {
      const o = {
        checkStatus: t,
        languageCode: r,
        errors: e.errors,
        pickyErrors: e.pickyErrors,
        premiumErrors: e.premiumErrors,
        premiumPickyErrors: e.premiumPickyErrors,
        displayedErrors: e.displayedErrors,
        displayedPremiumErrors: e.displayedPremiumErrors,
        isIncompleteResult: e.isIncompleteResult,
        errorMessage: i,
        checkedText: e.checkedText,
        currentText: e.inputAreaWrapper.getText()
      };
      dispatchCustomEvent(e.inputArea, LTAssistant.events.UPDATE, o), e.callbacks.onUpdate && e.callbacks.onUpdate(o)
    }
  }

  _getCheckErrorMessage(e) {
    const t = (e.url || "<unknown>").replace(/\?.*/, "");
    switch (e.reason) {
      case"ConnectionError":
        return i18nManager.getMessage("connectionProblem", t) + " (#1, code=" + e.status + ")";
      case"TimeoutError":
        return i18nManager.getMessage("connectionProblem", t) + " (#1, timeout)";
      case"TooManyErrors":
        return i18nManager.getMessage("tooManyErrors");
      case"TextTooLong":
        return i18nManager.getMessage("textTooLong");
      case"TooManyRequests":
        return i18nManager.getMessage("tooManyRequests");
      case"InvalidCredentials":
        return i18nManager.getMessage("invalidUsernameOrPassword");
      case"AccessDenied":
        return i18nManager.getMessage("accessDeniedError2");
      default:
        return i18nManager.getMessage("unknownError") + " (" + e.status + ")"
    }
  }

  _getCountOptions(e, t) {
    const r = new TextStatistics(e);
    return {
      mode: t,
      counts: {characters: e.length, sentences: r.getAllSentences().length, words: r.getAllWords().length}
    }
  }

  _togglePickyMode(e, t) {
    const r = t ? "picky" : "hidden-picky", i = e.groupId, o = this._editors.filter((e => e.groupId === i));
    if (o.forEach((e => {
      this._setCheckLevel(e, r), this._updateState(e)
    })), this._tweaks.persistTemporarySettings()) {
      const e = `checkLevel:${i}`;
      LocalStorageWrapper.set(e, r)
    }
  }

  _setLanguage(e, t) {
    var r;
    const i = e.language;
    let o = null;
    if ("auto" === t) e.language = null, e.forceLanguage = !1, this._tweaks.persistTemporarySettings() && LocalStorageWrapper.remove(`forcedLanguage:${e.id}`); else {
      if (o = LanguageManager.LANGUAGES.find((e => e.code === t)) || null, !o) throw new Error(`LTAssistant: Language '${t}' is not supported.`);
      e.language = o, e.forceLanguage = !0, this._tweaks.persistTemporarySettings() && LocalStorageWrapper.set(`forcedLanguage:${e.id}`, o.code)
    }
    if (o && "NEEDS_LANGUAGE_HINT" === e.checkStatus) {
      const {preferredLanguages: e} = this._storageController.getSettings(),
        t = LanguageManager.getPrimaryLanguageCode(o.code);
      e.includes(t) || (e.push(LanguageManager.getPrimaryLanguageCode(o.code)), this._storageController.updateSettings({preferredLanguages: e}), Tracker.trackEvent("Action", "dialog:set_language_from_hint", t))
    }
    if (this._resetEditor(e), this._endTypingMode(e), this._checkEditor(e, !0, !1), this._highlight(e), this._updateState(e), i && i.code) {
      if (e.checkedText.text.length >= config.SHORT_TEXT_MAX_LENGTH ? Tracker.trackEvent("Action", "switch_language:long_text", `${i.code} -> ${t}`) : Tracker.trackEvent("Action", "switch_language:" + ((null === (r = null == i ? void 0 : i.detectedLanguage) || void 0 === r ? void 0 : r.source) || "unknown"), `${i.code} -> ${t}`), o && LanguageManager.isLanguageVariant(i) && LanguageManager.isLanguageVariant(o)) {
        const e = LanguageManager.getPrimaryLanguageCode(i.code), t = LanguageManager.getPrimaryLanguageCode(o.code);
        if (e === t && i.code !== o.code) {
          const e = LanguageManager.formatLanguageCode(o.code);
          "en" === t ? this._storageController.updateSettings({enVariant: e}) : "de" === t ? this._storageController.updateSettings({deVariant: e}) : "pt" === t ? this._storageController.updateSettings({ptVariant: e}) : "ca" === t && this._storageController.updateSettings({caVariant: e})
        }
      }
    } else Tracker.trackEvent("Action", "switch_language", `unknown -> ${t}`)
  }

  _setCheckLevel(e, t) {
    this._resetEditor(e), e.checkLevel = t, this._checkEditor(e), Tracker.trackEvent("Action", "set_check_level", t)
  }

  _resetEditor(e) {
    e.isChecking = !1, e.isTextTooShort = !1, e.isTextTooLong = !1, e.checkError = null, e.lastCheckTimestamp = 0, e.checkedText = {
      text: "",
      originalText: "",
      usedParts: [{start: 0, end: 0, originalStart: 0, originalEnd: 0, posDiff: 0, length: 0, text: ""}],
      ignoredParts: []
    }, e.isIncompleteResult = !1, e.errors = [], e.pickyErrors = [], e.premiumErrors = [], e.pendingErrors = [], e.displayedErrors = [], e.displayedPremiumErrors = [], e.selectedErrorId = null, e.selectErrorAfter = null, e.errorCard && e.errorCard.destroy(), e.rephraseCard && e.rephraseCard.destroy()
  }

  _checkEditor(e, t, r) {
    console.log("check Editor")
    let i, o = !1;
    if (void 0 === t && void 0 === r ? (i = e.inputAreaWrapper.getText(), r = !1) : "boolean" == typeof t && void 0 === r ? (i = e.inputAreaWrapper.getText(), r = t) : "string" == typeof t && "boolean" == typeof r ? i = t : (i = e.inputAreaWrapper.getText(), o = t), !this._isConnected) return !0;
    if (!this._isRemoteCheckAllowed || !e.isAutoCheckEnabled) return !0;
    const n = i.trim();
    if (n.length < config.MIN_TEXT_LENGTH || LTAssistant.NO_LETTERS_REGEXP.test(n)) return e.forceLanguage || (e.language = null, e.isLanguageSupported = !0), this._resetEditor(e), e.isTextTooShort = !0, e.checkDebounce.cancelCall(), !0;
    if (i.length > e.inputAreaTweaks.getMaxTextLength(this._storageController, e.maxTextLengthBasic)) {
      const {hasPaidSubscription: t} = this._storageController.getUIState();
      if (!t && !this._storageController.hasCustomServer()) return e.forceLanguage || (e.language = null, e.isLanguageSupported = !0), this._resetEditor(e), e.isTextTooLong = !0, e.checkDebounce.cancelCall(), !0
    }
    return !e.forceLanguage && isTextsCompletelyDifferent(e.checkedText.originalText, i) && (e.language = null, e.isLanguageSupported = !0), e.isLanguageSupported || (e.isLanguageSupported = !0, e.forceLanguage || (e.language = null)), e.isChecking = !0, e.isTextTooShort = !1, e.isTextTooLong = !1, e.checkDebounce.call(e, i, o), r || e.checkDebounce.callImmediately(), !1
  }

  _sendCheckRequest(e, t, r) {
    return __awaiter(this, void 0, void 0, (function* () {
      const i = e.inputAreaTweaks.getReplacedParts(t), o = getValuableText(t, i);
      if (o.text === e.checkedText.text) return void this._onCheckAborted(e, e.checkedText, o);
      const n = LTAssistant._getChangedParagraphs(e.checkedText.text, o.text), s = getCurrentUrl(),
        a = yield e.inputAreaTweaks.getRecipientInfo(), d = e.inputAreaTweaks.shouldUseParagraphLevelCaching(e), l = {
          instanceId: e.id,
          pageUrl: s,
          checkLevel: e.checkLevel,
          elementLanguage: e.inputArea instanceof HTMLElement ? e.inputArea.lang : "",
          recipientInfo: a,
          ignoreCapitalizationErrorsAtLineStart: !isFormElement(e.inputArea),
          useParagraphLevelCaching: d
        }, c = e.inputAreaTweaks.getCheckOptions(e, t), g = Date.now();
      try {
        const t = yield EnvironmentAdapter.check(e, o.text, n, l, c, r);
        if (!t) return;
        t.isSuccessful ? this._onCheckCompleted(t, o, g) : this._onCheckFailed(t)
      } catch (t) {
        e.isChecking = !1, console.error(t), Tracker.trackError("message", t.message, "CHECK_TEXT"), t.message && isExtensionRuntimeError(t.message) ? this._handleUnhealthyExtensionRuntime() : (e.checkError = {
          reason: "UnknownError",
          status: 0
        }, this._updateState(e))
      }
    }))
  }

  _onCheckCompleted(e, t, r) {
    const i = this._editors.find((t => t.id === e.instanceId));
    if (!i) return;
    if (!i.isAutoCheckEnabled) return;
    if (r < i.lastCheckTimestamp) return;
    const o = i.needsLanguageHintFromUser;
    if (i.checkError = null, i.isChecking = !1, i.lastCheckTimestamp = r, e.isUnsupportedLanguage) return this._resetEditor(i), this._endTypingMode(i), i.language = null, i.isLanguageSupported = !1, i.checkedText = t, this._highlight(i), void this._updateState(i);
    if (e.language && !i.language && (i.language = e.language), t.originalText.length > config.MIN_TEXT_LENGTH && (i.tracking.languageCode = e.language ? e.language.code : null, i.tracking.hasEnoughText = !0), i.tracking.maxTextLength = Math.max(t.originalText.length, i.tracking.maxTextLength), e.language && i.dialog && i.dialog.setCurrentLanguage(e.language.code), e.language && e.language.code.toLowerCase() !== i.language.code.toLowerCase()) return this._resetEditor(i), i.language = e.language, this._checkEditor(i), this._highlight(i), void this._updateState(i);
    let {
      errors: n,
      pickyErrors: s,
      premiumErrors: a,
      premiumPickyErrors: d,
      sentenceRanges: l
    } = ErrorProcessor.merge({
      existing: {
        errors: i.errors,
        pickyErrors: i.pickyErrors,
        premiumErrors: i.premiumErrors,
        premiumPickyErrors: i.premiumPickyErrors,
        sentenceRanges: i.sentenceRanges
      },
      new: {
        textLevel: {
          errors: e.textLevelErrors,
          pickyErrors: e.textLevelPickyErrors,
          premiumErrors: e.textLevelPremiumErrors,
          premiumPickyErrors: e.textLevelPremiumPickyErrors
        },
        paragraphLevel: {
          errors: e.paragraphLevelErrors,
          pickyErrors: e.paragraphLevelPickyErrors,
          premiumErrors: e.paragraphLevelPremiumErrors,
          premiumPickyErrors: e.paragraphLevelPremiumPickyErrors,
          sentenceRanges: e.paragraphLevelSentenceRanges
        }
      },
      existingCheckedText: i.checkedText,
      newCheckedText: t
    }, i.makePickyPremium && !this._storageController.getUIState().hasPaidSubscription);
    i.checkedText = t, i.errors = n, i.pickyErrors = s, i.premiumErrors = a, i.premiumPickyErrors = d, i.isIncompleteResult = e.isIncompleteResult, i.needsLanguageHintFromUser = !1 === i.forceLanguage && this._needsLanguageHintFromUser(n, t.text), i.sentenceRanges = l, n = ErrorProcessor.migrateErrorsToValuableText(n, t.usedParts);
    const c = i.inputAreaWrapper.getText(), g = i.inputAreaTweaks.getReplacedParts(c), h = getValuableText(c, g);
    n = ErrorProcessor.migrateErrorsBetweenTexts(n, t.text, h.text), n = ErrorProcessor.migrateErrorsToOriginalText(n, h.usedParts), this._updateDisplayedErrors(i, h, n, a), 0 === i.pendingErrors.length && this._endTypingMode(i);
    const u = !1 === o && !0 === i.needsLanguageHintFromUser, p = !0 === o && !1 === i.needsLanguageHintFromUser;
    u ? i.highlighter.disableHighlighting() : p && i.highlighter.enableHighlighting(), this._highlight(i), this._updateState(i)
  }

  _needsLanguageHintFromUser(e, t) {
    if ("extension" !== EnvironmentAdapter.getType()) return !1;
    const r = e.filter((e => {
      if (e.isSpellingError) {
        const t = e.originalPhrase.toLowerCase();
        if (e.fixes.some((e => t === e.value.toLowerCase()))) return !1;
        const r = removeDiacritics(e.originalPhrase.toLowerCase());
        return !e.fixes.some((e => r === removeDiacritics(e.value.toLowerCase())))
      }
      return !1
    }));
    if (r.length < 3 || t.length > config.SHORT_TEXT_MAX_LENGTH) return !1;
    return r.reduce(((e, {length: t}) => e + t), 0) / t.length > .4
  }

  _onCheckAborted(e, t, r) {
    e.isChecking = !1, e.pendingErrors = [], this._endTypingMode(e), e.errors = ErrorProcessor.migrateErrorsBetweenSameOriginalTexts(e.errors, t, r), e.pickyErrors = ErrorProcessor.migrateErrorsBetweenSameOriginalTexts(e.pickyErrors, t, r), e.premiumErrors = ErrorProcessor.migrateErrorsBetweenSameOriginalTexts(e.premiumErrors, t, r), e.checkedText = r, e.lastCheckTimestamp = Date.now(), this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e)
  }

  _onCheckFailed(e) {
    const t = this._editors.find((t => t.id === e.instanceId));
    t && (this._resetEditor(t), t.checkError = e.error, e && e.error && e.error.response && void 0 !== e.error.status ? e.error.response.includes("too many errors") ? Tracker.trackError("http", `${e.error.status}: Too many errors`) : e.error.response.includes("Client request limit") ? Tracker.trackError("http", `${e.error.status}: Client Request Limit`) : e.error.response.includes("Client request size limit") ? Tracker.trackError("http", `${e.error.status}: Client Request Size Limit`) : e.error.response.includes("oo many recent timeouts") ? Tracker.trackError("http", `${e.error.status}: Too Many Recent Timeouts`) : e.error.response.match(/(application|page|site|request) blocked/i) || e.error.response.match(/has been blocked|cannot be accessed/) || e.error.response.match(/blocked by parental control/i) ? Tracker.trackError("http", `${e.error.status}: Application blocked by proxy`) : Tracker.trackError("http", `${e.error.status}: ${e.error.response}`) : Tracker.trackError("http", "unknown"), this._highlight(t), this._updateState(t))
  }

  _startTypingMode(e) {
    e.isUserTyping = !0, window.clearTimeout(e.typingTimeoutId), e.typingTimeoutId = window.setTimeout((() => this._endTypingModeAndUpdateState(e)), config.STOPPED_TYPING_TIMEOUT)
  }

  _endTypingModeAndUpdateState(e) {
    this._endTypingMode(e);
    const t = e.inputAreaWrapper.getText(), r = e.inputAreaTweaks.getReplacedParts(t), i = getValuableText(t, r),
      o = ErrorProcessor.migrateErrorsBetweenTexts(e.errors, e.checkedText.originalText, t),
      n = ErrorProcessor.migrateErrorsBetweenTexts(e.premiumErrors, e.checkedText.originalText, t);
    this._updateDisplayedErrors(e, i, o, n), this._highlight(e), this._updateState(e)
  }

  _endTypingMode(e) {
    e.isUserTyping = !1, window.clearTimeout(e.typingTimeoutId)
  }

  _updateDisplayedErrors(e, t = e.checkedText, r = e.errors, i = e.premiumErrors) {
    r = (r = e.inputAreaTweaks.filterErrors(e, t, r)).filter(((t, i) => {
      if (["DOUBLES_ESPACES", "DOPPELTES_LEERZEICHEN", "CONSECUTIVE_SPACES", "DOBLE_ESPACIO"].includes(t.rule.id)) return 2 === t.length && t.originalPhrase.length === t.length && (isFormElement(e.inputArea) || isGoogleDocsCanvas(e.inputArea) || /^(\u00A0 | \u00A0)$/.test(t.originalPhrase));
      if (["COMMA_PARENTHESIS_WHITESPACE"].includes(t.rule.id)) return t.originalPhrase.length === t.length;
      if ("UNPAIRED_BRACKETS" === t.rule.id) {
        const e = r[i + 1], o = r[i - 1];
        if (e && 0 === t.fixes.length && "„" === t.originalPhrase && ["UNPAIRED_BRACKETS", "FALSCHES_ANFUEHRUNGSZEICHEN"].includes(e.rule.id) && "”" === e.originalPhrase) return !1;
        if (e && 0 === t.fixes.length && "„" === t.originalPhrase && ["UNPAIRED_BRACKETS", "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN", "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN_CH"].includes(e.rule.id) && '"' === e.originalPhrase) return !1;
        if (o && 0 === t.fixes.length && "“" === t.originalPhrase && ["UNPAIRED_BRACKETS", "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN", "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN_CH"].includes(o.rule.id) && '"' === o.originalPhrase) return !1
      }
      return !0
    })), e.showHiddenMatchesInplace && (r = r.concat(i), ErrorProcessor.sortErrorsByOffset(r));
    let {ignoredRules: o} = this._storageController.getSettings();
    const n = e.inputAreaWrapper.getSelection(), s = e.displayedErrors;
    e.displayedErrors = [], e.pendingErrors = [], e.displayedPremiumErrors = [];
    for (const t of r) {
      if (!(isErrorIgnoredByDictionary(t, e.ignoredWords) || isErrorRuleIgnored(t, o) || isErrorRuleIgnored(t, e.ignoredRules))) {
        if (e.isUserTyping && (LTAssistant._isPendingError(t, e.checkedText.originalText) || LTAssistant._isErrorSelected(t, n))) {
          if (!s.some((e => e.start === t.start && e.end === t.end || e.id === t.id && e.originalPhrase === t.originalPhrase))) {
            e.pendingErrors.push(t);
            continue
          }
        }
        e.displayedErrors.push(t)
      }
    }
    if (e.displayedPremiumErrors = [...i], null !== e.selectErrorAfter) {
      const t = this._getErrorAfter(e, e.selectErrorAfter);
      e.selectErrorAfter = null, null !== t && this._scrollToError(e, t, "auto", !0, !0)
    }
  }

  _flashHighlight(e) {
    e.editor.flashHighlight = {
      id: "FLASH",
      offset: e.offset,
      length: e.length,
      isEmphasized: !0,
      backgroundColor: e.color,
      isUnderlined: !1,
      underlineColor: ""
    }, this._highlight(e.editor, !0), window.setTimeout((() => {
      e.editor.flashHighlight = null, this._highlight(e.editor)
    }), e.duration)
  }

  _highlight(e, t = !1) {
    const r = e.displayedErrors.map((t => {
      let r = config.COLORS.GRAMMAR.UNDERLINE, i = config.COLORS.GRAMMAR.BACKGROUND,
        o = config.COLORS.GRAMMAR.EMPHASIZE;
      return "HIDDEN_RULE" === t.rule.id && "test2" === e.showHiddenMatchesInplace ? (r = config.COLORS.HIDDEN_MATCH.UNDERLINE, i = config.COLORS.HIDDEN_MATCH.BACKGROUND, o = config.COLORS.HIDDEN_MATCH.EMPHASIZE) : t.rule.id.startsWith("TOO_LONG_SENTENCE") ? (r = config.COLORS.LONG_SENTENCE.UNDERLINE, i = config.COLORS.LONG_SENTENCE.BACKGROUND, o = config.COLORS.LONG_SENTENCE.EMPHASIZE) : t.isSpellingError ? (r = config.COLORS.SPELLING.UNDERLINE, i = config.COLORS.SPELLING.BACKGROUND, o = config.COLORS.SPELLING.EMPHASIZE) : (t.isStyleError || t.isCustomError) && (r = config.COLORS.STYLE.UNDERLINE, i = config.COLORS.STYLE.BACKGROUND, o = config.COLORS.STYLE.EMPHASIZE), {
        id: t.id,
        offset: t.start,
        length: t.length,
        isEmphasized: t.id === e.selectedErrorId || !!this._options.emphasizeErrors,
        backgroundColor: t.id === e.selectedErrorId ? i : o,
        isUnderlined: !0,
        underlineColor: r
      }
    }));
    if (e.rephraseCard) {
      const t = e.rephraseCard.selection, i = e.rephraseCard.underlineColor, o = e.rephraseCard.backgroundColor;
      r.push({
        id: RephraseCard.BLOCK_ID,
        offset: t.start,
        length: t.end - t.start,
        isEmphasized: "" !== o,
        isUnderlined: !1,
        simulateSelection: !0,
        backgroundColor: o,
        underlineColor: i
      })
    }
    e.flashHighlight && r.push(e.flashHighlight), e.highlighter.highlight(r, t)
  }

  _enableEditor(e) {
    e.isAutoCheckEnabled = !0, this._disableOtherSpellCheckers(e.inputArea), e.inputAreaWrapper.resetText(), this._resetEditor(e), this._checkEditor(e), this._updateState(e)
  }

  _disableEditor(e) {
    e.isAutoCheckEnabled = !1, this._enableOtherSpellCheckers(e.inputArea), e.inputAreaWrapper.resetText(), this._resetEditor(e), this._endTypingMode(e), this._highlight(e), this._updateState(e)
  }

  _trackEditor(e) {
    (EnvironmentAdapter.isRuntimeConnected() || e.tracking.hasTracked) && (e.tracking.hasTracked = !0, Math.random() < .1 && e.tracking.hasEnoughText && EnvironmentAdapter.trackEvent(`saw_premium_icon_10perc:${e.tracking.sawPremiumIcon}`, e.tracking.languageCode), Math.random() < .01 && EnvironmentAdapter.trackTextLength(e.tracking.maxTextLength))
  }

  _destroyEditor(e) {
    const t = this._editors.indexOf(e);
    if (-1 === t) return;
    this._editors.splice(t, 1), e.inputAreaWrapper.destroy(), e.highlighter.destroy(), e.inputAreaTweaks.destroy(), e.toolbar && e.toolbar.destroy(), window.clearTimeout(e.typingTimeoutId), e.mirror && e.mirror.destroy(), e.errorCard && e.errorCard.destroy(), e.rephraseCard && e.rephraseCard.destroy(), e.dialog && e.dialog.destroy();
    const r = this._initElementTimeouts.get(e.inputArea);
    r && (this._initElementTimeouts.delete(e.inputArea), clearTimeout(r)), this._enableOtherSpellCheckers(e.inputArea), this._savePremiumErrorCount(e), this._trackEditor(e)
  }

  _getErrorAfter(e, t) {
    let r = null;
    const i = e.displayedErrors.concat(e.displayedPremiumErrors);
    ErrorProcessor.sortErrorsByOffset(i);
    for (const e of i) e.start <= t || (null === r || e.start < r.start) && (r = e);
    return null === r && i.length > 0 && (r = i[0]), r
  }

  _showErrorCard(e, t, r, i = !1) {
    const o = this._storageController.getManagedSettings(),
      n = void 0 !== this._options.disableRuleIgnore ? this._options.disableRuleIgnore : o.disableIgnoredRules,
      s = void 0 !== this._options.disableDictionaryAdd ? this._options.disableDictionaryAdd : o.disablePersonalDictionary,
      a = e.inputAreaTweaks.getErrorCardTweaks(), d = {
        disableIgnoringRule: n,
        disableAddingWord: s,
        isPremiumAccount: this._storageController.getUIState().hasPaidSubscription,
        geoIpCountry: this._storageController.getSettings().geoIpCountry,
        showFooter: !this._options.disablePremiumTeaser,
        showHiddenMatchesInplace: e.showHiddenMatchesInplace,
        enableKeyboard: i,
        canCorrectMultipleAtOnce: e.inputAreaTweaks.canCorrectMultipleErrorsAtOnce(e) && containsSimilarErrors(e.displayedErrors, t)
      };
    e.errorCard = new ErrorCard(e.inputArea, r, t, a, d)
    this._fadeAllDialogs();
    const l = LanguageManager.getPrimaryLanguageCode(t.language.code);
    t.isSpellingError ? Math.random() < .1 && Tracker.trackEvent("Action", `${l}:open_spell_suggestion:10perc`, t.rule.id) : Tracker.trackEvent("Action", `${l}:open_rule`, t.rule.id), t.language.code.startsWith("de") && t.fixes.length && t.fixes[0].value.match(/\(.+\)/) && !["HALLE_STADT", "EINHEITEN_METRISCH", "NEUKIRCHEN_STADT", "UG_HAFTUNGSBESCHRÄNKT"].includes(t.rule.id) && Tracker.trackError("other", "broken_fix", l + ":" + t.rule.id + ": " + t.contextPhrase)
  }

  _hideAllErrorCards() {
    this._editors.forEach((e => {
      var t;
      e.errorCard && e.errorCard.destroy(), null === (t = e.dialog) || void 0 === t || t.fadeIn()
    }))
  }

  _showRephraseCard(e, t, r, i = !1) {
    EnvironmentAdapter.isRuntimeConnected() && waitFor((() => e.language ? e.language.code : e.isTextTooShort ? LanguageManager.getUserLanguageCodes()[0] || "en" : e.errors[0] ? e.errors[0].language.code : void 0)).then((o => {
      const {
        username: n,
        motherTongue: s,
        geoIpCountry: a,
        preferredLanguages: d,
        dpaLevel: l,
        confirmedGPT3: c
      } = this._storageController.getSettings();
      e.rephraseCard = new RephraseCard(this._storageController.getUniqueId(), e.inputArea, e.inputAreaWrapper.getText(), e.sentenceRanges, t, r, o, s, d, l, c, hasGrammarMistakes(e), hasSpellingMistakes(e), {
        hasSubscription: this._storageController.getUIState().hasPaidSubscription,
        showHeader: !this._options.disablePremiumTeaser,
        email: n,
        geoIpCountry: a,
        enableKeyboard: i
      }, e.inputAreaTweaks.getErrorCardTweaks(), (e => {
        this._storageController.updateSettings({confirmedGPT3: e})
      })), Tracker.trackEvent("Action", "synonyms:open")
    })).catch((e => {
      Tracker.trackEvent("Other-Error", "synonyms:no_language", e && e.message)
    }))
  }

  _hideAllRephraseCards() {
    this._editors.forEach((e => {
      var t;
      e.rephraseCard && (e.rephraseCard.destroy(), this._highlight(e)), null === (t = e.dialog) || void 0 === t || t.fadeIn()
    }))
  }

  _hideAllMessagePopups() {
    this._messages.forEach((e => {
      e && e.destroy()
    }))
  }

  _showDialog(e) {
    if (!e.toolbar) return;
    const t = e.language && e.language.code, r = new TextStatistics(e.checkedText.originalText),
      i = (new TextScore).calculateTextScore(r.getAllWords().length, e.errors, e.premiumErrors, e.pickyErrors), o = {
        checkStatus: e.checkStatus,
        displayedErrors: e.displayedErrors,
        errors: e.errors,
        pickyErrors: e.pickyErrors,
        displayedPremiumErrors: e.displayedPremiumErrors,
        isIncompleteResult: e.isIncompleteResult,
        ignoredErrorsStats: this._getIgnoredErrorsStats(e.errors),
        checkErrorMessage: e.checkError ? this._getCheckErrorMessage(e.checkError) : "",
        textScore: i,
        countOptions: this._getCountOptions(e.checkedText.originalText, e.countMode),
        isPickyModeEnabled: "picky" === e.checkLevel
      }, n = this._storageController.getManagedSettings(),
      s = void 0 !== this._options.disableRuleIgnore ? this._options.disableRuleIgnore : n.disableIgnoredRules,
      a = void 0 !== this._options.disableDictionaryAdd ? this._options.disableDictionaryAdd : n.disablePersonalDictionary,
      d = {
        disableOptionsPage: !EnvironmentAdapter.isOptionsPageSupported(),
        disableSaveDocument: !0,
        disableTurnOff: !1,
        disableFeedbackForm: !EnvironmentAdapter.isFeedbackFormSupported(),
        disableHelpCenter: !1,
        disableRatingTeaser: this._storageController.getUIState().hasRated || this._storageController.canStartChangelogCoupon() || this._storageController.isChangelogCouponRunning(),
        disableIgnoringRule: s,
        disableAddingWord: a,
        dialogPosition: this._storageController.getUIState().dialogPosition,
        isPremiumAccount: this._storageController.getUIState().hasPaidSubscription,
        canCorrectMultipleErrorsAtOnce: e.inputAreaTweaks.canCorrectMultipleErrorsAtOnce(e)
      };
    e.dialog = new Dialog(e.toolbar.getContainer(), e.inputAreaTweaks.getDialogAppearance(), t, o, d)
  }

  _hideAllDialogs(e = !1) {
    this._editors.forEach((t => {
      if (!t.dialog) return;
      t.dialog.setApplyFixMode(!1), t.dialog.closeAllMenus();
      "default" !== t.dialog.getCurrentPosition() && EnvironmentAdapter.isRuntimeConnected() && !e || t.dialog.destroy()
    }))
  }

  _fadeAllDialogs() {
    this._editors.forEach((e => {
      e.dialog && e.dialog.fadeOut()
    }))
  }

  _savePremiumErrorCount(e) {
    if (!e.displayedHiddenErrorCount || !EnvironmentAdapter.isRuntimeConnected()) return;
    const t = (new Date).toDateString(), {hiddenErrors: r} = this._storageController.getStatistics();
    r[0] && r[0].day === t ? r[0].count += e.displayedHiddenErrorCount : r.unshift({
      day: t,
      count: e.displayedHiddenErrorCount
    }), r.length = Math.min(r.length, 62), this._storageController.updateStatistics({hiddenErrors: r})
  }

  _getIgnoredErrorsStats(e) {
    const {ignoredRules: t} = this._storageController.getSettings(), r = Dictionary.get(), i = [], o = [];
    return e.forEach((e => {
      e.isSpellingError && isErrorIgnoredByDictionary(e, r) && !i.includes(e.originalPhrase) && i.push(e.originalPhrase), e.isSpellingError || !isErrorRuleIgnored(e, t) || o.includes(e.rule.id) || o.push(e.rule.id)
    })), {byDictionary: i.length, byRules: o.length}
  }

  _handleUnhealthyExtensionRuntime() {
    this._isConnected = !1, this._hideAllErrorCards(), this._editors.forEach((e => {
      e.highlighter && e.highlighter.destroy(), this._updateState(e)
    })), window.clearInterval(this._checkExtensionRuntimeHealthIntervalId)
  }

  destroy() {
    Array.from(this._editors).forEach((e => this._destroyEditor(e))), this._spellcheckingAttributesData.forEach(((e, t) => this._enableOtherSpellCheckers(t))), this._tweaks && document.removeEventListener(this._tweaks.getClickEvent(), this._onDocumentClick, !0), document.removeEventListener("focus", this._onDocumentFocus, !0), document.removeEventListener("mousemove", this._onDocumentMousemove, !0), document.removeEventListener("focusout", this._onDocumentFocusout, !0), window.frameElement && window.frameElement.ownerDocument && window.frameElement.ownerDocument.removeEventListener("click", this._onDocumentClick, !0), document.removeEventListener(InputAreaWrapper.eventNames.scroll, this._onInputScroll), document.removeEventListener(InputAreaWrapper.eventNames.paste, this._onInputPaste), document.removeEventListener(InputAreaWrapper.eventNames.textChanged, this._onInputTextChanged), document.removeEventListener(InputAreaWrapper.eventNames.dblclick, this._onInputDblClick), document.removeEventListener(InputAreaWrapper.eventNames.dblPress, this._onInputDblPress), document.removeEventListener(Highlighter.eventNames.blockClicked, this._onHiglighterBlockClicked), document.removeEventListener(Toolbar.eventNames.permissionRequiredIconClicked, this._onToolbarPermissionRequiredIconClicked), document.removeEventListener(Toolbar.eventNames.toggleDialog, this._onToolbarToggleDialog), document.removeEventListener(Toolbar.eventNames.notifyAboutPremiumIcon, this._onToolbarNotifyAboutPremiumIcon), document.removeEventListener(Dialog.eventNames.enableHere, this._onDialogEnableHere), document.removeEventListener(Dialog.eventNames.positionChangeClicked, this._onPositionChangeClicked), document.removeEventListener(Dialog.eventNames.togglePickyMode, this._onPickyModeToggle), document.removeEventListener(Dialog.eventNames.enableEverywhere, this._onDialogEnableEverywhere), document.removeEventListener(Dialog.eventNames.languageChanged, this._onDialogLanguageChanged), document.removeEventListener(Dialog.eventNames.countChanged, this._onDialogCountChanged), document.removeEventListener(Dialog.eventNames.errorSelected, this._onDialogErrorSelected), document.removeEventListener(Dialog.eventNames.errorHighlighted, this._onDialogErrorHighlighted), document.removeEventListener(Dialog.eventNames.addToDictionaryClicked, this._onAddToDictionary), document.removeEventListener(Dialog.eventNames.ignoreRuleClicked, this._onIgnoreRule), document.removeEventListener(Dialog.eventNames.temporarilyIgnoreWordClicked, this._onTemporarilyIgnoreWord), document.removeEventListener(Dialog.eventNames.temporarilyIgnoreRuleClicked, this._onTemporarilyIgnoreRule), document.removeEventListener(Dialog.eventNames.moreDetailsClicked, this._onMoreDetailsClicked), document.removeEventListener(Dialog.eventNames.fixSelected, this._onFixSelected), document.removeEventListener(Dialog.eventNames.openOptions, this._onDialogOpenOptions), document.removeEventListener(Dialog.eventNames.showFeedbackForm, this._onDialogShowFeedbackForm), document.removeEventListener(Dialog.eventNames.destroyed, this._onDialogDestroyed), document.removeEventListener(Dialog.eventNames.badgeClicked, this._onBadgeClicked), document.removeEventListener(Dialog.eventNames.turnOff, this._onTurnOffClicked), document.removeEventListener(Dialog.eventNames.pauseChecking, this._onPauseCheckingClicked), document.removeEventListener(Dialog.eventNames.premiumTeaserClicked, this._onDialogPremiumTeaserClicked), document.removeEventListener(Dialog.eventNames.correctAll, this._onCorrectAll), document.removeEventListener(ErrorCard.eventNames.addToDictionaryClicked, this._onAddToDictionary), document.removeEventListener(ErrorCard.eventNames.ignoreRuleClicked, this._onIgnoreRule), document.removeEventListener(ErrorCard.eventNames.temporarilyIgnoreWordClicked, this._onTemporarilyIgnoreWord), document.removeEventListener(ErrorCard.eventNames.temporarilyIgnoreRuleClicked, this._onTemporarilyIgnoreRule), document.removeEventListener(ErrorCard.eventNames.moreDetailsClicked, this._onMoreDetailsClicked), document.removeEventListener(ErrorCard.eventNames.fixSelected, this._onFixSelected), document.removeEventListener(ErrorCard.eventNames.badgeClicked, this._onBadgeClicked), document.removeEventListener(ErrorCard.eventNames.logoClicked, this._onErrorCardLogoClicked), document.removeEventListener(ErrorCard.eventNames.languageChanged, this._onErrorCardLanguageChanged), document.removeEventListener(ErrorCard.eventNames.turnOffPickyModeClicked, this._onErrorCardPickyModeTurnedOff), document.removeEventListener(ErrorCard.eventNames.premiumTeaserClicked, this._onErrorCardPremiumTeaserClicked), document.removeEventListener(ErrorCard.eventNames.destroyed, this._onErrorCardDestroyed), document.removeEventListener(ErrorCard.eventNames.correctAll, this._onCorrectAll), document.removeEventListener(RephraseCard.eventNames.synonymSelected, this._onSynonymSelected), document.removeEventListener(RephraseCard.eventNames.phraseSelected, this._onPhraseSelected), document.removeEventListener(RephraseCard.eventNames.logoClicked, this._onRephraseCardLogoClicked), document.removeEventListener(RephraseCard.eventNames.destroyed, this._onRephraseCardDestroyed), document.removeEventListener(RephraseCard.eventNames.highlight, this._onRephraseCardHighlight), document.removeEventListener(MessagePopup.eventNames.destroyed, this._onMessagePopupDestroyed), document.removeEventListener(MessagePopup.eventNames.turnOn, this._onTurnOnClicked), document.removeEventListener(LTAssistant.events.DESTROY, this._onDestroy), window.removeEventListener("pageshow", this._onPageLoaded), window.removeEventListener("pagehide", this._onPageHide), this._storageController && this._storageController.destroy(), this._tweaks && this._tweaks.destroy(), window.clearInterval(this._checkExtensionRuntimeHealthIntervalId), window.clearInterval(this._fixTinyMCEIntervalId), this._editors.forEach((e => {
      e.checkDebounce.cancelCall()
    })), this._options && this._options.onDestroy && this._options.onDestroy()
  }

  _scrollToError(e, t, r, i, o) {
    let n = "nearest", s = !1, a = !1;
    if ("string" == typeof r && (n = r), "boolean" == typeof i && (s = i), "boolean" == typeof o && (a = o), this._hideAllDialogs(), "auto" === n) {
      const t = e.inputArea.ownerDocument.documentElement.clientHeight;
      n = t < 400 ? "nearest" : "center"
    }
    return new Promise((r => {
      e.inputAreaWrapper.scrollToText(t.start, t.length, "smooth", n, (() => {
        e.selectedErrorId = t.id, this._highlight(e, !0);
        const i = e.inputAreaWrapper.getTextBoxes(t.start, t.length);
        s && i.length && this._showErrorCard(e, t, i[0], a), r(i)
      }))
    }))
  }

  _unselectError(e) {
    null !== e.selectedErrorId && (e.selectedErrorId = null, this._highlight(e))
  }

  _addToDictionary(e, t) {
    let r = !1;
    this._options.onDictionaryAdd && (r = this._options.onDictionaryAdd(t, e.inputArea)), e.callbacks.onDictionaryAdd && (r = e.callbacks.onDictionaryAdd(t)), r || Dictionary.add(t)
  }

  _temporarilyIgnoreWord(e, t) {
    const r = e.groupId;
    if (this._tweaks.persistTemporarySettings()) {
      const e = `ignored:${r}`, i = LocalStorageWrapper.get(e) || {words: [], rules: []};
      i.words.push(t), LocalStorageWrapper.set(e, i)
    }
    const i = this._editors.filter((e => e.groupId === r));
    i.forEach((e => {
      e.ignoredWords.push(t), this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e)
    }))
  }

  _temporarilyIgnoreRule(e, t) {
    e.ignoredRules.push(t), this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e)
  }

  _clearTemporarilyIgnoredRules(e) {
    e.ignoredRules = [], this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e)
  }

  _clearWords(e) {
    e.ignoredWords = [], this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e)
  }

  _applyFix(e, t, r, i = !1) {
    const o = t.fixes[r].value, n = {offset: t.start, length: t.length, replacementText: o, editor: e};
    e.callbacks.onBeforeErrorCorrect && e.callbacks.onBeforeErrorCorrect(t);
    const s = e.inputAreaTweaks.applyFix(n);
    return i || this._afterApplyFix(e), s
  }

  _afterApplyFix(e) {
    wait(300).then((() => this._checkEditor(e)));
    const {appliedSuggestions: t} = this._storageController.getStatistics();
    this._storageController.updateStatistics({appliedSuggestions: t + 1})
  }

  _openPremiumPage(e, t) {
    const r = e.displayedPremiumErrors.filter((e => !e.isStyleError && !e.isPunctuationError)).length,
      i = e.displayedPremiumErrors.filter((e => e.isPunctuationError)).length,
      o = e.displayedPremiumErrors.filter((e => e.isStyleError)).length, n = e.language && e.language.code || void 0;
    EnvironmentAdapter.openPremiumPage(t, r, o, i, "", n)
  }

  _onLogoClicked(e) {
    this._hideAllErrorCards(), this._hideAllRephraseCards();
    let t = `https://languagetool.org/?pk_campaign=addon2-${e}`;
    BrowserDetector.isSafari() && (t += "&hidePremium=true"), EnvironmentAdapter.openWindow(t), Tracker.trackEvent("Action", "check_trigger:logo:clicked", String(`premium:${this._storageController.getUIState().hasPaidSubscription}`))
  }

  _correctMultipleErrors(e, t, r) {
    let i = !1;
    const o = e => {
      e.isTrusted && !i && (i = !0, n())
    }, n = () => {
      e.inputArea.removeEventListener("keydown", o), this._afterApplyFix(e)
    };
    e.inputArea.addEventListener("keydown", o);
    const s = (o = !1) => {
      if (i) return;
      const a = t.shift();
      if (!a) return this._afterApplyFix(e), void n();
      let d = Promise.resolve();
      o || (d = d.then((() => wait(150))).then((() => i ? Promise.reject() : this._scrollToError(e, a, "center")))), d = d.then((() => {
        if (i) return Promise.reject();
        const t = a.fixes.findIndex((e => r.suggestion.match.test(e.value)));
        return -1 === t ? Promise.resolve() : this._applyFix(e, a, t, !0)
      })).then((() => s())).catch((() => n()))
    };
    s(!0)
  }
}

LTAssistant.events = {
  UPDATE: "_lt-state-updated",
  DESTROY: "_lt-destroy"
}, LTAssistant.PUNCTIUATION_CHAR_REGEXP = /^[.!?]$/, LTAssistant.COMPLETED_SENTENCE_REGEXP = /^[^\n]*?[.!?]($|\s)/, LTAssistant.NO_LETTERS_REGEXP = /^[0-9,\.\-\:\;\+\*\/\\\%#\=\_]+$/, LTAssistant.TMP_ID_ATTRIBUTE_NAME = "data-lt-tmp-id";