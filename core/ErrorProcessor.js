class ErrorProcessor {
  static merge(r, e = !1) {
    let {
      errors: t,
      pickyErrors: s,
      premiumErrors: i,
      premiumPickyErrors: a,
      sentenceRanges: o = []
    } = this.filterAndMigrateErrors(r.existing.errors, r.existing.pickyErrors, r.existing.premiumErrors, r.existing.premiumPickyErrors, r.existing.sentenceRanges, r.existingCheckedText, r.newCheckedText);
    this.mergeParagraphLevelErrors(t, s, i, a, o, r.new.paragraphLevel.errors, r.new.paragraphLevel.pickyErrors, r.new.paragraphLevel.premiumErrors, r.new.paragraphLevel.premiumPickyErrors, r.new.paragraphLevel.sentenceRanges), this.mergeTextLevelErrors(t, s, i, a, r.new.textLevel.errors, r.new.textLevel.pickyErrors, r.new.textLevel.premiumErrors, r.new.textLevel.premiumPickyErrors);
    const n = this.getDuplicateErrors(r.existing, r.existingCheckedText, r.newCheckedText);
    return this.sortErrors(t, s, i, a), this.setIdsOnErrors(t, s, i, a, n), t = this.migrateErrorsToOriginalText(t, r.newCheckedText.usedParts), s = this.migrateErrorsToOriginalText(s, r.newCheckedText.usedParts), i = this.migrateErrorsToOriginalText(i, r.newCheckedText.usedParts), a = this.migrateErrorsToOriginalText(a, r.newCheckedText.usedParts), o = this.migrateErrorsToOriginalText(o, r.newCheckedText.usedParts), e && (s = s.filter((r => !config.PICKY_RULES_THAT_ARE_CONSIDERED_ANNOYING.includes(r.rule.id))), s.forEach((r => {
      r.rule.id = "HIDDEN_RULE", r.fixes = []
    })), i = [...i, ...a, ...s], a = [], s = [], this.sortErrorsByOffset(i)), {
      errors: t,
      pickyErrors: s,
      premiumErrors: i,
      premiumPickyErrors: a,
      sentenceRanges: o
    }
  }

  static getDuplicateErrors(r, e, t) {
    let {errors: s, pickyErrors: i, premiumErrors: a, premiumPickyErrors: o} = r;
    s = this.migrateErrorsToValuableText(s, e.usedParts), i = this.migrateErrorsToValuableText(i, e.usedParts), a = this.migrateErrorsToValuableText(a, e.usedParts), o = this.migrateErrorsToValuableText(o, e.usedParts);
    const n = getParagraphsDiff(e.text, t.text), c = r => {
      if (!r.isParagraphLevelCheck) return !0;
      const e = binarySearch(n, (e => {
        const t = e.oldOffset;
        if (null === e.oldText) return r.start >= t ? 1 : -1;
        const s = e.oldOffset + e.oldText.length + 1;
        return compareNumberAndSegment(r.start, t, s, !0)
      }));
      return !(!e || !e.textDiff) || void 0
    };
    return s = s.filter(c), i = i.filter(c), a = a.filter(c), o = o.filter(c), s = this.migrateErrorsBetweenTexts(s, n), i = this.migrateErrorsBetweenTexts(i, n), a = this.migrateErrorsBetweenTexts(a, n), o = this.migrateErrorsBetweenTexts(o, n), {
      errors: s,
      pickyErrors: i,
      premiumErrors: a,
      premiumPickyErrors: o
    }
  }

  static migrateErrorsToValuableText(r, e) {
    const t = [];
    for (const s of r) {
      const r = binarySearch(e, (r => compareNumberAndSegment(s.start, r.originalStart, r.originalEnd, !0))),
        i = binarySearch(e, (r => compareNumberAndSegment(s.end, r.originalStart, r.originalEnd)));
      if (!r || !i) continue;
      const a = deepClone(s);
      a.start -= r.posDiff, a.end -= i.posDiff, a.length = a.end - a.start, t.push(a)
    }
    return t
  }

  static migrateErrorsBetweenTexts(r, e, t, s) {
    let i, a = !1;
    "string" == typeof e && "string" == typeof t ? (i = getParagraphsDiff(e, t), a = "boolean" == typeof s && s) : (i = e, a = "boolean" == typeof t && t);
    const o = [];
    for (const e of r) {
      const r = binarySearch(i, (r => {
        const t = r.oldOffset;
        if (null === r.oldText) return e.start >= t ? 1 : -1;
        const s = r.oldOffset + r.oldText.length + 1;
        return compareNumberAndSegment(e.start, t, s, !0)
      })), t = deepClone(e);
      if (r) {
        if (r.textDiff) {
          if (a) continue;
          {
            const e = r.oldOffset + r.textDiff.from, s = e + r.textDiff.oldFragment.length;
            if (isIntersect(e, s, t.start, t.end, !0)) continue;
            if (t.start >= s) {
              const e = r.textDiff.newFragment.length - r.textDiff.oldFragment.length;
              t.start += e, t.end += e
            }
          }
        }
        t.start += r.newOffset - r.oldOffset, t.end = t.start + t.length
      }
      o.push(t)
    }
    return o
  }

  static migrateErrorsToOriginalText(r, e) {
    const t = [];
    for (const s of r) {
      const r = binarySearch(e, (r => compareNumberAndSegment(s.start, r.start, r.end, !0))),
        i = binarySearch(e, (r => compareNumberAndSegment(s.end, r.start, r.end)));
      if (!r || !i) continue;
      const a = deepClone(s);
      a.start += r.posDiff, a.end += i.posDiff, a.length = a.end - a.start, t.push(a)
    }
    return t
  }

  static filterAndMigrateErrors(r, e, t, s, i, a, o) {
    r = r.filter((r => r.isParagraphLevelCheck)), e = e.filter((r => r.isParagraphLevelCheck)), t = t.filter((r => r.isParagraphLevelCheck)), s = s.filter((r => r.isParagraphLevelCheck)), r = this.migrateErrorsToValuableText(r, a.usedParts), e = this.migrateErrorsToValuableText(e, a.usedParts), t = this.migrateErrorsToValuableText(t, a.usedParts), s = this.migrateErrorsToValuableText(s, a.usedParts), i = this.migrateErrorsToValuableText(i || [], a.usedParts);
    const n = getParagraphsDiff(a.text, o.text);
    return {
      errors: r = this.migrateErrorsBetweenTexts(r, n, !0),
      pickyErrors: e = this.migrateErrorsBetweenTexts(e, n, !0),
      premiumErrors: t = this.migrateErrorsBetweenTexts(t, n, !0),
      premiumPickyErrors: s = this.migrateErrorsBetweenTexts(s, n, !0),
      sentenceRanges: i = this.migrateErrorsBetweenTexts(i, n, !0)
    }
  }

  static mergeParagraphLevelErrors(r, e, t, s, i, a, o, n, c, f = []) {
    r.push(...a), e.push(...o), t.push(...n), s.push(...c), i.push(...f)
  }

  static mergeTextLevelErrors(r, e, t, s, i, a, o, n) {
    for (const e of i) r.some((r => r.start === e.start && r.end === e.end)) || r.push(e);
    for (const r of a) e.some((e => e.start === r.start && e.end === r.end)) || e.push(r);
    for (const r of o) t.some((e => e.start === r.start && e.end === r.end)) || t.push(r);
    for (const r of n) s.some((e => e.start === r.start && e.end === r.end)) || s.push(r)
  }

  static sortErrors(r, e, t, s) {
    this.sortErrorsByOffset(r), this.sortErrorsByOffset(e), this.sortErrorsByOffset(t), this.sortErrorsByOffset(s)
  }

  static sortErrorsByOffset(r) {
    r.sort(((r, e) => r.start === e.start ? r.isParagraphLevelCheck ? 1 : -1 : r.start > e.start ? 1 : -1))
  }

  static migrateErrorsBetweenSameOriginalTexts(r, e, t) {
    const s = [];
    for (const i of r) {
      let r = i.start, a = i.end,
        o = binarySearch(e.usedParts, (e => compareNumberAndSegment(r, e.originalStart, e.originalEnd, !0))),
        n = binarySearch(e.usedParts, (r => compareNumberAndSegment(a, r.originalStart, r.originalEnd)));
      if (!o || !n) continue;
      if (r -= o.posDiff, a -= n.posDiff, o = binarySearch(t.usedParts, (e => compareNumberAndSegment(r, e.start, e.end, !0))), n = binarySearch(t.usedParts, (r => compareNumberAndSegment(a, r.start, r.end))), !o || !n) continue;
      r += o.posDiff, a += n.posDiff;
      const c = deepClone(i);
      c.start = r, c.end = a, c.length = a - r, s.push(c)
    }
    return s
  }

  static setIdsOnErrors(r, e, t, s, i) {
    function a(r, e) {
      if (r.id) return;
      const t = e.find((e => {
        return s = r, (t = e).start === s.start && t.end === s.end && t.isParagraphLevelCheck === s.isParagraphLevelCheck;
        var t, s
      }));
      r.id = t ? t.id : "error:" + ++ErrorProcessor.INCREMENTAL_ID
    }

    r.forEach((r => a(r, i.errors))), e.forEach((r => a(r, i.pickyErrors))), t.forEach((r => a(r, i.premiumErrors))), s.forEach((r => a(r, i.premiumPickyErrors)))
  }
}

ErrorProcessor.INCREMENTAL_ID = 0;