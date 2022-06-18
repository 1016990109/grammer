class GoogleDocsCanvas {
  static isElementCompatible(t) {
    return isGoogleDocsCanvas(t)
  }

  static getUnhandledPages() {
    const t = document.querySelectorAll(".kix-page-paginated");
    return Array.from(t, (t => {
      let e = Array.from(t.querySelectorAll(".kix-canvas-tile-content:not(.kix-canvas-tile-selection):not([data-lt-tweaks])"));
      return e = e.filter((t => !!t.querySelector("svg") && !t.querySelector("clipPath, image"))), e[e.length - 1]
    })).filter(Boolean)
  }

  static isPage(t) {
    return t.classList.contains(this.PAGE_CLASS_NAME)
  }

  static initPage(t) {
  }

  static destroyPage(t) {
  }

  static hasPreviousPage(t) {
    return !t.closest(".canvas-first-page")
  }

  static getNextPage(t) {
    let e = t.nextElementSibling;
    for (; e;) {
      if (this.isPage(e)) return e;
      e = e.nextElementSibling
    }
    return null
  }

  static getCanvases(t) {
    const e = t.closest(".kix-page-paginated");
    return e ? Array.from(e.querySelectorAll("canvas.kix-canvas-tile-content")) : []
  }

  static getPageContainer(t) {
    return t.closest(this.PAGE_CONTAINER_SELECTOR)
  }

  static triggerRedraw() {
    try {
      const t = new Event("visibilitychange");
      document.dispatchEvent(t);
      const e = new Event("webkitvisibilitychange");
      document.dispatchEvent(e)
    } catch (t) {
    }
  }

  static isMutationIgnored(t, e) {
    return !1
  }

  static isIgnoredElement(t) {
    return !1
  }

  static isBlockElement(t, e) {
    return !1
  }

  static replaceText(t, e, o) {
    return t
  }

  static getReplacementText(t) {
    return ""
  }

  static _lockMousemove() {
    this._mousemoveCapture || (this._mousemoveCapture = addUseCaptureEvent(document, "mousemove", (t => t.stopImmediatePropagation())))
  }

  static _unlockMousemove() {
    this._mousemoveCapture && (this._mousemoveCapture.destroy(), this._mousemoveCapture = null)
  }

  static applyFix(t) {
    const {offset: e, length: o, replacementText: s, editor: n} = t, r = n.inputAreaWrapper.getTextRanges(e, o),
      i = document.querySelector(".kix-appview-editor");
    if (!i) return Tracker.trackError("other", "google_docs:apply_fix1"), Promise.reject();
    const a = GoogleDocs.getIframeWin();
    if (!a) return Tracker.trackError("other", "google_docs:apply_fix3"), Promise.reject();
    const c = a.document.querySelector("[contenteditable=true]");
    if (!c) return Tracker.trackError("other", "google_docs:apply_fix4"), Promise.reject();
    const l = new DomMeasurement(document).getBorderBox(i, !1);
    let {firstTextBox: u, lastTextBox: h} = this._updateTextBoxes(n.inputArea, r), d = 0;
    u.top < l.top ? (i.scrollTop -= l.top - (u.top - 35), d = 50) : h.bottom > l.bottom && (i.scrollTop += h.bottom + 35 - l.bottom, d = 50), u.left < l.left ? (i.scrollLeft -= l.left - (u.left - 35), d = 50) : h.right > l.right && (i.scrollLeft += h.right + 35 - l.right, d = 50);
    const g = this._updateTextBoxes(n.inputArea, r);
    u = g.firstTextBox, h = g.lastTextBox;
    const m = r[0].node.parentElement;
    if (!m) return Tracker.trackError("other", "google_docs:apply_fix5"), Promise.reject();
    const p = r[r.length - 1].node.parentElement;
    if (!p) return Tracker.trackError("other", "google_docs:apply_fix6"), Promise.reject();
    this._lockMousemove();
    const E = {
      clientX: Math.round(u.left + 2),
      clientY: Math.round(u.top + u.height / 2),
      bubbles: !0,
      shftKey: !1,
      detail: GoogleDocs.MOUSE_EVENT_DETAIL
    };
    return wait(d).then((() => {
      if (!m.closest("[data-section-type=header], [data-section-type=footer]")) return wait(0);
      const t = {
        clientX: Math.round(u.left + Math.max(6, u.width / 2)),
        clientY: Math.round(u.top + u.height / 2),
        bubbles: !0,
        shftKey: !1,
        detail: GoogleDocs.MOUSE_EVENT_DETAIL
      };
      return m.dispatchEvent(new MouseEvent("mousedown", Object.assign({}, t))), m.dispatchEvent(new MouseEvent("mouseup", Object.assign({}, t))), m.dispatchEvent(new MouseEvent("mouseclick", Object.assign({}, t))), m.dispatchEvent(new MouseEvent("mousedown", Object.assign({}, t))), m.dispatchEvent(new MouseEvent("mouseup", Object.assign({}, t))), m.dispatchEvent(new MouseEvent("mouseclick", Object.assign({}, t))), wait(0)
    })).then((() => (m.dispatchEvent(new MouseEvent("mousedown", Object.assign({}, E))), wait(0)))).then((() => (m.dispatchEvent(new MouseEvent("mouseup", Object.assign({}, E))), m.dispatchEvent(new MouseEvent("click", Object.assign({}, E))), wait(20)))).then((() => (this._unlockMousemove(), this._selectFromLeftToRight(c, a, m, u, p, h).catch((() => this._selectFromRightToLeft(c, a, m, u, p, h)))))).then((() => {
      const t = s.replace(/^\s/, " ").replace(/\s$/, " ");
      let e;
      try {
        e = new a.ClipboardEvent("paste", {
          clipboardData: new a.DataTransfer,
          bubbles: !0
        }), e.clipboardData.setData("text/plain", t)
      } catch (t) {
        e = new a.ClipboardEvent("paste", {bubbles: !0})
      }
      return c.dispatchEvent(e), c.textContent = t, Promise.resolve()
    })).catch((() => {
      Tracker.trackError("other", "google_docs:apply_fix7")
    })).finally((() => this._unlockMousemove()))
  }

  static _selectFromLeftToRight(t, e, o, s, n, r) {
    let i = {
      clientX: Math.round(s.left),
      clientY: Math.round(s.top + s.height / 2),
      bubbles: !0,
      shftKey: !1,
      detail: GoogleDocs.MOUSE_EVENT_DETAIL
    }, a = {
      clientX: Math.round(r.right),
      clientY: Math.round(r.top + r.height / 2),
      bubbles: !0,
      shftKey: !0,
      detail: GoogleDocs.MOUSE_EVENT_DETAIL
    };
    const c = {shiftKey: !0, key: "Shift", code: "ShiftLeft", keyCode: 16, charCode: 0, which: 16, location: 1};
    return o.dispatchEvent(new MouseEvent("mousemove", i)), wait(50).then((() => this._hasResizeOrMoveCursor(o) ? Promise.reject() : (o.dispatchEvent(new MouseEvent("mousedown", i)), n.dispatchEvent(new MouseEvent("mousemove", a)), t.dispatchEvent(new e.KeyboardEvent("keydown", c)), n.dispatchEvent(new MouseEvent("mouseup", a)), t.dispatchEvent(new e.KeyboardEvent("keyup", c)), Promise.resolve())))
  }

  static _selectFromRightToLeft(t, e, o, s, n, r) {
    const i = {
      clientX: Math.round(r.right),
      clientY: Math.round(r.top + r.height / 2),
      bubbles: !0,
      shftKey: !1,
      detail: GoogleDocs.MOUSE_EVENT_DETAIL
    }, a = {
      clientX: Math.round(s.left),
      clientY: Math.round(s.top + s.height / 2),
      bubbles: !0,
      shftKey: !0,
      detail: GoogleDocs.MOUSE_EVENT_DETAIL
    };
    return n.dispatchEvent(new MouseEvent("mousemove", i)), wait(50).then((() => {
      if (this._hasResizeOrMoveCursor(n)) return Promise.reject();
      const s = {shiftKey: !0, key: "Shift", code: "ShiftLeft", keyCode: 16, charCode: 0, which: 16, location: 1};
      return n.dispatchEvent(new MouseEvent("mousedown", i)), o.dispatchEvent(new MouseEvent("mousemove", a)), t.dispatchEvent(new e.KeyboardEvent("keydown", s)), o.dispatchEvent(new MouseEvent("mouseup", a)), t.dispatchEvent(new e.KeyboardEvent("keyup", s)), Promise.resolve()
    }))
  }

  static _hasResizeOrMoveCursor(t) {
    const e = window.getComputedStyle(t).cursor;
    return Boolean(e && (e.includes("resize") || e.includes("move")))
  }

  static getTextWidth(t, e) {
    const o = this._getCanvasRenderingContextForMeasurement();
    return o.font = e, o.measureText(t).width
  }

  static getRelativeTextBoundingBoxes(t, e) {
    Array.isArray(t) || (t = [t]);
    const o = [];
    return t.forEach((t => {
      const e = t.node, s = t.text, n = s.substring(0, t.start), r = s.substring(t.start, t.end);
      if (!r) return;
      const i = e.getAttribute("data-font-css") || "", a = this.getTextWidth(n, i),
        c = this.getTextWidth(r, i), [l, u, h, d] = this.getMatrixFromSVGElement(e), g = c * h;
      if (g < DomMeasurement.MIN_TEXT_BOX_WIDTH) return;
      const m = parseFloat(e.getAttribute("height") || "0") * d, p = l + parseFloat(e.getAttribute("x") || "0") * h,
        E = u + parseFloat(e.getAttribute("y") || "0") * d, v = Math.round(p + a * h), f = Math.round(E),
        x = Math.round(p + (a + c) * h), _ = Math.round(E + m);
      o.push({width: g, height: m, left: v, top: f, right: x, bottom: _})
    })), o
  }

  static getTextBoundingBoxes(t, e) {
    const o = this.getRelativeTextBoundingBoxes(t, e), s = e.getBoundingClientRect();
    return o.forEach((t => {
      t.top += s.top, t.bottom += s.top, t.left += s.left, t.right += s.left
    })), o
  }

  static _getCanvasRenderingContextForMeasurement() {
    return this._canvasRenderingContextForMeasurement || (this._canvasForMeasurement = document.createElement("canvas"), this._canvasForMeasurement.style.cssText = "position: absolute !important; left: -99999px !important; top: 0 !important; visibility: hidden !important;", document.body.appendChild(this._canvasForMeasurement), this._canvasRenderingContextForMeasurement = this._canvasForMeasurement.getContext("2d")), this._canvasRenderingContextForMeasurement
  }

  static getMatrixFromSVGElement(t) {
    const e = (t.getAttribute("transform") || "").match(this.MATRIX_REG_EXP);
    let o = 0, s = 0, n = 1, r = 1;
    return e && (o = parseFloat(e[5]), s = parseFloat(e[6]), n = parseFloat(e[1]), r = parseFloat(e[4])), [o, s, n, r]
  }

  static _updateTextBoxes(t, e) {
    const o = this.getTextBoundingBoxes(e, t);
    return {textBoxes: o, firstTextBox: o[0], lastTextBox: o[o.length - 1]}
  }

  static _getElementAtPoint(t, e, o, s, n = !1) {
    t.classList.add("lt-gdocs-make-rect-visible");
    let r = document.elementFromPoint(e + (n ? -1 : 1), o + .3 * s);
    return r && "rect" !== r.nodeName && (r = document.elementFromPoint(e + (n ? -1 : 1), o + .7 * s)), t.classList.remove("lt-gdocs-make-rect-visible"), r && "rect" === r.nodeName ? r : null
  }

  static _getOffsetInText(t, e) {
    const [o, , s] = this.getMatrixFromSVGElement(t), n = parseFloat(t.getAttribute("x") || "0") * s + o,
      r = t.getAttribute("aria-label") || "", i = t.getAttribute("data-font-css") || "";
    for (let t = 0; t <= r.length; t++) {
      if ((this.getTextWidth(r.substring(0, t), i) + .5) * s + n >= e) return t
    }
    return null
  }

  static _getSelectionOffset(t, e, o = !1) {
    const s = t.getBoundingClientRect(), [n, r, i, a] = this.getMatrixFromSVGElement(e),
      c = parseFloat(e.getAttribute("height") || "0") * a, l = parseFloat(e.getAttribute("width") || "0") * i,
      u = parseFloat(e.getAttribute("x") || "0") * i + n + (o ? l : 0), h = s.left + u,
      d = parseFloat(e.getAttribute("y") || "0") * a + r, g = s.top + d, m = this._getElementAtPoint(t, h, g, c, o);
    if (null === m) return null;
    const p = this._getOffsetInText(m, u);
    return null === p ? null : {node: m, offset: p}
  }

  static getSelectionRects(t) {
    const e = this.getPageContainer(t);
    return e ? Array.from(e.querySelectorAll(this.SELECTION_RECT_SELECTOR)) : []
  }

  static getSelection(t) {
    const e = this.getSelectionRects(t);
    if (e.length) {
      const o = this._getSelectionOffset(t, e[0]), s = this._getSelectionOffset(t, e[e.length - 1], !0);
      if (!o || !s) return;
      return {startNode: o.node, startOffset: o.offset, endNode: s.node, endOffset: s.offset, isCollapsed: !1}
    }
    const o = document.querySelector("div#kix-current-user-cursor-caret");
    if (o) {
      const e = o.getBoundingClientRect(), s = this._getElementAtPoint(t, e.x, e.y, e.height);
      if (null === s) return null;
      const n = t.getBoundingClientRect(), r = e.x - n.x, i = this._getOffsetInText(s, r);
      return null === i ? null : {startNode: s, startOffset: i, endNode: s, endOffset: i, isCollapsed: !0}
    }
  }

  static getSelectedText() {
    const t = GoogleDocs.getIframeWin();
    if (!t) return;
    const e = new t.CustomEvent("copy", {bubbles: !0}), o = t.document.querySelector("[contenteditable=true]");
    return o ? (o.dispatchEvent(e), o.innerText) : void 0
  }

  static destroy() {
    var t;
    null === (t = this._canvasForMeasurement) || void 0 === t || t.remove(), this._canvasForMeasurement = null
  }
}

GoogleDocsCanvas.PAGE_CLASS_NAME = "kix-canvas-tile-content", GoogleDocsCanvas.PAGE_CONTAINER_SELECTOR = ".kix-page-paginated", GoogleDocsCanvas.SELECTION_RECT_SELECTOR = ".kix-canvas-tile-selection svg > rect, .kix-canvas-tile-selection svg > g > rect", GoogleDocsCanvas.MATRIX_REG_EXP = /matrix\(([\-0-9\.]+),\s*([\-0-9\.]+),\s*([\-0-9\.]+),\s*([\-0-9\.]+),\s*([\-0-9\.]+),\s*([\-0-9\.]+)\)/, GoogleDocsCanvas._canvasForMeasurement = null, GoogleDocsCanvas._mousemoveCapture = null, "undefined" != typeof module && (module.exports = GoogleDocsCanvas);