/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
let isMessageListenerSet = !1;

function reloadContentScriptsIfNecessary(e, t) {
  isMessageListenerSet || (isMessageListenerSet = !0, browser.runtime.onMessage.addListener(((s, a) => {
    if (s && "INJECT_SCRIPTS" === s.command) {
      (browser.runtime.getManifest().content_scripts || []).forEach((t => {
        t.js && "document_start" !== t.run_at && t.js.forEach((t => {
          browser.tabs.executeScript(e, {
            file: "/" + t,
            matchAboutBlank: !0,
            allFrames: !1,
            frameId: a.frameId
          }).catch((e => console.error(e.message)))
        })), t.css && t.css.forEach((t => {
          browser.tabs.insertCSS(e, {
            file: "/" + t,
            matchAboutBlank: !0,
            allFrames: !1,
            frameId: a.frameId
          }).catch((e => console.error(e.message)))
        }))
      })), Tracker.trackEvent("Action", "inject_scripts", t)
    }
  })))
  browser.tabs.executeScript(e, {
    code: '\n\t\t\t\tif (typeof(LTAssistant) === "undefined" && navigator.userAgent.match(/Chrome\\/|Chromium\\//) && !location.pathname.includes(\'_generated_background_page\')) {\n\t\t\t\t\twindow.__ltLastActiveElement = document.activeElement;\n\t\t\t\t\tchrome.runtime.sendMessage({ command: "INJECT_SCRIPTS" }, () => null);\n\t\t\t\t}\n\t\t\t',
    matchAboutBlank: !0,
    allFrames: !0
  }).catch((() => null))
}