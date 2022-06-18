var __awaiter = this && this.__awaiter || function (t, n, e, s) {
  return new (e || (e = Promise))((function (o, i) {
    function a(t) {
      try {
        r(s.next(t))
      } catch (t) {
        i(t)
      }
    }

    function d(t) {
      try {
        r(s.throw(t))
      } catch (t) {
        i(t)
      }
    }

    function r(t) {
      var n;
      t.done ? o(t.value) : (n = t.value, n instanceof e ? n : new e((function (t) {
        t(n)
      }))).then(a, d)
    }

    r((s = s.apply(t, n || [])).next())
  }))
};

class SynonymsContent {
  constructor(t, n, e, s, o) {
    this.SYNONYMS_BATCH_SIZE = 3, this.MAX_SYNONYMS_PER_ROW = 3, this._rendered = !1, this._tts = [], this._destroyed = !1, this._visibleSynonymBatches = 1, this._container = t, this._document = t.ownerDocument, this._wordContext = n, this._language = e, this._motherLanguage = s, this._host = o, this._tts = [n.word], this.selection = {
      start: n.position.start,
      end: n.position.end
    }
  }

  static _cacheMessages() {
    SynonymsContent.MESSAGES = {
      HEADLINE: i18nManager.getMessage("synonymsCardHeadline"),
      LOADING: i18nManager.getMessage("synonymsCardLoading"),
      ERROR: i18nManager.getMessage("synonymsCardGeneralError"),
      NO_SYNONYMS_FOUND: i18nManager.getMessage("synonymsCardNoSynonymsAvailable"),
      LANGUAGE_NOT_SUPPORTED: i18nManager.getMessage("synonymsCardLanguageNotSupported"),
      READ_TEXT: i18nManager.getMessage("synonymsCardTooltipReadText"),
      MORE: i18nManager.getMessage("synonymsCardMore")
    }
  }

  static _constructor() {
    SynonymsContent._isInitialized || (SynonymsContent._cacheMessages(), i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, SynonymsContent._cacheMessages.bind(SynonymsContent)), SynonymsContent._isInitialized = !0)
  }

  render() {
    var t, n;
    return __awaiter(this, void 0, void 0, (function* () {
      if (!this._rendered && !this._destroyed) return this._host.addEventListener(addUseCaptureEvent(this._container, "mousedown", (t => {
        t.stopImmediatePropagation(), t.target && !t.target.closest(".lt-synonymscontent__synonym-title, .lt-card__headline") && t.preventDefault()
      }))), this._content = this._document.createElement("lt-div"), this._content.classList.add("lt-card__pane__content"), this._intro = this._document.createElement("lt-div"), this._intro.classList.add("lt-synonymscontent__intro"), null === (t = this._content) || void 0 === t || t.appendChild(this._intro), this._renderIntro(), this._renderSynonymsPlaceholder(), null === (n = this._container) || void 0 === n || n.appendChild(this._content), this._rendered = !0, this._loadSynonyms()
    }))
  }

  show() {
    this._content && (this._content.classList.remove("lt-card__pane__content--hidden"), this._host.position()), this._host.updateSelection(this.selection), this._host.dispatchHighlight()
  }

  hide() {
    this._content && this._content.classList.add("lt-card__pane__content--hidden")
  }

  destroy() {
    this._destroyed = !0
  }

  _setMessage(t) {
    if (this._synonyms) {
      const n = this._document.createElement("lt-div");
      n.classList.add("lt-rephrasecontent__message"), n.textContent = t, this._synonyms.innerHTML = "", this._synonyms.appendChild(n)
    }
  }

  _loadSynonyms() {
    let t, n = LanguageManager.getPrimaryLanguageCode(this._language);
    const e = new Promise((n => t = n));
    if ("de-ch" === this._language.toLowerCase() && (n = "de-CH"), -1 === config.SUPPORTED_SYNONYM_LANGUAGES.indexOf(n)) return this.render(), this._renderIntro(), this._setMessage(SynonymsContent.MESSAGES.LANGUAGE_NOT_SUPPORTED), requestAnimationFrame((() => t())), e;
    const s = Date.now(), o = window.setTimeout((() => {
      this.render(), t()
    }), 400);
    return EnvironmentAdapter.loadSynonyms(this._wordContext, n, this._motherLanguage).then((t => {
      window.clearTimeout(o);
      const n = Date.now() - s;
      return wait(Math.max(0, 400 - n), t)
    })).then((n => {
      this._destroyed || (this._synonymResult = n, this.render(), this._renderIntro(), this._renderSynonyms(), this._host.updateFocus(), t(), n.genders && n.genders.length && (this._tts = [], n.genders[0].display.toLowerCase().includes(this._wordContext.word.toLowerCase()) || this._tts.push(this._wordContext.word), n.genders.forEach((t => {
        this._tts.push(t.display)
      }))))
    })).catch((n => {
      this._destroyed || (window.clearTimeout(o), this.render(), this._renderIntro(), this._setMessage(SynonymsContent.MESSAGES.ERROR), t(), Tracker.trackEvent("Other-Error", "synonym_card:load_failed", n && n.message))
    })), e
  }

  _renderIntro() {
    var t, n;
    if (!this._intro) return;
    const e = null === (t = this._synonymResult) || void 0 === t ? void 0 : t.genders;
    let s;
    if (this._intro.innerHTML = "", null == e ? void 0 : e.length) {
      const [t, ...n] = e[0].display.split(/\s+/), o = e.map((({displayType: t}) => t)).filter(Boolean),
        i = e.map((({display: t}) => t.split(/\s+/).shift()));
      s = this._createCaption(`${i.join("/")} ${n.join(" ")}`, o.join("/"))
    } else s = this._createCaption(this._wordContext.word);
    if (this._intro.appendChild(s), TextToSpeech.isSupported() && TextToSpeech.supportsLanguage(this._language) && TextToSpeech.supportsWord(this._wordContext.word)) {
      const t = {label: SynonymsContent.MESSAGES.READ_TEXT, position: "bottom-right"};
      this._readIcon = new Icon("audio", null, t, this._intro), this._host.addEventListener(addUseCaptureEvent(null === (n = this._readIcon) || void 0 === n ? void 0 : n.getElement(), "click", this._onReadOutLoudClicked.bind(this)))
    }
  }

  _renderSynonymsPlaceholder() {
    this._content && (this._synonyms = this._document.createElement("lt-div"), this._synonyms.classList.add("lt-synonymscontent__synonyms"), this._setMessage(SynonymsContent.MESSAGES.LOADING), this._content.appendChild(this._synonyms))
  }

  _renderSynonyms() {
    if (this._synonymResult && this._content && this._synonyms) {
      if (this._synonyms.innerHTML = "", !this._synonymResult.synonymSets.length) {
        const t = this._document.createElement("lt-div");
        return t.classList.add("lt-card__no-synonyms"), t.textContent = SynonymsContent.MESSAGES.NO_SYNONYMS_FOUND, void this._synonyms.appendChild(t)
      }
      if (!this._synonymsHeadline && (this._synonymsHeadline = this._document.createElement("lt-div"), this._synonymsHeadline.classList.add("lt-card__headline", "lt-card__headline--rephrase"), this._synonymsHeadline.textContent = SynonymsContent.MESSAGES.HEADLINE, this._content.insertBefore(this._synonymsHeadline, this._synonyms), !this._language.startsWith("de") && !BrowserDetector.isSafari())) {
        const t = this._document.createElement("lt-span");
        t.classList.add("lt-card__beta-sign"), t.textContent = "Beta", this._synonymsHeadline.appendChild(t)
      }
      if (this._synonymResult.synonymSets.forEach((t => {
        const n = this._document.createElement("lt-div");
        n.classList.add("lt-synonymscontent__row");
        const e = this._document.createElement("lt-div");
        if (e.classList.add("lt-synonymscontent__synonym-title"), e.textContent = t.title, n.appendChild(e), t.synonyms.forEach((t => {
          const e = this._document.createElement("lt-div");
          e.classList.add("lt-synonymscontent__synonym"), e.textContent = t.word, t.hints.forEach((t => {
            const n = this._document.createElement("lt-span");
            n.classList.add("lt-card__hint"), n.textContent = t, e.appendChild(n)
          }));
          const s = this._onSynonymClick.bind(this, t.word);
          this._host.addEventListener(addUseCaptureEvent(e, "click", s)), n.appendChild(e), this._host.addInteractiveElement(e, s)
        })), t.synonyms.length > this.MAX_SYNONYMS_PER_ROW + 1) {
          n.classList.add("lt-synonymscontent__row__limited");
          const t = this._document.createElement("lt-div");
          t.classList.add("lt-synonymscontent__row__expand"), t.textContent = SynonymsContent.MESSAGES.MORE;
          const e = this._onShowMoreClick.bind(this, n);
          this._host.addEventListener(addUseCaptureEvent(t, "click", e)), n.appendChild(t), this._host.addInteractiveElement(t, (() => {
            var t, s;
            e();
            const o = `.lt-synonymscontent__synonym:nth-child(n + ${this.MAX_SYNONYMS_PER_ROW + 1})`,
              i = n.querySelector(o);
            i && (null === (s = (t = this._host).updateFocus) || void 0 === s || s.call(t, i))
          }))
        }
        this._synonyms.appendChild(n)
      })), !this._language.startsWith("de") && this._synonyms.lastElementChild) {
        const t = this._document.createElement("lt-div");
        t.classList.add("lt-synonymscontent__info-text"), t.innerHTML = "Source: ";
        const n = this._document.createElement("lt-span");
        n.textContent = this._synonymResult.dataSource.sourceName, t.appendChild(n), this._host.addEventListener(addUseCaptureEvent(n, "click", (t => {
          t.stopImmediatePropagation(), this._synonymResult && window.open(this._synonymResult.dataSource.sourceUrl, "_blank")
        }))), this._synonyms.lastElementChild.appendChild(t)
      }
      this._renderLoadMore(), this._updatePagination(), this._host.position()
    }
  }

  _renderLoadMore() {
    if (!this._synonyms || !this._synonymResult || this._synonymResult.synonymSets.length <= this.SYNONYMS_BATCH_SIZE) return;
    const {wrapper: t, button: n} = this._host.createLoadMoreButton("synonyms");
    this._host.addEventListener(addUseCaptureEvent(n, "click", (t => {
      t.stopImmediatePropagation(), this._showMoreSynonyms()
    }))), this._host.addInteractiveElement(n, (() => {
      var t;
      const n = `.lt-synonymscontent__row:nth-child(${this.SYNONYMS_BATCH_SIZE * this._visibleSynonymBatches}) lt-div:last-child`,
        e = null === (t = this._synonyms) || void 0 === t ? void 0 : t.querySelector(n);
      e && this._showMoreSynonyms(e)
    })), this._loadMore = t, this._synonyms.appendChild(this._loadMore)
  }

  _createCaption(t, n) {
    const e = t.trim().split(/'| /), s = this._document.createElement("lt-div");
    if (s.classList.add("lt-synonymscontent__intro__caption"), e.length > 1) {
      const n = this._document.createElement("lt-span");
      n.classList.add("lt-synonymscontent__intro__article"), n.textContent = e[0] + (t.includes("'") ? "'" : ""), s.appendChild(n);
      const o = this._document.createElement("lt-span");
      o.textContent = e[1], s.appendChild(o)
    } else {
      const t = this._document.createElement("lt-span");
      t.textContent = e[0], s.appendChild(t)
    }
    if (n) {
      const t = this._document.createElement("lt-span");
      t.classList.add("lt-synonymscontent__intro__gender"), t.textContent = `(${n})`, s.appendChild(t)
    }
    return s
  }

  _updatePagination() {
    var t, n;
    if (!this._synonyms) return;
    const e = null !== (n = null === (t = this._synonymResult) || void 0 === t ? void 0 : t.synonymSets.length) && void 0 !== n ? n : 0,
      s = this.SYNONYMS_BATCH_SIZE * this._visibleSynonymBatches, o = e > s;
    this._synonyms.classList.toggle("lt-synonymscontent__synonyms--truncated", o), this._synonyms.dataset.visibleItems = String(s)
  }

  _showMoreSynonyms(t) {
    var n, e;
    this._visibleSynonymBatches += 1, this._host.clearDomMeasurementCache(), this._updatePagination(), null === (e = (n = this._host).updateFocus) || void 0 === e || e.call(n, null !== t ? t : void 0)
  }

  _onSynonymClick(t, n) {
    n && n.stopImmediatePropagation(), this._host.dispatchRephraseClick(t)
  }

  _onReadOutLoudClicked() {
    TextToSpeech.isPlaying() ? (TextToSpeech.stop(), this._readIcon && this._readIcon.setIcon("audio")) : (TextToSpeech.playMany(this._tts, this._language, (() => {
      var t;
      null === (t = this._readIcon) || void 0 === t || t.setIcon("audio")
    })), this._readIcon && this._readIcon.setIcon("audio_play"))
  }

  _onShowMoreClick(t) {
    t.classList.add("lt-synonymscontent__row--expanded"), this._host.position()
  }
}

SynonymsContent._isInitialized = !1, SynonymsContent._constructor();