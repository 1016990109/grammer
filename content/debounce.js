/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class Debounce {
  constructor(l, i = 250, t = 0) {
    this.callImmediately = () => {
      this._args && this._wrappedFunc(...this._args), this.cancelCall()
    }, this._wrappedFunc = l, this._delay = i, this._maxDelay = t, this._args = null, this._delayTimeoutId = null, this._maxDelayTimeoutId = null
  }

  call(...l) {
    this.cancelCall(!0), this._args = l, this._delayTimeoutId = window.setTimeout(this.callImmediately, this._delay), this._maxDelay > 0 && null === this._maxDelayTimeoutId && (this._maxDelayTimeoutId = window.setTimeout(this.callImmediately, this._maxDelay))
  }

  cancelCall(l = !1) {
    this._args = null, null !== this._delayTimeoutId && (window.clearTimeout(this._delayTimeoutId), this._delayTimeoutId = null), l || null === this._maxDelayTimeoutId || (window.clearTimeout(this._maxDelayTimeoutId), this._maxDelayTimeoutId = null)
  }
}