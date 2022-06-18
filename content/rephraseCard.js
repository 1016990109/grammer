class RephraseCard {
  constructor(e, t, n, s, i, a, r, o, d, h, c, l, _, u, p, m) {
    this._currentRephraseType = "word", this._renderOutsideIframe = !1, this._destroyed = !1, this._renderInitialContent = () => {
      this._content && this._getContentWord().render().then((() => {
        var e;
        null === (e = this._innerContainer) || void 0 === e || e.classList.remove("lt-card__container--hidden"), this._contentWord.show()
      }))
    }, this._toggleTabs = e => {
      var t;
      const n = e.target;
      if (this._tabNav && n instanceof HTMLElement && n.dataset.tabType) {
        if (this._tabNav.dataset.activeType === n.dataset.tabType) return;
        this._tabNav.dataset.activeType = n.dataset.tabType, null === (t = this._innerContainer) || void 0 === t || t.classList.add("lt-card__container--animates-transition"), setTimeout((() => {
          var e;
          return null === (e = this._innerContainer) || void 0 === e ? void 0 : e.classList.remove("lt-card__container--animates-transition")
        }), 300), "word" === n.dataset.tabType && (this._currentRephraseType = "word", this._getContentSentence().hide(), this._getContentWord().show()), "sentence" === n.dataset.tabType && (this._currentRephraseType = "sentence", this._getContentWord().hide(), this._getContentSentence().show())
      }
    }, this._toggleTabsViaKeyboard = e => {
      var t, n;
      const s = null === (t = this._tabNav) || void 0 === t ? void 0 : t.dataset.activeType;
      if (!s) return;
      const i = null === (n = this._tabNav) || void 0 === n ? void 0 : n.querySelector(`[data-tab-type="${s}"]`);
      if (!i) return;
      const a = new MouseEvent("click", {bubbles: !1, cancelable: !0});
      Object.defineProperty(a, "target", {value: e}), this._addInteractiveElement(i, (() => this._toggleTabsViaKeyboard(i))), this._toggleTabs(a), this._updateFocus(i), this._removeInteractiveElement(e), this._focusedButtonIndex = this._buttons.findIndex((({element: e}) => e === i))
    }, this._dispatchRephraseClick = (e, t) => {
      if ("word" === e) {
        const e = {rephraseCard: this, selection: this.selection, word: this._wordContext.word.trim(), synonym: t};
        dispatchCustomEvent(document, RephraseCard.eventNames.synonymSelected, e)
      }
      if ("sentence" === e) {
        const e = {rephraseCard: this, selection: this.selection, phrase: t};
        dispatchCustomEvent(document, RephraseCard.eventNames.phraseSelected, e)
      }
    }, this._onKeyDown = e => {
      var t, n, s, i, a;
      if ("Escape" === e.key) return this.destroy(), null === (t = e.target) || void 0 === t || t.addEventListener("keyup", (e => e.stopImmediatePropagation()), {
        once: !0,
        capture: !0
      }), void e.stopImmediatePropagation();
      if (!this._uiOptions.enableKeyboard || void 0 === this._focusedButtonIndex) return;
      let r = e.key;
      switch ("Tab" === e.key && (r = e.shiftKey ? "ArrowLeft" : "ArrowRight"), r) {
        case"ArrowLeft":
          for (let e = 1; e < this._buttons.length; e++) {
            let t = this._focusedButtonIndex - e;
            if (t < 0 && (t += this._buttons.length), isVisible(this._buttons[t].element)) {
              this._focusedButtonIndex = t;
              break
            }
          }
          null === (n = this._updateFocus) || void 0 === n || n.call(this), e.stopImmediatePropagation(), e.preventDefault();
          break;
        case"ArrowRight":
          for (let e = 1; e < this._buttons.length; e++) {
            let t = this._focusedButtonIndex + e;
            if (t >= this._buttons.length && (t -= this._buttons.length), isVisible(this._buttons[t].element)) {
              this._focusedButtonIndex = t;
              break
            }
          }
          null === (s = this._updateFocus) || void 0 === s || s.call(this), e.stopImmediatePropagation(), e.preventDefault();
          break;
        case"ArrowUp": {
          const t = this._buttons.map((e => isVisible(e.element) ? this._domMeasurement.getBorderBox(e.element) : null)),
            n = t[this._focusedButtonIndex], s = t.filter((e => e && e.bottom <= n.top)),
            a = Math.max(...s.map((e => e.top))), r = s.filter((e => e.top === a)), o = getClosestXBox(r, n);
          if (o) this._focusedButtonIndex = t.indexOf(o); else for (let e = this._buttons.length - 1; e >= 0; e--) if (isVisible(this._buttons[e].element)) {
            this._focusedButtonIndex = e;
            break
          }
          null === (i = this._updateFocus) || void 0 === i || i.call(this), e.stopImmediatePropagation(), e.preventDefault();
          break
        }
        case"ArrowDown": {
          const t = this._buttons.map((e => isVisible(e.element) ? this._domMeasurement.getBorderBox(e.element) : null)),
            n = t[this._focusedButtonIndex], s = t.filter((e => e && e.top >= n.bottom)),
            i = Math.min(...s.map((e => e.top))), r = s.filter((e => e.top === i)), o = getClosestXBox(r, n);
          if (o) this._focusedButtonIndex = t.indexOf(o); else for (let e = 0; e < this._buttons.length; e++) if (isVisible(this._buttons[e].element)) {
            this._focusedButtonIndex = e;
            break
          }
          null === (a = this._updateFocus) || void 0 === a || a.call(this), e.stopImmediatePropagation(), e.preventDefault();
          break
        }
        case"Enter":
          this._buttons[this._focusedButtonIndex].onSelect(), e.stopImmediatePropagation(), e.preventDefault()
      }
    }, this._uniqueId = e, this._inputArea = t, this._editorText = n, this._sentenceRanges = s, this._targetBoxes = i, this._wordContext = a, this._language = r, this._motherLanguage = o, this._preferredLanguages = d, this._dpaLevel = h, this._confirmedGPT3 = c, this._hasGrammarMistakes = l, this._hasSpellingMistakes = _, this._uiOptions = u, this._updateGPT3Confirmation = m, this._referenceArea = t, this._document = this._inputArea.ownerDocument, this._buttons = [], this._keyboardEventTarget = p.getKeyboardEventTarget(), this._uiOptions.enableKeyboard && (this._focusedButtonIndex = 1), this.selection = {
      start: a.position.start,
      end: a.position.end
    };
    const g = getFrameElement(window);
    g && this._inputArea === this._inputArea.ownerDocument.body && isLTAvailable(window.parent) && (this._referenceArea = g, this._document = this._referenceArea.ownerDocument, this._renderOutsideIframe = !0, this._onUnload = this._onUnload.bind(this), window.addEventListener("pagehide", this._onUnload, !0)), this._domMeasurement = new DomMeasurement(this._document), this._eventListeners = [], this._renderContainer()
  }

  static _cacheMessages() {
    RephraseCard.MESSAGES = {
      PROVIDED_BY: i18nManager.getMessage("synonymsCardProvidedBy"),
      TAB_CAPTION_WORD: i18nManager.getMessage("synonymsCardTabWord"),
      TAB_CAPTION_SENTENCE: i18nManager.getMessage("synonymsCardTabSentence"),
      LOAD_MORE_ALTERNATIVES: i18nManager.getMessage("synonymsCardLoadMoreAlternatives")
    }
  }

  static _constructor() {
    RephraseCard._isInitialized || (RephraseCard._cacheMessages(), i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, RephraseCard._cacheMessages.bind(RephraseCard)), RephraseCard._isInitialized = !0)
  }

  get underlineColor() {
    switch (this._currentRephraseType) {
      case"word":
        return config.COLORS.SYNONYMS.UNDERLINE;
      case"sentence":
        return config.COLORS.STYLE.UNDERLINE;
      default:
        throw new Error(`Unknown RephraseCard type "${this._currentRephraseType}"`)
    }
  }

  get backgroundColor() {
    switch (this._currentRephraseType) {
      case"word":
        return "";
      case"sentence":
        return config.COLORS.STYLE.BACKGROUND;
      default:
        throw new Error(`Unknown RephraseCard type "${this._currentRephraseType}"`)
    }
  }

  updateTargetBoxes(e) {
    this._targetBoxes = e, this._position()
  }

  _renderContainer() {
    if (this._container || this._destroyed) return;
    this._container = createContainerElement(this._document, RephraseCard.CONTAINER_ELEMENT_NAME), this._container.style.display = "none", this._container.setAttribute("data-lt-adjust-appearance", "true"), this._container.classList.add("lt-rephrase-card"), hasDarkBackground(this._inputArea) ? this._container.setAttribute("data-lt-force-appearance", "dark") : this._container.setAttribute("data-lt-force-appearance", "light"), this._eventListeners.push(addUseCaptureEvent(this._keyboardEventTarget, "keydown", this._onKeyDown), addUseCaptureEvent(this._container, "click", (e => e.stopPropagation())), addUseCaptureEvent(this._container, "mouseup", (e => e.stopImmediatePropagation())), addUseCaptureEvent(this._container, "pointerdown", (e => e.stopImmediatePropagation())), addUseCaptureEvent(this._container, "pointerup", (e => e.stopImmediatePropagation()))), this._innerContainer = this._document.createElement("lt-div"), this._innerContainer.classList.add("lt-card__container"), this._innerContainer.classList.add("lt-card__container--rephrase-card"), this._innerContainer.classList.add("lt-card__container--hidden"), this._innerContainer.classList.add("notranslate"), this._header = this._document.createElement("lt-div"), this._header.classList.add("lt-card__header"), this._innerContainer.appendChild(this._header), this._content = this._document.createElement("lt-div"), this._content.classList.add("lt-card__pane"), this._innerContainer.appendChild(this._content), this._renderHeader(), this._renderTabs(), requestAnimationFrame(this._renderInitialContent), this._container.appendChild(this._innerContainer);
    ("BODY" === this._referenceArea.nodeName ? this._document.documentElement : this._document.body).appendChild(this._container), this._position()
  }

  _getWordReferenceTargetBoxes(e) {
    const t = e.slice().sort(((e, t) => e.width > t.width ? -1 : 1)).shift();
    return void 0 !== t ? [Object.assign({}, t), Object.assign({}, t)] : []
  }

  _getSentenceReferenceTargetBoxes(e, t) {
    const [n, s, ...i] = e.slice().sort(((e, t) => e.top > t.top ? -1 : 1));
    let a = s, r = i.length ? i[i.length - 1] : s;
    return (null == n ? void 0 : n.left) + n.width > t && (a = n), void 0 === a ? [] : [Object.assign({}, a), Object.assign({}, r)]
  }

  _position() {
    if (!this._innerContainer) return;
    const e = "word" === this._currentRephraseType, [t, n] = e ? this._getWordReferenceTargetBoxes(this._targetBoxes) : this._getSentenceReferenceTargetBoxes(this._targetBoxes, this._innerContainer.offsetLeft);
    if (!t || !n) return;
    this._domMeasurement.clearCache();
    const s = this._domMeasurement.getDocumentVisibleBox(), i = this._domMeasurement.getBorderBox(this._innerContainer);
    if (this._renderOutsideIframe) {
      let e = document.createElement("lt-span");
      e.style.position = "absolute", e.style.left = t.left + "px", e.style.top = t.top + "px", document.documentElement.appendChild(e);
      const n = e.getBoundingClientRect();
      e.remove(), e = null;
      const s = new DomMeasurement(this._document).getContentBox(this._referenceArea);
      t.left = s.left + n.left, t.top = s.top + n.top, t.bottom = s.top + n.top + t.height, t.right = s.left + n.left + t.width
    }
    let a = e ? Math.min(t.left - 1, s.width - i.width - 8) : this._innerContainer.offsetLeft, r = t.bottom + 5;
    r + i.height > s.bottom && (r = Math.max(s.top, n.top - i.height - 5)), this._innerContainer.style.left = a + "px", this._innerContainer.style.top = r + "px"
  }

  _renderHeader() {
    if (!this._header) return;
    if (!1 !== this._uiOptions.showHeader) {
      const e = this._document.createElement("lt-div");
      e.classList.add("lt-card__logo-container");
      const t = this._document.createElement("lt-span");
      t.classList.add("lt-card__logo", "lt-icon__lt--white"), e.appendChild(t);
      const n = this._document.createElement("lt-span");
      n.classList.add("lt-card__header__caption"), n.innerHTML = RephraseCard.MESSAGES.PROVIDED_BY, e.appendChild(n), this._header.appendChild(e), this._eventListeners.push(addUseCaptureEvent(t, "click", this._onLogoClicked.bind(this)), addUseCaptureEvent(n, "click", this._onLogoClicked.bind(this)))
    }
    const e = new Icon("close_small--white", null, null, this._header);
    this._eventListeners.push(addUseCaptureEvent(e.getElement(), "click", this._onCloseClicked.bind(this)))
  }

  _renderTabButton(e, t, n, s, i) {
    const a = this._document.createElement("lt-div"), r = new Icon(`${t}--blue`, null, null, a, !1).getElement(),
      o = new Icon(t, null, null, a, !1).getElement();
    return r.classList.add("lt-card__tab-nav__icon--default"), o.classList.add("lt-card__tab-nav__icon--active"), a.classList.add("lt-card__tab-nav__button", `lt-card__tab-nav__button--${e}`), a.classList.toggle("lt-card__tab-nav__button--disabled", !0 === i), a.dataset.tabType = e, a.appendChild(this._document.createTextNode(n)), s && a.appendChild(Object.assign(this._document.createElement("lt-span"), {
      className: "lt-card__tab-nav__beta-sign",
      textContent: "Beta"
    })), a
  }

  _renderTabs() {
    var e, t, n;
    if (!this._content) return;
    this._tabNav = this._document.createElement("lt-div"), this._tabNav.classList.add("lt-card__tab-nav"), this._tabNav.dataset.activeType = "word", this._content.appendChild(this._tabNav), this._eventListeners.push(addUseCaptureEvent(this._tabNav, "click", this._toggleTabs));
    const s = this._renderTabButton("sentence", "expand", RephraseCard.MESSAGES.TAB_CAPTION_SENTENCE, !1 === BrowserDetector.isSafari(), void 0 === this._sentenceRanges),
      i = this._document.createElement("lt-div");
    i.classList.add("lt-card__tab-nav__highlight"), null === (e = this._tabNav) || void 0 === e || e.appendChild(this._renderTabButton("word", "narrow_down", RephraseCard.MESSAGES.TAB_CAPTION_WORD)), null === (t = this._tabNav) || void 0 === t || t.appendChild(s), null === (n = this._tabNav) || void 0 === n || n.appendChild(i), this._addInteractiveElement(s, (() => this._toggleTabsViaKeyboard(s)))
  }

  _onLogoClicked(e) {
    e.stopImmediatePropagation();
    const t = {rephraseCard: this};
    dispatchCustomEvent(document, RephraseCard.eventNames.logoClicked, t)
  }

  _onCloseClicked(e) {
    e.stopImmediatePropagation(), this.destroy()
  }

  _updateSelection(e) {
    this.selection = e
  }

  _createLoadMoreButton(e) {
    const t = this._document.createElement("lt-div");
    t.classList.add("lt-rephrasecard__load-more");
    const n = this._document.createElement("lt-span");
    return n.classList.add("lt-rephrasecard__load-more__btn"), n.dataset.testid = `load-more-${e}`, new Icon("arrow_down--blue", null, null, n), n.appendChild(this._document.createTextNode(RephraseCard.MESSAGES.LOAD_MORE_ALTERNATIVES)), t.appendChild(n), {
      wrapper: t,
      button: n
    }
  }

  _dispatchHighlight() {
    dispatchCustomEvent(document, RephraseCard.eventNames.highlight, {rephraseCard: this})
  }

  _dispatchFlashSentence(e, t) {
    const n = {rephraseCard: this, color: config.COLORS.NEW_SENTENCE.BACKGROUND, duration: 1500, offset: e, length: t};
    dispatchCustomEvent(document, RephraseCard.eventNames.flashSentence, n)
  }

  _updateFocus(e) {
    for (const e of this._buttons) e.element.classList.remove("lt-card__button-focused");
    if (void 0 === this._focusedButtonIndex || !this._buttons.length) return;
    if (void 0 !== e) {
      const t = this._buttons.findIndex((({element: t}) => t === e));
      if (-1 === t) return;
      this._focusedButtonIndex = t
    }
    const t = this._buttons[this._focusedButtonIndex].element;
    t.classList.add("lt-card__button-focused"), t.scrollIntoView({block: "nearest", inline: "nearest"})
  }

  _addInteractiveElement(e, t) {
    this._buttons.push({onSelect: t, element: e})
  }

  _removeInteractiveElement(e) {
    const t = this._buttons.findIndex((t => t.element === e));
    t > -1 && this._buttons.splice(t, 1)
  }

  _getContentWord() {
    return this._contentWord || (this._contentWord = new SynonymsContent(this._content, this._wordContext, this._language, this._motherLanguage, this._getHostObject("word"))), this._contentWord
  }

  _getContentSentence() {
    if (!this._contentSentence) {
      const e = this._motherLanguage || this._preferredLanguages[0] || "";
      this._contentSentence = new PhrasesContent(this._uniqueId, this._content, this._editorText, this._sentenceRanges, this._language, e, this._preferredLanguages, this._dpaLevel, this._confirmedGPT3, this._uiOptions.geoIpCountry, this._uiOptions.hasSubscription, this.selection, this._getHostObject("sentence"), this._hasGrammarMistakes, this._hasSpellingMistakes, this._updateGPT3Confirmation), this._contentSentence.render()
    }
    return this._contentSentence
  }

  _getHostObject(e) {
    return {
      position: this._position.bind(this),
      updateFocus: this._updateFocus.bind(this),
      updateSelection: this._updateSelection.bind(this),
      createLoadMoreButton: this._createLoadMoreButton.bind(this),
      dispatchHighlight: this._dispatchHighlight.bind(this),
      dispatchFlashSentence: this._dispatchFlashSentence.bind(this),
      dispatchRephraseClick: t => this._dispatchRephraseClick(e, t),
      addEventListener: (...e) => this._eventListeners.push(...e),
      addInteractiveElement: this._addInteractiveElement.bind(this),
      clearDomMeasurementCache: () => this._domMeasurement.clearCache()
    }
  }

  _onUnload() {
    this.destroy()
  }

  destroy() {
    var e, t;
    this._destroyed = !0, null === (e = this._contentWord) || void 0 === e || e.destroy(), null === (t = this._contentSentence) || void 0 === t || t.destroy(), this._container && (this._container.remove(), this._container = null);
    const n = {rephraseCard: this};
    dispatchCustomEvent(document, RephraseCard.eventNames.destroyed, n), window.removeEventListener("pagehide", this._onUnload, !0), this._eventListeners.forEach((e => {
      e.destroy()
    })), this._eventListeners = []
  }
}

RephraseCard.CONTAINER_ELEMENT_NAME = "lt-card", RephraseCard.eventNames = {
  synonymSelected: "lt-rephraseCard.synonymSelected",
  phraseSelected: "lt-rephraseCard.phraseSelected",
  logoClicked: "lt-rephraseCard.logoClicked",
  destroyed: "lt-rephraseCard.destroyed",
  highlight: "lt-rephraseCard.highlight",
  flashSentence: "lt-rephraseCard.flashSentence"
}, RephraseCard.BLOCK_ID = "rephrase-card", RephraseCard._isInitialized = !1, RephraseCard._constructor();