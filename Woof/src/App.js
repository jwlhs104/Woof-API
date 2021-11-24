import './App.css';
import React from 'react';
import Dog from './components/pages/dog'
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

function getLibrary(provider){
  return new Web3(provider)
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <header className="App-header">
          <Dog/>
        </header>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
