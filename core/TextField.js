class TextField {
  constructor(r) {
    this.language = null, this.forceLanguage = !1, this.errors = [], this.currentErrors = [], this.pickyErrors = [], this.premiumErrors = [], this.currentPremiumErrors = [], this.premiumPickyErrors = [], this.textPartsToIgnore = [], this.dictionary = [], this.ignoredRules = [], this.config = r, this.instanceId = r.instanceId, this.currentText = getValuableText("", this.textPartsToIgnore), this.checkedText = getValuableText("", this.textPartsToIgnore), this.dictionary = [...this.config.dictionary]
  }

  setText(r) {
    this.currentText = getValuableText(r, this.textPartsToIgnore), this.updateErrors()
  }

  getErrors() {
    return {
      errors: this.currentErrors,
      pickyErrors: this.pickyErrors,
      premiumErrors: this.currentPremiumErrors,
      premiumPickyErrors: this.premiumPickyErrors
    }
  }

  updateErrors() {
    this.currentErrors = ErrorProcessor.migrateErrorsBetweenTexts(this.errors, this.checkedText.originalText, this.currentText.originalText), this.currentErrors = this.currentErrors.filter((r => !isErrorIgnoredByDictionary(r, this.dictionary) && !isErrorRuleIgnored(r, this.ignoredRules))), this.currentPremiumErrors = ErrorProcessor.migrateErrorsBetweenTexts(this.premiumErrors, this.checkedText.originalText, this.currentText.originalText)
  }

  setLanguage(r, e = "") {
    this.language = {code: r, name: e}, this.forceLanguage = !0
  }

  getLanguage() {
    return this.language
  }

  check(r) {
    if (this.currentText.text && this.currentText.text === this.checkedText.text) return Promise.resolve(this.getErrors());
    const e = this.currentText, t = [];
    !0 === r || void 0 === r && e.text.length < config.TEXT_LEVEL_MAX_LENGTH_PER_REQUEST ? t.push(Checker.checkTextLevel(e.text, this.forceLanguage ? this.language : null, this.config)) : t.push(Checker.detectLanguage(e.text, this.forceLanguage ? this.language : null, this.config));
    const s = TextField.getChangedParagraphs(this.checkedText.text, e.text);
    return t.push(Checker.checkParagraphLevel(s, this.language, this.config, !this.forceLanguage)), Promise.all(t).then((([t, s]) => this.language && t.language && t.language.code.toLowerCase() !== this.language.code.toLowerCase() ? (this.forceLanguage = !1, this.language = null, this.check(r)) : this.handleResponse(e, t, s)))
  }

  ignoreWord(r) {
    this.dictionary.includes(r) || (this.dictionary.push(r), this.updateErrors())
  }

  ignoreRule(r) {
    this.ignoredRules.push(r), this.updateErrors()
  }

  handleResponse(r, e, t) {
    this.language = e.language || this.language;
    const {
      errors: s,
      pickyErrors: i,
      premiumErrors: o,
      premiumPickyErrors: h
    } = ErrorProcessor.merge({
      existing: {
        errors: this.errors,
        pickyErrors: this.pickyErrors,
        premiumErrors: this.premiumErrors,
        premiumPickyErrors: this.premiumPickyErrors
      },
      new: {
        textLevel: {
          errors: e.errors,
          pickyErrors: e.pickyErrors,
          premiumErrors: e.premiumErrors,
          premiumPickyErrors: e.premiumPickyErrors
        },
        paragraphLevel: {
          errors: t.errors,
          pickyErrors: t.pickyErrors,
          premiumErrors: t.premiumErrors,
          premiumPickyErrors: t.premiumPickyErrors
        }
      },
      existingCheckedText: this.checkedText,
      newCheckedText: r
    });
    return this.checkedText = r, this.errors = s, this.pickyErrors = i, this.premiumErrors = o, this.premiumPickyErrors = h, this.updateErrors(), this.getErrors()
  }

  static getChangedParagraphs(r, e) {
    return getParagraphsDiff(r, e).filter((r => r.oldText !== r.newText && null !== r.newText)).map((r => ({
      text: r.newText,
      offset: r.newOffset
    })))
  }
}