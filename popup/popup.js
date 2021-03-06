/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
// {
//   let e, t, o, s;
//   const n = document.getElementById("popup-container"),
//     a = document.getElementById("lt-popup__package-badge-container"), i = document.getElementById("onboarding-button"),
//     p = document.getElementById("popup-hint"), r = document.getElementById("popup-option-synonyms"),
//     d = document.getElementById("popup-global-settings"), c = document.querySelector("#popup-option-capitalization"),
//     l = document.querySelector("#popup-option-picky-mode"), u = document.querySelector("#popup-option-check"),
//     g = document.querySelector("#popup-option-synonyms"), m = document.getElementById("popup-validator"),
//     _ = document.getElementById("popup-validator-button"), b = document.getElementById("popup-teaser"),
//     h = document.getElementById("feedback-link"), E = document.getElementById("popup-more-options-link"),
//     L = document.getElementById("lt-popup-logo");
//   translateSection(document.body), translateElement("#popup-onboarding-text-1", {
//     key: "popupOnboardingStep1",
//     isHTML: !0
//   }), translateElement("#popup-onboarding-text-2", {
//     key: "popupOnboardingStep2",
//     isHTML: !0,
//     interpolations: ['<span class="lt-popup__onboarding__icon1"></span>', '<span class="lt-popup__onboarding__icon2"></span>']
//   }), translateElement("#popup-onboarding-text-3", {
//     key: "popupOnboardingStep3",
//     isHTML: !0
//   }), translateElement("#popup-onboarding-text-4", {
//     key: "popupOnboardingStep4",
//     isHTML: !0
//   }), E.setAttribute("title", i18nManager.getMessage("popupSettingsHover")), E.addEventListener("click", (() => {
//     // EnvironmentAdapter.openOptionsPage(void 0, "popup-icon")
//     // 打开首页
//     window.open('https://flappypedia.com')
//     window.close()
//   })), L.addEventListener("click", (e => {
//     browser.runtime.sendMessage({command: "OPEN_URL", url: L.href}), e.preventDefault(), window.close()
//   })), i.addEventListener("click", (() => {
//     n.classList.remove("lt-popup--show-onboarding"), n.classList.remove("lt-popup--disabled"), k.updateUIState({hasSeenOnboarding: !0}), Tracker.trackEvent("Action", "popup:onboarding_banner:close")
//   })), h.addEventListener("click", (() => EnvironmentAdapter.openFeedbackForm(e)));
//   let k = StorageController.create();
//   k.onReady((() => {
//     alert("click ")
//     fetch('http://flappypedia.com').then(res => {
//       console.log(res)
//     })
//     browser.tabs.query({currentWindow: !0, active: !0}).then((i => {
//       if (!i || !i.length) return void window.close();
//       o = i[0].id, e = i[0].url || "about:blank", t = getDomain(e), s = TweaksManager.getSiteTweaks(e);
//       if (!k.getPrivacySettings().allowRemoteCheck && !e.startsWith(config.INSTALL_URL) && !BrowserDetector.isSafari()) {
//         const e = {command: "OPEN_PRIVACY_CONFIRMATION"};
//         return browser.runtime.sendMessage(e), void window.close()
//       }
//       reloadContentScriptsIfNecessary(o, t);
//       const r = k.getCheckSettings(t, s.getEditorGroupId(e)), d = {
//         enabled: !r.isDomainDisabled && !r.isEditorGroupDisabled,
//         supported: !0,
//         unsupportedMessage: "",
//         capitalization: r.shouldCapitalizationBeChecked,
//         pickyMode: !0
//       };
//       s.isSupported() ? k.isDomainSupported(t) || (d.supported = !1, d.unsupportedMessage = browser.i18n.getMessage("siteTemporarilyUnsupported")) : (d.supported = !1, d.unsupportedMessage = s.unsupportedMessage());
//       const h = k.getStatistics(), E = k.getSettings(), L = k.getUIState(), w = Date.now() - 1e3 * h.firstVisit;
//       if (new PackageBadge(null, L.hasPaidSubscription ? "premium" : "basic", "default", a).getElement().addEventListener("click", (() => {
//         EnvironmentAdapter.openOptionsPage(void 0, "popup-badge"), window.close()
//       })), b.classList.add("lt-popup__teaser--hide"), h.appliedSuggestions < 2 && !L.hasSeenOnboarding && !BrowserDetector.isThunderbird()) n.classList.add("lt-popup--show-onboarding"), n.classList.add("lt-popup--disabled"), Tracker.trackEvent("Action", "popup:onboarding_banner", t); else if (d.supported && !k.hasCustomServer()) if (!L.hasPaidSubscription && ("like" === h.ratingValue || h.appliedSuggestions > 7 || w > 432e5)) {
//         const e = getHistoricPremiumErrors(h);
//         if (e.hiddenErrorsCount > 5) {
//           const t = "popup:historic_premium_teaser", o = browser.i18n.getMessage("historicPremiumErrorsHeadline"),
//             s = browser.i18n.getMessage("historicPremiumErrorsText2", [e.hiddenErrorsCount, e.dayCount]),
//             n = browser.i18n.getMessage("historicPremiumErrorsButton");
//           b.classList.remove("lt-popup__teaser--hide"), new PremiumTeaser(b, t, o, s, n, {
//             campaign: "addon2-popup-historic-premium-errors",
//             historicMatches: e.hiddenErrorsCountStr
//           })
//         } else {
//           const e = "popup:premium_teaser", t = browser.i18n.getMessage("popupPremiumHeadline"),
//             o = browser.i18n.getMessage("popupPremiumText"), s = browser.i18n.getMessage("popupPremiumLink");
//           b.classList.remove("lt-popup__teaser--hide"), new PremiumTeaser(b, e, t, o, s, {campaign: "addon2-popup"})
//         }
//         Tracker.trackEvent("Action", "popup:upgrade_teaser")
//       } else L.hasRated || (b.classList.remove("lt-popup__teaser--hide"), new RatingTeaser(b, "popup", e));
//       L.hasPaidSubscription && n.classList.add("lt-popup--plus"), k.hasLanguageToolAccount() && (_.textContent = i18nManager.getMessage("popupOpenEditorButton"), _.classList.add("lt-popup__button--edit"), m.classList.remove("lt-popup__validator--hide"), _.onclick = () => {
//         browser.runtime.sendMessage({command: "LAUNCH_EDITOR"}), Tracker.trackEvent("Action", "popup:open_editor"), window.close()
//       });
//       browser.tabs.sendMessage(o, {command: "GET_SELECTED_TEXT"}).then((t => {
//         !t || t.selectedText.trim().length < config.MIN_TEXT_LENGTH || e.includes("//" + browser.runtime.id) || (m.classList.remove("lt-popup__validator--hide"), _.textContent = i18nManager.getMessage(k.hasLanguageToolAccount() ? "popupOptionValidateInEditor" : "popupOptionValidate"), _.onclick = () => {
//           const e = {command: "LAUNCH_EDITOR", text: t.selectedText, html: t.selectedHTML};
//           browser.runtime.sendMessage(e), Tracker.trackEvent("Action", "popup:check_selected_text"), window.close()
//         })
//       })).catch((e => console.log("Failed getting selected text", e))), d.supported || (p.classList.add("lt-popup__hint-visible"), p.innerHTML = d.unsupportedMessage, n.classList.add("lt-popup--disabled"), Tracker.trackEvent("Action", "popup:disabled", getDomain(e))), d.enabled || (u.classList.add("lt-popup__option--switch-off"), C(), U()), k.hasCustomServer() && H(), d.capitalization || c.classList.add("lt-popup__option--switch-off"), d.pickyMode || l.classList.add("lt-popup__option--switch-off"), E.hasSynonymsEnabled ? g.classList.remove("lt-popup__option--switch-off") : g.classList.add("lt-popup__option--switch-off"), E.hasPickyModeEnabledGlobally ? l.classList.remove("lt-popup__option--switch-off") : l.classList.add("lt-popup__option--switch-off"), c.addEventListener("click", (() => v())), u.addEventListener("click", (() => f())), g.addEventListener("click", (() => y())), l.addEventListener("click", (() => T())), setTimeout((() => {
//         n.classList.add("lt-popup--animations-enabled")
//       }), 500), Tracker.trackPageView()
//     }))
//   }));
//   const w = t => "extensions" === t ? e : t, f = () => {
//     u.classList.contains("lt-popup__option--switch-off") ? S() : M()
//   }, v = () => {
//     c.classList.contains("lt-popup__option--switch-off") ? B() : D()
//   }, y = () => {
//     g.classList.contains("lt-popup__option--switch-off") ? O() : x()
//   }, T = () => {
//     l.classList.contains("lt-popup__option--switch-off") ? I() : P()
//   }, S = () => {
//     if (!k) return;
//     u.classList.remove("lt-popup__option--switch-off");
//     const n = s.getEditorGroupId(e);
//     k.enableDomainAndEditorGroup(t, n), EnvironmentAdapter.ltAssistantStatusChanged(o, {enabled: !0}), A(), z(), Tracker.trackEvent("Action", "enable_domain", w(t))
//   }, M = () => {
//     k && (u.classList.add("lt-popup__option--switch-off"), k.disableDomain(t), EnvironmentAdapter.ltAssistantStatusChanged(o, {enabled: !1}), U(), C(), Tracker.trackEvent("Action", "disable_domain", w(t)))
//   }, A = () => {
//     c.classList.remove("lt-popup__option--hide")
//   }, C = () => {
//     c.classList.add("lt-popup__option--hide")
//   }, I = () => {
//     k && (l.classList.remove("lt-popup__option--switch-off"), k.updateSettings({hasPickyModeEnabledGlobally: !0}), Tracker.trackEvent("Action", "enable_picky_mode", LanguageManager.getUserLanguageCodes()[0]))
//   }, P = () => {
//     k && (l.classList.add("lt-popup__option--switch-off"), k.updateSettings({hasPickyModeEnabledGlobally: !1}), Tracker.trackEvent("Action", "disable_picky_mode", LanguageManager.getUserLanguageCodes()[0]))
//   }, B = () => {
//     k && (c.classList.remove("lt-popup__option--switch-off"), k.enableCapitalization(t), EnvironmentAdapter.ltAssistantStatusChanged(o, {capitalization: !0}), Tracker.trackEvent("Action", "enable_capitalization", w(t)))
//   }, D = () => {
//     k && (c.classList.add("lt-popup__option--switch-off"), k.disableCapitalization(t), EnvironmentAdapter.ltAssistantStatusChanged(o, {capitalization: !1}), Tracker.trackEvent("Action", "disable_capitalization", w(t)))
//   }, O = () => {
//     k && (g.classList.remove("lt-popup__option--switch-off"), k.updateSettings({hasSynonymsEnabled: !0}), Tracker.trackEvent("Action", "enable_synonyms", LanguageManager.getUserLanguageCodes()[0]))
//   }, x = () => {
//     k && (g.classList.add("lt-popup__option--switch-off"), k.updateSettings({hasSynonymsEnabled: !1}), Tracker.trackEvent("Action", "disable_synonyms", LanguageManager.getUserLanguageCodes()[0]))
//   }, H = () => {
//     r.classList.add("lt-popup__option--hide")
//   }, U = () => {
//     d.classList.add("lt-popup__settings--hide")
//   }, z = () => {
//     d.classList.remove("lt-popup__settings--hide")
//   };
//   BrowserDetector.isSafari() && (n.classList.add("lt-popup--safari"), L.href = L.href + (L.href.includes("?") ? "&" : "?") + "hidePremium=true"), BrowserDetector.isFirefox() && n.classList.add("lt-popup--firefox"), BrowserDetector.isThunderbird() && n.classList.add("lt-popup--thunderbird")
// }
//flappy init
loginGuide = document.getElementById("flappy_pop_guide")
loginButton = document.getElementById("flappy_pop_login")
guideContainer = document.getElementById("flappy_pop_content_login")
guideContainer.style.display = "none"
loginGuide.style.display= "none"
loginButton.style.display= "none"
FlappyAuth.getToken().then(()=>{
  loginGuide.style.display= "none"
  loginButton.style.display= "none"
  guideContainer.style.display = "block"
}).catch(()=>{
  guideContainer.style.display = "none"
  loginGuide.style.display= "block"
  loginButton.style.display= "block"
})
loginButton.onclick = ()=>{
  window.open("https://www.flappypedia.com")
  window.close()
}

//foot link
homeButton = document.getElementById("flappy_pop_home")
homeButton.onclick = ()=>{
  window.open("https://www.flappypedia.com")
  window.close()
}
feedbackButton = document.getElementById("flappy_pop_feedback")
feedbackButton.onclick = ()=>{
  window.open("https://www.flappypedia.com")
  window.close()
}
