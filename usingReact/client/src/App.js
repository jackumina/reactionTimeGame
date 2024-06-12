import {useEffect, useState} from 'react';
import './App.css';

function App() {

  const [backendData, setBackendData] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch('/api').then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data);
        setIsPending(false);
      }
    );
  }, [] );

  return (
    <div className="App">

      { isPending && <p>Loading...</p> }
      { backendData && backendData.users.map((user, index) => (
        <p key={index}>{user}</p>
      )) }

    </div>
  );
}

export default App;