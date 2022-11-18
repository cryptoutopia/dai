import React from 'react';
import logo from './logo.svg';
import DaiTxn from './components/ddtx.js';

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        These are the lates 100 DAI transactions on ETH mainnet
      </h1>
    
      <DaiTxn />
    </div>
  );
}

export default App;
