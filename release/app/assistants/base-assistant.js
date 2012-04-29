var BaseAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
BaseAssistant = (function() {
  function BaseAssistant() {}
  BaseAssistant.prototype.setup = function() {
    this.can_navigate_back = this.canNavigateBack();
    this.viewmenu_width = _.min([this.controller.window.innerWidth, this.controller.window.innerHeight]);
    return this.loadTheme();
  };
  BaseAssistant.prototype.activate = function() {};
  BaseAssistant.prototype.deactivate = function() {
    return this.removeListeners();
  };
  BaseAssistant.prototype.cleanup = function() {
    return Request.clear_all();
  };
  BaseAssistant.prototype.canNavigateBack = function() {
    return this.controller.stageController.getScenes().length > 0;
  };
  BaseAssistant.prototype.showBackNavigation = function() {
    return this.can_navigate_back && !Mojo.Environment.DeviceInfo.keyboardAvailable;
  };
  BaseAssistant.prototype.scrollToTop = function() {
    return this.controller.getSceneScroller().mojo.scrollTo(0, 0, true);
  };
  BaseAssistant.prototype.addListeners = function() {
    this.listeners = arguments;
    return _.each(this.listeners, __bind(function(listener) {
      var _ref;
      return (_ref = Mojo.Event).listen.apply(_ref, listener);
    }, this));
  };
  BaseAssistant.prototype.removeListeners = function() {
    return _.each(this.listeners, __bind(function(listener) {
      var _ref;
      return (_ref = Mojo.Event).stopListening.apply(_ref, listener);
    }, this));
  };
  BaseAssistant.prototype.loadTheme = function() {};
  BaseAssistant.prototype.setClipboard = function(text) {
    Banner.send("Sent to Clipboard");
    return this.controller.stageController.setClipboard(text, true);
  };
  return BaseAssistant;
})();