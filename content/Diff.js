const EXTENDED_WORD_CHARACTERS = /^[a-zA-Z\u{C0}-\u{FF}\u{D8}-\u{F6}\u{F8}-\u{2C6}\u{2C8}-\u{2D7}\u{2DE}-\u{2FF}\u{1E00}-\u{1EFF}]+$/u,
  RE_WHITESPACE = /\S/;

class Diff {
  static isRewrite(e) {
    return e.filter((({added: e}) => !0 === e)).map((({value: e}) => e)).join("").length / Diff.toNewString(e).length >= .7
  }

  static toNewString(e) {
    return e.filter((({removed: e}) => !1 === Boolean(e))).map((({value: e}) => e)).join("")
  }

  static ignoreCaseChangeAtBeginning(e) {
    var t, n;
    const [o, u, {value: l}, i] = e,
      s = !0 === u.added && "string" == typeof u.value && !0 === i.removed && (null === (t = i.value) || void 0 === t ? void 0 : t.trim().endsWith(u.value.toLocaleLowerCase()));
    if (!0 !== o.removed || !1 === s || "" !== (null == l ? void 0 : l.trim())) return e;
    const r = null === (n = i.value) || void 0 === n ? void 0 : n.replace(String(u.value).toLocaleLowerCase(), "").replace(/\s+$/, " ");
    return [{value: (o.value ? `${o.value} ` : "") + r, count: i.count, removed: !0}, {
      value: u.value + l,
      count: 0
    }, ...e.slice(4)]
  }

  compute(e, t) {
    const n = this.removeEmpty(this.tokenize(e)), o = this.removeEmpty(this.tokenize(t));
    let u = o.length, l = n.length, i = 1, s = u + l, r = [{newPos: -1, components: []}],
      a = this.extractCommon(r[0], o, n, 0);
    if (r[0].newPos + 1 >= u && a + 1 >= l) return [{value: this.join(o), count: o.length}];
    const c = () => {
      for (let e = -1 * i; e <= i; e += 2) {
        let t;
        const i = r[e - 1], s = r[e + 1];
        let a = (s ? s.newPos : 0) - e;
        i && (r[e - 1] = void 0);
        const c = i && i.newPos + 1 < u, d = s && 0 <= a && a < l;
        if (c || d) {
          if (!c || d && i.newPos < s.newPos ? (t = clonePath(s), this.pushComponent(t.components, void 0, !0)) : (t = i, t.newPos++, this.pushComponent(t.components, !0, void 0)), a = this.extractCommon(t, o, n, e), t.newPos + 1 >= u && a + 1 >= l) return buildValues(this, t.components, o, n);
          r[e] = t
        } else r[e] = void 0
      }
      i++
    };
    for (; i <= s;) {
      let e = c();
      if (e) return e
    }
  }

  pushComponent(e, t, n) {
    let o = e[e.length - 1];
    o && o.added === t && o.removed === n ? e[e.length - 1] = {
      count: o.count + 1,
      added: t,
      removed: n
    } : e.push({count: 1, added: t, removed: n})
  }

  extractCommon(e, t, n, o) {
    let u = t.length, l = n.length, i = e.newPos, s = i - o, r = 0;
    for (; i + 1 < u && s + 1 < l && this.equals(t[i + 1], n[s + 1]);) i++, s++, r++;
    return r && e.components.push({count: r}), e.newPos = i, s
  }

  removeEmpty(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) e[n] && t.push(e[n]);
    return t
  }

  equals(e, t) {
    return e === t || !RE_WHITESPACE.test(e) && !RE_WHITESPACE.test(t)
  }

  tokenize(e) {
    const t = e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);
    for (let e = 0; e < t.length - 1; e++) !t[e + 1] && t[e + 2] && EXTENDED_WORD_CHARACTERS.test(t[e]) && EXTENDED_WORD_CHARACTERS.test(t[e + 2]) && (t[e] += t[e + 2], t.splice(e + 1, 2), e--);
    return t
  }

  join(e) {
    return e.join("")
  }
}

function buildValues(e, t, n, o) {
  let u = 0, l = t.length, i = 0, s = 0;
  for (; u < l; u++) {
    let l = t[u];
    if (l.removed) {
      if (l.value = e.join(o.slice(s, s + l.count)), s += l.count, u && t[u - 1].added) {
        let e = t[u - 1];
        t[u - 1] = t[u], t[u] = e
      }
    } else {
      if (l.added) l.value = e.join(n.slice(i, i + l.count)); else {
        const t = n.slice(i, i + l.count).map(((e, t) => {
          let n = o[s + t];
          return n.length > e.length ? n : e
        }));
        l.value = e.join(t)
      }
      i += l.count, l.added || (s += l.count)
    }
  }
  let r = t[l - 1];
  return l > 1 && "string" == typeof r.value && (r.added || r.removed) && e.equals("", r.value) && (t[l - 2].value += r.value, t.pop()), t
}

function clonePath(e) {
  return {newPos: e.newPos, components: e.components.slice(0)}
}

function createDiff(e, t) {
  return (new Diff).compute(e, t) || []
}

"undefined" != typeof module && (module.exports = {Diff: Diff, createDiff: createDiff});