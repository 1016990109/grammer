
try{
    var window = self;
    importScripts(
        "../common/browser-polyfill.min.js",
        "../config/config.js",
        "../common/browserDetector.js",
        "../core/utils.js",
        "../common/utils.js",
        "../common/eventBus.js",
        "../common/messages.js",
        "../common/i18nManager.js",
        "../common/extensioni18nManager.js",
        "../common/languageManager.js",
        "../common/storageController.js",
        "../common/extensionStorageController.js",
        "../common/environmentAdapter.js",
        "../common/extensionEnvironmentAdapter.js",
        "../common/thunderbird.js",
        "../common/extension-init.js",
        "../common/tracker.js",
        "../core/GraphemeSplitter.js",
        "../core/Checker.js",
        "../background/flappy/flappy.data.js",
        "../background/flappy/flappy.auth.js",
        "../background/flappy/flappy.adapter.js",
        "../background/dictionarySync.js",
        "../background/synonyms.js",
        "../background/phrases.js",
        "./extension-main.js"
    )
}catch (e) {
    console.error("importScript "+e.message)
}

