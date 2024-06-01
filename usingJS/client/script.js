var startTime;
var timerInterval;
var finalTime = 0;
var elapsedTime;
var bestScore;
var started = false;
var dbEmpty = false;

// 
// Loads in the bestScore from the database to fill in the Best Score: text
// 
document.addEventListener("DOMContentLoaded", async function() {
    const response = await fetch('/api');
    const data = await response.json();

    // first json string in data (will be the only one)
    const item = data[0];

    if(item == null){
        bestScore = 0;
        dbEmpty = true;
        document.getElementById("high-score").innerHTML = 'Best Score:' + '<br>' + '00:00:00';
    }
    else {
        // set bestScore to best score in database 
        // (set final score to best score so that the first time off a refresh doesn't track as 0)
        // display the time on the webpage
        bestScore = item.bestScore;
        finalTime = item.bestScore;
        const timeString = makeTimeString(bestScore);
        document.getElementById("high-score").innerHTML = 'Best Score:' + '<br>' + timeString;
    }
    // for testing
    console.log("Current data:");
    console.log(data);
    //
});

// 
// Starts the timer and changes screen colors when start button is clicked
// 
document.getElementById('start-button').addEventListener('click', function() {
    if(!started){
        // start timer
        startTimer();

        // disable start button + blur focus so space bar won't react to last focus click
        document.getElementById('start-button').disabled = true;
        document.getElementById('start-button').blur();
        document.getElementById('reset-button').disabled = true;
    
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

// 
// Deletes data in the database (resets bestScore) when reset button in clicked
// 
document.getElementById('reset-button').addEventListener('click', async function() {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    // send the DELETE request to the database
    // then store the response data and print in the console
    const response = await fetch('/api', options);
    const json = await response.json();
    console.log("Delete message:");
    console.log(json);

    // reset best score data
    bestScore = 0;
    finalTime = 0;
    dbEmpty = true;
    document.getElementById("high-score").innerHTML = 'Best Score:' + '<br>' + '00:00:00';
});

// 
// Stops timer and sets screen colors back when space bar is clicked
// 
document.addEventListener('keydown', function(event) {
    if (event.code == 'Space' && started) {
        
        // stop timer
        stopTimer();

        // enable start button
        document.getElementById('start-button').disabled = false;
        document.getElementById('reset-button').disabled = false;

        // apply white background color to the body
        document.body.style.backgroundColor = "white";
        
        // make text black
        document.getElementById('title-text').style.color = "black";
        document.getElementById('instructions-text').style.color = "black";
        document.getElementById('high-score-text').style.color = "black";
        document.getElementById('timer-text').style.color = "black";
    }
});

// 
// Starts timer and starts clock increments
// 
function startTimer() {
    startTime = Date.now();
    started = true;

    // call updateTimer every millisecond
    timerInterval = setInterval(updateTimer, 1);
}

// 
// Stops timer and stops clock increments
// 
function stopTimer() {
    // stop the timer
    clearInterval(timerInterval);
    started = false;

    // display the elapsed time
    updateTimer();
}

// 
// Method that increments timer and sets best score if time current time is quicker
// POST to database is also handled here when best score is hit
// 
async function updateTimer() {
    // calculate elapsed time
    elapsedTime = Date.now() - startTime;

    // if timer is stopped
    if(!started){
        finalTime = elapsedTime;
    }

    // get the formatted time
    const timeString = makeTimeString(elapsedTime);
    document.getElementById('timer').innerHTML = timeString;

    // set high score if this round was the fastest yet
    // first if lets best score run up with timer on first iteration
    // second only applies score if faster than previous fastest score
    if((finalTime < bestScore || bestScore == 0)){
        bestScore = finalTime;
        document.getElementById("high-score").innerHTML = 'Best Score:' + '<br>' + timeString;

        // if timer is stopped send the best score to the database
        if(!started){
            if(dbEmpty){
                dbEmpty = false;

                const data = { bestScore }; 
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
                console.log("Post data:");
                console.log(json);
            }
            else {
                const data = { bestScore };
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timestamp: Date.now(),
                    body: JSON.stringify(data)
                }
                // send the PUT data to the database
                // then store the response data and print in the console
                const response = await fetch('/api', options);
                const json = await response.json();
                console.log("Put message:");
                console.log(json);
            }
        }
    }
}

// 
// Makes the time string that is displayed on the webpage
// 
function makeTimeString(time){
    // convert milliseconds to minutes, seconds, and milliseconds
    var minutes = Math.floor(time / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);
    var milliseconds = time % 1000;

    // add leading zeros if necessary
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    milliseconds = milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds;

    return minutes + ':' + seconds + ':' + milliseconds;
}