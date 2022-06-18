/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class DOMWalker {
  static create(e, r = e) {
    return e === r ? new DOMWalker.TreeWalkerWrapper(e) : new DOMWalker.CustomWalker(e, r)
  }
}

DOMWalker.TreeWalkerWrapper = class extends DOMWalker {
  constructor(e) {
    super(), this._treeWalker = document.createTreeWalker(e), this._currentNode = e
  }

  get currentNode() {
    return this._currentNode
  }

  next(e = !1) {
    if (e) {
      for (; !this._treeWalker.nextSibling();) if (!this._treeWalker.parentNode()) return null;
      this._currentNode = this._treeWalker.currentNode
    } else try {
      const e = this._treeWalker.nextNode();
      if (!e) return null;
      this._currentNode = e
    } catch (e) {
      return null
    }
    return this._currentNode
  }
}, DOMWalker.CustomWalker = class extends DOMWalker {
  constructor(e, r) {
    super(), this._rootNode = e, this._currentNode = r
  }

  get currentNode() {
    return this._currentNode
  }

  next(e = !1) {
    if (!e && this._currentNode.firstChild) this._currentNode = this._currentNode.firstChild; else {
      if (this._currentNode === this._rootNode) return null;
      if (this._currentNode.nextSibling) this._currentNode = this._currentNode.nextSibling; else {
        let e = this._currentNode;
        for (; !e.nextSibling;) {
          if (!e.parentNode || e.parentNode === this._rootNode) return null;
          e = e.parentNode
        }
        this._currentNode = e.nextSibling
      }
    }
    return this._currentNode
  }
}, window.__ltThunderbirdHack = 1;