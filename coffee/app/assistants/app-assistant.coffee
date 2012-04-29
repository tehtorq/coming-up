class AppAssistant
  
  handleLaunch: (launchParams) ->
    Mojo.Log.info(JSON.stringify(launchParams))
    
    params = {}
    params = {action: launchParams.searchString} if launchParams and launchParams.searchString
    
    pushCard = (stageController) =>
      stageController.pushScene({name: "coming-up", disableSceneScroller: true}, params)

    Mojo.Controller.getAppController().createStageWithCallback({name: "coming-up", disableSceneScroller: true}, pushCard, "card")
        