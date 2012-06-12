var AppAssistant, Incoming;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Incoming = (function() {
  function Incoming() {}
  return Incoming;
})();
AppAssistant = (function() {
  function AppAssistant() {}
  AppAssistant.prototype.setup = function() {
    Incoming.Metrix = new Metrix();
    return Incoming.Metrix.postDeviceData();
  };
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
        name: "events",
        disableSceneScroller: true
      }, params);
    }, this);
    return Mojo.Controller.getAppController().createStageWithCallback({
      name: "events",
      disableSceneScroller: true
    }, pushCard, "card");
  };
  AppAssistant.cookieValue = function(cookieName, default_value) {
    var cookie;
    cookie = new Mojo.Model.Cookie(cookieName);
    if (cookie != null) {
      return cookie.get() || default_value;
    }
    return default_value;
  };
  return AppAssistant;
})();