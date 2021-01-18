import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ProgramItem from './ProgramItem';
import { useAuth } from '../contexts/AuthContext';
import { getUserPrograms, deleteProgram } from '../api/api';
import '../style/Programs.css';

function Programs() {
    const [programs, setPrograms] = useState([]);
    const { currentUser } = useAuth();
    const history = useHistory();

    useEffect(() => {
        // Get user's programs when component mounts
        async function fetchUserPrograms() {
            const data = await getUserPrograms(currentUser.token);
            setPrograms(data.resultSet);
        }

        fetchUserPrograms();
    }, [])

    async function handleDeleteProgram(programId) {
        const res = await deleteProgram(currentUser.token, programId);
        //TODO  Check status from server to catch errors
        // Update list of programs in state
        setPrograms(programs.filter(program => program.id !== programId));
    }

    return (
        <div>
            <h2>Programs</h2>
            <button className='btn btn-primary' onClick={() => history.push('/buildprogram')}>Build program</button>
            <div className='programList'>
                {programs.map(program => <ProgramItem
                    key={program.id}
                    program={program}
                    onDeleteProgram={handleDeleteProgram}
                    />)}
            </div>
        </div>
    )
}

export default Programs
