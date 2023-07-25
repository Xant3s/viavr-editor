import { DragEvent } from 'react'
import triggerImg from './trigger.png'
import styles from './dnd.module.css'

const onDragStart = (event: DragEvent, nodeType: string) => {
    const imageSrc = triggerImg.toString()
    event.dataTransfer.setData('application/reactflow', nodeType)
    const img = new Image()
    img.src = imageSrc
    event.dataTransfer.setDragImage(img, 0, 0)
    event.dataTransfer.effectAllowed = 'move'
}

export const Sidebar = () => {
    return (
        <aside className={styles.aside}>
            <div className={styles.description}>
                Click and drag to place triggers onto the floor map:
            </div>
            <div
                className={styles.node}
                onDragStart={(event: DragEvent) =>
                    onDragStart(event, 'trigger')
                }
                draggable
            >
                <img src={triggerImg} alt="trigger" className={styles.icon} />
                <div className={styles.label}>Trigger</div>
            </div>
            <div className={styles.description}>
                You can delete selected triggers by pressing backspace.
            </div>
            <div className={styles.description}>
                Once a trigger is placed, you can click on it to edit its properties.
            </div>
        </aside>
    )
}
