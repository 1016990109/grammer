/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class FormElementWrapper extends InputAreaWrapper {
  constructor(t, e, s, r = Number.MAX_SAFE_INTEGER) {
    super(t, s, r), this._scrollToInterval = null, this._mirror = e, this._mirrorElement = e.getCloneElement(), this._ceElementInspector = new CEElementInspector(this._mirrorElement, this._tweaks.getParsingDetector()), this._domMeasurement = new DomMeasurement(this._inputArea.ownerDocument), this._scrollTop = this._inputArea.scrollTop, this._scrollLeft = this._inputArea.scrollLeft, this._updateText(), this._onDblClick = this._onDblClick.bind(this), this._onScroll = this._onScroll.bind(this), this._inputArea.addEventListener("dblclick", this._onDblClick), this._inputArea.addEventListener("scroll", this._onScroll), this._mirrorElement.addEventListener(Mirror.eventNames.input, this._onInput)
  }

  _onDblClick(t) {
    const e = removeZWC(this._tweaks.getSelectedText()), s = this.getSelection();
    if (!e || !s) return;
    const r = s.end || s.start, n = this.getTextRanges(s.start, r - s.start);
    if (!n.length) return;
    this._domMeasurement.clearCache();
    const i = this._domMeasurement.getTextBoundingBoxes(n, this._mirrorElement),
      o = this._domMeasurement.getTextBoundingBoxes(n, this._mirrorElement, !1);
    if (!i.length) return;
    if (!o.some((e => isPointInsideRect(e, t.clientX, t.clientY)))) return;
    const l = {inputAreaWrapper: this, selectedText: e, selection: s, clickedRectangles: i};
    dispatchCustomEvent(document, InputAreaWrapper.eventNames.dblclick, l)
  }

  _onScroll() {
    const t = this._inputArea.scrollTop, e = this._inputArea.scrollLeft;
    if (this._scrollTop === t && this._scrollLeft === e) return;
    this._scrollTop = t, this._scrollLeft = e;
    const s = {inputAreaWrapper: this};
    dispatchCustomEvent(document, InputAreaWrapper.eventNames.scroll, s)
  }

  _hasSpaceBefore(t) {
    if (t <= 0 || 0 === this._textChunks.length) return !1;
    const e = this._textChunks[0], s = this._offsetInRawText(e.rawText, e.parsedText, t - 1),
      r = this._offsetInRawText(e.rawText, e.parsedText, t);
    return FormElementWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(e.rawText.substring(s, r))
  }

  _hasSpaceAfter(t) {
    if (0 === this._textChunks.length) return !1;
    const e = this._textChunks[0], s = this._offsetInRawText(e.rawText, e.parsedText, t),
      r = this._offsetInRawText(e.rawText, e.parsedText, t + 1);
    return FormElementWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(e.rawText.substring(s, r))
  }

  _offsetInRawText(t, e, s) {
    s = Math.min(t.length, s);
    const r = indexOfZWC(t);
    if (-1 === r || s < r) return s;
    let n = r, i = r;
    do {
      if (isZWC(t[n]) || i++, i > s) break;
      n++
    } while (n < t.length);
    return n
  }

  _offsetInParsedText(t, e, s) {
    let r = 0;
    for (let e = 0; e < Math.min(t.length, s); e++) isZWC(t[e]) && r++;
    return s - r
  }

  _updateText() {
    const t = [];
    let e = "";
    const s = this._mirror.getTextElement().firstChild;
    if (s) {
      const r = s.textContent || "";
      e = this._ceElementInspector.getParsedText(s), t.push({
        node: s,
        isTextNode: !0,
        rawText: r,
        rawTextOffset: 0,
        parsedText: e,
        parsedTextOffset: 0
      })
    }
    const r = this._text !== e;
    return this._text = e, this._textChunks = t, r
  }

  getTextBoxes(t, e) {
    const s = this.getTextRanges(t, e);
    return s.length ? (this._domMeasurement.clearCache(), this._domMeasurement.getTextBoundingBoxes(s, this._mirrorElement)) : []
  }

  resetText() {
    const t = this._inputArea.value;
    this._inputArea.value = "", this._inputArea.value = t
  }

  replaceText(t, e, s) {
    if (t < 0 || 0 === this._textChunks.length) return Promise.resolve();
    const r = t + s.length;
    "" === s && (this._hasSpaceBefore(t) || 0 === t) && this._hasSpaceAfter(t + e) && (t = Math.max(t - 1, 0), e += 1), this.setSelection({
      start: t,
      end: t + e
    });
    let n = document.execCommand("insertText", !1, s);
    "" === s && (BrowserDetector.isFirefox() || BrowserDetector.isThunderbird()) && (n = !1);
    const i = (BrowserDetector.isFirefox() || BrowserDetector.isThunderbird()) && s.includes(FormElementWrapper.NBSP);
    if (n) {
      if (i) {
        const e = this._inputArea.value, r = this._textChunks[0], n = this._offsetInRawText(e, r.parsedText, t),
          i = this._offsetInRawText(e, r.parsedText, t + s.length), o = e.substring(0, n) + s + e.substring(i);
        this._inputArea.value = o
      }
    } else {
      const r = this._textChunks[0], n = this._offsetInRawText(r.rawText, r.parsedText, t),
        i = this._offsetInRawText(r.rawText, r.parsedText, t + e),
        o = r.rawText.substring(0, n) + s + r.rawText.substring(i);
      this._inputArea.value = o
    }
    return this.setSelection({start: r}), n || this.simulateInput(s), Promise.resolve()
  }

  getSelection() {
    if (this._inputArea !== getActiveElement()) return null;
    const t = this.getText();
    return {
      start: this._offsetInParsedText(this._inputArea.value, t, this._inputArea.selectionStart),
      end: this._offsetInParsedText(this._inputArea.value, t, this._inputArea.selectionEnd)
    }
  }

  setSelection(t) {
    const e = t.start, s = void 0 === t.end ? e : t.end;
    if (this._inputArea.focus(), 0 === this._textChunks.length) return;
    const r = this._textChunks[0];
    this._inputArea.selectionStart = this._offsetInRawText(r.rawText, r.parsedText, e), this._inputArea.selectionEnd = this._offsetInRawText(r.rawText, r.parsedText, s)
  }

  scrollToText(t, e, s = "smooth", r = "nearest", n) {
    const i = "smooth" === s ? 300 : 0;

    function o(t, e, s, r) {
      return (t /= r / 2) < 1 ? s / 2 * t * t + e : -s / 2 * (--t * (t - 2) - 1) + e
    }

    if (t < 0) return;
    this._scrollToInterval && (this._scrollToInterval.destroy(), this._scrollToInterval = null);
    const l = this._inputArea.scrollTop, a = this._inputArea.scrollLeft;
    this._domMeasurement.clearCache();
    const h = this.getTextRanges(t, e), _ = this._domMeasurement.getRelativeTextBoundingBox(h, this._mirrorElement),
      c = this._inputArea.getBoundingClientRect();
    let u = this._inputArea.scrollTop + _.top;
    "center" === r && (u -= this._inputArea.clientHeight / 2, u -= _.height / 2), c.top < 0 && (u += c.top);
    let p = this._inputArea.scrollLeft + _.left;
    c.left < 0 && (p += c.left);
    const T = u - l, m = p - a;
    let x = 0;
    this._scrollToInterval = setAnimationFrameInterval((() => {
      x += FormElementWrapper.SCROLL_TO_FRAME_INTERVAL;
      const t = o(x, l, T, i), e = o(x, a, m, i);
      this._inputArea.scrollTop = t, this._inputArea.scrollLeft = e, x >= i && (this._scrollToInterval && (this._scrollToInterval.destroy(), this._scrollToInterval = null), n && setTimeout((() => n()), 50))
    }), FormElementWrapper.SCROLL_TO_FRAME_INTERVAL)
  }

  destroy() {
    super.destroy(), this._inputArea.removeEventListener("dblclick", this._onDblClick), this._inputArea.removeEventListener("scroll", this._onScroll), this._mirrorElement.removeEventListener(Mirror.eventNames.input, this._onInput), this._ceElementInspector.destroy(), this._scrollToInterval && this._scrollToInterval.destroy()
  }
}

FormElementWrapper.SCROLL_TO_FRAME_INTERVAL = 20, FormElementWrapper.NBSP = String.fromCharCode(160), FormElementWrapper.VISIBLE_WHITE_SPACE_REGEXP = /\u00A0|\u0020|\u2009|\u202F/;