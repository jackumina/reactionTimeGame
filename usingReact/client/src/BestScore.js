import { useEffect, useState } from 'react';

const BestScore = () => {

    const [bestScore, setBestScore] = useState('00:00:00');

    useEffect(() => {
        fetch('/api')
        .then( res => {
            return res.json();
        })
        .then( data => {
            if(data && data.length > 0) {
                setBestScore(data.bestScore);
            }
        });
    }, []);

    // post if bestScore = 00:00:00
    // put if timer is better than current bestScore

    // delete if reset button is clicked

    return (
        <div className="bestScoreDiv">
            <div className="bestScoreText">
                <p>Best Score:<br/> {bestScore}</p>
            </div>
            <div className="resetButtonDiv">
                <button className="resetButton">Reset Score</button>
            </div>
        </div>
    );
    
}
 
export default BestScore;