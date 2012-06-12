String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
Array.prototype.move = function(pos1, pos2) {
  var i, tmp, _ref, _ref2;
  tmp = this[pos1];
  if (pos1 < pos2) {
    for (i = pos1, _ref = pos2 - 1; pos1 <= _ref ? i <= _ref : i >= _ref; pos1 <= _ref ? i++ : i--) {
      this[i] = this[i + 1];
    }
  } else {
    for (i = pos1, _ref2 = pos2 + 1; pos1 <= _ref2 ? i <= _ref2 : i >= _ref2; pos1 <= _ref2 ? i++ : i--) {
      this[i] = this[i - 1];
    }
  }
  return this[pos2] = tmp;
};
Array.prototype.insert = function(element, pos) {
  return this.splice(pos, 0, element);
};