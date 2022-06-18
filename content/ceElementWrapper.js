/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class CEElementWrapper extends InputAreaWrapper {
  constructor(e, t, n = Number.MAX_SAFE_INTEGER) {
    super(e, t, n), this._ceElementInspector = new CEElementInspector(this._inputArea, this._tweaks.getParsingDetector(), this._tweaks.getCacheInvalidationRules()), this._domMeasurement = new DomMeasurement(this._inputArea.ownerDocument), this._scrollTop = this._inputArea.scrollTop, this._scrollLeft = this._inputArea.scrollLeft, this._updateText(), this._onDblClick = this._onDblClick.bind(this), this._onScroll = this._onScroll.bind(this), this._inputArea.addEventListener("dblclick", this._onDblClick), this._inputArea.addEventListener("scroll", this._onScroll), "BODY" === this._inputArea.nodeName && window.addEventListener("scroll", this._onScroll), this._inputAreaObserver = this._tweaks.createMutationObserver(this._onInput), this._inputAreaObserver.observe(this._inputArea, CEElementWrapper.INPUT_AREA_OBSERVER_CONFIG)
  }

  static _selectText(e, t = 0, n = e.nodeValue.length) {
    t = Math.max(t, 0), n = Math.min(n, e.nodeValue.length);
    const s = window.getSelection();
    s.removeAllRanges();
    const i = new Range;
    i.setStart(e, t), i.setEnd(e, n), s.addRange(i)
  }

  static _simulateMouseDown(e, t) {
    const n = new MouseEvent("mousedown", {bubbles: !0, cancelable: !1, clientX: t.x, clientY: t.y + t.height / 2});
    return e.dispatchEvent(n)
  }

  static _simulateMouseUp(e, t) {
    const n = new MouseEvent("mouseup", {
      bubbles: !0,
      cancelable: !1,
      clientX: t.x + t.width,
      clientY: t.y + t.height / 2
    });
    return e.dispatchEvent(n)
  }

  static _simulateMouseMove(e, t) {
    const n = new MouseEvent("mousemove", {
      bubbles: !0,
      cancelable: !1,
      clientX: t.x + t.width,
      clientY: t.y + t.height / 2
    });
    return e.dispatchEvent(n)
  }

  static _simulateBackspaceDown(e) {
    const t = new KeyboardEvent("keydown", {
      bubbles: !0,
      cancelable: !0,
      keyCode: 8,
      which: 8,
      location: 0,
      key: "Backspace"
    });
    return e.dispatchEvent(t)
  }

  static _simulateBackspaceUp(e) {
    const t = new KeyboardEvent("keyup", {
      bubbles: !0,
      cancelable: !0,
      keyCode: 8,
      which: 8,
      location: 0,
      key: "Backspace"
    });
    return e.dispatchEvent(t)
  }

  static _simulateSelection(e) {
    const t = e.ownerDocument.createRange();
    t.setStart(e, 0), t.collapse(!1);
    const n = t.getBoundingClientRect();
    this._simulateMouseDown(e, n);
    const s = window.getSelection();
    s.removeAllRanges(), s.addRange(t), this._simulateMouseMove(e, n), this._simulateMouseUp(e, n)
  }

  _onDblClick(e) {
    const t = removeZWC(this._tweaks.getSelectedText()), n = this.getSelection();
    if (!t || !n) return;
    const s = n.end || n.start, i = this.getTextRanges(n.start, s - n.start);
    if (!i.length) return;
    this._domMeasurement.clearCache();
    const r = this._domMeasurement.getTextBoundingBoxes(i, this._inputArea),
      o = this._domMeasurement.getTextBoundingBoxes(i, this._inputArea, !1);
    if (!r.length) return;
    if (!o.some((t => isPointInsideRect(t, e.clientX, e.clientY)))) return;
    const a = {inputAreaWrapper: this, selectedText: t, selection: n, clickedRectangles: r};
    dispatchCustomEvent(document, InputAreaWrapper.eventNames.dblclick, a)
  }

  _onScroll() {
    let e = 0, t = 0;
    if ("BODY" === this._inputArea.nodeName ? (e = document.body && document.body.scrollTop || document.documentElement && document.documentElement.scrollTop || 0, t = document.body && document.body.scrollLeft || document.documentElement && document.documentElement.scrollLeft || 0) : (e = this._inputArea.scrollTop, t = this._inputArea.scrollLeft), this._scrollTop === e && this._scrollLeft === t) return;
    this._scrollTop = e, this._scrollLeft = t;
    const n = {inputAreaWrapper: this};
    dispatchCustomEvent(document, InputAreaWrapper.eventNames.scroll, n)
  }

  _hasSpaceBefore(e) {
    if (e <= 0) return !1;
    const t = this.getTextRanges(e - 1, 1)[0];
    return Boolean(t && t.node.nodeValue && CEElementWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(t.node.nodeValue.substring(t.start, t.end)))
  }

  _hasSpaceAfter(e) {
    const t = this.getTextRanges(e, 1)[0];
    return Boolean(t && t.node.nodeValue && CEElementWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(t.node.nodeValue.substring(t.start, t.end)))
  }

  _offsetInRawText(e, t, n) {
    n = Math.min(e.length, n);
    let s = 0, i = 0;
    do {
      const r = e[s], o = t[i];
      if (r === o) i++; else if (this._ceElementInspector.isWhiteSpace(r) || "\n" === r) " " === o && i++; else if (!isZWC(r)) break;
      if (i > n) break;
      s++
    } while (s < e.length);
    return s
  }

  _offsetInParsedText(e, t, n) {
    let s = 0, i = 0;
    for (; s < n;) {
      const n = e[s], r = t[i];
      if (n === r) i++; else if (this._ceElementInspector.isWhiteSpace(n) || "\n" === n) " " === r && i++; else if (!isZWC(n)) break;
      s++
    }
    return i
  }

  _updateText() {
    const e = [];
    let t = 0, n = 0, s = null, i = !0, r = !1;
    const o = DOMWalker.create(this._inputArea);
    let a = !1;
    do {
      const l = o.currentNode;
      null === s && (s = this._ceElementInspector.getParagraphLastValuableNode(l)), a = !1;
      let c = !1, u = "";
      if (isElementNode(l)) if (u = this._ceElementInspector.getReplacementText(l), i = i && "" === u, r = isEndsWithWhitespace(u), l === s && (s = null, this._ceElementInspector.isTextEndsWithLineBreak(l) && (i = !0, r = !1, u += "\n\n")), this._ceElementInspector.isSkippingElement(l)) {
        if (a = !0, s = null, !u) continue
      } else this._ceElementInspector.isBlock(l) ? (s = null, i = !0, r = !1, !u && this._ceElementInspector.isBlockElementRelevant(l) && (u = "\n\n")) : this._ceElementInspector.isBr(l) && (s = null, i = !0, r = !1, !u && this._ceElementInspector.isBRElementRelevant(l) && (u = "\n")); else if (isTextNode(l) && (c = !0, u = this._ceElementInspector.getParsedText(l), u)) {
        const e = null === s || s === l;
        this._ceElementInspector.getParsingOptions(l).preserveWhitespaces || ((i || r) && (u = u.replace(CEElementWrapper.LEADING_WHITESPACES_REGEXP, "")), e && (u = u.replace(CEElementWrapper.TRAILING_WHITESPACES_REGEXP, ""))), i = i && "" === u, r = isEndsWithWhitespace(u), l === s && (s = null, this._ceElementInspector.isTextEndsWithLineBreak(l) && (i = !0, r = !1, u += "\n\n"))
      }
      const h = c ? l.nodeValue : "";
      if (e.push({
        node: l,
        isTextNode: c,
        rawText: h,
        rawTextOffset: t,
        parsedText: u,
        parsedTextOffset: n
      }), c && (t += h.length), n += u.length, n > this._textLengthThreshold) break
    } while (o.next(a));
    let l = "";
    for (const t of e) l += t.parsedText;
    const c = this._text !== l;
    return this._text = l, this._textChunks = e, c
  }

  _getTextPosition(e) {
    const t = this._getTextChunkIndex(e);
    if (-1 === t) return null;
    const n = this._textChunks[t];
    return e -= n.parsedTextOffset, {textNode: n.node, offset: this._offsetInRawText(n.rawText, n.parsedText, e)}
  }

  _getTextOffset(e, t) {
    let n = null, s = 0;
    if (isElementNode(e)) {
      const i = DOMWalker.create(this._inputArea);
      do {
        const s = i.currentNode;
        if (s === e.childNodes[t]) break;
        isTextNode(s) && s.textContent && (n = s)
      } while (i.next());
      if (!n) return -1;
      s = n.textContent.length
    } else isTextNode(e) && (n = e, s = t);
    const i = this._textChunks.find((e => e.node === n));
    return i ? i.parsedTextOffset + this._offsetInParsedText(i.rawText, i.parsedText, s) : -1
  }

  _applyReplacement(e, t = !0) {
    let n = Promise.resolve();
    t && (n = n.then((() => {
      e.textNode.parentNode && CEElementWrapper._simulateSelection(e.textNode.parentNode)
    })).then((() => wait())));
    const s = e.textNode.parentElement || this._inputArea, i = e.textNode.ownerDocument.createRange();
    i.setStart(e.textNode, e.from), i.setEnd(e.textNode, e.to);
    const r = i.getBoundingClientRect();
    n = n.then((() => (CEElementWrapper._simulateMouseDown(s, r), wait(isCodeMirror(this._inputArea) ? 21 : 0)))).then((() => (CEElementWrapper._simulateMouseMove(s, r), CEElementWrapper._selectText(e.textNode, e.from, e.to), wait(isCodeMirror(this._inputArea) ? 21 : 0)))).then((() => (CEElementWrapper._simulateMouseUp(s, r), isSlateEditor(this._inputArea) || isOpenXchangeEditor(this._inputArea) || isTrixEditor(this._inputArea) ? wait(201) : isDraftJS(this._inputArea) ? wait(0) : isCodeMirror(this._inputArea) ? wait(21) : void 0))).then((() => {
      if (!isTrixEditor(this._inputArea) || !BrowserDetector.isFirefox() && !BrowserDetector.isThunderbird()) {
        if (isDraftJS(this._inputArea) && "" === e.replacementText && e.from !== e.to) {
          if (CEElementWrapper._simulateBackspaceDown(this._inputArea)) {
            const e = new window.InputEvent("beforeinput", {bubbles: !0, cancelable: !0, inputType: "deleteContent"});
            let t = !0;
            "deleteContent" === e.inputType && (t = this._inputArea.dispatchEvent(e)), t && document.execCommand("delete", !1)
          }
          return wait().then((() => {
            CEElementWrapper._simulateBackspaceUp(this._inputArea)
          }))
        }
        if (isOpenXchangeEditor(this._inputArea)) simulatePaste(this._inputArea, e.replacementText); else if (isSlateEditor(this._inputArea)) simulatePaste(this._inputArea, e.replacementText); else {
          const t = new window.InputEvent("beforeinput", {
            bubbles: !0,
            cancelable: !0,
            inputType: "insertText",
            data: e.replacementText
          });
          let n = !0;
          "insertText" === t.inputType && (n = this._inputArea.dispatchEvent(t)), n && document.execCommand("insertText", !1, e.replacementText)
        }
      }
    }));
    return (BrowserDetector.isFirefox() || BrowserDetector.isThunderbird()) && (e.replacementText.includes(CEElementWrapper.NBSP) || isTrixEditor(this._inputArea)) && (n = n.then((() => {
      const t = new window.InputEvent("beforeinput", {
        bubbles: !0,
        cancelable: !1,
        inputType: "insertText",
        data: e.replacementText
      });
      this._inputArea.dispatchEvent(t), e.textNode.nodeValue = e.newText, this.simulateInput(e.replacementText)
    }))), n
  }

  getTextBoxes(e, t) {
    const n = this.getTextRanges(e, t);
    return n.length ? (this._domMeasurement.clearCache(), this._domMeasurement.getTextBoundingBoxes(n, this._inputArea)) : []
  }

  resetText() {
    this._inputAreaObserver.disconnect();
    const e = DOMWalker.create(this._inputArea);
    do {
      const t = e.currentNode;
      isTextNode(t) && (t.textContent = t.textContent)
    } while (e.next());
    this._inputAreaObserver.observe(this._inputArea, CEElementWrapper.INPUT_AREA_OBSERVER_CONFIG)
  }

  replaceText(e, t, n) {
    if (e < 0) return Promise.resolve();
    const s = e + n.length;
    "" === n && (this._hasSpaceBefore(e) || 0 === e) && this._hasSpaceAfter(e + t) && (e = Math.max(e - 1, 0), t += 1);
    const i = Promise.resolve(),
      r = !(isTinyMCE(this._inputArea) || isGutenberg(this._inputArea) || isDraftJS(this._inputArea) || isThunderbird(this._inputArea) || isTrixEditor(this._inputArea) || isCodeMirror(this._inputArea) || isProseMirror(this._inputArea) || isLTEditor(this._inputArea) || isWriterDuet(this._inputArea) || isOpenXchangeEditor(this._inputArea) || isSlateEditor(this._inputArea) || isCKEditor(this._inputArea) || isMedium(this._inputArea) || isNotion(this._inputArea) || isWikpedia(this._inputArea));
    return r && i.then((() => CEElementWrapper._simulateSelection(this._inputArea))), i.then((() => wait(50))).then((() => {
      const i = [], o = this._getTextChunkIndex(e);
      if (-1 === o) return Promise.resolve();
      e -= this._textChunks[o].parsedTextOffset;
      for (let s = o; s < this._textChunks.length; s++) {
        const {node: r, isTextNode: o, rawText: a, parsedText: l} = this._textChunks[s];
        if (o && e < l.length) {
          const s = l.substr(0, e) + n + l.substr(e + t);
          if (a !== s) {
            const o = this._offsetInRawText(a, l, e), c = this._offsetInRawText(a, l, e + t);
            i.push({textNode: r, from: o, to: c, replacementText: n, newText: s})
          }
          t = Math.max(t - (l.length - e), 0), e = 0, n = ""
        } else e -= l.length;
        if (0 === t && "" === n) break
      }
      i.reverse().reduce(((e, t) => e.then((() => this._applyReplacement(t, r)))), Promise.resolve()).then((() => {
        this.setSelection({start: s})
      })).then((() => {
        this.simulateChange(), this.simulateKeyUp()
      }))
    }))
  }

  getSelection() {
    const e = this._tweaks.getSelection();
    if (!e || !e.startNode) return null;
    if (!this._inputArea.contains(e.startNode)) return null;
    const t = this._getTextOffset(e.startNode, e.startOffset);
    return {start: t, end: e.isCollapsed || !e.endNode ? t : this._getTextOffset(e.endNode, e.endOffset)}
  }

  setSelection(e) {
    const t = e.start, n = void 0 === e.end ? t : e.end;
    this._inputArea.focus();
    const s = this._getTextPosition(t);
    if (!s) return;
    const i = window.getSelection();
    i.removeAllRanges();
    const r = new Range;
    if (r.setStart(s.textNode, s.offset), t !== n) {
      const e = this._getTextPosition(n);
      if (!e) return;
      r.setEnd(e.textNode, e.offset)
    } else r.collapse(!1);
    i.addRange(r)
  }

  scrollToText(e, t, n = "smooth", s = "nearest", i) {
    if (e < 0) return;
    const r = () => {
      i && setTimeout((() => i()), 50)
    }, o = this.getTextRanges(e, t);
    if (o.length) try {
      const e = new Range;
      e.setStart(o[0].node, o[0].start), e.setEnd(o[o.length - 1].node, o[o.length - 1].end), window.scrollRangeIntoView(e, {
        behavior: n,
        block: s
      }, r)
    } catch (e) {
    }
  }

  destroy() {
    super.destroy(), this._inputArea.removeEventListener("dblclick", this._onDblClick), this._inputArea.removeEventListener("scroll", this._onScroll), window.removeEventListener("scroll", this._onScroll), this._ceElementInspector.destroy(), this._inputAreaObserver && this._inputAreaObserver.disconnect()
  }
}

CEElementWrapper.NBSP = String.fromCharCode(160), CEElementWrapper.VISIBLE_WHITE_SPACE_REGEXP = /\u00A0|\u0020|\u2009|\u202F/, CEElementWrapper.LEADING_WHITESPACES_REGEXP = new RegExp(/^ /), CEElementWrapper.TRAILING_WHITESPACES_REGEXP = new RegExp(/ $/), CEElementWrapper.INPUT_AREA_OBSERVER_CONFIG = {
  attributes: !0,
  attributeOldValue: !1,
  characterData: !0,
  characterDataOldValue: !1,
  childList: !0,
  subtree: !0,
  attributeFilter: ["id", "class", "style"]
};