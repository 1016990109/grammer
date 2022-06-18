/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class FormElementMirror extends Mirror {
  constructor(e) {
    super(), this._firefoxHackEnabled = !1, this._mimickedElement = e, this._domMeasurement = new DomMeasurement(this._mimickedElement.ownerDocument), this._isRoamResearchIssue = Boolean(location.hostname.match(/roamresearch/) && e.closest(".roam-article")), this._isHootsuiteIssue = Boolean(location.hostname.match(/hootsuite/) && e.closest(".rc-TextArea")), this._isDotSyntaxHighlighterIssue = Boolean(e.previousElementSibling && "wpTextbox0" === e.previousElementSibling.id), this._render = this._render.bind(this), this._updateText = this._updateText.bind(this), this._onMimickedElementScroll = this._onMimickedElementScroll.bind(this), this._onMimickedElementClick = this._onMimickedElementClick.bind(this), this._render(), this._mimickedElement.addEventListener("scroll", this._onMimickedElementScroll), this._mimickedElement.addEventListener("click", this._onMimickedElementClick), this._mimickedElement.addEventListener("input", this._updateText), window.ResizeObserver && (this._mimickedElementResizeObserver = new window.ResizeObserver(this._render), this._mimickedElementResizeObserver.observe(this._mimickedElement)), this._renderInterval = setAnimationFrameInterval(this._render, config.RENDER_INTERVAL)
  }

  _dispatchClick(e) {
    const t = new MouseEvent(Mirror.eventNames.click, {
      view: window,
      screenX: e.screenX,
      screenY: e.screenY,
      clientX: e.clientX,
      clientY: e.clientY,
      button: e.button,
      buttons: e.buttons,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      bubbles: !0,
      cancelable: !0
    });
    this._wrapper.dispatchEvent(t)
  }

  _dispatchInput() {
    const e = new Event(Mirror.eventNames.input, {bubbles: !0, cancelable: !0});
    this._ensureContainerIsBeforeTargetElement(), this._wrapper.dispatchEvent(e)
  }

  _ensureContainerIsBeforeTargetElement() {
    const e = this._getTargetElement();
    e.previousElementSibling !== this._container && e.parentElement && e.parentElement.insertBefore(this._container, e)
  }

  _getTargetElement() {
    return this._isRoamResearchIssue || this._isHootsuiteIssue || this._isDotSyntaxHighlighterIssue ? this._mimickedElement.parentNode : this._mimickedElement
  }

  _render() {
    if (!this._mimickedElement.parentElement) return;
    this._domMeasurement.clearCache();
    const e = this._domMeasurement.getContentBox(this._mimickedElement, !1, !1),
      t = this._domMeasurement.getContentBox(this._mimickedElement, !1, !0);
    if (!this._container) {
      if (this._container = createContainerElement(document, FormElementMirror.CONTAINER_ELEMENT_NAME), this._container.style.display = "none", this._wrapper = document.createElement("lt-div"), this._wrapper.setAttribute("spellcheck", "false"), this._wrapper.className = "lt-mirror__wrapper notranslate", this._canvas = document.createElement("lt-div"), this._canvas.className = "lt-mirror__canvas", this._wrapper.appendChild(this._canvas), this._container.appendChild(this._wrapper), BrowserDetector.isFirefox() || BrowserDetector.isThunderbird()) {
        this._elementInlineLineHeight = this._domMeasurement.getInlineStyle(this._mimickedElement, "line-height"), this._elementComputedLineHeight = this._domMeasurement.getStyle(this._mimickedElement, "line-height");
        this._domMeasurement.getStyle(this._mimickedElement, "transition-property").match(/all|line\-height/) || (this._firefoxHackEnabled = !0)
      }
      const e = this._domMeasurement.getStyle(this._mimickedElement.parentElement, "display");
      "grid" !== e && "inline-grid" !== e || this._container.classList.add("lt-mirror--grid-item")
    }
    this._firefoxHackEnabled && (this._mimickedElement.style.lineHeight === this._elementComputedLineHeight ? this._domMeasurement.setStyles(this._mimickedElement, {"line-height": this._elementInlineLineHeight}) : this._elementInlineLineHeight = this._domMeasurement.getInlineStyle(this._mimickedElement, "lineHeight"), this._elementComputedLineHeight = this._domMeasurement.getStyle(this._mimickedElement, "line-height"), this._elementComputedLineHeight.includes("px") && this._domMeasurement.setStyles(this._mimickedElement, {"line-height": this._elementComputedLineHeight}));
    const i = this._domMeasurement.getStyles(this._mimickedElement, ["border", "border-radius", "border-top-width", "border-right-width", "border-left-width", "border-bottom-width", "border-top-style", "border-right-style", "border-left-style", "border-bottom-style", "direction", "font", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-weight", "hyphens", "letter-spacing", "line-break", "margin", "margin-top", "margin-left", "margin-bottom", "margin-right", "padding", "padding-top", "padding-left", "padding-right", "padding-bottom", "text-align", "text-decoration", "text-indent", "text-rendering", "text-transform", "transform", "transform-origin", "unicode-bidi", "white-space", "word-spacing", "word-wrap", "writing-mode", "zoom", "-webkit-locale", "-webkit-rtl-ordering"]);
    i["font-size"] = this._getWrapperFontSizeValue(i["font-size"]), i["line-height"] = this._domMeasurement.getExactStyle(this._mimickedElement, "line-height"), i["white-space"] = this._getWrapperWhiteSpaceValue(i["white-space"]), isSameObjects(i, this._wrapperStyles) || (this._domMeasurement.resetStyles(this._wrapper, i, !0), this._wrapperStyles = i), this._updateText(), this._ensureContainerIsBeforeTargetElement(), this._domMeasurement.setStyles(this._wrapper, {
      width: e.width + "px",
      height: e.height + "px"
    }, !0);
    const r = this._domMeasurement.getContentBox(this._wrapper, !1), n = t.left - r.left;
    if (Math.abs(n) > .05) {
      let e = parseFloat(this._domMeasurement.getStyle(this._wrapper, "margin-left"));
      e += n, this._domMeasurement.setStyles(this._wrapper, {"margin-left": e + "px"}, !0)
    }
    const s = t.top - r.top;
    if (Math.abs(s) > .05) {
      let e = parseFloat(this._domMeasurement.getStyle(this._wrapper, "margin-top"));
      e += s, this._domMeasurement.setStyles(this._wrapper, {"margin-top": e + "px"}, !0)
    }
    const a = this._domMeasurement.getScrollDimensions(this._mimickedElement, !1);
    let o = a.width - e.padding.left - e.padding.right, m = a.height - e.padding.top - e.padding.bottom;
    o === Math.round(e.width) && (o = e.width), this._domMeasurement.setStyles(this._canvas, {
      width: o + "px",
      height: m + "px"
    }, !0), this._updateScrolling(!1)
  }

  _getTextZoom(e = !1) {
    if (e && this._domMeasurement.clearCache(), !this._container) return 1;
    if (!BrowserDetector.isFirefox() && !BrowserDetector.isThunderbird()) return 1;
    this._measurer || (this._measurer = document.createElement("lt-div"), this._measurer.className = "lt-mirror__measurer", this._container.appendChild(this._measurer));
    return (Number.parseInt(this._domMeasurement.getStyle(this._measurer, "font-size")) || 0) / 100
  }

  _getWrapperFontSizeValue(e) {
    const t = this._getTextZoom();
    if (1 === t) return e;
    return (Number.parseFloat(e) || 0) / t + "px"
  }

  _getWrapperWhiteSpaceValue(e) {
    if (BrowserDetector.isChromium()) {
      if ("normal" === e) return "pre-wrap";
      if ("nowrap" === e) return "pre"
    }
    return e
  }

  _updateScrolling(e = !0) {
    e && this._domMeasurement.clearCache();
    const t = this._domMeasurement.getScrollPosition(this._mimickedElement, !1),
      i = this._domMeasurement.getScrollPosition(this._mimickedElement, !0, !1),
      r = this._domMeasurement.getScrollPosition(this._mimickedElement);
    this._domMeasurement.setStyles(this._canvas, {
      "margin-top": -t.top + "px",
      "margin-left": -t.left + "px"
    }, !0), this._wrapper.dataset.ltScrollTop = t.top.toString(), this._wrapper.dataset.ltScrollLeft = t.left.toString(), this._wrapper.dataset.ltScrollTopScaled = i.top.toString(), this._wrapper.dataset.ltScrollLeftScaled = i.left.toString(), this._wrapper.dataset.ltScrollTopScaledAndZoomed = r.top.toString(), this._wrapper.dataset.ltScrollLeftScaledAndZoomed = r.left.toString()
  }

  _updateText() {
    const e = this._mimickedElement.value;
    this._currentText !== e && (this._currentText = e, this._canvas.textContent = e, this._updateScrolling(), this._dispatchInput())
  }

  _onMimickedElementScroll() {
    window.requestAnimationFrame((() => {
      this._updateScrolling()
    }))
  }

  _onMimickedElementClick(e) {
    void 0 !== e.clientX && void 0 !== e.clientY && this._dispatchClick(e)
  }

  getCloneElement() {
    return this._wrapper
  }

  getTextElement() {
    return this._canvas
  }

  enableRangeMeasurements() {
    this._wrapper.classList.add("lt-mirror-enable-range-measurement")
  }

  disableRangeMeasurements() {
    this._wrapper.classList.remove("lt-mirror-enable-range-measurement")
  }

  destroy() {
    this._mimickedElement.removeEventListener("input", this._updateText), this._mimickedElement.removeEventListener("scroll", this._onMimickedElementScroll), this._mimickedElement.removeEventListener("click", this._onMimickedElementClick), this._renderInterval && this._renderInterval.destroy(), this._container && this._container.remove(), this._mimickedElementResizeObserver && this._mimickedElementResizeObserver.disconnect(), this._domMeasurement.clearCache()
  }
}

FormElementMirror.CONTAINER_ELEMENT_NAME = "lt-mirror";