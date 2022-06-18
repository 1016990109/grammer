/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class OverleafSourceEditorWrapper extends CEElementWrapper {
  constructor(e, t, s = Number.MAX_SAFE_INTEGER) {
    super(e, t, s)
  }

  _updateText() {
    const e = this._inputArea.querySelector(OverleafSourceEditorWrapper.TEXT_LAYER_SELECTOR);
    if (!e) {
      const e = "" !== this._text;
      return this._textChunks = [], this._text = "", this._textOffset = 0, e
    }
    const t = [];
    let s = 0, r = 0, n = null, l = !0, i = !1;
    const o = DOMWalker.create(e);
    let a = !1;
    do {
      const e = o.currentNode;
      null === n && (n = this._ceElementInspector.getParagraphLastValuableNode(e)), a = !1;
      let c = !1, E = "";
      if (isElementNode(e)) e === n && (n = null, this._ceElementInspector.isTextEndsWithLineBreak(e) && (l = !0, i = !1, E += "\n\n")), this._ceElementInspector.isBlock(e) ? (n = null, l = !0, i = !1, !E && this._ceElementInspector.isBlockElementRelevant(e) && (E = "\n\n")) : this._ceElementInspector.isBr(e) && (n = null, l = !0, i = !1, !E && this._ceElementInspector.isBRElementRelevant(e) && (E = "\n")); else if (isTextNode(e) && (c = !0, E = this._ceElementInspector.getParsedText(e), E)) {
        const t = null === n || n === e;
        this._ceElementInspector.getParsingOptions(e).preserveWhitespaces || ((l || i) && (E = E.replace(CEElementWrapper.LEADING_WHITESPACES_REGEXP, "")), t && (E = E.replace(CEElementWrapper.TRAILING_WHITESPACES_REGEXP, ""))), l = l && "" === E, i = isEndsWithWhitespace(E), n === e && (n = null, this._ceElementInspector.isTextEndsWithLineBreak(e) && (l = !0, i = !1, E += "\n\n"))
      }
      if (t.push({
        node: e,
        isTextNode: c,
        rawText: c ? e.nodeValue : "",
        rawTextOffset: s,
        parsedText: E,
        parsedTextOffset: r
      }), c && (s += e.nodeValue.length), r += E.length, r > this._textLengthThreshold) break
    } while (o.next(a));
    const c = OverleafSourceEditor.getEditorText(this._inputArea, t), E = this._text !== c.fullText;
    return this._textChunks = c.textChunks, this._text = c.fullText, this._textOffset = c.offset, E
  }

  getTextRanges(e, t) {
    return super.getTextRanges(e - this._textOffset, t)
  }

  replaceText(e, t, s) {
    return super.replaceText(e - this._textOffset, t, s)
  }

  getSelection() {
    const e = super.getSelection();
    if (e && e.start !== e.end) return e.start += this._textOffset, e.end += this._textOffset, e;
    const t = OverleafSourceEditor.getCursorPosition(this._inputArea, this._text);
    return null === t ? null : {start: t, end: t}
  }

  setSelection(e) {
    const t = e.start - this._textOffset, s = void 0 === e.end ? e.end : e.end - this._textOffset;
    super.setSelection({start: t, end: s})
  }

  scrollToText(e, t, s = "smooth", r = "nearest", n) {
    super.scrollToText(e - this._textOffset, t, s, r, n)
  }
}

OverleafSourceEditorWrapper.TEXT_LAYER_SELECTOR = "div.ace_layer.ace_text-layer";