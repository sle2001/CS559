function CirclePath(x,y,r) {
    "use strict";
    this.x = x || 200;
    this.y = y || 200;
    this.r = r || 100;
}
CirclePath.prototype.eval = function(u) {
    "use strict";
    var x = this.r * Math.cos(u);
    var y = this.r * Math.sin(u);
    return [x + this.x,y + this.y ,-y,x];
}
