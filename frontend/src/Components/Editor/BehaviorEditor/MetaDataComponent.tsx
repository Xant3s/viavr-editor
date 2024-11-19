import { SettingAccordionMeta } from '../../Settings/SettingAccordion'
import { IconButton, CrossIcon } from 'evergreen-ui'

const MetaDataComponent = (props) => {
    return (
        <SettingAccordionMeta
            summary={props.meta["name"]} 
            onClose={() => props.OnClose()}   
            details={
                <div>
                    <h3>Tags</h3> 
                    {props.meta.tags.map((tag, index) => (
                        <div key={index} style={{display:'flex', alignItems:'center'}}>
                            <div style={{textAlign:'left', float:'left', marginLeft:'75px', width:'320px'}}>
                                <p>
                                    {tag}
                                        <div style={{alignItems:'right', float:'right', marginRight:'1Spx'}}>
                                            <IconButton icon={CrossIcon} color="muted" cursor="pointer" onClick={() => props.removeTagFunction(props.meta, tag)} />
                                        </div>
                                    
                                </p>
                            </div>
                </div>
                ))}
                </div>
            }
        />
    )
}

export default MetaDataComponent