
const FLAPPY_AUTH_URL = "https://flappypedia.com/auth/google"
const FLAPPY_HOST = "https://flappypedia.com/"
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


    async flappyFetch(url,optnion){
        if(!optnion){
            optnion = {}
        }
        let headers = optnion["headers"]
        if(!headers){
            headers = []
        }
        let token = await FlappyAuth.getToken()
        headers["Cookie"] = `${FLAPPY_TOKEN_NAME}=${token}`
        optnion["headers"] = headers
        return fetch(url,optnion)
    }
}