import { useEffect, useState } from 'react';
import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Meta } from '../../../@types/Behaviors'

const MetaDataComponent = (props) => {

    const [meta, setMeta] = useState<Meta>(props.meta)

    function updateTags(tags) {
        meta.tags = tags
        props.callback(meta)
    }

    useEffect(() => {
        console.log(props.meta)
    }, [props])


    return (
        <SettingAccordion
            summary={props.meta["name"]}    
            details={
                <div>
                    Tags: {props.meta.tags.map((tag, index) => (
                        <div key={index}>
                            <p>
                                {tag}
                            </p>
                </div>
                ))}
                </div>
            }
        />
    )
}

export default MetaDataComponent