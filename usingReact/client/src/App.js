import Header from './Header';
import BestScore from './BestScore';
import Timer from './Timer';

function App() {

  // where does space bar on click code go?
  
  return (
    <div className="App">

      <div className="header">
        <Header />
      </div>
      <div className="bestScore">
        <BestScore />
      </div>
      <div className="timer">
        <Timer />
      </div>

    </div>
  );

}

export default App;