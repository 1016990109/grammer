/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class Synonyms {
  static load(e, t, r) {
    return -1 === config.SUPPORTED_SYNONYM_LANGUAGES.indexOf(t) ? Promise.reject(new Error("Sorry, synonyms are not supported in this language.")) : this._request(e, t, r)
  }

  static _request(e, t, r) {
    const s = e.word, n = this._prepareWord(e.word), o = this._getFromCache(n, e.beforeText, e.afterText, t, r);
    if (o) return Promise.resolve(o);
    this._abortCurrentRequest(), clearTimeout(this._timeout), this._currentRequest = new AbortController;
    const i = {method: "get", mode: "cors", signal: this._currentRequest.signal};
    this._timeout = window.setTimeout((() => this._abortCurrentRequest), this.HTTP_TIMEOUT);
    let a = `https://synonyms.languagetool.org/synonyms/${t}/${encodeURIComponent(n)}?before=${encodeURIComponent(e.beforeText)}&after=${encodeURIComponent(e.afterText)}`;
    return r && (a += `&motherTongue=${r}`), fetch(a, i).then((e => e.json())).then((o => {
      if (!o || !o.synsets) throw new Error("Error loading synonyms.");
      const i = this._buildSynonymSets(n, s, o), a = {dataSource: o.dataSource, synonymSets: i, genders: o.genders};
      return this._setInCache(n, e.beforeText, e.afterText, t, r, a), a
    })).finally((() => {
      this._currentRequest = null, clearTimeout(this._timeout)
    }))
  }

  static _prepareWord(e) {
    return e = e.trim(), isAllUppercase(e) ? e.charAt(0) + e.substr(1).toLowerCase() : e
  }

  static _containsSynonymObj(e, t) {
    return e.some((e => e.word === t.word))
  }

  static _buildSynonymSets(e, t, r) {
    const s = [], n = isAllUppercase(t) && t.length > 3;
    return r.synsets.forEach((r => {
      if (!r.terms.length) return;
      let o = "", i = "";
      r.terms[0].term.match(this.IS_ONLY_HINT_REGEXP) ? (o = `${t} ${r.terms[0].term}`, i = r.terms[0].term.replace(/[\(\)]/g, ""), r.terms.shift()) : o = r.terms[0].term;
      const a = [];
      if (r.terms.forEach((t => {
        let r = t.term.match(this.HINT_REGEXP) || [];
        if (r = r.map((e => e.replace(this.TERM_REGEXP, "").trim())), r = r.filter((e => !e.match(/similar/))), r.indexOf("(antonym)") > -1) return;
        let s = t.term.replace(this.HINT_REGEXP, "").trim();
        s.match(/[\!\?\,\:\;]/) || s.toLowerCase() !== e.toLowerCase() && (n && (s = s.toUpperCase()), s.trim() && a.push({
          word: s,
          hints: r
        }))
      })), !a.length) return;
      const h = s.find((e => e.type === i && e.title === o && e.synonyms.find((e => this._containsSynonymObj(a, e)))));
      if (h) a.forEach((e => {
        this._containsSynonymObj(h.synonyms, e) || h.synonyms.push(e)
      })); else {
        if (i) {
          if (s.filter((e => e.type === i)).length >= 3) return
        }
        s.push({title: o, type: i, synonyms: a})
      }
    })), s
  }

  static _abortCurrentRequest() {
    this._currentRequest && (this._currentRequest.abort(), this._currentRequest = null)
  }

  static _getFromCache(e, t, r, s, n) {
    const o = this._cache.find((o => o.word === e && o.beforeText === t && o.afterText === r && o.language === s && o.motherTongue === n));
    if (o) return o.result
  }

  static _setInCache(e, t, r, s, n, o) {
    this._cache.unshift({
      word: e,
      beforeText: t,
      afterText: r,
      language: s,
      motherTongue: n,
      result: o
    }), this._cache.length = Math.min(this._cache.length, 100)
  }
}

Synonyms.HTTP_TIMEOUT = 5e3, Synonyms._currentRequest = null, Synonyms._cache = [], Synonyms.IS_ONLY_HINT_REGEXP = /^\s*\([^\)]+\)\s*$/, Synonyms.TERM_REGEXP = /\sterm/, Synonyms.HINT_REGEXP = /(\s|^)\((.+?)\)/g;