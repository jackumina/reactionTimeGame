import { useState } from 'react';

const Timer = () => {

    const [time, setTime] = useState('00:00:00');

    return (
        <div className="timerDiv">
            <h2 className="timer">
                {time}
            </h2>
        </div>
    );
}
 
export default Timer;