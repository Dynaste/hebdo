import React from 'react';
import LoginView from './views/LoginView';

function App() {
  return (
    <div className="App">
      <p>{process.env.REACT_APP_END_POINT}</p>
      <LoginView />
    </div>
  );
}

export default App;
