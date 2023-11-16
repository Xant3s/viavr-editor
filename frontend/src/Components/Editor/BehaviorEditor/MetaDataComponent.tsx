import { useState } from 'react';
import { SettingAccordion } from '../../Settings/SettingAccordion'
import { TextInput } from 'evergreen-ui';
import { Meta } from '../../../@types/Behaviors'

const MetaDataComponent = (props) => {

    const [meta, setMeta] = useState<Meta>(props.meta)

    function updateTags(tags) {
        meta.tags = tags
        props.callback(meta)
    }

    return (
        <SettingAccordion
            summary={props.meta["name"]}    
            details={
                <div>
                    Tags: {meta.tags.map((tag, index) => (
                        <div key={index}>
                            <p>
                                {tag["name"]}
                            </p>
                </div>
                ))}
                </div>
            }
        />
    )
}

export default MetaDataComponent