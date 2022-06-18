/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class Toolbar {
  constructor(t, e, s = null, o = {
    checkStatus: CHECK_STATUS.IN_PROGRESS,
    errorsCount: 0,
    premiumErrorsCount: 0,
    isIncompleteResult: !1,
    checkErrorMessage: "",
    showNotification: !1
  }) {
    this._currentStyles = null, this._renderOutsideIframe = !1, this._inputArea = t, this._targetElement = t, this._document = t.ownerDocument, this._appearance = e, this._mirror = s;
    const r = getFrameElement(window);
    r && this._inputArea === this._inputArea.ownerDocument.body && isLTAvailable(window.parent) && (this._targetElement = r, this._document = this._targetElement.ownerDocument, this._renderOutsideIframe = !0, this._onUnload = this._onUnload.bind(this), window.addEventListener("pagehide", this._onUnload, !0)), this._controls = {
      container: null,
      wrapper: null,
      statusIcon: null,
      premiumIcon: null
    }, this._visible = !1, this._sizeDecreased = !1, this._hasNotifiedAboutPremiumIcon = !1, this._domMeasurement = new DomMeasurement(this._document), this._eventListeners = [], this.updateState(o, !0);
    const i = this._appearance.isPerformanceCritical();
    this._renderInterval = setAnimationFrameInterval((() => this._updateDisplaying(!0)), i ? 2 * config.RENDER_INTERVAL : config.RENDER_INTERVAL), i || (this._decreaseSizeInterval = setAnimationFrameInterval((() => this._decreaseSizeIfNeeded()), config.TOOLBAR_DECREASE_SIZE_INTERVAL)), this._scrollObserver = observeScrollableAncestors(this._targetElement, (() => this._updateDisplaying(!1)))
  }

  static _cacheMessages() {
    Toolbar.MESSAGES = {
      STATUS_ICON_RELOAD_MESSAGE: i18nManager.getMessage("statusIconReload"),
      STATUS_ICON_TOOLTIP: i18nManager.getMessage("statusIconToolTip"),
      STATUS_ICON_PERMISSION_REQUIRED: i18nManager.getMessage("statusIconPermissionRequired"),
      STATUS_ICON_TEXT_TOO_LONG: i18nManager.getMessage("textTooLong"),
      STATUS_ICON_DISABLED: i18nManager.getMessage("statusIconEnableLT"),
      STATUS_ICON_FAIL: i18nManager.getMessage("statusIconError"),
      STATUS_ICON_MORE_ERRORS: i18nManager.getMessage("statusIconMoreErrors"),
      STATUS_ICON_LANGUAGE_UNSUPPORTED: i18nManager.getMessage("dialogUnsupportedLanguageHeadline")
    }
  }

  static _constructor() {
    Toolbar._isInitialized || (Toolbar._cacheMessages(), i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, Toolbar._cacheMessages.bind(Toolbar)), Toolbar._isInitialized = !0)
  }

  _render() {
    if (this._destroyed) return;
    const t = ["lt-toolbar__status-icon"], e = ["lt-toolbar__premium-icon"];
    let s = Toolbar.MESSAGES.STATUS_ICON_TOOLTIP, o = "";
    if (!this._controls.container) {
      this._parent = this._appearance.getParent(this._document), this._parentElement = this._parent instanceof ShadowRoot ? this._parent.host : this._parent, this._controls.container = createContainerElement(this._document, Toolbar.CONTAINER_ELEMENT_NAME), this._controls.container.style.display = "none", isCKEditor(this._inputArea) && this._controls.container.setAttribute("data-cke-temp", "1"), this._controls.wrapper = this._document.createElement("lt-div"), this._controls.wrapper.classList.add("lt-toolbar__wrapper"), hasDarkBackground(this._inputArea) ? this._controls.container.setAttribute("data-lt-force-appearance", "dark") : this._controls.container.setAttribute("data-lt-force-appearance", "light");
      const t = this._appearance.getClassName();
      t && this._controls.wrapper.classList.add(t), this._controls.statusIcon = this._document.createElement("lt-div"), this._controls.premiumIcon = this._document.createElement("lt-div");
      const e = [this._controls.statusIcon, this._controls.premiumIcon];
      this._eventListeners.push(addUseCaptureEvent(this._controls.wrapper, "click", this._onClick.bind(this))), this._controls.wrapper.appendChild(this._controls.premiumIcon), this._controls.wrapper.appendChild(this._controls.statusIcon), this._controls.container.appendChild(this._controls.wrapper), e.forEach((t => {
        this._eventListeners.push(addUseCaptureEvent(t, "mousedown", (t => {
          t.stopImmediatePropagation(), t.preventDefault()
        })), addUseCaptureEvent(t, "mouseup", (t => {
          t.stopImmediatePropagation()
        })), addUseCaptureEvent(t, "pointerdown", (t => {
          t.stopImmediatePropagation()
        })), addUseCaptureEvent(t, "pointerup", (t => {
          t.stopImmediatePropagation()
        })))
      })), this._visible = !0
    }
    switch (clearTimeout(this._premiumIconTimeout), this._state.checkStatus) {
      case CHECK_STATUS.IN_PROGRESS:
        t.push("lt-toolbar__status-icon-in-progress");
        break;
      case CHECK_STATUS.COMPLETED:
      case CHECK_STATUS.TEXT_TOO_SHORT:
        0 === this._state.errorsCount ? t.push("lt-toolbar__status-icon-has-no-errors") : (t.push("lt-toolbar__status-icon-has-errors"), this._state.isIncompleteResult ? (t.push("lt-toolbar__status-icon-has-more-errors"), s = Toolbar.MESSAGES.STATUS_ICON_MORE_ERRORS) : this._state.errorsCount > 9 ? t.push("lt-toolbar__status-icon-has-9plus-errors") : t.push(`lt-toolbar__status-icon-has-${this._state.errorsCount}-errors`)), this._state.premiumErrorsCount > 0 && (e.push("lt-toolbar__premium-icon--visible"), this._premiumIconTimeout = window.setTimeout((() => this._notifyAboutPremiumIcon()), 3e3), this._state.premiumErrorsCount < 9 ? e.push(`lt-toolbar__premium-icon-has-${this._state.premiumErrorsCount}-errors`) : e.push("lt-toolbar__premium-icon-has-9plus-errors"), 0 === this._state.errorsCount && e.push("lt-toolbar__premium-icon--prominent")), this._state.showNotification && 0 === this._state.premiumErrorsCount && t.push("lt-toolbar__status-icon-has-notification");
        break;
      case CHECK_STATUS.PERMISSION_REQUIRED:
        t.push("lt-toolbar__status-icon--permission-required"), s = Toolbar.MESSAGES.STATUS_ICON_PERMISSION_REQUIRED;
        break;
      case CHECK_STATUS.DISABLED:
        t.push("lt-toolbar__status-icon-disabled", "lt-illustration__disabled"), s = Toolbar.MESSAGES.STATUS_ICON_DISABLED;
        break;
      case CHECK_STATUS.TEXT_TOO_LONG:
        t.push("lt-toolbar__status-icon-text-too-long", "lt-illustration__text_too_long"), s = Toolbar.MESSAGES.STATUS_ICON_TEXT_TOO_LONG;
        break;
      case CHECK_STATUS.UNSUPPORTED_LANGUAGE:
        t.push("lt-toolbar__status-icon--language-unsupported", "t-illustration__language_not_supported"), s = Toolbar.MESSAGES.STATUS_ICON_LANGUAGE_UNSUPPORTED;
        break;
      case CHECK_STATUS.FAILED:
        t.push("lt-toolbar__status-icon--failed", "wp-exclude-emoji"), s = this._state.checkErrorMessage || Toolbar.MESSAGES.STATUS_ICON_FAIL, o = "✖";
        break;
      case CHECK_STATUS.DISCONNECTED:
        t.push("lt-toolbar__status-icon-disconnected", "wp-exclude-emoji"), s = Toolbar.MESSAGES.STATUS_ICON_RELOAD_MESSAGE, o = "✖";
        break;
      case CHECK_STATUS.NEEDS_LANGUAGE_HINT:
        t.push("lt-toolbar__status-icon-needs-language-hint")
    }
    this._controls.statusIcon.className = t.join(" "), this._controls.statusIcon.title = s, this._controls.statusIcon.textContent = o, this._controls.premiumIcon.className = e.join(" "), !this._parent || this._parent.contains(this._controls.container) && "before" !== getPosition(this._controls.container, this._inputArea) || this._parent.children[this._parent.children.length - 1] === this._controls.container || this._parent.appendChild(this._controls.container)
  }

  _updateDisplaying(t = !1) {
    if (this._destroyed) return;
    if (!this._controls.wrapper) return;
    if (this._renderOutsideIframe && !isInDocument(this._targetElement)) return void this._hide();
    this._domMeasurement.clearCache();
    if (!this._appearance.isVisible(this._targetElement, this._domMeasurement)) return void this._hide();
    const e = this._domMeasurement.isRTL(this._targetElement),
      s = this._appearance.getPosition(this._targetElement, this._parentElement, this._domMeasurement, e, Toolbar.TOOLBAR_SIZE);
    if (!s) return void this._hide();
    const o = {left: s.left};
    s.fixed ? (o.position = "fixed !important", s.top ? (o.top = `${s.top} !important`, o.bottom = "auto !important") : (o.top = "auto !important", o.bottom = "12px !important")) : (o.position = "absolute !important", o.top = `${s.top} !important`, o.bottom = "auto !important"), t && (o["z-index"] = (this._appearance.getZIndex(this._targetElement, this._parentElement, this._domMeasurement) || "auto").toString()), isSameObjects(this._currentStyles, o) ? this._show() : (this._currentStyles = o, this._domMeasurement.setStyles(this._controls.wrapper, o))
  }

  _hide() {
    this._controls.wrapper && this._visible && (this._visible = !1, this._controls.wrapper.classList.add("lt-toolbar__wrapper-hide"))
  }

  _show() {
    this._controls.wrapper && (this._visible || (this._visible = !0, this._controls.wrapper.classList.remove("lt-toolbar__wrapper-hide")))
  }

  _decreaseSizeIfNeeded() {
    if (!this._controls.wrapper) return;
    if (!this._visible) return;
    if (this._destroyed) return;
    let t = this._domMeasurement.getBorderBox(this._controls.wrapper, !1);
    if (this._renderOutsideIframe) {
      const e = this._domMeasurement.getContentBox(this._targetElement, !1);
      t = moveBox(t, -e.left, -e.top)
    }
    if (t.top < 0 || t.bottom > window.innerHeight) return;
    const e = {left: t.left - 6, top: t.top, right: t.right, bottom: t.bottom - 2},
      s = {x: t.left, y: Math.round(t.top)},
      o = {x: Math.round(t.left + t.width / 2), y: Math.round(t.top + t.height / 2)},
      r = {x: t.left, y: Math.round(t.bottom)};
    this.disableRangeMeasurements(), this._mirror && this._mirror.enableRangeMeasurements();
    const i = getRangeAtPoint(s);
    let n = getRangeAtPoint(o), a = getRangeAtPoint(r);
    this.enableRangeMeasurements(), this._mirror && this._mirror.disableRangeMeasurements();
    let _ = null;
    n && n.startOffset > 0 && (_ = new Range, _.setStart(n.startContainer, n.startOffset - 1), _.setEnd(n.startContainer, n.startOffset - 1));
    const l = this._mirror ? this._mirror.getCloneElement() : this._inputArea;
    if (i && contains(l, i.startContainer)) {
      const t = i.getBoundingClientRect();
      if (isRectsIntersect(t, e)) return void this._decreaseSize()
    }
    if (isSameRange(n, i) && (n = null), n && contains(l, n.startContainer)) {
      const t = n.getBoundingClientRect();
      if (isRectsIntersect(t, e)) return void this._decreaseSize()
    }
    if ((isSameRange(a, i) || isSameRange(a, n)) && (a = null), a && contains(l, a.startContainer)) {
      const t = a.getBoundingClientRect();
      if (isRectsIntersect(t, e)) return void this._decreaseSize()
    }
    if ((isSameRange(_, i) || isSameRange(_, n) || isSameRange(_, a)) && (_ = null), _ && contains(l, _.startContainer)) {
      const t = _.getBoundingClientRect();
      if (isRectsIntersect(t, e)) return void this._decreaseSize()
    }
    this._increaseSize()
  }

  _decreaseSize() {
    this._controls.wrapper && (this._sizeDecreased || (this._sizeDecreased = !0, this._controls.wrapper.classList.add("lt-toolbar-small")))
  }

  _increaseSize() {
    this._controls.wrapper && this._sizeDecreased && (this._sizeDecreased = !1, this._controls.wrapper.classList.remove("lt-toolbar-small"))
  }

  _notifyAboutPremiumIcon() {
    if (this._hasNotifiedAboutPremiumIcon) return;
    this._hasNotifiedAboutPremiumIcon = !0;
    const t = {toolbar: this};
    dispatchCustomEvent(document, Toolbar.eventNames.notifyAboutPremiumIcon, t)
  }

  _onUnload() {
    this.destroy()
  }

  _onClick(t) {
    const e = getEventTarget(t);
    if (![this._controls.wrapper, this._controls.statusIcon, this._controls.premiumIcon].includes(e)) return;
    t.stopImmediatePropagation();
    const s = {toolbar: this};
    this._state.checkStatus === CHECK_STATUS.PERMISSION_REQUIRED ? dispatchCustomEvent(document, Toolbar.eventNames.permissionRequiredIconClicked, s) : dispatchCustomEvent(document, Toolbar.eventNames.toggleDialog, s)
  }

  updateState(t, e = !1) {
    if (isSameObjects(this._stateForComparison, t)) return;
    this._stateForComparison = t;
    const s = void 0 === t.checkStatus ? this._state.checkStatus : t.checkStatus;
    let o = 0, r = 0;
    s === CHECK_STATUS.COMPLETED && (o = void 0 === t.errorsCount ? this._state.errorsCount : t.errorsCount, r = void 0 === t.errorsCount ? this._state.premiumErrorsCount : t.premiumErrorsCount);
    let i = void 0 === t.isIncompleteResult ? this._state.isIncompleteResult : t.isIncompleteResult, n = "";
    s === CHECK_STATUS.FAILED && (n = void 0 === t.checkErrorMessage ? this._state.checkErrorMessage : t.checkErrorMessage), this._state = {
      checkStatus: s,
      errorsCount: o,
      premiumErrorsCount: r,
      isIncompleteResult: i,
      checkErrorMessage: n,
      showNotification: t.showNotification
    }, this._animationFrame = window.requestAnimationFrame((() => {
      this._render(), this._updateDisplaying(e)
    }))
  }

  enableRangeMeasurements() {
    this._controls.wrapper && (this._renderOutsideIframe || this._controls.wrapper.classList.remove("lt-toolbar-disable-range-measurement"))
  }

  disableRangeMeasurements() {
    this._controls.wrapper && (this._renderOutsideIframe || this._controls.wrapper.classList.add("lt-toolbar-disable-range-measurement"))
  }

  getState() {
    return this._state
  }

  getContainer() {
    return this._controls.wrapper
  }

  destroy() {
    this._destroyed = !0, this._eventListeners.forEach((t => {
      t.destroy()
    })), this._eventListeners = [];
    for (const t in this._controls) this._controls[t] && (this._controls[t].remove(), this._controls[t] = null);
    this._domMeasurement.clearCache(), this._renderInterval && this._renderInterval.destroy(), this._decreaseSizeInterval && this._decreaseSizeInterval.destroy(), window.removeEventListener("pagehide", this._onUnload, !0), cancelAnimationFrame(this._animationFrame), clearTimeout(this._premiumIconTimeout), this._scrollObserver && this._scrollObserver.destroy()
  }
}

Toolbar.CONTAINER_ELEMENT_NAME = "lt-toolbar", Toolbar.TOOLBAR_SIZE = {
  width: 20,
  height: 20
}, Toolbar.eventNames = {
  permissionRequiredIconClicked: "lt-toolbar.permissionRequiredIconClicked",
  toggleDialog: "lt-toolbar.toggleDialog",
  notifyAboutPremiumIcon: "lt-toolbar.notifyAboutPremiumIcon"
}, Toolbar._isInitialized = !1, Toolbar._constructor();