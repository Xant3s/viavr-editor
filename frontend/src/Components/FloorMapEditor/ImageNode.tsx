import styled from 'styled-components'

export const ImageNode = ({ data }) => {
    const id = data['id']
    const src = data['label']
    const type = data['type']
    const showTriggerConfigEditor = data['showNoteConfigEditor']
    return <StyledImg src={src} alt="" onClick={() => showTriggerConfigEditor(id)} />
}

const StyledImg = styled.img`
    display: block;
    width: 50%;
    height: 50%;
    object-fit: cover;
    cursor: move;
    opacity: 1;
    border: none;
    transition: opacity 0.3s ease-in-out, border 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:hover {
        opacity: 1;
        cursor: move;
        transform: scale(1.1);
    }

    &:active {
        opacity: 0.8;
        transform: scale(0.9);
        transition: transform 0.1s ease-in-out;
    }
`
