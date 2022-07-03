/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class ErrorCard {
  constructor(e, t, r, s, i) {
    this._renderOutsideIframe = !1
    this._inputArea = e
    this._error = r
    this._tweaks = s
    this._uiOptions = i
    this._referenceArea = e
    this._keyboardEventTarget = this._tweaks.getKeyboardEventTarget()
    this._document = this._inputArea.ownerDocument
    this._isHiddenMatch = "HIDDEN_RULE" === r.rule.id
    this._buttons = [];
    const n = getFrameElement(window);
    n && this._inputArea === this._inputArea.ownerDocument.body && isLTAvailable(window.parent) && (this._referenceArea = n, this._document = this._referenceArea.ownerDocument, this._renderOutsideIframe = !0, this._onPageHide = this._onPageHide.bind(this), window.addEventListener("pagehide", this._onPageHide, !0)), this._domMeasurement = new DomMeasurement(this._document), this._eventListeners = [], this._render(t), this._uiOptions.enableKeyboard && this._buttons.length && (this._focusedButtonIndex = 0, this._updateFocus())
  }

  static _cacheMessages() {
    ErrorCard.MESSAGES = {
      HEADLINE_SPELLING_ERROR: i18nManager.getMessage("spellingError"),
      HEADLINE_HIDDEN_MATCH: i18nManager.getMessage("hiddenMatchHeadline"),
      HEADLINE_CUSTOM_SUGGESTION_ERROR: i18nManager.getMessage("customSuggestionError"),
      HEADLINE_SUGGESTION_ERROR: i18nManager.getMessage("suggestionError"),
      HEADLINE_PUNCTUATION_ERROR: i18nManager.getMessage("punctuationError"),
      HEADLINE_GRAMMAR_ERROR: i18nManager.getMessage("grammarError"),
      LINK_MORE_DETAILS: i18nManager.getMessage("moreDetails"),
      LINK_IGNORE_RULE: i18nManager.getMessage("turnOffRule"),
      LINK_IGNORE_RULE_PICKY: i18nManager.getMessage("turnOffRulePicky"),
      LINK_IGNORE_HERE: i18nManager.getMessage("ignoreHere"),
      TURN_OFF_PICKY_MODE: i18nManager.getMessage("turnOffPickyMode"),
      EN_US_LINK: i18nManager.getMessage("switchToAmericanEnglish"),
      EN_CA_LINK: i18nManager.getMessage("switchToCanadianEnglish"),
      EN_AU_LINK: i18nManager.getMessage("switchToAustralianEnglish"),
      EN_NZ_LINK: i18nManager.getMessage("switchToNewZealandEnglish"),
      EN_ZA_LINK: i18nManager.getMessage("switchToSouthAfricanEnglish"),
      EN_GB_LINK: i18nManager.getMessage("switchToBritishEnglish"),
      DELETE: i18nManager.getMessage("deleteWord"),
      REMOVE_EXTRA_WHITESPACE: i18nManager.getMessage("removeExtraWhitespace"),
      PREMIUM_TEXT: i18nManager.getMessage("suggestionOnlyVisibleToPremiumText"),
      PREMIUM_BUTTON: i18nManager.getMessage("suggestionOnlyVisibleToPremiumButton"),
      KEYBOARD_INSTRUCTIONS: i18nManager.getMessage("errorCardKeyboardInstructions", ["<lt-em>Enter</lt-em>", "<lt-em>&#8679;</lt-em> <lt-em>Enter</lt-em>"])
    }
  }

  static _constructor() {
    ErrorCard._isInitialized || (ErrorCard._cacheMessages(), i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, ErrorCard._cacheMessages.bind(ErrorCard)), ErrorCard._isInitialized = !0)
  }

  _render(e) {
    this._container = createContainerElement(this._document, ErrorCard.CONTAINER_ELEMENT_NAME)
    this._container.style.display = "none"
    this._container.setAttribute("data-lt-adjust-appearance", "true")
    this._container.classList.add("lt-error-card")
    this._container.classList.add("flappy")
    this._container.addEventListener("click", (e => e.stopPropagation()))
    hasDarkBackground(this._inputArea) ? this._container.setAttribute("data-lt-force-appearance", "dark") : this._container.setAttribute("data-lt-force-appearance", "light")
    this._eventListeners.push(
      addUseCaptureEvent(this._keyboardEventTarget, "keydown", this._onKeyDown.bind(this)),
      addUseCaptureEvent(this._container, "mousedown", (e => {
        e.stopImmediatePropagation(), e.target && !e.target.closest(".lt-errorcard__text, .lt-card__headline") && e.preventDefault()
      })),
      addUseCaptureEvent(this._container, "mouseup", (e => e.stopImmediatePropagation())),
      addUseCaptureEvent(this._container, "pointerdown", (e => e.stopImmediatePropagation())),
      addUseCaptureEvent(this._container, "pointerup", (e => e.stopImmediatePropagation())))
    const t = this._document.createElement("lt-div");
    t.classList.add("lt-card__container")
    t.id = 'plappy-card'
    t.classList.add("lt-card__container--error-card")
    t.classList.add("notranslate")
    this._renderContent(t)
    // const r = this._document.createElement("lt-span");
    // r.className = "lt-card__close-button lt-icon__close_small"
    // this._eventListeners.push(addUseCaptureEvent(r, "click", this._onCloseClicked.bind(this)))
    // t.appendChild(r)
    this._container.appendChild(t);
    const s = this._domMeasurement.getDocumentVisibleBox(),
      i = this._document.elementFromPoint(e.left - s.left + 10, e.bottom - s.top + 10),
      n = i && !this._inputArea.contains(i),
      o = "BODY" === this._referenceArea.nodeName ? this._document.documentElement : this._document.body;
    o.appendChild(this._container)
    this._domMeasurement.clearCache();
    const a = this._domMeasurement.getBorderBox(t);
    if (this._renderOutsideIframe) {
      let t = document.createElement("lt-span");
      t.style.position = "absolute", t.style.left = e.left + "px", t.style.top = e.top + "px", document.documentElement.appendChild(t);
      const r = t.getBoundingClientRect();
      t.remove(), t = null;
      const s = new DomMeasurement(this._document).getContentBox(this._referenceArea);
      e.left = s.left + r.left, e.top = s.top + r.top, e.bottom = s.top + r.top + e.height, e.right = s.left + r.left + e.width
    }
    let d = Math.min(e.left, s.width - a.width), c = e.bottom + 5;
    const l = a.height < e.top;
    (c + a.height > s.bottom || n && l) && (c = Math.max(s.top, e.top - a.height - 5));
    const _ = this._domMeasurement.getScaleFactor(o), h = this._domMeasurement.getZoom(o);
    d /= _.x * h, c /= _.y * h, t.style.left = Math.round(d) + "px", t.style.top = Math.round(c) + "px"
  }

  _renderContent(e) {
    // render flappypedia 的卡片
    const wikiInfo = (JSON.parse(this._error.description || '{}')).info
    const wikiHeader = this._document.createElement('div')
    wikiHeader.classList.add('wiki-header')
    wikiHeader.id = 'wiki-header'
    const titleContainer = this._document.createElement('div')
    titleContainer.classList.add('title-container')
    const wikiTitle = this._document.createElement('div')
    wikiTitle.classList.add('wiki-title')
    wikiTitle.id = 'wiki-title'
    wikiTitle.innerHTML = wikiInfo.name
    titleContainer.appendChild(wikiTitle)
    const wikiSubTitle = this._document.createElement('div')
    wikiSubTitle.classList.add('wiki-sub-title')
    wikiSubTitle.id = 'wiki-sub-title'
    wikiSubTitle.innerHTML = wikiInfo.fullName
    titleContainer.appendChild(wikiSubTitle)
    wikiHeader.appendChild(titleContainer)
    const flappyLink = this._document.createElement('a')
    flappyLink.classList.add('wiki-airplane')
    flappyLink.id = 'wiki-airplane'
    flappyLink.href="https://hamilhong.work/console"
    flappyLink.target = "_blank"
    wikiHeader.appendChild(flappyLink)
    e.appendChild(wikiHeader)

    const content = this._document.createElement('lt-div')
    content.classList.add('wiki-container')
    content.id = 'wiki-container'
    const wikiContent = this._document.createElement('lt-div')
    wikiContent.classList.add('wiki-content')
    wikiContent.id = 'wiki-content'
    const wikiText = this._document.createElement('lt-div')
    wikiText.innerHTML = wikiInfo.content
    wikiText.classList.add('wiki-text')
    wikiText.id = 'wiki-text'
    wikiContent.appendChild(wikiText)
    const showAll = this._document.createElement('lt-div')
    showAll.innerHTML = 'show all ↓'
    showAll.classList.add('show-all')
    showAll.id = 'show-all'
    showAll.onclick = function (e) {
      wikiText.innerHTML = wikiInfo.detail
    }
    wikiContent.appendChild(showAll)
    content.appendChild(wikiContent)

    if (wikiInfo.links.length) {
      const relateLinks = this._document.createElement('lt-div')
      relateLinks.innerHTML = 'Related Links'
      relateLinks.classList.add('relate-title')
      relateLinks.id = 'relate-title'
      content.appendChild(relateLinks)
      for (let i = 0; i < wikiInfo.links.length; i++) {
        try {
          const link = JSON.parse(wikiInfo.links[i])
          const linkTitle = this._document.createElement('a')
          linkTitle.href = link.link
          linkTitle.target = '_blank'
          linkTitle.innerHTML = link.title
          content.appendChild(linkTitle)
        } catch (e) {
          console.error(e)
        }
      }
    }

    if (wikiInfo.people.length) {
      const relatePeople = this._document.createElement('lt-div')
      relatePeople.innerHTML = 'Related People'
      relatePeople.classList.add('relate-title')
      relatePeople.id = 'relate-title'
      content.appendChild(relatePeople)
      for (let i = 0; i < wikiInfo.people.length; i++) {
        try {
          const people = wikiInfo.people[i]
          const peopleTitle = this._document.createElement('span')
          peopleTitle.innerHTML = people.name
          peopleTitle.classList.add('wiki-tag')
          peopleTitle.id = 'wiki-tag'
          content.appendChild(peopleTitle)
        } catch (e) {
          console.error(e)
        }
      }
    }

    e.appendChild(content)
  }

  _renderFixes(e) {
    if (this._error.fixes.length) {
      const t = this._document.createElement("lt-div");
      t.classList.add("lt-errorcard__suggestion-wrapper");
      const r = Math.min(this._error.fixes.length, config.MAX_FIXES_COUNT);
      for (let e = 0; e < r; e++) {
        const r = this._error.fixes[e], s = this._document.createElement("lt-span");
        if (s.classList.add("lt-errorcard__suggestion"), !r.value.startsWith(" ") && !r.value.endsWith(" ") || ["FALSCHE_VERWENDUNG_DES_BINDESTRICHS"].includes(this._error.rule.id) ? s.textContent = r.value.replace(ErrorCard.NARROW_WHITESPACE_REGEXP, " ") : s.textContent = r.value.replace(ErrorCard.TRAILING_WHITESPACE_REGEXP, "·"), s.title = r.shortDescription || "", "" === r.value && this._error.originalPhrase.match(/[a-z0-9]{2,}/) ? (s.classList.add("lt-errorcard__suggestion--strikethrough"), s.textContent = this._error.originalPhrase) : "" === r.value ? (s.classList.add("lt-errorcard__suggestion--delete"), s.textContent = ErrorCard.MESSAGES.DELETE) : " " === r.value && /^\s\s+$/.test(this._error.originalPhrase) && (s.className = "lt-errorcard__suggestion--optional", s.textContent = ErrorCard.MESSAGES.REMOVE_EXTRA_WHITESPACE), r.suffix) {
          const e = this._document.createElement("lt-span");
          e.textContent = r.suffix, e.classList.add("lt-card__hint"), s.append(e)
        } else if (r.prefix) {
          const e = this._document.createElement("lt-span");
          e.classList.add("lt-card__hint"), s.prepend(e)
        }
        const i = this._onFixClick.bind(this, e);
        this._eventListeners.push(addUseCaptureEvent(s, "click", i)), t.appendChild(s), this._buttons.push({
          element: s,
          onSelect: i
        });
        const n = getConfigForMultipleErrorCorrection(this._error, r.value);
        if (this._uiOptions.canCorrectMultipleAtOnce && n) {
          const e = this._onCorrectAll.bind(this, n), r = this._document.createElement("lt-span");
          r.classList.add("lt-errorcard__suggestion--correct-all"), r.innerHTML = n.suggestion.message, this._eventListeners.push(addUseCaptureEvent(r, "click", e)), t.appendChild(r), t.appendChild(this._document.createElement("br")), this._buttons.push({
            element: r,
            onSelect: e
          })
        }
      }
      if (1 === this._error.fixes.length && (this._error.description.match(/i[ns]\s+(chiefly\s)?((North\s)?American|British)\s+English/) || "EN_GB_SIMPLE_REPLACE" === this._error.rule.id)) {
        const e = this._document.createElement("lt-span");
        e.classList.add("lt-errorcard__suggestion--optional");
        let r = null;
        if (this._error.description.match(/is\s+(chiefly\s)?British English/) ? "CA" === this._uiOptions.geoIpCountry ? (r = "en-ca", e.textContent = ErrorCard.MESSAGES.EN_CA_LINK) : "AU" === this._uiOptions.geoIpCountry ? (r = "en-au", e.textContent = ErrorCard.MESSAGES.EN_AU_LINK) : "NZ" === this._uiOptions.geoIpCountry ? (r = "en-nz", e.textContent = ErrorCard.MESSAGES.EN_NZ_LINK) : "ZA" === this._uiOptions.geoIpCountry ? (r = "en-za", e.textContent = ErrorCard.MESSAGES.EN_ZA_LINK) : (r = "en-gb", e.textContent = ErrorCard.MESSAGES.EN_GB_LINK) : (this._error.description.match(/is\s+(chiefly\s)?(North\s)?American English/) || this._error.description.includes("is a common American expression")) && (r = "en-us", e.textContent = ErrorCard.MESSAGES.EN_US_LINK), r) {
          const s = this._onLanguageChange.bind(this, r);
          this._eventListeners.push(addUseCaptureEvent(e, "click", s)), t.appendChild(e), this._buttons.push({
            element: e,
            onSelect: s
          })
        }
      }
      e.appendChild(t)
    }
  }

  _renderKeyboardInstructuions(e) {
    if (!this._uiOptions.enableKeyboard) return;
    const t = this._document.createElement("lt-div");
    t.className = "lt-errorcard__keyboard-instructions", e.append(t), t.innerHTML = ErrorCard.MESSAGES.KEYBOARD_INSTRUCTIONS
  }

  _renderActions(e) {
    if (this._error.isSpellingError) {
      if (!this._uiOptions.disableAddingWord && !includesWhiteSpace(this._error.originalPhrase)) {
        const t = this._document.createElement("lt-div");
        t.classList.add("lt-errorcard__add-to-dictionary", "lt-icon__dictionary"), t.textContent = i18nManager.getMessage("addToDictionaryCaption", this._error.originalPhrase);
        const r = this._onAddToDictionaryClick.bind(this);
        this._eventListeners.push(addUseCaptureEvent(t, "click", r)), e.appendChild(t), this._buttons.push({
          element: t,
          onSelect: r
        })
      }
      const t = this._document.createElement("lt-div");
      t.classList.add("lt-errorcard__temporarily-ignore-word"), t.classList.add("lt-icon__mute"), t.textContent = ErrorCard.MESSAGES.LINK_IGNORE_HERE;
      const r = this._onTemporarilyIgnoreWordClick.bind(this);
      this._eventListeners.push(addUseCaptureEvent(t, "click", r)), e.appendChild(t), this._buttons.push({
        element: t,
        onSelect: r
      })
    } else {
      if (!this._uiOptions.disableIgnoringRule && !this._isHiddenMatch && !this._error.isCustomError) {
        const t = this._document.createElement("lt-div");
        t.classList.add("lt-errorcard__ignore-rule"), t.classList.add("lt-icon__ignore"), t.textContent = ErrorCard.MESSAGES.LINK_IGNORE_RULE;
        const r = this._onIgnoreRuleClick.bind(this);
        this._eventListeners.push(addUseCaptureEvent(t, "click", r)), e.appendChild(t), this._buttons.push({
          element: t,
          onSelect: r
        })
      }
      const t = this._document.createElement("lt-div");
      t.classList.add("lt-errorcard__temporarily-ignore-rule"), t.classList.add("lt-icon__mute"), t.textContent = ErrorCard.MESSAGES.LINK_IGNORE_HERE;
      const r = this._onTemporarilyIgnoreRuleClick.bind(this);
      this._eventListeners.push(addUseCaptureEvent(t, "click", r)), e.appendChild(t), this._buttons.push({
        element: t,
        onSelect: r
      })
    }
    const t = this._document.createElement("lt-div");
    if (this._error.isPicky && "extension" === EnvironmentAdapter.getType() && !this._isHiddenMatch) {
      const t = this._document.createElement("lt-div");
      t.classList.add("lt-errorcard__turn-off-picky-mode"), t.classList.add("lt-icon__picky_mode"), t.textContent = ErrorCard.MESSAGES.TURN_OFF_PICKY_MODE;
      const r = this._onTurnOffPickyMode.bind(this);
      this._eventListeners.push(addUseCaptureEvent(t, "click", r)), e.appendChild(t), this._buttons.push({
        element: t,
        onSelect: r
      })
    }
  }

  _renderFooter(e) {
    if (this._uiOptions.showFooter) {
      const t = this._document.createElement("lt-div");
      t.classList.add("lt-card__footer"), e.appendChild(t);
      const r = this._document.createElement("lt-div");
      r.classList.add("lt-card__logo", "lt-icon__lt"), t.appendChild(r), this._eventListeners.push(addUseCaptureEvent(r, "click", this._onLogoClicked.bind(this)));
      const s = this._document.createElement("lt-div");
      s.classList.add("lt-card__badge-container"), t.appendChild(s);
      const i = this._document.createElement("lt-div");
      if (i.classList.add("lt-card__name"), i.textContent = "LanguageTool", s.appendChild(i), this._uiOptions.isPremiumAccount) new PackageBadge(null, "premium", "small", s); else {
        const e = new PackageBadge(null, "basic", "small", s);
        this._eventListeners.push(addUseCaptureEvent(e.getElement(), "click", this._onBadgeClicked.bind(this)))
      }
    }
  }

  _updateFocus() {
    for (const e of this._buttons) e.element.classList.remove("lt-card__button-focused");
    void 0 !== this._focusedButtonIndex && this._buttons[this._focusedButtonIndex].element.classList.add("lt-card__button-focused")
  }

  _onBadgeClicked(e) {
    e.stopImmediatePropagation();
    const t = {errorCard: this};
    dispatchCustomEvent(document, ErrorCard.eventNames.badgeClicked, t)
  }

  _onLogoClicked(e) {
    e.stopImmediatePropagation();
    const t = {errorCard: this};
    dispatchCustomEvent(document, ErrorCard.eventNames.logoClicked, t)
  }

  _onMoreDetailsClick(e) {
    e.stopImmediatePropagation();
    const t = {errorCard: this, url: this._error.rule.urls[0].value};
    dispatchCustomEvent(document, ErrorCard.eventNames.moreDetailsClicked, t)
  }

  _onFixClick(e, t) {
    t.stopImmediatePropagation();
    const r = {errorCard: this, error: this._error, fixIndex: e, selectNextError: !!t.shiftKey};
    dispatchCustomEvent(document, ErrorCard.eventNames.fixSelected, r)
  }

  _onLanguageChange(e, t) {
    t.stopImmediatePropagation();
    const r = {errorCard: this, error: this._error, language: e};
    dispatchCustomEvent(document, ErrorCard.eventNames.languageChanged, r)
  }

  _onCorrectAll(e, t) {
    t.stopImmediatePropagation();
    const r = {errorCard: this, config: e, selectedError: this._error};
    dispatchCustomEvent(document, ErrorCard.eventNames.correctAll, r)
  }

  _onAddToDictionaryClick(e) {
    e.stopImmediatePropagation();
    const t = {errorCard: this, error: this._error, selectNextError: e instanceof KeyboardEvent && e.shiftKey};
    dispatchCustomEvent(document, ErrorCard.eventNames.addToDictionaryClicked, t)
  }

  _onIgnoreRuleClick(e) {
    e.stopImmediatePropagation();
    const t = {errorCard: this, error: this._error, selectNextError: e instanceof KeyboardEvent && e.shiftKey};
    dispatchCustomEvent(document, ErrorCard.eventNames.ignoreRuleClicked, t)
  }

  _onTemporarilyIgnoreWordClick(e) {
    e.stopImmediatePropagation();
    const t = {errorCard: this, error: this._error, selectNextError: e instanceof KeyboardEvent && e.shiftKey};
    dispatchCustomEvent(document, ErrorCard.eventNames.temporarilyIgnoreWordClicked, t)
  }

  _onTemporarilyIgnoreRuleClick(e) {
    e.stopImmediatePropagation();
    const t = {errorCard: this, error: this._error, selectNextError: e instanceof KeyboardEvent && e.shiftKey};
    dispatchCustomEvent(document, ErrorCard.eventNames.temporarilyIgnoreRuleClicked, t)
  }

  _onTurnOffPickyMode(e) {
    e.stopImmediatePropagation();
    const t = {errorCard: this};
    dispatchCustomEvent(document, ErrorCard.eventNames.turnOffPickyModeClicked, t)
  }

  _onCloseClicked(e) {
    e.stopImmediatePropagation(), this.destroy()
  }

  _onKeyDown(e) {
    var t;
    if ("Escape" === e.key) return this.destroy(), null === (t = e.target) || void 0 === t || t.addEventListener("keyup", (e => e.stopImmediatePropagation()), {
      once: !0,
      capture: !0
    }), void e.stopImmediatePropagation();
    if (!this._uiOptions.enableKeyboard || void 0 === this._focusedButtonIndex) return;
    let r = e.key;
    switch ("Tab" === e.key && (r = e.shiftKey ? "ArrowLeft" : "ArrowRight"), r) {
      case"ArrowLeft":
        this._focusedButtonIndex--, -1 === this._focusedButtonIndex && (this._focusedButtonIndex = this._buttons.length - 1), this._updateFocus(), e.stopImmediatePropagation(), e.preventDefault();
        break;
      case"ArrowRight":
        this._focusedButtonIndex++, this._focusedButtonIndex === this._buttons.length && (this._focusedButtonIndex = 0), this._updateFocus(), e.stopImmediatePropagation(), e.preventDefault();
        break;
      case"ArrowUp": {
        const t = this._buttons.map((e => this._domMeasurement.getBorderBox(e.element))),
          r = t[this._focusedButtonIndex];
        let s = null;
        for (const e of t) if (!(e.bottom > r.top)) if (s) {
          (e.bottom > s.bottom || e.bottom === s.bottom && e.left < s.left) && (s = e)
        } else s = e;
        this._focusedButtonIndex = s ? t.indexOf(s) : this._buttons.length - 1, this._updateFocus(), e.stopImmediatePropagation(), e.preventDefault();
        break
      }
      case"ArrowDown": {
        const t = this._buttons.map((e => this._domMeasurement.getBorderBox(e.element))),
          r = t[this._focusedButtonIndex];
        let s = null;
        for (const e of t) if (!(e.top < r.bottom)) if (s) {
          (e.top < s.top || e.top === s.top && e.left < s.left) && (s = e)
        } else s = e;
        this._focusedButtonIndex = s ? t.indexOf(s) : 0, this._updateFocus(), e.stopImmediatePropagation(), e.preventDefault();
        break
      }
      case"Enter":
        this._buttons[this._focusedButtonIndex].onSelect(e), e.stopImmediatePropagation(), e.preventDefault()
    }
  }

  _onPageHide() {
    this.destroy()
  }

  destroy() {
    if (this._container) {
      this._container.remove(), this._container = null;
      const e = {errorCard: this, error: this._error};
      dispatchCustomEvent(document, ErrorCard.eventNames.destroyed, e)
    }
    window.removeEventListener("pagehide", this._onPageHide, !0), this._eventListeners.forEach((e => {
      e.destroy()
    })), this._eventListeners = []
  }
}

ErrorCard.TRAILING_WHITESPACE_REGEXP = /^ | $/g, ErrorCard.NARROW_WHITESPACE_REGEXP = /\u202F/g, ErrorCard.CONTAINER_ELEMENT_NAME = "lt-card", ErrorCard.eventNames = {
  addToDictionaryClicked: "lt-errorCard.addToDictionaryClicked",
  ignoreRuleClicked: "lt-errorCard.ignoreRuleClicked",
  temporarilyIgnoreWordClicked: "lt-errorCard.temporarilyIgnoreWordClicked",
  temporarilyIgnoreRuleClicked: "lt-errorCard.temporarilyIgnoreRuleClicked",
  turnOffPickyModeClicked: "lt-errorCard.turnOffPickyModeClicked",
  moreDetailsClicked: "lt-errorCard.moreDetailsClicked",
  fixSelected: "lt-errorCard.fixSelected",
  languageChanged: "lt-errorCard.languageSwitched",
  badgeClicked: "lt-errorCard.badgeClicked",
  logoClicked: "lt-errorCard.logoClicked",
  premiumTeaserClicked: "lt-errorCard.premiumTeaserClicked",
  destroyed: "lt-errorCard.destroyed",
  correctAll: "lt-errorCard.correctAll"
}, ErrorCard._isInitialized = !1, ErrorCard._constructor();