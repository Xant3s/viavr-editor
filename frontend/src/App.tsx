import './App.css'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Preferences } from './Components/Preferences/Preferences'
import { BuildDialog } from './Components/BuildDialog/BuildDialog'
import { Editor } from './Components/Editor/Editor'
import { ProjectSettings } from './Components/ProjectSettings/ProjectSettings'
import { PanelsPrototype } from './Components/PanelsPrototype'
import { TabsPrototype } from './Components/TabsPrototype'
import { FloorMapEditor } from './Components/FloorMapEditor/FloorMapEditor'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Editor />} />
                <Route path='/index' element={<Editor />} />
                <Route path='/preferences' element={<Preferences />} />
                <Route path='/project-settings' element={<ProjectSettings />} />
                <Route path='/build-dialog' element={<BuildDialog />} />
                <Route path='/panels-prototype' element={<PanelsPrototype />} />
                <Route path='/tabs-prototype' element={<TabsPrototype />} />
                <Route path='/floor-map-editor' element={<FloorMapEditor />} />
            </Routes>
        </Router>
    )
}

export default App
