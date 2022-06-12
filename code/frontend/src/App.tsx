import './App.css';
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import {Preferences} from './Components/Preferences/Preferences';
import {BuildDialog} from './Components/BuildDialog/BuildDialog';
import {Editor} from './Components/Editor/Editor'
import {ProjectSettings} from './Components/ProjectSettings/ProjectSettings'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Editor/>}/>
                <Route path='/preferences' element={<Preferences/>}/>
                <Route path='/project-settings' element={<ProjectSettings/>}/>
                <Route path='/build-dialog' element={<BuildDialog/>}/>
            </Routes>
        </Router>
    );
}

export default App;
