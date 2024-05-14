var startTime;
var timerInterval;
var finalTime = 0;
var bestScore = 0;
var started = false;

document.getElementById('start-button').addEventListener('click', function() {
    if(!started){
        // start timer
        startTimer();
        started = true;

        // Disable start button + blur focus so space bar won't react to last focus click
        document.getElementById('start-button').disabled = true;
        document.getElementById('start-button').blur();
    
        // Apply green background color to body
        document.body.style.backgroundColor = "#00A36C";
        
        // Make text white
        document.getElementById('title-text').style.color = "white";
        document.getElementById('instructions-text').style.color = "white";
        document.getElementById('high-score-text').style.color = "white";
        document.getElementById('timer-text').style.color = "white";
    }
    else{
        alert("hit");
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code == 'Space' && started) {
        
        // stop timer
        stopTimer();
        started = false;

        // enable start button
        document.getElementById('start-button').disabled = false;

        // Apply white background color to the body
        document.body.style.backgroundColor = "white";
        
        // Make text black
        document.getElementById('title-text').style.color = "black";
        document.getElementById('instructions-text').style.color = "black";
        document.getElementById('high-score-text').style.color = "black";
        document.getElementById('timer-text').style.color = "black";
    }
});

function startTimer() {
    startTime = Date.now();

    // call updateTimer every millisecond
    timerInterval = setInterval(updateTimer, 1);
}
  
function stopTimer() {
    // Stop the timer
    clearInterval(timerInterval);

    // Calculate final time
    finalTime = Date.now() - startTime;

    // Display the formatted time
    updateTimer();
}

function updateTimer() {
    // Calculate elapsed time
    var elapsedTime = Date.now() - startTime;

    // Convert milliseconds to minutes, seconds, and milliseconds
    var minutes = Math.floor(elapsedTime / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    var milliseconds = elapsedTime % 1000;

    // Add leading zeros if necessary
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    milliseconds = milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds;

    // Display the formatted time
    document.getElementById('timer').innerHTML = minutes + ':' + seconds + ':' + milliseconds;

    // Set high score if this round was the fastest yet
    if(finalTime < bestScore || bestScore == 0){
        bestScore = elapsedTime;

        document.getElementById("high-score").innerHTML = 'Best Score: ' + "<br>" + minutes + ':' + seconds + ':' + milliseconds;
    }
}