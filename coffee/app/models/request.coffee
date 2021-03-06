class Request

  constructor: (callback) ->
    @callback = callback

  request: (url, method, params, token) ->
    Mojo.Log.info(url + "," + method + "," + Object.toJSON(params))
    
    request = new Ajax.Request(
      url,
      {
        method : method
        parameters: params
        onSuccess: (inTransport) =>
          @handleResponse(token, inTransport, true)
        onFailure: (inTransport) =>
          @handleResponse(token, inTransport, false)
        onException: (inTransport, inException) =>
          @handleResponse(token, inTransport, false)
      }
    )

    Request.store.push({cardname: @callback?.cardname, request: request})

  get: (url, params, token) ->
    @request(url, 'get', params, token)

  post: (url, params, token) ->
    @request(url, 'post', params, token)

  handleResponse: (token, response, success) ->
    #return unless response.readyState is 4
    
    Mojo.Log.info("handleResponse: {token: #{token}, success:#{success}}")
    
    if @callback? 
      @callback.handleCallback({type: token, response: response, success: success})
    else
      Mojo.Controller.getAppController().sendToNotificationChain({type: token, response: response, success: success})

  @store = []

  @clear_all: (cardname) ->
    _.each @store, (request) -> request.request.transport.abort()
    @store = []
