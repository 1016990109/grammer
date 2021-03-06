/*! (C) Copyright 2021 LanguageTooler GmbH. All rights reserved. */
class FilteringMutationObserver {
  constructor(e, t) {
    this._onMutations = this._onMutations.bind(this), this._callback = e, this._isIgnored = t, this._wrappedObserver = new MutationObserver(this._onMutations)
  }

  _onMutations(e) {
    const t = e.filter((e => !this._isIgnored(e)));
    t.length > 0 && this._callback(t, this)
  }

  observe(e, t = {}) {
    this._wrappedObserver.observe(e, t)
  }

  disconnect() {
    this._wrappedObserver.disconnect()
  }

  takeRecords() {
    return this._wrappedObserver.takeRecords()
  }
}

"undefined" != typeof module && (module.exports.FilteringMutationObserver = FilteringMutationObserver);