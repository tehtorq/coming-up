var AppAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
AppAssistant = (function() {
  function AppAssistant() {}
  AppAssistant.prototype.handleLaunch = function(launchParams) {
    var params, pushCard;
    Mojo.Log.info(JSON.stringify(launchParams));
    params = {};
    if (launchParams && launchParams.searchString) {
      params = {
        action: launchParams.searchString
      };
    }
    pushCard = __bind(function(stageController) {
      return stageController.pushScene({
        name: "coming-up",
        disableSceneScroller: true
      }, params);
    }, this);
    return Mojo.Controller.getAppController().createStageWithCallback({
      name: "coming-up",
      disableSceneScroller: true
    }, pushCard, "card");
  };
  return AppAssistant;
})();