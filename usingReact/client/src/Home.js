import { useRef, useEffect, useState } from "react";
import axios from 'axios';

const Home = () => {

    const [isDisabled, setIsDisabled] = useState(false);
    const [color, setColor] = useState('black');
    const buttonRef = useRef(null); // Ref to get the button element

    const [currentTime, setCurrentTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [bestScore, setBestScore] = useState(0);
    const [dbEmpty, setDbEmpty] = useState(false);
    const [bestScoreIsZero, setBestScoreIsZero] = useState(false);
    const [firstRun, setFirstRun] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);
    const [justReset, setJustReset] = useState(false);


    // get data from api on page reload
    useEffect(() => {
        const fetchData = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5000ms = 5 seconds

            try {

                const response = await fetch('/api', { signal: controller.signal });
                clearTimeout(timeoutId); // Clear the timeout if the fetch is successful
        
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
        
                const data = await response.json();
                if (data && data.length > 0) {
                    const item = data[0];
                    setBestScore(item.bestScore);
                } else {
                    setDbEmpty(true);
                    setBestScoreIsZero(true);
                }

                setDataFetched(true);
                
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error('Fetch aborted due to timeout');
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        };
    
        fetchData();
    }, []);

    // useEffect to post or put data when currentScore < bestScore
    useEffect(() => {
    
        const sendData = async (method) => {
            console.log('justReset: ' + justReset);
            if(!isRunning && !bestScoreIsZero && !firstRun && !justReset){
                const data = { bestScore, timeStamp: Date.now() };
                console.log('Sending data:', data);

                try {
                    const response = await axios({
                        method: method,
                        url: '/api',
                        data
                    });
                    console.log('Success:', response.data);
                    setDbEmpty(false);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        const method = dbEmpty ? 'post' : 'put';
        sendData(method);

    }, [bestScore, dbEmpty, bestScoreIsZero, isRunning, firstRun, justReset]);


    // function to delete data when reset button is clicked
    const resetButtonClicked = async () => {
        const response = await axios.delete('/api');
        console.log(response.data);
        setBestScore(0);
        setBestScoreIsZero(true);
        setDbEmpty(true);
        setFirstRun(true);
        setJustReset(true);
    };



    // start on click function
    const startTimer = () => {

        setIsRunning(true);
        setCurrentTime(0);
        setIsDisabled(true); // Disable the start button
        
        if (buttonRef.current) {
            buttonRef.current.blur(); // Blur the last clicked button
        }

        // apply green background color to body
        document.body.style.backgroundColor = '#00A36C';
        // make text white
        setColor('white');
    };

    // Function to handle keydown event
    const stopTimer = (event) => {
        if(isRunning){
            if (event.code === 'Space') {

                setIsRunning(false);
                setIsDisabled(false);
                
                if(justReset){
                    setJustReset(false);
                }

                document.body.style.backgroundColor = 'white';
                setColor('black');
            }
        }
    };
    // Add event listener for keydown
    window.addEventListener('keydown', stopTimer);



    // timer and bestScore setter useEffects
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setCurrentTime(prevTime => prevTime + 1);
                if (bestScoreIsZero && firstRun) {
                    setBestScore(prevTime => prevTime + 1);
                }
            }, 1);
        } else {
          clearInterval(timer);
        }
    
        return () => clearInterval(timer);
    }, [isRunning, bestScore, firstRun, bestScoreIsZero]);
    
    useEffect(() => {
        if (!isRunning && currentTime > 0 && !justReset) {
            if (bestScore === 0 || currentTime < bestScore) {
                setBestScore(currentTime);
            }
            if (firstRun) {
                setFirstRun(false); // After the first run, mark it as false
                setBestScoreIsZero(false);
            }
        }
    }, [isRunning, currentTime, bestScore, firstRun, justReset]);



    return (
        <div className="page">

            { !dataFetched ? (

                <p className="loadingTag">Loading...</p>

            ) : (
                    
                <div className="homeDiv">

                    <div className="headerDiv">
                        <div className="headerText" style={{ color: color }}>
                            <h1>Welcome to the Reaction Timer Game</h1>
                            <h3>How to play: Click the start button below and when the screen 
                            flashes green click your space bar as fast as you can!</h3>
                        </div>
                        <div className="startButtonDiv">
                            <button className="startButton" ref={buttonRef}
                                onClick={startTimer} disabled={isDisabled}>Start</button>
                        </div>
                    </div>

                    <div className="bestScoreDiv">
                        <div className="bestScoreText" style={{ color: color }}>
                            <p>Best Score:<br/>{makeTimeString(bestScore)}</p>
                        </div>
                        <div className="resetButtonDiv">
                            <button className="resetButton" ref={buttonRef}
                                onClick={resetButtonClicked} disabled={isDisabled}>Reset Score</button>
                        </div>
                    </div>

                    <div className="timerDiv" style={{ color: color }}>
                        <h2 className="timer">{makeTimeString(currentTime)}</h2>
                    </div>

                </div>

            )}

        </div>
    );
}
 
export default Home;


////////////////
// Functions
////////////////
// 
// Makes the time string that is displayed on the webpage
// 
function makeTimeString(time) {
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