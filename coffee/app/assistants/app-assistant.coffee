class AppAssistant
  
  handleLaunch: (launchParams) ->
    Mojo.Log.info(JSON.stringify(launchParams))
    
    params = {}
    params = {action: launchParams.searchString} if launchParams and launchParams.searchString
    
    pushCard = (stageController) =>
      stageController.pushScene({name: "events", disableSceneScroller: true}, params)

    Mojo.Controller.getAppController().createStageWithCallback({name: "events", disableSceneScroller: true}, pushCard, "card")
        