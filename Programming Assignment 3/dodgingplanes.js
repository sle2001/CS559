function setup() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var slider1 = document.getElementById('slider1');
    slider1.value = -25;

    function draw() {
	canvas.width = canvas.width;
	// use the sliders to get the angles
	var tParam = slider1.value*0.01;
	
	function moveToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.lineTo(res[0],res[1]);}
	
	function drawObject(color,Tx) {
	    context.beginPath();
	    context.fillStyle = color;
	    moveToTx([-.55,-.05],Tx);
	    lineToTx([-.55,.05],Tx);
        lineToTx([.05,.05],Tx);
      	lineToTx([.1,0],Tx);
	    lineToTx([.05,-.05],Tx);
	    context.closePath();
	    context.fill();

		context.beginPath();
		context.fillStyle = color;
		moveToTx([-.25, -.4],Tx);
		lineToTx([-.25, .4],Tx);
		lineToTx([-0.1, 0], Tx);
		context.closePath();
		context.fill();
	}

	var Hermite = function(t) {
	    return [
		2*t*t*t-3*t*t+1,
		t*t*t-2*t*t+t,
		-2*t*t*t+3*t*t,
		t*t*t-t*t
	    ];
	}

	var HermiteDerivative = function(t) {
            return [
		6*t*t-6*t,
		3*t*t-4*t+1,
		-6*t*t+6*t,
		3*t*t-2*t
            ];
	}

	function Cubic(basis,P,t){
	    var b = basis(t);
	    var result=vec2.create();
	    vec2.scale(result,P[0],b[0]);
	    vec2.scaleAndAdd(result,result,P[1],b[1]);
	    vec2.scaleAndAdd(result,result,P[2],b[2]);
	    vec2.scaleAndAdd(result,result,P[3],b[3]);
	    return result;
	}
	
	var p0=[0,0];
	var d0=[1,3];
	var p1=[1,1];
	var d1=[-1,3];
	var p2=[2,2];
	var d2=[0,3];

	var P0 = [p0,d0,p1,d1]; // First two points and tangents
	var P1 = [p1,d1,p2,d2]; // Last two points and tangents

	var C0 = function(t_) {return Cubic(Hermite,P0,t_);};
	var C1 = function(t_) {return Cubic(Hermite,P1,t_);};

	var C0prime = function(t_) {return Cubic(HermiteDerivative,P0,t_);};
	var C1prime = function(t_) {return Cubic(HermiteDerivative,P1,t_);};

	var Ccomp = function(t) {
            if (t<1){
		var u = t;
		return C0(u);
            } else {
		var u = t-1.0;
		return C1(u);
            }          
	}

	var Ccomp_tangent = function(t) {
            if (t<1){
		var u = t;
		return C0prime(u);
            } else {
		var u = t-1.0;
		return C1prime(u);
            }          
	}

	function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
            moveToTx(C(t_begin),Tx);
            for(var i=1;i<=intervals;i++){
		var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
		lineToTx(C(t),Tx);
            }
            context.stroke();
	}

	function drawBackground() {
		context.beginPath();
		context.fillStyle = "black";
		context.moveTo(0,0);
		context.lineTo(400,0);
		context.lineTo(400,400);
		context.lineTo(0,400);
		context.closePath();
		context.fill();

		context.beginPath();
		context.fillStyle = "gray";
		context.moveTo(50,120);
		context.lineTo(50,150);
		context.lineTo(0,150);
		context.lineTo(50,170)
		context.lineTo(50,200);
		context.lineTo(60,206);
		context.lineTo(70,200);
		context.lineTo(70,170);
		context.lineTo(120,150);
		context.lineTo(70,150);
		context.lineTo(70,120);
		context.closePath();
		context.fill();

		context.beginPath();
		context.fillStyle = "gray";
		context.moveTo(335, 300);
		context.lineTo(325, 294);
		context.lineTo(325, 264);
		context.lineTo(275, 244);
		context.lineTo(325,244);
		context.lineTo(325,194);
		context.lineTo(345,194);
		context.lineTo(345,244);
		context.lineTo(395,244);
		context.lineTo(345,264);
		context.lineTo(345,294)
		context.closePath();
		context.fill();

		context.beginPath();
		context.fillStyle = "gray";
		context.moveTo(200,65);
		context.lineTo(190,59);
		context.lineTo(190,29);
		context.lineTo(140,9);
		context.lineTo(190,9);
		context.lineTo(190,0);
		context.lineTo(210,0);
		context.lineTo(210,9);
		context.lineTo(260,9);
		context.lineTo(210,29);
		context.lineTo(210,59);
		context.closePath();
		context.fill();

	}

	drawBackground();
	var Tblue_to_canvas = mat3.create();
	mat3.fromTranslation(Tblue_to_canvas,[50,350]);
	mat3.scale(Tblue_to_canvas,Tblue_to_canvas,[150,-150]); // Flip the Y-axis

	drawTrajectory(0.0,1.0,100,C0,Tblue_to_canvas,"black");
	drawTrajectory(0.0,1.0,100,C1,Tblue_to_canvas,"black");
	var Tgreen_to_blue = mat3.create();
	mat3.fromTranslation(Tgreen_to_blue,Ccomp(tParam));
	var Tgreen_to_canvas = mat3.create();
	var tangent = Ccomp_tangent(tParam);
	var angle = Math.atan2(tangent[1],tangent[0]);
	mat3.rotate(Tgreen_to_blue,Tgreen_to_blue,angle);
	mat3.multiply(Tgreen_to_canvas, Tblue_to_canvas, Tgreen_to_blue);
	drawObject("grey",Tgreen_to_canvas);
    }
    
    slider1.addEventListener("input",draw);
    draw();
}
window.onload = setup;
