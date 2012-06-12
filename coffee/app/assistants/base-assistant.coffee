class BaseAssistant
  
  constructor: ->
    
  setup: ->
    @can_navigate_back = @canNavigateBack()
    @viewmenu_width = _.min([@controller.window.innerWidth, @controller.window.innerHeight])
    @loadTheme()
    
  activate: ->
    
  deactivate: ->
    @removeListeners()
    
  cleanup: ->
    Request.clear_all()
  
  canNavigateBack: ->
    @controller.stageController.getScenes().length > 0 # only increments after setup finishes
    
  showBackNavigation: ->
    @can_navigate_back and not Mojo.Environment.DeviceInfo.keyboardAvailable
    
  scrollToTop: ->
    @controller.get("list-scroller").mojo.scrollTo(0,0, true)
      
  addListeners: ->
    @listeners = arguments
    
    _.each @listeners, (listener) => Mojo.Event.listen(listener...)
    
  removeListeners: ->
    _.each @listeners, (listener) => Mojo.Event.stopListening(listener...)
    
  loadTheme: ->
    #Mojo.loadStylesheet(@controller.document, Preferences.getThemePath())
  
  setClipboard: (text) ->
    Banner.send("Sent to Clipboard")
    @controller.stageController.setClipboard(text, true)  
