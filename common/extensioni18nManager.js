/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class Extensioni18nManager extends i18nManagerClass {
  addEventListener(e, s) {
  }

  setLocale(e) {
  }

  getMessage(e, s) {
    return browser.i18n.getMessage(e, s)
  }
}