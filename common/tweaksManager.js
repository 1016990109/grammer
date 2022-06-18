/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class TweaksManager {
  static _splitExcludedPart(e, t, a) {
    const r = [], n = e.substr(t, a);
    let s = 0, i = n.indexOf("\n");
    for (; -1 !== i;) r.push({offset: t + s, length: i - s}), s = i + 1, i = n.indexOf("\n", i + 1);
    return r.push({offset: t + s, length: n.length - s}), r
  }

  static _getReplacedParts(e, t, a) {
    const r = [];
    for (const a of t) {
      const t = matchAll(e, a.pattern);
      for (const n of t) {
        let t = n.index;
        if (void 0 === a.excludedParts) {
          const s = n[0].length;
          a.preserveNewlineChars ? r.push(...TweaksManager._splitExcludedPart(e, t, s)) : r.push({offset: t, length: s})
        } else for (let s = 0; s < a.excludedParts.length; s++) {
          if (void 0 === n[s + 1]) continue;
          const i = n[s + 1].length, o = a.excludedParts[s];
          ("boolean" == typeof o ? o : o.test(n[s + 1])) && (a.preserveNewlineChars ? r.push(...TweaksManager._splitExcludedPart(e, t, i)) : r.push({
            offset: t,
            length: i
          })), t += i
        }
      }
    }
    for (const t of a) {
      const a = matchAll(e, t.pattern);
      for (const e of a) if ("replacingText" in t) {
        const a = e.index, n = e[0].length;
        r.push({
          offset: a,
          length: t.replacingText.length,
          replacingText: t.replacingText
        }), r.push({offset: a + t.replacingText.length, length: n - t.replacingText.length})
      } else "getReplacedParts" in t && r.push(...t.getReplacedParts(e))
    }
    return r
  }

  static _testString(e, t, a = !1) {
    Array.isArray(t) || (t = [t]);
    for (const r of t) if ("string" == typeof r) {
      if (e === r || a && e.startsWith(r)) return !0
    } else if (r.test(e)) return !0;
    return !1
  }

  static getEmail(e) {
    const t = TweaksManager.EMAIL_REGEXP.exec(e);
    if (!t) return "";
    return t[0].replace(TweaksManager.EMAIL_DOMAIN_REGEXP, "@replaced.domain").trim()
  }

  static getFullName(e) {
    return e.replace(TweaksManager.EMAIL_REGEXP, "").replace(TweaksManager.ADDRESS_SPECIAL_CHARS_REGEXP, "").trim()
  }

  static getSiteTweaks(e) {
    const t = getDomain(e, "");
    if (!t) return TweaksManager.DEFAULT_SITE_TWEAKS;
    const a = getSubdomains(t);
    for (const t of TweaksManager.SITE_TWEAKS_RULES) {
      let r = !0;
      if ("hostname" in t.precondition) {
        const e = t.precondition.hostname;
        r = a.some((t => TweaksManager._testString(t, e)))
      } else "url" in t.precondition && (r = TweaksManager._testString(e, t.precondition.url));
      if (r && t.precondition.isMatch && (r = t.precondition.isMatch()), r) return Object.assign({}, TweaksManager.DEFAULT_SITE_TWEAKS, t)
    }
    return TweaksManager.DEFAULT_SITE_TWEAKS
  }

  static getInputAreaTweaks(e, t) {
    const a = TweaksManager.DEFAULT_INPUT_AREA_TWEAKS_FACTORY(t), r = getDomain(e, "");
    if (!r) return a;
    const n = getSubdomains(r);
    for (const r of TweaksManager.INPUT_AREA_TWEAKS_RULES) {
      let s = !0;
      if ("hostname" in r.precondition) {
        const e = r.precondition.hostname;
        s = n.some((t => TweaksManager._testString(t, e)))
      } else "url" in r.precondition && (s = TweaksManager._testString(e, r.precondition.url));
      if (s && r.precondition.isMatch && (s = r.precondition.isMatch(t)), s) return Object.assign({}, a, r.create(t, a))
    }
    return a
  }
}

TweaksManager.EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi, TweaksManager.EMAIL_DOMAIN_REGEXP = /@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i, TweaksManager.ADDRESS_SPECIAL_CHARS_REGEXP = /["'`<>]/g, TweaksManager.NON_COMPATIBLE_TAGS = ["TR", "TH", "TD", "THEAD", "TBODY", "TFOOT", "CAPTION", "IFRAME"], TweaksManager.INLINE_DISPLAY_VALUES = ["inline", "inline-block"], TweaksManager.TEXT_IGNORING_DEFAULT_RULES = new Map([["QUOTED_LINE", {
  pattern: /^[ \t]*>.*$/gm,
  preserveNewlineChars: !1
}], ["HTML_CODE_BLOCK", {
  pattern: /\s?<code\b[^>]*>[^]*?<\/code>/gi,
  preserveNewlineChars: !0
}], ["MARKDOWN_BOLD_1", {
  pattern: /(^|\s|\s\()(_|~~)?(\*\*)([^\s\*](?:.*?\S)?)(\*\*)(\2)([\s.!?,:;\)]|$)/g,
  preserveNewlineChars: !1,
  excludedParts: [!1, !1, !0, !1, !0, !1, !1]
}], ["MARKDOWN_BOLD_2", {
  pattern: /(^|\s|\s\()(\*|~~)?(__)([^\s_](?:.*?\S)?)(__)(\2)([\s.!?,:;\)]|$)/g,
  preserveNewlineChars: !1,
  excludedParts: [!1, !1, !0, !1, !0, !1, !1]
}], ["MARKDOWN_ITALIC_1", {
  pattern: /(^|\s|\s\()(__|~~)?(\*)([^\s\*](?:.*?\S)?)(\*)(\2)([\s.!?,:;\)]|$)/g,
  preserveNewlineChars: !1,
  excludedParts: [!1, !1, !0, !1, !0, !1, !1]
}], ["MARKDOWN_ITALIC_2", {
  pattern: /(^|\s|\s\()(\*\*|~~)?(_)([^\s_](?:.*?\S)?)(_)(\2)([\s.!?,:;\)]|$)/g,
  preserveNewlineChars: !1,
  excludedParts: [!1, !1, !0, !1, !0, !1, !1]
}], ["MARKDOWN_BOLD_AND_ITALIC_1", {
  pattern: /(^|\s|\s\()(\*\*\*)([^\s\*](?:.*?\S)?)(\*\*\*)([\s.!?,:;\)]|$)/g,
  preserveNewlineChars: !1,
  excludedParts: [!1, !0, !1, !0, !1]
}], ["MARKDOWN_BOLD_AND_ITALIC_2", {
  pattern: /(^|\s|\s\()(___)([^\s_](?:.*?\S)?)(___)([\s.!?,:;\)]|$)/g,
  preserveNewlineChars: !1,
  excludedParts: [!1, !0, !1, !0, !1]
}], ["MARKDOWN_STRIKETHROUGH", {
  pattern: /(^|\s|\s\()(\*|\*\*|_|__)?(~~)([^\s~](?:.*?\S)?)(~~)(\2)([\s.!?,:;\)]|$)/g,
  preserveNewlineChars: !1,
  excludedParts: [!1, !1, !0, !1, !0, !1, !1]
}], ["MARKDOWN_MULTILINE_CODE_BLOCK", {
  pattern: /(^|[^`])(```)(?!`)([^]*?[^`])(```)(?=[^`]|$)/gm,
  preserveNewlineChars: !0,
  excludedParts: [/^\s$/, !0, !0, !0]
}], ["MARKDOWN_IMAGE_WITHOUT_TITLE", {
  pattern: /(!\[(?:(?:Uploading\s)?(?:Screen\sShot\s|Bildschirmfoto\s)?)?)([^\[\]]+)(\]\(\s*[^()"'\s]*\s*\))/g,
  preserveNewlineChars: !0,
  excludedParts: [!0, !1, !0]
}], ["MARKDOWN_IMAGE_WITH_TITLE", {
  pattern: /(!\[)([^\[\]]+)(\]\(\s*[^()"'\s]+)(\s+)(["'])([^]*?)(\5\s*\))/g,
  preserveNewlineChars: !0,
  excludedParts: [!0, !1, !0, !1, !0, !1, !0]
}], ["MARKDOWN_LINK_WITHOUT_TITLE", {
  pattern: /(\[)([^\[\]]+)(\]\(\s*[^()"'\s]+\s*\))/g,
  preserveNewlineChars: !0,
  excludedParts: [!0, !1, !0]
}], ["MARKDOWN_LINK_WITH_TITLE", {
  pattern: /(\[)([^\[\]]+)(\]\(\s*[^()"'\s]+)(\s+)(["'])([^]*?)(\5\s*\))/g,
  preserveNewlineChars: !0,
  excludedParts: [!0, !1, !0, !1, !0, !1, !0]
}], ["BBCODE_CODE_BLOCK", {
  pattern: /\s?\[code\][^]*?\[\/code\]/gi,
  preserveNewlineChars: !0
}], ["JIRA_CODE_BLOCK", {
  pattern: /\s?{code(:[a-z0-9#]+)?}[^]*?{code}/gi,
  preserveNewlineChars: !0
}], ["TEXTILE_STRIKETHROUGH", {
  pattern: /(^|\s)(~)([^\s~](?:.*?\S)?)(~)([\s.!?,:;]|$)/g,
  preserveNewlineChars: !1,
  excludedParts: [!1, !0, !1, !0, !1]
}], ["TEXTILE_BLOCK_TAG", {
  pattern: /^(h[1-6]|bq|bc|p|pre|###|notextile)\./gim,
  preserveNewlineChars: !1
}], ["WIKITEXT_LINK_WITHOUT_TITLE", {
  pattern: /(\[\[)([a-z:][^|\]\n]*)(\]\])/gi,
  preserveNewlineChars: !1,
  excludedParts: [!0, !1, !0]
}], ["WIKITEXT_LINK_WITH_TITLE", {
  pattern: /(\[\[[a-z:][^|\]\n]*\|)([^\]\n]+)(]])/gi,
  preserveNewlineChars: !1,
  excludedParts: [!0, !1, !0]
}], ["EMOTICONS_LTR", {
  pattern: /(^|\s+)([:;|=][-~^]?[()\[\]\\/|@$*#&XxDOoPp])(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
  preserveNewlineChars: !0
}], ["EMOTICONS_LTR_2", {
  pattern: /(^|\s+)([8B%][-~^][D()\[\]])(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
  preserveNewlineChars: !0
}], ["EMOTICONS_LTR_3", {
  pattern: /(^|\s+)([:;%|=][-~^]?3)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
  preserveNewlineChars: !0
}], ["EMOTICONS_RTL", {
  pattern: /(^|\s+)([()[\]\\/|@$*#&XxDOo][-~^]?[:;%|])(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
  preserveNewlineChars: !0
}], ["XD_SMILE", {
  pattern: /(^|\s+)([xX]D)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
  preserveNewlineChars: !0
}], ["HEART_SMILE", {
  pattern: /(^|\s+)(<[\\/]?3)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
  preserveNewlineChars: !0
}], ["JIRA_SMILEYS", {
  pattern: /(^|\s+)\(([-+!?ynxi]|(\*[rgby]?)|on|off|flag|flagoff)\)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
  preserveNewlineChars: !0
}]]), TweaksManager.TEXT_IGNORING_DEFAULT_RULES_ARRAY = Array.from(TweaksManager.TEXT_IGNORING_DEFAULT_RULES.values()), TweaksManager.TEXT_REPLACING_DEFAULT_RULES = new Map([["BR_TAG", {
  pattern: /<([a-z]+:)?br(\s[^>]*)?\/?>/gi,
  replacingText: "\n"
}], ["HTML_OPENING_TAG", {
  pattern: /<([a-z]+:)?(html|xml|base|head|link|meta|style|title|body|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|main|nav|section|blockquote|dd|div|dl|dt|figcaption|figure|hr|li|ol|p|pre|ul|a|abbr|b|bdi|bdo|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|img|map|track|video|embed|iframe|object|param|picture|portal|source|svg|canvas|noscript|script|del|ins|caption|col|colgroup|table|tbody|td|tfoot|th|thead|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|summary|slot|template|acronym|applet|basefont|bgsound|big|blink|center|content|dir|font|frame|frameset|hgroup|image|keygen|marquee|menuitem|nobr|noembed|noframes|plaintext|rb|rtc|shadow|spacer|strike|tt|xmp)(\s[^>]*)?>/gi,
  replacingText: "⁣"
}], ["HTML_CLOSING_TAG", {
  pattern: /<\/([a-z]+:)?(html|xml|base|head|link|meta|style|title|body|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|main|nav|section|blockquote|dd|div|dl|dt|figcaption|figure|hr|li|ol|p|pre|ul|a|abbr|b|bdi|bdo|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|img|map|track|video|embed|iframe|object|param|picture|portal|source|svg|canvas|noscript|script|del|ins|caption|col|colgroup|table|tbody|td|tfoot|th|thead|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|summary|slot|template|acronym|applet|basefont|bgsound|big|blink|center|content|dir|font|frame|frameset|hgroup|image|keygen|marquee|menuitem|nobr|noembed|noframes|plaintext|rb|rtc|shadow|spacer|strike|tt|xmp)>/gi,
  replacingText: "⁣"
}], ["SVG_OPENING_TAG", {
  pattern: /<([a-z]+:)?(a|altGlyph|altGlyphDef|altGlyphItem|animate|animateColor|animateMotion|animateTransform|circle|clipPath|color-profile|cursor|defs|desc|discard|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|font|font-face|font-face-format|font-face-name|font-face-src|font-face-uri|foreignObject|g|glyph|glyphRef|hatch|hatchpath|hkern|image|line|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|metadata|missing-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|script|set|solidcolor|stop|style|svg|switch|symbol|text|textPath|title|tref|tspan|unknown|use|view|vkern)(\s[^>]*)?>/gi,
  replacingText: "⁣"
}], ["SVG_CLOSING_TAG", {
  pattern: /<\/([a-z]+:)?(a|altGlyph|altGlyphDef|altGlyphItem|animate|animateColor|animateMotion|animateTransform|circle|clipPath|color-profile|cursor|defs|desc|discard|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|font|font-face|font-face-format|font-face-name|font-face-src|font-face-uri|foreignObject|g|glyph|glyphRef|hatch|hatchpath|hkern|image|line|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|metadata|missing-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|script|set|solidcolor|stop|style|svg|switch|symbol|text|textPath|title|tref|tspan|unknown|use|view|vkern)>/gi,
  replacingText: "⁣"
}], ["SELF_CLOSED_TAG", {
  pattern: /<([a-z]+:)?[a-z][^\/]*\/>/gi,
  replacingText: "⁣"
}], ["PAIRED_TAGS", {
  pattern: /(<)((?:[a-z]+:)?[a-z][^\s>]*)(\s[^>]*)?(>)(?=([^]*?)(<\/\2>))/gi,
  getReplacedParts: e => {
    if ("code" === e[2].toLowerCase()) return [];
    const t = e.index, a = e[1].length + e[2].length + (e[3] ? e[3].length : 0) + e[4].length, r = t + a + e[5].length;
    return [{offset: t, length: 1, replacingText: "⁣"}, {offset: t + 1, length: a - 1}, {
      offset: r,
      length: 1,
      replacingText: "⁣"
    }, {offset: r + 1, length: e[6].length - 1}]
  }
}], ["BBCODE_OPENING_TAG", {
  pattern: /\[(img|url|email|post|quote|list|youtube|vimeo|googlemaps|googlewidget|code|modalurl|topic|highlight|left|center|right|font|size|color|s|u|i|b|style|table|tr|td)\b[^\]\n]*\]/gi,
  replacingText: "⁣"
}], ["BBCODE_CLOSING_TAG", {
  pattern: /\[\/(img|url|email|post|quote|list|youtube|vimeo|googlemaps|googlewidget|code|modalurl|topic|highlight|left|center|right|font|size|color|s|u|i|b|style|table|tr|td)\]/gi,
  replacingText: "⁣"
}], ["WORDPRESS_TAG", {
  pattern: /\[[a-z0-9_\-]+\s[a-z0-9_\-]+=.+?\]/gi,
  replacingText: "⁣"
}], ["MARKDOWN_INLINE_CODE_BLOCK", {
  pattern: /(^|\s|\s\()`([^`\n]+)`([\s.!?,:;\)]|$)/g, getReplacedParts: e => {
    const t = e.index + e[1].length + 1;
    return [{offset: t, length: 1, replacingText: "⁣"}, {offset: t + 1, length: e[2].length - 1}]
  }
}], ["JIRA_OPENING_OR_CLOSING_TAG", {
  pattern: /{(color|code|noformat|quote)(:[a-z0-9#]+)?}/gi,
  replacingText: "⁣"
}], ["EMOJI", {
  pattern: /(^|\s+)(\:\w+\:)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
  replacingText: "⁣"
}]]), TweaksManager.TEXT_REPLACING_DEFAULT_RULES_ARRAY = Array.from(TweaksManager.TEXT_REPLACING_DEFAULT_RULES.values()), TweaksManager.DEFAULT_SITE_TWEAKS = {
  init() {
    document.documentElement.setAttribute("data-lt-installed", "true")
  },
  destroy() {
    document.documentElement && document.documentElement.removeAttribute("data-lt-installed")
  },
  isSupported: () => !0,
  unsupportedMessage: () => "",
  isBeta: () => !1,
  persistTemporarySettings: () => !1,
  onNewElement(e) {
  },
  getInitElements: e => [e],
  shouldDisableOtherSpellCheckers: e => !0,
  isElementCompatible(e) {
    if (TweaksManager.NON_COMPATIBLE_TAGS.includes(e.tagName)) return !1;
    if (!((isFormElement(e) || isCEElement(e)) && !e.readOnly)) return !1;
    if ("true" === e.getAttribute("data-lt-active")) return !0;
    if ("false" === e.getAttribute("data-lt-active")) return !1;
    if (isTextInput(e)) return !1;
    if (e.classList.contains("ck-editor__nested-editable") && e.parentElement && e.parentElement.closest(".cke_editable")) return !1;
    if (isHorde(e)) return !0;
    if (isSlateEditor(e) && "true" === e.getAttribute("contenteditable")) return !0;
    if (e.classList.contains("cke_editable")) return !0;
    if (e.classList.contains("ve-ce-documentNode")) return !0;
    if (e.classList.contains("fr-element") && !e.classList.contains("wsc-instance")) return !0;
    if (e.parentElement && e.parentElement.classList.contains("wp-block-code")) return !1;
    const t = e.ownerDocument;
    if (t.head && isTinyMCE(e)) {
      const a = t.createElement("script"), r = "_isTinymceSpellcheckerActivated";
      return a.innerText = `\n                    try {\n                        if (window.parent.tinymce.get(document.body.dataset.id).plugins.tinymcespellchecker) {\n                            document.body.dataset.${r} = true;\n                        }\n                    } catch(e) {}\n                `, t.head.appendChild(a), a.remove(), !Boolean(e.dataset[r])
    }
    return !!(window.innerHeight >= 20 && window.innerWidth >= 100) && !("false" === e.getAttribute("spellcheck") && !e.lang)
  },
  hasFocus: e => hasFocus(e),
  getEditorId: e => Math.round(99999 * Math.random()) + ":" + Date.now(),
  getEditorGroupId(e) {
    try {
      return new URL(e).pathname
    } catch (e) {
      return "unknown"
    }
  },
  getClickEvent: () => "click",
  isClickEventIgnored: e => !e.isTrusted,
  getSelectedText: () => getSelectedText(),
  getSelectedHTML: () => getSelectedHTML()
}, TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY = function (e) {
  return {
    createMutationObserver: e => new MutationObserver(e), getParsingDetector() {
      const t = document.body && document.body.dataset && document.body.dataset.id && document.body.dataset.id.includes("ZmHtmlEditor");
      let a = location.href.includes("/owa/") || !!document.querySelector(".owa-font-compose");
      try {
        a = a || window.parent.location.href.includes("/owa/") || !!window.parent.document.querySelector(".owa-font-compose")
      } catch (e) {
      }
      let r = !1;
      try {
        r = !!window.parent.document.title.match(/roundcube/i) || !!window.parent.location.href.match(/_action=compose/i)
      } catch (e) {
      }
      const n = isProseMirror(e), s = isTinyMCE(e), i = isCKEditor(e), o = isQuillEditor(e), l = isLTEditor(e);
      return {
        createMutationObserver: e => new MutationObserver(e),
        isIgnored(e, t) {
          const a = e.tagName.toUpperCase();
          return !!CEElementInspector.SKIPPING_TAGS.includes(a) || ("none" === t.display || ("BLOCKQUOTE" === a && !l || ("false" === e.getAttribute("contenteditable") || "false" === e.getAttribute("spellcheck") ? (!n || !e.hasAttribute("data-mention-id") && !e.hasAttribute("usertype")) && ((!o || !e.classList.contains("ql-mention")) && ((!s || !e.classList.contains("user-hover")) && ((!i || !e.classList.contains("cke_widget_mention-box")) && ((!i || !e.classList.contains("ck-user__marker")) && ((!i || !e.classList.contains("ck-user__marker-line")) && !(e instanceof HTMLElement && "inline" === t.display && (!e.firstElementChild || 1 === e.childElementCount && e.offsetWidth > 0))))))) : "SUP" === a && e.textContent ? CEElementInspector.SUP_REGEXP.test(e.textContent.trim()) : !(!o || !e.classList.contains("ql-code-block") && !e.classList.contains("ql-formula")))))
        },
        isSignature: e => t ? !!(e.dataset && e.dataset.marker && e.dataset.marker.includes("_SIG_")) : a ? "signature" === e.id.toLowerCase() : !!r && "_rc_sig" === e.id,
        isQuote: e => t ? !!(e.dataset && e.dataset.marker && e.dataset.marker.includes("_QUOTED_")) : !!a && ("divRplyFwdMsg" === e.id || !!e.previousElementSibling && "divRplyFwdMsg" === e.previousElementSibling.id),
        isBlock: (e, t) => CEElementInspector.DISPLAY_BLOCK_VALUES.includes(t.display || ""),
        getReplacementText(e, t, a) {
          if (!TweaksManager.INLINE_DISPLAY_VALUES.includes(a.display)) return "";
          const r = e.tagName.toUpperCase();
          return "BR" === r ? "" : t && ("IMG" === r || "CODE" === r || "false" === e.getAttribute("spellcheck") || e instanceof HTMLElement && "false" === e.contentEditable) ? "⁣" : ""
        },
        replaceText: (e, t, a) => (e = removeZWC(e), e = normalizeWhiteSpaces(e)),
        isWhiteSpace: e => isWhiteSpace(e)
      }
    }, getCacheInvalidationRules: () => ({
      isSkippingElement: {
        self: {attributes: [], childList: !0},
        parent: {childList: !0},
        ancestor: {attributes: ["id", "class", "style"]},
        descendant: {attributes: ["id", "class", "style"], characterData: !0, childList: !0},
        sibling: {attributes: ["id"]}
      },
      replacementText: {
        self: {
          attributes: ["id", "class", "style", "contenteditable", "spellcheck", "data-mention-id", "usertype"],
          childList: !0
        },
        ancestor: {attributes: ["id", "class", "style"]},
        descendant: {attributes: ["id", "class", "style"], characterData: !0, childList: !0}
      },
      isBlock: {self: {attributes: ["id", "class", "style"]}, ancestor: {attributes: ["id", "class", "style"]}},
      parsingOptions: {self: {attributes: ["id", "class", "style"]}, ancestor: {attributes: ["id", "class", "style"]}},
      parsedText: {self: {characterData: !0}, ancestor: {attributes: ["id", "class", "style"]}},
      blockParent: {self: {attributes: ["id", "class", "style"]}, ancestor: {attributes: ["id", "class", "style"]}},
      paragraphLastValuableNode: {
        self: {attributes: [], characterData: !0, childList: !0},
        parent: {childList: !0},
        ancestor: {attributes: ["id", "class", "style"]},
        sibling: {attributes: ["id"]},
        blockSibling: {attributes: [], characterData: !0, childList: !0}
      },
      isBRElementRelevant: {
        self: {attributes: [], childList: !0},
        parent: {childList: !0},
        ancestor: {attributes: ["id", "class", "style"]},
        sibling: {attributes: ["id"]},
        blockSibling: {attributes: [], characterData: !0, childList: !0}
      },
      isTextEndsWithLineBreak: {any: {attributes: [], characterData: !0, childList: !0}},
      isParagraphNonEmpty: {
        self: {attributes: ["id", "class", "style"], childList: !0},
        parent: {childList: !0},
        ancestor: {attributes: ["id", "class", "style"]},
        descendant: {attributes: [], characterData: !0, childList: !0}
      }
    }), getKeyboardEventTarget: () => e, getSelectedText: () => getSelectedText(), getSelection() {
      const t = getSelectionNear(e);
      return t ? {
        startNode: t.anchorNode,
        startOffset: t.anchorOffset,
        endNode: t.focusNode,
        endOffset: t.focusOffset,
        isCollapsed: isSelectionCollapsed(t)
      } : null
    }
  }
}, TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY = function (e, t, a, r) {
  if (isFormElement(e)) {
    if (!t) throw new Error("No mirror instance for FormElementWrapper.");
    return new FormElementWrapper(e, t, a, r)
  }
  return new CEElementWrapper(e, a, r)
}, TweaksManager.DEFAULT_INPUT_AREA_TWEAKS_FACTORY = function (e) {
  return {
    init() {
    },
    destroy() {
    },
    onDestroy(t) {
      onElementDisabled(e, t), onElementRemoved(e, t)
    },
    getMirror: () => isFormElement(e) ? new FormElementMirror(e) : null,
    getInputAreaWrapper(t, a) {
      const r = TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_TWEAKS_FACTORY(e);
      return TweaksManager.DEFAULT_INPUT_AREA_WRAPPER_FACTORY(e, t, r, a)
    },
    getHighlighterTweaks(t, a) {
      const r = Boolean(t.firstElementChild && t.firstElementChild.hasAttribute("data-contents")),
        n = t.classList.contains("ms-rtestate-write"),
        s = Boolean(t.classList.contains("ql-editor") && t.closest(".ql-editor")),
        i = Boolean(t.classList.contains("control-contenteditable__area") && t.closest(".js-control-contenteditable, .js-control-contenteditable-amojo")),
        o = Boolean(t.closest(".app-Talk, .app-talk")),
        l = Boolean(t.closest(".ce-redactor .ce-block .ce-block__content"));
      return {
        getTargetElement: () => a ? t : r && t.parentNode && t.parentNode.parentNode ? t.parentNode : n ? t.closest("table[id*=WikiField]") || t : s ? t.closest(".ql-container") || t : i ? t.closest(".js-control-contenteditable, .js-control-contenteditable-amojo") || t : o ? t.closest(".new-message-form") ? t.parentElement : t : l && t.closest(".ce-block__content") || t,
        addScrollEventListener(t) {
          e.addEventListener("scroll", t)
        },
        removeScrollEventListener(t) {
          e.removeEventListener("scroll", t)
        },
        createMutationObserver: e => new MutationObserver(e),
        getZIndex(e, t) {
          let a = t.getStyle(e, "z-index");
          return a = parseInt(a) || 0, a > 0 || t.isStackingContext(e) ? a + 1 : "auto"
        },
        getVisibleBox: e => e.getPaddingBox(t, !0, !1),
        getScrollableElementSize: t => t.getScrollDimensions(e, !1),
        getScrollPosition: (t, a, r) => t.getScrollPosition(e, a, r),
        getTextBoxes: (e, t, a, r) => e.getRelativeTextBoundingBoxes(t, a, r),
        supportsCanvas: () => !0,
        isClickIgnored: e => !1
      }
    },
    getToolbarAppearance() {
      const t = [Dialog.CONTAINER_ELEMENT_NAME, ErrorCard.CONTAINER_ELEMENT_NAME].join(", "),
        a = "chat-input-control" === e.id && e.classList.contains("window__chatInputControl"), r = isGutenberg(e),
        n = isHorde(e);
      return {
        isPerformanceCritical: () => !1,
        getParent: t => "BODY" === e.tagName ? t.documentElement : t.body,
        getClassName: () => null,
        isVisible(t, s, i = 32) {
          if (a) return !1;
          let o = !0;
          if (o = isTextArea(e) || isTextInput(e) ? !e.value.trim() : !e.textContent.trim(), r && o) return !1;
          if (n) return !0;
          const l = s.getPaddingBox(e);
          return !(o && l.height < i) && (l.width >= 160 && l.height >= 18)
        },
        getZIndex: (e, t, a) => a.getZIndex(e, t),
        getPosition(e, a, r, n, s, i = 18, o = 44) {
          const l = e.ownerDocument.documentElement, c = e.ownerDocument.body;
          if (e === c) {
            return {fixed: !0, left: (n ? 6 : l.clientWidth - s.width - 6) + "px"}
          }
          const d = l.clientHeight, p = getVisibleTopAndBottom(e, r, d, t), g = p.bottom - p.top;
          if (g < i) return null;
          let u = r.getPaddingBox(e);
          if ("IFRAME" === e.tagName) {
            let t = null;
            try {
              t = e.contentWindow.document.documentElement
            } catch (e) {
            }
            if (!t) return null;
            n = r.isRTL(t.ownerDocument.body), u = resizeBox(u, t.clientWidth, t.clientHeight)
          }
          const m = r.getScaleFactor(a), f = r.getZoom(a), h = m.x * f, T = m.y * f;
          let E = (u.top + p.bottom) / T - 6 - s.height, _ = n ? u.left / h + 6 : u.right / h - 6 - s.width;
          if (g <= o) {
            E = (u.top + p.bottom - g / 2) / T - s.height / 2
          }
          const b = u.height >= 250, A = (l.scrollTop || c.scrollTop) + d, L = Math.round(u.top);
          if (b && L + p.bottom >= A && L + s.height + 12 < A) return {fixed: !0, left: Math.round(_) + "px"};
          if (E > A) return null;
          const x = A - s.height - 8;
          return E = Math.min(E, x), {fixed: !1, left: Math.round(_) + "px", top: Math.round(E) + "px"}
        }
      }
    },
    getErrorCardTweaks: () => ({getKeyboardEventTarget: () => e.ownerDocument}),
    getDialogAppearance: () => ({isPositionVisible: () => !0, canDisplayAllSuggestions: () => !0}),
    getMessagePopupAppearance: () => ({isVisible: () => !0}),
    getMaxTextLength: (e, t) => e.hasCustomServer() ? config.MAX_TEXT_LENGTH_CUSTOM_SERVER : e.getUIState().hasPaidSubscription ? config.MAX_TEXT_LENGTH_PREMIUM : "number" == typeof t ? t : config.MAX_TEXT_LENGTH,
    getReplacedParts: e => TweaksManager._getReplacedParts(e, TweaksManager.TEXT_IGNORING_DEFAULT_RULES_ARRAY, TweaksManager.TEXT_REPLACING_DEFAULT_RULES_ARRAY),
    getRecipientInfo() {
      try {
        const t = "BODY" === e.tagName && "tinymce" === e.id, a = "TEXTAREA" === e.tagName && "composebody" === e.id;
        if (t || a) {
          const e = window.parent.document.getElementById("_from"),
            t = window.parent.document.getElementById("compose-subject"),
            a = window.parent.document.getElementById("_to");
          if (e && t && a) {
            const e = TweaksManager.getEmail(a.value), t = TweaksManager.getFullName(a.value);
            return Promise.resolve({address: e, fullName: t})
          }
        }
      } catch (e) {
      }
      return Promise.resolve({address: "", fullName: ""})
    },
    shouldUseParagraphLevelCaching: e => !0,
    canCorrectMultipleErrorsAtOnce: () => !0,
    getCheckOptions: (e, t) => ({
      throttlingLimit: config.CHECK_THROTTLING_LIMIT,
      checkTextLevel: t.length <= config.TEXT_LEVEL_MAX_LENGTH_PER_REQUEST
    }),
    filterErrors: (e, t, a) => a,
    applyFix(e) {
      const {offset: t, length: a, replacementText: r, editor: n} = e;
      return n.inputAreaWrapper.replaceText(t, a, r)
    }
  }
}, TweaksManager.SITE_TWEAKS_RULES = [], TweaksManager.INPUT_AREA_TWEAKS_RULES = [], "undefined" != typeof module && (module.exports = TweaksManager);