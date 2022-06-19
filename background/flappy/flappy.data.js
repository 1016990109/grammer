
/**
 * Wiki摘要信息
 */
class WikiItem {
    constructor(id, name) {
        this.name = name
        this.id = id
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
    static wikiInfoList = []
    static initWikiInfo() {
        let manager = new FlappyAuth()
        manager.flappyFetch("https://hamilhong.work/api/wiki/list")
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    WikiManager.wikiInfoList = []
                    for (let i of data) {
                        WikiManager.wikiInfoList.push({
                            name: i["name"],
                            id: i["id"]
                        })
                    }
                }

            })

    }
    /**
     * 需要匹配的关键词
     */
    static getWikiKeyList() {
        return WikiManager.initWikiInfo
    }
    static matchWikiContent(content) {
        let result = []
        if (content && content.length > 0) {
            this.wikiInfoList.map((wikiValue) => {
                let searchStartIndex = 0
                let searchResultIndex = 0
                if (wikiValue.name && wikiValue.name.length > 0) {
                    searchResultIndex = content.indexOf(wikiValue.name, searchStartIndex)
                    while (searchResultIndex !== -1) {
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