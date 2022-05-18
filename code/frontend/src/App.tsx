import {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {HelloWorld} from './HelloWorld'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

const App = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const response = await window.api.invoke('toMain', 'asd')
      setData(response)
    }

    getData()
  }, [])



  const foo = () => {
    console.log('foo')
    if(window.api === undefined) {
      // If only React is running without Electron, the context bridge is not available.
      // So create a dummy API object.
      window.api = {
        invoke(channel: string, data: any): Promise<any> {
          return Promise.resolve(undefined);
        }, send: () => {}, on: () => {}}
    }
    window.api.send('toMain', 'foo')

    return data
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
