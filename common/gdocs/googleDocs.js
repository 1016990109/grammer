class GoogleDocs {
  static init() {
    this._isMainGoogleDocsFrame() && document.documentElement.hasAttribute("data-lt-ready") && (this._storageController = StorageController.create(), this._interval = window.setInterval((() => {
      this._checkForNewPage(), this._checkMode(), this._checkOutOfViewPages(), this._toggleMenubarButton()
    }), 750), this._storageController.addEventListener(StorageControllerClass.eventNames.settingsChanged, (t => {
      (t.disabledEditorGroups || t.disabledDomains) && (this._toggleMenubarButton(!!t.disabledEditorGroups), this._toggleDisabledIndicator(), GoogleDocsCanvas.triggerRedraw())
    })), document.addEventListener("lt-strikethroughchange", this._onStrikethroughChange), this._storageController.onReady((() => {
      this._toggleDisabledIndicator(), GoogleDocsCanvas.triggerRedraw()
    })), dispatchCustomEvent(document, "lt-gdocs-init"))
  }

  static getStrikethroughs(t) {
    return GoogleDocs._strikethroughPointsMap.get(t) || []
  }

  static getAdapterType() {
    return this._cachedRenderType || (document.querySelector(".kix-canvas-tile-content") ? this._cachedRenderType = "canvas" : document.querySelector(".kix-page") && (this._cachedRenderType = "html")), this._cachedRenderType
  }

  static getDocId(t) {
    const e = t.match(this.DOC_ID_REG_EXP);
    return e ? e[1] : null
  }

  static _isMainGoogleDocsFrame() {
    return window.innerWidth >= 400 && window.innerHeight > 250
  }

  static _isInView(t) {
    const e = t.getBoundingClientRect();
    return e.bottom > -1e3 && e.top < window.innerHeight + 2e3
  }

  static _isInPageLessMode() {
    return !document.querySelector(".docs-ruler-face-first-division")
  }

  static _checkForNewPage() {
    // if ("view" === this._getMode()) return;
    this._getUnhandledPages().forEach((t => {
      this._isInView(t) && this._onPageInViewCallbacks.forEach((e => e(t)))
    }))
  }

  static _getUnhandledPages() {
    const t = this.getAdapterType();
    return "canvas" === t ? GoogleDocsCanvas.getUnhandledPages() : "html" === t ? GoogleDocsHTML.getUnhandledPages() : []
  }

  static _checkOutOfViewPages() {
    this._onPageOutOfViewCallbacks.forEach(((t, e) => {
      this._isInView(e) || t(e)
    }))
  }

  static _getMode() {
    return document.querySelector("#docs-toolbar-mode-switcher .docs-icon-acl-comment-only, .docs-mode-switcher .docs-icon-acl-comment-only-green700, #docs-toolbar-mode-switcher.suggest-mode, #docs-toolbar-mode-switcher[data-tooltip*='Suggest'], #docs-toolbar-mode-switcher[data-tooltip*='Vorschlag']") ? "suggest" : document.querySelector("#docs-toolbar-mode-switcher .docs-icon-mode-edit, .docs-mode-switcher .docs-icon-mode-edit-blue700, #docs-toolbar-mode-switcher.edit-mode, #docs-toolbar-mode-switcher[data-tooltip*='Editing'], #docs-toolbar-mode-switcher[data-tooltip*='Bearbeitungs']") ? "edit" : "view"
  }

  static _checkMode() {
    const t = this._getMode();
    this._currentMode ? t !== this._currentMode && (this._currentMode = t, this._onModeChangeCallbacks.forEach(((e, o) => {
      e(t)
    }))) : this._currentMode = t
  }

  static _onInput(t, e = !1) {
    const o = this.getIframeWin();
    o && o.document && o.document.addEventListener("keydown", (e => {
      ["Control", "Shift", "Meta", "Alt"].includes(e.key) || t()
    }), {capture: !0, once: e})
  }

  static getIframeWin() {
    const t = document.querySelector(".docs-texteventtarget-iframe");
    return t && t.contentWindow || null
  }

  static _toggleMenubarButton(t = !1) {
    if (!this._storageController) return;
    const e = GoogleDocs.getDocId(location.href);
    if (!e) return;
    const o = getMainPageDomain(), n = this._storageController.getCheckSettings(o, e);
    this._insertMenubarButton(), n.isEditorGroupDisabled || n.isDomainDisabled ? this._unselectMenubarButton(t) : this._selectMenubarButton()
  }

  static _toggleDisabledIndicator() {
    if (!this._storageController) return;
    const t = GoogleDocs.getDocId(location.href);
    if (!t) return;
    const e = getMainPageDomain(), o = this._storageController.getCheckSettings(e, t);
    Array.from(document.querySelectorAll(this.DISABLED_INDICATOR_TAG_NAME), (t => t.remove())), (o.isEditorGroupDisabled || o.isDomainDisabled) && document.documentElement.appendChild(document.createElement(this.DISABLED_INDICATOR_TAG_NAME))
  }

  static _insertMenubarButton() {
    // 隐藏 menubar
    return
    if (this._menuBarButton) return;
    if (this._isInPageLessMode()) return;
    const t = document.querySelector("#clearFormattingButton");
    t && t.parentNode && (this._menuBarButton = document.createElement("div"), this._menuBarButton.className = "lt-gdocs-menubar-button goog-toolbar-button goog-toolbar-toggle-button goog-inline-block", this._menuBarButton.setAttribute("role", "button"), this._menuBarButton.setAttribute("aria-disabled", "false"), this._menuBarButton.setAttribute("aria-hidden", "false"), this._menuBarButton.id = "enableLTButton", this._menuBarButton.style.userSelect = "none", this._menuBarButton.addEventListener("click", (() => {
      const t = GoogleDocs.getDocId(location.href);
      t && this._storageController && (this._storageController.updateUIState({hasSeenGoogleDocsMenuBarHint: !0}), this._menuBarButton.classList.contains("goog-toolbar-button-checked") ? (this._storageController.disableEditorGroup(getMainPageDomain(), t), EnvironmentAdapter.ltAssistantStatusChanged({enabled: !1}), Tracker.trackEvent("Action", "toggle_gdocs", "off")) : (this._storageController.enableDomainAndEditorGroup(getMainPageDomain(), t), EnvironmentAdapter.ltAssistantStatusChanged({enabled: !0}), Tracker.trackEvent("Action", "toggle_gdocs", "on")))
    }), !0), this._menuBarSeparator = document.createElement("div"), this._menuBarSeparator.className = "docs-toolbar-small-separator goog-toolbar-separator goog-inline-block", this._menuBarSeparator.setAttribute("role", "separator"), this._menuBarSeparator.setAttribute("aria-disabled", "true"), this._menuBarSeparator.setAttribute("aria-hidden", "false"), this._menuBarSeparator.id = "enableLTSeparator", this._menuBarSeparator.style.userSelect = "none", t.parentNode.insertBefore(this._menuBarButton, t.nextSibling), t.parentNode.insertBefore(this._menuBarSeparator, t.nextSibling))
  }

  static _removeMenubarButton() {
    this._menuBarButton && (this._menuBarButton.remove(), this._menuBarButton = null), this._menuBarSeparator && (this._menuBarSeparator.remove(), this._menuBarSeparator = null)
  }

  static _selectMenubarButton() {
    this._menuBarButton && !this._menuBarButton.classList.contains("goog-toolbar-button-checked") && (this._menuBarButton.classList.add("goog-toolbar-button-checked"), this._menuBarButton.classList.add("lt-gdocs-toolbar-button-checked"), this._menuBarButton.setAttribute("aria-label", i18nManager.getMessage("googleDocsDisableButton")), this._menuBarButton.setAttribute("data-tooltip", i18nManager.getMessage("googleDocsDisableButton")))
  }

  static _unselectMenubarButton(t) {
    this._menuBarButton && this._menuBarButton.classList.contains("goog-toolbar-button-checked") && (this._menuBarButton.classList.remove("goog-toolbar-button-checked"), this._menuBarButton.classList.remove("lt-gdocs-toolbar-button-checked"), this._menuBarButton.setAttribute("aria-label", i18nManager.getMessage("googleDocsEnableButton")), this._menuBarButton.setAttribute("data-tooltip", i18nManager.getMessage("googleDocsEnableButton")), t && this._showMenuBarHint())
  }

  static _showMenuBarHint() {
    if (this._menuBarHint || !this._menuBarButton || !this._storageController) return;
    const {hasSeenGoogleDocsMenuBarHint: t} = this._storageController.getUIState();
    if (t) return;
    const e = this._menuBarButton.offsetHeight ? this._menuBarButton : document.querySelector("#moreButton");
    if (!e) return;
    const o = e.getBoundingClientRect();
    this._menuBarHint = document.createElement("div"), this._menuBarHint.classList.add("lt-gdocs-hint"), this._menuBarHint.style.top = o.bottom + "px", this._menuBarHint.style.right = window.innerWidth - o.right + "px", this._menuBarHint.textContent = i18nManager.getMessage("googleDocsEnableHint");
    const n = () => {
      var t;
      this._menuBarHint && (fadeOutAndRemove(this._menuBarHint), this._menuBarHint = null, null === (t = this._storageController) || void 0 === t || t.updateUIState({hasSeenGoogleDocsMenuBarHint: !0}))
    }, s = document.createElement("span");
    s.classList.add("lt-gdocs-hint__close"), s.addEventListener("click", (t => {
      t.stopImmediatePropagation(), n()
    }), !0), this._menuBarHint.appendChild(s), document.body.appendChild(this._menuBarHint), this._onInput((() => n()), !0)
  }

  static _onModeChange(t, e) {
    this._onModeChangeCallbacks.set(t, e)
  }

  static onPageDestroy(t, e) {
    this._onModeChange(t, (o => {
      "view" === o && e(t)
    })), this._onOutOfView(t, (() => {
      e(t)
    })), onElementRemoved(t, e)
  }

  static _onOutOfView(t, e) {
    this._onPageOutOfViewCallbacks.set(t, e)
  }

  static getToolbarPosition(t, e) {
    const o = e.getBorderBox(t);
    if (o.top > window.innerHeight) return null;
    if (this._kixContainer = this._kixContainer || document.getElementById("kix-appview"), !this._kixContainer) return null;
    const n = e.getBorderBox(this._kixContainer).top + 20, s = Math.round(Math.max(o.top + 30, n)),
      a = Math.round(o.left);
    return s + 50 > o.bottom ? null : {top: s + "px", left: a + "px", fixed: !0}
  }

  static getHighlighterZIndex(t) {
    return 750
  }

  static getToolbarZIndex(t) {
    return 751
  }

  static _showTeaser() {
    const t = Array.from(document.querySelectorAll(`.${this.TOOLBAR_CLASS_NAME}`));
    if (!t.length) return;
    const e = t.find((t => {
      const e = t.getBoundingClientRect();
      return e.top >= 0 && e.top < window.innerHeight && e.width > 0
    }));
    if (!e) return;
    const o = new Hint("", "google-docs", i18nManager.getMessage("googleDocsNewTeaserHeadline"), i18nManager.getMessage("googleDocsNewTeaserText"), "bottom-left", e),
      n = () => {
        o.getElement().remove(), o && o.getElement().classList.remove("lt-toolbar--hint-opened"), this._storageController && this._storageController.updateUIState({hasSeenNewGoogleDocsTeaser: !0})
      };
    o.getClose().addEventListener("click", (t => {
      t.stopImmediatePropagation(), t.preventDefault(), n()
    }), !0), e.classList.add("lt-toolbar--hint-opened"), e.addEventListener("mouseup", (t => {
      t.target instanceof HTMLElement && o.getElement().contains(t.target) || n()
    }), {capture: !0, once: !0}), this._onInput((() => n()), !0)
  }

  static initPage(t) {
    if (!EnvironmentAdapter.isRuntimeConnected()) return;
    document.documentElement.setAttribute("data-lt-site", "gdocs");
    const e = this.getAdapterType();
    "html" === e ? GoogleDocsHTML.initPage(t) : "canvas" === e && GoogleDocsCanvas.initPage(t), Math.random() < .01 && Tracker.trackEvent("Stat", "gdocs_rendering", e), this._pages.push(t);
    1 === this._pages.length && (this._initTimeout = window.setTimeout((() => {
      if (!this._storageController || !this._storageController.isReady()) return;
      const {hasSeenNewGoogleDocsTeaser: t} = this._storageController.getUIState();
      t || (this._showTeaser(), this._initTimeout = null)
    }), 800))
  }

  static destroyPage(t) {
    const e = this.getAdapterType();
    if ("html" === e) return GoogleDocsHTML.destroyPage(t);
    if ("canvas" === e) return GoogleDocsCanvas.getCanvases(t).forEach((t => this._strikethroughPointsMap.delete(t))), GoogleDocsCanvas.destroyPage(t);
    this._onModeChangeCallbacks.delete(t), this._onPageOutOfViewCallbacks.delete(t);
    const o = this._pages.indexOf(t);
    0 === o && null !== this._initTimeout && (window.clearTimeout(this._initTimeout), this._initTimeout = null), o > -1 && this._pages.splice(o, 1), this._pages.length || document.documentElement.removeAttribute("data-lt-site")
  }

  static isElementCompatible(t) {
    return !!document.documentElement.hasAttribute("data-lt-ready") && (GoogleDocsCanvas.isElementCompatible(t) || GoogleDocsHTML.isElementCompatible(t))
  }

  static getSelectedText() {
    const t = this.getAdapterType();
    return "html" === t ? GoogleDocsHTML.getSelectedText() : "canvas" === t && GoogleDocsCanvas.getSelectedText()
  }

  static getSelection(t) {
    const e = this.getAdapterType();
    return "html" === e ? GoogleDocsHTML.getSelection() : "canvas" === e && GoogleDocsCanvas.getSelection(t)
  }

  static isIgnoredElement(t) {
    const e = this.getAdapterType();
    return "html" === e ? GoogleDocsHTML.isIgnoredElement(t) : "canvas" === e && GoogleDocsCanvas.isIgnoredElement(t)
  }

  static isBlockElement(t, e) {
    const o = this.getAdapterType();
    return "html" === o ? GoogleDocsHTML.isBlockElement(t, e) : "canvas" === o && GoogleDocsCanvas.isBlockElement(t, e)
  }

  static replaceText(t, e, o) {
    const n = this.getAdapterType();
    return "html" === n ? GoogleDocsHTML.replaceText(t, e, o) : "canvas" === n ? GoogleDocsCanvas.replaceText(t, e, o) : t
  }

  static getReplacementText(t) {
    const e = this.getAdapterType();
    return "html" === e ? GoogleDocsHTML.getReplacementText(t) : "canvas" === e ? GoogleDocsCanvas.getReplacementText(t) : ""
  }

  static isPage(t) {
    const e = this.getAdapterType();
    return "html" === e ? GoogleDocsHTML.isPage(t) : "canvas" === e && GoogleDocsCanvas.isPage(t)
  }

  static onPage(t) {
    this._onPageInViewCallbacks.push((e => {
      t(e, !1)
    }))
  }

  static isMutationIgnored(t, e) {
    const o = this.getAdapterType();
    return "html" === o ? GoogleDocsHTML.isMutationIgnored(t, e) : "canvas" === o && GoogleDocsCanvas.isMutationIgnored(t, e)
  }

  static getTextBoxes(t, e, o, n) {
    return "canvas" === this.getAdapterType() ? GoogleDocsCanvas.getRelativeTextBoundingBoxes(e, o) : t.getRelativeTextBoundingBoxes(e, o, n)
  }

  static filterErrors(t, e) {
    let o = !1;
    const n = this.getAdapterType();
    return e
    return "html" === n ? o = !!GoogleDocsHTML.hasPreviousPage(t) : "canvas" === n && (o = !!GoogleDocsCanvas.hasPreviousPage(t)), e.filter((t => !this.DISABLED_RULES.includes(t.rule.id) && !t.rule.id.endsWith("UNPAIRED_BRACKETS") && (!(o && 0 === t.start && !t.isSpellingError && !isCapitalized(t.originalPhrase)) && (!(o && t.start < 140 && "UPPERCASE_SENTENCE_START" === t.rule.id && this.ERROR_AT_LINE_START_REG_EXP.test(t.contextPhrase)) && (!t.fixes[0] || t.fixes[0].value.replace(this.NON_BREAKING_SPACE_REG_EXP, " ") !== t.originalPhrase)))))
  }

  static applyFix(t) {
    const e = this.getAdapterType();
    return "html" === e ? GoogleDocsHTML.applyFix(t) : "canvas" === e ? GoogleDocsCanvas.applyFix(t) : Promise.resolve()
  }

  static destroy() {
    Array.from(document.querySelectorAll(this.DISABLED_INDICATOR_TAG_NAME), (t => t.remove())), document.documentElement.removeAttribute("data-lt-site"), document.removeEventListener("lt-strikethroughchange", this._onStrikethroughChange), this._interval && clearInterval(this._interval), this._interval = null, this._strikethroughPointsMap.clear(), this._removeMenubarButton(), this._onModeChangeCallbacks.clear(), this._onPageOutOfViewCallbacks.clear(), this._onPageInViewCallbacks = [], this._storageController && this._storageController.destroy(), this._menuBarHint && (this._menuBarHint.remove(), this._menuBarHint = null), GoogleDocsCanvas.destroy()
  }
}

GoogleDocs.MOUSE_EVENT_DETAIL = 99, GoogleDocs.DOCS_URL_REGEXP = /docs\.google\.com\/document/, GoogleDocs.DOC_ID_REG_EXP = /document\/d\/(.+?)(\/|$)/i, GoogleDocs.ERROR_AT_LINE_START_REG_EXP = /(\n\n|^)\s?\|.+\|/, GoogleDocs.NON_BREAKING_SPACE_REG_EXP = /\u00A0/g, GoogleDocs._cachedRenderType = null, GoogleDocs._storageController = null, GoogleDocs._interval = null, GoogleDocs._currentMode = null, GoogleDocs._onPageInViewCallbacks = [], GoogleDocs._onPageOutOfViewCallbacks = new Map, GoogleDocs._onModeChangeCallbacks = new Map, GoogleDocs._pages = [], GoogleDocs._menuBarButton = null, GoogleDocs._menuBarSeparator = null, GoogleDocs._menuBarHint = null, GoogleDocs._kixContainer = null, GoogleDocs._initTimeout = null, GoogleDocs.TOOLBAR_CLASS_NAME = "lt-gdocs-toolbar", GoogleDocs.DISABLED_INDICATOR_TAG_NAME = "lt-gdocs-disabled", GoogleDocs.STYLE_ATTRIBUTES = ["font-size", "font-weight", "font-family"], GoogleDocs.DISABLED_RULES = ["PUNCTUATION_PARAGRAPH_END", "FINAL_STOPS", "FINAL_PUNCTUATION", "PUNT_FINAL", "BRAK_KROPKI", "EINDE_ZIN_ONVERWACHT", "FALSCHES_ANFUEHRUNGSZEICHEN"], GoogleDocs._strikethroughPointsMap = new Map, GoogleDocs._onStrikethroughChange = t => {
  const e = t.target;
  GoogleDocs._strikethroughPointsMap.set(e, t.detail.strikethroughPoints)
}, "undefined" != typeof window && (window.__ltThunderbirdHack = 1);