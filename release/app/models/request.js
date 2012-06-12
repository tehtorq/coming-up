var Request;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Request = (function() {
  function Request(callback) {
    this.callback = callback;
  }
  Request.prototype.request = function(url, method, params, token) {
    var request, _ref;
    Mojo.Log.info(url + "," + method + "," + Object.toJSON(params));
    request = new Ajax.Request(url, {
      method: method,
      parameters: params,
      onSuccess: __bind(function(inTransport) {
        return this.handleResponse(token, inTransport, true);
      }, this),
      onFailure: __bind(function(inTransport) {
        return this.handleResponse(token, inTransport, false);
      }, this),
      onException: __bind(function(inTransport, inException) {
        return this.handleResponse(token, inTransport, false);
      }, this)
    });
    return Request.store.push({
      cardname: (_ref = this.callback) != null ? _ref.cardname : void 0,
      request: request
    });
  };
  Request.prototype.get = function(url, params, token) {
    return this.request(url, 'get', params, token);
  };
  Request.prototype.post = function(url, params, token) {
    return this.request(url, 'post', params, token);
  };
  Request.prototype.handleResponse = function(token, response, success) {
    Mojo.Log.info("handleResponse: {token: " + token + ", success:" + success + "}");
    if (this.callback != null) {
      return this.callback.handleCallback({
        type: token,
        response: response,
        success: success
      });
    } else {
      return Mojo.Controller.getAppController().sendToNotificationChain({
        type: token,
        response: response,
        success: success
      });
    }
  };
  Request.store = [];
  Request.clear_all = function(cardname) {
    _.each(this.store, function(request) {
      return request.request.transport.abort();
    });
    return this.store = [];
  };
  return Request;
})();