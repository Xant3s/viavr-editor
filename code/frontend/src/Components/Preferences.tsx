import {FC} from 'react'
import './Preferences.css'

export const Preferences: FC = () => {
    return (
        <>
            <h1>Preferences</h1>
            <br />

            <div className={'preference-entry'}>
                <label htmlFor={'dark-mode'}>Theme:</label>
                <select id={'dark-mode'} name={'dark-mode'} onChange={() => {}} >
                    <option value={'System'}>System</option>
                    <option value={'Dark'}>Dark</option>
                    <option value={'Light'}>Light</option>
                </select>
            </div>

            <div className={'preference-entry'}>
                <label htmlFor={'unity-path'}>Path to Unity executable:</label>
                <input id={'unity-path'} type={'text'} name={'unity-path'}  />
                <button id={'btn-select-unity-path'}>Select</button>
            </div>

            <div className="preference-entry">
                <label htmlFor="package-registry-name">Package registry name:</label>
                <input id="package-registry-name" type="text" /><br/>
            </div>

            <div className="preference-entry">
                <label htmlFor="package-registry-url">Package registry url:</label>
                <input id="package-registry-url" type="text" /><br/>
            </div>

            <div className="preference-entry">
                <label htmlFor="package-registry-scope">Package registry scope:</label>
                <input id="package-registry-scope" type="text" /><br/>
            </div>
        </>
    )
}
