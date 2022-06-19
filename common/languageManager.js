/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class LanguageManager {
  static get LANGUAGES() {
    return this._languages || (this._languages = [{code: "ar", name: i18nManager.getMessage("ar")}, {
      code: "ast-es",
      name: i18nManager.getMessage("ast")
    }, {code: "be-by", name: i18nManager.getMessage("be")}, {
      code: "br-fr",
      name: i18nManager.getMessage("br")
    }, {code: "ca-es", name: i18nManager.getMessage("ca")}, {
      code: "ca-es-valencia",
      name: i18nManager.getMessage("ca_ES_valencia")
    }, {code: "da-dk", name: i18nManager.getMessage("da_DK")}, {
      code: "de-at",
      name: i18nManager.getMessage("de_AT")
    }, {code: "de-ch", name: i18nManager.getMessage("de_CH")}, {
      code: "de-de",
      name: i18nManager.getMessage("de_DE")
    }, {code: "el-gr", name: i18nManager.getMessage("el")}, {
      code: "en-au",
      name: i18nManager.getMessage("en_AU")
    }, {code: "en-ca", name: i18nManager.getMessage("en_CA")}, {
      code: "en-gb",
      name: i18nManager.getMessage("en_GB")
    }, {code: "en-nz", name: i18nManager.getMessage("en_NZ")}, {
      code: "en-us",
      name: i18nManager.getMessage("en_US")
    }, {code: "en-za", name: i18nManager.getMessage("en_ZA")}, {
      code: "eo",
      name: i18nManager.getMessage("eo")
    }, {code: "es", name: i18nManager.getMessage("es")}, {
      code: "fa",
      name: i18nManager.getMessage("fa")
    }, {code: "ga-ie", name: i18nManager.getMessage("ga")}, {
      code: "fr",
      name: i18nManager.getMessage("fr")
    }, {code: "gl-es", name: i18nManager.getMessage("gl")}, {
      code: "it",
      name: i18nManager.getMessage("it")
    }, {code: "ja-jp", name: i18nManager.getMessage("ja")}, {
      code: "km-kh",
      name: i18nManager.getMessage("km")
    }, {code: "nl", name: i18nManager.getMessage("nl")}, {
      code: "no",
      name: i18nManager.getMessage("no")
    }, {code: "pl-pl", name: i18nManager.getMessage("pl")}, {
      code: "pt-ao",
      name: i18nManager.getMessage("pt_AO")
    }, {code: "pt-br", name: i18nManager.getMessage("pt_BR")}, {
      code: "pt-mz",
      name: i18nManager.getMessage("pt_MZ")
    }, {code: "pt-pt", name: i18nManager.getMessage("pt_PT")}, {
      code: "ro-ro",
      name: i18nManager.getMessage("ro")
    }, {code: "ru-ru", name: i18nManager.getMessage("ru")}, {
      code: "sk-sk",
      name: i18nManager.getMessage("sk")
    }, {code: "sl-si", name: i18nManager.getMessage("sl")}, {
      code: "sv",
      name: i18nManager.getMessage("sv")
    }, {code: "ta-in", name: i18nManager.getMessage("ta")}, {
      code: "tl-ph",
      name: i18nManager.getMessage("tl")
    }, {code: "uk-ua", name: i18nManager.getMessage("uk")}, {
      code: "zh-cn",
      name: i18nManager.getMessage("zh")
    }], this._languages.sort((function (e, a) {
      return e.name < a.name ? -1 : e.name > a.name ? 1 : 0
    })), this._isSubscribed || (i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, (() => this._languages = null)), this._isSubscribed = !0)), this._languages
  }

  static isLanguageVariant(e) {
    return e.code.includes("-")
  }

  static getPrimaryLanguageCode(e) {
    return e.split("-")[0]
  }

  static formatLanguageCode(e) {
    const a = e.split("-");
    return 1 === a.length ? a[0] : 2 === a.length ? a[0] + "-" + a[1].toUpperCase() : a[0] + "-" + a[1].toUpperCase() + "-" + a[2]
  }

  static getUserLanguageCode() {
    for (const e of navigator.languages) {
      if (e.includes("-") && e.startsWith(navigator.language)) return e
    }
    return navigator.language
  }

  static getUserLanguageCodes() {
    const e = Array.from(navigator.languages, (e => this.getPrimaryLanguageCode(e).toLowerCase()));
    try {
      e.push(this.getPrimaryLanguageCode(EnvironmentAdapter.getUILanguageCode()).toLowerCase())
    } catch (e) {
    }
    return uniq(e)
  }

  static getPreferredLanguageVariant(e) {
    const a = {"en-in": "en-us", "en-ie": "en-gb"}, n = navigator.languages || [];
    for (let o of n) {
      o = o.toLowerCase(), o = a[o] || o;
      for (const a of e) {
        const e = a.toLowerCase();
        if (o.length > 2 && o === e) return a
      }
    }
    return null
  }

  static getLanguagesForGeoIPCountry() {
    return new Promise((function (e, a) {
      let n = !1;
      const o = window.setTimeout((() => {
        n = !0, a(new Error("geoip timeout"))
      }), 15e3);
      fetch("https://languagetool.org/webextension/init", {
        method: "GET",
        mode: "cors"
      }).then((e => e.json())).then((a => {
        if (!n) {
          const n = (a.geoIpCountry || "").toUpperCase();
          e({geoIpLanguages: a.geoIpLanguages || [], geoIpCountry: n}), clearTimeout(o)
        }
      })).catch((e => {
        console.error(e), n || (a(e), clearTimeout(o))
      }))
    }))
  }
}

LanguageManager._languages = null, LanguageManager._isSubscribed = !1, LanguageManager.ALL_LANGUAGES = [{
  code: "ak",
  name: "Akan"
}, {code: "am", name: "አማርኛ"}, {code: "an", name: "aragonés"}, {code: "ar", name: "عربي"}, {
  code: "as",
  name: "অসমীয়া"
}, {code: "ast", name: "Asturianu"}, {code: "be", name: "Беларуская"}, {code: "bg", name: "Български"}, {
  code: "bm",
  name: "Bamanankan"
}, {code: "bn", name: "বাংলা"}, {code: "br", name: "Brezhoneg"}, {code: "bs", name: "босански"}, {
  code: "ca",
  name: "Català"
}, {code: "cs", name: "čeština"}, {code: "cy", name: "Cymraeg"}, {code: "da", name: "Dansk"}, {
  code: "de",
  name: "Deutsch"
}, {code: "el", name: "Ελληνικά"}, {code: "en", name: "English"}, {code: "eo", name: "Esperanto"}, {
  code: "es",
  name: "Español"
}, {code: "et", name: "Eesti keel"}, {code: "eu", name: "Euskara"}, {code: "fa", name: "فارسی"}, {
  code: "fi",
  name: "suomi"
}, {code: "fj", name: "Vosa vaka-Viti"}, {code: "fr", name: "Français"}, {code: "ga", name: "Gaeilge"}, {
  code: "gd",
  name: "Gàidhlig"
}, {code: "gl", name: "Galego"}, {code: "gn", name: "Avañe'ẽ"}, {code: "gu", name: "ગુજરાતી"}, {
  code: "ha",
  name: "هَرْشَن هَوْسَ‎"
}, {code: "he", name: "עברית"}, {code: "hi", name: "हिन्दी"}, {code: "hr", name: "hrvatski"}, {
  code: "hu",
  name: "magyar"
}, {code: "hy", name: "Հայերեն"}, {code: "ia", name: "Interlingua"}, {
  code: "id",
  name: "Bahasa Indonesia"
}, {code: "ig", name: "Ásụ̀sụ̀ Ìgbò"}, {code: "is", name: "íslenska"}, {code: "it", name: "Italiano"}, {
  code: "ja",
  name: "日本語"
}, {code: "kk", name: "Қазақ"}, {code: "km", name: "ខ្មែរ"}, {code: "kn", name: "ಕನ್ನಡ"}, {
  code: "ko",
  name: "한국어"
}, {code: "ku", name: "Kurdî"}, {code: "ks", name: "كشمیری"}, {code: "la", name: "Latina"}, {
  code: "lg",
  name: "Luganda"
}, {code: "lo", name: "ພາສາລາວ"}, {code: "lt", name: "Lietuvių"}, {code: "lv", name: "Latviešu"}, {
  code: "mg",
  name: "malagasy"
}, {code: "mi", name: "Māori"}, {code: "ml", name: "മലയാളം"}, {code: "mk", name: "Македонски"}, {
  code: "mn",
  name: "Монгол"
}, {code: "mr", name: "मराठी"}, {code: "ms", name: "Melayu"}, {code: "my", name: "မြန်မာဘာသာ"}, {
  code: "nb",
  name: "Norsk bokmål"
}, {code: "ne", name: "नेपाली"}, {code: "nn", name: "Norsk nynorsk"}, {code: "no", name: "Norsk"}, {
  code: "nl",
  name: "Nederlands"
}, {code: "nr", name: "isiNdebele"}, {code: "oc", name: "Occitano"}, {code: "or", name: "ଓଡ଼ିଆ"}, {
  code: "pa",
  name: "ਪੰਜਾਬੀ"
}, {code: "pl", name: "Polski"}, {code: "ps", name: "پښتو"}, {code: "pt", name: "Português"}, {
  code: "rm",
  name: "rumantsch"
}, {code: "ro", name: "românesc"}, {code: "ru", name: "Русский"}, {code: "rw", name: "Ikinyarwanda"}, {
  code: "sa",
  name: "संस्कृत"
}, {code: "si", name: "සිංහල"}, {code: "sk", name: "slovenčina"}, {code: "sl", name: "Slovenščina"}, {
  code: "so",
  name: "Soomaali"
}, {code: "sr", name: "Српски"}, {code: "ss", name: "siSwati"}, {code: "st", name: "Sesotho"}, {
  code: "sv",
  name: "Svenska"
}, {code: "ta", name: "தமிழ்"}, {code: "te", name: "తెలుగు"}, {code: "th", name: "ภาษาไทย"}, {
  code: "tl",
  name: "Tagalog"
}, {code: "fil", name: "Filipino"}, {code: "tr", name: "Türkçe"}, {code: "ts", name: "Xitsonga"}, {
  code: "tt",
  name: "Tatarça"
}, {code: "uk", name: "Українська"}, {code: "ur", name: "اُردو"}, {code: "uz", name: "Oʻzbek tili"}, {
  code: "ve",
  name: "Tshivenḓa"
}, {code: "vi", name: "Tiếng Việt"}, {code: "yo", name: "عِدعِ يوْرُبا"}, {code: "zh", name: "中文"}, {
  code: "zu",
  name: "isiZulu"
}], LanguageManager.POPULAR_LANGUAGES = ["de", "en", "es", "fr", "nl", "pl", "pt", "ru", "uk", "zh", "it", "hi"];