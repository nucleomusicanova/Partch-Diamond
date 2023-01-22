var i = 0;
var mousePressed = false;
var lastIdentityPlayer;
var fundamentalPitch;
var playNumber  = 1;
var reduceOctave;


// =================================================
function freq2midi(freq) {
    return 69 + 12 * Math.log2(freq / 440);
}

// =================================================
function reduceOctaveOfRatio(nume, deno){
    var octave = nume / deno;
    var newRatio;
    if (octave > 2){
        newDeno = deno * 2;
        return reduceOctaveOfRatio(nume, newDeno);
    }
    if (octave < 1){
        newNume = nume * 2;
        return reduceOctaveOfRatio(newNume, deno);
    }
    
    if (octave <= 2 && octave >= 1){
        return nume + "/" + deno;
    }
}

// =================================================
function setup() {
    canvaSize = 525;
    cnv = createCanvas(canvaSize, canvaSize);
    diamondLimit = 5;

}

// =================================================
// =================================================
function draw() {
    background(255);
    stroke(0);
    strokeWeight(1);
    noFill(); 
    rect(0, 0, canvaSize, canvaSize, 20);
    var fundamentalPitch = document.getElementById("fundRange");
    fundamentalPitch = fundamentalPitch.value;
    text("Fundamental Pitch: " + fundamentalPitch + " Hz", 10, 20);
    reduceOctave = document.getElementById("reduceOctave").checked;
    strokeWeight(1);
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
            if (reduceOctave === true){
                identityText = reduceOctaveOfRatio(identities[j], identities[i]);
            }
            allRatios.push(identityText);
            var textWidth = identityText.length * 10;
            textSize(12);
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
            textSize(14);
            text(allRatios[i], allPositions[i].x + w / (numberOfIdenties * 2), allPositions[i].y + h / (numberOfIdenties * 2));
            if (lastIdentityPlayer != i){
                lastIdentityPlayer = i;
                if (document.getElementById("transportButton").checked === false){
                    var message = "You need to turn on the Sound First";
                    alert(message);
                }
                else{
                    actualRatio = allRatios[i];
                    var denominator = actualRatio.split("/")[0];
                    var numerator = actualRatio.split("/")[1];
                    // if reduceOctave is true, then reduce the octave
                    var freq = fundamentalPitch * (denominator / numerator);
                    var note = freq2midi(freq);
                    playName = "player" + playNumber;
                    playNumber = playNumber + 1;
                    if (playNumber > 7){
                        playNumber = 1;
                    }
                    if(loader.webAudioWorklet) {
                        loader.sendFloatParameterToWorklet(playName, note);
                    } 
                    else {
                        loader.audiolib.setFloatParameter(playName, note);
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
    reduceOctave = document.getElementById("octaveReduce").checked;
}




