/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
const config = {
  EXTENSION_HEALTH_RECHECK_INTERVAL: 3e3,
  UI_MODE_RECHECK_INTERVAL: 6e4,
  ACCOUNT_STATUS_RECHECK_INTERVAL: 36e5,
  EXTERNAL_CONFIG_RELOAD_INTERVAL: 144e5,
  PING_INTERVAL: 864e5,
  SYNC_USER_DATA_INTERVAL: 864e5,
  IFRAME_INITILIZATION_RECHECK_INTERVAL: 1500,
  DICTIONARY_SYNC_INTERVAL: 72e5,
  RENDER_INTERVAL: 300,
  TOOLBAR_DECREASE_SIZE_INTERVAL: 900,
  CHECK_REQUEST_TIMEOUT: 5e4,
  CHECK_THROTTLING_LIMIT: 30,
  INSTALL_URL: "https://flappypedia.com",
  UNINSTALL_URL: "https://flappypedia.com",
  USER_DATA_URL: "https://flappypedia.com/console",
  BASE_SERVER_URL: "https://flappypedia.com",
  get MAIN_SERVER_URL() {
    return `${this.BASE_SERVER_URL}/v2`
  },
  MAIN_FALLBACK_SERVER_URL: "https://api-fallback.languagetool.org/v2",
  PREMIUM_SERVER_URL: "https://api.languagetoolplus.com/v2",
  PREMIUM_FALLBACK_SERVER_URL: "https://languagetoolplus.com/api/v2",
  LOCAL_SERVER_URL: "http://localhost:8081/v2",
  FEEDBACK_SERVER_URL: "https://flappypedia.com/send-feedback/",
  EXTERNAL_CONFIG_URL: "https://languagetool.org/webextension_config.json",
  CLIENT_LOGIN_URL: "https://languagetool.org/client-login",
  PING_URL: "https://languagetool.org/ping",
  WEBAPI_URL: "https://languagetool.org/webapi",
  SWITCH_TO_FALLBACK_SERVER_ERRORS: [502, 503, 504],
  MAIN_SERVER_RECHECK_INTERVAL: 18e5,
  MIN_TEXT_LENGTH: 4,
  SHORT_TEXT_MAX_LENGTH: 50,
  MAX_TEXT_LENGTH: 1e4,
  TEXT_LEVEL_MAX_LENGTH_PER_REQUEST: 2e4,
  MAX_TEXT_LENGTH_PERFORMANCE_DEGRADATION: 4e4,
  MAX_TEXT_LENGTH_PREMIUM: 1e5,
  MAX_TEXT_LENGTH_CUSTOM_SERVER: Number.MAX_SAFE_INTEGER,
  PARAGRAPH_LEVEL_CHUNK_LENGTH: 5e3,
  CHECK_DELAY: 1400,
  CHECK_MAX_DELAY: 3500,
  STOPPED_TYPING_TIMEOUT: 2250,
  COLORS: {
    GRAMMAR: {UNDERLINE: "#8F7FFF", BACKGROUND: "rgba(142,128,255,0.2)", EMPHASIZE: "rgba(138,128,255,0.1)"},
    STYLE: {
      UNDERLINE: "#8F7FFF",
      BACKGROUND: "rgba(142,128,255,0.2)",
      EMPHASIZE: "rgba(138,128,255,0.1)",
      TITLE: "#5C4CFF"
    },
    LONG_SENTENCE: {UNDERLINE: "#D2CBFF", BACKGROUND: "rgba(210,203,255,0.2)", EMPHASIZE: "rgba(210,203,255,0.1)"},
    HIDDEN_MATCH: {UNDERLINE: "#F37B23", BACKGROUND: "rgba(253,177,55,0.2)", EMPHASIZE: "rgba(253,177,55,0.1)"},
    SPELLING: {UNDERLINE: "#EB5757", BACKGROUND: "rgba(235,88,88,0.2)", EMPHASIZE: "rgba(239,88,88,0.1)"},
    SYNONYMS: {UNDERLINE: "#0042d7"},
    NEW_SENTENCE: {BACKGROUND: "rgba(30, 225, 151, 0.2)"}
  },
  MAX_FIXES_COUNT: 5,
  MAX_EXCEPTION_COUNT: 6,
  MAX_USAGE_COUNT_ONBOARDING: 5,
  SUPPORTED_SYNONYM_LANGUAGES: ["de", "de-CH", "ru", "sv", "pt", "el", "en", "eo", "it", "fr", "es", "uk", "sk", "sl", "pl", "da", "ro", "nl", "ca"],
  COUNTRY_COUPON_MAPPING: {
    UKRAINE: {countries: ["UA", "BY"], percent: 50},
    "ITALY-DISCOUNT": {countries: ["IT"], percent: 20},
    "SPAIN-DISCOUNT": {countries: ["ES"], percent: 20},
    SOUTH_EUROPE: {
      countries: ["RO", "AL", "GR", "ME", "EE", "LT", "LV", "BG", "CY", "MT", "SK", "SI", "RS", "HR", "XK", "HU", "MD", "TR", "PT"],
      percent: 20
    },
    AFRICA: {
      countries: ["NG", "ET", "EG", "CD", "CG", "TZ", "KE", "UG", "DZ", "SD", "MA", "AO", "MZ", "TN", "CI", "DJ", "SZ", "MU", "GQ", "GA", "BW", "SO", "CD", "ER", "MG"],
      percent: 50
    },
    ASIA: {
      countries: ["ID", "PK", "BD", "VN", "MM", "PH", "UZ", "MY", "NP", "KZ", "KH", "UZ", "TH", "YE", "SY", "JO"],
      percent: 50
    },
    LATIN_AMERICA: {
      countries: ["PE", "VE", "EC", "SV", "DO", "BO", "SR", "AR", "HN", "BZ", "CR", "PA", "GT", "NI", "GY", "UY", "HT", "JM", "TT", "CU"],
      percent: 50
    },
    BRAZIL: {countries: ["BR"], percent: 50}
  },
  COUPON_INTERVAL: 5184e6,
  PACKAGE: {BASIC: "Basic", PREMIUM: "Premium"},
  PICKY_RULES_THAT_ARE_CONSIDERED_ANNOYING: ["EN_QUOTES", "PASSIVE_VOICE", "DASH_RULE", "SENTENCE_FRAGMENT", "TOO_LONG_SENTENCE", "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN", "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN_CH", "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN_2", "PUNCTUATION_PARAGRAPH_END", "FINAL_STOPS", "FINAL_PUNCTUATION", "SMART_QUOTES", "DASH_SPACE_RULES", "HIPHEN_SPACE_RULES", "BRAK_KROPKI", "DYWIZ", "CUDZYSLOW_DRUKARSKI", "EINDE_ZIN_ONVERWACHT", "BACKTICK", "GEDACHTESTREEPJE", "OPTIONAL_HYPHEN"],
  ERRORS_THAT_CAN_BE_CORRECTED_ALL_AT_ONCE: [{
    ruleId: "FALSCHES_ANFUEHRUNGSZEICHEN",
    suggestions: [{
      match: /[„“]/,
      message: "Alle <lt-em>“</lt-em>…<lt-em>”</lt-em> zu <lt-em>„</lt-em>…<lt-em>“</lt-em> ändern"
    }]
  }, {
    ruleId: "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN",
    suggestions: [{
      match: /[„“]/,
      message: "Alle <lt-em>&quot;</lt-em>…<lt-em>&quot;</lt-em> zu <lt-em>„</lt-em>…<lt-em>“</lt-em> ändern"
    }, {
      match: /(^»)|(«$)/,
      message: "Alle <lt-em>&quot;</lt-em>…<lt-em>&quot;</lt-em> zu <lt-em>»</lt-em>…<lt-em>«</lt-em> ändern"
    }]
  }, {
    ruleId: "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN_CH",
    suggestions: [{
      match: /[„“]/,
      message: "Alle <lt-em>&quot;</lt-em>…<lt-em>&quot;</lt-em> zu <lt-em>„</lt-em>…<lt-em>“</lt-em> ändern"
    }, {
      match: /(^«)|(»$)/,
      message: "Alle <lt-em>&quot;</lt-em>…<lt-em>&quot;</lt-em> zu <lt-em>«</lt-em>…<lt-em>»</lt-em> ändern"
    }]
  }, {
    ruleId: "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN_2",
    suggestions: [{
      match: /[‚‘]/,
      message: "Alle <lt-em>'</lt-em>…<lt-em>'</lt-em> zu <lt-em>‚</lt-em>…<lt-em>‘</lt-em> ändern"
    }, {match: /[„“]/, message: "Alle <lt-em>'</lt-em>…<lt-em>'</lt-em> zu <lt-em>„</lt-em>…<lt-em>“</lt-em> ändern"}]
  }, {
    ruleId: "TYPOGRAFISCHE_APOSTROPHE",
    suggestions: [{match: /’/, message: "Alle Apostrophe zu <lt-em>’</lt-em> ändern"}]
  }, {
    ruleId: "EN_QUOTES",
    suggestions: [{
      match: /[“”]/,
      message: "Change all <lt-em>&quot;</lt-em>…<lt-em>&quot;</lt-em> to <lt-em>“</lt-em>…<lt-em>”</lt-em>"
    }]
  }, {
    ruleId: "WRONG_APOSTROPHE",
    suggestions: [{match: /'/, message: "Use <lt-em>'</lt-em> for all bad apostrophes"}, {
      match: /’/,
      message: "Use <lt-em>’</lt-em> for all bad apostrophes"
    }]
  }, {
    ruleId: "PARAGRAF_LEERZEICHEN",
    suggestions: [{match: /§\u00A0/, message: "Alle Leerzeichen nach <lt-em>§</lt-em> ändern"}]
  }]
};