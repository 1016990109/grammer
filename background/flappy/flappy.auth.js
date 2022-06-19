
const FLAPPY_AUTH_URL = "https://hamilhong.work/auth/google"
const FLAPPY_HOST = "https://hamilhong.work/"
const FLAPPY_TOKEN_NAME = "connect.sid"

class FlappyAuth {
    static getAuthUrl(redirectUri) {
        if (redirectUri && redirectUri.length > 0) {
            return `${FLAPPY_AUTH_URL}?redirect_uri=${encodeURIComponent(redirectUri)}`
        } else {
            return FLAPPY_AUTH_URL
        }
    }
    /**
     * 获取登录token
     * @returns 
     */
    static getToken(){
        return new Promise((resolve,reject)=>{
            chrome.cookies.get({"url":FLAPPY_HOST,"name":FLAPPY_TOKEN_NAME},(tokenDetail)=>{
                if(tokenDetail && tokenDetail["value"]){
                    resolve(tokenDetail["value"])
                }else{
                    reject("Not found")
                }
            })
        })
    }
    constructor() {

    }
    /**
     * 
     */
    initToken() {
        
    }

    flappyFetch(url,optnion){
        if(!optnion){
            optnion = {}
        }
        let headers = optnion["headers"]
        if(!headers){
            headers = []
        }
        headers["Cookie"] = `${FLAPPY_TOKEN_NAME}=${this.getToken()}`
        optnion["headers"] = headers
        return fetch(url,optnion)
    }
}