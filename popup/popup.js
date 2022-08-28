
//flappy init
loginGuide = document.getElementById("flappy_pop_guide")
loginButton = document.getElementById("flappy_pop_login")
guideContainer = document.getElementById("flappy_pop_content_login")
guideContainer.style.display = "none"
loginGuide.style.display= "none"
loginButton.style.display= "none"
let startTime =  new Date().getTime()
console.log("init flappy " + new Date().getTime())
FlappyAuth.getToken().then(()=>{
  loginGuide.style.display= "none"
  loginButton.style.display= "none"
  guideContainer.style.display = "block"
  console.log("finish get token cost "+(new Date().getTime() - startTime))
}).catch((e)=>{
  guideContainer.style.display = "none"
  loginGuide.style.display= "block"
  loginButton.style.display= "block"
  console.log("finish get token error "+new Date().getTime()+" "+e)
})
loginButton.onclick = ()=>{
  window.open("https://flappypedia.com")
  window.close()
  console.log("finish click "+new Date().getTime())
}

//foot link
homeButton = document.getElementById("flappy_pop_home")
homeButton.onclick = ()=>{
  window.open("https://flappypedia.com")
  window.close()
}
feedbackButton = document.getElementById("flappy_pop_feedback")
feedbackButton.onclick = ()=>{
  window.open("https://flappypedia.com")
  window.close()
}
