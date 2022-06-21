/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
var __awaiter = this && this.__awaiter || function (e, t, r, s) {
  return new (r || (r = Promise))((function (i, a) {
    function n(e) {
      try {
        o(s.next(e))
      } catch (e) {
        a(e)
      }
    }

    function E(e) {
      try {
        o(s.throw(e))
      } catch (e) {
        a(e)
      }
    }

    function o(e) {
      var t;
      e.done ? i(e.value) : (t = e.value, t instanceof r ? t : new r((function (e) {
        e(t)
      }))).then(n, E)
    }

    o((s = s.apply(e, t || [])).next())
  }))
}, __rest = this && this.__rest || function (e, t) {
  var r = {};
  for (var s in e) Object.prototype.hasOwnProperty.call(e, s) && t.indexOf(s) < 0 && (r[s] = e[s]);
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var i = 0;
    for (s = Object.getOwnPropertySymbols(e); i < s.length; i++) t.indexOf(s[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, s[i]) && (r[s[i]] = e[s[i]])
  }
  return r
};

class Checker {
  static getServerBaseUrl(e, t = !1, r = !0) {
    const s = !!e.customApiServerUrl,
      i = r && (t ? this._useFallbackServerForParagraphLevelRequests : this._useFallbackServerForTextLevelRequests) && !e.customApiServerUrl;
    return s ? e.customApiServerUrl : e.isPremium || e.customApiServerUrl === config.PREMIUM_SERVER_URL ? i ? config.PREMIUM_FALLBACK_SERVER_URL : config.PREMIUM_SERVER_URL : i ? config.MAIN_FALLBACK_SERVER_URL : config.MAIN_SERVER_URL
  }

  static _getServerFullUrl(e, t = !1, r = !1) {
    let s = this.getServerBaseUrl(e, t);
    return s += s.endsWith("/") ? "check" : "/check", s += "?c=1", t && !1 === e.useParagraphLevelCaching || (s += `&instanceId=${encodeURIComponent(e.instanceId)}`), r && (s += "&languageChanged=true"), e.version && (s += `&v=${encodeURIComponent(e.version)}`), s
  }

  static _abortCheckRequest(e) {
    this._textLevelAbortControllers.has(e) && (this._textLevelAbortControllers.get(e).abort(), this._textLevelAbortControllers.delete(e))
  }

  static _abortParagraphLevelCheckRequest(e) {
    this._paragraphLevelAbortControllers.has(e) && (this._paragraphLevelAbortControllers.get(e).abort(), this._paragraphLevelAbortControllers.delete(e))
  }

  static _abortLanguageDetectionRequest(e) {
    this._languageDetectionAbortControllers.has(e) && (this._languageDetectionAbortControllers.get(e).abort(), this._languageDetectionAbortControllers.delete(e))
  }

  static _prepareText(e) {
    return e.replace(this.ZWNJ_REGEXP, this.ZWS)
  }

  static _joinInChunks(e, t = config.PARAGRAPH_LEVEL_CHUNK_LENGTH) {
    const r = [];
    let s = 0, i = [];
    return e.forEach((e => {
      s > t && (s = 0, i = []), i.push(e), s += e.text.length, r.includes(i) || r.push(i)
    })), r
  }

  static _getRequestData(e, t, r) {
    const s = new URLSearchParams, i = {text: e};
    r.recipientInfo && (r.recipientInfo.address || r.recipientInfo.fullName) && (i.metaData = {
      EmailToAddress: r.recipientInfo.address,
      FullName: r.recipientInfo.fullName
    }), s.append("data", JSON.stringify(i));
    const a = Boolean(r.isPremium || r.customApiServerUrl && r.customApiServerUrl.startsWith(config.PREMIUM_SERVER_URL));
    if (a && r.user && "password" in r.user ? (s.append("username", r.user.email), s.append("password", r.user.password)) : a && r.user && "token" in r.user && (s.append("username", r.user.email), s.append("tokenV2", r.user.token)), s.append("textSessionId", r.instanceId), r.isPremium || s.append("enableHiddenRules", "true"), r.motherTongue && s.append("motherTongue", r.motherTongue), "normal" !== r.checkLevel && s.append("level", r.checkLevel.replace("hidden-", "")), t) s.append("language", t.code); else {
      s.append("language", "auto"), s.append("noopLanguages", r.preferredLanguages.join(",")), s.append("preferredLanguages", r.preferredLanguages.join(","));
      const e = this._getPreferredVariants(r.languageVariants.en, r.languageVariants.de, r.languageVariants.pt, r.languageVariants.ca);
      e.length > 0 && s.append("preferredVariants", e.toString())
    }
    return s.append("disabledRules", "WHITESPACE_RULE,CONSECUTIVE_SPACES"), r.userAgent && s.append("useragent", r.userAgent), s
  }

  static _getPreferredVariants(e, t, r, s) {
    const i = [];
    return e && i.push(e), t && i.push(t), r && i.push(r), s && i.push(s), i
  }

  static _getCheckRequestData(e, t, r) {
    const s = this._getRequestData(e, t, r);
    return s.append("mode", "textLevelOnly"), s
  }

  static _getParagraphLevelCheckRequestData(e, t, r, s) {
    const i = this._getRequestData(e, t, r);
    return i.append("mode", "allButTextLevelOnly"), i.append("allowIncompleteResults", String(s)), i
  }

  static _sendRequest(e, t, r = config.CHECK_REQUEST_TIMEOUT) {
    return __awaiter(this, void 0, void 0, (function* () {
      const s = fetch(e, t).catch((t => {
        throw"AbortError" === t.name ? {
          reason: "AbortError",
          status: 0,
          response: t.message || ""
        } : {reason: "ConnectionError", status: 0, url: e.replace(/\?.*/, ""), response: t.message || ""}
      })).then(this._checkForException).then((e => e.json())), i = new Promise(((t, s) => {
        window.setTimeout((() => {
          s({reason: "TimeoutError", status: 0, url: e.replace(/\?.*/, ""), response: ""})
        }), r)
      }));
      return Promise.race([s, i])
    }))
  }

  static _isConnectionOrServerIssue(e) {
    return config.SWITCH_TO_FALLBACK_SERVER_ERRORS.includes(e.status) || ["ConnectionError", "TimeoutError"].includes(e.reason)
  }

  static _getGraphemesCount(e, t, r = 0) {
    for (let s = r; s < e.length; s++) {
      if (t <= 0) return s - r;
      t -= e[s].length
    }
    return e.length - r
  }

  static _getCodepointsCount(e, t, r = 0) {
    let s = 0;
    for (let i = r; i < Math.min(e.length, r + t); i++) s += e[i].length;
    return s
  }

  static _correctMatches(e, t, r) {
    if (t !== r) {
      const s = new GraphemeSplitter, i = s.splitGraphemes(t), a = s.splitGraphemes(r);
      for (const t of e) {
        const e = Checker._getGraphemesCount(i, t.offset), r = Checker._getGraphemesCount(i, t.length, e);
        t.offset = Checker._getCodepointsCount(a, e), t.length = Checker._getCodepointsCount(a, r, e)
      }
    }
    return e
  }

  static _getLeftText(e, t, r, s = 15) {
    let i = Math.max(t - s, 0);
    if (r) {
      const r = e.lastIndexOf("\n", t);
      r >= i && (i = r + 1)
    }
    let a = e.substring(i, t);
    return 0 === i || r && "\n" === e[i - 1] || (a = "..." + a), a
  }

  static _getRightText(e, t, r, s = 15) {
    let i = Math.min(t + s, e.length);
    if (r) {
      const r = e.indexOf("\n", t);
      -1 !== r && r <= i && (i = r)
    }
    let a = e.substring(t, i);
    return i === e.length || r && "\n" === e[i] || (a += "..."), a
  }

  static _transformMatches(e, t, r, s = !1) {
    return e.map((e => {
      const i = e.rule.id.startsWith("DB_"), a = this.SPELLING_RULES_ID.some((t => e.rule.id.includes(t))),
        n = this.STYLE_ISSUE_TYPES.some((t => e.rule.issueType === t)),
        E = "typographical" === e.rule.issueType && "CASING" !== e.rule.category.id || "PUNCTUATION" === e.rule.category.id || "TYPOGRAPHY" === e.rule.category.id || e.rule.category.id.includes("KOMMA"),
        o = Boolean(e.rule.tags && e.rule.tags.includes("picky")), _ = t.substr(e.offset, e.length),
        l = `${Checker._getLeftText(t, e.offset, s)}|${_}|${Checker._getRightText(t, e.offset + e.length, s)}`,
        u = Checker._getLeftText(t, e.offset, !0, 60), c = Checker._getRightText(t, e.offset + e.length, !0, 60),
        h = `${escapeHTML(u)}<lt-em>${escapeHTML(_)}</lt-em>${escapeHTML(c)}`;
      let A = "";
      e.shortMessage && e.shortMessage.length < 60 && e.shortMessage !== e.message && (A = e.shortMessage.replace(this.PUNCTUATION_AT_END, ""));
      const R = e.replacements.map((e => ({
        value: e.value,
        prefix: e.prefix,
        suffix: e.suffix,
        type: e.type,
        shortDescription: e.shortDescription
      })));
      return {
        isParagraphLevelCheck: s,
        rule: e.rule,
        isCustomError: i,
        isSpellingError: a,
        isStyleError: n,
        isPunctuationError: E,
        isPicky: o,
        contextForSureMatch: e.contextForSureMatch,
        language: {code: r.code, name: r.name},
        description: e.message,
        shortDescription: A,
        start: e.offset,
        end: e.offset + e.length,
        length: e.length,
        originalPhrase: _,
        contextPhrase: l,
        longContextPhrase: h,
        fixes: R
      }
    }))
  }

  static _adjustErrors(e, t, r) {
    const s = r.recipientInfo ? r.recipientInfo.fullName.split(" ").filter((e => e)) : [];
    return e.filter((e => {
      if (r.ignoreCapitalizationErrors) {
        if (e.fixes.some((t => t.value.toLowerCase() === e.originalPhrase.toLowerCase()))) return !1;
        if ("UPPERCASE_SENTENCE_START" === e.rule.id) return !1
      }
      e.fixes = e.fixes.filter((t => t.value !== "(" + e.originalPhrase + ")" && t.value !== e.originalPhrase && "(suggestion limit reached)" !== t.value && "(se ha alcanzado el límite de sugerencias)" !== t.value && "(Vorschlagslimit erreicht)" !== t.value)), e.language.code.startsWith("en") && isAllUppercase(e.originalPhrase) && !/[a-z]/i.test(e.contextPhrase) && e.fixes.forEach((t => {
        t.value.toLowerCase() !== e.originalPhrase.toLowerCase() && (t.value = t.value.toUpperCase())
      })), "PT_CLICHE_REPLACE" !== e.rule.id && "PT_WORDINESS_REPLACE" !== e.rule.id || e.fixes.forEach((t => {
        (t.value.startsWith("REFORMULAR") || t.value.startsWith("APAGAR") || t.value.startsWith("ESPECIFICAR")) && (e.description = e.description.replace(/\sÉ preferível dizer.+(REFORMULAR|APAGAR|ESPECIFICAR).+$/, ""), t.value = "")
      }));
      if (this.EMAIL_SIGNATURE_SEPARATOR_REGEXP.test(e.originalPhrase)) return !1;
      if (this.ZWS_REGEXP.test(e.originalPhrase)) return !1;
      if (e.rule.id.endsWith("WORD_REPEAT_BEGINNING_RULE") && this.ONLY_NUMBERS_REGEXP.test(e.originalPhrase)) return !1;
      if ("LEERZEICHEN_HINTER_DOPPELPUNKT" === e.rule.id && this.COLON_WHITESPACE_REGEXP.test(e.originalPhrase)) return !1;
      const i = t.substring(e.start - 25, e.start), a = t.substr(e.end, 25);
      if (r.ignoreCapitalizationErrorsAtLineStart && "UPPERCASE_SENTENCE_START" === e.rule.id && this.MID_SENTENCE_LINE_BREAK.test(i)) return !1;
      if ("DE_CASE" === e.rule.id && this.BULLET_POINT_REGEXP.test(i)) return !1;
      if ("DE_CASE" === e.rule.id && this.NUMBER_WITH_PARENTHESIS_AT_END_REGEXP.test(i)) return !1;
      if ("DE_CASE" === e.rule.id && this.PIPE_AT_END_REGEXP.test(i)) return !1;
      if ("DE_CASE" === e.rule.id && this.MARKDOWN_HEADLINE_REGEXP.test(i)) return !1;
      if ("DE_CASE" === e.rule.id && this.EMOJI_SENTENCE_START_REGEXP.test(i)) return !1;
      if ("LEERZEICHEN_HINTER_DOPPELPUNKT" === e.rule.id && this.MARKDOWN_INLINE_FORMAT_AT_BEGINNING_REGEXP.test(a)) return !1;
      if ("LEERZEICHEN_HINTER_DOPPELPUNKT" === e.rule.id && this.WIKI_MARKUP_AT_END_REGEXP.test(i)) return !1;
      if (e.rule.id.endsWith("UNPAIRED_BRACKETS") && ("!" === e.originalPhrase || "?" === e.originalPhrase) && (i.endsWith("!") || i.endsWith("?"))) return !1;
      if (e.rule.id.endsWith("UNPAIRED_BRACKETS") && this.ONE_LETTER_AT_END_REGEXP.test(i)) return !1;
      if (e.rule.id.endsWith("UNPAIRED_BRACKETS") && this.NUMBER_WITH_DOT_AT_END_REGEXP.test(i)) return !1;
      if ("SENTENCE_WHITESPACE" === e.rule.id && i.endsWith("{!")) return !1;
      if ("SENTENCE_WHITESPACE" === e.rule.id && this.SINGLE_UPPERCASE_LETTER_REGEXP.test(e.originalPhrase) && this.ABBREVIATION_AT_END_REGEXP.test(i)) return !1;
      if ("SENTENCE_WHITESPACE" === e.rule.id && "net" === e.originalPhrase.toLowerCase()) return !1;
      if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && this.NET_AT_BEGINNING_REGEXP.test(a)) return !1;
      if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && e.originalPhrase.endsWith(")") && i.endsWith(this.ZWS)) return !1;
      if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && e.originalPhrase.endsWith(".") && this.FILE_TYPE_AT_BEGINNING_REGEXP.test(a)) return !1;
      if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && i.endsWith("(") && (",)" === e.originalPhrase || ".)" === e.originalPhrase)) return !1;
      if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && i.endsWith("\n") && [")", "}", "]", "."].includes(e.originalPhrase)) return !1;
      if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && a.startsWith("/")) return !1;
      if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && e.originalPhrase.includes(this.ZWS)) return !1;
      if ("WORT1_BINDESTRICH_SPACE_WORT2" === e.rule.id && e.originalPhrase.endsWith(this.ZWS)) return !1;
      if ("MULTIPLICATION_SIGN" === e.rule.id && (this.AT_LEAST_TWO_LETTERS_AT_END_REGEXP.test(i) || !a || this.PUNCTUATION_AT_BEGINNING_REGEXP.test(a))) return !1;
      if ("ZBEDNA_SPACJA_PRZED" === e.rule.id && e.originalPhrase.includes(this.ZWS)) return !1;
      if ("UNLIKELY_OPENING_PUNCTUATION" === e.rule.id && this.PUNCTUATION_SPACE_AT_END_REGEXP.test(i)) return !1;
      if ("WORD_CONTAINS_UNDERSCORE" === e.rule.id && (!this.LOWERCASE_REGEXP.test(e.originalPhrase) || e.originalPhrase.includes("-") || e.originalPhrase.includes("__") || this.SLASH_AT_END_REGEXP.test(i) || this.SLASH_AT_BEGINNING_REGEXP.test(a))) return !1;
      if ("WORD_CONTAINS_UNDERSCORE" === e.rule.id && i.endsWith("[") && a.startsWith("]")) return !1;
      if ("WORD_CONTAINS_UNDERSCORE" === e.rule.id && this.QUOTE_AT_END_REGEXP.test(i) && this.QUOTE_AT_BEGINNING_REGEXP.test(a)) return !1;
      if ("WORD_CONTAINS_UNDERSCORE" === e.rule.id && (i.endsWith("=") || i.endsWith("&") || i.endsWith("?"))) return !1;
      if (["APOS_INCORRECT", "LOOSE_ACCENTS"].includes(e.rule.id) && "`" === e.originalPhrase) return !1;
      if (["_2_AANH_B", "FALSCHES_ANFUEHRUNGSZEICHEN_2"].includes(e.rule.id) && "``" === e.originalPhrase) return !1;
      if ("PT_WEASELWORD_REPLACE" === e.rule.id && (e.fixes.length = 0), e.isSpellingError || "WORD_CONTAINS_UNDERSCORE" === e.rule.id) {
        const t = e.originalPhrase.charAt(0), n = e.originalPhrase.toLowerCase();
        if (isErrorIgnoredByDictionary(e, r.dictionary)) return !1;
        if (a.startsWith("_") || i.endsWith("_")) return !1;
        if (e.originalPhrase.startsWith("$") && a.startsWith("}") && i.endsWith("{")) return !1;
        if (e.originalPhrase.startsWith("$") && e.originalPhrase.endsWith("$")) return !1;
        if (this.HTML_ENTITIES.includes(e.originalPhrase) && i.endsWith("&") || this.HTML_ENTITIES_WITH_AND.includes(e.originalPhrase) || this.HTML_ENTITIES_WITH_AND.includes("&" + e.originalPhrase)) return !1;
        if (this.COMMON_TLDS.some(((e, t) => n.endsWith("." + e) || this.COMMON_TLD_WITH_DOT_REGEXPS[t].test(a)))) return !1;
        if (this.DOT_WITH_PREFIX_REGEXP.test(i) && this.COMMON_TLDS.includes(n)) return !1;
        if (this.COMMON_FILE_TYPES.some(((e, t) => n.endsWith("." + e) || this.COMMON_FILE_TYPE_WITH_DOT_REGEXPS[t].test(a)))) return !1;
        if (this.DOT_WITH_PREFIX_REGEXP.test(i) && this.COMMON_FILE_TYPES.includes(n)) return !1;
        const E = "@" === t || this.MENTION_SYMBOL_AT_BEGINNING_REGEXP.test(i),
          o = "#" === t || this.HASH_SYMBOL_AT_BEGINNING_REGEXP.test(i);
        if (E || o) return !1;
        if (s.some((t => t === e.originalPhrase))) return !1;
        if (this.WAVY_DASH_REGEXP.test(e.originalPhrase)) return !1;
        for (const t of s) if (t.toLowerCase() === e.originalPhrase.toLowerCase() && !e.fixes.some((e => e.value === t))) {
          e.fixes.unshift({value: t});
          break
        }
      }
      return !0
    }))
  }

  static _processResponse(e, t, r, s, i, a = !1) {
    e.matches = this._correctMatches(e.matches, r, s);
    let n = this._transformMatches(e.matches, s, e.language, a);
    n = this._adjustErrors(n, s, i);
    let E = [], o = [], _ = [];
    const l = !!i.customApiServerUrl;
    return t = this._correctMatches(t.map((({start: e, end: t}) => ({
      offset: e,
      length: t - e
    }))), r, s).map((({offset: e, length: t}) => ({
      start: e,
      end: e + t,
      length: t
    }))), !i.isPremium && !l && e.language && e.language.code.startsWith("nl") && (n = n.filter((e => !this.NL_PREMIUM_RULES.includes(e.rule.id) || (e.rule.id = "HIDDEN_RULE", e.fixes = [], E.push(e), !1)))), !i.isPremium && !l && e.language && e.language.code.startsWith("pl") && (n = n.filter((e => !this.PL_PREMIUM_RULES.includes(e.rule.id) || (e.rule.id = "HIDDEN_RULE", e.fixes = [], E.push(e), !1)))), i.isPremium && n.forEach((e => {
      this.NL_PREMIUM_RULES.includes(e.rule.id) && (e.rule.isPremium = !0), this.PL_PREMIUM_RULES.includes(e.rule.id) && (e.rule.isPremium = !0)
    })), i.debug && n.forEach((e => {
      e.description = (e.rule.isPremium ? "prem:" : "") + e.rule.id + "[" + (e.rule.subId || "") + "] " + e.description
    })), e.hiddenMatches && (E = E.concat(this._transformMatches(e.hiddenMatches, s, e.language, a))), "hidden-picky" === i.checkLevel && (n = n.filter((e => !e.isPicky || (_.push(e), !1))), e.hiddenMatches && (E = E.filter((e => !e.isPicky || (o.push(e), !1))))), {
      errors: n,
      premiumErrors: E,
      pickyErrors: _,
      premiumPickyErrors: o,
      sentenceRanges: t
    }
  }

  static _getNonAlphaNumericalOffset(e, t, r = "") {
    const s = "start" === t, i = e.length - 1, a = s ? 0 : i, n = s ? i : 0,
      E = new RegExp(`^(?:\\p{L}|\\p{N}${r?"|"+r:""})$`, "gu"), o = e => s ? e + 1 : e - 1;
    let _ = 0;
    for (let t = a; (l = t, s ? l <= n : l >= 0) && null === e.charAt(t).match(E); t = o(t)) _ += 1;
    var l;
    return _
  }

  static _trimSentenceRanges(e, t) {
    const r = [];
    for (const s of e) {
      const {start: e, end: i} = s, a = t.substring(e, i), n = this._getNonAlphaNumericalOffset(a, "start", "[¿¡(]"),
        E = this._getNonAlphaNumericalOffset(a, "end", "[?!.)…]"), {length: o} = a.trim(), _ = e + n, l = e + o - E,
        u = l - _;
      r.push({start: _, end: l, length: u})
    }
    return r
  }

  static _correctErrorOffsets(e, t) {
    const r = [];
    let s = 0;
    for (const i of e) {
      const e = i.text.length;
      for (const a of t) if (a.start >= s && a.end <= s + e) {
        const e = Object.assign({}, a);
        e.start = e.start - s + i.offset, e.end = e.start + e.length, r.push(e)
      }
      s += e + 2
    }
    return r
  }

  static checkTextLevel(e, t, r, s = !1) {
    return __awaiter(this, void 0, void 0, (function* () {
      if (!(e = this._prepareText(e)).trim() || /^( *\n)* *$/g.test(e)) return {
        language: t,
        errors: [],
        premiumErrors: [],
        pickyErrors: [],
        premiumPickyErrors: []
      };
      this._abortCheckRequest(r.instanceId), this._textLevelAbortControllers.set(r.instanceId, new AbortController), this._useFallbackServerForTextLevelRequests && Date.now() - this._mainServerUnavailabilityTimeStamp >= config.MAIN_SERVER_RECHECK_INTERVAL && (this._useFallbackServerForTextLevelRequests = !1);
      const i = e.normalize(), a = this._getServerFullUrl(r, !1, s), n = {
        method: "post",
        mode: "cors",
        credentials: "omit",
        body: this._getCheckRequestData(i, t, r),
        signal: this._textLevelAbortControllers.get(r.instanceId).signal
      };
      return this._sendRequest(a, n).then((t => {
        const {
          errors: s,
          premiumErrors: a,
          pickyErrors: n,
          premiumPickyErrors: E
        } = this._processResponse(t, [], i, e, r);
        return {
          language: {code: t.language.code, name: t.language.name, detectedLanguage: t.language.detectedLanguage},
          errors: s,
          premiumErrors: a,
          pickyErrors: n,
          premiumPickyErrors: E
        }
      })).catch((s => {
        if (this._isConnectionOrServerIssue(s)) {
          this._abortCheckRequest(r.instanceId);
          if (!r.customApiServerUrl && !this._useFallbackServerForTextLevelRequests) return this._useFallbackServerForTextLevelRequests = !0, this._mainServerUnavailabilityTimeStamp = Date.now(), this.checkTextLevel(e, t, r)
        }
        throw s
      }))
    }))
  }

  static checkParagraphLevel(e, t, r, s = !1) {
    return __awaiter(this, void 0, void 0, (function* () {
      e.forEach((e => {
        e.text = this._prepareText(e.text)
      }));
      if (!e.some((e => !!e.text.trim()))) return {
        language: t,
        errors: [],
        premiumErrors: [],
        pickyErrors: [],
        premiumPickyErrors: [],
        isIncompleteResult: !1
      };
      this._abortParagraphLevelCheckRequest(r.instanceId), this._paragraphLevelAbortControllers.set(r.instanceId, new AbortController), this._useFallbackServerForParagraphLevelRequests && Date.now() - this._mainServerUnavailabilityTimeStamp >= config.MAIN_SERVER_RECHECK_INTERVAL && (this._useFallbackServerForParagraphLevelRequests = !1);
      const i = this._getServerFullUrl(r, !0), a = this._joinInChunks(e), n = [];
      for (const e of a) {
        const a = e.map((e => e.text)).join("\n\n"), E = a.normalize(), o = {
          method: "post",
          mode: "cors",
          credentials: "omit",
          body: this._getParagraphLevelCheckRequestData(E, t, r, s),
          signal: this._paragraphLevelAbortControllers.get(r.instanceId).signal
        }, _ = this._sendRequest(i, o).then((t => {
          const {language: s, warnings: i, sentenceRanges: n} = t,
            o = (n || []).map((([e, t]) => ({start: e, end: t, length: t - e}))),
            _ = this._processResponse(t, this._trimSentenceRanges(o, E), E, a, r, !0), {
              errors: l,
              premiumErrors: u,
              pickyErrors: c,
              premiumPickyErrors: h
            } = _;
          let A = __rest(_, ["errors", "premiumErrors", "pickyErrors", "premiumPickyErrors"]).sentenceRanges;
          const R = this._correctErrorOffsets(e, l), N = this._correctErrorOffsets(e, u),
            I = this._correctErrorOffsets(e, c), p = this._correctErrorOffsets(e, h);
          return A = this._correctErrorOffsets(e, A), {
            language: {code: s.code, name: s.name},
            errors: R,
            premiumErrors: N,
            pickyErrors: I,
            premiumPickyErrors: p,
            isIncompleteResult: !!i && i.incompleteResults,
            sentenceRanges: A
          }
        }));
        n.push(_)
      }
      return Promise.all(n).then((e => ({
        language: e[0].language,
        errors: Array.prototype.concat.apply([], e.map((e => e.errors))),
        premiumErrors: Array.prototype.concat.apply([], e.map((e => e.premiumErrors))),
        premiumPickyErrors: Array.prototype.concat.apply([], e.map((e => e.premiumPickyErrors))),
        pickyErrors: Array.prototype.concat.apply([], e.map((e => e.pickyErrors))),
        isIncompleteResult: e.some((e => e.isIncompleteResult)),
        sentenceRanges: Array.prototype.concat.apply([], e.filter((e => Boolean(e.sentenceRanges))).map((e => e.sentenceRanges)))
      }))).catch((i => {
        if (this._isConnectionOrServerIssue(i)) {
          this._abortParagraphLevelCheckRequest(r.instanceId);
          if (!r.customApiServerUrl && !this._useFallbackServerForParagraphLevelRequests) return this._useFallbackServerForParagraphLevelRequests = !0, this._mainServerUnavailabilityTimeStamp = Date.now(), this.checkParagraphLevel(e, t, r, s)
        }
        throw i
      }))
    }))
  }

  static detectLanguage(e, t, r) {
    return __awaiter(this, void 0, void 0, (function* () {
      if (e = this._prepareText(e), t || !e.trim() || /^( *\n)* *$/g.test(e)) return {
        language: t,
        errors: [],
        premiumErrors: [],
        pickyErrors: [],
        premiumPickyErrors: []
      };
      this._abortLanguageDetectionRequest(r.instanceId), this._languageDetectionAbortControllers.set(r.instanceId, new AbortController), this._useFallbackServerForLanguageDetection && Date.now() - this._mainServerUnavailabilityTimeStamp >= config.MAIN_SERVER_RECHECK_INTERVAL && (this._useFallbackServerForLanguageDetection = !1);
      const s = e.substr(0, 1e3).normalize(), i = this._getServerFullUrl(r, !1), a = {
        method: "post",
        mode: "cors",
        credentials: "omit",
        body: this._getCheckRequestData(s, t, r),
        signal: this._languageDetectionAbortControllers.get(r.instanceId).signal
      };
      return this._sendRequest(i, a).then((e => ({
        language: {code: e.language.code, name: e.language.name},
        errors: [],
        premiumErrors: [],
        premiumPickyErrors: [],
        pickyErrors: []
      }))).catch((s => {
        if (this._isConnectionOrServerIssue(s)) {
          this._abortLanguageDetectionRequest(r.instanceId);
          if (!r.customApiServerUrl && !this._useFallbackServerForLanguageDetection) return this._useFallbackServerForLanguageDetection = !0, this._mainServerUnavailabilityTimeStamp = Date.now(), this.detectLanguage(e, t, r)
        }
        throw s
      }))
    }))
  }

  static checkForPaidSubscription(e, t, r, s = config.PREMIUM_SERVER_URL) {
    return __awaiter(this, void 0, void 0, (function* () {
      return new Promise(((i, a) => {
        i(false)
        return
        s += s.endsWith("/") ? "check" : "/check";
        const n = new URLSearchParams;
        n.append("language", "en-us"), n.append("data", JSON.stringify({text: "The languagetool testrule 8634756."})), e && t ? (n.append("username", e), n.append("password", t)) : e && r && (n.append("username", e), n.append("tokenV2", r));
        const E = {method: "post", mode: "cors", credentials: "omit", body: n};
        this._sendRequest(s, E).then((e => {
          const t = e.matches.some((e => "PREMIUM_FAKE_RULE" === e.rule.id));
          console.log(t)
          i(t)
        })).catch((e => {
          403 !== e.status ? a(e) : i(!1)
        }))
      }))
    }))
  }
}

Checker.NL_PREMIUM_RULES = ["FAAG_VAAG", "TOO_LONG_SENTENCE", "_2_LEESTEKENS", "WEEKEND", "CASU_QUO", "MOMENTEEL", "SLECHTS", "LEENWOORDEN", "KOMMA_HOOR", "RELEVANT", "HINTS", "CHECKEN", "ALLEEN_BE", "MACHTE", "ECHTER", "COMMUNICEREN", "DESIGN", "SANDAAL_ZANDAAL", "N", "MIDDELS", "INTEGREREN", "PRIMAIR", "OVERIGENS", "BETREFFENDE", "AGENDA", "ERGO", "TEN_BEHOEVE", "KOMMA_AANH", "TM", "IE", "TER_ZAKE", "SIGNIFICANT", "GELIEVE", "BEHOREN", "NAAR_AANLEIDING_VAN", "VAN_PLAN_ZIJN", "HEDEN", "TEN_DODE", "VREEMD_VRZ_HIJ", "DES", "IMPACT", "IMMER", "BOVENSTAAND", "XXXYJE", "DUTCH_WRONG_WORD_IN_CONTEXT", "LANCEREN", "MET_BEHULP_VAN", "PRIORITEIT", "UWENTWEGE", "CATEGORIE", "CRITERIUM", "GEMOTIVEERD"], Checker.PL_PREMIUM_RULES = ["BOWIEM_ZAS", "ZE_Z_SPOL", "SPACJA_ZNAK_ROWNOSCI", "BRAK_PRZECINKA_GDY", "PYTANIE_CO", "BRAK_PRZECINKA_JESLI", "PRZECINEK_ANI", "SKROTOWCE_BEZ_DYWIZU", "NIEZGODNOSC_PRZYPADKU_PO_LICZEBNIKU", "PODMIOT_ORZECZENIE", "ROWNIE_JAK", "JAK_I", "PRZECINEK_POROWNANIE", "WOLACZ_BEZ_PRZECINKA", "ODNOSNIE_DO", "GENERALNIE", "BOWIEM_ZAS_PRZECINEK", "WYDAWAC_SIE_BYC", "POSIADAC_MIEC", "PL_GUILLEMET", "ITP_ITD", "SPACJA_PROCENT", "PO", "W_TEMACIE", "PL_DWA_WYRAZY", "W_NAWIAZANIU_DO", "WE_W", "POKI_CO", "VS", "DZIEN_DZISIEJSZY", "WIELOKROTNE_WYSTPIENIE_TEGO_SAMEGO_WYRAENIA_PRZYIMKOWEGO", "I_LUB", "PELNIC_ROLE", "OKRES_CZASU", "UZNAC_JAKO", "EFEKT_KONCOWY", "DLATEGO_PONIEWAZ", "NA_DZIEN_DZISIEJSZY", "DODATKOWO_CO_WIECEJ", "OWY_W", "DZIEN_JUTRZEJSZY", "ADRES_ZAMIESZKANIA", "W_CHWILI_OBECNEJ", "BYC_ZNAJDOWAC_SIE_W_POSIADANIU", "DO_TERAZ", "PROTOKOL_Z_CZEGO", "PO_NAJMNIEJSZEJ_LINII", "POTRAFIACY", "zarowno_jak_rowniez", "GRAC_FAIR_PLAY", "DRUGI_NAJWIEKSZY", "COFAC_SIE_DO_TYLU", "DZIEN_WCZORAJSZY", "NA_PRZESTRZENI", "IDENTYCZNY_JAK", "ZA_WYJATKIEM", "MAPA_DROGOWA", "W_PRZECIGU_TYGODNIA_W_CIGU", "NAPOTKAC_NA", "PRZERWA_KAWOWA", "WYSOKA_FREKWENCJA", "UBRAC_ZALOZYC", "PRZY_UDZIALE", "W_SLAD_ZA", "WYRAZIC_POPARCIE", "W_TYM_WZGLEDZIE", "PO_PIERWSZE_PRIMO", "DOMYSLEC_SIE", "WARTY", "IDENTYCZNY_DO", "W_DRODZE_WYJATKU", "PRZEDKLADAC_WNIOSEK", "POD_RZAD", "PRZYJAZNY_DLA_UZYTKOWNIKA", "NA_WSKUTEK", "SWIECIC_SUKCESY", "W_WEGRZECH", "KONDYCJA_FINANSOWA", "RULE_NIEMNIEJ", "FORMULA_KREMU", "PODDAWAC_W_WATPLIWOSC", "OPATRZEC_SIE", "ODGRYWAC_ZNACZENIE", "INFORMACJE_WRAZLIWE", "DO_DZIS_DZIEN", "CO_I_RAZ", "OKRAGLY_ROK", "SZERSZE_INFORMACJE", "WYSOKA_FORMA", "CZEKAC_ZA", "BYNAJMNIEJ", "WYWIERAC_PIETNO", "DOPATRZEC_SIE", "ZLA_RENOMA", "W_PELNYM_TEGO", "W_KAZDYM_BADZ", "KOSZTOWAC_TANIEJ", "DYGITALNY"], Checker.SPELLING_RULES_ID = ["SPELLER_RULE", "MORFOLOGIK_RULE", "HUNSPELL", "SPELLING_RULE"], Checker.STYLE_ISSUE_TYPES = ["style", "locale-violation", "register"], Checker.EMAIL_SIGNATURE_SEPARATOR_REGEXP = /^[\‐|\-]{2,}|[\‐|\-]{2,}$/, Checker.ONLY_NUMBERS_REGEXP = /^[0-9]+$/, Checker.COLON_WHITESPACE_REGEXP = /^[;:]\s/, Checker.ONE_LETTER_AT_END_REGEXP = /\b[a-z]\.?\s?$/i, Checker.NUMBER_WITH_DOT_AT_END_REGEXP = /\d\.?\s?$/, Checker.NUMBER_WITH_PARENTHESIS_AT_END_REGEXP = /\d\.?\)\s$/, Checker.PUNCTUATION_AT_END = /(\.|\!)$/, Checker.BULLET_POINT_REGEXP = /(\u25b6\ufe0e|\u25BA|\*|-|–|\u2606|\u2605|\u25cf|\u2022|\u25e6|\u27A4|\u2714)\s+$/, Checker.LOWERCASE_REGEXP = /[a-z]/, Checker.DOT_WITH_PREFIX_REGEXP = /\w\.$/, Checker.SLASH_AT_END_REGEXP = /(\/|\\)$/, Checker.AT_LEAST_TWO_LETTERS_AT_END_REGEXP = /[a-z]{2}$/i, Checker.SLASH_AT_BEGINNING_REGEXP = /^(\/|\\)/, Checker.QUOTE_AT_END_REGEXP = /[\"\“\”\„]$/, Checker.QUOTE_AT_BEGINNING_REGEXP = /^[\"\“\”\„]/, Checker.PUNCTUATION_AT_BEGINNING_REGEXP = /^\s?[\.\!\?,:…]/, Checker.PUNCTUATION_SPACE_AT_END_REGEXP = /[\.…\?\!]\s+/, Checker.MARKDOWN_HEADLINE_REGEXP = /^#{1,6}\s/m, Checker.MARKDOWN_INLINE_FORMAT_AT_BEGINNING_REGEXP = /^[\*\~\_\^\+\%\@]/m, Checker.WIKI_MARKUP_AT_END_REGEXP = /\[\[[a-z]+$/, Checker.PIPE_AT_END_REGEXP = /\|\s+$/, Checker.MENTION_SYMBOL_AT_BEGINNING_REGEXP = /@[a-z\.\-]*$/i, Checker.HASH_SYMBOL_AT_BEGINNING_REGEXP = /#[a-z\.\-]*$/i, Checker.EMOJI_SENTENCE_START_REGEXP = /(\.|!|\?|^)\s?(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])\s+/, Checker.ABBREVIATION_AT_END_REGEXP = /(\s|\(|^)[A-Z]\.$/, Checker.NET_AT_BEGINNING_REGEXP = /^net\b/i, Checker.SINGLE_UPPERCASE_LETTER_REGEXP = /^[A-Z]$/, Checker.HTML_ENTITIES = ["amp", "nbsp", "gt", "lt", "bull", "euro", "copy", "laquo", "raquo", "hellip", "middot"], Checker.HTML_ENTITIES_WITH_AND = Checker.HTML_ENTITIES.map((e => `&${e}`)), Checker.WAVY_DASH_REGEXP = /^\u3030+$/, Checker.ZWS_REGEXP = /^\uFEFF+$/, Checker.ZWNJ_REGEXP = /\u200B|\u200C/g, Checker.ZWS = "\ufeff", Checker.MID_SENTENCE_LINE_BREAK = /[\wáàâóòìíéèùúâôîêûäöüß,\)][\u0020\u00A0\uFEFF]*\n\n\n?[\u0020\u00A0\uFEFF]*$/, Checker.COMMON_TLDS = ["com", "co", "org", "net", "de", "info", "biz", "es", "fr", "be", "in", "gov", "nl", "ca", "com.br", "br", "at", "us", "au", "ru", "pl", "ly", "it", "cat", "edu", "jp", "ko", "cn", "se", "no", "mil", "ch", "dk", "com.mx", "mx", "eu", "co.uk", "uk", "ir", "cz", "ua", "kr", "gr", "tw", "nz", "co.nz", "za", "ro", "vn", "io", "tr", "me", "fi", "tv", "xyz", "pt", "ie", "app"], Checker.COMMON_TLD_WITH_DOT_REGEXPS = Checker.COMMON_TLDS.map((e => new RegExp(`^\\.${e.replace(".","\\.")}\\b`, "i"))), Checker.COMMON_FILE_TYPES = ["jpeg", "jpg", "gif", "png", "bmp", "svg", "ai", "sketch", "ico", "ps", "psd", "tiff", "tif", "mp3", "wav", "midi", "mid", "aif", "mpa", "ogg", "wma", "wpl", "cda", "7z", "arj", "deb", "pkg", "plist", "rar", "rpm", "tar.gz", "tar", "zip", "bin", "dmg", "iso", "toast", "vcd", "csv", "dat", "db", "log", "mdb", "sav", "sql", "xml", "apk", "bat", "bin", "cgi", "com", "exe", "gadget", "jar", "py", "js", "jsx", "json", "wsf", "ts", "tsx", "fnt", "fon", "otf", "ttf", "woff", "woff2", "rb", "java", "php", "html", "asp", "aspx", "cer", "cfm", "cgi", "pl", "css", "scss", "htm", "jsp", "part", "rss", "xhtml", "key", "odp", "pps", "ppt", "pptx", "class", "cpp", "cs", "h", "sh", "swift", "vb", "ods", "odt", "xlr", "xls", "xlsx", "xlt", "xltx", "bak", "cab", "cfg", "cpl", "cur", "dll", "dmp", "msi", "ini", "tmp", "3g2", "3gp", "avi", "flv", "h264", "m4v", "mkv", "mov", "mp4", "mpg", "mpeg", "rm", "swf", "vob", "wmv", "doc", "docx", "dot", "dotx", "pdf", "rtf", "srx", "text", "tex", "wks", "wps", "wpd", "txt", "yaml", "yml", "csl", "md", "adm"], Checker.COMMON_FILE_TYPE_WITH_DOT_REGEXPS = Checker.COMMON_FILE_TYPES.map((e => new RegExp(`^[\\wáàâóòìíéèùúâôîêûäöüß\\-\\.\\(\\)]*?\\.${e}\\b`, "i"))), Checker.FILE_TYPE_AT_BEGINNING_REGEXP = new RegExp(`(${Checker.COMMON_FILE_TYPES.join("|")})\b`, "i"), Checker._textLevelAbortControllers = new Map, Checker._paragraphLevelAbortControllers = new Map, Checker._languageDetectionAbortControllers = new Map, Checker._useFallbackServerForTextLevelRequests = !1, Checker._useFallbackServerForParagraphLevelRequests = !1, Checker._useFallbackServerForLanguageDetection = !1, Checker._mainServerUnavailabilityTimeStamp = 0, Checker._checkForException = e => e.ok ? e : e.text().catch((() => "")).then((t => {
  const r = t.toLowerCase();
  if (r.includes("too many error")) throw{reason: "TooManyErrors", status: e.status, response: t};
  if (413 === e.status || r.includes("text exceeds the limit")) throw{
    reason: "TextTooLong",
    status: e.status,
    response: t
  };
  if (t.toLowerCase().includes("checking took longer than")) throw{
    reason: "TimeoutError",
    status: e.status,
    url: e.url ? e.url.replace(/\?.*/, "?...") : "unknown",
    response: t
  };
  if (429 === e.status) throw{reason: "TooManyRequests", status: e.status, response: t};
  if (403 === e.status) {
    if (r.includes("client request size limit") || r.includes("client request limit") || r.includes("ip request limit") || r.includes("ip request size limit")) throw{
      reason: "TooManyRequests",
      status: e.status,
      response: t
    };
    if (r.includes("authexception")) throw{reason: "InvalidCredentials", status: e.status, response: t};
    throw{reason: "AccessDenied", status: e.status, response: t}
  }
  if (r.includes("checking took longer than")) throw{
    reason: "TimeoutError",
    status: e.status,
    url: e.url ? e.url.replace(/\?.*/, "?...") : "unknown",
    response: t
  };
  throw{reason: "UnknownError", status: e.status, response: t}
}));