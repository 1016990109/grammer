/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class OverleafRichEditorWrapper extends CEElementWrapper {
  constructor(e, t, s = Number.MAX_SAFE_INTEGER) {
    super(e, t, s)
  }

  _offsetInRawText(e, t, s) {
    let n = 0, r = 0;
    do {
      const i = e[n], l = t[r];
      if (i === l) r++; else if (this._ceElementInspector.isWhiteSpace(i) || "\n" === i) " " === l && r++; else {
        if ("\n" === l) {
          r++;
          continue
        }
        if (!isZWC(i)) break
      }
      if (r > s) break;
      n++
    } while (n < e.length);
    return n
  }

  _offsetInParsedText(e, t, s) {
    let n = 0, r = 0;
    for (; n < s;) {
      const s = e[n], i = t[r];
      if (s === i) r++; else if (this._ceElementInspector.isWhiteSpace(s) || "\n" === s) " " === i && r++; else {
        if ("\n" === i) {
          r++;
          continue
        }
        if (!isZWC(s)) break
      }
      n++
    }
    return r
  }

  _updateText() {
    const e = this._inputArea.querySelector(OverleafRichEditorWrapper.TEXT_LAYER_SELECTOR);
    if (!e) {
      const e = "" !== this._text;
      return this._textChunks = [], this._text = "", this._textOffset = 0, e
    }
    const t = [];
    let s = 0, n = 0, r = null, i = !0, l = !1;
    const o = DOMWalker.create(e);
    let c = !1;
    do {
      const e = o.currentNode;
      null === r && (r = this._ceElementInspector.getParagraphLastValuableNode(e)), c = !1;
      let a = !1, h = "";
      if (isElementNode(e)) if (e === r && (r = null, this._ceElementInspector.isTextEndsWithLineBreak(e) && (i = !0, l = !1, h += "\n\n")), this._ceElementInspector.isSkippingElement(e)) {
        if (c = !0, r = null, !h) continue
      } else this._ceElementInspector.isBlock(e) ? (r = null, i = !0, l = !1, !h && this._ceElementInspector.isBlockElementRelevant(e) && (h = "\n\n")) : this._ceElementInspector.isBr(e) && (r = null, i = !0, l = !1, !h && this._ceElementInspector.isBRElementRelevant(e) && (h = "\n")); else if (isTextNode(e) && (a = !0, h = this._ceElementInspector.getParsedText(e), h)) {
        const t = null === r || r === e;
        this._ceElementInspector.getParsingOptions(e).preserveWhitespaces || ((i || l) && (h = h.replace(CEElementWrapper.LEADING_WHITESPACES_REGEXP, "")), t && (h = h.replace(CEElementWrapper.TRAILING_WHITESPACES_REGEXP, ""))), i = i && "" === h, l = isEndsWithWhitespace(h), r === e && (r = null, this._ceElementInspector.isTextEndsWithLineBreak(e) && (i = !0, l = !1, h += "\n\n"))
      }
      if (t.push({
        node: e,
        isTextNode: a,
        rawText: a ? e.nodeValue : "",
        rawTextOffset: s,
        parsedText: h,
        parsedTextOffset: n
      }), a && (s += e.nodeValue.length), n += h.length, n > this._textLengthThreshold) break
    } while (o.next(c));
    const a = OverleafRichEditor.getEditorText(this._inputArea, t), h = this._text !== a.fullText;
    return this._textChunks = a.textChunks, this._text = a.fullText, this._textOffset = a.offset, h
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
    const t = OverleafRichEditor.getCursorPosition(this._inputArea, this._text);
    return null === t ? null : {start: t, end: t}
  }

  setSelection(e) {
    const t = e.start - this._textOffset, s = void 0 === e.end ? e.end : e.end - this._textOffset;
    super.setSelection({start: t, end: s})
  }

  scrollToText(e, t, s = "smooth", n = "nearest", r) {
    super.scrollToText(e - this._textOffset, t, s, n, r)
  }
}

OverleafRichEditorWrapper.TEXT_LAYER_SELECTOR = "div.CodeMirror-code";