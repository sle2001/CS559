function CirclePath() {
  this.x = x || 50;
  this.y = y || 50;
  this.r = r || 25;
}

CirclePath.prototype.eval = function(u) {
  var x = this.r * Math.cos(u);
  var y = this.r * Math.sin(u);
  return [x + this.x, y + this.y, -y, x];
}
