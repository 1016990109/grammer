var __awaiter = this && this.__awaiter || function (t, e, r, s) {
  return new (r || (r = Promise))((function (n, o) {
    function i(t) {
      try {
        c(s.next(t))
      } catch (t) {
        o(t)
      }
    }

    function a(t) {
      try {
        c(s.throw(t))
      } catch (t) {
        o(t)
      }
    }

    function c(t) {
      var e;
      t.done ? n(t.value) : (e = t.value, e instanceof r ? e : new r((function (t) {
        t(e)
      }))).then(i, a)
    }

    c((s = s.apply(t, e || [])).next())
  }))
};
const headers = {accept: "application/json", "content-type": "application/json"};

function isRephraseObject(t) {
  return "object" == typeof t && null !== t && "string" == typeof t.text && "number" == typeof t.score && "string" == typeof t.label && "string" == typeof t.origin && "string" == typeof t.uuid
}

class Phrases {
  static load(t, e, r, s) {
    var n;
    const o = this._cache.get(e.trim()), i = null !== (n = this._history.get(e)) && void 0 !== n ? n : null;
    return o ? Promise.resolve({phrases: o, previousSentence: i}) : this._request(t, e, i, r, s)
  }

  static report(t, e) {
    return __awaiter(this, void 0, void 0, (function* () {
      this._abortCurrentRequests(), "string" == typeof e.chosenSentence && this._history.set(e.chosenSentence, e.originalSentence);
      const r = new AbortController, s = JSON.stringify(Object.assign(Object.assign({}, e), {uuid: t}));
      this._abortControllers.push(r);
      try {
        return yield fetch(`${config.WEBAPI_URL}/rewriting/report`, {
          method: "post",
          signal: r.signal,
          mode: "cors",
          headers: headers,
          body: JSON.stringify({data: s})
        }), !0
      } catch (t) {
        return !1
      }
    }))
  }

  static _request(t, e, r, s, n) {
    return __awaiter(this, void 0, void 0, (function* () {
      this._abortCurrentRequests();
      const o = JSON.stringify({text: e, offset: 0, length: 0, count: 5, userID: t, language: s, inhouseOnly: n});
      let i = [];
      const a = new AbortController;
      this._abortControllers.push(a);
      const c = yield fetch(`${config.BASE_SERVER_URL}/rewriting/rewrite`, {
        method: "post",
        signal: a.signal,
        mode: "cors",
        headers: headers,
        body: o
      });
      if (!1 === c.ok) {
        const t = 524 === c.status ? "ServerTimeout" : "ServerFailure";
        throw new Error(t)
      }
      const h = yield c.json(), {rewrites: l = []} = h || {};
      return i = l.filter((t => isRephraseObject(t))).map((({
                                                              text: t,
                                                              score: e,
                                                              label: r,
                                                              origin: s,
                                                              uuid: n
                                                            }) => ({
        text: t,
        score: e,
        label: r,
        origin: s,
        uuid: n
      }))).filter((({text: t}, e, r) => r.findIndex((({text: e}) => t === e)) === e)), i = shuffle(i), this._cache.set(e.trim(), i), {
        phrases: i,
        previousSentence: r
      }
    }))
  }

  static _abortCurrentRequests() {
    for (const t of this._abortControllers) t.abort();
    this._abortControllers.length = 0
  }
}

Phrases._cache = new Map, Phrases._history = new Map, Phrases._abortControllers = [];