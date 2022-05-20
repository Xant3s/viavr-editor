import './App.css';
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import {HelloWorld} from './Components/HelloWorld'
import {Preferences} from './Components/Preferences';
import {BuildDialog} from './Components/BuildDialog/BuildDialog';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HelloWorld/>}/>
                <Route path='/preferences' element={<Preferences/>}/>
                <Route path='/build-dialog' element={<BuildDialog/>}/>
            </Routes>
        </Router>
    );
}

export default App;
