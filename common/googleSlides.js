/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
var __awaiter = this && this.__awaiter || function (t, e, n, i) {
  return new (n || (n = Promise))((function (o, r) {
    function s(t) {
      try {
        l(i.next(t))
      } catch (t) {
        r(t)
      }
    }

    function a(t) {
      try {
        l(i.throw(t))
      } catch (t) {
        r(t)
      }
    }

    function l(t) {
      var e;
      t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n((function (t) {
        t(e)
      }))).then(s, a)
    }

    l((i = i.apply(t, e || [])).next())
  }))
};

class GoogleSlides {
  static _getMode() {
    return document.querySelector("#docs-access-level-indicator div.docs-access-level-indicator-icon-container div.docs-icon-acl-comment-only-on-brand-color-background") ? "comment" : document.querySelector("#docs-access-level-indicator") ? "view" : "edit"
  }

  static _isInView(t) {
    const e = t.closest("svg");
    return !!e && "none" !== this._domMeasurement.getStyle(e, "display")
  }

  static _checkMode() {
    const t = this._getMode();
    this._currentMode ? t !== this._currentMode && (this._currentMode = t, this._onModeChangedCallbacks.forEach((e => e(t)))) : this._currentMode = t
  }

  static _checkForNewSlides() {
    document.querySelectorAll(this.UNHANDLED_SLIDE_SELECTOR).forEach((t => {
      this._isInView(t) && this._onNewSlideCallbacks.forEach((e => e(t)))
    }))
  }

  static _checkOutOfViewSlides() {
    this._onSlideOutOfViewCallbacks.forEach(((t, e) => {
      this._isInView(e) || t(e)
    }))
  }

  static _addMenuBarButton() {
    if (this._menuBarButton) return;
    const t = document.querySelector("#insertCommentButton");
    t && t.parentNode && (this._menuBarButton = document.createElement("div"), this._menuBarButton.className = "lt-gdocs-menubar-button goog-toolbar-button goog-toolbar-toggle-button goog-inline-block", this._menuBarButton.setAttribute("role", "button"), this._menuBarButton.setAttribute("aria-disabled", "false"), this._menuBarButton.setAttribute("aria-hidden", "false"), this._menuBarButton.id = "enableLTButton", this._menuBarButton.style.userSelect = "none", this._menuBarButton.addEventListener("click", (() => {
      if (!this._storageController) return;
      const t = this.getPresentationId(location.href);
      t && (this._menuBarButton.classList.contains("goog-toolbar-button-checked") ? (this._storageController.disableEditorGroup(getMainPageDomain(), t), EnvironmentAdapter.ltAssistantStatusChanged({enabled: !1})) : (this._storageController.enableDomainAndEditorGroup(getMainPageDomain(), t), EnvironmentAdapter.ltAssistantStatusChanged({enabled: !0})))
    }), !0), this._menuBarSeparator = document.createElement("div"), this._menuBarSeparator.className = "docs-toolbar-small-separator goog-toolbar-separator goog-inline-block", this._menuBarSeparator.setAttribute("role", "separator"), this._menuBarSeparator.setAttribute("aria-disabled", "true"), this._menuBarSeparator.setAttribute("aria-hidden", "false"), this._menuBarSeparator.id = "enableLTSeparator", this._menuBarSeparator.style.userSelect = "none", t.parentNode.insertBefore(this._menuBarButton, t.nextSibling), t.parentNode.insertBefore(this._menuBarSeparator, t.nextSibling), this._toggleMenuBarButton())
  }

  static _removeMenuBarButton() {
    this._menuBarButton && (this._menuBarButton.remove(), this._menuBarButton = null), this._menuBarSeparator && (this._menuBarSeparator.remove(), this._menuBarSeparator = null)
  }

  static _toggleMenuBarButton(t = !1) {
    if (!this._storageController) return;
    const e = this.getPresentationId(location.href);
    if (!e) return;
    const n = getMainPageDomain(), i = this._storageController.getCheckSettings(n, e);
    i.isEditorGroupDisabled || i.isDomainDisabled ? this._setMenuBarButtonUnactive(t) : this._setMenuBarButtonActive()
  }

  static _setMenuBarButtonActive() {
    this._menuBarButton && (this._menuBarButton.classList.add("goog-toolbar-button-checked"), this._menuBarButton.setAttribute("aria-label", i18nManager.getMessage("googleSlideDisableButton")), this._menuBarButton.setAttribute("data-tooltip", i18nManager.getMessage("googleSlideDisableButton")))
  }

  static _setMenuBarButtonUnactive(t = !1) {
    this._menuBarButton && (this._menuBarButton.classList.remove("goog-toolbar-button-checked"), this._menuBarButton.setAttribute("aria-label", i18nManager.getMessage("googleSlideEnableButton")), this._menuBarButton.setAttribute("data-tooltip", i18nManager.getMessage("googleSlideEnableButton")), t && this._showMenuBarHint())
  }

  static _showMenuBarHint() {
    if (this._menuBarHint || !this._menuBarButton || !this._storageController) return;
    const {hasSeenGoogleDocsMenuBarHint: t} = this._storageController.getUIState();
    if (t) return;
    const e = this._menuBarButton.offsetHeight ? this._menuBarButton : document.querySelector("#moreButton");
    if (!e) return;
    const n = e.getBoundingClientRect();
    this._menuBarHint = document.createElement("div"), this._menuBarHint.classList.add("lt-gdocs-hint"), this._menuBarHint.style.top = n.bottom + "px", this._menuBarHint.style.right = window.innerWidth - n.right + "px", this._menuBarHint.textContent = i18nManager.getMessage("googleSlidesEnableHint");
    const i = document.createElement("span");
    i.classList.add("lt-gdocs-hint__close"), i.addEventListener("click", (t => {
      t.stopImmediatePropagation(), this._removeMenuBarHint(!0)
    }), !0), this._menuBarHint.appendChild(i), document.body.appendChild(this._menuBarHint), this._onInput((() => this._removeMenuBarHint(!0)), !0)
  }

  static _removeMenuBarHint(t = !1) {
    this._menuBarHint && (t ? fadeOutAndRemove(this._menuBarHint) : this._menuBarHint.remove(), this._menuBarHint = null, t && this._storageController && this._storageController.updateUIState({hasSeenGoogleDocsMenuBarHint: !0}))
  }

  static _showTeaser() {
    const t = Array.from(document.querySelectorAll(`.${this.TOOLBAR_CLASS_NAME}`));
    if (!t.length) return;
    const e = t.find((t => {
      const e = t.getBoundingClientRect();
      return e.top >= 0 && e.top < window.innerHeight && e.width > 0
    }));
    if (!e) return;
    const n = new Hint("", "google-slides", i18nManager.getMessage("googleSlidesNewTeaserHeadline"), i18nManager.getMessage("googleSlidesNewTeaserText"), "bottom-left", e),
      i = () => {
        n.getElement().remove(), n && n.getElement().classList.remove("lt-toolbar--hint-opened"), this._storageController && this._storageController.updateUIState({hasSeenNewGoogleSlidesTeaser: !0})
      };
    n.getClose().addEventListener("click", (t => {
      t.stopImmediatePropagation(), t.preventDefault(), i()
    }), !0), e.classList.add("lt-toolbar--hint-opened"), e.addEventListener("mouseup", (t => {
      t.target instanceof HTMLElement && n.getElement().contains(t.target) || i()
    }), {capture: !0, once: !0}), this._onInput((() => i()), !0)
  }

  static _onInput(t, e = !1) {
    const n = this._getIframeWin();
    n && n.document && n.document.addEventListener("keydown", (e => {
      ["Control", "Shift", "Meta", "Alt"].includes(e.key) || t()
    }), {capture: !0, once: e})
  }

  static _getIframeWin() {
    const t = document.querySelector(this.PASTE_IFRAME_SELECTOR);
    return t && t.contentWindow || null
  }

  static _isCursor(t) {
    if (!(t instanceof HTMLElement || t instanceof SVGElement)) return !1;
    const e = parseFloat(t.getAttribute("width") || "");
    return "RECT" === t.tagName.toUpperCase() && 0 === t.childElementCount && "crispEdges" === t.getAttribute("shape-rendering") && e <= 5
  }

  static _getTrailingBoxes(t, e) {
    function n(t, e, i) {
      const o = t.start === t.end, r = t.node.textContent.length || 0, s = 0 !== t.start || t.end !== r;
      return o ? function (t, e, i) {
        var o;
        if (0 === ((null === (o = t.node.textContent) || void 0 === o ? void 0 : o.length) || 0)) return [];
        const r = 0 === t.start, s = 0, a = r ? 1 : t.end,
          l = n({node: t.node, start: s, end: a, text: t.node.textContent || ""}, e, i);
        if (0 === l.length) return [];
        const u = l[r ? 0 : l.length - 1];
        return [{
          top: u.top,
          right: r ? u.left : u.right,
          bottom: u.bottom,
          left: r ? u.left : u.right,
          width: 0,
          height: u.height
        }]
      }(t, e, i) : s ? function (t, e, n) {
        if (!BrowserDetector.isFirefox()) return n.getTextBoundingBoxes(t, e, !1);
        const i = t.node.textContent || "";
        i.length;
        let o = t.node.parentElement;
        if (!(o && o instanceof SVGTextElement)) return [];
        if (!o.parentElement) return [];
        const r = {node: t.node, start: 0, end: i.length, text: i}, s = n.getTextBoundingBoxes(r, e, !1);
        if (0 === s.length) return [];
        let a = document.createElementNS("http://www.w3.org/2000/svg", "text");
        for (let t = 0; t < o.attributes.length; t++) {
          const e = o.attributes[t];
          a.setAttribute(e.name, e.value)
        }
        o.parentElement.appendChild(a);
        let l = 0;
        if (0 !== t.start) {
          a.textContent = i.substring(0, t.start);
          const o = {node: a.firstChild, start: 0, end: t.start, text: i}, r = n.getTextBoundingBoxes(o, e, !1);
          r.length > 0 && (l = r[0].width)
        }
        let u = 0;
        if (t.end !== i.length) {
          a.textContent = i.substring(t.end);
          const o = {node: a.firstChild, start: 0, end: i.length - t.end, text: i},
            r = n.getTextBoundingBoxes(o, e, !1);
          r.length > 0 && (u = r[0].width)
        }
        a.remove();
        const d = s[0];
        return [{
          top: d.top,
          right: d.right - u,
          bottom: d.bottom,
          left: d.left + l,
          width: d.width - l - u,
          height: d.height
        }]
      }(t, e, i) : i.getTextBoundingBoxes(t, e, !1)
    }

    this._domMeasurement.clearCache();
    let i = null, o = null, r = 0;
    do {
      const o = n(t[r], e, this._domMeasurement);
      0 !== o.length && (i = o[0])
    } while (!i && ++r < t.length);
    if (!i) return [null, null];
    r = t.length - 1;
    do {
      const i = n(t[r], e, this._domMeasurement);
      0 !== i.length && (o = i[i.length - 1])
    } while (!o && --r >= 0);
    return [i, o]
  }

  static init() {
    this._storageController = StorageController.create(), this._domMeasurement = new DomMeasurement(document), this._interval = window.setInterval((() => {
      this._checkMode(), this._checkForNewSlides(), this._checkOutOfViewSlides()
    }), 750), this._storageController.addEventListener(StorageControllerClass.eventNames.settingsChanged, (t => {
      (t.disabledEditorGroups || t.disabledDomains) && this._toggleMenuBarButton(!!t.disabledEditorGroups)
    })), this._storageController.onReady((() => {
      this._addMenuBarButton()
    }))
  }

  static destroy() {
    null !== this._interval && (window.clearInterval(this._interval), this._interval = null), this._removeMenuBarButton(), this._removeMenuBarHint(), this._onModeChangedCallbacks.clear(), this._onNewSlideCallbacks = [], this._onSlideOutOfViewCallbacks.clear()
  }

  static isSlide(t) {
    return t.matches(this.SLIDE_SELECTOR)
  }

  static onNewSlide(t) {
    this._onNewSlideCallbacks.push((e => t(e, !1)))
  }

  static onSlideDestroy(t, e) {
    this._onModeChangedCallbacks.set(t, (n => {
      "view" === n && e(t)
    })), this._onSlideOutOfViewCallbacks.set(t, e), onElementRemoved(t, e)
  }

  static isElementCompatible(t) {
    return t.matches(this.SLIDE_SELECTOR)
  }

  static initSlide(t) {
    t.setAttribute("data-lt-tweaks", "slides");
    let e = null;
    e = window.setTimeout((() => {
      if (!this._storageController || !this._storageController.isReady()) return;
      const {hasSeenNewGoogleSlidesTeaser: t} = this._storageController.getUIState();
      t || this._showTeaser()
    }), 800)
  }

  static destroySlide(t) {
    t.removeAttribute("data-lt-tweaks"), this._onModeChangedCallbacks.delete(t), this._onSlideOutOfViewCallbacks.delete(t)
  }

  static createMutationObserver(t) {
    return new FilteringMutationObserver(t, (t => "attributes" === t.type && "class" === t.attributeName && GoogleSlides._isCursor(t.target)))
  }

  static isIgnored(t) {
    return !t.parentElement || "TEXT" === t.tagName.toUpperCase() && !t.parentElement.matches("g.sketchy-text-content-text")
  }

  static isBlock(t, e) {
    return "TEXT" !== t.tagName.toUpperCase() && (!!t.matches(this.BLOCK_SELECTOR) || CEElementInspector.DISPLAY_BLOCK_VALUES.includes(e.display || ""))
  }

  static getReplacementText() {
    return ""
  }

  static replaceText(t, e) {
    const n = e.parentElement;
    if (!n || "TEXT" !== n.tagName.toUpperCase()) return t;
    const i = closestElement(n, this.BLOCK_SELECTOR);
    if (!i) return t;
    const o = Array.from(i.querySelectorAll(this.BLOCK_TEXT_SELECTOR)), r = o.indexOf(n);
    if (-1 === r || r === o.length - 1) return t;
    const s = n.getBoundingClientRect(), a = o[r + 1].getBoundingClientRect(), l = s.top + s.height / 2,
      u = s.left + s.width / 2;
    return a.top >= l || a.left <= u || s.right < a.left ? t + " " : t
  }

  static getCacheInvalidationRules(t) {
    return Object.assign({}, t, {
      isSkippingElement: {
        self: {attributes: [], childList: !0},
        parent: {childList: !0},
        ancestor: {attributes: ["id", "class", "style"]},
        descendant: {attributes: ["id", "class", "style"], characterData: !0, childList: !0},
        sibling: {attributes: ["id"]}
      },
      replacementText: {},
      isBlock: {
        self: {attributes: ["id", "class", "style", "direction"]},
        ancestor: {attributes: ["id", "class", "style"]}
      },
      parsingOptions: {},
      parsedText: {self: {characterData: !0}, ancestor: {attributes: ["id", "class", "style"], childList: !0}},
      blockParent: {self: {attributes: ["id", "class", "style"]}, ancestor: {attributes: ["id", "class", "style"]}},
      paragraphLastValuableNode: {
        self: {attributes: [], characterData: !0, childList: !0},
        parent: {childList: !0},
        ancestor: {attributes: ["id", "class", "style"]},
        sibling: {attributes: ["id"]},
        blockSibling: {attributes: [], characterData: !0, childList: !0}
      },
      isBRElementRelevant: {
        self: {attributes: [], childList: !0},
        parent: {childList: !0},
        ancestor: {attributes: ["id", "class", "style", "direction"]},
        blockDescendant: {attributes: [], characterData: !0, childList: !0},
        sibling: {attributes: ["id"]}
      },
      isParagraphNonEmpty: {
        self: {attributes: [], childList: !0},
        parent: {childList: !0},
        ancestor: {attributes: ["id", "class", "style", "direction"]},
        descendant: {attributes: [], characterData: !0, childList: !0},
        sibling: {attributes: ["id"]}
      }
    })
  }

  static getKeyboardEventTarget() {
    const t = document.querySelector(".docs-texteventtarget-iframe");
    return t ? t.contentWindow : null
  }

  static getTargetElement(t) {
    return t.closest("svg") || t
  }

  static getVisibleBox(t, e) {
    const n = e.getScaleFactor(t);
    let {top: i, left: o, width: r, height: s} = t.getBoundingClientRect();
    return r /= n.x, s /= n.y, {top: i, right: o + r, bottom: i + s, left: o, width: r, height: s}
  }

  static getScrollableElementSize(t, e) {
    const n = e.getScaleFactor(t);
    let {width: i, height: o} = t.getBoundingClientRect();
    return i /= n.x, o /= n.y, {width: i, height: o}
  }

  static getTextBoxes(t, e, n, i) {
    const o = t.getRelativeTextBoundingBoxes(e, n, i);
    for (let t = 0; t < o.length - 1; t++) {
      const e = o[t], n = o[t + 1];
      e.bottom === n.bottom && e.top === n.top && (e.right = n.right, o.splice(t + 1, 1), t--)
    }
    return o
  }

  static getToolbarPosition(t, e) {
    const n = e.getBorderBox(t);
    if (this._workspaceContainer = this._workspaceContainer || document.getElementById("workspace-container"), !this._workspaceContainer) return null;
    const i = e.getBorderBox(this._workspaceContainer), o = i.top + 10, r = Math.round(Math.max(n.top + 30, o));
    if (r + 50 > n.bottom) return null;
    const s = i.left + 32, a = Math.round(Math.max(n.left, s));
    return a + 32 > n.right ? null : {top: r + "px", left: a + "px", fixed: !0}
  }

  static getPresentationId(t) {
    const e = t.match(this.PRESENTATION_ID_REGEXP);
    return e ? e[1] : null
  }

  static getSlideId(t) {
    const e = t.match(this.SLIDE_ID_REGEXP);
    return e ? this.getPresentationId(t) + ":" + e[1] : null
  }

  static getSelectedText() {
    const t = this.getSelection();
    if (!t) return "";
    const e = getCommonParent(t.startNode, t.endNode);
    if (!e) return "";
    const n = [], i = DOMWalker.create(e, t.startNode);
    do {
      if (isTextNode(i.currentNode)) {
        let e = i.currentNode.nodeValue || "";
        if (i.currentNode === t.endNode && (e = e.substring(0, t.endOffset)), i.currentNode === t.startNode && (e = e.substring(t.startOffset)), e) {
          const t = this.replaceText(e, i.currentNode);
          n.push(t)
        }
      }
    } while (i.currentNode !== t.endNode && i.next());
    return n.join("")
  }

  static getSelection() {
    let t = Array.from(document.body.querySelectorAll(this.SELECTION_ELEMENTS_SELECTOR));
    if (t = t.filter((t => {
      const e = t.getBoundingClientRect();
      return e.top > -20 && e.bottom < window.innerHeight + 20
    })), t.length) {
      const e = t[0].getBoundingClientRect(), n = 1 === t.length ? e : t[t.length - 1].getBoundingClientRect(),
        i = Array.from(document.querySelectorAll(this.TEXT_ELEMENTS_SELECTOR));
      this._domMeasurement.setStyles(i, {"pointer-events": "all"}, !0);
      const o = Array.from(document.querySelectorAll(this.IGNORED_ELEMENTS_SELECTOR));
      this._domMeasurement.setStyles(o, {"pointer-events": "none"}, !0);
      let r = getRangeAtPoint({x: e.left + 1, y: Math.round(e.bottom - .3 * e.height)}),
        s = getRangeAtPoint({x: n.right - .5, y: Math.round(n.bottom - .3 * n.height)});
      return this._domMeasurement.removeStyle(i, "pointer-events"), this._domMeasurement.removeStyle(o, "pointer-events"), r && s && (r.startContainer !== s.startContainer || r.startOffset !== s.startOffset || (r = getRangeAtPoint({
        x: e.left,
        y: Math.round(e.top + .3 * e.height)
      }), s = getRangeAtPoint({
        x: n.right,
        y: Math.round(n.top + .3 * n.height)
      }), r && s)) ? {
        startNode: r.startContainer,
        startOffset: r.startOffset,
        endNode: s.endContainer,
        endOffset: s.endOffset,
        isCollapsed: !1
      } : null
    }
    const e = document.body.querySelector(this.CURSOR_ELEMENT_SELECTOR);
    if (e) {
      const t = e.getBoundingClientRect(), n = Array.from(document.querySelectorAll(this.TEXT_ELEMENTS_SELECTOR));
      this._domMeasurement.setStyles(n, {"pointer-events": "all"}, !0);
      const i = Array.from(document.querySelectorAll(this.IGNORED_ELEMENTS_SELECTOR));
      this._domMeasurement.setStyles(i, {"pointer-events": "none"}, !0);
      let o = getRangeAtPoint({x: t.left, y: Math.round(t.bottom - .3 * t.height)});
      if (this._domMeasurement.removeStyle(n, "pointer-events"), this._domMeasurement.removeStyle(i, "pointer-events"), o) return {
        startNode: o.startContainer,
        startOffset: o.startOffset,
        endNode: o.endContainer,
        endOffset: o.endOffset,
        isCollapsed: !1
      }
    }
    return null
  }

  static getReplacedParts(t) {
    const e = [];
    for (const n of this.DEFAULT_TEXTS) {
      const i = new RegExp(`^${n}(\n\n|$)`, "gm"), o = matchAll(t, i);
      for (const t of o) e.push({offset: t.index, length: t[0].length})
    }
    return e
  }

  static filterErrors(t, e) {
    return e.filter((t => "FALSCHES_ANFUEHRUNGSZEICHEN" !== t.rule.id && !t.rule.id.endsWith("UNPAIRED_BRACKETS") && (t.fixes[0] && t.fixes[0].value.replace(this.SPACE_REGEXP, " ") !== t.originalPhrase)))
  }

  static applyFix(t) {
    return __awaiter(this, void 0, void 0, (function* () {
      const {offset: e, length: n, replacementText: i, editor: o} = t, r = o.inputAreaWrapper.getText().substr(e, n),
        s = r.startsWith(" "), a = r.endsWith(" "), l = s || a;
      let u = o.inputAreaWrapper.getTextRanges(e, n, !l);
      if (l && (u = u.filter(((t, e) => t.start !== t.end || s && 0 === e || a && e === u.length - 1))), 0 === u.length || !u[0].node.parentElement) return;
      const d = u[0].node.parentElement.closest(this.EDITOR_SELECTOR);
      if (!d) return;
      let c = d.querySelector("g > path[pointer-events='visiblePainted']:last-child");
      if (!c) return;
      const g = document.querySelector(this.PASTE_IFRAME_SELECTOR);
      if (!g) return;
      const h = g.contentWindow;
      if (!h) return;
      const m = h.document.querySelector("[contenteditable=true]");
      if (!m) return;
      this._domMeasurement.clearCache();
      const [_, E] = this._getTrailingBoxes(u, o.inputArea);
      if (!_ || !E) return;
      const p = {bubbles: !0, clientX: Math.floor(_.left), clientY: Math.round(_.top + _.height / 2)},
        S = {bubbles: !0, clientX: Math.floor(E.right), clientY: Math.round(E.top + E.height / 2)};
      c.dispatchEvent(new MouseEvent("mousedown", p)), c = document.querySelector("g > path[pointer-events='visiblePainted']:last-child") || d, c.dispatchEvent(new MouseEvent("mousemove", S)), c.dispatchEvent(new MouseEvent("mouseup", S));
      const f = h;
      let b;
      try {
        b = new f.ClipboardEvent("paste", {
          clipboardData: new f.DataTransfer,
          bubbles: !0
        }), b.clipboardData.setData("text/plain", i)
      } catch (t) {
        b = new f.ClipboardEvent("paste", {bubbles: !0})
      }
      m.dispatchEvent(b), m.textContent = i
    }))
  }
}

GoogleSlides.SLIDES_URL_REGEXP = /docs\.google\.com\/presentation/, GoogleSlides.SLIDE_SELECTOR = "div#pages > svg > g", GoogleSlides.UNHANDLED_SLIDE_SELECTOR = "div#pages > svg > g:not([data-lt-tweaks])", GoogleSlides.BLOCK_SELECTOR = "g[id^='editor']:not([id*='paragraph']) g[id*='paragraph']", GoogleSlides.BLOCK_TEXT_SELECTOR = "text", GoogleSlides.TEXT_ELEMENTS_SELECTOR = "div#pages svg text", GoogleSlides.SELECTION_ELEMENTS_SELECTOR = "g.sketchy-text-background + g > g > rect", GoogleSlides.IGNORED_ELEMENTS_SELECTOR = ["div#pages > svg path[pointer-events=visiblePainted]", "div#pages > svg g[pointer-events=none] + rect[shape-rendering=crispEdges]", "div#pages > svg g[pointer-events=none] + rect[shape-rendering=crispEdges] + rect"].join(", "), GoogleSlides.CURSOR_ELEMENT_SELECTOR = "rect.docs-text-ui-cursor-blink", GoogleSlides.EDITOR_SELECTOR = "g[id^='editor']:not([id*='paragraph']) g[direction]", GoogleSlides.PASTE_IFRAME_SELECTOR = "iframe.docs-texteventtarget-iframe", GoogleSlides.TOOLBAR_CLASS_NAME = "lt-slides-toolbar", GoogleSlides.PRESENTATION_ID_REGEXP = /presentation\/d\/([^\/]+)/i, GoogleSlides.SLIDE_ID_REGEXP = /presentation\/d\/.+slide=([\.a-z0-9\_]+)/i, GoogleSlides.SPACE_REGEXP = /[\u00A0\u2009\u202F]/g, GoogleSlides.DEFAULT_TEXTS = ["Click to add title", "Click to add text", "Click to add subtitle", "Klicken und Titel hinzufügen", "Klicken und Text hinzufügen", "Klicken und Untertitel hinzufügen", "Haz clic para añadir un título", "Haz clic para añadir un texto", "Haz clic para añadir un subtítulo", "Clique para adicionar um título", "Clique para adicionar texto", "Clique para adicionar um subtítulo", "Clique para adicionar um título", "Clique para adicionar texto", "Clique para adicionar uma legenda", "Fai clic per aggiungere un titolo", "Fai clic per aggiungere testo", "Fai clic per aggiungere un sottotitolo", "Klik om een titel toe te voegen", "Klik om tekst toe te voegen", "Klik om een ondertitel toe te voegen", "Cliquez ici pour ajouter un titre", "Cliquez ici pour ajouter du texte", "Cliquez ici pour ajouter un sous-titre", "Введите заголовок", "Введите текст", "Введите подзаголовок", "Kliknij, aby dodać tytuł", "Kliknij, aby dodać tekst", "Kliknij, aby dodać podtytuł", "Натисніть, щоб додати заголовок", "Натисніть, щоб додати текст", "Натисніть, щоб додати підзаголовок"], GoogleSlides._storageController = null, GoogleSlides._interval = null, GoogleSlides._currentMode = null, GoogleSlides._onModeChangedCallbacks = new Map, GoogleSlides._onNewSlideCallbacks = [], GoogleSlides._onSlideOutOfViewCallbacks = new Map, GoogleSlides._menuBarButton = null, GoogleSlides._menuBarSeparator = null, GoogleSlides._menuBarHint = null, "undefined" != typeof module && (module.exports = GoogleSlides);