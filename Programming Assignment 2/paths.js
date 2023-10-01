function CirclePath(x,y,r) {
    "use strict";
    this.x = x;
    this.y = y;
    this.r = r;
}
CirclePath.prototype.eval = function(u) {
    "use strict";
    var x = this.r * Math.cos(u);
    var y = this.r * Math.sin(u);
    return [x + this.x,y + this.y ,-y,x];
}
