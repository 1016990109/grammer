/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class SVGElementWrapper extends InputAreaWrapper {
  constructor(t, e, r = Number.MAX_SAFE_INTEGER) {
    super(t, e, r), this._paragraphs = [], this.BULLET_POINT_REG_EXP = /^([\u25CF\u25CB\u25C6\u27A2\u25A0\u25A1\u2605\u274F\u2794\u21B5\u2756\u25AA\u2751\u2022\-\–\—o]|[VIX]+\.|[a-z0-9]{1,3}\.|\d{1,2}\.?\)|\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.\d{1,2}\.|[a-z]{1,2}\.?\)|[A-Z]{1,2}\.?\)|[A-Z]\.)$/, this.FOOTNOTE_NUMBER_REGEXP = /^\d{1,2}$/, this.WHITE_SPACE_REG_EXP = /\s/, this.URL_FRAGMENT_REG_EXP = /[a-z0-9]=\!?[a-z0-9]|[a-z0-9\.]{2,}\![a-z0-9\.]{2,}|[\-_][a-z0-9]{5,}[\-_][a-z0-9]{5,}[\-_][a-z0-9]{5,}|^\/.+?\/[^\s]+|^\-[a-z\-\/]+\/$|^[A-Za-z0-9]+_[A-Za-z0-9]+\/[A-Za-z0-9_]+$/i, this.FOOTNOTE_NUMBER_FONT_SIZES = [6, 7, 8, 9], this.PAGE_NUMBER_REGEXP = /^\d{1,3}$/, this.PUNCTUATION_REG_EXP = /^[\.!\?,;\:"”“'’‘]/, this._onMutation = t => {
      t.forEach((t => {
        if (t.removedNodes.length && t.removedNodes.forEach((t => {
          "g" === t.nodeName ? this._removeParagraph(t) : "rect" === t.nodeName && this._removeRect(t)
        })), t.addedNodes.length) {
          const e = [];
          t.addedNodes.forEach((t => {
            "g" === t.nodeName ? this._addParagraph(t) : "rect" === t.nodeName && t.parentNode && "g" === t.parentNode.nodeName && !e.includes(t.parentNode) && e.push(t.parentNode)
          })), e.forEach((t => this._rebuildParagraph(t)))
        }
      })), this._onInput()
    }, this._onDblClick = t => {
      const e = removeZWC(this._tweaks.getSelectedText()), r = this.getSelection();
      if (!e || !r) return;
      const s = {
        inputAreaWrapper: this,
        selectedText: e,
        selection: r,
        clickedRectangles: GoogleDocsCanvas.getSelectionRects(this._inputArea).map((t => {
          const e = t.getBoundingClientRect();
          return {top: e.top, right: e.right, bottom: e.bottom, left: e.left, width: e.width, height: e.height}
        }))
      };
      dispatchCustomEvent(document, InputAreaWrapper.eventNames.dblclick, s)
    }, this._pageContainer = GoogleDocsCanvas.getPageContainer(t), Array.from(this._inputArea.getElementsByTagName("g"), (t => {
      this._addParagraph(t)
    })), this._updateText(), this._inputArea.addEventListener("dblclick", this._onDblClick), this._inputAreaObserver = this._tweaks.createMutationObserver(this._onMutation), this._inputAreaObserver.observe(this._inputArea, SVGElementWrapper.INPUT_AREA_OBSERVER_CONFIG)
  }

  _hasSpaceBefore(t) {
    if (t <= 0) return !1;
    const e = this.getTextRanges(t - 1, 1)[0];
    if (!e) return !1;
    const r = e.node.getAttribute("aria-label");
    return Boolean(r && CEElementWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(r.substring(e.start, e.end)))
  }

  _hasSpaceAfter(t) {
    const e = this.getTextRanges(t, 1)[0];
    if (!e) return !1;
    const r = e.node.getAttribute("aria-label");
    return Boolean(r && CEElementWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(r.substring(e.start, e.end)))
  }

  _offsetInRawText(t, e, r) {
    r = Math.min(t.length, r);
    let s = 0, n = 0;
    do {
      const a = t[s], i = e[n];
      if (a === i) n++; else if (isWhiteSpace(a) || "\n" === a) " " === i && n++; else if ("\ufeff" === i) n++; else if (!isZWC(a)) break;
      if (n > r) break;
      s++
    } while (s < t.length);
    return s
  }

  _offsetInParsedText(t, e, r) {
    let s = 0, n = 0;
    for (; s < r;) {
      const r = t[s], a = e[n];
      if (r === a) n++; else if (isWhiteSpace(r) || "\n" === r) " " === a && n++; else if (!isZWC(r)) break;
      s++
    }
    return n
  }

  _getCanvasElements() {
    return this._pageContainer ? Array.from(this._pageContainer.querySelectorAll("canvas.kix-canvas-tile-content")) : []
  }

  _getStrikethroughPoints() {
    const t = [];
    return this._getCanvasElements().forEach((e => {
      const r = GoogleDocs.getStrikethroughs(e);
      if (r.length) {
        const s = (parseFloat(e.style.top) || 0) + (parseFloat(e.style.marginTop) || 0),
          n = (parseFloat(e.style.left) || 0) + (parseFloat(e.style.marginLeft) || 0);
        r.forEach((e => {
          t.push({top: e.top + s, left: e.left + n, bottom: e.bottom + s, right: e.right + n})
        }))
      }
    })), t
  }

  _updateText() {
    const t = [];
    let e = 0, r = 0;
    const s = this._getStrikethroughPoints();
    for (const n of this._paragraphs) {
      const a = n.children[n.children.length - 1];
      let i = null, o = !1, h = !1;
      for (let l = 0; l < n.children.length; l++) {
        const _ = n.children[l], c = _ === a;
        let d = _.text;
        const p = 0 === l;
        if (p && this.BULLET_POINT_REG_EXP.test(d)) {
          h = !0;
          continue
        }
        const g = n.children[l + 1], u = _.font.match(SVGElementWrapper.FONT_STYLE_REGEXP);
        if (!u) continue;
        let [, , E, f] = u;
        const T = Number(E) >= 600, m = function () {
          const s = t[t.length - 1];
          s.rawText += "\n\n", s.parsedText += "\n\n", e += 2, r += 2
        }, x = function () {
          if (g) {
            Math.abs(_.x + _.width - g.x) > .3 && (o = !0)
          }
          if (i = _.x + _.width, c && t.length) m(); else if (t.length && h && T && g && _.x + _.width > g.x) {
            const t = g.font.match(SVGElementWrapper.FONT_STYLE_REGEXP);
            t && Number(t[2]) < 600 && m()
          }
        };
        if (p && g && d.length < 3 && this.FOOTNOTE_NUMBER_REGEXP.test(d) && this.FOOTNOTE_NUMBER_FONT_SIZES.includes(parseInt(f))) {
          x();
          continue
        }
        if (i === _.x && d.length < 3 && this.FOOTNOTE_NUMBER_REGEXP.test(d) && this.FOOTNOTE_NUMBER_FONT_SIZES.includes(parseInt(f))) {
          x();
          continue
        }
        const [N, A, P, R] = _.matrix;
        if (s.length) {
          const t = Math.round(N + (_.x + _.width) * P), e = Math.round(A + (_.y + _.height / 2) * R);
          if (s.some((r => Math.abs(t - r.left) < 2 && Math.abs(e - r.top) < 3))) {
            x();
            continue
          }
        }
        if (!g && null !== i && _.x - i > 100 && d.length < 4 && this.PAGE_NUMBER_REGEXP.test(d)) {
          x();
          continue
        }
        if (o && (o = !1, t.length && !this.PUNCTUATION_REG_EXP.test(d))) {
          t[t.length - 1].rawText.endsWith(" ") || (t[t.length - 1].rawText += " ", t[t.length - 1].parsedText += " ", r++)
        }
        const b = this._getParsedText(d);
        t.push({
          node: _.element,
          parsedText: b,
          rawText: d,
          isTextNode: !0,
          parsedTextOffset: r,
          rawTextOffset: e
        }), e += d.length, r += b.length, x()
      }
    }
    let n = "";
    for (const e of t) n += e.parsedText;
    const a = this._text !== n;
    return this._text = n, this._textChunks = t, a
  }

  _getParsedText(t) {
    let e = removeZWC(t);
    e = normalizeWhiteSpaces(e);
    const r = t.trim();
    return !this.WHITE_SPACE_REG_EXP.test(r) && this.URL_FRAGMENT_REG_EXP.test(e) ? "\ufeff".repeat(e.length) : e
  }

  _getTextOffset(t, e) {
    const r = this._textChunks.find((e => e.node === t));
    return r ? r.parsedTextOffset + this._offsetInParsedText(r.rawText, r.parsedText, e) : -1
  }

  getTextBoxes(t, e) {
    const r = this.getTextRanges(t, e);
    return r.length ? GoogleDocsCanvas.getTextBoundingBoxes(r, this._inputArea) : []
  }

  resetText() {
  }

  replaceText(t, e, r) {
    return Promise.resolve()
  }

  getSelection() {
    const t = this._tweaks.getSelection();
    if (!t || !t.startNode) return null;
    if (!this._inputArea.contains(t.startNode)) return null;
    const e = this._getTextOffset(t.startNode, t.startOffset);
    return {start: e, end: t.isCollapsed || !t.endNode ? e : this._getTextOffset(t.endNode, t.endOffset)}
  }

  setSelection(t) {
  }

  scrollToText(t, e, r = "smooth", s = "nearest", n) {
    if (t < 0) return;
    const a = this.getTextRanges(t, e);
    a.length && a[0].node instanceof Element && (a[0].node.scrollIntoView({
      behavior: r,
      block: s
    }), n && window.setTimeout(n, 500))
  }

  _generateTextItem(t) {
    return "rect" !== t.nodeName ? null : {
      element: t,
      text: t.getAttribute("aria-label") || "",
      font: t.getAttribute("data-font-css") || "",
      x: parseFloat(t.getAttribute("x") || "0"),
      y: parseFloat(t.getAttribute("y") || "0"),
      width: parseFloat(t.getAttribute("width") || "0"),
      height: parseFloat(t.getAttribute("height") || "0"),
      matrix: GoogleDocsCanvas.getMatrixFromSVGElement(t)
    }
  }

  _childAlreadyExists(t, e) {
    return t.some((t => t.x === e.x && t.y === e.y && t.text === e.text && t.font === e.font && t.matrix.join(",") === e.matrix.join(",")))
  }

  _generateParagraphItem(t) {
    const e = [];
    for (const r of Array.from(t.children)) {
      const t = this._generateTextItem(r);
      t && !this._childAlreadyExists(e, t) && e.push(t)
    }
    return e[0] ? {element: t, children: e, x: e[0].matrix[0], y: e[0].matrix[1]} : null
  }

  _addParagraph(t) {
    if (this._paragraphs.some((e => e.element === t))) return;
    const e = this._generateParagraphItem(t);
    if (e) {
      for (let t = 0; t < this._paragraphs.length; t++) {
        const r = this._paragraphs[t];
        if (e.y < r.y) return void this._paragraphs.splice(t, 0, e);
        if (e.y === r.y && e.x < r.x) return void this._paragraphs.splice(t, 0, e)
      }
      this._paragraphs.push(e)
    }
  }

  _removeParagraph(t) {
    const e = this._paragraphs.findIndex((e => e.element === t));
    e > -1 && this._paragraphs.splice(e, 1)
  }

  _removeRect(t) {
    this._paragraphs.find((e => {
      const r = e.children.findIndex((e => e.element === t));
      if (r > -1) return e.children.splice(r, 1), !0
    }))
  }

  _rebuildParagraph(t) {
    this._removeParagraph(t), this._addParagraph(t)
  }

  destroy() {
    super.destroy(), this._inputArea.removeEventListener("dblclick", this._onDblClick), this._inputAreaObserver && this._inputAreaObserver.disconnect()
  }
}

SVGElementWrapper.INPUT_AREA_OBSERVER_CONFIG = {
  subtree: !0,
  childList: !0,
  attributes: !0,
  characterData: !1
}, SVGElementWrapper.FONT_STYLE_REGEXP = /(italic\s+|oblique\s+|normal\s+)?(.+?)\s+(.+?)\s+"(.+)"/;