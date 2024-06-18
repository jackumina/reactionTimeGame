import { useRef, useEffect, useState } from "react";
// import axios from 'axios';

const Home = () => {

    const [isDisabled, setIsDisabled] = useState(false);
    const [color, setColor] = useState('black');
    const buttonRef = useRef(null); // Ref to get the button element

    const [currentTime, setCurrentTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [bestScore, setBestScore] = useState(0);
    const [dbEmpty, setDbEmpty] = useState(false);
    const [bestScoreIsZero, setBestScoreIsZero] = useState(false);

    const [dataFetched, setDataFetched] = useState(false);


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
                    setBestScore(makeTimeString(data.bestScore));
                } else {
                    setDbEmpty(true);
                    setBestScoreIsZero(true);
                }
                
                setDataFetched(true);

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error('Fetch aborted due to timeout');
                    alert('Fetch aborted due to timeout \n Please refresh page');
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        let time;
        console.log(bestScore);
        if(isRunning){
          time = setInterval(() => {
            setCurrentTime(prevTime => prevTime + 1);
            if(bestScoreIsZero){
                console.log('in here');
                setBestScore(prevTime => prevTime + 1);
            }
          }, 1);
        }
    
        // console.log('Timer is at:', currentTime);
        // if(currentTime < bestScore || bestScoreIsZero){
        //     setBestScore(currentTime);
        //     setBestScoreIsZero(false);
        //     // sendBestScore();
        // }
        // console.log('bestScore is: ' + bestScore);

        return () => {
            clearInterval(time);
        };
    }, [isRunning, currentTime, bestScore, bestScoreIsZero]);

    const sendBestScore = async () => {
        
        // if (currentTime < bestScore || bestScore === 0) {
        //     // setBestScore(finalTime);
        //     const method = dbEmpty ? 'post' : 'put';
        //     // sendData(method);
        //     console.log(method);
        // }

        const method = dbEmpty ? 'post' : 'put';
        sendData(method);
        console.log(method);

        const sendData = async (method) => {
            // const data = { bestScore, timeStamp: Date.now() };
            // console.log(data);

            // try {
            //     const response = await axios({
            //     method: method,
            //     url: '/api',
            //     data: data,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     });
            //     console.log('Success:', response.data);
            // } catch (error) {
            //     console.error('Error:', error);
            // }

            // setDbEmpty(false);
        };
    };

    // start on click function (just changes layout then sends signal to start timer?)
    const startTimer = () => {

        setIsRunning(true);
        setCurrentTime(0);
        // setBestScore(100);
        // startTimer();
        setIsDisabled(true); // Disable the button
        
        if (buttonRef.current) {
            buttonRef.current.blur(); // Blur the button
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

                document.body.style.backgroundColor = 'white';
                setColor('black');
            }
        }
    }

    // Add event listener for keydown
    window.addEventListener('keydown', stopTimer);


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
                                disabled={isDisabled}>Reset Score</button>
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