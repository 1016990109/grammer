/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class DictionarySync {
  static init() {
    this._isInitialized || (this._isInitialized = !0, this._storageController.onReady((() => {
      const {isDictionarySynced: t} = this._storageController.getSettings();
      t ? this.downloadAll() : this.checkForInitialSync()
    })), setInterval((() => this.downloadAll()), config.DICTIONARY_SYNC_INTERVAL))
  }

  static _isSyncCapable() {
    if (!this._storageController.isReady()) return !1;
    const {username: t, password: e, token: n} = this._storageController.getSettings();
    return t && (e || n)
  }

  static disableSync() {
    return this._storageController.updateSettings({isDictionarySynced: !1})
  }

  static checkForInitialSync() {
    const {isDictionarySynced: t, dictionary: e} = this._storageController.getSettings();
    if (t) return;
    if (!this._isSyncCapable()) return;
    Tracker.trackEvent("Action", "dict_sync:started");
    const n = e.slice(0), r = e.length;
    this.addBatch(n).then((() => this.downloadList())).then((t => {
      const e = t.filter((t => n.includes(t))).length, i = e / r;
      i < .9 && r - e >= 10 ? Tracker.trackEvent("Action", "dict_sync:failed_comparison", String(i)) : this._storageController.updateSettings({
        isDictionarySynced: !0,
        dictionary: t
      }).then((() => {
        Tracker.trackEvent("Action", "dict_sync:succeeded")
      })).catch((() => {
        Tracker.trackEvent("Action", "dict_sync:failed_storage")
      }))
    })).catch((() => {
      Tracker.trackEvent("Action", "dict_sync:failed_sync")
    }))
  }

  static addBatch(t) {
    if (this._syncing) return Promise.reject();
    if (!this._isSyncCapable()) return Promise.reject();
    if (t.length > this.MAX_WORDS) return Tracker.trackEvent("Action", "too_many_words_for_dictionary_batch_add", String(t.length)), Promise.reject();
    this._syncing = !0;
    const e = t.slice(0);
    let n = 0;
    return new Promise(((t, r) => {
      const i = () => {
        const o = e.shift();
        if (void 0 === o && !e.length) return this._syncing = !1, void t();
        this._isValidWord(o) ? this.addWord(o).then((() => wait(1400))).then(i).catch((t => ++n > 4 ? (this._syncing = !1, void r(t)) : i())) : i()
      };
      i()
    }))
  }

  static _isValidWord(t) {
    return Boolean(t && t.trim() && !t.trim().match(/\s/) && !t.match(this.EMOJI_REGEXP))
  }

  static removeBatch(t) {
    return this._deleting ? Promise.reject() : this._isSyncCapable() ? (Tracker.trackEvent("Action", "dict_batch_delete:started", String(t.length)), t = t.slice(0, this.MAX_WORDS), this._deleting = !0, new Promise(((e, n) => {
      const r = () => {
        const i = t.shift();
        if (void 0 === i && !t.length) return this._deleting = !1, Tracker.trackEvent("Action", "dict_batch_delete:succeeded"), void e();
        this._isValidWord(i) ? this.removeWord(i).then((() => wait(1500))).then(r).catch((t => {
          this._deleting = !1, Tracker.trackEvent("Action", "dict_batch_delete:failed", t && t.message), n(t)
        })) : r()
      };
      r()
    }))) : Promise.reject()
  }

  static downloadAll() {
    this._deleting || this._storageController.onReady((() => {
      if (!this._isSyncCapable()) return;
      const {isDictionarySynced: t} = this._storageController.getSettings();
      t && this.downloadList().then((t => {
        this._storageController.updateSettings({dictionary: t})
      }))
    }))
  }

  static _getBaseUrl() {
    let t = config.PREMIUM_SERVER_URL;
    return this._storageController.hasCustomServer() && (t = this._storageController.getCustomServerUrl()), t.endsWith("/") ? t + "words" : t + "/words"
  }

  static addWord(t, e = !1) {
    let n = this._getBaseUrl() + "/add";
    const {username: r, token: i, password: o} = this._storageController.getSettings();
    if (r && i) n += `?username=${encodeURIComponent(r)}&tokenV2=${encodeURIComponent(i)}`; else {
      if (!r || !o) return Promise.reject(new Error("Not logged-in for adding words to dictionary"));
      n += `?username=${encodeURIComponent(r)}&password=${encodeURIComponent(o)}`
    }
    return n += `&word=${encodeURIComponent(t.trim())}`, fetch(n, {method: "POST"}).then((t => t.status >= 200 && t.status < 300 ? Promise.resolve() : Promise.reject(new Error(`Status: ${t.status}`)))).catch((n => e ? (Tracker.trackEvent("Action", "dict_sync_add:failed", t), Promise.reject(n)) : wait(5e3).then((() => this.addWord(t, !0)))))
  }

  static removeWord(t, e = !1) {
    let n = this._getBaseUrl() + "/delete";
    const {username: r, token: i, password: o} = this._storageController.getSettings();
    if (r && i) n += `?username=${encodeURIComponent(r)}&tokenV2=${encodeURIComponent(i)}`; else {
      if (!r || !o) return Promise.reject(new Error("Not logged-in for removing words from dictionary"));
      n += `?username=${encodeURIComponent(r)}&password=${encodeURIComponent(o)}`
    }
    return n += `&word=${encodeURIComponent(t.trim())}`, fetch(n, {method: "POST"}).then((t => t.status >= 200 && t.status < 300 ? Promise.resolve() : Promise.reject(new Error(`Status: ${t.status}`)))).catch((n => e ? (Tracker.trackEvent("Action", "dict_sync_remove:failed", t), Promise.reject(n)) : wait(5e3).then((() => this.removeWord(t, !0)))))
  }

  static downloadList() {
    let t = this._getBaseUrl();
    const {username: e, token: n, password: r} = this._storageController.getSettings();
    if (e && n) t += `?username=${encodeURIComponent(e)}&tokenV2=${encodeURIComponent(n)}`; else {
      if (!e || !r) throw new Error("Not logged-in for dictionary sync");
      t += `?username=${encodeURIComponent(e)}&password=${encodeURIComponent(r)}`
    }
    return t += "&limit=2000", fetch(t).then((t => t.json())).then((t => t && t.words ? Promise.resolve(t.words) : Promise.reject(new Error("Empty response while loading dictionary")))).catch((t => (Tracker.trackEvent("Action", "dict_download:failed", t && t.message), Promise.reject(t))))
  }
}

DictionarySync.MAX_WORDS = 1250, DictionarySync._storageController = StorageController.create(), DictionarySync._isInitialized = !1, DictionarySync._syncing = !1, DictionarySync._deleting = !1, DictionarySync.EMOJI_REGEXP = /\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/;