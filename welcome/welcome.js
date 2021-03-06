/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
var __awaiter = this && this.__awaiter || function (e, n, t, a) {
  return new (t || (t = Promise))((function (o, i) {
    function r(e) {
      try {
        c(a.next(e))
      } catch (e) {
        i(e)
      }
    }

    function g(e) {
      try {
        c(a.throw(e))
      } catch (e) {
        i(e)
      }
    }

    function c(e) {
      var n;
      e.done ? o(e.value) : (n = e.value, n instanceof t ? n : new t((function (e) {
        e(n)
      }))).then(r, g)
    }

    c((a = a.apply(e, n || [])).next())
  }))
};
let sloganElement, messageElement, footerElement, privacyLinkElement, confirmButtonElement, progressIndicatorElement,
  languageSelectorDot, visibleLanguages, country;
const ALLOWED_HOSTS = ["localhost", "languagetoolplus.com", "languagetool.com", "www.languagetoolplus.com", "www.languagetool.com", "languagetool.org", "www.languagetool.org"],
  BODY_ATTRS = {"data-lt-adjust-appearance": "true", "data-lt-force-appearance": "default"},
  _ = (e, n) => Object.assign(document.createElement(e), n), isInvalidPage = () => {
    const e = ALLOWED_HOSTS.includes(location.hostname) || null !== location.protocol.match(/^(chrome|moz)-extension/),
      n = null !== document.querySelector("meta[name=lt-webextension-install-page]");
    return !(e && n)
  }, initializeStorageController = () => new Promise((e => StorageController.create().onReady((n => e(n))))),
  closeTab = () => {
    browser.runtime.sendMessage({command: "CLOSE_CURRENT_TAB"})
  }, getInitialLanguagesList = (e, n) => {
    const t = e => n.map((e => ({
      checked: !0,
      code: e
    }))).concat(e).filter((({code: e}, n, t) => t.findIndex((({code: n}) => n === e)) === n));
    switch (e) {
      case"BE":
        return t([{code: "fr", checked: !0}, {code: "nl", checked: !0}, {code: "de", checked: !1}]);
      case"CA":
        return t([{code: "en", checked: !0}, {code: "fr", checked: !0}]);
      case"CH":
        return t([{code: "fr", checked: !0}, {code: "de", checked: !0}, {code: "it", checked: !0}]);
      case"ES":
        return t([{code: "es", checked: !0}, {code: "ca", checked: !0}, {code: "gl", checked: !1}, {
          code: "oc",
          checked: !1
        }, {code: "eu", checked: !1}]);
      case"UA":
        return t([{code: "uk", checked: !0}, {code: "ru", checked: !1}]);
      case"US":
        return t([{code: "en", checked: !0}, {code: "es", checked: !0}, {code: "fr", checked: !1}, {
          code: "de",
          checked: !1
        }]);
      default:
        return []
    }
  }, getLanguageNameByCode = e => {
    const n = i18nManager.getMessage(e), t = LanguageManager.ALL_LANGUAGES.find((({code: n}) => e === n));
    return n || (null == t ? void 0 : t.name) || null
  }, createLanguageCheckbox = (e, n, t = !1) => {
    let a = `<input type="checkbox" name="lang-${n}" class="language-selector__input" id="lang-${n}" value="${n}" ${t ? "checked " : ""}/>`;
    a += `<span class="language-selector__item language-selector__item--${n}">`, a += e, a += "</span>";
    return _("label", {for: "lang-${value}", innerHTML: a})
  }, createLanguageSelect = () => {
    const e = i18nManager.getMessage("addLanguage"), n = _("select"),
      t = _("optgroup", {label: i18nManager.getMessage("settingsPreferredLanguagesPopularList")}),
      a = _("optgroup", {label: i18nManager.getMessage("settingsPreferredLanguagesCompleteList")});
    for (const e of LanguageManager.POPULAR_LANGUAGES) {
      if (Boolean(visibleLanguages.find((({code: n}) => n === e)))) continue;
      const n = getLanguageNameByCode(e);
      n && t.appendChild(_("option", {textContent: n, value: e}))
    }
    for (const {
      code: e,
      name: n
    } of LanguageManager.ALL_LANGUAGES) Boolean(visibleLanguages.find((({code: n}) => n === e))) || a.appendChild(_("option", {
      textContent: n,
      value: e
    }));
    const o = _("div", {className: "language-selector__select lt-icon lt-icon__add-circle", title: e});
    return n.appendChild(_("option", {textContent: e})), [t, a].filter((({children: {length: e}}) => e)).forEach((e => {
      n.appendChild(e)
    })), o.appendChild(n), o
  }, addLanguageToItems = e => {
    const n = e.value, t = messageElement.querySelector(`#lang-${n}`), a = e.form;
    if (e.value = "", t || !a) return;
    const o = e.parentNode,
      i = e.querySelectorAll("option"), {textContent: r} = Array.from(i).find((({value: e}) => e === n)) || {};
    if (r && o) {
      const e = createLanguageCheckbox(r, n, !0);
      a.insertBefore(e, o), visibleLanguages.push({checked: !0, code: n}), a.replaceChild(createLanguageSelect(), o)
    }
  }, updateVisibleLanguagesList = (e, n) => {
    const t = visibleLanguages.find((({code: n}) => n === e));
    t && Object.assign(t, {checked: n})
  }, handleLanguageSelectorChange = e => {
    if (e.target instanceof HTMLSelectElement && (Tracker.trackEvent("Action", "onboarding_language:add", `${country}:${e.target.value}`), addLanguageToItems(e.target)), e.target instanceof HTMLInputElement && "checkbox" === e.target.type) {
      const n = e.target.checked ? "add" : "remove";
      Tracker.trackEvent("Action", `onboarding_language:${n}`, `${country}:${e.target.value}`), updateVisibleLanguagesList(e.target.value, e.target.checked)
    }
  }, onConfirmLanguagesClick = e => {
    const {preferredLanguages: n, geoIpCountry: t} = e.getSettings(),
      a = visibleLanguages.filter((({checked: e}) => e)).map((({code: e}) => e)),
      o = n.concat(LanguageManager.getUserLanguageCodes()).concat(a).concat(["en"]), i = a.sort().join(",");
    messageElement.removeEventListener("change", handleLanguageSelectorChange), Tracker.trackEvent("Action", "onboarding_language:select", `${t}:${i}`), e.updateSettings({preferredLanguages: uniq(o)}).then((() => initFinalNote(e)))
  }, onSkipLanguagesClick = e => {
    const {geoIpCountry: n, preferredLanguages: t} = e.getSettings();
    visibleLanguages = getInitialLanguagesList(n, t), onConfirmLanguagesClick(e)
  }, initLanguageSelector = e => {
    Tracker.trackEvent("Action", "onboarding_language:show"), progressIndicatorElement.dataset.current = "language";
    const n = visibleLanguages.map((({code: e, checked: n}) => ({
        caption: getLanguageNameByCode(e),
        code: e,
        checked: n
      }))).filter((({caption: e}) => Boolean(e))).map((({
                                                          caption: e,
                                                          code: n,
                                                          checked: t
                                                        }) => createLanguageCheckbox(e, n, t))),
      t = _("form", {className: "language-selector", id: "language-selector"}),
      a = i18nManager.getMessage("onboardLanguageSelectorHeading"),
      o = i18nManager.getMessage("onboardLanguageSelectorDescription");
    messageElement.innerHTML = `<h2 class="content__heading">${a}</h2>\n                                <p class="content__paragraph">${o}</p>`, n.concat([createLanguageSelect()]).forEach((e => t.appendChild(e))), messageElement.appendChild(t), messageElement.addEventListener("change", handleLanguageSelectorChange);
    let i = _("div", {className: "dialog__secondaryButton", id: "skip", textContent: i18nManager.getMessage("skip")});
    i.onclick = () => onSkipLanguagesClick(e);
    document.getElementById("dialog__buttons").insertBefore(i, confirmButtonElement), confirmButtonElement.textContent = i18nManager.getMessage("onboardLanguageSelectorCta"), confirmButtonElement.onclick = () => onConfirmLanguagesClick(e)
  }, initFinalNote = e => {
    progressIndicatorElement.dataset.current = "final";
    const n = document.getElementById("skip");
    n && n.remove();
    let t = `<h2 class="content__heading">${i18nManager.getMessage("onboardingHeadline")}</h2>`;
    BrowserDetector.isThunderbird() ? t += `<p class="content__paragraph">${i18nManager.getMessage("onboardingIntroThunderbird")}</p>` : t += `<p class="content__paragraph">${i18nManager.getMessage("onboardingIntro")}</p>`, t += '<ul class="content__list">';
    let a = !1;
    try {
      a = "ot" === localStorage.getItem("ref_source")
    } catch (e) {
    }
    a && (e.updateSettings({hasSynonymsEnabled: !0}), t += `<li>${i18nManager.getMessage("onboardingNote4")}</li>`), BrowserDetector.isSafari() ? t += `\n            <li class="content__list__item lt-icon__reload">${i18nManager.getMessage("onboardingNote1")}</li>\n            <li class="content__list__item lt-icon__lt">${i18nManager.getMessage("onboardingNote3")}</li>\n        ` : BrowserDetector.isFirefox() ? t += `\n            <li class="content__list__item lt-icon__disabled_website">${i18nManager.getMessage("onboardingNote2")}</li>\n            <li class="content__list__item lt-icon__lt">${i18nManager.getMessage("onboardingNote3")}</li>\n        ` : BrowserDetector.isThunderbird() ? t += `\n            <li class="content__list__item lt-icon__email">${i18nManager.getMessage("onboardingNoteThunderbird1")}</li>\n            <li class="content__list__item lt-icon__lt">${i18nManager.getMessage("onboardingNoteThunderbird2")}</li>\n\t\t` : t += `\n            <li class="content__list__item lt-icon__reload">${i18nManager.getMessage("onboardingNote1")}</li>\n\t\t\t<li class="content__list__item lt-icon__disabled_website">${i18nManager.getMessage("onboardingNote2")}</li>\n\t\t\t<li class="content__list__item lt-icon__lt">${i18nManager.getMessage("onboardingNote3")}</li>\n\t\t`, t += "</ul>", messageElement.innerHTML = t, confirmButtonElement.textContent = i18nManager.getMessage("close"), confirmButtonElement.onclick = closeTab
  }, onConfirmClick = e => __awaiter(this, void 0, void 0, (function* () {
    dispatchCustomEvent(document, "lt-privacy-confirmation"), Tracker.trackEvent("Action", "accept_privacy_note", "manual"), yield e.updatePrivacySettings({allowRemoteCheck: !0}), visibleLanguages.length ? initLanguageSelector(e) : initFinalNote(e)
  })), assignVisibleLanguages = e => __awaiter(this, void 0, void 0, (function* () {
    const {geoIpCountry: n, preferredLanguages: t} = e.getSettings();
    visibleLanguages = getInitialLanguagesList(n, t)
  })), initManagedLogin = (e, n) => {
    var t;
    const a = _("div", {className: "dialog__btn--login__wrapper"});
    a.onclick = () => {
      goToManagedLogin(n, ((n, t) => {
        e.updatePrivacySettings({allowRemoteCheck: !0}), e.updateSettings({
          username: n,
          password: "",
          token: t,
          knownEmail: n,
          isDictionarySynced: !1
        }).then((() => {
          e.checkForPaidSubscription()
        })), initFinalNote(e)
      }))
    }, a.appendChild(_("div", {
      className: "dialog__btn--login dialog__primaryButton",
      textContent: i18nManager.getMessage("managedLoginButton1")
    })), footerElement.remove(), null === (t = document.getElementById("dialog__content")) || void 0 === t || t.appendChild(a), sloganElement.textContent = i18nManager.getMessage("privacyNoteSlogan"), messageElement.innerHTML = `<h2 class="content__heading">${i18nManager.getMessage("managedLoginHeadline")}</h2>\n                                <p class="content__paragraph">${i18nManager.getMessage("managedLoginDescription")}</p>`
  }, initPrivacyConfirmation = e => {
    const n = e.getSettings(),
      t = BrowserDetector.isSafari() ? "https://languagetool.org/legal/privacy/?hidePremium=true" : "https://languagetool.org/legal/privacy/",
      a = i18nManager.getMessage("privacyHeadline");
    let o;
    if (n.apiServerUrl === StorageControllerClass.getDefaultSettings().apiServerUrl) {
      const e = BrowserDetector.isSafari() ? "https://languagetool.org/?hidePremium=true" : "https://languagetool.org";
      o = i18nManager.getMessage("privacyNoteForDefaultServer", [e, "LanguageTool.org"])
    } else o = i18nManager.getMessage("privacyNoteForOtherServer", escapeHTML(n.apiServerUrl));
    const i = i18nManager.getMessage("privacyListUnsaved"), r = i18nManager.getMessage("privacyListSwitchable"),
      g = i18nManager.getMessage("privacyLinkForDefaultServer", [t]);
    messageElement.innerHTML = `<h2 class="content__heading">${a}</h2>\n\t                            <p class="content__paragraph">${o}</p>\n\t                            <p class="privacy__link">${g}</p>\n\t                            <ul class="content__list"><li class="content__list__item lt-icon__privacy">${i}</li>\n\t                            <li class="content__list__item lt-icon__experimental_settings">${r}</li></ul>`, sloganElement.textContent = i18nManager.getMessage("privacyNoteSlogan"), confirmButtonElement.textContent = i18nManager.getMessage("continue"), confirmButtonElement.onclick = () => onConfirmClick(e), Tracker.trackPageView(browser.runtime.getURL("privacyConfirmation/privacyConfirmation.html"))
  }, main = () => __awaiter(this, void 0, void 0, (function* () {
    if (isInvalidPage()) return;
    const [e, n, t] = yield Promise.all([new Promise((e => StorageController.create().onReady((n => e(n))))), loadStaticFile(EnvironmentAdapter.getURL("welcome/templates/index.html")), loadStaticFile(EnvironmentAdapter.getURL("welcome/welcome.css"))]), {loginUrl: a} = e.getManagedSettings(),
      o = _("div", {className: "dialog", innerHTML: n});
    document.documentElement.dataset.navigatorLang = navigator.language.substr(0, 2), document.head.appendChild(_("style", {textContent: t})), document.body.appendChild(o), Object.entries(BODY_ATTRS).forEach((e => document.body.setAttribute(...e))), sloganElement = document.getElementById("slogan"), messageElement = document.getElementById("message"), footerElement = document.getElementById("footer"), privacyLinkElement = document.getElementById("privacyLink"), confirmButtonElement = document.getElementById("confirm"), progressIndicatorElement = document.getElementById("progress-indicator"), progressIndicatorElement.dataset.current = "privacy", progressIndicatorElement.appendChild(_("div", {
      id: "progress-indicator__privacy-confirmation",
      className: "progress-indicator__item"
    })), yield assignVisibleLanguages(e), visibleLanguages.length && progressIndicatorElement.appendChild(_("div", {
      id: "progress-indicator__language-selector",
      className: "progress-indicator__item"
    })), progressIndicatorElement.appendChild(_("div", {
      id: "progress-indicator__final-note",
      className: "progress-indicator__item"
    })), a ? initManagedLogin(e, a) : initPrivacyConfirmation(e)
  }));
main();