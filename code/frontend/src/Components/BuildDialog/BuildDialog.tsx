import {FC, useEffect, useState} from 'react'
import {Scene} from './Scene'
import {Package} from './Package'
import {PreferencesContainer, StyledPreferences } from '../StyledComponents/Preferences/StyledPreferences'
import { Button } from '../StyledComponents/Button'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react'

export const BuildDialog: FC = () => {
    const [scenes, setScenes] = useState<any[]>([])
    const [packages, setPackages] = useState<any[]>([])

    const toggleSceneSelected = (sceneFileName: string) => {
        setScenes(scenes.map(scene => {
            if(scene.sceneFileName === sceneFileName) {
                return {
                    ...scene,
                    isSelected: !scene.isSelected
                }
            }
            return scene
        }))
    }

    const togglePackageSelected = (packageName: string) => {
        setPackages(packages.map(packageItem => {
            if(packageItem.packageName === packageName) {
                return {
                    ...packageItem,
                    isSelected: !packageItem.isSelected
                }
            }
            return packageItem
        }))
    }

    const getSelectedSceneNames = () => {
        return scenes.filter(item => item.isSelected)
                     .map(scene => scene.sceneFileName)
    }

    const getSelectedPackages = () => {
        return packages.filter(item => item.mandatory || item.isSelected)
    }

    const loadScenes = async () => {
        const sceneFileNames = await api.invoke(api.channels.toMain.queryScenes)
        setScenes(sceneFileNames.map(sceneFileName => {
            return ({isSelected: true, sceneFileName})
        }))
    }

    const loadPackages = async () => {
        const packages = await api.invoke(api.channels.toMain.queryPackages)
        setPackages(packages)
    }

    const build = async () => {
        await api.invoke(api.channels.toMain.createUnityProject, getSelectedSceneNames(), getSelectedPackages())
        await api.invoke(api.channels.toMain.buildUnityProject)
        await api.invoke(api.channels.toMain.openBuildDirectory)
    }

    useEffect(() => {
        loadScenes()
        loadPackages()
    }, [])

    return (
        <StyledPreferences>
            <h1>Build Settings</h1>

            <PreferencesContainer>

                <div>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Scenes</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>Packages</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion disabled>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography>Disabled Accordion</Typography>
                        </AccordionSummary>
                    </Accordion>
                </div>



            <h4>Scenes</h4>

                {
                scenes.map(({isSelected, sceneFileName}) => (
                    <Scene key={sceneFileName} isSelected={isSelected} sceneFileName={sceneFileName} toggleFunction={toggleSceneSelected}/>
                ))
            }

            <br/>
            <h4>Packages</h4>

            {packages.map((p) => (
                <Package key={p.name}
                         name={p.name}
                         displayName={p.displayName}
                         version={p.version}
                         description={p.description}
                         isSelected={p.isSelected}
                         mandatory={p.mandatory}
                         toggleFunction={togglePackageSelected}/>
            ))}

            <br/>
            <div id="package-list"></div>
            <br/>
            <Button id="btn-build-project" type="button" onClick={build}>Build</Button>
            </PreferencesContainer>
        </StyledPreferences>
    )
}
