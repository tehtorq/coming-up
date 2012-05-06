var AboutAssistant;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
AboutAssistant = (function() {
  __extends(AboutAssistant, BaseAssistant);
  function AboutAssistant() {
    AboutAssistant.__super__.constructor.apply(this, arguments);
  }
  AboutAssistant.prototype.setup = function() {
    AboutAssistant.__super__.setup.apply(this, arguments);
    if (this.showBackNavigation()) {
      this.viewMenuModel = {
        visible: true,
        items: [
          {
            label: $L('Back'),
            icon: '',
            command: 'back',
            width: 80
          }
        ]
      };
      return this.controller.setupWidget(Mojo.Menu.commandMenu, {
        menuClass: 'no-fade'
      }, this.viewMenuModel);
    }
  };
  AboutAssistant.prototype.handleCommand = function(event) {
    if (event.type !== Mojo.Event.command) {
      return;
    }
    switch (event.command) {
      case 'back':
        return this.controller.stageController.popScene();
    }
  };
  return AboutAssistant;
})();