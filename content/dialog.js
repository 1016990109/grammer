/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
var __awaiter = this && this.__awaiter || function (e, t, n, o) {
  return new (n || (n = Promise))((function (i, s) {
    function a(e) {
      try {
        l(o.next(e))
      } catch (e) {
        s(e)
      }
    }

    function r(e) {
      try {
        l(o.throw(e))
      } catch (e) {
        s(e)
      }
    }

    function l(e) {
      var t;
      e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
        e(t)
      }))).then(a, r)
    }

    l((o = o.apply(e, t || [])).next())
  }))
};

class Dialog {
  constructor(e, t, n, o, i) {
    this._menus = [], this._allDisplyedErrorsCount = 0, this._toolbarContainer = e, this._appearance = t, this._uiOptions = i, this._document = this._toolbarContainer.ownerDocument, this._languageCode = n, this._onCloseClick = this._onCloseClick.bind(this), this._onUnload = this._onUnload.bind(this), window.addEventListener("pagehide", this._onUnload, !0), this._controls = {}, this._eventListeners = [], this._render().then((() => {
      this.setCurrentLanguage(n || LanguageManager.getUserLanguageCode()), this.setCountOptions({
        mode: "words",
        counts: {words: 0, characters: 0, sentences: 0}
      }), this.updateState(o)
    })), this._eventListeners.push(addUseCaptureEvent(document, "keydown", this._onKeydown.bind(this))), this._inApplyFixMode = !1, this._inInsignificantChangeMode = !0, this._shouldShowRatingTeaser = !o.displayedPremiumErrors.length && !this._controls.teaserElement && !this._uiOptions.disableRatingTeaser && EnvironmentAdapter.isRuntimeConnected() && 0 === Math.floor(2 * Math.random())
  }

  _render() {
    return __awaiter(this, void 0, void 0, (function* () {
      if (this._controls.container) return;
      this._controls.container = createContainerElement(this._document, Dialog.CONTAINER_ELEMENT_NAME);
      const e = e => {
        e.stopImmediatePropagation()
      };
      this._eventListeners.push(addUseCaptureEvent(this._controls.container, "mousedown", (t => {
        if (t.target === this._controls.languageSelector.getSelect()) {
          const e = e => {
            e.stopImmediatePropagation()
          };
          document.addEventListener("blur", e, !0), setTimeout((() => {
            document.removeEventListener("blur", e, !0)
          }), 10)
        }
        if (t.target === this._controls.countSelector.getSelect()) {
          const e = e => {
            e.stopImmediatePropagation()
          };
          document.addEventListener("blur", e, !0), setTimeout((() => {
            document.removeEventListener("blur", e, !0)
          }), 10)
        }
        t.target instanceof HTMLElement && t.target.closest("[data-lt-prevent-focus]") && t.preventDefault(), e(t)
      })), addUseCaptureEvent(this._controls.container, "mouseup", e), addUseCaptureEvent(this._controls.container, "pointerdown", e), addUseCaptureEvent(this._controls.container, "pointerup", e), addUseCaptureEvent(this._controls.container, "focusin", e), addUseCaptureEvent(this._controls.container, "focusout", e)), this._controls.container.addEventListener("click", e), this._controls.innerContainer = this._document.createElement("lt-div"), this._controls.innerContainer.classList.add("lt-dialog__container", "notranslate"), BrowserDetector.isSafari() && this._controls.innerContainer.classList.add("lt-dialog__container--safari"), this._appearance.canDisplayAllSuggestions() || this._controls.innerContainer.classList.add("lt-dialog__container--small"), this._controls.container.appendChild(this._controls.innerContainer), this._controls.header = this._document.createElement("lt-div"), this._controls.header.className = "lt-dialog__header", this._controls.innerContainer.appendChild(this._controls.header);
      const t = this._document.createElement("lt-div");
      t.className = "lt-dialog__header__logo-wrapper", this._controls.logo = this._document.createElement("lt-div"), this._controls.logo.classList.add("lt-dialog__logo", "lt-icon__lt"), t.appendChild(this._controls.logo), this._uiOptions.isPremiumAccount || (this._controls.packageBadge = new PackageBadge(null, "basic", "default", t), this._eventListeners.push(addUseCaptureEvent(this._controls.packageBadge.getElement(), "click", this._onBadgeClicked.bind(this)))), this._controls.header.appendChild(t), this._controls.headerScoreProgress = this._document.createElement("lt-div"), this._controls.headerScoreProgress.className = "lt-dialog__header__progress-score", this._controls.header.appendChild(this._controls.headerScoreProgress), this._controls.headerScoreProgressBar = this._document.createElement("lt-div"), this._controls.headerScoreProgressBar.className = "lt-dialog__header__progress-score__bar", this._controls.headerScoreProgress.appendChild(this._controls.headerScoreProgressBar), this._controls.headerControlsWrapper = this._document.createElement("lt-div"), this._controls.headerControlsWrapper.className = "lt-dialog__header__controls-wrapper";
      const n = this._document.createElement("select");
      if (Dialog.MESSAGES.LANGUAGES.forEach((e => {
        const t = this._document.createElement("option");
        t.value = e.code, t.textContent = e.name, n.appendChild(t)
      })), EnvironmentAdapter.isRuntimeConnected()) {
        const e = yield EnvironmentAdapter.getPreferredLanguages();
        if (!n || !e.length) return;
        const t = n.value, o = this._document.createElement("optgroup");
        o.label = Dialog.MESSAGES.ALL_LANGUAGES, Array.from(n.children).forEach((e => {
          o.append(e)
        }));
        const i = this._document.createElement("optgroup");
        i.label = Dialog.MESSAGES.RECOMMENDED_LANGUAGES, e.forEach((e => {
          const t = LanguageManager.LANGUAGES.find((t => t.code.startsWith(e.toLowerCase())));
          if (t) {
            const e = this._document.createElement("option");
            e.value = t.code, e.textContent = t.name, i.appendChild(e)
          }
        })), n.append(i), n.append(o), n.value = t
      }
      if (this._controls.languageSelector = new Select("language-select", this._controls.headerControlsWrapper, n), this._eventListeners.push(addUseCaptureEvent(this._controls.languageSelector.getSelect(), "change", this._onLanguageChange.bind(this))), !this._uiOptions.disableSaveDocument) {
        const e = {label: Dialog.MESSAGES.SAVE_TEXT_TOOLTIP, position: "top-center"};
        this._controls.saveIcon = new Icon("save", null, e, this._controls.headerControlsWrapper), this._eventListeners.push(addUseCaptureEvent(this._controls.saveIcon.getElement(), "click", this._onSaveTextClick.bind(this)))
      }
      if (this._appearance.isPositionVisible() && EnvironmentAdapter.isRuntimeConnected()) {
        const e = this._document.createElement("lt-div");
        e.className = "lt-icon-group", this._controls.headerControlsWrapper.appendChild(e);
        const t = {label: Dialog.MESSAGES.DIALOG_POSITION_TOOLTIP, position: "bottom-right"};
        this._controls.positionIcon = new Icon(this._uiOptions.dialogPosition, null, t, e);
        const n = [{
          className: "default",
          label: Dialog.MESSAGES.POSITION_DEFAULT_MENU_ITEM,
          info: null,
          tag: null,
          isClickable: !0
        }, {
          className: "right",
          label: Dialog.MESSAGES.POSITION_RIGHT_MENU_ITEM,
          info: null,
          tag: null,
          isClickable: !0
        }, {className: "left", label: Dialog.MESSAGES.POSITION_LEFT_MENU_ITEM, info: null, tag: null, isClickable: !0}];
        this._controls.positionMenu = new Menu("position", n, this._controls.positionIcon.getElement(), this._controls.innerContainer, "bottom", !0), this._menus.push(this._controls.positionMenu);
        const o = this._controls.positionMenu.getAllOptions();
        this._eventListeners.push(addUseCaptureEvent(o[0], "click", this._onPositionDialogClick.bind(this)), addUseCaptureEvent(o[1], "click", this._onPositionRightClick.bind(this)), addUseCaptureEvent(o[2], "click", this._onPositionLeftClick.bind(this)), addUseCaptureEvent(this._controls.positionMenu.getOverlay(), "click", this._onPositionOverlayClick.bind(this)), addUseCaptureEvent(this._controls.positionIcon.getElement(), "click", this._onPositionIconClick.bind(this)))
      }
      this._controls.closeIcon = new Icon("close_filled", null, null, this._controls.headerControlsWrapper), this._eventListeners.push(addUseCaptureEvent(this._controls.logo, "click", this._gotoLanguageTool.bind(this)), addUseCaptureEvent(this._controls.closeIcon.getElement(), "click", this._onCloseClick)), this._controls.content = this._document.createElement("lt-div"), this._controls.content.className = "lt-dialog__content", this._controls.innerContainer.appendChild(this._controls.content), this._eventListeners.push(addUseCaptureEvent(this._controls.content, "scroll", this._onContentScroll.bind(this))), this._controls.contentTop = this._document.createElement("lt-div"), this._controls.contentTop.className = "lt-dialog__content__top", this._controls.content.appendChild(this._controls.contentTop), this._controls.contentMain = this._document.createElement("lt-div"), this._controls.contentMain.className = "lt-dialog__content__main", this._controls.content.appendChild(this._controls.contentMain), this._controls.contentBottom = this._document.createElement("lt-div"), this._controls.contentBottom.className = "lt-dialog__content__bottom", this._controls.content.appendChild(this._controls.contentBottom), this._controls.footer = this._document.createElement("lt-div"), this._controls.footer.className = "lt-dialog__footer", this._controls.loadingBar = this._document.createElement("lt-div"), this._controls.loadingBar.className = "lt-dialog__footer__loading-bar-container";
      const o = this._document.createElement("lt-div");
      o.classList.add("lt-dialog__footer__loading-bar-container__loading-bar", "lt-dialog__footer__loading-bar-container__loading-bar--loading-bar-1");
      const i = this._document.createElement("lt-div");
      i.classList.add("lt-dialog__footer__loading-bar-container__loading-bar", "lt-dialog__footer__loading-bar-container__loading-bar--loading-bar-2");
      const s = this._document.createElement("lt-div");
      s.classList.add("lt-dialog__footer__loading-bar-container__loading-bar", "lt-dialog__footer__loading-bar-container__loading-bar--loading-bar-3"), this._controls.loadingBar.appendChild(o), this._controls.loadingBar.appendChild(i), this._controls.loadingBar.appendChild(s), this._controls.footer.appendChild(this._controls.loadingBar);
      const a = [{
          label: Dialog.MESSAGES.COUNTER_CHARACTERS_OPTION,
          value: "characters"
        }, {
          label: Dialog.MESSAGES.COUNTER_WORDS_OPTION,
          value: "words"
        }, {label: Dialog.MESSAGES.COUNTER_SENTENCES_OPTION, value: "sentences"}],
        r = this._document.createElement("select");
      if (a.forEach((e => {
        const t = this._document.createElement("option");
        t.value = e.value, t.textContent = e.label, r.appendChild(t)
      })), this._controls.countSelector = new Select("countSelect", this._controls.footer, r), this._controls.footerControlsWrapper = this._document.createElement("lt-div"), this._controls.footerControlsWrapper.className = "lt-dialog__footer__controls-wrapper", this._controls.footer.appendChild(this._controls.footerControlsWrapper), this._eventListeners.push(addUseCaptureEvent(this._controls.countSelector.getSelect(), "change", this._onCountChange.bind(this))), this._uiOptions.disableHelpCenter || this._uiOptions.disableFeedbackForm) if (this._uiOptions.disableFeedbackForm) {
        if (!this._uiOptions.disableHelpCenter) {
          const e = {label: Dialog.MESSAGES.HELP_CENTER_TOOLTIP, position: "top-right"};
          this._controls.sendFeedback = new Icon("help", null, e, this._controls.footerControlsWrapper), this._controls.footerControlsWrapper.appendChild(this._controls.sendFeedback.getElement()), this._eventListeners.push(addUseCaptureEvent(this._controls.sendFeedback.getElement(), "click", this._gotoHelpCenter.bind(this)))
        }
      } else {
        const e = {label: Dialog.MESSAGES.SEND_FEEDBACK_TOOLTIP, position: "top-right"};
        this._controls.sendFeedback = new Icon("feedback", null, e, this._controls.footerControlsWrapper), this._controls.footerControlsWrapper.appendChild(this._controls.sendFeedback.getElement()), this._eventListeners.push(addUseCaptureEvent(this._controls.sendFeedback.getElement(), "click", this._showFeedbackForm.bind(this)))
      } else {
        const e = {label: Dialog.MESSAGES.HELP_TOOLTIP, position: "top-right"};
        this._controls.sendFeedback = new Icon("help", null, e, this._controls.footerControlsWrapper), this._controls.footerControlsWrapper.appendChild(this._controls.sendFeedback.getElement());
        const t = [{
          className: "help",
          label: Dialog.MESSAGES.HELP_CENTER_TOOLTIP,
          info: null,
          tag: null,
          isClickable: !0,
          isSelectable: !1
        }, {
          className: "feedback",
          label: Dialog.MESSAGES.SEND_FEEDBACK_TOOLTIP,
          info: null,
          tag: null,
          isClickable: !0
        }];
        this._controls.helpMenu = new Menu("help", t, this._controls.sendFeedback.getElement(), this._controls.innerContainer, "top", !1, null), this._menus.push(this._controls.helpMenu);
        const n = this._controls.helpMenu.getAllOptions();
        this._eventListeners.push(addUseCaptureEvent(n[0], "click", this._gotoHelpCenter.bind(this)), addUseCaptureEvent(n[1], "click", this._showFeedbackForm.bind(this)), addUseCaptureEvent(this._controls.helpMenu.getOverlay(), "click", this._onHelpOverlayClick.bind(this)), addUseCaptureEvent(this._controls.sendFeedback.getElement(), "click", this._onHelpIconClick.bind(this)))
      }
      if (!this._uiOptions.disableTurnOff) {
        const e = {label: Dialog.MESSAGES.DISABLE_CHECKING_TOOLTIP, position: "top-right"};
        this._controls.disableIcon = new Icon("disable", null, e, this._controls.footerControlsWrapper);
        const t = [{
          className: "pause",
          label: Dialog.MESSAGES.PAUSE_CHECKING_MENU_ITEM,
          info: null,
          tag: null,
          isClickable: !0
        }, {
          className: "disable",
          label: Dialog.MESSAGES.DISABLE_CHECKING_MENU_ITEM,
          info: null,
          tag: null,
          isClickable: !0
        }];
        this._controls.disableMenu = new Menu("disable", t, this._controls.disableIcon.getElement(), this._controls.innerContainer, "top", !1), this._menus.push(this._controls.disableMenu);
        const n = this._controls.disableMenu.getAllOptions();
        this._eventListeners.push(addUseCaptureEvent(n[0], "click", this._onPauseCheckingClick.bind(this)), addUseCaptureEvent(n[1], "click", this._onTurnOffClick.bind(this)), addUseCaptureEvent(this._controls.disableMenu.getOverlay(), "click", this._onDisableOverlayClick.bind(this)), addUseCaptureEvent(this._controls.disableIcon.getElement(), "click", this._onDisableIconClicked.bind(this)))
      }
      if (!this._uiOptions.disableOptionsPage) {
        const e = {label: Dialog.MESSAGES.SETTINGS_TOOLTIP, position: "top-right"};
        this._controls.optionsIcon = new Icon("options", null, e, this._controls.footerControlsWrapper), this._eventListeners.push(addUseCaptureEvent(this._controls.optionsIcon.getElement(), "click", this._onOptionsClick.bind(this)))
      }
      this._controls.incompleteResult = this._document.createElement("lt-div"), this._controls.incompleteResult.className = "lt-dialog__incomplete-result", this._controls.incompleteResult.textContent = Dialog.MESSAGES.INCOMPLETE_RESULT, this._controls.footer.appendChild(this._controls.incompleteResult), this._controls.pointer = this._document.createElement("lt-span"), this._controls.pointer.className = "lt-dialog__pointer", this._controls.innerContainer.appendChild(this._controls.pointer), this._toolbarContainer.appendChild(this._controls.container), this._toolbarContainer.classList.add("lt-toolbar--dialog-opened"), EnvironmentAdapter.isRuntimeConnected() && (this._controls.innerContainer.appendChild(this._controls.footer), this._controls.header.appendChild(this._controls.headerControlsWrapper));
      const l = this._toolbarContainer.querySelector(".lt-toolbar__status-icon-has-notification");
      l && l.classList.remove("lt-toolbar__status-icon-has-notification")
    }))
  }

  _position(e = null) {
    const t = this._controls.container.ownerDocument.body.offsetWidth,
      n = EnvironmentAdapter.isRuntimeConnected() && this._appearance.isPositionVisible() && t > 400 ? e || this._uiOptions.dialogPosition : "default";
    if (this._uiOptions.dialogPosition = n, this._controls.innerContainer.classList.remove("lt-dialog__container--fixed-right"), this._controls.innerContainer.classList.remove("lt-dialog__container--fixed-left"), "default" === n) {
      !this._controls.positionMenu || this._controls.positionMenu.toggleActive(0, !0, !0);
      let e = this._controls.innerContainer.getBoundingClientRect();
      const t = document.doctype ? this._document.documentElement.clientWidth : Math.min(this._document.documentElement.clientWidth, document.body.clientWidth);
      e.right >= t - Dialog.SPACE_TO_SCREEN_EDGE && this._alignToBottom(), e = this._controls.innerContainer.getBoundingClientRect();
      const n = document.doctype ? this._document.documentElement.clientHeight : Math.min(this._document.documentElement.clientHeight, document.body.clientHeight);
      e.bottom >= n && this._alignToTop(), e = this._controls.innerContainer.getBoundingClientRect(), e.top <= Dialog.SPACE_TO_SCREEN_EDGE && this._alignToBottom(), e.top < 0 && !isScrollable(document.body) && !isScrollable(document.documentElement) && this._alignToBottom()
    } else "right" === n ? (!this._controls.positionMenu || this._controls.positionMenu.toggleActive(1, !0, !0), this._controls.innerContainer.style.removeProperty("right"), this._controls.innerContainer.style.removeProperty("left"), this._controls.innerContainer.classList.remove("lt-dialog__container-top"), this._controls.innerContainer.classList.remove("lt-dialog__container-bottom"), this._controls.innerContainer.classList.add("lt-dialog__container--fixed-right")) : "left" === n && (!this._controls.positionMenu || this._controls.positionMenu.toggleActive(2, !0, !0), this._controls.innerContainer.style.removeProperty("right"), this._controls.innerContainer.style.removeProperty("left"), this._controls.innerContainer.classList.remove("lt-dialog__container-top"), this._controls.innerContainer.classList.remove("lt-dialog__container-bottom"), this._controls.innerContainer.classList.add("lt-dialog__container--fixed-left"))
  }

  _alignToBottom() {
    const e = new DomMeasurement(this._document);
    this._controls.innerContainer.classList.remove("lt-dialog__container-top"), this._controls.innerContainer.classList.add("lt-dialog__container-bottom");
    const t = this._controls.innerContainer.getBoundingClientRect();
    if (t.left <= Dialog.SPACE_TO_SCREEN_EDGE) {
      const n = parseInt(e.getStyle(this._controls.innerContainer, "right"), 10) + t.left - Dialog.SPACE_TO_SCREEN_EDGE,
        o = parseInt(e.getStyle(this._controls.pointer, "right"), 10) - t.left + Dialog.SPACE_TO_SCREEN_EDGE;
      e.setStyles(this._controls.innerContainer, {
        right: n + "px !important",
        left: "auto !important"
      }), e.setStyles(this._controls.pointer, {right: o + "px !important", left: "auto !important"})
    }
    if (t.right > this._document.documentElement.clientWidth) {
      e.setStyles(this._controls.innerContainer, {right: "0px !important", left: "auto !important"});
      const n = parseInt(e.getStyle(this._controls.pointer, "right"), 10) + (this._controls.innerContainer.getBoundingClientRect().right - t.right);
      e.setStyles(this._controls.pointer, {right: n + "px !important", left: "auto !important"})
    }
  }

  _alignToTop() {
    this._controls.innerContainer.classList.remove("lt-dialog__container-bottom"), this._controls.innerContainer.classList.add("lt-dialog__container-top");
    const e = this._controls.innerContainer.getBoundingClientRect(), t = new DomMeasurement(this._document);
    if (this._controls.innerContainer.classList.add("lt-dialog__container-hide"), e.right >= this._document.documentElement.clientWidth - Dialog.SPACE_TO_SCREEN_EDGE) {
      const n = parseInt(t.getStyle(this._controls.innerContainer, "left"), 10) - (e.right - this._document.documentElement.clientWidth) - Dialog.SPACE_TO_SCREEN_EDGE,
        o = parseInt(t.getStyle(this._controls.pointer, "left"), 10) + (e.right - this._document.documentElement.clientWidth) + Dialog.SPACE_TO_SCREEN_EDGE;
      t.setStyles(this._controls.innerContainer, {
        left: n + "px !important",
        right: "auto !important"
      }), t.setStyles(this._controls.pointer, {left: o + "px !important", right: "auto !important"})
    }
    this._controls.innerContainer.classList.remove("lt-dialog__container-hide")
  }

  _removeTeaser() {
    this._controls.teaserElement && (this._controls.teaserElement.remove(), this._controls.teaserElement = void 0)
  }

  _updateContent() {
    if (!this._controls.content) return;
    this.closeAllMenus();
    const e = this._state.checkStatus;
    this._controls.content.classList.remove("lt-dialog__has-errors"), this._controls.content.classList.remove("lt-dialog__is-loading"), this._controls.contentMain.innerHTML = "", this._controls.contentTop.innerHTML = "", this._controls.contentBottom.innerHTML = "", this.setCountOptions(this._state.countOptions);
    const t = (this._inApplyFixMode || this._inInsignificantChangeMode) && e === CHECK_STATUS.IN_PROGRESS && this._allDisplyedErrorsCount > 0;
    this._showLoadingBar(t);
    const n = e === CHECK_STATUS.NEEDS_LANGUAGE_HINT;
    if (this._controls.languageSelector.toggleHighlight(n), t ? (this._renderHeadline(), this._renderCompletedState()) : e === CHECK_STATUS.IN_PROGRESS ? (this._renderHeadline(), this._renderInProgressState()) : e === CHECK_STATUS.COMPLETED ? (this._renderHeadline(), this._renderCompletedState()) : e === CHECK_STATUS.DISABLED ? this._renderDisabledState() : e === CHECK_STATUS.TEXT_TOO_SHORT ? (this._renderHeadline(), this._renderTextTooShortState(), this._renderPremiumErrorsTeaser()) : e === CHECK_STATUS.TEXT_TOO_LONG ? (this._renderHeadline(), this._renderTextTooLongState(), this._renderDiscountTimerTeaser()) : e === CHECK_STATUS.UNSUPPORTED_LANGUAGE ? (this._renderHeadline(), this._renderLanguageUnsupportedState()) : e === CHECK_STATUS.DISCONNECTED ? this._renderDisconnectedState() : e === CHECK_STATUS.FAILED ? this._renderFailedState() : n && this._renderNeedsLanguageHintState(), e === CHECK_STATUS.COMPLETED && this._controls.mainHeadline) {
      this._controls.headerScoreProgressBar.style.width = this._state.textScore + "%", this._controls.textScore.setScore(this._state.textScore);
      const e = this._state.displayedErrors.length || 0, t = this._state.displayedPremiumErrors.length || 0;
      this._allDisplyedErrorsCount = e + t, this._controls.errorsCounter.textContent = this._allDisplyedErrorsCount.toString()
    }
    this._position()
  }

  _showLoadingBar(e) {
    e !== this._isLoadingBarShown && (e ? this._controls.loadingBar.classList.remove("lt-dialog__footer__loading-bar-container--hidden") : this._controls.loadingBar.classList.add("lt-dialog__footer__loading-bar-container--hidden"), this._isLoadingBarShown = e)
  }

  _getCountString(e, t) {
    if (!EnvironmentAdapter.isRuntimeConnected()) return "";
    const n = {
      words: [Dialog.MESSAGES.COUNTER_WORDS_OPTION, i18nManager.getMessage("dialogCounterWordsSingular"), i18nManager.getMessage("dialogCounterWordsPlural", [formatNumber(e.counts.words, EnvironmentAdapter.getUILanguageCode())])],
      sentences: [Dialog.MESSAGES.COUNTER_SENTENCES_OPTION, i18nManager.getMessage("dialogCounterSentencesSingular"), i18nManager.getMessage("dialogCounterSentencesPlural", [formatNumber(e.counts.sentences, EnvironmentAdapter.getUILanguageCode())])],
      characters: [Dialog.MESSAGES.COUNTER_CHARACTERS_OPTION, i18nManager.getMessage("dialogCounterCharactersSingular"), i18nManager.getMessage("dialogCounterCharactersPlural", [formatNumber(e.counts.characters, EnvironmentAdapter.getUILanguageCode())])]
    }, o = e.counts[t];
    return 0 === o ? n[t][0] : 1 === o ? n[t][1] : n[t][2]
  }

  _renderHeadline() {
    this._controls.mainHeadline = this._document.createElement("lt-div"), this._controls.mainHeadline.classList.add("lt-dialog__content-top__menu"), this._controls.mainHeadline.setAttribute("data-lt-prevent-focus", "");
    const e = this._document.createElement("lt-span");
    e.className = "lt-dialog__main-headline";
    const t = this._document.createElement("lt-span");
    t.className = "lt-dialog__main-headline__headline", t.textContent = Dialog.MESSAGES.REGULAR_MISTAKE_MENU_ITEM, this._controls.errorsCounter = this._document.createElement("lt-span"), this._controls.errorsCounter.className = "lt-dialog__main-headline__counter", this._controls.errorsCounter.textContent = this._allDisplyedErrorsCount.toString(), e.appendChild(t), e.appendChild(this._controls.errorsCounter), this._controls.mainHeadline.appendChild(e);
    const n = {label: Dialog.MESSAGES.TEXT_SCORE_MENU_ITEM, position: "bottom-right"};
    this._controls.textScore = new Score("lt-dialog__main-headline__score", this._controls.mainHeadline, n), this._controls.textScore.setScore(this._state.textScore), this._controls.contentTop.appendChild(this._controls.mainHeadline), this._controls.pickyToggle = new Toggle("picky_mode", Dialog.MESSAGES.PICKY_MODE_MENU_ITEM, "", this._controls.contentTop), this._controls.pickyToggle.set(this._state.isPickyModeEnabled), this._eventListeners.push(addUseCaptureEvent(this._controls.pickyToggle.getElement(), "click", this._onTogglePickyMode.bind(this)))
  }

  _renderInProgressState() {
    this._controls.content.classList.add("lt-dialog__is-loading");
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog-skeleton lt-dialog-skeleton--error-card";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog-skeleton lt-dialog-skeleton--error-card", this._controls.contentMain.appendChild(e), this._controls.contentMain.appendChild(t)
  }

  _renderCompletedState() {
    this._state.displayedErrors && this._state.displayedErrors.length ? this._appearance.canDisplayAllSuggestions() ? (this._renderErrors(), this._renderIgnoredErrorsStats()) : this._renderScrollHint() : this._state.displayedPremiumErrors && this._state.displayedPremiumErrors.length ? (this._removeTeaser(), this._renderPremiumState()) : (this._removeTeaser(), this._renderNoErrorsState(), this._renderIgnoredErrorsStats()), this._controls.incompleteResult.classList.toggle("lt-dialog__incomplete-result-show", !!this._state.isIncompleteResult)
  }

  _renderErrors() {
    this._controls.content.classList.add("lt-dialog__has-errors"), this._state.displayedPremiumErrors && this._state.displayedPremiumErrors.length && this._renderPremiumErrorsTeaser(), this._state.displayedErrors.forEach((e => {
      const t = this._document.createElement("lt-div");
      t.className = "lt-dialog__error-item";
      const n = {label: Dialog.MESSAGES.IGNORE_RULE_TOOLTIP, position: "top-right"}, o = new Icon("trash", null, n, t);
      this._eventListeners.push(addUseCaptureEvent(o.getElement(), "click", (n => {
        e.isSpellingError ? this._onTemporarilyIgnoreWordClick(e, n) : this._onTemporarilyIgnoreRuleClick(e, n), t.remove()
      })));
      const i = this._document.createElement("lt-div");
      i.className = "lt-dialog__error-headline", e.isPicky && t.classList.add("lt-dialog__error-item--picky-mistake"), e.isCustomError ? (i.textContent = e.shortDescription || Dialog.MESSAGES.HEADLINE_SUGGESTION_ERROR, t.classList.add("lt-dialog__error-item--custom-suggestion")) : e.isSpellingError ? (i.textContent = Dialog.MESSAGES.HEADLINE_SPELLING_ERROR, t.classList.add("lt-dialog__error-item--spelling-mistake")) : e.isStyleError ? (i.textContent = e.shortDescription || Dialog.MESSAGES.HEADLINE_SUGGESTION_ERROR, t.classList.add("lt-dialog__error-item--style-suggestion")) : e.isPunctuationError ? (i.textContent = e.shortDescription || Dialog.MESSAGES.HEADLINE_PUNCTUATION_ERROR, t.classList.add("lt-dialog__error-item--punctuation-mistake")) : (i.textContent = e.shortDescription || Dialog.MESSAGES.HEADLINE_GRAMMAR_ERROR, t.classList.add("lt-dialog__error-item--grammar-mistake")), t.append(i), t.addEventListener("mouseenter", (() => this._onErrorHighlighted(e.id))), t.addEventListener("mouseleave", (() => this._onErrorHighlighted(null)));
      const s = this._document.createElement("lt-div");
      s.className = "lt-dialog__original-phrase", t.appendChild(s);
      const a = this._document.createElement("lt-div");
      a.className = "lt-dialog__original-phrase__header", s.appendChild(a);
      const r = this._document.createElement("lt-div");
      r.className = "lt-dialog__original-phrase__header__title", r.textContent = e.originalPhrase, a.appendChild(r);
      const l = new Icon("scroll-to-link", Dialog.MESSAGES.SCROLL_TO_LINK, null, a);
      this._eventListeners.push(addUseCaptureEvent(l.getElement(), "click", (t => {
        this._onErrorSelected(e.id)
      })));
      const d = this._document.createElement("lt-div");
      d.className = "lt-dialog__original-phrase__long-context-phrase", d.innerHTML = e.longContextPhrase, s.appendChild(d), this._renderFixes(e, t), this._renderDescription(e, t), this._renderActions(e, t), this._controls.contentMain.appendChild(t)
    }))
  }

  _renderFixes(e, t) {
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__fix-container", t.appendChild(n);
    const o = Math.min(e.fixes.length, config.MAX_FIXES_COUNT);
    for (let i = 0; i < o; i++) {
      const o = e.fixes[i], s = this._document.createElement("lt-div");
      !o.value.startsWith(" ") && !o.value.endsWith(" ") || ["FALSCHE_VERWENDUNG_DES_BINDESTRICHS"].includes(e.rule.id) ? s.textContent = o.value.replace(Dialog.NARROW_WHITESPACE_REGEXP, " ") : s.textContent = o.value.replace(Dialog.TRAILING_WHITESPACE_REGEXP, "·"), s.title = o.shortDescription || "", s.className = "lt-dialog__fix", s.setAttribute("data-lt-prevent-focus", ""), "" === o.value && e.originalPhrase.match(/[a-z0-9]{2,}/) ? (s.classList.add("lt-dialog__fix--strikethrough"), s.textContent = e.originalPhrase) : "" === o.value && (s.classList.add("lt-dialog__fix--delete"), s.textContent = Dialog.MESSAGES.DELETE), this._eventListeners.push(addUseCaptureEvent(s, "click", (n => {
        this._onFixClick(e, i, n), t.remove()
      }))), n.appendChild(s);
      const a = getConfigForMultipleErrorCorrection(e, o.value);
      if (this._uiOptions.canCorrectMultipleErrorsAtOnce && containsSimilarErrors(this._state.errors, e) && a) {
        const t = this._document.createElement("lt-span");
        t.classList.add("lt-dialog__fix--correct-all"), t.innerHTML = a.suggestion.message;
        const o = this._onCorrectAll.bind(this, e, a);
        this._eventListeners.push(addUseCaptureEvent(t, "click", o)), n.appendChild(t), n.appendChild(this._document.createElement("br"))
      }
      o.value.length >= 14 && t.classList.add("lt-dialog__long-fix")
    }
  }

  _renderActions(e, t) {
    if (e.isSpellingError) {
      if (!this._uiOptions.disableAddingWord && !includesWhiteSpace(e.originalPhrase)) {
        const n = this._document.createElement("lt-div");
        n.classList.add("lt-dialog__add-to-dictionary", "lt-icon__dictionary"), n.setAttribute("data-lt-prevent-focus", ""), n.textContent = i18nManager.getMessage("addToDictionaryCaption", e.originalPhrase), this._eventListeners.push(addUseCaptureEvent(n, "click", (n => {
          this._onAddToDictionaryClick(e, n), t.remove()
        }))), t.appendChild(n)
      }
    } else if (!this._uiOptions.disableIgnoringRule && !e.isCustomError) {
      const n = this._document.createElement("lt-div");
      n.classList.add("lt-dialog__ignore-rule"), n.classList.add("lt-icon__ignore"), n.setAttribute("data-lt-prevent-focus", ""), n.classList.add("lt-icon__ignore"), n.textContent = i18nManager.getMessage("turnOffRule"), this._eventListeners.push(addUseCaptureEvent(n, "click", (n => {
        this._onIgnoreRuleClick(e, n), t.remove()
      }))), t.appendChild(n)
    }
  }

  _renderDescription(e, t) {
    const n = this._document.createElement("lt-div");
    if (n.className = "lt-dialog__error-text", n.setAttribute("data-lt-prevent-focus", ""), n.textContent = e.description, t.append(n), e.rule.urls && e.rule.urls.length > 0) {
      const t = this._document.createElement("lt-span");
      t.classList.add("lt-dialog__more-details", "lt-icon__info"), t.setAttribute("data-lt-prevent-focus", ""), t.title = i18nManager.getMessage("moreDetails"), this._eventListeners.push(addUseCaptureEvent(t, "click", (t => {
        this._onMoreDetailsClick(e.rule.urls[0], t)
      }))), n.appendChild(t)
    }
  }

  _renderScrollHint() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__scroll-hint__headline", t.textContent = Dialog.MESSAGES.SCROLL_HINT_HEADLINE;
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__scroll-hint__text", n.textContent = Dialog.MESSAGES.SCROLL_HINT_TEXT, e.appendChild(t), e.appendChild(n), this._controls.contentMain.appendChild(e), this._shouldShowRatingTeaser ? this._renderRatingTeaser() : this._renderPremiumErrorsTeaser()
  }

  _renderTextTooShortState() {
    this._removeTeaser();
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__text-too-short__headline", t.innerHTML = Dialog.MESSAGES.TEXT_TOO_SHORT_HEADLINE;
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__text-too-short__text", n.innerHTML = Dialog.MESSAGES.TEXT_TOO_SHORT_TEXT, e.appendChild(t), e.appendChild(n), this._controls.contentMain.appendChild(e)
  }

  _renderNoErrorsState() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__no-errors__headline", t.textContent = Dialog.MESSAGES.NO_ERRORS;
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__no-errors__text", n.textContent = Dialog.MESSAGES.NO_ERRORS_TEXT, e.appendChild(t), e.appendChild(n), this._controls.contentMain.appendChild(e), this._shouldShowRatingTeaser ? this._renderRatingTeaser() : this._renderPremiumErrorsTeaser()
  }

  _renderIgnoredErrorsStats() {
    if (!this._state.ignoredErrorsStats) return;
    if (0 === this._state.ignoredErrorsStats.byDictionary && 0 === this._state.ignoredErrorsStats.byRules) return;
    const e = this._document.createElement("lt-div");
    if (this._state.displayedErrors && this._state.displayedErrors.length ? e.className = "lt-dialog__ignored-errors-item" : e.className = "lt-dialog__ignored-errors-message", this._state.ignoredErrorsStats.byDictionary > 0 && !this._uiOptions.disableAddingWord) {
      const t = 1 === this._state.ignoredErrorsStats.byDictionary ? "errorsIgnoredByDictionarySingular" : "errorsIgnoredByDictionary",
        n = i18nManager.getMessage(t, [this._state.ignoredErrorsStats.byDictionary]),
        o = document.createElement("lt-span");
      o.textContent = n, o.dataset.type = "byDictionary", e.appendChild(o)
    }
    if (this._state.ignoredErrorsStats.byRules > 0 && !this._uiOptions.disableIgnoringRule) {
      if (this._state.ignoredErrorsStats.byDictionary > 0) {
        const t = document.createElement("lt-span");
        t.textContent = ", ", e.appendChild(t)
      }
      const t = 1 === this._state.ignoredErrorsStats.byRules ? "errorsIgnoredByRulesSingular" : "errorsIgnoredByRules",
        n = i18nManager.getMessage(t, [this._state.ignoredErrorsStats.byRules]), o = document.createElement("lt-span");
      o.textContent = n, o.dataset.type = "byRules", e.appendChild(o)
    }
    this._controls.contentMain.appendChild(e), this._eventListeners.push(addUseCaptureEvent(e, "click", this._onIgnoredErrorsClick.bind(this)))
  }

  _renderRatingTeaser() {
    new RatingTeaser(this._controls.contentBottom, "dialog", getCurrentUrl().substr(0, 150))
  }

  _renderPremiumErrorsTeaser() {
    this._controls.teaserElement || EnvironmentAdapter.isRuntimeConnected() && StorageController.create().onReady((e => {
      if (e.getUIState().hasPaidSubscription) return;
      const t = e.getStatistics(), n = getHistoricPremiumErrors(t);
      e.startChangelogCoupon();
      const o = e.getActiveCoupon();
      if (this._state.displayedPremiumErrors.length) {
        const e = this._state.displayedPremiumErrors.filter((e => !e.isStyleError && !e.isPunctuationError)).length,
          t = this._state.displayedPremiumErrors.filter((e => e.isPunctuationError)).length,
          n = this._state.displayedPremiumErrors.filter((e => e.isStyleError)).length, o = "dialog:premium_teaser",
          i = 1 === e + t + n ? i18nManager.getMessage("premiumErrorsTextSingular") : i18nManager.getMessage("premiumErrorsTextPlural", [this._state.displayedPremiumErrors.length]),
          s = i18nManager.getMessage("premiumErrorsButton");
        this._premiumTeaser = new PremiumTeaser(this._controls.contentTop, o, null, i, s, {
          campaign: "addon2-dialog-premium-errors",
          hiddenGrammarMatches: e,
          hiddenStyleMatches: n,
          hiddenPunctuationMatches: t,
          textLanguage: this._languageCode || void 0
        })
      } else if (n.hiddenErrorsCount > 5) {
        const e = "dialog:historic_premium_teaser", t = i18nManager.getMessage("historicPremiumErrorsHeadline"),
          o = i18nManager.getMessage("historicPremiumErrorsText2", [n.hiddenErrorsCount, n.dayCount]),
          i = i18nManager.getMessage("historicPremiumErrorsButton");
        this._premiumTeaser = new PremiumTeaser(this._controls.contentBottom, e, t, o, i, {
          campaign: "addon2-dialog-historic-premium-errors",
          historicMatches: n.hiddenErrorsCountStr
        })
      } else if (o) {
        const e = "dialog:premium_teaser";
        this._premiumTeaser = new PremiumTeaser(this._controls.contentBottom, e, null, null, null, {campaign: "addon2-dialog"})
      }
      e.destroy()
    }))
  }

  _renderDiscountTimerTeaser() {
    StorageController.create().onReady((e => {
      e.startChangelogCoupon();
      if (e.getActiveCoupon()) {
        const e = "dialog:premium_teaser";
        this._premiumTeaser = new PremiumTeaser(this._controls.contentBottom, e, null, null, null, {campaign: "addon2-dialog-premium"})
      }
      e.destroy()
    }))
  }

  _renderPremiumState() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__premium__headline", t.textContent = 1 === this._state.displayedPremiumErrors.length ? i18nManager.getMessage("dialogPremiumHeadlineSingular") : i18nManager.getMessage("dialogPremiumHeadlinePlural", [this._state.displayedPremiumErrors.length]);
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__premium__text", n.textContent = i18nManager.getMessage("dialogPremiumText");
    const o = this._document.createElement("lt-div");
    o.className = "lt-dialog__premium__button lt-icon__new_window", o.textContent = i18nManager.getMessage("dialogPremiumButton");
    let i = "addon2-dialog-premium";
    this._eventListeners.push(addUseCaptureEvent(o, "click", (e => {
      e.stopImmediatePropagation();
      const t = {dialog: this, campaign: i};
      dispatchCustomEvent(document, Dialog.eventNames.premiumTeaserClicked, t), Tracker.trackEvent("Action", "dialog:premium:click")
    }))), e.appendChild(t), e.appendChild(n), e.appendChild(o), this._controls.contentMain.appendChild(e), StorageController.create().onReady((e => {
      e.startChangelogCoupon();
      e.getActiveCoupon() && (i = i.replace("addon2", "addon2-changelog"), this._premiumTeaser = new PremiumTeaser(this._controls.contentBottom, "dialog:premium_teaser", null, null, null, {campaign: i})), e.destroy()
    }))
  }

  _renderDisabledState() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__enable-text__headline", t.textContent = Dialog.MESSAGES.ENABLE_HEADLINE;
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__enable-text__text", n.textContent = Dialog.MESSAGES.ENABLE_TEXT;
    const o = this._document.createElement("lt-div");
    o.className = "lt-dialog__enable-everywhere", o.innerHTML = Dialog.MESSAGES.ENABLE_EVERYWHERE_BUTTON, this._eventListeners.push(addUseCaptureEvent(o, "click", this._enableEverywhere.bind(this)));
    const i = this._document.createElement("lt-div");
    i.className = "lt-dialog__enable-here", i.innerHTML = Dialog.MESSAGES.ENABLE_HERE_BUTTON, this._eventListeners.push(addUseCaptureEvent(i, "click", this._enableHere.bind(this))), e.appendChild(t), e.appendChild(n), e.appendChild(o), e.appendChild(i), this._controls.contentMain.appendChild(e)
  }

  _renderTextTooLongState() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__premium__headline", t.textContent = Dialog.MESSAGES.TEXT_TOO_LONG_HEADLINE;
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__premium__text", n.textContent = Dialog.MESSAGES.TEXT_TOO_LONG_TEXT;
    const o = this._document.createElement("lt-div");
    o.className = "lt-dialog__premium__button lt-icon__new_window", o.textContent = Dialog.MESSAGES.TEXT_TOO_LONG_BUTTON;
    let i = "addon2-dialog-text-too-long";
    StorageController.create().onReady((e => {
      e.getActiveCoupon() && (i = i.replace("addon2-dialog", "addon2-changelog")), e.destroy()
    })), this._eventListeners.push(addUseCaptureEvent(o, "click", (e => {
      e.stopImmediatePropagation();
      const t = {command: "OPEN_PREMIUM_PAGE", campaign: i};
      browser.runtime.sendMessage(t), Tracker.trackEvent("Action", "dialog:text_too_long:click")
    }))), e.appendChild(t), e.appendChild(n), e.appendChild(o), this._controls.contentMain.appendChild(e)
  }

  _renderLanguageUnsupportedState() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__language-unsupported__headline", t.textContent = Dialog.MESSAGES.UNSUPPORTED_LANGUAGE_HEADLINE;
    const n = this._document.createElement("lt-div");
    if (n.className = "lt-dialog__language-unsupported__text", n.textContent = Dialog.MESSAGES.UNSUPPORTED_LANGUAGE_TEXT, e.appendChild(t), e.appendChild(n), this._controls.contentMain.appendChild(e), this._controls.languageSelector) {
      const e = this._document.createElement("option");
      e.disabled = !0, e.selected = !0, e.textContent = Dialog.MESSAGES.UNSUPPORTED_LANGUAGE_LABEL, this._controls.languageSelector.addOption(e);
      const t = EnvironmentAdapter.getURL("/assets/images/flags/not_found.svg");
      this._controls.languageSelector.setActive(Dialog.MESSAGES.SELECT_LANGUAGE_LABEL, "", {"background-image": `url('${t}') !important`})
    }
  }

  _renderDisconnectedState() {
    this._controls.footer.remove(), this._controls.headerControlsWrapper.remove();
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.innerHTML = Dialog.MESSAGES.EXTENSION_UPDATED_HEADLINE, t.className = "lt-dialog__reload-headline", this._controls.contentMain.appendChild(t);
    const n = this._document.createElement("lt-div");
    n.innerHTML = Dialog.MESSAGES.EXTENSION_UPDATED_TEXT, n.className = "lt-dialog__reload__text", this._controls.contentMain.appendChild(n), e.appendChild(t), e.appendChild(n), this._controls.contentMain.appendChild(e)
  }

  _renderFailedState() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__exception-headline", t.textContent = Dialog.MESSAGES.Fail_STATE_HEADLINE, e.appendChild(t);
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__exception__text", n.textContent = this._state.checkErrorMessage || Dialog.MESSAGES.Fail_STATE_TEXT, e.appendChild(n), this._controls.contentMain.appendChild(e)
  }

  _renderNeedsLanguageHintState() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-dialog__text-wrapper";
    const t = this._document.createElement("lt-div");
    t.className = "lt-dialog__needs-language-hint__headline", t.textContent = Dialog.MESSAGES.NEEDS_LANGUAGE_HINT_HEADLINE;
    const n = this._document.createElement("lt-div");
    n.className = "lt-dialog__needs-language-hint__text", n.textContent = Dialog.MESSAGES.NEEDS_LANGUAGE_HINT_TEXT;
    const o = this._document.createElement("lt-div");
    o.className = "lt-dialog__needs-language-hint__button", o.textContent = Dialog.MESSAGES.NEEDS_LANGUAGE_HINT_IGNORE, e.appendChild(t), e.appendChild(n), e.appendChild(o), this._controls.contentMain.appendChild(e), this._eventListeners.push(addUseCaptureEvent(o, "click", (() => {
      const e = {dialog: this, language: this._controls.languageSelector.getValue()};
      Tracker.trackEvent("Action", "dialog:ignore_language_hint"), dispatchCustomEvent(document, Dialog.eventNames.languageChanged, e)
    })))
  }

  _onUnload() {
    this.destroy()
  }

  _onKeydown(e) {
    "Escape" === e.key && (this.destroy(), e.stopImmediatePropagation())
  }

  _onLanguageChange(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this, language: this._controls.languageSelector.getValue()};
    this.setCurrentLanguage(this._controls.languageSelector.getValue()), dispatchCustomEvent(document, Dialog.eventNames.languageChanged, t)
  }

  _onTogglePickyMode(e) {
    e.stopImmediatePropagation(), this._state.isPickyModeEnabled = !this._state.isPickyModeEnabled, this.setInsignificantChangeMode(!1);
    const t = {dialog: this, isEnabled: this._state.isPickyModeEnabled};
    dispatchCustomEvent(document, Dialog.eventNames.togglePickyMode, t)
  }

  _onCountChange(e) {
    e.stopImmediatePropagation(), this._state.countOptions.mode = this._controls.countSelector.getValue(), this.setCountOptions(this._state.countOptions);
    const t = {dialog: this, countMode: this._controls.countSelector.getValue()};
    dispatchCustomEvent(document, Dialog.eventNames.countChanged, t)
  }

  _onCloseClick(e) {
    e.stopImmediatePropagation(), this._onUnload()
  }

  _onHelpIconClick(e) {
    e.stopImmediatePropagation(), this._controls.helpMenu.show()
  }

  _onHelpOverlayClick(e) {
    e.stopImmediatePropagation(), this._controls.helpMenu.hide()
  }

  _onPositionIconClick(e) {
    e.stopImmediatePropagation(), this._controls.positionMenu.show()
  }

  _onPositionOverlayClick(e) {
    e.stopImmediatePropagation(), this._controls.positionMenu.hide()
  }

  _onPositionRightClick(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this, newPosition: "right"};
    this._controls.positionMenu.hide(), this._controls.positionIcon.setIcon("right"), this._position("right"), dispatchCustomEvent(document, Dialog.eventNames.positionChangeClicked, t)
  }

  _onPositionLeftClick(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this, newPosition: "left"};
    this._controls.positionMenu.hide(), this._controls.positionIcon.setIcon("left"), this._position("left"), dispatchCustomEvent(document, Dialog.eventNames.positionChangeClicked, t)
  }

  _onPositionDialogClick(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this, newPosition: "default"};
    this._controls.positionMenu.hide(), this._controls.positionIcon.setIcon("default"), this._position("default"), dispatchCustomEvent(document, Dialog.eventNames.positionChangeClicked, t)
  }

  _onSaveTextClick(e) {
    e.stopImmediatePropagation()
  }

  _onTurnOffClick(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this};
    dispatchCustomEvent(document, Dialog.eventNames.turnOff, t)
  }

  _onPauseCheckingClick(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this};
    dispatchCustomEvent(document, Dialog.eventNames.pauseChecking, t)
  }

  _onDisableIconClicked(e) {
    e.stopImmediatePropagation(), this._controls.disableMenu.show()
  }

  _onDisableOverlayClick(e) {
    e.stopImmediatePropagation(), this._controls.disableMenu.hide()
  }

  _onBadgeClicked(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this};
    dispatchCustomEvent(document, Dialog.eventNames.badgeClicked, t)
  }

  _onOptionsClick(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this};
    dispatchCustomEvent(document, Dialog.eventNames.openOptions, t)
  }

  _onContentScroll(e) {
    this._controls.content.scrollTop > 50 ? this._controls.headerScoreProgress.classList.add("show") : this._controls.headerScoreProgress.classList.remove("show")
  }

  _onIgnoredErrorsClick(e) {
    e.stopImmediatePropagation();
    let t = "personalDictionary";
    if (e.target) {
      const n = e.target;
      n.dataset && "byRules" === n.dataset.type && (t = "ignoredRules")
    }
    const n = {dialog: this, target: t, ref: "dialog-ignored-errors"};
    dispatchCustomEvent(document, Dialog.eventNames.openOptions, n)
  }

  _gotoLanguageTool(e) {
    e.stopImmediatePropagation();
    let t = "https://languagetool.org/?pk_campaign=addon2-dialog";
    BrowserDetector.isSafari() && (t += "&hidePremium=true"), EnvironmentAdapter.openWindow(t)
  }

  _gotoHelpCenter(e) {
    e.stopImmediatePropagation(), this._controls.helpMenu.hide(), EnvironmentAdapter.openWindow("https://languagetooler.freshdesk.com/support/home")
  }

  _showFeedbackForm(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this};
    this._controls.helpMenu.hide(), dispatchCustomEvent(document, Dialog.eventNames.showFeedbackForm, t)
  }

  _onErrorHighlighted(e) {
    const t = {dialog: this, errorId: e};
    dispatchCustomEvent(document, Dialog.eventNames.errorHighlighted, t)
  }

  _onErrorSelected(e) {
    const t = {dialog: this, errorId: e};
    dispatchCustomEvent(document, Dialog.eventNames.errorSelected, t)
  }

  _onMoreDetailsClick(e, t) {
    t.stopImmediatePropagation();
    const n = {dialog: this, url: e.value};
    dispatchCustomEvent(document, Dialog.eventNames.moreDetailsClicked, n)
  }

  _onCorrectAll(e, t, n) {
    n.stopImmediatePropagation();
    const o = {dialog: this, config: t, selectedError: e};
    dispatchCustomEvent(document, Dialog.eventNames.correctAll, o)
  }

  _onFixClick(e, t, n) {
    n.stopImmediatePropagation(), this._inApplyFixMode = !0;
    const o = {dialog: this, error: e, fixIndex: t, selectNextError: !1};
    dispatchCustomEvent(document, Dialog.eventNames.fixSelected, o)
  }

  _onAddToDictionaryClick(e, t) {
    t.stopImmediatePropagation(), this._inApplyFixMode = !0;
    const n = {dialog: this, error: e, selectNextError: !1};
    dispatchCustomEvent(document, Dialog.eventNames.addToDictionaryClicked, n)
  }

  _onIgnoreRuleClick(e, t) {
    t.stopImmediatePropagation(), this._inApplyFixMode = !0;
    const n = {dialog: this, error: e, selectNextError: !1};
    dispatchCustomEvent(document, Dialog.eventNames.ignoreRuleClicked, n)
  }

  _onTemporarilyIgnoreWordClick(e, t) {
    t.stopImmediatePropagation(), this._inApplyFixMode = !0;
    const n = {dialog: this, error: e, selectNextError: !1};
    dispatchCustomEvent(document, Dialog.eventNames.temporarilyIgnoreWordClicked, n)
  }

  _onTemporarilyIgnoreRuleClick(e, t) {
    t.stopImmediatePropagation(), this._inApplyFixMode = !0;
    const n = {dialog: this, error: e, selectNextError: !1};
    dispatchCustomEvent(document, Dialog.eventNames.temporarilyIgnoreRuleClicked, n)
  }

  _enableEverywhere(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this};
    dispatchCustomEvent(document, Dialog.eventNames.enableEverywhere, t)
  }

  _enableHere(e) {
    e.stopImmediatePropagation();
    const t = {dialog: this};
    dispatchCustomEvent(document, Dialog.eventNames.enableHere, t)
  }

  getCurrentPosition() {
    return this._uiOptions.dialogPosition
  }

  updateState(e) {
    isSameObjects(this._state, e) || (this._state = Object.assign(this._state || {}, e), this._updateContent())
  }

  setCurrentLanguage(e) {
    if (!EnvironmentAdapter.isRuntimeConnected()) return;
    e = e.toLowerCase();
    const t = LanguageManager.LANGUAGES.find((t => t.code === e)) || LanguageManager.LANGUAGES.find((t => e.startsWith(t.code))) || LanguageManager.LANGUAGES.find((e => "en-us" === e.code)),
      n = EnvironmentAdapter.getURL("/assets/images/flags/" + t.code + ".svg");
    this._controls.languageSelector && this._controls.languageSelector.setActive(this._shortenLanguageName(t.name), t.code, {"background-image": `url('${n}') !important`})
  }

  _shortenLanguageName(e) {
    return e.split(" ", 1)[0]
  }

  setCountOptions(e) {
    this._controls.countSelector && (this._controls.countSelector.setActive(this._getCountString(e, e.mode), e.mode, {}), this._controls.countSelector.updateOptionLable("characters", this._getCountString(e, "characters")), this._controls.countSelector.updateOptionLable("sentences", this._getCountString(e, "sentences")), this._controls.countSelector.updateOptionLable("words", this._getCountString(e, "words")))
  }

  setInsignificantChangeMode(e) {
    this._inInsignificantChangeMode = e
  }

  setApplyFixMode(e) {
    this._inApplyFixMode = e
  }

  closeAllMenus() {
    this._menus.forEach((e => {
      e.hide()
    }))
  }

  fadeOut() {
    this._controls.innerContainer.classList.add("lt-dialog--faded")
  }

  fadeIn() {
    this._controls.innerContainer.classList.remove("lt-dialog--faded")
  }

  destroy() {
    fadeOutAndRemove(this._controls.container, (() => {
      this._toolbarContainer.classList.remove("lt-toolbar--dialog-opened")
    })), this._controls = {}, window.removeEventListener("pagehide", this._onUnload, !0), this._eventListeners.forEach((e => {
      e.destroy()
    })), this._eventListeners = [];
    const e = {dialog: this};
    this._premiumTeaser && this._premiumTeaser.destroy(), dispatchCustomEvent(document, Dialog.eventNames.destroyed, e)
  }
}

Dialog.CONTAINER_ELEMENT_NAME = "lt-dialog", Dialog.SPACE_TO_SCREEN_EDGE = 5, Dialog.TRAILING_WHITESPACE_REGEXP = /^ | $/g, Dialog.NARROW_WHITESPACE_REGEXP = /\u202F/g, Dialog.MESSAGES = {
  EXTENSION_UPDATED_HEADLINE: i18nManager.getMessage("extensionUpdatedHeadline"),
  EXTENSION_UPDATED_TEXT: i18nManager.getMessage("extensionUpdatedText", ["<lt-span class='lt-dialog__icon'></lt-span>"]),
  INCOMPLETE_RESULT: i18nManager.getMessage("incompleteResult"),
  POWERED_BY: i18nManager.getMessage("poweredBy"),
  FEEDBACK: i18nManager.getMessage("sendFeedback"),
  DELETE: i18nManager.getMessage("deleteWord"),
  ENABLE_HEADLINE: i18nManager.getMessage("dialogEnableInDialogHeadline"),
  ENABLE_TEXT: i18nManager.getMessage("dialogEnableInDialogText"),
  ENABLE_EVERYWHERE_BUTTON: i18nManager.getMessage("enableEverywhereButton"),
  ENABLE_HERE_BUTTON: i18nManager.getMessage("enableHereButton"),
  OPTIONS_TITLE: i18nManager.getMessage("settingsHeadline"),
  NO_ERRORS: i18nManager.getMessage("noErrorsFound2"),
  NO_ERRORS_TEXT: i18nManager.getMessage("noErrorsFoundText"),
  TEXT_TOO_LONG_HEADLINE: i18nManager.getMessage("dialogTextTooLongHeadline"),
  TEXT_TOO_LONG_TEXT: i18nManager.getMessage("dialogTextTooLongText"),
  SCROLL_HINT_HEADLINE: i18nManager.getMessage("dialogScrollHintHeadline"),
  SCROLL_HINT_TEXT: i18nManager.getMessage("dialogScrollHintText"),
  TEXT_TOO_LONG_BUTTON: i18nManager.getMessage("dialogTextTooLongButton"),
  TEXT_TOO_SHORT_TEXT: i18nManager.getMessage("dialogTextTooShortText"),
  TEXT_TOO_SHORT_HEADLINE: i18nManager.getMessage("dialogTextTooShortHeadline"),
  TEXT_SCORE_MENU_ITEM: i18nManager.getMessage("dialogMainMenuTextScore"),
  REGULAR_MISTAKE_MENU_ITEM: i18nManager.getMessage("dialogMainMenuRegularMistake"),
  PREMIUM_MISTAKE_MENU_ITEM: i18nManager.getMessage("dialogMainMenuPremiumMistake"),
  PICKY_MODE_MENU_ITEM: i18nManager.getMessage("dialogMainMenuPickyMode"),
  PICKY_MODE_MENU_ITEM_INFO: i18nManager.getMessage("dialogMainMenuPickyModeInfo"),
  COUNTER_CHARACTERS_OPTION: i18nManager.getMessage("dialogCounterCharactersOption"),
  COUNTER_WORDS_OPTION: i18nManager.getMessage("dialogCounterWordsOption"),
  COUNTER_SENTENCES_OPTION: i18nManager.getMessage("dialogCounterSentencesOption"),
  POSITION_DEFAULT_MENU_ITEM: i18nManager.getMessage("dialogPositionMenuDefault"),
  POSITION_RIGHT_MENU_ITEM: i18nManager.getMessage("dialogPositionMenuRight"),
  POSITION_LEFT_MENU_ITEM: i18nManager.getMessage("dialogPositionMenuLeft"),
  Fail_STATE_HEADLINE: i18nManager.getMessage("dialogFailStateHeadline"),
  Fail_STATE_TEXT: i18nManager.getMessage("dialogFailStateText"),
  HEADLINE_SPELLING_ERROR: i18nManager.getMessage("spellingError"),
  HEADLINE_CUSTOM_SUGGESTION_ERROR: i18nManager.getMessage("customSuggestionError"),
  HEADLINE_SUGGESTION_ERROR: i18nManager.getMessage("suggestionError"),
  HEADLINE_PUNCTUATION_ERROR: i18nManager.getMessage("punctuationError"),
  HEADLINE_GRAMMAR_ERROR: i18nManager.getMessage("grammarError"),
  SELECT_LANGUAGE_LABEL: i18nManager.getMessage("dialogSelectLanguageLabel"),
  UNSUPPORTED_LANGUAGE_LABEL: i18nManager.getMessage("dialogUnsupportedLanguageLabel"),
  UNSUPPORTED_LANGUAGE_HEADLINE: i18nManager.getMessage("dialogUnsupportedLanguageHeadline"),
  UNSUPPORTED_LANGUAGE_TEXT: i18nManager.getMessage("dialogUnsupportedLanguageText"),
  ALL_LANGUAGES: i18nManager.getMessage("dialogAllLanguages"),
  RECOMMENDED_LANGUAGES: i18nManager.getMessage("dialogRecommendedLanguages"),
  SCROLL_TO_LINK: i18nManager.getMessage("dialogScrollToLink"),
  SEND_FEEDBACK_TOOLTIP: i18nManager.getMessage("dialogTooltipSendFeedback"),
  HELP_TOOLTIP: i18nManager.getMessage("dialogTooltipHelp"),
  HELP_CENTER_TOOLTIP: i18nManager.getMessage("dialogTooltipHelpCenter"),
  IGNORE_RULE_TOOLTIP: i18nManager.getMessage("ignoreHere"),
  DISABLE_CHECKING_TOOLTIP: i18nManager.getMessage("dialogTooltipDisableChecking"),
  DISABLE_CHECKING_MENU_ITEM: i18nManager.getMessage("dialogDisableMenuDisableChecking"),
  PAUSE_CHECKING_MENU_ITEM: i18nManager.getMessage("dialogDisableMenuPauseChecking"),
  DIALOG_POSITION_TOOLTIP: i18nManager.getMessage("dialogTooltipPosition"),
  SETTINGS_TOOLTIP: i18nManager.getMessage("dialogTooltipSettings"),
  SAVE_TEXT_TOOLTIP: i18nManager.getMessage("dialogTooltipSaveText"),
  NEEDS_LANGUAGE_HINT_HEADLINE: i18nManager.getMessage("dialogNeedsLanguageHintHeadline"),
  NEEDS_LANGUAGE_HINT_TEXT: i18nManager.getMessage("dialogNeedsLanguageHintText"),
  NEEDS_LANGUAGE_HINT_IGNORE: i18nManager.getMessage("dialogNeedsLanguageHintIgnore"),
  LANGUAGES: LanguageManager.LANGUAGES
}, Dialog.eventNames = {
  turnOff: "lt-dialog.turnOff",
  pauseChecking: "lt-dialog.pauseChecking",
  enableHere: "lt-dialog.enableHere",
  enableEverywhere: "lt-dialog.enableEverywhere",
  languageChanged: "lt-dialog.languageChanged",
  countChanged: "lt-dialog.countChanged",
  errorSelected: "lt-dialog.errorSelected",
  errorHighlighted: "lt-dialog.errorHighlighted",
  addToDictionaryClicked: "lt-dialog.addToDictionaryClicked",
  ignoreRuleClicked: "lt-dialog.ignoreRuleClicked",
  temporarilyIgnoreWordClicked: "lt-dialog.temporarilyIgnoreWordClicked",
  temporarilyIgnoreRuleClicked: "lt-dialog.temporarilyIgnoreRuleClicked",
  moreDetailsClicked: "lt-dialog.moreDetailsClicked",
  fixSelected: "lt-dialog.fixSelected",
  openOptions: "lt-dialog.openOptions",
  showFeedbackForm: "lt-dialog.showFeedbackForm",
  destroyed: "lt-dialog.destroyed",
  togglePickyMode: "lt-dialog.togglePickyMode",
  positionChangeClicked: "lt-dialog.positionChangeClicked",
  badgeClicked: "lt-dialog.badgeClicked",
  premiumTeaserClicked: "lt-dialog.premiumTeaserClicked",
  correctAll: "lt-dialog.correctAll"
};