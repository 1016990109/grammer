!function () {
  if (location.href.includes("languagetool.org") && document.documentElement.setAttribute("data-lt-extension-installed", "true"), location.href.includes("docs.google.com/document/")) {
    const e = new MutationObserver((t => {
      t.forEach((t => {
        t.addedNodes && t.addedNodes.forEach((t => {
          "SCRIPT" === t.nodeName && t instanceof HTMLScriptElement && !t.hasAttribute("src") && t.hasAttribute("nonce") && (t.textContent += "\n", t.textContent += "$GOOGLE_DOCS_CONTENT_SCRIPT", e.disconnect())
        }))
      }))
    }));
    e.observe(document.documentElement, {
      childList: !0,
      subtree: !0
    }), document.addEventListener("DOMContentLoaded", (() => {
      e.disconnect()
    }))
  }
}();