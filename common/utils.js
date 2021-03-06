/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
function wait(t = 25, e = null) {
  return new Promise((n => setTimeout((() => n(e)), t)))
}

function setAnimationFrameTimeout(t, e) {
  let n = null, o = !1;
  const r = window.setTimeout((() => {
    o || (n = window.requestAnimationFrame((() => t())))
  }), e);
  return {
    destroy: () => {
      o = !0, window.clearTimeout(r), n && window.cancelAnimationFrame(n)
    }
  }
}

function setAnimationFrameInterval(t, e) {
  let n = null, o = !1;
  const r = () => {
    n = setAnimationFrameTimeout((() => {
      o || (t(), r())
    }), e)
  };
  return r(), {
    destroy: () => {
      o = !0, n && (n.destroy(), n = null)
    }
  }
}

function translateElement(t, e) {
  "string" == typeof t && (t = document.querySelector(t)), "string" == typeof e && (e = {key: e}), e.isHTML ? t.innerHTML = i18nManager.getMessage(e.key, e.interpolations) : e.attr ? t[e.attr] = i18nManager.getMessage(e.key, e.interpolations) : t.textContent = i18nManager.getMessage(e.key, e.interpolations)
}

function translateSection(t) {
  Array.from(t.querySelectorAll("[data-t]")).forEach((t => {
    translateElement(t, t.getAttribute("data-t"))
  })), Array.from(t.querySelectorAll("[data-t-placeholder]")).forEach((t => {
    translateElement(t, {key: t.getAttribute("data-t-placeholder"), attr: "placeholder"})
  })), Array.from(t.querySelectorAll("[data-t-html]")).forEach((t => {
    translateElement(t, {key: t.getAttribute("data-t-html"), isHTML: !0})
  })), Array.from(t.querySelectorAll("[data-t-title]")).forEach((t => {
    translateElement(t, {key: t.getAttribute("data-t-title"), attr: "title"})
  })), Array.from(t.querySelectorAll("[data-t-attr]")).forEach((t => {
    const [e, n] = (t => {
      const e = String(t.getAttribute("data-t-attr"));
      try {
        const t = JSON.parse(e);
        if ((t => Array.isArray(t) && "string" == typeof t[0] && "string" == typeof t[1] && 2 === t.length)(t)) return t;
        throw Error()
      } catch (t) {
        return ["", ""]
      }
    })(t);
    e && n && translateElement(t, {key: n, attr: e})
  }))
}

function isRectsEqual(t, e) {
  return t.top === e.top && t.right === e.right && t.bottom === e.bottom && t.left === e.left && t.dashed === e.dashed
}

function isRectContainsRect(t, e) {
  return t.left <= e.left && t.right >= e.right && t.top <= e.top && t.bottom >= e.bottom
}

function getClosestXBox(t, e) {
  const n = e.left + e.width / 2;
  let o = null, r = Number.MAX_SAFE_INTEGER;
  for (const e of t) {
    const t = Math.min(Math.abs(n - e.left), Math.abs(n - e.right));
    t <= r && (o = e, r = t)
  }
  return o
}

function isRectsIntersect(t, e) {
  return !(t.left > e.right || t.right < e.left || t.top > e.bottom || t.bottom < e.top)
}

function isPointInsideRect(t, e, n = 0) {
  return "object" == typeof e && (n = e.y, e = e.x), t.left <= e && e <= t.right && t.top <= n && n <= t.bottom
}

function resizeBox(t, e, n) {
  return Object.assign({}, t, {right: t.left + e, bottom: t.top + n, width: e, height: n})
}

function moveBox(t, e, n) {
  return Object.assign({}, t, {top: t.top + n, right: t.right + e, bottom: t.bottom + n, left: t.left + e})
}

function createContainerElement(t, e) {
  const n = t.createElement(e);
  return n.setAttribute("contenteditable", "false"), navigator.userAgent.includes("Mac OS") && n.classList.add("lt--mac-os"), BrowserDetector.isThunderbird() && n.classList.add("lt--thunderbird"), n
}

function contains(t, e) {
  return "object" == typeof e ? t !== e && t.contains(e) : t instanceof Element && !!t.querySelector(e)
}

function closestElement(t, e) {
  if (t.closest) return t.closest(e);
  {
    let n = t;
    for (; n;) {
      if (n.matches(e)) return n;
      n = n.parentElement
    }
  }
  return null
}

function getCommonParent(t, e) {
  let n = t.parentElement;
  for (; n;) {
    if (contains(n, e)) return n;
    n = n.parentElement
  }
  return null
}

function hasTextNodeChildWithContent(t) {
  return Array.from(t.childNodes).some((t => Boolean(t.nodeType === Node.TEXT_NODE && t.nodeValue && t.nodeValue.trim())))
}

function getFrameElement(t) {
  return t.frameElement
}

function isScrollable(t) {
  const e = window.getComputedStyle(t);
  return "auto" === e.overflowY || "scroll" === e.overflowY
}

function hasFirefoxDesignMode(t) {
  return Boolean(t.ownerDocument && "on" === t.ownerDocument.designMode && "read-write" === t.ownerDocument.defaultView.getComputedStyle(t)["-moz-user-modify"])
}

function hasFocus(t) {
  return t.matches(":focus") || "BODY" === t.nodeName && hasFirefoxDesignMode(t) && t.ownerDocument.hasFocus()
}

const getVisibleTopAndBottom = (() => {
  const t = (t, e, n, o) => {
    const r = t.ownerDocument;
    let i = r.elementFromPoint(n, o);
    if (!i) return !1;
    if (t === i || t.contains(i)) return !0;
    if (!e.length) return !1;
    const a = e.find((t => t.contains(i)));
    return a && (i = r.elementsFromPoint(n, o).find((t => !a.contains(t))) || null), Boolean(i && (t === i || t.contains(i)))
  };
  return (e, n, o, r) => {
    const i = n.getPaddingBox(e, !1), a = e.ownerDocument.contains(e);
    if (i.bottom < 0 || i.top > o || !a) return {top: 0, bottom: i.height};
    let s = [];
    r && (s = Array.from(e.ownerDocument.querySelectorAll(r)));
    let c = i.left + Math.round(i.width / 100 * 33);
    const l = Math.max(i.top, 0);
    let u = l;
    for (; ;) {
      if (t(e, s, c, u)) {
        if (u === l) break;
        for (; u--;) if (!t(e, s, c, u)) {
          u++;
          break
        }
        break
      }
      if (u === i.bottom) break;
      u = Math.min(i.bottom, u + 6)
    }
    const d = Math.min(i.bottom, o);
    let m = d;
    for (; ;) {
      if (t(e, s, c, m - 1)) {
        if (m === d) break;
        for (; m++ < d;) if (!t(e, s, c, m - 1)) {
          m--;
          break
        }
        break
      }
      if (m === u) break;
      m = Math.max(u, m - 6)
    }
    return {top: Math.round(Math.max(0, u - i.top)), bottom: Math.round(Math.max(0, m - i.top))}
  }
})();

function isVisible(t) {
  return (t.offsetWidth > 0 || t.offsetHeight > 0) && "hidden" !== new DomMeasurement(document).getStyle(t, "visibility")
}

function fadeOut(t, e) {
  let n = 1;
  const o = new DomMeasurement(t.ownerDocument), r = setAnimationFrameInterval((() => {
    if (n -= .08, n <= 0) return r.destroy(), void (e && e());
    o.setStyles(t, {opacity: n + " !important"})
  }), 16)
}

function fadeOutAndRemove(t, e) {
  let n = 1;
  const o = new DomMeasurement(t.ownerDocument), r = setAnimationFrameInterval((() => {
    if (n -= .08, n <= 0) return t.remove(), r.destroy(), void (e && e());
    o.setStyles(t, {opacity: n + " !important"})
  }), 16)
}

function hasDarkBackground(t) {
  let e = 20, n = t;
  for (; --e;) {
    const t = window.getComputedStyle(n);
    if (t.backgroundImage && "none" !== t.backgroundImage) return !1;
    const e = t.backgroundColor;
    if (e && "transparent" !== e && getColorOpacity(e) >= .25) return getColorLuminosity(e) <= 35;
    if (!n.parentElement) return !1;
    n = n.parentElement
  }
  return !1
}

function getEventTarget(t) {
  if ("function" == typeof t.composedPath) {
    const e = t.composedPath();
    if (e[0]) return e[0]
  }
  return t.target
}

function dispatchCustomEvent(t, e, n = {}) {
  const o = new CustomEvent(e, {detail: n, cancelable: !0});
  return t.dispatchEvent(o)
}

function simulatePaste(t, e, n) {
  var o, r;
  let i;
  BrowserDetector.isFirefox() || BrowserDetector.isThunderbird() ? i = new ClipboardEvent("paste", {
    bubbles: !0,
    cancelable: !0,
    data: e,
    dataType: "text/plain"
  }) : (i = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer,
    cancelable: !0,
    bubbles: !0
  }), i.clipboardData.setData("text/plain", e), n && i.clipboardData.setData("text/html", n));
  let a = t.dispatchEvent(i);
  if (a) {
    const i = new InputEvent("beforeinput", {data: e, inputType: "insertFromPaste", cancelable: !0, bubbles: !0});
    null === (o = i.dataTransfer) || void 0 === o || o.setData("text/plain", e), n && (null === (r = i.dataTransfer) || void 0 === r || r.setData("text/html", n)), "insertFromPaste" === i.inputType && (a = t.dispatchEvent(i))
  }
  return a
}

function addUseCaptureEvent(t, e, n) {
  const o = isDocumentNode(t) ? t : t.ownerDocument, r = e => {
    const o = getEventTarget(e);
    (isElementNode(o) || isTextNode(o)) && t.contains(o) && n(e)
  };
  return o.defaultView.addEventListener(e, r, !0), {
    destroy() {
      o.defaultView.removeEventListener(e, r, !0)
    }
  }
}

function observeScrollableAncestors(t, e) {
  const n = new DomMeasurement(t.ownerDocument);
  const o = function (t) {
    const e = [];
    let o = t.parentElement;
    for (; o && o !== document.body && o !== document.documentElement;) {
      const t = n.getStyles(o, ["overflow-x", "overflow-y"]), r = t["overflow-x"], i = t["overflow-y"];
      "auto" !== i && "scroll" !== i && "auto" !== r && "scroll" !== r || e.push(o), o = o.parentElement
    }
    return e
  }(t);
  let r = !1;
  const i = () => {
    r || (r = !0, window.requestAnimationFrame((() => {
      r = !1, e()
    })))
  };
  return o.forEach((t => {
    t.addEventListener("scroll", i)
  })), {
    destroy() {
      o.forEach((t => {
        t.removeEventListener("scroll", i)
      })), r = !0
    }
  }
}

const onElementDisabled = (() => {
  let t;
  const e = [];
  return (n, o) => {
    e.push({element: n, callback: o}), t = t || window.setInterval((() => {
      const n = [];
      e.forEach((t => {
        (t.element.readOnly || t.element.disabled || !isVisible(t.element)) && (n.push(t), t.callback(t.element))
      })), n.forEach((t => {
        e.splice(e.indexOf(t), 1)
      })), e.length || (clearInterval(t), t = null)
    }), 600)
  }
})(), onElementRemoved = (() => {
  let t;
  const e = [];
  return (n, o) => {
    e.push({element: n, callback: o}), t || (t = new MutationObserver((n => {
      if (!n.some((t => t.removedNodes.length > 0))) return;
      const o = [];
      for (const t of e) isInDocument(t.element) || (t.callback(t.element), o.push(t));
      o.forEach((t => {
        e.splice(e.indexOf(t), 1)
      })), e.length || (t.disconnect(), t = null)
    })), t.observe(document.documentElement, {childList: !0, subtree: !0}))
  }
})();

function getRangeAtPoint(t) {
  const e = document;
  if (e.caretRangeFromPoint) return e.caretRangeFromPoint(t.x, t.y);
  if (e.caretPositionFromPoint) {
    const n = e.caretPositionFromPoint(t.x, t.y);
    if (!n || !n.offsetNode) return null;
    try {
      const t = new Range;
      return t.setStart(n.offsetNode, n.offset), t.setEnd(n.offsetNode, n.offset), t
    } catch (t) {
      return null
    }
  }
  return null
}

function isSameRange(t, e) {
  return !(!t || !e || t.startContainer !== e.startContainer || t.startOffset !== e.startOffset || t.endOffset !== e.endOffset || t.endContainer !== e.endContainer)
}

function getSelectedText() {
  const t = getActiveElement(), e = t ? t.tagName.toLowerCase() : null;
  return "textarea" === e || "input" === e && /^(?:text|search|password|tel|url)$/i.test(t.type) && "number" == typeof t.selectionStart ? t.value.slice(t.selectionStart, t.selectionEnd) : window.getSelection && window.getSelection() ? window.getSelection().toString() : ""
}

function getSelectedHTML() {
  const t = document.activeElement, e = t ? t.tagName.toLowerCase() : null;
  if ("textarea" === e || "input" === e && /^(?:text|search|password|tel|url)$/i.test(t.type) && "number" == typeof t.selectionStart) return;
  const n = window.getSelection();
  if (!n || 0 === n.rangeCount) return;
  const o = n.getRangeAt(0).cloneContents(), r = document.createElement("div");
  return r.appendChild(o), r.innerHTML
}

function getFocusedElement() {
  let t = document.querySelector(":focus");
  for (; t && t.shadowRoot;) t = t.shadowRoot.querySelector(":focus");
  return t
}

function getActiveElement() {
  let t = document.activeElement;
  for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
  return t
}

function isInDocument(t) {
  if (t.ownerDocument && t.ownerDocument.contains(t)) return !0;
  for (var e = t; e && e.parentNode;) {
    if (e.parentNode === document) return !0;
    e = e.parentNode instanceof DocumentFragment ? e.parentNode.host : e.parentNode
  }
  return !1
}

function getShadowRoot(t) {
  for (var e = t && t.parentNode; e;) {
    if ("[object ShadowRoot]" === e.toString()) return e;
    e = e.parentNode
  }
  return null
}

function getSelectionNear(t) {
  if (BrowserDetector.isFirefox()) return t.ownerDocument.getSelection();
  const e = getShadowRoot(t);
  return e && "getSelection" in e ? e.getSelection() : window.getSelection()
}

function isSelectionCollapsed(t) {
  let e = t.isCollapsed;
  return t.anchorNode === t.focusNode && t.anchorOffset !== t.focusOffset && (e = !1), t.toString().length > 0 && (e = !1), e
}

function getPosition(t, e) {
  var n = e.compareDocumentPosition(t);
  return 4 & n ? "after" : 2 & n ? "before" : null
}

function isCEElement(t) {
  return t instanceof HTMLElement && (t.isContentEditable || "BODY" === t.nodeName && hasFirefoxDesignMode(t))
}

function isFormElement(t) {
  return isTextArea(t) || isTextInput(t)
}

function isTextArea(t) {
  return t instanceof HTMLTextAreaElement
}

function isTextInput(t) {
  return t instanceof HTMLInputElement && ("text" === t.type || "search" === t.type)
}

function isDocumentNode(t) {
  return t.nodeType === Node.DOCUMENT_NODE
}

function isElementNode(t) {
  return t.nodeType === Node.ELEMENT_NODE
}

function isTextNode(t) {
  return t.nodeType === Node.TEXT_NODE
}

function loadStaticFile(t) {
  return fetch(t).then((t => t.text()))
}

function loadStylesheet(t) {
  const e = document.createElement("link");
  e.rel = "stylesheet", e.type = "text/css", (document.head || document.body).appendChild(e)
}

function createStylesheet(t) {
  const e = document.createElement("style");
  return e.type = "text/css", e.appendChild(document.createTextNode(t)), (document.head || document.body).appendChild(e), e
}

function isLTAvailable(t) {
  try {
    return t.document.documentElement.hasAttribute("data-lt-installed")
  } catch (t) {
  }
  return !1
}

function areCssContentScriptsLoadedIntoWindow(t) {
  const e = t.document.createElement("div");
  e.className = "lt-test-element", t.document.documentElement.appendChild(e);
  const n = "absolute" === t.getComputedStyle(e).position;
  return e.remove(), n
}

function areCssContentScriptsLoadedIntoShadowRoot(t) {
  if (!t.ownerDocument || !t.ownerDocument.defaultView) return !0;
  const e = t.ownerDocument.createElement("div");
  e.className = "lt-test-element", t.appendChild(e);
  const n = "absolute" === t.ownerDocument.defaultView.getComputedStyle(e).position;
  return e.remove(), n
}

function injectShadowStyles(t) {
  ["content/styles/shadow.css"].forEach((e => {
    const n = browser.runtime.getURL(e);
    if (!t.querySelector(`[href="${n}"]`)) {
      const e = document.createElement("link");
      e.href = n, e.rel = "stylesheet", t.append(e)
    }
  }))
}

function openPopup(t, e, n, o = Date.now().toString()) {
  const r = void 0 !== window.screenLeft ? window.screenLeft : window.screenX,
    i = void 0 !== window.screenTop ? window.screenTop : window.screenY,
    a = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
    s = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
    c = a / window.screen.availWidth, l = (a - e) / 2 / c + r, u = (s - n) / 2 / c + i;
  return window.open(t, o, `\n      scrollbars=yes,\n\t  resizable=yes,\n      width=${e / c},\n      height=${n / c},\n      top=${u},\n      left=${l}\n      `)
}

function dataURItoBlob(t) {
  const e = atob(t.split(",")[1]), n = t.split(",")[0].split(":")[1].split(";")[0], o = new ArrayBuffer(e.length),
    r = new Uint8Array(o);
  for (let t = 0; t < e.length; t++) r[t] = e.charCodeAt(t);
  return new Blob([o], {type: n})
}

const goToManagedLogin = function () {
  let t, e = null;
  const n = e => {
    e.origin.match(/^chrome|moz|safari/) && t(e.data)
  };
  return function (o, r) {
    const i = window;
    let a = null;
    t = function (t) {
      const [e, n] = JSON.parse(t);
      e && n && (s(), r(e, n))
    };
    const s = function () {
      e && window.clearInterval(e), i.removeEventListener("message", n);
      try {
        browser.storage.local.remove("managedLoginCredentials")
      } catch (t) {
      }
      try {
        a && a.close()
      } catch (t) {
      }
    };
    s(), e = window.setInterval((() => {
      browser.storage.local.get("managedLoginCredentials").then((e => {
        e.managedLoginCredentials && t(e.managedLoginCredentials)
      })).catch((() => null))
    }), 400), i.addEventListener("message", n);
    const c = browser.runtime.getURL("/welcome/managedLoginRedirectUri.html"),
      l = o + (o.includes("?") ? "&" : "?") + "redirect_uri=" + encodeURIComponent(c);
    a = openPopup(l, 640, 480)
  }
}(), getAutoLoginUrl = function (t, e, n) {
  let o = `https://languagetool.org/webextension/login?email=${encodeURIComponent(t)}&addon_token=${encodeURIComponent(e)}`;
  return n && (o += `&temp_text_id=${encodeURIComponent(n)}`), o
}, goToLogin = function () {
  let t, e = null;
  const n = e => {
    t(e.data)
  };
  return function (o, r) {
    const i = window;
    let a = null;
    t = function (t) {
      const [e, n] = JSON.parse(t);
      e && n && (s(), r(e, n))
    };
    const s = function () {
      e && window.clearInterval(e), i.removeEventListener("message", n);
      try {
        browser.storage.local.remove("loginCredentials")
      } catch (t) {
      }
      try {
        a && a.close()
      } catch (t) {
      }
    };
    s(), e = window.setInterval((() => {
      browser.storage.local.get("loginCredentials").then((e => {
        e.loginCredentials && t(e.loginCredentials)
      })).catch((() => null))
    }), 400), i.addEventListener("message", n);
    const c = browser.runtime.getURL("/welcome/loginRedirectUri.html"),
      l = o + (o.includes("?") ? "&" : "?") + "callback_uri=" + encodeURIComponent(c);
    a = openPopup(l, 640, 480, "lt-login-" + Date.now())
  }
}();
let getColorOpacity, getColorLuminosity;

function getHistoricPremiumErrors(t) {
  const e = 300;
  let n = 0;
  const o = Date.now();
  let r = 0;
  for (const i of t.hiddenErrors) {
    const t = +new Date(i.day);
    if (o - t > 864e6) break;
    if (r = t, n += i.count, n > e) {
      n = e;
      break
    }
  }
  let i = String(n);
  n >= e && (i = "300+");
  return {hiddenErrorsCount: n, hiddenErrorsCountStr: i, dayCount: Math.ceil((o - r) / 1e3 / 60 / 60 / 24)}
}

function getPremiumUrl(t, e = 0, n = 0, o = 0, r = "", i) {
  const a = [];
  return a.push(`pk_campaign=${encodeURIComponent(t)}`), i && a.push(`textLang=${encodeURIComponent(i)}`), r && a.push(`historicMatches=${encodeURIComponent(r)}`), e && a.push(`grammarMatches=${encodeURIComponent(e)}`), o && a.push(`punctuationMatches=${encodeURIComponent(o)}`), n && a.push(`styleMatches=${encodeURIComponent(n)}`), "https://languagetool.org/premium?" + a.join("&")
}

function isExtensionRuntimeError(t) {
  return t.startsWith("Invocation of form runtime.connect(null, ) doesn't match definition runtime.connect") || t.startsWith("Extension context invalidated")
}

!function () {
  const t = / /g, e = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{8})$/i,
    n = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i,
    o = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, r = /^rgba?\(/i,
    i = /^rgba?\((\d+),(\d+),(\d+)(?:,(\d*(?:\.\d+)?))?\)/i, a = /^hsla?\(/i,
    s = /^hsla?\(\d+,\d+%,(\d+)%(?:,(\d*(?:\.\d+)?))?\)/i;

  function c(t, e, n) {
    const o = Math.max(t, e, n) / 255, r = Math.min(t, e, n) / 255;
    return Math.round((o + r) / 2 * 100)
  }

  getColorOpacity = function (c) {
    if ("string" != typeof c) return 3 === c.length ? 1 : c[3];
    if (c = c.replace(t, ""), e.test(c)) {
      const t = n.exec(c) || o.exec(c);
      if (t && t[4]) return parseInt(2 === t[4].length ? t[4] : t[4] + t[4], 16) / 255
    } else if (r.test(c)) {
      const t = i.exec(c);
      if (t && t[4]) return +t[4]
    } else if (a.test(c)) {
      const t = s.exec(c);
      if (t && t[2]) return +t[2]
    }
    return 1
  }, getColorLuminosity = function (l) {
    if ("string" != typeof l) return c(l[0], l[1], l[2]);
    if (l = l.replace(t, ""), e.test(l)) {
      const t = n.exec(l) || o.exec(l);
      if (t) {
        return c(parseInt(2 === t[1].length ? t[1] : t[1] + t[1], 16), parseInt(2 === t[2].length ? t[2] : t[2] + t[2], 16), parseInt(2 === t[3].length ? t[3] : t[3] + t[3], 16))
      }
    } else if (r.test(l)) {
      const t = i.exec(l);
      if (t) {
        return c(+t[1], +t[2], +t[3])
      }
    } else if (a.test(l)) {
      const t = s.exec(l);
      if (t) return +t[1]
    }
    return 100
  }
}();
const HEX_NUMS = Array.from({length: 16}, ((t, e) => e.toString(16))), padRightWithHex = (t, e) => {
  const n = t.length, o = Math.max(0, e - n);
  return t + Array.from({length: o}, (() => {
    const t = Math.floor(Math.random() * HEX_NUMS.length);
    return HEX_NUMS[t]
  })).join("")
}, hexToUuid = t => {
  if (t.length > 24) throw new Error(`Given unique ID "${t}" exceeds length of 24`);
  const e = t.slice(0, 12), n = t.slice(12, 20), o = t.slice(20, 24);
  return [padRightWithHex(n, 12), padRightWithHex(o, 4), "4A96", "BEA4", padRightWithHex(e, 12)].join("-")
};

function shuffle(t) {
  return Array(t.length).fill(null).map(((t, e) => [Math.random(), e])).sort((([t], [e]) => t - e)).map((([, e]) => t[e]))
}

function isDraftJS(t) {
  return Boolean(t.closest(".DraftEditor-editorContainer")) || /(facebook|messenger)\.com/.test(location.host) && (t.hasAttribute("aria-describedBy") || ["textfield", "textbox"].includes(t.getAttribute("role") || "")) && t.hasAttribute("contenteditable") || !!t.querySelector("div[data-contents=true]") && t.classList.contains("notranslate")
}

function isTinyMCE(t) {
  return t.classList.contains("mce-content-body") || t.classList.contains("mceContentBody")
}

function isCKEditor(t) {
  const e = t.classList.contains("cke_editable"),
    n = "string" == typeof t.className && t.className.includes("ck-editor_");
  return e || n
}

function isSlateEditor(t) {
  return t.hasAttribute("data-slate-editor")
}

function isWriterDuet(t) {
  return location.href.includes("writerduet.com")
}

function isQuillEditor(t) {
  return t.classList.contains("ql-editor")
}

function isOpenXchangeEditor(t) {
  return !!t.closest("[data-app-name='io.ox/office/text']")
}

function isProseMirror(t) {
  return t.classList.contains("ProseMirror")
}

function isGutenberg(t) {
  return t.classList.contains("editor-rich-text__editable") || t.classList.contains("block-editor-writing-flow") || t.classList.contains("block-editor-rich-text__editable")
}

function isTrixEditor(t) {
  return "trix-editor" === t.nodeName.toLowerCase()
}

function isLTEditor(t) {
  return t.classList.contains("lt-textarea__textarea")
}

function isCodeMirror(t) {
  return t.classList.contains("CodeMirror-code")
}

function isGoogleDocsCanvas(t) {
  return t.classList.contains("kix-canvas-tile-content")
}

function isHorde(t) {
  return window !== window.parent && t.ownerDocument && t === t.ownerDocument.body && t.ownerDocument.documentElement.isContentEditable && t.classList.contains("cke_show_borders")
}

function isMedium(t) {
  return location.host.includes("medium.com") && "true" === t.getAttribute("g_editable")
}

function isWikpedia(t) {
  return t.classList.contains("ve-ce-rootNode")
}

function isThunderbird(t) {
  return location.href.startsWith("about:blank?compose") && "BODY" === t.tagName && "on" === document.designMode
}

function isNotion(t) {
  return location.href.includes("notion.so")
}

function getConfigForMultipleErrorCorrection(t, e) {
  for (const n of config.ERRORS_THAT_CAN_BE_CORRECTED_ALL_AT_ONCE) {
    if (n.ruleId !== t.rule.id) continue;
    if (t.originalPhrase.length !== e.length) continue;
    const o = n.suggestions.find((t => t.match.test(e)));
    if (o) return {suggestion: o, ruleId: t.rule.id}
  }
}

function containsSimilarErrors(t, e) {
  return t.some((t => t.rule.id === e.rule.id && t.start !== e.start))
}

function hasGrammarMistakes(t) {
  return t.displayedErrors.concat(t.displayedPremiumErrors).some((t => !1 === t.isPunctuationError && !1 === t.isSpellingError && !1 === t.isStyleError && !1 === t.isCustomError))
}

function hasSpellingMistakes(t) {
  return t.displayedErrors.concat(t.displayedPremiumErrors).some((t => t.isSpellingError))
}

"undefined" != typeof module && (module.exports.getColorOpacity = getColorOpacity, module.exports.getColorLuminosity = getColorLuminosity);