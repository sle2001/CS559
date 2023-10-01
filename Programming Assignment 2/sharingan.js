"use strict ";

// this is the "class definition" - always use this with "new"
// maybe a bad choice to attach it to a context, but seems easier than passing it around
function Sharingan(context,x,y,sz,path)
{
    // these are it's properties
    this.size = sz;
    this.path = path;
    this.speed = .2;
    // this is its state - it gets over-ridden if there is a path
    this.posX = x;
    this.posY = y;
    this.pathU = 0;
    this.context = context;
}

Sharingan.prototype.drawTomoe = function() {
    this.context.save();
    this.context.beginPath();
    this.context.arc(100, 170, 10, 0, 2*Math.PI);
    this.context.fill();
    this.context.restore();
};
Sharingan.prototype.drawDashCircle = function() {
    this.context.save();
    this.context.beginPath();
    this.context.arc(100,200,30,0,2*Math.PI);
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(300,200,30,0,2*Math.PI);
    this.context.stroke();
    this.context.restore();
};

Sharingan.prototype.drawPupil = function() {
    this.context.save();
    this.context.beginPath();
    this.context.arc(100,200, 10, 0, 2*Math.PI);
    this.context.fill();

    this.context.beginPath();
    this.context.arc(300,200,10,0,2*Math.PI);
    this.context.fill();
    this.context.restore();
};

Sharingan.prototype.drawSclera = function() {
    this.context.save();
    this.context.beginPath();
    this.context.arc(100, 200, 60, 0, 2*Math.PI);
    this.context.fill();
    this.context.restore();

    this.context.save();
    this.context.beginPath();
    this.context.arc(300, 200, 60, 0, 2*Math.PI);
    this.context.fill();
    this.context.restore();
};

Sharingan.prototype.drawMouth = function() {
    this.context.save();
    this.context.beginPath();
    this.context.arc(200,300, 60, 0, Math.PI, false);
    this.context.fill();
    this.context.restore();
};

Sharingan.prototype.draw = function() {
    this.context.save();



    this.context.fillStyle = "white";
    this.drawMouth();

    this.context.save();
    var p = this.path.eval(this.pathU);
    var dd = Math.sqrt(p[2]*p[2] + p[3]*p[3]);
    this.context.transform(p[2]/dd,p[3]/dd, -p[3]/dd, p[2]/dd, p[0],p[1]);    
    this.context.scale(this.size, this.size);
    this.context.fillStyle = "white";
    this.drawTomoe();
    this.context.rotate(-2*Math.PI/3);
    this.drawTomoe();
    this.context.rotate(-2*Math.PI/3);
    this.drawTomoe();
    this.context.restore();
    this.context.restore();

    this.context.fillStyle = "#FA0D17";
    this.drawSclera();

    this.context.strokeStyle = "black";
    this.drawDashCircle();

    this.context.fillStyle = "#000000";
    this.drawPupil();
}

Sharingan.prototype.update = function() {
    this.pathU += 0.1 * this.speed;
}
