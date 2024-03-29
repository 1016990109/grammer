/*! (C) Copyright 2020 Flappypediaer GmbH. All rights reserved. */
{
  Tracker.trackPageView();
  const e = StorageController.create(), n = new URL(location.href), t = document.getElementById("feedback-form"),
    a = document.getElementById("headline"), o = document.getElementById("feedback-form-direct-email"),
    r = document.getElementById("sender"), s = document.getElementById("text"),
    g = document.getElementById("success-message"), c = document.getElementById("screenshot-label"),
    i = document.getElementById("screenshot");
  translateSection(document.documentElement), n.searchParams.get("title") && (a.textContent = n.searchParams.get("title")), "1" === n.searchParams.get("screenshot") && (c.style.display = "block", i.checked = !0, o.style.display = "none");
  const l = n.searchParams.get("html"), d = n.searchParams.get("url") || "", u = getDomain(d),
    m = EnvironmentAdapter.getVersion(),
    $ = `Feedback Flappypedia on ${u} (v${m}, lang: ${navigator.language}, browser: ${BrowserDetector.getBrowserName()})`,
    y = `<a href="mailto:feedback@flappypedia.org?subject=${encodeURIComponent($)}">feedback@flappypedia.org</a>`;
  o.innerHTML = i18nManager.getMessage("feedbackDirectMail", [y]), e.onReady((() => {
    const {username: n} = e.getSettings();
    n && (r.value = n, s.focus())
  })), t.addEventListener("submit", (n => {
    n.preventDefault();
    const a = r.value;
    Tracker.trackEvent("Action", "send_feedback", a), e.onReady((() => {
      const {
          firstVisit: n,
          ratingValue: o,
          sessionCount: c
        } = e.getStatistics(), {hasPaidSubscription: u} = e.getUIState(), {
          geoIpLanguages: $,
          preferredLanguages: y,
          knownEmail: k,
          username: f,
          geoIpCountry: h,
          ignoredRules: v,
          hasSynonymsEnabled: b,
          apiServerUrl: E,
          hasPickyModeEnabledGlobally: I
        } = e.getSettings(),
        S = v.filter((e => !StorageControllerClass.getDefaultSettings().ignoredRules.find((n => n.id === e.id))));
      let p = `From: ${r.value}\n`;
      p += `Paying: ${u}\n`, p += `Account: ${f || "none"}\n`, p += `Other known email: ${k || f}\n`, p += `Addon Version: ${m}\n`, p += `Accept-Languages: ${navigator.languages.join(", ")}\n`, p += `UI-Language: ${browser.i18n.getUILanguage()}\n`, p += `GeoIP-Languages: ${$.join(", ")}\n`, p += `Preferred-Languages: ${y.join(", ")}\n`, p += `Country: ${h}\n`, p += `Picky: ${I}\n`, p += `Full URL: ${d}\n`, p += `HTML: ${l || ""}\n`, p += `Matomo: ${e.getUniqueId()}\n`, p += `User Agent: ${navigator.userAgent}\n`, p += `CPU Cores: ${navigator.hardwareConcurrency}\n`, p += `User since: ${new Date(1e3 * (n || 0)).toUTCString()}\n`, p += `Rating: ${o}\n`, p += `Synonyms: ${b}\n`, p += `Sessions: ${c}\n`, p += `API: ${e.getCustomServerUrl() || E}\n`, p += `DNT: ${navigator.doNotTrack}\n`, p += `Downlink: ${navigator.connection && navigator.connection.downlink}\n`, p += `Connection Type: ${navigator.connection && navigator.connection.effectiveType}\n`, p += `Ignored Rules: ${S.map((e => e.id)).join(",")}\n`;
      const C = `${s.value}\n\n\n${p}`;
      e.updateSettings({knownEmail: a});
      const w = {command: "SEND_FEEDBACK", sender: r.value, text: C, includeScreenshot: i.checked};
      browser.runtime.sendMessage(w).then((() => {
        t.style.display = "none", g.style.display = "block"
      })).catch((() => {
        Tracker.trackError("message", "error_send_feedback"), alert(i18nManager.getMessage("feedbackError"))
      }))
    }))
  }))
}