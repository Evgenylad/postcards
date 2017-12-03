(function() {

  const spectator = {}

  spectator.compileRegions = (region) => {
    let compiledSelect = ''
    $.each(main.regions, (key, value) => {
      compiledSelect += `<option ${value.db == region ? 'selected' : ''} 
        value="${value.id}" 
        data-db="${value.db}" 
        data-region="${value.db}" 
        data-region-title="${value.city}" 
        data-subdibvision-i-d="${value.id}">
      ${value.city}</option>`
    })
    return `<select class="spectator-region-select form-control flexible">${compiledSelect}</select>`
  }

  spectator.getCashboxes = async (region, cashboxID) => {
    const response = await axios.post('/admin/get-salepoints', { region })
    if(!response.data.content){
      return null
    }
    let cashboxes = ''
    $.each(response.data.content, (key, value) => {
      cashboxes += `<option ${(cashboxID == value.id && cashboxID != undefined) ? 'selected' : ''} 
      value="${value.id}" 
      data-cashbox-i-d="${value.id}" 
      data-cashbox-title="${value.title}">
      ${value.title}</option>`
    })
    
    /*if(!cashboxID){
      return cashboxes
    }*/
    return `<select class="spectator-cashbox-select form-control flexible">${cashboxes}</select>`
  }

  spectator.makeSaving = async (data) => {
    const response = await axios.post('/admin/save-spectator', data)
    return response
  }


  spectator.saveSpectator = async sets => {
    const {
      target, 
      action,
      type,
      lineObject
    } = sets

    if(lineObject.region.value == 'null' || lineObject.cashbox.value == 'null') { 
      main.notify('Выберите регион и кассу, чтобы сохранить настройки')
      return
    }
    main.applyImage(target, 'loading', 'row', 'loading')
    const response = await spectator.makeSaving(lineObject)
    if(response.check == 0) {
      main.notify(response.text)
      return
    }

    let selectedValues = $(target).parent('td').siblings('td').children('select').children('option:selected')
    for(let i=0; i < selectedValues.length; i++){
      const attrs = $(selectedValues[i]).data()
      const content = $(selectedValues[i]).html()
      $.each(attrs, (key, val) => {
        $(selectedValues[i]).parent('select').parent('td').attr(`data-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace('-id', '-i-d')}`, val)
      })
      $(selectedValues[i]).parent('select').parent('td').html(content)
    }
    main.applyImage(target, 'success', 'row', 'patchSpectator')
  }

  spectator.patchSpectator = async sets => {
    const { subdivisionID:id, db } = sets.lineObject.region
    const regionOpts = spectator.compileRegions(db)
    const cashboxOpts = await spectator.getCashboxes({ id, db }, sets.lineObject.cashbox.cashboxID)
    $(sets.target).parent('td').siblings('.spectator-region').html(regionOpts)
    $(sets.target).parent('td').siblings('.spectator-cashbox').html(cashboxOpts)
    $(sets.target).parent('td').siblings('.spectator-cashbox').children('select').show()

    main.applyImage(sets.target, 'error', 'row', 'saveSpectator')
  }

  spectator.deleteSpectator = async sets => {
    const { uid } = sets.lineObject
    const response = await axios.post('/admin/spectators/delete', { uid })
    if(response.data.check == 1){
      $(sets.target).parent('td').parent('tr').remove()
    }
  }

  spectator.regionSelected = async e => {
    let target = e.currentTarget.parentNode.parentNode.childNodes
    target = target[target.length-1].childNodes[0]
    const values = main.getRowValues(e.currentTarget)
    const lineObject = main.handleValues(values)
    spectator.patchSpectator({ lineObject, target })
  }

  spectator.ready = function() {
    $('.spectators-module').on('change', '.spectator-region-select', spectator.regionSelected)
  }

  window.spectator = spectator

})(jQuery)
jQuery(document).ready(spectator.ready)