var PrefsAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
PrefsAssistant = (function() {
  __extends(PrefsAssistant, BaseAssistant);
  function PrefsAssistant(params) {
    this.handleUpdate15 = __bind(this.handleUpdate15, this);
    this.handleUpdate14 = __bind(this.handleUpdate14, this);
    this.handleUpdate13 = __bind(this.handleUpdate13, this);    PrefsAssistant.__super__.constructor.apply(this, arguments);
  }
  PrefsAssistant.prototype.setup = function() {
    var value13, value14, value15;
    PrefsAssistant.__super__.setup.apply(this, arguments);
    value13 = AppAssistant.cookieValue("prefs-sync-enabled", "off");
    value14 = AppAssistant.cookieValue("prefs-sync-username", "");
    value15 = AppAssistant.cookieValue("prefs-sync-password", "");
    this.controller.setupWidget("syncToggleButton", {
      trueValue: "on",
      falseValue: "off"
    }, {
      value: value13,
      disabled: false
    });
    this.controller.setupWidget("usernameTextFieldId", {
      focusMode: Mojo.Widget.focusSelectMode,
      textCase: Mojo.Widget.steModeLowerCase,
      maxLength: 30
    }, {
      value: value14
    });
    this.controller.setupWidget("passwordTextFieldId", {
      focusMode: Mojo.Widget.focusSelectMode,
      textCase: Mojo.Widget.steModeLowerCase,
      maxLength: 30
    }, {
      value: value15
    });
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
  PrefsAssistant.prototype.activate = function(event) {
    PrefsAssistant.__super__.activate.apply(this, arguments);
    return this.addListeners([this.controller.get("syncToggleButton"), Mojo.Event.propertyChange, this.handleUpdate13], [this.controller.get("usernameTextFieldId"), Mojo.Event.propertyChange, this.handleUpdate14], [this.controller.get("passwordTextFieldId"), Mojo.Event.propertyChange, this.handleUpdate15]);
  };
  PrefsAssistant.prototype.ready = function() {
    return this.controller.setInitialFocusedElement(null);
  };
  PrefsAssistant.prototype.handleUpdate13 = function(event) {
    var cookie;
    cookie = new Mojo.Model.Cookie("prefs-sync-enabled");
    return cookie.put(event.value);
  };
  PrefsAssistant.prototype.handleUpdate14 = function(event) {
    var cookie;
    cookie = new Mojo.Model.Cookie("prefs-sync-username");
    return cookie.put(event.value);
  };
  PrefsAssistant.prototype.handleUpdate15 = function(event) {
    var cookie;
    cookie = new Mojo.Model.Cookie("prefs-sync-password");
    return cookie.put(event.value);
  };
  PrefsAssistant.prototype.handleCommand = function(event) {
    if (event.type !== Mojo.Event.command) {
      return;
    }
    switch (event.command) {
      case 'back':
        return this.controller.stageController.popScene();
    }
  };
  return PrefsAssistant;
})();