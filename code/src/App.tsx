import React from 'react';
import logo from './logo.svg';
import './App.css';
import {HelloWorld} from './HelloWorld'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
// import {ipcRenderer} from 'electron'

const App = () => {
  const foo = () => {
    console.log('foo')
    // ipcRenderer.send('foo')
    return 'foo'
  }


  return (
      <Router>
        <Routes>
        <Route path='/' element={
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                Learn React
              </a>
              <p>{foo()}</p>
            </header>
          </div>
        } />
          <Route path='/test' element={<HelloWorld />} />
        </Routes>
      </Router>



  );
}

export default App;
