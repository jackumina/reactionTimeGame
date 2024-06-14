const Header = () => {

    // start on click function (just changes layout then sends signal to start timer?)

    return (
        <div className="headerDiv">
            <div className="headerText">
                <h1>Welcome to the Reaction Timer Game</h1>
                <h3>How to play: Click the start button below and when the screen 
                flashes green click your space bar as fast as you can!</h3>
            </div>
            <div className="startButtonDiv">
                <button className="startButton">Start</button>
            </div>
        </div>
    );
}
 
export default Header;