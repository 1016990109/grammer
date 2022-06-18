/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class CEElementInspector {
  constructor(e, t, i) {
    if (this._ceElement = e, this._parsingDetector = t, this._cacheInvalidationRules = i || {}, this._enableCache = !!i, this._enableCache) {
      this._nodePropertiesCache = {
        isTextNode: {propertyName: "isTextNode", map: new WeakMap},
        isElementNode: {propertyName: "isElementNode", map: new WeakMap},
        computedStyle: {propertyName: "computedStyle", map: new WeakMap},
        isSkippingElement: {propertyName: "isSkippingElement", map: new WeakMap},
        replacementText: {propertyName: "replacementText", map: new WeakMap},
        isBr: {propertyName: "isBr", map: new WeakMap},
        isBlock: {propertyName: "isBlock", map: new WeakMap},
        parsingOptions: {propertyName: "parsingOptions", map: new WeakMap},
        parsedText: {propertyName: "parsedText", map: new WeakMap},
        blockParent: {propertyName: "blockParent", map: new WeakMap},
        paragraphLastValuableNode: {propertyName: "paragraphLastValuableNode", map: new WeakMap},
        isBRElementRelevant: {propertyName: "isBRElementRelevant", map: new WeakMap},
        isBlockElementRelevant: {propertyName: "isBlockElementRelevant", map: new WeakMap},
        isTextEndsWithLineBreak: {propertyName: "isTextEndsWithLineBreak", map: new WeakMap},
        isParagraphNonEmpty: {propertyName: "isParagraphNonEmpty", map: new WeakMap}
      }, this.isTextNode = this.createCachedMethod(this.isTextNode, "isTextNode"), this.isElementNode = this.createCachedMethod(this.isElementNode, "isElementNode"), this.getComputedStyle = this.createCachedMethod(this.getComputedStyle, "computedStyle"), this.isSkippingElement = this.createCachedMethod(this.isSkippingElement, "isSkippingElement"), this.getReplacementText = this.createCachedMethod(this.getReplacementText, "replacementText"), this.isBr = this.createCachedMethod(this.isBr, "isBr"), this.isBlock = this.createCachedMethod(this.isBlock, "isBlock"), this.getParsingOptions = this.createCachedMethod(this.getParsingOptions, "parsingOptions"), this.getParsedText = this.createCachedMethod(this.getParsedText, "parsedText"), this.getBlockParent = this.createCachedMethod(this.getBlockParent, "blockParent"), this.getParagraphLastValuableNode = this.createCachedMethod(this.getParagraphLastValuableNode, "paragraphLastValuableNode"), this.isBRElementRelevant = this.createCachedMethod(this.isBRElementRelevant, "isBRElementRelevant"), this.isBlockElementRelevant = this.createCachedMethod(this.isBlockElementRelevant, "isBlockElementRelevant"), this.isTextEndsWithLineBreak = this.createCachedMethod(this.isTextEndsWithLineBreak, "isTextEndsWithLineBreak"), this.isParagraphNonEmpty = this.createCachedMethod(this.isParagraphNonEmpty, "isParagraphNonEmpty"), this._onCEElementChange = this._onCEElementChange.bind(this), this._ceElementObserver = this._parsingDetector.createMutationObserver(this._onCEElementChange);
      const e = {
        attributes: !0,
        attributeOldValue: !0,
        characterData: !0,
        characterDataOldValue: !1,
        childList: !0,
        subtree: !0
      };
      this._ceElementObserver.observe(this._ceElement, e)
    }
  }

  static _replaceLineBreaks(e) {
    return e.replace(CEElementInspector.LINE_BREAKS_REGEXP, " ")
  }

  static _joinWhitespaces(e) {
    return e.replace(CEElementInspector.WHITESPACE_REGEXP, " ")
  }

  static _isBlankString(e) {
    return !e.trim()
  }

  createCachedMethod(e, t) {
    const i = this._nodePropertiesCache[t];
    return t => {
      let s = i.map.get(t);
      return void 0 === s && (s = e.call(this, t), i.map.set(t, s)), s
    }
  }

  _deleteCacheForNode(e) {
    const t = Object.values(this._nodePropertiesCache);
    if (t.forEach((t => t.map.delete(e))), !this.isTextNode(e)) {
      const i = DOMWalker.create(e);
      for (; i.next();) t.forEach((e => e.map.delete(i.currentNode)))
    }
  }

  _normalizeMutations(e) {
    const t = {};
    e.forEach((e => {
      "attributes" === e.type && e.attributeName && (t[e.attributeName] = t[e.attributeName] || [], t[e.attributeName].push(e))
    }));
    for (const i in t) if (t.hasOwnProperty(i)) {
      const s = t[i];
      if (s.length < 2) continue;
      const n = s[0];
      n.oldValue === n.target.getAttribute(i) && s.forEach((t => {
        e.splice(e.indexOf(t), 1)
      }))
    }
  }

  _checkRuleConditions(e, t) {
    if (!e) return !1;
    switch (t.type) {
      case"attributes":
        return !!e.attributes && (0 === e.attributes.length || e.attributes.includes(t.attributeName));
      case"characterData":
        return !!e.characterData;
      case"childList":
        return !!e.childList
    }
    return !1
  }

  _onCEElementChange(e) {
    this._normalizeMutations(e);
    for (const t of e) {
      const e = t.target;
      if (!this._ceElement.contains(e)) {
        this._deleteCacheForNode(e);
        continue
      }
      "childList" === t.type && t.removedNodes.forEach((e => this._deleteCacheForNode(e)));
      const i = this.getBlockParent(e);
      for (const [s, n] of Object.entries(this._cacheInvalidationRules)) {
        const r = this._nodePropertiesCache[s];
        if (this._checkRuleConditions(n.any, t)) r.map = new WeakMap; else {
          if (this._checkRuleConditions(n.self, t) && r.map.delete(e), this._checkRuleConditions(n.parent, t)) for (let t = 0; t < e.childNodes.length; t++) r.map.delete(e.childNodes[t]);
          if (this._checkRuleConditions(n.ancestor, t)) {
            const t = DOMWalker.create(e);
            for (; t.next();) r.map.delete(t.currentNode)
          }
          if (this._checkRuleConditions(n.descendant, t)) {
            let t = e.parentElement;
            for (; t && t !== this._ceElement;) r.map.delete(t), t = t.parentElement
          }
          if (this._checkRuleConditions(n.sibling, t)) {
            const t = e.parentElement;
            if (t) for (let e = 0; e < t.childNodes.length; e++) r.map.delete(t.childNodes[e])
          }
          if (this._checkRuleConditions(n.blockSibling, t)) {
            const e = DOMWalker.create(i);
            for (; e.next();) r.map.delete(e.currentNode)
          }
        }
      }
    }
  }

  isWhiteSpace(e) {
    return this._parsingDetector.isWhiteSpace(e)
  }

  isTextNode(e) {
    return isTextNode(e)
  }

  isElementNode(e) {
    return isElementNode(e)
  }

  getComputedStyle(e) {
    return window.getComputedStyle(e)
  }

  isSkippingElement(e) {
    return this._ceElement !== e && (this._parsingDetector.isIgnored(e, this.getComputedStyle(e)) || this._parsingDetector.isSignature(e) || this._parsingDetector.isQuote(e))
  }

  getReplacementText(e) {
    const t = this.getComputedStyle(e), i = this._parsingDetector.isIgnored(e, t);
    return this._parsingDetector.getReplacementText(e, i, t)
  }

  isBr(e) {
    return "BR" === e.tagName
  }

  isBlock(e) {
    return this._parsingDetector.isBlock(e, this.getComputedStyle(e))
  }

  getParsingOptions(e) {
    const t = this.isElementNode(e) ? e : e.parentNode;
    if (this._parsingDetector.getParsingOptions) return this._parsingDetector.getParsingOptions(t);
    const i = this.getComputedStyle(t).whiteSpace || "";
    return {
      element: t,
      preserveLineBreaks: CEElementInspector.PRESERVE_LINEBREAKS_VALUES.includes(i),
      preserveWhitespaces: CEElementInspector.PRESERVE_WHITESPACES_VALUES.includes(i)
    }
  }

  getParsedText(e) {
    const t = this.getParsingOptions(e);
    let i = e.nodeValue;
    return t.preserveLineBreaks || (i = CEElementInspector._replaceLineBreaks(i)), i = this._parsingDetector.replaceText(i, e, t.element), t.preserveWhitespaces || (i = CEElementInspector._joinWhitespaces(i)), i
  }

  getBlockParent(e) {
    let t = this.isElementNode(e) ? e : e.parentElement;
    for (; t !== this._ceElement && !this.isBlock(t);) t = t.parentElement;
    return t
  }

  getParagraphLastValuableNode(e) {
    const t = this.getBlockParent(e), i = DOMWalker.create(t, e);
    let s = !1, n = null;
    do {
      const e = i.currentNode;
      if (s = !1, this.isElementNode(e)) if (this.getReplacementText(e) && (n = e), this.isSkippingElement(e)) s = !0; else {
        if (this.isBlock(e)) return n;
        if (this.isBr(e)) return n
      } else if (this.isTextNode(e)) {
        const t = this.getParsingOptions(e), i = this.getParsedText(e);
        (t.preserveWhitespaces && i || !CEElementInspector.BLANK_STRING_REGEXP.test(i)) && (n = e)
      }
    } while (i.next(s));
    return n
  }

  isBRElementRelevant(e) {
    const t = this.getBlockParent(e);
    let i = DOMWalker.create(t), s = !1, n = !1;
    for (; i.next(s);) {
      const t = i.currentNode;
      if (s = !1, this.isElementNode(t)) {
        if (t === e) break;
        this.getReplacementText(t) && (n = !0), this.isSkippingElement(t) ? s = !0 : this.isBlock(t) && (n = !1, s = !0)
      } else if (this.isTextNode(t)) {
        const e = this.getParsingOptions(t), i = this.getParsedText(t);
        (e.preserveWhitespaces && i || !CEElementInspector._isBlankString(i)) && (n = !0)
      }
    }
    for (i = DOMWalker.create(t, e), s = !1; i.next(s);) {
      const e = i.currentNode;
      if (s = !1, this.isElementNode(e)) {
        if (this.getReplacementText(e)) return !0;
        if (this.isSkippingElement(e)) s = !0; else {
          if (this.isBr(e)) return !0;
          if (n && this.isBlock(e)) return !1
        }
      } else if (this.isTextNode(e)) {
        const t = this.getParsingOptions(e), i = this.getParsedText(e);
        if (t.preserveWhitespaces && i || !CEElementInspector._isBlankString(i)) return !0
      }
    }
    return !n
  }

  isBlockElementRelevant(e) {
    return !!this._parsingDetector.isBlockElementRelevant && this._parsingDetector.isBlockElementRelevant(e)
  }

  isTextEndsWithLineBreak(e) {
    const t = DOMWalker.create(this._ceElement, e);
    let i = !!isElementNode(e) && this.isSkippingElement(e), s = !1;
    for (; t.next(i);) {
      const n = t.currentNode;
      if (i = !1, this.isElementNode(n)) {
        if (this.getReplacementText(n)) {
          const t = this.getBlockParent(e);
          return !contains(t, n)
        }
        if (this.isSkippingElement(n)) i = !0; else if (this.isBlock(n)) {
          if (this.isParagraphNonEmpty(n)) return !0;
          s = !0
        }
      } else if (this.isTextNode(n)) {
        const t = this.getParsingOptions(n), i = this.getParsedText(n);
        if (t.preserveWhitespaces && i || !CEElementInspector._isBlankString(i)) {
          if (s) return !0;
          {
            const t = this.getBlockParent(e);
            return !contains(t, n)
          }
        }
      }
    }
    return !1
  }

  isParagraphNonEmpty(e) {
    const t = DOMWalker.create(e);
    let i = !1;
    for (; t.next(i);) {
      const e = t.currentNode;
      if (i = !1, this.isElementNode(e)) {
        if (this.getReplacementText(e)) return !0;
        if (this.isSkippingElement(e)) i = !0; else if (this.isBlock(e)) return !1
      } else if (this.isTextNode(e)) {
        const t = this.getParsingOptions(e), i = this.getParsedText(e);
        if (t.preserveWhitespaces && i || !CEElementInspector._isBlankString(i)) return !0
      }
    }
    return !1
  }

  destroy() {
    this._ceElementObserver && this._ceElementObserver.disconnect()
  }
}

CEElementInspector.DISPLAY_BLOCK_VALUES = ["block", "list-item", "table", "table-caption", "table-row", "table-cell", "flex", "grid"], CEElementInspector.SKIPPING_TAGS = ["CODE", "NOSCRIPT", "OBJECT", "SCRIPT", "STYLE", "TEMPLATE", "VAR", "CANVAS", "IMG", "SVG", "SELECT"], CEElementInspector.PRESERVE_LINEBREAKS_VALUES = ["pre", "pre-wrap", "pre-line"], CEElementInspector.PRESERVE_WHITESPACES_VALUES = ["pre", "pre-wrap"], CEElementInspector.LINE_BREAKS_REGEXP = /\n/g, CEElementInspector.WHITESPACE_REGEXP = /  +/g, CEElementInspector.BLANK_STRING_REGEXP = /^[ \uFEFF]*$/, CEElementInspector.SUP_REGEXP = /^[\[\(]?\d+[\]\)]?/;