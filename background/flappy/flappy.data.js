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
    manager.flappyFetch("https://flappypedia.com/api/wiki/list?start_page_index=0&page_num=10000")
      .then((response) => {
        if (response.status === 401) {
          chrome.tabs.create({url: 'https://flappypedia.com/auth/google'});
        }
        return response.json()
      })
      .then((data) => {
        if (data) {
          WikiManager.wikiInfoList = []
          // 合并相同name的wiki，一词多义
          const wikiMap = {}
          for (let i of data) {
            i.detail = i.content || ''
            i.content = ((i.content || '').substr(0, 100)) + ((i.content || '').length > 100 ? '...' : '')
            if (wikiMap[i.name]) {
              wikiMap[i.name].infoList.push(i)
            } else {
              wikiMap[i.name] = {
                name: i.name,
                infoList: [i]
              }
            }
          }

          WikiManager.wikiInfoList = Object.values(wikiMap)
        }

      }).catch(e => {
      console.log(e)
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