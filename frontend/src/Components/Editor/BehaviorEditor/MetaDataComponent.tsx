import { useEffect, useState } from 'react';
import { SettingAccordion } from '../../Settings/SettingAccordion'
import { IconButton, CrossIcon } from 'evergreen-ui'
import { Meta } from '../../../@types/Behaviors'

const MetaDataComponent = (props) => {


    return (
        <SettingAccordion
            summary={props.meta["name"]}    
            details={
                <div>
                    Tags: {props.meta.tags.map((tag, index) => (
                        <div key={index}>
                            <p>
                                {tag}
                                <IconButton icon={CrossIcon} color="muted" cursor="pointer" onClick={() => props.removeTagFunction(props.meta, tag)} />
                            </p>
                </div>
                ))}
                </div>
            }
        />
    )
}

export default MetaDataComponent