var i = 0;
var mousePressed = false;
var lastIdentityPlayer;
var fundamentalPitch;
var playNumber  = 1;
var reduceOctave;
var soundPlayer = 'sf'; 

// =================================================
function freq2midi(freq) {
    return 69 + 12 * Math.log2(freq / 440);
}

// =================================================
function midi2freq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
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
    // create 
}

// =================================================
// =================================================
function draw() {
    reduceOctave = document.getElementById("reduceOctave").checked;
    background(255);
    stroke(0);
    strokeWeight(1);
    noFill(); 
    rect(0, 0, canvaSize, canvaSize, 20);
    var fundamentalPitch = document.getElementById("fundRange");
    fundamentalPitch = fundamentalPitch.value;
    text("Fundamental Pitch: " + fundamentalPitch + " Hz", 10, 20);
    strokeWeight(1);
    var x = canvaSize / 2;
    var y = canvaSize / 2;
    var w = 350;
    var h = 350;
    var angle = 45;
    var identities = [];

    for(var i = 0; i <= diamondLimit; i++) {
	if (i % 2 == 1) {
	    identities.push(i);
	}
    }
    // put identities in ascendent order
    var identityPositions;
    var identityOrder = [];
    for (var i = 0; i < identities.length; i++){
        identityPositions = reduceOctaveOfRatio(identities[i], 1);
        nume = identityPositions.split("/")[0];
        deno = identityPositions.split("/")[1];
        identityOrder.push(nume / deno);
    }
    var identityOrdered = identityOrder.slice();
    identityOrdered.sort(function(a, b){return a-b});
    var sortedIdentities = [];
    for (var i = 0; i < identities.length; i++){
        var index = identityOrdered.indexOf(identityOrder[i]);
        sortedIdentities.push(identities[index]);
    }
    identities = sortedIdentities.slice();
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
    var numberOfIdenties = identities.length;
    for(var i = 0; i < numberOfIdenties; i++) {
        for(var j = 0; j < numberOfIdenties; j++) {
            fill(255, 255, 255);
            var actualPos = createVector(-w / 2 + i * w / numberOfIdenties, -h / 2 + j * h / numberOfIdenties);
            rect(actualPos.x, actualPos.y, w / numberOfIdenties, h / numberOfIdenties);
            allPositions.push(actualPos);
            fill(0, 0, 0);
            var center = createVector(actualPos.x + w / (numberOfIdenties * 2), actualPos.y + h / (numberOfIdenties * 2));
            var identityText = identities[j] + "/" + identities[i];
            push();
            translate(center.x , center.y);
            rotate(radians(-45));
            if (reduceOctave === true){
                identityText = reduceOctaveOfRatio(identities[j], identities[i]);
            }
            allRatios.push(identityText);
            var textWidth = identityText.length * 10;
            translate(-textWidth / 2, 5);
            text(identityText, 0, 0);
            pop();
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
            push();
            var center = createVector(allPositions[i].x + w / (numberOfIdenties * 2), allPositions[i].y + h / (numberOfIdenties * 2));
            translate(center.x , center.y);
            rotate(radians(-45));
            var identityText = allRatios[i];
            var textWidth = identityText.length * 10;
            translate(-textWidth / 2, 5);
            textSize(20);
            text(identityText, 0, 0);
            pop();

            if (lastIdentityPlayer != i){
                lastIdentityPlayer = i;
                if (document.getElementById("transportButton").checked === false){
                    var message = "You can hear the sound if you Turn on the Audio";
                    alert(message);
                }
                else{
                    actualRatio = allRatios[i];
                    var denominator = actualRatio.split("/")[0];
                    var numerator = actualRatio.split("/")[1];
                    var freq = fundamentalPitch * (denominator / numerator);
                    var note = freq2midi(freq);
                    playName = "player" + playNumber;
                    playNumber = playNumber + 1;
                    if (playNumber > 7){
                        playNumber = 1;
                    }


                    if (soundPlayer == "pd"){
                        if(loader.webAudioWorklet) {
                            loader.sendFloatParameterToWorklet(playName, note);
                        } 
                        else {
                            loader.audiolib.setFloatParameter(playName, note);
                        }
                    }
                    else{
                        // freq = freq2midi(note);
                        freq = freq2midi(freq);
                        sf.play(freq, ac.currentTime, { duration: 2, release: 1, amp: 0.5 });

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
    if (diamondLimit === null){
        diamondLimit = 5;
    }
    reduceOctave = document.getElementById("octaveReduce").checked;
    console.log("reduceOctave: " + reduceOctave);
    console.log("diamondLimit: " + diamondLimit);

}




