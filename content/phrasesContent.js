var __awaiter = this && this.__awaiter || function (e, t, s, n) {
  return new (s || (s = Promise))((function (i, a) {
    function r(e) {
      try {
        o(n.next(e))
      } catch (e) {
        a(e)
      }
    }

    function h(e) {
      try {
        o(n.throw(e))
      } catch (e) {
        a(e)
      }
    }

    function o(e) {
      var t;
      e.done ? i(e.value) : (t = e.value, t instanceof s ? t : new s((function (e) {
        e(t)
      }))).then(r, h)
    }

    o((n = n.apply(e, t || [])).next())
  }))
};

class PhrasesContent {
  constructor(e, t, s, n, i, a, r, h, o, _, d, c, l, p, u, g) {
    this.PHRASES_BATCH_SIZE = 3, this._rendered = !1, this._destroyed = !1, this._visiblePhraseBatches = 1, this._selectedVariant = null, this._userRevertedSentence = !1, this._handleConfirmation = e => {
      this._content && this._confirmation && this._content.removeChild(this._confirmation), this._updateGPT3Confirmation(!0), e(), Tracker.trackEvent("Action", "rephrasesV2:privacy_confirmed")
    }, this._uniqueId = e, this._container = t, this._document = t.ownerDocument, this._editorText = s, this._sentenceRanges = n, this._language = LanguageManager.getPrimaryLanguageCode(i), this._userLanguage = a, this._preferredLanguages = r, this._dpaLevel = h, this._confirmedGPT3 = o, this._country = _, this._hasSubscription = d, this._anchorSelection = c, this._host = l, this._hasGrammarMistakes = p, this._hasSpellingMistakes = u, this._updateGPT3Confirmation = g
  }

  static _cacheMessages() {
    const e = BrowserDetector.isSafari() ? "https://languagetool.org/legal/privacy/?hidePremium=true#rephrasing" : "https://languagetool.org/legal/privacy/#rephrasing";
    PhrasesContent.MESSAGES = {
      HEADLINE: i18nManager.getMessage("phrasesCardHeadline"),
      PHRASE_PREFIX: i18nManager.getMessage("phrasesCardSentencePrefix"),
      LOADING: i18nManager.getMessage("synonymsCardLoading"),
      NO_SENTENCE: i18nManager.getMessage("phrasesCardNoSentence"),
      NO_RESULT: i18nManager.getMessage("phrasesCardNoResult"),
      NOT_SUPPORTED_HEADING: i18nManager.getMessage("phrasesCardNotSupportedHeading"),
      NOT_SUPPORTED_TEXT: i18nManager.getMessage("phrasesCardNotSupportedText"),
      ERROR: i18nManager.getMessage("phrasesCardGeneralError"),
      TIMEOUT: i18nManager.getMessage("phrasesCardTimeoutError"),
      LABEL_FORMALITY: i18nManager.getMessage("phrasesCardLabelFormality"),
      LABEL_PARAPHRASE: i18nManager.getMessage("phrasesCardLabelParaphrase"),
      LABEL_FLUENCY: i18nManager.getMessage("phrasesCardLabelFluency"),
      LABEL_SHORTENED: i18nManager.getMessage("phrasesCardLabelShortened"),
      LABEL_SIMPLICITY: i18nManager.getMessage("phrasesCardLabelSimplicity"),
      LABEL_USER_: "Source sentence",
      CONFIRMATION_HEADING: i18nManager.getMessage("phrasesCardConfirmationHeading"),
      CONFIRMATION_TEXT: i18nManager.getMessage("phrasesCardConfirmationText", [e]),
      CONFIRMATION_BUTTON: i18nManager.getMessage("phrasesCardConfirmationButton")
    }
  }

  get ADJUSTED_BATCH_SIZE() {
    var e;
    const t = "string" == typeof (null === (e = this._phrasesResult) || void 0 === e ? void 0 : e.previousSentence) ? 1 : 0;
    return this.PHRASES_BATCH_SIZE - t
  }

  static _constructor() {
    PhrasesContent._isInitialized || (PhrasesContent._cacheMessages(), i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, PhrasesContent._cacheMessages.bind(PhrasesContent)), PhrasesContent._isInitialized = !0)
  }

  static isSupportedLanguage(e) {
    return PhrasesContent.REPHRASE_SENTENCE_LANGUAGES.some((t => e.startsWith(t)))
  }

  get _phrase() {
    return this._selection ? this._editorText.slice(this._selection.start, this._selection.end) : ""
  }

  get _isEnabled() {
    return PhrasesContent.isSupportedLanguage(this._language)
  }

  get _isAllowed() {
    return !0 === this._confirmedGPT3 || "standalone" === EnvironmentAdapter.getType() || !0 === this._inhouseOnly
  }

  get _inhouseOnly() {
    return 1 === this._dpaLevel
  }

  render() {
    var e;
    this._rendered || this._destroyed || (this._content = this._document.createElement("lt-div"), this._content.classList.add("lt-card__pane__content"), null === (e = this._container) || void 0 === e || e.appendChild(this._content), this._rendered = !0)
  }

  show() {
    this._content && this._content.classList.remove("lt-card__pane__content--hidden"), this._checkConfirmation((() => {
      this._isEnabled ? (this._renderPhrasesPlaceholder(), this._selection = this._getSentence(), this._selection ? (this._loadRephrasings(), this._host.updateSelection(this._selection), this._host.dispatchHighlight(), this._renderText()) : this._setMessage(PhrasesContent.MESSAGES.NO_SENTENCE)) : this._renderNotSupportedMessage(), this._host.position(), Tracker.trackEvent("Action", "rephrasesV2:open", this._isEnabled ? "enabled" : "disabled")
    }))
  }

  hide() {
    this._content && this._content.classList.add("lt-card__pane__content--hidden")
  }

  destroy() {
    this._reportPhrase(), this._destroyed = !0
  }

  _setMessage(e) {
    if (this._phrases) {
      const t = this._document.createElement("lt-div");
      t.classList.add("lt-rephrasecontent__message"), t.textContent = e, this._phrases.innerHTML = "", this._phrases.appendChild(t)
    }
  }

  _renderText(e) {
    if (!this._content) return;
    const t = (null == e ? void 0 : e.reduce(((e, t) => (!0 !== t.added && (e += !0 === t.removed ? '<lt-span class="lt-phrasescontent__sentence__removal">' : "", e += t.value, e += !0 === t.removed ? "</lt-span>" : ""), e)), "")) || this._phrase;
    this._text = this._text || this._document.createElement("lt-div"), this._text.classList.add("lt-phrasescontent__sentence"), this._text.innerHTML = `${PhrasesContent.MESSAGES.PHRASE_PREFIX}: "${t.trim()}"`, this._content.contains(this._text) || (this._phrases ? this._content.insertBefore(this._text, this._phrases) : this._content.appendChild(this._text))
  }

  _renderPhrasesPlaceholder() {
    this._content && !this._phrases && (this._phrases = this._document.createElement("lt-div"), this._phrases.classList.add("lt-phrasescontent__phrases"), this._setMessage(PhrasesContent.MESSAGES.LOADING), this._content.appendChild(this._phrases))
  }

  _createLabel(e) {
    const t = `LABEL_${e.toUpperCase()}`, s = PhrasesContent.MESSAGES[t];
    if (void 0 === s) return this._document.createTextNode("");
    const n = this._document.createElement("lt-span");
    return n.classList.add("lt-phrasescontent__row__label"), n.textContent = s, n
  }

  _renderPhrases() {
    if (this._content && this._phrasesResult && this._phrases) {
      if (!this._previousSentence && this._phrasesResult.previousSentence) {
        const e = [{value: this._phrasesResult.previousSentence, added: !0, count: 0}];
        this._previousSentence = this._renderVariantSelector(e, {
          label: "user_",
          origin: "user",
          score: 0,
          uuid: "00000000-0000-4000-A000-000000000000",
          text: this._phrasesResult.previousSentence
        }, "lt-phrasescontent__previous-sentence"), this._content.insertBefore(this._previousSentence, this._phrases)
      }
      this._phrasesHeadline || (this._phrasesHeadline = this._document.createElement("lt-div"), this._phrasesHeadline.classList.add("lt-card__headline", "lt-card__headline--rephrase"), this._phrasesHeadline.textContent = PhrasesContent.MESSAGES.HEADLINE, this._content.insertBefore(this._phrasesHeadline, this._phrases)), this._phrases.innerHTML = "", this._phrases.classList.toggle("lt-phrasescontent__phrases--shortened", this.ADJUSTED_BATCH_SIZE < this.PHRASES_BATCH_SIZE), this._hasDanglingItem() && (this._visiblePhraseBatches += 1);
      for (let e of this._phrasesResult.phrases) {
        if (this._phrase.trim() === e.text.trim()) continue;
        const t = Diff.ignoreCaseChangeAtBeginning(createDiff(this._phrase, e.text));
        if (0 === t.length) continue;
        const s = this._renderVariantSelector(t, e, "lt-phrasescontent__row"), n = this._renderText.bind(this, t),
          i = this._renderText.bind(this, void 0);
        s.dataset.testid = "rephrase-suggestion", this._host.addEventListener(addUseCaptureEvent(s, "mouseover", n)), this._host.addEventListener(addUseCaptureEvent(s, "mouseout", i)), this._phrases.appendChild(s)
      }
      this._renderLoadMore(), this._updatePagination(), this._host.position()
    }
  }

  _renderLoadMore() {
    if (!this._phrases || !this._phrasesResult) return;
    const {wrapper: e, button: t} = this._host.createLoadMoreButton("rephrasings");
    this._host.addEventListener(addUseCaptureEvent(t, "click", (e => {
      e.stopImmediatePropagation(), this._showMorePhrases()
    }))), this._host.addInteractiveElement(t, (() => {
      var e;
      const t = `.lt-phrasescontent__row:nth-child(${this.ADJUSTED_BATCH_SIZE * this._visiblePhraseBatches})`,
        s = null === (e = this._phrases) || void 0 === e ? void 0 : e.querySelector(t);
      s && this._showMorePhrases(s)
    })), this._loadMore = e, this._phrases.appendChild(this._loadMore)
  }

  _renderVariantSelector(e, t, ...s) {
    const n = this._document.createElement("lt-div"), i = this._onPhraseClick.bind(this, t);
    return n.classList.add(...s), n.appendChild(this._createLabel(t.label)), this._host.addEventListener(addUseCaptureEvent(n, "click", i)), this._host.addInteractiveElement(n, i), this._renderNiceDiff(n, e), n
  }

  _renderNiceDiff(e, t) {
    const s = this._document.createElement("lt-div");
    for (const e of t) {
      if (Diff.isRewrite(t)) {
        s.textContent = Diff.toNewString(t);
        break
      }
      if (!e.value || !0 === e.removed) continue;
      let n = this._document.createTextNode(e.value);
      if (e.added) {
        const t = n;
        n = this._document.createElement("lt-span"), n.classList.add("lt-phrasescontent__diff-item"), n.classList.toggle("lt-phrasescontent__diff-item--added", !0 === e.added), n.appendChild(t)
      }
      s.appendChild(n)
    }
    e.appendChild(s)
  }

  _renderNotSupportedMessage() {
    if (!this._content || this._notSupported) return;
    this._notSupported = this._document.createElement("lt-div"), this._notSupported.classList.add("lt-phrasescontent__not-supported");
    const e = this._document.createElement("lt-div");
    e.classList.add("lt-phrasescontent__not-supported__image");
    const t = this._document.createElement("lt-div");
    t.classList.add("lt-phrasescontent__not-supported__heading"), t.textContent = PhrasesContent.MESSAGES.NOT_SUPPORTED_HEADING;
    const s = this._document.createElement("lt-div");
    s.classList.add("lt-phrasescontent__not-supported__text"), s.innerHTML = PhrasesContent.MESSAGES.NOT_SUPPORTED_TEXT, this._notSupported.appendChild(e), this._notSupported.appendChild(t), this._notSupported.appendChild(s), this._content.appendChild(this._notSupported)
  }

  _updatePagination() {
    var e, t;
    if (!this._phrases) return;
    const s = null !== (t = null === (e = this._phrasesResult) || void 0 === e ? void 0 : e.phrases.length) && void 0 !== t ? t : 0,
      n = this.ADJUSTED_BATCH_SIZE * this._visiblePhraseBatches, i = s > n;
    this._phrases.classList.toggle("lt-phrasescontent__phrases--truncated", i), this._phrases.dataset.visibleItems = String(n), this._phrases.dataset.testid = "rephrase-list"
  }

  _showMorePhrases(e) {
    var t, s;
    this._visiblePhraseBatches += 1, this._hasDanglingItem() && (this._visiblePhraseBatches += 1), this._host.clearDomMeasurementCache(), this._updatePagination(), null === (s = (t = this._host).updateFocus) || void 0 === s || s.call(t, null !== e ? e : void 0)
  }

  _onPhraseClick(e, t) {
    var s;
    t && t.stopImmediatePropagation(), this._userRevertedSentence = "user_" === e.label;
    const n = this._userRevertedSentence ? "reverted" : "selected";
    this._selectedVariant = e.text, this._host.dispatchRephraseClick(e.text), "number" == typeof (null === (s = this._selection) || void 0 === s ? void 0 : s.start) && this._host.dispatchFlashSentence(this._selection.start, e.text.length), Tracker.trackEvent("Action", `rephrasesV2:${n}`, e.label)
  }

  _loadRephrasings() {
    return __awaiter(this, void 0, void 0, (function* () {
      try {
        this._phrasesResult = yield EnvironmentAdapter.loadPhrases(hexToUuid(this._uniqueId), this._phrase, this._language, this._inhouseOnly), this._phrasesResult.phrases.length ? this._renderPhrases() : this._setMessage(PhrasesContent.MESSAGES.NO_RESULT)
      } catch (e) {
        const t = "ServerTimeout" === e.message ? PhrasesContent.MESSAGES.TIMEOUT : PhrasesContent.MESSAGES.ERROR;
        this._setMessage(t), Tracker.trackError("other", "phrases_card:load_failed", e.message)
      }
    }))
  }

  _reportPhrase() {
    var e;
    return __awaiter(this, void 0, void 0, (function* () {
      let t = !1, s = "Request failed";
      if (this._phrasesResult && !navigator.webdriver && !this._userRevertedSentence) {
        try {
          const e = Math.min(this._visiblePhraseBatches * this.ADJUSTED_BATCH_SIZE, this._phrasesResult.phrases.length);
          t = yield EnvironmentAdapter.reportPhrase(hexToUuid(this._uniqueId), {
            app: "extension",
            rephrases: this._phrasesResult.phrases.slice(0, e).map((({label: e, origin: t, text: s}) => ({
              label: e,
              origin: t,
              text: s
            }))),
            country: this._country,
            hostname: location.hostname,
            hasSubscription: this._hasSubscription,
            userLanguage: this._userLanguage,
            textLanguage: this._language,
            userAgent: navigator.userAgent,
            preferredLanguages: this._preferredLanguages,
            hardwareConcurrency: navigator.hardwareConcurrency,
            hasGrammarMistakes: this._hasGrammarMistakes,
            hasSpellingMistakes: this._hasSpellingMistakes,
            chosenSentence: this._selectedVariant,
            originalSentence: this._phrase
          })
        } catch (t) {
          s = null !== (e = t.message) && void 0 !== e ? e : ""
        }
        t || Tracker.trackError("other", "phrases_card:report_failed", s)
      }
    }))
  }

  _getSentence() {
    if (this._selection) return this._selection;
    if (void 0 === this._sentenceRanges) return;
    const e = this._sentenceRanges.find((({
                                            start: e,
                                            end: t
                                          }) => e <= this._anchorSelection.start && t >= this._anchorSelection.end));
    if ("number" == typeof (null == e ? void 0 : e.start) && "number" == typeof (null == e ? void 0 : e.end)) {
      const {start: t, end: s} = e;
      return {start: t, end: s}
    }
  }

  _hasDanglingItem() {
    return !!this._phrasesResult && this._phrasesResult.phrases.length - this._visiblePhraseBatches * this.ADJUSTED_BATCH_SIZE == 1
  }

  _checkConfirmation(e) {
    var t;
    if (this._isAllowed || !1 === this._isEnabled) return e();
    if (this._confirmation) return;
    this._confirmation = this._document.createElement("lt-div"), this._confirmation.classList.add("lt-phrases-confirmation");
    const s = this._document.createElement("lt-div");
    s.classList.add("lt-phrases-confirmation__content");
    const n = this._document.createElement("lt-div");
    n.classList.add("lt-phrases-confirmation__heading"), n.textContent = PhrasesContent.MESSAGES.CONFIRMATION_HEADING;
    const i = this._document.createElement("lt-div");
    i.classList.add("lt-phrases-confirmation__text"), i.innerHTML = PhrasesContent.MESSAGES.CONFIRMATION_TEXT;
    const a = this._document.createElement("lt-span");
    a.classList.add("lt-phrases-confirmation__button"), a.textContent = PhrasesContent.MESSAGES.CONFIRMATION_BUTTON, this._host.addEventListener(addUseCaptureEvent(a, "click", this._handleConfirmation.bind(this, e))), s.appendChild(n), s.appendChild(i), s.appendChild(a), this._confirmation.appendChild(s), null === (t = this._content) || void 0 === t || t.appendChild(this._confirmation), Tracker.trackEvent("Action", "rephrasesV2:privacy_confirmation_required")
  }
}

PhrasesContent.REPHRASE_SENTENCE_LANGUAGES = ["en"], PhrasesContent._isInitialized = !1, PhrasesContent._constructor();