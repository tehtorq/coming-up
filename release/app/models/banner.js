var Banner;
Banner = (function() {
  function Banner() {}
  Banner.send = function(message) {
    return Mojo.Controller.getAppController().showBanner(message, {
      source: 'notification'
    });
  };
  return Banner;
})();