/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
function isElementCompatibleForGoogleServices(e) {
  return !e.closest("uf-describe-page") && TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}

TweaksManager.SITE_TWEAKS_RULES.push({
  precondition: {hostname: "mail.aol.com"},
  isElementCompatible: e => !(!e.classList.contains("contentEditDiv") || "true" !== e.getAttribute("contenteditable")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: ["medium.com", "discord.com"]},
  isElementCompatible: e => !("true" !== e.getAttribute("contenteditable") || !isSlateEditor(e)) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "crowdin.com"},
  isElementCompatible: e => "TEXTAREA" === e.tagName && "translation" === e.id || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "reverso.net"},
  isElementCompatible: e => "TEXTAREA" === e.tagName || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: ["vodafone.de", "vodafone.com", "vodafone.co.uk", "vodafone.nl"]},
  isElementCompatible: e => "brix-webchat-textarea" !== e.id && !e.classList.contains("brix-form-textarea") && TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "github.com"},
  isElementCompatible: e => "INPUT" === e.tagName && "issue_title" === e.id || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {isMatch: () => Gutenberg.isEditorPage()},
  getInitElements: e => Gutenberg.getInitElements(e),
  isElementCompatible: e => Gutenberg.isEditor(e) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e),
  hasFocus: e => Gutenberg.isEditor(e) || TweaksManager.DEFAULT_SITE_TWEAKS.hasFocus(e)
}, {
  precondition: {hostname: "box.com"},
  isElementCompatible: e => "editor-content-editable" === e.id && "true" === e.getAttribute("contenteditable") || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "atlassian.net"},
  isElementCompatible: e => !!(e instanceof HTMLElement && e.isContentEditable && e.className.includes("ProseMirror")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e),
  persistTemporarySettings: () => !0,
  getEditorGroupId(e) {
    const t = e.match(/\/pages.*?\/(\d{3,})($|\/|\?|#)/);
    return t ? t[1] : TweaksManager.DEFAULT_SITE_TWEAKS.getEditorGroupId(e)
  }
}, {
  precondition: {hostname: "canva.com"}, isElementCompatible(e) {
    const t = /rotate\([1-9\-]/, a = "[style*=rotate]";
    let n = e.closest(a);
    for (; n && n !== e.ownerDocument.body;) {
      if (n.style.transform && n.style.transform.match(t)) return !1;
      n = n.parentElement && n.parentElement.closest(a)
    }
    return TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
  }
}, {
  precondition: {hostname: "clickfunnels.com"},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {hostname: ["onlinebanking.deutschebank.be", "mabanque.bnpparibas"]},
  isElementCompatible: e => !1
}, {
  precondition: {hostname: "deepl.com"},
  isElementCompatible: e => !e.className.includes("target_textarea") && TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "paper.dropbox.com"}, persistTemporarySettings: () => !0, getEditorGroupId(e) {
    const t = e.match(/\/doc\/(.+?)($|\/|\?|#)/i);
    return t ? t[1] : TweaksManager.DEFAULT_SITE_TWEAKS.getEditorGroupId(e)
  }
}, {
  precondition: {hostname: "dropbox.com"},
  isElementCompatible: e => !("true" !== e.getAttribute("contenteditable") || !e.closest(".sc-comment-editor-draft")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {url: /www\.facebook\.com\/plugins\/feedback/},
  isElementCompatible: e => "false" === e.getAttribute("spellcheck") && "true" === e.getAttribute("contenteditable") || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "addons.mozilla.org"},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("addonsSiteNotSupported")
}, {
  precondition: {hostname: /ads\.google\.com/},
  isElementCompatible: e => !(!isTextInput(e) || !e.closest("[eta-headline], .headline-field-group, .long-headline-field, .description-field-group")) || isElementCompatibleForGoogleServices(e)
}, {
  precondition: {hostname: "chrome.google.com"},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("webstoreSiteNotSupported")
}, {
  precondition: {hostname: "microsoftedge.microsoft.com"},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("edgeWebstoreSiteNotSupported")
}, {
  precondition: {hostname: "crowdsource.google.com"},
  isElementCompatible: e => !(!isTextInput(e) || !e.closest("#question")) || isElementCompatibleForGoogleServices(e)
}, {
  precondition: {url: /docs\.google\.com\/spreadsheets/},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {url: /docs\.google\.com\/sharing/},
  isElementCompatible: e => !e.classList.contains("apps-share-chips-input") && isElementCompatibleForGoogleServices(e)
}, {
  precondition: {url: GoogleDocs.DOCS_URL_REGEXP},
  init() {
    GoogleDocs.init(), TweaksManager.DEFAULT_SITE_TWEAKS.init()
  },
  destroy() {
    GoogleDocs.destroy(), TweaksManager.DEFAULT_SITE_TWEAKS.destroy()
  },
  isSupported: () => !(window.parent !== window.self && window.innerHeight < 100),
  persistTemporarySettings: () => !0,
  onNewElement(e) {
    GoogleDocs.onPage(e)
  },
  isElementCompatible: e => GoogleDocs.isPage(e) ? GoogleDocs.isElementCompatible(e) : isElementCompatibleForGoogleServices(e),
  getEditorGroupId: e => GoogleDocs.getDocId(e) || TweaksManager.DEFAULT_SITE_TWEAKS.getEditorGroupId(e),
  getClickEvent: () => "mouseup",
  getSelectedText: () => GoogleDocs.getSelectedText() || TweaksManager.DEFAULT_SITE_TWEAKS.getSelectedText(),
  getSelectedHTML() {
  }
}, {
  precondition: {url: GoogleSlides.SLIDES_URL_REGEXP},
  init() {
    BrowserDetector.isSafari() || GoogleSlides.init(), TweaksManager.DEFAULT_SITE_TWEAKS.init()
  },
  destroy() {
    GoogleSlides.destroy(), TweaksManager.DEFAULT_SITE_TWEAKS.destroy()
  },
  isSupported: () => !BrowserDetector.isSafari(),
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported"),
  persistTemporarySettings: () => !0,
  onNewElement(e) {
    GoogleSlides.onNewSlide(e), TweaksManager.DEFAULT_SITE_TWEAKS.onNewElement(e)
  },
  isElementCompatible: e => GoogleSlides.isElementCompatible(e) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e),
  getEditorId: e => GoogleSlides.getSlideId(e) || TweaksManager.DEFAULT_SITE_TWEAKS.getEditorGroupId(e),
  getEditorGroupId: e => GoogleSlides.getPresentationId(e) || TweaksManager.DEFAULT_SITE_TWEAKS.getEditorGroupId(e),
  getClickEvent: () => "mouseup",
  getSelectedText: () => GoogleSlides.getSelectedText() || TweaksManager.DEFAULT_SITE_TWEAKS.getSelectedText(),
  getSelectedHTML() {
  }
}, {
  precondition: {hostname: "keep.google.com"},
  isElementCompatible: e => isElementCompatibleForGoogleServices(e)
}, {
  precondition: {hostname: "mail.google.com"},
  isElementCompatible: e => e.matches(".editable[contenteditable=true]") || isElementCompatibleForGoogleServices(e)
}, {
  precondition: {hostname: "notion.so"},
  init() {
    const e = StorageController.create();
    e.onReady((() => {
      e.updateStatistics({isNotionUser: !0})
    })), TweaksManager.DEFAULT_SITE_TWEAKS.init()
  },
  getInitElements: e => Notion.getInitElements(e),
  isElementCompatible: e => Notion.isEditor(e) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e),
  hasFocus: e => Notion.isEditor(e) || TweaksManager.DEFAULT_SITE_TWEAKS.hasFocus(e)
}, {
  precondition: {hostname: "tagmanager.google.com"},
  isElementCompatible: e => !e.closest(".gtm-veditor_entity-name") && isElementCompatibleForGoogleServices(e)
}, {
  precondition: {url: /translate\.google\.[a-z]{2,3}(\.[a-z]{2,3})?\/community/},
  isElementCompatible: e => !(!isTextInput(e) || !e.classList.contains("paper-input")) || isElementCompatibleForGoogleServices(e)
}, {
  precondition: {url: /translate\.google\.[a-z]{2,3}(\.[a-z]{2,3})?/},
  isElementCompatible: e => "TEXTAREA" === e.tagName || isElementCompatibleForGoogleServices(e)
}, {
  precondition: {hostname: /google\.[a-z]{2,3}(\.[a-z]{2,3})?/},
  isElementCompatible: e => "tw-source-text-ta" === e.id && "TEXTAREA" === e.tagName || isElementCompatibleForGoogleServices(e)
}, {
  precondition: {hostname: ["gingersoftware.com", "iblogbox.com", "prowritingaid.com", "grammar.com"]},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {
    hostname: function () {
      const e = ["languagetoolplus.com", "languagetool.com", "languagetool.org"];
      return EnvironmentAdapter.isProductionEnvironment() || e.push("localhost"), e
    }()
  },
  init() {
    if (!/^(www\.)?languagetool(plus)?\.(com|org)/.test(location.hostname) && "localhost" !== location.hostname) return TweaksManager.DEFAULT_SITE_TWEAKS.init();
    document.documentElement.setAttribute("data-lt-extension-installed", "true");
    const e = StorageController.create();
    e.onReady((() => {
      const t = e.getActiveCoupon();
      t && document.documentElement && (document.documentElement.setAttribute("data-lt-coupon", t.code), document.documentElement.setAttribute("data-lt-coupon-expires", String(t.expires)), document.documentElement.setAttribute("data-lt-coupon-percent", String(t.percent)), dispatchCustomEvent(document, "lt-update-coupon"))
    })), document.addEventListener("lt-upgrade", (() => {
      e.onReady((() => {
        if (e.getUIState().hasPaidSubscription) return;
        Tracker.trackEvent("Action", "upgrade"), e.checkForPaidSubscription().catch(console.error);
        const {firstVisit: t} = e.getStatistics();
        if (t) {
          const e = Math.floor((Date.now() - 1e3 * t) / 1e3 / 60 / 60 / 24);
          let a = String(e);
          e > 365 ? a = "365+" : e > 90 ? a = "90+" : e > 60 || e > 30 ? a = "60+" : e > 14 ? a = "14+" : e > 7 && (a = "7+"), Tracker.trackEvent("Action", "upgrade:days_since_installation", `days:${a}`)
        }
      }))
    })), document.addEventListener("lt-update-dictionary", (() => {
      EnvironmentAdapter.updateDictionary()
    })), document.addEventListener("lt-open-options", (() => {
      EnvironmentAdapter.openOptionsPage(void 0, "external")
    }));
    const t = document.querySelector("#lt-addon-user-token"), a = document.querySelector("#lt-addon-user-email"),
      n = document.querySelector("#lt-addon-user-id"), s = document.querySelector("#lt-addon-force-update");
    t && a && n && e.onReady((() => {
      if (Tracker.trackEvent("Action", "auto_login:prepare"), e.hasCustomServer()) return;
      const {username: o, password: i, token: r} = e.getSettings(), c = Boolean(o && (i || r));
      !c || s ? (e.updateSettings({
        username: a.value,
        password: "",
        token: t.value,
        userId: Number(n.value),
        knownEmail: a.value
      }).then((() => {
        EnvironmentAdapter.startDictionarySync(), e.checkForPaidSubscription().catch(console.error)
      })), Tracker.trackEvent("Action", "auto_login:success")) : c && a.value.toLowerCase() === o.toLowerCase() ? e.updateSettings({
        username: a.value,
        password: "",
        token: t.value,
        userId: Number(n.value)
      }).then((() => {
        e.checkForPaidSubscription().catch(console.error)
      })) : c && t.value && a.value && t.value === r && e.updateSettings({username: a.value})
    })), location.href.includes("/premium") && e.onReady((() => {
      const {premiumClicks: t} = e.getStatistics();
      e.updateStatistics({premiumClicks: t + 1}), Tracker.trackEvent("Action", "pricing_table:view")
    }));
    const o = new URL(window.location.href).searchParams.get("temp_text_id");
    if (o) {
      const e = {command: "GET_VALIDATOR_DATA", id: o};
      browser.runtime.sendMessage(e).then((e => {
        e && isGetValidatorDataResult(e) && waitFor((() => document.querySelector("[data-lt-editor-input]"))).then((t => {
          simulatePaste(t, e.text, e.html)
        }))
      }))
    }
    return e.onReady((() => {
      const {username: t, token: a} = e.getSettings();
      t && a && Array.from(document.querySelectorAll("[data-lt-login-link]")).forEach((e => {
        e.addEventListener("click", (e => {
          location.href = getAutoLoginUrl(t, a), e.preventDefault()
        }), !0)
      }))
    })), TweaksManager.DEFAULT_SITE_TWEAKS.init()
  },
  isElementCompatible: e => !e.classList.contains("mceContentBody") && TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "e.mail.ru"},
  isElementCompatible: e => "content" !== e.dataset.signatureWidget && TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "onedrive.live.com"},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("msOnlineOfficeNotSupported", "https://appsource.microsoft.com/product/office/WA104381727")
}, {
  precondition: {url: Overleaf.EDITOR_PAGE_URL_REGEXP, isMatch: () => Overleaf.isEditorPage()},
  init() {
    Overleaf.init(), TweaksManager.DEFAULT_SITE_TWEAKS.init()
  },
  destroy() {
    Overleaf.destroy(), TweaksManager.DEFAULT_SITE_TWEAKS.destroy()
  },
  persistTemporarySettings: () => !0,
  onNewElement(e) {
    Overleaf.onInputAreaAvailable(e), TweaksManager.DEFAULT_SITE_TWEAKS.onNewElement(e)
  },
  isElementCompatible: e => Overleaf.isEditor(e) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e),
  getEditorGroupId: e => Overleaf.getDocumentId(e) || TweaksManager.DEFAULT_SITE_TWEAKS.getEditorGroupId(e),
  getSelectedText: () => Overleaf.getSelectedText() || TweaksManager.DEFAULT_SITE_TWEAKS.getSelectedText(),
  getSelectedHTML() {
  }
}, {
  precondition: {hostname: ["outlook.live.com", "outlook.office365.com", "outlook.office.com"]},
  isElementCompatible: e => !("true" !== e.getAttribute("contenteditable") || !/nachricht|mensaje|missatge|message|mensagem|bericht|messaggio|wiadomości|meddelandetext|brødtekst|meldingstekst/i.test(e.getAttribute("aria-label") || "")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "prezi.com"},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {hostname: "reverso.net"},
  isElementCompatible: e => "txtSource" === e.id && "TEXTAREA" === e.tagName || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "slack.com"}, isElementCompatible(e) {
    const t = e.parentElement;
    return !(!t || "focusable_search_input" === t.getAttribute("data-qa")) && ("message_input" === t.getAttribute("data-qa") || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e))
  }
}, {
  precondition: {hostname: "my.smashdocs.net"},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {hostname: "spanishdict.com"},
  isElementCompatible: e => "query" !== e.id && TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "writeandimprove.com"},
  isElementCompatible: e => !(!e.hasAttribute("data-question-id") || "TEXTAREA" !== e.tagName) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: ["mail.yandex.com", "mail.yandex.ru", "mail.yandex.uz", "mail.yandex.lv", "mail.yandex.ua", "mail.yandex.co.il"]},
  isClickEventIgnored(e) {
    const t = e.target;
    return !!t && isTextArea(t) && "editor1" === t.id
  }
}, {
  precondition: {hostname: ["translate.yandex.com", "translate.yandex.ru", "translate.yandex.uz", "translate.yandex.lv", "translate.yandex.ua", "translate.yandex.co.il"]},
  isElementCompatible: e => !("fakeArea" !== e.id || !isCEElement(e)) || ("textarea" === e.id && "TEXTAREA" === e.nodeName || (!("translation" !== e.id || !e.getAttribute("contenteditable")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)))
}, {
  precondition: {hostname: ["writer.zoho.com", "writer.zoho.eu"]},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {hostname: "yicat.vip"},
  isElementCompatible: e => !("true" !== e.getAttribute("contenteditable") || !e.classList.contains("atoms-edit")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "zybuluo.com"},
  isElementCompatible: e => "TEXTAREA" === e.tagName && "wmd-input" === e.id || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "blogger.com"},
  isElementCompatible: e => "postingHtmlBox" !== e.id && TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "pad.riseup.net"},
  isElementCompatible: e => "innerdocbody" === e.id || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "duolingo.com"},
  isElementCompatible: e => !("TEXTAREA" !== e.tagName || !e.closest("[data-test*=challenge]")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "coda.io"},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {hostname: ["kialo.com", "kialo-edu.com", "kialo-pro.com"]},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {hostname: "smartcat.com"},
  init() {
    const e = document.createElement("style");
    e.textContent = ".l-content-editor__misspelling { display: none !important; }", (document.head || document.body).appendChild(e), TweaksManager.DEFAULT_SITE_TWEAKS.init()
  },
  isElementCompatible: e => !!(e instanceof HTMLElement && e.isContentEditable && e.closest(".l-content-editor, .l-content-editor__view, .l-content-editor__wrapper")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "xeno.app"},
  isElementCompatible: e => !e.closest("#container-textarea") && TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: "wikitree.com"},
  isElementCompatible: e => !(!e.classList.contains("CodeMirror-code") || "true" !== e.getAttribute("contenteditable")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e)
}, {
  precondition: {hostname: ["clubdesk.com", "clubdesk.de"]},
  isSupported: () => !1,
  unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
  precondition: {url: Thunderbird.COMPOSE_URL_REGEXP},
  init() {
    Thunderbird.getOrCreateShadow(document.body);
    const e = document.querySelectorAll(`${Highlighter.CONTAINER_ELEMENT_NAME}, ${Toolbar.CONTAINER_ELEMENT_NAME}, ${ErrorCard.CONTAINER_ELEMENT_NAME}, ${RephraseCard.CONTAINER_ELEMENT_NAME}`);
    return Array.from(e, (e => e.remove())), TweaksManager.DEFAULT_SITE_TWEAKS.init()
  },
  isElementCompatible: e => "on" === document.designMode && document.body === e || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e),
  shouldDisableOtherSpellCheckers: () => !1,
  onNewElement(e) {
    "on" === document.designMode && document.body && e(document.body, !1)
  }
}, {
  precondition: {hostname: "zeit.de"},
  init: () => (Zeit.init(), TweaksManager.DEFAULT_SITE_TWEAKS.init()),
  isElementCompatible: e => !Zeit.isEditorChild(e) && (!!Zeit.isEditor(e) || (!(!Zeit.isSingleLineInput(e) || e.hasAttribute("spellcheck")) || TweaksManager.DEFAULT_SITE_TWEAKS.isElementCompatible(e))),
  onNewElement(e) {
    Zeit.onEditor(e)
  }
}), TweaksManager.INPUT_AREA_TWEAKS_RULES.push({
  precondition: {hostname: "github.com"},
  create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {isVisible: (t, a) => ("INPUT" !== t.tagName || "issue_title" !== t.id) && e.isVisible(t, a)})
    }
  })
}, {
  precondition: {hostname: ["1und1.de", "gmx.net", "gmx.com", "web.de"]},
  create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => "string" == typeof e.className && e.className.includes("signature"),
            isQuote: e => "quote" === e.getAttribute("name")
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }, getRecipientInfo() {
      try {
        const e = document.querySelector(".objectivation-address[title]") || window.parent.document.querySelector(".objectivation_name[title]");
        if (e) {
          const t = (e.getAttribute("title") || "").replace(/"/g, ""), a = TweaksManager.getEmail(t),
            n = TweaksManager.getFullName(t);
          return Promise.resolve({address: a, fullName: n})
        }
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    }
  })
}, {
  precondition: {hostname: "mail.aol.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => "clear:both" === e.getAttribute("style"),
            isQuote: e => Boolean("DIV" === e.tagName && e.previousElementSibling && "BR" === e.previousElementSibling.tagName && e.textContent && e.textContent.startsWith("-----"))
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: "atlassian.net"}, create: (e, t) => ({
    getHighlighterTweaks(e, a) {
      const n = location.href.match(/\/(wiki|projects|issues)\//), s = t.getHighlighterTweaks(e, a);
      return Object.assign(Object.assign({}, s), {
        getZIndex(e, t) {
          const a = s.getZIndex(e, t);
          return n && e.classList.contains("ProseMirror") ? "auto" === a ? 1 : a + 1 : a
        }
      })
    },
    getToolbarAppearance() {
      const a = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, a), {isVisible: (t, n) => e.className.includes("ProseMirror") || a.isVisible(t, n)})
    },
    filterErrors: (e, t, a) => a.filter((e => !["FALSCHES_ANFUEHRUNGSZEICHEN"].includes(e.rule.id) && !e.rule.id.endsWith("UNPAIRED_BRACKETS") || !["“", "”"].includes(e.originalPhrase)))
  })
}, {
  precondition: {url: /\/jira\/|jira\./i}, create: (e, t) => ({
    getHighlighterTweaks(e, a) {
      const n = t.getHighlighterTweaks(e, a);
      return Object.assign(Object.assign({}, n), {getZIndex: (e, t) => e.classList.contains("richeditor-cover") ? "auto" : n.getZIndex(e, t)})
    }
  })
}, {
  precondition: {url: /backoffice.*?\.check24\.de|mietwagen.*?\.check24\.de/},
  create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = /^\s*(dem erhalt von e-mails hinsichtlich|sie haben noch fragen|war diese e-mail hilfreich)/i,
            t = n.getParsingDetector();
          return Object.assign(Object.assign({}, t), {
            isSignature: t => "TABLE" === t.tagName && !!e.test(t.textContent),
            isQuote: e => !1
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: "basecamp.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = document.querySelector(".chat__tools"), a = e ? e.offsetWidth : 0, n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        getPosition(e, t, s, o, i) {
          const r = n.getPosition(e, t, s, !1, i);
          return r && r.top && r.left && Object.assign(r, {
            left: parseInt(r.left) - a - 8 + "px",
            top: parseInt(r.top) - 6 + "px"
          }), r
        }, getParent(e) {
          const t = e.querySelector("main#main-content");
          return t || n.getParent(e)
        }
      })
    }
  })
}, {
  precondition: {hostname: "paper.dropbox.com"}, create: (e, t) => ({
    getHighlighterTweaks(e, a) {
      const n = t.getHighlighterTweaks(e, a);
      return Object.assign(Object.assign({}, n), {
        getZIndex(e, t) {
          const a = n.getZIndex(e, t);
          return e.classList.contains("ace-editor") ? "auto" === a ? 1 : a + 1 : a
        }
      })
    }, getToolbarAppearance() {
      const a = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, a), {isVisible: (t, n) => !(e instanceof HTMLElement && e.offsetHeight < 30 && e.classList.contains("editor-blank")) && a.isVisible(t, n)})
    }
  })
}, {
  precondition: {hostname: "dropbox.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {isVisible: (t, a) => e.isVisible(t, a, 60)})
    }
  })
}, {
  precondition: {hostname: "msn.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {isVisible: (t, a) => !t.classList.contains("cwt-comment-box") && e.isVisible(t, a)})
    }
  })
}, {
  precondition: {hostname: "editor.reedsy.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = !!e.closest("#redit-text-editor"), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        getPosition(e, t, s, o, i) {
          if (a) {
            const t = s.getBorderBox(e, !1), a = e.ownerDocument.documentElement.clientHeight;
            if (t.bottom >= a) return {left: t.right - i.width - 6 + "px", fixed: !0}
          }
          return n.getPosition(e, t, s, o, i)
        }
      })
    }
  })
}, {
  precondition: {hostname: ["facebook.com", "messenger.com"]}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = !!e.closest(".fbDockWrapper, [data-pagelet=ChatTab], [data-testid=mwchat-tab]"),
        n = t.getToolbarAppearance();
      let s = null, o = /matrix\([0-9\.]+,\s*[0-9\.]+,\s*[0-9\.]+,\s*[0-9\.]+,\s*([0-9\.]+)/;
      if ("textbox" === e.getAttribute("role")) {
        let t = e;
        for (; t = t.parentElement;) {
          const e = window.getComputedStyle(t).transform || "";
          if (o.test(e)) {
            s = t;
            break
          }
        }
      }
      return Object.assign(Object.assign({}, n), {
        isVisible: (t, n) => !(a && !e.textContent.trim()) && n.getPaddingBox(e).width >= 120,
        getPosition(e, t, i, r, c) {
          const l = n.getPosition(e, t, i, !1, c, 15);
          if (l && l.left && s) {
            const e = (window.getComputedStyle(s).transform || "").match(o);
            if (e) {
              const t = parseInt(e[1]);
              l.left = parseInt(l.left) - t + "px"
            }
          }
          return l && l.top && a ? Object.assign(l, {
            top: parseInt(l.top) - i.getDocumentScroll().top + "px",
            fixed: !0
          }) : l
        }
      })
    }
  })
}, {
  precondition: {hostname: /ads\.google\.com/}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = !!e.closest("[eta-headline], .headline-field-group, .long-headline-field, .description-field-group") && isTextInput(e),
        n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        isVisible: (e, t) => !!a || n.isVisible(e, t),
        getPosition: (e, t, a, s, o) => n.getPosition(e, t, a, s, o, 15)
      })
    }
  })
}, {
  precondition: {hostname: "crowdsource.google.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = isTextInput(e) && !!e.closest("#question"), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {isVisible: (e, t) => a || n.isVisible(e, t)})
    }
  })
}, {
  precondition: {url: GoogleDocs.DOCS_URL_REGEXP, isMatch: e => GoogleDocs.isPage(e)}, create(e, t) {
    const a = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e);
    return {
      init() {
        GoogleDocs.initPage(e)
      },
      destroy() {
        GoogleDocs.destroyPage(e)
      },
      onDestroy(t) {
        GoogleDocs.onPageDestroy(e, t)
      },
      getInputAreaWrapper(t, n) {
        const s = Object.assign(Object.assign({}, a), {
          createMutationObserver: t => new FilteringMutationObserver(t, (t => GoogleDocs.isMutationIgnored(t, e))),
          getParsingDetector: () => ({
            createMutationObserver: t => new FilteringMutationObserver(t, (t => GoogleDocs.isMutationIgnored(t, e))),
            isIgnored: (e, t) => GoogleDocs.isIgnoredElement(e),
            isSignature: e => !1,
            isQuote: e => !1,
            isBlock: (e, t) => GoogleDocs.isBlockElement(e, t),
            getParsingOptions: e => ({element: e, preserveLineBreaks: !1, preserveWhitespaces: !1}),
            getReplacementText: (e, t, a) => GoogleDocs.getReplacementText(e),
            replaceText: (e, t, a) => GoogleDocs.replaceText(e, t, a),
            isWhiteSpace: e => " " === e || isWhiteSpace(e)
          }),
          getCacheInvalidationRules() {
            const e = a.getCacheInvalidationRules();
            return Object.assign({}, e, {
              isSkippingElement: {
                self: {
                  attributes: ["id", "class", "style"],
                  childList: !0
                },
                ancestor: {attributes: ["id", "class", "style"]},
                descendant: {attributes: ["id", "class", "style"], characterData: !0, childList: !0}
              },
              replacementText: {},
              parsingOptions: {},
              parsedText: {
                self: {characterData: !0},
                ancestor: {attributes: ["id", "class", "style"]},
                any: {childList: !0}
              },
              paragraphLastValuableNode: {
                self: {
                  attributes: ["id", "class", "style"],
                  characterData: !0,
                  childList: !0
                },
                parent: {childList: !0},
                ancestor: {attributes: ["id", "class", "style"]},
                blockSibling: {attributes: ["id", "class", "style"], characterData: !0, childList: !0}
              },
              isBRElementRelevant: {
                self: {attributes: ["id", "class", "style"], childList: !0},
                parent: {childList: !0},
                ancestor: {attributes: ["id", "class", "style"]},
                blockSibling: {attributes: ["id", "class", "style"], characterData: !0, childList: !0}
              },
              isParagraphNonEmpty: {
                self: {attributes: ["id", "class", "style"], childList: !0},
                ancestor: {attributes: ["id", "class", "style"]},
                descendant: {attributes: ["id", "class", "style"], characterData: !0, childList: !0}
              }
            })
          },
          getKeyboardEventTarget: () => GoogleDocs.getIframeWin() || a.getKeyboardEventTarget(),
          getSelectedText: () => GoogleDocs.getSelectedText() || a.getSelectedText(),
          getSelection: () => GoogleDocs.getSelection(e) || a.getSelection()
        });
        return "canvas" === GoogleDocs.getAdapterType() ? new SVGElementWrapper(e, s, n) : TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, n)
      },
      getHighlighterTweaks(a, n) {
        const s = t.getHighlighterTweaks(a, n);
        return Object.assign(Object.assign({}, s), {
          createMutationObserver: t => new FilteringMutationObserver(t, (t => GoogleDocs.isMutationIgnored(t, e))),
          getZIndex: (e, t) => GoogleDocs.getHighlighterZIndex(e),
          isClickIgnored: e => e.detail === GoogleDocs.MOUSE_EVENT_DETAIL,
          getTextBoxes: (e, t, a, n) => GoogleDocs.getTextBoxes(e, t, a, n),
          observeSubtreeMutations: !0,
          attributeMutations: GoogleDocs.STYLE_ATTRIBUTES
        })
      },
      getToolbarAppearance: () => ({
        isPerformanceCritical: () => !0,
        getParent: e => e.body,
        getClassName: () => GoogleDocs.TOOLBAR_CLASS_NAME,
        isVisible: (e, t) => !0,
        getZIndex: (t, a, n) => GoogleDocs.getToolbarZIndex(e),
        getPosition: (t, a, n, s, o) => GoogleDocs.getToolbarPosition(e, n)
      }),
      getErrorCardTweaks() {
        const e = t.getErrorCardTweaks();
        return {
          getKeyboardEventTarget() {
            const t = GoogleDocs.getIframeWin();
            return t && t.document ? t.document : e.getKeyboardEventTarget()
          }
        }
      },
      getDialogAppearance: () => ({isPositionVisible: () => !1, canDisplayAllSuggestions: () => !0}),
      getMessagePopupAppearance: () => ({isVisible: () => !1}),
      getCheckOptions: (e, t) => ({throttlingLimit: 2 * config.CHECK_THROTTLING_LIMIT, checkTextLevel: !0}),
      canCorrectMultipleErrorsAtOnce: () => !1,
      filterErrors: (e, t, a) => GoogleDocs.filterErrors(e.inputArea, a),
      applyFix: e => GoogleDocs.applyFix(e)
    }
  }
}, {
  precondition: {url: GoogleSlides.SLIDES_URL_REGEXP, isMatch: e => GoogleSlides.isSlide(e)}, create: (e, t) => ({
    init() {
      GoogleSlides.initSlide(e)
    },
    destroy() {
      GoogleSlides.destroySlide(e)
    },
    onDestroy(t) {
      GoogleSlides.onSlideDestroy(e, t)
    },
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = {
        createMutationObserver: e => GoogleSlides.createMutationObserver(e),
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            createMutationObserver: e => GoogleSlides.createMutationObserver(e),
            isIgnored: (t, a) => GoogleSlides.isIgnored(t) || e.isIgnored(t, a),
            isSignature: e => !1,
            isQuote: e => !1,
            isBlock: (e, t) => GoogleSlides.isBlock(e, t),
            getParsingOptions: e => ({element: e, preserveLineBreaks: !1, preserveWhitespaces: !1}),
            getReplacementText: (e, t, a) => GoogleSlides.getReplacementText(),
            replaceText: (e, t, a) => GoogleSlides.replaceText(e, t)
          })
        },
        getCacheInvalidationRules() {
          const e = n.getCacheInvalidationRules();
          return GoogleSlides.getCacheInvalidationRules(e)
        },
        getKeyboardEventTarget: () => GoogleSlides.getKeyboardEventTarget() || n.getKeyboardEventTarget(),
        getSelectedText: () => GoogleSlides.getSelectedText() || n.getSelectedText(),
        getSelection: () => GoogleSlides.getSelection() || n.getSelection()
      };
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    },
    getHighlighterTweaks(a, n) {
      const s = t.getHighlighterTweaks(a, n);
      return Object.assign(Object.assign({}, s), {
        getTargetElement: () => GoogleSlides.getTargetElement(a),
        createMutationObserver: e => GoogleSlides.createMutationObserver(e),
        getVisibleBox: e => GoogleSlides.getVisibleBox(a, e),
        getScrollableElementSize: t => GoogleSlides.getScrollableElementSize(e, t),
        getTextBoxes: (e, t, a, n) => GoogleSlides.getTextBoxes(e, t, a, n)
      })
    },
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {
        getClassName: () => GoogleSlides.TOOLBAR_CLASS_NAME,
        isVisible: (e, t) => !0,
        getPosition: (e, t, a, n, s) => GoogleSlides.getToolbarPosition(e, a)
      })
    },
    getErrorCardTweaks() {
      const e = t.getErrorCardTweaks();
      return {
        getKeyboardEventTarget() {
          const t = GoogleSlides.getKeyboardEventTarget();
          return t && t.document ? t.document : e.getKeyboardEventTarget()
        }
      }
    },
    getDialogAppearance: () => ({isPositionVisible: () => !1, canDisplayAllSuggestions: () => !0}),
    getReplacedParts(e) {
      let a = t.getReplacedParts(e);
      return a = a.concat(GoogleSlides.getReplacedParts(e)), a
    },
    canCorrectMultipleErrorsAtOnce: () => !1,
    filterErrors: (e, t, a) => GoogleSlides.filterErrors(e.inputArea, a),
    applyFix: e => GoogleSlides.applyFix(e)
  })
}, {
  precondition: {hostname: "keep.google.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {
        getPosition(t, a, n, s, o) {
          const i = e.getPosition(t, a, n, !1, o),
            r = t.nextElementSibling && "button" === t.nextElementSibling.getAttribute("role") && t.nextElementSibling.hasAttribute("data-tooltip-text"),
            c = "list item" === t.getAttribute("aria-label");
          return (r || c) && i && i.left && (i.left = parseInt(i.left) - 30 + "px"), i
        }
      })
    }
  })
}, {
  precondition: {hostname: "mail.google.com"}, create(e, t) {
    const a = e => {
      e.target instanceof Element && e.target.closest("[aria-invalid=grammar], [aria-invalid=spelling]") && e.stopImmediatePropagation()
    }, n = () => {
      const e = document.querySelectorAll("[data-overlay-action=spellreplace]");
      e && Array.from(e).forEach((e => {
        const t = e.closest(".pl");
        t && t.remove()
      }))
    };
    return {
      init() {
        e.addEventListener("keyup", n), e.addEventListener("click", a, !0), e.addEventListener("contextmenu", a, !0);
        const t = (Number(document.documentElement.getAttribute("data-lt-gmail-tweaks")) || 0) + 1;
        document.documentElement.setAttribute("data-lt-gmail-tweaks", String(t))
      }, destroy() {
        const t = (Number(document.documentElement.getAttribute("data-lt-gmail-tweaks")) || 0) - 1;
        t <= 0 ? document.documentElement.removeAttribute("data-lt-gmail-tweaks") : document.documentElement.setAttribute("data-lt-gmail-tweaks", String(t)), e.removeEventListener("keyup", n), e.removeEventListener("click", a, !0), e.removeEventListener("contextmenu", a, !0)
      }, getInputAreaWrapper(t, a) {
        const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
          getParsingDetector() {
            const t = n.getParsingDetector(), a = /\s+/g;

            function s(e) {
              return e.replace(a, "")
            }

            let o = null;
            const i = document.querySelector("[class*=gmail_signature], [data-smartmail=gmail_signature]");
            return i && (o = s(i.textContent || ""), i.setAttribute("data-lt-sig", "1")), Object.assign(Object.assign({}, t), {
              isIgnored: (e, a) => ("BLOCKQUOTE" !== e.tagName || "40px" !== e.style.marginLeft) && t.isIgnored(e, a),
              isSignature(t) {
                let a = t.getAttribute("data-lt-sig");
                if (a && ("1" === a && null !== o && o !== s(t.textContent || "") && (t.setAttribute("data-lt-sig", "0"), a = "0"), "0" === a)) return !1;
                return "string" == typeof t.className && (t.className.includes("gmail_signature") || "gmail_signature" === t.getAttribute("data-smartmail") || (t.getAttribute("style") || "").includes("color:WISESTAMP_SIG") || "mixmax-signature" === t.getAttribute("content")) && e.firstElementChild !== t
              },
              isQuote(t) {
                const a = t.className;
                if ("string" != typeof a) return !1;
                if (a.includes("gmail_attr")) return !0;
                if (a.includes("gmail_quote")) {
                  if (e.firstElementChild === t) return !1;
                  let a = !1;
                  for (let e = 0; e < t.children.length; e++) {
                    if ("BLOCKQUOTE" === t.children[e].tagName) {
                      a = !0;
                      break
                    }
                  }
                  if (!a && t.firstElementChild) {
                    if (t.firstElementChild.className.includes("gmail_attr")) return !0
                  }
                }
                return !1
              }
            })
          }, getCacheInvalidationRules() {
            const e = n.getCacheInvalidationRules();
            return Object.assign({}, e, {
              isSkippingElement: {
                self: {
                  attributes: ["id", "class", "style", "contenteditable", "spellcheck", "data-lt-sig", "data-smartmail", "content", "data-mention-id", "usertype"],
                  childList: !0
                },
                parent: {childList: !0},
                ancestor: {attributes: ["id", "class", "style"]},
                descendant: {attributes: ["id", "class", "style"], characterData: !0, childList: !0}
              },
              paragraphLastValuableNode: {
                self: {
                  attributes: ["id", "class", "style", "contenteditable", "spellcheck", "data-lt-sig", "data-smartmail", "content", "data-mention-id", "usertype"],
                  characterData: !0,
                  childList: !0
                },
                parent: {childList: !0},
                ancestor: {attributes: ["id", "class", "style"]},
                blockDescendant: {
                  attributes: ["id", "class", "style", "contenteditable", "spellcheck", "data-lt-sig", "data-smartmail", "content", "data-mention-id", "usertype"],
                  characterData: !0,
                  childList: !0
                }
              },
              isBRElementRelevant: {
                self: {
                  attributes: ["id", "class", "style", "contenteditable", "spellcheck", "data-lt-sig", "data-smartmail", "content", "data-mention-id", "usertype"],
                  childList: !0
                },
                parent: {childList: !0},
                ancestor: {attributes: ["id", "class", "style"]},
                blockDescendant: {
                  attributes: ["id", "class", "style", "contenteditable", "spellcheck", "data-lt-sig", "data-smartmail", "content", "data-mention-id", "usertype"],
                  characterData: !0,
                  childList: !0
                }
              }
            })
          }
        });
        return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
      }, getRecipientInfo() {
        try {
          if ("DIV" === e.tagName) {
            let t = closestElement(e, ".nH[role=dialog]");
            if (t || (t = closestElement(e, "td.I5")), t) {
              const e = t.querySelector("input[name=to]");
              if (e) {
                const t = TweaksManager.getEmail(e.value), a = TweaksManager.getFullName(e.value);
                return Promise.resolve({address: t, fullName: a})
              }
            }
          }
        } catch (e) {
        }
        return Promise.resolve({address: "", fullName: ""})
      }
    }
  }
}, {
  precondition: {url: /translate\.google\.[a-z]{2,3}(\.[a-z]{2,3})?\/community/},
  create: (e, t) => ({
    getToolbarAppearance() {
      const a = isTextInput(e) && e.classList.contains("paper-input"), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {isVisible: (e, t) => a || n.isVisible(e, t)})
    }
  })
}, {
  precondition: {isMatch: e => Gutenberg.isEditor(e)}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {isIgnored: (e, t) => Gutenberg.isElementIgnored(e, t)})
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }, getHighlighterTweaks(e, a) {
      const n = t.getHighlighterTweaks(e, a);
      return Object.assign(Object.assign({}, n), {getZIndex: (e, t) => 1})
    }
  })
}, {
  precondition: {hostname: "hootsuite.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = Boolean(e.parentElement && e.parentElement.closest(".rc-TextArea")), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        getPosition(e, t, s, o, i) {
          const r = n.getPosition(e, t, s, !1, i);
          return a && r && r.left ? Object.assign({}, r, {left: parseInt(r.left) - 28 + "px"}) : r
        }
      })
    }
  })
}, {
  precondition: {hostname: "app.karbonhq.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {isSignature: e => "string" == typeof e.className && e.className.includes("karbon-email-sig")})
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: "linkedin.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = !!e.closest("#msg-overlay"), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        isVisible: (e, t) => !document.querySelector(".msg-form__hovercard.active") && n.isVisible(e, t),
        getPosition(e, t, s, o, i) {
          const r = n.getPosition(e, t, s, !1, i);
          return r && r.top && a ? Object.assign(r, {
            top: parseInt(r.top) - s.getDocumentScroll().top + "px",
            fixed: !0
          }) : r
        }
      })
    }
  })
}, {
  precondition: {hostname: "liveworksheets.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, a), {
        isVisible(t, a) {
          const n = a.getBorderBox(e);
          return n.width >= 300 && n.height >= 75
        }
      })
    }
  })
}, {
  precondition: {hostname: "e.mail.ru"}, create: (e, t) => ({
    getRecipientInfo() {
      try {
        if (e.classList.contains("cke_editable")) {
          const t = closestElement(e, "div.compose-app_popup");
          if (t) {
            const e = t.querySelector("div[class*=contactsContainer] div[class*=contact][data-type=to] > * > div[class*=status_base][title]");
            if (e) {
              const t = e.querySelector("span[class*=text]");
              if (t) {
                const a = TweaksManager.getEmail(e.title), n = TweaksManager.getFullName(t.textContent || "");
                return Promise.resolve({address: a, fullName: n})
              }
            }
          }
        }
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    }
  })
}, {
  precondition: {url: /\/appsuite/}, create: (e, t) => ({
    init() {
      e.setAttribute("data-lt-tweaks", "openxchange")
    }, destroy() {
      e.removeAttribute("data-lt-tweaks")
    }, getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => "string" == typeof e.className && e.className.includes("ox-signature"),
            isQuote: e => !1
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }, getRecipientInfo() {
      try {
        const t = "BODY" === e.tagName && "tinymce" === e.id,
          a = "TEXTAREA" === e.tagName && e.parentElement && e.parentElement.classList.contains("editor");
        if (t || a) {
          const t = closestElement(window.frameElement || e, ".window-container[role=dialog]");
          if (t) {
            const e = t.querySelector(".tokenfield .token span.token-label");
            if (e) {
              const t = TweaksManager.getEmail(e.title), a = TweaksManager.getFullName(e.title);
              return Promise.resolve({address: t, fullName: a})
            }
          }
        }
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    }
  })
}, {
  precondition: {url: /\/statamic/}, create: (e, t) => ({
    getHighlighterTweaks(a, n) {
      const s = e.closest(".bard-editor"), o = t.getHighlighterTweaks(a, n);
      return Object.assign(Object.assign({}, o), {
        getZIndex(e, t) {
          let a = o.getZIndex(e, t);
          if ("auto" !== a && s && s.parentElement) {
            const e = s.parentElement.querySelector(".bard-link-toolbar");
            if (e && e.offsetHeight > 0) return a - 1
          }
          return a
        }
      })
    }
  })
}, {
  precondition: {hostname: "minds.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {
        getPosition(t, a, n, s, o) {
          const i = e.getPosition(t, a, n, !1, o);
          return i && i.left && t.closest(".m-modal-remind-composer") && (i.left = parseInt(i.left) - 27 + "px"), i
        }
      })
    }
  })
}, {
  precondition: {hostname: "notion.so", isMatch: e => Notion.isCommentEditor(e)},
  create: (e, t) => ({
    getToolbarAppearance() {
      const a = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, a), {
        getPosition(t, n, s, o, i, r, c) {
          var l;
          const g = null === (l = e.parentElement) || void 0 === l ? void 0 : l.parentElement,
            d = null == g ? void 0 : g.children[1];
          if (!g || !d || "DIV" !== d.tagName.toUpperCase()) return a.getPosition(t, n, s, o, i, r, c);
          const p = s.getPaddingBox(g, !1), m = s.getScaleFactor(n), u = s.getZoom(n), T = m.x * u, E = m.y * u,
            b = s.getBorderBox(d).width;
          let A = parseInt(s.getStyle(d, "right"));
          Number.isNaN(A) && (A = 0);
          const h = p.right / T - b - A - i.width, _ = p.bottom / E - 9 - i.height;
          return {fixed: !1, left: Math.round(h) + "px", top: Math.round(_) + "px"}
        }
      })
    }, getDialogAppearance() {
      const e = t.getDialogAppearance();
      return Object.assign(Object.assign({}, e), {isPositionVisible: () => !1})
    }
  })
}, {
  precondition: {hostname: "notion.so", isMatch: e => Notion.isEditorLeaf(e)},
  create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {getPosition: (e, t, a, n, s, o, i) => null})
    }
  })
}, {
  precondition: {hostname: "notion.so", isMatch: e => Notion.isEditor(e)}, create: (e, t) => ({
    init() {
      Notion.initInputArea(e)
    }, destroy() {
      Notion.destroyInputArea(e)
    }, onDestroy(t) {
      Notion.onInputAreaDestroy(e, t)
    }, getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        createMutationObserver: e => Notion.createMutationObserver(e),
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            createMutationObserver: e => Notion.createMutationObserver(e),
            isIgnored: (e, t) => Notion.isElementIgnored(e, t)
          })
        },
        getCacheInvalidationRules() {
          const e = n.getCacheInvalidationRules();
          return Notion.getCacheInvalidationRules(e)
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }, getHighlighterTweaks(a, n) {
      const s = t.getHighlighterTweaks(a, n);
      return Object.assign(Object.assign({}, s), {
        getTargetElement: () => Notion.getHighlighterTargetElement(e),
        addScrollEventListener(t) {
          Notion.addHighlighterScrollEventListener(e, t)
        },
        removeScrollEventListener(t) {
          Notion.removeHighlighterScrollEventListener(e, t)
        },
        createMutationObserver: e => Notion.createMutationObserver(e),
        getZIndex: (e, t) => 1e3,
        getVisibleBox: t => Notion.getHighlighterVisibleBox(e, t),
        getScrollableElementSize: t => Notion.getHighlighterScrollableElementSize(e, t),
        getScrollPosition: (t, a, n) => Notion.getHighlighterScrollPosition(e, t, a, n)
      })
    }, getToolbarAppearance() {
      const a = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, a), {
        getParent: t => Notion.getToolbarParent(e),
        getZIndex: (e, t, a) => 1e3,
        getPosition: (e, t, a, n, s, o, i) => Notion.getToolbarPosition(e, t, a, n, s)
      })
    }, getDialogAppearance() {
      const e = t.getDialogAppearance();
      return Object.assign(Object.assign({}, e), {isPositionVisible: () => !1})
    }
  })
}, {
  precondition: {url: /\/otrs/}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => !1,
            isQuote: e => "cite" === e.getAttribute("type")
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {url: Overleaf.EDITOR_PAGE_URL_REGEXP, isMatch: e => Overleaf.isEditor(e) && Overleaf.isEditorPage()},
  create: (e, t) => ({
    init() {
      Overleaf.disableBuiltInValidator(), Overleaf.initPage(e)
    },
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        createMutationObserver: t => Overleaf.createMutationObserver(e, t),
        getParsingDetector() {
          const t = n.getParsingDetector();
          return Object.assign(Object.assign({}, t), {
            createMutationObserver: t => Overleaf.createMutationObserver(e, t),
            isIgnored: (t, a) => Overleaf.isElementIgnored(e, t),
            isSignature: e => !1,
            isQuote: e => !1,
            isBlock: (t, a) => Overleaf.isBlock(e, t, a),
            isBlockElementRelevant: t => Overleaf.isBlockElementRelevant(e, t),
            getReplacementText: (e, t, a) => Overleaf.getReplacementText(),
            replaceText: (t, a, n) => Overleaf.replaceText(e, t, a),
            isWhiteSpace: t => Overleaf.isWhiteSpace(e, t)
          })
        },
        getCacheInvalidationRules() {
          const e = n.getCacheInvalidationRules();
          return Overleaf.getCacheInvalidationRules(e)
        },
        getSelectedText: () => Overleaf.getSelectedText() || n.getSelectedText(),
        getSelection: () => Overleaf.getSelection() || n.getSelection()
      });
      return OverleafSourceEditor.isEditor(e) ? new OverleafSourceEditorWrapper(e, s, a) : OverleafRichEditor.isEditor(e) ? new OverleafRichEditorWrapper(e, s, a) : TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    },
    getHighlighterTweaks(a, n) {
      const s = t.getHighlighterTweaks(a, n);
      return Object.assign(Object.assign({}, s), {
        addScrollEventListener(t) {
          Overleaf.addScrollEventListener(e, t)
        },
        removeScrollEventListener(t) {
          Overleaf.removeScrollEventListener(e, t)
        },
        createMutationObserver: t => Overleaf.createMutationObserver(e, t),
        getScrollableElementSize: t => Overleaf.getScrollableElementSize(e, t),
        getScrollPosition: (t, a, n) => Overleaf.getScrollPosition(e, t, a, n),
        scrollingThrottleLimit: Overleaf.getScrollingThrottleLimit(e)
      })
    },
    getToolbarAppearance() {
      const a = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, a), {
        getClassName: () => Overleaf.TOOLBAR_CLASS_NAME,
        isVisible: (e, t) => !0,
        getPosition(t, n, s, o, i) {
          const r = a.getPosition(e, n, s, o, i);
          return Overleaf.getToolbarPosition(e, o, r)
        }
      })
    },
    getDialogAppearance: () => ({isPositionVisible: () => !1, canDisplayAllSuggestions: () => !1}),
    getMaxTextLength: t => Overleaf.getMaxTextLength(e, t),
    getReplacedParts: e => Overleaf.getReplacedParts(e),
    shouldUseParagraphLevelCaching: e => Overleaf.shouldUseParagraphLevelCaching(e),
    canCorrectMultipleErrorsAtOnce: () => !1,
    getCheckOptions: (e, t) => Overleaf.getCheckOptions(e, t),
    filterErrors: (e, t, a) => Overleaf.filterErrors(t, a),
    applyFix: e => Overleaf.applyFix(e)
  })
}, {
  precondition: {hostname: ["outlook.live.com", "outlook.office365.com", "outlook.office.com"]}, create: (e, t) => ({
    init() {
      const t = (Number(e.getAttribute("data-lt-outlook-tweaks")) || 0) + 1;
      document.documentElement.setAttribute("data-lt-outlook-tweaks", String(t))
    }, destroy() {
      const t = (Number(e.getAttribute("data-lt-outlook-tweaks")) || 0) - 1;
      t <= 0 ? document.documentElement.removeAttribute("data-lt-outlook-tweaks") : document.documentElement.setAttribute("data-lt-outlook-tweaks", String(t))
    }, getInputAreaWrapper(t, a) {
      const n = "data-lt-sig-active", s = "data-lt-sig", o = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e);
      let i = !1;
      const r = Object.assign(Object.assign({}, o), {
        getParsingDetector() {
          const t = o.getParsingDetector(), a = e.querySelector("#signature, #Signature");
          if (a && !a.hasAttribute(n)) {
            i = !0, a.setAttribute(n, "");
            let e = [a];
            e = e.concat(Array.from(a.querySelectorAll("*"))), e = e.concat(Array.from(a.children)), e.forEach((e => {
              hasTextNodeChildWithContent(e) && e.setAttribute(s, "")
            }))
          }
          return Object.assign(Object.assign({}, t), {
            isSignature: e => i ? e.hasAttribute(s) : Boolean(e.id && "signature" === e.id.toLowerCase()),
            isQuote: e => "divRplyFwdMsg" === e.id || !!e.previousElementSibling && "divRplyFwdMsg" === e.previousElementSibling.id
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, r, a)
    }, getRecipientInfo() {
      try {
        if ("DIV" === e.tagName && "textbox" === e.getAttribute("role")) {
          const t = document.querySelector(".ms-BasePicker-text [aria-label]");
          if (t) {
            const e = t.getAttribute("aria-label") || "", a = TweaksManager.getEmail(e),
              n = TweaksManager.getFullName(e);
            return Promise.resolve({address: a, fullName: n})
          }
          const a = e.closest(".customScrollBar");
          if (a) {
            const e = a.querySelector(".allowTextSelection span.lpc-hoverTarget[role=button][aria-haspopup=dialog] span");
            if (e) {
              const t = e.textContent || "", a = TweaksManager.getEmail(t), n = TweaksManager.getFullName(t);
              return Promise.resolve({address: a, fullName: n})
            }
          }
        }
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    }
  })
}, {
  precondition: {hostname: ["teams.live.com", "teams.office365.com", "teams.office.com", "teams.microsoft.com"]},
  create: (e, t) => ({
    getHighlighterTweaks(e, a) {
      const n = t.getHighlighterTweaks(e, a);
      return Object.assign(Object.assign({}, n), {getTargetElement: () => e.parentElement || e})
    }
  })
}, {
  precondition: {hostname: /.+\.sharepoint\.com/}, create: (e, t) => ({
    getHighlighterTweaks(e, a) {
      const n = t.getHighlighterTweaks(e, a);
      return e.classList.contains("cke_editable") ? Object.assign(Object.assign({}, n), {getTargetElement: () => e.parentElement || e}) : n
    }
  })
}, {
  precondition: {hostname: "mail.protonmail.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => "string" == typeof e.className && e.className.includes("protonmail_signature"),
            isQuote: e => !1
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: "rambler.ru"}, create: (e, t) => ({
    getRecipientInfo() {
      try {
        if ("BODY" === e.tagName && "tinymce" === e.id) {
          const e = window.parent.document.querySelector("div[class*=Fields-receiverWrapper] div[class*=Fields-inputWrapper] span[class*=EmailBadge-root] span[class*=EmailBadge-text]");
          if (e) {
            const t = e.textContent || "", a = TweaksManager.getEmail(t), n = TweaksManager.getFullName(t);
            return Promise.resolve({address: a, fullName: n})
          }
        }
        if ("TEXTAREA" === e.tagName && e.classList.contains("QuickReply-textarea-3R")) {
          const e = document.querySelector("div[class*=LetterHeader-from] span[class*=ContactWithDropdown-headerEmail]"),
            t = document.querySelector("div[class*=LetterHeader-from] span[class*=ContactWithDropdown-headerName]");
          if (e && t) {
            const a = TweaksManager.getEmail(e.textContent || ""), n = TweaksManager.getFullName(t.textContent || "");
            return Promise.resolve({address: a, fullName: n})
          }
        }
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    }
  })
}, {
  precondition: {hostname: "reverso.net"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {
        getPosition(t, a, n, s, o) {
          const i = e.getPosition(t, a, n, !1, o);
          return i && i.top && "txtSource" === t.id && document.querySelector("#lnkSpeller:not(.bottom)") && (i.top = parseInt(i.top) - 28 + "px"), i
        }
      })
    }
  })
}, {
  precondition: {hostname: "slack.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isIgnored: (t, a) => "TS-MENTION" !== t.tagName && e.isIgnored(t, a),
            isSignature: e => !1,
            isQuote: e => !1
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }, getToolbarAppearance() {
      const a = e.closest("[data-view-context='message-pane'], [data-view-context='threads-flexpane'], [data-qa='message_editor']"),
        n = t.getToolbarAppearance();
      return a && e.classList.contains("ql-editor") ? Object.assign(Object.assign({}, n), {
        isVisible: (e, t) => !0,
        getPosition(e, t, a, n, s) {
          let o = parseInt(a.getStyle(e, "padding-top")), i = parseInt(a.getStyle(e, "padding-bottom")),
            r = a.getBorderBox(e);
          o > 0 && 0 === i && (i = o, r = moveBox(r, 0, o));
          const c = parseInt(a.getStyle(e, "padding-right")) + 2, l = parseInt(a.getStyle(e, "line-height")) + o + i;
          return {
            fixed: !1,
            left: Math.round(r.right - c - s.width) + "px",
            top: Math.round(r.bottom - s.height + (s.height - l) / 2) + "px"
          }
        }
      }) : n
    }, filterErrors(e, t, a) {
      const n = /\u00A0/g;
      return a.filter((e => !e.fixes[0] || e.fixes[0].value.replace(n, " ") !== e.originalPhrase))
    }
  })
}, {
  precondition: {hostname: "pipedrive.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => e.hasAttribute("data-pipedrivesignature"),
            isQuote: e => "blockQuoteWrapper" === e.getAttribute("data-type")
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: "tabtter.jp"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = isTextArea(e) && "tweetbody" === e.id, n = document.querySelector("span.tweetform_rightbottom_opts"),
        s = n ? n.offsetWidth : 0, o = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, o), {
        getPosition(e, t, n, i, r) {
          const c = o.getPosition(e, t, n, i, r);
          if (!a) return c;
          if (null === c || c.fixed || "string" != typeof c.top || "string" != typeof c.left) return c;
          const l = parseInt(c.top), g = parseInt(c.left);
          return c.top = l + 4 + "px", c.left = g - s + "px", c
        }
      })
    }
  })
}, {
  precondition: {hostname: "email.t-online.de"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => !1,
            isQuote: e => "P" === e.tagName && e.textContent.trim().startsWith("-----Original-Nachricht")
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }, getRecipientInfo() {
      try {
        const e = window.parent.document.querySelector(".multiObjectInputfield-object-text");
        if (e) {
          const t = TweaksManager.getEmail(e.getAttribute("title") || ""),
            a = TweaksManager.getFullName(e.textContent || "");
          return Promise.resolve({address: t, fullName: a})
        }
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    }
  })
}, {
  precondition: {hostname: "mail.missiveapp.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => Boolean(e.matches && e.matches("[data-missive-marker=signature_start] ~ *")),
            isQuote: e => !1
          })
        }, getCacheInvalidationRules() {
          const e = n.getCacheInvalidationRules();
          return Object.assign({}, e, {
            isSkippingElement: {
              self: {attributes: [], childList: !0},
              parent: {childList: !0},
              ancestor: {attributes: ["id", "class", "style"]},
              descendant: {attributes: ["id", "class", "style"], characterData: !0, childList: !0},
              sibling: {attributes: ["id", "data-missive-marker"]}
            }
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: "web.telegram.org"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {
        getPosition(t, a, n, s, o) {
          if (t.classList.contains("composer_rich_textarea")) {
            let e = n.getPaddingBox(t), a = e.bottom - 4 - o.height, s = e.right - 4 - o.width;
            return {fixed: !1, left: Math.round(s) + "px", top: Math.round(a) + "px"}
          }
          return e.getPosition(t, a, n, s, o)
        }
      })
    }
  })
}, {
  precondition: {hostname: "trello.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {isVisible: (t, a) => !document.querySelector(".pop-over.is-shown") && e.isVisible(t, a)})
    }
  })
}, {
  precondition: {hostname: "twitch.tv"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = e.getAttribute("data-a-target"), n = "chat-input" === a, s = "video-chat-input" === a,
        o = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, o), {
        getPosition(e, t, a, i, r) {
          const c = o.getPosition(e, t, a, !1, r);
          if (n && c && c.left) {
            const t = e.closest(".chat-input__textarea"), a = !(!t || !t.querySelector("[data-a-target=bits-button]"));
            return Object.assign(c, {left: parseInt(c.left) - (a ? 60 : 25) + "px"})
          }
          return s && c && c.left && c.top ? Object.assign(c, {
            left: parseInt(c.left) + 3 + "px",
            top: parseInt(c.top) + 5 + "px"
          }) : c
        }
      })
    }
  })
}, {
  precondition: {hostname: "twitter.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {isVisible: (t, a) => e.isVisible(t, a, 20)})
    }
  })
}, {
  precondition: {hostname: "upwork.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = window.innerWidth >= 768 && e.classList.contains("msg-composer-input"), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        isVisible(t, a) {
          const n = a.getBorderBox(e);
          return n.width >= 160 && n.height >= 19
        }, getPosition(e, t, s, o, i) {
          if (a) {
            const t = -54, a = 0, n = s.getBorderBox(e);
            return {
              fixed: !1,
              left: Math.round(n.right - t - i.width) + "px",
              top: Math.round(n.bottom - a - i.height) + "px"
            }
          }
          return n.getPosition(e, t, s, o, i)
        }
      })
    }
  })
}, {
  precondition: {hostname: "vk.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = e.classList.contains("reply_field"), n = !!e.closest(".im-page--chat-input"),
        s = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, s), {
        isVisible(t, a) {
          if ("post_field" === e.id) {
            const t = 50;
            return a.getBorderBox(e).height >= t
          }
          return !e.classList.contains("page_status_input") && s.isVisible(e, a)
        }, getPosition(e, t, o, i, r) {
          const c = s.getPosition(e, t, o, !1, r);
          if (!c || !c.top) return c;
          if (a) {
            const t = parseInt(o.getStyle(e, "padding-right"));
            return Object.assign(c, {left: Math.round(parseInt(c.left) - t) + "px"})
          }
          if (n) {
            const t = parseInt(o.getStyle(e, "padding-right"));
            return Object.assign(c, {
              left: Math.round(parseInt(c.left) - t) + "px",
              top: parseInt(c.top) - o.getDocumentScroll().top + "px",
              fixed: !0
            })
          }
          return c
        }
      })
    }
  })
}, {
  precondition: {hostname: "web.whatsapp.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, a), {isVisible: (t, n) => n.getPaddingBox(e).width > 350 || a.isVisible(t, n)})
    }
  })
}, {
  precondition: {hostname: "mail.yahoo.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => "string" == typeof e.className && e.className.includes("signature"),
            isQuote: e => "string" == typeof e.className && e.className.includes("yahoo_quoted")
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }, getRecipientInfo() {
      try {
        const e = document.querySelector("[data-test-id='email-pill'] [data-test-id='pill']");
        if (e) return Promise.resolve({
          address: TweaksManager.getEmail(e.getAttribute("title") || ""),
          fullName: e.innerText.trim()
        })
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    }
  })
}, {
  precondition: {hostname: ["mail.yandex.com", "mail.yandex.ru", "mail.yandex.uz", "mail.yandex.lv", "mail.yandex.ua", "mail.yandex.co.il"]},
  create: (e, t) => ({
    getRecipientInfo() {
      try {
        if ("DIV" === e.tagName && e.classList.contains("cke_wysiwyg_div") && e.classList.contains("cke_editable")) {
          const e = document.querySelector("div[name=to] span[bubble][data-yabble-email]");
          if (e) {
            const t = TweaksManager.getEmail(e.dataset.yabbleEmail || ""),
              a = TweaksManager.getFullName(e.dataset.yabbleName || "");
            return Promise.resolve({address: t, fullName: a})
          }
          const t = document.querySelector("span.mail-Message-Sender-Email"),
            a = document.querySelector("span.mail-Message-Sender-Name");
          if (t && a) {
            const e = TweaksManager.getEmail(t.textContent || ""), n = TweaksManager.getFullName(a.textContent || "");
            return Promise.resolve({address: e, fullName: n})
          }
        }
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    }
  })
}, {
  precondition: {hostname: ["zen.yandex.com", "zen.yandex.ru", "zen.yandex.uz", "zen.yandex.lv", "zen.yandex.ua", "zen.yandex.co.il"]},
  create: (e, t) => ({
    getToolbarAppearance() {
      const a = isTextArea(e) && e.classList.contains("comment-editor__editor"), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        getPosition(e, t, s, o, i) {
          if (!a) return n.getPosition(e, t, s, o, i);
          const r = n.getPosition(e, t, s, o, i, void 0, 0);
          if (null === r || r.fixed || "string" != typeof r.top || "string" != typeof r.left) return r;
          if (e.parentElement) {
            const t = e.parentElement.querySelector(".comment-editor__editor-controls");
            if (t) {
              const e = parseInt(s.getStyle(t, "width")), a = parseInt(r.top), n = parseInt(r.left);
              r.top = a + 2 + "px", r.left = n - e - 5 + "px"
            }
          }
          return r
        }
      })
    }
  })
}, {
  precondition: {hostname: "youtube.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {isVisible: (t, a) => e.isVisible(t, a, 20)})
    }
  })
}, {
  precondition: {hostname: ["mail.zoho.com", "mail.zoho.eu"]}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isSignature: e => e.id.startsWith("Zm-_Id_-Sgn"),
            isQuote: e => e.classList.contains("zmail_extra")
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: ["dynamics.com"]}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const t = n.getParsingDetector(), a = /\s*\-{6,}\s.+?\s\-{6,}/,
            s = Array.from(e.querySelectorAll("font")).find((e => a.test(e.textContent || "")));
          if (s) {
            s.setAttribute("data-lt-quote", "");
            let e = s;
            for (; e = e.nextElementSibling;) e.setAttribute("data-lt-quote", "")
          }
          return Object.assign(Object.assign({}, t), {
            isSignature: e => e.id.startsWith("signatureFullPage"),
            isQuote: e => e.id.startsWith("mailHistory") || e.hasAttribute("data-lt-quote")
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: ["social.zoho.com", "social.zoho.eu"]}, create: (e, t) => ({
    getToolbarAppearance() {
      const e = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, e), {
        getPosition(t, a, n, s, o) {
          const i = e.getPosition(t, a, n, !1, o);
          return i && i.left && t.classList.contains("inputBox") && (i.left = parseInt(i.left) - 26 + "px"), i
        }
      })
    }
  })
}, {
  precondition: {hostname: "xing.com"}, create: (e, t) => ({
    getToolbarAppearance() {
      const a = !!e.closest("[class*='presentational-message-composer'"), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        getZIndex(e, t, s) {
          const o = n.getZIndex(e, t, s);
          return a ? Math.max(3, Number(o) || 0) : o
        }
      })
    }
  })
}, {
  precondition: {hostname: "wikipedia.org"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector(),
            t = {e: "ᵉ", er: "ᵉʳ", re: "ʳᵉ", ers: "ᵉʳˢ", res: "ʳᵉˢ", d: "ᵈ", de: "ᵈᵉ", des: "ᵈᵉˢ"};
          return Object.assign(Object.assign({}, e), {
            isIgnored(t, a) {
              if (!["SPAN", "TIME", "SMALL", "ABBR", "A"].includes(t.tagName)) return e.isIgnored(t, a);
              const n = t.getAttribute("typeof");
              return !(n && ["mw:DisplaySpace", "mw:Entity", "mw:Transclusion"].includes(n) || t.classList.contains("ve-ce-mwTransclusionNode")) && ("false" === t.getAttribute("contenteditable") || e.isIgnored(t, a))
            }, replaceText: (a, n, s) => t[a] && "SUP" === s.tagName ? t[a] : e.replaceText(a, n, s)
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: ["mastodon.social", "mastodon.cloud", "mamot.fr", "mastodon.online", "mstdn.jp", "switter.at", "pawoo.net", "sinblr.com", "social.tchncs.de"]},
  create: (e, t) => ({
    getToolbarAppearance() {
      const a = !!e.closest(".columns-area__panels__pane__inner"), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        getPosition(e, t, s, o, i) {
          const r = n.getPosition(e, t, s, o, i);
          return r && r.top && a ? Object.assign(r, {
            top: parseInt(r.top) - s.getDocumentScroll().top + "px",
            fixed: !0
          }) : r
        }
      })
    }
  })
}, {
  precondition: {hostname: "hey.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = /^\s*On\s+(\w+)\s+\d+,\s+\d+,\s+.+\s+wrote:\s*$/, t = n.getParsingDetector();
          return Object.assign(Object.assign({}, t), {replaceText: (a, n, s) => (a = a.replace(e, (e => "\ufeff".repeat(e.length))), t.replaceText(a, n, s))})
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {url: Thunderbird.COMPOSE_URL_REGEXP}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {
            isIgnored: (t, a) => !(!t.classList.contains("moz-cite-prefix") || !t.nextElementSibling || "BLOCKQUOTE" !== t.nextElementSibling.tagName) || e.isIgnored(t, a),
            isSignature: e => e.classList.contains("moz-signature"),
            isQuote: t => !!t.classList.contains("moz-forward-container") || e.isQuote(t)
          })
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }, getHighlighterTweaks(a, n) {
      const s = Thunderbird.getOrCreateShadow(e), o = t.getHighlighterTweaks(a, n);
      return Object.assign(Object.assign({}, o), {
        getTargetElement: () => s && s.slot || o.getTargetElement(),
        getZIndex: (e, t) => 100,
        supportsCanvas: () => !1
      })
    }, getToolbarAppearance() {
      const a = Thunderbird.getOrCreateShadow(e), n = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, n), {
        getParent: e => a && a.root || n.getParent(e),
        isVisible: (e, t) => !0
      })
    }
  })
}, {
  precondition: {isMatch: e => isProseMirror(e)}, create(e, t) {
    function a(t) {
      return t.target === e && "attributes" === t.type && "class" === t.attributeName
    }

    return {
      getInputAreaWrapper(t, n) {
        const s = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), o = Object.assign(Object.assign({}, s), {
          createMutationObserver: e => new FilteringMutationObserver(e, a),
          getParsingDetector() {
            const e = s.getParsingDetector();
            return Object.assign(Object.assign({}, e), {createMutationObserver: e => new FilteringMutationObserver(e, a)})
          }
        });
        return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, o, n)
      }, getHighlighterTweaks(e, n) {
        const s = t.getHighlighterTweaks(e, n);
        return Object.assign(Object.assign({}, s), {createMutationObserver: e => new FilteringMutationObserver(e, a)})
      }
    }
  }
}, {
  precondition: {hostname: "freshdesk.com"}, create: (e, t) => ({
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector(), t = /\s*[-_]{2,40}\r?\n/;
          return Object.assign(Object.assign({}, e), {isSignature: e => e instanceof HTMLElement && t.test(e.innerText || "")})
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: "zeit.de", isMatch: e => Zeit.isEditor(e)}, create: (e, t) => ({
    init() {
      Zeit.initEditor(e)
    },
    destroy() {
      Zeit.destroyEditor(e)
    },
    applyFix: e => Zeit.simulateClick(e).then((() => (setTimeout((() => Zeit.simulateKeyInput()), 200), t.applyFix(e)))),
    getHighlighterTweaks(e, a) {
      const n = t.getHighlighterTweaks(e, a);
      return Object.assign(Object.assign({}, n), {getZIndex: (e, t) => 20})
    },
    getInputAreaWrapper(t, a) {
      const n = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e), s = Object.assign(Object.assign({}, n), {
        getParsingDetector() {
          const e = n.getParsingDetector();
          return Object.assign(Object.assign({}, e), {isIgnored: (t, a) => !!Zeit.isIgnoredElement(t) || e.isIgnored(t, a)})
        }
      });
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, s, a)
    }
  })
}, {
  precondition: {hostname: "zeit.de", isMatch: e => Zeit.isSingleLineInput(e)},
  create: (e, t) => ({
    getToolbarAppearance() {
      const a = t.getToolbarAppearance();
      return Object.assign(Object.assign({}, a), {
        isVisible: (t, a) => a.getPaddingBox(e).height >= 14,
        getPosition: (e, t, n, s, o) => a.getPosition(e, t, n, s, o, 14)
      })
    }
  })
});