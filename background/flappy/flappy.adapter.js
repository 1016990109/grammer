class FlappyAdapter {
    static getResultListAdapter(searchItemList){
        let result = []
        for(let item of searchItemList){
            result.push(this.getResultAdapter(item))
        }
        return result
    }
    static getResultAdapter(searchItem) {
        const length = searchItem.endIndex - searchItem.startIndex
        return {
            "isParagraphLevelCheck": true,
            "rule": {
                "id": "MORFOLOGIK_RULE_EN_US",
                "description": "Possible spelling mistake",
                "issueType": "misspelling",
                "category": {
                    "id": "TYPOS",
                    "name": "Possible Typo"
                },
                "isPremium": false
            },
            "isCustomError": false,
            "isSpellingError": false,
            "isStyleError": false,
            "isPunctuationError": false,
            "isPicky": false,
            "contextForSureMatch": 0,
            "language": {
                "code": "en-US",
                "name": "English (US)"
            },
            "description": JSON.stringify(searchItem.wikiItem),
            "shortDescription": "Flappypedia",
            "start": searchItem.startIndex,
            "end": searchItem.endIndex,
            "length": length,
            "originalPhrase": "sdf",
            "contextPhrase": "|sdf|",
            "longContextPhrase": "<lt-em>sdf</lt-em>",
            "fixes": []
        }
    }
}

WikiManager.initWikiInfo()