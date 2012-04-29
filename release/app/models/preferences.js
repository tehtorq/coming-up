var Preferences;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
Preferences = (function() {
  function Preferences() {}
  Preferences.themes = ['dark', 'kuler', 'light', 'wood', 'custom'];
  Preferences.setTheme = function(theme) {
    var old_theme_path;
    old_theme_path = this.getThemePath();
    if (__indexOf.call(this.themes, theme) < 0) {
      theme = 'dark';
    }
    this.theme = theme;
    new Mojo.Model.Cookie("prefs-theme").put(this.theme);
    return StageAssistant.switchTheme(this.getThemePath(), old_theme_path);
  };
  Preferences.getTheme = function() {
    var _ref;
    if (this.theme == null) {
      this.theme = StageAssistant.cookieValue("prefs-theme", "dark");
    }
    if (_ref = this.theme, __indexOf.call(this.themes, _ref) < 0) {
      this.theme = 'dark';
    }
    return this.theme;
  };
  Preferences.getThemePath = function() {
    return "stylesheets/themes/" + (this.getTheme()) + ".css";
  };
  Preferences.updateNotifications = function() {
    if (StageAssistant.cookieValue("prefs-message-notifications", "off") === "on" || StageAssistant.cookieValue("prefs-karma-notifications", "off") === "on") {
      return this.enableNotificationsTimer(StageAssistant.cookieValue("prefs-notification-interval", "30"));
    } else {
      return this.disableNotificationsTimer();
    }
  };
  Preferences.enableNotificationsTimer = function(interval) {
    Mojo.Log.info("Enabling notifications timer: " + interval + " minute interval");
    return new Mojo.Service.Request("palm://com.palm.power/timeout", {
      method: "set",
      parameters: {
        "wakeup": true,
        "key": "reddit_check_messages",
        "uri": "palm://com.palm.applicationManager/open",
        "in": "00:" + interval + ":00",
        "params": "{'id': '" + Mojo.appInfo.id + "','params': {'action': 'checkMessages'}}"
      },
      onSuccess: function(response) {
        return Mojo.Log.info("Message notification timer set successfully");
      },
      onFailure: function(response) {
        return Mojo.Log.info("Message notification timer failure", response.returnValue, response.errorText);
      }
    });
  };
  Preferences.disableNotificationsTimer = function() {
    Mojo.Log.info("Disable notifications timer");
    return new Mojo.Service.Request('palm://com.palm.power/timeout', {
      method: "clear",
      parameters: {
        "key": "reddit_check_messages"
      }
    });
  };
  return Preferences;
})();