class RemoteStorage
  
  constructor: (callback) ->
    @callback = callback
    
  get: (key) ->
    Mojo.Log.info("getting #{key}")
    new Request(@callback).get("http://api.openkeyval.org/#{key}", {}, 'remote-storage-get')
  
  set: (key, value) ->
    Mojo.Log.info("setting #{key}")
    new Request(@callback).post("http://api.openkeyval.org/#{key}", {data: value}, 'remote-storage-set')
    
  delete: (key) ->
    Mojo.Log.info("deleting #{key}")
    new Request(@callback).post("http://api.openkeyval.org/#{key}", {data: ''}, 'remote-storage-delete')