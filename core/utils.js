/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
function matchAll(t, e) {
  if ("function" == typeof t.matchAll) return Array.from(t.matchAll(e));
  const n = [];
  let r = e.exec(t);
  for (; r;) n.push(r), r = e.exec(t);
  return n
}

function isEndsWithWhitespace(t) {
  return t.length > 0 && " " === t[t.length - 1]
}

let isLetter, isWhiteSpace, normalizeWhiteSpaces, isZWC, indexOfZWC, removeZWC;

function includesWhiteSpace(t) {
  return /\s/.test(t)
}

function isCapitalized(t) {
  const e = t.charAt(0);
  return e.toUpperCase() === e
}

function startsWithUppercase(t) {
  const e = t.charAt(0);
  return e === e.toUpperCase() && e !== e.toLowerCase()
}

!function () {
  let t;
  try {
    t = new RegExp("\\p{L}", "u")
  } catch (e) {
    t = /[a-zäöüß]/i
  }
  isLetter = function (e) {
    return t.test(e)
  }
}(), function () {
  const t = new RegExp("^[\b\t          ‏　]$"), e = new RegExp("[\b\t          ‏　]", "g");
  isWhiteSpace = function (e) {
    return t.test(e)
  }, normalizeWhiteSpaces = function (t) {
    return t.replace(e, " ")
  }
}(), function () {
  const t = new RegExp("^[​‌‍­⁠]$"), e = new RegExp("[​‌‍­⁠]"), n = new RegExp("[​‌‍­⁠]", "g");
  isZWC = function (e) {
    return t.test(e)
  }, indexOfZWC = function (t) {
    const n = t.match(e);
    return n ? n.index : -1
  }, removeZWC = function (t) {
    return t.replace(n, "")
  }
}();
const isAllUppercase = function () {
  const t = /^[A-ZÈÉÊÁÀÂÓÒÔÚÙÛÍÌÎÄÜÖ]+[A-ZÈÉÊÁÀÂÓÒÔÚÙÛÍÌÎÄÜÖ\-!?#@=%().:;<>'’´`"”“*+,\s]+[A-ZÈÉÊÁÀÂÓÒÔÍÌÎÄÜÖ]$/;
  return function (e) {
    return t.test(e)
  }
}();

function toLowercaseFirstChar(t) {
  return t.charAt(0).toLowerCase() + t.substr(1)
}

let getWordPosition, getWordContext;

function getValuableText(t, e) {
  if (0 === e.length) return {
    text: t,
    originalText: t,
    usedParts: [{
      start: 0,
      end: t.length,
      originalStart: 0,
      originalEnd: t.length,
      posDiff: 0,
      length: t.length,
      text: t
    }],
    ignoredParts: []
  };
  e = function (t, e) {
    const n = [];
    n.length = e, fill(n, !1);
    const r = [];
    r.length = e;
    const o = [];
    o.length = e, fill(o, 0);
    for (const e of t) if ("replacingText" in e) for (let t = 0; t < e.replacingText.length; t++) r[e.offset + t] = e.replacingText[t], o[e.offset + t] = e.offsetShift || 0; else fill(n, !0, e.offset, e.offset + e.length);
    for (let t = 0; t < e; t++) n[t] && (r[t] = void 0, o[t] = 0);
    const s = [];
    let i = 0;
    for (; i < e;) if (n[i]) {
      let t = i;
      for (; t < e && n[t];) t++;
      s.push({offset: i, length: t - i}), i = t
    } else i++;
    for (i = 0; i < e;) if (void 0 !== r[i]) {
      const t = o[i];
      let e = i;
      for (; e < r.length && o[e] === t && void 0 !== r[e];) e++;
      const n = r.slice(i, e).join("");
      s.push({offset: i, length: e - i, replacingText: n, offsetShift: t}), i = e
    } else i++;
    return s.sort(((t, e) => t.offset - e.offset)), s
  }(e, t.length);
  const n = [];
  let r = 0, o = 0;
  for (const s of e) {
    if (o < s.offset) {
      const e = s.offset - o;
      n.push({
        start: r,
        end: r + e,
        originalStart: o,
        originalEnd: o + e,
        posDiff: o - r,
        length: e,
        text: t.substr(o, e)
      }), r += e
    }
    if ("replacingText" in s) {
      let t = s.offset;
      t += s.offsetShift || 0, n.push({
        start: r,
        end: r + s.length,
        originalStart: t,
        originalEnd: t + s.length,
        posDiff: t - r,
        length: s.length,
        text: s.replacingText.padEnd(s.length, " ")
      }), r += s.length
    }
    o = s.offset + s.length
  }
  if (o < t.length) {
    const e = t.length - o;
    n.push({start: r, end: r + e, originalStart: o, originalEnd: o + e, posDiff: o - r, length: e, text: t.substr(o)})
  }
  const s = n.map((t => t.text)).join(""), i = [];
  for (const t of e) if ("replacingText" in t) {
    const e = t.offsetShift || 0;
    0 !== e && i.push({
      start: t.offset,
      end: t.offset + e
    }), t.length !== t.replacingText.length + e && i.push({
      start: t.offset + e + t.replacingText.length,
      end: t.offset + t.length
    })
  } else i.push({start: t.offset, end: t.offset + t.length});
  return {text: s, originalText: t, usedParts: n, ignoredParts: i}
}

function getTextsDiff(t, e) {
  if (t === e) return null;
  let n = 0;
  const r = Math.max(t.length, e.length);
  for (n = 0; n < r && t[n] === e[n]; n++) ;
  let o = 0;
  const s = Math.min(t.length, e.length);
  for (; n + o < s;) {
    if (t[t.length - o - 1] !== e[e.length - o - 1]) break;
    o++
  }
  return {from: n, oldFragment: t.substring(n, t.length - o), newFragment: e.substring(n, e.length - o)}
}

function isTextsCompletelyDifferent(t, e) {
  const n = t.split("\n"), r = e.split("\n");
  for (const t of n) if (r.some((e => e === t))) return !1;
  return !0
}

function getParagraphsDiff(t, e) {
  const n = [], r = t.split("\n"), o = e.split("\n");
  let s = 0;
  const i = Math.max(r.length, o.length);
  for (s = 0; s < i && r[s] === o[s]; s++) ;
  let l = 0;
  const a = Math.min(r.length, o.length);
  for (; s + l < a;) {
    if (r[r.length - l - 1] !== o[o.length - l - 1]) break;
    l++
  }
  let f = 0;
  for (let t = 0; t < s; t++) f += r[t].length + 1;
  let c = f;
  for (let t = s; t < i - l; t++) {
    const e = t < r.length - l ? r[t] : null, s = t < o.length - l ? o[t] : null;
    e === s && f === c || n.push({
      oldText: e,
      newText: s,
      oldOffset: f,
      newOffset: c,
      textDiff: getTextsDiff(e || "", s || "")
    }), null !== e && (f += e.length + 1), null !== s && (c += s.length + 1)
  }
  if (f !== c) for (let t = l - 1; t >= 0; t--) {
    const e = r[r.length - t - 1], s = o[o.length - t - 1];
    n.push({oldText: e, newText: s, oldOffset: f, newOffset: c, textDiff: null}), f += e.length + 1, c += s.length + 1
  }
  return n
}

function escapeHTML(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/`/g, "&#x60;").replace(/\//g, "&#x2F;")
}

function binarySearch(t, e) {
  let n = 0, r = t.length - 1;
  for (; n <= r;) {
    const o = n + Math.ceil((r - n) / 2), s = e(t[o]);
    if (s > 0) n = o + 1; else {
      if (!(s < 0)) {
        for (let n = o; n > 0; n--) if (0 !== e(t[n - 1])) return t[n];
        return t[0]
      }
      r = o - 1
    }
  }
  return null
}

function binarySearchIndex(t, e) {
  let n = 0, r = t.length - 1;
  for (; n <= r;) {
    const o = n + Math.ceil((r - n) / 2), s = t[o];
    if (s < e) n = o + 1; else {
      if (!(s > e)) {
        for (let n = o; n > 0; n--) if (t[n - 1] !== e) return n;
        return 0
      }
      r = o - 1
    }
  }
  return -1
}

function getRandomNumberInRange(t, e) {
  return t = Math.ceil(t), e = Math.floor(e), Math.floor(Math.random() * (e - t + 1)) + t
}

function uniq(t) {
  const e = [];
  return t.forEach((t => {
    -1 === e.indexOf(t) && e.push(t)
  })), e
}

function fill(t, e, n = 0, r = t.length) {
  for (let o = n; o < r; o++) t[o] = e
}

function isSameObjects(t, e) {
  return t === e || JSON.stringify(t) === JSON.stringify(e)
}

function clone(t) {
  return null === t || "object" != typeof t ? t : t instanceof Date ? new Date(t) : t instanceof RegExp ? new RegExp(t) : Array.isArray(t) ? Array.from(t) : Object.assign({}, t)
}

function deepClone(t) {
  if (null === t || "object" != typeof t) return t;
  if (t instanceof Date) return new Date(t);
  if (t instanceof RegExp) return new RegExp(t);
  const e = Array.isArray(t) ? [] : {};
  for (const n in t) e[n] = deepClone(t[n]);
  return e
}

function waitFor(t, e = 400, n = 15) {
  return new Promise(((r, o) => {
    let s = 0;
    const i = () => {
      const e = t();
      null != e && (clearInterval(l), r(e)), ++s >= n && (clearInterval(l), o())
    }, l = setInterval(i, e);
    i()
  }))
}

function generateStackTrace(t) {
  if (!t.stack) return;
  let e = [];
  if (t.stack.split(/\n/).forEach((t => {
    const n = t.match(/([\w_<>]+)\s+\(.+?([\w_\-]+\.(js|html))/);
    n && e.push(`${n[2]}:${n[1]}`)
  })), !e.length) {
    const n = t.stack.match(/([\w_\-]+\.(js|html))/);
    n && e.push(n[1])
  }
  return e.join(",").substr(0, 140)
}

function getCountdown(t) {
  let e = t - Date.now();
  e < 0 && (e = 0);
  const n = Math.floor(e / 1e3 % 60), r = Math.floor(e / 1e3 / 60 % 60);
  return `${pad(Math.floor(e / 1e3 / 60 / 60))}:${pad(r)}:${pad(n)}`
}

function pad(t) {
  const e = t.toString();
  return 1 === e.length ? "0" + e : e
}

function getCurrentUrl() {
  if ("about:blank" === location.href || "about:srcdoc" === location.href) try {
    return (window.opener || window.parent).location.href
  } catch (t) {
  }
  return location.href
}

function getDomain(t, e = t) {
  if (t.startsWith("about:blank")) return "blank";
  if (t.startsWith("about:srcdoc")) return "srcdoc";
  if (t.startsWith("file:")) return "file";
  t && !/^([a-z\-]+:\/\/)/i.test(t) && (t = "http://" + t);
  try {
    return new URL(t).hostname
  } catch (t) {
    return e
  }
}

function getCurrentDomain() {
  const t = document.location || document.defaultView.location;
  if (t && t.hostname) return t.hostname.replace(/^www\./, "");
  try {
    if (window.parent !== window) return window.parent.location.hostname.replace(/^www\./, "")
  } catch (t) {
  }
  return t.href.startsWith("about:blank") ? "blank" : t.href.startsWith("about:srcdoc") ? "srcdoc" : t.href.startsWith("file:") ? "file" : ""
}

function formatNumber(t, e) {
  return t.toLocaleString(e)
}

function getMainPageDomain() {
  let t;
  return window.parent !== window && document.referrer && (t = getDomain(document.referrer)), t || (t = getCurrentDomain()), t
}

function getSubdomains(t) {
  const e = [t];
  for (; t.split(".").length > 2;) {
    const n = t.indexOf(".");
    t = t.substr(n + 1), e.push(t)
  }
  return e
}

!function () {
  let t, e;
  const n = /(?:\S+\s+){0,4}\S+$/, r = /^\S+(?:\s+\S+){0,4}/;
  try {
    t = new RegExp("^\\s*(-?\\p{L}+)*-?\\s*$", "u"), e = new RegExp("^\\s*\\p{L}+(-\\p{L}+)*\\s*$", "u")
  } catch (n) {
    t = /^\s*(-?[a-zäöüß]+)*-?\s*$/i, e = /^\s*[a-zäöüß]+(-[a-zäöüß]+)*\s*$/i
  }
  getWordPosition = (n, r, o = r) => {
    const s = n.substring(r, o);
    if (!t.test(s)) return null;
    let i = 0 === s.length || isLetter(s[0]), l = "-" === s[0], a = r;
    if (i || l) for (; a > 0;) {
      const t = n[a - 1], e = isLetter(t), r = "-" === t;
      if (!e && !r) break;
      if (r && l) return null;
      a--, i = e, l = r
    }
    i = isLetter(s[s.length - 1]), l = s.endsWith("-");
    let f = o;
    if (i || l) for (; f < n.length;) {
      const t = n[f], e = isLetter(t), r = "-" === t;
      if (!e && !r) break;
      if (r && l) return null;
      f++, i = e, l = r
    }
    const c = s.match(/\s+$/);
    c && (f -= c[0].length);
    const u = n.substring(a, f);
    return e.test(u) ? {start: a, end: f} : null
  }, getWordContext = (t, e, o) => {
    const s = getWordPosition(t, e, o);
    if (!s) return null;
    const i = n.exec(t.substring(0, s.start).trim()), l = i ? i[0] : "", a = r.exec(t.substring(s.end).trim()),
      f = a ? a[0] : "";
    return {word: t.substring(s.start, s.end), position: s, beforeText: l, afterText: f}
  }
}();
const isErrorIgnoredByDictionary = function () {
  const t = /^\w+\.$/;
  return (e, n) => {
    if (!e.isSpellingError) return !1;
    let r = e.originalPhrase;
    if (t.test(r) && (r = r.substring(0, r.length - 1)), n.includes(r)) return !0;
    if (startsWithUppercase(r)) {
      const t = toLowercaseFirstChar(r);
      if (n.includes(t)) return !0
    }
    return !1
  }
}();

function isErrorRuleIgnored(t, e) {
  const n = t.language.code.split("-")[0];
  return e.some((e => !(e.id !== t.rule.id || "*" !== e.language && e.language !== n) && (!e.phrase || (!!(e.id.includes("TOO_LONG_SENTENCE") && getStringSimilarity(e.phrase, t.originalPhrase) > .75) || e.phrase.toLowerCase() === t.originalPhrase.toLowerCase()))))
}

function getStringSimilarity(t, e, n = 2, r = !1) {
  if (r || (t = t.toLowerCase(), e = e.toLowerCase()), t.length < n || e.length < n) return 0;
  const o = new Map;
  for (let e = 0; e < t.length - (n - 1); e++) {
    const r = t.substr(e, n);
    o.set(r, o.has(r) ? o.get(r) + 1 : 1)
  }
  let s = 0;
  for (let t = 0; t < e.length - (n - 1); t++) {
    const r = e.substr(t, n), i = o.has(r) ? o.get(r) : 0;
    i > 0 && (o.set(r, i - 1), s++)
  }
  return 2 * s / (t.length + e.length - 2 * (n - 1))
}

const removeDiacritics = function () {
  const t = /[\u0300-\u036f]/g, e = /\u0142/g, n = /\u00F8/g;
  return function (r) {
    return r.normalize("NFD").replace(t, "").replace(e, "l").replace(n, "o")
  }
}();

function tryThese(...t) {
  for (let e = 0; e < t.length; e++) {
    const n = t[e];
    try {
      return n()
    } catch (t) {
    }
  }
}

function isDateInFuture(t) {
  return t > Date.now()
}

function isIntersect(t, e, n, r, o = !1) {
  return o ? t <= r && e >= n : t < r && e > n
}

function compareNumberAndSegment(t, e, n, r = !1) {
  if (r) {
    if (e <= t && t < n) return 0
  } else if (e <= t && t <= n) return 0;
  return t - e
}

function compareSegments(t, e, n = !1) {
  return isIntersect(t.start, t.end, e.start, e.end, n) ? 0 : t.start - e.start
}

"undefined" != typeof module && (module.exports.isIntersect = isIntersect, module.exports.compareSegments = compareSegments, module.exports.matchAll = matchAll, module.exports.isLetter = isLetter, module.exports.getWordPosition = getWordPosition, module.exports.getWordContext = getWordContext, module.exports.getValuableText = getValuableText, module.exports.binarySearch = binarySearch, module.exports.binarySearchIndex = binarySearchIndex, module.exports.fill = fill, module.exports.getDomain = getDomain, module.exports.getSubdomains = getSubdomains);