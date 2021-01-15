import React from 'react';
import '../style/ProgramItem.css';
import { useHistory } from 'react-router-dom';

function ProgramItem({ 
    program
}) {
    const { id, name, createdAt } = program;
    const history = useHistory();
    
    return (
        <div className='programItem' onClick={() => history.push(`/programs/${id}`)}>
            <p className='programItem__name'>{name}</p>
            <p className='programItem__createdAt'>{createdAt}</p>
        </div>
    )
}

export default ProgramItem
