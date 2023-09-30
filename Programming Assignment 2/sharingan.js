"use strict ";

// this is the "class definition" - always use this with "new"
// maybe a bad choice to attach it to a context, but seems easier than passing it around
function QuadCopter(context,x,y,sz,path)
{
    // these are it's properties
    this.size = sz || 0.5;
    this.frontFaster = 2;
    this.path = path;
    this.speed = .2;
    // this is its state - it gets over-ridden if there is a path
    this.posX = x || 200;
    this.posY = y || 200;
    this.pathU = 0;
    this.heading = 0;
    this.frontPropAngle = 0;
    this.backPropAngle = 0;
    this.context = context;
}
QuadCopter.prototype.drawBlade = function() {
    this.context.beginPath();
    this.context.moveTo(0,0);
    this.context.bezierCurveTo(5,5,   15,5,  20,5);
    this.context.bezierCurveTo(25,5,  35,5,  40,0);
    this.context.bezierCurveTo(35,-5, 25,-5, 20,-5);
    this.context.bezierCurveTo(15,-5, 5,-5,  0,0);
    this.context.fill();
    this.context.stroke();
};
QuadCopter.prototype.drawProp = function() {
    this.context.save();
    this.drawBlade();
    this.context.scale(-1,1);
    this.drawBlade();
    this.context.restore();
    this.context.beginPath();
    this.context.arc(0,0,5,0,2*Math.PI);
    this.context.fill()
};
QuadCopter.prototype.drawBody = function() {
    this.context.save();
    this.context.beginPath();
    this.context.moveTo(0,25);
    this.context.lineTo(5,25);
    this.context.bezierCurveTo( 25,25,  20,-25, 0,-25);
    this.context.bezierCurveTo(-20,-25, -25,25, -5,25);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
    this.context.restore();
};
QuadCopter.prototype.drawArm = function() {
    var d = 50*1.41421;
    this.context.save();
    this.context.beginPath();
    this.context.moveTo(  5,10);
    this.context.lineTo(  5, d-10);
    this.context.lineTo( 15, d);
    this.context.lineTo(  0, d+10);
    this.context.lineTo(-15, d);
    this.context.lineTo( -5, d-10);
    this.context.lineTo( -5, 10);
    this.context.fill();
    this.context.stroke();
    this.context.restore();
};
QuadCopter.prototype.draw = function() {
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

    this.context.fillStyle = "#A0C0A0";
    this.context.strokeStyle = "#003300";

    this.drawBody();

    this.context.save();
    this.context.rotate(Math.PI/4);
    this.drawArm();
    this.context.rotate(Math.PI/2);
    this.drawArm();
    this.context.rotate(Math.PI/2);
    this.drawArm();
    this.context.rotate(Math.PI/2);
    this.drawArm();
    this.context.restore();

    this.context.save();
    this.context.fillStyle = "black"
    this.context.strokeStyle = "black";
    this.context.save();
    this.context.translate(50,50);
    this.context.rotate(this.frontPropAngle);
    this.drawProp();
    this.context.restore();

    this.context.save();
    this.context.translate( 50,-50);
    this.context.rotate(-this.backPropAngle);
    this.drawProp();
    this.context.restore();

    this.context.save();
    this.context.translate(-50, 50);
    this.context.rotate(-this.frontPropAngle);
    this.drawProp();
    this.context.restore();

    this.context.save();
    this.context.translate(-50,-50);
    this.context.rotate(this.backPropAngle);
    this.drawProp();
    this.context.restore();
    this.context.restore();

    this.context.restore();
}
QuadCopter.prototype.update = function() {
    this.backPropAngle  += 0.15;
    this.frontPropAngle += 0.15 * this.frontFaster;
    this.pathU += 0.1 * this.speed;
}
