function setup() {
    let canvas = document.getElementById('myCanvas');
    let context = canvas.getContext('2d');

    // Variable declarations
    let sliders = [];
    let sliderValues = [];
    let start;
    let elapsed;
    let cycle = 13000;
    let stack = [mat4.create()];
    let curve;
    let tObj;
    let viewAngle;
    let locCamera = vec3.create();
    let distCamera = 200.0;
    let T_look_at = mat4.create();

    // Update the look at matrix
    function lookAtUpdate() {
        locCamera[0] = distCamera * Math.sin(radian(viewAngle));
        locCamera[1] = 50;
        locCamera[2] = distCamera * Math.cos(radian(viewAngle));
        mat4.lookAt(T_look_at, locCamera, [0, 0, 0], [0, 1, 0]);
    }

    // Get the proportion of time elapsed
    function getProportionInTime() {
        return elapsed % cycle / cycle;
    }

    // Degrees to radian
    function radian(angle) {
        return angle * Math.PI / 180; 
    } 

    // Save the current transformation matrix
    function save() { 
        stack.unshift(mat4.clone(stack[0])); 
    }

    // Restore the last transformation matrix
    function restore() { 
        stack.shift(); 
    }

    // Multiply the current transformation matrix with T
    function multi(T) { 
        return mat4.multiply(stack[0], stack[0], T); 
    }

    // Move to the location
    function moveTo(loc) { 
        let pt = vec3.create(); 
        vec3.transformMat4(pt, loc, stack[0]);
        context.moveTo(pt[0], pt[1]); 
    }

    // Draw a line to the location
    function lineTo(loc) { 
        let pt = vec3.create(); 
        vec3.transformMat4(pt, loc, stack[0]); 
        context.lineTo(pt[0], pt[1]); 
    }

    // Draw the grid
    function drawGrid(axesColor, gridColor, size, beyondFloor) { 
        // Variable declarations
        let x = [-size, size]; 
        let x_step = size / 5;
        let y = [-size, size]; 
        let y_step = size / 5;
        let z = [-size, size]; 
        let z_step = size / 5;
        
        context.strokeStyle = gridColor; // Set the grid color

        // Draw the grid on the floor
        if (!beyondFloor) { 
            context.beginPath(); // Start drawing

            // Draw the vertical lines
            for (let xx = x[0]; xx <= x[1]; xx += x_step) {  
                moveTo([xx, 0, z[0]]); lineTo([xx, 0, z[1]]); 
            }

            // Draw the horizontal lines
            for (let zz = z[0]; zz <= z[1]; zz += z_step) { 
                moveTo([x[0], 0, zz]); lineTo([x[1], 0, zz]); 
            }
            
            context.stroke(); // Finish drawing
            return;
        }

        context.lineWidth = 1; // Set line width
        context.beginPath();
        // Draw the horizontal lines
        for (let zz = z[0]; zz <= z[1]; zz += z_step) { 
            // Draw the vertical lines
            for (let yy = y[0]; yy <= y[1]; yy += y_step) { 
                moveTo([x[0], yy, zz]); lineTo([x[1], yy, zz]); 
            }
            // Draw the vertical lines
            for (let xx = x[0]; xx <= x[1]; xx += x_step) { 
                moveTo([xx, y[0], zz]); lineTo([xx, y[1], zz]); 
                }
        }

        // Draw the vertical lines
        for (let yy = y[0]; yy <= y[1]; yy += y_step) { 
            // Draw the vertical lines
            for (let xx = x[0]; xx <= x[1]; xx += x_step) {
                moveTo([xx, yy, z[0]]); lineTo([xx, yy, z[1]]); 
            }
        }
        context.stroke();
        
        context.strokeStyle = axesColor; 
        context.lineWidth = 2; 
        context.beginPath();
        // Draw the axes
        moveTo([x[0], 0, 0]); lineTo([x[1], 0, 0]);
        moveTo([0, y[0], 0]); lineTo([0, y[1], 0]);
        moveTo([0, 0, z[0]]); lineTo([0, 0, z[1]]);
        context.stroke();
    }

    // Initialize the bezier curve
    function bezierInit(distance, maxFloor) { 
        // Variable initializations 
        let edgeX = distance / 2 - floorRadiusRange[1];
        let p = getProportionInTime(); p = p < 0.5 ? p * 2 : (0.5-(p - 0.5)) * 2;
        let centerX = p > 0.5 ? (p - 0.5) / 0.5 * edgeX : -(0.5 - p) * edgeX * 2;
        let dentY = maxFloor - 2;
        curve = [];
        curve[0] = [[-edgeX, maxFloor, 0], [centerX, dentY, 0], [centerX, dentY, 0], [edgeX, maxFloor, 0]];
    }

    // Get the bezier basis
    function bezierBasis(t) { 
        return [1 - 3 * t + 3 * t * t - t * t * t, 3 * t - 6 * t * t + 3 * t * t * t, 3 * t * t - 3 * t * t * t, t * t * t]; 
    }

    // Get the cubic bezier curve
    function someCubic(Basis, P,t) { 
        // Variable initializations
        let b = Basis(t);
        let result = vec3.create();
        vec3.scale(result, P[0], b[0]);
        vec3.scaleAndAdd(result, result, P[1], b[1]);
        vec3.scaleAndAdd(result, result, P[2], b[2]);
        vec3.scaleAndAdd(result, result, P[3], b[3]);

        return result;
    }

    // Get the composite bezier curve
    function composite(t, B) { 
        for(let i = 0; i < curve.length; ++i) { // Get the composite bezier curve
            if (i <= t && t < i + 1) { // Get the composite bezier curve
                return someCubic(B, curve[i], t < 1 ? t : t % i);
            } else if (t == curve.length) { // Get the composite bezier curve
                return someCubic(B, curve[curve.length - 1], 1);
            }
        }
    }

    // Draw the body
    function body(neckHeight) { 
        // Draw the body
        context.beginPath();
        moveTo([0, neckHeight, 0]);
        lineTo([0, neckHeight / 2, 0]); // Draw the neck
        lineTo([neckHeight / 8, neckHeight / 3, -neckHeight / 9]); // Draw the left leg
        lineTo([0, 0, 0]);
        moveTo([0, neckHeight / 2, 0]); // Draw the right leg
        lineTo([neckHeight / 8, neckHeight / 3, neckHeight / 9]);
        lineTo([0, 0, 0]);
        context.stroke();
        
        // Draw the arms
        context.beginPath();
        moveTo([0, neckHeight / 3 * 2.2, 0]); // Draw the left arm
        lineTo([neckHeight / 4, neckHeight / 3 * 1.8, neckHeight / 8]);
        lineTo([neckHeight / 2, neckHeight / 3 * 1.6, 0]);
        moveTo([0, neckHeight / 3 * 2.2, 0]); // Draw the right arm
        lineTo([neckHeight / 4, neckHeight / 3 * 1.8, -neckHeight / 8]);
        lineTo([neckHeight / 2, neckHeight / 3 * 1.6, 0]);
        context.stroke();
        
    }

    // Draw the object
    function person() { 
        context.strokeStyle = '#000000'; 
        context.lineWidth = 2; 
        context.beginPath(); 
        body(1.5); // Draw the body
        context.stroke(); 

        // Draw giant stick
        context.strokeStyle = '#9C4722';
        context.lineWidth = 2;
        context.beginPath();
        moveTo([0, 1.5 / 3 * 1.8, 0]);
        lineTo([1.5 * 2, 1.5 / 3 * 1.8, 1.5 / 8]);
        context.stroke();
        
    }

     // Position the object
    function positionObject() {
        save(); // Save the current transformation matrix
        let T_to_obj = mat4.create(); // Create a transformation matrix
        mat4.fromTranslation(T_to_obj, composite(tObj, bezierBasis)); // Create a transformation matrix
        mat4.rotateY(T_to_obj, T_to_obj, radian(90)); // Create a transformation matrix
        multi(T_to_obj); // Multiply the transformation matrix
        person(); // Draw the object
        save(); // Save the current transformation matrix
        let T_mirror = mat4.create(); // Create a transformation matrix
        mat4.scale(T_mirror, T_mirror, [-1, 1, -1]); // Create a transformation matrix
        multi(T_mirror); // Multiply the transformation matrix
        person(); // Draw the object
        restore(); // Restore the previous transformation matrix
        restore(); // Restore the previous transformation matrix
    }

    // Draw the curve
    function drawCurve(t0, t1, granularity, curve, color, P, thickness) { 
        // Variable initializations
        context.strokeStyle = color;
        context.lineWidth = thickness;
        context.beginPath();

        P ? moveTo(curve(bezierBasis, P, t0)) : moveTo(curve(t0)); // Draw the curve

        // Draw the curve
        for(let i = 0; i <= granularity; ++i) { 
            let p = (granularity - i) / granularity;
            let t = p * t0 + (i / granularity) * t1;
            let coordinate = P ? curve(bezierBasis, P, t) : curve(t); 
            lineTo(coordinate);
        }
        context.stroke(); // Finish drawing
    }

    let floorRadiusRange = [3 / 3, 10 / 3]; // The range of the floor radius

    // Get the floor radius
    function getFloorRadius(floor, maxFloor, midFloor) { 
        // Variable declarations
        let radius; 
        let min = floorRadiusRange[0]; 
        let range = floorRadiusRange[1] - floorRadiusRange[0];

        // If the floor is greater than the middle floor or not
        if (floor >= midFloor) { 
            radius = min + range * (floor-midFloor) / (maxFloor-midFloor);
        } else { 
            radius = min + range * (midFloor-floor) / (maxFloor - (maxFloor - midFloor));
        }

        return radius;
    }

    // Draw the building
    function drawBuilding(maxFloor, midFloor, buildingSide, strokeColor, roofColor) { 
        // Variable initializations
        let floorRadius;
        let rad;
        let startAngle = 90;
        let startRadian = radian(startAngle);
        let angleJump = 360 / 30;
        let x; 
        let y; 
        let z;
        context.strokeStyle = strokeColor; 
        context.lineWidth = 2;

        // Check if the angle is invisible
        var isInvisible = function(angle) { 
            // Variable initializations
            let compareAngle = Math.abs(angle - startAngle);
            let va = viewAngle % 360;

            if (90 <= va && va < 270) { // If the view angle is between 90 and 270
                return va + 90 < compareAngle || compareAngle < (va + 270) % 360;
            } else { // If the view angle is between 0 and 90 or between 270 and 360
                return (va + 90) % 360 < compareAngle && compareAngle < (va + 270) % 360;
            }
        }

        // Draw the bottom to middle part of the building
        var bottomToMiddle = function(angle, fillColor, strokeColor) { 
            context.beginPath();
            rad = radian(angle);
            x = floorRadiusRange[1] * Math.cos(rad);
            z = floorRadiusRange[1] * Math.sin(rad);
            moveTo([x, 0, z]);
            x = floorRadiusRange[0] * Math.cos(rad);
            z = floorRadiusRange[0] * Math.sin(rad);
            lineTo([x, maxFloor - midFloor, z]);
            rad = radian(angle + angleJump);
            x = floorRadiusRange[0] * Math.cos(rad);
            z = floorRadiusRange[0] * Math.sin(rad);
            lineTo([x, maxFloor-midFloor, z]);
            x = floorRadiusRange[1] * Math.cos(rad);
            z = floorRadiusRange[1] * Math.sin(rad);
            lineTo([x, 0, z]);
            context.closePath();
            context.strokeStyle = strokeColor;
            context.stroke();
            context.fillStyle = fillColor;
            context.fill();
        }

        // Draw the middle to top part of the building
        var middleToTop = function(angle, fillColor, strokeColor) { 
            rad = radian(angle);
            x = floorRadiusRange[0] * Math.cos(rad);
            z = floorRadiusRange[0] * Math.sin(rad);
            moveTo([x, maxFloor - midFloor, z]);
            x = floorRadiusRange[1] * Math.cos(rad);
            z = floorRadiusRange[1] * Math.sin(rad);
            lineTo([x, maxFloor, z]);
            rad = radian(angle + angleJump);
            x = floorRadiusRange[1] * Math.cos(rad);
            z = floorRadiusRange[1] * Math.sin(rad);
            lineTo([x, maxFloor, z]);
            x = floorRadiusRange[0] * Math.cos(rad);
            z = floorRadiusRange[0] * Math.sin(rad);
            lineTo([x, maxFloor - midFloor, z]);
            context.closePath();
            context.strokeStyle = strokeColor;
            context.stroke();
            context.fillStyle = fillColor;
            context.fill();
        }


        // Draw the roof barrier
        var roofBarrier = function(color, barrierHeight, buildingSide) { 
            context.beginPath();
            moveTo([floorRadius * Math.cos(startRadian), y + barrierHeight, floorRadius * Math.sin(startRadian)]);

            for (let angle = startAngle; angle >= startAngle - 360; angle -= angleJump) { // Draw the roof barrier
                rad = radian(angle); 
                x = floorRadius * Math.cos(rad); 
                z = floorRadius * Math.sin(rad);
            
                moveTo([x, maxFloor + barrierHeight, z]);
                lineTo([x, maxFloor, z]);

                if (buildingSide == "left" && angle > 0 && angle - angleJump < 0) {
                    continue;
                }
                if (buildingSide == "right" && angle > -180 && angle - angleJump < -180) {
                    continue;
                }

                moveTo([x, maxFloor + barrierHeight, z]);

                angle -= angleJump; 
                rad = radian(angle); 
                x = floorRadius * Math.cos(rad); 
                z = floorRadius * Math.sin(rad);
                lineTo([x, maxFloor+barrierHeight, z]);
                angle += angleJump;
            }

            context.strokeStyle = color;
            context.stroke();
        }

        // Draw the buildings
        for (let angle = startAngle; angle >= startAngle - 360; angle -= angleJump) { 
            if (isInvisible(angle)) { // If the building is invisible
                continue;
            }

            let fillColor = '#A8CAE2'
            let strokeColor = 'black'
            bottomToMiddle(angle, fillColor, strokeColor);
            middleToTop(angle, fillColor, strokeColor);
        }

        // Draw the floors 
        for (let floor = maxFloor; floor >= 0; floor--) { 
            y = maxFloor-floor;
            floorRadius = getFloorRadius(floor, maxFloor, midFloor);

            context.beginPath();
            moveTo([floorRadius * Math.cos(startRadian), y, floorRadius * Math.sin(startRadian)]);

            for (let angle = startAngle; angle >= startAngle-360; angle -= angleJump) { // Draw the floors
                rad = radian(angle)
                x = floorRadius * Math.cos(rad);
                z = floorRadius * Math.sin(rad);
                if (floor == 0) { // If the floor is the bottom floor
                    lineTo([x, y, z]);
                } else { // If the floor is not the bottom floor
                    if (isInvisible(angle)) { // If the building is invisible
                        moveTo([x, y, z]);
                    } else { // If the building is not invisible
                        lineTo([x, y, z]);
                    }
                }
            }

            context.stroke();

            // If the floor is the bottom floor
            if (floor == 0) { 
                context.closePath(); context.fillStyle = roofColor; context.fill();
            }
        }

        roofBarrier("#808080", 0.3, buildingSide);
    }

    // Position the buildings and the rope
    function positionBuildingsAndRope(distance) { 
        // Variable declarations
        let maxFloor = 22;
        let midFloor = 10;
        let strokeColor = "gray";
        let roofColor = "black";
        let ropeColor = "#875638";

        // Draw the left building
        var leftBuilding = function() { 
            save();
            let T_to_left_building = mat4.create();
            mat4.fromTranslation(T_to_left_building, [-distance / 2, 0, 0]);
            multi(T_to_left_building);
            drawBuilding(maxFloor, midFloor, "left", strokeColor, roofColor);
            restore();
        }

        // Draw the right building
        var rightBuilding = function() { 
            save();
            let T_to_right_building = mat4.create();
            mat4.fromTranslation(T_to_right_building, [distance / 2, 0, 0]);
            multi(T_to_right_building);
            drawBuilding(maxFloor, midFloor, "right", strokeColor, roofColor);
            restore();
        }

        // Draw the rope
        var drawRope = function() { 
            for (let i = 0; i < curve.length; ++i)
                drawCurve(0, 1, 200, someCubic, ropeColor, curve[i], 5);
        }

        bezierInit(distance, maxFloor); // Initialize the bezier curve

        // If the view angle is greater than 180 or not
        if (viewAngle % 360 > 180) { 
            rightBuilding(); 
            drawRope(); 
            leftBuilding();
        } else { 
            leftBuilding(); 
            drawRope(); 
            rightBuilding();
        }
    }

    // Update the slider
    function sliderUpdate() { 
        for(let i = 0; i < 1; ++i) {
            if (sliderValues[i] != sliders[i].value) {
                sliderValues[i] = (sliders[i].value);
            }
        }
    }

    // Initialize the sliders
    function sliderInit() { 
        for(let i = 0; i < 1; ++i) { 
            sliders[i] = (document.getElementById('slider' + i)); 
            sliders[i].addEventListener("input", draw);
        }

        sliders[0].value = 0; // Set the view angle slider to 0
        sliderUpdate(); // Update the sliders
    }

    // Draw the scene
    function draw(timestamp) { 
        canvas.width = canvas.width; // Clear the canvas
        timestamp = Date.now(); // Get the current time

        // If the start time is undefined
        if (start === undefined) { 
            start = timestamp;
        }

        elapsed = timestamp - start; // Get the elapsed time

        let p = getProportionInTime(); // Get the proportion in time
        tObj = p < 0.5 ? p * 2 : (0.5 - (p - 0.5)) * 2; // Get the proportion in time for the object
        sliderUpdate(); // Update the sliders
        viewAngle = getProportionInTime() * 360; // Get the view angle
        lookAtUpdate(); // Update the look at matrix
        
        save(); // Save the current matrix
        let T_viewport = mat4.create(); // Create the viewport matrix
        let scale = 20; // Set the scale
        mat4.fromTranslation(T_viewport, [canvas.width / 2, canvas.height / 4 * 3, 0]); // Set the translation
        mat4.scale(T_viewport, T_viewport, [scale, -scale, -scale]); // Set the scale
        let T_projection = mat4.create(); // Create the projection matrix
        mat4.perspective(T_projection, Math.PI / 500, 1, -100000000, 10000000000000); // Set the perspective
        multi(T_viewport); // Multiply the viewport matrix
        multi(T_projection); // Multiply the projection matrix
        multi(T_look_at); // Multiply the look at matrix
        drawGrid("black", "#333", 50, sliders[0].value == 1 ? true : false); // Draw the grid
        positionBuildingsAndRope(40); // Position the buildings and the rope
        positionObject(); // Position the object
        restore(); // Restore the matrix

        window.requestAnimationFrame(draw); // Request the next frame
    }
    sliderInit(); // Initialize the sliders
    window.requestAnimationFrame(draw); // Request the first frame
}
window.onload = setup(); // Setup the scene
