import './App.css';
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import {HelloWorld} from './Components/HelloWorld'
import {Preferences } from './Components/Preferences';

const App = () => {

  return (
      <Router>
        <Routes>
          <Route path='/' element={<HelloWorld/>}/>
          <Route path='/preferences' element={<Preferences/>}/>
        </Routes>
      </Router>
  );
}

export default App;
