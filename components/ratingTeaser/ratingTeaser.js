class RatingTeaser {
  constructor(e, t, a) {
    this._parentElement = e, this._componentName = t, this._url = a, this._document = e.ownerDocument, this._storageController = StorageController.create(), this._element = this._document.createElement("lt-div"), this._element.className = "lt-rating-teaser", this._parentElement.appendChild(this._element), this.render()
  }

  _sendRating(e) {
    Tracker.trackEvent("Stat", `rating:${LanguageManager.getPrimaryLanguageCode(navigator.language)}`, e), this._storageController.updateStatistics({ratingValue: e}), this._storageController.updateUIState({hasRated: !0}), "like" === e ? BrowserDetector.isChrome() || BrowserDetector.isFirefox() || BrowserDetector.isOpera() || BrowserDetector.isEdge() || BrowserDetector.isSafari() ? this._showReviewContainer() : this._showThanksContainer() : "dislike" === e && (this._showThanksContainer(), this._openFeedbackForm(i18nManager.getMessage("ratingUnhappyQuestion")), Tracker.trackEvent("Stat", "dislike_host", getCurrentDomain()))
  }

  _showReviewContainer() {
    this._element.classList.remove("lt-rating-teaser--thanks-visible"), this._element.classList.add("lt-rating-teaser--review-visible")
  }

  _showThanksContainer() {
    this._element.classList.remove("lt-rating-teaser--review-visible"), this._element.classList.add("lt-rating-teaser--thanks-visible")
  }

  _openFeedbackForm(e) {
    EnvironmentAdapter.openFeedbackForm(this._url, e)
  }

  render() {
    const e = this._document.createElement("lt-div");
    e.className = "lt-rating-teaser__intro", this._element.appendChild(e);
    const t = this._document.createElement("lt-div");
    t.className = "lt-rating-teaser__intro__question";
    const a = this._document.createElement("lt-div");
    a.className = "lt-rating-teaser__intro__headline", a.innerText = browser.i18n.getMessage("ratingHeadline"), t.appendChild(a);
    const r = this._document.createElement("lt-div");
    r.innerText = browser.i18n.getMessage("ratingText"), t.appendChild(r), e.appendChild(t);
    const s = this._document.createElement("lt-div");
    s.className = "lt-rating-teaser__intro__options";
    const i = this._document.createElement("lt-div");
    i.className = "lt-rating-teaser__intro__option", i.setAttribute("data-lt-emotion", "like"), s.appendChild(i);
    const n = this._document.createElement("lt-div");
    n.className = "lt-rating-teaser__intro__option", n.setAttribute("data-lt-emotion", "dislike"), s.appendChild(n), e.appendChild(s);
    const o = this._document.createElement("a");
    o.target = "_blank", o.rel = "noreferrer noopener", o.className = "lt-rating-teaser__review", this._element.appendChild(o);
    const l = this._document.createElement("lt-div");
    l.className = "lt-rating-teaser__review__text", o.appendChild(l), BrowserDetector.isFirefox() ? translateElement(l, "reviewFirefoxHeadline") : BrowserDetector.isOpera() ? translateElement(l, "reviewOperaHeadline") : BrowserDetector.isEdge() ? translateElement(l, "reviewEdgeHeadline") : BrowserDetector.isSafari() ? translateElement(l, "reviewSafariHeadline") : translateElement(l, "reviewChromeHeadline");
    const c = this._document.createElement("lt-a");
    c.className = "lt-rating-teaser__review__link", c.innerText = browser.i18n.getMessage("reviewLink"), o.appendChild(c);
    const d = this._document.createElement("lt-div");
    d.className = "lt-rating-teaser__thanks", d.innerText = browser.i18n.getMessage("ratingThankYou"), this._element.appendChild(d), i.addEventListener("click", (() => this._sendRating("like"))), n.addEventListener("click", (() => this._sendRating("dislike"))), o.addEventListener("click", (() => {
      Tracker.trackEvent("Action", "dialog:rating_teaser:click")
    })), BrowserDetector.isChrome() ? (this._element.classList.add("lt-rating-teaser--chrome"), o.href = "https://chrome.google.com/webstore/detail/grammar-and-spell-checker/oldceeleldhonbafppcapldpdifcinji/reviews") : BrowserDetector.isFirefox() ? (this._element.classList.add("lt-rating-teaser--firefox"), o.href = "https://addons.mozilla.org/firefox/addon/languagetool/") : BrowserDetector.isOpera() ? (this._element.classList.add("lt-rating-teaser--opera"), o.href = "https://addons.opera.com/extensions/details/grammar-and-spell-checker-languagetool/") : BrowserDetector.isEdge() ? (this._element.classList.add("lt-rating-teaser--edge"), o.href = "https://microsoftedge.microsoft.com/addons/detail/hfjadhjooeceemgojogkhlppanjkbobc") : BrowserDetector.isSafari() && (this._element.classList.add("lt-rating-teaser--safari"), o.href = "https://appstoreconnect.apple.com/apps/1534275760/appstore"), Tracker.trackEvent("Action", `${this._componentName}:rating_teaser`)
  }
}