/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
{
  const t = document.getElementById("status-box"), e = document.getElementById("status-headline"),
    a = document.getElementById("status-text"), s = document.getElementById("status-button"),
    n = document.getElementById("text-field"), r = document.getElementById("current-year");
  let o = !1, i = null;
  const d = StorageController.create();

  function initText() {
    const t = new URL(window.location.href).searchParams.get("id");
    if (t) {
      const e = {command: "GET_VALIDATOR_DATA", id: t};
      browser.runtime.sendMessage(e).then((t => {
        t && isGetValidatorDataResult(t) && (t.text && (n.innerText = t.text), history.replaceState({}, "", location.pathname))
      })).catch((() => {
        Tracker.trackError("js", "validator_failed", "promise")
      })).then((() => {
        Tracker.trackPageView()
      }))
    } else n.innerText = localStorage.getItem("validator-text") || "", Tracker.trackPageView()
  }

  function onLTAssistantStateUpdated(s) {
    o || (o = !0, t.setAttribute("data-initialized", "true"));
    const n = s.detail;
    if (JSON.stringify(n) === JSON.stringify(i)) return;
    const {hasPaidSubscription: r} = d.getUIState();
    i = n;
    const l = n.checkStatus;
    t.className = "validator__status-box", l === CHECK_STATUS.TEXT_TOO_SHORT ? (t.classList.add("validator__status-box--no-errors"), e.textContent = i18nManager.getMessage("validatorNoTextStatus"), a.textContent = "") : l === CHECK_STATUS.TEXT_TOO_LONG ? (r ? (t.classList.add("validator__status-box--has-exception"), a.textContent = "") : (t.classList.add("validator__status-box--has-premium-errors"), a.textContent = i18nManager.getMessage("dialogTextTooLongText")), e.textContent = i18nManager.getMessage("validatorTextTooLongStatus")) : l === CHECK_STATUS.IN_PROGRESS ? (t.classList.add("validator__status-box--in-progress"), e.textContent = i18nManager.getMessage("validatorLoadingHint"), a.textContent = "") : l === CHECK_STATUS.COMPLETED ? n.displayedErrors && n.displayedErrors.length ? (t.classList.add("validator__status-box--has-errors"), e.textContent = 1 === n.displayedErrors.length ? i18nManager.getMessage("validatorHasMistakesHeadlineSingular") : i18nManager.getMessage("validatorHasMistakesHeadlinePlural", [n.displayedErrors.length]), a.textContent = i18nManager.getMessage("validatorHasMistakesText")) : n.premiumErrors && n.premiumErrors.length ? (t.classList.add("validator__status-box--has-premium-errors"), e.textContent = 1 === n.premiumErrors.length ? i18nManager.getMessage("validatorHasPremiumErrorsHeadlineSingular") : i18nManager.getMessage("validatorHasPremiumErrorsHeadlinePlural", [n.premiumErrors.length]), a.textContent = i18nManager.getMessage("validatorHasPremiumErrorsText")) : (t.classList.add("validator__status-box--no-errors"), e.textContent = i18nManager.getMessage("validatorNoMistakesHeadline"), a.textContent = "") : l === CHECK_STATUS.UNSUPPORTED_LANGUAGE ? (t.classList.add("validator__status-box--has-exception"), e.textContent = i18nManager.getMessage("dialogUnsupportedLanguageHeadline"), a.textContent = i18nManager.getMessage("dialogUnsupportedLanguageText")) : l === CHECK_STATUS.FAILED && n.errorMessage ? (a.textContent = "", e.textContent = n.errorMessage, t.classList.add("validator__status-box--has-exception")) : (a.textContent = "", e.textContent = i18nManager.getMessage("statusIconError"), t.classList.add("validator__status-box--has-exception"))
  }

  function onStatusButtonClick() {
    if (!i) return;
    let t = "https://languagetool.org/premium?pk_campaign=addon2-validator-premium-errors";
    t += `&grammarMatches=${i.premiumErrors.filter((t => !t.isStyleError)).length}`, t += `&styleMatches=${i.premiumErrors.filter((t => t.isStyleError)).length}`, window.open(t, "_target")
  }

  function onBeforeUnload() {
    localStorage.setItem("validator-text", n.innerText)
  }

  d.onReady((() => {
    d.getUIState().hasPaidSubscription || d.hasCustomServer() || document.getElementById("sidebar").classList.remove("validator__sidebar--collapsed"), d.startChangelogCoupon();
    const t = d.getActiveCoupon();
    t && (document.querySelector("#validator-upgrade-button").textContent = i18nManager.getMessage("upgradeTeaserDiscount", [t.percent])), initText()
  })), translateSection(document.documentElement), n.addEventListener(LTAssistant.events.UPDATE, onLTAssistantStateUpdated), s.addEventListener("click", onStatusButtonClick), window.addEventListener("beforeunload", onBeforeUnload), r.textContent = (new Date).getFullYear().toString(), n.focus()
}