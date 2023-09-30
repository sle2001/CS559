"use strict ";

// this is the "class definition" - always use this with "new"
// maybe a bad choice to attach it to a context, but seems easier than passing it around
function Sharingan(context,x,y,sz,path)
{
    // these are it's properties
    this.size = sz || 0.5;
    this.path = path;
    this.speed = .2;
    // this is its state - it gets over-ridden if there is a path
    this.posX = x || 200;
    this.posY = y || 200;
    this.pathU = 0;
    this.context = context;
}

Sharingan.prototype.drawSclera = function() {
    this.context.save();
    this.context.beginPath();
    this.context.arc(100, 200, 60, 0, 2*Math.PI);
    this.context.fill();

    this.context.beginPath();
    this.context.arc(300, 200, 60, 0, 2*Math.PI);
    this.context.fill();  
    this.context.restore();
};

Sharingan.prototype.draw = function() {
    this.context.save();

    if (this.path) {
        var p = this.path.eval(this.pathU);
        var dd = Math.sqrt(p[2]*p[2] + p[3]*p[3]);
        this.context.transform(p[2]/dd,p[3]/dd, -p[3]/dd, p[2]/dd, p[0],p[1]);
        this.context.rotate(-Math.PI/2);  // since the copter faces Y not X
    } else {
        this.context.translate(this.posX, this.posY);
        this.context.rotate(this.heading);
    }
    this.context.scale(this.size, this.size);

    this.context.fillStyle = "#FA0D17";
    
    this.drawSclera();

    this.context.restore();
}

Sharingan.prototype.update = function() {
    this.pathU += 0.1 * this.speed;
}
