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
    const response = await axios.post('/makePostcard', { name, userID: window.userID })
    $('.first, #loader, .pop, .fone').hide()
    $('.second').show()
  }

  

  main.ready = function() {
    /*const check = window.localStorage.getItem('userID')
    if(check === null){
      window.userID = uuidv4()
      window.localStorage.setItem('userID',window.userID)
    }else{
      window.userID = window.localStorage.getItem('userID')
    }*/

    window.userID = uuidv4()

    $('#choose-name').on('click', main.showPopup)
    $('.fone').on('click', main.hidePopup)
    $('.red-button').on('click', main.showFirstStep)
    $('#names-container span').on('click', main.makePostcard)
    
  }
  
  window.main = main

})(jQuery)
jQuery(document).ready(main.ready)