class Incoming

class AppAssistant
  
  setup: ->
    Incoming.Metrix = new Metrix() # instantiate metrix library
    Incoming.Metrix.postDeviceData()
  
  handleLaunch: (launchParams) ->
    Mojo.Log.info(JSON.stringify(launchParams))
    
    params = {}
    params = {action: launchParams.searchString} if launchParams and launchParams.searchString
    
    pushCard = (stageController) =>
      stageController.pushScene({name: "events", disableSceneScroller: true}, params)

    Mojo.Controller.getAppController().createStageWithCallback({name: "events", disableSceneScroller: true}, pushCard, "card")
        
  @cookieValue: (cookieName, default_value) ->
    cookie = new Mojo.Model.Cookie(cookieName)

    if cookie?
      return cookie.get() or default_value

    default_value
