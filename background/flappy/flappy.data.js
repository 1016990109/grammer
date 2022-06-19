
/**
 * Wiki摘要信息
 */
class WikiItem {
    constructor(id, name, content) {
        this.name = name
        this.id = id
        this.content = content
    }
}
class SearchItem {
    constructor(wiki, startIndex, endIndex) {
        this.wikiItem = wiki
        this.startIndex = startIndex
        this.endIndex = endIndex
    }
}
class WikiManager {
    constructor() {
        this.wikiInfoList = this.getWikiKeyList()
    }
    /**
     * 需要匹配的关键词
     */
    getWikiKeyList() {
        return [
            new WikiItem("1", "李白", "李白 test"),
            new WikiItem("2", "雨霖铃", "雨霖铃 test"),
            new WikiItem("3", "UI", "ui test"),
            new WikiItem("4", "WFH", "wfh test"),
            new WikiItem("5", "WIP", "wip test")
        ]
    }
    matchWikiContent(content) {
        let result = []
        if (content && content.length > 0) {
            this.wikiInfoList.map((wikiValue) => {
                let searchStartIndex = 0
                let searchResultIndex = 0
                if (wikiValue.name && wikiValue.name.length > 0) {
                    searchResultIndex = content.indexOf(wikiValue.name, searchStartIndex)
                    while (searchResultIndex !== -1) {
                        //hit result
                        let startIndex = searchResultIndex
                        let endIndex = searchResultIndex + wikiValue.name.length
                        result.push(new SearchItem(wikiValue, startIndex, endIndex))
                        searchStartIndex = endIndex
                        searchResultIndex = content.indexOf(wikiValue.name, searchStartIndex)
                    }
                }

            })
        }
        return result
    }
}