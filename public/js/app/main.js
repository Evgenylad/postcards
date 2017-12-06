(function() {

  main = {
    
  }

  main.showFirstStep = (e) => {
    e.preventDefault()
    $('#welcome').hide()
    $('#first, .first').show()
  }

  main.showPopup = (e) => $('.pop, .fone').show()
  
  main.hidePopup = (e) => $('.pop, .fone').hide()
  

  main.makePostcard = async (e) => {
    const name = e.currentTarget.innerHTML
    $('#names-container').hide()
    $('#loader').show()
    const response = await axios.post('/makePostcard', { name, userID: window.userID, browserID: window.browserID })
    if (response.data.check == 1) {
      window.postcard = { videoID: response.data.result.uid, name: response.data.result.name }
      $('#first, .first, #loader, .pop, .fone').hide()
      $('#last').show()
      $('#LINK').val(`http://lexxxbro.com/ready/${window.postcard.videoID}/final.mpg`).select()
    }else{
      window.reload()
    }
  }

  window.saveVideo = async (token) => {
    const result = await axios.post(`https://api.vk.com/method/video.save?name=${window.userID}&link=http://lexxxbro.com/ready/${window.userID}/final.mp4&access_token=${token}&v=5.69`)
    console.log(result.data)
  }

  window.tokenGotted = (token) => {
    main.token = token
    window.localStorage.setItem('vkToken', token)
    main.smallWin.close()
    window.saveVideo(token)
  }

  main.createPostcard = async (e) => {
    const appID = 6285315
    const left = window.innerWidth / 2 - 200
    const top = window.innerHeight / 2 - 300
    const social = $('.setochki:checked').val()
    if (social === 'vk') {
      main.smallWin = window.open('https://oauth.vk.com/authorize?client_id='+appID+'&display=popup&redirect_uri=http://lexxxbro.com/vkauth&scope=video&revoke=1&response_type=token&v=5.69', 'Авторизация', 'width=400,height=400,left='+left+',top='+top+'')
    }
  }

  

  main.ready = function() {
    const check = window.localStorage.getItem('browserID')
    if(check === null){
      window.browserID = uuidv4()
      window.localStorage.setItem('browserID',window.browserID)
    }else{
      window.browserID = window.localStorage.getItem('browserID')
    }
    window.userID = uuidv4()

    $('#choose-name').on('click', main.showPopup)
    $('.fone').on('click', main.hidePopup)
    $('.red-button').on('click', main.showFirstStep)
    $('#names-container span').on('click', main.makePostcard)
    $('#create-postcard').on('click', main.createPostcard)
  }
  
  window.main = main

})(jQuery)
jQuery(document).ready(main.ready)