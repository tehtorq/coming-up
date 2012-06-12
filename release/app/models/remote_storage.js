var RemoteStorage;
RemoteStorage = (function() {
  function RemoteStorage(callback) {
    this.callback = callback;
  }
  RemoteStorage.prototype.get = function(key) {
    Mojo.Log.info("getting " + key);
    return new Request(this.callback).get("http://api.openkeyval.org/" + key, {}, 'remote-storage-get');
  };
  RemoteStorage.prototype.set = function(key, value) {
    Mojo.Log.info("setting " + key);
    return new Request(this.callback).post("http://api.openkeyval.org/" + key, {
      data: value
    }, 'remote-storage-set');
  };
  RemoteStorage.prototype["delete"] = function(key) {
    Mojo.Log.info("deleting " + key);
    return new Request(this.callback).post("http://api.openkeyval.org/" + key, {
      data: ''
    }, 'remote-storage-delete');
  };
  return RemoteStorage;
})();