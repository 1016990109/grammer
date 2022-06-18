/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class InputAreaWrapper {
  constructor(t, e, s = Number.MAX_SAFE_INTEGER) {
    this._inputArea = t, this._tweaks = e, this._textLengthThreshold = s, this._keyboardEventTarget = this._tweaks.getKeyboardEventTarget(), this._lastPressInfo = {
      key: "",
      timeStamp: 0
    }, this._onBlur = this._onBlur.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onPaste = this._onPaste.bind(this), this._onInput = this._onInput.bind(this), this._inputArea.addEventListener("blur", this._onBlur), this._keyboardEventTarget.addEventListener("keyup", this._onKeyUp), this._inputArea.addEventListener("paste", this._onPaste)
  }

  _onBlur() {
    const t = {inputAreaWrapper: this};
    dispatchCustomEvent(document, InputAreaWrapper.eventNames.blur, t)
  }

  _onKeyUp(t) {
    const e = Date.now();
    if (t.key && t.isTrusted) if (t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) this._lastPressInfo = {
      key: "",
      timeStamp: 0
    }; else if (this._lastPressInfo.key === t.key) {
      if (e - this._lastPressInfo.timeStamp < InputAreaWrapper.MAX_DOUBLE_PRESS_DELAY) {
        const e = {inputAreaWrapper: this, key: t.key};
        dispatchCustomEvent(document, InputAreaWrapper.eventNames.dblPress, e), this._lastPressInfo = {
          key: "",
          timeStamp: 0
        }
      } else this._lastPressInfo = {key: t.key, timeStamp: e}
    } else this._lastPressInfo = {key: t.key, timeStamp: e}
  }

  _onPaste(t) {
    const e = t.clipboardData,
      s = {inputAreaWrapper: this, isSignificantTextChange: (e ? e.getData("Text") : "").length > 200};
    dispatchCustomEvent(document, InputAreaWrapper.eventNames.paste, s)
  }

  _onInput() {
    const t = this._text;
    if (!this._updateText()) return;
    const e = {inputAreaWrapper: this, previousText: t, text: this._text};
    dispatchCustomEvent(document, InputAreaWrapper.eventNames.textChanged, e)
  }

  _getTextChunkIndex(t) {
    let e = 0, s = this._textChunks.length, n = 0;
    for (; e < s;) {
      n = e + Math.floor((s - e) / 2);
      const r = this._textChunks[e];
      if (r.parsedTextOffset <= t && t <= r.parsedTextOffset + r.parsedText.length) return e;
      const a = this._textChunks[n];
      a.parsedTextOffset + a.parsedText.length >= t ? s = n : e = n + 1
    }
    return e < this._textChunks.length ? e : -1
  }

  simulateKeyUp() {
    try {
      const t = new window.KeyboardEvent("keyup", {
        bubbles: !0,
        cancelable: !0,
        keyCode: 17,
        which: 17,
        charCode: 0,
        location: 1,
        key: "Control",
        code: "ControlLeft"
      });
      this._inputArea.dispatchEvent(t)
    } catch (t) {
    }
  }

  simulateInput(t = "") {
    const e = new window.InputEvent("input", {bubbles: !0, cancelable: !1, inputType: "insertText", data: t});
    this._inputArea.dispatchEvent(e)
  }

  simulateChange() {
    const t = new Event("change", {bubbles: !0, cancelable: !1});
    this._inputArea.dispatchEvent(t)
  }

  getText() {
    return this._text
  }

  getTextChunks() {
    return this._textChunks
  }

  getTextRanges(t, e, s = !0) {
    if (t < 0) return [];
    const n = this._getTextChunkIndex(t);
    if (-1 === n) return [];
    const r = [];
    for (let a = n; a < this._textChunks.length; a++) {
      const {node: n, isTextNode: i, rawText: p, parsedText: h, parsedTextOffset: o} = this._textChunks[a],
        u = Math.max(t - o, 0);
      if (!i) {
        e -= h.length - u;
        continue
      }
      const l = this._offsetInRawText(p, h, u), _ = this._offsetInRawText(p, h, u + e);
      if ((!s || l !== _) && (r.push({node: n, text: p, start: l, end: _}), (e -= h.length - u) <= 0)) break
    }
    return r
  }

  destroy() {
    this._inputArea.removeEventListener("blur", this._onBlur), this._keyboardEventTarget.removeEventListener("keyup", this._onKeyUp), this._inputArea.removeEventListener("paste", this._onPaste)
  }
}

InputAreaWrapper.MAX_DOUBLE_PRESS_DELAY = 400, InputAreaWrapper.eventNames = {
  blur: "lt-inputAreaWrapper.blur",
  scroll: "lt-inputAreaWrapper.scroll",
  paste: "lt-inputAreaWrapper.paste",
  textChanged: "lt-inputAreaWrapper.textChanged",
  dblclick: "lt-inputAreaWrapper.dblclick",
  dblPress: "lt-inputAreaWrapper.dblPress"
};