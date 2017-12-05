(function() {
    auth = {}
    auth.ready = function() {
      const arr = window.location.href.split('#access_token=')
      const hrefArr = arr[1].split('&')
      const token = hrefArr[0]
      window.opener.main.tokenGotted(token)
    }
    
    window.auth = auth
  
  })(jQuery)
  jQuery(document).ready(auth.ready)