var startTime;
var timerInterval;
var finalTime = 0;
var elapsedTime;
var bestScore = 0;
var started = false;

document.getElementById('start-button').addEventListener('click', function() {
    if(!started){
        // start timer
        startTimer();

        // disable start button + blur focus so space bar won't react to last focus click
        document.getElementById('start-button').disabled = true;
        document.getElementById('start-button').blur();
    
        // apply green background color to body
        document.body.style.backgroundColor = "#00A36C";
        
        // make text white
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

        // enable start button
        document.getElementById('start-button').disabled = false;

        // apply white background color to the body
        document.body.style.backgroundColor = "white";
        
        // make text black
        document.getElementById('title-text').style.color = "black";
        document.getElementById('instructions-text').style.color = "black";
        document.getElementById('high-score-text').style.color = "black";
        document.getElementById('timer-text').style.color = "black";
    }
});

function startTimer() {
    startTime = Date.now();
    started = true;

    // call updateTimer every millisecond
    timerInterval = setInterval(updateTimer, 1);
}
  
function stopTimer() {
    // stop the timer
    clearInterval(timerInterval);
    started = false;

    // display the elapsed time
    updateTimer();
}

async function updateTimer() {
    // calculate elapsed time
    elapsedTime = Date.now() - startTime;

    if(!started){
        finalTime = elapsedTime;
    }

    // convert milliseconds to minutes, seconds, and milliseconds
    var minutes = Math.floor(elapsedTime / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    var milliseconds = elapsedTime % 1000;

    // add leading zeros if necessary
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    milliseconds = milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds;

    // display the formatted time
    document.getElementById('timer').innerHTML = minutes + ':' + seconds + ':' + milliseconds;

    // set high score if this round was the fastest yet
    // first if lets best score run up with timer on first iteration
    // second only applies score if faster than previous fastest score
    if((finalTime < bestScore || bestScore == 0)){
        bestScore = finalTime;
        document.getElementById("high-score").innerHTML = 'Best Score: ' + "<br>" + minutes + ':' + seconds + ':' + milliseconds;

        // if timer is stopped send the best score to the database
        if(!started){
            const data = { bestScore } // , access: 'true' 
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                timestamp: Date.now(),
                body: JSON.stringify(data)
            };
            // send the POST data to the database
            // then store the response data and print in the console
            const response = await fetch('/api', options);
            const json = await response.json();
            console.log(json);
        }
    }
}