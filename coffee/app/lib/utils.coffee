String.prototype.endsWith = (suffix) ->
  this.indexOf(suffix, this.length - suffix.length) isnt -1
  
# Array.prototype.move = (from, to) ->
#   @splice(to, 0, @splice(from, 1)[0])

Array.prototype.move = (pos1, pos2) ->
  # save element from position 1
  tmp = @[pos1]
  # move element down and shift other elements up
  if pos1 < pos2
    for i in [pos1..(pos2-1)]
      @[i] = @[i + 1]
  # move element up and shift other elements down
  else
    for i in [pos1..(pos2+1)]
      @[i] = @[i - 1]
  # put element from position 1 to destination
  @[pos2] = tmp

Array.prototype.insert = (element, pos) ->  
  @splice(pos,0,element)
