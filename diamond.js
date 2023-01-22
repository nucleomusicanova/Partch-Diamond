var i = 0;
var mousePressed = false;
var lastIdentityPlayer;
var fundamentalPitch;

// =================================================
function setup() {
    canvaSize = 550;
    cnv = createCanvas(canvaSize, canvaSize);
    diamondLimit = 5;
    background(255);
    fundamentalPitch = 261.63 / 2;
    // rect rect around canvas, add round corners
    stroke(0);
    strokeWeight(1);
    noFill(); 
    rect(0, 0, canvaSize, canvaSize, 20);

}

// =================================================
function freq2midi(freq) {
    return 69 + 12 * Math.log2(freq / 440);
}

// =================================================
// =================================================
function draw() {
    var x = canvaSize / 2;
    var y = canvaSize / 2;
    var w = 350;
    var h = 350;
    var angle = 45;
    var identities = [];

    // get all odd-number until diamondLimit
    for(var i = 0; i <= diamondLimit; i++) {
	if (i % 2 == 1) {
	    identities.push(i);
	}
    }
    identities.reverse();


    push();
    translate(x, y);
    rotate(radians(angle));
    var positions = [w / 2, h / 2, w / 4, h / 4];
    var mousePos = createVector(mouseX, mouseY);
    var rectPos = createVector(x, y);
    var mousePosTranslated = mousePos.sub(rectPos);
    var mousePosRotated = mousePosTranslated.rotate(radians(-angle));

    // all positions
    var allPositions = [];
    var allRatios = [];
    // draw the diamond
    var numberOfIdenties = identities.length;
    for(var i = 0; i < numberOfIdenties; i++) {
        for(var j = 0; j < numberOfIdenties; j++) {
            fill(255, 255, 255);
            var actualPos = createVector(-w / 2 + i * w / numberOfIdenties, -h / 2 + j * h / numberOfIdenties);
            rect(actualPos.x, actualPos.y, w / numberOfIdenties, h / numberOfIdenties);
            allPositions.push(actualPos);
            // draw ratios
            fill(0, 0, 0);
            // get center  of the rect
            var center = createVector(actualPos.x + w / (numberOfIdenties * 2), actualPos.y + h / (numberOfIdenties * 2));
            // draw the text
            var identityText = identities[j] + "/" + identities[i];
            allRatios.push(identityText);
            var textWidth = identityText.length * 10;
            textSize(10);
            text(identityText, center.x, center.y);
        }
    }

    var someWasClicked = false;
    for(var i = 0; i < allPositions.length; i++) {
        if (mousePosRotated.x > allPositions[i].x &&
            mousePosRotated.x < (allPositions[i].x + w / numberOfIdenties) &&
            mousePosRotated.y > allPositions[i].y &&
            mousePosRotated.y < (allPositions[i].y + h / numberOfIdenties)) {
            someWasClicked = true;
            fill(238);
            rect(allPositions[i].x, allPositions[i].y, w / numberOfIdenties, h / numberOfIdenties);
            fill(0, 0, 0);
            textSize(10);
            text(allRatios[i], allPositions[i].x + w / (numberOfIdenties * 2), allPositions[i].y + h / (numberOfIdenties * 2));
            if (lastIdentityPlayer != i){
                lastIdentityPlayer = i;
                if (document.getElementById("transportButton").checked === false){
                    var message = "You need to turn on the Sound First";
                    alert(message);
                }
                else{
                    actualRatio = allRatios[i];
                    // get denominator and numerator
                    var denominator = actualRatio.split("/")[0];
                    var numerator = actualRatio.split("/")[1];
                    // get the frequency
                    var freq = fundamentalPitch * (denominator / numerator);
                    // get the midi note
                    var note = freq2midi(freq);
                    if(loader.webAudioWorklet) {
                        loader.sendFloatParameterToWorklet("notes", note);
                      } else {
                        loader.audiolib.setFloatParameter("notes", note);
                      }
                }
            }
            
        } 
    }
    if (someWasClicked === false) {
        lastIdentityPlayer = -1;
    }
    pop();
}


// =================================================
// if mouse if clicked, then draw the background
function mouseClicked() {
    mousePressed = false;
    console.log("mousePressed");
}

// =================================================
// mouse is released
function mouseReleased() {
    mousePressed = true;
    console.log("mouseReleased");
    
}

// =================================================
// 
function newDiamondLimit(limit){
    diamondLimit = limit;
}




