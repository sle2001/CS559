function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
  var slider2 = document.getElementById('slider2');
  slider2.value = 0;
  function draw() {
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    // use the sliders to get various parameters
    var dx = slider1.value;
    var dy = slider2.value;

    // Draw the wall of the house
    function DrawBackground(color) {
      context.beginPath();
      context.fillStyle = color;
      context.moveTo(0,0);
      context.lineTo(0,350);
      context.lineTo(400,350);
      context.lineTo(400,0);
      context.closePath();
      context.fill();      
    }

    // Draw the wood floor
    function DrawFloor(color) {
      context.beginPath();
      context.fillStyle = color;
      context.moveTo(0,350);
      context.lineTo(0,400);
      context.lineTo(400,400);
      context.lineTo(400,350);
      context.closePath();
      context.fill();
    }

    function DrawFloorTexture(color) {
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = 1;

      // Horizontal lines
      context.moveTo(0,362.5);
      context.lineTo(400,362.5);

      context.moveTo(0,375);
      context.lineTo(400,375);
      
      context.moveTo(0,387.5);
      context.lineTo(400,387.5);

      // Vertical lines
      context.moveTo(100,350);
      context.lineTo(100,362.5);
      
      context.moveTo(200,362.5);
      context.lineTo(200,375);

      context.moveTo(300, 375);
      context.lineTo(300,387.5);

      context.moveTo(400,387.5);
      context.lineTo(400,400);

      context.moveTo(0,387.5);
      context.lineTo(0,400);
      
      context.stroke();
    }

    function DrawMouseHole(color) {
      context.beginPath();
      context.fillStyle = color;
      context.moveTo(200,200);
      context.arc(288, 75, 70, 0, Math.PI, false);
      context.closePath();
      context.fill();
    }

    DrawBackground("#c4b39c"); 
    DrawFloor("#ffa54f");
    DrawFloorTexture("black");
    DrawMouseHole("black");
    context.save();
    context.translate(dx,dy);
    context.restore();
  }
  slider1.addEventListener("input",draw);
  slider2.addEventListener("input",draw);
  draw();
}
window.onload = setup;
